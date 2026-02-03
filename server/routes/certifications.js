import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import path from 'path';
import { verifyToken } from '../middleware/auth.js';
import { readData, writeData } from '../utils/storage.js';
import { optimizeImage } from '../utils/imageOptimizer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = join(__dirname, '../uploads/certifications');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'cert-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// GET all certifications (public)
router.get('/public', async (req, res) => {
    try {
        const data = await readData();
        const certifications = data.certifications || [];
        res.json(certifications);
    } catch (error) {
        console.error('Error fetching certifications:', error);
        res.status(500).json({ error: 'Failed to fetch certifications' });
    }
});

// GET all certifications (admin)
router.get('/', verifyToken, async (req, res) => {
    try {
        const data = await readData();
        const certifications = data.certifications || [];
        res.json({ certifications });
    } catch (error) {
        console.error('Error fetching certifications:', error);
        res.status(500).json({ error: 'Failed to fetch certifications' });
    }
});

// POST new certification
router.post('/upload', verifyToken, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Generate output path for optimized image
        const outputPath = req.file.path.replace(path.extname(req.file.path), '.webp');
        
        // Optimize the uploaded image
        const optimizedResult = await optimizeImage(req.file.path, outputPath, {
            maxWidth: 1200,
            maxHeight: 1600,
            quality: 85
        });

        const data = await readData();
        if (!data.certifications) {
            data.certifications = [];
        }

        // Use the optimized filename
        const optimizedFilename = path.basename(optimizedResult.optimizedPath);

        const certification = {
            id: Date.now().toString(),
            filename: optimizedFilename,
            url: `/uploads/certifications/${optimizedFilename}`,
            title: req.body.title || '',
            uploadedAt: new Date().toISOString()
        };

        data.certifications.push(certification);
        await writeData(data);

        res.json({ 
            success: true, 
            certification,
            message: 'Certification uploaded successfully' 
        });
    } catch (error) {
        console.error('Error uploading certification:', error);
        // Clean up file if it was uploaded
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Failed to upload certification' });
    }
});

// DELETE certification
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const data = await readData();
        
        if (!data.certifications) {
            return res.status(404).json({ error: 'Certifications not found' });
        }

        const certIndex = data.certifications.findIndex(cert => cert.id === id);
        
        if (certIndex === -1) {
            return res.status(404).json({ error: 'Certification not found' });
        }

        const certification = data.certifications[certIndex];
        
        // Delete the file
        const filePath = join(__dirname, '..', certification.url);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        data.certifications.splice(certIndex, 1);
        await writeData(data);

        res.json({ 
            success: true, 
            message: 'Certification deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting certification:', error);
        res.status(500).json({ error: 'Failed to delete certification' });
    }
});

// UPDATE certification title
router.patch('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const data = await readData();
        
        if (!data.certifications) {
            return res.status(404).json({ error: 'Certifications not found' });
        }

        const certIndex = data.certifications.findIndex(cert => cert.id === id);
        
        if (certIndex === -1) {
            return res.status(404).json({ error: 'Certification not found' });
        }

        data.certifications[certIndex].title = title;
        await writeData(data);

        res.json({ 
            success: true, 
            certification: data.certifications[certIndex],
            message: 'Certification updated successfully' 
        });
    } catch (error) {
        console.error('Error updating certification:', error);
        res.status(500).json({ error: 'Failed to update certification' });
    }
});

export default router;

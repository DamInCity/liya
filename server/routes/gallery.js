import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { verifyToken } from '../middleware/auth.js';
import { readData, writeData } from '../utils/storage.js';
import { optimizeUploadedImage } from '../utils/imageOptimizer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

// Configure multer for gallery uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = join(__dirname, '../uploads/gallery');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'gallery-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed'));
    }
});

// Image optimization options
const galleryOptimizeOptions = {
    maxWidth: 2400,
    maxHeight: 2400,
    maxSizeKB: 300,
    quality: 85
};

// GET all gallery images (public endpoint for client)
router.get('/public', async (req, res) => {
    try {
        const db = await readData();
        const gallery = db.gallery || [];
        
        // Sort by upload date, newest first
        gallery.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
        
        res.json(gallery);
    } catch (error) {
        console.error('Error fetching gallery:', error);
        res.status(500).json({ error: 'Failed to fetch gallery images' });
    }
});

// GET all gallery images (admin endpoint)
router.get('/', verifyToken, async (req, res) => {
    try {
        const db = await readData();
        const gallery = db.gallery || [];
        
        // Sort by upload date, newest first
        gallery.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
        
        res.json(gallery);
    } catch (error) {
        console.error('Error fetching gallery:', error);
        res.status(500).json({ error: 'Failed to fetch gallery images' });
    }
});

// POST upload images to gallery
router.post('/upload', 
    verifyToken, 
    upload.array('images', 20),
    optimizeUploadedImage(galleryOptimizeOptions),
    async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const db = await readData();
        if (!db.gallery) {
            db.gallery = [];
        }

        const uploadedImages = [];

        for (const file of req.files) {
            // File is already optimized and converted to webp by middleware
            const imageData = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                filename: file.filename,
                originalName: file.originalname,
                url: `/uploads/gallery/${file.filename}`,
                uploadedAt: new Date().toISOString()
            };

            db.gallery.push(imageData);
            uploadedImages.push(imageData);
        }

        await writeData(db);

        res.json(uploadedImages);
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({ error: 'Failed to upload images' });
    }
});

// DELETE gallery image
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const db = await readData();

        if (!db.gallery) {
            return res.status(404).json({ error: 'Gallery not found' });
        }

        const imageIndex = db.gallery.findIndex(img => img.id === id);
        
        if (imageIndex === -1) {
            return res.status(404).json({ error: 'Image not found' });
        }

        const image = db.gallery[imageIndex];

        // Delete the physical file
        const filePath = join(__dirname, '../uploads/gallery', image.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Remove from database
        db.gallery.splice(imageIndex, 1);
        await writeData(db);

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

// GET gallery stats
router.get('/stats', verifyToken, async (req, res) => {
    try {
        const db = await readData();
        const gallery = db.gallery || [];
        
        const stats = {
            totalImages: gallery.length,
            recentUploads: gallery.slice(0, 5).map(img => ({
                id: img.id,
                originalName: img.originalName,
                uploadedAt: img.uploadedAt
            }))
        };
        
        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

export default router;

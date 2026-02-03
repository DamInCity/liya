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

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = join(dirname(__dirname), 'uploads', 'images');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit (before optimization)
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

// Image optimization options
const imageOptimizeOptions = {
    maxWidth: 1920,
    maxHeight: 1920,
    maxSizeKB: 200,
    quality: 80
};

// GET /api/images - Get all images with metadata
router.get('/', async (req, res) => {
    try {
        const data = await readData();
        res.json({ images: data.images || [] });
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});

// POST /api/images - Upload new image (protected)
router.post('/', verifyToken, upload.single('image'), optimizeUploadedImage(imageOptimizeOptions), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const { section, alt, caption } = req.body;
        
        const imageData = {
            id: Date.now().toString(),
            filename: req.file.filename,
            originalName: req.file.originalname,
            url: `/uploads/images/${req.file.filename}`,
            section: section || 'general',
            alt: alt || '',
            caption: caption || '',
            uploadedAt: new Date().toISOString()
        };

        const data = await readData();
        if (!data.images) data.images = [];
        data.images.push(imageData);
        await writeData(data);

        res.status(201).json({ 
            success: true, 
            image: imageData 
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// PUT /api/images/:id - Update image metadata (protected)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { section, alt, caption } = req.body;

        const data = await readData();
        const imageIndex = data.images.findIndex(img => img.id === id);

        if (imageIndex === -1) {
            return res.status(404).json({ error: 'Image not found' });
        }

        data.images[imageIndex] = {
            ...data.images[imageIndex],
            section: section || data.images[imageIndex].section,
            alt: alt !== undefined ? alt : data.images[imageIndex].alt,
            caption: caption !== undefined ? caption : data.images[imageIndex].caption,
            updatedAt: new Date().toISOString()
        };

        await writeData(data);

        res.json({ 
            success: true, 
            image: data.images[imageIndex] 
        });
    } catch (error) {
        console.error('Error updating image:', error);
        res.status(500).json({ error: 'Failed to update image' });
    }
});

// DELETE /api/images/:id - Delete image (protected)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        const data = await readData();
        const imageIndex = data.images.findIndex(img => img.id === id);

        if (imageIndex === -1) {
            return res.status(404).json({ error: 'Image not found' });
        }

        const image = data.images[imageIndex];
        
        // Delete file from disk
        const filePath = join(dirname(__dirname), 'uploads', 'images', image.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Remove from database
        data.images.splice(imageIndex, 1);
        await writeData(data);

        res.json({ 
            success: true, 
            message: 'Image deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

// POST /api/images/replace/:id - Replace existing image file (protected)
router.post('/replace/:id', verifyToken, upload.single('image'), optimizeUploadedImage(imageOptimizeOptions), async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const data = await readData();
        const imageIndex = data.images.findIndex(img => img.id === id);

        if (imageIndex === -1) {
            return res.status(404).json({ error: 'Image not found' });
        }

        const oldImage = data.images[imageIndex];

        // Delete old file
        const oldFilePath = join(dirname(__dirname), 'uploads', 'images', oldImage.filename);
        if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
        }

        // Update with new file
        data.images[imageIndex] = {
            ...oldImage,
            filename: req.file.filename,
            originalName: req.file.originalname,
            url: `/uploads/images/${req.file.filename}`,
            updatedAt: new Date().toISOString()
        };

        await writeData(data);

        res.json({ 
            success: true, 
            image: data.images[imageIndex] 
        });
    } catch (error) {
        console.error('Error replacing image:', error);
        res.status(500).json({ error: 'Failed to replace image' });
    }
});

export default router;

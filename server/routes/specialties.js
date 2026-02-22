import express from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import { verifyToken } from '../middleware/auth.js';
import { readData, writeData } from '../utils/storage.js';
import { optimizeImage } from '../utils/imageOptimizer.js';
import fs from 'fs/promises';

const router = express.Router();

// Configure multer for specialty background images
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = 'uploads/specialties';
        try {
            await fs.mkdir(uploadDir, { recursive: true });
            cb(null, uploadDir);
        } catch (error) {
            cb(error, uploadDir);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'specialty-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// GET /api/specialties - Get all specialties/services
router.get('/', async (req, res) => {
    try {
        const data = await readData();
        res.json({ specialties: data.specialties || [] });
    } catch (error) {
        console.error('Error fetching specialties:', error);
        res.status(500).json({ error: 'Failed to fetch specialties' });
    }
});

// POST /api/specialties - Create new specialty (protected)
router.post('/', 
    verifyToken,
    upload.single('backgroundImage'),
    async (req, res) => {
        // Manual validation to handle both JSON and FormData
        const { title, description, icon } = req.body;
        
        if (!title || !title.trim()) {
            return res.status(400).json({ error: 'Title is required' });
        }
        
        if (!description || !description.trim()) {
            return res.status(400).json({ error: 'Description is required' });
        }

        try {
            let backgroundImage = null;

            // Handle background image if uploaded
            if (req.file) {
                try {
                    const optimizedPath = await optimizeImage(req.file.path);
                    backgroundImage = '/uploads/specialties/' + path.basename(optimizedPath);
                } catch (error) {
                    console.error('Error optimizing image:', error);
                    // Use original if optimization fails
                    backgroundImage = '/uploads/specialties/' + req.file.filename;
                }
            }
                    // Use original if optimization fails
                    backgroundImage = '/uploads/specialties/' + req.file.filename;
                }
            }

            const specialty = {
                id: Date.now().toString(),
                title,
                description,
                icon: icon || '',
                backgroundImage,
                createdAt: new Date().toISOString()
            };

            const data = await readData();
            if (!data.specialties) data.specialties = [];
            data.specialties.push(specialty);
            await writeData(data);

            res.status(201).json({ 
                success: true, 
                specialty 
            });
        } catch (error) {
            console.error('Error creating specialty:', error);
            res.status(500).json({ error: 'Failed to create specialty' });
        }
    }
);

// PUT /api/specialties/:id - Update specialty (protected)
router.put('/:id',
    verifyToken,
    upload.single('backgroundImage'),
    async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, icon } = req.body;

            const data = await readData();
            const specialtyIndex = data.specialties.findIndex(s => s.id === id);

            if (specialtyIndex === -1) {
                return res.status(404).json({ error: 'Specialty not found' });
            }

            let backgroundImage = data.specialties[specialtyIndex].backgroundImage;

            // Handle new background image if uploaded
            if (req.file) {
                try {
                    const optimizedPath = await optimizeImage(req.file.path);
                    backgroundImage = '/uploads/specialties/' + path.basename(optimizedPath);
                    
                    // Delete old background image if it exists
                    if (data.specialties[specialtyIndex].backgroundImage) {
                        const oldImagePath = path.join(process.cwd(), data.specialties[specialtyIndex].backgroundImage);
                        try {
                            await fs.unlink(oldImagePath);
                        } catch (err) {
                            console.error('Error deleting old background image:', err);
                        }
                    }
                } catch (error) {
                    console.error('Error optimizing image:', error);
                    // Use original if optimization fails
                    backgroundImage = '/uploads/specialties/' + req.file.filename;
                }
            }

            data.specialties[specialtyIndex] = {
                ...data.specialties[specialtyIndex],
                title: title || data.specialties[specialtyIndex].title,
                description: description || data.specialties[specialtyIndex].description,
                icon: icon !== undefined ? icon : data.specialties[specialtyIndex].icon,
                backgroundImage,
                updatedAt: new Date().toISOString()
            };

            await writeData(data);

            res.json({ 
                success: true, 
                specialty: data.specialties[specialtyIndex] 
            });
        } catch (error) {
            console.error('Error updating specialty:', error);
            res.status(500).json({ error: 'Failed to update specialty' });
        }
    }
);

// DELETE /api/specialties/:id - Delete specialty (protected)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        const data = await readData();
        const specialtyIndex = data.specialties.findIndex(s => s.id === id);

        if (specialtyIndex === -1) {
            return res.status(404).json({ error: 'Specialty not found' });
        }

        data.specialties.splice(specialtyIndex, 1);
        await writeData(data);

        res.json({ 
            success: true, 
            message: 'Specialty deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting specialty:', error);
        res.status(500).json({ error: 'Failed to delete specialty' });
    }
});

export default router;

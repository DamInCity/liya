import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { body, validationResult } from 'express-validator';
import { verifyToken } from '../middleware/auth.js';
import { readData, writeData } from '../utils/storage.js';
import { optimizeUploadedImage } from '../utils/imageOptimizer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for project images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = join(dirname(__dirname), 'uploads', 'projects');
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
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit (before optimization)
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

// GET /api/projects - Get all projects
router.get('/', async (req, res) => {
    try {
        const data = await readData();
        res.json({ projects: data.projects || [] });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// GET /api/projects/:id - Get single project
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await readData();
        const project = data.projects?.find(p => p.id === id);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({ project });
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

// POST /api/projects - Create new project (protected)
router.post('/',
    verifyToken,
    upload.array('images', 10), // Allow up to 10 images
    optimizeUploadedImage(imageOptimizeOptions),
    [
        body('title').trim().notEmpty().withMessage('Title is required'),
        body('description').trim().notEmpty().withMessage('Description is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { title, description, category, tags, link } = req.body;

            // Process uploaded images
            const images = req.files ? req.files.map(file => ({
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                filename: file.filename,
                originalName: file.originalname,
                url: `/uploads/projects/${file.filename}`,
                uploadedAt: new Date().toISOString()
            })) : [];

            const project = {
                id: Date.now().toString(),
                title,
                description,
                category: category || '',
                tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
                link: link || '',
                images,
                createdAt: new Date().toISOString()
            };

            const data = await readData();
            if (!data.projects) data.projects = [];
            data.projects.push(project);
            await writeData(data);

            res.status(201).json({ 
                success: true, 
                project 
            });
        } catch (error) {
            console.error('Error creating project:', error);
            res.status(500).json({ error: 'Failed to create project' });
        }
    }
);

// PUT /api/projects/:id - Update project info (protected)
router.put('/:id',
    verifyToken,
    [
        body('title').optional().trim().notEmpty(),
        body('description').optional().trim().notEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { id } = req.params;
            const { title, description, category, tags, link } = req.body;

            const data = await readData();
            const projectIndex = data.projects.findIndex(p => p.id === id);

            if (projectIndex === -1) {
                return res.status(404).json({ error: 'Project not found' });
            }

            data.projects[projectIndex] = {
                ...data.projects[projectIndex],
                title: title || data.projects[projectIndex].title,
                description: description || data.projects[projectIndex].description,
                category: category !== undefined ? category : data.projects[projectIndex].category,
                tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : data.projects[projectIndex].tags,
                link: link !== undefined ? link : data.projects[projectIndex].link,
                updatedAt: new Date().toISOString()
            };

            await writeData(data);

            res.json({ 
                success: true, 
                project: data.projects[projectIndex] 
            });
        } catch (error) {
            console.error('Error updating project:', error);
            res.status(500).json({ error: 'Failed to update project' });
        }
    }
);

// POST /api/projects/:id/images - Add images to project (protected)
router.post('/:id/images',
    verifyToken,
    upload.array('images', 10),
    optimizeUploadedImage(imageOptimizeOptions),
    async (req, res) => {
        try {
            const { id } = req.params;

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: 'No image files provided' });
            }

            const data = await readData();
            const projectIndex = data.projects.findIndex(p => p.id === id);

            if (projectIndex === -1) {
                return res.status(404).json({ error: 'Project not found' });
            }

            const newImages = req.files.map(file => ({
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                filename: file.filename,
                originalName: file.originalname,
                url: `/uploads/projects/${file.filename}`,
                uploadedAt: new Date().toISOString()
            }));

            if (!data.projects[projectIndex].images) {
                data.projects[projectIndex].images = [];
            }
            data.projects[projectIndex].images.push(...newImages);
            data.projects[projectIndex].updatedAt = new Date().toISOString();

            await writeData(data);

            res.status(201).json({ 
                success: true, 
                images: newImages,
                project: data.projects[projectIndex]
            });
        } catch (error) {
            console.error('Error adding images to project:', error);
            res.status(500).json({ error: 'Failed to add images' });
        }
    }
);

// DELETE /api/projects/:projectId/images/:imageId - Delete single image from project (protected)
router.delete('/:projectId/images/:imageId', verifyToken, async (req, res) => {
    try {
        const { projectId, imageId } = req.params;

        const data = await readData();
        const projectIndex = data.projects.findIndex(p => p.id === projectId);

        if (projectIndex === -1) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const project = data.projects[projectIndex];
        const imageIndex = project.images?.findIndex(img => img.id === imageId);

        if (imageIndex === -1 || imageIndex === undefined) {
            return res.status(404).json({ error: 'Image not found' });
        }

        const image = project.images[imageIndex];

        // Delete file from disk
        const filePath = join(dirname(__dirname), 'uploads', 'projects', image.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Remove from project
        project.images.splice(imageIndex, 1);
        project.updatedAt = new Date().toISOString();

        await writeData(data);

        res.json({ 
            success: true, 
            message: 'Image deleted successfully',
            project
        });
    } catch (error) {
        console.error('Error deleting image from project:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

// DELETE /api/projects/:id - Delete entire project (protected)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        const data = await readData();
        const projectIndex = data.projects.findIndex(p => p.id === id);

        if (projectIndex === -1) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const project = data.projects[projectIndex];

        // Delete all project images from disk
        if (project.images && project.images.length > 0) {
            project.images.forEach(image => {
                const filePath = join(dirname(__dirname), 'uploads', 'projects', image.filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
        }

        // Remove project from database
        data.projects.splice(projectIndex, 1);
        await writeData(data);

        res.json({ 
            success: true, 
            message: 'Project deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

export default router;

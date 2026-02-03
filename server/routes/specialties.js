import express from 'express';
import { body, validationResult } from 'express-validator';
import { verifyToken } from '../middleware/auth.js';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

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
            const { title, description, icon } = req.body;

            const specialty = {
                id: Date.now().toString(),
                title,
                description,
                icon: icon || '',
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
            const { title, description, icon } = req.body;

            const data = await readData();
            const specialtyIndex = data.specialties.findIndex(s => s.id === id);

            if (specialtyIndex === -1) {
                return res.status(404).json({ error: 'Specialty not found' });
            }

            data.specialties[specialtyIndex] = {
                ...data.specialties[specialtyIndex],
                title: title || data.specialties[specialtyIndex].title,
                description: description || data.specialties[specialtyIndex].description,
                icon: icon !== undefined ? icon : data.specialties[specialtyIndex].icon,
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

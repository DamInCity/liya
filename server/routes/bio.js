import express from 'express';
import { readData, writeData } from '../utils/storage.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get bio information (public)
router.get('/public', async (req, res) => {
    try {
        const data = await readData();
        res.json(data.bio || {});
    } catch (error) {
        console.error('Error fetching bio:', error);
        res.status(500).json({ error: 'Failed to fetch bio' });
    }
});

// Update bio information (protected)
router.put('/', verifyToken, async (req, res) => {
    try {
        const { name, title, description, location } = req.body;
        
        if (!name || !title || !description || !location) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const data = await readData();
        data.bio = {
            name,
            title,
            description,
            location
        };

        await writeData(data);
        res.json(data.bio);
    } catch (error) {
        console.error('Error updating bio:', error);
        res.status(500).json({ error: 'Failed to update bio' });
    }
});

export default router;

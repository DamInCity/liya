import express from 'express';
import { readData, writeData } from '../utils/storage.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get stats (public)
router.get('/public', async (req, res) => {
    try {
        const data = await readData();
        res.json(data.stats || {});
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// Update stats (protected)
router.put('/', verifyToken, async (req, res) => {
    try {
        const { languages, height, weight, bust, waist, hips, shoeSize, hairColor, eyeColor, skinTone } = req.body;
        
        const data = await readData();
        data.stats = {
            languages: languages || '',
            height: height || '',
            weight: weight || '',
            bust: bust || '',
            waist: waist || '',
            hips: hips || '',
            shoeSize: shoeSize || '',
            hairColor: hairColor || '',
            eyeColor: eyeColor || '',
            skinTone: skinTone || ''
        };

        await writeData(data);
        res.json(data.stats);
    } catch (error) {
        console.error('Error updating stats:', error);
        res.status(500).json({ error: 'Failed to update stats' });
    }
});

export default router;

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { verifyToken } from '../middleware/auth.js';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// POST /api/auth/login - Admin login
router.post('/login',
    [
        body('username').trim().notEmpty().withMessage('Username is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { username, password } = req.body;

            // Read credentials from db.json first, fallback to .env
            const data = await readData();
            let storedUsername = process.env.ADMIN_USERNAME || 'admin';
            let storedPassword = process.env.ADMIN_PASSWORD || 'admin123';

            if (data.adminCredentials) {
                storedUsername = data.adminCredentials.username || storedUsername;
                storedPassword = data.adminCredentials.password || storedPassword;
            }

            // Debug logging
            console.log('Login attempt:', { username, password: '***' });
            console.log('Expected:', { storedUsername, storedPassword: '***' });
            console.log('Match:', username === storedUsername && password === storedPassword);

            // Check username and password (plain text comparison)
            if (username !== storedUsername || password !== storedPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { username, role: 'admin' },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                token,
                user: { username, role: 'admin' }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Login failed' });
        }
    }
);

// POST /api/auth/hash-password - Utility endpoint to hash a password (development only)
router.post('/hash-password', async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'Not available in production' });
    }

    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    const hash = await bcrypt.hash(password, 10);
    res.json({ hash });
});

// POST /api/auth/change-credentials - Change admin username and/or password
router.post('/change-credentials', verifyToken, [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newUsername').optional().trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('newPassword').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { currentPassword, newUsername, newPassword } = req.body;

        const data = await readData();
        
        // Get current credentials from db.json or .env
        let currentUsername = process.env.ADMIN_USERNAME;
        let currentPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (data.adminCredentials) {
            currentUsername = data.adminCredentials.username || currentUsername;
            currentPasswordHash = data.adminCredentials.passwordHash || currentPasswordHash;
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, currentPasswordHash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Initialize adminCredentials if it doesn't exist
        if (!data.adminCredentials) {
            data.adminCredentials = {
                username: currentUsername,
                passwordHash: currentPasswordHash
            };
        }

        let updated = false;
        let finalUsername = currentUsername;

        // Update username if provided
        if (newUsername && newUsername !== currentUsername) {
            data.adminCredentials.username = newUsername;
            finalUsername = newUsername;
            updated = true;
        }

        // Update password if provided
        if (newPassword) {
            const newHash = await bcrypt.hash(newPassword, 10);
            data.adminCredentials.passwordHash = newHash;
            updated = true;
        }

        if (updated) {
            await writeData(data);

            // Generate new token with updated username
            const newToken = jwt.sign(
                { username: finalUsername, role: 'admin' },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                message: 'Credentials updated successfully',
                token: newToken
            });
        } else {
            res.json({
                success: false,
                message: 'No changes were made'
            });
        }
    } catch (error) {
        console.error('Change credentials error:', error);
        res.status(500).json({ error: 'Failed to change credentials' });
    }
});

export default router;

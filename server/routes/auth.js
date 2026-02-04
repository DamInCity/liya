import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { verifyToken } from '../middleware/auth.js';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

/**
 * AUTHENTICATION FLOW - SINGLE SOURCE OF TRUTH
 * ============================================
 * 
 * 1. On server startup (storage.js):
 *    - If db.json has no adminCredentials → copy from .env to db.json
 * 
 * 2. After initialization:
 *    - .env is NEVER checked again
 *    - db.json is the ONLY source of truth
 *    - All login attempts check db.json only
 *    - All password changes update db.json only
 * 
 * 3. Password storage:
 *    - Plain text (no bcrypt)
 *    - Stored in db.json adminCredentials.password
 */

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

            // SINGLE SOURCE OF TRUTH: db.json only
            const data = await readData();
            
            // Safety check - adminCredentials must exist (initialized on server startup)
            if (!data.adminCredentials) {
                console.error('❌ adminCredentials not found in db.json - database not initialized properly');
                return res.status(500).json({ error: 'Server configuration error' });
            }
            
            // Get credentials from db.json ONLY
            const storedUsername = data.adminCredentials.username;
            const storedPassword = data.adminCredentials.password;

            // Check username and password (plain text comparison)
            if (username !== storedUsername || password !== storedPassword) {
                console.log('❌ Login failed:', { username, expected: storedUsername });
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            
            console.log('✅ Login successful:', { username });

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

        // SINGLE SOURCE OF TRUTH: db.json only
        const data = await readData();
        
        // Safety check - adminCredentials must exist
        if (!data.adminCredentials) {
            console.error('❌ adminCredentials not found in db.json');
            return res.status(500).json({ error: 'Server configuration error' });
        }
        
        // Get current credentials from db.json ONLY
        const currentUsername = data.adminCredentials.username;
        const currentStoredPassword = data.adminCredentials.password;

        // Verify current password (plain text comparison)
        if (currentPassword !== currentStoredPassword) {
            console.log('❌ Current password incorrect');
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        let updated = false;
        let finalUsername = currentUsername;

        // Update username if provided
        if (newUsername && newUsername !== currentUsername) {
            data.adminCredentials.username = newUsername;
            finalUsername = newUsername;
            updated = true;
        }

        // Update password if provided (store as plain text)
        if (newPassword) {
            data.adminCredentials.password = newPassword;
            updated = true;
        }

        if (updated) {
            await writeData(data);
            console.log('✅ Credentials updated in db.json:', { username: finalUsername, passwordChanged: !!newPassword });

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

import express from 'express';
import { body, validationResult } from 'express-validator';
import { sendContactEmail } from '../utils/email.js';

const router = express.Router();

// POST /api/contact - Send contact form email
router.post('/',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('phone').trim().notEmpty().withMessage('Phone number is required'),
        body('message').trim().notEmpty().withMessage('Message is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, email, phone, message } = req.body;
            
            await sendContactEmail({ name, email, phone, message });
            
            res.status(200).json({ 
                success: true, 
                message: 'Email sent successfully' 
            });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ 
                error: 'Failed to send email',
                message: error.message 
            });
        }
    }
);

export default router;

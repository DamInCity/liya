import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Import routes
import contactRoutes from './routes/contact.js';
import authRoutes from './routes/auth.js';
import imageRoutes from './routes/images.js';
import specialtiesRoutes from './routes/specialties.js';
import projectsRoutes from './routes/projects.js';
import galleryRoutes from './routes/gallery.js';
import certificationsRoutes from './routes/certifications.js';
import bioRoutes from './routes/bio.js';
import statsRoutes from './routes/stats.js';

// Import storage utilities
import { initializeDatabase } from './utils/storage.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files
const uploadsDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/specialties', specialtiesRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/certifications', certificationsRoutes);
app.use('/api/bio', bioRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Initialize database and start server
const startServer = async () => {
    try {
        await initializeDatabase();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📧 Email configured: ${process.env.EMAIL_USER || 'Not configured'}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

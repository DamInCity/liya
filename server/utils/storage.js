import fs from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(dirname(__dirname), 'data', 'db.json');

// Initialize default data structure
const DEFAULT_DATA = {
    images: [],
    specialties: [
        {
            id: '1',
            title: 'Runway',
            description: 'High fashion runway shows for international designers',
            icon: '👗',
            createdAt: new Date().toISOString()
        },
        {
            id: '2',
            title: 'Editorial',
            description: 'Magazine spreads and editorial photography',
            icon: '📸',
            createdAt: new Date().toISOString()
        },
        {
            id: '3',
            title: 'Commercial',
            description: 'Brand campaigns and commercial advertising',
            icon: '💼',
            createdAt: new Date().toISOString()
        }
    ],
    projects: []
};

// Ensure data directory and file exist
async function ensureDataFile() {
    try {
        const dataDir = join(dirname(__dirname), 'data');
        
        // Create data directory if it doesn't exist
        try {
            await fs.access(dataDir);
        } catch {
            await fs.mkdir(dataDir, { recursive: true });
        }

        // Create db.json if it doesn't exist
        try {
            await fs.access(DB_PATH);
        } catch {
            await fs.writeFile(DB_PATH, JSON.stringify(DEFAULT_DATA, null, 2));
        }
    } catch (error) {
        console.error('Error ensuring data file:', error);
        throw error;
    }
}

// Read data from JSON file
export async function readData() {
    try {
        await ensureDataFile();
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data:', error);
        return DEFAULT_DATA;
    }
}

// Write data to JSON file
export async function writeData(data) {
    try {
        await ensureDataFile();
        await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing data:', error);
        throw error;
    }
}

// Initialize database on first run
export async function initializeDatabase() {
    await ensureDataFile();
    
    // SINGLE SOURCE OF TRUTH: Initialize admin credentials from .env ONCE
    // After this, .env is never checked again - db.json becomes the only source
    const data = await readData();
    if (!data.adminCredentials) {
        data.adminCredentials = {
            username: process.env.ADMIN_USERNAME || 'admin',
            password: process.env.ADMIN_PASSWORD || 'L1yajj@251'
        };
        await writeData(data);
        console.log('✅ Admin credentials initialized from .env → db.json');
        console.log(`   Username: ${data.adminCredentials.username}`);
    } else {
        console.log('✅ Admin credentials already exist in db.json');
        console.log(`   Username: ${data.adminCredentials.username}`);
    }
    
    console.log('✅ Database initialized');
}

#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, 'public/liya/liya-hero.png');
const OUTPUT_FILE = path.join(__dirname, 'public/liya/liya-hero-optimized.png');
const BACKUP_FILE = path.join(__dirname, 'public/liya/liya-hero-original.png');
const TARGET_SIZE_KB = 300;
const TARGET_SIZE_BYTES = TARGET_SIZE_KB * 1024;

async function optimizeImage() {
    try {
        // Check if input file exists
        if (!fs.existsSync(INPUT_FILE)) {
            console.error(`Error: Input file not found: ${INPUT_FILE}`);
            process.exit(1);
        }

        // Get original file size
        const originalStats = fs.statSync(INPUT_FILE);
        const originalSizeKB = (originalStats.size / 1024).toFixed(2);
        console.log(`Original file size: ${originalSizeKB} KB`);

        if (originalStats.size <= TARGET_SIZE_BYTES) {
            console.log(`✓ File is already under ${TARGET_SIZE_KB}KB. No optimization needed.`);
            return;
        }

        // Get image metadata
        const metadata = await sharp(INPUT_FILE).metadata();
        console.log(`Original dimensions: ${metadata.width}x${metadata.height}`);

        // Strategy: Try different compression levels and resizing until we hit target
        let quality = 90;
        let width = metadata.width;
        let optimized = false;

        console.log('\nOptimizing image...');

        // First try: Compress with high quality
        while (quality >= 60 && !optimized) {
            const buffer = await sharp(INPUT_FILE)
                .png({
                    quality: quality,
                    compressionLevel: 9,
                    palette: true, // Use palette-based PNG for smaller file
                    effort: 10 // Maximum compression effort
                })
                .toBuffer();

            const sizeKB = (buffer.length / 1024).toFixed(2);
            console.log(`  Quality ${quality}: ${sizeKB} KB`);

            if (buffer.length <= TARGET_SIZE_BYTES) {
                fs.writeFileSync(OUTPUT_FILE, buffer);
                console.log(`✓ Optimized to ${sizeKB} KB (quality: ${quality})`);
                optimized = true;
                break;
            }

            quality -= 10;
        }

        // Second try: Resize the image if compression alone didn't work
        if (!optimized) {
            console.log('\nCompression alone insufficient. Trying resize...');
            width = Math.floor(metadata.width * 0.9);

            while (width >= metadata.width * 0.5 && !optimized) {
                const buffer = await sharp(INPUT_FILE)
                    .resize(width, null, {
                        fit: 'inside',
                        withoutEnlargement: true
                    })
                    .png({
                        quality: 80,
                        compressionLevel: 9,
                        palette: true,
                        effort: 10
                    })
                    .toBuffer();

                const sizeKB = (buffer.length / 1024).toFixed(2);
                console.log(`  Width ${width}px: ${sizeKB} KB`);

                if (buffer.length <= TARGET_SIZE_BYTES) {
                    fs.writeFileSync(OUTPUT_FILE, buffer);
                    console.log(`✓ Optimized to ${sizeKB} KB (width: ${width}px)`);
                    optimized = true;
                    break;
                }

                width = Math.floor(width * 0.9);
            }
        }

        // Third try: Convert to WebP as fallback (better compression)
        if (!optimized) {
            console.log('\nTrying WebP format for better compression...');
            const webpOutput = OUTPUT_FILE.replace('.png', '.webp');
            const webpInput = INPUT_FILE.replace('.png', '.webp');
            
            quality = 80;
            while (quality >= 50 && !optimized) {
                const buffer = await sharp(INPUT_FILE)
                    .resize(Math.floor(metadata.width * 0.8), null, {
                        fit: 'inside',
                        withoutEnlargement: true
                    })
                    .webp({ 
                        quality: quality, 
                        effort: 6,
                        alphaQuality: 100, // Preserve transparency quality
                        lossless: false
                    })
                    .toBuffer();

                const sizeKB = (buffer.length / 1024).toFixed(2);
                console.log(`  WebP quality ${quality}: ${sizeKB} KB`);

                if (buffer.length <= TARGET_SIZE_BYTES) {
                    fs.writeFileSync(webpOutput, buffer);
                    console.log(`✓ Optimized to ${sizeKB} KB as WebP (quality: ${quality})`);
                    
                    // Backup original PNG
                    console.log('\nBacking up original file...');
                    fs.copyFileSync(INPUT_FILE, BACKUP_FILE);
                    console.log(`Backup created: ${path.basename(BACKUP_FILE)}`);
                    
                    // Replace PNG with WebP
                    console.log('\nReplacing original with optimized WebP version...');
                    fs.copyFileSync(webpOutput, webpInput);
                    fs.unlinkSync(webpOutput);
                    
                    console.log('\n=== Optimization Complete ===');
                    console.log(`Original size: ${originalSizeKB} KB (PNG)`);
                    console.log(`Final size: ${sizeKB} KB (WebP)`);
                    const reduction = ((1 - buffer.length / originalStats.size) * 100).toFixed(1);
                    console.log(`Size reduction: ${reduction}%`);
                    console.log(`Output file: liya-hero.webp`);
                    console.log(`Backup: ${path.basename(BACKUP_FILE)}`);
                    console.log(`\n⚠ Important: Update Hero.tsx to use "liya/liya-hero.webp" instead of "liya/liya-hero.png"`);
                    
                    optimized = true;
                    return;
                }

                quality -= 10;
            }
        }

        if (!optimized) {
            console.error(`\n✗ Could not optimize image to under ${TARGET_SIZE_KB}KB`);
            console.log('  Consider manually reducing image dimensions or using a different image.');
            process.exit(1);
        }

        // Create backup and replace original
        console.log('\nBacking up original file...');
        fs.copyFileSync(INPUT_FILE, BACKUP_FILE);
        console.log(`Backup created: ${path.basename(BACKUP_FILE)}`);

        console.log('\nReplacing original with optimized version...');
        fs.copyFileSync(OUTPUT_FILE, INPUT_FILE);
        console.log(`✓ Original file replaced with optimized version`);

        // Clean up temp file
        fs.unlinkSync(OUTPUT_FILE);

        // Final stats
        const finalStats = fs.statSync(INPUT_FILE);
        const finalSizeKB = (finalStats.size / 1024).toFixed(2);
        const reduction = ((1 - finalStats.size / originalStats.size) * 100).toFixed(1);

        console.log('\n=== Optimization Complete ===');
        console.log(`Original size: ${originalSizeKB} KB`);
        console.log(`Final size: ${finalSizeKB} KB`);
        console.log(`Size reduction: ${reduction}%`);
        console.log(`Backup: ${path.basename(BACKUP_FILE)}`);

    } catch (error) {
        console.error('Error during optimization:', error.message);
        process.exit(1);
    }
}

optimizeImage().catch(error => {
    console.error('Error during optimization:', error.message);
    process.exit(1);
});

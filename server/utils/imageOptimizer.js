import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

/**
 * Optimize and convert image to WebP format
 * - Converts to WebP
 * - Resizes if larger than maxWidth/maxHeight
 * - Compresses to stay under maxSizeKB
 * @param {string} inputPath - Path to input image
 * @param {string} outputPath - Path to save optimized image (optional, defaults to same name with .webp)
 * @param {object} options - Optimization options
 * @returns {Promise<object>} - Result with file info
 */
export async function optimizeImage(inputPath, outputPath = null, options = {}) {
    const {
        maxWidth = 1920,
        maxHeight = 1920,
        maxSizeKB = 200,
        quality = 80
    } = options;

    try {
        // Generate output path if not provided
        if (!outputPath) {
            const parsed = path.parse(inputPath);
            outputPath = path.join(parsed.dir, `${parsed.name}.webp`);
        }

        // Get image metadata
        const metadata = await sharp(inputPath).metadata();
        
        // Calculate resize dimensions while maintaining aspect ratio
        let width = metadata.width;
        let height = metadata.height;

        if (width > maxWidth || height > maxHeight) {
            const widthRatio = maxWidth / width;
            const heightRatio = maxHeight / height;
            const ratio = Math.min(widthRatio, heightRatio);
            
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
        }

        // Start with initial quality
        let currentQuality = quality;
        let outputBuffer;
        let fileSize;

        // Compress until under maxSizeKB
        do {
            outputBuffer = await sharp(inputPath)
                .resize(width, height, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .webp({
                    quality: currentQuality,
                    effort: 6 // Higher effort = better compression
                })
                .toBuffer();

            fileSize = outputBuffer.length / 1024; // Size in KB

            // Reduce quality if still too large
            if (fileSize > maxSizeKB && currentQuality > 10) {
                currentQuality -= 5;
            } else {
                break;
            }
        } while (fileSize > maxSizeKB && currentQuality > 10);

        // Save the optimized image
        await sharp(outputBuffer).toFile(outputPath);

        // Delete original if it's not already webp
        if (inputPath !== outputPath && path.extname(inputPath).toLowerCase() !== '.webp') {
            try {
                fs.unlinkSync(inputPath);
            } catch (err) {
                console.warn('Could not delete original file:', err.message);
            }
        }

        return {
            success: true,
            originalPath: inputPath,
            optimizedPath: outputPath,
            originalSize: metadata.size,
            optimizedSize: fileSize,
            width,
            height,
            quality: currentQuality,
            savings: metadata.size ? ((1 - fileSize * 1024 / metadata.size) * 100).toFixed(2) + '%' : '0%'
        };

    } catch (error) {
        console.error('Error optimizing image:', error);
        throw new Error(`Image optimization failed: ${error.message}`);
    }
}

/**
 * Optimize multiple images
 * @param {string[]} inputPaths - Array of input image paths
 * @param {object} options - Optimization options
 * @returns {Promise<object[]>} - Array of results
 */
export async function optimizeImages(inputPaths, options = {}) {
    const results = [];
    
    for (const inputPath of inputPaths) {
        try {
            const result = await optimizeImage(inputPath, null, options);
            results.push(result);
        } catch (error) {
            results.push({
                success: false,
                originalPath: inputPath,
                error: error.message
            });
        }
    }
    
    return results;
}

/**
 * Middleware to optimize uploaded images
 * Use after multer middleware
 */
export function optimizeUploadedImage(options = {}) {
    return async (req, res, next) => {
        if (!req.file && !req.files) {
            return next();
        }

        try {
            // Single file upload
            if (req.file) {
                const result = await optimizeImage(req.file.path, null, options);
                
                // Update req.file with new info
                req.file.path = result.optimizedPath;
                req.file.filename = path.basename(result.optimizedPath);
                req.file.size = result.optimizedSize * 1024;
            }

            // Multiple files upload
            if (req.files && Array.isArray(req.files)) {
                for (let i = 0; i < req.files.length; i++) {
                    const result = await optimizeImage(req.files[i].path, null, options);
                    
                    // Update req.files with new info
                    req.files[i].path = result.optimizedPath;
                    req.files[i].filename = path.basename(result.optimizedPath);
                    req.files[i].size = result.optimizedSize * 1024;
                }
            }

            next();
        } catch (error) {
            console.error('Error in image optimization middleware:', error);
            next(error);
        }
    };
}

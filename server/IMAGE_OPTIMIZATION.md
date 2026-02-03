# Image Optimization

All uploaded images are automatically optimized using Sharp.

## Features

- ✅ **Auto-convert to WebP** - Best compression format
- ✅ **Size limit: 200KB max** - Fast page loads
- ✅ **Smart resize** - Max 1920x1920px
- ✅ **Quality optimization** - Automatic quality adjustment
- ✅ **Original deletion** - Old files removed after optimization

## How It Works

### Automatic Optimization

When you upload an image through:
- Admin dashboard → Projects
- Admin dashboard → Images
- API endpoints

The image is automatically:
1. Resized if larger than 1920x1920px (maintains aspect ratio)
2. Converted to WebP format
3. Compressed to stay under 200KB
4. Quality reduced if needed (starts at 80%)
5. Original file deleted

### Configuration

Edit `server/utils/imageOptimizer.js`:

```javascript
const imageOptimizeOptions = {
    maxWidth: 1920,      // Maximum width in pixels
    maxHeight: 1920,     // Maximum height in pixels
    maxSizeKB: 200,      // Maximum file size in KB
    quality: 80          // Starting quality (0-100)
};
```

### Example

**Before optimization:**
- Format: PNG
- Size: 2.5 MB
- Dimensions: 3000x2000px

**After optimization:**
- Format: WebP
- Size: 180 KB (92% reduction)
- Dimensions: 1920x1280px
- Quality: 75%

## Manual Optimization

You can also optimize existing images:

```javascript
import { optimizeImage } from './utils/imageOptimizer.js';

// Optimize single image
const result = await optimizeImage(
    '/path/to/image.jpg',  // Input
    '/path/to/output.webp', // Output (optional)
    {
        maxSizeKB: 200,
        quality: 80
    }
);

console.log(result);
// {
//   success: true,
//   optimizedSize: 180,
//   savings: '92.8%'
// }
```

## Why WebP?

- **30% smaller** than JPEG at same quality
- **26% smaller** than PNG
- **Supported** by all modern browsers
- **Fast loading** - Better user experience
- **SEO boost** - Google PageSpeed loves it

## Browser Support

- Chrome: ✅
- Firefox: ✅
- Safari: ✅ (iOS 14+, macOS 11+)
- Edge: ✅
- Opera: ✅

## Fallback Images

If you need fallback for very old browsers, keep original images separately. But for modern web, WebP is the standard.

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Lightbox } from '../ui/Lightbox';

// Color hues for flower petals - creates rainbow effect
const petalHues = [
    'rgba(162, 89, 255, 0.6)',   // Purple
    'rgba(255, 89, 162, 0.6)',   // Pink
    'rgba(89, 162, 255, 0.6)',   // Blue
    'rgba(255, 162, 89, 0.6)',   // Orange
    'rgba(89, 255, 162, 0.6)',   // Teal
    'rgba(255, 89, 89, 0.6)',    // Red
    'rgba(162, 255, 89, 0.6)',   // Lime
    'rgba(89, 255, 255, 0.6)',   // Cyan
    'rgba(255, 255, 89, 0.6)',   // Yellow
    'rgba(200, 89, 255, 0.6)',   // Violet
    'rgba(255, 150, 200, 0.6)',  // Light Pink
    'rgba(89, 200, 255, 0.6)',   // Sky Blue
    'rgba(255, 200, 89, 0.6)',   // Gold
    'rgba(150, 255, 200, 0.6)',  // Mint
    'rgba(200, 150, 255, 0.6)',  // Lavender
];

interface FlowerImage {
    id: string;
    url: string;
    filename: string;
}

interface FlowerGalleryProps {
    images?: FlowerImage[];
}

export const FlowerGallery = ({ images: propImages }: FlowerGalleryProps) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [flowerImages, setFlowerImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchGalleryImages = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
                
                const response = await fetch(`${apiUrl}/gallery/public`);
                
                if (response.ok) {
                    const galleryData = await response.json();
                    if (galleryData && galleryData.length > 0) {
                        // Use gallery images
                        const imageUrls = galleryData.slice(0, 15).map((img: FlowerImage) => `${backendUrl}${img.url}`);
                        setFlowerImages(imageUrls);
                    } else {
                        // No images in gallery, use empty array
                        setFlowerImages([]);
                    }
                } else {
                    // Failed to fetch, use empty array
                    setFlowerImages([]);
                }
            } catch (error) {
                console.error('Error fetching gallery images:', error);
                setFlowerImages([]);
            } finally {
                setLoading(false);
            }
        };

        // If images passed as props, use them
        if (propImages && propImages.length > 0) {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
            setFlowerImages(propImages.map(img => `${backendUrl}${img.url}`));
            setLoading(false);
        } else {
            // Fetch from gallery API
            fetchGalleryImages();
        }
    }, [propImages]);

    if (loading) {
        return (
            <section
                id="flower-gallery"
                className="py-16 md:py-24 lg:py-32 relative overflow-hidden"
                style={{ backgroundColor: 'var(--bg-main)' }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
                    <p style={{ color: 'var(--text-muted)' }}>Loading gallery...</p>
                </div>
            </section>
        );
    }

    if (flowerImages.length === 0) {
        return (
            <section
                id="flower-gallery"
                className="py-16 md:py-24 lg:py-32 relative overflow-hidden"
                style={{ backgroundColor: 'var(--bg-main)' }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
                    <p style={{ color: 'var(--text-muted)' }}>No images in gallery yet</p>
                </div>
            </section>
        );
    }

    const imageCount = Math.min(flowerImages.length, 15); // Max 15 petals
    const angleStep = 360 / imageCount;
    
    // Radius based on screen size - using relative units
    const radius = 120; // Will be scaled with transform

    const handleImageClick = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const handleCloseLightbox = () => {
        setLightboxOpen(false);
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % flowerImages.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + flowerImages.length) % flowerImages.length);
    };

    return (
        <section
            id="flower-gallery"
            className="py-16 md:py-20 lg:py-24 relative overflow-hidden"
            style={{ backgroundColor: 'var(--bg-main)' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-label tracking-[0.3em] text-xs uppercase mb-4 block"
                        style={{ color: 'var(--accent)' }}
                    >
                        Gallery
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl sm:text-3xl md:text-4xl font-normal italic"
                        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}
                    >
                        Moments in <span className="not-italic">Focus</span>
                    </motion.h2>
                </div>

                {/* Flower Container */}
                <div className="relative flex justify-center items-center min-h-[400px] sm:min-h-[500px] md:min-h-[600px]">
                    {/* Center decoration */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="absolute w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full z-20 flex items-center justify-center"
                        style={{ 
                            background: 'radial-gradient(circle, var(--accent) 0%, rgba(162, 89, 255, 0.3) 100%)',
                            boxShadow: '0 0 60px rgba(162, 89, 255, 0.5)'
                        }}
                    >
                        <span className="text-2xl sm:text-3xl">✦</span>
                    </motion.div>

                    {/* Flower Petals */}
                    {flowerImages.slice(0, imageCount).map((image, index) => {
                        const angle = index * angleStep - 90; // Start from top
                        const isHovered = hoveredIndex === index;
                        const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index;
                        
                        // Calculate position
                        const x = Math.cos((angle * Math.PI) / 180) * radius;
                        const y = Math.sin((angle * Math.PI) / 180) * radius;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ 
                                    opacity: 1, 
                                    scale: 1,
                                    x: `${x}%`,
                                    y: `${y}%`,
                                }}
                                viewport={{ once: true }}
                                transition={{ 
                                    delay: index * 0.08,
                                    duration: 0.5,
                                    type: "spring",
                                    stiffness: 100
                                }}
                                whileHover={{
                                    scale: 1.3,
                                    zIndex: 50,
                                    x: `${x * 1.15}%`,
                                    y: `${y * 1.15}%`,
                                    transition: { duration: 0.3 }
                                }}
                                whileTap={{ scale: 1.2 }}
                                animate={isOtherHovered ? {
                                    scale: 0.85,
                                    opacity: 0.5,
                                } : {}}
                                onHoverStart={() => setHoveredIndex(index)}
                                onHoverEnd={() => setHoveredIndex(null)}
                                onClick={() => handleImageClick(index)}
                                className="absolute cursor-pointer"
                                style={{
                                    zIndex: isHovered ? 50 : 10,
                                    transformOrigin: 'center center',
                                }}
                                data-cursor="link"
                            >
                                <div
                                    className="w-[80px] h-[100px] sm:w-[100px] sm:h-[130px] md:w-[120px] md:h-[160px] rounded-xl overflow-hidden border relative"
                                    style={{
                                        borderColor: isHovered ? 'var(--accent)' : 'var(--border-subtle)',
                                        boxShadow: isHovered 
                                            ? `0 20px 40px -10px rgba(162, 89, 255, 0.5)` 
                                            : '0 10px 30px -5px rgba(0, 0, 0, 0.3)',
                                        transform: `rotate(${angle + 90}deg)`, // Point outward
                                    }}
                                >
                                    <img
                                        src={image}
                                        alt={`Gallery ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        style={{
                                            transform: `rotate(${-(angle + 90)}deg) scale(1.5)`, // Counter-rotate image
                                        }}
                                    />
                                    
                                    {/* Color Hue Overlay - hidden on hover */}
                                    <motion.div
                                        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                                        style={{
                                            backgroundColor: petalHues[index % petalHues.length],
                                            opacity: isHovered ? 0 : 0.4,
                                            mixBlendMode: 'overlay'
                                        }}
                                    />
                                    
                                    {/* Gradient overlay for depth */}
                                    <div 
                                        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                                        style={{
                                            background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.4) 100%)',
                                            opacity: isHovered ? 0.3 : 0.6
                                        }}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Hint text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1 }}
                    className="text-center mt-8 font-label tracking-[0.2em] text-xs uppercase"
                    style={{ color: 'var(--text-muted)' }}
                >
                    Click to view · Hover to explore
                </motion.p>
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <Lightbox
                    images={flowerImages}
                    currentIndex={currentImageIndex}
                    onClose={handleCloseLightbox}
                    onNext={handleNextImage}
                    onPrev={handlePrevImage}
                />
            )}
        </section>
    );
};

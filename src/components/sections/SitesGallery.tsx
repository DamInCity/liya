import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Lightbox } from '../ui/Lightbox';
import { getProjects } from '../../services/api';

interface ProjectImage {
    id: string;
    url: string;
    filename: string;
    originalName: string;
}

interface Project {
    id: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    images: ProjectImage[];
}

const PortfolioCard = ({ portfolio, index }: { portfolio: Project; index: number }) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Use backend URL for images (not API URL)
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const images = portfolio.images?.length > 0 
        ? portfolio.images.map(img => `${backendUrl}${img.url}`)
        : ['/images/project-1.png']; // Fallback

    const accent = "#A259FF"; // Default accent color

    const handleViewMore = () => {
        setLightboxOpen(true);
        setCurrentImageIndex(0);
    };

    const handleNext = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <>
            <section
                className="min-h-screen w-full snap-start flex items-center justify-center relative overflow-hidden border-b py-12 md:py-24"
                style={{ scrollSnapAlign: 'start', backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-subtle)' }}
            >
                {/* Background Glow */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-10 pointer-events-none"
                    style={{ backgroundColor: accent }}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 grid lg:grid-cols-2 gap-8 lg:gap-24 items-center relative">
                    {/* Card Fan Layout (Left) - Mobile first sizing */}
                    <div className="order-2 lg:order-1 relative flex justify-center lg:justify-start items-center">
                        <div className="relative w-full max-w-sm md:max-w-md lg:max-w-[520px] h-[280px] sm:h-[320px] md:h-[400px] perspective-1000 lg:-translate-x-12">
                            {/* Fan of cards - smaller on mobile */}
                            {images.slice(0, 3).map((image, imgIndex) => {
                                const rotation = (imgIndex - 1) * 10; // -10deg, 0deg, 10deg
                                const zIndex = 10 - imgIndex; // 10, 9, 8 — visible but below the text's z-index
                                const translateY = imgIndex * 15;
                                const translateX = (imgIndex - 1) * 50; // Restored original horizontal spread so the fan shape is preserved

                                return (
                                    <motion.div
                                        key={imgIndex}
                                        initial={{ opacity: 0, y: 30, rotate: rotation }}
                                        whileInView={{ opacity: 1, y: translateY, x: translateX, rotate: rotation }}
                                        viewport={{ once: true }}
                                        transition={{ delay: imgIndex * 0.15, duration: 0.6 }}
                                        whileHover={{
                                            y: translateY - 30,
                                            x: translateX,
                                            rotate: rotation * 1.2,
                                            scale: 1.08,
                                            zIndex: 15, // lifts slightly on hover but still below text (text z-20)
                                            transition: { duration: 0.3 }
                                        }}
                                        className="absolute cursor-pointer"
                                        style={{
                                            zIndex,
                                            transformOrigin: 'center bottom',
                                            left: '50%',
                                            marginLeft: '-100px',
                                        }}
                                        onClick={handleViewMore}
                                    >
                                        <div
                                            className="w-[200px] h-[260px] sm:w-[220px] sm:h-[290px] md:w-[280px] md:h-[360px] rounded-xl overflow-hidden shadow-2xl border"
                                            style={{ borderColor: 'var(--border-subtle)' }}
                                        >
                                            <img
                                                src={image}
                                                alt={`${portfolio.title} ${imgIndex + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Portfolio Info (Right) */}
                    <motion.div
                        className="order-1 lg:order-2 flex flex-col justify-center relative z-20 lg:pl-8"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="font-label tracking-[0.3em] text-xs mb-4 uppercase" style={{ color: accent }}>
                            Campaign {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3 
                            className="text-2xl sm:text-3xl lg:text-4xl font-normal mb-2 leading-tight italic" 
                            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}
                        >
                            {portfolio.title}
                        </h3>
                        <p className="text-sm sm:text-base mb-6 uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>
                            {portfolio.category}
                        </p>
                        <div className="w-16 h-px mb-6" style={{ backgroundColor: 'var(--accent)' }} />
                        <p className="leading-relaxed max-w-md text-base sm:text-lg mb-6 font-light" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                            {portfolio.description}
                        </p>
                        {portfolio.tags && portfolio.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {portfolio.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 text-xs uppercase tracking-widest rounded-full"
                                        style={{ 
                                            backgroundColor: 'var(--bg-elevated)', 
                                            color: 'var(--text-muted)',
                                            border: '1px solid var(--border-subtle)'
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={handleViewMore}
                            className="font-label tracking-[0.2em] text-xs uppercase hover:opacity-70 transition-opacity flex items-center gap-3 group"
                            style={{ color: accent }}
                            data-cursor="link"
                        >
                            View Gallery
                            <span className="transform group-hover:translate-x-2 transition-transform">→</span>
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Lightbox */}
            {lightboxOpen && (
                <Lightbox
                    images={images}
                    currentIndex={currentImageIndex}
                    onClose={() => setLightboxOpen(false)}
                    onNext={handleNext}
                    onPrev={handlePrev}
                />
            )}
        </>
    );
};

export const SitesGallery = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getProjects();
                setProjects(data.projects || []);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div 
                className="min-h-screen flex items-center justify-center"
                style={{ backgroundColor: 'var(--bg-main)' }}
            >
                <p style={{ color: 'var(--text-muted)' }}>Loading projects...</p>
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div 
                className="min-h-screen flex items-center justify-center"
                style={{ backgroundColor: 'var(--bg-main)' }}
            >
                <p style={{ color: 'var(--text-muted)' }}>No projects available</p>
            </div>
        );
    }

    return (
        <div id="sites" className="snap-y snap-mandatory scroll-smooth relative z-10">
            {projects.map((portfolio, i) => (
                <PortfolioCard key={portfolio.id} portfolio={portfolio} index={i} />
            ))}
        </div>
    );
};

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Lightbox } from '../ui/Lightbox';

interface Certification {
    id: string;
    url: string;
    filename: string;
    title?: string;
    uploadedAt: string;
}

export const Certifications = () => {
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [loading, setLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchCertifications = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || '/api';
                const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
                
                const response = await fetch(`${apiUrl}/certifications/public`);
                
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        const certificationsWithUrls = data.map((cert: Certification) => ({
                            ...cert,
                            url: `${backendUrl}${cert.url}`
                        }));
                        setCertifications(certificationsWithUrls);
                    }
                }
            } catch (error) {
                console.error('Error fetching certifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCertifications();
    }, []);

    const handleImageClick = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const handleCloseLightbox = () => {
        setLightboxOpen(false);
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % certifications.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + certifications.length) % certifications.length);
    };

    if (loading) {
        return (
            <section
                id="certifications"
                className="py-12 md:py-16 lg:py-20 relative"
                style={{ backgroundColor: 'var(--bg-main)' }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
                    <p style={{ color: 'var(--text-muted)' }}>Loading certifications...</p>
                </div>
            </section>
        );
    }

    if (certifications.length === 0) {
        return null; // Don't show section if no certifications
    }

    return (
        <section
            id="certifications"
            className="py-12 md:py-16 lg:py-20 relative"
            style={{ backgroundColor: 'var(--bg-main)' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                {/* Section Header */}
                <div className="text-center mb-10 md:mb-14">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-label tracking-[0.3em] text-xs uppercase mb-4 block"
                        style={{ color: 'var(--accent)' }}
                    >
                        Professional Growth
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl sm:text-3xl md:text-4xl font-normal italic"
                        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}
                    >
                        Certifications & Training
                    </motion.h2>
                </div>

                {/* Certifications Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {certifications.map((cert, index) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            onClick={() => handleImageClick(index)}
                            className="group cursor-pointer"
                            data-cursor="link"
                        >
                            <div
                                className="relative aspect-[3/4] rounded-xl overflow-hidden border transition-all duration-300 group-hover:-translate-y-2"
                                style={{
                                    borderColor: 'var(--border-subtle)',
                                    boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3)'
                                }}
                            >
                                <img
                                    src={cert.url}
                                    alt={cert.title || `Certification ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                
                                {/* Overlay on hover */}
                                <div 
                                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                                >
                                    {cert.title && (
                                        <p className="text-white text-sm font-normal">
                                            {cert.title}
                                        </p>
                                    )}
                                </div>

                                {/* Accent border on hover */}
                                <div 
                                    className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                                    style={{ borderColor: 'var(--accent)' }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Hint text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-8 font-label tracking-[0.2em] text-xs uppercase"
                    style={{ color: 'var(--text-muted)' }}
                >
                    Click to view full size
                </motion.p>
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <Lightbox
                    images={certifications.map(cert => cert.url)}
                    currentIndex={currentImageIndex}
                    onClose={handleCloseLightbox}
                    onNext={handleNextImage}
                    onPrev={handlePrevImage}
                />
            )}
        </section>
    );
};

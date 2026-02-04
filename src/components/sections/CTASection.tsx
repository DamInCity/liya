import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface GalleryImage {
    id: string;
    url: string;
    filename: string;
}

export const CTASection = () => {
    const [showSticky, setShowSticky] = useState(false);
    const { scrollY } = useScroll();
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

    useEffect(() => {
        const fetchGalleryImages = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || '/api';
                const response = await fetch(`${apiUrl}/gallery/public`);
                if (response.ok) {
                    const data = await response.json();
                    setGalleryImages(data.slice(0, 3));
                }
            } catch (error) {
                console.error('Error fetching gallery images:', error);
            }
        };
        fetchGalleryImages();
    }, []);

    useEffect(() => {
        return scrollY.on('change', (latest) => {
            const isPastHero = latest > 800;
            const isAtBottom = document.body.scrollHeight - latest - window.innerHeight < 600;
            setShowSticky(isPastHero && !isAtBottom);
        });
    }, [scrollY]);

    return (
        <>
            <section
                id="cta"
                className="py-16 md:py-24 lg:py-32 relative transition-colors duration-300"
                style={{ backgroundColor: 'var(--bg-main)' }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
                    <div
                        className="relative overflow-hidden rounded-2xl md:rounded-[24px] p-6 sm:p-8 lg:p-16 border"
                        style={{ borderColor: 'var(--border-subtle)' }}
                    >
                        {/* Glass Background */}
                        <div
                            className="absolute inset-0 backdrop-blur-xl z-0"
                            style={{ backgroundColor: 'var(--surface-glass)' }}
                        />

                        <div className="relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-20">
                            {/* Left: Copy */}
                            <div>
                                <span
                                    className="font-label tracking-[0.3em] text-xs uppercase mb-4 sm:mb-6 block"
                                    style={{ color: 'var(--accent)' }}
                                >
                                    Get in Touch
                                </span>
                                <h2
                                    className="text-2xl sm:text-3xl md:text-4xl font-normal italic mb-4 sm:mb-6"
                                    style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}
                                >
                                    Let's Work Together
                                </h2>
                                <p
                                    className="text-base md:text-lg leading-relaxed mb-6 md:mb-8"
                                    style={{ color: 'var(--text-muted)' }}
                                >
                                    Available for fashion shows, editorial shoots, commercial campaigns, and brand collaborations worldwide. Reach out via WhatsApp or the form below.
                                </p>
                                <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                                    <div className="flex -space-x-2">
                                        {galleryImages.length > 0 ? (
                                            galleryImages.map((img, idx) => {
                                                const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
                                                return (
                                                    <img
                                                        key={img.id}
                                                        src={`${backendUrl}${img.url}`}
                                                        alt={`Gallery ${idx + 1}`}
                                                        className="w-10 h-10 rounded-full border-2 object-cover"
                                                        style={{ borderColor: 'var(--bg-main)' }}
                                                    />
                                                );
                                            })
                                        ) : (
                                            <>
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-[#C896FF] border-2" style={{ borderColor: 'var(--bg-main)' }} />
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C896FF] to-[#8B3FD9] border-2" style={{ borderColor: 'var(--bg-main)' }} />
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B3FD9] to-[var(--accent)] border-2" style={{ borderColor: 'var(--bg-main)' }} />
                                            </>
                                        )}
                                    </div>
                                    <span>Trusted by international brands</span>
                                </div>
                            </div>

                            {/* Right: Contact Section */}
                            <div className="space-y-4">
                                <div className="space-y-6">
                                    <p
                                        className="text-base md:text-lg leading-relaxed"
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        Ready to collaborate? Click below to send me an email and let's discuss your project.
                                    </p>

                                    <a
                                        href="mailto:contact@liya.com?subject=Let's Work Together&body=Hi Liya,%0D%0A%0D%0AI would like to discuss a collaboration opportunity with you.%0D%0A%0D%0AProject Details:%0D%0A%0D%0A%0D%0ABest regards,"
                                        className="block w-full font-bold py-3 md:py-4 rounded-lg transition-shadow duration-300 hover:shadow-lg text-sm md:text-base text-center"
                                        style={{
                                            backgroundColor: 'var(--accent)',
                                            color: 'var(--bg-main)'
                                        }}
                                        data-cursor="cta"
                                    >
                                        Send Email
                                    </a>

                                    <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                                        Or reach out via WhatsApp using the button below
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sticky CTA Bar - Hidden on mobile */}
            <AnimatePresence>
                {showSticky && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-0 left-0 w-full z-40 hidden md:block"
                    >
                        <div className="mx-auto max-w-2xl mb-6 px-4">
                            <div
                                className="backdrop-blur-md border rounded-full p-2 pl-6 flex items-center justify-between shadow-2xl"
                                style={{
                                    backgroundColor: 'var(--surface-glass)',
                                    borderColor: 'var(--border-subtle)'
                                }}
                            >
                                <span
                                    className="text-sm font-medium mr-4"
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    Interested in working together?
                                </span>
                                <a
                                    href="https://wa.me/1234567890"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform"
                                    style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-main)' }}
                                >
                                    Message on WhatsApp
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Certification {
    id: string;
    url: string;
    filename: string;
    title?: string;
    description?: string;
    uploadedAt: string;
}

export const Certifications = () => {
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [loading, setLoading] = useState(true);

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

                {/* Certifications Grid - Text Only */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {certifications.map((cert, index) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="group p-6 rounded-xl border transition-all duration-300 hover:-translate-y-2"
                            style={{
                                borderColor: 'var(--border-subtle)',
                                backgroundColor: 'var(--bg-elevated)',
                                boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3)'
                            }}
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <h3 
                                    className="text-lg font-bold"
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    {cert.title || `Certification ${index + 1}`}
                                </h3>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                                    <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="#3b82f6" strokeWidth="2"/>
                                    <path d="M9 12.5L11 14.5L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            {cert.description && (
                                <p 
                                    className="text-sm leading-relaxed"
                                    style={{ color: 'var(--text-muted)' }}
                                >
                                    {cert.description}
                                </p>
                            )}
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

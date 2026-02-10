import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getSpecialties } from '../../services/api';

interface Specialty {
    id: string;
    title: string;
    description: string;
    icon?: string;
}

export const ServicesStrip = () => {
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch specialties
                const specialtiesData = await getSpecialties();
                setSpecialties(specialtiesData.specialties || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    return (
        <section
            id="services"
            className="py-16 md:py-24 lg:py-32 relative z-10 transition-colors duration-300"
            style={{ 
                backgroundColor: 'var(--bg-main)'
            }}
        >

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 border-b pb-6" style={{ borderColor: 'var(--border-subtle)' }}>
                    <h2
                        className="text-2xl sm:text-3xl md:text-4xl font-normal italic"
                        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}
                    >
                        My Specialties
                    </h2>
                    <p
                        className="mt-2 md:mt-0 font-label tracking-[0.2em] text-xs uppercase"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        What I Do Best
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
                        Loading specialties...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                        {specialties.map((specialty, index) => (
                            <motion.div
                                key={specialty.id}
                                initial={{ opacity: 0, y: 32 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                                className="min-h-[200px] sm:min-h-[240px] p-6 md:p-8 rounded-xl sm:rounded-2xl group transition-all duration-500 hover:-translate-y-1 border relative overflow-hidden"
                                style={{
                                    backgroundColor: 'rgba(162, 89, 255, 0.08)',
                                    borderColor: 'rgba(162, 89, 255, 0.3)',
                                }}
                                data-cursor="link"
                            >
                                {/* Accent Color Overlay */}
                                <div 
                                    className="absolute inset-0 z-0 transition-opacity duration-500 group-hover:opacity-20"
                                    style={{
                                        background: `
                                            linear-gradient(135deg, 
                                                rgba(162, 89, 255, 0.15) 0%, 
                                                rgba(200, 150, 255, 0.1) 100%
                                            )
                                        `,
                                        opacity: 0.15
                                    }}
                                />

                                <div className="relative z-10 h-full flex flex-col justify-end">
                                    <h3
                                        className="text-lg sm:text-xl lg:text-2xl font-normal mb-3 italic"
                                        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}
                                    >
                                        {specialty.title}
                                        <span
                                            className="block w-12 h-px mt-3 bg-gradient-to-r from-[var(--accent)] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                                        />
                                    </h3>

                                    <p
                                        className="text-sm sm:text-base leading-relaxed font-light"
                                        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
                                    >
                                        {specialty.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

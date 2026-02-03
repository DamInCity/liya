import { motion } from 'framer-motion';
import { useState } from 'react';

const socialCards = [
    { 
        name: 'WhatsApp', 
        icon: (
            <svg viewBox="0 0 24 24" className="w-10 h-10 sm:w-14 sm:h-14" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
        ),
        color: '#25D366',
        url: 'https://wa.me/+251953426987',
        gradient: 'from-green-500 to-green-600'
    },
    { 
        name: 'TikTok', 
        icon: (
            <svg viewBox="0 0 24 24" className="w-10 h-10 sm:w-14 sm:h-14" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
            </svg>
        ),
        color: '#ff0050',
        url: 'https://tiktok.com/@liyadereji',
        gradient: 'from-black via-gray-900 to-black'
    },
    { 
        name: 'Instagram', 
        icon: (
            <svg viewBox="0 0 24 24" className="w-10 h-10 sm:w-14 sm:h-14" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
        ),
        color: '#E1306C',
        url: 'https://www.instagram.com/_liya_jj/',
        gradient: 'from-purple-600 via-pink-500 to-orange-400'
    },
];

export const ImageDeck = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section
            className="py-12 md:py-20 lg:py-24 relative overflow-hidden"
            style={{ backgroundColor: 'var(--bg-main)' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                {/* Section Header */}
                <div className="text-center mb-16 md:mb-24">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-label tracking-[0.3em] text-xs uppercase mb-4 block"
                        style={{ color: 'var(--accent)' }}
                    >
                        Let's Connect
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl sm:text-3xl md:text-4xl font-normal italic"
                        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}
                    >
                        Follow My Journey
                    </motion.h2>
                </div>

                {/* Social Cards Fan - Works on both mobile and desktop */}
                <div className="relative flex justify-center items-center min-h-[300px] sm:min-h-[350px] md:min-h-[400px] max-w-5xl mx-auto">
                    {socialCards.map((card, index) => {
                        const isHovered = hoveredIndex === index;
                        const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index;

                        // Fan spread - smaller on mobile
                        const baseRotation = (index - 1) * 10; // -10deg, 0deg, 10deg (reduced from 12)
                        const baseTranslateY = index * 8;
                        const baseTranslateX = (index - 1) * 50; // Tighter spread (reduced from 60)

                        return (
                            <motion.a
                                key={index}
                                href={card.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 60, rotate: 0 }}
                                whileInView={{ 
                                    opacity: 1, 
                                    y: baseTranslateY, 
                                    x: baseTranslateX,
                                    rotate: baseRotation 
                                }}
                                viewport={{ once: true }}
                                transition={{ 
                                    delay: index * 0.12, 
                                    duration: 0.5,
                                    type: "spring",
                                    stiffness: 120
                                }}
                                whileHover={{
                                    y: baseTranslateY - 35,
                                    x: baseTranslateX,
                                    rotate: baseRotation * 0.4,
                                    scale: 1.08,
                                    zIndex: 50,
                                    transition: { duration: 0.3, type: "spring", stiffness: 200 }
                                }}
                                whileTap={{
                                    scale: 1.05,
                                    y: baseTranslateY - 30,
                                }}
                                animate={isOtherHovered ? {
                                    scale: 0.92,
                                    opacity: 0.5,
                                    transition: { duration: 0.3 }
                                } : {}}
                                onHoverStart={() => setHoveredIndex(index)}
                                onHoverEnd={() => setHoveredIndex(null)}
                                className="absolute cursor-pointer"
                                style={{
                                    zIndex: isHovered ? 50 : 10 + index,
                                    transformOrigin: 'center bottom'
                                }}
                                data-cursor="link"
                            >
                                <div
                                    className={`w-[140px] h-[180px] sm:w-[180px] sm:h-[230px] md:w-[220px] md:h-[280px] rounded-xl sm:rounded-2xl overflow-hidden border relative group bg-gradient-to-br ${card.gradient}`}
                                    style={{
                                        borderColor: 'var(--border-subtle)',
                                        boxShadow: isHovered 
                                            ? `0 30px 60px -15px ${card.color}60` 
                                            : '0 15px 35px -10px rgba(0, 0, 0, 0.4)'
                                    }}
                                >
                                    {/* Icon */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                        <div className="mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                            {card.icon}
                                        </div>
                                        <h3 className="text-base sm:text-xl md:text-2xl font-normal uppercase tracking-widest" style={{ fontFamily: 'var(--font-heading)' }}>
                                            {card.name}
                                        </h3>
                                        <p className="text-[10px] sm:text-xs opacity-70 uppercase tracking-[0.2em] mt-1">
                                            Follow
                                        </p>
                                    </div>
                                    
                                    {/* Subtle overlay */}
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
                                </div>
                            </motion.a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { StatsModal } from '../ui/StatsModal';

interface Bio {
    name: string;
    title: string;
    description: string;
    location: string;
}

export const Hero = () => {
    const [bio, setBio] = useState<Bio | null>(null);
    const [isStatsOpen, setIsStatsOpen] = useState(false);

    useEffect(() => {
        fetch('/api/bio/public')
            .then((res) => res.json())
            .then((data) => setBio(data))
            .catch((err) => console.error('Error fetching bio:', err));
    }, []);
    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center pt-16 md:pt-20 overflow-hidden"
        >
            {/* Name Overlay - Large background text like Lumiere */}
            <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
                style={{ zIndex: 0 }}
            >
                <motion.h1 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                    className="text-[18vw] md:text-[16vw] lg:text-[14vw] font-normal whitespace-nowrap text-center leading-none uppercase tracking-[0.15em]"
                    style={{ 
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-heading)',
                        opacity: 0.04,
                        letterSpacing: '0.2em'
                    }}
                >
                    LIYA
                </motion.h1>
            </div>

            {/* Background Gradients - Updated for purple */}
            <div
                className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-500"
                style={{
                    background: `
            radial-gradient(circle at 10% -10%, rgba(162, 89, 255, 0.22), transparent 55%),
            radial-gradient(circle at 120% 20%, rgba(200, 150, 255, 0.18), transparent 55%),
            radial-gradient(circle at 50% 120%, rgba(139, 63, 217, 0.18), transparent 55%),
            var(--bg-main)
          `
                }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10 w-full">
                {/* Mobile-first layout: Stack on mobile, side-by-side on desktop */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16">
                    {/* Left Column: Content */}
                    <div className="flex-1 flex flex-col items-start text-left order-2 lg:order-1">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="font-label tracking-[0.3em] text-xs uppercase mb-6 sm:mb-8"
                            style={{ color: 'var(--accent)' }}
                        >
                            {bio?.title || 'Professional Model · 3 Years Experience'}
                        </motion.span>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.15] mb-6 sm:mb-8 font-normal"
                            style={{ 
                                color: 'var(--text-primary)',
                                fontFamily: 'var(--font-heading)',
                                letterSpacing: '0.02em'
                            }}
                        >
                            <span className="italic">{bio?.name || 'Liya Dereji'}</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-base sm:text-lg lg:text-xl max-w-xl mb-8 sm:mb-10 leading-relaxed font-light"
                            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}
                        >
                            {bio?.description || 'With 3 years of modeling experience and professional training, I specialize in runway, commercial work, acting, and model coordination. I bring creativity and reliability to every project.'}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto"
                        >
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <button
                                    onClick={() => document.getElementById('sites')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-normal text-sm sm:text-base uppercase tracking-wider transition-all duration-300 relative group overflow-hidden"
                                    style={{
                                        backgroundColor: 'var(--accent)',
                                        color: 'var(--bg-main)',
                                        fontFamily: 'var(--font-body)'
                                    }}
                                    data-cursor="cta"
                                >
                                    <span className="relative z-10">Portfolio</span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </button>
                                <button
                                    onClick={() => document.getElementById('flower-gallery')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-normal text-sm sm:text-base uppercase tracking-wider transition-all duration-300 relative group border"
                                    style={{
                                        backgroundColor: 'transparent',
                                        borderColor: 'var(--accent)',
                                        color: 'var(--accent)',
                                        fontFamily: 'var(--font-body)'
                                    }}
                                    data-cursor="cta"
                                >
                                    <span className="relative z-10">Gallery</span>
                                    <div className="absolute inset-0 bg-[var(--accent)] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                                </button>
                                <button
                                    onClick={() => setIsStatsOpen(true)}
                                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-normal text-sm sm:text-base uppercase tracking-wider transition-all duration-300 relative group border"
                                    style={{
                                        backgroundColor: 'transparent',
                                        borderColor: 'var(--accent)',
                                        color: 'var(--accent)',
                                        fontFamily: 'var(--font-body)'
                                    }}
                                    data-cursor="cta"
                                >
                                    <span className="relative z-10">Profile</span>
                                    <div className="absolute inset-0 bg-[var(--accent)] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                                </button>
                            </div>
                            <span
                                className="text-xs sm:text-sm max-w-[280px] leading-tight font-light"
                                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}
                            >
                                {bio?.location || 'Addis Ababa, Ethiopia · Available for fashion shows, commercials, and creative projects.'}
                            </span>
                        </motion.div>
                    </div>

                    {/* Right Column: Hero Image with Blob */}
                    <div className="flex-1 relative order-1 lg:order-2 min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
                        {/* SVG Blob Background */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <svg
                                viewBox="0 0 500 500"
                                className="w-full h-full"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <defs>
                                    <linearGradient id="blobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style={{ stopColor: 'rgba(162, 89, 255, 0.3)', stopOpacity: 1 }} />
                                        <stop offset="100%" style={{ stopColor: 'rgba(200, 150, 255, 0.2)', stopOpacity: 1 }} />
                                    </linearGradient>
                                    <filter id="blobBlur">
                                        <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
                                    </filter>
                                </defs>
                                <motion.path
                                    d="M412.5,293.5Q384,337,365,384Q346,431,298,443Q250,455,204.5,439.5Q159,424,131,388Q103,352,82.5,301Q62,250,69,193Q76,136,118.5,103.5Q161,71,205.5,64.5Q250,58,294,65Q338,72,378,103Q418,134,430.5,192Q443,250,412.5,293.5Z"
                                    fill="url(#blobGradient)"
                                    filter="url(#blobBlur)"
                                    animate={{
                                        d: [
                                            "M412.5,293.5Q384,337,365,384Q346,431,298,443Q250,455,204.5,439.5Q159,424,131,388Q103,352,82.5,301Q62,250,69,193Q76,136,118.5,103.5Q161,71,205.5,64.5Q250,58,294,65Q338,72,378,103Q418,134,430.5,192Q443,250,412.5,293.5Z",
                                            "M423.5,301Q396,352,369.5,389.5Q343,427,296.5,440Q250,453,201,445Q152,437,121.5,398.5Q91,360,73,305Q55,250,82,200.5Q109,151,136,110Q163,69,206.5,69Q250,69,294,68.5Q338,68,377.5,100Q417,132,434,191Q451,250,423.5,301Z",
                                            "M412.5,293.5Q384,337,365,384Q346,431,298,443Q250,455,204.5,439.5Q159,424,131,388Q103,352,82.5,301Q62,250,69,193Q76,136,118.5,103.5Q161,71,205.5,64.5Q250,58,294,65Q338,72,378,103Q418,134,430.5,192Q443,250,412.5,293.5Z"
                                        ]
                                    }}
                                    transition={{
                                        duration: 15,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        ease: "easeInOut"
                                    }}
                                />
                            </svg>
                        </motion.div>

                        {/* Hero Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="relative z-10 h-full flex items-center justify-center p-4 sm:p-8"
                        >
                            <div
                                className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border"
                                style={{ borderColor: 'var(--border-subtle)' }}
                            >
                                <img
                                    src="liya/liya-hero.png"
                                    alt="Liya Dereje Adane - Professional Model"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Stats Modal */}
            <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} />
        </section>
    );
};

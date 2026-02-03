import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';

export const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [activeSection, setActiveSection] = useState<string>('Intro');
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const height = window.innerHeight;

            if (scrollY < height * 0.8) setActiveSection('Intro');
            else if (scrollY < height * 1.5) setActiveSection('Services');
            else if (scrollY < height * 4.5) setActiveSection('Portfolio');
            else if (scrollY < height * 5.5) setActiveSection('Join Us');
            else setActiveSection('Contact');
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Mobile: Top horizontal bar
    if (isMobile) {
        return (
            <div className="fixed top-0 left-0 w-full z-50">
                {/* Progress Bar */}
                <div className="h-1 w-full" style={{ backgroundColor: 'var(--border-subtle)' }}>
                    <motion.div
                        className="h-full origin-left"
                        style={{
                            scaleX,
                            backgroundColor: 'var(--accent)',
                        }}
                    />
                </div>

                {/* Mobile Section Indicator */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-3 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                        style={{
                            backgroundColor: 'var(--surface-glass)',
                            color: 'var(--accent)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid var(--border-subtle)'
                        }}
                    >
                        {activeSection}
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    }

    // Desktop: Right side vertical tracker
    return (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-row-reverse items-center gap-4">
            {/* Track */}
            <div
                className="h-[220px] w-[2px] rounded-full relative overflow-hidden"
                style={{ backgroundColor: 'var(--border-subtle)' }}
            >
                <motion.div
                    className="absolute top-0 left-0 w-full origin-top"
                    style={{
                        scaleY,
                        height: '100%',
                        backgroundColor: 'var(--accent)'
                    }}
                />
            </div>

            {/* Floating Label (Active Section) */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="text-xs font-medium uppercase tracking-widest text-right"
                    style={{ color: 'var(--accent)' }}
                >
                    {activeSection}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

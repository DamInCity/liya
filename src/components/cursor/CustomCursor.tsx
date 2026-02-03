import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor = () => {
    const [cursorType, setCursorType] = useState<string>('default');
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            // Check for hover targets
            const target = e.target as HTMLElement;
            if (target.closest('[data-cursor="link"]')) {
                setCursorType('link');
            } else if (target.closest('[data-cursor="cta"]')) {
                setCursorType('cta');
            } else if (target.closest('[data-cursor="drag"]')) {
                setCursorType('drag');
            } else {
                setCursorType('default');
            }
        };

        window.addEventListener('mousemove', moveCursor);
        return () => {
            window.removeEventListener('mousemove', moveCursor);
        };
    }, [cursorX, cursorY]);

    // Hide on mobile/touch
    const [isTouch, setIsTouch] = useState(false);
    useEffect(() => {
        const checkTouch = () => setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
        checkTouch();
        window.addEventListener('resize', checkTouch);
        return () => window.removeEventListener('resize', checkTouch);
    }, []);

    if (isTouch) return null;

    return (
        <div className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference">
            {/* Inner Dot */}
            <motion.div
                className="absolute h-2 w-2 rounded-full bg-[#faeff9]"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            />

            {/* Outer Ring */}
            <motion.div
                className="absolute rounded-full border border-white/50"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    height: cursorType === 'cta' ? 80 : cursorType === 'link' ? 48 : 32,
                    width: cursorType === 'cta' ? 80 : cursorType === 'link' ? 48 : 32,
                    backgroundColor: cursorType === 'cta' ? 'rgba(78, 225, 160, 0.18)' : 'transparent',
                    borderColor: cursorType === 'cta' ? 'transparent' : cursorType === 'link' ? '#4EE1A0' : 'rgba(245, 247, 255, 0.5)',
                }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
                {cursorType === 'cta' && (
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] uppercase font-bold tracking-widest text-accent">Start</span>
                )}
            </motion.div>
        </div>
    );
};

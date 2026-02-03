import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export const LenisProvider = ({ children }: { children: React.ReactNode }) => {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Integrate with native scroll for things like scroll progress to work seamlessly
        // though Lenishijacks interactions, the native scroll event still fires on window usually
        // or we can use lenis.on('scroll', ...) if needed for custom trackers.

        return () => {
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
};

// Hook to access lenis instance if needed elsewhere
// (For this project, we might just need the global scrolling behavior)

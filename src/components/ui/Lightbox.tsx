import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LightboxProps {
    images: string[];
    currentIndex: number;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}

export const Lightbox = ({ images, currentIndex, onClose, onNext, onPrev }: LightboxProps) => {
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe) onNext();
        if (isRightSwipe) onPrev();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'ArrowLeft') onPrev();
        };

        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [onClose, onNext, onPrev]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center"
                style={{ backgroundColor: 'rgba(5, 6, 10, 0.98)' }}
                onClick={onClose}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 rounded-full flex items-center justify-center z-[10000] backdrop-blur-md border transition-all hover:scale-110"
                    style={{
                        backgroundColor: 'var(--surface-glass)',
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-primary)'
                    }}
                    aria-label="Close lightbox"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Navigation Buttons - Hidden on mobile, swipe instead */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onPrev();
                    }}
                    className="hidden sm:flex absolute left-4 sm:left-6 w-12 h-12 rounded-full items-center justify-center backdrop-blur-md border transition-all hover:scale-110 z-[10000]"
                    style={{
                        backgroundColor: 'var(--surface-glass)',
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-primary)'
                    }}
                    aria-label="Previous image"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onNext();
                    }}
                    className="hidden sm:flex absolute right-4 sm:right-6 w-12 h-12 rounded-full items-center justify-center backdrop-blur-md border transition-all hover:scale-110 z-[10000]"
                    style={{
                        backgroundColor: 'var(--surface-glass)',
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-primary)'
                    }}
                    aria-label="Next image"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {/* Image Container - Fullscreen */}
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full flex items-center justify-center p-4 sm:p-12"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        src={images[currentIndex]}
                        alt={`Portfolio image ${currentIndex + 1}`}
                        className="max-w-full max-h-full w-auto h-auto object-contain"
                        style={{ maxHeight: 'calc(100vh - 120px)' }}
                    />
                </motion.div>

                {/* Counter & Swipe hint */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[10000]">
                    <div
                        className="px-4 py-2 rounded-full backdrop-blur-md border text-sm uppercase tracking-widest"
                        style={{
                            backgroundColor: 'var(--surface-glass)',
                            borderColor: 'var(--border-subtle)',
                            color: 'var(--text-primary)'
                        }}
                    >
                        {currentIndex + 1} / {images.length}
                    </div>
                    <p className="sm:hidden text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                        Swipe to navigate
                    </p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface StatsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Stats {
    languages: string;
    height: string;
    weight: string;
    bust: string;
    waist: string;
    hips: string;
    shoeSize: string;
    hairColor: string;
    eyeColor: string;
    skinTone: string;
}

export const StatsModal = ({ isOpen, onClose }: StatsModalProps) => {
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetch('/api/stats/public')
                .then((res) => res.json())
                .then((data) => setStats({
                    languages: data.languages || '',
                    height: data.height || '',
                    weight: data.weight || '',
                    bust: data.bust || '',
                    waist: data.waist || '',
                    hips: data.hips || '',
                    shoeSize: data.shoeSize || '',
                    hairColor: data.hairColor || '',
                    eyeColor: data.eyeColor || '',
                    skinTone: data.skinTone || ''
                }))
                .catch((err) => console.error('Error fetching stats:', err));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl border"
                        style={{ 
                            backgroundColor: '#ffffff',
                            borderColor: '#e0e0e0',
                            zIndex: 10
                        }}
                    >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full transition-colors hover:bg-gray-100"
                        style={{ color: '#666' }}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Header */}
                    <h2
                        className="text-2xl sm:text-3xl font-normal mb-6"
                        style={{ color: '#000000', fontFamily: 'var(--font-heading)' }}
                    >
                        Model Profile
                    </h2>

                    {/* Stats Grid */}
                    {stats ? (
                        <div className="space-y-4">
                            <StatItem label="Languages" value={stats.languages} />
                            <StatItem label="Height" value={stats.height} />
                            <StatItem label="Weight" value={stats.weight} />
                            <StatItem label="Bust / Chest" value={stats.bust} />
                            <StatItem label="Waist" value={stats.waist} />
                            <StatItem label="Hips" value={stats.hips} />
                            <StatItem label="Shoe Size" value={stats.shoeSize} />
                            <StatItem label="Hair Color" value={stats.hairColor} />
                            <StatItem label="Eye Color" value={stats.eyeColor} />
                            <StatItem label="Skin Tone" value={stats.skinTone} />
                        </div>
                    ) : (
                        <div className="text-center py-8" style={{ color: '#666' }}>
                            Loading stats...
                        </div>
                    )}
                </motion.div>
            </div>
            )}
        </AnimatePresence>
    );
};

const StatItem = ({ label, value }: { label: string; value: string }) => {
    return (
        <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: '#e0e0e0' }}>
            <span className="text-sm font-medium" style={{ color: '#666', fontFamily: 'var(--font-body)' }}>
                {label}
            </span>
            <span className="text-base font-normal" style={{ color: '#000000', fontFamily: 'var(--font-body)' }}>
                {value || '—'}
            </span>
        </div>
    );
};

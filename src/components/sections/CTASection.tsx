import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export const CTASection = () => {
    const [showSticky, setShowSticky] = useState(false);
    const { scrollY } = useScroll();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        return scrollY.on('change', (latest) => {
            const isPastHero = latest > 800;
            const isAtBottom = document.body.scrollHeight - latest - window.innerHeight < 600;
            setShowSticky(isPastHero && !isAtBottom);
        });
    }, [scrollY]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({ name: '', email: '', phone: '', message: '' });
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[#C896FF] border-2" style={{ borderColor: 'var(--bg-main)' }} />
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C896FF] to-[#8B3FD9] border-2" style={{ borderColor: 'var(--bg-main)' }} />
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B3FD9] to-[var(--accent)] border-2" style={{ borderColor: 'var(--bg-main)' }} />
                                    </div>
                                    <span>Trusted by 50+ international brands</span>
                                </div>
                            </div>

                            {/* Right: Form */}
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <label
                                        className="text-xs uppercase font-bold tracking-widest"
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full rounded-lg p-3 md:p-4 outline-none transition-all border text-sm md:text-base"
                                        style={{
                                            backgroundColor: 'var(--bg-main)',
                                            borderColor: 'var(--border-subtle)',
                                            color: 'var(--text-primary)'
                                        }}
                                        placeholder="Jane Doe"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label
                                        className="text-xs uppercase font-bold tracking-widest"
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full rounded-lg p-3 md:p-4 outline-none transition-all border text-sm md:text-base"
                                        style={{
                                            backgroundColor: 'var(--bg-main)',
                                            borderColor: 'var(--border-subtle)',
                                            color: 'var(--text-primary)'
                                        }}
                                        placeholder="jane@example.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label
                                        className="text-xs uppercase font-bold tracking-widest"
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full rounded-lg p-3 md:p-4 outline-none transition-all border text-sm md:text-base"
                                        style={{
                                            backgroundColor: 'var(--bg-main)',
                                            borderColor: 'var(--border-subtle)',
                                            color: 'var(--text-primary)'
                                        }}
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label
                                        className="text-xs uppercase font-bold tracking-widest"
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        Message
                                    </label>
                                    <textarea
                                        rows={5}
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full rounded-lg p-3 md:p-4 outline-none transition-all resize-none border text-sm md:text-base"
                                        style={{
                                            backgroundColor: 'var(--bg-main)',
                                            borderColor: 'var(--border-subtle)',
                                            color: 'var(--text-primary)'
                                        }}
                                        placeholder="Send me an email..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full font-bold py-3 md:py-4 rounded-lg transition-shadow duration-300 mt-2 hover:shadow-lg text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        backgroundColor: 'var(--accent)',
                                        color: 'var(--bg-main)'
                                    }}
                                    data-cursor="cta"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                                
                                {submitStatus === 'success' && (
                                    <p className="text-xs text-center" style={{ color: 'var(--accent)' }}>
                                        Message sent successfully! I'll get back to you soon.
                                    </p>
                                )}
                                {submitStatus === 'error' && (
                                    <p className="text-xs text-center" style={{ color: '#ef4444' }}>
                                        Failed to send message. Please try again or contact via WhatsApp.
                                    </p>
                                )}
                                
                                <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                                    Prefer WhatsApp? Message me directly below.
                                </p>
                            </form>
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

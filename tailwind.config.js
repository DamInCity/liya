/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'bg-main': 'var(--bg-main)',
                'bg-elevated': 'var(--bg-elevated)',
                'text-primary': 'var(--text-primary)',
                'text-muted': 'var(--text-muted)',
                'accent': 'var(--accent)',
                'accent-soft': 'var(--accent-soft)',
                'border-subtle': 'var(--border-subtle)',
                'danger': 'var(--danger)',
                'surface-glass': 'var(--surface-glass)',
            },
            fontFamily: {
                'body': ['"Geist"', 'sans-serif'],
                'display': ['"Playfair Display"', 'Georgia', 'serif'],
                'heading': ['"Playfair Display"', 'Georgia', 'serif'],
            },
            fontSize: {
                'display-xl': 'var(--font-display-xl)',
                'display-lg': 'var(--font-display-lg)',
                'display-md': 'var(--font-display-md)',
                'body-lg': 'var(--font-body-lg)',
                'body-md': 'var(--font-body-md)',
                'label': ['var(--font-label)', {
                    letterSpacing: '0.14em',
                    fontWeight: '500',
                }],
            },
            spacing: {
                '1': 'var(--space-1)',
                '2': 'var(--space-2)',
                '3': 'var(--space-3)',
                '4': 'var(--space-4)',
                '5': 'var(--space-5)',
                '6': 'var(--space-6)',
                '7': 'var(--space-7)',
                '8': 'var(--space-8)',
                '9': 'var(--space-9)',
                '10': 'var(--space-10)',
            },
            animation: {
                'marquee': 'marquee 25s linear infinite',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
            },
            perspective: {
                '1000': '1000px',
            },
        },
    },
    plugins: [],
}

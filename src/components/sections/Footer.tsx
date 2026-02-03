export const Footer = () => {
    return (
        <footer
            className="py-6 md:py-8 border-t relative z-10 transition-colors duration-300"
            style={{
                backgroundColor: 'var(--bg-main)',
                borderColor: 'var(--border-subtle)'
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-2 text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                <p>© Liya Dereje Adane {new Date().getFullYear()}</p>
                <p className="text-center md:text-right">Professional Model · Addis Ababa, Ethiopia</p>
            </div>
        </footer>
    );
};

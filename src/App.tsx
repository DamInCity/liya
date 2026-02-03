import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CustomCursor } from './components/cursor/CustomCursor';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { LenisProvider } from './components/scroll/LenisProvider';
import { CTASection } from './components/sections/CTASection';
import { Footer } from './components/sections/Footer';
import { Hero } from './components/sections/Hero';
import { ServicesStrip } from './components/sections/ServicesStrip';
import { SitesGallery } from './components/sections/SitesGallery';
import { ThinkingMarquee } from './components/sections/ThinkingMarquee';
import { ImageDeck } from './components/sections/ImageDeck';
import { FlowerGallery } from './components/sections/FlowerGallery';
import { Certifications } from './components/sections/Certifications';
import { ThemeProvider } from './hooks/useTheme';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { WhatsAppButton } from './components/ui/WhatsAppButton';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

const HomePage = () => (
  <>
    <CustomCursor />
    <ScrollProgress />
    <ThemeToggle />
    <WhatsAppButton />

    <main className="flex flex-col w-full">
      <Hero />
      <ServicesStrip />
      <SitesGallery />
      <ThinkingMarquee />
      <FlowerGallery />
      <Certifications />
      <ImageDeck />
      <CTASection />
    </main>

    <Footer />
  </>
);

function App() {
  return (
    <ThemeProvider>
      <Router>
        <LenisProvider>
          <div
            className="relative w-full min-h-screen transition-colors duration-300"
            style={{
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-primary)'
            }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </div>
        </LenisProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App

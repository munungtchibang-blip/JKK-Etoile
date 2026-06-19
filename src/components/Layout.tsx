import { Outlet, useLocation, useOutlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWhatsApp from './FloatingWhatsApp';
import BackToTop from './BackToTop';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, Suspense } from 'react';
import { useSiteConfig } from './SiteContext';

export default function Layout() {
  const location = useLocation();
  const currentOutlet = useOutlet();
  const { config } = useSiteConfig();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  if (config.maintenanceMode) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-navy text-text p-4">
        {config.logoUrl ? (
          <img src={config.logoUrl} alt="Logo" className="w-24 h-24 object-contain mb-8" />
        ) : (
          <h1 className="text-3xl font-display text-gold mb-8">Kin-Dubai</h1>
        )}
        <h2 className="text-2xl font-bold mb-4">Mode Maintenance</h2>
        <p className="text-lg text-text/80 text-center max-w-md">
          {config.maintenanceMessage || "Le site est actuellement en maintenance. Nous serons de retour dans quelques instants !"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-navy text-text">
      <Navbar />
      <main className="flex-grow w-full overflow-x-hidden relative">
        <Suspense fallback={<div className="h-screen bg-navy" />}>
           {currentOutlet}
        </Suspense>
      </main>
      <Footer />
      <FloatingWhatsApp />
      <BackToTop />
    </div>
  );
}



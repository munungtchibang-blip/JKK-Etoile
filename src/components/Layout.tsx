import { Outlet, useLocation, useOutlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWhatsApp from './FloatingWhatsApp';
import BackToTop from './BackToTop';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, Suspense } from 'react';

export default function Layout() {
  const location = useLocation();
  const currentOutlet = useOutlet();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

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


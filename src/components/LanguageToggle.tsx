import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useLocation } from 'react-router-dom';

export default function LanguageToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHeroTransparent = location.pathname === '/' && !scrolled;

  const toggleLanguage = (newLang: 'FR' | 'EN') => {
    setLang(newLang);
    setIsOpen(false);
  };

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gold",
          isHeroTransparent ? "text-white/80 hover:text-white" : "text-text/80 hover:text-text",
          isOpen && "bg-white/10"
        )}
        aria-label="Toggle language"
      >
        <Globe size={18} />
        <span className="text-[11px] font-semibold tracking-wider">{lang}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-32 rounded-xl bg-navy border border-gold/20 shadow-xl overflow-hidden z-50"
            >
              <div className="py-1">
                <button
                  onClick={() => toggleLanguage('FR')}
                  className={cn(
                    "w-full text-left px-4 py-2 text-xs font-semibold tracking-wider transition-colors hover:bg-gold/10",
                    lang === 'FR' ? "text-gold" : "text-text/80"
                  )}
                >
                  Français (FR)
                </button>
                <button
                  onClick={() => toggleLanguage('EN')}
                  className={cn(
                    "w-full text-left px-4 py-2 text-xs font-semibold tracking-wider transition-colors hover:bg-gold/10",
                    lang === 'EN' ? "text-gold" : "text-text/80"
                  )}
                >
                  English (EN)
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

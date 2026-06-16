import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Type, Info, Settings, Sun, Moon, Globe } from 'lucide-react';
import { useSiteConfig } from './SiteContext';
import { useTheme } from './ThemeContext';

export default function SettingsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { config } = useSiteConfig();
  const { theme, toggleTheme } = useTheme();
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xlarge'>(() => {
    return (localStorage.getItem('textSize') as 'normal' | 'large' | 'xlarge') || 'normal';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
    root.classList.add(`text-size-${textSize}`);
    localStorage.setItem('textSize', textSize);
  }, [textSize]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const modalContent = isOpen && (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-[#0f172a]/80 backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-glass border border-gold/30 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative text-text"
      >
        
        <div className="flex items-center justify-between p-6 border-b border-gold-muted/30">
          <h2 className="text-xl font-light tracking-wider uppercase text-gold flex items-center gap-2">
            <Settings size={20} /> Paramètres
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-text/60 hover:text-text hover:bg-white/5 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto max-h-[70vh]">
          
          {/* Language Settings */}
          <div>
            <h3 className="text-[11px] uppercase tracking-[2px] font-semibold text-text/70 mb-4 flex items-center gap-2">
              <Globe size={14} /> Langue
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setLang('FR')}
                className={`px-4 py-3 rounded border text-sm transition-colors ${lang === 'FR' ? 'bg-gold/10 border-gold text-gold' : 'border-gold-muted/30 hover:border-gold/50 text-text/80'}`}
              >
                Français (FR)
              </button>
              <button
                onClick={() => setLang('EN')}
                className={`px-4 py-3 rounded border text-sm transition-colors ${lang === 'EN' ? 'bg-gold/10 border-gold text-gold' : 'border-gold-muted/30 hover:border-gold/50 text-text/80'}`}
              >
                English (EN)
              </button>
            </div>
          </div>

          {/* Theme Settings */}
          <div>
            <h3 className="text-[11px] uppercase tracking-[2px] font-semibold text-text/70 mb-4 flex items-center gap-2">
              {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />} Thème Simple
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {if (theme !== 'light') toggleTheme()}}
                className={`px-4 py-3 rounded border text-sm transition-colors flex items-center justify-center gap-2 ${theme === 'light' ? 'bg-gold/10 border-gold text-gold' : 'border-gold-muted/30 hover:border-gold/50 text-text/80'}`}
              >
                <Sun size={16} /> Clair
              </button>
              <button
                onClick={() => {if (theme !== 'dark') toggleTheme()}}
                className={`px-4 py-3 rounded border text-sm transition-colors flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-gold/10 border-gold text-gold' : 'border-gold-muted/30 hover:border-gold/50 text-text/80'}`}
              >
                <Moon size={16} /> Sombre
              </button>
            </div>
          </div>

          {/* Text Size Settings */}
          <div>
            <h3 className="text-[11px] uppercase tracking-[2px] font-semibold text-text/70 mb-4 flex items-center gap-2">
              <Type size={14} /> Taille du texte
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setTextSize('normal')}
                className={`px-4 py-3 rounded border text-sm transition-colors ${textSize === 'normal' ? 'bg-gold/10 border-gold text-gold' : 'border-gold-muted/30 hover:border-gold/50 text-text/80'}`}
              >
                Moyen
              </button>
              <button
                onClick={() => setTextSize('large')}
                className={`px-4 py-3 rounded border text-base transition-colors ${textSize === 'large' ? 'bg-gold/10 border-gold text-gold' : 'border-gold-muted/30 hover:border-gold/50 text-text/80'}`}
              >
                Grand
              </button>
              <button
                onClick={() => setTextSize('xlarge')}
                className={`px-4 py-3 rounded border text-lg transition-colors ${textSize === 'xlarge' ? 'bg-gold/10 border-gold text-gold' : 'border-gold-muted/30 hover:border-gold/50 text-text/80'}`}
              >
                Très Grand
              </button>
            </div>
          </div>

          {/* About Site */}
          <div className="pt-6 border-t border-gold-muted/30">
            <h3 className="text-[11px] uppercase tracking-[2px] font-semibold text-text/70 mb-4 flex items-center gap-2">
              <Info size={14} /> À propos
            </h3>
            <div className="bg-navy-800/50 p-4 rounded-lg border border-gold-muted/10">
              <h4 className="font-display text-gold mb-2">{config.logoUrl ? 'JKK' : 'JKK ETOILE'}</h4>
              <p className="text-sm text-text/80 leading-relaxed font-light">
                {config.heroSubtitle || 'Votre partenaire de confiance pour les voyages, visas, shopping de luxe et importation de véhicules.'}
              </p>
              <p className="text-xs text-text/50 mt-4 uppercase tracking-widest text-right">
                Version 1.2
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-text hover:text-gold transition-colors block"
        aria-label="Settings"
        title="Paramètres d'accessibilité et Infos"
      >
        <Settings size={20} />
      </button>

      {isOpen && createPortal(modalContent, document.body)}
    </>
  );
}

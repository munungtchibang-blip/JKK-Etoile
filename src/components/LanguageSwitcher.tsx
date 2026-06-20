import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState<'FR' | 'EN'>('FR');

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;)\s*googtrans=([^;]*)/);
    if (match) {
      if (match[1].endsWith('/en')) {
        setCurrentLang('EN');
      } else {
        setCurrentLang('FR');
      }
    }
  }, []);

  const switchLanguage = (lang: 'FR' | 'EN') => {
    setCurrentLang(lang);

    const langCode = lang === 'EN' ? 'en' : 'fr';

    // 1. Try to use the Google Translate combo box if it exists
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (combo) {
      combo.value = langCode;
      combo.dispatchEvent(new Event('change'));
      return; // Stop here if we successfully triggered it
    }

    // 2. Fallback: manually set cookies and reload if combo is not available yet
    if (lang === 'FR') {
      document.cookie = "googtrans=/fr/fr; path=/";
      document.cookie = "googtrans=/auto/fr; path=/";
    } else {
      document.cookie = "googtrans=/fr/en; path=/";
      document.cookie = "googtrans=/auto/en; path=/";
    }
    
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-1 bg-navy-800/40 border border-gold-muted/20 rounded-full p-1 backdrop-blur-sm shadow-inner overflow-hidden">
      <Globe size={14} className="text-gold-muted ml-1" />
      <div className="flex">
        <button
          onClick={() => switchLanguage('FR')}
          className={`px-2 py-1 text-[10px] font-bold rounded-full transition-all ${
            currentLang === 'FR' 
              ? 'bg-gold text-navy shadow-sm' 
              : 'text-text/70 hover:text-white hover:bg-white/5'
          }`}
        >
          FR
        </button>
        <button
          onClick={() => switchLanguage('EN')}
          className={`px-2 py-1 text-[10px] font-bold rounded-full transition-all ${
            currentLang === 'EN' 
              ? 'bg-gold text-navy shadow-sm' 
              : 'text-text/70 hover:text-white hover:bg-white/5'
          }`}
        >
          EN
        </button>
      </div>
    </div>
  );
}

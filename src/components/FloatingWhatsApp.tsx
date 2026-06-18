import { MessageCircle } from 'lucide-react';
import { useSiteConfig } from './SiteContext';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function FloatingWhatsApp() {
  const { config } = useSiteConfig();
  const [isOnline, setIsOnline] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState("");
  const location = useLocation();

  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      } catch (e) {
        console.error("Web Audio API not supported", e);
      }
    }
  }, []);

  const playHoverSound = useCallback(() => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx || ctx.state === 'suspended') return; // Might be suspended if no user interaction yet
    
    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch(e) {
      // Ignore errors if audio fails to play
    }
  }, [initAudio]);

  const playClickSound = useCallback(() => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    
    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.15);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch(e) {
      // Ignore errors
    }
  }, [initAudio]);

  useEffect(() => {
    const checkOnlineStatus = () => {
      const now = new Date();
      // Heure de Kinshasa (WAT, UTC+1)
      const currentHourWAT = (now.getUTCHours() + 1) % 24;
      const currentMinute = now.getUTCMinutes();
      const currentDay = now.getUTCDay(); // 0 = Dimanche, 1 = Lundi, etc.

      let online = false;
      if (currentDay >= 1 && currentDay <= 5) {
        // Lundi - Vendredi: 08:00 - 17:00
        online = currentHourWAT >= 8 && currentHourWAT < 17;
      } else if (currentDay === 6) {
        // Samedi: 09:00 - 13:00
        online = currentHourWAT >= 9 && currentHourWAT < 13;
      }
      setIsOnline(online);
      
      const timeStr = `${currentHourWAT.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')} (Kinshasa)`;
      setCurrentTimeStr(timeStr);
    };

    checkOnlineStatus();
    const interval = setInterval(checkOnlineStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const whatsappNumber = "243826636212";

  const getWelcomeMessage = () => {
    switch (location.pathname) {
      case '/flights': return "Bonjour, je souhaite avoir des informations sur les vols et billets d'avion.";
      case '/visas': return "Bonjour, je souhaite me renseigner sur les procédures de visa.";
      case '/shop': return "Bonjour, je suis intéressé par certains produits de la Boutique Express.";
      case '/cars': return "Bonjour, je souhaite me renseigner sur l'importation de véhicules.";
      case '/contact': return "Bonjour, je souhaite vous contacter pour une demande d'assistance.";
      default: return "Bonjour, je souhaite avoir plus de renseignements sur vos services.";
    }
  };
  const defaultMessage = encodeURIComponent(getWelcomeMessage());

  return (
    <motion.a
      href={`https://wa.me/${whatsappNumber}?text=${defaultMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group flex items-center justify-center"
      aria-label="Contactez-nous sur WhatsApp"
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onMouseEnter={playHoverSound}
      onClick={playClickSound}
    >
      <div className="absolute -top-1 -right-1 z-10 flex h-4 w-4">
        <AnimatePresence mode="wait">
          {isOnline ? (
            <motion.div 
              key="online"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative flex h-4 w-4"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 duration-1000"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#25D366] border-2 border-[#13192b]"></span>
              
              {/* Tooltip */}
              <span className="absolute -top-12 right-0 w-max opacity-0 group-hover:-translate-y-2 group-hover:opacity-100 transition-all duration-300 pointer-events-none px-3 py-1.5 bg-[#25D366] text-[#0f172a] text-[10px] font-bold tracking-widest uppercase rounded shadow-lg shadow-green-500/20 text-center">
                Nous sommes en ligne
                <br />
                <span className="text-[9px] font-medium opacity-80">{currentTimeStr}</span>
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="offline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative flex h-4 w-4"
            >
              <span className="relative inline-flex rounded-full h-4 w-4 bg-gray-400 border-2 border-[#13192b]"></span>
              
              {/* Tooltip */}
              <span className="absolute -top-12 right-0 w-max opacity-0 group-hover:-translate-y-2 group-hover:opacity-100 transition-all duration-300 pointer-events-none px-3 py-1.5 bg-gray-800 text-white text-[10px] font-bold tracking-widest uppercase rounded shadow-lg shadow-black/20 border border-gray-700 text-center">
                Laissez un message
                <br />
                <span className="text-[9px] font-medium opacity-80">{currentTimeStr}</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30 duration-[3000ms]"></span>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg animate-pulse">
        <MessageCircle size={32} />
      </span>
    </motion.a>
  );
}

import { useParams, Link } from 'react-router-dom';
import { useSiteConfig } from '../components/SiteContext';
import { Plane, FileText, ShoppingBag, Car, Building2, ShieldCheck, CreditCard, Package, RefreshCcw, Star, ChevronLeft, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { LazyImage } from '../components/LazyImage';
import { motion } from 'motion/react';

const ICON_MAP: Record<string, any> = {
  Plane,
  FileText,
  ShoppingBag,
  Car,
  Building2,
  ShieldCheck,
  CreditCard,
  Package,
  RefreshCcw,
  Star
};

export default function ServiceDetail() {
  const { id } = useParams();
  const { config } = useSiteConfig();
  
  const service = config.services.find(s => s.id === id);

  if (!service) {
    return (
      <div className="mx-auto max-w-4xl px-4 pt-[280px] pb-16 sm:px-6 lg:px-8 min-h-[80vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-light text-text mb-4">Service introuvable</h1>
        <Link to="/" className="text-gold flex items-center gap-2 hover:text-[#d4b069]">
          <ChevronLeft size={16} /> Retour à l'accueil
        </Link>
      </div>
    );
  }

  const IconComponent = ICON_MAP[service.iconName] || Star;

  // Split content into paragraphs or features for distinct icons
  const contentParagraphs = (service.content || service.description).split('\n').filter(p => p.trim() !== '');

  return (
    <div className="pt-24 min-h-screen bg-navy pb-20">
      {service.imageUrl && (
        <div className="w-full h-64 md:h-80 relative mb-12">
          <LazyImage 
            src={service.imageUrl} 
            alt={service.title} 
            className="w-full h-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent"></div>
          <div className="absolute inset-0 bg-navy/40 backdrop-blur-[3px]"></div>
        </div>
      )}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`min-h-[80vh] ${!service.imageUrl ? 'mt-12' : 'relative z-10 -mt-24'}`}
    >
      <div className="mb-8">
        <Link to="/" className="text-gold/80 hover:text-gold flex items-center gap-2 mb-8 text-sm  uppercase tracking-wider transition-colors inline-block w-fit">
          <ChevronLeft size={16} /> Retour
        </Link>
        <div className="flex items-center gap-6 mb-8 bg-glass backdrop-blur-md p-6 lg:p-8 rounded-[2rem] border border-gold-muted/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center border border-gold/30 bg-gold/5 text-gold rounded-full shadow-[0_0_15px_rgba(212,176,105,0.2)] bg-navy">
            <IconComponent size={32} />
          </div>
          <div>
            <span className="text-[12px] uppercase tracking-[4px] text-gold mb-2 block font-semibold drop-shadow-md">Détail du Service</span>
            <h1 className="text-4xl font-display text-gold sm:text-5xl drop-shadow-md">{service.title}</h1>
          </div>
        </div>
        
        <div className="bg-[#070c1d]/60 backdrop-blur-md border border-white/10 p-8 md:p-12 text-text rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3 mb-8">
            <Info className="text-gold" size={24} />
            <h2 className="text-xl font-light text-gold m-0">À propos de ce service</h2>
          </div>
          
          <div className="space-y-6">
            {contentParagraphs.map((paragraph, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
                className="flex items-start gap-4"
              >
                <div className="mt-1 flex-shrink-0">
                  <CheckCircle2 size={18} className="text-gold/70" />
                </div>
                <p className="text-[15px] text-text/90 font-medium leading-relaxed m-0 text-pretty">
                  {paragraph}
                </p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 pt-10 border-t border-white/10"
          >
            <h3 className="text-[13px] font-bold uppercase tracking-[2px] text-text mb-4">Besoin de plus d'informations ?</h3>
            <p className="text-text/70 mb-8 font-light text-[15px]">Notre équipe est à votre disposition pour vous accompagner et répondre à toutes vos questions.</p>
            <div className="flex flex-col sm:flex-row gap-4">
               <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-gold px-8 py-3.5 text-xs tracking-[2px] uppercase font-bold text-[#0f172a] transition-all hover:bg-[#d4b069] rounded-full shadow-lg hover:shadow-gold/20 hover:-translate-y-0.5">
                 Nous Contacter
                 <ArrowRight size={16} />
               </Link>
               <a href={`https://wa.me/${"243826636212"}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center border border-gold/50 text-gold shadow-sm px-8 py-3.5 text-xs tracking-[2px] uppercase font-bold transition-all hover:bg-gold/10 hover:border-gold rounded-full">
                 WhatsApp
               </a>
            </div>
          </motion.div>
        </div>
      </div>
      </motion.div>
</div>
</div>
  );
}

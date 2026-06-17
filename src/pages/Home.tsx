import { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Plane, FileText, ShoppingBag, Car, Star, ArrowRight, X, Building2, ShieldCheck, CreditCard, Package, RefreshCcw } from 'lucide-react';
import { useSiteConfig } from '../components/SiteContext';
import { LazyImage } from '../components/LazyImage';

const ICON_MAP: Record<string, any> = {
  Plane,
  FileText,
  ShoppingBag,
  Car,
  Building2,
  ShieldCheck,
  CreditCard,
  Package,
  RefreshCcw
};

const TESTIMONIALS = [
  {
    name: 'Marc Kabamba',
    role: 'Commerçant',
    content: 'Un service impeccable pour mes achats à Dubai. Mes colis arrivent toujours à temps à Ndolo.',
  },
  {
    name: 'Sarah Mulanga',
    role: 'Voyageuse régulière',
    content: 'J\'ai obtenu mon visa en 48h. Leur équipe est super réactive sur WhatsApp.',
  },
  {
    name: 'Jean-Paul Ndaye',
    role: 'Entrepreneur',
    content: 'Ma voiture est arrivée au port de Matadi exactement comme sur les photos. Très professionnels.',
  },
  {
    name: 'Alice Mbomba',
    role: 'Directrice Achats',
    content: 'JKK ETOILE facilite nos imports de matériel de bureau depuis Dubai. Simplicité, sécurité et rapidité.',
  },
  {
    name: 'David Kitenge',
    role: 'Importateur',
    content: 'Ils ont géré de A à Z toutes les formalités de mon véhicule. Je suis vraiment satisfait du suivi.',
  },
  {
    name: 'Mireille K.',
    role: 'Boutique Owner',
    content: 'Excellent accompagnement pour le shopping B2B. Je recommande pour le commerce au détails.',
  }
];

const MARQUEE_TESTIMONIALS = [...TESTIMONIALS, ...TESTIMONIALS];

const NEWS = [
  {
    title: 'Nouvelles régulations de visa pour Dubai en 2024',
    date: '15 Mai 2024',
    summary: 'Découvrez les derniers changements concernant les visas touristiques et affaires pour les ressortissants congolais.',
    link: '/visas',
    image: 'https://images.unsplash.com/photo-1546412414-e1885259563a?q=80&w=1770&auto=format&fit=crop'
  },
  {
    title: 'Offre spéciale sur les billets d\'avion Kinshasa - Dubai',
    date: '02 Mai 2024',
    summary: 'Profitez de tarifs réduits sur les vols directs en réservant avant la fin de ce mois.',
    link: '/flights',
    image: 'https://images.unsplash.com/photo-1436491865332-7a615061c4ca?q=80&w=1774&auto=format&fit=crop'
  },
  {
    title: 'Arrivage de nouveaux véhicules importés',
    date: '28 Avr 2024',
    summary: 'Consultez notre dernier catalogue de véhicules d\'occasion et neufs fraîchement arrivés d\'importation.',
    link: '/cars',
    image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1887&auto=format&fit=crop'
  }
];

export default function Home() {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [activeServiceCategory, setActiveServiceCategory] = useState<'all' | 'voyage' | 'import-export' | 'finance'>('all');
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 400]);
  const { config } = useSiteConfig();

  const activeAnnouncements = (config.announcements || []).filter(a => a.active);
  const displayNews = activeAnnouncements.length > 0 
    ? activeAnnouncements.map(a => ({
        title: a.title,
        date: a.date,
        summary: a.description,
        link: a.type === 'arrivage' ? '/cars' : a.type === 'offre' ? '/shop' : '/contact',
        image: a.image || 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1887&auto=format&fit=crop',
        label: a.type
      })).slice(0, 3)
    : NEWS;

  const approvedReviews = (config.reviews || []).filter((r: any) => r.status === 'approved');
  const displayTestimonials = approvedReviews.length > 0 ? approvedReviews.map((r: any) => ({
      name: r.name,
      role: r.service || 'Client(e)',
      content: r.comment
  })) : MARQUEE_TESTIMONIALS;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex w-full flex-col"
    >
      {/* Hero Section */}
      <section 
        className="relative flex min-h-[85vh] w-full items-center justify-center overflow-hidden bg-navy"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1.1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url('${config.heroImageUrl}')`,
            y,
          }}
        />
        <div className="absolute inset-0 z-0 bg-black/30"></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-navy/50 via-transparent to-navy/10"></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-navy via-navy/80 to-transparent"></div>
        
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 pt-[280px] pb-32 sm:px-6 lg:px-8 flex flex-col items-center text-center">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[12px] uppercase tracking-[4px] text-gold mb-5 block"
            >
              Excellence in Mobility
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 text-5xl sm:text-6xl lg:text-[82px] leading-[0.95] font-light text-text drop-shadow-lg text-balance whitespace-pre-wrap"
            >
              {config.heroTitle}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mx-auto mb-10 max-w-xl text-lg text-text/90 font-medium drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] text-balance whitespace-pre-wrap"
            >
              {config.heroSubtitle}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                to="/flights"
                className="flex items-center justify-center gap-2 rounded bg-gold px-8 py-4 text-xs tracking-widest uppercase font-bold text-[#0f172a] shadow-xl transition-transform hover:bg-[#d4b069] hover:scale-105"
              >
                Réserver un vol
              </Link>
              <Link
                to="/contact"
                className="flex items-center justify-center gap-2 rounded border border-gold bg-navy/80 backdrop-blur-md px-8 py-4 text-xs tracking-widest uppercase font-bold text-text shadow-lg transition-all hover:bg-navy"
              >
                Contactez-nous
              </Link>
            </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="bg-navy-800 py-24 border-y border-gold-muted overflow-hidden"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <span className="text-[12px] uppercase tracking-[4px] text-gold mb-2 block">Explorer</span>
            <h2 className="text-3xl font-light text-text sm:text-4xl">Nos Services</h2>
            <p className="mt-4 text-sm text-text/90 font-medium  uppercase tracking-wider">Un accompagnement sur-mesure pour vos ambitions internationales.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {[
              { id: 'all', label: 'Tous les Services' },
              { id: 'voyage', label: 'Voyage & Visas' },
              { id: 'import-export', label: 'Import-Export' },
              { id: 'finance', label: 'Services Financiers' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveServiceCategory(tab.id as 'all' | 'voyage' | 'import-export' | 'finance')}
                className={`px-4 py-2 md:px-6 md:py-2.5 text-[10px] md:text-[11px] uppercase tracking-widest font-semibold transition-all border ${
                  activeServiceCategory === tab.id
                    ? 'bg-gold border-gold text-[#0f172a]'
                    : 'bg-transparent border-gold-muted/50 text-text/70 hover:text-gold hover:border-gold'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence>
              {(config.services || []).filter(service => {
                if (activeServiceCategory === 'all') return true;
                const isVoyage = ['/flights', '/visas', '/hotel'].includes(service.link) || service.title.toLowerCase().includes('voyage') || service.title.toLowerCase().includes('visa') || service.title.toLowerCase().includes('bilre');
                const isImportExport = ['/shop', '/cars', '/cargo'].includes(service.link) || service.title.toLowerCase().includes('import') || service.title.toLowerCase().includes('boutique') || service.title.toLowerCase().includes('cargo');
        const isFinance = ['/mobile-money-service', '/money-transfer'].includes(service.link) || service.title.toLowerCase().includes('argent') || service.title.toLowerCase().includes('pay') || service.title.toLowerCase().includes('money') || service.title.toLowerCase().includes('mobile');
                if (activeServiceCategory === 'voyage') return isVoyage;
                if (activeServiceCategory === 'import-export') return isImportExport;
                if (activeServiceCategory === 'finance') return isFinance;
                return true;
              }).map((service, index) => {
                const IconComponent = ICON_MAP[service.iconName] || Star;
                const isBoutique = service.id === '2' || service.title.toLowerCase().includes('boutique');
                const displayImage = isBoutique && config.shopCoverImage ? config.shopCoverImage : service.imageUrl;

                return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link 
                    to={service.link}
                    className="h-full group flex flex-col rounded-2xl bg-glass border border-gold-muted/30 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_40px_-15px_rgba(212,176,105,0.4)]"
                  >
                    {displayImage && (
                      <div className="relative h-48 w-full overflow-hidden flex-shrink-0 bg-navy-800">
                        <LazyImage src={displayImage} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    )}
                    
                    <div className={`p-6 flex flex-col flex-grow relative z-10 ${!displayImage ? 'pt-6' : ''}`}>
                      <div className={`mb-6 flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 text-gold transition-colors group-hover:bg-gold group-hover:text-[#0f172a] shadow-sm backdrop-blur-sm ${displayImage ? '-mt-12 relative z-20 border-4 border-navy' : ''}`}>
                        <IconComponent size={24} />
                      </div>
                      <h3 className="mb-3 text-[14px] uppercase tracking-widest font-semibold text-text">{service.title}</h3>
                      <p className="mb-8 flex-grow text-sm text-text/80 leading-relaxed font-light text-pretty">{service.description}</p>
                      <div className="mt-auto flex items-center text-[11px] uppercase tracking-widest font-semibold text-gold transition-colors">
                        Découvrir <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </motion.section>

      {/* Latest News */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="bg-navy py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <span className="text-[12px] uppercase tracking-[4px] text-gold mb-2 block">Journal</span>
            <h2 className="text-3xl font-light text-text sm:text-4xl">Actualités & Perspectives</h2>
          </motion.div>
          
          <div className="relative w-full overflow-hidden mb-12">
            <div className="absolute top-0 left-0 bottom-0 w-8 md:w-24 bg-gradient-to-r from-navy-800 to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 bottom-0 w-8 md:w-24 bg-gradient-to-l from-navy-800 to-transparent z-10 pointer-events-none" />
            
            <div className="flex w-[200%] md:w-[200%] animate-marquee gap-6 py-4 px-4 hover:animation-paused">
              {[...displayNews, ...displayNews, ...displayNews, ...displayNews].map((article, idx) => (
                <div
                  key={idx}
                  className="w-[280px] md:w-[400px] shrink-0 group flex flex-col border border-gold-muted/30 bg-glass overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-gold/10 rounded-2xl"
                >
                  <div className="h-40 md:h-48 overflow-hidden relative">
                    <div className="absolute inset-0 bg-navy/20 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />
                    <LazyImage src={article.image} alt={article.title} className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col flex-grow">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] uppercase tracking-widest text-gold font-semibold">{article.date}</span>
                      {('label' in article && article.label) && <span className="text-[9px] uppercase tracking-wider bg-gold/20 text-gold px-2 py-1 rounded">{article.label === 'arrivage' ? 'Nouvel Arrivage' : article.label === 'offre' ? 'Offre Spéciale' : 'Annonce'}</span>}
                    </div>
                    <h3 className="text-base md:text-lg font-display text-text mb-4 leading-tight">{article.title}</h3>
                    <p className="text-xs md:text-sm text-text/90 font-medium mb-6 flex-grow leading-relaxed text-pretty line-clamp-3">{article.summary}</p>
                    <button 
                      onClick={() => setSelectedAnnouncement(article)}
                      className="inline-flex items-center text-[10px] md:text-[11px] uppercase tracking-widest text-text/90 font-medium transition-colors hover:text-gold self-start"
                      aria-label={`Lire la suite sur ${article.title}`}
                    >
                      Lire la suite <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="bg-navy py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <span className="text-[12px] uppercase tracking-[4px] text-gold mb-2 block">L'Essence JKK</span>
            <h2 className="text-3xl font-light text-text sm:text-4xl">L'Excellence d'une Connexion Privilégiée</h2>
          </div>
          
          <div className="relative w-full overflow-hidden mb-12">
            <div className="absolute top-0 left-0 bottom-0 w-8 md:w-24 bg-gradient-to-r from-navy to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 bottom-0 w-8 md:w-24 bg-gradient-to-l from-navy to-transparent z-10 pointer-events-none" />
            
            <div className="flex w-[200%] md:w-[200%] animate-marquee gap-6 py-4 px-4 hover:animation-paused">
              {[...displayTestimonials, ...displayTestimonials].map((testimonial, idx) => (
                <div
                  key={idx}
                  className="w-[280px] md:w-[400px] shrink-0 rounded-2xl border border-gold-muted/30 bg-glass p-8 relative overflow-hidden transition-all duration-300 cursor-default hover:shadow-xl hover:border-gold-muted/50"
                >
                  <div className="absolute top-0 right-0 p-6 text-gold/10 font-display text-8xl leading-none italic select-none">"</div>
                  <div className="relative z-10 font-sans flex flex-col h-full">
                    <div className="mb-6 flex text-gold space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                    <p className="mb-8 text-text/80 italic font-light text-[15px] leading-relaxed flex-grow">"{testimonial.content}"</p>
                    <div className="flex items-center gap-4 border-t border-gold-muted/30 pt-6 mt-auto">
                      <div className="w-10 h-10 shrink-0 rounded-full bg-gold/20 flex items-center justify-center text-gold font-display text-lg shadow-inner">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] uppercase tracking-wider font-bold text-text truncate">{testimonial.name}</p>
                        <p className="text-[10px] uppercase tracking-widest text-gold mt-1 truncate">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Announcement Modal */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/90 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={() => setSelectedAnnouncement(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-navy-800 border border-gold-muted/30 p-8 rounded-xl max-w-2xl w-full text-text relative flex flex-col max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedAnnouncement(null)}
                className="absolute top-4 right-4 text-text/60 hover:text-gold transition-colors z-10 bg-navy/50 p-2 rounded-full"
              >
                <X size={24} />
              </button>
              
              <div className="overflow-y-auto pr-2 custom-scrollbar">
                {selectedAnnouncement.image && (
                  <div className="w-full aspect-video mb-6 rounded-lg overflow-hidden relative">
                    <LazyImage src={selectedAnnouncement.image} alt={selectedAnnouncement.title} className="w-full h-full object-cover" />
                  </div>
                )}
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] uppercase tracking-widest text-gold font-semibold">{selectedAnnouncement.date}</span>
                  {('label' in selectedAnnouncement && selectedAnnouncement.label) && <span className="text-[9px] uppercase tracking-wider bg-gold/20 text-gold px-2 py-1 rounded">{selectedAnnouncement.label === 'arrivage' ? 'Nouvel Arrivage' : selectedAnnouncement.label === 'offre' ? 'Offre Spéciale' : 'Annonce'}</span>}
                </div>
                
                <h2 className="text-3xl font-display mb-4 text-text">{selectedAnnouncement.title}</h2>
                <div className="text-sm text-text/80 leading-relaxed font-light whitespace-pre-wrap mb-8">
                  {selectedAnnouncement.description || selectedAnnouncement.summary}
                </div>
                
                <div className="mt-auto flex justify-end">
                  <Link 
                     to={selectedAnnouncement.link}
                     className="px-6 py-3 bg-gold text-[#0f172a] font-semibold text-xs uppercase tracking-wider rounded transition-colors hover:bg-[#d4b069]"
                  >
                     En savoir plus
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

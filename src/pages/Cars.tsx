import { Reviews } from "../components/Reviews";
import React, { useState, useEffect } from 'react';
import { Car, Fuel, Calendar, Settings, Search, Gauge, Calculator, ChevronDown, ChevronUp, CheckCircle2, Loader2, Info, MapPin, Package, Ship, CheckCircle, Image as ImageIcon, X, ChevronLeft, ChevronRight, MessageCircle, Eye, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteConfig } from '../components/SiteContext';
import { LazyImage } from '../components/LazyImage';

const TRACKING_STEPS = [
  { step: 'Achat', icon: Package, date: '12 Mai 2024', status: 'completed', location: 'Dubai, EAU', detail: 'Véhicule sécurisé et documents préparés.' },
  { step: 'Port', icon: Ship, date: '18 Mai 2024', status: 'completed', location: 'Port Jebel Ali', detail: 'Inspection douanière et préparation à l\'embarquement.' },
  { step: 'Transit Maritime', icon: MapPin, date: 'En cours', status: 'current', location: 'Océan Indien', detail: 'Navire en route vers le continent africain.' },
  { step: 'Dédouanement', icon: Search, date: 'Prévu', status: 'pending', location: 'Port de Matadi', detail: 'Attente d\'arrivée pour lancement procédure douanière.' },
  { step: 'Livraison', icon: CheckCircle, date: 'Prévu', status: 'pending', location: 'Kinshasa', detail: 'Mise à disposition au client.' }
];

export default function Cars() {
  const { config, updateConfig } = useSiteConfig();
  const CARS = config.cars || [];
  const [trackingStatus, setTrackingStatus] = useState<string | null>(null);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [expandedCar, setExpandedCar] = useState<number | null>(null);
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [transmissionFilter, setTransmissionFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [compareMode, setCompareMode] = useState(false);
  const [selectedCars, setSelectedCars] = useState<number[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [quickViewCar, setQuickViewCar] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const [cart, setCart] = useState<any[]>(() => {
    const saved = localStorage.getItem('jkk_cars_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('jkk_cars_cart', JSON.stringify(cart));
  }, [cart]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertTargetCar, setAlertTargetCar] = useState<number | null>(null);
  const [alertType, setAlertType] = useState('email');
  const [alertContact, setAlertContact] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);
  
  const addToCart = (car: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === car.id);
      if (existing) return prev;
      return [...prev, car];
    });
    setIsCartOpen(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEndGallery = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      setGalleryIndex((prev) => (prev + 1) % galleryImages.length);
    }
    if (isRightSwipe) {
      setGalleryIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  const [isCarsLoading, setIsCarsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCarsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggleCarDetails = (id: number) => {
    setExpandedCar(expandedCar === id ? null : id);
  };

  const openGallery = (images: string[]) => {
    setGalleryImages(images);
    setGalleryIndex(0);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGalleryIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGalleryIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const brands = ['all', 'Toyota', 'Lexus', 'Hyundai'];
  const transmissions = ['all', 'Automatique', 'Manuelle'];
  let filteredCars = brandFilter === 'all' ? CARS : CARS.filter(c => c.brand === brandFilter);
  
  if (transmissionFilter !== 'all') {
    filteredCars = filteredCars.filter(c => c.specs.trans === transmissionFilter);
  }

  if (sortOrder === 'asc') {
    filteredCars = [...filteredCars].sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'desc') {
    filteredCars = [...filteredCars].sort((a, b) => b.price - a.price);
  }

  const toggleCarSelection = (id: number) => {
    setSelectedCars(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : 
      prev.length < 3 ? [...prev, id] : prev
    );
  };

  const serviceInfo = config.services?.find(s => s.link === '/cars');

  return (
    <div className="pt-24 min-h-screen bg-navy pb-20">
      <div className="w-full h-64 md:h-80 relative mb-12">
        <LazyImage 
          src={serviceInfo?.imageUrl || "https://images.unsplash.com/photo-1549449852-f04bf025405e?q=80&w=2072&auto=format&fit=crop"}
          alt="Importation de Véhicules" 
          className="w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent"></div>
        <div className="absolute inset-0 bg-navy/40 backdrop-blur-[3px]"></div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-8 bg-glass backdrop-blur-md rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] mb-12 text-center relative z-10 -mt-24 max-w-3xl mx-auto border border-gold-muted/20"
      >
        <div className="inline-flex items-center justify-center p-4 bg-gold-muted/10 rounded-full mb-6">
          <Car size={32} className="text-gold" />
        </div>
        <span className="text-[12px] uppercase tracking-[4px] text-gold mb-4 block">Motors</span>
        <h1 className="text-3xl font-display text-gold mb-4 drop-shadow-md">
          Importation de Véhicules
        </h1>
        <p className="text-text/90 max-w-2xl mx-auto uppercase tracking-widest text-sm drop-shadow">
          {serviceInfo?.content || serviceInfo?.description || "Trouvez le véhicule idéal à Dubai."}
        </p>
      </motion.div>

      {/* Processus */}
      <div className="mb-20 bg-glass border border-gold-muted p-8 text-text relative overflow-hidden">
        <h3 className="text-[13px] uppercase tracking-[1px] font-semibold text-gold mb-8 text-center">Comment ça marche ?</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: '1', title: 'Sélection', desc: 'Choisissez votre véhicule ou confiez-nous la recherche.' },
            { step: '2', title: 'Inspection', desc: 'Nos experts à Dubai inspectent et valident le véhicule.' },
            { step: '3', title: 'Fret Maritime', desc: 'Embarquement sécurisé à destination du port de Matadi.' },
            { step: '4', title: 'Livraison', desc: 'Dédouanement et livraison clés en main à Kinshasa.' },
          ].map((item) => (
            <div key={item.step} className="text-center group">
              <div className="w-12 h-12 border border-gold text-gold rounded-full flex items-center justify-center font-light text-xl mx-auto mb-4 group-hover:bg-gold group-hover:text-[#0f172a] transition-colors">
                {item.step}
              </div>
              <h4 className="text-[11px] uppercase tracking-wider font-semibold mb-2">{item.title}</h4>
              <p className="text-text/90 font-medium text-[10px] uppercase tracking-widest ">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tracking Section */}
      <div className="mb-20 bg-glass border border-gold-muted p-8 text-text relative overflow-hidden">
        <h3 className="text-[13px] uppercase tracking-[1px] font-semibold text-gold mb-4">Suivi de Véhicule</h3>
        <p className="text-[11px] uppercase tracking-widest text-text/90 font-medium  mb-6">
          Entrez votre numéro de châssis pour suivre l'état de votre importation.
        </p>
        <form className="flex flex-col sm:flex-row gap-4 max-w-2xl" onSubmit={(e) => {
          e.preventDefault();
          const input = (e.currentTarget.elements.namedItem('chassis') as HTMLInputElement).value;
          if (input) {
            setTrackingStatus(null);
            setIsTrackingLoading(true);
            setTimeout(() => {
              setTrackingStatus('En transit');
              setIsTrackingLoading(false);
            }, 1000);
          }
        }}>
          <input
            type="text"
            name="chassis"
            required
            defaultValue="JTD123456789"
            placeholder="EX: JTD723..."
            className="flex-1 bg-transparent border-b border-text/20 text-lg font-light text-text outline-none focus:border-gold pb-2 uppercase text-center sm:text-left px-2"
          />
          <button 
            type="submit"
            disabled={isTrackingLoading}
            className="flex items-center justify-center gap-2 bg-gold px-8 py-3 text-xs tracking-widest uppercase font-semibold text-[#0f172a] transition-colors hover:bg-[#d4b069] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isTrackingLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            <span className="hidden sm:inline">{isTrackingLoading ? 'Recherche...' : 'Suivre'}</span>
          </button>
        </form>

        <AnimatePresence>
          {trackingStatus && !isTrackingLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-12 pt-8 border-t border-gold-muted/30"
            >
             <h4 className="text-sm font-light text-text mb-8">Statut du dossier: <span className="text-gold font-semibold tracking-wider">JTD123456789</span></h4>
             
             <div className="relative">
                {/* Ligne verticale timeline */}
                <div className="absolute left-[19px] top-4 bottom-4 w-px bg-white/10 md:hidden"></div>
                
                <div className="flex flex-col md:flex-row justify-between gap-6 relative">
                  {/* Ligne horizontale timeline (desktop) */}
                  <div className="hidden md:block absolute left-4 right-4 top-5 h-px bg-white/10"></div>
                  
                  {TRACKING_STEPS.map((step, idx) => {
                    const isCompleted = step.status === 'completed';
                    const isCurrent = step.status === 'current';
                    return (
                      <div key={idx} className="flex md:flex-col gap-4 md:gap-3 relative z-10 md:w-1/5 md:items-center text-left md:text-center group">
                        {/* Point/Icone */}
                        <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center border-2 transition-colors ${
                          isCompleted ? 'bg-gold border-gold text-[#0f172a]' : 
                          isCurrent ? 'bg-navy border-gold text-gold shadow-[0_0_15px_rgba(212,176,105,0.4)]' : 
                          'bg-navy border-text/20 text-text/30'
                        }`}>
                          <step.icon size={16} />
                        </div>
                        
                        {/* Contenu */}
                        <div className="flex-1 pb-4 md:pb-0">
                          <h5 className={`text-[11px] uppercase tracking-wider font-semibold mb-1 ${isCompleted || isCurrent ? 'text-text' : 'text-text/40'}`}>
                            {step.step}
                          </h5>
                          <span className={`block text-[9px] uppercase tracking-widest mb-2 ${isCurrent ? 'text-gold' : 'text-text/90 font-medium'}`}>
                            {step.date}
                          </span>
                          <span className="block text-[10px] text-text/90 font-medium mb-1">
                            <MapPin size={10} className="inline mr-1" />{step.location}
                          </span>
                          <p className="text-[10px] text-text/40 font-light leading-relaxed hidden md:block opacity-0 group-hover:opacity-100 transition-opacity absolute top-full left-1/2 -translate-x-1/2 w-48 mt-2 bg-navy border border-gold-muted p-2 z-20 shadow-lg">
                            {step.detail}
                          </p>
                          <p className="text-[10px] text-text/40 font-light leading-relaxed md:hidden mt-2">
                            {step.detail}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
             </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gold-muted/30 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-text/90 font-medium mr-2">Marque :</span>
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => setBrandFilter(brand)}
              className={`px-4 py-2 text-[10px] uppercase tracking-wider rounded-full transition-all border outline-none focus:ring-1 focus:ring-gold ${brandFilter === brand ? 'bg-gold text-[#0f172a] border-gold' : 'text-text/90 font-medium border-text/10 hover:border-gold/50 hover:text-text bg-white/5'}`}
            >
              {brand === 'all' ? 'Toutes' : brand}
            </button>
          ))}
          
          <div className="h-4 w-px bg-white/20 mx-2 hidden md:block"></div>

          <span className="text-[10px] uppercase tracking-widest text-text/90 font-medium mr-2">Boîte :</span>
          {transmissions.map(trans => (
            <button
              key={trans}
              onClick={() => setTransmissionFilter(trans)}
              className={`px-4 py-2 text-[10px] uppercase tracking-wider rounded-full transition-all border outline-none focus:ring-1 focus:ring-gold ${transmissionFilter === trans ? 'bg-gold text-[#0f172a] border-gold' : 'text-text/90 font-medium border-text/10 hover:border-gold/50 hover:text-text bg-white/5'}`}
            >
              {trans === 'all' ? 'Toutes' : trans}
            </button>
          ))}
          
          <div className="h-4 w-px bg-white/20 mx-2 hidden md:block"></div>
          
          <button
            onClick={() => setSortOrder(prev => prev === 'none' ? 'asc' : prev === 'asc' ? 'desc' : 'none')}
            className={`flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-wider rounded-full transition-all border outline-none focus:ring-1 focus:ring-gold ${sortOrder !== 'none' ? 'bg-navy border-gold text-gold' : 'text-text/90 font-medium border-text/10 hover:border-gold/50 hover:text-text bg-white/5'}`}
          >
            Prix {sortOrder === 'asc' ? 'Croissant' : sortOrder === 'desc' ? 'Décroissant' : ''}
            {sortOrder === 'none' ? <ChevronDown size={14} className="opacity-50" /> : sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-text/90 font-medium cursor-pointer hover:text-text transition-colors">
            <input 
              type="checkbox" 
              checked={compareMode} 
              onChange={(e) => {
                setCompareMode(e.target.checked);
                if (!e.target.checked) setSelectedCars([]);
              }}
              className="accent-gold bg-navy border-gold w-4 h-4 rounded-sm cursor-pointer"
            />
            Mode Comparaison
          </label>

          {compareMode && (
            <button 
              disabled={selectedCars.length < 2}
              onClick={() => setShowCompareModal(true)}
              className="bg-gold text-[#0f172a] px-4 py-2 text-[10px] uppercase tracking-wider font-semibold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d4b069] transition-colors outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy shadow-lg"
            >
              Comparer ({selectedCars.length}/3)
            </button>
          )}

          <button
            onClick={() => {
              setAlertTargetCar(null);
              setAlertSuccess(false);
              setAlertContact('');
              setIsAlertModalOpen(true);
            }}
            className="flex items-center gap-2 text-gold hover:text-white transition-colors px-4 py-2 text-[10px] uppercase tracking-wider font-semibold rounded-full border border-gold/30 hover:border-gold hover:bg-gold/10"
          >
            <Bell size={14} />
            Créer une alerte
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={isCarsLoading ? "loading" : "loaded"}
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, y: 20 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {isCarsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="group flex flex-col overflow-hidden bg-glass border border-gold-muted/20 shadow-lg animate-pulse w-full">
                   <div className="aspect-[4/3] bg-white/5 relative">
                      <div className="absolute top-4 left-4 h-6 w-20 bg-white/10 rounded"></div>
                   </div>
                   <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between mb-4">
                         <div className="h-3 w-16 bg-white/10 rounded"></div>
                         <div className="h-3 w-16 bg-white/10 rounded"></div>
                      </div>
                      <div className="h-4 w-3/4 bg-white/10 rounded mb-6"></div>
                      
                      <div className="h-8 w-1/3 bg-white/10 rounded mb-4"></div>
                      
                      <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-4 mb-6">
                         <div className="h-10 w-full bg-white/10 rounded"></div>
                         <div className="h-10 w-full bg-white/10 rounded"></div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-auto">
                         <div className="h-10 w-full bg-white/10 rounded"></div>
                         <div className="h-10 w-full bg-white/10 rounded"></div>
                      </div>
                   </div>
                </div>
            ))
        ) : (
          filteredCars.map((car) => (
            <motion.div 
              key={car.id} 
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`group flex flex-col overflow-hidden bg-glass border rounded-xl shadow-md transition-all duration-300 ease-out hover:shadow-2xl hover:shadow-gold/15 ${selectedCars.includes(car.id) ? 'border-gold bg-gold/5' : 'border-gold-muted/50 hover:border-gold/80'}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-navy-800 cursor-pointer" onClick={() => setQuickViewCar(car.id)}>
                {compareMode && (
                  <div className="absolute top-4 right-4 z-20">
                    <label className="cursor-pointer" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox"
                        checked={selectedCars.includes(car.id)}
                        onChange={() => toggleCarSelection(car.id)}
                        disabled={!selectedCars.includes(car.id) && selectedCars.length >= 3}
                        className="w-5 h-5 accent-gold border-white/50 cursor-pointer outline-none focus:ring-2 focus:ring-gold"
                      />
                    </label>
                  </div>
                )}
                <LazyImage 
                  src={car.image} 
                  alt={`${car.brand} ${car.model}`} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 border border-gold bg-[#334155]/70 backdrop-blur-sm dark-glass-text px-3 py-1 text-[10px] uppercase tracking-widest text-gold z-10">
                  {car.condition}
                </div>
                <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button className="bg-[#334155]/70 backdrop-blur-md dark-glass-text border border-gold text-gold p-3 rounded-full hover:bg-gold hover:text-[#0f172a] transition-colors flex items-center gap-2 text-xs uppercase tracking-widest">
                      <Eye size={16} /> <span>Détails</span>
                   </button>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-gold">{car.brand}</span>
                  <span className="text-[10px] uppercase tracking-widest text-text/90 font-medium"><Calendar size={12} className="inline mr-1 text-gold"/>{car.year}</span>
                </div>
                
                <h3 className="mb-4 text-[13px] uppercase tracking-[1px] font-semibold text-text">{car.model}</h3>

                <div className="flex items-start justify-between flex-wrap gap-2 mb-4">
                  <div className="flex flex-col">
                    <span className="text-xl font-light text-text">{car.priceStr}</span>
                    <button className="text-[10px] text-text/90 font-medium hover:text-gold flex items-center gap-1 transition-colors mt-1 items-start">
                      <Calculator size={10} className="mt-[2px] shrink-0" />
                      <span className="text-left">Est. {(car.price / 48).toLocaleString('fr-FR', { maximumFractionDigits: 0 })}$ / mois<br/><span className="text-[8px] opacity-70">sur 48 mois</span></span>
                    </button>
                  </div>
                </div>
                
                <div className="mb-6 grid grid-cols-2 gap-4 border-y border-white/5 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-widest text-text/40">Kilométrage</span>
                    <div className="flex items-center gap-2 text-[11px] text-text font-light">
                      <Gauge size={14} className="text-gold" />
                      {car.specs.mileage}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-widest text-text/40">Carburant</span>
                    <div className="flex items-center gap-2 text-[11px] text-text font-light">
                      <Fuel size={14} className="text-gold" />
                      {car.specs.fuel}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-stretch gap-2 mb-2">
                  <div className="flex items-center justify-between gap-2">
                    <a 
                      href={`https://wa.me/${String(config.contactWhatsapp || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour, je suis intéressé par ce véhicule : ${car.brand} ${car.model} (${car.year}) à ${car.priceStr}.`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-transparent text-text/90 font-medium border border-text/20 px-2 py-2 text-[10px] sm:text-[11px] uppercase tracking-wider transition-all hover:bg-white/10 hover:text-text outline-none focus:ring-1 focus:ring-white/50 active:scale-95"
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                    <button 
                      onClick={() => {
                        setAlertTargetCar(car.id);
                        setAlertSuccess(false);
                        setAlertContact('');
                        setIsAlertModalOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-transparent text-gold font-medium border border-gold/30 px-2 py-2 text-[10px] sm:text-[11px] uppercase tracking-wider transition-all hover:bg-gold/10 hover:border-gold outline-none"
                    >
                      <Bell size={14} /> Alerte prix
                    </button>
                  </div>
                  <button onClick={() => addToCart(car)} className="w-full bg-green-500/10 border border-green-500/50 text-green-400 px-2 py-2.5 text-[10px] sm:text-[11px] uppercase tracking-wider transition-colors hover:bg-green-500 hover:text-text text-center flex items-center justify-center gap-1.5 outline-none focus:ring-1 focus:ring-green-500 font-semibold mb-6">
                    <Package size={14} /> Ajouter au Panier
                  </button>
                </div>

                <div className="mt-auto border-t border-gold-muted/50 pt-4">
                  <button 
                    onClick={() => toggleCarDetails(car.id)}
                    className="w-full flex items-center justify-between text-[10px] uppercase tracking-wider text-text/90 font-medium hover:text-text transition-colors outline-none focus:text-text"
                  >
                    Spécifications détaillées
                    <motion.div
                      animate={{ rotate: expandedCar === car.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={14} />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {expandedCar === car.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-3 pb-2">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border-b border-gold-muted/20 pb-3">
                            <div className="flex flex-col gap-1 group relative">
                               <span className="text-[9px] uppercase tracking-widest text-text/40 flex items-center gap-1 cursor-help">
                                 Kilométrage
                                 <Info size={10} />
                                 <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block w-32 bg-navy border border-gold-muted text-text text-[8px] p-2 z-50 shadow-xl rounded-sm">
                                    Distance totale parcourue par le véhicule
                                 </div>
                               </span>
                               <span className="text-[11px] text-text flex items-center gap-1"><Gauge size={12} className="text-gold"/> {car.specs.mileage}</span>
                            </div>
                            <div className="flex flex-col gap-1 group relative">
                               <span className="text-[9px] uppercase tracking-widest text-text/40 flex items-center gap-1 cursor-help">
                                 Transmission
                                 <Info size={10} />
                                 <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block w-32 bg-navy border border-gold-muted text-text text-[8px] p-2 z-50 shadow-xl rounded-sm">
                                    Type de boîte de vitesses du véhicule
                                 </div>
                               </span>
                               <span className="text-[11px] text-text flex items-center gap-1"><Settings size={12} className="text-gold"/> {car.specs.trans}</span>
                            </div>
                            <div className="flex flex-col gap-1 group relative">
                               <span className="text-[9px] uppercase tracking-widest text-text/40 flex items-center gap-1 cursor-help">
                                 Carburant
                                 <Info size={10} />
                                 <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block w-32 bg-navy border border-gold-muted text-text text-[8px] p-2 z-50 shadow-xl rounded-sm">
                                    Type de carburant du véhicule
                                 </div>
                               </span>
                               <span className="text-[11px] text-text flex items-center gap-1"><Fuel size={12} className="text-gold"/> {car.specs.fuel}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] uppercase tracking-widest text-gold/80 mb-1 tracking-wider">Options incluses</span>
                            <ul className="space-y-2 relative before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gold-muted/20">
                              {car.features.map((feature, idx) => (
                                <li key={idx} className="text-[10px] text-text/90 flex items-center gap-3 relative z-10 pl-1">
                                  <div className="bg-navy rounded-full">
                                    <CheckCircle2 size={10} className="text-gold" />
                                  </div>
                                  <span className="pt-0.5">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))
        )}
        </motion.div>
      </AnimatePresence>
      
      <div className="mt-16 text-center border border-gold-muted p-12 bg-navy-800">
        <p className="text-[11px] uppercase tracking-widest text-text/90 font-medium mb-6 ">Vous ne trouvez pas le modèle de vos rêves ?</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="bg-gold px-8 py-4 text-xs tracking-widest uppercase font-semibold text-[#0f172a] hover:bg-[#d4b069] transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-800 focus:ring-gold w-full sm:w-auto">
            Faire une demande sur mesure
          </button>
          <a href={`https://wa.me/${String(config.contactWhatsapp || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Bonjour, je souhaite avoir plus de détails concernant les véhicules.')}`} target="_blank" rel="noopener noreferrer" className="bg-transparent border border-gold/50 text-gold px-8 py-4 text-xs tracking-widest uppercase font-semibold hover:bg-gold/10 transition-all w-full sm:w-auto flex items-center justify-center gap-2 active:scale-95">
            Continuer la discussion sur WhatsApp
          </a>
        </div>
      </div>

      {/* Compare Modal */}
      <AnimatePresence>
        {showCompareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#334155]/85 backdrop-blur-xl dark-glass-text overflow-y-auto"
            onClick={() => setShowCompareModal(false)}
          >
            <button 
              className="absolute top-6 right-6 text-text/90 font-medium hover:text-text p-2 rounded-full border border-text/10 hover:bg-white/10 transition-colors"
              onClick={() => setShowCompareModal(false)}
            >
              <X size={24} />
            </button>
            <div className="relative w-full max-w-6xl max-h-[90vh] bg-navy border border-gold-muted flex flex-col p-6 overflow-hidden mt-8" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-light text-text mb-6 tracking-wide text-center">Comparaison de véhicules</h2>
              
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-6 min-w-max">
                  {selectedCars.map(carId => {
                    const c = CARS.find(v => v.id === carId)!;
                    return (
                      <div key={c.id} className="w-72 flex flex-col border border-text/10 bg-glass p-4">
                        <LazyImage src={c.image} alt={c.model} className="w-full aspect-[4/3] object-cover mb-4" />
                        <h3 className="text-sm font-semibold text-text uppercase tracking-wider mb-1">{c.brand} {c.model}</h3>
                        <p className="text-xl font-light text-gold mb-4">{c.priceStr}</p>
                        
                        <div className="space-y-4 flex-1">
                          <div>
                            <span className="text-[9px] uppercase tracking-widest text-text/40 block mb-1">Année</span>
                            <span className="text-xs text-text pb-2 border-b border-text/10 block">{c.year}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase tracking-widest text-text/40 block mb-1">Condition</span>
                            <span className="text-xs text-text pb-2 border-b border-text/10 block">{c.condition}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase tracking-widest text-text/40 block mb-1">Kilométrage</span>
                            <span className="text-xs text-text pb-2 border-b border-text/10 block">{c.specs.mileage}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase tracking-widest text-text/40 block mb-1">Carburant</span>
                            <span className="text-xs text-text pb-2 border-b border-text/10 block">{c.specs.fuel}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase tracking-widest text-text/40 block mb-1">Transmission</span>
                            <span className="text-xs text-text pb-2 border-b border-text/10 block">{c.specs.trans}</span>
                          </div>
                        </div>

                        <button onClick={() => addToCart(c)} className="mt-6 w-full text-center bg-transparent border border-gold text-gold px-4 py-2 text-[10px] uppercase tracking-wider transition-colors hover:bg-gold hover:text-[#0f172a] font-semibold">
                          Ajouter au Panier
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewCar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0f172a]/90 backdrop-blur-md overflow-y-auto"
            onClick={() => setQuickViewCar(null)}
          >
            <div className="min-h-full flex flex-col items-center justify-center p-4 py-12">
              {(() => {
                const car = CARS.find((c) => c.id === quickViewCar);
                if (!car) return null;
                return (
                  <div 
                    className="relative w-full max-w-4xl bg-navy border border-gold/20 flex flex-col md:flex-row overflow-hidden shadow-2xl rounded-2xl" 
                    onClick={(e) => e.stopPropagation()}
                  >
                  <button 
                    className="absolute top-4 right-4 text-text/90 font-medium hover:text-text p-2 rounded-full border border-text/10 hover:bg-white/10 transition-colors z-20"
                    onClick={() => setQuickViewCar(null)}
                  >
                    <X size={20} />
                  </button>
                  
                  <div className="md:w-1/2 aspect-video md:aspect-auto relative bg-navy-800">
                    <LazyImage src={car.image} alt={car.model} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="md:w-1/2 p-8 flex flex-col">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-widest text-gold">{car.brand}</span>
                      <span className="text-xs uppercase tracking-widest text-text/90 font-medium"><Calendar size={14} className="inline mr-1 text-gold"/>{car.year}</span>
                    </div>
                    
                    <h3 className="mb-2 text-2xl uppercase tracking-[1px] font-semibold text-text">{car.model}</h3>
                    <span className="text-3xl font-light text-gold mb-6 block">{car.priceStr}</span>
                    
                    <div className="grid grid-cols-2 gap-4 border-y border-text/10 py-6 mb-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-widest text-text/40">Kilométrage</span>
                        <div className="flex items-center gap-2 text-sm text-text font-light">
                          <Gauge size={16} className="text-gold" />
                          {car.specs.mileage}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-widest text-text/40">Carburant</span>
                        <div className="flex items-center gap-2 text-sm text-text font-light">
                          <Fuel size={16} className="text-gold" />
                          {car.specs.fuel}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-widest text-text/40">Boîte de vitesse</span>
                        <div className="flex items-center gap-2 text-sm text-text font-light">
                          <Settings size={16} className="text-gold" />
                          {car.specs.trans}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-widest text-text/40">Condition</span>
                        <div className="flex items-center gap-2 text-sm text-text font-light">
                          <CheckCircle2 size={16} className="text-gold" />
                          {car.condition}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-auto flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button 
                        onClick={() => addToCart(car)}
                        className="w-full sm:flex-1 bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 text-xs uppercase tracking-[2px] flex items-center justify-center gap-2 transition-colors hover:bg-green-500 hover:text-[#0f172a] font-bold rounded shadow-sm"
                      >
                        <Package size={16} /> Au Panier
                      </button>
                      <a 
                        href={`https://wa.me/${String(config.contactWhatsapp || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour, je souhaite avoir plus d'informations concernant ce véhicule : ${car.brand} ${car.model} (${car.year}) à ${car.priceStr}.`)}`}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-full sm:flex-1 bg-[#25D366] text-[#0f172a] px-4 py-3 text-xs uppercase tracking-[2px] flex items-center justify-center gap-2 transition-all hover:bg-[#20b858] font-bold rounded shadow-md"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              );
            })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Modal */}
      <AnimatePresence>
        {galleryImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#334155]/85 backdrop-blur-xl dark-glass-text"
            onClick={() => setGalleryImages([])}
          >
            <button 
              className="absolute top-6 right-6 text-text/90 font-medium hover:text-text p-2 rounded-full border border-text/10 hover:bg-white/10 transition-colors"
              onClick={() => setGalleryImages([])}
            >
              <X size={24} />
            </button>
            <div 
              className="relative w-full max-w-5xl aspect-video flex items-center justify-center cursor-grab active:cursor-grabbing" 
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEndGallery}
            >
              <motion.img 
                key={galleryIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={galleryImages[galleryIndex]} 
                alt="Vue du véhicule" 
                className="max-w-full max-h-[85vh] object-contain border border-gold/20 shadow-2xl"
              />
              
              {galleryImages.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-navy/80 text-text rounded-full hover:bg-gold hover:text-[#0f172a] transition-colors border border-text/10"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-navy/80 text-text rounded-full hover:bg-gold hover:text-[#0f172a] transition-colors border border-text/10"
                  >
                    <ChevronRight size={24} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#334155]/70 backdrop-blur-sm dark-glass-text rounded-full text-xs uppercase tracking-widest text-text/90 font-medium border border-text/10">
                    {galleryIndex + 1} / {galleryImages.length}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#334155]/70 backdrop-blur-md">
            <div className="w-full max-w-lg max-h-[85vh] bg-navy border border-gold/20 rounded-xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden">
              <div className="p-6 border-b border-gold/10 flex items-center justify-between">
                <h2 className="text-sm uppercase tracking-[2px] font-semibold text-gold">Mon Panier</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-text/70 hover:text-gold transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                {cart.length === 0 ? (
                  <div className="text-center py-20 text-text/50">
                    <Package size={48} className="mx-auto mb-4 opacity-20 text-gold" />
                    <p className="text-[11px] uppercase tracking-widest">Votre panier est vide</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((car) => (
                      <div key={car.id} className="flex gap-4 items-center bg-navy-800/50 border border-gold/10 p-2 rounded">
                        <LazyImage src={car.image} alt={car.brand} className="w-20 h-20 object-cover rounded" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-text text-sm mb-1">{car.brand} {car.model}</h4>
                          <div className="text-gold text-xs font-light">{car.priceStr}</div>
                        </div>
                        <button
                          onClick={() => setCart(cart.filter(item => item.id !== car.id))}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cart.length > 0 && (
                <div className="p-6 border-t border-gold/10 bg-navy-800/50">
                  <button 
                    onClick={() => {
                      const num = String(config.contactWhatsapp || '').replace(/[^0-9]/g, '');
                      const itemsText = cart.map((c) => `- ${c.brand} ${c.model} (${c.priceStr})`).join("\\n");
                      const message = `Bonjour, je souhaite passer commande pour les véhicules suivants:\\n\\n${itemsText}`;
                      window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, '_blank');
                      
                      cart.forEach(car => {
                        const newOrder = {
                          id: `#CMD-${String((config.orders?.length ? Math.max(...config.orders.map(o => parseInt(o.id.replace(/\D/g, "") || "0"))) : 0) + 1).padStart(3, "0")}`,
                          client: "Client WhatsApp",
                          item: `Véhicule: ${car.brand} ${car.model}`,
                          date: new Date().toLocaleDateString('fr-FR'),
                          status: "En cours",
                          statusColor: "text-amber-400 bg-amber-500/20 border-amber-500/40 font-semibold"
                        };
                        updateConfig({ orders: [newOrder, ...(config.orders || [])] });
                      });
                      
                      setCart([]);
                      setIsCartOpen(false);
                    }}
                    className="w-full bg-gold text-[#0f172a] font-semibold text-xs py-4 tracking-widest uppercase hover:bg-[#d4b069] transition-all active:scale-95"
                  >
                    Commander sur WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Alert Modal */}
      <AnimatePresence>
        {isAlertModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#334155]/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-navy border border-gold-muted/30 p-8 w-full max-w-md relative text-text text-center flex flex-col items-center"
            >
              <button
                onClick={() => setIsAlertModalOpen(false)}
                className="absolute top-4 right-4 text-text/50 hover:text-gold transition-colors focus:outline-none"
              >
                <X size={20} />
              </button>
              
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-6 border border-gold/20">
                <Bell size={24} className="text-gold" />
              </div>

              {alertSuccess ? (
                <>
                  <h3 className="text-xl font-light text-text mb-2">Alerte activée !</h3>
                  <p className="text-sm text-text/70 mb-6">Vous serez averti(e) dès qu'il y aura du nouveau.</p>
                  <button
                    onClick={() => setIsAlertModalOpen(false)}
                    className="w-full bg-gold text-[#0f172a] font-semibold text-xs py-3 uppercase tracking-wider hover:bg-[#d4b069] transition-colors"
                  >
                    Fermer
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-light text-text mb-2">Alerte véhicule</h3>
                  <p className="text-[12px] text-text/70 mb-6 text-center">
                    {alertTargetCar 
                      ? "Soyez informé(e) si le prix de ce modèle baisse." 
                      : "Soyez informé(e) de nos nouveaux arrivages selon vos critères."
                    }
                  </p>

                  <div className="w-full text-left mb-6 space-y-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-text/70 mb-2 block">Moyen de contact</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm text-text/90 cursor-pointer">
                          <input type="radio" checked={alertType === 'email'} onChange={() => setAlertType('email')} className="accent-gold" /> Email
                        </label>
                        <label className="flex items-center gap-2 text-sm text-text/90 cursor-pointer">
                          <input type="radio" checked={alertType === 'whatsapp'} onChange={() => setAlertType('whatsapp')} className="accent-gold" /> WhatsApp
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-text/70 mb-2 block">
                        {alertType === 'email' ? 'Adresse email' : 'Numéro WhatsApp (avec indicatif)'}
                      </label>
                      <input 
                        type={alertType === 'email' ? 'email' : 'tel'} 
                        placeholder={alertType === 'email' ? 'vous@email.com' : '+243...'}
                        value={alertContact}
                        onChange={(e) => setAlertContact(e.target.value)}
                        className="w-full bg-navy-800 border border-text/10 p-3 text-sm text-text outline-none focus:border-gold transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if(alertContact.length > 5) setAlertSuccess(true);
                    }}
                    disabled={alertContact.length <= 5}
                    className="w-full bg-gold text-[#0f172a] font-semibold text-xs py-3 uppercase tracking-wider hover:bg-[#d4b069] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Activer l'alerte
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Reviews serviceTitle="Motors" />

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-[90] flex items-center justify-center p-4 bg-gold rounded-full shadow-[0_4px_20px_rgba(212,176,105,0.3)] hover:bg-[#d4b069] transition-transform hover:scale-105"
        >
          <Package size={24} className="text-[#0f172a]" />
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-navy">
            {cart.length}
          </span>
        </button>
      )}
      </div>
</div>
  );
}

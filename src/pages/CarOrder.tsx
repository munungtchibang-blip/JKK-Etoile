import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

const CARS = [
  { id: 1, brand: 'Toyota', model: 'Land Cruiser Prado', year: 2023, price: 45000, image: 'https://images.unsplash.com/photo-1590509653066-8a9d18db5469?q=80&w=1770&auto=format&fit=crop' },
  { id: 2, brand: 'Lexus', model: 'LX 570', year: 2021, price: 65000, image: 'https://images.unsplash.com/photo-1580274455110-3866291a27e7?q=80&w=1762&auto=format&fit=crop' },
  { id: 3, brand: 'Toyota', model: 'Hilux Double Cab', year: 2024, price: 38000, image: 'https://images.unsplash.com/photo-1627940251786-fb15b88c7dc6?q=80&w=1770&auto=format&fit=crop' },
  { id: 4, brand: 'Hyundai', model: 'Tucson', year: 2024, price: 28000, image: 'https://images.unsplash.com/photo-1633507026773-455b93d7c5ed?q=80&w=1969&auto=format&fit=crop' }
];

export default function CarOrder() {
  const { id } = useParams<{ id: string }>();
  const car = CARS.find(c => c.id === Number(id));
  const [submitted, setSubmitted] = useState(false);
  const [hasInsurance, setHasInsurance] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState({ name: false, phone: false, email: false });

  const isNameValid = name.trim().length > 2;
  const isPhoneValid = /^\+?[0-9]{8,}$/.test(phone);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const formatPrice = (p: number) => p.toLocaleString('en-US') + '$';
  
  const insuranceCost = 1500;
  
  if (!car) {
    return (
      <div className="mx-auto max-w-7xl px-4 pt-56 pb-16 text-center text-text">
        <h2>Véhicule introuvable</h2>
        <Link to="/cars" className="text-gold mt-4 inline-block">Retour aux véhicules</Link>
      </div>
    );
  }

  const totalPrice = car.price + (hasInsurance ? insuranceCost : 0);

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-3xl px-4 pt-[280px] pb-24 text-center"
      >
        <div className="border border-gold-muted bg-glass p-12">
          <CheckCircle className="mx-auto mb-6 h-16 w-16 text-gold" />
          <h2 className="text-2xl font-light text-text mb-4">Commande Confirmée</h2>
          <p className="text-text/90 font-medium text-sm  mb-8">Votre demande d'importation pour le {car.brand} {car.model} a été reçue. Notre équipe vous contactera sous 24h.</p>
          <Link to="/cars" className="bg-gold px-8 py-3 text-xs tracking-widest uppercase font-semibold text-[#0f172a] transition-colors hover:bg-[#d4b069] focus:outline-none focus:ring-2 focus:ring-gold">
            Retour aux véhicules
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl px-4 pt-[280px] pb-16 sm:px-6 lg:px-8"
    >
      <Link to="/cars" className="inline-flex items-center gap-2 text-gold hover:text-text transition-colors mb-8 text-[11px] uppercase tracking-wider focus:outline-none focus:underline">
        <ArrowLeft size={16} /> Retour
      </Link>
      
      <div className="mb-12">
        <h1 className="text-3xl font-light tracking-tight text-text mb-2">Finaliser la Commande</h1>
        <p className="text-sm  text-text/90 font-medium uppercase tracking-widest">Complétez vos informations pour réserver ce véhicule</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border border-gold-muted bg-glass p-8 shadow-2xl">
        <div>
          <h3 className="text-[13px] uppercase tracking-[1px] font-semibold text-gold mb-6">Récapitulatif</h3>
          <div className="aspect-[4/3] w-full overflow-hidden mb-6 bg-navy-800">
             <img src={car.image} alt={car.model} className="h-full w-full object-cover transition-all duration-500 hover:scale-105" />
          </div>
          <div className="space-y-4 text-text">
            <div className="flex justify-between border-b border-gold-muted/30 pb-4">
              <span className="text-[11px] uppercase tracking-wider text-text/90 font-medium">Véhicule</span>
              <span className="font-light">{car.brand} {car.model}</span>
            </div>
            <div className="flex justify-between border-b border-gold-muted/30 pb-4">
              <span className="text-[11px] uppercase tracking-wider text-text/90 font-medium">Année</span>
              <span className="font-light">{car.year}</span>
            </div>
            <div className="flex justify-between border-b border-gold-muted/30 pb-4">
              <span className="text-[11px] uppercase tracking-wider text-text/90 font-medium">Prix de base</span>
              <span className="font-light">{formatPrice(car.price)}</span>
            </div>
            {hasInsurance && (
              <div className="flex justify-between border-b border-gold-muted/30 pb-4 text-gold">
                <span className="text-[11px] uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck size={14} /> Assurance tous risques
                </span>
                <span className="font-light">+{formatPrice(insuranceCost)}</span>
              </div>
            )}
            <div className="flex justify-between pb-4 pt-2">
              <span className="text-[11px] uppercase tracking-wider text-text/90 font-medium">Prix Total (Livré Kinshasa)</span>
              <span className="font-semibold text-xl text-gold">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[13px] uppercase tracking-[1px] font-semibold text-gold mb-6">Vos Coordonnées</h3>
          <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); if (isNameValid && isPhoneValid && isEmailValid) setSubmitted(true); }}>
            <div className="flex flex-col gap-2 relative">
              <label className="text-[10px] uppercase text-gold tracking-[1.5px]">Nom complet</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched({ ...touched, name: true })}
                className={`w-full bg-transparent border-b text-lg font-light text-text outline-none pb-2 transition-colors focus:ring-0 ${touched.name ? (isNameValid ? 'border-green-500 focus:border-green-500' : 'border-red-500 focus:border-red-500') : 'border-text/20 focus:border-gold'}`} 
              />
              {!isNameValid && touched.name && <span className="text-red-500 text-[10px] uppercase tracking-wider absolute -bottom-5">Le nom doit contenir au moins 3 caractères.</span>}
            </div>
            <div className="flex flex-col gap-2 relative mt-8">
              <label className="text-[10px] uppercase text-gold tracking-[1.5px]">Numéro de Téléphone (WhatsApp)</label>
              <input 
                type="tel" 
                required 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => setTouched({ ...touched, phone: true })}
                className={`w-full bg-transparent border-b text-lg font-light text-text outline-none pb-2 transition-colors focus:ring-0 ${touched.phone ? (isPhoneValid ? 'border-green-500 focus:border-green-500' : 'border-red-500 focus:border-red-500') : 'border-text/20 focus:border-gold'}`} 
              />
              {!isPhoneValid && touched.phone && <span className="text-red-500 text-[10px] uppercase tracking-wider absolute -bottom-5">Format de téléphone invalide (ex: +243...).</span>}
            </div>
            <div className="flex flex-col gap-2 relative mb-6 mt-8">
              <label className="text-[10px] uppercase text-gold tracking-[1.5px]">Adresse Email</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched({ ...touched, email: true })}
                className={`w-full bg-transparent border-b text-lg font-light text-text outline-none pb-2 transition-colors focus:ring-0 ${touched.email ? (isEmailValid ? 'border-green-500 focus:border-green-500' : 'border-red-500 focus:border-red-500') : 'border-text/20 focus:border-gold'}`} 
              />
              {!isEmailValid && touched.email && <span className="text-red-500 text-[10px] uppercase tracking-wider absolute -bottom-5">Adresse email invalide.</span>}
            </div>

            <div className="pt-6 border-t border-gold-muted/30">
              <h4 className="text-[11px] uppercase tracking-widest text-text mb-4">Options supplémentaires</h4>
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-1">
                  <input 
                    type="checkbox" 
                    className="appearance-none w-4 h-4 border border-white/30 rounded-sm checked:bg-gold checked:border-gold focus:outline-none focus:ring-2 focus:ring-gold transition-colors cursor-pointer"
                    checked={hasInsurance}
                    onChange={(e) => setHasInsurance(e.target.checked)}
                  />
                  <CheckCircle className="absolute w-3 h-3 text-[#0f172a] opacity-0 pointer-events-none group-has-[:checked]:opacity-100 transition-opacity" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-text group-hover:text-gold transition-colors">Assurance Transport & Tous Risques</span>
                    <span className="text-xs text-gold font-semibold">+{formatPrice(insuranceCost)}</span>
                  </div>
                  <p className="text-[10px] text-text/90 font-medium leading-relaxed ">
                    Protège votre véhicule contre les dommages, pertes, ou vols pendant le fret maritime et le transport terrestre jusqu'à la livraison finale. Fortement recommandée.
                  </p>
                </div>
              </label>
            </div>
            
            <button type="submit" disabled={(!isNameValid || !isEmailValid || !isPhoneValid) && (touched.name || touched.email || touched.phone)} className="w-full bg-gold py-4 text-xs tracking-widest uppercase font-semibold text-[#0f172a] transition-colors hover:bg-[#d4b069] mt-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy focus:ring-gold disabled:opacity-50 disabled:cursor-not-allowed">
              Confirmer la Demande
            </button>
            <p className="text-[10px] text-text/30 tracking-widest uppercase text-center mt-4">Aucun paiement immédiat n'est requis.</p>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

import { Reviews } from "../components/Reviews";
import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Search, Loader2, Plane } from 'lucide-react';

import { useSiteConfig } from '../components/SiteContext';
import { LazyImage } from '../components/LazyImage';
import toast from 'react-hot-toast';
import { sendAdminNotification } from '../lib/EmailNotifier';

function FlightStatusWidget() {
  const [flightNumber, setFlightNumber] = useState('');
  const [status, setStatus] = useState<null | any>(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    // Mock API call
    setTimeout(() => {
      const isKinshasaDubai = flightNumber.toUpperCase().includes('EK') || flightNumber.toUpperCase().includes('FZ');
      const statuses = ['À l\'heure', 'Retardé', 'En vol', 'Atterri'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setStatus({
        flight: flightNumber.toUpperCase() || 'EK714',
        route: 'Kinshasa (FIH) ➔ Dubai (DXB)',
        status: isKinshasaDubai ? randomStatus : 'À l\'heure',
        departureTime: '15:30',
        arrivalTime: '02:45 (+1)',
        gate: 'G2',
        terminal: '3'
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="mt-16 bg-glass p-6 sm:p-10 border border-gold-muted/50 rounded-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold/20 via-gold to-gold/20"></div>
      <div className="flex items-center gap-3 mb-6">
        <Plane className="text-gold" size={24} />
        <h2 className="text-2xl font-light text-text">Statut de Vol en Temps Réel</h2>
      </div>
      <p className="text-text/70 text-sm mb-6 font-medium">Vérifiez l'état de votre vol Kinshasa - Dubai (départs, retards, portes d'embarquement).</p>
      
      <form onSubmit={checkStatus} className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          required
          value={flightNumber}
          onChange={(e) => setFlightNumber(e.target.value)}
          placeholder="Ex: EK714 ou FZ 631"
          className="flex-1 bg-navy border border-text/20 px-4 py-3 rounded text-sm text-text focus:outline-none focus:border-gold placeholder:text-text/30 uppercase tracking-widest"
        />
        <button
          type="submit"
          disabled={loading || !flightNumber}
          className="bg-gold px-8 py-3 text-xs tracking-widest uppercase font-semibold text-[#0f172a] hover:bg-[#d4b069] disabled:opacity-50 transition-colors rounded sm:w-auto w-full flex justify-center items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : 'Vérifier'}
        </button>
      </form>

      {status && (
        <div className="border border-gold/30 bg-gold/5 p-6 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="text-gold text-lg font-medium mb-1 tracking-widest">{status.flight}</div>
              <div className="text-sm text-text/80">{status.route}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-1.5 rounded text-xs font-semibold uppercase tracking-widest border ${status.status === "Retardé" ? 'bg-red-500/10 text-red-500 border-red-500/20' : status.status === "En vol" ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                {status.status}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gold/10">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-text/50 mb-1">Départ</div>
              <div className="text-text font-mono">{status.departureTime}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-text/50 mb-1">Arrivée</div>
              <div className="text-text font-mono">{status.arrivalTime}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-text/50 mb-1">Terminal</div>
              <div className="text-text font-mono text-xl">{status.terminal}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-text/50 mb-1">Porte</div>
              <div className="text-text font-mono text-xl text-gold">{status.gate}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Flights() {
  const [loading, setLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const { config, updateConfig } = useSiteConfig();

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [touched, setTouched] = useState({ date: false, passengers: false });

  const isDateValid = date !== '';
  const isPassengersValid = parseInt(passengers) > 0;

  const getInputClass = (fieldName: string, isValid: boolean) => {
    const isTouched = touched[fieldName as keyof typeof touched];
    if (!isTouched) return "border-text/20 focus:border-gold";
    return isValid ? "border-green-500 focus:border-green-500" : "border-red-500 focus:border-red-500";
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isDateValid || !isPassengersValid) {
      setTouched({ date: true, passengers: true });
      return;
    }
    
    // Create and save an order
    const newOrder = {
      id: `#CMD-${String((config.orders?.length ? Math.max(...config.orders.map(o => parseInt(o.id.replace(/\D/g, "") || "0"))) : 0) + 1).padStart(3, "0")}`,
      client: name || "Client Inconnu",
      email: email,
      phone: phone,
      item: `Vol: ${passengers} passager(s) le ${date}`,
      date: new Date().toLocaleDateString('fr-FR'),
      status: 'En attente',
      statusColor: 'text-amber-400 bg-amber-500/20 border-amber-500/40 font-semibold'
    };
    
    updateConfig({
      orders: [newOrder, ...(config.orders || [])]
    });
    
    sendAdminNotification(config.emailNotificationKey, 'Nouvelle Demande de Vol', {
      Client: newOrder.client,
      Email: newOrder.email,
      Telephone: newOrder.phone,
      Service: newOrder.item,
      Date: newOrder.date
    });
    
    setSubmitted(true);
    toast.success('Demande de vol envoyée avec succès !');
    
    const message = `Bonjour, je souhaite réserver un vol de Kinshasa à Dubai pour le ${date} (${passengers} passager(s)). Nom: ${name}, Télephone: ${phone}`;
    const num = "243826636212";
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const serviceInfo = config.services?.find(s => s.link === '/flights');

  const handleWhatsappForm = () => {
    const message = `Bonjour, je souhaite avoir plus de détails concernant les billets d'avion.`;
    const num = "243826636212";
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (isPageLoading) {
    return (
      <div className="pt-24 min-h-screen bg-navy pb-20 animate-pulse">
        <div className="w-full h-64 md:h-80 bg-navy-800 mb-12"></div>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="h-64 bg-navy-800 border border-gold-muted/20 rounded-2xl mb-12 -mt-24 relative z-10 w-full max-w-3xl mx-auto"></div>
          <div className="h-96 bg-navy-800 border border-gold-muted/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-navy pb-20">
      <div className="w-full h-64 md:h-80 relative mb-12">
        <LazyImage 
          src={serviceInfo?.imageUrl || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"}
          alt="Réservation de Vols" 
          className="w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent"></div>
        <div className="absolute inset-0 bg-navy/40 backdrop-blur-[3px]"></div>
      </div>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-8 bg-glass backdrop-blur-md rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] mb-12 text-center relative z-10 -mt-24 max-w-3xl mx-auto border border-gold-muted/20"
      >
        <div className="inline-flex items-center justify-center p-4 bg-gold-muted/10 rounded-full mb-6">
          <Plane size={32} className="text-gold" />
        </div>
        <span className="text-[12px] uppercase tracking-[4px] text-gold mb-4 block">Billetterie</span>
        <h1 className="text-3xl font-display text-gold mb-4 drop-shadow-md">
          Réserver un billet
        </h1>
        <p className="text-text/90 max-w-2xl mx-auto uppercase tracking-widest text-sm drop-shadow">
          {serviceInfo?.content || serviceInfo?.description || "Réservez vos vols au meilleur prix."}
        </p>
      </motion.div>

      <div className="bg-glass p-6 sm:p-10 border border-gold-muted">
        {submitted ? (
          <div className="text-center py-10">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold-muted text-gold">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-light text-text">Demande envoyée !</h3>
            <p className="mt-2 text-text/90 font-medium text-sm ">Notre équipe reviendra vers vous avec les meilleurs tarifs sur WhatsApp.</p>
            <button 
              onClick={() => setSubmitted(false)}
              className="mt-8 bg-gold px-6 py-3 text-xs tracking-widest uppercase font-semibold text-[#0f172a] transition-colors hover:bg-[#d4b069]"
            >
              Nouvelle recherche
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 pb-6 border-b border-gold-muted/20">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase text-gold tracking-[1.5px]">Nom complet</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-b border-text/20 text-sm font-light text-text outline-none focus:border-gold pb-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase text-gold tracking-[1.5px]">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-text/20 text-sm font-light text-text outline-none focus:border-gold pb-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase text-gold tracking-[1.5px]">Téléphone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent border-b border-text/20 text-sm font-light text-text outline-none focus:border-gold pb-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="departure" className="text-[10px] uppercase text-gold tracking-[1.5px]">From</label>
                <select id="departure" required className="w-full bg-transparent border-b border-text/20 text-xl font-light text-text outline-none focus:border-gold pb-2 uppercase appearance-none">
                  <option className="bg-navy text-text text-sm" value="FIH">Kinshasa (FIH)</option>
                  <option className="bg-navy text-text text-sm" value="DXB">Dubai (DXB)</option>
                </select>
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="destination" className="text-[10px] uppercase text-gold tracking-[1.5px]">To</label>
                <select id="destination" required className="w-full bg-transparent border-b border-text/20 text-xl font-light text-text outline-none focus:border-gold pb-2 uppercase appearance-none">
                  <option className="bg-navy text-text text-sm" value="DXB">Dubai (DXB)</option>
                  <option className="bg-navy text-text text-sm" value="FIH">Kinshasa (FIH)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="date" className="text-[10px] uppercase text-gold tracking-[1.5px]">Date</label>
                <input 
                  type="date" 
                  id="date" 
                  required 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  onBlur={() => setTouched({ ...touched, date: true })}
                  className={`w-full bg-transparent border-b text-xl font-light text-text outline-none pb-2 uppercase transition-colors ${getInputClass('date', isDateValid)}`} 
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="passengers" className="text-[10px] uppercase text-gold tracking-[1.5px]">Passagers</label>
                <input 
                  type="number" 
                  id="passengers" 
                  min="1" 
                  required 
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                  onBlur={() => setTouched({ ...touched, passengers: true })}
                  className={`w-full bg-transparent border-b text-xl font-light text-text outline-none pb-2 uppercase transition-colors ${getInputClass('passengers', isPassengersValid)}`} 
                />
              </div>
            </div>

            <div className="pt-8 flex flex-col items-center justify-between gap-4">
              <span className="text-[10px] uppercase tracking-widest text-text/90 font-medium">
                Garantie du meilleur prix
              </span>
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-gold px-8 py-4 text-xs tracking-widest uppercase font-semibold text-[#0f172a] transition-all hover:bg-[#d4b069] disabled:opacity-70 w-full"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                  {loading ? 'Recherche...' : 'Chercher un vol'}
                </button>
                <button
                  type="button"
                  onClick={handleWhatsappForm}
                  className="flex-1 flex items-center justify-center gap-2 bg-transparent border border-gold/50 text-gold px-8 py-4 text-xs font-bold uppercase tracking-[2px] hover:bg-gold/10 transition-all w-full"
                >
                  Continuer la discussion sur WhatsApp
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      <FlightStatusWidget />
      <Reviews serviceTitle="Billetterie" />
      </div>
</div>
  );}

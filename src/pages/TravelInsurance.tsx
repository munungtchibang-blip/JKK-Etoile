import { Reviews } from "../components/Reviews";
import React, { useState } from 'react';
import { ShieldCheck, Calendar, Plane, HeartPulse, User, Mail, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteConfig } from '../components/SiteContext';
import { LazyImage } from '../components/LazyImage';
import toast from 'react-hot-toast';
import { sendAdminNotification } from '../lib/EmailNotifier';

export default function TravelInsurance() {
  const { config, updateConfig } = useSiteConfig();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [coverage, setCoverage] = useState('standard');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newOrder = {
      id: `#CMD-${String((config.orders?.length ? Math.max(...config.orders.map(o => parseInt(o.id.replace(/\D/g, "") || "0"))) : 0) + 1).padStart(3, "0")}`,
      client: name,
      email: email,
      phone: phone,
      item: `Assurance: ${destination} (${duration}) - ${coverage}`,
      date: new Date().toLocaleDateString('fr-FR'),
      status: 'En attente',
      statusColor: 'text-amber-400 bg-amber-500/20 border-amber-500/40 font-semibold'
    };
    
    updateConfig({
      orders: [newOrder, ...(config.orders || [])]
    });
    
    sendAdminNotification(config.emailNotificationKey, 'Nouvelle Demande Assurance', {
      Client: newOrder.client,
      Email: newOrder.email,
      Telephone: newOrder.phone,
      Service: newOrder.item,
      Date: newOrder.date
    });
    
    setSubmitted(true);
    toast.success('Demande d\'assurance envoyée avec succès !');
  };

  const serviceInfo = config.services?.find(s => s.link === '/travel-insurance');

  const handleWhatsapp = () => {
    const message = `Bonjour, je souhaite avoir plus de détails concernant l'assurance voyage.`;
    const num = "243826636212";
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="pt-24 min-h-screen bg-navy pb-20">
      <div className="w-full h-64 md:h-80 relative mb-12">
        <LazyImage 
          src={serviceInfo?.imageUrl || "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop"}
          alt="Assurance Voyage" 
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
          <ShieldCheck size={32} className="text-gold" />
        </div>
        <span className="text-[12px] uppercase tracking-[4px] text-gold mb-4 block">Assurance Voyage</span>
        <h1 className="text-3xl font-display text-gold mb-4 drop-shadow-md">
          Souscrire une assurance
        </h1>
        <p className="text-text/90 max-w-2xl mx-auto uppercase tracking-widest text-sm drop-shadow">
          {serviceInfo?.content || serviceInfo?.description || "Voyagez en toute sérénité avec nos couvertures complètes."}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-glass border border-gold-muted/50 p-8 md:p-12 rounded-2xl"
      >
        {submitted ? (
           <div className="text-center py-12">
             <div className="mx-auto w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck size={32} className="text-gold" />
             </div>
             <h2 className="text-2xl font-light text-text mb-4">Demande envoyée !</h2>
             <p className="text-sm text-text/70 uppercase tracking-widest leading-relaxed">
               Merci {name}. Votre demande d'assurance voyage a bien été prise en compte.
               Notre équipe va vous contacter rapidement au {phone} ou par email.
             </p>
             <button
               onClick={() => setSubmitted(false)}
               className="mt-8 bg-navy border border-gold-muted py-3 px-8 text-xs font-bold uppercase tracking-[2px] text-text hover:bg-white/5 transition-all"
             >
               Faire une autre demande
             </button>
           </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-6 text-sm font-medium">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 pb-6 border-b border-gold-muted/20">
              <div className="space-y-2">
                <label className="text-[10px] text-text/90 uppercase tracking-widest flex items-center gap-2">
                  <User size={14} className="text-gold" /> Nom complet
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                  className="w-full bg-navy border border-text/20 p-3 text-text focus:outline-none focus:border-gold transition-colors block"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-text/90 uppercase tracking-widest flex items-center gap-2">
                  <Mail size={14} className="text-gold" /> Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full bg-navy border border-text/20 p-3 text-text focus:outline-none focus:border-gold transition-colors block"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-text/90 uppercase tracking-widest flex items-center gap-2">
                  <Phone size={14} className="text-gold" /> Téléphone
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+243..."
                  className="w-full bg-navy border border-text/20 p-3 text-text focus:outline-none focus:border-gold transition-colors block"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-text/90 uppercase tracking-widest flex items-center gap-2">
                <Plane size={14} className="text-gold" /> Destination
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Ex: Pays Schengen, Dubaï..."
                className="w-full bg-navy border border-text/20 p-3 text-text focus:outline-none focus:border-gold transition-colors block"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] text-text/90 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} className="text-gold" /> Durée du séjour
              </label>
              <input
                type="text"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ex: 14 jours"
                className="w-full bg-navy border border-text/20 p-3 text-text focus:outline-none focus:border-gold transition-colors block"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] text-text/90 uppercase tracking-widest flex items-center gap-2">
                <HeartPulse size={14} className="text-gold" /> Niveau de couverture souhaité
              </label>
              <select
                value={coverage}
                onChange={(e) => setCoverage(e.target.value)}
                className="w-full bg-navy border border-text/20 p-3 text-text focus:outline-none focus:border-gold transition-colors block appearance-none"
              >
                <option value="standard">Couverture Standard (Médical & Rapatriement)</option>
                <option value="premium">Couverture Premium (Standard + Annulation & Bagages)</option>
                <option value="student">Assurance Étudiant International</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-gold-muted/20 space-y-4">
            <button
              type="submit"
              className="w-full bg-gold text-[#0f172a] py-4 text-xs font-bold uppercase tracking-[2px] hover:bg-[#d4b069] transition-all"
            >
              Obtenir une tarification
            </button>
            <button
              type="button"
              onClick={handleWhatsapp}
              className="w-full bg-transparent border border-gold/50 text-gold py-4 text-xs font-bold uppercase tracking-[2px] hover:bg-gold/10 transition-all flex items-center justify-center gap-2"
            >
              Continuer la discussion sur WhatsApp
            </button>
          </div>
        </form>
        )}
      <Reviews serviceTitle="Assurance Voyage" />
</motion.div>
      </div>
</div>
  );
}

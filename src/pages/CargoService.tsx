import { Reviews } from "../components/Reviews";
import React, { useState } from 'react';
import { Package, MapPin, Scale, Container, User, Mail, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteConfig } from '../components/SiteContext';
import { LazyImage } from '../components/LazyImage';
import toast from 'react-hot-toast';
import { sendAdminNotification } from '../lib/EmailNotifier';

function FreightSimulator() {
  const [weight, setWeight] = useState<number>(0);
  const [type, setType] = useState<'air' | 'sea'>('air');
  const [destination, setDestination] = useState<'kinshasa' | 'lubumbashi' | 'other'>('kinshasa');

  const calculateEstimate = () => {
    if (!weight) return 0;
    
    let baseRate = type === 'air' ? 12 : 4; // USD per kg
    if (destination === 'lubumbashi') baseRate += type === 'air' ? 3 : 2;
    if (destination === 'other') baseRate += type === 'air' ? 5 : 3;

    return weight * baseRate;
  };

  const estimate = calculateEstimate();

  return (
    <div className="bg-navy-800/80 border border-gold-muted/30 p-6 rounded-2xl h-full flex flex-col mt-8 lg:mt-0 lg:ml-8">
      <h3 className="text-xl font-display text-gold mb-6 border-b border-gold-muted/20 pb-4">Simulateur Rapide</h3>
      <div className="space-y-4 flex-grow">
        <div>
          <label className="text-[10px] text-text/90 uppercase tracking-widest block mb-2">Type d'envoi</label>
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={() => setType('air')} 
              className={`flex-1 py-2 text-xs uppercase tracking-wider rounded border ${type === 'air' ? 'bg-gold/20 border-gold text-gold' : 'bg-transparent border-text/20 text-text/70'} transition-colors`}
            >
              Aérien
            </button>
            <button 
               type="button"
               onClick={() => setType('sea')} 
               className={`flex-1 py-2 text-xs uppercase tracking-wider rounded border ${type === 'sea' ? 'bg-gold/20 border-gold text-gold' : 'bg-transparent border-text/20 text-text/70'} transition-colors`}
             >
               Maritime
             </button>
          </div>
        </div>
        <div>
           <label className="text-[10px] text-text/90 uppercase tracking-widest block mb-2">Poids (kg) / Vol. (CBM)</label>
           <input type="number" min="0" value={weight || ''} onChange={(e) => setWeight(Number(e.target.value))} placeholder="Ex: 50" className="w-full bg-navy border border-text/20 p-2 text-text text-sm focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="text-[10px] text-text/90 uppercase tracking-widest block mb-2">Destination</label>
          <select value={destination} onChange={(e) => setDestination(e.target.value as any)} className="w-full bg-navy border border-text/20 p-2 text-text text-sm focus:outline-none focus:border-gold appearance-none">
             <option value="kinshasa">Kinshasa</option>
             <option value="lubumbashi">Lubumbashi</option>
             <option value="other">Autre Province</option>
          </select>
        </div>
      </div>
      <div className="mt-6 bg-glass p-4 rounded border border-gold/20 text-center">
        <div className="text-[10px] text-text/70 uppercase tracking-widest mb-1">Estimation Approximative</div>
        <div className="text-3xl font-light text-gold tracking-wider">${estimate > 0 ? estimate.toLocaleString('fr-FR') : '0'}</div>
        <div className="text-[9px] text-text/50 mt-2 uppercase tracking-widest">*Tarif indicatif sans engagement.</div>
      </div>
    </div>
  );
}

export default function CargoService() {
  const { config, updateConfig } = useSiteConfig();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cargoType, setCargoType] = useState('air');
  const [weight, setWeight] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newOrder = {
      id: `#CMD-${String((config.orders?.length ? Math.max(...config.orders.map(o => parseInt(o.id.replace(/\D/g, "") || "0"))) : 0) + 1).padStart(3, "0")}`,
      client: name,
      email: email,
      phone: phone,
      item: `Cargo: ${cargoType === 'air' ? 'Fret Aérien' : 'Fret Maritime'} (${weight})`,
      date: new Date().toLocaleDateString('fr-FR'),
      status: 'En attente',
      statusColor: 'text-amber-400 bg-amber-500/20 border-amber-500/40 font-semibold'
    };
    
    updateConfig({
      orders: [newOrder, ...(config.orders || [])]
    });
    
    sendAdminNotification(config.emailNotificationKey, 'Nouvelle Demande Expédition', {
      Client: newOrder.client,
      Email: newOrder.email,
      Telephone: newOrder.phone,
      Service: newOrder.item,
      Date: newOrder.date
    });
    
    setSubmitted(true);
    toast.success('Demande d\'expédition envoyée avec succès !');
  };

  const serviceInfo = config.services?.find(s => s.link === '/cargo');

  const handleWhatsapp = () => {
    const message = `Bonjour, je souhaite avoir plus de détails concernant le fret et la logistique.`;
    const num = "243826636212";
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="pt-24 min-h-screen bg-navy pb-20">
      <div className="w-full h-64 md:h-80 relative mb-12">
        <LazyImage 
          src={serviceInfo?.imageUrl || "https://images.unsplash.com/photo-1580674684081-7769cf3290b2?q=80&w=2070&auto=format&fit=crop"}
          alt="Service cargo" 
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
          <Package size={32} className="text-gold" />
        </div>
        <span className="text-[12px] uppercase tracking-[4px] text-gold mb-4 block">Service cargo</span>
        <h1 className="text-3xl font-display text-gold mb-4 drop-shadow-md">
          Expédition et Logistique
        </h1>
        <p className="text-text/90 max-w-2xl mx-auto uppercase tracking-widest text-sm drop-shadow">
          {serviceInfo?.content || serviceInfo?.description || "Fret aérien et maritime sécurisé de Dubaï vers la RDC"}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-glass border border-gold-muted/50 p-8 md:p-12 rounded-2xl">
            {submitted ? (
               <div className="text-center py-12">
                 <div className="mx-auto w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mb-6">
                    <Package size={32} className="text-gold" />
                 </div>
                 <h2 className="text-2xl font-light text-text mb-4">Demande de devis envoyée !</h2>
                 <p className="text-sm text-text/70 uppercase tracking-widest leading-relaxed">
                   Merci {name}. Votre demande d'expédition pour {weight} a bien été enregistrée.
                   Notre équipe logistique va vous contacter rapidement au {phone} avec une proposition.
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
                <Container size={14} className="text-gold" /> Type de fret
              </label>
              <select
                value={cargoType}
                onChange={(e) => setCargoType(e.target.value)}
                className="w-full bg-navy border border-text/20 p-3 text-text focus:outline-none focus:border-gold transition-colors block appearance-none"
              >
                <option value="air">Fret Aérien (Rapide)</option>
                <option value="sea_ltl">Fret Maritime (Groupage)</option>
                <option value="sea_fcl">Fret Maritime (Conteneur Complet)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] text-text/90 uppercase tracking-widest flex items-center gap-2">
                <Scale size={14} className="text-gold" /> Poids / Volume estimé
              </label>
              <input
                type="text"
                required
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ex: 50 kg ou 2 CBM"
                className="w-full bg-navy border border-text/20 p-3 text-text focus:outline-none focus:border-gold transition-colors block"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] text-text/90 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={14} className="text-gold" /> Ville de départ
              </label>
              <select
                className="w-full bg-navy border border-text/20 p-3 text-text focus:outline-none focus:border-gold transition-colors block appearance-none"
              >
                <option value="dubai">Dubaï</option>
                <option value="other">Autre (préciser dans les notes)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] text-text/90 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={14} className="text-gold" /> Destination finale
              </label>
              <select
                className="w-full bg-navy border border-text/20 p-3 text-text focus:outline-none focus:border-gold transition-colors block appearance-none"
              >
                <option value="kinshasa">Kinshasa</option>
                <option value="lubumbashi">Lubumbashi</option>
                <option value="matadi">Matadi (Port)</option>
                <option value="other">Autre</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-gold-muted/20 space-y-4">
            <button
              type="submit"
              className="w-full bg-gold text-[#0f172a] py-4 text-xs font-bold uppercase tracking-[2px] hover:bg-[#d4b069] transition-all"
            >
              Demander un devis
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
      </div>
      <div className="lg:col-span-1">
        <FreightSimulator />
      </div>
    </div>
    <div className="mt-12 bg-glass border border-gold-muted/50 p-8 md:p-12 rounded-2xl">
      <Reviews serviceTitle="Service cargo" />
    </div>
</motion.div>
      </div>
</div>
  );
}

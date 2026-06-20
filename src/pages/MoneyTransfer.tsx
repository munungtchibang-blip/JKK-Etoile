import { Reviews } from "../components/Reviews";
import React, { useState } from 'react';
import { CreditCard, ArrowRight, Wallet, MapPin, User, Mail, Phone, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteConfig } from '../components/SiteContext';
import { LazyImage } from '../components/LazyImage';
import toast from 'react-hot-toast';
import { sendAdminNotification } from '../lib/EmailNotifier';

export default function MoneyTransfer() {
  const { config, updateConfig } = useSiteConfig();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [direction, setDirection] = useState('to_kinshasa');
  const [mobileMethod, setMobileMethod] = useState('');
  const [city, setCity] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [transactionRef, setTransactionRef] = useState('');
  
  const mobileMoneyOptions = config.mobileMoneyOptions || [];
  const agencyAccounts = config.agencyAccounts || {};
  const selectedAgencyAccount = mobileMethod ? agencyAccounts[mobileMethod] : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setVerifying(true);
    
    // Simulate verification
    setTimeout(() => {
      const orderId = `#CMD-${String((config.orders?.length ? Math.max(...config.orders.map(o => parseInt(o.id.replace(/\D/g, "") || "0"))) : 0) + 1).padStart(3, "0")}`;
      
      const newTransfer = {
        id: `#TR-${String((config.transfers?.length ? Math.max(...config.transfers.map(t => parseInt(t.id.replace(/\D/g, "") || "0"))) : 0) + 1).padStart(3, "0")}`,
        client: name,
        phone: phone,
        receiverPhone: receiverPhone,
        amount: amount,
        direction: direction === 'to_kinshasa' ? 'Dubaï -> Kinshasa' : 'Kinshasa -> Dubaï',
        method: mobileMethod ? `${mobileMethod} (Ref: ${transactionRef})` : 'Cash en agence',
        status: 'En vérification',
        statusColor: 'text-blue-400 bg-blue-500/20 border-blue-500/40 font-semibold',
        date: new Date().toLocaleDateString('fr-FR')
      };
      
      updateConfig({
        transfers: [newTransfer, ...(config.transfers || [])]
      });
      
      sendAdminNotification(config.emailNotificationKey, 'Nouvelle Demande de Transfert', {
        Client: newTransfer.client,
        Telephone: newTransfer.phone,
        Destinataire: newTransfer.receiverPhone,
        Montant: newTransfer.amount,
        Direction: newTransfer.direction,
        Methode: newTransfer.method,
        Date: newTransfer.date
      });
      
      const message = `Bonjour, je viens de faire une demande de transfert (Ref: ${transactionRef}).`;
      const num = "243826636212";
      
      setVerifying(false);
      setSubmitted(true);
      toast.success('Demande de transfert initiée avec succès !');
    }, 2000);
  };

  const serviceInfo = config.services?.find(s => s.link === '/money-transfer');

  const handleWhatsapp = () => {
    const message = `Bonjour, je souhaite avoir plus de détails concernant les transferts d'argent.`;
    const num = "243826636212";
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="pt-24 min-h-screen bg-navy pb-20">
      <div className="w-full h-64 md:h-80 relative mb-12">
        <LazyImage 
          src={serviceInfo?.imageUrl || "https://images.unsplash.com/photo-1580519542036-ed47690ce45c?q=80&w=2070&auto=format&fit=crop"}
          alt="Transfert d'argent" 
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
          <CreditCard size={32} className="text-gold" />
        </div>
        <span className="text-[12px] uppercase tracking-[4px] text-gold mb-4 block">Transfert d'argent</span>
        <h1 className="text-3xl font-display text-gold mb-4 drop-shadow-md">
          Envoyer de l'argent
        </h1>
        <p className="text-text/90 max-w-2xl mx-auto uppercase tracking-widest text-sm drop-shadow">
          {serviceInfo?.content || serviceInfo?.description || "Transferts rapides et sécurisés."}
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
                <CreditCard size={32} className="text-gold" />
             </div>
             <h2 className="text-2xl font-light text-text mb-4">Demande de transfert initiée !</h2>
             <p className="text-sm text-text/70 uppercase tracking-widest leading-relaxed">
               Merci {name}. Votre demande de transfert de {amount} a bien été enregistrée.
               Un agent va vous contacter rapidement au {phone} pour finaliser la transaction.
             </p>
             <button
               onClick={() => setSubmitted(false)}
               className="mt-8 bg-navy border border-gold-muted py-3 px-8 text-xs font-bold uppercase tracking-[2px] text-text hover:bg-white/5 transition-all"
             >
               Nouveau transfert
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
                <ArrowRight size={14} className="text-gold" /> Sens du transfert
              </label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="w-full bg-navy border border-text/20 p-3 text-text focus:outline-none focus:border-gold transition-colors block appearance-none"
              >
                <option value="to_kinshasa">De Dubaï vers Kinshasa</option>
                <option value="from_kinshasa">De Kinshasa vers Dubaï</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] text-text/90 uppercase tracking-widest flex items-center gap-2">
                <Wallet size={14} className="text-gold" /> Montant approximatif
              </label>
              <input
                type="text"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ex: 5000 USD"
                className="w-full bg-navy border border-text/20 p-3 text-text focus:outline-none focus:border-gold transition-colors block"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] text-text/90 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={14} className="text-gold" /> Ville / Lieu concerné
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Kinshasa ou Dubaï"
                className="w-full bg-navy border border-text/20 p-3 text-text focus:outline-none focus:border-gold transition-colors block"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-text/90 uppercase tracking-widest flex items-center gap-2">
                <Phone size={14} className="text-gold" /> Numéro du destinataire
              </label>
              <input
                type="tel"
                required
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                placeholder="+243... ou +971..."
                className="w-full bg-navy border border-text/20 p-3 text-text focus:outline-none focus:border-gold transition-colors block"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] text-text/90 uppercase tracking-widest flex items-center gap-2">
                <Smartphone size={14} className="text-gold" /> Mode de transfert (Moyen de paiement / réception)
              </label>
              <select
                value={mobileMethod}
                onChange={(e) => setMobileMethod(e.target.value)}
                className="w-full bg-navy border border-text/20 p-3 text-text focus:outline-none focus:border-gold transition-colors block appearance-none"
              >
                <option value="">Cash en agence</option>
                {mobileMoneyOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2 mt-4">
              <label className="text-[10px] text-text/90 uppercase tracking-widest flex items-center gap-2">
                Référence de la transaction effectuée
              </label>
              <input
                type="text"
                required
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="Ex: Ref M-Pesa..."
                className="w-full bg-navy border border-text/20 p-3 text-text focus:outline-none focus:border-gold transition-colors block leading-none"
              />
              <p className="text-[10px] text-text/50 pt-1 uppercase">Transférez d'abord, soumettez la Réf.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-gold-muted/20 space-y-4">
            <button
              type="submit"
              disabled={verifying}
              className="w-full bg-gold text-[#0f172a] py-4 text-xs font-bold uppercase tracking-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {verifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0f172a]/20 border-t-[#0f172a] rounded-full animate-spin"></div>
                  Vérification en cours...
                </>
              ) : (
                'Confirmer le transfert'
              )}
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
      </motion.div>
      <Reviews serviceTitle="Transfert d'argent" />
      </div>
    </div>
  );
}

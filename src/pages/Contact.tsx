import { MapPin, Phone, Mail, Clock, Send, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteConfig } from '../components/SiteContext';
import toast from 'react-hot-toast';
import { sendAdminNotification } from '../lib/EmailNotifier';

const FAQS = [
  {
    question: "Combien de temps faut-il pour obtenir un visa touristique pour Dubaï ?",
    answer: "Le traitement d'un visa touristique prend généralement entre 3 et 5 jours ouvrables, selon le type de visa et les jours fériés locaux à Dubaï. Nous offrons également un service express."
  },
  {
    question: "Quels sont vos délais d'expédition pour le fret de véhicules ou marchandises ?",
    answer: "Le fret aérien pour les marchandises prend environ 3 à 5 jours. Pour les véhicules (fret maritime), le délai estimé est de 30 à 45 jours du port de Jebel Ali à Matadi."
  },
  {
    question: "Vendez-vous vos produits localement à Kinshasa ?",
    answer: "Oui, la majorité de nos produits Boutique sont disponibles dans nos dépôts à Kinshasa pour une livraison immédiate. Sur commande, la livraison depuis Dubaï prend environ 1 semaine."
  },
  {
    question: "Dois-je payer à l'avance pour l'importation de véhicules ?",
    answer: "Nous proposons plusieurs modalités de paiement pour sécuriser votre investissement. En général, un acompte est requis avant l'inspection du véhicule à Dubaï, et le solde lors de l'expédition ou de la livraison. Contactez-nous pour les détails."
  }
];

export default function Contact() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [touched, setTouched] = useState({ name: false, phone: false, email: false, message: false });
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { config, updateConfig } = useSiteConfig();

  const isNameValid = name.trim().length >= 2;
  const isPhoneValid = phone.trim().length >= 8;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isMessageValid = message.trim().length >= 3;
  const [subject, setSubject] = useState('Autre');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isNameValid || !isPhoneValid || !isEmailValid || !isMessageValid) {
       setTouched({ name: true, phone: true, email: true, message: true });
       toast.error("Veuillez remplir correctement tous les champs requis.");
       return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      const newMessage = {
        id: `MSG-${Date.now().toString().slice(-4)}`,
        name,
        phone,
        email,
        subject,
        message,
        date: new Date().toLocaleDateString('fr-FR'),
        isRead: false
      };
      
      const newMessages = [newMessage, ...(config.messages || [])];
      
      updateConfig({ messages: newMessages });
      
      sendAdminNotification(config.emailNotificationKey, 'Nouveau Message de Contact', {
        Nom: name,
        Email: email,
        Telephone: phone,
        Sujet: subject,
        Message: message
      });

      setIsSubmitting(false);
      setSubmitSuccess(true);
      toast.success('Message envoyé avec succès !');
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
      setTouched({ name: false, phone: false, email: false, message: false });
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  const getInputClass = (fieldName: string, isValid: boolean) => {
    const isTouched = touched[fieldName as keyof typeof touched];
    if (!isTouched) return "border-gold-muted/50 focus:border-gold bg-navy-800/50";
    return isValid ? "border-green-500/50 focus:border-green-500 bg-green-500/5" : "border-red-500/50 focus:border-red-500 bg-red-500/5";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-[280px] pb-16 sm:px-6 lg:px-8">
      <div className="mb-16 text-center">
        <span className="text-[12px] uppercase tracking-[4px] text-gold mb-2 block">Reach Out</span>
        <h1 className="text-3xl font-light tracking-tight text-text sm:text-4xl">Contactez-nous</h1>
        <p className="mt-4 text-sm  text-text/90 font-medium uppercase tracking-widest">Notre équipe à Kinshasa et à Dubai est à votre disposition.</p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-glass p-8 border border-gold-muted">
            <h2 className="mb-8 text-[13px] uppercase tracking-[1px] font-semibold text-gold">Bureau Kinshasa</h2>
            <ul className="space-y-8">
              <li className="flex gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-gold text-gold rounded-full">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-[11px] uppercase tracking-wider font-semibold text-text">Adresse</h3>
                  <p className="text-text/90 font-medium text-sm  mt-2 leading-relaxed whitespace-pre-wrap">{config.address}</p>
                </div>
              </li>
              <li className="flex gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-gold text-gold rounded-full">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="text-[11px] uppercase tracking-wider font-semibold text-text">Téléphone & WhatsApp</h3>
                  <p className="text-text/90 font-medium text-sm  mt-2 leading-relaxed whitespace-pre-wrap">{config.contactPhone1}{'\n'}{config.contactPhone2}</p>
                </div>
              </li>
              <li className="flex gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-gold text-gold rounded-full">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-[11px] uppercase tracking-wider font-semibold text-text">Email</h3>
                  <p className="text-text/90 font-medium text-sm  mt-2">{config.contactEmail}</p>
                </div>
              </li>
              <li className="flex gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-gold text-gold rounded-full">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-[11px] uppercase tracking-wider font-semibold text-text">Heures d'ouverture</h3>
                  <p className="text-text/90 font-medium text-sm  mt-2 leading-relaxed whitespace-pre-wrap">{config.workingHours}</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="border border-gold-muted bg-navy-800 p-8 text-text relative">
            <h2 className="mb-4 text-[13px] uppercase tracking-[1px] font-semibold text-gold">Bureau Dubai (Partenaire)</h2>
            <p className="text-text/90 font-medium text-sm  mb-6 leading-relaxed">Pour les inspections de véhicules et le fret, notre équipe sur place à Deira est mobilisée pour vous.</p>
            <p className="text-xl font-light tracking-[2px] text-text whitespace-pre-wrap">{config.contactWhatsapp}</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-glass p-8 border border-gold-muted text-text relative overflow-hidden">
          <h2 className="mb-8 text-[13px] uppercase tracking-[1px] font-semibold text-gold">Envoyez-nous un message</h2>
          <AnimatePresence>
            {submitSuccess && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                className="absolute inset-0 z-10 bg-glass backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center border border-green-500/20 mb-6">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-light text-text mb-2">Message envoyé !</h3>
                <p className="text-sm text-text/70">Nous avons bien reçu votre demande et vous répondrons dans les plus brefs délais.</p>
              </motion.div>
            )}
          </AnimatePresence>
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="flex flex-col gap-2 relative">
                <label className="text-[10px] uppercase text-gold tracking-[1.5px] ml-4 font-semibold">Nom complet</label>
                <input 
                  type="text" 
                  required 
                  value={name}
                  placeholder="Votre nom complet"
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched({ ...touched, name: true })}
                  className={`w-full rounded-lg border px-4 py-3 text-sm font-light text-text outline-none transition-all placeholder:text-text/30 ${getInputClass('name', isNameValid)}`} 
                />
                {!isNameValid && touched.name && <span className="text-red-500 text-[10px] uppercase tracking-wider absolute -bottom-5 left-4 text-nowrap">Nom invalide.</span>}
              </div>
              <div className="flex flex-col gap-2 relative">
                <label className="text-[10px] uppercase text-gold tracking-[1.5px] ml-4 font-semibold">Téléphone</label>
                <input 
                  type="tel" 
                  required 
                  value={phone}
                  placeholder="+243 ..."
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => setTouched({ ...touched, phone: true })}
                  className={`w-full rounded-lg border px-4 py-3 text-sm font-light text-text outline-none transition-all placeholder:text-text/30 ${getInputClass('phone', isPhoneValid)}`} 
                />
                {!isPhoneValid && touched.phone && <span className="text-red-500 text-[10px] uppercase tracking-wider absolute -bottom-5 left-4">Téléphone invalide</span>}
              </div>
            </div>
            
            <div className="flex flex-col gap-2 relative mt-8">
              <label className="text-[10px] uppercase text-gold tracking-[1.5px] ml-4 font-semibold">E-mail</label>
              <input 
                type="email" 
                required 
                value={email}
                placeholder="votre@email.com"
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched({ ...touched, email: true })}
                className={`w-full rounded-lg border px-4 py-3 text-sm font-light text-text outline-none transition-all placeholder:text-text/30 ${getInputClass('email', isEmailValid)}`} 
              />
              {!isEmailValid && touched.email && <span className="text-red-500 text-[10px] uppercase tracking-wider absolute -bottom-5 left-4">E-mail invalide.</span>}
            </div>
            
            <div className="flex flex-col gap-2 relative mt-8">
              <label className="text-[10px] uppercase text-gold tracking-[1.5px] ml-4 font-semibold">Sujet</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-lg bg-navy-800/50 border border-gold-muted/50 px-4 py-3 text-sm font-light text-text outline-none focus:border-gold appearance-none transition-all cursor-pointer">
                {[
                  'Billets d\'avion', 
                  'Visas', 
                  'Boutique', 
                  'Importation de voitures', 
                  'Autre'
                ].map(option => (
                  <option key={option} className="bg-navy-800 text-sm font-light">{option}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 relative mt-8 mb-8">
              <label className="text-[10px] uppercase text-gold tracking-[1.5px] ml-4 font-semibold">Message</label>
              <textarea 
                required 
                rows={5} 
                value={message}
                placeholder="Comment pouvons-nous vous aider ?"
                onChange={(e) => setMessage(e.target.value)}
                onBlur={() => setTouched({ ...touched, message: true })}
                className={`w-full rounded-lg border px-4 py-3 text-sm font-light text-text outline-none resize-none transition-all placeholder:text-text/30 ${getInputClass('message', isMessageValid)}`}
              ></textarea>
              {!isMessageValid && touched.message && <span className="text-red-500 text-[10px] uppercase tracking-wider absolute -bottom-5 left-4">Message trop court.</span>}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="flex w-full mt-8 items-center justify-center gap-3 rounded-lg bg-gold px-8 py-4 text-xs tracking-widest uppercase font-bold text-[#0f172a] shadow-lg transition-all hover:bg-[#d4b069] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0f172a]/20 border-t-[#0f172a] rounded-full animate-spin"></div>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Envoyer le message
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-20 max-w-3xl mx-auto">
        <h2 className="text-2xl font-light text-center text-text mb-8">Questions Fréquentes</h2>
        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div key={index} className="border border-gold-muted/50 bg-glass transition-colors hover:border-gold/50 overflow-hidden">
              <button 
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full text-left px-6 py-4 flex items-center justify-between outline-none"
              >
                <span className="font-medium text-sm text-text pr-4">{faq.question}</span>
                {activeFaq === index ? <ChevronUp size={16} className="text-gold flex-shrink-0 transition-transform duration-300" /> : <ChevronDown size={16} className="text-gold flex-shrink-0 transition-transform duration-300" />}
              </button>
              <AnimatePresence initial={false}>
                {activeFaq === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-4 text-sm text-text/80 leading-relaxed border-t border-gold-muted/20 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Reviews } from "../components/Reviews";
import { motion } from "motion/react";
import { useState, FormEvent, useEffect } from 'react';
import { Upload, CheckCircle, Clock } from 'lucide-react';
import { useSiteConfig } from '../components/SiteContext';
import { LazyImage } from '../components/LazyImage';
import toast from 'react-hot-toast';

export default function Visas() {
  const { config, updateConfig } = useSiteConfig();
  const [selectedVisa, setSelectedVisa] = useState(config.visaTypes?.[0]?.id || '');
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [passport, setPassport] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [includeInsurance, setIncludeInsurance] = useState(false);
  const [touched, setTouched] = useState({ name: false, phone: false });

  const isNameValid = name.trim().length > 3;
  const isPhoneValid = /^\+?[0-9]{8,}$/.test(phone);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isNameValid || !isPhoneValid) {
      setTouched({ name: true, phone: true });
      return;
    }
    const visa = config.visaTypes?.find(v => v.id === selectedVisa);
    
    // Create and save an order
    const newOrder = {
      id: `#CMD-${String((config.orders?.length ? Math.max(...config.orders.map(o => parseInt(o.id.replace(/\D/g, "") || "0"))) : 0) + 1).padStart(3, "0")}`,
      client: name,
      email: email,
      phone: phone,
      item: `${visa?.name}${includeInsurance ? ' + Assurance Voyage' : ''}`,
      date: new Date().toLocaleDateString('fr-FR'),
      status: 'En attente',
      statusColor: 'text-amber-400 bg-amber-500/20 border-amber-500/40 font-semibold'
    };
    
    updateConfig({
      orders: [newOrder, ...(config.orders || [])]
    });
    
    setSubmitted(true);
    toast.success('Demande de visa envoyée avec succès !');
    
    const message = `Bonjour, je souhaite faire une demande de ${visa?.name}${includeInsurance ? ' avec Assurance Voyage' : ''}. Nom: ${name}, Téléphone: ${phone}`;
    const num = "243826636212";
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getInputClass = (fieldName: string, isValid: boolean) => {
    const isTouched = touched[fieldName as keyof typeof touched];
    if (!isTouched) return "border-text/20 focus:border-gold";
    return isValid ? "border-green-500 focus:border-green-500" : "border-red-500 focus:border-red-500";
  };

  const serviceInfo = config.services?.find(s => s.link === '/visas');

  const handleWhatsapp = () => {
    const message = `Bonjour, je souhaite avoir plus de détails concernant les visas.`;
    const num = "243826636212";
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="pt-24 min-h-screen bg-navy pb-20">
      <div className="w-full h-64 md:h-80 relative mb-12">
        <LazyImage 
          src={serviceInfo?.imageUrl || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop"}
          alt="Services Immigrations et Visas" 
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
          <CheckCircle size={32} className="text-gold" />
        </div>
        <span className="text-[12px] uppercase tracking-[4px] text-gold mb-4 block">Services Immigrations</span>
        <h1 className="text-3xl font-display text-gold mb-4 drop-shadow-md">
          Obtenez votre Visa Dubai
        </h1>
        <p className="text-text/90 max-w-2xl mx-auto uppercase tracking-widest text-sm drop-shadow">
          {serviceInfo?.content || serviceInfo?.description || "Rapide, fiable et sans complications. Choisissez votre visa et envoyez vos documents."}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Visa Options */}
        <div>
          <h2 className="mb-6 text-[13px] uppercase tracking-[1px] font-semibold text-gold">1. Choisissez votre type de visa</h2>
          <div className="space-y-4">
            {config.visaTypes?.map((visa) => (
              <label 
                key={visa.id}
                className={`flex cursor-pointer items-center justify-between border p-6 transition-all ${
                  selectedVisa === visa.id 
                    ? 'border-gold bg-gold/10' 
                    : 'border-gold-muted bg-navy-800 hover:border-gold/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="visa_type"
                    value={visa.id}
                    checked={selectedVisa === visa.id}
                    onChange={(e) => setSelectedVisa(e.target.value)}
                    className="h-4 w-4 appearance-none rounded-full border border-gold checked:bg-gold checked:border-transparent outline-none focus:ring-1 focus:ring-gold focus:ring-offset-1 focus:ring-offset-navy"
                  />
                  <div>
                    <p className="text-[13px] uppercase tracking-[1px] font-light text-text">{visa.name}</p>
                    <p className="text-[10px] text-text/90 font-medium uppercase tracking-widest flex items-center gap-1 mt-1 ">
                      <Clock size={12} /> Délai: {visa.duration}
                    </p>
                  </div>
                </div>
                <div className="text-xl font-light text-text">{visa.price}</div>
              </label>
            ))}
          </div>

          <div className="mt-8 border border-gold-muted bg-glass p-6 text-text/90 font-medium">
            <h3 className="text-[11px] uppercase tracking-wider font-semibold mb-3 text-gold">Documents requis :</h3>
            <ul className="list-disc pl-5 text-sm space-y-2 font-light mb-8">
              <li>Copie couleur du passeport valide (min 6 mois)</li>
              <li>Photo format passeport (fond blanc)</li>
            </ul>

            <div className="pt-8 mt-8 border-t border-gold-muted/20">
              <Reviews serviceTitle="Services Immigrations" layout="vertical" className="w-full" />
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div>
          <h2 className="mb-6 text-[13px] uppercase tracking-[1px] font-semibold text-gold">2. Soumettez vos documents</h2>
          
          {submitted ? (
             <div className="border border-gold-muted bg-glass p-8 text-center text-text">
             <CheckCircle className="mx-auto mb-4 h-12 w-12 text-gold" />
             <h3 className="mb-2 text-2xl font-light">Demande reçue !</h3>
             <p className="mb-6 text-text/90 font-medium text-sm ">Votre dossier a été transmis avec succès. Vous recevrez un lien de paiement par WhatsApp sous peu.</p>
             <p className="text-[11px] uppercase tracking-widest text-gold">Numéro de suivi : <span className="text-text ml-2">KD-VS-9842</span></p>
           </div>
          ) : (
            <form onSubmit={handleSubmit} className="border border-gold-muted bg-glass p-8">
              <div className="space-y-8">
                <div className="flex flex-col gap-2 relative">
                  <label className="text-[10px] uppercase text-gold tracking-[1.5px]">Nom complet (tel que sur le passeport)</label>
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => setTouched({ ...touched, name: true })}
                    className={`w-full bg-transparent border-b text-lg font-light text-text outline-none pb-2 transition-colors ${getInputClass('name', isNameValid)}`} 
                  />
                  {!isNameValid && touched.name && <span className="text-red-500 text-[10px] uppercase tracking-wider absolute -bottom-5">Le nom doit contenir au moins 3 caractères.</span>}
                </div>
                
                <div className="flex flex-col gap-2 relative mt-8">
                  <label className="text-[10px] uppercase text-gold tracking-[1.5px]">Email</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="votre@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-text/20 focus:border-gold text-lg font-light text-text outline-none pb-2 transition-colors" 
                  />
                </div>

                <div className="flex flex-col gap-2 relative mt-8">
                  <label className="text-[10px] uppercase text-gold tracking-[1.5px]">Numéro WhatsApp</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="+243 ..." 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={() => setTouched({ ...touched, phone: true })}
                    className={`w-full bg-transparent border-b text-lg font-light text-text outline-none pb-2 transition-colors ${getInputClass('phone', isPhoneValid)}`} 
                  />
                  {!isPhoneValid && touched.phone && <span className="text-red-500 text-[10px] uppercase tracking-wider absolute -bottom-5">Format de téléphone invalide.</span>}
                </div>

                <div className="flex flex-col gap-2 mt-8">
                  <label className="text-[10px] uppercase text-gold tracking-[1.5px] mb-2">Téléverser le Passeport</label>
                  <div className="flex w-full items-center justify-center">
                    <label className={`flex h-32 w-full cursor-pointer flex-col items-center justify-center border border-dashed bg-transparent hover:bg-white/5 transition-colors ${passport ? 'border-green-500' : 'border-gold-muted'}`}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-text/90 font-medium">
                        {passport ? <CheckCircle className="mb-3 h-6 w-6 text-green-500" /> : <Upload className="mb-3 h-6 w-6 text-gold" />}
                        <p className="mb-2 text-[11px] uppercase tracking-wider">{passport ? <span className="text-green-500">{passport.name}</span> : <><span className="text-gold">Cliquez</span> ou glissez le fichier</>}</p>
                        {!passport && <p className="text-[10px] tracking-widest">PDF, JPG ou PNG (MAX. 5MB)</p>}
                      </div>
                      <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" required onChange={(e) => e.target.files && setPassport(e.target.files[0])} />
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase text-gold tracking-[1.5px] mb-2">Téléverser la Photo</label>
                  <div className="flex w-full items-center justify-center">
                    <label className={`flex h-32 w-full cursor-pointer flex-col items-center justify-center border border-dashed bg-transparent hover:bg-white/5 transition-colors ${photo ? 'border-green-500' : 'border-gold-muted'}`}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-text/90 font-medium">
                        {photo ? <CheckCircle className="mb-3 h-6 w-6 text-green-500" /> : <Upload className="mb-3 h-6 w-6 text-gold" />}
                        <p className="mb-2 text-[11px] uppercase tracking-wider">{photo ? <span className="text-green-500">{photo.name}</span> : <><span className="text-gold">Cliquez</span> ou glissez le fichier</>}</p>
                        {!photo && <p className="text-[10px] tracking-widest">JPG ou PNG (MAX. 5MB)</p>}
                      </div>
                      <input type="file" className="hidden" accept=".jpg,.jpeg,.png" required onChange={(e) => e.target.files && setPhoto(e.target.files[0])} />
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6 border border-gold-muted/30 p-4 bg-navy-800/50">
                  <input
                    type="checkbox"
                    id="insurance"
                    checked={includeInsurance}
                    onChange={(e) => setIncludeInsurance(e.target.checked)}
                    className="h-5 w-5 appearance-none rounded border border-gold checked:bg-gold checked:border-transparent outline-none focus:ring-1 focus:ring-gold focus:ring-offset-1 focus:ring-offset-navy flex items-center justify-center after:content-['✓'] after:text-[10px] after:text-navy after:hidden checked:after:block"
                  />
                  <div>
                    <label htmlFor="insurance" className="text-[13px] uppercase tracking-[1px] font-semibold text-text cursor-pointer">
                      Ajouter une Assurance Voyage
                    </label>
                    <p className="text-[11px] text-text/60 mt-1">Recommandé pour votre séjour.</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 mt-8">
                  <button
                    type="submit"
                    disabled={(!isNameValid || !isPhoneValid || !passport || !photo) && (touched.name || touched.phone)}
                    className="w-full bg-gold py-4 text-xs tracking-widest uppercase font-semibold text-[#0f172a] transition-colors hover:bg-[#d4b069] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Envoyer la demande
                  </button>
                  <button
                    type="button"
                    onClick={handleWhatsapp}
                    className="w-full bg-transparent border border-gold/50 text-gold py-4 text-xs font-bold uppercase tracking-[2px] hover:bg-gold/10 transition-all flex items-center justify-center gap-2"
                  >
                    Continuer la discussion sur WhatsApp
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}

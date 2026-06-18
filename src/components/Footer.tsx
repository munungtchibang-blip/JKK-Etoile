import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { NAV_ITEMS } from '../lib/constants';
import { Plane, MapPin, Phone, Mail, Facebook, Instagram, MessageCircle, Twitter, Youtube, CheckCircle } from 'lucide-react';
import { useSiteConfig } from './SiteContext';

export default function Footer() {
  const { config } = useSiteConfig();
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 5000); // Reset after 5 seconds
  };

  return (
    <footer className="bg-navy-800 text-text/90 font-medium border-t border-gold-muted z-10 relative">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-[2px] text-gold uppercase mb-4">
              {config.logoUrl ? (
                <div className="w-full max-w-[300px] py-3 transition-all duration-500 hover:scale-105 flex justify-start items-center">
                  <img src={config.logoUrl} alt="Logo" className="max-h-16 md:max-h-24 lg:max-h-28 w-auto object-contain" />
                </div>
              ) : (
                'JKK ETOILE'
              )}
            </Link>
            <p className="text-sm font-light">
              Votre pont de confiance entre Kinshasa et Dubai. Services de voyage, visas, import-export et logistique.
            </p>
            <div className="flex items-center gap-4 pt-2">
              {config.socialFacebook && (
                <a href={config.socialFacebook} target="_blank" rel="noopener noreferrer" className="text-text/90 font-medium hover:text-gold transition-colors">
                  <Facebook size={20} />
                </a>
              )}
              {config.socialInstagram && (
                <a href={config.socialInstagram} target="_blank" rel="noopener noreferrer" className="text-text/90 font-medium hover:text-gold transition-colors">
                  <Instagram size={20} />
                </a>
              )}
              {config.socialTwitter && (
                <a href={config.socialTwitter} target="_blank" rel="noopener noreferrer" className="text-text/90 font-medium hover:text-gold transition-colors">
                  <Twitter size={20} />
                </a>
              )}
              {config.socialYoutube && (
                <a href={config.socialYoutube} target="_blank" rel="noopener noreferrer" className="text-text/90 font-medium hover:text-gold transition-colors">
                  <Youtube size={20} />
                </a>
              )}
              {config.contactWhatsapp && (
                <a href={`https://wa.me/243826636212`} target="_blank" rel="noopener noreferrer" className="text-text/90 font-medium hover:text-gold transition-colors">
                  <MessageCircle size={20} />
                </a>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-wider text-text uppercase">Liens rapides</h3>
            <ul className="space-y-2 text-sm font-light">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="transition-colors hover:text-gold uppercase tracking-wider text-[11px]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-wider text-text uppercase">Nos Services</h3>
            <ul className="space-y-2 text-[11px] uppercase tracking-wider font-light">
              {(config.services || []).map(svc => (
                 <li key={svc.id}>
                    <Link to={svc.link} className="hover:text-gold transition-colors">{svc.title}</Link>
                 </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-wider text-text uppercase">Contact</h3>
            <ul className="space-y-3 text-sm font-light">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-gold" />
                <span className="whitespace-pre-wrap">{config.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-gold" />
                <span className="whitespace-pre-wrap">{config.contactPhone1}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-gold" />
                <span>{config.contactEmail}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gold-muted pt-8 pb-4">
          <div className="max-w-md mx-auto text-center">
            <h3 className="mb-2 text-xs font-semibold tracking-wider text-text uppercase">Newsletter</h3>
            <p className="mb-4 text-[11px] uppercase tracking-wider font-light text-text/70">
              Inscrivez-vous pour recevoir les dernières mises à jour, nos offres spéciales et nouveaux arrivages.
            </p>
            {subscribed ? (
              <div className="flex items-center justify-center gap-2 text-green-400 bg-green-400/10 py-2 px-4 rounded border border-green-500/20 text-xs font-semibold uppercase tracking-widest">
                <CheckCircle size={16} />
                Inscription réussie !
              </div>
            ) : (
              <form className="flex gap-2" onSubmit={handleSubscribe}>
                <input 
                  type="email" 
                  required 
                  placeholder="Votre adresse e-mail" 
                  className="w-full bg-navy border border-text/20 px-3 py-2 rounded text-xs text-text focus:outline-none focus:border-gold placeholder:text-text/30"
                />
                <button 
                  type="submit"
                  className="bg-gold text-[#0f172a] px-4 py-2 font-bold uppercase tracking-widest text-xs rounded hover:bg-opacity-90 transition-colors"
                >
                  S'inscrire
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-gold-muted/30 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-text/70 font-medium gap-4 text-center md:text-left">
          <div className="flex flex-col md:flex-row gap-2 md:gap-6">
            <span>RCCM: CD/KNG/RCCM/[À_compléter]</span>
            <span>Id. Nat: [À_compléter]</span>
            <span>N° Impôt: [À_compléter]</span>
          </div>
          <p>&copy; {new Date().getFullYear()} {config.logoUrl ? 'JKK' : 'JKK ETOILE'}. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

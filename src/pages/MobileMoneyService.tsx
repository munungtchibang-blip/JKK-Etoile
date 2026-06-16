import { Reviews } from "../components/Reviews";
import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, Phone, CheckCircle } from 'lucide-react';
import { useSiteConfig } from '../components/SiteContext';

export default function MobileMoneyService() {
  const { config } = useSiteConfig();
  const service = config.services?.find((s: any) => s.id === '10');

  return (
    <div className="pt-24 min-h-screen bg-navy pb-20">
      {service?.imageUrl && (
        <div className="w-full h-64 md:h-80 relative mb-12">
          <img src={service.imageUrl} alt="Service Mobile Money" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent"></div>
          <div className="absolute inset-0 bg-navy/40 backdrop-blur-[3px]"></div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex flex-col items-center justify-center p-8 bg-glass backdrop-blur-md rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] mb-12 border border-gold-muted/20 text-center ${!service?.imageUrl ? "mt-12" : "relative z-10 -mt-24"}`}
        >
          <div className="inline-flex items-center justify-center p-4 bg-gold-muted/10 rounded-full mb-6">
            <CreditCard size={32} className="text-gold" />
          </div>
          <h1 className="text-3xl font-display text-gold mb-4">
            Service Mobile Money
          </h1>
          <p className="text-text/70 max-w-2xl mx-auto">
            Consultez nos différents numéros Mobile Money pour faciliter vos transferts et transactions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {config.mobileMoneyOptions?.map((option, idx) => (
            <motion.div
              key={option}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#1e293b]/50 border border-gold-muted/20 p-4 rounded-lg relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                <CreditCard size={32} className="text-gold" />
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gold mb-3 pr-8 truncate">{option}</h3>
              <div className="flex items-center gap-3 text-text/90">
                <div className="w-8 h-8 rounded-full bg-gold-muted/10 flex items-center justify-center shrink-0">
                  <Phone size={14} className="text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] uppercase tracking-wider text-text/50 truncate">Numéro / Compte</p>
                  <p 
                    className="font-mono text-sm cursor-pointer hover:text-gold transition-colors flex items-center gap-2 truncate"
                    onClick={() => {
                        const val = config.agencyAccounts?.[option];
                        if (val) {
                          navigator.clipboard.writeText(val);
                          alert('Copié !');
                        }
                    }}
                    title="Cliquez pour copier"
                  >
                    {config.agencyAccounts?.[option] || 'Non conf.'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
          
          {(!config.mobileMoneyOptions || config.mobileMoneyOptions.length === 0) && (
             <div className="col-span-full py-12 text-center text-text/60 border border-dashed border-white/10 rounded">
                Aucun numéro Mobile Money n'est actuellement configuré.
             </div>
          )}
        </div>
        <Reviews serviceTitle="Mobile Money" />
      </div>
    </div>
  );
}

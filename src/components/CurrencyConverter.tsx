import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, X, ArrowUpDown } from 'lucide-react';
import { useSiteConfig } from './SiteContext';

export default function CurrencyConverter() {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<'USD' | 'CDF'>('USD');
  const { config } = useSiteConfig();
  
  const rate = config.exchangeRate || 2250; // Default fallback rate

  const convertedAmount = fromCurrency === 'USD' 
    ? parseFloat(amount || '0') * rate 
    : parseFloat(amount || '0') / rate;

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-navy border border-gold-muted/30 shadow-lg p-4 rounded-full text-gold hover:bg-gold/10 transition-colors flex items-center justify-center"
        aria-label="Convertisseur de devises"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Calculator size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-6 z-50 w-72 bg-navy-800 border border-gold/30 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl"
          >
            <div className="bg-navy p-4 flex items-center justify-between border-b border-white/10">
              <h3 className="text-sm uppercase tracking-widest font-bold text-gold flex items-center gap-2">
                <Calculator size={16} />
                Convertisseur
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-text/60 hover:text-white transition-colors p-1"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="relative">
                <label className="text-[10px] text-text/60 uppercase tracking-wider mb-1 block">Montant ({fromCurrency})</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-navy/50 border border-gold-muted/20 rounded p-3 text-text focus:outline-none focus:border-gold transition-colors text-xl font-display"
                  min="0"
                />
              </div>

              <div className="flex justify-center -my-2 relative z-10">
                <button 
                  onClick={() => setFromCurrency(prev => prev === 'USD' ? 'CDF' : 'USD')}
                  className="bg-gold text-navy p-2 rounded-full hover:bg-white transition-colors"
                >
                  <ArrowUpDown size={14} />
                </button>
              </div>

              <div className="bg-navy/30 border border-gold-muted/10 rounded p-4 text-center">
                <label className="text-[10px] text-text/60 uppercase tracking-wider mb-1 block">
                  Résultat ({fromCurrency === 'USD' ? 'CDF' : 'USD'})
                </label>
                <div className="text-2xl font-display text-gold">
                  {fromCurrency === 'USD' 
                    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'CDF' }).format(convertedAmount)
                    : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(convertedAmount)
                  }
                </div>
              </div>

              <div className="text-center pt-2">
                <p className="text-[9px] text-text/40 uppercase tracking-widest">Taux indicatif: 1 USD = {rate} CDF</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

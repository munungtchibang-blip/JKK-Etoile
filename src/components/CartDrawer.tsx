import { X, ShoppingCart, Plus, Minus, CreditCard, CheckCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from './CartContext';
import { useSiteConfig } from './SiteContext';
import { LazyImage } from './LazyImage';
import { useState } from 'react';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { config, updateConfig } = useSiteConfig();
  const [checkoutStep, setCheckoutStep] = useState(0);

  const total = cart.reduce((acc, item) => {
    if (item.type === 'shop') {
      const p = config.products?.find((p) => p.id === item.id);
      return acc + (p?.price || 0) * item.quantity;
    } else if (item.type === 'car') {
      const p = config.cars?.find((p) => p.id === item.id);
      return acc + (p?.price || 0) * item.quantity;
    }
    return acc;
  }, 0);

  const handleClose = () => {
    setIsCartOpen(false);
    setCheckoutStep(0);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-sm z-[150]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-navy-800 border-l border-gold/20 shadow-2xl z-[160] flex flex-col"
          >
            <div className="p-6 border-b border-gold-muted/30 flex items-center justify-between">
              <h2 className="text-sm uppercase tracking-widest font-bold text-gold flex items-center gap-2">
                <ShoppingCart size={18} />
                Mon Panier
              </h2>
              <button onClick={handleClose} className="p-2 text-text/60 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              {checkoutStep === 0 && (
                cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-text/50">
                    <ShoppingCart size={48} className="mb-4 opacity-20" />
                    <p className="text-xs uppercase tracking-widest">Votre panier est vide</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => {
                      let name, price, image;
                      if (item.type === 'shop') {
                        const p = config.products?.find(p => p.id === item.id);
                        if (!p) return null;
                        name = p.name; price = p.price; image = p.image;
                      } else if (item.type === 'car') {
                        const p = config.cars?.find(p => p.id === item.id);
                        if (!p) return null;
                        name = p.name; price = p.price; image = p.image;
                      }
                      
                      return (
                        <div key={`${item.type}-${item.id}`} className="flex gap-4 items-center bg-glass border border-gold-muted/20 p-3 rounded">
                          <LazyImage src={image || ''} alt={name || ''} className="w-16 h-16 object-cover rounded bg-navy" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-[11px] uppercase tracking-wider text-white line-clamp-1">{name}</h4>
                            <div className="text-gold text-xs font-light">{price}$</div>
                            {item.type === 'shop' && (
                              <div className="flex items-center gap-3 mt-2">
                                <button onClick={() => updateQuantity(item.id, -1)} className="w-5 h-5 border border-white/20 flex items-center justify-center hover:text-gold transition-colors"><Minus size={10} /></button>
                                <span className="text-[10px] w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="w-5 h-5 border border-white/20 flex items-center justify-center hover:text-gold transition-colors"><Plus size={10} /></button>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-xs text-white">{price! * item.quantity}$</div>
                            <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 p-1">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              )}

              {checkoutStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-[13px] uppercase tracking-widest font-semibold text-gold mb-4">Paiement</h3>
                  <div className="space-y-4">
                    {['M-PESA', 'Orange Money', 'Airtel Money'].map((provider) => (
                      <button key={provider} onClick={() => setCheckoutStep(2)} className="w-full flex items-center justify-between p-4 border border-gold-muted/30 bg-glass hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3 font-semibold text-[11px] uppercase tracking-wider"><CreditCard size={18} className="text-gold" /> {provider}</div>
                        <span className="text-gold text-xs">Payer {total}$</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {checkoutStep === 2 && (
                <div className="text-center py-10 mt-10">
                  <div className="w-16 h-16 border border-gold text-gold rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={32} /></div>
                  <h3 className="text-lg font-light mb-2 text-white">Paiement Réussi !</h3>
                  <p className="text-text/70 text-[10px] uppercase tracking-wider mb-8">Votre commande a été confirmée.</p>
                  <button onClick={() => { 
                    const clientName = localStorage.getItem('jkk_user_name') || "Client Anonyme";
                    const clientEmail = localStorage.getItem('jkk_user_email') || "";
                    
                    const newOrder = {
                      id: `#CMD-${String((config.orders?.length ? Math.max(...config.orders.map((o:any) => parseInt(o.id.replace(/\\D/g, "") || "0"))) : 0) + 1).padStart(3, "0")}`,
                      client: clientName,
                      email: clientEmail,
                      item: cart.map(item => {
                        if (item.type === 'shop') {
                          const p = config.products?.find((p:any) => p.id === item.id);
                          return p ? `${item.quantity}x ${p.name}` : '';
                        } else if (item.type === 'car') {
                          const p = config.cars?.find((p:any) => p.id === item.id);
                          return p ? `${item.quantity}x ${p.brand} ${p.model}` : '';
                        }
                        return '';
                      }).filter(Boolean).join(', '),
                      date: new Date().toLocaleDateString('fr-FR'),
                      status: "En cours",
                      statusColor: "text-amber-400 bg-amber-500/20 border-amber-500/40 font-semibold",
                      amount: `${total}$`
                    };
                    
                    if (updateConfig) {
                      updateConfig({ orders: [newOrder, ...(config.orders || [])] });
                    }

                    const itemsText = cart.map(item => {
                      if (item.type === 'shop') {
                        const p = config.products?.find((p:any) => p.id === item.id);
                        if (!p) return '';
                        return `${item.quantity}x ${p.name} (${p.price}$)`;
                      } else if (item.type === 'car') {
                        const p = config.cars?.find((p:any) => p.id === item.id);
                        if (!p) return '';
                        return `${item.quantity}x ${p.brand} ${p.model} (${p.price}$)`;
                      }
                      return '';
                    }).filter(Boolean).join("\\n");

                    const message = `Bonjour, je souhaite passer commande pour les articles suivants:\\n\\n${itemsText}\\n\\nTotal: ${total}$`;
                    const num = "243826636212";
                    window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, "_blank");

                    clearCart(); 
                    handleClose(); 
                  }} className="bg-gold text-navy text-xs font-bold uppercase tracking-widest px-8 py-3 hover:bg-[#d4b069] transition-colors w-full mb-4">Commander sur WhatsApp</button>
                  <button onClick={() => { clearCart(); handleClose(); }} className="border border-white/20 text-text text-xs font-bold uppercase tracking-widest px-8 py-3 hover:bg-white/5 transition-colors w-full">Fermer</button>
                </div>
              )}
            </div>

            {cart.length > 0 && checkoutStep === 0 && (
              <div className="p-6 border-t border-gold-muted/30 bg-navy/80">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-widest text-text/70">Total</span>
                  <span className="text-lg text-gold font-light">{total}$</span>
                </div>
                <button onClick={() => setCheckoutStep(1)} className="w-full bg-gold text-navy font-bold text-xs py-3 uppercase tracking-widest hover:bg-[#d4b069]">Passer la commande</button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

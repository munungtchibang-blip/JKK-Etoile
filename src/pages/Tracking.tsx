import { useState, FormEvent } from 'react';
import { Search, Package, MapPin, CheckCircle, Truck, Plane } from 'lucide-react';

export default function Tracking() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isSearched, setIsSearched] = useState(false);

  // Mock tracking data
  const trackingData = {
    status: 'en_transit',
    type: 'Colis (Boutique)',
    origin: 'Dubai, UAE',
    destination: 'Kinshasa, RDC',
    estimatedDelivery: '15 Mai 2026',
    steps: [
      { status: 'completed', title: 'Commande confirmée', date: '10 Mai 2026, 09:41', location: 'Dubai' },
      { status: 'completed', title: 'Pris en charge par le transporteur', date: '11 Mai 2026, 14:20', location: 'Dubai Hub' },
      { status: 'completed', title: 'Départ du vol', date: '12 Mai 2026, 06:00', location: 'DXB Airport' },
      { status: 'current', title: 'Arrivée à destination, dédouanement en cours', date: '13 Mai 2026, 11:30', location: 'FIH Airport, Kinshasa' },
      { status: 'pending', title: 'En cours de livraison locale', date: '--', location: 'Kinshasa' },
      { status: 'pending', title: 'Livré', date: '--', location: 'Adresse client' },
    ]
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      setIsSearched(true);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pt-[280px] pb-16 sm:px-6 lg:px-8 min-h-[80vh]">
      <div className="mb-12 text-center">
        <span className="text-[12px] uppercase tracking-[4px] text-gold mb-2 block">Logistique</span>
        <h1 className="text-3xl font-light tracking-tight text-text sm:text-4xl">Suivre une commande</h1>
        <p className="mt-4 text-sm  text-text/90 font-medium uppercase tracking-widest">Entrez votre numéro de suivi (Visa, Produit, ou Voiture) pour voir le statut en temps réel.</p>
      </div>

      <div className="mb-12">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Ex: KD-VS-9842 ou KD-CR-112"
            className="flex-1 bg-transparent border-b border-text/20 text-xl font-light text-text outline-none focus:border-gold pb-2 uppercase text-center sm:text-left px-2"
          />
          <button 
            type="submit"
            className="flex items-center justify-center gap-2 bg-gold px-8 py-3 text-xs tracking-widest uppercase font-semibold text-[#0f172a] transition-colors hover:bg-[#d4b069]"
          >
            <Search size={16} />
            <span className="hidden sm:inline">Rechercher</span>
          </button>
        </form>
      </div>

      {isSearched && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="border border-gold-muted bg-glass overflow-hidden">
            {/* Header info */}
            <div className="bg-navy-800 p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6 border-b border-gold-muted">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 border border-gold text-gold rounded-full flex items-center justify-center">
                  <Package size={24} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-text/90 font-medium mb-1">{trackingData.type}</div>
                  <div className="text-xl font-light text-text tracking-[2px]">{trackingNumber.toUpperCase()}</div>
                </div>
              </div>
              <div className="text-left md:text-right flex flex-col justify-center border-t border-gold-muted/30 pt-4 md:border-t-0 md:pt-0">
                <div className="text-[10px] uppercase tracking-widest text-text/90 font-medium mb-1">Livraison estimée</div>
                <div className="text-lg font-light text-text flex items-center gap-2 md:justify-end">
                  <Truck size={16} className="text-gold" />
                  {trackingData.estimatedDelivery}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-6 md:p-10 bg-navy">
              <div className="relative">
                {/* Vertical line mapping track */}
                <div className="absolute left-[21px] top-4 bottom-4 w-px bg-gold-muted hidden sm:block"></div>
                
                <div className="space-y-8">
                  {trackingData.steps.map((step, idx) => (
                    <div key={idx} className="relative flex gap-6">
                      <div className="hidden sm:flex flex-col items-center">
                        <div className={`z-10 h-11 w-11 rounded-full border flex items-center justify-center bg-navy
                          ${step.status === 'completed' ? 'border-gold text-gold' : 
                            step.status === 'current' ? 'border-white text-text' : 'border-gold-muted text-gold-muted'}`}
                        >
                          {step.status === 'completed' ? <CheckCircle size={16} /> : <MapPin size={16} />}
                        </div>
                        {idx !== trackingData.steps.length - 1 && (
                          <div className={`w-px h-full mt-2 ${step.status === 'completed' ? 'bg-gold' : 'bg-gold-muted'}`}></div>
                        )}
                      </div>
                      
                      <div className={`flex-1 p-5 border ${step.status === 'current' ? 'border-gold bg-navy-800' : 'border-gold-muted bg-glass'}`}>
                        <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start mb-2 gap-2">
                          <h4 className={`text-[13px] uppercase tracking-[1px] font-semibold ${step.status === 'pending' ? 'text-text/30' : 'text-text'}`}>
                            {step.title}
                          </h4>
                          <span className="text-[10px] uppercase tracking-widest text-text/90 font-medium whitespace-nowrap ">{step.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-text/90 font-medium  mt-4">
                          <MapPin size={12} className={step.status === 'current' ? 'text-gold' : ''} />
                          {step.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 border border-gold-muted bg-glass p-6 text-center">
            <h4 className="text-sm font-semibold text-text uppercase tracking-wider mb-2">Notifications de suivi</h4>
            <p className="text-[11px] text-text/70 uppercase tracking-widest mb-4">Recevez des alertes automatiques lors du changement de statut de votre commande.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Alerte configurée pour cet email'); }} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                required
                className="flex-1 bg-navy-800 border border-text/20 p-3 text-xs text-text outline-none focus:border-gold"
              />
              <button type="submit" className="bg-gold text-[#0f172a] px-6 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-[#d4b069] transition-colors">
                M'avertir
              </button>
            </form>
          </div>

          <div className="mt-8 text-center text-[10px] uppercase tracking-widest text-text/90 font-medium">
            Besoin de plus de détails ? <a href="https://wa.me/243826636212" className="text-gold font-medium hover:text-[#d4b069] ml-2 transition-colors">Contactez le support</a>
          </div>
        </div>
      )}
    </div>
  );
}

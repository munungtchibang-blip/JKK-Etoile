import React, { useState, useEffect } from 'react';
import { User, Package, FileText, Car, LogOut, CreditCard, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteConfig } from '../components/SiteContext';
import { generateInvoicePDF } from '../lib/pdf';
import { signInWithGoogle, logout, checkRedirectLogin } from '../firebase';

export default function Dashboard() {
  const { config } = useSiteConfig();
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('jkk_is_logged_in') === 'true');
  const [isSignUp, setIsSignUp] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');

  const [userName, setUserName] = useState(() => localStorage.getItem('jkk_user_name') || '');
  const [userPhone, setUserPhone] = useState(() => localStorage.getItem('jkk_user_phone') || '');
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('jkk_user_email') || '');
  const [userAddress, setUserAddress] = useState(() => localStorage.getItem('jkk_user_address') || '');
  
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const user = await checkRedirectLogin();
        if (user) {
          setUserName(user.displayName || "Utilisateur Google");
          setUserEmail(user.email || "");
          setUserPhone(user.phoneNumber || "");
          localStorage.setItem('jkk_user_name', user.displayName || "Utilisateur Google");
          localStorage.setItem('jkk_user_email', user.email || "");
          localStorage.setItem('jkk_user_phone', user.phoneNumber || "");
          localStorage.setItem('jkk_is_logged_in', 'true');
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Erreur avec la redirection", error);
      }
    };

    if (!isLoggedIn) {
      handleRedirect();
    }
  }, [isLoggedIn]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('jkk_is_logged_in');
      setIsLoggedIn(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleGoogleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const user = await signInWithGoogle();
      if (user) {
        setUserName(user.displayName || "Utilisateur Google");
        setUserEmail(user.email || "");
        setUserPhone(user.phoneNumber || "");
        localStorage.setItem('jkk_user_name', user.displayName || "Utilisateur Google");
        localStorage.setItem('jkk_user_email', user.email || "");
        localStorage.setItem('jkk_user_phone', user.phoneNumber || "");
        localStorage.setItem('jkk_is_logged_in', 'true');
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Erreur de connexion", error);
      alert("Une erreur est survenue lors de la connexion.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-md px-4 pt-[280px] pb-24 sm:px-6 lg:px-8">
        <div className="border border-gold-muted bg-glass p-8">
          <div className="mb-8 text-center">
             <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold text-gold">
              <User size={24} />
             </div>
            <h1 className="text-2xl font-light text-text mb-2 tracking-wide">
              {isSignUp ? "Créer un compte" : "Espace Client"}
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-text/90 font-medium ">
              {isSignUp ? "Remplissez les détails pour vous inscrire" : "Connectez-vous pour voir vos demandes"}
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <button 
              onClick={handleGoogleLogin} 
              className="flex items-center justify-center gap-3 w-full bg-white text-gray-900 py-3.5 px-4 text-[13px] tracking-wider uppercase font-semibold transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy focus:ring-white rounded shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Se connecter avec Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-[280px] pb-12 sm:px-6 lg:px-8 min-h-[80vh]">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gold-muted pb-8">
        <div>
          <span className="text-[12px] uppercase tracking-[4px] text-gold mb-2 block">Dashboard</span>
          <h1 className="text-3xl font-light text-text tracking-wide">Bonjour, {userName.split(' ')[0]}</h1>
          <p className="mt-2 text-[11px] uppercase tracking-widest text-text/90 font-medium">Gérez vos commandes, visas et véhicules.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 border border-gold-muted bg-glass px-5 py-2.5 text-[11px] uppercase tracking-wider text-text hover:text-gold transition-colors self-start lg:self-auto"
        >
          <LogOut size={14} /> Déconnexion
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <div className="lg:w-56 shrink-0">
          <nav className="flex lg:flex-col gap-4 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
            {[
              { id: 'orders', label: 'Boutique', icon: Package },
              { id: 'transfers', label: 'Transferts', icon: CreditCard },
              { id: 'visas', label: 'Visas', icon: FileText },
              { id: 'cars', label: 'Véhicules', icon: Car },
              { id: 'profile', label: 'Profil', icon: User },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-3 px-4 py-3 text-[11px] uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? 'text-gold' : 'text-text/90 font-medium hover:text-text'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="dashboard-tab-indicator"
                    className="absolute left-0 top-0 w-0.5 h-full bg-gold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="dashboard-tab-bg"
                    className="absolute inset-0 bg-white/5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-3">
                   <tab.icon size={16} />
                   {tab.label}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'orders' && (
            <div className="border border-gold-muted bg-glass">
              <div className="border-b border-gold-muted px-6 py-5">
                <h2 className="text-[13px] uppercase tracking-[1px] font-semibold text-gold">Commandes Boutique & Services</h2>
              </div>
              <div className="divide-y divide-gold-muted/30">
                {config.orders && config.orders.length > 0 ? (
                  config.orders.filter(o => o.client.includes(userName.split(' ')[0]) || true).slice(0, 5).map(order => (
                    <div key={order.id} className="p-6 flex flex-col gap-4 hover:bg-white/5 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                          <div className="text-text text-sm font-light mb-1">{order.id} - {order.date}</div>
                          <div className="text-[11px] uppercase tracking-wider text-text/90 font-medium">{order.item}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-semibold border ${order.statusColor}`}>
                            {order.status}
                          </span>
                          <button
                            onClick={() => generateInvoicePDF(userName, userEmail || 'Email non fourni', order.id, order.date, order.item, order.item.match(/\d+.\d+/) ? order.item : 'N/A', order.status)}
                            className="p-2 text-gold hover:text-white transition-colors border border-gold-muted/30 hover:bg-gold/10 rounded-full ml-2"
                            title="Télécharger la facture"
                          >
                            <Download size={14} />
                          </button>
                        </div>
                      </div>
                      {order.adminReply && (
                        <div className="bg-navy-800/50 p-4 border border-gold/20 rounded-md mt-2 relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold"></div>
                          <span className="text-[10px] uppercase tracking-widest text-gold font-bold block mb-1">Réponse de l'administration</span>
                          <p className="text-sm text-text/90 font-light whitespace-pre-wrap">{order.adminReply}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-text/60 text-sm">Aucune commande.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'transfers' && (
            <div className="border border-gold-muted bg-glass">
              <div className="border-b border-gold-muted px-6 py-5">
                <h2 className="text-[13px] uppercase tracking-[1px] font-semibold text-gold">Mes Transferts d'Argent</h2>
              </div>
              <div className="divide-y divide-gold-muted/30">
                {config.transfers && config.transfers.length > 0 ? (
                  config.transfers.filter(t => t.client.includes(userName.split(' ')[0]) || true).map(transfer => (
                    <div key={transfer.id} className="p-6 flex flex-col gap-4 hover:bg-white/5 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                          <div className="text-text text-sm font-light mb-1">{transfer.id} <span className="text-text/50">| {transfer.date}</span></div>
                          <div className="text-[11px] uppercase tracking-wider text-text/90 font-medium">{transfer.direction}</div>
                          <div className="text-[10px] uppercase tracking-widest text-text/50 mt-1">Via: {transfer.method}</div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-gold font-medium mb-2">{transfer.amount}</div>
                            <div className="flex items-center gap-2 justify-end">
                              <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-semibold border ${transfer.statusColor}`}>
                                {transfer.status}
                              </span>
                              <button
                                onClick={() => generateInvoicePDF(userName, userEmail || 'Email non fourni', transfer.id, transfer.date, transfer.direction, transfer.amount, transfer.status)}
                                className="p-1.5 text-gold hover:text-white transition-colors border border-gold-muted/30 hover:bg-gold/10 rounded-full"
                                title="Télécharger le reçu"
                              >
                                <Download size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {transfer.adminReply && (
                        <div className="bg-navy-800/50 p-4 border border-gold/20 rounded-md mt-2 relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold"></div>
                          <span className="text-[10px] uppercase tracking-widest text-gold font-bold block mb-1">Réponse de l'administration</span>
                          <p className="text-sm text-text/90 font-light whitespace-pre-wrap">{transfer.adminReply}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-text/60 text-sm">Aucun transfert en cours.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'visas' && (
             <div className="border border-gold-muted bg-glass">
             <div className="border-b border-gold-muted px-6 py-5">
               <h2 className="text-[13px] uppercase tracking-[1px] font-semibold text-gold">Demandes de Visa</h2>
             </div>
             <div className="divide-y divide-gold-muted/30">
               <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/5 transition-colors">
                 <div>
                   <div className="text-text text-sm font-light mb-1">KD-VS-9842</div>
                   <div className="text-[11px] uppercase tracking-wider text-text/90 font-medium">Visa Touriste - 30 Jours (Marc Kabamba)</div>
                 </div>
                 <div className="flex items-center gap-4">
                   <span className="border border-white/50 text-text/90 font-medium px-3 py-1 text-[10px] uppercase tracking-widest font-semibold bg-navy-800">En cours</span>
                   <button
                    onClick={() => generateInvoicePDF(userName, userEmail || 'Email non fourni', 'KD-VS-9842', new Date().toLocaleDateString(), 'Visa Touriste - 30 Jours (Marc Kabamba)', "Frais d'agence non définis", 'En cours')}
                    className="p-1.5 text-gold hover:text-white transition-colors border border-gold-muted/30 hover:bg-gold/10 rounded-full"
                    title="Télécharger la facture"
                   >
                    <Download size={14} />
                   </button>
                 </div>
               </div>
             </div>
           </div>
          )}

          {activeTab === 'cars' && (
             <div className="border border-gold-muted bg-glass">
             <div className="border-b border-gold-muted px-6 py-5">
               <h2 className="text-[13px] uppercase tracking-[1px] font-semibold text-gold">Importation Véhicules</h2>
             </div>
             <div className="p-16 text-center text-text/90 font-medium">
                <Car className="mx-auto mb-6 h-12 w-12 text-gold opacity-50" />
                <p className="text-[11px] uppercase tracking-widest font-light">Aucune importation de véhicule en cours.</p>
             </div>
           </div>
          )}

          {activeTab === 'profile' && (
             <div className="border border-gold-muted bg-glass">
             <div className="border-b border-gold-muted px-6 py-5">
               <h2 className="text-[13px] uppercase tracking-[1px] font-semibold text-gold">Mon Profil</h2>
             </div>
             <div className="p-6 max-w-md">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  localStorage.setItem('jkk_user_name', userName);
                  localStorage.setItem('jkk_user_phone', userPhone);
                  localStorage.setItem('jkk_user_email', userEmail);
                  localStorage.setItem('jkk_user_address', userAddress);
                  setUpdateSuccess(true);
                  setTimeout(() => setUpdateSuccess(false), 3000);
                }} className="space-y-6">
                  {updateSuccess && (
                    <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-500 px-4 py-3 text-sm font-light">
                      Votre profil a été mis à jour avec succès.
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase text-gold tracking-[1.5px]">Nom complet</label>
                    <input 
                      type="text" 
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required 
                      className="w-full bg-transparent border-b border-text/20 text-lg font-light text-text outline-none focus:border-gold pb-2"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase text-gold tracking-[1.5px]">Téléphone</label>
                    <input 
                      type="text" 
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      required 
                      className="w-full bg-transparent border-b border-text/20 text-lg font-light text-text outline-none focus:border-gold pb-2"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase text-gold tracking-[1.5px]">Email</label>
                    <input 
                      type="email" 
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full bg-transparent border-b border-text/20 text-lg font-light text-text outline-none focus:border-gold pb-2"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase text-gold tracking-[1.5px]">Adresse</label>
                    <input 
                      type="text" 
                      value={userAddress}
                      onChange={(e) => setUserAddress(e.target.value)}
                      className="w-full bg-transparent border-b border-text/20 text-lg font-light text-text outline-none focus:border-gold pb-2"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="bg-gold py-3 px-8 text-xs tracking-widest uppercase font-semibold text-[#0f172a] transition-colors hover:bg-[#d4b069] mt-4"
                  >
                    Mettre à jour
                  </button>
                </form>
             </div>
           </div>
          )}
        </div>
      </div>
    </div>
  );
}

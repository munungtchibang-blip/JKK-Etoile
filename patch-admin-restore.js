import fs from 'fs';
const file = './src/pages/Admin.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetContent = `                  onClick={(e) => {
      e.stopPropagation();
      if (config.transfers) {
          const newTransfers = config.transfers.filter(t => t.id !== transfer.id);
          updateConfig({ transfers: newTransfers });
          showToast("Transfert supprimé");
      }
    }}
                            className="bg-red-500/10 text-red-500 border border-red-500/20 w-6 h-6 flex items-center justify-center rounded hover:bg-red-500 hover:text-white transition-colors"
                            title="Supprimer le transfert"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>`;

const replacementContent = `                  onClick={(e) => {
                    e.stopPropagation();
                    setImages(images.filter((_, i) => i !== idx));
                  }}
                  className="absolute top-1 right-1 bg-navy/80 hover:bg-red-500/80 text-white p-1 rounded-full backdrop-blur-sm transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const menuItems = [
    { id: "dashboard", label: "Vue d'ensemble", icon: BarChart3 },
    { id: "orders", label: "Commandes", icon: ShoppingBag },
    { id: "transfers", label: "Transferts d'argent", icon: RefreshCcw },
    { id: "shop", label: "Boutique (Produits)", icon: ShoppingBag },
    { id: "cars", label: "Véhicules (Import)", icon: Car },
    { id: "services", label: "Services & Visas", icon: Plane },
    { id: "announcements", label: "Annonces", icon: Bell },
    { id: "messages", label: "Messages", icon: SettingsIcon },
    { id: "settings", label: "Paramètres", icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen bg-navy text-text pt-0">
      {/* Sidebar */}
      <aside className="w-64 bg-navy-800 border-r border-gold-muted/20 flex flex-col hidden md:flex h-screen fixed z-20 top-0">
        <div className="p-6 border-b border-gold-muted/20">
          <span className="text-[10px] uppercase tracking-[3px] text-gold block mb-2">
            Panel Administrateur
          </span>
          <h2 className="text-xl font-display tracking-wide">Gestion JKK</h2>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={\`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 \${activeTab === item.id ? "bg-gold/10 text-gold border border-gold/20" : "text-text/60 hover:text-text hover:bg-white/5"}\`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gold-muted/20">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text/60 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
          >
            <LogOut size={18} />
            Quitter
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 bg-navy px-6 pb-6 md:px-10 md:pb-10 pt-0 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 mt-0 pt-6">
          <div>
            <h1 className="text-3xl font-display">Administration</h1>
            <p className="text-sm text-text/90 font-medium  mt-1">
              Gérez votre plateforme JKK Etoile.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-text/60 hover:text-gold transition-colors"
            >
              <HomeIcon size={16} />
              Retour au site
            </Link>
          </div>
        </header>

        {activeTab === "dashboard" && (
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.3 }}
             className="space-y-6"
           >
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 { title: "Revenus du mois", value: calculateTotalRevenue(), trend: "+12%", color: "text-green-400" },
                 { title: "Commandes en attente", value: orders.filter(o => o.status === "En cours").length.toString(), trend: "À traiter", color: "text-gold" },
                 { title: "Nouveaux clients", value: getUniqueClientsCount(), trend: "+18%", color: "text-blue-400" },
                 { title: "Total Commandes", value: orders.length.toString(), trend: "Global", color: "text-purple-400" },
               ].map((stat, i) => (
                 <div key={i} className="bg-glass border border-gold-muted/20 p-6 rounded-lg relative overflow-hidden group hover:border-gold/30 transition-all shadow-lg hover:shadow-gold/10">
                   <span className="text-[11px] uppercase tracking-wider text-text/70 font-medium block mb-2">{stat.title}</span>
                   <div className="flex items-end justify-between">
                     <span className="text-3xl font-display text-text">{stat.value}</span>
                     <span className={\`text-[10px] font-bold px-2 py-1 bg-white/5 rounded \${stat.color}\`}>{stat.trend}</span>
                   </div>
                 </div>
               ))}
             </div>
             
             <div className="bg-glass border border-gold-muted/20 rounded-lg overflow-hidden flex flex-col">
               <div className="p-6 border-b border-gold-muted/20 flex items-center justify-between bg-navy-800/50">
                 <h3 className="font-display tracking-wide text-lg text-text">Dernières Commandes</h3>
                 <button onClick={() => setActiveTab("orders")} className="text-[11px] uppercase tracking-wider text-gold font-semibold bg-gold/10 px-3 py-1.5 rounded">Voir tout</button>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse whitespace-nowrap">
                   <thead>
                     <tr className="bg-navy-900/50 border-b border-gold-muted/30 text-[10px] uppercase tracking-widest text-text/60 font-bold">
                       <th className="p-4 font-normal">ID</th>
                       <th className="p-4 font-normal">Client</th>
                       <th className="p-4 font-normal">Statut</th>
                       <th className="p-4 font-normal text-right">Action</th>
                     </tr>
                   </thead>
                   <tbody className="text-sm font-light text-text/80">
                     {sortedOrders.slice(0, 5).map((order, i) => (
                       <tr key={i} className="border-b border-gold-muted/10 hover:bg-gold/5 transition-all duration-200">
                         <td className="p-4 text-gold font-medium">{order.id}</td>
                         <td className="p-4">{order.client}</td>
                         <td className="p-4">{renderStatus(order.status, order.statusColor)}</td>
                         <td className="p-4 text-right flex justify-end">
                           <button onClick={(e) => {
                             e.stopPropagation();
                             const newOrders = [...config.orders || []].filter(o => o.id !== order.id);
                             updateConfig({ orders: newOrders });
                             showToast("Commande supprimée");
                           }} className="bg-red-500/10 text-red-500 w-6 h-6 flex items-center justify-center rounded"><Trash2 size={12} /></button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>
           </motion.div>
        )}

        {activeTab === "orders" && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-display">Gestion des Commandes</h2>
             </div>
             <div className="bg-glass border border-gold-muted/20 rounded-lg overflow-hidden shadow-lg">
               <table className="w-full text-left border-collapse whitespace-nowrap">
                 <thead>
                   <tr className="bg-navy-800 border-b border-gold/30 text-[10px] uppercase text-gold font-bold">
                     <th className="p-4">ID</th><th className="p-4">Client</th><th className="p-4">Statut</th><th className="p-4 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="text-sm font-light text-text/80">
                   {sortedOrders.map((order) => (
                     <React.Fragment key={order.id}>
                       <tr className="border-b border-white/5 cursor-pointer">
                         <td className="p-4 text-gold">{order.id}</td>
                         <td className="p-4">{order.client}</td>
                         <td className="p-4">{renderStatus(order.status, order.statusColor)}</td>
                         <td className="p-4 text-right flex justify-end gap-2">
                           <button onClick={(e) => {
                             e.stopPropagation();
                             const newOrders = [...config.orders || []].filter(o => o.id !== order.id);
                             updateConfig({ orders: newOrders });
                           }} className="bg-red-500/10 text-red-500 w-6 h-6 flex items-center justify-center rounded"><Trash2 size={12} /></button>
                         </td>
                       </tr>
                     </React.Fragment>
                   ))}
                 </tbody>
               </table>
             </div>
           </motion.div>
        )}

        {activeTab === "transfers" && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-display">Gestion des Transferts</h2>
             </div>
             <div className="bg-glass border border-gold-muted/20 rounded-lg overflow-hidden shadow-lg">
               <table className="w-full text-left border-collapse whitespace-nowrap">
                 <thead>
                   <tr className="bg-navy-800 border-b border-gold/30 text-[10px] uppercase text-gold font-bold">
                     <th className="p-4">ID</th><th className="p-4">Client</th><th className="p-4">Montant</th><th className="p-4">Statut</th><th className="p-4 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="text-sm font-light text-text/80">
                   {(config.transfers || []).map((transfer) => (
                     <React.Fragment key={transfer.id}>
                       <tr className="border-b border-white/5 cursor-pointer" onClick={() => setExpandedTransferId(expandedTransferId === transfer.id ? null : transfer.id)}>
                         <td className="p-4 text-gold">{transfer.id}</td>
                         <td className="p-4">{transfer.client}</td>
                         <td className="p-4">{transfer.amount}</td>
                         <td className="p-4">{renderStatus(transfer.status, transfer.statusColor || "")}</td>
                         <td className="p-4 text-right flex justify-end gap-2">
                           <button onClick={(e) => {
                             e.stopPropagation();
                             const newTransfers = [...config.transfers || []].filter(t => t.id !== transfer.id);
                             updateConfig({ transfers: newTransfers });
                           }} className="bg-red-500/10 text-red-500 w-6 h-6 flex items-center justify-center rounded"><Trash2 size={12} /></button>
                         </td>
                       </tr>`;

content = content.replace(targetContent, replacementContent);
fs.writeFileSync(file, content);
console.log('Restored the missing lines!');

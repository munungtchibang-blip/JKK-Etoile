import fs from 'fs';
const file = './src/pages/Admin.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add Package import
if (!content.includes('Package,')) {
    content = content.replace(/import \{/, 'import { Package,');
}

// Add cargo tab
content = content.replace(
  /\{ id: "hotels", label: "Réservation d'hôtel", icon: Building2 \},/,
  `{ id: "hotels", label: "Réservation d'hôtel", icon: Building2 },\n    { id: "cargo", label: "Service Cargo", icon: Package },`
);

// Add getPendingCount helper
const pendingCountLogic = `
const getPendingCount = (id: string, config: any) => {
    if (!config) return 0;
    if (id === 'orders') return (config.orders || []).filter((o: any) => o.status === "En attente").length;
    if (id === 'transfers') return (config.transfers || []).filter((o: any) => o.status === "En attente").length;
    if (id === 'visas') return (config.orders || []).filter((o: any) => o.status === "En attente" && o.item && o.item.toLowerCase().includes('visa')).length;
    if (id === 'flights') return (config.orders || []).filter((o: any) => o.status === "En attente" && o.item && (o.item.toLowerCase().includes('billet') || o.item.toLowerCase().includes('vol'))).length;
    if (id === 'hotels') return (config.orders || []).filter((o: any) => o.status === "En attente" && o.item && (o.item.toLowerCase().includes('ho'))).length;
    if (id === 'cargo') return (config.orders || []).filter((o: any) => o.status === "En attente" && o.item && o.item.toLowerCase().includes('cargo')).length;
    return 0;
};
`;

if (!content.includes('getPendingCount')) {
  content = content.replace(
    /const menuItems = \[/,
    pendingCountLogic + '\n  const menuItems = ['
  );
}

// Render badges in menu
content = content.replace(
  /\{menuItems\.map\(\(item\) => \(\s*<button\s*key=\{item\.id\}\s*onClick=\{\(\) => setActiveTab\(item\.id\)\}\s*className=\{`(.*?)`\}\s*>\s*<item\.icon size=\{18\} \/>\s*\{item\.label\}\s*<\/button>\s*\)\)/,
  `{menuItems.map((item) => {
             const badgeCount = getPendingCount(item.id, config);
             return (
               <button
                 key={item.id}
                 onClick={() => setActiveTab(item.id)}
                 className={\`$1\`}
               >
                 <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    {item.label}
                 </div>
                 {badgeCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded ml-auto">
                      {badgeCount}
                    </span>
                 )}
               </button>
             );
          })}`
);

const expandedJsx = `
                        {expandedOrderId === order.id && (
                          <tr className="bg-navy-800/30 border-b border-gold-muted/20">
                            <td colSpan={4} className="p-6 whitespace-normal border-t-0 p-0 m-0">
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 text-sm">
                                <div>
                                   <p className="text-[10px] text-text/50 uppercase tracking-widest font-bold mb-2">Détails de la commande</p>
                                   <div className="space-y-1">
                                     <p><span className="text-gold opacity-80 inline-block w-20">Article:</span> <span className="font-medium">{order.item || order.type || 'Billet/Visa'}</span></p>
                                     <p><span className="text-gold opacity-80 inline-block w-20">Montant:</span> {order.amount || order.price || 'N/A'}</p>
                                     <p><span className="text-gold opacity-80 inline-block w-20">Date:</span> {order.date}</p>
                                   </div>
                                </div>
                                <div className="border-t md:border-t-0 md:border-l border-gold-muted/10 pt-4 md:pt-0 md:pl-6">
                                   <p className="text-[10px] text-text/50 uppercase tracking-widest font-bold mb-2">Informations Utilisateur</p>
                                   <div className="space-y-1">
                                     <p><span className="text-gold opacity-80 inline-block w-20">Nom:</span> {order.client}</p>
                                     <p><span className="text-gold opacity-80 inline-block w-20">Téléphone:</span> {order.phone || 'Non renseigné'}</p>
                                     <p><span className="text-gold opacity-80 inline-block w-20">Email:</span> {order.email || 'Non renseigné'}</p>
                                   </div>
                                   <div className="flex gap-3 mt-4">
                                     {order.phone && (
                                       <a href={\`https://wa.me/\${order.phone.replace(/[^0-9]/g, '')}\`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex-1 flex justify-center py-2 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-white rounded text-[11px] uppercase tracking-wider font-semibold transition-colors">
                                         WhatsApp
                                       </a>
                                     )}
                                     {order.email && (
                                       <a href={\`mailto:\${order.email}\`} onClick={(e) => e.stopPropagation()} className="flex-1 flex justify-center py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white rounded text-[11px] uppercase tracking-wider font-semibold transition-colors">
                                         Email
                                       </a>
                                     )}
                                   </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}`;

// Replace row behavior in local tables
content = content.replace(
  /<tr key=\{order\.id\} className="border-b border-white\/5 cursor-pointer hover:bg-white\/5 transition-colors" onClick=\{\(\) => \{ setActiveTab\('orders'\); setExpandedOrderId\(order\.id\); \}\}>\s*<td className="p-4 text-gold">\{order\.id\}<\/td>\s*<td className="p-4">\{order\.client\}<\/td>\s*<td className="p-4">\{order\.item\}<\/td>\s*<td className="p-4">\{renderStatus\(order\.status, order\.statusColor\)\}<\/td>\s*<\/tr>/g,
  `<React.Fragment key={order.id}>
     <tr className="border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}>
       <td className="p-4 text-gold">{order.id}</td>
       <td className="p-4">{order.client}</td>
       <td className="p-4">{order.item}</td>
       <td className="p-4">{renderStatus(order.status, order.statusColor)}</td>
     </tr>
     ${expandedJsx}
   </React.Fragment>`
);

let getServiceEditBlock = (serviceId) => `
            <div className="bg-glass border border-gold-muted/20 rounded-lg overflow-hidden p-6 mb-8 mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
               {(config.services || []).filter(s => s.id === '${serviceId}').map(svc => (
                  <React.Fragment key={svc.id}>
                    <div>
                      <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-1">Titre du service</label>
                      <input type="text" value={svc.title} onChange={(e) => {
                         const svcs = [...config.services];
                         const idx = svcs.findIndex(s => s.id === '${serviceId}');
                         if(idx > -1) { svcs[idx] = {...svcs[idx], title: e.target.value}; updateConfig({ services: svcs }); }
                      }} className="w-full bg-navy border border-text/20 p-2 text-xs rounded text-text" />
                    </div>
                    <div>
                      <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-1">Description (Aperçu)</label>
                      <input type="text" value={svc.description} onChange={(e) => {
                         const svcs = [...config.services];
                         const idx = svcs.findIndex(s => s.id === '${serviceId}');
                         if(idx > -1) { svcs[idx] = {...svcs[idx], description: e.target.value}; updateConfig({ services: svcs }); }
                      }} className="w-full bg-navy border border-text/20 p-2 text-xs rounded text-text" />
                    </div>
                    <div className="md:col-span-2">
                       <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-1">Bannière / Image</label>
                       {renderDropzone(svc.imageUrl || "", (val) => {
                          const svcs = [...config.services];
                          const idx = svcs.findIndex(s => s.id === '${serviceId}');
                          if(idx > -1) { svcs[idx] = {...svcs[idx], imageUrl: val}; updateConfig({ services: svcs }); }
                       })}
                    </div>
                  </React.Fragment>
               ))}
            </div>
`;

const cargoTabLogic = `
        {activeTab === "cargo" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-display">Gestion Service Cargo</h2>
            </div>
            ${getServiceEditBlock('9')}
            <div className="flex justify-between items-center mb-6 mt-8">
              <h2 className="text-xl font-display">Demandes Cargo</h2>
            </div>
            <div className="bg-glass border border-gold-muted/20 rounded-lg overflow-hidden shadow-lg">
               <table className="w-full text-left border-collapse whitespace-nowrap">
                 <thead>
                   <tr className="bg-navy-800 border-b border-gold/30 text-[10px] uppercase text-gold font-bold">
                     <th className="p-4">ID</th><th className="p-4">Client</th><th className="p-4">Demande</th><th className="p-4">Statut</th>
                   </tr>
                 </thead>
                 <tbody className="text-sm font-light text-text/80">
                   {(config.orders || []).filter(o => o.item && o.item.toLowerCase().includes('cargo')).map(order => (
                     <React.Fragment key={order.id}>
                       <tr className="border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}>
                         <td className="p-4 text-gold">{order.id}</td>
                         <td className="p-4">{order.client}</td>
                         <td className="p-4">{order.item}</td>
                         <td className="p-4">{renderStatus(order.status, order.statusColor)}</td>
                       </tr>
                       ${expandedJsx}
                     </React.Fragment>
                   ))}
                 </tbody>
               </table>
            </div>
          </motion.div>
        )}
`;

if (!content.includes('activeTab === "cargo"')) {
   content = content.replace(
     /\{activeTab === "services" && \(/,
     cargoTabLogic + '\n        {activeTab === "services" && ('
   );
}

fs.writeFileSync(file, content);
console.log('Patch complete.');

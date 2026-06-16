import fs from 'fs';
const file = './src/pages/Admin.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add "visas" to menuItems
content = content.replace(
  /\{ id: "services", label: "Services & Visas", icon: Plane \},/,
  `{ id: "services", label: "Services", icon: Plane },\n    { id: "visas", label: "Gestion Visas", icon: FileText },`
);

// 2. Dernières Commandes clickable
content = content.replace(
  /<tr key=\{i\} className="border-b border-gold-muted\/10 hover:bg-gold\/5 transition-all duration-200">/g,
  `<tr key={i} onClick={() => { setActiveTab("orders"); setExpandedOrderId(order.id); }} className="border-b border-gold-muted/10 hover:bg-gold/5 transition-all duration-200 cursor-pointer">`
);

// 3. Transfers WhatsApp button
content = content.replace(
  /<div className="flex justify-end mt-2">\s*<button\s*onClick=\{\(e\) => \{\s*e\.stopPropagation\(\);\s*showToast\("Réponse enregistrée"\);\s*\}\}/g,
  `<div className="flex justify-end gap-2 mt-2">
    {transfer.phone && (
      <a href={\`https://wa.me/\${transfer.phone.replace(/[^0-9]/g, '')}?text=\${encodeURIComponent(transfer.adminReply || "Bonjour concernant votre transfert")}\`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] uppercase font-bold tracking-wider rounded hover:bg-green-500 hover:text-white transition-colors flex items-center gap-1">WhatsApp</a>
    )}
    <button
      onClick={(e) => {
        e.stopPropagation();
        showToast("Réponse enregistrée");
      }}`
);

// 4. Add "Visas" tab logic before "Services" logic
const visaTabLogic = `
        {activeTab === "visas" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display">Gestion des Types de Visas</h2>
              <button
                onClick={() => {
                  const newTypes = [
                    ...(config.visaTypes || []),
                    { id: \`visa-\${Date.now()}\`, name: "Nouveau Visa", price: "0$", duration: "0 jours" }
                  ];
                  updateConfig({ visaTypes: newTypes });
                  showToast("Type de visa ajouté");
                }}
                className="bg-gold px-4 py-2 text-[#0f172a] text-xs font-semibold uppercase tracking-wider rounded transition-colors hover:bg-[#d4b069]"
              >
                Ajouter un type
              </button>
            </div>
            
            <div className="bg-glass border border-gold-muted/20 rounded-lg overflow-hidden p-6 space-y-6">
              {(config.visaTypes || []).map((visa, i) => (
                <div key={visa.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-white/5 bg-navy/30 rounded relative">
                   <button onClick={() => {
                      const newTypes = config.visaTypes.filter(v => v.id !== visa.id);
                      updateConfig({ visaTypes: newTypes });
                      showToast("Type supprimé");
                   }} className="absolute top-2 right-2 text-red-500 hover:text-red-400"><Trash2 size={16}/></button>
                   <div>
                     <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-1">Nom</label>
                     <input type="text" value={visa.name} onChange={(e) => {
                        const newTypes = [...config.visaTypes];
                        newTypes[i] = {...newTypes[i], name: e.target.value};
                        updateConfig({ visaTypes: newTypes });
                     }} className="w-full bg-navy border border-text/20 p-2 text-xs rounded text-text" />
                   </div>
                   <div>
                     <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-1">Prix</label>
                     <input type="text" value={visa.price} onChange={(e) => {
                        const newTypes = [...config.visaTypes];
                        newTypes[i] = {...newTypes[i], price: e.target.value};
                        updateConfig({ visaTypes: newTypes });
                     }} className="w-full bg-navy border border-text/20 p-2 text-xs rounded text-text" />
                   </div>
                   <div>
                     <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-1">Durée (ex: 3-5 j)</label>
                     <input type="text" value={visa.duration} onChange={(e) => {
                        const newTypes = [...config.visaTypes];
                        newTypes[i] = {...newTypes[i], duration: e.target.value};
                        updateConfig({ visaTypes: newTypes });
                     }} className="w-full bg-navy border border-text/20 p-2 text-xs rounded text-text" />
                   </div>
                </div>
              ))}
              {(!config.visaTypes || config.visaTypes.length === 0) && (
                <p className="text-sm text-text/60">Aucun type de visa configuré.</p>
              )}
            </div>

            <div className="flex justify-between items-center mb-6 mt-12">
               <h2 className="text-2xl font-display">Demandes de Visas (Commandes)</h2>
            </div>
            <div className="bg-glass border border-gold-muted/20 rounded-lg overflow-hidden shadow-lg">
               <table className="w-full text-left border-collapse whitespace-nowrap">
                 <thead>
                   <tr className="bg-navy-800 border-b border-gold/30 text-[10px] uppercase text-gold font-bold">
                     <th className="p-4">ID</th><th className="p-4">Client</th><th className="p-4">Visa</th><th className="p-4">Statut</th>
                   </tr>
                 </thead>
                 <tbody className="text-sm font-light text-text/80">
                   {(config.orders || []).filter(o => o.item && o.item.toLowerCase().includes('visa')).map(order => (
                     <tr key={order.id} className="border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => { setActiveTab('orders'); setExpandedOrderId(order.id); }}>
                       <td className="p-4 text-gold">{order.id}</td>
                       <td className="p-4">{order.client}</td>
                       <td className="p-4">{order.item}</td>
                       <td className="p-4">{renderStatus(order.status, order.statusColor)}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          </motion.div>
        )}
`;

content = content.replace(
  /\{activeTab === "services" && \(/,
  visaTabLogic + '\n\n        {activeTab === "services" && ('
);

fs.writeFileSync(file, content);
console.log('patched admin visas functionality');

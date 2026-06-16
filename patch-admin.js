import fs from 'fs';
const file = './src/pages/Admin.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /\{ id: "visas", label: "Gestion Visas", icon: FileText \},/,
  `{ id: "visas", label: "Gestion Visas", icon: FileText },\n    { id: "flights", label: "Billets d'avion", icon: Plane },\n    { id: "hotels", label: "Réservation d'hôtel", icon: Building2 },`
);

let flightsTabLogic = `
        {activeTab === "flights" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display">Demandes de Billets d'avion</h2>
            </div>
            <div className="bg-glass border border-gold-muted/20 rounded-lg overflow-hidden shadow-lg">
               <table className="w-full text-left border-collapse whitespace-nowrap">
                 <thead>
                   <tr className="bg-navy-800 border-b border-gold/30 text-[10px] uppercase text-gold font-bold">
                     <th className="p-4">ID</th><th className="p-4">Client</th><th className="p-4">Billet</th><th className="p-4">Statut</th>
                   </tr>
                 </thead>
                 <tbody className="text-sm font-light text-text/80">
                   {(config.orders || []).filter(o => o.item && (o.item.toLowerCase().includes('billet') || o.item.toLowerCase().includes('vol'))).map(order => (
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

let hotelsTabLogic = `
        {activeTab === "hotels" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display">Demandes Réservation d'hôtel</h2>
            </div>
            <div className="bg-glass border border-gold-muted/20 rounded-lg overflow-hidden shadow-lg">
               <table className="w-full text-left border-collapse whitespace-nowrap">
                 <thead>
                   <tr className="bg-navy-800 border-b border-gold/30 text-[10px] uppercase text-gold font-bold">
                     <th className="p-4">ID</th><th className="p-4">Client</th><th className="p-4">Hôtel</th><th className="p-4">Statut</th>
                   </tr>
                 </thead>
                 <tbody className="text-sm font-light text-text/80">
                   {(config.orders || []).filter(o => o.item && o.item.toLowerCase().includes('hôtel')).map(order => (
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
  flightsTabLogic + '\n' + hotelsTabLogic + '\n' + '        {activeTab === "services" && ('
);

content = content.replace(
  /import \{\s*Car,\s*ShoppingBag,\s*RefreshCcw,\s*BarChart3,\s*Settings as SettingsIcon,/,
  `import {\n  Car,\n  ShoppingBag,\n  RefreshCcw,\n  BarChart3,\n  Settings as SettingsIcon,\n  Building2,`
);

fs.writeFileSync(file, content);
console.log('patched admin');

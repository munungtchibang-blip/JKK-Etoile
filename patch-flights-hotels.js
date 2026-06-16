import fs from 'fs';
const file = './src/pages/Admin.tsx';
let content = fs.readFileSync(file, 'utf8');

const getServiceEditBlock = (serviceId) => `
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

content = content.replace(
  /<div className="flex justify-between items-center mb-6">\s*<h2 className="text-2xl font-display">Demandes de Billets d'avion<\/h2>\s*<\/div>/,
  `<div className="flex justify-between items-center">
      <h2 className="text-2xl font-display">Gestion Billets d'avion</h2>
   </div>
   ` + getServiceEditBlock('1') + `
   <div className="flex justify-between items-center mb-6 mt-8">
      <h2 className="text-xl font-display">Demandes de Billets</h2>
   </div>`
);

content = content.replace(
  /<div className="flex justify-between items-center mb-6">\s*<h2 className="text-2xl font-display">Demandes Réservation d'hôtel<\/h2>\s*<\/div>/,
  `<div className="flex justify-between items-center">
      <h2 className="text-2xl font-display">Gestion Réservation d'hôtel</h2>
   </div>
   ` + getServiceEditBlock('6') + `
   <div className="flex justify-between items-center mb-6 mt-8">
      <h2 className="text-xl font-display">Demandes Réservation</h2>
   </div>`
);

fs.writeFileSync(file, content);
console.log('patched flight and hotel config sections');

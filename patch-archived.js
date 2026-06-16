import fs from 'fs';
const file = './src/pages/Admin.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('const [showArchived, setShowArchived] = useState(false);')) {
  // Find where orderSort is defined
  content = content.replace(
    /const \[expandedOrderId, setExpandedOrderId\] = useState<string \| null>\(null\);/,
    "const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);\n  const [showArchived, setShowArchived] = useState(false);\n  const finalStatuses = ['Validé', 'Approuvé', 'Livré', 'Terminé', 'Expédiée', 'Expédiées', 'Complété', 'Annulé'];\n  const isArchived = (s: string) => finalStatuses.includes(s);"
  );
}

content = content.replace(
  /const sortedOrders = \[\.\.\.orders\]\.sort/,
  "const finalStatusesList = ['Validé', 'Approuvé', 'Livré', 'Terminé', 'Expédiée', 'Expédiées', 'Complété', 'Annulé'];\n  const sortedOrders = [...orders].filter(o => showArchived || !finalStatusesList.includes(o.status)).sort"
);

const ordersHeader = `             <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-display">Gestion des Commandes</h2>
               <label className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wider text-text/80 bg-navy-800 p-2 rounded border border-gold-muted/20">
                 <input type="checkbox" checked={showArchived} onChange={() => setShowArchived(!showArchived)} className="accent-gold rounded" />
                 Afficher l'historique et les traitées
               </label>
             </div>`;

content = content.replace(
  /<div className="flex justify-between items-center mb-6">\s*<h2 className="text-2xl font-display">Gestion des Commandes<\/h2>\s*<\/div>/,
  ordersHeader
);

const toggleComponent = `               <label className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wider text-text/80 bg-navy-800 p-2 rounded border border-gold-muted/20">
                 <input type="checkbox" checked={showArchived} onChange={() => setShowArchived(!showArchived)} className="accent-gold rounded" />
                 Anciennes et traitées
               </label>`;

content = content.replace(
  /<div className="flex justify-between items-center mb-6">\s*<h2 className="text-2xl font-display">Transfert d'argent \(Gestion\)<\/h2>\s*<\/div>/,
  `<div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-display">Transfert d'argent (Gestion)</h2>
${toggleComponent}
             </div>`
);
content = content.replace(
  /\{(config\.transfers \|\| \[\])\.map/g,
  `{(config.transfers || []).filter(o => showArchived || !['Validé', 'Approuvé', 'Livré', 'Terminé', 'Expédiée', 'Expédiées', 'Complété', 'Annulé'].includes(o.status)).map`
);

content = content.replace(
  /<div className="flex justify-between items-center mb-6 mt-12">\s*<h2 className="text-2xl font-display">Demandes de Visas \(Commandes\)<\/h2>\s*<\/div>/,
  `<div className="flex justify-between items-center mb-6 mt-12">
               <h2 className="text-2xl font-display">Demandes de Visas (Commandes)</h2>
${toggleComponent}
            </div>`
);

content = content.replace(
  /<div className="flex justify-between items-center mb-6 mt-8">\s*<h2 className="text-xl font-display">Demandes de Billets<\/h2>\s*<\/div>/,
  `<div className="flex justify-between items-center mb-6 mt-8">
               <h2 className="text-xl font-display">Demandes de Billets</h2>
${toggleComponent}
            </div>`
);

content = content.replace(
  /<div className="flex justify-between items-center mb-6 mt-8">\s*<h2 className="text-xl font-display">Demandes Réservation<\/h2>\s*<\/div>/,
  `<div className="flex justify-between items-center mb-6 mt-8">
               <h2 className="text-xl font-display">Demandes Réservation</h2>
${toggleComponent}
            </div>`
);

content = content.replace(
  /<div className="flex justify-between items-center mb-6 mt-8">\s*<h2 className="text-xl font-display">Demandes Cargo<\/h2>\s*<\/div>/,
  `<div className="flex justify-between items-center mb-6 mt-8">
               <h2 className="text-xl font-display">Demandes Cargo</h2>
${toggleComponent}
            </div>`
);

content = content.replace(
  /o\.item && o\.item\.toLowerCase\(\)\.includes\('visa'\)/g,
  `o.item && o.item.toLowerCase().includes('visa') && (showArchived || !['Validé', 'Approuvé', 'Livré', 'Terminé', 'Expédiée', 'Expédiées', 'Complété', 'Annulé'].includes(o.status))`
);

content = content.replace(
  /o\.item && \(o\.item\.toLowerCase\(\)\.includes\('billet'\) \|\| o\.item\.toLowerCase\(\)\.includes\('vol'\)\)/g,
  `o.item && (o.item.toLowerCase().includes('billet') || o.item.toLowerCase().includes('vol')) && (showArchived || !['Validé', 'Approuvé', 'Livré', 'Terminé', 'Expédiée', 'Expédiées', 'Complété', 'Annulé'].includes(o.status))`
);

content = content.replace(
  /o\.item && o\.item\.toLowerCase\(\)\.includes\('hôtel'\)/g,
  `o.item && o.item.toLowerCase().includes('hôtel') && (showArchived || !['Validé', 'Approuvé', 'Livré', 'Terminé', 'Expédiée', 'Expédiées', 'Complété', 'Annulé'].includes(o.status))`
);

content = content.replace(
  /o\.item && o\.item\.toLowerCase\(\)\.includes\('cargo'\)/g,
  `o.item && o.item.toLowerCase().includes('cargo') && (showArchived || !['Validé', 'Approuvé', 'Livré', 'Terminé', 'Expédiée', 'Expédiées', 'Complété', 'Annulé'].includes(o.status))`
);

fs.writeFileSync(file, content);
console.log('patched archived queries');

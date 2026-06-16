const fs = require('fs');
let content = fs.readFileSync('./src/pages/Admin.tsx', 'utf8');

// remove all injected buttons:
content = content.replace(/<button onClick=\{\(\) => showToast\('Modifications enregistrées avec succès'\)\} className="px-4 py-2 bg-gold text-navy rounded font-medium hover:bg-yellow-500 transition-colors flex items-center gap-2 mb-6 ml-auto">\s*<Save size=\{16\} \/> Enregistrer\s*<\/button>/g, '');

// now add a nice single "Enregistrer" float button to settings and services tabs.
// Or actually, add it at the bottom of the 'settings' tab.
content = content.replace(/activeTab === "settings" && \([\s\S]*?(?={activeTab === "mobilemoney")/m, (match) => {
    return match.replace(/<\/motion\.div>\s*$/, `
      <div className="flex justify-end mt-4">
        <button onClick={() => showToast('Tous les paramètres ont été enregistrés')} className="px-6 py-2 bg-gold text-navy rounded-full font-bold uppercase tracking-widest hover:bg-yellow-500 transition-colors flex items-center gap-2 shadow-lg">
          <Save size={16} /> Enregistrer
        </button>
      </div>\n          </motion.div>\n`);
});

// also for the Services tab:
content = content.replace(/{activeTab === "services" && \([\s\S]*?(?={activeTab === "visas")/m, (match) => {
    return match.replace(/<\/motion\.div>\s*$/, `
      <div className="flex justify-end mt-4">
        <button onClick={() => showToast('Les modifications de services ont été enregistrées')} className="px-6 py-2 bg-gold text-navy rounded-full font-bold uppercase tracking-widest hover:bg-yellow-500 transition-colors flex items-center gap-2 shadow-lg">
          <Save size={16} /> Enregistrer
        </button>
      </div>\n          </motion.div>\n`);
});

fs.writeFileSync('./src/pages/Admin.tsx', content);

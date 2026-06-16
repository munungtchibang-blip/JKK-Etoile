const fs = require('fs');
let content = fs.readFileSync('./src/pages/Admin.tsx', 'utf8');

// I need to find the block for MobileMoneyOptions 
const tabRegex = /<h3 className=\"text-lg font-display text-gold\">\s*Configurer les méthodes et numéros\s*<\/h3>[\s\S]*?<div className=\"pt-4 border-t border-gold-muted\/20\">\s*<h4 className=\"text-sm text-text mb-4 uppercase tracking-widest\">Numéros d'agence<\/h4>/;

const newTabContent = `<h3 className="text-lg font-display text-gold">Configurer les méthodes et numéros</h3>
              
              <div>
                <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">
                  Méthodes Mobile Money
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {config.mobileMoneyOptions?.map(option => (
                    <div key={option} className="flex items-center gap-2 bg-navy border border-gold-muted/30 px-3 py-1 rounded-full">
                      <span className="text-sm font-medium">{option}</span>
                      <button 
                        onClick={() => {
                          if (window.confirm(\`Voulez-vous vraiment supprimer \${option} ?\`)) {
                            const newOptions = config.mobileMoneyOptions.filter(o => o !== option);
                            const newAccounts = { ...config.agencyAccounts };
                            delete newAccounts[option];
                            updateConfig({ mobileMoneyOptions: newOptions, agencyAccounts: newAccounts });
                            showToast(\`\${option} supprimé avec succès\`);
                          }
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="new-mm-method"
                    placeholder="Nouvelle méthode (ex: M-Pesa)"
                    className="flex-1 bg-navy border border-text/20 p-2 rounded text-sm text-text focus:outline-none focus:border-gold"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = e.currentTarget.value.trim();
                        if (val && !config.mobileMoneyOptions.includes(val)) {
                          updateConfig({ mobileMoneyOptions: [...(config.mobileMoneyOptions || []), val] });
                          e.currentTarget.value = '';
                          showToast('Méthode ajoutée');
                        }
                      }
                    }}
                  />
                  <button 
                    onClick={() => {
                      const input = document.getElementById('new-mm-method') as HTMLInputElement;
                      const val = input.value.trim();
                      if (val && !config.mobileMoneyOptions.includes(val)) {
                        updateConfig({ mobileMoneyOptions: [...(config.mobileMoneyOptions || []), val] });
                        input.value = '';
                        showToast('Méthode ajoutée');
                      }
                    }}
                    className="bg-gold text-navy px-4 rounded font-medium hover:bg-yellow-500 transition-colors flex items-center gap-2"
                  >
                    <Plus size={16} /> Ajouter
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-gold-muted/20">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm text-text uppercase tracking-widest">Numéros d'agence</h4>
                  <button onClick={() => showToast('Les numéros ont été enregistrés avec succès')} className="px-4 py-2 bg-glass border border-gold text-gold rounded hover:bg-gold hover:text-navy transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg">
                    <Save size={14} /> Enregistrer
                  </button>
                </div>`;

content = content.replace(tabRegex, newTabContent);
fs.writeFileSync('./src/pages/Admin.tsx', content);

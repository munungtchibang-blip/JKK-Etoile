const fs = require('fs');
let content = fs.readFileSync('./src/pages/Admin.tsx', 'utf8');

const parts = content.split('activeTab === "settings"');
if (parts.length > 1) {
  let settingsPart = parts[1];
  
  const paiementsStart = settingsPart.indexOf('Paiements et Transferts');
  const whatsAppStart = settingsPart.indexOf('Paramètres WhatsApp');
  
  console.log({paiementsStart, whatsAppStart});
  
  if (paiementsStart > -1 && whatsAppStart > -1) {
    const divStart = settingsPart.lastIndexOf('<div className="bg-glass', paiementsStart);
    settingsPart = settingsPart.substring(0, divStart) + '<div className="bg-glass border border-gold-muted/20 p-6 rounded-lg space-y-6">\n              <div className="pt-4 border-t border-gold-muted/20">\n                <h4 className="text-sm text-text mb-4 uppercase tracking-widest">' + settingsPart.substring(whatsAppStart);
  }
  
  content = parts[0] + 'activeTab === "settings"' + settingsPart;
  fs.writeFileSync('./src/pages/Admin.tsx', content);
}

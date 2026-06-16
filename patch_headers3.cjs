const fs = require('fs');

function replaceHeader(file, iconComponent, categoryText, titleText, descText) {
  let content = fs.readFileSync(file, 'utf8');

  // find the -mt-24 block
  const match = content.match(/<div className=\"flex flex-col items-center justify-center mb-12 text-center relative z-10 -mt-24\">\s*<span[^>]*>[\s\S]*?<\/div>/);
  if (match) {
    const newHeader = `<motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-8 bg-glass backdrop-blur-md rounded-2xl border border-white/10 shadow-xl mb-12 text-center relative z-10 -mt-24 max-w-3xl mx-auto"
      >
        <div className="inline-flex items-center justify-center p-4 bg-gold-muted/10 rounded-full mb-6">
          <${iconComponent} size={32} className="text-gold" />
        </div>
        <span className="text-[12px] uppercase tracking-[4px] text-gold mb-4 block">${categoryText}</span>
        <h1 className="text-3xl font-display text-gold mb-4">
          ${titleText}
        </h1>
        <p className="text-text/90 max-w-2xl mx-auto uppercase tracking-widest text-sm">
          ${descText}
        </p>
      </motion.div>`;
      
    content = content.replace(match[0], newHeader);
    
    // make sure motion and the icon are imported if they aren't
    if (!content.includes('import { motion }')) {
      content = content.replace('import React', 'import React\nimport { motion } from "motion/react";');
      if (!content.includes('import { motion }')) {
          content = 'import { motion } from "motion/react";\n' + content;
      }
    }
    fs.writeFileSync(file, content);
  } else {
    console.log("No match found for " + file);
  }
}

// Cars.tsx
// CargoService.tsx
// Flights.tsx
// Visas.tsx
// TravelInsurance.tsx
// HotelBooking.tsx
// MoneyTransfer.tsx

replaceHeader('./src/pages/CargoService.tsx', 'Package', 'Service cargo', 'Expédition et Logistique', '{serviceInfo?.content || serviceInfo?.description || "Fret aérien et maritime sécurisé de Dubaï vers la RDC"}');

replaceHeader('./src/pages/Flights.tsx', 'Plane', 'Billetterie', 'Réserver un billet', '{serviceInfo?.content || serviceInfo?.description || "Réservez vos vols au meilleur prix."}');

replaceHeader('./src/pages/Visas.tsx', 'CheckCircle', 'Services Immigrations', 'Obtenez votre Visa Dubai', '{serviceInfo?.content || serviceInfo?.description || "Rapide, fiable et sans complications. Choisissez votre visa et envoyez vos documents."}');

replaceHeader('./src/pages/TravelInsurance.tsx', 'ShieldCheck', 'Assurance Voyage', 'Souscrire une assurance', '{serviceInfo?.content || serviceInfo?.description || "Voyagez en toute sérénité avec nos couvertures complètes."}');

replaceHeader('./src/pages/HotelBooking.tsx', 'Building2', 'Réservation d\\'hôtel', 'Réserver un hôtel', '{serviceInfo?.content || serviceInfo?.description || "Trouvez les meilleurs hôtels pour votre séjour."}');

replaceHeader('./src/pages/MoneyTransfer.tsx', 'CreditCard', 'Transfert d\\'argent', 'Envoyer de l\\'argent', '{serviceInfo?.content || serviceInfo?.description || "Transferts rapides et sécurisés."}');

replaceHeader('./src/pages/Cars.tsx', 'Car', 'Motors', 'Importation de Véhicules', '{serviceInfo?.content || serviceInfo?.description || "Trouvez le véhicule idéal à Dubai. Nous gérons l\\'achat, le fret maritime jusqu\\'au port de Matadi, et le dédouanement jusqu\\'à Kinshasa."}');


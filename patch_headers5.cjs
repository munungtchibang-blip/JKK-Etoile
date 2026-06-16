const fs = require('fs');

function replaceMotionHeader(file, iconComponent, categoryText, titleText, descText) {
  let content = fs.readFileSync(file, 'utf8');

  // find the -mt-24 block which starts with <motion.div ... >
  // In Flights.tsx it's mb-10
  const match = content.match(/<motion\.div\s+initial=\{\{[^}]+\}\}\s+animate=\{\{[^}]+\}\}\s+transition=\{\{[^}]+\}\}\s+className=\"flex flex-col items-center justify-center mb-1[02] text-center relative z-10 -mt-24\"\s*>\s*<span[^>]*>[\s\S]*?<\/motion\.div>/);
  if (match) {
    const newHeader = `<motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-8 bg-glass backdrop-blur-md rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] mb-12 text-center relative z-10 -mt-24 max-w-3xl mx-auto border border-gold-muted/20"
      >
        <div className="inline-flex items-center justify-center p-4 bg-gold-muted/10 rounded-full mb-6">
          <${iconComponent} size={32} className="text-gold" />
        </div>
        <span className="text-[12px] uppercase tracking-[4px] text-gold mb-4 block">${categoryText}</span>
        <h1 className="text-3xl font-display text-gold mb-4 drop-shadow-md">
          ${titleText}
        </h1>
        <p className="text-text/90 max-w-2xl mx-auto uppercase tracking-widest text-sm drop-shadow">
          ${descText}
        </p>
      </motion.div>`;
      
    content = content.replace(match[0], newHeader);
    
    fs.writeFileSync(file, content);
    console.log("Updated " + file);
  } else {
    console.log("No match found for " + file);
  }
}

replaceMotionHeader('./src/pages/Flights.tsx', 'Plane', 'Billetterie', 'Réserver un billet', '{serviceInfo?.content || serviceInfo?.description || "Réservez vos vols au meilleur prix."}');

replaceMotionHeader('./src/pages/Cars.tsx', 'Car', 'Motors', 'Importation de Véhicules', '{serviceInfo?.content || serviceInfo?.description || "Trouvez le véhicule idéal à Dubai."}');


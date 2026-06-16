const fs = require('fs');

const pages = [
  { file: './src/pages/CargoService.tsx', title: 'Service cargo' },
  { file: './src/pages/Cars.tsx', title: 'Motors' },
  { file: './src/pages/Flights.tsx', title: 'Billetterie' },
  { file: './src/pages/HotelBooking.tsx', title: "Réservation d'hôtel" },
  { file: './src/pages/MobileMoneyService.tsx', title: 'Mobile Money' },
  { file: './src/pages/MoneyTransfer.tsx', title: "Transfert d'argent" },
  { file: './src/pages/TravelInsurance.tsx', title: 'Assurance Voyage' },
  { file: './src/pages/Visas.tsx', title: 'Services Immigrations' }
];

pages.forEach(({ file, title }) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    if (!content.includes('import { Reviews }')) {
      content = 'import { Reviews } from "../components/Reviews";\n' + content;
    }
    
    if (!content.includes('<Reviews')) {
      // Find the last </div> enclosing before component end!
      // A reliable way is to insert before the last `</div>\n</div>\n  );\n}` or similar sequence.
      content = content.replace(/(<\/[a-zA-Z.]+>\s*<\/[a-zA-Z.]+>\s*<\/[a-zA-Z.]+>\s*\);\s*\})/, `<Reviews serviceTitle="${title}" />\n$1`);
      
      if (!content.includes('<Reviews')) {
        content = content.replace(/<\/div>\s*<\/div>\s*\)\;\s*\}/, `<Reviews serviceTitle="${title}" />\n      </div>\n</div>\n  );}`);
      }
      if (!content.includes('<Reviews')) {
        content = content.replace(/<\/div>\s*\)\;\s*\}/, `<Reviews serviceTitle="${title}" />\n      </div>\n  );}`);
      }
      fs.writeFileSync(file, content);
      console.log('Injected ' + file);
    }
  }
});

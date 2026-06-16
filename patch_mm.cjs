const fs = require('fs');
let content = fs.readFileSync('./src/pages/MobileMoneyService.tsx', 'utf8');

const regex = /<motion\.div\s+initial=\{\{ opacity: 0, y: 20 \}\}\s+animate=\{\{ opacity: 1, y: 0 \}\}\s+className=\{`text-center mb-12 \$\{\!service\?\.imageUrl \? 'mt-12' : 'relative z-10 -mt-24'\}`\}\s*>/;

content = content.replace(
  regex,
  '<motion.div\n          initial={{ opacity: 0, y: 20 }}\n          animate={{ opacity: 1, y: 0 }}\n          className={`flex flex-col items-center justify-center p-8 bg-glass backdrop-blur-md rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] mb-12 border border-gold-muted/20 text-center ${!service?.imageUrl ? "mt-12" : "relative z-10 -mt-24"}`}\n        >'
);

fs.writeFileSync('./src/pages/MobileMoneyService.tsx', content);

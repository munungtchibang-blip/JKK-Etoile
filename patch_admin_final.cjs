const fs = require('fs');
let content = fs.readFileSync('./src/pages/Admin.tsx', 'utf8');

const regexToRemove = /<motion\.div\s+variants=\{\{\s*hidden: \{ opacity: 0, scale: 0\.98 \},\s*show: \{ opacity: 1, scale: 1 \},\s*\}\}\s*className=\"bg-glass border border-gold-muted\/20 p-6 rounded-lg space-y-6\"\s*>\s*<h3 className=\"text-lg font-display text-gold\">\s*Paiements et Transferts\s*<\/h3>[\s\S]*?<\/motion\.div>/;

content = content.replace(regexToRemove, '');
fs.writeFileSync('./src/pages/Admin.tsx', content);

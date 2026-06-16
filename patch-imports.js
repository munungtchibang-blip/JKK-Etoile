import fs from 'fs';
const file = './src/pages/Admin.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /FileText,/,
  `FileText,\n  Building2,`
);

content = content.replace(
  /import \{\n  Car,\n  ShoppingBag,\n  RefreshCcw,\n  BarChart3,\n  Settings as SettingsIcon,\n  Building2,/,
  `import {\n  Car,\n  ShoppingBag,\n  RefreshCcw,\n  BarChart3,\n  Settings as SettingsIcon,`
);

fs.writeFileSync(file, content);
console.log('patched imports');

const fs = require('fs');
const file = './src/pages/Shop.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace product.status with product.stockStatus
content = content.replace(/product\.status/g, 'product.stockStatus');

const statusBadge = `                {product.isNew && (
                  <span className="absolute top-2 left-2 z-10 bg-gold text-[#0f172a] text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm shadow-md">
                    Nouveau
                  </span>
                )}
                {product.stockStatus && (
                  <span className={\`absolute top-2 right-2 z-10 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm shadow-md \${product.stockStatus === 'Rupture' ? 'bg-red-500/90 text-white' : 'bg-green-500/90 text-white'}\`}>
                    {product.stockStatus}
                  </span>
                )}
`;

content = content.replace(
  /\{\s*product\.isNew && \(\s*<span className="absolute top-2 left-2 z-10.*?<\/span>\s*\)\s*\}/s,
  statusBadge
);

fs.writeFileSync(file, content);
console.log('Shop updated');

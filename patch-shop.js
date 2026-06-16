import fs from 'fs';
const file = './src/pages/Shop.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<button\s+onClick=\{\(e\) => \{\s+e\.preventDefault\(\);\s+addToCart\(product\.id\);\s+\}\}\s+className="border border-gold text-gold p-3 hover:bg-gold hover:text-\[\#0f172a\] transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy flex items-center gap-2"\s+aria-label=\{`Ajouter \$\{product\.name\} au panier`\}\s+>/g,
  `<button
  onClick={(e) => {
    e.preventDefault();
    if (product.status !== "Rupture" && product.available !== false) {
      addToCart(product.id);
    }
  }}
  disabled={product.status === "Rupture" || product.available === false}
  className={\`border p-3 transition-colors focus:outline-none flex items-center gap-2 \${product.status === "Rupture" || product.available === false ? "border-red-500/30 text-red-500/50 cursor-not-allowed" : product.status === "Arrivage" ? "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-[#0f172a]" : "border-gold text-gold hover:bg-gold hover:text-[#0f172a]"}\`}
  aria-label={\`Ajouter \${product.name} au panier\`}
>`
);

content = content.replace(
  /<span className="text-\[10px\] uppercase font-semibold hidden sm:inline">\s*\+ Panier\s*<\/span>\s*<Plus size=\{16\} \/>/g,
  `{product.status === "Rupture" || product.available === false ? (
    <span className="text-[10px] uppercase font-semibold hidden sm:inline">Rupture</span>
  ) : product.status === "Arrivage" ? (
    <span className="text-[10px] uppercase font-semibold hidden sm:inline">Préco</span>
  ) : (
    <span className="text-[10px] uppercase font-semibold hidden sm:inline">+ Panier</span>
  )}
  {product.status !== "Rupture" && product.available !== false && <Plus size={16} />}`
);

fs.writeFileSync(file, content);
console.log('patched shop');

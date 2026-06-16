import fs from 'fs';
const file = './src/pages/Admin.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<button\s+onClick=\{\(\) =>\s+toggleAvailability\(product\.id, "products"\)\s+\}\s+className=\{`(.*?)`\}\s*>\s*\{product\.available \? "Disponible" : "Rupture"\}\s*<\/button>/g,
  `<select
    className={\`px-3 py-1 rounded text-[10px] uppercase tracking-wider border outline-none cursor-pointer \${product.status === "Rupture" || (!product.status && product.available === false) ? "bg-red-500/10 text-red-500 border-red-500/20" : product.status === "Arrivage" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"}\`}
    value={product.status || (product.available === false ? "Rupture" : "En Stock")}
    onChange={(e) => {
        updateConfig({ products: (config.products || []).map(p => p.id === product.id ? {...p, status: e.target.value, available: e.target.value !== "Rupture"} : p) });
        showToast("Statut mis à jour");
    }}
>
    <option className="bg-navy text-text" value="En Stock">En Stock</option>
    <option className="bg-navy text-text" value="Rupture">Rupture</option>
    <option className="bg-navy text-text" value="Arrivage">Arrivage</option>
</select>`
);

fs.writeFileSync(file, content);
console.log('patched shop status');

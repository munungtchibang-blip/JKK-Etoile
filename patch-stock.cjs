const fs = require('fs');
const file = './src/pages/Admin.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('const [newProductStock, setNewProductStock]')) {
  // Let's find setNewProductDescription and add setNewProductStock
  content = content.replace(
    /const \[newProductDescription, setNewProductDescription\] = useState\(\"\"\);/,
    `const [newProductDescription, setNewProductDescription] = useState("");
  const [newProductStock, setNewProductStock] = useState("En stock");`
  );

  content = content.replace(
    /const newProduct = \{[\s\S]*?\};/,
    (match) => match.replace(/description: newProductDescription,/, "description: newProductDescription,\n      stockStatus: newProductStock,")
  );

  content = content.replace(
    /setNewProductImage\(\"\"\);\n\s*setNewProductDescription\(\"\"\);/,
    "setNewProductImage(\"\");\n      setNewProductDescription(\"\");\n      setNewProductStock(\"En stock\");"
  );
}

const selectStockStatus = `
              <div className="mt-4">
                <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">Disponibilité</label>
                <select
                  value={newProductStock}
                  onChange={(e) => setNewProductStock(e.target.value)}
                  className="w-full bg-navy border border-text/20 p-2 rounded text-sm text-text focus:outline-none focus:border-gold"
                >
                  <option value="En stock">En stock</option>
                  <option value="Rupture">Rupture</option>
                </select>
              </div>
`;

if (!content.includes('value={newProductStock}')) {
  content = content.replace(
    /onChange=\{\(e\) => setNewProductDescription\(e\.target\.value\)\}\n\s*className="w-full bg-navy.*?>\<\/textarea>\n\s*<\/div>/,
    (match) => match + selectStockStatus
  );
}

// And for existing products in the table edit view (expanded view)
const existingProductStockStatus = `
                                <div>
                                  <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">Disponibilité</label>
                                  <select
                                    value={product.stockStatus || 'En stock'}
                                    onChange={(e) => {
                                      const updated = (config.products || []).map(p => p.id === product.id ? {...p, stockStatus: e.target.value} : p);
                                      updateConfig({ products: updated });
                                    }}
                                    className="w-full bg-navy border border-gold-muted/20 p-2 text-xs rounded text-text focus:border-gold focus:outline-none"
                                  >
                                    <option value="En stock">En stock</option>
                                    <option value="Rupture">Rupture</option>
                                  </select>
                                </div>
`;

if (!content.includes('value={product.stockStatus ||')) {
  content = content.replace(
    /<div className="md:col-span-2">\n\s*<label.*?Image du Produit/,
    existingProductStockStatus + '\n                                <div className="md:col-span-2">\n                                  <label className="text-[10px] text-text/90 font-medium uppercase tracking-widest block mb-2">Image du Produit'
  );
}

fs.writeFileSync(file, content);
console.log('patched stockStatus logic for admin products');

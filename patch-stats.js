import fs from 'fs';

const file = './src/pages/Admin.tsx';
let content = fs.readFileSync(file, 'utf8');

const statsFuncCode = `  const calculateTotalRevenue = () => {
    let total = 0;
    const allTransfers = config.transfers || [];
    allTransfers.forEach(t => {
      if (t.amount) {
        const match = String(t.amount).match(/([\\d\\s.,]+)/);
        if (match) {
          total += parseFloat(match[1].replace(/[\\s,]/g, ''));
        }
      }
    });

    const allOrders = config.orders || [];
    allOrders.forEach(o => {
      const itemText = o.item ? String(o.item).toLowerCase() : "";
      
      const product = config.products?.find(p => itemText.includes(p.name.toLowerCase()));
      if (product && product.price) {
        const match = String(product.price).match(/([\\d\\s.,]+)/);
        if (match) {
           const qtyMatch = itemText.match(/(\\d+)x/);
           const qty = qtyMatch ? parseFloat(qtyMatch[1]) : 1;
           total += parseFloat(match[1].replace(/[\\s,]/g, '')) * qty;
        }
      }
      
      const car = config.cars?.find(c => itemText.includes(\`\${c.brand.toLowerCase()} \${c.model.toLowerCase()}\`));
      if (car && car.price) {
        const match = String(car.price).match(/([\\d\\s.,]+)/);
        if (match) total += parseFloat(match[1].replace(/[\\s,]/g, ''));
      }
      
      const service = config.services?.find(s => itemText.includes(s.name.toLowerCase()));
      if (service && service.price) {
        const match = String(service.price).match(/([\\d\\s.,]+)/);
        if (match) total += parseFloat(match[1].replace(/[\\s,]/g, ''));
      }
    });
    
    return "$" + total.toLocaleString('en-US');
  };

  const getUniqueClientsCount = () => {
    const clients = new Set([
      ...(config.orders || []).map(o => o.client?.trim().toLowerCase()),
      ...(config.transfers || []).map(t => t.client?.trim().toLowerCase())
    ]);
    clients.delete("");
    clients.delete(undefined as any);
    return clients.size.toString();
  };

`;

if (!content.includes('calculateTotalRevenue = ()')) {
    content = content.replace('const sortedOrders = [...orders]', statsFuncCode + '  const sortedOrders = [...orders]');
}

content = content.replace(
    /value: "\$45,230",/g,
    'value: calculateTotalRevenue(),'
);

content = content.replace(
    /value: "128",/g,
    'value: getUniqueClientsCount(),'
);

content = content.replace(
    /onClick=\{\(e\) => \{\s*e.stopPropagation\(\);\s*if \(window.confirm\("Voulez-vous vraiment supprimer cette commande \?"\)\) \{\s*setOrders\(orders.filter\(o => o.id !== order.id\)\);\s*showToast\("Commande supprimée avec succès"\);\s*\}\s*\}\}/g,
    `onClick={(e) => {
      e.stopPropagation();
      if (window.confirm("Voulez-vous vraiment supprimer cette commande ?")) {
        const orderIdToDelete = order.id;
        const newOrders = [...(config.orders || [])].filter(o => o.id !== orderIdToDelete);
        updateConfig({ orders: newOrders });
        showToast("Commande supprimée avec succès");
      }
    }}`
);

fs.writeFileSync(file, content);
console.log('Patched stats and buttons.');

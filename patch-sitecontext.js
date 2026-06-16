import fs from 'fs';
const file = './src/components/SiteContext.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    'products: defaultConfig.products,',
    'products: parsed.products && parsed.products.length > 0 ? parsed.products : defaultConfig.products,'
);

content = content.replace(
    'cars: defaultConfig.cars,',
    'cars: parsed.cars && parsed.cars.length > 0 ? parsed.cars : defaultConfig.cars,'
);

fs.writeFileSync(file, content);
console.log('Patched SiteContext');

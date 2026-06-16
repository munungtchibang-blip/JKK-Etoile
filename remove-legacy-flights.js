import fs from 'fs';
const file = './src/pages/Admin.tsx';
let content = fs.readFileSync(file, 'utf8');

// Find the first {activeTab === "flights" && ... } block that ends at 1386 and remove it
const match = content.match(/\{activeTab === "flights" && \([\s\S]*?\n        \}\)/);
if (match) {
  content = content.replace(match[0], '');
}

fs.writeFileSync(file, content);
console.log('removed legacy flights tab');

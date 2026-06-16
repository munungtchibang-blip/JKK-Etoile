const fs = require('fs');
const file = 'src/pages/Admin.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/text-text\/50/g, 'text-text/70');
fs.writeFileSync(file, content);
console.log('done');

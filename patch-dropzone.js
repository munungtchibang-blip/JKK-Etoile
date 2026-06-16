import fs from 'fs';
const file = './src/pages/Admin.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /setImages\(images\.filter\(\(\_, i\) => i !== idx\)\);/,
  `setImages(images.filter((_, i) => i !== idx).join(','));`
);

fs.writeFileSync(file, content);
console.log('patched dropzone');

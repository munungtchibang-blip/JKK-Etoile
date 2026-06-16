const fs = require('fs');

function patchFile(file, imgUrlGetter, altText) {
  let content = fs.readFileSync(file, 'utf8');

  // Remove the old inline image block
  const oldImageBlockRegex = /<div className="w-full.*?aspect-\[21\/9\].*?<LazyImage.*?<\/div>/s;
  content = content.replace(oldImageBlockRegex, '');

  // Regex to match the outer `<div className="mx-auto...">` OR `<motion.div className="mx-auto...">`
  content = content.replace(
    /(return \(\s*)<(?:div|motion\.div)\s+[^>]*?className="mx-auto max-w-[a-zA-Z0-9-]+ px-4 pt-\[280px\][^>]*>/,
    `$1<div className="pt-24 min-h-screen bg-navy pb-20">\n      {${imgUrlGetter} && (\n        <div className="w-full h-64 md:h-80 relative mb-12">\n          <LazyImage\n            src={${imgUrlGetter}}\n            alt="${altText}"\n            className="w-full h-full object-cover"\n            priority\n          />\n          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent"></div>\n          <div className="absolute inset-0 bg-navy/30"></div>\n        </div>\n      )}\n      <div className="max-w-4xl mx-auto px-4">\n        <motion.div\n          initial={{ opacity: 0, y: 20 }}\n          animate={{ opacity: 1, y: 0 }}\n          className={\`flex flex-col items-center justify-center mb-10 text-center \${!${imgUrlGetter} ? 'mt-12' : 'relative z-10 -mt-24'}\`}\n        >`
  );

  // remove the original motion.div wrapper
  content = content.replace(
    /<\/?motion\.div[^>]*?>/g,
    (match) => {
        // Only remove the one with `flex flex-col items-center`
        if (match.includes('flex flex-col items-center')) return '';
        // If it's a closing tag and we replaced the opening tag, wait.
        return match;
    }
  );

  content = content.replace(
    /(\n\s*)<\/(?:div|motion\.div)>\n\s*\);\n\}\s*$/,
    '$1  </div>\n$1</div>\n  );\n}'
  );

  fs.writeFileSync(file, content);
}

patchFile('./src/pages/Flights.tsx', 'serviceInfo?.imageUrl', 'Vols');
patchFile('./src/pages/CargoService.tsx', 'serviceInfo?.imageUrl', 'Cargo');
console.log('done');

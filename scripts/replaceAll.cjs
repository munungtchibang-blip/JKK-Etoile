const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx')) { 
            results.push(file);
        }
    });
    return results;
}

const files = walk('src');
for (const f of files) {
    let content = fs.readFileSync(f, 'utf8');
    if (content.includes('text-text/50')) {
        content = content.replace(/text-text\/50/g, 'text-text/70');
        fs.writeFileSync(f, content);
        console.log('updated ' + f);
    }
}

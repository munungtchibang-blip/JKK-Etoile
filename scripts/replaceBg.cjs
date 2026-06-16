const fs = require('fs');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) { 
            results.push(file);
        }
    });
    return results;
}

const files = walk('src');
for (const f of files) {
    let content = fs.readFileSync(f, 'utf8');
    if (content.includes('#0f172a')) {
        content = content.replace(/#0f172a/g, '#1e293b');
        fs.writeFileSync(f, content);
        console.log('updated ' + f);
    }
}

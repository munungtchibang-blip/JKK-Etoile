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
    let changed = false;
    
    // Increase text-text/70 opacity and weight
    if (content.includes('text-text/70')) {
        content = content.replace(/text-text\/70/g, 'text-text/90 font-medium');
        content = content.replace(/font-light(.*?)text-text\/90 font-medium/g, '$1text-text/90 font-medium');
        content = content.replace(/text-text\/90 font-medium(.*?)font-light/g, 'text-text/90 font-medium$1');
        changed = true;
    }
    
    // Decrease opacity of bg-[#0a1128]
    if (content.includes('bg-[#0a1128]/95')) {
        content = content.replace(/bg-\[#0a1128\]\/95/g, 'bg-[#0a1128]/85');
        changed = true;
    }
    if (content.includes('bg-[#0a1128]/90')) {
        content = content.replace(/bg-\[#0a1128\]\/90/g, 'bg-[#0a1128]/80');
        changed = true;
    }
    if (content.includes('bg-[#0a1128]/80')) {
        content = content.replace(/bg-\[#0a1128\]\/80/g, 'bg-[#0a1128]/70');
        changed = true;
    }
    
    // Also improve the color slightly (darker slate instead of pure navy)
    // #0a1128 -> #0f172a (which is slate-900)
    if (content.includes('#0a1128')) {
        content = content.replace(/#0a1128/g, '#0f172a');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(f, content);
        console.log('updated ' + f);
    }
}

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
    
    // Decrease the darkness of the background even more for better visibility.
    if (content.includes('bg-[#1e293b]')) {
        content = content.replace(/bg-\[#1e293b\]/g, 'bg-[#334155]');
        changed = true;
    }
    
    // For text overlays on gold, make it clearly dark
    if (content.includes('text-[#1e293b]')) {
        content = content.replace(/text-\[#1e293b\]/g, 'text-[#0f172a]');
        changed = true;
    }

    if (f.endsWith('index.css')) {
        let newContent = content;
        newContent = newContent.replace('--theme-bg: #1e293b;', '--theme-bg: #334155;');
        newContent = newContent.replace('--theme-bg-alt: #334155;', '--theme-bg-alt: #475569;');
        newContent = newContent.replace('--theme-glass: rgba(30, 41, 59, 0.85);', '--theme-glass: rgba(51, 65, 85, 0.85);');
        
        // update the literal CSS classes escaping
        newContent = newContent.replace(/\.bg-\\\\[#1e293b\\\\]\\\/80,/g, '.bg-\\[#334155\\]\\/80,');
        newContent = newContent.replace(/\.bg-\\\\[#1e293b\\\\]\\\/70,/g, '.bg-\\[#334155\\]\\/70,');
        newContent = newContent.replace(/\.bg-\\\\[#1e293b\\\\]\\\/85 \{/g, '.bg-\\[#334155\\]\\/85 {');
        
        if (newContent !== content) {
            content = newContent;
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(f, content);
        console.log('updated ' + f);
    }
}

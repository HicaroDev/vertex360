
const fs = require('fs');
const path = require('path');

const baseDir = 'c:/n/PRODUTOS RV/METÓDO VERTEX 360/Clientes/Ferreira Logística e Distribuidora';

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) {
        console.log(`❌ Directory not found: ${dir}`);
        return [];
    }
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else {
            results.push(fullPath);
        }
    });
    return results;
}

try {
    const all = walk(baseDir);
    console.log(`Total files found: ${all.length}`);
    const html = all.filter(f => f.endsWith('.html'));
    console.log(`HTML files: ${html.length}`);
    const png = all.filter(f => f.endsWith('.png'));
    console.log(`PNG files: ${png.length}`);

    console.log('\nSample files:');
    all.slice(0, 10).forEach(f => console.log(` - ${f}`));
} catch (e) {
    console.error(`Error walking directory: ${e.message}`);
}

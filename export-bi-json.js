
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = 'c:/n/MODELO BD BI.xlsx';
const workbook = XLSX.readFile(filePath);
const bdSheet = workbook.Sheets['BD'];
const data = XLSX.utils.sheet_to_json(bdSheet);

// Clean up keys (remove leading/trailing spaces)
const cleanData = data.map(item => {
    const newItem = {};
    for (const key in item) {
        newItem[key.trim()] = item[key];
    }
    return newItem;
});

const outputDir = path.join(__dirname, 'src', 'data');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, 'bi-data.json'), JSON.stringify(cleanData, null, 2));
console.log('✅ Dados salvos em src/data/bi-data.json');


const XLSX = require('xlsx');
const fs = require('fs');

const filePath = 'c:/n/MODELO BD BI.xlsx';

if (!fs.existsSync(filePath)) {
    console.error('Arquivo não encontrado:', filePath);
    process.exit(1);
}

const workbook = XLSX.readFile(filePath);
const sheetNames = workbook.SheetNames;

console.log('Sheet Names:', JSON.stringify(sheetNames, null, 2));

const data = {};
sheetNames.forEach(name => {
    const sheet = workbook.Sheets[name];
    data[name] = XLSX.utils.sheet_to_json(sheet);
});

console.log('--- DATA PREVIEW ---');
sheetNames.forEach(name => {
    console.log(`\nSheet: ${name}`);
    console.log(JSON.stringify(data[name].slice(0, 3), null, 2));
});

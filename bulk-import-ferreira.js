
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const clientId = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            if (file.endsWith('.html') && !fullPath.includes('ANTIGO')) {
                arrayOfFiles.push(fullPath);
            }
        }
    });

    return arrayOfFiles;
}

async function bulkImport() {
    console.log('--- Iniciando importação em massa ---');
    const baseDir = 'c:/n/PRODUTOS RV';
    const files = await getAllFiles(baseDir);

    console.log(`Encontrados ${files.length} arquivos para importar.`);

    for (const filePath of files) {
        const html = fs.readFileSync(filePath, 'utf8');

        // Extrair título
        const titleMatch = html.match(/<title>([^<]+)<\/title>/);
        let title = titleMatch ? titleMatch[1] : path.basename(filePath).split(' ')[0];

        // Se o título tiver o hash do Notion, limpa
        title = title.replace(/\s[a-f0-9]{32}/i, '').trim();

        // Determinar categoria baseado no caminho ou conteúdo
        let category = 'Dados Empresa';
        if (filePath.toLowerCase().includes('apresentação')) category = 'Apresentação e Estruturação';
        if (filePath.toLowerCase().includes('diagnóstico')) category = 'Diagnóstico';
        if (filePath.toLowerCase().includes('desenvolvimento')) category = 'Desenvolvimento';
        if (filePath.toLowerCase().includes('reunião')) category = 'Reuniões';
        if (filePath.toLowerCase().includes('financeira') || filePath.toLowerCase().includes('finanças')) category = 'Desenvolvimento';
        if (filePath.toLowerCase().includes('comercial')) category = 'Desenvolvimento';

        // Extrair corpo
        const bodyMatch = html.match(/<body>([\s\S]+)<\/body>/);
        let contentHtml = bodyMatch ? bodyMatch[1] : html;
        contentHtml = contentHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        contentHtml = contentHtml.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

        console.log(`Importando: ${title} -> ${category}`);

        const { error } = await supabase.from('documents').insert({
            client_id: clientId,
            category: category,
            title: title,
            content: contentHtml,
            status: 'published',
            last_edit: '17/02/2026',
            created_by: 'admin'
        });

        if (error) console.error(`❌ Erro em ${title}:`, error.message);
    }

    console.log('--- Importação concluída ---');
}

bulkImport();

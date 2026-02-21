
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const clientId = '9e4e1fec-2e0a-428d-843b-63bb398e5c09'; // Ferreira Distribuidora
const baseDir = 'c:/n/PRODUTOS RV';

async function restoreEverything() {
    console.log('🚀 INICIANDO RESTAURAÇÃO TOTAL DE DOCUMENTOS...');

    function walk(dir) {
        let results = [];
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat && stat.isDirectory()) {
                results = results.concat(walk(fullPath));
            } else if (file.endsWith('.html')) {
                results.push(fullPath);
            }
        });
        return results;
    }

    const files = walk(baseDir);
    console.log(`Found ${files.length} HTML files to import.`);

    for (const file of files) {
        try {
            const content = fs.readFileSync(file, 'utf8');
            const titleMatch = content.match(/<title>([^<]+)<\/title>/);
            let title = titleMatch ? titleMatch[1] : path.basename(file, '.html');
            title = title.replace(/\s[a-f0-9]{32}/i, '').trim();

            const relativePath = path.relative(baseDir, file);
            let category = 'Dados Empresa';
            if (relativePath.toLowerCase().includes('reuniōes') || relativePath.toLowerCase().includes('reunioes')) category = 'Reunioes';
            if (relativePath.toLowerCase().includes('diagnóstico')) category = 'Diagnostico';
            if (relativePath.toLowerCase().includes('apresentação')) category = 'Apresentação e Estruturação';
            if (relativePath.toLowerCase().includes('desenvolvimento')) category = 'Desenvolvimento';

            console.log(`➡️  Importing: ${title} [${category}]`);

            // Inserir na tabela 'documentos' (Português)
            const { error } = await supabase.from('documentos').upsert({
                id_do_cliente: clientId,
                titulo: title,
                categoria: category,
                contente: content,
                status: 'published',
                last_edit: '17/02/2026'
            }, { onConflict: 'titulo,id_do_cliente' });

            if (error) console.error(`❌ Erro no Supabase: ${error.message}`);
        } catch (e) {
            console.error(`❌ Erro ao ler arquivo ${file}: ${e.message}`);
        }
    }
    console.log('✅ RESTAURAÇÃO FINALIZADA!');
}

restoreEverything();

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const CLIENT_ID = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';
const BASE_DIR = 'c:/n/PRODUTOS RV/METÓDO VERTEX 360/Clientes/Ferreira Logística e Distribuidora';

// Função para percorrer diretórios recursivamente
function walkDirectory(dir) {
    let results = [];

    if (!fs.existsSync(dir)) {
        console.error(`❌ Diretório não encontrado: ${dir}`);
        return [];
    }

    const list = fs.readdirSync(dir);

    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat && stat.isDirectory()) {
            results = results.concat(walkDirectory(fullPath));
        } else if (file.endsWith('.html')) {
            results.push(fullPath);
        }
    });

    return results;
}

// Função para determinar categoria baseado no caminho
function determineCategory(filePath) {
    const lower = filePath.toLowerCase();

    if (lower.includes('reuniões') || lower.includes('reunioes')) {
        return 'Reuniões';
    }
    if (lower.includes('diagnóstico') || lower.includes('diagnostico')) {
        return 'Diagnóstico';
    }
    if (lower.includes('apresentação') || lower.includes('apresentacao')) {
        return 'Apresentação';
    }
    if (lower.includes('desenvolvimento')) {
        return 'Desenvolvimento';
    }

    return 'Dados Empresa';
}

// Função para extrair título do HTML
function extractTitle(html) {
    const match = html.match(/<title>([^<]+)<\/title>/i);
    if (match) {
        // Remover hash do Notion (exemplo: "Título 1a2b3c4d5e6f...")
        return match[1].replace(/\s[a-f0-9]{32}/i, '').trim();
    }
    return 'Documento sem título';
}

// Função principal de importação
async function importDocuments() {
    console.log('═══════════════════════════════════════════════');
    console.log('   IMPORTAÇÃO EM MASSA - FERREIRA DISTRIBUIDORA');
    console.log('═══════════════════════════════════════════════\n');

    const files = walkDirectory(BASE_DIR);
    console.log(`📁 Encontrados ${files.length} arquivos HTML\n`);

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (const filePath of files) {
        try {
            const html = fs.readFileSync(filePath, 'utf8');
            const title = extractTitle(html);
            const category = determineCategory(filePath);

            // Verificar se já existe (evitar duplicados)
            const { data: existing } = await supabase
                .from('documents')
                .select('id')
                .eq('client_id', CLIENT_ID)
                .eq('title', title)
                .maybeSingle();

            if (existing) {
                console.log(`⏭️  Pulando (já existe): ${title}`);
                skipped++;
                continue;
            }

            // Inserir documento
            const { error } = await supabase
                .from('documents')
                .insert({
                    client_id: CLIENT_ID,
                    title: title,
                    category: category,
                    content: html,
                    status: 'published',
                    last_edit: '17/02/2026'
                });

            if (error) {
                console.error(`❌ Erro ao importar "${title}": ${error.message}`);
                errors++;
            } else {
                console.log(`✅ Importado: ${title} [${category}]`);
                imported++;
            }

        } catch (err) {
            console.error(`❌ Erro ao processar ${filePath}: ${err.message}`);
            errors++;
        }
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log('              RESUMO DA IMPORTAÇÃO');
    console.log('═══════════════════════════════════════════════');
    console.log(`✅ Importados: ${imported}`);
    console.log(`⏭️  Pulados: ${skipped}`);
    console.log(`❌ Erros: ${errors}`);
    console.log(`📊 Total processado: ${files.length}`);
    console.log('═══════════════════════════════════════════════\n');

    // Verificar total final no banco
    const { count } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', CLIENT_ID);

    console.log(`✅ Total de documentos no banco agora: ${count}\n`);
}

importDocuments().catch(err => {
    console.error('💥 ERRO FATAL:', err);
    process.exit(1);
});

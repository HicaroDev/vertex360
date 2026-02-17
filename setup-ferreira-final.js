
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const clientId = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';

async function setupFerreiraWorkspaces() {
    console.log('--- Organizando Workspaces Ferreira ---');

    // Limpar workspaces antigos do cliente para não dar confusão
    await supabase.from('workspaces').delete().eq('client_id', clientId);
    await supabase.from('documents').delete().eq('client_id', clientId);

    const workspaces = [
        { name: 'Dados Empresa', color: 'text-blue-500' },
        { name: 'Reuniões - Ferreira Distribuidora', color: 'text-emerald-500' },
        { name: 'Diagnóstico - Ferreira Distribuidora', color: 'text-brand-gold' },
        { name: 'Apresentação e Estruturação - Ferreira Distribuidora', color: 'text-purple-500' },
        { name: 'Desenvolvimento - Ferreira Distribuidora', color: 'text-rose-500' }
    ];

    for (const ws of workspaces) {
        await supabase.from('workspaces').insert({
            client_id: clientId,
            folder_name: ws.name,
            color: ws.color,
            order_index: workspaces.indexOf(ws)
        });
        console.log(`Workspace criado: ${ws.name}`);
    }

    // Importar arquivos principais
    const baseDir = 'c:/n/PRODUTOS RV/METÓDO VERTEX 360/Clientes/Ferreira Logística e Distribuidora';

    const mainFiles = [
        { file: 'Dados Empresa 22b2880b31de8014a3dbe18ba628a459.html', ws: 'Dados Empresa' },
        { file: 'Reuniões - Ferreira Distribuidora 1d82880b31de802db285c921a2472dfb.html', ws: 'Reuniões - Ferreira Distribuidora' },
        { file: 'Diagnóstico - Ferreira Distribuidora 21d2880b31de807e9e91cacdec20f94b.html', ws: 'Diagnóstico - Ferreira Distribuidora' },
        { file: 'Apresentação e Estruturação - Ferreira Distribuido 22f2880b31de804ea9b4c80e10535d84.html', ws: 'Apresentação e Estruturação - Ferreira Distribuidora' },
        { file: 'Desenvolvimento - Ferreira Distribuidora 21d2880b31de8067ab6ff4fd48824451.html', ws: 'Desenvolvimento - Ferreira Distribuidora' }
    ];

    for (const item of mainFiles) {
        const filePath = path.join(baseDir, item.file);
        if (fs.existsSync(filePath)) {
            await importFile(filePath, item.ws);

            // Se houver uma pasta com o mesmo nome (sem o hash), importar tudo dentro
            const folderName = item.file.replace(/\s[a-f0-9]{32}/i, '');
            const subDirPath = path.join(baseDir, folderName);
            if (fs.existsSync(subDirPath)) {
                await importDirectory(subDirPath, item.ws);
            }
        }
    }

    console.log('--- Importação Ferreira Concluída ---');
}

async function importDirectory(dirPath, workspace) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            await importDirectory(fullPath, workspace);
        } else if (file.endsWith('.html')) {
            await importFile(fullPath, workspace);
        }
    }
}

async function importFile(filePath, workspace) {
    const html = fs.readFileSync(filePath, 'utf8');

    // Título
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    let title = titleMatch ? titleMatch[1] : path.basename(filePath);
    title = title.replace(/\s[a-f0-9]{32}/i, '').trim();

    // Corpo
    const bodyMatch = html.match(/<body>([\s\S]+)<\/body>/);
    let contentHtml = bodyMatch ? bodyMatch[1] : html;

    // Limpeza de scripts e estilos
    contentHtml = contentHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    contentHtml = contentHtml.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

    // Simplificação de links para o nosso editor
    // (Por enquanto apenas mantemos o HTML, o Tiptap vai tentar renderizar)

    console.log(`Importando: ${title} para ${workspace}`);

    const { error } = await supabase.from('documents').insert({
        client_id: clientId,
        category: workspace,
        title: title,
        content: contentHtml,
        status: 'published',
        last_edit: '17/02/2026',
        created_by: 'admin'
    });

    if (error) console.error(`❌ Erro importar ${title}:`, error.message);
}

setupFerreiraWorkspaces();

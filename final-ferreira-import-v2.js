
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const clientId = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';
const baseDir = 'c:/n/PRODUTOS RV/METÓDO VERTEX 360/Clientes/Ferreira Logística e Distribuidora';

async function setupFerreira() {
    console.log('--- Iniciando Setup Ferreira Distribuidora ---');

    // 1. Limpar anterior
    await supabase.from('documents').delete().eq('client_id', clientId);
    await supabase.from('workspaces').delete().eq('client_id', clientId);

    // 2. Criar os 5 workspaces oficiais
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
    }

    // 3. Descobrir todos os arquivos
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

    const allFiles = walk(baseDir);
    console.log(`Encontrados ${allFiles.length} arquivos.`);

    for (const filePath of allFiles) {
        const relativePath = path.relative(baseDir, filePath);

        // Pular o arquivo index do cliente se for redundante (opcional)
        if (filePath.toLowerCase().includes('ferreira logística e distribuidora 1d22880b')) {
            console.log('Pulando index principal...');
            continue;
        }

        // Determinar workspace
        let workspace = 'Dados Empresa';
        if (relativePath.includes('Reuniões')) workspace = 'Reuniões - Ferreira Distribuidora';
        if (relativePath.includes('Diagnóstico')) workspace = 'Diagnóstico - Ferreira Distribuidora';
        if (relativePath.includes('Apresentação')) workspace = 'Apresentação e Estruturação - Ferreira Distribuidora';
        if (relativePath.includes('Desenvolvimento')) workspace = 'Desenvolvimento - Ferreira Distribuidora';

        await importFile(filePath, workspace);
    }

    console.log('--- Setup Finalizado ---');
}

async function importFile(filePath, workspaceName) {
    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Título
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    let title = titleMatch ? titleMatch[1] : path.basename(filePath);
    title = title.replace(/\s[a-f0-9]{32}/i, '').trim();

    // 2. Extrair Body
    const bodyMatch = html.match(/<body>([\s\S]+)<\/body>/);
    let contentHtml = bodyMatch ? bodyMatch[1] : html;

    // 2.1 Limpar scripts e estilos
    contentHtml = contentHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    contentHtml = contentHtml.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

    // 3. Converter imagens em Base64 para garantir que apareçam
    const imgRegex = /<img\s+[^>]*src="([^"]+)"[^>]*>/gi;
    let match;
    const imagesToReplace = [];
    while ((match = imgRegex.exec(contentHtml)) !== null) {
        const src = match[1];
        if (!src.startsWith('data:') && !src.startsWith('http')) {
            imagesToReplace.push(src);
        }
    }

    for (const src of imagesToReplace) {
        try {
            // Decodificar URL (espaços %20 etc)
            const decodedSrc = decodeURIComponent(src);
            const imgPath = path.join(path.dirname(filePath), decodedSrc);
            if (fs.existsSync(imgPath)) {
                const imgData = fs.readFileSync(imgPath);
                const ext = path.extname(imgPath).slice(1) || 'png';
                const base64 = `data:image/${ext};base64,${imgData.toString('base64')}`;
                // Usar replaceAll ou regex global para trocar todas as ocorrências
                contentHtml = contentHtml.split(src).join(base64);
            }
        } catch (e) {
            console.error(`Erro ao converter imagem ${src}:`, e.message);
        }
    }

    console.log(`Importando: ${title} para ${workspaceName}`);

    const { error } = await supabase.from('documents').insert({
        client_id: clientId,
        category: workspaceName,
        title: title,
        content: contentHtml,
        status: 'published',
        last_edit: '17/02/2026',
        created_by: 'admin'
    });

    if (error) console.error(`❌ Erro em ${title}:`, error.message);
}

setupFerreira();

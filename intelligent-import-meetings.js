
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const clientId = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';
const workspaceName = 'Reuniões - Ferreira Distribuidora';
const filePath = 'c:\\n\\PRODUTOS RV\\METÓDO VERTEX 360\\Clientes\\Ferreira Logística e Distribuidora\\Reuniões - Ferreira Distribuidora 1d82880b31de802db285c921a2472dfb.html';
const baseDir = path.dirname(filePath);

async function run() {
    console.log('--- Iniciando Importação Inteligente de Reuniões (V3 - Agrupada por Data) ---');

    if (!fs.existsSync(filePath)) {
        console.error('Arquivo não encontrado:', filePath);
        return;
    }

    let html = fs.readFileSync(filePath, 'utf8');

    // Pegar o conteúdo dentro da div class="page-body"
    const bodyMatch = html.match(/<div class="page-body">([\s\S]*)<\/div>\s*<\/article>/i);
    if (!bodyMatch) {
        console.error('Não foi possível encontrar o corpo da página.');
        return;
    }
    let bodyHtml = bodyMatch[1];

    // Identificar os separadores de data. 
    // O padrão é uma <ul> de classe toggle com um summary que começa com uma data.
    // Ex: <ul id="..." class="toggle"><li><details open=""><summary>17/04/2025 ...

    // Vamos usar um split baseado no início de um bloco de data
    const datePattern = /<ul[^>]*class="toggle"[^>]*>\s*<li[^>]*>\s*<details[^>]*>\s*<summary[^>]*>\s*(?:\s*<strong>)?(\d{2}\/\d{2}\/\d{4}[^<]*)/gi;

    let segments = [];
    let lastIndex = 0;
    let match;

    while ((match = datePattern.exec(bodyHtml)) !== null) {
        if (segments.length > 0) {
            segments[segments.length - 1].content = bodyHtml.substring(lastIndex, match.index);
        }
        segments.push({ title: match[1].trim(), start: match.index });
        lastIndex = datePattern.lastIndex; // Note: We actually want to keep the content AFTER the summary too
    }
    // O conteúdo do último segmento vai até o fim
    if (segments.length > 0) {
        segments[segments.length - 1].content = bodyHtml.substring(lastIndex);
    }

    if (segments.length === 0) {
        console.log('Nenhuma reunião com data encontrada.');
        return;
    }

    // 1. Limpar documentos antigos
    console.log('Limpando documentos antigos...');
    await supabase.from('documents').delete().eq('client_id', clientId).eq('category', workspaceName);

    console.log(`Encontradas ${segments.length} reuniões.`);

    for (const seg of segments) {
        let title = seg.title.replace(/<\/?[^>]+(>|$)/g, "").trim();
        let content = seg.content;

        // Limpeza de tags desnecessárias (como o fechamento do details que ficou no início do próximo ou fim deste)
        // Como o split foi no <ul...summary>, o content começa logo após o summary.

        console.log(`Importando: ${title}`);

        // Converter imagens para Base64 no conteúdo do segmento
        const imgRegex = /<img\s+[^>]*src="([^"]+)"[^>]*>/gi;
        let imgMatch;
        while ((imgMatch = imgRegex.exec(content)) !== null) {
            const imgSrc = imgMatch[1];
            if (!imgSrc.startsWith('http') && !imgSrc.startsWith('data:')) {
                try {
                    const fullImgPath = path.join(baseDir, decodeURIComponent(imgSrc));
                    if (fs.existsSync(fullImgPath)) {
                        const imgData = fs.readFileSync(fullImgPath);
                        const ext = path.extname(fullImgPath).replace('.', '') || 'png';
                        content = content.replace(imgSrc, `data:image/${ext};base64,${imgData.toString('base64')}`);
                    }
                } catch (e) { }
            }
        }

        // Remover IDs do Notion
        content = content.replace(/id="[^"]*"/g, '');

        const { error } = await supabase.from('documents').insert({
            client_id: clientId,
            category: workspaceName,
            title: title,
            content: content,
            status: 'published'
        });

        if (error) console.error(`Erro em ${title}:`, error.message);
    }

    console.log('--- Importação Concluída com Sucesso! ---');
}

run();

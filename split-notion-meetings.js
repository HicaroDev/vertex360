
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const CLIENT_ID = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';
const HTML_FILE = 'c:/n/PRODUTOS RV/METÓDO VERTEX 360/Clientes/Ferreira Logística e Distribuidora/Reuniões - Ferreira Distribuidora 1d82880b31de802db285c921a2472dfb.html';
const CATEGORY = 'Reuniões - Ferreira Distribuidora';

async function splitMeetings() {
    console.log('🚀 Executando separação final de reuniões...\n');

    if (!fs.existsSync(HTML_FILE)) {
        console.error('❌ Arquivo não encontrado:', HTML_FILE);
        return;
    }

    const html = fs.readFileSync(HTML_FILE, 'utf8');

    // Regex aprimorada para focar em itens que começam com data ou o modelo
    const itemRegex = /<ul[^>]*class="toggle"[^>]*>\s*<li>\s*<details[^>]*>\s*<summary[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>\s*<\/li>\s*<\/ul>/g;

    let match;
    let count = 0;

    console.log('🧹 Limpando reuniões para nova importação...');
    await supabase.from('documents').delete().eq('client_id', CLIENT_ID).eq('category', CATEGORY);

    while ((match = itemRegex.exec(html)) !== null) {
        let titleRaw = match[1].replace(/<[^>]*>/g, '').trim();
        let content = match[2].trim();

        // FILTRO: Só aceita se tiver data ou for "Dados da Reunião"
        const isDate = /(\d{2})\/(\d{2})\/(\d{4})/.test(titleRaw);
        const isModel = titleRaw.includes('Dados da Reunião');

        if (!isDate && !isModel) {
            console.log(`⏩ Ignorando item genérico: "${titleRaw}"`);
            continue;
        }

        let title = titleRaw;
        console.log(`✅ Processando Reunião: "${title}"...`);

        const status = title.toLowerCase().includes('ok') ? 'published' : 'analyzing';

        let orderIndex = 0;
        const dateMatch = title.match(/(\d{2})\/(\d{2})\/(\d{4})/);

        if (dateMatch) {
            const [_, day, month, year] = dateMatch;
            const dateObj = new Date(year, month - 1, day);
            // Inverter para que a mais recente seja o maior número se quisermos ordenação desc
            // No banco usamos (a.order_index - b.order_index), então para o mais novo ficar no topo, 
            // devemos usar um número menor para o mais novo? Não, geralmente é ascending.
            // Para ficar: 13/08 -> 08/08 -> 17/04:
            // Usaremos timestamp negativo para o mais novo ser o "menor" e aparecer primeiro na ordenação ascending
            orderIndex = -Math.floor(dateObj.getTime() / 10000);
        } else if (isModel) {
            orderIndex = -9999999999; // Força o modelo a ser o primeiro de todos (menor número)
            title = '📝 Modelo: ' + title;
        }

        const fullContent = `<html><body><article class="page sans">${content}</article></body></html>`;

        const { error } = await supabase.from('documents').insert({
            client_id: CLIENT_ID,
            title: title,
            category: CATEGORY,
            content: fullContent,
            status: status,
            order_index: orderIndex,
            last_edit: new Date().toLocaleDateString('pt-BR')
        });

        if (!error) count++;
    }

    console.log(`\n✨ Sucesso! ${count} reuniões organizadas por data.`);
}

splitMeetings().catch(err => console.error(err));

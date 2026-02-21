
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const clientId = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';

async function updateExistingDocs() {
    console.log('🔄 Atualizando status e ordenação dos documentos da Ferreira...');

    // 1. Buscar todos os documentos do cliente
    const { data: docs, error } = await supabase
        .from('documents')
        .select('id, title, category, status')
        .eq('client_id', clientId);

    if (error) {
        console.error('❌ Erro ao buscar documentos:', error.message);
        return;
    }

    console.log(`📊 Processando ${docs.length} documentos...\n`);

    for (const doc of docs) {
        let newStatus = doc.status;
        let newOrder = 0;
        const title = doc.title || '';

        // Lógica de Status (OK = publicado, senão analisando)
        if (title.toLowerCase().includes('ok')) {
            newStatus = 'published';
        } else {
            newStatus = 'analyzing';
        }

        // Lógica de Ordenação por Data (se for reunião: DD/MM/YYYY)
        const dateMatch = title.match(/(\d{2})\/(\d{2})\/(\d{4})/);
        if (dateMatch) {
            // Converter data para timestamp ou algo ordenável
            const [_, day, month, year] = dateMatch;
            const dateObj = new Date(year, month - 1, day);
            newOrder = Math.floor(dateObj.getTime() / 100000); // Reduzir tamanho do número
        }

        // Atualizar no banco
        const { error: updateError } = await supabase
            .from('documents')
            .update({
                status: newStatus,
                order_index: newOrder
            })
            .eq('id', doc.id);

        if (updateError) {
            console.error(`❌ Erro ao atualizar "${title}":`, updateError.message);
        } else {
            console.log(`✅ Atualizado: "${title}" -> Status: ${newStatus}, Order: ${newOrder}`);
        }
    }

    console.log('\n✨ Concluído!');
}

updateExistingDocs();

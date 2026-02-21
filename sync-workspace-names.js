
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const clientId = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';

async function syncNames() {
    console.log('🔄 Sincronizando nomes de pastas...');

    const updates = [
        { old: 'Reuniões', new: 'Reuniões - Ferreira Distribuidora' },
        { old: 'Diagnóstico', new: 'Diagnóstico - Ferreira Distribuidora' },
        { old: 'Apresentação', new: 'Apresentação e Estruturação - Ferreira Distribuidora' },
        { old: 'Desenvolvimento', new: 'Desenvolvimento - Ferreira Distribuidora' }
    ];

    for (const update of updates) {
        const { error } = await supabase
            .from('workspaces')
            .update({ folder_name: update.new })
            .eq('client_id', clientId)
            .eq('folder_name', update.old);

        if (error) {
            console.error(`❌ Erro ao atualizar ${update.old}:`, error.message);
        } else {
            console.log(`✅ ${update.old} -> ${update.new}`);
        }
    }
}

syncNames();

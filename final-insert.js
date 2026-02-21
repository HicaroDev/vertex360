
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const clientId = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';

async function finalInsert() {
    console.log('--- Inserção Completa e Final ---');
    const folders = [
        { name: 'Dados Empresa', color: 'text-blue-500' },
        { name: 'Reuniões', color: 'text-emerald-500' },
        { name: 'Diagnóstico', color: 'text-brand-gold' },
        { name: 'Apresentação', color: 'text-purple-500' },
        { name: 'Desenvolvimento', color: 'text-rose-500' }
    ];

    // Primeiro limpamos para evitar duplicados
    await supabase.from('workspaces').delete().eq('client_id', clientId);

    for (const f of folders) {
        const { error } = await supabase.from('workspaces').insert({
            client_id: clientId,
            folder_name: f.name,
            color: f.color
        });

        if (error) console.error(`❌ Erro em ${f.name}:`, error.message);
        else console.log(`✅ ${f.name} OK`);
    }
}

finalInsert();

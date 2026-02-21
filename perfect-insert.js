
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const clientId = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';

async function perfectInsert() {
    console.log('--- Inserção com Icon e Color ---');
    const folders = [
        { name: 'Dados Empresa', color: 'text-blue-500', icon: 'users' },
        { name: 'Reuniões', color: 'text-emerald-500', icon: 'calendar' },
        { name: 'Diagnóstico', color: 'text-brand-gold', icon: 'bar-chart-3' },
        { name: 'Apresentação', color: 'text-purple-500', icon: 'presentation' },
        { name: 'Desenvolvimento', color: 'text-rose-500', icon: 'rocket' }
    ];

    await supabase.from('workspaces').delete().eq('client_id', clientId);

    for (const f of folders) {
        const { error } = await supabase.from('workspaces').insert({
            client_id: clientId,
            folder_name: f.name,
            color: f.color,
            icon: f.icon
        });

        if (error) console.error(`❌ Erro em ${f.name}:`, error.message);
        else console.log(`✅ ${f.name} OK`);
    }
}

perfectInsert();

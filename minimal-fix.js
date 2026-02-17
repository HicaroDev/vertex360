
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const clientId = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';

async function finalMinimalFix() {
    console.log('--- RESET TOTAL FERREIRA ---');

    await supabase.from('workspaces').delete().eq('client_id', clientId);

    const workspaces = [
        { folder_name: 'Dados Empresa', color: 'text-blue-500', icon: 'Users' },
        { folder_name: 'Reuniões - Ferreira Distribuidora', color: 'text-emerald-500', icon: 'Calendar' },
        { folder_name: 'Diagnóstico - Ferreira Distribuidora', color: 'text-brand-gold', icon: 'BarChart3' },
        { folder_name: 'Apresentação e Estruturação - Ferreira Distribuidora', color: 'text-purple-500', icon: 'Presentation' },
        { folder_name: 'Desenvolvimento - Ferreira Distribuidora', color: 'text-rose-500', icon: 'Rocket' }
    ];

    for (const ws of workspaces) {
        const { error } = await supabase.from('workspaces').insert({
            client_id: clientId,
            ...ws
        });
        if (error) console.error(`Erro em ${ws.folder_name}:`, error.message);
        else console.log(`✅ ${ws.folder_name} criado.`);
    }

    const { data: finalWs } = await supabase.from('workspaces').select('*').eq('client_id', clientId);
    console.log(`Fim: ${finalWs.length} workspaces criados.`);
}

finalMinimalFix();

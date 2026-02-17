
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const clientId = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';

async function run() {
    console.log('--- Force Workspace Creation ---');

    // Deletar qualquer lixo
    const { error: delError } = await supabase.from('workspaces').delete().eq('client_id', clientId);
    if (delError) console.error('Delete Error:', delError);

    const workspaces = [
        { folder_name: 'Dados Empresa', color: 'text-blue-500', order_index: 0 },
        { folder_name: 'Reuniões - Ferreira Distribuidora', color: 'text-emerald-500', order_index: 1 },
        { folder_name: 'Diagnóstico - Ferreira Distribuidora', color: 'text-brand-gold', order_index: 2 },
        { folder_name: 'Apresentação e Estruturação - Ferreira Distribuidora', color: 'text-purple-500', order_index: 3 },
        { folder_name: 'Desenvolvimento - Ferreira Distribuidora', color: 'text-rose-500', order_index: 4 }
    ];

    for (const ws of workspaces) {
        console.log(`Inserindo ${ws.folder_name}...`);
        const { data, error } = await supabase.from('workspaces').insert({
            client_id: clientId,
            ...ws
        }).select();

        if (error) {
            console.error(`Erro ao inserir ${ws.folder_name}:`, error);
        } else {
            console.log(`Sucesso: ${JSON.stringify(data)}`);
        }
    }

    // Verificar no final
    const { data: finalData } = await supabase.from('workspaces').select('*').eq('client_id', clientId);
    console.log('Workspaces no final:', finalData.length);
}

run();


const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const clientId = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';

async function run() {
    console.log('--- Force Workspace Creation (Fixed) ---');

    const workspaces = [
        { folder_name: 'Dados Empresa', color: 'text-blue-500', order_position: 0 },
        { folder_name: 'Reuniões', color: 'text-emerald-500', order_position: 1 },
        { folder_name: 'Diagnóstico', color: 'text-brand-gold', order_position: 2 },
        { folder_name: 'Apresentação', color: 'text-purple-500', order_position: 3 },
        { folder_name: 'Desenvolvimento', color: 'text-rose-500', order_position: 4 }
    ];

    for (const ws of workspaces) {
        console.log(`Inserindo ${ws.folder_name}...`);
        const { error } = await supabase.from('workspaces').upsert({
            client_id: clientId,
            folder_name: ws.folder_name,
            color: ws.color,
            order_position: ws.order_position
        }, { onConflict: 'client_id, folder_name' });

        if (error) {
            console.error(`❌ Erro ao inserir ${ws.folder_name}:`, error.message);
        } else {
            console.log(`✅ Sucesso: ${ws.folder_name}`);
        }
    }
}

run();

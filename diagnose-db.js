
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Erro: Variáveis de ambiente não encontradas no .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnose() {
    const targetClientId = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';
    console.log(`\n🔍 Diagnosticando Cliente ID: ${targetClientId}\n`);

    // 1. Verificar se o cliente existe
    const { data: client, error: clientErr } = await supabase
        .from('clients')
        .select('id, name')
        .eq('id', targetClientId)
        .single();

    if (clientErr) console.log('❌ Cliente não encontrado:', clientErr.message);
    else console.log('✅ Cliente encontrado:', client.name);

    // 2. Verificar Workspaces
    const { data: workspaces, error: wsErr } = await supabase
        .from('workspaces')
        .select('*')
        .eq('client_id', targetClientId);

    if (wsErr) {
        console.log('❌ Erro ao buscar workspaces:', wsErr.message);
    } else {
        console.log(`📂 Workspaces encontrados: ${workspaces.length}`);
        workspaces.forEach(ws => {
            console.log(`   - [${ws.folder_name}] ID: ${ws.id}`);
        });
    }

    // 3. Verificar se existem workspaces com OUTRO client_id (caso tenha mudado)
    if (workspaces.length === 0) {
        console.log('\n❓ Buscando se existem workspaces com QUALQUER client_id...');
        const { data: allWs } = await supabase.from('workspaces').select('folder_name, client_id').limit(5);
        if (allWs && allWs.length > 0) {
            console.log('⚠️ Encontrei workspaces, mas com IDs diferentes:');
            allWs.forEach(w => console.log(`   - Pasta: ${w.folder_name} | ClientID: ${w.client_id}`));
        } else {
            console.log('❌ NENHUM workspace encontrado em toda a tabela.');
        }
    }
}

diagnose();

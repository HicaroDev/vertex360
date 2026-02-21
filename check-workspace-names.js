const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const clientId = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';

async function checkWorkspaceNames() {
    console.log('\n📂 WORKSPACE NAMES COMPARISON\n');

    const { data: workspaces, error } = await supabase
        .from('workspaces')
        .select('id, folder_name, color, icon')
        .eq('client_id', clientId)
        .order('folder_name');

    if (error) {
        console.error('❌ Error:', error.message);
        return;
    }

    console.log('WORKSPACES NO BANCO DE DADOS:');
    console.log('================================\n');

    workspaces.forEach((ws, index) => {
        console.log(`${index + 1}. "${ws.folder_name}"`);
        console.log(`   ID: ${ws.id}`);
        console.log(`   Color: ${ws.color || 'N/A'}`);
        console.log(`   Icon: ${ws.icon || 'N/A'}\n`);
    });

    console.log('ESPERADO NA TELA:');
    console.log('================================\n');
    workspaces.forEach((ws, index) => {
        console.log(`${index + 1}. ${ws.folder_name} (exatamente como está no banco)`);
    });

    console.log('\n');
}

checkWorkspaceNames();

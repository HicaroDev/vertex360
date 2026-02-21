
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const clientId = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';

async function simpleInsert() {
    console.log('--- Inserção Minimalista ---');
    const folders = ['Dados Empresa', 'Reuniões', 'Diagnóstico', 'Apresentação', 'Desenvolvimento'];

    for (const folder of folders) {
        console.log(`Tentando: ${folder}`);
        const { error } = await supabase.from('workspaces').insert({
            client_id: clientId,
            folder_name: folder
        });

        if (error) console.error(`❌ Erro em ${folder}:`, error.message);
        else console.log(`✅ ${folder} OK`);
    }
}

simpleInsert();

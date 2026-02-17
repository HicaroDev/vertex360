
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkColumns() {
    console.log('--- Verificando Colunas de Workspaces ---');
    const { data, error } = await supabase.from('workspaces').select('*').limit(1);

    if (error) {
        console.error('Erro ao buscar dados:', error.message);
        return;
    }

    if (data && data.length > 0) {
        console.log('Colunas encontradas:', Object.keys(data[0]));
    } else {
        console.log('Tabela vazia ou erro ao identificar colunas. Tentando via RPC ou Metadata...');
        // Tentativa de inserir um objeto vazio para ver o erro de colunas (hacky but reliable for schema discovery)
        const { error: insertError } = await supabase.from('workspaces').insert({}).select();
        console.log('Mensagem de erro de inserção (pode revelar colunas):', insertError?.message);
    }
}

checkColumns();

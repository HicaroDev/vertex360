
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function addOrderColumn() {
    console.log('--- Adicionando Coluna order_position à tabela workspaces ---');

    // Tentar adicionar a coluna via SQL (se tivermos permissões ou via um hack de RPC se configurado)
    // No ambiente do usuário, geralmente rodamos comandos SQL no dashboard.
    // Mas posso tentar ver se o Supabase JS aceita algo (spoiler: não para DDL).

    console.log('Utilizando hack de inserção para confirmar a falta da coluna...');
    const { error: insertError } = await supabase.from('workspaces').insert({ order_position: 0 }).select();

    if (insertError) {
        console.log('Confirmação de erro:', insertError.message);
        console.log('Recomendação: Execute o seguinte SQL no editor do Supabase:');
        console.log('ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS order_position INTEGER DEFAULT 0;');
    } else {
        console.log('✅ Coluna já existe ou foi adicionada com sucesso!');
    }
}

addOrderColumn();


const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkColumns() {
    console.log('🔍 Verificando estrutura da tabela workspaces...');

    // Tenta pegar um registro para ver as colunas
    const { data, error } = await supabase.from('workspaces').select('*').limit(1);

    if (error) {
        console.error('❌ Erro ao ler tabela:', error.message);
        return;
    }

    if (data && data.length > 0) {
        console.log('✅ Colunas encontradas:', Object.keys(data[0]).join(', '));
    } else {
        console.log('⚠️ Tabela vazia. Tentando buscar metadados...');
        // Fallback: tenta inserir um erro proposital para ver colunas sugeridas ou usar rpc se disponível
        console.log('Dica: Verifique se as colunas [client_id, folder_name, order_position] existem exatamente com esses nomes.');
    }
}

checkColumns();

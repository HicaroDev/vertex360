
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function findTheData() {
    console.log('--- BUSCANDO DADOS PERDIDOS ---');

    // Testar tabelas em português
    const tables = ['clientes', 'documentos', 'espaços de trabalho', 'atividades'];

    for (const t of tables) {
        const { data, error, count } = await supabase.from(t).select('*', { count: 'exact', head: false }).limit(1);
        if (error) {
            console.log(`❌ Tabela '${t}': ${error.message}`);
        } else {
            // Pegar o count real sem o head:true para ter certeza
            const { count: total } = await supabase.from(t).select('*', { count: 'exact', head: true });
            console.log(`✅ Tabela '${t}': ${total} registros encontrados.`);
            if (data && data.length > 0) {
                console.log(`   Colunas detectadas: ${Object.keys(data[0]).join(', ')}`);
            }
        }
    }

    // Verificar se há documentos na tabela em inglês tbm, só por segurança
    const { count: enDocs } = await supabase.from('documents').select('*', { count: 'exact', head: true });
    console.log(`\n🔍 Tabela 'documents' (inglês): ${enDocs || 0} registros.`);
}

findTheData();

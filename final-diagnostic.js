
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const clientId = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';

async function finalDiagnostic() {
    console.log('--- DIAGNÓSTICO FINAL DE DADOS ---');

    // 1. Verificar Clientes
    const { data: clientsEn } = await supabase.from('clients').select('id, name').limit(5);
    const { data: clientsPt } = await supabase.from('clientes').select('id, name').limit(5);

    console.log('\n👥 TABELAS DE CLIENTES:');
    if (clientsEn) console.log(`   - 'clients' tem ${clientsEn.length} registros. Ex: ${clientsEn[0]?.name}`);
    if (clientsPt) console.log(`   - 'clientes' tem ${clientsPt.length} registros. Ex: ${clientsPt[0]?.name}`);

    // 2. Verificar Documentos
    console.log('\n📄 TABELAS DE DOCUMENTOS:');
    const tables = ['documents', 'documentos'];
    for (const t of tables) {
        const { data, error } = await supabase.from(t).select('id, title, category, client_id, id_do_cliente').eq(t === 'documents' ? 'client_id' : 'id_do_cliente', clientId);
        if (error) {
            console.log(`   - '${t}': Erro ou não existe (${error.message})`);
        } else {
            console.log(`   - '${t}': Encontrados ${data.length} documentos para este cliente.`);
            if (data.length > 0) {
                console.log(`     Amostra Categorias: ${[...new Set(data.map(d => d.category || d.categoria))].join(', ')}`);
            }
        }
    }

    // 3. Verificar Workspaces
    const { data: ws } = await supabase.from('workspaces').select('folder_name').eq('client_id', clientId);
    console.log('\n📂 WORKSPACES (Pastas):');
    if (ws) console.log(`   - Encontradas ${ws.length} pastas: ${ws.map(w => w.folder_name).join(', ')}`);
}

finalDiagnostic();

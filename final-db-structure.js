const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const clientId = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';

async function diagnose() {
    console.log('═══════════════════════════════════════════════');
    console.log('    DIAGNÓSTICO FINAL DO BANCO SUPABASE');
    console.log('═══════════════════════════════════════════════\n');

    // 1. Testar tabela 'documentos'
    console.log('📊 TABELA: documentos');
    const { data: docs, error: docsErr } = await supabase
        .from('documentos')
        .select('*')
        .limit(1);

    if (docsErr) {
        console.log(`   ❌ Erro: ${docsErr.message}`);
    } else {
        const { count } = await supabase.from('documentos').select('*', { count: 'exact', head: true });
        console.log(`   ✅ Existe! Total de registros: ${count}`);
        if (docs && docs.length > 0) {
            console.log(`   📋 Colunas: ${Object.keys(docs[0]).join(', ')}`);
        }
    }

    // 2. Testar tabela 'documents' (inglês)
    console.log('\n📊 TABELA: documents');
    const { data: enDocs, error: enErr } = await supabase
        .from('documents')
        .select('*')
        .limit(1);

    if (enErr) {
        console.log(`   ❌ Erro: ${enErr.message}`);
    } else {
        const { count } = await supabase.from('documents').select('*', { count: 'exact', head: true });
        console.log(`   ✅ Existe! Total de registros: ${count}`);
        if (enDocs && enDocs.length > 0) {
            console.log(`   📋 Colunas: ${Object.keys(enDocs[0]).join(', ')}`);
        }
    }

    // 3. Buscar documentos da Ferreira em ambas
    console.log('\n🔍 DOCUMENTOS DA FERREIRA DISTRIBUIDORA:');

    const { data: ferreiraDocs1, count: count1 } = await supabase
        .from('documentos')
        .select('*', { count: 'exact' })
        .eq('id_do_cliente', clientId);

    const { data: ferreiraDocs2, count: count2 } = await supabase
        .from('documents')
        .select('*', { count: 'exact' })
        .eq('client_id', clientId);

    console.log(`   Na tabela 'documentos' (PT): ${count1 || 0} registros`);
    console.log(`   Na tabela 'documents' (EN): ${count2 || 0} registros`);

    if (ferreiraDocs2 && ferreiraDocs2.length > 0) {
        console.log('\n📄 AMOSTRA (primeiros 3 documentos na tabela "documents"):');
        ferreiraDocs2.slice(0, 3).forEach((doc, i) => {
            console.log(`   ${i + 1}. ${doc.title || doc.titulo || 'Sem título'}`);
            console.log(`      Categoria: ${doc.category || doc.categoria || 'N/A'}`);
        });
    }

    // 4. Testar workspaces
    console.log('\n📁 WORKSPACES/PASTAS:');
    const { data: ws1, count: wsCount1 } = await supabase
        .from('workspaces')
        .select('*', { count: 'exact' })
        .eq('client_id', clientId);

    if (ws1) {
        console.log(`   ✅ Tabela 'workspaces': ${wsCount1} pastas encontradas`);
        if (ws1.length > 0) {
            ws1.forEach(w => console.log(`      - ${w.folder_name}`));
        }
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log('        FIM DO DIAGNÓSTICO');
    console.log('═══════════════════════════════════════════════');
}

diagnose().catch(err => console.error('ERRO FATAL:', err));

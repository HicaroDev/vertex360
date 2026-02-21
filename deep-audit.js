
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function deepAudit() {
    console.log('--- DEEP DATABASE AUDIT (REAL NAMES ONLY) ---');

    const tables = ['clientes', 'documentos', 'espaços de trabalho', 'clients', 'documents', 'workspaces'];

    for (const t of tables) {
        const { data, error } = await supabase.from(t).select('*').limit(1);
        if (error) {
            console.log(`❌ Table '${t}': ${error.message}`);
        } else {
            const { count } = await supabase.from(t).select('*', { count: 'exact', head: true });
            console.log(`✅ Table '${t}': Found ${count} rows.`);
            if (data && data.length > 0) {
                console.log(`   Real Columns: ${Object.keys(data[0]).join(', ')}`);
            }
        }
    }

    console.log('\n--- CHECKING DOCUMENTS FOR FERREIRA (9e4e1fec...) ---');
    const clientId = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';

    // Test multiple column variations for client_id
    const colVariations = ['client_id', 'id_do_cliente'];
    for (const t of ['documentos', 'documents']) {
        for (const col of colVariations) {
            const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true }).eq(col, clientId);
            if (!error) {
                console.log(`🔍 Matches in '${t}' where '${col}' = ferreira: ${count}`);
            }
        }
    }
}

deepAudit();

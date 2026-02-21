
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function discover() {
    console.log('--- Database Discovery ---');

    const tablesToTest = ['clients', 'clientes', 'documents', 'documentos', 'workspaces', 'espaços de trabalho'];

    for (const table of tablesToTest) {
        const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        if (error) {
            console.log(`❌ Table '${table}': ${error.message}`);
        } else {
            console.log(`✅ Table '${table}': ${count} rows`);
            if (count > 0) {
                const { data } = await supabase.from(table).select('*').limit(1);
                console.log(`   Columns: ${Object.keys(data[0]).join(', ')}`);
            }
        }
    }
}

discover();

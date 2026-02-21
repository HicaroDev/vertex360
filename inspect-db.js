
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function inspect() {
    const tables = ['clientes', 'clients', 'documentos', 'documents', 'workspaces'];
    for (const t of tables) {
        console.log(`\n--- Inspecting ${t} ---`);
        const { data, error } = await supabase.from(t).select('*').limit(1);
        if (error) {
            console.log(`❌ ${t}: ${error.message}`);
        } else {
            console.log(`✅ ${t} exists.`);
            if (data && data.length > 0) {
                console.log(`   Columns: ${Object.keys(data[0]).join(', ')}`);
            } else {
                console.log(`   Table is empty.`);
            }
        }
    }
}
inspect();

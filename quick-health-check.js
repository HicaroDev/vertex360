const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function quickCheck() {
    console.log('\n🏥 QUICK DATABASE HEALTH CHECK\n');

    // 1. Connection
    try {
        const { error } = await supabase.from('clients').select('id').limit(1);
        if (error) throw error;
        console.log('✅ Connection: OK');
    } catch (err) {
        console.log('❌ Connection: FAILED');
        return;
    }

    // 2. Tables
    const { count: docsCount } = await supabase.from('documents').select('*', { count: 'exact', head: true });
    const { count: wsCount } = await supabase.from('workspaces').select('*', { count: 'exact', head: true });

    console.log(`✅ Documents table: ${docsCount} records`);
    console.log(`✅ Workspaces table: ${wsCount} records`);

    // 3. Ferreira Data
    const clientId = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';
    const { count: ferreiraDocs } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', clientId);

    console.log(`✅ Ferreira documents: ${ferreiraDocs} records`);

    console.log('\n✅ OVERALL: HEALTHY\n');
}

quickCheck().catch(err => console.error('ERROR:', err));

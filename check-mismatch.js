
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const clientId = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';

async function checkMismatch() {
    console.log('--- Deep Check: Workspaces vs Documents ---');

    // 1. Get Workspaces
    const { data: ws } = await supabase.from('workspaces').select('folder_name').eq('client_id', clientId);
    console.log('Workspaces in DB:', ws.map(w => `'${w.folder_name}'`).join(', '));

    // 2. Get Documents
    const { data: docs } = await supabase.from('documents').select('title, category').eq('client_id', clientId);
    console.log('Documents in DB:');
    docs.forEach(d => {
        console.log(`   - Title: '${d.title}' | Category: '${d.category}'`);
    });

    // 3. Test the ILIKE logic manually for one
    console.log('\n--- Test Match (Diagnóstico) ---');
    if (ws.some(w => w.folder_name.includes('DIAGNÓSTICO'))) {
        const folderName = ws.find(w => w.folder_name.includes('DIAGNÓSTICO')).folder_name;
        const { data: test } = await supabase.from('documents')
            .select('title')
            .eq('client_id', clientId)
            .ilike('category', `%${folderName}%`);
        console.log(`Search for '%${folderName}%' returned:`, test.map(t => t.title));
    }
}

checkMismatch();

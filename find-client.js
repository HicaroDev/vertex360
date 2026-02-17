
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function findClient() {
    const { data, error } = await supabase
        .from('clients')
        .select('id, name')
        .ilike('name', '%Ferreira Distribuidora%');

    if (error) {
        console.error(error);
        return;
    }
    console.log(JSON.stringify(data));
}

findClient();

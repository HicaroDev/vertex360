
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkData() {
    const clientId = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';

    console.log('--- Verificando Dados no Supabase ---');

    const { data: client } = await supabase.from('clients').select('name').eq('id', clientId).single();
    console.log('Cliente:', client?.name || 'Não encontrado');

    const { count: wsCount } = await supabase.from('workspaces').select('*', { count: 'exact', head: true }).eq('client_id', clientId);
    console.log('Total de Workspaces:', wsCount);

    const { count: docCount } = await supabase.from('documents').select('*', { count: 'exact', head: true }).eq('client_id', clientId);
    console.log('Total de Documentos:', docCount);
}

checkData();

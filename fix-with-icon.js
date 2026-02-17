
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const clientId = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';

async function fixWithIcon() {
    console.log('--- Corrigindo Workspaces (com Icon) ---');

    await supabase.from('workspaces').delete().eq('client_id', clientId);

    const officialWorkspaces = [
        { name: 'Dados Empresa', color: 'text-blue-500', icon: 'Users', order: 0 },
        { name: 'Reuniões - Ferreira Distribuidora', color: 'text-emerald-500', icon: 'Calendar', order: 1 },
        { name: 'Diagnóstico - Ferreira Distribuidora', color: 'text-brand-gold', icon: 'BarChart3', order: 2 },
        { name: 'Apresentação e Estruturação - Ferreira Distribuidora', color: 'text-purple-500', icon: 'Presentation', order: 3 },
        { name: 'Desenvolvimento - Ferreira Distribuidora', color: 'text-rose-500', icon: 'Rocket', order: 4 }
    ];

    for (const ws of officialWorkspaces) {
        const { data, error } = await supabase.from('workspaces').insert({
            client_id: clientId,
            folder_name: ws.name,
            color: ws.color,
            icon: ws.icon,
            order_position: ws.order
        }).select();

        if (error) {
            console.error(`Falha em ${ws.name}:`, error.message);
        } else {
            console.log(`✅ Sucesso em ${ws.name}`);
        }
    }

    console.log('--- Verificando documentos ---');
    const { data: docs } = await supabase.from('documents').select('category').eq('client_id', clientId);
    console.log(`Documentos encontrados: ${docs.length}`);

    // Garantir que as categorias dos documentos batam com os nomes dos folders
    // (Caso contrário eles não aparecem no frontend)
}

fixWithIcon();

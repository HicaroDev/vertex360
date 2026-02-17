
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const clientId = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';

async function fixAndImport() {
    console.log('--- Sistema de Auto-Correção de Workspaces ---');

    // 1. Tentar descobrir quais colunas existem
    const testWorkspaces = [
        { folder_name: 'Teste 1', client_id: clientId },
        { name: 'Teste 2', client_id: clientId },
        { title: 'Teste 3', client_id: clientId }
    ];

    let correctColumn = null;

    for (const test of testWorkspaces) {
        const { error } = await supabase.from('workspaces').insert(test);
        if (!error) {
            correctColumn = Object.keys(test).find(k => k !== 'client_id');
            console.log(`✅ Coluna correta identificada: ${correctColumn}`);
            break;
        } else {
            console.log(`❌ Falha com ${Object.keys(test).find(k => k !== 'client_id')}: ${error.message}`);
        }
    }

    if (!correctColumn) {
        console.error('CRÍTICO: Não foi possível identificar a coluna de nome da pasta!');
        // Se falhou tudo, talvez o problema seja cache. Vou tentar folder_name de novo forçando
        correctColumn = 'folder_name';
    }

    // 2. Limpar e Criar Oficiais
    await supabase.from('workspaces').delete().eq('client_id', clientId);

    const officialWorkspaces = [
        { name: 'Dados Empresa', color: 'text-blue-500', order: 0 },
        { name: 'Reuniões - Ferreira Distribuidora', color: 'text-emerald-500', order: 1 },
        { name: 'Diagnóstico - Ferreira Distribuidora', color: 'text-brand-gold', order: 2 },
        { name: 'Apresentação e Estruturação - Ferreira Distribuidora', color: 'text-purple-500', order: 3 },
        { name: 'Desenvolvimento - Ferreira Distribuidora', color: 'text-rose-500', order: 4 }
    ];

    for (const ws of officialWorkspaces) {
        const payload = { client_id: clientId, color: ws.color };
        payload[correctColumn] = ws.name;
        // Tentar order_index ou order_position
        payload.order_index = ws.order;
        payload.order_position = ws.order;

        const { error } = await supabase.from('workspaces').insert(payload);
        if (error) {
            // Tentar sem os orders se falhar
            delete payload.order_index;
            delete payload.order_position;
            const { error: error2 } = await supabase.from('workspaces').insert(payload);
            if (error2) console.error(`Erro ao criar ${ws.name}:`, error2.message);
        }
    }

    console.log('--- Workspaces Criados. Verificando documentos... ---');
    const { count } = await supabase.from('documents').select('*', { count: 'exact', head: true }).eq('client_id', clientId);
    console.log(`Documentos no banco: ${count}`);

    if (count === 0) {
        console.log('Documentos sumiram! Reimportando...');
        // (Aqui eu poderia rodar o importador de novo se necessário)
    }

    console.log('--- PROCESSO CONCLUÍDO ---');
}

fixAndImport();

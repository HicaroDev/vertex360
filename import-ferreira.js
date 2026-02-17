
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const clientId = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';

async function implementFerreira() {
    console.log('--- Iniciando implementação Ferreira Distribuidora ---');

    // 1. Garantir Workspaces básicos
    const workspacesToEnsure = [
        { name: 'Dados Empresa', color: 'text-blue-500' },
        { name: 'Reuniões', color: 'text-emerald-500' },
        { name: 'Diagnóstico', color: 'text-brand-gold' },
        { name: 'Apresentação e Estruturação', color: 'text-purple-500' },
        { name: 'Desenvolvimento', color: 'text-rose-500' }
    ];

    for (const ws of workspacesToEnsure) {
        const { data: existing } = await supabase
            .from('workspaces')
            .select('id')
            .eq('client_id', clientId)
            .eq('folder_name', ws.name)
            .single();

        if (!existing) {
            console.log(`Criando workspace: ${ws.name}`);
            await supabase.from('workspaces').insert({
                client_id: clientId,
                folder_name: ws.name,
                color: ws.color,
                order_index: workspacesToEnsure.indexOf(ws)
            });
        }
    }

    // 2. Mapeamento de Arquivos -> Workspaces
    const baseDir = 'c:/n/PRODUTOS RV';
    const mapping = [
        { file: 'Perfil do Empresário de Alta Performance✅ 2702880b31de8006a678dde212d76e96.html', workspace: 'Diagnóstico' },
        { file: 'Apresentação do Método 1d62880b31de800390afed9b498f1aba.html', workspace: 'Apresentação e Estruturação', sub: 'METÓDO VERTEX 360' },
        { file: 'PN ou VB 2882880b31de80c0a49dc991656c45aa.html', workspace: 'Diagnóstico' },
        { file: 'METÓDO VERTEX 360 2702880b31de80788faae9755096edbc.html', workspace: 'Apresentação e Estruturação' },
        { file: 'Projeto Plano de Carreira, Cargos e Salários 2bd2880b31de8020a244fb87fc4885c9.html', workspace: 'Apresentação e Estruturação' },
        { file: 'REESTRUTURAÇÃO FINANCEIRA 2702880b31de80cab7d5da3cb05134cf.html', workspace: 'Desenvolvimento' },
        { file: 'VIABILIDADE ECONÔMICA FINANCEIRA 2702880b31de80cf9794fe6b72184d88.html', workspace: 'Desenvolvimento' },
        { file: 'Como dar feedback 29c2880b31de80db8f17f04421872ce7.html', workspace: 'Desenvolvimento' },
        { file: 'Papel do lider 2ab2880b31de809a8adcc4d5f33a64fc.html', workspace: 'Desenvolvimento' },
        { file: 'IA 3002880b31de800c9733caa6357d7226.html', workspace: 'Apresentação e Estruturação' }
    ];

    for (const item of mapping) {
        const filePath = path.join(baseDir, item.sub || '', item.file);
        if (!fs.existsSync(filePath)) {
            console.log(`Arquivo não encontrado: ${filePath}`);
            continue;
        }

        const html = fs.readFileSync(filePath, 'utf8');

        // Extrair título do <title>
        const titleMatch = html.match(/<title>([^<]+)<\/title>/);
        const title = titleMatch ? titleMatch[1] : item.file.split(' ')[0];

        // Extrair conteúdo do <body>
        const bodyMatch = html.match(/<body>([\s\S]+)<\/body>/);
        let contentHtml = bodyMatch ? bodyMatch[1] : html;

        // Limpeza básica do HTML para o Tiptap
        contentHtml = contentHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        contentHtml = contentHtml.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

        console.log(`Importando: ${title} para ${item.workspace}`);

        const { error } = await supabase.from('documents').insert({
            client_id: clientId,
            category: item.workspace,
            title: title,
            content: contentHtml, // Enviando como string HTML
            status: 'published',
            last_edit: '17/02/2026',
            created_by: 'admin'
        });

        if (error) {
            console.error(`Erro ao importar ${title}:`, error.message);
        } else {
            console.log(`✅ ${title} importado com sucesso.`);
        }
    }

    console.log('--- Implementação concluída ---');
}

implementFerreira();

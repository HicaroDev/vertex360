import { supabase } from "./supabase";

/**
 * Funções de Diagnóstico e Conexão
 */
export async function testConnection() {
    try {
        if (!supabase) return false;
        const { data, error } = await supabase.from('clientes').select('count').limit(1);
        if (error) throw error;
        return true;
    } catch (e) {
        console.error("Conexão falhou:", e);
        return false;
    }
}

/**
 * Funções de Clientes (Tabela: clientes)
 */
export async function getClients() {
    const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        console.error("Erro ao buscar clientes:", error);
        return [];
    }
    return data;
}

export async function getClientById(clientId: string) {
    if (!supabase) return null;
    const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', clientId)
        .single();

    if (error) {
        console.error('Erro ao buscar cliente:', error);
        return null;
    }
    return data;
}

/**
 * Funções de Workspace e Documentos (Tabelas: workspaces, documentos)
 */
export async function getClientWorkspace(clientId: string) {
    if (!supabase) return [];

    // 1. Busca as pastas (workspaces)
    const { data: folders, error: foldersError } = await supabase
        .from('workspaces')
        .select('*')
        .eq('client_id', clientId);

    if (foldersError) {
        console.error('Erro ao buscar workspaces:', foldersError.message);
        return [];
    }

    // 2. Busca os documentos (documentos) e vincula
    const workspaceData = await Promise.all(
        (folders || []).map(async (folder) => {
            // Busca usando ILIKE para ignorar o sufixo "- Ferreira Distribuidora"
            const { data: docs, error: docsError } = await supabase
                .from('documentos')
                .select('*')
                .eq('id_do_cliente', clientId)
                .ilike('categoria', `%${folder.folder_name}%`);

            return {
                id: folder.id,
                folder_name: folder.folder_name,
                color: folder.color,
                documents: (docs || []).map(doc => ({
                    id: doc.id,
                    title: doc.titulo,    // Campo titulo no banco
                    category: doc.categoria, // Campo categoria no banco
                    content: doc.content,
                    last_edit: doc.last_edit || '17/02/2026',
                    status: doc.status || 'published'
                }))
            };
        })
    );

    return workspaceData;
}

export async function getPortalWorkspaces(clientId: string) {
    // Mesma lógica para o portal do cliente
    return getClientWorkspace(clientId);
}

/**
 * Funções de Documento Único
 */
export async function getDocumentById(docId: string) {
    const { data, error } = await supabase
        .from('documentos')
        .select('*')
        .eq('id', docId)
        .single();

    if (error) {
        console.error('Erro ao buscar documento:', error);
        return null;
    }

    // Mapeia para o formato esperado pelo frontend
    return {
        ...data,
        title: data.titulo,
        category: data.categoria
    };
}

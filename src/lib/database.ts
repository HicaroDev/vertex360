import { supabase } from "./supabase";

/**
 * TABELAS CONFIRMADAS NO SUPABASE:
 * - clients (clientes)
 * - documents (documentos)
 * - workspaces (pastas/workspace)
 */

// ============================================
// CLIENTS (Clientes)
// ============================================

export async function getClients() {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        console.error("❌ Erro ao buscar clientes:", error.message);
        return [];
    }
    return data || [];
}

export async function getClientById(clientId: string) {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .single();

    if (error) {
        console.error("❌ Erro ao buscar cliente:", error.message);
        return null;
    }
    return data;
}

// ============================================
// WORKSPACES & DOCUMENTS
// ============================================

export async function createWorkspace(workspace: {
    client_id: string;
    folder_name: string;
    color?: string;
    icon?: string;
    order_index?: number;
}) {
    if (!supabase) return null;
    try {
        const { data, error } = await supabase
            .from("workspaces")
            .insert([workspace])
            .select()
            .single();
        if (error) throw error;
        return data;
    } catch (error: any) {
        console.error("❌ Erro ao criar workspace:", error.message);
        throw error;
    }
}

export async function updateWorkspace(id: string, updates: any) {
    if (!supabase) return null;
    try {
        const { data, error } = await supabase
            .from("workspaces")
            .update(updates)
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return data;
    } catch (error: any) {
        console.error("❌ Erro ao atualizar workspace:", error.message);
        throw error;
    }
}

export async function deleteWorkspace(id: string) {
    if (!supabase) return false;
    try {
        const { error } = await supabase
            .from("workspaces")
            .delete()
            .eq("id", id);
        if (error) throw error;
        return true;
    } catch (error: any) {
        console.error("❌ Erro ao deletar workspace:", error.message);
        throw error;
    }
}

export async function getClientWorkspace(clientId: string) {
    if (!supabase) return [];

    try {
        // 1. Buscar pastas (workspaces)
        const { data: folders, error: foldersError } = await supabase
            .from("workspaces")
            .select("*")
            .eq("client_id", clientId);

        if (foldersError) throw foldersError;

        // 2. Buscar TODOS os documentos do cliente
        const { data: allDocs, error: docsError } = await supabase
            .from("documents")
            .select("*")
            .eq("client_id", clientId);

        if (docsError) throw docsError;

        // 3. Normalizar e associar documentos às pastas
        const normalize = (str: string) => {
            if (!str) return '';
            return str
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]/g, "")
                .trim();
        };

        // 4. Organizar workspaces com seus documentos
        const workspaceData = (folders || []).map((folder: any) => {
            const folderNameNorm = normalize(folder.folder_name);

            const docsInFolder = (allDocs || []).filter((doc: any) => {
                const categoryNorm = normalize(doc.category || '');
                return categoryNorm.includes(folderNameNorm) || folderNameNorm.includes(categoryNorm);
            }).map((doc: any) => ({
                id: doc.id,
                title: doc.title || 'Sem título',
                category: doc.category,
                content: doc.content,
                last_edit: doc.last_edit || new Date().toLocaleDateString('pt-BR'),
                status: doc.status || 'published',
                order_index: doc.order_index || 0
            }));

            // Ordenar documentos dentro da pasta
            docsInFolder.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));

            return {
                id: folder.id,
                folder_name: folder.folder_name,
                color: folder.color || 'text-brand-gold',
                icon: folder.icon,
                order_index: folder.order_index || 0,
                documents: docsInFolder
            };
        });

        // Ordenar as pastas
        workspaceData.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));

        return workspaceData;
    } catch (error: any) {
        console.error("💥 Erro ao buscar workspace:", error.message);
        return [];
    }
}

export async function getPortalWorkspaces(clientId: string) {
    return getClientWorkspace(clientId);
}

// ============================================
// DOCUMENTS (Individual)
// ============================================

export async function getDocumentById(docId: string) {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from("documents")
            .select("*")
            .eq("id", docId)
            .single();

        if (error) throw error;
        return data;
    } catch (error: any) {
        console.error("❌ Erro ao buscar documento:", error.message);
        return null;
    }
}

export async function createDocument(document: {
    client_id: string;
    category: string;
    title: string;
    content: any;
    status: string;
}) {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from("documents")
            .insert({
                ...document,
                last_edit: new Date().toLocaleDateString('pt-BR')
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error: any) {
        console.error("❌ Erro ao criar documento:", error.message);
        throw error;
    }
}

export async function updateDocument(docId: string, updates: any) {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from("documents")
            .update({
                ...updates,
                last_edit: new Date().toLocaleDateString('pt-BR')
            })
            .eq("id", docId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error: any) {
        console.error("❌ Erro ao atualizar documento:", error.message);
        throw error;
    }
}

export async function deleteDocument(docId: string) {
    if (!supabase) return false;

    try {
        const { error } = await supabase
            .from("documents")
            .delete()
            .eq("id", docId);

        if (error) throw error;
        return true;
    } catch (error: any) {
        console.error("❌ Erro ao deletar documento:", error.message);
        throw error;
    }
}

// ============================================
// SHARING (Compartilhamento)
// ============================================

export async function shareDocument(
    documentId: string,
    clientId: string,
    options: {
        allow_comments?: boolean;
        allow_download?: boolean;
        expires_at?: string | null;
    }
) {
    if (!supabase) return null;

    try {
        const publicLink = Math.random().toString(36).substring(2, 15);

        const { data, error } = await supabase
            .from("shared_documents")
            .insert({
                document_id: documentId,
                client_id: clientId,
                public_link: publicLink,
                allow_comments: options.allow_comments || false,
                allow_download: options.allow_download || true,
                expires_at: options.expires_at,
                status: 'active',
                shared_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error: any) {
        console.error("❌ Erro ao compartilhar documento:", error.message);
        throw error;
    }
}

// ============================================
// ACTIVITIES (Log de Atividades)
// ============================================

export async function logActivity(activity: {
    client_id: string;
    action: string;
    entity_type: string;
    entity_id?: string;
    metadata?: any;
    user_id?: string;
}) {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from("activities")
            .insert({
                ...activity,
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            // Falha silenciosa se a tabela não existir ainda (Fase 3 do projeto)
            console.warn("⚠️ Tabela activities não encontrada (será criada na Fase 3)");
            return null;
        }
        return data;
    } catch (error) {
        console.warn("⚠️ Erro ao registrar atividade:", error);
        return null;
    }
}

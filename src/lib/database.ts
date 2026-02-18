import { supabase } from './supabase';

export async function testConnection() {
    try {
        // Testa conexão básica
        if (!supabase) return false;

        const { data, error } = await supabase
            .from('clients')
            .select('count')
            .limit(1);

        if (error) {
            console.error('❌ Erro de conexão com Supabase:', error.message);
            return false;
        }

        console.log('✅ Conexão com Supabase estabelecida com sucesso!');
        return true;
    } catch (err) {
        console.error('❌ Erro ao testar conexão:', err);
        return false;
    }
}

export async function getClients() {
    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar clientes:', error);
        return [];
    }

    return data || [];
}

export async function getClientWorkspace(clientId: string) {
    if (!supabase) {
        console.error('❌ Supabase client not initialized');
        return [];
    }

    // Busca as pastas do workspace do cliente
    const { data: folders, error: foldersError } = await supabase
        .from('workspaces')
        .select('*')
        .eq('client_id', clientId);

    if (foldersError) {
        console.error('❌ Erro Supabase (Workspaces):', foldersError.message || foldersError);
        return [];
    }

    if (!folders || folders.length === 0) {
        console.warn('⚠️ Nenhum workspace encontrado para o cliente:', clientId);
        return [];
    }

    // Busca os documentos de cada pasta (Admin vê tudo)
    const workspaceData = await Promise.all(
        (folders || []).map(async (folder) => {
            const { data: documents, error: docsError } = await supabase
                .from('documents')
                .select('*')
                .eq('client_id', clientId)
                .eq('category', folder.folder_name)
                .order('last_edit', { ascending: false });

            return {
                id: folder.id,
                folder_name: folder.folder_name,
                color: folder.color,
                documents: documents || []
            };
        })
    );

    return workspaceData;
}

export async function getPortalWorkspaces(clientId: string) {
    // Busca as pastas do workspace do cliente
    const { data: folders, error: foldersError } = await supabase
        .from('workspaces')
        .select('*')
        .eq('client_id', clientId)
        .order('order_position', { ascending: true })
        .order('folder_name', { ascending: true });

    if (foldersError) return [];

    // Busca apenas documentos visíveis (published ou analyzing)
    const workspaceData = await Promise.all(
        (folders || []).map(async (folder) => {
            const { data: documents, error: docsError } = await supabase
                .from('documents')
                .select('*')
                .eq('client_id', clientId)
                .eq('category', folder.folder_name)
                .in('status', ['published', 'analyzing'])
                .order('last_edit', { ascending: false });

            return {
                id: folder.id,
                folder_name: folder.folder_name,
                color: folder.color,
                documents: documents || []
            };
        })
    );

    return workspaceData;
}

export async function getClientById(clientId: string) {
    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

    if (error) {
        console.error('Erro ao buscar cliente:', error);
        return null;
    }

    return data;
}

// =====================================================
// FUNÇÕES DE DOCUMENTOS (FASE 3)
// =====================================================

export async function getDocumentById(documentId: string) {
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();

    if (error) {
        console.error('Erro ao buscar documento:', error);
        return null;
    }

    return data;
}

export async function createDocument(document: {
    client_id: string;
    category: string;
    title: string;
    content?: any;
    status?: string;
}) {
    const { data, error } = await supabase
        .from('documents')
        .insert({
            ...document,
            content: document.content || { type: 'doc', content: [] },
            status: document.status || 'draft',
            last_edit: new Date().toLocaleDateString('pt-BR'),
            created_by: 'admin'
        })
        .select()
        .single();

    if (error) {
        console.error('Erro ao criar documento:', error);
        throw error;
    }

    return data;
}

export async function updateDocument(documentId: string, updates: {
    title?: string;
    content?: any;
    status?: string;
    category?: string;
}) {
    const { data, error } = await supabase
        .from('documents')
        .update({
            ...updates,
            last_edit: new Date().toLocaleDateString('pt-BR'),
        })
        .eq('id', documentId)
        .select()
        .single();

    if (error) {
        console.error('Erro ao atualizar documento:', error);
        throw error;
    }

    return data;
}

export async function deleteDocument(documentId: string) {
    const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

    if (error) {
        console.error('Erro ao excluir documento:', error);
        throw error;
    }

    return true;
}

export async function getDocumentsByWorkspace(clientId: string, category: string) {
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('client_id', clientId)
        .eq('category', category)
        .order('last_edit', { ascending: false });

    if (error) {
        console.error('Erro ao buscar documentos:', error);
        return [];
    }

    return data || [];
}

// =====================================================
// COMPARTILHAMENTO E LINKS PÚBLICOS
// =====================================================

export async function shareDocument(documentId: string, clientId: string, options: {
    allow_comments?: boolean;
    allow_download?: boolean;
    expires_at?: string | null;
}) {
    // Gerar um link único aleatório (hash curto)
    const publicLink = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);

    const { data, error } = await supabase
        .from('shared_documents')
        .insert({
            document_id: documentId,
            client_id: clientId,
            public_link: publicLink,
            allow_comments: options.allow_comments || false,
            allow_download: options.allow_download || true,
            expires_at: options.expires_at || null,
            status: 'active'
        })
        .select()
        .single();

    if (error) {
        console.error('Erro ao compartilhar:', error);
        throw error;
    }

    // Atualiza flag no documento original
    await supabase.from('documents').update({ is_shared: true }).eq('id', documentId);

    return data;
}

export async function getSharedDocument(publicLink: string) {
    const { data, error } = await supabase
        .from('shared_documents')
        .select('*, documents(*)')
        .eq('public_link', publicLink)
        .eq('status', 'active')
        .single();

    if (error) {
        console.error('Erro ao buscar link público:', error);
        return null;
    }

    // Atualiza contador de visualizações
    await supabase
        .from('shared_documents')
        .update({
            views_count: (data.views_count || 0) + 1,
            last_viewed_at: new Date().toISOString()
        })
        .eq('id', data.id);

    return data;
}

// =====================================================
// TIMELINE DE ATIVIDADES
// =====================================================

export async function logActivity(clientId: string, action: string, entityType: string, entityId: string, metadata: any = {}) {
    const { error } = await supabase
        .from('activities')
        .insert({
            client_id: clientId,
            action,
            entity_type: entityType,
            entity_id: entityId,
            metadata
        });

    if (error) console.error('Erro ao registrar atividade:', error);
}

export async function getRecentActivities(clientId: string, limit = 20) {
    const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Erro ao buscar atividades:', error);
        return [];
    }

    return data;
}


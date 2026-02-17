-- =====================================================
-- FASE 3: EDITOR DE DOCUMENTOS + COMPARTILHAMENTO
-- =====================================================
-- Data: 2026-02-16
-- Descrição: Schema para editor rico, compartilhamento e portal do cliente

-- 1. ATUALIZAR TABELA DOCUMENTS
-- Adicionar campos para conteúdo rico e hierarquia
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS content JSONB DEFAULT '{"type":"doc","content":[]}',
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES documents(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_shared BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
ADD COLUMN IF NOT EXISTS created_by TEXT DEFAULT 'admin',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_documents_parent_id ON documents(parent_id);
CREATE INDEX IF NOT EXISTS idx_documents_client_id ON documents(client_id);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);

-- 2. TABELA DE USUÁRIOS (para portal do cliente)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'client' CHECK (role IN ('admin', 'client')),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Índices para users
CREATE INDEX IF NOT EXISTS idx_users_client_id ON users(client_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 3. TABELA DE DOCUMENTOS COMPARTILHADOS
CREATE TABLE IF NOT EXISTS shared_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    shared_by TEXT DEFAULT 'admin',
    shared_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP, -- NULL = nunca expira
    allow_comments BOOLEAN DEFAULT false,
    allow_download BOOLEAN DEFAULT true,
    notify_email BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
    public_link TEXT UNIQUE,
    views_count INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMP
);

-- Índices para shared_documents
CREATE INDEX IF NOT EXISTS idx_shared_docs_document_id ON shared_documents(document_id);
CREATE INDEX IF NOT EXISTS idx_shared_docs_client_id ON shared_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_shared_docs_public_link ON shared_documents(public_link);

-- 4. TABELA DE COMENTÁRIOS
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- Para respostas
    is_resolved BOOLEAN DEFAULT false
);

-- Índices para comments
CREATE INDEX IF NOT EXISTS idx_comments_document_id ON comments(document_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);

-- 5. TABELA DE ATIVIDADES (Timeline)
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- 'document_created', 'document_shared', 'comment_added', etc.
    entity_type TEXT, -- 'document', 'comment', 'workspace', etc.
    entity_id UUID,
    metadata JSONB, -- Dados adicionais da ação
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para activities
CREATE INDEX IF NOT EXISTS idx_activities_client_id ON activities(client_id);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC);

-- 6. TABELA DE PERMISSÕES (para controle fino de acesso)
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    resource_type TEXT NOT NULL, -- 'document', 'workspace', 'client'
    resource_id UUID NOT NULL,
    permission TEXT NOT NULL CHECK (permission IN ('view', 'edit', 'delete', 'share')),
    granted_at TIMESTAMP DEFAULT NOW(),
    granted_by TEXT,
    UNIQUE(user_id, resource_type, resource_id, permission)
);

-- Índices para permissions
CREATE INDEX IF NOT EXISTS idx_permissions_user_id ON permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_permissions_resource ON permissions(resource_type, resource_id);

-- 7. FUNÇÃO PARA ATUALIZAR updated_at AUTOMATICAMENTE
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para documents
DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para comments
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 8. FUNÇÃO PARA REGISTRAR ATIVIDADES AUTOMATICAMENTE
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO activities (client_id, action, entity_type, entity_id, metadata)
        VALUES (
            NEW.client_id,
            TG_TABLE_NAME || '_created',
            TG_TABLE_NAME,
            NEW.id,
            row_to_json(NEW)
        );
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO activities (client_id, action, entity_type, entity_id, metadata)
        VALUES (
            NEW.client_id,
            TG_TABLE_NAME || '_updated',
            TG_TABLE_NAME,
            NEW.id,
            row_to_json(NEW)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para documents
DROP TRIGGER IF EXISTS log_document_activity ON documents;
CREATE TRIGGER log_document_activity
    AFTER INSERT OR UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION log_activity();

-- 9. VIEWS ÚTEIS

-- View de documentos com informações de compartilhamento
CREATE OR REPLACE VIEW documents_with_sharing AS
SELECT 
    d.*,
    sd.id as share_id,
    sd.shared_at,
    sd.allow_comments,
    sd.allow_download,
    sd.public_link,
    sd.views_count,
    sd.status as share_status
FROM documents d
LEFT JOIN shared_documents sd ON d.id = sd.document_id AND sd.status = 'active';

-- View de atividades recentes por cliente
CREATE OR REPLACE VIEW recent_activities AS
SELECT 
    a.*,
    c.name as client_name,
    u.name as user_name
FROM activities a
LEFT JOIN clients c ON a.client_id = c.id
LEFT JOIN users u ON a.user_id = u.id
ORDER BY a.created_at DESC;

-- 10. SEED DATA PARA USUÁRIO ADMIN
INSERT INTO users (email, password_hash, name, role)
VALUES (
    'stela@rv.com',
    '$2a$10$example_hash_here', -- Você vai precisar gerar um hash real
    'Stela Rodrigues',
    'admin'
)
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE documents IS 'Documentos criados no editor. Suporta conteúdo rico em JSON e hierarquia de páginas.';
COMMENT ON COLUMN documents.content IS 'Conteúdo do documento em formato Tiptap JSON';
COMMENT ON COLUMN documents.parent_id IS 'ID do documento pai para criar hierarquia (subpáginas)';
COMMENT ON COLUMN documents.is_shared IS 'Flag rápida para saber se o documento está compartilhado';

COMMENT ON TABLE users IS 'Usuários do sistema (admin e clientes que acessam o portal)';
COMMENT ON COLUMN users.role IS 'Tipo de usuário: admin (Stela) ou client (cliente que acessa portal)';

COMMENT ON TABLE shared_documents IS 'Controle de compartilhamento de documentos com clientes';
COMMENT ON COLUMN shared_documents.public_link IS 'Link público único para acessar o documento';
COMMENT ON COLUMN shared_documents.expires_at IS 'Data de expiração do compartilhamento (NULL = nunca expira)';

COMMENT ON TABLE comments IS 'Comentários em documentos compartilhados';
COMMENT ON COLUMN comments.parent_id IS 'ID do comentário pai para criar threads de respostas';

COMMENT ON TABLE activities IS 'Log de atividades para timeline do cliente';
COMMENT ON COLUMN activities.metadata IS 'Dados adicionais da ação em formato JSON';

COMMENT ON TABLE permissions IS 'Controle granular de permissões por recurso';

-- =====================================================
-- FIM DO SCHEMA FASE 3
-- =====================================================

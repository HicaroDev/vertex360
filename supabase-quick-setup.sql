-- =====================================================
-- CONFIGURAÇÃO RÁPIDA - FASE 3
-- =====================================================
-- Execute este arquivo COMPLETO de uma vez no SQL Editor do Supabase
-- Ou execute passo a passo seguindo o SUPABASE-SETUP-GUIDE.md

-- =====================================================
-- PASSO 1: ATUALIZAR TABELA DOCUMENTS
-- =====================================================

ALTER TABLE documents
ADD COLUMN IF NOT EXISTS content JSONB DEFAULT '{"type":"doc","content":[]}',
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES documents(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_shared BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS created_by TEXT DEFAULT 'admin',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_documents_parent_id ON documents(parent_id);
CREATE INDEX IF NOT EXISTS idx_documents_client_id ON documents(client_id);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);

-- =====================================================
-- PASSO 2: CRIAR TABELA USERS
-- =====================================================

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

CREATE INDEX IF NOT EXISTS idx_users_client_id ON users(client_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =====================================================
-- PASSO 3: CRIAR TABELA SHARED_DOCUMENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS shared_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    shared_by TEXT DEFAULT 'admin',
    shared_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    allow_comments BOOLEAN DEFAULT false,
    allow_download BOOLEAN DEFAULT true,
    notify_email BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
    public_link TEXT UNIQUE,
    views_count INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_shared_docs_document_id ON shared_documents(document_id);
CREATE INDEX IF NOT EXISTS idx_shared_docs_client_id ON shared_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_shared_docs_public_link ON shared_documents(public_link);

-- =====================================================
-- PASSO 4: CRIAR TABELA COMMENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    is_resolved BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_comments_document_id ON comments(document_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);

-- =====================================================
-- PASSO 5: CRIAR TABELA ACTIVITIES
-- =====================================================

CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activities_client_id ON activities(client_id);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC);

-- =====================================================
-- PASSO 6: CRIAR TABELA PERMISSIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    resource_type TEXT NOT NULL,
    resource_id UUID NOT NULL,
    permission TEXT NOT NULL CHECK (permission IN ('view', 'edit', 'delete', 'share')),
    granted_at TIMESTAMP DEFAULT NOW(),
    granted_by TEXT,
    UNIQUE(user_id, resource_type, resource_id, permission)
);

CREATE INDEX IF NOT EXISTS idx_permissions_user_id ON permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_permissions_resource ON permissions(resource_type, resource_id);

-- =====================================================
-- PASSO 7: CRIAR FUNÇÕES E TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VALIDAÇÃO: Execute este SELECT para verificar
-- =====================================================

SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE columns.table_name = tables.table_name) as total_colunas
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('documents', 'users', 'shared_documents', 'comments', 'activities', 'permissions')
ORDER BY table_name;

-- Resultado esperado:
-- activities: 8 colunas
-- comments: 8 colunas
-- documents: 13+ colunas
-- permissions: 7 colunas
-- shared_documents: 13 colunas
-- users: 10 colunas

-- =====================================================
-- FIM - CONFIGURAÇÃO COMPLETA!
-- =====================================================

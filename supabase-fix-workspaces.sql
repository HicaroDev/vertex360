-- =====================================================
-- CORREÇÃO: Adicionar campo 'order_position' e garantir 'color'
-- =====================================================

-- Adicionar coluna 'color' se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'workspaces' AND column_name = 'color'
    ) THEN
        ALTER TABLE workspaces ADD COLUMN color TEXT DEFAULT 'text-blue-500';
    END IF;
END $$;

-- Adicionar coluna 'order_position' para ordenação
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'workspaces' AND column_name = 'order_position'
    ) THEN
        ALTER TABLE workspaces ADD COLUMN order_position INTEGER DEFAULT 0;
    END IF;
END $$;

-- Adicionar coluna 'order_position' em documents para ordenação
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'documents' AND column_name = 'order_position'
    ) THEN
        ALTER TABLE documents ADD COLUMN order_position INTEGER DEFAULT 0;
    END IF;
END $$;

-- Atualizar order_position dos workspaces existentes
UPDATE workspaces 
SET order_position = row_number 
FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY client_id ORDER BY created_at) as row_number
    FROM workspaces
) as numbered
WHERE workspaces.id = numbered.id;

-- Atualizar order_position dos documentos existentes
UPDATE documents 
SET order_position = row_number 
FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY workspace_id ORDER BY created_at) as row_number
    FROM documents
) as numbered
WHERE documents.id = numbered.id;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_workspaces_order ON workspaces(client_id, order_position);
CREATE INDEX IF NOT EXISTS idx_documents_order ON documents(workspace_id, order_position);

-- Mensagem de sucesso
SELECT 'Schema atualizado com sucesso! Agora você pode reordenar workspaces e documentos.' as message;

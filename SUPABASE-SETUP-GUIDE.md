# 📋 GUIA PASSO A PASSO: CONFIGURAÇÃO SUPABASE FASE 3

**Data:** 2026-02-16  
**Objetivo:** Configurar banco de dados para Editor de Documentos

---

## ✅ CHECKLIST GERAL

- [ ] Passo 1: Backup do banco (segurança)
- [ ] Passo 2: Atualizar tabela `documents`
- [ ] Passo 3: Criar tabela `users`
- [ ] Passo 4: Criar tabela `shared_documents`
- [ ] Passo 5: Criar tabela `comments`
- [ ] Passo 6: Criar tabela `activities`
- [ ] Passo 7: Criar tabela `permissions`
- [ ] Passo 8: Criar triggers e funções
- [ ] Passo 9: Validar tudo

---

## 🚀 PASSO 1: BACKUP (SEGURANÇA)

### **O que fazer:**
1. Acesse o Supabase Dashboard
2. Vá em **Database** → **Backups**
3. Clique em **Create Backup**
4. Aguarde confirmação

### **Por que:**
Caso algo dê errado, você pode restaurar.

### **Validação:**
✅ Backup criado com sucesso

---

## 🗄️ PASSO 2: ATUALIZAR TABELA `documents`

### **O que fazer:**
1. Acesse **SQL Editor** no Supabase
2. Cole o código abaixo:

```sql
-- PASSO 2: Atualizar tabela documents
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS content JSONB DEFAULT '{"type":"doc","content":[]}',
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES documents(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_shared BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS created_by TEXT DEFAULT 'admin',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_documents_parent_id ON documents(parent_id);
CREATE INDEX IF NOT EXISTS idx_documents_client_id ON documents(client_id);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
```

3. Clique em **RUN** (ou Ctrl+Enter)
4. Aguarde mensagem de sucesso

### **Validação:**
Execute este comando para verificar:

```sql
-- VALIDAÇÃO PASSO 2
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'documents' 
ORDER BY ordinal_position;
```

**Resultado esperado:** Você deve ver as colunas:
- `content` (jsonb)
- `parent_id` (uuid)
- `order_index` (integer)
- `is_shared` (boolean)
- `status` (text)
- `created_by` (text)
- `updated_at` (timestamp)

✅ **Se viu todas as colunas, PASSO 2 COMPLETO!**

---

## 👥 PASSO 3: CRIAR TABELA `users`

### **O que fazer:**
Cole e execute:

```sql
-- PASSO 3: Criar tabela users
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

-- Índices
CREATE INDEX IF NOT EXISTS idx_users_client_id ON users(client_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Comentários
COMMENT ON TABLE users IS 'Usuários do sistema (admin e clientes que acessam o portal)';
COMMENT ON COLUMN users.role IS 'Tipo de usuário: admin (Stela) ou client (cliente que acessa portal)';
```

### **Validação:**
```sql
-- VALIDAÇÃO PASSO 3
SELECT COUNT(*) as total_colunas 
FROM information_schema.columns 
WHERE table_name = 'users';
```

**Resultado esperado:** `total_colunas = 10`

✅ **Se retornou 10, PASSO 3 COMPLETO!**

---

## 📤 PASSO 4: CRIAR TABELA `shared_documents`

### **O que fazer:**
Cole e execute:

```sql
-- PASSO 4: Criar tabela shared_documents
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

-- Índices
CREATE INDEX IF NOT EXISTS idx_shared_docs_document_id ON shared_documents(document_id);
CREATE INDEX IF NOT EXISTS idx_shared_docs_client_id ON shared_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_shared_docs_public_link ON shared_documents(public_link);

-- Comentários
COMMENT ON TABLE shared_documents IS 'Controle de compartilhamento de documentos com clientes';
COMMENT ON COLUMN shared_documents.public_link IS 'Link público único para acessar o documento';
COMMENT ON COLUMN shared_documents.expires_at IS 'Data de expiração do compartilhamento (NULL = nunca expira)';
```

### **Validação:**
```sql
-- VALIDAÇÃO PASSO 4
SELECT COUNT(*) as total_colunas 
FROM information_schema.columns 
WHERE table_name = 'shared_documents';
```

**Resultado esperado:** `total_colunas = 13`

✅ **Se retornou 13, PASSO 4 COMPLETO!**

---

## 💬 PASSO 5: CRIAR TABELA `comments`

### **O que fazer:**
Cole e execute:

```sql
-- PASSO 5: Criar tabela comments
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

-- Índices
CREATE INDEX IF NOT EXISTS idx_comments_document_id ON comments(document_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);

-- Comentários
COMMENT ON TABLE comments IS 'Comentários em documentos compartilhados';
COMMENT ON COLUMN comments.parent_id IS 'ID do comentário pai para criar threads de respostas';
```

### **Validação:**
```sql
-- VALIDAÇÃO PASSO 5
SELECT COUNT(*) as total_colunas 
FROM information_schema.columns 
WHERE table_name = 'comments';
```

**Resultado esperado:** `total_colunas = 8`

✅ **Se retornou 8, PASSO 5 COMPLETO!**

---

## 📊 PASSO 6: CRIAR TABELA `activities`

### **O que fazer:**
Cole e execute:

```sql
-- PASSO 6: Criar tabela activities
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

-- Índices
CREATE INDEX IF NOT EXISTS idx_activities_client_id ON activities(client_id);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC);

-- Comentários
COMMENT ON TABLE activities IS 'Log de atividades para timeline do cliente';
COMMENT ON COLUMN activities.metadata IS 'Dados adicionais da ação em formato JSON';
```

### **Validação:**
```sql
-- VALIDAÇÃO PASSO 6
SELECT COUNT(*) as total_colunas 
FROM information_schema.columns 
WHERE table_name = 'activities';
```

**Resultado esperado:** `total_colunas = 8`

✅ **Se retornou 8, PASSO 6 COMPLETO!**

---

## 🔒 PASSO 7: CRIAR TABELA `permissions`

### **O que fazer:**
Cole e execute:

```sql
-- PASSO 7: Criar tabela permissions
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

-- Índices
CREATE INDEX IF NOT EXISTS idx_permissions_user_id ON permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_permissions_resource ON permissions(resource_type, resource_id);

-- Comentários
COMMENT ON TABLE permissions IS 'Controle granular de permissões por recurso';
```

### **Validação:**
```sql
-- VALIDAÇÃO PASSO 7
SELECT COUNT(*) as total_colunas 
FROM information_schema.columns 
WHERE table_name = 'permissions';
```

**Resultado esperado:** `total_colunas = 7`

✅ **Se retornou 7, PASSO 7 COMPLETO!**

---

## ⚙️ PASSO 8: CRIAR TRIGGERS E FUNÇÕES

### **O que fazer:**
Cole e execute:

```sql
-- PASSO 8A: Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PASSO 8B: Trigger para documents
DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- PASSO 8C: Trigger para comments
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### **Validação:**
```sql
-- VALIDAÇÃO PASSO 8
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_name LIKE '%updated_at%';
```

**Resultado esperado:** Você deve ver:
- `update_documents_updated_at` na tabela `documents`
- `update_comments_updated_at` na tabela `comments`

✅ **Se viu os 2 triggers, PASSO 8 COMPLETO!**

---

## ✅ PASSO 9: VALIDAÇÃO FINAL

### **Teste Completo:**
Cole e execute:

```sql
-- VALIDAÇÃO FINAL: Verificar todas as tabelas
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE columns.table_name = tables.table_name) as total_colunas
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('documents', 'users', 'shared_documents', 'comments', 'activities', 'permissions')
ORDER BY table_name;
```

### **Resultado Esperado:**

| table_name | total_colunas |
|------------|---------------|
| activities | 8 |
| comments | 8 |
| documents | 13+ (depende das colunas antigas) |
| permissions | 7 |
| shared_documents | 13 |
| users | 10 |

### **Teste de Inserção:**
Vamos testar se conseguimos criar um documento com conteúdo:

```sql
-- TESTE: Criar documento de teste
INSERT INTO documents (client_id, category, title, content, status)
VALUES (
    (SELECT id FROM clients LIMIT 1),
    'Teste',
    'Documento de Teste - Editor',
    '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Teste do Editor"}]},{"type":"paragraph","content":[{"type":"text","text":"Este é um teste do editor Tiptap."}]}]}',
    'draft'
)
RETURNING id, title, status, content;
```

**Resultado esperado:** Deve retornar o documento criado com o JSON no campo `content`.

### **Limpar teste:**
```sql
-- LIMPAR: Remover documento de teste
DELETE FROM documents WHERE title = 'Documento de Teste - Editor';
```

---

## 🎉 CONCLUSÃO

Se TODOS os passos retornaram os resultados esperados:

✅ **BANCO DE DADOS CONFIGURADO COM SUCESSO!**

Agora você pode:
1. Acessar `http://localhost:3000/admin/clients/1`
2. Clicar em "Novo Documento"
3. Criar e editar documentos com o editor rico!

---

## ⚠️ TROUBLESHOOTING

### **Erro: "column already exists"**
**Solução:** Tudo bem! Significa que a coluna já existe. Continue para o próximo passo.

### **Erro: "relation already exists"**
**Solução:** Tudo bem! A tabela já existe. Continue para o próximo passo.

### **Erro: "permission denied"**
**Solução:** Você precisa de permissões de admin no Supabase. Verifique se está logado com a conta correta.

### **Erro: "foreign key violation"**
**Solução:** Certifique-se de que as tabelas `clients` e `documents` existem antes de executar os passos.

---

## 📞 SUPORTE

Se algum passo falhar:
1. Anote o número do passo
2. Copie a mensagem de erro completa
3. Me avise e eu te ajudo!

---

**Última Atualização:** 2026-02-16 21:35  
**Versão:** 1.0

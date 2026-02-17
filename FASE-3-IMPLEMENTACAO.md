# 📝 FASE 3: EDITOR DE DOCUMENTOS + COMPARTILHAMENTO

**Data de Início:** 2026-02-16  
**Status:** 🔄 Em Implementação (**Editor PRO Estabilizado!**)  
**Progresso:** 25%

---

### 🚀 Últimas Atualizações (17/02/2026)
- ✅ **Editor Pro Totalmente Funcional**: Toolbar sticky, imagens redimensionáveis, z-index corrigido.
- ✅ **Bug Fixes**: Removidos erros de BubbleMenu e problemas de layout (estouro lateral).
- ✅ **Documentação**: Criado guia técnico da implementação do editor.

---

## 🎯 Objetivo

Criar um sistema completo de edição e compartilhamento de documentos onde a Stela pode:

1. ✅ **Criar documentos** dentro dos workspaces de cada cliente
2. ✅ **Editar documentos** com editor rico (estilo Notion)
3. ✅ **Adicionar checkboxes** para To-Do lists
4. ✅ **Compartilhar documentos** com clientes via link
5. ✅ **Controlar permissões** (comentários, download)
6. ✅ **Visualizar atividades** (timeline)

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    FASE 3 - COMPONENTES                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────┐      ┌─────────────────────┐      │
│  │   ADMIN (Stela)     │      │  PORTAL (Cliente)   │      │
│  ├─────────────────────┤      ├─────────────────────┤      │
│  │                     │      │                     │      │
│  │ 1. Editor           │      │ 1. Visualizador     │      │
│  │    • Tiptap         │      │    • Read-only      │      │
│  │    • Toolbar        │      │    • Comentários    │      │
│  │    • Auto-save      │      │    • Download       │      │
│  │                     │      │                     │      │
│  │ 2. Compartilhar     │      │ 2. Timeline         │      │
│  │    • Modal          │      │    • Atividades     │      │
│  │    • Permissões     │      │    • Histórico      │      │
│  │    • Link público   │      │                     │      │
│  │                     │      │                     │      │
│  │ 3. Gestão Docs      │      │ 3. Notificações     │      │
│  │    • Criar          │      │    • Novos docs     │      │
│  │    • Editar         │      │    • Comentários    │      │
│  │    • Excluir        │      │                     │      │
│  │    • Organizar      │      │                     │      │
│  └─────────────────────┘      └─────────────────────┘      │
│           ▲                              ▲                   │
│           │                              │                   │
│           └──────────┬───────────────────┘                   │
│                      │                                       │
│              ┌───────▼────────┐                             │
│              │   SUPABASE DB  │                             │
│              ├────────────────┤                             │
│              │ • documents    │ ← content (JSONB)           │
│              │ • shared_docs  │ ← NOVO!                     │
│              │ • users        │ ← NOVO!                     │
│              │ • comments     │ ← NOVO!                     │
│              │ • activities   │ ← NOVO!                     │
│              │ • permissions  │ ← NOVO!                     │
│              └────────────────┘                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Tecnologias Utilizadas

### **1. Tiptap** (Editor de Texto Rico)
- **Versão:** Latest
- **Descrição:** Editor WYSIWYG moderno baseado em ProseMirror
- **Por que?** 
  - React-friendly
  - Extensível
  - Suporta markdown
  - Leve e performático
  - Usado por empresas como GitLab, Substack

**Extensões instaladas:**
```bash
@tiptap/react              # Core React
@tiptap/starter-kit        # Extensões básicas (bold, italic, headings, etc.)
@tiptap/extension-task-list    # Listas de tarefas
@tiptap/extension-task-item    # Itens de tarefa (checkboxes)
@tiptap/extension-placeholder  # Placeholder text
@tiptap/extension-link         # Links
```

### **2. Supabase** (Banco de Dados)
- **Tabelas Novas:**
  - `users` - Usuários (admin + clientes)
  - `shared_documents` - Controle de compartilhamento
  - `comments` - Comentários em documentos
  - `activities` - Log de atividades
  - `permissions` - Controle de permissões

- **Tabelas Atualizadas:**
  - `documents` - Adicionado campo `content` (JSONB)

---

## 🗄️ Schema do Banco

### **Tabela: `documents`** (Atualizada)

```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY,
    client_id UUID REFERENCES clients(id),
    category TEXT,
    title TEXT,
    last_edit TEXT,
    
    -- NOVOS CAMPOS FASE 3:
    content JSONB,              -- Conteúdo do editor em JSON
    parent_id UUID,             -- Para hierarquia (subpáginas)
    order_index INTEGER,        -- Ordem de exibição
    is_shared BOOLEAN,          -- Flag de compartilhamento
    status TEXT,                -- 'draft', 'published', 'archived'
    created_by TEXT,            -- Quem criou
    updated_at TIMESTAMP        -- Última atualização
);
```

**Exemplo de `content` (JSON):**
```json
{
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": { "level": 1 },
      "content": [{ "type": "text", "text": "Ata de Reunião - 15/02/2026" }]
    },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Participantes: " },
        { "type": "text", "marks": [{ "type": "bold" }], "text": "Stela, João" }
      ]
    },
    {
      "type": "taskList",
      "content": [
        {
          "type": "taskItem",
          "attrs": { "checked": false },
          "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Finalizar diagnóstico Fase 1" }] }]
        },
        {
          "type": "taskItem",
          "attrs": { "checked": true },
          "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Revisar precificação" }] }]
        }
      ]
    }
  ]
}
```

### **Tabela: `shared_documents`** (Nova)

```sql
CREATE TABLE shared_documents (
    id UUID PRIMARY KEY,
    document_id UUID REFERENCES documents(id),
    client_id UUID REFERENCES clients(id),
    shared_by TEXT,             -- Quem compartilhou
    shared_at TIMESTAMP,        -- Quando compartilhou
    expires_at TIMESTAMP,       -- Expiração (NULL = nunca)
    allow_comments BOOLEAN,     -- Permitir comentários?
    allow_download BOOLEAN,     -- Permitir download?
    notify_email BOOLEAN,       -- Notificar por email?
    status TEXT,                -- 'active', 'revoked'
    public_link TEXT UNIQUE,    -- Link público único
    views_count INTEGER,        -- Contador de visualizações
    last_viewed_at TIMESTAMP    -- Última visualização
);
```

### **Tabela: `users`** (Nova)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    client_id UUID REFERENCES clients(id),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT,                  -- 'admin' ou 'client'
    avatar_url TEXT,
    created_at TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN
);
```

### **Tabela: `comments`** (Nova)

```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY,
    document_id UUID REFERENCES documents(id),
    user_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    parent_id UUID,             -- Para respostas (threads)
    is_resolved BOOLEAN
);
```

### **Tabela: `activities`** (Nova)

```sql
CREATE TABLE activities (
    id UUID PRIMARY KEY,
    client_id UUID REFERENCES clients(id),
    user_id UUID REFERENCES users(id),
    action TEXT NOT NULL,       -- 'document_created', 'document_shared', etc.
    entity_type TEXT,           -- 'document', 'comment', etc.
    entity_id UUID,
    metadata JSONB,             -- Dados adicionais
    created_at TIMESTAMP
);
```

---

## 🎨 Componentes a Criar

### **1. DocumentEditor** (Componente Principal)

**Localização:** `src/components/DocumentEditor.tsx`

**Props:**
```typescript
interface DocumentEditorProps {
    documentId?: string;        // ID do documento (se editando)
    clientId: string;           // ID do cliente
    workspaceId: string;        // ID do workspace
    initialContent?: JSONContent; // Conteúdo inicial
    onSave?: (content: JSONContent) => void;
    autoSave?: boolean;         // Auto-save a cada 2s
}
```

**Funcionalidades:**
- ✅ Editor rico com Tiptap
- ✅ Toolbar com formatações (bold, italic, headings, lists)
- ✅ Checkboxes para To-Do
- ✅ Auto-save a cada 2 segundos
- ✅ Indicador de salvamento ("Salvando...", "Salvo")
- ✅ Suporte a markdown shortcuts

**Exemplo de uso:**
```tsx
<DocumentEditor
    documentId="abc-123"
    clientId="client-1"
    workspaceId="workspace-1"
    autoSave={true}
    onSave={(content) => console.log('Saved!', content)}
/>
```

---

### **2. ShareDocumentModal** (Modal de Compartilhamento)

**Localização:** `src/components/ShareDocumentModal.tsx`

**Props:**
```typescript
interface ShareDocumentModalProps {
    documentId: string;
    isOpen: boolean;
    onClose: () => void;
}
```

**Funcionalidades:**
- ✅ Gerar link público único
- ✅ Configurar permissões:
  - ☐ Permitir comentários
  - ☐ Permitir download
  - ☐ Notificar cliente por email
- ✅ Definir data de expiração (opcional)
- ✅ Copiar link para clipboard
- ✅ Revogar compartilhamento

**UI:**
```
┌────────────────────────────────────┐
│ 📤 Compartilhar Documento          │
├────────────────────────────────────┤
│                                    │
│ Link Público:                      │
│ ┌────────────────────────────────┐ │
│ │ portal.rv.com/doc/abc123  [📋] │ │
│ └────────────────────────────────┘ │
│                                    │
│ Permissões:                        │
│ ☐ Permitir comentários            │
│ ☑ Permitir download                │
│ ☑ Notificar por email              │
│                                    │
│ Expiração:                         │
│ ○ Nunca                            │
│ ○ 7 dias                           │
│ ○ 30 dias                          │
│ ● Personalizado: [__/__/____]     │
│                                    │
│ [Cancelar]  [Compartilhar]         │
└────────────────────────────────────┘
```

---

### **3. DocumentViewer** (Visualizador Read-Only)

**Localização:** `src/components/DocumentViewer.tsx`

**Props:**
```typescript
interface DocumentViewerProps {
    content: JSONContent;
    allowComments?: boolean;
    allowDownload?: boolean;
}
```

**Funcionalidades:**
- ✅ Renderizar conteúdo do Tiptap em modo read-only
- ✅ Seção de comentários (se permitido)
- ✅ Botão de download (se permitido)
- ✅ Contador de visualizações

---

### **4. CommentSection** (Seção de Comentários)

**Localização:** `src/components/CommentSection.tsx`

**Props:**
```typescript
interface CommentSectionProps {
    documentId: string;
    userId: string;
    allowReplies?: boolean;
}
```

**Funcionalidades:**
- ✅ Listar comentários
- ✅ Adicionar novo comentário
- ✅ Responder comentários (threads)
- ✅ Marcar como resolvido
- ✅ Editar/excluir próprios comentários

---

### **5. ActivityTimeline** (Timeline de Atividades)

**Localização:** `src/components/ActivityTimeline.tsx`

**Props:**
```typescript
interface ActivityTimelineProps {
    clientId: string;
    limit?: number;
}
```

**Funcionalidades:**
- ✅ Listar atividades recentes
- ✅ Ícones por tipo de ação
- ✅ Timestamp relativo ("há 2 horas")
- ✅ Link para recurso relacionado

**UI:**
```
┌────────────────────────────────────┐
│ 📊 Timeline de Atividades          │
├────────────────────────────────────┤
│                                    │
│ 📄 Documento criado                │
│    "Ata de Reunião - 15/02"        │
│    há 2 horas                      │
│                                    │
│ 📤 Documento compartilhado         │
│    "Diagnóstico Fase 1"            │
│    há 1 dia                        │
│                                    │
│ 💬 Comentário adicionado           │
│    em "Plano de Ação"              │
│    há 3 dias                       │
│                                    │
└────────────────────────────────────┘
```

---

## 📁 Estrutura de Arquivos

```
rv-portal/
├── src/
│   ├── components/
│   │   ├── DocumentEditor.tsx          ← NOVO
│   │   ├── ShareDocumentModal.tsx      ← NOVO
│   │   ├── DocumentViewer.tsx          ← NOVO
│   │   ├── CommentSection.tsx          ← NOVO
│   │   ├── ActivityTimeline.tsx        ← NOVO
│   │   └── Toolbar.tsx                 ← NOVO (toolbar do editor)
│   │
│   ├── app/
│   │   ├── (admin)/
│   │   │   └── admin/
│   │   │       └── clients/
│   │   │           └── [id]/
│   │   │               ├── documents/
│   │   │               │   ├── page.tsx           ← Lista de documentos
│   │   │               │   ├── new/
│   │   │               │   │   └── page.tsx       ← Criar documento
│   │   │               │   └── [docId]/
│   │   │               │       ├── page.tsx       ← Editar documento
│   │   │               │       └── share/
│   │   │               │           └── page.tsx   ← Compartilhar
│   │   │               └── page.tsx (já existe)
│   │   │
│   │   └── (portal)/                              ← NOVO (portal do cliente)
│   │       └── portal/
│   │           ├── dashboard/
│   │           │   └── page.tsx
│   │           ├── documents/
│   │           │   ├── page.tsx
│   │           │   └── [docId]/
│   │           │       └── page.tsx
│   │           └── timeline/
│   │               └── page.tsx
│   │
│   └── lib/
│       ├── editor.ts                              ← NOVO (helpers do editor)
│       ├── sharing.ts                             ← NOVO (lógica de compartilhamento)
│       └── database.ts (já existe, atualizar)
│
├── supabase-phase3-schema.sql                     ← NOVO
└── FASE-3-EDITOR-NOTION.md                        ← Este arquivo
```

---

## 🚀 Plano de Implementação

### **Sprint 1: Editor Básico** (4-6 horas)
- [x] Instalar Tiptap e extensões
- [ ] Criar componente `DocumentEditor`
- [ ] Implementar toolbar básica
- [ ] Adicionar auto-save
- [ ] Atualizar `database.ts` com funções de salvar/carregar
- [ ] Criar página `/admin/clients/[id]/documents/new`
- [ ] Criar página `/admin/clients/[id]/documents/[docId]`

### **Sprint 2: Compartilhamento** (3-4 horas)
- [ ] Criar tabela `shared_documents` no Supabase
- [ ] Criar componente `ShareDocumentModal`
- [ ] Implementar geração de link público
- [ ] Implementar controle de permissões
- [ ] Adicionar botão "Compartilhar" na página de edição
- [ ] Criar funções de compartilhamento em `sharing.ts`

### **Sprint 3: Visualização (Portal)** (3-4 horas)
- [ ] Criar layout do portal (`/portal`)
- [ ] Criar componente `DocumentViewer`
- [ ] Criar página `/portal/documents/[docId]`
- [ ] Implementar contador de visualizações
- [ ] Adicionar download de PDF (se permitido)

### **Sprint 4: Comentários** (2-3 horas)
- [ ] Criar tabela `comments` no Supabase
- [ ] Criar componente `CommentSection`
- [ ] Implementar adicionar comentário
- [ ] Implementar threads (respostas)
- [ ] Adicionar notificações de novos comentários

### **Sprint 5: Timeline** (2-3 horas)
- [ ] Criar tabela `activities` no Supabase
- [ ] Criar triggers para log automático
- [ ] Criar componente `ActivityTimeline`
- [ ] Adicionar à página de detalhes do cliente
- [ ] Implementar filtros (tipo de ação, data)

### **Sprint 6: Autenticação** (3-4 horas)
- [ ] Criar tabela `users` no Supabase
- [ ] Implementar hash de senha (bcrypt)
- [ ] Criar página de login (`/portal/login`)
- [ ] Implementar middleware de autenticação
- [ ] Criar sessões com cookies

---

## ⚙️ Configurações Necessárias

### **1. Executar SQL no Supabase**
```bash
# Copiar conteúdo de supabase-phase3-schema.sql
# Colar no SQL Editor do Supabase Dashboard
# Executar
```

### **2. Variáveis de Ambiente**
Adicionar ao `.env.local`:
```env
# Já existentes
NEXT_PUBLIC_SUPABASE_URL=https://zztpwoqgyibnafmzpjhk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Novas para Fase 3
NEXT_PUBLIC_PORTAL_URL=http://localhost:3000/portal
NEXTAUTH_SECRET=your-secret-here  # Para autenticação
NEXTAUTH_URL=http://localhost:3000
```

---

## 📊 Métricas de Sucesso

| Métrica | Meta |
|---------|------|
| **Tempo de carregamento do editor** | < 500ms |
| **Auto-save** | A cada 2s |
| **Geração de link** | < 100ms |
| **Visualização de documento** | < 300ms |
| **Adicionar comentário** | < 200ms |

---

## 🎯 Resultado Esperado

Ao final da Fase 3, a Stela terá:

1. ✅ **Editor completo** para criar atas, diagnósticos, relatórios
2. ✅ **Sistema de compartilhamento** para enviar documentos aos clientes
3. ✅ **Portal do cliente** onde eles podem ver documentos compartilhados
4. ✅ **Sistema de comentários** para feedback dos clientes
5. ✅ **Timeline de atividades** para acompanhar o histórico

---

## 📝 Próximos Passos (Fase 4)

- [ ] Notificações em tempo real (Supabase Realtime)
- [ ] Upload de arquivos/imagens
- [ ] Exportar para PDF
- [ ] Versionamento de documentos
- [ ] Colaboração em tempo real (múltiplos editores)
- [ ] Templates de documentos
- [ ] Assinatura digital

---

**Última Atualização:** 2026-02-16 21:20  
**Próxima Revisão:** Após Sprint 1

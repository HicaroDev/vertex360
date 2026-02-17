# 🎯 FASE 3: EDITOR NOTION-LIKE

## 📋 Objetivo

Criar um sistema completo de edição de documentos estilo Notion onde a Stela pode:
- ✅ Criar e editar documentos dentro de cada workspace
- ✅ Escrever conteúdo rico (títulos, parágrafos, listas)
- ✅ Adicionar checkboxes para To-Do lists
- ✅ Criar hierarquia de páginas (subpáginas)
- ✅ Salvar tudo no Supabase em tempo real

---

## 🗂️ Estrutura Atual do Notion da Stela

### Clientes (9 total):
1. Ferreira Logística e Distribuidora
2. Brutha Construtora
3. Família Alimentos
4. Invernadeiros
5. Pitanga Doce
6. SEE Energia
7. Trauen Autohaus
8. Clientes Prospectados
9. Pasta Modelo

### Estrutura da Ferreira (exemplo):
```
Ferreira Logística e Distribuidora/
├── Dados Empresa/
├── Reuniões - Ferreira Distribuidora/
├── Diagnóstico - Ferreira Distribuidora/
├── Apresentação e Estruturação/
└── Desenvolvimento/
```

Cada uma dessas pastas é um **workspace** que contém **documentos**.

---

## 🎨 Funcionalidades Necessárias

### 1. **Editor de Documentos** (Prioridade ALTA)
- [ ] Editor de texto rico (Markdown ou WYSIWYG)
- [ ] Suporte a:
  - [ ] Títulos (H1, H2, H3)
  - [ ] Parágrafos
  - [ ] Listas (ordenadas e não-ordenadas)
  - [ ] Checkboxes (To-Do)
  - [ ] Links
  - [ ] Negrito, itálico
- [ ] Salvar automaticamente no Supabase
- [ ] Histórico de versões

### 2. **Gestão de Documentos** (Prioridade ALTA)
- [ ] Criar novo documento dentro de um workspace
- [ ] Editar documento existente
- [ ] Excluir documento
- [ ] Renomear documento
- [ ] Mover documento entre workspaces

### 3. **Hierarquia de Páginas** (Prioridade MÉDIA)
- [ ] Criar subpáginas dentro de documentos
- [ ] Navegação breadcrumb
- [ ] Árvore de navegação lateral

### 4. **Colaboração** (Prioridade BAIXA - Futuro)
- [ ] Ver quem está editando
- [ ] Comentários
- [ ] Menções (@)

---

## 🛠️ Tecnologias Sugeridas

### Opção 1: **Tiptap** (Recomendado)
- Editor WYSIWYG moderno
- Baseado em ProseMirror
- Extensível
- React-friendly
- Suporta markdown

**Instalação:**
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-task-list @tiptap/extension-task-item
```

### Opção 2: **Slate.js**
- Mais customizável
- Mais complexo
- Usado por Notion

### Opção 3: **Lexical** (Facebook)
- Moderno
- Performático
- Ainda em desenvolvimento

---

## 📊 Schema do Banco (Atualização Necessária)

### Tabela `documents` (Atualizar)

Adicionar campos:
```sql
ALTER TABLE documents
ADD COLUMN content JSONB,  -- Conteúdo do documento em formato JSON
ADD COLUMN parent_id UUID REFERENCES documents(id),  -- Para hierarquia
ADD COLUMN order_index INTEGER DEFAULT 0,  -- Ordem de exibição
ADD COLUMN is_page BOOLEAN DEFAULT false;  -- Se é uma página ou documento
```

### Exemplo de `content` (JSON):
```json
{
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": { "level": 1 },
      "content": [{ "type": "text", "text": "Ata de Reunião" }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "Data: 15/02/2026" }]
    },
    {
      "type": "taskList",
      "content": [
        {
          "type": "taskItem",
          "attrs": { "checked": false },
          "content": [{ "type": "text", "text": "Finalizar diagnóstico" }]
        }
      ]
    }
  ]
}
```

---

## 🎯 Plano de Implementação

### **Sprint 1: Editor Básico** (2-3 horas)
1. Instalar Tiptap
2. Criar componente `DocumentEditor`
3. Implementar toolbar básica (negrito, itálico, títulos)
4. Salvar conteúdo no Supabase

### **Sprint 2: To-Do Lists** (1-2 horas)
1. Adicionar extensão de checkboxes
2. Implementar toggle de checkbox
3. Persistir estado no banco

### **Sprint 3: Gestão de Documentos** (2-3 horas)
1. Criar modal "Novo Documento"
2. Implementar edição inline do título
3. Adicionar botão de excluir
4. Implementar auto-save

### **Sprint 4: Hierarquia** (3-4 horas)
1. Implementar subpáginas
2. Criar navegação breadcrumb
3. Árvore de navegação lateral

---

## 🚀 Próximos Passos IMEDIATOS

**Opção A: Implementar Editor Completo** (Recomendado)
- Instalar Tiptap
- Criar página de edição de documento
- Implementar salvar/carregar do Supabase

**Opção B: Migrar Dados do Notion**
- Criar script para importar HTMLs do Notion
- Popular banco com dados reais da Stela
- Manter estrutura existente

**Opção C: Ambos**
- Migrar dados primeiro
- Depois implementar editor

---

## ❓ Decisões Necessárias

1. **Qual opção você prefere?**
   - A) Implementar editor primeiro
   - B) Migrar dados do Notion primeiro
   - C) Fazer ambos em paralelo

2. **Quer manter os HTMLs do Notion ou migrar tudo para o banco?**
   - Manter HTMLs = mais rápido, menos flexível
   - Migrar para banco = mais trabalho, mais poderoso

3. **Prioridade de features:**
   - Editor básico primeiro?
   - To-Do lists primeiro?
   - Hierarquia primeiro?

---

**Aguardando sua decisão para continuar! 🎯**

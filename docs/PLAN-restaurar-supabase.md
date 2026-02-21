# 🔧 PLANO: Restaurar Conexão Backend e Dados Supabase

**Data:** 2026-02-17  
**Status:** 🔴 AGUARDANDO APROVAÇÃO  
**Complexidade:** Média  
**Tempo Estimado:** 30-45 minutos

---

## 📋 DIAGNÓSTICO ATUAL

### ✅ O que está funcionando:
- Servidor Next.js rodando (porta 3000)
- Supabase conectado e respondendo
- Tabela `documents` (inglês) possui **5 documentos** da Ferreira
- Tabela `workspaces` possui **5 pastas** criadas corretamente

### ❌ O que está quebrado:
- Código do `database.ts` está tentando acessar tabelas em português (`documentos`, `clientes`) que **NÃO EXISTEM**
- Tabela `documentos` existe mas está **VAZIA** (0 registros)
- Aplicação não está buscando dados da tabela correta (`documents` em inglês)
- Usuário relatou que deveria ter 70+ documentos, mas só há 5 no banco

### 🗄️ Estrutura Real do Banco (Confirmada):

| Tabela | Status | Registros | Colunas Principais |
|--------|--------|-----------|-------------------|
| `documents` ✅ | EXISTE | 5 (Ferreira) | `id`, `client_id`, `title`, `category`, `content` |
| `documentos` ❌ | VAZIA | 0 | - |
| `workspaces` ✅ | EXISTE | 5 (Ferreira) | `id`, `client_id`, `folder_name`, `color` |
| `clients` ✅ | EXISTE | N/A | `id`, `name` |

---

## 🎯 OBJETIVO DO PLANO

1. **Corrigir `src/lib/database.ts`** para usar as tabelas em INGLÊS que realmente existem
2. **Restaurar os 70+ documentos** que estão na pasta local `c:/n/PRODUTOS RV`
3. **Validar** que todos os dados aparecem corretamente na UI

---

## 📝 FASES DO PLANO

### **FASE 1: Corrigir database.ts** ⏱️ 10min

**Arquivo:** `src/lib/database.ts`

**Problema:** O código atual tenta buscar em `documentos` (português), mas os dados estão em `documents` (inglês).

**Solução:**
1. Remover TODAS as referências a:
   - `documentos` → usar `documents`
   - `clientes` → usar `clients`
   - `espaços de trabalho` → usar `workspaces`
   - `id_do_cliente` → usar `client_id`
   - `titulo` → usar `title`
   - `categoria` → usar `category`
   - `contente` → usar `content`

2. Manter funções simples e diretas:
   - `getClients()` → SELECT * FROM clients
   - `getClientWorkspace(clientId)` → SELECT workspaces + documents WHERE client_id = ...
   - `getDocumentById(id)` → SELECT * FROM documents WHERE id = ...

3. Remover sistema de "fallback" entre português/inglês (ele está causando confusão)

**Critério de Sucesso:**
- ✅ Localhost recarrega sem erros
- ✅ Aparece "5 Documentos" nas estatísticas do cliente Ferreira
- ✅ As 5 pastas aparecem expandidas com seus documentos

---

### **FASE 2: Importar Documentos Faltantes** ⏱️ 15min

**Problema:** O banco tem apenas 5 documentos, mas a pasta local tem 38+ arquivos HTML.

**Solução:**
1. Criar script `import-ferreira-docs.js` que:
   - Varre a pasta `c:/n/PRODUTOS RV/METÓDO VERTEX 360/Clientes/Ferreira Logística e Distribuidora`
   - Extrai título e conteúdo de cada `.html`
   - Determina a categoria (Reuniões, Diagnóstico, Desenvolvimento, etc.)
   - Insere na tabela `documents` com:
     ```javascript
     {
       client_id: '9e4e1fec-2e0a-428d-843b-63bb398e5c09',
       title: 'Nome extraído do <title>',
       category: 'Categoria determinada pelo caminho',
       content: 'HTML completo',
       status: 'published',
       last_edit: '17/02/2026'
     }
     ```

2. Usar `upsert` com conflito em `(title, client_id)` para evitar duplicados

**Critério de Sucesso:**
- ✅ Script roda sem erros
- ✅ Banco passa de 5 para 35+ documentos
- ✅ Localhost atualiza automaticamente e mostra todos os documentos

---

### **FASE 3: Validação Final** ⏱️ 10min

1. **Recarregar Localhost** (F5)
2. **Verificar Estatísticas:**
   - WORKSPACES: 5
   - DOCUMENTOS: 35+ (número exato dependerá da importação)
   - PROGRESSO: Atualizado automaticamente

3. **Testar Navegação:**
   - Clicar em cada pasta (Reuniões, Diagnóstico, etc.)
   - Verificar que os documentos aparecem dentro delas
   - Abrir 2-3 documentos para confirmar que o conteúdo está correto

4. **Verificar Console:**
   - Não deve haver erros vermelhos de "table not found"
   - Não deve haver warnings de "Could not find..."

**Critério de Sucesso:**
- ✅ Zero erros no console do navegador
- ✅ Todos os documentos visíveis e clicáveis
- ✅ Conteúdo renderizado corretamente

---

## ⚠️ RISCOS E MITIGAÇÕES

| Risco | Probabilidade | Mitigação |
|-------|--------------|-----------|
| Importação duplica documentos | Média | Usar `upsert` com chave única (title, client_id) |
| Alguns HTML têm encoding errado | Baixa | Tratar encoding UTF-8 no script |
| Localhost não atualiza após import | Baixa | Fazer hard refresh (Ctrl+Shift+R) |

---

## 📦 ENTREGAS

| Item | Arquivo | Status |
|------|---------|--------|
| Backend Corrigido | `src/lib/database.ts` | ⏳ Pendente |
| Script de Importação | `import-ferreira-docs.js` | ⏳ Pendente |
| Dados Restaurados | Supabase `documents` table | ⏳ Pendente |
| Validação | Localhost funcionando | ⏳ Pendente |

---

## 🚀 PRÓXIMOS PASSOS

Após aprovação deste plano:

1. **Você aprova**: Respondendo "pode executar" ou "aprovado"
2. **Eu executo**: Fase 1 → Fase 2 → Fase 3
3. **Você valida**: Abre o localhost e confirma que tudo voltou
4. **Commitamos**: `git add . && git commit -m "fix: restaurar backend e dados supabase"`

---

## 📞 PONTOS DE DECISÃO

**Antes de começar, preciso que você confirme:**

1. ✅ Posso SOBRESCREVER o arquivo `src/lib/database.ts` atual?
2. ✅ Os 5 documentos que já estão no banco devem permanecer (não apagar)?
3. ✅ Pode importar TODOS os .html da pasta Ferreira Distribuidora?
4. ✅ Caso apareçam mais de 70 documentos, está OK?

**Responda "aprovado" para eu iniciar a execução.**

---

**Criado em:** 2026-02-17 21:50  
**Autor:** Antigravity Agent  
**Versão:** 1.0

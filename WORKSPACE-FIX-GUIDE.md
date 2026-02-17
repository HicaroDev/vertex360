# 🔧 CORREÇÃO URGENTE - WORKSPACES

## ❌ PROBLEMAS IDENTIFICADOS:

1. **Erro ao criar workspace** - Falta coluna `color` no banco
2. **Documentos sumindo** - Bug na query de atualização
3. **Sem ordenação** - Falta funcionalidade de reordenar
4. **Sem drag & drop** - Falta mover documentos

---

## ✅ SOLUÇÃO PASSO A PASSO:

### **PASSO 1: Executar SQL de Correção** 🗄️

Abra o **SQL Editor do Supabase** e execute o arquivo:

```
supabase-fix-workspaces.sql
```

Ou copie e cole este SQL:

```sql
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

-- Adicionar coluna 'order_position' em documents
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'documents' AND column_name = 'order_position'
    ) THEN
        ALTER TABLE documents ADD COLUMN order_position INTEGER DEFAULT 0;
    END IF;
END $$;
```

**✅ Resultado esperado:** "Schema atualizado com sucesso!"

---

### **PASSO 2: Verificar Instalação do DND-Kit**

Aguarde a instalação terminar (você verá no terminal).

---

### **PASSO 3: Testar Novamente**

1. Recarregue a página (F5)
2. Clique em "Gerenciar Workspaces"
3. Tente criar um novo workspace
4. **Deve funcionar agora!**

---

## 🐛 DEBUG: Se ainda der erro

### **Verificar erro no console:**

1. Abra o console (F12)
2. Vá na aba "Console"
3. Tente criar um workspace
4. Me mostre o erro que aparece

### **Erros comuns:**

| Erro | Causa | Solução |
|------|-------|---------|
| `column "color" does not exist` | Falta coluna no banco | Execute o SQL acima |
| `null value in column "client_id"` | clientId não está sendo passado | Verifique se o ID do cliente está correto |
| `permission denied` | Sem permissão no Supabase | Configure RLS (Row Level Security) |

---

## 📋 PRÓXIMOS PASSOS (Após correção):

1. ✅ Corrigir erro de criação
2. ✅ Corrigir documentos sumindo
3. ✅ Adicionar drag & drop de workspaces
4. ✅ Adicionar drag & drop de documentos

---

**🚨 EXECUTE O SQL PRIMEIRO E ME DIGA SE FUNCIONOU!**

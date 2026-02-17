# ✅ Checklist: Testar Banco de Dados Supabase

**Data**: 2026-02-16  
**Objetivo**: Conectar e validar integração com Supabase

---

## 📋 Passo a Passo

### Etapa 1: Obter Chave do Supabase

- [ ] Abrir navegador em: https://zztpwoqgyibnafmzpjhk.supabase.co
- [ ] Fazer login:
  - Email: `contato@lemmi.com.br`
  - Senha: `StevaoCaio2017@`
- [ ] Clicar no ícone de **engrenagem ⚙️** (Project Settings)
- [ ] Clicar na aba **"API"**
- [ ] Procurar por **"Project API keys"**
- [ ] Copiar a chave **"anon" "public"** (começa com `eyJ...`)

### Etapa 2: Configurar .env.local

- [ ] Abrir arquivo: `c:\n\rv-portal\.env.local`
- [ ] Substituir `COLE_AQUI_A_CHAVE_ANON_DO_SUPABASE` pela chave copiada
- [ ] Salvar o arquivo

**Exemplo do arquivo após edição:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://zztpwoqgyibnafmzpjhk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dHB3b3FneWlibmFmbXpwamhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk1NjQwMDAsImV4cCI6MjAyNTE0MDAwMH0.EXEMPLO_DE_ASSINATURA
```

### Etapa 3: Executar SQL no Supabase

- [ ] No Supabase Dashboard, clicar em **"SQL Editor"** (ícone `</>`)
- [ ] Clicar em **"+ New query"**
- [ ] Abrir arquivo: `c:\n\supabase-setup.sql`
- [ ] Copiar TODO o conteúdo
- [ ] Colar no SQL Editor do Supabase
- [ ] Clicar em **"Run"** (ou Ctrl+Enter)
- [ ] Aguardar mensagem de sucesso ✅

### Etapa 4: Verificar Tabelas Criadas

- [ ] No Supabase Dashboard, clicar em **"Table Editor"**
- [ ] Verificar se existem 3 tabelas:
  - ✅ `clients`
  - ✅ `workspaces`
  - ✅ `documents`
- [ ] Clicar em `clients` e verificar se tem dados (Ferreira Distribuidora)

### Etapa 5: Iniciar Servidor

- [ ] Abrir terminal no VS Code
- [ ] Navegar para a pasta do projeto:
  ```bash
  cd c:\n\rv-portal
  ```
- [ ] Instalar dependências (se ainda não fez):
  ```bash
  npm install
  ```
- [ ] Iniciar servidor:
  ```bash
  npm run dev
  ```
- [ ] Aguardar mensagem: `Ready in X ms`

### Etapa 6: Testar Conexão

- [ ] Abrir navegador em: http://localhost:3000/test-db
- [ ] Verificar se aparece: **"✅ Conexão estabelecida! X cliente(s) encontrado(s)."**
- [ ] Abrir Console do navegador (F12) e verificar logs

---

## ✅ Critérios de Sucesso

### Conexão OK ✅

- Página `/test-db` mostra fundo **verde**
- Mensagem: "✅ Conexão estabelecida! 1 cliente(s) encontrado(s)."
- Console mostra: "✅ Conexão com Supabase estabelecida com sucesso!"

### Conexão COM ERRO ❌

- Página `/test-db` mostra fundo **vermelho**
- Mensagem de erro específica
- Console mostra erro detalhado

---

## 🐛 Problemas Comuns

### Erro: "Missing Supabase environment variables"

**Causa**: Arquivo `.env.local` não está no lugar certo ou variáveis não foram carregadas.

**Solução**:
1. Confirmar que `.env.local` está em `c:\n\rv-portal\.env.local`
2. Reiniciar o servidor (Ctrl+C e `npm run dev`)

### Erro: "Invalid API key"

**Causa**: Chave `NEXT_PUBLIC_SUPABASE_ANON_KEY` está incorreta.

**Solução**:
1. Voltar ao Supabase Dashboard
2. Copiar novamente a chave "anon public"
3. Colar no `.env.local`
4. Reiniciar servidor

### Erro: "relation 'clients' does not exist"

**Causa**: SQL não foi executado no Supabase.

**Solução**:
1. Ir ao SQL Editor do Supabase
2. Executar o conteúdo de `supabase-setup.sql`
3. Verificar se as tabelas foram criadas no Table Editor

---

## 📝 Após Sucesso

Quando a conexão estiver funcionando:

1. [ ] Marcar no `STATUS.md` que a Fase 1 foi concluída
2. [ ] Testar as páginas principais:
   - `/admin/dashboard`
   - `/admin/clients`
3. [ ] Verificar se os dados aparecem nas páginas

---

## 🆘 Precisa de Ajuda?

Se algo não funcionar:

1. Copie a mensagem de erro completa
2. Abra o Console do navegador (F12) e copie os logs
3. Peça ajuda ao AI Agent com essas informações

---

**Boa sorte! 🚀**

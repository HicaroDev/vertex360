# 🛠️ COMANDOS ÚTEIS - GUIA COMPLETO

## 📋 ÍNDICE

1. [Gerenciamento de Processos](#gerenciamento-de-processos)
2. [Servidor Next.js](#servidor-nextjs)
3. [Git e GitHub](#git-e-github)
4. [NPM e Dependências](#npm-e-dependências)
5. [Supabase](#supabase)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 GERENCIAMENTO DE PROCESSOS

### **Ver o que está usando uma porta específica**
```powershell
netstat -ano | findstr :3000
```

**Resultado:**
```
TCP    0.0.0.0:3000    0.0.0.0:0    LISTENING    27556
                                                  ↑↑↑↑↑
                                          NÚMERO DO PROCESSO
```

### **Listar todos os processos Node rodando**
```powershell
Get-Process -Name node
```

**Resultado:**
```
Handles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id  SI ProcessName
-------  ------    -----      -----     ------     --  -- -----------
    456      45   123456     234567      12.34  27556   1 node
                                                ↑↑↑↑↑
                                        NÚMERO DO PROCESSO
```

### **Parar um processo específico pelo ID**
```powershell
Stop-Process -Id 27556 -Force
```

### **Parar TODOS os processos Node**
```powershell
Stop-Process -Name node -Force
```
⚠️ **CUIDADO:** Isso mata TODOS os processos Node rodando!

### **Parar processo pelo nome**
```powershell
Stop-Process -Name "next-server" -Force
```

### **Ver processos em tempo real (Task Manager via PowerShell)**
```powershell
tasklist | findstr node
```

---

## 🚀 SERVIDOR NEXT.JS

### **Iniciar servidor de desenvolvimento**
```powershell
npm run dev
```

### **Parar servidor**
No terminal onde está rodando:
```
Ctrl + C
```

### **Iniciar em porta específica**
```powershell
npm run dev -- -p 3001
```

### **Limpar cache do Next.js**
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

### **Build de produção**
```powershell
npm run build
```

### **Iniciar servidor de produção**
```powershell
npm run start
```

### **Verificar erros de build**
```powershell
npm run build 2>&1 | Out-File -FilePath build-errors.log
```

---

## 📦 GIT E GITHUB

### **Verificar status**
```powershell
git status
```

### **Adicionar todos os arquivos**
```powershell
git add .
```

### **Commit com mensagem**
```powershell
git commit -m "Sua mensagem aqui"
```

### **Push para GitHub**
```powershell
git push origin main
```

### **Ver histórico de commits**
```powershell
git log --oneline
```

### **Criar nova branch**
```powershell
git checkout -b nome-da-branch
```

### **Trocar de branch**
```powershell
git checkout main
```

### **Ver branches**
```powershell
git branch
```

### **Pull (baixar alterações)**
```powershell
git pull origin main
```

### **Desfazer último commit (mantém alterações)**
```powershell
git reset --soft HEAD~1
```

### **Desfazer alterações em arquivo**
```powershell
git checkout -- nome-do-arquivo.tsx
```

### **Ver diferenças**
```powershell
git diff
```

---

## 📦 NPM E DEPENDÊNCIAS

### **Instalar dependências**
```powershell
npm install
```

### **Instalar pacote específico**
```powershell
npm install nome-do-pacote
```

### **Instalar com --legacy-peer-deps**
```powershell
npm install nome-do-pacote --legacy-peer-deps
```

### **Desinstalar pacote**
```powershell
npm uninstall nome-do-pacote
```

### **Atualizar pacote**
```powershell
npm update nome-do-pacote
```

### **Ver pacotes instalados**
```powershell
npm list --depth=0
```

### **Ver pacotes desatualizados**
```powershell
npm outdated
```

### **Limpar cache do NPM**
```powershell
npm cache clean --force
```

### **Reinstalar tudo do zero**
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### **Verificar vulnerabilidades**
```powershell
npm audit
```

### **Corrigir vulnerabilidades**
```powershell
npm audit fix
```

---

## 🗄️ SUPABASE

### **Executar SQL no Supabase**
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Cole o SQL
5. Clique em **Run**

### **Ver tabelas**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### **Ver colunas de uma tabela**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'clients';
```

### **Backup de tabela**
```sql
CREATE TABLE clients_backup AS 
SELECT * FROM clients;
```

### **Deletar todos os dados de uma tabela**
```sql
TRUNCATE TABLE nome_da_tabela CASCADE;
```

### **Ver quantidade de registros**
```sql
SELECT COUNT(*) FROM clients;
```

---

## 🐛 TROUBLESHOOTING

### **Porta 3000 em uso**

**Problema:**
```
⚠ Port 3000 is in use by process 27556
```

**Solução 1:** Parar o processo
```powershell
Stop-Process -Id 27556 -Force
npm run dev
```

**Solução 2:** Usar outra porta
```powershell
npm run dev -- -p 3001
```

---

### **Erro de módulo não encontrado**

**Problema:**
```
Module not found: Can't resolve '@/components/...'
```

**Solução:**
```powershell
npm install
Remove-Item -Recurse -Force .next
npm run dev
```

---

### **Erro de hydration**

**Problema:**
```
Error: Hydration failed because the initial UI does not match...
```

**Solução:**
1. Adicione `"use client"` no topo do componente
2. Use `useState` para renderização condicional
3. Limpe o cache:
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

---

### **Erro de TypeScript**

**Problema:**
```
Type 'string' is not assignable to type 'number'
```

**Solução:**
1. Verifique os tipos
2. Use type casting se necessário:
```typescript
const id = clientId as string;
```

---

### **Build falha**

**Problema:**
```
Error: Build failed
```

**Solução:**
```powershell
# Limpar tudo
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstalar
npm install

# Tentar build novamente
npm run build
```

---

### **Supabase não conecta**

**Problema:**
```
Error: Invalid Supabase URL
```

**Solução:**
1. Verifique o arquivo `.env`:
```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
```

2. Reinicie o servidor:
```powershell
Ctrl + C
npm run dev
```

---

## 🔍 COMANDOS DE DIAGNÓSTICO

### **Ver versão do Node**
```powershell
node --version
```

### **Ver versão do NPM**
```powershell
npm --version
```

### **Ver versão do Next.js**
```powershell
npm list next
```

### **Ver todas as variáveis de ambiente**
```powershell
Get-ChildItem Env:
```

### **Ver conteúdo do .env**
```powershell
Get-Content .env
```

### **Testar conexão com internet**
```powershell
Test-Connection google.com
```

---

## 📝 COMANDOS DE ARQUIVO

### **Criar arquivo**
```powershell
New-Item -Path "arquivo.txt" -ItemType File
```

### **Criar pasta**
```powershell
New-Item -Path "pasta" -ItemType Directory
```

### **Deletar arquivo**
```powershell
Remove-Item arquivo.txt
```

### **Deletar pasta**
```powershell
Remove-Item -Recurse -Force pasta
```

### **Copiar arquivo**
```powershell
Copy-Item arquivo.txt destino.txt
```

### **Mover arquivo**
```powershell
Move-Item arquivo.txt nova-pasta/
```

### **Ver conteúdo de arquivo**
```powershell
Get-Content arquivo.txt
```

### **Buscar texto em arquivos**
```powershell
Select-String -Path "*.tsx" -Pattern "DocumentEditor"
```

---

## 🎯 ATALHOS DO TERMINAL

| Atalho | Ação |
|--------|------|
| `Ctrl + C` | Parar processo |
| `Ctrl + L` | Limpar tela |
| `Tab` | Auto-completar |
| `↑` / `↓` | Navegar histórico |
| `Ctrl + R` | Buscar no histórico |
| `Ctrl + A` | Ir para início da linha |
| `Ctrl + E` | Ir para fim da linha |

---

## 📚 RECURSOS ÚTEIS

### **Documentação**
- Next.js: https://nextjs.org/docs
- React: https://react.dev
- Supabase: https://supabase.com/docs
- Tiptap: https://tiptap.dev

### **Comunidades**
- Stack Overflow: https://stackoverflow.com
- GitHub Discussions: https://github.com/vercel/next.js/discussions
- Discord Next.js: https://nextjs.org/discord

---

## 💡 DICAS RÁPIDAS

### **Sempre que der erro:**
1. Leia a mensagem de erro completa
2. Verifique o console (F12)
3. Limpe o cache (`.next`)
4. Reinstale dependências se necessário
5. Reinicie o servidor

### **Antes de fazer commit:**
1. Teste localmente
2. Verifique se não tem erros
3. Revise as alterações (`git diff`)
4. Escreva mensagem descritiva

### **Boas práticas:**
- Sempre use `--legacy-peer-deps` se der conflito
- Mantenha `.env` no `.gitignore`
- Faça commits pequenos e frequentes
- Teste antes de fazer push

---

**📌 SALVE ESTE ARQUIVO PARA REFERÊNCIA RÁPIDA!**

**Última atualização:** 17/02/2026

# 🚀 RV Portal - Sistema de Gestão de Clientes

## 📖 Primeira Leitura - Visão Geral do Projeto

### O que é este projeto?

O **RV Portal** é um sistema SaaS de gestão de clientes com dois portais:
- **Portal Admin**: Gestão completa (dashboard, clientes, metodologia, finanças, IA)
- **Portal Cliente**: Área restrita para clientes acessarem seus dados

### 🎯 Objetivo Atual

Conectar o sistema ao banco de dados **Supabase** e implementar as funcionalidades principais de gestão de clientes, workspaces e documentos.

---

## 🏗️ Arquitetura do Projeto

### Stack Tecnológica

- **Framework**: Next.js 16.1.6 (App Router)
- **UI**: React 19.2.3 + Tailwind CSS v4
- **Banco de Dados**: Supabase (PostgreSQL)
- **Animações**: Framer Motion
- **Ícones**: Lucide React

### Estrutura de Pastas

```
rv-portal/
├── src/
│   ├── app/
│   │   ├── (admin)/          # Rotas do portal admin
│   │   │   └── admin/
│   │   │       ├── dashboard/
│   │   │       ├── clients/
│   │   │       ├── methodology/
│   │   │       ├── finance/
│   │   │       └── ai-engine/
│   │   ├── (portal)/         # Rotas do portal cliente
│   │   │   └── dashboard/
│   │   │       ├── documents/
│   │   │       ├── finance/
│   │   │       ├── team/
│   │   │       ├── timeline/
│   │   │       └── settings/
│   │   └── test-db/          # Página de teste do banco
│   ├── components/           # Componentes reutilizáveis
│   └── lib/                  # Utilitários e configurações
│       ├── supabase.ts       # Cliente Supabase
│       ├── database.ts       # Funções de banco
│       └── utils.ts          # Utilitários gerais
├── .env.local                # Variáveis de ambiente
└── package.json
```

---

## 🗄️ Banco de Dados (Supabase)

### Tabelas Principais

1. **clients** - Dados dos clientes
2. **workspaces** - Pastas/workspaces dos clientes
3. **documents** - Documentos dentro dos workspaces

### Configuração

Ver arquivo: `GUIA-SUPABASE.md` para instruções detalhadas.

---

## 🤖 Agents & Skills Necessários

### Agents Principais

| Agent | Quando Usar | Arquivo |
|-------|-------------|---------|
| `@frontend-specialist` | Trabalho com UI/UX, componentes React | `.agent/agents/frontend-specialist.md` |
| `@backend-specialist` | API, banco de dados, integrações | `.agent/agents/backend-specialist.md` |
| `@orchestrator` | Coordenar múltiplas tarefas complexas | `.agent/agents/orchestrator.md` |
| `@debugger` | Resolver bugs e problemas | `.agent/agents/debugger.md` |

### Skills Necessárias

| Skill | Propósito | Arquivo |
|-------|-----------|---------|
| `@[skills/react-best-practices]` | Otimização React/Next.js | `.agent/skills/nextjs-react-expert/SKILL.md` |
| `@[skills/database-design]` | Design de schema, queries | `.agent/skills/database-design/SKILL.md` |
| `@[skills/frontend-design]` | UI/UX, design thinking | `.agent/skills/frontend-design/SKILL.md` |
| `@[skills/clean-code]` | Código limpo e manutenível | `.agent/skills/clean-code/SKILL.md` |
| `@[skills/testing-patterns]` | Testes unitários e integração | `.agent/skills/testing-patterns/SKILL.md` |

---

## 📝 Status do Projeto

Ver arquivo: `STATUS.md` para detalhes do progresso atual.

---

## 🚀 Como Rodar o Projeto

### 1. Instalar Dependências

```bash
cd rv-portal
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie `.env.local.example` para `.env.local` e preencha as variáveis do Supabase.

### 3. Executar o Servidor

```bash
npm run dev
```

### 4. Testar Conexão com Banco

Acesse: http://localhost:3000/test-db

---

## 📚 Documentação Adicional

- `GUIA-SUPABASE.md` - Guia de configuração do Supabase
- `STATUS.md` - Status atual do projeto e próximos passos
- `PLAN-rv-saas-core.md` - Planejamento do core do SaaS
- `TASK-infra-setup.md` - Tarefas de infraestrutura

---

## 🆘 Problemas Comuns

### Erro de Conexão com Supabase

1. Verifique se o `.env.local` está na raiz do projeto `rv-portal/`
2. Confirme que a chave `NEXT_PUBLIC_SUPABASE_ANON_KEY` está correta
3. Reinicie o servidor após alterar o `.env.local`

### Servidor não inicia

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Suporte

Para dúvidas ou problemas, consulte os arquivos de documentação ou peça ajuda ao AI Agent.

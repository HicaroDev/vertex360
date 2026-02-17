# 🤖 Guia de Agents & Skills - RV Portal

Este documento mapeia quais **Agents** e **Skills** devem ser usados para cada tipo de tarefa no projeto.

---

## 📋 Índice Rápido

- [Quando Usar Cada Agent](#quando-usar-cada-agent)
- [Skills por Categoria](#skills-por-categoria)
- [Fluxo de Trabalho Recomendado](#fluxo-de-trabalho-recomendado)
- [Exemplos Práticos](#exemplos-práticos)

---

## 🤖 Quando Usar Cada Agent

### 1. `@frontend-specialist`

**Use quando trabalhar com:**
- ✅ Componentes React/Next.js
- ✅ UI/UX e design de interfaces
- ✅ Tailwind CSS e estilização
- ✅ Animações com Framer Motion
- ✅ Otimização de performance frontend
- ✅ Acessibilidade

**Skills que este agent usa:**
- `@[skills/react-best-practices]`
- `@[skills/frontend-design]`
- `@[skills/tailwind-patterns]`
- `@[skills/clean-code]`

**Exemplo de uso:**
```
"Preciso criar um componente de card para exibir clientes"
→ Usa @frontend-specialist
```

---

### 2. `@backend-specialist`

**Use quando trabalhar com:**
- ✅ Banco de dados (Supabase/PostgreSQL)
- ✅ APIs e endpoints
- ✅ Queries e otimização de banco
- ✅ Integrações com serviços externos
- ✅ Lógica de negócio server-side

**Skills que este agent usa:**
- `@[skills/database-design]`
- `@[skills/api-patterns]`
- `@[skills/nodejs-best-practices]`
- `@[skills/clean-code]`

**Exemplo de uso:**
```
"Preciso criar uma query para buscar clientes com filtros"
→ Usa @backend-specialist
```

---

### 3. `@orchestrator`

**Use quando trabalhar com:**
- ✅ Tarefas complexas que envolvem múltiplas áreas
- ✅ Coordenação entre frontend e backend
- ✅ Refatorações grandes
- ✅ Planejamento de features complexas

**Skills que este agent usa:**
- `@[skills/parallel-agents]`
- `@[skills/plan-writing]`
- `@[skills/brainstorming]`

**Exemplo de uso:**
```
"Preciso implementar um sistema completo de upload de documentos"
→ Usa @orchestrator (coordena frontend + backend)
```

---

### 4. `@project-planner`

**Use quando trabalhar com:**
- ✅ Planejamento de novas features
- ✅ Criação de roadmaps
- ✅ Análise de requisitos
- ✅ Documentação de arquitetura

**Skills que este agent usa:**
- `@[skills/plan-writing]`
- `@[skills/brainstorming]`
- `@[skills/architecture]`

**Exemplo de uso:**
```
"Quero planejar a implementação do módulo de finanças"
→ Usa @project-planner
```

---

### 5. `@debugger`

**Use quando trabalhar com:**
- ✅ Bugs e erros
- ✅ Problemas de performance
- ✅ Comportamentos inesperados
- ✅ Análise de logs

**Skills que este agent usa:**
- `@[skills/systematic-debugging]`
- `@[skills/testing-patterns]`

**Exemplo de uso:**
```
"A página /test-db está dando erro de conexão"
→ Usa @debugger
```

---

### 6. `@security-auditor`

**Use quando trabalhar com:**
- ✅ Revisão de segurança
- ✅ Análise de vulnerabilidades
- ✅ Configuração de permissões
- ✅ Proteção de dados sensíveis

**Skills que este agent usa:**
- `@[skills/vulnerability-scanner]`
- `@[skills/red-team-tactics]`

**Exemplo de uso:**
```
"Preciso revisar a segurança do sistema de autenticação"
→ Usa @security-auditor
```

---

## 📚 Skills por Categoria

### Frontend

| Skill | Quando Usar |
|-------|-------------|
| `@[skills/react-best-practices]` | Otimização React/Next.js, performance |
| `@[skills/frontend-design]` | Design thinking, UI/UX decisions |
| `@[skills/tailwind-patterns]` | Tailwind CSS v4, design tokens |
| `@[skills/web-design-guidelines]` | Acessibilidade, boas práticas web |

### Backend

| Skill | Quando Usar |
|-------|-------------|
| `@[skills/database-design]` | Schema, queries, indexação |
| `@[skills/api-patterns]` | REST, GraphQL, design de APIs |
| `@[skills/nodejs-best-practices]` | Node.js patterns, async/await |

### Qualidade

| Skill | Quando Usar |
|-------|-------------|
| `@[skills/clean-code]` | Código limpo, refatoração |
| `@[skills/testing-patterns]` | Testes unitários, integração |
| `@[skills/tdd-workflow]` | Test-Driven Development |
| `@[skills/code-review-checklist]` | Revisão de código |

### DevOps & Segurança

| Skill | Quando Usar |
|-------|-------------|
| `@[skills/deployment-procedures]` | Deploy, CI/CD |
| `@[skills/vulnerability-scanner]` | Análise de segurança |
| `@[skills/server-management]` | Gerenciamento de servidores |

### Planejamento

| Skill | Quando Usar |
|-------|-------------|
| `@[skills/brainstorming]` | Ideação, perguntas socráticas |
| `@[skills/plan-writing]` | Criação de planos de implementação |
| `@[skills/architecture]` | Decisões arquiteturais |

---

## 🔄 Fluxo de Trabalho Recomendado

### Para Nova Feature

```mermaid
1. @project-planner → Planejar e documentar
2. @orchestrator → Coordenar implementação
3. @frontend-specialist + @backend-specialist → Implementar
4. @debugger → Testar e corrigir bugs
5. @security-auditor → Revisar segurança
```

### Para Bug Fix

```mermaid
1. @debugger → Identificar causa raiz
2. @frontend-specialist OU @backend-specialist → Corrigir
3. @debugger → Validar correção
```

### Para Refatoração

```mermaid
1. @orchestrator → Planejar refatoração
2. @frontend-specialist + @backend-specialist → Implementar
3. @debugger → Garantir que nada quebrou
```

---

## 💡 Exemplos Práticos

### Exemplo 1: Criar Página de Clientes

**Tarefa**: "Criar uma página para listar e gerenciar clientes"

**Agents necessários**:
1. `@project-planner` - Planejar a feature
2. `@backend-specialist` - Criar queries e API
3. `@frontend-specialist` - Criar UI e componentes

**Skills necessárias**:
- `@[skills/database-design]` - Design das queries
- `@[skills/react-best-practices]` - Componentes otimizados
- `@[skills/frontend-design]` - UI/UX da página

---

### Exemplo 2: Conectar ao Supabase

**Tarefa**: "Configurar e testar conexão com Supabase"

**Agents necessários**:
1. `@backend-specialist` - Configurar cliente Supabase
2. `@debugger` - Testar e validar conexão

**Skills necessárias**:
- `@[skills/database-design]` - Schema e queries
- `@[skills/nodejs-best-practices]` - Configuração do cliente
- `@[skills/systematic-debugging]` - Resolver problemas

---

### Exemplo 3: Implementar Upload de Documentos

**Tarefa**: "Criar sistema de upload de documentos para clientes"

**Agents necessários**:
1. `@orchestrator` - Coordenar feature complexa
2. `@backend-specialist` - Storage e API
3. `@frontend-specialist` - UI de upload
4. `@security-auditor` - Validar segurança

**Skills necessárias**:
- `@[skills/api-patterns]` - Design da API de upload
- `@[skills/database-design]` - Armazenar metadados
- `@[skills/frontend-design]` - UI de drag-and-drop
- `@[skills/vulnerability-scanner]` - Validação de arquivos

---

## 🎯 Regras de Ouro

### 1. **Sempre comece com planejamento**
Para features complexas, use `@project-planner` primeiro.

### 2. **Use o agent especialista**
Não use `@orchestrator` para tarefas simples. Use o especialista direto.

### 3. **Combine skills quando necessário**
Um agent pode usar múltiplas skills na mesma tarefa.

### 4. **Documente decisões**
Use `@[skills/architecture]` para documentar decisões importantes.

### 5. **Teste sempre**
Use `@debugger` + `@[skills/testing-patterns]` para validar.

---

## 📞 Como Pedir Ajuda

### Formato Recomendado

```
@[agent-name] usando @[skills/skill-name]

Descrição da tarefa...
```

### Exemplos

```
@frontend-specialist usando @[skills/react-best-practices]

Preciso otimizar a página de dashboard que está lenta.
```

```
@backend-specialist usando @[skills/database-design]

Preciso criar uma query eficiente para buscar documentos com filtros.
```

```
@orchestrator

Preciso implementar um sistema completo de notificações em tempo real.
```

---

## 🔍 Troubleshooting

### "Não sei qual agent usar"

1. É sobre UI? → `@frontend-specialist`
2. É sobre banco/API? → `@backend-specialist`
3. É complexo e envolve várias áreas? → `@orchestrator`
4. É um bug? → `@debugger`
5. É planejamento? → `@project-planner`

### "Não sei qual skill usar"

Consulte a seção [Skills por Categoria](#skills-por-categoria) acima.

---

**Última atualização**: 2026-02-16

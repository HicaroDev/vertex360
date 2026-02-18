# Guia de Importação em Massa (Notion HTML -> SaaS)

Este guia explica como utilizar o motor de importação de documentos para subir novos clientes e organizar seus arquivos automaticamente no portal.

---

## 🚀 Como Preparar os Arquivos

1. **Exportação do Notion**:
   - No Notion, selecione a página do cliente.
   - Clique em `Export` -> `HTML` -> `Include subpages`.
   - Extraia o conteúdo para uma pasta organizada no seu computador (ex: `C:/Clientes/NomeDoCliente`).

2. **Nomenclatura Padrão**:
   - Reuniões devem conter a data no título (ex: `Reunião 17/04/2025 - ok.html`).
   - Se o documento tiver **"- ok"** no título, ele será importado como **Público (Exibível)**.
   - Sem o "ok", ele fica como **Em análise**.

---

## 🛠️ Configurando o Script

Abra o arquivo `bulk-import-pro.js` na raiz do projeto e ajuste as duas variáveis principais:

```javascript
// CONFIGURAÇÃO DO CLIENTE
const CLIENT_ID = 'COLE_AQUI_O_UUID_DO_CLIENTE'; // ID que você pega no link ou banco
const BASE_DIR = 'C:/Caminho/Para/Páginas/Exportadas'; // Caminho real no seu PC
```

### Onde achar o CLIENT_ID?
Você pode ver o ID do cliente na URL da página de detalhes no admin (ex: `/admin/clients/9e4e1fec...`) ou diretamente na tabela `clients` do Supabase.

---

## 🏃‍♂️ Executando a Importação

Abra o terminal na pasta do projeto e execute:

```bash
node bulk-import-pro.js
```

### O que o script faz automaticamente:
- **Categorização**: Identifica se é Reunião, Diagnóstico ou Apresentação pela estrutura de pastas.
- **Status**: Define se o documento é "OK" (Selo verde) ou "Em Análise".
- **Ordenação**: Extrai a data do título das reuniões para deixar tudo na ordem correta (1, 2, 3...).
- **Upsert**: Se você rodar o script de novo, ele atualiza os documentos já existentes em vez de duplicar.

---

## 📋 Verificação Final

Após rodar o script, os documentos já estarão disponíveis no dashboard do cliente. Confira:
1. Se as reuniões estão em ordem cronológica.
2. Se os selos **OK** e **Em análise** estão corretos.
3. Se o conteúdo HTML (clicando no link) está carregando perfeitamente.

---

*Gerado em 17/02/2026 para Gestão R&V - Sistema Vertex 360*

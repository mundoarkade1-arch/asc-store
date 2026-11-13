# Instruções permanentes para agentes

## Escopo do projeto

- A ASC Store é uma plataforma de descoberta e distribuição de aplicativos.
- O projeto oficial é `mundoarkade1-arch/asc-store`, na branch `main`.
- O frontend é estático, feito com HTML, CSS e JavaScript puro, sem build obrigatório e sem framework.
- As Pages Functions ficam somente em `functions/`.
- O painel administrativo fica em `admin/`.
- Os arquivos visuais ficam em `assets/` e `css/`.
- O código do frontend fica em `js/`.

## Fonte dos dados

- O catálogo publicado no Cloudflare KV é a fonte operacional oficial da loja.
- `data/apps.json` é apenas fallback/exemplo para o frontend quando a API não fornece um catálogo válido.
- Nunca substituir o catálogo publicado pelo conteúdo local sem autorização explícita e backup confirmado.
- Aplicativos e dados de catálogo devem ser mantidos conforme o fluxo existente; não inventar aplicativos, links, versões, tamanhos ou releases.
- Links de download devem vir do catálogo ou de uma release real do GitHub.

## Arquitetura

- Preservar a arquitetura existente sempre que possível.
- Não introduzir frameworks, bundlers ou dependências sem justificativa técnica e autorização.
- Não mover Functions para o frontend nem colocar lógica administrativa em arquivos públicos desnecessariamente.
- O frontend usa rotas por hash e carrega dados pela API, com fallback para `data/apps.json`.
- A API pública usa Cloudflare Pages Functions, Cloudflare KV e, quando configurado, GitHub Releases.
- O painel administrativo grava o catálogo no KV; não criar uma segunda fonte de verdade.

## Programação e segurança

- Escapar todo texto vindo do JSON antes de inseri-lo no HTML. Reutilizar a função `esc` existente em `js/app.js` ou equivalente seguro.
- Validar entradas no cliente e no servidor.
- Nunca expor senha, token, secret, cookie de sessão ou chave privada em código, documentação, logs ou commits.
- Não registrar no repositório valores de `ADMIN_PASSWORD`, `SESSION_SECRET`, `GITHUB_TOKEN` ou bindings privados.
- Preservar autenticação, cookies seguros, validação de origem, rate limiting e headers de segurança existentes.
- Não relaxar CSP, `HttpOnly`, `Secure`, `SameSite`, proteção contra embed ou validações de imagem sem análise específica.
- Não aceitar links de download inventados ou não verificados.

## Identidade visual

Usar como referência oficial da ASC Store:

- fundo principal: `#101010`;
- superfícies: `#1A1A1A` e `#222222`;
- texto principal: `#FFFFFF`;
- destaque: `#C8FF00`;
- texto secundário: `#A8A8A8`;
- texto de apoio: `#6B6B6B`.

Preservar glassmorphism, cards, microinterações e animações existentes quando não houver motivo para removê-los. Toda animação nova deve respeitar `prefers-reduced-motion`.

## UX, acessibilidade e dispositivos

- Manter responsividade para celular, tablet e computador.
- Preservar suporte a Android TV e navegação por teclado/controle remoto.
- Manter foco visível, textos alternativos, navegação por teclado e contraste adequado.
- Não introduzir rolagem horizontal acidental em telas pequenas.
- Validar mudanças em viewport móvel, desktop e modo TV.

## Publicação e alterações externas

- Não fazer deploy, push, commit, pull ou alteração no Cloudflare sem autorização explícita.
- Não alterar KV, bindings, secrets ou configurações de Pages durante uma tarefa de frontend/documentação.
- Não publicar automaticamente após editar arquivos.
- Antes de qualquer alteração que possa afetar o catálogo, confirmar backup do catálogo operacional.
- Fazer testes proporcionais ao risco e documentar o resultado.
- Se uma tarefa exigir alteração fora do escopo autorizado, parar e pedir autorização separadamente.

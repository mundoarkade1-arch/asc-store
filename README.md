# ASC STORE

A ASC Store é uma plataforma de descoberta e distribuição de aplicativos para celular, TV Box, Smart TV e computador. O produto combina uma loja frontend estática, páginas individuais, downloads, integração com GitHub Releases e um painel administrativo protegido.

## Tecnologias

- HTML5, CSS3 e JavaScript puro.
- Cloudflare Pages para hospedagem.
- Cloudflare Pages Functions para a API.
- Cloudflare KV para o catálogo operacional e cache de releases.
- GitHub Releases para versões e arquivos de aplicativos.
- Inter e Space Grotesk carregadas externamente pelo CSS atual.

Não há framework frontend, `package.json` ou processo de build obrigatório.

## Estrutura

```text
index.html              entrada da loja
css/style.css           estilos principais usados pelo frontend
js/app.js               rotas, renderização, busca e interações
data/apps.json          fallback/exemplo local; não é a fonte operacional
assets/                 logos, ícones e imagens versionadas
admin/                  HTML, CSS e JS do painel administrativo
functions/              Pages Functions da API, login e catálogo
_headers                headers de segurança e cache do Pages
404.html                resposta para página inexistente
robots.txt              regras para rastreadores
sitemap.xml             sitemap atual
AGENTS.md               regras permanentes para agentes
PROJECT_STATE.md        estado conhecido do projeto
ROADMAP.md              fases planejadas
CHANGELOG.md            histórico de alterações
TESTING.md              procedimentos de validação
```

O repositório também contém uma cópia interna chamada `asc-store-main/` e um `style.css` legado na raiz. A raiz do repositório é a fonte oficial de desenvolvimento e publicação; a cópia interna não deve ser usada.

## Fonte do catálogo

O catálogo publicado no Cloudflare KV é a fonte operacional oficial da loja.

`data/apps.json` é apenas fallback/exemplo local. Ele nunca deve substituir o catálogo publicado, nem ser usado para sobrescrever o KV sem autorização, backup e procedimento específico.

Na auditoria, foram observados três aplicativos no catálogo publicado: ASC Cine, ASC Lite e ASC Desk. Essa quantidade corresponde somente ao momento da auditoria e não garante que o catálogo continue igual.

## Como adicionar ou atualizar um aplicativo

O fluxo operacional deve usar o painel administrativo e o catálogo no KV. `data/apps.json` pode ser editado somente para manter o fallback/exemplo local, sem substituir o catálogo publicado.

Para uma integração automática, informe no painel um repositório no formato `usuario/repositorio` e crie uma release real no GitHub com os arquivos do aplicativo. Quando o fluxo manual for autorizado, use somente um link HTTPS real e verificável.

## Identidade visual

A identidade visual de referência utiliza:

- `#101010` — fundo principal;
- `#1A1A1A` — superfície;
- `#222222` — cards e áreas elevadas;
- `#FFFFFF` — texto principal;
- `#C8FF00` — destaque;
- `#A8A8A8` — texto secundário;
- `#6B6B6B` — texto de apoio.

A experiência deve preservar cards com glassmorphism, animações, microinterações, foco visível e suporte a movimento reduzido.

## Execução simples do frontend

Para servir somente os arquivos estáticos, execute na raiz do projeto:

```text
python3 -m http.server 8000
```

Depois abra `http://localhost:8000`.

Esse modo permite testar HTML, CSS, JavaScript, rotas hash e o fallback de `data/apps.json`. Um servidor HTTP simples não reproduz Cloudflare Pages Functions, Cloudflare KV, login administrativo ou a integração completa com GitHub Releases.

## Execução completa local

Para testar a aplicação completa, é necessário preparar um ambiente compatível com Cloudflare Pages Functions, como Wrangler, com configuração local dos bindings e valores de teste.

O ambiente completo deverá reproduzir, de forma segura:

- Functions em `functions/`;
- binding `ASC_KV`;
- `ADMIN_PASSWORD` para testes administrativos;
- `SESSION_SECRET` para sessões;
- `GITHUB_TOKEN` somente se necessário e nunca no repositório.

As credenciais locais devem ser fornecidas por mecanismo seguro e não devem ser gravadas nos arquivos versionados. Nenhum valor real de produção deve ser usado em testes destrutivos.

## Frontend e rotas

O frontend usa rotas por hash:

- `#/`
- `#/apps`
- `#/categorias`
- `#/app/<id>`
- `#/sobre`
- `#/privacidade`

O catálogo é carregado de `/api/apps`. Quando essa API não fornece dados válidos, o frontend tenta `data/apps.json`.

## Painel administrativo

O painel fica em `/admin/` e possui:

- login e logout;
- cadastro, edição e exclusão de aplicativos;
- categorias e plataformas;
- destaque na página inicial;
- link manual e repositório GitHub;
- ícone e capturas de tela;
- edição do contato;
- backup e restauração.

As operações administrativas usam as Pages Functions e persistem o catálogo no KV. Não editar o catálogo operacional diretamente sem backup e autorização.

## GitHub Releases

Quando um aplicativo possui um repositório no formato `usuario/repositorio`, as Functions consultam releases do GitHub e podem obter:

- versão;
- data;
- tamanho;
- histórico;
- arquivos de download por plataforma.

Os arquivos são classificados por extensão e nome. Os links devem apontar para releases reais; nunca inventar URLs.

As extensões atualmente documentadas são `.apk` para Android, `.exe` e `.msi` para Windows, `.dmg` e `.pkg` para macOS, `.AppImage`, `.deb` e `.rpm` para Linux, `.ipk` para LG e `.wgt` para Samsung. Arquivos `.apk` com `tv` ou `box` no nome são classificados para TV Box/Android TV. Arquivos compactados precisam indicar `win`, `mac`, `linux` ou `tv` no nome.

## Publicação

O projeto é publicado pelo Cloudflare Pages a partir da raiz do repositório.

Configuração documentada:

- build command vazio;
- diretório de saída na raiz;
- Functions em `functions/`;
- KV binding `ASC_KV`;
- secrets `ADMIN_PASSWORD` e `SESSION_SECRET`;
- `GITHUB_TOKEN` opcional.

Quando o repositório está conectado ao Cloudflare Pages, um push autorizado pode iniciar uma publicação automática conforme a configuração do projeto. O agente não deve fazer esse push ou deploy sem autorização explícita.

Push e deploy não devem ser feitos automaticamente por agentes. Antes de publicar:

1. revisar o diff;
2. executar os testes;
3. confirmar backup do catálogo KV;
4. verificar que nenhum secret está no diff;
5. obter autorização explícita para commit, push e deploy.

## Desenvolvimento seguro

- Preservar funcionalidades existentes.
- Não adicionar framework sem justificativa.
- Escapar conteúdo dinâmico vindo do JSON.
- Não expor credenciais.
- Não substituir o KV pelo JSON local.
- Manter acessibilidade, responsividade e suporte a Android TV.
- Testar antes de considerar uma etapa concluída.
- Documentar alterações em `CHANGELOG.md`.
- Consultar [AGENTS.md](AGENTS.md), [PROJECT_STATE.md](PROJECT_STATE.md), [ROADMAP.md](ROADMAP.md) e [TESTING.md](TESTING.md) antes de mudanças estruturais.

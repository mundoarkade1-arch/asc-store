# Estado atual do projeto

## Ambiente e controle de versão

- Repositório oficial: `mundoarkade1-arch/asc-store`.
- Branch de desenvolvimento: `main`.
- Commit inicial da nova cópia local: `e809096`.
- Cópia oficial de desenvolvimento: `C:\Users\janie\Documents\asc-store-dev`.
- O projeto utiliza Git e possui remote `origin` apontando para o repositório oficial.
- O diretório local foi clonado sem alterações pendentes no momento da preparação.

## Arquitetura atual

- Frontend estático em `index.html`, `css/` e `js/`.
- Dados locais de fallback em `data/apps.json`.
- Painel administrativo em `admin/`.
- Cloudflare Pages Functions em `functions/`.
- Imagens e identidade da marca em `assets/`.
- Headers de publicação em `_headers`.
- Não há `package.json`, processo de build ou framework frontend no repositório.
- Existe um `style.css` legado na raiz, separado do `css/style.css` usado pelo HTML.
- O repositório também contém uma cópia interna `asc-store-main/`; ela não deve ser usada como fonte de desenvolvimento.

## Funcionalidades existentes

- Página inicial com hero, destaques, estatísticas e instruções de instalação.
- Catálogo de aplicativos.
- Busca instantânea.
- Filtros por categoria e plataforma.
- Ordenação por atualização e nome.
- Páginas individuais por aplicativo usando rotas hash.
- Informações de versão, tamanho, requisito mínimo, downloads e histórico.
- Galeria de capturas quando os dados existem.
- Aviso de download.
- Menu responsivo.
- Animações, skeleton de carregamento e IntersectionObserver.
- Suporte a `prefers-reduced-motion`.
- Modo TV com navegação por setas, seleção e voltar.
- Página Sobre e política de privacidade.

## Painel e Functions

- Login administrativo por senha.
- Sessão em cookie assinado.
- Logout.
- Cadastro, edição e exclusão de aplicativos.
- Cadastro de repositório GitHub.
- Link manual de download.
- Upload e compressão de ícone e capturas no navegador.
- Backup e restauração do catálogo.
- Edição do e-mail de contato.
- Rate limiting de tentativas de login.
- Validação de origem e headers de segurança.

## Integrações

- Cloudflare Pages hospeda os arquivos estáticos.
- Cloudflare Pages Functions fornece a API.
- Cloudflare KV armazena o catálogo operacional e o cache de releases.
- GitHub Releases fornece versões e arquivos de download quando um repositório é cadastrado.
- Os bindings/secrets esperados são `ASC_KV`, `ADMIN_PASSWORD`, `SESSION_SECRET` e, opcionalmente, `GITHUB_TOKEN`.

## Fonte operacional do catálogo

O catálogo publicado no Cloudflare KV é a fonte operacional oficial. O arquivo `data/apps.json` contém apenas dados locais de fallback/exemplo e nunca deve substituir o catálogo publicado.

Na auditoria, o catálogo publicado continha três aplicativos: ASC Cine, ASC Lite e ASC Desk. Essa quantidade descreve apenas o estado observado naquele momento e não é uma garantia de que o catálogo continue igual.

O catálogo local atualmente não representa necessariamente o catálogo publicado. Qualquer sincronização ou backup deve ser feita por procedimento autorizado e seguro.

## Identidade visual de referência

- `#101010`
- `#1A1A1A`
- `#222222`
- `#FFFFFF`
- `#C8FF00`
- `#A8A8A8`
- `#6B6B6B`

## Pendências conhecidas

- Reformulação completa de UX/UI.
- Consolidação da documentação e do fluxo de desenvolvimento.
- Tratamento da cópia duplicada existente no repositório.
- Avaliação do `style.css` legado na raiz.
- Atualização, quando apropriado, dos dados locais de fallback do ASC Cine, incluindo descrição, tamanho, link, ícone e capturas.
- Revisão do e-mail de contato usado pelo fallback local.
- Revisão definitiva da política de privacidade.
- Avaliação opcional de fontes locais para Space Grotesk e Inter.
- Avaliação opcional de domínio próprio.
- Avaliação de ícones SVG por categoria.
- Evolução do catálogo e das páginas individuais sem substituir o estado operacional do KV.
- Testes completos em navegadores, celulares, tablets e dispositivos de TV.

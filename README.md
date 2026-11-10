# ASC STORE
Loja de aplicativos Android da ASC. Site estático (HTML/CSS/JS puros), sem build e sem Workers. Hospedagem: Cloudflare Pages.

## Como adicionar ou atualizar um app
Edite só `data/apps.json`. Copie um bloco de `apps`, troque os campos e cole o link real do APK (ex.: GitHub Releases) em `downloadUrl`. Com o campo vazio, o botão aparece como "Download em breve".
Ícone e capturas ficam em `assets/apps/<id>/`.

## Publicar
Cloudflare Pages: conecte o repositório, build command vazio, output directory `/` (raiz). Cada push publica automaticamente.
Depois troque `SEU-SITE.pages.dev` em `robots.txt` e `sitemap.xml` pelo seu endereço.

## Rodar localmente
`python3 -m http.server 8000` na pasta do projeto, e abra http://localhost:8000

## Painel de administração (/admin/)
Acesse `https://SEU-SITE/admin/` e entre com a senha. Cadastre apps, ícone, capturas e o repositório do GitHub.
Para lançar versão nova: no GitHub crie uma Release com tag `v1.0.1` e anexe o `.apk`. Em até 5 minutos o site mostra versão, tamanho, data, histórico e link novos.
Configuração no Cloudflare (uma vez): KV com binding `ASC_KV`; secrets `ADMIN_PASSWORD` e `SESSION_SECRET`; opcional `GITHUB_TOKEN`.

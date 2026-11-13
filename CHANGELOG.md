# Changelog
## 1.0.0 — 2026-11-09
- Primeira versão: hero, destaques, catálogo com busca/filtro/ordenação, detalhes do app, SEO básico.

## 1.1.0
- Painel /admin com login, cadastro de apps e links de APK atualizados pelas releases do GitHub (Pages Functions + KV).

## 1.2.0
- Política de privacidade (LGPD) e aviso de conteúdo na página Sobre; backup/restauração no admin.

## 2.0.0
- Visual novo a partir das imagens de referência (PC, TV e celular): fundo em degradê, menu em cápsula, cards de vidro com cor por app, animações, brilho que segue o mouse, esqueleto de carregamento, aviso ao baixar.
- Modo TV: setas, OK e voltar do controle remoto, anel de foco e barra de ajuda.
- Versão do app: lê o número de qualquer formato de tag, escolhe a maior versão e guarda a última leitura boa se o GitHub falhar.
- Cursor: seta normal em toda a tela (cursor de digitar só nos campos de texto).

## 2.0.1
- Corrigido: painel /admin (a página estava sobrescrita pela da loja) e caminhos relativos que quebravam CSS e logo.
- Segurança: checagem de origem em login/logout/salvar, cabeçalhos CSP e anti-embed, validação de caminho de imagem, mensagens claras quando o KV não está configurado.

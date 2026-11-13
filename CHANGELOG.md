# Changelog

## Unreleased

- Documentação permanente do projeto para arquitetura, estado, roadmap, testes e operação.
- Interface refinada com identidade ASC oficial, glassmorphism consistente, cabeçalho translúcido, menu mobile mais isolado, hero com iluminação equilibrada e ajustes para Android TV.
- Painel administrativo alinhado visualmente ao sistema de vidro e identidade ASC.
- Logo, cores de navegador e versionamento dos assets atualizados para evitar cache de CSS/JavaScript antigos.
- Rota de aplicativo inexistente passou a atualizar corretamente o título da página.
- API pública passou a tratar com segurança um catálogo KV sem lista válida de aplicativos.

## 2.0.1

- Corrigido: painel `/admin` (a página estava sobrescrita pela da loja) e caminhos relativos que quebravam CSS e logo.
- Segurança: checagem de origem em login/logout/salvar, cabeçalhos CSP e anti-embed, validação de caminho de imagem, mensagens claras quando o KV não está configurado.

## 2.0.0

- Visual novo a partir das imagens de referência (PC, TV e celular): fundo em degradê, menu em cápsula, cards de vidro com cor por app, animações, brilho que segue o mouse, esqueleto de carregamento, aviso ao baixar.
- Modo TV: setas, OK e voltar do controle remoto, anel de foco e barra de ajuda.
- Versão do app: lê o número de qualquer formato de tag, escolhe a maior versão e guarda a última leitura boa se o GitHub falhar.
- Cursor: seta normal em toda a tela (cursor de digitar só nos campos de texto).

## 1.2.0

- Política de privacidade (LGPD) e aviso de conteúdo na página Sobre; backup/restauração no admin.

## 1.1.0

- Painel `/admin` com login, cadastro de apps e links de APK atualizados pelas releases do GitHub (Pages Functions + KV).

## 1.0.0 — 2026-11-09

- Primeira versão: hero, destaques, catálogo com busca/filtro/ordenação, detalhes do app, SEO básico.

## Regras do histórico

- Registrar somente alterações realmente realizadas.
- Não inventar versões, datas, testes, integrações ou funcionalidades.
- Não registrar credenciais, tokens, secrets ou dados privados.
- Alterações futuras devem entrar primeiro em `Unreleased` e ser movidas para uma versão somente após implementação e validação.

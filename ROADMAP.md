# Roadmap da ASC Store

O roadmap organiza a reformulação sem quebrar as funcionalidades atuais. Cada fase só deve ser considerada concluída depois dos critérios de aceite e dos testes correspondentes.

## Fase 0 — Baseline e segurança

Prioridade: alta.

- Confirmar a raiz oficial e o fluxo Git.
- Preservar o catálogo operacional do Cloudflare KV.
- Manter backup verificável antes de alterações administrativas.
- Registrar arquitetura, integrações e limitações.

Critérios de conclusão:

- fonte de código identificada;
- catálogo remoto protegido;
- documentação atualizada;
- nenhum deploy sem autorização.

## Fase 1 — Arquitetura e qualidade

Prioridade: alta.

- Mapear componentes atuais.
- Reduzir duplicações documentais e arquivos legados com segurança.
- Definir padrões de dados, escape, validação e erros.
- Criar uma rotina de testes repetível.

Critérios de conclusão:

- responsabilidades de frontend, painel e Functions documentadas;
- nenhuma funcionalidade atual perdida;
- testes básicos reproduzíveis localmente.

## Fase 2 — Identidade visual e sistema de interface

Prioridade: alta.

- Consolidar as cores `#101010`, `#1A1A1A`, `#222222`, `#FFFFFF`, `#C8FF00`, `#A8A8A8` e `#6B6B6B`.
- Evoluir glassmorphism, cards, tipografia, espaçamento e estados de interação.
- Avaliar fontes Space Grotesk e Inter locais como melhoria opcional.
- Avaliar ícones SVG por categoria.
- Preservar contraste, foco visível e redução de movimento.

Critérios de conclusão:

- identidade aplicada de forma consistente;
- estados hover, focus, active e disabled definidos;
- validação em celular, desktop e TV.

## Fase 3 — Página inicial cinematográfica

Prioridade: alta.

- Melhorar hero, destaques, chamadas para ação e narrativa visual.
- Preservar carregamento por API e fallback local.
- Evitar conteúdo fictício ou links inventados.

Critérios de conclusão:

- carregamento sem erros;
- conteúdo vindo do catálogo correto;
- desempenho e acessibilidade validados.

## Fase 4 — Catálogo, busca e categorias

Prioridade: alta.

- Refinar pesquisa instantânea.
- Melhorar filtros por categoria e plataforma.
- Preservar ordenação e estados vazios.
- Avaliar paginação ou carregamento progressivo se o catálogo crescer.

Critérios de conclusão:

- resultados corretos;
- filtros combináveis quando suportados;
- navegação por teclado e TV funcionando;
- nenhum dado do KV substituído pelo JSON local.

## Fase 5 — Páginas individuais e downloads

Prioridade: alta.

- Evoluir detalhes do aplicativo.
- Melhorar galeria de imagens, metadados e histórico.
- Preservar downloads manuais e GitHub Releases.
- Validar classificação de arquivos por plataforma.

Critérios de conclusão:

- cada link aponta para uma origem real;
- versões e tamanhos são identificáveis;
- falhas do GitHub possuem comportamento seguro;
- downloads não são inventados nem quebrados.

## Fase 6 — Painel administrativo

Prioridade: alta.

- Melhorar UX de cadastro e edição.
- Preservar autenticação, validação, rate limiting e backup.
- Avaliar histórico de alterações e conflitos de edição.
- Avaliar armazenamento separado para imagens sem alterar o KV sem planejamento.

Critérios de conclusão:

- operações administrativas testadas;
- catálogo existente preservado;
- backup e restauração verificados;
- nenhum secret exposto.

## Fase 7 — Responsividade, TV e acessibilidade

Prioridade: média.

- Validar celulares, tablets, desktops e Android TV.
- Melhorar navegação por controle remoto.
- Testar foco, contraste, textos alternativos e redução de movimento.

Critérios de conclusão:

- sem rolagem horizontal indevida;
- rotas acessíveis por teclado e controle;
- layout utilizável nos tamanhos suportados.

## Fase 8 — Segurança e operação

Prioridade: alta.

- Revisar CSP, cookies, origem, headers e validações.
- Documentar backup e recuperação.
- Revisar limites do KV e armazenamento de imagens.
- Definir checklist pré-publicação.
- Revisar a política de privacidade definitiva.
- Avaliar domínio próprio como item opcional.

Critérios de conclusão:

- testes de segurança concluídos;
- procedimento de rollback documentado;
- nenhuma alteração externa automática.

## Fase 9 — Publicação controlada

Prioridade: alta.

- Executar testes completos.
- Revisar diff e arquivos alterados.
- Confirmar backup do catálogo operacional.
- Solicitar autorização explícita para commit, push e deploy.

Critérios de conclusão:

- testes aprovados;
- documentação atualizada;
- publicação autorizada e verificável.

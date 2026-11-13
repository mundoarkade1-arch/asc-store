# Procedimentos de teste

Este documento descreve verificações para o frontend, painel, Functions e integrações. Um servidor HTTP simples testa somente a parte estática; ele não reproduz Cloudflare Pages Functions, KV ou GitHub Releases.

## Preparação

1. Confirmar que a branch e o diff estão corretos.
2. Não usar o catálogo local para substituir o catálogo operacional.
3. Para testes completos, preparar um ambiente compatível com Cloudflare Pages Functions, como Wrangler, com bindings e valores de teste apropriados.
4. Nunca colocar secrets reais em arquivos, comandos, logs ou commits.
5. Fazer backup autorizado antes de testar operações administrativas com risco de escrita.

## Execução simples do frontend

Na raiz do projeto, um servidor HTTP local pode servir os arquivos estáticos:

```text
python3 -m http.server 8000
```

Essa execução permite testar HTML, CSS, JavaScript, rotas hash e o fallback local quando a API não estiver disponível. Ela não testa Functions, KV, login real ou integração completa com GitHub.

## Testes funcionais do frontend

- Abrir a página inicial sem erros no console.
- Confirmar hero, destaques, estatísticas e rodapé.
- Navegar por `#/`, `#/apps`, `#/categorias`, `#/sobre` e `#/privacidade`.
- Confirmar que `#/app/<id>` abre um aplicativo válido e trata IDs inexistentes.
- Digitar na busca e verificar filtragem instantânea.
- Testar categorias, plataformas e ordenação.
- Confirmar estados vazios e mensagens compreensíveis.
- Confirmar que a função de escape protege textos vindos do JSON.
- Verificar que download real abre o endereço fornecido e que ausência de URL mostra estado desabilitado.
- Confirmar histórico de versões, metadados e capturas quando existirem.
- Confirmar fallback para `data/apps.json` apenas quando a API não fornecer catálogo válido.

## Testes do painel administrativo

Em ambiente configurado para Functions e KV:

- abrir `/admin/`;
- confirmar que usuário não autenticado vê o login;
- testar login com credencial de teste autorizada;
- confirmar listagem do catálogo;
- testar criação, edição e exclusão apenas com dados de teste;
- testar categorias, plataformas, destaque e link manual;
- testar upload de ícone e capturas dentro dos limites existentes;
- testar edição do e-mail;
- baixar e validar backup;
- restaurar backup somente após confirmar o conteúdo;
- testar logout;
- confirmar que sessão expirada exige novo login;
- confirmar mensagens de erro para KV ausente, origem inválida e payload inválido.

## Testes responsivos

Verificar pelo menos:

- celular pequeno;
- celular grande;
- tablet em orientação vertical e horizontal;
- desktop comum;
- tela ampla;
- Android TV ou modo de teste `?tv=1`.

Confirmar:

- ausência de rolagem horizontal indevida;
- menu mobile utilizável;
- busca acessível;
- cards e botões sem sobreposição;
- galeria rolável quando necessário;
- rodapé legível;
- painel administrativo adaptado a telas estreitas.

## Acessibilidade e movimento

- Percorrer os controles com Tab e Shift+Tab.
- Confirmar foco visível.
- Testar link de salto para o conteúdo.
- Conferir textos alternativos e labels dos campos.
- Conferir contraste de texto, botões e estados de foco.
- Testar `prefers-reduced-motion`.
- Testar navegação por setas, seleção e voltar no modo TV.

## Testes de segurança

- Procurar secrets, tokens, senhas e cookies no diff.
- Confirmar que conteúdo do catálogo é escapado antes da renderização.
- Confirmar cookies `HttpOnly`, `Secure` e `SameSite` em ambiente publicado.
- Confirmar validação de origem nas operações administrativas.
- Confirmar rate limiting do login.
- Confirmar headers CSP, HSTS, `X-Frame-Options` e `X-Content-Type-Options`.
- Testar rejeição de imagens e payloads inválidos.
- Testar limites de tamanho.
- Confirmar que o painel não é indexado.
- Confirmar que links de download não foram inventados ou alterados indevidamente.

## Testes de integração

Com ambiente Cloudflare compatível:

- testar `/api/apps`;
- testar leitura do catálogo no KV;
- testar fallback quando KV/API não estiver disponível;
- testar consulta de releases públicas do GitHub;
- confirmar classificação de APK, Windows, macOS, Linux, webOS e Tizen;
- confirmar cache da última leitura válida;
- confirmar comportamento seguro quando GitHub estiver indisponível ou limitar requisições;
- confirmar que nenhuma operação local altera o KV sem ação administrativa explícita.

## Checklist antes de publicar

- [ ] testes funcionais concluídos;
- [ ] testes responsivos concluídos;
- [ ] acessibilidade revisada;
- [ ] segurança revisada;
- [ ] integrações verificadas;
- [ ] `git diff --check` sem erros;
- [ ] diff revisado integralmente;
- [ ] backup do catálogo operacional confirmado;
- [ ] nenhuma credencial no diff;
- [ ] autorização explícita para commit, push e deploy.

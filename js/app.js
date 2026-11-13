(() => {
  const $ = s => document.querySelector(s), main = $('#main'), root = document.documentElement;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt = d => { const t = new Date(d + 'T12:00:00'); return isNaN(t) ? '' : t.toLocaleDateString('pt-BR'); };
  const isNew = a => { const t = new Date(a.updatedAt); return !isNaN(t) && (Date.now() - t) / 864e5 <= 30; };
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
  let DATA = { apps: [], site: {} };
  root.classList.add('js');

  // Versão, tamanho e Android: sempre mostrar de forma limpa (ex.: "v1.0.3", "18.2 MB", "Android 8+")
  const verOf = v => { const s = String(v ?? '').trim(), m = s.match(/\d+(?:\.\d+)+/); if (m) return m[0]; const t = s.replace(/^v/i, ''); return /\d/.test(t) ? t : ''; };
  const sizeOf = s => /\d/.test(String(s ?? '')) ? String(s).trim() : '';
  const andOf = s => { const m = String(s ?? '').match(/\d+/); return m ? 'Android ' + m[0] + '+' : ''; };
  const accOf = a => { const k = { 'asc-play': 0, 'asc-cine': 1, 'asc-live': 2, 'asc-desk': 3 }[a.id]; if (k != null) return k; let h = 0; for (const c of String(a.id)) h = (h * 31 + c.charCodeAt(0)) % 4; return h; };

  const PL = { celular: 'Celular', tvbox: 'TV Box e Android TV', smarttv: 'Smart TV', desktop: 'Computador' };
  const dls = a => a.downloads?.length ? a.downloads : (a.downloadUrl ? [{ label: 'Download', name: '', url: a.downloadUrl, size: a.apkSize }] : []);
  const kind = d => /\.apk(\?|$)/i.test((d.name || '') + ' ' + (d.url || '')) ? 'Baixar APK' : 'Baixar';
  const plats = a => (a.platforms || []).length ? `<div class="plats">${a.platforms.map(p => esc(PL[p] || p)).join(' · ')}</div>` : '';
  const pills = a => [verOf(a.version) && 'v' + verOf(a.version), andOf(a.minAndroid), sizeOf(a.apkSize)].filter(Boolean).map(t => `<span class="pill">${esc(t)}</span>`).join('');
  const dl = a => { const d = dls(a);
    if (!d.length) return `<span class="btn pri" aria-disabled="true">Em breve</span>`;
    if (d.length > 1) return `<a class="btn pri" href="#/app/${esc(a.id)}">Escolher download</a>`;
    return `<a class="btn pri" href="${esc(d[0].url)}" rel="noopener" download>${kind(d[0])}</a>`; };
  const dlList = a => { const d = dls(a); return d.length ? `<h2>Downloads</h2><div class="dls">${d.map(x => `<a class="dl" href="${esc(x.url)}" rel="noopener" download><b>${esc(x.label)}</b><small>${esc(x.size || '')}${x.name ? ' · ' + esc(x.name) : ''}</small><span class="btn pri">${kind(x)}</span></a>`).join('')}</div>` : '<p class="empty">Download em breve.</p>'; };
  const card = (a, i) => `<article class="card ac${accOf(a)}" style="--i:${i}">
    <img class="ico" src="${esc(a.icon)}" alt="" width="78" height="78" loading="lazy">
    <h3>${esc(a.name)}${isNew(a) ? '<span class="tag">Atualizado</span>' : ''}</h3>
    <div class="meta">${esc(a.category)}</div>
    <p class="tg">${esc(a.tagline)}</p><div class="pills">${pills(a)}</div>${plats(a)}
    <div class="acts"><a class="btn" href="#/app/${esc(a.id)}">Conhecer</a>${dl(a)}</div></article>`;
  const skel = () => `<section class="blk wrap"><div class="grid">${[0, 1, 2].map(() => '<div class="card sk"><i></i><i></i><i></i></div>').join('')}</div></section>`;
  const steps = () => `<div class="steps">${[['Baixe o instalador', 'Escolha o app e toque em baixar.'], ['Libere a instalação', 'Se o aparelho pedir, permita instalar o arquivo baixado.'], ['Instale e entre', 'Abra o arquivo baixado e entre na sua conta.']].map((s, i) => `<div class="step"><b>${i + 1}</b><div><h3>${s[0]}</h3><p>${s[1]}</p></div></div>`).join('')}</div>`;
  const sv = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const IC = { tv: sv('<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>'), play: sv('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M10 9v6l5-3z"/>'), shield: sv('<path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z"/><path d="m9 12 2 2 4-4"/>'),
    celular: sv('<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>'), tvbox: sv('<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>'), smarttv: sv('<rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>'),
    desktop: sv('<rect x="4.5" y="5" width="15" height="10" rx="1.5"/><path d="M2.5 19h19l-1.5-4h-16z"/>'), grid: sv('<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>') };

  function setMeta(t, d) {
    document.title = t ? `${t} — ASC STORE` : 'ASC STORE — Seus aplicativos. Um só lugar.';
    if (d) document.querySelector('meta[name=description]').content = d;
  }
  // Aparecer ao rolar e contar números
  let io;
  function reveal() {
    const els = main.querySelectorAll('.rv'); if (!els.length) return;
    if (!('IntersectionObserver' in window) || reduce) { els.forEach(e => e.classList.add('in')); return; }
    io = io || new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
    els.forEach(e => io.observe(e));
  }
  function count(el) {
    const n = +el.dataset.n; if (reduce || !n) return; const t0 = performance.now();
    const step = t => { const p = Math.min(1, (t - t0) / 900); el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  function home() {
    setMeta('', 'Conheça, explore e baixe os aplicativos da ASC para celular, TV Box, Smart TV e computador.');
    const feat = DATA.apps.filter(a => a.featured), n = DATA.apps.length;
    // Faixa que rola: nomes vêm do catálogo (nunca escritos à mão); repete até encher a tela
    const names = DATA.apps.map(a => String(a.name || '').toUpperCase()).filter(Boolean), pool = names.length ? names : ['ASC STORE'], items = [];
    while (items.length < 12) items.push(...pool);
    const grp = items.map(t => `<span>${esc(t)}</span><i>/</i>`).join('');
    main.innerHTML = `<section class="hero"><div class="hw"><div class="hl">
      <p class="eb">Novo • Apps para celular, TV e computador</p>
      <h1><span>Baixe.</span><span class="l2">Assista.</span><span>Repita.</span></h1>
      <p class="lead">Os aplicativos da ASC para o celular, a TV e o computador. Tudo em um só lugar.</p>
      <div class="row"><a class="btn pri big" href="#/apps">Ver aplicativos</a><a class="btn big" href="#/categorias">Categorias</a></div>
      <div class="stats"><div><b data-n="${n}">${n}</b><span>${n === 1 ? 'app' : 'apps'}</span></div><div><b>3</b><span>tipos de aparelho</span></div><div><b>HD</b><span>e Full HD</span></div></div></div>
      <div class="devices" id="devices" aria-hidden="true"><div class="dv">
        <div class="dev tvd"><div class="dscr"><i class="u-top"></i><i class="u-ban"></i><span class="u-row"><i></i><i></i><i></i><i></i></span></div></div>
        <div class="dev lap"><div class="lscr"><div class="dscr"><i class="u-top"></i><i class="u-ban"></i><span class="u-row"><i></i><i></i><i></i></span></div></div><div class="lbase"></div></div>
        <div class="dev ph"><div class="dscr"><i class="u-top"></i><i class="u-ban"></i><i class="u-li"></i><i class="u-li"></i><i class="u-li"></i><i class="u-bt"></i></div></div>
        <div class="fchip"><b>3</b><span>celular, TV e computador</span></div></div></div></div></section>
      <div class="mq" aria-hidden="true"><div class="mq-t"><div class="mq-g">${grp}</div><div class="mq-g">${grp}</div></div></div>
      <section class="blk wrap" id="escolha"><div class="head c"><h2>Escolha seu app</h2><p>Cada app com sua própria identidade. Mesma qualidade.</p></div>
      <div class="grid">${feat.map(card).join('') || '<p class="empty">Nenhum destaque cadastrado.</p>'}</div>
      <p class="more"><a class="btn" href="#/apps">Ver todos os aplicativos</a></p></section>
      <section class="blk wrap rv gl"><div class="head c"><h2>Feito para quem ama assistir</h2></div><div class="feats">
        <div class="feat big"><i>${IC.tv}</i><h3>TV ao vivo + EPG</h3><p>Veja o que passa agora e a seguir.</p></div>
        <div class="feat"><i>${IC.play}</i><h3>Filmes e séries</h3><p>Prévias organizadas e busca rápida.</p></div>
        <div class="feat"><i>${IC.shield}</i><h3>Rápido e seguro</h3><p>Interface leve e controle com PIN.</p></div>
        <div class="feat num"><b data-n="${n}">${n}</b><div><h3>${n === 1 ? 'aplicativo' : 'aplicativos'}</h3><p>Para celular, TV e computador.</p></div></div></div></section>
      <section class="blk wrap rv"><div class="head c"><h2>Como instalar</h2></div>${steps()}</section>`;
    main.querySelectorAll('[data-n]').forEach(count);
  }

  // Categorias: por tipo de app e por aparelho. Cada item abre o catálogo já filtrado.
  function categorias() {
    setMeta('Categorias', 'Veja os aplicativos da ASC por tipo e por aparelho: celular, TV Box, Smart TV e computador.');
    const cats = [...new Set(DATA.apps.map(a => a.category).filter(Boolean))].sort();
    const nC = c => DATA.apps.filter(a => a.category === c).length, nP = k => DATA.apps.filter(a => (a.platforms || []).includes(k)).length;
    const tile = (href, icon, name, n) => `<a class="cat" href="${href}"><i>${icon}</i><span><b>${esc(name)}</b><small>${n ? n + (n === 1 ? ' aplicativo' : ' aplicativos') : 'Em breve'}</small></span><em aria-hidden="true">→</em></a>`;
    main.innerHTML = `<section class="blk wrap"><div class="head"><h2>Categorias</h2></div>
      <h3 class="sub">Por tipo de app</h3><div class="cats">${tile('#/apps', IC.grid, 'Todos os aplicativos', DATA.apps.length)}${cats.map(c => tile('#/apps?cat=' + encodeURIComponent(c), IC.play, c, nC(c))).join('')}</div>
      <h3 class="sub">Por aparelho</h3><div class="cats">${Object.entries(PL).map(([k, v]) => tile('#/apps?plat=' + k, IC[k], v, nP(k))).join('')}</div></section>`;
  }

  function apps(params) {
    setMeta('Aplicativos', 'Catálogo completo de aplicativos da ASC para celular, TV Box, Smart TV e computador.');
    const cats = [...new Set(DATA.apps.map(a => a.category))].sort();
    let st = { q: params.get('q') || '', cat: params.get('cat') || '', sort: 'recent', plat: PL[params.get('plat')] ? params.get('plat') : '' };
    main.innerHTML = `<section class="blk wrap"><div class="head"><h2>Catálogo completo</h2></div>
      <div class="tools"><div class="chips" id="chips" role="group" aria-label="Categorias"></div>
      <select id="plat" aria-label="Plataforma"><option value="">Todas as plataformas</option>${Object.entries(PL).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select><select id="sort" aria-label="Ordenar por"><option value="recent">Mais recentes</option><option value="name">Nome (A–Z)</option></select></div>
      <div class="grid" id="list" aria-live="polite"></div></section>`;
    const chips = $('#chips'), list = $('#list'), q = $('#q');
    q.value = st.q; $('#plat').value = st.plat;
    const draw = () => {
      chips.innerHTML = ['', ...cats].map(c => `<button class="chip" data-c="${esc(c)}" aria-pressed="${st.cat === c}">${c ? esc(c) : 'Todas'}</button>`).join('');
      const t = st.q.trim().toLowerCase();
      let r = DATA.apps.filter(a => (!st.cat || a.category === st.cat) && (!st.plat || (a.platforms || []).includes(st.plat)) &&
        (!t || [a.name, a.tagline, a.description, a.category].join(' ').toLowerCase().includes(t)));
      r.sort(st.sort === 'name' ? (a, b) => a.name.localeCompare(b.name) : (a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
      list.innerHTML = r.map(card).join('') || '<p class="empty">Nenhum aplicativo encontrado. Tente outra busca ou categoria.</p>';
    };
    chips.onclick = e => { const b = e.target.closest('.chip'); if (b) { st.cat = b.dataset.c; draw(); } };
    $('#plat').onchange = e => { st.plat = e.target.value; draw(); };
    $('#sort').onchange = e => { st.sort = e.target.value; draw(); };
    q.oninput = () => { st.q = q.value; draw(); };
    draw();
  }

  function detail(id) {
    const a = DATA.apps.find(x => x.id === id);
    if (!a) { setMeta('Aplicativo não encontrado'); main.innerHTML = '<div class="wrap prose"><h1>Aplicativo não encontrado</h1><p><a href="#/apps">Voltar ao catálogo</a></p></div>'; return; }
    setMeta(a.name, a.tagline);
    const v = verOf(a.version), sz = sizeOf(a.apkSize), up = fmt(a.updatedAt);
    main.innerHTML = `<section class="det wrap ac${accOf(a)}"><a class="back" href="#/apps">← Voltar ao catálogo</a>
      <div class="dh"><img class="ico" src="${esc(a.icon)}" alt="Ícone do ${esc(a.name)}"><div><h1>${esc(a.name)}</h1><p class="meta">${esc(a.category)}${isNew(a) ? '<span class="tag">Atualizado</span>' : ''}</p><div class="pills">${pills(a)}</div></div></div>
      ${plats(a)}
      <p class="desc">${esc(a.description)}</p>${dlList(a)}
      <div class="facts"><div><small>Versão atual</small><b>${v ? 'v' + esc(v) : '—'}</b></div><div><small>Tamanho</small><b>${esc(sz) || '—'}</b></div>
      <div><small>Atualizado em</small><b>${up || '—'}</b></div><div><small>Requisitos mínimos</small><b>${esc(a.minAndroid)}</b></div></div>
      ${a.screenshots?.length ? `<h2>Capturas de tela</h2><div class="shots">${a.screenshots.map((s, i) => `<img src="${esc(s)}" alt="Captura de tela ${i + 1} do ${esc(a.name)}" loading="lazy">`).join('')}</div>` : ''}
      <h2>Como instalar</h2>${steps()}
      <h2>Histórico de versões</h2><ul class="hist">${(a.changelog || []).map(c => `<li><b>v${esc(verOf(c.version) || c.version)}</b> <span class="meta">${fmt(c.date)}</span><ul>${(c.notes || []).map(n => `<li>${esc(n)}</li>`).join('')}</ul></li>`).join('')}</ul></section>`;
  }

  const page = (t, body) => { setMeta(t); main.innerHTML = `<div class="wrap prose"><h1>${t}</h1>${body}</div>`; };

  function route() {
    const [path, qs] = (location.hash.slice(1) || '/').split('?'), p = new URLSearchParams(qs || '');
    const seg = path.split('/').filter(Boolean);
    const cur = seg[0] === 'app' ? 'apps' : seg[0] === 'categorias' ? 'cats' : seg[0] || 'home';
    $('#nav').querySelectorAll('a').forEach(a => a.classList.toggle('on', a.dataset.r === cur));
    if (!seg.length) home();
    else if (seg[0] === 'apps') apps(p);
    else if (seg[0] === 'categorias') categorias();
    else if (seg[0] === 'app') detail(seg[1]);
    else if (seg[0] === 'sobre') page('Sobre a ASC STORE', '<p>A ASC STORE é a plataforma própria da ASC para distribuir seus aplicativos para celular, TV Box, Smart TV e computador. Aqui você conhece cada aplicativo, vê as novidades de cada versão e baixa o arquivo certo para o seu aparelho.</p><p><b>Sobre conteúdo:</b> os aplicativos de reprodução, como o ASC Cine, são apenas reprodutores. Eles não fornecem, não hospedam e não incluem filmes, séries ou listas de terceiros. Cada usuário é responsável pelas listas que utiliza e deve respeitar os direitos autorais.</p><p>No Android e no Android TV, para instalar um APK o sistema pode pedir permissão para instalar de fontes desconhecidas. No Windows, programas novos podem exibir um aviso de segurança. Baixe sempre por esta página.</p>');
    else if (seg[0] === 'privacidade') page('Política de privacidade', '<p>Atualizada em 10 de novembro de 2026.</p><p><b>Quem somos.</b> A ASC STORE é uma plataforma de distribuição de aplicativos da ASC.</p><p><b>Dados que coletamos.</b> O site não exige cadastro e não pede dados pessoais. Não usamos ferramentas de análise nem de publicidade. Como em qualquer site, a infraestrutura (Cloudflare) processa dados técnicos de acesso, como endereço IP e tipo de navegador, para entregar as páginas e garantir a segurança.</p><p><b>Downloads.</b> Os arquivos de instalação são baixados de serviços externos, como o GitHub, que têm suas próprias políticas de privacidade.</p><p><b>Aplicativos.</b> Cada aplicativo pode tratar dados de forma própria. O ASC Cine é um reprodutor de listas IPTV e não fornece nem hospeda conteúdo; as listas utilizadas são de responsabilidade do usuário.</p><p><b>Seus direitos.</b> Conforme a LGPD (Lei 13.709/2018), você pode pedir informações, correção ou exclusão de dados pessoais que tenhamos sobre você, escrevendo para ' + (DATA.site?.contactEmail ? esc(DATA.site.contactEmail) : 'o e-mail de contato indicado no rodapé') + '.</p>');
    else page('Página não encontrada', '<p><a href="#/">Voltar ao início</a></p>');
    if (seg[0] !== 'apps') window.scrollTo(0, 0);
    reveal(); closeMenu();
    if (isTV) { const f = main.querySelector('a[href],button'); if (f) f.focus({ preventScroll: true }); }
  }

  // Menu do celular
  const top = $('#top'), burger = $('#burger');
  function closeMenu() { top.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Abrir menu'); }
  burger.onclick = () => { const o = top.classList.toggle('open'); burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Fechar menu' : 'Abrir menu'); };
  $('#menu').addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });

  // Brilho que acompanha o mouse nos cards e movimento leve dos celulares
  document.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch' || !e.target.closest) return;
    const c = e.target.closest('.card');
    if (c) { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px'); }
    const ph = $('#devices');
    if (ph && !reduce) ph.style.transform = `translate(${((e.clientX / innerWidth) - .5) * -14}px,${((e.clientY / innerHeight) - .5) * -10}px)`;
  }, { passive: true });
  // Barra do topo encolhe ao rolar; aparelhos do hero sobem um pouco (parallax)
  const onScroll = () => { top.classList.toggle('sc', scrollY > 20); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Aviso ao baixar
  let tt; const toast = t => { const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => el.classList.remove('on'), 3800); };
  document.addEventListener('click', e => { if (e.target.closest('a[download]')) toast('Download iniciado. Quando terminar, abra o arquivo para instalar.'); });

  // Modo TV: controle remoto (setas, OK e voltar)
  const isTV = /Tizen|Web0S|WebOS|SMART-TV|SmartTV|HbbTV|BRAVIA|NetCast|CrKey|Android TV|AndroidTV|AFT[A-Z]|MiBOX|TV Box/i.test(navigator.userAgent) || /[?&]tv=1/.test(location.search) ||
    (window.matchMedia && innerWidth >= 1280 && !matchMedia('(pointer:fine)').matches && !matchMedia('(hover:hover)').matches);
  if (isTV) {
    root.classList.add('tv');
    const vis = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; };
    const move = dir => {
      const all = [...document.querySelectorAll('a[href],button:not([disabled]),select,input')].filter(vis), cur = document.activeElement;
      if (!cur || cur === document.body || !all.includes(cur)) { if (all[0]) all[0].focus(); return; }
      const r = cur.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2; let best = null, bs = 1e9;
      all.forEach(el => { if (el === cur) return; const b = el.getBoundingClientRect(), dx = b.left + b.width / 2 - cx, dy = b.top + b.height / 2 - cy;
        const pr = dir === 'right' ? dx : dir === 'left' ? -dx : dir === 'down' ? dy : -dy, sd = (dir === 'left' || dir === 'right') ? Math.abs(dy) : Math.abs(dx);
        if (pr <= 4) return; const s = pr + sd * 2.5; if (s < bs) { bs = s; best = el; } });
      if (best) { best.focus({ preventScroll: true }); best.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' }); }
    };
    document.addEventListener('keydown', e => {
      const k = e.key, c = e.keyCode, typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName);
      const d = k === 'ArrowRight' || c === 39 ? 'right' : k === 'ArrowLeft' || c === 37 ? 'left' : k === 'ArrowDown' || c === 40 ? 'down' : k === 'ArrowUp' || c === 38 ? 'up' : '';
      if (d && !(typing && (d === 'left' || d === 'right')) && document.activeElement?.tagName !== 'SELECT') { e.preventDefault(); move(d); return; }
      if (k === 'Escape' || k === 'GoBack' || k === 'BrowserBack' || k === 'XF86Back' || c === 10009 || c === 461 || (k === 'Backspace' && !typing)) { e.preventDefault(); if (location.hash && location.hash !== '#/') history.back(); }
    });
  }

  $('#searchForm').onsubmit = e => { e.preventDefault(); location.hash = '/apps?q=' + encodeURIComponent($('#q').value); };
  $('#q').addEventListener('input', () => { if (!location.hash.startsWith('#/apps')) location.hash = '/apps?q=' + encodeURIComponent($('#q').value); });
  $('#yr').textContent = new Date().getFullYear();
  window.addEventListener('hashchange', route);

  main.innerHTML = skel();
  fetch('/api/apps', { cache: 'no-cache' }).then(r => { if (!r.ok) throw 0; return r.json(); }).then(d => d.empty ? Promise.reject() : d)
    .catch(() => fetch('/data/apps.json', { cache: 'no-cache' }).then(r => r.json())).then(d => {
    DATA = d;
    if (d.site?.contactEmail) { const c = $('#contact'); c.href = 'mailto:' + d.site.contactEmail; c.textContent = d.site.contactEmail; }
    route();
  }).catch(() => { main.innerHTML = '<p class="empty wrap">Não foi possível carregar o catálogo. Tente novamente em instantes.</p>'; });
})();

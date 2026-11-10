(() => {
  const $ = s => document.querySelector(s), main = $('#main');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt = d => new Date(d + 'T12:00:00').toLocaleDateString('pt-BR');
  const isNew = a => (Date.now() - new Date(a.updatedAt)) / 864e5 <= 30;
  let DATA = { apps: [], site: {} };

  const dl = a => a.downloadUrl
    ? `<a class="btn pri" href="${esc(a.downloadUrl)}" rel="noopener" download>Baixar APK</a>`
    : `<span class="btn pri" aria-disabled="true">Download em breve</span>`;
  const card = a => `<article class="card">
    <div class="ch"><img class="ico" src="${esc(a.icon)}" alt="" width="64" height="64" loading="lazy">
    <div><h3>${esc(a.name)}${isNew(a) ? '<span class="tag">Atualizado</span>' : ''}</h3><div class="meta">${esc(a.category)} · v${esc(a.version)}</div></div></div>
    <p>${esc(a.tagline)}</p>
    <div class="acts"><a class="btn" href="#/app/${esc(a.id)}">Conhecer</a>${dl(a)}</div></article>`;

  function setMeta(t, d) {
    document.title = t ? `${t} — ASC STORE` : 'ASC STORE — Seus aplicativos. Um só lugar.';
    if (d) document.querySelector('meta[name=description]').content = d;
  }

  function home() {
    setMeta('', 'Conheça, explore e baixe os aplicativos Android desenvolvidos pela ASC.');
    const feat = DATA.apps.filter(a => a.featured);
    main.innerHTML = `<section class="hero"><div class="wrap"><div>
      <h1>Seus aplicativos.<span>Um só lugar.</span></h1>
      <p>Conheça, explore e baixe os aplicativos desenvolvidos pela ASC.</p>
      <div class="row"><a class="btn pri" href="#/apps">Explorar aplicativos</a><a class="btn" href="#/sobre">Sobre a ASC STORE</a></div></div>
      <div class="phone" aria-hidden="true"><div class="screen"><i></i><i></i><i></i><i></i><i></i></div></div></div></section>
      <section class="blk wrap"><div class="head"><h2>Aplicativos em destaque</h2><a href="#/apps">Ver todos</a></div>
      <div class="grid">${feat.map(card).join('') || '<p class="empty">Nenhum destaque cadastrado.</p>'}</div></section>`;
  }

  function apps(params) {
    setMeta('Aplicativos', 'Catálogo completo de aplicativos Android da ASC.');
    const cats = [...new Set(DATA.apps.map(a => a.category))].sort();
    let st = { q: params.get('q') || '', cat: params.get('cat') || '', sort: 'recent' };
    main.innerHTML = `<section class="blk wrap"><div class="head"><h2>Catálogo completo</h2></div>
      <div class="tools"><div class="chips" id="chips" role="group" aria-label="Categorias"></div>
      <select id="sort" aria-label="Ordenar por"><option value="recent">Mais recentes</option><option value="name">Nome (A–Z)</option></select></div>
      <div class="grid" id="list" aria-live="polite"></div></section>`;
    const chips = $('#chips'), list = $('#list'), q = $('#q');
    q.value = st.q;
    const draw = () => {
      chips.innerHTML = ['', ...cats].map(c => `<button class="chip" data-c="${esc(c)}" aria-pressed="${st.cat === c}">${c ? esc(c) : 'Todas'}</button>`).join('');
      const t = st.q.trim().toLowerCase();
      let r = DATA.apps.filter(a => (!st.cat || a.category === st.cat) &&
        (!t || [a.name, a.tagline, a.description, a.category].join(' ').toLowerCase().includes(t)));
      r.sort(st.sort === 'name' ? (a, b) => a.name.localeCompare(b.name) : (a, b) => b.updatedAt.localeCompare(a.updatedAt));
      list.innerHTML = r.map(card).join('') || '<p class="empty">Nenhum aplicativo encontrado. Tente outra busca ou categoria.</p>';
    };
    chips.onclick = e => { const b = e.target.closest('.chip'); if (b) { st.cat = b.dataset.c; draw(); } };
    $('#sort').onchange = e => { st.sort = e.target.value; draw(); };
    q.oninput = () => { st.q = q.value; draw(); };
    draw();
  }

  function detail(id) {
    const a = DATA.apps.find(x => x.id === id);
    if (!a) { main.innerHTML = '<div class="wrap prose"><h1>Aplicativo não encontrado</h1><p><a href="#/apps" style="color:var(--lime)">Voltar ao catálogo</a></p></div>'; return; }
    setMeta(a.name, a.tagline);
    main.innerHTML = `<section class="det wrap"><a class="back" href="#/apps">← Voltar ao catálogo</a>
      <div class="dh"><img class="ico" src="${esc(a.icon)}" alt="Ícone do ${esc(a.name)}"><div><h1>${esc(a.name)}</h1><p class="meta">${esc(a.category)}${isNew(a) ? '<span class="tag">Atualizado</span>' : ''}</p></div>
      <div style="margin-left:auto">${dl(a)}</div></div>
      <p style="color:var(--mut);max-width:70ch">${esc(a.description)}</p>
      <div class="facts"><div><small>Versão atual</small><b>${esc(a.version)}</b></div><div><small>Tamanho do APK</small><b>${esc(a.apkSize)}</b></div>
      <div><small>Atualizado em</small><b>${fmt(a.updatedAt)}</b></div><div><small>Requisitos mínimos</small><b>${esc(a.minAndroid)}</b></div></div>
      ${a.screenshots?.length ? `<h2>Capturas de tela</h2><div class="shots" style="margin:1rem 0 2rem">${a.screenshots.map((s, i) => `<img src="${esc(s)}" alt="Captura de tela ${i + 1} do ${esc(a.name)}" loading="lazy">`).join('')}</div>` : ''}
      <h2>Histórico de versões</h2><ul class="hist">${(a.changelog || []).map(c => `<li><b>v${esc(c.version)}</b> <span class="meta">${fmt(c.date)}</span><ul>${c.notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul></li>`).join('')}</ul></section>`;
  }

  const page = (t, body) => { setMeta(t); main.innerHTML = `<div class="wrap prose"><h1>${t}</h1>${body}</div>`; };

  function route() {
    const [path, qs] = (location.hash.slice(1) || '/').split('?'), p = new URLSearchParams(qs || '');
    const seg = path.split('/').filter(Boolean);
    $('#nav').querySelectorAll('a').forEach(a => a.classList.toggle('on', a.dataset.r === (seg[0] === 'app' ? 'apps' : seg[0] || 'home')));
    if (!seg.length) home();
    else if (seg[0] === 'apps') apps(p);
    else if (seg[0] === 'app') detail(seg[1]);
    else if (seg[0] === 'sobre') page('Sobre a ASC STORE', '<p>A ASC STORE é a plataforma própria da ASC para distribuir aplicativos Android. Aqui você conhece cada aplicativo, vê as novidades de cada versão e baixa o APK direto da fonte.</p><p>Para instalar um APK, o Android pode pedir para permitir a instalação de fontes desconhecidas nas configurações do aparelho.</p>');
    else if (seg[0] === 'privacidade') page('Política de privacidade', '<p>EXEMPLO: substitua por sua política. Este site não exige cadastro e não coleta dados pessoais por conta própria. Os downloads são feitos em serviços externos (como o GitHub), que seguem suas próprias políticas.</p>');
    else page('Página não encontrada', '<p><a href="#/" style="color:var(--lime)">Voltar ao início</a></p>');
    if (seg[0] !== 'apps') window.scrollTo(0, 0);
  }

  $('#searchForm').onsubmit = e => { e.preventDefault(); location.hash = '/apps?q=' + encodeURIComponent($('#q').value); };
  $('#q').addEventListener('input', () => { if (!location.hash.startsWith('#/apps')) location.hash = '/apps?q=' + encodeURIComponent($('#q').value); });
  $('#catLink').onclick = e => { e.preventDefault(); location.hash = '/apps'; setTimeout(() => $('#chips')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50); };
  $('#yr').textContent = new Date().getFullYear();
  window.addEventListener('hashchange', route);

  fetch('/api/apps').then(r => { if (!r.ok) throw 0; return r.json(); }).then(d => d.empty ? Promise.reject() : d)
    .catch(() => fetch('data/apps.json').then(r => r.json())).then(d => {
    DATA = d;
    if (d.site?.contactEmail) { const c = $('#contact'); c.href = 'mailto:' + d.site.contactEmail; c.textContent = d.site.contactEmail; }
    route();
  }).catch(() => { main.innerHTML = '<p class="empty wrap">Não foi possível carregar o catálogo. Tente novamente em instantes.</p>'; });
})();

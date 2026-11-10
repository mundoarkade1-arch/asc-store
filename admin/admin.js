(() => {
  const $ = s => document.querySelector(s), F = id => $('#f-' + id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let cat = { site: {}, apps: [] }, cur = null, icon = '', shots = [];
  const msg = (t, e) => { const m = $('#msg'); m.textContent = t; m.className = 'msg' + (e ? ' err' : ''); };
  async function api(method, url, body) {
    const r = await fetch(url, { method, headers: { 'content-type': 'application/json' }, body: body && JSON.stringify(body) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(d.error || 'Erro inesperado.'), { status: r.status });
    return d;
  }
  const show = login => { $('#login').hidden = !login; $('#panel').hidden = login; $('#out').hidden = login; };
  const load = f => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = URL.createObjectURL(f); });
  async function shrink(f, w, h, fit, type, q) {
    const i = await load(f), c = document.createElement('canvas'), x = c.getContext('2d');
    if (fit === 'cover') { c.width = w; c.height = h; const s = Math.max(w / i.width, h / i.height); x.drawImage(i, (w - i.width * s) / 2, (h - i.height * s) / 2, i.width * s, i.height * s); }
    else { const s = Math.min(1, h / i.height); c.width = i.width * s; c.height = i.height * s; x.drawImage(i, 0, 0, c.width, c.height); }
    return c.toDataURL(type, q);
  }
  function list() {
    $('#list').innerHTML = cat.apps.map((a, i) => `<div class="item r"><img class="ico" src="${esc(a.icon)}" alt="" style="width:48px;height:48px"><div style="flex:1"><b>${esc(a.name)}</b><div class="meta">${esc(a.category)} · ${a.repo ? esc(a.repo) + ' (automático)' : 'link manual'}</div></div><button class="btn" data-e="${i}">Editar</button><button class="btn" data-d="${i}">Excluir</button></div>`).join('') || '<p class="meta">Nenhum aplicativo ainda. Clique em "Novo aplicativo".</p>';
    $('#email').value = cat.site?.contactEmail || '';
  }
  function edit(i) {
    cur = i; const a = i == null ? {} : cat.apps[i];
    F('name').value = a.name || ''; F('tagline').value = a.tagline || ''; F('description').value = a.description || '';
    F('category').value = a.category || ''; F('min').value = a.minAndroid || ''; F('repo').value = a.repo || '';
    F('featured').checked = !!a.featured; document.querySelectorAll('#plats input').forEach(c => { c.checked = (a.platforms || []).includes(c.value); }); F('url').value = a.downloadUrl || ''; F('version').value = a.version || ''; F('size').value = a.apkSize || '';
    icon = a.icon || ''; shots = a.screenshots || []; $('#prev').src = icon; F('icon').value = ''; F('shots').value = '';
    $('#form').hidden = false; $('#form').scrollIntoView({ behavior: 'smooth' });
  }
  async function persist(ok) {
    try { await api('PUT', '/api/admin/apps', cat); msg(ok); }
    catch (e) { msg(e.message, 1); if (e.status === 401) show(true); }
  }
  async function init() { try { cat = await api('GET', '/api/admin/apps'); show(false); list(); } catch { show(true); } }

  $('#login').onsubmit = async e => { e.preventDefault(); try { await api('POST', '/api/login', { password: $('#pw').value }); $('#pw').value = ''; $('#lmsg').textContent = ''; init(); } catch (x) { $('#lmsg').textContent = x.message; } };
  $('#out').onclick = async () => { await api('POST', '/api/logout'); show(true); };
  $('#new').onclick = () => edit(null);
  $('#cancel').onclick = () => { $('#form').hidden = true; };
  $('#list').onclick = async e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.e) edit(+b.dataset.e);
    if (b.dataset.d && confirm('Excluir este aplicativo da loja?')) { cat.apps.splice(+b.dataset.d, 1); await persist('Aplicativo excluído.'); list(); }
  };
  F('icon').onchange = async e => { const f = e.target.files[0]; if (f) { icon = await shrink(f, 192, 192, 'cover', 'image/webp', .9); $('#prev').src = icon; } };
  F('shots').onchange = async e => { shots = []; for (const f of [...e.target.files].slice(0, 4)) shots.push(await shrink(f, 0, 640, 'fit', 'image/jpeg', .75)); msg(shots.length + ' captura(s) prontas. Clique em Salvar.'); };
  $('#form').onsubmit = async e => {
    e.preventDefault();
    const name = F('name').value.trim(), old = cur == null ? {} : cat.apps[cur];
    const repo = F('repo').value.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '').replace(/\/$/, '');
    if (repo && !/^[\w.-]+\/[\w.-]+$/.test(repo)) return msg('Repositório inválido. Use o formato usuario/repositorio.', 1);
    const id = old.id || name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (cur == null && cat.apps.some(a => a.id === id)) return msg('Já existe um aplicativo com esse nome.', 1);
    const app = { ...old, id, name, tagline: F('tagline').value.trim(), description: F('description').value.trim(), category: F('category').value.trim(),
      minAndroid: F('min').value.trim(), repo, featured: F('featured').checked, platforms: [...document.querySelectorAll('#plats input:checked')].map(c => c.value), downloadUrl: F('url').value.trim(), version: F('version').value.trim(),
      apkSize: F('size').value.trim(), icon, screenshots: shots };
    cur == null ? cat.apps.push(app) : (cat.apps[cur] = app);
    await persist('Salvo! O site já mostra as mudanças.'); list(); $('#form').hidden = true;
  };
  $('#saveSite').onclick = async () => { cat.site = { contactEmail: $('#email').value.trim() }; await persist('E-mail salvo.'); };
  $('#bk').onclick = () => { const l = document.createElement('a'); l.href = URL.createObjectURL(new Blob([JSON.stringify(cat)], { type: 'application/json' })); l.download = 'asc-store-backup-' + new Date().toISOString().slice(0, 10) + '.json'; l.click(); };
  $('#rs').onchange = async e => { const f = e.target.files[0]; if (!f) return; try { const d = JSON.parse(await f.text()); if (!Array.isArray(d.apps)) throw 0; if (!confirm('Substituir o catálogo atual pelo backup?')) return; cat = d; await persist('Backup restaurado.'); list(); } catch { msg('Arquivo de backup inválido.', 1); } e.target.value = ''; };
  init();
})();

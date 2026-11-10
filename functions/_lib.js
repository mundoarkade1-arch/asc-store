const enc = new TextEncoder();
async function sign(msg, secret) {
  const k = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const s = await crypto.subtle.sign('HMAC', k, enc.encode(msg));
  return [...new Uint8Array(s)].map(b => b.toString(16).padStart(2, '0')).join('');
}
export const json = (d, s = 200, h = {}) => new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...h } });
function safeEq(a, b) { if (a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; }
export async function checkPassword(input, env) { return safeEq(await sign(input, 'pw'), await sign(env.ADMIN_PASSWORD, 'pw')); }
export async function makeToken(env) { const exp = Date.now() + 12 * 36e5; return exp + '.' + await sign(String(exp), env.SESSION_SECRET); }
export async function isAdmin(req, env) {
  const m = (req.headers.get('cookie') || '').match(/asc_session=(\d+)\.([a-f0-9]+)/);
  if (!m || !env.SESSION_SECRET || Date.now() > +m[1]) return false;
  return safeEq(m[2], await sign(m[1], env.SESSION_SECRET));
}
export async function getCatalog(env) { return await env.ASC_KV.get('catalog', 'json'); }

// Busca as releases do GitHub e atualiza versão, tamanho, data, link e histórico sozinho.
export async function withReleases(app, env) {
  if (!app.repo) return app;
  try {
    const r = await fetch(`https://api.github.com/repos/${app.repo}/releases?per_page=10`, {
      headers: { 'user-agent': 'asc-store', accept: 'application/vnd.github+json', ...(env.GITHUB_TOKEN ? { authorization: 'Bearer ' + env.GITHUB_TOKEN } : {}) },
      cf: { cacheTtl: 300, cacheEverything: true }
    });
    if (!r.ok) return app;
    const list = (await r.json()).filter(x => !x.draft && !x.prerelease)
      .map(x => ({ x, a: (x.assets || []).find(a => /\.apk$/i.test(a.name)) })).filter(o => o.a);
    if (!list.length) return app;
    const ver = x => x.tag_name.replace(/^v/i, ''), day = x => x.published_at.slice(0, 10);
    const { x, a } = list[0];
    return { ...app, version: ver(x), updatedAt: day(x), apkSize: (a.size / 1048576).toFixed(1) + ' MB', downloadUrl: a.browser_download_url,
      changelog: list.map(({ x }) => ({ version: ver(x), date: day(x),
        notes: (x.body || 'Nova versão').split('\n').map(l => l.replace(/^[-*#\s]+/, '').trim()).filter(Boolean).slice(0, 8) })) };
  } catch { return app; }
}

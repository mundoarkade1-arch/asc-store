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
// Bloqueia requisições vindas de outro site (proteção extra além do SameSite=Strict)
export function sameOrigin(req) {
  const o = req.headers.get('origin');
  return !o || o === new URL(req.url).origin;
}
export async function getCatalog(env) { if (!env.ASC_KV) return null; try { return await env.ASC_KV.get('catalog', 'json'); } catch { return null; } }
export const noKV = env => !env.ASC_KV ? json({ error: 'KV não configurado: crie o binding ASC_KV no Cloudflare (Settings > Bindings) e publique de novo.' }, 500) : null;

// Lê as releases do GitHub. Cada arquivo anexado vira um download, com a plataforma deduzida pelo nome/extensão.
const SKIP = /\.(sha256|sha1|md5|txt|md|sig|asc|json|ya?ml|blockmap)$/i;
const ORDER = ['Android (celular)', 'TV Box e Android TV', 'Smart TV Samsung (Tizen)', 'Smart TV LG (webOS)', 'Windows', 'macOS', 'Linux', 'Download'];
function label(n) {
  if (/\.apk$/i.test(n)) return /tv|box/i.test(n) ? 'TV Box e Android TV' : 'Android (celular)';
  if (/\.(exe|msi)$/i.test(n)) return 'Windows';
  if (/\.(dmg|pkg)$/i.test(n)) return 'macOS';
  if (/\.(appimage|deb|rpm)$/i.test(n)) return 'Linux';
  if (/\.ipk$/i.test(n)) return 'Smart TV LG (webOS)';
  if (/\.wgt$/i.test(n)) return 'Smart TV Samsung (Tizen)';
  if (/\.(zip|7z|rar)$/i.test(n)) { if (/win/i.test(n)) return 'Windows'; if (/mac|osx/i.test(n)) return 'macOS'; if (/linux/i.test(n)) return 'Linux'; if (/tv|box/i.test(n)) return 'TV Box e Android TV'; }
  return 'Download';
}
// Versão: pega o primeiro número do tag (ex.: "v1.0.3", "asc-cine-1.0.3" -> "1.0.3")
const semver = t => { const m = String(t || '').match(/\d+(?:\.\d+){1,3}/); return m ? m[0] : ''; };
const cmp = (a, b) => { const p = a.split('.'), q = b.split('.'); for (let i = 0; i < Math.max(p.length, q.length); i++) { const d = (Number(p[i]) || 0) - (Number(q[i]) || 0); if (d) return d; } return 0; };
const verOf = x => semver(x.tag_name) || semver(x.name) || String(x.tag_name || '').replace(/^v/i, '');
const dayOf = x => { const d = String(x.published_at || x.created_at || '').slice(0, 10); return /^\d{4}-\d\d-\d\d$/.test(d) ? d : new Date().toISOString().slice(0, 10); };
function build(raw) {
  const rels = raw.filter(x => !x.draft).map(x => ({ x, v: verOf(x),
    d: (x.assets || []).filter(a => !SKIP.test(a.name)).map(a => ({ label: label(a.name), name: a.name, url: a.browser_download_url, size: (a.size / 1048576).toFixed(1) + ' MB' }))
      .sort((p, q) => ORDER.indexOf(p.label) - ORDER.indexOf(q.label)) })).filter(o => o.d.length);
  if (!rels.length) return null;
  const t = o => Date.parse(o.x.published_at || o.x.created_at) || 0;
  rels.sort((a, b) => cmp(b.v, a.v) || t(b) - t(a)); // a maior versão vem primeiro
  const best = rels.find(o => !o.x.prerelease) || rels[0];
  return { version: best.v, updatedAt: dayOf(best.x), apkSize: best.d[0].size, downloadUrl: best.d[0].url, downloads: best.d,
    changelog: rels.filter(o => !o.x.prerelease || o === best).slice(0, 10).map(o => ({ version: o.v, date: dayOf(o.x),
      notes: (o.x.body || 'Nova versão').split('\n').map(l => l.replace(/^[-*#\s]+/, '').trim()).filter(Boolean).slice(0, 8) })) };
}
export async function withReleases(app, env) {
  if (!app.repo) return app;
  const key = 'rel:' + app.repo.toLowerCase();
  let rel = null;
  try {
    const r = await fetch(`https://api.github.com/repos/${app.repo}/releases?per_page=30`, {
      headers: { 'user-agent': 'asc-store', accept: 'application/vnd.github+json', ...(env.GITHUB_TOKEN ? { authorization: 'Bearer ' + env.GITHUB_TOKEN } : {}) },
      cf: { cacheEverything: true, cacheTtlByStatus: { '200-299': 300, '300-599': 0 } }
    });
    if (r.ok) {
      rel = build(await r.json());
      // Guarda a última leitura boa. Se o GitHub falhar ou limitar, o site usa esta e não volta para a versão velha.
      if (rel && env.ASC_KV) { try { const s = JSON.stringify(rel); if ((await env.ASC_KV.get(key)) !== s) await env.ASC_KV.put(key, s, { expirationTtl: 5184000 }); } catch {} }
    }
  } catch {}
  if (!rel && env.ASC_KV) { try { rel = await env.ASC_KV.get(key, 'json'); } catch {} }
  return rel ? { ...app, ...rel } : app;
}

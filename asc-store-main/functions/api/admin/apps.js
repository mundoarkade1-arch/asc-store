import { json, isAdmin, getCatalog, sameOrigin } from '../../_lib.js';
const s = (v, n) => String(v ?? '').slice(0, n);
const img = v => /^(data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+|assets\/(?!.*\.\.)[\w./-]+)$/.test(v || '') ? v : '';
export async function onRequestGet({ request, env }) {
  if (!(await isAdmin(request, env))) return json({ error: 'Não autorizado.' }, 401);
  return json((await getCatalog(env)) || { site: { contactEmail: '' }, apps: [] });
}
export async function onRequestPut({ request, env }) {
  if (!sameOrigin(request)) return json({ error: 'Origem inválida.' }, 403);
  if (!(await isAdmin(request, env))) return json({ error: 'Sessão expirada. Entre de novo.' }, 401);
  if (!(request.headers.get('content-type') || '').includes('application/json')) return json({ error: 'Tipo inválido.' }, 415);
  const raw = await request.text();
  if (raw.length > 8e6) return json({ error: 'Imagens grandes demais.' }, 413);
  let b; try { b = JSON.parse(raw); } catch { return json({ error: 'JSON inválido.' }, 400); }
  const seen = new Set();
  const apps = (Array.isArray(b.apps) ? b.apps : []).slice(0, 50).map(a => ({
    id: s(a.id, 40).toLowerCase().replace(/[^a-z0-9-]/g, '-'), name: s(a.name, 60), tagline: s(a.tagline, 120),
    description: s(a.description, 3000), category: s(a.category, 30) || 'Outros', featured: !!a.featured, platforms: (Array.isArray(a.platforms) ? a.platforms : []).filter(p => ['celular', 'tvbox', 'smarttv', 'desktop'].includes(p)),
    icon: img(a.icon) || 'assets/brand/favicon.svg', screenshots: (Array.isArray(a.screenshots) ? a.screenshots : []).slice(0, 6).map(img).filter(Boolean),
    repo: /^[\w.-]+\/[\w.-]+$/.test(a.repo || '') ? a.repo : '', version: s(a.version, 20) || '—', apkSize: s(a.apkSize, 20) || '—',
    updatedAt: /^\d{4}-\d\d-\d\d$/.test(a.updatedAt) ? a.updatedAt : new Date().toISOString().slice(0, 10),
    minAndroid: s(a.minAndroid, 60) || 'Android 8.0 ou superior', downloadUrl: /^https:\/\//.test(a.downloadUrl || '') ? s(a.downloadUrl, 500) : '', changelog: []
  })).filter(a => a.id && a.name && !seen.has(a.id) && seen.add(a.id));
  await env.ASC_KV.put('catalog', JSON.stringify({ site: { contactEmail: s(b.site?.contactEmail, 100) }, apps }));
  return json({ ok: true, count: apps.length });
}

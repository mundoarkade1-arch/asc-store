import { json, getCatalog, withReleases } from '../_lib.js';
export async function onRequestGet({ env }) {
  const c = await getCatalog(env);
  if (!c) return json({ empty: true, site: {}, apps: [] });
  const apps = Array.isArray(c.apps) ? await Promise.all(c.apps.map(a => withReleases(a, env))) : [];
  return json({ site: c.site && typeof c.site === 'object' ? c.site : {}, apps }, 200, { 'cache-control': 'public, max-age=60' });
}

import { json, checkPassword, makeToken, sameOrigin } from '../_lib.js';
export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return json({ error: 'Origem inválida.' }, 403);
  if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) return json({ error: 'Senha do admin ainda não configurada no Cloudflare.' }, 500);
  const k = 'rl:' + (request.headers.get('cf-connecting-ip') || 'x'), n = +(await env.ASC_KV.get(k)) || 0;
  if (n >= 5) return json({ error: 'Muitas tentativas. Aguarde 15 minutos.' }, 429);
  let b = {}; try { b = await request.json(); } catch {}
  if (!(await checkPassword(String(b.password || ''), env))) {
    await env.ASC_KV.put(k, String(n + 1), { expirationTtl: 900 });
    return json({ error: 'Senha incorreta.' }, 401);
  }
  await env.ASC_KV.delete(k);
  return json({ ok: true }, 200, { 'set-cookie': `asc_session=${await makeToken(env)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200` });
}

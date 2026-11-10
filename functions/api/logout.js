import { json } from '../_lib.js';
export async function onRequestPost() {
  return json({ ok: true }, 200, { 'set-cookie': 'asc_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0' });
}

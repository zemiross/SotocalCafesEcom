// Lead endpoint (decision D101). Receives the HoReCa form as JSON and emails it with Resend.
// Runs on any host with the Fetch API (Cloudflare Workers, Vercel or Netlify edge, Deno, Supabase Edge Functions).
// No personal data is logged or stored here. Secrets and addresses come from environment variables only (see README.md).

const MAX = { Nome: 120, Estabelecimento: 160, Tipo: 60, Distrito: 60, Localidade: 120, Telefone: 20, email: 160, 'Fornecedor atual': 160, 'Consumo mensal': 40, 'Melhor hora': 20, body: 2000, Consentimento: 10, Origem: 80 };
const LABELS = [['Nome', 'Nome'], ['Estabelecimento', 'Estabelecimento'], ['Tipo', 'Tipo de estabelecimento'], ['Distrito', 'Distrito'], ['Localidade', 'Localidade'],
  ['Telefone', 'Telefone'], ['email', 'Email'], ['Fornecedor atual', 'Fornecedor atual'], ['Consumo mensal', 'Consumo mensal de café'], ['Melhor hora', 'Melhor hora para ligar'],
  ['body', 'Mensagem'], ['Origem', 'Origem']];

const list = (v) => String(v || '').split(',').map((s) => s.trim()).filter(Boolean);
const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, max);
const json = (status, body, headers = {}) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...headers } });

export async function handleLead(request, env, fetchImpl = fetch) {
  const allowed = list(env.ALLOWED_ORIGINS);
  const origin = request.headers.get('origin') || '';
  const cors = origin && allowed.includes(origin)
    ? { 'access-control-allow-origin': origin, 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'content-type', vary: 'origin' }
    : { vary: 'origin' };

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (request.method !== 'POST') return json(405, { ok: false, error: 'method' }, cors);
  if (!origin || !allowed.includes(origin)) return json(403, { ok: false, error: 'origin' }, cors);
  if (!(request.headers.get('content-type') || '').includes('application/json')) return json(415, { ok: false, error: 'content-type' }, cors);

  let raw;
  try { raw = await request.json(); } catch { return json(400, { ok: false, error: 'json' }, cors); }
  if (!raw || typeof raw !== 'object') return json(400, { ok: false, error: 'json' }, cors);

  // Honeypot: pretend success, send nothing.
  if (clean(raw.website, 50)) return json(200, { ok: true }, cors);

  const f = {};
  for (const [key, max] of Object.entries(MAX)) f[key] = clean(raw[key], max);
  const phone = f.Telefone.replace(/[^\d+]/g, '').replace(/^(\+|00)351/, '');
  if (!f.Nome) return json(400, { ok: false, error: 'Nome' }, cors);
  if (!/^[29]\d{8}$/.test(phone)) return json(400, { ok: false, error: 'Telefone' }, cors);
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) return json(400, { ok: false, error: 'email' }, cors);
  if (f.Consentimento !== 'Sim') return json(400, { ok: false, error: 'Consentimento' }, cors);
  f.Telefone = phone;

  const lines = LABELS.filter(([k]) => f[k]).map(([k, label]) => `${label}: ${f[k]}`);
  const where = f.Localidade || f.Distrito || '';
  const subject = `Pedido de contacto profissional: ${f.Tipo || 'sem tipo'}${where ? ' em ' + where : ''}`.replace(/[\r\n]+/g, ' ').slice(0, 150);
  const payload = {
    from: env.LEAD_FROM,
    to: list(env.LEAD_TO),
    ...(list(env.LEAD_CC).length ? { cc: list(env.LEAD_CC) } : {}),
    ...(f.email && f.email !== env.SHOP_FALLBACK_EMAIL ? { reply_to: f.email } : {}),
    subject,
    text: `${lines.join('\n')}\n\nConsentimento para ser contactado: Sim\n`,
  };
  if (!payload.from || payload.to.length === 0 || !env.RESEND_API_KEY) return json(500, { ok: false, error: 'config' }, cors);

  let res;
  try {
    res = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch { return json(502, { ok: false, error: 'send' }, cors); }
  if (!res.ok) return json(502, { ok: false, error: 'send' }, cors);
  return json(200, { ok: true }, cors);
}

export default { fetch: (request, env) => handleLead(request, env) };

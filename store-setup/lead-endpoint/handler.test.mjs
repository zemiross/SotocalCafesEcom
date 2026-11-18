// Run: node --test store-setup/lead-endpoint/handler.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { handleLead } from './handler.js';

const env = { ALLOWED_ORIGINS: 'https://sotocalcafes.pt', RESEND_API_KEY: 'test-key', LEAD_FROM: 'Sotocal <leads@example.test>', LEAD_TO: 'sales@example.test', LEAD_CC: 'copy@example.test', SHOP_FALLBACK_EMAIL: 'shop@example.test' };
const body = { Nome: 'Teste', Estabelecimento: 'Café Exemplo', Tipo: 'Restaurante', Distrito: 'Braga', Localidade: 'Guimarães', Telefone: '912 345 678', email: '', 'Consumo mensal': '10–30 kg', Consentimento: 'Sim', website: '' };
const req = (b, o = {}) => new Request('https://leads.example.test/lead', { method: 'POST', headers: { origin: 'https://sotocalcafes.pt', 'content-type': 'application/json', ...o.headers }, body: JSON.stringify(b), ...o.init });
const okFetch = (calls) => async (url, init) => { calls.push({ url, init }); return new Response('{}', { status: 200 }); };

test('sends one plain-text email to the recipients from the environment', async () => {
  const calls = []; const res = await handleLead(req(body), env, okFetch(calls));
  assert.equal(res.status, 200);
  assert.equal(calls.length, 1);
  const sent = JSON.parse(calls[0].init.body);
  assert.deepEqual(sent.to, ['sales@example.test']); assert.deepEqual(sent.cc, ['copy@example.test']);
  assert.match(sent.subject, /Restaurante em Guimarães/); assert.match(sent.text, /Telefone: 912345678/); assert.equal(sent.html, undefined);
  assert.equal(sent.reply_to, undefined);
  assert.equal(calls[0].init.headers.authorization, 'Bearer test-key');
  assert.equal(res.headers.get('access-control-allow-origin'), 'https://sotocalcafes.pt');
});

test('uses the visitor email as reply_to, but not the shop fallback address', async () => {
  const c1 = []; await handleLead(req({ ...body, email: 'cliente@example.test' }), env, okFetch(c1));
  assert.equal(JSON.parse(c1[0].init.body).reply_to, 'cliente@example.test');
  const c2 = []; await handleLead(req({ ...body, email: 'shop@example.test' }), env, okFetch(c2));
  assert.equal(JSON.parse(c2[0].init.body).reply_to, undefined);
});

test('rejects a foreign origin, a missing consent, a bad phone and a wrong method', async () => {
  const calls = [];
  assert.equal((await handleLead(req(body, { headers: { origin: 'https://evil.example' } }), env, okFetch(calls))).status, 403);
  assert.equal((await handleLead(req({ ...body, Consentimento: '' }), env, okFetch(calls))).status, 400);
  assert.equal((await handleLead(req({ ...body, Telefone: '12345' }), env, okFetch(calls))).status, 400);
  assert.equal((await handleLead(new Request('https://leads.example.test/lead', { method: 'GET', headers: { origin: 'https://sotocalcafes.pt' } }), env, okFetch(calls))).status, 405);
  assert.equal(calls.length, 0);
});

test('honeypot returns success without sending', async () => {
  const calls = []; const res = await handleLead(req({ ...body, website: 'http://spam' }), env, okFetch(calls));
  assert.equal(res.status, 200); assert.equal(calls.length, 0);
});

test('a Resend failure or missing config is reported, never silent', async () => {
  const bad = async () => new Response('{}', { status: 500 });
  assert.equal((await handleLead(req(body), env, bad)).status, 502);
  assert.equal((await handleLead(req(body), { ...env, RESEND_API_KEY: '' }, okFetch([]))).status, 500);
});

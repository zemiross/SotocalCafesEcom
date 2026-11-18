// WS10: the HoReCa (B2B) page. No public prices; supply list; district field; lead answers saved without personal data.
import { test, expect } from '@playwright/test';

test('profissional page: supply list, no prices, Service schema, district field', async ({ page }) => {
  await page.goto('/pages/profissional/');
  const supply = page.locator('.horeca-supply');
  await expect(supply).toContainText('Super Milano, Super, Reggio e Descafeinado');
  await expect(supply).toContainText('Mistura Bom Dia');
  await expect(supply).toContainText('Colorau');
  await expect(supply).toContainText('empresas e escritórios');
  await expect(page.locator('main')).not.toContainText('€');                     // no public HoReCa prices
  await expect(page.locator('#LeadDistrict option')).toHaveCount(21);            // placeholder + 18 districts + 2 regions
  await expect(page.locator('#LeadType option[value="Presentes de empresa"]')).toHaveCount(1);
  const nodes = await page.$$eval('script[type="application/ld+json"]', (s) => s.flatMap((x) => { const d = JSON.parse(x.textContent); return d['@graph'] || [d]; }));
  const service = nodes.find((n) => n['@type'] === 'Service');
  expect(service.areaServed).toBe('Do Minho ao Algarve');
  expect(service.provider['@id']).toContain('#organization');
});

test('lead form saves only non-personal answers for the success event', async ({ page }) => {
  await page.route('**/contact**', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>ok</title><p>sent</p>' }));
  await page.goto('/pages/profissional/');
  await page.locator('#LeadName').fill('Teste');
  await page.locator('#LeadPhone').fill('912 345 678');
  await page.locator('#LeadType').selectOption('Restaurante');
  await page.locator('#LeadDistrict').selectOption('Braga');
  await page.locator('#LeadVolume').selectOption({ index: 1 });
  await page.locator('label.checkbox', { hasText: 'Aceito ser contactado' }).click();
  await Promise.all([page.waitForNavigation(), page.getByRole('button', { name: 'Pedir contacto' }).click()]);
  const saved = JSON.parse(await page.evaluate(() => sessionStorage.getItem('sotocal:lead')));
  expect(saved).toEqual({ type: 'Restaurante', district: 'Braga', volume: expect.any(String) });
  expect(Object.keys(saved)).not.toContain('name');
});

test('lead service: success without leaving the page, and a safe fallback to the Shopify form', async ({ page }) => {
  const sent = [];
  await page.route('https://leads.example.test/**', async (route) => {
    const req = route.request();
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type' } });
    sent.push(JSON.parse(req.postData()));
    return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{"ok":true}' });
  });
  await page.goto('/pages/profissional/');
  await page.evaluate(() => { document.querySelector('[data-lead-form]').dataset.endpoint = 'https://leads.example.test/lead'; });
  await page.locator('#LeadName').fill('Teste');
  await page.locator('#LeadPhone').fill('912 345 678');
  await page.locator('#LeadDistrict').selectOption('Braga');
  await page.locator('label.checkbox', { hasText: 'Aceito ser contactado' }).click();
  await page.getByRole('button', { name: 'Pedir contacto' }).click();
  await expect(page.locator('[data-lead-success]')).toContainText('Pedido recebido');
  expect(sent).toHaveLength(1);
  expect(sent[0]).toMatchObject({ Nome: 'Teste', Telefone: '912345678', Distrito: 'Braga', Consentimento: 'Sim' });
  expect(sent[0].email).toBe('');                                                   // no placeholder address when the service is used
});

test('lead service down: falls back to the normal Shopify form post', async ({ page }) => {
  await page.route('https://leads.example.test/**', (route) => route.abort());
  await page.route('**/contact**', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>ok</title><p>sent</p>' }));
  await page.goto('/pages/profissional/');
  await page.evaluate(() => { document.querySelector('[data-lead-form]').dataset.endpoint = 'https://leads.example.test/lead'; });
  await page.locator('#LeadName').fill('Teste');
  await page.locator('#LeadPhone').fill('912 345 678');
  await page.locator('label.checkbox', { hasText: 'Aceito ser contactado' }).click();
  const [req] = await Promise.all([page.waitForRequest((r) => r.url().includes('/contact') && r.method() === 'POST'), page.getByRole('button', { name: 'Pedir contacto' }).click()]);
  expect(req.postData()).toContain('sotocalcafes%40sotocalcafes.pt');               // the Shopify form needs an email
});

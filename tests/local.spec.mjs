// Local supplier pages (D111, D118): /pages/fornecedor-de-cafe/<distrito>. Porto and the other 17 mainland districts are served
// (Sotocal distributes to all of Portugal, D118) and carry district facts; Açores is still a draft and must stay noindex.
import { test, expect } from '@playwright/test';

const robots = (page) => page.locator('meta[name="robots"]');
const jsonld = (page) => page.$$eval('script[type="application/ld+json"]', (s) => s.map((x) => JSON.parse(x.textContent)));

test('Porto: indexable, real facts, Service JSON-LD, district preselected', async ({ page }) => {
  await page.goto('/pages/fornecedor-de-cafe/porto/');
  await expect(page).toHaveTitle('Fornecedor de café no Porto | Sotocal');
  await expect(robots(page)).toHaveCount(0);
  await expect(page.locator('h1')).toHaveText('Fornecedor de café no Porto');
  await expect(page.locator('main')).toContainText('Rua Engenheiro Ferreira Dias, n.º 398');
  await expect(page.locator('main')).toContainText('O distrito do Porto tem 18 concelhos');
  await expect(page.locator('#LeadDistrict')).toHaveValue('Porto');
  await expect(page.locator('.breadcrumbs')).toContainText('Profissional');
  const graph = (await jsonld(page)).flatMap((d) => d['@graph'] || [d]);
  const service = graph.find((n) => n['@type'] === 'Service');
  expect(service.areaServed.name).toBe('Porto');
  expect(service.provider['@id']).toBeTruthy();
});

test('Lisboa: served, indexable, with its own district facts', async ({ page }) => {
  await page.goto('/pages/fornecedor-de-cafe/lisboa/');
  await expect(robots(page)).toHaveCount(0);
  await expect(page.locator('h1')).toHaveText('Fornecedor de café em Lisboa');
  await expect(page.locator('main')).toContainText('A Sotocal distribui café por todo o país');
  await expect(page.locator('main')).toContainText('O distrito de Lisboa tem 16 concelhos');
  await expect(page.locator('main')).toContainText('Vila Franca de Xira');
  await expect(page.locator('#LeadDistrict')).toHaveValue('Lisboa');
});

test('Açores: not served yet, stays noindex and shows no invented local text', async ({ page }) => {
  await page.goto('/pages/fornecedor-de-cafe/acores/');
  await expect(robots(page)).toHaveAttribute('content', 'noindex,follow');
  await expect(page.locator('main')).not.toContainText('concelhos');
  await expect(page.locator('main')).not.toContainText('A Sotocal distribui café por todo o país');
});

test('B2B page links to every district that passes the gate and to none that does not', async ({ page }) => {
  await page.goto('/pages/profissional/');
  const links = await page.locator('a[href*="/pages/fornecedor-de-cafe/"]').evaluateAll((a) => a.map((x) => x.getAttribute('href')));
  expect(links.length).toBe(18);
  expect(links.some((h) => h.includes('/porto'))).toBe(true);
  expect(links.some((h) => h.includes('/lisboa'))).toBe(true);
  expect(links.some((h) => h.includes('/acores'))).toBe(false);
});

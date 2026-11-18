// Local supplier pages (D111): /pages/fornecedor-de-cafe/<distrito>. Porto has real local facts and is indexable;
// Lisboa is a draft (not confirmed as served, no local content) and must stay noindex.
import { test, expect } from '@playwright/test';

const robots = (page) => page.locator('meta[name="robots"]');
const jsonld = (page) => page.$$eval('script[type="application/ld+json"]', (s) => s.map((x) => JSON.parse(x.textContent)));

test('Porto: indexable, real facts, Service JSON-LD, district preselected', async ({ page }) => {
  await page.goto('/pages/fornecedor-de-cafe/porto/');
  await expect(page).toHaveTitle('Fornecedor de café no Porto | Sotocal');
  await expect(robots(page)).toHaveCount(0);
  await expect(page.locator('h1')).toHaveText('Fornecedor de café no Porto');
  await expect(page.locator('main')).toContainText('Rua Engenheiro Ferreira Dias, n.º 398');
  await expect(page.locator('#LeadDistrict')).toHaveValue('Porto');
  await expect(page.locator('.breadcrumbs')).toContainText('Profissional');
  const graph = (await jsonld(page)).flatMap((d) => d['@graph'] || [d]);
  const service = graph.find((n) => n['@type'] === 'Service');
  expect(service.areaServed.name).toBe('Porto');
  expect(service.provider['@id']).toBeTruthy();
});

test('Lisboa: draft stays noindex and shows no invented local text', async ({ page }) => {
  await page.goto('/pages/fornecedor-de-cafe/lisboa/');
  await expect(robots(page)).toHaveAttribute('content', 'noindex,follow');
  await expect(page.locator('h1')).toHaveText('Fornecedor de café em Lisboa');
  await expect(page.locator('main')).not.toContainText('Entregas em Lisboa');
  await expect(page.locator('#LeadDistrict')).toHaveValue('Lisboa');
});

test('B2B page links only to local pages that pass the gate', async ({ page }) => {
  await page.goto('/pages/profissional/');
  const links = await page.locator('a[href*="/pages/fornecedor-de-cafe/"]').evaluateAll((a) => a.map((x) => x.getAttribute('href')));
  expect(links.some((h) => h.includes('/porto'))).toBe(true);
  expect(links.some((h) => h.includes('/lisboa'))).toBe(false);
});

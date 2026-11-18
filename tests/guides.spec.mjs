// WS7: comparison block on the real Delta-alternatives guide (prices read on 17/11/2026).
import { test, expect } from '@playwright/test';

test('comparison block: real brands, disclosure, sources, Sotocal last, ItemList', async ({ page }) => {
  await page.goto('/blogs/guia-do-cafe/cafe-delta-alternativas/');
  await expect(page.locator('.compare-block__disclosure')).toContainText('Somos a Sotocal; esta lista é nossa');
  const rows = page.locator('.compare-block tbody tr');
  await expect(rows).toHaveCount(11);                                               // 9 real products + 2 Sotocal rows (placeholder, markers on)
  await expect(page.locator('.compare-block')).toContainText('Delta: Café em Grão Torrado Lote Chávena Int 12 Delta');
  await expect(page.locator('.compare-block')).toContainText('Nicola: Café em Grão Torrado Lote Rossio Encorpado Nicola');
  await expect(page.locator('.compare-block')).not.toContainText('exemplo');
  await expect(rows.last()).toHaveClass(/is-own/);
  await expect(rows.first()).not.toHaveClass(/is-own/);                             // Sotocal is never first
  for (const link of await page.locator('.compare-block tbody tr:not(.is-own) a').all()) {
    expect(await link.getAttribute('href')).toMatch(/^https:\/\/www\.continente\.pt\/produto\//);
    expect(await link.getAttribute('rel')).toContain('nofollow');
  }
  await expect(page.locator('.compare-block')).toContainText('Promoção');            // Sical 5 Estrelas was on promotion
  await expect(page.locator('.compare-block tr.is-own').first()).toContainText('40,00 €');
  await expect(page.locator('.article__answer')).toContainText('19,99 €');
  await expect(page.locator('.article-sources')).toContainText('Última revisão: 17/11/2026');
  const types = await page.$$eval('script[type="application/ld+json"]', (s) => s.map((x) => JSON.parse(x.textContent)['@type'] || ''));
  expect(types).toContain('ItemList');
});

// Functional tests for the WS6 tools against the prototype (fictional fixtures: see scripts/prototype/mock-data.mjs).
import { test, expect } from '@playwright/test';

test('calculator: cost per cup, month, year, real same-format comparison, capsules, shareable URL', async ({ page }) => {
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/pages/calculadora-custo-chavena/');
  await page.locator('[data-calc-price]').fill('12,50');
  await page.locator('[data-calc-weight]').fill('1000');
  await expect(page.locator('[data-calc-per-cup]')).toHaveText('0,088 €');       // 12.50 / 1000 x 7 g
  await expect(page.locator('[data-calc-per-month]')).toHaveText('5,32 €');       // x 2 cups x 365 / 12
  await expect(page.locator('[data-calc-per-year]')).toHaveText('63,88 €');
  const rows = page.locator('[data-calc-rows] tr');
  await expect(rows).toHaveCount(11);                                             // 10 cheapest whole-bean references + the visitor's coffee
  await expect(page.locator('[data-calc-rows]')).toContainText('Continente: Café em Grão Supremo');
  await expect(page.locator('[data-calc-rows]')).not.toContainText('exemplo');
  await page.locator('[data-calc-more]').click();
  await expect(rows).toHaveCount(36);                                             // all 35 whole-bean references (Continente 25, Torrié 9, Bicafé 1) + the visitor
  expect(page.url()).toContain('p=12%2C50');
  await page.locator('label.radio-pill', { hasText: 'Cápsulas' }).click();
  await page.locator('[data-calc-price]').fill('3,20');
  await page.locator('[data-calc-units]').fill('10');
  await expect(page.locator('[data-calc-per-cup]')).toHaveText('0,32 €');
  await expect(page.locator('[data-calc-rows]')).toContainText('Cápsulas');        // capsule references only
  await expect(page.locator('[data-calc-rows]')).not.toContainText('Grão');
  await page.locator('[data-calc-units]').fill('abc');
  await expect(page.locator('[data-calc-error]')).toBeVisible();
  expect(errors).toEqual([]);
});

test('quiz: matches answers against product data, decaf filter, no duplicate ids', async ({ page }) => {
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/pages/qual-o-cafe-para-a-minha-maquina/');
  const pick = (name, text) => page.locator(`fieldset[data-quiz-q="${name}"] label`, { hasText: text }).click();
  await page.getByRole('button', { name: 'Ver a minha sugestão' }).click();
  await expect(page.locator('[data-quiz-error]')).toBeVisible();
  await pick('machine', 'Máquina automática'); await pick('milk', 'Sim, com leite'); await pick('intensity', 'Intenso'); await pick('decaf', 'Não');
  await page.getByRole('button', { name: 'Ver a minha sugestão' }).click();
  await expect(page.locator('[data-quiz-best]')).toContainText('Lote Super Milano');
  await expect(page.locator('[data-quiz-why]')).toContainText('intensidade 4 em 5');
  await page.getByRole('button', { name: 'Recomeçar' }).click();
  await pick('machine', 'Outra'); await pick('milk', 'Não, sem leite'); await pick('intensity', 'Sem preferência'); await pick('decaf', 'Sim');
  await page.getByRole('button', { name: 'Ver a minha sugestão' }).click();
  await expect(page.locator('[data-quiz-best]')).toContainText('Descafeinado');
  const unique = await page.evaluate(() => { const ids = [...document.querySelectorAll('[id]')].map((e) => e.id); return ids.length === new Set(ids).size; });
  expect(unique).toBe(true);
  expect(errors).toEqual([]);
});

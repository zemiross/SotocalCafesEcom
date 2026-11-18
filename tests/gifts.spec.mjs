// WS9: Christmas gifts state, gift message, company gifts (prototype fixtures are fictional).
import { test, expect } from '@playwright/test';

test('gifts collection: season band with cut-offs, company gifts link, indexable', async ({ page }) => {
  await page.goto('/collections/presentes/');
  await expect(page.locator('.gift-season')).toContainText('Presentes de Natal');
  await expect(page.locator('.gift-season .gift-cutoff')).toHaveCount(2);
  await expect(page.locator('.corporate-gifts')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  await expect(page.locator('.gift-waitlist')).toHaveCount(0);
});

test('gift product: optional gift message of up to 200 characters, cut-off dates', async ({ page }) => {
  await page.goto('/products/despensa-do-norte/');
  const box = page.locator('textarea[name^="properties["]');
  await expect(box).toHaveAttribute('maxlength', '200');
  await expect(page.locator('label', { hasText: 'Mensagem de oferta (opcional)' })).toBeVisible();
  await expect(page.locator('.gift-cutoffs')).toContainText('18 de dezembro');
  await box.fill('Feliz Natal');
  await expect(box).toHaveValue('Feliz Natal');
});

test('company gifts section on /pages/profissional and lead form option', async ({ page }) => {
  await page.goto('/pages/profissional/');
  const section = page.locator('#presentes-empresas');
  await expect(section).toBeVisible();
  await expect(section.locator('a.btn')).toHaveAttribute('href', '#contacto');
  await expect(page.locator('#LeadType option[value="Presentes de empresa"]')).toHaveCount(1);
});

test('cart shows the gift message but hides underscore properties', async ({ page }) => {
  await page.goto('/cart/');
  await expect(page.locator('main .cart-line__meta', { hasText: 'Mensagem de oferta: Feliz Natal' })).toBeVisible();
  await expect(page.locator('body')).not.toContainText('oculto');
});

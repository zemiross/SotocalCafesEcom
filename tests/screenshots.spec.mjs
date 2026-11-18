// Every template × pt-PT/EN × 6 viewports × motion on/off → qa/screenshots/<lang>/<motion>/<viewport>/<page>.png
// Homepage: scroll checkpoints at 0/25/50/75/100% of each fold so the stream hand-offs and the cup fill are visible.
import { test, expect } from '@playwright/test';
import path from 'node:path';
import { root, VIEWPORTS, LANGS, MOTIONS, pages, slug, prepare, settle } from './helpers.mjs';

const shot = (lang, motion, vp, name) => path.join(root, 'qa', 'screenshots', lang, motion, vp, `${name}.png`);

for (const lang of LANGS) {
  for (const motion of MOTIONS) {
    for (const vp of VIEWPORTS) {
      test.describe(`${lang.code} ${motion} ${vp.name}`, () => {
        test.use({ viewport: { width: vp.width, height: vp.height }, reducedMotion: motion, locale: lang.code === 'pt' ? 'pt-PT' : 'en-GB' });

        for (const p of pages) {
          test(`template ${p.template} ${p.path}`, async ({ page }) => {
            await prepare(page);
            const res = await page.goto(`${lang.prefix}${p.path}`);
            expect(res.status()).toBeLessThan(400);
            // QR landings forward to the shop with UTM tags 400 ms after load (sections/qr-landing.liquid): wait for it instead of racing it.
            if (p.template === 'page.qr') await page.waitForURL(/utm_medium=qr/);
            await settle(page, motion);
            const name = p.template === 'index' ? 'index-top' : p.template.startsWith('metaobject') ? `${p.template.replace('/', '-')}-${p.path.split('/').filter(Boolean).pop()}` : `${p.template}`;
            await page.screenshot({ path: shot(lang.code, motion, vp.name, name), fullPage: p.template !== 'index' });
            // No horizontal page scroll at any width (brief §5.3 / artifact rule).
            const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
            expect(overflow, 'horizontal overflow (px)').toBeLessThanOrEqual(1);
          });
        }

        test('homepage fold checkpoints', async ({ page }) => {
          await prepare(page);
          await page.goto(`${lang.prefix}/`);
          await settle(page, motion);
          const folds = await page.evaluate(() => [...document.querySelectorAll('main > .shopify-section')].map((s) => {
            const r = s.getBoundingClientRect();
            return { top: r.top + scrollY, height: r.height, cls: s.className.split(' ').find((c) => c.startsWith('section-home-')) || 'section' };
          }));
          const vh = vp.height;
          for (const [i, f] of folds.entries()) {
            for (const pct of [0, 25, 50, 75, 100]) {
              // Hero: 0–100% of its own height. Other folds: from entering (top at the viewport bottom) to leaving
              // (bottom at the viewport top), so the stream hand-offs and the scrubbed transformations are visible.
              const y = i === 0 ? (pct / 100) * f.height : Math.max(0, f.top - vh + (pct / 100) * (f.height + vh));
              await page.evaluate((top) => window.scrollTo(0, top), y);
              await page.waitForTimeout(motion === 'no-preference' ? 1100 : 120);
              await page.screenshot({ path: shot(lang.code, motion, vp.name, `home-fold${i + 1}-${f.cls.replace('section-home-', '')}-${String(pct).padStart(3, '0')}`) });
            }
          }
        });
      });
    }
  }
}

test.describe('cookie banner', () => {
  for (const vp of [VIEWPORTS[1], VIEWPORTS[4]]) {
    test(`banner ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      const banner = page.locator('#consent-banner');
      await expect(banner).toBeVisible({ timeout: 8000 });
      const sizes = await banner.locator('[data-consent-actions] .btn').evaluateAll((els) => els.map((e) => [e.offsetWidth, e.offsetHeight, getComputedStyle(e).backgroundColor].join('|')));
      expect(new Set(sizes.map((s) => s.split('|').slice(1).join('|'))).size, 'equal prominence').toBe(1);
      await page.screenshot({ path: path.join(root, 'qa', 'screenshots', `cookie-banner-${vp.name}.png`) });
      await banner.getByRole('button', { name: 'Rejeitar' }).click();
      await expect(banner).toBeHidden();
    });
  }
});

// axe-core (WCAG 2.2 AA rule set) on every template in both languages, desktop and mobile, plus keyboard checks.
// Release gate: 0 serious or critical violations (brief §13). Full results → qa/axe/*.json
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { root, LANGS, pages, slug, prepare, settle } from './helpers.mjs';

const dir = path.join(root, 'qa', 'axe');
mkdirSync(dir, { recursive: true });

for (const lang of LANGS) {
  for (const vp of [{ name: '1280', width: 1280, height: 800 }, { name: '390', width: 390, height: 844 }]) {
    test.describe(`axe ${lang.code} ${vp.name}`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });
      for (const p of pages) {
        test(`${p.template} ${p.path}`, async ({ page }) => {
          await prepare(page);
          await page.goto(`${lang.prefix}${p.path}`);
          await settle(page, 'no-preference');
          const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
          const bad = results.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
          writeFileSync(path.join(dir, `${lang.code}-${vp.name}-${slug(p.path)}.json`), JSON.stringify(results.violations.map((v) => ({
            id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 5).map((n) => ({ target: n.target, summary: n.failureSummary })),
          })), null, 2));
          expect(bad.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([]);
        });
      }
    });
  }
}

test.describe('keyboard', () => {
  test.use({ viewport: { width: 1440, height: 900 } });
  test('skip link, visible focus, no focus under the sticky header', async ({ page }) => {
    await prepare(page);
    await page.goto('/products/lote-super-milano/');
    await page.keyboard.press('Tab');
    const skip = page.locator('.skip-link');
    await expect(skip).toBeFocused();
    const box = await skip.boundingBox();
    expect(box.y).toBeGreaterThanOrEqual(0);
    for (let i = 0; i < 25; i += 1) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const header = document.querySelector('.section-header')?.getBoundingClientRect();
        const inHeader = !!el.closest('.section-header, [data-announcement], dialog'); // the announcement bar sits above the sticky header
        return { tag: el.tagName, outline: cs.outlineStyle, outlineWidth: parseFloat(cs.outlineWidth), top: r.top, headerBottom: header?.bottom ?? 0, inHeader };
      });
      expect(info.outline === 'solid' && info.outlineWidth >= 3, `visible 3 px focus on ${info.tag}`).toBeTruthy();
      if (!info.inHeader) expect(info.top, `focused ${info.tag} hidden under the header`).toBeGreaterThanOrEqual(info.headerBottom - 2);
    }
  });

  test('pinned blends fold does not trap the keyboard', async ({ page }) => {
    await prepare(page);
    await page.goto('/');
    await settle(page, 'no-preference');
    const steps = page.locator('[data-blend-step]');
    await expect(steps).toHaveCount(4);
    // Tab through the whole page; focus must eventually leave fold 3 and reach the footer.
    let reachedFooter = false;
    for (let i = 0; i < 120 && !reachedFooter; i += 1) {
      await page.keyboard.press('Tab');
      reachedFooter = await page.evaluate(() => !!document.activeElement?.closest('.site-footer'));
    }
    expect(reachedFooter).toBeTruthy();
  });

  test('reduced motion: everything visible and static', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await prepare(page);
    await page.goto('/');
    await page.waitForLoadState('load');
    const state = await page.evaluate(() => ({
      motionClass: document.documentElement.classList.contains('motion-ok'),
      gsap: !!window.gsap,
      liquid: [...document.querySelectorAll('.stream__liquid')].map((l) => getComputedStyle(l).transform),
      roasted: getComputedStyle(document.querySelector('.bean__img--roasted')).opacity,
      cupState: document.querySelector('[data-cup]').dataset.state,
      headline: getComputedStyle(document.querySelector('.cup-fold__title')).opacity,
      stage: document.querySelector('[data-stage][aria-current="step"] .stage__label')?.textContent,
    }));
    expect(state.motionClass).toBe(false);
    expect(state.gsap).toBe(false);
    expect(state.liquid.every((t) => t === 'none')).toBe(true);
    expect(state.roasted).toBe('1');
    expect(state.cupState).toBe('full');
    expect(state.headline).toBe('1');
    expect(state.stage).toBe('Ponto de torra');
    await ctx.close();
  });
});

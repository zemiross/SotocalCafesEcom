// Captures the progress-page screenshots from the local prototype (node scripts/serve.mjs 4180 running).
// Usage: node scripts/client-shots.cjs <outDir>
const { chromium } = require('@playwright/test');
const path = require('node:path');
const fs = require('node:fs');

const base = 'http://localhost:4180';
const out = process.argv[2];
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const shoot = async (name, url, { width = 1440, height = 900, reduce = true, mobile = false, before, selector, full = false } = {}) => {
    const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: reduce ? 'reduce' : 'no-preference', locale: 'pt-PT', deviceScaleFactor: mobile ? 2 : 1 });
    await ctx.addInitScript(() => { try { localStorage.setItem('proto:consent', JSON.stringify({ analytics: false, marketing: false, preferences: false })); } catch (e) { /* ignore */ } });
    const page = await ctx.newPage();
    await page.goto(base + url);
    await page.waitForLoadState('load');
    await page.evaluate(() => document.fonts.ready);
    if (before) await before(page);
    await page.waitForTimeout(300);
    const file = path.join(out, name + '.jpg');
    if (selector) {
      const el = page.locator(selector).first();
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await el.screenshot({ path: file, type: 'jpeg', quality: 82 });
    } else {
      await page.screenshot({ path: file, type: 'jpeg', quality: 82, fullPage: full });
    }
    await ctx.close();
    console.log(name, Math.round(fs.statSync(file).size / 1024) + ' KB');
  };

  await shoot('home', '/', {});
  await shoot('home-mobile', '/', { width: 390, height: 844, mobile: true });
  await shoot('blends', '/', { selector: '.section-home-blends, [class*="home-blends"]' });
  await shoot('produto', '/products/lote-super-milano/', { height: 1000 });
  await shoot('colecao', '/collections/cafe/', { height: 1000 });
  await shoot('profissional', '/pages/profissional/', { selector: '#equipamento' });
  await shoot('local-porto', '/pages/fornecedor-de-cafe/porto/', { height: 880 });
  await shoot('calculadora', '/pages/calculadora-custo-chavena/', {
    height: 1100,
    before: async (p) => {
      await p.fill('[data-calc-price]', '12,50');
      await p.fill('[data-calc-weight]', '1000');
      await p.waitForTimeout(400);
    },
  });
  await shoot('guia-delta', '/blogs/guia-do-cafe/cafe-delta-alternativas/', {
    height: 1150,
    before: async (p) => {
      await p.addStyleTag({ content: '.site-header, header.header, .announcement, [data-announcement]{display:none !important}' });
      await p.locator('.compare-block').scrollIntoViewIfNeeded();
      await p.evaluate(() => window.scrollTo(0, document.querySelector('.compare-block').getBoundingClientRect().top + scrollY - 24));
    },
  });
  await shoot('guia-delta-mobile', '/blogs/guia-do-cafe/cafe-delta-alternativas/', { width: 390, height: 844, mobile: true });
  await browser.close();
})();

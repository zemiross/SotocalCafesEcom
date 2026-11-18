import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const VIEWPORTS = [
  { name: '360', width: 360, height: 800 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1280', width: 1280, height: 800 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
];
export const LANGS = [{ code: 'pt', prefix: '' }, { code: 'en', prefix: '/en' }];
export const MOTIONS = ['no-preference', 'reduce'];
export const pages = JSON.parse(readFileSync(path.join(root, 'prototype', 'pages.json'), 'utf8'));
export const slug = (p) => (p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/[/.]/g, '_'));

/** Hide the cookie banner by pre-seeding a consent choice (the banner has its own test). */
export async function prepare(page, { consent = true } = {}) {
  if (consent) {
    await page.addInitScript(() => {
      try { localStorage.setItem('proto:consent', JSON.stringify({ analytics: false, marketing: false, preferences: false })); } catch (e) { /* ignore */ }
    });
  }
}

/** Wait for fonts, images and (when motion is allowed) the stream intro to settle. */
export async function settle(page, motion) {
  await page.waitForLoadState('load');
  await page.evaluate(() => document.fonts.ready);
  if (motion === 'no-preference') {
    await page.evaluate(() => (window.Sotocal?.stream?.ready ? Promise.race([window.Sotocal.stream.ready, new Promise((r) => setTimeout(r, 4000))]) : null));
    await page.waitForTimeout(600);
  } else {
    await page.waitForTimeout(150);
  }
}

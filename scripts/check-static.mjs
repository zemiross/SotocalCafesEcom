// Loads every page of the static site (/site) in a real browser, served the way Cloudflare Pages serves it, and fails on:
// console errors, uncaught exceptions, failed or 4xx/5xx requests, requests to other hosts, horizontal overflow at 390 px,
// and a missing <title>, <h1> or canonical. Usage: npm run build:static && node scripts/check-static.mjs
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = path.join(root, 'site');
if (!existsSync(site)) { console.error('Run `npm run build:static` first.'); process.exit(1); }
const port = 4191;
const base = `http://localhost:${port}`;

const server = spawn(process.execPath, [path.join(root, 'scripts', 'serve-static.mjs'), String(port)], { cwd: root, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 1500));

const files = readdirSync(site, { recursive: true }).map(String).filter((f) => f.endsWith('.html'));
const toUrl = (f) => '/' + f.replace(/\\/g, '/').replace(/index\.html$/, '').replace(/\.html$/, '');
const problems = [];
const browser = await chromium.launch();
try {
  for (const f of files) {
    const url = toUrl(f);
    if (url === '/404') continue;
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'pt-PT' });
    const page = await ctx.newPage();
    page.on('console', (m) => { if (m.type() === 'error') problems.push(`${url}: console error: ${m.text().slice(0, 140)}`); });
    page.on('pageerror', (e) => problems.push(`${url}: exception: ${e.message.slice(0, 140)}`));
    page.on('requestfailed', (r) => problems.push(`${url}: request failed: ${r.url()}`));
    page.on('response', (r) => {
      const u = r.url();
      if (!u.startsWith(base)) problems.push(`${url}: request to another host: ${u}`);
      else if (r.status() >= 400) problems.push(`${url}: HTTP ${r.status()} for ${u.replace(base, '')}`);
    });
    await page.goto(base + url, { waitUntil: 'networkidle' });
    const info = await page.evaluate(() => ({
      title: document.title, h1: document.querySelectorAll('h1').length,
      canonical: document.querySelector('link[rel="canonical"]')?.href || '',
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
    if (!info.title) problems.push(`${url}: no <title>`);
    if (info.h1 !== 1) problems.push(`${url}: ${info.h1} <h1>`);
    if (!info.canonical) problems.push(`${url}: no canonical`);
    else if (new URL(info.canonical).pathname !== (url === '/' ? '/' : url)) problems.push(`${url}: canonical ${info.canonical} does not match the URL`);
    if (info.overflow > 1) problems.push(`${url}: ${info.overflow}px horizontal overflow at 390 px`);
    await ctx.close();
  }
} finally {
  await browser.close();
  server.kill();
}
problems.forEach((p) => console.log(`✗ ${p}`));
console.log(`${files.length - 1} pages loaded.`);
console.log(problems.length ? `✗ ${problems.length} problem(s)` : '✓ Every static page loads cleanly: no errors, no failed or external requests, no overflow');
process.exitCode = problems.length ? 1 : 0;

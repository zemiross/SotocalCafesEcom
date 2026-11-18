// Lighthouse (mobile, default throttling) on the prototype. Gates (brief §13): Performance ≥ 85 home / ≥ 90 elsewhere,
// Accessibility ≥ 95, SEO ≥ 95, Best Practices ≥ 95. Uses Playwright's Chromium. Reports → qa/lighthouse/.
// Usage: node scripts/serve.mjs 4175 &  node scripts/lighthouse.mjs [baseUrl]
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = process.argv[2] || 'http://localhost:4175';
const out = path.join(root, 'qa', process.env.SITE_DIR ? 'lighthouse-static' : 'lighthouse');
mkdirSync(out, { recursive: true });
const prototypeTargets = [
  ['home', '/', 85], ['home-en', '/en/', 85], ['product', '/products/lote-super-milano/', 90], ['collection', '/collections/cafe/', 90],
  ['historia', '/pages/historia/', 90], ['profissional', '/pages/profissional/', 90], ['article', '/blogs/guia-do-cafe/melhor-cafe-em-grao-para-maquina-automatica/', 90],
  // Templates added in WS5–WS10 and D111.
  ['comparison', '/blogs/guia-do-cafe/cafe-delta-alternativas/', 90], ['method-hub', '/pages/metodo/maquina-automatica/', 90],
  ['calculator', '/pages/calculadora-custo-chavena/', 90], ['quiz', '/pages/qual-o-cafe-para-a-minha-maquina/', 90],
  ['gifts', '/collections/presentes/', 90], ['local', '/pages/fornecedor-de-cafe/porto/', 90],
];
// SITE_DIR=site: the static pre-launch pages (run `npm run serve:static` and pass http://localhost:4190).
const staticTargets = [
  ['home', '/', 85], ['historia', '/pages/historia', 90], ['a-torra', '/pages/a-torra', 90], ['profissional', '/pages/profissional', 90],
  ['contactos', '/pages/contactos', 90], ['faq', '/pages/perguntas-frequentes', 90], ['calculator', '/pages/calculadora-custo-chavena', 90],
  ['local', '/pages/fornecedor-de-cafe/porto', 90], ['product', '/products/lote-super-milano', 90], ['collection', '/collections/cafe', 90],
];
const targets = process.env.SITE_DIR ? staticTargets : prototypeTargets;
const chrome = await chromeLauncher.launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless=new', '--no-sandbox'] });
const results = [];
try {
  for (const [name, url, perfGate] of targets) {
    const runner = await lighthouse(`${base}${url}`, { port: chrome.port, output: ['html', 'json'], logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] });
    const [html, json] = runner.report;
    writeFileSync(path.join(out, `${name}.html`), html);
    writeFileSync(path.join(out, `${name}.json`), json);
    const c = runner.lhr.categories;
    const a = runner.lhr.audits;
    const row = {
      name, url,
      performance: Math.round(c.performance.score * 100), accessibility: Math.round(c.accessibility.score * 100),
      bestPractices: Math.round(c['best-practices'].score * 100), seo: Math.round(c.seo.score * 100),
      lcp: a['largest-contentful-paint'].displayValue, cls: a['cumulative-layout-shift'].displayValue, tbt: a['total-blocking-time'].displayValue,
      perfGate,
    };
    row.pass = row.performance >= perfGate && row.accessibility >= 95 && row.bestPractices >= 95 && row.seo >= 95;
    results.push(row);
    console.log(`${row.pass ? '✓' : '✗'} ${name.padEnd(12)} perf ${row.performance} (≥${perfGate})  a11y ${row.accessibility}  bp ${row.bestPractices}  seo ${row.seo}  LCP ${row.lcp}  CLS ${row.cls}  TBT ${row.tbt}`);
  }
} finally {
  await chrome.kill();
}
writeFileSync(path.join(out, 'summary.json'), JSON.stringify(results, null, 2));
process.exitCode = results.every((r) => r.pass) ? 0 : 1;

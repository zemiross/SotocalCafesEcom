// Static performance budgets (brief §13) from the rendered homepage: first-load JS ≤ 120 KB gzip, CSS ≤ 50 KB gzip,
// fonts ≤ 2 files and ≤ 120 KB. "First load" = scripts/styles referenced by the HTML plus the motion libraries that
// theme.js injects for motion-allowed visitors. Leaflet and search.js load only on demand and are excluded.
// Usage: node scripts/check-budgets.mjs [page]   (default prototype/index.html)
import { readFileSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const page = process.argv[2] || 'prototype/index.html';
const html = readFileSync(path.join(root, page), 'utf8');
const assetsOf = (re) => [...new Set([...html.matchAll(re)].map((m) => m[1]).filter((u) => u.startsWith('/assets/')))];
const scripts = [...assetsOf(/<script[^>]+src="([^"]+)"/g), '/assets/gsap.min.js', '/assets/ScrollTrigger.min.js'];
const styles = assetsOf(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g);
const fonts = assetsOf(/<link[^>]+rel="preload"[^>]+href="([^"]+\.woff2)"/g);
const gz = (u) => gzipSync(readFileSync(path.join(root, u))).length;
const raw = (u) => statSync(path.join(root, u)).size;
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const sum = (list, fn) => list.reduce((s, u) => s + fn(u), 0);
const js = sum(scripts, gz); const css = sum(styles, gz); const font = sum(fonts, raw);
const rows = [
  ['JS (gzip, first load)', js, 120 * 1024, scripts],
  ['CSS (gzip)', css, 50 * 1024, styles],
  ['Fonts (woff2)', font, 120 * 1024, fonts],
];
let fail = false;
const out = [];
for (const [name, value, budget, list] of rows) {
  const ok = value <= budget;
  if (!ok) fail = true;
  out.push(`${ok ? '✓' : '✗'} ${name}: ${kb(value)} / ${kb(budget)}`);
  list.forEach((u) => out.push(`    ${u.padEnd(36)} ${kb(name.startsWith('Fonts') ? raw(u) : gz(u))}`));
}
if (fonts.length > 2) { fail = true; out.push(`✗ Font files preloaded: ${fonts.length} (max 2)`); } else out.push(`✓ Font files preloaded: ${fonts.length} (max 2)`);
mkdirSync(path.join(root, 'qa'), { recursive: true });
writeFileSync(path.join(root, 'qa', 'budgets.txt'), out.join('\n'));
console.log(out.join('\n'));
process.exitCode = fail ? 1 : 0;

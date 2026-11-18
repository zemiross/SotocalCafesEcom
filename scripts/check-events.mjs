// Event consistency (brief WS13): every custom event the theme publishes must be subscribed in the custom pixel and documented,
// and every non-standard event the pixel subscribes to must be published by the theme. Run: npm run check:events
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STANDARD = new Set(['page_viewed', 'product_viewed', 'collection_viewed', 'search_submitted', 'product_added_to_cart', 'cart_viewed', 'checkout_started', 'checkout_completed', 'payment_info_submitted']);

function walk(dir, exts) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'prototype', 'qa', 'tests', 'docs', '.git'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p, exts)); else if (exts.some((x) => e.name.endsWith(x))) out.push(p);
  }
  return out;
}

const published = new Set();
for (const f of ['assets', 'sections', 'snippets', 'layout'].flatMap((d) => walk(path.join(ROOT, d), ['.js', '.liquid']))) {
  for (const m of readFileSync(f, 'utf8').matchAll(/publish\(\s*'([a-z_]+)'/g)) published.add(m[1]);
}
const pixel = readFileSync(path.join(ROOT, 'store-setup', 'custom-pixel.js'), 'utf8');
const subscribed = new Set([...pixel.matchAll(/analytics\.subscribe\(\s*'([a-z_]+)'/g)].map((m) => m[1]));
const doc = readFileSync(path.join(ROOT, 'docs', 'DATA-MODEL.md'), 'utf8');
const start = doc.indexOf('## Custom analytics events');
const end = doc.indexOf(String.fromCharCode(10) + '## ', start + 1);
const section = doc.slice(start, end === -1 ? undefined : end);
const documented = new Set([...section.matchAll(/^\| `([a-z_]+)` \|/gm)].map((m) => m[1]));

const problems = [];
for (const e of published) {
  if (!subscribed.has(e)) problems.push(`published but not subscribed in the custom pixel: ${e}`);
  if (!documented.has(e)) problems.push(`published but not documented in docs/DATA-MODEL.md: ${e}`);
}
for (const e of subscribed) if (!STANDARD.has(e) && !published.has(e)) problems.push(`subscribed in the pixel but never published by the theme: ${e}`);
for (const e of documented) if (!published.has(e) && !subscribed.has(e)) problems.push(`documented but neither published nor subscribed: ${e}`);

console.log(`Published by the theme (${published.size}): ${[...published].sort().join(', ')}`);
console.log(`Subscribed in the pixel (${subscribed.size}): ${[...subscribed].sort().join(', ')}`);
console.log(`Documented (${documented.size}): ${[...documented].sort().join(', ')}`);
if (problems.length) { console.log('\n' + problems.map((p) => '✗ ' + p).join('\n')); process.exit(1); }
console.log('\n✓ Events published, subscribed and documented consistently');

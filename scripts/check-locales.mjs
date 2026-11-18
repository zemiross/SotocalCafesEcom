// Translation completeness (brief §13): every key in pt-PT.default.json exists in en.json and the reverse (same for
// the schema files), and every literal `'key' | t` used in Liquid exists in the default locale.
// Usage: node scripts/check-locales.mjs   → exit 1 on any gap.
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const load = (f) => JSON.parse(readFileSync(path.join(root, 'locales', f), 'utf8'));
const flat = (obj, prefix = '', out = {}) => {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object') flat(v, key, out); else out[key] = v;
  }
  return out;
};
let problems = 0;
const compare = (a, b, an, bn) => {
  const A = flat(load(a)); const B = flat(load(b));
  for (const k of Object.keys(A)) if (!(k in B)) { console.log(`✗ ${k} is in ${an} but missing from ${bn}`); problems += 1; }
  for (const k of Object.keys(B)) if (!(k in A)) { console.log(`✗ ${k} is in ${bn} but missing from ${an}`); problems += 1; }
  for (const [k, v] of Object.entries(B)) if (A[k] && v === '' && A[k] !== '') { console.log(`✗ ${k} is empty in ${bn}`); problems += 1; }
  return [Object.keys(A).length, Object.keys(B).length];
};
const [s1, s2] = compare('pt-PT.default.json', 'en.json', 'pt-PT', 'en');
const [c1, c2] = compare('pt-PT.default.schema.json', 'en.schema.json', 'pt-PT schema', 'en schema');

// Literal keys used in Liquid.
const storefront = flat(load('pt-PT.default.json'));
const plural = (k) => storefront[`${k}.one`] !== undefined || storefront[`${k}.other`] !== undefined;
const files = [];
for (const dir of ['layout', 'sections', 'snippets', 'blocks', 'templates']) {
  for (const f of readdirSync(path.join(root, dir), { recursive: true })) if (String(f).endsWith('.liquid')) files.push(path.join(dir, String(f)));
}
let used = 0;
for (const file of files) {
  const src = readFileSync(path.join(root, file), 'utf8');
  for (const m of src.matchAll(/'([a-z_]+(?:\.[a-z0-9_-]+)+)'\s*\|\s*t\b/g)) {
    used += 1;
    if (!(m[1] in storefront) && !plural(m[1])) { console.log(`✗ ${file}: '${m[1]}' | t has no pt-PT entry`); problems += 1; }
  }
}
console.log(`Storefront keys: pt-PT ${s1}, en ${s2}. Schema keys: pt-PT ${c1}, en ${c2}. Literal t-calls checked: ${used}.`);
console.log(problems ? `✗ ${problems} problem(s)` : '✓ Locales complete and in sync');
process.exitCode = problems ? 1 : 0;

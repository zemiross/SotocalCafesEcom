// JSON-LD parse + required-field checks on every rendered prototype page (brief §13).
// Usage: node scripts/check-jsonld.mjs   (run `npm run prototype` first)
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const proto = path.join(root, process.env.SITE_DIR || process.argv.find((x) => x.startsWith('--site='))?.slice(7) || 'prototype');
const pages = readdirSync(proto, { recursive: true }).map(String).filter((f) => f.endsWith('.html'));
const REQUIRED = {
  Organization: ['@id', 'name', 'legalName', 'url', 'logo', 'foundingDate', 'address', 'telephone', 'vatID'],
  WebSite: ['@id', 'url', 'name'],
  BreadcrumbList: ['itemListElement'],
  Product: ['name', 'offers'],
  ProductGroup: ['name', 'hasVariant', 'productGroupID'],
  Offer: ['price', 'priceCurrency', 'availability'],
  CollectionPage: ['url', 'mainEntity'],
  ItemList: ['itemListElement'],
  BlogPosting: ['headline', 'datePublished', 'author', 'publisher'],
  Recipe: ['name', 'recipeIngredient', 'recipeInstructions', 'author'],
  FAQPage: ['mainEntity'],
  AboutPage: ['url', 'about'],
  ContactPage: ['url'],
  Person: ['name'],
};
const report = [];
let errors = 0;
const walk = (node, file) => {
  if (Array.isArray(node)) { node.forEach((n) => walk(n, file)); return; }
  if (!node || typeof node !== 'object') return;
  const type = node['@type'];
  if (type && REQUIRED[type]) {
    for (const f of REQUIRED[type]) {
      const v = node[f];
      if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0 && f !== 'recipeIngredient')) {
        report.push(`✗ ${file}: ${type} missing ${f}`); errors += 1;
      }
    }
  }
  Object.values(node).forEach((v) => walk(v, file));
};
const types = {};
for (const file of pages) {
  const html = readFileSync(path.join(proto, file), 'utf8');
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1]);
      const nodes = data['@graph'] || [data];
      nodes.forEach((n) => { types[n['@type']] = (types[n['@type']] || 0) + 1; });
      walk(data, file);
    } catch (e) { report.push(`✗ ${file}: JSON-LD does not parse (${e.message})`); errors += 1; }
  }
}
mkdirSync(path.join(root, 'qa'), { recursive: true });
writeFileSync(path.join(root, 'qa', 'jsonld.txt'), [...report, '', JSON.stringify(types, null, 2)].join('\n'));
report.forEach((r) => console.log(r));
console.log(`Pages: ${pages.length}. Node types: ${Object.entries(types).map(([t, n]) => `${t} ${n}`).join(', ')}`);
console.log(errors ? `✗ ${errors} JSON-LD problem(s)` : '✓ All JSON-LD parses and has the required fields');
process.exitCode = errors ? 1 : 0;

// Builds store-setup/products.csv from store-setup/products.json in Shopify's current product CSV format
// (columns as listed at https://help.shopify.com/en/manual/products/import-export/using-csv).
// Template suffix, unit price and metafields are not CSV columns we rely on; scripts/store-setup.mjs --products sets them.
//
//   node store-setup/products-csv.mjs

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const { products, placeholderPrice, placeholderPricePerKgCoffee } = JSON.parse(await readFile(path.join(dir, 'products.json'), 'utf8'));

const columns = [
  'Title', 'URL handle', 'Description', 'Vendor', 'Product category', 'Type', 'Tags', 'Published on online store', 'Status',
  'SKU', 'Barcodes', 'Option1 name', 'Option1 value', 'Option2 name', 'Option2 value', 'Price', 'Compare-at price',
  'Charge tax', 'Inventory tracker', 'Continue selling when out of stock', 'Weight value (grams)', 'Weight unit for display',
  'Requires shipping', 'Fulfillment service', 'Product image URL', 'Image position', 'Image alt text', 'Gift card',
  'SEO title', 'SEO description'
];

const grams = (value) => {
  const m = String(value).replace(',', '.').match(/([\d.]+)\s*(kg|g)\b/i);
  if (!m) return '';
  return String(Math.round(Number(m[1]) * (m[2].toLowerCase() === 'kg' ? 1000 : 1)));
};

const cell = (v) => {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const rows = [];
for (const p of products) {
  if (p.csv === false) continue;
  const optionNames = Object.keys(p.options ?? { Title: ['Default Title'] });
  const optionValues = Object.values(p.options ?? { Title: ['Default Title'] });
  // Cartesian product of option values → one row per variant.
  const combos = optionValues.reduce((acc, values) => acc.flatMap((a) => values.map((v) => [...a, v])), [[]]);
  combos.forEach((combo, i) => {
    const first = i === 0;
    const weightOption = p.unitPriceFromOption ? combo[optionNames.indexOf(p.unitPriceFromOption)] : null;
    rows.push({
      'Title': first ? p.title : '',
      'URL handle': p.handle,
      'Description': first ? p.body_html : '',
      'Vendor': first ? 'Sotocal' : '',
      'Product category': '',
      'Type': first ? p.type : '',
      'Tags': first ? p.tags.join(', ') : '',
      'Published on online store': first ? 'TRUE' : '',
      'Status': first ? 'draft' : '',
      'SKU': '',
      'Barcodes': '',
      'Option1 name': first ? optionNames[0] : '',
      'Option1 value': combo[0],
      'Option2 name': first && optionNames[1] ? optionNames[1] : '',
      'Option2 value': combo[1] ?? '',
      // Placeholder: coffee at 40 EUR per kg (decision D91), everything else 1,00. Both stay tagged preco-provisorio.
      'Price': p.type === 'Café' && weightOption && placeholderPricePerKgCoffee ? ((grams(weightOption) / 1000) * placeholderPricePerKgCoffee).toFixed(2) : placeholderPrice,
      'Compare-at price': '',
      'Charge tax': 'TRUE',
      'Inventory tracker': 'shopify',
      'Continue selling when out of stock': 'DENY',
      'Weight value (grams)': weightOption ? grams(weightOption) : '',
      'Weight unit for display': weightOption ? (/kg/i.test(weightOption) ? 'kg' : 'g') : '',
      'Requires shipping': 'TRUE',
      'Fulfillment service': 'manual',
      'Product image URL': '',
      'Image position': '',
      'Image alt text': '',
      'Gift card': first ? 'FALSE' : '',
      'SEO title': first ? (p.seo_title ?? '') : '',
      'SEO description': first ? (p.seo_description ?? '') : ''
    });
  });
}

const csv = [columns.join(','), ...rows.map((r) => columns.map((c) => cell(r[c])).join(','))].join('\n') + '\n';
await writeFile(path.join(dir, 'products.csv'), csv, 'utf8');
console.log(`products.csv: ${rows.length} rows, ${products.filter((p) => p.csv !== false).length} products`);

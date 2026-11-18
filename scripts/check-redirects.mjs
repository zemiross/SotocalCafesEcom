// Validates docs/redirects.csv for Shopify's URL-redirect import (brief §11): exact header, two columns, paths start
// with "/", no duplicate sources, no chains or loops, every legacy page from §3 covered.
// Usage: node scripts/check-redirects.mjs
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lines = readFileSync(path.join(root, 'docs', 'redirects.csv'), 'utf8').replace(/^﻿/, '').trim().split(/\r?\n/);
let problems = 0;
const fail = (m) => { console.log(`✗ ${m}`); problems += 1; };
if (lines[0] !== 'Redirect from,Redirect to') fail(`header must be "Redirect from,Redirect to" (got "${lines[0]}")`);
const map = new Map();
lines.slice(1).forEach((line, i) => {
  const cols = line.split(',');
  if (cols.length !== 2) { fail(`line ${i + 2}: expected 2 columns, got ${cols.length}: ${line}`); return; }
  const [from, to] = cols.map((c) => c.trim());
  if (!from.startsWith('/')) fail(`line ${i + 2}: source must start with "/": ${from}`);
  if (!to.startsWith('/') && !to.startsWith('https://')) fail(`line ${i + 2}: target must be a path or https URL: ${to}`);
  if (map.has(from)) fail(`line ${i + 2}: duplicate source ${from}`);
  if (from === to.split('?')[0]) fail(`line ${i + 2}: redirects to itself: ${from}`);
  map.set(from, to);
});
for (const [from, to] of map) if (map.has(to.split('?')[0])) fail(`chain: ${from} → ${to} → ${map.get(to.split('?')[0])}`);
const legacy = ['index.php', 'empresa.php', 'missao.php', 'valores.php', 'tipos-de-cafe.php', 'cafe-e-a-saude.php', 'produtos-super-milano.php', 'produtos-super-torrado.php',
  'produtos-reggio.php', 'produtos-descafeinado.php', 'complementares-acucar.php', 'complementares-adocante.php', 'complementares-descafeinado.php', 'complementares-cha.php',
  'complementares-amendoins.php', 'conservas.php', 'sucedaneos-bom-dia.php', 'sucedaneos-sako.php', 'sucedaneos-cevada.php', 'sucedaneos-cevada-oriente.php', 'colorau.php',
  'pimenta.php', 'piri-piri.php', 'canela.php', 'cravinho.php', 'cominhos.php', 'vantagens.php', 'expresso.php', 'melhor-cafe.php', 'profissional.php', 'curiosidades.php',
  'contactos.php', 'projeto.pdf'];
for (const l of legacy) if (!map.has(`/${l}`)) fail(`legacy /${l} has no redirect`);
for (const q of ['/q/chavena', '/q/acucar']) if (!map.has(q)) fail(`QR path ${q} has no redirect`);
console.log(`${map.size} redirects checked.`);
console.log(problems ? `✗ ${problems} problem(s)` : '✓ redirects.csv is valid and covers every legacy URL');
process.exitCode = problems ? 1 : 0;

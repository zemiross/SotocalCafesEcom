#!/usr/bin/env node
// Legacy content harvest for sotocalcafes.pt (brief §3).
// Node 24, built-in fetch only. Usage: node scripts/harvest.mjs
// Output:
//   reference/legacy-raw/<page>.html + <page>.txt   (raw HTML + extracted text)
//   reference/legacy-raw/projeto.pdf
//   reference/legacy-images/<file>                   (all /images/* referenced or listed)
//   reference/legacy-raw/_manifest.json              (status per URL, image usage map)

import { mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RAW = join(ROOT, 'reference', 'legacy-raw');
const IMG = join(ROOT, 'reference', 'legacy-images');
const BASE = 'https://sotocalcafes.pt/';

const PAGES = [
  'index.php',
  'empresa.php', 'missao.php', 'valores.php',
  'tipos-de-cafe.php', 'cafe-e-a-saude.php',
  'produtos-super-milano.php', 'produtos-super-torrado.php', 'produtos-reggio.php', 'produtos-descafeinado.php',
  'complementares-acucar.php', 'complementares-adocante.php', 'complementares-descafeinado.php',
  'complementares-cha.php', 'complementares-amendoins.php',
  'conservas.php',
  'sucedaneos-bom-dia.php', 'sucedaneos-sako.php', 'sucedaneos-cevada.php', 'sucedaneos-cevada-oriente.php',
  'colorau.php', 'pimenta.php', 'piri-piri.php', 'canela.php', 'cravinho.php', 'cominhos.php',
  'vantagens.php', 'expresso.php', 'melhor-cafe.php', 'profissional.php', 'curiosidades.php', 'contactos.php',
];

// Images named in the brief; globs (lote-*, cafe-mistura-*, cevada-*, spices) are resolved from page references.
const LISTED_IMAGES = [
  'logo-sotocal.png', 'home.jpg', 'home-mobile.jpg',
  ...Array.from({ length: 12 }, (_, i) => `pic${String(i + 1).padStart(2, '0')}.jpg`),
  'pic06-arabica.jpg', 'pic06-robusta.jpg',
  'acucar.png', 'adocante-01.png', 'descafeinado-01.png', 'cha-01.png', 'amendoins-01.png',
  'conservas.png', 'pme-excelencia.jpg', 'pme-lider.jpg', 'confraria.png', 'projeto.png',
  'livro-reclamacoes-logo.jpg', 'valores.png',
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, { attempts = 5, timeout = 20000 } = {}) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeout);
    try {
      const res = await fetch(url, {
        signal: ctrl.signal,
        headers: { 'user-agent': 'Mozilla/5.0 (compatible; SotocalHarvest/1.0; theme migration)' },
        redirect: 'follow',
      });
      clearTimeout(timer);
      if (res.status >= 500) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (err) {
      clearTimeout(timer);
      lastErr = err;
      const wait = 1000 * 2 ** i;
      console.warn(`  retry ${i + 1}/${attempts} ${url} in ${wait} ms (${err.message})`);
      await sleep(wait);
    }
  }
  throw lastErr;
}

function decodeBody(buf, contentType) {
  const head = buf.subarray(0, 4096).toString('latin1');
  const m = /charset=["']?([\w-]+)/i.exec(contentType || '') || /<meta[^>]+charset=["']?([\w-]+)/i.exec(head);
  const charset = (m ? m[1] : 'utf-8').toLowerCase();
  try {
    return new TextDecoder(charset === 'iso-8859-1' ? 'latin1' : charset).decode(buf);
  } catch {
    return new TextDecoder('utf-8').decode(buf);
  }
}

const ENTITIES = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", ordm: 'º', ordf: 'ª', laquo: '«', raquo: '»', euro: '€', copy: '©', reg: '®', deg: '°', middot: '·', hellip: '…', ndash: '–', mdash: '—', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”' };
function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => {
      if (ENTITIES[n.toLowerCase()] !== undefined) return ENTITIES[n.toLowerCase()];
      // accented letters: &aacute; &ccedil; &atilde; ...
      const acc = { acute: '́', grave: '̀', circ: '̂', tilde: '̃', uml: '̈', cedil: '̧' };
      const mm = /^([a-z])(acute|grave|circ|tilde|uml|cedil)$/i.exec(n);
      return mm ? (mm[1] + acc[mm[2].toLowerCase()]).normalize('NFC') : m;
    });
}

function htmlToText(html) {
  let s = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, '')
    .replace(/<img[^>]*alt=["']([^"']+)["'][^>]*>/gi, ' [img: $1] ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li|tr|section|article|header|footer|ul|ol|table|nav)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n- ')
    .replace(/<h([1-6])[^>]*>/gi, (_, n) => '\n' + '#'.repeat(Number(n)) + ' ')
    .replace(/<[^>]+>/g, ' ');
  s = decodeEntities(s);
  return s
    .split('\n')
    .map((l) => l.replace(/[ \t ]+/g, ' ').trim())
    .filter((l, i, arr) => l || (arr[i - 1] && arr[i - 1].trim()))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function imageRefs(html) {
  const out = new Set();
  const re = /(?:src|href|data-src|srcset|content)=["']([^"']*images\/[^"'\s]+)["']|url\(\s*['"]?([^'")]*images\/[^'")]+)['"]?\s*\)/gi;
  let m;
  while ((m = re.exec(html))) {
    const ref = (m[1] || m[2]).split(/\s+/)[0];
    const abs = new URL(ref, BASE).href;
    if (abs.startsWith(BASE)) out.add(abs);
  }
  return [...out];
}

function dims(buf) {
  // PNG
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  // GIF
  if (buf.subarray(0, 3).toString('latin1') === 'GIF') return { w: buf.readUInt16LE(6), h: buf.readUInt16LE(8) };
  // JPEG
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let o = 2;
    while (o < buf.length) {
      if (buf[o] !== 0xff) { o++; continue; }
      const marker = buf[o + 1];
      const len = buf.readUInt16BE(o + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { h: buf.readUInt16BE(o + 5), w: buf.readUInt16BE(o + 7) };
      }
      o += 2 + len;
    }
  }
  // WebP (VP8X / VP8 / VP8L)
  if (buf.subarray(0, 4).toString('latin1') === 'RIFF' && buf.subarray(8, 12).toString('latin1') === 'WEBP') {
    const chunk = buf.subarray(12, 16).toString('latin1');
    if (chunk === 'VP8X') return { w: 1 + buf.readUIntLE(24, 3), h: 1 + buf.readUIntLE(27, 3) };
    if (chunk === 'VP8 ') return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
    if (chunk === 'VP8L') {
      const b = buf.readUInt32LE(21);
      return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 };
    }
  }
  return null;
}

async function main() {
  await mkdir(RAW, { recursive: true });
  await mkdir(IMG, { recursive: true });
  const manifest = { fetchedAt: new Date().toISOString(), pages: {}, images: {}, pdf: null };
  const usage = new Map(); // image URL -> Set(page)

  for (const page of PAGES) {
    const url = BASE + page;
    process.stdout.write(`page ${page} ... `);
    try {
      const res = await fetchWithRetry(url);
      const buf = Buffer.from(await res.arrayBuffer());
      const html = decodeBody(buf, res.headers.get('content-type'));
      const slug = page.replace(/\.php$/, '');
      await writeFile(join(RAW, `${slug}.html`), html, 'utf8');
      await writeFile(join(RAW, `${slug}.txt`), htmlToText(html) + '\n', 'utf8');
      for (const ref of imageRefs(html)) {
        if (!usage.has(ref)) usage.set(ref, new Set());
        usage.get(ref).add(page);
      }
      manifest.pages[page] = { status: res.status, finalUrl: res.url, bytes: buf.length };
      console.log(res.status);
    } catch (err) {
      manifest.pages[page] = { status: 'failed', error: err.message };
      console.log(`FAILED (${err.message})`);
    }
  }

  for (const f of LISTED_IMAGES) {
    const u = BASE + 'images/' + f;
    if (!usage.has(u)) usage.set(u, new Set());
  }

  for (const [u, pages] of usage) {
    const file = decodeURIComponent(new URL(u).pathname.replace(/^\/images\//, '')).replace(/[\\/]/g, '__');
    process.stdout.write(`image ${file} ... `);
    try {
      const res = await fetchWithRetry(u);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await writeFile(join(IMG, file), buf);
      manifest.images[file] = { url: u, bytes: buf.length, ...(dims(buf) || {}), usedOn: [...pages] };
      console.log(buf.length);
    } catch (err) {
      manifest.images[file] = { url: u, status: 'failed', error: err.message, usedOn: [...pages] };
      console.log(`FAILED (${err.message})`);
    }
  }

  try {
    const res = await fetchWithRetry(BASE + 'projeto.pdf', { timeout: 40000 });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(join(RAW, 'projeto.pdf'), buf);
    manifest.pdf = { status: res.status, bytes: buf.length };
  } catch (err) {
    manifest.pdf = { status: 'failed', error: err.message };
  }

  await writeFile(join(RAW, '_manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
  const failedPages = Object.entries(manifest.pages).filter(([, v]) => v.status !== 200);
  console.log(`\npages ok: ${PAGES.length - failedPages.length}/${PAGES.length}; images: ${Object.keys(manifest.images).length}; pdf: ${manifest.pdf.status}`);
}

main().catch((e) => { console.error(e); process.exit(1); });

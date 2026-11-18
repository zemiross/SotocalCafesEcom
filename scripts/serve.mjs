// Static server for /prototype. Serves the theme's real /assets and /reference so the prototype uses the same CSS/JS.
// Cart AJAX endpoints answer with an empty sections payload so the drawer flow runs without a store.
// Usage: node scripts/serve.mjs [port]   (default 4173)
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.argv[2] || process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.txt': 'text/plain' };

const cdn = {};
createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  let p = decodeURIComponent(url.pathname);
  if (/\/cart\/(add|change|update)(\.js)?$/.test(p)) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ sections: {}, items: [] }));
    return;
  }
  if (p.endsWith('/search/suggest.json')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ resources: { results: { products: [], articles: [], pages: [], collections: [] } } }));
    return;
  }
  // Emulate Shopify's image CDN (image_url): resize to ?width= and serve WebP, so performance runs are representative.
  if (p.startsWith('/reference/') && url.searchParams.has('width') && /\.(png|jpe?g)$/i.test(p)) {
    const key = `${p}@${url.searchParams.get('width')}`;
    try {
      cdn[key] ||= await sharp(path.join(root, p)).resize({ width: Number(url.searchParams.get('width')), withoutEnlargement: true }).webp({ quality: 78 }).toBuffer();
      res.writeHead(200, { 'Content-Type': 'image/webp', 'Cache-Control': 'no-cache' });
      res.end(cdn[key]);
      return;
    } catch { /* fall through to the original file */ }
  }
  let file;
  if (p.startsWith('/assets/') || p.startsWith('/reference/')) file = path.join(root, p);
  else file = path.join(root, 'prototype', p);
  try {
    let s = await stat(file);
    if (s.isDirectory()) { file = path.join(file, 'index.html'); s = await stat(file); }
    const body = await readFile(file);
    const ext = path.extname(file);
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(body);
  } catch {
    const body = await readFile(path.join(root, 'prototype', '404.html')).catch(() => 'Not found');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(body);
  }
}).listen(port, () => console.log(`Prototype on http://localhost:${port}/`));

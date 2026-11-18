// Builds placeholder raster assets for the theme (DECISIONS D13). Re-run after replacing sources.
//   - logo-sotocal.png, favicon.png, apple-touch-icon.png: rasters of the official vector logo
//   - lote-*.webp: legacy blend packshots (alpha WebP)
//   - bean-<n>-<state>[-far].webp: 6 bean poses × green/roasted, same pose and scale per pair; far = pre-blurred
//   - og-*.png: 1200 × 630 Open Graph templates (home, shop, guide)
//   - livro-reclamacoes.png, cofunding-projeto.png, award-*.webp: legacy badges
// Usage: node scripts/make-placeholders.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { statSync } from 'node:fs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const legacy = (f) => path.join(root, 'reference', 'legacy-images', f);
const asset = (f) => path.join(root, 'assets', f);
const report = (f) => console.log(`${f.padEnd(34)} ${(statSync(asset(f)).size / 1024).toFixed(1)} KB`);

// 1. Logo rasters from the official vector (assets/logo-sotocal*.svg, made by scripts/ai-to-svg.mjs):
//    a PNG for structured data (search engines prefer raster logos), the favicon and the apple-touch icon.
{
  await sharp(asset('logo-sotocal.svg'), { density: 216 }).resize({ width: 600 }).png({ compressionLevel: 9 }).toFile(asset('logo-sotocal.png'));
  report('logo-sotocal.png');
  const icon = async (size, file, pad) => {
    const inner = Math.round(size * (1 - pad * 2));
    const emblem = await sharp(asset('logo-sotocal-emblem.svg'), { density: 300 }).resize({ width: inner }).png().toBuffer();
    const meta = await sharp(emblem).metadata();
    await sharp({ create: { width: size, height: size, channels: 4, background: '#210000' } })
      .composite([{ input: emblem, left: Math.round((size - meta.width) / 2), top: Math.round((size - meta.height) / 2) }])
      .png({ compressionLevel: 9 }).toFile(asset(file));
    report(file);
  };
  await icon(64, 'favicon.png', 0.02);
  await icon(180, 'apple-touch-icon.png', 0.08);
}

// 2. Blend packshots.
for (const [from, to] of [
  ['lote-super-milano.png', 'lote-super-milano.webp'],
  ['lote-super-torrado.png', 'lote-super.webp'],
  ['lote-reggio.png', 'lote-reggio.webp'],
  ['lote-descafeinado.png', 'lote-descafeinado.webp'],
]) {
  await sharp(legacy(from)).resize({ width: 720 }).webp({ quality: 80, alphaQuality: 90 }).toFile(asset(to));
  report(to);
}

// 3. Beans. Each pose: aspect, crease bend, tilt. Lit from the upper left.
const poses = [
  { rx: 112, ry: 158, bend: 34, tilt: -18 },
  { rx: 120, ry: 150, bend: -28, tilt: 22 },
  { rx: 104, ry: 162, bend: 40, tilt: 8 },
  { rx: 118, ry: 146, bend: -36, tilt: -34 },
  { rx: 110, ry: 155, bend: 26, tilt: 40 },
  { rx: 124, ry: 152, bend: -22, tilt: -6 },
];
const states = {
  green: { base: '#9c9a6f', light: '#d6d2a4', dark: '#5f5c3c', crease: '#4a4a2e', sheen: 0.18 },
  roasted: { base: '#4a2414', light: '#9a5a36', dark: '#1a0a04', crease: '#0c0402', sheen: 0.55 },
};
const beanSvg = ({ rx, ry, bend, tilt }, s) => `
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <radialGradient id="b" cx="38%" cy="30%" r="78%">
      <stop offset="0" stop-color="${s.light}"/><stop offset=".45" stop-color="${s.base}"/><stop offset="1" stop-color="${s.dark}"/>
    </radialGradient>
    <radialGradient id="h" cx="34%" cy="26%" r="30%">
      <stop offset="0" stop-color="#fff8e8" stop-opacity="${s.sheen}"/><stop offset="1" stop-color="#fff8e8" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <g transform="rotate(${tilt} 200 200)">
    <ellipse cx="200" cy="200" rx="${rx}" ry="${ry}" fill="url(#b)"/>
    <path d="M200 ${200 - ry * 0.86} C ${200 + bend} ${200 - ry * 0.35}, ${200 - bend} ${200 + ry * 0.35}, 200 ${200 + ry * 0.86}"
      fill="none" stroke="${s.crease}" stroke-width="13" stroke-linecap="round"/>
    <path d="M206 ${200 - ry * 0.8} C ${206 + bend} ${200 - ry * 0.3}, ${206 - bend} ${200 + ry * 0.38}, 206 ${200 + ry * 0.8}"
      fill="none" stroke="${s.light}" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="200" cy="200" rx="${rx}" ry="${ry}" fill="url(#h)"/>
  </g>
</svg>`;
for (const [i, pose] of poses.entries()) {
  for (const [state, s] of Object.entries(states)) {
    const svg = Buffer.from(beanSvg(pose, s));
    const name = `bean-${i + 1}-${state}.webp`;
    await sharp(svg).webp({ quality: 82, alphaQuality: 90 }).toFile(asset(name));
    if (i < 3) {
      const far = `bean-${i + 1}-${state}-far.webp`;
      await sharp(svg).resize(240, 240).blur(5).webp({ quality: 70, alphaQuality: 80 }).toFile(asset(far));
    }
  }
}
console.log('beans: 12 near + 6 far written');

// 4. OG templates (1200 × 630): the real emblem on ink, the line in a system serif until brand OG art exists (asset A8).
const emblemOg = await sharp(asset('logo-sotocal-emblem.svg'), { density: 300 }).resize({ width: 420 }).png().toBuffer();
const og = (title, sub) => Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#FCEFCC"/>
  <rect x="0" y="0" width="520" height="630" fill="#210000"/>
  <text font-family="Georgia, 'Times New Roman', serif" font-size="68" fill="#210000">${title.map((l, i) => `<tspan x="580" y="${250 + i * 78}">${l}</tspan>`).join('')}</text>
  <text x="580" y="${250 + title.length * 78 + 24}" font-family="Arial, sans-serif" font-size="30" fill="#4A2A22">${sub}</text>
</svg>`);
for (const [file, title, sub] of [
  ['og-home.png', ['O café que vem', 'do Norte.'], 'Torrado no Porto desde 1960'],
  ['og-shop.png', ['Café em grão', 'e moído'], 'Loja online Sotocal'],
  ['og-guide.png', ['Guia do café'], 'Sotocal, torrado no Porto desde 1960'],
]) {
  await sharp(og(title, sub)).composite([{ input: emblemOg, left: 50, top: 180 }]).png({ compressionLevel: 9 }).toFile(asset(file));
  report(file);
}

// 5. Legacy badges.
await sharp(legacy('livro-reclamacoes-logo.jpg')).resize({ width: 240 }).png({ compressionLevel: 9, palette: true }).toFile(asset('livro-reclamacoes.png'));
report('livro-reclamacoes.png');
await sharp(legacy('projeto.png')).resize({ width: 900 }).png({ compressionLevel: 9, palette: true }).toFile(asset('cofunding-projeto.png'));
report('cofunding-projeto.png');
await sharp(legacy('pme-excelencia.jpg')).resize({ width: 480 }).webp({ quality: 78 }).toFile(asset('award-pme-excelencia-2001.webp'));
await sharp(legacy('pme-lider.jpg')).resize({ height: 480 }).webp({ quality: 78 }).toFile(asset('award-pme-lider-2011.webp'));
report('award-pme-excelencia-2001.webp');
report('award-pme-lider-2011.webp');

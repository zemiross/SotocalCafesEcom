// Builds a contact sheet (grid of downscaled screenshots) for quick visual review.
// Usage: node scripts/contact-sheet.mjs <out.png> <cols> <thumbWidth> <file...>
import sharp from 'sharp';
const [out, colsArg, widthArg, ...files] = process.argv.slice(2);
const cols = Number(colsArg); const w = Number(widthArg);
const thumbs = await Promise.all(files.map(async (f) => {
  const img = sharp(f); const m = await img.metadata();
  const h = Math.round((m.height / m.width) * w);
  return { buf: await img.resize(w, h).png().toBuffer(), h };
}));
const rowH = []; thumbs.forEach((t, i) => { const r = Math.floor(i / cols); rowH[r] = Math.max(rowH[r] || 0, t.h); });
const gap = 8; const H = rowH.reduce((a, b) => a + b + gap, gap); const W = cols * (w + gap) + gap;
const comps = []; let y = gap;
rowH.forEach((rh, r) => { for (let c = 0; c < cols; c++) { const i = r * cols + c; if (i >= thumbs.length) break; comps.push({ input: thumbs[i].buf, left: gap + c * (w + gap), top: y }); } y += rh + gap; });
await sharp({ create: { width: W, height: H, channels: 3, background: '#888' } }).composite(comps).png().toFile(out);
console.log(out, W, H);

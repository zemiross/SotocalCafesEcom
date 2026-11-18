// Converts the brand's logo file (FreeHand 9 / Adobe Illustrator 3–5 PostScript, "Sotocal - Logotipo.ai") to SVG.
// Supports the operators that file uses: m l L c C v V y Y (paths), f F (fill), *u *U (compound paths),
// XR (fill rule), Xx / x / k (fill colours). Spot colours keep the RGB the file declares for them:
//   Pant. 466 C  → 0.99 0.94 0.80 → #FCF0CC   Pant. 1545 C → 0.133 0 0 → #220000
// Usage: node scripts/ai-to-svg.mjs "<file.ai>" <out.svg> [--mono] [--emblem]
//   --mono   keeps only the Pantone 1545 C artwork (one-colour version, like the manual's "Impressão a preto").
//   --emblem drops the "Est.1960" line under the oval and crops to the oval (header, footer, favicon: the line is
//            1545 C outside the cream oval and would disappear on ink backgrounds).
import { readFileSync, writeFileSync } from 'node:fs';

const [input, output] = process.argv.slice(2);
if (!input || !output) { console.error('Usage: node scripts/ai-to-svg.mjs <file.ai> <out.svg> [--mono]'); process.exit(1); }
const flags = process.argv.slice(4);
const mono = flags.includes('--mono');
const emblem = flags.includes('--emblem');
const src = readFileSync(input, 'latin1');
const bbox = src.match(/%%BoundingBox:\s*([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)/).slice(1).map(Number);
const [bx0, by0, bx1, by1] = bbox;
const body = src.slice(src.indexOf('%%EndSetup'));

const hex = (r, g, b) => `#${[r, g, b].map((v) => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
const cmyk = (c, m, y, k) => hex((1 - c) * (1 - k), (1 - m) * (1 - k), (1 - y) * (1 - k));
const n = (v) => Math.round(v * 10) / 10; // 0.1 pt is far below a screen pixel at any size the logo is shown
const X = (x) => n(x - bx0);
const Y = (y) => n(by1 - y);

let fill = '#000000'; let fillName = 'black'; let rule = 'nonzero';
let d = ''; let compound = null; let cx = 0; let cy = 0;
const paths = [];
const emit = (pathData) => {
  if (!/[LC]/.test(pathData)) return; // skip degenerate "m F" paths
  if (mono && !/1545/.test(fillName)) return;
  paths.push({ d: pathData.trim(), fill, rule, name: fillName });
};

for (const raw of body.split(/\r\n|\r|\n/)) {
  const line = raw.trim();
  if (!line || line.startsWith('%')) continue;
  const name = line.match(/\(([^)]*)\)/)?.[1];
  const parts = line.replace(/\([^)]*\)/, ' ').trim().split(/\s+/);
  const op = parts.pop();
  const a = parts.map(Number);
  switch (op) {
    case 'm': d += `M${X(a[0])} ${Y(a[1])}`; [cx, cy] = a; break;
    case 'l': case 'L': d += `L${X(a[0])} ${Y(a[1])}`; [cx, cy] = a; break;
    case 'c': case 'C': d += `C${X(a[0])} ${Y(a[1])} ${X(a[2])} ${Y(a[3])} ${X(a[4])} ${Y(a[5])}`; cx = a[4]; cy = a[5]; break;
    case 'v': case 'V': d += `C${X(cx)} ${Y(cy)} ${X(a[0])} ${Y(a[1])} ${X(a[2])} ${Y(a[3])}`; cx = a[2]; cy = a[3]; break;
    case 'y': case 'Y': d += `C${X(a[0])} ${Y(a[1])} ${X(a[2])} ${Y(a[3])} ${X(a[2])} ${Y(a[3])}`; cx = a[2]; cy = a[3]; break;
    case 'f': case 'F': case 'b': case 'B':
      if (op === 'f' || op === 'b') d += 'Z';
      if (compound !== null) compound += d; else emit(d);
      d = ''; break;
    case 'n': case 'N': case 's': case 'S': d = ''; break; // no strokes in this file
    case '*u': compound = ''; break;
    case '*U': if (compound !== null) emit(compound); compound = null; break;
    case 'XR': rule = a[0] === 1 ? 'evenodd' : 'nonzero'; break;
    case 'Xx': case 'XX': // r g b (name) tint type   or   c m y k (name) tint type
      if (a.length >= 5 && a[a.length - 1] === 1) { fill = hex(a[0], a[1], a[2]); }
      else { fill = cmyk(a[0], a[1], a[2], a[3]); }
      fillName = name || fill; break;
    case 'x': fill = cmyk(a[0], a[1], a[2], a[3]); fillName = name || fill; break;
    case 'k': fill = cmyk(a[0], a[1], a[2], a[3]); fillName = fill; break;
    case 'g': fill = hex(a[0], a[0], a[0]); fillName = fill; break;
    default: break;
  }
}

// Emblem: drop subpaths that sit entirely below the oval (the "Est.1960" line), then crop to what is left.
let vb = [0, 0, n(bx1 - bx0), n(by1 - by0)];
if (emblem) {
  const ovalBottom = Math.max(...paths.filter((p) => /466/.test(p.name)).flatMap((p) => [...p.d.matchAll(/-?[\d.]+ (-?[\d.]+)/g)].map((m) => Number(m[1]))));
  for (const p of paths) {
    p.d = p.d.split(/(?=M)/).filter((sub) => {
      const ys = [...sub.matchAll(/-?[\d.]+ (-?[\d.]+)/g)].map((m) => Number(m[1]));
      return Math.min(...ys) < ovalBottom - 1;
    }).join('');
  }
  const xs = []; const ys = [];
  for (const p of paths) for (const m of p.d.matchAll(/(-?[\d.]+) (-?[\d.]+)/g)) { xs.push(Number(m[1])); ys.push(Number(m[2])); }
  vb = [n(Math.min(...xs)), n(Math.min(...ys)), n(Math.max(...xs) - Math.min(...xs)), n(Math.max(...ys) - Math.min(...ys))];
}

// Merge consecutive paths that share fill and rule (smaller file, same rendering).
const merged = [];
for (const p of paths) {
  const last = merged[merged.length - 1];
  if (last && last.fill === p.fill && last.rule === p.rule) last.d += p.d; else merged.push({ ...p });
}
// Write path data with relative commands and minimal number syntax: about a third smaller, identical shapes
// (coordinates are whole tenths, so the deltas are exact and nothing drifts).
const fmt = (t) => String(t / 10).replace(/^(-?)0\./, '$1.');
const compact = (d) => {
  let out = ''; let x = 0; let y = 0; let sx = 0; let sy = 0; let prev = '';
  for (const [, cmd, args] of d.matchAll(/([MLCZ])([^MLCZ]*)/g)) {
    if (cmd === 'Z') { out += 'z'; x = sx; y = sy; prev = 'z'; continue; }
    const v = args.trim().split(/\s+/).map((s) => Math.round(Number(s) * 10));
    const tokens = [];
    for (let i = 0; i < v.length; i += 2) tokens.push(fmt(v[i] - x), fmt(v[i + 1] - y));
    const c = cmd.toLowerCase();
    let s = c === prev && c !== 'm' ? (tokens[0][0] === '-' ? '' : ' ') : c;
    tokens.forEach((t, i) => { s += (i === 0 || t[0] === '-' || (t[0] === '.' && tokens[i - 1].includes('.')) ? '' : ' ') + t; });
    out += s;
    [x, y] = v.slice(-2);
    if (c === 'm') [sx, sy] = [x, y];
    prev = c;
  }
  return out;
};
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" width="${vb[2]}" height="${vb[3]}" role="img" aria-label="Sotocal Cafés${emblem ? '' : ', Est. 1960'}">
<!-- Converted from "Sotocal - Logotipo.ai" (FreeHand 9, 09/04/2002) by scripts/ai-to-svg.mjs. Colours: Pantone 466 C #FCF0CC, Pantone 1545 C #220000. -->
${merged.map((p) => `<path fill="${p.fill}"${p.rule === 'evenodd' ? ' fill-rule="evenodd"' : ''} d="${compact(p.d)}"/>`).join('\n')}
</svg>
`;
writeFileSync(output, svg);
console.log(`${output}: ${paths.length} paths → ${merged.length} merged, ${(svg.length / 1024).toFixed(1)} KB, colours ${[...new Set(paths.map((p) => `${p.name}=${p.fill}`))].join(', ')}`);

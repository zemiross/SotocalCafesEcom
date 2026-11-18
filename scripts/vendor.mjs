// Copies pinned third-party files into /assets (Shopify assets must be flat) and prints
// metric-matched fallback @font-face overrides computed with Capsize.
// Usage: node scripts/vendor.mjs
import { copyFileSync, statSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const nm = (p) => path.join(root, 'node_modules', p);
const out = (p) => path.join(root, 'assets', p);

const files = [
  ['gsap/dist/gsap.min.js', 'gsap.min.js'],
  ['gsap/dist/ScrollTrigger.min.js', 'ScrollTrigger.min.js'],
  ['leaflet/dist/leaflet.js', 'leaflet.js'],
  ['leaflet/dist/leaflet.css', 'leaflet.css'],
  ['@fontsource/dm-serif-display/files/dm-serif-display-latin-400-normal.woff2', 'dm-serif-display-400.woff2'],
  ['@fontsource/dm-serif-display/files/dm-serif-display-latin-400-italic.woff2', 'dm-serif-display-400-italic.woff2'],
  ['@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', 'inter-var.woff2'],
];

for (const [from, to] of files) {
  copyFileSync(nm(from), out(to));
  console.log(`${to.padEnd(36)} ${(statSync(out(to)).size / 1024).toFixed(1)} KB`);
}

// Leaflet's CSS references marker images; the locator uses divIcons, so no images are needed.
const require = createRequire(import.meta.url);
const pkg = (name) => JSON.parse(readFileSync(nm(`${name}/package.json`), 'utf8')).version;
console.log(`\ngsap ${pkg('gsap')}, leaflet ${pkg('leaflet')}, @fontsource/dm-serif-display ${pkg('@fontsource/dm-serif-display')}, @fontsource-variable/inter ${pkg('@fontsource-variable/inter')}`);

const { createFontStack } = await import('@capsizecss/core');
const metricsDir = '@capsizecss/metrics';
const load = async (n) => (await import(`${metricsDir}/${n}`)).default;
const [dmSerif, inter, times, georgia, arial] = await Promise.all([
  load('dMSerifDisplay'), load('inter'), load('timesNewRoman'), load('georgia'), load('arial'),
]);
for (const [primary, fallbacks] of [[dmSerif, [georgia, times]], [inter, [arial]]]) {
  const stack = createFontStack([primary, ...fallbacks]);
  console.log(`\n/* ${primary.familyName} */\n${stack.fontFaces}`);
}

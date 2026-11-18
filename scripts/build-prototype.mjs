// Renders the theme's own Liquid (layout, sections, snippets, blocks, templates) with LiquidJS and mock data into
// /prototype, so Playwright, axe-core and Lighthouse test the real theme markup, CSS and JS (DECISIONS D02).
// Shopify-only tags and filters are shimmed below; anything unknown is logged so gaps are visible.
// Usage: node scripts/build-prototype.mjs  →  then `node scripts/serve.mjs` and open http://localhost:4173/
import { Liquid, Tag, Value } from 'liquidjs';
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildMock } from './prototype/mock-data.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'prototype');
const read = (...p) => readFileSync(path.join(root, ...p), 'utf8');
const warnings = new Set();

// ---------- Source transforms ----------
const stripSchema = (src) => src
  .replace(/\{%-?\s*schema\s*-?%\}[\s\S]*?\{%-?\s*endschema\s*-?%\}/g, '')
  .replace(/\{%-?\s*(stylesheet|javascript)\s*-?%\}[\s\S]*?\{%-?\s*end\1\s*-?%\}/g, '')
  .replace(/\{%-?\s*doc\s*-?%\}[\s\S]*?\{%-?\s*enddoc\s*-?%\}/g, '');
const schemaOf = (file) => {
  const m = readFileSync(file, 'utf8').match(/\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/);
  return m ? JSON.parse(m[1]) : {};
};

const fsImpl = {
  resolve: (dir, file, ext) => {
    const name = file.endsWith(ext) ? file : file + ext;
    return path.resolve(dir, name);
  },
  readFileSync: (file) => stripSchema(readFileSync(file, 'utf8')),
  readFile: async (file) => stripSchema(readFileSync(file, 'utf8')),
  existsSync: (file) => existsSync(file),
  exists: async (file) => existsSync(file),
  contains: () => true,
  dirname: (f) => path.dirname(f),
  sep: path.sep,
};

const engine = new Liquid({
  root: [path.join(root, 'snippets')],
  partials: [path.join(root, 'snippets')],
  extname: '.liquid',
  fs: fsImpl,
  relativeReference: false,
  dynamicPartials: true,
  strictFilters: false,
  strictVariables: false,
  ownPropertyOnly: false,
  orderedFilterParameters: true,
});

// ---------- Helpers ----------
let currentLocale = {};
let currentLang = 'pt-PT';
let mock;
const lookup = (obj, key) => key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
const kw = (args) => {
  const o = {};
  const pos = [];
  for (const a of args) { if (Array.isArray(a) && a.length === 2 && typeof a[0] === 'string') o[a[0]] = a[1]; else pos.push(a); }
  return { o, pos };
};
const money = (cents, trim = false) => {
  if (cents == null || cents === '') return '';
  const n = Number(cents) / 100;
  let s = n.toFixed(2);
  if (trim && s.endsWith('.00')) s = s.slice(0, -3);
  const [i, d] = s.split('.');
  const int = i.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${int}${d ? `,${d}` : ''} €`;
};
const escapeAttr = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
class ImageUrl {
  constructor(img, width) { this.img = img; this.width = width; }
  toString() { return `${this.img.src}${this.img.src.includes('?') ? '&' : '?'}width=${this.width}`; }
}

// ---------- Filters ----------
const f = (name, fn) => engine.registerFilter(name, fn);
f('t', function (key, ...args) {
  const { o } = kw(args);
  let v = lookup(currentLocale, key);
  if (v && typeof v === 'object' && 'count' in o) v = Number(o.count) === 1 ? v.one : v.other;
  if (v == null) { warnings.add(`missing locale key: ${key}`); return `translation missing: ${currentLang}.${key}`; }
  return String(v).replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => (o[k] ?? ''));
});
f('asset_url', (name) => `/assets/${name}`);
f('stylesheet_tag', (url) => `<link rel="stylesheet" href="${url}" media="all">`);
f('preload_tag', (url, ...args) => { const { o } = kw(args); return `<link rel="preload" href="${url}"${Object.entries(o).map(([k, v]) => ` ${k}="${v}"`).join('')}>`; });
f('script_tag', (url) => `<script src="${url}" defer></script>`);
f('money', (c) => money(c));
f('money_without_trailing_zeros', (c) => money(c, true));
f('money_without_currency', (c) => money(c).replace(' €', ''));
// Shopify divides integers by integers with floor; LiquidJS cannot tell 100 from 100.0, so the theme writes `| floor`
// wherever it wants integer division and this shim always divides as floats.
f('divided_by', (a, b) => Number(a) / Number(b));
f('handle', (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
f('handleize', (s) => engine.filters.handle.call(null, s));
f('image_url', (img, ...args) => {
  if (!img) return '';
  if (typeof img === 'string') return img;
  const { o } = kw(args);
  return new ImageUrl(img, o.width || img.width || 800);
});
f('image_tag', (url, ...args) => {
  const { o } = kw(args);
  const img = url instanceof ImageUrl ? url.img : { src: String(url), width: 800, height: 800 };
  const widths = String(o.widths || '').split(',').map((w) => Number(w.trim())).filter(Boolean);
  const src = url instanceof ImageUrl ? String(url) : img.src;
  const srcset = widths.length ? ` srcset="${widths.map((w) => `${img.src}${img.src.includes('?') ? '&' : '?'}width=${w} ${w}w`).join(', ')}"` : '';
  const w = o.width || img.width; const h = o.height || img.height;
  const attrs = [`src="${src}"`, srcset.trim(), o.sizes ? `sizes="${o.sizes}"` : '', `alt="${escapeAttr(o.alt ?? img.alt ?? '')}"`,
    w ? `width="${w}"` : '', h ? `height="${h}"` : '', o.loading ? `loading="${o.loading}"` : '',
    o.fetchpriority ? `fetchpriority="${o.fetchpriority}"` : '', o.class ? `class="${o.class}"` : '', o.style ? `style="${o.style}"` : ''].filter(Boolean);
  return `<img ${attrs.join(' ')}>`;
});
f('placeholder_svg_tag', () => '<svg class="placeholder-svg" viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100"/></svg>');
f('payment_type_svg_tag', (type) => `<svg viewBox="0 0 38 24" role="img" aria-label="${type}"><rect width="38" height="24" rx="3" fill="#FFF7DE" stroke="#EBD4A0"/><text x="19" y="15" font-size="7" text-anchor="middle" fill="#210000" font-family="Arial">${String(type).slice(0, 6)}</text></svg>`);
f('json', (v) => JSON.stringify(v instanceof ImageUrl ? String(v) : v ?? null));
f('within', (url) => url);
f('time_tag', (d, fmt) => `<time datetime="${d}">${d}</time>`);
f('font_face', () => '');

// ---------- Tags ----------
const splitArgs = (s) => {
  const parts = []; let cur = ''; let q = null;
  for (const ch of s) {
    if (q) { cur += ch; if (ch === q) q = null; continue; }
    if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
    if (ch === ',') { parts.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
};
const FORM_ACTIONS = {
  product: '/cart/add', contact: '/contact#contact_form', customer: '/contact#newsletter', localization: '/localization',
  customer_login: '/account/login', create_customer: '/account', recover_customer_password: '/account/recover',
  storefront_password: '/password', cart: '/cart', customer_address: '/account/addresses', activate_customer_password: '/account/activate', reset_customer_password: '/account/reset',
};
engine.registerTag('form', class extends Tag {
  constructor(token, remain, liquid) {
    super(token, remain, liquid);
    this.args = splitArgs(token.args);
    this.tpls = [];
    const stream = liquid.parser.parseStream(remain).on('tag:endform', () => stream.stop()).on('template', (t) => this.tpls.push(t)).on('end', () => { throw new Error('form not closed'); });
    stream.start();
  }
  * render(ctx, emitter) {
    const type = this.args[0].replace(/['"]/g, '');
    const attrs = {};
    for (const a of this.args.slice(1)) {
      const m = a.match(/^([\w-]+)\s*:\s*(.+)$/);
      if (m) attrs[m[1]] = yield new Value(m[2], this.liquid).value(ctx);
    }
    const attrStr = Object.entries(attrs).map(([k, v]) => (v === '' ? ` ${k}` : ` ${k}="${escapeAttr(v)}"`)).join('');
    const prefix = mock.routes.root_url === '/' ? '' : mock.routes.root_url;
    emitter.write(`<form method="post" action="${prefix}${FORM_ACTIONS[type] || '/'}" accept-charset="UTF-8"${attrStr}><input type="hidden" name="form_type" value="${type}"><input type="hidden" name="utf8" value="✓">`);
    ctx.push({ form: { errors: null, 'posted_successfully?': false, posted_successfully: false } });
    yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter);
    ctx.pop();
    emitter.write('</form>');
  }
});
engine.registerTag('paginate', class extends Tag {
  constructor(token, remain, liquid) {
    super(token, remain, liquid);
    this.tpls = [];
    const stream = liquid.parser.parseStream(remain).on('tag:endpaginate', () => stream.stop()).on('template', (t) => this.tpls.push(t));
    stream.start();
  }
  * render(ctx, emitter) {
    ctx.push({ paginate: { current_page: 1, pages: 1, parts: [], previous: null, next: null, items: 0, page_size: 24 } });
    yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter);
    ctx.pop();
  }
});
engine.registerTag('style', class extends Tag {
  constructor(token, remain, liquid) {
    super(token, remain, liquid);
    this.tpls = [];
    const stream = liquid.parser.parseStream(remain).on('tag:endstyle', () => stream.stop()).on('template', (t) => this.tpls.push(t));
    stream.start();
  }
  * render(ctx, emitter) { emitter.write('<style>'); yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter); emitter.write('</style>'); }
});
engine.registerTag('section', class extends Tag {
  constructor(token, remain, liquid) { super(token, remain, liquid); this.name = token.args.trim().replace(/['"]/g, ''); }
  * render(ctx, emitter) { emitter.write(yield renderSection(this.name, this.name, {}, ctx)); }
});
engine.registerTag('sections', class extends Tag {
  constructor(token, remain, liquid) { super(token, remain, liquid); this.name = token.args.trim().replace(/['"]/g, ''); }
  * render(ctx, emitter) {
    const group = JSON.parse(read('sections', `${this.name}.json`));
    let html = '';
    for (const id of group.order) {
      const s = group.sections[id];
      if (s.disabled) continue;
      html += yield renderSection(s.type, `sections--${this.name}__${id}`, s, ctx, `shopify-section-group-${this.name}`);
    }
    emitter.write(html);
  }
});
engine.registerTag('content_for', class extends Tag {
  constructor(token, remain, liquid) { super(token, remain, liquid); this.what = token.args.trim(); }
  * render(ctx, emitter) {
    const section = ctx.getSync(['section']);
    if (!this.what.startsWith("'blocks'") && !this.what.startsWith('"blocks"')) return;
    for (const block of section?.blocks || []) {
      const file = path.join(root, 'blocks', `${block.type}.liquid`);
      if (!existsSync(file)) { warnings.add(`missing block file: ${block.type}`); continue; }
      const tpl = engine.parse(stripSchema(readFileSync(file, 'utf8')), file);
      emitter.write(yield engine.render(tpl, { section, block }, { globals: mock.globals }));
    }
  }
});

// ---------- Sections ----------
const sectionDefaults = (schema, json = {}) => {
  const settings = {};
  for (const s of schema.settings || []) if (s.id) settings[s.id] = s.default ?? (s.type === 'checkbox' ? false : '');
  Object.assign(settings, json.settings || {});
  const resolveSetting = (def, val) => {
    if (def?.type === 'product' && typeof val === 'string') return mock.products[val] || '';
    if (def?.type === 'collection' && typeof val === 'string') return mock.collections[val] || '';
    if (def?.type === 'link_list') return val;
    return val;
  };
  for (const s of schema.settings || []) if (s.id) settings[s.id] = resolveSetting(s, settings[s.id]);
  const blocks = (json.block_order || []).map((bid) => {
    const b = json.blocks[bid];
    const bschema = (schema.blocks || []).find((x) => x.type === b.type) || { settings: [] };
    const bs = {};
    for (const s of bschema.settings || []) if (s.id) bs[s.id] = s.default ?? (s.type === 'checkbox' ? false : '');
    Object.assign(bs, b.settings || {});
    for (const s of bschema.settings || []) if (s.id) bs[s.id] = resolveSetting(s, bs[s.id]);
    return { id: bid, type: b.type, settings: bs, shopify_attributes: '' };
  });
  return { settings, blocks };
};
async function renderSection(type, id, json, ctx, extraClass = '') {
  const file = path.join(root, 'sections', `${type}.liquid`);
  if (!existsSync(file)) { warnings.add(`missing section: ${type}`); return ''; }
  const schema = schemaOf(file);
  const { settings, blocks } = sectionDefaults(schema, json);
  const section = { id, settings, blocks };
  const tpl = engine.parse(stripSchema(readFileSync(file, 'utf8')), file);
  const html = await engine.render(tpl, { section }, { globals: mock.globals });
  return `<div id="shopify-section-${id}" class="shopify-section ${schema.class || ''} ${extraClass}">${html}</div>`;
}

// ---------- Pages ----------
async function renderPage(page, lang) {
  currentLang = lang;
  currentLocale = JSON.parse(read('locales', lang === 'en' ? 'en.json' : 'pt-PT.default.json'));
  mock = buildMock({ lang, page });
  const globals = mock.globals;
  const ctxRender = async (tplSrc, file) => engine.parseAndRender(stripSchema(tplSrc), {}, { globals });

  // content_for_layout
  let content = '';
  const tplName = page.template; // e.g. 'index', 'product', 'page.historia'
  const jsonPath = path.join(root, 'templates', `${tplName}.json`);
  if (existsSync(jsonPath)) {
    const tj = JSON.parse(readFileSync(jsonPath, 'utf8'));
    const { Context } = await import('liquidjs');
    const ctx = new Context({}, engine.options, { globals });
    for (const id of tj.order) {
      const s = tj.sections[id];
      if (s.disabled) continue;
      content += await renderSection(s.type, `template--${tplName}__${id}`, s, ctx);
    }
  } else {
    content = await ctxRender(read('templates', `${tplName}.liquid`));
  }
  const layout = tj_layout(page);
  const html = await engine.parseAndRender(stripSchema(read('layout', `${layout}.liquid`)), {
    content_for_layout: content,
    content_for_header: mock.contentForHeader,
  }, { globals });
  const dest = path.join(out, lang === 'en' ? 'en' : '', page.out);
  mkdirSync(path.dirname(dest), { recursive: true });
  writeFileSync(dest, html);
  return dest;
}
const tj_layout = (page) => page.layout || 'theme';

const pages = buildMock({ lang: 'pt-PT', page: {} }).pages;
if (existsSync(out)) rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const built = [];
for (const lang of ['pt-PT', 'en']) {
  for (const page of pages) {
    try { built.push(path.relative(root, await renderPage(page, lang))); }
    catch (e) { console.error(`✗ ${lang} ${page.template}: ${e.message}`); process.exitCode = 1; }
  }
}
writeFileSync(path.join(out, 'pages.json'), JSON.stringify(pages.map((p) => ({ template: p.template, path: p.url })), null, 2));
console.log(`Built ${built.length} pages into /prototype`);
if (warnings.size) { console.log('\nWarnings:'); [...warnings].sort().forEach((w) => console.log(`  - ${w}`)); }

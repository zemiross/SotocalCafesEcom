// Static pre-launch site (SITE=static): the theme's own Liquid rendered with REAL data and no shop, for hosting without Shopify.
// Same templates, same head tags, same JSON-LD as the Shopify theme; `settings.catalogue_only` removes cart, prices and purchase
// promises. Nothing here is mock content: pages and data come from store-setup/*.json. See docs/seo/16-static-prelaunch.md.
import { readFileSync, existsSync, writeFileSync, cpSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadGuides, rewriteLinks } from './guides.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const readJson = (...p) => JSON.parse(readFileSync(path.join(root, ...p), 'utf8'));
const mf = (v) => (v == null ? null : { value: v });

export const SITE_URL = 'https://sotocalcafes.pt';

// Temporary addresses must not be indexed. On Vercel, a build whose production URL is still *.vercel.app (or unknown) is temporary.
// NOINDEX=0 forces indexing; NOINDEX=1 or --noindex forces noindex.
const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL || '';
export const NOINDEX = (() => {
  if (process.env.NOINDEX === '0') return { on: false, reason: 'NOINDEX=0' };
  if (process.argv.includes('--noindex') || process.env.NOINDEX === '1') return { on: true, reason: '--noindex or NOINDEX=1' };
  if (process.env.VERCEL === '1' && (!vercelProduction || /\.vercel\.app$/i.test(vercelProduction))) {
    return { on: true, reason: `Vercel project on ${vercelProduction || 'an unknown address'} (no custom domain yet)` };
  }
  return { on: false, reason: '' };
})();
const KEEP_PAGES = ['historia', 'a-torra', 'sobre-a-sotocal', 'contactos', 'profissional', 'perguntas-frequentes', 'calculadora-custo-chavena'];
const COFFEES = ['lote-super-milano', 'lote-super', 'lote-reggio', 'cafe-descafeinado'];
const PACKSHOT = { 'lote-super-milano': 'lote-super-milano.webp', 'lote-super': 'lote-super.webp', 'lote-reggio': 'lote-reggio.webp', 'cafe-descafeinado': 'lote-descafeinado.webp' };
// Entries that describe the shop (shipping, "where to buy") or a future event are not true yet on a site without a shop.
const EXCLUDE = { faq_item: ['onde-comprar', 'envios-destinos'], timeline_event: ['2026-loja-online'] };
const PRIVACY_FILE = path.join(root, 'store-setup', 'legal', 'privacy-policy.html');

const entries = readJson('store-setup', 'metaobject-entries.json').entries;
const pagesJson = readJson('store-setup', 'pages.json').pages;
const productsJson = readJson('store-setup', 'products.json').products;
const collectionsJson = readJson('store-setup', 'collections.json');
const collectionList = Array.isArray(collectionsJson) ? collectionsJson : collectionsJson.collections;

export const hasPrivacyPolicy = () => existsSync(PRIVACY_FILE);
export const privacyPolicyHtml = () => readFileSync(PRIVACY_FILE, 'utf8');

/** The pages that exist on the static site, taken from the prototype's page list (same templates). */
export function staticPages(all) {
  const pick = (url) => all.find((p) => p.url === url);
  const list = [pick('/'), pick('/collections/cafe/')];
  for (const h of COFFEES) list.push({ template: 'product', out: `products/${h}/index.html`, url: `/products/${h}/`, type: 'product', product: h });
  for (const h of KEEP_PAGES) list.push(pick(`/pages/${h}/`));
  // Local supplier pages: every district marked served with local content (the same gate as snippets/robots-meta.liquid).
  for (const e of entries.filter((x) => x.type === 'service_area' && x.fields.served && x.status === 'ACTIVE')) {
    list.push({ template: 'metaobject/service_area', out: `pages/fornecedor-de-cafe/${e.handle}/index.html`, url: `/pages/fornecedor-de-cafe/${e.handle}/`, type: 'metaobject', metaobject: `area-${e.handle}` });
  }
  // Guides: the blog index and every draft with `publish: static`.
  list.push(pick('/blogs/guia-do-cafe/'));
  for (const gd of guides()) list.push({ template: 'article', out: `blogs/guia-do-cafe/${gd.handle}/index.html`, url: `/blogs/guia-do-cafe/${gd.handle}/`, type: 'article', blog: 'guide', articleHandle: gd.handle });
  list.push(pick('/404.html'));
  if (hasPrivacyPolicy()) list.push({ template: 'page', out: 'policies/privacy-policy/index.html', url: '/policies/privacy-policy/', type: 'page', page: 'politica-de-privacidade', staticPolicy: true });
  const result = list.filter(Boolean);
  staticUrls = new Set(result.map((p) => p.url.replace(/\/$/, '') || '/'));
  return result;
}

let staticUrls = new Set();
let guideCache = null;
const guides = () => (guideCache ||= loadGuides());
// URLs that appear in the draft text (the future Shopify paths) and their closest equivalent on this site.
const LINK_MAP = { '/collections/cafe-em-grao': '/collections/cafe', '/collections/cafe-moido': '/collections/cafe' };

/** Mutates the mock store in place so the templates see real data and no shop. */
export function applyStatic(mock, page) {
  const g = mock.globals;
  const leadEndpoint = process.env.LEAD_ENDPOINT_URL || '';
  if (leadEndpoint && !hasPrivacyPolicy()) {
    throw new Error('LEAD_ENDPOINT_URL is set but store-setup/legal/privacy-policy.html does not exist: a form that collects personal data needs a privacy policy (Q25, Q62).');
  }
  Object.assign(g.settings, {
    catalogue_only: true, show_tbc_markers: false, gift_season_force: 'off', cookie_banner_enabled: false,
    social_google_maps: '', lead_endpoint_url: leadEndpoint, pickup_enabled: false,
  });

  // Coffee products: real packshots, real descriptions and facts (from store-setup), none of the prototype's fictional fields.
  for (const h of COFFEES) {
    const p = mock.products[h];
    const f = `/assets/${PACKSHOT[h]}`;
    const im = { src: f, width: 720, height: 642, alt: p.featured_image.alt, aspect_ratio: 720 / 642, url: f };
    Object.assign(p, { featured_image: im, images: [im], media: [{ media_type: 'image', preview_image: im, id: 1, alt: im.alt }] });
    const s = p.metafields.sotocal;
    Object.assign(s, { recommended_methods: null, best_for: null, intensity: null, pairings: null, faq: null });
    const sp = productsJson.find((x) => x.handle === h);
    g.pageDescriptions = g.pageDescriptions || {};
    if (sp?.seo_description) g.pageDescriptions[`/products/${h}/`] = sp.seo_description;
  }

  // The "Os lotes" collection: the approved intro, no fixtures.
  const col = mock.collections.cafe;
  const cj = collectionList.find((c) => c.handle === 'cafe') || {};
  col.metafields.sotocal = { intro: mf(cj.intro || null), buying_guide: null, related_methods: null, faq: null };
  col.filters = [];
  if (cj.descriptionHtml) col.description = cj.descriptionHtml;

  // Real metaobject entries only; shop-dependent answers are left out (EXCLUDE).
  const byType = (t) => entries.filter((e) => e.type === t && !(EXCLUDE[t] || []).includes(e.handle));
  const wrap = (e) => {
    const o = { system: { handle: e.handle, type: e.type } };
    for (const [k, v] of Object.entries(e.fields)) o[k] = mf(v);
    return o;
  };
  g.shop.metaobjects = {
    ...g.shop.metaobjects,
    partner_cafe: { values: [] }, machine: { values: [] },
    faq_item: { values: byType('faq_item').map(wrap) },
    timeline_event: { values: byType('timeline_event').map(wrap) },
    person: { values: byType('person').map(wrap) },
    award: { values: byType('award').map(wrap) },
  };

  // Service-area copy that mentions the online shop (pickup of online orders at head office) is not true yet.
  for (const a of g.shop.metaobjects.service_area.values) {
    if (a.short_answer?.value) a.short_answer.value = a.short_answer.value.replace(/, onde também se levantam encomendas feitas na loja online/g, '');
    if (a.local_facts?.value) a.local_facts.value = a.local_facts.value.split(String.fromCharCode(10)).filter((l) => !/levantar encomendas/.test(l)).join(String.fromCharCode(10));
  }

  // Navigation and shop objects.
  const link = (title, url, links = []) => ({ title, url, links, current: false });
  g.linklists = {
    'main-menu': { links: [
      link('Os lotes', '/collections/cafe'), link('A torra', '/pages/a-torra'), link('Guia do café', '/blogs/guia-do-cafe'),
      link('A Sotocal', '/pages/historia', [link('História', '/pages/historia'), link('Contactos', '/pages/contactos')]),
      link('Profissional', '/pages/profissional'),
    ] },
    footer: { links: [] },
  };
  g.localization.available_languages = [{ iso_code: 'pt-PT', endonym_name: 'português' }];
  g.shop.customer_accounts_enabled = false;
  g.shop.enabled_payment_types = [];
  g.shop.policies = hasPrivacyPolicy() ? [{ title: 'Política de privacidade', url: '/policies/privacy-policy' }] : [];
  g.shop.privacy_policy = { url: '/policies/privacy-policy' };
  g.cart = { item_count: 0, items: [], total_price: 0, items_subtotal_price: 0, attributes: {}, currency: { iso_code: 'EUR' }, note: '' };

  // Guides: blog and article objects built from the drafts.
  if (page.type === 'blog' || page.type === 'article') {
    const products = mock.products;
    const competitors = g.shop.metaobjects.competitor.values;
    const byPrice = (a, b) => (a.price_per_kg?.value ?? 0) - (b.price_per_kg?.value ?? 0);
    const articles = guides().map((gd) => {
      let rows = [];
      if (gd.comparedHandles.length) rows = gd.comparedHandles.map((h) => competitors.find((c) => c.system.handle === h)).filter(Boolean);
      else if (gd.comparedRule === 'grao-1kg') rows = competitors.filter((c) => c.format?.value === 'grao' && c.pack_weight_g?.value === 1000);
      rows = [...rows].sort(byPrice);
      const html = rewriteLinks(gd.html, (t) => staticUrls.has(t), LINK_MAP);
      const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const stamp = `${gd.published}T09:00:00+00:00`;
      return {
        id: gd.handle.length * 1000 + 7, handle: gd.handle, title: gd.title, url: `/blogs/guia-do-cafe/${gd.handle}`, author: gd.author, published_at: stamp, updated_at: `${gd.reviewed}T09:00:00+00:00`,
        content: html, excerpt: gd.answer, excerpt_or_content: gd.answer || text, image: null, tags: [], comments_count: 0, _seo: { title: gd.seoTitle, description: gd.seoDescription },
        metafields: { sotocal: {
          answer: mf(gd.answer), last_reviewed: mf(gd.reviewed), sources: gd.sources.length ? mf(gd.sources) : null, compared: rows.length ? mf(rows) : null,
          self_included: mf(gd.selfIncluded), criteria: gd.criteria ? mf(gd.criteria) : null, when_not: null,
          related_products: mf(gd.related.map((h) => products[h]).filter(Boolean)),
        } },
      };
    });
    const blog = { handle: 'guia-do-cafe', title: 'Guia do café', url: '/blogs/guia-do-cafe', articles, articles_count: articles.length };
    g.blog = blog;
    g.blogs = { 'guia-do-cafe': blog };
    if (page.type === 'article') {
      g.article = articles.find((a) => a.handle === page.articleHandle);
      g.page_title = g.article._seo.title;
      g.page_description = g.article._seo.description;
    }
  }

  // Canonical without a trailing slash (what Shopify does); SEO title and description from store-setup/pages.json.
  const url = page.url || '/';
  g.canonical_url = SITE_URL + (url === '/' ? '/' : url.replace(/\/$/, ''));
  g.request.path = url === '/' ? '/' : url.replace(/\/$/, '');
  const seo = pagesJson.find((x) => x.handle === page.page)?.seo;
  if (seo) { g.page_title = seo.title; g.page_description = seo.description; }
  if (g.pageDescriptions?.[url]) g.page_description = g.pageDescriptions[url];
  if (page.staticPolicy) {
    g.page_title = 'Política de privacidade';
    g.page = { id: 1, handle: 'politica-de-privacidade', title: 'Política de privacidade', url: '/policies/privacy-policy', template_suffix: '', content: privacyPolicyHtml(), published_at: '', updated_at: '', metafields: {} };
  }

  // No consent banner without trackers: nothing here sets a cookie or loads a third-party script.
  mock.contentForHeader = mock.contentForHeader.replace('return !read();', 'return false;');
}

const BAD_TEXT = /\(exemplo\)|(?<!título )de exemplo|exemplo \d|\[\[TBC|TBC:|protótipo|prototype|sample|preço provisório|\b(1,00|10,00|40,00) €/i;

/** Post-processes one rendered page. Returns { html, problems }. */
export function postProcess(html, page) {
  const problems = [];
  html = html.replace(/(\/assets\/[^"'\s?]+)\?width=\d+/g, '$1');
  if (/\/reference\//.test(html)) problems.push('references /reference/ (not shipped)');
  const visible = html.replace(/<(script|style|svg|template)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ');
  const bad = visible.match(BAD_TEXT);
  if (bad) problems.push(`visible text contains "${bad[0]}"`);
  for (const m of html.matchAll(/<form[^>]*>/g)) {
    if (/action="\//.test(m[0]) && !/id="HorecaLead"/.test(m[0])) problems.push(`Shopify form left in the page: ${m[0].slice(0, 80)}`);
  }
  // The page's own indexing rule is read first (the sitemap lists only pages that are indexable by their own rule), then a temporary
  // address overrides every page.
  const noindex = /<meta name="robots" content="noindex/.test(html);
  if (NOINDEX.on) html = html.replace(/<meta name="robots"[^>]*>/i, '').replace('</head>', '<meta name="robots" content="noindex, nofollow"></head>');
  return { html, problems, noindex };
}

const SKIP_LINK = /^(#|tel:|mailto:|https?:|\/\/|javascript:|data:)/;

/** Writes robots.txt, sitemap.xml, _redirects, _headers, copies assets, checks links. `built` = [{ url, file, noindex, html }]. */
export function finish(out, built) {
  const problems = [];
  cpSync(path.join(root, 'assets'), path.join(out, 'assets'), { recursive: true });

  // Internal links must resolve to a built page or an asset.
  const urls = new Set(built.map((b) => b.url.replace(/\/$/, '') || '/'));
  for (const b of built) {
    for (const m of b.html.matchAll(/<a [^>]*href="([^"]+)"/g)) {
      const href = m[1];
      if (SKIP_LINK.test(href)) continue;
      const clean = href.split('#')[0].split('?')[0].replace(/\/$/, '') || '/';
      if (!urls.has(clean) && !existsSync(path.join(out, clean))) problems.push(`${b.url}: broken internal link ${href}`);
    }
  }

  const indexable = built.filter((b) => !b.noindex && !/404/.test(b.url));
  const loc = (u) => SITE_URL + (u === '/' ? '/' : u.replace(/\/$/, ''));
  writeFileSync(path.join(out, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable.map((b) => `  <url><loc>${loc(b.url)}</loc></url>`).join('\n')}\n</urlset>\n`);

  const ai = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended'];
  writeFileSync(path.join(out, 'robots.txt'),
    `User-agent: *\nAllow: /\n\n${ai.map((b) => `User-agent: ${b}\nAllow: /\n`).join('\n')}\nSitemap: ${SITE_URL}/sitemap.xml\n`);

  // Legacy URLs: 301 where an equivalent page exists on this site, 302 to the home page otherwise (temporary: the Shopify
  // store will own the full map in docs/redirects.csv).
  const rows = readFileSync(path.join(root, 'docs', 'redirects.csv'), 'utf8').replace(/^﻿/, '').trim().split(/\r?\n/).slice(1).map((l) => l.split(','));
  const redirects = [{ from: '/index.php', to: '/', code: 301 }];
  for (const [from, to] of rows) {
    if (from === '/index.php') continue;
    const target = to.split('?')[0].replace(/\/$/, '') || '/';
    redirects.push(urls.has(target) ? { from, to, code: 301 } : { from, to: '/', code: 302 });
  }
  const lines = ['# Legacy sotocalcafes.pt URLs. 301 = equivalent page exists here; 302 = no equivalent yet (temporary).', ...redirects.map((r) => `${r.from} ${r.to} ${r.code}`)];
  writeFileSync(path.join(out, '_redirects'), lines.join('\n') + '\n');

  // A temporary address must not compete with the real domain (see NOINDEX above): every page also carries a noindex meta (postProcess),
  // and this header is for hosts that read _headers. A header or meta, not robots.txt, so crawlers can read it.
  const security = [['X-Content-Type-Options', 'nosniff'], ['Referrer-Policy', 'strict-origin-when-cross-origin'], ['X-Frame-Options', 'SAMEORIGIN'], ['Permissions-Policy', 'camera=(), microphone=(), geolocation=()']];
  writeFileSync(path.join(out, '_headers'), `/*\n${NOINDEX.on ? '  X-Robots-Tag: noindex, nofollow\n' : ''}${security.map(([k, v]) => `  ${k}: ${v}\n`).join('')}\n/assets/*\n  Cache-Control: public, max-age=3600\n`);
  // Vercel reads vercel.json from the repo root (it ignores _redirects and _headers): serve only /site, with clean URLs, the same
  // redirects and the same headers. Without it Vercel publishes the whole repository folder.
  const vercel = {
    $schema: 'https://openapi.vercel.sh/vercel.json', framework: null, installCommand: 'npm ci --ignore-scripts', buildCommand: 'npm run build:static', outputDirectory: 'site',
    cleanUrls: true, trailingSlash: false,
    redirects: redirects.map((r) => ({ source: r.from, destination: r.to, statusCode: r.code })),
    headers: [
      { source: '/(.*)', headers: security.map(([key, value]) => ({ key, value })) },
      { source: '/assets/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=3600' }] },
    ],
  };
  writeFileSync(path.join(root, 'vercel.json'), JSON.stringify(vercel, null, 2) + '\n');
  return { problems, indexable: indexable.length, redirects: redirects.length };
}

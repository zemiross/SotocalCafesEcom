// Quality gate §10 checks on every indexable prototype page (pt-PT; EN is unpublished at launch, D58).
//   - <title> ≤ 60 characters, meta description present and ≤ 155, exactly one <h1>, a canonical link
//   - gate 2: ≥ 40 % of the body text (<main>) unique against sibling pages (same URL family), scored with 5-word shingles
//   - gate 6: ≥ 3 internal links out of <main> (links in are reported only: the prototype renders a sample of the site)
// Pages with <meta name="robots" content="noindex…"> are skipped: they are allowed to fail.
// Usage: node scripts/check-seo.mjs   (run `npm run prototype` first). Writes qa/seo.txt.
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const proto = path.join(root, 'prototype');
const SKIP = /^(en[\\/]|404|password|cart|search|account)/;
const files = readdirSync(proto, { recursive: true }).map(String).filter((f) => f.endsWith('.html') && !SKIP.test(f));

const decode = (s) => s.replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;|&#34;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const textOf = (html) => decode(html.replace(/<(script|style|svg|noscript|template)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const shingles = (text, n = 5) => {
  const w = text.toLowerCase().split(/[^\p{L}\p{N}€,.%-]+/u).filter(Boolean);
  const out = new Set();
  for (let i = 0; i + n <= w.length; i += 1) out.add(w.slice(i, i + n).join(' '));
  return out;
};
const urlOf = (f) => '/' + f.replace(/\\/g, '/').replace(/index\.html$/, '');
// Siblings share the parent path (/blogs/guia-do-cafe/<x>, /pages/maquina/<x>, /products/<x>); a blog index is not an article's sibling.
const family = (url) => url.split('/').filter(Boolean).slice(0, -1).join('/') || 'home';
// Gate 6 (≥ 3 links out) is enforced on content pages; elsewhere it is reported as a warning.
const CONTENT = /^\/(blogs\/[^/]+\/[^/]+|pages\/(metodo|maquina|fornecedor-de-cafe)\/[^/]+|collections\/[^/]+)\/$/;
// Aggregators collect entries that other pages excerpt (the FAQ page holds every faq_item; the B2B and about pages show a few).
// They are the source, not the copy, so gate 2 is reported for them but not enforced.
const AGGREGATORS = new Set(['/pages/perguntas-frequentes/']);

const pages = files.map((f) => {
  const html = readFileSync(path.join(proto, f), 'utf8');
  const url = urlOf(f);
  const main = (html.match(/<main[\s\S]*?<\/main>/i) || [html])[0];
  return {
    url, family: family(url),
    noindex: /<meta name="robots" content="noindex/i.test(html),
    title: decode((html.match(/<title>([\s\S]*?)<\/title>/i) || [, ''])[1].trim()),
    description: decode((html.match(/<meta name="description" content="([^"]*)"/i) || [, ''])[1]),
    h1: (main.match(/<h1[\s>]/gi) || []).length + (html.replace(main, '').match(/<h1[\s>]/gi) || []).length,
    canonical: /<link rel="canonical" href="[^"]+"/i.test(html),
    links: [...main.matchAll(/<a [^>]*href="(\/[^"#?]*)/gi)].map((m) => m[1].replace(/\/?$/, '/')),
    allLinks: [...html.matchAll(/<a [^>]*href="(\/[^"#?]*)/gi)].map((m) => m[1].replace(/\/?$/, '/')),
    sh: shingles(textOf(main)),
    literalTbc: /\[\[TBC/.test(textOf(main.replace(/<mark class="tbc">[\s\S]*?<\/mark>/g, ''))),
  };
});

const report = [];
let errors = 0;
const fail = (url, msg) => { report.push(`✗ ${url}: ${msg}`); errors += 1; };
const warn = (url, msg) => report.push(`! ${url}: ${msg}`);
const indexable = pages.filter((p) => !p.noindex);
for (const p of indexable) {
  if (p.title.length > 60) fail(p.url, `title ${p.title.length} chars (> 60): "${p.title}"`);
  if (!p.description) fail(p.url, 'no meta description');
  else if (p.description.length > 155) fail(p.url, `meta description ${p.description.length} chars (> 155)`);
  if (p.h1 !== 1) fail(p.url, `${p.h1} <h1> elements`);
  if (!p.canonical) fail(p.url, 'no canonical');
  const out = new Set(p.links.filter((l) => l !== p.url));
  if (out.size < 3) (CONTENT.test(p.url) ? fail : warn)(p.url, `${out.size} internal links out of <main> (< 3)`);
  if (p.literalTbc) fail(p.url, 'literal [[TBC …]] in the page text (gate 4)');
  const siblings = indexable.filter((s) => s !== p && s.family === p.family);
  let score = null;
  if (siblings.length && p.sh.size) {
    const shared = new Set();
    for (const s of siblings) for (const x of p.sh) if (s.sh.has(x)) shared.add(x);
    score = Math.round(100 * (1 - shared.size / p.sh.size));
    if (score < 40) (AGGREGATORS.has(p.url) ? warn : fail)(p.url, `${score} % unique vs ${siblings.length} sibling(s) in ${p.family} (< 40 %)${AGGREGATORS.has(p.url) ? " (aggregator: not enforced)" : ""}`);
  }
  const inbound = pages.filter((s) => s !== p && s.allLinks.includes(p.url)).length;
  report.push(`  ${p.url}  title ${p.title.length}  desc ${p.description.length}  unique ${score == null ? 'n/a' : score + ' %'}  out ${out.size}  in ${inbound}`);
}
mkdirSync(path.join(root, 'qa'), { recursive: true });
writeFileSync(path.join(root, 'qa', 'seo.txt'), report.join('\n') + '\n');
report.filter((r) => r.startsWith('✗') || r.startsWith('!')).forEach((r) => console.log(r));
console.log(`Indexable pt-PT pages checked: ${indexable.length} (skipped ${pages.length - indexable.length} noindex). Scores in qa/seo.txt.`);
console.log(errors ? `✗ ${errors} quality-gate problem(s)` : '✓ Titles, descriptions, H1, canonical, links and uniqueness pass');
process.exitCode = errors ? 1 : 0;

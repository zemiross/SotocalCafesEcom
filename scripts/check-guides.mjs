// Quality gate for guide drafts (docs/seo/drafts/*.md), from the SEO/GEO brief section 10 and WS11.
// FAIL = a rule is broken. BLOCKED = an unresolved [[TBC]] remains (the page must not be indexable yet). WARN = needs a look.
// Run: npm run check:guides
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'docs', 'seo', 'drafts');
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const words = (s) => (s.match(/[\p{L}\p{N}%€]+(?:[-'’][\p{L}\p{N}]+)*/gu) || []).length;
const HEALTH = /faz bem|benef[ií]cio|emagrec|digest|f[ií]gado|est[oô]mago|previne|desintoxic|antioxidante|colesterol|reduz o risco|\bcura\b|trata (a|o|as|os)\b/i;
const COMMERCIAL = /^\/(products|collections)\/|^\/pages\/(subscricao|profissional|despensa-do-norte)/;

function frontMatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { fm: {}, raw: '', body: text };
  const fm = {};
  let key = null;
  for (const line of m[1].split('\n')) {
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && key) { (fm[key] = Array.isArray(fm[key]) ? fm[key] : []).push(item[1].trim()); continue; }
    const kv = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (kv) { key = kv[1]; fm[key] = kv[2].replace(/\s+#\s.*$/, '').trim(); if (fm[key] === '[]') fm[key] = []; }
  }
  return { fm, raw: m[1], body: text.slice(m[0].length) };
}

const files = readdirSync(DIR).filter((f) => f.endsWith('.md') && f !== 'skeletons.md');
const docs = files.map((f) => {
  const text = readFileSync(path.join(DIR, f), 'utf8');
  const { fm, raw, body } = frontMatter(text);
  return { file: f, fm, raw, body, handle: fm.handle || f.replace(/\.md$/, '') };
});

const out = [];
for (const d of docs) {
  const fail = []; const warn = []; let blocked = false;
  const { fm, raw, body } = d;
  const prose = body.replace(/\[\[TBC[^\]]*\]\]/g, ' ').replace(/\]\([^)]*\)/g, ']').replace(/https?:\/\/\S+/g, ' ');
  const h1 = (body.match(/^# (.+)$/gm) || []);
  if (h1.length !== 1) fail.push(`H1 count ${h1.length} (need 1)`);
  const title = fm.seo_title || '';
  if (!title) fail.push('no seo_title'); else if (title.length > 60) fail.push(`seo_title ${title.length} chars (max 60)`);
  const desc = fm.seo_description || '';
  if (!desc) fail.push('no seo_description'); else if (desc.length > 155) fail.push(`seo_description ${desc.length} chars (max 155)`);
  // Direct answer: front matter `answer`, else the paragraph after "Resposta direta".
  let answer = fm.answer || '';
  if (!answer) { const m = body.match(/\*\*Resposta direta\*\*[^\n]*\n([^\n]+)/) || body.match(/\*\*Resposta direta:\*\*\s*([^\n]+)/); answer = m ? m[1] : ''; }
  const answerClean = answer.replace(/\[\[TBC[^\]]*\]\]/g, '').trim();
  const aw = words(answerClean);
  if (/\[\[TBC/.test(answer)) blocked = true;
  else if (aw < 40 || aw > 70) fail.push(`answer block ${aw} words (need 40 to 70)`);
  // Dates, author, sources.
  if (!/last_reviewed:\s*\S+/.test(raw)) fail.push('no last_reviewed date');
  if (!/^\s*author:|author:/.test(raw)) warn.push('no author (default: Sotocal, no Person schema: D9)');
  const sources = Array.isArray(fm.sources) ? fm.sources : (/sources:\s*\S+/.test(raw) ? ['(listed)'] : []);
  const srcInBody = /## Fontes[\s\S]*https?:\/\//.test(body);
  const tbcLeft = /\[\[TBC/.test(body) || /\[\[TBC/.test(raw);
  if (sources.length === 0 && !srcInBody && fm.no_third_party_facts !== 'true') {
    // D118 (José, 18/11/2026): two substitute guides publish without an external source. The page must say so; this stays a warning.
    if (fm.no_sources_by_decision) warn.push(`no external source, published by decision ${fm.no_sources_by_decision}`);
    else (tbcLeft ? warn : fail).push('no sources for third-party facts');
  }
  // Links.
  const links = [...body.matchAll(/\]\((\/[^)#\s]*)[^)]*\)/g)].map((m) => m[1]);
  const commercial = links.filter((l) => COMMERCIAL.test(l));
  const nWords = words(prose);
  const allowed = Math.max(1, Math.ceil(nWords / 300));
  if (links.length < 3) fail.push(`${links.length} internal links out (need 3)`);
  if (commercial.length > allowed) fail.push(`${commercial.length} commercial links in ${nWords} words (max ${allowed}: one per 300 words)`);
  const inbound = docs.filter((o) => o !== d && o.body.includes(`/blogs/guia-do-cafe/${d.handle}`)).length;
  if (inbound < 3) warn.push(`${inbound} of 3 inbound links among drafts (the rest come from hubs and collections at build)`);
  // Health claims and TBC.
  if (HEALTH.test(prose)) fail.push(`health-claim wording: "${prose.match(HEALTH)[0]}"`);
  if (/\[\[TBC/.test(body) || /\[\[TBC/.test(raw)) blocked = true;
  // Title, H1 and keyword agree.
  const kw = (fm.keywords || '').split(';')[0].trim();
  if (kw) {
    const toks = norm(kw).split(/\s+/).filter((t) => t.length > 2);
    const hay = norm(`${title} ${h1[0] || ''}`);
    const hit = toks.filter((t) => hay.includes(t.replace(/s$/, ''))).length;
    if (toks.length && hit / toks.length < 0.6) fail.push(`title and H1 do not carry the primary keyword "${kw}"`);
  }
  if (fail.length && blocked) warn.push('also blocked by an unresolved [[TBC]]');
  out.push({ file: d.file, status: fail.length ? 'FAIL' : blocked ? 'BLOCKED' : 'PASS', fail, warn, words: nWords, links: links.length, commercial: commercial.length, answer: aw });
}

let failed = 0;
for (const o of out) {
  console.log(`${o.status.padEnd(8)} ${o.file}  (${o.words} words, ${o.links} links, ${o.commercial} commercial, answer ${o.answer})`);
  for (const f of o.fail) console.log(`           ✗ ${f}`);
  for (const w of o.warn) console.log(`           ! ${w}`);
  if (o.status === 'FAIL') failed++;
}
console.log(`\n${out.length} drafts: ${out.filter((o) => o.status === 'PASS').length} pass, ${out.filter((o) => o.status === 'BLOCKED').length} blocked by [[TBC]], ${failed} fail`);
process.exit(failed ? 1 : 0);

// Guide articles for the static site, read from docs/seo/drafts/*.md (the single source of the guide text).
// A draft is published when its front matter says `publish: static`. Front matter keys used here:
//   handle, title, seo_title, seo_description, answer, author, published, last_reviewed, self_included (true|false),
//   compared_handles (comma list of competitor entries) or compared_rule (grao-1kg), related_products, sources (list), criteria.
// The body is Markdown; the H1, the "Resposta direta" block, the table placeholder and the "Fontes" section are dropped because
// the article template renders them from the metafields.
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIR = path.join(root, 'docs', 'seo', 'drafts');

function parseFrontMatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { fm: {}, body: text };
  const fm = {};
  let key = null;
  for (const line of m[1].split(/\r?\n/)) {
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && key) { (fm[key] = Array.isArray(fm[key]) ? fm[key] : []).push(item[1].trim()); continue; }
    const kv = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (kv) { key = kv[1]; fm[key] = kv[2].replace(/\s+#\s.*$/, '').trim(); if (fm[key] === '[]') fm[key] = []; }
  }
  return { fm, body: text.slice(m[0].length) };
}

function cleanBody(body) {
  const lines = body.split(/\r?\n/);
  const out = [];
  let skipSection = false;
  for (let i = 0; i < lines.length; i += 1) {
    const l = lines[i];
    if (/^# /.test(l)) continue;                                   // H1: the template prints the title
    if (/^## Fontes/.test(l)) { skipSection = true; continue; }      // the template prints the sources from the metafield
    if (skipSection) { if (/^## /.test(l)) skipSection = false; else continue; }
    if (/^\*\*Resposta direta:\*\*/.test(l)) continue;               // the template prints the answer from the metafield
    if (/^\*\*Resposta direta\*\*/.test(l)) { while (i + 1 < lines.length && !lines[i + 1].trim()) i += 1; i += 1; continue; }
    if (/^\[tabela:/.test(l)) continue;                              // the comparison block is rendered by the template
    if (/^Última revisão:/.test(l)) continue;
    out.push(l);
  }
  return out.join('\n');
}

const list = (v) => (Array.isArray(v) ? v : String(v || '').split(',').map((s) => s.trim()).filter(Boolean));

export function loadGuides() {
  const guides = [];
  for (const f of readdirSync(DIR).filter((x) => x.endsWith('.md') && x !== 'skeletons.md')) {
    const { fm, body } = parseFrontMatter(readFileSync(path.join(DIR, f), 'utf8'));
    if (fm.publish !== 'static') continue;
    if (/\[\[TBC/.test(body) || /\[\[TBC/.test(fm.answer || '')) throw new Error(`${f}: publish: static but an unresolved [[TBC]] remains`);
    const h1 = body.match(/^# (.+)$/m);
    guides.push({
      handle: fm.handle, title: fm.title || (h1 && h1[1]) || fm.handle, seoTitle: fm.seo_title, seoDescription: fm.seo_description, answer: fm.answer,
      author: fm.author || 'Sotocal', published: fm.published, reviewed: fm.last_reviewed, selfIncluded: fm.self_included === 'true',
      comparedHandles: list(fm.compared_handles), comparedRule: fm.compared_rule || '', related: list(fm.related_products), sources: list(fm.sources),
      criteria: fm.criteria || '', html: marked.parse(cleanBody(body)),
    });
  }
  return guides.sort((a, b) => (a.published < b.published ? 1 : a.published > b.published ? -1 : a.handle.localeCompare(b.handle)));
}

/** Internal links to pages that are not on the site are unlinked (the text stays); `map` rewrites future URLs to present ones. */
export function rewriteLinks(html, exists, map = {}) {
  return html.replace(/<a href="(\/[^"#?]*)([^"]*)">([\s\S]*?)<\/a>/g, (all, href, rest, text) => {
    const target = (map[href] || href).replace(/\/$/, '') || '/';
    return exists(target) ? `<a href="${target}${rest}">${text}</a>` : text;
  });
}

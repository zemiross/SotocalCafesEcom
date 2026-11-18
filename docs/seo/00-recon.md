# Phase 0 recon: sotocalcafes.pt SEO and GEO

Date: 17/11/2026. Read-only. Nothing in the theme, the store or DNS was changed. This report and its two CSVs are the only new files (`docs/seo/`).

**Method and limits.** I read the repo (theme, `docs/`, `store-setup/`), probed the live legacy site with `curl`, pulled the Wayback Machine CDX index, and checked Shopify's developer docs. I could **not** check: Google Search Console, Bing Webmaster, a Shopify store (none exists: no dev store or CLI login, see DECISIONS D02/D54), Merchant Center, or Ubersuggest volumes (the prompt's figures are used as given). Every theme test in `docs/QA-REPORT.md` ran on a LiquidJS prototype, not on Shopify.

## 1. The five findings that change the plan

1. **The theme already exists, so Phase 1 is an audit and a delta, not a build.** A complete custom Online Store 2.0 theme (Sotocal 1.0.0, not Dawn) was built on 29–30/10/2026 against an earlier brief. It already has the URL map, JSON-LD graph, `robots.txt.liquid`, a native `/llms.txt`/`/agents.md` template, 35 redirects, 4 blend PDPs, a substitutes collection, FAQ metaobjects and a QA run of 641 checked links. The prompt's WS1, WS2 and most of WS4 overlap it. What is missing is listed in section 3.
2. **The legacy site is not down.** On 17/11/2026 at about 09:12 GMT, `https://sotocalcafes.pt`, `www.` and the old `.php` pages returned **200** on 5 of 5 requests, including with a Googlebot user agent (nginx, PHP 7.4.33, which is end-of-life). The 503 in the brief was either intermittent or from another network. The brand-SERP emergency is smaller than stated, but the old site must stay up until DNS flips, because the redirects only fire once the `.php` URLs 404 on Shopify. Two cheap defects: `www` and apex both serve 200 with no redirect (duplicate hosts), and the legacy `og:url` points to a mistyped domain (`sotocoal.pt`).
3. **The prompt and the repo disagree on language scope.** The prompt says PT-PT only at launch and no hreflang until phase 2. The theme ships full British-English pages under `/en/` (445 translated keys, translated handles) and `CLAUDE.md` forbids noindexing them. Shopify emits hreflang automatically for any published language. This needs a decision now (D11) because it changes the indexable URL count and the Merchant Center feed.
4. **Every product page fails the prompt's quality gate today, and the blockers are client data, not code.** All products are draft with a 1,00 € placeholder price (tag `preco-provisorio`); no EAN/GTIN, no SKU, food information (EU 1169/2011) unfilled, shipping and return terms unknown. The repo carries 186 `[[TBC]]` markers (84 distinct); 19 of the 54 client questions are priority A and still open. Gate 4 ("no unresolved TODO") and D8 therefore block indexing of all PDPs. A live, compliant store by early December (D5) is unlikely unless the priority-A answers arrive within about a week.
5. **Three facts in the prompt's keyword plan do not match the client's facts.**
   - Sotocal **does not sell coffee machines** (fact sheet: it places equipment under agreement). The B2B machine keywords (`máquinas de café para empresas`, `... restaurante`, `... escritório`) and their $1.5–2.7 CPCs are the wrong audience. All four are rejected in the keyword map.
   - **D1 is largely answered.** The client leaflet lists Mistura Bom Dia (25% café, 75% chicória), Mistura Sako, Cevada Sotocal and Cevada Oriente, and the repo already has those products and a substitutes collection. The cevada/chicória cluster is viable. What is open is whether each is still produced and in which formats. The `benefícios`, `contra indicações` and `faz mal` queries stay rejected (health claims).
   - **`/llms.txt` is no longer a limitation.** Shopify has served `/llms.txt`, `/llms-full.txt` and `/agents.md` natively since 28/05/2026 and lets a theme override them (checked today on shopify.dev). It is already implemented in `templates/agents.md.liquid`. A redirect would never fire because the route is live.

## 2. Theme map

| Item | State |
|---|---|
| Theme | Custom "Sotocal" v1.0.0. Online Store 2.0: JSON templates, 41 sections, 27 snippets, 5 theme blocks. Not Dawn |
| Templates | `index`, `product` (+ `simple`, `spice`, `substitute`, `bundle`), `collection`, `list-collections`, `blog`, `article` (+ `recipe`), `cart`, `search`, `404`, `password`, `gift_card`, `customers/*`, `page` + 12 page templates (`historia`, `a-torra`, `profissional`, `locator`, `pickup`, `subscription`, `gift-box`, `facts`, `faq`, `contact`, `accessibility`, `qr`), `robots.txt.liquid`, `agents.md.liquid` |
| `<html lang>` | `request.locale.iso_code`, so `pt-PT` and `en` |
| Title, description, OG/Twitter | `snippets/meta-tags.liquid`. Titles come from locale templates (`seo.*`) and are capped at 60 characters. Description falls back to a metafield, collection intro, excerpt or page body, truncated to 155 characters. `og:locale` is `pt_PT` or `en_GB`. `og:url` and `<link rel=canonical>` both use `canonical_url` |
| Canonical and duplicates | `canonical_url` is used as is, so `?variant=` canonicalises to the product. Product links never use `within: collection`, so `/collections/x/products/y` is never emitted |
| hreflang | Not output by the theme. Shopify generates it from the language setup (unverified: no store) |
| noindex | Only `password.liquid` and `gift_card.liquid`. No rule for tag pages, `/collections/all`, vendor or type pages; the theme relies on Shopify's default robots.txt disallows, which block crawling but are not `noindex` |
| Pagination | `snippets/pagination.liquid` emits `rel="prev"` and `rel="next"`; the title gets a page suffix |
| JSON-LD | `structured-data.liquid` (Organization, WebSite + SearchAction, WebPage, Person, AboutPage, ContactPage), `structured-data-product.liquid` (ProductGroup/Product/Offer with unit price, `hasMerchantReturnPolicy`, `shippingDetails` only when rates are set, `gtin` only if a barcode exists), `structured-data-article.liquid` (BlogPosting, Recipe), `breadcrumbs.liquid` (BreadcrumbList), `faq-list.liquid` (FAQPage, visible Q&As only). No AggregateRating or Review (correct: no real reviews yet). `@id`s use `settings.entity_base_url`. `LocalBusiness` is not emitted |
| robots.txt | `templates/robots.txt.liquid` loops Shopify's `robots.default_groups` unchanged plus the sitemap line. No AI crawler is blocked; no explicit `Allow` group for them |
| llms / agents | `templates/agents.md.liquid` (26 lines) serves `/agents.md`, `/llms.txt`, `/llms-full.txt` with the entity statements. Theme Check warns "Unknown object `agents`" (11 warnings, expected, documented) |
| Search Console tag | `settings.google_site_verification` defaults to the legacy token `FsPoxaMNsglzycxyLmZmlgoBw3YHtdp8XVS8otgEwyc`, the same one in the legacy `<head>`. So a Search Console property for the old site very likely exists, which is the best source for any URL beyond the Wayback list |
| Analytics and pixels | None in the theme (by rule). `store-setup/custom-pixel.js` is for Customer Events. GA4 and Meta IDs are open (Q42) |
| Apps | None installed (no store). Planned in `docs/ADMIN-SETUP.md`: Shopify Subscriptions, Bundles, Search & Discovery, Translate & Adapt, Google & YouTube, Facebook & Instagram, and an AT-certified invoicing app (not chosen; InvoiceXpress and weoinvoice are not mentioned anywhere in the repo). The theme only calls `content_for_header` and keeps the Subscriptions app block out of the product template, so it avoids duplicate pickers and duplicate Product JSON-LD |
| Performance (prototype, simulated) | Lighthouse home 96 (pt and en), product 95, collection 100, article 97; SEO 100; CLS 0; home JS 58.8 KB gz. **Lab LCP is 2.6–2.9 s on home, product and article, above the prompt's 2.5 s target**; the LCP element is a placeholder SVG. INP is not measured. Re-test on a real store with real images |

## 3. Delta: prompt vs what is built

| Prompt item | State in repo | Action |
|---|---|---|
| Domain, www/http one hop to apex | Not configured (no store) | Needs José's approval before any domain change |
| Old-URL redirects | 35 rows in `docs/redirects.csv`; **all 34 legacy paths found in Wayback are covered** (section 4) | Import after targets exist; test on a store |
| robots.txt explicit AI `Allow` groups | Defaults only; nothing blocked | Optional. Adding explicit groups is harmless; DECISIONS chose "unchanged" |
| `noindex` for tags, filters, `/collections/all`, `/search`, vendor/type | Search and filters rely on Shopify defaults. **The main menu "Loja" links to `/collections/all`** (`store-setup/menus.json`), which is indexable and duplicates `/collections/cafe` | Point "Loja" at `/collections/cafe` and add a theme `noindex` for `all`, tag, vendor and type pages |
| `html lang` pt-PT, no hreflang yet | `/en/` ships; hreflang is Shopify's | Decision D11 |
| Structured data | Present (section 2). No `LocalBusiness` (D4) | Validate in Rich Results Test on a store |
| Merchant Center | Nothing | Needs a store, GTIN or `identifier_exists=false`, shipping/returns |
| Legal pages | Footer slots for Livro de Reclamações and RAL exist; FIC accordion on every PDP; policies are Shopify placeholders | Q23–Q28 |
| Metaobjects | 6 types exist: `faq_item`, `person`, `gift_box_item`, `partner_cafe`, `timeline_event`, `award`. **No `method`, `machine`, `substitute`, `competitor` types**, and none is set up to render as a web page | New definitions needed for WS3 and WS5 |
| Method/machine hubs | None | Blocked by Q14 (dose, grind, recommended blend) |
| Calculator, quiz | None | Needs consumer prices (D8) and a dated competitor dataset |
| Capsules | No product anywhere | D2 |
| Substitutes pages | Collection plus 4 PDPs; `page.cafe-e-saude` has EFSA caffeine figures | Factual guides need a cited source for caffeine and gluten |
| Guides and listicles | `melhor-cafe-em-grao-portugal` and `...-maquina-automatica` are in the repo's launch map | Prompt moves them to phase 3 (needs 8 sourced brands) |
| Author, Person schema | Planned author Maria José Barbosa, pending consent (Q33); until then "Sotocal" Organization | Compatible with the prompt's D9 default |
| QR landing pages | `page.qr` template, `noindex`, UTM redirects `/q/chavena`, `/q/acucar` | Query string in a redirect target is unverified on Shopify |
| Cost-per-cup, `competitor` data | Not collected | Needs verified, dated prices |

URL naming differs between the prompt and the built theme (profissional vs para-empresas, presentes vs cabazes-e-presentes, guia-do-cafe vs guias, onde-beber-sotocal/levantar-no-cafe vs onde-levantar). The repo's handles are already in store-setup JSON, the redirect CSV and the EN translations. Decision D12.

## 4. Old URL inventory (`docs/seo/old-urls.csv`)

- **Sources used:** Wayback CDX (`sotocalcafes.pt`, domain match, 197 captured URLs), the live site's navigation, and the live `sitemap.xml` (xml-sitemaps.com, lists `http://www.` URLs). **Not available:** Search Console, Bing.
- **Result:** 34 legacy paths (the home page, 32 `.php` pages, `/projeto.pdf`), all 200 today and all with a proposed target. 100% match docs/redirects.csv. Rows for `/q/chavena`, `/q/acucar`, `/sitemap.xml` and `/robots.txt` are added with notes.
- **Not redirected on purpose:** about 100 legacy image, CSS, JS and shadowbox files (`/images/*.png`, `/css/*`, `/js/*`). They carry no ranking value worth a redirect; they will 404 after the cutover.
- **Gaps:** two redirect targets are articles that do not exist yet (`como-tirar-o-melhor-expresso`, `curiosidades-do-cafe`; copy is in `docs/CONTENT.md`). Create them before importing or the redirects land on a 404. A Search Console export may add parameterised URLs the crawl never saw.
- **Cutover rules:** redirects fire only when the old URL returns 404 on Shopify (it will, since Shopify has no `.php` routes). Do not switch off the old server before DNS points to Shopify. Keep the old Search Console property and watch Coverage for eight weeks.

## 5. Data availability and the open `TODO(sotocal)` list

The repo writes gaps as `[[TBC: …]]` (visible only while the "Mostrar marcadores" theme setting is on). I treat `[[TBC]]` as equal to the prompt's `TODO(sotocal)`; no rename. 186 markers, 84 distinct, all mapped to `docs/QUESTIONS-FOR-CLIENT.md` (54 questions: 8 answered, 19 priority A open).

| Area | Have | Missing |
|---|---|---|
| Products | 4 blends, 4 substitutes, 6 spices, 8 accompaniments, 2 bundles, titles and descriptions rewritten from the leaflet | Final prices (all 1,00 €, draft), SKUs, EAN/GTIN (Q1, Q2) |
| Food information | Allergens for barley and peanuts, ingredients for some leaflet products | Full FIC per product: ingredients order, net quantity, storage, best-before wording, nutrition or exemption (Q3, Q49) |
| Blend facts | Origins from the leaflet; Reggio "torra intensa de tipo italiano" | Intensity 1–5, arabica/robusta %, "ideal para" (Q7); decaf descriptors (Q8) |
| Shipping, subscription, returns | Settings and schema ready | Rates and delivery times incl. islands, free-shipping threshold, subscription terms, policies (Q5, Q6, Q16, Q25) |
| Pickup and locator | Metaobject and templates | Partner café list with **written consent** (Q17, Q18) |
| Legal | Slots in the footer | RAL entity, Livro de Reclamações registration, policy texts, EAA exemption, VAT for islands and OSS (Q23–Q28) |
| People and entity | Founding facts, awards, address, phone, VAT ID | José Barbosa's title, confraria name, portraits and consent (Q31–Q33), canonical Google Maps URL (Q40) |
| Photos | Legacy packshots, 3 client photos (~1000 px) | Real packshots, roastery photos (ASSET-BRIEF) |
| Roast-date practice (D10) | Nothing | **Not in the question list: add it.** No freshness claim until answered |
| Competitor prices | Brief's table (31/10/2026, to re-verify) | Dated, sourced `competitor` entries before any comparison or calculator |

## 6. Platform constraints

| Question | Finding | Confidence |
|---|---|---|
| Metaobject entries as web pages | Shopify's `onlineStore` capability makes a definition render pages with a theme template (docs, checked today). URL shape confirmed in the same docs: `/pages/<urlHandle>/<entry handle>`, where `urlHandle` is set on the definition (needs `renderable` + `onlineStore`). None of the 6 original definitions enables it and the repo has no `templates/metaobject/*` (WS3 adds `method` and `machine` with web pages; templates follow in WS5) | Verified in docs; untested on a store |
| `robots.txt.liquid` | Supported; already used. Default groups are believed to disallow search, cart, checkout, sorted and `+`-combined tag URLs and not to block AI crawlers (repo claim; confirm on the store's live `/robots.txt`) | Medium |
| `/llms.txt` | Served natively since 28/05/2026; override via `llms.txt.liquid` or `agents.md.liquid`. The template sees only `request` and `agents`, so entity text is static | High |
| Redirects | Fire only for URLs that 404; a live route always wins (Shopify help, cited in `docs/SEO.md`) | High |
| Markets, phase 2 | A French language would be added as a language with translated handles; hreflang follows. Handles vary by language, not by market. Swiss/CHF pricing would need Markets work | Medium, unverified |
| Invoicing | Nothing chosen. Needs an AT-certified invoicing app chosen with the accountant | n/a |
| Google Merchant Center | Not connected; needs the Google & YouTube channel and a live store | n/a |

## 7. Keyword map (`docs/seo/keyword-map.csv`)

89 rows seeded from section 5 of the prompt plus the repo's own hypotheses: 10 launch, 27 phase 3, 22 conditional, 28 reject, 2 phase 2. Volumes are the prompt's (Ubersuggest, 17/11/2026) and were not re-measured; the repo's October numbers differ slightly (café em grão 720 vs 880). Where several queries share one intent they point at one URL. Conflicts are in the last column; the main ones: competitor-brand queries (repo says don't target, prompt wants a comparison page), `/collections/cafe-em-grao-1kg` (duplicate of the grain collection), machine B2B terms (Sotocal sells none), and health-claim queries (rejected).

## 8. Decisions

### Prompt decisions D1–D10, status against the repo

| # | Status | Evidence |
|---|---|---|
| D1 substitutes still produced? | **Mostly answered**: yes per the 2026 leaflet; confirm current production and formats | Q9, Q53, products in `store-setup/products.json` |
| D2 capsules | Open. No capsule product exists | Q8 (decaf unidoses may be ESE pods) |
| D3 click and collect cafés | Open. Locator and cart pickup built, no cafés | Q17, Q18 |
| D4 HQ receives public? | Open | Q40, Q41 |
| D5 Christmas 2026 | Open. See finding 4 | Q1–Q6, Q16–Q18, Q23–Q25 |
| D6 offices | Open. Repo assumes HoReCa only | Q19–Q22 |
| D7 EAN/GTIN | Open | Q2 |
| D8 consumer price, free-shipping threshold | Open. Placeholders; 40 € threshold unconfirmed | Q1, Q5 |
| D9 named author | Open. Planned: Maria José Barbosa, consent pending; fallback "Sotocal" | Q33 |
| D10 roast-date practice | Open, and not yet asked | add as a question |

### New decisions the recon created

| # | Decision | Recommendation |
|---|---|---|
| D11 | Launch languages: PT only (prompt) or PT + EN (built)? | **DECIDED 17/11/2026 (José): PT only first.** Leave English unpublished in Shopify Languages; the translations stay ready and nothing is rebuilt or noindexed. Publish EN in phase 2 |
| D12 | URL names: keep the repo's handles or adopt the prompt's | Keep the repo's (already in redirects, translations, menus). Map the prompt's names in the keyword map only |
| D13 | Dedicated `/collections/cafe-em-grao-1kg`? | No. It would list the same four blends as the grain collection; use a section or filter |
| D14 | Delta/competitor comparison page | **DECIDED 17/11/2026 (José): allowed**, pending a legal read of the wording (D76). Dated, sourced prices, no denigrating claims; `docs/SEO.md` updated ("do not target competitor brands") consistently |

## 9. Unverified, to check on a dev store before launch

hreflang and `x-default` output; the live `robots.txt` content; the query-string redirect for `/q/*`; JSON-LD in Rich Results Test; real LCP/INP; whether Shopify Subscriptions or any other app injects a second Product JSON-LD; the metaobject page URL shape.

## 10. Proposed next steps (after approval)

1. José answers D11, D1/D2/D5 and the priority-A questions, and creates the Shopify dev store with CLI access.
2. Push the theme to an unpublished dev theme and run the checks in section 9.
3. Fix the delta items that need no client data: `/collections/all` link and `noindex`, optional AI `Allow` groups, the missing metaobject definitions.
4. Re-run the phase gate per workstream.

# Brief review: what is done, what is missing

18/11/2026. Line-by-line check of the original brief ("build sotocalcafes.pt for SEO and GEO from day 1") against the repo.

Status values:

- **Done**: built and tested.
- **Built, data missing**: the template or logic exists; real content from Sotocal is still needed.
- **Open**: not built or not done.
- **Ops**: work outside the theme (accounts, store settings, people).
- **Changed**: a decision replaced the brief's instruction (decision number given).

## Fixed in this pass

| Gap | Fix |
|---|---|
| No pages for "fornecedor de café <cidade>" | `service_area` pages for 18 districts plus Açores and Madeira, gated on real local data. Porto is live (D111, `docs/seo/15-local-pages.md`) |
| Comparison tables used sample brands | 74 real, dated `competitor` entries:<br>- Continente, 61 (17/11);<br>- Torrié, 12 (18/11);<br>- Bicafé, 1 (18/11).<br>Calculator and Delta guide read them (D113) |
| Prototype still showed 1,00 € for coffee | Coffee variants at the 40 €/kg placeholder: 250 g 10,00 €, 1 kg 40,00 € (D91). Still tagged `preco-provisorio`, so noindex |
| Torrié "study first" (§6.1) not done | Done; see "Torrié and Bicafé" below |
| Gate §10 items 2, 6, 7 were manual | `npm run check:seo` in `npm run qa` (D112) |
| Article titles of 68–71 characters (> 60) | Long suffix falls back to "\| Sotocal", then to the bare title |
| `/pages/despensa-do-norte` indexable although the URL map says noindex | noindex (same intent as the product) |
| Pages with a literal TBC in the body were indexable (`/pages/cafe-e-saude`, accessibility statement) | noindex until the TBC is resolved (gate 4) |
| Delta guide printed its "quando não escolher a Sotocal" TBC as raw text | Renders as a marker; the guide stays noindex until that text exists |
| Organization `sameAs` carried a `share.google` short link | Skipped; needs the full Maps URL (D114, Q69) |
| Trust FAQ had no roast-date answer | `data-de-torra`: "A data de torra vem impressa em cada embalagem" (D100) |
| Prototype claimed "torrado na semana do envio" for Super Milano | Now "impressa na embalagem" (D100) |
| Lighthouse never run on hubs, tools, gifts, comparison or local pages | Run; results below |
| Several launch keywords mapped to pages whose titles did not contain them; "cevada em grão" mapped to a ground product | SEO titles for the sucedâneos, café em grão, café moído and capsule collections, Mistura Bom Dia, Cevada, A torra and the calculator. "cevada em grão" → conditional (Q66) |
| B2B machine terms (CPC 2,14–2,68 USD) rejected | Targeted by a section on the B2B page, "Máquina de café para restaurantes, cafés e hotéis" (`#equipamento`). Offices wait for Q71 (D115) |

## Section by section

### §1 What Sotocal is

| Requirement | Status | Evidence / next step |
|---|---|---|
| Legal name, address, 1960, awards | Done | D95, D110; `award` and `timeline_event` entries |
| Brand colours | Changed | Tokens follow the client's Pantone sheet (CLAUDE.md), not the brief's hex values |
| Product facts (§1.2) | Built, data missing | Prices Q1, GTIN Q2, food info Q3, capsules Q55, spices Q66, decaf box Q67 |
| Illustrative price 22 €/kg | Changed | Placeholder 40 €/kg (D91); not public while tagged `preco-provisorio` |
| Subscription every 3, 4 or 6 weeks | Built, data missing | `/pages/subscricao`; app, discount and cancellation unknown (Q70) |
| QR codes in cafés | Built, data missing | `page.qr`, noindex, UTM; offer text and code missing (D107) |
| Click & collect with café commission | Built, data missing | Locator and cart pickup list wait for consenting cafés (D3). The commission is an ops agreement (Ops) |
| Gift box | Built, data missing | Contents and price Q12 |
| Online price never undercuts HORECA | Open (process) | No guard in code, because HORECA prices are not in the store. Rule for Admin: no sitewide discounts, no "promoção" pricing on coffee; check each price change against the HORECA list offline |

### §2 How to work

| Requirement | Status | Evidence / next step |
|---|---|---|
| Stop at gates | Done | Phases 0 to WS13 approved one by one |
| Unpublished dev theme, no store changes | Done | No store access yet (D106); nothing published |
| Never invent facts | Done | TBC markers; fixtures labelled "exemplo"; gate 4 enforced by `robots-meta` and `check:seo` |
| PT-PT, not PT-BR | Done in copy | Vocabulary per CLAUDE.md |
| **Native PT-PT reader checks every template** | **Open** | Nobody has read the pt-PT locale and templates end to end. Needs a person; suggested before launch |
| One source of truth | Done | Metaobjects and metafields; competitor prices only in `competitor` entries |
| **Use `stop-slop` and a brand DNA file** | **Open** | Not run on the locale files or drafts. Run it on `locales/pt-PT.default.json` and `docs/seo/drafts/*` before the PT-PT read |

### §3 Playbook

| Tactic | Status | Evidence / next step |
|---|---|---|
| Entity database drives pages | Done | 11 metaobject types |
| "Avise-me" when out of stock | Done | `product.js`; OutOfStock schema kept |
| Hubs by method and machine | Built, data missing | Templates and gates exist. **No method or machine entries yet**: grind, dose and ratio must come from Sotocal's roasters (Q7) |
| Calculator and quiz | Done | Calculator uses the real references; quiz needs real intensity and best_for (Q7) |
| Answer block under H1 | Done | Hubs, guides, collections, local pages |
| Named author and Person schema | Done | Maria José Barbosa, grã-mestre (D99) |
| Honest listicles | Built, data missing | See WS7 |
| AI crawlers allowed | Done | `templates/robots.txt.liquid` |
| Trust FAQ: freshness, roast date, Robusta, islands, subscriptions, returns | Partly | Roast date, Robusta and destinations exist. Subscriptions and returns need facts (Q70, Q25) |

### §4 What not to do

| Rule | Status | Evidence |
|---|---|---|
| No city doorway pages | Done | Local pages are gated on real local data (D111). Only Porto is indexable |
| No thin template pages | Done | `robots-meta` gates; `check:seo` |
| No fake dates, reviews or self-ranking | Done | Sotocal always last in comparisons; no review app yet |
| No health claims | Done | Substitute facts only with source URL (D67) |
| Robusta not led with | Done | FAQ only |
| No years in evergreen URLs | Done | `/collections/presentes` |
| Shopify duplicates noindex or canonical | Done | `robots-meta` and canonical tests |
| No fact-free product descriptions | Built, data missing | Food-information fields wait for Q3 |

### §5–6 Keywords and competitors

| Requirement | Status | Evidence / next step |
|---|---|---|
| Keyword map | Done | 93 rows, now including the B2B and local terms |
| Competitor prices with sources and dates | Done for retail and the two northern roasters | Brands covered:<br>- grain/ground: Delta, Nicola, Sical, Buondi, Lavazza, Inducci, 3 Corações, Continente own label, Torrié, Bongosto, Bicafé;<br>- capsules: Buondi, L'Or, Nicola, Starbucks, Continente, Torrié |
| **Specialty tier** (Combi, Senzu, SO, Fábrica, 7G) | **Open** | Fábrica's store answers HTTP 429 to automated reads. Needs a manual read, or a retry another day |
| **Kaffa, Segafredo, Musetti, Portela** | **Open** | Not in the Continente results. Manual read of their own shops |

### §7 Phase 0 and WS1 technical

| Requirement | Status | Evidence / next step |
|---|---|---|
| Recon, old URLs, keyword map | Done | `00-recon.md`; 34 old URLs, all in `docs/redirects.csv` |
| Domain, www/http in one hop | Ops | Domain access pending (D106) |
| Redirect import, no old URL 404s | Ops | Import when the store exists; the legacy site stays up until then |
| robots.txt, canonicals, noindex rules, `lang`, `og:locale` | Done | Tests |
| Core Web Vitals | Done in the prototype, not on a real store | Lab LCP is above 2.5 s only because of the placeholder hero; re-measure with real images on the store |
| Organization, Product + Offer + shipping + returns, Breadcrumb, FAQ, Article, Person, Recipe | Done | `check:jsonld` |
| LocalBusiness only if the HQ receives the public | Done | Gated by HQ settings; HQ is a collection point only (D94) |
| GTIN or `identifier_exists=false` | Ops | D7: no GTINs yet |
| **Merchant Center feed titles** "Sotocal – Café em grão Super Milano 1 kg" | **Open** | Product titles are "Lote Super Milano" with options. Needs a feed rule in the Google & YouTube channel once the store exists |
| GSC and Bing verified, sitemap on launch day | Ops | Needs the domain |
| Livro de Reclamações, RAL | Done | Footer |
| Policies (IVA, shipping, returns, privacy, cookies) | Ops | Q25; Shopify policy pages are placeholders |
| AT-certified invoicing app | Ops | Not chosen |
| Mandatory food information before purchase | Built, data missing | `fic_*` fields; values Q3 |

### WS2–WS4 Architecture, data layer, templates

| Requirement | Status | Evidence / next step |
|---|---|---|
| URL structure | Changed | Handles kept as built (D61); mapped in the keyword map |
| `/collections/chas-e-infusoes` | Changed | Teas sit in Complementares (D53); there are two tea products |
| Data layer (blend, method, machine, substitute, pickup, competitor, faq) | Done | `pickup_point` is `partner_cafe`; plus `service_area` |
| PDP: H1, answer block, formats, methods, food info, delivery, FAQ, schema | Built, data missing | Prices, food info and real delivery times are TBC |
| Collection intros 60–120 words | Done | Approved 17/11 |
| Out of stock keeps 200 and OutOfStock | Done | Tests |

### WS5 Hubs

| Requirement | Status | Evidence / next step |
|---|---|---|
| 3 method hubs at launch | **Built, data missing** | Templates are ready and gated; no entries. Needs Sotocal's recommendation, grind and ratio per method (Q7). Without them the launch set is 3 URLs short |
| Machine model pages (ECAM220, Magnifica Evo, Philips 2200) | Open | Settings must come from the manufacturer's manual, with the source URL; none written. Gated until then |
| Substitutes hub | Changed | Facts on the substitute product pages plus guides (D67). D1 is now confirmed, so the cevada and chicória guides are the priority (WS11) |

### WS6–WS7 Tools and comparisons

| Requirement | Status | Evidence / next step |
|---|---|---|
| Calculator with sourced, dated references | Done | Same-format top 10, show all |
| Quiz | Built, data missing | Q7 |
| `melhor-cafe-em-grao-portugal` (≥ 8 brands across tiers incl. specialty) | Built, data missing | Draft blocked: specialty prices missing; retail and Torrié/Bicafé now available |
| `melhor-cafe-em-grao-maquina-automatica` | Open | Skeleton only; needs the method hub first |
| `cafe-delta-alternativas` | Built, data missing | Real data; noindex until the "quando não escolher" text and the legal read exist (D76, Q62) |
| `melhores-torrefacoes-do-norte` | Open | Skeleton only. Torrié and Bicafé data now exist; needs specialty roasters |
| `cabaz-de-natal-produtos-portugueses` | Open | Seasonal. The Christmas plan covers the collection, not this guide |

### WS8–WS10 Local, gifts, B2B

| Requirement | Status | Evidence / next step |
|---|---|---|
| Google Business Profile, NAP on directories | Ops | José / Sotocal (D104) |
| Locator and pickup pages | Built, data missing | Wait for consenting cafés |
| QR landing pages noindex | Done | `page.qr` |
| District supplier pages | Done (new) | D111 |
| Gifts: Christmas state, gift message, cut-offs, B2B gifts | Done | WS9 |
| B2B page and lead form | Done | Offices row (D98); district select |
| Lead delivery | Built, not deployed | Resend handler and tests; needs the API key, sender domain and recipients (Q60) |

### WS11–WS13 Editorial, GEO, measurement

| Requirement | Status | Evidence / next step |
|---|---|---|
| 4–6 guides a month | Built, data missing | 5 drafts; 1 passes `check:guides`. The others need sources (cevada caffeine and chicória with EFSA or INSA references) |
| Off-site checklist, 20 GEO prompts | Done | `12-ws12-geo-offsite.md`, `geo-prompts.md` |
| Reviews (free app only) | Ops | Judge.me free plan or Shopify Product Reviews when the store exists |
| GA4, Meta Pixel and CAPI via Customer Events | Ops | Theme publishes the custom events (`check:events`) |
| Ledger with the 70 % indexed gate | Done | `npm run ledger`; Porto local page added to batch 0 |

### §10–11 Quality gate and definition of done

| Requirement | Status | Evidence |
|---|---|---|
| Gate 1: one keyword per URL | Done (manual) | Keyword map |
| Gate 2: ≥ 40 % unique | Done | `check:seo` (all indexable pages pass; lowest is 41 %, the máquina automática sample article) |
| Gate 3: one unique element | Done by template gates | Hubs, machines and local pages need data to be indexable |
| Gate 4: no TBC | Done | `robots-meta` and `check:seo` |
| Gate 5: answer block, breadcrumbs, schema, author, dates | Done | Tests and `check:jsonld` |
| Gate 6: 3 links in, 3 out | Partly | Out-links enforced on content pages. In-links are reported only, because the prototype renders a sample |
| Gate 7: title ≤ 60, description ≤ 155 | Done | `check:seo` |
| Gate 8: no health claims, third-party facts sourced and dated | Done | `check:guides`, competitor dates |
| **Rich Results Test output saved** | **Open** | Needs a public URL; `check:jsonld` is the local substitute. Run it on the dev-theme preview URL when the store exists |

## Torrié and Bicafé (§6.1 "closest analogue: study first")

Read on their own online shops, 18/11/2026. Source links and notes are in the `competitor` entries.

| Brand | Product | Price | Per kg |
|---|---|---|---|
| Bongosto (J.M.V.) | Grain 1 kg | 16,99 € | 16,99 € |
| Torrié | Café Torrado em Grão 250 g | 4,49 € | 17,96 € |
| Torrié | LC2, grain 1 kg | 32,60 € | 32,60 € |
| Torrié | Antigo, grain 1 kg | 40,59 € | 40,59 € |
| Torrié | Clássico, grain 1 kg | 44,90 € | 44,90 € |
| Bicafé | Black Label, grain 1 kg | 45,01 € | 45,01 € |
| Torrié | Nobre / Real / Imperial / Biológico, 1 kg | 51,05–61,50 € | same |
| Torrié | Expresso, 10 Nespresso-compatible capsules | 2,09 € promo (3,19 €) | n/a |
| Torrié | Expresso Clássico aluminium, 10 capsules | 2,69 € promo (3,89 €) | n/a |

What this means for the plan:

1. **The 40 €/kg placeholder is in line with the closest analogues.** Torrié's mid-range 1 kg lines (40,59 € and 44,90 €) and Bicafé's Black Label (45,01 €) sit right there. Supermarket Delta 1 kg is 19,99–25,99 €.
2. **Comparison tables need care.** Next to supermarket brands, a 40 € Sotocal row reads as expensive. That is one more reason the Sotocal row stays hidden until a real price exists, and for the "quando não escolher a Sotocal" line.
3. **The tiering is worth copying.** Torrié separates "Em sua casa" (250 g packs and capsules for consumers) from "No seu negócio" (1 kg grain lines for businesses).
4. **The capsule price is a reference.** Torrié's compatible capsules are 0,21–0,27 € each on promotion, 0,32–0,39 € without; the calculator now has this reference for Sotocal's subcontracted capsules (Q55).

## Lighthouse (prototype, mobile, 18/11/2026)

| Page | Perf | A11y | BP | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| Home (pt / en) | 88 / 82 | 100 | 100 | 100 | 2.9 / 2.8 s | 0 |
| Product | 88 | 100 | 100 | 66 (noindex: placeholder price) | 2.8 s | 0 |
| Collection | 100 | 100 | 100 | 100 | 1.4 s | 0 |
| História | 96 | 100 | 100 | 100 | 2.3 s | 0 |
| Profissional | 93 | 100 | 100 | 100 | 1.4 s | 0 |
| Article | 97 | 100 | 100 | 100 | 2.6 s | 0 |
| Comparison (Delta guide) | 98 | 100 | 100 | 66 (noindex: "quando não escolher" text missing) | 1.4 s | 0 |
| Method hub | 98 | 100 | 100 | 100 | 1.4 s | 0 |
| Calculator | 98 | 100 | 100 | 100 | 1.5 s | 0 |
| Quiz | 98 | 100 | 100 | 100 | 1.4 s | 0 |
| Gifts collection | 93 | 100 | 100 | 100 | 2.1 s | 0 |
| Local page (Porto) | 100 | 100 | 100 | 100 | 1.4 s | 0 |

The SEO 66 scores are the intended noindex. Home, product and article LCP is still 2.6–2.9 s, above the brief's 2.5 s; it is the placeholder hero art, and must be re-measured with real images on the store.

Total Blocking Time on home varied between runs on this laptop (250 to 420 ms, from a run under load: 75). Re-measure on the store with PageSpeed Insights, which also gives field data.

## Biggest remaining gaps before launch (order of impact)

1. **Real prices** (Q1/Q61): every coffee PDP stays noindex while tagged `preco-provisorio`.
2. **Store, domain and redirect import** (D106): the old site's brand result depends on it.
3. **Method hub data** (Q7): the three launch hubs and the quiz need Sotocal's grind and ratio.
4. **Food information** (Q3) and **policies** (Q25): legal requirements before any sale.
5. **PT-PT native read and `stop-slop` pass**: never done.
6. **Districts served** (Q68): turns local pages on one by one.
7. **Specialty and remaining brand prices**: unblocks the "melhor café em grão portugal" listicle, the highest-value guide in the brief.

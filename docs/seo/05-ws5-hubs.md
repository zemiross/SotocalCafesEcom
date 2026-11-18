# WS5: method, machine and substitute hubs

Date: 17/11/2026. Launch is PT-PT only (D58). This workstream built the **templates and rules**. **No entries exist and nothing was applied to a store**, because the content (dose, grind, recommended blend, manual excerpts, sources) must come from Sotocal. The hubs therefore cannot launch until Q14 is answered.

## 1. What was built

| Piece | What it does |
|---|---|
| `templates/metaobject/method.json`, `machine.json` + `sections/main-hub.liquid` | One section renders both types from the metaobject fields: answer block (H1 name, short answer, byline, review date), **Sotocal's recommendation**, recommended blends (product tiles, up to 4), grind and dose, numbered steps (a real sequence), common mistakes, FAQ (ink band, FAQPage schema), and for machines the manufacturer settings with source links and a back-link to the method hub. A method hub lists its machine pages |
| `snippets/structured-data-hub.liquid` (hooked into `structured-data.liquid`) | WebPage plus Article: author Person (or the Organization), `dateModified` from the review date, no invented publish date. BreadcrumbList and FAQPage come from their own snippets |
| `snippets/breadcrumbs.liquid` | Home › Café › method (› machine); a machine under its method hub |
| `snippets/meta-tags.liquid` | Title from `seo_title` (brand added only if it fits 60 characters), description from `seo_description` or the short answer, `og:type` article |
| `snippets/robots-meta.liquid` | **Doorway-page guard** (D66): `noindex,follow` unless complete (section 2) |
| `snippets/substitute-facts.liquid`, `sections/main-product.liquid` | On substitute product pages, shows the `substitute` entry: what it is, history note, and caffeine and gluten statements **only with their source link** (D67) |
| `layout/theme.liquid`, `assets/sections-collection.css` | Loads the tile and hub styles on hub pages; the hub H1 uses the product-title size |
| Locales | 19 new keys in PT and EN (hubs, substitute), in sync |
| `snippets/structured-data.liquid` | WebSite `inLanguage` is `"pt-PT"` while one language is published (D68) |
| Tests | Screenshot and axe test names now include the path, so several pages can share a template |

## 2. Quality rules enforced in code

| Page | Noindex unless |
|---|---|
| Method hub | the Sotocal recommendation **and** at least one recommended blend are filled |
| Machine page (type) | at least one recommended blend is filled |
| Machine model page (brand set) | also manufacturer settings **and** source URLs are filled |

A model page that fails is also left out of the hub's machine list, so no internal link points to it. The fields `short_answer`, `reviewed_on` and (for methods) `sotocal_recommendation` are required in the definitions, so an entry cannot be saved without them.

## 3. Prompt checklist

| Prompt item | State |
|---|---|
| Method hubs, 3 at launch (automatic, moka, espresso machine), up to 7 | Template ready. Entries wait for Q14. Moagem and prensa francesa are phase 3 |
| Answer block, recommended blend, grind and ratio from Sotocal, steps, common mistakes, product module, FAQ | All rendered from fields |
| Machine model pages only with validated demand and manual-sourced settings | Guarded by D66; the three candidate models are phase 3 and need a fresh volume check |
| Substitutes hub (cevada, chicória) with sources, no health claims | Not a separate hub (D12/D67). Facts sit on the product pages; the sourced question pages (`cevada tem cafeína`, `cevada tem glúten`, `o que é chicória`) are phase-3 guides. The history of substitutes and the 1970s Azores chicory production go in `history_note`, once Sotocal confirms the wording |

## 4. Checks

| Check | Result |
|---|---|
| Theme Check | 0 errors, 11 warnings (the same `agents` ones). First run caught a schema name over 25 characters; fixed |
| Locales | in sync |
| Prototype and JSON-LD | 58 pages (3 new fictional hub fixtures); all valid; 6 Article nodes |
| Render checks | Complete method and model pages are indexable; a model without settings and sources is `noindex` and is absent from the hub's list; breadcrumbs and Article schema correct |
| Substitute facts | Unit-tested: nothing shows without a statement and source; a statement without its source is hidden; both show with sources; no entry prints nothing |
| axe and keyboard | 119 passed, including the hub pages in both languages and two widths |
| Screenshots | 72 hub screenshots with the horizontal-overflow assertion: all passed. Hub looks consistent with the rest of the theme (checked at 1440 px) |
| Budgets | JS 59.5 KB, CSS 13.9 KB gzip: within limits |

**Not verified:** Shopify's actual `metaobject` object and `system.url` on a store (confirmed in the docs, but never run); the real `request.page_type` of metaobject pages (the code does not depend on it); the first `--apply` of the definitions with web pages.

## 5. Risks and decisions

- **Content, not code, blocks this workstream.** Without Q14 there are no hubs, which also leaves "café para máquina automática" and "cafeteira italiana" (the highest-volume machine terms) unserved at launch.
- **Decision (D18): treat the hubs as launch-optional.** If Q14 is not answered in time, launch without them (they stay unpublished) rather than with thin text; the machine-owner keywords move to phase 3.
- **Competitor-brand queries stay out of hubs.**
- Before the first `--apply` of `method` and `machine`, push the theme to a dev store and test one entry.

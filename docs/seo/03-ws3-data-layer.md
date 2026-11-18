# WS3: data layer (metaobjects and metafields)

Date: 17/11/2026. Scope: definitions only. **Nothing was applied to a store, no entries were created, and no theme template changed.** Entries need content from Sotocal, which I will not invent. The setup script runs in dry-run mode only.

Approved earlier and now logged in `docs/DECISIONS.md`: D61 (keep repo URL handles), D62 (no 1 kg collection), D63 (two legacy guides publish at launch).

## 1. What was added

| Where | Change |
|---|---|
| `store-setup/metaobject-definitions.json` | 4 new types: `method`, `machine`, `substitute`, `competitor`. `faq_item` gains `scope`; `partner_cafe` gains `pickup_notes`. Now 10 types |
| `store-setup/metafield-definitions.json` | 11 new definitions (31 → 42): product `story`, `recommended_methods`, `roast_date_policy`, `grind_options`, `substitute`; collection `faq`, `buying_guide`, `related_methods`; article `answer`, `last_reviewed`, `sources` |
| `scripts/store-setup.mjs` | Understands web-page capabilities (`renderable` and `onlineStore`) on create and on update of an existing definition |
| `docs/DATA-MODEL.md` | Tables for every new field and type, plus a WS3 section |
| `docs/seo/00-recon.md` | The metaobject page URL shape is now confirmed from Shopify's docs |

## 2. The prompt's entities against the implementation

| Prompt entity | Implementation |
|---|---|
| `blend` (product metafields) | Mostly present: character, tasting notes, intensity, roast, origins, arabica/robusta, best-for, preparation, all `fic_*`, FAQ, pairings. Added: `story`, `recommended_methods` (reference to `method`), `roast_date_policy`, `grind_options`. Formats are the Formato/Peso variant options |
| `method` | New. Short answer, **required Sotocal recommendation**, recommended blends, grind, dose and ratio, steps, common mistakes, FAQ, author, **required review date**, SEO title and description. Renders at `/pages/metodo/<handle>` |
| `machine` | New. Type (automatic, manual espresso, moka, French press, filter, capsule), optional brand and model, method reference, recommended blends and grind, manufacturer settings and sources, FAQ, author, review date. Renders at `/pages/maquina/<handle>` |
| `substitute` | New. What it is, roasting, preparation, caffeine and gluten statements each with a source URL, history note, products, FAQ. **No health-benefit field.** No web pages (D12: the collection, product pages and phase-3 guides cover it, so it cannot become a doorway page) |
| `pickup_point` | **Reuses `partner_cafe`** (name, address, town, hours, pickup flag, written-consent flag, draft/active status), plus `pickup_notes`. A second type would duplicate it. The prompt's "live stock per pickup point" does not apply: pickup rides Sotocal's own HoReCa delivery route, so cafés hold no stock |
| `competitor` | New. Brand, group, product, format, pack weight and price, price per kg, list vs promotional price, channel, segment, **required source URL and date read**, notes. Data only, no pages, no logos |
| `faq` | Existing `faq_item` plus optional `scope` (global / product family / method). Pages reference the questions they show |

## 3. Built-in quality gates

- A `method` cannot be saved without the Sotocal recommendation and a review date, which matches quality gate 3 ("an element no sibling has") and the dated-facts rule.
- A `competitor` entry cannot be saved without a source URL and the date the price was read. The comparison pages and calculator will show both.
- `substitute` caffeine and gluten statements have their own source fields. The templates (WS5) will show a statement only when its source is filled.
- A `machine` model page needs `settings` and `sources`; the WS5 template will `noindex` any that lack them, which keeps model pages from becoming doorway pages.

## 4. Checks

| Check | Result |
|---|---|
| Both JSON files parse | yes |
| `store-setup.mjs` syntax and dry-run | passes: 10 metaobject definitions (method 14 fields, machine 15, substitute 12, competitor 13) and 42 metafield definitions planned, in dependency order |
| Locale check, Theme Check | unchanged: keys in sync, 0 errors, 11 warnings |

**Not verified:** the Admin API calls themselves (no store); whether Shopify accepts `onlineStore` together with `publishable` on one definition; the `list.max` and `date` validations on metaobject fields. These surface as `userErrors` on the first `--apply` against a dev store.

## 5. Content needed before any entry exists (all from Sotocal)

| Entry type | What is needed |
|---|---|
| `method` (3 at launch: automatic machine, moka pot, espresso machine) | Dose, grind, recommended blend, common mistakes: Q14 |
| Blend metafields | Story text, intensity, arabica/robusta ratio, "ideal para": Q7; roast-date practice: D10; grind options for ground coffee |
| `machine` models | Manufacturer manual excerpts and URLs for the De'Longhi Magnifica Start, Magnifica Evo and Philips 2200; a fresh volume check first (phase 3) |
| `substitute` (cevada, chicória) | D1 confirmation; cited sources for caffeine and gluten; confirmed history lines |
| `competitor` | Prices read from public pages, with URL and date, for at least 8 brands across tiers; every price is re-read before publishing |
| `faq_item` | Answers on freshness, Robusta, island delivery, subscriptions and returns; the last three depend on Q6, Q16, Q25 |

## 6. Risks and decisions

- **Do not run `--apply` for `method` and `machine` until WS5 templates exist.** Enabling web pages before a template exists would leave published entries without a page design. The definitions themselves are safe to apply.
- **Decision needed (D16): authors.** `method.author` is optional and falls back to "Sotocal". Naming Maria José Barbosa needs her consent (Q33).
- Competitor prices decay: set a quarterly re-verification reminder when the first entries go in.

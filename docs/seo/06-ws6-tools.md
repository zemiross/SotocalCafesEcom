# WS6: tools (cost-per-cup calculator and machine quiz)

Date: 17/11/2026. Launch is PT-PT only (D58). The tools are built and tested on the prototype with **fictional fixtures**. Nothing was applied to a store. Both need Sotocal data before they can go live (section 4).

## 1. Calculator: `/pages/calculadora-custo-chavena`

| Prompt requirement | State |
|---|---|
| Inputs: format (grain, ground, capsule), pack price, pack weight or capsule count, dose per cup (default 7 g, editable), cups per day | Built. Decimal commas accepted ("12,50"). The weight and dose fields give way to a capsule count for capsules |
| Outputs: cost per cup, per month, per year | Built. Cup = price ÷ weight × dose (capsules: price ÷ count); month = cups × 365 ÷ 12; year = cups × 365. The assumption is printed under the numbers |
| Compared with capsule and supermarket references from the `competitor` metaobject, with sources and dates shown | Built. Table sorted by cost per cup at the visitor's dose, with the visitor's row highlighted, a link to each source, the date read, and a "more than 90 days old" flag. Prices come only from entries; none are hard-coded |
| Linkable and citable | The inputs are stored in the URL (`?f=grao&p=12%2C50&w=1000&d=7&c=2`) so a result can be shared; a copy-link button; a "Como citar" line with the page URL and the date of the newest reference price |
| Sotocal presets | Offered from the blends' own variants, **excluding any product tagged `preco-provisorio`** (D69), so a placeholder price cannot feed a calculation |

Verified by test: 12,50 € for 1 kg at 7 g gives 0,088 € a cup, 5,32 € a month at two cups a day and 63,88 € a year; capsules 3,20 € for 10 give 0,32 €; invalid input shows an error; the table lists both references and the visitor's row; no console errors.

## 2. Quiz: `/pages/qual-o-cafe-para-a-minha-maquina`

Four questions on one page (machine, milk, intensity, decaf), then a suggestion with the normal product tile and add to cart, up to two other options, and a one-line reason.

- **Nothing is hard-coded about the coffee** (D70). Answers are matched to Sotocal's own data: machine and "com leite" against the `sotocal.best_for` chips, intensity against `sotocal.intensity` (1–5), decaf against `sotocal.blend`. The chip texts and the three intensity targets are section settings, so they follow Sotocal's wording.
- Ranking: machine match 3 points, milk match 2, then closest intensity. Decaf is a hard filter either way.
- The reason line quotes only data ("indicado para Máquina automática, intensidade 4 em 5").
- **The page is `noindex` until at least two blends have intensity and `best_for` filled**; before that the form is hidden (visible only in the editor or with TBC markers on).
- **The result is not a separate page**: it appears on the same URL, so there is no result page to index. Prompt requirement ("result page not indexable, quiz page indexable") is met.
- **Email capture is optional**, inside the result: the existing newsletter form with its consent text, tagged `newsletter` and `quiz`. No data leaves the page otherwise.

Verified by test: incomplete answers show an error; automatic machine + milk + intense returns Lote Super Milano with its reason; decaf returns the decaf blend; product ids stay unique (tiles are moved, not cloned); no console errors.

## 3. Also changed

| Item | Detail |
|---|---|
| Templates and sections | `page.calculator.json`, `page.quiz.json`, `sections/tool-calculator.liquid`, `sections/tool-quiz.liquid`, `assets/calculator.js`, `assets/quiz.js`; styles in `assets/sections-pages.css`; two new page-hero presets |
| Store setup | Both pages added to `store-setup/pages.json` (with English handles for later); `competitor` gains `pack_units` for capsules |
| Analytics | `calculator_used` (format only) and `quiz_completed` (answers and the recommended handle, no personal data): documented in `docs/DATA-MODEL.md` and added to the custom pixel as GA4 events only (D71) |
| Newsletter form | New optional `tag` parameter |
| Tests | New `tests/tools.spec.mjs` (2 functional tests) |

## 4. Checks

| Check | Result |
|---|---|
| Theme Check | 0 errors, 11 warnings (the same `agents` ones) |
| Locales | 553 = 553 storefront keys, 220 = 220 schema keys |
| Prototype, JSON-LD | 62 pages, all valid |
| axe and keyboard | 127 passed, including both tool pages in both languages and two widths |
| Screenshots | 48 tool screenshots, no horizontal overflow; filled calculator checked visually at 1440 px |
| Functional tests | 2 passed |
| Budgets | JS 59.5 KB, CSS 13.9 KB gzip |
| Not run | Anything on a real store; Lighthouse for the new pages; the English pages visually (unpublished) |

## 5. What the tools need before launch

| Need | Source |
|---|---|
| At least 8 competitor entries (brand, product, format, price per kg or capsule price and count, list or promotional price, source URL, date read), re-read before publishing | You or an analyst; the brief's table of 31/10/2026 is a start but must be re-verified |
| Real consumer prices for the blends (presets appear when the `preco-provisorio` tag is removed) | Q1 / D8 |
| Intensity (1–5) and "ideal para" chips on at least two blends, in the same words as the quiz settings | Q7 |
| Legal check of the optional newsletter signup on the quiz | Existing consent text; confirm with the privacy policy (Q25) |
| Links to the tools from the grain collection, the method hubs and the footer | Not yet added; do it with the content set (WS2 map: 3 links in, 3 out) |

## 6. Decisions needed

- **D19: launch the calculator even without competitor entries?** It works without them (visitor's numbers only), but the comparison is the part worth citing. Recommendation: launch it once at least five verified entries exist; the quiz launches only when Q7 is answered.
- Confirm the intensity targets for "Suave / Equilibrado / Intenso" (defaults 2, 3, 4 on Sotocal's 1–5 scale).

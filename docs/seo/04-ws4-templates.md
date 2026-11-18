# WS4: product and collection templates

Date: 17/11/2026. Launch is PT-PT only (D58). Changes are in the theme and the prototype only; nothing was applied to a store. English strings were added alongside the Portuguese ones because the locale check requires parity.

## 1. Product page: prompt checklist

| Prompt item | State |
|---|---|
| H1 "Café em grão Super Milano – 1 kg" | **Not changed.** The H1 stays the product title ("Lote Super Milano") with the subtitle "Café em grão e moído" beneath. The format (grain or ground, 250 g or 1 kg) is a variant, so a variant-specific H1 would change as the shopper clicks and would no longer match the page title. The format shows in the SEO title ("... \| Café em grão e moído \| Sotocal") and can go in the Merchant feed title (decision D17) |
| Answer block (who it is for, how it tastes, which machines) | **Added.** Under the character line: "Ideal para" (from `sotocal.best_for`) and "Métodos recomendados" (from the new `sotocal.recommended_methods`). Taste is the character line plus the three tasting chips already there. Each block appears only when its field is filled |
| Formats and grind selector | Formato and Peso pills already exist. A separate grind selector waits for the client's grind options (`sotocal.grind_options`, defined in WS3, not shown yet) |
| Subscription option | Already there (radio buttons, never pre-selected). Needs the Subscriptions app and terms (Q16) |
| Roast date or "torrado na semana do envio" | **Added**, driven by `sotocal.roast_date_policy`. Blank means no freshness claim at all. Needs D10 |
| Recommended methods linked to method hubs | **Added.** Links use the metaobject page URL; until a hub page exists the method name shows as plain text |
| Mandatory food information | Already there, visible before purchase (`fic-table`). Content waits for Q3 |
| Delivery times (mainland, islands) | The line exists but shows a TBC marker; rates and times are Q6 |
| Click and collect | Already there; hidden until a café is published (D3) |
| Real reviews | **Not built.** There are no real reviews and no review app. No `AggregateRating` or `Review` schema is emitted, which is correct. Add with a review app after launch (WS12) |
| FAQ | Already there (up to 6 `sotocal.faq` entries, FAQPage schema) |
| Product, Offer, Breadcrumb, FAQ schema | Already there; `OutOfStock` is emitted per variant |
| Out of stock: keep 200, "avise-me", schema `OutOfStock` | **Added "avise-me"** (D64). Page stays live; schema was already right. Discontinued products: redirect to a successor in Shopify's URL redirects (operational, no code) |

### "Avise-me" details
A contact form with a required consent checkbox. It is not a marketing signup: the email is used once, for that notice. The block is hidden while the chosen variant is available and appears when a sold-out size or an impossible combination is chosen. The message goes to the shop inbox and names the product and size. **Interim:** someone must send the notice by hand until a back-in-stock app is chosen. A TBC marker says so while markers are on.

## 2. Collection pages

| Prompt item | State |
|---|---|
| H1 and a 60–120 word intro above the grid | Structure exists (`sotocal.intro`). I raised the field limit from 420 to 700 characters. **The current intros are 26–42 words**, below the target (section 4) |
| Short buying guide | **Added** under the grid, from `sotocal.buying_guide`. Hidden when empty |
| FAQ | **Added** under the grid from `sotocal.faq`, with FAQPage schema; first page only, so it is not repeated on page 2+ |
| Links to method hubs | **Added** from `sotocal.related_methods`. Plain text until the hub page exists |
| "Café em grão": table of blends by intensity and best method | **Added** through a new `collection.cafe` template (D65) used by `cafe`, `cafe-em-grao` and `cafe-moido`. The table already existed (intensity, "ideal para", character, €/kg); it now sits on those collections as well as on product pages |

## 3. Files changed

| File | Change |
|---|---|
| `sections/main-product.liquid` | Fit and methods block, roast-date line, "avise-me" form |
| `assets/product.js` | Shows and hides "avise-me" with the variant; keeps the message's size in sync |
| `assets/sections-product.css`, `assets/sections-collection.css` | Styles for the new blocks (Inter, no serif at small sizes, no cards or shadows) |
| `sections/main-collection.liquid` | Buying guide, method links, FAQ |
| `templates/collection.cafe.json` (new) | Collection template with the comparison table |
| `locales/pt-PT.default.json`, `locales/en.json` | 17 new keys each, in sync (462 / 462) |
| `store-setup/collections.json`, `scripts/store-setup.mjs` | `templateSuffix: cafe` on the three coffee collections and support in the script |
| `store-setup/metafield-definitions.json`, `docs/DATA-MODEL.md` | Collection intro limit 700 characters |
| `scripts/prototype/mock-data.mjs` | Fictional fixtures (labelled "exemplo") for the new fields, and a `PROTO_SOLDOUT` switch to render a sold-out product |
| `docs/DECISIONS.md` | D64 and D65 |

## 4. Checks

| Check | Result |
|---|---|
| Theme Check | 0 errors, 11 warnings (the same `agents` ones) |
| Locales | 462 = 462 storefront keys, in sync |
| Prototype build, JSON-LD | 52 pages; all valid; 12 FAQPage nodes (was 10), one per page |
| axe and keyboard tests | 107 passed. The "avise-me" block is hidden in the default product state, so axe did not scan its visible state; the markup uses labelled fields, a labelled checkbox and `role="alert"` errors |
| Render checks | Product: answer block and roast line render; the notify block is hidden when in stock. Sold-out run: notify visible, add button disabled, schema `OutOfStock` only. Collection: guide, method links (link when a page exists, text otherwise), FAQ and comparison table render |
| Not run | Screenshot suite and Lighthouse; nothing on a real store; the contact form's real submission and success state |

## 5. Gaps that need Sotocal or you

- **Collection intros.** Needed: 60–120 words each, written answer-first, using only verified facts. Proposed draft for `cafe-em-grao` (about 60 words, **for approval, not applied**): «Café em grão Sotocal, para moer na hora em casa ou na máquina automática. São os mesmos lotes que servimos nos cafés, torrados no Porto desde 1960: Super Milano, Super, Reggio e Descafeinado. Todos juntam arábicas e robustas; muda a origem, a proporção e a torra. Em cada formato mostramos o preço por kg, para poder comparar.» Equivalents for `cafe`, `cafe-moido` and the others once you approve the pattern.
- **Buying guides, FAQs, methods per collection:** from Sotocal (Q14, Q6, Q16, Q25).
- **Blend facts shown on the page:** intensity, ratio, "ideal para" (Q7).
- **Roast-date practice:** D10.

## 6. Decisions needed

- **D17: keep the H1 as the product title** (recommended), with the format in the SEO title and the feed title.
- Approve the collection intro drafting pattern above.
- Approve the interim "avise-me" (manual notices) or choose a back-in-stock app now.

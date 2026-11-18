# QA report

Date: 29/10/2026. Build tested: the theme as delivered in this repository. **Re-run the same day** after the client's Drive materials were applied (vector logo, Pantone colours, product leaflet, cup mockup, three photos); every figure below is from that re-run.

**How it was tested.** No Shopify CLI login or dev store was available, so every test ran against `/prototype`: the theme's own Liquid (layout, sections, snippets, blocks, JSON templates, locales) rendered with LiquidJS, Shopify-filter shims and mock data (`scripts/build-prototype.mjs`), served with the real `/assets` (`scripts/serve.mjs`, which also emulates the image CDN's resized WebP). Theme Check ran on the theme source itself. Raw output is in `/qa` (screenshots, axe JSON, Lighthouse HTML/JSON, Theme Check JSON, budgets, links).

## Release gates (brief §13)

| Gate | Target | Result | Status |
|---|---|---|---|
| Theme Check | 0 errors | **0 errors**, 11 warnings | ✓ (warnings: see §3) |
| axe-core | 0 serious or critical | **0 violations of any impact** in 104 runs (26 templates × pt/en × 1280/390) | ✓ |
| Lighthouse Accessibility | ≥ 95 | **100** on all 7 audited pages | ✓ |
| Lighthouse SEO | ≥ 95 | **100** on all 7 | ✓ |
| Lighthouse Best Practices | ≥ 95 | **100** on all 7 | ✓ |
| Lighthouse Performance, home | ≥ 85 | **96** (pt), **96** (en) | ✓ |
| Lighthouse Performance, other pages | ≥ 90 | product 95, collection 100, história 98, profissional 100, article 97 | ✓ |
| LCP (mobile, p75) | ≤ 2.5 s | Lab: home 2.7 s / 2.6 s (en), product 2.9 s, article 2.6 s, others 1.4–2.3 s | ✗ lab, see §2 |
| CLS | ≤ 0.05 | **0** on every audited page | ✓ |
| INP | ≤ 200 ms | Not measurable in the lab; TBT proxy 0–110 ms | Field check needed (§2) |
| First-load JS (home) | ≤ 120 KB gzip | **58.8 KB**, GSAP and ScrollTrigger included even though they now load after `load` | ✓ |
| CSS (home) | ≤ 50 KB gzip | **13.3 KB** | ✓ |
| Fonts | ≤ 2 files, ≤ 120 KB | **2 files, 71.3 KB** (DM Serif Display 400 + Inter variable, latin) | ✓ |
| Hero image | ≤ 120 KB at 750 px | Placeholder is a 6 KB SVG; the real asset A1 must meet this (ASSET-BRIEF) | Pending asset |
| Logo | Light, sharp, on cream and ink | Client vector logo as SVG: emblem 11.0 KB gzip (29 KB raw), fetched at the browser's default low image priority, pixel-identical to the source at 1200 px | ✓ |
| Reduced motion | Static, complete | Playwright: no GSAP loaded, every stream segment fully revealed with no sheen, beans roasted, «Ponto de torra» current, cup full with crema, fold 5 headline visible | ✓ |
| Keyboard | Skip link, visible focus, no focus under the sticky header, no trap in pinned sections | All three tests pass (focus traced through 25 stops; Tab leaves the pinned fold 3 and reaches the footer) | ✓ |
| Translation completeness | Every key both ways | pt-PT 445 ⇄ en 445 storefront keys; 204 ⇄ 204 schema keys; all 437 literal `'key' \| t` calls resolve | ✓ |
| JSON-LD | Parses, required fields | 52 pages, all valid. Types: Organization, WebSite (+SearchAction on home), Person, BreadcrumbList, Product, ProductGroup, CollectionPage/ItemList, BlogPosting, Recipe, FAQPage, AboutPage, ContactPage, WebPage | ✓ |
| Redirects CSV | Valid import file | 35 rows, correct header, no duplicates, chains or loops; every §3 legacy URL and both QR paths covered | ✓ |
| Horizontal overflow | None | Asserted on every one of the 624 template screenshots (360–1920 px, both languages, motion on/off): none | ✓ |
| Links | No broken internal links | 641 links checked; only routes the prototype does not render (other products, collections, policies, `/account`) — they exist on Shopify. One real bug found and fixed (§4) | ✓ |

## 1. Screenshot coverage

- `qa/screenshots/<pt|en>/<no-preference|reduce>/<360|390|768|1280|1440|1920>/`: **26 templates** each (home, product ×3 variants, collection, list-collections, cart, search, 404, password, blog, article, recipe, 12 page templates, customer login), full page except the homepage.
- Homepage scroll checkpoints at **0/25/50/75/100% of each of the 5 folds** for every viewport, language and motion setting (600 images). The hero is measured over its own height; the other folds from entering to leaving the viewport, so the stream hand-offs (cream → ink → cream → ink → cream), the bean roast, the pinned blend steps and the cup fill are all captured.
- Cookie banner at 390 and 1440, with an equal-prominence assertion on its three buttons (same size and colour).
- Total: **1,226 screenshots, 757 Playwright tests, 757 passed.**

## 2. Open items against the gates (cause and fix plan)

| Item | Cause | Fix plan |
|---|---|---|
| Lab LCP 2.6–2.9 s on home, product and article | Lighthouse's simulated slow 4G (150 ms RTT, 1.6 Mbps) plus 4× CPU: about 1 s of render-blocking CSS and the LCP image's render delay. The LCP element on home is the machine placeholder (an SVG with masks and gradients). | (1) Replace the placeholder with asset A1 as an alpha WebP/AVIF ≤ 120 KB at 750 px: Shopify serves it from the CDN with `fetchpriority=high` and a preload Link header (`image_tag preload: true`, already in the section). (2) Measure field p75 with CrUX / Shopify Web Performance after launch. (3) If still above 2.5 s, inline the hero's critical CSS (≈ 3 KB) and load `sections-home.css` asynchronously. |
| INP not measured | Needs real users or a live store. | After launch, watch Shopify's Web Performance report (INP p75). Interactions are light: optimistic add-to-cart, native `<dialog>`, passive scroll listeners, transform-only animation. |
| "No long tasks over 50 ms during scroll" not profiled frame by frame | No live store and no per-frame trace was captured. | Scroll the live homepage with the Chrome Performance panel on a mid-range Android. The design is built for it: animation uses only transform and opacity, offscreen loops pause, scroll scrub is GPU-composited. |
| Shopify-only behaviour not exercised end to end | The prototype server answers cart and predictive-search endpoints with empty payloads. | On a dev store, test: add to cart → drawer refresh (Section Rendering API), quantity change, pickup attributes, selling-plan add, predictive search, localization form, contact and customer forms, the Customer Privacy API banner, `Shopify.analytics.publish` events in Customer Events, metaobject pagination in the locator. |

## 3. Theme Check warnings (11)

All 11 come from `templates/agents.md.liquid`: "Unknown object 'agents'". Shopify added `/agents.md` and `/llms.txt` templates on 28/05/2026 (GEO.md §5), and the Theme Check docset installed here predates the `agents` object. No action needed; update `@shopify/theme-check-node` later and they should go.

## 4. Issues found during QA and fixed

| Finding | Fix |
|---|---|
| Homepage, product and A torra pages 300–1,500 px wider than the viewport below 1024 px | Two causes: `.visually-hidden` labels (absolute) escaping horizontal scrollers, and grid items placed on `1 / 6` creating implicit tracks on the single-column mobile grid. Scrollers are now containing blocks; mobile grid placement resets to `1 / -1`. |
| Comparison table overflowed on page templates | Its styles lived in the product stylesheet only; moved to `base.css`. |
| Cart page requested `/assets/[object Object]` | An assigned `blank` literal in the layout; replaced with an empty string. |
| Decorative initials failed contrast (axe) | Darker `--ink-soft`. |
| EN hero line "North of Portugal." ran to the edge at 1440 | The display size now scales with the length of the words around the machine (PT stays at full size). |
| «Orgulhosamente» clipped at 390 px; «Orgulhosamente Português» too long for its arc in the cup | Fluid cap on mobile; smaller lettering on a wider arc. |
| After the vector logo went in, the homepage Performance score swung between 82 and 94 across three runs (LCP 2.9–4.3 s on simulated slow 4G). The 49 KB SVG (served uncompressed by the prototype) shared the slow link with the render-blocking CSS. | Path data rewritten with relative commands and short number syntax (`scripts/ai-to-svg.mjs`): 49.3 → 28.9 KB raw, 17.1 → 11.0 KB gzip, identical rendering. Two runs after the fix: home 95 / 96, home-en 95 / 96. |
| Homepage Lighthouse performance 72–77 | GSAP loads after `load`; removed `html:has()` / header `:has()` selectors (style recalculation); favicon fallback (404 console error); meta description fallback (SEO 92 → 100). Result: 93 / 95. |

## 5. What this QA does not cover

- Real content and photography: prices are 1,00 € placeholders, packshots are legacy images, the machine and beans are original placeholders, and the three client photos are about 1000 px wide (rights confirmed by Sotocal; larger files are QUESTIONS-FOR-CLIENT 38 and ASSET-BRIEF). Visible `[[TBC]]` markers are expected while the pre-launch setting is on.
- Checkout, payments, taxes and shipping rates (Shopify-hosted; configure per ADMIN-SETUP).
- Screen-reader walkthroughs with NVDA/VoiceOver (automated checks only). Recommended before launch: one pass of the homepage, product page, cart drawer and lead form.
- hreflang and `x-default` are generated by Shopify; verify on the live store (SEO.md).

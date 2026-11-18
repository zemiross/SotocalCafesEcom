# Sotocal theme: build plan

Status: v2 (v1 reviewed against brief §5.8; the changes are listed at the end in "§5.8 review").
Source of truth: the Sotocal build brief (§0–§16). Decisions taken without the client are in `DECISIONS.md`.

## 1. Architecture in one paragraph

A Shopify Online Store 2.0 theme with JSON templates, section groups for header and footer, a handful of theme blocks for generic content sections, and locale files for every string. The homepage is five sections (one per fold) that share one snippet, `stream`, which renders that fold's segment of the coffee stream. Motion is GSAP 3.13 + ScrollTrigger on native scroll, loaded by `theme.js` only when a `[data-motion]` section exists and the visitor has not asked for reduced motion. Everything renders complete and static without JavaScript; JS only adds motion and AJAX. A Node script renders the same Liquid files with LiquidJS and mock data into `/prototype/`, so the Playwright, axe and Lighthouse runs test the real theme markup, CSS and JS rather than a copy.

## 2. Token system

All tokens live in `assets/base.css` (`:root`). They are not exposed as theme-editor colour or font pickers (brief §0.6).

### 2.1 Colour (locked)

| Token | Value | Notes |
|---|---|---|
| `--ink` | #210000 | **PANTONE 1545 C** (brand colour 1); ink folds; text on cream 17.24:1 |
| `--ink-deep` | #0C0000 | deepest shadow, stream core on cream |
| `--oxblood` | #4A1712 | highlights on dark; stream rim on ink |
| `--ink-soft` | #4A2A22 | secondary text on cream 11.16:1 |
| `--cream` | #FCEFCC | **PANTONE 466 C** (brand colour 2); cream folds; all body text on ink |
| `--cream-hi` | #FFF7DE | specular highlights |
| `--sand` | #F6E3B4 | planes behind packshots (never accent text on it) |
| `--sand-deep` | #EBD4A0 | hairlines on cream |
| `--accent` | #AE5041 | primary CTA fill, links on cream; on ink only ≥ 24 px or ≥ 18.66 px bold, and non-text UI |
| `--espresso-1` / `--espresso-2` | #3A1A0B / #120401 | liquid gradients |

Derived tints only with `color-mix(in oklab, <token> n%, <token|transparent>)`, e.g. `--contact-shadow: color-mix(in oklab, var(--ink) 18%, transparent)`.

### 2.2 Semantic tokens per fold (`data-theme`)

| | `cream` | `ink` |
|---|---|---|
| `--bg` | `--cream` | `--ink` |
| `--fg` | `--ink` | `--cream` |
| `--fg-muted` | `--ink-soft` | `color-mix(--cream 80%, --ink)` (≈ 11:1) |
| `--line` | `--sand-deep` | `color-mix(--cream 22%, --ink)` |
| `--focus` | `--ink` | `--cream` |
| `--link` | `--accent` | `--cream` (underlined) |
| stream | dark core + cream specular | backlit amber + glow |

### 2.3 Type

- `--font-display`: "DM Serif Display", metric-matched fallback "DM Serif Fallback" (Times New Roman with `size-adjust`, `ascent-override`, `descent-override` computed from Capsize metrics), serif. 400 roman only on the homepage; italic file exists for editorial quotes on article pages and is never preloaded. `font-synthesis: none` globally.
- `--font-ui`: "Inter" variable (wght 100–900), fallback "Inter Fallback" (Arial, computed overrides), sans-serif. `font-variant-numeric: tabular-nums` on `.price`, `.unit-price`, quantities, the free-shipping amount.
- Scale: `--fs-hero: clamp(4.25rem, 11vw, 11.5rem)` (lh 0.9, ls −0.02em); `--fs-display: clamp(3rem, 7vw, 6.5rem)` (lh 0.95); `--fs-h2: clamp(2.25rem, 4.2vw, 4rem)` (lh 1.02); `--fs-h3: clamp(1.5rem, 2.2vw, 2rem)` (lh 1.15); `--fs-lead: 1.25rem` (lh 1.5); `--fs-body: 1.0625rem` (lh 1.6; never below 16 px); `--fs-small: .875rem` (lh 1.45).
- Measure: `--measure: 64ch` (60–68).
- DM Serif only at ≥ 28 px. Below that, headings use Inter 600.
- Sentence case everywhere; no tracked all-caps, no middle-dot strings, no "→" in buttons, no single-word accent colouring.

### 2.4 Space, grid, radii, depth

- Spacing scale `--s-1…--s-11`: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192. Section padding `--section-pad: clamp(96px, 14vh, 192px)`.
- Grid: 12 columns, container 1360 px, gutter 24 px (16 px below 600). The spine is the gutter between columns 6 and 7, which equals the viewport centre on desktop because the container is centred and symmetrical. Left content `grid-column: 1 / 6`, right content `8 / 13`.
- Below 1024: the spine becomes the rail, stream centre at x = 20 px; content starts at 48 px (`padding-inline-start: 48px`), right gutter 16 px.
- Breakpoints: 360, 600, 1024, 1440 (`min-width` queries).
- Radii: `--r-pill: 999px` (buttons, chips), `--r-input: 6px`, `--r-none: 0` (product imagery stands on planes, no cards).
- Depth: `--contact-shadow` only, as a blurred ellipse under cut-outs. No UI box-shadows. Header blur uses `backdrop-filter`, not a shadow.
- Z-index: `--z-stream: 2` (above images, below text layer `3`), `--z-header: 40`, `--z-drawer: 60`, `--z-consent: 70`.

### 2.5 Motion

- `--dur-micro 150ms`, `--dur-ui 240ms`, `--dur-reveal 480ms`, `--dur-orch 900ms`.
- `--ease-out: cubic-bezier(.25,1,.5,1)`, `--ease-in-out: cubic-bezier(.65,0,.35,1)`; falling liquid `power2.in`; scrub smoothing `0.8`.
- What moves: the stream (and its sheen), bean roasting (fold 2), blend switching (fold 3), cup filling (fold 5), UI feedback (drawers, accordions, add-to-cart). Nothing else. Only `transform` and `opacity` animate (the SVG ribbon uses `stroke-dashoffset`, which is a compositor-cheap paint on a tiny element; logged in DECISIONS).
- `gsap.matchMedia()` contexts: `desktop (min-width:1024px)`, `mobile (max-width:1023.98px)`, each gated by `(prefers-reduced-motion: no-preference)`. Offscreen loops (sheen, ripples) pause through IntersectionObserver by toggling `.is-offscreen` (CSS `animation-play-state: paused`).

## 3. Signature: stream API

```
{% render 'stream', theme: section.settings.theme, variant: 'default' %}   default | hero | cup
```

Markup per fold: `.stream[data-stream][data-variant]` (absolute, `overflow:hidden`, full fold height, centred on the spine or on the rail) > `.stream__liquid` (height `calc(100% + 48px)`, the extra 48 px being the masked leading edge that ends up clipped below the fold when the segment is complete) > `.stream__sheen` (pseudo-element, 2× height, `translateY` loop 2.4 s linear).

`assets/stream.js` registers one tween per segment: `yPercent: -100 → 0`, `ease: none`, ScrollTrigger `{ trigger: segment, start: 'top 62%', end: 'bottom 62%', scrub: 0.8 }`. The leading edge therefore sits ≈ 62% down the viewport throughout the page.

- Hero: segment starts at the spout (CSS var `--spout-y`, set from the machine image box: spout tip at 50% x, 58% y of the image). The SVG neck tapers 10 → 6 px over 160 px with a slight wobble. Intro: after `load` + `requestIdleCallback`, a 1.1 s `power2.in` tween from fully retracted to the current ScrollTrigger progress; then the scrubbed tween is attached with `immediateRender: false`.
- Rail (< 1024): segments sit at x = 20 px. The hero holds the bend: an SVG ribbon (cubic bézier, `preserveAspectRatio="none"` + `vector-effect: non-scaling-stroke`) from the centred spout to the rail. The cup fold holds the return bend from the rail to the cup centre, then 60 px vertical.
- Cup: `cup.js` owns fold 5's pinned timeline (stream reaches the surface → ripples → fill 0 → 100% → crema → tail drop → ripples settle → headline/CTA reveal → arrow draws).
- Reduced motion / no JS: every `.stream__liquid` at 0 (fully revealed), no sheen, no ripples; beans roasted; first blend active with buttons switching instantly; cup full with crema; headline and CTA visible.
- Theming: segments read the fold's `data-theme`, so lighting switches exactly at fold boundaries.

## 4. File tree (built)

```
assets/
  base.css                 tokens, reset, type, grid, buttons, forms, header, footer, drawers, consent, utilities
  sections-home.css        folds 1–5, stream, cup, beans, blends
  sections-product.css     product page, quick-add popover, blend comparison
  sections-collection.css  collection, search, list-collections
  sections-pages.css       pages, blog, article, locator, profissional, 404, password
  theme.js                 boot: motion loader, header theme, sticky header, mobile drawer, announcement, accordions, lazy section scripts
  stream.js beans.js blends.js cup.js sequence.js
  cart-drawer.js product.js collection.js search.js consent.js locator.js lead-form.js newsletter.js
  gsap.min.js ScrollTrigger.min.js leaflet.js leaflet.css (vendored, pinned)
  dm-serif-display-400.woff2 dm-serif-display-400-italic.woff2 inter-var.woff2
  greca.svg (hero moka pot; machine-placeholder.svg kept, unused) bean-*.webp lote-*.webp placeholders; logo-sotocal(-emblem).svg + .png from the client's vector logo; photo-*.webp client photos
blocks/        heading.liquid, text.liquid, button.liquid, image.liquid, quote.liquid
config/        settings_schema.json, settings_data.json
layout/        theme.liquid, password.liquid
locales/       pt-PT.default.json, en.json, pt-PT.default.schema.json, en.schema.json
sections/      header-group.json, footer-group.json, announcement-bar, header, footer, newsletter, cart-drawer,
               home-hero, home-roast, home-blends, home-home-business, home-cup,
               main-product, product-faq, product-pairings, blend-compare,
               main-collection, main-list-collections, main-search, main-cart,
               main-page, page-hero, content (theme blocks), timeline, people, values, awards,
               profissional-benefits, process-steps, lead-form, faq, testimonials, locator, fact-sheet, contact,
               pickup-explainer, subscription-explainer, gift-box, qr-landing,
               main-blog, main-article, related-products, main-404, main-password, main-customer, predictive-search
snippets/      stream, icon-sprite, icon, logo, price, unit-price, product-tile, quick-add, buy-buttons, variant-picker,
               selling-plans, fic-table, chips, tbc, years, meta-tags, structured-data, breadcrumbs, fonts,
               responsive-image, language-switch, social-links, payment-icons, faq-list, newsletter-form,
               cookie-banner, biscuit-svg, cup-svg, machine, bean, ribbon, pagination, mega-menu
templates/     index, product(.spice|.substitute|.simple|.bundle), collection, list-collections, cart, search, 404, password,
               page(.historia|.a-torra|.profissional|.locator|.facts|.contact|.faq|.pickup|.subscription|.gift-box|.accessibility|.qr),
               blog, article, article.recipe, gift_card.liquid, robots.txt.liquid, customers/*
docs/ reference/ prototype/ tests/ scripts/ store-setup/   (see brief §16)
CLAUDE.md README.md .theme-check.yml package.json playwright.config.mjs
```

### As built (generated from the repository)

- `sections/`: announcement-bar.liquid, benefits.liquid, blend-compare.liquid, cart-drawer.liquid, contact.liquid, content.liquid, fact-sheet.liquid, faq.liquid, featured-product.liquid, footer-group.json, footer.liquid, gift-box-contents.liquid, header-group.json, header.liquid, home-audiences.liquid, home-blends.liquid, home-cup.liquid, home-hero.liquid, home-roast.liquid, lead-form.liquid, locator.liquid, main-404.liquid, main-article.liquid, main-blog.liquid, main-cart.liquid, main-collection.liquid, main-customer.liquid, main-list-collections.liquid, main-page.liquid, main-password.liquid, main-product.liquid, main-search.liquid, newsletter.liquid, page-hero.liquid, people.liquid, product-faq.liquid, product-pairings.liquid, qr-landing.liquid, steps.liquid, testimonials.liquid, timeline.liquid, values-awards.liquid
- `snippets/`: article-meta.liquid, biscuit-svg.liquid, breadcrumbs.liquid, cookie-banner.liquid, cup-svg.liquid, faq-list.liquid, fic-table.liquid, fonts.liquid, icon-sprite.liquid, icon.liquid, language-switch.liquid, logo.liquid, meta-tags.liquid, newsletter-form.liquid, pagination.liquid, payment-icons.liquid, price.liquid, product-tile.liquid, quick-add.liquid, social-links.liquid, stream.liquid, structured-data-article.liquid, structured-data-product.liquid, structured-data.liquid, tbc.liquid, unit-price.liquid, years.liquid
- `blocks/`: button.liquid, heading.liquid, image.liquid, quote.liquid, text.liquid
- `templates/`: 404.json, agents.md.liquid, article.json, article.recipe.json, blog.json, cart.json, collection.json, gift_card.liquid, index.json, list-collections.json, page.a-torra.json, page.accessibility.json, page.contact.json, page.facts.json, page.faq.json, page.gift-box.json, page.historia.json, page.json, page.locator.json, page.pickup.json, page.profissional.json, page.qr.json, page.subscription.json, password.json, product.bundle.json, product.json, product.simple.json, product.spice.json, product.substitute.json, robots.txt.liquid, search.json; `templates/customers/`: account.json, login.json, register.json
- `assets/`: ScrollTrigger.min.js, award-pme-excelencia-2001.webp, award-pme-lider-2011.webp, base.css, bean-1-green-far.webp, bean-1-green.webp, bean-1-roasted-far.webp, bean-1-roasted.webp, bean-2-green-far.webp, bean-2-green.webp, bean-2-roasted-far.webp, bean-2-roasted.webp, bean-3-green-far.webp, bean-3-green.webp, bean-3-roasted-far.webp, bean-3-roasted.webp, bean-4-green.webp, bean-4-roasted.webp, bean-5-green.webp, bean-5-roasted.webp, bean-6-green.webp, bean-6-roasted.webp, beans.js, blends.js, cart-drawer.js, cofunding-projeto.png, collection.js, consent.js, cup.js, dm-serif-display-400-italic.woff2, dm-serif-display-400.woff2, gsap.min.js, inter-var.woff2, lead-form.js, leaflet.css, leaflet.js, livro-reclamacoes.png, locator.js, logo-sotocal.png, lote-descafeinado.webp, lote-reggio.webp, lote-super-milano.webp, lote-super.webp, machine-placeholder.svg, og-guide.png, og-home.png, og-shop.png, product.js, search.js, sections-collection.css, sections-home.css, sections-pages.css, sections-product.css, sequence.js, stream.js, theme.js
- `scripts/`: build-cup.mjs, build-prototype.mjs, check-budgets.mjs, check-jsonld.mjs, check-locales.mjs, check-redirects.mjs, harvest.mjs, lighthouse.mjs, make-placeholders.mjs, serve.mjs, store-setup.mjs, theme-check.mjs, vendor.mjs

Names differ from the v1 sketch above where a section was merged or renamed during the build: `home-home-business` → `home-audiences`, `values` + `awards` → `values-awards`, `profissional-benefits` → `benefits`, `process-steps` → `steps`, `gift-box` → `gift-box-contents` + `featured-product`, `cup-svg` / `machine` / `bean` snippets → generated `cup-svg`, `assets/machine-placeholder.svg` and `bean-*.webp`.

## 5. Wireframes

Notation: `|` at centre = spine/stream; `!` at left = rail (< 1024).

### 5.1 Header (all templates)

```
Desktop ≥1024 (transparent over hero, then --bg 92% + blur after 80 px; theme follows the fold below)
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Sotocal]   Loja ▾  Os lotes  A torra  A Sotocal ▾  Guia do café  Profissional   PT|EN  ⌕  ◯  🛒2 │
└──────────────────────────────────────────────────────────────────────────────┘
Loja mega menu (panel, --bg, hairline top):
│ Café            Especiarias      Sucedâneos     Complementares   Conservas   Presentes │
│ Em grão/Moído   Piri-piri…       Cevada…        Açúcar…                       Despensa do Norte │

Mobile <1024
┌───────────────────────────────┐
│ ☰   [Sotocal]          ⌕  🛒2 │
└───────────────────────────────┘
Drawer (full-screen, ink):  Loja / Os lotes / A torra / A Sotocal / Guia do café   (DM Serif, 40 px)
                            [ Profissional: pedir contacto ]  (outline)
                            PT | EN      +351 226 167 020 (Chamada para a rede fixa nacional)   email
```

### 5.2 Homepage

```
FOLD 1  cream ─ hero                         FOLD 1 mobile
┌──────────────────────────────────────┐    ┌──────────────────┐
│            O café que                │    │    ┌────────┐    │
│      vem do┌──────────┐rte.          │    │    │MACHINE │    │
│            │ MACHINE  │  (in front   │    │    └───┬────┘    │
│            │  alpha   │  of line 2)  │    │ ╭──────╯ ribbon  │
│            └────┬─────┘              │    │ ! O café         │
│                 |  neck 10→6 px      │    │ ! que vem        │
│ Torrado no Porto|        [Comprar café]   │ ! do Norte.      │
│ desde 1960. Os  |   Envio para Portugal   │ ! Torrado no…    │
│ lotes…          |   continental, Açores…  │ ! [Comprar café] │ (full width)
│ Tem um café ou restaurante?          │    │ ! Tem um café…?  │
└─────────────────|────────────────────┘    └─!────────────────┘

FOLD 2  ink + grain ─ a torra
┌─────────────────|────────────────────┐
│  ○  ●   ○       |   Tudo acontece    │   beans: 9 (5 mobile), green→roasted at 0.55,
│    ●  ○  ●      |   na torra.        │   ×1.00→1.18, ±12°, parallax by depth,
│  ○   ●  ○       |   Na torra, o grão │   ember glow behind
│ (ember glow)    |   cresce…          │
│                 |   1 Grão verde     │   stage indicator = <ol>, aria-current="step"
│                 |   2 Secagem        │
│                 |   3 Primeiro crack │
│                 |   4 Ponto de torra │
│                 |   «Queremos que…»  │   A nossa missão
│                 |   Conhecer a torra │   (text link style, not accent fill)
└─────────────────|────────────────────┘

FOLD 3  cream ─ quatro lotes (desktop: pinned 4 × 70vh)
┌─────────────────|────────────────────┐
│ Quatro lotes.   |                    │
│ Um para cada    |    ┌──────────┐    │
│ chávena.        |    │ PACKSHOT │    │  crossfade + 6° settle + 24 px travel
│ Todos os lotes… |    │ on sand  │    │
│ ─────────────── |    └──────────┘    │
│ Super Milano    |    ~contact shadow~│
│ Intenso e persistente…               │
│ (Intenso)(Aroma suave)(Creme…)       │
│ Ideal para …    |                    │
│ Desde x,xx €   x,xx €/kg   IVA incluído │
│ [Adicionar ao carrinho] Ver lote     │
│ [Super Milano][Super][Reggio][Descaf.]  progress buttons (aria-pressed)
│ Ver todos os lotes                   │
└─────────────────|────────────────────┘
Mobile: H2/intro, then horizontal scroll-snap row of 84vw cards (packshot above text), buttons below; rail on the left.

FOLD 4  ink ─ para casa | para o seu negócio
┌─────────────────|────────────────────┐
│ Para casa       |  Para o seu negócio│  ← same baseline (shared grid row)
│ Os mesmos lotes…|  Há 66 anos ao lado…│
│ – Subscrição…   |  – Equipamento…    │
│ – Levante…      |  – Assistência…    │
│ – Envio…        |  – Formação…       │
│                 |  – Material…       │
│ [Comprar café]  |  (Pedir contacto comercial) outline │
└─────────────────|────────────────────┘

FOLD 5  cream ─ a chávena (pinned)
┌──────────────────|───────────────────┐
│                  |                   │
│   Orgulhosamente | português.        │  H2 behind the cup (depth sandwich), revealed last
│              ╭───┴───╮               │
│              │  CUP  │──handle       │  fill 0→100%, ripples, crema, tail drop
│              ╰───────╯               │
│          ═══ saucer ═══    ↘ arrow   │
│  Uma torrefação de família…  [Comprar café]
└──────────────────────────────────────┘
NEWSLETTER strip (cream, hairline top) → FOOTER (ink)
```

### 5.3 Collection

```
┌───────────────────────────────────────────────────────┐
│ Início / Loja / Café em grão                           │  breadcrumbs
│ Café em grão                       (H1, DM Serif)      │
│ Intro ≤ 60 words (metafield sotocal.intro)             │
│ ─────────────────────────────────────────────────────  │
│ [Formato ▾][Peso ▾][Lote ▾][Tipo ▾]   12 produtos  Ordenar [▾] │
│                                                        │
│  ▓▓▓▓▓▓▓▓    ▓▓▓▓▓▓▓▓    ▓▓▓▓▓▓▓▓    ▓▓▓▓▓▓▓▓          │ packshot on sand plane
│  Super Milano Super       Reggio      Descafeinado      │
│  Intenso e…   Forte e…    Torra…      Todo o sabor…     │
│  desde 9,99 € (19,98 €/kg)  IVA incluído  [+ Adicionar] │ quick add (popover if >1 variant)
│  … 24 per page … pagination                            │
│ ═════════════ ink band ═════════════                   │
│  SEO text (collection.description), 2 columns ≤ 64ch    │
└───────────────────────────────────────────────────────┘
Mobile: 2-up grid ≥ 360 (1-up at < 360 is never hit), filters in a <details> drawer.
```

### 5.4 Product (coffee)

```
┌──────────────────────────────┬────────────────────────────┐
│ GALLERY (sticky)             │ Lote Super Milano (H1)     │
│  ▓▓ packshot on sand ▓▓      │ Café em grão e moído       │
│  [thumb][thumb][thumb][thumb]│ Intenso e persistente…     │
│  packshot / back / macro /   │ Intensidade ●●●●○  (TBC)   │
│  in use                      │ (Intenso)(Aroma suave)(…)  │
│                              │ Formato  (Grão)(Moído)      │
│                              │ Peso     (250 g)(1 kg)      │
│                              │ ○ Compra única              │
│                              │ ○ Subscrição a cada [2|4|6] semanas · poupa x% │
│                              │ 12,50 €  IVA incluído       │
│                              │ 50,00 €/kg                  │
│                              │ [–] 1 [+]  [Adicionar ao carrinho] │
│                              │ Entrega: [[TBC]]  Levantar num café Sotocal │
├──────────────────────────────┴────────────────────────────┤
│ ▸ Descrição  ▸ Origens e torra  ▸ Como preparar            │
│ ▸ Informação alimentar  ▸ Envios e devoluções              │
│ ════ ink band: Perguntas (3, FAQPage) ════                 │
│ Combina com: [tile][tile][tile]                            │
│ Comparar lotes: table (Lote | Intensidade | Carácter | Ideal para | €/kg) │
└────────────────────────────────────────────────────────────┘
Mobile: gallery swipe row, buy box, sticky bar [price + Adicionar] appears once the main button scrolls out.
```

### 5.5 Cart drawer

```
┌──────────────── Carrinho (2) ✕ ┐
│ Faltam 7,50 € para envio grátis│
│ ███████████░░░░░ (goal gradient)│
│ ─────────────────────────────── │
│ ▓ Super Milano 1 kg Grão        │
│   [–] 1 [+]   24,00 €  Remover  │
│ ─────────────────────────────── │
│ ☐ Levantar num café Sotocal     │ toggle (switch)
│   [Pesquisar café…        ]     │ searchable list (radio)
│   ○ Café X, Porto               │
│ ─────────────────────────────── │
│ Também pode gostar: Despensa…[+]│ upsell (one item)
│ Subtotal 24,00 €  IVA incluído  │
│ [ Finalizar compra ]            │
└─────────────────────────────────┘
```

### 5.6 Pages

```
História (/pages/historia)           Profissional (/pages/profissional)
┌──────────────────────────┐        ┌──────────────────────────────┐
│ ink hero: Desde 1960, no │        │ ink hero: Café para o seu    │
│ Porto. (H1)  intro       │        │ negócio (H1) [Pedir contacto]│
│ TIMELINE (ink, grain)    │        │ Vantagens: 2-col list, hair- │
│ 1960 ─ A raia            │        │ lines, 5 items (Miller)      │
│ 1964–65 ─ Sucedâneos     │        │ Para abrir um estabelecimento│
│ 1970s ─ Açores           │        │ Equipamento e assistência    │
│ 2001 · 2011 ─ prémios    │        │ Como funciona: 1 2 3 4       │
│ 2026 ─ loja online       │        │ Formulário #contacto         │
│ PEOPLE: José | Maria José│        │ Perguntas (B2B FAQ)          │
│ MISSÃO quote (DM Serif)  │        │ (Testemunhos: hidden)        │
│ VALORES list             │        └──────────────────────────────┘
│ Prémios (logos)          │
└──────────────────────────┘
Onde beber Sotocal: H1, search input, [Mostrar mapa], list grouped district → city (cards are rows), "Levantar aqui".
Sobre a Sotocal: H1, entity statements as plain sentences, facts table, Q&A (answer-first), sources, "Atualizado em".
Contactos: NAP block, map link, contact form, hours [[TBC]].  FAQ: grouped <details>.
A torra / Arábica e robusta / Café e saúde / Subscrição / Levantar no café / Despensa do Norte: page-hero + content blocks.
```

### 5.7 Blog, article, system

```
Guia do café (blog)                     Article
┌──────────────────────────┐            ┌──────────────────────────┐
│ H1 + intro               │            │ Breadcrumbs              │
│ ▓▓▓▓ lead article (large)│            │ H1 (DM Serif)            │
│ ─ row: title, excerpt ▓  │            │ Por Maria José Barbosa   │
│ ─ row: title, excerpt ▓  │            │ 12/10/2026, 6 min        │
│ pagination               │            └──────────────────────────┘            │ body ≤ 64ch              │
                                        │ Recipe: ingredients/steps│
404: empty cup SVG + "Esta chávena está vazia." + search + links. │ Related products (2–3)   │
Password: ink, "Estamos a torrar. Abrimos em breve." + newsletter └──────────────────────────┘
```

### 5.8 Footer and consent

```
Newsletter strip (cream): "Receba novidades e receitas" [email] [Subscrever]
┌ ink footer ───────────────────────────────────────────────────────────┐
│ [Sotocal]  O café que vem do Norte.                                   │
│ Loja        A Sotocal       Ajuda              Contactos               │
│ Café        História        Perguntas freq.    Rua Eng. Ferreira Dias, 398 │
│ Especiarias Onde beber      Envios             4100-246 Porto          │
│ …           Profissional    Políticas…         +351 226 167 020        │
│                                                (Chamada para a rede fixa nacional) │
│ ───────────────────────────────────────────────────────────────────── │
│ Sotocal – Sociedade Torrefactora De Cafés de Angola, Lda. NIF 500 275 068          │
│ [Livro de Reclamações] RAL [[TBC]]  Declaração de acessibilidade      │
│ Preferências de cookies   payment icons   social   [co-funding TBC]   │
└───────────────────────────────────────────────────────────────────────┘
Cookie banner (bottom-left card on desktop, bottom sheet on mobile):
  [biscuit SVG]  Uma bolacha com o seu café?  body…  [Aceitar todos] [Rejeitar] [Escolher]  (equal weight)
```

## 6. JavaScript plan and budgets

| File | Loads on | gzip target |
|---|---|---|
| theme.js | all | ≤ 9 KB |
| cart-drawer.js | all (defer) | ≤ 5 KB |
| consent.js | all, after idle | ≤ 3 KB |
| search.js | on first search open (dynamic) | ≤ 2 KB |
| gsap + ScrollTrigger | motion sections only, never with reduced motion | ≈ 45 KB |
| stream/beans/blends/cup/sequence | homepage | ≤ 8 KB together |
| product.js, collection.js, locator.js, lead-form.js | own templates | ≤ 4 KB each |
| leaflet.js | after "Mostrar mapa" click | n/a (not first load) |

Homepage first-load JS target ≈ 75 KB gzip (budget 120). CSS target ≈ 22 KB gzip (budget 50). Fonts: 2 preloaded files (DM Serif Display 400 latin + Inter var latin) ≈ 85 KB (budget 120).

## 7. Laws of UX map (brief §5.7 + the 16-law checklist of the agency skill)

Brief laws are implemented as in §5.7. The agency checklist adds: Prägnanz (one idea per fold, one CTA style per fold), Similarity (all chips, all tiles, all accordions share one style), Zeigarnik (roast stages and the HoReCa process are visible numbered sequences; the free-shipping bar shows what is left), Postel (phone input accepts spaces, +351 and dots; postcode accepts 4100246 or 4100-246), Connectedness (the stream physically joins the folds; timeline rule joins years).

## 8. §5.8 review: what changed and why

v1 of this plan was reviewed line by line against the anti-generic checklist. Changes:

1. **Interior pages were all cream in v1.** Cream + serif + terracotta everywhere is the stock "AI" look. v2 gives ink real weight outside the homepage: História's hero and timeline, Profissional's hero, the product page FAQ band, the collection SEO band, the password page, the mobile menu and the footer are ink with grain. Each interior template now has at least one ink surface.
2. **Hero "components" (badge, stats row, scroll cue) were added in v1** because the agency UI/UX skill asks for them. Removed: the brief demands restraint, Hick (≤ 2 CTAs) and no invented numbers. The hero's only components are H1, machine, sub, one CTA, one text link, one shipping note.
3. **Product tiles were rounded cards with a shadow in v1.** Replaced by packshots standing on a `--sand` plane with a contact shadow, text below, no container, no radius (§5.3, §5.8).
4. **Section openers had small "kicker" labels in v1** (e.g. a tracked label above "Quatro lotes."). Removed everywhere; headings carry meaning on their own.
5. **Fold 4 used two cards in v1.** Now plain text columns on ink either side of the glowing stream, with headings on a shared baseline. The outline CTA on the right keeps Von Restorff for "Comprar café".
6. **Profissional benefits were a 3 × 2 icon-card grid in v1.** Now a two-column list with hairlines, 5 items (Miller), and the numbered process kept only for the real 4-step sequence.
7. **The landing-pattern agent suggested a testimonials carousel and social proof before the CTA.** Kept the testimonials section in the template but disabled and empty: there are no supplied testimonials and the brief forbids invented ones.
8. **v1 had a soft radial gradient wash behind the hero.** Replaced with a flat cream canvas, a `--sand` plane and a real contact shadow; texture comes from the machine's steel and (later) the photography, not from gradients.
9. **Blog listing was an identical 3-column card grid in v1.** Now one lead article and editorial text rows with small square images.
10. **Microcopy in v1 had generic lines** ("Descubra os nossos produtos", "Saiba mais"). Rewritten from the user's side and specific: "Comprar café", "Ver lote", "Pedir contacto comercial", "Faltam 7,50 € para o envio grátis".
11. **Numbered markers:** v1 numbered the "Para casa" points. Removed; numbers remain only on roast stages, the timeline and the HoReCa process.
12. **FAQ accordions were boxed pills with chevrons in v1.** Now hairline-separated `<details>` with a drawn plus/minus line icon (1.5 px, rounded caps).
13. **404 was a generic message in v1.** Now the empty Sotocal cup from fold 5, rendered statically, so the signature carries into the error state without new motion.

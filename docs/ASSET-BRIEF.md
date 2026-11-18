# Asset production brief

The theme ships with placeholders: an SVG machine, bean images rendered from SVG, legacy packshots, an SVG cup and an SVG biscuit. Each asset below replaces a placeholder **without code changes**: the client uploads it to Shopify (Content → Files, or the section's image picker) and picks it in the theme editor.

**Global rules:**
- Warm directional light from the upper left; shallow depth of field; real materials.
- No stock clichés (laptops, latte-art selfies).
- **Never AI-generate real people.**
- No logos or brand marks on the machine.
- Log every delivered asset in `docs/ASSET-LICENSES.md`: source, licence, author, date.

## 1. Assets (brief §15)

| ID | Asset | Spec | Prompt or brief |
|---|---|---|---|
| A1 | Hero machine | Alpha WebP/AVIF 2400 × 3000 master + 1200 mobile; separate soft-shadow layer; spout tip at **exact horizontal centre**, ~58% from the top | "Studio product photo of a contemporary single-group Italian-style espresso machine, polished stainless steel with matte black side panels, round group head, single-spout portafilter, no logos, no text, no brand marks, front three-quarter view from slightly below, warm soft key light from upper left, subtle rim light, drip tray out of frame, isolated on transparent background, photorealistic" |
| A2 | Beans | 6 unique beans × 2 states (green, medium-dark with oily sheen), the **same pose and scale** per pair, 800 × 800 alpha; pre-blurred far variants | "Macro photo of a single [green / medium-dark roasted] coffee bean, isolated on transparent, soft top light, three angles" |
| A3 | Blend packshots | 4 blends × (1 kg, 250 g), front 3/4 view, consistent light, alpha | Real photos preferred; legacy PNGs as placeholders |
| A4 | Cup | Vector from the mockup | **Done** (mockup received 29/10/2026, `reference/cup/`) |
| A5 | Cookie | 600 × 600 alpha | "Top-down photo of a round Portuguese Maria-style biscuit, scalloped edge, docking holes, no brand embossing, one third dipped in espresso with a glossy line, transparent background" |
| A6 | People and roastery | Real photography only | Portraits of José and Maria José Barbosa; roaster drum, cooling tray, green-coffee sacks, warehouse, delivery van, team |
| A7 | Gift box | "Despensa do Norte" packshot | `[[TBC]]` |
| A8 | OG and favicon | OG templates; favicon and apple-touch icon from the logo | Favicon, apple-touch icon and three OG placeholders **done** from the vector logo; per-page-type templates still to design |

## 2. Delivery specs

File names are lowercase, hyphenated and descriptive in pt-PT (SEO.md §6), because Shopify keeps the file name in the CDN URL. "Setting" is the theme-editor field that consumes the file. Setting IDs are the theme's; if one changes, update this table.

| ID | Deliver as | Size / weight | Upload to | Consumed by | Placeholder now |
|---|---|---|---|---|---|
| A1 | `maquina-expresso-sotocal.webp` (+ `.avif` optional) master 2400 × 3000, alpha. Mobile crop `maquina-expresso-sotocal-mobile.webp` 1200 × 1500. Shadow layer `maquina-expresso-sombra.webp` 2400 × 3000, alpha, same canvas so it aligns. | Shopify resizes the master. The **750 px-wide rendition must be ≤ 120 KB** (brief §13): keep the background fully transparent with no stray pixels, and export at quality ~80. | Hero section image pickers | Hero section: machine image, mobile machine image, shadow image | `assets/greca.svg` (moka pot, D56). An uploaded cut-out replaces it, centred on its spout; it does not tilt. |
| A1 geometry | The **spout tip must sit at exactly x = 50 % of the canvas** and about 58 % from the top. The theme sets `--spout-y` from these percentages, and the stream starts at that point. Mark the spout tip on a separate guide layer in the source file and send its pixel coordinates `[[TBC]]`. | — | — | — | — |
| A2 | 6 pairs: `grao-cafe-verde-1.webp` … `-6.webp` and `grao-cafe-torrado-1.webp` … `-6.webp`, 800 × 800 alpha. Each pair has the same pose, scale and canvas position, so the crossfade does not jump. Far variants `…-longe.webp`, **pre-blurred** (Gaussian ~6 px at 800 px), because the theme never blurs in CSS. | ≤ 40 KB each | Roast section image pickers (per bean block) | Roast section (fold 2): green image, roasted image, far toggle per bean | `assets/bean-{1..6}-{green,roasted}[-far].webp` |
| A3 | `lote-super-milano-cafe-em-grao-1kg.webp`, `lote-super-milano-cafe-moido-250g.webp`, and so on, for 4 blends × 2 sizes × (beans/ground if the packs differ). 2000 × 2000, alpha, front 3/4 view, the same light and camera height for every pack. | Shopify resizes | Product media (first image = packshot) | Product gallery, collection tiles, homepage fold 3 (uses the product's featured image) | `assets/lote-*.webp` (from legacy PNGs) |
| A3 gallery | Per coffee product, also: back of the bag showing the food information, a bean macro, and "in use" (moka or bean-to-cup machine at home). 2000 × 2000. | Shopify resizes | Product media | Product gallery (brief §8) | none |
| A4 | Vector only. Done: `snippets/cup-svg.liquid` follows the client's mockup in `/reference/cup/` (DECISIONS D47). | — | Code | Fold 5 | — |
| A5 | `bolacha-maria-cafe.webp` 600 × 600, alpha | ≤ 40 KB | Theme setting (cookie banner image) | Cookie banner | Inline SVG biscuit |
| A6 | `jose-barbosa-sotocal.jpg`, `maria-jose-barbosa-sotocal.jpg` (portraits 1600 × 2000, real photos). Roastery: `torrador-sotocal-porto.jpg`, `tabuleiro-arrefecimento.jpg`, `sacas-cafe-verde.jpg`, `armazem-sotocal.jpg`, `carrinha-distribuicao-sotocal.jpg`, `equipa-sotocal.jpg` (2400 px long side). | Shopify resizes | `person` metaobject `photo`; História, A torra and Profissional section images | História profiles, timeline images, A torra, Profissional | Neutral placeholders (no faces); three client photos at ≈ 1000 px in the `image-band` sections (`photo-torrefacao`, `photo-cafeeiro`, `photo-chavena-sotocal`) |
| A7 | `despensa-do-norte-cabaz-presente.webp` 2000 × 2000, alpha or on `--sand` | Shopify resizes | Product media of `despensa-do-norte` | Gift box product, `page.gift-box`, cart upsell | Legacy `conservas.png` crop |
| A8 | OG templates 1200 × 630 per page type (home, shop, product, guide, recipe, Profissional), with the logo SVG on cream or ink, a headline in DM Serif Display and no stock photos. Favicon: `favicon.png` 512 × 512 from the logo mark; `apple-touch-icon.png` 180 × 180. | ≤ 200 KB each | Theme settings (favicon, default social image); article/product images override per page | `meta-tags` snippet | `assets/og-home.png`, `og-shop.png`, `og-guide.png` |

## 3. Image sequences (future replacement for the hero and fold 2 stills)

The hero and the roast section can swap their stills for a scroll-scrubbed frame sequence without code changes. The theme reads the frames from Shopify Files using section settings.

| Setting | Example | Meaning |
|---|---|---|
| Sequence base URL | `https://cdn.shopify.com/s/files/1/XXXX/files/hero_` | Everything before the frame number. Copy it from the URL of the first uploaded frame and drop the number and extension. |
| Frame count | `120` | Number of frames |
| Frame digits | `4` | Zero-padding of the frame index |
| Extension | `webp` | `webp` (default) or `avif` |

**Naming convention.** Use the base name plus a zero-padded index starting at 1:
- Hero: `hero_0001.webp` … `hero_0120.webp`
- Fold 2: `roast_0001.webp` … `roast_0120.webp`

Frame 1 must match the still exactly (same crop and spout position), so the swap is seamless.

**Frame specs:**
- 1600 × 2000 for the hero, 1600 × 1600 for the roast section.
- Alpha WebP, ≤ 35 KB per frame, ≤ 4 MB per sequence.
- 24–30 frames per second of intended motion; 120 frames is enough for one fold.
- For the hero, the spout stays at x = 50 % in every frame.

**Upload.** Content → Files, all frames in one batch. Shopify keeps the file names, which the base-URL scheme relies on. The theme loads frames progressively after the first paint and never blocks LCP. With reduced motion it shows only the last frame (the roasted beans), or the still for the hero.

## 4. Who produces what

| Asset | Route |
|---|---|
| A1, A2, A5 | Studio photography (preferred), licensed stock, or AI-generated (these contain no real people). If AI-generated, log the tool, prompt and date in ASSET-LICENSES. |
| A3, A7 | Studio photography of the real packs (the packs are real products; never generate them). |
| A6 | Real photography only. Portraits need the subjects' written consent `[[TBC]]`. |
| A4 | Done in code. |
| A8 | Design from the logo SVG (`assets/logo-sotocal.svg`, received 29/10/2026). |

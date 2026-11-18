# SEO

This plan covers the PT/EN site at `sotocalcafes.pt` (pt-PT at `/`, English at `/en/`). It covers the URL map, keywords, on-page templates, structured data, technical settings and the legacy migration. The keyword volumes are the ones supplied in the brief (Ubersuggest, PT, October 2026). This document has not re-measured them.

## 1. Platform constraints (Shopify)

- **Fixed URL prefixes.** Shopify forces `/collections/`, `/products/`, `/pages/`, `/blogs/<blog>/` and `/policies/`, and the prefixes cannot be translated. Translate & Adapt can translate the **handle**, the part after the last slash, for products, collections, pages, blogs and articles (https://shopify.dev/changelog/resource-url-handles-are-now-translatable). When a translated handle is created, Shopify redirects the default-language URL to the translated one and updates the sitemap (https://help.shopify.com/manual/markets/languages/translate-adapt-app). Handles cannot vary by market, only by language.
- **One product URL.** The theme always links products as `/products/<handle>`. It never uses `within: collection`, which creates duplicate `/collections/x/products/y` URLs.
- **hreflang.** Shopify generates hreflang tags from the language and market setup, including an `x-default` that points to the primary domain (https://help.shopify.com/en/manual/markets/seo). The theme does not output its own hreflang, which would duplicate Shopify's. A recent community report shows that Markets or language changes can drop an expected alternate (https://community.shopify.com/t/no-hreflang-tag-for-home-market-possibly-since-new-markets-introduction/571267). So **verify after launch** with the check in §10.
- **Redirects fire only for URLs that return 404.** "If the URL still loads a valid webpage, then the URL redirect won't work" (https://help.shopify.com/en/manual/online-store/menus-and-links/url-redirect). A hands-on 2026 test confirms that a live route always beats a redirect (https://www.wislr.com/articles/shopify-url-redirects-guide/).
- **Internal search and filtered URLs** stay `noindex` (Shopify default). The theme never adds `noindex` to an EN page.

## 2. URL map

Primary queries and volumes are taken from the brief. "–" means no target query; "unmeasured" means the term is a hypothesis (§3).

| PT | EN | Template | Primary query (PT volume/month) |
|---|---|---|---|
| `/` | `/en` | index | sotocal (140), comprar café online (90) |
| `/collections/cafe` | `/en/collections/coffee` | collection | – |
| `/collections/cafe-em-grao` | `/en/collections/coffee-beans` | collection | café em grão (880) |
| `/collections/cafe-moido` | `/en/collections/ground-coffee` | collection | café moído (110) |
| `/products/lote-super-milano` | `/en/products/super-milano-blend` | product | café em grão 1kg (170), café moído 1 kg (50) |
| `/products/lote-super` | `/en/products/super-blend` | product | (as above, shared across the four blends) |
| `/products/lote-reggio` | `/en/products/reggio-blend` | product | (as above) |
| `/products/cafe-descafeinado` | `/en/products/decaffeinated-coffee` | product | café descafeinado em grão (unmeasured) |
| `/products/pack-2-x-1-kg` | `/en/products/2-x-1-kg-coffee-pack` | product.bundle | café em grão 2kg (unmeasured) |
| `/products/despensa-do-norte` | `/en/products/despensa-do-norte-gift-box` | product.bundle | cabaz de produtos portugueses (unmeasured) |
| `/collections/especiarias` | `/en/collections/spices` | collection | unmeasured |
| `/products/colorau`, `pimenta`, `piri-piri`, `canela`, `cravinho`, `cominhos` | `/en/products/colorau-paprika`, `pepper`, `piri-piri`, `cinnamon`, `cloves`, `cumin` | product.spice | piri-piri moído (unmeasured) |
| `/collections/sucedaneos-do-cafe` | `/en/collections/coffee-substitutes` | collection | unmeasured |
| `/products/mistura-bom-dia`, `mistura-sako`, `cevada-sotocal`, `cevada-oriente` | `/en/products/bom-dia-coffee-and-chicory-blend`, `sako-blend`, `sotocal-roasted-barley`, `oriente-roasted-barley` | product.substitute | cevada torrada, mistura de cevada e chicória (unmeasured) |
| `/collections/complementares` | `/en/collections/accompaniments` | collection | – |
| `/products/acucar-sotocal`, `adocante-sotocal`, `descafeinado-unidoses`, `cha-verde`, `cha-preto`, `infusao-camomila`, `infusao-cidreira`, `amendoins-jumbo-torrados` | `/en/products/sotocal-sugar-sachets`, `sotocal-sweetener-sachets`, `decaf-single-serve-doses`, `green-tea`, `black-tea`, `chamomile-infusion`, `lemon-balm-infusion`, `roasted-jumbo-peanuts` | product.simple | – |
| `/collections/conservas` | `/en/collections/conservas` | collection | unmeasured |
| `/collections/presentes` | `/en/collections/gifts` | collection | unmeasured |
| `/blogs/guia-do-cafe` | `/en/blogs/coffee-guide` | blog | – |
| `/blogs/guia-do-cafe/melhor-cafe-em-grao-portugal` | `/en/blogs/coffee-guide/best-portuguese-coffee-beans` | article | melhor café em grão (320), melhor café em grão portugal (320), qual o melhor café em grão (140) |
| `/blogs/guia-do-cafe/melhor-cafe-em-grao-para-maquina-automatica` | `/en/blogs/coffee-guide/best-beans-for-bean-to-cup-machines` | article | melhor café em grão para máquina automática (210) |
| `/blogs/guia-do-cafe/como-tirar-o-melhor-expresso` | `/en/blogs/coffee-guide/how-to-pull-a-great-espresso` | article | unmeasured |
| `/blogs/guia-do-cafe/cimbalino-ou-bica` | `/en/blogs/coffee-guide/what-is-a-cimbalino` | article | cimbalino (unmeasured) |
| `/blogs/guia-do-cafe/curiosidades-do-cafe` | `/en/blogs/coffee-guide/coffee-facts` | article | unmeasured |
| `/blogs/receitas` | `/en/blogs/recipes` | blog | – |
| `/blogs/receitas/frango-assado-com-piri-piri` (plus one per legacy recipe in `docs/CONTENT.md`) | `/en/blogs/recipes/piri-piri-roast-chicken` | article.recipe | unmeasured |
| `/pages/historia` | `/en/pages/our-story` | page.historia | – |
| `/pages/a-torra` | `/en/pages/our-roast` | page.a-torra | torrefação Porto (unmeasured) |
| `/pages/arabica-e-robusta` | `/en/pages/arabica-and-robusta` | page | diferença entre arábica e robusta (unmeasured) |
| `/pages/cafe-e-saude` | `/en/pages/coffee-and-health` | page | – |
| `/pages/profissional` | `/en/pages/for-business` | page.profissional | fornecedor de café para restaurantes (unmeasured) |
| `/pages/onde-beber-sotocal` | `/en/pages/where-to-drink-sotocal` | page.locator | onde comprar café em grão (70) |
| `/pages/levantar-no-cafe` | `/en/pages/collect-at-a-cafe` | page.pickup | – |
| `/pages/subscricao` | `/en/pages/coffee-subscription` | page.subscription | subscrição de café (unmeasured) |
| `/pages/despensa-do-norte` | `/en/pages/despensa-do-norte` | page.gift-box | – (supports the product URL; canonical intent is the product) |
| `/pages/sobre-a-sotocal` | `/en/pages/about-sotocal` | page.facts | entity / AI assistants |
| `/pages/perguntas-frequentes` | `/en/pages/faq` | page.faq | – |
| `/pages/contactos` | `/en/pages/contact` | page.contact | – |
| `/pages/declaracao-de-acessibilidade` | `/en/pages/accessibility-statement` | page.accessibility | – |
| `/policies/privacy-policy`, `refund-policy`, `shipping-policy`, `terms-of-service` | same under `/en` | Shopify policies | – |

Recipe handles for the EN side are set per recipe in Translate & Adapt when the articles exist. The recipe list comes from the legacy harvest (`docs/CONTENT.md`).

## 3. Keywords

### Measured (brief, Ubersuggest PT, October 2026)

| Query | Volume | Target URL | Intent |
|---|---|---|---|
| café em grão | 880 | `/collections/cafe-em-grao` | Commercial |
| melhor café em grão | 320 | guide: melhor café em grão portugal | Commercial investigation |
| melhor café em grão portugal | 320 | same guide | Commercial investigation |
| melhor café em grão para máquina automática | 210 | guide: máquina automática | Commercial investigation (audience 2: bean-to-cup owners) |
| café em grão 1kg | 170 | blend product pages (1 kg variant) | Transactional |
| sotocal | 140 | `/` | Navigational (brand) |
| qual o melhor café em grão | 140 | guide: melhor café em grão portugal | Commercial investigation |
| café moído | 110 | `/collections/cafe-moido` | Commercial |
| comprar café online | 90 | `/` | Transactional |
| onde comprar café em grão | 70 | `/pages/onde-beber-sotocal` and `/collections/cafe-em-grao` | Local / transactional |
| café moído 1 kg | 50 | blend product pages (1 kg ground variant) | Transactional |

### Hypotheses (unmeasured; measure before investing in more content)

These terms come from the brief and the audience analysis. Treat them as hypotheses until measured, and re-check volumes in Search Console after 90 days.

| Term | Hypothesis | Target |
|---|---|---|
| torrefação Porto | Local authority query; families and press | `/pages/a-torra`, `/pages/historia` |
| café português | Diaspora and EU buyers (audience 4) | `/`, `/collections/cafe` |
| cimbalino | Regional hook: "cimbalino" is Porto's word for an espresso (Lisbon says "bica") | guide: cimbalino ou bica |
| fornecedor de café para restaurantes | HoReCa lead intent | `/pages/profissional` |
| cevada torrada | Substitute buyers, 45+ households | `/products/cevada-sotocal` |
| mistura de cevada e chicória | Substitute buyers | `/collections/sucedaneos-do-cafe` |
| piri-piri moído | Spice buyers; recipe traffic | `/products/piri-piri`, recipe articles |
| All EN terms (Portuguese coffee, Portuguese coffee beans, coffee from Porto, what is a cimbalino, Portuguese gift box) | Diaspora and EU | EN mirrors |

### Do not target

- Competitor brand terms as head terms, and retailer navigational terms ("… continente"). **One exception (D76, 17/11/2026):** the objective comparison guide `/blogs/guia-do-cafe/cafe-delta-alternativas` may target "café delta grão" and its variants, with dated and sourced prices, no quality claims, no logos, and a legal read of the wording before it publishes. Instead, answer the intent behind them by showing the price per kg on every product, tile and comparison table, so people who compare with supermarket brands can do so on our pages.
- "Specialty" or third-wave vocabulary (brief §1: not a target audience).

## 4. On-page templates

Rules: titles ≤ 60 characters; meta descriptions 140–155 characters and unique. The theme builds titles from Liquid when the admin SEO title is empty. When the merchant sets an SEO title, `page_title` uses it.

### Titles

| Page type | PT | EN |
|---|---|---|
| Home | `Sotocal \| Café torrado no Porto desde 1960` (42) | `Sotocal \| Coffee roasted in Porto since 1960` (44) |
| Coffee product (type Café) | `{{ product.title }} \| Café em grão e moído \| Sotocal` | `{{ product.title }} \| Whole bean and ground coffee \| Sotocal` (over 60 for long titles: the theme drops the middle segment when the full title is over 60) |
| Other product | `{{ product.title }} \| {{ product.type }} \| Sotocal` | same pattern, translated type |
| Collection | `{{ collection.title }} \| Sotocal` | same |
| Article (guia-do-cafe) | `{{ article.title }} \| Guia do café Sotocal` | `{{ article.title }} \| Sotocal coffee guide` |
| Article (receitas) | `{{ article.title }} \| Receitas Sotocal` | `{{ article.title }} \| Sotocal recipes` |
| Page | `{{ page.title }} \| Sotocal` | same |
| Search, 404, cart | `{{ page_title }} \| Sotocal` (Shopify default page_title) | same |

### Meta descriptions

The brief gives the home meta verbatim: «Lotes de café em grão e moído torrados no Porto desde 1960. Os cafés que servimos no Norte, agora com envio para Portugal e UE.» That text is **127 characters**, below the brief's own 140–155 rule. **Decision:** use the smallest edit that meets the rule and keeps every original word. It inserts the hero's own phrase "agora em sua casa" (140 characters). This is logged as a client question.

| Page | PT (chars) | EN (chars) |
|---|---|---|
| Home | Lotes de café em grão e moído torrados no Porto desde 1960. Os cafés que servimos no Norte, agora em sua casa, com envio para Portugal e UE. (140) | Sotocal coffee blends, whole bean and ground, roasted in Porto since 1960. The coffee we serve in Portuguese cafés, now shipped across Portugal and the EU. (155) |
| Sobre a Sotocal | Torrefação portuguesa fundada em 1960 no Porto. Factos sobre a Sotocal: fundadores, lotes, clientes HoReCa do Minho ao Algarve e envios para Portugal e UE. (155) | Portuguese coffee roaster founded in Porto in 1960. Facts about Sotocal: founders, blends, cafés supplied from the Minho to the Algarve and EU shipping. (152) |
| Profissional | Fornecedor de café para cafés, restaurantes e hotéis desde 1960. Equipamento colocado mediante acordo, assistência técnica rápida e material promocional. (153) | Porto coffee supplier to cafés, restaurants and hotels since 1960: equipment placed under agreement, fast technical support and promotional material. (149) |
| Onde beber Sotocal | Encontre cafés, restaurantes e pastelarias que servem café Sotocal, do Minho ao Algarve. Em alguns pode levantar as encomendas feitas na loja online. (149) | Find cafés, restaurants and pastry shops that serve Sotocal coffee, from the Minho to the Algarve. Some also let you collect orders from our online shop. (153) |
| Coffee products | Admin SEO description, written per product (the 4 blends are pre-filled in `store-setup/products.csv`, 142–145 characters each) | Translate & Adapt |
| Everything else | Admin SEO description, or the theme falls back to the first 155 characters of the description/intro (`strip_html \| truncate: 155`). Every collection and page should get its own description before launch. | same |

### Headings

- One H1 per page: the product title, the collection title, the page title, or the hero H1 on the home page («O café que vem do Norte.»). The H1 is real text, never an image.
- Homepage folds and page sections use H2; sub-blocks use H3.
- Do not skip levels for styling; the type scale is set in CSS, independent of level.

## 5. Internal linking map

```
Home ─┬─ /collections/cafe ──────────── 4 blend products ── blend comparison table (on every blend)
      ├─ /pages/a-torra ─────────────── /pages/arabica-e-robusta ── blends
      ├─ /pages/profissional ────────── /pages/onde-beber-sotocal ── /pages/levantar-no-cafe
      └─ /pages/historia ────────────── /pages/sobre-a-sotocal (fact sheet)

Guides (guia-do-cafe) ──► one collection + one product each (sotocal.related_products)
   melhor café em grão portugal          → /collections/cafe-em-grao + lote-super-milano
   … para máquina automática             → /collections/cafe-em-grao + 1 kg blend [[TBC: blend the client recommends for bean-to-cup]]
   como tirar o melhor expresso          → /collections/cafe + lote-reggio [[TBC: confirm]] ; ↔ «Como preparar» accordion
   cimbalino ou bica                     → /collections/cafe + /pages/onde-beber-sotocal
   curiosidades do café                  → /pages/arabica-e-robusta + /collections/cafe

Recipes (receitas) ──► the spice used (product) + /collections/especiarias
Spice products ──► their recipes (pairings / related articles)
Substitutes ──► /pages/historia (substitutes leadership, Azores chicory)
Profissional ↔ Onde beber Sotocal ↔ Levantar no café
Every product ──► its collection (breadcrumb) and «Combina com» (sotocal.pairings)
```

Anchor text is descriptive («café em grão para máquina automática», never «clique aqui»). Footer and menus come from `store-setup/menus.json`.

## 6. Images

- **File names** describe what is shown, in pt-PT, lowercase and hyphenated, for example `lote-super-milano-cafe-em-grao-1kg.webp`, `piri-piri-sotocal-frasco.webp`, `torrador-sotocal-porto.webp`. Rename before uploading, because Shopify keeps the file name in the CDN URL.
- **Alt text** describes what is shown, in pt-PT (EN in Translate & Adapt), for example «Saco de 1 kg do Lote Super Milano, café em grão». Decorative images (grain overlay, bean cut-outs in fold 2, the stream, the biscuit illustration) use `alt=""`.
- **Formats.** Shopify's CDN serves WebP/AVIF automatically through `image_url`. The theme uses `image_url` + `image_tag` with `widths` and `sizes`, lazy-loads below the fold, and preloads the hero with `fetchpriority="high"`.
- **Social previews.** Use a 1200 × 630 OG image per page type (see ASSET-BRIEF A8). The theme sets `og:url` from `canonical_url`, which fixes the legacy site's `og:url` typo (`sotocoal.pt`).

## 7. Structured data (JSON-LD `@graph`, stable `@id`s)

Base: `https://sotocalcafes.pt` (primary domain; in Liquid use `shop.url`, which returns the primary domain). Organization and WebSite `@id`s never carry the `/en` prefix, so both languages describe one entity.

| Node | `@id` | Where | Key properties |
|---|---|---|---|
| Organization | `https://sotocalcafes.pt/#organization` | Sitewide | `name` Sotocal; `legalName` Sotocal – Sociedade Torrefactora De Cafés de Angola, Lda.; `foundingDate` 1960; `foundingLocation` Porto (Place); `founder` → `#jose-barbosa` (described as one of the founding partners); `address` Rua Engenheiro Ferreira Dias, n.º 398, 4100-246 Porto, PT; `telephone` +351226167020; `email` sotocalcafes@sotocalcafes.pt; `vatID` PT500275068; `taxID` 500275068; `logo` → `#logo`; `award` ["PME Excelência Indústria 2001", "PME Líder 2011"]; `areaServed` PT + EU; `sameAs` Facebook, Instagram, Google Maps `[[TBC: canonical Google Maps URL]]`, Wikidata when created |
| ImageObject (logo) | `https://sotocalcafes.pt/#logo` | Sitewide | logo URL (from the SVG once supplied; the legacy PNG until then) |
| WebSite | `https://sotocalcafes.pt/#website` | Home | `publisher` → `#organization`; `inLanguage` pt-PT / en; `potentialAction` SearchAction `{{ routes.search_url }}?q={search_term_string}` |
| WebPage | `{{ canonical_url }}#webpage` | Every page | `isPartOf` → `#website`; `breadcrumb` → `#breadcrumb`; `inLanguage` from `request.locale.iso_code` |
| BreadcrumbList | `{{ canonical_url }}#breadcrumb` | All but home | Mirrors the visible breadcrumb |
| ProductGroup / Product | `{{ canonical_url }}#productgroup`, variants `{{ canonical_url }}?variant=ID#product` | Product pages | `brand` → Sotocal; `productGroupID` handle; `variesBy` (Formato, Peso); per variant: `sku` `[[TBC]]`, `gtin13` `[[TBC]]`, `offers` with real Liquid prices (`price`, `priceCurrency` EUR, `availability`), `priceSpecification` UnitPriceSpecification with `referenceQuantity` 1 KGM, `shippingDetails` (destinations PT, PT-20 Azores, PT-30 Madeira, EU; rates `[[TBC]]`, omitted until known), `hasMerchantReturnPolicy` (14-day withdrawal window, `MerchantReturnFiniteReturnWindow`, `returnFees` `[[TBC: legal]]`) |
| ItemList | `{{ canonical_url }}#itemlist` | Collections | Products on the current page, in order, with URLs |
| BlogPosting | `{{ canonical_url }}#article` | Guide articles | `headline`, `datePublished`, `dateModified`, `author` → person (`sotocal.author`, else Organization), `publisher` → `#organization`, `image`, `inLanguage` |
| Recipe | `{{ canonical_url }}#recipe` | `article.recipe` | `recipeIngredient` (`sotocal.recipe_ingredients`), `recipeInstructions` HowToStep (`sotocal.recipe_steps`), `prepTime`/`cookTime` ISO 8601 from minutes, `recipeYield`, `recipeCategory`, `recipeCuisine` Portuguese, `author` |
| FAQPage | `{{ canonical_url }}#faq` | Product FAQ, `page.faq`, `page.profissional`, `page.facts` | One per page (merge blocks); only visible Q&As |
| AboutPage + Person | `https://sotocalcafes.pt/pages/historia#webpage`, `#jose-barbosa`, `#maria-jose-barbosa` | História | Person `name`, `jobTitle` `[[TBC: preferred title]]`, `worksFor` → `#organization`, `sameAs` from `person.same_as`; Maria José `memberOf` the confraria `[[TBC: name]]` once confirmed. Never output an age. |
| ContactPage | `{{ canonical_url }}#webpage` | Contactos | `mainEntity` → `#organization` |

Validation: the QA run parses every JSON-LD block and checks required fields (docs/QA-REPORT.md). After launch, run Google's Rich Results Test on one URL per template.

## 8. Technical

- **robots.txt.** `templates/robots.txt.liquid` loops over Shopify's `robots.default_groups` unchanged, keeps the `Sitemap:` line, and (since 17/11/2026, D59) adds one explicit group for GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended and Applebot-Extended. Each repeats the `*` group's `Disallow` rules and adds `Allow: /`, because a crawler with its own group ignores the `*` group. No AI crawler is blocked.
- **noindex.** `snippets/robots-meta.liquid` (rendered from `meta-tags`) emits `noindex,follow` on `/collections/all`, vendor and type listings, tag, filtered or re-sorted collection URLs, search results, and any product still tagged `preco-provisorio` (D60). See `docs/seo/01-ws1-technical.md`.
- **AI discovery files.** Since 28/05/2026, Shopify serves `/agents.md`, `/llms.txt` and `/llms-full.txt` on every store and lets themes override them with `templates/agents.md.liquid`, `templates/llms.txt.liquid` and `templates/llms-full.txt.liquid` (https://shopify.dev/changelog/customize-llmstxt-llms-fulltxt-and-agentsmd, https://shopify.dev/docs/storefronts/themes/architecture/templates/llms-txt-liquid). These templates only get the `request` and `agents` objects, so the entity text is written statically. See GEO.md §5. **The brief's `/llms.txt → /pages/sobre-a-sotocal` redirect is not used.** `/llms.txt` is now a live route, so a redirect would never fire. It is left out of `redirects.csv`.
- **Sitemap.** Shopify's `/sitemap.xml` includes translated handles.
- **Search Console.** Keep the legacy verification tag in `<head>`: `<meta name="google-site-verification" content="FsPoxaMNsglzycxyLmZmlgoBw3YHtdp8XVS8otgEwyc">`. Also add the domain property by DNS so the verification survives theme changes.
- **Canonicals.** Shopify's `canonical_url` is used as is. Variant URLs (`?variant=`) canonicalise to the product.
- **Language.** `<html lang="{{ request.locale.iso_code }}">` gives `pt-PT` or `en`.
- **Performance.** Performance is an SEO input; see brief §13 budgets and QA-REPORT.

## 9. Legacy migration

- `docs/redirects.csv` uses Shopify's import format (`Redirect from,Redirect to`). Import it in Online Store → Navigation → URL redirects → Import. Every legacy page from brief §3 maps to a concrete handle from `store-setup/`.
- The rows only work once the old `.php` URLs return 404 on Shopify. They will, because Shopify has no `.php` routes. The domain must point to Shopify before the old server is switched off.
- **Targets must exist first.** Create the two articles `como-tirar-o-melhor-expresso` and `curiosidades-do-cafe` in the `guia-do-cafe` blog (copy in `docs/CONTENT.md`) and the products before importing. Otherwise the redirect lands on a 404.
- **`/projeto.pdf`** temporarily points to `/pages/sobre-a-sotocal`. Once the PDF is re-uploaded to Content → Files, change the target to its `cdn.shopify.com` URL. If it is an EU co-funding notice, its logos must stay visible on the site (footer badge setting `cofunding_image`) `[[TBC]]`.
- **QR codes** (`/q/chavena`, `/q/acucar`) redirect to `/collections/cafe?utm_source=chavena|acucar&utm_medium=qr&utm_campaign=horeca`. Shopify's help warns that "URLs containing query strings … might not work as expected" (https://help.shopify.com/en/manual/online-store/menus-and-links/url-redirect). It does not say whether a query string in the **target** survives. Treat this as unverified until the post-import test passes:

  ```bash
  curl -sI https://sotocalcafes.pt/q/chavena
  ```

  Expected: a `301` whose `Location:` header ends in `/collections/cafe?utm_source=chavena&utm_medium=qr&utm_campaign=horeca`.

  **Fallback if the query string is dropped.** Change both redirect targets to `/pages/q-chavena` and `/pages/q-acucar`, and create those pages with `node scripts/store-setup.mjs --apply --qr-pages` (template `page.qr`). The page fires `qr_landing_view`, then forwards with `location.replace()` to the UTM-tagged collection URL. A visible link covers browsers without JS. The page sets `noindex`. The printed QR paths stay the same.
- **Legacy Search Console.** Keep the old property, submit the new sitemap, and watch Coverage for 404s for 8 weeks. Add any new 404 paths to the redirects.

## 10. Launch checklist (SEO)

1. Every page in §2 exists in both languages, and its EN handle is set in Translate & Adapt.
2. View source on `/`, `/en`, one product, one collection and one article. Confirm one `<link rel="alternate" hreflang="pt-PT">`, one `hreflang="en"` and one `hreflang="x-default"`, all absolute, with no `noindex`. If `x-default` is missing, check Settings → Markets → languages and the primary domain (see the community report in §1).
3. The `/q/chavena` and `/q/acucar` curl test passes (§9).
4. JSON-LD parses with no errors on one URL per template (Rich Results Test).
5. Every collection and page has a unique meta description of 140–155 characters.
6. `/robots.txt` contains Shopify's default groups and the sitemap. `/agents.md` and `/llms.txt` show the fact-sheet summary (GEO.md §5).

# Admin setup

This guide covers what has to be configured in the Shopify admin for the theme to work as designed. The theme cannot do these things itself. Each section says what to set, why, and whether the setting is verified or still open. Verified platform facts carry a source link; open items are `[[TBC]]` and are listed in `docs/QUESTIONS-FOR-CLIENT.md`.

## 0. Setup order

1. Languages and markets (§1). Add **English** before running the setup script, so it can register translations.
2. Create an app for the setup script. Since 01/01/2026 this happens in the Dev Dashboard (Settings › Apps › Develop apps links there, or dev.shopify.com), signed in as the store owner so the app and the store share an organization. Give the app's version the scopes in DATA-MODEL.md, install it on the store, and copy its client ID and secret. The script exchanges them for a 24-hour token. Then run:
   ```bash
   SHOPIFY_STORE=sotocal.myshopify.com SHOPIFY_CLIENT_ID=xxx SHOPIFY_CLIENT_SECRET=xxx node scripts/store-setup.mjs --apply --seed --collections --pages --menus
   ```
3. Import `store-setup/products.csv` (Products → Import). Every product arrives as **draft**, with the placeholder price 1,00 € and the tag `preco-provisorio`.
4. Run the script again with `--apply --products`. This sets template suffixes, `sotocal.*` values, unit price per kg and EN titles/handles.
5. Create the 2 × 1 kg pack in the Shopify Bundles app (§5), then run `--products` once more for its template and unit price.
6. Configure the apps (§4 subscriptions, §8 tracking), shipping (§6) and taxes (§11).
7. Configure the theme settings (§2), consent (§9), newsletter (§10) and forms (§13), and import the redirects (§15).
8. Run the launch checklist (§17).

## 1. Store basics

| Setting | Value |
|---|---|
| Settings → General → Store defaults | Currency EUR; unit system **Metric**; default weight unit kg |
| Settings → Languages | Default **Português (Portugal)** `pt-PT`; add **English** `en` and publish it. The default language is served at `/` and English at `/en/`. |
| Settings → Markets | Portugal (primary, including Azores and Madeira) and a European Union market. Keep EUR for every market. Languages per market: pt-PT + en. |
| Settings → Domains | `sotocalcafes.pt` as primary. Redirect `www` to the primary domain. |
| Online Store → Preferences | Keep the password page on until launch. Enable spam protection (hCaptcha) for contact and customer forms. |
| Search Console | Keep the legacy HTML tag (the theme outputs it) and add a DNS domain property. Submit `/sitemap.xml`. |

## 2. Theme settings (Online Store → Themes → Customize → Theme settings)

| Setting | Default | Notes |
|---|---|---|
| `free_shipping_threshold` | 40 (EUR) | `[[TBC: 40 €]]`. Drives the announcement bar text and the cart progress bar. **It must match the free-shipping rate condition in Settings → Shipping (§6)**, otherwise the bar promises something checkout does not give. |
| `show_tbc_markers` | on | Shows `[[TBC]]` markers and the «Preço provisório» flag for pre-launch review. **Turn off at launch.** |
| `upsell_product` | empty | Product shown in the cart drawer upsell: the gift box `despensa-do-norte` or the pack `pack-2-x-1-kg`. |
| `ral_entity_name`, `ral_entity_url` | empty | Alternative dispute resolution entity in the footer (§12). `[[TBC]]` |
| `cofunding_image`, `cofunding_link` | empty | `projeto.pdf` is an EU co-funding sheet (Norte 2020 / Portugal 2020 / FEDER), so the footer shows the legacy logo strip (`assets/cofunding-projeto.png`) until a vector version is uploaded here. Link it to the re-uploaded PDF in Files. `[[TBC: how long the logos must stay]]` |
| `pickup_enabled` | on | Shows the «Levantar num café Sotocal» toggle in the cart and the pickup link on product pages. |
| `shipping_rate_pt`, `shipping_handling_days`, `shipping_transit_days` | empty | Only feed the product `shippingDetails` structured data; nothing is published while the rate is empty. `[[TBC]]` |
| `schema_return_days` | 14 | Return window in the `MerchantReturnPolicy` structured data. |
| `cookie_banner_enabled` | on | The theme's «bolacha Maria» banner. Turn **off** Shopify's own banner (§9). |
| `google_site_verification` | legacy token | Output as the `google-site-verification` meta tag. |
| `entity_base_url` | https://sotocalcafes.pt | Base for every JSON-LD `@id` (stable even on a preview domain). |
| Social URLs (`social_facebook`, `social_instagram`, `social_google_maps`, `social_wikidata`) | Facebook, Instagram, Google Maps share link | Used in the footer and in `Organization.sameAs`. Google Maps `[[TBC: canonical URL]]`; add Wikidata once the item exists (GEO.md). |
| Logo, `logo_width`, favicon, `share_image` | empty (the theme uses its own `logo-sotocal-emblem.svg`, `favicon.png` and OG images, all made from the client's vector logo) | Leave Logo empty: the built-in SVG emblem stays sharp at every size and reads on cream and ink. Upload a file here only to replace the logo. Without a share image, the theme uses its Open Graph templates per page type. |

Brand colours and fonts are locked in code; they are not theme-editor settings (brief §0).

## 3. Products, collections and filters

- **Import.** Products → Import → `store-setup/products.csv`. The file uses Shopify's current column names (https://help.shopify.com/en/manual/products/import-export/using-csv). That column list has no template-suffix or unit-price columns. Community reports mention unit-price CSV columns, but they are not in the official reference, so the script sets both instead.
- **Placeholders.** Prices are 1,00 € on purpose, so nobody mistakes them for real prices. Products stay **draft** until the client confirms prices, formats, SKUs and GTINs `[[TBC]]`. When a price is confirmed, remove the `preco-provisorio` tag.
- **Unit price per kg (EU price indication).** Shopify offers unit pricing to all merchants in the EU and Switzerland, so a Portuguese store qualifies (https://changelog.shopify.com/posts/unit-pricing-now-available-for-all-eu-and-swiss-merchants, https://shopify.dev/themes/pricing-payments/unit-pricing). Grams and kilograms are supported units, and Online Store 2.0 themes display the unit price automatically (https://help.shopify.com/en/manual/products/details/product-pricing/unit-pricing). The script sets each variant's measurement (250 g → €/kg; 1 kg → €/kg; pack → 2 kg). To check one by hand, open a variant → Pricing → "Show unit price".
- **Collections** are smart collections created by the script (`store-setup/collections.json`). `cafe-em-grao` and `cafe-moido` rely on the tags `formato-grao` and `formato-moido`. The short intro is the `sotocal.intro` metafield; the collection description is the longer SEO text, shown below the grid. Paste it from `docs/CONTENT.md`.
- **Search & Discovery app → Filters.** Add these filters, in this order:

  | Filter label (PT / EN) | Source |
  |---|---|
  | Formato / Format | Variant option «Formato» |
  | Peso / Weight | Variant option «Peso» |
  | Lote / Blend | Product metafield `sotocal.blend` |
  | Tipo / Type | Product type |

  Also keep Availability and Price. Translate the labels in Translate & Adapt. The theme renders whatever filters the app returns (`collection.filters`).
- **Search & Discovery → Product recommendations.** Optional. «Combina com» uses `sotocal.pairings` first and falls back to Shopify's related products.

## 4. Subscriptions (Shopify Subscriptions app)

1. Install the **Shopify Subscriptions** app and create one plan group, «Subscrição», with three delivery frequencies: every **2**, **4** and **6** weeks. Discount `[[TBC: desconto]]`; if there is no discount, set 0 % and show no saving.
2. Add the four coffee products (all variants) to the plan group. Do **not** add the pack or the gift box: Shopify bundles cannot be sold with selling plans (https://shopify.dev/docs/apps/bundles).
3. Leave **one-time purchase available**. The theme renders the purchase options as radio buttons with «Compra única» selected by default and never pre-selects the subscription. It shows the saving and a short terms line, then submits `selling_plan`. Subscription apps are expected to show plan names, prices and savings on product, cart and order pages (https://shopify.dev/docs/storefronts/themes/pricing-payments/subscriptions).
4. Terms to confirm `[[TBC: legal]]`: minimum commitment (the copy says «sem compromisso»), how to pause, skip or cancel (customer account → Subscriptions), and when the card is charged.
5. The app adds its own theme app block. **Keep it out of the product template.** The theme's own selling-plan radios replace it, so there are not two pickers.

## 5. Bundles and the gift box

**Decision: the 2 × 1 kg pack is a Shopify Bundles app fixed bundle; the «Despensa do Norte» gift box is a normal product.**

- **Pack `pack-2-x-1-kg`.** In the Bundles app, create a bundle with options Lote (Super Milano | Super | Reggio | Descafeinado) × Formato (Grão | Moído). Each bundle variant contains 2 × the matching 1 kg variant. Stock then always follows the real 1 kg bags, and fixed bundles work on the existing product page without theme changes (https://shopify.dev/docs/apps/bundles). Use the handle `pack-2-x-1-kg` and the tags `cafe`, `pack`, `formato-grao`, `formato-moido`, then run `store-setup.mjs --apply --products` (template `bundle`, unit price for 2 kg).
  - *Rejected alternative:* a native product with its own inventory. Its stock would drift away from the 1 kg bags.
  - *Limit:* bundles cannot be bought on subscription.
- **Gift box `despensa-do-norte`.** It is a normal product (imported by the CSV) with its own inventory, because the box is assembled and packed as one physical item. Its contents are listed through `sotocal.gift_box_items` (`gift_box_item` metaobjects) `[[TBC: conteúdo do cabaz]]`.
  - *Rejected alternative:* a Bundles app bundle. The contents include conservas, and that range is not defined yet `[[TBC]]`.

## 6. Shipping and click & collect

### Shipping zones (Settings → Shipping and delivery)

| Zone | Notes |
|---|---|
| Portugal continental | Rates `[[TBC]]`. Free over `free_shipping_threshold` `[[TBC: 40 €]]`: create the rate with the condition "order price ≥ 40,00 €" so it matches the theme setting. |
| Açores | Rates and delivery times `[[TBC]]` |
| Madeira | Rates and delivery times `[[TBC]]` |
| União Europeia | Rates `[[TBC]]`; delivery promise `[[TBC]]` |

In Shopify the Azores and Madeira can be set up as their own regions inside Portugal. Check that Settings → Shipping lets you give each its own rate, and that checkout asks for the right region.

### Click & collect at partner cafés

The customer chooses a café in the **cart** (a theme-controlled cart attribute). On non-Plus plans, checkout cannot be customised to add a café picker to the shipping step. The cart drawer saves `pickup_cafe_id`, `pickup_cafe_name` and `pickup_cafe_city` as cart attributes (DATA-MODEL.md), and the order shows them under "Additional details".

| Option | How it works | Pros | Cons |
|---|---|---|---|
| **(a) Default.** €0 shipping rate «Levantamento num café parceiro» + Sotocal's own HoReCa delivery route | Create a €0 rate in the Portugal continental zone, named «Levantamento num café parceiro». When the order arrives with `pickup_cafe_*` attributes, the warehouse adds it to that café's next HoReCa delivery. | No app, no plan limits, unlimited cafés, uses the existing route. | The €0 rate is visible to everyone at checkout. A customer could pick it without choosing a café, or choose a café and then a paid rate. Mitigation and ops rule below. |
| (b) Shopify local pickup, one location per café | Each café becomes a Shopify location with local pickup enabled. | Native pickup at checkout, pickup notifications. | Location limits: Starter 2, **Basic, Grow and Advanced 10**, Plus 200 (https://help.shopify.com/manual/locations/setting-up-your-locations). Each café becomes an inventory location, which does not match how stock really moves. |
| (c) A pickup-point app from the App Store | The app adds a pickup-point picker at checkout. | Proper picker at checkout. | Monthly cost and another dependency; check the app's EU/PT support. |

**Operating rule for (a):**

1. The cart drawer tells the customer that at checkout they must choose «Levantamento num café parceiro».
2. **Café chosen, paid rate used.** Deliver to the address paid for, or refund the shipping, as the client decides `[[TBC]]`.
3. **€0 rate used, no café chosen.** Customer service phones the customer to pick a café. If they want home delivery, they pay shipping.
4. **Optional hardening.** Public App Store apps that contain Shopify Functions work on every plan (https://shopify.dev/docs/apps/build/functions). A delivery-customisation app could hide the €0 rate unless the cart has `pickup_cafe_id`. Evaluate once order volume justifies it.

The `/pages/levantar-no-cafe` page explains the flow to customers. Only cafés with `pickup_enabled` and `consent_publish` appear in the selector.

## 7. Translate & Adapt (English)

1. Install **Translate & Adapt** (Shopify, free) and choose English.
2. **Theme content.** Static UI text ships in the theme's `locales/en.json`, so it needs no work in the app. Section settings typed in the theme editor need EN only if the merchant has changed the theme's default copy: open Translate & Adapt → Online Store theme.
3. **Products, collections, pages, blogs, articles.** The setup script already registered EN titles and handles for the resources it knows. Check each one, then translate descriptions, SEO titles and SEO descriptions.
4. **URL handles.** In the editor of each product, collection, page, blog or article, set "URL handle" to the EN value from `docs/SEO.md` §2. Handle translation is supported for exactly these resource types (https://shopify.dev/changelog/resource-url-handles-are-now-translatable). When an EN handle is created, Shopify redirects the PT-handle EN URL to it and updates the sitemap (https://help.shopify.com/manual/markets/languages/translate-adapt-app).
5. **Metaobjects** (FAQ, timeline, people, awards, cafés): translate the text fields. The definitions are translatable.
6. **Navigation**: translate menu item titles.
7. **Policies**: translate the four policies once their legal text is final.
8. **Check.** Visit `/en`, one product, one collection and one article; check `hreflang` (SEO.md §10).

## 8. Tracking (GA4, Meta) and the theme's custom events

- **GA4:** install the **Google & YouTube** app and connect the GA4 property `[[TBC: GA4 ID]]`.
- **Meta:** install the **Facebook & Instagram** app, connect the pixel and turn on **Conversions API** (the "Maximum" data-sharing setting) `[[TBC: Meta pixel ID]]`.
- **Pixels.** Do not paste pixel snippets into the theme. The theme contains none.
- **Custom events.** The theme publishes five custom events with `Shopify.analytics.publish` (DATA-MODEL.md). Custom pixels receive them through `analytics.subscribe` (https://shopify.dev/docs/api/web-pixels-api/emitting-data).
  1. Settings → Customer events → **Add custom pixel** → name «Sotocal – eventos do tema».
  2. Paste `store-setup/custom-pixel.js` and replace `META_PIXEL_ID` and `GA4_MEASUREMENT_ID`. Custom pixels are sandboxed and cannot read settings, so the IDs are written in the code.
  3. Customer privacy: Permission **Required**, with Marketing and Analytics. Data sale: "does not qualify as data sale".
  4. **Save**, then **Connect**.

  The mapping:

  | Theme event | Meta | GA4 |
  |---|---|---|
  | `horeca_lead_submitted` | `Lead` (standard event) | `generate_lead` |
  | `newsletter_signup` | `NewsletterSignup` (custom) | `sign_up` (method newsletter) |
  | `subscription_selected` | – | `subscription_selected` |
  | `pickup_cafe_selected` | – | `pickup_cafe_selected` |
  | `qr_landing_view` | – | `qr_landing_view` |

  The official apps keep handling page views and the e-commerce funnel, so nothing is counted twice. In Meta Events Manager, mark **Lead** as a conversion; in GA4, mark `generate_lead` as a key event.
- **Check.** In the custom pixel, use "Test" with Meta Pixel Helper or Events Manager Test Events, then submit a test lead on `/pages/profissional`.

## 9. Cookie consent («bolacha Maria» banner)

The theme has its own banner, wired to Shopify's Customer Privacy API:

- It loads the API with `window.Shopify.loadFeatures([{ name: 'consent-tracking-api', version: '0.2' }], cb)`. This is the version in the current docs (https://shopify.dev/themes/trust-security/cookie-banner).
- It shows the banner when `Shopify.customerPrivacy.shouldShowBanner()` is true. That method returns true when no consent is stored and the visitor is in a region set up to show a banner (same page).
- It records consent only when the visitor clicks, with `setTrackingConsent({ analytics, marketing, preferences, sale_of_data }, callback)`. Shopify warns never to set consent automatically or touch its cookies directly (https://shopify.dev/docs/api/customer-privacy).
- «Aceitar todos», «Rejeitar» and «Escolher» have equal prominence, and no box is pre-ticked. The footer link «Preferências de cookies» reopens the banner.

**Admin:**

1. Settings → Customer privacy → **Cookie banner**: turn off "Use automated settings" and choose the option for a **custom/third-party banner**, so Shopify does not show its own banner on top of the theme's (https://help.shopify.com/manual/privacy-and-security/privacy/customer-privacy-settings/privacy-settings). Keep the banner **regions** on: the European Union, the EEA, Switzerland and the UK at minimum. `shouldShowBanner()` uses these regions to decide where the theme banner appears.
2. If you ever install a consent app, remove the theme banner (theme setting) so only one banner exists.
3. Rejecting cookies hides that visitor from Shopify analytics and ad pixels. This is expected.

## 10. Newsletter (double opt-in)

The theme's newsletter form creates a customer with the tag `newsletter` and marketing consent.

- **Turn on double opt-in.** Settings → Notifications → Customer notifications → email double opt-in: tick "Require customers to confirm their subscription". It needs the Online Store channel and does not apply to people who subscribed earlier (https://help.shopify.com/manual/promoting-marketing/customer-emails). In some countries the law requires it, and it is the safe choice under GDPR.
- Edit the «Customer marketing confirmation» email in pt-PT and EN. It must not contain marketing.
- The theme's success message tells people to check their inbox: «Enviámos-lhe um email para confirmar a subscrição.»

## 11. Taxes (flag for the accountant)

| Topic | What we know | Action |
|---|---|---|
| Prices include VAT | The theme shows «IVA incluído» everywhere. | Settings → Taxes and duties → "Include tax in prices" **on**. |
| Mainland, Azores, Madeira | Portugal has three VAT territories with different rates; 2026 standard rates are 23 % (mainland), 22 % (Madeira) and 16 % (Azores). Reduced rates for food also differ (https://trykintsugi.com/sales-tax-guides/europe/portugal). | `[[TBC: accountant]]` Confirm the rate for each product family (coffee, substitutes, spices, tea, sugar, peanuts) in each territory. In Settings → Taxes → Portugal, check that Shopify applies the regional rates, and add overrides per product collection where needed. |
| EU distance sales (OSS) | Above €10,000 per year of cross-border EU B2C sales, VAT is due in the customer's country, and it can be accounted for through the One-Stop Shop (same source). | `[[TBC: accountant]]` Decide on OSS registration; then in Shopify turn on "Collect VAT" for EU countries under OSS. |
| Invoices | Portuguese invoicing rules (certified invoicing software, AT communication) are outside Shopify's core. | `[[TBC: accountant]]` Choose a certified invoicing app (for example one that issues AT-certified invoices automatically). |

## 12. Legal and compliance (Portugal / EU)

| Item | Status | Where |
|---|---|---|
| **Livro de Reclamações Eletrónico** | Mandatory for sellers of goods, including online-only businesses. The website must show access to the platform "in a visible and prominent place" (DL 74/2017; https://www.deco.proteste.pt/familia-consumo/cidadania/dicas/livro-reclamacoes-online-como-reclamar-passo-passo). | Footer: logo + link to https://www.livroreclamacoes.pt/ (theme). Register the company on the platform `[[TBC: confirm registered]]`. |
| **RAL (alternative dispute resolution)** | Lei 144/2015 requires consumers to be told which RAL entity is available. For Porto, the likely competent entity is **CICAP – Centro de Informação de Consumo e Arbitragem do Porto** (Área Metropolitana do Porto; www.cicap.pt). It is registered with the DGC under Lei 144/2015 (https://cicap.pt/wp-content/uploads/2025/09/Politica-privacidade-CICAP-ST-VF.pdf). | `[[TBC: legal]]` Confirm the entity (or an adhered sectoral one), then fill `ral_entity_name` / `ral_entity_url`. |
| **EU ODR platform link** | No longer required. The ODR platform closed on 20/07/2025 under Regulation (EU) 2024/3228 (https://eur-lex.europa.eu/eli/reg/2024/3228/oj/eng). | Do **not** add an ODR link; remove any from old policies. |
| Company identification | Legal name, NIF, address, phone with «(Chamada para a rede fixa nacional)», email. | Footer (theme, from §2 facts). |
| Prices | VAT included; unit price per kg; on any discount, the Omnibus line «Preço mais baixo nos últimos 30 dias: x,xx €». Fill `sotocal.lowest_price_30d` whenever a compare-at price is set. | Theme + product admin. |
| Right of withdrawal | 14 days, with exceptions (for example sealed goods unsealed after delivery for health or hygiene reasons, and perishable goods). | `[[TBC: legal]]` Refund policy text. |
| Food information (EU 1169/2011, Art. 14) | Mandatory food information must be visible **before purchase**. | `sotocal.fic_*` metafields from the client's spec sheets `[[TBC]]`. The theme shows «Informação a completar» until they are filled, and products stay draft until then. |
| Health claims (EU 1924/2006) | None on the site; «Café e saúde» is neutral and educational. | `[[TBC: legal review]]` of `/pages/cafe-e-saude`. |
| GDPR | Lead-form consent (unticked); newsletter double opt-in (§10); privacy policy; cookie banner with a reject option (§9). | Privacy policy `[[TBC: legal]]`. |
| Policies | Privacy, Terms, Refunds, Shipping. Use Settings → Policies with Shopify's templates as placeholders. | `[[TBC: legal]]` |
| EU co-funding | If `projeto.pdf` is a funding notice, keep the funding logos visible. | `cofunding_image` theme setting `[[TBC]]` |
| European Accessibility Act | Portugal transposed the EAA through Decreto-Lei 82/2022; obligations for services, e-commerce included, apply from 28/06/2025 (https://www.garrigues.com/pt/pt-PT/news/primeiro-prazo-do-novo-regime-juridico-da-acessibilidade-termina-em-junho-2025-com-novas). Under the EAA, service micro-enterprises (fewer than 10 people and ≤ €2 M turnover or balance sheet) are excluded. | `[[TBC: check whether Sotocal qualifies for the micro-enterprise exemption]]`. Publish the statement below anyway. |

### Draft accessibility statement (page `declaracao-de-acessibilidade`, template `page.accessibility`)

**PT**

> **Declaração de acessibilidade**
>
> A Sotocal – Sociedade Torrefactora De Cafés de Angola, Lda. (Sotocal) quer que todas as pessoas possam usar a loja sotocalcafes.pt, incluindo pessoas com deficiência.
>
> **Norma.** O site foi desenhado e testado para cumprir as Diretrizes de Acessibilidade para Conteúdo Web (WCAG) 2.2, nível AA.
>
> **O que fizemos.** Navegação completa por teclado, com foco sempre visível; texto alternativo nas imagens com conteúdo; contraste de cor de pelo menos 4,5:1 no texto; formulários com etiquetas e mensagens de erro específicas; respeito pela preferência «reduzir movimento» do sistema operativo, que desliga as animações; páginas em português e em inglês, com o idioma declarado.
>
> **Limitações conhecidas.** `[[TBC: resultados da auditoria final — preencher a partir de docs/QA-REPORT.md]]` O pagamento decorre na página de checkout da Shopify, que não controlamos diretamente.
>
> **Contacto.** Se encontrar uma barreira, diga-nos: sotocalcafes@sotocalcafes.pt ou +351 226 167 020 (chamada para a rede fixa nacional). Respondemos em `[[TBC: prazo]]` dias úteis.
>
> **Enquadramento legal.** Decreto-Lei n.º 82/2022 (Ato Europeu da Acessibilidade). `[[TBC: indicar se a Sotocal está abrangida ou isenta como microempresa]]`
>
> Declaração preparada em `[[TBC: dd/mm/aaaa]]` e revista em `[[TBC: dd/mm/aaaa]]`.

**EN**

> **Accessibility statement**
>
> Sotocal – Sociedade Torrefactora De Cafés de Angola, Lda. (Sotocal) wants everyone to be able to use the sotocalcafes.pt shop, including disabled people.
>
> **Standard.** The site was designed and tested to meet the Web Content Accessibility Guidelines (WCAG) 2.2, level AA.
>
> **What we have done.** Full keyboard navigation with a visible focus indicator; alternative text on meaningful images; colour contrast of at least 4.5:1 for text; forms with labels and specific error messages; support for the operating system's "reduce motion" setting, which turns animations off; pages in Portuguese and English with the language declared.
>
> **Known limitations.** `[[TBC: final audit results, from docs/QA-REPORT.md]]` Payment takes place on Shopify's checkout page, which we do not control directly.
>
> **Contact.** If you find a barrier, tell us: sotocalcafes@sotocalcafes.pt or +351 226 167 020 (call to a Portuguese landline). We reply within `[[TBC: days]]` working days.
>
> **Legal framework.** Decreto-Lei 82/2022 (European Accessibility Act). `[[TBC: state whether Sotocal is covered or exempt as a micro-enterprise]]`
>
> Statement prepared on `[[TBC: dd/mm/yyyy]]`, last reviewed on `[[TBC: dd/mm/yyyy]]`.

## 13. Forms

### HoReCa lead form (`/pages/profissional#contacto`)

- **Shopify's contact form requires an email.** The only input Shopify requires for a contact form to submit is `contact[email]` (https://shopify.dev/docs/storefronts/themes/customer-engagement/add-contact-form). The brief makes the phone required and the email optional.
- **What the theme does.** It keeps Email optional for the person. With JS, an empty email is replaced at submit time by the store's own address, sotocalcafes@sotocalcafes.pt, so the notification still arrives. The lead's phone is in the message, and the salesperson calls.
- **Without JS.** Shopify rejects an empty email and the theme shows the error, so the person adds one.
- **Verify on the live store.** Submit one lead with an email and one without.
- **Notifications.** Contact form submissions go to the store's **sender/contact email** (Settings → Notifications → Sender email, and Settings → General → Store contact email). Point it at the sales mailbox `[[TBC: endereço da equipa comercial]]`.
- **Lead emails: Resend (D101, 17/11/2026; supersedes mailbox forwarding).** The form posts its answers to a small service that emails them with Resend to someone at Sotocal, with a copy to José. Code and checklist: `store-setup/lead-endpoint/` (nothing deployed). Until the service URL is set in Theme settings ("Pedidos de contacto"), the form uses Shopify's contact form and the notification address above. The privacy policy must name Resend and the copy recipient.
- **Fields.** Custom fields arrive as `contact[...]` with the labels shown in the notification (Nome, Estabelecimento, Tipo, Distrito, Localidade, Telefone, Fornecedor atual, Consumo mensal, Melhor hora, Mensagem, Consentimento).
- **Spam.** A hidden honeypot field is blocked with JS. If spam gets through without JS, the notification shows it filled in, so ignore those messages. Also enable hCaptcha (§1).
- **Response time** in the success message: `[[TBC: response time]]`.

### Contact page form

This is a standard `{% form 'contact' %}` with a required email.

## 14. Café locator (OpenStreetMap)

- The map loads only after the visitor clicks «Mostrar mapa», to respect privacy. It uses Leaflet with OpenStreetMap tiles and shows the attribution "© OpenStreetMap contributors".
- **OSM tile usage policy.** The `tile.openstreetmap.org` servers run on donated capacity. Heavy-traffic sites must use their own tile server or a commercial provider. Requests must send a valid Referer, which browsers do by default, and attribution must be visible. Access can be blocked without notice (https://wiki.openstreetmap.org/wiki/Blocked_tiles; current policy: https://operations.osmfoundation.org/policies/tiles/). Click-to-load keeps tile requests low. If the locator becomes popular, switch the tile URL to a provider such as MapTiler, Stadia or Thunderforest (paid; set in the locator section settings `[[TBC: if traffic grows]]`).
- **Adding a café:** see DATA-MODEL.md "Adding things later". Without `consent_publish`, a café never appears.

## 15. Redirects and QR codes

1. Online Store → Navigation → **URL redirects** → Import → `docs/redirects.csv`.
2. Redirects only fire for URLs that return 404; a live page always wins (https://help.shopify.com/en/manual/online-store/menus-and-links/url-redirect). The legacy `.php` paths do not exist on Shopify, so they redirect.
3. **QR test (required before printing anything new):**
   ```bash
   curl -sI https://sotocalcafes.pt/q/chavena
   ```
   The `Location` header must end in `?utm_source=chavena&utm_medium=qr&utm_campaign=horeca`. If the query string is missing, apply the fallback in SEO.md §9 (`--qr-pages`).
4. `/llms.txt` is **not** redirected. Shopify now serves it natively; the theme customises it with `templates/agents.md.liquid` (GEO.md §5).

## 16. Customer accounts

- Settings → Customer accounts → use **customer accounts** (Shopify's current, passwordless version). The theme links to `routes.account_url` and styles only what it controls (header icon, password page, legacy templates as fallback). Login and order pages are hosted by Shopify.
- Subscription management (pause, skip, cancel) appears there automatically with the Shopify Subscriptions app.

## 17. Launch checklist

1. Prices, formats, SKUs/GTINs confirmed; `preco-provisorio` removed; products set to **Active**.
2. FIC metafields complete for every food product.
3. `show_tbc_markers` **off**; search the storefront for "[[TBC" and get zero results.
4. Free-shipping rate matches `free_shipping_threshold`.
5. Policies, RAL entity and accessibility statement final; Livro de Reclamações registration confirmed.
6. Shopify cookie banner off, theme banner on; consent tested (accept, reject, choose).
7. Custom pixel connected; one test lead visible in Meta Test Events and GA4 DebugView.
8. EN handles set; hreflang checked (SEO.md §10).
9. Redirects imported; QR curl test passed.
10. Double opt-in on; contact and sender emails correct.
11. Password page off.

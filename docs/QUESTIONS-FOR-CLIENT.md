# Questions for Sotocal

Every `[[TBC]]` in the theme and the docs maps to one question below. Answers can go straight into Shopify admin (products, metafields, metaobjects, theme settings) unless a row says otherwise. While the theme setting **Pré-lançamento › Mostrar marcadores [[TBC]]** is on, each gap is visible on the storefront (behind the password page) so you can review it in place. Turn it off at launch.

Priority: **A** = blocks launch (legal, price or a fact shown to shoppers). **B** = needed soon after launch. **C** = improves the site.

## 1. Prices, products and food information

| # | Pri | Question | Where it shows |
|---|---|---|---|
| 1 | A | Final prices and SKUs for every variant (Formato Grão/Moído × Peso 250 g/1 kg) and every other product. All are 1,00 € placeholders tagged `preco-provisorio`. | Every price, €/kg, product schema |
| 2 | A | Barcodes (EAN/GTIN) per variant, if you have them. | Product schema |
| 3 | A | Food information per product (EU 1169/2011): ingredients, allergens, net quantity, storage, best-before wording, origin wording, nutrition table (or confirmation of exemption). Spec sheets are enough. | "Informação alimentar" on every product |
| 4 | ✓ | ~~Official product names.~~ **Answered by the leaflet (29/10/2026):** Lote Super Milano, Lote Super, Lote Reggio, Descafeinado. Applied. | Product titles, homepage fold 3 |
| 5 | A | Free-shipping threshold: is it 40 €? | Announcement bar, cart progress bar |
| 6 | A | Shipping rates and delivery times: mainland, Azores, Madeira, EU. | Product page "Entrega", cart, product schema |
| 7 | B | Intensity 1–5, "ideal para" and arabica/robusta **percentages** for each blend. The leaflet gave the origins (e.g. Super: Central American and Brazilian Arabicas, West African Robustas) and Reggio's "torra intensa de tipo italiano"; those are applied. | Product page, fold 3, comparison table |
| 8 | B | Decaf: two more descriptors, and are the decaf "unidoses" ESE pods (formats, weights)? Legal check of "sem cafeína" wording. | Fold 3, product |
| 9 | B | ~~Mistura Sako composition~~ (answered by the leaflet: 20% coffee, 80% roasted barley, chicory and grão preto). Still open: what distinguishes Cevada Oriente from Cevada Sotocal, and is "Oriente" a Sotocal brand? | Substitutes, spices |
| 10 | B | Canela: Ceylon cinnamon or cassia? | Product description |
| 11 | B | Conservas: range, brand (legacy photo shows Atum Gaivota), and whether Sotocal produces or distributes them. Tea and infusion range. | Collections |
| 12 | B | Despensa do Norte: exact contents, price and photo (asset A7). | Gift box product and page |
| 13 | B | 2 × 1 kg pack: which blends, price. | Bundle, cart upsell |
| 14 | C | Moka pot and bean-to-cup brewing advice (dose, grind) and which blend you recommend for bean-to-cup machines. | "Como preparar", guide articles |
| 15 | C | Caffeine per serving for your blends, only if you have lab data. | Café e saúde page |

## 2. Subscription, pickup and B2B operations

| # | Pri | Question | Where it shows |
|---|---|---|---|
| 16 | A | Subscription discount and terms (minimum term, skipping, cancelling). | Product purchase options, Subscrição page |
| 17 | A | Café pickup: confirm option (a) in ADMIN-SETUP (a 0 € "Levantamento num café parceiro" rate delivered on your HoReCa route), lead time, and how customers are told the order is ready. | Cart toggle, Levantar no café page |
| 18 | A | Partner cafés: list with address, postcode, district, coordinates, opening hours, pickup yes/no and **written consent to be published**. | Locator, cart pickup list |
| 19 | B | HoReCa process: confirm the four steps (pedido de contacto → visita e prova → proposta e acordo → instalação e formação). | Profissional page |
| 20 | B | Sales mailbox for lead notifications, and promised response time ("Vamos ligar-lhe em breve" — within how long?). | Lead form success message |
| 21 | C | Real testimonials from client cafés, with written permission. The section is built and hidden. | Profissional page |
| 22 | C | Number of HoReCa clients, only if you want to publish it. | Fact sheet |

## 3. Legal and compliance

| # | Pri | Question | Where it shows |
|---|---|---|---|
| 23 | A | RAL (alternative dispute resolution) entity name and URL (CICAP is the usual one for Porto). | Footer |
| 24 | A | Confirm the Livro de Reclamações Eletrónico registration. | Footer |
| 25 | A | Policies: privacy, terms, refunds (14-day withdrawal and the opened-sealed-food exception), shipping. Shopify templates are placeholders. | Footer, product "Envios e devoluções" |
| 26 | A | Legal review of the rewritten "Café e saúde" page (EFSA figures, no health claims). | /pages/cafe-e-saude |
| 27 | A | European Accessibility Act: does Sotocal qualify for the micro-enterprise exemption? The statement is drafted in ADMIN-SETUP. | Declaração de acessibilidade |
| 28 | A | VAT: Azores and Madeira rates in Shopify tax settings; OSS registration for EU sales (accountant). | Checkout |
| 29 | B | EU co-funding (Norte 2020 / Portugal 2020 / FEDER, project 18175): how long must the logos stay, and do you have vector versions? The footer shows them until told otherwise. | Footer |
| 30 | B | Legal name variant: "Cafés Angola" or "Cafés **de** Angola" (the PME Líder certificate uses the second)? | Footer, schema |

## 4. People, history and brand

| # | Pri | Question | Where it shows |
|---|---|---|---|
| 31 | A | José Barbosa's preferred title (presidente, CEO, fundador…). | História, fact sheet, schema |
| 32 | A | Name of the confraria Maria José Barbosa presided over, and the years. Is it the "Confraria do Café" shown on the legacy footer? | História, fact sheet |
| 33 | A | Real portraits of José and Maria José Barbosa, with consent (never AI). Consent for Maria José to appear as the expert author of guides. | História, article bylines |
| 34 | B | More timeline milestones (founders' names, first roaster, new plant, new blends…). | História timeline |
| 35 | B | Values: keep the 11 words from valores.png as a flat list, or group them (suggestion in CONTENT.md)? | História |
| 36 | B | Facts found on the legacy site but not confirmed: 1960 market figures (100+ roasters, 80% substitutes), AICC membership, fax 226 100 458 (also printed on the leaflet: is it still in use?), peanuts and substitutes still roasted in-house. Keep or drop? | CONTENT.md |
| 37 | ✓ | ~~SVG logo.~~ **Answered:** the vector file in the Drive (`Sotocal - Logotipo.ai`) is now the logo everywhere, with the Pantone colours from the colour sheet. | Header, footer, OG images |
| 38 | B | Real photography (asset brief A1–A8): machine cut-out, beans, packshots 1 kg/250 g, roastery, team. Three of Sotocal's own photos from the Drive are used for now at about 1000 px (rights confirmed, question 50); larger originals would look sharper on big screens. | Homepage, product pages |
| 39 | C | Where does Sotocal say "cimbalino" comes from (usually linked to La Cimbali machines)? | Guide article, fact sheet |

## 5. Marketing, analytics and contact

| # | Pri | Question | Where it shows |
|---|---|---|---|
| 40 | A | Canonical Google Maps URL for the head office (the share link is a placeholder). | Footer, contact, schema sameAs |
| 41 | B | Customer-service opening hours. | Contactos |
| 42 | B | GA4 measurement ID and Meta pixel / dataset ID (installed through the official apps, not the theme). | Customer Events |
| 43 | C | Newsletter frequency, to state on the sign-up. | Newsletter |
| 44 | C | External sources for the fact sheet: IAPMEI listings for PME Líder / PME Excelência, press, Wikidata item once created. | Fact sheet |
| 45 | C | Recipe details: yields, oven times and temperatures, and the metric conversions marked in CONTENT.md. | Receitas blog |
| 46 | C | The home meta description given in the brief is 127 characters, under the 140–155 rule. We used a 140-character version that adds «agora em sua casa,». OK? | Home `<meta description>` |

## 6. From the Drive materials (29/10/2026)

| # | Pri | Question | Where it shows |
|---|---|---|---|
| 47 | ✓ | ~~Is the "¿" on the cup mockup intentional?~~ **Answered 29/10/2026:** no, it was a mistake. The site already writes "Português?"; fix the printed cup's artwork before production. | Homepage fold 5 cup, physical cup |
| 48 | ✓ | ~~Which plant is "cidreira"?~~ **Answered 29/10/2026:** lemon balm (*Melissa officinalis*). Applied: EN "Lemon balm infusion" (`/en/products/lemon-balm-infusion`), botanical name in both descriptions (D52). | Product title (EN), description |
| 49 | A | Mistura Sako: what is "grão preto", and what are the shares of barley, chicory and grão preto within the 80 %? EU 1169/2011 lists ingredients in descending order of weight, so we need the order. (Gluten from barley as the only allergen was confirmed on 29/10/2026, see 54.) | Sako ingredients |
| 50 | ✓ | ~~Web-use rights for the leaflet and cup photos.~~ **Answered 29/10/2026:** all are Sotocal's own photos and Sotocal has the rights to use them. Logged in ASSET-LICENSES. | História, A torra, Profissional |
| 51 | ✓ | ~~Should the HoReCa accompaniments be sold to consumers?~~ **Answered 29/10/2026:** yes, at the same price for consumers and professionals. They stay in the shop with one price each; no separate trade price list (D53). | Collection "Complementares", shop |
| 52 | B | Pimenta: do you sell white pepper, black pepper or both, and ground or whole? The leaflet describes both. *Sotocal is checking (29/10/2026).* | Pimenta product variants |
| 53 | ✓ | ~~Is "Cevada torrada moída" the right sales name?~~ **Answered 29/10/2026:** yes; it stays as the Cevada Sotocal subtitle. | Product subtitle and FIC |
| 54 | ✓ | ~~Confirm the barley and peanut allergens.~~ **Answered 29/10/2026:** correct as listed (barley/gluten for Cevada Sotocal, Cevada Oriente and Mistura Sako; peanut for Amendoim Jumbo). No "may contain" warning was given, so none is shown. | "Informação alimentar" |

## 7. Answers of 17/11/2026 and what they opened

Answered: Q30 (legal name, D95), Q33 (Maria José Barbosa consents, D99), Q36 (fax dropped), D1 to D2, D4, D6, D10 and the others in `docs/DECISIONS.md` D90 to D107. Still open from earlier: D3 and D7 (pending), prices (D8), Q5 free-shipping threshold, Q12 gift box, Q14, Q7, Q20, Q23 to Q25, Q28, domain access.

| # | Pri | New question | Why |
|---|---|---|---|
| 55 | A | **Capsules** (D2): product name, which blend, capsules per box, capsule weight, material, price, EAN, ingredients, which Nespresso line (Original or Vertuo) and any other compatible system, who the subcontractor is. | Capsule product and collection cannot be created without it |
| 56 | B | **Offices** (D6): what is supplied (grain, ground, capsules, equipment support), minimum quantity, delivery, who answers enquiries. | The new "Empresas e escritórios" line is only a heading until then |
| 57 | A | **Head-office collection** (D4): collection hours, how customers are told the order is ready, which door, map coordinates. | The collection point and any hours on Google depend on it |
| 58 | B | **Confraria:** exact name and years of Maria José Barbosa as grã-mestre; a real portrait; she reviews each guide before her name goes on it. | Statements and bylines |
| 59 | B | **QR offer:** the text and the discount code. | The QR page shows no offer until then |
| 60 | A | **Lead emails:** the Sotocal address(es) that receive leads, the sender domain for Resend, and where the small service is hosted. DNS access is needed for the sending domain. | Section D101 |
| 61 | B | **Placeholder price:** confirm 40 EUR per kg applies to the coffee blends only (others stay at 1,00 EUR). | D91 |
| 62 | A | **Legal read:** who reviews the consent and Meta data-sharing level, the review wording and the Delta comparison wording. | Launch gate |
| 63 | ✓ | ~~**Photos:** who took them ("Rita"?), how should they be credited, and may they be used on the website and in ads?~~ Answered 18/11/2026: Sotocal took the photos itself, so it owns them; use on the website and in ads is fine. Credit line still to confirm (Sotocal). |
| 64 | B | **Two bags we do not know:** "CherryBar" (roasted beans, "Um bom dia começa com um bom café") and "Café Puro, The Real Portuguese Coffee". Are they Sotocal products, for sale, and for which market? | They appear in the photos but not in the product list |
| 65 | ✓ | ~~**Label vs legal name:** the peanut and Bom Dia labels say "Soc. Torrefactora de Cafés Angola, Lda." and "398 ... 402". Which is the registered name and address for food labels (Q30)? | The operator's name on a food label must match the registry |
| 66 | B | **Spice brand and sizes:** spices are branded "Oriente" (50 g, 25 g, 30 g seen). Is Oriente a Sotocal brand, and what are the exact sizes? Is "Cevada Oriente" the same brand? | Product titles and the Q9 answer |
| 67 | B | **Decaf box (photo 9):** what is it (single-serve pods? how many per box)? Photos of the missing products: colorau, cravinho, chá preto, açúcar, adoçante, Despensa do Norte. | Q8 and the missing packshots |
| 68 | B | **Districts served** (answered in part 18/11/2026: Sotocal distributes to all of Portugal, D119; district-level facts such as delivery days or local clients are still wanted): for each district (and Açores, Madeira), does Sotocal supply cafés and restaurants there today? For each one served: how deliveries work (own vans, carrier, days or frequency) and anything true and specific about the area (clients, years served, a warehouse). Each answer turns one local page on. | D111: `/pages/fornecedor-de-cafe/<distrito>` |
| 69 | C | **Google Business Profile:** the full Maps URL of the profile (not the share short link), to use as `sameAs`. | D114 |
| 70 | B | **Trust FAQ:** is there a subscription (frequency, discount, how to cancel)? What is the returns practice for opened and sealed coffee (Q25 covers the legal text)? | Brief §3 trust FAQ; only facts Sotocal confirms |
| 71 | B | **Equipment for offices:** does Sotocal also place a coffee machine (or other equipment) in offices and companies it supplies, as it does for cafés, restaurants and hotels? If yes, under what conditions (minimum consumption, formats)? | D115: B2B page section "Máquina de café…" |
| 72 | A | **Pre-launch site:** may we publish the static site (brand, history, business page, contacts, FAQ, calculator, Porto) at sotocalcafes.pt before the online shop opens? It needs DNS access (or a temporary address), and a reviewed privacy policy if the business form should send emails (Q25, Q62). | D117, `docs/seo/16-static-prelaunch.md` |
| 73 | A | **Islands:** "Sotocal distributes to all Portugal" (18/11/2026). Does that include the Azores and Madeira? If yes, how (own delivery, carrier)? The two island pages are ready and stay drafts until you say. | D119 |
| 74 | B | **Sources for the cevada and chicória guides:** a citable source for "barley contains no caffeine" and for the definition of chicory (INSA/PortFIR or similar). They are live without one (D118); add when found. | D118 |

# WS2: information architecture and URL map

Date: 17/11/2026. Launch is PT-PT only (D58). This workstream changed **no theme or store files**. It produced the reconciled URL map and fixed two keyword cannibalisations.

Deliverables: [url-map.csv](url-map.csv) (83 URLs) and an updated [keyword-map.csv](keyword-map.csv).

## 1. Rules applied

1. One primary keyword per URL, one URL per intent. Where several queries share an intent they point at one URL (listed in `also_answers`).
2. Product pages without a measured query use "product name + brand" as the primary term, so they cannot compete with each other.
3. A URL is indexable at launch only if its blockers are cleared (quality gate 4). Until then it stays draft, unpublished or `noindex`.
4. No years in URLs. PT handles only; English is unpublished until phase 2.
5. Nothing is built for a keyword the keyword map marks `reject`.

## 2. The prompt's URL table against what is built

| Prompt URL | Built URL | Verdict |
|---|---|---|
| `/collections/cafe-em-grao` | same | keep |
| `/collections/cafe-em-grao-1kg` | none | **drop**: it would list the same four blends as the grain collection. 1 kg is a variant on each PDP |
| `/collections/cafe-moido` | same | keep |
| `/collections/capsulas-compativeis-nespresso` | none | conditional on D2; no capsule product exists |
| `/collections/cevada-e-chicoria` | `/collections/sucedaneos-do-cafe` | keep the repo handle (redirects and translations already use it) |
| `/collections/chas-e-infusoes`, `/collections/especiarias` | `/collections/complementares` (teas, infusions, sugar, decaf doses, peanuts), `/collections/especiarias` | keep. A teas-only collection would hold two products |
| `/collections/cabazes-e-presentes` | `/collections/presentes` | keep repo handle |
| `/pages/para-empresas` | `/pages/profissional` | keep repo handle (already a redirect target) |
| `/pages/onde-levantar` | `/pages/levantar-no-cafe` and `/pages/onde-beber-sotocal` | keep both; hidden until a café consents (D3) |
| `/pages/subscricao`, `/pages/historia` | same | keep |
| `/pages/metodo/{handle}` and `/pages/maquina/{handle}` | none yet | to build: metaobject definitions and templates (WS3, WS5) |
| `/pages/sucedaneos/{handle}` | none | **not adopted**: the collection and four PDPs already cover it; factual answers become guides in phase 3 |
| `/pages/calculadora-custo-chavena`, `/pages/qual-o-cafe-para-a-minha-maquina` | none | to build (WS6) |
| `/blogs/guias/{handle}` | `/blogs/guia-do-cafe/{handle}` | keep repo handle |

The repo also has pages the prompt does not list: `/collections/cafe` (lotes overview), `a-torra`, `arabica-e-robusta`, `sobre-a-sotocal`, `perguntas-frequentes`, `contactos`, `declaracao-de-acessibilidade`, `cafe-e-saude`, `despensa-do-norte`, the QR pages and a recipes blog.

## 3. Launch set

**40 URLs are indexable on day 1 once their blockers are cleared** (the prompt aims for about 25–35). Of these, 11 have no blockers today and 29 wait on client data.

| Group | Count | URLs |
|---|---|---|
| Home | 1 | `/` |
| Collections | 5 | `cafe`, `cafe-em-grao`, `cafe-moido`, `especiarias`, `complementares` |
| Product pages | 18 | 4 blends, 6 spices, 8 accompaniments (all blocked on price Q1, food information Q3, GTIN Q2) |
| Pages | 9 | `historia`, `sobre-a-sotocal`, `a-torra`, `arabica-e-robusta`, `profissional`, `subscricao`, `perguntas-frequentes`, `contactos`, `declaracao-de-acessibilidade` |
| Policies | 4 | privacy, refund, shipping, terms (Shopify placeholders, Q25) |
| Blog | 3 | `/blogs/guia-do-cafe` plus two guides (see below) |

The 40 are 28 commerce and brand URLs plus 12 legal and support URLs that are not search targets. If you want the set closer to 35, the first cuts are the 8 accompaniment product pages (low search value but real products) and the accessibility statement.

**Conditional (16 URLs, 11 indexable if the decision or build lands):** the substitutes collection and 4 PDPs (D1), gift collection and Despensa do Norte (D5, Q12), pack 2 x 1 kg, the locator and pickup pages (D3), three method hubs, the calculator, the quiz, and the capsule collection (D2).

**Not indexable by design:** `/pages/despensa-do-norte` (same intent as the product), `/pages/cafe-e-saude` (until legal review, Q26), the two QR pages, search, cart and account. `/collections/conservas` stays unpublished until a range exists (Q11).

## 4. Two changes to the plan

- **Two guides move into the launch set.** `/expresso.php` and `/curiosidades.php` redirect to `como-tirar-o-melhor-expresso` and `curiosidades-do-cafe`. If those articles are not published at cutover, the redirects land on a 404 and the prompt's "no old URL may 404" is broken. They carry rewritten legacy content (`docs/CONTENT.md`), so they are low risk. The curiosidades article contains legacy facts the client has not confirmed (Q36): remove those lines or confirm them. All other guides and the six recipes wait for phase 3 batches (at most 10 URLs each).
- **Two keywords moved to remove cannibalisation** (in `keyword-map.csv`):
  - `café português` from `/` to `/collections/cafe`, so the home page keeps the brand queries.
  - `máquina café moído` from `/collections/cafe-moido` to the espresso-machine hub, because machine owners and ground-coffee shoppers want different pages.

## 5. Checks run

| Check | Result |
|---|---|
| Duplicate URLs in the map | none |
| Duplicate primary keywords | none |
| Every non-rejected keyword target exists in the map | yes, except the generic `/pages/maquina/<model>` placeholder, covered by three model rows |
| URLs answering more than one cluster | `/` (brand + "comprar café online", same page by design), `/pages/profissional` (B2B + corporate gifts section), `/pages/a-torra` (two torrefação queries). Accepted |

I did not run the content-uniqueness gate (40% unique text) or the link-count gate (3 in, 3 out): those need the finished templates and belong to WS4 and WS5.

## 6. Decisions needed

- **D12: keep the repo's URL handles** instead of the prompt's names (recommended).
- **D13: no `/collections/cafe-em-grao-1kg`** (recommended).
- **D15 (new): publish the two legacy-redirect guides at launch** (recommended) rather than redirecting those old URLs to a collection.
- Whether to trim the launch set from 40 toward 35 as above.

Not yet logged in `docs/DECISIONS.md`, since you haven't approved them.

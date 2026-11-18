# WS11: editorial plan

Date: 17/11/2026. Launch is PT-PT only (D58). No theme change this step: the work is the plan, a guide quality gate, and the first drafts. **Of 5 drafts, 1 passes the gate; 4 are blocked by facts only Sotocal or a cited source can supply.**

## 1. Rules (brief WS11) and how they are enforced

| Rule | Enforcement |
|---|---|
| 4 to 6 guides a month, PT-PT, batches of at most 10 URLs | Calendar below. The next batch waits until the previous one is at least 70% indexed (ledger, WS13) |
| Answer block of 40 to 70 words under the H1 | `npm run check:guides` fails outside that range |
| Title under 60, description under 155, one H1, keyword in title and H1 | Same script (it caught two over-long descriptions) |
| Author with real credentials, sources, last-updated date | Date and sources are required by the script; author is a warning until D9 is answered. **Default author: "Sotocal" (Organization), no Person schema**, because no named author or credentials are confirmed |
| One product module and at most one commercial link per 300 words | Script counts links to `/products/`, `/collections/`, subscription and business pages against the word count (the first run caught three drafts with none and one with too many) |
| At least 3 internal links out and 3 in | Out is checked per draft. In is counted among drafts and finished at build from hubs and collections (reported as a warning) |
| No health claims, every third-party fact sourced and dated | Script flags health wording; sources are required; the Sotocal-specific facts come from the fact sheet |
| No unresolved `[[TBC]]` | Reported as BLOCKED; a blocked guide must not be published or indexed |

The script reads `docs/seo/drafts/*.md` (front matter: title, seo title and description, answer, author, last reviewed, sources, keywords). Current result: **1 pass, 4 blocked, 0 fail**.

## 2. Calendar

Dates assume the store goes live in early December (D84). If it slips, shift everything; the batches stay in this order.

| Batch | When | Guides (URL under `/blogs/guia-do-cafe/`) | State |
|---|---|---|---|
| 0, launch | at go-live | `como-tirar-o-melhor-expresso`, `curiosidades-do-cafe` (redirect targets, D63) | Rewritten legacy copy; unconfirmed legacy facts to remove (Q36) |
| 1, substitutes | December | `cevada-tem-gluten`, `cevada-tem-cafeina`, `o-que-e-a-chicoria`, `cafe-com-chicoria-como-fazer` | 1 draft passes; 3 blocked (below). Needs D1 |
| 2, machine owners | January | `melhor-cafe-em-grao-maquina-automatica`, moagem (a hub), `como-limpar-e-regular-a-maquina-automatica` | Blocked by Q14; the cleaning guide needs manufacturer manuals as sources |
| 3, comparisons | January to February | `melhor-cafe-em-grao-portugal`, `cafe-delta-alternativas`, `melhores-torrefacoes-do-norte` | WS7: drafted; blocked by specialty prices, the Sotocal price (D8), a legal read |
| 4, coffee knowledge | February | `data-de-torra` (D10), `como-guardar-cafe-em-grao` | Needs Sotocal's own advice and a source. The Arábica/Robusta guide already exists as a page |
| 5, recipes and seasonal | spring to summer | `como-fazer-cafe-gelado` (summer), `cabaz-de-natal-produtos-portugueses` (from October) | Needs a real Sotocal recipe; gift box facts (Q12) |

Not planned as separate guides: "café na cafeteira italiana" and "moagem" are method hubs (one URL per intent), and "Arábica e Robusta" is already `/pages/arabica-e-robusta`.

## 3. Batch 1 in detail (substitutes)

| Guide | Draft | What is verified | What is missing |
|---|---|---|---|
| `cevada-tem-gluten` (also answers chicória) | **Passes the gate** | The law: Annex II, point 1 of Regulation (EU) 1169/2011 lists barley among the gluten cereals. **I read it on EUR-Lex (Portuguese text) today.** The product facts (barley declared as an allergen in Cevada Sotocal, Cevada Oriente and Mistura Sako; Bom Dia is 25% coffee and 75% chicory) are Sotocal's | D1 confirmation and a legal read of the wording |
| `cevada-tem-cafeina` | Blocked | Sotocal's blends with coffee (Bom Dia 25%, Sako 20%) contain the caffeine of the coffee they contain | **A citable source for barley itself.** I found none I can use: a retailer page and a journal snippet say roasted barley has none, but I have not read the paper; a US food database lists a generic "cereal grain beverage, powder" at 19 mg of caffeine per 100 g and 0 mg when prepared with water, which is a different, unspecified product. Do not publish an answer until a primary source (INSA's food composition table, or a barley-specific study) is read |
| `o-que-e-a-chicoria` | Blocked | Sotocal's history: leader in roasted substitutes within four to five years of 1960; bought a chicory producer in the Azores in the early 1970s; the two blends | A citable one-line definition; Sotocal's preparation advice |
| `cafe-com-chicoria-como-fazer` | Not drafted | Nothing beyond the blend composition | Sotocal's dose and method for the Bom Dia blend |

## 4. Guide template

Front matter (keys in `docs/seo/drafts/cevada-e-chicoria-tem-gluten.md`), then: H1; **Resposta direta** (40 to 70 words); 3 to 5 H2 sections; a single product or collection link; 3 internal links to hubs and other guides; a **Fontes** list with URLs; "Última revisão". Write plainly and specifically; nothing the brand has not confirmed.

## 5. Open items and decisions

- **D1:** confirm that Sotocal still produces and sells the substitutes (the leaflet suggests yes); batch 1 depends on it.
- **D9:** a named author and real credentials; until then "Sotocal".
- **Sources:** someone needs to read INSA's food composition table (or another primary source) for barley and chicory before the caffeine and definition guides can be answered.
- **Q14, D10, Q12:** unblock batches 2, 4 and 5.

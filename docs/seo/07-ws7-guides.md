# WS7: listicles and comparisons

Date: 17/11/2026. Launch is PT-PT only (D58). This is the first Phase 3 batch (5 URLs, within the limit of 10). **None of the five guides can publish yet.** I built the comparison machinery, collected real dated prices, and drafted what the facts allow. Nothing was applied to a store.

## 1. Real price data (the part that was missing)

I read **25 product pages on Continente Online on 17/11/2026** (price, pack size, GTIN, availability, and the shop's recommended retail price where shown). They are seeded as 25 DRAFT `competitor` entries (D73), covering 8 brands: Continente (own label), Inducci, Delta, Nicola, Sical, Lavazza, Buondi and 3 Corações. 11 are 1 kg packs.

Findings that matter for the guides:

| Finding | Detail |
|---|---|
| 1 kg whole bean at Continente | From **10,99 €/kg** (Continente Supremo) to **25,99 €/kg** (Delta Lote Superior) |
| Delta, 1 kg | 19,99 €, 21,99 €, 25,99 € |
| Nicola, 1 kg | 16,99 €, 19,99 €, 21,99 € |
| Sical 5 Estrelas Lote Clássico, 1 kg | 17,49 € (promotion; recommended price 24,99 €) |
| **The brief's Delta figure was a recommended price, not the shelf price.** | Delta Lote Portugal, 750 g: 12,99 € on the shelf (17,32 €/kg); the recommended price shown was 18,99 € (25,32 €/kg). The brief's "€25.32" is the latter |
| Promotions | 7 of the 25 prices were below the recommended price. They are labelled "Promoção", never mixed with regular prices |
| Sotocal's assumed 22 €/kg | Sits level with Delta Lote Chávena and Nicola Lote Selecto (both 21,99 €/kg) and about twice Continente's own label. A real price (D8) is still needed |

**Gaps:** every price comes from one retailer. I could not read any specialty roaster (a US-only search tool and no usable product pages for Combi, Fábrica, Torrié and others), so the "8 brands across tiers including specialty" requirement is met on brand count but not on tiers.

## 2. What was built

| Piece | Behaviour |
|---|---|
| `snippets/article-comparison.liquid`, hooked into the guide template when `sotocal.compared` is set | Disclosure «somos a Sotocal; esta lista é nossa»; criteria text; a table with brand and product, pack, price, price per kg, normal or promotion, and source link with date; a 90-day staleness flag; a note with the range of dates read; an ItemList schema. **Sotocal is always the last row**, only for products without the placeholder-price tag, and the "when not to choose Sotocal" block shows when Sotocal is on the list. No logos, no quality claims (D74) |
| `snippets/article-sources.liquid` | "Última revisão" and the list of sources; `dateModified` in the schema uses the real review date |
| Direct-answer block | The `sotocal.answer` field now renders under the H1 |
| Article metafields | `compared`, `criteria`, `self_included`, `when_not` added to the definitions |
| Tests | `tests/guides.spec.mjs`: disclosure, Sotocal last, every source linked with `nofollow`, stale flag, promotion label, ItemList |
| Contrast fix | The first axe run caught a link contrast failure on the highlighted Sotocal row; I replaced the tinted row with a bold row and a top rule |

## 3. The five guides

| Guide | Status | What blocks it |
|---|---|---|
| `melhor-cafe-em-grao-portugal` | Draft written (65-word answer, criteria, price notes) | Specialty prices; Sotocal price (D8); Sotocal's "when not to choose" text |
| `cafe-delta-alternativas` | **Closest to ready**: draft and data complete for other brands | D14 (repo says do not target competitor brands); a legal read of the wording; Sotocal price for its row |
| `melhor-cafe-em-grao-maquina-automatica` | Skeleton | Q14: the blend Sotocal recommends and why |
| `melhores-torrefacoes-do-norte` | Skeleton | A verified, sourced list of roasters (none verified yet; brief names are leads only) |
| `cabaz-de-natal-produtos-portugueses` | Skeleton | Q12 (gift box contents, price, photo) and D5 |

Drafts are in `docs/seo/drafts/` (D75). Their direct answers use only figures in the seeded data; word counts and character counts were checked.

## 4. Checks

| Check | Result |
|---|---|
| Theme Check | 0 errors, 11 warnings (the same `agents` ones) |
| Locales | 571 = 571 storefront keys |
| Prototype, JSON-LD | 62 pages, valid; two ItemList nodes |
| axe and keyboard | all pass (129 tests across axe, guides and tools) |
| Guide and tools tests | pass |
| Not run | A real store; Lighthouse on the new block; legal review |

## 5. Decisions and next steps

- **D14 (carried from recon):** may the Delta comparison go ahead? It is the page with the most verified data. Recommendation: yes, with a legal read of the wording first, and update `docs/SEO.md`, which says the opposite.
- **Specialty tier:** someone needs to read prices from a few specialty roasters' own shops (name, product, price, URL, date). I can add them as entries once you have the pages or an approved source.
- **Refresh cycle:** competitor prices decay. Re-read before publishing and every quarter; the 90-day flag shows when one is stale.
- **Next batch:** the substitutes questions (WS11) wait for D1 and cited sources; the method hubs wait for Q14.

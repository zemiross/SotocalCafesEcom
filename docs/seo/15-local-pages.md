# Local supplier pages: "fornecedor de café <distrito>"

18/11/2026. Decision D111. Question Q68.

## What exists

| Item | Where |
|---|---|
| Data type `service_area` (12 fields, web pages at `/pages/fornecedor-de-cafe/<handle>`) | `store-setup/metaobject-definitions.json` |
| 20 entries: 18 districts plus Açores and Madeira | `store-setup/metaobject-entries.json` |
| Template and section | `templates/metaobject/service_area.json`, `sections/main-service-area.liquid` |
| Indexing gate | `snippets/robots-meta.liquid` |
| Title, breadcrumbs (Home › Profissional › page), `Service` JSON-LD with `areaServed` | `snippets/meta-tags.liquid`, `snippets/breadcrumbs.liquid`, `snippets/structured-data.liquid` |
| Links from the B2B page, only to pages that pass the gate | `sections/horeca-supply.liquid` |
| Lead form preselects the page's district | `sections/lead-form.liquid` |
| Tests | `tests/local.spec.mjs` |

Each page shows:

- H1 "Fornecedor de café no Porto" (the `in_name` field holds the preposition: no Porto, em Lisboa, na Guarda, nos Açores).
- The area's short answer.
- Local facts.
- Deliveries in the area.
- The area contact role.
- One shared paragraph on what Sotocal supplies, linked to `/pages/profissional`.
- The consenting partner cafés in that district, with a link to the locator.
- FAQ.
- The B2B lead form.

## When a page goes live

A page is indexable only when all three are true:

1. `served` is ticked: Sotocal confirms it supplies that district today.
2. The page has local content of its own: `delivery`, `local_facts`, or at least one partner café in the district with `consent_publish`.
3. The short answer has no `[[TBC`.

Otherwise the page renders with `noindex,follow`. The entry is also DRAFT in Shopify, so it returns 404 until someone publishes it.

| Area | Status at launch | Why |
|---|---|---|
| Porto | Live, indexable | Roastery and HQ since 1960, Rua Engenheiro Ferreira Dias, n.º 398; HQ is the online-order collection point (D94) |
| The 17 other districts, Açores, Madeira | DRAFT, noindex | No confirmed service or local facts yet (Q68). The brief says Sotocal supplies HORECA "from Minho to the Algarve", but it gives no district-level detail |

## Why not 20 live pages today

The brief forbids city pages built from a template with the city swapped (§4, WS8). The reason is concrete: comprarhielo.com's 273 such pages are the example of what not to do. Google calls these doorway pages and can demote the whole site for them.

The quality gate needs two things a city swap cannot give:

- ≥ 40 % unique text against sibling pages;
- at least one element no sibling has.

Measured demand is also small:

| Keyword | Ubersuggest PT, 17/11/2026 | Target |
|---|---|---|
| fornecedores de café em portugal | 70 | `/pages/profissional` |
| fornecedor de café | 50 | `/pages/profissional` |
| fornecedor de café porto | 0 | `/pages/fornecedor-de-cafe/porto` |
| fornecedor de café lisboa | 0 | `/pages/fornecedor-de-cafe/lisboa` (gated) |

Zero measured volume does not mean zero searches, and these are high-value B2B leads. So every page is ready, and each goes live as soon as Sotocal gives one true, specific fact about the district.

## How to turn a district on (Admin, no theme change)

1. Content › Metaobjects › Zona servida › open the district.
2. Tick "A Sotocal serve esta zona".
3. Write the short answer (40–70 words, specific to the district; nothing copied from another district).
4. Fill "Entregas nesta zona" and/or "Factos locais" with facts from Sotocal.
5. Optional: the zone contact role, and FAQ entries.
6. Set "Revisto em" to today, then set the status to Active.
7. Run `npm run check:seo` on the prototype, or check the live page: no `noindex`, and the B2B page now links to it.

A partner café that consents to publication and sits in the district also counts as local content (it appears on the page automatically).

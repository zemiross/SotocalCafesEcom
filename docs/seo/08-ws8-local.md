# WS8: local SEO

Date: 17/11/2026. Launch is PT-PT only (D58). Part code, part checklist for you and Sotocal: Google Business Profile, directory listings and consent are not things code can do. Nothing was applied to a store or to any external profile.

## 1. Findings

| Finding | Detail |
|---|---|
| **A real bug, fixed (D80).** | The structured data built its base URL with `remove_last: '/'`, which strips the last slash anywhere. `https://sotocalcafes.pt` became `https:/sotocalcafes.pt`, so every `@id` and `url` (Organization, WebSite, Person, Product) was malformed. The JSON-LD check passed because it only checks that fields exist. Found while testing LocalBusiness |
| **The legal name is not consistent across sources.** | The legacy site and the brief say "Cafés Angola". Trademark records at INPI (the Portuguese IP office) name the holder "Sociedade Torrefactora de Cafés **de** Angola, Lda.", and the PME Líder certificate uses the same form (client question 30). Every directory must carry the registered name: confirm it from the *certidão permanente* |
| Address variants | Legacy site and theme: Rua Engenheiro Ferreira Dias, n.º 398, 4100-246 Porto. A directory (Empresite) lists "398/402" and the Ramalde area. Ask Sotocal whether 402 is a second door of the same premises |
| Phone and fax | Legacy site and leaflet: T. 226 167 020 (call to a Portuguese landline) and F. 226 100 458. The theme shows the phone only; the fax is an open question (Q36) |
| Where Sotocal already appears | INPI trademark records and the Empresite directory (source links in the sources list). Not checked: Google Business Profile, Páginas Amarelas, Racius, Informa D&B, Einforma (no access) |

The theme's own NAP is consistent: footer, contact page and Organization schema all use the same address and +351 226 167 020.

## 2. Code changes

| Change | Detail |
|---|---|
| `snippets/cafe-count.liquid` (new) and D77 | Locator and pickup pages, their footer and product links and the pickup promise appear **only while at least one café has written consent** (`consent_publish`; for pickup also `pickup_enabled`). With none, both pages are `noindex`. The "Onde beber" and "Levantar" items were also removed from `store-setup/menus.json` and `agents.md.liquid`; add them to the admin menu when the first café is published |
| `LocalBusiness` gate (D78) | New settings "A sede recebe público" and "Horário da sede". The `LocalBusiness` node (name Sotocal, same address and phone, `parentOrganization` the Organization, `openingHours`) is emitted on the home page **only** when the box is ticked and hours are filled. Off by default, which is the brief's default for D4 |
| QR landing (D79) | Printed URL `/pages/q-chavena?c=<codigo-cafe>` (or `q-acucar`). The code becomes `utm_content` and goes into `qr_landing_view`; codes are limited to `a-z`, `0-9`, `-`, 40 characters. The page is now `noindex` (it was not before). Optional first-order offer text and a Shopify discount code are section settings; blank means no offer |
| Existing and unchanged | The locator already groups cafés by district with search and a map that loads only on request (no third-party request before), lists only consenting cafés, and has no per-café or per-city pages |
| Tests | `tests/local.spec.mjs`; the prototype gained a "no cafés" mode to verify the empty state |

## 3. Checks

| Check | Result |
|---|---|
| Theme Check | 0 errors, 10 warnings |
| Locales, JSON-LD | in sync; valid; ids now `https://sotocalcafes.pt/#organization` |
| Empty-café state | Both pages `noindex`; footer, product-page and agents links gone |
| LocalBusiness | Verified on and off with the settings |
| axe, keyboard and all functional tests | 136 passed |
| Not run | A real store; any external profile |

## 4. Google Business Profile (for Sotocal to set up; I cannot access it)

| Field | Recommendation |
|---|---|
| Name | Exactly "Sotocal". No keywords, no city, no "Cafés" |
| Type | Service-area business unless D4 is "yes" (then a normal location). Under the default, hide the address and list the service area |
| Categories | Choose from GBP's own list; candidates to check: coffee roaster (primary), coffee wholesaler, coffee store (only if the public can buy at the premises) |
| Address and phone | Rua Engenheiro Ferreira Dias, n.º 398, 4100-246 Porto; +351 226 167 020. Same as the site |
| Hours | **Only if the public can visit or collect (D4).** Otherwise leave blank. Customer-service hours are a separate question (Q41) |
| Website | The brief says `/pages/historia`; the home page is the usual choice, so decide. Add UTM `utm_source=gbp&utm_medium=organic` either way |
| Description | The entity statements, verbatim: «A Sotocal é uma torrefação portuguesa fundada em 1960, no Porto. José Barbosa, um dos sócios fundadores, continua a liderar a empresa. A Sotocal fornece cafés, restaurantes e hotéis do Minho ao Algarve e vende online para Portugal continental, Açores, Madeira e União Europeia.» (about 270 characters) |
| Photos | Real only (rights confirmed in ASSET-LICENSES): green coffee sacks and old grinder, coffee cherries, espresso in a Sotocal cup, the roastery and packs once photographed. No AI people |
| Products | The four blends, each linked to its product page after launch, with real prices only |
| Posts | Monthly: new format, subscription, Christmas box, café stories (only with consent) |
| Reviews | Ask after delivery; never incentivise (WS12) |
| Maps URL | The Maps link in the theme settings is a placeholder (Q40); replace it with the real profile URL and add it to the Organization `sameAs` |

## 5. NAP and directories (claimed by José or Sotocal, not code)

Use one form everywhere: **Sotocal**, Sociedade Torrefactora de Cafés [**de**] Angola, Lda. (confirm, Q30), Rua Engenheiro Ferreira Dias, n.º 398, 4100-246 Porto, +351 226 167 020, sotocalcafes@sotocalcafes.pt, NIF 500 275 068.

| Directory | Action |
|---|---|
| Google Business Profile, Apple Business Connect, Bing Places | Create or claim; same data as above |
| Facebook, Instagram | Bio uses the short bio from `docs/GEO.md` and the site link |
| Páginas Amarelas, Racius, Informa D&B, Einforma | Search for existing listings, claim, correct name, address and phone |
| Empresite | Listing exists; check the name and the "398/402" address |
| INPI | Trademark holder name differs ("de Angola"); update only if the registered name is confirmed otherwise |

Keep a log of each profile: URL, date claimed, data as shown.

## 6. Click and collect locator

Rules in force: one locator page grouped by district; only active entries with written consent; no individual café pages unless a café has unique content (`pickup_notes`) and has consented; **no city pages without a pickup point**; the pages stay hidden and `noindex` until the first consent exists. The café list is a client answer (Q17, Q18). The FAQ and fact-sheet seeds still mention collecting at partner cafés: edit those lines until D3 is answered.

## 7. QR codes

- Print `https://sotocalcafes.pt/pages/q-chavena?c=<codigo-cafe>` (cups) or `q-acucar` (sachets), one code per café, for example `cafe-ramalde-01`. Do not print the `/q/chavena` redirect: it cannot carry the café code.
- Measurement: `qr_landing_view` carries source and café; the order's UTMs carry `utm_content=<code>`.
- Offer: the first-order offer text and discount code are Sotocal's decision (new question below).

## 8. Decisions and questions

- **D4 (decided, D94): collection only, not a shop.** The head office can be a pickup point; hours and the "order ready" process are still to give.
- **D3:** the list of cafés with written consent; the locator stays hidden until then.
- **Legal name (Q30):** "Cafés Angola" or "Cafés de Angola", and whether the premises are 398 only or 398/402. Raise priority: every directory depends on it.
- **New question:** is there a first-order offer for QR visitors (text, and a discount code)? Blank means none.
- **GBP website link (decided, D102): the home page.**

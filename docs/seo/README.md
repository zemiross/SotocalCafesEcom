# SEO and GEO programme: index and status

Closed 17/11/2026. Thirteen workstreams delivered, each with a report. Launch language is PT-PT only (D58). Decisions D58 to D89 are in [../DECISIONS.md](../DECISIONS.md). **Nothing has run on a real Shopify store** (none exists yet); everything was tested on the LiquidJS prototype.

## Reports

| File | What it covers |
|---|---|
| [00-recon.md](00-recon.md) | Theme map, platform constraints, old URLs, data gaps |
| [01-ws1-technical.md](01-ws1-technical.md) | noindex rules, robots.txt AI groups, menu fix |
| [02-ws2-ia.md](02-ws2-ia.md) | URL map (83 URLs, 40 indexable at launch) |
| [03-ws3-data-layer.md](03-ws3-data-layer.md) | Metaobjects and metafields |
| [04-ws4-templates.md](04-ws4-templates.md) | Product and collection templates, "avise-me" |
| [05-ws5-hubs.md](05-ws5-hubs.md) | Method and machine hubs, doorway guard |
| [06-ws6-tools.md](06-ws6-tools.md) | Cost-per-cup calculator, machine quiz |
| [07-ws7-guides.md](07-ws7-guides.md) | Comparison block, 25 dated competitor prices, five drafts |
| [08-ws8-local.md](08-ws8-local.md) | Locator gating, LocalBusiness, QR pages, Google profile |
| [09-ws9-gifts.md](09-ws9-gifts.md), [christmas-2026-plan.md](christmas-2026-plan.md) | Natal state, gift message, company gifts, go/no-go path |
| [10-ws10-b2b.md](10-ws10-b2b.md) | HoReCa page, district field, Service schema, mailbox forwarding |
| [11-ws11-editorial.md](11-ws11-editorial.md) | Editorial calendar, guide gate, drafts |
| [12-ws12-geo-offsite.md](12-ws12-geo-offsite.md), [geo-prompts.md](geo-prompts.md) | GEO prompts, off-site plan |
| [13-ws13-measurement.md](13-ws13-measurement.md) | Events, UTMs, AI referrals, ledger |
| [14-plan-gap-review.md](14-plan-gap-review.md) | Line-by-line review of the brief (18/11/2026): done, missing, Torrié/Bicafé study, top launch gaps |
| [16-static-prelaunch.md](16-static-prelaunch.md) | Static pre-launch site without Shopify: what is on it, what the build refuses, how to deploy, how to move to Shopify |
| [15-local-pages.md](15-local-pages.md) | District supplier pages "fornecedor de café <distrito>": gate, status, how to turn one on |

Data files: `keyword-map.csv`, `url-map.csv`, `old-urls.csv`, `ledger.csv` (and its rendered `ledger.md`), `geo-tracking.csv`, `drafts/`.

## Commands added

`npm run check:guides`, `npm run check:events` (also in `qa`), `npm run ledger`. Existing checks still pass: Theme Check 0 errors, locales in sync, JSON-LD valid, budgets within limits, 146 accessibility and functional tests.

## Real defects found and fixed along the way

- Every structured-data `@id` and `url` had a malformed base URL (`https:/…`), fixed in WS8.
- QR pages were indexable; the main menu linked to `/collections/all`; AI-crawler groups would have opened `/cart` and `/search` if written naively; the Sotocal row of the comparison table failed contrast.

## What blocks launch (all outside the code)

| Need | From | Items |
|---|---|---|
| A Shopify store and dev theme with CLI access | José / Sotocal | Verify robots, hreflang off, JSON-LD, Lighthouse, checkout, forms |
| Prices, GTINs, food information, shipping, policies | Sotocal | Q1 to Q3, Q5, Q6, Q23 to Q25, Q28 (priority A) |
| Gift box contents, price, photo | Sotocal | Q12 |
| Brewing guidance and blend recommendation | Sotocal | Q14 (unblocks three method hubs and two guides) |
| Blend intensity and "ideal para" | Sotocal | Q7 (unblocks the quiz) |
| Legal name and address, head-office visits, café consents | Sotocal | Q30, D4, D3, Q17, Q18 |
| Competitor prices from specialty roasters, a citable caffeine source | José / analyst | WS7, WS11 |
| GA4 and Meta IDs; CRM mailbox | José | Q42, Q20 |
| Legal read of the Delta comparison and review wording | Lawyer | D76, WS12 |

## Decisions answered on 17/11/2026 (D90 to D109)

Go for Christmas 2026; legal name; D1 yes; D2 capsules (subcontracted, Nespresso-compatible); D4 collection only; D6 offices yes; D9 Maria José Barbosa consents (grã-mestre); D10 roast date printed on the pack; leads by Resend; Google profile to the home page; fax dropped; launch set stays 40; collection intros approved; press facts all; owners José and Claude; free review tools only; 33 product photos received.

## Still open

D3 (café consents), D7 (GTINs), D8 (real prices, free-shipping threshold), the **legal read** (what it is: a lawyer or data-protection adviser checking the cookie consent, the Meta data-sharing level, the privacy policy wording, the review page and the Delta comparison), domain and DNS access (needed for Resend's sending domain too), Shopify store and CLI approval, capsule product data (Q55), head-office collection hours (Q57), office offer details (Q56), QR offer text and code (Q59), the lead-email recipients (Q60), photo rights (Q63), unknown bags "CherryBar" and "Café Puro" (Q64), the label-versus-legal-name check (Q65), and the 1 December go/no-go checkpoint.

## First five things to do next

1. Create the Shopify store and give CLI access; push the theme unpublished.
2. Send Sotocal the priority-A questions (`docs/QUESTIONS-FOR-CLIENT.md`), with 24 November as the date for the Christmas path.
3. Run the dev-store checks in `01-ws1-technical.md` section 5 and `13-ws13-measurement.md` section 8.
4. Put the repo under git (it is not today) and commit a baseline.
5. Leave the legacy site running until the redirects are imported and tested.

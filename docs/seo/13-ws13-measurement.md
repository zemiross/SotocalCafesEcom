# WS13: measurement

Date: 17/11/2026. Launch is PT-PT only (D58). Nothing is connected: there is no store, no GA4 property and no pixel ID yet (Q42). This step delivers the measurement plan, two scripts, and the content ledger.

New commands: `npm run check:events` (theme, pixel and docs agree on every custom event), `npm run ledger` (renders `docs/seo/ledger.md` from `ledger.csv` and applies the 70% gate), and `npm run check:guides` (WS11). `check:events` is now part of `npm run qa`.

## 1. Stack

| Layer | Tool | Notes |
|---|---|---|
| Store analytics | Shopify analytics | Sessions, referrers, orders, UTM-attributed sales; no setup |
| GA4 | Google & YouTube app | Page views, product, cart, checkout, `purchase`; also Merchant Center feed |
| Meta | Facebook & Instagram app: Pixel + Conversions API | Day 1, per the brief. See consent below |
| Theme events | Custom pixel (`store-setup/custom-pixel.js`) | GA4 events and, for leads and newsletter, Meta events. No double counting: the apps keep the standard funnel |
| Search | Search Console (domain property by DNS, plus the legacy property), Bing Webmaster | Sitemap submitted on launch day |
| Content | `docs/seo/ledger.csv` | Per batch: URLs, keyword, indexed, impressions, clicks, position, revenue at 14 and 28 days |

**Consent.** The cookie banner uses Shopify's Customer Privacy API, and custom pixels run only for visitors who allow it. Set the custom pixel's permission to "Required" with Marketing and Analytics ticked. **Check the Meta data-sharing level:** `docs/ADMIN-SETUP.md` says "Maximum"; the level must match what the consent banner and privacy policy promise, so confirm it with the legal read (Q25) before launch rather than assume.

## 2. Events and the question each answers

| Question | Event or field | Source |
|---|---|---|
| Revenue, orders, average order value (first orders expected at about 20 to 35 €) | `purchase` | Google & YouTube and Facebook & Instagram apps; Shopify |
| QR scans by café | `qr_landing_view` `{ source, cafe }`; `utm_content=<codigo-cafe>` on the visit and the order | Theme; Shopify UTM attribution |
| Click-and-collect orders by pickup point | Order attributes `pickup_cafe_id`, `pickup_cafe_name`, `pickup_cafe_city` (reliable: order export). Optional `pickup_order` in GA4 from the pixel, **unverified**, guarded | Cart attributes; custom pixel |
| Café chosen for pickup | `pickup_cafe_selected` `{ cafe_id, cafe_city }` | Theme |
| Quiz completion and what it recommended | `quiz_completed` `{ machine, milk, intensity, decaf, recommended }` | Theme |
| Calculator use | `calculator_used` `{ format }` (never the typed prices) | Theme |
| B2B form submissions | `horeca_lead_submitted` `{ type, district, monthly_volume }` (never name, phone or email) → Meta `Lead`, GA4 `generate_lead` | Theme |
| Newsletter and waitlist signups | `newsletter_signup` → Meta custom event, GA4 `sign_up` | Theme |
| Subscription interest | `subscription_selected` | Theme |

`check:events` confirms each of the seven theme events is published, subscribed in the pixel and documented. Register these as **GA4 custom dimensions** (event scope): `format`, `machine`, `milk`, `decaf`, `recommended`, `district`, `type`, `qr_source`, `qr_cafe`, `cafe_id`, `cafe_city`. Mark `purchase`, `generate_lead` and `sign_up` as key events; leave the others as plain events.

## 3. AI referrals

AI assistants send little traffic and often no referrer. Segment what is visible:

- **GA4:** a custom channel group "AI assistants" with the rule *Source matches regex* `chatgpt|openai|perplexity|gemini\.google|claude\.ai|copilot\.microsoft`. Create it before launch; GA4 applies channel groups to past data only when it is a default group, so earlier traffic will not be re-labelled.
- **Shopify analytics:** referrers report, same domains.
- Some visits arrive as "direct"; the monthly GEO test (WS12) is the other half of the picture.

## 4. UTM conventions

| Where | Parameters |
|---|---|
| QR codes (cups, sugar sachets) | `utm_source=chavena` or `acucar`, `utm_medium=qr`, `utm_campaign=horeca`, `utm_content=<codigo-cafe>` (added by the QR landing page) |
| Google Business Profile | `utm_source=gbp&utm_medium=organic` |
| Email | `utm_source=newsletter&utm_medium=email&utm_campaign=<name>` |
| Meta ads | `utm_source=meta&utm_medium=paid&utm_campaign=<name>&utm_content=<ad>` |
| Directories and press | Plain links; add UTM only where Sotocal controls the link |
| Inside the site | Never; it breaks attribution |

Shopify keeps the first-visit UTMs on the order, so revenue per QR code and per café can be read from orders.

## 5. Weekly and monthly review

| Cadence | Metric | Where |
|---|---|---|
| Weekly | Revenue, orders, AOV, share on subscription; leads from the B2B form; QR visits by café; pickup orders by café | Shopify, GA4, order export |
| Weekly | Impressions, clicks, brand position; indexing of the newest batch | Search Console, ledger |
| Monthly | Clicks and position by cluster (beans, machines, substitutes, gifts); tool use; AI referrals; GEO test | Search Console, GA4, `geo-tracking.csv` |
| Monthly | Core Web Vitals field data (LCP, INP, CLS) | Shopify Web Performance, CrUX |

## 6. Content ledger and gate

`docs/seo/ledger.csv` holds the 54 planned URLs in six batches (the launch set of 40, then substitutes, machine owners, comparisons, knowledge, seasonal), with the keyword per URL. After each URL ships, fill the 14-day and 28-day columns from Search Console, then run `npm run ledger`: it renders `ledger.md`, shows each batch's indexed rate, and **blocks the next batch below 70% indexed** (it exits with an error if a later batch has shipped anyway). Batches hold at most 10 URLs except the launch set.

## 7. 90-day targets (directional; revisit with real data)

| Target | Status |
|---|---|
| "sotocal": position 1 | Realistic if the new site is indexed and the old URLs redirect cleanly. Baseline: the legacy site's Search Console data (about 140 searches a month per the keyword tool) |
| "café em grão 1kg": top 10 | Needs the launch collection and product pages indexable (prices, food information) |
| "melhor café em grão portugal": top 10 | Needs the guide, which is blocked (specialty prices, Sotocal price, legal read) |
| "cevada tem cafeína": top 10 (if D1) | **Blocked**: no citable source yet (WS11) |
| Operational (proposed, not from the brief) | At least 90% of the launch set indexed at day 28; every custom event firing in GA4 DebugView; first AI-referral channel group in place before launch |

I have not set revenue or traffic targets: there is no baseline to base them on.

## 8. Measurement QA on the dev store

1. GA4 DebugView: each theme event fires once, with the right parameters and no personal data.
2. Meta Test Events: browser and server events for the same action deduplicate; `Lead` fires on a test form.
3. A test order carries `utm_*` and the `pickup_cafe_*` attributes.
4. With consent refused, no marketing or analytics event fires.
5. No duplicate `purchase` (the apps plus the custom pixel).
6. Search Console: the property verifies, the sitemap is read, URL inspection on one URL per template shows the canonical and the `robots` meta as expected.

## 9. Decisions and open items

- **D89 (decided, D104): José and Claude.** Claude prepares the report from exports or connected sources; it cannot read Search Console or GA4 from here, so exports (or a connection) must be provided.
- **GA4 measurement ID and Meta pixel or dataset ID** (Q42) are needed before the custom pixel can be connected.
- **Meta data-sharing level:** confirm with the legal read (section 1).
- **Pickup-order event:** verify on the dev store whether checkout attributes reach the pixel; if not, rely on the order export.

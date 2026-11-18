# WS9: seasonal gifts

Date: 17/11/2026. Launch is PT-PT only (D58). Built and tested on the prototype; nothing applied to a store. **Christmas 2026 depends on a decision (D5) and on data that is still missing**, so the page is ready but the gift box is not.

## 1. What was built

| Prompt item | State |
|---|---|
| Evergreen collection with a "Natal" state from 1 November to 24 December | `/collections/presentes` keeps its URL (D61, no year). A new `collection.presentes` template adds a Christmas band between 1 November and 24 December every year, with no URL change. A setting can force it on or off (D81) |
| Gift message | Products tagged `presente` get an optional message field, up to 200 characters, saved on the order line. The cart drawer and cart page now show line-item properties (keys starting with `_` stay hidden). How the message reaches the recipient is Sotocal's operational choice and carries a TBC marker (D82) |
| Delivery cut-off dates, mainland and islands | Two theme settings (last order for mainland Portugal, and for the Azores and Madeira). They show on the gifts collection and on gift products during the season. Blank means nothing is shown, so no date is invented. The dates are Sotocal's answer (Q6) and need updating every year |
| B2B gift section for "cabaz de natal empresas" | A `corporate-gifts` section on `/pages/profissional` (anchor `#presentes-empresas`), linked from the gifts collection. **No public prices**: volume pricing is on request. The lead form has a new business type, "Presentes de empresa", so the sales team can tell what the enquiry is about (D83) |
| Pre-order or waitlist page (D5) | A one-off waitlist (the newsletter form, tagged `cabaz-natal`) shows when the gifts collection has no products. A collection with zero products is now `noindex` (any collection) |

The keyword "cabaz de natal empresas" (90 searches a month, CPC $1.32) targets `/pages/profissional` as decided in WS2; the section carries the H2 and the content for it.

## 2. Checks

| Check | Result |
|---|---|
| Theme Check | 0 errors, 10 warnings |
| Locales, JSON-LD, budgets | in sync (586 keys each); valid; JS 59.5 KB, CSS 13.9 KB gzip |
| Functional tests (new `tests/gifts.spec.mjs`) | 4 passed: season band and cut-offs, gift message field with 200-character limit, company gifts section and lead option, cart shows the gift message and hides `_` properties |
| axe and keyboard | all pass (143 tests across all suites) |
| Empty state | Verified: waitlist visible, collection `noindex` |
| Visual | Checked the gifts collection at 1440 px |
| Not run | A real store; checkout behaviour of line-item properties; the email flow behind the waitlist |

## 3. D5: Christmas 2026, live or 2027

Today is 17 November; the season ends 24 December. The code is ready, but a **minimum Christmas launch needs these answers first**:

| Needed | Open item |
|---|---|
| The gift box: contents, price, photo | Q12 (all three missing; the product is a draft at 1,00 €) |
| Food information for everything in the box | Q3, Q49 |
| Prices of all products in it | Q1, D8 |
| Shipping rates, delivery times, last-order dates | Q5, Q6 |
| Policies, returns, RAL, Livro de Reclamações | Q23–Q25 |
| VAT for islands, invoicing app | Q28, accountant |
| DNS cutover from the old site, with redirects tested | Phase 1 needs a dev store first |

I cannot make these true by building more. **Recommendation:** decide by 24 November. If Sotocal cannot return all the items above in about a week, plan for **2027**: the collection, band, dates and company-gift section are already in place and switch on by themselves on 1 November 2027. The waitlist can run on the Shopify password page before launch; the password page already has an email sign-up, but it only shows once the domain points to Shopify, so it cannot collect emails while the old site is still live.

## 4. Open items

- Gift box contents, price and photo (Q12).
- Order cut-off dates for Christmas (set in theme settings each year).
- Minimum quantity and lead time for company gifts [[TBC]]; who answers the enquiries (Q20).
- Whether a printed card or an order note carries the gift message.

## 5. Decisions needed

- **D5:** Christmas 2026 or 2027 (recommendation above).
- Approve company gifts as a section of the B2B page rather than a separate page (D83).

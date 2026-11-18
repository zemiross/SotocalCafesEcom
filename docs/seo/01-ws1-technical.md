# WS1: technical SEO on Shopify

Date: 17/11/2026. Scope: what can be done and tested without a Shopify store. Launch language is PT-PT only (D11/D58). Nothing was published, no store setting or DNS record was touched, and no app was installed.

**Safety note.** The repo is not under git, so there is no branch to work on. Originals of the three files I edited were copied to the session scratchpad (`backup-ws1/`). Run `git init` and commit before the next workstream so changes can be reviewed and reverted.

## 1. What changed

| File | Change |
|---|---|
| `snippets/robots-meta.liquid` (new) | Emits `<meta name="robots" content="noindex,follow">` on `/collections/all`, `/collections/vendors`, `/collections/types`, collection URLs with a tag, an active filter (list or price range) or a non-default sort, internal search, and any **product tagged `preco-provisorio`**. Pagination stays indexable |
| `snippets/meta-tags.liquid` | One line: `{%- render 'robots-meta' -%}` at the end |
| `templates/robots.txt.liquid` | Shopify's default groups unchanged, then an explicit group for GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended and Applebot-Extended. Each group repeats the `*` group's `Disallow` rules and adds `Allow: /` |
| `store-setup/menus.json` | Main menu and footer "Loja" now link to `/collections/cafe` instead of `/collections/all` |
| `docs/SEO.md` §8, `docs/DECISIONS.md` | Updated; new decisions D59 (robots groups) and D60 (noindex rules) |

Two design points worth knowing:

- **Why the AI groups repeat the `*` rules.** A crawler that matches its own group ignores the `*` group. A bare `User-agent: GPTBot` / `Allow: /` would have opened `/cart`, `/checkout` and `/search` to it. Explicit Allow is otherwise redundant, since Shopify's defaults never block these bots.
- **Why products are noindexed by tag.** The prompt's quality gate says a page with an unresolved TODO is not indexable. Today every product has the tag `preco-provisorio` (and is a draft, so it is also out of Shopify's sitemap). When the client confirms a price and the tag is removed, the page becomes indexable with no code change. The other missing facts (food information, GTIN) are not enforced by code; check them by hand before removing the tag.

## 2. Tests

| Check | Result |
|---|---|
| Theme Check | 0 errors, 11 warnings (the same 11 `agents` object warnings as before) |
| `check:locales` | pt-PT 445 = en 445 keys, 437 literal calls resolve |
| `check:redirects` | 35 redirects valid, every legacy URL covered |
| Prototype build and `check:jsonld` | 52 pages built, all JSON-LD valid |
| robots template | Rendered with LiquidJS and mock groups: default groups intact, `Sitemap:` line kept, 7 AI groups each with the `*` rules plus `Allow: /` |
| noindex rules | 13 mock cases: plain collection, default sort, idle filters and a normal page stay indexable; `all`, vendors, tag, sort, active list filter, price filter, search and a placeholder-tagged product are noindexed; a product without the tag is indexable. In the prototype build, products and search carry the tag; collections do not |
| Not run | Playwright screenshots, axe, Lighthouse (only `<head>` changed); anything on a real store |

**Limit:** the robots test used mock default groups, and the filter test used mock `collection.filters`. Confirm both against a real store (section 5).

## 3. Audit of the other WS1 items

| Item | State |
|---|---|
| Primary domain, www/http to apex in one hop | **Not done: needs your approval and a store.** The legacy host serves `www` and apex separately with 200, so the redirect has to come from Shopify's domain settings after DNS moves |
| Old-URL redirects | `docs/redirects.csv` (35 rows) is the import file. It covers all 34 legacy paths. Two targets (the espresso and curiosities articles) must exist before import |
| Canonicals | `canonical_url` is used as is: variants canonicalise to the product; no `within: collection` links, so `/collections/x/products/y` is never emitted |
| `html lang`, `og:locale` | `pt-PT` and `pt_PT`. EN is unpublished at launch, so no hreflang |
| Structured data | Organization, WebSite, WebPage, BreadcrumbList, FAQPage, Product/Offer (with return policy; shipping only once rates exist), BlogPosting, Recipe. No AggregateRating or Review (correct). No `LocalBusiness` (D4 open). **Issue:** Organization `sameAs` includes a Google Maps share link (`settings_data.json`) that the client questions call a placeholder (Q40). Remove it from `sameAs` until the real URL is confirmed |
| Duplicate JSON-LD from apps | Cannot be checked: no apps installed. Check once Subscriptions and Google & YouTube are on the dev store |
| Merchant Center | Needs the live store. Two things to verify then: that products without a barcode are sent with `identifier_exists=false`, and the feed title. Product titles are "Lote Super Milano" with Formato/Peso options, not the "Sotocal – Café em grão Super Milano 1 kg" format in the prompt; a Merchant Center feed rule can prefix it |
| Search Console, Bing | The legacy verification meta tag is already in the theme, so a verified GSC property probably exists. Add a DNS-based domain property too. Submit the sitemap on launch day. Needs your accounts |
| Performance | Prototype Lighthouse 95–100 on all templates; lab mobile LCP 2.6–2.9 s on home, product and article, above 2.5 s, caused by the placeholder hero. Re-measure with real images on the store |
| Legal pages | Footer already has the Livro de Reclamações link, a RAL slot (entity name and URL still empty, Q23) and the consumer-portal link; "IVA incluído" string exists; a food-information accordion is on every product page. Policy texts, RAL entity, shipping and returns are client answers (Q23–Q28). Cookie banner exists with equal-prominence buttons; CNPD compliance not reviewed |
| AT-certified invoicing | No app chosen; accountant decision |

## 4. Open `TODO(sotocal)` items for this workstream

Priority-A client answers this workstream depends on: Q1 (prices), Q2 (GTIN), Q3 (food information), Q5–Q6 (shipping), Q23–Q25 (RAL, Livro, policies), Q40 (Maps URL). Details in `docs/QUESTIONS-FOR-CLIENT.md`.

## 5. Needs a Shopify dev store (cannot be done yet)

1. Push the theme as an unpublished dev theme.
2. Fetch `/robots.txt` and confirm the default groups plus the seven AI groups, and one `Sitemap:` line.
3. View source on `/`, a product, a collection and `/collections/all` for the robots meta; test a `?filter.` URL and a tag URL.
4. Confirm there is no hreflang with English unpublished.
5. Rich Results Test on one URL per template; save the output here.
6. Lighthouse per template with real images.
7. Import `docs/redirects.csv` after creating the two missing articles; run the `/q/chavena` curl test.

## 6. Decisions needed from you

- **D-domain:** approve changing the domain settings (apex primary, `www` redirect) when the store is ready.
- Confirm the repo can be put under git (`git init`, one baseline commit) so Phase 1 work can be branched and reviewed.
- Create the Shopify dev store and give CLI access, or tell me how you want theme work verified.

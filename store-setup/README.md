# store-setup

These are the data and content definitions for the Sotocal Shopify store. The theme reads the identifiers defined here; `docs/DATA-MODEL.md` documents them, and `docs/ADMIN-SETUP.md` gives the full admin order.

| File | Purpose | Used by |
|---|---|---|
| `metaobject-definitions.json` | 6 metaobject types: `faq_item`, `person`, `gift_box_item`, `partner_cafe`, `timeline_event`, `award` | `scripts/store-setup.mjs` |
| `metafield-definitions.json` | 31 metafield definitions (product, collection, article), namespace `sotocal` | `scripts/store-setup.mjs` |
| `metaobject-entries.json` | Seed entries from verified facts only, with EN translations | `store-setup.mjs --seed` |
| `products.json` | Product manifest: handles, types, tags, options, template suffixes, metafield values, unit-price rules, EN titles/handles | `products-csv.mjs`, `store-setup.mjs --products` |
| `products.csv` | Shopify product CSV generated from `products.json`. 23 products, all **draft**, placeholder price 1,00 €, tag `preco-provisorio`. | Admin → Products → Import |
| `products-csv.mjs` | Regenerates `products.csv` | `node store-setup/products-csv.mjs` |
| `collections.json` | 8 smart collections (rules, `sotocal.intro`, EN) | `store-setup.mjs --collections` |
| `pages.json` | 13 pages (+2 optional QR fallback pages) and 2 blogs, with template suffixes and EN | `store-setup.mjs --pages` / `--qr-pages` |
| `menus.json` | `main-menu` (6 items, Loja first, Profissional last) and `footer` | `store-setup.mjs --menus` |
| `custom-pixel.js` | Customer Events custom pixel: theme events → Meta `Lead` / GA4 `generate_lead`, and others | Admin → Settings → Customer events |

## Quick start

Print the plan (no credentials needed):

```bash
node scripts/store-setup.mjs --all
```

Apply everything except products:

```bash
SHOPIFY_STORE=sotocal.myshopify.com SHOPIFY_CLIENT_ID=xxx SHOPIFY_CLIENT_SECRET=xxx node scripts/store-setup.mjs --apply --seed --collections --pages --menus
```

Then import `products.csv` in the admin, and configure the imported products:

```bash
SHOPIFY_STORE=sotocal.myshopify.com SHOPIFY_CLIENT_ID=xxx SHOPIFY_CLIENT_SECRET=xxx node scripts/store-setup.mjs --apply --products
```

The 2 × 1 kg pack (`pack-2-x-1-kg`) is not in the CSV. Create it in the Shopify Bundles app first (ADMIN-SETUP §5), then run `--products` again.

Every step is idempotent, so it is safe to re-run.

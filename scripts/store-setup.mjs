#!/usr/bin/env node
// Sotocal store setup: creates the data model (metaobject + metafield definitions) and,
// on request, seeds verified content, collections, pages, blogs, menus and product settings.
//
// Node 24, built-in fetch only. Dry-run by default; pass --apply to write.
//
//   SHOPIFY_STORE=sotocal.myshopify.com SHOPIFY_CLIENT_ID=… SHOPIFY_CLIENT_SECRET=… node scripts/store-setup.mjs
//   … --apply                      definitions only (metaobjects, then metafields)
//   … --apply --seed               + verified metaobject entries (timeline, awards, people, FAQ) and EN translations
//   … --apply --collections        + smart collections (PT) and EN title/handle translations
//   … --apply --pages              + pages and blogs with template suffixes and EN translations
//   … --apply --qr-pages           + /pages/q-chavena and /pages/q-acucar (fallback if redirects drop the query string)
//   … --apply --products           + template suffix, sotocal.* metafields, unit price and EN translations for products
//                                    that already exist (import store-setup/products.csv first)
//   … --apply --menus              + main-menu and footer menus
//   … --apply --all                everything except --qr-pages
//
// Every step is idempotent: existing definitions, fields, pages, blogs, collections and menus are skipped;
// metaobject entries are upserted by handle; translations are re-registered with current digests.
//
// Credentials: since 01/01/2026 apps are created in the Dev Dashboard (dev.shopify.com), which shows a client ID and
// secret but no token. The script exchanges them for a 24-hour Admin API token (client credentials grant: the app and
// the store must be in the same organization). A token from an older admin-created app still works as SHOPIFY_ADMIN_TOKEN.
//
// Scopes (set on the app's version in the Dev Dashboard, then install the app on the store):
// write_metaobject_definitions, write_metaobjects, write_products, write_content (pages/blogs),
// write_online_store_navigation, write_translations, read_locales.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const API_VERSION = process.env.SHOPIFY_API_VERSION || '2026-10';
const STORE = process.env.SHOPIFY_STORE;
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;
let TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const args = new Set(process.argv.slice(2));
const APPLY = args.has('--apply');
const ALL = args.has('--all');
const step = (flag) => ALL || args.has(flag);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SETUP = path.join(ROOT, 'store-setup');
const EN = 'en';

const log = (...m) => console.log(...m);
const warn = (...m) => console.warn('!', ...m);
const plan = (what) => log(`${APPLY ? '→' : '[dry-run]'} ${what}`);

async function json(file) {
  return JSON.parse(await readFile(path.join(SETUP, file), 'utf8'));
}

// ---------- Admin GraphQL client (with throttle retry) ----------

const online = Boolean(STORE && (TOKEN || (CLIENT_ID && CLIENT_SECRET)));

// https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/client-credentials-grant
async function clientCredentialsToken() {
  const res = await fetch(`https://${STORE}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: CLIENT_ID, client_secret: CLIENT_SECRET })
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.access_token) {
    throw new Error(`Token request failed (HTTP ${res.status}): ${body.error_description || body.error || 'no access_token'}. Is the app installed on ${STORE}, in the same organization?`);
  }
  return body.access_token;
}

async function gql(query, variables = {}, attempt = 0) {
  const res = await fetch(`https://${STORE}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': TOKEN },
    body: JSON.stringify({ query, variables })
  });
  if (res.status === 429 || res.status >= 500) {
    if (attempt > 5) throw new Error(`HTTP ${res.status} after retries`);
    await sleep(1000 * 2 ** attempt);
    return gql(query, variables, attempt + 1);
  }
  const body = await res.json();
  if (body.errors) {
    const throttled = body.errors.some((e) => e.extensions?.code === 'THROTTLED');
    if (throttled && attempt <= 5) {
      await sleep(1000 * 2 ** attempt);
      return gql(query, variables, attempt + 1);
    }
    throw new Error(JSON.stringify(body.errors, null, 2));
  }
  return body.data;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function userErrors(label, errors) {
  if (errors?.length) {
    warn(`${label}: ${errors.map((e) => `${e.code ?? ''} ${e.field?.join('.') ?? ''} ${e.message}`.trim()).join('; ')}`);
    return true;
  }
  return false;
}

// Plain text → Shopify rich_text_field JSON (paragraphs split on blank lines).
function richText(text) {
  return JSON.stringify({
    type: 'root',
    children: String(text)
      .split(/\n{2,}/)
      .map((p) => ({ type: 'paragraph', children: [{ type: 'text', value: p.trim() }] }))
  });
}

// ---------- 1. Metaobject definitions ----------

async function metaobjectDefinitions() {
  const { definitions } = await json('metaobject-definitions.json');
  log('\n# Metaobject definitions');
  for (const def of definitions) {
    const fieldDefinitions = def.fieldDefinitions.map(({ key, name, type, required, description, validations }) => ({
      key, name, type, required: Boolean(required), description, validations
    }));
    // Web pages in the Online Store: /pages/<onlineStore.urlHandle>/<entry handle>, rendered by templates/metaobject/<type>.json.
    const webCapabilities = def.onlineStore
      ? {
          renderable: { enabled: true, data: { metaTitleKey: def.renderable?.metaTitleKey, metaDescriptionKey: def.renderable?.metaDescriptionKey } },
          onlineStore: { enabled: true, data: { urlHandle: def.onlineStore.urlHandle } }
        }
      : {};
    if (!online) { plan(`create metaobject definition ${def.type} (${fieldDefinitions.length} fields)`); continue; }

    const { metaobjectDefinitionByType: existing } = await gql(
      `query($type: String!) { metaobjectDefinitionByType(type: $type) { id type fieldDefinitions { key } access { storefront } capabilities { onlineStore { enabled } } } }`,
      { type: def.type }
    );

    if (!existing) {
      plan(`create metaobject definition ${def.type}`);
      if (!APPLY) continue;
      const data = await gql(
        `mutation($definition: MetaobjectDefinitionCreateInput!) {
          metaobjectDefinitionCreate(definition: $definition) { metaobjectDefinition { id type } userErrors { field message code } }
        }`,
        {
          definition: {
            type: def.type,
            name: def.name,
            description: def.description,
            displayNameKey: def.displayNameKey,
            access: { storefront: 'PUBLIC_READ' },
            capabilities: {
              translatable: { enabled: Boolean(def.translatable) },
              publishable: { enabled: Boolean(def.publishable) },
              ...webCapabilities
            },
            fieldDefinitions
          }
        }
      );
      userErrors(def.type, data.metaobjectDefinitionCreate.userErrors);
      continue;
    }

    const have = new Set(existing.fieldDefinitions.map((f) => f.key));
    const missing = fieldDefinitions.filter((f) => !have.has(f.key));
    const needsAccess = existing.access?.storefront !== 'PUBLIC_READ';
    const needsWeb = Boolean(def.onlineStore) && !existing.capabilities?.onlineStore?.enabled;
    if (!missing.length && !needsAccess && !needsWeb) { log(`= ${def.type} exists, all fields present`); continue; }
    plan(`update ${def.type}: ${missing.map((f) => `+${f.key}`).join(' ')}${needsAccess ? ' storefront=PUBLIC_READ' : ''}${needsWeb ? ' +web pages' : ''}`);
    if (!APPLY) continue;
    const data = await gql(
      `mutation($id: ID!, $definition: MetaobjectDefinitionUpdateInput!) {
        metaobjectDefinitionUpdate(id: $id, definition: $definition) { metaobjectDefinition { id } userErrors { field message code } }
      }`,
      {
        id: existing.id,
        definition: {
          ...(needsAccess ? { access: { storefront: 'PUBLIC_READ' } } : {}),
          ...(needsWeb ? { capabilities: webCapabilities } : {}),
          ...(missing.length ? { fieldDefinitions: missing.map((f) => ({ create: f })) } : {})
        }
      }
    );
    userErrors(def.type, data.metaobjectDefinitionUpdate.userErrors);
  }
}

// ---------- 2. Metafield definitions ----------

async function metafieldDefinitions() {
  const { definitions } = await json('metafield-definitions.json');
  log('\n# Metafield definitions');
  const existingByOwner = new Map();
  for (const def of definitions) {
    const id = `${def.ownerType} ${def.namespace}.${def.key} (${def.type})`;
    if (!online) { plan(`create metafield definition ${id}`); continue; }
    if (!existingByOwner.has(def.ownerType)) {
      const data = await gql(
        `query($ownerType: MetafieldOwnerType!, $namespace: String) {
          metafieldDefinitions(first: 250, ownerType: $ownerType, namespace: $namespace) { nodes { key type { name } } }
        }`,
        { ownerType: def.ownerType, namespace: def.namespace }
      );
      existingByOwner.set(def.ownerType, new Map(data.metafieldDefinitions.nodes.map((n) => [n.key, n.type.name])));
    }
    const existingType = existingByOwner.get(def.ownerType).get(def.key);
    if (existingType) {
      if (existingType !== def.type) warn(`${id} exists with type ${existingType}; fix manually (types cannot change)`);
      else log(`= ${id} exists`);
      continue;
    }
    plan(`create metafield definition ${id}`);
    if (!APPLY) continue;
    const data = await gql(
      `mutation($definition: MetafieldDefinitionInput!) {
        metafieldDefinitionCreate(definition: $definition) { createdDefinition { id key } userErrors { field message code } }
      }`,
      {
        definition: {
          ownerType: def.ownerType,
          namespace: def.namespace,
          key: def.key,
          type: def.type,
          name: def.name,
          description: def.description,
          pin: Boolean(def.pin),
          validations: def.validations ?? [],
          access: { storefront: 'PUBLIC_READ' }
        }
      }
    );
    userErrors(id, data.metafieldDefinitionCreate.userErrors);
  }
}

// ---------- Translations helper ----------

let enEnabled;
async function englishEnabled() {
  if (enEnabled !== undefined) return enEnabled;
  const { shopLocales } = await gql(`{ shopLocales { locale primary published } }`);
  enEnabled = shopLocales.some((l) => l.locale === EN);
  if (!enEnabled) warn('English (en) is not added in Settings → Languages; skipping EN translations.');
  return enEnabled;
}

// fields: { key: englishValue } where key is a translatable content key (title, handle, body_html, or a metaobject field key)
async function translate(resourceId, fields, label) {
  if (!fields || !Object.keys(fields).length) return;
  if (!APPLY) { plan(`translate ${label} → en: ${Object.keys(fields).join(', ')}`); return; }
  if (!(await englishEnabled())) return;
  const { translatableResource } = await gql(
    `query($id: ID!) { translatableResource(resourceId: $id) { translatableContent { key digest } } }`,
    { id: resourceId }
  );
  const digests = new Map(translatableResource.translatableContent.map((c) => [c.key, c.digest]));
  const translations = Object.entries(fields)
    .filter(([key, value]) => value != null && digests.has(key))
    .map(([key, value]) => ({ locale: EN, key, value: String(value), translatableContentDigest: digests.get(key) }));
  const skipped = Object.keys(fields).filter((k) => !digests.has(k));
  if (skipped.length) warn(`${label}: no translatable source for ${skipped.join(', ')}`);
  if (!translations.length) return;
  const data = await gql(
    `mutation($id: ID!, $t: [TranslationInput!]!) {
      translationsRegister(resourceId: $id, translations: $t) { translations { key } userErrors { field message code } }
    }`,
    { id: resourceId, t: translations }
  );
  if (!userErrors(`translate ${label}`, data.translationsRegister.userErrors)) log(`  en: ${translations.map((t) => t.key).join(', ')}`);
}

// ---------- 3. Seed verified metaobject entries ----------

async function seedMetaobjects() {
  const { entries } = await json('metaobject-entries.json');
  const { definitions } = await json('metaobject-definitions.json');
  const fieldTypes = new Map(definitions.flatMap((d) => d.fieldDefinitions.map((f) => [`${d.type}.${f.key}`, f.type])));
  const publishable = new Set(definitions.filter((d) => d.publishable).map((d) => d.type));
  log('\n# Metaobject entries (verified facts only)');
  for (const entry of entries) {
    const label = `${entry.type}/${entry.handle}`;
    const encode = (key, value) => {
      const type = fieldTypes.get(`${entry.type}.${key}`);
      if (type === 'rich_text_field') return richText(value);
      if (Array.isArray(value)) return JSON.stringify(value);
      return String(value);
    };
    const fields = Object.entries(entry.fields).map(([key, value]) => ({ key, value: encode(key, value) }));
    if (!online || !APPLY) { plan(`upsert ${label}`); if (entry.en) plan(`translate ${label} → en`); continue; }
    const data = await gql(
      `mutation($handle: MetaobjectHandleInput!, $metaobject: MetaobjectUpsertInput!) {
        metaobjectUpsert(handle: $handle, metaobject: $metaobject) { metaobject { id handle } userErrors { field message code } }
      }`,
      {
        handle: { type: entry.type, handle: entry.handle },
        metaobject: {
          fields,
          ...(publishable.has(entry.type) ? { capabilities: { publishable: { status: entry.status ?? 'ACTIVE' } } } : {})
        }
      }
    );
    const result = data.metaobjectUpsert;
    if (userErrors(label, result.userErrors)) continue;
    log(`✓ ${label}`);
    if (entry.en) {
      const en = Object.fromEntries(Object.entries(entry.en).map(([k, v]) => [k, encode(k, v)]));
      await translate(result.metaobject.id, en, label);
    }
  }
}

// ---------- Resource lookups ----------

async function findByHandle(kind, handle) {
  if (kind === 'collection') {
    const d = await gql(`query($h: String!) { collectionByIdentifier(identifier: { handle: $h }) { id } }`, { h: handle });
    return d.collectionByIdentifier?.id;
  }
  if (kind === 'product') {
    const d = await gql(`query($h: String!) { productByIdentifier(identifier: { handle: $h }) { id } }`, { h: handle });
    return d.productByIdentifier?.id;
  }
  if (kind === 'page') {
    const d = await gql(`query($q: String!) { pages(first: 5, query: $q) { nodes { id handle } } }`, { q: `handle:${handle}` });
    return d.pages.nodes.find((n) => n.handle === handle)?.id;
  }
  if (kind === 'blog') {
    const d = await gql(`query($q: String!) { blogs(first: 5, query: $q) { nodes { id handle } } }`, { q: `handle:${handle}` });
    return d.blogs.nodes.find((n) => n.handle === handle)?.id;
  }
  throw new Error(`unknown kind ${kind}`);
}

// ---------- 4. Collections ----------

async function collections() {
  const { collections: list } = await json('collections.json');
  log('\n# Collections');
  for (const c of list) {
    if (!online) { plan(`create smart collection ${c.handle}`); continue; }
    let id = await findByHandle('collection', c.handle);
    if (id) log(`= collection ${c.handle} exists`);
    else {
      plan(`create smart collection ${c.handle}`);
      if (!APPLY) continue;
      const data = await gql(
        `mutation($input: CollectionInput!) { collectionCreate(input: $input) { collection { id handle } userErrors { field message } } }`,
        {
          input: {
            title: c.title,
            handle: c.handle,
            descriptionHtml: c.descriptionHtml ?? '',
            ...(c.templateSuffix ? { templateSuffix: c.templateSuffix } : {}),
            ruleSet: { appliedDisjunctively: Boolean(c.disjunctive), rules: c.rules },
            metafields: [
              ...(c.intro ? [{ namespace: 'sotocal', key: 'intro', type: 'multi_line_text_field', value: c.intro }] : []),
              // SEO title and description (Shopify reads them from the global metafields).
              ...(c.seo?.title ? [{ namespace: 'global', key: 'title_tag', type: 'single_line_text_field', value: c.seo.title }] : []),
              ...(c.seo?.description ? [{ namespace: 'global', key: 'description_tag', type: 'single_line_text_field', value: c.seo.description }] : [])
            ]
          }
        }
      );
      if (userErrors(c.handle, data.collectionCreate.userErrors)) continue;
      id = data.collectionCreate.collection.id;
      log(`✓ collection ${c.handle}`);
    }
    if (id && c.en) {
      await translate(id, { title: c.en.title, handle: c.en.handle }, `collection ${c.handle}`);
      if (c.en.intro && APPLY) {
        const d = await gql(`query($id: ID!) { collection(id: $id) { metafield(namespace: "sotocal", key: "intro") { id } } }`, { id });
        const metafieldId = d.collection?.metafield?.id;
        if (metafieldId) await translate(metafieldId, { value: c.en.intro }, `collection ${c.handle} intro`);
      }
    }
  }
}

// ---------- 5. Pages and blogs ----------

async function pagesAndBlogs({ qr }) {
  const { pages, blogs } = await json('pages.json');
  log('\n# Pages');
  for (const p of pages) {
    if (p.optional && !qr) continue;
    if (!online) { plan(`create page /pages/${p.handle} (template ${p.templateSuffix || 'page'})`); continue; }
    let id = await findByHandle('page', p.handle);
    if (id) log(`= page ${p.handle} exists (template not changed)`);
    else {
      plan(`create page /pages/${p.handle} (template ${p.templateSuffix || 'page'})`);
      if (!APPLY) continue;
      const data = await gql(
        `mutation($page: PageCreateInput!) { pageCreate(page: $page) { page { id handle } userErrors { field message code } } }`,
        {
          page: {
            title: p.title, handle: p.handle, body: p.body ?? '', isPublished: p.published !== false, templateSuffix: p.templateSuffix || null,
            // SEO title and description (Shopify reads them from the global metafields).
            ...(p.seo ? { metafields: [
              { namespace: 'global', key: 'title_tag', type: 'single_line_text_field', value: p.seo.title },
              { namespace: 'global', key: 'description_tag', type: 'single_line_text_field', value: p.seo.description }
            ] } : {})
          }
        }
      );
      if (userErrors(p.handle, data.pageCreate.userErrors)) continue;
      id = data.pageCreate.page.id;
      log(`✓ page ${p.handle}`);
    }
    if (id && p.en) await translate(id, { title: p.en.title, handle: p.en.handle }, `page ${p.handle}`);
  }

  log('\n# Blogs');
  for (const b of blogs) {
    if (!online) { plan(`create blog /blogs/${b.handle}`); continue; }
    let id = await findByHandle('blog', b.handle);
    if (id) log(`= blog ${b.handle} exists`);
    else {
      plan(`create blog /blogs/${b.handle}`);
      if (!APPLY) continue;
      const data = await gql(
        `mutation($blog: BlogCreateInput!) { blogCreate(blog: $blog) { blog { id handle } userErrors { field message code } } }`,
        { blog: { title: b.title, handle: b.handle } }
      );
      if (userErrors(b.handle, data.blogCreate.userErrors)) continue;
      id = data.blogCreate.blog.id;
      log(`✓ blog ${b.handle}`);
    }
    if (id && b.en) await translate(id, { title: b.en.title, handle: b.en.handle }, `blog ${b.handle}`);
  }
}

// ---------- 6. Products (after CSV import) ----------

const UNIT = { g: 'G', kg: 'KG' };

async function products() {
  const { products: list } = await json('products.json');
  const { definitions } = await json('metafield-definitions.json');
  const types = new Map(definitions.filter((d) => d.ownerType === 'PRODUCT').map((d) => [d.key, d.type]));
  log('\n# Products (template, metafields, unit price, EN)');
  for (const p of list) {
    if (!online) { plan(`configure product ${p.handle}`); continue; }
    const d = await gql(
      `query($h: String!) { productByIdentifier(identifier: { handle: $h }) {
        id templateSuffix variants(first: 100) { nodes { id selectedOptions { name value } } } } }`,
      { h: p.handle }
    );
    const product = d.productByIdentifier;
    if (!product) { warn(`product ${p.handle} not found (import store-setup/products.csv or create it first)`); continue; }

    if ((product.templateSuffix || '') !== (p.templateSuffix || '')) {
      plan(`${p.handle}: template → product${p.templateSuffix ? `.${p.templateSuffix}` : ''}`);
      if (APPLY) {
        const r = await gql(
          `mutation($product: ProductUpdateInput!) { productUpdate(product: $product) { product { id } userErrors { field message } } }`,
          { product: { id: product.id, templateSuffix: p.templateSuffix || null } }
        );
        userErrors(p.handle, r.productUpdate.userErrors);
      }
    }

    const metafields = Object.entries(p.metafields ?? {}).map(([key, value]) => {
      const type = types.get(key);
      if (!type) throw new Error(`${p.handle}: metafield sotocal.${key} has no definition`);
      return { ownerId: product.id, namespace: 'sotocal', key, type, value: Array.isArray(value) || typeof value === 'object' ? JSON.stringify(value) : String(value) };
    });
    if (metafields.length) {
      plan(`${p.handle}: set ${metafields.map((m) => m.key).join(', ')}`);
      if (APPLY) {
        const r = await gql(
          `mutation($m: [MetafieldsSetInput!]!) { metafieldsSet(metafields: $m) { metafields { key } userErrors { field message code } } }`,
          { m: metafields }
        );
        userErrors(p.handle, r.metafieldsSet.userErrors);
      }
    }

    // Unit price per kg (EU price indication): from the weight option (250 g → 250 G per 1 KG),
    // or from a fixed total for every variant (unitPriceTotal: "2 kg" for the pack).
    if (p.unitPriceFromOption || p.unitPriceTotal) {
      const variants = product.variants.nodes
        .map((v) => {
          const source = p.unitPriceTotal ?? v.selectedOptions.find((o) => o.name === p.unitPriceFromOption)?.value;
          const m = source?.replace(',', '.').match(/([\d.]+)\s*(kg|g)\b/i);
          if (!m) return null;
          return {
            id: v.id,
            unitPriceMeasurement: { quantityValue: Number(m[1]), quantityUnit: UNIT[m[2].toLowerCase()], referenceValue: 1, referenceUnit: 'KG' }
          };
        })
        .filter(Boolean);
      if (variants.length) {
        plan(`${p.handle}: unit price per kg on ${variants.length} variants`);
        if (APPLY) {
          const r = await gql(
            `mutation($id: ID!, $v: [ProductVariantsBulkInput!]!) {
              productVariantsBulkUpdate(productId: $id, variants: $v) { productVariants { id } userErrors { field message code } }
            }`,
            { id: product.id, v: variants }
          );
          userErrors(`${p.handle} unit price`, r.productVariantsBulkUpdate.userErrors);
        }
      }
    }

    if (p.en) await translate(product.id, { title: p.en.title, handle: p.en.handle, body_html: p.en.body_html }, `product ${p.handle}`);
  }
}

// ---------- 7. Menus ----------

async function resolveItem(item) {
  const m = item.url.match(/^\/(collections|pages|products|blogs)\/([^/?#]+)$/);
  const kinds = { collections: ['collection', 'COLLECTION'], pages: ['page', 'PAGE'], products: ['product', 'PRODUCT'], blogs: ['blog', 'BLOG'] };
  const base = { title: item.title };
  if (item.url === '/collections/all') return { ...base, type: 'CATALOG', url: item.url };
  if (item.url === '/') return { ...base, type: 'FRONTPAGE', url: item.url };
  if (m && online) {
    const [kind, type] = kinds[m[1]];
    const resourceId = await findByHandle(kind, m[2]);
    if (resourceId) return { ...base, type, resourceId, url: item.url };
    warn(`menu item ${item.title}: ${item.url} not found, using a plain link`);
  }
  return { ...base, type: 'HTTP', url: item.url };
}

async function menus() {
  const { menus: list } = await json('menus.json');
  log('\n# Menus');
  for (const menu of list) {
    if (!online) { plan(`create menu ${menu.handle} (${menu.items.length} items)`); continue; }
    const d = await gql(`query($q: String!) { menus(first: 10, query: $q) { nodes { id handle } } }`, { q: `handle:${menu.handle}` });
    if (d.menus.nodes.some((n) => n.handle === menu.handle)) { log(`= menu ${menu.handle} exists (edit it in Online Store → Navigation)`); continue; }
    plan(`create menu ${menu.handle}`);
    if (!APPLY) continue;
    const items = [];
    for (const item of menu.items) {
      const resolved = await resolveItem(item);
      if (item.items) resolved.items = await Promise.all(item.items.map(resolveItem));
      items.push(resolved);
    }
    const r = await gql(
      `mutation($title: String!, $handle: String!, $items: [MenuItemCreateInput!]!) {
        menuCreate(title: $title, handle: $handle, items: $items) { menu { id handle } userErrors { field message code } }
      }`,
      { title: menu.title, handle: menu.handle, items }
    );
    if (!userErrors(menu.handle, r.menuCreate.userErrors)) log(`✓ menu ${menu.handle}`);
  }
}

// ---------- Run ----------

async function main() {
  log(`Sotocal store setup · API ${API_VERSION} · ${online ? STORE : 'no credentials (plan from files only)'} · ${APPLY ? 'APPLY' : 'dry-run'}`);
  if (APPLY && !online) throw new Error('--apply needs SHOPIFY_STORE plus SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET (or SHOPIFY_ADMIN_TOKEN)');
  if (online && !TOKEN) TOKEN = await clientCredentialsToken();
  await metaobjectDefinitions();
  await metafieldDefinitions();
  if (step('--seed')) await seedMetaobjects();
  if (step('--collections')) await collections();
  if (step('--pages') || args.has('--qr-pages')) await pagesAndBlogs({ qr: args.has('--qr-pages') });
  if (step('--products')) await products();
  if (step('--menus')) await menus();
  log('\nDone.' + (APPLY ? '' : ' Nothing was written (dry-run). Add --apply to execute.'));
}

// exitCode, not exit(): exiting with a fetch socket still open aborts Node on Windows.
main().catch((e) => { console.error(e.message || e); process.exitCode = 1; });

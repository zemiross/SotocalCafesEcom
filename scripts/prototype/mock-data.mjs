// Mock store data for the prototype renderer. Facts come from the brief §2 and docs/CONTENT.md; every price is the
// same flagged placeholder the store CSV uses (1,00 €, tag preco-provisorio). Partner cafés are obviously fictional
// sample entries ("Café de exemplo") so the locator and pickup UI can be exercised; they are not real businesses.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const img = (file, w, h, alt = '') => ({ src: `/reference/legacy-images/${file}`, width: w, height: h, alt, aspect_ratio: w / h, url: `/reference/legacy-images/${file}` });
const mf = (value) => (value == null ? null : { value });
const PRICE = 100;
// Placeholder coffee price, 40 EUR per kg (decision D91): 250 g = 10,00 EUR, 1 kg = 40,00 EUR. Still tagged preco-provisorio.
const COFFEE_PRICE = { '250 g': 1000, '1 kg': 4000 };

const T = (lang, pt, en) => (lang === 'en' ? en : pt);

function coffee(lang, handle, title, character, notes, image, extra = {}) {
  const opts = [['Grão', 'Grão'], ['Moído', 'Moído']];
  const weights = ['250 g', '1 kg'];
  let id = 1000 + Math.abs([...handle].reduce((a, c) => a + c.charCodeAt(0) * 7, 0));
  const variants = [];
  for (const [fmtPt] of opts) for (const w of weights) {
    id += 1;
    variants.push({
      id, title: `${fmtPt} / ${w}`, options: [fmtPt, w], option1: fmtPt, option2: w, price: COFFEE_PRICE[w], compare_at_price: null,
      available: true, sku: '', barcode: '', url: `/products/${handle}?variant=${id}`, featured_image: null,
      unit_price_measurement: null, unit_price: null, weight: w === '1 kg' ? 1000 : 250,
      selling_plan_allocations: [],
    });
  }
  const p = {
    id: id * 3, handle, title, url: `/products/${handle}`, type: 'Café', vendor: 'Sotocal', template_suffix: '',
    tags: ['cafe', 'preco-provisorio'], available: true, price: COFFEE_PRICE['250 g'], price_min: COFFEE_PRICE['250 g'], price_max: COFFEE_PRICE['1 kg'], price_varies: true,
    compare_at_price: null, has_only_default_variant: false, featured_image: image, images: [image], media: [{ media_type: 'image', preview_image: image, id: 1, alt: image.alt }],
    description: `<p>${character}</p>`, content: `<p>${character}</p>`,
    options: ['Formato', 'Peso'],
    options_with_values: [
      { name: 'Formato', position: 1, values: ['Grão', 'Moído'], selected_value: 'Grão' },
      { name: 'Peso', position: 2, values: ['250 g', '1 kg'], selected_value: '250 g' },
    ],
    variants, collections: [{ handle: 'cafe', title: T(lang, 'Café', 'Coffee'), url: '/collections/cafe' }],
    requires_selling_plan: false,
    selling_plan_groups: [{
      id: 'g1', name: T(lang, 'Subscrição', 'Subscription'), app_id: 'subscriptions',
      selling_plans: [2, 4, 6].map((n) => ({ id: 7000 + n, name: T(lang, `A cada ${n} semanas`, `Every ${n} weeks`), description: '', price_adjustments: [] })),
    }],
    metafields: {
      sotocal: {
        character: mf(character), tasting_notes: mf(notes), intensity: null, best_for: null, roast: null, origins: mf(extra.origins || null),
        arabica_robusta: null, subtitle: mf(T(lang, 'Café em grão e moído', 'Whole bean and ground coffee')), preparation: null,
        fic_ingredients: null, fic_allergens: null, fic_net_quantity: null, fic_storage: null, fic_best_before_note: null,
        fic_operator: mf('Sotocal – Sociedade Torrefactora De Cafés de Angola, Lda., Rua Engenheiro Ferreira Dias, n.º 398, 4100-246 Porto, Portugal'),
        fic_origin: mf(T(lang, 'Torrado em Portugal', 'Roasted in Portugal')), fic_nutrition: null, faq: null, pairings: null, lowest_price_30d: null,
      },
    },
    ...extra.product,
  };
  p.selected_or_first_available_variant = variants[0];
  p.first_available_variant = variants[0];
  return p;
}

function simple(lang, handle, title, type, image, suffix, collection) {
  const id = 50000 + [...handle].reduce((a, c) => a + c.charCodeAt(0) * 13, 0);
  const v = { id: id + 1, title: 'Default Title', options: ['Default Title'], price: PRICE, compare_at_price: null, available: true, sku: '', barcode: '', url: `/products/${handle}?variant=${id + 1}`, unit_price_measurement: null, unit_price: null, selling_plan_allocations: [] };
  const p = {
    id, handle, title, url: `/products/${handle}`, type, vendor: 'Sotocal', template_suffix: suffix, tags: ['preco-provisorio'],
    available: true, price: PRICE, price_min: PRICE, price_max: PRICE, price_varies: false, has_only_default_variant: true,
    featured_image: image, images: [image], media: [{ media_type: 'image', preview_image: image, id: 1, alt: image.alt }],
    description: '', content: '', options: ['Title'], options_with_values: [{ name: 'Title', position: 1, values: ['Default Title'], selected_value: 'Default Title' }],
    variants: [v], collections: [collection], selling_plan_groups: [], requires_selling_plan: false,
    metafields: { sotocal: { fic_operator: mf('Sotocal – Sociedade Torrefactora De Cafés de Angola, Lda., Rua Engenheiro Ferreira Dias, n.º 398, 4100-246 Porto, Portugal'), fic_origin: null } },
  };
  p.selected_or_first_available_variant = v;
  p.first_available_variant = v;
  return p;
}

export function buildMock({ lang = 'pt-PT', page = {} }) {
  const en = lang === 'en';
  const prefix = en ? '/en' : '';
  const settingsSchema = JSON.parse(readFileSync(path.join(root, 'config', 'settings_schema.json'), 'utf8'));
  const settingsData = JSON.parse(readFileSync(path.join(root, 'config', 'settings_data.json'), 'utf8')).current;
  const settings = {};
  for (const group of settingsSchema) for (const s of group.settings || []) if (s.id) settings[s.id] = s.default ?? (s.type === 'checkbox' ? false : '');
  Object.assign(settings, settingsData);
  // WS9 prototype fixtures: Christmas season on, with clearly fictional cut-off dates.
  Object.assign(settings, { gift_season_force: 'on', gift_cutoff_mainland: '18 de dezembro (exemplo)', gift_cutoff_islands: '12 de dezembro (exemplo)' });

  const coffeeCol = { handle: 'cafe', title: T(lang, 'Café', 'Coffee'), url: `${prefix}/collections/cafe` };
  const products = {
    'lote-super-milano': coffee(lang, 'lote-super-milano', 'Lote Super Milano', T(lang, 'Intenso e persistente, com creme aveludado.', 'Intense and lingering, with a velvety crema.'), T(lang, 'Intenso,Aroma suave,Creme aveludado', 'Intense,Soft aroma,Velvety crema').split(','), img('lote-super-milano.png', 868, 774, 'Embalagem do Lote Super Milano'), { origins: T(lang, 'Finos arábicas de montanha e intensos robustas africanos.', 'Fine mountain Arabicas and intense African Robustas.') }),
    'lote-super': coffee(lang, 'lote-super', 'Lote Super', T(lang, 'Forte e encorpado, com creme que persiste.', 'Strong and full-bodied, with a crema that lasts.'), T(lang, 'Forte,Revigorante,Encorpado', 'Strong,Invigorating,Full-bodied').split(','), img('lote-super-torrado.png', 868, 774, 'Embalagem do Lote Super'), { origins: T(lang, 'Arábicas suaves da América Central e do Brasil e robustas da África Ocidental.', 'Soft Central American and Brazilian Arabicas and West African Robustas.') }),
    'lote-reggio': coffee(lang, 'lote-reggio', 'Lote Reggio', T(lang, 'Torra intensa de estilo italiano. Vigoroso, de creme firme.', 'An intense Italian-style roast. Vigorous, with a firm crema.'), T(lang, 'Vigoroso,Aroma ativo,Creme firme', 'Vigorous,Lively aroma,Firm crema').split(','), img('lote-reggio.png', 868, 774, 'Embalagem do Lote Reggio'), { origins: T(lang, 'Cafés aromáticos de montanha e cafés fortes africanos.', 'Aromatic mountain coffees and strong African coffees.') }),
    'cafe-descafeinado': coffee(lang, 'cafe-descafeinado', T(lang, 'Café Descafeinado', 'Decaf coffee'), T(lang, 'Todo o sabor Sotocal, sem cafeína.', 'All the Sotocal flavour, without the caffeine.'), [T(lang, 'Sem cafeína', 'Caffeine-free')], img('lote-descafeinado.png', 868, 774, 'Embalagem do Café Descafeinado')),
  };
  const spicesCol = { handle: 'especiarias', title: T(lang, 'Especiarias', 'Spices'), url: `${prefix}/collections/especiarias` };
  for (const [h, t] of [['piri-piri', 'Piri-piri'], ['colorau', 'Colorau'], ['pimenta', 'Pimenta'], ['canela', 'Canela'], ['cravinho', 'Cravinho'], ['cominhos', 'Cominhos']]) {
    products[h] = simple(lang, h, t, T(lang, 'Especiaria', 'Spice'), img(`${h}.png`, 868, 774, t), 'spice', spicesCol);
  }
  const subsCol = { handle: 'sucedaneos-do-cafe', title: T(lang, 'Sucedâneos do café', 'Coffee substitutes'), url: `${prefix}/collections/sucedaneos-do-cafe` };
  for (const [h, t, f] of [['mistura-bom-dia', 'Mistura Bom Dia', 'cafe-mistura-bom-dia.png'], ['mistura-sako', 'Mistura Sako', 'cafe-mistura-sako.png'], ['cevada-sotocal', 'Cevada Sotocal', 'cevada-sotocal.png'], ['cevada-oriente', 'Cevada Oriente', 'cevada-oriente.png']]) {
    products[h] = simple(lang, h, t, T(lang, 'Sucedâneo', 'Substitute'), img(f, 868, 774, t), 'substitute', subsCol);
  }
  products['despensa-do-norte'] = simple(lang, 'despensa-do-norte', 'Despensa do Norte', T(lang, 'Cabaz', 'Gift box'), img('lote-super-milano.png', 868, 774, 'Despensa do Norte'), 'bundle', { handle: 'presentes', title: T(lang, 'Presentes', 'Gifts'), url: `${prefix}/collections/presentes` });
  products['lote-super-milano'].metafields.sotocal.pairings = mf([products['piri-piri'], products['mistura-bom-dia'], products['despensa-do-norte']]);
  // Descriptions and food information come from the real store data (store-setup/products.json, client leaflet).
  const storeData = JSON.parse(readFileSync(path.join(root, 'store-setup', 'products.json'), 'utf8')).products;
  for (const sp of storeData) {
    const p = products[sp.handle];
    if (!p) continue;
    p.description = p.content = (en ? sp.en?.body_html : sp.body_html) || p.description;
    for (const [k, v] of Object.entries(sp.metafields || {})) {
      if (!en || !/^(character|tasting_notes|origins|subtitle|roast)$/.test(k)) p.metafields.sotocal[k] = mf(v);
    }
  }
  Object.values(products).forEach((p) => { p.url = `${prefix}${p.url}`; p.variants.forEach((v) => { v.url = `${prefix}${v.url}`; }); });

  const coffeeList = ['lote-super-milano', 'lote-super', 'lote-reggio', 'cafe-descafeinado'].map((h) => products[h]);
  const collections = {
    cafe: { ...coffeeCol, id: 1, products: coffeeList, products_count: 4, all_products_count: 4, description: `<p>${T(lang, 'Os quatro lotes Sotocal, em grão e moído, em embalagens de 250 g e 1 kg. Todos juntam arábicas e robustas; muda a origem, a proporção e a torra.', 'The four Sotocal blends, whole bean and ground, in 250 g and 1 kg packs. All of them combine Arabica and Robusta; the origin, proportion and roast change.')}</p>`, metafields: { sotocal: { buying_guide: mf(T(lang, 'Texto de exemplo do guia de compra, só para o protótipo.', 'Sample buying-guide text, prototype only.')), intro: mf(T(lang, 'Os lotes que servimos nos cafés do Norte, torrados no Porto. Em grão para máquinas automáticas, moído para a cafeteira.', 'The blends we serve in the cafés of the North, roasted in Porto. Whole bean for bean-to-cup machines, ground for the moka pot.')) } }, filters: [], sort_options: [{ value: 'manual', name: T(lang, 'Em destaque', 'Featured') }, { value: 'price-ascending', name: T(lang, 'Preço, do mais baixo', 'Price, low to high') }], sort_by: 'manual', default_sort_by: 'manual', image: null, template_suffix: '' },
    especiarias: { ...spicesCol, id: 2, products: ['piri-piri', 'colorau', 'pimenta', 'canela', 'cravinho', 'cominhos'].map((h) => products[h]), products_count: 6, description: '', metafields: { sotocal: { intro: null } }, filters: [], sort_options: [], image: null },
  };
  // Shopify's `collections` is both iterable and keyed by handle.
  products['despensa-do-norte'].tags = ['presente'];
  const emptyGifts = Boolean(process.env.PROTO_EMPTYGIFTS);
  collections.presentes = {
    handle: 'presentes', title: T(lang, 'Presentes', 'Gifts'), id: 9, url: `${prefix}/collections/presentes`, description: '',
    products: emptyGifts ? [] : [products['despensa-do-norte']], products_count: emptyGifts ? 0 : 1, all_products_count: emptyGifts ? 0 : 1,
    metafields: { sotocal: { intro: mf(T(lang, 'Presentes com sabor ao Norte (texto de exemplo).', 'Gifts that taste of the North (sample text).')) } },
    filters: [], sort_options: collections.cafe.sort_options, sort_by: 'manual', default_sort_by: 'manual', image: null, template_suffix: 'presentes',
  };
  const collectionList = Object.assign(Object.values(collections), collections);
  collections.cafe.filters = [
    { label: T(lang, 'Formato', 'Format'), type: 'list', param_name: 'filter.v.option.formato', active_values: [], values: [{ label: T(lang, 'Grão', 'Whole bean'), value: 'Grão', param_name: 'filter.v.option.formato', count: 4, active: false }, { label: T(lang, 'Moído', 'Ground'), value: 'Moído', param_name: 'filter.v.option.formato', count: 4, active: false }] },
    { label: T(lang, 'Peso', 'Weight'), type: 'list', param_name: 'filter.v.option.peso', active_values: [], values: [{ label: '250 g', value: '250 g', param_name: 'filter.v.option.peso', count: 4, active: false }, { label: '1 kg', value: '1 kg', param_name: 'filter.v.option.peso', count: 4, active: false }] },
  ];

  const cafes = [
    { name: 'Café de exemplo 1', city: 'Porto', district: 'Porto', address: T(lang, 'Morada de exemplo', 'Sample address'), postal_code: '4000-000', lat: 41.1496, lng: -8.611 },
    { name: 'Café de exemplo 2', city: 'Braga', district: 'Braga', address: T(lang, 'Morada de exemplo', 'Sample address'), postal_code: '4700-000', lat: 41.5454, lng: -8.4265 },
    { name: 'Café de exemplo 3', city: 'Vila Nova de Gaia', district: 'Porto', address: T(lang, 'Morada de exemplo', 'Sample address'), postal_code: '4400-000', lat: 41.1239, lng: -8.6118 },
  ].map((c, i) => ({
    system: { handle: `cafe-exemplo-${i + 1}`, id: `gid://shopify/Metaobject/${i + 1}` },
    name: c.name, city: c.city, district: c.district, address: c.address, postal_code: c.postal_code,
    lat: mf(c.lat), lng: mf(c.lng), opening_hours: mf(T(lang, 'Horário de exemplo', 'Sample opening hours')), pickup_enabled: mf(i !== 1), consent_publish: mf(true), photo: null,
  }));
  const faqs = [
    { q: T(lang, 'A Sotocal vende máquinas de café?', 'Does Sotocal sell coffee machines?'), a: T(lang, '<p>Não. Para cafés, restaurantes e hotéis, a Sotocal coloca equipamento adequado mediante acordo e presta assistência técnica rápida.</p>', '<p>No. For cafés, restaurants and hotels, Sotocal places suitable equipment under an agreement and provides fast technical assistance.</p>'), c: 'profissional' },
    { q: T(lang, 'Para onde enviam?', 'Where do you ship to?'), a: T(lang, '<p>Para Portugal continental, Açores, Madeira e União Europeia.</p>', '<p>To mainland Portugal, the Azores, Madeira and the European Union.</p>'), c: 'envios' },
    { q: T(lang, 'Os lotes são arábica ou robusta?', 'Are the blends Arabica or Robusta?'), a: T(lang, '<p>Os lotes Sotocal (Super Milano, Super, Reggio e Descafeinado) combinam cafés arábica e robusta.</p>', '<p>The Sotocal blends (Super Milano, Super, Reggio and Decaf) combine Arabica and Robusta coffees.</p>'), c: 'produto' },
  ].map((x, i) => ({ system: { handle: `faq-${i + 1}` }, question: mf(x.q), answer: mf(x.a), category: mf(x.c) }));
  products['lote-super-milano'].metafields.sotocal.faq = mf(faqs);
  // WS4 render fixtures (clearly fictional: method names and guide text are placeholders for the prototype only).
  const fakeMethods = [
    { system: { handle: 'maquina-automatica', url: `${prefix}/pages/metodo/maquina-automatica` }, name: mf(T(lang, 'Máquina automática (exemplo)', 'Bean-to-cup machine (sample)')) },
    { system: { handle: 'cafeteira-italiana', url: null }, name: mf(T(lang, 'Cafeteira italiana (exemplo)', 'Moka pot (sample)')) },
  ];
  Object.assign(products['lote-super-milano'].metafields.sotocal, {
    best_for: mf(T(lang, ['Máquina automática', 'Cafeteira italiana'], ['Bean-to-cup machine', 'Moka pot'])),
    recommended_methods: mf(fakeMethods),
    roast_date_policy: mf('impressa-na-embalagem'),
  });
  Object.assign(collections.cafe.metafields.sotocal, { related_methods: mf(fakeMethods), faq: mf(faqs) });
  // WS5 fixtures: fictional method and machine entries so the hub templates can be rendered and checked.
  const hubBase = (type, handle, path) => ({ type, handle, url: `${prefix}/pages/${path}/${handle}` });
  const methodEntry = {
    system: hubBase('method', 'maquina-automatica', 'metodo'),
    name: mf(T(lang, 'Café para máquina automática (exemplo)', 'Coffee for a bean-to-cup machine (sample)')),
    short_answer: mf(T(lang, 'Resposta curta de exemplo, só para o protótipo.', 'Sample short answer, prototype only.')),
    sotocal_recommendation: mf(T(lang, 'Recomendação de exemplo da Sotocal, só para o protótipo.', 'Sample Sotocal recommendation, prototype only.')),
    recommended_blends: mf([products['lote-super-milano']]),
    grind: mf(T(lang, 'Moagem de exemplo', 'Sample grind')), dose_ratio: mf(T(lang, 'Dose de exemplo', 'Sample dose')),
    steps: mf(T(lang, ['Primeiro passo de exemplo', 'Segundo passo de exemplo'], ['Sample first step', 'Sample second step'])),
    common_mistakes: mf(T(lang, ['Erro de exemplo'], ['Sample mistake'])),
    faq: mf(faqs), author: null, reviewed_on: mf('2026-11-17'),
    seo_title: mf(T(lang, 'Café para máquina automática', 'Coffee for a bean-to-cup machine')), seo_description: mf(T(lang, 'Descrição de exemplo.', 'Sample description.')), image: null, sources: null,
  };
  const machineBase = {
    short_answer: mf(T(lang, 'Resposta curta de exemplo.', 'Sample short answer.')), method: mf(methodEntry),
    recommended_blends: mf([products['lote-super-milano']]), recommended_grind: mf(T(lang, 'Moagem de exemplo', 'Sample grind')),
    faq: mf([]), author: null, reviewed_on: mf('2026-11-17'), image: null, seo_title: null, seo_description: null,
  };
  const machineEntry = {
    ...machineBase, system: hubBase('machine', 'modelo-exemplo', 'maquina'), name: mf(T(lang, 'Modelo de exemplo', 'Sample model')),
    machine_type: mf('automatica'), brand: mf('Marca de exemplo'), model: mf('Modelo X'),
    settings: mf(T(lang, 'Definições de exemplo, copiadas do manual.', 'Sample settings, copied from the manual.')), sources: mf(['https://example.com/manual.pdf']),
  };
  const machineIncomplete = { ...machineEntry, system: hubBase('machine', 'modelo-sem-fonte', 'maquina'), name: mf(T(lang, 'Modelo sem fonte (exemplo)', 'Model without source (sample)')), settings: null, sources: mf([]) };
  // Local supplier pages (D111): the seed entries in store-setup/metaobject-entries.json. Porto is real and served; Lisboa is a draft.
  const areaSeeds = JSON.parse(readFileSync(path.join(root, 'store-setup', 'metaobject-entries.json'), 'utf8')).entries.filter((e) => e.type === 'service_area');
  const areaEntries = Object.fromEntries(areaSeeds.map((e) => {
    const o = { system: { type: 'service_area', handle: e.handle, url: `${prefix}/pages/fornecedor-de-cafe/${e.handle}` } };
    for (const k of ['name', 'in_name', 'district', 'served', 'short_answer', 'local_facts', 'delivery', 'local_contact', 'reviewed_on', 'seo_title', 'seo_description']) o[k] = mf(e.fields[k] ?? null);
    o.faq = mf([]);
    return [e.handle, o];
  }));
  const hubEntries = { method: methodEntry, machine: machineEntry, 'machine-incomplete': machineIncomplete, ...Object.fromEntries(Object.entries(areaEntries).map(([h, o]) => [`area-${h}`, o])) };
  const hubMachines = [machineEntry, machineIncomplete];
  // WS6 fixtures (fictional values, prototype only): intensity and best_for so the quiz has data, one blend with a real-looking
  // price so the calculator offers a preset, and two dated competitor rows.
  const quizData = {
    'lote-super-milano': { intensity: 4, best: ['Máquina automática', 'Moka', 'Com leite'] },
    'lote-super': { intensity: 3, best: ['Máquina automática', 'Expresso'] },
    'lote-reggio': { intensity: 5, best: ['Expresso', 'Moka'] },
    'cafe-descafeinado': { intensity: 2, best: ['Máquina automática'], blend: 'Descafeinado' },
  };
  for (const [h, d] of Object.entries(quizData)) {
    const sm = products[h].metafields.sotocal;
    sm.intensity = mf(d.intensity); sm.best_for = mf(d.best);
    if (d.blend) sm.blend = mf(d.blend);
  }
  products['lote-super-milano'].metafields.sotocal.best_for = mf(quizData['lote-super-milano'].best);
  // Real competitor prices read from public pages on 17/11/2026 (store-setup/metaobject-entries.json, DRAFT entries).
  const competitorEntries = JSON.parse(readFileSync(path.join(root, 'store-setup', 'metaobject-entries.json'), 'utf8')).entries.filter((e) => e.type === 'competitor');
  const competitorByHandle = {};
  const competitors = competitorEntries.map((e) => {
    const f = e.fields;
    const o = { system: { handle: e.handle, type: 'competitor' } };
    for (const k of ['name', 'product', 'format', 'pack_weight_g', 'pack_units', 'pack_price', 'price_per_kg', 'price_kind', 'channel', 'tier', 'source_url', 'notes']) o[k] = mf(f[k] ?? null);
    o.accessed_on = mf(f.accessed_on);
    competitorByHandle[e.handle] = o;
    return o;
  });
  // The Delta-alternatives guide compares these (docs/seo/drafts/cafe-delta-alternativas.md), lowest price per kg first.
  const deltaGuide = ['continente-8773030', 'continente-8773229', 'continente-8976391', 'continente-2061464', 'continente-2130164', 'continente-2004739', 'continente-3630158', 'continente-2852183', 'continente-2014662']
    .map((h) => competitorByHandle[h]).filter(Boolean);
  if (process.env.PROTO_SOLDOUT) {
    const p = products[process.env.PROTO_SOLDOUT];
    p.variants.forEach((v) => { v.available = false; });
    p.available = false;
    p.selected_or_first_available_variant = p.variants[0];
  }

  const articleBody = T(lang,
    '<p>Para máquinas automáticas, escolha café em grão: mói na hora e guarda melhor o aroma. Guarde a embalagem bem fechada, longe de produtos com cheiro.</p><h2>Como escolher</h2><p>Todos os lotes Sotocal juntam arábicas e robustas. Os mais intensos dão mais creme; o Descafeinado mantém o sabor sem cafeína.</p>',
    '<p>For bean-to-cup machines, choose whole beans: they are ground fresh and keep their aroma better. Keep the pack tightly closed, away from strong smells.</p><h2>How to choose</h2><p>Every Sotocal blend combines Arabica and Robusta. The more intense blends give more crema; the Decaf keeps the flavour without the caffeine.</p>');
  const guide = { handle: 'guia-do-cafe', title: T(lang, 'Guia do café', 'Coffee guide'), url: `${prefix}/blogs/guia-do-cafe` };
  const recipes = { handle: 'receitas', title: T(lang, 'Receitas', 'Recipes'), url: `${prefix}/blogs/receitas` };
  const mkArticle = (blog, handle, title, content, extra = {}) => ({
    id: handle.length, handle, title, url: `${blog.url}/${handle}`, author: 'Sotocal', published_at: '2026-10-12T09:00:00+01:00', updated_at: '2026-10-20T09:00:00+01:00',
    content, excerpt: '', excerpt_or_content: content, image: img('pic01.jpg', 1000, 667, ''), tags: [], comments_count: 0, metafields: { sotocal: { related_products: mf([products['lote-super-milano'], products['lote-super']]), ...(extra.mf || {}) } },
  });
  const articles = [
    mkArticle(guide, 'melhor-cafe-em-grao-para-maquina-automatica', T(lang, 'O melhor café em grão para máquina automática', 'The best coffee beans for bean-to-cup machines'), articleBody),
    mkArticle(guide, 'cimbalino-ou-bica', T(lang, 'Cimbalino ou bica? O que se pede no Porto', 'What is a cimbalino?'), T(lang, '<p>No Porto, um expresso chama-se cimbalino. Em Lisboa, pede-se uma bica.</p>', '<p>In Porto, an espresso is called a cimbalino. In Lisbon, you ask for a bica.</p>')),
    mkArticle(guide, 'como-tirar-o-melhor-expresso', T(lang, 'Como tirar o melhor expresso', 'How to pull a great espresso'), T(lang, '<p>Afine o moinho à humidade do dia, use no mínimo 6 g por bica e lave filtros e porta-filtros todos os dias.</p>', '<p>Adjust the grinder to the day’s humidity, use at least 6 g per espresso and wash the filters and portafilters every day.</p>')),
    // The real Delta-alternatives draft (docs/seo/drafts/cafe-delta-alternativas.md) with the real prices read on 17/11/2026.
    mkArticle(guide, 'cafe-delta-alternativas', T(lang, 'Café Delta em grão: alternativas e preços por kg', 'Delta coffee beans: alternatives and prices per kg'),
      T(lang, '<h2>O que comparamos e o que não comparamos</h2><p>Comparamos o que se verifica numa página pública: preço, tamanho da embalagem, formato e se o preço é normal ou de promoção. Não dizemos que um café é melhor ou pior do que outro. O gosto é de cada pessoa.</p><h2>Embalagens mais pequenas</h2><p>Os cafés Delta em embalagens de 500 g ou 750 g têm preço por kg diferente do de 1 kg: por exemplo, o Delta Lote Portugal, de 750 g, estava a 17,32 € por kg em promoção (preço recomendado: 25,32 € por kg). Compare sempre o preço por kg, e a data.</p>',
        '<h2>What we compare and what we do not</h2><p>We compare what a public page shows: price, pack size, format and whether the price is regular or a promotion. We do not say one coffee is better or worse than another.</p>'),
      { mf: {
        answer: mf(T(lang, 'O café Delta em grão de 1 kg custava, a 17 de novembro de 2026 no Continente, entre 19,99 € e 25,99 € por kg, consoante o lote. Nas mesmas prateleiras, alternativas de 1 kg iam de 10,99 € (marca própria) a 21,99 € (Nicola). Esta página compara preços, não o sabor: cada preço tem a fonte e a data em que o lemos.',
          'On 17 November 2026 at Continente, 1 kg of Delta coffee beans cost between 19,99 € and 25,99 € per kg, depending on the blend. On the same shelves, 1 kg alternatives ran from 10,99 € (own label) to 21,99 € (Nicola). This page compares prices, not taste.')),
        last_reviewed: mf('2026-11-17'), sources: mf(['https://www.continente.pt/pesquisa/?q=cafe+em+grao']),
        compared: mf(deltaGuide), self_included: mf(true),
        criteria: mf(T(lang, 'Preço por kg, tamanho da embalagem, formato e tipo de preço (normal ou promoção), lidos no Continente Online a 17/11/2026. Sem juízos de qualidade.', 'Price per kg, pack size, format and type of price, read on Continente Online on 17/11/2026. No judgement on quality.')),
        when_not: mf('[[TBC: texto da Sotocal, factual, sobre quando uma alternativa serve melhor]]'),
        related_products: mf([products['lote-super-milano'], products['lote-super']]),
      } }),
  ];
  const recipe = mkArticle(recipes, 'frango-assado-com-piri-piri', T(lang, 'Frango assado com piri-piri', 'Piri-piri roast chicken'), T(lang, '<p>Uma receita simples com piri-piri Sotocal.</p>', '<p>A simple recipe with Sotocal piri-piri.</p>'), {
    mf: {
      recipe_yield: mf('[[TBC: 4 pessoas?]]'), recipe_prep_minutes: mf(150), recipe_cook_minutes: null, recipe_category: mf(T(lang, 'Prato principal', 'Main course')),
      recipe_ingredients: mf(T(lang, ['1 frango', '5 vagens de piri-piri Sotocal muito bem picadas, ou 1 colher de sobremesa (10 ml) de piri-piri moído Sotocal', '2 colheres de sopa (30 g) de margarina', '1 dente de alho bem picado', 'sal'], ['1 chicken', '5 Sotocal piri-piri pods, very finely chopped, or 1 dessertspoon (10 ml) Sotocal ground piri-piri', '2 tablespoons (30 g) margarine', '1 garlic clove, finely chopped', 'salt'])),
      recipe_steps: mf(T(lang, ['Misture a margarina com o piri-piri, o alho picado e o sal.', 'Barre o frango com esta pasta, por fora e por dentro, sem poupar. Deixe os sabores entranharem durante cerca de 2 horas e meia.', 'Asse o frango no churrasco (aberto ao meio) ou no forno.', 'No forno, vá virando o frango e pincelando-o com o molho que se forma no tabuleiro, para ficar tostado por igual.'], ['Mix the margarine with the piri-piri, chopped garlic and salt.', 'Spread the paste generously over the chicken, inside and out. Leave the flavours to soak in for about two and a half hours.', 'Roast the chicken on the barbecue (butterflied) or in the oven.', 'In the oven, keep turning the chicken and basting it with the juices in the tray so it browns evenly.'])),
    },
  });
  guide.articles = articles; guide.articles_count = articles.length;
  recipes.articles = [recipe]; recipes.articles_count = 1;

  const pageContent = {
    historia: T(lang, '<h2>A nossa missão</h2><p>A missão da Sotocal é ter o melhor lote de café do mercado português: um café que dê a quem o toma um momento de prazer pelo aroma e pelo sabor e que, depois de bebido, deixe vontade de tomar, logo a seguir, um segundo Café Sotocal.</p><p>Para cumprir esta missão, fazemos bem, todos os dias, cada passo: a escolha e a combinação das origens, a torra e a distribuição.</p>', '<h2>Our mission</h2><p>Sotocal’s mission is to have the best coffee blend on the Portuguese market: a coffee that gives a moment of pleasure through its aroma and flavour and, once drunk, leaves you wanting a second Sotocal coffee straight after.</p><p>To fulfil this mission, we do every step well, every day: choosing and combining origins, roasting and distribution.</p>'),
    'a-torra': T(lang, '<h2>Origens e lote</h2><p>Cada lote Sotocal junta cafés de várias origens e dos dois tipos, arábica e robusta.</p><h2>O que acontece na torra</h2><p>Na torra, os grãos são aquecidos a alta temperatura e mantidos sempre em movimento, para torrarem por igual. Pelo caminho, o grão cresce, perde peso, muda de cor e muda de composição.</p>', '<h2>Origins and blending</h2><p>Every Sotocal blend brings together coffees from several origins and of both types, Arabica and Robusta.</p><h2>What happens in the roast</h2><p>During roasting the beans are heated to a high temperature and kept moving so they roast evenly. Along the way the bean grows, loses weight and changes colour and composition.</p>'),
    'cafe-e-saude': T(lang, '<p>O café contém cafeína, água e compostos aromáticos formados na torra. Segundo a Autoridade Europeia para a Segurança dos Alimentos (EFSA, 2015), consumos habituais de cafeína até 400 mg por dia não levantam preocupações de segurança para adultos saudáveis; na gravidez e na amamentação, o limite indicado é de 200 mg por dia. <a href="https://www.efsa.europa.eu/en/topics/topic/caffeine">Ler a opinião da EFSA</a>.</p><p>[[TBC: legal review]]</p>', '<p>Coffee contains caffeine, water and aroma compounds formed during roasting. According to the European Food Safety Authority (EFSA, 2015), habitual caffeine intakes of up to 400 mg a day do not raise safety concerns for healthy adults; during pregnancy and breastfeeding the figure is 200 mg a day. <a href="https://www.efsa.europa.eu/en/topics/topic/caffeine">Read the EFSA opinion</a>.</p><p>[[TBC: legal review]]</p>'),
  };
  const mkPage = (handle, title, suffix, content = '') => ({ id: handle.length, handle, title, url: `${prefix}/pages/${handle}`, template_suffix: suffix, content, published_at: '2026-10-01', updated_at: '2026-10-28T10:00:00+00:00', metafields: {} });
  const pagesByHandle = {
    historia: mkPage('historia', T(lang, 'História', 'Our story'), 'historia', pageContent.historia),
    'a-torra': mkPage('a-torra', T(lang, 'A torra', 'Our roast'), 'a-torra', pageContent['a-torra']),
    profissional: mkPage('profissional', T(lang, 'Profissional', 'For business'), 'profissional'),
    'onde-beber-sotocal': mkPage('onde-beber-sotocal', T(lang, 'Onde beber Sotocal', 'Where to drink Sotocal'), 'locator'),
    'sobre-a-sotocal': mkPage('sobre-a-sotocal', T(lang, 'Sobre a Sotocal', 'About Sotocal'), 'facts'),
    contactos: mkPage('contactos', T(lang, 'Contactos', 'Contact'), 'contact'),
    'perguntas-frequentes': mkPage('perguntas-frequentes', T(lang, 'Perguntas frequentes', 'FAQ'), 'faq'),
    'levantar-no-cafe': mkPage('levantar-no-cafe', T(lang, 'Levantar num café Sotocal', 'Collect at a Sotocal café'), 'pickup'),
    subscricao: mkPage('subscricao', T(lang, 'Subscrição de café', 'Coffee subscription'), 'subscription'),
    'despensa-do-norte': mkPage('despensa-do-norte', 'Despensa do Norte', 'gift-box'),
    'declaracao-de-acessibilidade': mkPage('declaracao-de-acessibilidade', T(lang, 'Declaração de acessibilidade', 'Accessibility statement'), 'accessibility', T(lang, '<p>[[TBC: texto da declaração, ver ADMIN-SETUP.md]]</p>', '<p>[[TBC: statement text, see ADMIN-SETUP.md]]</p>')),
    'calculadora-custo-chavena': mkPage('calculadora-custo-chavena', T(lang, 'Calculadora de custo por chávena', 'Cost-per-cup calculator'), 'calculator'),
    'qual-o-cafe-para-a-minha-maquina': mkPage('qual-o-cafe-para-a-minha-maquina', T(lang, 'Qual o café para a minha máquina?', 'Which coffee for my machine?'), 'quiz'),
    'q-chavena': mkPage('q-chavena', T(lang, 'Chávena', 'Cup'), 'qr'),
    'cafe-e-saude': mkPage('cafe-e-saude', T(lang, 'Café e saúde', 'Coffee and health'), '', pageContent['cafe-e-saude']),
  };

  const cartItems = [
    { key: 'k1', quantity: 1, properties: { [T(lang, 'Mensagem de oferta', 'Gift message')]: T(lang, 'Feliz Natal (exemplo)', 'Merry Christmas (sample)'), _interno: 'oculto' }, product: products['lote-super-milano'], product_id: products['lote-super-milano'].id, variant: products['lote-super-milano'].variants[1], variant_id: products['lote-super-milano'].variants[1].id, url: products['lote-super-milano'].url, image: products['lote-super-milano'].featured_image, final_line_price: PRICE, selling_plan_allocation: null },
  ];
  const cart = { item_count: 1, items: cartItems, total_price: PRICE, items_subtotal_price: PRICE, attributes: {}, currency: { iso_code: 'EUR' }, note: '' };

  const linklists = {
    'main-menu': { links: [
      { title: T(lang, 'Loja', 'Shop'), url: `${prefix}/collections/all`, current: false, links: [
        { title: T(lang, 'Café', 'Coffee'), url: `${prefix}/collections/cafe`, links: [{ title: T(lang, 'Em grão', 'Whole bean'), url: `${prefix}/collections/cafe-em-grao` }, { title: T(lang, 'Moído', 'Ground'), url: `${prefix}/collections/cafe-moido` }] },
        { title: T(lang, 'Especiarias', 'Spices'), url: `${prefix}/collections/especiarias`, links: [] },
        { title: T(lang, 'Sucedâneos', 'Substitutes'), url: `${prefix}/collections/sucedaneos-do-cafe`, links: [] },
        { title: T(lang, 'Complementares', 'Accompaniments'), url: `${prefix}/collections/complementares`, links: [] },
        { title: 'Conservas', url: `${prefix}/collections/conservas`, links: [] },
        { title: T(lang, 'Presentes', 'Gifts'), url: `${prefix}/collections/presentes`, links: [{ title: 'Despensa do Norte', url: `${prefix}/products/despensa-do-norte` }] },
      ] },
      { title: T(lang, 'Os lotes', 'Our blends'), url: `${prefix}/collections/cafe`, links: [] },
      { title: T(lang, 'A torra', 'The roast'), url: `${prefix}/pages/a-torra`, links: [] },
      { title: 'A Sotocal', url: `${prefix}/pages/historia`, links: [
        { title: T(lang, 'História', 'Our story'), url: `${prefix}/pages/historia`, links: [] },
        { title: T(lang, 'Contactos', 'Contact'), url: `${prefix}/pages/contactos`, links: [] },
      ] },
      { title: T(lang, 'Guia do café', 'Coffee guide'), url: `${prefix}/blogs/guia-do-cafe`, links: [] },
      { title: T(lang, 'Profissional', 'For business'), url: `${prefix}/pages/profissional`, links: [] },
    ] },
    footer: { links: [] },
  };

  const pageList = [
    { template: 'index', out: 'index.html', url: '/', type: 'index' },
    { template: 'product', out: 'products/lote-super-milano/index.html', url: '/products/lote-super-milano/', type: 'product', product: 'lote-super-milano' },
    { template: 'product.spice', out: 'products/piri-piri/index.html', url: '/products/piri-piri/', type: 'product', product: 'piri-piri' },
    { template: 'product.bundle', out: 'products/despensa-do-norte/index.html', url: '/products/despensa-do-norte/', type: 'product', product: 'despensa-do-norte' },
    { template: 'collection.cafe', out: 'collections/cafe/index.html', url: '/collections/cafe/', type: 'collection', collection: 'cafe' },
    { template: 'collection.presentes', out: 'collections/presentes/index.html', url: '/collections/presentes/', type: 'collection', collection: 'presentes' },
    { template: 'list-collections', out: 'collections/index.html', url: '/collections/', type: 'list-collections' },
    { template: 'cart', out: 'cart/index.html', url: '/cart/', type: 'cart' },
    { template: 'search', out: 'search/index.html', url: '/search/', type: 'search' },
    { template: '404', out: '404.html', url: '/404.html', type: '404' },
    { template: 'password', out: 'password/index.html', url: '/password/', type: 'password', layout: 'password' },
    { template: 'blog', out: 'blogs/guia-do-cafe/index.html', url: '/blogs/guia-do-cafe/', type: 'blog', blog: 'guide' },
    { template: 'article', out: 'blogs/guia-do-cafe/melhor-cafe-em-grao-para-maquina-automatica/index.html', url: '/blogs/guia-do-cafe/melhor-cafe-em-grao-para-maquina-automatica/', type: 'article', blog: 'guide', article: 0 },
    { template: 'article', out: 'blogs/guia-do-cafe/cafe-delta-alternativas/index.html', url: '/blogs/guia-do-cafe/cafe-delta-alternativas/', type: 'article', blog: 'guide', article: 3 },
    { template: 'article.recipe', out: 'blogs/receitas/frango-assado-com-piri-piri/index.html', url: '/blogs/receitas/frango-assado-com-piri-piri/', type: 'article', blog: 'recipes', article: 'recipe' },
    ...Object.values(pagesByHandle).map((p) => ({ template: p.template_suffix ? `page.${p.template_suffix}` : 'page', out: `pages/${p.handle}/index.html`, url: `/pages/${p.handle}/`, type: 'page', page: p.handle })),
    { template: 'metaobject/method', out: 'pages/metodo/maquina-automatica/index.html', url: '/pages/metodo/maquina-automatica/', type: 'metaobject', metaobject: 'method' },
    { template: 'metaobject/machine', out: 'pages/maquina/modelo-exemplo/index.html', url: '/pages/maquina/modelo-exemplo/', type: 'metaobject', metaobject: 'machine' },
    { template: 'metaobject/machine', out: 'pages/maquina/modelo-sem-fonte/index.html', url: '/pages/maquina/modelo-sem-fonte/', type: 'metaobject', metaobject: 'machine-incomplete' },
    { template: 'metaobject/service_area', out: 'pages/fornecedor-de-cafe/porto/index.html', url: '/pages/fornecedor-de-cafe/porto/', type: 'metaobject', metaobject: 'area-porto' },
    { template: 'metaobject/service_area', out: 'pages/fornecedor-de-cafe/lisboa/index.html', url: '/pages/fornecedor-de-cafe/lisboa/', type: 'metaobject', metaobject: 'area-lisboa' },
    // Açores stays a draft (not served): the gate fixture.
    { template: 'metaobject/service_area', out: 'pages/fornecedor-de-cafe/acores/index.html', url: '/pages/fornecedor-de-cafe/acores/', type: 'metaobject', metaobject: 'area-acores' },
    { template: 'customers/login', out: 'account/login/index.html', url: '/account/login/', type: 'customers/login' },
  ];
  const existing = (t) => {
    try { readFileSync(path.join(root, 'templates', `${t}.json`)); return true; } catch { try { readFileSync(path.join(root, 'templates', `${t}.liquid`)); return true; } catch { return false; } }
  };
  const pages = pageList.filter((p) => existing(p.template));

  const blogs = { 'guia-do-cafe': guide, receitas: recipes };
  const current = {
    product: page.product ? products[page.product] : undefined,
    collection: page.collection ? collections[page.collection] : undefined,
    page: page.page ? pagesByHandle[page.page] : undefined,
    metaobject: page.metaobject ? hubEntries[page.metaobject] : undefined,
    blog: page.blog === 'guide' ? guide : page.blog === 'recipes' ? recipes : undefined,
    article: page.article === 'recipe' ? recipe : page.article != null ? articles[page.article] : undefined,
  };
  const titleFor = current.product?.title || current.collection?.title || current.article?.title || current.page?.title || current.blog?.title || '';
  const [type, suffix] = (page.template || 'index').split('.');

  const globals = {
    settings,
    shop: {
      name: 'Sotocal', url: 'https://sotocalcafes.pt', description: T(lang, 'Café torrado no Porto desde 1960.', 'Coffee roasted in Porto since 1960.'),
      customer_accounts_enabled: true, enabled_payment_types: ['visa', 'master', 'mbway', 'paypal', 'multibanco'],
      policies: [
        { title: T(lang, 'Política de privacidade', 'Privacy policy'), url: `${prefix}/policies/privacy-policy` },
        { title: T(lang, 'Termos do serviço', 'Terms of service'), url: `${prefix}/policies/terms-of-service` },
        { title: T(lang, 'Política de reembolso', 'Refund policy'), url: `${prefix}/policies/refund-policy` },
        { title: T(lang, 'Política de envio', 'Shipping policy'), url: `${prefix}/policies/shipping-policy` },
      ],
      privacy_policy: { url: `${prefix}/policies/privacy-policy` },
      metaobjects: { partner_cafe: { values: process.env.PROTO_NOCAFES ? [] : cafes }, faq_item: { values: faqs }, machine: { values: hubMachines }, service_area: { values: Object.values(areaEntries) }, competitor: { values: competitors }, timeline_event: { values: [] }, person: { values: [] }, award: { values: [] } },
    },
    routes: {
      root_url: en ? '/en' : '/', cart_url: `${prefix}/cart`, cart_add_url: `${prefix}/cart/add`, cart_change_url: `${prefix}/cart/change`, cart_update_url: `${prefix}/cart/update`,
      predictive_search_url: `${prefix}/search/suggest`, search_url: `${prefix}/search`, account_url: `${prefix}/account`, account_login_url: `${prefix}/account/login`,
      collections_url: `${prefix}/collections`, all_products_collection_url: `${prefix}/collections/all`,
    },
    request: { locale: { iso_code: lang, primary: !en }, page_type: page.type || 'index', design_mode: false, path: page.url || '/', host: 'localhost' },
    localization: {
      language: { iso_code: lang, endonym_name: en ? 'English' : 'português' },
      available_languages: [{ iso_code: 'pt-PT', endonym_name: 'português' }, { iso_code: 'en', endonym_name: 'English' }],
    },
    template: { name: type, suffix: suffix || null, directory: type === 'customers' ? 'customers' : null },
    canonical_url: `https://sotocalcafes.pt${prefix}${page.url || '/'}`.replace(/\/index\.html$/, '/'),
    page_title: titleFor || T(lang, 'Sotocal', 'Sotocal'),
    page_description: '',
    page_image: null,
    current_page: 1,
    current_tags: null,
    cart, linklists, collections: collectionList, blogs, customer: null,
    ...current,
    search: { performed: false, terms: '', results: [], results_count: 0 },
    pages: pagesByHandle,
  };

  const contentForHeader = `<script>
/* Prototype stand-in for Shopify's content_for_header: Customer Privacy API + analytics.publish (no network). */
window.Shopify = window.Shopify || {};
(function () {
  var KEY = 'proto:consent';
  var read = function () { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } };
  window.Shopify.customerPrivacy = {
    shouldShowBanner: function () { return !read(); },
    setTrackingConsent: function (c, cb) { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} cb && cb(); },
    analyticsProcessingAllowed: function () { return !!(read() || {}).analytics; },
    marketingAllowed: function () { return !!(read() || {}).marketing; },
    preferencesProcessingAllowed: function () { return !!(read() || {}).preferences; }
  };
  window.Shopify.loadFeatures = function (f, cb) { setTimeout(function () { cb(); }, 0); };
  window.Shopify.analytics = { publish: function (n, d) { (window.__events = window.__events || []).push([n, d]); } };
})();
</script>`;

  return { globals, products, collections, routes: globals.routes, pages, contentForHeader };
}

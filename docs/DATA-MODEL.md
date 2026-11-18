# Data model

This document covers everything the theme reads beyond Shopify's built-in objects. The JSON files in `/store-setup/` are the source of truth; the tables below are generated from them. `scripts/store-setup.mjs` creates the definitions through the Admin GraphQL API. It uses version `2026-10`, the latest stable release, which Shopify supports until 16/10/2027 (https://shopify.dev/docs/api/usage/versioning).

| File | What it defines |
|---|---|
| `store-setup/metaobject-definitions.json` | 10 metaobject types, created first because metafields reference them (6 from the first build, plus `method`, `machine`, `substitute`, `competitor` from the SEO/GEO work of 17/11/2026) |
| `store-setup/metafield-definitions.json` | 42 metafield definitions on products, collections and articles, in namespace `sotocal` |
| `store-setup/metaobject-entries.json` | Seed entries built only from verified facts (timeline, awards, people, FAQ), with EN translations |
| `store-setup/products.json` → `products.csv` | 23 CSV products plus the 2 × 1 kg pack (Bundles app), with template suffixes, metafield values, unit-price rules and EN titles/handles |
| `store-setup/collections.json` | 8 smart collections with rules, intros and EN handles |
| `store-setup/pages.json` | 13 pages (plus 2 optional QR pages) and 2 blogs, with template suffixes and EN handles |
| `store-setup/menus.json` | `main-menu` and `footer` |

## Conventions

- **Namespace.** Every custom metafield uses `sotocal`. Keys are `snake_case` and never change after launch, because Shopify does not allow changing a definition's type.
- **Liquid access.** Lists and references are read with `.value`. `product.metafields.sotocal.tasting_notes.value` is an array, and `product.metafields.sotocal.faq.value` is an array of metaobjects. A single reference works the same way: `article.metafields.sotocal.author.value.name`.
- **Storefront access.** Every metaobject definition is created with `access.storefront = PUBLIC_READ`. The Admin API enum `MetaobjectStorefrontAccess` has two values, `NONE` and `PUBLIC_READ` (https://shopify.dev/docs/api/admin-graphql/latest/enums/MetaobjectStorefrontAccess). Metafield definitions also get `PUBLIC_READ` (https://shopify.dev/docs/api/admin-graphql/latest/enums/MetafieldStorefrontAccessInput), so a future headless or app integration can read them.
- **Publishable.** `partner_cafe`, `faq_item`, `timeline_event`, `person` and `award` are publishable. Only **Active** entries reach the storefront, so drafts can be prepared safely.
- **Translatable.** Every metaobject type has the translatable capability on (`capabilities.translatable.enabled`, https://shopify.dev/docs/api/admin-graphql/latest/input-objects/MetaobjectCapabilityTranslatableInput). EN text is added in Translate & Adapt, or by the `--seed` step.
- **No default values.** Shopify metafield definitions cannot hold defaults. Where the brief sets one (`fic_operator`, `fic_origin`), the theme renders it when the field is blank.
- **Validation names.** These follow https://shopify.dev/docs/apps/build/metafields/list-of-validation-options: `min`, `max`, `regex`, `choices`, `file_type_options`, `max_precision`, `schema`, `list.max` and `metaobject_definition_type`. The last one lets a reference point at a type by name, so no GIDs are hard-coded.
- **No `list.multi_line_text_field`.** Shopify does not offer list versions of multi-line or rich text (https://shopify.dev/docs/apps/build/metafields/list-of-data-types). `sotocal.recipe_steps` is therefore `list.single_line_text_field`, with one step per item and up to 1000 characters per step. Liquid iteration is unchanged.
- **Placeholder data.** Products with placeholder prices carry the tag `preco-provisorio` and are imported as **draft**. While the theme setting `show_tbc_markers` is on, the theme shows a "Preço provisório" marker on them.

## Metafield definitions

#### Product

| Key | Type | Name (admin) | Validations | Notes |
|---|---|---|---|---|
| `sotocal.subtitle` | `single_line_text_field` | Subtítulo | max 80 | Linha por baixo do título, ex.: «Café em grão e moído». |
| `sotocal.character` | `single_line_text_field` | Linha de carácter | max 140 | Uma frase sobre o carácter do lote, ex.: «Intenso e persistente, com creme aveludado.» |
| `sotocal.tasting_notes` | `list.single_line_text_field` | Descritores | list.max 3 | Exatamente 3 descritores curtos (chips), ex.: Intenso, Aroma suave, Creme aveludado. |
| `sotocal.intensity` | `number_integer` | Intensidade (1–5) | min 1; max 5 | [[TBC]] Escala de intensidade definida pela Sotocal. |
| `sotocal.roast` | `single_line_text_field` | Torra | max 120 | Descrição curta da torra, ex.: «Torra intensa de estilo italiano». |
| `sotocal.origins` | `multi_line_text_field` | Origens |  | Origens e composição do lote (texto do acordeão «Origens e torra»). |
| `sotocal.best_for` | `list.single_line_text_field` | Ideal para | list.max 5 | [[TBC]] Métodos/usos recomendados, ex.: Máquina automática, Moka, Expresso. |
| `sotocal.arabica_robusta` | `single_line_text_field` | Arábica / robusta | max 60 | [[TBC]] Proporção arábica/robusta, ex.: «70% arábica, 30% robusta». Deixar vazio até confirmação. |
| `sotocal.blend` | `single_line_text_field` | Lote | choices: Super Milano / Super / Reggio / Descafeinado | Fonte do filtro «Lote» no Search & Discovery (o tema não depende deste campo). |
| `sotocal.preparation` | `multi_line_text_field` | Como preparar |  | Texto específico do produto para o acordeão «Como preparar». Se vazio, o tema mostra as regras gerais de preparação. |
| `sotocal.fic_ingredients` | `multi_line_text_field` | FIC: ingredientes |  | Regulamento (UE) 1169/2011. Lista de ingredientes por ordem decrescente de peso. |
| `sotocal.fic_allergens` | `list.single_line_text_field` | FIC: alergénios |  | Alergénios do Anexo II do Reg. 1169/2011 presentes no produto (o tema destaca-os). Sem alergénios: escrever «Nenhum». Vazio = informação por preencher (o tema mostra «Informação a completar»). |
| `sotocal.fic_net_quantity` | `single_line_text_field` | FIC: quantidade líquida | max 80 | Ex.: «1 kg» ou «250 g». Em produtos com variantes de peso, indicar «250 g ou 1 kg, conforme o formato escolhido». |
| `sotocal.fic_storage` | `multi_line_text_field` | FIC: conservação |  | Condições de conservação e, se aplicável, de utilização após abertura. |
| `sotocal.fic_best_before_note` | `single_line_text_field` | FIC: data de durabilidade mínima | max 140 | Ex.: «Consumir de preferência antes de: ver embalagem». |
| `sotocal.fic_operator` | `multi_line_text_field` | FIC: operador responsável |  | Nome e morada do operador. Se vazio, o tema mostra o valor por omissão. Theme default: «Sotocal – Sociedade Torrefactora De Cafés de Angola, Lda., Rua Engenheiro Ferreira Dias, n.º 398, 4100-246 Porto, Portugal». |
| `sotocal.fic_origin` | `single_line_text_field` | FIC: origem / proveniência | max 120 | Se vazio, o tema mostra o valor por omissão. Theme default: «Torrado em Portugal». |
| `sotocal.fic_nutrition` | `json` | FIC: declaração nutricional | JSON schema | Opcional. Formato: {"per":"100 g","rows":[{"label":"Energia","value":"… kJ / … kcal"}]} |
| `sotocal.faq` | `list.metaobject_reference` | Perguntas frequentes | metaobject_definition_type faq_item; list.max 6 | 3 perguntas (metaobjeto faq_item) mostradas na página de produto, com schema FAQPage. |
| `sotocal.pairings` | `list.product_reference` | Combina com | list.max 4 | Produtos sugeridos na secção «Combina com». |
| `sotocal.lowest_price_30d` | `money` | Preço mais baixo nos últimos 30 dias |  | Diretiva Omnibus. Preencher sempre que houver preço de comparação (desconto). O tema só o mostra quando existe compare-at price. |
| `sotocal.gift_box_items` | `list.metaobject_reference` | Conteúdo do cabaz | metaobject_definition_type gift_box_item; list.max 12 | Itens do cabaz «Despensa do Norte» (metaobjeto gift_box_item). |
| `sotocal.story` | `multi_line_text_field` | História do lote | max 600 | Texto curto sobre o lote, escrito pela Sotocal. Sem factos por confirmar. [[TBC: Sotocal]] |
| `sotocal.recommended_methods` | `list.metaobject_reference` | Métodos recomendados | metaobject_definition_type method; list.max 4 | Métodos de preparação (metaobjeto method) com que o lote funciona melhor, segundo a Sotocal. Liga a página do produto aos hubs de método. [[TBC: pergunta 14]] |
| `sotocal.roast_date_policy` | `single_line_text_field` | Prática de data de torra | choices: impressa-na-embalagem / torrado-na-semana-do-envio / torrado-por-encomenda | Só preencher com o que a Sotocal faz de facto. Vazio = o site não faz nenhuma afirmação de frescura. [[TBC: decisão D10]] |
| `sotocal.grind_options` | `list.single_line_text_field` | Moagens disponíveis | list.max 6 | Para o formato Moído: moagens oferecidas (ex.: expresso, filtro, cafeteira italiana). Vazio = uma só moagem. [[TBC: Sotocal]] |
| `sotocal.substitute` | `metaobject_reference` | Sucedâneo (ficha) | metaobject_definition_type substitute | Só em sucedâneos: liga ao metaobjeto substitute (o que é, como se torra, como se prepara, factos com fonte). |

#### Collection

| Key | Type | Name (admin) | Validations | Notes |
|---|---|---|---|---|
| `sotocal.intro` | `multi_line_text_field` | Introdução curta | max 700 | 60 a 120 palavras, mostrada por cima da grelha: responde logo à pergunta do título. A descrição da coleção é o texto SEO mais longo, mostrado por baixo da grelha. |
| `sotocal.faq` | `list.metaobject_reference` | Perguntas frequentes | metaobject_definition_type faq_item; list.max 6 | Até 6 perguntas (faq_item) mostradas por baixo da grelha, com schema FAQPage. |
| `sotocal.buying_guide` | `multi_line_text_field` | Guia de compra curto | max 600 | Poucas linhas para quem hesita entre lotes ou formatos. Escrito pela Sotocal. [[TBC: Sotocal]] |
| `sotocal.related_methods` | `list.metaobject_reference` | Métodos relacionados | metaobject_definition_type method; list.max 6 | Hubs de método (metaobjeto method) ligados a partir da coleção. |

#### Article

| Key | Type | Name (admin) | Validations | Notes |
|---|---|---|---|---|
| `sotocal.related_products` | `list.product_reference` | Produtos relacionados | list.max 4 | Cada guia liga a pelo menos um produto (e o tema liga à coleção do produto). |
| `sotocal.author` | `metaobject_reference` | Autor (pessoa) | metaobject_definition_type person | Metaobjeto person usado na assinatura e no schema BlogPosting/Recipe. [[TBC: consentimento de Maria José Barbosa]] |
| `sotocal.recipe_yield` | `single_line_text_field` | Receita: doses | max 40 | Ex.: «4 pessoas». |
| `sotocal.recipe_prep_minutes` | `number_integer` | Receita: preparação (min) | min 0; max 1440 |  |
| `sotocal.recipe_cook_minutes` | `number_integer` | Receita: confeção (min) | min 0; max 1440 |  |
| `sotocal.recipe_ingredients` | `list.single_line_text_field` | Receita: ingredientes |  | Um ingrediente por linha da lista, com quantidade métrica, ex.: «1 colher de chá de piri-piri Sotocal». |
| `sotocal.recipe_steps` | `list.single_line_text_field` | Receita: passos |  | Um passo por item, pela ordem. (Shopify não tem list.multi_line_text_field.) |
| `sotocal.recipe_category` | `single_line_text_field` | Receita: categoria | max 60 | Ex.: «Prato principal». |
| `sotocal.answer` | `multi_line_text_field` | Resposta direta | max 420 | 40 a 70 palavras por baixo do título. A primeira frase responde à pergunta do título. |
| `sotocal.last_reviewed` | `date` | Última revisão |  | Data em que o conteúdo foi realmente revisto. Mostrada no artigo e usada em dateModified. |
| `sotocal.sources` | `list.url` | Fontes |  | URLs das fontes de cada facto de terceiros. Obrigatório em guias com números ou afirmações factuais. |

### How the theme uses product metafields

| Theme location | Fields |
|---|---|
| Buy box (product page) | `subtitle` (H1 sub-line), `character`, `intensity`, `tasting_notes` (3 chips), `best_for` |
| «Descrição» accordion | `product.description` |
| «Origens e torra» accordion | `origins`, `roast`, `arabica_robusta` |
| «Como preparar» accordion | `preparation`; if blank, the theme's general preparation rules (moka, bean-to-cup machines and the legacy espresso rules) |
| «Informação alimentar» accordion (EU 1169/2011, visible before purchase) | `fic_ingredients`, `fic_allergens`, `fic_net_quantity`, `fic_storage`, `fic_best_before_note`, `fic_operator` (default), `fic_origin` (default), `fic_nutrition`. Blank fields render «Informação a completar». |
| Price block | `lowest_price_30d`: the Omnibus line, shown only when a compare-at price is set |
| FAQ block and FAQPage schema | `faq` |
| «Combina com» | `pairings` |
| Gift box template (`product.bundle`) | `gift_box_items` |
| Homepage fold 3 (blends) and collection tiles | `character`, `tasting_notes`, `best_for`, plus the variant's unit price |
| Search & Discovery «Lote» filter | `blend` (used only as the filter source) |

`fic_nutrition` must match this shape, which a JSON schema validates:

```json
{
  "per": "100 g",
  "rows": [
    { "label": "Energia", "value": "… kJ / … kcal" },
    { "label": "Lípidos", "value": "… g" },
    { "label": "dos quais saturados", "value": "… g" },
    { "label": "Hidratos de carbono", "value": "… g" },
    { "label": "dos quais açúcares", "value": "… g" },
    { "label": "Proteínas", "value": "… g" },
    { "label": "Sal", "value": "… g" }
  ]
}
```

Values must come from the client's spec sheets only `[[TBC: fichas técnicas]]`. The field is optional because some products may be exempt from the nutrition declaration under Annex V of Reg. 1169/2011. The client's food-safety adviser must confirm this per product `[[TBC: legal review]]`.

## Metaobject definitions

### `faq_item` (Pergunta frequente)

Pergunta e resposta para páginas de FAQ, produto, Profissional e Sobre a Sotocal (schema FAQPage). Display name: `question`. Publishable: yes (only Active entries reach the storefront). Translatable: yes. Storefront access: PUBLIC_READ.

| Field | Type | Required | Validations | Notes |
|---|---|---|---|---|
| `question` | `single_line_text_field` | yes | max 160 |  |
| `answer` | `rich_text_field` | yes |  | A primeira frase responde à pergunta. |
| `category` | `single_line_text_field` | yes | choices: geral / encomendas / envios / produto / subscricao / profissional / sobre |  |
| `scope` | `single_line_text_field` |  | choices: global / familia-de-produto / metodo | Onde a pergunta se aplica: geral (todo o site), familia-de-produto ou metodo. Opcional. |

### `person` (Pessoa)

Pessoas da Sotocal para a página História, assinaturas de artigos e schema Person. Fotografias reais apenas. Display name: `name`. Publishable: yes (only Active entries reach the storefront). Translatable: yes. Storefront access: PUBLIC_READ.

| Field | Type | Required | Validations | Notes |
|---|---|---|---|---|
| `name` | `single_line_text_field` | yes |  |  |
| `role` | `single_line_text_field` |  |  | [[TBC: título preferido de José Barbosa]] |
| `bio` | `multi_line_text_field` |  |  | Não fixar idades fora de contexto datado. |
| `photo` | `file_reference` |  | file_type_options ["Image"] | Fotografia real. Nunca gerada por IA. |
| `same_as` | `list.url` |  |  | URLs de perfis públicos (LinkedIn, Wikidata…) para schema sameAs. |

### `gift_box_item` (Item do cabaz)

Conteúdo do cabaz «Despensa do Norte». Display name: `name`. Publishable: no. Translatable: yes. Storefront access: PUBLIC_READ.

| Field | Type | Required | Validations | Notes |
|---|---|---|---|---|
| `name` | `single_line_text_field` | yes |  |  |
| `quantity` | `single_line_text_field` |  |  | Ex.: «250 g», «1 frasco». |
| `product` | `product_reference` |  |  | Opcional: liga o item à página do produto. |
| `image` | `file_reference` |  | file_type_options ["Image"] |  |

### `partner_cafe` (Café parceiro)

Cafés clientes Sotocal para o localizador «Onde beber Sotocal» e para o levantamento no café. Só aparecem no site com consent_publish = true e estado Ativo. Display name: `name`. Publishable: yes (only Active entries reach the storefront). Translatable: yes. Storefront access: PUBLIC_READ.

| Field | Type | Required | Validations | Notes |
|---|---|---|---|---|
| `name` | `single_line_text_field` | yes |  |  |
| `address` | `single_line_text_field` | yes |  |  |
| `postal_code` | `single_line_text_field` | yes | regex ^[0-9]{4}-[0-9]{3}$ |  |
| `city` | `single_line_text_field` | yes |  |  |
| `district` | `single_line_text_field` | yes | choices: Aveiro / Beja / Braga / Bragança / Castelo Branco / Coimbra / Évora / Faro / Guarda / Leiria / Lisboa / Portalegre / Porto / Santarém / Setúbal / Viana do Castelo / Vila Real / Viseu / Região Autónoma dos Açores / Região Autónoma da Madeira |  |
| `lat` | `number_decimal` |  | min 30; max 43; max_precision 6 |  |
| `lng` | `number_decimal` |  | min -32; max -6; max_precision 6 |  |
| `opening_hours` | `multi_line_text_field` |  |  | Uma linha por dia ou intervalo, ex.: «Seg.–Sex.: 07:00–20:00». |
| `pickup_enabled` | `boolean` |  |  | Mostra «Levantar aqui» e inclui o café no seletor do carrinho. |
| `consent_publish` | `boolean` | yes |  | RGPD/acordo comercial: o café autorizou por escrito aparecer no site. Sem isto, nunca é mostrado. |
| `pickup_notes` | `multi_line_text_field` |  |  | O que se pode levantar neste café e em quanto tempo. Texto único por café; é o que justifica uma página própria (só com consentimento). |
| `photo` | `file_reference` |  | file_type_options ["Image"] |  |

### `timeline_event` (Marco da história)

Marcos da cronologia na página História. Ordenados por «sort». Display name: `title`. Publishable: yes (only Active entries reach the storefront). Translatable: yes. Storefront access: PUBLIC_READ.

| Field | Type | Required | Validations | Notes |
|---|---|---|---|---|
| `year` | `single_line_text_field` | yes |  | Ex.: «1960», «Início dos anos 70». |
| `title` | `single_line_text_field` | yes |  |  |
| `text` | `multi_line_text_field` |  |  |  |
| `image` | `file_reference` |  | file_type_options ["Image"] |  |
| `sort` | `number_integer` | yes |  |  |

### `award` (Distinção)

Distinções verificadas (PME Excelência, PME Líder). Display name: `name`. Publishable: yes (only Active entries reach the storefront). Translatable: yes. Storefront access: PUBLIC_READ.

| Field | Type | Required | Validations | Notes |
|---|---|---|---|---|
| `name` | `single_line_text_field` | yes |  |  |
| `year` | `single_line_text_field` | yes |  |  |
| `image` | `file_reference` |  | file_type_options ["Image"] |  |

### `method` (Método de preparação)

Hub de um método (máquina automática, cafeteira italiana, expresso, prensa francesa, filtro, moagem). Renderiza em /pages/metodo/<handle>. Só as recomendações da Sotocal; nada inventado. Display name: `name`. Publishable: yes. Translatable: yes. Web pages: yes, `/pages/metodo/<handle>` (template `templates/metaobject/method.json`, to build in WS5; SEO from `seo_title` and `seo_description`). Storefront access: PUBLIC_READ.

| Field | Type | Required | Validations | Notes |
|---|---|---|---|---|
| `name` | `single_line_text_field` | yes |  | Ex.: «Máquina automática». |
| `short_answer` | `multi_line_text_field` | yes | max 500 | 40 a 70 palavras por baixo do título. A primeira frase responde à pergunta. |
| `sotocal_recommendation` | `multi_line_text_field` | yes |  | O que os torradores da Sotocal recomendam para este método: o elemento que mais nenhuma página tem. Vem da Sotocal. [[TBC: pergunta 14]] |
| `recommended_blends` | `list.product_reference` |  | list.max 4 | Produtos (lotes) recomendados, até 4. |
| `grind` | `single_line_text_field` |  | max 120 | Da Sotocal, não inventada. |
| `dose_ratio` | `single_line_text_field` |  | max 120 | Da Sotocal, não inventada. Ex.: gramas de café por volume de água. |
| `steps` | `list.single_line_text_field` |  |  | Um passo por item, pela ordem. |
| `common_mistakes` | `list.single_line_text_field` |  |  |  |
| `faq` | `list.metaobject_reference` |  | metaobject_definition_type faq_item; list.max 6 | Até 6 faq_item. |
| `image` | `file_reference` |  | file_type_options ["Image"] |  |
| `author` | `metaobject_reference` |  | metaobject_definition_type person | Só com consentimento da pessoa. Sem autor, a página assina «Sotocal». |
| `reviewed_on` | `date` | yes |  | Data real da última revisão. |
| `seo_title` | `single_line_text_field` |  | max 60 | Até 60 caracteres. Inclui a palavra-chave principal. |
| `seo_description` | `multi_line_text_field` |  | max 155 | Até 155 caracteres, em pt-PT. |

### `machine` (Máquina)

Tipo de máquina ou modelo validado (ex.: De'Longhi Magnifica Start). Renderiza em /pages/maquina/<handle>. Uma página de modelo só é indexável com definições retiradas do manual e fontes. Display name: `name`. Publishable: yes. Translatable: yes. Web pages: yes, `/pages/maquina/<handle>` (template `templates/metaobject/machine.json`, to build in WS5; SEO from `seo_title` and `seo_description`). Storefront access: PUBLIC_READ.

| Field | Type | Required | Validations | Notes |
|---|---|---|---|---|
| `name` | `single_line_text_field` | yes |  |  |
| `machine_type` | `single_line_text_field` | yes | choices: automatica / expresso-manual / cafeteira-italiana / prensa-francesa / filtro / capsulas |  |
| `brand` | `single_line_text_field` |  |  | Só em páginas de modelo. |
| `model` | `single_line_text_field` |  |  | Só em páginas de modelo com procura validada. |
| `method` | `metaobject_reference` | yes | metaobject_definition_type method | Hub de método a que esta máquina pertence. |
| `short_answer` | `multi_line_text_field` | yes | max 500 | 40 a 70 palavras por baixo do título. |
| `recommended_blends` | `list.product_reference` |  | list.max 4 | Até 4 lotes, segundo a Sotocal. |
| `recommended_grind` | `single_line_text_field` |  | max 120 | Da Sotocal. |
| `settings` | `multi_line_text_field` |  |  | Gama de moagem, depósito de grão, ciclo de limpeza: copiados do manual do fabricante, com a fonte em «Fontes». Vazio = página de modelo não indexável. |
| `sources` | `list.url` |  |  | URLs do manual do fabricante. |
| `faq` | `list.metaobject_reference` |  | metaobject_definition_type faq_item; list.max 6 |  |
| `author` | `metaobject_reference` |  | metaobject_definition_type person |  |
| `reviewed_on` | `date` | yes |  |  |
| `seo_title` | `single_line_text_field` |  | max 60 | Até 60 caracteres. Inclui a palavra-chave principal. |
| `seo_description` | `multi_line_text_field` |  | max 155 | Até 155 caracteres, em pt-PT. |

### `substitute` (Sucedâneo)

Ficha factual de um sucedâneo do café (cevada, chicória). Alimenta guias e fichas de produto; não gera páginas próprias. NÃO tem campo de benefícios para a saúde (Reg. (CE) 1924/2006). Display name: `name`. Publishable: yes. Translatable: yes. Web pages: no. Storefront access: PUBLIC_READ.

| Field | Type | Required | Validations | Notes |
|---|---|---|---|---|
| `name` | `single_line_text_field` | yes |  | Ex.: «Cevada», «Chicória». |
| `what_it_is` | `multi_line_text_field` | yes |  | Descrição factual. A primeira frase responde. |
| `roasting` | `multi_line_text_field` |  |  | Só o que a Sotocal confirma. |
| `preparation` | `multi_line_text_field` |  |  |  |
| `caffeine_statement` | `single_line_text_field` |  | max 200 | Só se tiver fonte em «Cafeína (fonte)». O site só mostra a afirmação com fonte. |
| `caffeine_source` | `url` |  |  | EFSA, tabela INSA/PortFIR ou artigo científico. |
| `gluten_statement` | `single_line_text_field` |  | max 200 | Só se tiver fonte. A cevada contém glúten: é alergénio obrigatório na rotulagem. |
| `gluten_source` | `url` |  |  |  |
| `history_note` | `multi_line_text_field` |  |  | Só factos confirmados pela Sotocal (ex.: produção de chicória nos Açores no início dos anos 70). |
| `products` | `list.product_reference` |  | list.max 6 | Produtos Sotocal deste sucedâneo. |
| `faq` | `list.metaobject_reference` |  | metaobject_definition_type faq_item; list.max 6 |  |
| `reviewed_on` | `date` | yes |  |  |

### `competitor` (Preço de referência (concorrente))

Preço por kg de uma marca concorrente, com fonte e data de consulta. Usado só em comparações objetivas e na calculadora; cada preço é reverificado antes de publicar. Sem logótipos. Display name: `name`. Publishable: yes. Translatable: no. Web pages: no. Storefront access: PUBLIC_READ.

| Field | Type | Required | Validations | Notes |
|---|---|---|---|---|
| `name` | `single_line_text_field` | yes |  |  |
| `group` | `single_line_text_field` |  |  | Ex.: grupo empresarial proprietário. |
| `product` | `single_line_text_field` | yes |  | Nome exato do produto comparado. |
| `format` | `single_line_text_field` | yes | choices: grao / moido / capsula |  |
| `pack_weight_g` | `number_integer` |  | min 1 |  |
| `pack_price` | `number_decimal` |  | min 0; max_precision 2 |  |
| `price_per_kg` | `number_decimal` | yes | min 0; max_precision 2 | Calculado a partir da embalagem ou lido da fonte. |
| `price_kind` | `single_line_text_field` | yes | choices: tabela / promocao | Preço de tabela ou de promoção. Nunca misturar. |
| `channel` | `single_line_text_field` | yes | choices: retalho / loja-propria / online / horeca |  |
| `tier` | `single_line_text_field` |  | choices: marca-propria / marca-nacional / torrefacao-especialidade |  |
| `source_url` | `url` | yes |  | Página pública onde o preço foi lido. |
| `accessed_on` | `date` | yes |  | Data em que o preço foi lido. Mostrada junto ao preço. |
| `notes` | `multi_line_text_field` |  |  |  |

### How the theme uses metaobjects

| Type | Read in Liquid as | Where |
|---|---|---|
| `partner_cafe` | `shop.metaobjects.partner_cafe.values`, filtered by `consent_publish` (and by `pickup_enabled` for the cart selector) | Café locator (`page.locator`), cart drawer pickup selector, `page.pickup` |
| `faq_item` | `shop.metaobjects.faq_item.values` filtered by `category`, or through `product.metafields.sotocal.faq` | `page.faq`, `page.profissional` (category `profissional`), `page.facts` (category `sobre`), product FAQ |
| `timeline_event` | `shop.metaobjects.timeline_event.values` sorted by `sort` | `page.historia`. With no entries, the theme falls back to its own verified timeline strings. |
| `person` | `shop.metaobjects.person.values`, or `article.metafields.sotocal.author.value` | `page.historia` profiles, article byline, Person schema |
| `award` | `shop.metaobjects.award.values` | `page.historia`, and `award` on the Organization schema |
| `gift_box_item` | `product.metafields.sotocal.gift_box_items.value` | Gift box product page |

A plain `for` loop over `.values` returns at most 50 entries. Shopify supports paginating `values` up to 250 per page (https://shopify.dev/docs/api/liquid/objects/metaobject_definition). The locator must therefore wrap its loop in `{% paginate shop.metaobjects.partner_cafe.values by 250 %}` before the café list passes 50, and this needs testing on the live store. On publishable types, loops return only Active entries.

## Cart attributes (theme-controlled)

| Attribute | Value | Set by |
|---|---|---|
| `pickup_cafe_id` | `partner_cafe` metaobject handle | Cart drawer toggle «Levantar num café Sotocal», via `/cart/update.js` |
| `pickup_cafe_name` | Café name | Same toggle |
| `pickup_cafe_city` | Café city | Same toggle |

The attributes appear on the order in the admin under "Additional details" and in order notifications as `{{ attributes.pickup_cafe_name }}`. The HoReCa route uses them to deliver the order to the café (see ADMIN-SETUP, click & collect option a). The browser remembers the choice in `localStorage` for the next visit.

## Custom analytics events (`Shopify.analytics.publish`)

| Event | Fired when | Payload (`customData`) |
|---|---|---|
| `horeca_lead_submitted` | The lead form on `/pages/profissional` posts successfully | `{ source, type, district, monthly_volume }` (answers saved in sessionStorage at submit), never name, phone or email |
| `newsletter_signup` | A newsletter form posts successfully | `{ location }` (footer, password page…) |
| `calculator_used` | The cost calculator shows its first result on a page load | `{ format }` (grao, moido, capsula); never the prices or doses typed |
| `quiz_completed` | The machine quiz shows a result | `{ machine, milk, intensity, decaf, recommended }` (answers and the recommended product handle; no personal data) |
| `pickup_cafe_selected` | A café is chosen in the cart drawer | `{ cafe_id, cafe_city }` |
| `subscription_selected` | A selling-plan radio is chosen on a product | `{ product_handle, selling_plan_id }` |
| `qr_landing_view` | A QR landing is viewed (`/collections/cafe?utm_medium=qr…` or `page.qr`) | `{ source, cafe }` (`chavena` \| `acucar`; `cafe` is the `c` code in the printed URL, `[a-z0-9-]` up to 40 characters, or empty) |

Theme code publishes custom events and a custom pixel reads them through `analytics.subscribe` (https://shopify.dev/docs/api/web-pixels-api/emitting-data). For the mapping to GA4 and Meta, see ADMIN-SETUP §8.

## Tags with meaning

| Tag | Meaning |
|---|---|
| `preco-provisorio` | Placeholder price; remove it when the client confirms prices |
| `formato-grao`, `formato-moido` | Product is sold as beans or ground; drives the `cafe-em-grao` and `cafe-moido` smart collections |
| `presente` | Product belongs in `presentes` |
| `pack` | Multipack (2 × 1 kg) |
| `descafeinado`, `chas-e-infusoes` | Merchandising groups |

## Template suffixes

| Resource | Template | Suffix |
|---|---|---|
| Coffee products | `product.json` | none |
| Spices | `product.spice.json` | `spice` |
| Coffee substitutes | `product.substitute.json` | `substitute` |
| Accompaniments | `product.simple.json` | `simple` |
| Gift box, 2 × 1 kg pack | `product.bundle.json` | `bundle` |
| Recipe articles | `article.recipe.json` | `recipe` |
| Pages | `page.<suffix>.json` | `historia`, `a-torra`, `profissional`, `locator`, `facts`, `contact`, `faq`, `pickup`, `subscription`, `gift-box`, `accessibility`, `qr` |

Shopify's current product CSV has no template-suffix column (column list: https://help.shopify.com/en/manual/products/import-export/using-csv), so `store-setup.mjs --products` sets the suffix after the import.

## Running the setup script

Without credentials, this prints the plan from the files:

```bash
node scripts/store-setup.mjs
```

To apply it, create an app in the Dev Dashboard in the store's own organization (ADMIN-SETUP §0), install it with the scopes `write_metaobject_definitions`, `write_metaobjects`, `write_products`, `write_content`, `write_online_store_navigation`, `write_translations` and `read_locales`, and pass its client ID and secret (the script gets a 24-hour token from them). Then run:

```bash
SHOPIFY_STORE=sotocal.myshopify.com SHOPIFY_CLIENT_ID=xxx SHOPIFY_CLIENT_SECRET=xxx node scripts/store-setup.mjs --apply --all
```

The steps run in this order, and each one is idempotent:

1. **Metaobject definitions.** Creates missing types, adds missing fields and sets PUBLIC_READ.
2. **Metafield definitions.** Skips keys that already exist and warns on type mismatches.
3. **`--seed`.** Upserts entries by handle and registers the EN translations.
4. **`--collections`.** Creates the smart collections.
5. **`--pages`.** Creates pages and blogs; `--qr-pages` also adds the two QR fallback pages.
6. **`--products`.** Needs the CSV import first. Sets the template suffix, the `sotocal.*` values, the unit price per kg (through `productVariantsBulkUpdate.unitPriceMeasurement`) and the EN title, handle and description.
7. **`--menus`.** Creates `main-menu` and `footer`.

After editing `store-setup/products.json`, regenerate the CSV:

```bash
node store-setup/products-csv.mjs
```

## Adding things later

- **A blend.** Add the product in the admin with options Formato and Peso and the tags `cafe` and `formato-*`. Fill `subtitle`, `character`, `tasting_notes` (3), `origins`, `blend`, the FIC fields and the unit price; add the new value to the `blend` definition's choices before filling `blend`. Then add a `blend` block to the homepage blends section in the theme editor. CLAUDE.md covers the theme side.
- **A partner café.** Go to Content → Metaobjects → Café parceiro → Add entry and fill every required field. Tick `consent_publish` only with the café's written consent, tick `pickup_enabled` if it accepts pickups, and set the status to Active. For lat/lng, right-click the place on openstreetmap.org and choose "Show address".

## SEO/GEO data layer (WS3, 17/11/2026)

These definitions exist in the JSON files and the setup script (dry-run verified). The product and collection templates read the new product and collection fields since WS4; the `method` and `machine` templates (`templates/metaobject/*.json`, section `main-hub`) and the substitute facts block on substitute product pages since WS5. Nothing has been applied to a store, and no entries have been created, because the content must come from Sotocal.

- **`method` and `machine`** render as web pages (`/pages/metodo/<handle>`, `/pages/maquina/<handle>`) through Shopify's `renderable` + `onlineStore` capabilities (https://shopify.dev/docs/apps/build/custom-data/metaobjects/use-metaobject-capabilities). The templates now exist (WS5); test them on a dev store before the first `--apply`. Entries can stay drafts.
- **`substitute`** and **`competitor`** are data only (no web pages), so they cannot become doorway pages. `substitute` has no health-benefit field by design. Caffeine and gluten statements are shown only when the matching source URL is filled.
- **Pickup points.** The prompt's `pickup_point` is the existing `partner_cafe` type (name, address, town, hours, `pickup_enabled`, `consent_publish`, draft/active status, now with `pickup_notes`). No second type. Pickup runs on Sotocal's own HoReCa delivery route, so there is no per-café stock to show; the prompt's "live inventory per pickup point" does not apply.
- **FAQ.** `faq_item` gains an optional `scope`. Pages reference the questions they show (product, collection, method, machine, substitute `faq` fields), so one question can serve several pages.
- **Required fields as a quality gate.** `method.sotocal_recommendation`, `reviewed_on` and `competitor.source_url` / `accessed_on` are required, so an entry cannot be saved without the Sotocal-specific content or the dated source. Model-specific `machine` pages need `settings` and `sources`; the WS5 template will `noindex` a model page that lacks them.
- **Open content (all from Sotocal, none invented):** method guidance (dose, grind, recommended blend: Q14), blend story, roast-date practice (D10), grind options, competitor prices and sources, caffeine and gluten sources for cevada and chicória.

## Guides and comparisons (WS7, 17/11/2026)

- **Article metafields added:** `sotocal.compared` (list of `competitor` entries, in table order), `sotocal.criteria`, `sotocal.self_included`, `sotocal.when_not`. With the WS3 fields `answer`, `last_reviewed` and `sources` they drive the direct answer, the comparison block (`snippets/article-comparison.liquid`), and the sources and review date (`snippets/article-sources.liquid`). `dateModified` in the article schema uses `last_reviewed` when set.
- **Seed entries.** `store-setup/metaobject-entries.json` now holds 25 `competitor` entries, status DRAFT, read from Continente Online on 17/11/2026 (see D73). They are not shown on the storefront until published. Prices decay: re-read before publishing and at least quarterly.
- **Order is the editor's.** The table keeps the order of the `compared` list; order it by price per kg, lowest first.

## Christmas gifts (WS9, 17/11/2026)

- **Tag `presente`** marks gift products (collection `presentes` rule, gift message, cut-off lines). **Line-item property** "Mensagem de oferta" (up to 200 characters) is saved with the order; properties whose key starts with `_` stay hidden.
- **Settings group "Presentes de Natal":** `gift_season_force` (auto, on, off), `gift_cutoff_mainland`, `gift_cutoff_islands`. Update the two dates every year. The season is 1 November to 24 December.
- **Template suffix `presentes`** on the collection `presentes` (`templates/collection.presentes.json`). **Lead form** business type "Presentes de empresa". **Newsletter tags** `cabaz-natal` (waitlist).

### Derived events (not published by the theme)

- `pickup_order` (GA4 only, from the custom pixel on `checkout_completed`): the order's café, when Shopify exposes checkout attributes to the pixel (unverified; guarded). The reliable source is the order export: cart attributes `pickup_cafe_id`, `pickup_cafe_name`, `pickup_cafe_city` appear in the order's additional details.

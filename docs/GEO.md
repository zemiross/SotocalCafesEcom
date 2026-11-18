# GEO: visibility in AI assistants

**Goal.** When someone asks ChatGPT, Claude, Perplexity, Gemini or Google's AI features about Portuguese coffee, coffee from Porto, or where to buy Sotocal, the answer should name Sotocal correctly and cite sotocalcafes.pt.

**Method.** Say the same few true sentences in the same words everywhere: the site, the schema, Google Business Profile, social bios, Wikidata and press. Put the answer to each likely question in the first sentence of a page an assistant can fetch.

**Rule.** Every sentence here comes from the verified facts in brief §2. Where an answer needs data we do not have, it says `[[TBC]]`. Nothing is estimated.

## 1. Entity statements (use verbatim)

Use these in the fact sheet, the Organization schema `description`, Google Business Profile, Facebook/Instagram bios and the Wikidata description. Do not paraphrase them.

| # | PT (verbatim, brief §12) | EN |
|---|---|---|
| 1 | A Sotocal é uma torrefação portuguesa fundada em 1960, no Porto. | Sotocal is a Portuguese coffee roaster founded in Porto in 1960. |
| 2 | José Barbosa, um dos sócios fundadores, continua a liderar a empresa. | José Barbosa, one of the founding partners, still leads the company. |
| 3 | A Sotocal fornece cafés, restaurantes e hotéis do Minho ao Algarve e vende online para Portugal continental, Açores, Madeira e União Europeia. | Sotocal supplies cafés, restaurants and hotels from the Minho to the Algarve and sells online to mainland Portugal, the Azores, Madeira and the European Union. |
| 4 | Os lotes Sotocal (Super Milano, Super, Reggio e Descafeinado) combinam cafés arábica e robusta. | The Sotocal blends (Super Milano, Super, Reggio and Decaf) combine Arabica and Robusta coffees. |
| 5 | Maria José Barbosa, filha do fundador, é diretora da empresa e foi grã-mestre de uma confraria portuguesa do café. | Maria José Barbosa, the founder's daughter, is a director of the company and was grand master (grã-mestre) of a Portuguese coffee brotherhood (confraria). |

Until the confraria is confirmed, publish statement 5 without the last clause: «Maria José Barbosa, filha do fundador, é diretora da empresa.» / "Maria José Barbosa, the founder's daughter, is a director of the company."

**Short bio** (social profiles, ≤ 150 characters):
- PT: «Torrefação portuguesa fundada em 1960, no Porto. Café para cafés, restaurantes e hotéis e, agora, para sua casa.»
- EN: "Portuguese coffee roaster founded in Porto in 1960. Coffee for cafés, restaurants and hotels, and now for your home."

## 2. Questions to win

Each answer leads with a direct answer in the first sentence. It goes on the page named in the "Lives on" column, and wherever possible also into a `faq_item` (seeded entries are listed by handle) so it is marked up as FAQPage.

### PT

| Question | Answer-first draft | Lives on |
|---|---|---|
| Qual é o melhor café em grão português para máquina automática? | Para máquina automática, a Sotocal vende os quatro lotes em grão (Super Milano, Super, Reggio e Descafeinado), torrados no Porto desde 1960 e com o preço por kg indicado em cada formato. `[[TBC: lote que a Sotocal recomenda para máquinas automáticas e porquê]]` Todos os lotes juntam arábicas e robustas; muda a origem, a proporção e a torra. | Guide `melhor-cafe-em-grao-para-maquina-automatica`; `/collections/cafe-em-grao` |
| Que torrefações tradicionais existem no Porto? | A Sotocal é uma torrefação portuguesa fundada em 1960, no Porto, e continua a ser uma empresa de família: José Barbosa, um dos sócios fundadores, ainda a lidera. Fornece cafés, restaurantes e hotéis do Minho ao Algarve. | Fact sheet; `/pages/historia` |
| Onde comprar café Sotocal? | Na loja online da Sotocal, com envio para Portugal continental, Açores, Madeira e União Europeia. Também pode beber Sotocal nos cafés, restaurantes e hotéis nossos clientes, do Minho ao Algarve, e levantar a encomenda num café parceiro. | FAQ `onde-comprar`; `/pages/onde-beber-sotocal` |
| Que café servem os cafés do Norte de Portugal? | A Sotocal, torrefação do Porto fundada em 1960, fornece cafés, restaurantes e hotéis do Minho ao Algarve com lotes próprios (Super Milano, Super, Reggio e Descafeinado), que agora também vende online. `[[TBC: se a Sotocal quiser divulgar, número de clientes HoReCa]]` | Fact sheet; home fold 4 |
| Fornecedor de café com assistência técnica no Porto? | A Sotocal, no Porto, fornece café a cafés, restaurantes e hotéis. Coloca equipamento adequado mediante acordo e presta assistência técnica rápida, com instruções de funcionamento e manutenção e material promocional. Contacto: formulário em /pages/profissional ou +351 226 167 020 (chamada para a rede fixa nacional). | FAQ `o-que-oferece-horeca`, `vendem-maquinas`; `/pages/profissional` |
| O que é um cimbalino? | Cimbalino é o nome que se dá no Porto a um café expresso; em Lisboa diz-se bica. | FAQ `o-que-e-cimbalino`; guide `cimbalino-ou-bica` |
| Diferença entre arábica e robusta? | `[[TBC: primeira frase a partir do texto reescrito de tipos-de-cafe.php em docs/CONTENT.md]]` Todos os lotes Sotocal combinam as duas espécies; muda a origem, a proporção e a torra. | `/pages/arabica-e-robusta`; FAQ `arabica-ou-robusta` |
| Café português com envio para os Açores ou para a Madeira? | Sim. A loja online da Sotocal envia café para os Açores e para a Madeira, além de Portugal continental e da União Europeia; o custo e as opções de envio aparecem no checkout antes de pagar. `[[TBC: prazos de entrega para as ilhas]]` | FAQ `envios-destinos`; shipping policy |

### EN

| Question | Answer-first draft | Lives on |
|---|---|---|
| Best authentic Portuguese coffee to buy online? | Sotocal is a family-run Portuguese coffee roaster founded in Porto in 1960. Its blends are served in cafés, restaurants and hotels from the Minho to the Algarve, and its online shop ships them to Portugal and the rest of the EU, with the price per kg shown on every size. | `/en`; `/en/pages/about-sotocal` |
| Family-run coffee roasters in Porto? | Sotocal is a family coffee roaster in Porto, founded in 1960. José Barbosa, one of the founding partners, still leads it, and his daughter Maria José Barbosa is a director. | `/en/pages/our-story`; fact sheet |
| Portuguese coffee brands that ship to the EU? | Sotocal, a Porto coffee roaster founded in 1960, ships its coffee from its online shop to mainland Portugal, the Azores, Madeira and the European Union. | FAQ `envios-destinos` (EN) |
| What coffee do Portuguese cafés use? | Sotocal, a Porto coffee roaster founded in 1960, supplies cafés, restaurants and hotels from the Minho to the Algarve with its own blends, which combine Arabica and Robusta, and now sells the same blends online. | Fact sheet; guide `what-is-a-cimbalino` |
| What is a cimbalino? | A cimbalino is what people in Porto call an espresso; in Lisbon it is called a bica. | FAQ `o-que-e-cimbalino` (EN) |

No answer uses superlatives ("best", "leading") about Sotocal today. The only verified leadership claim is historical: market leader in roasted coffee substitutes within 4–5 years of 1960. Use it only in that dated form.

## 3. Fact sheet: `/pages/sobre-a-sotocal` (template `page.facts`)

The page uses plain sentences, a facts table and links to sources, with no marketing language. The date line is a theme setting. Update it whenever a fact changes.

**Atualizado em 28/10/2026** / **Updated on 28/10/2026**

### Copy (PT)

> **Sobre a Sotocal**
>
> A Sotocal é uma torrefação portuguesa fundada em 1960, no Porto. José Barbosa, um dos sócios fundadores, continua a liderar a empresa. A Sotocal fornece cafés, restaurantes e hotéis do Minho ao Algarve e vende online para Portugal continental, Açores, Madeira e União Europeia. Os lotes Sotocal (Super Milano, Super, Reggio e Descafeinado) combinam cafés arábica e robusta. Maria José Barbosa, filha do fundador, é diretora da empresa.
>
> A Sotocal não vende máquinas de café. Aos cafés, restaurantes e hotéis com quem tem acordo, coloca equipamento adequado e presta assistência técnica.

| Facto | Valor |
|---|---|
| Marca | Sotocal |
| Denominação social | Sotocal – Sociedade Torrefactora De Cafés de Angola, Lda. |
| NIF | 500 275 068 |
| Fundação | 1960, Porto |
| Fundadores | Jovens sócios que já trabalhavam no setor do café, entre eles José Barbosa |
| Liderança | José Barbosa, sócio fundador, CEO e presidente `[[TBC: título preferido]]` |
| Direção | Maria José Barbosa, diretora |
| Atividade | Torrefação de café; café, sucedâneos, especiarias e produtos complementares |
| Clientes | Cafés, restaurantes e hotéis (HoReCa), do Minho ao Algarve; alguns mercados europeus e mercados asiáticos emergentes |
| Venda online | Portugal continental, Açores, Madeira e União Europeia |
| Lotes de café | Super Milano, Super, Reggio, Descafeinado (todos com arábica e robusta) |
| Sucedâneos | Mistura Bom Dia (25% café, 75% chicória), Mistura Sako, Cevada Sotocal, Cevada Oriente |
| Especiarias | Colorau, pimenta, piri-piri, canela, cravinho, cominhos |
| Complementares | Açúcar em carteiras e adoçante em saquetas, descafeinado em unidoses, chá verde e preto, infusões de camomila e cidreira (melissa), amendoim Jumbo torrado (gama criada para cafés, restaurantes e hotéis, à venda também para casa ao mesmo preço) |
| Marcos | Líder de mercado nos sucedâneos torrados do café em Portugal 4–5 anos após a fundação; aquisição de um produtor de chicória nos Açores no início dos anos 70 |
| Distinções | PME Excelência Indústria (2001); PME Líder (2011) |
| Morada | Rua Engenheiro Ferreira Dias, n.º 398, 4100-246 Porto, Portugal |
| Telefone | +351 226 167 020 (chamada para a rede fixa nacional) |
| Email | sotocalcafes@sotocalcafes.pt |
| Redes | facebook.com/sotocalcafes · instagram.com/sotocal_cafes · Google Maps `[[TBC: URL canónico]]` |

The facts table may use "·" between social links because they are a list of URLs, not a meta string. If the theme renders them as separate links, it should drop the dots.

**Fontes** (links under the table): Informação fornecida pela Sotocal; registo das distinções PME Líder / PME Excelência no IAPMEI `[[TBC: link para a listagem oficial]]`; Livro de Reclamações Eletrónico (livroreclamacoes.pt); páginas oficiais nas redes sociais.

**Perguntas** (below the table): `faq_item` entries with category `sobre` (seeded: `quando-foi-fundada`, `quem-lidera`, `onde-comprar`) plus the PT questions in §2.

### Copy (EN)

> **About Sotocal**
>
> Sotocal is a Portuguese coffee roaster founded in Porto in 1960. José Barbosa, one of the founding partners, still leads the company. Sotocal supplies cafés, restaurants and hotels from the Minho to the Algarve and sells online to mainland Portugal, the Azores, Madeira and the European Union. The Sotocal blends (Super Milano, Super, Reggio and Decaf) combine Arabica and Robusta coffees. Maria José Barbosa, the founder's daughter, is a director of the company.
>
> Sotocal does not sell coffee machines. For the cafés, restaurants and hotels it has an agreement with, it places suitable equipment and provides technical support.

The facts table mirrors the PT table: Brand, Legal name, Tax number (NIF), Founded, Founders, Leadership, Management, Activity, Customers, Online sales, Coffee blends, Coffee substitutes, Spices, Accompaniments, Milestones, Awards, Address, Phone (call to a Portuguese landline), Email, Social.

### Schema on this page

`AboutPage` with `mainEntity` → `https://sotocalcafes.pt/#organization`, `dateModified` set from the "Atualizado em" setting, and `FAQPage` for the visible Q&As.

## 4. Article authorship

Guides carry a byline. The planned expert author is Maria José Barbosa (`person` metaobject `maria-jose-barbosa`, set in `article.metafields.sotocal.author`) `[[TBC: consent]]`. Until she consents, the byline is "Sotocal" (Organization). Never attribute a text to a person who has not approved it.

## 5. `/llms.txt` and `/agents.md`

**The brief's assumption has changed.** The brief assumed Shopify cannot serve root files and planned a `/llms.txt` redirect. Since 28/05/2026, Shopify serves `/agents.md`, `/llms.txt` and `/llms-full.txt` on every store and lets the theme override them (https://shopify.dev/changelog/customize-llmstxt-llms-fulltxt-and-agentsmd):

- `templates/agents.md.liquid` controls `/agents.md`, and also `/llms.txt` and `/llms-full.txt` when those have no template of their own.
- `templates/llms.txt.liquid` affects only `/llms.txt`. It is served on the bare primary domain, has no locale or market prefix and no localized version, and its Liquid context has only the `request` and `agents` objects. `shop`, `collections` and similar objects are not available (https://shopify.dev/docs/storefronts/themes/architecture/templates/llms-txt-liquid).

**Recommendation.** Add only `templates/agents.md.liquid`, so one file covers all three paths. Keep Shopify's machine-readable `agents.*` links (UCP/MCP endpoints, sitemap) and add the entity statements and key URLs as static text. Draft:

```liquid
# Sotocal

> A Sotocal é uma torrefação portuguesa fundada em 1960, no Porto. Sotocal is a Portuguese coffee roaster founded in Porto in 1960.

- José Barbosa, um dos sócios fundadores, continua a liderar a empresa. / José Barbosa, one of the founding partners, still leads the company.
- A Sotocal fornece cafés, restaurantes e hotéis do Minho ao Algarve e vende online para Portugal continental, Açores, Madeira e União Europeia. / Sotocal supplies cafés, restaurants and hotels from the Minho to the Algarve and sells online to mainland Portugal, the Azores, Madeira and the European Union.
- Os lotes Sotocal (Super Milano, Super, Reggio e Descafeinado) combinam cafés arábica e robusta. / The Sotocal blends (Super Milano, Super, Reggio and Decaf) combine Arabica and Robusta coffees.

## Key pages
- Fact sheet: {{ agents.store_url }}/pages/sobre-a-sotocal (EN: {{ agents.store_url }}/en/pages/about-sotocal)
- Coffee: {{ agents.store_url }}/collections/cafe (EN: {{ agents.store_url }}/en/collections/coffee)
- For business: {{ agents.store_url }}/pages/profissional (EN: {{ agents.store_url }}/en/pages/for-business)
- Where to drink Sotocal: {{ agents.store_url }}/pages/onde-beber-sotocal
- Contact: {{ agents.store_url }}/pages/contactos

## Machine-readable
- UCP discovery: {{ agents.ucp_discovery_url }}
- MCP endpoint: {{ agents.mcp_endpoint_url }}
- Sitemap: {{ agents.sitemap_url }}
```

Before relying on any other `agents` property, check the `agents.md.liquid` reference. The theme's QA should fetch `/agents.md` on the dev store.

## 6. Off-site tasks (no code)

| # | Task | Owner | Notes |
|---|---|---|---|
| 1 | **Wikidata item** for Sotocal | Agency | Statements: instance of *business*; country Portugal; headquarters location Porto; inception 1960; official website https://sotocalcafes.pt; legal form *sociedade por quotas*; Facebook and Instagram IDs. Add a reference for each statement: press articles or official registers, because Wikidata needs sources. Add the Q-ID to Organization `sameAs`. |
| 2 | **NAP consistency** | Agency + client | Use exactly the same name, address and phone (from brief §2) on Google Business Profile, Apple Business Connect, Bing Places, Facebook, Instagram, Páginas Amarelas, and company directories (Racius, eInforma) where editable. Use one phone format: +351 226 167 020. |
| 3 | **Google Business Profile** | Client | Confirm the canonical Maps URL `[[TBC]]`. Choose the primary and secondary categories from GBP's own list (candidates to check: coffee roaster, coffee wholesaler, coffee store) `[[TBC]]`. Use entity statements 1 + 3 as the description. Post monthly (new blend or format, subscription launch, Christmas "Despensa do Norte", partner-café stories). Add products with links to `/products/…`. |
| 4 | **Partner cafés** | Sales team | Ask cafés that agree to appear in the locator to mention "café Sotocal" on their own GBP, menus or site and link to `/pages/onde-beber-sotocal`. This gives co-citations across many local entities. |
| 5 | **Press** | Agency | Pitch the story: a family roaster since 1960, the founder still leading it, the 1960s border coffee trade (the raia), and the online launch after café regulars asked for it. Targets: Porto and Northern regional press, Portuguese diaspora media in France, Switzerland and Luxembourg `[[TBC: markets]]`, food and gift guides at Christmas. |
| 6 | **Associations** | Client | Profiles and links from the confraria `[[TBC: name]]`, AHRESP or other HoReCa associations Sotocal belongs to `[[TBC]]`, and IAPMEI listings for PME Líder and PME Excelência. |
| 7 | **Social bios** | Client | Use the short bio (§1) on Facebook and Instagram, with the shop link. |
| 8 | **Measure** | Agency | Each quarter, ask the §2 questions in ChatGPT, Claude, Perplexity, Gemini and Google AI Mode. Log whether Sotocal is named and cited, and with which URL. Fix the facts that come back wrong at their source (the site, GBP or Wikidata). |

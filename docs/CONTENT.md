# Sotocal: legacy content harvest and rewrite

Source: https://sotocalcafes.pt/ (legacy PHP site). Harvested on 28/10/2026 with `scripts/harvest.mjs`. Raw HTML and extracted text for every page are in `/reference/legacy-raw/`; images and their inventory are in `/reference/legacy-images/` (see `INVENTORY.md`).

## How to read this file

- Each legacy page has three blocks: **PT original** (verbatim from the crawl, typos included, navigation and footer removed), **PT reescrito** (pt-PT, Acordo Ortográfico 1990) and **EN** (British English).
- Rewrites apply every rule in brief §3: AO90 spelling, typo fixes, no hard-coded ages of the company, no health or weight claims (EU Regulation 1924/2006), voice of the mission kept.
- Facts come only from brief §2 or from the legacy pages. Anything on the legacy site that is not in §2 is kept in the rewrite only when it is harmless context, and is listed in [Facts needing client confirmation](#facts-needing-client-confirmation) with `[[TBC]]`.
- Where a rewrite is meant for a Shopify page or product description, the target URL from brief §11 is given.

### Dynamic years

Never write "53 anos" or "mais de 50 anos". Use one of these Liquid expressions (the theme has a `years-since` snippet that wraps them):

| Use | Liquid | Renders in 2026 |
|---|---|---|
| Exact count, "há N anos" / "for N years" | `{{ 'now' \| date: '%Y' \| minus: 1960 }}` | 66 |
| Rounded down to a multiple of 5, "há mais de N anos" / "for more than N years" | `{{ 'now' \| date: '%Y' \| minus: 1961 \| divided_by: 5 \| times: 5 }}` | 65 |

The rounded form subtracts 1961, not 1960, so "mais de" is always true (in 2025 it gives 60, not 65). In the text below, `{{ anos }}` stands for the exact form and `{{ mais_de_anos }}` for the rounded form.

## Harvest status

| Page | Status | Notes |
|---|---|---|
| index.php | 200 | Navigation only; the headline "O Café que vem do Norte" is baked into `home.jpg` |
| empresa.php, missao.php | 200 | |
| valores.php | 200 | Content is the image `valores.png`; transcribed below |
| tipos-de-cafe.php, cafe-e-a-saude.php | 200 | |
| produtos-super-milano.php, produtos-super-torrado.php, produtos-reggio.php, produtos-descafeinado.php | 200 | |
| complementares-acucar.php, -adocante, -descafeinado, -cha, -amendoins | 200 | All five pages carry the same text; only the image changes |
| conservas.php | 200 | No text; only `conservas.png` (Atum Gaivota cans) |
| sucedaneos-bom-dia.php, -sako, -cevada, -cevada-oriente | 200 | Shared intro plus one product line each |
| colorau.php, pimenta.php, piri-piri.php, canela.php, cravinho.php, cominhos.php | 200 | Each has one recipe |
| vantagens.php, expresso.php, melhor-cafe.php, profissional.php, curiosidades.php, contactos.php | 200 | |
| projeto.pdf | 200 | EU co-funding project sheet (see below) |

All 32 pages and the PDF were fetched on the first attempt. 64 images were downloaded. One image named in the brief, `images/pic06.jpg`, returns HTTP 404 on the server (only `pic06-arabica.jpg` and `pic06-robusta.jpg` exist). Two images not named in the brief were found and downloaded: `diamante.png` (designer credit) and `maps.png` (Google Maps icon).

## Client leaflet (desdobrável), received 29/10/2026

Source: the client's Drive, `Produtos/sotocal desdobrável.pdf` (copy in `reference/client-drive/originals/`). It is a two-page print leaflet: blends, substitutes, accompaniments, conservas and spices, with the head-office contacts. It is newer than most legacy pages ("há mais de 50 anos") and is treated as the client's own statement of the product facts.

Facts adopted (applied to `store-setup/products.json` by `store-setup/apply-leaflet.py`; each product touched carries `"source": "Desdobrável Sotocal (cliente)"`):

| Product | From the leaflet |
|---|---|
| Lote Super Milano | 100% café; fine, smooth mountain Arabicas with intense African Robustas; intense, lingering taste, soft aroma, velvety lasting crema |
| Lote Super | 100% café; smooth Arabicas from Central America and Brazil, West African Robustas; strong flavour, invigorating aroma, full-bodied espresso with lasting crema. Confirms the official name "Lote Super" (question 4) |
| Lote Reggio | 100% café; aromatic mountain coffees with intense African coffees; intense Italian-style roast; energetic, vigorous, firm crema |
| Descafeinado | Same selection and roast, without caffeine. The leaflet's line about caffeine sensitivity is dropped (it implies a health effect) |
| Mistura Bom Dia | 25% café, 75% chicória |
| Mistura Sako | 20% café, 80% cereais torrados: cevada, chicória e grão preto (gluten from barley added as an allergen, confirmed by the client 29/10/2026; the cereal order is question 49) |
| Cevada Sotocal, Cevada Oriente | Named as products only; barley allergen added (confirmed 29/10/2026). Sales name "Cevada torrada moída" for Cevada Sotocal confirmed (question 53) |
| Complementares | "Especialmente concebidos para o segmento HoReCa": açúcar em carteiras, adoçante em saquetas, descafeinado em unidoses, chá verde e chá preto, infusões de camomila e **cidreira** (lemon balm, *Melissa officinalis*: not lúcia-lima; D49, D52), amendoim torrado Jumbo; a "Conservas" panel with photos only. The client confirmed they are also sold to consumers, at the same price (D53) |
| Especiarias | One descriptive paragraph each for colorau, pimenta, piri-piri, canela, cravinho and cominhos, rewritten in AO90 for the product pages |
| Contacts | Same address and phone as §2; also prints the fax 226 100 458 (question 36) |

Dropped: the paragraph on breakfast, body weight and the brain's need for carbohydrates, and "ricos e nutritivos" for the cereals. Both are health or nutrition claims that Regulation (EC) 1924/2006 does not allow as written (D48).

Legacy `<head>` findings: title "Sotocal Est.1960" on every page; empty meta description; `og:url` points to the misspelt `http://www.sotocoal.pt/` (fix per §11); `og:image` points to `http://www.sotocal.pt/images/imagem.jpg` (another domain, not harvested); the Search Console tag `google-site-verification = FsPoxaMNsglzycxyLmZmlgoBw3YHtdp8XVS8otgEwyc` is present and must be kept.

## projeto.pdf: what it is

It is an EU co-funding project sheet ("Ficha de Projeto"), so the funding logos must stay visible and linked from the new site (brief §14). It says, verbatim:

- Logos at the top: NORTE 2020 (Programa Operacional Regional do Norte), PORTUGAL 2020, União Europeia Fundo Europeu de Desenvolvimento Regional.
- "Designação do projeto: Vale I&D"
- "Código do projeto: Nº 18175"
- "Objetivo principal: Investigação e Desenvolvimento de Material provocador de estímulo sensorial em nova embalagem de café."
- "Região de intervenção: Norte"
- "Entidade beneficiária: SOTOCAL - Sotocal – Sociedade Torrefactora De Cafés de Angola, Lda."
- "Data de aprovação: 29-06-2016", "Data de início: 29-06-2016", "Data de conclusão: 29-12-2016"
- "Custo total elegível: FEDER – 20.000,00 EUR"
- "Apoio financeiro da União Europeia: 15.000,00 EUR"
- Summary: consultancy to research and develop a material that gives a coffee pack an olfactory, interactive sensation, in three phases (formulation, application method, industrial test); it states that a new product with a scented pack was launched at the end of the project.

Action: re-upload the PDF to Shopify Files, link it from the footer next to `projeto.png` (the logo strip), and redirect `/projeto.pdf` to the new file URL. `[[TBC: confirm with the client whether the publicity obligation still applies and for how long; keep the logos until told otherwise]]`

---

## index.php

### PT original

> Sotocal Est.1960
>
> (Navigation only: EMPRESA, A SOTOCAL, MISSÃO, VALORES, O CAFÉ, TIPOS DE CAFÉ, CAFÉ E A SAÚDE, PRODUTOS, CAFÉ, PRODUTOS COMPLEMENTARES, CONSERVAS, SUCEDÂNEOS DO CAFÉ, ESPECIARIAS, COLORAU, PIMENTA, PIRI-PIRI, CANELA, CRAVINHO, COMINHOS, PROFISSIONAL, VANTAGENS COMPETITIVAS, COMO OBTER O MELHOR EXPRESSO, PORQUE TEMOS O MELHOR CAFÉ?, PARA ABRIR UM ESTABELECIMENTO, CONTACTOS.)
>
> Image `home.jpg` with the baked-in headline "O Café que vem do Norte".

### PT reescrito

No body copy to rewrite. The new homepage copy is defined in brief §7. The legacy tagline survives as the H1: "O café que vem do Norte." (sentence case).

### EN

Homepage copy is defined in brief §7 ("Coffee from the North of Portugal.").

---

## empresa.php → `/pages/historia`

### PT original

> ## A SOTOCAL
> O café que vem do Norte
> A Sotocal – Sotocal – Sociedade Torrefactora De Cafés de Angola, Lda., é uma empresa Portuguesa fundada em 1960 que se dedica à produção e comercialização de uma vasta gama de produtos alimentares entre os quais se destaca o Café. Um dos sócios fundadores - José Barbosa é o actual presidente da empresa.
> As linhas de actuação perspectivadas há data da fundação, surgiram da constatação de oportunidades de negócio e visavam o seu aproveitamento da forma mais eficiente e rentável.
> Analisando a realidade do sector torrefactor, aqui no Norte, em 1960, verificava-se que:
> - A indústria Torrefactora nacional contava com mais de 100 empresas, na sua generalidade envelhecidas.
> - A venda de produtos a granel - nomeadamente, café - possuía um peso enorme no sector, sendo um segmento gerador de lucros mais imediatos que o Hoteleiro.
> - Os sucedâneos de café representavam cerca de 80% do mercado e a sua venda - também a granel - era realizada em casas retalhistas da especialidade que elaboravam os seus próprios lotes.
> - Existia um pujante mercado Nacional - a zona da raia de fronteira com Espanha. Espanha acabava de sair de uma guerra civil, e o café era um dos produtos que tinha a sua importação contingentada; por outro lado, Portugal, sendo um país produtor, devido às suas colónias em Africa, tinha uma grande vantagem competitiva de preço. A reunião destes dois factores fazia com que os espanhóis viessem a Portugal comprar café.
> Apercebida esta realidade, havia no mercado espaço para uma torrefacção nova, criada por jovens que, pelo facto de virem já do sector, conheciam bem as suas potencialidades e fraquezas e, por isso, se propunham vencer.
> Os jovens sócios da nova torrefacção Sotocal, face á análise destas oportunidades, começam por apostar no segmento dos sucedâneos de café e passados 4-5 anos da sua fundação, a Sotocal era líder no mercado dos sucedâneos torrados em Portugal: cevada, chicória e grão preto. No início dos anos setenta, numa estratégia de expansão a montante, adquire uma empresa de produção de Chicória nos Açores.
> Entretanto algumas das empresas envelhecidas desaparecem e as que estavam vocacionadas para o segmento hoteleiro, e que apostavam em marcas próprias, eram óptimas clientes da Sotocal nestes produtos.
> O objectivo era a construção de uma empresa que, com o aproveitamento inteligente dessas oportunidades de negócio, se viesse a implantar no mercado, solidamente.
> Foi cumprido: a Sotocal é hoje essa empresa sólida.
> Passados 53 anos, a Sotocal evoluiu com a dinâmica do mercado e mantem-se firme a dar resposta ás suas solicitações, competindo solidamente no meio de lutas de gigantes.
> A Sotocal encontra-se hoje em Portugal, do Minho ao Algarve tendo conquistado uma forte presença no segmento HoReCa com suas Marcas próprias e lotes de Café especificamente concebidos para terem sucesso neste segmento:
> - Lote Sotocal Milano
> - Lote Sotocal Super
> - Lote Reggio
> Bem como os respectivos produtos complementares:
> - Descafeinado em grão e Unidoses
> - Açucar e Adoçante Sotocal
> - Chás preto e verde e Infusões
> Continua no entanto a torrar Amendoim e Sucedâneos de Café – Cevada, Chicória.
> Numa dinâmica estratégia de expansão, a Sotocal encontra-se já em alguns mercados quer Europeus quer de Países emergentes da Ásia.
> A qualidade dos produtos Sotocal e a satisfação dos seus consumidores constituem o seu principal objectivo.
> Sendo a Sotocal uma PME familiar tem como vantagem estar muito próxima dos seus clientes, colaboradores, fornecedores e consumidores e como objectivo a sua total satisfação, a quem sempre dedica a sua melhor atenção.
> Diploma de PME Excelência Indústria 2001
> Diploma de PME Líder 2011

### PT reescrito

## A Sotocal

O café que vem do Norte.

A Sotocal (Sotocal – Sociedade Torrefactora De Cafés de Angola, Lda.) é uma torrefação portuguesa fundada em 1960, no Porto. Produz e vende uma vasta gama de produtos alimentares e, entre eles, o mais importante é o café. José Barbosa, um dos sócios fundadores, continua a liderar a empresa.

### 1960: uma torrefação nova

Os sócios fundadores eram jovens e já trabalhavam no setor. Conheciam as suas forças e as suas fraquezas e viram oportunidades de negócio que queriam aproveitar da forma mais eficiente.

No Norte, em 1960, o setor da torrefação era assim:

- A indústria torrefatora nacional tinha mais de 100 empresas, na maioria envelhecidas.
- A venda a granel, sobretudo de café, tinha um peso enorme e dava lucros mais rápidos do que a hotelaria.
- Os sucedâneos de café eram cerca de 80% do mercado e vendiam-se também a granel, em lojas da especialidade que faziam os seus próprios lotes.
- Havia um mercado forte na raia, a zona de fronteira com Espanha. Depois da guerra civil, Espanha limitava a importação de café; Portugal, com o café das colónias africanas, tinha uma grande vantagem de preço. Por isso, os espanhóis atravessavam a fronteira para comprar café em Portugal.

### Primeiro os sucedâneos, depois os Açores

A nova torrefação começou pelos sucedâneos de café. Quatro a cinco anos depois da fundação, a Sotocal já liderava o mercado de sucedâneos torrados em Portugal: cevada, chicória e grão preto. No início dos anos 70, para garantir a matéria-prima, comprou uma empresa produtora de chicória nos Açores.

Entretanto, algumas das empresas mais antigas fecharam. As que trabalhavam para a hotelaria e apostavam em marcas próprias tornaram-se ótimas clientes da Sotocal nestes produtos.

### Hoje

O objetivo era construir uma empresa sólida. Foi cumprido. Há {{ anos }} anos que a Sotocal acompanha a evolução do mercado e responde a quem lhe pede café, firme entre gigantes.

A Sotocal está em Portugal do Minho ao Algarve, com uma forte presença em cafés, restaurantes e hotéis (o canal HoReCa), com marcas próprias e lotes de café pensados para este canal:

- Lote Super Milano
- Lote Super
- Lote Reggio

E os produtos complementares:

- Descafeinado em grão e em unidoses
- Açúcar e adoçante Sotocal
- Chá preto, chá verde e infusões

Continua também a torrar amendoim e sucedâneos de café: cevada e chicória.

A Sotocal vende ainda para alguns mercados europeus e para mercados emergentes da Ásia.

O que mais importa à Sotocal é a qualidade dos produtos e a satisfação de quem os bebe. Como PME familiar, está muito perto dos clientes, dos colaboradores, dos fornecedores e dos consumidores, e dá-lhes sempre a melhor atenção.

### Distinções

- PME Excelência Indústria 2001
- PME Líder 2011

Notes: legacy blend names "Lote Sotocal Milano" and "Lote Sotocal Super" normalised to the §2 names "Lote Super Milano" and "Lote Super" (names confirmed by the client leaflet, 29/10/2026). The 1960 market figures (100+ roasters, substitutes about 80% of the market) are kept as company history but listed for confirmation.

### EN

## Sotocal

Coffee from the North of Portugal.

Sotocal (Sotocal – Sociedade Torrefactora De Cafés de Angola, Lda.) is a Portuguese coffee roaster founded in Porto in 1960. It makes and sells a wide range of food products, and coffee is the most important of them. José Barbosa, one of the founding partners, still runs the company.

### 1960: a new roaster

The founding partners were young and already worked in the trade. They knew its strengths and weaknesses, and they saw business opportunities they wanted to make the most of.

In the North of Portugal in 1960, the roasting trade looked like this:

- More than 100 roasters operated in Portugal, most of them old businesses.
- Loose sales, above all of coffee, carried enormous weight and made quicker profits than the hotel and catering trade.
- Coffee substitutes made up about 80% of the market. They were also sold loose, in specialist shops that mixed their own blends.
- There was a strong market along the "raia", the border with Spain. After its civil war, Spain restricted coffee imports, while Portugal, with coffee from its African colonies, had a large price advantage. So Spaniards crossed the border to buy coffee in Portugal.

### First the substitutes, then the Azores

The new roaster started with coffee substitutes. Four to five years after it was founded, Sotocal led the Portuguese market for roasted substitutes: barley, chicory and grão preto. In the early 1970s, to secure its raw material, it bought a chicory producer in the Azores.

Meanwhile, some of the older firms closed. Those that served the hotel and catering trade under their own brands became excellent customers of Sotocal for these products.

### Today

The goal was to build a solid company, and it was met. For {{ anos }} years Sotocal has kept pace with the market and kept serving the people who ask for its coffee, holding its own among giants.

Sotocal is present across Portugal, from Minho to the Algarve, with a strong presence in cafés, restaurants and hotels (the HoReCa trade). It does this with its own brands and with coffee blends designed for that trade:

- Super Milano blend
- Super blend
- Reggio blend

And the products that go with them:

- Decaffeinated coffee, in beans and single-serve pods
- Sotocal sugar and sweetener
- Black tea, green tea and herbal infusions

It still roasts peanuts and coffee substitutes: barley and chicory.

Sotocal also sells in some European markets and in emerging Asian markets.

What matters most to Sotocal is the quality of its products and the satisfaction of the people who drink them. As a family-run SME, it stays close to its customers, staff, suppliers and consumers, and always gives them its best attention.

### Awards

- PME Excelência Indústria 2001
- PME Líder 2011

---

## missao.php → `/pages/historia` (Missão)

### PT original

> ## MISSÃO
> A Missão da Sotocal é ter o Melhor Lote de Café do mercado Português, de modo a proporcionar a quem o toma um momento de incomparável prazer pelo seu aroma e sabor, provocando após o seu consumo, o imediato desejo de tomar logo a seguir, um segundo Café Sotocal.
> Para levar a cabo esta Missão, a Sotocal tem o cuidado diário de fazer muito bem tudo o que faz, desde a escolha e combinação das Origens, passando pela exímia Torra, até à mais eficiente Distribuição.
> Cada colaborador da Sotocal sente diariamente a sua quota de responsabilidade no cumprimento desta Missão.
> E aqui começam os nossos Valores.

### PT reescrito

## A nossa missão

A missão da Sotocal é ter o melhor lote de café do mercado português: um café que dê a quem o toma um momento de prazer pelo aroma e pelo sabor e que, depois de bebido, deixe vontade de tomar, logo a seguir, um segundo Café Sotocal.

Para cumprir esta missão, fazemos bem, todos os dias, cada passo: a escolha e a combinação das origens, a torra e a distribuição.

Cada pessoa da Sotocal sente, todos os dias, a sua parte de responsabilidade nesta missão.

E é aqui que começam os nossos valores.

Short form for the homepage pull quote (fold 2, attributed "A nossa missão"): «Queremos que cada café deixe vontade de tomar logo a seguir um segundo.»

### EN

## Our mission

Sotocal's mission is to have the best coffee blend in Portugal: a coffee that gives whoever drinks it a moment of pleasure in its aroma and flavour and, once finished, leaves them wanting a second Sotocal coffee straight away.

To fulfil this mission, we do every step well, every day: choosing and combining the origins, roasting, and getting the coffee to you.

Everyone at Sotocal feels their share of responsibility for this mission, every day.

And this is where our values begin.

Short form for the homepage pull quote: “We want every coffee to leave you wanting a second one straight away.”

---

## valores.php → `/pages/historia` (Valores)

### PT original

The page has no text; the content is the word cloud `images/valores.png`. Transcription (OCR by reading the image), in the order the words appear top to bottom, left to right:

> TRADIÇÃO, HONRA, HISTÓRIA, COMPROMISSO, CUMPRIMENTO, RIGOR, INTEGRIDADE, ALMA, CORAGEM, ESSÊNCIA, FORÇA

### PT reescrito

## Os nossos valores

Tradição, honra, história, compromisso, cumprimento, rigor, integridade, alma, coragem, essência e força.

Render as live text, never as the image. Suggested grouping so the list reads in chunks (Miller), using only the client's own words `[[TBC: client to approve the grouping or ask for a flat list]]`:

- **Tradição, história e essência**: o que somos desde 1960.
- **Honra, integridade e cumprimento**: o que prometemos, cumprimos.
- **Rigor e compromisso**: em cada lote e em cada entrega.
- **Alma, coragem e força**: o que nos mantém de pé entre gigantes.

### EN

## Our values

Tradition, honour, history, commitment, keeping our word, rigour, integrity, soul, courage, essence and strength.

- **Tradition, history and essence**: who we have been since 1960.
- **Honour, integrity and keeping our word**: what we promise, we deliver.
- **Rigour and commitment**: in every blend and every delivery.
- **Soul, courage and strength**: what keeps us standing among giants.

("Cumprimento" means honouring commitments, not "greeting"; translated as "keeping our word".)

---

## tipos-de-cafe.php → `/pages/arabica-e-robusta`

### PT original

> ## TIPOS DE CAFÉ
> A qualidade do café-bebida que chega ás nossas chávenas e à apreciação do nosso paladar é condicionado por vários factores, mas sem dúvida a selecção de uma boa matéria-prima é determinante.
> Actualmente os três maiores produtores de café são Brasil, Vietname, Colômbia, os quais representam entre 60 e 70% da produção mundial.
> Existem duas variedades principais de café, Arábica e Robusta
> ### Coffea arabica - ARÁBICA
> É aromático e de gosto suave podendo ser bebido puro. Os seus grãos geralmente de forma alongada e côr esverdeada têm um teor de cafeína baixo, entre 0,8 e 1,5 %.
> É um arbusto geralmente plantado a grandes altitudes.
> ### Coffea canephora - ROBUSTA
> Os seus grãos em geral arredondados, de côr beje-acastanhada apresentam níveis de cafeína superiores à espécie Arábica.
> Esta planta é mais resistente ás alterações climatéricas e doenças, e em geral é plantada em regiões de baixa altitude.

### PT reescrito

## Arábica e robusta

O café que chega à sua chávena depende de muitos fatores, mas a escolha de uma boa matéria-prima é decisiva.

Hoje, os três maiores produtores de café do mundo são o Brasil, o Vietname e a Colômbia. Só o Brasil e o Vietname produzem mais de metade do café mundial.

Há duas espécies principais de café: o arábica e o robusta. Todos os lotes Sotocal juntam as duas; o que muda é a origem, a proporção e a torra.

### Arábica (*Coffea arabica*)

Aromático e de sabor suave, pode ser bebido puro. Os grãos são geralmente alongados, de cor esverdeada, e têm pouca cafeína: entre 0,8% e 1,5%. A planta é um arbusto cultivado sobretudo em altitude.

### Robusta (*Coffea canephora*)

Os grãos são geralmente arredondados, de cor bege acastanhada, e têm mais cafeína do que os de arábica. A planta resiste melhor às mudanças de clima e às doenças, e é cultivada sobretudo em regiões de baixa altitude.

Fact check: the legacy "60 a 70%" share is replaced. USDA FAS (December 2025 circular) puts 2025/26 world production at a record 178.8 million 60 kg bags, Brazil at 63.0 million and Vietnam at 30.8 million (together about 52%); Colombia is third. Sources: [USDA FAS, Coffee: World Markets and Trade, December 2025](https://www.fas.usda.gov/sites/default/files/2025-12/coffee.pdf); [July 2026 edition](https://www.fas.usda.gov/data/coffee-world-markets-and-trade-07222026). `[[TBC: refresh the ranking from the latest USDA circular before publishing]]`

### EN

## Arabica and robusta

What ends up in your cup depends on many things, but choosing good raw coffee matters most.

Today the world's three largest coffee producers are Brazil, Vietnam and Colombia. Brazil and Vietnam alone grow more than half the world's coffee.

There are two main coffee species: arabica and robusta. Every Sotocal blend combines both; what changes is the origin, the proportion and the roast.

### Arabica (*Coffea arabica*)

Aromatic and smooth, it can be drunk on its own. The beans are usually long and greenish, and low in caffeine: between 0.8% and 1.5%. The plant is a shrub grown mostly at altitude.

### Robusta (*Coffea canephora*)

The beans are usually round and beige-brown, with more caffeine than arabica. The plant copes better with changes in climate and with disease, and is grown mostly at low altitude.

---

## cafe-e-a-saude.php → `/pages/cafe-e-saude`

### PT original

> ## O CAFÉ E A SAÚDE
> O Café tem na sua constituição vários tipos de componentes:
> - vitaminas
> - açucares
> - proteínas
> - minerais
> - gorduras
> - polifenóis
> Mas sem dúvida que o seu elemento mais amplamente divulgado e cientificamente estudado é a cafeína.
> A cafeína é um estimulante suave e natural com benefícios constatados no bem-estar do dia-a-dia
> da maioria dos indivíduos
> - Aumenta o estado de alerta, concentração e capacidade de reacção, contrariando a fadiga, e contribuindo para uma melhoria do desempenho físico e mental.
> Quem nunca experimentou o efeito fantástico que a toma de um café Sotocal nos proporciona quando paramos ao longo de uma viagem de carro já fatigante, ou quando necessitamos de prolongar o nosso dia de trabalho ou estudo e o cansaço ou sonolência surge, ou mesmo quando queremos impressionar os nossos amigos no jogo de futebol ao fim de semana.
> Existe opinião científica comprovada quer a nível internacional pelas;
> - EFSA (European Food Safety Authority)
> - FDA (Food and Drug Administration)
> E a nível nacional pelo;
> - CEMBE (Centro de Estudos de Medicina Baseada na Evidência, Faculdade de Medicina de Lisboa), que:
> O consumo habitual e moderado de Café, não só não é factor de risco para a saúde, como contribui para o aumento do bem-estar e qualidade de vida de indivíduos saudáveis:
> - Pode reduzir o risco de aparecimento de doenças ligadas à demência de envelhecimento (doença de Alzheimer), neurodegenerativas (doença de Parkinson) e depressões.
> - Tem efeito protector no aparecimento da diabetes mellitus tipo II e em certas doenças do fígado, nomeadamente as relacionadas com a ingestão de álcool.
> Sites sugeridos:
> EFSA
> Coffe and Health

(Links on the page: http://www.efsa.europa.eu/en and http://www.coffeeandhealth.org/topics/.)

### Removed and why

- Every function claim (alertness, concentration, reaction time, fatigue, physical and mental performance, the driving/studying/football anecdote) and every disease-risk claim (Alzheimer's, Parkinson's, depression, type 2 diabetes, liver disease, "efeito protector"). Under EU Regulation 1924/2006 a food business may only make authorised health claims under their exact conditions of use; disease-risk-reduction claims need specific authorisation. The legacy wording does not meet either test, and the anecdote about driving while tired is a safety risk.
- The attribution of conclusions to EFSA, FDA and CEMBE, because the legacy text does not cite what those bodies actually said.
- The list of components, because "vitaminas" and "proteínas" in a cup of coffee are negligible and listing them reads as a nutrition claim.
- The link to coffeeandhealth.org, which is run by an industry-funded body (ISIC); a neutral page links to EFSA only.

### PT reescrito

## Café e cafeína: o que diz a EFSA

`[[TBC: legal review]]`

Uma chávena de café é quase toda água. Contém também cafeína, compostos fenólicos como os ácidos clorogénicos e os compostos aromáticos que se formam durante a torra.

A cafeína é a substância do café mais estudada. Em 2015, a Autoridade Europeia para a Segurança dos Alimentos (EFSA) avaliou a segurança da cafeína para a população europeia e concluiu o seguinte:

- **Adultos saudáveis:** doses isoladas até 200 mg (cerca de 3 mg por quilo de peso corporal) e um consumo habitual até 400 mg por dia (cerca de 5,7 mg por quilo) não levantam preocupações de segurança.
- **Gravidez e amamentação:** um consumo total até 200 mg de cafeína por dia, de todas as fontes e distribuído ao longo do dia, não levanta preocupações de segurança para o bebé.
- **Crianças e adolescentes:** a EFSA propõe como nível seguro 3 mg por quilo de peso corporal por dia.

Estes valores somam a cafeína de todas as fontes: café, chá, chocolate, refrigerantes e bebidas energéticas.

A cafeína de uma chávena varia com o lote, a moagem, a dose e a forma de preparar. `[[TBC: caffeine per serving for the Sotocal blends, only if Sotocal has lab data]]`

Se tem dúvidas sobre a cafeína no seu caso, fale com o seu médico.

Prefere evitar a cafeína? O nosso Descafeinado tem o sabor Sotocal, sem a cafeína. `[[TBC: legal review of "sem cafeína" for a decaffeinated product]]`

Fonte: EFSA, *Scientific Opinion on the safety of caffeine*, EFSA Journal 2015;13(5):4102, publicado a 27/05/2015. https://www.efsa.europa.eu/en/topics/topic/caffeine

Verification: figures checked on 28/10/2026 against the EFSA caffeine topic page (https://www.efsa.europa.eu/en/topics/topic/caffeine), which quotes the opinion: "Single doses of caffeine up to 200mg" (about 3 mg/kg bw) and "Intakes up to 400mg per day (about 5.7mg/kg bw per day)" for healthy adults; "up to 200mg per day consumed throughout the day" for pregnant and lactating women; "A safety level of 3mg/kg bw per day is also proposed for habitual caffeine consumption by children and adolescents." Opinion DOI: https://doi.org/10.2903/j.efsa.2015.4102. Press release of 27/05/2015: https://www.efsa.europa.eu/en/press/news/150527.

### EN

## Coffee and caffeine: what EFSA says

`[[TBC: legal review]]`

A cup of coffee is almost all water. It also contains caffeine, phenolic compounds such as chlorogenic acids, and the aroma compounds that form during roasting.

Caffeine is the most studied substance in coffee. In 2015 the European Food Safety Authority (EFSA) assessed the safety of caffeine for the European population and concluded:

- **Healthy adults:** single doses of up to 200 mg (about 3 mg per kilogram of body weight) and habitual intake of up to 400 mg a day (about 5.7 mg per kilogram) raise no safety concerns.
- **Pregnancy and breastfeeding:** a total of up to 200 mg of caffeine a day, from all sources and spread through the day, raises no safety concerns for the baby.
- **Children and adolescents:** EFSA proposes 3 mg per kilogram of body weight a day as a safe level.

These figures add up caffeine from all sources: coffee, tea, chocolate, soft drinks and energy drinks.

The caffeine in a cup varies with the blend, the grind, the dose and how you make it.

If you are unsure about caffeine in your own case, talk to your doctor.

Would you rather avoid caffeine? Our Decaf has the Sotocal flavour without the caffeine.

Source: EFSA, *Scientific Opinion on the safety of caffeine*, EFSA Journal 2015;13(5):4102, published 27/05/2015. https://www.efsa.europa.eu/en/topics/topic/caffeine

---

## produtos-super-milano.php → `/products/lote-super-milano`

### PT original

> ## LOTE SUPER MILANO
> 100% Café Puro
> Sabor intenso e persistente após a toma, Aroma suave, creme aveludado e persistente.
> Milano é o resultado da composição de Finos e Suaves cafés Arábicas de Montanha, com Intensos Robustas Africanos.
> Desta cuidadosa selecção aliada a uma Torra perfeita e profissional resulta o Lote Super Milano de sabor intenso
> e persistente após a toma, aroma agradavelmente suave e um expresso de creme aveludado e persistente.

### PT reescrito

## Lote Super Milano

100% café.

Sabor intenso e persistente, aroma suave, creme aveludado e persistente.

O Super Milano junta arábicas de montanha, finos e suaves, a robustas africanos intensos. Desta seleção cuidada e de uma torra rigorosa nasce um café de sabor intenso, que fica depois de bebido, com um aroma suave e um expresso de creme aveludado e persistente.

Character line (theme): "Intenso e persistente, com creme aveludado." Chips: Intenso, Aroma suave, Creme aveludado.

### EN

## Super Milano blend

100% coffee.

Intense, lingering flavour, a soft aroma and a velvety, lasting crema.

Super Milano brings together fine, smooth mountain arabicas and intense African robustas. This careful selection and a precise roast give a coffee with an intense flavour that stays with you, a soft aroma and an espresso with a velvety, lasting crema.

Character line: "Intense and lingering, with a velvety crema." Chips: Intense, Soft aroma, Velvety crema.

---

## produtos-super-torrado.php → `/products/lote-super`

### PT original

> ## LOTE SUPER
> 100% Café Puro
> Sabor forte
> Um expresso encorpado com um creme que persiste
> Fino Lote de Café preparado a partir dos suaves Café Arábicas da America Central e Brasil e dos melhores cafés Robustas cultivados na África Ocidental.
> Desta cuidadosa selecção aliada a uma Torra perfeita e profissional resulta o Lote Super de sabor forte, aroma revigorante, e um expresso encorpado com um creme que persiste.

### PT reescrito

## Lote Super

100% café.

Sabor forte. Um expresso encorpado, com um creme que persiste.

Um lote preparado com arábicas suaves da América Central e do Brasil e com robustas da África Ocidental. Desta seleção cuidada e de uma torra rigorosa nasce o Lote Super: sabor forte, aroma revigorante e um expresso encorpado, com um creme que persiste.

Character line: "Forte e encorpado, com creme que persiste." Chips: Forte, Revigorante, Encorpado. ("dos melhores cafés robustas" softened to "robustas da África Ocidental": an unprovable superlative.)

### EN

## Super blend

100% coffee.

Strong flavour. A full-bodied espresso with a crema that lasts.

A blend of smooth arabicas from Central America and Brazil with robustas from West Africa. This careful selection and a precise roast give the Super blend its strong flavour, invigorating aroma and full-bodied espresso with a crema that lasts.

Character line: "Strong and full-bodied, with a crema that lasts." Chips: Strong, Invigorating, Full-bodied.

---

## produtos-reggio.php → `/products/lote-reggio`

### PT original

> ## LOTE REGGIO
> Café 100% Puro
> Um café energético e vigoroso, Aroma activo, creme firme.
> Da selecção dos mais sublimes e aromáticos cafés de montanha, combinados com os intensos e fortes das plantações Africanas, aliada a uma Torra intensa do tipo italiano resulta o Lote Reggio. Um café Energético e vigoroso, de sabor forte, aroma activo; um expresso revigorante e de creme firme.

### PT reescrito

## Lote Reggio

100% café.

Um café enérgico e vigoroso, de aroma ativo e creme firme.

Cafés de montanha aromáticos, combinados com cafés africanos intensos e fortes, e uma torra intensa de estilo italiano: assim nasce o Lote Reggio. Um café vigoroso, de sabor forte e aroma ativo; um expresso cheio de caráter, de creme firme.

Character line: "Torra intensa de estilo italiano. Vigoroso, de creme firme." Chips: Vigoroso, Aroma ativo, Creme firme. ("energético" describes character, not an energy claim; kept as "enérgico" in the description only, dropped from chips. "revigorante" on the espresso replaced by "cheio de caráter" to avoid a function reading.)

### EN

## Reggio blend

100% coffee.

A lively, vigorous coffee with a lively aroma and a firm crema.

Aromatic mountain coffees combined with strong, intense African coffees and a dark Italian-style roast: that is the Reggio blend. A vigorous coffee with a strong flavour and a lively aroma; an espresso full of character, with a firm crema.

Character line: "A dark Italian-style roast. Vigorous, with a firm crema." Chips: Vigorous, Lively aroma, Firm crema.

---

## produtos-descafeinado.php → `/products/cafe-descafeinado`

### PT original

> ## DESCAFEINADO
> Tal como todos os Lotes da Sotocal, também o nosso Descafeinado é fruto de uma criteriosa selecção das melhores origens aliada a uma torra executada por experientes e sábios profissionais, mas sem cafeína.
> Este lote foi concebido especialmente para si, para que possa obter todo o prazer do sabor e aroma do seu Café Sotocal, tranquilamente e sem preocupação, caso tenha alguma sensibilidade aos efeitos da cafeína.

### PT reescrito

## Descafeinado

Como todos os lotes Sotocal, o nosso Descafeinado nasce de uma seleção criteriosa de origens e de uma torra feita por profissionais experientes. Só lhe falta a cafeína.

Pensámos neste lote para quem prefere evitar a cafeína e não quer abdicar do sabor e do aroma de um Café Sotocal. Existe em grão e em unidoses. `[[TBC: unidoses are ESE pods? formats and weights]]`

Character line: "Todo o sabor Sotocal, sem cafeína." Chips: Sem cafeína, `[[TBC]]`. `[[TBC: legal review of "sem cafeína" wording for decaffeinated coffee]]`

### EN

## Decaf

Like every Sotocal blend, our Decaf starts with a careful choice of origins and a roast by experienced professionals. It simply leaves out the caffeine.

We made this blend for people who would rather avoid caffeine but not give up the flavour and aroma of a Sotocal coffee. Available in beans and single-serve pods.

Character line: "All the Sotocal flavour, without the caffeine." Chips: Caffeine-free (subject to the same legal review), `[[TBC]]`.

---

## complementares-acucar.php, -adocante, -descafeinado, -cha, -amendoins → `/collections/complementares`

The five pages share the same text; only the product image changes (`acucar.png`, `adocante.png`, `descafeinado.png`, `cha.png`, `amendoins.png`).

### PT original

> ## PRODUTOS COMPLEMENTARES
> Especialmente concebidos para o segmento HoReCa, a Sotocal, sempre a pensar em si , disponibiliza uma gama de produtos complementares aos seus Lotes de Café, para que no conforto do seu Estabelecimento possa usufruir da qualidade com que a Sotocal o serve há mais de 50 Anos, também em:
> • Açucar em carteiras
> • Adoçante em saquetas
> • Descafeinado em Unidoses
> • Chá Verde e Chá Preto
> • Infusões de Camomila e Cidreira
> • Amendoim torrado Jumbo

### PT reescrito

## Complementares

Para acompanhar os lotes Sotocal, temos uma gama de produtos pensada primeiro para cafés, restaurantes e hotéis, com a mesma qualidade com que servimos há mais de {{ mais_de_anos }} anos:

- Açúcar em pacotes
- Adoçante em saquetas
- Descafeinado em unidoses
- Chá verde e chá preto
- Infusões de camomila e de cidreira
- Amendoim torrado Jumbo

Per-product lines for product pages `[[TBC: formats, weights and ingredient lists for each]]`:

- **Açúcar Sotocal:** açúcar em pacotes individuais, o mesmo que encontra nos cafés Sotocal.
- **Adoçante Sotocal:** adoçante em saquetas individuais.
- **Descafeinado em unidoses:** doses individuais de café descafeinado.
- **Chá verde e chá preto:** em saquetas.
- **Infusões de camomila e de cidreira (melissa):** em saquetas. (Packaging photo `cha.png` shows cidreira, verde, preto and a fourth box; confirm the range.)
- **Amendoim torrado Jumbo:** amendoim de calibre grande, torrado pela Sotocal.

### EN

## Accompaniments

To go with the Sotocal blends, we make a range first designed for cafés, restaurants and hotels, with the same quality we have served for more than {{ mais_de_anos }} years:

- Sugar sachets
- Sweetener sachets
- Decaf single-serve pods
- Green tea and black tea
- Chamomile and lemon balm infusions
- Roasted Jumbo peanuts

Per-product lines:

- **Sotocal sugar:** individual sugar sachets, the same ones you find in Sotocal cafés.
- **Sotocal sweetener:** individual sweetener sachets.
- **Decaf pods:** single-serve doses of decaffeinated coffee.
- **Green and black tea:** in tea bags.
- **Chamomile and lemon balm infusions:** in tea bags.
- **Roasted Jumbo peanuts:** large peanuts, roasted by Sotocal.

---

## conservas.php → `/collections/conservas`

### PT original

> ## CONSERVAS

(No text. The only content is `conservas.png`: two cans labelled "Atum Gaivota", one "Posta", one "Posta grande em óleo vegetal".)

### PT reescrito

## Conservas

`[[TBC: conservas range, brand (the legacy image shows "Atum Gaivota") and whether Sotocal produces or distributes it]]`

### EN

## Conservas

`[[TBC: conservas range]]`. Keep the Portuguese word "conservas" in English copy (as in the EN URL `/en/collections/conservas`), glossed once as "Portuguese tinned fish".

---

## sucedaneos-bom-dia.php, -sako, -cevada, -cevada-oriente → `/collections/sucedaneos-do-cafe` and the matching products

The four pages share an intro and add one product line each.

### PT original

Shared intro:

> ## SUCEDÂNEOS DE CAFÉ
> O pequeno-almoço é uma das principais refeições do dia; quem toma pequeno-almoço consegue manter o seu peso equilibrado ou mesmo perder peso com melhores resultados do que quem começa o dia saltando esta refeição.
> Também o cérebro não funciona sem um fluxo regular de hidratos de carbono.
> Sempre a pensar em si, a Sotocal criou as melhores Misturas Tradicionais com Café, para que comece o seu dia com muita energia. Simples ou com leite, um sabor com muito prazer.

Product lines:

> • Mistura Bom Dia
> Com 25% de Café Puro e 75% de Chicória é uma mistura revigorante, encorpada mas com um aroma forte, devido á rica incorporação de Café.

> • Mistura Sako
> Com 20% de Café Puro e 80% de ricos e nutritivos cereais torrados como Cevada, Chicória e Grão Preto.

> • Cevada Sotocal

> • Cevada Oriente

### Removed and why

- The weight claim ("manter o seu peso equilibrado ou mesmo perder peso") and the brain/carbohydrate claim ("o cérebro não funciona sem um fluxo regular de hidratos de carbono"): unauthorised health claims under EU 1924/2006, and the weight claim is not about the product at all.
- "para que comece o seu dia com muita energia": reads as an energy claim.
- "ricos e nutritivos cereais": "nutritivo" is a nutrition claim; removed.
- "as melhores Misturas": unprovable superlative.

### PT reescrito

## Sucedâneos de café

Misturas tradicionais para beber simples ou com leite, ao pequeno-almoço ou a qualquer hora. Foi com os sucedâneos que a Sotocal começou: quatro a cinco anos depois de 1960, já era líder do mercado português de sucedâneos torrados.

- **Mistura Bom Dia:** 25% café e 75% chicória. Encorpada e de aroma forte, graças à parte de café.
- **Mistura Sako:** 20% café e 80% cereais torrados: cevada, chicória e grão preto. (Confirmed by the client leaflet.)
- **Cevada Sotocal:** cevada torrada e moída. `[[TBC: description, formats and weights]]`
- **Cevada Oriente:** cevada torrada e moída, da marca Oriente. `[[TBC: what distinguishes it from Cevada Sotocal]]`

### EN

## Coffee substitutes

Traditional blends to drink black or with milk, at breakfast or any time of day. Substitutes are where Sotocal began: within four to five years of 1960 it led the Portuguese market for roasted substitutes.

- **Mistura Bom Dia:** 25% coffee and 75% chicory. Full-bodied, with a strong aroma from its share of coffee.
- **Mistura Sako:** 20% coffee and 80% roasted grains: barley, chicory and grão preto.
- **Cevada Sotocal:** roasted ground barley.
- **Cevada Oriente:** roasted ground barley, under the Oriente brand.

---

## colorau.php → `/products/colorau` and `/blogs/receitas/cabrito-assado`

### PT original

> ## COLORAU
> O Colorau, também denominado Pimentão Doce ou Paprica, é o condimento obtido a partir do fruto do Pimenteiro Doce depois de devidamente seco e moído.
> É utilizado para realçar a côr e intensificar o sabor de alimentos cozinhados e confecção de alguns enchidos. Indicado principalmente para pratos estufados ou assados no forno e legumes salteados.
> ### RECEITA
> Cabrito Assado
> Ingredientes:
> 1 cabrito (+/- 3 kg)
> 2 cebolas
> 3 dentes de alho
> 1 colh. de sopa de Colorau Oriente/ Sotocal
> ½ colh. de sopa de Pimenta Branca moída Oriente/ Sotocal
> ½ colh. de sopa de Piri-Piri moído Oriente/ Sotocal
> Folhas de loureiro
> ½ molho de salsa
> ½ garrafa de vinho branco
> 2 kg batatas pequenas
> 3 dl Azeite
> Sal e um pouco de banha de porco
> De véspera, depois do cabrito limpo e arranjado, faça uma massa com o colorau, pimenta, piri-piri, sal, os alhos e salsa picados e o azeite e unte todo o cabrito com ela.
> Depois distribua as folhas de loureiro pelo interior e exterior do cabrito, regue-o com o vinho branco de preferência maduro, cubra com película aderente e deixe no frigorífico.
> No dia, unte uma assadeira com banha de porco e coloque as cebola às rodelas no fundo. Coloque o cabrito inteiro ou partido por cima e regue com o molho da marinada. Descasque as batatas, dê-lhe um pequeno golpe, tempere-as com sal e colorau. Leve ao forno quente.
> Vá vigiando e de tempos a tempos vire o cabrito ou os bocados para irem assando por todo sem secar demasiado.

### PT reescrito (produto)

## Colorau

O colorau, também chamado pimentão-doce ou páprica, obtém-se do fruto do pimenteiro-doce, seco e moído.

Dá cor e sabor a cozinhados e a alguns enchidos. Use-o sobretudo em estufados, assados no forno e legumes salteados.

### EN (product)

## Colorau (sweet paprika)

Colorau, also called sweet paprika, is made from dried, ground sweet peppers.

It adds colour and flavour to cooked dishes and to some cured sausages. Use it above all in stews, oven roasts and sautéed vegetables.

### Receita: Cabrito assado (PT)

Rende: `[[TBC: porções, cerca de 8?]]`. Tempo: marinada de véspera (cerca de 12 h) + forno `[[TBC: tempo e temperatura]]`.

Ingredientes:
- 1 cabrito com cerca de 3 kg
- 2 cebolas
- 3 dentes de alho
- 1 colher de sopa (15 ml) de colorau Sotocal
- ½ colher de sopa (7,5 ml) de pimenta-branca moída Sotocal
- ½ colher de sopa (7,5 ml) de piri-piri moído Sotocal
- folhas de louro
- ½ molho de salsa
- 375 ml de vinho branco (meia garrafa)
- 2 kg de batatas pequenas
- 300 ml de azeite
- sal e um pouco de banha de porco

Preparação:
1. Na véspera, com o cabrito limpo e arranjado, faça uma pasta com o colorau, a pimenta, o piri-piri, o sal, os alhos e a salsa picados e o azeite. Barre todo o cabrito com ela.
2. Espalhe as folhas de louro por dentro e por fora do cabrito e regue-o com o vinho branco, de preferência maduro. Cubra com película aderente e guarde no frigorífico.
3. No dia, unte um tabuleiro com banha de porco e forre o fundo com as cebolas às rodelas. Ponha por cima o cabrito, inteiro ou em pedaços, e regue com o molho da marinada.
4. Descasque as batatas, dê-lhes um pequeno golpe e tempere-as com sal e colorau. Junte-as ao tabuleiro.
5. Leve ao forno quente `[[TBC: 200 °C?]]`. Vá vigiando e vire o cabrito de vez em quando, para assar por igual sem secar.

### Recipe: Roast kid goat (EN)

Serves: `[[TBC]]`. Time: overnight marinade (about 12 h) plus oven time `[[TBC]]`.

Ingredients:
- 1 kid goat, about 3 kg
- 2 onions
- 3 garlic cloves
- 1 tablespoon (15 ml) Sotocal colorau (sweet paprika)
- ½ tablespoon (7.5 ml) Sotocal ground white pepper
- ½ tablespoon (7.5 ml) Sotocal ground piri-piri
- bay leaves
- ½ bunch of parsley
- 375 ml white wine (half a bottle)
- 2 kg small potatoes
- 300 ml olive oil
- salt and a little lard

Method:
1. The day before, with the kid cleaned and prepared, make a paste with the paprika, pepper, piri-piri, salt, chopped garlic and parsley, and the olive oil. Rub it all over the meat.
2. Tuck bay leaves inside and outside the kid and pour over the white wine, ideally a mature one. Cover with cling film and refrigerate.
3. On the day, grease a roasting tin with lard and line the bottom with sliced onion. Lay the kid, whole or in pieces, on top and pour over the marinade.
4. Peel the potatoes, make a small cut in each and season with salt and paprika. Add them to the tin.
5. Roast in a hot oven. Check it regularly and turn the meat now and then so it roasts evenly without drying out.

Note: the legacy recipes name "Oriente/ Sotocal" spices; the brand relationship between Oriente and Sotocal is listed for confirmation. The rewrites say "Sotocal" until confirmed.

---

## pimenta.php → `/products/pimenta` and `/blogs/receitas/bife-do-lombo-com-molho-de-duas-pimentas`

### PT original

> ## PIMENTA
> A Pimenta Branca e a Pimenta Preta são ambas originárias da mesma planta – Piper Nigrum; a sua diferença reside apenas no diferente estádio de maturação em que o respectivo fruto se encontra, no momento da apanha.
> Quando o fruto é apanhado completamente maduro e descascado logo em seguida, dá origem a um grão branco e polido – temos a Pimenta Branca.
> Quando o fruto é apanhado numa fase mais atrasada da sua maturação, onde a casca não está ainda totalmente vermelha, este é colocado a secar, o que provoca que a casca desidrate, enrugue e ganhe uma cor muito escura – temos a Pimenta Preta.
> De sabor levemente picante, a pimenta tem um uso quase universal na cozinha sendo aplicada em pratos de carne, peixe, aves e molhos diversos, como o famoso “Steak au poivre“.
> ### RECEITA
> Bife do Lombo com Molho de duas Pimentas
> Ingredientes
> 4 Bifes altos do lombo
> 100g de manteiga
> 1 colh. de chá de Pimenta Branca moída Oriente/ Sotocal
> 1 colh. de chá de Pimenta Preta moída Oriente/ Sotocal
> 1 colh. de chá de mostarda
> 4 colh de sopa de natas
> ½ cálice de conhaque
> Passe os bifes de ambos os lados na frigideira pela manteiga.
> Retire-os, reduza o fogo ao mínimo e na mesma frigideira misture as duas pimentas +/- 2 minutos.
> Acrescente a mostarda e o conhaque e misture tudo bem.
> Envolva por fim as natas, obtendo um molho cremoso e homogéneo.
> Cubra os bifes e sirva.

### PT reescrito (produto)

## Pimenta

A pimenta-branca e a pimenta-preta vêm da mesma planta, a *Piper nigrum*. A diferença está no ponto de maturação do fruto quando é colhido.

- **Pimenta-branca:** o fruto é colhido bem maduro e descascado logo a seguir, e dá um grão branco e liso.
- **Pimenta-preta:** o fruto é colhido mais cedo, quando a casca ainda não está toda vermelha, e posto a secar. A casca desidrata, enruga e fica muito escura.

De sabor ligeiramente picante, a pimenta usa-se em quase toda a cozinha: carne, peixe, aves e molhos, como o conhecido *steak au poivre*.

### EN (product)

## Pepper

White and black pepper come from the same plant, *Piper nigrum*. The difference is how ripe the fruit is when it is picked.

- **White pepper:** the fruit is picked fully ripe and its skin removed straight away, leaving a smooth white peppercorn.
- **Black pepper:** the fruit is picked earlier, before the skin has fully turned red, and left to dry. The skin shrivels and turns very dark.

Gently hot, pepper goes into almost every kind of cooking: meat, fish, poultry and sauces such as the classic *steak au poivre*.

### Receita: Bife do lombo com molho de duas pimentas (PT)

Rende: 4 pessoas. Tempo: cerca de 15 minutos `[[TBC]]`.

Ingredientes:
- 4 bifes altos do lombo
- 100 g de manteiga
- 1 colher de chá (5 ml) de pimenta-branca moída Sotocal
- 1 colher de chá (5 ml) de pimenta-preta moída Sotocal
- 1 colher de chá (5 ml) de mostarda
- 4 colheres de sopa (60 ml) de natas
- 25 ml de conhaque (meio cálice) `[[TBC: confirmar conversão]]`

Preparação:
1. Numa frigideira, aloure os bifes dos dois lados na manteiga.
2. Retire-os, baixe o lume ao mínimo e, na mesma frigideira, junte as duas pimentas e mexa durante cerca de 2 minutos.
3. Junte a mostarda e o conhaque e misture bem.
4. Por fim, envolva as natas até ter um molho cremoso e homogéneo.
5. Cubra os bifes com o molho e sirva.

### Recipe: Sirloin steak with two-pepper sauce (EN)

Serves 4. Time: about 15 minutes.

Ingredients:
- 4 thick sirloin steaks
- 100 g butter
- 1 teaspoon (5 ml) Sotocal ground white pepper
- 1 teaspoon (5 ml) Sotocal ground black pepper
- 1 teaspoon (5 ml) mustard
- 4 tablespoons (60 ml) single cream
- 25 ml brandy (half a small glass)

Method:
1. Sear the steaks on both sides in the butter.
2. Take them out, turn the heat right down and stir the two peppers in the same pan for about 2 minutes.
3. Add the mustard and brandy and mix well.
4. Finally, fold in the cream to make a smooth, creamy sauce.
5. Pour the sauce over the steaks and serve.

---

## piri-piri.php → `/products/piri-piri` and `/blogs/receitas/frango-assado-com-piri-piri`

### PT original

> ## PIRI-PIRI
> O Piri-piri ou pimenta malagueta - Capsicum frutescens – é um arbusto que embora originário da Ásia e America do Sul é hoje cultivado em todo o mundo.
> As suas pequenas vagens vermelhas quando maduras, contêm umas sementes amarelas com um sabor e aroma forte e muito picante. É utilizado depois de seco para condimentar e tornar picantes uma grande variedade de pratos, sendo de destacar a sua utilização no Frango de Churrasco e Caldeiradas de Peixe e Marisco.
> ### RECEITA
> Frango assado com Piri-Piri
> Ingredientes
> 1 frango
> 5 Vagens de Piri-Piri Sotocal picadas muito finas
> ou 1 colher sobremesa de Piri-Piri Moído Sotocal
> 2 colheres de sopa de margarina
> 1 dente de alho picado fino
> Sal
> Misture na margarina o Piri-piri Sotocal , o alho picado e o sal e unte o Frango generosamente com esta
> massa barrando também no interior; deixe ficar estes gostos a entranhar no frango durante aproximada-
> mente 2,5 horas.
> Leve o frango a assar no Churrasco ( previamente aberto, neste caso ) ou no forno.
> Se for no forno, convém ir virando o frango e pincelá-lo com o molho que se vai formando na assadeira
> para ficar tostado por todo.

### PT reescrito (produto)

## Piri-piri

O piri-piri, ou malagueta (*Capsicum frutescens*), é um arbusto originário das Américas, hoje cultivado em todo o mundo.

Quando maduras, as pequenas vagens vermelhas têm sementes amarelas de sabor e aroma fortes e muito picantes. Seco, o piri-piri tempera e dá picante a muitos pratos; é indispensável no frango de churrasco e nas caldeiradas de peixe e marisco.

Fact check: the legacy origin "Ásia e América do Sul" is corrected to "Américas": *Capsicum* is native to the Americas and reached Africa and Asia through Portuguese and Spanish trade. `[[TBC: editorial check]]`

### EN (product)

## Piri-piri

Piri-piri, or bird's eye chilli (*Capsicum frutescens*), is a shrub native to the Americas and now grown all over the world.

When ripe, its small red pods hold yellow seeds with a strong, very hot flavour and aroma. Dried, piri-piri seasons and adds heat to many dishes, above all barbecued chicken and fish and seafood stews.

### Receita: Frango assado com piri-piri (PT)

Rende: `[[TBC: 4 pessoas?]]`. Tempo: 2 h 30 min de marinada + assadura `[[TBC: tempo e temperatura do forno]]`.

Ingredientes:
- 1 frango
- 5 vagens de piri-piri Sotocal muito bem picadas, ou 1 colher de sobremesa (10 ml) de piri-piri moído Sotocal
- 2 colheres de sopa (30 g) de margarina
- 1 dente de alho bem picado
- sal

Preparação:
1. Misture a margarina com o piri-piri, o alho picado e o sal.
2. Barre o frango com esta pasta, por fora e por dentro, sem poupar. Deixe os sabores entranharem durante cerca de 2 horas e meia.
3. Asse o frango no churrasco (aberto ao meio) ou no forno.
4. No forno, vá virando o frango e pincelando-o com o molho que se forma no tabuleiro, para ficar tostado por igual.

### Recipe: Piri-piri roast chicken (EN)

Serves: `[[TBC]]`. Time: 2 h 30 min marinating plus roasting.

Ingredients:
- 1 chicken
- 5 Sotocal piri-piri pods, very finely chopped, or 1 dessertspoon (10 ml) Sotocal ground piri-piri
- 2 tablespoons (30 g) margarine
- 1 garlic clove, finely chopped
- salt

Method:
1. Mix the margarine with the piri-piri, chopped garlic and salt.
2. Spread the paste generously over the chicken, inside and out. Leave the flavours to soak in for about 2½ hours.
3. Cook the chicken on the barbecue (spatchcocked) or in the oven.
4. In the oven, turn the chicken now and then and brush it with the juices in the tin so it browns all over.

---

## canela.php → `/products/canela` and `/blogs/receitas/pasteis-de-nata-simples`

### PT original

> ## CANELA
> A Canela é originária do Sri Lanka e obtém-se a partir de segmentos da parte interna da casca de uma Arvore de médio porte ( 10-15 m ) chamada Cinnamomum zeylanicum, posteriormente secos.
> Com o seu aroma forte e quente e sabor levemente adocicado a canela é utilizada principalmente em pratos doces embora também se use para aromatizar leite ou mesmo café.
> Indispensável nas iguarias da época Natalícia como o Arroz-doce, as farófias, o leite-creme, as rabanadas ou os bolinhos de abóbora.
> O Natal não seria certamente o mesmo se não houvesse Canela Sotocal.
> ### RECEITA
> Pasteis de Nata muito simples para fazer em casa
> Ingredientes (12 pasteis):
> 600 g de Massa folhada
> 6 Gemas de Ovo
> 120 g de Açúcar
> 3 dl de natas
> 1 pau da Canela Sotocal
> Canela em pó Sotocal
> Aqueça o forno a 200ºC.
> Forre 12 forminhas com a massa folhada.
> Num tacho coloque o açucar, as natas, as gemas e o pau de canela; misture muito bem com uma colher de pau e leve a lume brando mexendo sempre até começar a querer ferver e engrossar um pouco.
> Distribua o creme pelas formas não enchendo demasiado e leve ao forno a cozer.
> Retire, desenforme e polvilhe com Canela em pó Sotocal .

### PT reescrito (produto)

## Canela

A canela vem do Sri Lanka. Obtém-se da parte interna da casca de uma árvore de porte médio (10 a 15 m), a *Cinnamomum zeylanicum*, depois de seca.

De aroma forte e quente e sabor ligeiramente doce, usa-se sobretudo em doces, mas também para aromatizar leite ou até café.

É indispensável no Natal: arroz-doce, farófias, leite-creme, rabanadas, bolinhos de abóbora. O Natal não seria o mesmo sem Canela Sotocal.

`[[TBC: confirm the product is Ceylon cinnamon (C. zeylanicum/verum) and not cassia; the description depends on it]]`

### EN (product)

## Cinnamon

Cinnamon comes from Sri Lanka. It is the dried inner bark of a medium-sized tree (10 to 15 m), *Cinnamomum zeylanicum*.

With its strong, warm aroma and slightly sweet taste, it goes mostly into desserts, but also flavours milk and even coffee.

In Portugal it is essential at Christmas: arroz-doce (rice pudding), farófias, leite-creme, rabanadas, pumpkin fritters. Christmas would not be the same without Sotocal cinnamon.

### Receita: Pastéis de nata simples, para fazer em casa (PT)

Rende: 12 pastéis. Forno: 200 °C. Tempo de forno: `[[TBC: cerca de 15 a 20 minutos?]]`

Ingredientes:
- 600 g de massa folhada
- 6 gemas de ovo
- 120 g de açúcar
- 300 ml de natas
- 1 pau de canela Sotocal
- canela em pó Sotocal

Preparação:
1. Aqueça o forno a 200 °C.
2. Forre 12 formas pequenas com a massa folhada.
3. Num tacho, junte o açúcar, as natas, as gemas e o pau de canela. Misture bem com uma colher de pau e leve a lume brando, sem parar de mexer, até começar a ferver e engrossar um pouco.
4. Retire o pau de canela `[[TBC: step implied, confirm]]`, distribua o creme pelas formas sem as encher demasiado e leve ao forno.
5. Retire, desenforme e polvilhe com canela em pó Sotocal.

### Recipe: Easy custard tarts at home (EN)

Makes 12. Oven: 200 °C. Baking time: `[[TBC]]`.

Ingredients:
- 600 g puff pastry
- 6 egg yolks
- 120 g sugar
- 300 ml single cream
- 1 Sotocal cinnamon stick
- Sotocal ground cinnamon

Method:
1. Heat the oven to 200 °C.
2. Line 12 small tins with the puff pastry.
3. In a pan, combine the sugar, cream, yolks and cinnamon stick. Mix well with a wooden spoon and cook over a low heat, stirring constantly, until it starts to bubble and thicken slightly.
4. Remove the cinnamon stick, fill the tins without overfilling them and bake.
5. Take the tarts out of the tins and dust with Sotocal ground cinnamon.

---

## cravinho.php → `/products/cravinho` and `/blogs/receitas/peras-em-calda-de-vinho-do-porto`

### PT original

> ## CRAVINHO
> O Cravinho é a especiaria resultante da flor desenvolvida mas ainda ainda não aberta de uma árvore – o Craveiro – e posteriormente seca.
> Embora hoje cultivada em vários países tropicais é originária das ilhas Molucas/ Indonésia e foram os Portugueses, na época dos descobrimentos e posterior comercio com o Oriente, os responsáveis pela sua introdução na Europa. No século XVI, um quilo de cravo-da-Índia tinha o mesmo valor de sete gramas de ouro.
> Com um aroma intenso e sabor forte e ardente, se consumido sozinho tem um efeito analgésico (daí ser por vezes usado para aliviar dor de dentes) e um poderoso eliminador de mau hálito...
> Como condimento é usado em pratos doces e salgados, em marinadas de carne e caça, para temperar legumes e mesmo para aromatizar licores e sangria.
> ### RECEITA
> Sobremesa de Peras em calda de Vinho do Porto
> Ingredientes: (4 pessoas)
> 4 Pêras
> 2 cálices de Vinho do Porto
> 2 Chávena de Açucar
> 2 Chávena de água (ou um pouco mais para cobrir as peras)
> 1 pau de Canela Sotocal
> ½ colher de chá de Cravinho Sotocal moído
> 2 colheres de sopa de Mel
> Colocar num tacho o Vinho do Porto com o açúcar, a água, o mel e o Cravinho e a Canela em pau Sotocal. Descasque as peras sem retirar o pé, insira-as no tacho, tape e deixe cozer em lume brando até as peras ficarem tenras. Quando cozidas mas duras, retire-as para um prato.
> Mantenha a calda a ferver em lume medio sem tapar o tacho até reduzir e começar a espessar; introduza de novo as peras e deixe continuar a reduzir a calda. Vá virando as peras de vez em quando e regando-as com a calda.
> No fim o molho deverá ficar quase caramelizado e espesso.
> Por fim colocar num recipiente de ir á mesa, e levar ao frigorífico por algumas horas até ao momento de servir.

### Removed and why

- "efeito analgésico (… aliviar dor de dentes)" and "poderoso eliminador de mau hálito": medicinal and health claims for a food, not allowed under EU 1924/2006 (and medicinal claims are banned for foods under EU 1169/2011, Art. 7(3)).
- "foram os Portugueses … os responsáveis pela sua introdução na Europa": inaccurate (cloves reached Europe long before the 16th century through Arab and Venetian trade); rephrased to the Portuguese role in the 16th-century trade.
- "um quilo de cravo-da-Índia tinha o mesmo valor de sete gramas de ouro": no source found; removed.

### PT reescrito (produto)

## Cravinho

O cravinho é o botão da flor do craveiro-da-índia, colhido antes de abrir e depois seco.

É originário das ilhas Molucas, na Indonésia, e hoje cultiva-se em vários países tropicais. No século XVI, os portugueses tiveram um papel central no comércio do cravinho entre o Oriente e a Europa.

De aroma intenso e sabor forte e quente, usa-se em doces e salgados, em marinadas de carne e de caça, para temperar legumes e até para aromatizar licores e sangria.

### EN (product)

## Cloves

A clove is the flower bud of the clove tree, picked before it opens and then dried.

Cloves are native to the Moluccas in Indonesia and are now grown in several tropical countries. In the 16th century the Portuguese played a central part in the clove trade between the East and Europe.

With an intense aroma and a strong, warm taste, cloves go into sweet and savoury dishes, meat and game marinades, vegetables, and even liqueurs and sangria.

### Receita: Peras em calda de vinho do Porto (PT)

Rende: 4 pessoas. Tempo: cerca de 1 hora + algumas horas no frigorífico `[[TBC]]`.

Ingredientes:
- 4 peras
- 100 ml de vinho do Porto (2 cálices) `[[TBC: confirmar conversão]]`
- 400 g de açúcar (2 chávenas) `[[TBC: confirmar conversão]]`
- 500 ml de água (2 chávenas), ou um pouco mais para cobrir as peras `[[TBC: confirmar conversão]]`
- 1 pau de canela Sotocal
- ½ colher de chá (2,5 ml) de cravinho moído Sotocal
- 2 colheres de sopa (30 ml) de mel

Preparação:
1. Num tacho, junte o vinho do Porto, o açúcar, a água, o mel, o cravinho e o pau de canela.
2. Descasque as peras sem tirar o pé e mergulhe-as no tacho. Tape e deixe cozer em lume brando até ficarem tenras, mas ainda firmes. Retire-as para um prato.
3. Deixe a calda ferver em lume médio, sem tampa, até reduzir e começar a engrossar. Volte a pôr as peras e deixe a calda reduzir mais, virando as peras de vez em quando e regando-as com a calda.
4. No fim, a calda deve ficar espessa, quase caramelizada.
5. Passe para uma taça de servir e leve ao frigorífico durante algumas horas, até servir.

### Recipe: Pears poached in port (EN)

Serves 4. Time: about 1 hour plus a few hours chilling.

Ingredients:
- 4 pears
- 100 ml port (2 small glasses)
- 400 g sugar (2 cups)
- 500 ml water (2 cups), or a little more to cover the pears
- 1 Sotocal cinnamon stick
- ½ teaspoon (2.5 ml) Sotocal ground cloves
- 2 tablespoons (30 ml) honey

Method:
1. In a pan, combine the port, sugar, water, honey, cloves and cinnamon stick.
2. Peel the pears, leaving the stalks on, and lower them into the pan. Cover and simmer until tender but still firm. Lift them onto a plate.
3. Boil the syrup over a medium heat, uncovered, until it reduces and starts to thicken. Return the pears and keep reducing, turning and basting them now and then.
4. By the end the syrup should be thick and almost caramelised.
5. Transfer to a serving dish and chill for a few hours before serving.

---

## cominhos.php → `/products/cominhos` and `/blogs/receitas/rojoes`

### PT original

> ## COMINHOS
> Condimento obtido a partir das sementes secas e moídas da planta Cuminum cyminum da família das Apiaceae é utilizado para temperar pratos de carne ,principalmente de porco e na confecção de enchidos.
> ### RECEITA
> Rojões
> Ingredientes:
> 1 kg de carne de porco
> 250 gramas de tripas enfarinhadas
> 1 chouriço de sangue ou sangue cozido
> 1 kg de batatinhas novas
> 2 dentes de alhos
> 1 colher de sobremesa de Colorau Oriente/ Sotocal
> 1 colh. de café de Pimenta Branca moída Oriente/ Sotocal
> 1 colher de café de Cominhos Oriente/ Sotocal
> 2 folhas de louro
> 100 gramas de pingue de porco
> 1/2 copo de vinho ( branco ou tinto )
> 1/2 limão
> sal
> De véspera, corta-se a carne em cubos, e tempera-se com os cominhos, colorau, pimenta, os alhos esmagados, sal e o sumo de limão, louro e o vinho; mistura-se tudo muito bem e deixa-se a marinar 24 horas (durante este tempo deve-se mexer pelo menos 2 vezes).
> Põe-se o pingue num tacho e logo que derreta, deitam-se os rojões que se deixam aloirar de todos os lados.
> Entretanto cozem-se as batatas em água temperada com sal (não cozer muito), retira-se os rojões e colocam-se a aloirar as batatas no mesmo pingue, retire e frite o chouriço de sangue ou o sangue cozido e as tripas enfarinhadas; retire e reserve.
> Volte a por os rojões no pingue adiciona-lhe a marinada em que estiveram, tapa-se o tacho e deixa-se cozer em lume muito brando até estarem bem cozidos.
> Feito isso junte com as batatas, as tripas farinhadas e o chouriço de sangue e ponha numa travessa para servir.

### PT reescrito (produto)

## Cominhos

Os cominhos são as sementes secas e moídas da planta *Cuminum cyminum*, da família das apiáceas. Usam-se para temperar carne, sobretudo de porco, e no fabrico de enchidos.

### EN (product)

## Cumin

Cumin is the dried, ground seed of *Cuminum cyminum*, a plant of the carrot family (Apiaceae). It seasons meat, especially pork, and goes into cured sausages.

### Receita: Rojões (PT)

Rende: `[[TBC: 4 pessoas?]]`. Tempo: 24 h de marinada + cerca de 1 h 30 min `[[TBC]]`.

Ingredientes:
- 1 kg de carne de porco
- 250 g de tripas enfarinhadas
- 1 chouriço de sangue, ou sangue cozido
- 1 kg de batatinhas novas
- 2 dentes de alho
- 1 colher de sobremesa (10 ml) de colorau Sotocal
- 1 colher de café (2,5 ml) de pimenta-branca moída Sotocal
- 1 colher de café (2,5 ml) de cominhos Sotocal
- 2 folhas de louro
- 100 g de pingue de porco
- 100 ml de vinho branco ou tinto (meio copo) `[[TBC: confirmar conversão]]`
- ½ limão
- sal

Preparação:
1. Na véspera, corte a carne em cubos e tempere-a com os cominhos, o colorau, a pimenta, os alhos esmagados, o sal, o sumo de limão, o louro e o vinho. Misture tudo muito bem e deixe marinar 24 horas, mexendo pelo menos 2 vezes.
2. Derreta o pingue num tacho e aloure os rojões de todos os lados.
3. Entretanto, coza as batatas em água com sal, sem as deixar cozer demais.
4. Retire os rojões e aloure as batatas no mesmo pingue. Retire-as e frite o chouriço de sangue (ou o sangue cozido) e as tripas enfarinhadas. Retire e reserve.
5. Volte a pôr os rojões no pingue, junte a marinada, tape o tacho e deixe cozer em lume muito brando até a carne estar bem cozida.
6. Junte as batatas, as tripas e o chouriço de sangue, e sirva numa travessa.

### Recipe: Rojões (Minho-style pork) (EN)

Serves: `[[TBC]]`. Time: 24 h marinating plus about 1 h 30 min.

Ingredients:
- 1 kg pork
- 250 g floured tripe (tripas enfarinhadas)
- 1 blood sausage (chouriço de sangue), or cooked blood
- 1 kg new potatoes
- 2 garlic cloves
- 1 dessertspoon (10 ml) Sotocal colorau (sweet paprika)
- 1 coffee spoon (2.5 ml) Sotocal ground white pepper
- 1 coffee spoon (2.5 ml) Sotocal cumin
- 2 bay leaves
- 100 g pork dripping
- 100 ml white or red wine (half a glass)
- ½ lemon
- salt

Method:
1. The day before, cut the pork into cubes and season with the cumin, paprika, pepper, crushed garlic, salt, lemon juice, bay leaves and wine. Mix well and leave to marinate for 24 hours, stirring at least twice.
2. Melt the dripping in a pan and brown the pork on all sides.
3. Meanwhile, boil the potatoes in salted water, without overcooking them.
4. Take out the pork and brown the potatoes in the same fat. Take them out, then fry the blood sausage (or cooked blood) and the tripe. Set aside.
5. Return the pork to the fat, add the marinade, cover and cook over a very low heat until the meat is tender.
6. Combine with the potatoes, tripe and blood sausage, and serve on a platter.

---

## vantagens.php → `/pages/profissional`

### PT original

> ## VANTAGENS COMPETITIVAS
> A Sotocal é uma empresa portuguesa com mais de 50 anos de existência, por isso com um acumulado património de experiência e saber, e grande tradição.
> Os seus profissionais são de elevada experiência e conhecimento levando a que o seu café mantenha uma elevada qualidade.
> Aposta no apoio aos seus clientes oferecendo através dos seus colaboradores toda a assistência para que tirem sempre o melhor Expresso.
> Os lotes de café Sotocal constituem uma conjugação dos melhores e mais finos cafés arábicas e intensos cafés robustas garantindo um elevado resultado que permite uma optimização do seu negócio.
> O cumprimento de tudo aquilo que se propõe constitui a sua regra.

### PT reescrito

## Porque trabalhar com a Sotocal

- **Há mais de {{ mais_de_anos }} anos no café.** Uma empresa portuguesa com muita experiência, saber e tradição.
- **Profissionais experientes.** É a experiência da nossa equipa que mantém a qualidade do café, lote após lote.
- **Apoio para tirar sempre o melhor expresso.** Os nossos colaboradores dão-lhe toda a assistência, no seu espaço.
- **Lotes que rendem.** Arábicas finos e robustas intensos, combinados para dar um bom resultado na chávena e no seu negócio.
- **Cumprimos o que prometemos.** É a nossa regra.

### EN

## Why work with Sotocal

- **More than {{ mais_de_anos }} years in coffee.** A Portuguese company with deep experience, know-how and tradition.
- **Experienced people.** Our team's experience keeps the coffee consistent, blend after blend.
- **Help to pull a great espresso every time.** Our staff give you full support, on your premises.
- **Blends that work for you.** Fine arabicas and intense robustas, combined to perform in the cup and for your business.
- **We do what we promise.** That is our rule.

---

## expresso.php → `/blogs/guia-do-cafe/como-tirar-o-melhor-expresso` (and the product page "Como preparar" accordion)

### PT original

> ## COMO OBTER O MELHOR EXPRESSO
> Para obter um excelente e cremoso café expresso deve seguir estas regras fundamentais
> Ter sempre atenção à afinação do seu moinho
> - Troque as mós com a frequência necessária (250 em 250kg. aproximadamente).
> - Regule a moagem (mais fina ou mais grossa) de acordo com a humidade ambiente: com mais humidade moagem mais grossa com tempo mais seco moagem mais fina.
> - Controle a dose de café(mínimo 6g por cada bica).
> Proceder à manutenção e limpeza do equipamento
> - Lave diariamente os filtros e porta-filtros, de preferência com produtos especializados para esse fim, de modo a não alterar o gosto do café.
> - Limpe mensalmente o depurador da máquina de café com cerca de 1kg. de sal grosso.
> Mantenha a embalagem de café sempre bem fechada e isolada de todo o produto que emane qualquer cheiro.
> O café tem como característica absorver todos os odores e sabores alheios, alterando desta forma o seu sabor.

### PT reescrito

## Como tirar o melhor expresso

Para um expresso cremoso e equilibrado, siga estas regras.

### Afine o moinho

1. Troque as mós sempre que for preciso: mais ou menos a cada 250 kg de café moído.
2. Ajuste a moagem à humidade do ar. Com mais humidade, moagem mais grossa; com tempo seco, moagem mais fina.
3. Controle a dose: no mínimo 6 g de café por cada bica (ou cimbalino, como se diz no Porto).

### Cuide da máquina

4. Lave os filtros e os porta-filtros todos os dias, de preferência com produtos próprios, para não alterar o sabor do café.
5. Uma vez por mês, limpe o depurador da máquina com cerca de 1 kg de sal grosso.

### Guarde bem o café

6. Mantenha a embalagem sempre bem fechada e longe de produtos com cheiro. O café absorve os odores e os sabores à sua volta, e isso muda o seu sabor.

For the product page accordion "Como preparar", add home methods `[[TBC: Sotocal's recommended dose and grind for moka pot and bean-to-cup machines]]`.

### EN

## How to pull a great espresso

For a creamy, balanced espresso, follow these rules.

### Set up your grinder

1. Replace the burrs whenever needed: roughly every 250 kg of ground coffee.
2. Adjust the grind to the humidity. In damp weather grind coarser; in dry weather grind finer.
3. Control the dose: at least 6 g of coffee per espresso (a "bica" in Lisbon, a "cimbalino" in Porto).

### Look after the machine

4. Wash the filter baskets and portafilters every day, ideally with a dedicated cleaner, so they do not affect the taste of the coffee.
5. Once a month, regenerate the machine's water softener with about 1 kg of coarse salt.

### Store the coffee well

6. Keep the pack tightly closed and away from anything with a smell. Coffee absorbs the smells and flavours around it, and that changes its taste.

---

## melhor-cafe.php → `/pages/a-torra`

### PT original

> ## PORQUE TEMOS O MELHOR CAFÉ ?
> Origens / Blend
> Cada lote resulta da combinação de diferentes origens e tipos de café.
> A qualidade do blend final depende da eficiente conjugação dos diferentes arábicas e robustas, do tipo de tratamento que foi dado a esse café na origem - lavado, semi lavado ou natural - e da selecção da origem dos vários cafés incorporados.
> Torra
> Durante o processo de torra, os grão são submetidos a uma elevada temperatura e mantidos continuadamente em movimento para que fiquem uniformemente torrados.
> Durante o processo, os grãos de café vão aumentar de volume, simultaneamente perder peso, modificar a sua côr e sofrer uma alteração da sua composição.
> Durante a torra ocorre a perda de água, a caramelização dos açucares, os óleos aromáticos são extraídos, substâncias aromáticas são libertadas, certos ácidos são eliminados e outros são potenciados. No final a torra deve ter um aspecto homogéneo.
> O processo de torra é essencial no grau de acidez, aroma e intensidade do sabor do café.
> Na Sotocal, temos muita atenção ao tempo de torra específico para cada Lote, em função do tipo de utilização que o consumidor vai dar a esse café e o método que vai usar para obter a sua bebida.
> Tambem sabemos que é durante a torra que, algumas das substâncias presentes no grão e que são comprovadamente benéficas para a saúde se formam ou potenciam, daí que na Sotocal tenhamos um rigoroso critério e atenção aos tempos, temperaturas e processos de torra; e sabemos fazê-lo há mais de 50 Anos; por isso nós somos exímios e você, nosso consumidor o comprova.

### Removed and why

- "substâncias … comprovadamente benéficas para a saúde": unauthorised health claim (EU 1924/2006).
- The title "Porque temos o melhor café?": unprovable comparative superlative; retitled.

### PT reescrito

## A torra

### Origens e lote

Cada lote Sotocal junta cafés de várias origens e dos dois tipos, arábica e robusta.

A qualidade do lote depende de três escolhas: como se combinam os arábicas e os robustas, como cada café foi tratado na origem (lavado, semilavado ou natural) e de onde vem cada um.

### O que acontece na torra

Na torra, os grãos são aquecidos a alta temperatura e mantidos sempre em movimento, para torrarem por igual.

Pelo caminho, o grão cresce, perde peso, muda de cor e muda de composição. A água evapora, os açúcares caramelizam, os óleos aromáticos vêm à superfície e libertam-se os aromas. Alguns ácidos desaparecem e outros ganham força. No fim, a torra deve ser homogénea.

É na torra que se decide a acidez, o aroma e a intensidade do sabor.

### Como torramos na Sotocal

Cada lote tem o seu tempo de torra, pensado para a forma como o vai usar e para o método com que vai preparar o seu café. Por isso controlamos com rigor os tempos, as temperaturas e cada passo da torra. Fazemo-lo há mais de {{ mais_de_anos }} anos, e a prova está na sua chávena.

Stages for the homepage fold 2 indicator (a real sequence): Grão verde, Secagem, Primeiro crack, Ponto de torra.

### EN

## Our roast

### Origins and blending

Every Sotocal blend combines coffees from several origins and of both types, arabica and robusta.

The quality of a blend depends on three choices: how the arabicas and robustas are combined, how each coffee was processed at origin (washed, semi-washed or natural), and where each one comes from.

### What happens in the roast

During roasting, the beans are heated to a high temperature and kept moving so they roast evenly.

Along the way the bean grows, loses weight, changes colour and changes composition. Water evaporates, sugars caramelise, aromatic oils rise to the surface and the aromas are released. Some acids disappear and others become stronger. At the end, the roast should be even.

The roast decides the acidity, the aroma and the intensity of the flavour.

### How we roast at Sotocal

Each blend has its own roasting time, set for how you will use it and the method you will brew it with. So we keep a close eye on times, temperatures and every step of the roast. We have done this for more than {{ mais_de_anos }} years, and the proof is in your cup.

Stages for fold 2: Green bean, Drying, First crack, Roast point.

---

## profissional.php → `/pages/profissional`

### PT original

> ## PARA ABRIR UM ESTABELECIMENTO
> Senhor Hoteleiro, poderá contar com a Sotocal como seu parceiro de negócio.
> Conferindo-lhe uma excelente relação qualidade/preço que lhe permite obter vantagens competitivas.
> Terá à sua disposição de forma rápida e fácil um profissional da Sotocal para lhe resolver qualquer problema relacionado com o café.
> Será colocado à sua disposição um serviço de assistência técnica aos seus equipamentos hoteleiros, célere e eficaz de forma a que o seu negócio não seja afectado por qualquer avaria verificada.
> Os equipamentos hoteleiros colocados/disponibilizados pela Sotocal no seu estabelecimento comercial mediante o acordo celebrado, serão os adequados garantindo assim que o café obtido terá sempre muito boa qualidade.
> Serão sempre dadas instruções sobre o funcionamento e manutenção dos mesmos para manter a qualidade do expresso e evitar avarias, que se traduzem num prejuízo para o seu negócio.
> A seriedade e rigor no cumprimento dos acordos celebrados constituem um grande desígnio.
> A Sotocal coloca no seu estabelecimento material promocional que lhe proporciona também a si a divulgação e promoção do seu estabelecimento.
> A imagem é sóbria, simples e tradicional.

### PT reescrito

## Para abrir um estabelecimento

Vai abrir um café, um restaurante ou um hotel? Conte com a Sotocal como parceira.

- **Boa relação qualidade-preço**, para ganhar vantagem sobre a concorrência.
- **Um profissional Sotocal sempre à mão**, para resolver depressa qualquer problema com o café.
- **Assistência técnica rápida** aos equipamentos, para uma avaria não parar o seu negócio.
- **Equipamento adequado, colocado mediante acordo**, para o café sair sempre bem.
- **Instruções de funcionamento e manutenção**, para manter a qualidade do expresso e evitar avarias.
- **Material promocional para o seu espaço**, de imagem sóbria, simples e tradicional, que também divulga o seu estabelecimento.

Levamos a sério os acordos que fazemos e cumprimo-los com rigor.

Note: Sotocal does not sell machines (brief §2). Equipment is placed under an agreement; never write "compre a sua máquina".

### EN

## Opening a café or restaurant

Opening a café, restaurant or hotel? Count on Sotocal as your partner.

- **Strong value for money**, to give you an edge over the competition.
- **A Sotocal professional always within reach**, to sort out any coffee problem quickly.
- **Fast technical assistance** for your equipment, so a breakdown does not stop your business.
- **The right equipment, placed under an agreement**, so the coffee always comes out well.
- **Operating and maintenance instructions**, to keep the espresso consistent and avoid breakdowns.
- **Promotional material for your premises**, with a sober, simple, traditional look that also promotes your business.

We take the agreements we make seriously and honour them to the letter.

---

## curiosidades.php → `/blogs/guia-do-cafe/curiosidades-do-cafe`

### PT original

> ## CURIOSIDADES DO CAFÉ
> A primeira referência ao café encontra-se em manuscritos do Iémen onde está narrada a Lenda de Kaldi no ano 575. Kaldi era um pastor de cabras etíope que verificou o efeito estimulante dos frutos no seu rebanho.
> Ele próprio experimentou esses frutos e confirmou os seus efeitos.
> A divulgação deste episódio levou a que se propagasse o consumo.
> Esta notícia chegou então a um mosteiro onde começaram a ser realizadas as primeiras infusões.
> O café terá começado e ser cultivado em mosteiros islâmicos no Iémen.
> Só no século XIV, foi desenvolvido o processo de torrefacção tendo a bebida recebido o nome de kahwah, que significa Força, em árabe.
> O hábito de tomar café, propagou-se a partir de 1450.
> Era a cultura árabe-islâmica a principal consumidora em virtude do Alcorão condenar as bebidas alcoólicas.
> O seu consumo corrente era entre filósofos sufis que ao tomarem café permaneciam acordados para as suas práticas espirituais.
> Foi na Turquia que tomar café se tornou um ritual social. Sendo o Kiva Ham, em Constantinopla o primeiro Café do mundo, foi aberto em 1475.
> Na Europa o café entrou em 1615 por Veneza.
> O Café Florian foi aberto em 1720 na praça San Marco em Veneza, foi um dos primeiros estabelecimentos de café de Itália.
> A primeira máquina de café expresso foi apresentada em 1855 na Exposição Universal de Paris.
> Depois foi desenvolvida pelos italianos.
> Hoje em dia o café é a segunda bebida mais consumida no mundo a seguir á água.
> É a segunda commodity mais transaccionada no mundo a seguir ao petróleo.
> Kopi Luwak – Um café exótico, produzido com o café comido e digerido por um animal, chamado civeta.
> O seu nome deriva do dialecto bahasa da Indonésia: Kopi(café) Luwak(civeta).

### Fact check

| Legacy claim | Verdict | Action | Source |
|---|---|---|---|
| Kaldi legend "no ano 575" in Yemeni manuscripts | Legend. The story first appears in writing in 1671 (Antoine Faustus Nairon, Rome); the year 575 has no documentary basis | Present as legend, no date | https://en.wikipedia.org/wiki/Kaldi |
| Coffee drinking spread from about 1450 among Sufis in Yemen | Broadly supported: the earliest credible evidence of coffee drinking is from 15th-century Sufi monasteries in Yemen | Keep, rephrased | https://en.wikipedia.org/wiki/History_of_coffee |
| Roasting "developed in the 14th century"; "kahwah means strength" | Unsupported/contested. Roasting appears with coffee drinking in the 15th century; the etymology of *qahwa* is debated | Drop the date; say the origin of the word is debated | https://en.wikipedia.org/wiki/History_of_coffee |
| Kiva Han, Constantinople, 1475, "first café in the world" | Tradition, not documented. Coffee reached Istanbul after 1517; coffeehouses are documented from the mid-16th century (Tahtakale, 1554) | Present as tradition, with the documented date | https://www.hurriyetdailynews.com/coffee-and-coffeehouses-among-the-ottomans-76123 |
| Coffee entered Europe via Venice in 1615 | Commonly cited; plausible as "early 17th century" | Soften to "no início do século XVII, por portos como Veneza" | https://en.wikipedia.org/wiki/History_of_coffee |
| Caffè Florian, Piazza San Marco, 1720 | Correct | Keep | https://en.wikipedia.org/wiki/Caff%C3%A8_Florian |
| "First espresso machine" at the 1855 Paris Exposition | Inaccurate. Loysel de Santais showed a large steam/pressure coffee machine at the 1855 Exposition Universelle; it brewed in bulk. The first patented bar machine controlling steam and water separately is Angelo Moriondo's (Turin, 1884); Bezzera's 1901 patents lead to the modern espresso machine | Rephrase as precursor | https://en.wikipedia.org/wiki/Espresso_machine |
| "Second most consumed drink after water" | Disputed (tea is usually cited second) | Remove | |
| "Second most traded commodity after oil" | Myth (brief §3) | Remove | |
| Kopi Luwak | Animal-welfare risk to the brand (brief §3) | Remove | |
| (Legacy tipos-de-cafe) top-3 producers | Brazil, Vietnam, Colombia, confirmed for 2025/26 | Keep | https://www.fas.usda.gov/sites/default/files/2025-12/coffee.pdf |

`[[TBC: editorial check; several sources above are secondary (Wikipedia, press). Replace with primary sources if the article is to be cited by AI assistants]]`

### PT reescrito

## Curiosidades do café

**A lenda de Kaldi.** Conta a lenda que um pastor de cabras etíope, Kaldi, reparou que o rebanho ficava agitado depois de comer os frutos vermelhos de um arbusto, provou-os e sentiu o mesmo. É uma lenda: o primeiro registo escrito desta história é de 1671.

**Os mosteiros do Iémen.** Os primeiros registos fiáveis do café como bebida são do século XV, em mosteiros sufis do Iémen, onde se bebia durante as orações noturnas. Daí, o hábito chegou a Meca e ao Cairo. Em árabe, a bebida chamava-se *qahwa*; a origem da palavra é discutida.

**O café como ritual social.** Foi no Império Otomano que beber café se tornou um ritual social. A tradição diz que o primeiro café do mundo, o Kiva Han, abriu em Constantinopla em 1475; os registos históricos só confirmam casas de café em Istambul a partir de meados do século XVI.

**A chegada à Europa.** O café chegou à Europa no início do século XVII, por portos como Veneza. Em 1720 abriu, na Praça de São Marcos, o Caffè Florian, um dos cafés mais antigos de Itália.

**A máquina.** Na Exposição Universal de Paris, em 1855, Edward Loysel de Santais apresentou uma máquina que fazia grandes quantidades de café com vapor e pressão de água. Era uma antecessora. Em 1884, em Turim, Angelo Moriondo patenteou uma máquina de bar que controlava o vapor e a água em separado, e no início do século XX os italianos criaram a máquina de expresso que hoje conhecemos.

**Quem produz.** Hoje, os maiores produtores de café do mundo são o Brasil, o Vietname e a Colômbia.

**E no Porto?** No Porto, o expresso chama-se cimbalino; em Lisboa, bica. `[[TBC: Sotocal's own account of the word "cimbalino" (usually linked to the La Cimbali machine brand); verify before publishing]]`

### EN

## Coffee facts

**The legend of Kaldi.** Legend has it that an Ethiopian goatherd, Kaldi, noticed his goats grew restless after eating the red fruit of a shrub, tried it himself and felt the same. It is a legend: the story first appears in writing in 1671.

**The monasteries of Yemen.** The earliest reliable records of coffee as a drink date from the 15th century, in Sufi monasteries in Yemen, where it was drunk during night-time prayers. From there it spread to Mecca and Cairo. In Arabic the drink was called *qahwa*; where the word comes from is debated.

**Coffee as a social ritual.** It was in the Ottoman Empire that drinking coffee became a social ritual. Tradition says the world's first coffeehouse, Kiva Han, opened in Constantinople in 1475; historical records only confirm coffeehouses in Istanbul from the mid-16th century.

**Arriving in Europe.** Coffee reached Europe in the early 17th century through ports such as Venice. In 1720 Caffè Florian opened on St Mark's Square, one of the oldest cafés in Italy.

**The machine.** At the 1855 Exposition Universelle in Paris, Edward Loysel de Santais showed a machine that brewed large quantities of coffee with steam and water pressure. It was a forerunner. In 1884, in Turin, Angelo Moriondo patented a bar machine that controlled steam and water separately, and in the early 20th century Italian makers created the espresso machine we know today.

**Who grows it.** Today the world's largest coffee producers are Brazil, Vietnam and Colombia.

**And in Porto?** In Porto an espresso is a "cimbalino"; in Lisbon it is a "bica".

---

## contactos.php → `/pages/contactos`

### PT original

> ## CONTACTOS
> Sotocal – Sociedade Torrefactora De Cafés de Angola, Lda.
> Rua Engenheiro Ferreira Dias, n.º 398
> 4100-246 Porto - Portugal
> NIF: 500 275 068
> T.: 226 167 020
> F.: 226 100 458
> (Chamada para a rede fixa nacional)
> E.: sotocalcafes@sotocalcafes.pt
> Obter indicações
> Para mais informações preencha o formulário em baixo.
> Entraremos em contacto consigo o mais breve possível.
> mensagem

(Form fields: nome, assunto, email, mensagem; button "ENVIAR". "Obter indicações" links to Google Maps for "Rua Engenheiro Ferreira Dias 398, Porto, Portugal".)

### PT reescrito

## Contactos

**Sotocal – Sociedade Torrefactora De Cafés de Angola, Lda.**
Rua Engenheiro Ferreira Dias, n.º 398
4100-246 Porto, Portugal
NIF 500 275 068

Telefone: +351 226 167 020 (chamada para a rede fixa nacional)
Email: sotocalcafes@sotocalcafes.pt
Horário: `[[TBC: opening hours]]`

[Ver no mapa](`[[TBC: canonical Google Maps URL]]`)

Tem uma pergunta? Escreva-nos e respondemos o mais depressa possível. `[[TBC: response time]]`

The fax number is not carried over (not in brief §2) `[[TBC: keep the fax 226 100 458?]]`.

### EN

## Contact

**Sotocal – Sociedade Torrefactora De Cafés de Angola, Lda.**
Rua Engenheiro Ferreira Dias, n.º 398
4100-246 Porto, Portugal
VAT no. PT500275068

Phone: +351 226 167 020 (call to a Portuguese landline)
Email: sotocalcafes@sotocalcafes.pt
Opening hours: `[[TBC]]`

[View on the map]

Have a question? Write to us and we will reply as soon as we can.

---

## Removed claims log (EU 1924/2006 and accuracy)

| Page | Removed | Reason |
|---|---|---|
| cafe-e-a-saude | Alertness, concentration, reaction time, fatigue, physical and mental performance; driving anecdote | Unauthorised function claims; safety risk |
| cafe-e-a-saude | Reduced risk of Alzheimer's, Parkinson's, depression; protection against type 2 diabetes and liver disease | Unauthorised disease-risk-reduction claims |
| cafe-e-a-saude | Attribution of conclusions to EFSA, FDA, CEMBE | Not sourced; replaced by what EFSA actually published |
| cafe-e-a-saude | List of vitamins/proteins | Negligible amounts; reads as a nutrition claim |
| melhor-cafe | "substâncias … comprovadamente benéficas para a saúde" | Unauthorised health claim |
| melhor-cafe | Title "Porque temos o melhor café?" | Unprovable comparative superlative |
| sucedaneos-* | Breakfast and weight control; brain needs carbohydrates; "muita energia"; "nutritivos" | Unauthorised health and nutrition claims |
| cravinho | Analgesic, toothache, bad breath | Medicinal/health claims |
| cravinho | "os Portugueses … responsáveis pela sua introdução na Europa"; "1 kg = 7 g de ouro" | Inaccurate / unsourced |
| piri-piri | "originário da Ásia" | Inaccurate (native to the Americas) |
| curiosidades | Second most consumed drink; second most traded commodity; Kopi Luwak; 1855 "first espresso machine"; dates for Kaldi and Kiva Han as fact | Myths, disputed or welfare risk |
| produtos-super-torrado | "dos melhores cafés Robustas" | Unprovable superlative |

## Facts needing client confirmation

Nothing below is used as fact in the theme until confirmed.

1. ~~**Product names.**~~ Resolved by the client leaflet (29/10/2026): "Lote Super Milano", "Lote Super", "Lote Reggio", "Descafeinado".
2. ~~**Mistura Sako composition.**~~ Confirmed by the client leaflet: 20% café, 80% cereais torrados (cevada, chicória, grão preto). Barley (gluten) confirmed as the only allergen (29/10/2026). Still open: what "grão preto" is and the order of the cereals by weight `[[TBC]]` (client question 49).
3. **Oriente brand.** Spices ("Colorau Oriente/ Sotocal"), Cevada Oriente and the spice packshots carry the brand "Oriente". `[[TBC: is Oriente a Sotocal brand; how should it be named on the shop?]]`
4. **Conservas.** The only legacy content is a packshot of "Atum Gaivota" (posta; posta grande em óleo vegetal). `[[TBC: range, brand ownership, and whether Sotocal produces or distributes]]`
5. **Memberships.** The legacy footer shows "Membro: AICC" (Associação Industrial e Comercial do Café) and a "Confraria do Café" logo. `[[TBC: current AICC membership; is "Confraria do Café" the confraria Maria José Barbosa presided over, and for which years?]]`
6. **Fax** 226 100 458 on the legacy contact page and on the client leaflet. `[[TBC: still in use; keep or drop]]`
7. **1960 market figures** (more than 100 roasters; substitutes about 80% of the market). `[[TBC: keep as company history?]]`
8. **Legal name variant.** The PME Líder 2011 certificate reads "Sotocal - Sociedade Torrefactora de Cafés de Angola, Lda" ("de Angola"); §2, the contact page and projeto.pdf read "Cafés Angola". The theme uses the §2 form. `[[TBC: confirm the registered name]]`
9. **Peanuts and substitutes still roasted in-house** (legacy: "Continua no entanto a torrar Amendoim e Sucedâneos de Café"). `[[TBC: still true?]]`
10. **Teas and infusions range.** The legacy page and the client leaflet list green tea, black tea, chamomile and cidreira. The plant is lemon balm, *Melissa officinalis* (client, 29/10/2026; D52). `[[TBC: range and formats]]`
11. **Decaf unidoses** format (ESE pods?). `[[TBC]]` (also in §2)
12. **Cinnamon species** (Ceylon vs cassia). `[[TBC]]`
13. **EU co-funding publicity.** Vale I&D project no. 18175 (Norte 2020, FEDER), concluded 29/12/2016. `[[TBC: how long the logos must stay]]`
14. **Recipe yields, times, oven temperatures and the cup/glass conversions** marked in each recipe. `[[TBC]]`
15. **"Cimbalino" etymology** for the regional hook. `[[TBC]]`

## Sources

- EFSA, caffeine topic page (quotes the 2015 opinion): https://www.efsa.europa.eu/en/topics/topic/caffeine
- EFSA, Scientific Opinion on the safety of caffeine, EFSA Journal 2015;13(5):4102: https://doi.org/10.2903/j.efsa.2015.4102
- EFSA press release, 27/05/2015: https://www.efsa.europa.eu/en/press/news/150527
- USDA FAS, Coffee: World Markets and Trade, December 2025: https://www.fas.usda.gov/sites/default/files/2025-12/coffee.pdf
- USDA FAS, Coffee: World Markets and Trade, July 2026: https://www.fas.usda.gov/data/coffee-world-markets-and-trade-07222026
- Espresso machine history (Loysel 1855, Moriondo 1884, Bezzera 1901): https://en.wikipedia.org/wiki/Espresso_machine
- Kaldi legend (first written 1671): https://en.wikipedia.org/wiki/Kaldi
- History of coffee (Yemen, 15th century; Venice): https://en.wikipedia.org/wiki/History_of_coffee
- Ottoman coffeehouses (Kiva Han tradition, Tahtakale 1554): https://www.hurriyetdailynews.com/coffee-and-coffeehouses-among-the-ottomans-76123
- Caffè Florian (1720): https://en.wikipedia.org/wiki/Caff%C3%A8_Florian

---

## Microcopy library

Rules: active voice, written from the shopper's side, sentence case, no arrows, no middle dots, no exclamation marks except in success messages. PT is pt-PT (AO90); EN is British English. `{{ }}` marks Liquid variables.

### Buttons and links

| Key | pt-PT | EN |
|---|---|---|
| shop_coffee | Comprar café | Shop coffee |
| add_to_cart | Adicionar ao carrinho | Add to basket |
| adding | A adicionar… | Adding… |
| added | Adicionado ao carrinho | Added to your basket |
| sold_out | Esgotado | Sold out |
| unavailable | Indisponível | Unavailable |
| notify_me | Avise-me quando voltar | Tell me when it is back |
| view_blend | Ver lote | See the blend |
| view_all_blends | Ver todos os lotes | See all blends |
| how_we_roast | Conhecer a torra | How we roast |
| checkout | Finalizar compra | Go to checkout |
| continue_shopping | Continuar a comprar | Keep shopping |
| view_cart | Ver carrinho | View basket |
| remove | Remover | Remove |
| quick_add | Adicionar | Add |
| choose_options | Escolher formato e peso | Choose format and weight |
| request_contact | Pedir contacto comercial | Request a sales call |
| send_lead | Pedir contacto | Request a call |
| subscribe_newsletter | Subscrever | Subscribe |
| show_map | Mostrar mapa | Show map |
| pickup_here | Levantar aqui | Collect here |
| search | Pesquisar | Search |
| close | Fechar | Close |
| menu | Menu | Menu |
| back_to_top | Voltar ao início | Back to top |
| read_more | Ler mais | Read more |
| read_guide | Ler o guia | Read the guide |

(EN uses "basket", the British term; keep "cart" only in code and in the cart icon's accessible name if Jakob's law testing shows confusion `[[TBC]]`.)

### Cart drawer

| Key | pt-PT | EN |
|---|---|---|
| cart_title | O seu carrinho | Your basket |
| cart_count | {{ count }} artigo / {{ count }} artigos | {{ count }} item / {{ count }} items |
| quantity | Quantidade | Quantity |
| decrease | Diminuir a quantidade de {{ product }} | Decrease quantity of {{ product }} |
| increase | Aumentar a quantidade de {{ product }} | Increase quantity of {{ product }} |
| subtotal | Subtotal | Subtotal |
| vat_included | IVA incluído. Portes calculados no passo seguinte. | VAT included. Shipping calculated at checkout. |
| updating | A atualizar o carrinho… | Updating your basket… |
| error_stock | Só temos {{ count }} unidades disponíveis. | We only have {{ count }} in stock. |
| error_generic | Não conseguimos atualizar o carrinho. Tente outra vez. | We could not update your basket. Please try again. |
| upsell_title | Para acompanhar | You might also like |
| upsell_bundle | Leve 2 × 1 kg e poupe {{ amount }} | Take 2 × 1 kg and save {{ amount }} |
| subscription_line | Subscrição: a cada {{ weeks }} semanas | Subscription: every {{ weeks }} weeks |

### Free-shipping progress

| State | pt-PT | EN |
|---|---|---|
| empty | Envio grátis a partir de {{ threshold }}. | Free shipping on orders over {{ threshold }}. |
| progress | Faltam {{ remaining }} para ter envio grátis. | Add {{ remaining }} more for free shipping. |
| almost | Está quase: faltam só {{ remaining }} para o envio grátis. | Nearly there: just {{ remaining }} more for free shipping. |
| reached | O seu envio é grátis. | Your shipping is free. |
| pickup | O levantamento num café Sotocal é sempre grátis. | Collecting at a Sotocal café is always free. |
| announcement | Envio grátis a partir de {{ threshold }} `[[TBC: 40 €]]` | Free shipping over {{ threshold }} |

### Pickup at a Sotocal café

| Key | pt-PT | EN |
|---|---|---|
| toggle_label | Levantar num café Sotocal | Collect at a Sotocal café |
| toggle_hint | Escolha o café onde quer levantar a encomenda. É grátis. | Choose the café where you want to collect your order. It is free. |
| search_label | Procurar café por nome ou localidade | Search cafés by name or town |
| search_placeholder | Ex.: Matosinhos | E.g. Matosinhos |
| results_count | {{ count }} cafés encontrados | {{ count }} cafés found |
| no_results | Não encontrámos cafés com esse nome. Experimente outra localidade. | We could not find a café with that name. Try another town. |
| selected | Vai levantar em: {{ cafe }}, {{ city }} | You will collect at: {{ cafe }}, {{ city }} |
| change | Mudar de café | Change café |
| remembered | Usámos o café que escolheu da última vez. | We have used the café you chose last time. |
| how_it_works | Como funciona o levantamento | How collection works |
| ready_note | Avisamos por email quando a encomenda estiver no café. `[[TBC: confirm the operational flow]]` | We will email you when your order reaches the café. |

### Product page

| Key | pt-PT | EN |
|---|---|---|
| unit_price | {{ price }}/kg | {{ price }}/kg |
| unit_price_label | Preço por quilo | Price per kilo |
| vat_included_short | IVA incluído | VAT included |
| omnibus | Preço mais baixo nos últimos 30 dias: {{ price }} | Lowest price in the last 30 days: {{ price }} |
| from_price | Desde {{ price }} | From {{ price }} |
| purchase_one_time | Compra única | One-off purchase |
| purchase_subscription | Subscrição | Subscription |
| subscription_every | A cada {{ weeks }} semanas | Every {{ weeks }} weeks |
| subscription_saving | Poupa {{ amount }} em cada entrega | Save {{ amount }} on every delivery |
| subscription_terms | Sem compromisso: pode pausar, mudar a frequência ou cancelar quando quiser, na sua conta. `[[TBC: discount and minimum term, if any]]` | No commitment: pause, change the frequency or cancel whenever you like, from your account. |
| grind_once | Escolha o formato uma vez; nós repetimos em cada entrega. | Choose your format once; we repeat it on every delivery. |
| format | Formato | Format |
| format_beans | Grão | Beans |
| format_ground | Moído | Ground |
| weight | Peso | Weight |
| intensity | Intensidade: {{ value }} de 5 | Intensity: {{ value }} out of 5 |
| ideal_for | Ideal para | Best for |
| delivery_promise | Encomende hoje e receba em `[[TBC]]` dias úteis em Portugal continental. | Order today and receive it in `[[TBC]]` working days in mainland Portugal. |
| pickup_link | Prefere levantar num café Sotocal? | Rather collect at a Sotocal café? |
| fic_placeholder | Informação a completar | Information to follow |
| accordion_description | Descrição | Description |
| accordion_origins | Origens e torra | Origins and roast |
| accordion_prepare | Como preparar | How to brew |
| accordion_fic | Informação alimentar | Food information |
| accordion_shipping | Envios e devoluções | Shipping and returns |
| pairs_with | Combina com | Goes well with |
| compare_blends | Compare os lotes | Compare the blends |
| provisional_price | Preço provisório | Provisional price |

### Forms and validation

| Key | pt-PT | EN |
|---|---|---|
| required | Obrigatório | Required |
| optional | Opcional | Optional |
| error_summary | Corrija {{ count }} campo(s) para continuar. | Please fix {{ count }} field(s) to continue. |
| name_missing | Indique o seu nome. | Enter your name. |
| business_missing | Indique o nome do estabelecimento. | Enter the name of your business. |
| type_missing | Escolha o tipo de estabelecimento. | Choose the type of business. |
| town_missing | Indique a localidade. | Enter your town. |
| phone_missing | Indique um telefone para lhe ligarmos. | Enter a phone number so we can call you. |
| phone_invalid | Indique um telefone com 9 dígitos. | Enter a 9-digit Portuguese phone number. |
| email_invalid | Indique um email válido, por exemplo nome@exemplo.pt. | Enter a valid email, for example name@example.com. |
| consent_missing | Para lhe ligarmos, precisamos da sua autorização. | We need your permission before we call you. |
| postal_code_invalid | Indique o código postal no formato 1234-567. | Enter the postcode in the format 1234-567. |
| lead_success | Pedido recebido. Vamos ligar-lhe em breve. `[[TBC: response time]]` | Request received. We will call you soon. |
| lead_consent | Aceito ser contactado pela Sotocal sobre esta proposta. Ler a política de privacidade. | I agree to be contacted by Sotocal about this proposal. Read the privacy policy. |
| contact_success | Mensagem enviada. Respondemos o mais depressa possível. | Message sent. We will reply as soon as we can. |
| server_error | Não conseguimos enviar o pedido. Tente outra vez ou ligue para +351 226 167 020. | We could not send your request. Please try again or call +351 226 167 020. |

Lead form option labels: Tipo: Café, Pastelaria, Restaurante, Hotel, Bar, Outro / Café, Pastry shop, Restaurant, Hotel, Bar, Other. Consumo mensal: Até 10 kg, 10 a 30 kg, 30 a 60 kg, Mais de 60 kg, Não sei / Up to 10 kg, 10 to 30 kg, 30 to 60 kg, More than 60 kg, Not sure. Melhor hora: Manhã, Tarde, Indiferente / Morning, Afternoon, Any time.

### Empty states

| Key | pt-PT | EN |
|---|---|---|
| cart_empty | O seu carrinho está vazio. Que tal começar por um dos nossos lotes? | Your basket is empty. Why not start with one of our blends? |
| collection_empty | Ainda não há produtos nesta coleção. | There are no products in this collection yet. |
| filters_empty | Nenhum produto corresponde aos filtros. Experimente retirar um. | No products match these filters. Try removing one. |
| search_empty | Não encontrámos resultados para «{{ terms }}». Experimente outra palavra. | We found nothing for “{{ terms }}”. Try another word. |
| search_suggest | Pesquisas frequentes: café em grão, café moído, descafeinado, piri-piri | Popular searches: coffee beans, ground coffee, decaf, piri-piri |
| locator_empty | Ainda não temos cafés publicados nesta zona. | We have no cafés listed in this area yet. |
| orders_empty | Ainda não fez nenhuma encomenda. | You have not placed any orders yet. |
| blog_empty | Ainda não há artigos. Volte em breve. | No articles yet. Check back soon. |

### 404 and password page

| Key | pt-PT | EN |
|---|---|---|
| 404_title | Esta chávena está vazia. | This cup is empty. |
| 404_body | A página que procura não existe ou mudou de sítio. Pesquise ou volte aos nossos cafés. | The page you are looking for does not exist or has moved. Search, or go back to our coffee. |
| 404_links | Comprar café / Os lotes / Contactos | Shop coffee / Our blends / Contact |
| password_title | Estamos a torrar. Abrimos em breve. | We are roasting. Opening soon. |
| password_body | Deixe o seu email e avisamos quando a loja abrir. | Leave your email and we will tell you when the shop opens. |
| password_form | Entrar com palavra-passe | Enter with password |
| password_success | Obrigado. Avisamos assim que abrirmos. | Thank you. We will let you know as soon as we open. |

### Cookie banner ("bolacha Maria")

| Key | pt-PT | EN |
|---|---|---|
| title | Uma bolacha com o seu café? | A biscuit with your coffee? |
| body | Usamos cookies para o site funcionar e, com a sua autorização, para medir visitas e mostrar publicidade relevante. Pode mudar de ideias a qualquer momento. | We use cookies to make the site work and, with your permission, to measure visits and show relevant ads. You can change your mind at any time. |
| accept | Aceitar todos | Accept all |
| reject | Rejeitar | Reject |
| choose | Escolher | Choose |
| save | Guardar escolhas | Save choices |
| necessary | Necessários: fazem o site e o carrinho funcionar. Estão sempre ativos. | Necessary: they make the site and basket work. Always on. |
| analytics | Medição: ajudam-nos a perceber como usa o site. | Measurement: they help us understand how you use the site. |
| marketing | Publicidade: mostram-lhe anúncios relevantes noutros sites. | Advertising: they show you relevant ads on other sites. |
| preferences | Preferências: lembram as suas escolhas, como o café de levantamento. | Preferences: they remember your choices, such as your pickup café. |
| footer_link | Preferências de cookies | Cookie preferences |
| saved | Guardámos as suas preferências. | Your preferences are saved. |

### Newsletter

| Key | pt-PT | EN |
|---|---|---|
| title | Receba as novidades da torrefação | News from the roastery |
| body | Novos lotes, receitas e ofertas, no máximo duas vezes por mês. `[[TBC: frequency]]` | New blends, recipes and offers, at most twice a month. |
| email_label | O seu email | Your email |
| consent_note | Enviamos um email para confirmar a subscrição. Pode sair quando quiser. | We will email you to confirm. You can unsubscribe at any time. |
| success | Falta um passo: confirme a subscrição no email que lhe enviámos. | One more step: confirm your subscription in the email we sent you. |
| already | Este email já recebe as nossas novidades. | This email is already subscribed. |

### Accessibility and system strings

| Key | pt-PT | EN |
|---|---|---|
| skip_link | Saltar para o conteúdo | Skip to content |
| cart_link | Carrinho, {{ count }} artigos | Basket, {{ count }} items |
| open_menu | Abrir menu | Open menu |
| close_menu | Fechar menu | Close menu |
| language | Idioma | Language |
| new_window | Abre numa nova janela | Opens in a new window |
| loading | A carregar… | Loading… |
| map_attribution | Mapa © colaboradores do OpenStreetMap | Map © OpenStreetMap contributors |
| map_privacy | O mapa carrega dados do OpenStreetMap. Só o mostramos se pedir. | The map loads data from OpenStreetMap. We only show it if you ask. |
| complaints_book | Livro de Reclamações Eletrónico | Electronic Complaints Book |
| call_cost | (Chamada para a rede fixa nacional) | (Call to a Portuguese landline) |
| updated_on | Atualizado em {{ date }} | Updated on {{ date }} |
| reading_time | {{ minutes }} min de leitura | {{ minutes }} min read |
| eu_funding | Projeto cofinanciado pela União Europeia (Norte 2020, FEDER). Ver ficha do projeto. | Project co-funded by the European Union (Norte 2020, ERDF). See the project sheet. |

# WS12: GEO and off-site

Date: 17/11/2026. A checklist for José and Sotocal; no code. Files: [geo-prompts.md](geo-prompts.md) (20 PT-PT prompts and the test protocol) and [geo-tracking.csv](geo-tracking.csv) (80 empty rows: 20 prompts × 4 engines). I cannot run ChatGPT, Perplexity or Gemini from here, so **no assistant has been tested yet**; the baseline below comes from web search only.

## 1. Baseline (web search, 17/11/2026)

| Query | Result |
|---|---|
| "Sotocal café torrefação Porto" | Only the Portuguese IP office (INPI) trademark records and a business directory (Empresite). No press, no listicle, no Reddit thread, no review. The legacy site itself did not rank in what this tool returned |
| Coffee buying queries (best beans, bean-to-cup, Delta alternatives) | Dominated by DECO PROteste's coffee comparator, supermarket and retailer pages, and Brazilian sites. Sotocal absent |
| Porto coffee roasters | Time Out Porto lists specialty cafés and roasters; Sotocal is not among them (it is a traditional roaster, not specialty) |
| Reddit | The search tool returned nothing from r/cafept; check Reddit directly |

**Entity confusion risk.** Search results for a Porto coffee roaster surface **Sical** (a different Porto coffee company, founded 1947 as an importer, and also a Continente brand). Sotocal's thin web footprint means an assistant could mix the two. The cure is more consistent, independent mentions of the entity statements in `docs/GEO.md`, not a disclaimer.

## 2. Plan by channel

Each item has an owner (José or Sotocal unless stated), a rule, and a time relative to go-live (D84).

| Channel | What | When | Rules |
|---|---|---|---|
| **Entity groundwork** | Wikidata item (statements and references in `docs/GEO.md` section 6), Google Business Profile, Apple Business Connect, Bing Places, directories (WS8), same entity statements everywhere | **Before launch** | One wording; the registered legal name first (Q30); each Wikidata statement needs a reference |
| **DECO PROteste** | Write to ask how products are selected for its coffee tests and whether it takes suggestions (draft below). Its coffee pages include a "Como testamos" page; read it first | Before launch | **Never pay for placement.** Ask, offer samples only if its own process allows, accept the outcome |
| **Reddit** (r/cafept, r/portugal, r/porto) | One **identified** Sotocal account. First read the rules and top threads for two weeks. Then answer real questions (grind, machines, storage) with specifics, including when another product fits better | From two weeks after go-live | Disclose the affiliation in every post; no links unless they answer the question; no second accounts, no friends upvoting, no scripts. Check each subreddit's self-promotion rule before posting |
| **Press and listicles** | Pitch: a family roaster founded in Porto in 1960, the founder still leading it, a historic lead in roasted coffee substitutes, now online. Targets confirmed to exist: 4gnews (it has a guide on bean-to-cup machines), Time Out Porto (cafés and roasters lists). From the brief but **unchecked**: KuantoKusta's blog, NiT | After go-live, with real product pages and prices | Facts only from `docs/GEO.md` and the fact sheet; every date as of the day it was said; no "best" claims; ask for a link to `sotocalcafes.pt` |
| **Reviews** | A post-purchase email asking for a product review (review app) and a Google review link (after the profile exists) | From the first deliveries | Ask everyone, not only happy customers (Google forbids filtering); **never offer anything for a review**; publish negative reviews; no `AggregateRating` until real reviews exist |
| **Monthly GEO test** | The 20 prompts, 4 engines, logged | Baseline before launch, then monthly | Protocol in `geo-prompts.md` |

### Draft messages (PT-PT, for José to send)

**To DECO PROteste (editorial or tests contact)**
> Bom dia. Sou da Sotocal, uma torrefação do Porto fundada em 1960, que vai passar a vender café online. Gostaríamos de saber como a DECO PROteste escolhe os cafés que testa e se aceita sugestões de produtos. Não pedimos destaque nem pagamos por testes. Podemos enviar informação sobre os nossos lotes (composição, formatos, preços) se ajudar. Obrigado.

**Press pitch (short)**
> A Sotocal é uma torrefação portuguesa fundada em 1960, no Porto, e continua a ser uma empresa de família: José Barbosa, um dos sócios fundadores, ainda a lidera. Quatro a cinco anos depois de abrir, era líder de mercado nos sucedâneos torrados em Portugal. Fornece cafés, restaurantes e hotéis do Minho ao Algarve e passa agora a vender online para Portugal, Açores, Madeira e União Europeia. A Sotocal expande-se para um novo mercado depois de os consumidores pedirem para poder comprar o seu café, mesmo sem essa opção. Posso enviar fotografias e falar com a família.

**Review request (after delivery)**
> Olá, {{ nome }}. A sua encomenda Sotocal deve ter chegado. Se quiser, conte-nos como correu: o que escolheu, como o preparou, o que mudaria. A sua opinião, boa ou má, ajuda quem vem a seguir. [ligação para a avaliação do produto] [ligação para o Google]

**Reddit disclosure (first line of each post)**
> Sou da Sotocal, uma torrefação do Porto, por isso tenha isto em conta. Respondendo à pergunta: …

## 3. Review app and structured data

No review app is installed. When one is chosen (decision for José; paid apps need approval), **disable its own JSON-LD** or use the theme's, because the theme already emits Product schema and a second one duplicates it. Add `AggregateRating` and `Review` only from real, post-purchase reviews. EU consumer law (the Omnibus directive) bans fake reviews and expects the shop to say how reviews are checked; have a lawyer confirm the wording of the review page before launch.

## 4. How we know it works

| Signal | Where |
|---|---|
| Named and correct in the 20 prompts | `geo-tracking.csv`, monthly |
| Referrals from `chatgpt.com`, `perplexity.ai`, `gemini.google.com`, `claude.ai`, `copilot.microsoft.com` | Analytics segment, built in WS13 |
| Branded search ("sotocal") and the brand result | Search Console, WS13 |
| New independent mentions (press, directories, Wikidata) | A simple log of URL, date, text |

## 5. Decisions

- **D88 (decided, D104): José and Claude.** Claude drafts, researches and prepares; José approves and sends. Claude cannot post to Reddit or run the assistants from here.
- **Review app:** choose one after launch; I will check how it handles schema before it goes live.
- **Press facts (decided, D103):** all the family facts can be published. The reason for the online launch: expanding into a new market after consumers asked to buy even without the option.
- **Who sends what:** I have not contacted anyone.

# GEO prompts: 20 buyer questions to test every month

Purpose: check whether AI assistants name Sotocal, say true things about it, and cite sources we control or trust. Run in ChatGPT (with search), Perplexity, Gemini and Claude (with search), plus Google's AI Overview or AI Mode for the first five. Log results in [geo-tracking.csv](geo-tracking.csv).

## Protocol

1. **Same conditions each month.** New chat, logged out or a clean profile, interface and search language Portuguese (Portugal), location Portugal. Paste the prompt exactly as written; do not follow up.
2. **Record per prompt and engine:** date; whether Sotocal is named; the position in the answer (first mention, in a list, last); the URLs cited (note which are `sotocalcafes.pt`, which are third parties); the competitors named; whether each fact about Sotocal is correct against the entity statements in `docs/GEO.md` section 1; free notes.
3. **First run: before launch**, as the baseline. Then monthly, in the first week.
4. **A wrong fact is fixed at its source**, not argued with the assistant: the site, Google Business Profile, Wikidata, a directory (see section 3 of the report). Re-test the following month.
5. **Do not influence the answers by repeating prompts or by asking the assistant to remember.** That measures nothing.
6. Every prompt is a real buyer question; none names Sotocal except the last group, which tests brand knowledge.

## The 20 prompts

### Buying coffee beans (5)

1. Qual é o melhor café em grão para máquina automática em Portugal?
2. Qual o melhor café em grão em Portugal? Compara marcas por preço por kg.
3. Onde comprar café em grão de qualidade em Portugal com envio para os Açores e a Madeira?
4. Alternativa ao café Delta em grão: que marcas portuguesas posso experimentar?
5. Quanto custa uma chávena de café em grão comparado com cápsulas em casa?

### Machines and methods (4)

6. Que café devo usar na cafeteira italiana? Qual a moagem certa?
7. Como escolho o café para a minha máquina automática De'Longhi?
8. Café em grão ou café moído: qual compensa mais em casa?
9. Como guardo o café em grão para não perder aroma?

### Substitutes (4)

10. A cevada tem cafeína?
11. A cevada tem glúten? E a chicória?
12. O que é a chicória e como se faz café com chicória?
13. Que marcas portuguesas vendem misturas de café com chicória?

### Roasters, places and gifts (4)

14. Que torrefações tradicionais existem no Porto?
15. Que café servem os cafés do Norte de Portugal?
16. Fornecedor de café com assistência técnica para um restaurante no Porto?
17. Ideias de cabaz de Natal com produtos portugueses e café.

### Brand knowledge (3)

18. O que é a Sotocal?
19. A Sotocal vende café online? Entrega nos Açores e na Madeira?
20. Onde posso beber ou comprar café Sotocal?

## What a good answer looks like

- Prompts 18 to 20: Sotocal is described as a Portuguese coffee roaster founded in Porto in 1960, family-run, supplying cafés, restaurants and hotels and selling online. It is **not** confused with another Porto coffee company founded in 1947 (see the report).
- Prompts 10 to 13: the answer cites a primary source for any fact, and for gluten cites the EU allergen regulation. Sotocal's guides are cited only if they are among the sources the assistant itself prefers.
- Prompts 1 to 5, 14 to 17: Sotocal appears, if at all, because it fits. A mention is not a goal in itself; a wrong claim is worse than none.

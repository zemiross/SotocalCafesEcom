# Christmas 2026: critical path

Decision D84 (17/11/2026, José): try Christmas 2026. **Updated D90: go.** The 1 December checkpoint remains the safety valve. The theme is ready (WS9). What follows is what must be true, in order. **All dates are my proposal, not Sotocal's**; delivery cut-off dates in particular come from Sotocal and its carrier.

| By | Step | Owner | Depends on |
|---|---|---|---|
| Tue 24/11 | Answers on the minimum list: gift box contents, price and photo (Q12); prices for everything in it (Q1); food information (Q3, Q49); shipping rates and times, free-shipping threshold (Q5, Q6); RAL, Livro de Reclamações, policy texts (Q23–Q25); VAT for the islands and the invoicing app (Q28) | Sotocal | nothing |
| Tue 24/11 | Shopify store and dev theme: store owner creates the store and gives CLI or app access (ADMIN-SETUP) | José / Sotocal | nothing |
| Fri 27/11 | Push the theme unpublished; run the dev-store checks (WS1 section 5): robots, hreflang off, JSON-LD, Lighthouse, cart and checkout, contact forms, gift message in checkout | me | store, answers |
| Mon 30/11 | Products live with real prices and food information; remove `preco-provisorio` tags; payments, shipping, taxes, policies, invoicing app; create the two legacy-redirect articles; import redirects; test `/q/` | Sotocal, me | answers |
| Tue 1/12 | **Go / no-go.** Go only if checkout, invoicing, food information and policies are all done and the redirect test passes | José | all above |
| Wed 2/12 to Thu 3/12 | DNS cutover to Shopify, apex primary, `www` redirect; submit the sitemap; keep the old Search Console property | José (approval), Sotocal | go |
| From go-live | Set the two cut-off dates in theme settings; announce | Sotocal | carrier answer |

**If it is a no-go:** set "Época de Natal" to "Sempre desligada", keep the waitlist, and the same setting turns itself on from 1 November 2027. Nothing is rebuilt.

**Risks if rushed:** a first order before the food information, invoicing and returns are right creates the bad reviews the brief warns about. A cutover with failing redirects drops the brand result Sotocal already has (the legacy site is up today).

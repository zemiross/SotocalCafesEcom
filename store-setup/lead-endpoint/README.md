# Lead endpoint (Resend)

Decision D101 (17/11/2026): requests from the business form on `/pages/profissional` are emailed with Resend to someone at Sotocal, with a copy to José. This replaces mailbox forwarding (D86). Only the code is in the repo. **Nothing is deployed, and no secret or address is stored here.**

## How it works

1. The visitor submits the form. `assets/lead-form.js` validates it, then posts the answers as JSON to the service URL (theme setting "Pedidos de contacto"). If the setting is blank, the form posts to Shopify as before.
2. `handler.js` checks the origin, the honeypot, the phone, the consent, and the field lengths, then calls Resend and sends a plain-text email.
3. If the service is down or slow (8 seconds), the form falls back to Shopify's own contact form, so no lead is lost.

Nothing is logged or stored by the service. The email contains the labelled answers (Nome, Estabelecimento, Tipo, Distrito, Localidade, Telefone, Email, Fornecedor atual, Consumo mensal, Melhor hora, Mensagem, Origem).

## Deploy (not done)

Any host that runs the Fetch API works. For a Cloudflare Worker, `export default { fetch }` is already the module format: publish `handler.js` and set the variables below as secrets and variables. Supabase Edge Functions, Vercel and Netlify edge functions need a thin wrapper that calls `handleLead(request, env)`.

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | A Resend API key restricted to sending (secret) |
| `LEAD_FROM` | A sender on a domain verified in Resend, for example `Sotocal <leads@sotocalcafes.pt>` |
| `LEAD_TO` | The Sotocal address that receives leads (open question Q20); several addresses separated by commas |
| `LEAD_CC` | The copy recipient (José); optional |
| `ALLOWED_ORIGINS` | `https://sotocalcafes.pt` (add the dev theme preview origin while testing) |
| `SHOP_FALLBACK_EMAIL` | `sotocalcafes@sotocalcafes.pt`, so the placeholder address used by the Shopify fallback is never used as `reply_to` |

Then paste the service URL into the theme setting "Pedidos de contacto" (Theme settings, group "Pedidos de contacto").

## Before it goes live

- **Verify the sending domain in Resend.** It needs SPF and DKIM records in the DNS of `sotocalcafes.pt`; DNS access is still pending.
- **Rate limiting.** Add a rate-limit rule on the host (for example 5 requests per minute per IP). The honeypot is not enough on its own.
- **Privacy.** Resend and any copy recipient process the lead's name, phone and answers. Name them in the privacy policy, sign a processing agreement where one applies, and check where Resend stores data. Keep the copy recipient only as long as needed.
- **Test.** Send one lead from the dev theme: it must arrive, with the right subject, at both addresses. Then block the service and confirm the Shopify fallback delivers.
- **Consent text.** The form's consent line says the person agrees to be contacted by Sotocal; add that the request is processed by the email service.

## Tests

`node --test store-setup/lead-endpoint/handler.test.mjs` (5 tests, no network). The browser behaviour is covered in `tests/b2b.spec.mjs`.

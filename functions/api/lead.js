// Cloudflare Pages Function: POST /api/lead. Same handler as store-setup/lead-endpoint (emails the B2B form with Resend).
// Variables (RESEND_API_KEY, LEAD_FROM, LEAD_TO, LEAD_CC, ALLOWED_ORIGINS, SHOP_FALLBACK_EMAIL) are set in the Pages project.
// Not deployed. Build the form with: LEAD_ENDPOINT_URL=/api/lead npm run build:static (needs a reviewed privacy policy).
import { handleLead } from '../../store-setup/lead-endpoint/handler.js';

export const onRequest = (context) => handleLead(context.request, context.env);

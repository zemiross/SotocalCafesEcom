// Shopify admin → Settings → Customer events → Add custom pixel → name "Sotocal – eventos do tema".
// Customer privacy: Permission = "Required" with Marketing ticked (and Analytics for the GA4 part);
// Data sale = "Data collected does not qualify as data sale". Then Save and Connect.
//
// Custom pixels run in a sandbox and cannot read theme settings, so IDs are written here (shopify.dev/docs/api/web-pixels-api).
// Replace both IDs before connecting. [[TBC: Meta pixel ID, GA4 measurement ID]]
// The official Facebook & Instagram and Google & YouTube apps keep handling page views, product, cart and
// checkout events (and Meta Conversions API). This pixel only adds the theme's custom events, so nothing is double-counted.

const META_PIXEL_ID = 'META_PIXEL_ID';
const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX';

// --- Meta Pixel (browser) ---
!function (f, b, e, v, n, t, s) {
  if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
  if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
  t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
}(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', META_PIXEL_ID);

// --- GA4 (no page views: the Google & YouTube app already sends them) ---
const gaScript = document.createElement('script');
gaScript.async = true;
gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
document.head.appendChild(gaScript);
window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', GA4_MEASUREMENT_ID, { send_page_view: false });

// --- Mapping ---
// horeca_lead_submitted → Meta "Lead" + GA4 "generate_lead". The payload never contains name, phone or email.
analytics.subscribe('horeca_lead_submitted', (event) => {
  const data = event.customData || {};
  fbq('track', 'Lead', { content_category: 'horeca', content_name: data.type || '' }, { eventID: event.id });
  gtag('event', 'generate_lead', { lead_source: 'horeca_form', establishment_type: data.type || '', monthly_volume: data.monthly_volume || '', district: data.district || '' });
});

// newsletter_signup → custom Meta event (a newsletter sign-up is not an account registration) + GA4 "sign_up".
analytics.subscribe('newsletter_signup', (event) => {
  fbq('trackCustom', 'NewsletterSignup', { location: event.customData?.location || '' }, { eventID: event.id });
  gtag('event', 'sign_up', { method: 'newsletter', location: event.customData?.location || '' });
});

analytics.subscribe('subscription_selected', (event) => {
  gtag('event', 'subscription_selected', { product_handle: event.customData?.product_handle || '' });
});

analytics.subscribe('pickup_cafe_selected', (event) => {
  gtag('event', 'pickup_cafe_selected', { cafe_city: event.customData?.cafe_city || '' });
});

analytics.subscribe('qr_landing_view', (event) => {
  gtag('event', 'qr_landing_view', { qr_source: event.customData?.source || '', qr_cafe: event.customData?.cafe || '' });
});

// Tools (WS6): analytics only; no Meta event, so nothing here counts as a conversion.
analytics.subscribe('calculator_used', (event) => {
  gtag('event', 'calculator_used', { format: event.customData?.format || '' });
});

analytics.subscribe('quiz_completed', (event) => {
  const d = event.customData || {};
  gtag('event', 'quiz_completed', { machine: d.machine || '', milk: Boolean(d.milk), decaf: Boolean(d.decaf), recommended: d.recommended || '' });
});

// Click and collect orders by pickup point (WS13). The cart keeps pickup_cafe_* as cart attributes, which become order attributes.
// Whether Shopify exposes checkout attributes to this event is unverified: the handler is guarded and sends nothing if they are absent.
// The reliable report is the order export (additional details, pickup_cafe_id).
analytics.subscribe('checkout_completed', (event) => {
  const checkout = event.data?.checkout || {};
  const attrs = Array.isArray(checkout.attributes) ? checkout.attributes : [];
  const get = (key) => attrs.find((a) => a.key === key)?.value || '';
  const cafe = get('pickup_cafe_id');
  if (!cafe) return;
  gtag('event', 'pickup_order', { cafe_id: cafe, cafe_city: get('pickup_cafe_city'), transaction_id: checkout.order?.id || '' });
});

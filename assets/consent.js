/* Cookie consent (brief §9): Shopify Customer Privacy API.
   Shopify.loadFeatures(consent-tracking-api) → customerPrivacy.shouldShowBanner() → setTrackingConsent({...}).
   Choices: accept all, reject all (necessary only), or choose per purpose. Nothing is pre-ticked. */
(() => {
  const S = window.Sotocal;
  const banner = document.getElementById('consent-banner');
  if (!S || !banner || S.consent) return;
  const prefs = banner.querySelector('[data-consent-prefs]');
  const chooseBtn = banner.querySelector('[data-consent="choose"]');

  const api = () => new Promise((resolve, reject) => {
    if (window.Shopify?.customerPrivacy) { resolve(window.Shopify.customerPrivacy); return; }
    if (!window.Shopify?.loadFeatures) { reject(new Error('Customer Privacy API unavailable')); return; }
    window.Shopify.loadFeatures([{ name: 'consent-tracking-api', version: '0.2' }], (error) => {
      if (error) reject(error); else resolve(window.Shopify.customerPrivacy);
    });
  });

  const show = (withPrefs = false) => {
    banner.hidden = false;
    prefs.hidden = !withPrefs;
    chooseBtn.setAttribute('aria-expanded', String(withPrefs));
  };
  const hide = () => { banner.hidden = true; };
  const save = (consent) => api().then((cp) => new Promise((resolve) => {
    cp.setTrackingConsent({ ...consent, sale_of_data: consent.marketing }, () => resolve());
  })).catch(() => {}).finally(hide);

  banner.addEventListener('click', (e) => {
    const action = e.target.closest('[data-consent]')?.dataset.consent;
    if (action === 'accept') save({ analytics: true, marketing: true, preferences: true });
    if (action === 'reject') save({ analytics: false, marketing: false, preferences: false });
    if (action === 'choose') { show(prefs.hidden); if (!prefs.hidden) prefs.querySelector('[data-consent-pref]')?.focus(); }
  });
  prefs.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = (name) => !!prefs.querySelector(`[name="${name}"]`)?.checked;
    save({ analytics: v('analytics'), marketing: v('marketing'), preferences: v('preferences') });
  });

  S.consent = {
    open() {
      api().then((cp) => {
        const set = (name, value) => { const el = prefs.querySelector(`[name="${name}"]`); if (el) el.checked = !!value; };
        set('analytics', cp.analyticsProcessingAllowed?.());
        set('marketing', cp.marketingAllowed?.());
        set('preferences', cp.preferencesProcessingAllowed?.());
      }).catch(() => {}).finally(() => { show(true); banner.querySelector('h2')?.setAttribute('tabindex', '-1'); banner.querySelector('h2')?.focus(); });
    },
  };

  api().then((cp) => { if (cp.shouldShowBanner?.()) show(false); }).catch(() => { /* outside Shopify: nothing to do */ });
})();

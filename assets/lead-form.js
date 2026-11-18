/* HoReCa lead form: inline validation with specific messages, honeypot, email fallback, success event. */
(() => {
  const S = window.Sotocal;
  const form = document.querySelector('[data-lead-form]');
  if (!S || !form || form.dataset.wired) return;
  form.dataset.wired = '1';
  const pt = (S.locale || '').startsWith('pt');
  const msg = {
    name: pt ? 'Indique o seu nome.' : 'Please enter your name.',
    phone: pt ? 'Indique um telefone com 9 dígitos, por exemplo 912 345 678.' : 'Enter a 9-digit Portuguese phone number, for example 912 345 678.',
    email: pt ? 'Indique um email válido, por exemplo nome@exemplo.pt.' : 'Enter a valid email, for example name@example.com.',
    consent: pt ? 'Para lhe ligarmos, precisamos da sua autorização.' : 'We need your permission to call you.',
  };

  const success = document.querySelector('[data-lead-success]');
  if (success) {
    success.focus();
    // Non-personal answers saved at submit (never name, phone or email).
    let saved = {};
    try { saved = JSON.parse(sessionStorage.getItem('sotocal:lead') || '{}'); sessionStorage.removeItem('sotocal:lead'); } catch (e) { /* storage blocked */ }
    S.publish('horeca_lead_submitted', { source: location.pathname, type: saved.type || '', district: saved.district || '', monthly_volume: saved.volume || '' });
    return;
  }
  document.querySelector('[data-lead-errors]')?.focus();

  // Postel: accept "+351 912 345 678", "912.345.678", "00351912345678".
  const digits = (v) => v.replace(/[^\d+]/g, '').replace(/^(\+|00)351/, '');
  const rules = {
    LeadName: (el) => (el.value.trim() ? '' : msg.name),
    LeadPhone: (el) => (/^[29]\d{8}$/.test(digits(el.value)) ? '' : msg.phone),
    LeadEmail: (el) => (!el.value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim()) ? '' : msg.email),
    LeadConsent: (el) => (el.checked ? '' : msg.consent),
  };
  const check = (el) => {
    const rule = rules[el.id];
    if (!rule) return true;
    const error = rule(el);
    const out = document.getElementById(`${el.id}-error`);
    el.setAttribute('aria-invalid', String(!!error));
    if (out) { out.textContent = error; out.hidden = !error; }
    return !error;
  };
  form.addEventListener('blur', (e) => { if (e.target.id in rules && e.target.value !== '') check(e.target); }, true);
  form.addEventListener('change', (e) => { if (e.target.id === 'LeadConsent') check(e.target); });
  form.addEventListener('submit', (e) => {
    if (form.querySelector('[name="contact[website]"]')?.value) { e.preventDefault(); return; } // honeypot
    const invalid = Object.keys(rules).map((id) => document.getElementById(id)).filter((el) => el && !check(el));
    if (invalid.length) { e.preventDefault(); invalid[0].focus(); return; }
    const email = form.querySelector('#LeadEmail');
    const endpoint = form.dataset.endpoint;
    // Shopify's contact form needs an email; the emailed-lead service does not.
    if (email && !email.value.trim() && !endpoint) email.value = 'sotocalcafes@sotocalcafes.pt';
    const phone = form.querySelector('#LeadPhone');
    if (phone) phone.value = digits(phone.value);
    try {
      sessionStorage.setItem('sotocal:lead', JSON.stringify({
        type: form.querySelector('#LeadType')?.value || '', district: form.querySelector('#LeadDistrict')?.value || '', volume: form.querySelector('#LeadVolume')?.value || '',
      }));
    } catch (e) { /* storage blocked */ }
    if (endpoint) {
      // Emailed through the lead service (Resend). If it fails, fall back to Shopify's own form so no lead is lost.
      e.preventDefault();
      const payload = {};
      new FormData(form).forEach((v, k) => { const m = k.match(/^contact\[(.+)\]$/); if (m) payload[m[1]] = String(v); });
      const button = form.querySelector('[type="submit"]');
      if (button) button.disabled = true;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal, credentials: 'omit' })
        .then((r) => { if (!r.ok) throw new Error('lead service ' + r.status); return r.json(); })
        .then(() => {
          clearTimeout(timer);
          let saved = {};
          try { saved = JSON.parse(sessionStorage.getItem('sotocal:lead') || '{}'); sessionStorage.removeItem('sotocal:lead'); } catch (err) { /* storage blocked */ }
          const ok = document.createElement('div');
          ok.className = 'form-status'; ok.setAttribute('role', 'status'); ok.tabIndex = -1; ok.setAttribute('data-lead-success', ''); ok.textContent = form.dataset.success || '';
          form.replaceChildren(ok); ok.focus();
          S.publish('horeca_lead_submitted', { source: location.pathname, type: saved.type || '', district: saved.district || '', monthly_volume: saved.volume || '' });
        })
        .catch(() => {
          clearTimeout(timer);
          if (form.dataset.static === 'true') {
            // Static site: there is no Shopify form to fall back to, so say how to reach Sotocal.
            if (button) button.disabled = false;
            let fail = form.querySelector('[data-lead-fail]');
            if (!fail) { fail = document.createElement('p'); fail.className = 'form-status'; fail.tabIndex = -1; fail.setAttribute('role', 'alert'); fail.setAttribute('data-lead-fail', ''); form.prepend(fail); }
            fail.textContent = pt ? 'Não foi possível enviar o pedido. Ligue-nos para +351 226 167 020 ou escreva para sotocalcafes@sotocalcafes.pt.' : 'We could not send your request. Call +351 226 167 020 or write to sotocalcafes@sotocalcafes.pt.';
            fail.focus();
            return;
          }
          delete form.dataset.endpoint;
          if (email && !email.value.trim()) email.value = 'sotocalcafes@sotocalcafes.pt';
          if (button) button.disabled = false;
          form.submit();
        });
    }
  });
})();

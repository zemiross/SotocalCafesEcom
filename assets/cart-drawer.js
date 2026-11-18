/* Cart drawer (brief §8, §9). Optimistic add-to-cart (Doherty: feedback < 400 ms), Section Rendering API refresh,
   quantity changes, café pickup saved as cart attributes and remembered in localStorage (Tesler). */
(() => {
  const S = window.Sotocal;
  if (!S) return;
  const SECTION = 'cart-drawer';
  const PICKUP_KEY = 'sotocal:pickup';
  const drawer = () => document.getElementById('cart-drawer');
  const status = (msg) => { const el = document.querySelector('[data-cart-status]'); if (el) el.textContent = msg; };

  const setCount = (count) => {
    document.querySelectorAll('[data-cart-count]').forEach((el) => { el.textContent = count; el.dataset.count = count; });
  };

  const render = (sections) => {
    const html = sections?.[SECTION];
    if (!html) return;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const fresh = doc.querySelector('[data-cart-drawer-inner]');
    const current = document.querySelector('[data-cart-drawer-inner]');
    if (fresh && current) current.replaceWith(fresh);
    const count = fresh?.querySelector('[data-cart-drawer-count]')?.textContent.replace(/\D/g, '');
    if (count !== undefined) setCount(count || 0);
    restorePickup();
  };

  const post = async (url, body) => {
    const res = await fetch(`${url}.js`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      body: JSON.stringify({ ...body, sections: SECTION, sections_url: location.pathname }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.description || data.message || S.strings?.error || 'Error');
    return data;
  };

  const open = (opener) => { const d = drawer(); if (d) S.openDialog(d, opener); };
  S.cart = { open, render };

  // Open from the header cart icon (the link still works without JS).
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-cart-open]');
    if (link && drawer()) { e.preventDefault(); open(link); }
  });

  // Add to cart: any form with data-cart-add or the product form.
  document.addEventListener('submit', async (e) => {
    const form = e.target.closest('form[data-cart-add]');
    if (!form) return;
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const fd = new FormData(form);
    const item = { id: Number(fd.get('id')), quantity: Number(fd.get('quantity') || 1) };
    const plan = fd.get('selling_plan');
    if (plan) item.selling_plan = Number(plan);
    const props = {};
    for (const [k, v] of fd.entries()) { const m = k.match(/^properties\[(.+)\]$/); if (m && v) props[m[1]] = v; }
    if (Object.keys(props).length) item.properties = props;

    // Optimistic feedback: busy button, count bump, drawer opens at once.
    btn?.classList.add('is-loading'); btn?.setAttribute('aria-busy', 'true');
    const countEl = document.querySelector('[data-cart-count]');
    const before = Number(countEl?.dataset.count || 0);
    setCount(before + item.quantity);
    open(btn);
    status(S.strings?.loading || '');
    try {
      const data = await post(S.routes.cartAdd, { items: [item] });
      render(data.sections);
      status(S.strings?.added || '');
      if (plan) S.publish('subscription_selected', { variant_id: item.id, selling_plan: item.selling_plan });
    } catch (err) {
      setCount(before);
      status(err.message);
      const body = document.querySelector('#cart-drawer .side-drawer__body');
      if (body) { const p = document.createElement('p'); p.className = 'form-status'; p.setAttribute('role', 'alert'); p.textContent = err.message; body.prepend(p); }
    } finally {
      btn?.classList.remove('is-loading'); btn?.removeAttribute('aria-busy');
      form.closest('dialog.quick-add__panel')?.close();
    }
  });

  // Quantity buttons, inputs and remove.
  const change = async (line, quantity) => {
    const row = document.querySelector(`.cart-line[data-line="${line}"]`);
    row?.classList.add('is-updating');
    try { render((await post(S.routes.cartChange, { line: Number(line), quantity: Math.max(0, quantity) })).sections); }
    catch (err) { status(err.message); row?.classList.remove('is-updating'); }
  };
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#cart-drawer [data-qty-change]');
    if (btn) change(btn.dataset.lineIndex, Number(btn.dataset.qtyChange));
  });
  document.addEventListener('change', (e) => {
    const input = e.target.closest('#cart-drawer [data-qty-input]');
    if (input) change(input.dataset.lineIndex, Number(input.value));
  });

  /* ---------- Café pickup ---------- */
  const saveAttrs = async (cafe) => {
    const attributes = cafe
      ? { pickup_cafe_id: cafe.id, pickup_cafe_name: cafe.name, pickup_cafe_city: cafe.city }
      : { pickup_cafe_id: '', pickup_cafe_name: '', pickup_cafe_city: '' };
    try { render((await post(S.routes.cartUpdate, { attributes })).sections); } catch (err) { status(err.message); }
  };
  document.addEventListener('change', (e) => {
    const toggle = e.target.closest('[data-pickup-toggle]');
    if (toggle) {
      const panel = document.querySelector('[data-pickup-panel]');
      if (panel) panel.hidden = !toggle.checked;
      if (!toggle.checked) { S.store.set(PICKUP_KEY, ''); saveAttrs(null); }
      else document.querySelector('[data-pickup-search]')?.focus();
      return;
    }
    const radio = e.target.closest('[data-pickup-list] input[type="radio"]');
    if (radio) {
      const cafe = { id: radio.value, name: radio.dataset.name, city: radio.dataset.city };
      S.store.set(PICKUP_KEY, JSON.stringify(cafe));
      S.publish('pickup_cafe_selected', { cafe_id: cafe.id, cafe_city: cafe.city });
      saveAttrs(cafe);
    }
  });
  document.addEventListener('input', (e) => {
    const search = e.target.closest('[data-pickup-search]');
    if (!search) return;
    const q = search.value.trim().toLowerCase();
    document.querySelectorAll('[data-pickup-list] li[data-search-text]').forEach((li) => { li.hidden = q && !li.dataset.searchText.includes(q); });
  });
  // Remembered choice: re-apply it when the cart has none (Tesler: the system remembers the café).
  let restoring = false;
  function restorePickup() {
    const toggle = document.querySelector('[data-pickup-toggle]');
    if (!toggle || toggle.checked || restoring) return;
    let saved = null;
    try { saved = JSON.parse(S.store.get(PICKUP_KEY) || 'null'); } catch (e) { saved = null; }
    if (!saved?.id) return;
    const radio = document.querySelector(`[data-pickup-list] input[value="${CSS.escape(saved.id)}"]`);
    if (!radio) return;
    restoring = true;
    toggle.checked = true; radio.checked = true;
    document.querySelector('[data-pickup-panel]')?.removeAttribute('hidden');
    saveAttrs(saved).finally(() => { restoring = false; });
  }
  addEventListener('DOMContentLoaded', restorePickup);
  if (document.readyState !== 'loading') restorePickup();
})();

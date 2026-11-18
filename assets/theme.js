/* Sotocal theme boot: motion loader, header, dialogs, mega menu, announcement, offscreen pausing, events.
   Everything renders complete without JS; this file only adds behaviour. Passive listeners only. */
(() => {
  const S = (window.Sotocal = window.Sotocal || {});
  const root = document.documentElement;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
  };
  S.store = store;
  S.$ = $; S.$$ = $$;

  S.idle = (fn) => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 2000 }) : setTimeout(fn, 200));
  S.afterLoad = (fn) => (document.readyState === 'complete' ? S.idle(fn) : addEventListener('load', () => S.idle(fn), { once: true }));

  /* ---------- Script loader + motion (GSAP is never loaded for reduced-motion visitors, D10) ---------- */
  const scripts = {};
  S.loadScript = (src) => (scripts[src] ||= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.async = false;
    s.onload = resolve; s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.append(s);
  }));
  S.loadStyle = (href) => (scripts[href] ||= new Promise((resolve) => {
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = href; l.onload = resolve; l.onerror = resolve;
    document.head.append(l);
  }));
  const reduceMq = matchMedia('(prefers-reduced-motion: reduce)');
  S.reducedMotion = () => reduceMq.matches;
  S.motion = () => {
    if (!root.classList.contains('motion-ok')) return Promise.reject(new Error('reduced motion'));
    if (!S._motion) {
      const a = S.assets || {};
      const timeout = new Promise((_, reject) => S.afterLoad(() => setTimeout(() => reject(new Error('motion timeout')), 8000)));
      // Motion is not needed for the first paint: fetch and set up GSAP after `load` + idle, so it never
      // competes with the LCP image or the first layout (the hero intro waits for load anyway).
      const afterLoad = new Promise((resolve) => S.afterLoad(resolve));
      S._motion = afterLoad.then(() => Promise.race([
        S.loadScript(a.gsap).then(() => S.loadScript(a.scrollTrigger)),
        timeout,
      ])).then(() => {
        window.gsap.registerPlugin(window.ScrollTrigger);
        window.ScrollTrigger.config({ ignoreMobileResize: true });
        return window.gsap;
      }).catch((err) => {
        root.classList.remove('motion-ok'); // fall back to the complete static state
        throw err;
      });
    }
    return S._motion;
  };
  // A preference change mid-visit: switching to reduced motion reloads the static state.
  reduceMq.addEventListener?.('change', (e) => { if (e.matches) root.classList.remove('motion-ok'); });


  /* ---------- Analytics: custom events through Shopify Customer Events (§9) ---------- */
  S.publish = (name, data = {}) => {
    try { window.Shopify?.analytics?.publish?.(name, data); } catch (e) { /* not available in preview */ }
    document.dispatchEvent(new CustomEvent(`sotocal:${name}`, { detail: data }));
  };

  /* ---------- Header: stuck state + theme follows the fold underneath ---------- */
  const header = $('[data-header]');
  if (header) {
    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:80px;left:0;width:1px;height:1px;pointer-events:none';
    document.body.prepend(sentinel);
    new IntersectionObserver(([e]) => header.classList.toggle('is-stuck', !e.isIntersecting)).observe(sentinel);

    const folds = $$('main [data-theme], .site-footer[data-theme]').filter((el) => !el.closest('[data-header]') && !el.closest('dialog'));
    const headerH = () => header.offsetHeight || 64;
    let io;
    const observeFolds = () => {
      io?.disconnect();
      const h = headerH();
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) header.dataset.theme = e.target.dataset.theme; });
      }, { rootMargin: `-${Math.round(h / 2)}px 0px -${Math.max(0, innerHeight - Math.round(h / 2) - 1)}px 0px` });
      folds.forEach((f) => io.observe(f));
    };
    if (folds.length) {
      observeFolds();
      let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(observeFolds, 200); }, { passive: true });
    }
  }

  /* ---------- Dialogs (menu drawer, search, cart, quick add) ---------- */
  const openers = new WeakMap();
  S.openDialog = (dialog, opener) => {
    if (!dialog || dialog.open) return;
    openers.set(dialog, opener || document.activeElement);
    dialog.showModal();
    root.classList.add('has-modal');
    $$(`[aria-controls="${dialog.id}"]`).forEach((b) => b.setAttribute('aria-expanded', 'true'));
  };
  S.closeDialog = (dialog) => { if (dialog?.open) dialog.close(); };
  document.addEventListener('close', (e) => {
    const d = e.target;
    if (!(d instanceof HTMLDialogElement)) return;
    if (!document.querySelector('dialog[open]')) root.classList.remove('has-modal');
    $$(`[aria-controls="${d.id}"]`).forEach((b) => b.setAttribute('aria-expanded', 'false'));
    const opener = openers.get(d);
    if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
  }, true);
  document.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('[data-dialog-close]');
    if (closeBtn) { S.closeDialog(closeBtn.closest('dialog')); return; }
    // A click on the ::backdrop reports the dialog itself as the target, outside its box.
    if (e.target instanceof HTMLDialogElement && e.target.open) {
      const r = e.target.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) S.closeDialog(e.target);
    }
    const quick = e.target.closest('[data-quick-add-open]');
    if (quick) S.openDialog(document.getElementById(quick.dataset.quickAddOpen), quick);
    const menuBtn = e.target.closest('[data-menu-open]');
    if (menuBtn) S.openDialog($('#menu-drawer'), menuBtn);
    const searchBtn = e.target.closest('[data-search-open]');
    if (searchBtn) {
      S.openDialog($('#search-dialog'), searchBtn);
      $('#SearchInput')?.focus();
      if (S.assets?.search) S.loadScript(S.assets.search);
    }
  });
  // Close the mobile drawer if the layout grows to desktop.
  matchMedia('(min-width: 1024px)').addEventListener?.('change', (e) => { if (e.matches) S.closeDialog($('#menu-drawer')); });

  /* ---------- Mega menu (disclosure pattern) ---------- */
  const megaItems = $$('[data-mega]');
  const closeMega = (except) => megaItems.forEach((item) => {
    if (item === except) return;
    const btn = $('button[aria-controls]', item);
    const panel = btn && document.getElementById(btn.getAttribute('aria-controls'));
    if (btn && panel) { btn.setAttribute('aria-expanded', 'false'); panel.hidden = true; }
  });
  megaItems.forEach((item) => {
    const btn = $('button[aria-controls]', item);
    const panel = btn && document.getElementById(btn.getAttribute('aria-controls'));
    if (!btn || !panel) return;
    const open = () => { closeMega(item); btn.setAttribute('aria-expanded', 'true'); panel.hidden = false; header?.classList.add('is-open'); };
    const close = () => { btn.setAttribute('aria-expanded', 'false'); panel.hidden = true; header?.classList.remove('is-open'); };
    btn.addEventListener('click', () => (btn.getAttribute('aria-expanded') === 'true' ? close() : open()));
    item.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { close(); btn.focus(); } });
    item.addEventListener('focusout', (e) => { if (!item.contains(e.relatedTarget)) close(); });
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
      let t;
      item.addEventListener('pointerenter', () => { clearTimeout(t); t = setTimeout(open, 120); });
      item.addEventListener('pointerleave', () => { clearTimeout(t); t = setTimeout(close, 200); });
    }
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('[data-mega]')) closeMega(); });

  /* ---------- Announcement bar ---------- */
  const bar = $('[data-announcement]');
  if (bar) {
    const key = `sotocal:announcement:${bar.dataset.key}`;
    if (store.get(key) === 'dismissed') bar.hidden = true;
    $('[data-announcement-close]', bar)?.addEventListener('click', () => { bar.hidden = true; store.set(key, 'dismissed'); });
  }

  /* ---------- Pause offscreen loops (sheen, ripples) ---------- */
  const loops = $$('[data-stream], [data-cup]');
  if (loops.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle('is-offscreen', !e.isIntersecting)), { rootMargin: '100px 0px' });
    loops.forEach((el) => io.observe(el));
  }

  /* ---------- Form success events ---------- */
  if ($('[data-newsletter-success]')) {
    S.publish('newsletter_signup', { source: location.pathname });
    $('[data-newsletter-success]').focus?.({ preventScroll: false });
  }

  /* ---------- Consent banner: load after the page is idle ---------- */
  S.afterLoad(() => { if (S.assets?.consent && document.getElementById('consent-banner')) S.loadScript(S.assets.consent); });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-consent-open]')) return;
    S.loadScript(S.assets.consent).then(() => S.consent?.open());
  });
})();

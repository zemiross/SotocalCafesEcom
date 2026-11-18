/* Fold 3, four blends (brief §7).
   - Desktop + motion: pinned for n × step_vh; the active blend crossfades in (6° settle, 24 px travel), its details swap
     with a mask reveal; progress buttons scroll to a step; focusing an inactive blend scrolls to it (no keyboard trap, D12).
   - Desktop + reduced motion: no pin; buttons switch instantly; inactive blends are hidden="until-found" (D11).
   - Mobile: scroll-snap carousel; buttons scroll to the card; the visible card marks its button.
   - No JS: all four stacked (CSS default). */
(() => {
  const S = window.Sotocal;
  const section = document.querySelector('[data-motion="blends"]');
  if (!S || !section || section.dataset.wired) return;
  section.dataset.wired = '1';

  const list = section.querySelector('[data-blends-list]');
  const pin = section.querySelector('[data-blends-pin]');
  const blends = [...section.querySelectorAll('[data-blend]')];
  const steps = [...section.querySelectorAll('[data-blend-step]')];
  const n = blends.length;
  if (!n) return;
  const desktopMq = matchMedia('(min-width: 1024px)');
  let active = 0;
  let teardown = () => {};

  const press = (i) => steps.forEach((b, j) => b.setAttribute('aria-pressed', String(i === j)));
  const mark = (i) => blends.forEach((b, j) => b.classList.toggle('is-active', i === j));

  /* ---------- Mobile carousel ---------- */
  const setupCarousel = () => {
    section.classList.remove('is-stacked', 'is-tabs');
    blends.forEach((b) => b.removeAttribute('hidden'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { active = blends.indexOf(e.target); press(active); } });
    }, { root: list, threshold: 0.6 });
    blends.forEach((b) => io.observe(b));
    const onClick = (e) => {
      const btn = e.target.closest('[data-blend-step]');
      if (!btn) return;
      const i = Number(btn.dataset.blendStep);
      list.scrollTo({ left: blends[i].offsetLeft - list.offsetLeft, behavior: S.reducedMotion() ? 'auto' : 'smooth' });
      press(i);
    };
    section.addEventListener('click', onClick);
    return () => { io.disconnect(); section.removeEventListener('click', onClick); };
  };

  /* ---------- Desktop tabs (reduced motion) ---------- */
  const setupTabs = () => {
    section.classList.remove('is-stacked');
    section.classList.add('is-tabs');
    const show = (i) => {
      active = i;
      blends.forEach((b, j) => { if (j === i) b.removeAttribute('hidden'); else b.setAttribute('hidden', 'until-found'); });
      press(i); mark(i);
    };
    const onClick = (e) => { const btn = e.target.closest('[data-blend-step]'); if (btn) show(Number(btn.dataset.blendStep)); };
    const onMatch = (e) => { const i = blends.indexOf(e.target.closest('[data-blend]')); if (i > -1) show(i); };
    section.addEventListener('click', onClick);
    blends.forEach((b) => b.addEventListener('beforematch', onMatch));
    show(active);
    return () => {
      section.removeEventListener('click', onClick);
      blends.forEach((b) => { b.removeEventListener('beforematch', onMatch); b.removeAttribute('hidden'); });
      section.classList.remove('is-tabs');
    };
  };

  /* ---------- Desktop pinned (motion) ---------- */
  const setupPinned = (gsap) => {
    const ST = window.ScrollTrigger;
    const stepVh = parseFloat(getComputedStyle(section).getPropertyValue('--step-vh')) || 70;
    const stepPx = () => (innerHeight * stepVh) / 100;
    section.classList.add('is-stacked');
    const ctx = gsap.context(() => {
      blends.forEach((b, i) => {
        gsap.set(b.querySelector('.blend__media'), { opacity: i === 0 ? 1 : 0, y: 0, rotation: 0 });
        gsap.set(b.querySelector('.blend__text'), { opacity: i === 0 ? 1 : 0 });
      });
    }, section);
    active = 0; mark(0); press(0);

    const go = (i) => {
      if (i === active) return;
      const prev = blends[active];
      const next = blends[i];
      const dir = i > active ? 1 : -1;
      active = i; mark(i); press(i);
      const pm = prev.querySelector('.blend__media');
      const nm = next.querySelector('.blend__media');
      const pt = prev.querySelector('.blend__text');
      const nt = next.querySelector('.blend__text');
      gsap.to(pm, { opacity: 0, y: -24 * dir, rotation: -3 * dir, duration: 0.24, ease: 'power2.in', overwrite: true });
      gsap.fromTo(nm, { opacity: 0, y: 24 * dir, rotation: 6 * dir }, { opacity: 1, y: 0, rotation: 0, duration: 0.48, ease: 'power3.out', delay: 0.12, overwrite: true });
      gsap.to(pt, { opacity: 0, duration: 0.15, overwrite: true });
      // Mask reveal: the text block is clipped by its container and rises into view.
      gsap.fromTo(nt, { opacity: 0, yPercent: 12 }, { opacity: 1, yPercent: 0, duration: 0.48, ease: 'power3.out', delay: 0.12, overwrite: true });
    };

    const trigger = ST.create({
      trigger: pin, start: 'top top', end: () => `+=${stepPx() * n}`, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate(self) {
        const i = Math.min(n - 1, Math.floor(self.progress * n));
        go(i);
        const local = (self.progress * n) - i;
        steps[i]?.style.setProperty('--p', String(Math.min(1, Math.max(0.02, local))));
      },
    });
    const scrollToStep = (i, behavior) => {
      const y = trigger.start + stepPx() * (i + 0.5);
      window.scrollTo({ top: y, behavior });
    };
    const onClick = (e) => { const btn = e.target.closest('[data-blend-step]'); if (btn) scrollToStep(Number(btn.dataset.blendStep), 'smooth'); };
    const onFocus = (e) => {
      const b = e.target.closest('[data-blend]');
      const i = blends.indexOf(b);
      if (i > -1 && i !== active) scrollToStep(i, 'instant');
    };
    section.addEventListener('click', onClick);
    section.addEventListener('focusin', onFocus);
    ST.sort();
    ST.refresh();
    return () => {
      section.removeEventListener('click', onClick);
      section.removeEventListener('focusin', onFocus);
      trigger.kill(true);
      ctx.revert();
      section.classList.remove('is-stacked');
      blends.forEach((b) => b.classList.remove('is-active'));
    };
  };

  const setup = () => {
    teardown();
    if (!desktopMq.matches) { teardown = setupCarousel(); return; }
    if (!document.documentElement.classList.contains('motion-ok')) { teardown = setupTabs(); return; }
    teardown = () => {};
    S.motion().then((gsap) => { if (desktopMq.matches) teardown = setupPinned(gsap); })
      .catch(() => { teardown = setupTabs(); });
  };
  setup();
  desktopMq.addEventListener?.('change', setup);
})();

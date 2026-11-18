/* Fold 5, the cup (brief §6–7). Pinned, scroll-scrubbed sequence:
   1 empty cup shows its lettering → 2 the pour reaches the surface, ripples → 3 coffee rises 0 → 100%
   (covers the base, then "Orgulhosamente Português", then "Português?", up to 36 mm) → 4 crema forms → 5 the tail
   detaches and falls in as a final drop, a coffee bean shows in the crema → 6 headline, sub and CTA reveal (the
   page's only text reveal) →
   7 the arrow draws onto the CTA. Geometry comes from the SVG's data-geom (scripts/build-cup.mjs).
   Every animated property is a transform or opacity. */
(() => {
  const S = window.Sotocal;
  const section = document.querySelector('[data-motion="cup"]');
  if (!S || !section || section.dataset.wired) return;
  section.dataset.wired = '1';

  const stage = section.querySelector('[data-cup-stage]');
  const svg = section.querySelector('[data-cup]');
  if (!stage || !svg) return;
  const g = JSON.parse(svg.dataset.geom);
  const radius = (h) => g.BASE_IN + ((g.RIM_IN - g.BASE_IN) * h) / g.DEPTH;
  const surfaceCy = (h) => g.RIM_CY + (g.DEPTH - h) * g.C;
  const baseCy = surfaceCy(0);

  const surface = svg.querySelector('[data-cup-surface]');
  const crema = svg.querySelector('[data-cup-crema]');
  const pour = svg.querySelector('[data-cup-pour]');
  const drop = svg.querySelector('[data-cup-drop]');
  const bean = svg.querySelector('[data-cup-bean]');
  const reveals = [...section.querySelectorAll('[data-cup-reveal]')];
  const arrow = section.querySelector('[data-cup-arrow]');
  const arrowClip = section.querySelector('[data-cup-arrow-clip]');
  const tail = section.querySelector('.stream--cup [data-stream-tail]');
  const ribbonTail = section.querySelector('[data-stream-ribbon="in"] [data-ribbon-tail]');

  S.motion().then((gsap) => {
    const mm = gsap.matchMedia();
    mm.add({ ok: '(prefers-reduced-motion: no-preference)', mobile: '(max-width: 1023.98px)' }, (ctx) => {
      if (!ctx.conditions.ok) return undefined;
      const state = { fill: 0, reach: 0, tail: 0 };
      const apply = () => {
        const h = state.fill * g.FULL_H;
        const cy = surfaceCy(h);
        const s = radius(h) / g.BASE_IN;
        surface.setAttribute('transform', `translate(${g.CX} ${cy.toFixed(3)}) scale(${s.toFixed(4)})`);
        // The in-cup pour runs from the top of the SVG to the surface; the tail moves its top end down.
        const top = state.tail * cy;
        const len = Math.max(0, cy * state.reach - top);
        pour.setAttribute('transform', `translate(0 ${top.toFixed(3)}) scale(1 ${(len / baseCy).toFixed(4)})`);
      };
      svg.dataset.state = 'empty';
      gsap.set(surface, { opacity: 0 });
      gsap.set(crema, { opacity: 0 });
      gsap.set(drop, { opacity: 0, y: 0 });
      gsap.set(bean, { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' });
      gsap.set(reveals, { opacity: 0, y: 16 });
      gsap.set(arrowClip, { scaleX: 0, transformOrigin: '0% 50%' });
      arrow?.classList.add('is-driven');
      apply();

      const pinVh = parseFloat(getComputedStyle(section).getPropertyValue('--pin-vh')) || 150;
      const tl = gsap.timeline({ defaults: { ease: 'none' }, onUpdate: apply });
      tl.to(state, { reach: 1, duration: 0.05 }, 0)                       // pour reaches the empty base
        .to(surface, { opacity: 1, duration: 0.02 }, 0.05)                 // first coffee covers the base
        .to(state, { fill: 1, duration: 0.6, ease: 'power1.inOut' }, 0.05) // 0 → 100% (30 ml)
        .to(crema, { opacity: 1, duration: 0.12 }, 0.55)                    // crema forms
        .to(tail || {}, { yPercent: 100, duration: 0.07, ease: 'power2.in' }, 0.68) // the stream's tail detaches
        .to(ribbonTail || {}, { y: 100, duration: 0.03, ease: 'power2.in' }, 0.75)
        .to(state, { tail: 1, duration: 0.05, ease: 'power2.in' }, 0.77)
        .fromTo(drop, { opacity: 1, y: () => surfaceCy(g.FULL_H) * 0.35 }, { y: () => surfaceCy(g.FULL_H), opacity: 1, duration: 0.05, ease: 'power2.in' }, 0.8)
        .to(drop, { opacity: 0, duration: 0.01 }, 0.85)
        .to(bean, { opacity: 1, scale: 1, duration: 0.06, ease: 'power2.out' }, 0.84) // the bean opens out of the last ripple
        .to(reveals, { opacity: 1, y: 0, duration: 0.08, stagger: 0.02, ease: 'power2.out' }, 0.87)
        .to(arrowClip, { scaleX: 1, duration: 0.06 }, 0.94);

      const st = window.ScrollTrigger.create({
        trigger: stage, start: 'top top', end: () => `+=${(innerHeight * pinVh) / 100}`,
        pin: true, scrub: 0.8, animation: tl, invalidateOnRefresh: true,
        onUpdate(self) {
          const p = tl.progress();
          svg.classList.toggle('is-pouring', p > 0.04 && p < 0.86 && self.isActive);
          svg.dataset.state = p > 0.66 ? 'full' : 'filling';
        },
      });
      window.ScrollTrigger.sort();
      window.ScrollTrigger.refresh();
      return () => { st.kill(true); svg.classList.remove('is-pouring'); svg.dataset.state = 'full'; arrow?.classList.remove('is-driven'); };
    });
  }).catch(() => { /* static: full cup, headline visible */ });
})();

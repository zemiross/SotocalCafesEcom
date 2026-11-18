/* "O fio de café" (brief §6). One segment per fold; each reveals yPercent −100 → 0 between "top 62%" and "bottom 62%"
   of the segment (scrub 0.8, native scroll), so the leading edge sits ≈ 62% down the viewport across the page.
   Mobile ribbons are uncovered by a clip rect (scaleY), so everything animates transforms only.
   Hero: after the LCP image and an idle callback, the moka pot ([data-hero-tilt]) turns from upright to its pouring
   angle about the spout tip (0.9 s), then a 1.1 s power2.in intro pours the stream from the spout to its
   scroll-linked position; only then are the scrubbed tweens attached (immediateRender: false).
   API: Sotocal.stream.ready (Promise) resolves once the segments are wired. */
(() => {
  const S = window.Sotocal;
  if (!S || S.stream || !document.querySelector('[data-stream]')) return; // every stream section includes this file
  const START = 'top 62%';
  const END = 'bottom 62%';
  const SCRUB = 0.8;
  const pot = document.querySelector('[data-hero-tilt]');
  let resolveReady;
  S.stream = { ready: new Promise((r) => { resolveReady = r; }) };

  S.motion().then((gsap) => {
    const ST = window.ScrollTrigger;
    const mm = gsap.matchMedia();
    mm.add({ desktop: '(min-width: 1024px)', mobile: '(max-width: 1023.98px)', ok: '(prefers-reduced-motion: no-preference)' }, (ctx) => {
      const { mobile, ok } = ctx.conditions;
      if (!ok) return undefined;

      // Pieces in page order. A piece is { el (trigger), set(progress) }.
      const pieces = [];
      document.querySelectorAll('[data-stream], [data-stream-ribbon]').forEach((el) => {
        if (el.matches('[data-stream-ribbon]')) {
          if (!mobile) return;
          const rect = el.querySelector('[data-ribbon-reveal]');
          gsap.set(rect, { scaleY: 0, transformOrigin: '50% 0%' });
          el.classList.add('is-driven');
          pieces.push({ el, target: rect, prop: 'scaleY', from: 0, to: 1, hero: !!el.closest('[data-motion="hero"]') });
        } else {
          const liquid = el.querySelector('.stream__liquid');
          gsap.set(liquid, { y: 0, yPercent: -100 }); // replaces the CSS start state (translateY(-100%)) without double-counting it
          pieces.push({ el, target: liquid, prop: 'yPercent', from: -100, to: 0, hero: el.dataset.variant === 'hero' });
        }
      });
      // DOM order already matches visual order except the hero ribbon (rendered just before the hero segment).

      const attach = (p) => {
        gsap.fromTo(p.target, { [p.prop]: p.from }, {
          [p.prop]: p.to, ease: 'none', immediateRender: false,
          scrollTrigger: { trigger: p.el, start: START, end: END, scrub: SCRUB, invalidateOnRefresh: true },
        });
      };

      pieces.filter((p) => !p.hero).forEach(attach);

      const heroPieces = pieces.filter((p) => p.hero);
      if (heroPieces.length) {
        S.afterLoad(() => {
          // Where should each hero piece be right now? Measure without animating.
          const tl = gsap.timeline({ defaults: { ease: 'none' }, onComplete: () => { heroPieces.forEach(attach); ST.sort(); ST.refresh(); resolveReady(); } });
          if (pot) tl.fromTo(pot, { rotation: -Number(pot.dataset.heroTilt) }, { rotation: 0, duration: 0.9, ease: 'power2.inOut' });
          const targets = heroPieces.map((p) => {
            const probe = ST.create({ trigger: p.el, start: START, end: END });
            const progress = probe.progress;
            probe.kill();
            const length = p.el.getBoundingClientRect().height * progress; // share of the fall, in px
            return { p, value: p.from + (p.to - p.from) * progress, share: Math.max(0.0001, length) };
          });
          const total = targets.reduce((sum, t) => sum + t.share, 0);
          // One continuous 1.1 s fall: distribute power2.in over the pieces by their share of the length.
          const proxy = { t: 0 };
          tl.to(proxy, {
            t: 1, duration: 1.1, ease: 'power2.in',
            onUpdate() {
              let acc = 0;
              targets.forEach(({ p, value, share }) => {
                const local = gsap.utils.clamp(0, 1, (proxy.t * total - acc) / share);
                gsap.set(p.target, { [p.prop]: p.from + (value - p.from) * local });
                acc += share;
              });
            },
          }, pot ? '-=0.15' : 0); // the coffee leaves the spout as the pot settles at its angle
        });
      } else {
        resolveReady();
      }
      return () => { pieces.forEach((p) => p.el.classList.remove('is-driven')); if (pot) gsap.set(pot, { rotation: 0 }); };
    });
  }).catch(() => { if (pot) pot.style.transform = 'none'; resolveReady?.(); });
})();

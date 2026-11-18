/* Fold 2, bean roasting (brief §7). Nothing moves until the fold's top reaches the top of the viewport, so stage 1
   (green beans) is seen first. On desktop the fold is one viewport tall (sections-home.css) and is pinned for
   --pin-vh of scroll while the stages scrub; stage 4 then holds before the pin releases. On smaller screens, or when
   the content is taller than the viewport, the fold is not pinned and the same timeline runs over its own scroll.
   Timeline 0 → 1: stages at 0 / .25 / .5 / .75; green → roasted crossfade .35–.65, crossing at .5 where three beans
   pop and the indicator reaches "Primeiro crack"; scale 1.00 → 1.18, ±12° rotation, parallax by depth and ember glow
   run across the whole timeline. */
(() => {
  const S = window.Sotocal;
  const section = document.querySelector('[data-motion="roast"]');
  if (!S || !section || section.dataset.wired) return;
  section.dataset.wired = '1';

  const stages = [...section.querySelectorAll('[data-stage]')];
  const thresholds = [0, 0.25, 0.5, 0.75]; // Grão verde, Secagem, Primeiro crack, Ponto de torra
  const CRACK = thresholds[2];
  const setStage = (progress) => {
    let idx = 0;
    thresholds.forEach((t, i) => { if (progress >= t) idx = i; });
    stages.forEach((li, i) => (i === idx ? li.setAttribute('aria-current', 'step') : li.removeAttribute('aria-current')));
  };

  S.motion().then((gsap) => {
    const mm = gsap.matchMedia();
    mm.add({ ok: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 1024px)' }, (ctx) => {
      if (!ctx.conditions.ok) return undefined;
      const beans = [...section.querySelectorAll('[data-bean]')].filter((b) => b.offsetParent !== null);
      const glow = section.querySelector('[data-ember]');
      const travel = ctx.conditions.desktop ? 1 : 0.6;
      const parallax = { far: 36, mid: 72, near: 120 };
      const pin = ctx.conditions.desktop && section.offsetHeight <= innerHeight + 1;
      const pinVh = parseFloat(getComputedStyle(section).getPropertyValue('--pin-vh')) || 200;
      let last = 0;

      const tl = gsap.timeline({ defaults: { ease: 'none' } });
      beans.forEach((bean, i) => {
        const depth = parallax[bean.dataset.depth] ?? 72;
        const turn = (i % 2 ? 12 : -12);
        tl.fromTo(bean, { y: depth * 0.5 * travel, rotation: -turn / 2, scale: 1 }, { y: -depth * 0.5 * travel, rotation: turn / 2, scale: 1.18, duration: 1 }, 0);
        const green = bean.querySelector('.bean__img--green');
        const roasted = bean.querySelector('.bean__img--roasted');
        tl.fromTo(green, { opacity: 1 }, { opacity: 0, duration: 0.3 }, 0.35)
          .fromTo(roasted, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.35);
      });
      if (glow) tl.fromTo(glow, { opacity: 0.2 }, { opacity: 1, duration: 1 }, 0);

      const st = window.ScrollTrigger.create({
        trigger: section, start: 'top top',
        end: () => `+=${pin ? (innerHeight * pinVh) / 100 : Math.max(section.offsetHeight - innerHeight, innerHeight * 0.6)}`,
        pin, scrub: 0.8, animation: tl, invalidateOnRefresh: true,
        onUpdate(self) {
          const p = self.progress;
          setStage(p);
          if (last < CRACK && p >= CRACK) {
            const pops = beans.slice(0, 3).map((b) => b.querySelector('[data-bean-pop]'));
            gsap.fromTo(pops, { scale: 1 }, { scale: 1.04, duration: 0.08, yoyo: true, repeat: 1, ease: 'power1.out', overwrite: true });
          }
          last = p;
        },
      });
      window.ScrollTrigger.sort();
      window.ScrollTrigger.refresh();
      setStage(st.progress);

      return () => { st.kill(true); setStage(1); };
    });
  }).catch(() => setStage(1));
})();

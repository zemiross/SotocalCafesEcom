/* Optional scroll-scrubbed image sequence for the hero and fold 2 (brief §4). Configured per section:
   base URL (Shopify Files) + frame count + zero padding + extension → frames named <base><0001>.<ext>.
   The still image stays as the LCP poster; the canvas takes over once the first frames have loaded. */
(() => {
  const S = window.Sotocal;
  const canvases = [...document.querySelectorAll('canvas[data-sequence]:not([data-wired])')];
  if (!S || !canvases.length) return;

  canvases.forEach((canvas) => {
    canvas.dataset.wired = '1';
    const count = Number(canvas.dataset.count);
    const pad = Number(canvas.dataset.pad) || 4;
    const url = (i) => `${canvas.dataset.base}${String(i + 1).padStart(pad, '0')}.${canvas.dataset.ext || 'webp'}`;
    const frames = new Array(count);
    const ctx = canvas.getContext('2d');
    let current = -1;

    const draw = (i) => {
      let k = i;
      while (k > 0 && !frames[k]?.complete) k -= 1; // nearest loaded frame
      const img = frames[k];
      if (!img?.complete || k === current) return;
      current = k;
      if (canvas.width !== img.naturalWidth) { canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    const load = (i) => new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async'; img.onload = resolve; img.onerror = resolve; img.src = url(i);
      frames[i] = img;
    });

    S.motion().then((gsap) => {
      const section = canvas.closest('[data-motion]');
      S.afterLoad(async () => {
        await load(0);
        draw(0);
        canvas.classList.add('is-ready');
        canvas.closest('.hero__machine')?.classList.add('has-sequence');
        // Progressive: every 8th frame first, then the rest.
        for (let step of [8, 1]) for (let i = 0; i < count; i += step) if (!frames[i]) await load(i);
      });
      window.ScrollTrigger.create({
        trigger: section, start: 'top top', end: 'bottom top', scrub: true,
        onUpdate: (self) => draw(Math.round(self.progress * (count - 1))),
      });
    }).catch(() => {});
  });
})();

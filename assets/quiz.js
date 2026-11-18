/* "Que café para a minha máquina?" quiz (WS6). Matches the answers against data rendered by Liquid:
   `data-tokens` (sotocal.best_for chips), `data-intensity` (sotocal.intensity, 1-5), `data-decaf` (sotocal.blend).
   No recommendation is hard-coded. The result appears on the same URL; no personal data is collected or sent. */
(() => {
  const S = window.Sotocal;
  document.querySelectorAll('[data-quiz]:not([data-wired])').forEach((root) => {
    root.dataset.wired = '1';
    const form = root.querySelector('[data-quiz-form]');
    if (!form) return;
    const strings = JSON.parse(root.querySelector('[data-quiz-strings]')?.textContent || '{}');
    const result = root.querySelector('[data-quiz-result]');
    const best = root.querySelector('[data-quiz-best]');
    const why = root.querySelector('[data-quiz-why]');
    const none = root.querySelector('[data-quiz-none]');
    const othersWrap = root.querySelector('[data-quiz-others-wrap]');
    const others = root.querySelector('[data-quiz-others]');
    const error = root.querySelector('[data-quiz-error]');
    const resetBtn = root.querySelector('[data-quiz-reset]');
    const products = [...root.querySelectorAll('[data-quiz-product]')].map((node) => ({
      node,
      handle: node.dataset.handle,
      intensity: node.dataset.intensity ? Number(node.dataset.intensity) : null,
      tokens: (node.dataset.tokens || '').split('|').map((t) => t.trim().toLowerCase()).filter(Boolean),
      decaf: node.dataset.decaf === 'true',
    }));
    const answered = (name) => form.querySelector(`input[name="${name}"]:checked`);

    const score = (p, a) => {
      let points = 0; const reasons = {};
      if (a.machine && p.tokens.includes(a.machine.toLowerCase())) { points += 3; reasons.machine = a.machine; }
      if (a.milk && p.tokens.includes(a.milk.toLowerCase())) { points += 2; reasons.milk = true; }
      let distance = 0;
      if (a.intensity != null && p.intensity != null) { distance = Math.abs(p.intensity - a.intensity); reasons.intensity = p.intensity; }
      return { p, points, distance, reasons };
    };

    const recommend = (a) => {
      let pool = products.filter((p) => p.decaf === a.decaf);
      if (!pool.length) return [];
      const scored = pool.map((p) => score(p, a));
      scored.sort((x, y) => (y.points - x.points) || (x.distance - y.distance) || x.p.handle.localeCompare(y.p.handle));
      // Keep only blends that match at least one thing the visitor asked for (or all, if they asked for nothing specific).
      const asked = Boolean(a.machine || a.milk || a.intensity != null);
      return asked ? scored.filter((s) => s.points > 0 || (a.intensity != null && s.p.intensity != null)) : scored;
    };

    // Move (not clone) the rendered tile, so ids stay unique and the quick-add handlers keep working.
    const shelf = root.querySelector('[data-quiz-products]');
    const putBack = () => products.forEach((p) => shelf.append(p.node));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const missing = ['machine', 'milk', 'intensity', 'decaf'].some((n) => !answered(n));
      error.hidden = !missing;
      if (missing) { error.focus?.(); return; }
      const a = {
        machine: answered('machine').value, milk: answered('milk').value,
        intensity: answered('intensity').value === '' ? null : Number(answered('intensity').value),
        decaf: answered('decaf').value === 'yes',
      };
      const ranked = recommend(a);
      result.hidden = false; resetBtn.hidden = false;
      putBack(); why.textContent = ''; othersWrap.hidden = true;
      none.hidden = ranked.length > 0;
      if (ranked.length) {
        const top = ranked[0];
        best.append(top.p.node);
        const parts = [];
        if (top.reasons.machine) parts.push(strings.whyMachine.replace('__M__', top.reasons.machine));
        if (top.reasons.milk) parts.push(strings.whyMilk);
        if (top.reasons.intensity != null) parts.push(strings.whyIntensity.replace('__V__', top.reasons.intensity));
        if (parts.length) why.textContent = `${strings.why} ${parts.join(', ')}.`;
        const rest = ranked.slice(1, 3);
        if (rest.length) { rest.forEach((r) => others.append(r.p.node)); othersWrap.hidden = false; }
      }
      result.focus();
      if (S && S.publish) S.publish('quiz_completed', { machine: a.machine || 'other', milk: Boolean(a.milk), intensity: a.intensity, decaf: a.decaf, recommended: ranked[0]?.p.handle || null });
    });

    resetBtn.addEventListener('click', () => {
      putBack(); form.reset(); result.hidden = true; resetBtn.hidden = true; error.hidden = true;
      form.querySelector('input')?.focus();
    });
  });
})();

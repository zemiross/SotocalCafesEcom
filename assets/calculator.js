/* Cost-per-cup calculator (WS6). Pure arithmetic on the visitor's numbers plus reference prices rendered by Liquid
   (competitor metaobject, each with source and date). State lives in the URL query so a result can be linked.
   cost per cup = pack price / pack weight (g) x dose (g); capsules = pack price / capsules per pack.
   month = cups/day x 365 / 12; year = cups/day x 365. No data leaves the browser. */
(() => {
  const S = window.Sotocal;
  document.querySelectorAll('[data-calc]:not([data-wired])').forEach((root) => {
    root.dataset.wired = '1';
    const q = (sel) => root.querySelector(sel);
    const strings = JSON.parse(q('[data-calc-strings]')?.textContent || '{}');
    const refs = JSON.parse(q('[data-calc-refs]')?.textContent || '[]');
    const form = q('[data-calc-form]');
    const el = {
      price: q('[data-calc-price]'), weight: q('[data-calc-weight]'), units: q('[data-calc-units]'),
      dose: q('[data-calc-dose]'), cups: q('[data-calc-cups]'), preset: q('[data-calc-preset]'),
      presetWrap: q('[data-calc-preset-wrap]'), weightField: q('[data-calc-weight-field]'), unitsField: q('[data-calc-units-field]'),
      doseField: q('[data-calc-dose-field]'), error: q('[data-calc-error]'), empty: q('[data-calc-empty]'),
      numbers: q('[data-calc-numbers]'), note: q('[data-calc-numbers-note]'), perCup: q('[data-calc-per-cup]'),
      perMonth: q('[data-calc-per-month]'), perYear: q('[data-calc-per-year]'), compare: q('[data-calc-compare]'),
      rows: q('[data-calc-rows]'), reset: q('[data-calc-reset]'), copy: q('[data-calc-copy]'), copied: q('[data-calc-copied]'),
    };
    const defaults = { dose: el.dose.value, cups: el.cups.value };
    const LIMIT = 10;
    let expanded = false;
    el.more = q('[data-calc-more]');
    const lang = (S && S.locale) || document.documentElement.lang || 'pt-PT';
    const money = new Intl.NumberFormat(lang, { style: 'currency', currency: 'EUR' });
    const money3 = new Intl.NumberFormat(lang, { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 3 });
    const fmt = (v) => (v < 1 ? money3.format(v) : money.format(v));
    // Accept "12,50", "12.50" and "1 250".
    const num = (v) => {
      const s = String(v ?? '').trim().replace(/\s/g, '').replace(',', '.');
      if (s === '') return NaN;
      return /^\d*\.?\d+$/.test(s) ? parseFloat(s) : NaN;
    };
    const format = () => form.querySelector('input[name="format"]:checked')?.value || 'grao';
    let published = false;

    const layout = () => {
      const cap = format() === 'capsula';
      el.weightField.hidden = cap; el.unitsField.hidden = !cap; el.doseField.hidden = cap;
      if (el.preset) {
        const opts = [...el.preset.options].filter((o) => o.value);
        const match = opts.filter((o) => o.dataset.format === format());
        opts.forEach((o) => { o.hidden = o.dataset.format !== format(); o.disabled = o.hidden; });
        el.presetWrap.hidden = cap || match.length === 0;
        if (el.preset.selectedOptions[0]?.disabled) el.preset.value = '';
      }
    };

    const cupCost = (format_, price, weight, units, dose) => {
      if (format_ === 'capsula') return units > 0 && price > 0 ? price / units : NaN;
      return weight > 0 && price > 0 && dose > 0 ? (price / weight) * dose : NaN;
    };

    const cell = (text, attrs = {}) => {
      const td = document.createElement('td');
      td.textContent = text;
      Object.entries(attrs).forEach(([k, v]) => td.setAttribute(k, v));
      return td;
    };

    const renderRows = (own, dose) => {
      if (!el.rows) return;
      // Compare like with like: only references in the visitor's format, cheapest first, ten at a time.
      const f = format();
      let rows = refs.filter((r) => r.format === f).map((r) => {
        const isCap = r.format === 'capsula';
        const perCup = isCap ? (r.packUnits > 0 ? r.packPrice / r.packUnits : NaN) : (r.perKg > 0 ? (r.perKg * dose) / 1000 : NaN);
        return { r, perCup, isCap };
      }).filter((x) => Number.isFinite(x.perCup));
      const total = rows.length;
      rows.sort((a, b) => a.perCup - b.perCup);
      if (!expanded && rows.length > LIMIT) rows = rows.slice(0, LIMIT);
      if (own != null) rows.push({ own: true, perCup: own });
      rows.sort((a, b) => a.perCup - b.perCup);
      if (el.more) {
        el.more.hidden = total <= LIMIT || own == null;
        el.more.textContent = expanded ? strings.showFewer : strings.showAll.replace('__N__', String(total));
        el.more.setAttribute('aria-expanded', String(expanded));
      }
      el.rows.replaceChildren(...rows.map((x) => {
        const tr = document.createElement('tr');
        if (x.own) {
          tr.className = 'is-own';
          const th = document.createElement('th'); th.scope = 'row'; th.textContent = strings.you; tr.append(th, cell(''), cell(''), cell(fmt(x.perCup)), cell(''));
          return tr;
        }
        const { r } = x;
        const th = document.createElement('th'); th.scope = 'row';
        th.textContent = `${r.name}${r.product ? `: ${r.product}` : ''}`;
        const kind = r.kind === 'promocao' ? ` (${strings.promo})` : '';
        const label = { grao: strings.grain, moido: strings.ground, capsula: strings.capsule }[r.format] || r.format;
        const perKg = x.isCap ? '' : fmt(r.perKg);
        const link = document.createElement('a'); link.className = 'link'; link.href = r.source; link.rel = 'noopener nofollow'; link.textContent = r.date;
        link.setAttribute('aria-label', `${r.name}, ${r.date}`);
        const src = document.createElement('td'); src.append(link);
        if (r.stale) { const s = document.createElement('span'); s.className = 'small muted'; s.textContent = ` ${strings.stale}`; src.append(s); }
        tr.append(th, cell(label), cell(perKg), cell(fmt(x.perCup) + kind), src);
        return tr;
      }));
      el.compare.hidden = rows.length === 0 || own == null;
    };

    const syncUrl = () => {
      const u = new URL(location.href);
      u.search = '';
      const set = (k, v) => { if (String(v).trim() !== '') u.searchParams.set(k, String(v).trim()); };
      set('f', format()); set('p', el.price.value); set('w', el.weight.value); set('u', el.units.value);
      set('d', el.dose.value); set('c', el.cups.value);
      history.replaceState(history.state, '', u);
    };

    const compute = () => {
      const f = format();
      const price = num(el.price.value), weight = num(el.weight.value), units = num(el.units.value);
      const dose = num(el.dose.value), cups = num(el.cups.value);
      // Show the error only for a field the visitor has typed into that is not a positive number.
      const relevant = f === 'capsula' ? [el.price, el.units, el.cups] : [el.price, el.weight, el.dose, el.cups];
      const invalid = relevant.filter((i) => i.value.trim() !== '' && !(num(i.value) > 0));
      el.error.hidden = invalid.length === 0;
      relevant.forEach((i) => i.toggleAttribute('aria-invalid', invalid.includes(i)));
      const cost = cupCost(f, price, weight, units, dose);
      const ok = Number.isFinite(cost) && Number.isFinite(cups) && cups > 0;
      el.empty.hidden = ok; el.numbers.hidden = !ok; el.note.hidden = !ok;
      if (!ok) { renderRows(null, Number.isFinite(dose) ? dose : 7); el.compare && (el.compare.hidden = true); el.copy.hidden = true; return; }
      el.perCup.textContent = fmt(cost);
      el.perMonth.textContent = money.format((cost * cups * 365) / 12);
      el.perYear.textContent = money.format(cost * cups * 365);
      renderRows(cost, f === 'capsula' ? (Number.isFinite(dose) ? dose : 7) : dose);
      el.copy.hidden = !navigator.clipboard;
      syncUrl();
      if (!published && S && S.publish) { published = true; S.publish('calculator_used', { format: f }); }
    };

    form.addEventListener('input', (e) => { if (e.target === el.preset) return; compute(); });
    form.addEventListener('change', (e) => {
      if (e.target.name === 'format') { layout(); expanded = false; if (el.preset) el.preset.value = ''; }
      if (e.target === el.preset) {
        const o = el.preset.selectedOptions[0];
        if (o && o.value) {
          el.price.value = Number(o.dataset.price).toFixed(2).replace('.', ',');
          el.weight.value = String(o.dataset.weight);
          if (!el.dose.value.trim()) el.dose.value = defaults.dose;
        }
      }
      compute();
    });
    form.addEventListener('submit', (e) => e.preventDefault());
    el.more?.addEventListener('click', () => { expanded = !expanded; compute(); });
    el.reset.addEventListener('click', () => {
      form.reset(); el.dose.value = defaults.dose; el.cups.value = defaults.cups;
      el.price.value = ''; el.weight.value = ''; el.units.value = '';
      history.replaceState(history.state, '', location.pathname);
      layout(); compute(); el.price.focus();
    });
    el.copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(location.href); el.copied.textContent = strings.copied; setTimeout(() => { el.copied.textContent = ''; }, 2500); } catch (e) { /* clipboard blocked */ }
    });

    // Restore a shared state from the URL.
    const p = new URLSearchParams(location.search);
    const f = p.get('f');
    if (['grao', 'moido', 'capsula'].includes(f)) form.querySelector(`input[name="format"][value="${f}"]`).checked = true;
    if (p.get('p')) el.price.value = p.get('p');
    if (p.get('w')) el.weight.value = p.get('w');
    if (p.get('u')) el.units.value = p.get('u');
    if (p.get('d')) el.dose.value = p.get('d');
    if (p.get('c')) el.cups.value = p.get('c');
    layout();
    compute();
  });
})();

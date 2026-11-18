/* Collection filters: progressive enhancement of the GET form with the Section Rendering API (no full reload). */
(() => {
  const section = document.querySelector('[data-collection-section]:not([data-wired])');
  if (!section) return;
  section.dataset.wired = '1';
  const form = section.querySelector('[data-filters]');
  if (!form) return; // catalogue mode (no purchase) renders the grid without filters
  const id = section.dataset.sectionId;
  let controller;

  const load = async (url) => {
    controller?.abort();
    controller = new AbortController();
    const fetchUrl = new URL(url, location.origin);
    fetchUrl.searchParams.set('section_id', id);
    section.setAttribute('aria-busy', 'true');
    try {
      const html = await (await fetch(fetchUrl, { signal: controller.signal })).text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const fresh = doc.querySelector('[data-collection-results]');
      const count = doc.querySelector('[data-results-count]');
      if (fresh) section.querySelector('[data-collection-results]').replaceWith(fresh);
      if (count) section.querySelector('[data-results-count]').textContent = count.textContent;
      // Keep the open filter group and checkbox states; only counts may change.
      doc.querySelectorAll('[data-filter-group]').forEach((g, i) => {
        const live = section.querySelectorAll('[data-filter-group]')[i];
        if (!live) return;
        g.querySelectorAll('input').forEach((input, j) => {
          const target = live.querySelectorAll('input')[j];
          if (target && input.type === 'checkbox') target.disabled = input.disabled;
        });
      });
      history.replaceState(history.state, '', url);
    } catch (e) { if (e.name !== 'AbortError') location.assign(url); }
    finally { section.removeAttribute('aria-busy'); }
  };

  const urlFromForm = () => {
    const params = new URLSearchParams(new FormData(form));
    for (const [k, v] of [...params]) if (v === '') params.delete(k);
    return `${form.action}?${params.toString()}`;
  };
  form.addEventListener('change', () => load(urlFromForm()));
  form.addEventListener('submit', (e) => { e.preventDefault(); load(urlFromForm()); });
  section.addEventListener('click', (e) => {
    const a = e.target.closest('.pagination a');
    if (!a) return;
    e.preventDefault();
    load(a.href).then(() => section.querySelector('[data-collection-results]')?.scrollIntoView({ block: 'start' }));
  });
  // Close other filter groups when one opens (Hick: one decision at a time).
  section.querySelectorAll('[data-filter-group]').forEach((g) => g.addEventListener('toggle', () => {
    if (g.open) section.querySelectorAll('[data-filter-group][open]').forEach((o) => { if (o !== g) o.open = false; });
  }));
})();

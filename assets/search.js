/* Predictive search (loaded on first open of the search dialog). Uses the locale-aware predictive search route and
   renders results with textContent only (DECISIONS D20). Debounced; aborts stale requests (Doherty: < 400 ms). */
(() => {
  const S = window.Sotocal;
  const form = document.querySelector('[data-predictive-search]');
  if (!S || !form || form.dataset.wired) return;
  form.dataset.wired = '1';
  const input = form.querySelector('input[name="q"]');
  const out = form.querySelector('[data-search-results]');
  const status = form.querySelector('[data-search-status]');
  const pt = (S.locale || '').startsWith('pt');
  const labels = pt
    ? { products: 'Produtos', articles: 'Guia e receitas', pages: 'Páginas', collections: 'Coleções', all: 'Ver todos os resultados' }
    : { products: 'Products', articles: 'Guides and recipes', pages: 'Pages', collections: 'Collections', all: 'See all results' };
  let timer; let controller;

  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };

  const render = (q, res) => {
    out.replaceChildren();
    let total = 0;
    for (const type of ['products', 'collections', 'articles', 'pages']) {
      const items = res?.[type] || [];
      if (!items.length) continue;
      total += items.length;
      const group = el('section');
      group.append(el('h3', null, labels[type]));
      const ul = el('ul');
      items.slice(0, 5).forEach((item) => {
        const li = el('li');
        const a = el('a'); a.href = item.url;
        if (type === 'products' && item.featured_image?.url) {
          const img = el('img'); img.src = `${item.featured_image.url}${item.featured_image.url.includes('?') ? '&' : '?'}width=96`; img.alt = ''; img.width = 48; img.height = 48; img.loading = 'lazy';
          a.append(img);
        }
        a.append(el('span', 'search-results__title', item.title));
        if (type === 'products' && item.price) a.append(el('span', 'search-results__price', item.price));
        li.append(a); ul.append(li);
      });
      group.append(ul);
      out.append(group);
    }
    const all = el('a', 'text-link', labels.all);
    all.href = `${S.routes.search}?q=${encodeURIComponent(q)}`;
    out.append(all);
    status.textContent = total ? `${total} ${S.strings.searchResults}` : S.strings.searchNoResults;
  };

  input.addEventListener('input', () => {
    clearTimeout(timer);
    const q = input.value.trim();
    if (q.length < 2) { out.replaceChildren(); status.textContent = ''; return; }
    timer = setTimeout(async () => {
      controller?.abort(); controller = new AbortController();
      const url = `${S.routes.predictiveSearch}.json?q=${encodeURIComponent(q)}&resources[type]=product,collection,article,page&resources[limit]=5&resources[options][unavailable_products]=last`;
      try {
        const data = await (await fetch(url, { signal: controller.signal })).json();
        render(q, data?.resources?.results);
      } catch (e) { if (e.name !== 'AbortError') status.textContent = S.strings.error; }
    }, 180);
  });
})();

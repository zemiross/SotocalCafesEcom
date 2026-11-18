/* Café locator: search, map on demand (Leaflet + OpenStreetMap, privacy: nothing loads before the click), pickup memory. */
(() => {
  const S = window.Sotocal;
  const root = document.querySelector('[data-locator]');
  if (!S || !root || root.dataset.wired) return;
  root.dataset.wired = '1';
  const pt = (S.locale || '').startsWith('pt');
  const cafes = [...root.querySelectorAll('[data-cafe]')];
  const count = root.querySelector('[data-locator-count]');
  const say = (n) => { if (count) count.textContent = pt ? `${n} ${n === 1 ? 'café' : 'cafés'}` : `${n} ${n === 1 ? 'café' : 'cafés'}`; };
  say(cafes.length);

  root.querySelector('[data-locator-search]')?.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    let shown = 0;
    cafes.forEach((c) => {
      const text = c.dataset.searchText.normalize('NFD').replace(/[̀-ͯ]/g, '');
      const hit = !q || text.includes(q);
      c.hidden = !hit; if (hit) shown += 1;
    });
    root.querySelectorAll('[data-district]').forEach((d) => { d.hidden = !d.querySelector('[data-cafe]:not([hidden])'); });
    say(shown);
  });

  let map;
  const toggle = root.querySelector('[data-map-toggle]');
  const box = root.querySelector('[data-map]');
  toggle?.addEventListener('click', async () => {
    const open = box.hidden;
    box.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (!open || map) { if (map) map.invalidateSize(); return; }
    await Promise.all([S.loadStyle(S.assets.leafletCss), S.loadScript(S.assets.leaflet)]);
    const L = window.L;
    map = L.map(box, { scrollWheelZoom: false });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    const pts = [];
    cafes.forEach((c) => {
      const lat = parseFloat(c.dataset.lat); const lng = parseFloat(c.dataset.lng);
      if (Number.isNaN(lat) || Number.isNaN(lng)) return;
      const icon = L.divIcon({ className: 'locator__pin', html: '<span></span>', iconSize: [20, 20] });
      const marker = L.marker([lat, lng], { icon, title: c.dataset.name, alt: c.dataset.name }).addTo(map);
      marker.bindPopup(`<strong>${c.dataset.name.replace(/</g, '&lt;')}</strong><br>${c.dataset.city.replace(/</g, '&lt;')}`);
      pts.push([lat, lng]);
    });
    if (pts.length) map.fitBounds(pts, { padding: [32, 32], maxZoom: 13 }); else map.setView([41.15, -8.61], 8);
  });

  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-pickup-here]');
    if (!btn) return;
    const c = btn.closest('[data-cafe]');
    const cafe = { id: c.dataset.id, name: c.dataset.name, city: c.dataset.city };
    S.store.set('sotocal:pickup', JSON.stringify(cafe));
    S.publish('pickup_cafe_selected', { cafe_id: cafe.id, cafe_city: cafe.city, source: 'locator' });
    const out = root.querySelector('[data-pickup-saved]');
    if (out) {
      out.hidden = false;
      out.textContent = pt ? `Guardámos ${cafe.name} para o levantamento. Escolha o café e confirme no carrinho.` : `${cafe.name} is saved for collection. Choose your coffee and confirm in the basket.`;
    }
  });
})();

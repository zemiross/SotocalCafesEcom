/* Product page: variant pickers, selling plans, quantity, sticky add-to-cart (mobile).
   Prices arrive pre-formatted from Liquid (product JSON), so no money formatting happens here. */
(() => {
  const S = window.Sotocal;
  document.querySelectorAll('[data-product-section]:not([data-wired])').forEach((section) => {
    section.dataset.wired = '1';
    const form = section.querySelector('[data-product-form]');
    const data = JSON.parse(section.querySelector('[data-product-json]')?.textContent || '{}');
    if (!form || !data.variants) return;
    const idInput = form.querySelector('[data-variant-id]');
    const price = section.querySelector('#Price');
    const buttons = section.querySelectorAll('[data-add-button]');
    const stickyPrice = section.querySelector('[data-sticky-price]');
    const fieldsets = [...form.querySelectorAll('[data-option-index]')];

    const selectedOptions = () => fieldsets.map((fs) => fs.querySelector('input:checked')?.value);
    const currentPlan = () => form.querySelector('[data-selling-plan]:checked')?.value || '';
    const findVariant = (opts) => data.variants.find((v) => v.options.every((o, i) => o === opts[i]));

    const markAvailability = (opts) => {
      fieldsets.forEach((fs, idx) => {
        fs.querySelectorAll('input').forEach((input) => {
          const test = [...opts]; test[idx] = input.value;
          const v = findVariant(test);
          input.closest('.radio-pill')?.classList.toggle('is-unavailable', !v || !v.available);
        });
      });
    };

    const update = () => {
      const opts = selectedOptions();
      const v = fieldsets.length ? findVariant(opts) : data.variants[0];
      markAvailability(opts);
      const label = !v ? S.strings.unavailable : v.available ? S.strings.addToCart : S.strings.soldOut;
      buttons.forEach((b) => { b.disabled = !v || !v.available; const l = b.querySelector('[data-add-label]'); if (l) l.textContent = label; });
      // "Avise-me": visible while the chosen size is sold out (or the combination does not exist); a posted success message stays visible.
      const notify = section.querySelector('[data-notify]');
      if (notify) {
        notify.hidden = !!(v && v.available) && !notify.querySelector('[data-notify-success]');
        const body = notify.querySelector('[data-notify-body]');
        if (body && v && fieldsets.length) body.value = `${body.dataset.base} (${v.options.join(' / ')})`;
      }
      if (!v) return;
      idInput.value = v.id;
      const plan = currentPlan();
      const shown = plan && v.plans?.[plan] ? v.plans[plan] : v;
      const amount = price?.querySelector('[data-price-amount]');
      if (amount) amount.textContent = shown.price;
      const unit = price?.querySelector('[data-unit-price]');
      if (unit && shown.unit) unit.lastChild.textContent = shown.unit;
      const compare = price?.querySelector('[data-price-compare]');
      if (compare) compare.closest('.price__compare').hidden = !v.compare || !!plan;
      if (stickyPrice) stickyPrice.textContent = shown.price;
      const url = new URL(location.href);
      url.searchParams.set('variant', v.id);
      history.replaceState(history.state, '', url);
    };

    form.addEventListener('change', (e) => {
      if (e.target.matches('[data-option-value], [data-selling-plan]')) update();
      if (e.target.matches('[data-selling-plan]') && e.target.value) {
        S.publish('subscription_selected', { stage: 'chosen', product_url: data.url, selling_plan: Number(e.target.value) });
      }
    });
    form.addEventListener('click', (e) => {
      const step = e.target.closest('[data-qty-step]');
      if (!step) return;
      const input = form.querySelector('[data-qty]');
      input.value = Math.max(1, Number(input.value || 1) + Number(step.dataset.qtyStep));
    });

    // Sticky bar on small screens once the main button has scrolled away (Fitts: the action stays in thumb reach).
    const bar = section.querySelector('[data-sticky-atc]');
    const main = form.querySelector('.buy-form__submit');
    if (bar && main && 'IntersectionObserver' in window) {
      const mq = matchMedia('(max-width: 1023.98px)');
      new IntersectionObserver(([entry]) => {
        bar.hidden = !mq.matches || entry.isIntersecting || entry.boundingClientRect.top > 0;
      }).observe(main);
    }
    update();
  });
})();

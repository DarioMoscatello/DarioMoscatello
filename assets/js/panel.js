const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function entryMarkup(card, section) {
  const parts = [];
  const title = `<h2 class="entry__title">${escapeHtml(card.title || section.label)}</h2>`;
  // A project's own website sits beside its title: visible without
  // scrolling, easy to press, and no extra line.
  if (card.site) {
    parts.push(
      `<div class="entry__head">${title}` +
        `<a class="entry__site" href="${escapeHtml(card.site.href)}" target="_blank" rel="noopener">` +
        `${escapeHtml(card.site.label)}<span aria-hidden="true"> ↗</span></a></div>`,
    );
  } else {
    parts.push(title);
  }

  if (card.subtitle) parts.push(`<p class="entry__subtitle">${escapeHtml(card.subtitle)}</p>`);

  if (card.meta?.length) {
    parts.push(`<p class="entry__meta">${card.meta.map((m) => `<span>${escapeHtml(m)}</span>`).join('')}</p>`);
  }

  if (card.body?.length) {
    parts.push(`<div class="entry__body">${card.body.map((b) => `<p>${escapeHtml(b)}</p>`).join('')}</div>`);
  }

  if (card.list?.length) {
    parts.push(`<ul class="entry__list">${card.list.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`);
  }

  if (card.facts?.length) {
    const rows = card.facts
      .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
      .join('');
    parts.push(`<dl class="entry__facts">${rows}</dl>`);
  }

  if (card.links?.length) {
    const links = card.links
      .map((link) => {
        const external = /^https?:/.test(link.href);
        const attrs = external ? ' target="_blank" rel="noopener"' : '';
        return `<a href="${escapeHtml(link.href)}"${attrs}>${escapeHtml(link.label)}</a>`;
      })
      .join('');
    parts.push(`<p class="entry__links">${links}</p>`);
  }

  if (card.head) {
    const items = section.cards.filter((c) => !c.head);
    if (items.length) {
      const wide = items.length > 7 ? ' entry__index--wide' : '';
      const list = items
        .map((c) => `<li><button type="button" data-pick="${escapeHtml(c.id)}">${escapeHtml(c.title)}</button></li>`)
        .join('');
      parts.push(`<ul class="entry__index${wide}">${list}</ul>`);
    }
  }

  return `<article class="entry">${parts.join('')}</article>`;
}

export function createPanel(root, { onPick } = {}) {
  const inner = root.querySelector('[data-panel-inner]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let shownKey = '';
  let running = null;

  inner.addEventListener('click', (e) => {
    const button = e.target.closest('[data-pick]');
    if (button) onPick?.(button.dataset.pick);
  });

  function measure() {
    root.classList.toggle('is-scrollable', inner.scrollHeight > inner.clientHeight + 2);
  }

  new ResizeObserver(measure).observe(inner);

  async function show(card, section) {
    const key = `${section.id}/${card.id}`;
    if (key === shownKey) return;
    shownKey = key;
    const markup = entryMarkup(card, section);

    running?.cancel();
    if (!inner.firstElementChild || reduceMotion.matches) {
      inner.innerHTML = markup;
      inner.scrollTop = 0;
      measure();
      return;
    }

    const out = inner.animate(
      [
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: 'translateY(-6px)' },
      ],
      { duration: 150, easing: 'cubic-bezier(.55,0,1,.45)', fill: 'forwards' },
    );
    running = out;
    try {
      await out.finished;
    } catch {
      return; // replaced by a newer card
    }
    if (shownKey !== key) return;

    inner.innerHTML = markup;
    inner.scrollTop = 0;
    measure();
    out.cancel();
    running = inner.animate(
      [
        { opacity: 0, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' },
    );
  }

  return { show };
}

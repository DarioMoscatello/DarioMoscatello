const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function entryMarkup(card, section) {
  const parts = [];
  const title = `<h2 class="entry__title">${escapeHtml(card.title || section.label)}</h2>`;
  // A project's own website sits beside its title: visible without
  // scrolling, easy to press, and no extra line.
  if (card.site || card.video || card.date) {
    const site = card.site
      ? `<a class="entry__site" href="${escapeHtml(card.site.href)}" target="_blank" rel="noopener">` +
        `${escapeHtml(card.site.label)}<span aria-hidden="true"> ↗</span></a>`
      : '';
    const video = card.video
      ? `<button type="button" class="entry__site" data-video="${escapeHtml(card.video.src)}"` +
        ` data-poster="${escapeHtml(card.video.poster || '')}" data-ratio="${escapeHtml(card.video.ratio || '9 / 16')}"><span aria-hidden="true">▶ </span>Video</button>`
      : '';
    const date = card.date ? `<span class="entry__date">${escapeHtml(card.date)}</span>` : '';
    parts.push(`<div class="entry__head">${title}${date}${site}${video}</div>`);
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

  if (card.points?.length) {
    parts.push(`<ul class="entry__points">${card.points.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`);
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
        .map((c) => `<li><button type="button" data-pick="${escapeHtml(c.id)}">${escapeHtml(c.index || c.title)}</button></li>`)
        .join('');
      parts.push(`<ul class="entry__index${wide}">${list}</ul>`);
    }
  }

  return `<article class="entry">${parts.join('')}</article>`;
}

/* A card's film plays over the page, with sound and controls. It closes with
   the button, Escape or a click outside it, and focus goes back to the
   button that opened it. A landscape film seen on a phone held upright gets a
   hint to turn the phone and a Full screen button that also turns the picture
   to landscape where the browser allows it. */
export function playVideo(src, poster, opener, ratio = '9 / 16') {
  const layer = document.createElement('div');
  layer.className = 'film';
  layer.setAttribute('role', 'dialog');
  layer.setAttribute('aria-modal', 'true');
  layer.setAttribute('aria-label', 'Video');
  layer.innerHTML =
    `<div class="film__frame" style="--ratio: ${escapeHtml(ratio)}"><video class="film__video" src="${escapeHtml(src)}"` +
    (poster ? ` poster="${escapeHtml(poster)}"` : '') +
    ' controls autoplay playsinline preload="auto"></video></div>' +
    (isLandscape(ratio)
      ? '<div class="film__turn"><span class="film__phone" aria-hidden="true"></span>' +
        '<span>Turn your phone</span>' +
        '<button type="button" class="film__full">Full screen</button></div>'
      : '') +
    '<button type="button" class="film__close" aria-label="Close video">✕</button>';
  const video = layer.querySelector('video');
  const close = () => {
    video.pause();
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    try {
      screen.orientation?.unlock?.();
    } catch {
      /* not supported */
    }
    layer.remove();
    document.removeEventListener('keydown', onKey);
    document.documentElement.classList.remove('has-film');
    opener?.focus();
  };
  const onKey = (e) => {
    if (e.key === 'Escape') close();
  };
  layer.addEventListener('click', (e) => {
    if (e.target === layer || e.target.closest('.film__close')) close();
    if (e.target.closest('.film__full')) fullscreen(video);
  });
  document.addEventListener('keydown', onKey);
  document.documentElement.classList.add('has-film');
  document.body.append(layer);
  layer.querySelector('.film__close').focus();
}

function isLandscape(ratio) {
  const [w, h] = String(ratio).split('/').map(Number);
  return w > h;
}

// Full screen, then landscape. iPhone has no fullscreen for elements, only its
// own video player, which turns with the phone by itself.
async function fullscreen(video) {
  try {
    if (video.requestFullscreen) await video.requestFullscreen();
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    await screen.orientation?.lock?.('landscape');
  } catch {
    /* the browser said no: the film still plays in the page */
  }
}

export function createPanel(root, { onPick } = {}) {
  const inner = root.querySelector('[data-panel-inner]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let shownKey = '';
  let running = null;

  inner.addEventListener('click', (e) => {
    const button = e.target.closest('[data-pick]');
    if (button) onPick?.(button.dataset.pick);
    const film = e.target.closest('[data-video]');
    if (film) playVideo(film.dataset.video, film.dataset.poster, film, film.dataset.ratio);
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

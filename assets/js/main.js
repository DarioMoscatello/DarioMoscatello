import { SECTIONS, CONFIG } from './content.js';
import { createTwistTitle } from './title-twist.js';
import { createWheel } from './wheel.js';
import { createPanel } from './panel.js';

const sectionsById = new Map(SECTIONS.map((s) => [s.id, s]));

const stage = document.querySelector('[data-stage]');
const navList = document.querySelector('[data-nav]');
const titleCanvas = document.querySelector('[data-title]');

let current = null;
let deck = [];

/* ---------- title ---------- */

document.fonts
  .load('800 100px "Unbounded"')
  .catch(() => null)
  .then(() => createTwistTitle(titleCanvas));

/* ---------- nav ---------- */

navList.innerHTML = SECTIONS.map(
  (s) => `<li><button type="button" data-section="${s.id}">${s.label}</button></li>`,
).join('');

navList.addEventListener('click', (e) => {
  const button = e.target.closest('[data-section]');
  if (!button) return;
  openSection(button.dataset.section, { scroll: true });
});

function markNav() {
  for (const button of navList.querySelectorAll('[data-section]')) {
    button.setAttribute('aria-current', String(button.dataset.section === current?.id));
  }
}

/* ---------- panel + wheel ---------- */

const panel = createPanel(document.querySelector('[data-panel]'), {
  onPick: (key) => wheel.selectKey(key),
});

function showEntry(entry) {
  if (!entry || !current) return;
  panel.show(entry.data, current);
  const hash = entry.head ? `#${current.id}` : `#${current.id}/${entry.key}`;
  if (location.hash !== hash) history.replaceState(null, '', hash);
}

const wheel = createWheel(document.querySelector('[data-wheel]'), {
  // a pressed card shows its text right away; drags and draws when they land
  onTarget: showEntry,
  onSettle: showEntry,
});

function buildDeck(section) {
  const entries = section.cards.map((card) => ({ key: card.id, data: card, head: Boolean(card.head) }));
  if (CONFIG.fillMode !== 'duplicate') return entries;

  const rest = entries.filter((e) => !e.head);
  if (!rest.length) return entries;
  const filled = [...entries];
  for (let k = 0; filled.length < CONFIG.minCards; k++) filled.push(rest[k % rest.length]);
  return filled;
}

function openSection(id, { cardKey, scroll = false } = {}) {
  const section = sectionsById.get(id) || sectionsById.get(CONFIG.defaultSection) || SECTIONS[0];

  if (current?.id === section.id) {
    if (cardKey) wheel.selectKey(cardKey);
    else wheel.select(0);
  } else {
    current = section;
    deck = buildDeck(section);
    const start = cardKey ? Math.max(0, deck.findIndex((d) => d.key === cardKey)) : 0;
    markNav();
    wheel.setDeck(deck, { start });
  }

  if (scroll) {
    const box = stage.getBoundingClientRect();
    if (box.top > 4 && box.bottom > window.innerHeight + 4) {
      stage.scrollIntoView({
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  }
}

function fromHash() {
  const [id, cardKey] = decodeURIComponent(location.hash.slice(1)).split('/');
  return { id: sectionsById.has(id) ? id : CONFIG.defaultSection, cardKey };
}

window.addEventListener('hashchange', () => {
  const { id, cardKey } = fromHash();
  openSection(id, { cardKey });
});

const initial = fromHash();
openSection(initial.id, { cardKey: initial.cardKey });
wheel.setAutoRotate(CONFIG.autoRotate, CONFIG.autoRotateEvery);

import { SECTIONS, TOPICS, CONFIG } from './content.js';
import { createTwistTitle } from './title-twist.js';
import { createWheel } from './wheel.js';
import { createPanel } from './panel.js';
import { preloadAll } from './card-image.js';

// The topic view: the same cards regrouped. Each topic becomes a section of
// its own with a head card, and takes the place of the sections it replaces.
const cardsById = new Map(SECTIONS.flatMap((s) => s.cards.map((c) => [c.id, c])));
const TOPIC_SECTIONS = TOPICS.topics.map((t) => ({
  id: t.id,
  label: t.label,
  cards: [{ id: t.id, head: true, image: t.image, title: t.label }, ...t.cards.map((id) => cardsById.get(id)).filter(Boolean)],
}));
const firstReplaced = SECTIONS.findIndex((s) => TOPICS.replaces.includes(s.id));
const VIEWS = {
  sections: SECTIONS,
  topics: [
    ...SECTIONS.slice(0, firstReplaced),
    ...TOPIC_SECTIONS,
    ...SECTIONS.slice(firstReplaced).filter((s) => !TOPICS.replaces.includes(s.id)),
  ],
};
const isTopic = (id) => TOPIC_SECTIONS.some((t) => t.id === id);

const sectionsById = new Map([...SECTIONS, ...TOPIC_SECTIONS].map((s) => [s.id, s]));

const stage = document.querySelector('[data-stage]');
const navList = document.querySelector('[data-nav]');
const titleCanvas = document.querySelector('[data-title]');

let current = null;
let deck = [];
let view = 'sections';

/* ---------- title ---------- */

document.fonts
  .load('800 100px "Unbounded"')
  .catch(() => null)
  .then(() => createTwistTitle(titleCanvas));

/* ---------- nav ---------- */

// "Start Here" sits next to the first section until any section is pressed;
// it comes back only on the next visit to the page.
const startId = SECTIONS[0].id;
let hintGone = false;
const viewSwitch = document.querySelector('[data-view]');

function renderNav() {
  navList.innerHTML = VIEWS[view]
    .map(
      (s) =>
        `<li><button type="button" data-section="${s.id}">${s.label}</button>` +
        (s.id === startId && !hintGone
          ? `<button type="button" class="sections__hint" data-section="${s.id}" data-hint>Start Here</button>`
          : '') +
        '</li>',
    )
    .join('');
  for (const button of viewSwitch.querySelectorAll('[data-view-pick]')) {
    button.setAttribute('aria-pressed', String(button.dataset.viewPick === view));
  }
  markNav();
}

navList.addEventListener('click', (e) => {
  const button = e.target.closest('[data-section]');
  if (!button) return;
  hintGone = true;
  navList.querySelector('[data-hint]')?.remove();
  openSection(button.dataset.section, { scroll: true });
});

// Switching view keeps the current section when it exists in both; a card of
// Work or Projects moves to its topic, and back.
viewSwitch.addEventListener('click', (e) => {
  const pick = e.target.closest('[data-view-pick]')?.dataset.viewPick;
  if (!pick || pick === view) return;
  view = pick;
  renderNav();
  if (VIEWS[view].includes(current)) return;
  const shown = deck[0] && current;
  const key = location.hash.split('/')[1];
  let target;
  if (view === 'topics') {
    target = TOPIC_SECTIONS.find((t) => t.cards.some((c) => c.id === key)) || TOPIC_SECTIONS[0];
  } else {
    target = SECTIONS.find((s) => TOPICS.replaces.includes(s.id) && s.cards.some((c) => c.id === key)) ||
      sectionsById.get(TOPICS.replaces[0]);
  }
  if (shown) openSection(target.id, { cardKey: target.cards.some((c) => c.id === key) ? key : undefined });
});

function markNav() {
  for (const button of navList.querySelectorAll('[data-section]:not([data-hint])')) {
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

const imagesOf = (section) => section.cards.map((card) => card.image).filter(Boolean);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function openSection(id, { cardKey, scroll = false } = {}) {
  const section = sectionsById.get(id) || sectionsById.get(CONFIG.defaultSection) || SECTIONS[0];

  if (current?.id === section.id) {
    if (cardKey) wheel.selectKey(cardKey);
    else wheel.select(0);
  } else {
    current = section;
    deck = buildDeck(section);
    const start = cardKey ? Math.max(0, deck.findIndex((d) => d.key === cardKey)) : 0;
    markNav();
    // Give the artwork a moment to arrive so the cards are dealt complete;
    // anything slower than that is dealt as soon as it loads.
    await Promise.race([preloadAll(imagesOf(section)), wait(350)]);
    if (current !== section) return; // another section was opened meanwhile
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

// A link to a topic opens the topic view.
function viewFor(id) {
  const wanted = isTopic(id) ? 'topics' : TOPICS.replaces.includes(id) ? 'sections' : view;
  if (wanted !== view) {
    view = wanted;
    renderNav();
  }
}

window.addEventListener('hashchange', () => {
  const { id, cardKey } = fromHash();
  viewFor(id);
  openSection(id, { cardKey });
});

const initial = fromHash();
if (isTopic(initial.id)) view = 'topics';
renderNav();
openSection(initial.id, { cardKey: initial.cardKey });
wheel.setAutoRotate(CONFIG.autoRotate, CONFIG.autoRotateEvery);

// Once the first section is on screen, fetch the artwork of the others in the
// background, one section at a time, so later switches have nothing to wait for.
const prefetchRest = async () => {
  for (const section of [...SECTIONS, ...TOPIC_SECTIONS]) {
    if (section === current) continue;
    await preloadAll(imagesOf(section));
  }
};
if ('requestIdleCallback' in window) requestIdleCallback(prefetchRest, { timeout: 4000 });
else setTimeout(prefetchRest, 2500);

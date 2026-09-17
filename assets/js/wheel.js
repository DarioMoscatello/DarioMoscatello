/*
 * Card wheel.
 *
 * Cards sit on a circle whose center is just below the bottom edge of the
 * wheel area, so only the upper fan is visible. The wheel position `p` is a
 * number of cards: p = 3 means card 3 is under the arrow. Every movement is a
 * tween of that number, followed by a stiff spring so that drags, taps and
 * draws blend into each other without jumps.
 *
 * The shake: each card hangs on a small hinge at its bottom edge. While the
 * wheel turns the cards lean against the motion, and when it stops they get a
 * light kick and swing back to rest.
 */

import { clamp, mod, springStep, ease } from './motion.js';

const SPACING = 27; // degrees between two cards
const RAD = Math.PI / 180;
const DEAL_MS = 760;
const EXIT_MS = 420;

const jitter = (i) => {
  const x = Math.sin((i + 1) * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export function createWheel(root, { onSettle, onTarget, onInteract } = {}) {
  const layer = root.querySelector('[data-wheel-cards]');
  const ringGroup = root.querySelector('[data-wheel-ring]');
  const drawButton = root.querySelector('[data-wheel-draw]');
  const ticksGroup = root.querySelector('[data-wheel-ticks]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const geo = { cw: 0, ch: 0, r: 0, cy: 0, lift: 0 };

  let deck = [];
  let n = 0;
  let cards = [];
  let leaving = [];

  let p = 0;
  let v = 0;
  let tween = null;
  let drag = null;
  let settled = false;
  let restIndex = -1;
  let spinning = false;
  let pendingPop = false;
  let lineOn = false;
  let raf = 0;
  let lastFrame = 0;
  let wheelAccum = 0;
  let autoTimer = 0;
  let autoEnabled = false;
  let autoEvery = 3600;

  /* ---------- dial ---------- */

  // Marks around the rim of the dial, outside the dashed circle: a short one
  // every 6 degrees and a long one every 30.
  function buildTicks() {
    if (!ticksGroup) return;
    const ns = 'http://www.w3.org/2000/svg';
    const frag = document.createDocumentFragment();
    for (let a = 0; a < 360; a += 6) {
      const long = a % 30 === 0;
      const outer = 117.4;
      const inner = long ? 105.5 : 111.5;
      const rad = ((a - 90) * Math.PI) / 180;
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', (Math.cos(rad) * outer).toFixed(2));
      line.setAttribute('y1', (Math.sin(rad) * outer).toFixed(2));
      line.setAttribute('x2', (Math.cos(rad) * inner).toFixed(2));
      line.setAttribute('y2', (Math.sin(rad) * inner).toFixed(2));
      if (long) line.setAttribute('class', 'is-long');
      frag.append(line);
    }
    ticksGroup.append(frag);
  }

  buildTicks();

  /* ---------- geometry ---------- */

  function layout() {
    const style = getComputedStyle(root);
    const safe = parseFloat(style.paddingBottom) || 0;
    const w = root.clientWidth;
    const h = root.clientHeight - safe;
    if (!w || !h) return;

    // 0.34 matches --cw-guess in the CSS for screens under 900px
    const byWidth = w * (w < 900 ? 0.34 : 0.19);
    const cw = clamp(Math.min((h - 16) / 2.62, byWidth), 84, w < 900 ? 250 : 280);
    geo.cw = cw;
    geo.ch = (cw * 10) / 7;
    geo.r = cw * 1.9;
    geo.lift = cw * 0.12;
    geo.cy = h + cw * 0.14;

    const s = root.style;
    s.setProperty('--cw', `${cw}px`);
    s.setProperty('--ch', `${geo.ch}px`);
    s.setProperty('--cy', `${geo.cy}px`);
    s.setProperty('--disc', `${cw * 1.2}px`);
    s.setProperty('--line-from', `${cw * 0.99}px`);
    s.setProperty('--line-to', `${geo.r + geo.lift - geo.ch / 2 - 1}px`);
    wake();
  }

  /* ---------- positions ---------- */

  function offsetFor(i, pos, count) {
    if (count < 3) return i - pos;
    const shift = count % 2 === 0 ? 0.5 : 0;
    let o = i - pos;
    o -= count * Math.floor((o + count / 2 - shift) / count);
    return o;
  }

  function visibilityFor(o, count) {
    if (count < 3) return 1;
    const shift = count % 2 === 0 ? 0.5 : 0;
    const edge = Math.min(o + count / 2 - shift, count / 2 + shift - o);
    return clamp(edge / 0.5, 0, 1);
  }

  function currentIndex() {
    if (!n) return -1;
    const target = tween ? tween.to : p;
    return n < 3 ? clamp(Math.round(target), 0, n - 1) : mod(Math.round(target), n);
  }

  /* ---------- deck ---------- */

  function makeCard(entry, i, now, start) {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'card';
    el.tabIndex = -1;
    el.setAttribute('aria-label', entry.data.title || 'Card');

    if (entry.data.image) {
      const img = document.createElement('img');
      img.className = 'card__img';
      img.src = entry.data.image;
      img.alt = '';
      img.decoding = 'async';
      img.draggable = false;
      el.append(img);
    } else {
      el.classList.add('card--blank');
      const blank = document.createElement('span');
      blank.className = 'card__blank';
      el.append(blank);
    }

    const card = {
      el,
      i,
      entry,
      tilt: 0,
      tiltV: 0,
      lift: 0,
      liftV: 0,
      hover: false,
      born: now,
      delay: Math.min(Math.abs(offsetFor(i, start, n)), 6) * 55,
      dealt: false,
    };

    el.addEventListener('click', () => {
      if (spinning) return;
      interact();
      select(card.i);
    });
    el.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') {
        card.hover = true;
        wake();
      }
    });
    el.addEventListener('pointerleave', () => {
      card.hover = false;
      wake();
    });

    layer.append(el);
    return card;
  }

  function setDeck(entries, { start = 0 } = {}) {
    const now = performance.now();
    for (const card of cards) {
      card.leaveOffset = offsetFor(card.i, p, n);
      card.leaveVisibility = visibilityFor(card.leaveOffset, n);
      card.exitStart = now;
      card.el.style.pointerEvents = 'none';
      card.el.setAttribute('aria-hidden', 'true');
      leaving.push(card);
    }

    deck = entries;
    n = entries.length;
    tween = null;
    drag = null;
    spinning = false;
    drawButton.setAttribute('aria-disabled', 'false');
    p = clamp(start, 0, Math.max(0, n - 1));
    v = 0;
    settled = false;
    restIndex = -1;
    setLine(false);
    cards = entries.map((entry, i) => makeCard(entry, i, now, p));
    wake();
  }

  /* ---------- movement ---------- */

  function moveTo(to, { kind = 'turn', duration, easing } = {}) {
    clearTimeout(autoTimer);
    const from = p;
    const dist = Math.abs(to - from);
    const reduced = reduceMotion.matches;
    let dur = duration ?? clamp(620 + dist * 170, 700, 1500);
    if (reduced) dur = Math.min(dur, 260);

    tween = {
      from,
      to,
      kind,
      start: performance.now(),
      dur,
      ease: easing || (kind === 'land' ? ease.land : ease.turn),
      dir: Math.sign(to - from),
      kicked: false,
    };
    if (dist < 0.0005) tween.dur = 1;
    settled = false;
    setLine(false);
    if (kind === 'turn' && n) {
      const index = n < 3 ? clamp(Math.round(to), 0, n - 1) : mod(Math.round(to), n);
      onTarget?.(deck[index], index);
    }
    wake();
  }

  function setLine(on) {
    if (on === lineOn) return;
    lineOn = on;
    root.classList.toggle('is-resting', on);
  }

  function select(index) {
    if (!n) return;
    const cur = tween ? tween.to : Math.round(p);
    let target = index;
    if (n >= 3) {
      let d = mod(index - cur, n);
      if (d > n / 2) d -= n;
      target = cur + d;
    }
    if (target === cur && settled && !tween) {
      const card = cards[mod(cur, n)];
      if (card && !reduceMotion.matches) {
        card.liftV += geo.lift * 7;
        wake();
      }
      return;
    }
    moveTo(target);
  }

  function selectKey(key) {
    const index = deck.findIndex((d) => d.key === key);
    if (index >= 0) select(index);
  }

  function step(dir) {
    if (!n || spinning) return;
    const cur = tween ? tween.to : Math.round(p);
    let target = cur + dir;
    if (n < 3) target = clamp(target, 0, n - 1);
    moveTo(target);
  }

  function draw() {
    if (spinning || n < 2) return;
    interact();
    const current = deck[currentIndex()];
    const all = deck.map((_, i) => i).filter((i) => !deck[i].head);
    const fresh = all.filter((i) => !current || deck[i].key !== current.key);
    const pool = fresh.length ? fresh : all;
    if (!pool.length) return;

    const pick = pool[Math.floor(Math.random() * pool.length)];
    spinning = true;
    drawButton.setAttribute('aria-disabled', 'true');
    root.classList.add('is-spinning');

    if (n < 3) {
      moveTo(pick, { kind: 'draw' });
      return;
    }

    const cur = Math.round(tween ? tween.to : p);
    let d = mod(pick - cur, n);
    const minSteps = reduceMotion.matches ? 1 : Math.max(14, n + 4);
    while (d < minSteps) d += n;

    // A quarter of a card of wind-up, then a fast start and a long slow-down.
    const back = 0.25 / d;
    const wind = 0.07;
    const spinEase = (t) =>
      t < wind
        ? (-back * (1 - Math.cos((Math.PI * t) / wind))) / 2
        : -back + (1 + back) * ease.spin((t - wind) / (1 - wind));

    moveTo(cur + d, {
      kind: 'draw',
      duration: clamp(1700 + d * 55, 2300, 3600),
      easing: reduceMotion.matches ? ease.out : spinEase,
    });
  }

  function kick(dir, strength = 1) {
    if (reduceMotion.matches || !dir) return;
    for (const card of cards) {
      // cards keep going a little when the wheel stops, then swing back
      card.tiltV -= dir * 34 * strength * (0.75 + 0.5 * jitter(card.i));
    }
  }

  /* ---------- frame loop ---------- */

  function wake() {
    if (!raf) {
      lastFrame = 0;
      raf = requestAnimationFrame(frame);
    }
  }

  function frame(now) {
    raf = 0;
    const dt = lastFrame ? Math.min((now - lastFrame) / 1000, 1 / 30) : 1 / 60;
    lastFrame = now;
    const reduced = reduceMotion.matches;
    let busy = false;

    if (drag && drag.active) {
      busy = true;
    } else if (tween) {
      busy = true;
      const t = (now - tween.start) / tween.dur;
      const target = tween.from + (tween.to - tween.from) * tween.ease(Math.min(1, t));
      [p, v] = springStep(p, v, target, 420, 38, dt);
      if (t >= 0.9 && !tween.kicked) {
        tween.kicked = true;
        kick(tween.dir, tween.kind === 'draw' ? 1.35 : 1);
      }
      if (t >= 1 && Math.abs(p - tween.to) < 0.003 && Math.abs(v) < 0.03) {
        p = tween.to;
        v = 0;
        const done = tween;
        tween = null;
        finishMove(done);
      }
    }

    if (ringGroup) ringGroup.style.transform = `rotate(${mod(-p * SPACING, 360)}deg)`;

    const restingNow = settled && !drag;
    for (const card of cards) {
      const o = offsetFor(card.i, p, n);
      const vis = visibilityFor(o, n);
      const dealT = reduced ? 1 : clamp((now - card.born - card.delay) / DEAL_MS, 0, 1);
      if (dealT < 1) busy = true;
      else card.dealt = true;
      const dealE = ease.out(dealT);

      const lean = reduced ? 0 : clamp(v * 0.9, -4.5, 4.5);
      [card.tilt, card.tiltV] = springStep(card.tilt, card.tiltV, lean, 150, 5.6, dt);

      const isRest = restingNow && card.i === restIndex && card.dealt;
      const hoverLift = card.hover && !spinning && !drag ? geo.lift * 0.4 : 0;
      const liftTarget = isRest ? geo.lift : hoverLift;
      [card.lift, card.liftV] = springStep(card.lift, card.liftV, liftTarget, 190, 19, dt);

      if (
        Math.abs(card.tilt - lean) > 0.02 ||
        Math.abs(card.tiltV) > 0.05 ||
        Math.abs(card.lift - liftTarget) > 0.15 ||
        Math.abs(card.liftV) > 0.3
      ) {
        busy = true;
      }

      const angle = o * SPACING + (1 - dealE) * SPACING * 1.25;
      const radius = geo.r * (0.66 + 0.34 * dealE) + card.lift;
      const opacity = vis * clamp(dealT * 2.2, 0, 1);
      let z = 1000 + Math.round(o * 10);
      if (card.lift > 1) z += 500;
      place(card, angle, radius, card.tilt, opacity, z);
    }

    leaving = leaving.filter((card) => {
      const t = reduced ? 1 : clamp((now - card.exitStart) / EXIT_MS, 0, 1);
      if (t >= 1) {
        card.el.remove();
        return false;
      }
      busy = true;
      const e = ease.in(t);
      const angle = card.leaveOffset * SPACING - e * SPACING * 1.1;
      const radius = geo.r * (1 - 0.34 * e) + card.lift * (1 - e);
      place(card, angle, radius, card.tilt * (1 - e), card.leaveVisibility * (1 - t), 10 + Math.round(card.leaveOffset * 10));
      return true;
    });

    const restCard = cards[restIndex];
    setLine(Boolean(restingNow && restCard && restCard.dealt));

    if (!settled && !tween && !(drag && drag.active) && n) {
      settle();
      busy = true;
    }

    if (busy) raf = requestAnimationFrame(frame);
  }

  function place(card, angle, radius, tilt, opacity, z) {
    const s = card.el.style;
    const hidden = opacity < 0.01 || Math.abs(angle) > 150;
    s.visibility = hidden ? 'hidden' : 'visible';
    if (hidden) return;
    const half = geo.ch / 2;
    s.transform =
      `rotate(${angle.toFixed(3)}deg) translate3d(0, ${(half - radius).toFixed(2)}px, 0) ` +
      `rotate(${tilt.toFixed(3)}deg) translate3d(0, ${(-half).toFixed(2)}px, 0)`;
    s.opacity = opacity >= 0.999 ? '' : opacity.toFixed(3);
    s.zIndex = z;
  }

  function finishMove(done) {
    if (done.kind === 'draw') {
      spinning = false;
      drawButton.setAttribute('aria-disabled', 'false');
      root.classList.remove('is-spinning');
      pendingPop = true;
    }
  }

  function settle() {
    settled = true;
    if (n >= 3) {
      // keep p small so numbers never grow without limit
      const whole = Math.round(p);
      const wrapped = mod(whole, n);
      p = wrapped + (p - whole);
    }
    const index = currentIndex();
    const drawn = pendingPop;
    if (pendingPop) {
      pendingPop = false;
      const card = cards[index];
      if (card && !reduceMotion.matches) card.liftV += geo.lift * 11;
    }
    if (index !== restIndex || drawn) {
      restIndex = index;
      onSettle?.(deck[index], index, { drawn });
    }
    scheduleAuto();
  }

  /* ---------- auto rotation (optional) ---------- */

  function setAutoRotate(enabled, seconds = 3.6) {
    autoEnabled = enabled;
    autoEvery = seconds * 1000;
    scheduleAuto();
  }

  function scheduleAuto() {
    clearTimeout(autoTimer);
    if (!autoEnabled || reduceMotion.matches) return;
    autoTimer = setTimeout(() => {
      if (!autoEnabled || document.hidden || spinning || drag) return scheduleAuto();
      step(1);
    }, autoEvery);
  }

  function interact() {
    if (autoEnabled) {
      autoEnabled = false;
      clearTimeout(autoTimer);
    }
    onInteract?.();
  }

  /* ---------- input ---------- */

  root.addEventListener('pointerdown', (e) => {
    if (e.button > 0 || spinning || !n) return;
    if (e.target.closest('[data-wheel-draw]')) return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, p0: p, t: e.timeStamp, vel: 0, active: false };
  });

  root.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;

    if (!drag.active) {
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        interact();
        drag.active = true;
        drag.x = e.clientX;
        drag.p0 = p;
        drag.t = e.timeStamp;
        tween = null;
        settled = false;
        setLine(false);
        root.classList.add('is-dragging');
        try {
          root.setPointerCapture(e.pointerId);
        } catch {
          /* pointer already released */
        }
        wake();
      } else if (Math.abs(dy) > 12) {
        drag = null;
      }
      return;
    }

    const slotPx = geo.r * SPACING * RAD;
    let next = drag.p0 - (e.clientX - drag.x) / slotPx;
    if (n < 3) {
      const max = n - 1;
      if (next < 0) next *= 0.35;
      if (next > max) next = max + (next - max) * 0.35;
    }
    const dt = Math.max(8, e.timeStamp - drag.t) / 1000;
    drag.vel = drag.vel * 0.55 + ((next - p) / dt) * 0.45;
    drag.t = e.timeStamp;
    v = drag.vel;
    p = next;
    wake();
  });

  function endDrag(e) {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    const { active, vel } = drag;
    drag = null;
    root.classList.remove('is-dragging');
    if (!active) return;
    let target = Math.round(p + clamp(vel, -14, 14) * 0.22);
    if (n < 3) target = clamp(target, 0, n - 1);
    moveTo(target, { kind: 'land', duration: clamp(420 + Math.abs(target - p) * 130, 460, 1200) });
  }

  root.addEventListener('pointerup', endDrag);
  root.addEventListener('pointercancel', endDrag);

  root.addEventListener('keydown', (e) => {
    if (e.target !== root) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      interact();
      step(e.key === 'ArrowRight' ? 1 : -1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      interact();
      select(0);
    }
  });

  // Horizontal trackpad swipes turn the wheel; vertical scrolling is left alone.
  root.addEventListener(
    'wheel',
    (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || spinning) return;
      e.preventDefault();
      wheelAccum += e.deltaX;
      if (Math.abs(wheelAccum) > 70) {
        interact();
        step(Math.sign(wheelAccum));
        wheelAccum = 0;
      }
    },
    { passive: false },
  );

  drawButton.addEventListener('click', () => draw());

  new ResizeObserver(layout).observe(root);
  reduceMotion.addEventListener('change', wake);
  layout();

  return {
    setDeck,
    select,
    selectKey,
    step,
    draw,
    setAutoRotate,
    get index() {
      return currentIndex();
    },
  };
}

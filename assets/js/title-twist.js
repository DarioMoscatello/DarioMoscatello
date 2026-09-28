import { cubicBezier } from './motion.js';

/*
 * Twisting title.
 *
 * The two words are printed on the four flat faces of a square bar that turns
 * on its horizontal axis: black front word, outlined back word, black,
 * outlined. At any moment at most two
 * faces look at the viewer, one above the other, and as one grows the other
 * shrinks. The turn angle also changes along the width, so each vertical slice
 * of the title is a little further round than the one on its left: that is the
 * twist, and it is what makes the two words cross.
 *
 * It does not spin all the time: a quick quarter turn brings DARIODARIO to the
 * front, a short stop, another quick quarter turn brings MOSCATELLO to the
 * front and overshoots into a small shake, then it rests before starting
 * again. "To the front" means the word faces the viewer at the middle of the
 * title; the twist leans it away towards the two ends.
 *
 * Every frame, each 1px column of the pre-rendered words is copied onto the
 * canvas once per visible face, squashed to the height that face shows.
 */

const TAU = Math.PI * 2;
const HALF_PI = Math.PI / 2;
const QUARTER_PI = Math.PI / 4;

// Quick start, soft stop: the first quarter turn.
const easeTurn = cubicBezier(0.6, 0, 0.25, 1);
// Still moving when it arrives, so the spring has a speed to overshoot with.
const easeInto = cubicBezier(0.55, 0, 0.75, 0.75);

export function createTwistTitle(canvas, options = {}) {
  const o = {
    front: 'DARIODARIO',
    back: 'MOSCATELLO',
    family: '"Unbounded", "Arial Black", system-ui, sans-serif',
    weight: 800,
    ink: '#000000',
    twist: 2.45, // radians from left edge to right edge, as in the reference
    turn: 0.8, // seconds of each quarter turn
    pause: 1.5, // seconds DARIODARIO stays in front
    rest: 7, // seconds MOSCATELLO stays in front before the next round
    // The shake after the second turn is a damped spring: how far it swings
    // past MOSCATELLO (radians), how fast it wobbles and how soon it dies out.
    shake: 0.16,
    shakeRate: 12, // radians per second
    shakeDamping: 4, // per second
    ...options,
  };

  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const faces = [document.createElement('canvas'), document.createElement('canvas')];

  let width = 0; // device px
  let height = 0;
  let texH = 0;
  let corner = 0; // distance from the axis to an edge of the bar
  let centerY = 0;
  let column = 1;
  let raf = 0;
  let inView = true;
  let clock = 0; // seconds of animation actually played
  let last = 0;

  function measureWord(m, word) {
    let w = 0;
    for (const ch of word) w += m.measureText(ch).width;
    return w;
  }

  function layout() {
    const cssWidth = canvas.clientWidth;
    if (!cssWidth) return false;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // One slice per screen pixel, a little coarser on very wide canvases so the
    // number of draws per frame stays roughly constant.
    column = Math.max(1, Math.round(dpr), Math.ceil((cssWidth * dpr) / 1100));

    const m = document.createElement('canvas').getContext('2d');
    m.font = `${o.weight} 100px ${o.family}`;
    const cap100 = m.measureText('DMOSC').actualBoundingBoxAscent || 72;
    const letters = Math.max(o.front.length, o.back.length);
    const minTrack = 0.035; // em

    width = Math.round(cssWidth * dpr);
    const widest = Math.max(measureWord(m, o.front), measureWord(m, o.back)) / 100;
    const roughSize = width / (widest + minTrack * (letters - 1));
    const stroke = Math.max(1.4 * dpr, roughSize * 0.021);
    const inset = Math.ceil(stroke * 2);
    const usable = width - inset * 2;
    const fontSize = usable / (widest + minTrack * (letters - 1));
    const cap = (cap100 / 100) * fontSize;
    const pad = Math.ceil(stroke * 1.5);

    // The letters fill a face; the bar is tallest seen corner-on.
    texH = Math.ceil(cap + pad * 2);
    corner = texH / Math.SQRT2;
    height = Math.ceil(corner * 2 + stroke * 2);
    centerY = height / 2;

    canvas.width = width;
    canvas.height = height;
    canvas.style.height = `${height / dpr}px`;

    const words = [o.front, o.back];
    faces.forEach((face, i) => {
      face.width = width;
      face.height = texH;
      const f = face.getContext('2d');
      f.font = `${o.weight} ${fontSize}px ${o.family}`;
      f.textBaseline = 'alphabetic';
      f.lineJoin = 'round';
      const word = words[i];
      const gap = (usable - measureWord(f, word)) / (word.length - 1);
      let x = inset;
      for (const ch of word) {
        if (i === 0) {
          f.fillStyle = o.ink;
          f.fillText(ch, x, pad + cap);
        } else {
          // Stroke first at double width, then cut the letter shape out: that
          // removes the inner half of the stroke and any overlapping contours
          // of the font, and leaves the letter hollow so the page shows
          // through, as in the reference.
          f.lineWidth = stroke * 2;
          f.strokeStyle = o.ink;
          f.strokeText(ch, x, pad + cap);
          f.globalCompositeOperation = 'destination-out';
          f.fillText(ch, x, pad + cap);
          f.globalCompositeOperation = 'source-over';
        }
        x += f.measureText(ch).width + gap;
      }
    });
    return true;
  }

  /*
   * Turn of the bar at a given time. 0 is DARIODARIO in front, -PI/2 is
   * MOSCATELLO in front; the angle only goes down, so the text rolls downward.
   * One round is two quarter turns, and it starts with MOSCATELLO in front.
   */
  function angleAt(time) {
    const round = o.turn * 2 + o.pause + o.rest;
    const n = Math.floor(time / round);
    let t = time - n * round;
    const start = -HALF_PI - n * Math.PI;

    if (t < o.turn) return start - HALF_PI * easeTurn(t / o.turn);
    t -= o.turn;
    if (t < o.pause) return start - HALF_PI;
    t -= o.pause;
    if (t < o.turn) return start - HALF_PI - HALF_PI * easeInto(t / o.turn);
    t -= o.turn;

    // A damped wobble around MOSCATELLO. It starts at the speed the turn
    // arrived with (shake * shakeRate, about PI / 2 per turn second), so the
    // turn runs straight into the overshoot without a jolt.
    const end = start - Math.PI;
    const decay = Math.exp(-o.shakeDamping * t);
    return end - o.shake * decay * Math.sin(o.shakeRate * t);
  }

  function render(time) {
    ctx.clearRect(0, 0, width, height);
    const base = angleAt(time);

    for (let x = 0; x < width; x += column) {
      const cw = Math.min(column, width - x);
      const phase = base + ((x + cw / 2) / width - 0.5) * o.twist;

      for (let j = 0; j < 4; j++) {
        // psi is where the face points: 0 straight at the viewer, positive up.
        let psi = phase + j * HALF_PI;
        psi -= TAU * Math.floor((psi + Math.PI) / TAU); // keep in [-PI, PI)
        if (psi <= -HALF_PI || psi >= HALF_PI) continue; // facing away

        // The face runs between the two edges at psi + 45deg and psi - 45deg.
        const yTop = centerY - corner * Math.sin(psi + QUARTER_PI);
        const h = centerY - corner * Math.sin(psi - QUARTER_PI) - yTop;
        if (h < 0.4) continue;

        ctx.drawImage(faces[j & 1], x, 0, cw, texH, x, yTop, cw, h);
      }
    }
  }

  function tick(now) {
    raf = 0;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;
    clock += dt;
    render(clock);
    schedule();
  }

  function schedule() {
    if (raf || !inView || document.hidden || reduceMotion.matches) {
      if (!raf) last = 0;
      return;
    }
    raf = requestAnimationFrame(tick);
  }

  function redraw() {
    if (!layout()) return;
    render(reduceMotion.matches ? o.turn : clock); // DARIODARIO in front
  }

  const resizeObserver = new ResizeObserver(() => redraw());
  resizeObserver.observe(canvas);

  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    schedule();
  });
  io.observe(canvas);

  document.addEventListener('visibilitychange', schedule);
  reduceMotion.addEventListener('change', () => {
    redraw();
    schedule();
  });

  redraw();
  schedule();

  return {
    redraw,
    destroy() {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      io.disconnect();
    },
  };
}

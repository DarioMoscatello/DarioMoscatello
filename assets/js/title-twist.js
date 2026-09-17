/*
 * Twisting title.
 *
 * The two words are printed as four lines around a drum that turns on its
 * horizontal axis (black word, white word, black word, white word). The turn
 * angle also changes along the width, so each vertical slice of the title is a
 * little further around the drum than the one on its left: that is the twist.
 * Only the half of the drum facing the viewer is drawn.
 *
 * Every frame, each 1px column of the pre-rendered words is copied onto the
 * canvas with the height and position it has on the drum.
 */

const TAU = Math.PI * 2;
const HALF_PI = Math.PI / 2;

export function createTwistTitle(canvas, options = {}) {
  const o = {
    front: 'DARIODARIO',
    back: 'MOSCATELLO',
    family: '"Unbounded", "Arial Black", system-ui, sans-serif',
    weight: 800,
    ink: '#000000',
    paper: '#FFFFFF',
    speed: 2.0, // radians per second
    twist: 2.9, // extra radians from left edge to right edge
    halfAngle: 0.75, // how much of the drum one line of text covers
    lines: 4,
    ...options,
  };

  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const faces = [document.createElement('canvas'), document.createElement('canvas')];

  let width = 0; // device px
  let height = 0;
  let texH = 0;
  let radius = 0;
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
    const pad = Math.ceil(cap * 0.09 + stroke);

    texH = Math.ceil(cap + pad * 2);
    radius = texH / (2 * Math.sin(o.halfAngle));
    height = Math.ceil(radius * 2 + stroke * 4);
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
          // Stroke first at double width, then fill on top: the fill hides the
          // inner half of the stroke and any overlapping contours of the font.
          f.lineWidth = stroke * 2;
          f.strokeStyle = o.ink;
          f.strokeText(ch, x, pad + cap);
          f.fillStyle = o.paper;
          f.fillText(ch, x, pad + cap);
        }
        x += f.measureText(ch).width + gap;
      }
    });
    return true;
  }

  function render(time) {
    ctx.clearRect(0, 0, width, height);
    let currentAlpha = 1;
    const at = o.halfAngle;
    const span = at * 2;
    const step = TAU / o.lines;
    const base = time * o.speed;

    for (let x = 0; x < width; x += column) {
      const cw = Math.min(column, width - x);
      const phase = base + ((x + cw / 2) / width) * o.twist;

      for (let j = 0; j < o.lines; j++) {
        let phi = phase + j * step;
        phi -= TAU * Math.floor((phi + Math.PI) / TAU); // keep in [-PI, PI)

        const top = phi + at;
        const bottom = phi - at;
        const hi = top < HALF_PI ? top : HALF_PI;
        const lo = bottom > -HALF_PI ? bottom : -HALF_PI;
        if (hi <= lo) continue; // this line is on the back of the drum

        const yTop = centerY - radius * Math.sin(hi);
        const h = centerY - radius * Math.sin(lo) - yTop;
        if (h < 0.4) continue;

        const sy = ((top - hi) / span) * texH;
        const sh = ((hi - lo) / span) * texH;

        // A line rolling over the edge of the drum loses part of its letters.
        // Fade it as it goes instead of showing the cut.
        const seen = (hi - lo) / span;
        const alpha = seen >= 0.9 ? 1 : (seen - 0.42) / 0.48;
        if (alpha <= 0) continue;
        const wanted = alpha < 1 ? alpha * alpha : 1;
        if (wanted !== currentAlpha) {
          ctx.globalAlpha = wanted;
          currentAlpha = wanted;
        }
        ctx.drawImage(faces[j & 1], x, sy, cw, sh, x, yTop, cw, h);
      }
    }
    if (currentAlpha !== 1) ctx.globalAlpha = 1;
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
    render(reduceMotion.matches ? 0.55 : clock);
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

export const clamp = (v, min, max) => (v < min ? min : v > max ? max : v);

export const mod = (a, n) => ((a % n) + n) % n;

/** CSS-like cubic-bezier easing, solved numerically. */
export function cubicBezier(x1, y1, x2, y2) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t) => (3 * ax * t + 2 * bx) * t + cx;

  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 6; i++) {
      const d = sampleX(t) - x;
      const s = slopeX(t);
      if (Math.abs(d) < 1e-5) return sampleY(t);
      if (Math.abs(s) < 1e-6) break;
      t -= d / s;
    }
    let lo = 0;
    let hi = 1;
    t = x;
    for (let i = 0; i < 24; i++) {
      const v = sampleX(t);
      if (Math.abs(v - x) < 1e-5) break;
      if (v < x) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return sampleY(t);
  };
}

/** Advances a damped spring by dt. Returns [position, velocity]. */
export function springStep(x, v, target, stiffness, damping, dt) {
  const a = stiffness * (target - x) - damping * v;
  const nv = v + a * dt;
  return [x + nv * dt, nv];
}

export const ease = {
  // Slow start, quick middle, long soft landing (the step in the reference video).
  turn: cubicBezier(0.65, 0, 0.2, 1),
  // Used after a drag: the wheel already moves, so it only needs to land.
  land: cubicBezier(0.2, 0.7, 0.2, 1),
  // Random draw: leaves fast, slows down for a long time.
  spin: cubicBezier(0.16, 0.72, 0.24, 1),
  out: cubicBezier(0.22, 1, 0.36, 1),
  in: cubicBezier(0.55, 0, 1, 0.45),
};

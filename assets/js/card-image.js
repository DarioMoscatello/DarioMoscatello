/*
 * Card images: one shared cache for loading, and the colour used for the line
 * under the arrow.
 *
 * The colour is the dominant colour around the outside of the card. For a card
 * that is white at the edges, the border tells us nothing, so the strongest
 * colour inside it is used instead (the blue of the Bocconi B, the navy of the
 * Hedels roof) and plain black and white cards fall back to the dial colour.
 */

const loading = new Map();
const colors = new Map();

/** Loads and decodes an image once; later calls get the same promise. */
export function loadImage(src) {
  if (loading.has(src)) return loading.get(src);
  const task = new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
    const done = () => resolve(img.naturalWidth ? img : null);
    if (img.complete) {
      done();
      return;
    }
    img.addEventListener('load', () => {
      if (img.decode) img.decode().then(done, done);
      else done();
    });
    img.addEventListener('error', () => resolve(null));
  });
  loading.set(src, task);
  return task;
}

export function preloadAll(sources) {
  return Promise.all(sources.filter(Boolean).map(loadImage));
}

const luminance = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

function saturation(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max === 0 ? 0 : (max - min) / max;
}

function pick(pixels, width, height, test, edgeOnly) {
  const buckets = new Map();
  const band = Math.max(2, Math.round(Math.min(width, height) * 0.09));
  let looked = 0;
  let opaque = 0;

  for (let y = 0; y < height; y++) {
    const onEdgeRow = y < band || y >= height - band;
    for (let x = 0; x < width; x++) {
      if (edgeOnly && !onEdgeRow && x >= band && x < width - band) continue;
      const i = (y * width + x) * 4;
      looked++;
      if (pixels[i + 3] < 200) continue;
      opaque++;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      if (!test(r, g, b)) continue;
      const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
      const bucket = buckets.get(key) || [0, 0, 0, 0];
      bucket[0] += r;
      bucket[1] += g;
      bucket[2] += b;
      bucket[3] += 1;
      buckets.set(key, bucket);
    }
  }

  let best = null;
  let bestScore = 0;
  for (const bucket of buckets.values()) {
    const r = bucket[0] / bucket[3];
    const g = bucket[1] / bucket[3];
    const b = bucket[2] / bucket[3];
    // How many pixels, but a pure colour beats a blend of the same size: on a
    // small logo most pixels are the soft edge between ink and paper.
    const score = bucket[3] * (edgeOnly ? 1 : 0.25 + saturation(r, g, b));
    if (score > bestScore) {
      bestScore = score;
      best = bucket;
    }
  }
  if (!best) return null;
  return {
    rgb: [best[0] / best[3], best[1] / best[3], best[2] / best[3]],
    solid: looked ? opaque / looked : 0,
  };
}

const hex = ([r, g, b]) =>
  '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

/** Dominant colour of a card, or null when it has none worth using. */
export async function cardColor(src) {
  if (!src) return null;
  if (colors.has(src)) return colors.get(src);

  const task = (async () => {
    const img = await loadImage(src);
    if (!img) return null;
    try {
      const w = 120;
      const h = Math.max(1, Math.round((img.naturalHeight / img.naturalWidth) * w));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, w, h);
      const { data } = ctx.getImageData(0, 0, w, h);

      // The border of the card, as long as it is actually filled in and dark
      // enough to be seen against the dial.
      const edge = pick(data, w, h, () => true, true);
      if (edge && edge.solid > 0.4 && luminance(...edge.rgb) < 0.72) return hex(edge.rgb);

      // Otherwise the strongest colour in the artwork itself.
      const inside = pick(
        data,
        w,
        h,
        (r, g, b) => saturation(r, g, b) > 0.22 && luminance(r, g, b) > 0.06 && luminance(r, g, b) < 0.82,
        false,
      );
      return inside ? hex(inside.rgb) : null;
    } catch {
      return null; // a browser that refuses to read the canvas
    }
  })();

  colors.set(src, task);
  return task;
}

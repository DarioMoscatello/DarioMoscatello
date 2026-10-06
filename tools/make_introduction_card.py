"""Builds the Introduction card in About, drawn like the section covers: a
blue note card lying on the desk with my signature written across it, and a
fountain pen in the manner of the great jewellers beside it: gold two-tone
nib, ribbed blue lacquer barrel, gold rings and clip, a blue cabochon at the
end. The signature is lifted from the earlier photo card, kept in
About/_saved/INTRODUCTION_card_photo.svg.

    pip install fonttools brotli pillow numpy
    python3 tools/make_introduction_card.py
"""

import base64
import io
import math
import os
import re
import sys

import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import make_covers as mc  # noqa: E402

PHOTO = os.path.join(ROOT, 'About/_saved/INTRODUCTION_card_photo.svg')

# ---------- the signature, lifted from the photo card ----------
s = open(PHOTO, encoding='utf-8').read()
im = np.array(Image.open(io.BytesIO(base64.b64decode(
    re.search(r'data:image/webp;base64,([A-Za-z0-9+/=]+)', s).group(1)))).convert('RGB')).astype(int)
r, g, b = im[..., 0], im[..., 1], im[..., 2]
ink = np.clip(((b - r) - 25) / 40, 0, 1) * ((b - g) > 15)  # the blue ink only
ys, xs = np.where(ink > 0.5)
x0, x1, y0, y1 = xs.min() - 12, xs.max() + 12, ys.min() - 12, ys.max() + 12
mask = Image.fromarray((ink[y0:y1, x0:x1] * 255).astype(np.uint8))
SIG_W, SIG_H = mask.size


def signature(color=(176, 206, 255), glow=(70, 120, 220)):
    """The signature as light: a sharp line in `color` over a soft halo."""
    w, h = mask.size
    halo = mask.filter(ImageFilter.GaussianBlur(9))
    out = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    out.paste(Image.new('RGBA', (w, h), glow + (255,)), (0, 0), halo.point(lambda v: int(v * 0.55)))
    out.paste(Image.new('RGBA', (w, h), color + (255,)), (0, 0), mask)
    buf = io.BytesIO()
    out.save(buf, 'WEBP', quality=90, method=6)
    return base64.b64encode(buf.getvalue()).decode()


# ---------- the pen ----------
PEN_DEFS = """<linearGradient id="lacquer" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3C63A8"/><stop offset="0.28" stop-color="#16326A"/>
      <stop offset="0.7" stop-color="#081530"/><stop offset="1" stop-color="#030812"/>
    </linearGradient>
    <linearGradient id="blackLacquer" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4A5468"/><stop offset="0.3" stop-color="#121722"/><stop offset="1" stop-color="#020306"/>
    </linearGradient>
    <linearGradient id="goldBand" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFF4CF"/><stop offset="0.3" stop-color="#FFD066"/>
      <stop offset="0.7" stop-color="#A9781F"/><stop offset="1" stop-color="#5C410D"/>
    </linearGradient>
    <radialGradient id="cabochon" cx="35%" cy="30%" r="75%">
      <stop offset="0" stop-color="#CFE0FF"/><stop offset="0.25" stop-color="#3E74E0"/>
      <stop offset="0.75" stop-color="#0D2A78"/><stop offset="1" stop-color="#05102E"/>
    </radialGradient>"""


def luxury_pen(x, y, angle, scale=1.0):
    """Drawn along +x with the nib tip at the origin, then turned to lie on
    the desk: nib, black section, gold ring, ribbed blue barrel, gold trims,
    posted cap with its clip, blue cabochon."""
    d = 30  # barrel diameter
    r = d / 2
    out = [
        # soft shadow on the desk
        f'<ellipse cx="190" cy="{r + 10}" rx="200" ry="9" fill="#000" fill-opacity="0.55"/>',
        # nib: gold outside and a paler inlay, slit and breather hole
        '<path d="M0,0 C14,-5 30,-10 52,-11 L52,11 C30,10 14,5 0,0 Z" fill="url(#goldBand)" stroke="#FFE3A0" stroke-width="0.9"/>',
        '<path d="M10,0 C20,-3 30,-6 40,-6.5 L40,6.5 C30,6 20,3 10,0 Z" fill="#F4E7C6" fill-opacity="0.85"/>',
        '<line x1="3" y1="0" x2="34" y2="0" stroke="#5A3E0E" stroke-width="1.2"/>',
        '<circle cx="36" cy="0" r="1.8" fill="#5A3E0E"/>',
        # section, black lacquer, tapering towards the nib
        f'<path d="M50,-11 L84,-{r - 1} L84,{r - 1} L50,11 Z" fill="url(#blackLacquer)"/>',
        f'<rect x="84" y="-{r}" width="7" height="{d}" rx="2" fill="url(#goldBand)"/>',
        # barrel: blue lacquer with fine lengthwise ribs
        f'<rect x="91" y="-{r}" width="170" height="{d}" fill="url(#lacquer)"/>',
    ]
    for k in range(1, 8):
        yy = -r + k * d / 8
        out.append(f'<line x1="93" y1="{yy:.1f}" x2="259" y2="{yy:.1f}" stroke="#9DBBF0" '
                   f'stroke-opacity="{0.28 if k < 4 else 0.14}" stroke-width="0.8"/>')
    out += [
        # gold trims at the end of the barrel
        f'<rect x="261" y="-{r + 0.5}" width="10" height="{d + 1}" rx="1.5" fill="url(#goldBand)"/>',
        f'<rect x="273" y="-{r}" width="3" height="{d}" fill="url(#goldBand)"/>',
        # posted cap, polished black, with a gold clip on top
        f'<rect x="278" y="-{r + 2}" width="92" height="{d + 4}" rx="3" fill="url(#blackLacquer)"/>',
        f'<rect x="278" y="-{r + 2}" width="6" height="{d + 4}" fill="url(#goldBand)"/>',
        f'<path d="M292,-{r + 3} L362,-{r + 3} Q368,-{r + 3} 368,-{r - 2} L368,-{r - 6} L300,-{r - 6} '
        f'Q292,-{r - 6} 292,-{r} Z" fill="url(#goldBand)" stroke="#FFE3A0" stroke-width="0.6"/>',
        f'<circle cx="300" cy="-{r - 3}" r="3.2" fill="#FFE3A0"/>',
        # gold seat and the blue cabochon
        f'<rect x="370" y="-{r - 1}" width="6" height="{d - 2}" rx="1.5" fill="url(#goldBand)"/>',
        f'<ellipse cx="381" cy="0" rx="9" ry="{r - 3}" fill="url(#cabochon)" stroke="#FFD066" stroke-width="1.2"/>',
        '<ellipse cx="379" cy="-5" rx="2.6" ry="3.4" fill="#FFFFFF" fill-opacity="0.75"/>',
    ]
    return (f'<g transform="translate({x:.1f} {y:.1f}) rotate({angle:.2f}) scale({scale})">'
            + ''.join(out) + '</g>')


# ---------- the card ----------
def card():
    u = 470
    base = (mc.W / 2 - 0.15 * u, 930)
    sx, sy, sz = 1.0, 0.68, 0.02
    on = lambda i, j: mc.iso(base, u, i * sx, j * sy, sz)
    lines = ''.join(mc.line(on(0.12, j), on(0.88, j), mc.EDGE_SOFT, 1.3, None, 0.9) for j in (0.3, 0.45, 0.6, 0.75))

    # the signature lies on the card: mapped with the card's own iso axes
    o = on(0.34, 0.08)
    ax = (mc.COS30 * u * sx, -0.5 * u * sx)  # along i
    ay = (-mc.COS30 * u * sy, -0.5 * u * sy)  # along j
    w_i = 0.6
    h_j = w_i * SIG_H / SIG_W * sx / sy
    m = (ax[0] * w_i / SIG_W, ax[1] * w_i / SIG_W, ay[0] * h_j / SIG_H, ay[1] * h_j / SIG_H)
    sig = (f'<image width="{SIG_W}" height="{SIG_H}" href="data:image/webp;base64,{signature()}" '
           f'transform="matrix({m[0]:.5f} {m[1]:.5f} {m[2]:.5f} {m[3]:.5f} {o[0]:.1f} {o[1]:.1f}) '
           f'translate(0 {SIG_H}) scale(1 -1)"/>')
    note = mc.box(base, u, sx, sy, sz, lines + sig)

    # the pen lies on the desk in front of the card, along the i axis
    pa = mc.iso(base, u, 0.04, -0.24, 0)
    angle = math.degrees(math.atan2(-0.5, mc.COS30))
    shadow = (f'<ellipse cx="{base[0] + 40:.1f}" cy="{base[1] - 120:.1f}" rx="{u * 0.62:.1f}" '
              f'ry="{u * 0.3:.1f}" fill="#000" fill-opacity="0.45"/>')
    glow = f'<circle cx="{pa[0]:.1f}" cy="{pa[1]:.1f}" r="40" fill="url(#landing)"/>'
    body = '\n    '.join([
        shadow,
        mc.dimension(mc.iso(base, u, 0, -0.06, 0), mc.iso(base, u, sx, -0.06, 0)),
        note, glow, luxury_pen(pa[0], pa[1], angle, 0.86),
    ])
    svg = mc.frame('INTRODUCTION', 'a blue note card with my signature, a fountain pen beside it', body)
    svg = svg.replace('  </defs>', '    ' + PEN_DEFS + '\n  </defs>', 1)
    mc.write('About/INTRODUCTION_card_site_ready.svg', svg)


if __name__ == '__main__':
    card()

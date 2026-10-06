"""Builds the Projects cover: drawn, not generated. On black, a blue isometric
block like a page of a blueprint, its hidden edges dashed; on top an empty
slot, and above it a smaller block about to drop in. The one warm note is the
gold light where the piece will land, as the gold heart of the Readings rose.
A faint dot grid and a hairline orbit tie it to the Readings card.

    pip install fonttools brotli
    python3 tools/make_projects_card.py
"""

import base64
import io
import os

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'Projects/PROJECTS_AI_exploded_site_ready.svg')
FONT = os.path.join(ROOT, 'assets/fonts/geist-mono-latin-500-normal.woff2')

W, H, RX = 829, 1184, 72

# Label: same font, size and spot as the other section covers.
LABEL = 'PROJECTS'
LABEL_X, LABEL_Y, LABEL_SIZE, LABEL_TRACK = 71.1, 150.9, 43.1, 0.262

# Colours taken from the Readings rose.
BLACK = '#020306'
NAVY = '#07132B'
BLUE_DARK = '#10295A'
BLUE = '#13305F'
BLUE_MID = '#25467A'
EDGE = '#6F9AD6'
EDGE_SOFT = '#3B5E95'
GOLD = '#FFD066'

COS30 = 0.8660254


def iso(origin, size, i, j, k):
    """Point of a cube: i to the right-back, j to the left-back, k up."""
    ox, oy = origin
    return (ox + (i - j) * COS30 * size, oy - (i + j) * 0.5 * size - k * size)


def pts(points):
    return ' '.join(f'{x:.1f},{y:.1f}' for x, y in points)


def cube(origin, size, slot=None):
    """Three visible faces, front edges solid, hidden edges dashed."""
    p = lambda i, j, k: iso(origin, size, i, j, k)
    top = [p(0, 0, 1), p(1, 0, 1), p(1, 1, 1), p(0, 1, 1)]
    right = [p(0, 0, 0), p(1, 0, 0), p(1, 0, 1), p(0, 0, 1)]
    left = [p(0, 0, 0), p(0, 1, 0), p(0, 1, 1), p(0, 0, 1)]
    out = [
        f'<polygon points="{pts(left)}" fill="{NAVY}"/>',
        f'<polygon points="{pts(right)}" fill="{BLUE_DARK}"/>',
        f'<polygon points="{pts(top)}" fill="url(#topFace)"/>',
    ]
    # hidden edges, through the block, as on a technical drawing
    back = p(1, 1, 0)
    for q in (p(1, 0, 0), p(0, 1, 0), p(1, 1, 1)):
        out.append(f'<line x1="{back[0]:.1f}" y1="{back[1]:.1f}" x2="{q[0]:.1f}" y2="{q[1]:.1f}" '
                   f'stroke="{EDGE_SOFT}" stroke-width="1.2" stroke-dasharray="5 7" stroke-opacity="0.7"/>')
    if slot:
        out.append(slot)
    edges = [
        (p(0, 0, 0), p(1, 0, 0)), (p(0, 0, 0), p(0, 1, 0)), (p(0, 0, 0), p(0, 0, 1)),
        (p(1, 0, 0), p(1, 0, 1)), (p(0, 1, 0), p(0, 1, 1)),
        (p(0, 0, 1), p(1, 0, 1)), (p(0, 0, 1), p(0, 1, 1)),
        (p(1, 0, 1), p(1, 1, 1)), (p(0, 1, 1), p(1, 1, 1)),
    ]
    for a, b in edges:
        out.append(f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" '
                   f'stroke="{EDGE}" stroke-width="1.6" stroke-linecap="round"/>')
    return '\n    '.join(out)


def label_font():
    options = subset.Options()
    options.flavor = 'woff2'
    font = TTFont(FONT)
    subsetter = subset.Subsetter(options)
    subsetter.populate(text=LABEL)
    subsetter.subset(font)
    buffer = io.BytesIO()
    font.flavor = 'woff2'
    font.save(buffer)
    data = base64.b64encode(buffer.getvalue()).decode()
    return f"@font-face{{font-family:'Geist Mono Card';font-weight:500;src:url(data:font/woff2;base64,{data}) format('woff2')}}"


def card():
    a = 236  # big block
    b = 0.36 * a  # the piece
    base = (W / 2, 968)  # front-bottom corner of the big block

    # Slot on the top face, centred, the size of the piece.
    u0 = (1 - b / a) / 2
    s = lambda i, j: iso(base, a, u0 + i * b / a, u0 + j * b / a, 1)
    slot_pts = [s(0, 0), s(1, 0), s(1, 1), s(0, 1)]
    cx = sum(x for x, _ in slot_pts) / 4
    cy = sum(y for _, y in slot_pts) / 4
    slot = (
        f'<polygon points="{pts(slot_pts)}" fill="{GOLD}" fill-opacity="0.16" filter="url(#glow)"/>\n    '
        f'<polygon points="{pts(slot_pts)}" fill="none" stroke="{GOLD}" stroke-width="1.3" '
        f'stroke-dasharray="4 5" stroke-opacity="0.85"/>\n    '
        f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="3.2" fill="{GOLD}"/>'
    )

    # The piece hovers above its slot; guides drop from two of its corners.
    lift = 1.15 * a
    piece_origin = (s(0, 0)[0], s(0, 0)[1] - lift)
    piece = cube(piece_origin, b)
    guides = []
    for i, j in ((0, 0), (1, 0), (0, 1)):
        top = iso(piece_origin, b, i, j, 0)
        bottom = s(i, j)
        guides.append(f'<line x1="{top[0]:.1f}" y1="{top[1]:.1f}" x2="{bottom[0]:.1f}" y2="{bottom[1]:.1f}" '
                      f'stroke="{EDGE_SOFT}" stroke-width="1" stroke-dasharray="2 6" stroke-opacity="0.8"/>')

    # A dimension line along the front-right edge, as on a drawing.
    d0, d1 = iso(base, a, 0, -0.16, 0), iso(base, a, 1, -0.16, 0)
    t = 9  # tick half-length, across the line
    dim = (
        f'<line x1="{d0[0]:.1f}" y1="{d0[1]:.1f}" x2="{d1[0]:.1f}" y2="{d1[1]:.1f}" '
        f'stroke="{EDGE_SOFT}" stroke-width="1" stroke-opacity="0.85"/>'
        + ''.join(
            f'<line x1="{x - t * 0.5:.1f}" y1="{y - t * COS30:.1f}" x2="{x + t * 0.5:.1f}" y2="{y + t * COS30:.1f}" '
            f'stroke="{EDGE_SOFT}" stroke-width="1" stroke-opacity="0.85"/>'
            for x, y in (d0, d1)
        )
    )

    orbit_c = (W / 2, 690)
    orbit_r = 372

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}"
     role="img" aria-label="Projects: a blue block on black with a smaller block about to drop into a lit slot">
  <style>{label_font()}
    .label {{ font-family: 'Geist Mono Card', 'Geist Mono', ui-monospace, monospace; font-weight: 500; font-size: {LABEL_SIZE}px; letter-spacing: {LABEL_TRACK}em; fill: #FFFFFF; }}
  </style>
  <defs>
    <clipPath id="cardClip"><rect width="{W}" height="{H}" rx="{RX}" ry="{RX}"/></clipPath>
    <radialGradient id="haze" cx="50%" cy="62%" r="62%">
      <stop offset="0" stop-color="#0A1A38" stop-opacity="0.9"/>
      <stop offset="1" stop-color="{BLACK}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="gridFade" cx="50%" cy="60%" r="55%">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="1"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <mask id="gridMask"><rect width="{W}" height="{H}" fill="url(#gridFade)"/></mask>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="13" cy="13" r="1.1" fill="{BLUE_MID}"/>
    </pattern>
    <linearGradient id="topFace" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#1A3D78"/>
      <stop offset="1" stop-color="#2A5AA6"/>
    </linearGradient>
    <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="10"/>
    </filter>
    <radialGradient id="landing" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="{GOLD}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="{GOLD}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <g clip-path="url(#cardClip)">
    <rect width="{W}" height="{H}" fill="{BLACK}"/>
    <rect width="{W}" height="{H}" fill="url(#haze)"/>
    <rect width="{W}" height="{H}" fill="url(#dots)" mask="url(#gridMask)" opacity="0.55"/>
    <circle cx="{orbit_c[0]:.1f}" cy="{orbit_c[1]:.1f}" r="{orbit_r}" fill="none" stroke="#FFFFFF" stroke-opacity="0.13" stroke-width="1.2"/>
    <circle cx="{orbit_c[0] - orbit_r * 0.94:.1f}" cy="{orbit_c[1] - orbit_r * 0.34:.1f}" r="4" fill="#FFFFFF" fill-opacity="0.35"/>
    <circle cx="{orbit_c[0] + orbit_r * 0.6:.1f}" cy="{orbit_c[1] + orbit_r * 0.8:.1f}" r="3" fill="#FFFFFF" fill-opacity="0.25"/>
    {dim}
    {cube(base, a, slot)}
    <ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{b * 1.25:.1f}" ry="{b * 0.72:.1f}" fill="url(#landing)"/>
    {''.join(guides)}
    {piece}
  </g>
  <text class="label" x="{LABEL_X}" y="{LABEL_Y}">{LABEL}</text>
</svg>
'''
    with open(OUT, 'w', encoding='utf-8') as fh:
        fh.write(svg)
    print(os.path.relpath(OUT, ROOT), len(svg) // 1024, 'kB')


if __name__ == '__main__':
    card()

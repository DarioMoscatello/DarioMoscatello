"""Builds the drawn section covers (Education, Work, Projects, More and the
Interests card in About): no generated
images, only shapes. All three share the language of the Readings rose: black,
the rose's blues, one single warm note in gold, a faint dot grid and a hairline
orbit, and the section name in Geist Mono at the same spot as on every cover.

    Education a graduation cap: a square board on a round crown, its tassel
              hanging over the front corner and ending in gold.
    Interests a tray in four parts, one per interest: a chessboard, a molecule,
              a tower of blocks and a stack of gold coins.
    Work      three blocks rising like a chart, a dashed trend line ending in
              a gold point on the tallest one.
    Projects  a block like a page of a blueprint, its hidden edges dashed, an
              empty slot lit in gold and a smaller block about to drop in.
    More      a slab holding three different things: a block, a cylinder and
              a sphere lit in gold.

    pip install fonttools brotli
    python3 tools/make_covers.py
"""

import base64
import io
import os

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = os.path.join(ROOT, 'assets/fonts/geist-mono-latin-500-normal.woff2')

W, H, RX = 829, 1184, 72

# Label: same font, size and spot as the other section covers.
LABEL_X, LABEL_Y, LABEL_SIZE, LABEL_TRACK = 71.1, 150.9, 43.1, 0.262

# Colours taken from the Readings rose.
BLACK = '#020306'
SIDE_LEFT = '#07132B'
SIDE_RIGHT = '#10295A'
BLUE_MID = '#25467A'
EDGE = '#6F9AD6'
EDGE_SOFT = '#3B5E95'
GOLD = '#FFD066'

COS30 = 0.8660254


# ---------- geometry ----------

def iso(origin, size, i, j, k):
    """Point in isometric view: i to the right-back, j to the left-back, k up."""
    ox, oy = origin
    return (ox + (i - j) * COS30 * size, oy - (i + j) * 0.5 * size - k * size)


def pts(points):
    return ' '.join(f'{x:.1f},{y:.1f}' for x, y in points)


def line(a, b, stroke=EDGE, width=1.6, dash=None, opacity=None):
    extra = f' stroke-dasharray="{dash}"' if dash else ''
    extra += f' stroke-opacity="{opacity}"' if opacity is not None else ''
    return (f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" '
            f'stroke="{stroke}" stroke-width="{width}" stroke-linecap="round"{extra}/>')


def box(origin, unit, sx, sy, sz, on_top='', hidden=True):
    """A box sx by sy by sz (in units) with its front-bottom corner at origin."""
    p = lambda i, j, k: iso(origin, unit, i * sx, j * sy, k * sz)
    top = [p(0, 0, 1), p(1, 0, 1), p(1, 1, 1), p(0, 1, 1)]
    right = [p(0, 0, 0), p(1, 0, 0), p(1, 0, 1), p(0, 0, 1)]
    left = [p(0, 0, 0), p(0, 1, 0), p(0, 1, 1), p(0, 0, 1)]
    out = [
        f'<polygon points="{pts(left)}" fill="{SIDE_LEFT}"/>',
        f'<polygon points="{pts(right)}" fill="{SIDE_RIGHT}"/>',
        f'<polygon points="{pts(top)}" fill="url(#topFace)"/>',
    ]
    if hidden:  # edges behind the box, as on a technical drawing
        back = p(1, 1, 0)
        for q in (p(1, 0, 0), p(0, 1, 0), p(1, 1, 1)):
            out.append(line(back, q, EDGE_SOFT, 1.2, '5 7', 0.7))
    if on_top:
        out.append(on_top)
    for a, b in [
        (p(0, 0, 0), p(1, 0, 0)), (p(0, 0, 0), p(0, 1, 0)), (p(0, 0, 0), p(0, 0, 1)),
        (p(1, 0, 0), p(1, 0, 1)), (p(0, 1, 0), p(0, 1, 1)),
        (p(0, 0, 1), p(1, 0, 1)), (p(0, 0, 1), p(0, 1, 1)),
        (p(1, 0, 1), p(1, 1, 1)), (p(0, 1, 1), p(1, 1, 1)),
    ]:
        out.append(line(a, b))
    return '\n    '.join(out)


def dimension(a, b, side=(0.5, COS30)):
    """A measurement line from a to b with a tick at each end."""
    t = 9
    out = [line(a, b, EDGE_SOFT, 1, None, 0.85)]
    for x, y in (a, b):
        out.append(line((x - t * side[0], y - t * side[1]), (x + t * side[0], y + t * side[1]), EDGE_SOFT, 1, None, 0.85))
    return ''.join(out)


def glow_dot(x, y, r=3.2):
    return (f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r * 9:.1f}" fill="url(#landing)"/>'
            f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" fill="{GOLD}"/>')


# ---------- frame shared by every cover ----------

def label_font(text):
    options = subset.Options()
    options.flavor = 'woff2'
    font = TTFont(FONT)
    subsetter = subset.Subsetter(options)
    subsetter.populate(text=text)
    subsetter.subset(font)
    buffer = io.BytesIO()
    font.flavor = 'woff2'
    font.save(buffer)
    data = base64.b64encode(buffer.getvalue()).decode()
    return f"@font-face{{font-family:'Geist Mono Card';font-weight:500;src:url(data:font/woff2;base64,{data}) format('woff2')}}"


def frame(label, description, body, orbit=(W / 2, 690, 372)):
    ox, oy, r = orbit
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}"
     role="img" aria-label="{label.title()}: {description}">
  <style>{label_font(label)}
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
    <linearGradient id="cylSide" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="{SIDE_LEFT}"/>
      <stop offset="0.55" stop-color="{SIDE_RIGHT}"/>
      <stop offset="1" stop-color="#1A3D78"/>
    </linearGradient>
    <linearGradient id="cylGold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#6E4E14"/>
      <stop offset="0.55" stop-color="#C9962E"/>
      <stop offset="1" stop-color="{GOLD}"/>
    </linearGradient>
    <radialGradient id="sphere" cx="38%" cy="32%" r="70%">
      <stop offset="0" stop-color="#FFF1C4"/>
      <stop offset="0.25" stop-color="{GOLD}"/>
      <stop offset="0.75" stop-color="#8A6420"/>
      <stop offset="1" stop-color="#2A1E0A"/>
    </radialGradient>
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
    <circle cx="{ox:.1f}" cy="{oy:.1f}" r="{r}" fill="none" stroke="#FFFFFF" stroke-opacity="0.13" stroke-width="1.2"/>
    <circle cx="{ox - r * 0.94:.1f}" cy="{oy - r * 0.34:.1f}" r="4" fill="#FFFFFF" fill-opacity="0.35"/>
    <circle cx="{ox + r * 0.6:.1f}" cy="{oy + r * 0.8:.1f}" r="3" fill="#FFFFFF" fill-opacity="0.25"/>
    {body}
  </g>
  <text class="label" x="{LABEL_X}" y="{LABEL_Y}">{label}</text>
</svg>
'''


def write(name, svg):
    path = os.path.join(ROOT, name)
    with open(path, 'w', encoding='utf-8') as fh:
        fh.write(svg)
    print(name, len(svg) // 1024, 'kB')


# ---------- the three covers ----------

def projects():
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

    # The piece hovers above its slot; guides drop from three of its corners.
    piece_origin = (s(0, 0)[0], s(0, 0)[1] - 1.15 * a)
    guides = ''.join(
        line(iso(piece_origin, b, i, j, 0), s(i, j), EDGE_SOFT, 1, '2 6', 0.8)
        for i, j in ((0, 0), (1, 0), (0, 1))
    )
    body = '\n    '.join([
        dimension(iso(base, a, 0, -0.16, 0), iso(base, a, 1, -0.16, 0)),
        box(base, a, 1, 1, 1, slot),
        f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{b * 1.25:.1f}" ry="{b * 0.72:.1f}" fill="url(#landing)"/>',
        guides,
        box(piece_origin, b, 1, 1, 1),
    ])
    write('Projects/PROJECTS_AI_exploded_site_ready.svg', frame(
        'PROJECTS', 'a blue block on black with a smaller block about to drop into a lit slot', body))


def work():
    u = 132  # one unit
    base = (W / 2 - 0.7 * u, 1000)  # front-bottom corner of the first bar
    heights = [1.25, 2.05, 3.0]
    step, width, depth = 0.86, 0.58, 0.92  # along i: spacing and bar width; along j: depth
    parts = [dimension(iso(base, u, 0, -0.2, 0), iso(base, u, step * 2 + width, -0.2, 0))]
    tops = []
    # back to front: the furthest bar along i is drawn first
    bars = []
    for n, h in enumerate(heights):
        origin = iso(base, u, n * step, 0, 0)
        bars.append(box(origin, u, width, depth, h))
        tops.append(iso(base, u, n * step + width / 2, depth / 2, h))
    parts += reversed(bars)
    # trend line through the middle of each top, rising past the last bar
    trend = tops + [iso(base, u, 2 * step + width / 2 + 0.55, depth / 2, heights[-1] + 0.7)]
    parts.append(
        f'<polyline points="{pts(trend)}" fill="none" stroke="{EDGE}" stroke-width="1.4" '
        f'stroke-dasharray="6 6" stroke-linejoin="round"/>'
    )
    for x, y in tops[:-1]:
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="3" fill="{EDGE}"/>')
    parts.append(glow_dot(*trend[-1], 4))
    write('Work/WORK_card_chrome_report_site_ready.svg', frame(
        'WORK', 'three blue blocks rising like a chart, a trend line ending in a gold point', '\n    '.join(parts)))


def cylinder(center, r, h, gold=False, hidden=True):
    """Upright cylinder in isometric view; center is the middle of its base."""
    x, y = center
    ry = r * 0.5
    side_fill, top_fill, stroke = (('url(#cylGold)', GOLD, '#FFE3A0') if gold
                                   else ('url(#cylSide)', 'url(#topFace)', EDGE))
    side = (f'<path d="M{x - r:.1f},{y - h:.1f} L{x - r:.1f},{y:.1f} '
            f'A{r:.1f},{ry:.1f} 0 0 0 {x + r:.1f},{y:.1f} L{x + r:.1f},{y - h:.1f} Z" fill="{side_fill}"/>')
    back_rim = (f'<path d="M{x - r:.1f},{y:.1f} A{r:.1f},{ry:.1f} 0 0 1 {x + r:.1f},{y:.1f}" fill="none" '
                f'stroke="{EDGE_SOFT}" stroke-width="1.2" stroke-dasharray="5 7" stroke-opacity="0.7"/>') if hidden else ''
    front_rim = (f'<path d="M{x - r:.1f},{y:.1f} A{r:.1f},{ry:.1f} 0 0 0 {x + r:.1f},{y:.1f}" fill="none" '
                 f'stroke="{stroke}" stroke-width="1.6"/>')
    top = (f'<ellipse cx="{x:.1f}" cy="{y - h:.1f}" rx="{r:.1f}" ry="{ry:.1f}" fill="{top_fill}" '
           f'stroke="{stroke}" stroke-width="1.6"/>')
    sides = line((x - r, y - h), (x - r, y), stroke) + line((x + r, y - h), (x + r, y), stroke)
    return back_rim + side + front_rim + sides + top


def more():
    u = 330  # the slab
    base = (W / 2, 1000)
    slab = box(base, u, 1, 1, 0.07)
    on = lambda i, j: iso(base, u, i, j, 0.07)  # a point on the slab

    # back to front: cylinder at the back, block on the left, sphere at the front
    cyl = cylinder(on(0.62, 0.66), 0.17 * u, 0.62 * u)
    block_origin = on(0.12, 0.40)
    block = box(block_origin, 0.3 * u, 1, 1, 1)
    sx, sy = on(0.42, 0.14)
    r = 0.15 * u
    sphere = (
        f'<ellipse cx="{sx:.1f}" cy="{sy:.1f}" rx="{r * 1.05:.1f}" ry="{r * 0.42:.1f}" fill="#000000" fill-opacity="0.45"/>'
        f'<ellipse cx="{sx:.1f}" cy="{sy - r:.1f}" rx="{r * 2.6:.1f}" ry="{r * 2.0:.1f}" fill="url(#landing)" opacity="0.6"/>'
        f'<circle cx="{sx:.1f}" cy="{sy - r:.1f}" r="{r:.1f}" fill="url(#sphere)"/>'
    )
    body = '\n    '.join([
        dimension(iso(base, u, 0, -0.08, 0), iso(base, u, 1, -0.08, 0)),
        slab, cyl, block, sphere,
    ])
    write('More/MORE_open_index_site_ready.svg', frame(
        'MORE', 'a slab holding a blue block, a blue cylinder and a gold sphere', body))


def education():
    u = 360  # side of the board
    board_h = 0.045
    centre = (W / 2, 560)  # screen point of the board's centre, underside
    origin = (centre[0], centre[1] + 0.5 * u)  # front corner of the board
    crown_r, crown_h = 0.34 * u, 0.66 * u  # tall enough to show below the front corner

    on_board = lambda i, j: iso(origin, u, i, j, board_h)
    button = on_board(0.5, 0.5)
    corner = on_board(0.02, 0.02)  # the front corner, where the cord falls
    end = (corner[0], corner[1] + 0.36 * u)
    fringe = ''.join(line((end[0] + dx, end[1]), (end[0] + dx * 1.6, end[1] + 46), GOLD, 2.2)
                     for dx in (-7, -3.5, 0, 3.5, 7))
    tassel = (
        line(button, corner, '#C9962E', 2.2)
        + line(corner, end, '#C9962E', 2.2)
        + fringe
        + f'<rect x="{end[0] - 9:.1f}" y="{end[1] - 8:.1f}" width="18" height="14" rx="3" fill="{GOLD}"/>'
        + glow_dot(end[0], end[1] + 22, 3.5)
        + f'<circle cx="{button[0]:.1f}" cy="{button[1]:.1f}" r="6" fill="{GOLD}"/>'
    )
    shadow = (f'<ellipse cx="{centre[0]:.1f}" cy="{centre[1] + crown_h + 40:.1f}" rx="{u * 0.46:.1f}" '
              f'ry="{u * 0.11:.1f}" fill="#000000" fill-opacity="0.6"/>')
    body = '\n    '.join([
        shadow,
        cylinder((centre[0], centre[1] + crown_h), crown_r, crown_h),
        box(origin, u, 1, 1, board_h),
        tassel,
        dimension(iso(origin, u, 0, -0.1, 0), iso(origin, u, 1, -0.1, 0)),
    ])
    write('Education/Education_card_site_ready.svg', frame(
        'EDUCATION', 'a blue graduation cap on black, its tassel ending in gold', body))


def interests():
    u = 400  # side of the tray
    base = (W / 2, 1010)
    tray_h = 0.06
    on = lambda i, j: iso(base, u, i, j, tray_h)
    parts = [dimension(iso(base, u, 0, -0.08, 0), iso(base, u, 1, -0.08, 0))]

    # the tray and its four compartments
    walls = line(on(0.5, 0), on(0.5, 1), EDGE_SOFT, 1.4) + line(on(0, 0.5), on(1, 0.5), EDGE_SOFT, 1.4)
    parts.append(box(base, u, 1, 1, tray_h, walls))

    # back cell: a tower of three blocks, real estate and architecture
    lift = 0
    for side, h in [(0.3, 0.32), (0.22, 0.26), (0.14, 0.22)]:
        off = 0.75 - side / 2
        parts.append(box(iso(base, u, off, off, tray_h + lift), u, side, side, h))
        lift += h

    # left cell: a molecule floating, tech and AI
    hub = (0.25, 0.75, 0.42)
    arms = [(-0.13, -0.11, -0.13), (0.12, 0.1, -0.15), (-0.06, 0.12, 0.17), (0.08, -0.12, 0.19)]
    nodes = [iso(base, u, *hub)] + [iso(base, u, hub[0] + a * 1.5, hub[1] + b * 1.5, hub[2] + c * 1.5) for a, b, c in arms]
    for a, b in [(0, 1), (0, 2), (0, 3), (0, 4), (1, 4), (2, 3)]:
        parts.append(line(nodes[a], nodes[b], EDGE, 1.6, None, 0.7))
    for n, (x, y) in enumerate(nodes):
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{17 if n == 0 else 11}" fill="#1A3D78" '
                     f'stroke="{EDGE}" stroke-width="1.6"/>')

    # right cell: a stack of gold coins, economics
    cx, cy = on(0.75, 0.25)
    parts.append(f'<ellipse cx="{cx:.1f}" cy="{cy - 0.08 * u:.1f}" rx="{0.3 * u:.1f}" ry="{0.2 * u:.1f}" '
                 f'fill="url(#landing)" opacity="0.6"/>')
    for n in range(4):
        parts.append(cylinder((cx + (n % 2) * 3, cy - n * 0.035 * u), 0.12 * u, 0.03 * u, gold=True, hidden=False))

    # front cell: a chessboard, 4 by 4
    for a in range(4):
        for b in range(4):
            q = [on(0.05 + a * 0.1, 0.05 + b * 0.1), on(0.15 + a * 0.1, 0.05 + b * 0.1),
                 on(0.15 + a * 0.1, 0.15 + b * 0.1), on(0.05 + a * 0.1, 0.15 + b * 0.1)]
            fill = '#2A5AA6' if (a + b) % 2 == 0 else '#07132B'
            parts.append(f'<polygon points="{pts(q)}" fill="{fill}"/>')
    rim = [on(0.05, 0.05), on(0.45, 0.05), on(0.45, 0.45), on(0.05, 0.45)]
    parts.append(f'<polygon points="{pts(rim)}" fill="none" stroke="{EDGE}" stroke-width="1.4"/>')

    write('About/INTERESTS_card_site_ready.svg', frame(
        'INTERESTS', 'a tray with a chessboard, a molecule, a tower of blocks and gold coins', '\n    '.join(parts)))


if __name__ == '__main__':
    education()
    interests()
    work()
    projects()
    more()

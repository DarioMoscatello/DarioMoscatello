"""Builds the "Soon" card in Awards & More: a black card with the logo in
More/soon-logo.png (white on black) in the middle, so the two blacks meet
without an edge.

    pip install pillow
    python3 tools/make_soon_card.py
"""

import base64
import io
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGO = os.path.join(ROOT, 'More/soon-logo.png')
OUT = os.path.join(ROOT, 'More/SOON_card.svg')

W, H, RX = 700, 1000, 46
LOGO_W = 520


def card():
    im = Image.open(LOGO).convert('RGB')
    buf = io.BytesIO()
    im.save(buf, 'WEBP', quality=92, method=6)
    data = base64.b64encode(buf.getvalue()).decode()
    h = round(im.height * LOGO_W / im.width)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="Soon">
  <defs><clipPath id="c"><rect width="{W}" height="{H}" rx="{RX}" ry="{RX}"/></clipPath></defs>
  <g clip-path="url(#c)">
    <rect width="{W}" height="{H}" fill="#000000"/>
    <image x="{(W - LOGO_W) / 2:.1f}" y="{(H - h) / 2:.1f}" width="{LOGO_W}" height="{h}" href="data:image/webp;base64,{data}"/>
  </g>
</svg>
'''
    with open(OUT, 'w', encoding='utf-8') as fh:
        fh.write(svg)
    print(os.path.relpath(OUT, ROOT), len(svg) // 1024, 'kB')


if __name__ == '__main__':
    card()

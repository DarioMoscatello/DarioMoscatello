"""Builds the NSNV card in Projects: a white card like the other project logos,
with the 2 x 2 NSNV logo (Projects/NSNV-logo-2x2.png) in the middle.

    pip install pillow
    python3 tools/make_nsnv_card.py
"""

import base64
import io
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGO = os.path.join(ROOT, 'Projects/NSNV-logo-2x2.png')
OUT = os.path.join(ROOT, 'Projects/NSNV_card.svg')

W, H, RX = 700, 1000, 46
LOGO_W = 470  # width of the logo on the card


def card():
    im = Image.open(LOGO).convert('RGBA')
    im = im.crop(im.getbbox())
    h = round(im.height * LOGO_W / im.width)
    im = im.resize((LOGO_W * 2, h * 2), Image.LANCZOS)  # twice the size it is shown at
    buf = io.BytesIO()
    im.save(buf, 'WEBP', quality=90, method=6)
    data = base64.b64encode(buf.getvalue()).decode()
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="NSNV">
  <defs><clipPath id="c"><rect width="{W}" height="{H}" rx="{RX}" ry="{RX}"/></clipPath></defs>
  <g clip-path="url(#c)">
    <rect width="{W}" height="{H}" fill="#FFFFFF"/>
    <image x="{(W - LOGO_W) / 2:.1f}" y="{(H - h) / 2:.1f}" width="{LOGO_W}" height="{h}" href="data:image/webp;base64,{data}"/>
  </g>
</svg>
'''
    with open(OUT, 'w', encoding='utf-8') as fh:
        fh.write(svg)
    print(os.path.relpath(OUT, ROOT), len(svg) // 1024, 'kB')


if __name__ == '__main__':
    card()

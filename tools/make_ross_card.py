"""Builds the ROSS card in Projects: a white card like the other project logos,
with the ROSS penguin (Projects/ross-logo.png) and the name set in Geist
under it, in the navy of the Hedels and BExams logos.

    pip install fonttools brotli pillow
    python3 tools/make_ross_card.py
"""

import base64
import io
import os
import sys

from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_book_cards import BOLD  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGO = os.path.join(ROOT, 'Projects/ross-logo.png')
OUT = os.path.join(ROOT, 'Projects/ROSS_card.svg')

W, H, RX = 700, 1000, 46
NAVY = '#0A2D63'
NAME, NAME_SIZE, NAME_TRACK = 'ROSS', 118, 0.08
LOGO_W = 430  # width of the penguin on the card


def logo():
    im = Image.open(LOGO).convert('RGBA')
    im = im.crop(im.getbbox())
    h = round(im.height * LOGO_W / im.width)
    im = im.resize((LOGO_W * 2, h * 2), Image.LANCZOS)  # twice the size it is shown at
    buf = io.BytesIO()
    im.save(buf, 'WEBP', quality=88, method=6)
    return base64.b64encode(buf.getvalue()).decode(), h


def card():
    data, logo_h = logo()
    name_w = BOLD.width(NAME, NAME_SIZE, NAME_TRACK)
    gap = 56
    block = logo_h + gap + BOLD.cap * NAME_SIZE
    top = (H - block) / 2
    name_y = top + logo_h + gap + BOLD.cap * NAME_SIZE
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="ROSS">
  <style>{BOLD.embed(NAME, 'Geist Card', 500)}
    .name {{ font-family: 'Geist Card', 'Geist', system-ui, sans-serif; font-weight: 500; font-size: {NAME_SIZE}px; letter-spacing: {NAME_TRACK}em; fill: {NAVY}; }}
  </style>
  <defs><clipPath id="c"><rect width="{W}" height="{H}" rx="{RX}" ry="{RX}"/></clipPath></defs>
  <g clip-path="url(#c)">
    <rect width="{W}" height="{H}" fill="#FFFFFF"/>
    <image x="{(W - LOGO_W) / 2:.1f}" y="{top:.1f}" width="{LOGO_W}" height="{logo_h}" href="data:image/webp;base64,{data}"/>
  </g>
  <text class="name" x="{(W - name_w) / 2:.1f}" y="{name_y:.1f}">{NAME}</text>
</svg>
'''
    with open(OUT, 'w', encoding='utf-8') as fh:
        fh.write(svg)
    print(os.path.relpath(OUT, ROOT), len(svg) // 1024, 'kB')


if __name__ == '__main__':
    card()

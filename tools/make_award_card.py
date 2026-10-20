"""Builds the Fastweb AI Hackathon card in Awards & More: a white card with the
Fastweb mark (More/fastweb-mark.png, the symbol without the word), AI
HACKATHON in Geist Mono under it and a gold #1 mark.

    pip install fonttools brotli pillow numpy
    python3 tools/make_award_card.py
"""

import base64
import io
import os
import sys

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_covers import GOLD, label_font  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MARK = os.path.join(ROOT, 'More/fastweb-mark.png')
OUT = os.path.join(ROOT, 'More/FASTWEB_card.svg')

W, H, RX = 700, 1000, 46
INK = '#111111'
MARK_W = 330
LINE, LINE_SIZE = 'AI HACKATHON', 32
BADGE, BADGE_SIZE = '#1', 34
TRACK = 0.2


def mono_width(text, size):
    return len(text) * 0.6 * size + TRACK * size * (len(text) - 1)


def mark():
    """The yellow symbol cut out of its white background."""
    im = np.array(Image.open(MARK).convert('RGB')).astype(int)
    white = 255 - im.min(axis=2)  # 0 on white, large on the yellow
    alpha = np.clip(white * 2.2, 0, 255).astype(np.uint8)
    rgba = np.dstack([im.astype(np.uint8), alpha])
    out = Image.fromarray(rgba)
    out = out.crop(out.getbbox())
    h = round(out.height * MARK_W / out.width)
    out = out.resize((MARK_W * 2, h * 2), Image.LANCZOS)
    buf = io.BytesIO()
    out.save(buf, 'WEBP', quality=90, method=6)
    return base64.b64encode(buf.getvalue()).decode(), h


def card():
    data, mark_h = mark()
    block = mark_h + 80 + LINE_SIZE + 60 + BADGE_SIZE * 2.1
    top = (H - block) / 2
    line_y = top + mark_h + 80 + LINE_SIZE * 0.72
    badge_w = mono_width(BADGE, BADGE_SIZE) + 60
    badge_y = line_y + 60
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="Fastweb AI Hackathon, number one">
  <style>{label_font(LINE + BADGE)}
    .mono {{ font-family: 'Geist Mono Card', 'Geist Mono', ui-monospace, monospace; font-weight: 500; letter-spacing: {TRACK}em; fill: {INK}; }}
  </style>
  <defs><clipPath id="c"><rect width="{W}" height="{H}" rx="{RX}" ry="{RX}"/></clipPath></defs>
  <g clip-path="url(#c)">
    <rect width="{W}" height="{H}" fill="#FFFFFF"/>
    <image x="{(W - MARK_W) / 2:.1f}" y="{top:.1f}" width="{MARK_W}" height="{mark_h}" href="data:image/webp;base64,{data}"/>
  </g>
  <text class="mono" x="{(W - mono_width(LINE, LINE_SIZE)) / 2:.1f}" y="{line_y:.1f}" font-size="{LINE_SIZE}">{LINE}</text>
  <rect x="{(W - badge_w) / 2:.1f}" y="{badge_y:.1f}" width="{badge_w:.1f}" height="{BADGE_SIZE * 2.1:.1f}" rx="{BADGE_SIZE * 1.05:.1f}" fill="{GOLD}"/>
  <text class="mono" x="{(W - mono_width(BADGE, BADGE_SIZE)) / 2:.1f}" y="{badge_y + BADGE_SIZE * 1.4:.1f}" font-size="{BADGE_SIZE}">{BADGE}</text>
</svg>
'''
    with open(OUT, 'w', encoding='utf-8') as fh:
        fh.write(svg)
    print(os.path.relpath(OUT, ROOT), len(svg) // 1024, 'kB')


if __name__ == '__main__':
    card()

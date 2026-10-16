"""Builds the ROSS card in Projects: a white card like the other project logos,
with the name set large in Geist and a small line in Geist Mono under it.
A stand-in until ROSS has a logo of its own.

    pip install fonttools brotli
    python3 tools/make_ross_card.py
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_book_cards import BOLD  # noqa: E402
from make_covers import label_font  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'Projects/ROSS_card.svg')

W, H, RX = 700, 1000, 46
NAVY = '#0A2D63'  # the navy of the Hedels and BExams logos
NAME, NAME_SIZE, NAME_TRACK = 'ROSS', 168, 0.08
LINE, LINE_SIZE, LINE_TRACK = 'AGENTIC VALUATION', 25, 0.2


def card():
    name_w = BOLD.width(NAME, NAME_SIZE, NAME_TRACK)
    name_y = H / 2 + BOLD.cap * NAME_SIZE / 2 - 30
    line_w = len(LINE) * 0.6 * LINE_SIZE + LINE_TRACK * LINE_SIZE * (len(LINE) - 1)  # Geist Mono: 0.6 em each
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="ROSS">
  <style>{BOLD.embed(NAME, 'Geist Card', 500)}{label_font(LINE)}
    .name {{ font-family: 'Geist Card', 'Geist', system-ui, sans-serif; font-weight: 500; font-size: {NAME_SIZE}px; letter-spacing: {NAME_TRACK}em; fill: {NAVY}; }}
    .line {{ font-family: 'Geist Mono Card', 'Geist Mono', ui-monospace, monospace; font-weight: 500; font-size: {LINE_SIZE}px; letter-spacing: {LINE_TRACK}em; fill: {NAVY}; fill-opacity: 0.7; }}
  </style>
  <defs><clipPath id="c"><rect width="{W}" height="{H}" rx="{RX}" ry="{RX}"/></clipPath></defs>
  <g clip-path="url(#c)">
    <rect width="{W}" height="{H}" fill="#FFFFFF"/>
  </g>
  <text class="name" x="{(W - name_w) / 2:.1f}" y="{name_y:.1f}">{NAME}</text>
  <rect x="{(W - line_w) / 2:.1f}" y="{name_y + 44:.1f}" width="{line_w:.1f}" height="2" fill="{NAVY}" fill-opacity="0.25"/>
  <text class="line" x="{(W - line_w) / 2:.1f}" y="{name_y + 100:.1f}">{LINE}</text>
</svg>
'''
    with open(OUT, 'w', encoding='utf-8') as fh:
        fh.write(svg)
    print(os.path.relpath(OUT, ROOT), len(svg) // 1024, 'kB')


if __name__ == '__main__':
    card()

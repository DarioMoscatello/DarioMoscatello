"""Builds the Fastweb AI Hackathon card in Awards & More: a white card with the
event set in Geist and a gold 1x WINNER mark. A stand-in until the Fastweb
logo is added.

    pip install fonttools brotli
    python3 tools/make_award_card.py
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_book_cards import BOLD  # noqa: E402
from make_covers import GOLD, label_font  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'More/FASTWEB_card.svg')

W, H, RX = 700, 1000, 46
INK = '#111111'
TOP, TOP_SIZE = 'FASTWEB', 30
LINES, SIZE = ['AI', 'HACKATHON'], 92
BADGE, BADGE_SIZE = '1× WINNER', 30
TRACK = 0.2


def mono_width(text, size):
    return len(text) * 0.6 * size + TRACK * size * (len(text) - 1)


def card():
    widths = [BOLD.width(t, SIZE, -0.01) for t in LINES]
    step = SIZE * 1.02
    first = H / 2 - step / 2 + BOLD.cap * SIZE / 2 - 20
    top_y = first - BOLD.cap * SIZE - 64
    badge_w = mono_width(BADGE, BADGE_SIZE) + 64
    badge_y = first + step + 70
    title = ''.join(
        f'<text class="big" x="{(W - w) / 2:.1f}" y="{first + n * step:.1f}">{t}</text>'
        for n, (t, w) in enumerate(zip(LINES, widths))
    )
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="Fastweb AI Hackathon, 1x winner">
  <style>{BOLD.embed(''.join(LINES), 'Geist Card', 500)}{label_font(TOP + BADGE)}
    .big {{ font-family: 'Geist Card', 'Geist', system-ui, sans-serif; font-weight: 500; font-size: {SIZE}px; letter-spacing: -0.01em; fill: {INK}; }}
    .mono {{ font-family: 'Geist Mono Card', 'Geist Mono', ui-monospace, monospace; font-weight: 500; letter-spacing: {TRACK}em; }}
  </style>
  <defs><clipPath id="c"><rect width="{W}" height="{H}" rx="{RX}" ry="{RX}"/></clipPath></defs>
  <g clip-path="url(#c)"><rect width="{W}" height="{H}" fill="#FFFFFF"/></g>
  <text class="mono" x="{(W - mono_width(TOP, TOP_SIZE)) / 2:.1f}" y="{top_y:.1f}" font-size="{TOP_SIZE}" fill="{INK}" fill-opacity="0.6">{TOP}</text>
  {title}
  <rect x="{(W - badge_w) / 2:.1f}" y="{badge_y:.1f}" width="{badge_w:.1f}" height="{BADGE_SIZE * 2.1:.1f}" rx="{BADGE_SIZE * 1.05:.1f}" fill="{GOLD}"/>
  <text class="mono" x="{(W - mono_width(BADGE, BADGE_SIZE)) / 2:.1f}" y="{badge_y + BADGE_SIZE * 1.4:.1f}" font-size="{BADGE_SIZE}" fill="{INK}">{BADGE}</text>
</svg>
'''
    with open(OUT, 'w', encoding='utf-8') as fh:
        fh.write(svg)
    print(os.path.relpath(OUT, ROOT), len(svg) // 1024, 'kB')


if __name__ == '__main__':
    card()

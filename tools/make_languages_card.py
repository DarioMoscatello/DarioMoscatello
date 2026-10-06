"""Builds the single Languages card in More: the grey of the book cards, the
word LANGUAGES set like a book title, and one row per language with its flag
and level. Uses the fonts, colours and flags of make_book_cards.py.

    pip install fonttools brotli
    python3 tools/make_languages_card.py
"""

import os
from xml.sax.saxutils import escape

from make_book_cards import (
    BOLD, H, LEFT, PAPER, RIGHT, RX, TEXT_W, TITLE_LEADING, TITLE_TOP, TITLE_TRACK, W,
    flag,
)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'More/LANGUAGES_card.svg')

TITLE = 'LANGUAGES'
TITLE_SIZE = 58

# flag, level
ROWS = [
    ('it', 'FLUENT'),
    ('uk', 'FLUENT'),
    ('ee', 'FLUENT'),
    ('de', 'B1'),
    ('es', 'B1'),
]

FLAG_W, FLAG_H = 72, 48
ROW_SIZE = 46
ROWS_TOP = 330  # top of the first flag
ROW_STEP = 116
GAP = 34  # between flag and level


def card():
    first = TITLE_TOP + BOLD.cap * TITLE_SIZE
    rule_y = round(first + 0.5 * TITLE_SIZE + 8, 1)
    used = TITLE + ''.join(level for _, level in ROWS)
    rows = []
    for i, (lang, level) in enumerate(ROWS):
        top = ROWS_TOP + i * ROW_STEP
        baseline = round(top + FLAG_H / 2 + BOLD.cap * ROW_SIZE / 2, 1)
        rows.append(flag(lang, LEFT, top, FLAG_W, FLAG_H, f'flag{i}'))
        rows.append(f'  <text class="row" x="{LEFT + FLAG_W + GAP}" y="{baseline}">{escape(level)}</text>\n')
        if i < len(ROWS) - 1:
            y = round(top + FLAG_H + (ROW_STEP - FLAG_H) / 2, 1)
            rows.append(f'  <rect x="{LEFT}" y="{y}" width="{TEXT_W}" height="1" fill="#FFFFFF" fill-opacity="0.22"/>\n')

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}"
     role="img" aria-label="Languages: Italian fluent, English fluent, Estonian fluent, German B1, Spanish B1">
  <style>{BOLD.embed(used, 'Geist Card', 500)}
    text {{ font-family: 'Geist Card', 'Geist', system-ui, sans-serif; font-weight: 500; fill: #FFFFFF; }}
    .title {{ font-size: {TITLE_SIZE}px; letter-spacing: {TITLE_TRACK}em; }}
    .row {{ font-size: {ROW_SIZE}px; letter-spacing: 0.02em; }}
  </style>
  <defs>
    <clipPath id="cardClip"><rect width="{W}" height="{H}" rx="{RX}" ry="{RX}"/></clipPath>
  </defs>
  <g clip-path="url(#cardClip)">
    <rect width="{W}" height="{H}" fill="{PAPER}"/>
  </g>
  <text class="title" x="{LEFT}" y="{round(first, 1)}">{TITLE}</text>
  <rect x="{LEFT}" y="{rule_y}" width="{TEXT_W}" height="1.5" fill="#FFFFFF" fill-opacity="0.5"/>
{''.join(rows)}</svg>
'''
    with open(OUT, 'w', encoding='utf-8') as fh:
        fh.write(svg)
    print(os.path.relpath(OUT, ROOT), len(svg) // 1024, 'kB')


if __name__ == '__main__':
    card()

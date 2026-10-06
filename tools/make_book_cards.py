"""Builds one 700x1000 card per book: a plain grey book with a darker spine on
the left, the title in large white capitals, a hairline, the subtitle in small
capitals, the authors at the bottom and a small flag of the language of the
edition in the top-right corner. No cover photo.

The text is real SVG text set in Geist, the site font. The cards are shown as
<img>, which cannot reach the page's fonts, so each card carries its own copy
of the font, cut down to the letters that card uses (a few kB).

    pip install fonttools brotli
    python3 tools/make_book_cards.py

Every book is laid out on its own: the title gets the largest size that fits
in at most four lines, and the subtitle and authors wrap to the card width.
The old cover photos stay in Readings/_covers and are no longer used.
"""

import base64
import io
import os
from xml.sax.saxutils import escape

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'Readings')
FONTS = os.path.join(ROOT, 'assets/fonts')
FONT_BOLD = os.path.join(FONTS, 'geist-sans-latin-500-normal.woff2')
FONT_TEXT = os.path.join(FONTS, 'geist-sans-latin-400-normal.woff2')

W, H, RX = 700, 1000, 42

PAPER = '#8B8881'  # the grey of the book
SPINE = '#7B7871'  # the darker strip on the left
SPINE_W = 30
LEFT = SPINE_W + 50  # text starts after the spine
RIGHT = W - 56
TEXT_W = RIGHT - LEFT

TITLE_TOP = 112
TITLE_SIZES = range(58, 39, -2)
TITLE_MAX_LINES = 4
TITLE_LEADING = 1.04
TITLE_TRACK = -0.01  # em

SMALL = 27
SMALL_LEADING = 1.42
SMALL_TRACK = 0.02  # em
SUB_MAX_LINES = 5
BOTTOM = H - 78  # baseline of the last author line

FLAG_W, FLAG_H, FLAG_R = 42, 27, 2.5
FLAG_INSET = 40  # from the top and right edges

FLAGS = {
    'it': '''<rect width="{w}" height="{h}" fill="#008C45"/>
      <rect x="{t1}" width="{t1}" height="{h}" fill="#F4F5F0"/>
      <rect x="{t2}" width="{t1}" height="{h}" fill="#CD212A"/>''',
    'uk': '''<rect width="{w}" height="{h}" fill="#012169"/>
      <path d="M0 0L{w} {h}M{w} 0L0 {h}" stroke="#FFFFFF" stroke-width="{diag}"/>
      <path d="M0 0L{w} {h}M{w} 0L0 {h}" stroke="#C8102E" stroke-width="{diag_red}"/>
      <path d="M{cx} 0V{h}M0 {cy}H{w}" stroke="#FFFFFF" stroke-width="{cross}"/>
      <path d="M{cx} 0V{h}M0 {cy}H{w}" stroke="#C8102E" stroke-width="{cross_red}"/>''',
    'ee': '''<rect width="{w}" height="{h3}" fill="#0072CE"/>
      <rect y="{h3}" width="{w}" height="{h3}" fill="#0F0F0F"/>
      <rect y="{h6}" width="{w}" height="{h3}" fill="#FFFFFF"/>''',
}


def flag(lang):
    w, h = FLAG_W, FLAG_H
    shape = FLAGS[lang].format(
        w=w, h=h, t1=round(w / 3, 2), t2=round(w * 2 / 3, 2),
        h3=round(h / 3, 2), h6=round(h * 2 / 3, 2), cx=w / 2, cy=h / 2,
        diag=round(h * 0.2, 2), diag_red=round(h * 0.07, 2),
        cross=round(h / 3, 2), cross_red=round(h / 5, 2),
    )
    return f'''  <g transform="translate({W - FLAG_INSET - w} {FLAG_INSET})">
    <clipPath id="flagClip"><rect width="{w}" height="{h}" rx="{FLAG_R}" ry="{FLAG_R}"/></clipPath>
    <g clip-path="url(#flagClip)">
      {shape}
    </g>
    <rect width="{w}" height="{h}" rx="{FLAG_R}" ry="{FLAG_R}" fill="none" stroke="#00000022" stroke-width="0.9"/>
  </g>
'''


# title, subtitle ('' for none), authors, edition language, output file
BOOKS = [
    ('Principles for Dealing with the Changing World Order', 'Why nations succeed and fail', ['Ray Dalio'], 'uk', 'Principles_card.svg'),
    ('The Selfish Gene', '40th anniversary edition', ['Richard Dawkins'], 'it', 'The_Selfish_Gene_card.svg'),
    ('Zero to One', 'Notes on startups, or how to build the future', ['Peter Thiel'], 'uk', 'Zero_to_One_card_UK_flag_site_ready.svg'),
    ('Manifesteeri', '', ['Roxie Nafousi'], 'ee', 'Manifest_card.svg'),
    ('Breaking the Social Media Prism', 'How to make our platforms less polarizing', ['Chris Bail'], 'uk', 'Social_Media_Prism_card.svg'),
    ('The Black Swan', 'The impact of the highly improbable', ['Nassim Nicholas Taleb'], 'uk', 'The_Black_Swan_card.svg'),
    ('La lotteria dei geni', 'Come il DNA influenza la nostra vita e la società', ['Kathryn Paige Harden'], 'it', 'La_lotteria_dei_geni_card.svg'),
    ('Atomic Habits', 'Piccole abitudini per grandi cambiamenti', ['James Clear'], 'it', 'Atomic_Habits_card.svg'),
    ('Formae mentis', 'Saggio sulla pluralità dell’intelligenza', ['Howard Gardner'], 'it', 'Formae_mentis_card.svg'),
    ('Il management', '', ['Abraham Maslow'], 'it', 'Il_management_card.svg'),
    ('L’arte della guerra', '', ['Sun Tzu'], 'it', 'Arte_della_guerra_card.svg'),
    ('Meditazioni di Marco Aurelio', 'Una guida alla filosofia stoica per trovare forza interiore, resilienza e calma nella vita quotidiana', ['Jonas Weifeld'], 'it', 'Meditazioni_card.svg'),
    ('Gli Sforza', 'Il racconto della dinastia che fece grande Milano', ['Carlo Maria Lomartire'], 'it', 'Gli_Sforza_card.svg'),
    ('Caterina Sforza', 'Leonessa di Romagna', ['Marco Viroli'], 'it', 'Caterina_Sforza_card.svg'),
    ('Caterina de’ Medici', 'Un’italiana alla conquista della Francia', ['Alessandra Necci'], 'it', 'Caterina_de_Medici_card.svg'),
    ('La casa dell’oppio', '', ['Su Tong'], 'it', 'La_casa_dell_oppio_card.svg'),
    ('Intelligenza emotiva', 'Che cos’è e perché può renderci felici', ['Daniel Goleman'], 'it', 'Intelligenza_emotiva_card.svg'),
    ('Il Principe', '', ['Niccolò Machiavelli'], 'it', 'Il_Principe_card.svg'),
    ('John D. Rockefeller', 'The original titan', ['JR MacGregor'], 'it', 'Rockefeller_card.svg'),
    ('Valutazione immobiliare', 'Metodologia e casi · seconda edizione', ['Giacomo Morri', 'Paolo Benedetto'], 'it', 'Valutazione_immobiliare_card.svg'),
    ('L’inganno dei confini', 'Come la geografia governa il mondo', ['Simone Guida'], 'it', 'Inganno_dei_confini_card.svg'),
]


class Face:
    """Advance widths of one font, to wrap text before it reaches the browser."""

    def __init__(self, path):
        self.path = path
        font = TTFont(path)
        self.upm = font['head'].unitsPerEm
        self.cmap = font.getBestCmap()
        self.hmtx = font['hmtx']
        self.cap = font['OS/2'].sCapHeight / self.upm

    def width(self, text, size, track):
        units = sum(self.hmtx[self.cmap[ord(c)]][0] for c in text if ord(c) in self.cmap)
        return units / self.upm * size + track * size * max(0, len(text) - 1)

    def wrap(self, text, size, track, max_width):
        lines = []
        for word in text.split():
            trial = f'{lines[-1]} {word}' if lines else word
            if lines and self.width(trial, size, track) <= max_width:
                lines[-1] = trial
            else:
                lines.append(word)
        return lines

    def embed(self, text, family, weight):
        options = subset.Options()
        options.flavor = 'woff2'
        options.layout_features = ['kern']
        font = TTFont(self.path)
        subsetter = subset.Subsetter(options)
        subsetter.populate(text=''.join(sorted(set(text))) + ' ')
        subsetter.subset(font)
        buffer = io.BytesIO()
        font.flavor = 'woff2'
        font.save(buffer)
        data = base64.b64encode(buffer.getvalue()).decode()
        return (f"@font-face{{font-family:'{family}';font-weight:{weight};"
                f"src:url(data:font/woff2;base64,{data}) format('woff2')}}")


BOLD = Face(FONT_BOLD)
TEXT = Face(FONT_TEXT)


def fit_title(title):
    """Largest size at which every word fits and the title takes four lines at most."""
    for size in TITLE_SIZES:
        lines = BOLD.wrap(title, size, TITLE_TRACK, TEXT_W)
        widest = max(BOLD.width(line, size, TITLE_TRACK) for line in lines)
        if len(lines) <= TITLE_MAX_LINES and widest <= TEXT_W:
            return size, lines
    raise ValueError(f'title does not fit: {title}')


def wrap_authors(authors):
    """Authors on one line joined by a dot, or one per line when they do not fit."""
    joined = ' · '.join(authors)
    if TEXT.width(joined, SMALL, SMALL_TRACK) <= TEXT_W:
        return [joined]
    return authors


def tspans(lines, x, first, step):
    return '\n'.join(
        f'    <tspan x="{x}" y="{round(first + i * step, 1)}">{escape(line)}</tspan>'
        for i, line in enumerate(lines)
    )


def card(title, sub, authors, lang, filename):
    title_up, sub_up = title.upper(), sub.upper()
    authors_up = [a.upper() for a in authors]

    size, title_lines = fit_title(title_up)
    step = size * TITLE_LEADING
    first = TITLE_TOP + BOLD.cap * size
    title_bottom = first + step * (len(title_lines) - 1)

    rule_y = round(title_bottom + 0.5 * size + 8, 1)
    small_step = SMALL * SMALL_LEADING
    sub_lines = TEXT.wrap(sub_up, SMALL, SMALL_TRACK, TEXT_W)[:SUB_MAX_LINES] if sub else []
    sub_first = rule_y + 36 + TEXT.cap * SMALL

    author_lines = wrap_authors(authors_up)
    author_first = BOTTOM - small_step * (len(author_lines) - 1)

    fonts = BOLD.embed(title_up, 'Geist Card', 500) + TEXT.embed(sub_up + ''.join(author_lines), 'Geist Card', 400)
    sub_block = (
        f'''  <text class="small" fill-opacity="0.78">
{tspans(sub_lines, LEFT, sub_first, small_step)}
  </text>
''' if sub_lines else '')

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}"
     role="img" aria-label="{escape(title)}, {escape(', '.join(authors))}">
  <style>{fonts}
    text {{ font-family: 'Geist Card', 'Geist', system-ui, sans-serif; fill: #FFFFFF; }}
    .title {{ font-weight: 500; font-size: {size}px; letter-spacing: {TITLE_TRACK}em; }}
    .small {{ font-weight: 400; font-size: {SMALL}px; letter-spacing: {SMALL_TRACK}em; }}
  </style>
  <defs>
    <clipPath id="cardClip"><rect width="{W}" height="{H}" rx="{RX}" ry="{RX}"/></clipPath>
  </defs>
  <g clip-path="url(#cardClip)">
    <rect width="{W}" height="{H}" fill="{PAPER}"/>
    <rect width="{SPINE_W}" height="{H}" fill="{SPINE}"/>
    <rect x="{SPINE_W}" width="1.5" height="{H}" fill="#FFFFFF" fill-opacity="0.08"/>
  </g>
  <text class="title">
{tspans(title_lines, LEFT, first, step)}
  </text>
  <rect x="{LEFT}" y="{rule_y}" width="{TEXT_W}" height="1.5" fill="#FFFFFF" fill-opacity="0.5"/>
{flag(lang)}{sub_block}  <text class="small" fill-opacity="0.9">
{tspans(author_lines, LEFT, author_first, small_step)}
  </text>
</svg>
'''
    with open(os.path.join(OUT, filename), 'w', encoding='utf-8') as fh:
        fh.write(svg)
    return size, len(title_lines), len(sub_lines), len(svg)


if __name__ == '__main__':
    for title, sub, authors, lang, name in BOOKS:
        size, tl, sl, nbytes = card(title, sub, authors, lang, name)
        print(f'{name:42} title {size}px x{tl}  subtitle x{sl}  {nbytes // 1024} kB')

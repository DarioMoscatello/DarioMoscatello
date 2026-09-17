"""Generates one 700x1000 card per book: white card, small flag top-right,
title and author drawn as outlines of the site font (so the SVG needs no font)."""

import os
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform

FONTS = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets/fonts')
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'Readings')
W, H, RX = 700, 1000, 46
INK = '#101720'
GREY = '#8A8A85'

title_font = TTFont(f'{FONTS}/geist-sans-latin-500-normal.woff2')
body_font = TTFont(f'{FONTS}/geist-sans-latin-400-normal.woff2')


def shape(font, text, size):
    """Returns (svg path data, advance width) for text at the given size."""
    upem = font['head'].unitsPerEm
    cmap = font.getBestCmap()
    glyphs = font.getGlyphSet()
    scale = size / upem
    pen_out = SVGPathPen(glyphs)
    x = 0.0
    for ch in text:
        name = cmap.get(ord(ch))
        if name is None:
            name = cmap.get(ord('?'))
        glyph = glyphs[name]
        t = Transform(scale, 0, 0, -scale, x, 0)
        glyph.draw(TransformPen(pen_out, t))
        x += glyph.width * scale
    return pen_out.getCommands(), x


def width_of(font, text, size):
    return shape(font, text, size)[1]


def wrap(font, text, size, max_width):
    words, lines, line = text.split(), [], ''
    for word in words:
        trial = f'{line} {word}'.strip()
        if width_of(font, trial, size) <= max_width or not line:
            line = trial
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def flag(kind):
    """Small flag, 56 x 34, drawn at the origin."""
    if kind == 'uk':
        return '''    <rect width="56" height="34" fill="#012169"/>
    <path d="M0 0 L6 0 L56 28 L56 34 L50 34 L0 6 Z" fill="#FFFFFF"/>
    <path d="M56 0 L50 0 L0 28 L0 34 L6 34 L56 6 Z" fill="#FFFFFF"/>
    <path d="M0 0 L3.2 0 L56 30 L56 34 L52.8 34 L0 4 Z" fill="#C8102E"/>
    <path d="M56 0 L52.8 0 L0 30 L0 34 L3.2 34 L56 4 Z" fill="#C8102E"/>
    <rect x="22" width="12" height="34" fill="#FFFFFF"/>
    <rect y="11" width="56" height="12" fill="#FFFFFF"/>
    <rect x="24.5" width="7" height="34" fill="#C8102E"/>
    <rect y="13.5" width="56" height="7" fill="#C8102E"/>'''
    if kind == 'it':
        return '''    <rect width="18.67" height="34" fill="#008C45"/>
    <rect x="18.67" width="18.66" height="34" fill="#F4F5F0"/>
    <rect x="37.33" width="18.67" height="34" fill="#CD212A"/>'''
    if kind == 'ee':
        return '''    <rect width="56" height="11.34" fill="#0072CE"/>
    <rect y="11.34" width="56" height="11.33" fill="#0F0F0F"/>
    <rect y="22.67" width="56" height="11.33" fill="#FFFFFF"/>'''
    raise ValueError(kind)


def card(title, author, lang, filename):
    title_size = 68
    lines = wrap(title_font, title, title_size, 520)
    while len(lines) > 3 and title_size > 44:
        title_size -= 6
        lines = wrap(title_font, title, title_size, 520)

    line_height = title_size * 1.16
    author_size = 36
    gap = 92
    block = line_height * (len(lines) - 1) + title_size * 0.74 + gap + author_size * 0.74
    top = 510 - block / 2 + title_size * 0.74  # first baseline

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">',
        f'  <rect width="{W}" height="{H}" rx="{RX}" ry="{RX}" fill="#FFFFFF"/>',
        f'  <g transform="translate({W - 56 - 26} 26)">',
        f'    <clipPath id="flagClip"><rect width="56" height="34" rx="3" ry="3"/></clipPath>',
        '    <g clip-path="url(#flagClip)">',
        flag(lang),
        '    </g>',
        '    <rect width="56" height="34" rx="3" ry="3" fill="none" stroke="#D2D2CE" stroke-width="0.8"/>',
        '  </g>',
    ]

    for i, line in enumerate(lines):
        data, width = shape(title_font, line, title_size)
        x = (W - width) / 2
        y = top + i * line_height
        parts.append(f'  <g transform="translate({x:.1f} {y:.1f})"><path d="{data}" fill="{INK}"/></g>')

    data, width = shape(body_font, author, author_size)
    y = top + (len(lines) - 1) * line_height + gap
    parts.append(
        f'  <g transform="translate({(W - width) / 2:.1f} {y:.1f})"><path d="{data}" fill="{GREY}"/></g>'
    )

    parts.append('</svg>')
    with open(os.path.join(OUT, filename), 'w') as fh:
        fh.write('\n'.join(parts) + '\n')
    return filename


BOOKS = [
    ('Principles for Dealing with the Changing World Order', 'Ray Dalio', 'uk', 'Principles_card.svg'),
    ('The Selfish Gene', 'Richard Dawkins', 'it', 'The_Selfish_Gene_card.svg'),
    ('Manifesteeri', 'Roxie Nafousi', 'ee', 'Manifesteeri_card.svg'),
    ('Breaking the Social Media Prism', 'Chris Bail', 'uk', 'Social_Media_Prism_card.svg'),
    ('The Black Swan', 'Nassim Nicholas Taleb', 'uk', 'The_Black_Swan_card.svg'),
    ('La lotteria dei geni', 'Kathryn Paige Harden', 'it', 'La_lotteria_dei_geni_card.svg'),
    ('Atomic Habits', 'James Clear', 'it', 'Atomic_Habits_card.svg'),
    ('Formae mentis', 'Howard Gardner', 'it', 'Formae_mentis_card.svg'),
    ('Il management', 'Abraham Maslow', 'it', 'Il_management_card.svg'),
    ("L'arte della guerra", 'Sun Tzu', 'it', 'Arte_della_guerra_card.svg'),
    ('Meditazioni di Marco Aurelio', 'Jonas Weifeld', 'it', 'Meditazioni_card.svg'),
    ('Gli Sforza', 'Carlo Maria Lomartire', 'it', 'Gli_Sforza_card.svg'),
    ('Caterina Sforza, Leonessa di Romagna', 'Marco Viroli', 'it', 'Caterina_Sforza_card.svg'),
    ("Caterina de' Medici", 'Alessandra Necci', 'it', 'Caterina_de_Medici_card.svg'),
    ("La casa dell'oppio", 'Su Tong', 'it', 'La_casa_dell_oppio_card.svg'),
]

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for title, author, lang, name in BOOKS:
        print(card(title, author, lang, name))

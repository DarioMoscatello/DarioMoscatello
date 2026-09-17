"""Builds one 700x1000 card per book: the cover photo full bleed inside the
rounded card shape, with a small flag in the top-right corner, the same size
and position as the flag on the Zero to One card.

    pip install pillow
    python3 tools/make_book_cards.py

Source covers live in Readings/_covers and are never loaded by the site.
"""

import base64
import io
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COVERS = os.path.join(ROOT, 'Readings/_covers')
OUT = os.path.join(ROOT, 'Readings')

W, H, RX = 700, 1000, 42
MAX_WIDTH = 840
QUALITY = 82

# Flag geometry: Zero to One is 637 wide, with a 56 x 34 flag inset by 24.
SCALE = W / 637
FW = round(56 * SCALE, 1)
FH = round(34 * SCALE, 1)
INSET = round(24 * SCALE, 1)

FLAGS = {
    'it': '''      <rect width="{w}" height="{h}" fill="#008C45"/>
      <rect x="{third}" width="{third}" height="{h}" fill="#F4F5F0"/>
      <rect x="{twothirds}" width="{third}" height="{h}" fill="#CD212A"/>''',
    'uk': '''      <rect width="{w}" height="{h}" fill="#012169"/>
      <path d="M0 0 L{a} 0 L{w} {hb} L{w} {h} L{wa} {h} L0 {b} Z" fill="#FFFFFF"/>
      <path d="M{w} 0 L{wa} 0 L0 {hb} L0 {h} L{a} {h} L{w} {b} Z" fill="#FFFFFF"/>
      <rect x="{cx}" width="{cw}" height="{h}" fill="#FFFFFF"/>
      <rect y="{cy}" width="{w}" height="{ch}" fill="#FFFFFF"/>
      <rect x="{rx2}" width="{rw}" height="{h}" fill="#C8102E"/>
      <rect y="{ry2}" width="{w}" height="{rh}" fill="#C8102E"/>''',
    'ee': '''      <rect width="{w}" height="{third_h}" fill="#0072CE"/>
      <rect y="{third_h}" width="{w}" height="{third_h}" fill="#0F0F0F"/>
      <rect y="{twothirds_h}" width="{w}" height="{third_h}" fill="#FFFFFF"/>''',
}


def flag(kind):
    values = {
        'w': FW,
        'h': FH,
        'third': round(FW / 3, 2),
        'twothirds': round(FW * 2 / 3, 2),
        'third_h': round(FH / 3, 2),
        'twothirds_h': round(FH * 2 / 3, 2),
        'a': round(FW * 0.107, 2),
        'wa': round(FW * 0.893, 2),
        'b': round(FH * 0.176, 2),
        'hb': round(FH * 0.824, 2),
        'cx': round(FW * 0.393, 2),
        'cw': round(FW * 0.214, 2),
        'cy': round(FH * 0.324, 2),
        'ch': round(FH * 0.353, 2),
        'rx2': round(FW * 0.437, 2),
        'rw': round(FW * 0.125, 2),
        'ry2': round(FH * 0.397, 2),
        'rh': round(FH * 0.206, 2),
    }
    return FLAGS[kind].format(**values)


def cover_data(name):
    image = Image.open(os.path.join(COVERS, name)).convert('RGB')
    if image.width > MAX_WIDTH:
        ratio = MAX_WIDTH / image.width
        image = image.resize((MAX_WIDTH, round(image.height * ratio)), Image.LANCZOS)
    buffer = io.BytesIO()
    image.save(buffer, 'WEBP', quality=QUALITY, method=6)
    return base64.b64encode(buffer.getvalue()).decode(), image.size


def card(title, cover, lang, filename):
    data, size = cover_data(cover)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}"
     role="img" aria-label="{title}">
  <defs>
    <clipPath id="cardClip"><rect width="{W}" height="{H}" rx="{RX}" ry="{RX}"/></clipPath>
    <clipPath id="flagClip"><rect width="{FW}" height="{FH}" rx="3.3" ry="3.3"/></clipPath>
  </defs>
  <g clip-path="url(#cardClip)">
    <rect width="{W}" height="{H}" fill="#FFFFFF"/>
    <image width="{W}" height="{H}" preserveAspectRatio="xMidYMid slice"
           href="data:image/webp;base64,{data}"/>
  </g>
  <g transform="translate({round(W - FW - INSET, 1)} {INSET})">
    <g clip-path="url(#flagClip)">
{flag(lang)}
    </g>
    <rect width="{FW}" height="{FH}" rx="3.3" ry="3.3" fill="none" stroke="#00000022" stroke-width="0.9"/>
  </g>
</svg>
'''
    with open(os.path.join(OUT, filename), 'w') as fh:
        fh.write(svg)
    return filename, size


# title, cover file, flag, output file
BOOKS = [
    ('Principles for Dealing with the Changing World Order', '71-WJgHWC1L._AC_UF1000,1000_QL80_.jpg', 'uk', 'Principles_card.svg'),
    ('The Selfish Gene', '61CXvkfdXlL._AC_UF1000,1000_QL80_.jpg', 'it', 'The_Selfish_Gene_card.svg'),
    ('Breaking the Social Media Prism', '71rBoljyMpL._AC_UF1000,1000_QL80_.jpg', 'uk', 'Social_Media_Prism_card.svg'),
    ('The Black Swan', '61NFGAAbwlL._AC_UF1000,1000_QL80_.jpg', 'uk', 'The_Black_Swan_card.svg'),
    ('La lotteria dei geni', 'cover_la-lotteria-dei-geni.jpg', 'it', 'La_lotteria_dei_geni_card.svg'),
    ('Atomic Habits', '719riMv0DfL._AC_UF1000,1000_QL80_.jpg', 'it', 'Atomic_Habits_card.svg'),
    ('Formae mentis', '713x1nGHcEL._AC_UF1000,1000_QL80_.jpg', 'it', 'Formae_mentis_card.svg'),
    ('Il management', '91WJ4cQiLVL._AC_UF1000,1000_QL80_.jpg', 'it', 'Il_management_card.svg'),
    ("L'arte della guerra", '61SWVg400eL._AC_UF1000,1000_QL80_.jpg', 'it', 'Arte_della_guerra_card.svg'),
    ('Meditazioni di Marco Aurelio', '9798230916840_0_0_536_0_75.jpg', 'it', 'Meditazioni_card.svg'),
    ('Gli Sforza', '815KQKkrnNL._AC_UF1000,1000_QL80_.jpg', 'it', 'Gli_Sforza_card.svg'),
    ('Caterina Sforza, Leonessa di Romagna', '81c1H6okIVL._AC_UF1000,1000_QL80_.jpg', 'it', 'Caterina_Sforza_card.svg'),
    ("Caterina de' Medici", '81eJ4hagC8L._AC_UF1000,1000_QL80_.jpg', 'it', 'Caterina_de_Medici_card.svg'),
    ("La casa dell'oppio", '81UTSvssLHL._AC_UF1000,1000_QL80_.jpg', 'it', 'La_casa_dell_oppio_card.svg'),
    ('Intelligenza emotiva', '71UXQ-i8siL._AC_UF1000,1000_QL80_.jpg', 'it', 'Intelligenza_emotiva_card.svg'),
    ('Il Principe', '9788807900341_0_0_536_0_75.jpg', 'it', 'Il_Principe_card.svg'),
    ('John D. Rockefeller', '9781950010318.jpg', 'it', 'Rockefeller_card.svg'),
    ('Valutazione immobiliare', '61rTt2F50wL._AC_UF1000,1000_QL80_.jpg', 'it', 'Valutazione_immobiliare_card.svg'),
    ("L'inganno dei confini", '9788858053904_0_0_536_0_75.jpg', 'it', 'Inganno_dei_confini_card.svg'),
    ('Manifesteeri', '71dtfDCdTvL._AC_UF1000,1000_QL80_.jpg', 'ee', 'Manifest_card.svg'),
]

if __name__ == '__main__':
    for title, cover, lang, name in BOOKS:
        out, size = card(title, cover, lang, name)
        print(f'{out}  from {size[0]}x{size[1]}')

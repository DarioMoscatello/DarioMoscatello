"""Builds the About head card from the portrait in About/23-09-26.jpg: the photo
full bleed inside the rounded card shape, same size and corners as the
INTRODUCTION and INTERESTS cards, with no text on it.

    pip install pillow
    python3 tools/make_about_card.py
"""

import base64
import io
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = os.path.join(ROOT, 'About/23-09-26.jpg')
OUT = os.path.join(ROOT, 'About/ABOUT_card_site_ready.svg')

W, H, RX = 829, 1313, 72
MAX_WIDTH = 840
QUALITY = 84

# Horizontal centre of the crop, as a fraction of the photo width: the face
# sits right of centre, so the portrait crop follows it.
FOCUS_X = 0.49


def photo_data():
    image = Image.open(SOURCE).convert('RGB')
    crop_w = round(image.height * W / H)
    left = round(image.width * FOCUS_X - crop_w / 2)
    left = max(0, min(image.width - crop_w, left))
    image = image.crop((left, 0, left + crop_w, image.height))
    if image.width > MAX_WIDTH:
        ratio = MAX_WIDTH / image.width
        image = image.resize((MAX_WIDTH, round(image.height * ratio)), Image.LANCZOS)
    buffer = io.BytesIO()
    image.save(buffer, 'WEBP', quality=QUALITY, method=6)
    return base64.b64encode(buffer.getvalue()).decode(), image.size


def card():
    data, size = photo_data()
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     width="{W}" height="{H}" viewBox="0 0 {W} {H}"
     role="img" aria-labelledby="title description">
  <title id="title">ABOUT portfolio card</title>
  <desc id="description">Black and white portrait of Dario Moscatello in a pinstripe jacket and round glasses.</desc>
  <defs>
    <clipPath id="card-clip">
      <rect width="{W}" height="{H}" rx="{RX}" ry="{RX}"/>
    </clipPath>
  </defs>
  <g clip-path="url(#card-clip)">
    <rect width="{W}" height="{H}" fill="#E4E4E2"/>
    <image width="{W}" height="{H}"
           preserveAspectRatio="xMidYMid slice"
           href="data:image/webp;base64,{data}"/>
  </g>
</svg>
'''
    with open(OUT, 'w') as fh:
        fh.write(svg)
    return size


if __name__ == '__main__':
    size = card()
    print(f'{os.path.relpath(OUT, ROOT)}  photo {size[0]}x{size[1]}')

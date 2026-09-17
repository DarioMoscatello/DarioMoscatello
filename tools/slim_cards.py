"""Shrinks the raster images embedded in the card SVGs.

The cards are never drawn wider than about 280 CSS pixels, so anything above
840 pixels of width is invisible weight. This rewrites each embedded PNG or
JPEG as WebP at that size, in place, and leaves the vector cards untouched.

    python3 tools/slim_cards.py            # report only
    python3 tools/slim_cards.py --write    # rewrite the files
"""

import base64
import io
import os
import re
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FOLDERS = ['About', 'Education', 'Work', 'Projects', 'Readings', 'More']
MAX_WIDTH = 840
MAX_HEIGHT = 1400
QUALITY = 82

DATA_URI = re.compile(r'data:image/(png|jpeg|jpg|webp);base64,([A-Za-z0-9+/=\s]+)')


def shrink(payload):
    raw = base64.b64decode(payload)
    image = Image.open(io.BytesIO(raw))
    image.load()
    has_alpha = image.mode in ('RGBA', 'LA') or (image.mode == 'P' and 'transparency' in image.info)
    image = image.convert('RGBA' if has_alpha else 'RGB')

    scale = min(MAX_WIDTH / image.width, MAX_HEIGHT / image.height, 1)
    if scale < 1:
        image = image.resize((round(image.width * scale), round(image.height * scale)), Image.LANCZOS)

    out = io.BytesIO()
    image.save(out, 'WEBP', quality=QUALITY, method=6)
    return out.getvalue(), len(raw), image.size


def process(path, write):
    source = open(path).read()
    saved = 0
    result = source
    seen = {}

    for kind, payload in set(DATA_URI.findall(source)):
        clean = ''.join(payload.split())
        if clean in seen:
            continue
        data, before, size = shrink(clean)
        after = len(data)
        if after >= before and kind == 'webp':
            continue
        seen[clean] = True
        saved += before - after
        new_uri = 'data:image/webp;base64,' + base64.b64encode(data).decode()
        result = re.sub(
            r'data:image/(?:png|jpeg|jpg|webp);base64,' + re.escape(payload),
            lambda _m: new_uri,
            result,
        )
        print(f'  {size[0]}x{size[1]}  {before // 1024} KB -> {after // 1024} KB')

    # Some cards carry the same payload twice, in href and xlink:href. Drop the
    # duplicate, but never the only link: plenty of cards use xlink:href alone.
    def dedupe(match):
        tag = match.group(0)
        href = re.search(r'(?<!:)href="([^"]+)"', tag)
        xlink = re.search(r'xlink:href="([^"]+)"', tag)
        if href and xlink and href.group(1) == xlink.group(1):
            tag = re.sub(r'\s*xlink:href="[^"]+"', '', tag)
        return tag

    result = re.sub(r'<image\b[^>]*>', dedupe, result)

    if write and result != source:
        open(path, 'w').write(result)
    return saved


def main():
    write = '--write' in sys.argv
    total = 0
    for folder in FOLDERS:
        directory = os.path.join(ROOT, folder)
        if not os.path.isdir(directory):
            continue
        for name in sorted(os.listdir(directory)):
            if not name.endswith('.svg'):
                continue
            path = os.path.join(directory, name)
            before = os.path.getsize(path)
            saved = process(path, write)
            if saved:
                print(f'{folder}/{name}: {before // 1024} KB, saves {saved // 1024} KB')
            total += saved
    print(f'total saving: {total // 1024} KB' + ('' if write else '  (run with --write to apply)'))


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""Cuts the app area (2880 x 764 at y 76) out of the screens docs/readme_shots.js wrote and writes them half size
as docs/media/b2-<name>.png:  python3 docs/readme_shots.py <folder of readme_shots.js> [docs/media]"""
import os
import sys

from PIL import Image

src = sys.argv[1]
out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(os.path.abspath(__file__)), 'media')
os.makedirs(out, exist_ok=True)
for f in sorted(os.listdir(src)):
    if not f.endswith('.png'):
        continue
    im = Image.open(os.path.join(src, f)).convert('RGB').crop((0, 76, 2880, 840)).resize((1440, 382), Image.LANCZOS)
    im.save(os.path.join(out, 'b2-' + f), optimize=True)
    print('b2-' + f, os.path.getsize(os.path.join(out, 'b2-' + f)))

#!/usr/bin/env python3
"""Generate the site's phone images from the four photos.

    python3 tools/build-images.py HERO.jpg ABOUT.jpg SERVICES-1.jpg SERVICES-2.jpg

HERO        → slide 1 (the building with the tower cranes)        → hero-*
ABOUT       → slide 2 (the night pour with the concrete pumps)    → night-*
SERVICES-1  → services background, first photo                     → frame-*
SERVICES-2  → services background, second photo                    → slab-*

The site is designed for phones, so every image is a 1:2 vertical crop (the shape of a phone
screen) in two widths, as AVIF (smallest) and WebP, plus one JPG fallback.
Adjust CENTRE below to move a crop left or right (0 = left edge, 1 = right edge).
Use the camera/drone originals (not photos re-sent through WhatsApp) for the sharpest result.
Requires Pillow 11.3 or newer (AVIF support):  pip install --upgrade pillow
"""
import os
import sys
from PIL import Image, ImageOps

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "img", "site")
#        name: (crop centre, widths, AVIF quality, WebP quality)
PLAN = {
    "hero":  (0.43, (900, 1200), 44, 70),
    "night": (0.36, (900, 1200), 44, 66),
    "frame": (0.46, (720, 1080), 38, 58),   # dimmed backgrounds: lower quality does not show
    "slab":  (0.50, (720, 1080), 38, 58),
}


def build(name, path):
    centre, widths, q_avif, q_webp = PLAN[name]
    im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")   # fresh pixels: camera/GPS metadata is not copied
    w0, h0 = im.size
    cw = min(h0 // 2, w0)
    ch = cw * 2
    left = min(max(round(centre * w0 - cw / 2), 0), w0 - cw)
    crop = im.crop((left, (h0 - ch) // 2, left + cw, (h0 - ch) // 2 + ch))
    for w in widths:
        r = crop.resize((w, w * 2), Image.LANCZOS)
        r.save(os.path.join(OUT, f"{name}-{w}.avif"), "AVIF", quality=q_avif, speed=4)
        r.save(os.path.join(OUT, f"{name}-{w}.webp"), "WEBP", quality=q_webp, method=6)
    crop.resize((widths[0], widths[0] * 2), Image.LANCZOS).save(
        os.path.join(OUT, f"{name}.jpg"), "JPEG", quality=76, optimize=True, progressive=True)
    if cw * 2 > h0 or cw < widths[-1] / 2:
        print(f"  note: {name} source is small ({w0}x{h0}); the result may look soft")
    print(f"{name}: done")


if __name__ == "__main__":
    if len(sys.argv) != 5:
        sys.exit(__doc__)
    for key, src in zip(PLAN, sys.argv[1:]):
        build(key, src)

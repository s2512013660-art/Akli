#!/usr/bin/env python3
"""Generate the site's images from the four photos.

    python3 tools/build-images.py HERO.jpg ABOUT.jpg SERVICES-1.jpg SERVICES-2.jpg

HERO        → slide 1 (the building with the tower cranes)        → hero-*
ABOUT       → slide 2 (the night pour with the concrete pumps)    → night-*
SERVICES-1  → services, first photo                                → frame-*
SERVICES-2  → services, second photo                               → slab-*

Each photo is shown whole (never cropped), full width on the phone, so it is saved at its own
shape in two widths (800 and 1200 px) as AVIF and WebP, plus one JPG fallback.
The script also prints the tiny blurred copy used behind each photo; paste it into index.html
(the style="background-image: url(...)" of that slide's .backdrop / .frame / .bg-layer) and
update the aspect-ratio there if the new photo has a different shape.
Use the camera/drone originals (not photos re-sent through WhatsApp) for the sharpest result.
Requires Pillow 11.3 or newer (AVIF support):  pip install --upgrade pillow
"""
import base64
import io
import os
import sys
from PIL import Image, ImageFilter, ImageOps

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "img", "site")
QUALITY = {"hero": (52, 76), "night": (50, 74), "frame": (50, 74), "slab": (50, 74)}   # (AVIF, WebP)


def build(name, path):
    q_avif, q_webp = QUALITY[name]
    im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")   # fresh pixels: camera/GPS metadata is not copied
    w0, h0 = im.size
    for w in (800, 1200):
        r = im.resize((w, round(h0 * w / w0)), Image.LANCZOS) if w0 > w else im
        r.save(os.path.join(OUT, f"{name}-{w}.avif"), "AVIF", quality=q_avif, speed=4)
        r.save(os.path.join(OUT, f"{name}-{w}.webp"), "WEBP", quality=q_webp, method=6)
    big = im.resize((1200, round(h0 * 1200 / w0)), Image.LANCZOS) if w0 > 1200 else im
    big.save(os.path.join(OUT, f"{name}.jpg"), "JPEG", quality=80, optimize=True, progressive=True)
    tiny = im.resize((48, round(h0 * 48 / w0)), Image.LANCZOS).filter(ImageFilter.GaussianBlur(2.2))
    b = io.BytesIO(); tiny.save(b, "WEBP", quality=55)
    print(f"{name}: {w0}x{h0}  aspect-ratio: {w0} / {h0}")
    print(f"  blurred copy: data:image/webp;base64,{base64.b64encode(b.getvalue()).decode()}")
    if w0 < 1200:
        print(f"  note: {name} is narrower than 1200 px; it may look soft on sharp phone screens")


if __name__ == "__main__":
    if len(sys.argv) != 5:
        sys.exit(__doc__)
    for key, src in zip(QUALITY, sys.argv[1:]):
        build(key, src)

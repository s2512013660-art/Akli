#!/usr/bin/env python3
"""Generate every image size the site uses from the four high-resolution photos.

    python3 tools/build-images.py HERO.jpg ABOUT.jpg PHOTO.jpg SERVICES.jpg

HERO     → slide 1 background (the building with the tower cranes)        → site-cranes-*
ABOUT    → slide 2 background (the night pour with the concrete pumps)    → site-night-*
PHOTO    → slide 3, shown in full (the slab seen from above)              → site-slab-*
SERVICES → services background (the multi-storey frame)                   → site-frame-*

For each photo it writes, into assets/img/site/: landscape WebP sizes, a 3:4 portrait crop
for phones (backgrounds only), one JPG fallback, and for PHOTO a small blurred backdrop.
Use the camera/drone originals (not photos re-sent through WhatsApp) for the sharpest result.
Requires Pillow:  pip install pillow
"""
import os
import sys
from PIL import Image, ImageFilter, ImageOps

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "img", "site")
# name: (landscape widths, portrait widths, jpg width, portrait crop centre as a fraction of the width)
PLAN = {
    "cranes": ([1280, 2048, 3400, 4800], [1200, 2400], 2048, 0.46),
    "night":  ([1280, 2160, 3240],       [1200, 2400], 2160, 0.50),
    "slab":   ([1280, 2160, 3240],       [],           2160, None),
    "frame":  ([1280, 2560],             [1200, 2160], 2560, 0.46),
}


def save(img, width, filename, **opts):
    if img.width > width:
        img = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)
    img.save(os.path.join(OUT, filename), **opts)


def build(name, path):
    landscape, portrait, jpg_w, cx = PLAN[name]
    im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")   # fresh pixels: camera/GPS metadata is not copied
    w0, h0 = im.size
    for w in landscape:
        save(im, w, f"site-{name}-{w}.webp", format="WEBP", quality=82, method=6)
    save(im, jpg_w, f"site-{name}.jpg", format="JPEG", quality=84, optimize=True, progressive=True)
    if portrait:
        cw = min(round(h0 * 3 / 4), w0)                            # full-height 3:4 crop
        left = min(max(round(cx * w0 - cw / 2), 0), w0 - cw)
        crop = im.crop((left, 0, left + cw, h0))
        for w in portrait:
            save(crop, w, f"site-{name}-p-{w}.webp", format="WEBP", quality=82, method=6)
    if name == "slab":                                             # soft backdrop behind the full photo
        small = im.resize((640, round(h0 * 640 / w0)), Image.LANCZOS).filter(ImageFilter.GaussianBlur(14))
        small.save(os.path.join(OUT, "site-slab-blur.webp"), "WEBP", quality=60, method=6)
    print(f"{name}: {w0}x{h0} done")


if __name__ == "__main__":
    if len(sys.argv) != 5:
        sys.exit(__doc__)
    for key, src in zip(("cranes", "night", "slab", "frame"), sys.argv[1:]):
        build(key, src)

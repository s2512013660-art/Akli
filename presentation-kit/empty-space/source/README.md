# The Architecture of Empty Space — source

```bash
python3 illus2.py && node render2.js          # vector illustration layers -> img/
node build2.js                                 # slides, Morph-stable "!!" names, notes -> base .pptx + anim_spec.json
python3 anim2.py The-Architecture-of-Empty-Space.pptx animated.pptx anim_spec.json
python3 xsddiff.py The-Architecture-of-Empty-Space.pptx animated.pptx   # schema check of timing XML
```
Needs pptxgenjs, sharp, playwright; set `SKILL` in build2.js to your pptx skill folder (for apply_theme.js).

## Web version and preview video
```bash
node record.js          # replays build2.js into records.json (same layout data as the .pptx)
python3 build_html.py   # web/index.html + web/img/*.webp (morphing elements, all animations, notes panel)
node video.js           # frame-accurate 1080p MP4 of the whole deck (needs ffmpeg with libx264)
```

# Animated deck — source

Rebuild `From-Hand-Sketches-to-Smart-Buildings_Animated.pptx` from scratch:

```bash
npm install pptxgenjs sharp react-icons react react-dom   # playwright must be available
python3 illus.py                 # writes svg/ layers + manifest.json
node render.js                   # rasterizes layers to img/ (2.4x)
node build.js                    # slides, layouts, notes, Morph-stable "!!" names -> base .pptx + anim_spec.json
python3 anim.py From-Hand-Sketches-to-Smart-Buildings.pptx animated.pptx anim_spec.json   # native transitions + animations
python3 xsddiff.py From-Hand-Sketches-to-Smart-Buildings.pptx animated.pptx               # schema check of the timing XML
```

`build.js` loads the pptx skill's `apply_theme.js`; set `SKILL` at the top of the file to your local copy.

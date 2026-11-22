# One Night, One Raft

A 10-slide animated 3D presentation for a university English course. It follows the construction and night pour of a **4,500 m² × 1.0 m reinforced concrete raft foundation** and uses the story to teach **nine English tenses**, one or two per slide.

## What is in this folder

| Path | What it is |
|---|---|
| `index.html` | The interactive 3D presentation (three.js). Open it and present directly. |
| `grammar.html` | Grammar reference page for the professor: form, use, reasons, script evidence, common mistakes, timelines. |
| `docs/01-script-tenses-elevenlabs.md` | Per slide: (a) tense explanation, (b) spoken script with pause marks, (c) on-slide text, (d) pacing and ElevenLabs voice cues, plus ElevenLabs-ready text with `<break>` tags and the full grammar reference. |
| `docs/02-gamma-canva-guide.md` | Gamma paste-in outline and settings, Canva deck prompt, brand kit, per-slide animation and build specs. |
| `media/slide-01.mp4` … `slide-10.mp4` | Clean 1280×720 clips of each slide's camera move (no HUD), for Canva or Gamma backgrounds. |
| `js/content.js` | **Single source of truth** for every word: tenses, slides, script, voice cues, prompts. |
| `js/scene.js` | The 3D world: site, raft layout, rebar, formwork, pumps, trucks, crew, lighting, camera. |
| `js/app.js` | HUD, slide flow, speaker notes, rehearsal voice, controls. |
| `tools/build-docs.js` | Regenerates the two Markdown documents from `js/content.js`. |

## Run it

Open `index.html` in Chrome, Edge or Firefox with an internet connection (three.js and the fonts load from CDNs). Serving the folder works too:

```bash
cd raft-presentation && python3 -m http.server 8000   # then open http://localhost:8000
```

Jump straight to a slide with `index.html#slide-7`.

### Controls

| Key | Action |
|---|---|
| → / Space / PageDown | Next slide (zoom out to the master view, then zoom in on the next zone) |
| ← / PageUp | Previous slide |
| 1–9, 0 | Go to slide 1–9, 10 |
| N | Speaker notes: tense focus, colour-coded script, ElevenLabs cues, copy buttons, browser-voice rehearsal |
| G | Nine-tense quick reference |
| A | Auto-play, each slide held for its spoken length |
| H | Clean view (HUD hidden) for screen recording |
| F | Full screen |

## How the brief maps to the scene

- **Elevated three-quarter camera:** every view stays between 36° and 43° of elevation, never top-down. Each slide pulls back to the master view, then zooms in on its zone.
- **Focus spotlight and depth dimming:** when the camera arrives, the zone gets cyan corner brackets and a ground glow, the slide's element pulses with a subtle rim glow, and everything outside the zone is softly dimmed and blurred.
- **Progressive build:** bottom mesh (slide 2), chairs (3), top mesh, side bars then front bars (4), column, wall, stair and shaft starters (5), side cover blocks and braced, nailed timber formwork (6). Bottom cover blocks appear with the bottom mesh. Each build starts at the zone in view and spreads across the raft.
- **Live HUD:** stage strip (1–10), raft specs (4,500 m², 1.00 m, ≈4,500 m³, 75 mm cover), phase and clock, and from slide 7 the logistics badges: 6 batching plants, 75 mixer trucks, 11 pumps, ~60 workers, 7 engineers. Slides 8–9 add poured volume, clock and pour rate (≈380 m³/h planning estimate).
- **People:** 22 representative workers (orange vests, yellow helmets) and all 7 engineers (lime vests, white helmets). The HUD carries the full counts, so the site is not cluttered with 60 figures.
- **Night pour:** dusk turns to night on slide 7, then six floodlight towers switch on one by one, with visible beams, lamp glow and dust. The fresh concrete is glossy and reflects the lights, and the pour front advances in two layers. Pumps aim their booms at the front, trucks discharge, queue, enter and leave, and vibrators ripple the surface.
- **Surroundings:** earthen terrain, gravel access roads, spoil heaps, a fenced site, a tower crane, a batching plant, the site office with the cube-test bench, and six concrete-frame buildings under construction.

## Matching your structural CAD drawings

The two CAD layout drawings were not available when this was built, so the raft uses a representative layout that is clearly marked and easy to edit. Open `js/scene.js` and edit the `LAYOUT` block at the top:

| Field | Meaning |
|---|---|
| `outline` | The R.C RAFT BORDER polygon in meters (`[x, z]`, x = length, z = width). The default 80 × 60 m with a 20 × 15 m notch gives exactly 4,500 m². |
| `gridX`, `gridZ`, `gridLabels*` | Structural grid lines and their bubbles. Columns are placed at grid intersections inside the raft. |
| `walls` | Retaining wall centrelines `[x1, z1, x2, z2]`. |
| `stairs` | STAIR STARTER rectangles. |
| `shafts`, `pits` | Lift shaft and pit rectangles (pits are cut out of the mesh and the concrete). |
| `matchLine` | x position of the match line between the two drawing sheets. |
| `thickness`, `cover`, spacings | Raft depth, concrete cover and the representative bar, chair and cover-block spacing. |

Everything else (rebar, chairs, cover blocks, starters, formwork, concrete, the CAD overlay, labels and crew positions) is generated from these values.

## Editing the words

Change text only in `js/content.js`, then run:

```bash
node raft-presentation/tools/build-docs.js
```

That keeps the slide cards, speaker notes, grammar page and both Markdown documents identical.

## Credits and tech

Plain HTML, CSS and JavaScript with [three.js r128](https://threejs.org/) from cdnjs. No build step. Fonts: Barlow Condensed, IBM Plex Sans and IBM Plex Mono (Google Fonts).

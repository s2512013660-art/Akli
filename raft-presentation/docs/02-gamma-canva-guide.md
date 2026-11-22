# One Night, One Raft: Gamma and Canva build guide

Ready-to-paste prompts and per-slide visual and animation cues. Generated from `js/content.js`.

## How the pieces fit together

| Tool | Role | What you use from this project |
|---|---|---|
| Interactive 3D scene (`index.html`) | The live, animated visual for every slide | Present it directly, or press **H** (clean view) + **A** (auto-play) and screen-record; ready-made clips are in `media/` |
| Gamma | Fast first draft of the deck with your exact text | The paste-in outline below |
| Canva | Final polish: brand colours, animation, video backgrounds, audio | The deck prompt, brand kit and per-slide build specs below |
| ElevenLabs | Voice-over per slide | `docs/01-script-tenses-elevenlabs.md` |

**Visual identity (use in both tools)**

- Background: deep site-night navy `#0A0F16`; panels `#101924`
- Accent: hi-vis amber `#FFB21A` (one accent only)
- Focus/CAD lines: cyan `#2FD3FF`
- Text: `#E8EEF3`, secondary `#93A4B3`
- Tense colours (verbs only): Present Simple `#6CC6FF` · Present Continuous `#2FE0C0` · Past Simple `#FFB000` · Past Continuous `#FF7B39` · Past Perfect Simple `#FF5470` · Past Perfect Continuous `#E06CFF` · Present Perfect Simple `#A594FF` · Present Perfect Continuous `#8EE05C` · Future (will / going to) `#FFE680`
- Fonts: **Barlow Condensed** (titles, bold, uppercase), **IBM Plex Sans** (body), **IBM Plex Mono** (numbers and labels)

## Gamma

### Settings

1. **Create new → Paste in text.** Paste the outline below.
2. Choose **Presentation**, **16:9**, and keep **10 cards**. The `---` lines split the cards.
3. Text handling: **Preserve** (keeps the wording; the tenses must not be rewritten).
4. Theme: a dark theme, then set the accent to `#FFB21A` and the heading font to Barlow Condensed in *Theme → Customize*.
5. Images: **AI images**, with the style prompt below in *Image style*.

### Image style prompt

```text
Photorealistic engineering visualization of a reinforced concrete raft foundation site, elevated three-quarter aerial view (35 to 45 degrees, never top-down), bare earthen terrain, concrete-frame buildings under construction around the site, workers in orange hi-vis vests with yellow helmets, engineers in lime vests with white helmets, cinematic lighting, sharp detail, no text, no logos
```

### Additional instructions (paste into Gamma's instructions box)

```text
This is a university English presentation that teaches nine verb tenses through a civil-engineering story. Keep every sentence exactly as written, especially the verbs. Use a dark, technical look: deep navy background, one amber accent, cyan for diagrams. One idea per card, at most three bullets per card, and each card's example sentence in a highlighted quote block. Put a small tag on each card that names its tense. Use the provided image prompt for each card's image. Do not add extra cards.
```

### Paste-in outline (10 cards)

```markdown
# One Raft, One Continuous Slab

**Tense:** Present Simple

- 4,500 m² reinforced concrete raft, 1.0 m thick
- One slab carries every column, retaining wall and stair core
- Layout from the structural CAD: raft border, column grid, walls, stair starters, pits

> A raft foundation distributes heavy structural loads evenly across the soil.

*Why this tense:* We describe permanent facts, fixed specifications and a general engineering principle. None of this changes with time, so we use the Present Simple.

[Image: Cinematic elevated three-quarter aerial view, 40 degree camera angle, of a large empty construction site with a 80 x 60 meter lean concrete blinding slab, glowing holographic CAD layout lines projected on it (red border, cyan grid lines, yellow column squares), bare brown earthen terrain, gravel access roads, concrete frame buildings under construction with scaffolding in the background, tower crane, golden hour light, photorealistic, engineering visualization style]

---

# Bottom Mesh: Laid and Inspected

**Tense:** Past Simple + Past Continuous

- Bottom bars spread in both directions, tied at every crossing
- Cover blocks under the mesh keep 75 mm of concrete cover
- Engineers checked the spacing row by row

> The crew laid the bottom reinforcement mesh and placed concrete cover blocks.
>
> While the workers were spreading the bars, two engineers were walking the grid.

*Why this tense:* Finished actions in a clear order: the crew laid, spread, placed and tied. Background actions in progress at that time: the engineers were walking and checking while the crew worked. A short Past Simple event (noticed) interrupts the longer Past Continuous action.

[Image: Close elevated view of construction workers in orange safety vests and yellow helmets laying a steel reinforcement bar grid on a concrete blinding slab, small concrete cover spacer blocks under the bars, two engineers in white helmets holding tablets inspecting bar spacing, daylight, realistic, focused depth of field]

---

# Rebar Chairs: Holding the Top Mesh

**Tense:** Past Continuous

- Steel chairs set on the bottom mesh in a regular grid
- They hold the top mesh at the correct level
- Spacing checked with tape measures and drawings

> Engineers were inspecting the chair spacing while workers arranged the grid.

*Why this tense:* We freeze one moment in the past (Tuesday, 10:00) and describe several actions that were in progress at the same time.

[Image: Elevated close view of workers placing steel rebar chairs in a regular grid on a bottom reinforcement mesh, engineers in white hard hats measuring spacing with a tape, organized construction site, daylight, realistic]

---

# Top Mesh: Side Bars, Then Front Bars

**Tense:** Past Simple

- Crane lifted bar bundles onto the chairs
- Side bars across the 60 m width, then front bars along the 80 m length
- Every crossing tied; top cover checked

> The crew spread the side bars across the width, then laid the front bars along the length.

*Why this tense:* A sequence of completed steps (first, then, after that, finally). It is also a chance to compare regular verbs (lifted, checked) with irregular ones (came, spread, laid).

[Image: Aerial three-quarter view of a huge raft foundation with a complete double layer steel reinforcement mesh, tower crane lowering a bundle of rebar, workers in yellow helmets tying the top mesh, daylight, photorealistic construction visualization]

---

# Starter Bars: Columns, Walls, Stairs, Shaft

**Tense:** Past Perfect Simple + Past Perfect Continuous

- Vertical starters lowered at every column, retaining wall, stair and shaft
- Lap length left above the raft for the next stage
- Positions taken directly from the CAD layout

> The engineers had inspected the braced timber formwork before the first mixer truck arrived.
>
> Crews had been preparing the site and reinforcing zones for days before the night pour began.

*Why this tense:* Something was complete before another past moment: the meshes were finished before the starter bars arrived. We stress how long an activity continued before that past moment: weeks of steel fixing.

[Image: Elevated close view of vertical steel starter bars rising from a reinforced raft mesh for columns and a retaining wall, stair core starter bars, workers lowering vertical rebar, engineers with drawings, realistic construction photography]

---

# Cover Blocks and Braced Timber Formwork

**Tense:** Past Simple + Past Continuous

- 75 mm cover blocks under the mesh and against the sides
- Timber boards enclose the 1.0 m raft edge
- External braces and stakes resist wet-concrete pressure

> The carpenters nailed the boards while the engineers were checking the alignment.

*Why this tense:* Completed steps: checked and placed the cover blocks, built the formwork, found and marked a loose brace. Activities in progress at the same time: nailing, driving stakes, checking the alignment.

[Image: Close view of timber formwork boards around the edge of a reinforced concrete raft, diagonal wooden braces to ground stakes, carpenters hammering nails, concrete cover spacer blocks under rebar, engineer with a spirit level, daylight, realistic]

---

# Night Pour: Mobilized and Ready

**Tense:** Present Perfect Simple

- 6 batching plants · 75 mixer trucks · 11 pumps
- ~60 workers (yellow helmets) · 7 engineers (white helmets)
- ≈4,500 m³ ≈ 450 truckloads in one continuous pour

> We have coordinated 6 batching plants, 75 mixer trucks, and 11 concrete pumps for tonight's pour.

*Why this tense:* All these actions are finished, but we care about the result now: the site is ready. There is no finished past time (not "yesterday"), and we give totals.

[Image: Night construction site, elevated three-quarter aerial view, floodlight towers casting beams over a reinforced raft foundation ready for pouring, concrete boom pumps around the edge, a line of mixer trucks with headlights on the access road, workers in hi-vis vests and yellow helmets gathered for a briefing, dramatic cinematic lighting]

---

# Live: Pouring Through the Night

**Tense:** Present Continuous

- Pumps placing concrete in layers
- Trucks discharging, queuing, entering and leaving
- Vibrators and hoses on every active zone

> Workers are guiding the pump hoses and vibrating fresh concrete under the floodlights.

*Why this tense:* We describe the action as it happens, at the moment of speaking, as if the audience is watching it live.

[Image: Night concrete pour of a large raft foundation, floodlights reflecting on wet fresh concrete, boom pumps placing concrete, workers in yellow helmets holding pump hoses and concrete vibrators, mixer trucks discharging into pump hoppers, cinematic, high contrast, photorealistic]

---

# Non-Stop Consolidation, Finishing and Curing

**Tense:** Present Perfect Continuous

- Vibrating, screeding and power floating without a break
- Curing follows close behind the finishers
- No cold joints: one monolithic raft

> The teams have been consolidating, leveling, and curing the concrete continuously since pouring started.

*Why this tense:* The work started in the past (8 p.m.) and is still continuing now. We emphasize the duration and the non-stop effort.

[Image: Pre-dawn construction site, freshly poured reinforced concrete raft being finished with power trowels, workers covering concrete with clear plastic curing sheets, floodlights still on, blue hour sky, realistic, wide elevated view]

---

# Next: Testing and Going Vertical

**Tense:** Future (will / going to)

- Cube tests at 7 and 28 days
- Side formwork stripped
- Columns, walls and stairs rise from the starter bars

> Engineers are going to test the concrete cubes and strip the formwork before starting the vertical columns.
>
> If the results meet the specification, the columns will rise from these starter bars.

*Why this tense:* "Going to" for plans already decided (testing, stripping). "Will" for predictions and expected outcomes (the columns will rise, the raft will carry the building).

[Image: Morning light over a completed reinforced concrete raft foundation with protruding column starter bars, formwork removed, concrete cube compression test station next to a site office, translucent blue holographic preview of future columns and walls rising, construction buildings around, optimistic cinematic]
```

### Per-card layout

| Card | Layout | Image |
|---|---|---|
| 1. One Raft, One Continuous Slab | Full-bleed image with a dark gradient on the left for text | Clip `media/slide-01.mp4` or the card's AI image |
| 2. Bottom Mesh: Laid and Inspected | Image right, text left, two example quotes as callout blocks | Clip `media/slide-02.mp4` or the card's AI image |
| 3. Rebar Chairs: Holding the Top Mesh | Large image on top, three short bullets below | Clip `media/slide-03.mp4` or the card's AI image |
| 4. Top Mesh: Side Bars, Then Front Bars | Image left, a numbered four-step sequence right | Clip `media/slide-04.mp4` or the card's AI image |
| 5. Starter Bars: Columns, Walls, Stairs, Shaft | Two-column comparison: Past Perfect vs Past Perfect Continuous | Clip `media/slide-05.mp4` or the card's AI image |
| 6. Cover Blocks and Braced Timber Formwork | Image with two labeled callouts: cover blocks, formwork + braces | Clip `media/slide-06.mp4` or the card's AI image |
| 7. Night Pour: Mobilized and Ready | Dark card with five big-number stat tiles | Clip `media/slide-07.mp4` or the card's AI image |
| 8. Live: Pouring Through the Night | Full-bleed night image, text in a translucent dark panel | Clip `media/slide-08.mp4` or the card's AI image |
| 9. Non-Stop Consolidation, Finishing and Curing | Image left, a since/for timeline graphic right | Clip `media/slide-09.mp4` or the card's AI image |
| 10. Next: Testing and Going Vertical | Image with a 7-day / 28-day timeline strip and a closing line | Clip `media/slide-10.mp4` or the card's AI image |

**Live 3D scene inside Gamma.** Add an *Embed* block to card 1 with the scene's published link. If Gamma cannot frame the page, use a button that links to it, and place the MP4 clips from `media/` as video blocks instead.

## Canva

### Brand kit

Add the colours and fonts listed under *Visual identity* to a Canva Brand Kit, so every page and text style uses them.

### Deck prompt (Canva AI / Magic Design for presentations)

```text
Create a 10-slide 16:9 presentation titled "One Night, One Raft" for a university English course. Topic: building and night-pouring a 4,500 m² reinforced concrete raft foundation, used to teach nine English tenses (one or two per slide). Style: dark engineering control-room look, deep navy background (#0A0F16), one hi-vis amber accent (#FFB21A), cyan (#2FD3FF) for diagram lines, Barlow Condensed bold titles, IBM Plex Sans body text. Each slide: a large full-bleed construction visual on the left two-thirds, a dark text panel on the right with the title, a small tense tag, at most three bullets and one highlighted example sentence. Keep the text exactly as provided.
```

Then paste each page's text from the outline above (or from the specs below).

### Per-slide build specs

#### Slide 1: One Raft, One Continuous Slab (Present Simple)

- **Background:** `media/slide-01.mp4` (muted, loop), or generate an image with: *Cinematic elevated three-quarter aerial view, 40 degree camera angle, of a large empty construction site with a 80 x 60 meter lean concrete blinding slab, glowing holographic CAD layout lines projected on it (red border, cyan grid lines, yellow column squares), bare brown earthen terrain, gravel access roads, concrete frame buildings under construction with scaffolding in the background, tower crane, golden hour light, photorealistic, engineering visualization style*
- **What the visual shows:** Elevated three-quarter aerial view (about 40°) of a 4,500 m² raft footprint on a lean-concrete blinding slab, a glowing CAD layout overlay (red raft border, cyan grid, yellow columns, magenta retaining walls, green stair starters, hatched pits), bare earthen site, access roads, and concrete-frame buildings under construction around it. Late-afternoon light.
- **Text panel:** title, tense tag (Present Simple `#6CC6FF`), bullets, example sentence with the target verbs coloured
- **Example sentence:** “A raft foundation distributes heavy structural loads evenly across the soil.”
- **Animation:** page enter: Rise (title) + Fade (bullets, 0.4 s stagger); element: Breathe on the "4,500 m²" stat; transition: Match & Move into slide 2
- **Audio:** `slide-01.mp3` from ElevenLabs; page duration ≈ 87 s

#### Slide 2: Bottom Mesh: Laid and Inspected (Past Simple + Past Continuous)

- **Background:** `media/slide-02.mp4` (muted, loop), or generate an image with: *Close elevated view of construction workers in orange safety vests and yellow helmets laying a steel reinforcement bar grid on a concrete blinding slab, small concrete cover spacer blocks under the bars, two engineers in white helmets holding tablets inspecting bar spacing, daylight, realistic, focused depth of field*
- **What the visual shows:** Zoom into the south-west zone: yellow-helmet workers carrying and spreading long bottom bars in both directions and tying crossings, small grey cover blocks under the mesh, two white-helmet engineers walking the grid with tablets.
- **Text panel:** title, tense tag (Past Simple `#FFB000`, Past Continuous `#FF7B39`), bullets, example sentence with the target verbs coloured
- **Example sentence:** “The crew laid the bottom reinforcement mesh and placed concrete cover blocks.” / “While the workers were spreading the bars, two engineers were walking the grid.”
- **Animation:** page enter: Pan (image, slow push-in); element: Wipe the two example lines in one at a time; transition: Dissolve
- **Audio:** `slide-02.mp3` from ElevenLabs; page duration ≈ 71 s

#### Slide 3: Rebar Chairs: Holding the Top Mesh (Past Continuous)

- **Background:** `media/slide-03.mp4` (muted, loop), or generate an image with: *Elevated close view of workers placing steel rebar chairs in a regular grid on a bottom reinforcement mesh, engineers in white hard hats measuring spacing with a tape, organized construction site, daylight, realistic*
- **What the visual shows:** Zoom onto the middle-south zone: rows of steel chairs dropping into place on the bottom mesh, workers carrying and tying chairs, engineers measuring chair spacing.
- **Text panel:** title, tense tag (Past Continuous `#FF7B39`), bullets, example sentence with the target verbs coloured
- **Example sentence:** “Engineers were inspecting the chair spacing while workers arranged the grid.”
- **Animation:** page enter: Fade; element: Pop the three bullets in sequence; transition: Match & Move
- **Audio:** `slide-03.mp3` from ElevenLabs; page duration ≈ 60 s

#### Slide 4: Top Mesh: Side Bars, Then Front Bars (Past Simple)

- **Background:** `media/slide-04.mp4` (muted, loop), or generate an image with: *Aerial three-quarter view of a huge raft foundation with a complete double layer steel reinforcement mesh, tower crane lowering a bundle of rebar, workers in yellow helmets tying the top mesh, daylight, photorealistic construction visualization*
- **What the visual shows:** Wider zoom over the raft: the tower crane lowering a bar bundle, workers spreading side bars across the width, then front bars along the length on top of the chairs.
- **Text panel:** title, tense tag (Past Simple `#FFB000`), bullets, example sentence with the target verbs coloured
- **Example sentence:** “The crew spread the side bars across the width, then laid the front bars along the length.”
- **Animation:** page enter: Pan; element: Line wipe across the width, then along the length (two arrows); transition: Slide (left)
- **Audio:** `slide-04.mp3` from ElevenLabs; page duration ≈ 56 s

#### Slide 5: Starter Bars: Columns, Walls, Stairs, Shaft (Past Perfect Simple + Past Perfect Continuous)

- **Background:** `media/slide-05.mp4` (muted, loop), or generate an image with: *Elevated close view of vertical steel starter bars rising from a reinforced raft mesh for columns and a retaining wall, stair core starter bars, workers lowering vertical rebar, engineers with drawings, realistic construction photography*
- **What the visual shows:** Zoom onto the east zone: vertical starter bars lowering into column positions, a double row along the retaining wall, and bars around the stair starter and lift shaft, with engineers checking against drawings.
- **Text panel:** title, tense tag (Past Perfect Simple `#FF5470`, Past Perfect Continuous `#E06CFF`), bullets, example sentence with the target verbs coloured
- **Example sentence:** “The engineers had inspected the braced timber formwork before the first mixer truck arrived.” / “Crews had been preparing the site and reinforcing zones for days before the night pour began.”
- **Animation:** page enter: Rise; element: Draw a timeline arrow: "had finished" (point) then "had been fixing" (bar); transition: Dissolve
- **Audio:** `slide-05.mp3` from ElevenLabs; page duration ≈ 81 s

#### Slide 6: Cover Blocks and Braced Timber Formwork (Past Simple + Past Continuous)

- **Background:** `media/slide-06.mp4` (muted, loop), or generate an image with: *Close view of timber formwork boards around the edge of a reinforced concrete raft, diagonal wooden braces to ground stakes, carpenters hammering nails, concrete cover spacer blocks under rebar, engineer with a spirit level, daylight, realistic*
- **What the visual shows:** Close-up of the south raft edge: grey cover blocks highlighted under and beside the mesh, timber boards rising around the 1.0 m edge, workers hammering nails and fixing diagonal braces to ground stakes, engineers checking alignment with a level.
- **Text panel:** title, tense tag (Past Simple `#FFB000`, Past Continuous `#FF7B39`), bullets, example sentence with the target verbs coloured
- **Example sentence:** “The carpenters nailed the boards while the engineers were checking the alignment.”
- **Animation:** page enter: Fade; element: Shake (tiny) on a hammer icon synced with "were nailing"; transition: Color wipe to dark navy (night begins)
- **Audio:** `slide-06.mp3` from ElevenLabs; page duration ≈ 71 s

#### Slide 7: Night Pour: Mobilized and Ready (Present Perfect Simple)

- **Background:** `media/slide-07.mp4` (muted, loop), or generate an image with: *Night construction site, elevated three-quarter aerial view, floodlight towers casting beams over a reinforced raft foundation ready for pouring, concrete boom pumps around the edge, a line of mixer trucks with headlights on the access road, workers in hi-vis vests and yellow helmets gathered for a briefing, dramatic cinematic lighting*
- **What the visual shows:** Dusk turns to night; floodlight towers switch on one by one; pumps set up around the raft, mixer trucks queue on the access road; workers gather for the pre-pour briefing; clean data badges count up: 6 plants, 75 trucks, 11 pumps, ~60 workers, 7 engineers.
- **Text panel:** title, tense tag (Present Perfect Simple `#A594FF`), bullets, example sentence with the target verbs coloured
- **Example sentence:** “We have coordinated 6 batching plants, 75 mixer trucks, and 11 concrete pumps for tonight's pour.”
- **Animation:** page enter: Neon or Fade (dark background); element: Count-up numbers: use "Typewriter" or "Tumble" on 6 / 75 / 11 / 60 / 7; transition: Match & Move
- **Audio:** `slide-07.mp3` from ElevenLabs; page duration ≈ 66 s

#### Slide 8: Live: Pouring Through the Night (Present Continuous)

- **Background:** `media/slide-08.mp4` (muted, loop), or generate an image with: *Night concrete pour of a large raft foundation, floodlights reflecting on wet fresh concrete, boom pumps placing concrete, workers in yellow helmets holding pump hoses and concrete vibrators, mixer trucks discharging into pump hoppers, cinematic, high contrast, photorealistic*
- **What the visual shows:** Night, floodlight beams; boom pumps placing concrete, the wet concrete front advancing in layers with reflections; trucks discharging into hoppers, waiting, entering and leaving; workers on scaffolding, vibrators rippling the surface; engineers supervising; logistics badges stay on screen.
- **Text panel:** title, tense tag (Present Continuous `#2FE0C0`), bullets, example sentence with the target verbs coloured
- **Example sentence:** “Workers are guiding the pump hoses and vibrating fresh concrete under the floodlights.”
- **Animation:** page enter: Fade; element: Use a short looping video of the 3D scene (exported from the HTML) as the background; transition: Dissolve
- **Audio:** `slide-08.mp3` from ElevenLabs; page duration ≈ 68 s

#### Slide 9: Non-Stop Consolidation, Finishing and Curing (Present Perfect Continuous)

- **Background:** `media/slide-09.mp4` (muted, loop), or generate an image with: *Pre-dawn construction site, freshly poured reinforced concrete raft being finished with power trowels, workers covering concrete with clear plastic curing sheets, floodlights still on, blue hour sky, realistic, wide elevated view*
- **What the visual shows:** Pre-dawn sky; the concrete front near the east end; behind it, vibrators, power floats spinning on the finished surface, curing sheets being rolled out; engineers checking temperature; elapsed-time clock in the HUD.
- **Text panel:** title, tense tag (Present Perfect Continuous `#8EE05C`), bullets, example sentence with the target verbs coloured
- **Example sentence:** “The teams have been consolidating, leveling, and curing the concrete continuously since pouring started.”
- **Animation:** page enter: Fade; element: Progress bar animation "8 p.m. → now"; transition: Color wipe to light (day)
- **Audio:** `slide-09.mp3` from ElevenLabs; page duration ≈ 73 s

#### Slide 10: Next: Testing and Going Vertical (Future (will / going to))

- **Background:** `media/slide-10.mp4` (muted, loop), or generate an image with: *Morning light over a completed reinforced concrete raft foundation with protruding column starter bars, formwork removed, concrete cube compression test station next to a site office, translucent blue holographic preview of future columns and walls rising, construction buildings around, optimistic cinematic*
- **What the visual shows:** Morning light: formwork lifting away, the cured raft with protruding starter bars, a cube-testing station by the site office, and translucent "future" columns, walls and stair cores rising, with buildings under construction around.
- **Text panel:** title, tense tag (Future (will / going to) `#FFE680`), bullets, example sentence with the target verbs coloured
- **Example sentence:** “Engineers are going to test the concrete cubes and strip the formwork before starting the vertical columns.” / “If the results meet the specification, the columns will rise from these starter bars.”
- **Animation:** page enter: Rise; element: Ghost columns: "Grow" effect; final line "Thank you" with Fade; transition: None (end)
- **Audio:** `slide-10.mp3` from ElevenLabs; page duration ≈ 77 s

### Recording your own clips from the 3D scene

1. Open the scene (published link or `index.html`) in Chrome or Edge, full screen (**F**).
2. Press **H** for the clean view (no HUD) and go to slide 1 (**Home**).
3. Start a screen recorder (Windows: Win + Alt + R or the Snipping Tool's video mode; macOS: Shift + Cmd + 5; or OBS).
4. Press **A** to auto-play: each slide zooms in, holds for its spoken length, zooms out and moves on.
5. Stop after slide 10 and split the recording per slide in Canva's video editor.

Keep the HUD (do not press H) if you want the stage bar, tense card and logistics badges inside the video.


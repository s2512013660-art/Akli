# From Hand Sketches to Smart Buildings
## How Architecture & Engineering Design Evolved

**Presentation Production Kit** · University English Course · 10 slides · 16:9 widescreen · 9 tenses
Built for a **Claude → Gamma → Canva** workflow (fully PowerPoint-compatible). Every block marked 📋 is ready to copy and paste.

---

### Contents

0. [Workflow: how to use this kit](#0-workflow-how-to-use-this-kit)
1. [Creative direction & signature system](#1-creative-direction--signature-system)
2. [Tense coverage map](#2-tense-coverage-map)
3. [Slide-by-slide deck plan (Slides 1–10)](#3-slide-by-slide-deck-plan)
4. [Image prompts (1 per slide + motion-loop prompts)](#4-image-prompts)
5. [Gamma build prompts](#5-gamma-build-prompts)
6. [Canva build prompts & animation build sheet](#6-canva-build-prompts--animation-build-sheet)
7. [Final QA checklist & grammar quick reference](#7-final-qa-checklist--grammar-quick-reference)

---

## 0. Workflow: how to use this kit

| Step | Tool | What you do | Result |
|---|---|---|---|
| 1 | **Claude** (this kit) | Lock the story, on-slide text, scripts, and grammar | Final, checked content |
| 2 | **Gamma** | Paste the card-by-card text (§5C) with the **Preserve** text setting | A 10-card structured draft |
| 3 | **Canva Magic Media / Gamma AI images / any image tool** | Generate one image per slide from §4 | 10 consistent 16:9 visuals |
| 4 | **Gamma → Export → PowerPoint (.pptx)** | Export the draft | Editable .pptx |
| 5 | **Canva** (or PowerPoint) | Import the .pptx, swap in the images, add the Design Lens, apply the motion plan (§6) | Animated final deck |
| 6 | **Canva Notes / PowerPoint Notes** | Paste each slide's spoken script (§3) | Presenter view ready |

**Why this order:** Gamma is the fastest tool for structure and layout. Canva and PowerPoint give you precise control over entrances, timing, and transitions, which Gamma only partly offers.
**Short route:** build everything directly in Canva with §6A + §6B + §6C.

---

## 1. Creative direction & signature system

### 1.1 The big idea: the deck *is* a timeline of English tenses

The slide order follows the history of design, and it also follows the timeline of English tenses:

```
S1  PRESENT SIMPLE: the timeless principle that frames the journey
 │
 ▼  EARLIER PAST  S2   Past Perfect Simple         had + V3
 │                S3   Past Perfect Continuous     had been + V-ing
 ▼  PAST          S4   Past Simple                 V2
 │                S5   Past Continuous             was/were + V-ing
 ▼  PAST → NOW    S6   Present Perfect Simple      have/has + V3
 │                S7   Present Perfect Continuous  have/has been + V-ing
 ▼  NOW           S8   Present Simple              V1 / V-s
 │                S9   Present Continuous          am/is/are + V-ing
 ▼  FUTURE        S10  Future                      will / be going to + V1
 ▼
TIME FLOWS DOWN THE DECK: earlier past → past → bridge → now → future
```

Your audience **sees** architecture move from paper to smart cities while they **hear** English move from the earlier past to the future. The design story and the grammar story are the same story.

### 1.2 Signature touch: the "Blueprint-to-Reality Lens"

Each slide is treated as one **sheet** in an architectural drawing set (A-01 → A-10). On real drawings, the **title block** in the bottom-right corner records the project, sheet number, and scale. In this deck, the **Design Lens title block** records the **Era**, the **Design Shift**, the **Motion Cue**, and the **Target Tense**. It's subtle, on-theme, and consistent.

| Property | Specification |
|---|---|
| Position | Bottom-right, 48 px from the right and bottom edges, **identical on every slide** |
| Size | 640 × 220 px on a 1920 × 1080 canvas (≈ 4.45 × 1.53 in in PowerPoint) |
| Structure | Header row (`DESIGN LENS` · `SHEET A-0X/10`) + 4 rows: `ERA` · `SHIFT` · `MOTION` · `TENSE` |
| Lines | 1.5 px hairline stroke in the slide's line color (graphite on paper slides, cyan on blueprint slides, white on dark slides) |
| Fill | Light slides: white at 85% opacity · Dark slides: Blueprint Navy `#0B2545` at 70% opacity |
| Type | Roboto Mono (fallback: Space Mono or Courier Prime), 18 px (9 pt), ALL CAPS, +8% letter spacing; the TENSE row in bold at 20 px (10 pt) |
| Tense row | A colored dot ● in the tense-family color (§1.5) + tense name + formula |

**Companion elements** (same position on every slide, so Morph / Match & move keeps them perfectly still while the content changes):

- **Evolution progress line:** a 1.5 px line along the bottom edge (from the left margin to the Lens) with 10 ticks. The current tick is filled in the tense-family color. Optional line icons above the ticks: pencil → T-square → tracing sheet → CAD cursor → wireframe cube → BIM layers → leaf → network → VR headset → skyline.
- **Grammar Spotlight strip:** bottom-left, max 1,100 px wide. It shows the example sentence with the target verb **in bold and in the tense color**, followed by the formula in mono type.

### 1.3 Motion = Meaning (the signature motion grammar)

Each tense receives a motion signature that **acts out its time meaning**, so the animation itself teaches the grammar.

| Tense | Time meaning | Motion signature | Slide |
|---|---|---|---|
| Present Simple | Always or regularly true | Steady, centered, gentle "breathing" or an even rhythmic pulse; no drift | 1, 8 |
| Past Perfect Simple | Earlier past, completed before another past point | Two-step reveal: the older layer is already there; the later-past marker appears last | 2 |
| Past Perfect Continuous | A long activity up to a past point | Layers stacking one after another + a slow push-in (duration) | 3 |
| Past Simple | One completed event | One crisp, decisive wipe, then stillness | 4 |
| Past Continuous | In progress at a past time, often overlapping | Two simultaneous motions; a cross-fade caught mid-process | 5 |
| Present Perfect Simple | Past action → present result | Scattered parts assemble into a finished model you can see now | 6 |
| Present Perfect Continuous | Started in the past and still going | A loop that is already moving when the slide appears and is still moving when you leave | 7 |
| Present Continuous | Happening now | A live 360° orbit + a scanning light sweep | 9 |
| Future (will / going to) | Ahead | Upward rise, forward push, brightening light | 10 |

**Direction grammar across the deck**

- **Slides 1–5 (history):** motion travels **left → right**, like reading a timeline.
- **Slides 6–8 (results today):** motion goes **into depth**: assembling, connecting, zooming into the model.
- **Slide 9 (now):** motion **orbits** around the viewer: immersion.
- **Slide 10 (future):** motion **rises upward and forward**.

**Motion rules (executive standard):** entrances 0.6–1.0 s · transitions 0.8–1.2 s · continuous motion slow (6–12 s) with ≤ 5–10% scale change · maximum 3 animated elements per slide · ease-in-out only · no spins, bounces, or flying letters.

### 1.4 Visual evolution map

| # | Visual state / 3D model | Palette | Layout | Text side | Motion direction |
|---|---|---|---|---|---|
| 1 | Sketch lines turning into a contemporary building | Paper cream → sky blue | Hero split | Left | Draw-on, steady breathe |
| 2 | Hand-inked plans, T-square, ink pens (overhead) | Aged paper, sepia, graphite | Panorama | Left | Slow pan L→R |
| 3 | Layered tracing paper, revision detailing | Warm lamp, yellow trace | Close-up focus | Right | Stacking + push-in |
| 4 | 2D CAD vectors replacing ink | Blueprint navy + CAD cyan | Hard split | Right | One crisp wipe L→R |
| 5 | Paper fading into 3D wireframe & massing | Navy/slate + cyan + white | Diagonal split | Left | Converge + cross-fade |
| 6 | Exploded BIM model (structure, MEP, facade, data) | Studio white + teal + MEP colors | Annotated model | Callouts | Assemble inward |
| 7 | Kinetic louvers, solar glass, green roof | Daylight, eco green, sun gold | Facade portrait | Right | Light sweep + loop |
| 8 | Shared digital twin + connected team | Light grey, cyan, navy | Hub & spokes | Center | Pulses inward |
| 9 | VR simulation: daylight rays, airflow | Near-black, neon cyan, violet | Immersive full-bleed | Left | 360° orbit |
| 10 | 3D-printed & adaptive future city | Indigo → amber → sky | Skyline | Top center | Rise upward |

### 1.5 Design tokens

**Color tokens**

| Token | Hex | Use |
|---|---|---|
| Graphite | `#2B2A28` | Text on paper slides (1–3) |
| Drafting Paper | `#F3EDE2` | Backgrounds, slides 1–3 |
| Sepia Ink | `#7A5A3A` | Sketch accents, slides 1–3 |
| Blueprint Navy | `#0B2545` | Backgrounds, slides 4–5; dark text elsewhere |
| CAD Cyan | `#4CC9F0` | Linework and highlights, slides 4–5 and 8–9 |
| Studio White | `#F7F9FC` | Backgrounds, slides 6–8 |
| Eco Green | `#2BB673` | Sustainability accents, slide 7 |
| Sun Gold | `#F2B33D` | Light accents, slides 7 and 10 |
| Immersive Black | `#070B14` | Background, slide 9 |
| Neon Violet | `#8B5CF6` | Simulation accents, slide 9 |
| Dawn Indigo → Dawn Amber | `#1E1B4B` → `#F59E0B` | Gradient, slide 10 |

**Tense-family colors** (used for the ● dot, the progress tick, and the bold spotlight verb, so the audience learns the code):

| Family | Accent (dots, ticks) | Verb text on light slides | Verb text on dark slides | Slides |
|---|---|---|---|---|
| Past family (Past Simple, Past Continuous, Past Perfect, Past Perfect Continuous) | Copper `#C8743F` | Deep Copper `#9A4F22` (5.1:1 on paper) | Light Copper `#E89A63` (6.8:1 on navy) | 2, 3, 4, 5 |
| Present Perfect family: the bridge from past to now | Teal `#0EA5A4` | Deep Teal `#0B7A79` (4.9:1 on white) | Teal `#0EA5A4` | 6, 7 |
| Present family (Present Simple, Present Continuous) | Electric Blue `#2F80ED` | Deep Blue `#1F5FBF` (5.2:1 on paper, 5.8:1 on white) | Electric Blue `#2F80ED` (5.1:1 on black) | 1, 8, 9 |
| Future | Sun Gold `#F2B33D` | not needed | Sun Gold `#F2B33D` (8.6:1 on indigo) | 10 |

*Contrast check (WCAG):* graphite on paper is 12.3:1, white on navy 15.4:1, and cyan on navy 8.0:1, all well above the 4.5:1 standard. The bright accent colors are below 4.5:1 on light backgrounds, so keep them for dots and ticks and use the text-safe shades above for any words.

**Typography & grid** (Canva 1920 × 1080 px ↔ PowerPoint 13.33 × 7.5 in; 2 px ≈ 1 pt)

| Element | Font | Canva | PowerPoint |
|---|---|---|---|
| Kicker label | Roboto Mono, caps, +12% tracking | 22 px | 11 pt |
| Slide title | Montserrat ExtraBold, line height 1.05 | 84 px | 42 pt |
| Subtitle | Inter Medium | 40 px | 20 pt |
| Bullets (max 3, ≤ 8 words each) | Inter Regular, line height 1.35 | 36 px | 18 pt |
| Grammar Spotlight | Inter (verb in Bold + tense color) + formula in Roboto Mono | 32 px / 24 px | 16 pt / 12 pt |
| Design Lens | Roboto Mono, caps | 18–20 px | 9–10 pt |
| Sketch annotations (slides 1–3 only, optional) | Architects Daughter (fallback: any clean handwriting font) | 28 px | 14 pt |

Margins: 120 px left/right, 96 px top/bottom · 12-column grid, 24 px gutters · Images full-bleed with a soft gradient scrim (60% → 0%) behind text.

---

## 2. Tense coverage map

| # | Slide | Target tense | Formula | Grammar Spotlight sentence | Time position |
|---|---|---|---|---|---|
| 1 | Title & Big Idea | Present Simple (facts & principles) | V1 / V-s | Good architectural design **balances** visual form with structural safety. | Always true |
| 2 | Before Digital Tools | Past Perfect Simple | had + V3 | Architects **had relied** on manual rulers and ink pens before CAD software became standard. | Earlier past |
| 3 | Months of Manual Revisions | Past Perfect Continuous | had been + V-ing | Teams **had been revising** hand-drawn blueprints for months before construction started. | Earlier past (duration) |
| 4 | The Rise of 2D CAD | Past Simple | V2 | Engineers **introduced** early computer-aided drafting tools to speed up the drawing process. | Finished past |
| 5 | Shifting from Paper to 3D | Past Continuous | was/were + V-ing | Design teams **were shifting** from drafting tables to digital screens during that transition. | Past, in progress |
| 6 | The BIM Revolution | Present Perfect Simple | have/has + V3 | BIM **has transformed** how architects and structural engineers coordinate complex buildings. | Past → now (result) |
| 7 | Sustainable & Smart Facades | Present Perfect Continuous | have/has been + V-ing | Engineers **have been developing** energy-smart facades in recent years. | Past → now (ongoing) |
| 8 | Collaborative Engineering Today | Present Simple (routines & processes) | V1 / V-s | Architects and structural engineers **work** on one shared model every day. | Regularly true |
| 9 | AI & VR Simulation Today | Present Continuous | am/is/are + V-ing | Designers **are testing** lighting and airflow in virtual reality right now. | Now |
| 10 | Future Architecture & Engineering | Future: will / be going to | will + V1 · am/is/are going to + V1 | Smart materials and 3D printing **will reshape** how future buildings are constructed. | Future |

**All 9 tenses covered.** Present Simple appears twice **by design**, with two different uses: Slide 1 (permanent facts and principles) and Slide 8 (routines and how a system works). Pointing this out shows your instructor a deeper understanding of the tense.

**Coach's refinements to the brief's example sentences**

| Slide | Original | Refined | Why |
|---|---|---|---|
| 4 | "…to speed up **drawings**." | "…to speed up **the drawing process**." | You speed up a *process*; "speed up drawings" sounds unnatural. |
| 5 | "…from **paper tables** to digital screens…" | "…from **drafting tables** to digital screens…" | "Drafting table" is the standard architectural term. |
| 7 | "…**over** recent years." | "…**in** recent years." | Both are correct; "in recent years" is the more common collocation. |

All other example sentences in the brief are grammatically correct and are used exactly as written.

---

## 3. Slide-by-slide deck plan

> **How to read each slide:** ① Visual / 3D model shift → ② Design Lens title block → ③ Motion & transition (Canva + PowerPoint settings) → ④ On-slide text → ⑤ Spoken script (target-tense verbs in **bold**) → ⑥ Tense coach card.
> If a named effect isn't in your version of Canva or PowerPoint, use the closest equivalent.

---

### SLIDE 1 · Title & Big Idea
`SHEET A-01/10` · **Target tense: Present Simple (facts & principles)** · Layout: Hero split · Text: left

**① Visual / 3D model shift**
A contemporary glass-and-timber building that is **half hand-drawn sketch, half photoreal reality**. Loose graphite lines on the left flow into the finished building on the right, as if the drawing is becoming real. The far-left third fades into blank cream tracing paper, which is where the title sits.
*Sets the visual DNA for the whole deck: paper → reality.*

**② Design Lens title block**

```
┌────────────────────────────────────────────────────────┐
│ DESIGN LENS                              SHEET A-01/10 │
├────────┬───────────────────────────────────────────────┤
│ ERA    │ Timeless principles                           │
│ SHIFT  │ Idea → built form                             │
│ MOTION │ Line draw-on → reveal → dissolve              │
│ TENSE  │ ● PRESENT SIMPLE · V1 / V-s                   │
└────────┴───────────────────────────────────────────────┘
  ● dot color = Present family · Electric Blue (see 1.5)
```

**③ Motion & transition**

| Phase | What moves | Canva | PowerPoint | Timing |
|---|---|---|---|---|
| Entrance | Sketch lines draw across → the photoreal building fades in over them → title rises | Line art: **Wipe** (from left) · Building image: **Fade** · Title: **Rise** · Subtitle & bullets: **Baseline** | Wipe (From Left) · Fade · Float In | 1.2 s · 1.0 s (+0.4 s delay) · 0.8 s |
| Continuous | The background "breathes" very slowly (100% → 104%): stable and steady | **Breathe** on the background image (slow) | Emphasis Grow/Shrink 104%, 10 s, Auto-Reverse, Repeat: Until End of Slide | 10 s loop |
| Exit → Slide 2 | The building "rewinds" back into paper: we travel back in time | Transition: **Dissolve** | **Fade** (Smoothly), or **Morph** if the paper texture is on both slides | 1.0 s |

*Motion = Meaning:* no drift, only steady breathing, because Present Simple describes things that are always true.
*Build trick:* place a transparent PNG of the sketch lines (or lines drawn with the Canva line tool) above the photo, then apply the Wipe to that layer only.

**④ On-slide text**

- **Kicker:** UNIVERSITY ENGLISH · 9 TENSES · ONE DESIGN JOURNEY
- **Title:** From Hand Sketches to Smart Buildings
- **Subtitle:** How Architecture & Engineering Design Evolved
- **Bullets:**
  - Design balances form and safety
  - Tools evolve; principles remain
  - Paper → pixels → smart cities
- **Grammar Spotlight:** Good architectural design **balances** visual form with structural safety. `Present Simple · Subject + V1 / V-s`
- **Footer:** [Your Name] · [Course Name] · [Date]

**⑤ Spoken script (~60 sec)**

> Good morning, everyone. Every building **begins** as an idea, and that idea **needs** a clear path from the designer's mind to the construction site. Good architectural design **balances** visual form with structural safety, and engineering **makes** that balance possible. These principles **don't change**, but the tools **do**. Today, I'm going to take you on a journey from hand sketches on paper to smart buildings that **respond** to their environment. In the corner of every slide, you'll see a small "Design Lens." It **shows** the era, the design shift, and the tense we're practicing. We **start** with the Present Simple, because we **use** it for facts, general truths, and the way things normally **work**.

*Also used naturally:* be going to (I'm going to take you), will (you'll see), Present Continuous (we're practicing).

**⑥ Tense coach card: Present Simple**

```
◆─────◆─────◆─────[ NOW ]─────◆─────◆─────◆      true always / again and again
```

- **When & why:** permanent facts, general truths, scientific or design principles, and how systems generally work.
- **Form:** ✚ Subject + V1 (he/she/it + **-s/-es**) · ✖ do/does + **not** + V1 · ❓ Do/Does + subject + V1?
- **Signal words:** always, generally, usually, in general, every, never
- **Fit with this slide:** the balance between form and safety is a timeless principle of architecture.
- **Brief example:** "Good architectural design **balances** visual form with structural safety."
- **More examples:** "Columns **carry** loads down to the foundations." · "A facade **doesn't** only **decorate** a building; it **protects** it." · "**Does** every building **need** a structural engineer?"
- **Watch out:** ✗ *Good design balance form and safety.* → ✓ *Good design **balances** form and safety.* (third-person **-s**)

---

### SLIDE 2 · Before Digital Tools
`SHEET A-02/10` · **Target tense: Past Perfect Simple** · Layout: Panorama · Text: left

**① Visual / 3D model shift**
The building disappears; we drop **back in time onto a 1960s drafting table**, seen from above. Aged cream paper with hand-inked floor plans, a wooden T-square, set squares, technical ink pens, a compass, a scale ruler, and a rolled cyan blueprint. Warm window light rakes across the paper. No screens anywhere.
*Shift from slide 1:* from a finished building → to the hand-made drawings that came before it.

**② Design Lens title block**

```
┌────────────────────────────────────────────────────────┐
│ DESIGN LENS                              SHEET A-02/10 │
├────────┬───────────────────────────────────────────────┤
│ ERA    │ Pre-1980s · manual drafting                   │
│ SHIFT  │ Ink, paper & T-square                         │
│ MOTION │ Fade in → slow pan L→R → zoom-through         │
│ TENSE  │ ● PAST PERFECT · had + V3                     │
└────────┴───────────────────────────────────────────────┘
  ● dot color = Past family · Copper (see 1.5)
```

**③ Motion & transition**

| Phase | What moves | Canva | PowerPoint | Timing |
|---|---|---|---|---|
| Entrance | The panoramic image starts a slow pan; the paper text card fades in; bullets appear one by one; **last**, a small timeline marker "▲ CAD arrives (1980s)" slides in at the right end | Image: **Pan** (left → right, slow) · Text card: **Fade** · Bullets: **Baseline** (one by one) · Marker: **Wipe** (from left), last | Image: Motion Path (Right) · Fade · Float In (By Paragraph) · Wipe (From Left), After Previous | 0.8 s each; marker after the bullets |
| Continuous | The slow left-to-right pan continues across the hand-drawn plans | Pan across the page duration (oversize the image to ~115% width) | Motion path, 10–12 s, Smooth Start/End | 10–12 s |
| Exit → Slide 3 | The camera "zooms through" the drawing into the studio close-up | **Match & move** (keep the same paper element on both pages) or **Dissolve** | **Morph** (enlarge the same paper image on slide 3) or **Zoom** | 1.0 s |

*Motion = Meaning:* the earlier action (the hand drawings) is already on screen; the later past event (▲ CAD arrives) appears **last**. That is exactly how *had + V3* orders events.

**④ On-slide text**

- **Title:** Before Digital Tools
- **Subtitle:** The era of ink, paper, and T-squares
- **Bullets:**
  - Every line was drawn by hand
  - Precision depended on skill and rulers
  - One error could mean a new sheet
- **Mini timeline:** Manual drafting ●━━━━━━━━ ▲ CAD arrives (1980s)
- **Grammar Spotlight:** Architects **had relied** on manual rulers and ink pens before CAD software became standard. `Past Perfect · had + V3`

**⑤ Spoken script (~60 sec)**

> Let's travel back in time. Before computer-aided design spread through offices in the 1980s and 1990s, architects **had relied** on manual tools for centuries. By the time a project reached the construction site, its drafters **had drawn** every wall, door, and staircase by hand, with T-squares, set squares, and technical ink pens. When a drafter found a mistake they **had made** hours earlier, they scraped the ink away with a razor blade, or they redrew the entire sheet. Copies were printed as blueprints, with white lines on blue paper, which is why we still use that word today. This is the Past Perfect Simple: *had* plus the past participle. It shows that one past action was completed before another past moment.

*Also used naturally:* Past Simple (spread, reached, found, scraped, redrew, were printed), Present Simple (use, is, shows).

**⑥ Tense coach card: Past Perfect Simple**

```
───●──────────────▲──────────────────[ NOW ]
   had relied     CAD became standard
   (earlier past) (later past)
```

- **When & why:** an action completed **before** another past action or a past time point. It makes the order of past events clear: the "past of the past."
- **Form:** ✚ Subject + **had** + V3 · ✖ **had not (hadn't)** + V3 · ❓ **Had** + subject + V3?
- **Signal words:** before, after, by the time, already, by 1985, until then, when + Past Simple
- **Fit with this slide:** the manual era happened before the CAD milestone, so it is the earlier past.
- **Brief example:** "Architects **had relied** on manual rulers and ink pens before CAD software became standard."
- **More examples:** "By 1990, many firms **had** already **bought** their first CAD workstations." · "The drafters **hadn't finished** the elevations when the client arrived." · "**Had** the team **checked** the dimensions before they printed the blueprints?"
- **Watch out:** ✗ *By the time CAD arrived, architects **have drawn** everything by hand.* → ✓ *…architects **had drawn** everything by hand.* ✗ *had **drew*** → ✓ *had **drawn*** (use V3, not V2).
- **Accuracy note:** after *before* and *after*, the Past Perfect is sometimes optional, because the conjunction already shows the order. Using it adds emphasis and precision.

---

### SLIDE 3 · Months of Manual Revisions
`SHEET A-03/10` · **Target tense: Past Perfect Continuous** · Layout: Close-up focus · Text: right

**① Visual / 3D model shift**
We move from the overhead table **down into a 1970s studio close-up at dusk**: layers of translucent yellow tracing paper stacked over a staircase section, red-pencil revision clouds, eraser crumbs, a warm desk lamp, pinned sheets softly blurred on a cork wall.
*Shift from slide 2:* from one finished drawing → to the **long, repeated process** behind every drawing.

**② Design Lens title block**

```
┌────────────────────────────────────────────────────────┐
│ DESIGN LENS                              SHEET A-03/10 │
├────────┬───────────────────────────────────────────────┤
│ ERA    │ 1960s–70s design studio                       │
│ SHIFT  │ Months of layered revisions                   │
│ MOTION │ Layer stack → push-in → line wipe             │
│ TENSE  │ ● PAST PERFECT CONT. · had been + V-ing       │
└────────┴───────────────────────────────────────────────┘
  ● dot color = Past family · Copper (see 1.5)
```

**③ Motion & transition**

| Phase | What moves | Canva | PowerPoint | Timing |
|---|---|---|---|---|
| Entrance | Three tracing-paper layers settle one after another with slight offsets; then the text card appears | Each layer: **Fade** + **Rise**, staggered by 0.3 s · Text card: **Fade** | Fade / Float In, After Previous, 0.3 s delay each | 0.6 s per layer |
| Continuous | A slow push-in toward the detail; a red revision cloud "draws" itself after bullet 2 | Background: **Breathe** (slow) · Cloud: **Wipe** | Grow/Shrink 110%, 12 s · Wipe (From Left) | 12 s |
| Exit → Slide 4 | A clean digital line sweeps across and turns paper into CAD | **Line wipe** (left → right) | **Wipe** (From Left) | 0.9 s |

*Motion = Meaning:* layer after layer accumulating over time = **duration up to a past point** (*had been revising*).
*Build trick:* make the layers from 3 cream rectangles at 35–50% transparency, each rotated ±1.5°, over the photo.

**④ On-slide text**

- **Title:** Months of Manual Revisions
- **Subtitle:** Layer after layer of tracing paper
- **Bullets:**
  - Every change meant a new layer
  - Dimensions checked line by line
  - Months of redrawing before construction
- **Grammar Spotlight:** Teams **had been revising** hand-drawn blueprints for months before construction started. `Past Perfect Continuous · had been + V-ing`

**⑤ Spoken script (~60 sec)**

> Now, let's step inside a design studio in the 1970s. Imagine a team designing a new hospital. By the time construction finally began, the drafters **had been revising** the drawings for months. Every time the client changed a room or an engineer moved a column, someone placed a fresh sheet of tracing paper over the old drawing and redrew the details. The team **had been checking** every dimension by hand, line by line, for so long that their desks had almost disappeared under layers of paper. This is the Past Perfect Continuous: *had been* plus the *-ing* form. We use it to emphasize the duration of an action that continued up to a specific moment in the past. Here, that moment is the start of construction.

*Also used naturally:* Past Simple (began, changed, moved, placed, redrew, continued), Past Perfect Simple (had almost disappeared), Present Simple (use, is).

**⑥ Tense coach card: Past Perfect Continuous**

```
───[▓▓▓▓▓▓▓▓▓▓▓▓▓▓]▲─────────────────[ NOW ]
    had been revising  construction started
    (duration)         (past point)
```

- **When & why:** an action that was **in progress over a period of time up to a past point**. It emphasizes duration, or explains the cause of a past result ("They were exhausted because they had been redrawing all night").
- **Form:** ✚ Subject + **had been** + V-ing · ✖ **hadn't been** + V-ing · ❓ **Had** + subject + **been** + V-ing?
- **Signal words:** for (months), since (1974), all week, by the time, before, how long
- **Fit with this slide:** manual revision was a long, repeated process that ended when construction began.
- **Brief example:** "Teams **had been revising** hand-drawn blueprints for months before construction started."
- **More examples:** "The drafters were exhausted because they **had been redrawing** the facade all week." · "By 1985, the firm **had been using** the same drafting tables for twenty years." · "How long **had** the engineers **been checking** the calculations before they found the error?"
- **Watch out:** ✗ *They had been **revise** the plans.* → ✓ *They had been **revising** the plans.* ✗ *had been **knowing*** → ✓ *had **known*** (stative verbs such as *know*, *own*, *believe* don't take the continuous form).
- **Architect's precision note:** strictly, teams revised the original *drawings*; *blueprints* were the printed copies. Everyday English uses "blueprints" for both, so the brief's sentence is fine.

---

### SLIDE 4 · The Rise of 2D CAD
`SHEET A-04/10` · **Target tense: Past Simple** · Layout: Hard split · Text: right (white on navy)

**① Visual / 3D model shift**
The warm paper world is **cut by a clean vertical seam**: on the left, a hand-inked floor plan on cream paper; on the right, the same plan as **crisp glowing cyan CAD vectors on a blueprint-navy grid**, with dimension lines, snap points, and a precision crosshair cursor.
*Shift from slide 3:* from warm, layered, imperfect → to **cool, exact, digital**. The palette flips from paper to blueprint.

**② Design Lens title block**

```
┌────────────────────────────────────────────────────────┐
│ DESIGN LENS                              SHEET A-04/10 │
├────────┬───────────────────────────────────────────────┤
│ ERA    │ 1963–1980s · early CAD                        │
│ SHIFT  │ Ink lines → 2D vectors                        │
│ MOTION │ Crisp wipe L→R → cursor snap → morph          │
│ TENSE  │ ● PAST SIMPLE · V2                            │
└────────┴───────────────────────────────────────────────┘
  ● dot color = Past family · Copper (see 1.5)
```

**③ Motion & transition**

| Phase | What moves | Canva | PowerPoint | Timing |
|---|---|---|---|---|
| Entrance | **One crisp wipe** reveals the CAD half; then the dates 1963 → 1982 appear along a horizontal line | CAD half: **Wipe** (from left, fast) · Dates: **Pop** or **Fade**, in sequence | Wipe (From Left, 0.6 s) · Fade, After Previous | 0.6 s + 0.5 s per date |
| Continuous | Almost still: a crosshair cursor snaps across 3 grid points, then **stops** | **Create an Animation** (short path) on a crosshair icon | Motion path of 3 short line segments, 0.4 s each | ~1.5 s, no loop |
| Exit → Slide 5 | The navy CAD grid glides into the next slide and lifts into 3D | **Match & move** (keep the navy grid on both pages) | **Morph** | 1.0 s |

*Motion = Meaning:* one decisive movement, then stillness = **a finished event at a known time** (Past Simple).

**④ On-slide text**

- **Title:** The Rise of 2D CAD
- **Subtitle:** From ink lines to precise vectors
- **Bullets:**
  - 1963: Sketchpad put drawing on screen
  - 1982: AutoCAD reached personal computers
  - Edits took seconds, not hours
- **Grammar Spotlight:** Engineers **introduced** early computer-aided drafting tools to speed up the drawing process. `Past Simple · V2 (regular -ed / irregular)`

**⑤ Spoken script (~60 sec)**

> Then **came** a turning point. In 1963, Ivan Sutherland **created** Sketchpad, one of the first programs that **let** people draw directly on a computer screen. Nearly twenty years later, in 1982, Autodesk **released** AutoCAD, and drafting **began** to move onto personal computers. Engineers **introduced** these tools to speed up the drawing process, and the change **was** dramatic: designers **copied**, **edited**, and **measured** lines in seconds instead of hours. This is the Past Simple. We use it for completed actions at a specific time in the past. Notice the time expressions: *in 1963*, *in 1982*, *twenty years later*. They tell us that the action is finished and that the time is known.

*Also used naturally:* Present Simple (use, notice, tell, is).

**⑥ Tense coach card: Past Simple**

```
──────────●──────────────────────────[ NOW ]
          released AutoCAD (1982): finished, time known
```

- **When & why:** completed actions at a **specific, finished time** in the past; milestones; a sequence of past events in a story.
- **Form:** ✚ Subject + V2 (*released*, *came*, *let*) · ✖ **didn't** + V1 · ❓ **Did** + subject + V1?
- **Signal words:** in 1982, in the 1980s, … years ago, last year, then, when, after that
- **Fit with this slide:** the arrival of CAD is a dated historical milestone.
- **Brief example (refined):** "Engineers **introduced** early computer-aided drafting tools to speed up the drawing process."
- **More examples:** "Autodesk **released** AutoCAD in 1982." · "Many small firms **didn't buy** computers until the late 1980s." · "When **did** your university **switch** to CAD?"
- **Watch out:** ✗ *In 1982, Autodesk **has released** AutoCAD.* → ✓ *In 1982, Autodesk **released** AutoCAD.* (finished time = Past Simple) · ✗ *didn't **changed*** → ✓ *didn't **change***
- **Pronunciation of -ed:** /t/ after voiceless sounds: introduc**ed**, releas**ed** · /d/ after voiced sounds: allow**ed**, cop**ied**, measur**ed** · /ɪd/ after t/d: creat**ed**, edit**ed**

---

### SLIDE 5 · Shifting from Paper to 3D
`SHEET A-05/10` · **Target tense: Past Continuous** · Layout: Diagonal split · Text: left

**① Visual / 3D model shift**
A **1990s–2000s studio desk caught mid-transition**: on the left, paper drawings and a white foam-board massing model; on the right, the same building rising as a **luminous cyan 3D wireframe and grey massing model** from a monitor. A diagonal seam where paper fragments dissolve into glowing polygons.
*Shift from slide 4:* from flat 2D lines → to **volume and depth**. For the first time, the model has three dimensions.

**② Design Lens title block**

```
┌────────────────────────────────────────────────────────┐
│ DESIGN LENS                              SHEET A-05/10 │
├────────┬───────────────────────────────────────────────┤
│ ERA    │ 1990s–2000s                                   │
│ SHIFT  │ Paper → 3D wireframes                         │
│ MOTION │ Split converge → cross-fade → morph           │
│ TENSE  │ ● PAST CONTINUOUS · was/were + V-ing          │
└────────┴───────────────────────────────────────────────┘
  ● dot color = Past family · Copper (see 1.5)
```

**③ Motion & transition**

| Phase | What moves | Canva | PowerPoint | Timing |
|---|---|---|---|---|
| Entrance | The paper half and the 3D half slide in **from opposite sides** and meet at the diagonal seam | Left image: **Pan** (from left) · Right image: **Pan** (from right) · Text: **Fade** | **Split** transition into the slide, or two Fly In effects (From Left / From Right), With Previous | 1.0 s |
| Continuous | The paper slowly fades (100% → 40%) **while** the wireframe brightens (40% → 100%): both actions in progress | Use the 6–8 s motion-loop video (§4), or a slow **Fade** exit on the paper layer | Fade Exit on the paper layer (5 s) **With Previous** a Fade Entrance on the wireframe | 5–8 s |
| Exit → Slide 6 | The wireframe solidifies into the full BIM model | **Match & move** or **Dissolve** | **Morph** | 1.0 s |

*Motion = Meaning:* two motions happening at the same time = **two past actions in progress simultaneously** (*while some were sketching, others were building*).

**④ On-slide text**

- **Title:** Shifting from Paper to 3D
- **Subtitle:** Two worlds on one desk
- **Bullets:**
  - Studios were moving from tables to screens
  - Paper and wireframes were sharing desks
  - Designers were learning to think in 3D
- **Grammar Spotlight:** Design teams **were shifting** from drafting tables to digital screens during that transition. `Past Continuous · was/were + V-ing`

**⑤ Spoken script (~60 sec)**

> By the 1990s, an even bigger change **was happening**. Studios **were moving** from drafting tables to digital screens, but the shift didn't happen overnight. On many desks, paper drawings and computer monitors **were sitting** side by side. While some designers **were** still **sketching** by hand, others **were building** the first 3D wireframes and massing models. In the mid-1990s, while builders **were raising** the Guggenheim Museum in Bilbao, Frank Gehry's team **was using** CATIA, software originally developed for designing aircraft, to define the museum's curved titanium forms. This is the Past Continuous: *was* or *were* plus the *-ing* form. We use it for actions in progress at a time in the past, often as the background to another event.

*Also used naturally:* Past Simple (didn't happen), Present Simple (use, is).

**⑥ Tense coach card: Past Continuous**

```
───[▓▓▓▓▓▓▓●▓▓▓▓▓▓]──────────────────[ NOW ]
    were shifting  ● another past event happens in the middle
```

- **When & why:** an action **in progress at a specific past moment**; the background to another past event (often with *when*/*while*); two actions in progress at the same time (*while*).
- **Form:** ✚ Subject + **was/were** + V-ing · ✖ **wasn't/weren't** + V-ing · ❓ **Was/Were** + subject + V-ing?
- **Signal words:** while, when, at that time, during the 1990s, all morning, at 9 a.m. yesterday
- **Fit with this slide:** the move from paper to 3D was a long process, with many actions overlapping.
- **Brief example (refined):** "Design teams **were shifting** from drafting tables to digital screens during that transition."
- **More examples:** "**While** the team **was building** a foam model, the client asked for a 3D walkthrough." (interrupted action) · "In 1995, many students **were** still **learning** to draft by hand." · "What software **were** architects **using** before BIM appeared?"
- **Watch out:** ✗ *While the designers sketched, the computer **was crashing**.* → ✓ *While the designers **were sketching**, the computer **crashed**.* (the long action is continuous; the short interruption is Past Simple) · ✗ *They **was** shifting* → ✓ *They **were** shifting*

---

### SLIDE 6 · The BIM Revolution
`SHEET A-06/10` · **Target tense: Present Perfect Simple** · Layout: Annotated model · Text: callouts around the model

**① Visual / 3D model shift**
The wireframe becomes a **fully detailed BIM model in exploded axonometric view**, floating in a clean white studio: concrete frame and steel beams, floor slabs, color-coded MEP systems (blue ducts, red pipes, yellow cable trays), and a translucent glass facade, linked by thin cyan data nodes. Three callout leaders point to STRUCTURE, MEP, and DATA.
*Shift from slide 5:* from a geometric shell → to **an intelligent model in which every element carries information**. We cross the bridge from the past to the present.

**② Design Lens title block**

```
┌────────────────────────────────────────────────────────┐
│ DESIGN LENS                              SHEET A-06/10 │
├────────┬───────────────────────────────────────────────┤
│ ERA    │ Early 2000s → today                           │
│ SHIFT  │ Drawings → one BIM model                      │
│ MOTION │ Layers assemble → orbit → zoom in             │
│ TENSE  │ ● PRESENT PERFECT · have/has + V3             │
└────────┴───────────────────────────────────────────────┘
  ● dot color = Present Perfect family · Teal (see 1.5)
```

**③ Motion & transition**

| Phase | What moves | Canva | PowerPoint | Timing |
|---|---|---|---|---|
| Entrance | Exploded layers glide down and **lock together** into one model; then the 3 callout leaders draw out | Layer bands: **Pan** (direction: down), staggered 0.2 s · Callout lines: **Wipe** | Fly In (From Top), After Previous, 0.2 s stagger · Wipe | 0.8 s per layer |
| Continuous | A slow turntable rotation; a red clash marker pulses, then turns into a green check | 6–8 s motion-loop video (§4) or **Breathe** · Green check: **Pop** over the red dot | Pulse (emphasis) on the red dot → Fade in the green check | 8 s |
| Exit → Slide 7 | A zoom into the facade of the model | **Circle wipe** or **Match & move** | **Zoom** or **Morph** | 1.0 s |

*Motion = Meaning:* pieces from the past assemble into **a complete result you can see now** (Present Perfect).
*Build trick:* remove the image background (Canva Background Remover), duplicate the model 3 times, crop each copy to one horizontal band (roof and facade · middle floors with MEP · base and structure), and animate the bands in sequence.

**④ On-slide text**

- **Title:** The BIM Revolution
- **Subtitle:** One intelligent model for every discipline
- **Bullets:**
  - BIM has linked structure, MEP, and geometry
  - Teams have caught clashes before construction
  - Data has become part of every element
- **Model callout labels:** STRUCTURE · MEP · DATA
- **Grammar Spotlight:** BIM **has transformed** how architects and structural engineers coordinate complex buildings. `Present Perfect · have/has + V3`

**⑤ Spoken script (~60 sec)**

> So, what **has changed** since then? The biggest answer is BIM, which stands for Building Information Modeling. Since the early 2000s, BIM **has transformed** the way architects and structural engineers coordinate complex buildings. Instead of separate drawings, teams now share one intelligent 3D model in which every wall, beam, duct, and pipe carries data. As a result, project teams **have caught** thousands of clashes on screen instead of on the construction site. Many governments **have** also **made** BIM a requirement. The United Kingdom, for example, made it mandatory for central government projects in 2016. This is the Present Perfect Simple: *have* or *has* plus the past participle. We use it for past actions with results that matter now. But notice: with a finished time, like *in 2016*, we switch to the Past Simple.

*Also used naturally:* Present Simple (stands for, coordinate, share, carries, use, matter), Past Simple (made it mandatory in 2016). **This contrast is a strong teaching moment: point to it.**

**⑥ Tense coach card: Present Perfect Simple**

```
───────────●════════════════════════▶[ NOW ]
           BIM arrives                result visible today
```

- **When & why:** a past action with a **present result**; changes and achievements up to now; life experiences; unfinished time periods (*since*, *for*, *so far*, *this decade*). The exact time is not stated or not important.
- **Form:** ✚ Subject + **have/has** + V3 · ✖ **haven't/hasn't** + V3 · ❓ **Have/Has** + subject + V3?
- **Signal words:** since, for, already, yet, just, ever, never, so far, recently, up to now
- **Fit with this slide:** BIM started in the past, but its impact is visible on every project today.
- **Brief example:** "BIM **has transformed** how architects and structural engineers coordinate complex buildings."
- **More examples:** "BIM **has reduced** design errors on large projects." · "Our firm **hasn't printed** a full paper set for years." · "**Have** you ever **opened** a BIM model?"
- **Key contrast:** ✓ *Many countries **have adopted** BIM.* (no finished time) vs ✓ *The UK **made** BIM mandatory **in 2016**.* (finished time → Past Simple)
- **Watch out:** ✗ *BIM **has transformed** the industry **in 2005**.* → ✓ *BIM **has transformed** the industry **since** the early 2000s.*

---

### SLIDE 7 · Sustainable & Smart Facades
`SHEET A-07/10` · **Target tense: Present Perfect Continuous** · Layout: Facade portrait · Text: right (glass card)

**① Visual / 3D model shift**
We zoom from the BIM model **onto a real, living facade**: a contemporary mid-rise with **kinetic timber-and-aluminum louvers**, a responsive shading screen inspired by the mashrabiya, photovoltaic glass, and green roof terraces. Golden-hour light streams through, casting patterned shadows; thin dashed sun-path arcs and airflow lines are overlaid.
*Shift from slide 6:* from internal systems → to **a building skin that reacts to climate**. The palette turns green and gold.

**② Design Lens title block**

```
┌────────────────────────────────────────────────────────┐
│ DESIGN LENS                              SHEET A-07/10 │
├────────┬───────────────────────────────────────────────┤
│ ERA    │ 2010s → today                                 │
│ SHIFT  │ Static walls → adaptive skins                 │
│ MOTION │ Light sweep → louver loop → dissolve          │
│ TENSE  │ ● PRES. PERFECT CONT. · have/has been + V-ing │
└────────┴───────────────────────────────────────────────┘
  ● dot color = Present Perfect family · Teal (see 1.5)
```

**③ Motion & transition**

| Phase | What moves | Canva | PowerPoint | Timing |
|---|---|---|---|---|
| Entrance | A band of sunlight sweeps across the facade; then the glass text card appears | Light overlay (white → transparent gradient, 25% opacity): **Wipe** (from left) · Card: **Fade** | Wipe (From Left) on the overlay · Fade | 1.2 s · 0.8 s |
| Continuous | The louvers keep opening and closing; a sun icon travels along the dashed sun-path arc | 6–8 s motion-loop video (§4) · Sun icon: **Create an Animation** along the arc | Motion path (Arc), 8 s, Auto-Reverse, Repeat: Until End of Slide | 8 s loop |
| Exit → Slide 8 | The light dissolves into the network view | **Dissolve** | **Fade** or **Morph** | 1.0 s |

*Motion = Meaning:* the loop is **already moving** when the slide appears and is **still moving** when you leave = started in the past, continuing now (Present Perfect Continuous).

**④ On-slide text**

- **Title:** Sustainable & Smart Facades
- **Subtitle:** Building skins that respond to sun and climate
- **Bullets:**
  - Adaptive louvers that follow the sun
  - Daylight in, excess heat out
  - Solar glass and green roofs save energy
- **Grammar Spotlight:** Engineers **have been developing** energy-smart facades in recent years. `Present Perfect Continuous · have/has been + V-ing`

**⑤ Spoken script (~60 sec)**

> At the same time, building skins **have been getting** smarter. Over the past two decades, engineers **have been developing** energy-smart facades that respond to sunlight, heat, and wind. The Al Bahr Towers in Abu Dhabi, for example, use a dynamic shading screen inspired by the traditional mashrabiya: its panels open and close as the sun moves across the sky. Meanwhile, designers **have been testing** adaptive louvers, solar glass, and green roofs to reduce cooling energy, and that work is still going on today. This is the Present Perfect Continuous: *have* or *has been* plus the *-ing* form. We use it for actions that started in the past, have continued over time, and are still in progress.

*Optional local hook (after "mashrabiya"):* "…the same idea we see in the shanasheel of old Baghdad and Basra."
*Also used naturally:* Present Simple (respond, use, open, close, moves), Present Continuous (is still going on), Past Simple (started), Present Perfect Simple (have continued).

**⑥ Tense coach card: Present Perfect Continuous**

```
──────[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓[ NOW ]▓▓▶
       have been developing: started in the past, still going
```

- **When & why:** an activity or trend that **started in the past and continues now**, with the focus on the process and its duration; also a recent activity with visible present evidence.
- **Form:** ✚ Subject + **have/has been** + V-ing · ✖ **haven't/hasn't been** + V-ing · ❓ **Have/Has** + subject + **been** + V-ing?
- **Signal words:** for, since, recently, lately, in recent years, over the past decade, all year, how long
- **Fit with this slide:** sustainable facade research is an ongoing process, not a finished one.
- **Brief example (refined):** "Engineers **have been developing** energy-smart facades in recent years."
- **More examples:** "Our studio **has been testing** a kinetic facade since January." · "The sensors **have been collecting** daylight data all week." · "How long **have** researchers **been studying** green roofs?"
- **Key contrast:** *Engineers **have developed** a new facade.* (finished result) vs *Engineers **have been developing** new facades.* (ongoing process)
- **Watch out:** ✗ *Engineers **are developing** smart facades since 2010.* → ✓ *Engineers **have been developing** smart facades since 2010.*

---

### SLIDE 8 · Collaborative Engineering Today
`SHEET A-08/10` · **Target tense: Present Simple (routines & processes)** · Layout: Hub & spokes · Text: center + 3 nodes

**① Visual / 3D model shift**
The camera pulls back into a **bright modern engineering studio**: architects, structural engineers, and mechanical/electrical engineers gathered around a large interactive table showing a **glowing digital twin** of the building, with remote colleagues on a video wall. Thin cyan data lines connect every device to the central model.
*Shift from slide 7:* from one smart building → to **the connected team behind it**. People return to the story.

**② Design Lens title block**

```
┌────────────────────────────────────────────────────────┐
│ DESIGN LENS                              SHEET A-08/10 │
├────────┬───────────────────────────────────────────────┤
│ ERA    │ Today                                         │
│ SHIFT  │ Separate files → shared model                 │
│ MOTION │ Nodes link → steady pulse → circle wipe       │
│ TENSE  │ ● PRESENT SIMPLE · V1 / V-s                   │
└────────┴───────────────────────────────────────────────┘
  ● dot color = Present family · Electric Blue (see 1.5)
```

**③ Motion & transition**

| Phase | What moves | Canva | PowerPoint | Timing |
|---|---|---|---|---|
| Entrance | The model appears at the center; the 3 bullet nodes appear clockwise; data lines grow from each node to the model | Model: **Pop** or **Fade** · Nodes: **Baseline** (clockwise order) · Lines: **Wipe** toward the center | Zoom (entrance) · Fade, After Previous · Wipe | 0.8 s + 0.4 s per node |
| Continuous | Small light dots travel along the lines **at a steady, even rhythm** | **Create an Animation** on 3 small dots, or an animated pulse sticker | Motion path along each line, 2 s, Repeat: Until End of Slide | 2 s cycle |
| Exit → Slide 9 | We dive into the model, entering VR | **Circle wipe** | **Zoom** transition or **Fly Through** | 1.0 s |

*Motion = Meaning:* a steady, repeating rhythm = **routines and processes** (Present Simple). Compare it with slide 1's breathing: same tense, different use.

**④ On-slide text**

- **Title:** Collaborative Engineering Today
- **Subtitle:** One model. One source of truth.
- **Bullets (as 3 hub nodes):**
  - Every discipline works on shared data
  - One change updates the whole model
  - The cloud connects teams across cities
- **Grammar Spotlight:** Architects and structural engineers **work** on one shared model every day. `Present Simple · Subject + V1 / V-s`

**⑤ Spoken script (~60 sec)**

> Let's see how design **works** today. On a modern project, architects, structural engineers, and mechanical and electrical engineers **work** on one shared model. When the architect **moves** a wall, the structural model **updates**, and the engineer **gets** a notification. Cloud platforms **connect** team members in different cities, so everyone always **sees** the latest version. This is the Present Simple again, but with a different use. On the first slide, it described permanent principles; here, it **describes** routines, processes, and how a system normally **works**. A simple rule: if something **happens** regularly or **is** generally true, the Present Simple is the right choice.

*Also used naturally:* Past Simple (described), imperative (let's see).

**⑥ Tense coach card: Present Simple (second use: routines & processes)**

```
──◆────◆────◆────◆────[ NOW ]────◆────◆────◆──      every day, every change
```

- **When & why:** routines, regular processes, step-by-step descriptions of how a system works, and timetables.
- **Form:** same as slide 1; pay special attention to **-s** with *he/she/it* and **does/doesn't** in questions and negatives.
- **Signal words:** every day, every Monday, usually, often, normally, whenever, when (general)
- **Fit with this slide:** shared-model coordination is how professional teams work every day.
- **Example:** "Architects and structural engineers **work** on one shared model every day."
- **More examples:** "The coordination team **meets** every Monday to review clashes." · "The software **doesn't overwrite** changes; it **saves** every version." · "How **does** the model **update** when someone **moves** a column?"
- **Watch out:** ✗ *The model **update** automatically.* → ✓ *The model **updates** automatically.* · ✗ *Does the engineer **receives** an alert?* → ✓ *Does the engineer **receive** an alert?* (after *does*, use V1)

---

### SLIDE 9 · AI & VR Simulation Today
`SHEET A-09/10` · **Target tense: Present Continuous** · Layout: Immersive full-bleed (dark) · Text: left

**① Visual / 3D model shift**
We enter the model. **An architect wearing a VR headset stands inside a life-size holographic atrium** that hasn't been built yet: volumetric daylight rays, a translucent cyan-to-violet airflow heat map, glowing wireframe edges, and AI-generated design options orbiting at eye level. Deep near-black environment with neon light.
*Shift from slide 8:* from looking **at** a model → to standing **inside** it. The deck's only dark slide: maximum contrast and drama.

**② Design Lens title block**

```
┌────────────────────────────────────────────────────────┐
│ DESIGN LENS                              SHEET A-09/10 │
├────────┬───────────────────────────────────────────────┤
│ ERA    │ Right now                                     │
│ SHIFT  │ Screens → immersive simulation                │
│ MOTION │ Blur-to-sharp → 360° orbit → push up          │
│ TENSE  │ ● PRESENT CONTINUOUS · am/is/are + V-ing      │
└────────┴───────────────────────────────────────────────┘
  ● dot color = Present family · Electric Blue (see 1.5)
```

**③ Motion & transition**

| Phase | What moves | Canva | PowerPoint | Timing |
|---|---|---|---|---|
| Entrance | The scene goes from blurred to sharp, like putting on a headset; the title glows in | Background: **Blur** (in) or **Clarify** · Title: **Fade** · Bullets: **Baseline** | **Fly Through** transition into the slide · Text: Fade | 1.0 s |
| Continuous | A slow 360° orbit; a scanning light sweeps through the atrium again and again | 6–8 s motion-loop video (§4) | Embedded looping video, or a slow Pan motion path on an oversized image, Auto-Reverse | 8 s loop |
| Exit → Slide 10 | The view rises toward the future skyline | **Slide** (upward, if available) or **Dissolve** | **Push** (From Bottom) | 1.0 s |

*Motion = Meaning:* live, orbiting, scanning motion = **happening right now** (Present Continuous).

**④ On-slide text**

- **Title:** AI & VR Simulation Today
- **Subtitle:** Testing buildings before they exist
- **Bullets:**
  - Designers are walking through virtual spaces
  - AI is generating new design options
  - Simulations are testing light and airflow live
- **Grammar Spotlight:** Designers **are testing** lighting and airflow in virtual reality right now. `Present Continuous · am/is/are + V-ing`

**⑤ Spoken script (~60 sec)**

> Right now, as I'**m speaking**, designers around the world **are walking** through buildings that don't exist yet. They **are wearing** VR headsets and **testing** light, space, and airflow in real time. At the same time, AI tools **are generating** hundreds of design options and **comparing** them for energy use, cost, and comfort. Clients **aren't** just **looking** at flat drawings anymore; they **are experiencing** their future homes and offices before construction even begins. This is the Present Continuous: *am*, *is*, or *are* plus the *-ing* form. We use it for actions happening at this moment and for current trends that are developing around now.

*Also used naturally:* Present Simple (don't exist, begins, is, use).

**⑥ Tense coach card: Present Continuous**

```
─────────────────────[▓▓▓ NOW ▓▓▓]─────────────────────
                      are testing: in progress at this moment
```

- **When & why:** actions happening **at the moment of speaking**; temporary situations; current, developing trends. (It can also describe fixed future arrangements: "We're presenting on Monday.")
- **Form:** ✚ Subject + **am/is/are** + V-ing · ✖ **am not / isn't / aren't** + V-ing · ❓ **Am/Is/Are** + subject + V-ing?
- **Signal words:** now, right now, at the moment, currently, these days, this semester, increasingly, Look!
- **Fit with this slide:** VR and AI simulation is a live trend in design studios today.
- **Brief example:** "Designers **are testing** lighting and airflow in virtual reality right now."
- **More examples:** "Our class **is** currently **using** VR to review student projects." · "AI **isn't replacing** architects; it **is supporting** them." · "**Are** you **testing** the daylight model at the moment?"
- **Watch out:** ✗ *Designers **testing** VR now.* → ✓ *Designers **are testing** VR now.* (don't drop the auxiliary) · ✗ *This design **is belonging** to our team.* → ✓ *This design **belongs** to our team.* (stative verb)

---

### SLIDE 10 · Future Architecture & Engineering
`SHEET A-10/10` · **Target tense: Future (will / be going to)** · Layout: Skyline · Text: top center + 3 rising columns

**① Visual / 3D model shift**
The view rises out of the simulation into **a sustainable future city at dawn**: in the foreground, a robotic gantry 3D printer layers the curved concrete walls of an organic house; behind it, adaptive smart-glass towers, timber high-rises with vertical forests, sky bridges, and drones rising into an indigo-to-amber sky.
*Shift from slide 9:* from simulating buildings → to **printing and growing whole cities**. The journey ends in daylight, completing the arc from paper to light.

**② Design Lens title block**

```
┌────────────────────────────────────────────────────────┐
│ DESIGN LENS                              SHEET A-10/10 │
├────────┬───────────────────────────────────────────────┤
│ ERA    │ 2030 and beyond                               │
│ SHIFT  │ Built → printed & adaptive                    │
│ MOTION │ Rise → print path → fade to dawn              │
│ TENSE  │ ● FUTURE · will / be going to + V1            │
└────────┴───────────────────────────────────────────────┘
  ● dot color = Future · Sun Gold (see 1.5)
```

**③ Motion & transition**

| Phase | What moves | Canva | PowerPoint | Timing |
|---|---|---|---|---|
| Entrance | The camera rises: the skyline enters from below; the title ascends; the 3 bullet columns rise left → right | Background: **Pan** (direction: up) · Title: **Ascend** · Bullets: **Rise**, staggered | Fly In (From Bottom) · Float In · Fly In, After Previous | 1.0 s · 0.8 s · 0.3 s stagger |
| Continuous | The printer head moves along the wall; drones drift upward; the dawn light slowly brightens | Printer head: **Create an Animation** · Drones: **Drift** · Light overlay: slow **Fade** | Motion path · Float In · Fade overlay (5 s) | 6–10 s |
| End | Hold → fade to the dawn color → closing line "Thank you · Questions?" | Final element: **Fade** | **Fade** (Smoothly) | 1.5 s |

*Motion = Meaning:* upward and forward = **the future**.

**④ On-slide text**

- **Title:** Future Architecture & Engineering
- **Subtitle:** Printed, adaptive, intelligent
- **Bullets (3 rising columns):**
  - 3D printers will build homes in days
  - Smart materials will adapt to climate
  - We're going to design these cities
- **Grammar Spotlight:** Smart materials and 3D printing **will reshape** how future buildings are constructed. `will + V1` · We **are going to design** them. `am/is/are going to + V1`
- **Closing line:** Thank you · Questions?

**⑤ Spoken script (~70 sec)**

> Finally, let's look ahead. What **will** buildings **look** like in twenty years? I think 3D printing and smart materials **will reshape** the way we construct them. Robotic printers **will build** walls in days instead of months, and adaptive facades **will react** to heat and light on their own. Some cities have already set clear targets: Dubai, for example, aims to use 3D printing for a quarter of its buildings by 2030. With progress like this, the construction industry **is going to change** faster than ever, and as future engineers, we **are going to design** these buildings ourselves. Remember: we use *will* for predictions and promises, and *going to* for plans and for predictions based on present evidence. Thank you. I'**ll be** happy to answer your questions.

*Also used naturally:* Present Perfect Simple (have already set), Present Simple (think, construct, aims, use).

**⑥ Tense coach card: Future (will / be going to)**

```
──────────────────────────[ NOW ]──────────●──────────▶
                                           will reshape / are going to design
```

| | **will + V1** | **am/is/are going to + V1** |
|---|---|---|
| Use | Predictions based on opinion (*I think*, *probably*), promises, offers, instant decisions | Plans and intentions decided before speaking; predictions based on present evidence |
| ✚ | 3D printing **will reshape** construction. | We **are going to design** a printed pavilion. |
| ✖ | Robots **won't replace** architects. | We **aren't going to use** paper drawings. |
| ❓ | **Will** smart glass **replace** curtains? | **Are** you **going to study** BIM next year? |
| Signals | I think, probably, in the future, by 2050, soon | already planned, look at…, with progress like this |

- **Fit with this slide:** the future of architecture involves both predictions (will) and concrete plans (going to).
- **Brief example:** "Smart materials and 3D printing **will reshape** how future buildings are constructed."
- **More examples:** "I think robots **will print** entire neighborhoods by 2040." · "Look at the progress in Dubai: 3D printing **is going to become** normal." · "I**'ll send** you the slides after class." (offer / instant decision)
- **Watch out:** ✗ *Buildings will **to adapt** to climate.* → ✓ *Buildings will **adapt** to climate.* · ✗ *We **going to** design them.* → ✓ *We **are going to** design them.*

---

## 4. Image prompts

**How to use:**
- **Full prompt** → Gamma AI images, Adobe Firefly, Midjourney, DALL·E, Ideogram, Leonardo, and other tools with long prompts.
- **Short prompt (≤ 220 characters)** → tools with tight prompt limits (for example, Canva Magic Media).
- **Motion-loop prompt** → any image-to-video tool (5–8 s seamless loop) to create the *continuous motion* layer. Start from the image you generated.
- **Settings for every image:** aspect ratio **16:9** (Midjourney: add `--ar 16:9`) · generate 3–4 variations and pick the one with the cleanest straight lines and the clearest empty text area · use **the same tool/model for all 10 slides** for consistent color grading · export at least 1920 × 1080 (ideally 3840 × 2160).

📋 **Series Style Anchor** (append to every full prompt)
```
Series style: cinematic architectural visualization, ultra-detailed photoreal 3D render quality, 16:9 widescreen, 8K, crisp focus, physically based materials, soft global illumination, refined minimalist composition with generous negative space for headline text, subtle blueprint-to-reality motif of fine drafting lines, consistent color grading across the series. No text, no letters, no numbers, no logos, no watermark.
```

📋 **Negative prompt** (where supported)
```
text, letters, numbers, captions, signature, watermark, logo, brand names, distorted perspective, warped or bent straight lines, melted geometry, extra fingers, deformed hands, blurry, low resolution, noise, oversaturated colors, clutter, cartoon style
```

---

**🖼 Slide 1 · Title & Big Idea** · text-safe area: **left third**

📋 Full
```
A contemporary glass-and-timber cultural building that transforms seamlessly from a loose, expressive hand-drawn graphite sketch on the left into a photorealistic finished building on the right; the sketch lines continue into the real structure as fine glowing white construction lines, as if the drawing is becoming reality. Elegant cantilevered roof, vertical timber fins, reflective glass, a calm plaza with a reflecting pool. Soft morning light, pale gradient from warm tracing-paper cream to cool sky blue. Eye-level wide shot, 24mm lens, balanced calm composition, building in the right two-thirds, the far-left third fading into clean blank cream paper for the title.
```
📋 Short
```
Contemporary glass and timber building turning from a loose graphite sketch on the left into photoreal reality on the right, glowing white drafting lines, soft morning light, cream to sky blue, empty left third, no text
```
🎞 Motion loop: `Very slow 4% push-in; sketch lines softly glow and settle into the real building; calm, static camera; seamless loop.`

---

**🖼 Slide 2 · Before Digital Tools** · text-safe area: **left third**

📋 Full
```
Top-down flat-lay of a vintage wooden drafting table in a 1960s architecture office: large sheets of aged cream drafting paper with precise hand-inked floor plans and elevations, a wooden T-square, clear acrylic 45-degree and 30/60-degree set squares, a brass compass, technical ink pens, a triangular scale ruler, an eraser shield, a lettering template, graphite pencils, and a small rolled blueprint in classic cyan blue. Warm natural window light raking across the paper to reveal its texture, subtle ink sheen, gentle vignette. Extra-wide panoramic composition designed for a slow left-to-right pan; the left third is mostly clean paper. No computers, no modern objects.
```
📋 Short
```
Top-down vintage drafting table, hand-inked floor plans on aged cream paper, wooden T-square, set squares, ink pens, compass, warm window light, panoramic, clean left third, no computers, no text
```
🎞 Motion loop: `Slow lateral camera pan from left to right across the drafting table; dust motes drifting in the window light.`

---

**🖼 Slide 3 · Months of Manual Revisions** · text-safe area: **right third**

📋 Full
```
Close-up three-quarter view of an architect's drafting table in a 1970s design studio at dusk: several overlapping layers of translucent yellow and white tracing paper over a detailed staircase section drawing, red-pencil revision clouds and arrows, graphite smudges, eraser crumbs, a drafting brush, a scale ruler, a desk lamp casting a warm pool of light, pinned drawing sheets on a cork wall softly blurred in the background, a coffee mug at the edge. Shallow depth of field (85mm, f/2.8), focus on the stacked tracing-paper edges, rich paper texture, cinematic warm tungsten light with soft shadows. Subject in the left two-thirds, softly blurred calm area in the right third.
```
📋 Short
```
Close-up 1970s drafting table, layered yellow tracing paper over a stair section drawing, red pencil revision clouds, eraser crumbs, warm desk lamp, shallow depth of field, soft blurred right third, no text
```
🎞 Motion loop: `Very slow push-in toward the layered tracing paper; a top sheet settles gently; lamp light breathes subtly.`

---

**🖼 Slide 4 · The Rise of 2D CAD** · text-safe area: **right third (navy)**

📋 Full
```
A precise split composition: on the left, a hand-inked architectural floor plan on cream paper; at a clean vertical seam, the same floor plan continues on the right as crisp glowing cyan CAD vector linework on a deep blueprint-navy digital grid, with dimension lines, snap points, layer colors, and a precision crosshair cursor. Ultra-sharp, perfectly straight lines, subtle screen glow, minimal and technical, high contrast. Straight-on orthographic view. The right third has open navy grid space for white headline text.
```
📋 Short
```
Split image: hand-inked floor plan on cream paper on the left, same plan as glowing cyan CAD vector lines on a navy grid on the right, crosshair cursor, ultra sharp, open navy space right, no text
```
🎞 Motion loop: `Cyan vector lines draw themselves across the navy grid; a crosshair cursor snaps between grid points; then stillness.`

---

**🖼 Slide 5 · Shifting from Paper to 3D** · text-safe area: **left third**

📋 Full
```
An architecture studio desk from the late 1990s captured mid-transition: on the left, paper drawings and a white foam-board massing model; toward the right, the same building rises as a luminous cyan 3D wireframe and a smooth grey massing model emerging from a computer monitor and floating above the desk; along a diagonal seam, paper fragments dissolve into glowing wireframe particles and polygons. Cool blue-slate studio light mixed with a warm desk lamp, cinematic, slight atmospheric haze. Three-quarter view, 35mm. Left third calm and softly out of focus for text. No brand logos.
```
📋 Short
```
1990s architecture desk, paper drawings and a foam massing model turning into a glowing cyan 3D wireframe rising from a monitor, diagonal dissolve, blue-slate light, cinematic, calm left third, no text
```
🎞 Motion loop: `Paper drawings dissolve into floating wireframe particles that assemble into the 3D model; slow drift to the right.`

---

**🖼 Slide 6 · The BIM Revolution** · text-safe area: **space around a centered model**

📋 Full
```
An exploded axonometric 3D BIM model of a modern eight-story building floating in a clean white studio space: layers separated slightly apart, including grey concrete foundations and columns, steel beams, floor slabs, color-coded MEP systems (blue air ducts, red and orange pipes, yellow cable trays), and a translucent glass curtain-wall facade, with thin cyan data nodes and connection lines linking the components. Precise, ultra-detailed, technical-beauty render, soft studio lighting with subtle reflections, 30-degree isometric angle, model centered with clean empty space around it for callout labels.
```
📋 Short
```
Exploded axonometric BIM model of a modern 8-story building, concrete frame, steel beams, blue ducts, red pipes, yellow cable trays, glass facade, thin cyan data lines, white studio, centered, no text
```
🎞 Motion loop: `Exploded layers glide slowly together and lock into place, then a slow turntable rotation.`

---

**🖼 Slide 7 · Sustainable & Smart Facades** · text-safe area: **right third (sky)**

📋 Full
```
A contemporary mid-rise building with an adaptive kinetic facade: rotating vertical timber-and-aluminum louvers and a geometric responsive shading screen inspired by traditional mashrabiya lattice, photovoltaic glass panels, terraces with green planting, and a green roof. Golden-hour sunlight streams through the louvers, creating patterned shadows; a subtle overlay of thin dashed sun-path arcs and soft airflow lines in white and green. Low-angle three-quarter view, 24mm, warm sun and fresh green palette, clear sky. Building in the left two-thirds, open sky in the right third for text.
```
📋 Short
```
Modern building with kinetic timber louvers and a mashrabiya-inspired shading screen, solar glass, green roof, golden-hour light with patterned shadows, low angle, open sky in right third, no text
```
🎞 Motion loop: `Louvers slowly rotate open and closed; sunlight and patterned shadows glide across the facade; seamless loop.`

---

**🖼 Slide 8 · Collaborative Engineering Today** · text-safe area: **balanced space on both sides**

📋 Full
```
A bright modern engineering studio: a diverse team of architects and structural and mechanical engineers gathered around a large interactive table display showing a glowing 3D digital-twin model of a building, with colleagues joining on a large video wall; thin luminous cyan data lines connect each person's tablet and laptop to the central model like a network. Natural daylight, clean white and light-grey interior with cyan accents, natural relaxed poses, professional clothing, faces partly turned toward the model, realistic hands. Wide 28mm view, model at the visual center with balanced space on both sides. No logos on screens.
```
📋 Short
```
Bright studio, diverse architects and engineers around a table display with a glowing 3D building model, video wall, cyan data lines linking devices, daylight, natural poses, no text
```
🎞 Motion loop: `Small light pulses travel steadily along the data lines toward the central model; gentle parallax; seamless loop.`

---

**🖼 Slide 9 · AI & VR Simulation Today** · text-safe area: **left third (dark)**

📋 Full
```
An architect wearing a sleek VR headset stands inside a life-size holographic interior of an unbuilt museum atrium, surrounded by a live simulation: volumetric daylight rays, a translucent airflow heat map in cyan-to-violet gradients, glowing wireframe edges, and several floating AI-generated design-option models orbiting at eye level. Dark immersive environment, deep navy-black with neon cyan and violet light, cinematic volumetric lighting, slight motion-blur hints on the orbiting elements. Medium-wide shot, figure in the right half, darker negative space in the left third for text. No interface words.
```
📋 Short
```
Architect in VR headset inside a life-size holographic atrium, daylight rays, cyan-violet airflow heat map, floating design options, dark immersive neon, figure on right, dark left third, no text
```
🎞 Motion loop: `Slow 360-degree camera orbit around the architect; a scanning light sweeps through the atrium; heat map shimmers.`

---

**🖼 Slide 10 · Future Architecture & Engineering** · text-safe area: **upper third (sky)**

📋 Full
```
A futuristic sustainable city at dawn seen from a low upward angle: in the foreground, a large robotic gantry 3D printer layering the curved concrete walls of an organic-shaped house; behind it, adaptive smart-glass towers with self-shading facades, timber high-rises with vertical forests, sky bridges, solar canopies, and small drones rising into the sky. Dawn gradient sky from deep indigo to warm amber and soft sky blue; optimistic, epic but clean, cinematic, sharp detail. Strong upward vanishing lines; open sky in the upper third for the headline.
```
📋 Short
```
Futuristic city at dawn, robotic 3D printer layering a curved concrete house, smart-glass towers, vertical forests, drones, indigo to amber sky, low upward angle, open upper third, no text
```
🎞 Motion loop: `Camera rises slowly upward; the printer nozzle lays a new concrete layer; drones drift upward; dawn light brightens.`

---

## 5. Gamma build prompts

### 5A. Gamma settings
*(Option names can differ slightly between Gamma versions.)*

| Setting | Value |
|---|---|
| Start | **Create new → Paste in text** (for §5C) or **Generate** (for §5B) |
| Format | Presentation |
| Card size / page setup | **16:9** (not Fluid) |
| Text handling | **Preserve** (keeps your exact wording and, most importantly, your verb tenses) |
| Card split | Card-by-card, using the `---` separators |
| Images | AI images · image style: `cinematic architectural visualization, photoreal 3D render, crisp straight lines, soft global illumination, no text` |
| Theme | A clean, minimal, sans-serif theme; if the theme editor allows custom fonts, set Montserrat (headings) and Inter (body) |
| Language | English |

> ⚠️ **Grammar safety rule:** whenever you ask any AI tool to rewrite, shorten, or redesign, add: **"Do not change any verb tenses or grammar examples."** AI rewriting can silently turn *had been revising* into *revised* and break your tense coverage.

### 5B. Option 1: one-shot Generate prompt

📋
```
Create a 10-card, 16:9 presentation titled "From Hand Sketches to Smart Buildings: How Architecture & Engineering Design Evolved" for a university English course. Each card teaches one English tense through the evolution of architectural and engineering design. Use exactly 10 cards in this order:

1. Title & Big Idea — Present Simple — sketch lines turning into a contemporary building
2. Before Digital Tools — Past Perfect Simple — hand-inked plans, T-square, ink pens on a drafting table
3. Months of Manual Revisions — Past Perfect Continuous — layered tracing paper and red revision marks
4. The Rise of 2D CAD — Past Simple — ink plan beside glowing cyan CAD vectors on a navy grid
5. Shifting from Paper to 3D — Past Continuous — paper drawings dissolving into 3D wireframes
6. The BIM Revolution — Present Perfect Simple — exploded BIM model with structure, MEP, and data
7. Sustainable & Smart Facades — Present Perfect Continuous — kinetic louvers, solar glass, green roof
8. Collaborative Engineering Today — Present Simple — team around a shared digital-twin model
9. AI & VR Simulation Today — Present Continuous — architect in VR inside a live simulation
10. Future Architecture & Engineering — Future (will / going to) — 3D-printed, adaptive future city at dawn

On every card include: (1) a short headline and a one-line subtitle; (2) a maximum of 3 bullets, 8 words or fewer each, written in that card's target tense; (3) a "Grammar Spotlight" line with one example sentence, the verb in bold, and the formula (for example, had + past participle); (4) a small "DESIGN LENS" line styled like an architectural drawing title block, showing Sheet A-0X/10, Era, Design Shift, Motion cue, and Target Tense.

Visual style: executive minimalism, generous white space, strong hierarchy, high-contrast text, bold geometric headings, clean sans-serif body text, monospace labels. Visual evolution from card to card: cards 1–3 warm drafting-paper cream with graphite; cards 4–5 blueprint navy with cyan linework; cards 6–8 bright studio white with teal and cyan accents (card 7 adds eco green and sun gold); card 9 near-black with neon cyan and violet; card 10 a dawn gradient from indigo to amber. Every card needs a different, high-resolution AI image matching its description, with no text inside the image. Alternate layouts so that no two consecutive cards look the same. Use correct, natural academic English. Do not change any verb tenses.
```

### 5C. Option 2 (recommended): card-by-card paste text
Paste everything inside the block into **Paste in text**, choose **Preserve**, and split card-by-card.

📋
```
# From Hand Sketches to Smart Buildings
### How Architecture & Engineering Design Evolved
UNIVERSITY ENGLISH · 9 TENSES · ONE DESIGN JOURNEY
- Design balances form and safety
- Tools evolve; principles remain
- Paper → pixels → smart cities

**Grammar Spotlight · Present Simple (Subject + V1 / V-s):** Good architectural design **balances** visual form with structural safety.

DESIGN LENS · SHEET A-01/10 · ERA: Timeless principles · SHIFT: Idea → built form · MOTION: Draw-on → reveal → dissolve · TENSE: Present Simple

[Your Name] · [Course Name] · [Date]

---

# Before Digital Tools
### The era of ink, paper, and T-squares
- Every line was drawn by hand
- Precision depended on skill and rulers
- One error could mean a new sheet

Manual drafting ●━━━━━━━━ ▲ CAD arrives (1980s)

**Grammar Spotlight · Past Perfect (had + V3):** Architects **had relied** on manual rulers and ink pens before CAD software became standard.

DESIGN LENS · SHEET A-02/10 · ERA: Pre-1980s manual drafting · SHIFT: Ink, paper & T-square · MOTION: Slow pan left → right · TENSE: Past Perfect Simple

---

# Months of Manual Revisions
### Layer after layer of tracing paper
- Every change meant a new layer
- Dimensions checked line by line
- Months of redrawing before construction

**Grammar Spotlight · Past Perfect Continuous (had been + V-ing):** Teams **had been revising** hand-drawn blueprints for months before construction started.

DESIGN LENS · SHEET A-03/10 · ERA: 1960s–70s studio · SHIFT: Months of layered revisions · MOTION: Layer stack → push-in · TENSE: Past Perfect Continuous

---

# The Rise of 2D CAD
### From ink lines to precise vectors
- 1963: Sketchpad put drawing on screen
- 1982: AutoCAD reached personal computers
- Edits took seconds, not hours

**Grammar Spotlight · Past Simple (V2):** Engineers **introduced** early computer-aided drafting tools to speed up the drawing process.

DESIGN LENS · SHEET A-04/10 · ERA: 1963–1980s early CAD · SHIFT: Ink lines → 2D vectors · MOTION: One crisp wipe → stillness · TENSE: Past Simple

---

# Shifting from Paper to 3D
### Two worlds on one desk
- Studios were moving from tables to screens
- Paper and wireframes were sharing desks
- Designers were learning to think in 3D

**Grammar Spotlight · Past Continuous (was/were + V-ing):** Design teams **were shifting** from drafting tables to digital screens during that transition.

DESIGN LENS · SHEET A-05/10 · ERA: 1990s–2000s · SHIFT: Paper → 3D wireframes · MOTION: Split converge → cross-fade · TENSE: Past Continuous

---

# The BIM Revolution
### One intelligent model for every discipline
- BIM has linked structure, MEP, and geometry
- Teams have caught clashes before construction
- Data has become part of every element

**Grammar Spotlight · Present Perfect (have/has + V3):** BIM **has transformed** how architects and structural engineers coordinate complex buildings.

DESIGN LENS · SHEET A-06/10 · ERA: Early 2000s → today · SHIFT: Drawings → one BIM model · MOTION: Layers assemble → orbit · TENSE: Present Perfect Simple

---

# Sustainable & Smart Facades
### Building skins that respond to sun and climate
- Adaptive louvers that follow the sun
- Daylight in, excess heat out
- Solar glass and green roofs save energy

**Grammar Spotlight · Present Perfect Continuous (have/has been + V-ing):** Engineers **have been developing** energy-smart facades in recent years.

DESIGN LENS · SHEET A-07/10 · ERA: 2010s → today · SHIFT: Static walls → adaptive skins · MOTION: Light sweep → louver loop · TENSE: Present Perfect Continuous

---

# Collaborative Engineering Today
### One model. One source of truth.
- Every discipline works on shared data
- One change updates the whole model
- The cloud connects teams across cities

**Grammar Spotlight · Present Simple (Subject + V1 / V-s):** Architects and structural engineers **work** on one shared model every day.

DESIGN LENS · SHEET A-08/10 · ERA: Today · SHIFT: Separate files → shared model · MOTION: Nodes link → steady pulse · TENSE: Present Simple

---

# AI & VR Simulation Today
### Testing buildings before they exist
- Designers are walking through virtual spaces
- AI is generating new design options
- Simulations are testing light and airflow live

**Grammar Spotlight · Present Continuous (am/is/are + V-ing):** Designers **are testing** lighting and airflow in virtual reality right now.

DESIGN LENS · SHEET A-09/10 · ERA: Right now · SHIFT: Screens → immersive simulation · MOTION: Blur-to-sharp → 360° orbit · TENSE: Present Continuous

---

# Future Architecture & Engineering
### Printed, adaptive, intelligent
- 3D printers will build homes in days
- Smart materials will adapt to climate
- We're going to design these cities

**Grammar Spotlight · Future (will + V1 / am-is-are going to + V1):** Smart materials and 3D printing **will reshape** how future buildings are constructed. We **are going to design** them.

DESIGN LENS · SHEET A-10/10 · ERA: 2030 and beyond · SHIFT: Built → printed & adaptive · MOTION: Rise → fade to dawn · TENSE: Future (will / going to)

Thank you · Questions?
```

### 5D. Gamma refinement prompts (use Gamma's AI edit after generating)

📋 **Global polish**
```
Apply to all cards: keep my text exactly and do not change any verb tenses. Maximum 3 bullets per card. Put the "Grammar Spotlight" line in a subtle highlighted callout near the bottom of each card. Put the "DESIGN LENS" line in a small bordered box with monospace, all-caps text as the last element of each card. Increase white space, keep headings on one line, and keep text high-contrast against the background.
```

📋 **Visual evolution**
```
Change the card backgrounds to follow this evolution: cards 1–3 warm cream paper (#F3EDE2) with graphite text (#2B2A28); cards 4–5 blueprint navy (#0B2545) with cyan accents (#4CC9F0) and white text; cards 6 and 8 studio white (#F7F9FC) with teal accents (#0EA5A4); card 7 white with eco green (#2BB673) and sun gold (#F2B33D) accents; card 9 near-black (#070B14) with neon cyan and violet (#8B5CF6) accents; card 10 a dawn gradient from indigo (#1E1B4B) to amber (#F59E0B). Do not change any text.
```

📋 **Layout rhythm**
```
Use a different layout on each card and keep all text unchanged: card 1 accent image on the right, text on the left; card 2 full background image, text on the left; card 3 full background image, text on the right; card 4 accent image on the left half, text on the right over a navy background; card 5 accent image on the right, text on the left; card 6 large image on top, centered model, text below; card 7 accent image on the left, text on the right; card 8 image on top, the three bullets as three columns below; card 9 full dark background image, text on the left; card 10 full background image, title centered at the top, the three bullets as three columns at the bottom.
```
*(Adjust to Gamma's available layouts: accent image left / right / top, or background image. Exact corner placement of the Design Lens isn't always possible in Gamma's flowing card layouts; you can place it precisely later in Canva or PowerPoint.)*

📋 **Replace a card image**
```
Replace this card's image with a new AI image generated from this prompt: [paste the slide's full prompt from Section 4]. Keep it 16:9, with no text inside the image. Do not change any text on the card.
```

📋 **Tighten text safely**
```
Shorten every bullet on this card to 8 words or fewer. Keep the same verb tense in every bullet, and do not edit the Grammar Spotlight sentence.
```

### 5E. Export
**Share/Export → PowerPoint (.pptx)** for animation in Canva or PowerPoint · **PDF** as a backup for submission.

---

## 6. Canva build prompts & animation build sheet

### 6A. Canva AI / Magic Design prompt

📋
```
Create a 10-page 16:9 presentation titled "From Hand Sketches to Smart Buildings: How Architecture & Engineering Design Evolved" for a university English class that teaches 9 English tenses. Style: modern executive minimalism, high contrast, generous spacing, bold geometric headings (Montserrat), clean body text (Inter), small monospace labels. The visuals must evolve on every page: warm drafting paper and graphite (pages 1–3), blueprint navy with cyan CAD lines (pages 4–5), bright white studio with teal data accents (pages 6–8), dark immersive neon (page 9), and a dawn-gradient future city (page 10). Pages: 1 Title & Big Idea (Present Simple); 2 Before Digital Tools (Past Perfect); 3 Months of Manual Revisions (Past Perfect Continuous); 4 The Rise of 2D CAD (Past Simple); 5 Shifting from Paper to 3D (Past Continuous); 6 The BIM Revolution (Present Perfect); 7 Sustainable & Smart Facades (Present Perfect Continuous); 8 Collaborative Engineering Today (Present Simple); 9 AI & VR Simulation Today (Present Continuous); 10 Future Architecture & Engineering (will / going to). Each page has a headline, up to 3 short bullets, a "Grammar Spotlight" sentence with the verb highlighted, and a small architectural title-block badge in the bottom-right corner. Do not change any verb tenses.
```
Then replace the generated text with the exact on-slide text from §3 (④ on each slide), so every tense stays correct.

### 6B. Canva setup (one time, about 15 minutes)

1. **Create a design → Presentation (16:9)**: 1920 × 1080 px.
2. **Colors:** add the tokens from §1.5 to your Brand Kit, or keep them in the document's color palette.
3. **Fonts:** Montserrat ExtraBold (titles) · Inter (body) · Roboto Mono (labels and the Design Lens).
4. **Build the Design Lens once (page 1):**
   - Rectangle 640 × 220 px, 12 px corner radius (or 0 px for a stricter drawing look), 1.5 px border, white fill at 85% opacity (Canva Transparency slider: 85). On dark slides, use a navy fill at 70% opacity (slider: 70).
   - Add a 1.5 px horizontal line under the header and 4 thin row dividers; add a vertical divider about 110 px from the left edge for the labels.
   - Text: `DESIGN LENS` (left) · `SHEET A-01/10` (right) · labels `ERA / SHIFT / MOTION / TENSE` · values from §3 (②).
   - Small circle ● in the tense-family color before the tense name.
   - **Group** everything, place it 48 px from the bottom-right corner, then **copy and paste it onto every page** (it keeps the same position) and edit the values.
5. **Progress line:** a 1.5 px line with 10 small circles along the bottom; fill the current slide's circle with the tense color. Group it and copy it to every page.
6. **Images:** Apps → **Magic Media** → paste the **short prompt** (§4) → choose a landscape/16:9 option → generate → right-click → **Set image as background** (or Replace background).
7. **Text:** add the on-slide text from §3 (④), or **import the Gamma .pptx** (upload it to Canva) and fix fonts and spacing on each page.
8. **Optional quick start:** apply **Magic Animate** to get a base layer of motion, then override each page with the build sheet below.
9. **Notes:** paste each spoken script (§3 ⑤) into the page **Notes**; use **Present → Presenter view** to see them while you speak.

### 6C. Animation build sheet (all 10 slides)

| # | Entrance (in order) | Continuous motion | Transition to next | Tense meaning |
|---|---|---|---|---|
| 1 | Line art **Wipe** (from left) → building **Fade** → title **Rise** → bullets **Baseline** | Background **Breathe** (slow) | **Dissolve** 1.0 s | Steady = always true |
| 2 | Image **Pan** (left → right, slow) → text card **Fade** → bullets **Baseline** → ▲ marker **Wipe** last | Slow pan continues | **Match & move** / Dissolve | Earlier past first, later past last |
| 3 | 3 tracing layers **Fade + Rise** (0.3 s stagger) → text **Fade** | Slow **Breathe** push-in · cloud **Wipe** | **Line wipe** (left → right) | Layers over time = duration |
| 4 | CAD half **Wipe** (fast) → dates **Pop** in sequence | Cursor snap (Create an Animation), then still | **Match & move** | One decisive event |
| 5 | Left image **Pan** from left + right image **Pan** from right (together) → text **Fade** | Paper fades out **while** wireframe brightens (loop video) | **Match & move** / Dissolve | Two actions in progress |
| 6 | Model bands **Pan** downward (0.2 s stagger) → callout lines **Wipe** | Turntable loop · green check **Pop** | **Circle wipe** | Past parts → present result |
| 7 | Light overlay **Wipe** → glass card **Fade** | Louver loop video · sun icon on arc path | **Dissolve** | Started earlier, still moving |
| 8 | Model **Pop** → nodes **Baseline** (clockwise) → lines **Wipe** inward | Even pulses along lines | **Circle wipe** | Regular rhythm = routine |
| 9 | Background **Blur/Clarify** → title **Fade** → bullets **Baseline** | 360° orbit loop video | **Slide** (up) / Dissolve | Live = happening now |
| 10 | Background **Pan** up → title **Ascend** → bullets **Rise** (stagger) | Printer path · drones **Drift** · light **Fade** | Final **Fade** | Upward = future |

**Canva tips:** select an element → **Animate** → choose the effect → set Enter/Exit and speed. Click elements in the order you want them to appear (or use the animation timing controls, if your version shows them). Add page transitions by hovering between two pages → **Add transition**. For continuous motion, a 6–8 s looping video (from the §4 motion-loop prompts) usually looks smoother than stacking effects.

### 6D. PowerPoint alternative (for a true "PowerPoint-style flow")

1. **Design → Slide Size → Widescreen (16:9).**
2. Put the Design Lens and progress line on every slide **in exactly the same position**. In the **Selection Pane**, name them `!!Lens` and `!!Progress` on every slide; the `!!` prefix forces **Morph** to match them, so they stay perfectly still while everything else evolves.
3. **Transitions:** **Morph** (Effect Options → Objects), 1.0 s, between consecutive slides, and use the specific transitions from §3 where noted (Fade, Wipe, Push, Zoom, Fly Through).
4. **Continuous motion:** Animation Pane → effect → **Timing → Repeat: Until End of Slide**, plus **Auto-Reverse** for gentle loops.
5. **Notes:** paste the scripts into the Notes pane; present with **Presenter View**.

### 6E. Final export

**Present** directly from Canva (with Presenter view) · **MP4** to preview the motion end to end · **PPTX** if you'll present from PowerPoint · **PDF** as a submission backup (PDF has no animation).

---

## 7. Final QA checklist & grammar quick reference

### 7.1 Pre-submission checklist

**Grammar**
- [ ] Each slide's Grammar Spotlight verb is bold, tense-colored, and in the correct form
- [ ] Third-person **-s** in Present Simple (balances, updates, describes)
- [ ] **V3**, not V2, after *have/has/had* (had **drawn**, has **become**, have **caught**)
- [ ] No finished time expressions with the Present Perfect (*in 2016* → Past Simple)
- [ ] No stative verbs in continuous forms (*know*, *belong*, *own*, *believe*)
- [ ] *for* + period (for months) · *since* + starting point (since 2010)
- [ ] No AI tool has silently changed a tense in your bullets or scripts

**Design**
- [ ] Max 3 bullets per slide, ≤ 8 words each
- [ ] Design Lens and progress line in the same position on all 10 slides
- [ ] No two consecutive slides share the same layout
- [ ] No garbled AI text inside images (regenerate or crop if you see any)
- [ ] Text contrast is readable on a projector (test in a bright room)

**Motion**
- [ ] Entrances ≤ 1 s · transitions 0.8–1.2 s · max 3 animated elements per slide
- [ ] No spins, bounces, or fast zooms
- [ ] Full run-through in Present mode, checking that all loops play

**Delivery**
- [ ] ~60 s per slide (slides 1 and 10 up to 75 s) → **total 10–11 minutes**
- [ ] Stress the target verbs slightly when speaking, and pause after each Grammar Spotlight
- [ ] On slide 6, point out the Present Perfect vs Past Simple contrast; on slide 8, point out the second use of the Present Simple

### 7.2 The 9 tenses at a glance

| Tense | ✚ Positive | ✖ Negative | ❓ Question | Signal words |
|---|---|---|---|---|
| Present Simple | Design **balances** form and safety. | Principles **don't change**. | **Does** BIM **save** time? | always, usually, every day |
| Present Continuous | Designers **are testing** VR. | AI **isn't replacing** architects. | **Are** they **testing** it now? | now, currently, at the moment |
| Past Simple | Autodesk **released** AutoCAD in 1982. | Firms **didn't switch** overnight. | When **did** CAD **arrive**? | in 1982, ago, last year |
| Past Continuous | Teams **were shifting** to screens. | They **weren't using** BIM yet. | What **were** they **using**? | while, when, during |
| Past Perfect Simple | Architects **had relied** on ink. | They **hadn't used** computers. | **Had** the team **finished**? | before, by the time, already |
| Past Perfect Continuous | Teams **had been revising** for months. | They **hadn't been using** computers before 1985. | How long **had** they **been revising**? | for, since, by the time |
| Present Perfect Simple | BIM **has transformed** design. | We **haven't printed** paper sets. | **Have** you ever **used** BIM? | since, already, yet, ever |
| Present Perfect Continuous | Engineers **have been developing** facades. | They **haven't been ignoring** energy. | How long **have** they **been testing**? | for, since, recently, lately |
| Future | 3D printing **will reshape** construction. · We**'re going to design** it. | It **won't replace** architects. · We**'re not going to stop**. | **Will** robots **build** cities? · **Are** you **going to study** BIM? | I think, by 2030, next year, soon |

### 7.3 Irregular verbs used in this deck

| V1 | V2 | V3 |
|---|---|---|
| begin | began | begun |
| become | became | become |
| bring | brought | brought |
| build | built | built |
| catch | caught | caught |
| come | came | come |
| draw / redraw | drew / redrew | drawn / redrawn |
| find | found | found |
| get | got | got (UK) / gotten (US) |
| let | let | let |
| make | made | made |
| set | set | set |
| spread | spread | spread |

### 7.4 Pronouncing *-ed* correctly

| Sound | Rule | Examples from this deck |
|---|---|---|
| /t/ | after voiceless sounds (p, k, s, sh, ch, f) | introduced, released, scraped, checked |
| /d/ | after voiced sounds and vowels | relied, moved, allowed, copied, measured, transformed, changed |
| /ɪd/ | after *t* or *d* | created, edited, connected, updated, mandated |

### 7.5 Fact sheet (for Q&A)

| Fact used | Detail |
|---|---|
| Sketchpad | Created by Ivan Sutherland at MIT in 1963; one of the first programs for drawing directly on a screen (with a light pen) |
| AutoCAD | Released by Autodesk in 1982 for microcomputers (personal computers) |
| Guggenheim Museum Bilbao | Designed by Frank Gehry, opened in 1997; Gehry's team used CATIA, software developed by Dassault for aircraft design |
| UK BIM mandate | BIM (Level 2) became mandatory on centrally procured UK government projects in 2016 |
| Al Bahr Towers, Abu Dhabi | Completed in 2012; a computer-controlled dynamic facade inspired by the mashrabiya |
| Dubai 3D Printing Strategy | Launched in 2016; targets 25% of Dubai's buildings using 3D-printing technology by 2030 |

---

*End of kit. Build order: §5C (Gamma) → §4 (images) → §6B–6C (Canva motion) → §7 (QA) → rehearse twice with the scripts in §3.*

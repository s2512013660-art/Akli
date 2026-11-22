#!/usr/bin/env node
/* Generates the Markdown deliverables from js/content.js (single source of truth).
   Run:  node raft-presentation/tools/build-docs.js                                   */
'use strict';
const fs = require('fs');
const path = require('path');
const C = require('../js/content.js');
const { TENSES: TN, TENSE_ORDER, SLIDES, PROJECT } = C;
const OUT = path.join(__dirname, '..', 'docs');
fs.mkdirSync(OUT, { recursive: true });

const VERB_RE = /\{(PRS|PRC|PAS|PAC|PPF|PPFC|PRF|PRFC|FUT):([^}]+)\}/g;
const md = t => t.replace(VERB_RE, '**$2**');                                    // verbs in bold
const mdPauses = t => md(t).replace(/ \/\/ /g, ' ‖ ').replace(/ \/ /g, ' | ');   // practice marks
const tn = ks => ks.map(k => TN[k].name).join(' + ');
const pad = n => String(n).padStart(2, '0');
const totalSec = SLIDES.reduce((s, x) => s + C.speakSeconds(x), 0);
const mmss = s => Math.floor(s / 60) + ' min ' + pad(s % 60) + ' s';

/* ------------------------------------------------------------------ */
/* 1. Script, tense explanations, on-slide text, ElevenLabs notes      */
/* ------------------------------------------------------------------ */
let a = '';
a += `# ${PROJECT.name}: script, tense explanations and voice notes\n\n`;
a += `*${PROJECT.subtitle}.*\n\n`;
a += `Ten slides, nine tenses, one construction story: a ${PROJECT.area.toLocaleString('en-US')} m² × ${PROJECT.thickness.toFixed(1)} m reinforced concrete raft, from the first bottom bar to the night pour and what comes next. `;
a += `Estimated speaking time: **${mmss(totalSec)}** at the voice speeds below.\n\n`;
a += `> Generated from \`js/content.js\`. Edit the text there and run \`node raft-presentation/tools/build-docs.js\`, so the slides, the 3D scene's notes and these documents stay identical.\n\n`;
a += `## Contents\n\n1. [Tense map](#tense-map)\n2. [ElevenLabs setup](#elevenlabs-setup)\n3. [Slides 1 to 10](#slide-01)\n4. [Grammar reference for the professor](#grammar-reference-for-the-professor)\n\n`;

a += `## Tense map\n\n| Slide | Stage | Tense(s) | Speaking time |\n|---|---|---|---|\n`;
SLIDES.forEach(s => { a += `| ${s.n} | ${s.title} | ${tn(s.tenses)} | ≈ ${C.speakSeconds(s)} s |\n`; });
a += `\nAll nine required tenses are covered: ${TENSE_ORDER.map(k => `${TN[k].n}. ${TN[k].name}`).join(' · ')}.\n\n`;

a += `## ElevenLabs setup\n\n`;
a += `**Model.** Eleven Multilingual v2 reads the \`<break time="…" />\` pause tags used in the ElevenLabs-ready blocks below (keep each break at 3 s or less). If you use Eleven v3 instead, delete the break tags first; v3 does not read them, so rely on the punctuation and line breaks.\n\n`;
a += `**Voice.** Choose a clear, neutral English narrator from the Voice Library (filters: *Narrative & Story* or *Educational*, a middle-aged or young-adult voice, no strong accent). Use the same voice for all ten slides.\n\n`;
a += `**Settings.** Stability 50–55 %, Similarity 75 %, Style exaggeration 15–20 %, Speaker boost on. Use the per-slide speed below (0.92–1.00).\n\n`;
a += `**Workflow.**\n\n1. Paste one slide's ElevenLabs-ready block at a time, generate, and listen for the tense verbs: they must be clear.\n2. Download each take as \`slide-01.mp3\` … \`slide-10.mp3\`.\n3. In Canva, drop each MP3 on its page and set the page duration to the audio length (or use Auto-play in the 3D scene, which is timed to the same script).\n\n`;
a += `**Pronunciation already handled in the script.** Numbers are written as words (*four thousand five hundred square meters*), *R.C.* keeps its periods so it is read as letters, and *-ed* is written *E-D* so the voice does not read it as a word.\n\n`;
a += `**Practice marks** in the scripts: \`|\` short pause (about 0.6 s) · \`‖\` long pause (about 1.2 s) · **bold** = the target-tense verb to stress.\n\n`;

SLIDES.forEach(s => {
  a += `---\n\n<a id="slide-${pad(s.n)}"></a>\n\n## Slide ${s.n}: ${s.title}\n\n`;
  a += `**Tense focus:** ${tn(s.tenses)} · **Stage:** ${s.zone} · **Speaking time:** ≈ ${C.speakSeconds(s)} s (${C.wordCount(s.script)} words)\n\n`;
  a += `### (a) Tense explanation\n\n`;
  s.tenses.forEach(k => {
    const t = TN[k];
    a += `**${t.name}.** ${s.explain[k]}\n\n`;
    a += `- Form: \`${t.form.pos}\`\n- Negative: \`${t.form.neg}\`\n- Question: \`${t.form.q}\`\n- Signal words: ${t.signals.join(', ')}\n\n`;
  });
  a += `### (b) Spoken script (practice version)\n\n${mdPauses(s.script)}\n\n`;
  a += `### (c) On-slide text\n\n**${s.title}**\n\n${s.bullets.map(b => `- ${b}`).join('\n')}\n\n`;
  s.examples.forEach(e => { a += `> ${md(e)}\n>\n`; });
  a = a.replace(/>\n$/, '\n');
  a += `### (d) Pacing and voice cues\n\n`;
  a += `- **Mood:** ${s.voice.mood}\n- **Speed:** ${s.voice.speed.toFixed(2)}×\n- **Stress:** ${s.voice.stress.join(' · ')}\n- **Tip:** ${s.voice.tip}\n- **On screen while you speak:** ${s.visual}\n\n`;
  a += `**ElevenLabs-ready text**\n\n\`\`\`text\n${C.toElevenLabs(s.script)}\n\`\`\`\n\n`;
});

a += `---\n\n## Grammar reference for the professor\n\n`;
a += `Each tense below is listed in the course's order (1 to 9) with its form, use, the reason it appears in this presentation, the required context example, and sentences quoted from the spoken script. A printable web version with timelines is in \`grammar.html\`.\n\n`;
function sentences(text) { return text.replace(/ \/\/ /g, ' ').replace(/ \/ /g, ' ').split(/(?<=[.?!])\s+(?=[A-Z"{])/); }
const ev = {};
SLIDES.forEach(s => sentences(s.script).forEach(sen => C.verbsIn(sen).forEach(([k]) => { (ev[k] = ev[k] || []); if (!ev[k].some(e => e.sen === sen)) ev[k].push({ n: s.n, sen }); })));
TENSE_ORDER.forEach(k => {
  const t = TN[k];
  a += `### ${t.n}. ${t.name}\n\n`;
  a += `| | Form | Example |\n|---|---|---|\n| + | ${t.form.pos.replace(/\|/g, 'or')} | ${t.formEx.pos} |\n| − | ${t.form.neg.replace(/\|/g, 'or')} | ${t.formEx.neg} |\n| ? | ${t.form.q.replace(/\|/g, 'or')} | ${t.formEx.q} |\n\n`;
  a += `**Use:** ${t.use.join('; ')}.\n\n`;
  a += `**Why it is used here (slide${t.slides.length > 1 ? 's' : ''} ${t.slides.join(', ')}):** ${t.why}\n\n`;
  a += `**Context example:** ${md(t.example)}\n\n`;
  a += `**In the script:**\n\n${(ev[k] || []).slice(0, 5).map(e => `- *Slide ${e.n}:* ${e.sen.replace(VERB_RE, (m, kk, v) => kk === k ? `**${v}**` : v)}`).join('\n')}\n\n`;
  a += `**Signal words:** ${t.signals.join(', ')}\n\n`;
  a += `**Common mistakes:**\n\n${t.mistakes.map(([x, y, r]) => `- ~~${x}~~ → ${y} (${r})`).join('\n')}\n\n`;
});
fs.writeFileSync(path.join(OUT, '01-script-tenses-elevenlabs.md'), a);

/* ------------------------------------------------------------------ */
/* 2. Gamma and Canva prompts                                          */
/* ------------------------------------------------------------------ */
const plainEx = e => C.plain(e);
let g = '';
g += `# ${PROJECT.name}: Gamma and Canva build guide\n\n`;
g += `Ready-to-paste prompts and per-slide visual and animation cues. Generated from \`js/content.js\`.\n\n`;
g += `## How the pieces fit together\n\n`;
g += `| Tool | Role | What you use from this project |\n|---|---|---|\n`;
g += `| Interactive 3D scene (\`index.html\`) | The live, animated visual for every slide | Present it directly, or press **H** (clean view) + **A** (auto-play) and screen-record; ready-made clips are in \`media/\` |\n`;
g += `| Gamma | Fast first draft of the deck with your exact text | The paste-in outline below |\n`;
g += `| Canva | Final polish: brand colours, animation, video backgrounds, audio | The deck prompt, brand kit and per-slide build specs below |\n`;
g += `| ElevenLabs | Voice-over per slide | \`docs/01-script-tenses-elevenlabs.md\` |\n\n`;
g += `**Visual identity (use in both tools)**\n\n`;
g += `- Background: deep site-night navy \`#0A0F16\`; panels \`#101924\`\n- Accent: hi-vis amber \`#FFB21A\` (one accent only)\n- Focus/CAD lines: cyan \`#2FD3FF\`\n- Text: \`#E8EEF3\`, secondary \`#93A4B3\`\n- Tense colours (verbs only): ${TENSE_ORDER.map(k => `${TN[k].name} \`${TN[k].color.toUpperCase()}\``).join(' · ')}\n- Fonts: **Barlow Condensed** (titles, bold, uppercase), **IBM Plex Sans** (body), **IBM Plex Mono** (numbers and labels)\n\n`;

g += `## Gamma\n\n### Settings\n\n`;
g += `1. **Create new → Paste in text.** Paste the outline below.\n2. Choose **Presentation**, **16:9**, and keep **10 cards**. The \`---\` lines split the cards.\n3. Text handling: **Preserve** (keeps the wording; the tenses must not be rewritten).\n4. Theme: a dark theme, then set the accent to \`#FFB21A\` and the heading font to Barlow Condensed in *Theme → Customize*.\n5. Images: **AI images**, with the style prompt below in *Image style*.\n\n`;
g += `### Image style prompt\n\n\`\`\`text\nPhotorealistic engineering visualization of a reinforced concrete raft foundation site, elevated three-quarter aerial view (35 to 45 degrees, never top-down), bare earthen terrain, concrete-frame buildings under construction around the site, workers in orange hi-vis vests with yellow helmets, engineers in lime vests with white helmets, cinematic lighting, sharp detail, no text, no logos\n\`\`\`\n\n`;
g += `### Additional instructions (paste into Gamma's instructions box)\n\n\`\`\`text\nThis is a university English presentation that teaches nine verb tenses through a civil-engineering story. Keep every sentence exactly as written, especially the verbs. Use a dark, technical look: deep navy background, one amber accent, cyan for diagrams. One idea per card, at most three bullets per card, and each card's example sentence in a highlighted quote block. Put a small tag on each card that names its tense. Use the provided image prompt for each card's image. Do not add extra cards.\n\`\`\`\n\n`;
g += `### Paste-in outline (10 cards)\n\n\`\`\`markdown\n`;
SLIDES.forEach((s, i) => {
  if (i) g += `\n---\n\n`;
  g += `# ${s.title}\n\n**Tense:** ${tn(s.tenses)}\n\n${s.bullets.map(b => `- ${b}`).join('\n')}\n\n${s.examples.map(e => `> ${plainEx(e)}`).join('\n>\n')}\n\n*Why this tense:* ${s.tenses.map(k => s.explain[k]).join(' ')}\n\n[Image: ${s.imagePrompt}]\n`;
});
g += `\`\`\`\n\n`;
g += `### Per-card layout\n\n| Card | Layout | Image |\n|---|---|---|\n`;
SLIDES.forEach(s => { g += `| ${s.n}. ${s.title} | ${s.gammaLayout} | Clip \`media/slide-${pad(s.n)}.mp4\` or the card's AI image |\n`; });
g += `\n**Live 3D scene inside Gamma.** Add an *Embed* block to card 1 with the scene's published link. If Gamma cannot frame the page, use a button that links to it, and place the MP4 clips from \`media/\` as video blocks instead.\n\n`;

g += `## Canva\n\n### Brand kit\n\nAdd the colours and fonts listed under *Visual identity* to a Canva Brand Kit, so every page and text style uses them.\n\n`;
g += `### Deck prompt (Canva AI / Magic Design for presentations)\n\n\`\`\`text\nCreate a 10-slide 16:9 presentation titled "${PROJECT.name}" for a university English course. Topic: building and night-pouring a 4,500 m² reinforced concrete raft foundation, used to teach nine English tenses (one or two per slide). Style: dark engineering control-room look, deep navy background (#0A0F16), one hi-vis amber accent (#FFB21A), cyan (#2FD3FF) for diagram lines, Barlow Condensed bold titles, IBM Plex Sans body text. Each slide: a large full-bleed construction visual on the left two-thirds, a dark text panel on the right with the title, a small tense tag, at most three bullets and one highlighted example sentence. Keep the text exactly as provided.\n\`\`\`\n\n`;
g += `Then paste each page's text from the outline above (or from the specs below).\n\n`;
g += `### Per-slide build specs\n\n`;
SLIDES.forEach(s => {
  g += `#### Slide ${s.n}: ${s.title} (${tn(s.tenses)})\n\n`;
  g += `- **Background:** \`media/slide-${pad(s.n)}.mp4\` (muted, loop), or generate an image with: *${s.imagePrompt}*\n`;
  g += `- **What the visual shows:** ${s.visual}\n`;
  g += `- **Text panel:** title, tense tag (${s.tenses.map(k => `${TN[k].name} \`${TN[k].color.toUpperCase()}\``).join(', ')}), bullets, example sentence with the target verbs coloured\n`;
  g += `- **Example sentence:** ${s.examples.map(e => `“${plainEx(e)}”`).join(' / ')}\n`;
  g += `- **Animation:** page enter: ${s.canva.enter}; element: ${s.canva.element}; transition: ${s.canva.transition}\n`;
  g += `- **Audio:** \`slide-${pad(s.n)}.mp3\` from ElevenLabs; page duration ≈ ${C.speakSeconds(s) + 2} s\n\n`;
});
g += `### Recording your own clips from the 3D scene\n\n1. Open the scene (published link or \`index.html\`) in Chrome or Edge, full screen (**F**).\n2. Press **H** for the clean view (no HUD) and go to slide 1 (**Home**).\n3. Start a screen recorder (Windows: Win + Alt + R or the Snipping Tool's video mode; macOS: Shift + Cmd + 5; or OBS).\n4. Press **A** to auto-play: each slide zooms in, holds for its spoken length, zooms out and moves on.\n5. Stop after slide 10 and split the recording per slide in Canva's video editor.\n\nKeep the HUD (do not press H) if you want the stage bar, tense card and logistics badges inside the video.\n\n`;
fs.writeFileSync(path.join(OUT, '02-gamma-canva-guide.md'), g);

console.log('Wrote docs/01-script-tenses-elevenlabs.md and docs/02-gamma-canva-guide.md; total speaking time', mmss(totalSec));

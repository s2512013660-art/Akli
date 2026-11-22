// Animated deck: From Hand Sketches to Smart Buildings
const pptxgen = require('pptxgenjs');
const fs = require('fs'), path = require('path');
const React = require('react');
const RDS = require('react-dom/server');
const sharp = require('sharp');
const fa = require('react-icons/fa');
const SKILL = '/root/.claude/skills/synced/4053cd73-26b3-4e96-9059-1c86e49cf057_78ad373f-24ee-4468-b7bd-35008017f477/pptx';
const { applyTheme } = require(SKILL + '/scripts/apply_theme.js');

const IMG = n => path.join(__dirname, 'img', n);
const OUT = path.join(__dirname, 'From-Hand-Sketches-to-Smart-Buildings.pptx');
const W = 13.333, H = 7.5;
const MONO = 'Consolas', HEAD = 'Arial', BODY = 'Calibri';

const THEME = {
  name: 'Blueprint to Reality', headFontFace: HEAD, bodyFontFace: BODY,
  colors: { dk1: '2B2A28', lt1: 'FFFFFF', dk2: '0B2545', lt2: 'F3EDE2', accent1: '4CC9F0', accent2: 'C8743F',
            accent3: '0EA5A4', accent4: '2F80ED', accent5: 'F2B33D', accent6: '2BB673', hlink: '2F80ED', folHlink: '8B5CF6' },
};

// tense families: [dot accent, text on light, text on dark]
const FAM = {
  present: ['2F80ED', '1F5FBF', '60A5FA'], past: ['C8743F', '9A4F22', 'E89A63'],
  pp: ['0EA5A4', '0B7A79', '2DD4BF'], future: ['F2B33D', '8A5F00', 'F2B33D'],
};

const SPEC = [];
const MAN = JSON.parse(fs.readFileSync(path.join(__dirname, 'svg', 'manifest.json')));
const PT6 = MAN.find(m => m.name === '_s6_points').points;
const q = k => [PT6[k][0] / 100, PT6[k][1] / 100];
const sh = (o = {}) => Object.assign({ type: 'outer', color: '0B2545', opacity: 0.18, blur: 14, offset: 4, angle: 90 }, o);

async function icon(Comp, color, px = 256) {
  const svg = RDS.renderToStaticMarkup(React.createElement(Comp, { size: px, color: '#' + color }));
  const buf = await sharp(Buffer.from(svg)).resize(px, px).png().toBuffer();
  return 'image/png;base64,' + buf.toString('base64');
}

function T(slide, text, o) {
  slide.addText(text, Object.assign({ isTextBox: true, margin: 0, valign: 'top', fontFace: BODY, paraSpaceAfter: 0 }, o));
}

// ---------------------------------------------------------------- persistent chrome (Morph-stable names)
const LENS = { x: 8.55, y: 5.72, w: 4.18, h: 1.38 };
const SPOT = { x: 0.6, y: 5.72, w: 7.7, h: 1.0 };
const PROG = { y: 6.98, x0: 0.6, x1: 8.3 };

function chrome(slide, n, mode, fam, lens, spot) {
  const dark = mode === 'dark';
  const ink = dark ? 'E6EEF7' : '2B2A28';
  const mute = dark ? '9FB3CC' : '5B6573';
  const rule = dark ? '4C6A8A' : 'A9B1BA';
  const tc = FAM[fam][dark ? 2 : 1], dot = FAM[fam][0];
  // Grammar spotlight
  slide.addShape('roundRect', { x: SPOT.x, y: SPOT.y, w: SPOT.w, h: SPOT.h, rectRadius: 0.08, objectName: '!!SpotBox',
    fill: { color: dark ? '0B1A30' : 'FFFFFF', transparency: dark ? 20 : 10 }, line: { color: tc, width: 0.75 } });
  T(slide, `GRAMMAR SPOTLIGHT  ·  ${spot.tense}  ·  ${spot.form}`, { x: SPOT.x + 0.2, y: SPOT.y + 0.11, w: SPOT.w - 0.4, h: 0.22,
    fontFace: MONO, fontSize: 10, bold: true, color: tc, objectName: '!!SpotLabel' });
  T(slide, spot.runs.map(r => typeof r === 'string' ? { text: r, options: { color: ink } } : { text: r.v, options: { bold: true, color: tc } }),
    { x: SPOT.x + 0.2, y: SPOT.y + 0.37, w: SPOT.w - 0.4, h: 0.58, fontSize: 14, color: ink, objectName: '!!SpotText' });
  // Design Lens title block
  slide.addShape('roundRect', { x: LENS.x, y: LENS.y, w: LENS.w, h: LENS.h, rectRadius: 0.05, objectName: '!!LensBox',
    fill: { color: dark ? '0B2545' : 'FFFFFF', transparency: dark ? 25 : 10 }, line: { color: dark ? '4CC9F0' : '2B2A28', width: 0.75 } });
  T(slide, 'DESIGN LENS', { x: LENS.x + 0.15, y: LENS.y + 0.09, w: 2.0, h: 0.22, fontFace: MONO, fontSize: 10, bold: true, color: ink, objectName: '!!LensTitle' });
  T(slide, `SHEET A-${String(n).padStart(2, '0')}/10`, { x: LENS.x + LENS.w - 2.15, y: LENS.y + 0.09, w: 2.0, h: 0.22, fontFace: MONO, fontSize: 10,
    bold: true, color: ink, align: 'right', objectName: '!!LensSheet' });
  slide.addShape('line', { x: LENS.x + 0.1, y: LENS.y + 0.37, w: LENS.w - 0.2, h: 0, line: { color: rule, width: 0.75 }, objectName: '!!LensRule' });
  slide.addShape('line', { x: LENS.x + 0.97, y: LENS.y + 0.45, w: 0, h: 0.84, line: { color: rule, width: 0.75 }, objectName: '!!LensVRule' });
  const labs = ['ERA', 'SHIFT', 'MOTION', 'TENSE'];
  T(slide, labs.map((l, i) => ({ text: l, options: { breakLine: i < 3 } })), { x: LENS.x + 0.15, y: LENS.y + 0.45, w: 0.8, h: 0.86,
    fontFace: MONO, fontSize: 10, color: mute, lineSpacing: 15, objectName: '!!LensLabels' });
  const vals = [lens[0], lens[1], lens[2]].map(v => ({ text: v, options: { color: ink, breakLine: true } }));
  vals.push({ text: '● ', options: { color: dot } }, { text: lens[3], options: { color: tc, bold: true } });
  T(slide, vals, { x: LENS.x + 1.07, y: LENS.y + 0.45, w: 3.05, h: 0.86, fontFace: MONO, fontSize: 10, lineSpacing: 15, objectName: '!!LensValues' });
  // Evolution progress line
  slide.addShape('line', { x: PROG.x0, y: PROG.y, w: PROG.x1 - PROG.x0, h: 0, line: { color: rule, width: 1 }, objectName: '!!ProgLine' });
  for (let i = 1; i <= 10; i++) {
    const cx = PROG.x0 + (i - 1) * (PROG.x1 - PROG.x0) / 9, d = 0.1;
    slide.addShape('ellipse', { x: cx - d / 2, y: PROG.y - d / 2, w: d, h: d, objectName: `!!ProgDot${i}`,
      fill: { color: i <= n ? (dark ? 'C9D6E6' : '5B6573') : (dark ? '2A3B55' : 'D0D6DD') }, line: { color: i <= n ? (dark ? 'C9D6E6' : '5B6573') : (dark ? '2A3B55' : 'D0D6DD'), width: 0.5 } });
  }
  const cx = PROG.x0 + (n - 1) * (PROG.x1 - PROG.x0) / 9, R = 0.26;
  slide.addShape('ellipse', { x: cx - R / 2, y: PROG.y - R / 2, w: R, h: R, objectName: '!!ProgNow', fill: { color: dot, transparency: 75 }, line: { color: dot, width: 1.5 } });
  slide.addShape('ellipse', { x: cx - 0.07, y: PROG.y - 0.07, w: 0.14, h: 0.14, objectName: '!!ProgNowDot', fill: { color: dot }, line: { color: dot, width: 0.5 } });
  return ['!!SpotBox', '!!SpotLabel', '!!SpotText', '!!LensBox', '!!LensTitle', '!!LensSheet', '!!LensRule', '!!LensVRule', '!!LensLabels', '!!LensValues', '!!ProgLine',
    ...Array.from({ length: 10 }, (_, i) => `!!ProgDot${i + 1}`), '!!ProgNow', '!!ProgNowDot'];
}

function header(slide, o) {
  T(slide, o.kicker, { x: o.x, y: o.y, w: o.w, h: 0.26, fontFace: MONO, fontSize: 10, bold: true, color: o.kc, charSpacing: 1, objectName: '!!Kicker', align: o.align || 'left' });
  T(slide, o.title, { x: o.x, y: o.y + 0.3, w: o.w, h: o.th, fontFace: HEAD, fontSize: o.ts || 34, bold: true, color: o.tc, objectName: '!!Title',
    lineSpacingMultiple: 0.95, align: o.align || 'left', fit: 'none' });
  T(slide, o.sub, { x: o.x, y: o.y + 0.32 + o.th, w: o.w, h: 0.36, fontSize: 16, color: o.sc, objectName: '!!Subtitle', align: o.align || 'left' });
}

function bullets(slide, items, o) {
  const names = [];
  items.forEach((t, i) => {
    const y = o.y + i * (o.gap || 0.46);
    slide.addShape('rect', { x: o.x, y: y + 0.09, w: 0.1, h: 0.1, fill: { color: o.mc }, line: { color: o.mc, width: 0.5 }, objectName: `bm${i + 1}` });
    T(slide, t, { x: o.x + 0.25, y, w: o.w, h: 0.4, fontSize: 16, color: o.c, objectName: `bt${i + 1}` });
    names.push([`bm${i + 1}`, `bt${i + 1}`]);
  });
  return names;
}

async function iconRows(slide, rows, o) {
  const names = [];
  for (let i = 0; i < rows.length; i++) {
    const y = o.y + i * (o.gap || 0.6), d = 0.42;
    slide.addShape('ellipse', { x: o.x, y, w: d, h: d, fill: o.outline ? { color: '0E1626' } : { color: o.cc }, line: { color: o.cc, width: 1.25 }, objectName: `ic${i + 1}` });
    slide.addImage({ data: await icon(rows[i][0], o.outline ? o.cc : 'FFFFFF'), x: o.x + 0.11, y: y + 0.11, w: 0.2, h: 0.2, objectName: `ii${i + 1}` });
    T(slide, rows[i][1], { x: o.x + 0.6, y: y + 0.03, w: o.w, h: 0.4, fontSize: 16, color: o.c, objectName: `it${i + 1}` });
    names.push([`ic${i + 1}`, `ii${i + 1}`, `it${i + 1}`]);
  }
  return names;
}

const full = (slide, f, name, o = {}) => slide.addImage(Object.assign({ path: IMG(f), x: 0, y: 0, w: W, h: H, objectName: name }, o));

// ================================================================= slides
async function main() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = 'From Hand Sketches to Smart Buildings';
  pres.subject = 'How Architecture & Engineering Design Evolved — 9 English tenses';
  pres.author = 'University English Course';
  pres.theme = { headFontFace: HEAD, bodyFontFace: BODY };
  for (const [t, f, c] of [['Paper', 'bg_paper.jpg'], ['Blueprint Navy', 'bg_navy.jpg'], ['Slate', 'bg_slate.jpg'], ['Studio', 'bg_studio.jpg'],
    ['Light Grid', 'bg_light.jpg'], ['Immersive Dark', 'bg_dark.jpg'], ['Full Image', null, '1E1B4B']]) {
    pres.defineSlideMaster(f ? { title: t, background: { path: IMG(f) } } : { title: t, background: { color: c } });
  }

  // ------------------------------------------------------------ S1
  pres.addSection({ title: 'Opening' });
  let s = pres.addSlide({ masterName: 'Paper', sectionTitle: 'Opening' });
  full(s, 's1_sketch.png', 'art_sketch');
  full(s, 's1_reality.png', 'art_reality');
  header(s, { x: 0.6, y: 0.62, w: 6.4, kicker: 'UNIVERSITY ENGLISH  ·  9 TENSES  ·  ONE DESIGN JOURNEY', kc: '7A5A3A',
    title: 'From Hand Sketches to Smart Buildings', ts: 40, th: 1.5, tc: '0B2545', sub: 'How Architecture & Engineering Design Evolved', sc: '4A4540' });
  let b = bullets(s, ['Design balances form and safety', 'Tools evolve; principles remain', 'Paper → pixels → smart cities'],
    { x: 0.62, y: 3.12, w: 5.6, c: '2B2A28', mc: '2F80ED' });
  T(s, '[Your Name]  ·  [Course Name]  ·  [Date]', { x: 0.6, y: 4.7, w: 6, h: 0.3, fontSize: 12, color: '7A5A3A', objectName: 'footer' });
  let ch = chrome(s, 1, 'light', 'present', ['Timeless principles', 'Idea → built form', 'Sketch draw-on → reveal', 'PRESENT SIMPLE'],
    { tense: 'PRESENT SIMPLE', form: 'Subject + V1 / V-s', runs: ['Good architectural design ', { v: 'balances' }, ' visual form with structural safety.'] });
  SPEC.push({ slide: 1, transition: { type: 'fade', dur: 1000 }, effects: [
    { t: 0.0, eff: 'wipeL', dur: 1.4, targets: ['art_sketch'] },
    { t: 1.2, eff: 'fade', dur: 1.2, targets: ['art_reality'] },
    { t: 0.3, eff: 'fade', dur: 0.6, targets: ['!!Kicker'] },
    { t: 0.5, eff: 'floatUp', dur: 0.9, targets: ['!!Title'] },
    { t: 1.1, eff: 'floatUp', dur: 0.7, targets: ['!!Subtitle'] },
    ...b.map((g, i) => ({ t: 1.6 + i * 0.3, eff: 'floatUp', dur: 0.6, targets: g })),
    { t: 2.6, eff: 'fade', dur: 0.6, targets: ['footer'] },
    { t: 2.8, eff: 'fade', dur: 0.8, targets: ch.slice(0, 3) },
    { t: 3.0, eff: 'fade', dur: 0.8, targets: ch.slice(3, 10) },
    { t: 3.2, eff: 'fade', dur: 0.8, targets: ch.slice(10) },
    { t: 2.6, eff: 'breathe', dur: 6, targets: ['art_sketch', 'art_reality'], opts: { scale: 103 } },
  ] });
  s.addNotes(`SCRIPT (~60 sec)
Good morning, everyone. Every building begins as an idea, and that idea needs a clear path from the designer's mind to the construction site. Good architectural design balances visual form with structural safety, and engineering makes that balance possible. These principles don't change, but the tools do. Today, I'm going to take you on a journey from hand sketches on paper to smart buildings that respond to their environment. In the corner of every slide, you'll see a small "Design Lens." It shows the era, the design shift, and the tense we're practicing. We start with the Present Simple, because we use it for facts, general truths, and the way things normally work.

TARGET TENSE: Present Simple (Subject + V1 / V-s) — facts, general truths, principles.
Target verbs: begins, needs, balances, makes, don't change, do, respond, shows, start, use, work.
Also used naturally: be going to (I'm going to take you), will (you'll see), Present Continuous (we're practicing).
Watch out: "Good design balance" ✗ → "Good design balances" ✓ (third-person -s).`);

  // ------------------------------------------------------------ S2
  pres.addSection({ title: 'The Past' });
  s = pres.addSlide({ masterName: 'Full Image', sectionTitle: 'The Past' });
  s.addImage({ path: IMG('s2_table.jpg'), x: 0, y: 0, w: 15.0, h: H, objectName: '!!Hero' });
  s.addShape('roundRect', { x: 0.45, y: 0.45, w: 5.3, h: 5.0, rectRadius: 0.1, fill: { color: 'F3EDE2', transparency: 5 }, line: { color: 'D9CCB5', width: 0.75 }, shadow: sh({ opacity: 0.35 }), objectName: '!!Card' });
  header(s, { x: 0.8, y: 0.72, w: 4.7, kicker: 'THE PAST  ·  BEFORE CAD', kc: '9A4F22', title: 'Before Digital Tools', th: 0.62, tc: '0B2545',
    sub: 'The era of ink, paper, and T-squares', sc: '4A4540' });
  b = bullets(s, ['Every line was drawn by hand', 'Precision depended on skill and rulers', 'One error could mean a new sheet'], { x: 0.82, y: 2.42, w: 4.5, c: '2B2A28', mc: 'C8743F', gap: 0.5 });
  s.addShape('line', { x: 0.9, y: 4.32, w: 4.0, h: 0, line: { color: '7A5A3A', width: 2 }, objectName: 'tl_line' });
  s.addShape('ellipse', { x: 0.82, y: 4.24, w: 0.16, h: 0.16, fill: { color: '7A5A3A' }, line: { color: '7A5A3A', width: 0.5 }, objectName: 'tl_dot' });
  T(s, 'Manual drafting  (had relied …)', { x: 0.82, y: 4.5, w: 2.8, h: 0.3, fontSize: 12, color: '4A4540', objectName: 'tl_lab1' });
  s.addShape('triangle', { x: 4.8, y: 4.13, w: 0.24, h: 0.2, fill: { color: 'C8743F' }, line: { color: 'C8743F', width: 0.5 }, objectName: 'tl_tri' });
  T(s, 'CAD arrives (1980s)', { x: 3.1, y: 4.5, w: 2.2, h: 0.3, fontSize: 12, bold: true, color: '9A4F22', align: 'right', objectName: 'tl_lab2' });
  ch = chrome(s, 2, 'light', 'past', ['Pre-1980s · manual drafting', 'Ink, paper & T-square', 'Slow pan · two-step reveal', 'PAST PERFECT'],
    { tense: 'PAST PERFECT', form: 'had + V3', runs: ['Architects ', { v: 'had relied' }, ' on manual rulers and ink pens before CAD software became standard.'] });
  SPEC.push({ slide: 2, transition: { type: 'fade', dur: 1000 }, effects: [
    { t: 0.0, eff: 'path', dur: 12, targets: ['!!Hero'], opts: { path: 'M 0 0 L -0.11 0 E', autoRev: true, repeat: true, smooth: true } },
    { t: 0.0, eff: 'fade', dur: 0.6, targets: ['!!Card'] },
    { t: 0.3, eff: 'fade', dur: 0.5, targets: ['!!Kicker'] },
    { t: 0.5, eff: 'floatUp', dur: 0.8, targets: ['!!Title'] },
    { t: 1.0, eff: 'floatUp', dur: 0.6, targets: ['!!Subtitle'] },
    ...b.map((g, i) => ({ t: 1.4 + i * 0.3, eff: 'floatUp', dur: 0.6, targets: g })),
    { t: 2.5, eff: 'fade', dur: 0.5, targets: ['tl_dot', 'tl_lab1'] },
    { t: 2.6, eff: 'wipeL', dur: 0.9, targets: ['tl_line'] },
    { t: 3.6, eff: 'zoomIn', dur: 0.5, targets: ['tl_tri'] },
    { t: 3.7, eff: 'fade', dur: 0.5, targets: ['tl_lab2'] },
  ] });
  s.addNotes(`SCRIPT (~60 sec)
Let's travel back in time. Before computer-aided design spread through offices in the 1980s and 1990s, architects had relied on manual tools for centuries. By the time a project reached the construction site, its drafters had drawn every wall, door, and staircase by hand, with T-squares, set squares, and technical ink pens. When a drafter found a mistake they had made hours earlier, they scraped the ink away with a razor blade, or they redrew the entire sheet. Copies were printed as blueprints, with white lines on blue paper, which is why we still use that word today. This is the Past Perfect Simple: had plus the past participle. It shows that one past action was completed before another past moment.

TARGET TENSE: Past Perfect Simple (had + V3) — the "past of the past".
Target verbs: had relied, had drawn, had made.
Motion cue: the earlier action (manual drafting) appears first; the later past event (CAD arrives) appears LAST — exactly how had + V3 orders events.
Also used naturally: Past Simple (spread, reached, found, scraped, redrew, were printed), Present Simple (use, is, shows).
Watch out: "had drew" ✗ → "had drawn" ✓.`);

  // ------------------------------------------------------------ S3
  s = pres.addSlide({ masterName: 'Full Image', sectionTitle: 'The Past' });
  full(s, 's3_desk.jpg', '!!Hero');
  full(s, 's3_trace1.png', 'trace1'); full(s, 's3_trace2.png', 'trace2'); full(s, 's3_trace3.png', 'trace3'); full(s, 's3_cloud.png', 'cloud');
  s.addShape('roundRect', { x: 7.25, y: 0.45, w: 5.6, h: 5.0, rectRadius: 0.1, fill: { color: '1A120C', transparency: 12 }, line: { color: '6B4A2E', width: 0.75 }, shadow: sh({ opacity: 0.4 }), objectName: '!!Card' });
  header(s, { x: 7.6, y: 0.72, w: 5.0, kicker: 'THE PAST  ·  STUDIO ERA', kc: 'E89A63', title: 'Months of Manual Revisions', th: 1.1, tc: 'F3EDE2',
    sub: 'Layer after layer of tracing paper', sc: 'D9CBB5' });
  b = bullets(s, ['Every change meant a new layer', 'Dimensions checked line by line', 'Months of redrawing before construction'], { x: 7.62, y: 2.72, w: 4.8, c: 'F3EDE2', mc: 'E89A63' });
  s.addShape('roundRect', { x: 7.65, y: 4.5, w: 4.3, h: 0.16, rectRadius: 0.08, fill: { color: '3A2A1E' }, line: { color: '6B4A2E', width: 0.5 }, objectName: 'dur_track' });
  s.addShape('roundRect', { x: 7.65, y: 4.5, w: 4.3, h: 0.16, rectRadius: 0.08, fill: { color: 'E89A63' }, line: { color: 'E89A63', width: 0.5 }, objectName: 'dur_bar' });
  s.addShape('triangle', { x: 11.95, y: 4.24, w: 0.24, h: 0.2, rotate: 180, fill: { color: 'F3EDE2' }, line: { color: 'F3EDE2', width: 0.5 }, objectName: 'dur_tri' });
  T(s, 'had been revising … for months', { x: 7.65, y: 4.75, w: 3.0, h: 0.3, fontSize: 12, italic: true, color: 'D9CBB5', objectName: 'dur_lab1' });
  T(s, 'construction started', { x: 10.4, y: 4.75, w: 2.25, h: 0.3, fontSize: 12, bold: true, color: 'F3EDE2', align: 'right', objectName: 'dur_lab2' });
  ch = chrome(s, 3, 'dark', 'past', ['1960s–70s design studio', 'Months of layered revisions', 'Layer stack → slow push-in', 'PAST PERFECT CONTINUOUS'],
    { tense: 'PAST PERFECT CONTINUOUS', form: 'had been + V-ing', runs: ['Teams ', { v: 'had been revising' }, ' hand-drawn blueprints for months before construction started.'] });
  SPEC.push({ slide: 3, transition: { type: 'morph', dur: 1000 }, effects: [
    { t: 0.0, eff: 'breathe', dur: 7, targets: ['!!Hero', 'trace1', 'trace2', 'trace3', 'cloud'], opts: { scale: 105 } },
    { t: 0.6, eff: 'descend', dur: 0.7, targets: ['trace1'] },
    { t: 1.0, eff: 'descend', dur: 0.7, targets: ['trace2'] },
    { t: 1.4, eff: 'descend', dur: 0.7, targets: ['trace3'] },
    ...b.map((g, i) => ({ t: 0.8 + i * 0.35, eff: 'floatUp', dur: 0.6, targets: g })),
    { t: 2.2, eff: 'fade', dur: 0.4, targets: ['dur_track', 'dur_lab1'] },
    { t: 2.3, eff: 'wipeL', dur: 2.4, targets: ['dur_bar'] },
    { t: 2.6, eff: 'wipeL', dur: 1.0, targets: ['cloud'] },
    { t: 4.7, eff: 'zoomIn', dur: 0.4, targets: ['dur_tri'] },
    { t: 4.8, eff: 'fade', dur: 0.5, targets: ['dur_lab2'] },
  ] });
  s.addNotes(`SCRIPT (~60 sec)
Now, let's step inside a design studio in the 1970s. Imagine a team designing a new hospital. By the time construction finally began, the drafters had been revising the drawings for months. Every time the client changed a room or an engineer moved a column, someone placed a fresh sheet of tracing paper over the old drawing and redrew the details. The team had been checking every dimension by hand, line by line, for so long that their desks had almost disappeared under layers of paper. This is the Past Perfect Continuous: had been plus the -ing form. We use it to emphasize the duration of an action that continued up to a specific moment in the past. Here, that moment is the start of construction.

TARGET TENSE: Past Perfect Continuous (had been + V-ing) — duration up to a past point.
Target verbs: had been revising, had been checking.
Motion cue: tracing layers stack one after another and the duration bar fills slowly, THEN "construction started" appears.
Also used naturally: Past Simple (began, changed, moved, placed, redrew, continued), Past Perfect Simple (had almost disappeared), Present Simple (use, is).
Watch out: "had been knowing" ✗ → "had known" ✓ (stative verbs).`);

  // ------------------------------------------------------------ S4
  s = pres.addSlide({ masterName: 'Blueprint Navy', sectionTitle: 'The Past' });
  full(s, 's4_paper.png', 'paper');
  full(s, 's4_cad.png', 'cad');
  s.addImage({ path: IMG('s4_cursor.png'), x: 4.2, y: 3.78, w: 0.6, h: 0.6, objectName: 'cursor' });
  header(s, { x: 7.2, y: 0.62, w: 5.5, kicker: 'THE PAST  ·  1963 – 1982', kc: 'E89A63', title: 'The Rise of 2D CAD', ts: 36, th: 0.62, tc: 'FFFFFF',
    sub: 'From ink lines to precise vectors', sc: 'A9C4E0' });
  s.addShape('line', { x: 7.3, y: 2.62, w: 5.3, h: 0, line: { color: '4CC9F0', width: 1.5 }, objectName: 'tl_line' });
  s.addShape('ellipse', { x: 7.43, y: 2.5, w: 0.24, h: 0.24, fill: { color: '4CC9F0' }, line: { color: 'BDF2FF', width: 1 }, objectName: 'n1' });
  s.addShape('ellipse', { x: 10.13, y: 2.5, w: 0.24, h: 0.24, fill: { color: '4CC9F0' }, line: { color: 'BDF2FF', width: 1 }, objectName: 'n2' });
  T(s, '1963', { x: 7.3, y: 2.86, w: 2.6, h: 0.42, fontFace: HEAD, fontSize: 22, bold: true, color: '4CC9F0', objectName: 'y1' });
  T(s, 'Sketchpad put drawing on screen', { x: 7.3, y: 3.3, w: 2.55, h: 0.62, fontSize: 15, color: 'FFFFFF', objectName: 'd1' });
  T(s, '1982', { x: 10.0, y: 2.86, w: 2.6, h: 0.42, fontFace: HEAD, fontSize: 22, bold: true, color: '4CC9F0', objectName: 'y2' });
  T(s, 'AutoCAD reached personal computers', { x: 10.0, y: 3.3, w: 2.65, h: 0.62, fontSize: 15, color: 'FFFFFF', objectName: 'd2' });
  s.addShape('roundRect', { x: 7.2, y: 4.25, w: 5.5, h: 1.0, rectRadius: 0.1, fill: { color: '13345C' }, line: { color: '2A5A8A', width: 0.75 }, objectName: 'stat' });
  s.addShape('ellipse', { x: 7.45, y: 4.48, w: 0.54, h: 0.54, fill: { color: '4CC9F0' }, line: { color: '4CC9F0', width: 0.5 }, objectName: 'stat_ic' });
  s.addImage({ data: await icon(fa.FaStopwatch, '0B2545'), x: 7.59, y: 4.62, w: 0.26, h: 0.26, objectName: 'stat_ii' });
  T(s, 'Edits took seconds, not hours', { x: 8.2, y: 4.55, w: 4.3, h: 0.45, fontFace: HEAD, fontSize: 18, bold: true, color: 'FFFFFF', objectName: 'stat_t' });
  ch = chrome(s, 4, 'dark', 'past', ['1963–1980s · early CAD', 'Ink lines → 2D vectors', 'One crisp wipe → stillness', 'PAST SIMPLE'],
    { tense: 'PAST SIMPLE', form: 'V2 (regular -ed / irregular)', runs: ['Engineers ', { v: 'introduced' }, ' early computer-aided drafting tools to speed up the drawing process.'] });
  SPEC.push({ slide: 4, transition: { type: 'wipeL', dur: 900 }, effects: [
    { t: 0.5, eff: 'wipeL', dur: 1.2, targets: ['cad'] },
    { t: 0.2, eff: 'fade', dur: 0.5, targets: ['!!Kicker'] },
    { t: 0.4, eff: 'floatUp', dur: 0.8, targets: ['!!Title'] },
    { t: 0.8, eff: 'floatUp', dur: 0.6, targets: ['!!Subtitle'] },
    { t: 1.4, eff: 'wipeL', dur: 0.8, targets: ['tl_line'] },
    { t: 1.9, eff: 'zoomIn', dur: 0.4, targets: ['n1'] }, { t: 2.0, eff: 'floatUp', dur: 0.5, targets: ['y1', 'd1'] },
    { t: 2.5, eff: 'zoomIn', dur: 0.4, targets: ['n2'] }, { t: 2.6, eff: 'floatUp', dur: 0.5, targets: ['y2', 'd2'] },
    { t: 3.1, eff: 'floatUp', dur: 0.6, targets: ['stat', 'stat_ic', 'stat_ii', 'stat_t'] },
    { t: 1.8, eff: 'fade', dur: 0.3, targets: ['cursor'] },
    { t: 2.1, eff: 'path', dur: 2.4, targets: ['cursor'], opts: { path: 'M 0 0 L 0.1125 0 L 0.1125 0.16 L 0.0375 0.16 E' } },
  ] });
  s.addNotes(`SCRIPT (~60 sec)
Then came a turning point. In 1963, Ivan Sutherland created Sketchpad, one of the first programs that let people draw directly on a computer screen. Nearly twenty years later, in 1982, Autodesk released AutoCAD, and drafting began to move onto personal computers. Engineers introduced these tools to speed up the drawing process, and the change was dramatic: designers copied, edited, and measured lines in seconds instead of hours. This is the Past Simple. We use it for completed actions at a specific time in the past. Notice the time expressions: in 1963, in 1982, twenty years later. They tell us that the action is finished and that the time is known.

TARGET TENSE: Past Simple (V2) — finished actions at a known time.
Target verbs: came, created, let, released, began, introduced, was, copied, edited, measured.
Motion cue: ONE crisp wipe reveals the CAD half, then stillness — a finished event.
Pronunciation of -ed: /t/ introduced, released · /d/ allowed, copied, measured · /ɪd/ created, edited.
Watch out: "In 1982, Autodesk has released AutoCAD" ✗ → "released" ✓ (finished time = Past Simple).`);

  // ------------------------------------------------------------ S5
  s = pres.addSlide({ masterName: 'Slate', sectionTitle: 'The Past' });
  full(s, 's5_digital_full.png', 'dig_full');
  full(s, 's5_paper.png', 'paperw');
  full(s, 's5_digital.png', 'digw');
  T(s, 'PHYSICAL', { x: 7.25, y: 0.62, w: 1.5, h: 0.25, fontFace: MONO, fontSize: 10, bold: true, color: 'E8DCC6', charSpacing: 2, objectName: 'chipA' });
  T(s, 'DIGITAL', { x: 11.2, y: 0.62, w: 1.5, h: 0.25, fontFace: MONO, fontSize: 10, bold: true, color: '4CC9F0', charSpacing: 2, align: 'right', objectName: 'chipB' });
  header(s, { x: 0.6, y: 0.62, w: 5.4, kicker: 'THE PAST  ·  1990s – 2000s', kc: 'E89A63', title: 'Shifting from\nPaper to 3D', ts: 36, th: 1.15, tc: 'FFFFFF',
    sub: 'Two worlds on one desk', sc: 'A9C4E0' });
  b = bullets(s, ['Studios were moving from tables to screens', 'Paper and wireframes were sharing desks', 'Designers were learning to think in 3D'], { x: 0.62, y: 2.82, w: 5.2, c: 'FFFFFF', mc: 'E89A63', gap: 0.5 });
  const parts = [[9.2, 2.0], [9.6, 3.1], [8.9, 4.2], [10.1, 1.5], [9.9, 4.8], [8.6, 3.0], [10.4, 3.6], [9.4, 5.2]];
  parts.forEach(([x, y], i) => s.addShape('rect', { x, y, w: 0.07, h: 0.07, fill: { color: '4CC9F0' }, line: { color: 'BDF2FF', width: 0.5 }, objectName: `pt${i + 1}` }));
  ch = chrome(s, 5, 'dark', 'past', ['1990s–2000s', 'Paper → 3D wireframes', 'Split converge → cross-fade', 'PAST CONTINUOUS'],
    { tense: 'PAST CONTINUOUS', form: 'was / were + V-ing', runs: ['Design teams ', { v: 'were shifting' }, ' from drafting tables to digital screens during that transition.'] });
  SPEC.push({ slide: 5, transition: { type: 'morph', dur: 1000 }, effects: [
    { t: 0.0, eff: 'slideFromL', dur: 1.1, targets: ['paperw'] },
    { t: 0.0, eff: 'slideFromR', dur: 1.1, targets: ['digw'] },
    { t: 0.9, eff: 'fade', dur: 0.6, targets: ['chipA', 'chipB'] },
    ...b.map((g, i) => ({ t: 1.0 + i * 0.35, eff: 'floatUp', dur: 0.6, targets: g })),
    ...parts.map((_, i) => ({ t: 1.4 + i * 0.15, eff: 'fade', dur: 0.4, targets: [`pt${i + 1}`] })),
    ...parts.map((_, i) => ({ t: 1.4 + i * 0.15, eff: 'path', dur: 3.5 + (i % 3), targets: [`pt${i + 1}`], opts: { path: `M 0 0 L ${(0.02 + (i % 3) * 0.01).toFixed(3)} -${(0.05 + (i % 4) * 0.015).toFixed(3)} E`, repeat: true } })),
    { t: 2.8, eff: 'fade', dur: 3.5, targets: ['dig_full'] },
    { t: 2.8, eff: 'exitFade', dur: 3.5, targets: ['paperw'] },
  ] });
  s.addNotes(`SCRIPT (~60 sec)
By the 1990s, an even bigger change was happening. Studios were moving from drafting tables to digital screens, but the shift didn't happen overnight. On many desks, paper drawings and computer monitors were sitting side by side. While some designers were still sketching by hand, others were building the first 3D wireframes and massing models. In the mid-1990s, while builders were raising the Guggenheim Museum in Bilbao, Frank Gehry's team was using CATIA, software originally developed for designing aircraft, to define the museum's curved titanium forms. This is the Past Continuous: was or were plus the -ing form. We use it for actions in progress at a time in the past, often as the background to another event.

TARGET TENSE: Past Continuous (was/were + V-ing) — actions in progress in the past.
Target verbs: was happening, were moving, were sitting, were still sketching, were building, were raising, was using.
Motion cue: paper and 3D slide in TOGETHER; then the paper fades while the wireframe grows — two actions in progress at the same time.
Also used naturally: Past Simple (didn't happen), Present Simple (use, is).
Watch out: "While the designers sketched, the computer was crashing" ✗ → "While the designers were sketching, the computer crashed" ✓.`);

  // ------------------------------------------------------------ S6
  pres.addSection({ title: 'Past to Now' });
  s = pres.addSlide({ masterName: 'Studio', sectionTitle: 'Past to Now' });
  for (const [f, n] of [['s6_l1.png', 'L1'], ['s6_l2.png', 'L2'], ['s6_l3.png', 'L3'], ['s6_l4.png', 'L4'], ['s6_data.png', 'data']]) full(s, f, n);
  header(s, { x: 0.6, y: 0.55, w: 7.2, kicker: 'PAST → NOW  ·  BIM', kc: '0B7A79', title: 'The BIM Revolution', ts: 36, th: 0.62, tc: '0B2545',
    sub: 'One intelligent model for every discipline', sc: '4A5568' });
  const cards6 = [
    [fa.FaProjectDiagram, 'STRUCTURE · GEOMETRY', 'BIM has linked structure, MEP, and geometry', q('geometry')],
    [fa.FaCubes, 'COORDINATION · MEP', 'Teams have caught clashes before construction', q('mep')],
    [fa.FaDatabase, 'INFORMATION · DATA', 'Data has become part of every element', q('data')],
  ];
  const c6 = [];
  for (let i = 0; i < 3; i++) {
    const y = 1.75 + i * 1.25, [Ic, lab, txt, tgt] = cards6[i];
    s.addShape('roundRect', { x: 8.0, y, w: 4.73, h: 1.05, rectRadius: 0.1, fill: { color: 'FFFFFF' }, line: { color: 'E2E8F0', width: 0.75 }, shadow: sh(), objectName: `card${i + 1}` });
    s.addShape('ellipse', { x: 8.2, y: y + 0.27, w: 0.5, h: 0.5, fill: { color: '0EA5A4' }, line: { color: '0EA5A4', width: 0.5 }, objectName: `cic${i + 1}` });
    s.addImage({ data: await icon(Ic, 'FFFFFF'), x: 8.33, y: y + 0.4, w: 0.24, h: 0.24, objectName: `cii${i + 1}` });
    T(s, lab, { x: 8.88, y: y + 0.14, w: 3.7, h: 0.22, fontFace: MONO, fontSize: 10, bold: true, color: '0B7A79', objectName: `clab${i + 1}` });
    T(s, txt, { x: 8.88, y: y + 0.4, w: 3.75, h: 0.55, fontSize: 15, color: '0B2545', objectName: `ctxt${i + 1}` });
    const sx = 8.0, sy = y + 0.52, [tx, ty] = tgt;
    s.addShape('line', { x: tx, y: Math.min(sy, ty), w: sx - tx, h: Math.abs(sy - ty), flipV: sy < ty, line: { color: '0EA5A4', width: 1.25, dashType: 'dash' }, objectName: `lead${i + 1}` });
    s.addShape('ellipse', { x: tx - 0.06, y: ty - 0.06, w: 0.12, h: 0.12, fill: { color: '0EA5A4' }, line: { color: 'FFFFFF', width: 1 }, objectName: `ldot${i + 1}` });
    c6.push(i);
  }
  const [kx, ky] = q('clash');
  s.addShape('ellipse', { x: kx - 0.15, y: ky - 0.15, w: 0.3, h: 0.3, fill: { color: 'E5484D', transparency: 70 }, line: { color: 'E5484D', width: 2 }, objectName: 'clash' });
  s.addShape('ellipse', { x: kx - 0.16, y: ky - 0.16, w: 0.32, h: 0.32, fill: { color: '2BB673' }, line: { color: 'FFFFFF', width: 1.25 }, objectName: 'ok' });
  s.addImage({ data: await icon(fa.FaCheck, 'FFFFFF'), x: kx - 0.09, y: ky - 0.09, w: 0.18, h: 0.18, objectName: 'okc' });
  ch = chrome(s, 6, 'light', 'pp', ['Early 2000s → today', 'Drawings → one BIM model', 'Layers assemble → result', 'PRESENT PERFECT'],
    { tense: 'PRESENT PERFECT', form: 'have / has + V3', runs: ['BIM ', { v: 'has transformed' }, ' how architects and structural engineers coordinate complex buildings.'] });
  SPEC.push({ slide: 6, transition: { type: 'morph', dur: 1000 }, effects: [
    { t: 0.2, eff: 'descend', dur: 0.7, targets: ['L1'] }, { t: 0.6, eff: 'descend', dur: 0.7, targets: ['L2'] },
    { t: 1.0, eff: 'descend', dur: 0.7, targets: ['L3'] }, { t: 1.4, eff: 'descend', dur: 0.7, targets: ['L4'] },
    { t: 2.1, eff: 'fade', dur: 0.8, targets: ['data'] },
    ...[0, 1, 2].flatMap(i => [
      { t: 2.5 + i * 0.5, eff: 'floatUp', dur: 0.6, targets: [`card${i + 1}`, `cic${i + 1}`, `cii${i + 1}`, `clab${i + 1}`, `ctxt${i + 1}`] },
      { t: 2.8 + i * 0.5, eff: 'wipeR', dur: 0.6, targets: [`lead${i + 1}`] },
      { t: 3.3 + i * 0.5, eff: 'zoomIn', dur: 0.3, targets: [`ldot${i + 1}`] }]),
    { t: 3.2, eff: 'zoomIn', dur: 0.4, targets: ['clash'] },
    { t: 3.6, eff: 'pulse', dur: 0.45, targets: ['clash'], opts: { scale: 150, count: 3 } },
    { t: 6.4, eff: 'zoomIn', dur: 0.4, targets: ['ok', 'okc'] },
  ] });
  s.addNotes(`SCRIPT (~60 sec)
So, what has changed since then? The biggest answer is BIM, which stands for Building Information Modeling. Since the early 2000s, BIM has transformed the way architects and structural engineers coordinate complex buildings. Instead of separate drawings, teams now share one intelligent 3D model in which every wall, beam, duct, and pipe carries data. As a result, project teams have caught thousands of clashes on screen instead of on the construction site. Many governments have also made BIM a requirement. The United Kingdom, for example, made it mandatory for central government projects in 2016. This is the Present Perfect Simple: have or has plus the past participle. We use it for past actions with results that matter now. But notice: with a finished time, like in 2016, we switch to the Past Simple.

TARGET TENSE: Present Perfect Simple (have/has + V3) — past action, present result.
Target verbs: has changed, has transformed, have caught, have made.
Motion cue: layers from the past assemble into one finished model you can see now; the red clash turns into a green check — a result.
KEY CONTRAST (point to it): "Many countries have adopted BIM" (no finished time) vs "The UK made BIM mandatory in 2016" (finished time → Past Simple).
Watch out: "BIM has transformed the industry in 2005" ✗ → "since the early 2000s" ✓.`);

  // ------------------------------------------------------------ S7
  s = pres.addSlide({ masterName: 'Studio', sectionTitle: 'Past to Now' });
  full(s, 's7_building.png', 'bld');
  full(s, 's7_sunpath.png', 'sunpath');
  full(s, 's7_air.png', 'air');
  s.addImage({ path: IMG('s7_sweep.png'), x: 0, y: 0, w: 7.2, h: 6.0, objectName: 'sweep' });
  const fins = [];
  for (let i = 0; i < 17; i++) {
    const x = (315 + i * 19) / 100;
    s.addShape('rect', { x, y: 1.74, w: 0.06, h: 3.82, fill: { color: 'B5793F' }, line: { color: '8C5A2B', width: 0.25 }, objectName: `fin${i + 1}` });
    fins.push(`fin${i + 1}`);
  }
  s.addImage({ path: IMG('s7_sun.png'), x: 0.3, y: 2.6, w: 0.8, h: 0.8, objectName: 'sun' });
  s.addShape('roundRect', { x: 7.15, y: 0.45, w: 5.7, h: 5.0, rectRadius: 0.1, fill: { color: 'FFFFFF', transparency: 6 }, line: { color: 'E2E8F0', width: 0.75 }, shadow: sh(), objectName: '!!Card' });
  header(s, { x: 7.5, y: 0.72, w: 5.1, kicker: 'PAST → NOW  ·  SUSTAINABILITY', kc: '0B7A79', title: 'Sustainable & Smart Facades', th: 1.1, tc: '0B2545',
    sub: 'Building skins that respond to sun and climate', sc: '4A5568' });
  let r = await iconRows(s, [[fa.FaSun, 'Adaptive louvers that follow the sun'], [fa.FaWind, 'Daylight in, excess heat out'], [fa.FaSolarPanel, 'Solar glass and green roofs save energy']],
    { x: 7.5, y: 2.95, w: 4.6, c: '0B2545', cc: '2BB673', gap: 0.62 });
  ch = chrome(s, 7, 'light', 'pp', ['2010s → today', 'Static walls → adaptive skins', 'Light sweep → louver loop', 'PRESENT PERFECT CONTINUOUS'],
    { tense: 'PRESENT PERFECT CONTINUOUS', form: 'have / has been + V-ing', runs: ['Engineers ', { v: 'have been developing' }, ' energy-smart facades in recent years.'] });
  SPEC.push({ slide: 7, transition: { type: 'zoom', dur: 1000 }, effects: [
    ...fins.map((f, i) => ({ t: 0.0 + i * 0.09, eff: 'scaleX', dur: 1.4, targets: [f], opts: { x: 28 } })),
    { t: 0.2, eff: 'wipeL', dur: 1.4, targets: ['sweep'] },
    { t: 0.0, eff: 'fade', dur: 0.6, targets: ['!!Card'] },
    { t: 0.2, eff: 'fade', dur: 0.5, targets: ['!!Kicker'] },
    { t: 0.4, eff: 'floatUp', dur: 0.8, targets: ['!!Title'] },
    { t: 0.8, eff: 'floatUp', dur: 0.6, targets: ['!!Subtitle'] },
    ...r.map((g, i) => ({ t: 1.2 + i * 0.3, eff: 'floatUp', dur: 0.6, targets: g })),
    { t: 1.0, eff: 'fade', dur: 0.8, targets: ['sunpath'] },
    { t: 1.2, eff: 'fade', dur: 0.5, targets: ['sun'] },
    { t: 1.4, eff: 'path', dur: 9, targets: ['sun'], opts: { path: 'M 0 0 C 0.09 -0.3467 0.3676 -0.3467 0.4726 0 E', autoRev: true, repeat: true, smooth: true } },
    { t: 1.8, eff: 'fade', dur: 1.0, targets: ['air'] },
    { t: 2.8, eff: 'path', dur: 3, targets: ['air'], opts: { path: 'M 0 0 L 0.012 0 E', autoRev: true, repeat: true, smooth: true } },
  ] });
  s.addNotes(`SCRIPT (~60 sec)
At the same time, building skins have been getting smarter. Over the past two decades, engineers have been developing energy-smart facades that respond to sunlight, heat, and wind. The Al Bahr Towers in Abu Dhabi, for example, use a dynamic shading screen inspired by the traditional mashrabiya: its panels open and close as the sun moves across the sky. Meanwhile, designers have been testing adaptive louvers, solar glass, and green roofs to reduce cooling energy, and that work is still going on today. This is the Present Perfect Continuous: have or has been plus the -ing form. We use it for actions that started in the past, have continued over time, and are still in progress.
(Optional local hook after "mashrabiya": "…the same idea we see in the shanasheel of old Baghdad and Basra.")

TARGET TENSE: Present Perfect Continuous (have/has been + V-ing) — started in the past, still going.
Target verbs: have been getting, have been developing, have been testing.
Motion cue: the louvers are ALREADY moving when the slide appears and are STILL moving when you leave.
Also used naturally: Present Simple (respond, use, open, close, moves), Present Continuous (is still going on), Past Simple (started), Present Perfect Simple (have continued).
Watch out: "Engineers are developing smart facades since 2010" ✗ → "have been developing" ✓.`);

  // ------------------------------------------------------------ S8
  pres.addSection({ title: 'Today' });
  s = pres.addSlide({ masterName: 'Light Grid', sectionTitle: 'Today' });
  full(s, 's8_hub.png', 'hub');
  header(s, { x: 0.6, y: 0.55, w: 9.5, kicker: 'TODAY  ·  COLLABORATION', kc: '1F5FBF', title: 'Collaborative Engineering Today', ts: 36, th: 0.62, tc: '0B2545',
    sub: 'One model. One source of truth.', sc: '4A5568' });
  const nodes = [[0.6, 2.6, fa.FaUsers, 'Every discipline works on shared data', [4.15, 3.22], [5.6, 3.75], 'wipeL'],
    [9.15, 2.1, fa.FaSyncAlt, 'One change updates the whole model', [9.15, 2.72], [7.6, 3.35], 'wipeR'],
    [9.15, 3.95, fa.FaCloud, 'The cloud connects teams across cities', [9.15, 4.57], [7.8, 4.25], 'wipeR']];
  const e8 = [];
  for (let i = 0; i < 3; i++) {
    const [x, y, Ic, txt, a, bb, wdir] = nodes[i];
    s.addShape('roundRect', { x, y, w: 3.55, h: 1.25, rectRadius: 0.12, fill: { color: 'FFFFFF' }, line: { color: 'DCE4EE', width: 0.75 }, shadow: sh(), objectName: `node${i + 1}` });
    s.addShape('ellipse', { x: x + 0.2, y: y + 0.35, w: 0.55, h: 0.55, fill: { color: '0B2545' }, line: { color: '0B2545', width: 0.5 }, objectName: `nic${i + 1}` });
    s.addImage({ data: await icon(Ic, 'FFFFFF'), x: x + 0.335, y: y + 0.485, w: 0.28, h: 0.28, objectName: `nii${i + 1}` });
    T(s, txt, { x: x + 0.92, y: y + 0.28, w: 2.45, h: 0.72, fontSize: 15, color: '0B2545', valign: 'middle', objectName: `ntx${i + 1}` });
    const x0 = Math.min(a[0], bb[0]), y0 = Math.min(a[1], bb[1]);
    const flipV = (bb[0] > a[0]) !== (bb[1] > a[1]);
    s.addShape('line', { x: x0, y: y0, w: Math.abs(bb[0] - a[0]), h: Math.abs(bb[1] - a[1]), flipV, line: { color: '2F80ED', width: 1.25, dashType: 'dash' }, objectName: `nl${i + 1}` });
    s.addShape('ellipse', { x: a[0] - 0.06, y: a[1] - 0.06, w: 0.12, h: 0.12, fill: { color: '2F80ED' }, line: { color: 'FFFFFF', width: 1 }, objectName: `pulse${i + 1}` });
    const dx = ((bb[0] - a[0]) / W).toFixed(4), dy = ((bb[1] - a[1]) / H).toFixed(4);
    e8.push({ t: 1.4 + i * 0.35, eff: 'floatUp', dur: 0.6, targets: [`node${i + 1}`, `nic${i + 1}`, `nii${i + 1}`, `ntx${i + 1}`] },
      { t: 1.7 + i * 0.35, eff: wdir, dur: 0.6, targets: [`nl${i + 1}`] },
      { t: 2.8 + i * 0.25, eff: 'fade', dur: 0.3, targets: [`pulse${i + 1}`] },
      { t: 2.8 + i * 0.25, eff: 'path', dur: 1.8, targets: [`pulse${i + 1}`], opts: { path: `M 0 0 L ${dx} ${dy} E`, repeat: true } });
  }
  ch = chrome(s, 8, 'light', 'present', ['Today', 'Separate files → shared model', 'Nodes link → steady pulse', 'PRESENT SIMPLE'],
    { tense: 'PRESENT SIMPLE (ROUTINES)', form: 'Subject + V1 / V-s', runs: ['Architects and structural engineers ', { v: 'work' }, ' on one shared model every day.'] });
  SPEC.push({ slide: 8, transition: { type: 'morph', dur: 1000 }, effects: [
    { t: 0.3, eff: 'zoomIn', dur: 0.9, targets: ['hub'] },
    { t: 1.2, eff: 'breathe', dur: 3, targets: ['hub'], opts: { scale: 102 } },
    ...e8,
  ] });
  s.addNotes(`SCRIPT (~60 sec)
Let's see how design works today. On a modern project, architects, structural engineers, and mechanical and electrical engineers work on one shared model. When the architect moves a wall, the structural model updates, and the engineer gets a notification. Cloud platforms connect team members in different cities, so everyone always sees the latest version. This is the Present Simple again, but with a different use. On the first slide, it described permanent principles; here, it describes routines, processes, and how a system normally works. A simple rule: if something happens regularly or is generally true, the Present Simple is the right choice.

TARGET TENSE: Present Simple (second use: routines & processes).
Target verbs: works, work, moves, updates, gets, connect, sees, describes, happens, is.
Motion cue: data pulses travel at a steady, even rhythm — routines repeat regularly.
Also used naturally: Past Simple (described).
Watch out: "Does the engineer receives an alert?" ✗ → "Does the engineer receive…?" ✓ (after does, use V1).`);

  // ------------------------------------------------------------ S9
  s = pres.addSlide({ masterName: 'Immersive Dark', sectionTitle: 'Today' });
  full(s, 's9_room.png', 'room');
  full(s, 's9_beams.png', 'beams');
  full(s, 's9_person.png', 'person');
  const cubes = [[10.2, 2.35, 'c1'], [12.35, 1.95, 'c2'], [11.0, 1.45, 'c3']];
  cubes.forEach(([x, y, n], i) => s.addImage({ path: IMG(`s9_cube${i + 1}.png`), x, y, w: 0.6, h: 0.6, objectName: n }));
  s.addImage({ path: IMG('s9_scan.png'), x: 5.6, y: 0, w: 0.4, h: 6.0, objectName: 'scan' });
  s.addShape('roundRect', { x: 0.45, y: 0.45, w: 5.4, h: 5.0, rectRadius: 0.1, fill: { color: '0E1626', transparency: 10 }, line: { color: '22D3EE', width: 0.75, transparency: 40 }, objectName: '!!Card' });
  header(s, { x: 0.8, y: 0.72, w: 4.8, kicker: 'TODAY  ·  SIMULATION', kc: '60A5FA', title: 'AI & VR Simulation Today', th: 1.1, tc: 'FFFFFF',
    sub: 'Testing buildings before they exist', sc: '9FB3CC' });
  r = await iconRows(s, [[fa.FaVrCardboard, 'Designers are walking through virtual spaces'], [fa.FaRobot, 'AI is generating new design options'], [fa.FaWind, 'Simulations are testing light and airflow live']],
    { x: 0.8, y: 2.95, w: 4.2, c: 'E6EEF7', cc: '22D3EE', gap: 0.62, outline: true });
  s.addShape('roundRect', { x: 6.2, y: 0.55, w: 2.75, h: 0.36, rectRadius: 0.18, fill: { color: '0E1626' }, line: { color: '22D3EE', width: 0.75 }, objectName: 'live' });
  s.addShape('ellipse', { x: 6.34, y: 0.67, w: 0.12, h: 0.12, fill: { color: 'FF5A6A' }, line: { color: 'FF5A6A', width: 0.5 }, objectName: 'livedot' });
  T(s, 'LIVE · SIMULATION RUNNING', { x: 6.55, y: 0.61, w: 2.35, h: 0.24, fontFace: MONO, fontSize: 9.5, bold: true, color: '22D3EE', objectName: 'livet' });
  ch = chrome(s, 9, 'dark', 'present', ['Right now', 'Screens → immersive simulation', 'Blur-to-sharp → live orbit', 'PRESENT CONTINUOUS'],
    { tense: 'PRESENT CONTINUOUS', form: 'am / is / are + V-ing', runs: ['Designers ', { v: 'are testing' }, ' lighting and airflow in virtual reality right now.'] });
  SPEC.push({ slide: 9, transition: { type: 'flythrough', dur: 1000 }, effects: [
    { t: 0.0, eff: 'expandIn', dur: 1.3, targets: ['room'] },
    { t: 0.8, eff: 'fade', dur: 1.2, targets: ['beams'] },
    { t: 1.0, eff: 'floatUp', dur: 0.8, targets: ['person'] },
    { t: 0.2, eff: 'fade', dur: 0.6, targets: ['!!Card'] },
    { t: 0.4, eff: 'fade', dur: 0.5, targets: ['!!Kicker'] },
    { t: 0.6, eff: 'floatUp', dur: 0.8, targets: ['!!Title'] },
    { t: 1.0, eff: 'floatUp', dur: 0.6, targets: ['!!Subtitle'] },
    ...r.map((g, i) => ({ t: 1.4 + i * 0.3, eff: 'floatUp', dur: 0.6, targets: g })),
    { t: 2.2, eff: 'fade', dur: 0.5, targets: ['live', 'livedot', 'livet'] },
    { t: 2.6, eff: 'pulse', dur: 0.6, targets: ['livedot'], opts: { scale: 160, count: 0 } },
    ...cubes.map(([, , n], i) => ({ t: 2.0 + i * 0.2, eff: 'fade', dur: 0.5, targets: [n] })),
    ...cubes.map(([, , n], i) => ({ t: 2.2 + i * 0.2, eff: 'path', dur: 5 + i, targets: [n], opts: { path: `M 0 0 C 0.03 -0.05 0.07 -0.05 0.09 0 C 0.07 0.05 0.03 0.05 0 0 E`.replace(/0\.09/g, (0.06 + i * 0.015).toFixed(3)), repeat: true } })),
    { t: 2.4, eff: 'fade', dur: 0.4, targets: ['scan'] },
    { t: 2.4, eff: 'path', dur: 4, targets: ['scan'], opts: { path: 'M 0 0 L 0.5 0 E', repeat: true } },
  ] });
  s.addNotes(`SCRIPT (~60 sec)
Right now, as I'm speaking, designers around the world are walking through buildings that don't exist yet. They are wearing VR headsets and testing light, space, and airflow in real time. At the same time, AI tools are generating hundreds of design options and comparing them for energy use, cost, and comfort. Clients aren't just looking at flat drawings anymore; they are experiencing their future homes and offices before construction even begins. This is the Present Continuous: am, is, or are plus the -ing form. We use it for actions happening at this moment and for current trends that are developing around now.

TARGET TENSE: Present Continuous (am/is/are + V-ing) — happening now, current trends.
Target verbs: am speaking, are walking, are wearing, (are) testing, are generating, (are) comparing, aren't looking, are experiencing.
Motion cue: live orbiting options, a scanning light, and a "LIVE" indicator — the action is in progress now.
Also used naturally: Present Simple (don't exist, begins, is, use).
Watch out: "This design is belonging to our team" ✗ → "belongs" ✓ (stative verb).`);

  // ------------------------------------------------------------ S10
  pres.addSection({ title: 'The Future' });
  s = pres.addSlide({ masterName: 'Full Image', sectionTitle: 'The Future' });
  full(s, 's10_sky.jpg', 'sky');
  full(s, 's10_far.png', 'far');
  full(s, 's10_city.png', 'city');
  s.addImage({ path: IMG('s10_head.png'), x: 4.7, y: 4.04, w: 0.7, h: 0.76, objectName: 'head' });
  const drones = [[5.3, 3.75, 'dr1'], [8.15, 3.6, 'dr2'], [12.25, 2.95, 'dr3']];
  drones.forEach(([x, y, n]) => s.addImage({ path: IMG('s10_drone.png'), x, y, w: 0.6, h: 0.36, objectName: n }));
  header(s, { x: 0.6, y: 0.5, w: 12.13, align: 'center', kicker: 'THE FUTURE  ·  2030 AND BEYOND', kc: 'F2B33D', title: 'Future Architecture & Engineering', ts: 38, th: 0.66, tc: 'FFFFFF',
    sub: 'Printed, adaptive, intelligent', sc: 'F3E8FF' });
  const fut = [[fa.FaPrint, '3D printers will build homes in days'], [fa.FaAtom, 'Smart materials will adapt to climate'], [fa.FaDraftingCompass, "We're going to design these cities"]];
  const e10 = [];
  for (let i = 0; i < 3; i++) {
    const x = 1.15 + i * 3.6, y = 2.1;
    s.addShape('roundRect', { x, y, w: 3.35, h: 0.92, rectRadius: 0.12, fill: { color: '1E1B4B', transparency: 30 }, line: { color: 'F2B33D', width: 0.75, transparency: 30 }, objectName: `fc${i + 1}` });
    s.addShape('ellipse', { x: x + 0.18, y: y + 0.23, w: 0.46, h: 0.46, fill: { color: 'F2B33D' }, line: { color: 'F2B33D', width: 0.5 }, objectName: `fic${i + 1}` });
    s.addImage({ data: await icon(fut[i][0], '1E1B4B'), x: x + 0.29, y: y + 0.34, w: 0.24, h: 0.24, objectName: `fii${i + 1}` });
    T(s, fut[i][1], { x: x + 0.78, y: y + 0.14, w: 2.45, h: 0.66, fontSize: 15, bold: true, color: 'FFFFFF', valign: 'middle', objectName: `ftx${i + 1}` });
    e10.push({ t: 1.4 + i * 0.3, eff: 'riseIn', dur: 0.7, targets: [`fc${i + 1}`, `fic${i + 1}`, `fii${i + 1}`, `ftx${i + 1}`] });
  }
  s.addShape('roundRect', { x: 4.77, y: 3.1, w: 3.8, h: 0.54, rectRadius: 0.27, fill: { color: '1E1B4B', transparency: 35 }, line: { color: 'FFD9A0', width: 0.75, transparency: 30 }, objectName: 'ty_bg' });
  T(s, 'Thank you  ·  Questions?', { x: 4.77, y: 3.14, w: 3.8, h: 0.46, fontFace: HEAD, fontSize: 20, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', objectName: 'ty' });
  ch = chrome(s, 10, 'dark', 'future', ['2030 and beyond', 'Built → printed & adaptive', 'Rise up → print path → dawn', 'FUTURE · WILL / GOING TO'],
    { tense: 'FUTURE', form: 'will + V1  ·  am / is / are going to + V1', runs: ['Smart materials and 3D printing ', { v: 'will reshape' }, ' how future buildings are constructed. We ', { v: 'are going to design' }, ' them.'] });
  SPEC.push({ slide: 10, transition: { type: 'pushUp', dur: 1000 }, effects: [
    { t: 0.0, eff: 'riseIn', dur: 1.3, targets: ['far'] },
    { t: 0.3, eff: 'riseIn', dur: 1.3, targets: ['city'] },
    { t: 0.2, eff: 'fade', dur: 0.5, targets: ['!!Kicker'] },
    { t: 0.4, eff: 'floatUp', dur: 0.9, targets: ['!!Title'] },
    { t: 0.9, eff: 'floatUp', dur: 0.6, targets: ['!!Subtitle'] },
    ...e10,
    { t: 2.2, eff: 'fade', dur: 0.4, targets: ['head'] },
    { t: 2.4, eff: 'path', dur: 3.2, targets: ['head'], opts: { path: 'M 0 0 L 0.2175 0 E', autoRev: true, repeat: true, smooth: true } },
    ...drones.map(([, , n], i) => ({ t: 2.4 + i * 0.2, eff: 'fade', dur: 0.5, targets: [n] })),
    ...drones.map(([, , n], i) => ({ t: 2.6 + i * 0.2, eff: 'path', dur: 2.2 + i * 0.4, targets: [n], opts: { path: 'M 0 0 L 0 -0.025 E', autoRev: true, repeat: true, smooth: true } })),
    { t: 3.4, eff: 'zoomIn', dur: 0.6, targets: ['ty_bg', 'ty'] },
  ] });
  s.addNotes(`SCRIPT (~70 sec)
Finally, let's look ahead. What will buildings look like in twenty years? I think 3D printing and smart materials will reshape the way we construct them. Robotic printers will build walls in days instead of months, and adaptive facades will react to heat and light on their own. Some cities have already set clear targets: Dubai, for example, aims to use 3D printing for a quarter of its buildings by 2030. With progress like this, the construction industry is going to change faster than ever, and as future engineers, we are going to design these buildings ourselves. Remember: we use will for predictions and promises, and going to for plans and for predictions based on present evidence. Thank you. I'll be happy to answer your questions.

TARGET TENSE: Future — will + V1 (predictions, promises, offers) · am/is/are going to + V1 (plans, evidence-based predictions).
Target verbs: will look, will reshape, will build, will react, is going to change, are going to design, 'll be.
Motion cue: the city rises upward and the printer keeps building — forward and upward = the future.
Also used naturally: Present Perfect Simple (have already set), Present Simple (think, construct, aims, use).
Watch out: "Buildings will to adapt" ✗ → "will adapt" ✓ · "We going to design" ✗ → "We are going to design" ✓.`);

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  fs.writeFileSync(path.join(__dirname, 'anim_spec.json'), JSON.stringify(SPEC, null, 1));
  console.log('written', OUT);
}
main().catch(e => { console.error(e); process.exit(1); });

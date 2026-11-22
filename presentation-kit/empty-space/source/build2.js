// The Architecture of Empty Space — animated deck
const pptxgen = require('pptxgenjs');
const fs = require('fs'), path = require('path');
const SKILL = '/root/.claude/skills/synced/4053cd73-26b3-4e96-9059-1c86e49cf057_78ad373f-24ee-4468-b7bd-35008017f477/pptx';
const { applyTheme } = require(SKILL + '/scripts/apply_theme.js');

const IMG = n => path.join(__dirname, 'img', n);
const OUT = path.join(__dirname, 'The-Architecture-of-Empty-Space.pptx');
const MAN = JSON.parse(fs.readFileSync(path.join(__dirname, 'svg', 'manifest.json')));
const AP = MAN.apertures;
const meta = n => MAN.layers.find(l => l.name === n);
const W = 13.333, H = 7.5;
const HEAD = 'Georgia', BODY = 'Calibri', CAPS = 'Arial', MONO = 'Consolas';
const C = { ink: '0F0F10', light: 'F3EEE6', mist: 'A8A29A', gold: 'E9B65A', golds: 'F6D9A0', sky: '8EC5E8', ember: 'E07A3F',
  aper: '15130F', inkT: '1A1917', mistL: '6B655C', goldT: '8A5F00' };
const THEME = { name: 'Empty Space', headFontFace: HEAD, bodyFontFace: BODY,
  colors: { dk1: '0F0F10', lt1: 'F3EEE6', dk2: '1A1917', lt2: 'FFFFFF', accent1: 'E9B65A', accent2: 'F6D9A0', accent3: '8EC5E8',
    accent4: 'E07A3F', accent5: 'A8A29A', accent6: '6B655C', hlink: 'E9B65A', folHlink: 'F6D9A0' } };
const SPEC = [];

function T(slide, text, o) {
  slide.addText(text, Object.assign({ isTextBox: true, margin: 0, valign: 'top', fontFace: BODY, paraSpaceAfter: 0 }, o));
}
const runs = (arr, base, hi) => arr.map(r => typeof r === 'string' ? { text: r, options: { color: base } } : { text: r.v, options: { color: hi, bold: true } });

// ------------------------------------------------------------ tense timeline geometry (inches)
const TL = { x0: 0.75, x1: 11.85, y: 6.98, now: 6.3 };
const TENSE = {
  ps: { name: 'PRESENT SIMPLE', bar: [1.0, 11.6, 0.06], faint: true },
  past: { name: 'PAST SIMPLE', bar: [3.55, 3.75, 0.2] },
  pp: { name: 'PAST PERFECT', bar: [2.1, 2.3, 0.2], ref: 3.65, link: [2.3, 3.54, true] },
  ppc: { name: 'PAST PERFECT CONTINUOUS', bar: [1.5, 3.45, 0.14], ref: 3.65 },
  pc: { name: 'PAST CONTINUOUS', bar: [3.1, 4.1, 0.14] },
  prp: { name: 'PRESENT PERFECT', bar: [4.3, 4.5, 0.2], ref: 6.3, link: [4.5, 6.19, false] },
  prpc: { name: 'PRESENT PERFECT CONTINUOUS', bar: [4.3, 6.45, 0.14], ref: 6.3 },
  prc: { name: 'PRESENT CONTINUOUS', bar: [5.9, 6.7, 0.14] },
  fut: { name: 'FUTURE · WILL / GOING TO', bar: [9.5, 9.7, 0.2], link: [6.4, 9.5, true] },
};

function chrome(slide, n, mode, tk) {
  const L = mode === 'light';
  const tx = L ? C.inkT : C.light, mist = L ? C.mistL : C.mist, gT = L ? C.goldT : C.gold, rule = L ? 'C9C1B5' : '3A3732';
  const t = TENSE[tk];
  // tense tag
  slide.addShape('roundRect', { x: 9.25, y: 0.5, w: 3.35, h: 0.34, rectRadius: 0.17, fill: { color: L ? 'F3EEE6' : C.ink, transparency: 100 },
    line: { color: gT, width: 0.75 }, objectName: '!!TagBox' });
  T(slide, [{ text: '●  ', options: { color: C.gold } }, { text: t.name, options: { color: gT, bold: true } }],
    { x: 9.25, y: 0.5, w: 3.35, h: 0.34, fontFace: MONO, fontSize: 9.5, align: 'center', valign: 'middle', charSpacing: 1, objectName: '!!TagText' });
  // timeline
  slide.addShape('line', { x: TL.x0, y: TL.y, w: TL.x1 - TL.x0, h: 0, line: { color: rule, width: 1 }, objectName: '!!TL' });
  slide.addShape('line', { x: TL.now, y: TL.y - 0.08, w: 0, h: 0.16, line: { color: mist, width: 1 }, objectName: '!!TLNow' });
  T(slide, 'PAST', { x: TL.x0, y: TL.y - 0.33, w: 1, h: 0.2, fontFace: MONO, fontSize: 8, color: mist, charSpacing: 2, objectName: '!!LabPast' });
  T(slide, 'NOW', { x: TL.now - 0.5, y: TL.y - 0.33, w: 1, h: 0.2, fontFace: MONO, fontSize: 8, color: mist, charSpacing: 2, align: 'center', objectName: '!!LabNow' });
  T(slide, 'FUTURE', { x: TL.x1 - 1, y: TL.y - 0.33, w: 1, h: 0.2, fontFace: MONO, fontSize: 8, color: mist, charSpacing: 2, align: 'right', objectName: '!!LabFut' });
  const [b0, b1, bh] = t.bar;
  // link (drawn first so the bar sits on top)
  if (t.link) {
    const [l0, l1, dash] = t.link;
    slide.addShape('line', { x: l0, y: TL.y, w: l1 - l0, h: 0, line: { color: C.gold, width: 1.25, dashType: dash ? 'dash' : 'solid' }, objectName: '!!TLink' });
  } else {
    slide.addShape('line', { x: (b0 + b1) / 2, y: TL.y, w: 0.01, h: 0, line: { color: C.gold, width: 1.25, transparency: 100 }, objectName: '!!TLink' });
  }
  slide.addShape('roundRect', { x: b0, y: TL.y - bh / 2, w: b1 - b0, h: bh, rectRadius: bh / 2, objectName: '!!TBar',
    fill: { color: C.gold, transparency: t.faint ? 55 : 0 }, line: { color: C.gold, width: 0.5, transparency: t.faint ? 55 : 0 } });
  const rx = t.ref != null ? t.ref : (b0 + b1) / 2;
  slide.addShape('ellipse', { x: rx - 0.11, y: TL.y - 0.11, w: 0.22, h: 0.22, fill: { color: C.ink, transparency: 100 },
    line: { color: C.gold, width: 1.25, transparency: t.ref != null ? 0 : 100 }, objectName: '!!TRef' });
  T(slide, `${String(n).padStart(2, '0')} / 10`, { x: 12.0, y: TL.y - 0.1, w: 0.6, h: 0.2, fontFace: MONO, fontSize: 9, color: mist, align: 'right', objectName: '!!Count' });
  return ['!!TagBox', '!!TagText', '!!TL', '!!TLNow', '!!LabPast', '!!LabNow', '!!LabFut', '!!TLink', '!!TBar', '!!TRef', '!!Count'];
}

function voidFrame(slide, n, mode) {
  const [x, y, w, h, r] = AP[n];
  const L = mode === 'light';
  slide.addImage({ path: IMG('glow.png'), x: x - 1.2, y: y - 1.2, w: w + 2.4, h: h + 2.4, objectName: '!!Glow', transparency: L ? 70 : 0 });
  slide.addShape('roundRect', { x, y, w, h, rectRadius: r, objectName: '!!Void', fill: { color: L ? C.light : C.aper },
    line: { color: C.gold, width: L ? 0.25 : 1, transparency: L ? 100 : 35 } });
}
const apImg = (slide, n, f, name) => { const [x, y, w, h] = AP[n]; slide.addImage({ path: IMG(f), x, y, w, h, objectName: name }); };

function header(slide, o) {
  const L = o.light;
  T(slide, o.kicker, { x: o.x, y: o.y, w: o.w, h: 0.25, fontFace: CAPS, fontSize: 10, bold: true, color: L ? C.goldT : C.gold, charSpacing: 3, objectName: '!!Kicker' });
  T(slide, o.title, { x: o.x, y: o.y + 0.33, w: o.w, h: o.th, fontFace: HEAD, fontSize: o.ts || 38, color: L ? C.inkT : C.light, objectName: '!!Title', lineSpacingMultiple: 0.95 });
  T(slide, runs(o.statement, L ? C.inkT : C.light, L ? C.goldT : C.gold), { x: o.x, y: o.sy || (o.y + 0.45 + o.th), w: o.w, h: o.sh || 0.85, fontSize: 18,
    objectName: '!!Statement', lineSpacingMultiple: 1.1 });
}

function facts(slide, items, o) {
  const names = [];
  items.forEach(([num, cap], i) => {
    const x = o.x + i * (o.colW + 0.18);
    T(slide, num, { x, y: o.y, w: o.colW, h: 0.5, fontFace: HEAD, fontSize: o.ns || 26, color: o.light ? C.goldT : C.gold, objectName: `fn${i + 1}` });
    T(slide, cap, { x, y: o.y + 0.52, w: o.colW, h: o.ch || 0.75, fontSize: 12.5, color: o.light ? C.mistL : C.mist, objectName: `fc${i + 1}`, lineSpacingMultiple: 1.05 });
    names.push([`fn${i + 1}`, `fc${i + 1}`]);
  });
  return names;
}

function notes(slide, script, tense, verbs, also, watch, tip) {
  slide.addNotes(`SCRIPT (~60 sec)\n${script}\n\nTARGET TENSE: ${tense}\nTarget verbs: ${verbs}\nAlso used naturally: ${also}\nWatch out: ${watch}\nDelivery tip: ${tip}`);
}

// ================================================================= slides
async function main() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = 'The Architecture of Empty Space';
  pres.subject = 'Why the void matters more than the walls — an English presentation in nine tenses';
  pres.author = 'University English Course';
  pres.theme = { headFontFace: HEAD, bodyFontFace: BODY };
  pres.defineSlideMaster({ title: 'Ink', background: { path: IMG('bg_ink.jpg') } });
  pres.defineSlideMaster({ title: 'Light', background: { path: IMG('bg_light.jpg') } });

  // ------------------------------------------------------------ 1  Present Simple
  pres.addSection({ title: 'The Idea' });
  let s = pres.addSlide({ masterName: 'Ink', sectionTitle: 'The Idea' });
  voidFrame(s, 1, 'dark');
  apImg(s, 1, 's1_door.png', 'door'); apImg(s, 1, 's1_person.png', 'person');
  { const [x, y, w, h] = AP[1]; s.addImage({ path: IMG('s1_spill.png'), x: x + w / 2 - 3.0, y: y + h, w: 6.0, h: 1.0, objectName: 'spill' }); }
  header(s, { x: 0.75, y: 1.2, w: 7.1, kicker: 'UNIVERSITY ENGLISH  ·  ARCHITECTURE', title: 'The Architecture of Empty Space', ts: 46, th: 1.62,
    statement: ['We build walls, but we ', { v: 'live' }, ' in the space between them.'], sh: 0.5, sy: 3.95 });
  T(s, 'Why the void matters more than the walls', { x: 0.75, y: 3.3, w: 7.1, h: 0.42, fontSize: 20, color: C.mist, objectName: 'sub' });
  T(s, '[Your Name]  ·  [Course Name]  ·  [Date]', { x: 0.75, y: 4.8, w: 7, h: 0.3, fontSize: 12, color: C.mist, objectName: 'footer' });
  let ch = chrome(s, 1, 'dark', 'ps');
  SPEC.push({ slide: 1, transition: { type: 'fade', dur: 1200 }, effects: [
    { t: 0.3, eff: 'split', dur: 1.8, targets: ['!!Void', 'door'] },
    { t: 1.2, eff: 'fade', dur: 2.0, targets: ['!!Glow'] },
    { t: 1.6, eff: 'fade', dur: 1.4, targets: ['spill'] },
    { t: 2.0, eff: 'floatUp', dur: 0.9, targets: ['person'] },
    { t: 0.8, eff: 'fade', dur: 0.7, targets: ['!!Kicker'] },
    { t: 1.1, eff: 'floatUp', dur: 1.1, targets: ['!!Title'] },
    { t: 2.2, eff: 'floatUp', dur: 0.8, targets: ['!!Statement'] },
    { t: 2.7, eff: 'floatUp', dur: 0.8, targets: ['sub'] },
    { t: 3.2, eff: 'fade', dur: 0.8, targets: ['footer'] },
    { t: 3.4, eff: 'fade', dur: 1.0, targets: ch },
    { t: 3.4, eff: 'breathe', dur: 5, targets: ['!!Glow'], opts: { scale: 108 } },
  ] });
  notes(s, `Good morning, everyone. Look around this room for a moment. What do you see? Most people see walls, a floor, and a ceiling. But we don't live in the walls; we live in the space between them. Every building begins as an empty space, and architects spend their whole careers shaping that emptiness. The walls cost money, but the space is what we actually use. Today, I want to show you why the void, the empty space, matters more than the walls. Each slide follows one English tense, and the small gold marker at the bottom shows where that tense sits in time. We start with the Present Simple, the tense of facts and general truths: architecture shapes space, and space shapes us.`,
    'Present Simple (Subject + V1 / V-s): facts, general truths, permanent principles.',
    'see, live, begins, spend, cost, is, use, want, matters, follows, shows, sits, start, shapes',
    "Present Simple questions and negatives (What do you see? / we don't live).",
    '"Space shape us" ✗ → "Space shapes us" ✓ (third-person -s).',
    'Pause after "What do you see?" and really look around the room. Let the silence work — it is empty space too.');

  // ------------------------------------------------------------ 2  Past Simple
  pres.addSection({ title: 'History' });
  s = pres.addSlide({ masterName: 'Ink', sectionTitle: 'History' });
  voidFrame(s, 2, 'dark');
  apImg(s, 2, 's2_wheel.png', 'wheel'); apImg(s, 2, 's2_pot.png', 'pot'); apImg(s, 2, 's2_void.png', 'potvoid');
  header(s, { x: 0.75, y: 0.95, w: 6.6, kicker: '02  ·  THE OLDEST IDEA', title: 'The Usefulness of Nothing', th: 1.25,
    statement: ['More than 2,000 years ago, Lao Tzu ', { v: 'noticed' }, ' what architects still learn today.'] });
  T(s, '“', { x: 0.7, y: 3.6, w: 0.6, h: 0.8, fontFace: HEAD, fontSize: 60, color: C.gold, objectName: 'qmark' });
  T(s, 'Clay is shaped into a vessel, but it is the emptiness within that makes it useful.', { x: 1.3, y: 3.8, w: 5.9, h: 0.95,
    fontFace: HEAD, fontSize: 19, italic: true, color: C.light, objectName: 'quote', lineSpacingMultiple: 1.1 });
  T(s, '— Lao Tzu, Tao Te Ching, ch. 11 (paraphrased)', { x: 1.3, y: 4.85, w: 5.9, h: 0.3, fontSize: 13, color: C.mist, objectName: 'attr' });
  { const [x, y, w, h] = AP[2]; T(s, 'GOLD  =  THE EMPTY, USEFUL PART', { x, y: y + h + 0.12, w, h: 0.25, fontFace: MONO, fontSize: 9, color: C.mist, align: 'center', charSpacing: 2, objectName: 'cap' }); }
  ch = chrome(s, 2, 'dark', 'past');
  SPEC.push({ slide: 2, transition: { type: 'morph', dur: 1400 }, effects: [
    { t: 0.1, eff: 'fade', dur: 1.0, targets: ['wheel'] },
    { t: 0.1, eff: 'spin', dur: 60, targets: ['wheel'], opts: { deg: 360, repeat: true } },
    { t: 0.5, eff: 'floatUp', dur: 0.9, targets: ['pot'] },
    { t: 1.5, eff: 'fade', dur: 1.6, targets: ['potvoid'] },
    { t: 3.2, eff: 'breathe', dur: 2.5, targets: ['potvoid'], opts: { scale: 103 } },
    { t: 1.0, eff: 'fade', dur: 0.6, targets: ['qmark'] },
    { t: 1.2, eff: 'floatUp', dur: 0.9, targets: ['quote'] },
    { t: 2.0, eff: 'fade', dur: 0.7, targets: ['attr'] },
    { t: 2.6, eff: 'fade', dur: 0.8, targets: ['cap'] },
  ] });
  notes(s, `Our story starts more than two thousand years ago in China. The philosopher Lao Tzu wrote a short poem about a clay pot. He noticed something that most people missed: potters made the pot from clay, but people used the empty space inside it. He described doors and windows in the same way. Builders cut openings into walls, and those empty openings made the room useful. Lao Tzu never designed a building, but he gave architecture its oldest lesson. This is the Past Simple. We use it for finished actions in the past: wrote, noticed, made, gave.`,
    'Past Simple (V2): finished actions at a finished time in the past.',
    'wrote, noticed, missed, made, used, described, cut, made, designed (never designed), gave',
    'Present Simple (our story starts, we use it).',
    '"He didn\'t noticed" ✗ → "He didn\'t notice" ✓ (after did/didn\'t use V1).',
    'Point to the gold shape inside the pot when you say "the empty space inside it."');

  // ------------------------------------------------------------ 3  Past Perfect
  s = pres.addSlide({ masterName: 'Ink', sectionTitle: 'History' });
  voidFrame(s, 3, 'dark');
  apImg(s, 3, 's3_section.png', 'section'); apImg(s, 3, 's3_sphere.png', 'sphere');
  { const [x, y] = AP[3]; const pv = meta('s3_beam').pivot_in_aperture;
    s.addImage({ path: IMG('s3_beam.png'), x: x + pv[0] - 3.5, y: y + pv[1] - 3.5, w: 7.0, h: 7.0, rotate: 348, objectName: 'beam' }); }
  header(s, { x: 6.4, y: 0.95, w: 6.2, kicker: '03  ·  ROME, c. 125 AD', title: 'The Eye of the Pantheon', th: 1.25,
    statement: ['Its builders ', { v: 'had shaped' }, ' a space so perfect that a sphere could fit inside.'] });
  let f = facts(s, [['43.3 m', 'dome width — exactly the same as its height'], ['≈ 8 m', 'the oculus: an open eye and its only window'],
    ['1,900', 'years as the largest unreinforced concrete dome']], { x: 6.4, y: 3.75, colW: 1.95 });
  ch = chrome(s, 3, 'dark', 'pp');
  SPEC.push({ slide: 3, transition: { type: 'morph', dur: 1400 }, effects: [
    { t: 0.1, eff: 'expandIn', dur: 1.2, targets: ['section'] },
    { t: 1.1, eff: 'fade', dur: 1.2, targets: ['sphere'] },
    { t: 1.8, eff: 'fade', dur: 1.2, targets: ['beam'] },
    { t: 2.6, eff: 'spin', dur: 7, targets: ['beam'], opts: { deg: 24, repeat: true, autoRev: true } },
    ...f.map((g, i) => ({ t: 1.4 + i * 0.35, eff: 'floatUp', dur: 0.7, targets: g })),
  ] });
  notes(s, `Now let's travel to Rome, around 125 AD. When Emperor Hadrian's builders finished the Pantheon, they had already done something extraordinary. They had built a concrete dome forty-three meters wide, and they had shaped the interior so perfectly that a sphere of the same size could fit inside it. Before the Pantheon, Roman temples had usually been dark rooms lit only through their doors. Here, the only window is a hole in the roof: the oculus. As the sun moves, a circle of light travels across the walls like a clock. This is the Past Perfect: had plus the past participle. It shows an action that was completed before another moment in the past.`,
    'Past Perfect (had + V3): an action completed before another past moment ("When the builders finished…").',
    'had (already) done, had built, had shaped, had (usually) been',
    'Past Simple (finished), Present Simple (the only window is, the sun moves, light travels).',
    '"had build" ✗ → "had built" ✓ (V3, not V1).',
    'Trace the beam of light with your hand as it sweeps across the dome.');

  // ------------------------------------------------------------ 4  Past Perfect Continuous
  s = pres.addSlide({ masterName: 'Ink', sectionTitle: 'History' });
  voidFrame(s, 4, 'dark');
  apImg(s, 4, 's4_lines.png', 'lines'); apImg(s, 4, 's4_nolli.png', 'nolli');
  header(s, { x: 0.75, y: 0.95, w: 5.05, kicker: '04  ·  ROME, 1748', title: 'When Emptiness Became the Hero', th: 1.25, sh: 1.1,
    statement: ['Giambattista Nolli ', { v: 'had been mapping' }, ' Rome for twelve years before his map appeared.'] });
  s.addShape('line', { x: 0.8, y: 4.35, w: 4.8, h: 0, line: { color: '3A3732', width: 1.5 }, objectName: 'dtrack' });
  s.addShape('roundRect', { x: 0.8, y: 4.29, w: 4.8, h: 0.12, rectRadius: 0.06, fill: { color: C.gold }, line: { color: C.gold, width: 0.5 }, objectName: 'dbar' });
  T(s, '1736', { x: 0.75, y: 4.48, w: 1, h: 0.25, fontFace: MONO, fontSize: 10, bold: true, color: C.gold, objectName: 'd0' });
  T(s, '1748 · map published', { x: 3.4, y: 4.48, w: 2.2, h: 0.25, fontFace: MONO, fontSize: 10, bold: true, color: C.gold, align: 'right', objectName: 'd1' });
  s.addShape('rect', { x: 0.8, y: 5.0, w: 0.16, h: 0.16, fill: { color: '141312' }, line: { color: C.mist, width: 0.75 }, objectName: 'lg1' });
  T(s, 'buildings', { x: 1.05, y: 4.96, w: 1.3, h: 0.25, fontSize: 12.5, color: C.mist, objectName: 'lg1t' });
  s.addShape('rect', { x: 2.3, y: 5.0, w: 0.16, h: 0.16, fill: { color: C.light }, line: { color: C.light, width: 0.75 }, objectName: 'lg2' });
  T(s, 'public space — even inside churches', { x: 2.55, y: 4.96, w: 3.2, h: 0.25, fontSize: 12.5, color: C.mist, objectName: 'lg2t' });
  { const [x, y] = AP[4]; const p = meta('s4_nolli').pantheon;
    s.addShape('ellipse', { x: x + p[0] - 0.33, y: y + p[1] - 0.33, w: 0.66, h: 0.66, fill: { color: C.gold, transparency: 100 }, line: { color: C.gold, width: 2 }, objectName: 'ring' });
    T(s, 'PANTHEON', { x: x + p[0] + 0.38, y: y + p[1] - 0.1, w: 1.0, h: 0.22, fontFace: MONO, fontSize: 9, bold: true, color: 'B9852A', objectName: 'ringt' }); }
  ch = chrome(s, 4, 'dark', 'ppc');
  SPEC.push({ slide: 4, transition: { type: 'morph', dur: 1400 }, effects: [
    { t: 0.1, eff: 'fade', dur: 0.9, targets: ['lines'] },
    { t: 0.6, eff: 'fade', dur: 0.4, targets: ['dtrack', 'd0'] },
    { t: 1.0, eff: 'wipeL', dur: 3.0, targets: ['nolli'] },
    { t: 1.0, eff: 'wipeL', dur: 3.0, targets: ['dbar'] },
    { t: 3.9, eff: 'fade', dur: 0.6, targets: ['d1'] },
    { t: 4.2, eff: 'fade', dur: 0.6, targets: ['lg1', 'lg1t', 'lg2', 'lg2t'] },
    { t: 4.5, eff: 'zoomIn', dur: 0.5, targets: ['ring'] },
    { t: 4.7, eff: 'fade', dur: 0.5, targets: ['ringt'] },
    { t: 5.0, eff: 'pulse', dur: 0.8, targets: ['ring'], opts: { scale: 125, count: 0 } },
  ] });
  notes(s, `Let's jump to 1748. An Italian architect and surveyor, Giambattista Nolli, had been measuring the streets of Rome for twelve years when he finally published his famous map. He had been drawing the city in a completely new way. Every building was solid black, and every public space was white: the streets, the squares, and even the insides of churches. Look closely, and you can see the Pantheon's round interior as a white circle. In Nolli's map, emptiness became the hero. This is the Past Perfect Continuous: had been plus the -ing form. It shows how long an action continued before a point in the past.`,
    'Past Perfect Continuous (had been + V-ing): duration of an action up to a point in the past.',
    'had been measuring, had been drawing (on slide: had been mapping)',
    'Past Simple (published, was, became), Present Simple (you can see).',
    '"had been draw" ✗ → "had been drawing" ✓.',
    'Let the map wipe finish before you say "emptiness became the hero" — the white space appears exactly as you say it.');

  // ------------------------------------------------------------ 5  Past Continuous
  s = pres.addSlide({ masterName: 'Ink', sectionTitle: 'History' });
  voidFrame(s, 5, 'dark');
  apImg(s, 5, 's5_plan.png', 'plan'); apImg(s, 5, 's5_path.png', 'flow');
  header(s, { x: 7.8, y: 0.95, w: 4.8, kicker: '05  ·  BARCELONA, 1929', title: 'Space That Flows', th: 0.68, sh: 1.1,
    statement: ['Visitors ', { v: 'were drifting' }, ' from inside to outside without ever opening a door.'] });
  const b5 = [];
  ['Free-standing walls of marble, onyx, and glass', 'Eight slim steel columns carry the roof', 'Mies van der Rohe & Lilly Reich'].forEach((t, i) => {
    s.addShape('line', { x: 7.82, y: 3.67 + i * 0.5, w: 0.22, h: 0, line: { color: C.gold, width: 1.5 }, objectName: `bm${i + 1}` });
    T(s, t, { x: 8.2, y: 3.52 + i * 0.5, w: 4.4, h: 0.32, fontSize: 15, color: C.light, objectName: `bt${i + 1}` });
    b5.push([`bm${i + 1}`, `bt${i + 1}`]);
  });
  { const [x, y] = AP[5]; const pts = meta('s5_path').pts;
    s.addShape('ellipse', { x: x + pts[0][0] / 100 - 0.07, y: y + pts[0][1] / 100 - 0.07, w: 0.14, h: 0.14, fill: { color: C.golds }, line: { color: C.gold, width: 1 }, objectName: 'walker' });
    var walk = 'M 0 0 ' + pts.slice(1, -1).map(p => `L ${((p[0] - pts[0][0]) / 1333).toFixed(4)} ${((p[1] - pts[0][1]) / 750).toFixed(4)}`).join(' ') + ' E'; }
  ch = chrome(s, 5, 'dark', 'pc');
  SPEC.push({ slide: 5, transition: { type: 'morph', dur: 1400 }, effects: [
    { t: 0.1, eff: 'fade', dur: 1.0, targets: ['plan'] },
    { t: 1.0, eff: 'wipeL', dur: 2.6, targets: ['flow'] },
    ...b5.map((g, i) => ({ t: 1.3 + i * 0.35, eff: 'floatUp', dur: 0.7, targets: g })),
    { t: 3.4, eff: 'fade', dur: 0.4, targets: ['walker'] },
    { t: 3.5, eff: 'path', dur: 7, targets: ['walker'], opts: { path: walk, repeat: true } },
  ] });
  notes(s, `Now we are in Barcelona in 1929, at the International Exposition. While many pavilions were displaying products and machines, Ludwig Mies van der Rohe and Lilly Reich were designing a pavilion that was almost empty. Visitors were drifting between free-standing walls of marble, onyx, and glass, and they were moving from inside to outside without ever opening a door. The space was flowing around the walls like water. This is the Past Continuous: was or were plus the -ing form. We use it for actions that were in progress at a time in the past.`,
    'Past Continuous (was/were + V-ing): actions in progress in the past, often side by side with "while".',
    'were displaying, were designing, were drifting, were moving, was flowing',
    'Present Simple (we use it), Present Continuous intro (we are in Barcelona).',
    '"While the visitors walked, the space was flowing" — keep both background actions continuous: "While visitors were walking…".',
    'Follow the moving gold dot with your eyes; the audience will copy you.');

  // ------------------------------------------------------------ 6  Present Perfect
  pres.addSection({ title: 'Engineering & Climate' });
  s = pres.addSlide({ masterName: 'Ink', sectionTitle: 'Engineering & Climate' });
  voidFrame(s, 6, 'dark');
  apImg(s, 6, 's6_ghost.png', 'ghost'); apImg(s, 6, 's6_tower.png', 'tower'); apImg(s, 6, 's6_slab.png', 'slab');
  header(s, { x: 0.75, y: 0.95, w: 7.9, kicker: '06  ·  PARIS, SINCE 1889', title: 'Engineering with Air', th: 0.68,
    statement: ['The Eiffel Tower ', { v: 'has stood' }, ' for more than 135 years — and it is mostly empty space.'] });
  f = facts(s, [['7,300 t', 'of iron in the tower’s structure'], ['≈ 6 cm', 'if melted and spread over its 125 m square base'],
    ['1889', 'built for the World’s Fair in Paris']], { x: 0.75, y: 2.95, colW: 2.45, ch: 0.6 });
  s.addImage({ path: IMG('s6_beams.png'), x: 0.75, y: 4.25, w: 2.6, h: 1.1, objectName: 'beams' });
  T(s, runs(['Engineers ', { v: 'have' }, ' also ', { v: 'hollowed out' }, ' beams: material stays where it works hardest, and the rest becomes air.'], C.mist, C.gold),
    { x: 3.6, y: 4.4, w: 4.9, h: 0.8, fontSize: 14, objectName: 'beamt', lineSpacingMultiple: 1.1 });
  { const [x, y, w] = AP[6]; T(s, 'IF MELTED  ≈  6 cm', { x, y: y + 4.66, w, h: 0.25, fontFace: MONO, fontSize: 9.5, bold: true, color: C.gold, align: 'center', charSpacing: 1, objectName: 'slabt' }); }
  ch = chrome(s, 6, 'dark', 'prp');
  SPEC.push({ slide: 6, transition: { type: 'morph', dur: 1400 }, effects: [
    { t: 0.1, eff: 'fade', dur: 0.6, targets: ['ghost'] },
    { t: 0.2, eff: 'floatUp', dur: 1.1, targets: ['tower'] },
    ...f.map((g, i) => ({ t: 1.0 + i * 0.35, eff: 'floatUp', dur: 0.7, targets: g })),
    { t: 2.1, eff: 'floatUp', dur: 0.7, targets: ['beams'] },
    { t: 2.4, eff: 'floatUp', dur: 0.7, targets: ['beamt'] },
    { t: 3.6, eff: 'exitFade', dur: 1.1, targets: ['tower'] },
    { t: 4.4, eff: 'split', dur: 0.9, targets: ['slab'] },
    { t: 4.9, eff: 'fade', dur: 0.6, targets: ['slabt'] },
    { t: 6.5, eff: 'exitFade', dur: 0.5, targets: ['slabt'] },
    { t: 6.8, eff: 'fade', dur: 1.2, targets: ['tower'] },
  ] });
  notes(s, `Engineers have learned the same lesson in a different way: empty space can make a structure stronger. The Eiffel Tower has stood in Paris since 1889, and it has become one of the most visited monuments on Earth. Yet it is mostly air. Its iron structure weighs about 7,300 metric tons, but if you melted it and spread it over its square base, the layer would be only about six centimeters thick. Engineers have also hollowed out beams and slabs, because material is only useful where it carries load. This is the Present Perfect: have or has plus the past participle. It connects the past with results we can still see today.`,
    'Present Perfect (have/has + V3): past actions with results that matter now; "since 1889".',
    'have learned, has stood, has become, have hollowed out',
    'Present Simple (it is mostly air, it weighs), second conditional (if you melted…, it would be).',
    '"The tower has stood since 135 years" ✗ → "for 135 years" / "since 1889" ✓.',
    'Stop talking for two seconds when the tower disappears and only the thin gold line remains.');

  // ------------------------------------------------------------ 7  Present Perfect Continuous
  s = pres.addSlide({ masterName: 'Ink', sectionTitle: 'Engineering & Climate' });
  voidFrame(s, 7, 'dark');
  apImg(s, 7, 's7_house.png', 'house');
  const ax = AP[7][0], ay = AP[7][1];
  s.addImage({ path: IMG('s7_cool.png'), x: ax + 2.25, y: ay + 1.75, w: 0.4, h: 0.86, objectName: 'cool1' });
  s.addImage({ path: IMG('s7_cool.png'), x: ax + 3.2, y: ay + 1.95, w: 0.4, h: 0.86, objectName: 'cool2' });
  s.addImage({ path: IMG('s7_hot.png'), x: ax + 2.75, y: ay + 1.45, w: 0.4, h: 0.86, objectName: 'hot1' });
  s.addImage({ path: IMG('s7_cool.png'), x: ax + 0.64, y: ay + 0.62, w: 0.4, h: 0.86, objectName: 'wind' });
  s.addImage({ path: IMG('s7_sun.png'), x: ax + 2.9, y: ay + 0.35, w: 0.6, h: 0.6, objectName: 'sun' });
  header(s, { x: 7.1, y: 0.95, w: 5.5, kicker: '07  ·  BAGHDAD', title: 'The Courtyard: A Climate Machine', th: 1.25, sh: 1.1,
    statement: ['Engineers ', { v: 'have been rediscovering' }, " what Baghdad's old houses always knew."] });
  const l7 = [];
  [[C.sky, 'Cool night air sinks into the hosh'], [C.ember, 'Hot air rises and escapes: the stack effect'], [C.gold, 'The badgir pushes fresh air down to the sirdab']].forEach(([c, t], i) => {
    s.addShape('ellipse', { x: 7.12, y: 4.12 + i * 0.46, w: 0.14, h: 0.14, fill: { color: c }, line: { color: c, width: 0.5 }, objectName: `lm${i + 1}` });
    T(s, t, { x: 7.45, y: 4.02 + i * 0.46, w: 5.1, h: 0.32, fontSize: 15, color: C.light, objectName: `lt${i + 1}` });
    l7.push([`lm${i + 1}`, `lt${i + 1}`]);
  });
  ch = chrome(s, 7, 'dark', 'prpc');
  SPEC.push({ slide: 7, transition: { type: 'morph', dur: 1400 }, effects: [
    { t: 0.1, eff: 'expandIn', dur: 1.1, targets: ['house'] },
    { t: 1.0, eff: 'fade', dur: 0.6, targets: ['sun'] },
    { t: 1.2, eff: 'path', dur: 10, targets: ['sun'], opts: { path: 'M 0 0 C 0.04 -0.05 0.17 -0.05 0.21 0 E', autoRev: true, repeat: true, smooth: true } },
    ...l7.map((g, i) => ({ t: 1.3 + i * 0.4, eff: 'floatUp', dur: 0.7, targets: g })),
    { t: 1.6, eff: 'fade', dur: 0.5, targets: ['cool1', 'cool2'] },
    { t: 1.6, eff: 'path', dur: 2.6, targets: ['cool1'], opts: { path: 'M 0 0 L 0 0.12 E', repeat: true } },
    { t: 1.9, eff: 'path', dur: 2.6, targets: ['cool2'], opts: { path: 'M 0 0 L 0 0.12 E', repeat: true } },
    { t: 2.1, eff: 'fade', dur: 0.5, targets: ['hot1'] },
    { t: 2.1, eff: 'path', dur: 2.8, targets: ['hot1'], opts: { path: 'M 0 0 L 0 -0.13 E', repeat: true } },
    { t: 2.5, eff: 'fade', dur: 0.5, targets: ['wind'] },
    { t: 2.5, eff: 'path', dur: 3.4, targets: ['wind'], opts: { path: 'M 0 0 L 0 0.36 E', repeat: true } },
  ] });
  notes(s, `Now let's come home, to old Baghdad. For centuries, families lived around an open courtyard, the hosh. At night, cool air sank into the courtyard and filled the rooms. During the hot afternoon, people moved down to the sirdab, a cool basement, while the badgir, a wind catcher on the roof, pushed fresh air down to them. Today, architects and engineers have been rediscovering these ideas. They have been designing courtyards and atriums that pull hot air up and out like a chimney. We call this the stack effect. This is the Present Perfect Continuous: have or has been plus the -ing form. It describes an action that started in the past and is still going on now.`,
    'Present Perfect Continuous (have/has been + V-ing): started in the past and still continuing.',
    'have been rediscovering, have been designing',
    'Past Simple (lived, sank, filled, moved, pushed), Present Simple (we call, it describes).',
    '"Engineers are rediscovering it since 2010" ✗ → "have been rediscovering it since 2010" ✓.',
    'Say the Arabic words naturally — hosh, sirdab, badgir, shanasheel. This is our heritage on the screen.');

  // ------------------------------------------------------------ 8  Present Continuous
  pres.addSection({ title: 'Today' });
  s = pres.addSlide({ masterName: 'Ink', sectionTitle: 'Today' });
  voidFrame(s, 8, 'dark');
  apImg(s, 8, 's8_room.png', 'room');
  const rx8 = AP[8][0], ry8 = AP[8][1];
  s.addShape('rect', { x: rx8 + 0.44, y: ry8 + 1.96, w: 5.32, h: 0.05, fill: { color: C.light }, line: { color: C.light, width: 0.25 }, objectName: 'ceiling' });
  s.addImage({ path: IMG('s8_aura.png'), x: rx8 + 2.62 - 0.9, y: ry8 + 2.62 - 0.9, w: 1.8, h: 1.8, objectName: 'aura' });
  header(s, { x: 0.75, y: 0.95, w: 5.2, kicker: '08  ·  RIGHT HERE, RIGHT NOW', title: 'Space Shapes the Mind', th: 1.25, sh: 1.0,
    statement: ['Right now, the space around you ', { v: 'is shaping' }, ' how you think.'] });
  const f8 = [];
  [['3.0 m vs 2.4 m', 'Higher ceilings encourage freer, more creative thinking (Meyers-Levy & Zhu, 2007).'],
   ['45 cm · 1.2 m · 3.6 m', 'The invisible zones of personal space we keep without noticing (Edward T. Hall, 1966).']].forEach(([n, c], i) => {
    T(s, n, { x: 0.75, y: 3.75 + i * 1.15, w: 5.2, h: 0.45, fontFace: HEAD, fontSize: 24, color: C.gold, objectName: `fn${i + 1}` });
    T(s, c, { x: 0.75, y: 4.23 + i * 1.15, w: 5.1, h: 0.55, fontSize: 13, color: C.mist, objectName: `fc${i + 1}`, lineSpacingMultiple: 1.05 });
    f8.push([`fn${i + 1}`, `fc${i + 1}`]);
  });
  ch = chrome(s, 8, 'dark', 'prc');
  SPEC.push({ slide: 8, transition: { type: 'morph', dur: 1400 }, effects: [
    { t: 0.1, eff: 'fade', dur: 1.0, targets: ['room'] },
    { t: 0.8, eff: 'fade', dur: 0.6, targets: ['ceiling', 'aura'] },
    { t: 1.6, eff: 'path', dur: 3.5, targets: ['ceiling'], opts: { path: 'M 0 0 L 0 -0.064 E', autoRev: true, repeat: true, smooth: true } },
    { t: 1.6, eff: 'breathe', dur: 3.5, targets: ['aura'], opts: { scale: 128 } },
    ...f8.map((g, i) => ({ t: 1.2 + i * 0.5, eff: 'floatUp', dur: 0.7, targets: g })),
    { t: 0.5, eff: 'breathe', dur: 1.2, targets: ['!!TBar'], opts: { scale: 112 } },
  ] });
  notes(s, `Now, let's talk about this room. Right now, as you are listening to me, the space around you is shaping the way you think. In a 2007 study, people in rooms with higher ceilings thought more freely and creatively, while people under lower ceilings focused more on details. At this moment, you are also keeping a certain distance from the person next to you, without even noticing it. The anthropologist Edward T. Hall called this personal space. So the empty space in this room is not doing nothing; it is working on your mind all the time. This is the Present Continuous: am, is, or are plus the -ing form. We use it for actions that are happening right now.`,
    'Present Continuous (am/is/are + V-ing): actions happening at the moment of speaking.',
    'are listening, is shaping, are keeping, is not doing, is working',
    'Past Simple (thought, focused, called), Present Simple (we use it).',
    '"The space shaping you" ✗ → "The space is shaping you" ✓ (keep the auxiliary).',
    'Raise your hand slowly toward the ceiling as the gold ceiling line rises on the screen.');

  // ------------------------------------------------------------ 9  Present Simple (describing)
  s = pres.addSlide({ masterName: 'Ink', sectionTitle: 'Today' });
  voidFrame(s, 9, 'dark');
  apImg(s, 9, 's9_flowA.png', 'flowA'); apImg(s, 9, 's9_flowB.png', 'flowB');
  header(s, { x: 7.6, y: 0.95, w: 5.0, kicker: '09  ·  BORN IN BAGHDAD', title: 'Zaha Hadid: Space in Motion', th: 1.25, sh: 1.1,
    statement: ['In her buildings, walls ', { v: 'bend' }, ', floors ', { v: 'rise' }, ', and space never ', { v: 'stops' }, '.'] });
  f = facts(s, [['1950', 'born in Baghdad'], ['2004', 'first woman to win the Pritzker Prize']], { x: 7.6, y: 3.95, colW: 2.3, ch: 0.5 });
  T(s, '“There are 360 degrees, so why stick to one?”  — Zaha Hadid', { x: 7.6, y: 5.12, w: 5.0, h: 0.6, fontFace: HEAD, fontSize: 14, italic: true, color: C.mist, objectName: 'zq' });
  ch = chrome(s, 9, 'dark', 'ps');
  SPEC.push({ slide: 9, transition: { type: 'morph', dur: 1400 }, effects: [
    { t: 0.1, eff: 'fade', dur: 1.2, targets: ['flowA'] },
    { t: 0.7, eff: 'wipeL', dur: 2.4, targets: ['flowB'] },
    { t: 3.2, eff: 'path', dur: 4, targets: ['flowB'], opts: { path: 'M 0 0 L 0.012 -0.006 E', autoRev: true, repeat: true, smooth: true } },
    ...f.map((g, i) => ({ t: 1.4 + i * 0.4, eff: 'floatUp', dur: 0.7, targets: g })),
    { t: 2.4, eff: 'fade', dur: 0.8, targets: ['zq'] },
  ] });
  notes(s, `And now, a name that makes us very proud. Zaha Hadid was born here in Baghdad in 1950, and in 2004 she became the first woman to win the Pritzker Prize, the highest honor in architecture. In her buildings, space never stops. Walls bend into floors, floors rise into roofs, and corridors flow like rivers. In the Heydar Aliyev Center in Baku, the ground lifts, folds, and becomes the building itself. Her work proves that empty space does not have to be a box; it can move. This is the Present Simple again, this time to describe how her buildings work and what they always do.`,
    'Present Simple (second use): describing permanent features — how her buildings are and what they do.',
    'stops, bend, rise, flow, lifts, folds, becomes, proves, does not have',
    'Past Simple for biography (was born, became).',
    '"Her work prove" ✗ → "Her work proves" ✓.',
    'Smile on "makes us very proud" — the audience will feel it with you.');

  // ------------------------------------------------------------ 10  Future
  pres.addSection({ title: 'Tomorrow' });
  s = pres.addSlide({ masterName: 'Light', sectionTitle: 'Tomorrow' });
  voidFrame(s, 10, 'light');
  s.addImage({ path: IMG('s10_city.png'), x: 0, y: 0, w: W, h: H, objectName: 'city' });
  header(s, { x: 0.75, y: 0.95, w: 6.4, light: true, kicker: '10  ·  TOMORROW', title: 'The Future Will Be Built of Space', th: 1.25, sh: 0.6,
    statement: ['Cities ', { v: 'are going to need' }, ' more emptiness, not less.'] });
  T(s, 'Next time you enter a building, don’t look at the walls. Look at the space.', { x: 0.75, y: 3.3, w: 6.2, h: 1.0,
    fontFace: HEAD, fontSize: 22, italic: true, color: C.inkT, objectName: 'close', lineSpacingMultiple: 1.1 });
  T(s, 'THANK YOU  ·  QUESTIONS?', { x: 0.75, y: 4.36, w: 6, h: 0.3, fontFace: CAPS, fontSize: 13, bold: true, color: C.goldT, charSpacing: 3, objectName: 'thanks' });
  ch = chrome(s, 10, 'light', 'fut');
  SPEC.push({ slide: 10, transition: { type: 'morph', dur: 1800 }, effects: [
    { t: 0.6, eff: 'wipeL', dur: 2.8, targets: ['city'] },
    { t: 2.0, eff: 'floatUp', dur: 1.0, targets: ['close'] },
    { t: 3.4, eff: 'fade', dur: 0.8, targets: ['thanks'] },
  ] });
  notes(s, `So, what will the future look like? As our cities grow, empty space is going to become more valuable than ever. Architects will design towers with gardens in the sky, open ground floors, and courtyards that breathe. Engineers are going to use voids to cool buildings without wasting energy. I believe the best buildings of the future will not be the ones with the most walls, but the ones with the most meaningful space. So, the next time you enter a building, don't look at the walls. Look at the space; someone designed it for you. Thank you. I'll be happy to answer your questions.`,
    'Future: will + V1 (predictions, beliefs, offers) · am/is/are going to + V1 (plans and evidence-based predictions).',
    "will look, is going to become, will design, are going to use, will not be, 'll be (I'll be happy)",
    'Present Simple (cities grow, I believe), imperatives (don\'t look / look), Past Simple (someone designed).',
    '"will to design" ✗ → "will design" ✓ · "Engineers going to use" ✗ → "are going to use" ✓.',
    'When the screen fills with light, slow down. Deliver the last line, then wait three seconds before "Thank you."');

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  fs.writeFileSync(path.join(__dirname, 'anim_spec.json'), JSON.stringify(SPEC, null, 1));
  console.log('written', OUT);
}
main().catch(e => { console.error(e); process.exit(1); });

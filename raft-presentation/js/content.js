/* =====================================================================
   ONE NIGHT, ONE RAFT: content (single source of truth)
   ---------------------------------------------------------------------
   Everything the presentation SAYS lives here: the 9 tenses, the
   10 slides, the spoken script, the on-slide text, ElevenLabs cues and
   the Gamma / Canva cues. The 3D scene (scene.js), the HUD (app.js),
   the professor's grammar page (grammar.html) and the Markdown docs
   (tools/build-docs.mjs) all read from this file.

   Script markup
     {KEY:verb phrase}  a verb in a target tense (KEY = tense key below)
     " / "              short pause  (~0.6 s)
     " // "             long pause   (~1.2 s)
   ===================================================================== */
(function (root) {
  'use strict';

  const TENSES = {
    PRS: {
      n: 1, name: 'Present Simple', short: 'Present Simple', color: '#6cc6ff', timeline: 'habit',
      form: {
        pos: 'subject + base verb (+ -s / -es with he, she, it)',
        neg: 'subject + do / does + not + base verb',
        q: 'Do / Does + subject + base verb?'
      },
      formEx: { pos: 'The raft covers 4,500 m².', neg: 'The raft does not rest on piles.', q: 'Does the raft carry the walls?' },
      use: [
        'Permanent facts and fixed project specifications',
        'General engineering principles and scientific truths',
        'Routines and repeated actions'
      ],
      signals: ['always', 'usually', 'normally', 'every day', 'in general'],
      example: 'A raft foundation {PRS:distributes} heavy structural loads evenly across the soil.',
      why: 'Slide 1 describes the permanent design of the raft (its area, thickness and layout) and the engineering principle behind it. These facts are always true, so the Present Simple fits.',
      mistakes: [
        ['The raft distribute the load.', 'The raft distributes the load.', 'Add -s with he / she / it.'],
        ['The raft is cover 4,500 m².', 'The raft covers 4,500 m².', 'Do not mix "be" with a main verb.']
      ],
      slides: [1]
    },
    PRC: {
      n: 2, name: 'Present Continuous', short: 'Present Continuous', color: '#2fe0c0', timeline: 'now',
      form: {
        pos: 'subject + am / is / are + verb-ing',
        neg: 'subject + am / is / are + not + verb-ing',
        q: 'Am / Is / Are + subject + verb-ing?'
      },
      formEx: { pos: 'The pumps are pushing concrete.', neg: 'The trucks are not waiting long.', q: 'Is the concrete spreading evenly?' },
      use: [
        'Actions happening now, at the moment of speaking',
        'Temporary actions in progress around now',
        'Live description, as if the audience is watching'
      ],
      signals: ['now', 'right now', 'at the moment', 'look!', 'listen!', 'tonight'],
      example: 'Workers {PRC:are guiding} the pump hoses and vibrating fresh concrete under the floodlights.',
      why: 'Slide 8 narrates the live night pour as if the audience is standing on site and watching it happen right now.',
      mistakes: [
        ['Look! The pump pumps concrete now.', 'Look! The pump is pumping concrete now.', 'Use the continuous form for actions in progress now.'],
        ['The raft is needing more concrete.', 'The raft needs more concrete.', 'Stative verbs (need, know, own) usually stay simple.']
      ],
      slides: [8]
    },
    PAS: {
      n: 3, name: 'Past Simple', short: 'Past Simple', color: '#ffb000', timeline: 'point-past',
      form: {
        pos: 'subject + verb-ed (regular) or the past form (irregular: laid, spread, built)',
        neg: 'subject + did not + base verb',
        q: 'Did + subject + base verb?'
      },
      formEx: { pos: 'The crew laid the bottom mesh.', neg: 'The crew did not skip any crossings.', q: 'Did the engineers check the spacing?' },
      use: [
        'Completed actions at a specific time in the past',
        'A sequence of finished events (first, then, after that, finally)'
      ],
      signals: ['yesterday', 'last week', 'ago', 'first', 'then', 'after that', 'finally'],
      example: 'The crew {PAS:laid} the bottom reinforcement mesh and {PAS:placed} concrete cover blocks.',
      why: 'Slides 2, 4 and 6 tell the reinforcement and formwork story as a sequence of finished steps.',
      mistakes: [
        ['Did they laid the mesh?', 'Did they lay the mesh?', 'After "did", use the base verb.'],
        ['The crew spreaded the bars.', 'The crew spread the bars.', '"Spread" is irregular: spread / spread / spread.']
      ],
      slides: [2, 4, 6]
    },
    PAC: {
      n: 4, name: 'Past Continuous', short: 'Past Continuous', color: '#ff7b39', timeline: 'bar-past-point',
      form: {
        pos: 'subject + was / were + verb-ing',
        neg: 'subject + was / were + not + verb-ing',
        q: 'Was / Were + subject + verb-ing?'
      },
      formEx: { pos: 'The engineers were checking the spacing.', neg: 'The crane was not working at 10:00.', q: 'Were the workers tying the chairs?' },
      use: [
        'An action in progress at a specific moment in the past',
        'The background to a shorter past action (when / while)',
        'Two or more past actions happening at the same time'
      ],
      signals: ['while', 'when', 'at that moment', 'at 10 o\'clock yesterday', 'all morning'],
      example: 'Engineers {PAC:were inspecting} the chair spacing while workers {PAS:arranged} the grid.',
      why: 'Slides 2, 3 and 6 freeze busy moments on site: many crews working at once while the engineers inspected.',
      mistakes: [
        ['While they checked, the engineer was noticed a gap.', 'While they were checking, the engineer noticed a gap.', 'The long background action is continuous; the short event is simple.'],
        ['The workers was tying the chairs.', 'The workers were tying the chairs.', 'Plural subject: were.']
      ],
      slides: [2, 3, 6]
    },
    PPF: {
      n: 5, name: 'Past Perfect Simple', short: 'Past Perfect', color: '#ff5470', timeline: 'before-past',
      form: {
        pos: 'subject + had + past participle',
        neg: 'subject + had not (hadn\'t) + past participle',
        q: 'Had + subject + past participle?'
      },
      formEx: { pos: 'The crew had finished both meshes.', neg: 'The trucks had not arrived yet.', q: 'Had the engineers approved the chairs?' },
      use: [
        'An action completed before another past action or time',
        'The "earlier past" in a story told in the past'
      ],
      signals: ['before', 'after', 'by the time', 'already', 'until', 'when'],
      example: 'The engineers {PPF:had inspected} the braced timber formwork before the first mixer truck {PAS:arrived}.',
      why: 'Slide 5 looks back from the day the starter bars arrived: both meshes were already complete before that moment.',
      mistakes: [
        ['The crew had took the bars.', 'The crew had taken the bars.', 'Use the past participle after "had".'],
        ['By the time the bars arrived, the crew finished the mesh.', 'By the time the bars arrived, the crew had finished the mesh.', '"By the time" signals the earlier past.']
      ],
      slides: [5]
    },
    PPFC: {
      n: 6, name: 'Past Perfect Continuous', short: 'Past Perfect Cont.', color: '#e06cff', timeline: 'bar-to-past-point',
      form: {
        pos: 'subject + had been + verb-ing',
        neg: 'subject + had not been + verb-ing',
        q: 'Had + subject + been + verb-ing?'
      },
      formEx: { pos: 'They had been fixing steel for three weeks.', neg: 'They had not been resting.', q: 'How long had they been working?' },
      use: [
        'The duration of an activity continuing up to a point in the past',
        'Explaining a past situation by the long effort before it'
      ],
      signals: ['for three weeks', 'since', 'all day', 'how long', 'before'],
      example: 'Crews {PPFC:had been preparing} the site and reinforcing zones for days before the night pour {PAS:began}.',
      why: 'Slide 5 stresses the weeks of continuous steel fixing and preparation that led up to the pour.',
      mistakes: [
        ['They had been fix steel.', 'They had been fixing steel.', 'After "had been", use verb-ing.'],
        ['They had been knowing the plan.', 'They had known the plan.', 'Stative verbs avoid the continuous form.']
      ],
      slides: [5]
    },
    PRF: {
      n: 7, name: 'Present Perfect Simple', short: 'Present Perfect', color: '#a594ff', timeline: 'point-to-now',
      form: {
        pos: 'subject + have / has + past participle',
        neg: 'subject + have / has + not + past participle',
        q: 'Have / Has + subject + past participle?'
      },
      formEx: { pos: 'We have coordinated 75 trucks.', neg: 'We haven\'t forgotten anything.', q: 'Have the engineers signed the checklist?' },
      use: [
        'Completed actions with a result or relevance now',
        'Totals, counts and achievements up to now',
        'Unfinished time periods (today, tonight, so far) and no exact past time'
      ],
      signals: ['already', 'just', 'yet', 'so far', 'up to now', 'ever', 'never'],
      example: 'We {PRF:have coordinated} 6 batching plants, 75 mixer trucks, and 11 concrete pumps for tonight\'s pour.',
      why: 'Slide 7 reports everything that is already mobilized. The actions are finished, but the result (a site ready to pour) matters now.',
      mistakes: [
        ['We have coordinated the trucks yesterday.', 'We coordinated the trucks yesterday.', 'A finished time (yesterday) needs the Past Simple.'],
        ['The engineers has signed.', 'The engineers have signed.', 'Plural subject: have.']
      ],
      slides: [7]
    },
    PRFC: {
      n: 8, name: 'Present Perfect Continuous', short: 'Present Perfect Cont.', color: '#8ee05c', timeline: 'bar-to-now',
      form: {
        pos: 'subject + have / has been + verb-ing',
        neg: 'subject + have / has not been + verb-ing',
        q: 'Have / Has + subject + been + verb-ing?'
      },
      formEx: { pos: 'The crews have been vibrating for ten hours.', neg: 'They haven\'t been resting.', q: 'How long have they been curing it?' },
      use: [
        'An activity that started in the past and is still continuing now',
        'Emphasis on duration and non-stop effort',
        'A recent activity with a visible result now'
      ],
      signals: ['since 8 p.m.', 'for ten hours', 'all night', 'how long', 'continuously'],
      example: 'The teams {PRFC:have been consolidating}, leveling, and curing the concrete continuously since pouring {PAS:started}.',
      why: 'Slide 9 shows work that began when the pour started and has not stopped: vibration, finishing and curing are still going on.',
      mistakes: [
        ['They have been working since ten hours.', 'They have been working for ten hours.', '"For" + a period; "since" + a starting point.'],
        ['They are working since 8 p.m.', 'They have been working since 8 p.m.', 'Past-to-now duration needs the perfect form.']
      ],
      slides: [9]
    },
    FUT: {
      n: 9, name: 'Future (will / going to)', short: 'Future', color: '#ffe680', timeline: 'future',
      form: {
        pos: 'subject + will + base verb  |  subject + am / is / are going to + base verb',
        neg: 'subject + will not (won\'t) + base verb  |  am / is / are not going to + base verb',
        q: 'Will + subject + base verb?  |  Am / Is / Are + subject + going to + base verb?'
      },
      formEx: { pos: 'The lab is going to crush the cubes. The columns will rise.', neg: 'The formwork won\'t stay for long.', q: 'Are they going to test the cubes on day 7?' },
      use: [
        'going to: plans and intentions already decided; predictions from present evidence',
        'will: predictions, promises, expected outcomes and decisions made now'
      ],
      signals: ['tomorrow', 'next week', 'in 7 days', 'after 28 days', 'soon', 'one day'],
      example: 'Engineers {FUT:are going to test} the concrete cubes and strip the formwork before starting the vertical columns.',
      why: 'Slide 10 presents the scheduled next steps (going to) and the expected long-term outcome (will).',
      mistakes: [
        ['The lab will to test the cubes.', 'The lab will test the cubes.', 'No "to" after "will".'],
        ['They are going to tested the cubes.', 'They are going to test the cubes.', 'Use the base verb after "going to".']
      ],
      slides: [10]
    }
  };

  const TENSE_ORDER = ['PRS', 'PRC', 'PAS', 'PAC', 'PPF', 'PPFC', 'PRF', 'PRFC', 'FUT'];

  const PROJECT = {
    name: 'One Night, One Raft',
    subtitle: 'Building a reinforced concrete raft foundation, told in nine English tenses',
    area: 4500, thickness: 1.0, volume: 4500, cover: 75,
    plants: 6, trucks: 75, pumps: 11, workers: 60, engineers: 7,
    truckLoad: 10,           // m3 per truckload (typical 8 to 12 m3)
    pourRate: 380,           // m3 per hour, planning estimate for 11 pumps
    pourStart: 20            // 20:00
  };

  const SLIDES = [
    {
      n: 1, key: 'overview', short: 'Overview',
      title: 'One Raft, One Continuous Slab',
      zone: 'Project overview and CAD layout',
      tenses: ['PRS'],
      phase: 'Design and setting out', clock: 'Week 0',
      bullets: [
        '4,500 m² reinforced concrete raft, 1.0 m thick',
        'One slab carries every column, retaining wall and stair core',
        'Layout from the structural CAD: raft border, column grid, walls, stair starters, pits'
      ],
      examples: ['A raft foundation {PRS:distributes} heavy structural loads evenly across the soil.'],
      explain: {
        PRS: 'We describe permanent facts, fixed specifications and a general engineering principle. None of this changes with time, so we use the Present Simple.'
      },
      script: 'Good morning, everyone. // My presentation {PRS:follows} one reinforced concrete raft foundation, from the first steel bar to the last drop of concrete, / and it {PRS:uses} nine English tenses along the way. // Let\'s start with the facts, in the Present Simple. / Our raft {PRS:covers} four thousand five hundred square meters, / and it {PRS:is} one meter thick. / A raft foundation {PRS:distributes} heavy structural loads evenly across the soil. / Instead of many separate footings, one continuous slab {PRS:supports} every column, every retaining wall, and both stair cores. // The structural drawings {PRS:define} the shape. / The red line {PRS:marks} the R.C. raft border, / the yellow squares {PRS:show} the columns, / and the hatched boxes {PRS:indicate} the lift pit and the sump pit. // The site {PRS:sits} on bare, earthen ground, / and several buildings under construction {PRS:surround} it. / The team {PRS:pours} the raft at night, because cool air {PRS:slows} the setting of the concrete. // These are permanent facts and fixed specifications, / so the Present Simple {PRS:is} the natural choice.',
      voice: {
        mood: 'Warm, confident opening. Smile in the voice.',
        speed: 0.95,
        stress: ['four thousand five hundred', 'one meter', 'evenly', 'permanent facts'],
        tip: 'Pause fully after "Good morning, everyone." Slow down on the numbers so the audience can see them on the HUD.'
      },
      visual: 'Elevated three-quarter aerial view (about 40°) of a 4,500 m² raft footprint on a lean-concrete blinding slab, a glowing CAD layout overlay (red raft border, cyan grid, yellow columns, magenta retaining walls, green stair starters, hatched pits), bare earthen site, access roads, and concrete-frame buildings under construction around it. Late-afternoon light.',
      imagePrompt: 'Cinematic elevated three-quarter aerial view, 40 degree camera angle, of a large empty construction site with a 80 x 60 meter lean concrete blinding slab, glowing holographic CAD layout lines projected on it (red border, cyan grid lines, yellow column squares), bare brown earthen terrain, gravel access roads, concrete frame buildings under construction with scaffolding in the background, tower crane, golden hour light, photorealistic, engineering visualization style',
      canva: { enter: 'Rise (title) + Fade (bullets, 0.4 s stagger)', element: 'Breathe on the "4,500 m²" stat', transition: 'Match & Move into slide 2' },
      gammaLayout: 'Full-bleed image with a dark gradient on the left for text'
    },
    {
      n: 2, key: 'bottom', short: 'Bottom mesh',
      title: 'Bottom Mesh: Laid and Inspected',
      zone: 'Bottom reinforcement mesh',
      tenses: ['PAS', 'PAC'],
      phase: 'Reinforcement', clock: 'Week 1',
      bullets: [
        'Bottom bars spread in both directions, tied at every crossing',
        'Cover blocks under the mesh keep 75 mm of concrete cover',
        'Engineers checked the spacing row by row'
      ],
      examples: [
        'The crew {PAS:laid} the bottom reinforcement mesh and {PAS:placed} concrete cover blocks.',
        'While the workers {PAC:were spreading} the bars, two engineers {PAC:were walking} the grid.'
      ],
      explain: {
        PAS: 'Finished actions in a clear order: the crew laid, spread, placed and tied.',
        PAC: 'Background actions in progress at that time: the engineers were walking and checking while the crew worked. A short Past Simple event (noticed) interrupts the longer Past Continuous action.'
      },
      script: 'Now let\'s go back to the first week on site. // For finished actions, I\'ll use the Past Simple, / and for actions in progress, the Past Continuous. // First, the crew {PAS:laid} the bottom reinforcement mesh across the blinding concrete. / They {PAS:spread} the long bars in one direction, / {PAS:placed} the cross bars on top, / and {PAS:tied} every crossing with wire. / They also {PAS:placed} concrete cover blocks under the mesh. // While the workers {PAC:were spreading} the bars, / two engineers {PAC:were walking} the grid with the drawings. / They {PAC:were checking} the bar spacing, row by row. / While they {PAC:were checking} the third row, an engineer {PAS:noticed} a wide gap, / and the crew {PAS:fixed} it immediately. // So, the Past Simple tells us what happened, / and the Past Continuous describes what {PAC:was going on} at that moment.',
      voice: {
        mood: 'Storytelling, calm and clear.',
        speed: 0.96,
        stress: ['laid', 'spread', 'tied', 'were walking', 'noticed'],
        tip: 'Make "While the workers were spreading" sound like background (slightly softer), then lift the voice on "noticed".'
      },
      visual: 'Zoom into the south-west zone: yellow-helmet workers carrying and spreading long bottom bars in both directions and tying crossings, small grey cover blocks under the mesh, two white-helmet engineers walking the grid with tablets.',
      imagePrompt: 'Close elevated view of construction workers in orange safety vests and yellow helmets laying a steel reinforcement bar grid on a concrete blinding slab, small concrete cover spacer blocks under the bars, two engineers in white helmets holding tablets inspecting bar spacing, daylight, realistic, focused depth of field',
      canva: { enter: 'Pan (image, slow push-in)', element: 'Wipe the two example lines in one at a time', transition: 'Dissolve' },
      gammaLayout: 'Image right, text left, two example quotes as callout blocks'
    },
    {
      n: 3, key: 'chairs', short: 'Chairs',
      title: 'Rebar Chairs: Holding the Top Mesh',
      zone: 'Rebar chairs on the bottom mesh',
      tenses: ['PAC'],
      phase: 'Reinforcement', clock: 'Week 1 · Tue 10:00',
      bullets: [
        'Steel chairs set on the bottom mesh in a regular grid',
        'They hold the top mesh at the correct level',
        'Spacing checked with tape measures and drawings'
      ],
      examples: ['Engineers {PAC:were inspecting} the chair spacing while workers {PAS:arranged} the grid.'],
      explain: {
        PAC: 'We freeze one moment in the past (Tuesday, 10:00) and describe several actions that were in progress at the same time.'
      },
      script: 'Let\'s freeze one moment: / Tuesday, ten o\'clock in the morning. // What {PAC:was happening} on the raft? / Workers {PAC:were carrying} steel chairs across the bottom mesh. / Some {PAC:were setting} them down in straight lines, / and others {PAC:were tying} them to the bars, so they couldn\'t move. // At the same time, the engineers {PAC:were inspecting} the chair spacing with tape measures, / and one of them {PAC:was marking} the levels on the drawing. // Why do chairs matter? / Because they carry the top mesh at exactly the right height. // This is the Past Continuous in action: / many activities {PAC:were happening} at the same time, / at one specific moment in the past.',
      voice: {
        mood: 'Descriptive, like narrating a photograph.',
        speed: 0.95,
        stress: ['freeze', 'was happening', 'at the same time'],
        tip: 'Say "What was happening on the raft?" as a real question with rising intonation, then pause.'
      },
      visual: 'Zoom onto the middle-south zone: rows of steel chairs dropping into place on the bottom mesh, workers carrying and tying chairs, engineers measuring chair spacing.',
      imagePrompt: 'Elevated close view of workers placing steel rebar chairs in a regular grid on a bottom reinforcement mesh, engineers in white hard hats measuring spacing with a tape, organized construction site, daylight, realistic',
      canva: { enter: 'Fade', element: 'Pop the three bullets in sequence', transition: 'Match & Move' },
      gammaLayout: 'Large image on top, three short bullets below'
    },
    {
      n: 4, key: 'top', short: 'Top mesh',
      title: 'Top Mesh: Side Bars, Then Front Bars',
      zone: 'Top reinforcement mesh',
      tenses: ['PAS'],
      phase: 'Reinforcement', clock: 'Week 2',
      bullets: [
        'Crane lifted bar bundles onto the chairs',
        'Side bars across the 60 m width, then front bars along the 80 m length',
        'Every crossing tied; top cover checked'
      ],
      examples: ['The crew {PAS:spread} the side bars across the width, then {PAS:laid} the front bars along the length.'],
      explain: {
        PAS: 'A sequence of completed steps (first, then, after that, finally). It is also a chance to compare regular verbs (lifted, checked) with irregular ones (came, spread, laid).'
      },
      script: 'Next {PAS:came} the top mesh. // This {PAS:was} a clear sequence of finished steps, / so the Past Simple is the perfect tense. // First, the tower crane {PAS:lifted} bundles of bars onto the chairs. / Then the crew {PAS:spread} the side bars across the full width of the raft, sixty meters. / After that, they {PAS:laid} the front bars along the whole length, eighty meters from end to end. / Finally, they {PAS:tied} every crossing / and {PAS:checked} the top cover. // Listen to the verbs: / lifted and checked are regular verbs that simply add E-D, / but came, spread, and laid are irregular, / so we just have to learn them.',
      voice: {
        mood: 'Clear and structured, like giving instructions.',
        speed: 0.97,
        stress: ['First', 'Then', 'After that', 'Finally', 'irregular'],
        tip: 'Count the sequence words on your fingers while rehearsing: first, then, after that, finally.'
      },
      visual: 'Wider zoom over the raft: the tower crane lowering a bar bundle, workers spreading side bars across the width, then front bars along the length on top of the chairs.',
      imagePrompt: 'Aerial three-quarter view of a huge raft foundation with a complete double layer steel reinforcement mesh, tower crane lowering a bundle of rebar, workers in yellow helmets tying the top mesh, daylight, photorealistic construction visualization',
      canva: { enter: 'Pan', element: 'Line wipe across the width, then along the length (two arrows)', transition: 'Slide (left)' },
      gammaLayout: 'Image left, a numbered four-step sequence right'
    },
    {
      n: 5, key: 'starters', short: 'Starters',
      title: 'Starter Bars: Columns, Walls, Stairs, Shaft',
      zone: 'Column, wall, stair and shaft starter bars',
      tenses: ['PPF', 'PPFC'],
      phase: 'Reinforcement', clock: 'Week 3',
      bullets: [
        'Vertical starters lowered at every column, retaining wall, stair and shaft',
        'Lap length left above the raft for the next stage',
        'Positions taken directly from the CAD layout'
      ],
      examples: [
        'The engineers {PPF:had inspected} the braced timber formwork before the first mixer truck {PAS:arrived}.',
        'Crews {PPFC:had been preparing} the site and reinforcing zones for days before the night pour {PAS:began}.'
      ],
      explain: {
        PPF: 'Something was complete before another past moment: the meshes were finished before the starter bars arrived.',
        PPFC: 'We stress how long an activity continued before that past moment: weeks of steel fixing.'
      },
      script: 'Now, imagine the day the starter bars arrived. // To talk about the time before that day, we need the Past Perfect. // By the time the starter bars arrived, the crew {PPF:had already finished} both meshes, / and the engineers {PPF:had approved} every chair. / The workers lowered the vertical bars into the columns, / along the retaining walls, / and around the stair and shaft openings, exactly where the drawings showed them. // They {PPFC:had been fixing} steel for almost three weeks, / and they {PPFC:had been working} long shifts every single day. // Here\'s the difference: / "had finished" focuses on the completed result, / while "had been fixing" focuses on the long effort. // And on the night of the pour, we could say: / the engineers {PPF:had inspected} the braced timber formwork before the first mixer truck arrived, / and crews {PPFC:had been preparing} the site and reinforcing zones for days before the night pour began.',
      voice: {
        mood: 'Reflective, slightly slower. Clear contrast between the two forms.',
        speed: 0.93,
        stress: ['had already finished', 'had been fixing', 'result', 'effort'],
        tip: 'Stress "had" and "been" clearly: "had BEEN fixing". Many speakers swallow them.'
      },
      visual: 'Zoom onto the east zone: vertical starter bars lowering into column positions, a double row along the retaining wall, and bars around the stair starter and lift shaft, with engineers checking against drawings.',
      imagePrompt: 'Elevated close view of vertical steel starter bars rising from a reinforced raft mesh for columns and a retaining wall, stair core starter bars, workers lowering vertical rebar, engineers with drawings, realistic construction photography',
      canva: { enter: 'Rise', element: 'Draw a timeline arrow: "had finished" (point) then "had been fixing" (bar)', transition: 'Dissolve' },
      gammaLayout: 'Two-column comparison: Past Perfect vs Past Perfect Continuous'
    },
    {
      n: 6, key: 'formwork', short: 'Formwork',
      title: 'Cover Blocks and Braced Timber Formwork',
      zone: 'Cover blocks, timber formwork, bracing and nailing',
      tenses: ['PAS', 'PAC'],
      phase: 'Formwork', clock: 'Week 3',
      bullets: [
        '75 mm cover blocks under the mesh and against the sides',
        'Timber boards enclose the 1.0 m raft edge',
        'External braces and stakes resist wet-concrete pressure'
      ],
      examples: ['The carpenters {PAS:nailed} the boards while the engineers {PAC:were checking} the alignment.'],
      explain: {
        PAS: 'Completed steps: checked and placed the cover blocks, built the formwork, found and marked a loose brace.',
        PAC: 'Activities in progress at the same time: nailing, driving stakes, checking the alignment.'
      },
      script: 'Before any concrete could arrive, the steel needed protection, and the edges needed support. // First, workers {PAS:checked} the cover blocks under the bottom mesh and {PAS:placed} more along the sides. / These small blocks {PAS:kept} a seventy-five-millimeter gap between the steel and the outer surface, / so the concrete could protect the bars from corrosion. // Then the carpenters {PAS:built} timber formwork around the entire border. / While they {PAC:were nailing} the boards, / other workers {PAC:were driving} stakes into the ground and fixing diagonal braces. / The hammering {PAC:was going on} all day. // Meanwhile, the engineers {PAC:were checking} the alignment with a string line and a level. / When they {PAS:found} a loose brace, they {PAS:marked} it, / and the crew {PAS:added} two more nails on the spot. // Again: / the Past Simple for completed steps, / the Past Continuous for actions in progress.',
      voice: {
        mood: 'Energetic but controlled; you can almost hear the hammers.',
        speed: 0.97,
        stress: ['placed', 'built', 'were nailing', 'were driving', 'found'],
        tip: 'Keep "While they were nailing the boards" in one breath.'
      },
      visual: 'Close-up of the south raft edge: grey cover blocks highlighted under and beside the mesh, timber boards rising around the 1.0 m edge, workers hammering nails and fixing diagonal braces to ground stakes, engineers checking alignment with a level.',
      imagePrompt: 'Close view of timber formwork boards around the edge of a reinforced concrete raft, diagonal wooden braces to ground stakes, carpenters hammering nails, concrete cover spacer blocks under rebar, engineer with a spirit level, daylight, realistic',
      canva: { enter: 'Fade', element: 'Shake (tiny) on a hammer icon synced with "were nailing"', transition: 'Color wipe to dark navy (night begins)' },
      gammaLayout: 'Image with two labeled callouts: cover blocks, formwork + braces'
    },
    {
      n: 7, key: 'mobilize', short: 'Mobilization',
      title: 'Night Pour: Mobilized and Ready',
      zone: 'Night-pour mobilization and logistics',
      tenses: ['PRF'],
      phase: 'Pour night', clock: '19:00 · T-60 min',
      bullets: [
        '6 batching plants · 75 mixer trucks · 11 pumps',
        '~60 workers (yellow helmets) · 7 engineers (white helmets)',
        '≈4,500 m³ ≈ 450 truckloads in one continuous pour'
      ],
      examples: ['We {PRF:have coordinated} 6 batching plants, 75 mixer trucks, and 11 concrete pumps for tonight\'s pour.'],
      explain: {
        PRF: 'All these actions are finished, but we care about the result now: the site is ready. There is no finished past time (not "yesterday"), and we give totals.'
      },
      script: 'It\'s seven o\'clock in the evening, / and the floodlights {PRF:have just come} on. // Now we\'re back in the present. / I\'ll use the Present Perfect, because these finished actions matter right now. // We {PRF:have coordinated} six batching plants, seventy-five mixer trucks, and eleven concrete pumps for tonight\'s pour. / We {PRF:have calculated} the volume: / about four thousand five hundred cubic meters, / or roughly four hundred and fifty truckloads. // We {PRF:have gathered} around sixty workers in yellow helmets / and seven engineers in white helmets. / The engineers {PRF:have inspected} the formwork one last time, / and they {PRF:have signed} the pre-pour checklist. // {PRF:Have} we {PRF:forgotten} anything? / No, we {PRF:haven\'t}. // Everything is ready, / and that result matters now: / tonight, we pour.',
      voice: {
        mood: 'Building anticipation. Confident, slightly lower pitch.',
        speed: 0.95,
        stress: ['have just come on', 'six', 'seventy-five', 'eleven', 'tonight, we pour'],
        tip: 'Leave a full one-second pause before "tonight, we pour" and say it slowly.'
      },
      visual: 'Dusk turns to night; floodlight towers switch on one by one; pumps set up around the raft, mixer trucks queue on the access road; workers gather for the pre-pour briefing; clean data badges count up: 6 plants, 75 trucks, 11 pumps, ~60 workers, 7 engineers.',
      imagePrompt: 'Night construction site, elevated three-quarter aerial view, floodlight towers casting beams over a reinforced raft foundation ready for pouring, concrete boom pumps around the edge, a line of mixer trucks with headlights on the access road, workers in hi-vis vests and yellow helmets gathered for a briefing, dramatic cinematic lighting',
      canva: { enter: 'Neon or Fade (dark background)', element: 'Count-up numbers: use "Typewriter" or "Tumble" on 6 / 75 / 11 / 60 / 7', transition: 'Match & Move' },
      gammaLayout: 'Dark card with five big-number stat tiles'
    },
    {
      n: 8, key: 'pour', short: 'Live pour',
      title: 'Live: Pouring Through the Night',
      zone: 'Live night concrete pouring',
      tenses: ['PRC'],
      phase: 'Pour night', clock: 'live',
      bullets: [
        'Pumps placing concrete in layers',
        'Trucks discharging, queuing, entering and leaving',
        'Vibrators and hoses on every active zone'
      ],
      examples: ['Workers {PRC:are guiding} the pump hoses and vibrating fresh concrete under the floodlights.'],
      explain: {
        PRC: 'We describe the action as it happens, at the moment of speaking, as if the audience is watching it live.'
      },
      script: 'Look at the screen: / this {PRC:is happening} right now, / so we need the Present Continuous. // The pumps {PRC:are pushing} concrete through their booms, / and the concrete {PRC:is spreading} across the raft in layers. / At the edge of the raft, two mixer trucks {PRC:are discharging} into the pump hoppers, / more trucks {PRC:are waiting} in line, / and an empty truck {PRC:is leaving} for the next load. // Workers {PRC:are guiding} the pump hoses and vibrating fresh concrete under the floodlights. / On the scaffolding, two workers {PRC:are moving} a hose along the edge. // And the engineers? / They {PRC:are checking} the slump, / they {PRC:are taking} cube samples, / and they {PRC:are talking} to the batching plants by radio to keep the trucks moving. // Every verb here describes an action in progress, at this very moment.',
      voice: {
        mood: 'Live-commentary energy, a little faster, but never rushed.',
        speed: 1.0,
        stress: ['right now', 'are pushing', 'are discharging', 'are guiding', 'at this very moment'],
        tip: 'Point at the screen on "Look at the screen". Your gestures make the Present Continuous feel live.'
      },
      visual: 'Night, floodlight beams; boom pumps placing concrete, the wet concrete front advancing in layers with reflections; trucks discharging into hoppers, waiting, entering and leaving; workers on scaffolding, vibrators rippling the surface; engineers supervising; logistics badges stay on screen.',
      imagePrompt: 'Night concrete pour of a large raft foundation, floodlights reflecting on wet fresh concrete, boom pumps placing concrete, workers in yellow helmets holding pump hoses and concrete vibrators, mixer trucks discharging into pump hoppers, cinematic, high contrast, photorealistic',
      canva: { enter: 'Fade', element: 'Use a short looping video of the 3D scene (exported from the HTML) as the background', transition: 'Dissolve' },
      gammaLayout: 'Full-bleed night image, text in a translucent dark panel'
    },
    {
      n: 9, key: 'finish', short: 'Finishing',
      title: 'Non-Stop Consolidation, Finishing and Curing',
      zone: 'Consolidation, finishing and curing',
      tenses: ['PRFC'],
      phase: 'Pour night', clock: 'live',
      bullets: [
        'Vibrating, screeding and power floating without a break',
        'Curing follows close behind the finishers',
        'No cold joints: one monolithic raft'
      ],
      examples: ['The teams {PRFC:have been consolidating}, leveling, and curing the concrete continuously since pouring {PAS:started}.'],
      explain: {
        PRFC: 'The work started in the past (8 p.m.) and is still continuing now. We emphasize the duration and the non-stop effort.'
      },
      script: 'It\'s now six o\'clock in the morning. // The pour started at eight last night, / so we need a tense that connects the past with the present: / the Present Perfect Continuous. // The teams {PRFC:have been consolidating}, leveling, and curing the concrete continuously since pouring started. / The vibrator crews {PRFC:have been working} for ten hours without a break, / and the finishers {PRFC:have been floating} the surface, zone by zone. // Behind them, the curing team {PRFC:has been spraying} water and covering the fresh concrete with plastic sheets, / so the surface doesn\'t dry out too quickly. // The engineers {PRFC:have been monitoring} the concrete temperature all night. // How long {PRFC:have} they {PRFC:been doing} this? / Since eight o\'clock, / and they are still going. // That\'s the key idea: / it started in the past, / and it continues now.',
      voice: {
        mood: 'Steady, tired-but-proud tone of a long night shift.',
        speed: 0.94,
        stress: ['have been consolidating', 'ten hours', 'since eight o\'clock', 'still going'],
        tip: 'Contrast "for ten hours" and "since eight o\'clock" clearly: they are the two classic signals.'
      },
      visual: 'Pre-dawn sky; the concrete front near the east end; behind it, vibrators, power floats spinning on the finished surface, curing sheets being rolled out; engineers checking temperature; elapsed-time clock in the HUD.',
      imagePrompt: 'Pre-dawn construction site, freshly poured reinforced concrete raft being finished with power trowels, workers covering concrete with clear plastic curing sheets, floodlights still on, blue hour sky, realistic, wide elevated view',
      canva: { enter: 'Fade', element: 'Progress bar animation "8 p.m. → now"', transition: 'Color wipe to light (day)' },
      gammaLayout: 'Image left, a since/for timeline graphic right'
    },
    {
      n: 10, key: 'future', short: 'Next steps',
      title: 'Next: Testing and Going Vertical',
      zone: 'Cube testing and next construction phases',
      tenses: ['FUT'],
      phase: 'After the pour', clock: 'Day 1 · 08:30',
      bullets: [
        'Cube tests at 7 and 28 days',
        'Side formwork stripped',
        'Columns, walls and stairs rise from the starter bars'
      ],
      examples: [
        'Engineers {FUT:are going to test} the concrete cubes and strip the formwork before starting the vertical columns.',
        'If the results meet the specification, the columns {FUT:will rise} from these starter bars.'
      ],
      explain: {
        FUT: '"Going to" for plans already decided (testing, stripping). "Will" for predictions and expected outcomes (the columns will rise, the raft will carry the building).'
      },
      script: 'Finally, let\'s look to the future. // The pour is complete, and the raft is curing. / So, what\'s next? // For plans that are already decided, we use "going to". / Engineers {FUT:are going to test} the concrete cubes and strip the formwork before starting the vertical columns. / The laboratory {FUT:is going to crush} the first cubes after seven days, / and the final cubes after twenty-eight days. // For predictions and promises, we use "will". / If the results meet the specification, / and we expect they {FUT:will}, / the columns {FUT:will rise} from these starter bars, / the retaining walls {FUT:will close} the basement, / and the stairs {FUT:will climb} toward the upper floors. // One day, this raft {FUT:will carry} the whole building, / and nobody {FUT:will see} it. / But it {FUT:will be} there, doing its job, every single day. // Thank you for listening.',
      voice: {
        mood: 'Uplifting, slower, a clear sense of ending.',
        speed: 0.92,
        stress: ['going to', 'will', 'nobody will see it', 'every single day'],
        tip: 'Take a long pause before "Thank you for listening" and look at the audience, not the screen.'
      },
      visual: 'Morning light: formwork lifting away, the cured raft with protruding starter bars, a cube-testing station by the site office, and translucent "future" columns, walls and stair cores rising, with buildings under construction around.',
      imagePrompt: 'Morning light over a completed reinforced concrete raft foundation with protruding column starter bars, formwork removed, concrete cube compression test station next to a site office, translucent blue holographic preview of future columns and walls rising, construction buildings around, optimistic cinematic',
      canva: { enter: 'Rise', element: 'Ghost columns: "Grow" effect; final line "Thank you" with Fade', transition: 'None (end)' },
      gammaLayout: 'Image with a 7-day / 28-day timeline strip and a closing line'
    }
  ];

  /* ---------- helpers shared by the HUD, grammar page and docs ---------- */
  const VERB_RE = /\{(PRS|PRC|PAS|PAC|PPF|PPFC|PRF|PRFC|FUT):([^}]+)\}/g;

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  /* Marked-up text -> HTML with coloured verb spans. opts.pauses: render pause marks. */
  function markupToHTML(text, opts) {
    opts = opts || {};
    let out = esc(text).replace(VERB_RE, (m, k, v) =>
      '<span class="verb" data-t="' + k + '" style="--tc:' + TENSES[k].color + '" title="' + TENSES[k].name + '">' + v + '</span>');
    if (opts.pauses) {
      out = out.replace(/ \/\/ /g, ' <span class="pause long" title="long pause">‖</span> ')
               .replace(/ \/ /g, ' <span class="pause" title="short pause">|</span> ');
    } else {
      out = out.replace(/ \/\/ /g, ' ').replace(/ \/ /g, ' ');
    }
    return out;
  }
  function plain(text) {
    return text.replace(VERB_RE, '$2').replace(/ \/\/ /g, ' ').replace(/ \/ /g, ' ');
  }
  /* ElevenLabs-ready text: verbs unmarked, pauses as SSML break tags (Multilingual v2 / Turbo / Flash). */
  function toElevenLabs(text) {
    return text.replace(VERB_RE, '$2')
      .replace(/ \/\/ /g, ' <break time="1.2s" /> ')
      .replace(/ \/ /g, ' <break time="0.6s" /> ');
  }
  /* Chunks for rehearsal playback: [{text, pause}] */
  function chunks(text) {
    const parts = text.replace(VERB_RE, '$2').split(/ (\/\/|\/) /);
    const res = [];
    for (let i = 0; i < parts.length; i += 2) {
      const sep = parts[i + 1];
      res.push({ text: parts[i], pause: sep === '//' ? 1200 : sep === '/' ? 600 : 0 });
    }
    return res;
  }
  function wordCount(text) { return plain(text).split(/\s+/).filter(Boolean).length; }
  /* Rough speaking time in seconds at the slide's voice speed (~140 wpm at 1.0). */
  function speakSeconds(slide) {
    const w = wordCount(slide.script);
    const longP = (slide.script.match(/ \/\/ /g) || []).length;
    const shortP = (slide.script.match(/ \/ /g) || []).length;
    return Math.round(w / (2.35 * (slide.voice.speed || 1)) + longP * 1.2 + shortP * 0.6);
  }
  /* Highlighted verbs in a text, per tense key. */
  function verbsIn(text) {
    const res = [];
    text.replace(VERB_RE, (m, k, v) => { res.push([k, v]); return m; });
    return res;
  }

  /* Small timeline diagram for each tense (inline SVG, colour from token). */
  function timelineSVG(type, color) {
    const W = 240, H = 64, y = 40, now = 150;
    const axis = '<line x1="12" y1="' + y + '" x2="228" y2="' + y + '" stroke="currentColor" stroke-opacity=".45" stroke-width="1.5"/>' +
      '<path d="M228 ' + y + ' l-7 -4 v8 z" fill="currentColor" fill-opacity=".45"/>' +
      '<line x1="' + now + '" y1="18" x2="' + now + '" y2="' + (y + 10) + '" stroke="currentColor" stroke-opacity=".7" stroke-dasharray="3 3"/>' +
      '<text x="' + now + '" y="60" text-anchor="middle" font-size="10" fill="currentColor" fill-opacity=".75">NOW</text>' +
      '<text x="14" y="60" font-size="10" fill="currentColor" fill-opacity=".55">past</text>' +
      '<text x="226" y="60" text-anchor="end" font-size="10" fill="currentColor" fill-opacity=".55">future</text>';
    const X = (x, s) => '<path d="M' + (x - 5) + ' ' + (y - 5 - (s || 0)) + ' l10 10 M' + (x + 5) + ' ' + (y - 5 - (s || 0)) + ' l-10 10" stroke="' + color + '" stroke-width="2.4" stroke-linecap="round"/>';
    const bar = (a, b, wavy) => wavy
      ? '<path d="M' + a + ' ' + (y - 9) + ' q 6 -6 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0" fill="none" stroke="' + color + '" stroke-width="2.6"/>'
      : '<rect x="' + a + '" y="' + (y - 12) + '" width="' + (b - a) + '" height="7" rx="3.5" fill="' + color + '"/>';
    let g = '';
    switch (type) {
      case 'habit': g = [40, 75, 110, 150, 190].map(x => X(x)).join(''); break;
      case 'now': g = '<path d="M' + (now - 36) + ' ' + (y - 9) + ' q 6 -6 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0" fill="none" stroke="' + color + '" stroke-width="2.6"/>'; break;
      case 'point-past': g = X(70); break;
      case 'bar-past-point': g = bar(40, 110) + X(78, 10); break;
      case 'before-past': g = X(45) + '<path d="M52 ' + (y - 16) + ' Q 75 ' + (y - 30) + ' 98 ' + (y - 16) + '" fill="none" stroke="' + color + '" stroke-opacity=".7" stroke-width="1.5"/>' + X(105) + '<text x="45" y="20" text-anchor="middle" font-size="9" fill="' + color + '">1st</text><text x="105" y="20" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity=".7">2nd</text>'; break;
      case 'bar-to-past-point': g = bar(30, 105) + X(108) ; break;
      case 'point-to-now': g = X(80) + '<path d="M86 ' + (y - 14) + ' Q 118 ' + (y - 34) + ' ' + (now - 2) + ' ' + (y - 14) + '" fill="none" stroke="' + color + '" stroke-width="1.6" stroke-dasharray="4 3"/><circle cx="' + now + '" cy="' + (y - 12) + '" r="3.5" fill="' + color + '"/>'; break;
      case 'bar-to-now': g = bar(55, now + 8); break;
      case 'future': g = X(195) + '<path d="M' + (now + 6) + ' ' + (y - 14) + ' Q 172 ' + (y - 30) + ' 189 ' + (y - 14) + '" fill="none" stroke="' + color + '" stroke-width="1.6" stroke-dasharray="4 3"/>'; break;
    }
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" aria-label="timeline">' + axis + g + '</svg>';
  }

  const API = { TENSES, TENSE_ORDER, SLIDES, PROJECT, markupToHTML, plain, toElevenLabs, chunks, wordCount, speakSeconds, verbsIn, timelineSVG, esc };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.RAFT_CONTENT = API;
})(typeof window !== 'undefined' ? window : globalThis);

"""Rewrite the uploaded Gamma deck: topic + grammar text, safe fonts, no overlaps, Morph-ready names, notes."""
import re, sys, json, copy
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import MSO_AUTO_SIZE, MSO_ANCHOR, PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml.ns import qn

SRC, DST = sys.argv[1], sys.argv[2]
HEAD, BODY = "Georgia", "Arial"
C_TITLE, C_BODY, C_SOFT, C_ACC, C_MUTE = "F4F0E7", "DAD5CB", "F1ECE3", "D29A82", "8E8981"
CARD_FILL, CARD_LINE = "17181A", "2E2F33"

S = [
    None,
    dict(tense="PRESENT SIMPLE", title="Space **gives** buildings purpose",
         expl="Walls **create** the shell, but empty space **creates** the experience. A courtyard **lets** in light and air, and a hall **brings** people together.",
         form="Subject + V1   (he / she / it + -s)", use="Facts, general truths, and things that are always true",
         ex="“An open courtyard **gives** a building room to breathe.”"),
    dict(tense="PRESENT CONTINUOUS", title="Movement **is bringing** the void to life",
         expl="Right now, people **are crossing** the bridge, and the light **is guiding** them through the space. The void **is changing** with every step.",
         form="am / is / are + V-ing", use="Actions happening now, at the moment of speaking",
         ex="“People **are moving** through the corridor toward the light.”"),
    dict(tense="PAST SIMPLE", title="Walls once **defined** an empty center",
         expl="In traditional courtyard houses, builders **placed** the rooms around an open center. The courtyard **became** the heart of family life.",
         form="V2   (regular -ed  /  irregular)", use="Finished actions at a finished time in the past",
         ex="“The architects **placed** walls around an open courtyard.”"),
    dict(tense="PAST CONTINUOUS", title="Light **was changing** the experience",
         expl="While visitors **were entering** the atrium, sunlight **was sliding** down the walls, and the space **was changing** every minute.",
         form="was / were + V-ing", use="An action in progress at a moment in the past",
         ex="“Sunlight **was entering** the atrium as visitors arrived.”"),
    dict(tense="PRESENT PERFECT SIMPLE", title="Open space **has created** connections",
         expl="Over the years, the courtyard **has connected** every room around it, and families **have shared** it for generations.",
         form="have / has + V3", use="A past action with a result we can see now",
         ex="“The courtyard **has connected** the rooms around it.”"),
    dict(tense="PRESENT PERFECT CONTINUOUS", title="People **have been gathering** in the void",
         expl="For years, neighbors **have been meeting** under this shade, and children **have been playing** in its open center.",
         form="have / has been + V-ing", use="An action that started in the past and is still continuing",
         ex="“Neighbors **have been meeting** in the sheltered space.”"),
    dict(tense="PAST PERFECT SIMPLE", title="The opening **had transformed** the room",
         expl="Before the light entered, the designers **had cut** a wide opening in the wall, and the dark room **had become** a frame for the view.",
         form="had + V3", use="An action completed before another past action",
         ex="“The designers **had cut** an opening before the light entered.”"),
    dict(tense="PAST PERFECT CONTINUOUS", title="A corridor **had been shaping** the journey",
         expl="Visitors **had been walking** through a narrow, dark corridor for minutes, so the vast hall felt even bigger when they finally reached it.",
         form="had been + V-ing", use="How long an action continued before a past moment",
         ex="“Visitors **had been walking** through a narrow corridor before they reached the vast hall.”"),
    dict(tense="FUTURE SIMPLE", title="Empty space **will shape** what comes next",
         expl="Future cities **will need** more open space, and architects **will design** voids as carefully as walls.",
         form="will + V1", use="Predictions and decisions about the future",
         ex="“Designers **will create** spaces where people can pause, meet, and move.”"),
]

NOTES = [
    ("Good morning, everyone. Today my topic is the architecture of empty space. We usually look at walls, columns, and roofs, but the most important part of a building is often the space between them. In this presentation, I will explain how designed voids shape the way we move, meet, and feel, and on each slide I will use one English tense, from the Present Simple to the Future.",
     "Overview: nine tenses, one per slide. Each slide shows the tense name, its form, its use, and an example about empty space.",
     "قدّم الموضوع بثقة: الفراغ عنصر معماري مصمَّم، وكل شريحة تشرح زمنًا واحدًا بمثال عن الفراغ."),
    ("Let's start with a general truth. Walls create the shell of a building, but empty space creates the experience. A courtyard lets in light and air, and a hall brings people together. This is the Present Simple. We use it for facts and general truths. The form is the subject plus the base verb, and we add -s with he, she, and it: an open courtyard gives a building room to breathe.",
     "Present Simple: Subject + V1 (he/she/it + -s). Use: facts, general truths. Target verbs: gives, create(s), lets, brings. Watch out: \"A courtyard let in light\" ✗ → \"lets\" ✓.",
     "المضارع البسيط للحقائق العامة: الفاعل + الفعل الأساسي، ونضيف s مع he / she / it."),
    ("Now look at this picture. Right now, people are crossing the bridge, and the light is guiding them through the space. The void is changing with every step. This is the Present Continuous. We use it for actions happening now. The form is am, is, or are plus the verb with -ing: people are moving through the corridor toward the light.",
     "Present Continuous: am/is/are + V-ing. Use: actions happening now. Target verbs: is bringing, are crossing, is guiding, is changing, are moving. Watch out: \"People moving\" ✗ → \"People are moving\" ✓.",
     "المضارع المستمر لما يحدث الآن: am / is / are + الفعل مع ing."),
    ("Now let's go back in time. In traditional courtyard houses, builders placed the rooms around an open center, and the courtyard became the heart of family life. This is the Past Simple. We use it for finished actions in the past. Regular verbs take -ed, like placed, and irregular verbs change, like became: the architects placed walls around an open courtyard.",
     "Past Simple: V2 (regular -ed / irregular). Use: finished past actions. Target verbs: defined, placed, became. Watch out: \"didn't placed\" ✗ → \"didn't place\" ✓.",
     "الماضي البسيط لحدث انتهى: الأفعال المنتظمة + ed، والشاذة تتغير مثل become ← became."),
    ("Imagine a morning in a large atrium. While visitors were entering, sunlight was sliding down the walls, and the space was changing every minute. This is the Past Continuous. We use it for an action in progress at a moment in the past, often with while or as. The form is was or were plus the -ing verb: sunlight was entering the atrium as visitors arrived.",
     "Past Continuous: was/were + V-ing. Use: an action in progress at a past moment (while / as). Target verbs: was changing, were entering, was sliding, was entering. Watch out: \"They was entering\" ✗ → \"They were entering\" ✓.",
     "الماضي المستمر لحدث كان جاريًا في لحظة ماضية: was / were + ing، وغالبًا مع while أو as."),
    ("Over the years, the courtyard has connected every room around it, and families have shared it for generations. This is the Present Perfect Simple. We use it for a past action with a result we can see now. The form is have or has plus the past participle: the courtyard has connected the rooms around it.",
     "Present Perfect Simple: have/has + V3. Use: past action, present result. Target verbs: has created, has connected, have shared. Watch out: no finished time — \"has connected in 1990\" ✗ → \"connected in 1990\" ✓.",
     "المضارع التام لحدث ماضٍ نتيجته واضحة الآن: have / has + التصريف الثالث."),
    ("This open space is still full of life. For years, neighbors have been meeting under this shade, and children have been playing in its open center. This is the Present Perfect Continuous. We use it for an action that started in the past and is still continuing. The form is have or has been plus the -ing verb: neighbors have been meeting in the sheltered space.",
     "Present Perfect Continuous: have/has been + V-ing. Use: started in the past, still continuing. Target verbs: have been gathering, have been meeting, have been playing. Watch out: \"are meeting since 2010\" ✗ → \"have been meeting since 2010\" ✓.",
     "المضارع التام المستمر لحدث بدأ في الماضي وما زال مستمرًا: have / has been + ing."),
    ("Look at this frame. Before the light entered, the designers had cut a wide opening in the wall, and the dark room had become a frame for the view. This is the Past Perfect Simple. We use it for an action completed before another past action. The form is had plus the past participle: the designers had cut an opening before the light entered.",
     "Past Perfect Simple: had + V3. Use: an action before another past action. Target verbs: had transformed, had cut, had become. Watch out: \"had became\" ✗ → \"had become\" ✓.",
     "الماضي التام لحدث سبق حدثًا ماضيًا آخر: had + التصريف الثالث."),
    ("Architects also play with contrast. Visitors had been walking through a narrow, dark corridor for minutes, so the vast hall felt even bigger when they finally reached it. This is the Past Perfect Continuous. We use it to show how long an action continued before a moment in the past. The form is had been plus the -ing verb: visitors had been walking through a narrow corridor before they reached the vast hall.",
     "Past Perfect Continuous: had been + V-ing. Use: duration before a past moment. Target verbs: had been shaping, had been walking. Watch out: \"had been walk\" ✗ → \"had been walking\" ✓.",
     "الماضي التام المستمر لمدة حدث استمر قبل لحظة ماضية: had been + ing."),
    ("Finally, the future. Future cities will need more open space, and architects will design voids as carefully as walls. This is the Future Simple. We use will plus the base verb for predictions and decisions about the future: designers will create spaces where people can pause, meet, and move. Thank you for listening. I will be happy to answer your questions.",
     "Future Simple: will + V1. Use: predictions and future decisions. Target verbs: will shape, will need, will design, will create, will be. Watch out: \"will to design\" ✗ → \"will design\" ✓.",
     "المستقبل البسيط: will + الفعل الأساسي للتنبؤ والقرارات المستقبلية."),
]


def runs_of(markup):
    out = []
    for k, part in enumerate(re.split(r"\*\*", markup)):
        if part:
            out.append((part, k % 2 == 1))
    return out


def set_text(shape, paras, font, size, color, hi_color=None, hi_bold=True, italic=False, align=PP_ALIGN.LEFT,
             line=1.0, spc=None, bold=False, anchor=MSO_ANCHOR.TOP):
    tf = shape.text_frame
    tf.clear()
    tf.word_wrap = True
    tf.auto_size = MSO_AUTO_SIZE.NONE
    tf.vertical_anchor = anchor
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    for i, para in enumerate(paras):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        p.line_spacing = line
        p.space_after = Pt(0)
        p.space_before = Pt(0)
        for text, hi in (para if isinstance(para, list) else runs_of(para)):
            r = p.add_run()
            r.text = text
            f = r.font
            f.name = font
            f.size = Pt(size)
            f.italic = italic
            f.bold = bold or (hi and hi_bold)
            f.color.rgb = RGBColor.from_string(hi_color if (hi and hi_color) else color)
            rpr = r._r.get_or_add_rPr()
            for tag in ("a:ea", "a:cs"):
                el = rpr.find(qn(tag))
                if el is None:
                    el = rpr.makeelement(qn(tag), {})
                    rpr.append(el)
                el.set("typeface", font)
            if spc is not None:
                rpr.set("spc", str(spc))


def textbox(slide, x, y, w, h, name):
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tb.name = name
    return tb


def place(sh, x, y, w, h):
    sh.left, sh.top, sh.width, sh.height = Inches(x), Inches(y), Inches(w), Inches(h)


def strip_motion(slide):
    sld = slide._element
    for child in list(sld):
        tag = child.tag.split("}")[-1]
        if tag in ("transition", "timing", "AlternateContent"):
            sld.remove(child)


prs = Presentation(SRC)
LAYOUT = {  # text column x, w ; card geometry ; mode
    "L": dict(x=0.6, w=4.85), "R": dict(x=8.05, w=4.7), "R8": dict(x=7.3, w=5.45),
}
kind = {2: "L", 3: "R", 4: "T", 5: "R", 6: "L", 7: "T", 8: "R8", 9: "L", 10: "L"}
report = {}
for idx, slide in enumerate(prs.slides, 1):
    strip_motion(slide)
    by = {sh.name: sh for sh in slide.shapes}
    if idx == 1:
        t, rule, tag = by["Text 0"], by["Shape 1"], by["Text 2"]
        t.name, rule.name, tag.name = "!!Title", "!!Rule", "tagline"
        kick = textbox(slide, 0.85, 2.35, 7.6, 0.3, "kicker")
        set_text(kick, ["UNIVERSITY ENGLISH  ·  NINE TENSES"], BODY, 12, C_ACC, bold=True, spc=300)
        place(t, 0.85, 2.8, 7.8, 2.2)
        set_text(t, ["The Architecture", "of Empty Space"], HEAD, 58, "FFFFFF", line=1.0)
        place(rule, 0.85, 5.3, 1.56, 0.01)
        place(tag, 0.85, 5.55, 7.2, 0.4)
        set_text(tag, ["Form. Movement. Possibility."], BODY, 20, C_SOFT)
        foot = textbox(slide, 0.85, 6.45, 6.0, 0.3, "footer")
        set_text(foot, ["[Your Name]  ·  [Course Name]  ·  [Date]"], BODY, 12, C_MUTE)
    else:
        d = S[idx - 1]
        t, ex_, rule, lab, ex = by["Text 0"], by["Text 1"], by["Shape 2"], by["Text 3"], by["Text 4"]
        pic = by["Image 0"]
        t.name, ex_.name, rule.name, lab.name, ex.name, pic.name = "!!Title", "expl", "!!Rule", "!!Label", "ex", "!!Photo"
        k = kind[idx]
        if k == "T":
            top = (pic.top + pic.height) / 914400 + 0.32
            colL, colW = 0.85, 5.75
            place(t, colL, top, colW, 1.0)
            place(ex_, colL, top + 1.12, colW, 1.6)
            cx, cw, cy, ch = 7.0, 5.75, top - 0.05, 2.95
        else:
            L = LAYOUT[k]
            colL, colW = L["x"], L["w"]
            place(t, colL, 0.6, colW, 1.45)
            place(ex_, colL, 2.32, colW, 1.45)
            cx, cw, cy, ch = colL, colW, 3.95, (2.6 if idx == 10 else 3.0)
        set_text(t, [d["title"]], HEAD, 30, C_TITLE, hi_color=C_ACC, hi_bold=False, line=1.0)
        set_text(ex_, [d["expl"]], BODY, 15, C_BODY, hi_color=C_TITLE, line=1.18)
        # grammar card
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(cx), Inches(cy), Inches(cw), Inches(ch))
        card.name = "!!Card"
        card.adjustments[0] = 0.05
        card.fill.solid(); card.fill.fore_color.rgb = RGBColor.from_string(CARD_FILL)
        card.line.color.rgb = RGBColor.from_string(CARD_LINE); card.line.width = Pt(0.75)
        card.shadow.inherit = False
        card.text_frame.text = ""
        tree = slide.shapes._spTree
        tree.remove(card._element)
        tree.insert(list(tree).index(rule._element), card._element)
        pad = 0.28
        place(rule, cx + pad, cy + pad, 1.1, 0.01)
        place(lab, cx + pad, cy + pad + 0.13, cw - 2 * pad, 0.26)
        set_text(lab, [d["tense"]], BODY, 12, C_ACC, bold=True, spc=200)
        form = textbox(slide, cx + pad, cy + pad + 0.5, cw - 2 * pad, 0.3, "form")
        set_text(form, [[("FORM   ", False), (d["form"], True)]], BODY, 14, C_MUTE, hi_color=C_SOFT, hi_bold=True)
        use = textbox(slide, cx + pad, cy + pad + 0.86, cw - 2 * pad, 0.52, "use")
        set_text(use, [[("USE   ", False), (d["use"], True)]], BODY, 14, C_MUTE, hi_color=C_SOFT, hi_bold=False, line=1.1)
        exh = ch - (pad + 1.48) - pad
        place(ex, cx + pad, cy + pad + 1.48, cw - 2 * pad, exh)
        set_text(ex, [d["ex"]], HEAD, 16, C_SOFT, hi_color=C_ACC, italic=True, line=1.12)
        if idx == 10:
            thx = textbox(slide, colL, 6.78, colW, 0.3, "thanks")
            set_text(thx, ["THANK YOU  ·  QUESTIONS?"], BODY, 12, C_ACC, bold=True, spc=300)
        report[idx] = dict(kind=k, card=[round(cx, 2), round(cy, 2), round(cw, 2), round(ch, 2)])
    s, g, a = NOTES[idx - 1]
    slide.notes_slide.notes_text_frame.text = f"SCRIPT (say this):\n{s}\n\nGRAMMAR:\n{g}\n\nبالعربي:\n{a}"

prs.save(DST)
print(json.dumps(report))

"""Topic-focused rewrite of the uploaded deck: richer content, 1-2 tenses per slide, safe fonts, no overlaps."""
import re, sys, json
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import MSO_AUTO_SIZE, MSO_ANCHOR, PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml.ns import qn

SRC, DST, SPEC = sys.argv[1], sys.argv[2], sys.argv[3]
HEAD, BODY = "Georgia", "Arial"
C_TITLE, C_BODY, C_SOFT, C_ACC, C_MUTE = "F4F0E7", "DAD5CB", "F1ECE3", "D29A82", "8E8981"

D = [None,
 dict(tag="PRESENT SIMPLE", title="Space gives buildings purpose",
  para="We often think of architecture as walls, columns, and roofs, but people never live inside a wall. They live in the space between walls. A room exists because of its emptiness, and a good architect designs that emptiness first. The void decides where light falls, how air moves, and where people stop to talk.",
  pts=["**Courtyards** bring light and fresh air into the heart of a building.",
       "**Halls and squares** give people a place to gather and share.",
       "**Pauses and gaps** give the eye a rest and make a design feel calm."],
  quote="“We shape the walls, but we live in the space.”"),
 dict(tag="PRESENT CONTINUOUS", title="Movement brings a void to life",
  para="Look at this space right now. People are crossing the bridge, light is falling through the round opening, and the stairs are pulling our eyes upward. Nothing here is still. The void is acting like a stage, and the people who are moving through it are performing every second.",
  pts=["**Bridges and stairs** are turning an empty volume into a journey.",
       "**Light from above** is guiding people forward without any signs.",
       "**Every visitor** is adding the missing element: life."],
  quote="“Empty space is not waiting. It is working.”"),
 dict(tag="PAST SIMPLE", title="Walls once defined an empty center",
  para="For thousands of years, families built their homes around an open courtyard. The rooms faced inward, and thick outer walls kept out the heat and the noise of the street. The courtyard became the heart of daily life: children played there, people cooked and talked there, and on summer nights the family slept on the roof under the open sky.",
  pts=["**Traditional houses** in Baghdad, Damascus, and Marrakesh grew around a courtyard.",
       "**Thick outer walls** protected privacy and kept the heat outside.",
       "**The open center** gave every room light, air, and a view of the sky."],
  quote="“The walls were the frame, but the courtyard was the home.”"),
 dict(tag="PAST CONTINUOUS", title="Light was changing the experience",
  para="When the first visitors entered this atrium, the sun was rising behind the high walls. A narrow beam was sliding slowly across the stone, the shadows were getting shorter, and the colors were changing from grey to warm orange. Nobody spoke. Everyone was watching the light move through the empty space.",
  pts=["**High openings** were catching the morning sun and sending it deep inside.",
       "**Plain stone walls** were reflecting the light and making it softer.",
       "**The empty floor** was turning into a giant sundial."],
  quote="“The room was empty, but the light was telling a story.”"),
 dict(tag="PRESENT PERFECT", title="Open space has created connections",
  para="For generations, open spaces like this courtyard have connected the rooms around them. They have given families a shared place to meet and have turned separate buildings into a small community. Many modern architects have brought this idea back into schools, hospitals, and offices.",
  pts=["**Open galleries** have linked every floor to the same central space.",
       "**Shared courtyards** have made neighbors part of one another’s daily life.",
       "**Modern designers** have used voids to replace long, dark corridors."],
  quote="“The space between the rooms has become the most important room.”"),
 dict(tag="PRESENT PERFECT CONTINUOUS", title="People have been gathering in the void",
  para="Since this shaded space opened, people have been gathering here every evening. Neighbors have been meeting under the trees, children have been playing in the open center, and older people have been sitting along the walls, watching the city go by. The architecture has been doing its job quietly for years.",
  pts=["**Shade and trees** have been keeping the space cool and inviting.",
       "**Open edges** have been welcoming people in from the street.",
       "**Simple benches and steps** have been turning visitors into neighbors."],
  quote="“This void has been filling with life every single day.”"),
 dict(tag="PAST PERFECT", title="The opening had transformed the room",
  para="Before the architects cut this huge opening, the room had been a dark, closed box. By the time the first visitors arrived, the opening had turned the wall into a giant picture frame, and the cliffs, the water, and the sky had become part of the room. Visitors felt that the landscape had walked inside.",
  pts=["**The frame** had removed the border between inside and outside.",
       "**The view** had changed from a background into the main subject.",
       "**One single cut** had given a closed room a new purpose."],
  quote="“Before the opening, it was a wall. After it, it was a view.”"),
 dict(tag="PAST PERFECT CONTINUOUS", title="A corridor had been shaping the journey",
  para="The visitors had been walking through this long, narrow corridor for several minutes. The walls had been pressing in on both sides, and only a thin line of light had been guiding them forward. So when they finally stepped into the vast hall, the space felt enormous, and many of them stopped and looked up in silence.",
  pts=["**The narrow walls** had been preparing visitors for a surprise.",
       "**The dim light** had been sharpening their senses.",
       "**The vast hall** felt even bigger because of the journey before it."],
  quote="“The journey made the destination unforgettable.”"),
 dict(tag="FUTURE · WILL / GOING TO", title="Empty space will shape what comes next",
  para="As cities grow taller and more crowded, empty space will become the most valuable material in architecture. Architects are going to design towers with gardens in the sky, homes with open courtyards, and streets that belong to people instead of cars. The buildings of the future will be the ones with the most meaningful space.",
  pts=["**Sky gardens** will bring air and green life to tall buildings.",
       "**Shared courtyards** are going to return to new neighborhoods.",
       "**Open public spaces** will make crowded cities feel human again."],
  quote="“Next time you enter a building, don’t look at the walls. Look at the space.”"),
]

SCRIPTS = [
 ("Good morning, everyone. My topic today is the architecture of empty space. When we look at a building, we usually notice the walls, the columns, and the roof. But every building begins with emptiness. The walls simply give that emptiness a shape, and that shape decides how we move, how we meet, and how we feel inside. In the next few minutes, I want to show you why the empty space is often the most important part of architecture.", "Present Simple"),
 ("We often think of architecture as walls and roofs, but people never live inside a wall. They live in the space between walls. A room exists because of its emptiness, and a good architect designs that emptiness first. The void decides where light falls, how air moves, and where people stop to talk. A courtyard brings light and fresh air into the heart of a building. A hall or a square gives people a place to gather. And small pauses and gaps give the eye a rest, so a design feels calm. In short, we shape the walls, but we live in the space.", "Present Simple"),
 ("Now look at this picture. Right now, people are crossing the bridge, light is falling through the round opening, and the stairs are pulling our eyes upward. Nothing here is still. The void is acting like a stage, and the people who are moving through it are performing every second. The bridges and stairs are turning an empty volume into a journey, and the light from above is guiding people forward without any signs. So this empty space is not waiting. It is working.", "Present Continuous (with Present Simple)"),
 ("Now let's go back in history. For thousands of years, families built their homes around an open courtyard. The rooms faced inward, and the thick outer walls kept out the heat and the noise of the street. The courtyard became the heart of daily life. Children played there, people cooked and talked there, and on summer nights the family slept on the roof under the open sky. Traditional houses in Baghdad, Damascus, and Marrakesh grew around this idea. The walls were the frame, but the courtyard was the home.", "Past Simple"),
 ("Imagine the first morning in this atrium. When the first visitors entered, the sun was rising behind the high walls. A narrow beam of light was sliding slowly across the stone, the shadows were getting shorter, and the colors were changing from grey to warm orange. Nobody spoke. Everyone was watching the light move through the empty space. The high openings were catching the sun, and the plain walls were reflecting it softly. The room was empty, but the light was telling a story.", "Past Continuous (with Past Simple)"),
 ("For generations, open spaces like this courtyard have connected the rooms around them. They have given families a shared place to meet, and they have turned separate buildings into a small community. Open galleries have linked every floor to the same central space. Today, many modern architects have rediscovered this idea, and they have brought courtyards back into schools, hospitals, and offices. In many buildings, the space between the rooms has become the most important room.", "Present Perfect"),
 ("This shaded space is still full of life. Since it opened, people have been gathering here every evening. Neighbors have been meeting under the trees, children have been playing in the open center, and older people have been sitting along the walls, watching the city go by. The shade and the trees have been keeping the space cool, and the open edges have been welcoming people in from the street. For years, this architecture has been doing its job quietly: it has been turning visitors into neighbors.", "Present Perfect Continuous"),
 ("Before the architects cut this huge opening, the room had been a dark, closed box. By the time the first visitors arrived, the opening had turned the wall into a giant picture frame. The cliffs, the water, and the sky had become part of the room. One single cut had removed the border between inside and outside, and the view had changed from a background into the main subject. Before the opening, it was a wall. After it, it was a view.", "Past Perfect (with Past Simple)"),
 ("In this building, the visitors had been walking through a long, narrow corridor for several minutes. The walls had been pressing in on both sides, and only a thin line of light had been guiding them forward. So when they finally stepped into the vast hall, the space felt enormous. Many of them stopped and looked up in silence. The narrow walls had been preparing them for that surprise, and the journey made the destination unforgettable.", "Past Perfect Continuous (with Past Simple)"),
 ("Finally, let's look to the future. As cities grow taller and more crowded, empty space will become the most valuable material in architecture. Architects are going to design towers with gardens in the sky, homes with open courtyards, and streets that belong to people instead of cars. Sky gardens will bring air and green life to tall buildings, and open public spaces will make crowded cities feel human again. The buildings of the future will be the ones with the most meaningful space. So next time you enter a building, don't look at the walls. Look at the space. Thank you, and I will be happy to answer your questions.", "Future (will / going to)"),
]


def runs_of(markup):
    return [(p, k % 2 == 1) for k, p in enumerate(re.split(r"\*\*", markup)) if p]


def set_text(shape, paras, font, size, color, hi_color=None, italic=False, line=1.0, spc=None, bold=False, align=PP_ALIGN.LEFT):
    tf = shape.text_frame
    tf.clear(); tf.word_wrap = True; tf.auto_size = MSO_AUTO_SIZE.NONE; tf.vertical_anchor = MSO_ANCHOR.TOP
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    for i, para in enumerate(paras):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align; p.line_spacing = line; p.space_after = Pt(0); p.space_before = Pt(0)
        for text, hi in runs_of(para):
            r = p.add_run(); r.text = text
            f = r.font; f.name = font; f.size = Pt(size); f.italic = italic
            f.bold = bold or hi
            f.color.rgb = RGBColor.from_string(hi_color if (hi and hi_color) else color)
            rpr = r._r.get_or_add_rPr()
            for tag in ("a:ea", "a:cs"):
                el = rpr.find(qn(tag))
                if el is None:
                    el = rpr.makeelement(qn(tag), {}); rpr.append(el)
                el.set("typeface", font)
            if spc is not None:
                rpr.set("spc", str(spc))


def textbox(slide, x, y, w, h, name):
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h)); tb.name = name; return tb


def place(sh, x, y, w, h):
    sh.left, sh.top, sh.width, sh.height = Inches(x), Inches(y), Inches(w), Inches(h)


def diamond(slide, x, y, name):
    d = slide.shapes.add_shape(MSO_SHAPE.DIAMOND, Inches(x), Inches(y), Inches(0.11), Inches(0.11))
    d.name = name; d.fill.solid(); d.fill.fore_color.rgb = RGBColor.from_string(C_ACC); d.line.fill.background(); d.shadow.inherit = False
    return d


prs = Presentation(SRC)
COL = {2: (0.6, 4.85), 3: (8.05, 4.7), 5: (8.05, 4.7), 6: (0.6, 4.85), 8: (7.3, 5.45), 9: (0.6, 4.85), 10: (0.6, 4.85)}
SIDE = {2: "L", 3: "R", 4: "T", 5: "R", 6: "L", 7: "T", 8: "R", 9: "L", 10: "L"}
spec = []
for idx, slide in enumerate(prs.slides, 1):
    sld = slide._element
    for child in list(sld):
        if child.tag.split("}")[-1] in ("transition", "timing", "AlternateContent"):
            sld.remove(child)
    by = {sh.name: sh for sh in slide.shapes}
    if idx == 1:
        t, rule, tag = by["Text 0"], by["Shape 1"], by["Text 2"]
        t.name, rule.name, tag.name = "title", "rule", "tagline"
        kick = textbox(slide, 0.85, 2.1, 7.6, 0.3, "kicker")
        set_text(kick, ["UNIVERSITY ENGLISH  ·  ARCHITECTURE"], BODY, 12, C_ACC, bold=True, spc=300)
        place(t, 0.85, 2.5, 7.8, 2.05); set_text(t, ["The Architecture", "of Empty Space"], HEAD, 58, "FFFFFF")
        place(rule, 0.85, 4.75, 1.56, 0.01)
        place(tag, 0.85, 4.97, 7.2, 0.4); set_text(tag, ["Form. Movement. Possibility."], BODY, 20, C_SOFT)
        intro = textbox(slide, 0.85, 5.5, 6.3, 0.75, "intro")
        set_text(intro, ["Every building begins with emptiness. Walls and roofs simply give it a shape, and that shape decides how we move, meet, and feel inside."], BODY, 15, C_BODY, line=1.15)
        foot = textbox(slide, 0.85, 6.78, 6.0, 0.3, "footer")
        set_text(foot, ["[Your Name]  ·  [Course Name]  ·  [Date]"], BODY, 12, C_MUTE)
        spec.append({"slide": 1, "transition": {"type": "fade", "dur": 1000}, "effects": [
            {"t": 0.2, "eff": "fade", "dur": 0.7, "targets": ["kicker"]},
            {"t": 0.4, "eff": "floatUp", "dur": 1.0, "targets": ["title"]},
            {"t": 1.2, "eff": "wipeL", "dur": 0.7, "targets": ["rule"]},
            {"t": 1.4, "eff": "floatUp", "dur": 0.8, "targets": ["tagline"]},
            {"t": 1.8, "eff": "floatUp", "dur": 0.9, "targets": ["intro"]},
            {"t": 2.5, "eff": "fade", "dur": 0.8, "targets": ["footer"]}]})
    else:
        d = D[idx - 1]
        t, para, rule, lab, quote, pic = by["Text 0"], by["Text 1"], by["Shape 2"], by["Text 3"], by["Text 4"], by["Image 0"]
        t.name, para.name, rule.name, lab.name, quote.name, pic.name = "title", "para", "rule", "label", "quote", "!!Photo"
        side = SIDE[idx]
        if side == "T":
            top = (pic.top + pic.height) / 914400 + 0.3
            lx, lw, rx, rw = 0.85, 5.75, 7.0, 5.6
            place(rule, lx, top, 1.1, 0.01); place(lab, lx, top + 0.11, lw, 0.26)
            place(t, lx, top + 0.45, lw, 0.95); place(para, lx, top + 1.5, lw, 1.6)
            py, prx, prw, qy = top + 0.05, rx, rw, top + 2.05
        else:
            x, w = COL[idx]
            place(rule, x, 0.55, 1.1, 0.01); place(lab, x, 0.66, w, 0.26)
            place(t, x, 1.02, w, 1.3); place(para, x, 2.38, w, 1.58)
            py, prx, prw, qy = 4.24, x, w, 6.2
        set_text(lab, [d["tag"]], BODY, 11.5, C_ACC, bold=True, spc=200)
        set_text(t, [d["title"]], HEAD, 28, C_TITLE)
        set_text(para, [d["para"]], BODY, 13.5, C_BODY, line=1.12)
        pnames = []
        for k, ptxt in enumerate(d["pts"]):
            yy = py + k * 0.6
            diamond(slide, prx, yy + 0.07, f"dot{k + 1}")
            tb = textbox(slide, prx + 0.28, yy, prw - 0.28, 0.58, f"pt{k + 1}")
            set_text(tb, [ptxt], BODY, 13, C_BODY, hi_color=C_TITLE, line=1.1)
            pnames.append([f"dot{k + 1}", f"pt{k + 1}"])
        place(quote, prx, qy, prw, 0.62)
        set_text(quote, [d["quote"]], HEAD, 15, C_ACC, italic=True, line=1.1)
        slide_in = "slideFromR" if side == "R" else "slideFromL"
        eff = [{"t": 0.0, "eff": "breathe", "dur": 12, "targets": ["!!Photo"], "opts": {"scale": 104}},
               {"t": 0.15, "eff": "wipeL", "dur": 0.5, "targets": ["rule"]},
               {"t": 0.25, "eff": "fade", "dur": 0.6, "targets": ["label"]},
               {"t": 0.45, "eff": "floatUp", "dur": 0.9, "targets": ["title"]},
               {"t": 0.95, "eff": "floatUp", "dur": 0.8, "targets": ["para"]}]
        for k, (dn, pn) in enumerate(pnames):
            eff.append({"t": 1.5 + k * 0.32, "eff": "zoomIn", "dur": 0.35, "targets": [dn]})
            eff.append({"t": 1.5 + k * 0.32, "eff": slide_in, "dur": 0.7, "targets": [pn]})
        eff.append({"t": 2.6, "eff": "floatUp", "dur": 0.9, "targets": ["quote"]})
        if idx == 10:
            thx = textbox(slide, prx, 6.92, prw, 0.26, "thanks")
            set_text(thx, ["THANK YOU  ·  QUESTIONS?"], BODY, 12, C_MUTE, bold=True, spc=300)
            eff.append({"t": 3.3, "eff": "fade", "dur": 0.8, "targets": ["thanks"]})
        spec.append({"slide": idx, "transition": {"type": "morph", "dur": 1200}, "effects": eff})
    s, tense = SCRIPTS[idx - 1]
    slide.notes_slide.notes_text_frame.text = f"SCRIPT (say this):\n{s}\n\nTense used on this slide: {tense}"

prs.save(DST)
json.dump(spec, open(SPEC, "w"), indent=1)
print("ok")

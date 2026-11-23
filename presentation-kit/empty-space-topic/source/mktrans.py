"""Hand-built transitions (no PowerPoint transition presets): each slide opens with a snapshot of the previous slide's
final state, then custom overlay shapes cover it and reveal the new slide. Writes the deck + the animation spec.
usage: mktrans.py edited8.pptx out.pptx spec_out.json [snapdir]"""
import sys, os, json, math
from lxml import etree
from pptx import Presentation
from pptx.util import Inches, Emu
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml.ns import qn

SRC, DST, SPECF = sys.argv[1:4]
SNAP = sys.argv[4] if len(sys.argv) > 4 else None
W, H = 13.333, 7.5
INK, PANEL, PANEL2, TERRA, LIGHT = "0B0B0C", "151517", "1D1D20", "D29A82", "FFF4E4"
A = "http://schemas.openxmlformats.org/drawingml/2006/main"
prs = Presentation(SRC)

def rect(sl, x, y, w, h, name, fill, geom=MSO_SHAPE.RECTANGLE, ang=90, rot=0):
    sh = sl.shapes.add_shape(geom, Inches(x), Inches(y), Inches(w), Inches(h))
    sh.name = name; sh.line.fill.background(); sh.shadow.inherit = False
    if rot: sh.rotation = rot
    if isinstance(fill, str):
        sh.fill.solid(); sh.fill.fore_color.rgb = RGBColor.from_string(fill)
    else:  # gradient: [(pos%, hex, alpha%)]
        spPr = sh._element.spPr
        for tag in ("a:solidFill", "a:gradFill", "a:noFill"):
            for e in spPr.findall(qn(tag)): spPr.remove(e)
        gs = "".join(f'<a:gs pos="{int(p * 1000)}"><a:srgbClr val="{c}"><a:alpha val="{int(al * 1000)}"/></a:srgbClr></a:gs>' for p, c, al in fill)
        g = etree.fromstring(f'<a:gradFill xmlns:a="{A}" rotWithShape="1"><a:gsLst>{gs}</a:gsLst><a:lin ang="{int(ang * 60000)}" scaled="0"/></a:gradFill>')
        spPr.insert(list(spPr).index(spPr.find(qn("a:prstGeom"))) + 1, g)
    tf = sh.text_frame; tf.text = ""
    return sh

def snapshot(sl, k, name="snap", poly=None):
    pic = sl.shapes.add_picture(os.path.join(SNAP, f"snap_{k}.jpg"), 0, 0, Inches(W), Inches(H))
    pic.name = name
    if poly:
        spPr = pic._element.spPr; pg = spPr.find(qn("a:prstGeom"))
        pts = "".join((f'<a:moveTo><a:pt x="{int(x * 100000)}" y="{int(y * 100000)}"/></a:moveTo>' if i == 0 else
                       f'<a:lnTo><a:pt x="{int(x * 100000)}" y="{int(y * 100000)}"/></a:lnTo>') for i, (x, y) in enumerate(poly))
        cg = etree.fromstring(f'<a:custGeom xmlns:a="{A}"><a:avLst/><a:gdLst/><a:ahLst/><a:cxnLst/><a:rect l="0" t="0" r="r" b="b"/>'
                              f'<a:pathLst><a:path w="100000" h="100000">{pts}<a:close/></a:path></a:pathLst></a:custGeom>')
        pg.addprevious(cg); spPr.remove(pg)
    return pic

import copy
P = "http://schemas.openxmlformats.org/presentationml/2006/main"
_nid = [3000]
def copy_prev(src, dst, bg):
    """Native copy of the previous slide's final state (same shapes, photo at its final 103% zoom), grouped as 'prev'.
    PowerPoint renders it exactly like the previous slide, so the cut between slides is invisible."""
    e = lambda v: str(int(round(v * 914400)))
    grp = etree.fromstring(f'<p:grpSp xmlns:p="{P}" xmlns:a="{A}"><p:nvGrpSpPr><p:cNvPr id="{_nid[0]}" name="prev"/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>'
                           f'<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="{e(W)}" cy="{e(H)}"/><a:chOff x="0" y="0"/><a:chExt cx="{e(W)}" cy="{e(H)}"/></a:xfrm></p:grpSpPr>'
                           f'<p:sp><p:nvSpPr><p:cNvPr id="{_nid[0] + 1}" name="c_bg"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="0" y="0"/>'
                           f'<a:ext cx="{e(W)}" cy="{e(H)}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="{bg}"/></a:solidFill>'
                           f'<a:ln><a:noFill/></a:ln></p:spPr></p:sp></p:grpSp>')
    _nid[0] += 2
    for el in src.shapes._spTree:
        tag = etree.QName(el).localname
        if tag not in ("sp", "pic", "grpSp", "cxnSp"):
            continue
        nm = el.find(".//" + qn("p:cNvPr")).get("name")
        if nm.startswith(("tr_", "snap", "prev")):
            continue
        c = copy.deepcopy(el)
        for cnv in c.iter(qn("p:cNvPr")):
            cnv.set("id", str(_nid[0])); cnv.set("name", "c_" + cnv.get("name")); _nid[0] += 1
            for h in list(cnv): cnv.remove(h)
        for blip in c.iter(qn("a:blip")):
            part = src.part.related_part(blip.get(qn("r:embed")))
            blip.set(qn("r:embed"), dst.part.relate_to(part, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image"))
        if nm == "photo":  # final state of the Ken Burns zoom
            xf = c.find(qn("p:spPr")).find(qn("a:xfrm")); off, ext = xf.find(qn("a:off")), xf.find(qn("a:ext"))
            x, y, w, h = (int(off.get("x")), int(off.get("y")), int(ext.get("cx")), int(ext.get("cy")))
            off.set("x", str(int(x - w * 0.015))); off.set("y", str(int(y - h * 0.015))); ext.set("cx", str(int(w * 1.03))); ext.set("cy", str(int(h * 1.03)))
        grp.append(c)
    tree = dst.shapes._spTree; ext_ = tree.find(qn("p:extLst"))
    (ext_.addprevious(grp) if ext_ is not None else tree.append(grp))

def bgcolor(sl):
    c = sl._element.find(".//" + qn("p:bg") + "//" + qn("a:srgbClr"))
    return c.get("val") if c is not None else "101112"

E = lambda t, eff, dur, tg, **o: dict(t=round(t, 3), eff=eff, dur=dur, targets=tg if isinstance(tg, list) else [tg], **({"opts": o} if o else {}))
slides = list(prs.slides)
spec = []

# ---------- content motion (same choreography as before, shifted after each custom transition)
LETTER = lambda t, tg, d=0.5, pct=6: dict(E(t, "floatUp", d, tg, off=0.03), iter=["lt", pct])
def content(n, s):
    if n == 1:
        return ([E(s + 0.15, "filter", 1.4, "frame", filter="plus(out)", preset=13, sub=32),
                 dict(E(s + 0.8, "fade", 0.3, "nkicker"), iter=["lt", 10]),
                 E(s + 1.15, "basicZoom", 0.9, "nhead"), E(s + 1.75, "split", 0.6, "nrule")] +
                [E(s + 2.0 + k * 0.28, "slideFromR", 0.8, f"n{k + 1}", off=0.05) for k in range(5)])
    if n == 2:
        return [E(s, "expandIn", 2.6, "photo", **{"from": 1.06}), E(s + 2.6, "kenBurns", 10, "photo", scale=103),
                dict(E(s + 0.5, "fade", 0.25, "kicker"), iter=["lt", 8]), LETTER(s + 0.9, "title", 0.55, 7),
                E(s + 2.5, "wipeL", 0.7, "rule"), dict(E(s + 2.7, "fade", 0.6, "tagline"), iter=["wd", 60]),
                E(s + 3.6, "floatUp", 0.9, "intro")]
    flt = {3: ("diamond(out)", 8, 32), 4: ("checkerboard(across)", 5, 10), 5: ("wheel(1)", 21, 1),
           6: ("plus(out)", 13, 32), 7: ("barn(outHorizontal)", 16, 42), 8: ("dissolve", 9, 0)}[n]
    eff = [E(s, "filter", 2.0, "photo", filter=flt[0], preset=flt[1], sub=flt[2]), E(s + 2.0, "kenBurns", 10, "photo", scale=103),
           E(s + 0.2, "wipeL", 0.6, "rule"), LETTER(s + 0.35, "title"), dict(E(s + 1.35, "fade", 0.45, "para"), iter=["wd", 9])]
    for k in range(3):
        eff += [E(s + 2.5 + k * 0.35, "spinZoom", 0.5, f"dot{k + 1}"), E(s + 2.6 + k * 0.35, "wipeL", 0.7, f"pt{k + 1}", fade=True)]
    eff.append(E(s + 3.9, "basicZoom", 0.9, "quote", **{"from": 0.9}))
    if n == 8:
        eff.append(dict(E(s + 4.7, "fade", 0.3, "thanks"), iter=["lt", 8]))
    return eff

# ---------- custom transitions
def t1_light_slit(sl):
    rect(sl, 0, 0, W, H / 2 + 0.02, "tr_top", INK); rect(sl, 0, H / 2 - 0.02, W, H / 2 + 0.02, "tr_bot", INK)
    rect(sl, 0, H / 2 - 0.55, W, 1.1, "tr_glow", [(0, "F2C9A8", 0), (50, "F2C9A8", 45), (100, "F2C9A8", 0)])
    rect(sl, 0, H / 2 - 0.016, W, 0.032, "tr_line", "FFF8EE")
    return [E(0.15, "growIn", 0.75, "tr_glow", sx=0.002, sy=0.3), E(0.15, "growIn", 0.75, "tr_line", sx=0.002, sy=1),
            E(0.95, "moveOut", 0.95, "tr_top", dy=-0.52), E(0.95, "moveOut", 0.95, "tr_bot", dy=0.52),
            E(0.95, "scaleTo", 0.8, "tr_glow", x=1, y=4), E(1.0, "exitFade", 0.7, ["tr_line", "tr_glow"])], 1.7

def t2_doorway(sl):
    dw, dh = 2.0, 4.6
    rect(sl, (W - dw) / 2, (H - dh) / 2, dw, dh, "tr_door", [(0, "FFF9EF", 100), (50, LIGHT, 100), (100, "F3DFC4", 100)], ang=0)
    return [E(0.05, "growIn", 0.55, "tr_door", sx=0.01, sy=1), E(0.62, "scaleTo", 0.6, "tr_door", x=W / dw * 1.06, y=H / dh * 1.08),
            E(1.24, "hide", 0.01, "prev"), E(1.28, "exitFade", 0.7, "tr_door")], 1.75

def t3_columns(sl):
    n, eff = 6, []
    for i in range(n):
        top = i % 2 == 0
        g = [(0, PANEL, 100), (97.6, PANEL, 100), (97.7, TERRA, 100), (100, TERRA, 100)] if top else \
            [(0, TERRA, 100), (2.3, TERRA, 100), (2.4, PANEL2, 100), (100, PANEL2, 100)]
        rect(sl, i * W / n - 0.01, 0, W / n + 0.02, H, f"tr_col{i}", g)
        eff += [E(0.0 + i * 0.06, "moveIn", 0.55, f"tr_col{i}", dy=-1.0 if top else 1.0),
                E(0.98 + i * 0.06, "moveOut", 0.6, f"tr_col{i}", dy=1.0 if top else -1.0)]
    return eff + [E(0.92, "hide", 0.01, "prev")], 1.85

def t4_four_walls(sl):
    c = 0.9  # half size of the open courtyard left in the middle
    rect(sl, 0, 0, W / 2 - c + 0.01, H, "tr_wl", PANEL); rect(sl, W / 2 + c - 0.01, 0, W / 2 - c + 0.01, H, "tr_wr", PANEL)
    rect(sl, 0, 0, W, H / 2 - c + 0.01, "tr_wt", PANEL2); rect(sl, 0, H / 2 + c - 0.01, W, H / 2 - c + 0.01, "tr_wb", PANEL2)
    rect(sl, W / 2 - c - 0.02, H / 2 - c - 0.02, 2 * c + 0.04, 2 * c + 0.04, "tr_court", [(0, "FFF9EF", 100), (100, "E8C3A6", 100)], ang=45)
    eff = [E(0.0, "moveIn", 0.6, "tr_wl", dx=-0.5), E(0.0, "moveIn", 0.6, "tr_wr", dx=0.5),
           E(0.08, "moveIn", 0.6, "tr_wt", dy=-0.5), E(0.08, "moveIn", 0.6, "tr_wb", dy=0.5),
           E(0.5, "zoomIn", 0.3, "tr_court"), E(0.82, "hide", 0.01, "prev"),
           E(0.95, "moveOut", 0.65, "tr_wl", dx=-0.5), E(0.95, "moveOut", 0.65, "tr_wr", dx=0.5),
           E(0.95, "moveOut", 0.65, "tr_wt", dy=-0.5), E(0.95, "moveOut", 0.65, "tr_wb", dy=0.5),
           E(0.95, "scaleTo", 0.65, "tr_court", x=9, y=9), E(1.05, "exitFade", 0.5, "tr_court")]
    return eff, 1.6

def t5_light_sweep(sl):
    bw = 44.0
    rect(sl, -bw - 0.5, 0, bw, H, "tr_band", [(0, LIGHT, 0), (18, LIGHT, 100), (82, LIGHT, 100), (100, LIGHT, 0)],
         geom=MSO_SHAPE.PARALLELOGRAM, ang=0)
    travel = (bw + 0.5 + W + 2.5) / W
    return [E(0.0, "path", 1.9, "tr_band", path=f"M 0 0 L {travel:.4f} 0 E", smooth=True), E(0.95, "hide", 0.01, "prev")], 1.75

def t6_grid(sl):
    cols, rows, eff = 8, 5, []
    tw, th = W / cols, H / rows
    md = math.hypot(cols / 2, rows / 2)
    for r in range(rows):
        for c in range(cols):
            nm = f"tr_g{r}{c}"
            rect(sl, c * tw - 0.01, r * th - 0.01, tw + 0.02, th + 0.02, nm, TERRA if (r, c) in ((2, 3), (2, 4)) else (PANEL if (r + c) % 2 else PANEL2))
            d = math.hypot(c + 0.5 - cols / 2, r + 0.5 - rows / 2) / md
            eff += [E(d * 0.45, "zoomIn", 0.35, nm), E(0.92 + d * 0.45, "shrinkOut", 0.35, nm)]
    return eff + [E(0.84, "hide", 0.01, "prev")], 1.7

def t7_the_cut(sl, k):
    p0, p1 = (8.4, -0.2), (4.9, 7.7)
    xt = p0[0] + (0 - p0[1]) * (p1[0] - p0[0]) / (p1[1] - p0[1]); xb = p0[0] + (H - p0[1]) * (p1[0] - p0[0]) / (p1[1] - p0[1])
    if SNAP:
        snapshot(sl, k, "snapA", [(0, 0), (xt / W, 0), (xb / W, 1), (0, 1)])
        snapshot(sl, k, "snapB", [(xt / W, 0), (1, 0), (1, 1), (xb / W, 1)])
    L = math.hypot(p1[0] - p0[0], p1[1] - p0[1]) + 0.3; cx, cy = (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2
    ang = math.degrees(math.atan2(p0[1] - p1[1], p0[0] - p1[0]))
    rect(sl, cx - L / 2, cy - 0.025, L, 0.05, "tr_cut", TERRA, rot=ang % 360)
    dx, dy = p0[0] - p1[0], p0[1] - p1[1]; ln = math.hypot(dx, dy); nx, ny = -dy / ln, dx / ln  # normal (right-down)
    k_ = 9.5
    eff = [E(0.05, "wipeL", 0.4, "tr_cut"), E(0.52, "exitFade", 0.35, "tr_cut")]
    if SNAP:
        eff += [E(0.49, "appear", 0.01, ["snapA", "snapB"]),
                E(0.5, "moveOut", 0.85, "snapA", dx=round(-nx * k_ / W, 4), dy=round(-ny * k_ / H, 4)),
                E(0.5, "moveOut", 0.85, "snapB", dx=round(nx * k_ / W, 4), dy=round(ny * k_ / H, 4))]
    eff += [E(0.5, "hide", 0.01, "prev")]
    return eff, 1.3

def t8_skyline(sl):
    widths = [0.09, 0.13, 0.10, 0.14, 0.08, 0.12, 0.11, 0.13, 0.10]
    delays = [0.10, 0.0, 0.18, 0.05, 0.22, 0.08, 0.15, 0.02, 0.12]
    x, eff = 0.0, []
    for i, (wf, dl) in enumerate(zip(widths, delays)):
        base = PANEL if i % 2 else PANEL2
        rect(sl, x * W - 0.01, 0, wf * W + 0.02, H, f"tr_b{i}", [(0, TERRA, 100), (1.6, TERRA, 100), (1.7, base, 100), (100, base, 100)])
        eff += [E(dl, "moveIn", 0.6, f"tr_b{i}", dy=1.0), E(0.98 + dl, "moveOut", 0.6, f"tr_b{i}", dy=-1.0)]
        x += wf
    return eff + [E(0.86, "hide", 0.01, "prev")], 1.75

TR = {1: (t1_light_slit, "c_slit"), 2: (t2_doorway, "c_door"), 3: (t3_columns, "c_columns"), 4: (t4_four_walls, "c_walls"),
      5: (t5_light_sweep, "c_sweep"), 6: (t6_grid, "c_grid"), 7: (t7_the_cut, "c_cut"), 8: (t8_skyline, "c_skyline")}
for n, sl in enumerate(slides, 1):
    fn, snd = TR[n]
    if n > 1:
        copy_prev(slides[n - 2], sl, bgcolor(slides[n - 2]))
    eff, T = fn(sl, n - 1) if fn is t7_the_cut else fn(sl)
    if not SNAP:
        eff = [e for e in eff if not any(t.startswith("snap") for t in e["targets"])]
    if n == 1:
        eff = [e for e in eff if "prev" not in e["targets"]]
    spec.append({"slide": n, "transition": {"type": "cut", "dur": 0, "sound": snd}, "effects": eff + content(n, T - 0.15)})
prs.save(DST)
json.dump(spec, open(SPECF, "w"), indent=1)
print("slides", len(spec), "effects", sum(len(s["effects"]) for s in spec), "snapshots" if SNAP else "no snapshots")

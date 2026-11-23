"""Extract final deck -> records2.json in the web-player format (inches, runs, shapes)."""
import json, io, os, sys
from pptx import Presentation
from pptx.enum.shapes import MSO_SHAPE_TYPE, MSO_SHAPE
from pptx.oxml.ns import qn
from PIL import Image
SRC = sys.argv[1]; OUT = os.path.dirname(os.path.abspath(__file__))
prs = Presentation(SRC); E = lambda v: v / 914400
A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"

def color_of(el):
    c = el.find(A + "srgbClr")
    if c is None: return None, None
    al = c.find(A + "alpha")
    return c.get("val"), (100 - int(al.get("val")) / 1000) if al is not None else None

def fill_of(spPr):
    sf = spPr.find(A + "solidFill")
    if sf is not None:
        col, tr = color_of(sf); return {"color": col, "transparency": tr}
    gf = spPr.find(A + "gradFill")
    if gf is not None:
        stops = []
        for gs in gf.iter(A + "gs"):
            col, tr = color_of(gs); stops.append([int(gs.get("pos")) / 1000, col, tr or 0])
        lin = gf.find(A + "lin"); ang = int(lin.get("ang")) / 60000 if lin is not None else 90
        return {"grad": stops, "angle": ang}
    return None

def line_of(spPr):
    ln = spPr.find(A + "ln")
    if ln is None or ln.find(A + "noFill") is not None: return None
    sf = ln.find(A + "solidFill")
    if sf is None: return None
    col, tr = color_of(sf)
    return {"color": col, "transparency": tr, "width": int(ln.get("w", "9525")) / 12700}

def pic_item(sh, tag):
    blob = sh.image.blob; im = Image.open(io.BytesIO(blob)).convert("RGBA")
    l, t, r, b = sh.crop_left, sh.crop_top, sh.crop_right, sh.crop_bottom
    W, H = im.size
    im = im.crop((round(W * l), round(H * t), round(W * (1 - r)), round(H * (1 - b))))
    if im.width > 2600: im = im.resize((2600, round(im.height * 2600 / im.width)), Image.LANCZOS)
    fn = f"img/{tag}.webp"; im.save(os.path.join(OUT, "web", fn), "WEBP", quality=88, method=6)
    o = {"x": E(sh.left), "y": E(sh.top), "w": E(sh.width), "h": E(sh.height), "src": fn, "objectName": sh.name}
    cg = sh._element.find(".//" + A + "custGeom")
    if cg is not None:
        pth = cg.find(".//" + A + "path"); pw, ph = int(pth.get("w")), int(pth.get("h"))
        pts = [(int(p.get("x")) / pw * 100, int(p.get("y")) / ph * 100) for p in pth.iter(A + "pt")]
        o["clip"] = "polygon(" + ", ".join(f"{x:.3f}% {y:.3f}%" for x, y in pts) + ")"
    am = sh._element.find(".//" + A + "alphaModFix")
    if am is not None:
        o["transparency"] = 100 - int(am.get("amt", "100000")) / 1000
    return {"kind": "image", "o": o}

def items_of(shapes, tag):
    out = []
    for k, sh in enumerate(shapes):
        if sh.shape_type == MSO_SHAPE_TYPE.PICTURE:
            out.append(pic_item(sh, f"{tag}_{k}")); continue
        if sh.shape_type == MSO_SHAPE_TYPE.GROUP:
            out.append({"kind": "group", "o": {"x": E(sh.left), "y": E(sh.top), "w": E(sh.width), "h": E(sh.height), "objectName": sh.name},
                        "items": items_of(sh.shapes, f"{tag}_{k}g")}); continue
        spPr = sh._element.find(qn("p:spPr"))
        geo = spPr.find(A + "prstGeom") if spPr is not None else None
        prst = geo.get("prst") if geo is not None else "rect"
        o = {"x": E(sh.left), "y": E(sh.top), "w": E(sh.width), "h": E(sh.height), "objectName": sh.name}
        if sh.has_text_frame and sh.text_frame.text.strip():
            paras = sh.text_frame.paragraphs; runs = []
            first = None
            for i, p in enumerate(paras):
                for j, r in enumerate(p.runs):
                    f = r.font; rpr = r._r.find(qn("a:rPr"))
                    if first is None: first = (f, rpr, p)
                    runs.append({"text": r.text, "options": {"color": str(f.color.rgb) if f.color and f.color.type else None,
                                 "bold": bool(f.bold), "italic": bool(f.italic), "breakLine": (j == len(p.runs) - 1 and i < len(paras) - 1)}})
            f, rpr, p = first
            ppr = p._p.find(qn("a:pPr"))
            o.update({"fontFace": f.name, "fontSize": f.size.pt if f.size else 18, "lineSpacingMultiple": p.line_spacing if isinstance(p.line_spacing, float) else 1.0,
                      "align": {1: "left", 2: "center", 3: "right"}.get(int(p.alignment) if p.alignment is not None else 1, "left"),
                      "charSpacing": (int(rpr.get("spc")) / 100) if rpr is not None and rpr.get("spc") else 0,
                      "rtl": ppr is not None and ppr.get("rtl") == "1", "italic": bool(f.italic)})
            out.append({"kind": "text", "t": runs, "o": o}); continue
        if spPr is None: continue
        o["fill"] = fill_of(spPr); o["line"] = line_of(spPr)
        if sh.rotation: o["rotate"] = sh.rotation
        if prst == "parallelogram":
            av = geo.find(A + "avLst"); gd = av.find(A + "gd") if av is not None else None
            o["adj"] = int(gd.get("fmla").split()[-1]) / 100000 if gd is not None else 0.25
        if prst == "roundRect":
            av = geo.find(A + "avLst"); gd = av.find(A + "gd") if av is not None else None
            adj = int(gd.get("fmla").split()[-1]) / 100000 if gd is not None else 0.16667
            o["rectRadius"] = adj * min(o["w"], o["h"])
        out.append({"kind": "shape", "type": {"roundRect": "roundRect", "ellipse": "ellipse", "diamond": "diamond", "parallelogram": "parallelogram"}.get(prst, "rect"), "o": o})
    return out

slides = []
for i, s in enumerate(prs.slides, 1):
    bg = s._element.find(qn("p:cSld")).find(qn("p:bg"))
    bgc = "101112"
    if bg is not None:
        sf = bg.find(".//" + A + "srgbClr")
        if sf is not None: bgc = sf.get("val")
    items = []
    if s._element.get("showMasterSp") != "0":
        items += [dict(it, layout=True) for it in items_of(s.slide_layout.shapes, f"L{i}")]
    items += items_of(s.shapes, f"s{i}")
    slides.append({"bg": bgc, "items": items, "notes": s.notes_slide.notes_text_frame.text if s.has_notes_slide else ""})
json.dump({"slides": slides}, open(os.path.join(OUT, "records2.json"), "w"))
print([len(s["items"]) for s in slides], [s["bg"] for s in slides])
print([it["o"].get("objectName") for it in slides[1]["items"]])

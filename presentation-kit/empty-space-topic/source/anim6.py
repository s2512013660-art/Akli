"""Inject native PowerPoint transitions + timing (animations) into the pptxgenjs deck."""
import json, re, sys, zipfile, os

SRC, DST, SPECF = sys.argv[1], sys.argv[2], sys.argv[3]
SPEC = {s["slide"]: s for s in json.load(open(SPECF))}
MC = "http://schemas.openxmlformats.org/markup-compatibility/2006"
P14 = "http://schemas.microsoft.com/office/powerpoint/2010/main"
P159 = "http://schemas.microsoft.com/office/powerpoint/2015/09/main"


def transition(kind, dur, snd=""):
    if kind == "morph":
        choice = (f'<mc:Choice xmlns:p159="{P159}" Requires="p159"><p:transition spd="slow" p14:dur="{dur}">'
                  f'<p159:morph option="byObject"/></p:transition></mc:Choice>')
        fb = "<p:fade/>"
    elif kind == "flythrough":
        choice = f'<mc:Choice Requires="p14"><p:transition spd="slow" p14:dur="{dur}"><p14:flythrough/></p:transition></mc:Choice>'
        fb = '<p:zoom dir="in"/>'
    elif kind in ("doors", "gallery", "window", "reveal", "conveyor"):
        inner = {"doors": '<p14:doors dir="vert"/>', "gallery": '<p14:gallery dir="l"/>', "window": '<p14:window dir="vert"/>',
                 "reveal": '<p14:reveal thruBlk="1" dir="r"/>', "conveyor": '<p14:conveyor dir="l"/>'}[kind]
        choice = f'<mc:Choice Requires="p14"><p:transition spd="slow" p14:dur="{dur}">{inner}</p:transition></mc:Choice>'
        fb = {"doors": '<p:split orient="vert" dir="out"/>', "gallery": '<p:push dir="l"/>', "window": '<p:split orient="vert" dir="out"/>',
              "reveal": '<p:fade thruBlk="1"/>', "conveyor": '<p:push dir="l"/>'}[kind]
    else:
        inner = {"fade": "<p:fade/>", "fadeBlack": '<p:fade thruBlk="1"/>', "circle": "<p:circle/>", "wipeL": '<p:wipe dir="r"/>',
                 "zoom": '<p:zoom dir="in"/>', "pushUp": '<p:push dir="u"/>'}[kind]
        choice = f'<mc:Choice Requires="p14"><p:transition spd="slow" p14:dur="{dur}">{inner}</p:transition></mc:Choice>'
        fb = inner
    choice = choice.replace("</p:transition>", snd + "</p:transition>")
    return f'<mc:AlternateContent xmlns:mc="{MC}">{choice}<mc:Fallback><p:transition spd="slow">{fb}{snd}</p:transition></mc:Fallback></mc:AlternateContent>'


class Ids:
    def __init__(self):
        self.n = 2

    def __call__(self):
        self.n += 1
        return self.n


def tgt(spid):
    return f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl>'


def set_vis(ids, spid, val="visible", delay=0):
    return (f'<p:set><p:cBhvr><p:cTn id="{ids()}" dur="1" fill="hold"><p:stCondLst><p:cond delay="{delay}"/></p:stCondLst></p:cTn>'
            f'{tgt(spid)}<p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr>'
            f'<p:to><p:strVal val="{val}"/></p:to></p:set>')


def anim_effect(ids, spid, d, filt, tr="in"):
    return f'<p:animEffect transition="{tr}" filter="{filt}"><p:cBhvr><p:cTn id="{ids()}" dur="{d}"/>{tgt(spid)}</p:cBhvr></p:animEffect>'


def val(v):
    return f'<p:fltVal val="{v}"/>' if isinstance(v, (int, float)) else f'<p:strVal val="{v}"/>'


def anim_prop(ids, spid, d, attr, v0, v1, extra=""):
    return (f'<p:anim calcmode="lin" valueType="num"><p:cBhvr additive="base"><p:cTn id="{ids()}" dur="{d}" fill="hold"{extra}/>{tgt(spid)}'
            f'<p:attrNameLst><p:attrName>{attr}</p:attrName></p:attrNameLst></p:cBhvr><p:tavLst>'
            f'<p:tav tm="0"><p:val>{val(v0)}</p:val></p:tav><p:tav tm="100000"><p:val>{val(v1)}</p:val></p:tav></p:tavLst></p:anim>')


def effect(ids, e, spid):
    """returns (preset attrs, children xml, cTn extra attrs)"""
    k, d = e["eff"], int(round(e["dur"] * 1000))
    o = e.get("opts", {})
    dec = ' decel="100000"'
    if k == "fade":
        return 'presetID="10" presetClass="entr" presetSubtype="0"', set_vis(ids, spid) + anim_effect(ids, spid, d, "fade"), ""
    if k in ("wipeL", "wipeR"):
        sub, f = ("8", "wipe(left)") if k == "wipeL" else ("2", "wipe(right)")
        return f'presetID="22" presetClass="entr" presetSubtype="{sub}"', set_vis(ids, spid) + anim_effect(ids, spid, d, f), ""
    if k in ("floatUp", "descend", "riseIn", "slideFromL", "slideFromR"):
        ax, v0 = {"floatUp": ("ppt_y", "#ppt_y+0.04"), "descend": ("ppt_y", "#ppt_y-0.06"), "riseIn": ("ppt_y", "#ppt_y+0.06"),
                  "slideFromL": ("ppt_x", "#ppt_x-0.08"), "slideFromR": ("ppt_x", "#ppt_x+0.08")}[k]
        other = "ppt_x" if ax == "ppt_y" else "ppt_y"
        pid = {"floatUp": "42", "descend": "47", "riseIn": "42", "slideFromL": "42", "slideFromR": "42"}[k]
        ch = (set_vis(ids, spid) + anim_effect(ids, spid, d, "fade") + anim_prop(ids, spid, d, other, "#" + other, "#" + other) +
              anim_prop(ids, spid, d, ax, v0, "#" + ax, dec))
        return f'presetID="{pid}" presetClass="entr" presetSubtype="0"', ch, ""
    if k == "zoomIn":
        ch = (set_vis(ids, spid) + anim_prop(ids, spid, d, "ppt_w", 0, "#ppt_w", dec) + anim_prop(ids, spid, d, "ppt_h", 0, "#ppt_h", dec) +
              anim_effect(ids, spid, d, "fade"))
        return 'presetID="53" presetClass="entr" presetSubtype="16"', ch, ""
    if k == "expandIn":
        ch = (set_vis(ids, spid) + anim_prop(ids, spid, d, "ppt_w", "#ppt_w*1.08", "#ppt_w", dec) +
              anim_prop(ids, spid, d, "ppt_h", "#ppt_h*1.08", "#ppt_h", dec) + anim_effect(ids, spid, d, "fade"))
        return 'presetID="55" presetClass="entr" presetSubtype="0"', ch, ""
    if k == "exitFade":
        return 'presetID="10" presetClass="exit" presetSubtype="0"', anim_effect(ids, spid, d, "fade", "out") + set_vis(ids, spid, "hidden", d - 1), ""
    if k == "filter":
        return (f'presetID="{o.get("preset", 10)}" presetClass="entr" presetSubtype="{o.get("sub", 0)}"',
                set_vis(ids, spid) + anim_effect(ids, spid, d, o["filter"]), "")
    if k == "split":
        return 'presetID="16" presetClass="entr" presetSubtype="37"', set_vis(ids, spid) + anim_effect(ids, spid, d, "barn(outVertical)"), ""
    if k == "spin":
        by = int(o.get("deg", 360) * 60000)
        rep = (' repeatCount="indefinite"' if o.get("repeat") else "") + (' autoRev="1" accel="50000" decel="50000"' if o.get("autoRev") else "")
        ch = (f'<p:animRot by="{by}"><p:cBhvr><p:cTn id="{ids()}" dur="{d}" fill="hold"/>{tgt(spid)}'
              f'<p:attrNameLst><p:attrName>r</p:attrName></p:attrNameLst></p:cBhvr></p:animRot>')
        return 'presetID="8" presetClass="emph" presetSubtype="0"', ch, rep
    if k in ("breathe", "scaleX", "pulse"):
        if k == "scaleX":
            bx, by = int(o.get("x", 30) * 1000), 100000
            rep = ' repeatCount="indefinite" autoRev="1"'
        else:
            s = int(o.get("scale", 104) * 1000)
            bx = by = s
            cnt = o.get("count", 0)
            rep = f' repeatCount="{"indefinite" if k == "breathe" or not cnt else cnt * 1000}" autoRev="1"'
        ch = f'<p:animScale><p:cBhvr><p:cTn id="{ids()}" dur="{d}" fill="hold"/>{tgt(spid)}</p:cBhvr><p:by x="{bx}" y="{by}"/></p:animScale>'
        return 'presetID="6" presetClass="emph" presetSubtype="0"', ch, rep + ' accel="50000" decel="50000"'
    if k == "path":
        extra = ""
        if o.get("smooth"):
            extra += ' accel="50000" decel="50000"'
        if o.get("repeat"):
            extra += ' repeatCount="indefinite"'
        if o.get("autoRev"):
            extra += ' autoRev="1"'
        ch = (f'<p:animMotion origin="layout" path="{o["path"]}" pathEditMode="relative" ptsTypes=""><p:cBhvr>'
              f'<p:cTn id="{ids()}" dur="{d}" fill="hold"/>{tgt(spid)}<p:attrNameLst><p:attrName>ppt_x</p:attrName>'
              f'<p:attrName>ppt_y</p:attrName></p:attrNameLst></p:cBhvr></p:animMotion>')
        return 'presetID="0" presetClass="path" presetSubtype="0"', ch, extra
    raise ValueError(k)


def timing(spec, names):
    ids = Ids()
    pars, bld = [], []
    items = []
    for e in spec["effects"]:
        for nm in e["targets"]:
            if nm not in names:
                raise KeyError(f"slide {spec['slide']}: shape '{nm}' not found")
            items.append((e["t"], e, nm))
    items.sort(key=lambda x: x[0])
    outer, inner = None, None
    first = True
    for t, e, nm in items:
        spid, kind = names[nm]
        cid = ids()
        preset, ch, extra = effect(ids, e, spid)
        node = "withEffect"
        pars.append(f'<p:par><p:cTn id="{cid}" {preset} fill="hold" grpId="0" nodeType="{node}"{extra}>'
                    f'<p:stCondLst><p:cond delay="{int(round(t * 1000))}"/></p:stCondLst><p:childTnLst>{ch}</p:childTnLst></p:cTn></p:par>')
        if kind == "sp" and spid not in bld:
            bld.append(spid)
    body = "".join(pars)
    xml = ('<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>'
           '<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>'
           '<p:par><p:cTn id="{A}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond>'
           '</p:stCondLst><p:childTnLst><p:par><p:cTn id="{B}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>'
           + body +
           '</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par>'
           '</p:childTnLst></p:cTn><p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>'
           '<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>'
           '</p:childTnLst></p:cTn></p:par></p:tnLst>')
    a, b = ids(), ids()
    xml = xml.replace("{A}", str(a)).replace("{B}", str(b))
    if bld:
        xml += "<p:bldLst>" + "".join(f'<p:bldP spid="{s}" grpId="0" animBg="1"/>' for s in bld) + "</p:bldLst>"
    return xml + "</p:timing>", len(items)


def shape_names(x):
    names = {}
    for m in re.finditer(r'<p:(sp|pic|cxnSp)>.*?<p:cNvPr id="(\d+)" name="([^"]*)"', x, flags=re.S):
        pass
    # robust: walk cNvPr and find the nearest enclosing element kind
    for m in re.finditer(r'<p:cNvPr id="(\d+)" name="([^"]*)"', x):
        start = m.start()
        sp = x.rfind("<p:sp>", 0, start)
        pic = x.rfind("<p:pic>", 0, start)
        cxn = x.rfind("<p:cxnSp>", 0, start)
        kind = max((sp, "sp"), (pic, "pic"), (cxn, "cxnSp"))[1]
        nm = m.group(2).replace("&amp;", "&")
        if nm in names:
            raise ValueError(f"duplicate shape name {nm}")
        names[nm] = (m.group(1), kind)
    return names


zin = zipfile.ZipFile(SRC)
SND_SLIDES = set()
SNDFILE = sys.argv[4] if len(sys.argv) > 4 else None
_pres = zin.read("ppt/presentation.xml").decode()
_rels = zin.read("ppt/_rels/presentation.xml.rels").decode()
_tgt = dict(re.findall(r'Id="(rId\d+)"[^>]*Target="([^"]+)"', _rels)) or {}
_tgt.update({m[1]: m[0] for m in re.findall(r'Target="([^"]+)"[^>]*Id="(rId\d+)"', _rels)})
_order = re.findall(r'<p:sldId [^>]*r:id="(rId\d+)"', _pres)
PART2N = {"ppt/" + _tgt[r].lstrip("/").replace("ppt/", ""): i for i, r in enumerate(_order, 1)}
zout = zipfile.ZipFile(DST, "w", zipfile.ZIP_DEFLATED)
total = 0
for item in zin.infolist():
    data = zin.read(item.filename)
    n = PART2N.get(item.filename)
    if n and n in SPEC:
        x = data.decode("utf-8")
        spec = SPEC[n]
        names = shape_names(x)
        tim, cnt = timing(spec, names)
        total += cnt
        snd = '<p:sndAc><p:stSnd><p:snd r:embed="rIdSnd1" name="whoosh.wav"/></p:stSnd></p:sndAc>' if spec["transition"].get("sound") else ""
        if snd:
            SND_SLIDES.add(item.filename)
        tr = transition(spec["transition"]["type"], spec["transition"]["dur"], snd)
        x = x.replace("<p:sld ", f'<p:sld xmlns:mc="{MC}" xmlns:p14="{P14}" ', 1)
        anchor = "</p:clrMapOvr>" if "</p:clrMapOvr>" in x else "</p:cSld>"
        x = x.replace(anchor, anchor + tr + tim, 1)
        data = x.encode("utf-8")
    zout.writestr(item, data)
if SND_SLIDES:
    zout.writestr("ppt/media/whoosh_transition.wav", open(SNDFILE, "rb").read())
zout.close()
# second pass: relationships + content type for the transition sound
if SND_SLIDES:
    import shutil
    tmp = DST + ".tmp"; shutil.move(DST, tmp)
    zi = zipfile.ZipFile(tmp); zo = zipfile.ZipFile(DST, "w", zipfile.ZIP_DEFLATED)
    for it in zi.infolist():
        b = zi.read(it.filename)
        if it.filename == "[Content_Types].xml" and b'Extension="wav"' not in b:
            b = b.replace(b"<Default ", b'<Default Extension="wav" ContentType="audio/wav"/><Default ', 1)
        for sp in SND_SLIDES:
            rel = sp.replace("ppt/slides/", "ppt/slides/_rels/") + ".rels"
            if it.filename == rel:
                b = b.replace(b"</Relationships>", b'<Relationship Id="rIdSnd1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/audio" Target="../media/whoosh_transition.wav"/></Relationships>')
        zo.writestr(it, b)
    zo.close(); zi.close(); os.remove(tmp)
print(f"injected {total} animation effects into {len(SPEC)} slides -> {DST}")

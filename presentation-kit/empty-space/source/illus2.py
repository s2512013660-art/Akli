"""Illustrations for 'The Architecture of Empty Space'. 1 px = 0.01 in. Light on darkness."""
import math, random, json, os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "svg")
os.makedirs(OUT, exist_ok=True)
MAN = []
LINE, MIST, GOLD, GOLDS, SKY, EMBER = "#EDE6DA", "#A8A29A", "#E9B65A", "#F6D9A0", "#8EC5E8", "#E07A3F"
APER, INKC, LIGHTC = "#15130F", "#141312", "#F3EEE6"
SANS = "'DejaVu Sans', Arial, sans-serif"

# aperture rects in inches: x, y, w, h, radius   (shared with build2.js)
AP = {1: (8.55, 1.0, 2.5, 4.85, 0.04), 2: (7.95, 0.95, 4.6, 4.6, 2.3), 3: (0.75, 0.75, 5.0, 5.0, 2.5),
      4: (6.25, 0.95, 6.4, 4.3, 0.12), 5: (0.7, 1.35, 6.6, 3.7, 0.12), 6: (9.1, 0.95, 3.0, 5.3, 0.1),
      7: (0.7, 0.75, 5.9, 5.0, 0.12), 8: (6.45, 0.95, 6.2, 4.4, 0.12), 9: (0.7, 1.15, 6.4, 4.0, 2.0),
      10: (0.0, 0.0, 13.333, 7.5, 0.0)}

GLOWF = ('<filter id="glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4" result="b"/>'
         '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
         '<filter id="bigglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>')


def save(name, body, w, h, defs="", kind="png", meta=None):
    s = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">'
         f'<defs>{GLOWF}{defs}</defs>{body}</svg>')
    open(os.path.join(OUT, name + ".svg"), "w", encoding="utf-8").write(s)
    m = {"name": name, "w": w, "h": h, "kind": kind}
    if meta:
        m.update(meta)
    MAN.append(m)


def P(pts):
    return " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)


def ln(a, b, c=LINE, sw=1, op=1, ex=""):
    return f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" stroke="{c}" stroke-width="{sw}" opacity="{op}" stroke-linecap="round" {ex}/>'


def pl(pts, c=LINE, sw=1, op=1, fill="none", ex=""):
    return f'<polyline points="{P(pts)}" fill="{fill}" stroke="{c}" stroke-width="{sw}" opacity="{op}" stroke-linejoin="round" stroke-linecap="round" {ex}/>'


def pg(pts, fill="none", c="none", sw=1, op=1, ex=""):
    return f'<polygon points="{P(pts)}" fill="{fill}" stroke="{c}" stroke-width="{sw}" opacity="{op}" stroke-linejoin="round" {ex}/>'


def rc(x, y, w, h, fill="none", c="none", sw=1, op=1, rx=0, ex=""):
    return f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{rx}" fill="{fill}" stroke="{c}" stroke-width="{sw}" opacity="{op}" {ex}/>'


def ci(cx, cy, r, fill="none", c="none", sw=1, op=1, ex=""):
    return f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" fill="{fill}" stroke="{c}" stroke-width="{sw}" opacity="{op}" {ex}/>'


def tx(x, y, s, size=11, fill=LINE, anchor="middle", op=1, weight="normal", fam=SANS, ls=0):
    return (f'<text x="{x:.1f}" y="{y:.1f}" font-family="{fam}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" '
            f'opacity="{op}" font-weight="{weight}" letter-spacing="{ls}">{s}</text>')


def smooth(pts):
    """Catmull-Rom -> cubic bezier path"""
    d = f"M{pts[0][0]:.1f},{pts[0][1]:.1f} "
    for i in range(len(pts) - 1):
        p0 = pts[i - 1] if i > 0 else pts[i]
        p1, p2 = pts[i], pts[i + 1]
        p3 = pts[i + 2] if i + 2 < len(pts) else p2
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f"C{c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {p2[0]:.1f},{p2[1]:.1f} "
    return d


def aperture(n):
    x, y, w, h, r = AP[n]
    W, H, R = round(w * 100), round(h * 100), r * 100
    clip = f'<clipPath id="ap"><rect x="0" y="0" width="{W}" height="{H}" rx="{R:.1f}" ry="{R:.1f}"/></clipPath>'
    bgd = (f'<radialGradient id="apbg" cx="0.5" cy="0.42" r="0.7"><stop offset="0" stop-color="#2A2418"/>'
           f'<stop offset="1" stop-color="{APER}"/></radialGradient>')
    return W, H, clip + bgd


def ap_save(name, n, body, bg=True, defs="", meta=None):
    W, H, d = aperture(n)
    b = (rc(0, 0, W, H, "url(#apbg)") if bg else "") + body
    save(name, f'<g clip-path="url(#ap)">{b}</g>', W, H, d + defs, meta=meta)


# ================================================================ S1 doorway of light
def s1():
    W, H, _ = aperture(1)
    d = ('<linearGradient id="door" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF7E6"/>'
         '<stop offset="0.55" stop-color="#F6D9A0"/><stop offset="1" stop-color="#E2A84C"/></linearGradient>'
         '<linearGradient id="ray" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.55"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>')
    b = rc(0, 0, W, H, "url(#door)")
    hz = 395
    for i in range(-6, 7):
        b += ln((W / 2 + i * 9, hz), (W / 2 + i * 70, H), "#B07A2A", 0.8, 0.28)
    for k, yy in enumerate([400, 410, 424, 444, 472]):
        b += ln((0, yy), (W, yy), "#B07A2A", 0.8, 0.22)
    b += ln((0, hz), (W, hz), "#B07A2A", 1, 0.35)
    for i in range(4):
        b += pg([(30 + i * 55, 0), (60 + i * 55, 0), (140 + i * 40, hz), (110 + i * 40, hz)], "url(#ray)", op=0.35)
    ap_save("s1_door", 1, b, bg=False, defs=d)
    # person (in doorway)
    px, feet, hh = W / 2, 468, 96
    s = hh / 96
    person = (f'<g transform="translate({px} {feet}) scale({s:.3f})" fill="#1A1712">'
              '<circle cx="0" cy="-86" r="9"/><path d="M-11,-74 L11,-74 L14,-36 L8,-36 L7,0 L1,0 L0,-30 L-1,0 L-7,0 L-8,-36 L-14,-36 Z"/></g>')
    ap_save("s1_person", 1, person, bg=False)
    # light spill on the floor outside the door (6.0 x 1.0 in)
    sd = ('<linearGradient id="spill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9B65A" stop-opacity="0.55"/>'
          '<stop offset="1" stop-color="#E9B65A" stop-opacity="0"/></linearGradient>'
          '<linearGradient id="shadow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0C0B0A" stop-opacity="0.85"/>'
          '<stop offset="1" stop-color="#0C0B0A" stop-opacity="0"/></linearGradient>')
    sp = pg([(175, 0), (425, 0), (600, 100), (0, 100)], "url(#spill)") + pg([(294, 0), (306, 0), (322, 100), (278, 100)], "url(#shadow)")
    save("s1_spill", sp, 600, 100, sd)


# ================================================================ S2 vessel + wheel
def s2():
    W, H, _ = aperture(2)
    c = W / 2
    wheel = ci(c, c, 200, "none", MIST, 1.2, 0.45) + ci(c, c, 188, "none", MIST, 0.6, 0.3) + ci(c, c, 34, "none", MIST, 1.2, 0.6)
    for i in range(30):
        a = 2 * math.pi * i / 30
        wheel += ln((c + 34 * math.cos(a), c + 34 * math.sin(a)), (c + 188 * math.cos(a), c + 188 * math.sin(a)), MIST, 0.7, 0.32)
    ap_save("s2_wheel", 2, wheel, bg=True)

    def profile(off=0):
        # right half of a vessel, y top->bottom
        pts = [(48, 96), (40, 110), (35, 140), (60, 175), (105, 215), (118, 255), (112, 300), (88, 345), (50, 378)]
        return [(c + max(x - off, 4), y + (off * 0.6 if i == len(pts) - 1 else 0) - (0 if i else -off * 0.2)) for i, (x, y) in enumerate(pts)]
    R = profile(0)
    L = [(2 * c - x, y) for x, y in R]
    outer = smooth(R) + f"L{L[-1][0]:.1f},{L[-1][1]:.1f} " + smooth(L[::-1])[smooth(L[::-1]).index('C'):] + " Z"
    Ri = profile(9)
    Li = [(2 * c - x, y) for x, y in Ri]
    inner = smooth(Ri) + f"L{Li[-1][0]:.1f},{Li[-1][1]:.1f} " + smooth(Li[::-1])[smooth(Li[::-1]).index('C'):] + " Z"
    pot = (f'<path d="{outer}" fill="#1E1A14" stroke="{LINE}" stroke-width="2.4" stroke-linejoin="round"/>'
           f'<path d="{inner}" fill="{APER}" stroke="{LINE}" stroke-width="1" opacity="0.9"/>'
           + rc(c - 54, 90, 108, 9, "#1E1A14", LINE, 2, rx=4))
    ap_save("s2_pot", 2, pot, bg=False)
    vd = ('<linearGradient id="vg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4DA"/><stop offset="1" stop-color="#E9B65A"/></linearGradient>')
    void = f'<path d="{inner}" fill="url(#vg)" opacity="0.92" filter="url(#glow)"/>' + ci(c, c, 30, GOLD, op=0.0)
    ap_save("s2_void", 2, void, bg=False, defs=vd)


# ================================================================ S3 Pantheon section + beam
def s3():
    W, H, _ = aperture(3)
    cx, cy, r = 250, 250, 172
    top = cy - r
    half_oc = 32
    a_oc = math.asin(half_oc / r)
    s = ""
    # floor + drum walls (poché)
    s += rc(cx - r - 20, cy, 20, r, MIST, op=0.5) + rc(cx + r, cy, 20, r, MIST, op=0.5)
    s += ln((cx - r - 40, cy + r), (cx + r + 40, cy + r), LINE, 1.6)
    for i in range(-5, 6):
        s += ln((cx + i * 30, cy + r), (cx + i * 30 + 6, cy + r + 8), MIST, 0.6, 0.6)
    # dome inner arc (minus oculus)
    def arc(r_, a0, a1, n=40):
        return [(cx + r_ * math.cos(a), cy - r_ * math.sin(a)) for a in [a0 + (a1 - a0) * k / n for k in range(n + 1)]]
    left = arc(r, math.pi, math.pi / 2 + a_oc)
    right = arc(r, math.pi / 2 - a_oc, 0)
    s += pl(left, LINE, 2) + pl(right, LINE, 2)
    # outer dome with steps
    for k, (rr, a_end) in enumerate([(r + 22, 0.0), (r + 18, 0.35), (r + 12, 0.75), (r + 6, 1.1)]):
        pass
    outerL = arc(r + 20, math.pi, math.pi / 2 + a_oc * 0.8)
    outerR = arc(r + 20, math.pi / 2 - a_oc * 0.8, 0)
    s += pl(outerL, LINE, 1.2, 0.85) + pl(outerR, LINE, 1.2, 0.85)
    for ang in (0.35, 0.65):
        for sgn in (1, -1):
            a = math.pi / 2 + sgn * (math.pi / 2 - ang)
            s += ln((cx + (r + 20) * math.cos(a), cy - (r + 20) * math.sin(a)), (cx + (r + 30) * math.cos(a), cy - (r + 30) * math.sin(a)), LINE, 1, 0.7)
    # coffers (notches)
    for k in range(5):
        for sgn in (1, -1):
            a = math.pi / 2 + sgn * (math.pi / 2 - (0.12 + k * 0.24))
            p1 = (cx + r * math.cos(a), cy - r * math.sin(a))
            p2 = (cx + (r - 10) * math.cos(a), cy - (r - 10) * math.sin(a))
            a2 = a + sgn * -0.13
            p3 = (cx + (r - 10) * math.cos(a2), cy - (r - 10) * math.sin(a2))
            p4 = (cx + r * math.cos(a2), cy - r * math.sin(a2))
            s += pl([p1, p2, p3, p4], LINE, 0.9, 0.7)
    # niches + cornice
    s += ln((cx - r, cy), (cx + r, cy), MIST, 0.8, 0.5, 'stroke-dasharray="3 4"')
    for xx in (cx - r + 18, cx + r - 58):
        s += rc(xx, cy + 70, 40, 92, "none", LINE, 0.9, 0.7)
        s += f'<path d="M{xx},{cy + 70} A20,20 0 0 1 {xx + 40},{cy + 70}" fill="none" stroke="{LINE}" stroke-width="0.9" opacity="0.7"/>'
    s += ln((cx - r, cy + 50), (cx + r, cy + 50), MIST, 0.7, 0.45)
    ap_save("s3_section", 3, s, bg=True)
    sph = ci(cx, cy, r, "none", GOLD, 1.6, 0.9, 'stroke-dasharray="7 6"') + ci(cx, cy, 3, GOLD)
    ap_save("s3_sphere", 3, sph, bg=False)
    # beam: canvas 700x700, pivot (oculus) at center
    bd = ('<linearGradient id="bm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6DF" stop-opacity="0.75"/>'
          '<stop offset="1" stop-color="#F6D9A0" stop-opacity="0.12"/></linearGradient>'
          '<radialGradient id="disk"><stop offset="0" stop-color="#FFF6DF" stop-opacity="0.95"/><stop offset="1" stop-color="#F6D9A0" stop-opacity="0"/></radialGradient>')
    bm = pg([(350 - 30, 350), (350 + 30, 350), (350 + 62, 350 + 318), (350 - 62, 350 + 318)], "url(#bm)")
    bm += f'<ellipse cx="350" cy="{350 + 320}" rx="80" ry="22" fill="url(#disk)"/>'
    save("s3_beam", bm, 700, 700, bd, meta={"pivot_in_aperture": [cx / 100, top / 100]})


# ================================================================ S4 Nolli figure-ground
def s4():
    W, H, _ = aperture(4)
    rng = random.Random(1748)
    xs = [-20]
    while xs[-1] < W + 20:
        xs.append(xs[-1] + rng.uniform(34, 82))
    ys = [-20]
    while ys[-1] < H + 20:
        ys.append(ys[-1] + rng.uniform(28, 60))
    main_v = {rng.randrange(2, len(xs) - 2) for _ in range(2)}
    main_h = {rng.randrange(2, len(ys) - 2)}
    vw = {}
    hw = {}
    for i in range(len(xs)):
        for j in range(len(ys)):
            vw[(i, j)] = 10 if i in main_v else (0 if rng.random() < 0.38 else rng.uniform(3, 6))
            hw[(i, j)] = 10 if j in main_h else (0 if rng.random() < 0.38 else rng.uniform(3, 6))
    jit = {}

    def J(i, j):
        if (i, j) not in jit:
            jit[(i, j)] = (rng.uniform(-10, 10), rng.uniform(-9, 9))
        return jit[(i, j)]
    blocks = []
    for i in range(len(xs) - 1):
        for j in range(len(ys) - 1):
            l, r_, t, bt = vw[(i, j)] / 2, vw[(i + 1, j)] / 2, hw[(i, j)] / 2, hw[(i, j + 1)] / 2
            q = []
            for (ii, jj, ox, oy) in [(i, j, l, t), (i + 1, j, -r_, t), (i + 1, j + 1, -r_, -bt), (i, j + 1, l, -bt)]:
                jx, jy = J(ii, jj)
                q.append((xs[ii] + jx + ox, ys[jj] + jy + oy))
            blocks.append(q)
    # river (Tiber) curve across lower-left
    river = smooth([(-20, 300), (80, 330), (170, 395), (230, 450)])
    river_pts = [(-20, 300), (80, 330), (170, 395), (230, 450)]

    def near_river(q):
        mx = sum(p[0] for p in q) / 4
        my = sum(p[1] for p in q) / 4
        return any(math.hypot(mx - rx, my - ry) < 58 for rx, ry in river_pts) or (my > 300 and mx < 120) or (my > 360 and mx < 230)
    keep = [q for q in blocks if not near_river(q)]
    piazzas = set(rng.sample(range(len(keep)), 6))
    keep = [q for k, q in enumerate(keep) if k not in piazzas]
    PAN = (330, 205)
    NAV = (185, 95, 40, 190)  # x, y, w, h stadium
    # ---- line layer (conventional)
    lines = ""
    for q in keep:
        lines += pg(q, "none", LINE, 0.8, 0.75)
    lines += f'<path d="{river}" fill="none" stroke="{MIST}" stroke-width="26" opacity="0.18"/>'
    lines += ln((360, -10), (660, 300), APER, 9) + ln((-10, 150), (300, 120), APER, 7)
    lines += rc(*NAV, "none", LINE, 1, 0.8, rx=20) + ci(*PAN, 21, "none", LINE, 1, 0.9) + rc(PAN[0] - 14, PAN[1] - 42, 28, 20, "none", LINE, 1, 0.9)
    ap_save("s4_lines", 4, lines, bg=True)
    # ---- Nolli layer: buildings black, public space white
    n = rc(0, 0, W, H, LIGHTC)
    for q in keep:
        n += pg(q, INKC)
    for k in range(9):  # private courtyards
        q = keep[rng.randrange(len(keep))]
        mx = sum(p[0] for p in q) / 4
        my = sum(p[1] for p in q) / 4
        n += rc(mx - 6, my - 4, 12, 8, "#2A2724")
    for k in range(4):  # church interiors (public, white)
        q = keep[rng.randrange(len(keep))]
        mx = sum(p[0] for p in q) / 4
        my = sum(p[1] for p in q) / 4
        n += rc(mx - 3, my - 13, 6, 26, LIGHTC) + rc(mx - 10, my - 6, 20, 5, LIGHTC)
    n += ln((360, -10), (660, 300), LIGHTC, 9) + ln((-10, 150), (300, 120), LIGHTC, 7)
    n += rc(*NAV, LIGHTC, rx=20) + rc(NAV[0] - 14, NAV[1] + 70, 14, 10, LIGHTC)
    n += rc(PAN[0] - 26, PAN[1] - 22, 52, 46, INKC) + ci(*PAN, 21, LIGHTC) + rc(PAN[0] - 12, PAN[1] - 40, 24, 18, LIGHTC)
    n += rc(PAN[0] - 30, PAN[1] - 78, 60, 36, LIGHTC)
    n += f'<path d="{river}" fill="none" stroke="{LIGHTC}" stroke-width="30"/>'
    for k in range(-14, 15):
        n += f'<path d="{river}" fill="none" stroke="#7E7A74" stroke-width="0.6" opacity="0.55" transform="translate(0 {k * 1.8})" stroke-dasharray="{6 + k % 3} 4"/>'
    ap_save("s4_nolli", 4, n, bg=False, meta={"pantheon": [PAN[0] / 100, PAN[1] / 100]})


# ================================================================ S5 Barcelona Pavilion plan + flow
def s5():
    W, H, _ = aperture(5)
    s = rc(30, 40, 600, 280, "none", MIST, 1.2, 0.7)
    for i in range(1, 30):  # travertine grid
        s += ln((30 + i * 20, 40), (30 + i * 20, 320), MIST, 0.4, 0.14)
    for j in range(1, 14):
        s += ln((30, 40 + j * 20), (630, 40 + j * 20), MIST, 0.4, 0.14)
    s += rc(42, 58, 205, 130, "#1F2B33", SKY, 0.8, 0.55)  # large pool
    for k in range(5):
        s += f'<path d="M{60 + k * 10},{90 + k * 18} q20,-6 40,0 t40,0 t40,0" fill="none" stroke="{SKY}" stroke-width="0.7" opacity="0.4"/>'
    s += rc(520, 232, 88, 62, "#1F2B33", SKY, 0.8, 0.55) + ci(552, 262, 5, LINE)
    walls = [(280, 70, 190, 6), (480, 88, 6, 140), (505, 222, 115, 6), (614, 222, 6, 88), (262, 205, 6, 98), (44, 214, 170, 6), (90, 40, 6, 0)]
    for (x, y, w, h) in walls:
        if w and h:
            s += rc(x, y, w, h, LINE, op=0.92)
    s += rc(330, 168, 92, 7, GOLD)  # onyx wall
    for y in (122, 236):
        s += ln((300, y), (470, y), MIST, 1, 0.55, 'stroke-dasharray="4 4"')
    s += rc(272, 60, 330, 190, "none", MIST, 0.9, 0.6, ex='stroke-dasharray="8 6"')
    for x in (310, 380, 450, 520):
        for y in (108, 200):
            s += ln((x - 6, y), (x + 6, y), LINE, 2.2) + ln((x, y - 6), (x, y + 6), LINE, 2.2)
    for k in range(5):
        s += ln((40 + k * 6, 300 - k * 4), (130, 300 - k * 4), MIST, 0.8, 0.7)
    s += rc(360, 186, 10, 10, "none", LINE, 0.8) + rc(388, 186, 10, 10, "none", LINE, 0.8)
    ap_save("s5_plan", 5, s, bg=True)
    pts = [(70, 330), (140, 262), (230, 240), (300, 196), (360, 150), (445, 150), (465, 205), (430, 262), (530, 205), (590, 150), (680, 120)]
    path = f'<path d="{smooth(pts)}" fill="none" stroke="{GOLD}" stroke-width="2.6" stroke-dasharray="2 7" stroke-linecap="round" filter="url(#glow)"/>'
    ap_save("s5_path", 5, path, bg=False, meta={"pts": pts})


# ================================================================ S6 Eiffel tower + slab + beams
def s6():
    W, H, _ = aperture(6)
    cx, ytop, ybase = 150, 46, 512

    def hw(y):
        return 108 * ((y - ytop) / (ybase - ytop)) ** 1.65 + 4
    s = ""
    ys = [ytop + k * (ybase - ytop) / 40 for k in range(41)]
    L = [(cx - hw(y), y) for y in ys]
    R = [(cx + hw(y), y) for y in ys]
    s += pl(L, LINE, 1.6) + pl(R, LINE, 1.6)
    yy = ytop
    while yy < ybase - 20:
        y2 = yy + 22
        s += ln((cx - hw(yy), yy), (cx + hw(y2), y2), LINE, 0.6, 0.55) + ln((cx + hw(yy), yy), (cx - hw(y2), y2), LINE, 0.6, 0.55)
        yy = y2
    for (py, ext) in [(392, 10), (262, 7), (80, 4)]:
        s += rc(cx - hw(py) - ext, py - 5, 2 * (hw(py) + ext), 7, "#2A2620", LINE, 1)
    s += ln((cx - hw(392) + 34, 392), (cx - 60, ybase), LINE, 1.2) + ln((cx + hw(392) - 34, 392), (cx + 60, ybase), LINE, 1.2)
    s += f'<path d="M{cx - 62},{ybase} Q{cx},{410} {cx + 62},{ybase}" fill="none" stroke="{LINE}" stroke-width="1.2"/>'
    s += ln((cx, ytop), (cx, 16), LINE, 1.4) + ci(cx, 40, 4, "none", LINE, 1)
    ground = ln((14, ybase + 1), (W - 14, ybase + 1), MIST, 1, 0.8)
    ap_save("s6_tower", 6, s + ground, bg=True)
    ap_save("s6_ghost", 6, f'<g opacity="0.16">{s}</g>' + ground, bg=True)
    slab = rc(cx - 114, ybase - 5, 228, 6, GOLD, ex='filter="url(#glow)"') + rc(cx - 114, ybase - 5, 228, 6, GOLDS)
    ap_save("s6_slab", 6, slab, bg=False)
    # beams diagram 260 x 110
    b = rc(10, 25, 60, 60, GOLD, op=0.85) + tx(40, 104, "SOLID", 10, MIST, ls=1)
    b += ln((88, 55), (150, 55), MIST, 1.2) + pg([(150, 49), (162, 55), (150, 61)], MIST)
    ib = [(180, 25), (240, 25), (240, 35), (216, 35), (216, 75), (240, 75), (240, 85), (180, 85), (180, 75), (204, 75), (204, 35), (180, 35)]
    b += pg(ib, GOLD, op=0.95) + rc(180, 25, 60, 60, "none", GOLD, 1, 0.4, ex='stroke-dasharray="3 3"') + tx(210, 104, "I-BEAM", 10, MIST, ls=1)
    save("s6_beams", b, 260, 110)


# ================================================================ S7 Baghdad courtyard house section
def s7():
    W, H, _ = aperture(7)
    g = 380
    s = ""
    s += rc(0, g, W, H - g, "#1B1813")
    s += ln((0, g), (W, g), LINE, 1.4)
    # sirdab (basement)
    for (x0, x1) in [(30, 220), (370, 560)]:
        s += rc(x0, g + 6, x1 - x0, 66, "#221E17", LINE, 1)
        for k in range(3):
            ax = x0 + 18 + k * ((x1 - x0 - 36) / 3)
            s += f'<path d="M{ax:.0f},{g + 72} v-34 a{(x1 - x0 - 36) / 6:.0f},{(x1 - x0 - 36) / 6:.0f} 0 0 1 {(x1 - x0 - 36) / 3:.0f},0 v34" fill="none" stroke="{MIST}" stroke-width="0.8" opacity="0.6"/>'
    # rooms
    for (x0, x1) in [(30, 210), (380, 560)]:
        s += rc(x0, 150, x1 - x0, g - 150, "none", LINE, 1.3)
        s += ln((x0, 262), (x1, 262), LINE, 1.1)
        s += rc(x0 - 6, 140, x1 - x0 + 12, 10, "#2A2620", LINE, 1)
    # tarma (verandah) columns facing courtyard
    for x in (198, 392):
        s += ln((x, 262), (x, g), LINE, 1.6)
    for x in (150, 432):
        s += rc(x, 186, 34, 50, "none", MIST, 0.9, 0.8, rx=2)
    # courtyard: pool + date palm
    s += rc(262, g - 7, 66, 7, "#24394A", SKY, 0.8)
    s += ln((298, g - 7), (300, 190), "#8D6B45", 4)
    for k in range(9):
        a = math.pi * (0.05 + k * 0.11)
        s += f'<path d="M300,190 q{70 * math.cos(a) * 0.5:.0f},{-40 * math.sin(a):.0f} {85 * math.cos(a):.0f},{-10 - 25 * math.sin(a) + 30:.0f}" fill="none" stroke="#6E9A62" stroke-width="2.4" opacity="0.95"/>'
    # badgir wind catcher
    s += rc(62, 52, 40, 88, "#211D16", LINE, 1.2)
    s += pg([(56, 52), (108, 52), (108, 40), (62, 30)], "#2A2620", LINE, 1)
    s += rc(66, 64, 32, 26, "#0F0E0C", MIST, 0.8)
    s += ln((76, 140), (76, g + 60), MIST, 0.8, 0.6, 'stroke-dasharray="5 5"') + ln((92, 140), (92, g + 60), MIST, 0.8, 0.6, 'stroke-dasharray="5 5"')
    # shanasheel
    sx0, sy0, sw_, sh_ = 560, 168, 24, 80
    s += rc(sx0, sy0, sw_, sh_, "#5A3B1F", "#C08A52", 1.2)
    for k in range(1, 8):
        s += ln((sx0, sy0 + k * 10), (sx0 + sw_, sy0 + k * 10), "#C08A52", 0.6, 0.8)
    for k in range(1, 3):
        s += ln((sx0 + k * 8, sy0), (sx0 + k * 8, sy0 + sh_), "#C08A52", 0.6, 0.8)
    # labels (Arabic + English)
    lab = ""
    for (x, y, ar, en, anc) in [(295, 430, "حوش", "HOSH · COURTYARD", "middle"), (125, 432, "سرداب", "SIRDAB", "middle"),
                                 (112, 24, "بادگير", "BADGIR · WIND CATCHER", "start"), (552, 300, "شناشيل", "SHANASHEEL", "end")]:
        lab += tx(x, y, ar, 15, GOLDS, anc, weight="bold") + tx(x, y + 15, en, 9, MIST, anc, ls=1)
    ap_save("s7_house", 7, s + lab, bg=True)
    # arrows (separate sprites)
    def arrow(color, up):
        a = (f'<path d="M20,{80 if up else 6} C10,{60 if up else 26} 30,{44 if up else 42} 20,{24 if up else 62}" fill="none" stroke="{color}" stroke-width="3" stroke-linecap="round"/>')
        a += pg([(10, 26), (20, 8), (30, 26)] if up else [(10, 60), (20, 78), (30, 60)], color)
        return f'<g filter="url(#glow)">{a}</g>'
    save("s7_cool", arrow(SKY, False), 40, 86)
    save("s7_hot", arrow(EMBER, True), 40, 86)
    sun = ('<radialGradient id="sg"><stop offset="0" stop-color="#FFE9B8"/><stop offset="0.5" stop-color="#E9B65A"/><stop offset="1" stop-color="#E9B65A" stop-opacity="0"/></radialGradient>')
    save("s7_sun", ci(30, 30, 30, "url(#sg)") + ci(30, 30, 11, "#F6D9A0"), 60, 60, sun)


# ================================================================ S8 room section (ceiling height)
def s8():
    W, H, _ = aperture(8)
    fl = 390
    s = ln((40, fl), (580, fl), LINE, 1.6) + ln((40, 120), (40, fl), LINE, 1.4) + ln((580, 120), (580, fl), LINE, 1.4)
    for (y, lab) in [(fl - 192, "2.4 m"), (fl - 240, "3.0 m")]:
        s += ln((44, y), (576, y), MIST, 0.7, 0.45, 'stroke-dasharray="4 5"') + tx(70, y - 6, lab, 11, MIST, "start", ls=1)
    s += rc(574, 230, 8, 90, "#2B3A44", SKY, 0.8, 0.8)
    # desk + chair + seated person
    s += rc(300, 318, 150, 7, "#2A2620", LINE, 1) + ln((312, 325), (312, fl), LINE, 1.2) + ln((438, 325), (438, fl), LINE, 1.2)
    s += rc(340, 300, 60, 18, "none", MIST, 0.8, rx=2)
    s += ln((236, 340), (236, fl), LINE, 1.2) + ln((236, 340), (286, 340), LINE, 1.2) + ln((236, 340), (226, 280), LINE, 1.2)
    person = (f'<g fill="#EDE6DA" opacity="0.92"><circle cx="262" cy="262" r="15"/>'
              f'<path d="M248,280 L276,280 L284,338 L318,338 L318,350 L292,350 L298,{fl} L286,{fl} L280,352 L254,352 Z"/>'
              f'<path d="M272,292 L322,312 L320,320 L268,304 Z"/></g>')
    s += person
    ap_save("s8_room", 8, s, bg=True)
    ad = '<radialGradient id="au"><stop offset="0" stop-color="#E9B65A" stop-opacity="0.0"/><stop offset="0.7" stop-color="#E9B65A" stop-opacity="0.18"/><stop offset="1" stop-color="#E9B65A" stop-opacity="0"/></radialGradient>'
    aura = ci(90, 90, 88, "url(#au)") + ci(90, 90, 40, "none", GOLD, 1.2, 0.8) + ci(90, 90, 60, "none", GOLD, 1, 0.5) + ci(90, 90, 80, "none", GOLD, 0.8, 0.3)
    save("s8_aura", aura, 180, 180, ad)


# ================================================================ S9 Zaha — flowing lines
def s9():
    W, H, _ = aperture(9)
    rng = random.Random(1950)

    def curves(start, step, gold):
        out = ""
        for i in range(start, 48, step):
            t = i / 47
            pts = []
            for k in range(0, 34):
                x = -30 + k * 22
                u = x / W
                y = (70 + t * 260 + 62 * math.sin(u * 5.2 + t * 2.6) * (0.35 + 0.65 * t)
                     - 120 * (u ** 2) * (1 - t) + 30 * math.sin(u * 11 + t * 6) * 0.25)
                pts.append((x, y))
            op = 0.25 + 0.65 * (1 - abs(t - 0.5) * 1.6)
            col = GOLD if (gold and i % 6 == 0) else LINE
            out += f'<path d="{smooth(pts)}" fill="none" stroke="{col}" stroke-width="{1.3 if col == GOLD else 0.9}" opacity="{max(op, 0.2):.2f}"/>'
        return out
    ap_save("s9_flowA", 9, curves(0, 2, False), bg=True)
    figs = "".join(f'<g transform="translate({x} 352) scale(0.55)" fill="#EDE6DA" opacity="0.85"><circle cx="0" cy="-86" r="9"/>'
                   f'<path d="M-11,-74 L11,-74 L14,-36 L8,-36 L7,0 L1,0 L0,-30 L-1,0 L-7,0 L-8,-36 L-14,-36 Z"/></g>' for x in (300, 326))
    ap_save("s9_flowB", 9, f'<g filter="url(#glow)">{curves(1, 2, True)}</g>' + figs, bg=False)


# ================================================================ S10 future city (ink on light), full slide
def s10():
    W, H = 1333, 750
    INK = "#1A1917"
    g = 640
    s = ln((40, g), (1300, g), INK, 1.4)

    def tower(x, w, top, voids, sw=1.4):
        o = rc(x, top, w, g - top, "#F3EEE6", INK, sw)
        for k in range(int(top) + 14, g, 14):
            o += ln((x + 4, k), (x + w - 4, k), INK, 0.5, 0.35)
        for (vy, vh) in voids:
            o += rc(x + 1, vy, w - 2, vh, "#F6D9A0", INK, 1)
            for t in range(3):
                tx_ = x + 14 + t * (w - 28) / 2
                o += ln((tx_, vy + vh), (tx_, vy + vh - 14), INK, 1) + ci(tx_, vy + vh - 20, 9, "#9DBF8F", INK, 0.8)
        return o
    s += tower(790, 96, 270, [(350, 40), (480, 34)])
    s += tower(990, 104, 200, [(318, 58)])
    s += tower(1150, 96, 300, [(420, 36)])
    s += rc(1094, 384, 56, 12, "#F3EEE6", INK, 1.2)
    # courtyard block
    s += rc(420, 470, 330, g - 470, "#F3EEE6", INK, 1.4) + rc(530, 470, 110, g - 470, "#F6D9A0", INK, 1.2)
    for k in range(486, g, 16):
        s += ln((424, k), (526, k), INK, 0.5, 0.35) + ln((644, k), (746, k), INK, 0.5, 0.35)
    s += ln((585, g), (585, 560), INK, 1.2) + ci(585, 548, 20, "#9DBF8F", INK, 0.9)
    # pavilion canopy
    s += f'<path d="M110,560 Q230,520 350,560" fill="none" stroke="{INK}" stroke-width="2"/>'
    for x in (140, 230, 320):
        s += ln((x, 552 if x != 230 else 541), (x, g), INK, 1)
    # people, trees, birds
    rng = random.Random(10)
    for x in list(range(70, 400, 38)) + list(range(660, 1300, 46)):
        h = rng.uniform(14, 18)
        s += ci(x, g - h - 4, 3, INK) + ln((x, g - h), (x, g), INK, 1.6)
    for x in (60, 380, 900, 1270):
        s += ln((x, g), (x, g - 30), INK, 1.2) + ci(x, g - 42, 16, "#9DBF8F", INK, 0.9)
    for (x, y) in [(900, 150), (930, 135), (1210, 190)]:
        s += f'<path d="M{x},{y} q8,-8 16,0 q8,-8 16,0" fill="none" stroke="{INK}" stroke-width="1.2"/>'
    save("s10_city", s, W, H)


def misc():
    gd = '<radialGradient id="gl"><stop offset="0" stop-color="#E9B65A" stop-opacity="0.32"/><stop offset="0.6" stop-color="#E9B65A" stop-opacity="0.08"/><stop offset="1" stop-color="#E9B65A" stop-opacity="0"/></radialGradient>'
    save("glow", f'<rect width="800" height="800" fill="url(#gl)"/>', 800, 800, gd)
    vg = ('<radialGradient id="vg" cx="0.55" cy="0.45" r="0.8"><stop offset="0" stop-color="#1D1B18"/><stop offset="1" stop-color="#09090A"/></radialGradient>'
          '<filter id="gr"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 0.95  0 0 0 0 0.85  0 0 0 0.035 0"/></filter>')
    save("bg_ink", '<rect width="1333" height="750" fill="url(#vg)"/><rect width="1333" height="750" filter="url(#gr)"/>', 1333, 750, vg, kind="jpg")
    lg = ('<filter id="gr"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="6"/><feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0.05 0"/></filter>')
    save("bg_light", '<rect width="1333" height="750" fill="#F3EEE6"/><rect width="1333" height="750" filter="url(#gr)"/>', 1333, 750, lg, kind="jpg")


if __name__ == "__main__":
    for f in (misc, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10):
        f()
    json.dump({"layers": MAN, "apertures": AP}, open(os.path.join(OUT, "manifest.json"), "w"), indent=1)
    print(len(MAN), "layers")

"""Vector illustration layers for the animated deck.
Canvas units: 1 px = 0.01 in  (slide = 1333 x 750). Each layer -> SVG -> PNG (rendered by render.js).
"""
import math, random, json, os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "svg")
os.makedirs(OUT, exist_ok=True)
W, H = 1333, 750
C30 = math.cos(math.radians(30))
MANIFEST = []

PAPER, GRAPH, SEPIA = "#F3EDE2", "#2B2A28", "#7A5A3A"
NAVY, CYAN = "#0B2545", "#4CC9F0"
TEAL, BLUE, GOLD, GREEN, COPPER = "#0EA5A4", "#2F80ED", "#F2B33D", "#2BB673", "#C8743F"
VIOLET = "#8B5CF6"
MONO = "Consolas, 'DejaVu Sans Mono', monospace"


def save(name, body, w=W, h=H, defs="", kind="png"):
    s = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">'
         f'<defs>{defs}</defs>{body}</svg>')
    with open(os.path.join(OUT, name + ".svg"), "w", encoding="utf-8") as f:
        f.write(s)
    MANIFEST.append({"name": name, "w": w, "h": h, "kind": kind})


def P(points):
    return " ".join(f"{x:.1f},{y:.1f}" for x, y in points)


def poly(points, fill="none", stroke="none", sw=1, op=1, extra=""):
    return (f'<polygon points="{P(points)}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" '
            f'opacity="{op}" stroke-linejoin="round" {extra}/>')


def ln(a, b, stroke, sw=1, op=1, extra=""):
    return (f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" stroke="{stroke}" '
            f'stroke-width="{sw}" opacity="{op}" stroke-linecap="round" {extra}/>')


def polyline(points, stroke, sw=1, op=1, extra="", fill="none"):
    return (f'<polyline points="{P(points)}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" opacity="{op}" '
            f'stroke-linejoin="round" stroke-linecap="round" {extra}/>')


def rect(x, y, w, h, fill="none", stroke="none", sw=1, op=1, rx=0, extra=""):
    return (f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{rx}" fill="{fill}" '
            f'stroke="{stroke}" stroke-width="{sw}" opacity="{op}" {extra}/>')


def circ(cx, cy, r, fill="none", stroke="none", sw=1, op=1, extra=""):
    return f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" opacity="{op}" {extra}/>'


def txt(x, y, s, size=8, fill=GRAPH, anchor="middle", op=1, weight="normal", family=MONO):
    return (f'<text x="{x:.1f}" y="{y:.1f}" font-family="{family}" font-size="{size}" fill="{fill}" '
            f'text-anchor="{anchor}" opacity="{op}" font-weight="{weight}">{s}</text>')


GLOW = ('<filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2" result="b"/>'
        '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
        '<filter id="softglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>')


# ---------------------------------------------------------------- isometric helpers
class Iso:
    def __init__(self, ox, oy, sc):
        self.ox, self.oy, self.sc = ox, oy, sc

    def p(self, x, y, z=0):
        return (self.ox + (x - y) * C30 * self.sc, self.oy + (x + y) * 0.5 * self.sc - z * self.sc)

    def faces(self, b):
        x0, x1, y0, y1, z0, z1 = b
        p = self.p
        return {
            "top": [p(x0, y0, z1), p(x1, y0, z1), p(x1, y1, z1), p(x0, y1, z1)],
            "left": [p(x0, y1, z0), p(x1, y1, z0), p(x1, y1, z1), p(x0, y1, z1)],
            "right": [p(x1, y0, z0), p(x1, y1, z0), p(x1, y1, z1), p(x1, y0, z1)],
        }

    def edges(self, b, hidden=False):
        x0, x1, y0, y1, z0, z1 = b
        p = self.p
        vis = [(p(x0, y0, z1), p(x1, y0, z1)), (p(x1, y0, z1), p(x1, y1, z1)), (p(x1, y1, z1), p(x0, y1, z1)),
               (p(x0, y1, z1), p(x0, y0, z1)), (p(x0, y1, z0), p(x0, y1, z1)), (p(x1, y1, z0), p(x1, y1, z1)),
               (p(x1, y0, z0), p(x1, y0, z1)), (p(x0, y1, z0), p(x1, y1, z0)), (p(x1, y1, z0), p(x1, y0, z0))]
        hid = [(p(x0, y0, z0), p(x1, y0, z0)), (p(x0, y0, z0), p(x0, y1, z0)), (p(x0, y0, z0), p(x0, y0, z1))]
        return vis + (hid if hidden else [])

    def box(self, b, top, left, right, stroke="none", sw=0.6, op=1):
        f = self.faces(b)
        return (poly(f["left"], left, stroke, sw, op) + poly(f["right"], right, stroke, sw, op) +
                poly(f["top"], top, stroke, sw, op))


def sketch_line(a, b, rng, color="#3B3732", sw=1.3, op=0.85, over=(4, 13), passes=2):
    dx, dy = b[0] - a[0], b[1] - a[1]
    L = math.hypot(dx, dy) or 1
    ux, uy = dx / L, dy / L
    nx, ny = -uy, ux
    out = ""
    for i in range(passes):
        e1, e2 = rng.uniform(*over), rng.uniform(*over)
        j = 1.0 if i == 0 else 2.2
        a2 = (a[0] - ux * e1 + rng.uniform(-j, j), a[1] - uy * e1 + rng.uniform(-j, j))
        b2 = (b[0] + ux * e2 + rng.uniform(-j, j), b[1] + uy * e2 + rng.uniform(-j, j))
        bend = rng.uniform(-1.6, 1.6) * (L / 120)
        m = ((a2[0] + b2[0]) / 2 + nx * bend, (a2[1] + b2[1]) / 2 + ny * bend)
        w = sw if i == 0 else sw * 0.6
        o = op if i == 0 else op * 0.5
        out += (f'<path d="M{a2[0]:.1f},{a2[1]:.1f} Q{m[0]:.1f},{m[1]:.1f} {b2[0]:.1f},{b2[1]:.1f}" fill="none" '
                f'stroke="{color}" stroke-width="{w:.2f}" opacity="{o:.2f}" stroke-linecap="round"/>')
    return out


def hatch_clip(cid, points, spacing=7, angle=45, color="#3B3732", sw=0.7, op=0.35):
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    x0, x1, y0, y1 = min(xs) - 40, max(xs) + 40, min(ys) - 40, max(ys) + 40
    d = ""
    span = (x1 - x0) + (y1 - y0)
    t = math.tan(math.radians(angle))
    k = 0
    while k * spacing < span * 2:
        xa = x0 + k * spacing - (y1 - y0)
        d += f"M{xa:.1f},{y1:.1f} L{xa + (y1 - y0) / t:.1f},{y0:.1f} "
        k += 1
    return (f'<clipPath id="{cid}"><polygon points="{P(points)}"/></clipPath>'
            f'<path d="{d}" stroke="{color}" stroke-width="{sw}" opacity="{op}" clip-path="url(#{cid})" fill="none"/>')


# ---------------------------------------------------------------- shared building (S1, S5, S8)
BLD = [("plaza", (0, 560, 0, 320, 0, 5)), ("base", (70, 420, 70, 230, 5, 95)),
       ("upper", (170, 540, 50, 210, 95, 175)), ("roof", (150, 560, 30, 230, 175, 181))]
BOX = dict(BLD)


def building_wire(iso, color=CYAN, sw=1.4, faces=True, dots=True, plaza=True, glow=True):
    out = ""
    for name, b in BLD:
        if name == "plaza" and not plaza:
            continue
        f = iso.faces(b)
        if faces:
            for k in ("left", "right", "top"):
                out += poly(f[k], color, "none", 0, 0.07)
        for a, c in iso.edges(b, hidden=True):
            out += ln(a, c, color, sw, 0.95)
        if dots:
            x0, x1, y0, y1, z0, z1 = b
            for x in (x0, x1):
                for y in (y0, y1):
                    for z in (z0, z1):
                        q = iso.p(x, y, z)
                        out += circ(q[0], q[1], 2.1, "#C9F4FF")
    # fins
    x0, x1, y0, y1, z0, z1 = BOX["upper"]
    for x in range(185, 535, 17):
        out += ln(iso.p(x, y1, z0 + 2), iso.p(x, y1, z1 - 2), color, 0.6, 0.55)
    g = ' filter="url(#glow)"' if glow else ""
    return f"<g{g}>{out}</g>"


# ================================================================= S1  sketch -> reality
def s1():
    iso = Iso(930, 200, 0.78)
    rng = random.Random(7)
    sk = ""
    # faint construction lines
    for a, c in [((560, 0, 0), (-260, 0, 0)), ((0, 320, 0), (0, -200, 0)), ((560, 320, 0), (900, 320, 0))]:
        sk += ln(iso.p(*a), iso.p(*c), "#3B3732", 0.6, 0.18)
    for name, b in BLD:
        f = iso.faces(b)
        if name in ("base", "upper"):
            sk += hatch_clip(f"h{name}", f["left"], spacing=7, color="#3B3732", sw=0.6, op=0.28)
        for a, c in iso.edges(b):
            sk += sketch_line(a, c, rng)
    x0, x1, y0, y1, z0, z1 = BOX["upper"]
    for x in range(185, 535, 17):
        sk += sketch_line(iso.p(x, y1, z0 + 3), iso.p(x, y1, z1 - 3), rng, sw=0.8, op=0.6, over=(0, 3), passes=1)
    bx0, bx1, by0, by1, bz0, bz1 = BOX["base"]
    for x in range(95, 420, 25):
        sk += sketch_line(iso.p(x, by1, bz0), iso.p(x, by1, bz1), rng, sw=0.6, op=0.45, over=(0, 2), passes=1)
    for y in range(95, 230, 25):
        sk += sketch_line(iso.p(bx1, y, bz0), iso.p(bx1, y, bz1), rng, sw=0.6, op=0.45, over=(0, 2), passes=1)
    # pool & trees (scribbles)
    pool = [iso.p(30, 255, 5), iso.p(210, 255, 5), iso.p(210, 310, 5), iso.p(30, 310, 5)]
    for i in range(4):
        sk += sketch_line(pool[i], pool[(i + 1) % 4], rng, sw=0.9, op=0.7)
    for (tx, ty) in [(500, 285), (300, 292), (25, 150)]:
        c = iso.p(tx, ty, 5)
        sk += sketch_line(c, (c[0], c[1] - 30), rng, sw=1, op=0.7, over=(0, 2), passes=1)
        for k in range(4):
            r = 17 + rng.uniform(-3, 3)
            sk += (f'<ellipse cx="{c[0] + rng.uniform(-3, 3):.1f}" cy="{c[1] - 46 + rng.uniform(-3, 3):.1f}" rx="{r:.1f}" '
                   f'ry="{r * 0.9:.1f}" fill="none" stroke="#3B3732" stroke-width="0.8" opacity="0.55"/>')
    save("s1_sketch", sk, defs=GLOW)

    # ---- reality layer
    d = GLOW + ('<linearGradient id="g1m" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/>'
                '<stop offset="0.615" stop-color="#fff" stop-opacity="0"/><stop offset="0.76" stop-color="#fff" stop-opacity="1"/>'
                '<stop offset="1" stop-color="#fff" stop-opacity="1"/></linearGradient>'
                f'<mask id="m1" maskUnits="userSpaceOnUse" x="0" y="0" width="{W}" height="{H}"><rect width="{W}" height="{H}" fill="url(#g1m)"/></mask>'
                '<radialGradient id="sky" cx="0.5" cy="0.42" r="0.6"><stop offset="0" stop-color="#CFE6F5" stop-opacity="0.95"/>'
                '<stop offset="1" stop-color="#CFE6F5" stop-opacity="0"/></radialGradient>'
                '<linearGradient id="glL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9CC6E0"/><stop offset="1" stop-color="#4F7FA5"/></linearGradient>'
                '<linearGradient id="glR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C4E2F3"/><stop offset="1" stop-color="#7EA9CA"/></linearGradient>')
    r = f'<ellipse cx="1030" cy="330" rx="330" ry="250" fill="url(#sky)"/>'
    pl = iso.faces(BOX["plaza"])
    r += poly(pl["left"], "#CFC6B5") + poly(pl["right"], "#DCD4C4") + poly(pl["top"], "#E9E3D6")
    r += poly([iso.p(30, 255, 5), iso.p(210, 255, 5), iso.p(210, 310, 5), iso.p(30, 310, 5)], "#86BBDA")
    r += ln(iso.p(60, 270, 5), iso.p(150, 270, 5), "#E8F5FC", 1.2, 0.8) + ln(iso.p(90, 290, 5), iso.p(190, 290, 5), "#E8F5FC", 1.0, 0.6)
    tree = lambda tx, ty: (ln(iso.p(tx, ty, 5), iso.p(tx, ty, 45), "#6B4A2C", 2.4) +
                           circ(iso.p(tx, ty, 5)[0], iso.p(tx, ty, 5)[1] - 44, 19, "#5E8C4A") +
                           circ(iso.p(tx, ty, 5)[0] - 6, iso.p(tx, ty, 5)[1] - 50, 11, "#7CA963", op=0.9))
    r += tree(25, 150)
    # shadow of cantilever on plaza
    r += poly([iso.p(420, 70, 5), iso.p(560, 50, 5), iso.p(560, 230, 5), iso.p(420, 250, 5)], "#5A5246", op=0.18)
    b = BOX["base"]
    f = iso.faces(b)
    r += poly(f["left"], "url(#glL)") + poly(f["right"], "url(#glR)") + poly(f["top"], "#D5DFE5")
    x0, x1, y0, y1, z0, z1 = b
    for x in range(95, 420, 25):
        r += ln(iso.p(x, y1, z0), iso.p(x, y1, z1), "#E9F4FA", 0.9, 0.55)
    for y in range(95, 230, 25):
        r += ln(iso.p(x1, y, z0), iso.p(x1, y, z1), "#F1F8FC", 0.9, 0.55)
    r += ln(iso.p(x0, y1, 50), iso.p(x1, y1, 50), "#E9F4FA", 0.9, 0.6) + ln(iso.p(x1, y0, 50), iso.p(x1, y1, 50), "#F1F8FC", 0.9, 0.6)
    r += poly([iso.p(120, y1, 5), iso.p(170, y1, 5), iso.p(170, y1, 55), iso.p(120, y1, 55)], "#2E3F4E", op=0.85)
    for k in range(5):
        a = iso.p(100 + k * 60, y1, 20)
        r += ln(a, (a[0] + 28, a[1] - 34), "#FFFFFF", 2.2, 0.18)
    u = BOX["upper"]
    r += iso.box(u, "#DDB07E", "#B4783F", "#C98F57", "#6B4423", 0.5)
    x0, x1, y0, y1, z0, z1 = u
    for x in range(185, 535, 17):
        r += poly([iso.p(x, y1, z0 + 2), iso.p(x, y1 + 7, z0 + 2), iso.p(x, y1 + 7, z1 - 2), iso.p(x, y1, z1 - 2)], "#7A4A22")
        r += ln(iso.p(x, y1 + 7, z0 + 2), iso.p(x, y1 + 7, z1 - 2), "#A26A38", 0.8)
    for y in range(62, 205, 15):
        r += ln(iso.p(x1, y, z0 + 2), iso.p(x1, y, z1 - 2), "#8E5A2C", 1.4, 0.9)
    r += iso.box(BOX["roof"], "#EDEDEA", "#C3C3BE", "#D6D6D1", "#9E9E98", 0.5)
    r += tree(300, 292) + tree(500, 285)
    save("s1_reality", f'<g mask="url(#m1)">{r}</g>', defs=d)


# ================================================================= floor plan (S2, S4)
WALLS = [(6.0, 0.3, 6.15, 4.0), (6.0, 5.0, 6.15, 9.7), (6.15, 6.0, 11.0, 6.15), (11.0, 0.3, 11.15, 2.0),
         (11.0, 3.0, 11.15, 9.7), (11.15, 4.0, 15.7, 4.15)]
WINDOWS = [("h", 0, 1.5, 4.5), ("h", 0, 7.5, 10), ("h", 0, 12.5, 15), ("h", 9.7, 1.8, 4.8), ("h", 9.7, 12.4, 15),
           ("v", 0, 3.5, 6.5), ("v", 15.7, 5.5, 8.5)]
DOORS = [((7.3, 9.7), (7.3, 8.7), (8.3, 9.7), ("h", 9.7, 7.3, 8.3)),
         ((6.15, 4.0), (7.15, 4.0), (6.15, 5.0), None),
         ((11.15, 2.0), (12.15, 2.0), (11.15, 3.0), None)]


def plan(ox, oy, k, mode, bg=PAPER, clip=None):
    T = lambda x, y: (ox + x * k, oy + y * k)
    ink = mode == "ink"
    wall_c = "#1F1D1A" if ink else "#EAF7FF"
    win_c = "#1F1D1A" if ink else CYAN
    door_c = "#1F1D1A" if ink else "#F2D45C"
    furn_c = "#3A3631" if ink else "#7EE787"
    dim_c = "#3A3631" if ink else "#8FDFFF"
    grid_c = "#3A3631" if ink else "#FF7B7B"
    s = ""
    # grid lines + bubbles
    for gx, lab in [(0, "A"), (6, "B"), (11, "C"), (16, "D")]:
        s += ln(T(gx, -1.45), T(gx, 10.6), grid_c, 0.6, 0.35 if ink else 0.6, 'stroke-dasharray="10 3 2 3"')
        c = T(gx, -1.8)
        s += circ(c[0], c[1], 0.35 * k, "none" if not ink else bg, grid_c, 0.8) + txt(c[0], c[1] + 0.13 * k, lab, 0.36 * k, grid_c)
    for gy, lab in [(0, "1"), (4, "2"), (10, "3")]:
        s += ln(T(-1.45, gy), T(16.6, gy), grid_c, 0.6, 0.35 if ink else 0.6, 'stroke-dasharray="10 3 2 3"')
        c = T(-1.8, gy)
        s += circ(c[0], c[1], 0.35 * k, "none" if not ink else bg, grid_c, 0.8) + txt(c[0], c[1] + 0.13 * k, lab, 0.36 * k, grid_c)
    # dimensions
    for (a, bb, lab) in [(0, 6, "6000"), (6, 11, "5000"), (11, 16, "5000")]:
        s += ln(T(a, -0.9), T(bb, -0.9), dim_c, 0.6) + txt((T(a, 0)[0] + T(bb, 0)[0]) / 2, T(0, -1.02)[1], lab, 0.3 * k, dim_c)
    for x in (0, 6, 11, 16):
        p = T(x, -0.9)
        s += ln((p[0] - 3, p[1] + 3), (p[0] + 3, p[1] - 3), dim_c, 1.0) + ln(T(x, -0.2), T(x, -1.05), dim_c, 0.5, 0.7)
    for (a, bb, lab) in [(0, 4, "4000"), (4, 10, "6000")]:
        s += ln(T(-0.9, a), T(-0.9, bb), dim_c, 0.6)
        m = T(-1.02, (a + bb) / 2)
        s += f'<g transform="rotate(-90 {m[0]:.1f} {m[1]:.1f})">{txt(m[0], m[1], lab, 0.3 * k, dim_c)}</g>'
    for y in (0, 4, 10):
        p = T(-0.9, y)
        s += ln((p[0] - 3, p[1] + 3), (p[0] + 3, p[1] - 3), dim_c, 1.0)
    # walls
    o1, o2 = T(0, 0), T(16, 10)
    i1, i2 = T(0.3, 0.3), T(15.7, 9.7)
    if ink:
        s += (f'<path d="M{o1[0]},{o1[1]} H{o2[0]} V{o2[1]} H{o1[0]} Z M{i1[0]},{i1[1]} H{i2[0]} V{i2[1]} H{i1[0]} Z" '
              f'fill="{wall_c}" fill-rule="evenodd"/>')
        for (a, b2, c, d) in WALLS:
            p, q = T(a, b2), T(c, d)
            s += rect(p[0], p[1], q[0] - p[0], q[1] - p[1], wall_c)
    else:
        s += rect(o1[0], o1[1], o2[0] - o1[0], o2[1] - o1[1], "none", wall_c, 1.3)
        s += rect(i1[0], i1[1], i2[0] - i1[0], i2[1] - i1[1], "none", wall_c, 1.0)
        for (a, b2, c, d) in WALLS:
            p, q = T(a, b2), T(c, d)
            s += rect(p[0], p[1], q[0] - p[0], q[1] - p[1], "none", wall_c, 0.9)
    # windows
    for (o, at, a, bb) in WINDOWS:
        if o == "h":
            p, q = T(a, at), T(bb, at + 0.3)
        else:
            p, q = T(at, a), T(at + 0.3, bb)
        s += rect(p[0], p[1], q[0] - p[0], q[1] - p[1], bg if ink else NAVY, win_c, 0.8)
        if o == "h":
            s += ln(((p[0]), (p[1] + q[1]) / 2), (q[0], (p[1] + q[1]) / 2), win_c, 0.7)
        else:
            s += ln(((p[0] + q[0]) / 2, p[1]), ((p[0] + q[0]) / 2, q[1]), win_c, 0.7)
    # doors
    for hinge, leaf, end, gap in DOORS:
        if gap:
            _, at, a, bb = gap
            p, q = T(a, at), T(bb, at + 0.3)
            s += rect(p[0], p[1] - 0.5, q[0] - p[0], q[1] - p[1] + 1, bg if ink else NAVY)
        h, l2, e = T(*hinge), T(*leaf), T(*end)
        s += ln(h, l2, door_c, 1.1)
        s += f'<path d="M{l2[0]:.1f},{l2[1]:.1f} A{k:.1f},{k:.1f} 0 0 1 {e[0]:.1f},{e[1]:.1f}" fill="none" stroke="{door_c}" stroke-width="0.6" stroke-dasharray="3 2"/>'
    # stair
    p, q = T(12.0, 5.0), T(14.2, 9.2)
    s += rect(p[0], p[1], q[0] - p[0], q[1] - p[1], "none", furn_c, 0.7)
    yy = 5.0
    while yy < 9.2:
        s += ln(T(12.0, yy), T(14.2, yy), furn_c, 0.5, 0.85)
        yy += 0.28
    s += ln(T(13.1, 9.0), T(13.1, 5.3), furn_c, 0.6) + poly([T(12.95, 5.6), T(13.1, 5.25), T(13.25, 5.6)], furn_c)
    s += ln(T(12.0, 7.4), T(14.2, 6.9), furn_c, 0.9)
    # furniture
    fs = 0.6
    for (a, b2, c, d) in [(2.0, 6.5, 4.0, 7.7), (0.8, 1.2, 1.6, 3.9), (12.5, 0.8, 15.0, 3.0), (6.45, 0.55, 10.6, 1.15),
                          (7.5, 2.3, 9.5, 3.1)]:
        p, q = T(a, b2), T(c, d)
        s += rect(p[0], p[1], q[0] - p[0], q[1] - p[1], "none", furn_c, fs, 0.85, rx=1.5)
    for cx in (2.4, 3.0, 3.6):
        for cy in (6.25, 7.95):
            c = T(cx, cy)
            s += rect(c[0] - 0.18 * k, c[1] - 0.15 * k, 0.36 * k, 0.3 * k, "none", furn_c, 0.5, 0.85, rx=1)
    for (a, b2) in [(12.7, 0.9), (13.9, 0.9)]:
        p = T(a, b2)
        s += rect(p[0], p[1], 0.9 * k, 0.45 * k, "none", furn_c, 0.5, 0.85, rx=2)
    c = T(8.6, 0.85)
    s += circ(c[0], c[1], 0.18 * k, "none", furn_c, 0.5)
    # north arrow
    c = T(17.4, 8.6)
    s += circ(c[0], c[1], 0.45 * k, "none", grid_c, 0.7) + poly([(c[0], c[1] - 0.6 * k), (c[0] - 0.18 * k, c[1] + 0.2 * k), (c[0], c[1]), (c[0] + 0.18 * k, c[1] + 0.2 * k)], grid_c)
    if clip:
        return f'<g clip-path="url(#{clip})">{s}</g>'
    return s


def cad_snaps(ox, oy, k):
    T = lambda x, y: (ox + x * k, oy + y * k)
    s = ""
    for (x, y) in [(0, 0), (16, 0), (16, 10), (0, 10), (6, 6), (11, 6), (11, 4), (15.7, 4.15), (6.15, 6.15)]:
        c = T(x, y)
        s += rect(c[0] - 3.5, c[1] - 3.5, 7, 7, "none", "#F2D45C", 0.9)
    return s


# ================================================================= S2 drafting table (canvas 1500 wide for pan)
def s2():
    w = 1500
    d = ('<linearGradient id="wood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8A6440"/><stop offset="1" stop-color="#5E4128"/></linearGradient>'
         '<linearGradient id="light" x1="0" y1="0" x2="1" y2="0.6"><stop offset="0" stop-color="#FFF4DC" stop-opacity="0.42"/>'
         '<stop offset="0.55" stop-color="#FFF4DC" stop-opacity="0.06"/><stop offset="1" stop-color="#000" stop-opacity="0.22"/></linearGradient>'
         '<linearGradient id="roll" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3D78C4"/><stop offset="0.5" stop-color="#2A5DA8"/><stop offset="1" stop-color="#173F7A"/></linearGradient>'
         '<filter id="sh" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="6" dy="9" stdDeviation="7" flood-color="#000" flood-opacity="0.35"/></filter>'
         '<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0.25  0 0 0 0 0.18  0 0 0 0 0.1  0 0 0 0.10 0"/></filter>')
    rng = random.Random(11)
    s = rect(0, 0, w, H, "url(#wood)")
    for i in range(46):
        y = i * 17 + rng.uniform(-4, 4)
        s += (f'<path d="M0,{y:.1f} C{w * 0.3:.0f},{y + rng.uniform(-9, 9):.1f} {w * 0.6:.0f},{y + rng.uniform(-9, 9):.1f} {w},{y + rng.uniform(-6, 6):.1f}" '
              f'stroke="#3E2A18" stroke-width="{rng.uniform(0.6, 1.8):.1f}" opacity="{rng.uniform(0.10, 0.25):.2f}" fill="none"/>')
    s += rect(0, 0, w, H, "#fff", extra='filter="url(#grain)"')
    # drawing sheet
    sx, sy, sw_, sh_ = 470, 70, 960, 610
    sheet = rect(sx, sy, sw_, sh_, "#F2EAD8") + rect(sx + 18, sy + 18, sw_ - 36, sh_ - 36, "none", "#1F1D1A", 1.1)
    tb = (sx + sw_ - 18 - 230, sy + sh_ - 18 - 70)
    sheet += rect(tb[0], tb[1], 230, 70, "#F2EAD8", "#1F1D1A", 0.9) + ln((tb[0], tb[1] + 25), (tb[0] + 230, tb[1] + 25), "#1F1D1A", 0.6)
    sheet += ln((tb[0] + 150, tb[1] + 25), (tb[0] + 150, tb[1] + 70), "#1F1D1A", 0.6)
    sheet += txt(tb[0] + 8, tb[1] + 17, "PROJECT · RESIDENCE", 9, "#1F1D1A", "start") + txt(tb[0] + 8, tb[1] + 45, "GROUND FLOOR PLAN", 8, "#1F1D1A", "start")
    sheet += txt(tb[0] + 8, tb[1] + 60, "SCALE 1:100", 7, "#1F1D1A", "start") + txt(tb[0] + 190, tb[1] + 55, "A-02", 13, "#1F1D1A", weight="bold")
    sheet += plan(sx + 150, sy + 150, 38, "ink", bg="#F2EAD8")
    s += f'<g transform="rotate(-2.5 {sx + sw_ / 2} {sy + sh_ / 2})" filter="url(#sh)">{sheet}</g>'
    # T-square
    ts = (rect(380, 92, 1120, 34, "#E4CB95", "#A9874A", 1) +
          "".join(ln((420 + i * 10, 126), (420 + i * 10, 126 - (9 if i % 10 == 0 else 5 if i % 5 == 0 else 3)), "#6E5428", 0.7) for i in range(108)) +
          rect(372, 40, 46, 170, "#8B5E34", "#5E3D1E", 1) + circ(395, 109, 4, "#5E3D1E"))
    s += f'<g filter="url(#sh)">{ts}</g>'
    # set squares
    s += (f'<g filter="url(#sh)"><polygon points="1150,250 1420,250 1150,520" fill="#9FD6EA" fill-opacity="0.35" stroke="#4E9CBB" stroke-width="1.5"/>'
          f'<polygon points="1205,305 1335,305 1205,435" fill="none" stroke="#4E9CBB" stroke-width="1"/></g>')
    s += (f'<g filter="url(#sh)" transform="rotate(12 1290 600)"><polygon points="1180,560 1420,560 1180,700" fill="#F2B8A0" fill-opacity="0.35" stroke="#C07A60" stroke-width="1.5"/></g>')
    # technical pens
    for i, (col, x, y) in enumerate([("#C0392B", 600, 640), ("#2E86C1", 640, 662), ("#27AE60", 690, 684)]):
        g = (rect(x, y, 190, 13, "#2F2F33", rx=6) + rect(x + 120, y, 22, 13, col) + rect(x + 190, y + 4, 26, 5, "#B9B9B9", rx=2) +
             ln((x + 216, y + 6.5), (x + 232, y + 6.5), "#888", 1.4))
        s += f'<g filter="url(#sh)" transform="rotate(-14 {x} {y})">{g}</g>'
    # compass
    s += (f'<g filter="url(#sh)"><line x1="1330" y1="560" x2="1290" y2="690" stroke="#A7A9AC" stroke-width="5" stroke-linecap="round"/>'
          f'<line x1="1330" y1="560" x2="1385" y2="685" stroke="#C9CBCE" stroke-width="5" stroke-linecap="round"/>'
          f'<circle cx="1330" cy="556" r="9" fill="#D4AF37" stroke="#8C7322"/><rect x="1326" y="520" width="8" height="30" fill="#8C7322"/></g>')
    # scale ruler
    sr = rect(860, 700, 420, 26, "#ECE6D3", "#A79D82", 1) + "".join(
        ln((870 + i * 8, 700), (870 + i * 8, 700 + (10 if i % 5 == 0 else 5)), "#5B5440", 0.6) for i in range(51))
    s += f'<g filter="url(#sh)" transform="rotate(-1.5 1070 713)">{sr}</g>'
    # rolled blueprint
    s += (f'<g filter="url(#sh)" transform="rotate(-6 1000 730)"><rect x="760" y="712" width="360" height="40" rx="20" fill="url(#roll)"/>'
          f'<ellipse cx="1120" cy="732" rx="9" ry="20" fill="#1B4C92" stroke="#9FC3F2" stroke-width="1"/>'
          + "".join(ln((790 + i * 28, 716), (790 + i * 28, 748), "#CFE2FF", 0.6, 0.6) for i in range(12)) + '</g>')
    s += rect(0, 0, w, H, "url(#light)")
    save("s2_table", s, w=w, defs=d, kind="jpg")


# ================================================================= S3 manual revisions
def stair_geo(ox, oy, k):
    T = lambda x, y: (ox + x * k, oy - y * k)
    prof = [(0, 0)]
    for i in range(18):
        x, y = i * 0.28, (i + 1) * 0.175
        prof.append((x, y))
        if i < 17:
            prof.append((x + 0.28, y))
    return T, prof


def s3():
    k, ox, oy = 84, 130, 585
    T, prof = stair_geo(ox, oy, k)
    d = ('<radialGradient id="lamp" cx="0.12" cy="0.08" r="0.95"><stop offset="0" stop-color="#FFD9A0" stop-opacity="0.62"/>'
         '<stop offset="0.45" stop-color="#E9A65A" stop-opacity="0.18"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>'
         '<linearGradient id="desk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4A3424"/><stop offset="1" stop-color="#1C130D"/></linearGradient>'
         '<filter id="sh" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="8" dy="11" stdDeviation="9" flood-color="#000" flood-opacity="0.45"/></filter>'
         '<pattern id="conc" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="9" stroke="#3A3631" stroke-width="0.6"/></pattern>')
    s = rect(0, 0, W, H, "url(#desk)")
    sheet = rect(40, 50, 760, 670, "#EFE6D2")
    g = ""
    # slabs
    for (x0, x1, top) in [(-0.95, 1.4, 0), (4.76, 6.3, 3.15)]:
        p, q = T(x0, top), T(x1, top - 0.25)
        g += rect(p[0], p[1], q[0] - p[0], q[1] - p[1], "url(#conc)", "#1F1D1A", 1.2)
    # stair waist
    waist = [T(*pt) for pt in prof] + [T(4.76, 3.15), T(4.76, 2.9), T(0.35, -0.25), T(0, -0.25)]
    g += poly(waist, "url(#conc)", "#1F1D1A", 1.3)
    g += polyline([T(*pt) for pt in prof], "#1F1D1A", 1.8)
    # handrail + balusters
    g += ln(T(-0.1, 1.05), T(4.9, 4.05), "#1F1D1A", 1.6)
    for i in range(0, 18, 2):
        x, y = i * 0.28 + 0.14, (i + 1) * 0.175
        g += ln(T(x, y), T(x, y + 0.9 + 0.0), "#1F1D1A", 0.8)
    # levels
    for (x, y, lab) in [(-0.6, 0, "+0.000"), (5.75, 3.15, "+3.150")]:
        c = T(x, y)
        g += poly([(c[0] - 6, c[1] - 9), (c[0] + 6, c[1] - 9), (c[0], c[1])], "#1F1D1A") + txt(c[0] + 10, c[1] - 12, lab, 11, "#1F1D1A", "start")
    # dimension strings
    a, b2 = T(0, -0.8), T(4.76, -0.8)
    g += ln(a, b2, "#3A3631", 0.7) + txt((a[0] + b2[0]) / 2, a[1] - 6, "17 × 280 = 4760", 11, "#3A3631")
    for x in (0, 4.76):
        p = T(x, -0.8)
        g += ln((p[0] - 4, p[1] + 4), (p[0] + 4, p[1] - 4), "#3A3631", 1)
    a, b2 = T(6.6, 0), T(6.6, 3.15)
    g += ln(a, b2, "#3A3631", 0.7)
    m = T(6.75, 1.575)
    g += f'<g transform="rotate(-90 {m[0]:.1f} {m[1]:.1f})">{txt(m[0], m[1], "18 × 175 = 3150", 11, "#3A3631")}</g>'
    # detail bubble
    c = T(8 * 0.28 + 0.1, 9 * 0.175)
    g += circ(c[0], c[1], 40, "none", "#1F1D1A", 1, extra='stroke-dasharray="5 3"')
    g += ln((c[0] + 28, c[1] - 28), (c[0] + 120, c[1] - 120), "#1F1D1A", 0.8)
    g += circ(c[0] + 136, c[1] - 136, 17, "#EFE6D2", "#1F1D1A", 1) + ln((c[0] + 119, c[1] - 136), (c[0] + 153, c[1] - 136), "#1F1D1A", 0.7)
    g += txt(c[0] + 136, c[1] - 140, "2", 11, "#1F1D1A") + txt(c[0] + 136, c[1] - 123, "A-12", 8, "#1F1D1A")
    g += txt(80, 92, "SECTION A–A · MAIN STAIR · 1:50", 13, "#1F1D1A", "start", weight="bold")
    sheet_g = f'<g transform="rotate(-2 420 385)" filter="url(#sh)">{sheet}{g}</g>'
    s += sheet_g
    # pencil + crumbs
    pen = (polygon_pencil := (f'<g transform="translate(-20 -175) rotate(-24 640 690) translate(40 0) scale(0.8 1)" filter="url(#sh)"><rect x="520" y="682" width="200" height="16" fill="#F2C14E" stroke="#B68A21" stroke-width="0.8"/>'
                              f'<rect x="505" y="682" width="18" height="16" fill="#E08A9B"/><rect x="519" y="682" width="6" height="16" fill="#B7B7B7"/>'
                              f'<polygon points="720,682 748,690 720,698" fill="#E9C99A"/><polygon points="740,688 748,690 740,692" fill="#2B2A28"/></g>'))
    s += pen
    rng = random.Random(5)
    for i in range(14):
        x, y = 600 + rng.uniform(-50, 70), 470 + rng.uniform(-30, 40)
        s += f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{rng.uniform(2, 5):.1f}" ry="{rng.uniform(1, 2.5):.1f}" fill="#C9A9A6" opacity="0.8" transform="rotate({rng.uniform(0, 180):.0f} {x:.1f} {y:.1f})"/>'
    s += rect(0, 0, W, H, "url(#lamp)")
    save("s3_desk", s, defs=d, kind="jpg")

    # tracing layers
    sheetfill = 'fill="#F7E7A0" fill-opacity="0.30" stroke="#C9B060" stroke-opacity="0.55" stroke-width="1"'
    rng = random.Random(9)
    # L1: handrail redraw + balusters every tread
    l1 = f'<rect x="70" y="80" width="660" height="610" {sheetfill}/>'
    l1 += sketch_line(T(-0.1, 1.15), T(4.9, 4.15), rng, "#4A4038", 1.4, 0.8)
    for i in range(1, 18, 2):
        x, y = i * 0.28 + 0.14, (i + 1) * 0.175
        l1 += sketch_line(T(x, y), T(x, y + 1.0), rng, "#4A4038", 0.8, 0.7, over=(0, 3), passes=1)
    save("s3_trace1", f'<g transform="rotate(-3.5 400 385)">{l1}</g>')
    # L2: enlarged nosing detail
    l2 = f'<rect x="95" y="110" width="610" height="560" {sheetfill}/>'
    bx, by = 150, 170
    det = [(bx, by + 150), (bx, by + 90), (bx + 120, by + 90), (bx + 120, by + 30), (bx + 240, by + 30)]
    l2 += polyline(det, "#3F362E", 2.2, 0.85)
    l2 += rect(bx + 104, by + 84, 20, 10, "#3F362E", op=0.7) + rect(bx + 224, by + 24, 20, 10, "#3F362E", op=0.7)
    l2 += polyline([(bx, by + 170), (bx + 120, by + 110), (bx + 240, by + 50)], "#3F362E", 1, 0.6, 'stroke-dasharray="6 4"')
    l2 += circ(bx + 120, by + 90, 70, "none", "#3F362E", 1, 0.6)
    l2 += txt(bx + 120, by + 205, "DETAIL 2 · NOSING · 1:5", 12, "#3F362E", op=0.8, weight="bold")
    save("s3_trace2", f'<g transform="rotate(2.5 400 385)">{l2}</g>')
    # L3: corrected dimensions
    l3 = f'<rect x="120" y="150" width="620" height="560" {sheetfill}/>'
    a, b2 = T(0, -0.55), T(4.76, -0.55)
    l3 += sketch_line(a, b2, rng, "#4A4038", 1, 0.75)
    l3 += txt((a[0] + b2[0]) / 2 + 60, a[1] - 26, "17 × 290 = 4930", 12, "#4A4038", op=0.85)
    l3 += sketch_line((a[0] + 150, a[1] - 46), (a[0] + 290, a[1] - 36), rng, "#4A4038", 1.2, 0.8, passes=1)
    l3 += sketch_line(T(5.2, 2.2), T(5.2, 3.6), rng, "#4A4038", 1, 0.7)
    save("s3_trace3", f'<g transform="rotate(-1.2 430 430)">{l3}</g>')
    # red revision cloud
    c = T(8 * 0.28 + 0.1, 9 * 0.175)
    cx, cy, rx, ry, n = c[0] + 10, c[1] - 10, 95, 70, 16
    dpath = ""
    for i in range(n):
        a0 = 2 * math.pi * i / n
        a1 = 2 * math.pi * (i + 1) / n
        p0 = (cx + rx * math.cos(a0), cy + ry * math.sin(a0))
        p1 = (cx + rx * math.cos(a1), cy + ry * math.sin(a1))
        if i == 0:
            dpath += f"M{p0[0]:.1f},{p0[1]:.1f} "
        dpath += f"A14,14 0 0 1 {p1[0]:.1f},{p1[1]:.1f} "
    cl = f'<path d="{dpath}" fill="none" stroke="#D7262B" stroke-width="2.6" stroke-linejoin="round"/>'
    cl += poly([(cx + 92, cy - 96), (cx + 120, cy - 96), (cx + 106, cy - 120)], "none", "#D7262B", 2.2) + txt(cx + 106, cy - 100, "2", 13, "#D7262B", weight="bold")
    cl += ln((cx - 90, cy + 40), (cx - 150, cy + 95), "#D7262B", 2) + poly([(cx - 90, cy + 40), (cx - 104, cy + 44), (cx - 96, cy + 54)], "#D7262B")
    save("s3_cloud", f'<g transform="rotate(-2 420 385)">{cl}</g>')


# ================================================================= S4 2D CAD
def s4():
    k, ox, oy = 30, 120, 228
    d = ('<clipPath id="cadclip"><rect x="333" y="0" width="334" height="750"/></clipPath>'
         '<linearGradient id="seam" x1="0" x2="1"><stop offset="0" stop-color="#4CC9F0" stop-opacity="0"/><stop offset="0.5" stop-color="#4CC9F0" stop-opacity="0.9"/><stop offset="1" stop-color="#4CC9F0" stop-opacity="0"/></linearGradient>'
         '<filter id="sh" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="5" dy="0" stdDeviation="8" flood-color="#000" flood-opacity="0.35"/></filter>' + GLOW)
    paper = rect(0, 0, 667, H, "#F1E9D8") + plan(ox, oy, k, "ink", bg="#F1E9D8")
    paper += txt(60, 70, "GROUND FLOOR PLAN · INK ON PAPER", 11, "#3A3631", "start", weight="bold")
    save("s4_paper", paper, defs=d, kind="png")
    g = rect(333, 0, 334, H, NAVY)
    for x in range(333, 668, 15):
        g += ln((x, 0), (x, H), "#173A66" if (x - 333) % 75 else "#21507F", 0.6)
    for y in range(0, 751, 15):
        g += ln((333, y), (667, y), "#173A66" if y % 75 else "#21507F", 0.6)
    g += plan(ox, oy, k, "cad", bg=NAVY) + cad_snaps(ox, oy, k)
    g += txt(355, 70, "LAYER: A-WALL  ·  SNAP: ON  ·  ORTHO: ON", 11, "#8FDFFF", "start")
    cad = f'<g clip-path="url(#cadclip)">{g}</g>' + rect(330, 0, 6, H, "url(#seam)", extra='filter="url(#glow)"')
    save("s4_cad", cad, defs=d)
    ch = (ln((0, 30), (60, 30), "#BDF2FF", 1.2) + ln((30, 0), (30, 60), "#BDF2FF", 1.2) + rect(24, 24, 12, 12, "none", "#FFFFFF", 1.5))
    save("s4_cursor", f'<g filter="url(#glow)">{ch}</g>', w=60, h=60, defs=GLOW)


# ================================================================= S5 paper -> 3D
def s5():
    iso = Iso(965, 255, 0.62)
    seam = [(1060, 30), (880, 730)]
    d = (GLOW + f'<clipPath id="cl"><polygon points="560,0 {seam[0][0]},0 {seam[1][0]},750 560,750"/></clipPath>'
         f'<clipPath id="cr"><polygon points="{seam[0][0]},0 1333,0 1333,750 {seam[1][0]},750"/></clipPath>'
         '<filter id="sh" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="6" dy="10" stdDeviation="9" flood-color="#000" flood-opacity="0.45"/></filter>')
    # paper world
    a = ""
    sheet = rect(700, 230, 600, 400, "#F1E9D8") + plan(780, 330, 15, "ink", bg="#F1E9D8")
    a += f'<g transform="rotate(-8 1000 430)" filter="url(#sh)">{sheet}</g>'
    for name, b in BLD[1:]:
        a += iso.box(b, "#FBFBF8", "#DCDCD5", "#ECECE6", "#9C9C94", 0.8)
    a += f'<g filter="url(#sh)"></g>'
    save("s5_paper", f'<g clip-path="url(#cl)">{a}</g>' + f'<line x1="{seam[0][0]}" y1="{seam[0][1]}" x2="928" y2="545" stroke="#7FDBFF" stroke-width="2.5" filter="url(#glow)"/>', defs=d)
    # digital world
    grid = ""
    for x in range(-120, 700, 40):
        grid += ln(iso.p(x, -120, 0), iso.p(x, 440, 0), CYAN, 0.6, 0.22)
    for y in range(-120, 460, 40):
        grid += ln(iso.p(-120, y, 0), iso.p(680, y, 0), CYAN, 0.6, 0.22)
    gizmo = iso.p(-60, 380, 0)
    giz = (ln(gizmo, (gizmo[0] + 34, gizmo[1] + 19), "#FF6B6B", 2) + ln(gizmo, (gizmo[0] - 34, gizmo[1] + 19), "#7EE787", 2) +
           ln(gizmo, (gizmo[0], gizmo[1] - 40), "#4C9AFF", 2))
    dig = grid + building_wire(iso, plaza=False) + giz
    save("s5_digital", f'<g clip-path="url(#cr)">{dig}</g>', defs=d)
    save("s5_digital_full", grid + building_wire(iso, plaza=False) + giz, defs=d)


# ================================================================= S6 BIM exploded
def s6():
    iso = Iso(430, 368, 0.75)
    d = GLOW + '<filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#0B2545" flood-opacity="0.18"/></filter>'
    l1 = iso.box((-10, 330, -10, 210, 0, 8), "#C5CAD0", "#9AA0A6", "#B3B9BF", "#7D848B", 0.6)
    for x in (20, 120, 220, 300):
        for y in (20, 100, 180):
            l1 += iso.box((x, x + 10, y, y + 10, 8, 42), "#C9CED3", "#8E959C", "#A9AFB5", "#6F767D", 0.4)
    save("s6_l1", f'<g filter="url(#sh)">{l1}</g>', defs=d)
    l2 = iso.box((0, 320, 0, 200, 72, 80), "#DDE1E6", "#AEB4BB", "#C4CAD0", "#8A9199", 0.6)
    for y in (20, 100, 180):
        l2 += iso.box((10, 310, y - 3, y + 3, 80, 87), "#8794A3", "#5D6876", "#707C8A", "none")
    for x in (20, 120, 220, 300):
        l2 += iso.box((x - 3, x + 3, 10, 190, 80, 87), "#8794A3", "#5D6876", "#707C8A", "none")
    save("s6_l2", f'<g filter="url(#sh)">{l2}</g>', defs=d)
    l3 = iso.box((10, 310, 55, 80, 116, 132), "#7FB2F5", "#2F6FD6", "#4C8BE8", "#1F4F9E", 0.5)
    l3 += iso.box((150, 170, 80, 190, 118, 130), "#7FB2F5", "#2F6FD6", "#4C8BE8", "#1F4F9E", 0.5)
    for (y, col, hi) in [(118, "#E5484D", "#FF9EA1"), (132, "#F28C28", "#FFC58A")]:
        a, b = iso.p(10, y, 124), iso.p(310, y, 124)
        l3 += ln(a, b, col, 7) + ln((a[0], a[1] - 2), (b[0], b[1] - 2), hi, 1.6, 0.8)
    l3 += iso.box((10, 310, 176, 192, 120, 123), "#F7D774", "#C9A227", "#E2BD3D", "#A88512", 0.4)
    for x in range(20, 310, 22):
        l3 += ln(iso.p(x, 176, 123), iso.p(x, 192, 123), "#A88512", 0.8)
    save("s6_l3", f'<g filter="url(#sh)">{l3}</g>', defs=d)
    f = iso.faces((0, 320, 0, 200, 166, 210))
    l4 = poly(f["left"], "#7FC8F8", "#3D7EA6", 0.8, 0.45) + poly(f["right"], "#A9DBFA", "#3D7EA6", 0.8, 0.45)
    for x in range(0, 321, 32):
        l4 += ln(iso.p(x, 200, 166), iso.p(x, 200, 210), "#2F5F80", 0.9, 0.8)
    for y in range(0, 201, 25):
        l4 += ln(iso.p(320, y, 166), iso.p(320, y, 210), "#2F5F80", 0.9, 0.8)
    l4 += ln(iso.p(0, 200, 188), iso.p(320, 200, 188), "#2F5F80", 0.8, 0.7) + ln(iso.p(320, 0, 188), iso.p(320, 200, 188), "#2F5F80", 0.8, 0.7)
    l4 += iso.box((-6, 326, -6, 206, 210, 217), "#5B6573", "#3C4450", "#4A5360", "#2E343D", 0.5)
    l4 += iso.box((40, 90, 30, 70, 217, 230), "#9AA3AE", "#6B7480", "#808A96", "none")
    l4 += iso.box((200, 260, 120, 160, 217, 226), "#9AA3AE", "#6B7480", "#808A96", "none")
    save("s6_l4", f'<g filter="url(#sh)">{l4}</g>', defs=d)
    l5 = ""
    pts = [(0, 200, 8), (0, 200, 80), (0, 200, 124), (0, 200, 210), (320, 0, 8), (320, 0, 80), (320, 0, 124), (320, 0, 210), (320, 200, 217)]
    for a, b in [(0, 1), (1, 2), (2, 3), (4, 5), (5, 6), (6, 7)]:
        l5 += ln(iso.p(*pts[a]), iso.p(*pts[b]), TEAL, 1.2, 0.9, 'stroke-dasharray="4 4"')
    for q in pts:
        c = iso.p(*q)
        l5 += circ(c[0], c[1], 9, "none", TEAL, 1.4, 0.55) + circ(c[0], c[1], 4.5, TEAL)
    save("s6_data", f'<g filter="url(#glow)">{l5}</g>', defs=d)
    MANIFEST.append({"name": "_s6_points", "points": {
        "geometry": iso.p(320, 100, 188), "mep": iso.p(310, 132, 124), "data": iso.p(320, 0, 80),
        "clash": iso.p(160, 184, 125)}})


# ================================================================= S7 smart facade
def s7():
    d = ('<linearGradient id="sky7" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E4F2FC"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>'
         '<linearGradient id="glass7" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D6EEFA"/><stop offset="1" stop-color="#8FC2E2"/></linearGradient>'
         '<linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFE7A8" stop-opacity="0"/><stop offset="0.5" stop-color="#FFE7A8" stop-opacity="0.55"/><stop offset="1" stop-color="#FFE7A8" stop-opacity="0"/></linearGradient>'
         '<pattern id="mash" width="26" height="26" patternUnits="userSpaceOnUse">'
         '<path d="M13,1 L16,10 L25,13 L16,16 L13,25 L10,16 L1,13 L10,10 Z" fill="none" stroke="#8C5A2B" stroke-width="2"/>'
         '<rect x="9" y="9" width="8" height="8" fill="none" stroke="#8C5A2B" stroke-width="1.4" transform="rotate(45 13 13)"/></pattern>'
         '<filter id="sh" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#0B2545" flood-opacity="0.2"/></filter>')
    s = rect(0, 0, W, 600, "url(#sky7)")
    # ground
    s += rect(0, 560, W, 190, "#E6EFE3") + ln((0, 560), (W, 560), "#9DB59A", 2)
    # building
    bx, by, bw, fh, nf = 110, 560, 520, 78, 5
    top = by - fh * nf
    b = rect(bx, top, bw, fh * nf, "url(#glass7)")
    for i in range(9):
        b += ln((bx + i * bw / 8, top), (bx + i * bw / 8, by), "#5B7A8C", 1.4)
    for j in range(nf + 1):
        b += rect(bx - 8, by - j * fh - 5, bw + 16, 10, "#8A939B")
    for i in range(8):
        for j in range(nf):
            x0 = bx + i * bw / 8 + 6
            y0 = by - (j + 1) * fh + 14
            b += ln((x0, y0 + 40), (x0 + 22, y0 + 4), "#FFFFFF", 3, 0.25)
    # mashrabiya screen on bays 0-2, floors 2-4
    b += rect(bx, top + 5, bw * 3 / 8, fh * 3 - 10, "url(#mash)", op=0.95)
    b += rect(bx, top + 5, bw * 3 / 8, fh * 3 - 10, "none", "#6E4520", 2)
    # roof: parapet, solar panels, planting
    b += rect(bx - 12, top - 14, bw + 24, 12, "#7D868F")
    for i in range(5):
        x = bx + 250 + i * 50
        b += poly([(x, top - 14), (x + 40, top - 14), (x + 30, top - 40), (x - 10, top - 40)], "#1E3A66", "#9DB8E0", 0.8)
    rng = random.Random(4)
    for i in range(14):
        x = bx + 10 + i * 17 + rng.uniform(-3, 3)
        r = rng.uniform(9, 15)
        b += circ(x, top - 14 - r * 0.6, r, rng.choice(["#3F8F5A", "#5FB06A", "#2E7D4F"]))
    s += f'<g filter="url(#sh)">{b}</g>'
    # trees
    for (x, r) in [(55, 34), (680, 30), (640, 22)]:
        s += rect(x - 4, 560 - 60, 8, 60, "#6B4A2C") + circ(x, 560 - 70, r, "#4E9A5E") + circ(x - 10, 560 - 82, r * 0.6, "#6DB46F")
    save("s7_building", s, defs=d)
    # sun path + airflow
    sp = '<path d="M70,300 C190,40 560,40 700,300" fill="none" stroke="#F2B33D" stroke-width="2" stroke-dasharray="7 7" opacity="0.9"/>'
    save("s7_sunpath", sp, defs=d)
    af = ""
    for i, y in enumerate((250, 330, 410)):
        af += (f'<path d="M20,{y} C150,{y - 40} 300,{y + 40} 450,{y} S650,{y - 30} 710,{y - 10}" fill="none" stroke="#2BB673" '
               f'stroke-width="2.4" stroke-dasharray="14 9" opacity="0.85" stroke-linecap="round"/>')
        af += poly([(712, y - 10), (698, y - 18), (700, y - 2)], "#2BB673", op=0.85)
    save("s7_air", af, defs=d)
    save("s7_sweep", rect(-60, 0, 360, 600, "url(#sweep)", extra='transform="skewX(-18)"'), w=720, h=600, defs=d)
    sun = ('<radialGradient id="sg"><stop offset="0" stop-color="#FFE7A8"/><stop offset="0.55" stop-color="#F2B33D"/><stop offset="1" stop-color="#F2B33D" stop-opacity="0"/></radialGradient>')
    sb = circ(40, 40, 40, "url(#sg)") + circ(40, 40, 17, "#F7C14C") + "".join(
        ln((40 + 22 * math.cos(a), 40 + 22 * math.sin(a)), (40 + 31 * math.cos(a), 40 + 31 * math.sin(a)), "#F2B33D", 2.4)
        for a in [i * math.pi / 4 for i in range(8)])
    save("s7_sun", sb, w=80, h=80, defs=sun)
    MANIFEST.append({"name": "_s7_geo", "bx": bx, "by": by, "bw": bw, "fh": fh, "nf": nf})


# ================================================================= S8 hub
def s8():
    iso = Iso(587, 272, 0.5)
    d = ('<radialGradient id="disc" cx="0.5" cy="0.4" r="0.6"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D6E2EE"/></radialGradient>'
         '<radialGradient id="halo"><stop offset="0" stop-color="#4CC9F0" stop-opacity="0.35"/><stop offset="1" stop-color="#4CC9F0" stop-opacity="0"/></radialGradient>' + GLOW)
    s = '<ellipse cx="667" cy="360" rx="330" ry="200" fill="url(#halo)"/>'
    s += '<ellipse cx="667" cy="410" rx="240" ry="92" fill="#B7C6D6"/>'
    s += '<ellipse cx="667" cy="396" rx="240" ry="92" fill="url(#disc)" stroke="#4CC9F0" stroke-width="2"/>'
    s += '<ellipse cx="667" cy="396" rx="195" ry="72" fill="none" stroke="#4CC9F0" stroke-width="1" stroke-dasharray="4 6" opacity="0.8"/>'
    for name, b in BLD[1:]:
        s += iso.box(b, "#E8F6FD", "#BFE3F6", "#D3EDFA", "none")
    s += building_wire(iso, color="#0B6FB8", sw=1.4, plaza=False, glow=False)
    save("s8_hub", s, defs=d)


# ================================================================= S9 VR
def s9():
    f, cx, cy = 380, 1010, 300

    def pr(X, Y, Z):
        return (cx + f * X / Z, cy - f * Y / Z)
    d = ('<radialGradient id="heat"><stop offset="0" stop-color="#22D3EE" stop-opacity="0.75"/><stop offset="0.45" stop-color="#8B5CF6" stop-opacity="0.45"/><stop offset="1" stop-color="#8B5CF6" stop-opacity="0"/></radialGradient>'
         '<linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFF6FF" stop-opacity="0.32"/><stop offset="1" stop-color="#CFF6FF" stop-opacity="0"/></linearGradient>'
         '<linearGradient id="fade9" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.12" stop-color="#fff" stop-opacity="1"/></linearGradient>'
         f'<mask id="m9" maskUnits="userSpaceOnUse" x="0" y="0" width="{W}" height="{H}"><rect x="560" width="773" height="750" fill="url(#fade9)"/></mask>' + GLOW)
    s = ""
    for (X, Z, rx) in [(-1.5, 6, 130), (2.6, 9, 110), (0.5, 14, 80)]:
        c = pr(X, -1.7, Z)
        s += f'<ellipse cx="{c[0]:.1f}" cy="{c[1]:.1f}" rx="{rx}" ry="{rx * 0.32:.1f}" fill="url(#heat)"/>'
    g = ""
    for X in range(-6, 7):
        g += ln(pr(X, -1.7, 2.2), pr(X, -1.7, 30), "#22D3EE", 0.9, 0.55)
    for Z in [2.2, 3, 4, 5, 6.5, 8, 10, 13, 17, 22, 30]:
        g += ln(pr(-6, -1.7, Z), pr(6, -1.7, Z), "#22D3EE", 0.9, 0.5)
    for Z in [4, 8, 12, 16, 20, 24, 28]:
        for X in (-5, 5):
            g += ln(pr(X, -1.7, Z), pr(X, 4, Z), "#22D3EE", 1.4, 0.85)
        arc = [pr(5 * math.cos(t), 4 + 2.2 * math.sin(t), Z) for t in [i * math.pi / 16 for i in range(17)]]
        g += polyline(arc, "#8B5CF6" if Z % 8 else "#22D3EE", 1.3, 0.85)
    for X in (-5, 5):
        g += ln(pr(X, 4, 4), pr(X, 4, 28), "#22D3EE", 1, 0.6)
    g += ln(pr(0, 6.2, 4), pr(0, 6.2, 28), "#8B5CF6", 1, 0.7)
    s += f'<g filter="url(#glow)">{g}</g>'
    save("s9_room", f'<g mask="url(#m9)">{s}</g>', defs=d)
    beams = ""
    for (x0, x1, x2, x3) in [(1080, 1140, 900, 760), (1170, 1220, 1060, 930), (1250, 1300, 1230, 1110)]:
        beams += poly([(x0, 0), (x1, 0), (x2, 600), (x3, 600)], "url(#beam)")
    save("s9_beams", f'<g mask="url(#m9)">{beams}</g>', defs=d)
    # person with VR headset
    px, feet, hgt = 1152, 506, 212
    sc = hgt / 212
    body = (f'<g transform="translate({px} {feet}) scale({sc:.3f})">'
            '<path d="M-14,0 L-10,-92 L-24,-96 L-30,-160 L-18,-168 L-4,-150 L4,-150 L18,-168 L30,-160 L24,-96 L10,-92 L14,0 L4,0 L0,-80 L-4,0 Z" fill="#0E1726" stroke="#22D3EE" stroke-width="1.6"/>'
            '<path d="M-26,-160 C-30,-120 -22,-110 -36,-70" fill="none" stroke="#0E1726" stroke-width="11" stroke-linecap="round"/>'
            '<path d="M26,-160 C40,-140 46,-150 52,-176" fill="none" stroke="#0E1726" stroke-width="11" stroke-linecap="round"/>'
            '<path d="M-26,-160 C-30,-120 -22,-110 -36,-70" fill="none" stroke="#22D3EE" stroke-width="1.2" opacity="0.8"/>'
            '<path d="M26,-160 C40,-140 46,-150 52,-176" fill="none" stroke="#22D3EE" stroke-width="1.2" opacity="0.8"/>'
            '<circle cx="0" cy="-186" r="17" fill="#0E1726" stroke="#22D3EE" stroke-width="1.6"/>'
            '<rect x="-17" y="-194" width="34" height="13" rx="5" fill="#22D3EE"/>'
            '<rect x="-15" y="-192" width="30" height="5" rx="2" fill="#E0FBFF" opacity="0.9"/>'
            '<circle cx="52" cy="-178" r="5" fill="#8B5CF6"/></g>')
    save("s9_person", f'<g filter="url(#glow)">{body}</g>', defs=d)
    # option cubes
    for i, col in enumerate(["#22D3EE", "#8B5CF6", "#7EE7FF"]):
        ci = Iso(30, 36, 0.12)
        cube = ""
        for a, b in ci.edges((0, 200, 0, 200, 0, 200), hidden=True):
            cube += ln(a, b, col, 1.6)
        fc = ci.faces((0, 200, 0, 200, 0, 200))
        cube = poly(fc["top"], col, op=0.25) + poly(fc["left"], col, op=0.12) + cube
        save(f"s9_cube{i + 1}", f'<g filter="url(#glow)">{cube}</g>', w=60, h=60, defs=GLOW)
    scan = ('<linearGradient id="sc" x1="0" x2="1"><stop offset="0" stop-color="#22D3EE" stop-opacity="0"/><stop offset="0.5" stop-color="#22D3EE" stop-opacity="0.55"/>'
            '<stop offset="1" stop-color="#22D3EE" stop-opacity="0"/></linearGradient>')
    save("s9_scan", rect(0, 0, 40, 600, "url(#sc)"), w=40, h=600, defs=scan)


# ================================================================= S10 future city
def s10():
    d = ('<linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E1B4B"/><stop offset="0.38" stop-color="#4C2A7A"/>'
         '<stop offset="0.62" stop-color="#C2547A"/><stop offset="0.8" stop-color="#F59E0B"/><stop offset="1" stop-color="#FFD9A0"/></linearGradient>'
         '<radialGradient id="sunglow" cx="0.5" cy="0.8" r="0.45"><stop offset="0" stop-color="#FFE3A3" stop-opacity="0.85"/><stop offset="1" stop-color="#FFE3A3" stop-opacity="0"/></radialGradient>'
         '<linearGradient id="tow" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6B76F"/><stop offset="0.5" stop-color="#9C7FB8"/><stop offset="1" stop-color="#3D4C88"/></linearGradient>'
         '<linearGradient id="tow2" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD08A"/><stop offset="0.6" stop-color="#7B8FC8"/><stop offset="1" stop-color="#2E3A73"/></linearGradient>'
         '<linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A2E5E"/><stop offset="1" stop-color="#1C1838"/></linearGradient>'
         '<filter id="sh" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#120E2A" flood-opacity="0.4"/></filter>' + GLOW)
    save("s10_sky", rect(0, 0, W, H, "url(#dawn)") + f'<ellipse cx="667" cy="610" rx="620" ry="330" fill="url(#sunglow)"/>', defs=d, kind="jpg")
    rng = random.Random(21)
    far = ""
    x = 0
    while x < W:
        w = rng.uniform(30, 70)
        h = rng.uniform(120, 300) if (x < 420 or x > 900) else rng.uniform(60, 140)
        far += rect(x, 600 - h, w, h + 150, "#3A2E6B", op=0.55)
        x += w + rng.uniform(2, 10)
    save("s10_far", far, defs=d)
    c = rect(0, 590, W, 160, "url(#ground)")
    # left towers
    towers = [(60, 300, 95, "url(#tow)"), (175, 240, 80, "url(#tow2)"), (275, 330, 70, "url(#tow)"), (930, 270, 90, "url(#tow2)"),
              (1040, 220, 75, "url(#tow)"), (1135, 300, 100, "url(#tow2)"), (1250, 380, 70, "url(#tow)")]
    for (x, top, w, fill) in towers:
        c += rect(x, top, w, 600 - top, fill, "#2A2457", 1)
        for yy in range(int(top) + 14, 600, 16):
            c += ln((x + 4, yy), (x + w - 4, yy), "#FFFFFF", 0.7, 0.22)
        for xx in range(int(x) + 10, int(x + w), 14):
            c += ln((xx, top + 4), (xx - 6, 598), "#1E1B4B", 0.8, 0.25)
    # timber tower with vertical forest
    tx, ttop, tw = 372, 280, 72
    c += rect(tx, ttop, tw, 600 - ttop, "#B9773E", "#6E4520", 1)
    for yy in range(ttop + 20, 600, 28):
        c += rect(tx - 8, yy, tw + 16, 5, "#8B5A2B")
        for k in range(4):
            c += circ(tx - 4 + k * 26 + rng.uniform(-4, 4), yy - 6, rng.uniform(7, 11), rng.choice(["#3F8F5A", "#5FB06A", "#2E7D4F"]))
    # sky bridge
    c += rect(140, 340, 140, 14, "#E9D5B5", "#2A2457", 1) + rect(990, 300, 150, 12, "#E9D5B5", "#2A2457", 1)
    # solar canopy
    for i in range(4):
        c += poly([(1140 + i * 24, 300), (1160 + i * 24, 300), (1168 + i * 24, 286), (1148 + i * 24, 286)], "#1E3A66", "#9DB8E0", 0.6)
    # printed house + gantry
    hx, hy = 520, 600
    house = '<path d="M480,600 C480,520 540,470 640,470 C740,470 800,520 800,600 Z" fill="#DCD3C4" stroke="#8D826F" stroke-width="1.2"/>'
    for yy in range(476, 600, 7):
        house += ln((470, yy), (810, yy), "#9E937E", 0.9, 0.55)
    house = f'<clipPath id="hc"><path d="M480,600 C480,520 540,470 640,470 C740,470 800,520 800,600 Z"/></clipPath><g clip-path="url(#hc)">{house}</g>'
    house += '<path d="M480,600 C480,520 540,470 640,470 C740,470 800,520 800,600" fill="none" stroke="#8D826F" stroke-width="1.6"/>'
    house += rect(600, 540, 60, 60, "#4B3B2A", rx=30) + rect(520, 545, 34, 26, "#7FB3D5", "#5D513F", 1, rx=6) + rect(728, 545, 34, 26, "#7FB3D5", "#5D513F", 1, rx=6)
    c += f'<g filter="url(#sh)">{house}</g>'
    gantry = (rect(455, 400, 14, 200, "#3B3F4A") + rect(811, 400, 14, 200, "#3B3F4A") + rect(440, 388, 400, 16, "#F2B33D", "#B58212", 1) +
              rect(448, 590, 30, 10, "#2B2E36") + rect(802, 590, 30, 10, "#2B2E36"))
    c += f'<g filter="url(#sh)">{gantry}</g>'
    # people & trees on ground
    for xx in range(20, W, 80):
        if 450 < xx < 860:
            continue
        c += circ(xx + rng.uniform(-10, 10), 596, rng.uniform(8, 13), rng.choice(["#2E7D4F", "#3F8F5A"]), op=0.9)
    save("s10_city", c, defs=d)
    head = (rect(0, 0, 70, 30, "#2B2E36", "#F2B33D", 2, rx=4) + rect(28, 30, 14, 26, "#4A4F5C") +
            poly([(28, 56), (42, 56), (35, 66)], "#F2B33D") + circ(35, 68, 5, "#FFB347", op=0.85, extra='filter="url(#glow)"'))
    save("s10_head", head, w=70, h=76, defs=GLOW)
    drone = (ln((6, 6), (54, 30), "#2B2E36", 3) + ln((54, 6), (6, 30), "#2B2E36", 3) + rect(22, 12, 16, 12, "#3B3F4A", rx=3) +
             "".join(f'<ellipse cx="{x}" cy="{y}" rx="10" ry="2.6" fill="#C9CED6" opacity="0.8"/>' for x, y in [(6, 6), (54, 6), (6, 30), (54, 30)]) +
             circ(30, 26, 2.4, "#22D3EE", extra='filter="url(#glow)"'))
    save("s10_drone", drone, w=60, h=36, defs=GLOW)


# ================================================================= backgrounds
def backgrounds():
    def grid(bg, minor, major, step=25, op_minor=0.6, op_major=0.9, grain=None, extra=""):
        s = rect(0, 0, W, H, bg)
        for x in range(0, W + 1, step):
            s += ln((x, 0), (x, H), major if x % (step * 4) == 0 else minor, 0.6, op_major if x % (step * 4) == 0 else op_minor)
        for y in range(0, H + 1, step):
            s += ln((0, y), (W, y), major if y % (step * 4) == 0 else minor, 0.6, op_major if y % (step * 4) == 0 else op_minor)
        dd = ""
        if grain:
            dd = (f'<filter id="gr"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="2"/>'
                  f'<feColorMatrix values="0 0 0 0 {grain[0]}  0 0 0 0 {grain[1]}  0 0 0 0 {grain[2]}  0 0 0 {grain[3]} 0"/></filter>')
            s += rect(0, 0, W, H, "#fff", extra='filter="url(#gr)"')
        return s + extra, dd
    s, dd = grid(PAPER, "#E5DBC9", "#D9CCB5", grain=(0.35, 0.28, 0.2, 0.08))
    save("bg_paper", s, defs=dd, kind="jpg")
    s, dd = grid(NAVY, "#12325A", "#1A4377", op_minor=0.7, op_major=1)
    save("bg_navy", s, defs=dd, kind="jpg")
    sl = ('<linearGradient id="sl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0B2545"/><stop offset="1" stop-color="#1B2A3A"/></linearGradient>')
    s, dd = grid("url(#sl)", "#163452", "#21466B", op_minor=0.6, op_major=0.9)
    save("bg_slate", s, defs=sl + dd, kind="jpg")
    s, dd = grid("#F7F9FC", "#EAEFF5", "#DCE4EE")
    save("bg_studio", s, defs=dd, kind="jpg")
    s = rect(0, 0, W, H, "#EEF2F6") + "".join(circ(x, y, 1.3, "#C9D4E0") for x in range(0, W + 1, 25) for y in range(0, H + 1, 25))
    save("bg_light", s, kind="jpg")
    vg = ('<radialGradient id="vg" cx="0.65" cy="0.45" r="0.75"><stop offset="0" stop-color="#0E1A33"/><stop offset="1" stop-color="#05070D"/></radialGradient>')
    save("bg_dark", rect(0, 0, W, H, "url(#vg)"), defs=vg, kind="jpg")


if __name__ == "__main__":
    for fn in (backgrounds, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10):
        fn()
    with open(os.path.join(OUT, "manifest.json"), "w") as f:
        json.dump(MANIFEST, f, indent=1)
    print(len([m for m in MANIFEST if not m["name"].startswith("_")]), "layers")

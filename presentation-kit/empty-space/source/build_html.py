"""Build the animated web version (web/index.html + web/img/*) from records.json + anim_spec.json."""
import json, os, shutil
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
WEB = os.path.join(HERE, "web")
os.makedirs(os.path.join(WEB, "img"), exist_ok=True)
rec = json.load(open(os.path.join(HERE, "records.json")))
spec = json.load(open(os.path.join(HERE, "anim_spec.json")))

# images -> webp (alpha kept), stage is 1333x750 css px, keep ~2x detail
names = {}
for s in rec["slides"]:
    for it in s["items"]:
        if it["kind"] == "image" and it["o"].get("path"):
            names[os.path.basename(it["o"]["path"])] = None
for m in rec["masters"].values():
    p = m.get("background", {}).get("path")
    if p:
        names[os.path.basename(p)] = None
for n in names:
    src = os.path.join(HERE, "img", n)
    base = os.path.splitext(n)[0] + ".webp"
    im = Image.open(src)
    maxw = 2700
    if im.width > maxw:
        im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    im.save(os.path.join(WEB, "img", base), "WEBP", quality=86, method=6)
    names[n] = "img/" + base


def fix(o):
    if o.get("path"):
        o["src"] = names[os.path.basename(o["path"])]
        del o["path"]
    return o


slides = []
for s in rec["slides"]:
    slides.append({"master": s["master"], "notes": s["notes"],
                   "items": [dict(it, o=fix(dict(it["o"]))) for it in s["items"]]})
masters = {k: names[os.path.basename(v["background"]["path"])] for k, v in rec["masters"].items()}
DATA = json.dumps({"slides": slides, "masters": masters, "spec": spec}, separators=(",", ":"))

HTML = r"""<title>The Architecture of Empty Space</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gelasio:ital,wght@0,400;0,600;1,400&family=Carlito:ital,wght@0,400;0,700;1,400&family=Arimo:wght@400;700&family=Inconsolata:wght@400;700&display=swap">
<style>
/* Layout: one fixed 1333x750 stage (1 px = 0.01 in of the PowerPoint), scaled to the screen; ink ground, gold light. */
:root {
  --void: #050505; --ink: #0F0F10; --light: #F3EEE6; --mist: #A8A29A; --gold: #E9B65A; --panel: rgba(15,15,16,.92);
  --serif: Gelasio, Georgia, "Times New Roman", serif; --sans: Carlito, Calibri, "Segoe UI", Arial, sans-serif;
  --mono: Inconsolata, Consolas, "Courier New", monospace; --mdur: 1400ms;
  color-scheme: dark;
}
html, body { height: 100%; }
body { margin: 0; background: var(--void); color: var(--light); font-family: var(--sans); overflow: hidden;
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); padding-block: 0; }
#stage { position: absolute; left: 50%; top: 50%; width: 1333px; height: 750px; transform-origin: 50% 50%;
  overflow: hidden; background: var(--ink); opacity: 0; transition: opacity 1.2s ease; cursor: pointer; }
#stage.ready { opacity: 1; }
.bg { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity var(--mdur) ease; }
.bg.on { opacity: 1; }
.layer { position: absolute; inset: 0; pointer-events: none; }
.slide { position: absolute; inset: 0; opacity: 0; transition: opacity 700ms ease; pointer-events: none; }
.slide.on { opacity: 1; }
.el { position: absolute; box-sizing: border-box; }
.el.txt { display: flex; flex-direction: column; white-space: pre-wrap; overflow-wrap: break-word; }
.el.txt > .in, .tw > .in { width: 100%; }
.tw { position: absolute; inset: 0; display: flex; flex-direction: column; }
img.el { display: block; max-width: none; }
.morph { transition: left var(--mdur) cubic-bezier(.65,0,.35,1), top var(--mdur) cubic-bezier(.65,0,.35,1),
  width var(--mdur) cubic-bezier(.65,0,.35,1), height var(--mdur) cubic-bezier(.65,0,.35,1),
  border-radius var(--mdur) cubic-bezier(.65,0,.35,1), background-color var(--mdur) ease, border-color var(--mdur) ease,
  opacity 800ms ease, color var(--mdur) ease; }
#ui { position: fixed; right: max(16px, env(safe-area-inset-right, 0px)); bottom: max(14px, env(safe-area-inset-bottom, 0px));
  display: flex; gap: 6px; align-items: center; padding: 6px; border-radius: 999px; background: rgba(20,19,17,.78);
  border: 1px solid rgba(233,182,90,.35); transition: opacity .4s ease; z-index: 5; }
#ui.idle { opacity: 0; }
#ui button { all: unset; cursor: pointer; width: 34px; height: 34px; display: grid; place-items: center; border-radius: 50%;
  color: var(--light); font: 600 15px/1 var(--sans); }
#ui button:hover { background: rgba(233,182,90,.18); }
#ui button:focus-visible { outline: 2px solid var(--gold); outline-offset: 1px; }
#ui .count { font: 600 12px/1 var(--mono); color: var(--mist); padding: 0 6px; letter-spacing: .08em; }
#notes { position: fixed; left: max(16px, env(safe-area-inset-left, 0px)); right: max(16px, env(safe-area-inset-right, 0px));
  bottom: calc(max(14px, env(safe-area-inset-bottom, 0px)) + 56px); max-height: 38vh; overflow: auto; z-index: 4;
  background: var(--panel); border: 1px solid rgba(233,182,90,.35); border-radius: 14px; padding: 16px 20px;
  font: 17px/1.5 var(--sans); color: var(--light); white-space: pre-wrap; }
#notes b { color: var(--gold); font: 700 12px/1 var(--mono); letter-spacing: .12em; display: block; margin-bottom: 8px; }
#hint { position: fixed; left: 50%; top: max(18px, env(safe-area-inset-top, 0px)); transform: translateX(-50%); z-index: 6;
  background: rgba(20,19,17,.85); border: 1px solid rgba(233,182,90,.4); color: var(--light); border-radius: 999px;
  padding: 9px 18px; font: 14px/1.2 var(--sans); white-space: nowrap; transition: opacity .8s ease; pointer-events: none; }
#hint.gone { opacity: 0; }
@media (max-width: 640px) { #hint { white-space: normal; text-align: center; width: min(86vw, 420px); } }
@media (prefers-reduced-motion: reduce) { .morph, .slide, .bg, #stage { transition: none !important; } }
</style>

<div id="stage" aria-label="Presentation: The Architecture of Empty Space" role="region">
  <div class="bg" id="bgInk"></div><div class="bg" id="bgLight"></div>
  <div class="layer" id="below"></div><div class="layer" id="slides"></div><div class="layer" id="above"></div>
</div>
<div id="hint">Click or press → to advance · F for full screen · N for speaker notes</div>
<div id="notes" hidden></div>
<div id="ui">
  <button id="bPrev" aria-label="Previous slide" title="Previous (←)">‹</button>
  <span class="count" id="count">01 / 10</span>
  <button id="bNext" aria-label="Next slide" title="Next (→)">›</button>
  <button id="bNotes" aria-label="Speaker notes" title="Speaker notes (N)">✎</button>
  <button id="bFull" aria-label="Full screen" title="Full screen (F)">⛶</button>
</div>

<script>
const D = __DATA__;
const PX = 100, PT = 100 / 72, SW = 1333, SH = 750;
const FONT = { Georgia: "var(--serif)", Calibri: "var(--sans)", Arial: "Arimo, Arial, Helvetica, sans-serif", Consolas: "var(--mono)" };
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const stage = document.getElementById("stage");
const $ = id => document.getElementById(id);

function rgba(hex, tr) {
  const a = tr == null ? 1 : Math.max(0, 1 - tr / 100);
  const n = parseInt(hex, 16);
  return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
}
function esc(s) { return String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }

function textHTML(t, o) {
  const runs = typeof t === "string" ? [{ text: t, options: {} }] : t;
  return runs.map(r => {
    const ro = r.options || {};
    let st = "";
    if (ro.color) st += `color:#${ro.color};`;
    if (ro.bold) st += "font-weight:700;";
    if (ro.italic) st += "font-style:italic;";
    return `<span style="${st}">${esc(r.text)}</span>` + (ro.breakLine ? "<br>" : "");
  }).join("");
}

function build(it) {
  const o = it.o, el = document.createElement(it.kind === "image" ? "img" : "div");
  el.className = "el";
  const box = { left: o.x * PX, top: o.y * PX, width: (o.w || 0) * PX, height: (o.h || 0) * PX };
  if (it.kind === "image") {
    el.src = o.src || ""; el.alt = ""; el.decoding = "async"; el.draggable = false;
    Object.assign(el.style, { left: box.left + "px", top: box.top + "px", width: box.width + "px", height: box.height + "px" });
    if (o.rotate) el.style.transform = `rotate(${o.rotate > 180 ? o.rotate - 360 : o.rotate}deg)`;
    if (o.transparency) el.style.opacity = 1 - o.transparency / 100;
  } else if (it.kind === "text") {
    el.classList.add("txt");
    const fs = (o.fontSize || 18) * PT;
    const lh = o.lineSpacing ? `${o.lineSpacing * PT}px` : String(1.17 * (o.lineSpacingMultiple || 1));
    Object.assign(el.style, { left: box.left + "px", top: box.top + "px", width: box.width + "px", height: box.height + "px",
      fontFamily: FONT[o.fontFace] || FONT.Calibri, fontSize: fs + "px", lineHeight: lh, color: "#" + (o.color || "F3EEE6"),
      fontWeight: o.bold ? 700 : 400, fontStyle: o.italic ? "italic" : "normal", textAlign: o.align || "left",
      letterSpacing: o.charSpacing ? o.charSpacing * PT + "px" : "normal",
      justifyContent: o.valign === "middle" ? "center" : o.valign === "bottom" ? "flex-end" : "flex-start" });
    el.innerHTML = `<div class="in">${textHTML(it.t, o)}</div>`;
  } else {
    const ln = o.line || {}, lw = (ln.width || 0.75) * PT, lc = ln.color ? rgba(ln.color, ln.transparency) : "transparent";
    if (it.type === "line") {
      const dash = ln.dashType && ln.dashType !== "solid" ? "dashed" : "solid";
      if (!o.h) Object.assign(el.style, { left: box.left + "px", top: box.top - lw / 2 + "px", width: box.width + "px", height: "0px", borderTop: `${lw}px ${dash} ${lc}` });
      else Object.assign(el.style, { left: box.left - lw / 2 + "px", top: box.top + "px", width: "0px", height: box.height + "px", borderLeft: `${lw}px ${dash} ${lc}` });
    } else {
      const f = o.fill || {};
      Object.assign(el.style, { left: box.left + "px", top: box.top + "px", width: box.width + "px", height: box.height + "px",
        backgroundColor: f.color ? rgba(f.color, f.transparency) : "transparent", border: `${lw}px solid ${lc}`,
        borderRadius: it.type === "ellipse" ? "50%" : it.type === "roundRect" ? (o.rectRadius || 0) * PX + "px" : "0px" });
    }
  }
  return el;
}

// ---- build slides; "!!" names are single shared elements that morph between slides
const persist = {}, slideEls = [], slideMaps = [];
D.slides.forEach((s, i) => {
  const box = document.createElement("div");
  box.className = "slide"; box.setAttribute("aria-hidden", "true");
  const map = {}; let seenContent = false;
  s.items.forEach(it => {
    const nm = it.o.objectName || "";
    if (nm.startsWith("!!")) {
      if (!persist[nm]) {
        const el = build(it);
        el.classList.add("morph"); el.style.opacity = 0;
        (seenContent ? $("above") : $("below")).appendChild(el);
        persist[nm] = el;
      }
    } else {
      seenContent = true;
      const el = build(it); map[nm] = el; box.appendChild(el);
    }
  });
  $("slides").appendChild(box); slideEls.push(box); slideMaps.push(map);
});

const STYLE_KEYS = ["left", "top", "width", "height", "borderRadius", "backgroundColor", "border", "borderTop", "borderLeft", "color",
  "fontSize", "fontFamily", "fontWeight", "fontStyle", "letterSpacing", "lineHeight", "textAlign", "justifyContent", "transform"];
function applyPersist(i) {
  const present = new Set();
  D.slides[i].items.forEach(it => {
    const nm = it.o.objectName || "";
    if (!nm.startsWith("!!")) return;
    present.add(nm);
    const t = build(it), el = persist[nm];
    STYLE_KEYS.forEach(k => { el.style[k] = t.style[k]; });
    el.style.opacity = t.style.opacity === "" ? 1 : t.style.opacity;
    if (it.kind === "text") {
      const last = el.lastElementChild, nextIn = t.querySelector(".in");
      const curIn = last ? (last.classList.contains("in") ? last : last.querySelector(".in")) : null;
      if (!curIn || curIn.innerHTML !== nextIn.innerHTML) {
        const wrap = document.createElement("div");
        wrap.className = "tw"; wrap.style.justifyContent = t.style.justifyContent; wrap.appendChild(nextIn);
        if (last && !reduce) {
          last.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 320, fill: "forwards" });
          el.appendChild(wrap);
          wrap.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 520, delay: 260, fill: "backwards" });
          setTimeout(() => { if (last.parentNode && el.lastElementChild === wrap) last.remove(); }, 1200);
        } else { el.innerHTML = ""; el.appendChild(wrap); }
      }
    }
  });
  Object.entries(persist).forEach(([nm, el]) => { if (!present.has(nm)) el.style.opacity = 0; });
}

// ---- motion
function parsePath(p) {
  const tk = p.trim().split(/\s+/); const pts = []; let i = 0, cx = 0, cy = 0;
  while (i < tk.length) {
    const c = tk[i++];
    if (c === "M" || c === "L") { cx = +tk[i++]; cy = +tk[i++]; pts.push([cx, cy]); }
    else if (c === "C") {
      const x1 = +tk[i++], y1 = +tk[i++], x2 = +tk[i++], y2 = +tk[i++], x = +tk[i++], y = +tk[i++];
      for (let s = 1; s <= 16; s++) { const t = s / 16, u = 1 - t;
        pts.push([u*u*u*cx + 3*u*u*t*x1 + 3*u*t*t*x2 + t*t*t*x, u*u*u*cy + 3*u*u*t*y1 + 3*u*t*t*y2 + t*t*t*y]); }
      cx = x; cy = y;
    } else if (c === "E") break;
  }
  const px = pts.map(([x, y]) => [x * SW, y * SH]);
  const seg = [0]; for (let k = 1; k < px.length; k++) seg.push(seg[k - 1] + Math.hypot(px[k][0] - px[k - 1][0], px[k][1] - px[k - 1][1]));
  const L = seg[seg.length - 1] || 1;
  return px.map(([x, y], k) => ({ transform: `translate(${x}px, ${y}px)`, offset: seg[k] / L }));
}
const OUT = "cubic-bezier(.2,.7,.2,1)";
function effect(el, e, lead, first) {
  const d = e.dur * 1000, delay = (lead + e.t) * 1000, o = e.opts || {}, A = [];
  const fill = first ? "both" : "forwards";
  const op = (kf, f = fill) => A.push(el.animate(kf, { duration: d, delay, fill: f, easing: "ease-out" }));
  const tr = (from, to, f = fill) => A.push(el.animate([{ transform: from }, { transform: to }], { duration: d, delay, fill: f, easing: OUT, composite: "add" }));
  const clip = (from) => A.push(el.animate([{ clipPath: from }, { clipPath: "inset(0% 0% 0% 0%)" }], { duration: d, delay, fill, easing: "ease-in-out" }));
  const loop = (kf, opt) => A.push(el.animate(kf, Object.assign({ duration: d, delay, composite: "add", easing: "ease-in-out" }, opt)));
  switch (e.eff) {
    case "fade": op([{ opacity: 0 }, { opacity: 1 }]); break;
    case "floatUp": op([{ opacity: 0 }, { opacity: 1 }]); tr("translateY(30px)", "translateY(0px)"); break;
    case "riseIn": op([{ opacity: 0 }, { opacity: 1 }]); tr("translateY(45px)", "translateY(0px)"); break;
    case "descend": op([{ opacity: 0 }, { opacity: 1 }]); tr("translateY(-45px)", "translateY(0px)"); break;
    case "slideFromL": op([{ opacity: 0 }, { opacity: 1 }]); tr("translateX(-107px)", "translateX(0px)"); break;
    case "slideFromR": op([{ opacity: 0 }, { opacity: 1 }]); tr("translateX(107px)", "translateX(0px)"); break;
    case "zoomIn": op([{ opacity: 0 }, { opacity: 1 }]); tr("scale(0.01)", "scale(1)"); break;
    case "expandIn": op([{ opacity: 0 }, { opacity: 1 }]); tr("scale(1.08)", "scale(1)"); break;
    case "wipeL": clip("inset(0% 100% 0% 0%)"); break;
    case "wipeR": clip("inset(0% 0% 0% 100%)"); break;
    case "split": clip("inset(0% 50% 0% 50%)"); break;
    case "exitFade": op([{ opacity: 1 }, { opacity: 0 }], "forwards"); break;
    case "breathe": loop([{ transform: "scale(1)" }, { transform: `scale(${o.scale / 100})` }], { iterations: Infinity, direction: "alternate" }); break;
    case "pulse": loop([{ transform: "scale(1)" }, { transform: `scale(${o.scale / 100})` }], { iterations: o.count ? o.count * 2 : Infinity, direction: "alternate" }); break;
    case "scaleX": loop([{ transform: "scale(1,1)" }, { transform: `scale(${o.x / 100},1)` }], { iterations: Infinity, direction: "alternate" }); break;
    case "spin": loop([{ transform: "rotate(0deg)" }, { transform: `rotate(${o.deg}deg)` }],
      { iterations: o.repeat ? Infinity : 1, direction: o.autoRev ? "alternate" : "normal", easing: o.autoRev ? "ease-in-out" : "linear", fill: "forwards" }); break;
    case "path": loop(parsePath(o.path), { iterations: o.repeat ? Infinity : 1, direction: o.autoRev ? "alternate" : "normal",
      easing: o.smooth ? "ease-in-out" : "linear", fill: "forwards" }); break;
  }
  return A;
}

let cur = -1, running = [];
function goto(i) {
  i = Math.max(0, Math.min(D.slides.length - 1, i));
  if (i === cur) return;
  running.forEach(a => a.cancel()); running = [];
  const sp = D.spec[i], tr = sp.transition;
  const morph = tr.type === "morph" && cur >= 0;
  document.documentElement.style.setProperty("--mdur", (reduce ? 0 : morph ? tr.dur : 900) + "ms");
  slideEls.forEach((el, k) => { el.classList.toggle("on", k === i); el.setAttribute("aria-hidden", k === i ? "false" : "true"); });
  $("bgInk").classList.toggle("on", D.slides[i].master === "Ink");
  $("bgLight").classList.toggle("on", D.slides[i].master !== "Ink");
  applyPersist(i);
  if (!reduce) {
    const lead = cur < 0 ? 0.5 : morph ? tr.dur / 1000 * 0.55 : 0.45;
    const map = slideMaps[i], seen = new Set();
    sp.effects.forEach(e => e.targets.forEach(nm => {
      const el = map[nm] || persist[nm]; if (!el) return;
      const entrance = !["exitFade", "breathe", "pulse", "scaleX", "spin", "path"].includes(e.eff);
      const first = entrance && !seen.has(nm); if (entrance) seen.add(nm);
      running.push(...effect(el, e, lead, first));
    }));
  }
  cur = i;
  $("count").textContent = String(i + 1).padStart(2, "0") + " / " + D.slides.length;
  const n = D.slides[i].notes || "";
  $("notes").innerHTML = "<b>SPEAKER NOTES · SLIDE " + (i + 1) + "</b>" + esc(n);
  try { history.replaceState(null, "", "#s" + (i + 1)); } catch (_) {}
}

// ---- scale stage to the screen
function fit() {
  const cs = getComputedStyle(document.body);
  const w = innerWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), h = innerHeight;
  const s = Math.min(w / SW, h / SH);
  stage.style.transform = `translate(-50%, -50%) scale(${s})`;
}
addEventListener("resize", fit); fit();
$("bgInk").style.backgroundImage = `url(${D.masters.Ink})`;
$("bgLight").style.backgroundImage = `url(${D.masters.Light})`;

// ---- controls
const next = () => goto(cur + 1), prev = () => goto(cur - 1);
stage.addEventListener("click", next);
$("bNext").addEventListener("click", e => { e.stopPropagation(); next(); });
$("bPrev").addEventListener("click", e => { e.stopPropagation(); prev(); });
$("bNotes").addEventListener("click", e => { e.stopPropagation(); $("notes").hidden = !$("notes").hidden; });
function full() {
  try { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {}); } catch (_) {}
}
$("bFull").addEventListener("click", e => { e.stopPropagation(); full(); });
addEventListener("keydown", e => {
  if (["ArrowRight", "PageDown", " ", "Enter"].includes(e.key)) { e.preventDefault(); next(); }
  else if (["ArrowLeft", "PageUp", "Backspace"].includes(e.key)) { e.preventDefault(); prev(); }
  else if (e.key === "Home") goto(0); else if (e.key === "End") goto(D.slides.length - 1);
  else if (e.key === "f" || e.key === "F") full();
  else if (e.key === "n" || e.key === "N") $("notes").hidden = !$("notes").hidden;
});
let tx = null;
stage.addEventListener("touchstart", e => { tx = e.touches[0].clientX; }, { passive: true });
stage.addEventListener("touchend", e => {
  if (tx == null) return; const dx = e.changedTouches[0].clientX - tx; tx = null;
  if (Math.abs(dx) > 40) { e.preventDefault(); dx < 0 ? next() : prev(); }
});
let idle; const ui = $("ui");
function wake() { ui.classList.remove("idle"); clearTimeout(idle); idle = setTimeout(() => ui.classList.add("idle"), 2600); }
addEventListener("mousemove", wake); wake();
setTimeout(() => $("hint").classList.add("gone"), 5200);
try { navigator.wakeLock && navigator.wakeLock.request("screen").catch(() => {}); } catch (_) {}

// ---- start (wait for the first slide's pictures so the opening plays in full)
const start = parseInt((location.hash.match(/^#s(\d+)$/) || [])[1] || "1", 10) - 1;
const firstImgs = [...slideEls[Math.max(0, start)].querySelectorAll("img")].concat([...document.querySelectorAll("#below img")]);
if (/video/.test(location.search)) { stage.classList.add("ready"); window.__start = () => goto(start); } else
Promise.race([Promise.all(firstImgs.map(im => im.decode ? im.decode().catch(() => {}) : 0)), new Promise(r => setTimeout(r, 4000))])
  .then(() => {
    stage.classList.add("ready"); goto(start);
    setTimeout(() => document.querySelectorAll("img").forEach(im => { if (im.decode) im.decode().catch(() => {}); }), 600);
  });

// hooks used to render the preview video frame by frame
window.__deck = {
  go: i => { goto(i); getComputedStyle(stage).opacity; },
  freeze: () => document.getAnimations().forEach(a => a.pause()),
  seek: ms => document.getAnimations().forEach(a => { try { a.currentTime = ms; } catch (_) {} }),
  count: D.slides.length,
  allDecoded: () => Promise.all([...document.querySelectorAll("img")].map(im => im.decode ? im.decode().catch(() => {}) : 0)),
};
</script>
"""
open(os.path.join(WEB, "index.html"), "w", encoding="utf-8").write(HTML.replace("__DATA__", DATA))
tot = sum(os.path.getsize(os.path.join(WEB, "img", f)) for f in os.listdir(os.path.join(WEB, "img")))
print("index.html", os.path.getsize(os.path.join(WEB, "index.html")) // 1024, "KB | images", len(os.listdir(os.path.join(WEB, "img"))), tot // 1024, "KB")

"""Spec v10: new motion design. Slide numbers are presentation order (1 = names, 2 = title, 3..8 = content)."""
import json
LETTER = lambda t, d=0.5, pct=6, off=0.03: {"t": t, "eff": "floatUp", "dur": d, "opts": {"off": off}, "iter": ["lt", pct]}
spec = []
# 1 names: curtains open the show
spec.append({"slide": 1, "transition": {"type": "curtains", "dur": 2600, "sound": "t_curtains"}, "effects": [
    {"t": 0.15, "eff": "filter", "dur": 1.4, "targets": ["frame"], "opts": {"filter": "plus(out)", "preset": 13, "sub": 32}},
    {"t": 0.8, "eff": "fade", "dur": 0.3, "targets": ["nkicker"], "iter": ["lt", 10]},
    {"t": 1.15, "eff": "basicZoom", "dur": 0.9, "targets": ["nhead"]},
    {"t": 1.75, "eff": "split", "dur": 0.6, "targets": ["nrule"]}] + [
    {"t": 2.0 + k * 0.28, "eff": "slideFromR", "dur": 0.8, "targets": [f"n{k + 1}"], "opts": {"off": 0.05}} for k in range(5)]})
# 2 title: ripple spreads through the empty space
spec.append({"slide": 2, "transition": {"type": "ripple", "dur": 1600, "sound": "t_ripple"}, "effects": [
    {"t": 0.0, "eff": "expandIn", "dur": 2.6, "targets": ["photo"], "opts": {"from": 1.06}},
    {"t": 2.6, "eff": "breathe", "dur": 12, "targets": ["photo"], "opts": {"scale": 104}},
    {"t": 0.5, "eff": "fade", "dur": 0.25, "targets": ["kicker"], "iter": ["lt", 8]},
    dict(LETTER(0.9, 0.55, 7), targets=["title"]),
    {"t": 2.5, "eff": "wipeL", "dur": 0.7, "targets": ["rule"]},
    {"t": 2.7, "eff": "fade", "dur": 0.6, "targets": ["tagline"], "iter": ["wd", 60]},
    {"t": 3.6, "eff": "floatUp", "dur": 0.9, "targets": ["intro"]}]})
# 3..8 content: transition + themed photo reveal (photo lights up over its dim ghost)
CONTENT = {
    3: ("honeycomb", 2000, "t_tiles", ("diamond(out)", 8, 32)),          # space between walls opens from the center
    4: ("cube", 1500, "t_cube", ("checkerboard(across)", 5, 10)),         # walls laid like bricks
    5: ("flash", 1100, "t_flash", ("wheel(1)", 21, 1)),                   # sun sweeping a sundial
    6: ("switch", 1500, "t_switch", ("plus(out)", 13, 32)),               # paths connecting in four directions
    7: ("fracture", 2000, "t_fracture", ("barn(outHorizontal)", 16, 42)), # one cut opens the wall
    8: ("warp", 1500, "t_warp", ("dissolve", 9, 0)),                      # the future materialising
}
for n, (tr, dur, snd, (flt, pid, sub)) in CONTENT.items():
    eff = [{"t": 0.0, "eff": "filter", "dur": 2.0, "targets": ["photo"], "opts": {"filter": flt, "preset": pid, "sub": sub}},
           {"t": 2.0, "eff": "breathe", "dur": 12, "targets": ["photo"], "opts": {"scale": 104}},
           {"t": 0.2, "eff": "wipeL", "dur": 0.6, "targets": ["rule"]},
           dict(LETTER(0.35, 0.5, 6), targets=["title"]),
           {"t": 1.35, "eff": "fade", "dur": 0.45, "targets": ["para"], "iter": ["wd", 9]}]
    for k in range(3):
        eff.append({"t": 2.5 + k * 0.35, "eff": "spinZoom", "dur": 0.5, "targets": [f"dot{k + 1}"]})
        eff.append({"t": 2.6 + k * 0.35, "eff": "wipeL", "dur": 0.7, "targets": [f"pt{k + 1}"], "opts": {"fade": True}})
    eff.append({"t": 3.9, "eff": "basicZoom", "dur": 0.9, "targets": ["quote"], "opts": {"from": 0.9}})
    if n == 8:
        eff.append({"t": 4.7, "eff": "fade", "dur": 0.3, "targets": ["thanks"], "iter": ["lt", 8]})
    spec.append({"slide": n, "transition": {"type": tr, "dur": dur, "sound": snd}, "effects": eff})
json.dump(spec, open("spec10.json", "w"), indent=1)
print(len(spec), "slides,", sum(len(s["effects"]) for s in spec), "effects")

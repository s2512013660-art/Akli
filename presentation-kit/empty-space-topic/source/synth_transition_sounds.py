"""Synthesize themed transition sounds (original, royalty-free): curtains, ripple, tiles, cube, flash, switch, fracture, warp."""
import numpy as np, wave, os
SR = 44100
rng = np.random.default_rng(7)
OUT = os.path.dirname(os.path.abspath(__file__))
T = lambda d: np.arange(int(SR * d)) / SR

def bp(x, f, q):
    """time-varying 2-pole bandpass (f: scalar or per-sample array)"""
    f = np.broadcast_to(np.asarray(f, float), x.shape)
    y = np.zeros_like(x); x1 = x2 = y1 = y2 = 0.0
    w0 = 2 * np.pi * f / SR; al = np.sin(w0) / (2 * q); cw = np.cos(w0)
    for n in range(len(x)):
        a0 = 1 + al[n]
        yn = (al[n] * x[n] - al[n] * x2 + 2 * cw[n] * y1 - (1 - al[n]) * y2) / a0
        x2, x1 = x1, x[n]; y2, y1 = y1, yn; y[n] = yn
    return y

def bp2(x, f, q):
    return bp(bp(x, f, q), f, q) * 2

def lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); s = 0.0
    for n in range(len(x)):
        s = (1 - a) * x[n] + a * s; y[n] = s
    return y

def env(t, a, r, total):
    e = np.minimum(1, t / max(a, 1e-4)) * np.clip((total - t) / r, 0, 1)
    return np.clip(e, 0, 1) ** 1.5

def verb(x, dec=0.45, mix=0.22):
    x = x.copy(); fl = int(SR * 0.35); x[-fl:] *= np.linspace(1, 0, fl) ** 2
    L = int(SR * dec * 3); ir = rng.standard_normal(L) * np.exp(-np.arange(L) / SR / dec)
    ir = lp(lp(ir, 3500), 3500); ir /= np.sqrt(np.sum(ir ** 2))
    w = np.convolve(x, ir)[:len(x) + int(SR * dec * 1.2)]
    y = np.zeros(len(w)); y[:len(x)] += x
    return y * (1 - mix) + w * mix

def norm(x, peak_db):
    x = lp(lp(x, 9000), 9000); x = x - np.mean(x); fade = min(len(x), int(SR * 0.02))
    x[-fade:] *= np.linspace(1, 0, fade)
    return x / np.max(np.abs(x)) * 10 ** (peak_db / 20)

def save(name, x):
    np.save(os.path.join(OUT, name + ".npy"), x)
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR)
        f.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())
    print(name, f"{len(x) / SR:.2f}s")

def chime(t, freqs, dec, start=0.0):
    y = np.zeros_like(t)
    for k, f in enumerate(freqs):
        tt = t - start - 0.045 * k
        on = tt >= 0
        y[on] += np.sin(2 * np.pi * f * tt[on] * (1 + 0.002 * np.sin(2 * np.pi * 5 * tt[on]))) * np.exp(-tt[on] / dec) / (1 + 0.35 * k)
    return y


def whoosh(t, c, w, f0, f1, q=0.9):
    n = rng.standard_normal(len(t)); f = f0 + (f1 - f0) * np.clip((t - (c - w)) / (2 * w), 0, 1)
    return bp2(n, f, q) * np.exp(-((t - c) / (w * 0.6)) ** 2)
def thud(t, at, f=62, dec=0.2, g=1.0):
    tt = t - at; on = tt >= 0; y = np.zeros_like(t)
    y[on] = g * (np.sin(2 * np.pi * f * tt[on]) * np.exp(-tt[on] / dec) + 0.25 * lp(rng.standard_normal(on.sum()), 500) * np.exp(-tt[on] / 0.03) * 4)
    return y
def ticks(t, t0, t1, n, a=2.2, b=2.2):
    y = np.zeros_like(t)
    for tm in np.sort(t0 + (t1 - t0) * rng.beta(a, b, n)):
        i = int(tm * SR); L = int(SR * 0.05); tt = np.arange(L) / SR
        k = bp(rng.standard_normal(L), rng.uniform(1700, 3400), 6) * np.exp(-tt / 0.006) * 3 + np.sin(2 * np.pi * rng.uniform(520, 900) * tt) * np.exp(-tt / 0.018) * 0.6
        y[i:i + L] += k[:len(y) - i] * rng.uniform(0.45, 1.0)
    return y
def sweep_tone(t, t0, t1, f0, f1):
    tt = np.clip((t - t0) / (t1 - t0), 0, 1); fr = f0 * (f1 / f0) ** tt; ph = 2 * np.pi * np.cumsum(fr) / SR
    am = np.where((t >= t0) & (t <= t1 + 0.15), tt ** 2, 0) * np.exp(-np.clip(t - t1, 0, None) / 0.1)
    return am * (np.sin(ph) + 0.35 * np.sin(2 * ph))

# light slit: low swell, then a chime and an airy opening as the panels part (0.95 s)
d = 2.4; t = T(d)
sw = np.clip(t / 0.95, 0, 1) ** 2 * np.exp(-np.clip(t - 0.95, 0, None) / 0.25)
x = sw * (0.5 * np.sin(2 * np.pi * 110 * t) + 0.3 * np.sin(2 * np.pi * 220 * t)) + 0.6 * chime(t, [880.0, 1318.5, 1760.0], 0.6, 0.95) + 0.8 * whoosh(t, 1.35, 0.45, 400, 1500)
save("c_slit", norm(verb(x, 0.6, 0.3), -9))
# doorway: shimmer rising while the light grows, bright chime when it floods (1.2 s)
d = 2.6; t = T(d)
x = bp2(rng.standard_normal(len(t)), 800 + 4200 * np.clip(t / 1.2, 0, 1), 1.3) * np.clip(t / 1.2, 0, 1) ** 2 * np.exp(-np.clip(t - 1.2, 0, None) / 0.3)
x += 0.55 * chime(t, [2093.0, 3136.0, 4186.0], 0.7, 1.18)
save("c_door", norm(verb(x, 0.7, 0.35), -10))
# columns: swish in, soft landing, swish out
d = 2.3; t = T(d)
x = whoosh(t, 0.35, 0.32, 500, 1500) + thud(t, 0.82, 70, 0.15, 0.7) + whoosh(t, 1.4, 0.36, 1500, 500)
save("c_columns", norm(verb(x, 0.4, 0.2), -9))
# four walls: walls slide in, meet with a thump, the courtyard lights up, walls slide away
d = 2.2; t = T(d)
x = whoosh(t, 0.32, 0.3, 300, 1100) + thud(t, 0.6, 58, 0.25, 1.0) + 0.45 * chime(t, [1568.0, 2093.0], 0.5, 0.75) + 0.8 * whoosh(t, 1.3, 0.33, 1100, 350)
save("c_walls", norm(verb(x, 0.45, 0.22), -8))
# light sweep: a long swell peaking when the light covers the screen (0.95 s)
d = 2.5; t = T(d)
x = whoosh(t, 0.95, 0.75, 600, 2600, 0.8) + 0.35 * chime(t, [1046.5, 1568.0], 0.6, 0.9)
save("c_sweep", norm(verb(x, 0.6, 0.3), -9))
# grid: tiles snapping in from the centre, then out again
d = 2.2; t = T(d)
x = ticks(t, 0.02, 0.8, 30) + ticks(t, 0.92, 1.72, 30) + 0.2 * whoosh(t, 0.85, 0.7, 700, 1400)
save("c_grid", norm(verb(x, 0.35, 0.2), -9))
# the cut: a blade drawing the line (0.05-0.45), a metallic ring, then the halves sliding apart
d = 2.4; t = T(d)
blade = bp2(rng.standard_normal(len(t)), 3500 + 3000 * np.clip((t - 0.05) / 0.4, 0, 1), 1.6) * np.where((t > 0.05) & (t < 0.5), np.sin(np.pi * (t - 0.05) / 0.45), 0)
x = 0.8 * blade + 0.5 * chime(t, [3200.0, 4700.0], 0.35, 0.45) + lp(rng.standard_normal(len(t)), 500) * np.exp(-((t - 0.9) / 0.3) ** 2) * 5 + thud(t, 0.5, 75, 0.3, 0.8)
save("c_cut", norm(verb(x, 0.5, 0.25), -8))
# skyline: towers rising in, then rising away, ending on a bright note
d = 2.6; t = T(d)
x = sweep_tone(t, 0.0, 0.85, 150, 480) * 0.7 + whoosh(t, 0.45, 0.4, 300, 1200) + sweep_tone(t, 0.98, 1.85, 300, 900) * 0.6 + whoosh(t, 1.4, 0.42, 600, 2200) + 0.4 * chime(t, [1760.0, 2637.0], 0.5, 1.85)
save("c_skyline", norm(verb(x, 0.6, 0.3), -9))

import glob
for f in sorted(glob.glob(os.path.join(OUT, "c_*.npy"))):
    x = np.load(f); g = min(10 ** (-25 / 20) / np.sqrt(np.mean(x ** 2)), 10 ** (-3 / 20) / np.max(np.abs(x)))
    save(os.path.basename(f)[:-4], x * g)

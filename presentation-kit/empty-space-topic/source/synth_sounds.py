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

# 1 curtains: slow fabric swish parting
d = 2.6; t = T(d); n = rng.standard_normal(len(t))
f = 450 + 1300 * np.sin(np.pi * np.clip(t / 2.0, 0, 1)) ** 2
x = bp2(n, f, 0.8) * env(t, 0.7, 1.3, d) + 0.5 * bp2(rng.standard_normal(len(t)), f * 1.6, 0.9) * env(t - 0.25, 0.6, 1.2, d - 0.25) * (t > 0.25)
x += 0.35 * lp(rng.standard_normal(len(t)), 120) * env(t, 0.5, 1.5, d) * 6
save("t_curtains", norm(verb(x, 0.5, 0.25), -9))

# 2 ripple: water drop + soft shimmer
d = 2.2; t = T(d)
drop = np.sin(2 * np.pi * np.cumsum(600 + 900 * np.exp(-t / 0.025)) / SR) * np.exp(-t / 0.09)
x = 0.8 * drop + 0.5 * chime(t, [1046.5, 1568.0, 2093.0, 2637.0], 0.55, 0.06)
save("t_ripple", norm(verb(x, 0.7, 0.35), -10))

# 3 tiles (honeycomb): cascade of soft wooden ticks over a light whoosh
d = 2.0; t = T(d); x = 0.25 * bp2(rng.standard_normal(len(t)), 900 + 600 * t, 0.8) * env(t, 0.4, 0.9, 1.6)
times = np.sort(0.08 + 1.25 * rng.beta(1.6, 2.2, 34))
for tm in times:
    i = int(tm * SR); L = int(SR * 0.05); tt = np.arange(L) / SR
    tick = bp(rng.standard_normal(L), rng.uniform(1700, 3600), 6) * np.exp(-tt / 0.006) * 3
    tick += np.sin(2 * np.pi * rng.uniform(520, 900) * tt) * np.exp(-tt / 0.018) * 0.6
    x[i:i + L] += tick[:len(x) - i] * rng.uniform(0.45, 1.0)
save("t_tiles", norm(verb(x, 0.35, 0.2), -9))

# 4 cube: rotating whoosh + soft landing thump
d = 1.8; t = T(d); n = rng.standard_normal(len(t))
f = 300 + 1100 * np.sin(np.pi * np.clip(t / 1.2, 0, 1))
x = bp2(n, f, 0.9) * np.exp(-((t - 0.6) / 0.33) ** 2)
tt = np.clip(t - 1.15, 0, None); on = t >= 1.15
x[on] += 1.1 * np.sin(2 * np.pi * 62 * tt[on]) * np.exp(-tt[on] / 0.22) + 0.3 * lp(rng.standard_normal(on.sum()), 400) * np.exp(-tt[on] / 0.05) * 4
save("t_cube", norm(verb(x, 0.4, 0.2), -8))

# 5 flash: bright airy "light" shimmer
d = 1.8; t = T(d); n = rng.standard_normal(len(t))
air = (bp2(n, 6000, 1.2) + 0.6 * bp2(rng.standard_normal(len(t)), 3800, 1.4)) * np.minimum(1, t / 0.03) * np.exp(-t / 0.35)
x = 0.7 * air + 0.45 * chime(t, [2093.0, 3136.0, 4186.0], 0.6, 0.02)
save("t_flash", norm(verb(x, 0.5, 0.3), -13))

# 6 switch: quick double swish
d = 1.1; t = T(d); n = rng.standard_normal(len(t))
f = 700 + 1800 * np.sin(np.pi * np.clip(t / 0.8, 0, 1))
x = bp2(n, f, 1.0) * (np.exp(-((t - 0.28) / 0.13) ** 2) + 0.7 * np.exp(-((t - 0.62) / 0.15) ** 2))
save("t_switch", norm(verb(x, 0.3, 0.18), -9))

# 7 fracture: impact, stone crack, falling debris
d = 2.0; t = T(d)
x = 1.2 * np.sin(2 * np.pi * 78 * t) * np.exp(-t / 0.25)
x += bp2(rng.standard_normal(len(t)), 3000, 1.4) * np.exp(-t / 0.12) * 2.2
x += lp(rng.standard_normal(len(t)), 300) * np.exp(-t / 0.9) * 4
for tm in np.sort(0.05 + 1.3 * rng.beta(1.2, 3.0, 55)):
    i = int(tm * SR); L = int(SR * 0.09); tt = np.arange(L) / SR
    g = np.sin(2 * np.pi * rng.uniform(2400, 6500) * tt) * np.exp(-tt / rng.uniform(0.012, 0.04))
    x[i:i + L] += g[:len(x) - i] * rng.uniform(0.15, 0.6) * np.exp(-tm / 0.8)
save("t_fracture", norm(verb(x, 0.5, 0.25), -8))

# 8 warp: rising zoom sweep into the future
d = 1.8; t = T(d); n = rng.standard_normal(len(t))
fr = 160 * (6.0 ** np.clip(t / 1.15, 0, 1)); ph = 2 * np.pi * np.cumsum(fr) / SR
am = np.clip(t / 1.1, 0, 1) ** 2 * np.exp(-np.clip(t - 1.1, 0, None) / 0.12)
x = am * (np.sin(ph) + 0.4 * np.sin(2 * ph) + 0.15 * np.sin(3 * ph)) * 0.6
x += bp2(n, 400 + 2600 * np.clip(t / 1.15, 0, 1), 1.2) * am * 1.4
x += 0.3 * chime(t, [1760.0, 2637.0], 0.5, 1.1)
save("t_warp", norm(verb(x, 0.6, 0.3), -9))

# loudness balance: equal RMS (-25 dBFS), peak <= -3 dBFS
import glob
for f in sorted(glob.glob(os.path.join(OUT, "t_*.npy"))):
    x = np.load(f); g = min(10 ** (-25 / 20) / np.sqrt(np.mean(x ** 2)), 10 ** (-3 / 20) / np.max(np.abs(x)))
    save(os.path.basename(f)[:-4], x * g)

/* =====================================================================
   ONE NIGHT, ONE RAFT: 3D scene (three.js r128, classic global build)
   ---------------------------------------------------------------------
   Units: 1 unit = 1 meter. Plan axes: x = east (raft length), z = south
   (raft width), y = up. Origin = centre of the raft bounding box.

   >>> EDIT LAYOUT BELOW TO MATCH YOUR STRUCTURAL CAD DRAWINGS <<<
   Everything (rebar, chairs, cover blocks, starters, formwork, concrete,
   CAD overlay, labels, people) is generated from LAYOUT, so changing the
   outline, grid, walls, stairs, shafts or pits updates the whole scene.
   ===================================================================== */
(function () {
  'use strict';
  const T = window.THREE;

  /* ------------------------------------------------------------------ */
  /* 1. LAYOUT (editable)                                                */
  /* ------------------------------------------------------------------ */
  const LAYOUT = {
    // R.C RAFT BORDER polygon [x, z] in meters (any simple polygon works).
    // 80 x 60 m with a 20 x 15 m corner notch = 4,800 - 300 = 4,500 m².
    outline: [[-40, -30], [20, -30], [20, -15], [40, -15], [40, 30], [-40, 30]],
    thickness: 1.0,           // raft thickness (m)
    cover: 0.075,             // concrete cover, bottom and sides (m)
    barSpacing: 1.0,          // representative visual bar spacing (m)
    chairSpacing: 2.0,        // rebar chair grid (m)
    coverBlockSpacing: 1.5,   // bottom cover block grid (m)
    gridX: [-36, -28, -20, -12, -4, 4, 12, 20, 28, 36],          // grid lines 1..10
    gridZ: [-26, -19.5, -13, -6.5, 0, 6.5, 13, 19.5, 26],        // grid lines A..I
    gridLabelsX: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    gridLabelsZ: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
    // Retaining walls: centrelines [x1, z1, x2, z2] (south side left open for access)
    walls: [
      [-39.55, 29.6, -39.55, -29.55], [-39.55, -29.55, 19.55, -29.55], [19.55, -29.55, 19.55, -15.45],
      [19.55, -15.45, 39.55, -15.45], [39.55, -15.45, 39.55, 29.6]
    ],
    stairs: [
      { name: 'STAIR STARTER', x1: -33.2, z1: 1.6, x2: -27.6, z2: 11.0 },
      { name: 'STAIR STARTER', x1: 22.6, z1: 3.4, x2: 28.2, z2: 11.4 }
    ],
    shafts: [{ name: 'LIFT SHAFT', x1: -2.7, z1: -5.4, x2: 2.7, z2: -0.6 }],
    pits: [
      { name: 'LIFT PIT', x1: -2.2, z1: -4.9, x2: 2.2, z2: -1.1 },
      { name: 'SUMP PIT', x1: 30.4, z1: 20.4, x2: 33.0, z2: 23.0 }
    ],
    matchLine: 0,             // x of the match line between the two CAD sheets
    columnSize: 0.6
  };

  const Y0 = 0.06;                     // top of blinding = raft soffit
  const TH = LAYOUT.thickness;
  const CV = LAYOUT.cover;
  const RB = 0.045;                    // visual bar radius (exaggerated for legibility)
  const yB1 = Y0 + CV + RB;            // bottom mesh, layer 1 (bars along x)
  const yB2 = yB1 + 2 * RB;            // bottom mesh, layer 2 (bars along z)
  const yT2 = Y0 + TH - CV - RB;       // top mesh, upper layer (front bars along x)
  const yT1 = yT2 - 2 * RB;            // top mesh, lower layer (side bars along z)

  /* ------------------------------------------------------------------ */
  /* 2. Small utilities                                                  */
  /* ------------------------------------------------------------------ */
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const sat = v => clamp(v, 0, 1);
  const smooth = v => { v = sat(v); return v * v * (3 - 2 * v); };
  const easeIO = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeOut = t => 1 - Math.pow(1 - sat(t), 3);
  const C = hex => new T.Color(hex).convertSRGBToLinear();
  function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function hash2(x, y) { let h = x * 374761393 + y * 668265263; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
  function vnoise(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash2(xi, yi), b = hash2(xi + 1, yi), c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
    return lerp(lerp(a, b, u), lerp(c, d, u), v);
  }
  function fbm(x, y, o) { let s = 0, a = 0.5, f = 1; for (let i = 0; i < (o || 4); i++) { s += a * vnoise(x * f, y * f); f *= 2; a *= 0.5; } return s; }

  function canvasTex(w, h, draw, opt) {
    opt = opt || {};
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'); draw(g, w, h);
    const tex = new T.CanvasTexture(c);
    if (opt.srgb !== false) tex.encoding = T.sRGBEncoding;
    if (opt.repeat) { tex.wrapS = tex.wrapT = T.RepeatWrapping; tex.repeat.set(opt.repeat[0], opt.repeat[1]); }
    tex.anisotropy = 8;
    tex.userData = { canvas: c, draw };
    return tex;
  }
  function noiseFill(g, w, h, base, amp, scale, oct) {
    const img = g.createImageData(w, h), d = img.data, b = new T.Color(base);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const n = (fbm(x / scale, y / scale, oct || 4) - 0.5) * amp + (Math.random() - 0.5) * amp * 0.35;
      const i = (y * w + x) * 4;
      d[i] = clamp(b.r * 255 + n, 0, 255); d[i + 1] = clamp(b.g * 255 + n * 0.92, 0, 255); d[i + 2] = clamp(b.b * 255 + n * 0.8, 0, 255); d[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  }

  /* merge simple geometries [{geo, m: Matrix4}] into one non-indexed geometry */
  function mergeGeos(list) {
    const pos = [], nor = [], uv = [];
    const nm = new T.Matrix3(), v = new T.Vector3();
    for (const { geo, m } of list) {
      const g = geo.index ? geo.toNonIndexed() : geo;
      nm.getNormalMatrix(m);
      const p = g.attributes.position, n = g.attributes.normal, u = g.attributes.uv;
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i).applyMatrix4(m); pos.push(v.x, v.y, v.z);
        v.fromBufferAttribute(n, i).applyMatrix3(nm).normalize(); nor.push(v.x, v.y, v.z);
        if (u) uv.push(u.getX(i), u.getY(i)); else uv.push(0, 0);
      }
    }
    const out = new T.BufferGeometry();
    out.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    out.setAttribute('normal', new T.Float32BufferAttribute(nor, 3));
    out.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
    return out;
  }
  const M4 = (x, y, z, rx, ry, rz, sx, sy, sz) => new T.Matrix4().compose(new T.Vector3(x || 0, y || 0, z || 0), new T.Quaternion().setFromEuler(new T.Euler(rx || 0, ry || 0, rz || 0)), new T.Vector3(sx || 1, sy || 1, sz || 1));

  /* ------------------------------------------------------------------ */
  /* 3. Polygon geometry derived from LAYOUT                             */
  /* ------------------------------------------------------------------ */
  const OUT = LAYOUT.outline;
  function polyArea(p) { let a = 0; for (let i = 0; i < p.length; i++) { const [x1, z1] = p[i], [x2, z2] = p[(i + 1) % p.length]; a += x1 * z2 - x2 * z1; } return a / 2; }
  const SIGN = Math.sign(polyArea(OUT)) || 1;
  const AREA = Math.abs(polyArea(OUT));
  const BB = OUT.reduce((b, [x, z]) => ({ x0: Math.min(b.x0, x), x1: Math.max(b.x1, x), z0: Math.min(b.z0, z), z1: Math.max(b.z1, z) }), { x0: 1e9, x1: -1e9, z0: 1e9, z1: -1e9 });
  function inPoly(x, z) {
    let ins = false;
    for (let i = 0, j = OUT.length - 1; i < OUT.length; j = i++) {
      const [xi, zi] = OUT[i], [xj, zj] = OUT[j];
      if (((zi > z) !== (zj > z)) && (x < (xj - xi) * (z - zi) / (zj - zi) + xi)) ins = !ins;
    }
    return ins;
  }
  function distEdge(x, z) {
    let d = 1e9;
    for (let i = 0; i < OUT.length; i++) {
      const [x1, z1] = OUT[i], [x2, z2] = OUT[(i + 1) % OUT.length];
      const dx = x2 - x1, dz = z2 - z1, L2 = dx * dx + dz * dz;
      const t = clamp(((x - x1) * dx + (z - z1) * dz) / L2, 0, 1);
      d = Math.min(d, Math.hypot(x - (x1 + t * dx), z - (z1 + t * dz)));
    }
    return d;
  }
  const inside = (x, z, m) => inPoly(x, z) && distEdge(x, z) >= (m || 0);
  const EDGES = OUT.map((p, i) => {
    const a = p, b = OUT[(i + 1) % OUT.length];
    const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz);
    const n = SIGN > 0 ? [dz / L, -dx / L] : [-dz / L, dx / L];
    return { a, b, dx: dx / L, dz: dz / L, L, n };
  });
  const PERIM = EDGES.reduce((s, e) => s + e.L, 0);
  EDGES.reduce((s, e) => { e.s0 = s; return s + e.L; }, 0);
  function perimS(x, z) { // arc-length position of nearest perimeter point
    let best = 1e9, bs = 0;
    for (const e of EDGES) {
      const t = clamp((x - e.a[0]) * e.dx + (z - e.a[1]) * e.dz, 0, e.L);
      const d = Math.hypot(x - (e.a[0] + e.dx * t), z - (e.a[1] + e.dz * t));
      if (d < best) { best = d; bs = e.s0 + t; }
    }
    return bs;
  }
  function offsetOutline(o) { // orthogonal-friendly offset
    return OUT.map((p, i) => {
      const e1 = EDGES[(i - 1 + OUT.length) % OUT.length], e2 = EDGES[i];
      let nx = e1.n[0] + e2.n[0], nz = e1.n[1] + e2.n[1];
      const dot = e1.n[0] * e2.n[0] + e1.n[1] * e2.n[1];
      const k = o / (1 + dot);
      return [p[0] + nx * k, p[1] + nz * k];
    });
  }
  function shapeFrom(pts) { const s = new T.Shape(); pts.forEach(([x, z], i) => i ? s.lineTo(x, -z) : s.moveTo(x, -z)); s.closePath(); return s; }
  function scan(axis, c) { // inside intervals along a line; axis 'x' => line z=c
    const xs = [];
    for (let i = 0; i < OUT.length; i++) {
      const [x1, z1] = OUT[i], [x2, z2] = OUT[(i + 1) % OUT.length];
      const a1 = axis === 'x' ? z1 : x1, a2 = axis === 'x' ? z2 : x2, b1 = axis === 'x' ? x1 : z1, b2 = axis === 'x' ? x2 : z2;
      if ((a1 <= c && c < a2) || (a2 <= c && c < a1)) xs.push(b1 + (c - a1) * (b2 - b1) / (a2 - a1));
    }
    xs.sort((a, b) => a - b);
    const res = []; for (let i = 0; i + 1 < xs.length; i += 2) res.push([xs[i], xs[i + 1]]);
    return res;
  }
  const OPENINGS = LAYOUT.pits;
  function subtractOpenings(axis, c, iv, m) {
    let pieces = [iv];
    for (const r of OPENINGS) {
      const p0 = axis === 'x' ? r.z1 : r.x1, p1 = axis === 'x' ? r.z2 : r.x2;
      if (c < p0 || c > p1) continue;
      const q0 = (axis === 'x' ? r.x1 : r.z1) - m, q1 = (axis === 'x' ? r.x2 : r.z2) + m;
      const next = [];
      for (const [a, b] of pieces) {
        if (q1 <= a || q0 >= b) { next.push([a, b]); continue; }
        if (q0 > a) next.push([a, q0]);
        if (q1 < b) next.push([q1, b]);
      }
      pieces = next;
    }
    return pieces.filter(([a, b]) => b - a > 0.3);
  }
  const nearRect = (x, z, r, m) => x > r.x1 - m && x < r.x2 + m && z > r.z1 - m && z < r.z2 + m;
  const inOpening = (x, z, m) => OPENINGS.some(r => nearRect(x, z, r, m || 0));
  const ZONES = [].concat(LAYOUT.stairs, LAYOUT.shafts, LAYOUT.pits);
  const COLS = [];
  LAYOUT.gridX.forEach((x, i) => LAYOUT.gridZ.forEach((z, j) => {
    if (!inside(x, z, 2.0)) return;
    if (ZONES.some(r => nearRect(x, z, r, 1.0))) return;
    COLS.push({ x, z, label: LAYOUT.gridLabelsZ[j] + LAYOUT.gridLabelsX[i] });
  }));

  /* ------------------------------------------------------------------ */
  /* 4. Renderer, scene, camera, lights, sky                             */
  /* ------------------------------------------------------------------ */
  let renderer, scene, camera, W = 1, H = 1;
  const S = { time: 0, slide: 0, stageT: 0, frontX: -41, curingX: -41, flood: 0, night: 0, focusAmt: 0, built: {} };
  const MATS = {}, ELEM = {}, CALL = {};
  const updaters = [];

  const ENVS = {
    day:     { top: '#4f86c6', hor: '#e2cfae', glow: '#ffd59a', gAmt: 0.55, hemiS: '#d4e6ff', hemiG: '#806247', hemi: 0.62, key: '#ffe1b5', keyI: 1.55, keyP: [70, 95, 55], flood: 0, stars: 0, fog: '#d9c9ad', fogN: 190, fogF: 560, exp: 1.0, win: 0 },
    dusk:    { top: '#1d2c52', hor: '#e08b5c', glow: '#ff9a55', gAmt: 0.9, hemiS: '#7f8fb5', hemiG: '#4a3426', hemi: 0.36, key: '#ffb98a', keyI: 0.75, keyP: [-90, 35, 30], flood: 0, stars: 0.15, fog: '#8b6f6a', fogN: 170, fogF: 520, exp: 1.08, win: 0.4 },
    night:   { top: '#02050c', hor: '#16202f', glow: '#26324a', gAmt: 0.25, hemiS: '#34466a', hemiG: '#120e0a', hemi: 0.11, key: '#ffe2b8', keyI: 0.36, keyP: [-55, 48, 46], flood: 1, stars: 1, fog: '#0f1622', fogN: 150, fogF: 470, exp: 1.02, win: 1 },
    predawn: { top: '#0b1a36', hor: '#6a6684', glow: '#ff9e6e', gAmt: 0.6, hemiS: '#5a6a92', hemiG: '#241a12', hemi: 0.22, key: '#ffe2c0', keyI: 0.45, keyP: [-55, 48, 46], flood: 0.85, stars: 0.35, fog: '#3e4258', fogN: 160, fogF: 500, exp: 1.12, win: 0.7 },
    morning: { top: '#6c9fd8', hor: '#efe6d2', glow: '#fff1cf', gAmt: 0.5, hemiS: '#dbe9ff', hemiG: '#8a6c50', hemi: 0.66, key: '#fff0d8', keyI: 1.4, keyP: [95, 75, -30], flood: 0, stars: 0, fog: '#e3dccb', fogN: 200, fogF: 580, exp: 1.0, win: 0 }
  };
  const envCur = JSON.parse(JSON.stringify(ENVS.day));
  let envTarget = ENVS.day, envRate = 1.6;
  let sky, stars, hemi, key, amb, envDay, envNight;

  function init(canvas) {
    renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: !!window.__RAFT_CAPTURE });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.localClippingEnabled = true;
    scene = new T.Scene();
    scene.fog = new T.Fog(new T.Color(envCur.fog), envCur.fogN, envCur.fogF);
    camera = new T.PerspectiveCamera(36, 1, 0.5, 1500);

    hemi = new T.HemisphereLight(C(envCur.hemiS), C(envCur.hemiG), envCur.hemi); scene.add(hemi);
    amb = new T.AmbientLight(C('#ffffff'), 0.05); scene.add(amb);
    key = new T.DirectionalLight(C(envCur.key), envCur.keyI);
    key.position.set(...envCur.keyP); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    const sc = key.shadow.camera; sc.left = -78; sc.right = 78; sc.top = 78; sc.bottom = -78; sc.near = 5; sc.far = 320;
    key.shadow.bias = -0.0006; key.shadow.normalBias = 0.02;
    scene.add(key); scene.add(key.target);

    buildSky();
    buildEnvMaps();
    buildTextures();
    buildMaterials();
    buildGround();
    buildBlindingAndCAD();
    buildRebar();
    buildStarters();
    buildFormwork();
    buildScaffold();
    buildConcrete();
    buildLightTowers();
    buildCrane();
    buildPumps();
    buildTrucks();
    buildPlant();
    buildBuildings();
    buildSiteProps();
    buildFuture();
    buildFocusFX();
    buildPeople();
    resize();
    return { camera, renderer, scene };
  }

  function buildSky() {
    const geo = new T.SphereGeometry(700, 32, 16);
    const mat = new T.ShaderMaterial({
      side: T.BackSide, depthWrite: false, fog: false,
      uniforms: { top: { value: new T.Color(envCur.top) }, hor: { value: new T.Color(envCur.hor) }, glow: { value: new T.Color(envCur.glow) }, gAmt: { value: envCur.gAmt }, gDir: { value: new T.Vector3(0.6, 0.12, -0.8).normalize() } },
      vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 top; uniform vec3 hor; uniform vec3 glow; uniform float gAmt; uniform vec3 gDir; varying vec3 vD; void main(){ float h = vD.y; vec3 c = mix(hor, top, smoothstep(-0.02, 0.5, h)); float g = pow(max(dot(normalize(vD), gDir), 0.0), 6.0) * (1.0 - smoothstep(0.0, 0.5, h)); c += glow * g * gAmt; gl_FragColor = vec4(c, 1.0); }'
    });
    sky = new T.Mesh(geo, mat); sky.renderOrder = -10; scene.add(sky);
    const sp = [], r = rng(7);
    for (let i = 0; i < 900; i++) { const th = r() * Math.PI * 2, ph = Math.acos(lerp(0.12, 1, r())); sp.push(Math.sin(ph) * Math.cos(th) * 650, Math.cos(ph) * 650, Math.sin(ph) * Math.sin(th) * 650); }
    const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.Float32BufferAttribute(sp, 3));
    stars = new T.Points(sg, new T.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false }));
    scene.add(stars);
  }

  /* Reflection environments as small canvas cube maps (robust on every GPU; no PMREM). */
  function makeCubeEnv(topC, horC, groundC, lamps) {
    const N = 64, top = new T.Color(topC), hor = new T.Color(horC), gnd = new T.Color(groundC), col = new T.Color();
    const dirFor = [(u, v) => [1, -v, -u], (u, v) => [-1, -v, u], (u, v) => [u, 1, v], (u, v) => [u, -1, -v], (u, v) => [u, -v, 1], (u, v) => [-u, -v, -1]];
    const L = (lamps || []).map(([x, y, z, s]) => { const l = Math.hypot(x, y, z); return [x / l, y / l, z / l, s]; });
    const faces = dirFor.map(fn => {
      const c = document.createElement('canvas'); c.width = c.height = N;
      const g = c.getContext('2d'), img = g.createImageData(N, N), d = img.data;
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        let [dx, dy, dz] = fn(2 * (x + 0.5) / N - 1, 2 * (y + 0.5) / N - 1); const l = Math.hypot(dx, dy, dz); dx /= l; dy /= l; dz /= l;
        if (dy >= 0) col.copy(hor).lerp(top, smooth(dy / 0.6)); else col.copy(hor).lerp(gnd, smooth(-dy / 0.25));
        let add = 0; L.forEach(([lx, ly, lz, s]) => { const dd = dx * lx + dy * ly + dz * lz; add += Math.pow(Math.max(0, dd), s); });
        const i = (y * N + x) * 4;
        d[i] = clamp((col.r + add) * 255, 0, 255); d[i + 1] = clamp((col.g + add * 0.95) * 255, 0, 255); d[i + 2] = clamp((col.b + add * 0.85) * 255, 0, 255); d[i + 3] = 255;
      }
      g.putImageData(img, 0, 0); return c;
    });
    const tex = new T.CubeTexture(faces); tex.encoding = T.sRGBEncoding; tex.needsUpdate = true;
    return tex;
  }
  function buildEnvMaps() {
    envDay = makeCubeEnv('#7aa4d8', '#f1dfc2', '#6f5a45', [[0.5, 0.6, 0.4, 60]]);
    const lamps = [[-30, 9, 25], [-30, 9, -25], [-8, 9, -30], [22, 9, -18], [32, 9, 22], [14, 9, 30], [0, 14, 40], [-40, 14, 0]].map(p => p.concat([900]));
    envNight = makeCubeEnv('#03060c', '#1a2333', '#0b0907', lamps);
  }

  /* ------------------------------------------------------------------ */
  /* 5. Textures and materials                                           */
  /* ------------------------------------------------------------------ */
  const TEX = {};
  function buildTextures() {
    TEX.dirt = canvasTex(256, 256, (g, w, h) => {
      noiseFill(g, w, h, '#8d7860', 44, 18, 5);
      const r = rng(3);
      for (let i = 0; i < 260; i++) { g.fillStyle = r() > 0.5 ? 'rgba(60,44,30,.35)' : 'rgba(190,170,140,.35)'; g.beginPath(); g.ellipse(r() * w, r() * h, 0.6 + r() * 2, 0.5 + r() * 1.6, r() * 3, 0, 7); g.fill(); }
    }, { repeat: [90, 90] });
    TEX.pad = canvasTex(256, 256, (g, w, h) => {
      noiseFill(g, w, h, '#a8957c', 30, 22, 4);
      g.strokeStyle = 'rgba(80,62,45,.28)'; g.lineWidth = 3;
      for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(0, 40 + i * 60); g.bezierCurveTo(80, 20 + i * 60, 170, 80 + i * 60, 256, 50 + i * 60); g.stroke(); }
    }, { repeat: [10, 8] });
    TEX.gravel = canvasTex(256, 256, (g, w, h) => {
      noiseFill(g, w, h, '#8f8475', 60, 4, 3);
      const r = rng(5); for (let i = 0; i < 700; i++) { g.fillStyle = `rgba(${150 + r() * 80 | 0},${140 + r() * 70 | 0},${125 + r() * 60 | 0},.7)`; g.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2); }
    }, { repeat: [40, 2] });
    TEX.blinding = canvasTex(256, 256, (g, w, h) => noiseFill(g, w, h, '#8e8b86', 26, 10, 4), { repeat: [24, 18] });
    TEX.ply = canvasTex(512, 256, (g, w, h) => {
      const r = rng(11);
      for (let i = 0; i < 5; i++) {
        const y0 = i * h / 5, col = new T.Color('#c49456').offsetHSL((r() - 0.5) * 0.02, 0, (r() - 0.5) * 0.08);
        g.fillStyle = '#' + col.getHexString(); g.fillRect(0, y0, w, h / 5);
        for (let k = 0; k < 14; k++) { g.strokeStyle = `rgba(110,70,30,${0.12 + r() * 0.18})`; g.lineWidth = 1 + r() * 1.5; g.beginPath(); const yy = y0 + r() * h / 5; g.moveTo(0, yy); g.bezierCurveTo(w * 0.3, yy + (r() - 0.5) * 8, w * 0.7, yy + (r() - 0.5) * 8, w, yy + (r() - 0.5) * 6); g.stroke(); }
        g.fillStyle = 'rgba(60,35,15,.75)'; g.fillRect(0, y0 + h / 5 - 2, w, 2);
      }
      g.fillStyle = 'rgba(40,40,45,.9)';
      for (let x = 32; x < w; x += 64) for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(x, i * h / 5 + h / 10, 2.2, 0, 7); g.fill(); }
    });
    TEX.lattice = canvasTex(64, 256, (g, w, h) => {
      g.clearRect(0, 0, w, h); g.strokeStyle = '#fff'; g.lineWidth = 6; g.strokeRect(3, -4, w - 6, h + 8);
      g.lineWidth = 3; for (let y = 0; y < h; y += 64) { g.beginPath(); g.moveTo(3, y); g.lineTo(w - 3, y + 32); g.lineTo(3, y + 64); g.stroke(); g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    }, { repeat: [1, 1] });
    TEX.fence = canvasTex(128, 64, (g, w, h) => {
      g.clearRect(0, 0, w, h); g.strokeStyle = 'rgba(210,220,225,.9)'; g.lineWidth = 1;
      for (let x = 0; x < w; x += 6) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
      for (let y = 0; y < h; y += 6) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
      g.lineWidth = 4; g.strokeRect(2, 2, w - 4, h - 4);
    }, { repeat: [60, 1] });
    const facadeDraw = lit => (g, w, h) => {
      noiseFill(g, w, h, lit ? '#000000' : '#a8a196', lit ? 0 : 24, 6, 3);
      if (!lit) { g.strokeStyle = 'rgba(80,75,68,.45)'; g.lineWidth = 1; for (let y = 0; y < h; y += 8) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); for (let x = (y / 8) % 2 ? 0 : 12; x < w; x += 24) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 8); g.stroke(); } } }
      [[0.12, 0.22, 0.3, 0.5], [0.58, 0.22, 0.3, 0.5]].forEach(([x, y, ww, hh], k) => {
        g.fillStyle = lit ? (Math.random() > 0.55 ? '#ffcc88' : '#000') : '#1c1f24';
        g.fillRect(x * w, y * h, ww * w, hh * h);
      });
    };
    TEX.facade = canvasTex(128, 64, facadeDraw(false));
    TEX.facadeLit = canvasTex(128, 64, facadeDraw(true));
    TEX.net = canvasTex(128, 128, (g, w, h) => {
      g.fillStyle = 'rgba(40,120,70,.55)'; g.fillRect(0, 0, w, h);
      g.strokeStyle = 'rgba(200,200,190,.95)'; g.lineWidth = 3;
      for (let x = 0; x <= w; x += 64) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
      for (let y = 0; y <= h; y += 42) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    });
    TEX.drum = canvasTex(256, 64, (g, w, h) => {
      g.fillStyle = '#e9e5dc'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#d4462a'; for (let x = -64; x < w + 64; x += 48) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 20, 0); g.lineTo(x + 52, h); g.lineTo(x + 32, h); g.fill(); }
    });
    TEX.glow = canvasTex(128, 128, (g, w, h) => {
      const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.18, 'rgba(255,255,255,.55)'); gr.addColorStop(0.5, 'rgba(255,255,255,.12)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
    }, { srgb: false });
    TEX.ring = canvasTex(128, 128, (g, w, h) => {
      g.strokeStyle = 'rgba(255,255,255,.95)'; g.lineWidth = 7; g.beginPath(); g.arc(64, 64, 52, 0, 7); g.stroke();
    }, { srgb: false });
    TEX.normal = canvasTex(256, 256, (g, w, h) => {
      const hgt = new Float32Array(w * h);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) hgt[y * w + x] = fbm(x / 9, y / 9, 4) + Math.random() * 0.08;
      const img = g.createImageData(w, h), d = img.data;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const l = hgt[y * w + ((x - 1 + w) % w)], r = hgt[y * w + ((x + 1) % w)], u = hgt[((y - 1 + h) % h) * w + x], dn = hgt[((y + 1) % h) * w + x];
        const nx = (l - r) * 2.2, ny = (u - dn) * 2.2, nz = 1, L = Math.hypot(nx, ny, nz), i = (y * w + x) * 4;
        d[i] = (nx / L * 0.5 + 0.5) * 255; d[i + 1] = (ny / L * 0.5 + 0.5) * 255; d[i + 2] = (nz / L * 0.5 + 0.5) * 255; d[i + 3] = 255;
      }
      g.putImageData(img, 0, 0);
    }, { srgb: false, repeat: [36, 27] });
    TEX.cured = canvasTex(256, 256, (g, w, h) => {
      noiseFill(g, w, h, '#a9aaa7', 22, 14, 5);
      g.fillStyle = 'rgba(90,92,92,.08)'; const r = rng(9);
      for (let i = 0; i < 18; i++) { g.beginPath(); g.ellipse(r() * w, r() * h, 10 + r() * 30, 6 + r() * 20, r() * 3, 0, 7); g.fill(); }
    }, { repeat: [1, 1] });
    TEX.cured.repeat.set(1 / 9, 1 / 9);
    TEX.container = canvasTex(128, 64, (g, w, h) => {
      g.fillStyle = '#e8ecef'; g.fillRect(0, 0, w, h);
      g.fillStyle = 'rgba(0,0,0,.08)'; for (let x = 0; x < w; x += 6) g.fillRect(x, 0, 3, h);
      g.fillStyle = '#2b3d52'; g.fillRect(18, 18, 26, 20); g.fillRect(70, 18, 26, 20);
      g.fillStyle = '#1f6fb2'; g.fillRect(0, h - 8, w, 8);
    });
  }

  function std(hex, o) { return new T.MeshStandardMaterial(Object.assign({ color: C(hex), roughness: 0.8, metalness: 0 }, o || {})); }
  function buildMaterials() {
    const steel = { roughness: 0.42, metalness: 0.55 };
    MATS.barBottom = std('#8a5536', steel);
    MATS.barTop = std('#8a5536', steel);
    MATS.chair = std('#6f6f72', { roughness: 0.5, metalness: 0.6 });
    MATS.starter = std('#8d5838', steel);
    MATS.cover = std('#8e8b86', { roughness: 0.9 });
    MATS.coverSide = std('#8e8b86', { roughness: 0.9 });
    MATS.ply = std('#ffffff', { map: TEX.ply, roughness: 0.75 });
    MATS.timber = std('#b98a50', { roughness: 0.8 });
    MATS.stake = std('#8f6a3c', { roughness: 0.85 });
    [MATS.barBottom, MATS.barTop, MATS.starter, MATS.chair].forEach(m => { m.envMap = envDay; m.envMapIntensity = 0.6; });
    MATS.hl = [];
  }

  /* ------------------------------------------------------------------ */
  /* 6. Instanced reveal helper                                          */
  /* ------------------------------------------------------------------ */
  const _m = new T.Matrix4(), _p = new T.Vector3(), _q = new T.Quaternion(), _s = new T.Vector3(), _e = new T.Euler();
  const ZERO = new T.Matrix4().makeScale(0, 0, 0);
  class Reveal {
    constructor(geo, mat, items, opt) {
      this.items = items; this.opt = Object.assign({ mode: 'pop', win: 0.1, h: 1.5 }, opt || {});
      this.mesh = new T.InstancedMesh(geo, mat, Math.max(1, items.length));
      this.mesh.count = items.length;
      this.mesh.castShadow = !this.opt.noShadow; this.mesh.receiveShadow = true; this.mesh.frustumCulled = false;
      this.p = -1; this.set(0);
    }
    set(p) {
      if (Math.abs(p - this.p) < 1e-4) return;
      this.p = p; const { mode, win, h } = this.opt;
      let any = false;
      for (let i = 0; i < this.items.length; i++) {
        const it = this.items[i];
        const l = sat((p - it.k * (1 - win)) / win);
        if (l <= 0) { this.mesh.setMatrixAt(i, ZERO); continue; }
        any = true;
        const e = easeOut(l);
        _q.copy(it.q); _s.copy(it.s); _p.copy(it.p);
        if (mode === 'grow') { _s.x *= e; _p.addScaledVector(it.d, -it.s.x * (1 - e) / 2); _p.y += (1 - smooth(l * 3)) * 0.6; }
        else if (mode === 'drop') { _p.y += (1 - e) * h; }
        else if (mode === 'rise') { _s.y *= e; _p.y -= it.s.y * (1 - e) / 2; }
        else if (mode === 'pop') { _s.multiplyScalar(lerp(0.01, 1, e)); _p.y += (1 - e) * 0.4; }
        _m.compose(_p, _q, _s); this.mesh.setMatrixAt(i, _m);
      }
      this.mesh.visible = any;
      this.mesh.instanceMatrix.needsUpdate = true;
    }
  }
  const qY = a => new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 1, 0), a);
  const QI = new T.Quaternion();

  /* ------------------------------------------------------------------ */
  /* 7. Ground, roads, blinding, CAD overlay                             */
  /* ------------------------------------------------------------------ */
  function addMesh(geo, mat, x, y, z, parent, cast, recv) {
    const m = new T.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0);
    m.castShadow = cast !== false; m.receiveShadow = recv !== false; (parent || scene).add(m); return m;
  }
  function buildGround() {
    const g = new T.PlaneGeometry(900, 900, 150, 150); g.rotateX(-Math.PI / 2);
    const p = g.attributes.position, col = [];
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i);
      const far = smooth((Math.max(Math.abs(x) - 80, Math.abs(z) - 70, 0)) / 60);
      p.setY(i, (fbm(x / 60, z / 60, 3) - 0.5) * 6 * far - 0.02);
      const n = fbm(x / 22 + 9, z / 22, 4), wet = fbm(x / 9, z / 9 + 4, 3);
      const c = new T.Color('#ffffff').multiplyScalar(0.82 + n * 0.35 - (wet > 0.62 ? 0.12 : 0));
      col.push(c.r, c.g, c.b);
    }
    g.setAttribute('color', new T.Float32BufferAttribute(col, 3)); g.computeVertexNormals();
    addMesh(g, std('#b3a08a', { map: TEX.dirt, vertexColors: true, roughness: 1 }), 0, 0, 0, scene, false, true);
    // compacted working pad around the raft
    const pad = new T.PlaneGeometry(BB.x1 - BB.x0 + 34, BB.z1 - BB.z0 + 30); pad.rotateX(-Math.PI / 2);
    addMesh(pad, std('#c9ad8a', { map: TEX.pad, roughness: 1, transparent: true, opacity: 0.85 }), (BB.x0 + BB.x1) / 2, 0.01, (BB.z0 + BB.z1) / 2, scene, false, true);
    // gravel roads
    const roads = [[48, 0, 230, 9, 30], [-46, 0, 220, 7, 40], [0, -58, 7, 120, 0]];
    const rm = std('#ffffff', { map: TEX.gravel, roughness: 1 });
    roads.forEach(([z, x0, len, wid], i) => {
      let geo;
      if (i < 2) { geo = new T.PlaneGeometry(len, wid); geo.rotateX(-Math.PI / 2); addMesh(geo, rm, 40, 0.025, z, scene, false, true); }
    });
    const wroad = new T.PlaneGeometry(7, 104); wroad.rotateX(-Math.PI / 2); addMesh(wroad, rm, -58, 0.024, 0, scene, false, true);
  }

  function buildBlindingAndCAD() {
    const bl = new T.ExtrudeGeometry(shapeFrom(offsetOutline(0.6)), { depth: Y0, bevelEnabled: false });
    bl.rotateX(-Math.PI / 2);
    const blUV = bl.attributes.uv; for (let i = 0; i < blUV.count; i++) blUV.setXY(i, blUV.getX(i) / 4, blUV.getY(i) / 4);
    TEX.blinding.repeat.set(1, 1);
    addMesh(bl, std('#ffffff', { map: TEX.blinding, roughness: 0.95 }), 0, 0, 0, scene, false, true);

    // CAD sheet texture
    const m = 9, ppm = 20;
    const cw = Math.round((BB.x1 - BB.x0 + 2 * m) * ppm), ch = Math.round((BB.z1 - BB.z0 + 2 * m) * ppm);
    const P = (x, z) => [(x - BB.x0 + m) * ppm, (z - BB.z0 + m) * ppm];
    const draw = (g, w, h) => {
      g.clearRect(0, 0, w, h);
      g.fillStyle = 'rgba(6,16,28,0.46)'; g.fillRect(0, 0, w, h);
      g.strokeStyle = 'rgba(160,200,230,.5)'; g.lineWidth = 3; g.strokeRect(10, 10, w - 20, h - 20);
      const mono = '"IBM Plex Mono", "Courier New", monospace';
      // grid
      g.setLineDash([26, 9, 5, 9]); g.strokeStyle = '#2fd3ff'; g.lineWidth = 2.2;
      LAYOUT.gridX.forEach((x, i) => { const a = P(x, BB.z0 - 4.5), b = P(x, BB.z1 + 4.5); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); });
      LAYOUT.gridZ.forEach((z, i) => { const a = P(BB.x0 - 4.5, z), b = P(BB.x1 + 4.5, z); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); });
      g.setLineDash([]);
      const bubble = (x, z, t) => { const [px, pz] = P(x, z); g.fillStyle = 'rgba(6,16,28,.9)'; g.beginPath(); g.arc(px, pz, 25, 0, 7); g.fill(); g.strokeStyle = '#2fd3ff'; g.lineWidth = 3; g.stroke(); g.fillStyle = '#eaf6ff'; g.font = 'bold 26px ' + mono; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, px, pz + 1); };
      LAYOUT.gridX.forEach((x, i) => { bubble(x, BB.z0 - 6, LAYOUT.gridLabelsX[i]); bubble(x, BB.z1 + 6, LAYOUT.gridLabelsX[i]); });
      LAYOUT.gridZ.forEach((z, i) => { bubble(BB.x0 - 6, z, LAYOUT.gridLabelsZ[i]); bubble(BB.x1 + 6, z, LAYOUT.gridLabelsZ[i]); });
      // pits (hatched)
      LAYOUT.pits.forEach(r => {
        const [a, b] = [P(r.x1, r.z1), P(r.x2, r.z2)];
        g.save(); g.beginPath(); g.rect(a[0], a[1], b[0] - a[0], b[1] - a[1]); g.clip();
        g.strokeStyle = 'rgba(230,240,255,.85)'; g.lineWidth = 2; for (let k = -200; k < 200; k += 12) { g.beginPath(); g.moveTo(a[0] + k, a[1]); g.lineTo(a[0] + k + 200, a[1] + 200); g.stroke(); }
        g.restore(); g.strokeStyle = '#ffffff'; g.lineWidth = 4; g.strokeRect(a[0], a[1], b[0] - a[0], b[1] - a[1]);
      });
      // shafts (cross)
      LAYOUT.shafts.forEach(r => { const [a, b] = [P(r.x1, r.z1), P(r.x2, r.z2)]; g.strokeStyle = '#d7e3ff'; g.lineWidth = 3; g.strokeRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.moveTo(b[0], a[1]); g.lineTo(a[0], b[1]); g.stroke(); });
      // stairs
      LAYOUT.stairs.forEach(r => {
        const [a, b] = [P(r.x1, r.z1), P(r.x2, r.z2)];
        g.strokeStyle = '#39ff88'; g.lineWidth = 4; g.strokeRect(a[0], a[1], b[0] - a[0], b[1] - a[1]);
        g.lineWidth = 2; const mid = (a[0] + b[0]) / 2;
        for (let zz = a[1] + 22; zz < b[1] - 30; zz += 13) { g.beginPath(); g.moveTo(a[0] + 6, zz); g.lineTo(mid - 4, zz); g.moveTo(mid + 4, zz); g.lineTo(b[0] - 6, zz); g.stroke(); }
        g.beginPath(); g.moveTo(mid, a[1] + 6); g.lineTo(mid, b[1] - 6); g.stroke();
        g.fillStyle = '#39ff88'; g.beginPath(); g.moveTo(mid, b[1] - 14); g.lineTo(mid - 9, b[1] - 32); g.lineTo(mid + 9, b[1] - 32); g.fill();
      });
      // walls (double line)
      LAYOUT.walls.forEach(([x1, z1, x2, z2]) => {
        const L = Math.hypot(x2 - x1, z2 - z1), nx = -(z2 - z1) / L * 0.16, nz = (x2 - x1) / L * 0.16;
        g.strokeStyle = '#ff4fd8'; g.lineWidth = 3;
        [-1, 1].forEach(s => { const a = P(x1 + nx * s, z1 + nz * s), b = P(x2 + nx * s, z2 + nz * s); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); });
      });
      // columns
      COLS.forEach(c => { const [px, pz] = P(c.x, c.z), s = 11; g.fillStyle = '#ffd400'; g.fillRect(px - s, pz - s, 2 * s, 2 * s); g.strokeStyle = 'rgba(40,30,0,.8)'; g.lineWidth = 2; g.beginPath(); g.moveTo(px - s, pz - s); g.lineTo(px + s, pz + s); g.moveTo(px + s, pz - s); g.lineTo(px - s, pz + s); g.stroke(); });
      // raft border
      g.strokeStyle = '#ff3b3b'; g.lineWidth = 7; g.beginPath(); OUT.forEach(([x, z], i) => { const [px, pz] = P(x, z); i ? g.lineTo(px, pz) : g.moveTo(px, pz); }); g.closePath(); g.stroke();
      // match line
      g.setLineDash([30, 14]); g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 4; const ml = P(LAYOUT.matchLine, BB.z0 - 3), ml2 = P(LAYOUT.matchLine, BB.z1 + 3); g.beginPath(); g.moveTo(ml[0], ml[1]); g.lineTo(ml2[0], ml2[1]); g.stroke(); g.setLineDash([]);
      g.save(); g.translate(ml[0] - 12, ml[1] + 220); g.rotate(-Math.PI / 2); g.fillStyle = 'rgba(255,255,255,.92)'; g.font = 'bold 22px ' + mono; g.textAlign = 'center'; g.fillText('MATCH LINE · SHEET 1 | SHEET 2', 0, 0); g.restore();
      // dimensions
      const dim = (x1, z1, x2, z2, t, off) => {
        const a = P(x1, z1), b = P(x2, z2); g.strokeStyle = '#eaf6ff'; g.fillStyle = '#eaf6ff'; g.lineWidth = 2;
        g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
        [a, b].forEach(pt => { g.beginPath(); g.moveTo(pt[0] - 7, pt[1] + 7); g.lineTo(pt[0] + 7, pt[1] - 7); g.stroke(); });
        g.font = 'bold 30px ' + mono; g.textAlign = 'center'; g.textBaseline = 'bottom';
        g.save(); g.translate((a[0] + b[0]) / 2, (a[1] + b[1]) / 2); if (Math.abs(x2 - x1) < 0.01) g.rotate(-Math.PI / 2); g.fillText(t, 0, -off); g.restore();
      };
      dim(BB.x0, BB.z1 + 2.2, BB.x1, BB.z1 + 2.2, (BB.x1 - BB.x0).toFixed(2) + ' m', 6);
      dim(BB.x0 - 2.2, BB.z0, BB.x0 - 2.2, BB.z1, (BB.z1 - BB.z0).toFixed(2) + ' m', 6);
      // labels
      g.fillStyle = '#ff6b6b'; g.font = 'bold 34px ' + mono; g.textAlign = 'left'; g.textBaseline = 'alphabetic';
      const lb = P(BB.x0 + 2, BB.z1 - 1.2); g.fillText('R.C RAFT BORDER', lb[0], lb[1]);
      g.fillStyle = '#39ff88'; g.font = 'bold 20px ' + mono; g.textAlign = 'center';
      LAYOUT.stairs.forEach(r => { const p = P((r.x1 + r.x2) / 2, r.z1 - 0.8); g.fillText(r.name, p[0], p[1]); });
      g.fillStyle = '#ffffff';
      LAYOUT.pits.forEach(r => { const p = P((r.x1 + r.x2) / 2, r.z2 + 1.3); g.fillText(r.name, p[0], p[1]); });
      LAYOUT.shafts.forEach(r => { const p = P((r.x1 + r.x2) / 2, r.z1 - 0.7); g.fillStyle = '#d7e3ff'; g.fillText(r.name, p[0], p[1]); });
      // title block
      const tb = [w - 640, h - 128, 612, 104]; g.fillStyle = 'rgba(6,16,28,.92)'; g.fillRect(...tb); g.strokeStyle = 'rgba(160,200,230,.8)'; g.lineWidth = 2; g.strokeRect(...tb);
      g.fillStyle = '#eaf6ff'; g.textAlign = 'left'; g.font = 'bold 24px ' + mono; g.fillText('R.C. RAFT FOUNDATION · LAYOUT', tb[0] + 18, tb[1] + 38);
      g.font = '20px ' + mono; g.fillStyle = 'rgba(234,246,255,.8)'; g.fillText('A = ' + AREA.toLocaleString('en-US') + ' m²   t = ' + TH.toFixed(2) + ' m   cover = ' + Math.round(CV * 1000) + ' mm', tb[0] + 18, tb[1] + 72);
      // north arrow
      const na = [90, 120]; g.strokeStyle = '#eaf6ff'; g.fillStyle = '#eaf6ff'; g.lineWidth = 3; g.beginPath(); g.arc(na[0], na[1], 40, 0, 7); g.stroke(); g.beginPath(); g.moveTo(na[0], na[1] - 36); g.lineTo(na[0] - 12, na[1] + 10); g.lineTo(na[0] + 12, na[1] + 10); g.fill(); g.font = 'bold 26px ' + mono; g.textAlign = 'center'; g.fillText('N', na[0], na[1] - 48);
    };
    TEX.cad = canvasTex(cw, ch, draw, { srgb: false });
    const geo = new T.PlaneGeometry(cw / ppm, ch / ppm); geo.rotateX(-Math.PI / 2);
    const mat = new T.MeshBasicMaterial({ map: TEX.cad, transparent: true, depthWrite: false, toneMapped: false, opacity: 1, fog: false });
    ELEM.cad = new T.Mesh(geo, mat); ELEM.cad.renderOrder = 2;
    ELEM.cad.position.set((BB.x0 + BB.x1) / 2, Y0 + TH + 0.05, (BB.z0 + BB.z1) / 2); scene.add(ELEM.cad);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { const c = TEX.cad.userData.canvas; draw(c.getContext('2d'), c.width, c.height); TEX.cad.needsUpdate = true; });

    // ghost raft volume (slide 1)
    const vol = new T.ExtrudeGeometry(shapeFrom(OUT), { depth: TH, bevelEnabled: false }); vol.rotateX(-Math.PI / 2);
    ELEM.ghost = new T.Group();
    const gm = new T.Mesh(vol, new T.MeshBasicMaterial({ color: C('#2fd3ff'), transparent: true, opacity: 0.08, depthWrite: false, toneMapped: false }));
    const ge = new T.LineSegments(new T.EdgesGeometry(vol), new T.LineBasicMaterial({ color: C('#7fe6ff'), transparent: true, opacity: 0.9, toneMapped: false }));
    ELEM.ghost.add(gm, ge); ELEM.ghost.position.y = Y0; scene.add(ELEM.ghost);
  }

  /* ------------------------------------------------------------------ */
  /* 8. Reinforcement: bottom mesh, cover blocks, chairs, top mesh       */
  /* ------------------------------------------------------------------ */
  const barGeoX = new T.CylinderGeometry(1, 1, 1, 6, 1, true); barGeoX.rotateZ(Math.PI / 2);
  const barGeoY = new T.CylinderGeometry(1, 1, 1, 6, 1, true);
  const DIRX = new T.Vector3(1, 0, 0), DIRZ = new T.Vector3(0, 0, 1);
  function barsAlong(axis, y, spacing, endGap) {
    const res = [];
    const lo = axis === 'x' ? BB.z0 : BB.x0, hi = axis === 'x' ? BB.z1 : BB.x1;
    for (let c = lo + spacing / 2; c < hi; c += spacing) {
      scan(axis, c).forEach(iv => subtractOpenings(axis, c, [iv[0] + endGap, iv[1] - endGap], 0.08).forEach(([a, b]) => {
        const L = b - a, mid = (a + b) / 2;
        res.push(axis === 'x'
          ? { p: new T.Vector3(mid, y, c), q: QI, s: new T.Vector3(L, RB, RB), d: DIRX, c, a, b }
          : { p: new T.Vector3(c, y, mid), q: qY(-Math.PI / 2), s: new T.Vector3(L, RB, RB), d: DIRZ, c, a, b });
      }));
    }
    return res;
  }
  function radialKeys(items, fx, fz, getXZ, k0, k1) {
    let maxD = 0; const ds = items.map(it => { const [x, z] = getXZ(it); const d = Math.hypot(x - fx, z - fz); maxD = Math.max(maxD, d); return d; });
    items.forEach((it, i) => { it.k = lerp(k0, k1, Math.pow(ds[i] / (maxD || 1), 0.7)); });
  }

  function buildRebar() {
    const SP = LAYOUT.barSpacing, gap = CV + 0.02;
    // focus points (where each build starts) match the slide camera zones
    const F2 = [-24, 9], F3 = [-8, 12], F4 = [-6, 6];
    const bx = barsAlong('x', yB1, SP, gap), bz = barsAlong('z', yB2, SP, gap);
    radialKeys(bx, F2[0], F2[1], it => [F2[0], it.c], 0, 0.5);
    radialKeys(bz, F2[0], F2[1], it => [it.c, F2[1]], 0.45, 1);
    ELEM.bottom = new Reveal(barGeoX, MATS.barBottom, bx.concat(bz), { mode: 'grow', win: 0.16 });
    scene.add(ELEM.bottom.mesh);

    // bottom cover blocks
    const cb = [], cs = LAYOUT.coverBlockSpacing;
    for (let x = BB.x0 + 0.75; x < BB.x1; x += cs) for (let z = BB.z0 + 0.75; z < BB.z1; z += cs) {
      if (!inside(x, z, 0.3) || inOpening(x, z, 0.2)) continue;
      cb.push({ p: new T.Vector3(x, Y0 + CV / 2, z), q: QI, s: new T.Vector3(0.16, CV, 0.16) });
    }
    radialKeys(cb, F2[0], F2[1], it => [it.p.x, it.p.z], 0, 0.42);
    ELEM.coverB = new Reveal(new T.BoxGeometry(1, 1, 1), MATS.cover, cb, { mode: 'pop', win: 0.12, noShadow: true });
    scene.add(ELEM.coverB.mesh);

    // chairs
    const hC = (yT1 - RB) - (yB2 + RB);
    const leg = new T.BoxGeometry(0.035, hC, 0.035), top = new T.BoxGeometry(0.56, 0.035, 0.035), foot = new T.BoxGeometry(0.035, 0.03, 0.26);
    const chairGeo = mergeGeos([
      { geo: leg, m: M4(-0.2, hC / 2, 0, 0, 0, -0.1) }, { geo: leg, m: M4(0.2, hC / 2, 0, 0, 0, 0.1) },
      { geo: top, m: M4(0, hC, 0) }, { geo: foot, m: M4(-0.25, 0.015, 0) }, { geo: foot, m: M4(0.25, 0.015, 0) }
    ]);
    const ch = [], chs = LAYOUT.chairSpacing;
    for (let x = BB.x0 + 1.5; x < BB.x1; x += chs) for (let z = BB.z0 + 1.5; z < BB.z1; z += chs) {
      if (!inside(x, z, 0.8) || inOpening(x, z, 0.5)) continue;
      ch.push({ p: new T.Vector3(x, yB2 + RB, z), q: qY(((x + z) | 0) % 2 ? 0 : Math.PI / 2), s: new T.Vector3(1, 1, 1) });
    }
    radialKeys(ch, F3[0], F3[1], it => [it.p.x, it.p.z], 0, 1);
    ELEM.chairs = new Reveal(chairGeo, MATS.chair, ch, { mode: 'drop', win: 0.1, h: 1.6 });
    scene.add(ELEM.chairs.mesh);

    // top mesh: side bars (along z, across the width) then front bars (along x, along the length)
    const tz = barsAlong('z', yT1, SP, gap), tx = barsAlong('x', yT2, SP, gap);
    radialKeys(tz, F4[0], F4[1], it => [it.c, F4[1]], 0, 0.5);
    radialKeys(tx, F4[0], F4[1], it => [F4[0], it.c], 0.5, 1);
    ELEM.top = new Reveal(barGeoX, MATS.barTop, tz.concat(tx), { mode: 'grow', win: 0.14 });
    scene.add(ELEM.top.mesh);
  }

  /* ------------------------------------------------------------------ */
  /* 9. Starter bars (columns, walls, stairs, shaft)                     */
  /* ------------------------------------------------------------------ */
  const LAP = 1.6;
  function buildStarters() {
    const items = [], ties = [];
    const yb = yB2, ytop = Y0 + TH + LAP;
    const vbar = (x, z, h, k, tilt, dir) => {
      const L = h - yb, p = new T.Vector3(x, yb + L / 2, z);
      let q = QI;
      if (tilt) { q = new T.Quaternion().setFromEuler(new T.Euler(dir === 'z' ? tilt : 0, 0, dir === 'x' ? -tilt : 0)); p.y = yb + L * Math.cos(tilt) / 2; if (dir === 'z') p.z += L * Math.sin(tilt) / 2; else p.x += L * Math.sin(tilt) / 2; }
      items.push({ p, q, s: new T.Vector3(RB * 1.15, L, RB * 1.15), x, z });
    };
    const cs = LAYOUT.columnSize / 2 - 0.08;
    COLS.forEach(c => {
      [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]].forEach(([i, j]) => vbar(c.x + i * cs, c.z + j * cs, ytop));
      [1.25, 1.65, 2.05, 2.45].forEach(hh => ties.push({ p: new T.Vector3(c.x, Y0 + hh, c.z), q: QI, s: new T.Vector3(1, 1, 1), x: c.x, z: c.z }));
    });
    LAYOUT.walls.forEach(([x1, z1, x2, z2]) => {
      const L = Math.hypot(x2 - x1, z2 - z1), dx = (x2 - x1) / L, dz = (z2 - z1) / L, nx = -dz, nz = dx;
      for (let t = 0.3; t < L - 0.2; t += 0.6) [-0.12, 0.12].forEach(o => vbar(x1 + dx * t + nx * o, z1 + dz * t + nz * o, Y0 + TH + 1.4));
    });
    LAYOUT.stairs.forEach(r => {
      for (let x = r.x1 + 0.3; x < r.x2 - 0.2; x += 0.45) vbar(x, r.z1 + 0.6, Y0 + TH + 1.5, 0, 0.56, 'z');
      for (let z = r.z1 + 0.3; z < r.z2; z += 0.6) { vbar(r.x1, z, Y0 + TH + 1.3); vbar(r.x2, z, Y0 + TH + 1.3); }
      for (let x = r.x1 + 0.3; x < r.x2; x += 0.6) vbar(x, r.z2, Y0 + TH + 1.3);
    });
    LAYOUT.shafts.forEach(r => {
      const ring = (o) => { for (let x = r.x1 - o; x <= r.x2 + o; x += 0.5) { vbar(x, r.z1 - o, Y0 + TH + 1.5); vbar(x, r.z2 + o, Y0 + TH + 1.5); } for (let z = r.z1 - o + 0.5; z < r.z2 + o; z += 0.5) { vbar(r.x1 - o, z, Y0 + TH + 1.5); vbar(r.x2 + o, z, Y0 + TH + 1.5); } };
      ring(0.1); ring(0.35);
    });
    const F5 = [28, 10];
    radialKeys(items, F5[0], F5[1], it => [it.x, it.z], 0, 1);
    radialKeys(ties, F5[0], F5[1], it => [it.x, it.z], 0.05, 1);
    ELEM.starters = new Reveal(barGeoY, MATS.starter, items, { mode: 'drop', win: 0.12, h: 4.5 });
    scene.add(ELEM.starters.mesh);
    const b = 0.018, sz = LAYOUT.columnSize - 0.12;
    const tieGeo = mergeGeos([[0, sz / 2], [0, -sz / 2], [sz / 2, 0], [-sz / 2, 0]].map(([x, z], i) => ({ geo: new T.BoxGeometry(i < 2 ? sz : b, b, i < 2 ? b : sz), m: M4(x, 0, z) })));
    ELEM.ties = new Reveal(tieGeo, MATS.starter, ties, { mode: 'drop', win: 0.12, h: 4.5, noShadow: true });
    scene.add(ELEM.ties.mesh);
  }

  /* ------------------------------------------------------------------ */
  /* 10. Timber formwork with studs, walers, braces, stakes; side cover  */
  /* ------------------------------------------------------------------ */
  const FW_H = TH + 0.12;
  function buildFormwork() {
    const panels = [], studs = [], walers = [], braces = [], stakes = [], sideCv = [];
    const F6 = perimS(-20, 30);
    const keyAt = (s) => { let d = Math.abs(s - F6); d = Math.min(d, PERIM - d); return d < 13 ? (d / 13) * 0.8 : 0.8 + 0.2 * (d - 13) / (PERIM / 2 - 13); };
    EDGES.forEach(e => {
      const yaw = Math.atan2(-e.dz, e.dx), q = qY(yaw);
      const np = Math.ceil(e.L / 2.44);
      const pl = e.L / np;
      for (let i = 0; i < np; i++) {
        const t = (i + 0.5) * pl, x = e.a[0] + e.dx * t, z = e.a[1] + e.dz * t;
        const k = keyAt(e.s0 + t);
        panels.push({ p: new T.Vector3(x + e.n[0] * 0.025, Y0 - 0.04 + FW_H / 2, z + e.n[1] * 0.025), q, s: new T.Vector3(pl + (i === np - 1 || i === 0 ? 0.06 : 0.004), FW_H, 0.04), k: sat(k) });
        [0.28, 0.86].forEach(hh => walers.push({ p: new T.Vector3(x + e.n[0] * 0.17, Y0 + hh, z + e.n[1] * 0.17), q, s: new T.Vector3(pl, 0.09, 0.07), k: sat(k + 0.02) }));
      }
      for (let t = 0.3; t < e.L; t += 0.61) { const x = e.a[0] + e.dx * t, z = e.a[1] + e.dz * t; studs.push({ p: new T.Vector3(x + e.n[0] * 0.09, Y0 - 0.04 + FW_H / 2, z + e.n[1] * 0.09), q, s: new T.Vector3(0.05, FW_H, 0.1), k: sat(keyAt(e.s0 + t) + 0.015) }); }
      for (let t = 0.9; t < e.L - 0.3; t += 1.8) {
        const x = e.a[0] + e.dx * t, z = e.a[1] + e.dz * t, k = keyAt(e.s0 + t);
        const ax = x + e.n[0] * 0.22, az = z + e.n[1] * 0.22, ay = Y0 + 0.92;
        const bx = x + e.n[0] * 1.45, bz = z + e.n[1] * 1.45, by = 0.06;
        const L = Math.hypot(bx - ax, by - ay, bz - az);
        const dir = new T.Vector3(bx - ax, by - ay, bz - az).normalize();
        const bq = new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), dir);
        braces.push({ p: new T.Vector3((ax + bx) / 2, (ay + by) / 2, (az + bz) / 2), q: bq, s: new T.Vector3(0.06, L, 0.1), k: sat(k + 0.04) });
        stakes.push({ p: new T.Vector3(x + e.n[0] * 1.55, 0.18, z + e.n[1] * 1.55), q, s: new T.Vector3(0.07, 0.42, 0.07), k: sat(k + 0.03) });
      }
      for (let t = 0.5; t < e.L; t += 1.0) {
        const x = e.a[0] + e.dx * t, z = e.a[1] + e.dz * t, k = keyAt(e.s0 + t);
        [0.3, 0.72].forEach(hh => sideCv.push({ p: new T.Vector3(x - e.n[0] * CV / 2, Y0 + hh, z - e.n[1] * CV / 2), q, s: new T.Vector3(0.14, 0.14, CV), k: sat(k * 0.35) }));
      }
    });
    const box = new T.BoxGeometry(1, 1, 1);
    ELEM.coverS = new Reveal(box, MATS.coverSide, sideCv, { mode: 'pop', win: 0.1, noShadow: true });
    ELEM.panels = new Reveal(box, MATS.ply, panels.map(p => (p.k = sat(0.12 + p.k * 0.88), p)), { mode: 'rise', win: 0.08 });
    ELEM.studs = new Reveal(box, MATS.timber, studs.map(p => (p.k = sat(0.12 + p.k * 0.88), p)), { mode: 'rise', win: 0.08 });
    ELEM.walers = new Reveal(box, MATS.timber, walers.map(p => (p.k = sat(0.12 + p.k * 0.88), p)), { mode: 'pop', win: 0.08 });
    ELEM.braces = new Reveal(box, MATS.timber, braces.map(p => (p.k = sat(0.12 + p.k * 0.88), p)), { mode: 'pop', win: 0.08 });
    ELEM.stakes = new Reveal(box, MATS.stake, stakes.map(p => (p.k = sat(0.12 + p.k * 0.88), p)), { mode: 'drop', win: 0.08, h: 1.2 });
    ELEM.form = new T.Group();
    ['panels', 'studs', 'walers', 'braces', 'stakes'].forEach(k => ELEM.form.add(ELEM[k].mesh));
    scene.add(ELEM.form); scene.add(ELEM.coverS.mesh);
  }

  /* scaffold walkway along the south edge (for the pour) */
  function buildScaffold() {
    const g = new T.Group(), x0 = -36, x1 = 16, z = BB.z1 + 2.35, deck = 1.45;
    const poles = [], decks = [], rails = [];
    for (let x = x0; x <= x1; x += 2) [-0.55, 0.55].forEach(o => poles.push({ p: new T.Vector3(x, 1.25, z + o), q: QI, s: new T.Vector3(0.05, 2.5, 0.05) }));
    for (let x = x0 + 1; x < x1; x += 2) { decks.push({ p: new T.Vector3(x, deck, z), q: QI, s: new T.Vector3(2, 0.06, 1.2) }); [1.0, 2.4].forEach(h => rails.push({ p: new T.Vector3(x, h, z + 0.55), q: QI, s: new T.Vector3(2, 0.04, 0.04) })); rails.push({ p: new T.Vector3(x, 2.4, z - 0.55), q: QI, s: new T.Vector3(2, 0.04, 0.04) }); }
    const box = new T.BoxGeometry(1, 1, 1);
    const mk = (items, mat) => { const r = new Reveal(box, mat, items.map(i => (i.k = 0, i)), { mode: 'pop', win: 1 }); r.set(1); g.add(r.mesh); };
    mk(poles, std('#b7bcc2', { metalness: 0.6, roughness: 0.4 })); mk(decks, std('#9c7a4c')); mk(rails, std('#e9c22a', { metalness: 0.3, roughness: 0.5 }));
    ELEM.scaffold = g; g.visible = false; scene.add(g);
    S.scaffold = { x0, x1, z, deck };
  }

  /* ------------------------------------------------------------------ */
  /* 11. Concrete: live heightfield (pour) + solid cured raft            */
  /* ------------------------------------------------------------------ */
  function frontAt(z) { return S.frontX + 1.4 * Math.sin(z * 0.17 + S.time * 0.12) + 0.6 * Math.sin(z * 0.43 - S.time * 0.07); }
  function concreteH(x, z) { const d = frontAt(z) - x; return 0.5 * smooth((d + 4) / 2.5) + 0.5 * smooth(d / 2.5); }
  function pouredArea(X) { // exact poured plan area for a straight front at X
    let a = 0; const n = 200, dx = (BB.x1 - BB.x0) / n;
    for (let i = 0; i < n; i++) { const x = BB.x0 + (i + 0.5) * dx; if (x > X) break; a += scan('z', x).reduce((s, [p, q]) => s + (q - p), 0) * dx; }
    return a;
  }
  function frontForArea(A) { let lo = BB.x0, hi = BB.x1; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (pouredArea(m) < A) lo = m; else hi = m; } return (lo + hi) / 2; }

  function buildConcrete() {
    const nx = Math.round((BB.x1 - BB.x0) * 2), nz = Math.round((BB.z1 - BB.z0) * 2);
    const g = new T.PlaneGeometry(BB.x1 - BB.x0, BB.z1 - BB.z0, nx, nz); g.rotateX(-Math.PI / 2);
    g.translate((BB.x0 + BB.x1) / 2, 0, (BB.z0 + BB.z1) / 2);
    const p = g.attributes.position, flags = new Uint8Array(p.count);
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); flags[i] = (inPoly(x, z) || distEdge(x, z) < 0.01) ? (inOpening(x, z, 0.05) ? 2 : 1) : 0; p.setY(i, Y0 - 0.4); }
    const mat = new T.MeshStandardMaterial({ color: C('#a2a6aa'), roughness: 0.2, metalness: 0.0, envMap: envNight, envMapIntensity: 1.25, normalMap: TEX.normal, normalScale: new T.Vector2(0.18, 0.18) });
    MATS.wet = mat;
    ELEM.hf = new T.Mesh(g, mat); ELEM.hf.receiveShadow = true; ELEM.hf.castShadow = false; ELEM.hf.frustumCulled = false;
    ELEM.hf.userData = { flags, lastX: null }; ELEM.hf.visible = false; scene.add(ELEM.hf);

    // solid raft (cured), with pit holes and pit interiors
    const sh = shapeFrom(OUT);
    LAYOUT.pits.forEach(r => { const h = new T.Path(); h.moveTo(r.x1, -r.z1); h.lineTo(r.x1, -r.z2); h.lineTo(r.x2, -r.z2); h.lineTo(r.x2, -r.z1); h.closePath(); sh.holes.push(h); });
    const sg = new T.ExtrudeGeometry(sh, { depth: TH, bevelEnabled: false }); sg.rotateX(-Math.PI / 2);
    MATS.cured = std('#ffffff', { map: TEX.cured, roughness: 0.88 });
    ELEM.solid = new T.Group();
    const sm = new T.Mesh(sg, MATS.cured); sm.castShadow = true; sm.receiveShadow = true; sm.position.y = Y0; ELEM.solid.add(sm);
    LAYOUT.pits.forEach(r => { const b = new T.Mesh(new T.BoxGeometry(r.x2 - r.x1, TH * 0.9, r.z2 - r.z1), std('#7c7d7c', { side: T.BackSide, roughness: 0.9 })); b.position.set((r.x1 + r.x2) / 2, Y0 + TH - TH * 0.45 + 0.001, (r.z1 + r.z2) / 2); b.receiveShadow = true; ELEM.solid.add(b); });
    ELEM.solid.visible = false; scene.add(ELEM.solid);

    // curing sheets (clipped plane that grows along x) + roll
    S.cureClip = new T.Plane(new T.Vector3(-1, 0, 0), -100);
    const cg = new T.ShapeGeometry(shapeFrom(offsetOutline(-0.15))); cg.rotateX(-Math.PI / 2);
    const cm = new T.MeshStandardMaterial({ color: C('#e6f0f6'), transparent: true, opacity: 0.42, roughness: 0.12, metalness: 0.05, clippingPlanes: [S.cureClip], side: T.DoubleSide, envMap: envNight, envMapIntensity: 1.4, depthWrite: false });
    ELEM.cure = new T.Mesh(cg, cm); ELEM.cure.position.y = Y0 + TH + 0.03; ELEM.cure.visible = false; ELEM.cure.renderOrder = 3; scene.add(ELEM.cure);
    ELEM.roll = new T.Mesh(new T.CylinderGeometry(0.14, 0.14, BB.z1 - BB.z0 - 0.4, 12), std('#dfe9ef', { roughness: 0.3 }));
    ELEM.roll.rotation.x = Math.PI / 2; ELEM.roll.position.set(0, Y0 + TH + 0.16, (BB.z0 + BB.z1) / 2); ELEM.roll.visible = false; scene.add(ELEM.roll);
  }
  function updateHeightfield(force) {
    const hf = ELEM.hf, ud = hf.userData;
    if (!force && ud.lastX !== null && Math.abs(ud.lastX - S.frontX) < 0.03 && (S.time - (ud.lastT || 0)) < 0.25) return;
    ud.lastX = S.frontX; ud.lastT = S.time;
    const p = hf.geometry.attributes.position, f = ud.flags;
    for (let i = 0; i < p.count; i++) {
      if (!f[i]) { continue; }
      const h = concreteH(p.getX(i), p.getZ(i));
      const top = f[i] === 2 ? TH * 0.42 : TH;
      p.setY(i, h < 0.01 ? Y0 - 0.05 : Y0 + h * top);
    }
    p.needsUpdate = true; hf.geometry.computeVertexNormals();
  }

  /* ------------------------------------------------------------------ */
  /* 12. Floodlight towers (spot lights, beams, glows, dust)             */
  /* ------------------------------------------------------------------ */
  const TOWERS = [];
  function beamMaterial(color) {
    return new T.ShaderMaterial({
      transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide, fog: false,
      uniforms: { col: { value: new T.Color(color) }, inten: { value: 0 }, len: { value: 30 } },
      vertexShader: 'uniform float len; varying float vT; varying vec3 vN; varying vec3 vV; void main(){ vT = clamp(position.z/len,0.0,1.0); vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }',
      fragmentShader: 'uniform vec3 col; uniform float inten; varying float vT; varying vec3 vN; varying vec3 vV; void main(){ float e = pow(abs(dot(normalize(vN), normalize(vV))), 1.6); float a = pow(1.0 - vT, 1.6) * e * inten; gl_FragColor = vec4(col * a, a); }'
    });
  }
  function buildLightTowers() {
    const pos = [[-47.5, 33, 4, 12], [-47.5, -33, 0, -6], [-12, -37, -4, -10], [30, -22.5, 26, -6], [47, 18, 22, 8], [22, 40, 10, 18]];
    const yel = std('#e8b81a', { roughness: 0.5, metalness: 0.2 }), gray = std('#5b6168', { metalness: 0.6, roughness: 0.4 });
    pos.forEach(([x, z, tx, tz], i) => {
      const g = new T.Group(); g.position.set(x, 0, z); scene.add(g);
      addMesh(new T.BoxGeometry(2.6, 1.1, 1.4), yel, 0, 0.95, 0, g);
      [-0.9, 0.9].forEach(o => addMesh(new T.CylinderGeometry(0.32, 0.32, 0.2, 12), std('#1d1f22'), o, 0.32, 0.72, g).rotation.x = Math.PI / 2);
      addMesh(new T.CylinderGeometry(0.09, 0.13, 9.5, 8), gray, 0, 6.2, 0, g);
      const head = new T.Group(); head.position.set(0, 10.9, 0); g.add(head);
      const yaw = Math.atan2(tx - x, tz - z); head.rotation.y = yaw;
      addMesh(new T.BoxGeometry(2.4, 0.12, 0.12), gray, 0, 0, 0, head);
      const lampMat = new T.MeshStandardMaterial({ color: C('#2a2c30'), emissive: C('#fff1d2'), emissiveIntensity: 0, roughness: 0.4 });
      [-0.9, -0.3, 0.3, 0.9].forEach(o => { const l = addMesh(new T.BoxGeometry(0.5, 0.42, 0.14), lampMat, o, 0.3, 0.1, head); l.rotation.x = 0.55; });
      const spot = new T.SpotLight(C('#fff0d6'), 0, 120, 0.78, 0.55, 1.1);
      spot.position.set(x, 11, z); spot.target.position.set(tx, 0, tz); scene.add(spot, spot.target);
      const len = Math.hypot(tx - x, 11, tz - z) * 1.08, rad = Math.tan(0.62) * len;
      const cg = new T.ConeGeometry(rad, len, 28, 1, true); cg.translate(0, -len / 2, 0); cg.rotateX(-Math.PI / 2);
      const bm = beamMaterial('#ffe9c4'); bm.uniforms.len.value = len;
      const beam = new T.Mesh(cg, bm); beam.position.set(x, 11.1, z); beam.lookAt(tx, 0, tz); beam.renderOrder = 5; scene.add(beam);
      const glow = new T.Sprite(new T.SpriteMaterial({ map: TEX.glow, color: C('#fff1d8'), blending: T.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0, fog: false }));
      glow.scale.set(6, 6, 1); glow.position.set(x, 11.2, z); scene.add(glow);
      TOWERS.push({ g, spot, beam, glow, lampMat, level: 0, i });
    });
    // dust motes
    const dp = [], r = rng(21);
    for (let i = 0; i < 700; i++) dp.push(lerp(BB.x0 - 8, BB.x1 + 8, r()), r() * 12, lerp(BB.z0 - 8, BB.z1 + 8, r()));
    const dg = new T.BufferGeometry(); dg.setAttribute('position', new T.Float32BufferAttribute(dp, 3));
    ELEM.dust = new T.Points(dg, new T.PointsMaterial({ color: C('#fff2d8'), size: 0.09, transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false }));
    scene.add(ELEM.dust);
  }

  /* ------------------------------------------------------------------ */
  /* 13. Tower crane                                                     */
  /* ------------------------------------------------------------------ */
  function buildCrane() {
    const g = new T.Group(); g.position.set(-55, 0, 14); scene.add(g);
    const lat = new T.MeshStandardMaterial({ color: C('#f0c02c'), map: TEX.lattice, alphaTest: 0.5, side: T.DoubleSide, roughness: 0.5, metalness: 0.3 });
    const latH = TEX.lattice.clone(); latH.needsUpdate = true; latH.wrapS = latH.wrapT = T.RepeatWrapping; latH.repeat.set(1, 18);
    const latMast = lat.clone(); latMast.map = latH;
    addMesh(new T.BoxGeometry(4.5, 1, 4.5), std('#8c8a86'), 0, 0.5, 0, g);
    const mastH = 36; addMesh(new T.BoxGeometry(1.8, mastH, 1.8), latMast, 0, mastH / 2 + 1, 0, g);
    const slew = new T.Group(); slew.position.y = mastH + 1; g.add(slew);
    addMesh(new T.BoxGeometry(2.4, 1.4, 2.4), std('#f0c02c', { roughness: 0.5 }), 0, 0.7, 0, slew);
    addMesh(new T.BoxGeometry(1.6, 1.8, 1.6), std('#e9eef2', { roughness: 0.3, metalness: 0.2 }), 1.4, 0.4, 1.6, slew);
    const latJ = TEX.lattice.clone(); latJ.needsUpdate = true; latJ.wrapS = latJ.wrapT = T.RepeatWrapping; latJ.repeat.set(1, 22);
    const jm = lat.clone(); jm.map = latJ;
    const jibL = 60, cjL = 15;
    const jib = addMesh(new T.BoxGeometry(1.3, 1.4, jibL), jm, 0, 2.1, -jibL / 2 - 1, slew); jib.rotation.z = Math.PI / 2;
    const cj = addMesh(new T.BoxGeometry(1.2, 1.2, cjL), jm, 0, 2.0, cjL / 2 + 1, slew); cj.rotation.z = Math.PI / 2;
    addMesh(new T.BoxGeometry(2.4, 2.2, 3.2), std('#9a9893'), 0, 1.0, cjL - 1, slew);
    addMesh(new T.BoxGeometry(1.1, 7, 1.1), latMast, 0, 5.5, 0, slew);
    const tie = new T.BufferGeometry().setFromPoints([new T.Vector3(0, 9, 0), new T.Vector3(0, 2.8, -jibL * 0.7), new T.Vector3(0, 9, 0), new T.Vector3(0, 2.6, cjL)]);
    slew.add(new T.LineSegments(tie, new T.LineBasicMaterial({ color: 0x777777 })));
    const trolley = new T.Group(); slew.add(trolley); trolley.position.set(0, 1.35, -30);
    addMesh(new T.BoxGeometry(1.2, 0.5, 1.4), std('#d6a927'), 0, 0, 0, trolley);
    const cable = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 1, 4), std('#333')); trolley.add(cable);
    const hook = new T.Group(); trolley.add(hook);
    addMesh(new T.BoxGeometry(0.6, 0.8, 0.4), std('#e0b020'), 0, 0, 0, hook);
    const bundle = new T.Group(); bundle.position.y = -1.6; hook.add(bundle);
    const bg = new T.CylinderGeometry(0.05, 0.05, 11, 6); bg.rotateZ(Math.PI / 2);
    for (let i = 0; i < 9; i++) addMesh(bg, MATS.barTop, 0, (i % 3) * 0.1, ((i / 3) | 0) * 0.1 - 0.1, bundle);
    const sling = new T.BufferGeometry().setFromPoints([new T.Vector3(0, 1.2, 0), new T.Vector3(-4, -0.0, 0), new T.Vector3(0, 1.2, 0), new T.Vector3(4, 0, 0)]);
    bundle.add(new T.LineSegments(sling, new T.LineBasicMaterial({ color: 0x222222 })));
    const beacon = new T.Mesh(new T.SphereGeometry(0.25, 8, 6), new T.MeshBasicMaterial({ color: C('#ff2a2a') })); beacon.position.set(0, 9.4, 0); slew.add(beacon);
    ELEM.crane = { g, slew, trolley, cable, hook, bundle, beacon, base: g.position.clone(), jibL };
  }
  function updateCrane(dt) {
    const c = ELEM.crane; if (!c) return;
    let targetX = -10, targetZ = 2, drop = 14, show = false;
    if (S.slide === 4) {
      const ph = (S.stageT % 14) / 14; targetX = -8 + 6 * Math.sin(S.stageT * 0.08); targetZ = 4;
      drop = ph < 0.55 ? lerp(10, 33.5, smooth(ph / 0.55)) : lerp(33.5, 10, smooth((ph - 0.55) / 0.45));
      show = ph < 0.62;
    } else if (S.slide >= 2 && S.slide <= 5) { targetX = -20 + 8 * Math.sin(S.time * 0.05); targetZ = 8 + 10 * Math.cos(S.time * 0.04); drop = 12 + 4 * Math.sin(S.time * 0.3); show = S.slide < 5; }
    else { targetX = -30 + 6 * Math.sin(S.time * 0.03); targetZ = -10; drop = 8; }
    const dx = targetX - c.base.x, dz = targetZ - c.base.z;
    const yaw = Math.atan2(-dx, -dz), dist = clamp(Math.hypot(dx, dz), 6, c.jibL - 2);
    c.slew.rotation.y += (yaw - c.slew.rotation.y) * Math.min(1, dt * 0.8);
    c.trolley.position.z += (-dist - c.trolley.position.z) * Math.min(1, dt * 0.8);
    c.hook.position.y = -drop; c.cable.scale.y = drop; c.cable.position.y = -drop / 2;
    c.bundle.visible = show;
    c.beacon.material.color.setRGB(S.night > 0.3 && (S.time % 1.4) < 0.5 ? 1 : 0.25, 0.05, 0.05);
  }

  /* ------------------------------------------------------------------ */
  /* 14. Concrete boom pumps                                             */
  /* ------------------------------------------------------------------ */
  const PUMPS = [];
  const L1 = 13, L2 = 12, L3 = 8.5, HOSE = 3.2, PIV = 3.6;
  function buildPumps() {
    const cfg = [[-26, BB.z1 + 7.6, 0], [6, BB.z1 + 7.6, 0], [-20, BB.z0 - 7.5, Math.PI], [-47.5, -8, Math.PI / 2], [BB.x1 + 7.5, 4, -Math.PI / 2]];
    const white = std('#eef1f3', { roughness: 0.45, metalness: 0.2 }), red = std('#d9431e', { roughness: 0.45, metalness: 0.25 }), dark = std('#23262b', { roughness: 0.7 }), tyre = std('#141517');
    cfg.forEach(([x, z, yaw], i) => {
      const g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = yaw; scene.add(g);
      addMesh(new T.BoxGeometry(10.5, 0.9, 2.5), dark, 0, 1.1, 0, g);
      addMesh(new T.BoxGeometry(2.3, 2.3, 2.5), white, 4.4, 2.2, 0, g);
      addMesh(new T.BoxGeometry(0.1, 0.9, 2.2), std('#1b2a3a', { roughness: 0.15, metalness: 0.4 }), 5.56, 2.6, 0, g);
      addMesh(new T.BoxGeometry(7.6, 1.0, 2.4), white, -1.3, 2.0, 0, g);
      [-4.2, -2.8, 2.2, 4.0].forEach(ox => [-1.15, 1.15].forEach(oz => addMesh(new T.CylinderGeometry(0.55, 0.55, 0.4, 14), tyre, ox, 0.55, oz, g).rotation.x = Math.PI / 2));
      [[-3.6, 1], [-3.6, -1], [2.6, 1], [2.6, -1]].forEach(([ox, s]) => { const leg = addMesh(new T.BoxGeometry(0.3, 0.3, 3.4), red, ox, 1.2, s * 2.6, g); addMesh(new T.BoxGeometry(0.2, 1.2, 0.2), red, ox, 0.6, s * 4.2, g); addMesh(new T.BoxGeometry(0.8, 0.08, 0.8), dark, ox, 0.04, s * 4.2, g); });
      const hop = new T.CylinderGeometry(0.95, 0.5, 0.9, 4); hop.rotateY(Math.PI / 4);
      addMesh(hop, std('#b9bec4', { metalness: 0.5, roughness: 0.4 }), -5.7, 1.5, 0, g);
      const tur = new T.Group(); tur.position.set(-1.6, PIV, 0); g.add(tur);
      addMesh(new T.CylinderGeometry(0.75, 0.9, 0.9, 16), red, 0, -0.3, 0, tur);
      const seg = (len, w) => { const grp = new T.Group(); const m = addMesh(new T.BoxGeometry(len, w, w * 0.8), red, len / 2, 0, 0, grp); const pipe = addMesh(new T.CylinderGeometry(0.07, 0.07, len, 6), std('#c5c9ce', { metalness: 0.7, roughness: 0.3 }), len / 2, w / 2 + 0.1, 0, grp); pipe.rotation.z = Math.PI / 2; return grp; };
      const b1 = seg(L1, 0.7), b2 = seg(L2, 0.55), b3 = seg(L3, 0.42);
      tur.add(b1); b2.position.x = L1; b1.add(b2); b3.position.x = L2; b2.add(b3);
      const hose = new T.Group(); hose.position.x = L3; b3.add(hose);
      const hm = addMesh(new T.CylinderGeometry(0.11, 0.11, HOSE, 8), std('#1a1a1a', { roughness: 0.6 }), 0, -HOSE / 2, 0, hose);
      const stream = new T.Mesh(new T.CylinderGeometry(0.14, 0.2, 1, 8), std('#6e7277', { roughness: 0.25, envMap: envNight, envMapIntensity: 1 }));
      stream.visible = false; scene.add(stream);
      const ripple = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: TEX.ring, transparent: true, depthWrite: false, opacity: 0, color: C('#cfd6dc'), toneMapped: false }));
      ripple.rotation.x = -Math.PI / 2; ripple.visible = false; scene.add(ripple);
      const p = { g, tur, b1, b2, b3, hose, stream, ripple, base: new T.Vector3(x, 0, z), yaw, cur: new T.Vector3(), tgt: new T.Vector3(), active: false, i };
      const fwd = new T.Vector3(1, 0, 0).applyAxisAngle(new T.Vector3(0, 1, 0), yaw);
      p.cur.set(x - fwd.x * 1.6 - Math.sin(yaw) * 0 + (-fwd.z) * 0, 14, z).add(new T.Vector3(-fwd.z * 8, 0, fwd.x * 8));
      p.tgt.copy(p.cur);
      PUMPS.push(p);
    });
    ELEM.pumps = PUMPS;
  }
  const _v = new T.Vector3();
  function aimPump(p, wt) { // wt: world target for hose tip
    p.g.updateMatrixWorld();
    const piv = p.tur.getWorldPosition(_v.set(0, 0, 0)).clone();
    const dx = wt.x - piv.x, dz = wt.z - piv.z;
    const yawW = Math.atan2(-dz, dx); p.tur.rotation.y = yawW - p.yaw;
    const d = Math.hypot(dx, dz), h = wt.y + HOSE - piv.y;
    const phi3 = -1.25;
    let ex = d - L3 * Math.cos(phi3), ey = h - L3 * Math.sin(phi3);
    let D = Math.hypot(ex, ey); const Dm = L1 + L2 - 0.05;
    if (D > Dm) { ex *= Dm / D; ey *= Dm / D; D = Dm; }
    const c2 = clamp((D * D - L1 * L1 - L2 * L2) / (2 * L1 * L2), -1, 1);
    const a2 = -Math.acos(c2);
    const a1 = Math.atan2(ey, ex) - Math.atan2(L2 * Math.sin(a2), L1 + L2 * Math.cos(a2));
    p.b1.rotation.z = a1; p.b2.rotation.z = a2; p.b3.rotation.z = phi3 - a1 - a2; p.hose.rotation.z = -phi3;
  }

  /* ------------------------------------------------------------------ */
  /* 15. Mixer trucks                                                    */
  /* ------------------------------------------------------------------ */
  const TRUCKS = [];
  function makeTruck() {
    const g = new T.Group();
    const dark = std('#2a2d32', { roughness: 0.7 }), cabC = std('#f2f2ee', { roughness: 0.4, metalness: 0.2 }), tyre = std('#141517');
    addMesh(new T.BoxGeometry(8.6, 0.7, 2.3), dark, 0, 1.0, 0, g);
    addMesh(new T.BoxGeometry(2.1, 2.3, 2.4), cabC, 3.4, 2.25, 0, g);
    addMesh(new T.BoxGeometry(0.08, 0.95, 2.1), std('#1b2a3a', { roughness: 0.1, metalness: 0.5 }), 4.47, 2.7, 0, g);
    [-3.3, -2.0, 1.4, 3.3].forEach(ox => [-1.1, 1.1].forEach(oz => addMesh(new T.CylinderGeometry(0.52, 0.52, 0.36, 14), tyre, ox, 0.52, oz, g).rotation.x = Math.PI / 2));
    const prof = [[0.2, 0], [0.9, 0.5], [1.2, 1.6], [1.25, 2.7], [0.95, 3.9], [0.5, 4.6], [0.35, 4.75]].map(([r, y]) => new T.Vector2(r, y));
    const dg = new T.LatheGeometry(prof, 18); dg.rotateZ(Math.PI / 2);
    const drumPivot = new T.Group(); drumPivot.position.set(2.0, 2.65, 0); drumPivot.rotation.z = -0.2; g.add(drumPivot);
    const drum = addMesh(dg, std('#ffffff', { map: TEX.drum, roughness: 0.45, metalness: 0.15 }), 0, 0, 0, drumPivot);
    const chute = addMesh(new T.BoxGeometry(1.8, 0.08, 0.5), std('#9aa0a6', { metalness: 0.5, roughness: 0.4 }), -4.6, 1.8, 0, g); chute.rotation.z = 0.5;
    const hlMat = new T.MeshStandardMaterial({ color: C('#ddd'), emissive: C('#fff6dc'), emissiveIntensity: 0 });
    const tlMat = new T.MeshStandardMaterial({ color: C('#400'), emissive: C('#ff2a1a'), emissiveIntensity: 0 });
    [-0.8, 0.8].forEach(oz => { addMesh(new T.BoxGeometry(0.08, 0.2, 0.35), hlMat, 4.5, 1.45, oz, g); addMesh(new T.BoxGeometry(0.08, 0.18, 0.25), tlMat, -4.32, 1.2, oz, g); });
    const flow = new T.Mesh(new T.CylinderGeometry(0.12, 0.16, 1.2, 8), std('#6d7176', { roughness: 0.25 })); flow.position.set(-5.4, 1.35, 0); flow.rotation.z = 0.5; flow.visible = false; g.add(flow);
    const bm = beamMaterial('#fff4dc'); bm.uniforms.len.value = 16;
    const cg = new T.ConeGeometry(3.2, 16, 18, 1, true); cg.translate(0, -8, 0); cg.rotateX(-Math.PI / 2);
    const beam = new T.Mesh(cg, bm); beam.position.set(4.6, 1.45, 0); beam.lookAt(new T.Vector3(30, -2, 0)); beam.renderOrder = 5; g.add(beam);
    return { g, drum, drumPivot, hlMat, tlMat, flow, beam, chute };
  }
  function buildTrucks() {
    const zq = BB.z0 - 16;
    const setups = [
      { mode: 'feed', pump: 0 }, { mode: 'feed', pump: 1 },
      { mode: 'queue', x: 2 }, { mode: 'queue', x: 13 }, { mode: 'queue', x: 24 }, { mode: 'queue', x: 35 },
      { mode: 'enter' }, { mode: 'exit' }
    ];
    setups.forEach((s, i) => {
      const t = makeTruck(); Object.assign(t, s, { i, ph: i * 0.37 }); scene.add(t.g); TRUCKS.push(t);
      if (s.mode === 'feed') { const p = PUMPS[s.pump]; t.g.position.set(p.base.x - 5.7 - 0.0, 0, p.base.z + 8.6); t.g.rotation.y = Math.PI / 2; t.flow.visible = true; }
      if (s.mode === 'queue') { t.g.position.set(s.x, 0, zq); t.g.rotation.y = Math.PI; }
    });
    ELEM.trucks = TRUCKS; S.zq = zq;
  }
  function updateTrucks(dt) {
    const show = S.slide >= 7 && S.slide <= 9;
    TRUCKS.forEach(t => {
      t.g.visible = show; if (!show) return;
      t.drum.rotation.x += dt * (t.mode === 'feed' ? -2.4 : 1.1);
      const lights = S.night;
      t.hlMat.emissiveIntensity = 2.2 * lights; t.tlMat.emissiveIntensity = 1.6 * lights;
      t.beam.material.uniforms.inten.value = (t.mode === 'enter' || t.mode === 'exit') ? 0.22 * lights : 0.08 * lights;
      if (t.mode === 'feed') t.flow.visible = S.slide >= 8 && S.slide <= 9;
      if (t.mode === 'enter') { const u = ((S.time * 0.05 + t.ph) % 1); t.g.position.set(lerp(150, 47, u), 0, S.zq); t.g.rotation.y = Math.PI; t.g.visible = u < 0.98; }
      if (t.mode === 'exit') { const u = ((S.time * 0.045 + t.ph) % 1); t.g.position.set(lerp(-20, 150, u), 0, BB.z1 + 18.5); t.g.rotation.y = 0; }
      if (t.mode === 'queue') t.g.position.x = t.x + Math.sin(S.time * 0.3 + t.i) * 0.05;
    });
  }

  /* ------------------------------------------------------------------ */
  /* 16. Batching plant, buildings under construction, site props        */
  /* ------------------------------------------------------------------ */
  function buildPlant() {
    const g = new T.Group(); g.position.set(-24, 0, -58); g.rotation.y = 0; scene.add(g);
    const silo = std('#dde2e6', { roughness: 0.35, metalness: 0.35 }), steel = std('#5d6670', { metalness: 0.6, roughness: 0.4 }), blue = std('#2f5d8a', { roughness: 0.5 });
    [-4, 0, 4].forEach(ox => { addMesh(new T.CylinderGeometry(1.7, 1.7, 11, 18), silo, ox, 10.5, -5, g); addMesh(new T.ConeGeometry(1.7, 2.6, 18), silo, ox, 3.7, -5, g).rotation.x = Math.PI; [-1, 1].forEach(a => [-1, 1].forEach(b => addMesh(new T.BoxGeometry(0.2, 4.6, 0.2), steel, ox + a * 1.2, 2.3, -5 + b * 1.2, g))); });
    addMesh(new T.BoxGeometry(6, 13, 6), blue, 0, 6.5, 3, g);
    addMesh(new T.BoxGeometry(6.2, 0.6, 6.2), std('#e2652b'), 0, 11.5, 3, g);
    const cv = addMesh(new T.BoxGeometry(18, 0.8, 1.2), steel, 10, 6.5, 3, g); cv.rotation.z = -0.62;
    [0, 4, 8].forEach((ox, i) => addMesh(new T.ConeGeometry(2.4, 2.4, 14), std(['#b8a58c', '#8d8579', '#c9b28c'][i]), 15 + ox, 1.2, 9, g));
    ELEM.plantTop = new T.Vector3(); g.updateMatrixWorld(); ELEM.plantTop.set(0, 8, 3).applyMatrix4(g.matrixWorld);
  }
  function buildBuildings() {
    const defs = [[-30, -96, 36, 22, 8, 6, 3], [38, -92, 28, 24, 10, 8, 5], [-108, -18, 24, 40, 6, 5, 2], [112, -40, 30, 26, 5, 4, 2], [-96, 74, 26, 20, 4, 4, 1], [104, 70, 24, 24, 7, 5, 3]];
    const slabs = [], cols = [], panels = [], starters = [], nets = [];
    const FH = 3.3;
    defs.forEach(([x, z, w, d, F, B, I], bi) => {
      const nxc = Math.max(2, Math.round(w / 6)), nzc = Math.max(2, Math.round(d / 6));
      for (let f = 1; f <= B; f++) slabs.push({ p: new T.Vector3(x, f * FH, z), q: QI, s: new T.Vector3(w + 0.6, 0.28, d + 0.6) });
      for (let f = 0; f <= B; f++) for (let i = 0; i <= nxc; i++) for (let j = 0; j <= nzc; j++) {
        const cx = x - w / 2 + i * w / nxc, cz = z - d / 2 + j * d / nzc;
        if (f < B) cols.push({ p: new T.Vector3(cx, f * FH + FH / 2, cz), q: QI, s: new T.Vector3(0.5, FH, 0.5) });
        else for (let k = 0; k < 4; k++) starters.push({ p: new T.Vector3(cx + (k % 2 ? 0.15 : -0.15), f * FH + 0.8, cz + (k < 2 ? 0.15 : -0.15)), q: QI, s: new T.Vector3(0.03, 1.6, 0.03) });
      }
      for (let f = 0; f < I; f++) {
        for (let i = 0; i < nxc; i++) [-1, 1].forEach(sd => panels.push({ p: new T.Vector3(x - w / 2 + (i + 0.5) * w / nxc, f * FH + FH / 2 + 0.14, z + sd * d / 2), q: QI, s: new T.Vector3(w / nxc, FH - 0.28, 0.2) }));
        for (let j = 0; j < nzc; j++) [-1, 1].forEach(sd => panels.push({ p: new T.Vector3(x + sd * w / 2, f * FH + FH / 2 + 0.14, z - d / 2 + (j + 0.5) * d / nzc), q: qY(Math.PI / 2), s: new T.Vector3(d / nzc, FH - 0.28, 0.2) }));
      }
      if (bi % 2 === 0) for (let f = I; f < B; f++) nets.push({ p: new T.Vector3(x, f * FH + FH / 2 + 0.3, z + d / 2 + 1.2), q: QI, s: new T.Vector3(w + 2, FH, 1) });
    });
    const box = new T.BoxGeometry(1, 1, 1);
    const mk = (items, mat, sh) => { const r = new Reveal(box, mat, items.map(i => (i.k = 0, i)), { mode: 'pop', win: 1, noShadow: !sh }); r.set(1); scene.add(r.mesh); return r; };
    mk(slabs, std('#a9a7a1', { roughness: 0.9 }), true); mk(cols, std('#b3b0a9', { roughness: 0.9 }), true);
    MATS.facade = std('#ffffff', { map: TEX.facade, emissiveMap: TEX.facadeLit, emissive: C('#ffd9a0'), emissiveIntensity: 0, roughness: 0.9 });
    mk(panels, MATS.facade, true); mk(starters, MATS.starter, false);
    const netPlane = new T.PlaneGeometry(1, 1);
    const nm = new T.MeshStandardMaterial({ map: TEX.net, transparent: true, side: T.DoubleSide, roughness: 0.9, depthWrite: false });
    const r = new Reveal(netPlane, nm, nets.map(i => (i.k = 0, i)), { mode: 'pop', win: 1, noShadow: true }); r.set(1); scene.add(r.mesh);
    // second tower crane on a neighbouring building
    const g = new T.Group(); g.position.set(38, 0, -78); scene.add(g);
    const lt = TEX.lattice.clone(); lt.needsUpdate = true; lt.wrapS = lt.wrapT = T.RepeatWrapping; lt.repeat.set(1, 20);
    const lm = new T.MeshStandardMaterial({ color: C('#e9b52a'), map: lt, alphaTest: 0.5, side: T.DoubleSide });
    addMesh(new T.BoxGeometry(1.6, 44, 1.6), lm, 0, 22, 0, g);
    const j = addMesh(new T.BoxGeometry(1.1, 1.1, 50), lm, 0, 44.5, 14, g); j.rotation.y = 0.9;
  }
  function buildSiteProps() {
    // fence
    const x0 = -74, x1 = 80, z0 = -66, z1 = 64, posts = [];
    const runs = [[x0, z0, x1, z0], [x1, z0, x1, BB.z1 + 12], [x1, BB.z1 + 25, x1, z1], [x1, z1, x0, z1], [x0, z1, x0, z0]];
    const fm = new T.MeshStandardMaterial({ map: TEX.fence, transparent: true, alphaTest: 0.3, side: T.DoubleSide, roughness: 0.6, metalness: 0.4 });
    runs.forEach(([a, b, c, d]) => {
      const L = Math.hypot(c - a, d - b), pl = new T.PlaneGeometry(L, 2);
      const tx = fm.map.clone(); tx.needsUpdate = true; tx.repeat.set(L / 2.5, 1); tx.wrapS = tx.wrapT = T.RepeatWrapping;
      const m = fm.clone(); m.map = tx;
      const mesh = addMesh(pl, m, (a + c) / 2, 1.05, (b + d) / 2, scene, false, false); mesh.rotation.y = Math.atan2(-(d - b), c - a);
      for (let t = 0; t <= L; t += 3) posts.push({ p: new T.Vector3(a + (c - a) * t / L, 1.1, b + (d - b) * t / L), q: QI, s: new T.Vector3(0.06, 2.2, 0.06), k: 0 });
    });
    const pr = new Reveal(new T.BoxGeometry(1, 1, 1), std('#9aa1a8', { metalness: 0.5 }), posts, { mode: 'pop', win: 1, noShadow: true }); pr.set(1); scene.add(pr.mesh);
    // site office containers + cube lab
    const cont = std('#ffffff', { map: TEX.container, roughness: 0.5 });
    [[-60, 40, 0], [-60, 40, 2.65], [-53.6, 40, 0]].forEach(([x, z, y]) => addMesh(new T.BoxGeometry(6.1, 2.6, 2.45), cont, x, y + 1.3, z));
    const lab = new T.Group(); lab.position.set(-45.5, 0, 40.2); scene.add(lab);
    addMesh(new T.BoxGeometry(3.2, 0.08, 1.1), std('#cfd4d8', { metalness: 0.4 }), 0, 0.92, 0, lab);
    [[-1.5, -0.5], [1.5, -0.5], [-1.5, 0.5], [1.5, 0.5]].forEach(([a, b]) => addMesh(new T.BoxGeometry(0.06, 0.9, 0.06), std('#777'), a, 0.45, b, lab));
    for (let i = 0; i < 6; i++) addMesh(new T.BoxGeometry(0.15, 0.15, 0.15), std('#9d9a94'), -1.2 + i * 0.22, 1.035, -0.25, lab);
    const mach = new T.Group(); mach.position.set(0.9, 0.96, 0.1); lab.add(mach);
    addMesh(new T.BoxGeometry(0.7, 0.1, 0.5), std('#3b6aa0'), 0, 0.05, 0, mach);
    [-0.28, 0.28].forEach(o => addMesh(new T.CylinderGeometry(0.03, 0.03, 1.0, 6), std('#c9ccd0', { metalness: 0.7 }), o, 0.55, 0, mach));
    addMesh(new T.BoxGeometry(0.7, 0.12, 0.5), std('#3b6aa0'), 0, 1.06, 0, mach);
    const platen = addMesh(new T.BoxGeometry(0.34, 0.06, 0.34), std('#555'), 0, 0.5, 0, mach);
    addMesh(new T.BoxGeometry(0.15, 0.15, 0.15), std('#9d9a94'), 0, 0.18, 0, mach);
    ELEM.lab = { g: lab, platen }; ELEM.labPt = new T.Vector3(-45.5, 1.6, 40.2);
    // spoil heaps, rebar yard, timber stack, survey tripod
    [[-64, -24, 8, 2.6], [66, -52, 10, 3.2], [60, 54, 7, 2.2]].forEach(([x, z, r, h], k) => { const hg = new T.SphereGeometry(1, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2); const pp = hg.attributes.position; for (let i = 0; i < pp.count; i++) { const vx = pp.getX(i), vy = pp.getY(i), vz = pp.getZ(i), nn = 0.7 + 0.6 * fbm(vx * 1.6 + k * 7, vz * 1.6, 3); pp.setXYZ(i, vx * nn, vy * (0.75 + 0.5 * nn), vz * nn); } hg.computeVertexNormals(); const m = addMesh(hg, std('#9a836a', { map: TEX.dirt, roughness: 1 }), x, 0, z); m.scale.set(r, h, r * 0.8); });
    const yard = []; for (let i = 0; i < 60; i++) yard.push({ p: new T.Vector3(-64 + (i % 20) * 0.12, 0.3 + ((i / 20) | 0) * 0.1, 30 + ((i / 20) | 0) * 0.04), q: qY(Math.PI / 2), s: new T.Vector3(12, 0.05, 0.05), k: 0 });
    const yr = new Reveal(barGeoX, MATS.starter, yard, { mode: 'pop', win: 1 }); yr.set(1); scene.add(yr.mesh);
    [[-66, 26], [-66, 34]].forEach(([x, z]) => addMesh(new T.BoxGeometry(3.2, 0.2, 0.2), MATS.timber, x - 1, 0.1, z));
    for (let i = 0; i < 6; i++) addMesh(new T.BoxGeometry(2.44, 0.05, 1.22), MATS.ply, 64, 0.08 + i * 0.06, 16);
    const tri = new T.Group(); tri.position.set(-5, Y0, BB.z1 + 4); scene.add(tri);
    [0, 2.1, 4.2].forEach(a => { const l = addMesh(new T.CylinderGeometry(0.02, 0.02, 1.6, 5), std('#d9b13a'), Math.sin(a) * 0.35, 0.75, Math.cos(a) * 0.35, tri); l.rotation.set(Math.cos(a) * 0.25, 0, -Math.sin(a) * 0.25); });
    addMesh(new T.BoxGeometry(0.22, 0.28, 0.18), std('#f2c23c'), 0, 1.65, 0, tri);
    ELEM.tripod = tri;
  }

  /* future (ghost) structure for slide 10 */
  function buildFuture() {
    const g = new T.Group(); scene.add(g); g.visible = false;
    const gm = new T.MeshBasicMaterial({ color: C('#6cc6ff'), transparent: true, opacity: 0.3, depthWrite: false, toneMapped: false });
    const em = new T.LineBasicMaterial({ color: C('#a8e4ff'), transparent: true, opacity: 0.6, toneMapped: false });
    const items = [];
    const H = 4.0, base = Y0 + TH;
    COLS.forEach(c => items.push({ p: new T.Vector3(c.x, base + H / 2, c.z), q: QI, s: new T.Vector3(0.6, H, 0.6), k: 0 }));
    LAYOUT.walls.forEach(([x1, z1, x2, z2]) => { const L = Math.hypot(x2 - x1, z2 - z1); items.push({ p: new T.Vector3((x1 + x2) / 2, base + H / 2, (z1 + z2) / 2), q: qY(Math.atan2(-(z2 - z1), x2 - x1)), s: new T.Vector3(L, H, 0.3), k: 0 }); });
    ZONES.filter(z => !LAYOUT.pits.includes(z)).forEach(r => {
      const w = r.x2 - r.x1, d = r.z2 - r.z1, cx = (r.x1 + r.x2) / 2, cz = (r.z1 + r.z2) / 2;
      items.push({ p: new T.Vector3(cx, base + H / 2, r.z1), q: QI, s: new T.Vector3(w, H, 0.25), k: 0 }, { p: new T.Vector3(cx, base + H / 2, r.z2), q: QI, s: new T.Vector3(w, H, 0.25), k: 0 }, { p: new T.Vector3(r.x1, base + H / 2, cz), q: QI, s: new T.Vector3(0.25, H, d), k: 0 }, { p: new T.Vector3(r.x2, base + H / 2, cz), q: QI, s: new T.Vector3(0.25, H, d), k: 0 });
    });
    const cx0 = (BB.x0 + BB.x1) / 2, cz0 = (BB.z0 + BB.z1) / 2;
    radialKeys(items, cx0, cz0, it => [it.p.x, it.p.z], 0, 1);
    ELEM.future = new Reveal(new T.BoxGeometry(1, 1, 1), gm, items, { mode: 'rise', win: 0.25, noShadow: true });
    ELEM.future.mesh.castShadow = false; ELEM.future.mesh.receiveShadow = false; g.add(ELEM.future.mesh);
    const slab = new T.ShapeGeometry(shapeFrom(OUT)); slab.rotateX(-Math.PI / 2);
    const sm = new T.MeshBasicMaterial({ color: C('#6cc6ff'), transparent: true, opacity: 0, depthWrite: false, toneMapped: false, side: T.DoubleSide });
    const sMesh = new T.Mesh(slab, sm); sMesh.position.y = base + H + 0.05; g.add(sMesh);
    const outline = new T.LineLoop(new T.BufferGeometry().setFromPoints(OUT.map(([x, z]) => new T.Vector3(x, 0, z))), em); outline.position.y = base + H + 0.06; g.add(outline);
    ELEM.futureG = g; ELEM.futureSlab = sm; ELEM.futureLine = em;
  }

  /* focus brackets + ground glow */
  function buildFocusFX() {
    const g = new T.Group(); scene.add(g);
    const mat = new T.MeshBasicMaterial({ color: C('#53dcff'), transparent: true, opacity: 0, depthWrite: false, toneMapped: false, blending: T.AdditiveBlending });
    const bars = [];
    for (let i = 0; i < 8; i++) { const m = new T.Mesh(new T.BoxGeometry(1, 0.05, 1), mat); m.renderOrder = 6; g.add(m); bars.push(m); }
    const glow = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: TEX.glow, color: C('#53dcff'), transparent: true, opacity: 0, depthWrite: false, blending: T.AdditiveBlending, toneMapped: false }));
    glow.rotation.x = -Math.PI / 2; glow.renderOrder = 4; g.add(glow);
    ELEM.focus = { g, mat, bars, glow, zone: { cx: 0, cz: 0, hw: 10, hd: 10, y: 1.2 } };
  }
  function setFocusZone(z) {
    const f = ELEM.focus; Object.assign(f.zone, z);
    const { cx, cz, hw, hd } = f.zone, y = z.y != null ? z.y : Y0 + TH + 0.3;
    const L = Math.max(1.5, Math.min(hw, hd) * 0.32), w = Math.max(0.12, Math.min(hw, hd) * 0.012);
    const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    corners.forEach(([sx, sz], i) => {
      const x = cx + sx * hw, zz = cz + sz * hd;
      const a = f.bars[i * 2], b = f.bars[i * 2 + 1];
      a.scale.set(L, 1, w); a.position.set(x - sx * L / 2, y, zz);
      b.scale.set(w, 1, L); b.position.set(x, y, zz - sz * L / 2);
    });
    f.glow.scale.set(hw * 2.6, hd * 2.6, 1); f.glow.position.set(cx, Y0 + 0.02 + (z.gy || 0), cz);
  }

  /* ------------------------------------------------------------------ */
  /* 17. People: 22 representative workers + 7 engineers                 */
  /* ------------------------------------------------------------------ */
  const PEOPLE = [];
  const PS = 1.12; // slight upscale for legibility from the aerial view
  const toolGeo = {};
  function buildPeople() {
    const skin = std('#b98563', { roughness: 0.7 }), stripe = new T.MeshStandardMaterial({ color: C('#e8eef2'), emissive: C('#c9d6de'), emissiveIntensity: 0.0, roughness: 0.3, metalness: 0.2 });
    MATS.stripe = stripe;
    const kinds = {
      worker: { vest: std('#ff6a13', { roughness: 0.6 }), shirt: std('#294667'), pants: std('#2a2e35'), helmet: std('#ffcc00', { roughness: 0.35 }) },
      engineer: { vest: std('#c9f23a', { roughness: 0.6 }), shirt: std('#e3e9ef'), pants: std('#3a4150'), helmet: std('#f7f7f4', { roughness: 0.3 }) }
    };
    const g = {
      leg: new T.BoxGeometry(0.15, 0.88, 0.17).translate(0, -0.44, 0),
      vest: new T.BoxGeometry(0.44, 0.6, 0.27).translate(0, 0.32, 0),
      stripe: new T.BoxGeometry(0.455, 0.05, 0.285),
      arm: new T.BoxGeometry(0.11, 0.62, 0.12).translate(0, -0.3, 0),
      head: new T.SphereGeometry(0.12, 12, 10),
      helmet: new T.SphereGeometry(0.16, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      brim: new T.CylinderGeometry(0.19, 0.19, 0.025, 14)
    };
    toolGeo.tablet = new T.BoxGeometry(0.28, 0.02, 0.2);
    toolGeo.hammer = mergeGeos([{ geo: new T.BoxGeometry(0.03, 0.34, 0.03), m: M4(0, -0.12, 0) }, { geo: new T.BoxGeometry(0.06, 0.06, 0.16), m: M4(0, -0.28, 0.04) }]);
    toolGeo.poker = new T.CylinderGeometry(0.025, 0.025, 1.5, 6).translate(0, -0.75, 0);
    toolGeo.bar = new T.CylinderGeometry(0.03, 0.03, 5, 6).rotateX(Math.PI / 2);
    toolGeo.board = new T.BoxGeometry(0.03, 0.22, 2.4);
    toolGeo.level = new T.BoxGeometry(0.05, 0.05, 1.0);
    toolGeo.wand = new T.CylinderGeometry(0.015, 0.015, 1.1, 5).rotateX(Math.PI / 2).translate(0, 0, 0.5);
    toolGeo.chair = mergeGeos([{ geo: new T.BoxGeometry(0.03, 0.5, 0.03), m: M4(-0.18, 0, 0) }, { geo: new T.BoxGeometry(0.03, 0.5, 0.03), m: M4(0.18, 0, 0) }, { geo: new T.BoxGeometry(0.4, 0.03, 0.03), m: M4(0, 0.25, 0) }]);
    const tmat = { tablet: new T.MeshStandardMaterial({ color: C('#222a35'), emissive: C('#5fc8ff'), emissiveIntensity: 0.6 }), hammer: std('#5a3d22'), poker: std('#3a3d42', { metalness: 0.5 }), bar: MATS.starter, board: MATS.timber, level: std('#f2c41a'), wand: std('#2d3138'), chair: MATS.chair };
    const r = rng(42);
    for (let i = 0; i < 29; i++) {
      const kind = i < 22 ? 'worker' : 'engineer', k = kinds[kind];
      const root = new T.Group(); root.scale.setScalar(PS * (0.95 + r() * 0.08)); scene.add(root);
      const hips = new T.Group(); hips.position.y = 0.92; root.add(hips);
      const mk = (geo, mat, x, y, z, par) => { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = false; par.add(m); return m; };
      const legL = new T.Group(), legR = new T.Group(); legL.position.set(-0.1, 0, 0); legR.position.set(0.1, 0, 0); hips.add(legL, legR);
      mk(g.leg, k.pants, 0, 0, 0, legL); mk(g.leg, k.pants, 0, 0, 0, legR);
      const torso = new T.Group(); hips.add(torso);
      mk(g.vest, k.vest, 0, 0, 0, torso); mk(g.stripe, stripe, 0, 0.2, 0, torso); mk(g.stripe, stripe, 0, 0.44, 0, torso);
      const head = new T.Group(); head.position.y = 0.74; torso.add(head);
      mk(g.head, skin, 0, 0.05, 0, head); mk(g.helmet, k.helmet, 0, 0.1, 0, head); mk(g.brim, k.helmet, 0, 0.1, 0.02, head);
      const armL = new T.Group(), armR = new T.Group(); armL.position.set(-0.28, 0.56, 0); armR.position.set(0.28, 0.56, 0); torso.add(armL, armR);
      mk(g.arm, k.shirt, 0, 0, 0, armL); mk(g.arm, k.shirt, 0, 0, 0, armR);
      const handL = new T.Group(), handR = new T.Group(); handL.position.y = -0.62; handR.position.y = -0.62; armL.add(handL); armR.add(handR);
      const tools = {};
      const addTool = (name, par, x, y, z, rx, ry, rz) => { const m = new T.Mesh(toolGeo[name], tmat[name]); m.position.set(x, y, z); m.rotation.set(rx || 0, ry || 0, rz || 0); m.visible = false; m.castShadow = true; par.add(m); tools[name] = m; };
      addTool('tablet', handL, 0.05, 0, 0.1, 0.3, 0, 0);
      addTool('hammer', handR, 0, 0, 0, 0, 0, 0);
      addTool('poker', handR, 0, 0, 0.05, 0, 0, 0);
      addTool('bar', torso, 0.22, 0.66, 0.4, 0, 0.08, 0);
      addTool('board', torso, 0.2, 0.62, 0.3, 0, 0, 0);
      addTool('level', handR, 0, 0, 0.3, 0, 0, 0);
      addTool('wand', handR, 0, 0, 0, 0, 0, 0);
      addTool('chair', handR, 0, -0.05, 0.12, 0, 0, 0);
      PEOPLE.push({ i, kind, root, hips, torso, head, armL, armR, legL, legR, tools, pos: new T.Vector3(BB.x0 - 20 + i, 0, BB.z1 + 20), tgt: new T.Vector3(), yaw: 0, face: 0, task: 'idle', ph: r() * 10, moving: false, anchor: null, look: null });
    }
    // a power float (finishing machine) pool
    ELEM.floats = [];
    for (let i = 0; i < 4; i++) {
      const fg = new T.Group(); scene.add(fg); fg.visible = false;
      addMesh(new T.CylinderGeometry(0.5, 0.5, 0.05, 20), std('#6b7178', { metalness: 0.6, roughness: 0.35 }), 0, 0.05, 0, fg);
      const blades = new T.Group(); fg.add(blades);
      for (let b = 0; b < 4; b++) { const bl = addMesh(new T.BoxGeometry(0.9, 0.02, 0.12), std('#9aa1a8', { metalness: 0.7 }), 0, 0.02, 0, blades); bl.rotation.y = b * Math.PI / 4; }
      addMesh(new T.BoxGeometry(0.28, 0.25, 0.28), std('#e2652b'), 0, 0.22, 0, fg);
      const h = addMesh(new T.CylinderGeometry(0.02, 0.02, 1.4, 5), std('#333'), 0, 0.65, -0.55, fg); h.rotation.x = -0.8;
      ELEM.floats.push({ g: fg, blades });
    }
    // vibrator ripples + hammer flashes pools
    ELEM.ripples = []; for (let i = 0; i < 12; i++) { const m = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: TEX.ring, transparent: true, depthWrite: false, opacity: 0, color: C('#d9e2e8'), toneMapped: false })); m.rotation.x = -Math.PI / 2; m.visible = false; scene.add(m); ELEM.ripples.push({ m, t: 1 }); }
    ELEM.flashes = []; for (let i = 0; i < 8; i++) { const s = new T.Sprite(new T.SpriteMaterial({ map: TEX.glow, color: C('#fff3c4'), blending: T.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 })); s.scale.set(0.5, 0.5, 1); s.visible = false; scene.add(s); ELEM.flashes.push({ s, t: 1 }); }
    ELEM.mist = new T.Points(new T.BufferGeometry().setAttribute('position', new T.Float32BufferAttribute(new Float32Array(120 * 3), 3)), new T.PointsMaterial({ color: C('#d8ecff'), size: 0.07, transparent: true, opacity: 0.6, depthWrite: false }));
    ELEM.mist.visible = false; ELEM.mist.frustumCulled = false; scene.add(ELEM.mist);
  }
  let rippleIdx = 0, flashIdx = 0;
  function spawnRipple(x, y, z, size) { const r = ELEM.ripples[rippleIdx++ % ELEM.ripples.length]; r.m.position.set(x, y + 0.02, z); r.t = 0; r.size = size || 1.4; r.m.visible = true; }
  function spawnFlash(v) { const f = ELEM.flashes[flashIdx++ % ELEM.flashes.length]; f.s.position.copy(v); f.t = 0; f.s.visible = true; }

  function standY(x, z) {
    const n = S.slide;
    if (!inPoly(x, z)) {
      if (S.scaffold && ELEM.scaffold.visible && x > S.scaffold.x0 - 0.5 && x < S.scaffold.x1 + 0.5 && Math.abs(z - S.scaffold.z) < 0.6) return S.scaffold.deck + 0.03;
      return 0;
    }
    if (n <= 1) return Y0;
    if (n <= 3) return yB2 + RB;
    if (n <= 7) return yT2 + RB;
    if (n <= 9) { const h = concreteH(x, z); return h > 0.05 ? Y0 + h * TH - 0.04 : yT2 + RB; }
    return Y0 + TH;
  }

  /* task assignment per slide */
  function zoneRand(seed) { const r = rng(seed); return (cx, cz, hw, hd, m) => { for (let k = 0; k < 40; k++) { const x = cx + (r() * 2 - 1) * hw, z = cz + (r() * 2 - 1) * hd; if (inside(x, z, m == null ? 1 : m) && !inOpening(x, z, 0.6)) return [x, z]; } return [cx, cz]; }; }
  function assignTasks(n) {
    const W = PEOPLE.filter(p => p.kind === 'worker'), E = PEOPLE.filter(p => p.kind === 'engineer');
    const R = zoneRand(100 + n), r = rng(500 + n);
    const set = (p, task, x, z, opt) => { p.task = task; p.tgt.set(x, 0, z); p.anchor = (opt && opt.anchor) || null; p.look = (opt && opt.look) || null; p.face = opt && opt.face != null ? opt.face : r() * Math.PI * 2; p.path = (opt && opt.path) || null; p.off = (opt && opt.off) || 0; };
    const lookAtFace = (x, z, lx, lz) => Math.atan2(lx - x, lz - z);
    let wi = 0, ei = 0;
    const w = () => W[wi++ % W.length], e = () => E[ei++ % E.length];
    if (n === 1) {
      LAYOUT.gridX.slice(0, 10).forEach((gx, i) => { if (i % 1 === 0 && wi < 12) { const z = i % 2 ? BB.z0 + 3 : BB.z1 - 3; set(w(), 'bend', gx, z); } });
      while (wi < W.length) { const [x, z] = R(0, 0, 36, 26); set(w(), wi % 3 ? 'walk' : 'bend', x, z); }
      set(e(), 'inspect', -5.8, BB.z1 + 4.6, { face: Math.PI }); set(e(), 'point', -4.2, BB.z1 + 5, { face: Math.PI * 0.9 });
      LAYOUT.stairs.concat(LAYOUT.shafts).forEach(rz => { if (ei < 6) set(e(), 'inspect', rz.x2 + 1, (rz.z1 + rz.z2) / 2, { face: -Math.PI / 2 }); });
      while (ei < E.length) { const [x, z] = R(0, 0, 30, 20); set(e(), 'inspect', x, z); }
    } else if (n === 2) {
      for (let k = 0; k < 13; k++) { const [x, z] = R(-24, 9, 9, 7); const carry = k % 3 === 0; set(w(), carry ? 'carry' : 'bend', x, z, { face: carry ? Math.PI / 2 : (k % 2 ? 0 : Math.PI / 2) }); }
      while (wi < W.length) { const [x, z] = R(-4, 0, 30, 24); set(w(), 'bend', x, z); }
      set(e(), 'walkgrid', -27, 7, { path: { x0: -30, x1: -18, z: 6.5 } }); set(e(), 'walkgrid', -21, 11, { path: { x0: -28, x1: -17, z: 11.5 } });
      set(e(), 'point', -16, 14, { face: -Math.PI / 2 });
      while (ei < E.length) { const [x, z] = R(5, -5, 25, 18); set(e(), 'inspect', x, z); }
    } else if (n === 3) {
      for (let k = 0; k < 13; k++) { const [x, z] = R(-8, 12, 7.5, 6.5); set(w(), k % 3 === 0 ? 'carrychair' : 'bend', x, z); }
      while (wi < W.length) { const [x, z] = R(-20, 0, 18, 20); set(w(), 'bend', x, z); }
      set(e(), 'measure', -9, 10.5, { face: Math.PI / 2 }); set(e(), 'measure', -6.5, 10.5, { face: -Math.PI / 2 }); set(e(), 'inspect', -4, 15, { face: Math.PI });
      while (ei < E.length) { const [x, z] = R(10, 0, 25, 20); set(e(), 'inspect', x, z); }
    } else if (n === 4) {
      for (let k = 0; k < 14; k++) { const [x, z] = R(-6, 6, 12, 9); set(w(), k % 3 === 0 ? 'carry' : 'bend', x, z, { face: k % 2 ? 0 : Math.PI / 2 }); }
      set(w(), 'guide', -9, 3.5, { face: 0.5 }); set(w(), 'guide', -6.5, 5, { face: -2.2 });
      while (wi < W.length) { const [x, z] = R(-24, 0, 14, 22); set(w(), 'bend', x, z); }
      set(e(), 'inspect', -2, 12, { face: Math.PI }); set(e(), 'point', -12, 10, { face: 0.8 }); set(e(), 'inspect', 3, 2, { face: -1.2 });
      while (ei < E.length) { const [x, z] = R(15, 0, 20, 20); set(e(), 'inspect', x, z); }
    } else if (n === 5) {
      const cs = COLS.filter(c => Math.abs(c.x - 28) < 11 && Math.abs(c.z - 10) < 11);
      cs.slice(0, 6).forEach((c, k) => set(w(), 'lift', c.x + 0.7, c.z + 0.5, { face: lookAtFace(c.x + 0.7, c.z + 0.5, c.x, c.z) }));
      for (let k = 0; k < 4; k++) set(w(), k % 2 ? 'lift' : 'bend', 38.4, 2 + k * 4, { face: Math.PI / 2 });
      const st = LAYOUT.stairs[1]; set(w(), 'lift', (st.x1 + st.x2) / 2, st.z1 - 0.4, { face: 0 }); set(w(), 'bend', st.x1 + 1, st.z1 - 0.6, { face: 0 });
      while (wi < W.length) { const [x, z] = R(0, 0, 34, 24); set(w(), 'bend', x, z); }
      set(e(), 'inspect', 26, 13.5, { face: Math.PI }); set(e(), 'point', 31, 6.5, { face: Math.PI / 2 }); set(e(), 'inspect', 35.5, 15, { face: Math.PI / 2 }); set(e(), 'inspect', 3.5, -3, { face: -Math.PI / 2 });
      while (ei < E.length) { const [x, z] = R(-10, 0, 25, 20); set(e(), 'inspect', x, z); }
    } else if (n === 6) {
      const zf = BB.z1 + 0.62;
      [-24.5, -22, -18.6, -16.2].forEach(x => set(w(), 'hammer', x, zf + 0.5, { face: Math.PI }));
      set(w(), 'carryboard', -27, zf + 2.8, { face: Math.PI / 2 }); set(w(), 'carryboard', -13, zf + 3.2, { face: -Math.PI / 2 });
      set(w(), 'bend', -20.4, zf + 1.6, { face: Math.PI }); set(w(), 'bend', -14.6, zf + 1.7, { face: Math.PI });
      const edgesPts = [[BB.x0 - 0.75, -10, Math.PI / 2], [BB.x0 - 0.75, 6, Math.PI / 2], [BB.x1 + 0.75, 10, -Math.PI / 2], [BB.x1 + 0.75, 22, -Math.PI / 2], [0, BB.z0 - 0.75, 0], [-26, BB.z0 - 0.75, 0], [6, zf + 0.5, Math.PI], [10, zf + 0.5, Math.PI]];
      edgesPts.forEach(([x, z, f]) => { if (wi < W.length) set(w(), 'hammer', x, z, { face: f }); });
      while (wi < W.length) { const [x, z] = R(0, -5, 30, 20); set(w(), 'bend', x, z); }
      set(e(), 'level', -20.6, zf + 0.85, { face: Math.PI }); set(e(), 'inspect', -17.4, zf + 2.6, { face: Math.PI * 0.95 });
      set(e(), 'inspect', BB.x0 - 3, 0, { face: Math.PI / 2 }); set(e(), 'inspect', BB.x1 + 3, 15, { face: -Math.PI / 2 });
      while (ei < E.length) { const [x, z] = R(0, 0, 25, 20); set(e(), 'inspect', x, z); }
    } else if (n === 7) {
      const cx = -14, cz = -4;
      for (let k = 0; k < W.length; k++) { const a = Math.PI * (0.15 + 0.7 * (k / (W.length - 1))), rr = 3.6 + (k % 3) * 1.1; const x = cx + Math.cos(a) * rr * 1.5, z = cz + 1.2 + Math.sin(a) * rr * 0.55; set(w(), 'listen', x, z, { face: lookAtFace(x, z, cx, cz) }); }
      for (let k = 0; k < E.length; k++) { const x = cx - 4.2 + k * 1.4, z = cz - 0.6; set(e(), k === 3 ? 'talk' : 'listen', x, z, { face: 0 }); }
    } else if (n === 8 || n === 9) {
      const fr = n === 8;
      const vibZ = fr ? [6, 9.5, 13, 16.5, 20, 23.5] : [8, 13, 18, 23];
      vibZ.forEach((z, k) => set(w(), 'vibrate', 0, z, { anchor: 'front', off: -1.3 - (k % 2) * 0.8 }));
      PUMPS.forEach((p, k) => { if (wi < W.length && k < 3) set(w(), 'hose', p.base.x, p.base.z, { anchor: 'pump' + k }); });
      if (fr) { set(w(), 'hose', -20, S.scaffold.z, { anchor: 'scaffold', off: 0 }); set(w(), 'guide', -18, S.scaffold.z, { anchor: 'scaffold', off: 2.4 }); }
      if (fr) { set(w(), 'rake', 0, 10, { anchor: 'front', off: -3.2 }); set(w(), 'rake', 0, 18, { anchor: 'front', off: -3.5 }); set(w(), 'guide', PUMPS[0].base.x - 5.5, PUMPS[0].base.z + 3.4, { face: Math.PI }); set(w(), 'guide', PUMPS[1].base.x - 4, PUMPS[1].base.z + 3.6, { face: Math.PI }); }
      else {
        for (let k = 0; k < 4; k++) set(w(), 'trowel', 4 + k * 4.5, 2 + (k % 2) * 8, { path: { cx: 4 + k * 4.5, cz: 2 + (k % 2) * 8, r: 1.8 + (k % 2) * 0.6 }, off: k });
        set(w(), 'spray', 0, 0, { anchor: 'cure', off: 1.2 }); set(w(), 'spray', 0, 12, { anchor: 'cure', off: 1.2 });
        set(w(), 'bend', 0, -8, { anchor: 'cure', off: 0.6 }); set(w(), 'bend', 0, 20, { anchor: 'cure', off: 0.6 });
        set(w(), 'rake', 0, 6, { anchor: 'front', off: -3.0 });
      }
      while (wi < W.length) { const [x, z] = R(fr ? -34 : -10, 0, 8, 24); set(w(), fr ? 'bend' : 'walk', x, z); }
      if (fr) {
        set(e(), 'sample', PUMPS[0].base.x - 7.6, PUMPS[0].base.z + 4.2, { face: -Math.PI / 2 }); set(e(), 'inspect', PUMPS[0].base.x - 8.4, PUMPS[0].base.z + 5.6, { face: -Math.PI / 2 });
        set(e(), 'radio', PUMPS[1].base.x - 2, PUMPS[1].base.z + 4.4, { face: Math.PI });
        set(e(), 'inspect', 0, 4, { anchor: 'front', off: -6 }); set(e(), 'point', 0, 15, { anchor: 'front', off: -6.5 }); set(e(), 'inspect', 0, 24, { anchor: 'front', off: -7 });
        set(e(), 'inspect', -30, S.scaffold.z, { face: Math.PI });
      } else {
        set(e(), 'probe', 8, 4, { face: 0.4 }); set(e(), 'probe', 14, 14, { face: 2.0 }); set(e(), 'inspect', 0, 7, { anchor: 'front', off: -5 });
        set(e(), 'radio', 20, -6, { face: 1 }); set(e(), 'inspect', -6, 16, { face: 0.7 }); set(e(), 'inspect', 10, 22, { face: -2.6 }); set(e(), 'point', 2, -4, { face: 1.2 });
      }
    } else if (n === 10) {
      [[-25, BB.z1 + 2], [-10, BB.z1 + 2.5], [8, BB.z1 + 2.2], [BB.x1 + 2.4, 14], [BB.x1 + 2.5, 0], [BB.x0 - 2.5, 4]].forEach(([x, z], k) => set(w(), 'carryboard', x, z, { face: k < 3 ? Math.PI / 2 : 0 }));
      [[-18, BB.z1 + 1.4], [-4, BB.z1 + 1.4], [BB.x1 + 1.4, 6], [BB.x0 - 1.4, -6]].forEach(([x, z]) => set(w(), 'bend', x, z, { face: lookAtFace(x, z, 0, 0) }));
      set(w(), 'carry', ELEM.labPt.x - 2.2, ELEM.labPt.z + 1.6, { face: 0.6 });
      while (wi < W.length) { const [x, z] = R(0, 0, 32, 24); set(w(), 'walk', x, z); }
      set(e(), 'inspect', ELEM.labPt.x + 0.6, ELEM.labPt.z + 1.1, { face: Math.PI }); set(e(), 'point', ELEM.labPt.x - 1.0, ELEM.labPt.z + 1.2, { face: Math.PI });
      set(e(), 'inspect', 24, 9, { face: 0 }); set(e(), 'inspect', -12, -6, { face: 0.4 }); set(e(), 'point', 2, 6, { face: -0.8 });
      set(e(), 'inspect', -30, 20, { face: 1.6 }); set(e(), 'inspect', 30, -8, { face: -2 });
    }
  }
  function snapPeople() { PEOPLE.forEach(p => { resolveAnchor(p); p.pos.copy(p.tgt).add(new T.Vector3((Math.random() - 0.5) * 1.6, 0, (Math.random() - 0.5) * 1.6)); p.yaw = p.face; }); }
  function resolveAnchor(p) {
    if (!p.anchor) return;
    if (p.anchor === 'front') { const z = p.tgt.z; p.tgt.x = frontAt(z) + p.off; }
    else if (p.anchor === 'cure') { p.tgt.x = S.curingX + p.off; }
    else if (p.anchor === 'scaffold') { p.tgt.x = clamp(frontAt(BB.z1 - 3) - 1 + p.off, S.scaffold.x0 + 0.5, S.scaffold.x1 - 0.5); p.tgt.z = S.scaffold.z; }
    else if (p.anchor.indexOf('pump') === 0) { const pm = PUMPS[+p.anchor.slice(4)]; if (pm && pm.active) { p.tgt.set(pm.tgt.x, 0, pm.tgt.z); } else if (pm) { const [x, z] = [pm.base.x, pm.base.z + (pm.base.z > 0 ? -5 : 5)]; p.tgt.set(x, 0, z); } }
  }

  const _w = new T.Vector3();
  function updatePeople(dt) {
    PEOPLE.forEach((p, idx) => {
      resolveAnchor(p);
      if (p.path) {
        if (p.task === 'walkgrid') { const { x0, x1, z } = p.path; const u = (Math.sin(S.time * 0.18 + idx) + 1) / 2; p.tgt.set(lerp(x0, x1, u), 0, z); }
        if (p.task === 'trowel') { const { cx, cz, r } = p.path, a = S.time * 0.35 + p.off * 1.7; p.tgt.set(cx + Math.cos(a) * r, 0, cz + Math.sin(a * 2) * r * 0.6); }
      }
      const dx = p.tgt.x - p.pos.x, dz = p.tgt.z - p.pos.z, d = Math.hypot(dx, dz);
      const slowTask = p.task === 'walkgrid' || p.task === 'trowel' || p.task === 'spray' || p.anchor;
      const sp = p.task === 'walk' ? 1.1 : (slowTask ? 1.4 : 2.2);
      p.moving = d > (slowTask ? 0.05 : 0.18);
      if (p.moving) {
        const st = Math.min(d, sp * dt); p.pos.x += dx / d * st; p.pos.z += dz / d * st;
        const wy = Math.atan2(dx, dz);
        if (!(slowTask && d < 0.5 && p.task !== 'walkgrid' && p.task !== 'trowel')) p.yaw = angLerp(p.yaw, wy, Math.min(1, dt * 6));
        p.ph += dt * sp * 4.2;
      } else {
        p.yaw = angLerp(p.yaw, p.face, Math.min(1, dt * 3));
        if (p.task === 'walk' && Math.random() < dt * 0.25) { const [x, z] = zoneRand((S.time * 1000 | 0) + idx)(p.pos.x, p.pos.z, 6, 6, 0.5); p.tgt.set(x, 0, z); }
        p.ph += dt * 5;
      }
      p.root.position.set(p.pos.x, standY(p.pos.x, p.pos.z), p.pos.z);
      p.root.rotation.y = p.yaw;
      pose(p, dt);
      p.root.visible = S.slide > 0;
    });
    MATS.stripe.emissiveIntensity = 0.35 * S.night;
  }
  function angLerp(a, b, t) { let d = ((b - a + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI; return a + d * t; }
  function pose(p, dt) {
    const t = p.ph, tools = p.tools;
    let legL = 0, legR = 0, armLx = 0, armRx = 0, armLz = 0.07, armRz = -0.07, torso = 0, hipY = 0.92, headX = 0, headY = 0;
    for (const k in tools) tools[k].visible = false;
    const task = p.task;
    if (p.moving && !(task === 'trowel' || task === 'spray' || task === 'hose' || task === 'vibrate')) {
      const s = Math.sin(t); legL = 0.55 * s; legR = -0.55 * s; armLx = -0.45 * s; armRx = 0.45 * s;
      if (task === 'carry') { tools.bar.visible = true; armRx = -2.7; armRz = 0.3; }
      if (task === 'carrychair') { tools.chair.visible = true; armRx = -0.9; armLx = -0.9; }
      if (task === 'carryboard') { tools.board.visible = true; armRx = -2.6; }
      if (task === 'walkgrid' && p.kind === 'engineer') { tools.tablet.visible = true; armLx = -1.1; armLz = 0.25; }
    } else {
      const s = Math.sin(t);
      switch (task) {
        case 'bend': torso = 1.05; hipY = 0.84; armLx = -0.55 + 0.15 * Math.sin(t * 1.7); armRx = -0.55 - 0.15 * Math.sin(t * 1.7); armLz = 0.25; armRz = -0.25; headX = -0.4; break;
        case 'carry': tools.bar.visible = true; armRx = -2.7; armRz = 0.3; break;
        case 'carrychair': torso = 0.9; hipY = 0.86; tools.chair.visible = true; armRx = -0.5 + 0.2 * s; armLx = -0.5; break;
        case 'carryboard': tools.board.visible = true; armRx = -2.6; break;
        case 'hammer': {
          torso = 0.25; tools.hammer.visible = true; armLx = -0.9; armLz = 0.2;
          const c = (t * 0.55) % 1; armRx = c < 0.65 ? lerp(-0.4, -2.6, smooth(c / 0.65)) : lerp(-2.6, -0.4, smooth((c - 0.65) / 0.35));
          if (p.lastC !== undefined && p.lastC < 0.98 && c < p.lastC && camera.position.distanceTo(p.pos) < 45) { tools.hammer.getWorldPosition(_w); _w.y -= 0.2; spawnFlash(_w); }
          p.lastC = c; break;
        }
        case 'inspect': if (p.kind === 'engineer') { tools.tablet.visible = true; armLx = -1.1; armLz = 0.25; } headX = 0.25 + 0.1 * Math.sin(t * 0.3); headY = 0.5 * Math.sin(t * 0.21); if (Math.sin(t * 0.17) > 0.85) { armRx = -1.5; } break;
        case 'measure': torso = 0.85; hipY = 0.85; tools.tablet.visible = false; armLx = -0.9; armRx = -0.9; headX = -0.3; break;
        case 'point': tools.tablet.visible = p.kind === 'engineer'; armLx = -1.0; armRx = -1.55 + 0.08 * s; armRz = -0.15; headY = 0.1 * s; break;
        case 'level': torso = 0.45; tools.level.visible = true; armRx = -1.3; armLx = -1.25; armLz = -0.15; headX = -0.25; break;
        case 'lift': { const c = (t * 0.25) % 1; tools.bar.visible = true; tools.bar.rotation.x = Math.PI / 2; tools.bar.position.set(0.2, 0.6 - c * 0.5, 0.3); armRx = -2.9 + c * 0.6; armLx = -2.9 + c * 0.6; break; }
        case 'guide': armRx = -2.2 + 0.3 * s; armLx = -2.0 - 0.3 * s; headX = 0.5; break;
        case 'listen': headX = 0.05 * Math.sin(t * 0.4); break;
        case 'talk': armRx = -1.0 - 0.4 * Math.sin(t * 1.3); armLx = -0.8 + 0.3 * Math.sin(t * 1.1); armRz = -0.3; armLz = 0.3; headY = 0.3 * Math.sin(t * 0.4); break;
        case 'vibrate': {
          torso = 0.4; hipY = 0.88; tools.poker.visible = true; armRx = -0.55; armLx = -0.55; armLz = -0.25; armRz = 0.2;
          if (Math.random() < dt * 1.6) { tools.poker.getWorldPosition(_w); const fx = p.pos.x + Math.sin(p.yaw) * 0.7, fz = p.pos.z + Math.cos(p.yaw) * 0.7; spawnRipple(fx, standY(fx, fz) + 0.04, fz, 1.6); }
          break;
        }
        case 'hose': torso = 0.2; armRx = -1.15 + 0.08 * s; armLx = -1.15 - 0.08 * s; armLz = -0.2; armRz = 0.2; break;
        case 'rake': torso = 0.55; hipY = 0.88; tools.level.visible = true; tools.level.position.set(0, -0.2, 0.6); armRx = -0.9 + 0.35 * Math.sin(t * 1.2); armLx = -0.9 + 0.35 * Math.sin(t * 1.2); break;
        case 'trowel': torso = 0.35; armRx = -0.95; armLx = -0.95; armLz = -0.15; armRz = 0.15; legL = 0.25 * s; legR = -0.25 * s; break;
        case 'spray': torso = 0.15; tools.wand.visible = true; armRx = -1.0; armLx = -0.7; legL = 0.3 * s; legR = -0.3 * s; break;
        case 'sample': torso = 0.95; hipY = 0.84; armRx = -0.5; armLx = -0.5; headX = -0.3; break;
        case 'probe': torso = 0.9; hipY = 0.85; tools.tablet.visible = true; armLx = -0.4; armRx = -0.7; break;
        case 'radio': armRx = -2.4; armRz = 0.55; tools.tablet.visible = true; armLx = -1.0; armLz = 0.25; headY = 0.2 * Math.sin(t * 0.3); break;
        case 'walkgrid': if (p.kind === 'engineer') { tools.tablet.visible = true; armLx = -1.1; armLz = 0.25; } break;
        default: break;
      }
      if (task !== 'lift') { tools.bar.rotation.x = 0; tools.bar.position.set(0.22, 0.66, 0.4); }
    }
    p.legL.rotation.x = legL; p.legR.rotation.x = legR; p.torso.rotation.x = torso; p.hips.position.y = hipY;
    p.armL.rotation.set(armLx, 0, armLz); p.armR.rotation.set(armRx, 0, armRz); p.head.rotation.set(headX - torso * 0.5, headY, 0);
  }

  /* ------------------------------------------------------------------ */
  /* 18. Slides: camera views, zones, callout anchors                    */
  /* ------------------------------------------------------------------ */
  const MASTER = { t: [0, 0, 4], d: 196, az: 34, el: 41 };
  const VIEWS = {
    1: { t: [0, 0.5, 2], d: 150, az: 28, el: 43 },
    2: { t: [-24, 0.3, 9], d: 31, az: 38, el: 39 },
    3: { t: [-8, 0.6, 12], d: 26, az: 24, el: 40 },
    4: { t: [-6, 1.0, 6], d: 46, az: 42, el: 41 },
    5: { t: [28, 1.6, 10], d: 32, az: 48, el: 38 },
    6: { t: [-20, 0.7, BB.z1 + 0.6], d: 19, az: 30, el: 36 },
    7: { t: [-8, 1.5, 2], d: 138, az: 33, el: 42 },
    8: { t: [-18, 1, 19], d: 50, az: 36, el: 39, follow: true },
    9: { t: [10, 1, 7], d: 40, az: 34, el: 40 },
    10: { t: [-6, 2, 14], d: 120, az: 30, el: 41 }
  };
  const ZONE = {
    1: { cx: (BB.x0 + BB.x1) / 2, cz: (BB.z0 + BB.z1) / 2, hw: (BB.x1 - BB.x0) / 2 + 1, hd: (BB.z1 - BB.z0) / 2 + 1 },
    2: { cx: -24, cz: 9, hw: 10, hd: 7.5 }, 3: { cx: -8, cz: 12, hw: 8, hd: 6.5 }, 4: { cx: -6, cz: 6, hw: 14, hd: 10 },
    5: { cx: 29, cz: 10, hw: 10, hd: 10 }, 6: { cx: -20, cz: BB.z1 + 0.4, hw: 6.5, hd: 2.2, y: Y0 + TH + 0.25 },
    7: { cx: -2, cz: 6, hw: 50, hd: 42, y: 0.4 }, 8: { cx: -20, cz: 13, hw: 9, hd: 14 }, 9: { cx: 10, cz: 6, hw: 15, hd: 13 },
    10: { cx: -4, cz: 8, hw: 50, hd: 38, y: 0.4 }
  };
  const V = (x, y, z) => new T.Vector3(x, y, z);
  const colNear = (x, z) => COLS.reduce((b, c) => (Math.hypot(c.x - x, c.z - z) < Math.hypot(b.x - x, b.z - z) ? c : b), COLS[0]);
  function personHead(kind, nth) { return () => { const list = PEOPLE.filter(p => p.kind === kind); const p = list[nth % list.length]; return p ? V(p.root.position.x, p.root.position.y + 2.1, p.root.position.z) : null; }; }
  function personTask(task, nth) { return () => { const list = PEOPLE.filter(p => p.task === task); const p = list[(nth || 0) % Math.max(1, list.length)]; return p ? V(p.root.position.x, p.root.position.y + 2.0, p.root.position.z) : null; }; }
  const CALLOUTS = {
    1: [
      { id: 'border', label: 'R.C RAFT BORDER', sub: 'red line · 4,500 m²', at: () => V(-18, Y0 + TH, BB.z1) },
      { id: 'col', label: 'COLUMN (TYP.)', sub: 'yellow squares', at: () => { const c = colNear(-12, -6.5); return V(c.x, Y0 + TH, c.z); } },
      { id: 'wall', label: 'RETAINING WALL', sub: 'magenta double line', at: () => V(BB.x0 + 0.45, Y0 + TH, -12) },
      { id: 'stair', label: 'STAIR STARTER', sub: 'green', at: () => { const s = LAYOUT.stairs[1]; return V((s.x1 + s.x2) / 2, Y0 + TH, (s.z1 + s.z2) / 2); } },
      { id: 'pit', label: 'LIFT PIT', sub: 'hatched', at: () => { const s = LAYOUT.pits[0]; return V((s.x1 + s.x2) / 2, Y0 + TH, (s.z1 + s.z2) / 2); } },
      { id: 'sump', label: 'SUMP PIT', sub: 'hatched', at: () => { const s = LAYOUT.pits[1]; return V((s.x1 + s.x2) / 2, Y0 + TH, (s.z1 + s.z2) / 2); } }
    ],
    2: [
      { id: 'bm', label: 'BOTTOM MESH', sub: 'bars both ways, tied at crossings', at: () => V(-22.5, yB2, 6.5) },
      { id: 'cb', label: 'COVER BLOCKS', sub: '75 mm under the mesh', at: () => V(-19, Y0 + 0.05, 13.5) },
      { id: 'eng', label: 'ENGINEERS', sub: 'checking the spacing', at: personHead('engineer', 0) }
    ],
    3: [
      { id: 'ch', label: 'REBAR CHAIRS', sub: 'hold the top mesh level', at: () => V(-6.5, yB2 + 0.7, 13.5) },
      { id: 'eng', label: 'ENGINEERS', sub: 'measuring chair spacing', at: personHead('engineer', 0) }
    ],
    4: [
      { id: 'side', label: 'SIDE BARS', sub: 'across the 60 m width', at: () => V(-12.5, yT1, 1.5) },
      { id: 'front', label: 'FRONT BARS', sub: 'along the 80 m length', at: () => V(1.5, yT2, 11.5) },
      { id: 'crane', label: 'CRANE LIFT', sub: 'bar bundles onto the chairs', at: () => { const c = ELEM.crane; if (!c.bundle.visible) return null; c.bundle.getWorldPosition(_w); return _w.clone(); } }
    ],
    5: [
      { id: 'cst', label: 'COLUMN STARTERS', sub: 'lap left above the raft', at: () => { const c = colNear(28, 13); return V(c.x, Y0 + TH + LAP, c.z); } },
      { id: 'wst', label: 'WALL STARTERS', sub: 'retaining wall, two faces', at: () => V(BB.x1 - 0.45, Y0 + TH + 1.4, 18) },
      { id: 'sst', label: 'STAIR STARTER', sub: 'inclined flight bars', at: () => { const s = LAYOUT.stairs[1]; return V((s.x1 + s.x2) / 2, Y0 + TH + 1.2, s.z1 + 0.6); } },
      { id: 'shaft', label: 'SHAFT & LIFT PIT', sub: 'starters around the core', at: () => { const s = LAYOUT.shafts[0]; return V(s.x2, Y0 + TH + 1.5, (s.z1 + s.z2) / 2); } }
    ],
    6: [
      { id: 'scv', label: 'SIDE COVER BLOCKS', sub: '75 mm against the boards', at: () => V(-23, Y0 + 0.72, BB.z1 - 0.05) },
      { id: 'fw', label: 'TIMBER FORMWORK', sub: '1.1 m boards, nailed', at: () => V(-16.5, Y0 + FW_H, BB.z1 + 0.05) },
      { id: 'br', label: 'BRACE + STAKE', sub: 'resists concrete pressure', at: () => V(-14.7, 0.5, BB.z1 + 1.2) }
    ],
    7: [
      { id: 'plants', label: '6 BATCHING PLANTS', sub: '1 shown on site', at: () => ELEM.plantTop, big: true },
      { id: 'trucks', label: '75 MIXER TRUCKS', sub: 'queue on the access road', at: () => V(13, 3.6, S.zq), big: true },
      { id: 'pumps', label: '11 CONCRETE PUMPS', sub: 'boom pumps around the raft', at: () => { const p = PUMPS[1]; p.b2.getWorldPosition(_w); return _w.clone(); }, big: true },
      { id: 'workers', label: '~60 WORKERS', sub: 'yellow helmets', at: personHead('worker', 11), big: true },
      { id: 'engs', label: '7 ENGINEERS', sub: 'white helmets', at: personHead('engineer', 3), big: true }
    ],
    8: [
      { id: 'front', label: 'POUR FRONT', sub: 'placed in layers', at: () => V(frontAt(20) - 1, Y0 + TH, 20) },
      { id: 'pump', label: 'PUMP HOSE', sub: 'guided by a worker', at: () => { const p = PUMPS.find(q => q.active); return p ? V(p.tgt.x, p.tgt.y + 2.6, p.tgt.z) : null; } },
      { id: 'vib', label: 'VIBRATING', sub: 'poker vibrators', at: personTask('vibrate', 1) },
      { id: 'truck', label: 'TRUCK DISCHARGING', sub: 'into the pump hopper', at: () => V(PUMPS[0].base.x - 5.7, 2.8, PUMPS[0].base.z + 4.2) }
    ],
    9: [
      { id: 'vib', label: 'VIBRATION', sub: 'still at the front', at: personTask('vibrate', 0) },
      { id: 'float', label: 'POWER FLOATING', sub: 'zone by zone', at: personTask('trowel', 1) },
      { id: 'cure', label: 'CURING SHEETS', sub: 'keep the surface moist', at: () => V(S.curingX - 3, Y0 + TH + 0.1, 16) }
    ],
    10: [
      { id: 'cubes', label: 'CUBE TESTS', sub: '7 and 28 days', at: () => ELEM.labPt, big: true },
      { id: 'strip', label: 'FORMWORK STRIPPED', sub: 'edges exposed', at: () => V(-30, Y0 + 0.6, BB.z1), big: true },
      { id: 'next', label: 'NEXT: COLUMNS · WALLS · STAIRS', sub: 'from the starter bars', at: () => { const c = colNear(12, 0); return V(c.x, Y0 + TH + 4, c.z); }, big: true }
    ]
  };

  /* environment per slide */
  function envFor(n) { return n <= 6 ? 'day' : n === 10 ? 'morning' : 'night'; }

  /* ------------------------------------------------------------------ */
  /* 19. Stage application and builds                                   */
  /* ------------------------------------------------------------------ */
  const BUILDS = [ // element, build slide, duration (s), delay (s)
    ['coverB', 2, 10, 0.6], ['bottom', 2, 11, 0.6], ['chairs', 3, 9, 0.6], ['top', 4, 12, 0.6],
    ['starters', 5, 9, 0.6], ['ties', 5, 9, 0.6], ['coverS', 6, 12, 0.4], ['panels', 6, 12, 0.4], ['studs', 6, 12, 0.4], ['walers', 6, 12, 0.4], ['braces', 6, 12, 0.4], ['stakes', 6, 12, 0.4]
  ];
  const HL = { 2: ['barBottom', 'cover'], 3: ['chair'], 4: ['barTop'], 5: ['starter'], 6: ['coverSide', 'ply', 'timber'] };
  function applyStage(n) {
    S.slide = n; S.stageT = 0;
    BUILDS.forEach(([k, b]) => ELEM[k].set(b < n ? 1 : 0));
    envTarget = ENVS[envFor(n)]; envRate = 1.6;
    if (n === 7) { envTarget = ENVS.dusk; envRate = 3; }
    // concrete & pour state
    if (n === 8) { S.frontX = -31; S.curingX = -41; }
    else if (n === 9) { S.frontX = frontForArea(3800); S.curingX = 2; }
    else if (n === 10) { S.frontX = 60; S.curingX = 60; }
    else { S.frontX = -45; S.curingX = -45; }
    ELEM.hf.visible = n === 8 || n === 9; if (ELEM.hf.visible) updateHeightfield(true);
    ELEM.solid.visible = n === 10;
    ELEM.cure.visible = n === 9; ELEM.roll.visible = n === 9;
    ELEM.form.visible = n >= 6; ELEM.form.position.y = 0; setFormOpacity(1);
    ELEM.coverS.mesh.visible = n >= 6 && n <= 9;
    ELEM.scaffold.visible = n >= 7 && n <= 9;
    ELEM.futureG.visible = n === 10; ELEM.future.set(0); ELEM.futureSlab.opacity = 0;
    const steelVisible = n >= 2 && n <= 9;
    ['bottom', 'coverB', 'chairs', 'top'].forEach(k => { ELEM[k].mesh.visible = steelVisible && ELEM[k].p > 0; });
    ELEM.starters.mesh.visible = ELEM.starters.p > 0 || n === 10; ELEM.ties.mesh.visible = ELEM.ties.p > 0 || n === 10;
    if (n === 10) { ELEM.starters.set(1); ELEM.ties.set(1); }
    PUMPS.forEach(p => { p.g.visible = n >= 7 && n <= 9; p.stream.visible = false; p.ripple.visible = false; });
    ELEM.floats.forEach(f => f.g.visible = false);
    ELEM.tripod.visible = n === 1;
    assignTasks(n); snapPeople();
    setFocusZone(ZONE[n]);
  }
  function setFormOpacity(o) {
    ['panels', 'studs', 'walers', 'braces', 'stakes'].forEach(k => { const m = ELEM[k].mesh.material; m.transparent = o < 1; m.opacity = o; m.depthWrite = o >= 1; });
  }

  function updateStage(dt) {
    const n = S.slide, t = S.stageT;
    BUILDS.forEach(([k, b, dur, del]) => { if (b === n) ELEM[k].set(sat((t - del) / dur)); });
    // CAD sheet: hologram at raft-top level on slide 1, faint guide on the blinding afterwards
    const cad = ELEM.cad;
    const cadTarget = n <= 1 ? 1 : 0;
    cad.material.opacity += (cadTarget - cad.material.opacity) * Math.min(1, dt * 2);
    cad.position.y += ((n <= 1 ? Y0 + TH + 0.05 : Y0 + 0.012) - cad.position.y) * Math.min(1, dt * 2.5);
    cad.visible = cad.material.opacity > 0.01;
    ELEM.ghost.visible = n <= 1; ELEM.ghost.children[1].material.opacity = 0.55 + 0.35 * Math.sin(S.time * 1.6);
    // night timing on slide 7: dusk, then floodlights come on one by one
    if (n === 7 && t > 2.2 && envTarget !== ENVS.night) { envTarget = ENVS.night; envRate = 0.9; }
    if (n === 9) { envTarget = ENVS.predawn; envRate = 0.05; }
    // pour progression
    if (n === 8) { S.frontX = Math.min(-31 + 0.32 * Math.max(0, t - 1), 8); }
    if (n === 9) { S.frontX = Math.min(frontForArea(3800) + 0.12 * Math.max(0, t - 1), BB.x1 + 4); S.curingX = Math.min(2 + 0.11 * t, 18); }
    if (n === 8 || n === 9) updateHeightfield(false);
    S.cureClip.constant = S.curingX; ELEM.roll.position.x = S.curingX;
    // formwork stripping + future structure (slide 10)
    if (n === 10) {
      const e = smooth((t - 1.5) / 4);
      ELEM.form.visible = e < 1; ELEM.form.position.y = e * 2.2; setFormOpacity(1 - e);
      ELEM.future.set(sat((t - 4) / 7)); ELEM.futureSlab.opacity = 0.12 * smooth((t - 10) / 3);
      ELEM.futureLine.opacity = 0.3 + 0.3 * Math.sin(S.time * 2);
      const m = ELEM.lab.platen; m.position.y = 0.5 - 0.22 * smooth(((S.time * 0.25) % 1) * 2);
    }
    // pumps
    PUMPS.forEach((p, k) => {
      if (!p.g.visible) return;
      let want = null;
      if (n === 8 || n === 9) {
        const zt = clamp(p.base.z * 0.55 + 4 * Math.sin(S.time * 0.11 + k * 2), BB.z0 + 3, BB.z1 - 3);
        const xt = frontAt(zt) + 0.2;
        const h = Math.hypot(xt - p.base.x, zt - p.base.z);
        if (h < 28 && h > 6 && inside(xt, zt, 0.5)) want = V(xt, Y0 + TH * 0.5 + 1.1, zt);
      }
      p.active = !!want;
      if (!want) { const fwd = new T.Vector3(Math.cos(p.yaw), 0, -Math.sin(p.yaw)); want = V(p.base.x - fwd.x * 6 - fwd.z * 9, 13 + 2 * Math.sin(S.time * 0.2 + k), p.base.z - fwd.z * 6 + fwd.x * 9); }
      p.tgt.lerp(want, Math.min(1, dt * (p.active ? 1.6 : 0.8)));
      aimPump(p, p.tgt);
      const pour = p.active && (n === 8 || n === 9);
      p.stream.visible = pour; p.ripple.visible = pour;
      if (pour) {
        const surf = Y0 + concreteH(p.tgt.x, p.tgt.z) * TH;
        const top = p.tgt.y - 0.1, len = Math.max(0.3, top - surf);
        p.stream.scale.set(1, len, 1); p.stream.position.set(p.tgt.x, surf + len / 2, p.tgt.z);
        const rp = (S.time * 1.4 + k * 0.3) % 1; p.ripple.position.set(p.tgt.x, surf + 0.03, p.tgt.z); p.ripple.scale.setScalar(0.6 + rp * 2.8); p.ripple.material.opacity = 0.55 * (1 - rp);
      }
    });
    // power floats follow trowel workers
    let fi = 0;
    PEOPLE.forEach(p => { if (p.task === 'trowel' && fi < ELEM.floats.length && n === 9) { const f = ELEM.floats[fi++]; f.g.visible = true; f.g.position.set(p.pos.x + Math.sin(p.yaw) * 0.9, standY(p.pos.x, p.pos.z) + 0.02, p.pos.z + Math.cos(p.yaw) * 0.9); f.g.rotation.y = p.yaw; f.blades.rotation.y += dt * 14; } });
    for (; fi < ELEM.floats.length; fi++) ELEM.floats[fi].g.visible = false;
    // curing mist
    const sprayers = n === 9 ? PEOPLE.filter(p => p.task === 'spray') : [];
    ELEM.mist.visible = sprayers.length > 0;
    if (sprayers.length) {
      const pa = ELEM.mist.geometry.attributes.position;
      for (let i = 0; i < pa.count; i++) { const sp = sprayers[i % sprayers.length]; const u = ((S.time * 0.9 + i * 0.137) % 1); const ang = sp.yaw + (hash2(i, 3) - 0.5) * 0.6; pa.setXYZ(i, sp.pos.x + Math.sin(ang) * (0.6 + u * 1.6), standY(sp.pos.x, sp.pos.z) + 1.0 - u * 0.9, sp.pos.z + Math.cos(ang) * (0.6 + u * 1.6)); }
      pa.needsUpdate = true;
    }
  }

  /* environment blending */
  const _c1 = new T.Color(), _c2 = new T.Color();
  function blendColor(key, k) { _c1.set(envCur[key]); _c2.set(envTarget[key]); _c1.lerp(_c2, k); envCur[key] = '#' + _c1.getHexString(); }
  function updateEnv(dt) {
    const k = 1 - Math.exp(-dt * envRate);
    ['top', 'hor', 'glow', 'hemiS', 'hemiG', 'key', 'fog'].forEach(c => blendColor(c, k));
    ['gAmt', 'hemi', 'keyI', 'flood', 'stars', 'fogN', 'fogF', 'exp', 'win'].forEach(f => { envCur[f] = lerp(envCur[f], envTarget[f], k); });
    envCur.keyP = envCur.keyP.map((v, i) => lerp(v, envTarget.keyP[i], k));
    const u = sky.material.uniforms; u.top.value.set(envCur.top); u.hor.value.set(envCur.hor); u.glow.value.set(envCur.glow); u.gAmt.value = envCur.gAmt;
    scene.fog.color.set(envCur.fog); scene.fog.near = envCur.fogN; scene.fog.far = envCur.fogF;
    hemi.color.copy(C(envCur.hemiS)); hemi.groundColor.copy(C(envCur.hemiG)); hemi.intensity = envCur.hemi;
    key.color.copy(C(envCur.key)); key.intensity = envCur.keyI; key.position.set(...envCur.keyP);
    renderer.toneMappingExposure = envCur.exp;
    stars.material.opacity = envCur.stars;
    S.night = sat(envCur.flood);
    // per-tower switch-on sequence on slide 7
    TOWERS.forEach((tw, i) => {
      let on = envCur.flood;
      if (S.slide === 7) on *= smooth((S.stageT - 3.0 - i * 0.55) / 0.25);
      tw.level += (on - tw.level) * Math.min(1, dt * 8);
      tw.spot.intensity = 1.55 * tw.level; tw.lampMat.emissiveIntensity = 3.2 * tw.level;
      tw.beam.material.uniforms.inten.value = 0.2 * tw.level; tw.glow.material.opacity = 0.9 * tw.level;
    });
    ELEM.dust.material.opacity = 0.55 * S.night;
    const dp = ELEM.dust.geometry.attributes.position;
    if (S.night > 0.05) { for (let i = 0; i < dp.count; i += 7) dp.setY(i, (dp.getY(i) + dt * 0.25) % 12); dp.needsUpdate = true; }
    MATS.facade.emissiveIntensity = 0.55 * envCur.win;
    const env = S.night > 0.5 ? envNight : envDay;
    [MATS.barBottom, MATS.barTop, MATS.starter, MATS.chair].forEach(m => { if (m.envMap !== env) { m.envMap = env; m.needsUpdate = true; } m.envMapIntensity = S.night > 0.5 ? 1.2 : 0.6; });
  }

  /* focus highlight (rim glow pulse on the slide's element + brackets) */
  function updateFocus(dt) {
    const f = ELEM.focus, a = S.focusAmt;
    f.mat.opacity = 0.85 * a; f.glow.material.opacity = 0.16 * a;
    const pulse = 0.5 + 0.5 * Math.sin(S.time * 3.2);
    const hl = HL[S.slide] || [];
    ['barBottom', 'barTop', 'chair', 'starter', 'cover', 'coverSide', 'ply', 'timber'].forEach(k => {
      const m = MATS[k]; const on = hl.includes(k) ? a : 0;
      m.emissive.copy(C('#2fb8ff')); m.emissiveIntensity = on * (0.12 + 0.22 * pulse) * (k === 'ply' || k === 'timber' ? 0.35 : 1);
    });
  }

  /* ------------------------------------------------------------------ */
  /* 20. Camera choreography: zoom out -> master -> zoom in              */
  /* ------------------------------------------------------------------ */
  const cam = { phase: 'intro', t: 0, from: null, to: null, cur: { t: [0, 0, 0], d: 260, az: 20, el: 44 }, pending: 1, OUT: 1.25, IN: 1.8 };
  function viewFor(n) {
    const v = VIEWS[n]; const o = { t: v.t.slice(), d: v.d, az: v.az, el: v.el };
    if (v.follow && (n === 8)) o.t[0] = clamp(S.frontX - 3, -30, 10);
    return o;
  }
  function lerpView(a, b, e) {
    let daz = ((b.az - a.az + 540) % 360) - 180;
    return { t: a.t.map((v, i) => lerp(v, b.t[i], e)), d: Math.exp(lerp(Math.log(a.d), Math.log(b.d), e)), az: a.az + daz * e, el: lerp(a.el, b.el, e) };
  }
  function goTo(n) {
    n = clamp(n | 0, 1, 10);
    cam.pending = n;
    if (cam.phase === 'out' || cam.phase === 'intro') return;
    cam.phase = 'out'; cam.t = 0; cam.from = JSON.parse(JSON.stringify(cam.cur)); cam.to = MASTER;
  }
  function updateCamera(dt) {
    cam.t += dt;
    if (cam.phase === 'intro') {
      if (cam.t === dt) { applyStage(cam.pending); cam.from = { t: [0, 0, 0], d: 290, az: 12, el: 45 }; }
      const e = easeIO(sat(cam.t / 2.6));
      cam.cur = lerpView(cam.from, viewFor(S.slide), e);
      S.focusAmt = 0;
      if (cam.t >= 2.6) { cam.phase = 'hold'; cam.t = 0; }
    } else if (cam.phase === 'out') {
      const e = easeIO(sat(cam.t / cam.OUT));
      cam.cur = lerpView(cam.from, MASTER, e);
      S.focusAmt = Math.max(0, S.focusAmt - dt * 3);
      if (cam.t >= cam.OUT) { applyStage(cam.pending); cam.phase = 'in'; cam.t = 0; }
    } else if (cam.phase === 'in') {
      const e = easeIO(sat(cam.t / cam.IN));
      cam.cur = lerpView(MASTER, viewFor(S.slide), e);
      S.focusAmt = smooth((cam.t - cam.IN * 0.6) / (cam.IN * 0.6));
      if (cam.t >= cam.IN) { cam.phase = 'hold'; cam.t = 0; if (cam.pending !== S.slide) goTo(cam.pending); }
    } else {
      const v = viewFor(S.slide);
      v.az += 2.2 * Math.sin(cam.t * 0.11); v.d *= 1 - 0.03 * Math.sin(cam.t * 0.07);
      const k = Math.min(1, dt * 2.5);
      cam.cur = lerpView(cam.cur, v, k);
      S.focusAmt = Math.min(1, S.focusAmt + dt * 1.5);
      if (cam.pending !== S.slide) goTo(cam.pending);
    }
    const c = cam.cur, az = c.az * Math.PI / 180, el = c.el * Math.PI / 180;
    camera.position.set(c.t[0] + c.d * Math.sin(az) * Math.cos(el), c.t[1] + c.d * Math.sin(el), c.t[2] + c.d * Math.cos(az) * Math.cos(el));
    camera.lookAt(c.t[0], c.t[1], c.t[2]);
    sky.position.copy(camera.position); stars.position.copy(camera.position);
  }

  /* ------------------------------------------------------------------ */
  /* 21. Frame update, projection helpers, public API                    */
  /* ------------------------------------------------------------------ */
  function update(dt) {
    S.time += dt;
    if (cam.phase !== 'intro' || cam.t > 0) S.stageT += dt;
    updateCamera(dt);
    updateEnv(dt);
    updateStage(dt);
    updateCrane(dt);
    updateTrucks(dt);
    updatePeople(dt);
    updateFocus(dt);
    ELEM.ripples.forEach(r => { if (!r.m.visible) return; r.t += dt / 1.1; r.m.scale.setScalar(0.2 + r.t * r.size); r.m.material.opacity = 0.6 * (1 - r.t); if (r.t >= 1) r.m.visible = false; });
    ELEM.flashes.forEach(f => { if (!f.s.visible) return; f.t += dt / 0.16; f.s.material.opacity = 1 - f.t; f.s.scale.setScalar(0.25 + f.t * 0.5); if (f.t >= 1) f.s.visible = false; });
  }
  function render() { renderer.render(scene, camera); }
  let shiftX = 0, shiftY = 0;
  function applyShift() { if (shiftX || shiftY) camera.setViewOffset(W, H, shiftX, shiftY, W, H); else { camera.clearViewOffset(); } }
  function setViewShift(x, y) { shiftX = Math.round(x || 0); shiftY = Math.round(y || 0); applyShift(); }
  function resize() {
    const c = renderer.domElement; W = c.clientWidth || window.innerWidth; H = c.clientHeight || window.innerHeight;
    renderer.setSize(W, H, false); camera.aspect = W / H;
    camera.fov = W / H < 0.9 ? 52 : 36; camera.updateProjectionMatrix(); applyShift();
  }
  const _pv = new T.Vector3();
  function project(v) {
    if (!v) return null;
    _pv.copy(v).project(camera);
    return { x: (_pv.x * 0.5 + 0.5) * W, y: (-_pv.y * 0.5 + 0.5) * H, ok: _pv.z < 1 && _pv.z > -1 };
  }
  function focusScreen() {
    const z = ELEM.focus.zone; const y = Y0 + 0.6;
    const c = project(V(z.cx, y, z.cz)); if (!c) return null;
    const pts = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => project(V(z.cx + a * z.hw, y, z.cz + b * z.hd)));
    let rx = 0, ry = 0; pts.forEach(p => { rx = Math.max(rx, Math.abs(p.x - c.x)); ry = Math.max(ry, Math.abs(p.y - c.y)); });
    return { x: c.x, y: c.y, rx, ry };
  }
  function callouts() {
    const list = CALLOUTS[S.slide] || [];
    return list.map(c => { const v = c.at(); const p = v ? project(v) : null; return { id: c.id, label: c.label, sub: c.sub, big: !!c.big, x: p ? p.x : 0, y: p ? p.y : 0, ok: !!(p && p.ok) }; });
  }
  function pourState() {
    const n = S.slide;
    let poured = 0;
    if (n === 8 || n === 9) poured = pouredArea(S.frontX) * TH;
    if (n === 10) poured = AREA * TH;
    const hours = poured / 380;
    const mins = Math.round((20 + hours) * 60) % (24 * 60);
    const clock = String(Math.floor(mins / 60)).padStart(2, '0') + ':' + String(mins % 60).padStart(2, '0');
    const el = Math.round(hours * 60);
    return { poured: Math.round(poured), total: Math.round(AREA * TH), clock, elapsed: Math.floor(el / 60) + ' h ' + String(el % 60).padStart(2, '0') + ' min' };
  }

  window.RaftScene = {
    init, update, render, resize, goTo, setViewShift, project, focusScreen, callouts, pourState,
    get slide() { return S.slide; }, get pending() { return cam.pending; }, get phase() { return cam.phase; },
    get focusAmt() { return S.focusAmt; }, get stageT() { return S.stageT; }, get night() { return S.night; },
    LAYOUT, AREA, COLS,
    _dbg: { MATS, ELEM, TEX, get env() { return { envDay, envNight }; }, get renderer() { return renderer; }, get scene() { return scene; } }
  };
})();

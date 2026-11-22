/* =====================================================================
   ONE NIGHT, ONE RAFT: HUD, slide flow, speaker notes, controls
   ===================================================================== */
(function () {
  'use strict';
  const C = window.RAFT_CONTENT, RS = window.RaftScene;
  const $ = s => document.querySelector(s);
  const SL = C.SLIDES, TN = C.TENSES;
  if (!window.THREE || !RS) {
    document.body.insertAdjacentHTML('beforeend', '<p style="position:fixed;inset:auto 16px 16px;padding:12px;background:#300;color:#fff;font:14px sans-serif;border-radius:8px">The 3D engine (three.js) could not load. Check the internet connection and reload.</p>');
    return;
  }

  /* ---------- stage strip ---------- */
  const row = $('#stageRow');
  SL.forEach(s => {
    const b = document.createElement('button');
    b.className = 'stage-btn'; b.type = 'button'; b.dataset.n = s.n;
    b.title = s.n + '. ' + s.title + ' (' + s.tenses.map(k => TN[k].name).join(' + ') + ')';
    b.innerHTML = '<i></i><span>' + String(s.n).padStart(2, '0') + ' ' + s.short + '</span>';
    b.addEventListener('click', () => go(s.n));
    row.appendChild(b);
  });

  /* ---------- slide card ---------- */
  const card = $('#card');
  function renderCard(n) {
    const s = SL[n - 1];
    const chips = s.tenses.map(k => '<span class="chip" style="--tc:' + TN[k].color + '">' + TN[k].name + '</span>').join('');
    const whys = s.tenses.map(k => '<div class="why"><b>Why ' + TN[k].short + ':</b> ' + C.esc(s.explain[k]) + '</div>').join('');
    card.innerHTML =
      '<div class="kicker"><span>Slide ' + String(n).padStart(2, '0') + ' / 10</span><span>' + C.esc(s.zone) + '</span></div>' +
      '<h2>' + C.esc(s.title) + '</h2>' +
      '<div class="chips">' + chips + '</div>' +
      '<ul>' + s.bullets.map(b => '<li>' + C.esc(b) + '</li>').join('') + '</ul>' +
      '<div class="ex">' + s.examples.map(e => '<q>' + C.markupToHTML(e) + '</q>').join('') + '</div>' + whys;
    card.classList.remove('swap'); void card.offsetWidth; card.classList.add('swap');
    requestAnimationFrame(updateShift);
    $('#stageNum').textContent = String(n).padStart(2, '0');
    $('#stageName').textContent = s.short;
    $('#tenseHead').textContent = s.tenses.map(k => TN[k].name).join(' + ');
    $('#phase').innerHTML = '<b>' + C.esc(s.phase) + '</b>';
    if (s.clock !== 'live') $('#clock').textContent = s.clock;
    $('#logi').hidden = !(n >= 7 && n <= 9);
    $('#pour').hidden = !(n >= 8 && n <= 9);
    if (n === 7) countUp();
    renderNotes(n);
  }

  /* ---------- logistics count-up ---------- */
  function countUp() {
    const els = [...document.querySelectorAll('#logi b')];
    const t0 = performance.now();
    function step(now) {
      const k = Math.min(1, (now - t0 - 2600) / 1400);
      els.forEach(el => { const v = +el.dataset.n; el.textContent = (el.dataset.p || '') + Math.round(v * Math.max(0, 1 - Math.pow(1 - Math.max(0, k), 3))); });
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- speaker notes ---------- */
  function renderNotes(n) {
    const s = SL[n - 1];
    $('#notesSlide').textContent = 'Slide ' + n + ' · ' + s.title;
    $('#notesTense').innerHTML = '<h4>Tense focus</h4>' + s.tenses.map(k => {
      const t = TN[k];
      return '<div class="tense-box" style="--tc:' + t.color + '"><h5>' + t.name + '</h5>' +
        '<div class="form"><b>+</b><span>' + C.esc(t.form.pos) + '</span><b>−</b><span>' + C.esc(t.form.neg) + '</span><b>?</b><span>' + C.esc(t.form.q) + '</span></div>' +
        '<p>' + C.esc(s.explain[k]) + '</p>' + C.timelineSVG(t.timeline, t.color) + '</div>';
    }).join('');
    const parts = C.chunks(s.script);
    let html = '', idx = 0;
    // rebuild the marked-up script chunk by chunk so rehearsal can highlight it
    const raw = s.script.split(/ (\/\/|\/) /);
    for (let i = 0; i < raw.length; i += 2) {
      const sep = raw[i + 1];
      html += '<span class="chunk" data-i="' + (idx++) + '">' + C.markupToHTML(raw[i]) + '</span>';
      if (sep) html += ' <span class="pause' + (sep === '//' ? ' long' : '') + '" title="' + (sep === '//' ? 'long pause' : 'short pause') + '">' + (sep === '//' ? '‖' : '|') + '</span> ';
    }
    $('#notesScript').innerHTML = html;
    $('#notesMeta').innerHTML = '<span>≈ ' + C.speakSeconds(s) + ' s</span><span>' + C.wordCount(s.script) + ' words</span><span>| short pause · ‖ long pause</span>';
    const v = s.voice;
    $('#notesVoice').innerHTML = '<h4>Voice notes · ElevenLabs</h4><dl>' +
      '<dt>Mood</dt><dd>' + C.esc(v.mood) + '</dd>' +
      '<dt>Speed</dt><dd>' + v.speed.toFixed(2) + '×</dd>' +
      '<dt>Stress</dt><dd>' + v.stress.map(C.esc).join(' · ') + '</dd>' +
      '<dt>Tip</dt><dd>' + C.esc(v.tip) + '</dd>' +
      '<dt>Settings</dt><dd>Eleven Multilingual v2 · stability 50–55% · similarity 75% · style 15–20% · speaker boost on</dd></dl>' +
      '<div class="row-btns"><button class="btn" id="copy11">Copy ElevenLabs text</button><button class="btn" id="copyPlain">Copy plain script</button></div><div class="toast" id="toast"></div>';
    $('#copy11').onclick = () => copy(C.toElevenLabs(s.script), 'ElevenLabs text copied, with <break> tags.');
    $('#copyPlain').onclick = () => copy(C.plain(s.script), 'Plain script copied.');
    stopRehearse();
  }
  function copy(text, msg) {
    const done = () => { $('#toast').textContent = msg; setTimeout(() => { const t = $('#toast'); if (t) t.textContent = ''; }, 2600); };
    try {
      navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
    } catch (e) { fallbackCopy(text, done); }
  }
  function fallbackCopy(text, done) {
    const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { $('#toast').textContent = 'Select the script text and copy it manually.'; }
    ta.remove();
  }

  /* ---------- rehearsal with the browser's own voice ---------- */
  let rehearsing = false, rTimer = null;
  function stopRehearse() {
    rehearsing = false; clearTimeout(rTimer);
    try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) { /* ignore */ }
    document.querySelectorAll('.chunk.speaking').forEach(e => e.classList.remove('speaking'));
    const b = $('#rehearse span'); if (b) b.textContent = 'Rehearse with browser voice';
  }
  $('#rehearse').addEventListener('click', () => {
    if (rehearsing) return stopRehearse();
    if (!('speechSynthesis' in window)) { $('#rehearse span').textContent = 'No browser voice available'; return; }
    const s = SL[RS.pending - 1], parts = C.chunks(s.script);
    const voices = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang));
    rehearsing = true; $('#rehearse span').textContent = 'Stop rehearsal';
    let i = 0;
    const next = () => {
      if (!rehearsing || i >= parts.length) return stopRehearse();
      document.querySelectorAll('.chunk.speaking').forEach(e => e.classList.remove('speaking'));
      const el = document.querySelector('.chunk[data-i="' + i + '"]'); if (el) { el.classList.add('speaking'); el.scrollIntoView({ block: 'nearest' }); }
      const u = new SpeechSynthesisUtterance(parts[i].text); u.rate = s.voice.speed; u.lang = 'en-US'; if (voices[0]) u.voice = voices[0];
      const pause = parts[i].pause; i++;
      u.onend = () => { rTimer = setTimeout(next, pause); };
      u.onerror = () => stopRehearse();
      speechSynthesis.speak(u);
    };
    next();
  });

  /* ---------- grammar quick reference ---------- */
  $('#gramBody').innerHTML = C.TENSE_ORDER.map(k => {
    const t = TN[k];
    return '<div class="gram-card" style="--tc:' + t.color + '"><h5>' + t.n + '. ' + t.name + '<small>slide ' + t.slides.join(', ') + '</small></h5>' +
      '<div class="form"><b>+</b><span>' + C.esc(t.form.pos) + '</span></div>' +
      '<p>' + t.use.map(C.esc).join('; ') + '.</p>' +
      '<p>' + C.markupToHTML(t.example) + '</p>' +
      '<div class="sig">Signals: ' + t.signals.map(C.esc).join(', ') + '</div>' + C.timelineSVG(t.timeline, t.color) + '</div>';
  }).join('');

  /* ---------- drawers & controls ---------- */
  function toggle(id, btn, force) {
    const el = $(id), show = force != null ? force : el.hidden;
    ['#notes', '#grammar'].forEach(o => { if (o !== id) { $(o).hidden = true; } });
    $('#notesBtn').setAttribute('aria-pressed', 'false'); $('#gramBtn').setAttribute('aria-pressed', 'false');
    el.hidden = !show; btn.setAttribute('aria-pressed', String(show));
    if (!show && id === '#notes') stopRehearse();
  }
  $('#notesBtn').onclick = () => toggle('#notes', $('#notesBtn'));
  $('#gramBtn').onclick = () => toggle('#grammar', $('#gramBtn'));
  $('#notesClose').onclick = () => toggle('#notes', $('#notesBtn'), false);
  $('#gramClose').onclick = () => toggle('#grammar', $('#gramBtn'), false);
  $('#prev').onclick = () => go(RS.pending - 1);
  $('#next').onclick = () => go(RS.pending + 1);
  const clean = v => { document.body.classList.toggle('clean', v); updateShift(); };
  $('#cleanBtn').onclick = () => clean(true);
  $('#restore').onclick = () => clean(false);
  $('#fsBtn').onclick = () => {
    try {
      if (!document.fullscreenElement) { const p = document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); if (p && p.catch) p.catch(() => {}); }
      else document.exitFullscreen();
    } catch (e) { /* fullscreen not available in this view */ }
  };
  let auto = false, autoT = 0;
  const setAuto = v => { auto = v; autoT = 0; $('#auto').setAttribute('aria-pressed', String(v)); };
  $('#auto').onclick = () => setAuto(!auto);
  window.addEventListener('keydown', e => {
    if (e.target.closest && e.target.closest('input,textarea')) return;
    const k = e.key;
    if (k === 'ArrowRight' || k === 'PageDown' || (k === ' ' && !e.target.closest('button'))) { e.preventDefault(); go(RS.pending + 1); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); go(RS.pending - 1); }
    else if (k === 'Home') go(1); else if (k === 'End') go(10);
    else if (/^[0-9]$/.test(k)) go(k === '0' ? 10 : +k);
    else if (k === 'n' || k === 'N') toggle('#notes', $('#notesBtn'));
    else if (k === 'g' || k === 'G') toggle('#grammar', $('#gramBtn'));
    else if (k === 'h' || k === 'H') clean(!document.body.classList.contains('clean'));
    else if (k === 'a' || k === 'A') setAuto(!auto);
    else if (k === 'f' || k === 'F') $('#fsBtn').click();
    else if (k === 'Escape') { toggle('#notes', $('#notesBtn'), false); toggle('#grammar', $('#gramBtn'), false); clean(false); }
  });
  function go(n) {
    n = Math.max(1, Math.min(10, n));
    if (n === RS.pending && RS.phase !== 'intro') return;
    RS.goTo(n); autoT = 0;
    try { history.replaceState(null, '', '#slide-' + n); } catch (e) { /* hash routing unavailable */ }
  }
  window.addEventListener('hashchange', () => { const m = /slide-(\d+)/.exec(location.hash); if (m) go(+m[1]); });

  /* ---------- per-frame HUD ---------- */
  const vig = $('#vignette'), svg = $('#leaders'), coBox = $('#callouts');
  const coEls = {};
  let shownSlide = 0;
  function hud(dt) {
    const n = RS.slide;
    if (n !== shownSlide && n > 0) { shownSlide = n; renderCard(n); buildCallouts(n); }
    document.querySelectorAll('.stage-btn').forEach(b => {
      const k = +b.dataset.n;
      b.classList.toggle('on', k === n); b.classList.toggle('done', k < n); b.classList.toggle('pend', k === RS.pending && k !== n);
    });
    // focus vignette
    const f = RS.focusScreen(), fa = RS.focusAmt;
    if (f && fa > 0.01 && n !== 7 && n !== 10 && n !== 1) {
      vig.style.setProperty('--fx', f.x + 'px'); vig.style.setProperty('--fy', f.y + 'px');
      vig.style.setProperty('--rx', Math.max(160, f.rx * 1.55) + 'px'); vig.style.setProperty('--ry', Math.max(120, f.ry * 1.75) + 'px');
      vig.style.opacity = (0.95 * fa).toFixed(3);
    } else vig.style.opacity = '0';
    // callouts
    layoutCallouts(fa);
    // pour data
    if (n >= 8 && n <= 10) {
      const ps = RS.pourState();
      $('#pourVal').textContent = ps.poured.toLocaleString('en-US') + ' / ' + ps.total.toLocaleString('en-US') + ' m³';
      $('#pourBar').style.width = (100 * ps.poured / ps.total).toFixed(1) + '%';
      $('#pourClock').textContent = ps.clock; $('#pourEl').textContent = ps.elapsed;
      if (n !== 10) $('#clock').textContent = ps.clock + ' · time-lapse';
    }
    // auto-play, timed to the script
    if (auto && RS.phase === 'hold') {
      autoT += dt;
      if (autoT > C.speakSeconds(SL[n - 1]) + 1.5) { if (n < 10) go(n + 1); else setAuto(false); }
    }
  }
  function buildCallouts(n) {
    Object.values(coEls).forEach(o => o.el.remove());
    for (const k in coEls) delete coEls[k];
    svg.innerHTML = '';
    RS.callouts().forEach(c => {
      const el = document.createElement('div');
      el.className = 'co' + (c.big ? ' big' : '');
      const m = /^([~\d,]+)\s(.*)$/.exec(c.label);
      el.innerHTML = '<b>' + (c.big && m ? '<em>' + m[1] + '</em> ' + C.esc(m[2]) : C.esc(c.label)) + '</b><span>' + C.esc(c.sub) + '</span>';
      coBox.appendChild(el);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      line.setAttribute('fill', 'none'); line.setAttribute('stroke', c.big ? '#ffb21a' : '#2fd3ff'); line.setAttribute('stroke-width', '1.4'); line.setAttribute('opacity', '0');
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('r', '3.5'); dot.setAttribute('fill', c.big ? '#ffb21a' : '#2fd3ff'); dot.setAttribute('opacity', '0');
      svg.appendChild(line); svg.appendChild(dot);
      coEls[c.id] = { el, line, dot, x: null, y: null, w: 0, h: 0 };
    });
  }
  function layoutCallouts(fa) {
    const list = RS.callouts(), Wd = window.innerWidth, Hd = window.innerHeight;
    const narrow = Wd < 860;
    const cardR = narrow ? Wd : $('#card').getBoundingClientRect().left - 12;
    const topLim = $('.top').getBoundingClientRect().bottom + 8;
    const botLim = narrow ? $('#card').getBoundingClientRect().top - 8 : Hd - 12;
    const placed = [];
    // treat visible HUD panels as obstacles so labels never hide behind them
    ['.left', '#logi', '#pour', '.controls', '.brand'].forEach(sel => { const el = document.querySelector(sel); if (!el || el.hidden || el.offsetParent === null) return; const r = el.getBoundingClientRect(); if (r.width && r.height) placed.push({ x: r.left, y: r.top, w: r.width, h: r.height, panel: true }); });
    const vis = Math.max(0, Math.min(1, (fa - 0.3) / 0.5));
    list.forEach((c, i) => {
      const o = coEls[c.id]; if (!o) return;
      if (!o.w) { const r = o.el.getBoundingClientRect(); o.w = r.width || 160; o.h = r.height || 40; }
      const ok = c.ok && c.x > 4 && c.x < cardR && c.y > topLim && c.y < botLim;
      if (!ok || vis <= 0) { o.el.style.opacity = '0'; o.line.setAttribute('opacity', '0'); o.dot.setAttribute('opacity', '0'); return; }
      const side = c.x > (cardR / 2) ? 1 : -1;
      let lx = c.x + side * (narrow ? 24 : 54) - (side < 0 ? o.w : 0);
      let ly = c.y - (narrow ? 50 : 74) - (i % 2) * 18;
      lx = Math.max(8, Math.min(cardR - o.w - 6, lx));
      ly = Math.max(topLim, Math.min(botLim - o.h, ly));
      for (let k = 0; k < 10; k++) {
        const hit = placed.find(p => lx < p.x + p.w + 6 && lx + o.w + 6 > p.x && ly < p.y + p.h + 6 && ly + o.h + 6 > p.y);
        if (!hit) break;
        if (hit.panel) { // jump sideways past the panel, or above/below it
          const right = hit.x + hit.w + 10;
          if (right + o.w < cardR) lx = right; else { ly = hit.y - o.h - 10; if (ly < topLim) ly = hit.y + hit.h + 10; }
        } else { ly = hit.y + hit.h + 8; if (ly + o.h > botLim) { ly = hit.y - o.h - 8; } }
      }
      placed.push({ x: lx, y: ly, w: o.w, h: o.h });
      if (o.x == null) { o.x = lx; o.y = ly; }
      o.x += (lx - o.x) * 0.25; o.y += (ly - o.y) * 0.25;
      o.el.style.transform = 'translate(' + o.x.toFixed(1) + 'px,' + o.y.toFixed(1) + 'px)';
      o.el.style.opacity = vis.toFixed(2);
      const ax = side > 0 ? o.x : o.x + o.w, ay = o.y + o.h / 2;
      o.line.setAttribute('d', 'M' + c.x.toFixed(1) + ' ' + c.y.toFixed(1) + ' L' + (ax - side * 14).toFixed(1) + ' ' + ay.toFixed(1) + ' L' + ax.toFixed(1) + ' ' + ay.toFixed(1));
      o.line.setAttribute('opacity', (0.9 * vis).toFixed(2));
      o.dot.setAttribute('cx', c.x.toFixed(1)); o.dot.setAttribute('cy', c.y.toFixed(1)); o.dot.setAttribute('opacity', vis.toFixed(2));
    });
  }

  /* keep the 3D focus centred in the space the slide card leaves free */
  function updateShift() {
    const W = window.innerWidth, H = window.innerHeight;
    if (document.body.classList.contains('clean')) return RS.setViewShift(0, 0);
    if (W >= 860) { const r = card.getBoundingClientRect(); RS.setViewShift((W - r.left) * 0.42, 0); }
    else { const r = card.getBoundingClientRect(); RS.setViewShift(0, Math.max(0, (H - r.top) * 0.4)); }
  }

  /* ---------- boot ---------- */
  RS.init($('#stage'));
  window.addEventListener('resize', () => { RS.resize(); updateShift(); Object.values(coEls).forEach(o => { o.w = 0; }); });
  const m = /slide-(\d+)/.exec(location.hash);
  RS.goTo(m ? +m[1] : 1);
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now;
    RS.update(dt); RS.render(); hud(dt);
    requestAnimationFrame(frame);
  }
  if (window.__RAFT_CAPTURE) {
    // deterministic stepping for screenshots and video capture
    window.__raftStep = (dt, steps) => { for (let i = 0; i < (steps || 1); i++) { RS.update(dt); hud(dt); } RS.render(); };
    window.__raftGo = go;
  } else requestAnimationFrame(frame);
})();

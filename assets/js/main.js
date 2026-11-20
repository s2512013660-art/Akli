/* Bawabat Al-Emar General Contracting — presentation site */
(function () {
  "use strict";

  /* =====================================================
     Site settings — edit these values
     EMAIL : company e-mail. The e-mail card stays hidden until it is filled in.
     MAPS  : Google Maps link to the company location
             (Google Maps → the pin → Share → Copy link).
     ===================================================== */
  var CONFIG = {
    EMAIL: "",
    MAPS: "https://www.google.com/maps/search/?api=1&query=Karbala%2C%20Iraq",
    WHATSAPP: "9647718000711"
  };

  var root = document.documentElement;
  var reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var isRTL = function () { return root.dir === "rtl"; };

  /* ---------- English copy (Arabic is read from the page) ---------- */
  var EN = {
    "brand": "Bawabat Al-Emar",
    "brand.sub": "GENERAL CONTRACTING",
    "nav.home": "Home",
    "nav.about": "About",
    "nav.works": "Our work",
    "nav.services": "Services",
    "nav.contact": "Contact",
    "nav.next": "Next",
    "hero.title": "Bawabat Al-Emar",
    "hero.tagline": "Experience you can see on site",
    "hero.since": "Since 2007",
    "about.title": "Field experience since 2007",
    "about.lead": "General contracting to precise standards",
    "about.p1": "Design",
    "about.p2": "Construction",
    "about.p3": "Supervision",
    "about.sectors": "For the public and private sectors",
    "works.title": "Selected sites",
    "p1": "Al-Kamaliyat Bridge",
    "p2": "Al-Warith University Hospital",
    "p3": "Courthouse Building, Karbala Governorate",
    "p4": "Al-Bobiyat River Lining",
    "p5": "Sama Karbala Fuel Station",
    "p6": "Hilla – Karbala Entrance Checkpoint",
    "p7": "Five Stars Hotel",
    "p8": "Cookies & More Building",
    "p9": "Al-Mawakib Square",
    "p10": "Homeless Shelter Building",
    "services.title": "Our services",
    "s1": "Residential and commercial buildings",
    "s2": "Infrastructure works",
    "s3": "Structural and concrete works",
    "s4": "Restoration and rehabilitation",
    "s5": "Finishing and cladding works",
    "s6": "Engineering design and supervision",
    "s7": "Supply of materials and equipment",
    "contact.title": "Contact us",
    "contact.phone": "Phone",
    "contact.wa": "WhatsApp",
    "contact.waV": "Message us directly",
    "contact.email": "Email",
    "contact.loc": "Our location on Google Maps",
    "contact.locV": "Karbala, Iraq",
    "contact.rights": "Bawabat Al-Emar General Contracting Co.",
    "ui.close": "Close",
    "ui.prev": "Previous",
    "ui.next": "Next",
    "_title": "Bawabat Al-Emar General Contracting",
    "_wa": "Hello, I would like to discuss a project with Bawabat Al-Emar."
  };
  var AR = { "_title": document.title, "_wa": "السلام عليكم، أرغب بمناقشة مشروع مع شركة بوابة الإعمار." };

  var textNodes = document.querySelectorAll("[data-i18n]");
  var ariaNodes = document.querySelectorAll("[data-i18n-aria]");
  textNodes.forEach(function (el) { AR[el.getAttribute("data-i18n")] = el.innerHTML; });
  ariaNodes.forEach(function (el) {
    var k = el.getAttribute("data-i18n-aria");
    if (!(k in AR)) AR[k] = el.getAttribute("aria-label");
  });

  function setLang(lang) {
    var en = lang === "en";
    var dict = en ? EN : AR;
    root.lang = en ? "en" : "ar";
    root.dir = en ? "ltr" : "rtl";
    textNodes.forEach(function (el) {
      var v = dict[el.getAttribute("data-i18n")];
      if (v != null) el.innerHTML = v;
    });
    ariaNodes.forEach(function (el) {
      var v = dict[el.getAttribute("data-i18n-aria")];
      if (v != null) el.setAttribute("aria-label", v);
    });
    document.title = dict._title;
    document.querySelectorAll("[data-lang-toggle]").forEach(function (b) {
      b.textContent = en ? "العربية" : "English";
      b.setAttribute("lang", en ? "ar" : "en");
    });
    document.querySelectorAll("[data-wa]").forEach(function (a) {
      a.href = "https://wa.me/" + CONFIG.WHATSAPP + "?text=" + encodeURIComponent(dict._wa);
    });
    try { localStorage.setItem("bawabat-lang", en ? "en" : "ar"); } catch (e) { /* storage unavailable */ }
    rail.scrollLeft = 0;
    railState();
  }

  /* ---------- Contact settings ---------- */
  var mailCard = document.querySelector("[data-email]");
  if (mailCard && CONFIG.EMAIL) {
    mailCard.href = "mailto:" + CONFIG.EMAIL;
    mailCard.querySelector("[data-email-text]").textContent = CONFIG.EMAIL;
    mailCard.hidden = false;
  }
  document.querySelectorAll("[data-maps]").forEach(function (a) { a.href = CONFIG.MAPS; });

  /* ---------- Slides ---------- */
  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-slide]"));
  var header = document.getElementById("header");
  var dots = document.getElementById("dots");
  var dotLinks = dots.querySelectorAll("a");
  var navLinks = document.querySelectorAll("#nav a");
  var wa = document.querySelector(".wa-float");
  var hero = document.getElementById("hero");
  var current = slides[0];
  var introDone = false;
  var heroTextHold = false;   // on first load the hero text waits for the photo to start pulling back

  // Stagger the entrance of each slide's elements (capped so long lists don't drag)
  slides.forEach(function (s) {
    s.querySelectorAll(".anim").forEach(function (el, i) {
      el.style.setProperty("--d", (0.15 + Math.min(i, 6) * 0.12).toFixed(2) + "s");
    });
  });

  // The slide holding the middle of the screen is the current one
  function update() {
    var vh = window.innerHeight;
    var mid = vh / 2;
    slides.forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) current = s;
    });
    if (!introDone) return;
    slides.forEach(function (s) {
      var r = s.getBoundingClientRect();
      var onScreen = r.bottom > 0 && r.top < vh;
      if (s === current && !(s === hero && heroTextHold)) s.classList.add("is-active");
      else if (!onScreen) s.classList.remove("is-active");   // reset only once out of view, so it replays next time
    });
    var hash = "#" + current.id;
    dotLinks.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === hash); });
    navLinks.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === hash); });
    header.classList.toggle("is-solid", current !== hero || window.scrollY > 40);
    wa.classList.toggle("is-hidden", current.id === "contact");
    dots.classList.toggle("is-hidden", current.id === "works");
  }
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; update(); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { onScroll(); railState(); });

  /* ---------- Hero: the photo waits zoomed on the building, then returns to normal ---------- */
  function startHeroZoom() {
    if (reduced || hero.classList.contains("is-zooming") || hero.classList.contains("has-zoomed")) return;
    var img = hero.querySelector(".slide-bg img");
    hero.classList.add("is-zooming");
    img.addEventListener("animationend", function () {
      hero.classList.remove("is-zooming");
      hero.classList.add("has-zoomed");
    }, { once: true });
  }

  /* ---------- Intro: the mark floats, turns and settles into the header ---------- */
  var intro = document.getElementById("intro");
  var introMark = document.getElementById("intro-mark");
  var shadow = document.getElementById("intro-shadow");
  var headerMark = document.getElementById("header-mark");
  var cancelled = false;

  function endIntro() {
    if (introDone) return;
    introDone = true;
    cancelled = true;
    root.classList.remove("is-intro", "is-landing");
    root.classList.add("is-ready");
    if (intro && intro.parentNode) intro.parentNode.removeChild(intro);
    if (reduced) { update(); return; }
    heroTextHold = true;
    setTimeout(startHeroZoom, 350);                                         // the mark has landed: start pulling back
    setTimeout(function () { heroTextHold = false; update(); }, 1500);     // then the words arrive
    update();
  }

  function wait(ms) { return new Promise(function (res) { setTimeout(res, ms); }); }

  function heroReady() {
    var img = hero.querySelector(".slide-bg img");
    if (img.complete && img.naturalWidth) return Promise.resolve();
    return new Promise(function (res) {
      img.addEventListener("load", res, { once: true });
      img.addEventListener("error", res, { once: true });
      setTimeout(res, 2500);
    });
  }

  function fly() {
    if (cancelled) return;
    var from = introMark.getBoundingClientRect();
    var to = headerMark.getBoundingClientRect();
    var dx = (to.left + to.width / 2) - (from.left + from.width / 2);
    var dy = (to.top + to.height / 2) - (from.top + from.height / 2);
    var s = to.width / from.width;
    var flight = introMark.animate([
      { transform: "translate(0px, 0px) perspective(600px) scale(1) rotateY(0deg)" },
      { transform: "translate(" + dx + "px, " + dy + "px) perspective(600px) scale(" + s + ") rotateY(360deg)" }
    ], { duration: 1250, easing: "cubic-bezier(.65, 0, .25, 1)", fill: "forwards" });
    shadow.animate([{ opacity: 0.5 }, { opacity: 0 }], { duration: 300, fill: "forwards" });
    setTimeout(function () { if (!cancelled) intro.classList.add("is-leaving"); }, 420);   // curtain lifts: the photo shows, zoomed on the building
    setTimeout(function () { if (!cancelled) root.classList.add("is-landing"); }, 850);
    flight.finished.then(endIntro, endIntro);
  }

  function runIntro() {
    if (!root.classList.contains("is-intro") || !intro || typeof introMark.animate !== "function") { endIntro(); return; }

    var skip = function () { endIntro(); };
    intro.addEventListener("click", skip);
    document.addEventListener("keydown", skip, { once: true });

    var appear = introMark.animate([
      { opacity: 0, transform: "translateY(26px) scale(.86)" },
      { opacity: 1, transform: "translateY(0px) scale(1)" }
    ], { duration: 700, easing: "cubic-bezier(.2, .7, .2, 1)", fill: "forwards" });
    shadow.animate([{ opacity: 0, transform: "scaleX(.6)" }, { opacity: 0.5, transform: "scaleX(1)" }], { duration: 700, fill: "forwards" });

    appear.finished.then(function () {
      if (cancelled) return;
      var float = introMark.animate([
        { transform: "translateY(0px)" }, { transform: "translateY(-14px)" }, { transform: "translateY(0px)" }
      ], { duration: 1150, easing: "ease-in-out", iterations: Infinity });
      shadow.animate([
        { transform: "scaleX(1)", opacity: 0.5 }, { transform: "scaleX(.78)", opacity: 0.28 }, { transform: "scaleX(1)", opacity: 0.5 }
      ], { duration: 1150, easing: "ease-in-out", iterations: Infinity });

      // Float at least one full cycle and until the hero photo is ready, then finish the current cycle cleanly
      Promise.all([wait(1150), heroReady()]).then(function () {
        if (cancelled) return;
        var it = float.effect.getComputedTiming().currentIteration || 0;
        float.effect.updateTiming({ iterations: it + 1 });
        return float.finished;
      }).then(fly, fly);
    }, endIntro);
  }

  /* ---------- Mobile menu ---------- */
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("menu-toggle");
  function closeMenu() { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); }
  toggle.addEventListener("click", function () {
    var open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
  document.addEventListener("click", function (e) { if (!e.target.closest(".header")) closeMenu(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  /* ---------- Selected sites: horizontal strip of square cards ---------- */
  var rail = document.getElementById("rail");
  var railPrev = document.querySelector('[data-rail="prev"]');
  var railNext = document.querySelector('[data-rail="next"]');

  function railState() {
    var max = rail.scrollWidth - rail.clientWidth;
    var pos = Math.abs(rail.scrollLeft);
    railPrev.disabled = pos < 4;
    railNext.disabled = pos > max - 4;
  }
  // Distance from a card's start edge to the strip's start line (sign matches scrollBy)
  function edgeDelta(card) {
    var r = rail.getBoundingClientRect();
    var pad = parseFloat(getComputedStyle(rail).paddingInlineStart) || 0;
    var cr = card.getBoundingClientRect();
    return isRTL() ? cr.right - (r.right - pad) : cr.left - (r.left + pad);
  }
  function nearestIndex() {
    var best = 0, bestAbs = Infinity;
    Array.prototype.forEach.call(rail.children, function (c, i) {
      var a = Math.abs(edgeDelta(c));
      if (a < bestAbs) { bestAbs = a; best = i; }
    });
    return best;
  }
  function alignTo(i) {
    var cards = rail.children;
    var d = edgeDelta(cards[Math.max(0, Math.min(cards.length - 1, i))]);
    if (Math.abs(d) > 1) rail.scrollBy({ left: d, behavior: reduced ? "auto" : "smooth" });
  }
  function railGo(dir) { alignTo(nearestIndex() + dir); }
  railPrev.addEventListener("click", function () { railGo(-1); });
  railNext.addEventListener("click", function () { railGo(1); });
  rail.addEventListener("scroll", function () { requestAnimationFrame(railState); }, { passive: true });

  // Drag with the mouse (touch screens already swipe natively)
  var drag = null;
  var dragged = false;
  rail.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag = { x: e.clientX, left: rail.scrollLeft, id: e.pointerId };
    dragged = false;
  });
  rail.addEventListener("pointermove", function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x;
    if (!dragged && Math.abs(dx) > 5) {
      dragged = true;
      rail.classList.add("is-dragging");
      rail.setPointerCapture(drag.id);
    }
    if (dragged) rail.scrollLeft = drag.left - dx;
  });
  function endDrag() {
    if (!drag) return;
    drag = null;
    if (!dragged) return;
    rail.classList.remove("is-dragging");
    alignTo(nearestIndex());
  }
  rail.addEventListener("pointerup", endDrag);
  rail.addEventListener("pointercancel", endDrag);
  rail.addEventListener("click", function (e) {
    if (dragged) { e.preventDefault(); e.stopPropagation(); dragged = false; }
  }, true);

  /* ---------- Photo viewer: opens any project photo that has been added ---------- */
  var lb = document.getElementById("lightbox");
  var lbImg = lb.querySelector("img");
  var photos = [];
  var idx = 0;
  function show(i) {
    idx = (i + photos.length) % photos.length;
    var img = photos[idx];
    lbImg.src = img.getAttribute("data-full") || img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbImg.style.animation = "none";
    void lbImg.offsetWidth;          // restart the fade-in for each photo
    lbImg.style.animation = "";
  }
  function step(dir) { if (photos.length > 1) show(idx + dir); }
  rail.addEventListener("click", function (e) {
    var img = e.target.closest(".project-media img");
    if (!img) return;
    photos = Array.prototype.slice.call(rail.querySelectorAll(".project-media img"));
    show(photos.indexOf(img));
    if (typeof lb.showModal === "function") lb.showModal(); else lb.setAttribute("open", "");
  });
  lb.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-lb]");
    if (btn) {
      var act = btn.getAttribute("data-lb");
      if (act === "close") lb.close(); else step(act === "next" ? 1 : -1);
      return;
    }
    if (e.target === lb) lb.close();
  });
  lb.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") step(isRTL() ? 1 : -1);
    if (e.key === "ArrowRight") step(isRTL() ? -1 : 1);
  });
  var touchX = null;
  lb.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) >= 50) step((dx > 0) === isRTL() ? 1 : -1);
  });

  /* ---------- Start ---------- */
  document.querySelectorAll("[data-lang-toggle]").forEach(function (b) {
    b.addEventListener("click", function () { setLang(root.lang === "en" ? "ar" : "en"); });
  });
  document.getElementById("year").textContent = new Date().getFullYear();
  var saved = null;
  try { saved = localStorage.getItem("bawabat-lang"); } catch (e) { /* storage unavailable */ }
  setLang(saved === "en" ? "en" : "ar");
  update();
  runIntro();
})();

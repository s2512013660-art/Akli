/* =========================================================
   بوابة الإعمار — BAWABAT AL-EMAR
   ========================================================= */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("js");

  var WA = "https://wa.me/9647718000711";
  var KEY = "bawabat-lang";

  /* ---------- English copy (Arabic is read from the HTML) ---------- */
  var EN = {
    "brand": "Bawabat Al-Emar",
    "nav.team": "Team",
    "nav.projects": "Projects",
    "nav.standards": "Standards",
    "nav.contact": "Contact",
    "hero.title": "Built on <em>solid ground</em>.",
    "hero.sub": "General contracting · Engineering execution & supervision · 20 years",
    "hero.cta1": "Projects",
    "hero.cta2": "Contact",
    "stats.years": "years of practice",
    "stats.sectorsV": "Public · Private",
    "stats.sectors": "sectors",
    "stats.hqV": "Karbala",
    "stats.hq": "headquarters",
    "team.title": "How we work",
    "team.t1": "Site engineering",
    "team.d1": "Engineers on site, true to the drawings.",
    "team.t2": "Execution crews",
    "team.d2": "Formwork · Rebar · Concrete · Finishing.",
    "team.t3": "Quality control",
    "team.d3": "Inspection at every stage, through handover.",
    "projects.title": "Delivered works",
    "p1.tag": "Water works",
    "p1.title": "Al-Bobiyat River Lining",
    "p2.tag": "Bridges",
    "p2.title": "Al-Kamaliya Bridge",
    "p3.tag": "Buildings",
    "p3.title": "Concrete frames",
    "std.title": "Foundations first.",
    "std.s1": "Designed mixes",
    "std.s2": "Rebar to specification",
    "std.s3": "Controlled schedules",
    "contact.title": "Start your project.",
    "contact.sub": "From study to handover.",
    "contact.wa": "Chat on WhatsApp",
    "contact.loc": "Karbala, Iraq",
    "footer": "Bawabat Al-Emar General Contracting",
    "_title": "Bawabat Al-Emar General Contracting | Karbala",
    "_wa": "Hello Bawabat Al-Emar, I'd like to discuss a project."
  };
  var AR = { "_title": document.title, "_wa": "مرحباً بوابة الإعمار، أرغب بمناقشة مشروع." };

  var els = document.querySelectorAll("[data-i18n]");
  els.forEach(function (el) { AR[el.getAttribute("data-i18n")] = el.innerHTML; });

  function setLang(lang) {
    var en = lang === "en";
    var dict = en ? EN : AR;
    root.lang = en ? "en" : "ar";
    root.dir = en ? "ltr" : "rtl";
    els.forEach(function (el) {
      var v = dict[el.getAttribute("data-i18n")];
      if (v != null) el.innerHTML = v;
    });
    document.title = dict._title;
    document.querySelectorAll("[data-lang-toggle]").forEach(function (b) {
      b.textContent = en ? "ع" : "EN";
      b.setAttribute("aria-label", en ? "العربية" : "English");
    });
    document.querySelectorAll("[data-wa]").forEach(function (a) {
      a.href = WA + "?text=" + encodeURIComponent(dict._wa);
    });
    try { localStorage.setItem(KEY, en ? "en" : "ar"); } catch (e) { /* storage unavailable */ }
    slider.scrollLeft = 0;
    updateSlider();
  }

  /* ---------- Mobile menu ---------- */
  var nav = document.getElementById("nav");
  var menuBtn = document.getElementById("menu-btn");
  function closeMenu() { nav.classList.remove("is-open"); menuBtn.setAttribute("aria-expanded", "false"); }
  menuBtn.addEventListener("click", function () {
    var open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  document.addEventListener("click", function (e) {
    if (nav.classList.contains("is-open") && !e.target.closest(".site-header")) closeMenu();
  });

  /* ---------- Projects slider ---------- */
  var slider = document.getElementById("slider");
  var sliderNav = document.querySelector(".slider-nav");
  var prevBtn = document.querySelector('[data-slide="prev"]');
  var nextBtn = document.querySelector('[data-slide="next"]');
  var bar = document.getElementById("track-bar");

  function updateSlider() {
    var max = slider.scrollWidth - slider.clientWidth;
    var pos = Math.abs(slider.scrollLeft);
    var ratio = max > 0 ? pos / max : 0;
    var w = Math.min(100, (slider.clientWidth / slider.scrollWidth) * 100);
    sliderNav.classList.toggle("is-static", max < 4);
    bar.parentNode.style.visibility = max < 4 ? "hidden" : "";
    prevBtn.disabled = pos < 4;
    nextBtn.disabled = pos > max - 4;
    bar.style.width = w + "%";
    bar.style.insetInlineStart = ratio * (100 - w) + "%";
  }
  function go(dir) {
    var first = slider.querySelector(".slide");
    var step = first.getBoundingClientRect().width + 16;
    slider.scrollBy({ left: dir * step * (root.dir === "rtl" ? -1 : 1), behavior: "smooth" });
  }
  prevBtn.addEventListener("click", function () { go(-1); });
  nextBtn.addEventListener("click", function () { go(1); });
  slider.addEventListener("scroll", function () { requestAnimationFrame(updateSlider); }, { passive: true });
  window.addEventListener("resize", updateSlider);

  /* ---------- Reveal on scroll ---------- */
  var hasIO = "IntersectionObserver" in window;
  var io = hasIO ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }) : null;

  document.querySelectorAll(".hero-text, .arches, .stats, .pillars").forEach(function (g) {
    g.querySelectorAll(".reveal").forEach(function (el, i) { el.style.setProperty("--d", i * 0.12 + "s"); });
  });
  document.querySelectorAll(".reveal").forEach(function (el) {
    if (io) io.observe(el); else el.classList.add("is-visible");
  });

  /* ---------- Counter ---------- */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var counter = document.querySelector(".counter");
  if (counter && hasIO && !reduced) {
    var target = +counter.getAttribute("data-target");
    counter.textContent = "0";
    var cio = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      cio.disconnect();
      var t0 = performance.now();
      (function tick(now) {
        var p = Math.min((now - t0) / 1600, 1);
        counter.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }, { threshold: 0.6 });
    cio.observe(counter);
  }

  /* ---------- Floating WhatsApp hides over the contact block ---------- */
  var wa = document.querySelector(".wa-float");
  if (hasIO) {
    var onScreen = new Set();
    var wio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) onScreen.add(en.target); else onScreen.delete(en.target); });
      wa.classList.toggle("is-hidden", onScreen.size > 0);
    }, { threshold: 0.15 });
    wio.observe(document.getElementById("contact"));
    wio.observe(document.querySelector(".site-footer"));

    /* active nav link */
    var links = nav.querySelectorAll("a");
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { sio.observe(s); });
  }

  /* ---------- Init ---------- */
  document.querySelectorAll("[data-lang-toggle]").forEach(function (b) {
    b.addEventListener("click", function () { setLang(root.lang === "en" ? "ar" : "en"); });
  });
  document.getElementById("year").textContent = new Date().getFullYear();
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* storage unavailable */ }
  setLang(saved === "en" ? "en" : "ar");
})();

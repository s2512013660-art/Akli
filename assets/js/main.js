/* =========================================================
   بوابة الإعمار – BAWABAT AL-EMAR
   ========================================================= */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("js");

  var WA = "https://wa.me/9647718000711";
  var KEY = "bawabat-lang";

  /* ---------- Translations (Arabic is read from the HTML) ---------- */
  var EN = {
    "brand": "Bawabat Al-Emar",
    "nav.team": "Our team",
    "nav.projects": "Projects",
    "nav.contact": "Contact",
    "hero.kicker": "Bawabat Al-Emar",
    "hero.title": "Building the future<br>on pillars of trust.",
    "hero.sub": "Engineering execution and supervision for nearly twenty years.",
    "hero.cta1": "Our projects",
    "hero.cta2": "Contact",
    "stats.years": "years of experience",
    "stats.sectorsV": "Public & private",
    "stats.sectors": "sectors served",
    "stats.hqV": "Karbala",
    "stats.hq": "headquarters",
    "team.title": "Who builds",
    "team.t1": "Engineers",
    "team.d1": "Leading the work from the heart of the site.",
    "team.t2": "Execution crews",
    "team.d2": "Formwork, rebar, pouring and finishing.",
    "team.t3": "Supervision",
    "team.d3": "Quality and time controlled through handover.",
    "projects.title": "Projects we delivered",
    "p1.tag": "Water works",
    "p1.title": "Al-Bobiyat River Lining",
    "p2.tag": "Bridges & roads",
    "p2.title": "Al-Kamaliya Bridge",
    "p3.tag": "Buildings",
    "p3.title": "Multi-storey concrete frames",
    "quote.title": "Quality is built from the foundations.",
    "quote.text": "Engineered concrete mixes and reinforcing steel to specification.",
    "contact.title": "Your next project?",
    "contact.sub": "Let’s discuss it as engineers and deliver it as professionals.",
    "contact.wa": "Message us on WhatsApp",
    "contact.loc": "Karbala, Iraq",
    "footer": "Bawabat Al-Emar General Contracting Co. All rights reserved.",
    "_title": "Bawabat Al-Emar General Contracting | Karbala, Iraq",
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
    try { localStorage.setItem(KEY, en ? "en" : "ar"); } catch (e) { /* ignore */ }
    if (slider) { slider.scrollLeft = 0; updateSlider(); }
  }
  document.querySelectorAll("[data-lang-toggle]").forEach(function (b) {
    b.addEventListener("click", function () { setLang(root.lang === "en" ? "ar" : "en"); });
  });

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

  function step() {
    var s = slider.querySelector(".slide");
    return s ? s.getBoundingClientRect().width + 16 : 300;
  }
  function updateSlider() {
    var max = slider.scrollWidth - slider.clientWidth;
    var pos = Math.abs(slider.scrollLeft);
    sliderNav.classList.toggle("is-static", max < 4);
    prevBtn.disabled = pos < 4;
    nextBtn.disabled = pos > max - 4;
  }
  function go(dir) {
    var rtl = root.dir === "rtl";
    slider.scrollBy({ left: dir * step() * (rtl ? -1 : 1), behavior: "smooth" });
  }
  prevBtn.addEventListener("click", function () { go(-1); });
  nextBtn.addEventListener("click", function () { go(1); });
  slider.addEventListener("scroll", function () { requestAnimationFrame(updateSlider); }, { passive: true });
  window.addEventListener("resize", updateSlider);

  /* ---------- Reveal on scroll ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }) : null;

  document.querySelectorAll(".arches, .stats, .pillars, .hero-text").forEach(function (g) {
    g.querySelectorAll(".reveal").forEach(function (el, i) { el.style.setProperty("--d", i * 0.12 + "s"); });
  });
  document.querySelectorAll(".reveal").forEach(function (el) {
    if (io) io.observe(el); else el.classList.add("is-visible");
  });

  /* ---------- Counter ---------- */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var counter = document.querySelector(".counter");
  if (counter && io && !reduced) {
    var target = +counter.getAttribute("data-target");
    counter.textContent = "0";
    var cio = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      cio.disconnect();
      var t0 = null;
      (function tick(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / 1600, 1);
        counter.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      })(performance.now());
    }, { threshold: 0.6 });
    cio.observe(counter);
  }

  /* ---------- Floating WhatsApp: hide when the contact block is on screen ---------- */
  var wa = document.querySelector(".wa-float");
  if (io && wa) {
    var visible = new Set();
    var wio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.isIntersecting ? visible.add(en.target) : visible.delete(en.target); });
      wa.classList.toggle("is-hidden", visible.size > 0);
    }, { threshold: 0.15 });
    wio.observe(document.getElementById("contact"));
    wio.observe(document.querySelector(".site-footer"));
  }

  /* ---------- Active nav link ---------- */
  if (io) {
    var links = nav.querySelectorAll("a");
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { sio.observe(s); });
  }

  /* ---------- Init ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* ignore */ }
  setLang(saved === "en" ? "en" : "ar");
})();

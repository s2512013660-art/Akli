/* Bawabat Al-Emar General Contracting */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("js");

  var WA = "https://wa.me/9647718000711";
  var KEY = "bawabat-lang";

  /* English copy. Arabic is read from the page itself. */
  var EN = {
    "skip": "Skip to content",
    "brand": "Bawabat Al-Emar",
    "brand.sub": "GENERAL CONTRACTING",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.projects": "Projects",
    "nav.contact": "Contact us",
    "hero.title": "Twenty years of delivering buildings and infrastructure.",
    "hero.text": "We execute projects from foundations to final handover, for public and private sector clients.",
    "hero.cta1": "Our projects",
    "hero.cta2": "Contact us",
    "about.title": "About the company",
    "about.lead": "Bawabat Al-Emar is a general contracting company based in Karbala, delivering building and infrastructure projects for more than twenty years.",
    "about.text": "The company operates through direct engineering management on site, specialised execution crews, and technical supervision covering every stage of the project through final handover.",
    "fig.years": "years of experience",
    "fig.sectorsV": "Public & private",
    "fig.sectors": "sectors served",
    "fig.hqV": "Karbala",
    "fig.hq": "headquarters",
    "services.title": "Fields of work",
    "s1.title": "Structural works",
    "s1.text": "Foundations and reinforced-concrete frames, including formwork, reinforcement and concrete placement.",
    "s2.title": "Infrastructure",
    "s2.text": "Bridges, and lining of rivers and water channels.",
    "s3.title": "Finishing and handover",
    "s3.text": "Final finishing works, and handover of the project ready for operation.",
    "approach.title": "Delivery approach",
    "a1.title": "Engineering management",
    "a1.text": "Each project is managed directly on site by specialist engineers, ensuring full compliance with drawings and standard specifications.",
    "a2.title": "Execution crews",
    "a2.text": "Specialised crews in formwork carpentry, reinforcement, concrete placement and finishing works.",
    "a3.title": "Quality control",
    "a3.text": "Technical follow-up at every stage of execution, with quality and schedules controlled through to handover.",
    "quality.title": "Quality begins at the foundations.",
    "quality.text": "We regard foundations as the element that determines a structure's lifespan and safety. Every project we deliver therefore relies on engineered mix proportions and reinforcing steel that meets engineering specifications.",
    "projects.title": "Projects",
    "projects.text": "Selected infrastructure projects delivered by the company.",
    "p1.title": "Al-Bobiyat River Lining",
    "p1.type": "Infrastructure — Water works",
    "p2.title": "Al-Kamaliya Bridge",
    "p2.type": "Infrastructure — Bridges",
    "contact.title": "Contact us",
    "contact.text": "To discuss a project or request a technical and financial proposal, contact the company management directly.",
    "contact.call": "Call now",
    "contact.wa": "Message on WhatsApp",
    "contact.phone": "Phone / WhatsApp",
    "contact.ig": "Instagram",
    "contact.address": "Address",
    "contact.addressV": "Karbala, Iraq",
    "footer.text": "General contracting — buildings and infrastructure. Karbala, Iraq.",
    "footer.rights": "Bawabat Al-Emar General Contracting Co. All rights reserved.",
    "_title": "Bawabat Al-Emar General Contracting",
    "_wa": "Hello, I would like to discuss a project with Bawabat Al-Emar."
  };
  var AR = { "_title": document.title, "_wa": "السلام عليكم، أرغب بمناقشة مشروع مع شركة بوابة الإعمار." };

  var nodes = document.querySelectorAll("[data-i18n]");
  nodes.forEach(function (el) { AR[el.getAttribute("data-i18n")] = el.innerHTML; });

  function setLang(lang) {
    var en = lang === "en";
    var dict = en ? EN : AR;
    root.lang = en ? "en" : "ar";
    root.dir = en ? "ltr" : "rtl";
    nodes.forEach(function (el) {
      var v = dict[el.getAttribute("data-i18n")];
      if (v != null) el.innerHTML = v;
    });
    document.title = dict._title;
    document.querySelectorAll("[data-lang-toggle]").forEach(function (b) {
      b.textContent = en ? "العربية" : "English";
      b.setAttribute("lang", en ? "ar" : "en");
    });
    document.querySelectorAll("[data-wa]").forEach(function (a) {
      a.href = WA + "?text=" + encodeURIComponent(dict._wa);
    });
    try { localStorage.setItem(KEY, en ? "en" : "ar"); } catch (e) { /* storage unavailable */ }
  }
  document.querySelectorAll("[data-lang-toggle]").forEach(function (b) {
    b.addEventListener("click", function () { setLang(root.lang === "en" ? "ar" : "en"); });
  });

  /* Mobile menu */
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("menu-toggle");
  function closeMenu() { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); }
  toggle.addEventListener("click", function () {
    var open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  document.addEventListener("click", function (e) { if (!e.target.closest(".header")) closeMenu(); });

  /* Header shadow */
  var header = document.getElementById("header");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if ("IntersectionObserver" in window) {
    /* Reveal */
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

    /* Active nav link */
    var links = nav.querySelectorAll("a");
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { so.observe(s); });

    /* Floating WhatsApp steps aside over the contact section and footer, */
    /* and stays hidden while the hero (which has its own buttons) fills the screen */
    var wa = document.querySelector(".wa-float");
    var hero = document.querySelector(".hero");
    var seen = new Set();
    var updateWa = function () {
      var inHero = window.scrollY < hero.offsetHeight * 0.6;
      wa.classList.toggle("is-hidden", inHero || seen.size > 0);
    };
    var wo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) seen.add(en.target); else seen.delete(en.target); });
      updateWa();
    }, { threshold: 0.1 });
    window.addEventListener("scroll", updateWa, { passive: true });
    updateWa();
    wo.observe(document.getElementById("contact"));
    wo.observe(document.querySelector(".footer"));
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
  }

  document.getElementById("year").textContent = new Date().getFullYear();
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* storage unavailable */ }
  setLang(saved === "en" ? "en" : "ar");
})();

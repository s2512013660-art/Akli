/* =========================================================
   بوابة الإعمار – BAWABAT AL-EMAR
   ========================================================= */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var WA_NUMBER = "9647718000711";
  var STORAGE_KEY = "bawabat-lang";

  /* -------------------------------------------------------
     PROJECTS
     لإضافة مشروع جديد: أضف عنصراً لهذه المصفوفة وضع صورته في
     assets/img/projects/ ثم غيّر قيمة image.
     category: water | bridges | buildings
     ------------------------------------------------------- */
  var PROJECTS = [
    {
      id: "bobiyat-river",
      category: "water",
      featured: true,
      image: "assets/img/projects/river-lining.svg",
      ar: {
        title: "تغليف نهر البوبيات",
        tag: "أعمال مائية",
        summary: "تغليف خرساني لمجرى نهر البوبيات لحماية الأكتاف من التآكل وتحسين انسيابية الجريان وتقليل الضائعات المائية.",
        sector: "مشاريع البنى التحتية",
        type: "تغليف خرساني للمجاري المائية",
        status: "منجز",
        scope: [
          "أعمال الحفر والتسوية وتهيئة مقطع المجرى وفق المناسيب التصميمية.",
          "حدل التربة وفرش طبقة الأساس وفحص الكثافة الحقلية.",
          "صب البلاطات الخرسانية للقاع والأكتاف مع فواصل التمدد والتقلص.",
          "معالجة الخرسانة والفحص المختبري لعينات الصب، وصولاً للاستلام النهائي."
        ]
      },
      en: {
        title: "Al-Bobiyat River Lining",
        tag: "Water works",
        summary: "Concrete lining of the Al-Bobiyat river channel to protect the banks from erosion, improve flow and reduce water losses.",
        sector: "Infrastructure",
        type: "Concrete channel lining",
        status: "Completed",
        scope: [
          "Excavation, grading and shaping of the channel section to design levels.",
          "Soil compaction, sub-base placement and field density testing.",
          "Casting of bed and side-slope concrete slabs with expansion and contraction joints.",
          "Concrete curing and laboratory testing of pour samples through to final handover."
        ]
      }
    },
    {
      id: "kamaliya-bridge",
      category: "bridges",
      image: "assets/img/projects/kamaliya-bridge.svg",
      ar: {
        title: "تنفيذ جسر الكمالية",
        tag: "جسور وطرق",
        summary: "تنفيذ متكامل لجسر خرساني مسلح، من الأساسات والركائز حتى الطبقات النهائية للسطح.",
        sector: "مشاريع البنى التحتية",
        type: "جسر خرساني مسلح",
        status: "منجز",
        scope: [
          "تنفيذ الأساسات والقواعد الخرسانية للركائز والمساند الطرفية.",
          "نجارة القوالب وحدادة التسليح للأعمدة والعتبات بدقة عالية.",
          "صب العتبات والسطح الخرساني ومتابعة الجودة في كل مرحلة.",
          "أعمال المقتربات والأرصفة والسياج والتشطيبات النهائية."
        ]
      },
      en: {
        title: "Al-Kamaliya Bridge",
        tag: "Bridges & roads",
        summary: "Full execution of a reinforced-concrete bridge, from foundations and piers to the final deck layers.",
        sector: "Infrastructure",
        type: "Reinforced-concrete bridge",
        status: "Completed",
        scope: [
          "Foundations and concrete footings for piers and abutments.",
          "Precision formwork and rebar fixing for columns and cross-heads.",
          "Casting of girders and deck slab with quality control at every stage.",
          "Approaches, sidewalks, parapets and final finishing works."
        ]
      }
    }
  ];

  /* -------------------------------------------------------
     English dictionary (Arabic is read from the HTML itself)
     ------------------------------------------------------- */
  var EN = {
    "skip": "Skip to content",
    "brand.name": "Bawabat Al-Emar",
    "nav.teams": "Our Teams",
    "nav.projects": "Projects",
    "nav.philosophy": "Philosophy",
    "nav.contact": "Contact",
    "nav.cta": "Start a project",
    "hero.eyebrow": "General Contracting · Karbala",
    "hero.title": "Building the future on pillars of <span class=\"accent\">trust</span> — two decades of engineering and contracting expertise.",
    "hero.sub": "From complex concrete foundations to turnkey delivery, we turn engineering visions into tangible reality with uncompromising quality standards.",
    "hero.cta1": "Explore our projects",
    "hero.cta2": "Start your project",
    "stats.years": "years of construction & execution excellence",
    "stats.projectsTitle": "Landmark projects",
    "stats.projects": "across the public and private sectors",
    "stats.hqTitle": "Headquarters",
    "stats.hq": "Karbala, Iraq",
    "teams.eyebrow": "Who leads the work?",
    "teams.title": "Our Engineering Pillars",
    "teams.lead": "Three integrated pillars working as one system — from on-site planning to handing over the keys.",
    "teams.c1.title": "Field Engineering Leadership",
    "teams.c1.text": "Specialist engineers lead the work directly from the heart of the site, ensuring full compliance with drawings and standard specifications.",
    "teams.c2.title": "Specialised Execution Crews",
    "teams.c2.text": "Skilled professional crews, expertly organised, covering:",
    "teams.c2.t1": "Formwork carpentry",
    "teams.c2.t2": "High-precision rebar works",
    "teams.c2.t3": "Engineered concrete pouring",
    "teams.c2.t4": "Final finishing",
    "teams.c3.title": "Rigorous Quality & Supervision",
    "teams.c3.text": "A precise monitoring system that sets the pace of quality and time for every phase, all the way to turnkey handover.",
    "projects.eyebrow": "Portfolio",
    "projects.title": "Featured Projects",
    "projects.lead": "A selection of works we delivered with full engineering responsibility, from study to handover.",
    "filters.all": "All",
    "filters.water": "Water works",
    "filters.bridges": "Bridges & roads",
    "filters.buildings": "Buildings",
    "philosophy.eyebrow": "Our construction philosophy",
    "philosophy.title": "Real quality is built from the foundations.",
    "philosophy.text": "We never treat foundations as a hidden component — we see them as the soul of the structure and the guarantee of its durability for decades. We rely on carefully designed mix ratios and reinforcing steel that meets precise engineering specifications.",
    "philosophy.p1": "Engineered, lab-tested concrete mixes",
    "philosophy.p2": "Reinforcing steel to specification",
    "philosophy.p3": "Strict commitment to schedules",
    "contact.eyebrow": "Contact us",
    "contact.title": "Have an upcoming project? Let’s discuss it as engineers and deliver it as professionals.",
    "contact.whatsapp": "Message us on WhatsApp",
    "contact.form": "Send project details",
    "contact.phoneLabel": "Phone · WhatsApp",
    "contact.igLabel": "Instagram",
    "contact.locLabel": "Location",
    "contact.loc": "Karbala, Iraq",
    "footer.name": "Bawabat Al-Emar General Contracting Co.",
    "footer.rights": "All rights reserved to “Bawabat Al-Emar General Contracting Company”.",
    "wa.tip": "Instant chat",
    "form.title": "Start your project with us",
    "form.lead": "Fill in the details and you’ll be redirected to WhatsApp with a ready-made message for our engineering team.",
    "form.name": "Full name",
    "form.phone": "Phone number",
    "form.type": "Project type",
    "form.t1": "Residential building",
    "form.t2": "Commercial building",
    "form.t3": "Bridges & roads",
    "form.t4": "Water works & river lining",
    "form.t5": "Government project",
    "form.t6": "Other",
    "form.details": "Project details",
    "form.error": "Please enter your name and phone number.",
    "form.submit": "Send via WhatsApp",
    "form.call": "Call directly",
    // runtime-only strings
    "ui.details": "Project details",
    "ui.addTitle": "More projects coming soon",
    "ui.addText": "Our portfolio keeps growing — ask us about our full record of works.",
    "ui.sector": "Sector",
    "ui.type": "Project type",
    "ui.status": "Status",
    "ui.scope": "Scope of work",
    "ui.ask": "Ask about a similar project",
    "ui.close": "Close",
    "ui.menu": "Menu",
    "ui.langLabel": "التبديل إلى العربية",
    "ui.waMsg": "Hello Bawabat Al-Emar, I'd like to discuss a project.",
    "ui.formMsg": "Hello Bawabat Al-Emar 👷\nName: {name}\nPhone: {phone}\nProject type: {type}\nDetails: {details}",
    "ui.similar": "Hello, I'd like to discuss a project similar to: {title}",
    "meta.title": "Bawabat Al-Emar General Contracting | Karbala, Iraq"
  };

  var AR_RUNTIME = {
    "ui.details": "تفاصيل المشروع",
    "ui.addTitle": "المزيد من المشاريع قريباً",
    "ui.addText": "سجل أعمالنا في توسع مستمر — اسألنا عن سجلنا الكامل من المشاريع المنفذة.",
    "ui.sector": "القطاع",
    "ui.type": "نوع المشروع",
    "ui.status": "الحالة",
    "ui.scope": "نطاق الأعمال",
    "ui.ask": "استفسر عن مشروع مماثل",
    "ui.close": "إغلاق",
    "ui.menu": "القائمة",
    "ui.langLabel": "Switch to English",
    "ui.waMsg": "مرحباً بوابة الإعمار، أرغب بمناقشة مشروع.",
    "ui.formMsg": "مرحباً بوابة الإعمار 👷\nالاسم: {name}\nالهاتف: {phone}\nنوع المشروع: {type}\nالتفاصيل: {details}",
    "ui.similar": "مرحباً، أرغب بمناقشة مشروع مشابه لـ: {title}",
    "meta.title": document.title
  };

  var lang = "ar";
  var AR = {};

  function t(key) {
    var dict = lang === "en" ? EN : Object.assign({}, AR, AR_RUNTIME);
    return dict[key] != null ? dict[key] : key;
  }
  function fill(str, data) {
    return str.replace(/\{(\w+)\}/g, function (_, k) { return data[k] || "-"; });
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function waUrl(text) { return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text); }

  /* ---------------- Language ---------------- */
  var i18nEls = document.querySelectorAll("[data-i18n]");
  i18nEls.forEach(function (el) { AR[el.getAttribute("data-i18n")] = el.innerHTML; });

  function applyLang(next) {
    lang = next === "en" ? "en" : "ar";
    var root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "en" ? "ltr" : "rtl";
    i18nEls.forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var val = lang === "en" ? EN[key] : AR[key];
      if (val != null) el.innerHTML = val;
    });
    document.title = t("meta.title");
    var toggle = document.getElementById("lang-toggle");
    toggle.textContent = lang === "en" ? "ع" : "EN";
    toggle.setAttribute("aria-label", t("ui.langLabel"));
    document.querySelectorAll("[data-close]").forEach(function (b) { b.setAttribute("aria-label", t("ui.close")); });
    document.getElementById("nav-toggle").setAttribute("aria-label", t("ui.menu"));
    document.querySelectorAll("[data-wa-link]").forEach(function (a) { a.href = waUrl(t("ui.waMsg")); });
    renderProjects();
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
  }

  document.getElementById("lang-toggle").addEventListener("click", function () {
    applyLang(lang === "ar" ? "en" : "ar");
  });

  /* ---------------- Projects ---------------- */
  var grid = document.getElementById("project-grid");
  var currentFilter = "all";
  var pinIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>';
  var arrowIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  function renderProjects() {
    var html = PROJECTS.map(function (p, i) {
      var d = p[lang];
      return (
        '<button type="button" class="project-card' + (p.featured ? " featured" : "") + ' reveal" data-cat="' + p.category + '" data-project="' + i + '" style="--d:' + (i * 0.08) + 's">' +
          '<div class="project-media">' +
            '<img src="' + esc(p.image) + '" alt="' + esc(d.title) + '" loading="lazy" decoding="async">' +
            '<span class="project-tag">' + esc(d.tag) + "</span>" +
            (d.location ? '<span class="project-loc">' + pinIcon + esc(d.location) + "</span>" : "") +
          "</div>" +
          '<div class="project-body">' +
            "<h3>" + esc(d.title) + "</h3>" +
            "<p>" + esc(d.summary) + "</p>" +
            '<span class="project-more">' + esc(t("ui.details")) + arrowIcon + "</span>" +
          "</div>" +
        "</button>"
      );
    }).join("");

    html +=
      '<button type="button" class="project-card placeholder reveal" data-cat="all" data-open-contact>' +
        '<div><span class="placeholder-icon" aria-hidden="true">+</span>' +
        "<h3>" + esc(t("ui.addTitle")) + "</h3>" +
        "<p>" + esc(t("ui.addText")) + "</p></div>" +
      "</button>";

    grid.innerHTML = html;
    applyFilter(currentFilter);
    grid.querySelectorAll(".reveal").forEach(observeReveal);
  }

  function applyFilter(f) {
    currentFilter = f;
    grid.querySelectorAll(".project-card").forEach(function (card) {
      var cat = card.getAttribute("data-cat");
      card.classList.toggle("is-hidden", !(f === "all" || cat === f || cat === "all"));
    });
  }

  document.querySelectorAll(".filter").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".filter").forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
      });
      applyFilter(btn.getAttribute("data-filter"));
    });
  });

  grid.addEventListener("click", function (e) {
    var card = e.target.closest("[data-project]");
    if (card) openProject(PROJECTS[+card.getAttribute("data-project")]);
  });

  var projectModal = document.getElementById("project-modal");
  function openProject(p) {
    var d = p[lang];
    document.getElementById("project-modal-content").innerHTML =
      '<div class="pm-media"><img src="' + esc(p.image) + '" alt="' + esc(d.title) + '"></div>' +
      '<p class="eyebrow">' + esc(d.tag) + "</p>" +
      '<h2 id="project-modal-title">' + esc(d.title) + "</h2>" +
      '<p class="muted">' + esc(d.summary) + "</p>" +
      '<div class="pm-meta">' +
        "<div><small>" + esc(t("ui.sector")) + "</small><strong>" + esc(d.sector) + "</strong></div>" +
        "<div><small>" + esc(t("ui.type")) + "</small><strong>" + esc(d.type) + "</strong></div>" +
        "<div><small>" + esc(t("ui.status")) + "</small><strong>" + esc(d.status) + "</strong></div>" +
      "</div>" +
      "<h3>" + esc(t("ui.scope")) + "</h3>" +
      '<ul class="pm-scope">' + d.scope.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul>" +
      '<div class="modal-actions" style="margin-top:1.6rem">' +
        '<a class="btn btn-primary" target="_blank" rel="noopener" href="' + esc(waUrl(fill(t("ui.similar"), { title: d.title }))) + '">' + esc(t("ui.ask")) + "</a>" +
      "</div>";
    openModal(projectModal);
  }

  /* ---------------- Modals ---------------- */
  var lastFocus = null;
  function openModal(m) {
    lastFocus = document.activeElement;
    if (typeof m.showModal === "function") m.showModal(); else m.setAttribute("open", "");
    document.body.style.overflow = "hidden";
  }
  function closeModal(m) {
    if (typeof m.close === "function") m.close(); else m.removeAttribute("open");
  }
  document.querySelectorAll("dialog.modal").forEach(function (m) {
    m.addEventListener("close", function () {
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    });
    m.addEventListener("click", function (e) {
      if (e.target === m || e.target.closest("[data-close]")) closeModal(m);
    });
  });

  var contactModal = document.getElementById("contact-modal");
  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-open-contact]");
    if (!trigger) return;
    e.preventDefault();
    closeNav();
    openModal(contactModal);
    setTimeout(function () { contactModal.querySelector("input").focus(); }, 60);
  });

  var form = document.getElementById("contact-form");
  var formError = document.getElementById("form-error");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      type: form.type.options[form.type.selectedIndex].text,
      details: form.details.value.trim()
    };
    var ok = true;
    ["name", "phone"].forEach(function (k) {
      var bad = !data[k];
      form[k].setAttribute("aria-invalid", bad ? "true" : "false");
      if (bad) ok = false;
    });
    formError.hidden = ok;
    if (!ok) { (form.name.value.trim() ? form.phone : form.name).focus(); return; }
    window.open(waUrl(fill(t("ui.formMsg"), data)), "_blank", "noopener");
    form.reset();
    closeModal(contactModal);
  });

  /* ---------------- Header / nav ---------------- */
  var header = document.querySelector(".site-header");
  var nav = document.getElementById("main-nav");
  var navToggle = document.getElementById("nav-toggle");
  var toTop = document.getElementById("to-top");

  function closeNav() {
    nav.classList.remove("is-open");
    header.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
  navToggle.addEventListener("click", function () {
    var open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    header.classList.toggle("nav-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) closeNav(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });

  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 30);
    toTop.classList.toggle("is-visible", y > 700);
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();
  toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* Active section highlighting */
  var navLinks = nav.querySelectorAll("a[href^='#']");
  if ("IntersectionObserver" in window) {
    var sectionObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { sectionObs.observe(s); });
  }

  /* ---------------- Scroll reveal ---------------- */
  var revealObs = "IntersectionObserver" in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-visible"); revealObs.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" })
    : null;

  function observeReveal(el) {
    if (revealObs) revealObs.observe(el); else el.classList.add("is-visible");
  }

  // stagger siblings inside grids
  document.querySelectorAll(".team-cards, .stats").forEach(function (group) {
    group.querySelectorAll(".reveal").forEach(function (el, i) { el.style.setProperty("--d", (i * 0.12) + "s"); });
  });
  document.querySelectorAll(".hero-content .reveal").forEach(function (el, i) { el.style.setProperty("--d", (i * 0.1) + "s"); });

  /* ---------------- Counters ---------------- */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function runCounter(el) {
    var target = +el.getAttribute("data-target");
    if (reduced) { el.textContent = target; return; }
    var start = null, dur = 1800;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll(".counter");
  if ("IntersectionObserver" in window) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCounter(en.target); cObs.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cObs.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute("data-target"); });
  }

  /* ---------------- Init ---------------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* ignore */ }
  applyLang(saved || "ar");

  document.querySelectorAll(".reveal").forEach(observeReveal);
  document.querySelectorAll(".foundation-diagram").forEach(observeReveal);
})();

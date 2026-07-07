(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("rv-theme", t); } catch (e) {}
  }
  (function initTheme() {
    var saved;
    try { saved = localStorage.getItem("rv-theme"); } catch (e) {}
    if (saved) { root.setAttribute("data-theme", saved); return; }
    var prefDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", prefDark ? "dark" : "light");
  })();
  var themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) themeBtn.addEventListener("click", function () {
    applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById("menu-btn");
  var mobileMenu = document.getElementById("mobile-menu");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    mobileMenu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { mobileMenu.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = [].slice.call(document.querySelectorAll(".reveal"));
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Hero parallax ---------- */
  var panel = document.getElementById("hero-panel");
  var heroSection = document.getElementById("home");
  if (panel && heroSection && fine && !reduce) {
    heroSection.addEventListener("mousemove", function (e) {
      var r = heroSection.getBoundingClientRect();
      var dx = (e.clientX - r.left) / r.width - 0.5;
      var dy = (e.clientY - r.top) / r.height - 0.5;
      panel.style.transform = "translate3d(" + (dx * -14) + "px," + (dy * -12) + "px,0)";
    });
    heroSection.addEventListener("mouseleave", function () { panel.style.transform = ""; });
  }

  /* ---------- Custom cursor (subtle) ---------- */
  (function cursor() {
    if (!fine || reduce) return;
    var hudEl = document.getElementById("hud");
    if (!hudEl) return;
    var dot = hudEl.querySelector(".dotc"), ring = hudEl.querySelector(".ring");
    document.body.classList.add("cursor-on");
    hudEl.style.display = "block";
    var x = window.innerWidth / 2, y = window.innerHeight / 2, rx = x, ry = y, hot = false;
    document.addEventListener("mousemove", function (e) {
      x = e.clientX; y = e.clientY;
      dot.style.left = x + "px"; dot.style.top = y + "px";
      var t = e.target;
      var nowHot = !!(t && t.closest && t.closest("a, button, .chip, .spec, .project, .cert, .tline"));
      if (nowHot !== hot) { hot = nowHot; hudEl.classList.toggle("hot", hot); }
    });
    document.addEventListener("mouseleave", function () { hudEl.style.opacity = "0"; });
    document.addEventListener("mouseenter", function () { hudEl.style.opacity = "1"; });
    (function loop() {
      rx += (x - rx) * 0.2; ry += (y - ry) * 0.2;
      ring.style.left = rx + "px"; ring.style.top = ry + "px";
      requestAnimationFrame(loop);
    })();
  })();
})();

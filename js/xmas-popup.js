/* ============================================================
   CHRISTMAS POPUP - shows once per visit on every page except
   christmas.html, and stops after LAST_DAY. To turn it off early,
   set LAST_DAY to a past date (or remove this script's <script> tag).
   For testing, add ?xmaspop to any page address to see it again.
   ============================================================ */
(function () {
  "use strict";

  var LAST_DAY = new Date(2026, 11, 27, 23, 59); // Dec 27, 2026 (months count from 0)
  var KEY = "mvXmasPop";
  var force = /[?&]xmaspop/.test(location.search);

  if (!force) {
    if (new Date() > LAST_DAY) return;
    try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}
  }
  if (/christmas\.html$/.test(location.pathname)) return;

  function build() {
    var wrap = document.createElement("div");
    wrap.className = "xmas-pop";
    wrap.innerHTML =
      '<div class="xmas-pop-card" role="dialog" aria-modal="true" aria-labelledby="xmasPopTitle">' +
        '<button type="button" class="xmas-pop-x" aria-label="Close">&#10005;</button>' +
        '<img class="xmas-pop-art" src="img/xmas-invitation.webp" alt="The Invitation" width="1536" height="768">' +
        '<h2 id="xmasPopTitle">Christmas at Movement</h2>' +
        '<p class="xmas-pop-times"><b>Dec 23</b> 7pm <span aria-hidden="true">&#10022;</span> <b>Dec 24</b> 1pm &middot; 3pm &middot; 5pm</p>' +
        '<p>Invite your family, friends and neighbours for an unforgettable Christmas Eve Experience!</p>' +
        '<div class="xmas-pop-btns">' +
          '<a class="pill xmas-pop-go" href="christmas.html">Learn more</a>' +
          '<button type="button" class="pill pill--ghost xmas-pop-later">Maybe later</button>' +
        "</div>" +
      "</div>";
    return wrap;
  }

  function show() {
    try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
    var before = document.activeElement;
    var pop = build();
    document.body.appendChild(pop);
    requestAnimationFrame(function () { pop.classList.add("is-open"); });

    var card = pop.querySelector(".xmas-pop-card");
    card.setAttribute("tabindex", "-1");
    card.focus({ preventScroll: true });

    function close() {
      pop.classList.remove("is-open");
      document.removeEventListener("keydown", onKey);
      setTimeout(function () { pop.remove(); }, 300);
      if (before && before.focus) before.focus({ preventScroll: true });
    }
    function onKey(e) {
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab") return;
      // keep focus inside the popup
      var f = card.querySelectorAll("a, button");
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKey);
    pop.querySelector(".xmas-pop-x").addEventListener("click", close);
    pop.querySelector(".xmas-pop-later").addEventListener("click", close);
    pop.addEventListener("click", function (e) { if (e.target === pop) close(); });
  }

  // wait for the opening "M" animation when it plays
  var delay = document.documentElement.classList.contains("has-intro") ? 4200 : 1200;
  function start() { setTimeout(show, delay); }
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start);
})();

/* ============================================================
   EVENT PROMOS - the popup and the "Revival Night" nav link.
   - Until Sunday, Nov 29 (midnight): Revival Night popup.
   - From Monday, Nov 30: Christmas popup, until Dec 27.
     The Revival Night nav link is removed on Monday too
     (and revival.html sends visitors to christmas.html).
   Each popup shows once per visit and not on its own page.
   Test: add ?promo=revival or ?promo=christmas to any address.
   ============================================================ */
(function () {
  "use strict";

  var REVIVAL_OVER = Date.parse("2026-11-30T00:00:00-05:00");
  var CHRISTMAS_OVER = Date.parse("2026-12-28T00:00:00-05:00");
  var now = Date.now();

  // Monday onwards: take the Revival Night link out of the nav
  if (now >= REVIVAL_OVER) {
    document.querySelectorAll(".nav-rev").forEach(function (a) { a.remove(); });
  }

  var countdown =
    '<span><b data-cd="d">0</b><small>days</small></span>' +
    '<span><b data-cd="h">00</b><small>hrs</small></span>' +
    '<span><b data-cd="m">00</b><small>mins</small></span>' +
    '<span><b data-cd="s">00</b><small>secs</small></span>';

  var PROMOS = {
    revival: {
      page: "revival.html",
      cls: "promo-pop--revival",
      html:
        '<img class="promo-wordmark" src="img/revival-wordmark.png" alt="Movement Revival Nights" width="995" height="244">' +
        '<h2 class="promo-title" id="promoTitle">Revival Night</h2>' +
        '<p class="promo-when"><b>Sunday, Nov 29</b> &middot; 6pm</p>' +
        '<p>Guest speaker <b>Sam Picken</b>, Lead Pastor at C3 Assembly.</p>' +
        '<div class="countdown promo-countdown" data-countdown="2026-11-29T18:00:00-05:00" data-live-until="2026-11-29T21:00:00-05:00" data-live="Happening now. Come on in!" data-done="Thanks for joining us!" role="timer" aria-label="Time until Revival Night">' + countdown + "</div>"
    },
    christmas: {
      page: "christmas.html",
      cls: "promo-pop--christmas",
      html:
        '<img class="promo-art" src="img/xmas-invitation.webp" alt="The Invitation" width="1536" height="768">' +
        '<h2 class="promo-title" id="promoTitle">Christmas at Movement</h2>' +
        '<p class="promo-when"><b>Dec 23</b> 7pm <span aria-hidden="true">&#10022;</span> <b>Dec 24</b> 1pm &middot; 3pm &middot; 5pm</p>' +
        '<div class="countdown promo-countdown" data-countdown="2026-12-23T19:00:00-05:00" data-live-until="2026-12-24T19:00:00-05:00" data-live="Christmas Eve Experiences are happening now!" data-done="Merry Christmas!" role="timer" aria-label="Time until the first Christmas Eve Experience">' + countdown + "</div>" +
        "<p>Invite your family, friends and neighbours for an unforgettable Christmas Eve Experience!</p>"
    }
  };

  // which popup?
  var forced = (location.search.match(/[?&]promo=(\w+)/) || [])[1];
  var key = forced && PROMOS[forced] ? forced
          : now < REVIVAL_OVER ? "revival"
          : now < CHRISTMAS_OVER ? "christmas" : null;
  if (!key) return;
  var promo = PROMOS[key];
  if (!forced) {
    if (location.pathname.indexOf(promo.page) !== -1) return;
    try { if (sessionStorage.getItem("mvPromo-" + key)) return; } catch (e) {}
  }

  function show() {
    try { sessionStorage.setItem("mvPromo-" + key, "1"); } catch (e) {}
    var before = document.activeElement;
    var pop = document.createElement("div");
    pop.className = "promo-pop " + promo.cls;
    pop.innerHTML =
      '<div class="promo-card" role="dialog" aria-modal="true" aria-labelledby="promoTitle" tabindex="-1">' +
        '<button type="button" class="promo-x" aria-label="Close">&#10005;</button>' +
        promo.html +
        '<div class="promo-btns">' +
          '<a class="pill promo-go" href="' + promo.page + '">Learn more</a>' +
          '<button type="button" class="pill pill--ghost promo-later">Maybe later</button>' +
        "</div>" +
      "</div>";
    document.body.appendChild(pop);
    var card = pop.querySelector(".promo-card");
    if (window.mvCountdown) window.mvCountdown(pop.querySelector("[data-countdown]"));
    requestAnimationFrame(function () { pop.classList.add("is-open"); });
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
      var f = card.querySelectorAll("a, button");
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === card)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKey);
    pop.querySelector(".promo-x").addEventListener("click", close);
    pop.querySelector(".promo-later").addEventListener("click", close);
    pop.addEventListener("click", function (e) { if (e.target === pop) close(); });
  }

  // wait for the opening "M" animation when it plays
  var delay = document.documentElement.classList.contains("has-intro") ? 4200 : 1200;
  function start() { setTimeout(show, delay); }
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start);
})();

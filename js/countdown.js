/* ============================================================
   COUNTDOWNS - any element with data-countdown="<date & time>"
   counts down to it. Markup (copy an existing one):
     <div class="countdown" data-countdown="2026-11-29T18:00:00-05:00"
          data-live-until="2026-11-29T21:00:00-05:00"
          data-live="Happening now!" data-done="Thanks for coming!">
       <span><b data-cd="d">0</b><small>days</small></span> ... "h" "m" "s"
     </div>
   Between the start time and data-live-until it shows data-live;
   after that, data-done. Popups call window.mvCountdown(el).
   ============================================================ */
(function () {
  "use strict";

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function start(el) {
    if (el._cd) return;
    var target = Date.parse(el.getAttribute("data-countdown"));
    var liveUntil = Date.parse(el.getAttribute("data-live-until") || "") || target;
    var parts = {};
    ["d", "h", "m", "s"].forEach(function (k) { parts[k] = el.querySelector('[data-cd="' + k + '"]'); });

    function finish(text) {
      el.classList.add("is-over");
      var p = document.createElement("p");
      p.className = "countdown-msg";
      p.textContent = text;
      el.innerHTML = "";
      el.appendChild(p);
    }

    function tick() {
      var now = Date.now();
      var left = target - now;
      if (left <= 0) {
        clearInterval(el._cd);
        finish(now < liveUntil ? el.getAttribute("data-live") || "Happening now!" : el.getAttribute("data-done") || "");
        return;
      }
      var s = Math.floor(left / 1000);
      if (parts.d) parts.d.textContent = Math.floor(s / 86400);
      if (parts.h) parts.h.textContent = pad(Math.floor(s / 3600) % 24);
      if (parts.m) parts.m.textContent = pad(Math.floor(s / 60) % 60);
      if (parts.s) parts.s.textContent = pad(s % 60);
    }
    tick();
    el._cd = setInterval(tick, 1000);
  }

  window.mvCountdown = start;
  function all() { document.querySelectorAll("[data-countdown]").forEach(start); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", all);
  else all();
})();

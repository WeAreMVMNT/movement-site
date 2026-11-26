/* ============================================================
   SHARE BUTTONS - <button data-share="christmas|revival">.
   Phones: opens the share sheet. Elsewhere: copies the link.
   ============================================================ */
(function () {
  "use strict";
  var LINKS = {
    christmas: {
      title: "Christmas at Movement",
      text: "Christmas Eve Experiences at Movement Church: Dec 23 at 7pm, Dec 24 at 1pm, 3pm & 5pm.",
      url: "https://www.wearemovement.ca/christmas.html"
    },
    revival: {
      title: "Movement Revival Night",
      text: "Movement Revival Night with guest speaker Sam Picken: Sunday, Nov 29 at 6pm.",
      url: "https://www.wearemovement.ca/revival.html"
    }
  };
  function say(msg, type) { if (window.mvToast) window.mvToast(msg, type); }

  document.querySelectorAll("[data-share]").forEach(function (btn) {
    var data = LINKS[btn.getAttribute("data-share")];
    if (!data) return;
    btn.addEventListener("click", function () {
      if (navigator.share) { navigator.share(data).catch(function () {}); return; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(data.url).then(
          function () { say("Link copied. Paste it anywhere to share.", "success"); },
          function () { say("Couldn't copy the link: " + data.url, "error"); }
        );
      } else {
        say("Share this link: " + data.url, "info");
      }
    });
  });
})();

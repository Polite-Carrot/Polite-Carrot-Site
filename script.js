(function () {
  var TITLES = ["Tide Runner", "Colour Jars", "Last Light Harbour", "Parallax", "Gravel & Gold"];
  var TRAVEL = 62; // vw of horizontal travel per game
  var RISE = 30;   // vh it climbs on the way in
  var SPIN = 8;    // deg of tilt

  var track = document.getElementById("games");
  var stage = track && track.firstElementChild;
  var iconRow = stage && stage.querySelector('[data-gs-row="icons"]');
  var cardRow = stage && stage.querySelector('[data-gs-row="cards"]');
  var icons = document.querySelectorAll("[data-gs-icon]");
  var cards = document.querySelectorAll("[data-gs-card]");
  var bgs = document.querySelectorAll("[data-gs-bg]");
  var fills = document.querySelectorAll("[data-gs-fill]");
  var countEl = document.getElementById("gs-count");
  var nextEl = document.getElementById("gs-next");

  function pad(v) {
    return v < 10 ? "0" + v : "" + v;
  }

  function signed(v, unit) {
    return (v < 0 ? " - " + Math.abs(v).toFixed(2) : " + " + v.toFixed(2)) + unit;
  }

  function frame() {
    if (!track || !stage) return;

    var rect = track.getBoundingClientRect();
    var vh = document.documentElement.clientHeight || window.innerHeight;
    var span = rect.height - vh;
    if (span <= 0) return;

    // Ease the whole group from top-aligned (clears the hero on landing) to
    // vertically centred once the hero has scrolled away.
    if (iconRow && cardRow) {
      var free = stage.clientHeight - 10 - 48 - iconRow.offsetHeight - cardRow.offsetHeight;
      var ease = Math.max(0, Math.min(1, 1 - rect.top / 90));
      stage.style.paddingTop = (10 + Math.max(0, free) * 0.5 * ease).toFixed(1) + "px";
    }

    var progress = Math.max(0, Math.min(1, -rect.top / span));
    var n = TITLES.length;
    var pos = progress * (n - 1);
    var current = Math.round(pos);

    for (var i = 0; i < icons.length; i++) {
      var icon = icons[i];
      var idx = Number(icon.getAttribute("data-gs-icon"));
      var d = idx - pos;
      var a = Math.min(1, Math.abs(d));
      icon.style.transform =
        "translate3d(calc(-50%" + signed(-d * TRAVEL, "vw") + "), calc(-50%" +
        signed(d * RISE, "vh") + "), 0) scale(" + (1 - a * 0.22).toFixed(3) +
        ") rotate(" + (d * SPIN).toFixed(2) + "deg)";
      icon.style.opacity = a < 0.999 ? (1 - a * a * 0.85).toFixed(3) : "0";
      icon.style.zIndex = String(100 - Math.round(a * 90));
    }

    for (var j = 0; j < cards.length; j++) {
      var card = cards[j];
      var cd = Number(card.getAttribute("data-gs-card")) - pos;
      var ca = Math.min(1, Math.abs(cd));
      card.style.opacity = Math.max(0, 1 - ca * 1.9).toFixed(3);
      card.style.transform = "translate3d(0, " + (cd * 40).toFixed(1) + "px, 0)";
      card.style.pointerEvents = ca < 0.35 ? "auto" : "none";
    }

    for (var g = 0; g < bgs.length; g++) {
      var bgEl = bgs[g];
      var bd = Number(bgEl.getAttribute("data-gs-bg")) - pos;
      var ba = Math.min(1, Math.abs(bd));
      bgEl.style.opacity = Math.max(0, 1 - ba * 1.9).toFixed(3);
    }

    for (var f = 0; f < fills.length; f++) {
      var fill = fills[f];
      var fi = Number(fill.getAttribute("data-gs-fill"));
      var value = fi < current ? 1 : (fi > current ? 0 : Math.max(0, 1 - Math.abs(fi - pos)));
      fill.style.transform = "scaleX(" + value.toFixed(3) + ")";
    }

    if (countEl) countEl.textContent = pad(current + 1);
    if (nextEl) {
      nextEl.textContent = current >= n - 1 ? "End of catalogue" : "Next — " + TITLES[current + 1];
    }
  }

  // Timer-driven in addition to scroll/resize so the motion stays smooth
  // even in contexts that throttle rAF/scroll events (e.g. background tabs).
  window.addEventListener("scroll", frame, { passive: true });
  window.addEventListener("resize", frame);
  setInterval(frame, 40);
  frame();
})();

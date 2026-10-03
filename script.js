// Site menu (every page).
(function () {
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("site-menu");
  if (!toggle || !menu) return;

  function setOpen(open) {
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.documentElement.classList.toggle("menu-open", open);
    if (open) {
      var first = menu.querySelector("a, button");
      if (first) first.focus();
    } else {
      toggle.focus();
    }
  }

  toggle.addEventListener("click", function () {
    setOpen(menu.hidden);
  });

  menu.addEventListener("click", function (e) {
    var target = e.target;
    if (target.closest("[data-menu-close]") || target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !menu.hidden) setOpen(false);
  });
})();

// Homepage icon wall: tap an icon to bring up that game.
(function () {
  var icons = document.querySelectorAll(".wall-icon");
  if (!icons.length) return;
  var intro = document.getElementById("wall-intro");
  var details = document.querySelectorAll(".game-detail");
  var bgs = document.querySelectorAll("[data-bg]");
  var stage = document.querySelector(".wall-stage");

  function select(id) {
    var found = false;
    for (var i = 0; i < details.length; i++) {
      var match = details[i].id === id;
      details[i].hidden = !match;
      if (match) found = true;
    }
    if (!found) id = null;
    if (intro) intro.hidden = !!id;
    for (var j = 0; j < icons.length; j++) {
      icons[j].setAttribute("aria-pressed", icons[j].getAttribute("data-game") === id ? "true" : "false");
    }
    for (var k = 0; k < bgs.length; k++) {
      bgs[k].classList.toggle("is-active", bgs[k].getAttribute("data-bg") === id);
    }
    if (stage) stage.classList.toggle("has-selection", !!id);
  }

  for (var i = 0; i < icons.length; i++) {
    icons[i].addEventListener("click", function (e) {
      var id = e.currentTarget.getAttribute("data-game");
      var already = e.currentTarget.getAttribute("aria-pressed") === "true";
      // Tapping the selected game again goes back to the intro.
      history.replaceState(null, "", already ? location.pathname : "#" + id);
      select(already ? null : id);
    });
  }

  // Menu links point at /#game-id, so honour the hash on load and on change.
  function fromHash() {
    select(location.hash.slice(1) || null);
  }
  window.addEventListener("hashchange", fromHash);
  fromHash();
})();

// Category filter for the games page grid.
(function () {
  var tabs = document.querySelectorAll(".category-tab");
  var tiles = document.querySelectorAll(".game-tile");

  for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", function (e) {
      var tab = e.currentTarget;
      var category = tab.getAttribute("data-category");
      for (var t = 0; t < tabs.length; t++) {
        tabs[t].setAttribute("aria-pressed", tabs[t] === tab ? "true" : "false");
      }
      for (var g = 0; g < tiles.length; g++) {
        var show = category === "all" || tiles[g].getAttribute("data-category") === category;
        tiles[g].hidden = !show;
      }
    });
  }
})();

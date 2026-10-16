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

// Category filter for the games page grid. The menu links here with
// ?category=puzzle etc., so the chosen filter is applied on load too.
(function () {
  var tabs = document.querySelectorAll(".category-tab");
  var tiles = document.querySelectorAll(".game-tile");
  if (!tabs.length) return;

  function apply(category) {
    var found = false;
    for (var t = 0; t < tabs.length; t++) {
      var on = tabs[t].getAttribute("data-category") === category;
      tabs[t].setAttribute("aria-pressed", on ? "true" : "false");
      if (on) found = true;
    }
    if (!found) return apply("all");
    for (var g = 0; g < tiles.length; g++) {
      var show = category === "all" || tiles[g].getAttribute("data-category") === category;
      tiles[g].hidden = !show;
    }
    return category;
  }

  for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", function (e) {
      var category = apply(e.currentTarget.getAttribute("data-category"));
      history.replaceState(null, "", category === "all" ? location.pathname : "?category=" + category);
    });
  }

  var match = /[?&]category=([^&#]+)/.exec(location.search);
  if (match) apply(decodeURIComponent(match[1]));
})();

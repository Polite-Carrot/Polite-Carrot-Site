// Category filter for the game grid (homepage and games page).
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

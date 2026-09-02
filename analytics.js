(function () {
  var GA_ID = "G-DYGSJNMREZ";
  var KEY = "pc-analytics-enabled";

  function isEnabled() {
    try {
      var v = localStorage.getItem(KEY);
      return v === null ? true : v === "true";
    } catch (e) {
      return true;
    }
  }

  function loadGA() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      dataLayer.push(arguments);
    };
    gtag("js", new Date());
    gtag("config", GA_ID, { anonymize_ip: true });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
  }

  // Exposed so the privacy page's toggle can read/write the preference.
  // Turning analytics off takes full effect on the next page load — once
  // gtag.js is already injected this session, there's nothing left to
  // retroactively opt back out of.
  window.politeCarrotAnalytics = {
    isEnabled: isEnabled,
    setEnabled: function (on) {
      try {
        localStorage.setItem(KEY, on ? "true" : "false");
      } catch (e) {}
      if (on) loadGA();
    }
  };

  if (isEnabled()) loadGA();
})();

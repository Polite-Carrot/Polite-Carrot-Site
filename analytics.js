(function () {
  var GA_ID = "G-DYGSJNMREZ";
  var KEY = "pc-analytics-enabled";

  // No stored value = no choice made yet. Analytics stays off until the
  // visitor actively accepts, either via the banner or the privacy page's
  // toggle — opt-in, not opt-out.
  function hasChoice() {
    try {
      return localStorage.getItem(KEY) !== null;
    } catch (e) {
      return false;
    }
  }

  function isEnabled() {
    try {
      return localStorage.getItem(KEY) === "true";
    } catch (e) {
      return false;
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

  // Exposed so the privacy page's toggle (and the banner below) can read/
  // write the preference. Turning analytics off takes full effect on the
  // next page load — once gtag.js is already injected this session,
  // there's nothing left to retroactively opt back out of.
  function setEnabled(on) {
    try {
      localStorage.setItem(KEY, on ? "true" : "false");
    } catch (e) {}
    if (on) loadGA();
  }

  window.politeCarrotAnalytics = {
    isEnabled: isEnabled,
    hasChoice: hasChoice,
    setEnabled: setEnabled
  };

  if (isEnabled()) loadGA();

  // ---- Consent banner ----------------------------------------------------
  // Shown once, on any page, until a choice is made. Skipped on the privacy
  // page itself, which already has an explicit toggle for the same thing —
  // showing both at once is just noise.
  function bannerHTML() {
    return (
      '<p class="consent-text">We\'d like to use Google Analytics to see how this site is used — no personal data, just aggregate traffic. <a href="/privacy/">Read more</a>.</p>' +
      '<div class="consent-actions">' +
      '<button type="button" class="consent-btn" data-consent="decline">Decline</button>' +
      '<button type="button" class="consent-btn consent-btn-primary" data-consent="accept">Accept</button>' +
      "</div>"
    );
  }

  function showBanner() {
    if (document.getElementById("pc-consent-banner")) return;
    var el = document.createElement("div");
    el.id = "pc-consent-banner";
    el.className = "consent-banner";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", "Analytics consent");
    el.innerHTML = bannerHTML();
    document.body.appendChild(el);

    // Nudge the carousel's own bottom bar (progress/counter) up out of the
    // banner's way — same class of fixed-vs-fixed overlap as the header,
    // fixed the same way: an offset the layout can react to.
    document.documentElement.style.setProperty(
      "--consent-offset",
      el.offsetHeight + 12 + "px"
    );

    el.addEventListener("click", function (e) {
      var action = e.target && e.target.getAttribute && e.target.getAttribute("data-consent");
      if (!action) return;
      setEnabled(action === "accept");
      el.remove();
      document.documentElement.style.removeProperty("--consent-offset");
    });
  }

  function init() {
    if (hasChoice()) return;
    if (document.getElementById("analytics-toggle")) return;
    showBanner();
  }

  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init);
})();

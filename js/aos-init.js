/* ==========================================================================
   AOS Scroll Reveal Initialisation
   ========================================================================== */

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    if (typeof AOS === "undefined") return;
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: true,
      offset: 90,
      mirror: false,
      disable: function () {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      }
    });
  });
})();


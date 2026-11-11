/* ==========================================================================
   Numeric KPI & Metrics Counter Animation
   ========================================================================== */

(function () {
  function formatNumber(val, decimals) {
    if (decimals > 0) {
      return Number(val).toFixed(decimals);
    }
    return Math.round(val).toLocaleString("en-US");
  }

  function animateCounter(el) {
    if (el.dataset.counted === "true") return;
    el.dataset.counted = "true";

    var target = parseFloat(el.dataset.target || el.textContent.replace(/[^0-9.]/g, "")) || 0;
    var prefix = el.dataset.prefix || "";
    var suffix = el.dataset.suffix || "";
    var decimals = parseInt(el.dataset.decimals || "0", 10);

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = prefix + formatNumber(target, decimals) + suffix;
      return;
    }

    var state = { value: 0 };
    if (typeof gsap !== "undefined") {
      gsap.to(state, {
        value: target,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: function () {
          el.textContent = prefix + formatNumber(state.value, decimals) + suffix;
        },
        onComplete: function () {
          el.textContent = prefix + formatNumber(target, decimals) + suffix;
        }
      });
    } else {
      var start = null;
      var dur = 1200;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + formatNumber(target * eased, decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
  }

  window.animateStacklyCounters = function (root) {
    var scope = root || document;
    var counters = scope.querySelectorAll(".counter-value");
    counters.forEach(function (el) {
      if ("IntersectionObserver" in window) {
        var obs = new IntersectionObserver(
          function (entries, observer) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.2 }
        );
        obs.observe(el);
      } else {
        animateCounter(el);
      }
    });
  };

  document.addEventListener("DOMContentLoaded", function () {
    window.animateStacklyCounters(document);
  });
})();


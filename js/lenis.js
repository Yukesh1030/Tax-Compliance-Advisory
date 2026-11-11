/* ==========================================================================
   Lenis Smooth Scrolling Synchronised with GSAP ScrollTrigger
   ========================================================================== */

(function () {
  if (typeof window === "undefined") return;

  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced || typeof Lenis === "undefined") {
    return;
  }

  var lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    wheelMultiplier: 1
  });

  window.stacklyLenis = lenis;

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
})();


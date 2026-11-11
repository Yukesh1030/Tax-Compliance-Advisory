/* ==========================================================================
   Main Entry Point: Testimonial Carousel & Global UI Enhancements
   ========================================================================== */

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    /* Client Testimonials Slider (Home Page) */
    var slides = document.querySelectorAll(".testimonial-slide");
    var prevBtn = document.getElementById("testimonialPrev");
    var nextBtn = document.getElementById("testimonialNext");
    var index = 0;

    function showSlide(nextIdx) {
      if (!slides.length) return;
      index = (nextIdx + slides.length) % slides.length;
      slides.forEach(function (slide, idx) {
        slide.classList.toggle("is-active", idx === index);
      });
      if (typeof gsap !== "undefined" && slides[index]) {
        gsap.fromTo(
          slides[index],
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
        );
      }
    }

    if (slides.length) {
      showSlide(0);
      if (prevBtn) prevBtn.addEventListener("click", function () { showSlide(index - 1); });
      if (nextBtn) nextBtn.addEventListener("click", function () { showSlide(index + 1); });
    }
  });
})();


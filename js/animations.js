/* ==========================================================================
   GSAP + ScrollTrigger Motion System (Hero, Parallax, Timelines, Magnetic CTA)
   ========================================================================== */

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    if (typeof gsap === "undefined") return;
    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    /* 1. Page Hero Sequence (All Public Pages) */
    var hero = document.querySelector(".page-hero");
    if (hero) {
      var heroBg = hero.querySelector(".page-hero-bg");
      var heroOverlay = hero.querySelector(".page-hero-overlay");
      var heroTrust = hero.querySelector(".hero-trust-badge, .hero-breadcrumb");
      var heroLine = hero.querySelector(".hero-gold-line");
      var heroTitle = hero.querySelector(".hero-title");
      var heroSub = hero.querySelector(".hero-subtitle");
      var heroActions = hero.querySelectorAll(".hero-actions > *");
      var scrollInd = hero.querySelector(".hero-scroll-indicator");

      var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (heroBg) {
        tl.fromTo(heroBg, { scale: 1.08 }, { scale: 1, duration: 1.5 }, 0);
      }
      if (heroOverlay) {
        tl.fromTo(heroOverlay, { opacity: 0.45 }, { opacity: 1, duration: 1.1 }, 0);
      }
      if (heroTrust) {
        tl.from(heroTrust, { y: 18, opacity: 0, duration: 0.65 }, 0.15);
      }
      if (heroLine) {
        tl.fromTo(heroLine, { scaleX: 0 }, { scaleX: 1, duration: 0.75 }, 0.28);
      }
      if (heroTitle) {
        tl.from(heroTitle, { y: 48, opacity: 0, duration: 0.88 }, 0.35);
      }
      if (heroSub) {
        tl.from(heroSub, { y: 24, opacity: 0, duration: 0.72 }, 0.52);
      }
      if (heroActions.length) {
        tl.from(heroActions, { y: 20, opacity: 0, stagger: 0.12, duration: 0.6 }, 0.65);
      }
      if (scrollInd) {
        tl.from(scrollInd, { opacity: 0, y: 12, duration: 0.6 }, 0.85);
      }

      /* Subtle Scroll Parallax on Hero Background */
      if (heroBg && typeof ScrollTrigger !== "undefined" && window.innerWidth >= 768) {
        gsap.to(heroBg, {
          yPercent: 14,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });
      }
    }

    /* 2. Section Stagger Sequences (GSAP ScrollTrigger — distinct from AOS elements) */
    function staggerGroup(selector, yOffset, staggerAmt) {
      var els = gsap.utils.toArray(selector);
      if (!els.length || typeof ScrollTrigger === "undefined") return;
      var triggerParent = els[0].parentElement || els[0];
      gsap.from(els, {
        y: yOffset || 28,
        opacity: 0,
        duration: 0.72,
        stagger: staggerAmt || 0.1,
        ease: "power2.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: triggerParent,
          start: "top 86%",
          once: true
        }
      });
    }

    staggerGroup(".services-grid .service-card", 32, 0.09);
    staggerGroup(".approach-timeline .approach-step", 28, 0.12);
    staggerGroup(".experts-grid .expert-card", 30, 0.1);
    staggerGroup(".industries-grid .industry-tile", 24, 0.07);
    staggerGroup(".story-timeline .story-milestone", 26, 0.12);

    /* 3. Desktop-Only Magnetic CTA Hover */
    var finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (finePointer) {
      document.querySelectorAll(".magnetic-btn").forEach(function (btn) {
        btn.addEventListener("mousemove", function (e) {
          var rect = btn.getBoundingClientRect();
          var x = (e.clientX - rect.left - rect.width / 2) * 0.16;
          var y = (e.clientY - rect.top - rect.height / 2) * 0.16;
          gsap.to(btn, { x: x, y: y, duration: 0.25, ease: "power2.out" });
        });
        btn.addEventListener("mouseleave", function () {
          gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: "elastic.out(1, 0.5)" });
        });
      });
    }

    /* 4. Auth Card Entrance (Login & Signup) */
    var authCard = document.getElementById("authCard");
    if (authCard) {
      gsap.from(authCard, {
        y: 34,
        opacity: 0,
        scale: 0.97,
        duration: 0.78,
        ease: "power3.out",
        clearProps: "transform"
      });
      var authTopbar = document.querySelector(".auth-topbar");
      if (authTopbar) {
        gsap.from(authTopbar, { y: -16, opacity: 0, duration: 0.6, ease: "power2.out" });
      }
    }

    /* 5. Custom 404 GSAP Entrance */
    var box404 = document.getElementById("error404Box");
    if (box404) {
      var bg404 = document.querySelector(".error-404-hero .page-hero-bg");
      var tl404 = gsap.timeline({ defaults: { ease: "power3.out", clearProps: "opacity,transform" } });
      if (bg404) {
        tl404.fromTo(bg404, { scale: 1.08 }, { scale: 1, duration: 1.1 }, 0);
      }
      tl404
        .from(".error-404-code", { y: 24, opacity: 0, duration: 0.45 }, 0.05)
        .from(".error-404-divider", { scaleX: 0, duration: 0.4 }, 0.14)
        .from(".error-404-heading", { y: 18, opacity: 0, duration: 0.45 }, 0.2)
        .from(".error-404-text", { y: 14, opacity: 0, duration: 0.4 }, 0.28)
        .from(".error-404-actions > *", { y: 12, opacity: 0, stagger: 0.08, duration: 0.35 }, 0.34);
    }
  });
})();


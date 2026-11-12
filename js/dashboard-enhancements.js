/* ==========================================================================
   Shared Dashboard UI Interactions & GSAP Animation Controller
   Powers AdminDashboard & ClientDashboard sections, filters, toggles, & GSAP
   ========================================================================== */

(function () {
  var reducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function applyProgressWidths(scope) {
    (scope || document).querySelectorAll("[data-progress]").forEach(function (bar) {
      var pct = parseFloat(bar.getAttribute("data-progress") || "0");
      var clamped = Math.max(0, Math.min(100, isNaN(pct) ? 0 : pct));
      bar.style.width = clamped + "%";
    });
  }

  function runSectionEntrance(el) {
    if (!el || reducedMotion || typeof gsap === "undefined") return;
    gsap.killTweensOf(el);
    gsap.fromTo(
      el,
      { opacity: 0.15, y: 18 },
      { opacity: 1, y: 0, duration: 0.48, ease: "power2.out", clearProps: "transform,opacity" }
    );
  }

  function animateTabPanel(panel) {
    if (!panel) return;
    applyProgressWidths(panel);

    if (typeof window.animateStacklyCounters === "function") {
      panel.querySelectorAll(".counter-value").forEach(function (el) {
        if (!el.dataset.counted) return;
        el.dataset.counted = "";
      });
      window.animateStacklyCounters(panel);
    }

    if (reducedMotion || typeof gsap === "undefined") return;

    var animCards = panel.querySelectorAll(".dash-subsec, .kpi-card, .dash-mini-card");
    if (animCards.length) {
      gsap.killTweensOf(animCards);
      gsap.fromTo(
        animCards,
        { opacity: 0.15, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.44,
          stagger: 0.045,
          ease: "power2.out",
          clearProps: "transform,opacity"
        }
      );
    }

    var timelines = panel.querySelectorAll(".dash-timeline-item");
    if (timelines.length) {
      gsap.killTweensOf(timelines);
      gsap.fromTo(
        timelines,
        { opacity: 0.15, x: -12 },
        {
          opacity: 1,
          x: 0,
          duration: 0.38,
          stagger: 0.055,
          ease: "power2.out",
          clearProps: "transform,opacity"
        }
      );
    }

    var bars = panel.querySelectorAll("[data-progress]");
    if (bars.length) {
      gsap.killTweensOf(bars);
      gsap.fromTo(
        bars,
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          duration: 0.72,
          stagger: 0.04,
          ease: "power3.out",
          clearProps: "transform"
        }
      );
    }
  }

  function setupScrollReveals() {
    if (reducedMotion || !("IntersectionObserver" in window)) return;
    var subsecs = document.querySelectorAll(".dash-subsec");
    if (!subsecs.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !entry.target.dataset.gsaped) {
            var parentTab = entry.target.closest(".dash-tab-panel");
            if (parentTab && !parentTab.classList.contains("is-active")) return;
            entry.target.dataset.gsaped = "1";
            runSectionEntrance(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    subsecs.forEach(function (sec) {
      observer.observe(sec);
    });
  }

  function bindFilterBars() {
    document.querySelectorAll("[data-filter-group]").forEach(function (group) {
      var groupName = group.getAttribute("data-filter-group");
      var buttons = group.querySelectorAll("[data-filter]");
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var filterVal = btn.getAttribute("data-filter") || "all";
          buttons.forEach(function (b) {
            b.classList.toggle("is-active", b === btn);
          });

          var scope = group.closest(".dash-subsec") || group.closest(".dash-tab-panel") || document;
          var items = scope.querySelectorAll('[data-filter-target="' + groupName + '"]');
          var shown = [];

          items.forEach(function (item) {
            var tags = (item.getAttribute("data-tags") || "").toLowerCase().split(/\s+/);
            var match = filterVal === "all" || tags.indexOf(filterVal.toLowerCase()) !== -1;
            item.style.display = match ? "" : "none";
            if (match) shown.push(item);
          });

          if (!reducedMotion && typeof gsap !== "undefined" && shown.length) {
            gsap.fromTo(
              shown,
              { opacity: 0.25, y: 10 },
              {
                opacity: 1,
                y: 0,
                duration: 0.32,
                stagger: 0.04,
                ease: "power2.out",
                clearProps: "transform,opacity"
              }
            );
          }
        });
      });
    });
  }

  function bindSwitches() {
    document.querySelectorAll(".dash-switch").forEach(function (sw) {
      sw.addEventListener("click", function () {
        var isOn = !sw.classList.contains("is-on");
        sw.classList.toggle("is-on", isOn);
        sw.setAttribute("aria-checked", String(isOn));

        var feedbackId = sw.getAttribute("data-feedback-target");
        if (feedbackId) {
          var fb = document.getElementById(feedbackId);
          if (fb) {
            var label = sw.getAttribute("data-label") || "Governance policy";
            fb.textContent = label + (isOn ? " enabled (demo state)." : " paused (demo state).");
            fb.classList.add("is-visible");
          }
        }
      });
    });
  }

  function bindRowActions() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-row-action]");
      if (!btn || btn.disabled) return;

      var container = btn.closest("tr") || btn.closest(".dash-mini-card") || btn.closest(".dash-timeline-item");
      var badge = container ? container.querySelector(".status-badge") : null;
      var nextStatus = btn.getAttribute("data-next-status") || "Completed (Demo)";
      var nextStyle = btn.getAttribute("data-next-style") || "done";
      var doneLabel = btn.getAttribute("data-done-label") || "Updated";

      if (badge) {
        badge.className = "status-badge status-badge--" + nextStyle;
        badge.textContent = nextStatus;
      }

      btn.textContent = doneLabel;
      btn.disabled = true;

      var msgTarget = btn.getAttribute("data-feedback-target");
      var msgText = btn.getAttribute("data-feedback-text");
      if (msgTarget && msgText) {
        var fb = document.getElementById(msgTarget);
        if (fb) {
          fb.textContent = msgText;
          fb.classList.add("is-visible");
        }
      }

      if (!reducedMotion && typeof gsap !== "undefined" && container) {
        gsap.fromTo(
          container,
          { scale: 0.99 },
          { scale: 1, duration: 0.25, ease: "power2.out", clearProps: "transform" }
        );
      }
    });

    document.addEventListener("click", function (e) {
      var copyBtn = e.target.closest("[data-copy-value]");
      if (!copyBtn) return;
      var val = copyBtn.getAttribute("data-copy-value") || "";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(val).catch(function () {});
      }
      var prev = copyBtn.textContent;
      copyBtn.textContent = "Copied";
      setTimeout(function () {
        copyBtn.textContent = prev;
      }, 1500);
    });

    document.addEventListener("click", function (e) {
      var pingBtn = e.target.closest("[data-ping-btn]");
      if (!pingBtn) return;
      var fbId = pingBtn.getAttribute("data-feedback-target");
      var fb = fbId ? document.getElementById(fbId) : null;
      var ts = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
      if (fb) {
        fb.textContent = "Illustrative gateway ping completed at " + ts + " IST — all 5 portal endpoints operational (Demo).";
        fb.classList.add("is-visible");
      }
    });
  }

  function bindDemoBuilders() {
    document.querySelectorAll("[data-demo-builder]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var fbId = form.getAttribute("data-feedback-target");
        var message = form.getAttribute("data-feedback-message") || "Action queued in demo workspace.";
        var fb = fbId ? document.getElementById(fbId) : null;
        if (fb) {
          fb.textContent = message;
          fb.classList.add("is-visible");
          if (!reducedMotion && typeof gsap !== "undefined") {
            gsap.fromTo(fb, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.28, clearProps: "transform,opacity" });
          }
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyProgressWidths(document);
    bindFilterBars();
    bindSwitches();
    bindRowActions();
    bindDemoBuilders();
    setupScrollReveals();

    var activePanel = document.querySelector(".dash-tab-panel.is-active");
    if (activePanel) animateTabPanel(activePanel);

    var gsapEl = document.getElementById("gsapScript");
    if (gsapEl) {
      gsapEl.addEventListener("load", function () {
        var cur = document.querySelector(".dash-tab-panel.is-active");
        if (cur) animateTabPanel(cur);
      });
    }
  });

  window.StacklyDashboardUI = {
    animateTabPanel: animateTabPanel,
    applyProgressWidths: applyProgressWidths
  };
})();


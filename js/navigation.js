/* ==========================================================================
   Header Scroll State, Active Nav Links, Mobile Hamburger Drawer & Back-to-Top
   ========================================================================== */

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var header = document.getElementById("siteHeader");
    var hamburger = document.getElementById("hamburgerBtn");
    var drawer = document.getElementById("mobileDrawer");
    var backdrop = document.getElementById("mobileBackdrop");
    var closeBtn = document.getElementById("mobileCloseBtn");
    var backToTopBtn = document.getElementById("backToTopBtn");

    /* Highlight Active Link */
    var path = window.location.pathname.split("/").pop() || "index.html";
    path = path.toLowerCase();
    var allNavLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");
    allNavLinks.forEach(function (link) {
      var href = (link.getAttribute("href") || "").split("/").pop().toLowerCase();
      if (href === path || (path === "" && href === "index.html")) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });

    /* Sticky Scroll State */
    function updateHeaderScroll() {
      if (!header) return;
      if (window.scrollY > 40) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    updateHeaderScroll();
    window.addEventListener("scroll", updateHeaderScroll, { passive: true });
    if (window.stacklyLenis) {
      window.stacklyLenis.on("scroll", updateHeaderScroll);
    }

    /* Mobile Drawer Open / Close */
    function openDrawer() {
      if (!drawer || !backdrop || !hamburger) return;
      drawer.classList.add("is-open");
      backdrop.classList.add("is-open");
      hamburger.classList.add("is-active");
      hamburger.setAttribute("aria-expanded", "true");
      drawer.setAttribute("aria-hidden", "false");
      document.body.classList.add("drawer-open");
      if (window.stacklyLenis) window.stacklyLenis.stop();
    }

    function closeDrawer() {
      if (!drawer || !backdrop || !hamburger) return;
      drawer.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      hamburger.classList.remove("is-active");
      hamburger.setAttribute("aria-expanded", "false");
      drawer.setAttribute("aria-hidden", "true");
      document.body.classList.remove("drawer-open");
      if (window.stacklyLenis) window.stacklyLenis.start();
    }

    if (hamburger) {
      hamburger.addEventListener("click", function () {
        var isOpen = drawer && drawer.classList.contains("is-open");
        if (isOpen) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });
    }

    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
    if (backdrop) backdrop.addEventListener("click", closeDrawer);

    document.querySelectorAll(".mobile-nav-link, .mobile-drawer-actions a").forEach(function (el) {
      el.addEventListener("click", closeDrawer);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer && drawer.classList.contains("is-open")) {
        closeDrawer();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1024 && drawer && drawer.classList.contains("is-open")) {
        closeDrawer();
      }
    });

    /* Back to Top */
    if (backToTopBtn) {
      backToTopBtn.addEventListener("click", function () {
        if (window.stacklyLenis) {
          window.stacklyLenis.scrollTo(0, { duration: 1.1 });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    }
  });
})();


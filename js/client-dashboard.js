/* ==========================================================================
   Client Dashboard Controller (5 Sidebar Tabs, Chart.js, Upload & Support)
   ========================================================================== */

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("clientDashboardApp")) return;

    /* Populate User Session Identity */
    var profileNameEl = document.getElementById("clientProfileName");
    var profileEmailEl = document.getElementById("clientProfileEmail");
    var profileAvatarEl = document.getElementById("clientProfileAvatar");
    var welcomeEl = document.getElementById("clientWelcomeHeading");
    var profileFormName = document.getElementById("profileContactName");
    var profileFormEmail = document.getElementById("profileContactEmail");

    if (window.StacklySession) {
      var identity = window.StacklySession.resolveIdentity("Client");
      if (profileNameEl) profileNameEl.textContent = identity.name;
      if (profileEmailEl) profileEmailEl.textContent = identity.email;
      if (profileAvatarEl) profileAvatarEl.textContent = identity.initials;
      if (welcomeEl) welcomeEl.textContent = "Welcome back, " + identity.name;
      if (profileFormName) profileFormName.value = identity.name;
      if (profileFormEmail) profileFormEmail.value = identity.email;
    }

    /* Mobile Sidebar Toggle */
    var sidebar = document.getElementById("dashSidebar");
    var backdrop = document.getElementById("dashSidebarBackdrop");
    var menuToggle = document.getElementById("dashMenuToggle");
    var closeBtn = document.getElementById("dashCloseBtn");

    function setSidebar(open) {
      if (!sidebar || !backdrop) return;
      sidebar.classList.toggle("is-open", open);
      backdrop.classList.toggle("is-open", open);
    }

    if (menuToggle) menuToggle.addEventListener("click", function () { setSidebar(true); });
    if (closeBtn) closeBtn.addEventListener("click", function () { setSidebar(false); });
    if (backdrop) backdrop.addEventListener("click", function () { setSidebar(false); });

    /* 5 Sidebar Menu Tabs */
    var navBtns = document.querySelectorAll(".dash-nav-btn[data-tab]");
    var tabPanels = document.querySelectorAll(".dash-tab-panel[data-panel]");

    function switchTab(tabId) {
      var activePanel = null;
      navBtns.forEach(function (btn) {
        btn.classList.toggle("is-active", btn.dataset.tab === tabId);
      });
      tabPanels.forEach(function (panel) {
        var active = panel.dataset.panel === tabId;
        panel.classList.toggle("is-active", active);
        if (active) activePanel = panel;
      });
      if (activePanel && window.StacklyDashboardUI && window.StacklyDashboardUI.animateTabPanel) {
        window.StacklyDashboardUI.animateTabPanel(activePanel);
      } else if (activePanel && typeof gsap !== "undefined") {
        gsap.fromTo(activePanel, { opacity: 0.15, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", clearProps: "transform,opacity" });
      }
      if (window.innerWidth < 1024) setSidebar(false);
    }

    navBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        switchTab(btn.dataset.tab);
      });
    });

    if (window.StacklySession && window.StacklySession.bindTabLinks) {
      window.StacklySession.bindTabLinks(switchTab);
    }

    /* Topbar Popovers */
    var popoverBtns = document.querySelectorAll("[data-popover-target]");
    var popovers = document.querySelectorAll(".dash-popover");

    function closePopovers() {
      popovers.forEach(function (p) { p.classList.remove("is-open"); });
    }

    popoverBtns.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var target = document.getElementById(btn.dataset.popoverTarget);
        var wasOpen = target && target.classList.contains("is-open");
        closePopovers();
        if (target && !wasOpen) target.classList.add("is-open");
      });
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".dash-popover") && !e.target.closest("[data-popover-target]")) {
        closePopovers();
      }
    });

    /* Logout Handler */
    document.querySelectorAll("[data-logout-btn]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        try {
          localStorage.removeItem("stackly_session");
        } catch (err) {}
        window.location.href = "login.html";
      });
    });

    /* Live Search Filtering Across Client Tables */
    var searchInput = document.getElementById("clientSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        var q = searchInput.value.trim().toLowerCase();
        document.querySelectorAll(".dash-table tbody tr").forEach(function (row) {
          row.style.display = !q || row.textContent.toLowerCase().indexOf(q) !== -1 ? "" : "none";
        });
      });
    }

    /* Chart.js Client Visualisations (non-blocking if CDN loads after DOMContentLoaded) */
    var chartsInitialized = false;
    function initClientCharts() {
      if (chartsInitialized || typeof Chart === "undefined") return;
      chartsInitialized = true;

      var progCanvas = document.getElementById("clientComplianceChart");
      if (progCanvas) {
        new Chart(progCanvas.getContext("2d"), {
          type: "line",
          data: {
            labels: ["Q1 FY25", "Q2 FY25", "Q3 FY25", "Q4 FY25", "Q1 FY26"],
            datasets: [
              {
                label: "Compliance Readiness Score (Demo %)",
                data: [86, 91, 94, 96, 98],
                borderColor: "#B99A62",
                backgroundColor: "rgba(185, 154, 98, 0.16)",
                fill: true,
                tension: 0.35,
                pointBackgroundColor: "#14263D",
                pointRadius: 5
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: "bottom" } },
            scales: {
              y: { min: 70, max: 100, grid: { color: "rgba(20,38,61,0.08)" } },
              x: { grid: { display: false } }
            }
          }
        });
      }

      var allocCanvas = document.getElementById("clientServiceMixChart");
      if (allocCanvas) {
        new Chart(allocCanvas.getContext("2d"), {
          type: "doughnut",
          data: {
            labels: ["Direct Tax", "GST Returns", "ROC Compliance", "Advisory Retainer"],
            datasets: [
              {
                data: [35, 30, 20, 15],
                backgroundColor: ["#14263D", "#B99A62", "#26466D", "#D4BA86"],
                borderWidth: 2,
                borderColor: "#FFFFFF"
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: "bottom" } }
          }
        });
      }
    }

    initClientCharts();
    var chartScriptEl = document.getElementById("chartjsScript");
    if (chartScriptEl) chartScriptEl.addEventListener("load", initClientCharts);
    window.addEventListener("load", initClientCharts);
  });
})();


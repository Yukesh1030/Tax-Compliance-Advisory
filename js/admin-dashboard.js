/* ==========================================================================
   Admin Dashboard Controller (5 Sidebar Tabs, Chart.js, Modals, Live Search)
   ========================================================================== */

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("adminDashboardApp")) return;

    /* Populate User Session Identity */
    var profileNameEl = document.getElementById("dashProfileName");
    var profileRoleEl = document.getElementById("dashProfileRole");
    var profileAvatarEl = document.getElementById("dashProfileAvatar");
    var welcomeTitleEl = document.getElementById("dashWelcomeTitle");

    if (window.StacklySession) {
      var identity = window.StacklySession.resolveIdentity("Admin");
      if (profileNameEl) profileNameEl.textContent = identity.name;
      if (profileRoleEl) profileRoleEl.textContent = identity.email;
      if (profileAvatarEl) profileAvatarEl.textContent = identity.initials;
      if (welcomeTitleEl) {
        welcomeTitleEl.textContent = "Practice Overview — " + identity.name;
      }
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

    /* Topbar Popovers (Notifications, Messages, Profile) */
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

    /* Live Search Filtering Across Dashboard Tables */
    var searchInput = document.getElementById("dashSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        var q = searchInput.value.trim().toLowerCase();
        document.querySelectorAll(".dash-table tbody tr").forEach(function (row) {
          row.style.display = !q || row.textContent.toLowerCase().indexOf(q) !== -1 ? "" : "none";
        });
      });
    }

    /* Quick Action Modal */
    var modalBackdrop = document.getElementById("adminActionModal");
    var modalTitle = document.getElementById("adminModalTitle");
    var modalForm = document.getElementById("adminModalForm");
    var modalPrimaryLabel = document.getElementById("modalPrimaryLabel");
    var modalSecondaryLabel = document.getElementById("modalSecondaryLabel");
    var modalPrimaryInput = document.getElementById("modalPrimaryInput");
    var modalSecondaryInput = document.getElementById("modalSecondaryInput");
    var modalCategorySelect = document.getElementById("modalCategorySelect");
    var currentActionType = "client";

    var actionConfig = {
      client: {
        title: "Add New Client Entity (Demo)",
        primary: "Entity / Company Name",
        secondary: "Primary Contact & City",
        cats: ["Direct Tax Advisory", "Indirect Tax & GST", "Corporate Tax Planning", "Regulatory Compliance"]
      },
      engagement: {
        title: "Create Advisory Engagement (Demo)",
        primary: "Engagement Title",
        secondary: "Assigned Client Name",
        cats: ["GST Audit & Reconciliation", "Corporate Restructuring", "Transfer Pricing Study", "Statutory ROC Filing"]
      },
      task: {
        title: "Add Compliance Task (Demo)",
        primary: "Compliance Obligation",
        secondary: "Target Deadline (e.g., 20 May 2026)",
        cats: ["GSTR-3B Monthly Return", "TDS Quarterly Statement", "Advance Tax Installment", "Annual Statutory Audit"]
      }
    };

    document.querySelectorAll("[data-open-modal]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentActionType = btn.dataset.openModal || "client";
        var cfg = actionConfig[currentActionType] || actionConfig.client;
        if (modalTitle) modalTitle.textContent = cfg.title;
        if (modalPrimaryLabel) modalPrimaryLabel.textContent = cfg.primary;
        if (modalSecondaryLabel) modalSecondaryLabel.textContent = cfg.secondary;
        if (modalCategorySelect) {
          modalCategorySelect.innerHTML =
            '<option value="">Select Practice Category</option>' +
            cfg.cats
              .map(function (c) { return '<option value="' + c + '">' + c + "</option>"; })
              .join("");
        }
        if (modalForm) {
          modalForm.reset();
          modalForm.querySelectorAll(".is-invalid").forEach(function (el) {
            el.classList.remove("is-invalid");
            el.removeAttribute("aria-invalid");
          });
          modalForm.querySelectorAll(".form-error").forEach(function (el) { el.textContent = ""; });
          var mf = modalForm.querySelector(".form-feedback");
          if (mf) { mf.className = "form-feedback"; mf.textContent = ""; }
        }
        if (modalBackdrop) modalBackdrop.classList.add("is-open");
      });
    });

    document.querySelectorAll("[data-close-modal]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (modalBackdrop) modalBackdrop.classList.remove("is-open");
      });
    });

    /* Chart.js Visualisations (non-blocking if CDN loads after DOMContentLoaded) */
    var chartsInitialized = false;
    function initAdminCharts() {
      if (chartsInitialized || typeof Chart === "undefined") return;
      chartsInitialized = true;

      var engCanvas = document.getElementById("adminEngagementChart");
      if (engCanvas) {
        new Chart(engCanvas.getContext("2d"), {
          type: "bar",
          data: {
            labels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
            datasets: [
              {
                label: "Completed Filings (Demo)",
                data: [18, 22, 26, 24, 31, 28],
                backgroundColor: "#14263D",
                borderRadius: 6
              },
              {
                label: "Advisory Mandates (Demo)",
                data: [11, 14, 13, 17, 19, 21],
                backgroundColor: "#B99A62",
                borderRadius: 6
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "bottom" }
            },
            scales: {
              y: { beginAtZero: true, grid: { color: "rgba(20,38,61,0.08)" } },
              x: { grid: { display: false } }
            }
          }
        });
      }

      var distCanvas = document.getElementById("adminCategoryChart");
      if (distCanvas) {
        new Chart(distCanvas.getContext("2d"), {
          type: "doughnut",
          data: {
            labels: ["Direct Tax", "Indirect Tax & GST", "Corporate Planning", "Regulatory Compliance", "Audit Support"],
            datasets: [
              {
                data: [28, 24, 19, 17, 12],
                backgroundColor: ["#14263D", "#B99A62", "#1C3B61", "#D4BA86", "#425B76"],
                borderWidth: 2,
                borderColor: "#FFFFFF"
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "bottom" }
            }
          }
        });
      }
    }

    initAdminCharts();
    var chartScriptEl = document.getElementById("chartjsScript");
    if (chartScriptEl) chartScriptEl.addEventListener("load", initAdminCharts);
    window.addEventListener("load", initAdminCharts);
  });
})();


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
      navBtns.forEach(function (btn) {
        btn.classList.toggle("is-active", btn.dataset.tab === tabId);
      });
      tabPanels.forEach(function (panel) {
        var active = panel.dataset.panel === tabId;
        panel.classList.toggle("is-active", active);
        if (active && typeof gsap !== "undefined") {
          gsap.fromTo(panel, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });
        }
      });
      if (window.innerWidth < 1024) setSidebar(false);
    }

    navBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        switchTab(btn.dataset.tab);
      });
    });

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

    function addClientNotif(title, sub) {
      var list = document.getElementById("clientNotifList");
      var badge = document.getElementById("clientNotifBadge");
      if (list) {
        var div = document.createElement("div");
        div.className = "dash-popover-item";
        div.innerHTML = "<strong>" + title + "</strong><span>" + sub + "</span>";
        list.prepend(div);
      }
      if (badge) {
        badge.textContent = String((parseInt(badge.textContent, 10) || 0) + 1);
      }
    }

    /* Demo Document Upload Simulation */
    var uploadForm = document.getElementById("clientUploadForm");
    if (uploadForm) {
      uploadForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var titleEl = document.getElementById("uploadDocTitle");
        var catEl = document.getElementById("uploadDocCategory");
        var feedbackEl = document.getElementById("uploadFeedback");
        var tbody = document.getElementById("clientDocsTbody");
        var pendingKpi = document.getElementById("clientKpiPendingDocs");

        var docTitle = titleEl ? titleEl.value.trim() : "";
        var docCat = catEl ? catEl.value : "Tax Records";
        if (!docTitle) return;

        if (tbody) {
          var tr = document.createElement("tr");
          tr.innerHTML = "<td><strong>" + docTitle + "</strong></td><td>" + docCat + "</td><td>Today (Demo)</td><td><span class=\"status-badge status-badge--gold\">Submitted (Demo)</span></td><td><button type=\"button\" class=\"btn btn-outline-navy\" style=\"min-height:32px;padding:0.25rem 0.7rem;font-size:0.78rem;\" data-download-demo>Preview</button></td>";
          tbody.prepend(tr);
        }
        if (pendingKpi) {
          var cur = parseInt(pendingKpi.textContent, 10) || 0;
          if (cur > 0) pendingKpi.textContent = String(cur - 1);
        }
        addClientNotif("Document Uploaded: " + docTitle, "Category: " + docCat);
        if (feedbackEl) {
          feedbackEl.className = "form-feedback form-feedback--success is-visible";
          feedbackEl.textContent = "Demo document logged and shared with your STACKLY advisory team.";
        }
        uploadForm.reset();
      });
    }

    /* Demo Download Toast */
    document.addEventListener("click", function (e) {
      var dl = e.target.closest("[data-download-demo]");
      if (dl) {
        var orig = dl.textContent;
        dl.textContent = "Prepared (Demo)";
        setTimeout(function () { dl.textContent = orig; }, 1600);
      }
    });

    /* Client Consultation & Support Request Forms */
    var consultForm = document.getElementById("clientConsultForm");
    if (consultForm) {
      consultForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var topic = document.getElementById("clientConsultTopic");
        var msgList = document.getElementById("clientMessagesList");
        var fb = document.getElementById("clientConsultFeedback");
        var tVal = topic ? topic.value : "Tax Advisory Call";

        if (msgList) {
          var item = document.createElement("div");
          item.className = "dash-popover-item";
          item.innerHTML = "<strong>Consultation Request: " + tVal + "</strong><span>Assigned to Senior Partner Desk — Demo Confirmation</span>";
          msgList.prepend(item);
        }
        addClientNotif("Consultation Requested", tVal + " scheduled for review.");
        if (fb) {
          fb.className = "form-feedback form-feedback--success is-visible";
          fb.textContent = "Consultation request sent to your dedicated advisor (demo).";
        }
        consultForm.reset();
      });
    }

    var supportForm = document.getElementById("clientSupportForm");
    if (supportForm) {
      supportForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var subj = document.getElementById("clientSupportSubject");
        var fb = document.getElementById("clientSupportFeedback");
        var sVal = subj ? subj.value.trim() : "General Support Query";
        if (!sVal) return;

        addClientNotif("Support Ticket Opened", sVal);
        if (fb) {
          fb.className = "form-feedback form-feedback--success is-visible";
          fb.textContent = "Support ticket registered (Demo Reference #STK-8042).";
        }
        supportForm.reset();
      });
    }

    /* Chart.js Client Visualisations */
    if (typeof Chart !== "undefined") {
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
  });
})();


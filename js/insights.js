/* ==========================================================================
   Insights Category Filtering & Keyword Search
   ========================================================================== */

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var filterBtns = document.querySelectorAll(".filter-pill");
    var searchInput = document.getElementById("insightsSearchInput");
    var cards = document.querySelectorAll(".insight-filter-item");
    var emptyState = document.getElementById("insightsEmptyState");

    if (!cards.length) return;

    var activeCategory = "all";

    function applyFilter() {
      var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
      var visibleCount = 0;

      cards.forEach(function (card) {
        var cat = (card.dataset.category || "all").toLowerCase();
        var text = card.textContent.toLowerCase();
        var matchesCat = activeCategory === "all" || cat === activeCategory;
        var matchesQuery = !query || text.indexOf(query) !== -1;

        var show = matchesCat && matchesQuery;
        card.style.display = show ? "" : "none";
        if (show) visibleCount += 1;
      });

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? "block" : "none";
      }
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        activeCategory = (btn.dataset.filter || "all").toLowerCase();
        applyFilter();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", applyFilter);
    }
  });
})();


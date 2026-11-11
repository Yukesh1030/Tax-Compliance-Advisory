/* ==========================================================================
   Consultation Booking Interactive Slots & Live Preview
   ========================================================================== */

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("consultationForm");
    if (!form) return;

    var serviceSel = document.getElementById("consultService");
    var branchSel = document.getElementById("consultBranch");
    var dateInput = document.getElementById("consultDate");
    var timeHidden = document.getElementById("consultTime");
    var chips = document.querySelectorAll(".slot-chip");

    var sumService = document.getElementById("summaryService");
    var sumBranch = document.getElementById("summaryBranch");
    var sumDate = document.getElementById("summaryDate");
    var sumTime = document.getElementById("summaryTime");
    var feedback = document.getElementById("consultationFeedback");

    /* Set min date to today */
    if (dateInput) {
      var today = new Date().toISOString().split("T")[0];
      dateInput.setAttribute("min", today);
      if (!dateInput.value) dateInput.value = today;
    }

    function updateSummary() {
      if (sumService && serviceSel) sumService.textContent = serviceSel.value || "Direct Tax Advisory";
      if (sumBranch && branchSel) sumBranch.textContent = branchSel.value || "Bengaluru Branch Office";
      if (sumDate && dateInput) sumDate.textContent = dateInput.value || "Upcoming Business Day";
      if (sumTime && timeHidden) sumTime.textContent = timeHidden.value || "10:30 AM IST";
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("is-selected"); });
        chip.classList.add("is-selected");
        if (timeHidden) timeHidden.value = chip.dataset.slot || chip.textContent.trim();
        updateSummary();
      });
    });

    if (serviceSel) serviceSel.addEventListener("change", updateSummary);
    if (branchSel) branchSel.addEventListener("change", updateSummary);
    if (dateInput) dateInput.addEventListener("change", updateSummary);

    updateSummary();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (window.StacklyValidation && !window.StacklyValidation.validateForm(form)) {
        if (feedback) {
          feedback.className = "form-feedback form-feedback--error is-visible";
          feedback.textContent = "Please complete all required booking details.";
        }
        return;
      }

      if (feedback) {
        feedback.className = "form-feedback form-feedback--success is-visible";
        feedback.textContent = "Demo Confirmation: Your " + (serviceSel ? serviceSel.value : "Advisory") +
          " consultation at " + (branchSel ? branchSel.value : "STACKLY") +
          " on " + (dateInput ? dateInput.value : "") + " (" + (timeHidden ? timeHidden.value : "") + ") has been scheduled.";
      }
      form.reset();
      updateSummary();
    });
  });
})();


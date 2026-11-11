/* ==========================================================================
   Public Forms (Newsletter & Contact Enquiries) & FAQ Accordions
   ========================================================================== */

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    /* Enforce minimum today's date for no-past date inputs */
    if (window.StacklyValidation && window.StacklyValidation.getLocalTodayIso) {
      var todayIso = window.StacklyValidation.getLocalTodayIso();
      document.querySelectorAll('input[type="date"][data-no-past="true"]').forEach(function (dateEl) {
        if (!dateEl.getAttribute("min")) dateEl.setAttribute("min", todayIso);
      });
    }

    /* Inline Forms with Strict Validation & Post-Validation 404 Routing */
    document.querySelectorAll("form[data-stackly-form]").forEach(function (form) {
      var feedback = form.querySelector(".form-feedback") || (form.parentElement ? form.parentElement.querySelector(".form-feedback") : null);

      form.querySelectorAll("input, select, textarea").forEach(function (field) {
        field.addEventListener("blur", function () {
          if (window.StacklyValidation) {
            window.StacklyValidation.validateField(field);
          }
        });
        field.addEventListener("change", function () {
          if (window.StacklyValidation) {
            window.StacklyValidation.validateField(field);
          }
        });
        field.addEventListener("input", function () {
          if (field.classList.contains("is-invalid") && window.StacklyValidation) {
            window.StacklyValidation.validateField(field);
          }
          if (feedback && feedback.classList.contains("form-feedback--error") && window.StacklyValidation) {
            var remainingInvalid = form.querySelectorAll(".is-invalid").length;
            if (remainingInvalid === 0) {
              feedback.className = "form-feedback";
              feedback.textContent = "";
            }
          }
        });
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (window.StacklyValidation && !window.StacklyValidation.validateForm(form)) {
          var firstInvalid = form.querySelector(".is-invalid");
          if (feedback) {
            var fields = form.querySelectorAll("input, select, textarea");
            var errMsg = "Please review and correct the highlighted fields before submitting.";
            if (fields.length === 1 && firstInvalid && window.StacklyValidation.getFieldValidationError) {
              errMsg = window.StacklyValidation.getFieldValidationError(firstInvalid) || errMsg;
            }
            feedback.className = "form-feedback form-feedback--error is-visible";
            feedback.textContent = errMsg;
          }
          if (firstInvalid) firstInvalid.focus();
          return;
        }

        var redirectTarget = form.getAttribute("data-redirect") || "404.html";
        if (redirectTarget !== "none") {
          window.location.href = redirectTarget;
          return;
        }

        if (feedback) {
          feedback.className = "form-feedback form-feedback--success is-visible";
          feedback.textContent = form.dataset.successMsg || "Thank you. Your advisory request has been logged by our coordination desk.";
        }
        form.reset();
      });
    });

    /* FAQ Accordions */
    document.querySelectorAll(".faq-trigger").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.closest(".faq-item");
        if (!item) return;
        var parent = item.closest(".faq-list");
        var wasOpen = item.classList.contains("is-open");

        if (parent) {
          parent.querySelectorAll(".faq-item.is-open").forEach(function (openItem) {
            openItem.classList.remove("is-open");
            var t = openItem.querySelector(".faq-trigger");
            if (t) t.setAttribute("aria-expanded", "false");
          });
        }

        if (!wasOpen) {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
        } else {
          btn.setAttribute("aria-expanded", "false");
        }
      });
    });
  });
})();


/* ==========================================================================
   Shared Strict Form Validation Utilities
   ========================================================================== */

(function () {
  var strictEmailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  var allowedPhoneChars = /^[+]?[\d\s\-()]+$/;
  var strictNamePattern = /^[A-Za-z\u00C0-\u00FF][A-Za-z\u00C0-\u00FF\s'.-]{1,79}$/;

  function getLocalTodayIso() {
    var now = new Date();
    var yr = now.getFullYear();
    var mo = String(now.getMonth() + 1).padStart(2, "0");
    var dy = String(now.getDate()).padStart(2, "0");
    return yr + "-" + mo + "-" + dy;
  }

  function isValidCalendarDate(iso) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
    var parts = iso.split("-");
    var y = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    var d = parseInt(parts[2], 10);
    var dt = new Date(y, m - 1, d);
    return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
  }

  function countAlpha(str) {
    var matches = str.match(/[A-Za-z\u00C0-\u00FF]/g);
    return matches ? matches.length : 0;
  }

  function validateEmailValue(val) {
    if (!val || val.length > 254 || /\s/.test(val)) return false;
    var atIdx = val.indexOf("@");
    if (atIdx <= 0) return false;
    var local = val.slice(0, atIdx);
    if (local.length > 64 || local.startsWith(".") || local.endsWith(".") || val.indexOf("..") !== -1) {
      return false;
    }
    return strictEmailPattern.test(val);
  }

  function setFieldError(input, message) {
    if (!input) return;
    var group = input.closest(".form-group") || input.parentElement;
    var errEl = group ? group.querySelector(".form-error") : null;
    if (message) {
      input.classList.add("is-invalid");
      input.setAttribute("aria-invalid", "true");
      if (errEl) errEl.textContent = message;
    } else {
      input.classList.remove("is-invalid");
      input.removeAttribute("aria-invalid");
      if (errEl) errEl.textContent = "";
    }
  }

  function getFieldValidationError(input) {
    if (!input) return "";
    var raw = input.value || "";
    var val = raw.trim();
    var required = input.hasAttribute("required");
    var type = (input.getAttribute("type") || "").toLowerCase();
    var tag = input.tagName.toLowerCase();
    var mode = (input.getAttribute("data-validate") || "").toLowerCase();
    var minLen = parseInt(input.getAttribute("data-minlength") || "0", 10);
    var maxLen = parseInt(input.getAttribute("maxlength") || "0", 10);

    if (required && !val) {
      return input.dataset.requiredMsg || (tag === "select" ? "Please select an option." : "This field is required.");
    }
    if (!val) return "";

    if (maxLen > 0 && val.length > maxLen) {
      return "Must not exceed " + maxLen + " characters.";
    }

    if (type === "email" && !validateEmailValue(val)) {
      return "Please enter a valid work email address (e.g., name@company.com).";
    }

    if (type === "tel") {
      if (!allowedPhoneChars.test(val)) {
        return "Phone number may contain only digits, spaces, +, -, and parentheses.";
      }
      var digits = val.replace(/\D/g, "");
      if (digits.length < 10 || digits.length > 15) {
        return "Please enter a valid 10 to 15 digit phone number.";
      }
      if (/^(\d)\1+$/.test(digits)) {
        return "Please enter an authentic contact number.";
      }
    }

    if (type === "date") {
      if (!isValidCalendarDate(val)) {
        return "Please enter a valid calendar date.";
      }
      if (input.getAttribute("data-no-past") === "true" && val < getLocalTodayIso()) {
        return "Please select today or an upcoming business date.";
      }
      var maxYear = new Date().getFullYear() + 2;
      if (parseInt(val.slice(0, 4), 10) > maxYear) {
        return "Please choose a consultation date within the next two years.";
      }
    }

    if (mode === "name") {
      if (!strictNamePattern.test(val) || countAlpha(val) < 2) {
        return "Please enter a valid full name using letters only (min 2 characters).";
      }
    } else if (mode === "text" && countAlpha(val) < 2) {
      return "Please enter descriptive text containing at least 2 letters.";
    } else if (mode === "message" && countAlpha(val) < 5) {
      return "Please provide a meaningful brief with at least 5 alphabetic characters.";
    }

    if (minLen > 0 && val.length < minLen) {
      return "Must be at least " + minLen + " characters.";
    }

    return "";
  }

  function validateField(input) {
    if (!input) return true;
    var err = getFieldValidationError(input);
    setFieldError(input, err);
    return !err;
  }

  function validateForm(form) {
    if (!form) return false;
    var fields = form.querySelectorAll("input, select, textarea");
    var valid = true;
    fields.forEach(function (f) {
      if (!validateField(f)) valid = false;
    });
    return valid;
  }

  window.StacklyValidation = {
    validateField: validateField,
    validateForm: validateForm,
    setFieldError: setFieldError,
    getFieldValidationError: getFieldValidationError,
    getLocalTodayIso: getLocalTodayIso
  };
})();


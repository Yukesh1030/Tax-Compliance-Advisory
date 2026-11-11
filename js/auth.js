/* ==========================================================================
   Login & Signup Validation, Password Visibility Toggle & Role Redirection
   ========================================================================== */

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    /* Password Show/Hide Toggle */
    document.querySelectorAll(".password-toggle").forEach(function (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        var wrap = toggleBtn.closest(".input-icon-wrap");
        var input = wrap ? wrap.querySelector("input") : null;
        var icon = toggleBtn.querySelector("i");
        if (!input) return;

        var showing = input.getAttribute("type") === "text";
        input.setAttribute("type", showing ? "password" : "text");
        toggleBtn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
        if (icon) {
          icon.classList.toggle("fa-eye", showing);
          icon.classList.toggle("fa-eye-slash", !showing);
        }
      });
    });

    /* Login Form Handler */
    var loginForm = document.getElementById("loginForm");
    if (loginForm) {
      var loginRole = document.getElementById("loginAs");
      var loginEmail = document.getElementById("loginEmail");
      var loginPass = document.getElementById("loginPassword");
      var loginFeedback = document.getElementById("loginFeedback");

      [loginEmail, loginPass].forEach(function (f) {
        if (!f) return;
        f.addEventListener("blur", function () {
          if (window.StacklyValidation) window.StacklyValidation.validateField(f);
        });
        f.addEventListener("input", function () {
          if (f.classList.contains("is-invalid") && window.StacklyValidation) {
            window.StacklyValidation.validateField(f);
          }
        });
      });

      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (window.StacklyValidation && !window.StacklyValidation.validateForm(loginForm)) {
          if (loginFeedback) {
            loginFeedback.className = "form-feedback form-feedback--error is-visible";
            loginFeedback.textContent = "Please enter a valid email address and password.";
          }
          return;
        }

        var role = loginRole ? loginRole.value : "Client";
        var emailVal = loginEmail ? loginEmail.value.trim() : "client@stacklytax.com";

        /* Retrieve registered name if matching email */
        var displayName = role === "Admin" ? "Rajesh Nair (Managing Partner)" : "Arjun Mehta";
        try {
          var regRaw = localStorage.getItem("stackly_registered_user");
          if (regRaw) {
            var reg = JSON.parse(regRaw);
            if (reg && reg.email && reg.email.toLowerCase() === emailVal.toLowerCase() && reg.fullName) {
              displayName = reg.fullName;
            }
          }
          localStorage.setItem(
            "stackly_session",
            JSON.stringify({
              role: role,
              email: emailVal,
              name: displayName,
              signedInAt: new Date().toISOString()
            })
          );
        } catch (err) {
          /* Safe fallback if storage disabled */
        }

        if (loginFeedback) {
          loginFeedback.className = "form-feedback form-feedback--success is-visible";
          loginFeedback.textContent = "Authenticated as " + role + ". Redirecting to portal...";
        }

        var targetUrl = role === "Admin" ? "AdminDashboard.html" : "ClientDashboard.html";
        setTimeout(function () {
          window.location.href = targetUrl;
        }, 350);
      });
    }

    /* Signup Form Handler */
    var signupForm = document.getElementById("signupForm");
    if (signupForm) {
      var signupRole = document.getElementById("signupAs");
      var signupName = document.getElementById("signupFullName");
      var signupEmail = document.getElementById("signupEmail");
      var signupPass = document.getElementById("signupPassword");
      var signupFeedback = document.getElementById("signupFeedback");

      [signupName, signupEmail, signupPass].forEach(function (f) {
        if (!f) return;
        f.addEventListener("blur", function () {
          if (window.StacklyValidation) window.StacklyValidation.validateField(f);
        });
        f.addEventListener("input", function () {
          if (f.classList.contains("is-invalid") && window.StacklyValidation) {
            window.StacklyValidation.validateField(f);
          }
        });
      });

      signupForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (window.StacklyValidation && !window.StacklyValidation.validateForm(signupForm)) {
          if (signupFeedback) {
            signupFeedback.className = "form-feedback form-feedback--error is-visible";
            signupFeedback.textContent = "Please complete all fields accurately before signing up.";
          }
          return;
        }

        var roleVal = signupRole ? signupRole.value : "Client";
        var nameVal = signupName ? signupName.value.trim() : "Client User";
        var emailVal = signupEmail ? signupEmail.value.trim() : "";

        try {
          localStorage.setItem(
            "stackly_registered_user",
            JSON.stringify({
              role: roleVal,
              fullName: nameVal,
              email: emailVal,
              createdAt: new Date().toISOString()
            })
          );
        } catch (err) {
          /* Ignore storage quota errors */
        }

        if (signupFeedback) {
          signupFeedback.className = "form-feedback form-feedback--success is-visible";
          signupFeedback.textContent = "Account created for " + nameVal + ". Redirecting to Login...";
        }

        setTimeout(function () {
          window.location.href = "login.html";
        }, 700);
      });
    }
  });
})();


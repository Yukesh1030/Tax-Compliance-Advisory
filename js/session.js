/* ==========================================================================
   Shared Session Identity Helper (Email-to-Name Derivation & Initials)
   ========================================================================== */

(function () {
  var LEGACY_DEFAULT_NAMES = [
    "Rajesh Nair (Managing Partner)",
    "Rajesh Nair",
    "Arjun Mehta"
  ];

  /**
   * Derives a readable display name from an email's local-part.
   * Examples: "yukeshyuki18@gmail.com" -> "Yukeshyuki",
   *           "arjun.mehta@meridian.in" -> "Arjun Mehta".
   */
  function formatNameFromEmail(email) {
    var local = String(email || "").split("@")[0].trim();
    if (!local) return "";

    var rawTokens = local.split(/[._+\-]+/).filter(Boolean);
    var cleaned = rawTokens
      .map(function (tok) {
        return /[A-Za-z]/.test(tok) ? tok.replace(/\d+/g, "") : tok;
      })
      .filter(Boolean);

    var tokens = cleaned.length ? cleaned : rawTokens;
    return tokens
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  }

  /** Computes 2-letter avatar initials from a display name. */
  function getAvatarInitials(name, fallback) {
    var words = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (!words.length) return fallback || "ST";
    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  /**
   * Resolves the current session user identity for dashboards.
   * Ensures the displayed name tracks the signed-in email dynamically.
   */
  function resolveIdentity(defaultRole) {
    var fallbackEmail = defaultRole === "Admin" ? "partner@stacklytax.com" : "client@stacklytax.com";
    var fallbackName = defaultRole === "Admin" ? "Partner" : "Client";
    var session = {};
    try {
      session = JSON.parse(localStorage.getItem("stackly_session") || "{}") || {};
    } catch (e) {}

    var email = String(session.email || "").trim();
    var name = String(session.name || "").trim();

    if (email) {
      var fromEmail = formatNameFromEmail(email);
      if (!name || LEGACY_DEFAULT_NAMES.indexOf(name) !== -1) {
        name = fromEmail || fallbackName;
      }
    } else {
      email = fallbackEmail;
      if (!name || LEGACY_DEFAULT_NAMES.indexOf(name) !== -1) {
        name = formatNameFromEmail(fallbackEmail) || fallbackName;
      }
    }

    return {
      name: name,
      email: email,
      initials: getAvatarInitials(name, defaultRole === "Admin" ? "AD" : "CL")
    };
  }

  window.StacklySession = {
    formatNameFromEmail: formatNameFromEmail,
    getAvatarInitials: getAvatarInitials,
    resolveIdentity: resolveIdentity
  };
})();


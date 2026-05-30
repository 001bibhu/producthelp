(function () {
  var API_URL = "https://producthelp-api.onrender.com/api/search";

  function track(term) {
    if (!term || typeof term !== "string") {
      return;
    }

    var trimmed = term.trim();
    if (!trimmed) {
      return;
    }

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ term: trimmed }),
    }).catch(function () {
      // Fail silently
    });
  }

  window.productHelp = {
    track: track,
  };
})();

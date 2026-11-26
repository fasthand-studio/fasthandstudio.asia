// Paints the chosen theme before first paint. Same-origin file, so the CSP
// (default-src 'self', no inline scripts) is satisfied and there is no flash.
(function () {
  try {
    var root = document.documentElement;
    var stored = localStorage.getItem("fasthand-theme");
    var dark =
      stored === "dark" ||
      (stored !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.classList.toggle("dark", dark);
    root.classList.toggle("light", !dark);
  } catch (e) {
    /* private mode or an older browser: the media-query palette still applies */
  }
})();

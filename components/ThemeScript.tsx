const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("vllab-theme");
    var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var resolved = stored === "light" || stored === "dark"
      ? stored
      : (systemDark ? "dark" : "light");
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themeSource = stored || "system";
    document.documentElement.style.colorScheme = resolved;
  } catch (error) {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.style.colorScheme = "dark";
  }
})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}

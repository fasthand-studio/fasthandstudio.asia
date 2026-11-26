export type Theme = "light" | "dark";

const KEY = "fh-theme";

/* Runs inline in <head> before first paint so the chosen theme never flashes. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${KEY}");if(t!=="light"&&t!=="dark"){t=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}if(t==="dark"){document.documentElement.classList.add("dark")}}catch(e){}})();`;

export function currentTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function setTheme(next: Theme): void {
  const el = document.documentElement;
  // Opt-in crossfade: only present while a toggle happens, so ordinary
  // navigation and typing never pay for page-wide transitions.
  el.classList.add("theme-anim");
  el.classList.toggle("dark", next === "dark");
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* private mode: the choice just won't persist */
  }
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", next === "dark" ? "#11141d" : "#fbf9f5");
  window.setTimeout(() => el.classList.remove("theme-anim"), 450);
}

export function toggleTheme(): Theme {
  const next = currentTheme() === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}

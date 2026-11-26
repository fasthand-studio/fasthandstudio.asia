import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const KEY = "fasthand-theme";

// Matches --background in styles.css. Router merges same-name metas, so the one
// tag in __root.tsx is retinted here instead of split into media-keyed pairs.
const TINT: Record<Theme, string> = { light: "#fbf9f5", dark: "#212121" };

function syncTint(next: Theme) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", TINT[next]);
}

/** public/theme.js has already set the correct class on the client before hydration. */
function readTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyTheme(next: Theme, animate: boolean, remember: boolean) {
  const el = document.documentElement;
  if (animate) {
    el.classList.add("theming");
    window.setTimeout(() => el.classList.remove("theming"), 520);
  }
  el.classList.toggle("dark", next === "dark");
  el.classList.toggle("light", next === "light");
  syncTint(next);
  if (remember) {
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage unavailable: the switch still applies for this visit */
    }
  }
}

/**
 * Renders "light" on the server and on the first client pass, then adopts the
 * class theme.js already applied — no hydration mismatch. While the user has
 * made no explicit choice, system changes keep following the OS.
 */
export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const initial = readTheme();
    setTheme(initial);
    syncTint(initial);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystem = (e: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(KEY);
      } catch {
        stored = null;
      }
      if (stored !== "light" && stored !== "dark") {
        applyTheme(e.matches ? "dark" : "light", true, false);
        setTheme(e.matches ? "dark" : "light");
      }
    };
    media.addEventListener("change", onSystem);
    return () => media.removeEventListener("change", onSystem);
  }, []);

  return {
    theme,
    toggle: () => {
      const next: Theme = theme === "dark" ? "light" : "dark";
      applyTheme(next, true, true);
      setTheme(next);
    },
  };
}

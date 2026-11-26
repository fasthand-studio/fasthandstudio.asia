import MoonIcon from "icon-tree-animate/icons/moon";
import SunIcon from "icon-tree-animate/icons/sun";
import { toggleTheme } from "@/lib/theme";

/**
 * Light/dark switch. Both icons ship in the static markup (one hidden per
 * theme via the `dark:` variant), so server HTML always matches whatever
 * theme the init script picked — no hydration flicker either way.
 */
export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Switch between light and dark theme"
      title="Switch between light and dark theme"
      className="btn-32-icon border border-border text-foreground"
    >
      <span className="icon-anim icontree-icon inline-flex h-5 w-5 shrink-0 text-foreground dark:hidden">
        <SunIcon size={20} mode="onClick" />
      </span>
      <span className="icon-anim icontree-icon hidden h-5 w-5 shrink-0 text-foreground dark:inline-flex">
        <MoonIcon size={20} mode="onClick" />
      </span>
    </button>
  );
}

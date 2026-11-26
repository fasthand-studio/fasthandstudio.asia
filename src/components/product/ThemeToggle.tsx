import { useTheme } from "./theme";

// Eight rays, derived rather than hand-typed so the glyph stays symmetric.
const RAYS = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return {
    x1: +(12 + 7 * c).toFixed(2),
    y1: +(12 + 7 * s).toFixed(2),
    x2: +(12 + 9.2 * c).toFixed(2),
    y2: +(12 + 9.2 * s).toFixed(2),
  };
});

/**
 * The switch's own mark, drawn here rather than borrowed: rays collapse and a
 * mask nib slides over the disc to form a crescent, so the icon travels with the
 * palette for as long as the colours do. An IconTree Lottie would snap to its
 * baked colour the instant the class flips.
 */
function ThemeGlyph({ dark }: { dark: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      aria-hidden="true"
      data-mode={dark ? "dark" : "light"}
      className="theme-glyph shrink-0"
    >
      <mask id="theme-glyph-crescent">
        <rect x="0" y="0" width="24" height="24" fill="#fff" />
        <circle cx="16.4" cy="9.4" r="5.6" fill="#000" className="tg-nib" />
      </mask>
      <circle cx="12" cy="12" r="5" mask="url(#theme-glyph-crescent)" />
      <g className="tg-rays">
        {RAYS.map((r) => (
          <line key={`${r.x1}-${r.y1}`} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} />
        ))}
      </g>
    </svg>
  );
}

/**
 * Dark/light switch for the whole site. public/theme.js has already painted the
 * class before first paint, so this button only has to change it from here.
 */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  const label = dark ? "Switch to light theme" : "Switch to dark theme";
  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        title={label}
        className="btn-32 border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <ThemeGlyph dark={dark} />
        <span className="hidden lg:inline">{dark ? "Light" : "Dark"}</span>
      </button>
      <span role="status" className="sr-only">
        {dark ? "Dark theme active" : "Light theme active"}
      </span>
    </>
  );
}

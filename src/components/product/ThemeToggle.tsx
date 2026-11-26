import { useEffect, useRef, useState } from "react";

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

// Short lines: the wink is the point, not the essay.
const ANSWERS = [
  "Dark mode isn't in our nature.",
  "We only ship in white. Nice try, though.",
  "Paper and ink — that's the whole palette.",
];

const HIDE_AFTER = 3200;

/**
 * The one icon drawn in-house. It keeps the crescent as a joke it plays on
 * request: the nib slides in, carves a moon, and hands it straight back.
 */
function ThemeGlyph({ declining }: { declining: boolean }) {
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
      data-declining={declining ? "true" : "false"}
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
 * The site has a single theme, so this is not a switch: it is a question the
 * header invites you to ask. Clicking it answers in words and in the glyph, and
 * leaves the palette exactly where it was.
 */
export function ThemeToggle() {
  const [answer, setAnswer] = useState<number | null>(null);
  const [declining, setDeclining] = useState(false);
  // Re-keying the glyph restarts its animation on a click made while an earlier
  // answer is still on screen.
  const [beat, setBeat] = useState(0);
  const previous = useRef(-1);
  const hide = useRef<number | undefined>(undefined);
  const restore = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      window.clearTimeout(hide.current);
      window.clearTimeout(restore.current);
    },
    [],
  );

  const decline = () => {
    let pick = Math.floor(Math.random() * ANSWERS.length);
    if (pick === previous.current) pick = (pick + 1) % ANSWERS.length;
    previous.current = pick;

    window.clearTimeout(hide.current);
    window.clearTimeout(restore.current);
    setAnswer(pick);
    setDeclining(true);
    setBeat((n) => n + 1);
    restore.current = window.setTimeout(() => setDeclining(false), 850);
    hide.current = window.setTimeout(() => {
      setAnswer(null);
      setDeclining(false);
    }, HIDE_AFTER);
  };

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={decline}
        aria-label="Dark mode"
        title="Dark mode"
        aria-describedby={answer === null ? undefined : "theme-answer"}
        className="btn-32 border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <ThemeGlyph key={beat} declining={declining} />
        <span className="hidden lg:inline">Dark mode</span>
      </button>
      {answer !== null && (
        <span key={beat} id="theme-answer" role="status" className="theme-tease">
          {ANSWERS[answer]}
        </span>
      )}
    </span>
  );
}

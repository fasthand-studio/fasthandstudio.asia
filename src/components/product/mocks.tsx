import type { ReactNode } from "react";

/**
 * Realistic product-output mockups, rendered entirely in CSS (no images, CSP-safe).
 * Each is a black-on-white visual of what the product actually produces, so a
 * visitor sees the result without deploying anything. Decorative: the section's
 * prose carries the real content, so these are aria-hidden to assistive tech.
 */

function Bar({ w, cls = "" }: { w: string; cls?: string }) {
  return <span className={`block h-2 rounded-full bg-current ${cls}`} style={{ width: w }} />;
}

function MockFrame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="surface bg-card p-4 shadow-sm sm:p-5"
      style={{ maxWidth: 420 }}
    >
      {children}
    </div>
  );
}

/** FastyDiscord output: a GitHub activity embed posted into a Discord channel. */
export function DiscordEmbedMock() {
  return (
    <MockFrame label="Example of a GitHub pull-request embed as it appears in a Discord channel">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span aria-hidden className="grid h-6 w-6 place-items-center rounded-full bg-muted">
          #
        </span>
        github-activity
      </div>
      <div className="mt-3 flex items-start gap-3 rounded-lg bg-secondary p-3">
        <span aria-hidden className="mt-0.5 h-10 w-1 shrink-0 rounded-full bg-foreground" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-border text-[10px] font-bold"
            >
              F
            </span>
            <span className="truncate text-xs font-semibold">fasthand-studio/FastyDiscord</span>
          </div>
          <p className="mt-1.5 text-[15px] font-semibold leading-snug">
            Pull request opened: add weekly-report caching
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
            Stores the assembled report so the Friday job never recomputes it.
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-foreground" />
            #42 opened by you
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-2 text-foreground/80">
        <Bar w="70%" />
        <Bar w="48%" />
      </div>
    </MockFrame>
  );
}

/** FastHand OCR output: an uploaded document and the structured text it returns. */
export function OcrResultMock() {
  const words: [string, string][] = [
    ["BANGLADESH", "0.97"],
    ["NATIONAL", "0.96"],
    ["ID", "0.99"],
    ["CARD", "0.95"],
  ];
  return (
    <MockFrame label="Example of OCR output: recognized document words with confidence scores">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span aria-hidden className="grid h-6 w-6 place-items-center rounded-md bg-muted">
          ▤
        </span>
        document.jpg &rarr; text
      </div>
      <div className="mt-3 overflow-hidden rounded-lg border border-border bg-secondary">
        <div className="flex items-center justify-between px-3 py-2 text-[11px] text-muted-foreground">
          <span>detected text</span>
          <span className="font-mono">24 words</span>
        </div>
        <div className="flex flex-wrap gap-1.5 border-t border-border px-3 py-3">
          {words.map(([w, c]) => (
            <span
              key={w}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[13px] font-medium"
            >
              {w}
              <span className="font-mono text-[10px] text-muted-foreground">{c}</span>
            </span>
          ))}
          <span className="inline-flex items-center rounded-md border border-dashed border-border px-2 py-1 text-[13px] text-muted-foreground">
            +20 more
          </span>
        </div>
      </div>
      <div className="mt-3 space-y-2 text-foreground/80">
        <Bar w="82%" />
        <Bar w="55%" />
      </div>
    </MockFrame>
  );
}

/** Fast Notifications output: a push notification on a phone lock screen. */
export function NotificationMock() {
  return (
    <MockFrame label="Example of a push notification delivered to a device over the WebSocket">
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="font-mono">9:41</span>
        <span aria-hidden className="tracking-tight">
          ●●● ▮ ⌁
        </span>
      </div>
      <div className="mt-4 rounded-xl border border-border bg-secondary p-3">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-foreground text-[11px] font-bold text-primary-foreground"
          >
            F
          </span>
          <span className="text-xs font-semibold">FastHand</span>
          <span className="ml-auto text-[11px] text-muted-foreground">now</span>
        </div>
        <p className="mt-2 text-[15px] font-semibold leading-snug">New order #1042</p>
        <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
          You have received a new order for ৳ 1,850.00.
        </p>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-border p-3 text-[13px] text-muted-foreground">
        <span aria-hidden className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-muted">
          ▤
        </span>
        2 more waiting while offline
      </div>
    </MockFrame>
  );
}

import type { ReactNode } from "react";

/**
 * Custom scene graphics: isometric plates, layered silhouettes and token colours
 * only — the black-and-white identity, drawn rather than photographed.
 */
export function SceneFigure({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="surface mt-10 overflow-hidden">
      <div className="scene-frame overflow-x-auto bg-background/60 px-4 py-8 md:px-10 md:py-12">
        {children}
      </div>
      <figcaption className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}

/* ── Home · What's on the bench ─────────────────────────────────────────── */

export function BenchScene() {
  return (
    <svg
      viewBox="0 0 1200 420"
      role="img"
      aria-labelledby="bench-title bench-desc"
      className="mx-auto block h-auto w-full min-w-[900px] max-w-5xl text-foreground"
    >
      <title id="bench-title">The FastHand bench as an isometric diagram</title>
      <desc id="bench-desc">
        A GitHub organization plate feeds three product cards, which flow into a laptop on the
        studio bench — the site's repository list drawn from the live organization.
      </desc>
      {/* github plate (bottom of the stack) */}
      <g transform="translate(120 118)">
        <rect
          x="10"
          y="10"
          width="300"
          height="188"
          rx="22"
          className="fill-foreground"
          opacity="0.12"
        />
        <rect
          x="4"
          y="4"
          width="300"
          height="188"
          rx="22"
          className="fill-foreground"
          opacity="0.22"
        />
        <rect
          x="0"
          y="0"
          width="300"
          height="188"
          rx="22"
          className="fill-card stroke-border"
          strokeWidth="1.5"
        />
        <circle cx="40" cy="44" r="16" className="fill-none stroke-foreground" strokeWidth="1.5" />
        <path
          d="M34 46c1.5 4 4 6 6 6s4.5-2 6-6"
          className="fill-none stroke-foreground"
          strokeWidth="1.5"
        />
        <text x="68" y="49" className="fill-foreground font-mono text-[15px]">
          FastHand-Studio
        </text>
        <text x="28" y="86" className="fill-muted-foreground font-mono text-[12px]">
          github.com · public org
        </text>
        <g className="fill-none stroke-border" strokeWidth="1.5" strokeDasharray="3 5">
          <path d="M28 110h244M28 132h244M28 154h170" />
        </g>
        <g className="fill-foreground">
          <circle cx="244" cy="154" r="5" className="flow-ping" />
        </g>
        <text x="256" y="158" className="fill-muted-foreground font-mono text-[11px]">
          live
        </text>
      </g>
      {/* connector: plate to product cards */}
      <path
        d="M432 212 C 520 212, 560 210, 636 210"
        className="flow-line fill-none stroke-foreground"
        strokeWidth="1.5"
        strokeDasharray="6 8"
      />
      <path d="M628 202 l14 8 -14 8 z" className="fill-foreground" />
      {/* product card stack */}
      <g transform="translate(648 92)">
        {[
          ["FastHand OCR", "printed text, from a photo"],
          ["FastNotifications", "a socket per device"],
          ["FastyDiscord", "GitHub, in your channel"],
        ].map(([t, d], i) => (
          <g key={t} transform={`translate(${i * 26} ${i * 84 - 26})`}>
            <rect
              x="0"
              y="0"
              width="356"
              height="70"
              rx="18"
              className="fill-card stroke-border"
              strokeWidth="1.5"
            />
            <rect x="14" y="14" width="6" height="42" rx="3" className="fill-foreground" />
            <text x="36" y="32" className="fill-foreground font-mono text-[14px] font-semibold">
              {t}
            </text>
            <text x="36" y="54" className="fill-muted-foreground text-[13px]">
              {d}
            </text>
            <text x="322" y="32" className="fill-muted-foreground font-mono text-[11px]">
              0{i + 1}
            </text>
          </g>
        ))}
      </g>
      {/* laptop */}
      <g transform="translate(80 258)">
        <path d="M0 108 L214 108 L188 0 L26 0 Z" className="fill-foreground" opacity="0.15" />
        <path
          d="M6 100 L206 100 L184 8 L28 8 Z"
          className="fill-card stroke-foreground"
          strokeWidth="1.5"
        />
        <path d="M-18 128 L226 128 L206 100 L6 100 Z" className="fill-foreground" opacity="0.9" />
        <g className="fill-background" opacity="0.5">
          <rect x="10" y="106" width="192" height="8" rx="3" />
        </g>
        <g className="fill-none stroke-muted-foreground" strokeWidth="1.5">
          <path d="M48 30h100M48 44h120M48 58h80M48 72h110" transform="skewX(-8)" />
        </g>
      </g>
      <text
        x="60"
        y="410"
        className="fill-muted-foreground font-mono text-[12px] uppercase tracking-wider"
      >
        the bench
      </text>
      <text x="1064" y="410" className="fill-muted-foreground font-mono text-[12px]">
        fasthandstudio.asia
      </text>
    </svg>
  );
}

/* ── FastHand OCR · the claim, drawn ────────────────────────────────────── */

export function OcrNoticeScene() {
  return (
    <svg
      viewBox="0 0 520 560"
      role="img"
      aria-labelledby="ocr-scene-title ocr-scene-desc"
      className="mx-auto block h-auto w-full min-w-[400px] max-w-[480px] text-foreground"
    >
      <title id="ocr-scene-title">A photographed notice read by the OCR endpoint</title>
      <desc id="ocr-scene-desc">
        A tilted paper notice with three type sizes; dashed recognition boxes surround the words and
        the far end of the sheet fades, standing in for a shallow depth of field.
      </desc>
      <ellipse cx="260" cy="512" rx="190" ry="20" className="fill-foreground" opacity="0.06" />
      {/* paper thickness: offset stacked sheets */}
      <g transform="translate(96 66) rotate(-4)">
        <rect
          x="14"
          y="14"
          width="320"
          height="420"
          rx="10"
          className="fill-foreground"
          opacity="0.14"
        />
        <rect
          x="7"
          y="7"
          width="320"
          height="420"
          rx="10"
          className="fill-foreground"
          opacity="0.26"
        />
        <rect
          x="0"
          y="0"
          width="320"
          height="420"
          rx="10"
          className="fill-card stroke-border"
          strokeWidth="1.5"
        />
        {/* heading row — large print */}
        <rect
          x="26"
          y="30"
          width="200"
          height="26"
          rx="4"
          className="fill-foreground"
          opacity="0.9"
        />
        <rect
          x="26"
          y="66"
          width="120"
          height="14"
          rx="3"
          className="fill-foreground"
          opacity="0.55"
        />
        {/* body rows — small print, fading toward the far end */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={i}
            x="26"
            y={104 + i * 26}
            width={268 - ((i * 47) % 90)}
            height="10"
            rx="3"
            className="fill-foreground"
            opacity={String(Math.max(0.16, 0.5 - i * 0.06))}
          />
        ))}
        {/* recognition boxes: dashed, with corner ticks */}
        <g
          className="fill-none stroke-foreground flow-dash"
          strokeWidth="1.25"
          strokeDasharray="5 4"
        >
          <rect x="20" y="24" width="212" height="38" rx="4" />
          <rect x="20" y="98" width="150" height="22" rx="4" />
          <rect x="180" y="98" width="120" height="22" rx="4" />
        </g>
        <text x="238" y="50" className="fill-foreground font-mono text-[12px]">
          ✓
        </text>
        <text x="24" y="264" className="fill-muted-foreground font-mono text-[11px]">
          Cyrillic · 3 type sizes · oblique angle
        </text>
        {/* defocus band: far rows dissolve into dots */}
        <g className="fill-foreground" opacity="0.22">
          {[0, 1, 2, 3, 4].map((i) =>
            [0, 1, 2, 3, 4, 5, 6, 7].map((j) => (
              <circle key={`${i}-${j}`} cx={28 + j * 30} cy={292 + i * 24} r="3.5" />
            )),
          )}
        </g>
      </g>
      {/* response card floating off the sheet */}
      <g transform="translate(312 402) rotate(-4)">
        <rect
          x="8"
          y="8"
          width="192"
          height="96"
          rx="14"
          className="fill-foreground"
          opacity="0.12"
        />
        <rect
          x="0"
          y="0"
          width="192"
          height="96"
          rx="14"
          className="fill-background stroke-foreground"
          strokeWidth="1.5"
        />
        <text x="16" y="30" className="fill-foreground font-mono text-[12px]">
          {`{ "text": "…"`}
        </text>
        <text x="16" y="52" className="fill-foreground font-mono text-[12px]">
          "confidence": 0.98
        </text>
        <text x="16" y="74" className="fill-muted-foreground font-mono text-[12px]">
          {"}"}
        </text>
      </g>
    </svg>
  );
}

/* ── FastNotifications · the phone nobody is holding ────────────────────── */

export function PhoneQueueScene() {
  return (
    <svg
      viewBox="0 0 1100 470"
      role="img"
      aria-labelledby="phone-scene-title phone-scene-desc"
      className="mx-auto block h-auto w-full min-w-[860px] text-foreground"
    >
      <title id="phone-scene-title">An idle phone with a queue of notifications rising to it</title>
      <desc id="phone-scene-desc">
        A flat-lying phone drawn in isometric view, its screen dark; above it a stack of message
        cards waits in order, the nearest one bright as it arrives.
      </desc>
      <ellipse cx="392" cy="420" rx="300" ry="22" className="fill-foreground" opacity="0.05" />
      {/* table plane */}
      <path d="M120 388 L664 388 L604 316 L180 316 Z" className="fill-foreground" opacity="0.08" />
      {/* phone lying flat (skewed), kept fully inside the frame */}
      <g transform="translate(214 148) skewX(-30)">
        <rect
          x="12"
          y="12"
          width="150"
          height="270"
          rx="26"
          className="fill-foreground"
          opacity="0.18"
        />
        <rect
          x="0"
          y="0"
          width="150"
          height="270"
          rx="26"
          className="fill-foreground stroke-foreground"
          strokeWidth="1.5"
        />
        <rect
          x="12"
          y="14"
          width="126"
          height="242"
          rx="18"
          className="fill-background"
          opacity="0.22"
        />
      </g>
      <text x="252" y="128" className="fill-muted-foreground font-mono text-[12px]">
        screen dark · nobody holding it
      </text>
      {/* queue: cards stacked in 3D, rising to the phone */}
      <g transform="translate(560 66)">
        {[0, 1, 2, 3].map((i) => {
          const y = i * 84;
          const near = i === 3;
          return (
            <g key={i} transform={`translate(${(3 - i) * -34} ${y})`}>
              <rect
                x="7"
                y="7"
                width="300"
                height="64"
                rx="16"
                className="fill-foreground"
                opacity={near ? "0.22" : "0.08"}
              />
              <rect
                x="0"
                y="0"
                width="300"
                height="64"
                rx="16"
                className={near ? "fill-foreground" : "fill-card stroke-border"}
                strokeWidth="1.5"
              />
              <circle
                cx="30"
                cy="32"
                r="10"
                className={near ? "fill-background" : "fill-none stroke-border"}
                strokeWidth="1.5"
              />
              <rect
                x="54"
                y="20"
                width="150"
                height="9"
                rx="3"
                className={near ? "fill-background" : "fill-foreground"}
                opacity={near ? "0.9" : "0.35"}
              />
              <rect
                x="54"
                y="37"
                width="100"
                height="7"
                rx="3"
                className={near ? "fill-background" : "fill-foreground"}
                opacity={near ? "0.55" : "0.2"}
              />
              <text
                x="284"
                y="36"
                textAnchor="end"
                className={
                  near
                    ? "fill-background font-mono text-[11px]"
                    : "fill-muted-foreground font-mono text-[11px]"
                }
              >
                {i === 0 ? "queued" : i === 3 ? "delivering" : "waiting"}
              </text>
            </g>
          );
        })}
      </g>
      {/* arrow from queue to phone */}
      <path
        d="M552 348 C 470 372, 372 372, 264 364"
        className="flow-line fill-none stroke-foreground"
        strokeWidth="1.5"
        strokeDasharray="6 8"
      />
      <path d="M270 356 l-14 8 14 8 z" className="fill-foreground" />
      <text x="700" y="428" className="fill-muted-foreground font-mono text-[12px]">
        the queue drains the moment a socket opens
      </text>
    </svg>
  );
}

/* ── FastNotifications · hibernation, drawn as a line that stays up ─────── */

export function SocketLineScene() {
  return (
    <svg
      viewBox="0 0 480 520"
      role="img"
      aria-labelledby="line-scene-title line-scene-desc"
      className="mx-auto block h-auto w-full max-w-[440px] text-foreground"
    >
      <title id="line-scene-title">A hibernating WebSocket over time</title>
      <desc id="line-scene-desc">
        A vertical line stays connected while the object idles (dashed, un-billed), wakes for one
        push, writes a frame, and idles again — the same shape as a utility pole keeping its line.
      </desc>
      {/* the pole rail */}
      <rect
        x="74"
        y="34"
        width="6"
        height="452"
        rx="3"
        className="fill-foreground"
        opacity="0.12"
      />
      <text x="40" y="24" className="fill-muted-foreground font-mono text-[11px]">
        t0
      </text>
      <text x="40" y="498" className="fill-muted-foreground font-mono text-[11px]">
        t1
      </text>
      {/* connection state column */}
      <g className="fill-none stroke-foreground" strokeWidth="2">
        <path d="M104 60 v86" />
        <path d="M104 178 v72" className="flow-dash" strokeDasharray="4 7" opacity="0.45" />
        <path d="M104 268 v46" />
        <path d="M104 332 v130" className="flow-dash" strokeDasharray="4 7" opacity="0.45" />
      </g>
      {[
        { y: 60, t: "connect", d: ["the socket registers — one request opens it"], hot: false },
        {
          y: 268,
          t: "wake + frame",
          d: ["a push starts the object; the frame rides", "the socket that never closed"],
          hot: true,
        },
      ].map(({ y, t, d, hot }) => (
        <g key={t} transform={`translate(0 ${y})`}>
          <circle
            cx="104"
            r="7"
            className={hot ? "fill-foreground" : "fill-background stroke-foreground"}
            strokeWidth="2"
          />
          <text x="128" y="4" className="fill-foreground font-mono text-[13px] font-semibold">
            {t}
          </text>
          <text x="128" y="24" className="fill-muted-foreground text-[12px]">
            {d.map((line, li) => (
              <tspan key={line} x="128" dy={li === 0 ? 0 : 16}>
                {line}
              </tspan>
            ))}
          </text>
        </g>
      ))}
      {/* idle markers */}
      <g className="fill-foreground" opacity="0.28">
        <rect x="94" y="206" width="20" height="4" rx="2" />
        <rect x="94" y="392" width="20" height="4" rx="2" />
      </g>
      <text x="128" y="210" className="fill-muted-foreground font-mono text-[11px]">
        idle · registered · not billed
      </text>
      <text x="128" y="396" className="fill-muted-foreground font-mono text-[11px]">
        idle again · next push repeats
      </text>
      {/* phone node at the far end */}
      <g transform="translate(368 42)">
        <rect
          x="6"
          y="6"
          width="64"
          height="104"
          rx="12"
          className="fill-foreground"
          opacity="0.14"
        />
        <rect
          x="0"
          y="0"
          width="64"
          height="104"
          rx="12"
          className="fill-card stroke-border"
          strokeWidth="1.5"
        />
        <rect
          x="10"
          y="12"
          width="44"
          height="72"
          rx="7"
          className="fill-foreground"
          opacity="0.85"
        />
        <text x="8" y="98" className="fill-muted-foreground font-mono text-[10px]">
          device
        </text>
      </g>
      <path
        d="M104 120 C 200 120, 300 96, 366 90"
        className="flow-line fill-none stroke-border"
        strokeWidth="1.5"
        strokeDasharray="5 6"
      />
    </svg>
  );
}

/* ── FastyDiscord · the relay that never sleeps ─────────────────────────── */

export function RelayScene() {
  return (
    <svg
      viewBox="0 0 1100 430"
      role="img"
      aria-labelledby="relay-title relay-desc"
      className="mx-auto block h-auto w-full min-w-[860px] text-foreground"
    >
      <title id="relay-title">GitHub events reaching Discord through the serverless relay</title>
      <desc id="relay-desc">
        Three isometric plates in a row: a GitHub event card, a Vercel function tile suspended over
        a night/day dial, and a Discord message bubble with typing dots — events travel whether or
        not anyone is at a desk.
      </desc>
      {/* plate 1 — GitHub event */}
      <g transform="translate(96 112)">
        <rect
          x="12"
          y="12"
          width="264"
          height="176"
          rx="24"
          className="fill-foreground"
          opacity="0.15"
        />
        <rect
          x="0"
          y="0"
          width="264"
          height="176"
          rx="24"
          className="fill-card stroke-border"
          strokeWidth="1.5"
        />
        <circle cx="44" cy="46" r="15" className="fill-none stroke-foreground" strokeWidth="1.5" />
        <text x="70" y="52" className="fill-foreground font-mono text-[14px]">
          push · main
        </text>
        <g className="fill-foreground" opacity="0.4">
          <rect x="26" y="80" width="180" height="8" rx="3" />
          <rect x="26" y="100" width="130" height="8" rx="3" />
          <rect x="26" y="120" width="160" height="8" rx="3" />
        </g>
        <text x="26" y="156" className="fill-muted-foreground font-mono text-[11px]">
          webhook, signed
        </text>
      </g>
      <path
        d="M374 200 C 420 200, 440 200, 478 200"
        className="flow-line fill-none stroke-foreground"
        strokeWidth="1.5"
        strokeDasharray="6 8"
      />
      <path d="M470 192 l14 8 -14 8 z" className="fill-foreground" />
      {/* plate 2 — serverless, floating above a 24h dial */}
      <g transform="translate(492 96)">
        <ellipse cx="140" cy="222" rx="120" ry="16" className="fill-foreground" opacity="0.08" />
        <circle
          cx="140"
          cy="216"
          r="90"
          className="fill-none stroke-border"
          strokeWidth="1.5"
          strokeDasharray="2 10"
        />
        <text x="116" y="252" className="fill-muted-foreground font-mono text-[11px]">
          24/7
        </text>
        <g
          className="fill-none stroke-foreground"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        >
          <path d="M140 216 v-40" />
          <path d="M140 216 h26" />
        </g>
        <rect
          x="12"
          y="12"
          width="256"
          height="120"
          rx="22"
          className="fill-foreground"
          opacity="0.18"
        />
        <rect
          x="0"
          y="0"
          width="256"
          height="120"
          rx="22"
          className="fill-foreground stroke-foreground"
          strokeWidth="1.5"
        />
        <path
          d="M128 26 L154 70 L102 70 Z"
          className="fill-none stroke-background"
          strokeWidth="1.5"
        />
        <text x="24" y="96" className="fill-background font-mono text-[12px]">
          no bot process · no desk
        </text>
      </g>
      <path
        d="M762 176 C 810 176, 830 176, 868 176"
        className="flow-line fill-none stroke-foreground"
        strokeWidth="1.5"
        strokeDasharray="6 8"
      />
      <path d="M860 168 l14 8 -14 8 z" className="fill-foreground" />
      {/* plate 3 — Discord bubble */}
      <g transform="translate(884 96)">
        <rect
          x="12"
          y="12"
          width="180"
          height="128"
          rx="26"
          className="fill-foreground"
          opacity="0.15"
        />
        <rect
          x="0"
          y="0"
          width="180"
          height="128"
          rx="26"
          className="fill-card stroke-border"
          strokeWidth="1.5"
        />
        <path d="M36 128 l-10 26 30-16" className="fill-card stroke-border" strokeWidth="1.5" />
        <circle cx="44" cy="46" r="12" className="fill-none stroke-foreground" strokeWidth="1.5" />
        <rect
          x="66"
          y="38"
          width="88"
          height="9"
          rx="3"
          className="fill-foreground"
          opacity="0.6"
        />
        <g className="fill-foreground">
          <circle cx="52" cy="86" r="6" className="hero-typing-dot" />
          <circle cx="74" cy="86" r="6" className="hero-typing-dot d2" />
          <circle cx="96" cy="86" r="6" className="hero-typing-dot d3" />
        </g>
        <text x="116" y="92" className="fill-muted-foreground font-mono text-[11px]">
          #activity
        </text>
      </g>
      <text x="96" y="410" className="fill-muted-foreground font-mono text-[12px]">
        a push at 03:00 lands exactly like a push at 15:00
      </text>
    </svg>
  );
}

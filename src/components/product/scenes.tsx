import type { ReactNode } from "react";

/**
 * Custom scene graphics: isometric forms, solid token colours and flat surfaces
 * only. The black-and-white identity stays drawn rather than photographed.
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
      {/* table plane */}
      <path d="M120 388 L664 388 L604 316 L180 316 Z" className="fill-foreground" opacity="0.08" />
      {/* phone lying flat (skewed), kept fully inside the frame */}
      <g transform="translate(214 148) skewX(-30)">
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
        push, writes a frame, and idles again. The shape matches a utility pole keeping its line.
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
        { y: 60, t: "connect", d: ["the socket registers: one request opens it"], hot: false },
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

import type { ReactNode } from "react";

export type FlowNode = { t: string; d: string };

type DiagramStep = { t: string; d: string };

function Marker({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={id}
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M0 0 L10 5 L0 10 z" className="fill-foreground" />
      </marker>
    </defs>
  );
}

function StepsBlock({ heading, steps }: { heading: string; steps: DiagramStep[] }) {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold">{heading}</h3>
      <ol className="mt-3 divide-y divide-border border-y border-border">
        {steps.map((s, i) => (
          <li key={s.t} className="flex gap-4 py-3.5">
            <span className="font-mono text-sm font-semibold text-muted-foreground">{i + 1}</span>
            <span>
              <span className="font-semibold text-foreground">{s.t}</span>{" "}
              <span className="text-muted-foreground">&mdash; {s.d}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Figure({
  label,
  caption,
  steps,
  stepsHeading,
  children,
}: {
  label: string;
  caption: string;
  steps: DiagramStep[];
  stepsHeading?: string;
  children: ReactNode;
}) {
  return (
    <figure className="mt-10" aria-label={label}>
      {children}
      <figcaption className="mt-4 text-sm text-muted-foreground">{caption}</figcaption>
      <StepsBlock heading={stepsHeading ?? "The same flow in words"} steps={steps} />
    </figure>
  );
}

function Box({
  x,
  y,
  w,
  h,
  n,
  strong,
  dashed,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  n: FlowNode;
  strong?: boolean;
  dashed?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* offset outline: a flat "printed sheet" depth behind every node */}
      <rect
        x={6}
        y={6}
        width={w}
        height={h}
        rx={Math.min(26, h / 2)}
        className="fill-none stroke-border"
        strokeWidth={1}
        opacity="0.7"
      />
      <rect
        width={w}
        height={h}
        rx={Math.min(26, h / 2)}
        className={
          dashed
            ? "fill-card stroke-border"
            : strong
              ? "fill-card stroke-foreground"
              : "fill-card stroke-border"
        }
        strokeWidth={strong ? 1.5 : 1}
        strokeDasharray={dashed ? "5 5" : undefined}
      />
      <text
        x={w / 2}
        y={h / 2 - 6}
        textAnchor="middle"
        className="fill-foreground"
        fontSize="15"
        fontWeight="600"
      >
        {n.t}
      </text>
      <text
        x={w / 2}
        y={h / 2 + 16}
        textAnchor="middle"
        className="fill-muted-foreground"
        fontSize="12"
      >
        {n.d}
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ *
 * Pipeline: equal stages in a line. Right for sequential routing.
 * ------------------------------------------------------------------ */

const NODE_W = 226;
const NODE_H = 88;
const GAP = 28;
const PITCH = NODE_W + GAP;

export function FlowDiagram({
  nodes,
  caption,
  steps,
}: {
  nodes: FlowNode[];
  caption: string;
  steps: DiagramStep[];
}) {
  const markerId = `flow-arrow-${(nodes[0]?.t ?? "n").replace(/\W/g, "")}`;
  const hWidth = nodes.length * PITCH - GAP;
  const vHeight = nodes.length * (NODE_H + GAP) - GAP;
  const label = `${caption} ${steps.map((s, i) => `Step ${i + 1}: ${s.t}. ${s.d}`).join(" ")}`;

  return (
    <Figure label={label} caption={caption} steps={steps}>
      <svg
        viewBox={`0 0 ${hWidth + 8} ${NODE_H + 8}`}
        role="img"
        aria-label={label}
        className="hidden w-full md:block"
        fill="none"
      >
        <Marker id={markerId} />
        {nodes.map((n, i) => (
          <Box key={i} x={i * PITCH} y={0} w={NODE_W} h={NODE_H} n={n} />
        ))}
        {nodes.slice(0, -1).map((n, i) => (
          <path
            key={i}
            d={`M${i * PITCH + NODE_W + 3} ${NODE_H / 2} h${GAP - 7}`}
            className="stroke-foreground"
            strokeWidth="1.5"
            markerEnd={`url(#${markerId})`}
          />
        ))}
      </svg>
      <svg
        viewBox={`0 0 282 ${vHeight + 8}`}
        role="img"
        aria-label={label}
        className="mx-auto block w-full max-w-[282px] md:hidden"
        fill="none"
      >
        <Marker id={`${markerId}-v`} />
        {nodes.map((n, i) => (
          <g key={i}>
            <Box x={28} y={i * (NODE_H + GAP)} w={NODE_W} h={NODE_H} n={n} />
            {i < nodes.length - 1 && (
              <path
                d={`M141 ${i * (NODE_H + GAP) + NODE_H + 3} v${GAP - 7}`}
                className="stroke-foreground"
                strokeWidth="1.5"
                markerEnd={`url(#${markerId}-v)`}
              />
            )}
          </g>
        ))}
      </svg>
    </Figure>
  );
}

/* ------------------------------------------------------------------ *
 * Transform: one thing becomes another. Right for encode/decode,
 * request/response-shape stories (e.g. image -> JSON).
 * ------------------------------------------------------------------ */

export function TransformDiagram({
  input,
  via,
  viaSub,
  outputLines,
  caption,
  steps,
}: {
  input: FlowNode;
  via: string;
  viaSub: string;
  outputLines: string[];
  caption: string;
  steps: DiagramStep[];
}) {
  const id = `tr-${input.t.replace(/\W/g, "")}`;
  const label = `${caption} ${steps.map((s, i) => `Step ${i + 1}: ${s.t}. ${s.d}`).join(" ")}`;
  const cardH = 190;

  return (
    <Figure label={label} caption={caption} steps={steps} stepsHeading="The same request in words">
      {/* Desktop: document card  ──[ Workers AI ]──  code card */}
      <svg
        viewBox={`0 0 1052 ${cardH + 60}`}
        role="img"
        aria-label={label}
        className="hidden w-full md:block"
        fill="none"
      >
        <Marker id={id} />
        <g transform="translate(6 30)">
          <rect
            x={7}
            y={7}
            width={300}
            height={cardH}
            rx={24}
            className="fill-none stroke-border"
            opacity="0.7"
          />
          <rect width={300} height={cardH} rx={24} className="fill-card stroke-border" />
          <text x={24} y={36} className="fill-foreground" fontSize="15" fontWeight="600">
            {input.t}
          </text>
          <text x={24} y={58} className="fill-muted-foreground" fontSize="12">
            {input.d}
          </text>
          {/* document glyph: header rule + body lines */}
          <rect
            x={24}
            y={78}
            width={120}
            height={9}
            rx={4.5}
            className="fill-foreground"
            opacity="0.85"
          />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x={24}
              y={100 + i * 17}
              width={i % 2 ? 210 - i * 18 : 252 - i * 10}
              height={7}
              rx={3.5}
              className="fill-foreground"
              opacity="0.28"
            />
          ))}
        </g>
        <path
          d={`M322 ${30 + cardH / 2} h${400}`}
          className="stroke-foreground"
          strokeWidth="1.5"
          markerEnd={`url(#${id})`}
        />
        <rect
          x={420}
          y={30 + cardH / 2 - 30}
          width={210}
          height={60}
          rx={30}
          className="fill-background stroke-foreground"
          strokeWidth="1.2"
        />
        <text
          x={525}
          y={30 + cardH / 2 - 4}
          textAnchor="middle"
          className="fill-foreground"
          fontSize="13"
          fontWeight="600"
        >
          {via}
        </text>
        <text
          x={525}
          y={30 + cardH / 2 + 16}
          textAnchor="middle"
          className="fill-muted-foreground"
          fontSize="11"
        >
          {viaSub}
        </text>
        <g transform={`translate(734 30)`}>
          <rect
            x={7}
            y={7}
            width={300}
            height={cardH}
            rx={24}
            className="fill-none stroke-border"
            opacity="0.7"
          />
          <rect width={300} height={cardH} rx={24} className="fill-card stroke-border" />
          <text x={24} y={36} className="fill-foreground" fontSize="15" fontWeight="600">
            JSON response
          </text>
          {outputLines.map((line, i) => (
            <text
              key={i}
              x={24}
              y={66 + i * 21}
              className="fill-muted-foreground"
              fontSize="12"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            >
              {line}
            </text>
          ))}
        </g>
      </svg>
      {/* Mobile: stacked, arrow down */}
      <svg
        viewBox="-4 -4 312 490"
        role="img"
        aria-label={label}
        className="mx-auto block w-full max-w-[300px] md:hidden"
        fill="none"
      >
        <Marker id={`${id}-v`} />
        <g transform="translate(0 0)">
          <rect
            x={3}
            y={3}
            width={300}
            height={170}
            rx={24}
            className="fill-none stroke-border"
            opacity="0.7"
          />
          <rect width={300} height={170} rx={24} className="fill-card stroke-border" />
          <text x={24} y={36} className="fill-foreground" fontSize="15" fontWeight="600">
            {input.t}
          </text>
          <text x={24} y={58} className="fill-muted-foreground" fontSize="12">
            {input.d}
          </text>
          <rect
            x={24}
            y={78}
            width={110}
            height={8}
            rx={4}
            className="fill-foreground"
            opacity="0.85"
          />
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={24}
              y={98 + i * 16}
              width={i % 2 ? 180 - i * 14 : 230 - i * 12}
              height={6}
              rx={3}
              className="fill-foreground"
              opacity="0.28"
            />
          ))}
        </g>
        <path
          d="M150 178 v50"
          className="stroke-foreground"
          strokeWidth="1.5"
          markerEnd={`url(#${id}-v)`}
        />
        <text x={164} y={196} className="fill-foreground" fontSize="12" fontWeight="600">
          {via}
        </text>
        <text x={164} y={212} className="fill-muted-foreground" fontSize="10">
          {viaSub}
        </text>
        <path
          d="M150 252 v40"
          className="stroke-foreground"
          strokeWidth="1.5"
          markerEnd={`url(#${id}-v)`}
        />
        <g transform="translate(0 300)">
          <rect
            x={3}
            y={3}
            width={300}
            height={170}
            rx={24}
            className="fill-none stroke-border"
            opacity="0.7"
          />
          <rect width={300} height={170} rx={24} className="fill-card stroke-border" />
          <text x={24} y={36} className="fill-foreground" fontSize="15" fontWeight="600">
            JSON response
          </text>
          {outputLines.map((line, i) => (
            <text
              key={i}
              x={24}
              y={66 + i * 20}
              className="fill-muted-foreground"
              fontSize="11"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            >
              {line}
            </text>
          ))}
        </g>
      </svg>
    </Figure>
  );
}

/* ------------------------------------------------------------------ *
 * Hub: one coordinator, many endpoints. Right for per-user actors,
 * fan-out delivery, broadcast topologies.
 * ------------------------------------------------------------------ */

export function HubDiagram({
  source,
  hub,
  devices,
  queue,
  caption,
  steps,
}: {
  source: FlowNode;
  hub: FlowNode;
  devices: FlowNode[];
  queue: FlowNode;
  caption: string;
  steps: DiagramStep[];
}) {
  const id = `hub-${hub.t.replace(/\W/g, "")}`;
  const label = `${caption} ${steps.map((s, i) => `Step ${i + 1}: ${s.t}. ${s.d}`).join(" ")}`;
  const devY = (i: number) => 10 + i * 104;

  return (
    <Figure label={label} caption={caption} steps={steps} stepsHeading="The same message in words">
      <svg
        viewBox="0 0 1040 400"
        role="img"
        aria-label={label}
        className="hidden w-full md:block"
        fill="none"
      >
        <Marker id={id} />
        <Box x={0} y={140} w={220} h={88} n={source} />
        <path
          d="M228 184 h72"
          className="stroke-foreground"
          strokeWidth="1.5"
          markerEnd={`url(#${id})`}
        />
        {/* hub: the heavyweight of this topology */}
        <Box x={308} y={116} w={300} h={136} n={hub} strong />
        {devices.map((dv, i) => (
          <g key={i}>
            <Box x={760} y={devY(i)} w={272} h={88} n={dv} />
            <path
              d={`M614 ${170 + i * 14} C 680 ${164 - i * 20} 700 ${devY(i) + 60} 752 ${devY(i) + 44}`}
              className="stroke-foreground"
              strokeWidth="1.3"
              markerEnd={`url(#${id})`}
            />
          </g>
        ))}
        {/* queue: dashed — the fallback path */}
        <Box x={338} y={308} w={240} h={76} n={queue} dashed />
        <path
          d="M458 252 v48"
          className="stroke-foreground"
          strokeWidth="1.3"
          strokeDasharray="5 5"
          markerEnd={`url(#${id})`}
        />
        <text x={474} y={282} className="fill-muted-foreground" fontSize="11">
          every device offline
        </text>
        {/* queued messages leave again once a device reconnects */}
        <path
          d="M580 336 C 700 336 830 286 890 212"
          className="stroke-foreground"
          strokeWidth="1.3"
          strokeDasharray="5 5"
          markerEnd={`url(#${id})`}
        />
        <text x={700} y={352} className="fill-muted-foreground" fontSize="11">
          on reconnect
        </text>
      </svg>
      {/* Mobile: hub-centered star */}
      <svg
        viewBox="0 0 300 640"
        role="img"
        aria-label={label}
        className="mx-auto block w-full max-w-[300px] md:hidden"
        fill="none"
      >
        <Marker id={`${id}-v`} />
        <Box x={20} y={0} w={260} h={84} n={source} />
        <path
          d="M150 90 v34"
          className="stroke-foreground"
          strokeWidth="1.5"
          markerEnd={`url(#${id}-v)`}
        />
        <Box x={20} y={132} w={260} h={120} n={hub} strong />
        <path
          d="M150 258 v40"
          className="stroke-foreground"
          strokeWidth="1.3"
          markerEnd={`url(#${id}-v)`}
        />
        {devices.map((dv, i) => (
          <Box key={i} x={20} y={306 + i * 104} w={260} h={84} n={dv} />
        ))}
        <Box x={20} y={540} w={260} h={84} n={queue} dashed />
        <path
          d="M150 474 v20 M150 494 v38"
          className="stroke-foreground"
          strokeWidth="1.3"
          strokeDasharray="5 5"
          markerEnd={`url(#${id}-v)`}
          transform="translate(0 22)"
        />
      </svg>
    </Figure>
  );
}

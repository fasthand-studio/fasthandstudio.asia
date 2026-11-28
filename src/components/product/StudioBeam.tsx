"use client";

import { forwardRef, useRef, type ReactNode } from "react";
import { Compass, Palette, Webhook, BellRing, ScanText } from "lucide-react";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { GitIcon } from "@/components/product/icons";
import { FASTHAND_OCR, FASTNOTIFICATIONS, FASTYDISCORD, FASTYBROWSER } from "./catalog";
import { GITHUB_ORG } from "@/lib/github.functions";

/** One round node. Flat: a hairline border, no shadow. */
const Circle = forwardRef<HTMLDivElement, { className?: string; children?: ReactNode }>(
  ({ className, children }, ref) => (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border border-border bg-card text-foreground sm:size-14",
        className,
      )}
    >
      {children}
    </div>
  ),
);
Circle.displayName = "Circle";

type NodeSpec = {
  label: string;
  href: string;
  icon: ReactNode;
  external?: boolean;
};

const ICON = "size-5 sm:size-6";

const TOP: NodeSpec[] = [
  { label: "FastHand OCR", href: FASTHAND_OCR.href, icon: <ScanText className={ICON} /> },
  {
    label: "FastNotifications",
    href: FASTNOTIFICATIONS.href,
    icon: <BellRing className={ICON} />,
  },
  { label: "FastyDiscord", href: FASTYDISCORD.href, icon: <Webhook className={ICON} /> },
];

const BOTTOM: NodeSpec[] = [
  { label: "FastyBrowser", href: FASTYBROWSER.href, icon: <Compass className={ICON} /> },
  {
    label: "Plainspoken",
    href: `https://github.com/${GITHUB_ORG}/Plainspoken`,
    icon: <Palette className={ICON} />,
    external: true,
  },
  {
    label: "GitHub org",
    href: `https://github.com/${GITHUB_ORG}`,
    icon: <GitIcon />,
    external: true,
  },
];

function NodeLink({
  node,
  circleRef,
  labelFirst,
}: {
  node: NodeSpec;
  circleRef: React.RefObject<HTMLDivElement | null>;
  labelFirst?: boolean;
}) {
  const label = (
    <span className="max-w-full text-center text-[12px] leading-tight font-medium sm:text-sm">
      {node.label}
    </span>
  );
  return (
    <a
      href={node.href}
      {...(node.external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="relative z-10 mx-auto flex min-h-11 w-full max-w-[112px] flex-col items-center gap-2 hover:opacity-80"
    >
      {labelFirst && label}
      <Circle ref={circleRef}>{node.icon}</Circle>
      {!labelFirst && label}
    </a>
  );
}

/**
 * The studio at the centre, three lines in from above and three from below.
 * Layout is the same on a phone: three columns that each fit in ~110px.
 */
export function StudioBeam() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const topRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const bottomRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  // Curvature bows the outer lines away from the hub; the middle one stays straight.
  const bow = [-40, 0, -40];

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex w-full max-w-xl flex-col justify-between gap-12 overflow-hidden py-2 sm:gap-16"
    >
      <ul className="grid grid-cols-3 gap-2" aria-label="Products">
        {TOP.map((n, i) => (
          <li key={n.label}>
            <NodeLink node={n} circleRef={topRefs[i]!} labelFirst />
          </li>
        ))}
      </ul>

      <div className="flex justify-center">
        <Circle ref={hubRef} className="size-16 sm:size-20">
          <img src="/logo.svg" alt="FastHand Studio" width={45} height={30} className="h-7 w-auto" />
        </Circle>
      </div>

      <ul className="grid grid-cols-3 gap-2" aria-label="Browser, design system and organization">
        {BOTTOM.map((n, i) => (
          <li key={n.label}>
            <NodeLink node={n} circleRef={bottomRefs[i]!} />
          </li>
        ))}
      </ul>

      {topRefs.map((r, i) => (
        <AnimatedBeam
          key={`t${i}`}
          axis="y"
          containerRef={containerRef}
          fromRef={r}
          toRef={hubRef}
          curvature={bow[i]!}
          delay={i * 0.4}
          duration={4}
        />
      ))}
      {bottomRefs.map((r, i) => (
        <AnimatedBeam
          key={`b${i}`}
          axis="y"
          reverse
          containerRef={containerRef}
          fromRef={r}
          toRef={hubRef}
          curvature={-bow[i]!}
          delay={i * 0.4 + 0.2}
          duration={4}
        />
      ))}
    </div>
  );
}

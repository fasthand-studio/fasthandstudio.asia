import type { ReactNode } from "react";

/**
 * Plain-language note beside a technical term. Rendered inline (never hover-only)
 * so it survives keyboard, touch and screen-reader use.
 */
export function Gloss({ term, note }: { term: string; note: string }) {
  return (
    <p className="mt-3 border-l-2 border-border pl-3 text-[13px] leading-relaxed text-muted-foreground">
      <dfn className="font-mono text-foreground">{term}</dfn>
      <span aria-hidden> — </span>
      {note}
    </p>
  );
}

/** Visible closing action for a section: what the reader should do next. */
export function NextStep({
  href,
  action,
  children,
  external,
}: {
  href: string;
  action: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-border pt-5">
      <p className="text-[15px] text-muted-foreground">{children}</p>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        className="btn-32 border border-border"
      >
        {action}
        <span aria-hidden> →</span>
      </a>
    </div>
  );
}

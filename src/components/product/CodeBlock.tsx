import { useEffect, useRef, useState } from "react";

type CopyState = "idle" | "ok" | "fail";

export function CodeBlock({ label, code, note }: { label?: string; code: string; note?: string }) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setState("ok");
    } catch {
      setState("fail");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2500);
  }

  return (
    <figure className="surface overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-border bg-secondary px-4 py-2">
        <figcaption className="truncate font-mono text-xs text-muted-foreground">
          {label ?? "example"}
        </figcaption>
        <button
          type="button"
          onClick={copy}
          aria-label={
            state === "ok" ? "Code copied to clipboard" : `Copy ${label ?? "code"} to clipboard`
          }
          className="btn-32 border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {state === "ok" ? "Copied" : state === "fail" ? "Copy failed" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed text-foreground md:text-sm">
        <code>{code}</code>
      </pre>
      {note ? <p className="px-4 pb-4 text-sm text-muted-foreground">{note}</p> : null}
      <span aria-live="polite" className="sr-only">
        {state === "ok"
          ? "Copied to clipboard"
          : state === "fail"
            ? "Copy failed. Select the code and copy it manually."
            : ""}
      </span>
    </figure>
  );
}

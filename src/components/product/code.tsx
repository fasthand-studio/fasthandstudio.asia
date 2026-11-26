import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [status, setStatus] = useState("");
  return (
    <>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setStatus("Copied to clipboard");
          } catch {
            setStatus("Copy failed — select the text and copy manually");
          }
        }}
        aria-label="Copy this snippet"
        className="btn-32 border border-border bg-background text-foreground"
      >
        Copy
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {status}
      </span>
    </>
  );
}

export function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <figure className="mt-4">
      <div className="flex items-center justify-between gap-3">
        <figcaption className="text-sm text-muted-foreground">{label}</figcaption>
        <CopyButton text={code} />
      </div>
      <pre className="surface mt-2 overflow-x-auto bg-muted p-4 font-mono text-[13px] leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </figure>
  );
}

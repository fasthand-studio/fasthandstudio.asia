export function ProductSection({
  id,
  kicker,
  title,
  lead,
  children,
  next,
  tone = "plain",
}: {
  id?: string;
  kicker: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
  next?: { href: string; label: string; external?: boolean };
  tone?: "plain" | "muted";
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-16 border-t border-border ${tone === "muted" ? "bg-secondary" : ""}`}
    >
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="max-w-2xl">
          <p className="font-mono text-sm text-muted-foreground">{kicker}</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h2>
          {lead && <p className="mt-3 text-muted-foreground">{lead}</p>}
        </div>
        <div className="mt-10">{children}</div>
        {next && (
          <p className="mt-10">
            <a
              href={next.href}
              {...(next.external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="btn-32 border border-border hover:bg-muted"
            >
              {next.label} →
            </a>
          </p>
        )}
      </div>
    </section>
  );
}

export function DiagramCaption({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 text-center text-sm text-muted-foreground md:text-left">{children}</p>;
}

export function StepList({ steps }: { steps: [string, string][] }) {
  return (
    <ol className="grid gap-0">
      {steps.map(([t, d], i) => (
        <li
          key={t}
          className="grid grid-cols-[28px_1fr] gap-3 border-b border-border py-3 first:border-t"
        >
          <span className="font-mono text-[13px] text-muted-foreground">{i + 1}</span>
          <span>
            <span className="block font-semibold">{t}</span>
            <span className="mt-1 block text-[15px] text-muted-foreground">{d}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

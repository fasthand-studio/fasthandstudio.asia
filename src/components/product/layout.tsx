import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/theme-toggle";

export function GitIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export function ProductHeader({ repo }: { repo: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 md:px-8">
        <a href="/" className="flex shrink-0 items-center gap-2 font-semibold">
          <img src="/logo.svg" alt="" width={45} height={30} className="h-[30px] w-[45px]" />
          FastHand Studio
        </a>
        <nav className="flex items-center gap-1 text-[15px]">
          <a
            href="/products"
            className="btn-32 hidden font-normal text-muted-foreground hover:bg-muted sm:inline-flex"
          >
            Products
          </a>
          <a
            href="#how"
            className="btn-32 hidden font-normal text-muted-foreground hover:bg-muted md:inline-flex"
          >
            How it works
          </a>
          <a
            href="#setup"
            className="btn-32 hidden font-normal text-muted-foreground hover:bg-muted md:inline-flex"
          >
            Setup
          </a>
          <a
            href={repo}
            target="_blank"
            rel="noreferrer"
            className="btn-32 bg-primary text-primary-foreground"
          >
            <GitIcon /> Get the code
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

export function SectionHead({
  kicker,
  title,
  intro,
}: {
  kicker: string;
  title: string;
  intro: ReactNode;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm text-muted-foreground">{kicker}</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-3 text-muted-foreground">{intro}</p>
    </div>
  );
}

export function NextStep({ href, label }: { href: string; label: string }) {
  return (
    <p className="mt-10 flex flex-wrap items-center gap-3 text-sm">
      <span className="opacity-70">Next</span>
      <a href={href} className="btn-32 border border-current/40">
        {label} <span aria-hidden>&darr;</span>
      </a>
    </p>
  );
}

/** A technical term followed by a short plain-language note. */
export function Term({ t, note }: { t: string; note: string }) {
  return (
    <>
      <span className="font-medium text-foreground">{t}</span>{" "}
      <span className="text-muted-foreground">({note})</span>
    </>
  );
}

/** A standalone plain-language note explaining one term used nearby. */
export function TermNote({ term, children }: { term: string; children: ReactNode }) {
  return (
    <p className="mt-3 text-sm text-muted-foreground">
      <span className="font-mono text-[13px] font-semibold text-foreground">{term}</span>{" "}
      <span aria-hidden>&mdash;</span> {children}
    </p>
  );
}

export function EcosystemFooter({
  repo,
  crossLinks,
}: {
  repo: string;
  crossLinks: { href: string; label: string }[];
}) {
  return (
    <footer>
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <p className="text-sm text-muted-foreground">More from the FastHand ecosystem</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {crossLinks.map((l) => (
            <a key={l.href} href={l.href} className="btn-44 border border-border">
              {l.label}
            </a>
          ))}
          <a href="/products" className="btn-44 bg-secondary">
            All products
          </a>
          <a href="/#work" className="btn-44 bg-secondary">
            All studio work
          </a>
        </div>
        <div className="mt-14 flex h-14 flex-wrap items-center justify-between gap-2 border-t border-border pt-6 text-sm text-muted-foreground">
          <span>
            &copy; {new Date().getFullYear()} FastHand Studio &middot; fasthandstudio.asia
          </span>
          <a href={repo} target="_blank" rel="noreferrer" className="hover:text-foreground">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { getRepos, GITHUB_ORG, type Repo } from "@/lib/github.functions";
import { ThemeToggle } from "@/components/theme-toggle";
import { FeatureIcon, Icons, type IconComponent } from "@/components/product/icons";

const reposQuery = queryOptions({
  queryKey: ["repos"],
  queryFn: () => getRepos(),
  staleTime: 5 * 60 * 1000,
});

const ORIGIN = "https://fasthandstudio.asia";

export const Route = createFileRoute("/")({
  // Title, description and social tags come from the root head. This route only
  // adds the page-level structured data.
  head: () => ({
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${ORIGIN}/#webpage`,
          url: `${ORIGIN}/`,
          name: "FastHand Studio — the development studio behind the FastHand ecosystem",
          description:
            "FastHand Studio writes the tools, software and open-source code of the FastHand ecosystem in public: repositories, docs and a community that contributes back.",
          isPartOf: { "@id": `${ORIGIN}/#website` },
          publisher: { "@id": `${ORIGIN}/#organization` },
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: `${ORIGIN}/og.png`,
            width: 1200,
            height: 630,
          },
          about: { "@id": `${ORIGIN}/#organization` },
          inLanguage: "en",
        }),
      },
    ],
  }),
  component: Index,
});

const GH = `https://github.com/${GITHUB_ORG}`;

function Index() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Intro />
        <Focus />
        <Ecosystem />
        <section id="work" className="border-t border-border">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-xl">
                <p className="text-sm text-muted-foreground">Live from GitHub</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">What's on the bench</h2>
                <p className="mt-3 text-muted-foreground">
                  This list is read straight from our organization. When a repository is created,
                  pushed to, or removed, it shows up here.
                </p>
              </div>
              <a href={GH} target="_blank" rel="noreferrer" className="btn-32 border border-border">
                <GitIcon /> {GITHUB_ORG}
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-3">
              <li>
                <a href="/products" className="btn-32 border border-border font-semibold">
                  Products: FastyDiscord, FastHand OCR, Fast Notifications
                </a>
              </li>
            </ul>
            <Suspense fallback={<RepoSkeleton />}>
              <Repos />
            </Suspense>
          </div>
        </section>
        <Community />
        <Philosophy />
        <Closing />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 md:px-8">
        <a href="/" className="flex shrink-0 items-center gap-2 font-semibold">
          <img src="/logo.svg" alt="" width={45} height={30} className="h-[30px] w-[45px]" />
          FastHand Studio
        </a>
        <nav className="flex items-center gap-1 text-[15px]">
          <a
            href="#focus"
            className="btn-32 hidden font-normal text-muted-foreground hover:bg-muted sm:inline-flex"
          >
            Focus
          </a>
          <a
            href="#work"
            className="btn-32 hidden font-normal text-muted-foreground hover:bg-muted sm:inline-flex"
          >
            Work
          </a>
          <a
            href="#community"
            className="btn-32 hidden font-normal text-muted-foreground hover:bg-muted sm:inline-flex"
          >
            Community
          </a>
          <a
            href="/products"
            className="btn-32 hidden font-normal text-muted-foreground hover:bg-muted sm:inline-flex"
          >
            Products
          </a>
          <a
            href={GH}
            target="_blank"
            rel="noreferrer"
            className="btn-32 bg-primary text-primary-foreground"
          >
            GitHub
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-[1.1fr_1fr] md:px-8 md:py-24">
      <div>
        <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight md:text-[56px]">
          We build the parts of FastHand you can run, fork, and ship.
        </h1>
        <p className="mt-5 max-w-lg text-muted-foreground">
          FastHand Studio is the development studio inside the FastHand ecosystem. We write tools,
          software and open-source code, and we do it in public with the people who use it.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#work" className="btn-44 bg-primary text-primary-foreground">
            See current work
          </a>
          <a href={GH} target="_blank" rel="noreferrer" className="btn-44 border border-border">
            <GitIcon /> Follow on GitHub
          </a>
        </div>
      </div>
      <StudioStack />
    </section>
  );
}

function StudioStack() {
  const layers = [0, 1, 2, 3, 4];
  return (
    <div className="scene relative mx-auto aspect-square w-full max-w-[440px]" aria-hidden>
      <div className="stack absolute inset-[18%]">
        {layers.map((i) => (
          <div
            key={i}
            className={`plate ${i === 4 ? "ink" : ""}`}
            style={{ transform: `translateZ(${i * 34}px)` }}
          >
            {i === 2 && (
              <div
                className="absolute inset-[22%] rounded-[32px] border-2 border-foreground"
                style={
                  {
                    cornerShape: "superellipse(1.5)",
                  } as React.CSSProperties
                }
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Intro() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-16 md:grid-cols-[200px_1fr] md:px-8 md:py-24">
        <p className="text-sm text-muted-foreground">The studio</p>
        <p className="max-w-3xl text-2xl leading-snug tracking-tight md:text-[28px]">
          FastHand is the ecosystem. The studio is where its code gets written. We keep a small core
          team, a public issue tracker, and a habit of releasing things before they're perfect so
          other people can make them better.
        </p>
      </div>
    </section>
  );
}

const focus = [
  {
    t: "Tools",
    d: "Command-line utilities and libraries we needed ourselves first.",
    icon: Icons.setting,
  },
  {
    t: "Software",
    d: "Applications that sit on top of those tools and get used daily.",
    icon: Icons.monitor,
  },
  {
    t: "Open source",
    d: "Most of what we write is public, licensed, and open to pull requests.",
    icon: Icons.code,
  },
  {
    t: "Experiments",
    d: "Short-lived prototypes. Some become projects, most get archived.",
    icon: Icons["magic-star"],
  },
];

function Focus() {
  return (
    <section id="focus" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <h2 className="text-3xl font-semibold tracking-tight">What we spend our time on</h2>
        <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {focus.map((f, i) => (
            <div key={f.t} className="border-t border-foreground pt-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-muted-foreground tabular-nums">0{i + 1}</p>
                <FeatureIcon C={f.icon} />
              </div>
              <h3 className="mt-3 text-xl font-semibold">{f.t}</h3>
              <p className="mt-2 text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const parts = [
  { t: "Products", ic: Icons.component },
  { t: "Community", ic: Icons.people },
  { t: "Docs", ic: Icons.book },
];

function Ecosystem() {
  return (
    <section className="border-t border-border bg-secondary">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-[1fr_1.2fr] md:px-8 md:py-24">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">One part of something larger</h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            FastHand is a family of products, people and ideas. The studio is the engine room: when
            something in the ecosystem needs to be built or maintained, it usually starts here.
          </p>
        </div>
        <div className="surface p-6 md:p-8">
          <div className="hidden xl:block">
            <div className="flex justify-center">
              <EcosystemNode t="FastHand" d="the ecosystem" />
            </div>
            <div className="mx-auto h-6 w-px bg-border" />
            <div className="flex justify-center">
              <EcosystemNode t="Studio" d="the builders" current />
            </div>
            <div className="mx-auto h-7 w-px bg-border" />
            <div className="flex">
              {parts.map((p) => (
                <div key={p.t} className="tree-branch min-w-0 flex-1 px-1.5">
                  <EcosystemPart t={p.t} ic={p.ic} cls="h-16 flex-col justify-center gap-1" />
                </div>
              ))}
            </div>
          </div>
          <div className="xl:hidden">
            <EcosystemNode t="FastHand" d="the ecosystem" />
            <div className="ml-[13px] h-6 w-px bg-border" />
            <EcosystemNode t="Studio" d="the builders" current />
            <div className="ml-[13px] h-6 w-px bg-border" />
            <ul>
              {parts.map((p) => (
                <li key={p.t} className="tree-twig py-1.5 pl-8">
                  <EcosystemPart t={p.t} ic={p.ic} cls="h-14 items-center gap-3" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function EcosystemNode({ t, d, current }: { t: string; d: string; current?: boolean }) {
  return (
    <div
      className={`inline-flex flex-col items-center px-6 py-3 ${
        current ? "bg-primary text-primary-foreground" : "border border-border bg-card"
      }`}
      style={{ borderRadius: 24, cornerShape: "superellipse(1.5)" } as React.CSSProperties}
    >
      <span className="text-base font-semibold">{t}</span>
      <span
        className={`text-xs ${current ? "text-primary-foreground/60" : "text-muted-foreground"}`}
      >
        {d}
      </span>
    </div>
  );
}

function EcosystemPart({ t, ic, cls }: { t: string; ic: IconComponent; cls: string }) {
  return (
    <div
      className={`flex border border-border p-3 text-[15px] font-semibold text-muted-foreground ${cls}`}
      style={{ borderRadius: 20, cornerShape: "superellipse(1.5)" } as React.CSSProperties}
    >
      <FeatureIcon C={ic} px={24} />
      {t}
    </div>
  );
}

function Repos() {
  const { data } = useSuspenseQuery(reposQuery);
  if (data.error || data.repos.length === 0) {
    return (
      <p className="mt-10 text-muted-foreground">
        {data.error ? "GitHub isn't answering right now. " : "No public repositories yet. "}
        <a
          href={GH}
          className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
          target="_blank"
          rel="noreferrer"
        >
          Open the organization on GitHub
        </a>
        .
      </p>
    );
  }
  return (
    <ul className="mt-10 divide-y divide-border border-y border-border">
      {data.repos.map((r) => (
        <RepoRow key={r.id} r={r} />
      ))}
    </ul>
  );
}

function RepoRow({ r }: { r: Repo }) {
  const date = new Date(r.updatedAt).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return (
    <li>
      <a
        href={r.url}
        target="_blank"
        rel="noreferrer"
        className="grid gap-1 py-5 transition-colors hover:bg-muted md:grid-cols-[1fr_2fr_auto] md:items-center md:gap-8 md:px-3"
      >
        <span className="font-semibold">{r.name}</span>
        <span className="text-muted-foreground">{r.description ?? "No description yet."}</span>
        <span className="flex gap-4 text-sm text-muted-foreground">
          {r.language && <span>{r.language}</span>}
          <span>★ {r.stars}</span>
          <span>{date}</span>
        </span>
      </a>
    </li>
  );
}

function RepoSkeleton() {
  return (
    <ul className="mt-10 divide-y divide-border border-y border-border">
      {[0, 1, 2, 3].map((i) => (
        <li key={i} className="h-16 animate-pulse bg-muted/40" />
      ))}
    </ul>
  );
}

const ways = [
  {
    t: "Open an issue",
    d: "Bugs, ideas, odd edge cases. All welcome.",
    icon: Icons.danger,
  },
  {
    t: "Send a pull request",
    d: "Small fixes get merged fastest.",
    icon: Icons["arrow-swap-horizontal"],
  },
  {
    t: "Start a discussion",
    d: "Ask how something works or why we chose it.",
    icon: Icons["message-circle"],
  },
  {
    t: "Build on top",
    d: "Fork it, extend it, tell us what you made.",
    icon: Icons.component,
  },
];

function Community() {
  return (
    <section id="community" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Built with the people who use it
            </h2>
            <p className="mt-4 text-muted-foreground">
              Developers and creators shape most of our roadmap. If you've hit a wall with one of
              our tools, you probably know something we don't yet.
            </p>
          </div>
          <ul className="divide-y divide-border border-y border-border">
            {ways.map((w) => (
              <li key={w.t} className="flex items-center gap-5 py-4">
                <FeatureIcon C={w.icon} px={28} />
                <span className="w-48 shrink-0 font-semibold">{w.t}</span>
                <span className="text-muted-foreground">{w.d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Philosophy() {
  return (
    <section className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <p className="max-w-3xl text-2xl leading-snug tracking-tight md:text-[32px]">
          Ship early. Keep it readable. Write it down. Leave the code better than you found it — and
          make sure someone else can pick it up tomorrow.
        </p>
        <p className="mt-6 text-sm opacity-60">How the studio works</p>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-5 py-16 md:px-8 md:py-20">
        <h2 className="max-w-lg text-3xl font-semibold tracking-tight">
          Pick a repository and make your first contribution.
        </h2>
        <div className="flex flex-wrap gap-3">
          <a
            href={GH}
            target="_blank"
            rel="noreferrer"
            className="btn-44 bg-primary text-primary-foreground"
          >
            <GitIcon /> Go to GitHub
          </a>
          <a href="#work" className="btn-44 bg-secondary">
            Browse work
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 text-sm text-muted-foreground md:px-8">
        <span>© {new Date().getFullYear()} FastHand Studio · fasthandstudio.asia</span>
        <a href={GH} target="_blank" rel="noreferrer" className="hover:text-foreground">
          GitHub
        </a>
      </div>
    </footer>
  );
}

function GitIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

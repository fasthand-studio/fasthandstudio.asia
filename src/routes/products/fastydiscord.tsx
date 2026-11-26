import { createFileRoute } from "@tanstack/react-router";
import { PRODUCTS } from "@/components/product/data";
import {
  EcosystemFooter,
  GitIcon,
  NextStep,
  ProductHeader,
  SectionHead,
  Term,
  TermNote,
} from "@/components/product/layout";
import { CodeBlock } from "@/components/product/code";
import { FeatureIcon, Icons, type IconRow } from "@/components/product/icons";
import { DiscordEmbedMock } from "@/components/product/mocks";
import { FlowDiagram } from "@/components/product/diagram";
import { crossLinks } from "@/components/product/data";

const P = PRODUCTS[0];
const REPO = P.repo;
const ZIP = P.zip;
const ORIGIN = "https://fasthandstudio.asia";

export const Route = createFileRoute("/products/fastydiscord")({
  head: () => ({
    meta: [
      { title: "FastyDiscord — GitHub activity & weekly reports in Discord | FastHand Studio" },
      {
        name: "description",
        content:
          "FastyDiscord brings GitHub activity notifications and weekly contribution reports into Discord. Serverless on Vercel, stored in Supabase, no VPS required.",
      },
      { property: "og:type", content: "product" },
      {
        property: "og:title",
        content: "FastyDiscord — GitHub activity & weekly reports in Discord",
      },
      {
        property: "og:description",
        content:
          "GitHub activity notifications and weekly reports inside Discord. Serverless on Vercel with Supabase — no VPS required.",
      },
      { property: "og:url", content: `${ORIGIN}/products/fastydiscord` },
      { name: "twitter:card", content: "summary_large_image" },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "FastyDiscord",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          codeRepository: REPO,
          url: `${ORIGIN}/products/fastydiscord`,
          softwareVersion: "1.0",
          description:
            "GitHub activity and weekly contribution reports in Discord, running serverless on Vercel with Supabase.",
        },
      },
    ],
    links: [{ rel: "canonical", href: `${ORIGIN}/products/fastydiscord` }],
  }),
  component: FastyDiscord,
});

const features = [
  {
    t: "Repository tracking",
    d: "Register as many repositories per Discord server as you need. A GitHub App reads commits, branches and metadata on your behalf — no personal tokens pasted into dashboards.",
    icon: Icons["folder-2"],
  },
  {
    t: "Activity notifications",
    d: "Pushes, commits, pull requests, releases and issues arrive as clean embeds in the channel you pick. Every delivery is verified and deduplicated before it posts.",
    icon: Icons["direct-notification"],
  },
  {
    t: "Slash commands",
    d: "Ask for data without leaving the channel: /stats, /contributors, /repositories, /weekly and /repo answer from the tracked history in milliseconds.",
    icon: Icons.command,
  },
  {
    t: "Weekly reports",
    d: "Every Friday a report lands in your report channel: totals, per-repo summaries, top contributors, code stats, a contribution heatmap — plus an optional AI summary.",
    icon: Icons["chart-2"],
  },
];

const commands = [
  {
    c: "/stats",
    d: "Commit, PR and issue totals for the server or one repository over a time window.",
  },
  { c: "/contributors", d: "Contributors ranked by activity, with commit and review counts." },
  {
    c: "/repositories",
    d: "Every repository this Discord server tracks, with last-activity timestamps.",
  },
  { c: "/weekly", d: "The weekly report, regenerated on demand from the current week." },
  { c: "/repo", d: "Add, remove or inspect a tracked repository (maintainers only)." },
];

const endpoints = [
  {
    m: "POST",
    p: "/api/github/webhook",
    d: "Receives GitHub App events. The signature header is checked before anything is parsed.",
  },
  {
    m: "POST",
    p: "/api/github/sync",
    d: "Backfills history for a newly tracked repository. Requires Bearer auth.",
  },
  {
    m: "POST",
    p: "/api/discord/interactions",
    d: "Discord's slash-command endpoint. Every request is verified with your app's public key.",
  },
  {
    m: "GET/POST",
    p: "/api/cron/weekly",
    d: "Generates and publishes the weekly report. Vercel Cron calls it Fridays 07:05 UTC. Requires Bearer auth.",
  },
  {
    m: "GET",
    p: "/api/health",
    d: "Liveness probe: runtime, database connectivity, last successful webhook delivery. Exposes no secrets.",
  },
];

const reportParts = [
  [
    "Totals",
    "Commits, pull requests, merges, releases and issues opened/closed across all tracked repositories.",
  ],
  [
    "Repo summaries",
    "One short block per repository: what moved, who moved it, what stayed quiet.",
  ],
  [
    "Top contributors",
    "The people carrying the week, ranked by real activity rather than raw line counts.",
  ],
  ["Code stats", "Lines added and removed, by language, for the whole week."],
  ["Contribution heatmap", "A GitHub-style calendar heatmap of daily activity."],
  [
    "Optional AI summary",
    "A plain-language recap of the week. Three provider styles are supported (OpenAI-compatible, Anthropic Messages, or off). Needs its own API key; off by default.",
  ],
];

const setupSteps = [
  {
    t: "Install",
    d: "Clone the repository and install with Bun.",
    code: "git clone https://github.com/fasthand-studio/FastyDiscord\ncd FastyDiscord\nbun install",
  },
  {
    t: "Create a Supabase project",
    d: "Start a fresh Supabase project and run the bundled migration to create the tables.",
    code: "psql $DATABASE_URL -f supabase/migrations/0001_init.sql",
  },
  {
    t: "Create a GitHub App",
    d: "Register a GitHub App with read access to commits, pull requests, issues and releases. Note the App ID and download the private key.",
  },
  {
    t: "Create a Discord app and two webhooks",
    d: "Create a Discord application, then create two channel webhooks: one for activity updates, one for weekly reports.",
  },
  {
    t: "Register slash commands",
    d: "Run the one-time registration so /stats, /contributors, /repositories, /weekly and /repo appear in your server.",
    code: "bun run register:commands",
  },
  {
    t: "Deploy to Vercel",
    d: "Import the repo into Vercel, fill in the environment variables below (names shown, values are placeholders), and add the Friday 07:05 UTC cron. For exact-minute scheduling the project also supports Supabase pg_cron with pg_net, which avoids Vercel Hobby Cron's execution-window drift.",
    code: [
      "# .env.local — names only, never commit real values",
      "DATABASE_URL=postgres://YOUR_SECRET",
      "GITHUB_APP_ID=YOUR_APP_ID",
      "GITHUB_PRIVATE_KEY=YOUR_SECRET",
      "GITHUB_WEBHOOK_SECRET=YOUR_SECRET",
      "DISCORD_APPLICATION_ID=YOUR_APP_ID",
      "DISCORD_PUBLIC_KEY=YOUR_SECRET",
      "DISCORD_ACTIVITY_WEBHOOK_URL=https://YOUR-DOMAIN.vercel.app/api/github/webhook",
      "DISCORD_WEEKLY_WEBHOOK_URL=https://YOUR-DOMAIN.vercel.app/api/github/webhook",
      "BASE_URL=https://YOUR-DOMAIN.vercel.app",
    ].join("\n"),
  },
];

const security: IconRow[] = [
  [
    "Webhook signatures",
    "Every GitHub delivery must carry a valid X-Hub-Signature-256 HMAC. Unsigned or mismatched requests are rejected before parsing.",
    Icons["shield-tick"],
  ],
  [
    "Ed25519 verification",
    "Discord interactions are verified against your application's public key, so only Discord can invoke your commands.",
    Icons.lock,
  ],
  [
    "Delivery-ID deduplication",
    "Each delivery ID is recorded once. Retries from GitHub or Discord can never post the same event twice.",
    Icons.refresh,
  ],
  [
    "Bearer auth on maintenance",
    "/api/github/sync and /api/cron/weekly sit behind a shared secret header; /api/health exposes nothing sensitive.",
    Icons.key,
  ],
  [
    "Credentials out of the repo",
    "Private keys, webhook secrets and database URLs live only in Vercel environment variables. The repo ships placeholders.",
    Icons["key-square"],
  ],
];

const stack: IconRow[] = [
  [
    "TypeScript",
    "One language end to end: functions, commands, migrations typed against each other.",
    Icons.code,
  ],
  [
    "Vercel",
    "Serverless functions and cron. No VPS, no process manager, deploys on push.",
    Icons.cloud,
  ],
  [
    "Supabase",
    "PostgreSQL for events, the repo registry and report snapshots; pg_cron for exact-minute scheduling.",
    Icons["bucket-square"],
  ],
  [
    "GitHub App",
    "Scoped, short-lived installation tokens instead of personal access tokens.",
    Icons["link-2"],
  ],
  [
    "Discord",
    "Interactions API for slash commands, channel webhooks for activity and reports.",
    Icons.message,
  ],
];

function FastyDiscord() {
  return (
    <div className="min-h-screen">
      <ProductHeader repo={REPO} />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Commands />
        <Api />
        <Weekly />
        <Setup />
        <Security />
        <Download />
        <Stack />
      </main>
      <EcosystemFooter repo={REPO} crossLinks={crossLinks("fastydiscord")} />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <FlowBackdrop />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-28">
        <div>
          <p className="text-sm text-muted-foreground">FastHand Studio &middot; Product</p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight md:text-[64px]">
            FastyDiscord
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground md:text-xl">
            GitHub activity gets ignored in your inbox. FastyDiscord posts pushes, pull requests,
            releases and issues as Discord embeds, and closes every week with a contribution report.
            It runs serverless on Vercel with Supabase &mdash; no VPS, no always-on bot process.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={REPO}
              target="_blank"
              rel="noreferrer"
              className="btn-44 bg-primary text-primary-foreground"
            >
              <GitIcon /> Get the code
            </a>
            <a href="#setup" className="btn-44 border border-border">
              Read the setup guide
            </a>
          </div>
        </div>
        <figure className="mock-float justify-self-center">
          <DiscordEmbedMock />
          <figcaption className="mt-3 text-center text-xs text-muted-foreground">
            What one push looks like, delivered into your channel.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function FlowBackdrop() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full text-border"
      viewBox="0 0 1200 500"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {[90, 190, 290, 390, 460].map((y, i) => (
        <path
          key={y}
          className="flow-line"
          style={{ animationDelay: `${i * -3.5}s` }}
          d={`M-40 ${y} H1240`}
          stroke="currentColor"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

function Features() {
  return (
    <section id="features" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <SectionHead
          kicker="The product in four cards"
          title="What FastyDiscord does"
          intro="Track repositories, announce activity, answer questions in the channel, and close the week with a report — nothing else."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <article key={f.t} className="surface p-6">
              <FeatureIcon C={f.icon} />
              <h3 className="mt-4 text-lg font-semibold">{f.t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{f.d}</p>
            </article>
          ))}
        </div>
        <NextStep href="#how" label="See how it works" />
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="border-b border-border bg-secondary">
      <div className="mx-auto max-w-6xl scroll-mt-14 px-5 py-16 md:px-8 md:py-24">
        <SectionHead
          kicker="Four hops, no loops"
          title="How it works"
          intro="One event's journey: GitHub pushes it, a Vercel function verifies and stores it, Discord shows it. Below the diagram, the same flow is written out step by step."
        />
        <FlowDiagram
          nodes={[
            { t: "GitHub", d: "webhook events" },
            { t: "Vercel", d: "serverless functions" },
            { t: "Supabase", d: "PostgreSQL" },
            { t: "Discord", d: "channels & reports" },
          ]}
          caption="FastyDiscord's pipeline: GitHub webhook → Vercel functions → Supabase (PostgreSQL) → Discord."
          steps={[
            {
              t: "GitHub sends a webhook",
              d: "A webhook is a callback: GitHub POSTs every push, PR, release or issue to /api/github/webhook the moment it happens.",
            },
            {
              t: "Vercel functions verify and process",
              d: "Each delivery is checked for a valid signature, deduplicated by delivery ID, and turned into an embed or a database row. They run only when called — no server of yours stays up.",
            },
            {
              t: "Supabase stores the history",
              d: "Verified events land in PostgreSQL tables, which is what the slash commands and weekly reports read from.",
            },
            {
              t: "Discord displays the result",
              d: "Live events post to your activity webhook; Friday's report posts to your weekly webhook. Slash-command replies come back from the same data.",
            },
          ]}
        />
        <TermNote term="serverless">
          code that runs only while a request is being handled, on the platform's machines &mdash;
          nothing for you to keep running.
        </TermNote>
        <TermNote term="PostgreSQL">
          the open-source relational database Supabase hosts for you.
        </TermNote>
        <NextStep href="#commands" label="See what you can ask in Discord" />
      </div>
    </section>
  );
}

function Commands() {
  return (
    <section id="commands" className="border-b border-border">
      <div className="mx-auto max-w-6xl scroll-mt-14 px-5 py-16 md:px-8 md:py-24">
        <SectionHead
          kicker="Use it without leaving Discord"
          title="Five slash commands"
          intro="Registered once during setup, available to everyone in the server. Arguments are optional unless noted."
        />
        <div className="surface mt-10 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-[15px]">
            <caption className="sr-only">
              The five FastyDiscord slash commands and what each one returns
            </caption>
            <thead>
              <tr className="border-b border-border text-sm text-muted-foreground">
                <th scope="col" className="px-5 py-3.5 font-medium">
                  Command
                </th>
                <th scope="col" className="px-5 py-3.5 font-medium">
                  What it returns
                </th>
              </tr>
            </thead>
            <tbody>
              {commands.map((c) => (
                <tr key={c.c} className="border-b border-border last:border-0">
                  <th scope="row" className="whitespace-nowrap px-5 py-4 text-left">
                    <code className="font-mono text-sm font-semibold text-foreground">{c.c}</code>
                  </th>
                  <td className="px-5 py-4 text-muted-foreground">{c.d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <NextStep href="#api" label="Look under the hood" />
      </div>
    </section>
  );
}

function Api() {
  return (
    <section id="api" className="border-b border-border bg-secondary">
      <div className="mx-auto max-w-6xl scroll-mt-14 px-5 py-16 md:px-8 md:py-24">
        <SectionHead
          kicker="Five routes, one entry point each"
          title="API endpoints"
          intro="Every request to FastyDiscord hits one of these Vercel functions. Two of them are authenticated with a Bearer token you choose during setup."
        />
        <div className="surface mt-10 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[15px]">
            <caption className="sr-only">
              FastyDiscord HTTP API endpoints, methods and purpose
            </caption>
            <thead>
              <tr className="border-b border-border text-sm text-muted-foreground">
                <th scope="col" className="px-5 py-3.5 font-medium">
                  Method
                </th>
                <th scope="col" className="px-5 py-3.5 font-medium">
                  Path
                </th>
                <th scope="col" className="px-5 py-3.5 font-medium">
                  Purpose
                </th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((e) => (
                <tr key={e.p} className="border-b border-border last:border-0 align-top">
                  <td className="px-5 py-4">
                    <span className="whitespace-nowrap rounded-full bg-muted px-3 py-1 font-mono text-xs font-semibold text-foreground">
                      {e.m}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <code className="font-mono text-sm text-foreground">{e.p}</code>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{e.d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 space-y-3 text-sm text-muted-foreground">
          <p>
            <Term
              t="X-Hub-Signature-256"
              note="GitHub's proof that a delivery is genuine: an HMAC-SHA256 signature computed from your webhook secret"
            />{" "}
            — FastyDiscord recomputes it and rejects mismatches.
          </p>
          <p>
            <Term
              t="Ed25519"
              note="the digital-signature algorithm Discord uses to sign interaction requests"
            />{" "}
            — verified against your application's public key before any command runs.
          </p>
        </div>
        <NextStep href="#weekly" label="Read what the weekly report contains" />
      </div>
    </section>
  );
}

function Weekly() {
  return (
    <section id="weekly" className="border-b border-border">
      <div className="mx-auto max-w-6xl scroll-mt-14 px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">The Friday report</h2>
            <p className="mt-3 text-muted-foreground">
              The section above lists the doors; this one is what arrives through them every week.
            </p>
            <p className="mt-3 text-muted-foreground">
              Every Friday at{" "}
              <span className="font-semibold text-foreground">1:05 PM Bangladesh time</span> (07:05
              UTC) a scheduled job assembles the week and posts it to your report channel. Missed
              it? <code className="font-mono text-foreground">/weekly</code> regenerates the same
              report on demand.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Scheduling runs on Vercel Cron by default; Supabase pg_cron + pg_net is available when
              you need exact-minute delivery.
            </p>
          </div>
          <dl className="divide-y divide-border border-y border-border">
            {reportParts.map(([t, d]) => (
              <div key={t} className="grid gap-1 py-4 md:grid-cols-[180px_1fr] md:gap-6">
                <dt className="font-semibold">{t}</dt>
                <dd className="text-muted-foreground">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
        <NextStep href="#setup" label="Jump to the setup steps" />
      </div>
    </section>
  );
}

function Setup() {
  return (
    <section id="setup" className="border-b border-border bg-secondary">
      <div className="mx-auto max-w-6xl scroll-mt-14 px-5 py-16 md:px-8 md:py-24">
        <SectionHead
          kicker="Steps only, placeholders only"
          title="Set it up in six steps"
          intro="From clone to first weekly report. Every value below is a placeholder — never commit real secrets to the repo."
        />
        <ol className="mt-10 grid gap-4 lg:grid-cols-2">
          {setupSteps.map((s, i) => (
            <li key={s.t} className="surface p-6">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-semibold text-muted-foreground">
                  {i + 1}
                </span>
                <h3 className="text-lg font-semibold">{s.t}</h3>
              </div>
              <p className="mt-2 text-[15px] text-muted-foreground">{s.d}</p>
              {s.code && <CodeBlock code={s.code} label={`${s.t} — example`} />}
            </li>
          ))}
        </ol>
        <NextStep href="#security" label="See how it defends itself" />
      </div>
    </section>
  );
}

function Security() {
  return (
    <section id="security" className="border-b border-border">
      <div className="mx-auto max-w-6xl scroll-mt-14 px-5 py-16 md:px-8 md:py-24">
        <SectionHead
          kicker="Two untrusted callers"
          title="Security"
          intro="Only GitHub and Discord are supposed to talk to this system. Each one is verified twice: by signature, then by content."
        />
        <ul className="mt-10 divide-y divide-border border-y border-border">
          {security.map(([t, d, ic]) => (
            <li key={t} className="grid gap-1 py-5 md:grid-cols-[260px_1fr] md:gap-8">
              <span className="flex items-center gap-3 font-semibold">
                <FeatureIcon C={ic} px={26} />
                {t}
              </span>
              <span className="text-muted-foreground">{d}</span>
            </li>
          ))}
        </ul>
        <TermNote term="Bearer auth">
          the caller simply presents a shared secret in an{" "}
          <code className="font-mono text-[13px] text-foreground">
            Authorization: Bearer YOUR_SECRET
          </code>{" "}
          header — anyone with the token gets in, so it lives only in environment variables.
        </TermNote>
        <NextStep href="#download" label="Get the code" />
      </div>
    </section>
  );
}

function Download() {
  return (
    <section id="download" className="border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl scroll-mt-14 px-5 py-16 md:px-8 md:py-24">
        <h2 className="text-3xl font-semibold tracking-tight">Get FastyDiscord</h2>
        <p className="mt-3 max-w-xl opacity-70">
          Open source under the FastHand Studio organization. There is no hosted version to sign up
          for: {P.host}, on your own accounts, with your own secrets.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            className="btn-44 bg-primary-foreground text-primary"
          >
            <GitIcon /> View on GitHub
          </a>
          <a
            href={ZIP}
            className="btn-44 border border-primary-foreground/30 text-primary-foreground"
          >
            Download ZIP
          </a>
        </div>
        <NextStep href="#stack" label="Check the stack" />
      </div>
    </section>
  );
}

function Stack() {
  return (
    <section id="stack" className="border-b border-border">
      <div className="mx-auto max-w-6xl scroll-mt-14 px-5 py-16 md:px-8 md:py-24">
        <SectionHead
          kicker="Why these five pieces"
          title="Stack &amp; architecture"
          intro="Chosen so a solo maintainer can run it for years without ops work: no servers, no queues to drain, no build farms."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stack.map(([t, d, ic]) => (
            <article key={t} className="surface hover-lift p-5">
              <FeatureIcon C={ic} px={30} />
              <h3 className="mt-4 font-mono text-[15px] font-semibold">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

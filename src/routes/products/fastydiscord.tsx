import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/components/product/CodeBlock";
import { DiagramCaption, ProductSection, StepList } from "@/components/product/ProductSection";
import { RelayScene, SceneFigure } from "@/components/product/scenes";
import { ProductHeader } from "@/components/product/ProductHeader";
import { ProductEcosystemFooter } from "@/components/product/ProductEcosystemFooter";
import { GitIcon, DownloadIcon } from "@/components/product/icons";
import { FASTYDISCORD } from "@/components/product/catalog";

import { TreeIcon, type TreeIconName } from "@/components/product/TreeIcon";

const ORIGIN = "https://fasthandstudio.asia";
const REPO = FASTYDISCORD.repo;
const README = `${REPO}/blob/main/README.md`;

const TITLE = "FastyDiscord — Your GitHub activity in Discord | FastHand Studio";
const DESCRIPTION =
  "FastyDiscord is a GitHub activity bot for Discord: pushes, pull requests, releases and issues from your public and private repositories, delivered serverlessly with Vercel, Supabase and a GitHub App — plus an automatic weekly report.";

export const Route = createFileRoute("/products/fastydiscord")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:type", content: "product" },
      { property: "og:site_name", content: "FastHand Studio" },
      { property: "og:url", content: `${ORIGIN}/products/fastydiscord` },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:image", content: `${ORIGIN}/og.png` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: `${ORIGIN}/og.png` },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "FastyDiscord",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Any (deployed on Vercel)",
          description: DESCRIPTION,
          url: `${ORIGIN}/products/fastydiscord`,
          codeRepository: REPO,
          publisher: { "@id": `${ORIGIN}/#organization` },
        },
      },
    ],
    links: [{ rel: "canonical", href: `${ORIGIN}/products/fastydiscord` }],
  }),
  component: FastyDiscordPage,
});

const featureCards: { t: string; i: TreeIconName; d: string; k: string; g: string }[] = [
  {
    t: "Every event, public and private",
    i: "activity",
    d: "Pushes, pull requests, releases, issues and repository changes are tracked across every repository your GitHub App installation can see — private ones included.",
    k: "GitHub App · read-only",
    g: "A GitHub App is a bot identity you install on your own repos. It asks for scoped, read-only permissions, so it can read activity without ever holding your personal password.",
  },
  {
    t: "No process to keep alive",
    i: "cloud-lightning",
    d: "There is no always-on bot sitting on a server. GitHub posts events to a Vercel function, and Discord calls the same app when someone types a slash command.",
    k: "Vercel Functions · HTTP interactions",
    g: "Discord's HTTP interactions mean the bot only runs when a command is used — no permanent connection to keep open, no VPS to babysit.",
  },
  {
    t: "Nothing gets posted twice",
    i: "filter-remove",
    d: "Every GitHub delivery id is recorded, and selected events carry a unique external id. Retries and duplicate webhooks are detected and dropped before they reach your channel.",
    k: "webhook_deliveries · dedup",
    g: "Idempotent: handling the same event a second time produces no extra output, because the app recognises the delivery id it already processed.",
  },
  {
    t: "A weekly report, every Friday",
    i: "calendar",
    d: "Activity totals, per-repository summaries, top contributors, code-change stats and a GitHub-style contribution heatmap land in a dedicated channel at 07:05 UTC (1:05 PM Bangladesh time).",
    k: "5 7 * * 5 · pg_cron option",
    g: "pg_cron is Supabase's built-in scheduler. Using it (with pg_net) triggers the report at an exact minute, avoiding the loose execution window of Vercel Hobby Cron.",
  },
];

const flowSteps: [string, string][] = [
  [
    "GitHub sends an event",
    "A push, pull request, release or issue fires a webhook to your deployed Vercel domain.",
  ],
  [
    "The signature is checked",
    "The endpoint recomputes X-Hub-Signature-256 with your webhook secret and rejects anything that doesn't match.",
  ],
  [
    "Duplicates are dropped",
    "The delivery id is looked up in the webhook_deliveries table; if it is already there, processing stops.",
  ],
  [
    "The event is stored",
    "Activity rows land in Supabase PostgreSQL, which is also what the weekly report aggregates.",
  ],
  [
    "Discord receives the update",
    "A formatted message is posted to your activity channel; slash command answers come back through the interactions endpoint.",
  ],
];

const endpoints = [
  [
    "POST",
    "/api/github/webhook",
    "Receives every GitHub event. Verified with X-Hub-Signature-256.",
  ],
  ["POST", "/api/github/sync", "Rebuilds the repository catalog. Protected by Bearer CRON_SECRET."],
  [
    "POST",
    "/api/discord/interactions",
    "Handles slash commands. Verified with Ed25519 signatures.",
  ],
  ["GET/POST", "/api/cron/weekly", "Generates and publishes the weekly report."],
  ["GET", "/api/health", "Health check."],
];

const commands = [
  ["/stats", "Development activity totals over the tracked repositories."],
  ["/contributors", "Who contributed, and how much."],
  ["/repositories", "Browse the repositories currently being tracked."],
  ["/weekly", "The weekly development report, on demand."],
  ["/repo", "Activity for one specific repository."],
];

const SYNC_CURL = [
  'curl -X POST "https://YOUR-DOMAIN.vercel.app/api/github/sync" \\',
  '  -H "Authorization: Bearer YOUR_SECRET"',
].join("\n");

const ENV_SAMPLE = [
  "SUPABASE_URL=https://YOUR-PROJECT.supabase.co",
  "SUPABASE_SERVICE_ROLE_KEY=YOUR_SECRET",
  "GITHUB_APP_ID=12345",
  "GITHUB_APP_PRIVATE_KEY=YOUR_SECRET",
  "GITHUB_WEBHOOK_SECRET=YOUR_SECRET",
  "DISCORD_PUBLIC_KEY=YOUR_SECRET",
  "DISCORD_APPLICATION_ID=YOUR_SECRET",
  "DISCORD_BOT_TOKEN=YOUR_SECRET",
  "DISCORD_UPDATES_WEBHOOK_URL=YOUR_SECRET",
  "DISCORD_WEEKLY_WEBHOOK_URL=YOUR_SECRET",
  "CRON_SECRET=YOUR_SECRET",
].join("\n");

const setupSteps: [string, string][] = [
  ["Create the database", "Make a Supabase project and run supabase/migrations/0001_init.sql."],
  [
    "Create the GitHub App",
    "Read-only access to Contents, Issues, Metadata and Pull Requests; subscribe to the events you want. Set the webhook URL to https://YOUR-DOMAIN.vercel.app/api/github/webhook.",
  ],
  [
    "Create the Discord application",
    "Set the Interactions Endpoint URL to https://YOUR-DOMAIN.vercel.app/api/discord/interactions and make two channel webhooks — one for activity, one for the weekly report.",
  ],
  [
    "Register the slash commands",
    "Copy .env.example to .env.local, fill it in, then run npx tsx scripts/register-discord-commands.ts.",
  ],
  [
    "Deploy and sync",
    "Import the repo into Vercel, set the environment variables, deploy, then POST to /api/github/sync once to populate the catalog. Later installs refresh it automatically.",
  ],
];

function FastyDiscordPage() {
  return (
    <div id="top" className="min-h-screen">
      <ProductHeader
        repoUrl={REPO}
        pageNav={[
          { href: "#features", label: "Features" },
          { href: "#how", label: "How it works" },
          { href: "#api", label: "Endpoints" },
          { href: "#download", label: "Download" },
        ]}
      />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Api />
        <Weekly />
        <Download />
        <Stack />
      </main>
      <ProductEcosystemFooter current="FastyDiscord" />
    </div>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-[1.1fr_1fr] md:px-8 md:py-24">
      <div>
        <p className="font-mono text-sm text-muted-foreground">FastHand Studio · Product</p>
        <h1 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight md:text-[56px]">
          FastyDiscord
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          Work happens on GitHub and conversation happens in Discord, and the two never meet.
          FastyDiscord closes that gap: it watches your repositories and posts every push, pull
          request, release and issue into a Discord channel — plus a weekly report you can read in
          one minute.
        </p>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          It runs entirely serverlessly on Vercel and Supabase, reads private repositories through a
          GitHub App, and never needs a bot process left running.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            className="btn-44 bg-primary text-primary-foreground"
          >
            <GitIcon /> Get the code
          </a>
          <a href={README} target="_blank" rel="noreferrer" className="btn-44 border border-border">
            Read the docs
          </a>
        </div>
        <p className="mt-6 font-mono text-[13px] text-muted-foreground">
          TypeScript · Vercel · Supabase · GitHub App · Discord
        </p>
      </div>
      <HeroMark />
    </section>
  );
}

function HeroMark() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[400px]" aria-hidden>
      <svg viewBox="0 0 400 400" className="h-full w-full text-foreground">
        <g className="fill-none stroke-border" strokeWidth="1.5">
          <circle cx="120" cy="200" r="64" />
          <circle cx="280" cy="130" r="52" />
          <circle cx="280" cy="270" r="52" />
        </g>
        <path
          d="M178 186 L228 150 M178 214 L228 250"
          className="stroke-foreground"
          strokeWidth="1.5"
        />
        <circle cx="120" cy="200" r="26" className="fill-primary" />
        <rect x="106" y="188" width="28" height="24" rx="6" className="fill-background" />
        <path d="M112 194v12l6-3 6 3v-12z" className="fill-primary" />
        <rect
          x="252"
          y="112"
          width="56"
          height="36"
          rx="10"
          className="fill-card stroke-foreground"
          strokeWidth="1.5"
        />
        <rect
          x="252"
          y="252"
          width="56"
          height="36"
          rx="10"
          className="fill-card stroke-foreground"
          strokeWidth="1.5"
        />
        <g className="fill-foreground">
          <circle cx="268" cy="130" r="4" className="hero-typing-dot" />
          <circle cx="280" cy="130" r="4" className="hero-typing-dot d2" />
          <circle cx="292" cy="130" r="4" className="hero-typing-dot d3" />
          <circle cx="268" cy="270" r="4" className="hero-typing-dot d2" />
          <circle cx="280" cy="270" r="4" className="hero-typing-dot d3" />
          <circle cx="292" cy="270" r="4" className="hero-typing-dot" />
        </g>
      </svg>
    </div>
  );
}

function Features() {
  return (
    <ProductSection
      id="features"
      kicker="What it does"
      title="Four guarantees, no bot server"
      lead="Every GitHub event either reaches your channel once or is provably dropped. Here is what the code promises, one card each."
      next={{ href: "#how", label: "See the flow" }}
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featureCards.map((f) => (
          <article key={f.t} className="surface flex flex-col p-6">
            <TreeIcon name={f.i} size={24} motion="hover" />
            <h3 className="mt-4 text-lg font-semibold">{f.t}</h3>
            <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted-foreground">{f.d}</p>
            <p className="mt-4 border-t border-border pt-3 text-[13px] leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Plain language: </span>
              {f.g}
            </p>
            <p className="mt-3 font-mono text-[12px] break-words text-muted-foreground">{f.k}</p>
          </article>
        ))}
      </div>
      <SceneFigure caption="Figure 1 — the arrangement this product assumes: events enter the relay as signed webhooks, no process waits on them, and the channel gets the message whether the desk is occupied or not.">
        <RelayScene />
      </SceneFigure>
    </ProductSection>
  );
}

function HowItWorks() {
  return (
    <ProductSection
      id="how"
      kicker="How it works"
      title="One path: GitHub event to Discord message"
      lead="Follow a single push from the moment GitHub sends it to the moment it appears in your channel. The same request travels through five small, inspectable steps."
      next={{ href: "#api", label: "Read the endpoints" }}
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,420px)_1fr]">
        <figure>
          <Diagram />
          <DiagramCaption>
            Figure 2 — A GitHub event enters at the top, passes signature checks and duplicate
            detection, is stored in Supabase, and leaves as a Discord message.
          </DiagramCaption>
        </figure>
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            The same flow, in words
          </h3>
          <div className="mt-4">
            <StepList steps={flowSteps} />
          </div>
        </div>
      </div>
    </ProductSection>
  );
}

function Diagram() {
  return (
    <svg
      viewBox="0 0 400 560"
      role="img"
      aria-labelledby="flow-title flow-desc"
      className="w-full text-foreground"
    >
      <title id="flow-title">FastyDiscord event flow</title>
      <desc id="flow-desc">
        GitHub sends an event to the webhook endpoint; the endpoint verifies the signature, drops
        duplicates, stores the event in Supabase, and posts the update to Discord.
      </desc>
      <g className="fill-none stroke-foreground" strokeWidth="1.5">
        <rect
          x="80"
          y="20"
          width="240"
          height="64"
          style={{ cornerShape: "superellipse(1.5)" } as React.CSSProperties}
        />
        <rect
          x="80"
          y="144"
          width="240"
          height="64"
          style={{ cornerShape: "superellipse(1.5)" } as React.CSSProperties}
        />
        <rect
          x="80"
          y="268"
          width="240"
          height="64"
          style={{ cornerShape: "superellipse(1.5)" } as React.CSSProperties}
        />
        <rect
          x="80"
          y="392"
          width="240"
          height="64"
          style={{ cornerShape: "superellipse(1.5)" } as React.CSSProperties}
        />
        <rect
          x="80"
          y="496"
          width="240"
          height="52"
          style={{ cornerShape: "superellipse(1.5)" } as React.CSSProperties}
        />
      </g>
      <g className="fill-primary">
        <rect x="80" y="144" width="4" height="64" />
        <rect x="80" y="268" width="4" height="64" />
      </g>
      <g className="fill-foreground text-[14px] font-semibold">
        <text x="200" y="48" textAnchor="middle">
          GitHub
        </text>
        <text x="200" y="172" textAnchor="middle">
          POST /api/github/webhook
        </text>
        <text x="200" y="296" textAnchor="middle">
          Dedupe + store
        </text>
        <text x="200" y="420" textAnchor="middle">
          Supabase PostgreSQL
        </text>
        <text x="200" y="518" textAnchor="middle">
          Discord channel
        </text>
      </g>
      <g className="fill-muted-foreground text-[11px]" fontFamily="var(--font-mono, monospace)">
        <text x="200" y="68" textAnchor="middle">
          push · pull request · release · issue
        </text>
        <text x="200" y="196" textAnchor="middle">
          verify X-Hub-Signature-256
        </text>
        <text x="200" y="320" textAnchor="middle">
          webhook_deliveries lookup
        </text>
        <text x="200" y="444" textAnchor="middle">
          activity rows · weekly aggregates
        </text>
        <text x="200" y="536" textAnchor="middle">
          update webhook · weekly webhook
        </text>
      </g>
      <g className="stroke-foreground" strokeWidth="1.5">
        <path d="M200 84 v48" />
        <path d="M200 208 v48" />
        <path d="M200 332 v48" />
        <path d="M200 456 v28" />
      </g>
      <g className="fill-foreground">
        <path d="M195 128 h10 l-5 8 z" />
        <path d="M195 252 h10 l-5 8 z" />
        <path d="M195 376 h10 l-5 8 z" />
        <path d="M195 480 h10 l-5 8 z" />
      </g>
    </svg>
  );
}

function Api() {
  return (
    <ProductSection
      id="api"
      kicker="How to use it"
      title="Five endpoints, five slash commands"
      lead="The whole surface area is this: a handful of HTTP endpoints for GitHub, Discord and the scheduler, and the commands your team types in Discord."
      next={{ href: "#weekly", label: "See the weekly report" }}
    >
      <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        HTTP endpoints
      </h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="py-2 pr-4 font-mono text-[12px] text-muted-foreground">
                METHOD
              </th>
              <th scope="col" className="py-2 pr-4 font-mono text-[12px] text-muted-foreground">
                PATH
              </th>
              <th scope="col" className="py-2 font-mono text-[12px] text-muted-foreground">
                WHAT IT DOES
              </th>
            </tr>
          </thead>
          <tbody>
            {endpoints.map(([m, p, d]) => (
              <tr key={p} className="border-b border-border align-top">
                <td className="py-3 pr-4 font-mono text-[13px] whitespace-nowrap">{m}</td>
                <td className="py-3 pr-4 font-mono text-[13px] break-words">{p}</td>
                <td className="py-3 text-muted-foreground">{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="mt-10 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        Trigger the initial sync
      </h3>
      <p className="mt-2 max-w-2xl text-[15px] text-muted-foreground">
        After your first deploy, one authenticated call populates the repository catalog. Replace
        YOUR-DOMAIN and YOUR_SECRET with your Vercel domain and the CRON_SECRET you set.
      </p>
      <div className="mt-4 max-w-3xl">
        <CodeBlock label="sync — first run only" code={SYNC_CURL} />
      </div>

      <h3 className="mt-10 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        Discord slash commands
      </h3>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {commands.map(([c, d]) => (
          <li key={c} className="surface p-4">
            <p className="font-mono text-[14px] font-semibold">{c}</p>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{d}</p>
          </li>
        ))}
      </ul>
    </ProductSection>
  );
}

function Weekly() {
  return (
    <ProductSection
      id="weekly"
      kicker="The weekly report"
      title="Every Friday at 07:05 UTC"
      lead="One message a week tells the whole team what happened: totals, per-repository summaries, top contributors, code-change stats and a contribution heatmap — with an optional AI summary on top."
      next={{ href: "#download", label: "How to get it" }}
      tone="muted"
    >
      <div className="grid gap-6 md:grid-cols-3">
        <article className="surface p-6">
          <TreeIcon name="chart" size={24} motion="hover" />
          <h3 className="mt-4 text-base font-semibold">What is in it</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Activity totals, repository-level summaries, top contributors, lines changed and a
            GitHub-style heatmap of the week.
          </p>
        </article>
        <article className="surface p-6">
          <TreeIcon name="cpu" size={24} motion="hover" />
          <h3 className="mt-4 text-base font-semibold">Optional AI summary</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Point it at an OpenAI-compatible, Anthropic or Cloudflare Workers AI endpoint and the
            report gains a plain-language summary. If the AI call fails, the report still publishes
            with a fallback message.
          </p>
        </article>
        <article className="surface p-6">
          <TreeIcon name="verify" size={24} motion="hover" />
          <h3 className="mt-4 text-base font-semibold">Runs exactly once</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            The report is idempotent on the week start date, so Vercel Cron and the optional pg_cron
            job can both be active without producing duplicates.
          </p>
          <p className="mt-3 border-t border-border pt-3 text-[13px] leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Plain language: </span>
            idempotent means running the same job twice is safe — the second run recognises the week
            is already reported and stops.
          </p>
        </article>
      </div>
    </ProductSection>
  );
}

function Download() {
  return (
    <ProductSection
      id="download"
      kicker="How to get it"
      title="Clone it, or download the ZIP"
      lead="FastyDiscord is designed to be deployed by you, into your own Vercel and Supabase accounts, with your own GitHub App and Discord application."
      next={{ href: "#stack", label: "Stack and licence" }}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Grab the code
          </h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={REPO}
              target="_blank"
              rel="noreferrer"
              className="btn-44 bg-primary text-primary-foreground"
            >
              <GitIcon /> GitHub repository
            </a>
            <a href={FASTYDISCORD.zip} className="btn-44 border border-border">
              <DownloadIcon /> Download ZIP
            </a>
          </div>
          <h3 className="mt-8 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Deploy in five steps
          </h3>
          <div className="mt-4">
            <StepList steps={setupSteps} />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Environment variables
          </h3>
          <p className="mt-2 text-[15px] text-muted-foreground">
            The full list lives in <span className="font-mono text-[13px]">.env.example</span> in
            the repository. Every secret below is a placeholder — generate real values in your own
            accounts and never commit them.
          </p>
          <div className="mt-4">
            <CodeBlock
              label=".env.local — placeholders only"
              code={ENV_SAMPLE}
              note="AI keys are optional and only needed for weekly AI summaries. GITHUB_INSTALLATION_IDS is optional and restricts processing to specific installations."
            />
          </div>
        </div>
      </div>
    </ProductSection>
  );
}

function Stack() {
  return (
    <ProductSection
      id="stack"
      kicker="Stack and licence"
      title="Serverless from end to end"
      lead="Small, boring, inspectable pieces — and one honest caveat about the licence."
    >
      <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {(
          [
            [
              "Language",
              "code",
              "TypeScript throughout — application logic, webhook handling, formatting, stats.",
            ],
            [
              "Runtime",
              "cloud",
              "Vercel Serverless Functions. vercel.json schedules the weekly run at 5 7 * * 5.",
            ],
            [
              "Data",
              "bucket-square",
              "Supabase PostgreSQL: activity records, delivery ids, weekly reports; migrations in supabase/migrations.",
            ],
            [
              "Integrations",
              "link-square",
              "GitHub App (read-only) for events; Discord webhooks and HTTP interactions for delivery.",
            ],
          ] as [string, TreeIconName, string][]
        ).map(([t, i, d]) => (
          <div key={t}>
            <div className="flex items-center gap-2">
              <TreeIcon name={i} size={18} motion="static" />
              <dt className="font-mono text-[12px] tracking-wide text-muted-foreground uppercase">
                {t}
              </dt>
            </div>
            <dd className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{d}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">Licence: </span>
        the repository does not publish a licence file yet, so no licence is claimed here. Watch the{" "}
        <a
          href={`${REPO}/blob/main/README.md`}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          README
        </a>{" "}
        for an update before you reuse the code commercially.
      </p>
    </ProductSection>
  );
}

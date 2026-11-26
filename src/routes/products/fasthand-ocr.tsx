import { createFileRoute } from "@tanstack/react-router";
import { PRODUCTS, crossLinks } from "@/components/product/data";
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
import { TransformDiagram } from "@/components/product/diagram";
import { FeatureIcon, Icons, type IconRow } from "@/components/product/icons";
import { OcrResultMock } from "@/components/product/mocks";

const P = PRODUCTS[1];
const REPO = P.repo;
const ZIP = P.zip;
const ORIGIN = "https://fasthandstudio.asia";

export const Route = createFileRoute("/products/fasthand-ocr")({
  head: () => ({
    meta: [
      { title: "FastHand OCR — real-time text extraction on Cloudflare Workers | FastHand Studio" },
      {
        name: "description",
        content:
          "Send a base64 image, get the printed text back. A hardened OCR API on Cloudflare Workers AI with the Llama 3.2 11B Vision model — no GPU server, no vendor lock-in.",
      },
      { property: "og:type", content: "product" },
      {
        property: "og:title",
        content: "FastHand OCR — real-time text extraction on Cloudflare Workers",
      },
      {
        property: "og:description",
        content:
          "A real-time OCR API on Cloudflare Workers AI: send a base64 image, get the printed text back. API-key protected, hardened, ~30k+ free scans per day.",
      },
      { property: "og:url", content: `${ORIGIN}/products/fasthand-ocr` },
      { name: "twitter:card", content: "summary_large_image" },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "FastHand OCR",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          codeRepository: REPO,
          url: `${ORIGIN}/products/fasthand-ocr`,
          description:
            "Real-time OCR API on Cloudflare Workers AI using the Llama 3.2 11B Vision model.",
        },
      },
    ],
    links: [{ rel: "canonical", href: `${ORIGIN}/products/fasthand-ocr` }],
  }),
  component: FastHandOcr,
});

const features = [
  {
    t: "Printed text, read properly",
    d: "The Llama 3.2 11B Vision model transcribes dense, small and mixed-script print character-for-character — labels, receipts, ID cards, forms.",
    icon: Icons.scan,
  },
  {
    t: "Many scripts, one call",
    d: "Multilingual by design: Latin scripts, Bengali, Arabic, Devanagari, Chinese, Japanese, Korean and Cyrillic all come back correctly on printed text.",
    icon: Icons.translate,
  },
  {
    t: "API-key protected",
    d: "Every request must carry a valid X-API-Key header, compared in constant time so guesses can't be timed. Rotate the key anytime with one command, no code change.",
    icon: Icons.key,
  },
  {
    t: "Edge runtime",
    d: "Runs on Cloudflare's global network, so the endpoint answers close to your users. Handled images come back with per-word confidence scores.",
    icon: Icons.cpu,
  },
];

const endpoints = [
  {
    m: "POST",
    p: "/",
    d: "OCR extraction. Requires X-API-Key and a JSON body with a base64 image field; returns the full text plus per-word confidence entries.",
  },
  {
    m: "GET",
    p: "/",
    d: "Interactive API documentation page, served in the browser. Public — no key needed.",
  },
];

const errors = [
  ["401", "Missing or invalid X-API-Key."],
  ["400", "Missing or invalid image field, or malformed base64."],
  ["413", "Request body over 8 MB, or decoded image over 6 MB."],
  ["405", "Any method other than POST to the OCR route."],
  ["500", "The model call or processing failed."],
];

const setupSteps = [
  {
    t: "Install dependencies",
    d: "Node.js 18+ and a Cloudflare account with Workers and Workers AI enabled.",
    code: "git clone https://github.com/fasthand-studio/fasthand-ocr\ncd fasthand-ocr\nnpm install",
  },
  {
    t: "Log in to Cloudflare",
    d: "Wrangler opens a browser once to authorize the CLI.",
    code: "npx wrangler login",
  },
  {
    t: "Set your secret API key",
    d: "The key never lives in the code — it is stored as a Cloudflare secret. Anyone calling the worker needs the same value.",
    code: 'echo "YOUR_API_KEY" | npx wrangler secret put API_KEY',
  },
  {
    t: "Deploy",
    d: "You get a URL like https://YOUR-DOMAIN.workers.dev. Rotate the key the same way anytime.",
    code: "npm run deploy",
  },
];

const security: IconRow[] = [
  [
    "Timing-safe key check",
    "The API key is compared with crypto.subtle.timingSafeEqual, so a wrong key can't be discovered one character at a time by measuring response times.",
    Icons["key-square"],
  ],
  [
    "Hard payload limits",
    "8 MB per request, 6 MB per decoded image — oversized uploads are rejected instead of served (a basic denial-of-service defence).",
    Icons["shield-tick"],
  ],
  [
    "Strict base64 validation",
    "Malformed input is rejected before any decoding happens.",
    Icons["box-tick"],
  ],
  [
    "Security headers on every response",
    "X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Referrer-Policy: no-referrer, Permissions-Policy, Cache-Control: no-store, and a CSP on the docs page.",
    Icons["document-code"],
  ],
  [
    "HTTPS only",
    "workers.dev serves HTTPS by default. Secrets live in Cloudflare's secret store, never in the repo.",
    Icons.lock,
  ],
];

function FastHandOcr() {
  return (
    <div className="min-h-screen">
      <ProductHeader repo={REPO} />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Api />
        <Accuracy />
        <Setup />
        <Security />
        <Pricing />
        <Download />
        <Stack />
      </main>
      <EcosystemFooter repo={REPO} crossLinks={crossLinks("fasthand-ocr")} />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <ScanBackdrop />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-[0.95fr_1.05fr] md:px-8 md:py-28">
        <div className="md:order-last">
          <p className="text-sm text-muted-foreground">FastHand Studio &middot; Product</p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight md:text-[64px]">
            FastHand OCR
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground md:text-xl">
            Turning a photo into text usually means a GPU server or a vendor API contract. FastHand
            OCR is one POST request: send a base64 image, get the printed text back, running on
            Cloudflare Workers AI. You deploy it to your own account.
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
        <figure className="justify-self-center md:justify-self-start">
          <OcrResultMock />
          <figcaption className="mt-3 text-center text-xs text-muted-foreground md:text-left">
            A document in, structured text with confidence out.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function ScanBackdrop() {
  const docs = [
    { x: 620, y: 40, w: 220, h: 300, rot: -5 },
    { x: 860, y: 120, w: 240, h: 330, rot: 4 },
    { x: 1060, y: 20, w: 190, h: 270, rot: -2 },
  ];
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full text-border"
      viewBox="0 0 1200 500"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {docs.map((d) => (
        <g key={d.x} transform={`rotate(${d.rot} ${d.x + d.w / 2} ${d.y + d.h / 2})`}>
          <rect x={d.x} y={d.y} width={d.w} height={d.h} rx={20} stroke="currentColor" />
          {Array.from({ length: 7 }).map((_, i) => (
            <line
              key={i}
              x1={d.x + 24}
              x2={d.x + d.w - 24 - (i % 3) * 34}
              y1={d.y + 46 + i * 34}
              y2={d.y + 46 + i * 34}
              stroke="currentColor"
            />
          ))}
        </g>
      ))}
      <g className="scanline">
        <line
          x1="0"
          x2="1200"
          y1="30"
          y2="30"
          stroke="currentColor"
          strokeWidth="3"
          className="text-foreground"
          opacity="0.5"
        />
      </g>
    </svg>
  );
}

function Features() {
  return (
    <section id="features" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <SectionHead
          kicker="The worker in four cards"
          title="What FastHand OCR does"
          intro="One endpoint, one header, one JSON body: extract printed text from images with a vision model you don't host."
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
        <NextStep href="#how" label="See how a request flows" />
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="border-b border-border bg-secondary">
      <div className="mx-auto max-w-6xl scroll-mt-14 px-5 py-16 md:px-8 md:py-24">
        <SectionHead
          kicker="Image in, JSON out"
          title="How it works"
          intro="One request does the whole transformation: a picture goes in, structured text comes out. What happens between those two shapes is written out under the diagram."
        />
        <TransformDiagram
          input={{ t: "Your document", d: "an image, posted as one base64 field" }}
          via="Workers AI"
          viaSub="Llama 3.2 11B Vision"
          outputLines={[
            "{",
            '  "text": "…full page…",',
            '  "words": [',
            '    { "word": "BANGLADESH",',
            '      "confidence": 0.85 },',
            "  ]",
          ]}
          caption="One transformation, two shapes going in and out: a picture enters through the worker (auth + validation) and structured text with confidence scores leaves it."
          steps={[
            {
              t: "You POST / with the image",
              d: "The body carries one field, image, holding the picture encoded as a base64 string (the data:image/...;base64, prefix is stripped automatically).",
            },
            {
              t: "The worker checks the caller",
              d: "X-API-Key is compared in constant time; size caps (8 MB request, 6 MB image) and strict base64 validation reject anything else before costs are incurred.",
            },
            {
              t: "Workers AI runs the model",
              d: "The image goes to @cf/meta/llama-3.2-11b-vision-instruct, Cloudflare's hosted vision model — you never install or scale a model.",
            },
            {
              t: "JSON comes back",
              d: "The response contains the full extracted text and a words array with per-word confidence (each defaulting to 0.85, a conservative estimate because Workers AI doesn't expose real per-word scores).",
            },
          ]}
        />
        <TermNote term="base64">
          a way of smuggling binary data (like an image) inside a plain text JSON field, so HTTP
          APIs can carry files in the request body.
        </TermNote>
        <NextStep href="#api" label="See the endpoints and errors" />
      </div>
    </section>
  );
}

function Api() {
  return (
    <section id="api" className="border-b border-border">
      <div className="mx-auto max-w-6xl scroll-mt-14 px-5 py-16 md:px-8 md:py-24">
        <SectionHead
          kicker="One route, two methods"
          title="API endpoints &amp; errors"
          intro="The whole public surface is the / route: POST to extract text, GET to read the live docs. Failures always come back as a plain HTTP status."
        />
        <div className="surface mt-10 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-[15px]">
            <caption className="sr-only">FastHand OCR endpoints and what they do</caption>
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
                <tr key={e.m} className="border-b border-border last:border-0 align-top">
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
        <div className="surface mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-[15px]">
            <caption className="sr-only">HTTP error statuses and their causes</caption>
            <thead>
              <tr className="border-b border-border text-sm text-muted-foreground">
                <th scope="col" className="px-5 py-3.5 font-medium">
                  Status
                </th>
                <th scope="col" className="px-5 py-3.5 font-medium">
                  Cause
                </th>
              </tr>
            </thead>
            <tbody>
              {errors.map(([s, c]) => (
                <tr key={s} className="border-b border-border last:border-0">
                  <td className="px-5 py-4">
                    <code className="font-mono text-sm font-semibold text-foreground">{s}</code>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <NextStep href="#accuracy" label="How accurate is it, really?" />
      </div>
    </section>
  );
}

function Accuracy() {
  return (
    <section id="accuracy" className="border-b border-border bg-secondary">
      <div className="mx-auto max-w-6xl scroll-mt-14 px-5 py-16 md:px-8 md:py-24">
        <SectionHead
          kicker="Verified on a real document"
          title="Accuracy &amp; language support"
          intro="What the model reads well, what it reads less well, and how the confidence numbers should be interpreted."
        />
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold">The check that matters</h3>
            <p className="mt-2 text-muted-foreground">
              Verified against a real Bangladesh National ID card with mixed Bengali + English text:
              the government header, holder name, parents' names, date of birth and NID number were
              all extracted correctly.
            </p>
            <h3 className="mt-8 text-lg font-semibold">Reading the confidence score</h3>
            <p className="mt-2 text-muted-foreground">
              Every word comes with a confidence value. Workers AI does not expose per-word scores,
              so each one defaults to <code className="font-mono text-foreground">0.85</code> — a
              conservative estimate, not a measurement.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Scripts handled</h3>
            <ul className="mt-3 divide-y divide-border border-y border-border text-[15px]">
              {[
                ["Latin scripts", "English, French, Spanish, German, Portuguese"],
                ["Bengali", "বাংলাদেশ"],
                ["Arabic", "العربية"],
                ["Devanagari (Hindi)", "हिन्दी"],
                ["Chinese · Japanese · Korean", "中文 · 日本語 · 한국어"],
                ["Cyrillic (Russian)", "Русский"],
              ].map(([a, b]) => (
                <li key={a} className="flex justify-between gap-4 py-2.5">
                  <span className="font-semibold">{a}</span>
                  <span className="text-muted-foreground">{b}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Best on printed text (labels, documents, cards). Handwriting and heavily stylized
              fonts degrade results — that's the model, not a bug to fix in this worker.
            </p>
          </div>
        </div>
        <NextStep href="#setup" label="Set it up yourself" />
      </div>
    </section>
  );
}

function Setup() {
  return (
    <section id="setup" className="border-b border-border">
      <div className="mx-auto max-w-6xl scroll-mt-14 px-5 py-16 md:px-8 md:py-24">
        <SectionHead
          kicker="Four commands"
          title="Set it up in minutes"
          intro="No database, no queues. Clone, authorize Wrangler, set one secret, deploy. Values below are placeholders."
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
              <CodeBlock code={s.code} label={`${s.t} — example`} />
            </li>
          ))}
        </ol>
        <div className="surface mt-4 p-6">
          <h3 className="text-lg font-semibold">Calling it from your app</h3>
          <CodeBlock
            label="Example request"
            code={[
              "curl -X POST https://YOUR-DOMAIN.workers.dev/ \\",
              '  -H "Content-Type: application/json" \\',
              '  -H "X-API-Key: YOUR_API_KEY" \\',
              '  -d \'{"image": "iVBORw0KGgoAAAANSUhEUg..."}\'',
            ].join("\n")}
          />
        </div>
        <NextStep href="#security" label="See how the worker defends itself" />
      </div>
    </section>
  );
}

function Security() {
  return (
    <section id="security" className="border-b border-border bg-secondary">
      <div className="mx-auto max-w-6xl scroll-mt-14 px-5 py-16 md:px-8 md:py-24">
        <SectionHead
          kicker="Small surface, checked twice"
          title="Security"
          intro="An open endpoint that runs an expensive model must say no fast and often. Here is every gate a request passes."
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
        <TermNote term="constant-time comparison">
          checking a secret character-by-character would leak how much of a guess was right via
          response timing; timingSafeEqual compares the whole value in the same time whether it
          fails early or late.
        </TermNote>
        <p className="mt-4 text-sm text-muted-foreground">
          Suggested extra: enable Cloudflare Rate Limiting on your worker to cap requests per IP.
        </p>
        <NextStep href="#pricing" label="What does it cost?" />
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="border-b border-border">
      <div className="mx-auto max-w-6xl scroll-mt-14 px-5 py-16 md:px-8 md:py-24">
        <SectionHead
          kicker="Tenths of a cent per image"
          title="Pricing"
          intro="You pay Cloudflare's Workers AI token rates directly — no markup from this project. These are the README's figures."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Model input", "$0.049 per 1M tokens"],
            ["Model output", "$0.68 per 1M tokens"],
            ["Typical scan", "≈ $0.00013 (≈ $0.13 per 1,000)"],
            ["Free tier", "10,000 AI neurons/day ≈ $5 → roughly 30,000–40,000 free scans per day"],
          ].map(([t, d]) => (
            <div key={t} className="surface p-5">
              <h3 className="text-sm text-muted-foreground">{t}</h3>
              <p className="mt-2 font-mono text-[15px] font-semibold">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          A typical scan uses roughly 400–600 input tokens and 100–200 output tokens; bigger images
          and longer text cost more. Workers also get 100,000 free requests/day, then $0.30 per
          million.
        </p>
        <NextStep href="#download" label="Get the code" />
      </div>
    </section>
  );
}

function Download() {
  return (
    <section id="download" className="border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl scroll-mt-14 px-5 py-16 md:px-8 md:py-24">
        <h2 className="text-3xl font-semibold tracking-tight">Get FastHand OCR</h2>
        <p className="mt-3 max-w-xl opacity-70">
          Open source under the FastHand Studio organization. There is no hosted service to sign up
          for: {P.host}, on your own Cloudflare account, with your own API key.
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
          kicker="Three pieces, one file of logic"
          title="Stack &amp; architecture"
          intro="Deliberately tiny: a worker script, a config file, and a hosted model. Everything you need to audit it."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              [
                "Cloudflare Workers",
                "TypeScript runtime at the edge; the whole worker is src/index.ts.",
                Icons.cloud,
              ],
              [
                "Workers AI",
                "@cf/meta/llama-3.2-11b-vision-instruct, bound in wrangler.toml.",
                Icons.cpu,
              ],
              ["Wrangler", "Login, secrets, deploys, log tailing — one CLI.", Icons.command],
              [
                "Docs page",
                "An HTML reference shipped inside the worker itself, served at GET /.",
                Icons["document-text"],
              ],
            ] as IconRow[]
          ).map(([t, d, ic]) => (
            <article key={t} className="surface hover-lift p-5">
              <FeatureIcon C={ic} px={30} />
              <h3 className="mt-4 font-mono text-[15px] font-semibold">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Local development: <code className="font-mono text-foreground">npm run dev</code> serves
          the worker at http://localhost:8787;{" "}
          <code className="font-mono text-foreground">npm run tail</code> streams production logs.
        </p>
      </div>
    </section>
  );
}

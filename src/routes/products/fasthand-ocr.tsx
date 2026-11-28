import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/components/product/CodeBlock";
import { DiagramCaption, ProductSection, StepList } from "@/components/product/ProductSection";
import { MobileFlow, OcrNoticeScene, SceneFigure } from "@/components/product/scenes";
import { ProductHeader } from "@/components/product/ProductHeader";
import { ProductEcosystemFooter } from "@/components/product/ProductEcosystemFooter";
import { GitIcon, DownloadIcon } from "@/components/product/icons";
import { PRODUCTS } from "@/components/product/catalog";

const OCR = PRODUCTS.find((p) => p.href === "/products/fasthand-ocr")!;
import { TreeIcon, type TreeIconName } from "@/components/product/TreeIcon";
const ORIGIN = "https://fasthandstudio.asia";
const README = `${OCR.repo}/blob/main/README.md`;

const TITLE = "FastHand OCR — Send an image, get the printed text back | FastHand Studio";
const DESCRIPTION =
  "FastHand OCR is an API-key protected OCR worker on Cloudflare Workers, built on Llama 3.2 11B Vision. Send a base64 image, get back the printed text from labels, ID cards, documents, packaging and signs.";

export const Route = createFileRoute("/products/fasthand-ocr")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:type", content: "product" },
      { property: "og:site_name", content: "FastHand Studio" },
      { property: "og:url", content: `${ORIGIN}/products/fasthand-ocr` },
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
          name: "FastHand OCR",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Any (Cloudflare Workers)",
          description: DESCRIPTION,
          url: `${ORIGIN}/products/fasthand-ocr`,
          codeRepository: OCR.repo,
          license: "https://opensource.org/licenses/MIT",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            description: "Open source, self-deployed",
          },
          publisher: { "@id": `${ORIGIN}/#organization` },
        },
      },
    ],
    links: [{ rel: "canonical", href: `${ORIGIN}/products/fasthand-ocr` }],
  }),
  component: FastHandOcr,
});

const CURL = [
  "curl -X POST https://YOUR-DOMAIN.workers.dev/ \\",
  '  -H "Content-Type: application/json" \\',
  '  -H "X-API-Key: YOUR_API_KEY" \\',
  '  -d \'{"image": "<base64-encoded-image>"}\'',
].join("\n");

const BODY = ["{", '  "image": "<base64-encoded JPEG, PNG or WebP>"', "}"].join("\n");

const RESPONSE = [
  "{",
  '  "success": true,',
  '  "text": "Government of the People\'s Republic of Bangladesh\\nNational ID Card\\n...",',
  '  "words": [',
  '    { "text": "Government", "confidence": 0.85 },',
  '    { "text": "National", "confidence": 0.85 }',
  "  ]",
  "}",
].join("\n");

const DEPLOY = [
  "wrangler login",
  'echo "put-a-strong-random-key-here" | wrangler secret put API_KEY',
  "npm run deploy",
].join("\n");

const features: { t: string; i: TreeIconName; d: string; k: string }[] = [
  {
    t: "One request in, text out",
    i: "eye",
    d: "No OCR SDK and no page to host: post the image, read the text. Built on Llama 3.2 11B Vision, which reads small and mixed-script print character-for-character.",
    k: "@cf/meta/llama-3.2-11b-vision-instruct",
  },
  {
    t: "Only key-holders get answers",
    i: "key",
    d: "Requests without your secret X-API-Key header are rejected before the model runs. Wrong keys are compared in constant time, so guessing reveals nothing.",
    k: "X-API-Key · timing-safe compare",
  },
  {
    t: "Runs at the edge",
    i: "cloud",
    d: "“Edge” means the code runs on Cloudflare's global network instead of a server you manage — answers come back fast from whichever location is closest to the caller, and the free tier covers the requests.",
    k: "Cloudflare Workers",
  },
  {
    t: "Bad input is refused cheaply",
    i: "shield-tick",
    d: "8 MB per request, 6 MB per decoded image, and strict base64 rules (base64: the image bytes written out as plain text so JSON can carry them) stop garbage before it costs anything.",
    k: "8 MB · 6 MB · strict base64",
  },
];

const scripts = [
  ["English & other Latin scripts", "English, French, Spanish, German, Portuguese"],
  ["Bengali", "বাংলাদেশ"],
  ["Arabic", "العربية"],
  ["Hindi & Devanagari", "हिन्दी"],
  ["Chinese", "中文"],
  ["Japanese", "日本語"],
  ["Korean", "한국어"],
  ["Cyrillic", "Русский"],
];

const flowSteps: [string, string][] = [
  [
    "Your app sends the image",
    "The photo is converted to base64 text and put in a JSON body with your X-API-Key header.",
  ],
  [
    "The Worker checks the key",
    "The key must match the secret you set with wrangler secret put. No key or wrong key: 401, and no model time is spent.",
  ],
  [
    "The payload is validated",
    "Size caps (8 MB request, 6 MB image) and strict base64 rules reject anything malformed with 413 or 400.",
  ],
  [
    "Llama 3.2 11B Vision reads the image",
    "Workers AI — Cloudflare's built-in machine-learning models — transcribes the printed text character-for-character.",
  ],
  [
    "You get JSON back",
    "The full transcription plus a per-word list with confidence scores, ready to render or store.",
  ],
];

const errors = [
  ["401", "Missing or invalid X-API-Key"],
  ["400", "Missing or invalid image field, or bad base64"],
  ["413", "Body over 8 MB, or decoded image over 6 MB"],
  ["405", "Any method other than POST"],
  ["500", "Model or processing failure"],
];

const stack = [
  ["Runtime", "Cloudflare Workers"],
  ["Language", "TypeScript"],
  ["Model", "Llama 3.2 11B Vision (@cf/meta/llama-3.2-11b-vision-instruct)"],
  ["Licence", "MIT"],
];

function FastHandOcr() {
  return (
    <div id="top" className="min-h-screen">
      <ProductHeader
        repoUrl={OCR.repo}
        pageNav={[
          { href: "#features", label: "Features" },
          { href: "#how", label: "How it works" },
          { href: "#api", label: "API" },
        ]}
      />
      <main>
        <Hero />
        <Features />
        <Languages />
        <HowItWorks />
        <Api />
        <Download />
        <Stack />
      </main>
      <ProductEcosystemFooter current="FastHand OCR" />
    </div>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-[1.1fr_1fr] md:px-8 md:py-24">
      <div>
        <p className="font-mono text-sm text-muted-foreground">FastHand Studio · Product</p>
        <h1 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight md:text-[56px]">
          FastHand OCR
        </h1>
        <p className="mt-5 max-w-lg text-muted-foreground">
          Reading a printed label shouldn't need a human or a cloud vendor. FastHand OCR turns a
          photo into its text: send an image, get back what is printed on it — labels, ID cards,
          documents, packaging, signs. One POST request, protected by your API key, answered from
          the edge.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={OCR.repo}
            target="_blank"
            rel="noreferrer"
            className="btn-44 bg-primary text-primary-foreground"
          >
            <GitIcon /> Get the code
          </a>
          <a href="#api" className="btn-44 border border-border">
            Read the docs
          </a>
        </div>
        <p className="mt-6 font-mono text-[13px] text-muted-foreground">
          Workers · Llama 3.2 11B Vision · TypeScript · MIT
        </p>
      </div>
      <ScanFrame />
    </section>
  );
}

function ScanFrame() {
  const lines = ["w-4/5", "w-3/5", "w-11/12", "w-2/3", "w-3/4", "w-1/2"];
  return (
    <div className="relative mx-auto w-full max-w-[420px]" aria-hidden>
      <div className="surface hero-scan-frame aspect-[4/5] p-6 md:p-8">
        <div className="pointer-events-none absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-foreground" />
        <div className="pointer-events-none absolute right-4 top-4 h-6 w-6 border-r-2 border-t-2 border-foreground" />
        <div className="pointer-events-none absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-foreground" />
        <div className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-foreground" />
        <div className="flex h-full flex-col justify-center gap-3 px-2">
          <div className="mb-2 h-2.5 w-1/3 bg-foreground/80" />
          {lines.map((w, i) => (
            <div key={i} className={`h-2 bg-muted-foreground/35 ${w}`} />
          ))}
          <div className="mt-4 border-t border-border pt-4 font-mono text-xs leading-relaxed text-muted-foreground">
            NID&nbsp;NO.&nbsp;1994…
            <br />
            BIRTH&nbsp;DATE&nbsp;…
          </div>
        </div>
        <div className="hero-scan-line" />
      </div>
    </div>
  );
}

function Features() {
  return (
    <ProductSection
      id="features"
      kicker="What it does"
      title="Four properties that make it safe to ship"
      lead="Each card states a fact from the product README, not a promise: this is what happens when your app calls the endpoint."
      next={{ href: "#languages", label: "See which scripts it reads" }}
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <article key={f.t} className="surface flex flex-col p-6">
            <div className="flex items-center justify-between gap-3">
              <TreeIcon name={f.i} size={24} motion="hover" />
              <span className="font-mono text-sm text-muted-foreground">0{i + 1}</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold">{f.t}</h3>
            <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted-foreground">{f.d}</p>
            <p className="mt-5 font-mono text-[12px] break-words text-muted-foreground">{f.k}</p>
          </article>
        ))}
      </div>
      <SceneFigure mobile={<MobileFlow label="From photo to text" steps={[["A photographed notice","Small print, three type sizes, shot at an angle."],["Words are boxed","The endpoint finds each word region, even where the far end loses focus."],["JSON comes back","The full text plus a confidence score for each word."]]} />} caption="Figure 1 — the claim, drawn: a notice photographed at an angle, small Cyrillic print at three sizes, the far end falling out of focus. Dashed boxes are the endpoint's word regions; the response card is what comes back.">
        <OcrNoticeScene />
      </SceneFigure>
    </ProductSection>
  );
}

function Languages() {
  return (
    <ProductSection
      id="languages"
      kicker="Languages"
      title="Printed text in all major world scripts"
      lead="The table is the model's supported-script list, taken from the README. Under it: the one condition that decides real-world accuracy."
      tone="muted"
      next={{ href: "#how", label: "See how a request flows" }}
    >
      <div className="max-w-3xl overflow-x-auto">
        <table className="w-full min-w-[520px] border-y border-border text-left">
          <caption className="sr-only">Supported scripts and example text</caption>
          <thead>
            <tr className="border-b border-border">
              <th
                scope="col"
                className="py-3 pr-6 font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                Script / language
              </th>
              <th
                scope="col"
                className="py-3 font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                Example
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {scripts.map(([name, example]) => (
              <tr key={name}>
                <th scope="row" className="py-3 pr-6 font-semibold">
                  {name}
                </th>
                <td className="py-3 text-muted-foreground">{example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-6 max-w-3xl text-sm text-muted-foreground">
        Proof of the claim: verified against a real Bangladesh National ID card — the
        Bengali-English government header, holder and parents' names, date of birth and NID number
        all came back correct. <span className="font-mono text-foreground">Accuracy note:</span>{" "}
        crisp, upright, well-lit images transcribe almost perfectly; blur, glare and heavily
        stylized text reduce accuracy, and handwriting is less reliable than print.
      </p>
    </ProductSection>
  );
}

function HowItWorks() {
  return (
    <ProductSection
      id="how"
      kicker="How it works"
      title="Five steps, all inside one Worker invocation"
      lead="The diagram is the whole product — nothing runs outside these five stops. The numbered list repeats the same flow in words."
      next={{ href: "#api", label: "Read the API reference" }}
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
        <div>
          <svg
            viewBox="0 0 400 560"
            className="mx-auto h-auto w-full max-w-[400px]"
            role="img"
            aria-label="Flow diagram: your app sends a base64 image to the Worker, which checks the API key and validates sizes, calls the Llama 3.2 Vision model, and returns JSON text."
          >
            <defs>
              <marker
                id="ocr-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M0 0 L10 5 L0 10 z" className="fill-foreground" />
              </marker>
            </defs>
            <FlowNode y={0} label="1 · Your app" sub="photo → base64 text" />
            <FlowArrow y1={80} y2={100} />
            <FlowNode y={102} label="2 · Worker: auth" sub="X-API-Key or 401" accent />
            <FlowArrow y1={182} y2={202} />
            <FlowNode y={204} label="3 · Worker: validation" sub="8 MB · 6 MB · base64" accent />
            <FlowArrow y1={284} y2={304} />
            <FlowNode y={306} label="4 · Llama 3.2 11B Vision" sub="via Workers AI" />
            <FlowArrow y1={386} y2={406} />
            <FlowNode y={408} label="5 · JSON reply" sub="text + words + confidence" />
          </svg>
          <DiagramCaption>
            Figure 2 — a request's full path. Auth and validation (2–3) run before any model time is
            spent.
          </DiagramCaption>
        </div>
        <StepList steps={flowSteps} />
      </div>
    </ProductSection>
  );
}

function FlowNode({
  y,
  label,
  sub,
  accent,
}: {
  y: number;
  label: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <g>
      <rect
        x={32}
        y={y}
        width={336}
        height={78}
        rx={22}
        className={accent ? "fill-primary" : "fill-secondary stroke-border"}
        strokeWidth="1.5"
        style={{ cornerShape: "superellipse(1.5)" } as React.CSSProperties}
      />
      <text
        x={56}
        y={y + 33}
        className={accent ? "fill-primary-foreground" : "fill-foreground"}
        fontSize="16"
        fontWeight="600"
      >
        {label}
      </text>
      <text
        x={56}
        y={y + 57}
        className={accent ? "fill-primary-foreground" : "fill-muted-foreground"}
        fontSize="13"
        fontFamily="var(--font-mono)"
      >
        {sub}
      </text>
    </g>
  );
}

function FlowArrow({ y1, y2 }: { y1: number; y2: number }) {
  return (
    <path
      d={`M200 ${y1} L200 ${y2}`}
      className="stroke-foreground"
      strokeWidth="1.5"
      markerEnd="url(#ocr-arrow)"
    />
  );
}

function Api() {
  return (
    <ProductSection
      id="api"
      kicker="How to use it"
      title="One endpoint: POST /"
      lead="Four blocks, in reading order: how to call it, what to send, what success looks like, and every way the API says no. All names are placeholders — never put a real key in client-side code."
      next={{ href: "#download", label: "Get the code" }}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <CodeBlock
          label="request · cURL"
          code={CURL}
          note="Replace YOUR-DOMAIN and YOUR_API_KEY with your Worker's domain and your secret."
        />
        <CodeBlock
          label="request · JSON body"
          code={BODY}
          note="image takes a base64-encoded picture (the image bytes written as plain text, so JSON can carry them). JPEG, PNG, WebP; a data:image/…;base64, prefix is stripped automatically. Max 8 MB per request, 6 MB per decoded image."
        />
        <CodeBlock
          label="response · 200 OK"
          code={RESPONSE}
          note="text is the full transcription; words carries each word with a confidence score — Workers AI exposes no real scores, so each one defaults to 0.85."
        />
        <div className="surface overflow-x-auto">
          <p className="border-b border-border bg-secondary px-4 py-2 font-mono text-xs text-muted-foreground">
            response · every failure, with its cause
          </p>
          <table className="w-full min-w-[380px] text-left">
            <caption className="sr-only">Error responses and their causes</caption>
            <thead>
              <tr className="border-b border-border">
                <th
                  scope="col"
                  className="px-4 py-3 font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  Cause
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {errors.map(([status, cause]) => (
                <tr key={status}>
                  <td className="px-4 py-3 font-mono text-sm font-semibold">{status}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{cause}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProductSection>
  );
}

function Download() {
  return (
    <ProductSection
      id="download"
      kicker="How to get it"
      title="You deploy this yourself — that's the whole point"
      lead="FastHand OCR is not a hosted service. Clone the repository, set one secret with Wrangler (Cloudflare's command-line deploy tool), and the API is live on your own workers.dev domain."
      tone="muted"
      next={{ href: "#stack", label: "Stack and licence" }}
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-start">
        <div>
          <div className="flex flex-wrap gap-3">
            <a
              href={OCR.repo}
              target="_blank"
              rel="noreferrer"
              className="btn-44 bg-primary text-primary-foreground"
            >
              <GitIcon /> View on GitHub
            </a>
            <a href={OCR.zip} className="btn-44 border border-border">
              <DownloadIcon /> Download ZIP (main)
            </a>
          </div>
          <p className="mt-5 font-mono text-[13px] break-all text-muted-foreground">{OCR.repo}</p>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Everyone calling your worker uses the same API_KEY value. Rotate it whenever you like —
            another <span className="font-mono">wrangler secret put</span> with a new value, no code
            change.
          </p>
        </div>
        <CodeBlock
          label="deploy · three commands"
          code={DEPLOY}
          note="Needs Node 18+ and a Cloudflare account with Workers and Workers AI enabled. The key lives as a Cloudflare secret, never in the repo."
        />
      </div>
    </ProductSection>
  );
}

function Stack() {
  return (
    <ProductSection
      id="stack"
      kicker="Stack and licence"
      title="One Worker, one model, MIT licensed"
      lead="What the service is made of, and what it costs to run — both quoted from the README."
      next={{ href: "/products", label: "Browse all FastHand products" }}
    >
      <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-start">
        <dl className="divide-y divide-border border-y border-border">
          {stack.map(([k, v]) => (
            <div key={k} className="flex flex-wrap items-baseline justify-between gap-x-6 py-3">
              <dt className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                {k}
              </dt>
              <dd className="text-sm">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="max-w-md text-sm text-muted-foreground">
          <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            Pricing, small print
          </span>
          <br />
          Estimate: about <span className="font-mono">$0.13 per 1,000 scans</span>. The Workers AI
          free daily allowance (10,000 neurons, roughly $5 of model usage) covers approximately
          30,000–40,000 scans a day before anything is billed; exact numbers depend on image size
          and text density. Full breakdown in the{" "}
          <a href={README} target="_blank" rel="noreferrer" className="text-accent hover:underline">
            README pricing section
          </a>
          .
        </p>
      </div>
    </ProductSection>
  );
}

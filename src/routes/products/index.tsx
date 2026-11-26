import { createFileRoute } from "@tanstack/react-router";
import { PRODUCTS } from "@/components/product/data";
import { EcosystemFooter, GitIcon, ProductHeader, SectionHead } from "@/components/product/layout";
import { FeatureIcon, Icons } from "@/components/product/icons";

const ORIGIN = "https://fasthandstudio.asia";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Products — open-source projects you deploy yourself | FastHand Studio" },
      {
        name: "description",
        content:
          "The three products FastHand Studio maintains: FastyDiscord, FastHand OCR and Fast Notifications. Each is open source and runs on your own accounts.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Products by FastHand Studio" },
      {
        property: "og:description",
        content:
          "FastyDiscord, FastHand OCR and Fast Notifications — open-source products you deploy yourself.",
      },
      { property: "og:url", content: `${ORIGIN}/products` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${ORIGIN}/products` }],
  }),
  component: ProductsIndex,
});

function ProductsIndex() {
  return (
    <div className="min-h-screen">
      <ProductHeader repo="https://github.com/fasthand-studio" />
      <main>
        <Hero />
        <List />
      </main>
      <EcosystemFooter repo="https://github.com/fasthand-studio" crossLinks={[]} />
    </div>
  );
}

function Hero() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-sm text-muted-foreground">FastHand Studio &middot; Products</p>
        <h1 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight md:text-[52px]">
          Three products. All open source. All yours to run.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          None of these is a hosted service. Each one is a repository you deploy on your own Vercel
          or Cloudflare account, with your own keys — the product pages explain what each solves,
          how it works and how to set it up.
        </p>
      </div>
    </section>
  );
}

function List() {
  return (
    <section id="focus">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <SectionHead
          kicker="Pick your problem"
          title="What each product is for"
          intro="Read the one-sentence problem under each name; if it sounds familiar, the product page shows the fix."
        />
        <ul className="mt-10 divide-y divide-border border-y border-border">
          {PRODUCTS.map((p) => (
            <li key={p.slug} className="py-8 transition-colors duration-200 hover:bg-secondary/50">
              <div className="grid gap-4 md:grid-cols-[1fr_1.4fr_auto] md:items-center md:gap-8">
                <div className="flex items-center gap-4">
                  <RowIdentity slug={p.slug}>
                    <FeatureIcon C={Icons[p.icon]} px={30} />
                  </RowIdentity>
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight">{p.name}</h3>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">{p.chip}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">The problem: </span>
                    {p.problem}
                  </p>
                  <p className="mt-2 text-[15px]">{p.promise}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`/products/${p.slug}`}
                    className="btn-44 bg-primary text-primary-foreground"
                  >
                    Open product page
                  </a>
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-44 border border-border"
                  >
                    <GitIcon /> Code
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-10 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>Also worth knowing</span>
          <a href="/#work" className="btn-32 border border-border text-foreground">
            Everything on the studio bench <span aria-hidden>&rarr;</span>
          </a>
        </p>
      </div>
    </section>
  );
}

// A mini version of each product's own hero motif, so the index row previews the
// same visual identity a visitor meets on the product page. Static + aria-hidden;
// the animated icon is layered on top by the caller.
function RowIdentity({ slug, children }: { slug: string; children: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className="relative grid h-[68px] w-[92px] shrink-0 place-items-center overflow-hidden bg-secondary"
      style={{ borderRadius: 20, cornerShape: "superellipse(1.5)" } as React.CSSProperties}
    >
      <svg
        className="absolute inset-0 h-full w-full text-border"
        viewBox="0 0 92 68"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {slug === "fastydiscord" &&
          [18, 34, 50].map((y) => (
            <path
              key={y}
              className="flow-line"
              d={`M-10 ${y} H102`}
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
        {slug === "fasthand-ocr" && (
          <>
            <rect x={26} y={14} width={40} height={40} rx={7} stroke="currentColor" />
            {[24, 32, 40].map((y) => (
              <path key={y} d={`M34 ${y} H58`} stroke="currentColor" />
            ))}
            <path
              d="M20 8 L72 60"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-foreground"
              opacity="0.4"
            />
          </>
        )}
        {slug === "fastnotifications" &&
          [10, 20, 30, 40].map((r) => (
            <circle
              key={r}
              cx={68}
              cy={34}
              r={r}
              stroke="currentColor"
              className="ripple"
              style={{ animationDelay: `${r * -0.05}s` }}
            />
          ))}
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}

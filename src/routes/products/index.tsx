import { createFileRoute } from "@tanstack/react-router";
import { ProductHeader } from "@/components/product/ProductHeader";
import { ProductEcosystemFooter } from "@/components/product/ProductEcosystemFooter";
import { PRODUCTS } from "@/components/product/catalog";
import { TreeIcon } from "@/components/product/TreeIcon";
import { GITHUB_ORG } from "@/lib/github.functions";

const ORIGIN = "https://fasthandstudio.asia";
const TITLE = "Products | FastHand Studio";
const DESCRIPTION =
  "The open-source products from FastHand Studio: FastHand OCR, FastNotifications and FastyDiscord — self-hostable tools built on Cloudflare Workers, Vercel and Supabase.";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "FastHand Studio" },
      { property: "og:url", content: `${ORIGIN}/products` },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:image", content: `${ORIGIN}/og.png` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: `${ORIGIN}/og.png` },
    ],
    links: [{ rel: "canonical", href: `${ORIGIN}/products` }],
  }),
  component: ProductsIndex,
});

function ProductsIndex() {
  return (
    <div id="top" className="min-h-screen">
      <ProductHeader repoUrl={`https://github.com/${GITHUB_ORG}`} />
      <main>
        <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
          <p className="font-mono text-sm text-muted-foreground">FastHand Studio · Products</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Products</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Three open-source tools, each one small enough to read and yours to host. Every product
            page follows the same path: what it does, how it works, how to use it, how to get it.
          </p>
        </section>
        <section aria-label="Product list" className="mx-auto max-w-6xl px-5 pb-20 md:px-8">
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Listed in the order you would read them: what each tool replaces, then the page that
            explains how it works.
          </p>
          <ul className="mt-6 border-t border-border">
            {PRODUCTS.map((p) => (
              <li
                key={p.name}
                className="grid gap-4 border-b border-border py-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto] md:items-center md:gap-8"
              >
                <h2 className="flex items-center gap-3 text-xl font-semibold">
                  <TreeIcon name={p.icon} size={24} motion="hover" />
                  {p.name}
                </h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground">{p.pitch}</p>
                {p.ready ? (
                  <a
                    href={p.href}
                    className="btn-44 self-start bg-primary text-primary-foreground md:self-auto"
                  >
                    Open the product page →
                  </a>
                ) : (
                  <span className="btn-44 self-start border border-border text-muted-foreground md:self-auto">
                    Page coming soon
                  </span>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-10 text-[15px] text-muted-foreground">
            All three live in the same organisation:{" "}
            <a
              href={`https://github.com/${GITHUB_ORG}`}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              github.com/{GITHUB_ORG}
            </a>
            .
          </p>
        </section>
      </main>
      <ProductEcosystemFooter />
    </div>
  );
}

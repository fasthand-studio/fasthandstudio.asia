import { GITHUB_ORG } from "@/lib/github.functions";
import { PRODUCTS } from "@/components/product/catalog";

export function ProductEcosystemFooter({ current }: { current?: string }) {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <h2 className="text-2xl font-semibold tracking-tight">Part of the FastHand ecosystem</h2>
        <p className="mt-3 max-w-xl text-[15px] opacity-70">
          This product is one piece of what the studio ships. The rest of the work lives in the same
          organisation.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p) => (
            <li key={p.name}>
              <EcosystemTile
                href={p.ready ? p.href : undefined}
                title={p.name}
                desc={p.ready ? p.pitch : "Product page coming soon."}
                current={p.name === current}
              />
            </li>
          ))}
          <li>
            <EcosystemTile
              href={`https://github.com/${GITHUB_ORG}`}
              title="GitHub"
              desc="Every repository, issues and pull requests."
              external
            />
          </li>
        </ul>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-primary-foreground/20 pt-6 text-sm opacity-70">
          <span>
            © {new Date().getFullYear()} FastHand Studio · fasthandstudio.asia ·{" "}
            <a href="/#work" className="underline-offset-2 hover:underline">
              back to the studio work
            </a>
          </span>
          <a href="#top" className="hover:opacity-80">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}

function EcosystemTile({
  href,
  title,
  desc,
  current,
  external,
}: {
  href: string | undefined;
  title: string;
  desc: string;
  current?: boolean;
  external?: boolean;
}) {
  const cls =
    "flex h-full flex-col justify-between border border-primary-foreground/20 p-5 transition-opacity hover:opacity-80";
  const shape = { borderRadius: 24, cornerShape: "superellipse(1.5)" } as React.CSSProperties;
  const inner = (
    <>
      <span className="font-semibold">{title}</span>
      <span className="mt-2 text-[14px] opacity-70">{current ? "You are here" : desc}</span>
    </>
  );
  if (!href) {
    return (
      <span className={`${cls} opacity-60`} style={shape}>
        {inner}
      </span>
    );
  }
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={cls}
      style={shape}
      aria-current={current ? "page" : undefined}
    >
      {inner}
    </a>
  );
}

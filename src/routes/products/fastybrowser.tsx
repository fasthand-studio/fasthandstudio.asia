import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/components/product/CodeBlock";
import { ProductSection } from "@/components/product/ProductSection";
import { MobileFlow } from "@/components/product/scenes";
import { ProductHeader } from "@/components/product/ProductHeader";
import { ProductEcosystemFooter } from "@/components/product/ProductEcosystemFooter";
import { GitIcon, DownloadIcon } from "@/components/product/icons";
import { FASTYBROWSER } from "@/components/product/catalog";
import { TreeIcon, type TreeIconName } from "@/components/product/TreeIcon";

const ORIGIN = "https://fasthandstudio.asia";
const REPO = FASTYBROWSER.repo;
const RELEASES = `${REPO}/releases/latest`;
const DOCS = `${REPO}/tree/main/docs`;

const TITLE = "FastyBrowser — A private, native Linux browser | FastHand Studio";
const DESCRIPTION =
  "FastyBrowser is a private, native Linux browser written in Go on WebKitGTK 6.0 and GTK 4: tabs that sleep, a built-in blocker, passkeys and one-time codes, no account and no telemetry. MIT licensed.";

export const Route = createFileRoute("/products/fastybrowser")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:type", content: "product" },
      { property: "og:site_name", content: "FastHand Studio" },
      { property: "og:url", content: `${ORIGIN}/products/fastybrowser` },
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
          name: "FastyBrowser",
          applicationCategory: "BrowserApplication",
          operatingSystem: "Linux (x86_64)",
          description: DESCRIPTION,
          url: `${ORIGIN}/products/fastybrowser`,
          codeRepository: REPO,
          license: "https://opensource.org/license/mit",
          publisher: { "@id": `${ORIGIN}/#organization` },
        },
      },
    ],
    links: [{ rel: "canonical", href: `${ORIGIN}/products/fastybrowser` }],
  }),
  component: FastyBrowserPage,
});

const features: { t: string; i: TreeIconName; d: string; k: string; g: string }[] = [
  {
    t: "Tabs that sleep",
    i: "clock",
    d: "Unused tabs unload after five minutes by default, so background pages stop holding memory. Tabs that are playing audio stay awake.",
    k: "5 minutes · default",
    g: "“Unload” means the page is released from memory and reloaded when you come back to it.",
  },
  {
    t: "A built-in shield",
    i: "shield-tick",
    d: "EasyList, EasyPrivacy and StevenBlack filtering. YouTube ad handling is best effort, not guaranteed.",
    k: "EasyList · EasyPrivacy · StevenBlack",
    g: "These are public lists of ad and tracker addresses; requests to them are stopped before they leave the browser.",
  },
  {
    t: "Private by default",
    i: "eye",
    d: "No account, no telemetry, no crash reporting and no analytics. Browser data stays on your computer; sites and extensions still make their own requests.",
    k: "No account · no telemetry",
    g: "Telemetry is a browser quietly reporting what you do back to its maker. Fasty has none.",
  },
  {
    t: "Passkeys and one-time codes",
    i: "key",
    d: "ES256 passkeys and TOTP codes with encrypted local storage. It does not support USB security keys, sync or QR scanning.",
    k: "ES256 · TOTP · local only",
    g: "A passkey replaces a password with a key pair held on your device; TOTP is the six-digit code that changes every 30 seconds.",
  },
];

const stackSteps: [string, string][] = [
  ["Linux desktop", "Your distribution, packages and desktop session."],
  ["GTK 4 and libadwaita", "Native controls and an adaptive desktop interface."],
  ["WebKitGTK 6.0", "Web rendering and the web-platform APIs."],
  [
    "Fasty, written in Go",
    "Tabs, settings, privacy controls, extensions and local tools. No Chromium and no Electron.",
  ],
];

const INSTALL = [
  "chmod +x Fasty-*-x86_64.AppImage",
  "./Fasty-*-x86_64.AppImage",
].join("\n");

const stack = [
  ["Language", "Go"],
  ["Engine", "WebKitGTK 6.0"],
  ["Interface", "GTK 4 + libadwaita"],
  ["Platform", "Linux x86_64, glibc 2.39 or newer"],
  ["Packages", "AppImage, Debian/Ubuntu (.deb), Fedora (.rpm), tarball"],
  ["Licence", "MIT"],
];

function FastyBrowserPage() {
  return (
    <div id="top" className="min-h-screen">
      <ProductHeader
        repoUrl={REPO}
        pageNav={[
          { href: "#features", label: "Features" },
          { href: "#how", label: "How it works" },
          { href: "#install", label: "Install" },
        ]}
      />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Install />
        <Download />
        <Stack />
      </main>
      <ProductEcosystemFooter current="FastyBrowser" />
    </div>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-24">
      <p className="font-mono text-sm text-muted-foreground">FastHand Studio · Product</p>
      <h1 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight md:text-[56px]">
        FastyBrowser
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
        Less noise, more web. FastyBrowser is a private, native Linux browser that stays out of your
        way: tabs that sleep, a built-in shield, and passkeys and one-time codes kept on your own
        machine.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={RELEASES}
          target="_blank"
          rel="noreferrer"
          className="btn-44 bg-primary text-primary-foreground"
        >
          <DownloadIcon /> Download for Linux
        </a>
        <a href={REPO} target="_blank" rel="noreferrer" className="btn-44 border border-border">
          <GitIcon /> Get the code
        </a>
      </div>
      <p className="mt-6 font-mono text-[13px] text-muted-foreground">
        Go · WebKitGTK 6.0 · GTK 4 · MIT
      </p>
    </section>
  );
}

function Features() {
  return (
    <ProductSection
      id="features"
      kicker="What it does"
      title="Four things it does for you"
      lead="Each card states what the browser does today, taken from the project's own documentation, including what it does not do."
      next={{ href: "#how", label: "See how it is built" }}
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <article key={f.t} className="surface flex flex-col p-6">
            <div className="flex items-center justify-between gap-3">
              <TreeIcon name={f.i} size={24} motion="hover" />
              <span className="font-mono text-sm text-muted-foreground">0{i + 1}</span>
            </div>
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
    </ProductSection>
  );
}

function HowItWorks() {
  return (
    <ProductSection
      id="how"
      kicker="How it works"
      title="A small Go app on the platform's own parts"
      lead="Fasty does not bundle a web engine. It stands on four layers, listed here from your desktop down to the app itself."
      tone="muted"
      next={{ href: "#install", label: "Install it" }}
    >
      <figure className="surface p-6 md:p-10">
        <MobileFlow label="The Fasty stack" steps={stackSteps} />
        <figcaption className="mt-6 border-t border-border pt-4 text-sm text-muted-foreground">
          Figure 1 — The Fasty stack. Rendering is WebKitGTK&apos;s job, the desktop look is GTK
          4&apos;s, and Fasty&apos;s own Go code manages tabs, privacy and local tools.
        </figcaption>
      </figure>
    </ProductSection>
  );
}

function Install() {
  return (
    <ProductSection
      id="install"
      kicker="How to use it"
      title="Download a package, then run it"
      lead="The AppImage is one file: make it executable and start it. Fasty is not self-contained, so WebKitGTK 6.0, GTK 4 and libadwaita must already be on your system."
      next={{ href: "#get", label: "Get a package" }}
    >
      <div className="max-w-2xl">
        <CodeBlock label="AppImage" code={INSTALL} />
        <p className="mt-4 text-sm text-muted-foreground">
          The documented baseline is current Arch, Ubuntu 24.04 or newer, Debian 13 or newer and
          Fedora 40 or newer. Release testing was reported on Arch only. No Windows, macOS or ARM64
          package is published.
        </p>
      </div>
    </ProductSection>
  );
}

function Download() {
  return (
    <ProductSection
      id="get"
      kicker="How to get it"
      title="Packages and source, straight from GitHub"
      lead="Every package is attached to a release in the GitHub repository, with a published SHA-256 checksum."
      tone="muted"
      next={{ href: "#stack", label: "See the stack and licence" }}
    >
      <div className="flex flex-wrap gap-3">
        <a
          href={RELEASES}
          target="_blank"
          rel="noreferrer"
          className="btn-44 bg-primary text-primary-foreground"
        >
          <DownloadIcon /> Latest release
        </a>
        <a href={REPO} target="_blank" rel="noreferrer" className="btn-44 border border-border">
          <GitIcon /> Repository
        </a>
        <a href={FASTYBROWSER.zip} className="btn-44 border border-border">
          Source ZIP
        </a>
        <a href={DOCS} target="_blank" rel="noreferrer" className="btn-44 border border-border">
          Read the docs
        </a>
      </div>
    </ProductSection>
  );
}

function Stack() {
  return (
    <ProductSection
      id="stack"
      kicker="Stack and licence"
      title="Open source under the MIT licence"
      lead="Facts as they appear in the project's README and release notes."
      next={{ href: REPO, label: "Open the repository", external: true }}
    >
      <table className="w-full max-w-3xl border-y border-border text-left">
        <caption className="sr-only">FastyBrowser stack and licence</caption>
        <tbody className="divide-y divide-border">
          {stack.map(([k, v]) => (
            <tr key={k}>
              <th scope="row" className="w-32 py-3 pr-4 align-top font-semibold">
                {k}
              </th>
              <td className="py-3 text-muted-foreground">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ProductSection>
  );
}

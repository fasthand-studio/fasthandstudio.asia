import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { themeInitScript } from "../lib/theme";
import { ThemeToggle } from "../components/theme-toggle";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-5 text-center">
      <div className="absolute right-5 top-5 md:right-8">
        <ThemeToggle />
      </div>
      <p className="font-mono text-sm text-muted-foreground">FastHand Studio</p>
      <p className="mt-6 text-7xl font-semibold tracking-tight text-foreground">404</p>
      <h1 className="mt-4 text-xl font-semibold text-foreground">This page isn't here</h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        The page you're looking for doesn't exist or has moved. Our products and code are still one
        click away.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-44 bg-primary text-primary-foreground">
          Go home
        </Link>
        <a href="/products" className="btn-44 border border-border">
          Browse products
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-5 text-center">
      <div className="absolute right-5 top-5 md:right-8">
        <ThemeToggle />
      </div>
      <p className="font-mono text-sm text-muted-foreground">FastHand Studio</p>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        This page didn't load
      </h1>
      <p className="mt-3 max-w-sm text-muted-foreground">
        Something went wrong on our end. You can try again or head back home.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="btn-44 bg-primary text-primary-foreground"
        >
          Try again
        </button>
        <a href="/" className="btn-44 border border-border">
          Go home
        </a>
      </div>
    </div>
  );
}

const ORIGIN = "https://fasthandstudio.asia";
const SITE_TITLE = "FastHand Studio | Open-Source Development Studio";
const SITE_DESCRIPTION =
  "FastHand Studio is the development studio behind the FastHand ecosystem in Bangladesh — open-source tools, software and docs built in public on GitHub.";
const SHARE_IMAGE_ALT = "FastHand Studio — the development studio behind FastHand";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "author", content: "FastHand Studio" },
      { name: "theme-color", content: "#fbf9f5" },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "FastHand Studio" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: `${ORIGIN}/` },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:image", content: `${ORIGIN}/og.png` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: SHARE_IMAGE_ALT },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      { name: "twitter:image", content: `${ORIGIN}/og.png` },
      { name: "twitter:image:alt", content: SHARE_IMAGE_ALT },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${ORIGIN}/#organization`,
          name: "FastHand Studio",
          alternateName: "FastHand",
          url: `${ORIGIN}/`,
          description: SITE_DESCRIPTION,
          address: { "@type": "PostalAddress", addressCountry: "Bangladesh" },
          sameAs: ["https://github.com/FastHand-Studio"],
          logo: {
            "@type": "ImageObject",
            "@id": `${ORIGIN}/#logo`,
            url: `${ORIGIN}/logo-512.png`,
            width: 512,
            height: 512,
            caption: "FastHand Studio",
          },
          image: { "@id": `${ORIGIN}/#logo` },
        },
      },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${ORIGIN}/#website`,
          url: `${ORIGIN}/`,
          name: "FastHand Studio",
          description: SITE_DESCRIPTION,
          inLanguage: "en",
          publisher: { "@id": `${ORIGIN}/#organization` },
        },
      },
    ],
    links: [
      { rel: "canonical", href: `${ORIGIN}/` },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Applies the saved theme before first paint; CSP allows inline scripts. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}

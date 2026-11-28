import { GitIcon, DownloadIcon } from "@/components/product/icons";

/** The product's own closing band: what it is, where the code lives, how to leave. */
export function ProductFooter({ repoUrl, zipUrl }: { repoUrl: string; zipUrl: string }) {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-16">
        <h2 className="text-2xl font-semibold tracking-tight">Notifications you run yourself</h2>
        <p className="mt-3 max-w-xl text-[15px] opacity-70">
          FastNotifications is one open-source Cloudflare Worker: a WebSocket per device, a queue
          for offline phones, and no push vendor anywhere in the path.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-44 bg-primary-foreground text-primary"
          >
            <GitIcon /> View on GitHub
          </a>
          <a
            href={zipUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-44 border border-primary-foreground/40"
          >
            <DownloadIcon /> Download ZIP
          </a>
          <a href="#top" className="btn-44 border border-primary-foreground/40">
            Back to top
          </a>
        </div>
        <p className="mt-10 border-t border-primary-foreground/20 pt-6 text-sm opacity-70">
          © {new Date().getFullYear()} FastNotifications · MIT licensed · the source is the whole
          story.
        </p>
      </div>
    </footer>
  );
}

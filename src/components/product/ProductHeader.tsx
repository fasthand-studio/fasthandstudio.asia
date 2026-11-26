import { GitIcon } from "@/components/product/icons";
import { ThemeToggle } from "@/components/product/ThemeToggle";

export function ProductHeader({
  repoUrl,
  pageNav,
}: {
  repoUrl: string;
  pageNav?: { href: string; label: string }[];
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
        <a href="/" className="flex shrink-0 items-center gap-2 font-semibold">
          <img src="/logo.svg" alt="" width={45} height={30} className="h-[30px] w-[45px]" />
          <span className="hidden sm:inline">FastHand Studio</span>
        </a>
        <nav aria-label="Primary" className="flex items-center gap-1 text-[15px]">
          {pageNav?.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="btn-32 hidden font-normal text-muted-foreground hover:bg-muted sm:inline-flex"
            >
              {l.label}
            </a>
          ))}
          <a href="/products" className="btn-32 bg-secondary font-semibold" aria-current="page">
            Products
          </a>
          <ThemeToggle />
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-32 bg-primary text-primary-foreground"
          >
            <GitIcon /> GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}

export const PRODUCTS = [
  {
    slug: "fastydiscord",
    icon: "direct-notification",
    name: "FastyDiscord",
    repo: "https://github.com/fasthand-studio/FastyDiscord",
    zip: "https://github.com/fasthand-studio/FastyDiscord/archive/refs/heads/main.zip",
    problem:
      "GitHub activity is scattered across commits, PRs and releases, and nobody reads the notification inbox.",
    promise:
      "GitHub activity notifications and weekly contribution reports delivered inside Discord, running serverless on Vercel with Supabase.",
    chip: "Vercel · Supabase · Discord",
    host: "you deploy it yourself on Vercel",
  },
  {
    slug: "fasthand-ocr",
    icon: "scan",
    name: "FastHand OCR",
    repo: "https://github.com/fasthand-studio/fasthand-ocr",
    zip: "https://github.com/fasthand-studio/fasthand-ocr/archive/refs/heads/main.zip",
    problem:
      "Reading text out of a photo usually means running a GPU server or paying per call to a vendor API.",
    promise:
      "A real-time OCR API on Cloudflare Workers AI: send a base64 image, get the printed text back, no model hosting.",
    chip: "Cloudflare Workers · Workers AI",
    host: "you deploy it yourself on Cloudflare Workers",
  },
  {
    slug: "fastnotifications",
    icon: "flash",
    name: "Fast Notifications",
    repo: "https://github.com/fasthand-studio/FastNotifications",
    zip: "https://github.com/fasthand-studio/FastNotifications/archive/refs/heads/main.zip",
    problem:
      "Push delivery through third-party services like FCM adds a dependency you don't control and can't self-host.",
    promise:
      "A FCM-independent push backend on Cloudflare Workers: instant delivery over WebSockets, offline queueing in D1, no third-party push service.",
    chip: "Cloudflare Workers · Durable Objects · D1",
    host: "you deploy it yourself on Cloudflare Workers",
  },
] as const;

export function crossLinks(exclude: string) {
  return PRODUCTS.filter((p) => p.slug !== exclude).map((p) => ({
    href: `/products/${p.slug}`,
    label: `${p.name} — read the product page`,
  }));
}

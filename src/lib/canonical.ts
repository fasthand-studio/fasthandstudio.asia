/**
 * Host and scheme canonicalization.
 *
 * The Worker is bound to both `fasthandstudio.asia` and `www.fasthandstudio.asia`
 * and Cloudflare serves plain HTTP unless the zone's "Always Use HTTPS" is on,
 * so all four variants would otherwise answer with the same page and split the
 * site across four URLs. Everything that is not one of these hosts — localhost,
 * preview deployments, the workers.dev address — is left exactly as it is.
 */

const CANONICAL_HOST = "fasthandstudio.asia";

/** Aliases that exist only to be redirected to the canonical host. */
const ALIAS_HOSTS = new Set(["www.fasthandstudio.asia"]);

/**
 * The scheme the visitor actually used. Cloudflare terminates TLS itself and
 * reports the inbound protocol on `cf-visitor`, so `request.url` is not on its
 * own a reliable witness.
 */
function visitorScheme(request: Request, url: URL): string {
  const cfVisitor = request.headers.get("cf-visitor");
  if (cfVisitor) {
    try {
      const scheme = (JSON.parse(cfVisitor) as { scheme?: unknown }).scheme;
      if (typeof scheme === "string") return scheme;
    } catch {
      // A costume header from a client that has read this file. Ignore it.
    }
  }
  const forwarded = request.headers.get("x-forwarded-proto");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return url.protocol.replace(":", "");
}

function canonicalTarget(request: Request, url: URL): URL | null {
  const hostname = url.hostname.toLowerCase();
  if (hostname !== CANONICAL_HOST && !ALIAS_HOSTS.has(hostname)) return null;

  const target = new URL(url.href);
  const wrongHost = hostname !== CANONICAL_HOST;
  const wrongScheme = visitorScheme(request, url) !== "https";
  if (!wrongHost && !wrongScheme) return null;

  target.protocol = "https:";
  target.hostname = CANONICAL_HOST;
  target.port = "";
  return target;
}

/**
 * No body: the target is built from the request path, and nothing here should
 * echo a caller's input back at it.
 */
export function canonicalRedirect(request: Request, url: URL): Response | null {
  const target = canonicalTarget(request, url);
  if (!target) return null;
  return new Response(null, {
    status: 301,
    headers: { location: target.href, "cache-control": "no-store" },
  });
}

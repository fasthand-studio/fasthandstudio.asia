import type { Decoy } from "./decoys";
import { traceFor, withAttempts } from "./decoys";

/**
 * Response hardening for the real site, plus the traffic-shaping that keeps the
 * decoys in src/lib/decoys.ts from becoming a denial-of-service against us.
 *
 * This is a backstop, not the wall. Every request that reaches this file has
 * already been counted against the Worker's daily request budget, so the limit
 * that actually protects the site is the rate-limiting rule on the Cloudflare
 * zone — see README. Nothing here should be trusted to keep the lights on.
 */

const WINDOW_MS = 60_000;
const DECOY_LIMIT = 30;
const BLOCK_SECONDS = 86_400;
const SERVER_FN_LIMIT = 120;
const MAX_PATH_LEN = 1024;
const MAX_BODY_BYTES = 16 * 1024;
/**
 * Ceiling for everything an address asks the Worker for in a minute, not just
 * the decoy paths. Static assets are served before the Worker runs, so a real
 * visitor — even one sharing an exit address with an office — stays well under
 * this; a poller does not.
 */
const ADDRESS_LIMIT = 120;

const IP_SALT = "fasthand-studio-decoy-v1:";

const buckets = new Map<string, { n: number; at: number }>();

/** A one-way hash so the counter never retains a raw address. */
export function ipKey(request: Request, namespace: string): string {
  const raw =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  let h = 5381;
  const s = IP_SALT + raw;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return `${namespace}:${(h >>> 0).toString(36)}`;
}

function hit(key: string, limit: number): { n: number; blocked: boolean } {
  const now = Date.now();
  if (buckets.size > 4096) {
    for (const [k, v] of buckets) if (now - v.at > WINDOW_MS) buckets.delete(k);
  }
  const prev = buckets.get(key);
  if (!prev || now - prev.at > WINDOW_MS) {
    buckets.set(key, { n: 1, at: now });
    return { n: 1, blocked: false };
  }
  prev.n += 1;
  return { n: prev.n, blocked: prev.n > limit };
}

export function tooManyServerFns(request: Request): boolean {
  return hit(ipKey(request, "sf"), SERVER_FN_LIMIT).blocked;
}

/** The one limit here that covers the whole site, not only the decoy paths. */
export function tooMuchFromThisAddress(request: Request): boolean {
  return hit(ipKey(request, "addr"), ADDRESS_LIMIT).blocked;
}

export function csp(host: string): string {
  // Vite's dev server talks to the page over a same-host WebSocket.
  const ws = host.includes("localhost") || host === "127.0.0.1" ? " ws: wss:" : "";
  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    `connect-src 'self'${ws}`,
    "manifest-src 'self'",
    "object-src 'none'",
    "frame-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];
  if (!ws) directives.push("upgrade-insecure-requests");
  return directives.join("; ");
}

const REAL_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  "Cross-Origin-Opener-Policy": "same-origin",
  Link: '<https://fasthandstudio.asia/.well-known/security.txt>; rel="security.txt"',
  "Permissions-Policy":
    "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()",
};

const LEAKY = ["x-powered-by", "x-aspnet-version", "x-generator", "server"];

export function hardenResponse(original: Response, url: URL): Response {
  const headers = new Headers(original.headers);
  for (const h of LEAKY) headers.delete(h);
  for (const [k, v] of Object.entries(REAL_HEADERS)) headers.set(k, v);
  headers.set("Content-Security-Policy", csp(url.host));
  return rebuild(original, headers);
}

function rebuild(original: Response, headers: Headers): Response {
  if (original.status === 204 || original.status === 304 || original.status === 205) {
    return new Response(null, {
      status: original.status,
      statusText: original.statusText,
      headers,
    });
  }
  return new Response(original.body, {
    status: original.status,
    statusText: original.statusText,
    headers,
  });
}

function baseDecoyHeaders(): Headers {
  const headers = new Headers();
  for (const h of LEAKY) headers.delete(h);
  for (const [k, v] of Object.entries(REAL_HEADERS)) headers.set(k, v);
  headers.set(
    "Content-Security-Policy",
    "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
  );
  headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
  // A costume for anything fingerprinting us: ancient, PHP-shaped, and wrong.
  headers.set("Server", "Apache/2.2.17 (Unix) mod_ssl/2.2.17 OpenSSL/0.9.8y PHP/5.2.6");
  headers.set("X-Powered-By", "PHP/5.2.6");
  headers.set("Set-Cookie", "PHPSESSID=0f4c1a9b8e7d6c5b4a39281706f5e4d3; path=/; HttpOnly");
  return headers;
}

export function decoyResponse(decoy: Decoy, request: Request): Response {
  const key = ipKey(request, "decoy");
  const { n, blocked } = hit(key, DECOY_LIMIT);

  // Past the allowance the address is finished with. A costume at this point is
  // a reward: it says the path is still worth knocking on.
  if (blocked) return blockedResponse();

  const headers = baseDecoyHeaders();
  headers.set("X-Mod-Security-Trace", traceFor(n));
  headers.set("X-RateLimit-Limit", String(DECOY_LIMIT));
  headers.set("X-RateLimit-Remaining", String(Math.max(0, DECOY_LIMIT - n)));
  headers.set("Cache-Control", "no-store");
  headers.set("Content-Type", decoy.contentType);

  const text = withAttempts(decoy.dynamic ? decoy.dynamic(n) : decoy.body, n);
  return new Response(text, { status: decoy.status, headers });
}

/**
 * The terminal answer for an address that has outstayed its welcome. Plain,
 * uncostumed, and long — the opposite of an invitation.
 */
export function blockedResponse(): Response {
  return new Response("Forbidden.\n", {
    status: 403,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "retry-after": String(BLOCK_SECONDS),
      "x-robots-tag": "noindex, nofollow",
    },
  });
}

export function oversized(request: Request): boolean {
  const len = Number(request.headers.get("content-length") ?? "0");
  return Number.isFinite(len) && len > MAX_BODY_BYTES;
}

export function malformed(url: URL): boolean {
  const p = url.pathname;
  if (p.length > MAX_PATH_LEN) return true;
  for (let i = 0; i < p.length; i++) {
    const c = p.charCodeAt(i);
    if (c < 0x20 || c === 0x7f) return true;
  }
  return false;
}

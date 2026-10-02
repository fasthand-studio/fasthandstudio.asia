import type { Decoy } from "./decoys";
import { tauntFor, teapotResponse } from "./decoys";

/**
 * Response hardening for the real site, plus the traffic-shaping that keeps the
 * decoys in src/lib/decoys.ts from becoming a denial-of-service against us.
 */

const WINDOW_MS = 60_000;
const DECOY_LIMIT = 30;
const TEAPOT_AFTER = 60;
const SERVER_FN_LIMIT = 120;
const MAX_PATH_LEN = 1024;
const MAX_BODY_BYTES = 16 * 1024;
const MAX_CONCURRENT_TARPITS = 4;

const IP_SALT = "fasthand-studio-decoy-v1:";

const buckets = new Map<string, { n: number; at: number }>();
let tarpits = 0;

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
  headers.set("Set-Cookie", "PHPSESSID=decoy0000000000000000000000000; path=/; HttpOnly");
  return headers;
}

export function decoyResponse(decoy: Decoy, request: Request): Response {
  const key = ipKey(request, "decoy");
  const { n, blocked } = hit(key, DECOY_LIMIT);

  const headers = baseDecoyHeaders();
  headers.set("X-FastHand-Decoy", tauntFor(n));
  headers.set("X-Exploitability", "0%");
  headers.set("X-Attempts", String(n));

  if (n > TEAPOT_AFTER) {
    headers.set("Retry-After", "86400");
    return new Response(teapotResponse(), { status: 418, headers, statusText: "I'm a Teapot" });
  }
  if (blocked) {
    headers.set("Retry-After", "300");
    return new Response(
      `${decoy.path} is not a real endpoint, and you are now rate limited.\n` +
        `We counted ${n} knocks in the last minute. The honest answer is that this\n` +
        `domain serves one static React page from a CDN. Go build something.\n`,
      { status: 429, headers },
    );
  }

  headers.set("Cache-Control", "no-store");
  headers.set("Content-Type", decoy.contentType);
  const body =
    decoy.tarpit && tarpits < MAX_CONCURRENT_TARPITS ? tarpitStream(decoy.body) : decoy.body;
  return new Response(body, { status: decoy.status, headers });
}

/** One line every 150ms: their client waits, our worker does nothing. */
function tarpitStream(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const lines = text.split(/(?<=\n)/g);
  let i = 0;
  let spent = false;
  tarpits += 1;
  const release = () => {
    if (!spent) {
      spent = true;
      tarpits -= 1;
    }
  };
  return new ReadableStream<Uint8Array>({
    pull(controller) {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          if (i < lines.length) {
            controller.enqueue(encoder.encode(lines[i++]));
          } else {
            release();
            controller.close();
          }
          resolve();
        }, 150);
      });
    },
    cancel() {
      release();
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

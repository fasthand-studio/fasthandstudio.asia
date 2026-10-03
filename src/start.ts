import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";

import { buildDecoy, classify } from "./lib/decoys";
import { canonicalRedirect } from "./lib/canonical";
import {
  blockedResponse,
  decoyResponse,
  hardenResponse,
  malformed,
  oversized,
  tooManyServerFns,
  tooMuchFromThisAddress,
} from "./lib/security";
import { renderErrorPage } from "./lib/error-page";

// Scanners get a hand-written prop instead of the router's 404 page. Everything
// else leaves this middleware with hardened headers.
const guardMiddleware = createMiddleware().server(async ({ request, handlerType, next }) => {
  const url = new URL(request.url);

  // First, because it is the only check here that has to cover a looping or
  // flooding address before it spends anything else.
  if (tooMuchFromThisAddress(request)) return blockedResponse();

  if (malformed(url)) {
    return new Response("Malformed request.\n", {
      status: 414,
      headers: { "content-type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" },
    });
  }
  if (request.method !== "GET" && request.method !== "HEAD" && oversized(request)) {
    return new Response("Request entity too large.\n", { status: 413 });
  }

  const moved = canonicalRedirect(request, url);
  if (moved) return moved;

  if (classify(url.pathname)) {
    console.warn(`[decoy] ${request.method} ${url.pathname}`);
    return decoyResponse(buildDecoy(url.pathname, request.method), request);
  }

  if (handlerType === "serverFn" && tooManyServerFns(request)) {
    return new Response(JSON.stringify({ error: "Too many requests." }), {
      status: 429,
      headers: { "content-type": "application/json", "Retry-After": "60" },
    });
  }

  const result = await next();
  return hardenResponse(result.response, url);
});

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [guardMiddleware, errorMiddleware, csrfMiddleware],
}));

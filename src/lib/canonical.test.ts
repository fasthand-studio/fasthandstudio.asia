import { describe, expect, it } from "vitest";
import { canonicalRedirect } from "./canonical";

/** The shape Cloudflare hands the Worker: an https URL plus what came in, over cf-visitor. */
function visit(scheme: string, host: string, path = "/") {
  const url = new URL(`https://${host}${path}`);
  const request = new Request(url.href, { headers: { "cf-visitor": `{"scheme":"${scheme}"}` } });
  return canonicalRedirect(request, url);
}

function locationOf(moved: Response | null): string | null {
  return moved?.headers.get("location") ?? null;
}

describe("canonical redirects", () => {
  it("sends plain HTTP to HTTPS on the canonical host", () => {
    expect(visit("http", "fasthandstudio.asia")?.status).toBe(301);
    expect(locationOf(visit("http", "fasthandstudio.asia"))).toBe("https://fasthandstudio.asia/");
  });

  it("sends www to the apex, upgrading the scheme in the same hop", () => {
    expect(locationOf(visit("http", "www.fasthandstudio.asia"))).toBe(
      "https://fasthandstudio.asia/",
    );
    expect(locationOf(visit("https", "www.fasthandstudio.asia"))).toBe(
      "https://fasthandstudio.asia/",
    );
  });

  it("keeps the path, query and hash", () => {
    expect(locationOf(visit("http", "www.fasthandstudio.asia", "/?utm_source=x#a"))).toBe(
      "https://fasthandstudio.asia/?utm_source=x#a",
    );
  });

  it("falls back to the URL's own protocol when Cloudflare sends no cf-visitor", () => {
    const url = new URL("http://fasthandstudio.asia/");
    const moved = canonicalRedirect(new Request(url.href), url);
    expect(moved?.status).toBe(301);
    expect(moved?.headers.get("location")).toBe("https://fasthandstudio.asia/");
  });

  it("leaves the canonical HTTPS request alone", () => {
    expect(visit("https", "fasthandstudio.asia")).toBeNull();
    const secure = new URL("https://fasthandstudio.asia/");
    expect(canonicalRedirect(new Request(secure.href), secure)).toBeNull();
  });

  it("does not touch dev, preview or workers.dev hosts", () => {
    expect(visit("http", "localhost:8080")).toBeNull();
    expect(visit("http", "fasthand-studio.some-account.workers.dev")).toBeNull();
  });

  it("carries no body, so nothing from the request is reflected", () => {
    const moved = visit("http", "www.fasthandstudio.asia", "/<svg>");
    expect(moved?.body).toBeNull();
    expect(locationOf(moved)).toBe("https://fasthandstudio.asia/%3Csvg%3E");
  });
});

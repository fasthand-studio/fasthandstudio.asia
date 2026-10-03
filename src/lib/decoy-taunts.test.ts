import { describe, expect, it } from "vitest";
import { buildDecoy, withAttempts } from "./decoys";
import { classify } from "./decoys";
import { decoyResponse, tooMuchFromThisAddress } from "./security";

const PATHS = [
  "/.env",
  "/wp-config.php",
  "/wp-login.php",
  "/backup.sql",
  "/phpinfo.php",
  "/server-status",
  "/xmlrpc.php",
  "/.git/config",
  "/.git/HEAD",
  "/graphql",
  "/actuator/env",
  "/actuator/health",
  "/actuator",
  "/telescope/requests",
  "/docker-compose.yml",
  "/.bash_history",
  "/id_rsa",
  "/etc/shadow",
  "/app/logs/laravel.log",
  "/.aws/credentials",
  "/index.php.bak",
  "/database.sql",
  "/database/backups.sql.gz",
  "/phpmyadmin/",
  "/shell",
  "/cgi-bin/test.cgi",
];

describe("decoy taunts", () => {
  it("leaves no unrendered attempt token behind", () => {
    for (const path of PATHS) {
      expect(classify(path), path).not.toBeNull();
      const decoy = buildDecoy(path, "GET");
      const out = withAttempts(decoy.dynamic ? decoy.dynamic(7) : decoy.body, 7);
      expect(out, `${path} @@N@@`).not.toContain("@@N@@");
    }
  });

  it("keeps JSON payloads valid at several attempt counts", () => {
    for (const path of PATHS) {
      const decoy = buildDecoy(path, "GET");
      if (!decoy.contentType.includes("json")) continue;
      for (const n of [1, 4, 99]) {
        const out = withAttempts(decoy.dynamic ? decoy.dynamic(n) : decoy.body, n);
        expect(() => JSON.parse(out), `${path} @${n}`).not.toThrow();
      }
    }
  });

  it("cycles the login ladder through green and red boxes", () => {
    const get = buildDecoy("/wp-login.php", "GET");
    expect(get.body).not.toContain('<div id="login_error"');
    expect(get.body).not.toContain("Successfully failed");
    const post = buildDecoy("/wp-login.php", "POST");
    expect(post.status).toBe(401);
    const seen = new Set<string>();
    for (let n = 1; n <= 24; n += 1) {
      const html = withAttempts(post.dynamic?.(n) ?? "", n);
      const isGreen = html.includes('class="updated ok"');
      const isRed = html.includes('id="login_error"');
      expect(isGreen !== isRed, `attempt ${n}`).toBe(true);
      seen.add(isGreen ? "green" : "red");
      expect(html).toContain(`attempts from this address: <strong>${n}</strong>`);
      if (n > 6) expect(html).toContain("It was not a mistake.");
    }
    expect([...seen].sort()).toEqual(["green", "red"]);
  });

  it("ends the conversation with a plain 403 once the allowance is spent", async () => {
    const request = new Request("https://fasthandstudio.asia/.env", {
      headers: { "cf-connecting-ip": "203.0.113.77" },
    });
    const decoy = buildDecoy("/.env", "GET");
    let last = decoyResponse(decoy, request);
    expect(last.status).toBe(decoy.status);
    for (let i = 0; i < 40; i += 1) last = decoyResponse(decoy, request);

    expect(last.status).toBe(403);
    expect(last.headers.get("retry-after")).toBe("86400");
    // The Apache costume goes away with the block: nothing left to encourage.
    expect(last.headers.get("server")).toBeNull();
    expect(last.headers.get("x-powered-by")).toBeNull();
    expect(await last.text()).toBe("Forbidden.\n");
  });

  it("blocks an address that floods the Worker, not just the decoy paths", () => {
    const request = new Request("https://fasthandstudio.asia/", {
      headers: { "cf-connecting-ip": "203.0.113.88" },
    });
    let blocked = false;
    for (let i = 0; i < 200; i += 1) blocked = tooMuchFromThisAddress(request);
    expect(blocked).toBe(true);

    const quiet = new Request("https://fasthandstudio.asia/", {
      headers: { "cf-connecting-ip": "203.0.113.99" },
    });
    expect(tooMuchFromThisAddress(quiet)).toBe(false);
  });
});

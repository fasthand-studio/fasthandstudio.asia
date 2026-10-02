import { describe, expect, it } from "vitest";
import { buildDecoy, rateLimitedPage, teapotResponse, withAttempts } from "./decoys";
import { classify } from "./decoys";

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

  it("escapes into 429 and 418 with counts", () => {
    expect(rateLimitedPage(44)).toContain("44. The limit is 30");
    expect(teapotResponse(61)).toContain("61");
    expect(teapotResponse(61)).not.toContain("@@N@@");
    expect(teapotResponse()).not.toContain("@@N@@");
  });
});

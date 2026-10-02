/**
 * Decoy endpoints for the automated scanners that knock on /wp-login.php and /.env.
 *
 * Every body in this file is a static string. Nothing is read from the request
 * except the pathname, so attacker input can never be reflected back into a
 * response. There is no database, no shell and no secret here to find.
 */

export type DecoyKind = "secrets" | "panel" | "exec";

export type Decoy = {
  kind: DecoyKind;
  path: string;
  status: number;
  contentType: string;
  body: string;
  /** Drip the body out slowly to waste the caller's time. */
  tarpit: boolean;
};

const SECRET_EXACT = new Set([
  "/.env",
  "/.env.local",
  "/.env.production",
  "/.env.dev",
  "/.env.backup",
  "/.aws/credentials",
  "/.aws/config",
  "/.git/config",
  "/.git/HEAD",
  "/.gitignore",
  "/.git-credentials",
  "/.DS_Store",
  "/.bash_history",
  "/.ssh/id_rsa",
  "/.ssh/id_ed25519",
  "/id_rsa",
  "/wp-config.php",
  "/configuration.php",
  "/config.php",
  "/config.inc.php",
  "/settings.php",
  "/database.yml",
  "/db/config.json",
  "/backup.sql",
  "/dump.sql",
  "/database.sql",
  "/sql.sql",
  "/admin/backup-2026.sql",
  "/backup/database.sql.gz",
  "/etc/passwd",
  "/proc/self/environ",
]);

const SECRET_PREFIXES = [
  "/.git/",
  "/.aws/",
  "/.ssh/",
  "/backup/",
  "/backups/",
  "/dumps/",
  "/db-dumps/",
];

const SECRET_SUFFIXES = [
  ".env",
  ".sql",
  ".sql.gz",
  ".sqlite",
  ".bak",
  ".old",
  ".swp",
  ".save",
  ".pem",
  ".key",
  ".pkcs12",
  ".tar.gz",
  ".zip",
  ".7z",
  ".yml",
  ".yaml",
  ".ini",
  ".conf",
  ".log",
];

const PANEL_EXACT = new Set([
  "/admin",
  "/admin/",
  "/login",
  "/signin",
  "/administrator",
  "/administrator/",
  "/wp-login.php",
  "/wp-admin",
  "/wp-admin/",
  "/xmlrpc.php",
  "/phpmyadmin",
  "/phpmyadmin/",
  "/pma",
  "/mysql",
  "/manager/html",
  "/cpanel",
  "/webmail",
  "/owa",
  "/owa/auth/logon.aspx",
  "/solr/",
  "/druid/index.html",
  "/console",
  "/web-console",
  "/status",
  "/actuator",
  "/actuator/health",
  "/actuator/env",
  "/_config",
  "/cgi-bin",
]);

const PANEL_PREFIXES = [
  "/wp-admin/",
  "/wp-content/uploads/",
  "/wp-includes/",
  "/administrator/",
  "/phpmyadmin/",
  "/pma/",
  "/mysql/",
  "/manager/",
  "/actuator/",
  "/solr/",
  "/druid/",
  "/web-console/",
  "/console/",
  "/debug/",
  "/owa/",
  "/autodiscover/",
  // Paths advertised in robots.txt purely so that whatever probes them finds a
  // prop instead of a 404. None of them are linked from the site.
  "/internal/",
  "/unpublished/",
  "/staff/",
  "/api/internal/",
];

const EXEC_PREFIXES = ["/cgi-bin/", "/_profiler/", "/telescope/", "/xdebug/", "/_dt/"];

const EXEC_EXACT = new Set([
  "/phpinfo.php",
  "/info.php",
  "/phpinfo",
  "/server-status",
  "/server-info",
  "/shell",
  "/cmd",
  "/c99.php",
  "/r57.php",
  "/webshell.php",
  "/graphql",
  "/_graphql",
  "/debug",
  "/debug/default/view",
  "/telescope",
  "/xdebug",
]);

/** Longest-match wins so `/admin/backup-2026.sql` reads as a leaked dump, not a login form. */
export function classify(pathname: string): DecoyKind | null {
  if (pathname.startsWith("/_serverFn")) return null;
  if (SECRET_EXACT.has(pathname)) return "secrets";
  if (PANEL_EXACT.has(pathname)) return "panel";
  if (EXEC_EXACT.has(pathname)) return "exec";
  if (startsWithAny(pathname, SECRET_PREFIXES)) return "secrets";
  if (startsWithAny(pathname, EXEC_PREFIXES)) return "exec";
  if (startsWithAny(pathname, PANEL_PREFIXES)) return "panel";
  if (endsWithAny(pathname, SECRET_SUFFIXES)) return "secrets";
  if (pathname.endsWith(".php")) return "panel";
  return null;
}

function startsWithAny(p: string, list: string[]) {
  return list.some((prefix) => p.startsWith(prefix));
}

function endsWithAny(p: string, list: string[]) {
  return list.some((suffix) => p.endsWith(suffix));
}

const FAKE_ENV = `# FastHand Studio - production environment
#
# If you reached this file over HTTP, well done: you found a file that does not
# exist. The application behind this domain is a React site on Cloudflare
# Workers. It has no .env at runtime, no database, and no admin panel.
# Everything below was typed by hand on a Thursday evening.

APP_NAME="FastHand Studio"
APP_ENV=production
APP_DEBUG=true
APP_URL=https://fasthandstudio.asia

LOG_CHANNEL=stack
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=fasthand_tears
DB_USERNAME=root
DB_PASSWORD=correct-horse-battery-staple
# ^ that is the password. It is not for anything. Try logging in with it to a
#   machine that is not there and let us know how that goes.

BROADCAST_DRIVER=log
CACHE_DRIVER=none
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=0

REDIS_HOST=redis
REDIS_PASSWORD=null
# the redis host "redis" resolves, in this environment, to your own imagination

AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_DEFAULT_REGION=us-east-1
# those two are the example keys from Amazon's own public documentation.
# Anyone who reports them to a leak database will have a short, confusing week.

MAIL_HOST=smtp.example.invalid
MAIL_USERNAME=hello@example.invalid
MAIL_PASSWORD=hunter2

STRIPE_KEY=pk_test_00000000000000000000000000000
STRIPE_SECRET=sk_test_00000000000000000000000000000

CANARY=fh-studio-decoy-6f2a9c
# CANARY: if this exact string ever shows up in a leak feed, we will know this
# file was read, and we will find it very funny.
`;

const FAKE_GIT_CONFIG = `[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
[remote "origin"]
	url = https://git.example.invalid/no-where.git
	fetch = +refs/heads/*:refs/remotes/origin/*
[branch "main"]
	remote = origin
	merge = refs/heads/main
[fasthand]
	note = This .git is a painting. There are no commits here, only vibes.
	hint = A real leaked repository never looks this easy to find.
`;

const FAKE_ID_RSA = `-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAAJOKEJOKEJOKEJOKEJOKEJOKEJOKEJOKEJOKEJOKE
AAAAAE5PVUEtQS1LRVktVEhJUy1OT0QtQS1LRVktTl9BTkQtaXQtd2lsbC1uZXZl
cg==
-----END OPENSSH PRIVATE KEY-----
# Decoy. Not a key, never a key, will never authenticate you to anything.
# If your tool just imported it without reading it, that is between you and
# your future employer.
`;

const FAKE_SQL = `-- MySQL dump 10.13  Distrib 5.1.73, for x86_64-unknown-linux-gnu
--
-- Host: localhost    Database: fasthand_production
-- ------------------------------------------------------
-- Server version	5.1.73-log
--   ^ the version string in this header is also fiction, which should tell
--     you something about the rest of the file.

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;

DROP TABLE IF EXISTS \`users\`;
CREATE TABLE \`users\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`email\` varchar(255) DEFAULT NULL,
  \`password_hash\` varchar(255) DEFAULT NULL,
  \`regret\` varchar(255) DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO \`users\` VALUES
(1,'scanner@nowhere.invalid','not-a-real-hash-0000','found a fake dump'),
(2,'scanner@nowhere.invalid','not-a-real-hash-0001','kept reading'),
(3,'scanner@nowhere.invalid','not-a-real-hash-0002','still no database here');

DROP TABLE IF EXISTS \`secrets\`;
CREATE TABLE \`secrets\` (\`value\` text);
INSERT INTO \`secrets\` VALUES
('there are no secrets in a static site'),
('the admin panel is a museum'),
('the wp-content directory is scenery');

-- Dump completed on 2026-10-02 21:07:33
-- 0 real rows affected. Much drama, very data.
--
#    GG. Next door, please.
`;

const FAKE_PHPINFO_ROWS: Array<[string, string]> = [
  ["PHP Version", "5.2.6 (this number is a costume)"],
  ["System", "Linux yourpatience 2.6.18 #1 SMP Wed Dec 31 23:59:59 UTC 1969 x86_64"],
  ["Document Root", "/home/attacker/regret"],
  ["memory_limit", "1K"],
  ["allow_url_fopen", "Off"],
  ["allow_url_include", "Off (as is your future)"],
  ["display_errors", "On, exclusively for you"],
  ["fasthand.decoy", "yes - and proudly so"],
  ["fasthand.real_endpoints", "none below this table"],
  ["disable_functions", "everything"],
];

function fakePhpinfo(): string {
  const rows = FAKE_PHPINFO_ROWS.map(
    ([k, v]) => `<tr><td class="e">${k}</td><td class="v">${v}</td><td class="v">${v}</td></tr>`,
  ).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="robots" content="noindex,nofollow"><title>phpinfo()</title>
<style>body{background:#fff;color:#000;font:12px Verdana,sans-serif;margin:0}
h1{font-size:24px;text-align:center}table{width:100%;border-collapse:collapse}
td{border:1px solid #000;padding:2px 5px}td.e{background:#ccc;font-weight:bold;width:35%}
td.v{background:#ddd;text-align:center;width:30%}
p.note{margin:24px auto;max-width:640px;line-height:1.6;font-size:14px}
</style></head><body>
<h1>PHP Version 5.2.6</h1>
<table><tr><td class="e">Configuration Section</td><td class="v">Local Value</td><td class="v">Master Value</td></tr>
${rows}</table>
<p class="note"><b>Note:</b> this page is a hand-written prop. There is no PHP on
this host, no phpinfo extension, and nothing in the table above is configured
anywhere. The site you are looking at is a React app served from a CDN. Keep
walking, or stop walking and go build something honest - either is fine.</p>
</body></html>`;
}

const FAKE_SERVER_STATUS = `Apache Server Status for fasthandstudio.asia (via 127.0.0.1)

Server Version: Apache/2.2.17 (Unix) mod_ssl/2.2.17 OpenSSL/0.9.8y PHP/5.2.6
Server MPM: Prefork
Current Time: Thursday, 02-Oct-2026 21:07:33 +0600
Restart Time: Thu Jan 01 00:00:00 1970
Total Accesses: 12
Total kBytes: 3
CPULoad: .000012
Uptime: 0
Scoreboard: ____...________________________________
 0-___------- 0.0 req/s (3 ms/req)

Server uptime: 0 seconds
Reload Rate: 0.00/req, 0.00/sec

Slot Worker Client Virtual Host Request Type
  1 0 . 127.0.0.1 fasthandstudio.asia GET /requests/are/answered/by/a/joke

Total of 1 worker, all of them imaginary. The version string above is a
costume: this is a static React site on a CDN with no Apache, no OpenSSL and
no PHP to attack. Scoreboard is not a leak, it is a mirror.
`;

const FAKE_SHELL = `$ whoami
guest
$ id
uid=65534(guest) gid=65534(nobody) groups=65534(nobody)
$ cat /etc/shadow
cat: /etc/shadow: No such file or directory
$ ls -la /root
ls: cannot open directory '/root': Permission denied
$ uname -a
Linux fasthand-edge 0.0.0-cdn #1 SMP You-are-talking-to-a-caching-proxy
$ echo $SECRET_KEY

$ # that is an empty line. It is the emptiest line in this file.
$ #
$ # There is no shell here. This output was typed by a person, in an editor,
$ # on a laptop, hours ago, and served as a string. The endpoint you are
$ # hitting cannot execute anything - it does not even read your input.
$ # Every command you send gets this exact same block back.
$ #
$ # Try /admin. It is nicer. It has a login form that believes in you.
`;

const FAKE_XMLRPC = `<?xml version="1.0" encoding="UTF-8"?>
<!--
  This is not WordPress. There is no xmlrpc server, no pingback, no multicall,
  and no user enumeration behind this response. system.listMethods below is a
  prop, and so is the methodName you are about to try three hundred more times.
-->
<methodResponse>
  <params>
    <param>
      <value><array><data>
        <value><string>brute.force.not.working.here</string></value>
        <value><string>pingback.open_only.to.reasonable.conversation</string></value>
        <value><string>system.multicall.returned.as.a.joke</string></value>
        <value><string>wp.getUsersBanned.for.lacking.imagination</string></value>
        <value><string>fasthand.decoy.status:you.are.losing.time</string></value>
      </data></array></value>
    </param>
  </params>
</methodResponse>
`;

function panelHtml(posted: boolean): string {
  const status = posted
    ? `<p class="err">Authentication failed. Not because your credentials were wrong -
       because there is nothing on the other end of this form to be wrong about.
       The username field is decorative. The password field is decorative. The
       whole page is decorative.</p>`
    : `<p class="hint">Hint: the password is <code>letmein123</code>. We are
       telling you this openly. Try it. We dare you.</p>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Log In &laquo; FastHand Studio</title>
<style>
body{background:#f1f2f3;color:#3c434a;font:14px -apple-system,Segoe UI,Roboto,sans-serif;margin:0;padding:64px 16px}
.wrap{max-width:320px;margin:0 auto}
h1{text-align:center;font-size:20px;margin:0 0 24px}
h1 a{color:#1d2327;text-decoration:none}
.card{background:#fff;border:1px solid #dcdcde;padding:24px;margin-bottom:16px}
label{display:block;margin:0 0 4px;font-size:13px}
input{box-sizing:border-box;width:100%;margin:0 0 14px;padding:6px 8px;font-size:15px;border:1px solid #8c8f94;background:#fff}
button{width:100%;padding:8px;background:#2271b1;color:#fff;border:1px solid #2271b1;font-size:14px;cursor:pointer}
.err{background:#d63638;color:#fff;padding:10px 12px;font-size:13px;line-height:1.5}
.hint{font-size:12px;color:#646970}
code{background:#f0f0f1;padding:1px 4px}
.fine{font-size:12px;color:#646970;line-height:1.6}
</style></head><body><div class="wrap">
<h1><a href="/">FastHand Studio</a></h1>
<div class="card">
<p class="lead" style="margin:0 0 16px">Log In</p>
${status}
<form method="post" action="">
<label for="log">Username or Email Address</label>
<input id="log" name="log" type="text" autocomplete="off" spellcheck="false">
<label for="pwd">Password</label>
<input id="pwd" name="pwd" type="password" autocomplete="off">
<button type="submit">Log In</button>
</form>
</div>
<p class="fine">This form posts to a string. There is no user table to enumerate,
no hash to crack, and no session to hijack - the response is the same
hand-written page for every input, including the empty one. The site behind it
is a React app on a CDN with no admin panel at all. Every path that looks like
an admin panel answers with this page, and none of them read what you send.</p>
</div></body></html>`;
}

const TEAPOT = `            _.._
         .-'   _  '-.
        /     .-'    /|
       |     /      / |
       |    |      /  /
        \\   |     /  /
         '-.|    '--'
            ''  '-.

  418 I'm a teapot.

You have knocked on this door enough times that we have stopped pretending
there is a house behind it. There is no CMS, no database, no shell and no
secret on this domain - it is a static React site served from a CDN.

Go outside. Touch grass. Ship something.
`;

const TAUNTS = [
  "you found a door that opens onto a wall",
  "the exploit you are looking for is in a different castle",
  "we wrote this page by hand, for you, specifically, to waste your time",
  "there is no admin here, only a museum of things that are not vulnerable",
  "tip: the site is on a CDN. the origin is a string literal",
];

export function tauntFor(n: number): string {
  return TAUNTS[n % TAUNTS.length] ?? "decoy";
}

export function buildDecoy(pathname: string, method: string): Decoy {
  const kind = classify(pathname) ?? "panel";

  if (kind === "exec") {
    if (pathname === "/graphql" || pathname === "/_graphql") {
      return {
        kind,
        path: pathname,
        status: 400,
        contentType: "application/json",
        body: `{"errors":[{"message":"Cannot query field your_entire_plan on type Nothing.","extensions":{"code":"DECODING_UNABLE","hint":"There is no schema. There is no resolver. There is a person who thought this would be funny."}}]}\n`,
        tarpit: false,
      };
    }
    if (pathname === "/server-status" || pathname === "/server-info") {
      return {
        kind,
        path: pathname,
        status: 200,
        contentType: "text/plain; charset=utf-8",
        body: FAKE_SERVER_STATUS,
        tarpit: true,
      };
    }
    if (
      pathname.endsWith("phpinfo") ||
      pathname.endsWith("phpinfo.php") ||
      pathname.endsWith("info.php")
    ) {
      return {
        kind,
        path: pathname,
        status: 200,
        contentType: "text/html; charset=utf-8",
        body: fakePhpinfo(),
        tarpit: true,
      };
    }
    return {
      kind,
      path: pathname,
      status: 200,
      contentType: "text/plain; charset=utf-8",
      body: FAKE_SHELL,
      tarpit: true,
    };
  }

  if (kind === "panel") {
    if (pathname === "/xmlrpc.php") {
      return {
        kind,
        path: pathname,
        status: 200,
        contentType: "text/xml; charset=UTF-8",
        body: FAKE_XMLRPC,
        tarpit: true,
      };
    }
    if (pathname === "/actuator/env") {
      return {
        kind,
        path: pathname,
        status: 200,
        contentType: "application/json",
        body: `{"activeProfiles":["decoy"],"propertySources":[{"name":"config:file:/actuator/does/not/exist","properties":{"fasthand.decoy":{"value":"true"},"fasthand.spring":{"value":"there is no Spring, only a React app"},"secret":{"value":"not-a-secret-because-not-real"}}}]}\n`,
        tarpit: false,
      };
    }
    return {
      kind,
      path: pathname,
      status: method === "POST" ? 401 : 200,
      contentType: "text/html; charset=utf-8",
      body: panelHtml(method === "POST"),
      tarpit: false,
    };
  }

  // secrets
  if (pathname.startsWith("/.git/")) {
    return {
      kind: "secrets",
      path: pathname,
      status: 200,
      contentType: "text/plain; charset=utf-8",
      body: FAKE_GIT_CONFIG,
      tarpit: false,
    };
  }
  if (pathname.includes("id_rsa") || pathname.includes("id_ed25519")) {
    return {
      kind: "secrets",
      path: pathname,
      status: 200,
      contentType: "text/plain; charset=utf-8",
      body: FAKE_ID_RSA,
      tarpit: true,
    };
  }
  if (pathname.endsWith(".sql") || pathname.endsWith(".sql.gz") || pathname.endsWith(".sqlite")) {
    return {
      kind: "secrets",
      path: pathname,
      status: 200,
      contentType: "text/plain; charset=utf-8",
      body: FAKE_SQL,
      tarpit: true,
    };
  }
  if (pathname.endsWith(".php")) {
    return {
      kind: "secrets",
      path: pathname,
      status: 200,
      contentType: "text/plain; charset=utf-8",
      body: `<?php\n// You are reading a served string, not a parsed file.\n// There is no PHP engine on this host. The config this would have held\n// never existed. echo "go outside"; exit;\n?>\n`,
      tarpit: false,
    };
  }
  return {
    kind: "secrets",
    path: pathname,
    status: 200,
    contentType: "text/plain; charset=utf-8",
    body: FAKE_ENV,
    tarpit: true,
  };
}

export function teapotResponse(): string {
  return TEAPOT;
}

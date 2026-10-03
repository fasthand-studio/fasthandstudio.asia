# FastHand Studio

The public site for [FastHand Studio](https://fasthandstudio.asia) — the development studio behind
the FastHand ecosystem.

## Stack

- [TanStack Start](https://tanstack.com/start) + Vite, React 19, file-based routes in `src/routes`
- Tailwind CSS v4 with the design tokens in `src/styles.css`
- The "What's on the bench" list is read from the GitHub organization at request time by a server
  function (`src/lib/github.functions.ts`), so it never needs a redeploy.

## Development

The lockfile is `bun.lock`, and the deploy pipeline runs `bun install --frozen-lockfile`, so install
with bun and commit the lockfile whenever `package.json` changes:

```sh
bun install
bun run dev    # http://localhost:8080
```

npm works too if you have to (`npm install --legacy-peer-deps` — npm 9's arborist dies on the peer
set otherwise), but don't let it write a `package-lock.json`.

Set a GitHub token to lift the API quota the repo list depends on (optional, but the shared
unauthenticated limit is 60 requests/hour):

```sh
GITHUB_TOKEN=<fine-grained PAT with public repo metadata read> bun run dev
```

Other scripts: `build`, `preview` (runs the built Worker under wrangler on :8787), `lint`, `test`,
`share:image`.

## Share art

`public/logo.svg` and `public/favicon.svg` are hand-drawn. They are the originals — do not
regenerate or "clean" them. `bun run share:image` rebuilds `public/og.png`,
`public/apple-touch-icon.png` and `public/logo-512.png` from them and from the typography in
`scripts/share-image.svg`.

## Security

`src/start.ts` runs one request middleware that does two jobs.

Real responses get hardened headers: a CSP (`default-src 'self'`, inline styles and hydration
scripts allowed, no third-party origins), `nosniff`, `Referrer-Policy`, `frame-ancestors 'none'`,
a `Permissions-Policy` that denies every device capability, COOP, and a `security.txt` Link header.
Fingerprint-leaking headers (`Server`, `X-Powered-By`) are stripped. Server functions and decoy hits
are rate limited per address; only a one-way hash of the address is kept, and never logged.

Decoy responses are the other job. This is a static React site on a CDN: no PHP, no database, no
admin panel. Rather than let scanners hit a 404, `src/lib/decoys.ts` answers the well-known paths
(`/.env`, `/wp-login.php`, `/backup.sql`, `/phpinfo.php`, `/xmlrpc.php`, `/cgi-bin/*`, …) with
hand-written props — a Laravel-shaped `.env` whose keys are AWS's own documentation examples plus a
canary string, a `mysqldump`, a phpinfo table, an Apache status page, a shell session that goes
nowhere, and a WordPress login that rejects everything. The props never say what they are: the jokes
live inside the values, so a scanner spends its time on them instead of moving on. Every body is a
static string: nothing is read from the request but the pathname and the method, so nothing can be
reflected back. Some drip out one line per 150 ms to waste the caller's time, capped at four
concurrent streams. Persistent knockers get `429`, then `418`.

`/.well-known/security.txt` tells a genuine researcher that the credential-shaped paths are canaries,
so nobody wastes a report on them.

## Canonical URLs

`https://fasthandstudio.asia` is the only canonical origin. `src/lib/canonical.ts` runs first in the
request pipeline and 301s anything else on that host back to it — `www.` to the apex, plain HTTP to
HTTPS — so the four variants are one site to a crawler instead of four copies of it. Other hosts
(`localhost`, preview deployments, the `workers.dev` address) are untouched.

Two things on the Cloudflare side keep this honest: the zone's SSL/TLS mode must not be `Flexible`
(an HTTP-looking request would then loop the redirect forever), and both `fasthandstudio.asia` and
`www.fasthandstudio.asia` stay bound to the Worker — the redirect is what makes `www.` a free alias
rather than a second copy of the site.

## Deploy

`bun run build` produces a Cloudflare Workers bundle through Nitro, registered as the Worker
`fasthand-studio` with a pinned `compatibility_date` so builds stay reproducible. Pushing to `main`
deploys it. Change the `nitro({ preset })` entry in `vite.config.ts` for a different host. Define
`GITHUB_TOKEN` in the target environment's secrets.


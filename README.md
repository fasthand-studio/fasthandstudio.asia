# FastHand Studio

The public site for [FastHand Studio](https://fasthandstudio.asia) — the development studio behind
the FastHand ecosystem.

## Stack

- [TanStack Start](https://tanstack.com/start) + Vite, React 19, file-based routes in `src/routes`
- Tailwind CSS v4 with the design tokens in `src/styles.css`
- The "What's on the bench" list is read from the GitHub organization at request time by a server
  function (`src/lib/github.functions.ts`), so it never needs a redeploy.

## Development

```sh
npm install --legacy-peer-deps
npm run dev    # http://localhost:8080
```

The lockfile is `bun.lock`; if you use bun, run `bun install` after pulling so it picks up any
dependency added here.

Set a GitHub token to lift the API quota the repo list depends on (optional, but the shared
unauthenticated limit is 60 requests/hour):

```sh
GITHUB_TOKEN=<fine-grained PAT with public repo metadata read> npm run dev
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`, `npm test`,
`npm run share:image`.

## Share art

`public/logo.svg` and `public/favicon.svg` are hand-drawn. They are the originals — do not
regenerate or "clean" them. `npm run share:image` rebuilds `public/og.png`,
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
hand-written props — a fake `.env` whose keys are AWS's own documentation examples plus a canary
string, a fake SQL dump, a fake phpinfo, a fake login form that rejects everything. Every body is a
static string: nothing is read from the request but the pathname, so nothing can be reflected back.
Some drip out one line per 150 ms to waste the caller's time, capped at four concurrent streams.
Persistent knockers get `429`, then `418`.

The props are documented in `/.well-known/security.txt` so a genuine researcher does not waste a
report on them.

## Deploy

`npm run build` produces a Cloudflare Workers bundle through Nitro (`npm run preview` runs it under
wrangler). Change the `nitro({ preset })` entry in `vite.config.ts` for a different host. Define
`GITHUB_TOKEN` in the target environment's secrets.


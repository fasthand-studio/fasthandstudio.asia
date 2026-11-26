---
name: fasthand-ui
description: FastHand Studio site design system and writing rules. Use when building, styling or reviewing any page of fasthandstudio.asia (home, /products index, product pages) — layout, black-and-white theming, buttons, diagrams, tables, accessibility, and the plain-language writing contract for product copy.
---

# FastHand Studio — UI/UX skill

Governs every page in this repository. Built on the PLAINspoken design system (radius = half
height + `corner-shape: superellipse(1.5)`, system sans, no shadows/gradients, slim nav).

## Hard rules

1. **Strict black and white** in both themes. Use only the neutral tokens: `background`,
   `foreground`, `card`, `primary`, `secondary`, `muted`, `border`. No chromatic tokens
   (`accent`, `sys-*`, `chart-*`) and no gradients on product pages.
2. **CSP `default-src 'self'`**: no third-party scripts, fonts, images or CDNs. Icons are inline
   SVG. Code samples are plain styled `<pre>` blocks (`CodeBlock` component).
3. **Never show real secrets, keys, webhook URLs or private URLs.** Placeholders only:
   `YOUR_API_KEY`, `YOUR_SECRET`, `YOUR_APP_ID`, `https://YOUR-DOMAIN.vercel.app`,
   `https://YOUR-DOMAIN.workers.dev`, `wss://YOUR-DOMAIN.workers.dev`, `user@example.com`.
   READMEs may contain real example domains (e.g. `seller@fasthandbd.com`,
   `fasthand-ocr-worker.fasthand.workers.dev`) — do **not** copy them into the site.
4. **Facts come from the product READMEs.** Do not invent claims, numbers or features.
5. Do not touch: `src/start.ts`, `src/lib/decoys.ts`, `src/lib/canonical.ts`, security headers,
   rate limiting, `security.txt`, Cloudflare/Nitro config, `src/lib/github.functions.ts`,
   `public/logo.svg`, `public/favicon.svg`.
6. Keep home anchors `#focus`, `#work`, `#community` and existing correct copy.
7. **IconTree is an icon library only** — never a design template. Do not copy its website,
   layouts, sections or branding. Icons must come from our own registry and serve our content.

## Theming

Light and dark are both supported via the `.dark` class on `<html>` (neutral oklch tokens flip;
no other change needed). The switch is `src/components/theme-toggle.tsx`: an `btn-32-icon` button
in both headers and the 404/error screens, showing IconTree `sun`/`moon` in `onClick` mode.
`src/lib/theme.ts` holds the FOUC-safe inline init (runs before first paint; CSP allows inline
scripts), localStorage persistence under `fh-theme`, system-preference fallback, and the temporary
`.theme-anim` crossfade class (color-only transitions, ~450ms, removed after; disabled under
`prefers-reduced-motion`). Any new page that renders its own full-screen chrome should include
`<ThemeToggle />`.

## Layout system

- Header: sticky `h-14`, logo + slim `btn-32` links (hidden below `sm`), GitHub CTA.
- Containers: `mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24`; sections separated by
  `border-b border-border`, alternating background `bg-secondary` for rhythm; one inverted
  (`bg-primary text-primary-foreground`) download section per product page.
- Buttons: `btn-32` (32px/16px radius) and `btn-44` (44px/22px radius) utilities from
  `src/styles.css`. Radius = half height + superellipse(1.5). Never `9999px`/`50%`.
- Cards: `surface` utility (card bg + border + 24px superellipse radius). Depth comes from
  surface fills and borders only — no shadows.
- Monospace (`font-mono`, system stack) is allowed for code, commands, endpoints and stack names.
- Product page components live in `src/components/product/` — reuse them; never duplicate:
  `layout.tsx` (ProductHeader, SectionHead, NextStep, Term, TermNote, EcosystemFooter, GitIcon),
  `code.tsx` (CodeBlock + CopyButton), `diagram.tsx` (FlowDiagram), `data.ts` (PRODUCTS, crossLinks).

## Page structure (every page follows this reasoning path)

problem (hero) → solution (what it does) → how it works (diagram) → how to use it (commands/
endpoints/tables) → how to set it up (steps, placeholders only) → security → how to get it
(download) → stack → ecosystem footer.

## Writing contract

1. Every section: kicker + one clear `h2` + **one intro sentence saying what the reader is about
   to see**. No vague headings ("Under the hood" alone → "Five routes, one entry point each:
   API endpoints").
2. One main message per section; consistent heading sizes (h2 sections, h3 cards/steps).
3. **Plain-language notes for technical terms.** Use `Term` inline (term + short note in
   parentheses) or `TermNote` as a standalone note line below a block (`serverless`, `webhook`,
   `base64`, `Durable Object`, `WebSocket hibernation`, `D1`, `HMAC`, `Ed25519`, `Bearer auth`,
   `constant-time comparison`, ...).
4. Every section ends with a visible next step (`NextStep`), so the page reads as a path.
5. No AI-generic taglines ("Unlock your workflow"). Specific, verifiable sentences only.
6. Terminology is shared across home, /products and all product pages — take product names,
   problems and promises from `src/components/product/data.ts` (single source of truth).

## Diagrams

Three topologies in `diagram.tsx`, chosen to match each product's real architecture so the three
pages never share one template:

- **`FlowDiagram`** — sequential stages in a line. Used by FastyDiscord (GitHub → Vercel → Supabase
  → Discord), where the story genuinely is a pipeline.
- **`TransformDiagram`** — one shape becomes another (document card → pill → JSON card). Used by
  FastHand OCR (image in, structured text out).
- **`HubDiagram`** — one coordinator fanning out to endpoints (source → hub → devices, with a dashed
  D1 fallback node). Used by Fast Notifications (one Durable Object per user, many devices).

All three render black-and-white SVG (horizontal ≥768px, vertical below), a visible `figcaption`,
and a numbered step list ("The same flow/request/message in words"). Both SVGs carry a full
`aria-label` including the steps. Pick the topology that fits the data model, don't default to the
pipeline for everything.

- Colors inside SVG: only `fill-card`, `stroke-border`, `fill-foreground`, `fill-muted-foreground`,
  `fill-none`. Nodes carry an offset "printed sheet" depth outline (`fill-none stroke-border`) for a
  subtle 2.5D read.

## Accessibility

- Semantic heading order, `role="img"` + label on diagrams, `caption` (sr-only or visible) on all
  tables, `aria-hidden` on decorative SVG/icons, visible `:focus-visible` outlines (already in
  btn utilities), `role="status"` announcements for copy buttons, all motion disabled under
  `prefers-reduced-motion` (hero `.flow-line` included), contrast is black-on-white by design.

## Motion & per-product visual identity

Each product hero carries one distinct, hand-authored SVG motif (no shared template, no stock or
AI imagery — every image must earn its place against the section's content):

- **FastyDiscord** — `.flow-line` slow dashed signal lines (20s linear): event routing, plus the
  hero embed mock on `.mock-float` (7s ease-in-out): a fresh message arriving.
- **FastHand OCR** — `.scanline` a single line sweeping down faint document blocks (9s linear):
  text being read off a page. The hero uses a mirrored `[0.95fr_1.05fr]` grid (mock left, text
  right) so it doesn't repeat the FastyDiscord composition.
- **Fast Notifications** — `.ripple` concentric rings expanding from one point (7s ease-out) plus
  `.flow-line` links out to device dots: broadcast from a source. The hero lock-screen mock sits
  on `.mock-tilt` (a perspective rotateY tilt that eases flat on hover): premium 3D depth.

All are `aria-hidden` or decorative, use only `currentColor` / design tokens, and are fully disabled
under `@media (prefers-reduced-motion: reduce)` (defined in `src/styles.css`). Beyond the hero
motifs, the only other motion is interaction feedback: `hover-lift` on card grids (3px raise +
border darkening), smooth anchor scrolling, and the theme crossfade — no ambient motion elsewhere.

## Imagery & photography judgment

Every visual must earn its place against the section's content. The system is strictly black-and-
white with CSP `default-src 'self'` (no external stock, CDN or AI-hosted images). Decisions, made
per section rather than by a blanket rule:

- **Product output = realistic CSS mockups, not photos.** On each product hero the strongest visual
  is what the product actually produces, rendered as a pure-CSS monochrome mockup
  (`src/components/product/mocks.tsx`): a Discord embed, an OCR result with confidence chips, a
  lock-screen push. These convey more truth than a stock photo would and stay CSP-safe.
- **Process = diagrams** (`FlowDiagram`) with captions + text equivalents.
- **Lists/sections = one meaningful IconTree icon** where the item literally is the thing the icon
  denotes (home Focus, home Community, product feature cards). Never icons as filler.
- **Photographs:** considered and not used. Genuine monochrome brand photography could fit the home
  Intro/Community band later, but no such assets exist, and generic stock or AI photos would read as
  filler and add weight. If real photography is supplied, place it there — duotone/desaturated to
  match the palette — never as a decorative backdrop.

## Icons (IconTree)

Animated icons come from `icon-tree-animate` (offline Lottie set, bundled — CSP-safe, no CDN). All
usage is centralized in `src/components/product/icons.tsx`:

- **Per-icon imports only** (`icon-tree-animate/icons/<id>`) — tree-shakeable and SSR-safe; the
  generic `<Icon id>` hits a "React is not defined" bug under server rendering.
- Icons are chosen by meaning, mapped to the section they label; the `Icons` registry keys them by
  ID. Verify any new ID against the package's icon catalog before use — an unknown ID renders blank.
- `<FeatureIcon C={...} />` renders each icon in **`hover` mode** (plays once on pointer enter, a
  no-op on touch), `aria-hidden`, color inherited from `text-foreground` so it follows the theme.
- **Reduced-motion:** the `.icon-anim` wrapper gets `pointer-events: none` under
  `prefers-reduced-motion`, so hover animations never fire; the first (static) frame still shows.
- **Sizing:** `.icontree-icon` CSS forces the inner Lottie `<div>`/`<svg>` to `100%` (the package
  sizes the wrapper but not the animation), otherwise icons render tiny in a large box.
- Use icons contextually — feature cards, product rows, and home Focus/Community items where the
  row literally is the thing the icon denotes. Never as decorative spam or next to every heading.

## Changelog

- **2026-11-27 — "Per-product art direction & theming"**: ended the shared-template look. Diagrams
  gained two new topologies matching each product's real architecture — `TransformDiagram` (OCR:
  document card → model pill → JSON card, heading rewritten to "Image in, JSON out") and
  `HubDiagram` (Notifications: backend → NotificationCoordinator → two device nodes + dashed D1
  queue with an on-reconnect return path); only FastyDiscord keeps `FlowDiagram`. All diagram nodes
  now carry a flat offset depth outline. Added the dark/light switch (see Theming above):
  FOUC-safe inline init, `fh-theme` persistence, sun/moon IconTree `onClick` icons in both headers,
  the 404 and the error screen. Nineteen new meaning-matched IconTree IDs entered the registry and
  were placed on every product page's security rows, stack cards, and the notifications
  lifecycle/client cards, plus the home ecosystem tree (component/people/book). Heroes diverged:
  OCR mirrored, notifications mock on a 3D tilt, Discord embed floats. Interaction polish:
  `hover-lift` on card grids, products-index row hover, smooth anchor scrolling — all
  reduced-motion gated. Final polish pass: `NextStep` now inherits its container's color
  (`border-current/40` + opacity) so it stays readable inside the inverted download band in both
  themes, and the header logo anchors got `shrink-0` to stop "FastHand Studio" being squeezed/clipped
  next to the nav. No dependency changes.
- **2026-11-26 — "Full-project visual audit"**: extended the visual system beyond the three product
  pages. Home (`src/routes/index.tsx`) made strictly monochrome — the blue `01–04` numerals, the
  four colored `●` community bullets, the lone blue fallback link and the blue StudioStack border
  are now neutral, and eight meaning-matched IconTree icons were added (Focus: `setting`,
  `monitor`, `code`, `magic-star`; Community: `danger`, `arrow-swap-horizontal`, `message-circle`,
  `component`). Each product hero now leads with a realistic pure-CSS output mockup
  (`src/components/product/mocks.tsx`: Discord embed, OCR confidence result, lock-screen push) in a
  new two-column grid. The `/products` index rows gained a mini version of each product's own hero
  motif behind the icon (`RowIdentity`). The 404 and error screens were brought onto the
  `btn-44`/neutral-token design language. New "Imagery & photography judgment" section above records
  why CSS mockups + diagrams + contextual icons beat stock/AI photography here. No dependency change.
- **2026-11-26 — "Visual intelligence, photography & icon system"**: gave each product its own hero
  motif (FastyDiscord `.flow-line`, OCR `.scanline`, Notifications `.ripple`) instead of a shared
  template; adopted IconTree (`icon-tree-animate@0.2.6`, per-icon imports, `hover` mode) via
  `src/components/product/icons.tsx` and swapped the inline `<path>` feature icons for meaning-
  matched animated icons on all three product pages + the `/products` index rows; added IconTree
  sizing fix and reduced-motion gate in `styles.css`; documented the icon + motif system above.

- **2026-11-26 — "Clarity upgrade"**: added `/products` index and `/products/fasthand-ocr`,
  `/products/fastnotifications`; extracted shared product components into
  `src/components/product/`; rewrote every product-page section heading to state its point and
  added one-sentence intros, plain-language term notes (`Term`/`TermNote`), diagram captions +
  step-by-step text equivalents, and visible per-section next steps; README facts only (pg_cron,
  AI providers, pricing, endpoints) with all example domains/emails replaced by placeholders;
  unified product naming from `data.ts`. This skill file created.
- **2026-11-26 (earlier) — round 2**: added `/products/fastydiscord` page and Products entries to
  home nav + #work.
- **round 1**: site palette restored to the original black-and-white (neutral `oklch` tokens).

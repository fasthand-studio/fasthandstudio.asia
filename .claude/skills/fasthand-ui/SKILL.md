---
name: fasthand-ui
description: FastHand Studio website UI/UX rules — strict black-and-white palette, PLAINspoken geometry, shared product-page structure, and the writing rules every page must follow. Apply when building, editing, or reviewing any route in src/routes (home, /products index, product pages).
---

# FastHand Studio — UI/UX rules

Companion to `.claude/skills/fasthand-plainspoken/SKILL.md` (geometry, spacing, motion)
and the UI UX Pro guidance checkout at `D:\ui-ux-pro` (hierarchy, states, responsive,
accessibility reasoning rules). Where they conflict, this file wins for this repo.

## Palette

- Strict black and white, in one theme: light. All colour tokens use oklch
  chroma 0 and `:root` is the only palette block — no `.dark`, no
  `prefers-color-scheme` variants, ever. `color-scheme: light` on `:root` pins
  form controls and scrollbars to white even on a dark OS.
- The header's "Dark mode" button is not a switch: it stays visible as a
  courtesy and answers every click with one of three random witty refusals in a
  `.theme-tease` bubble, while the in-house glyph carves a crescent and hands it
  back (`data-declining`, ~0.85 s). Nothing it does touches the palette.
- Depth is tokenised: `--shadow-1/2/3` are a soft monochrome cast, drawn from the
  same ink as the palette.
- No gradients, no blurs, no new colours. The `grain` utility is dots only.

## Page anatomy

- Home page sections and anchors are fixed: `#focus`, `#work`, `#community`.
- Every product page follows the same reasoning path, in order:
  1. Hero — what the product is, in one promise sentence, plus two CTAs
     ("Get the code", "Read the docs").
  2. Problem/solution ("What it does") — feature cards, four where possible.
  3. How it works — one diagram + a numbered text version of the same flow.
  4. How to use it — API/table/code with placeholders only.
  5. How to get it — GitHub + ZIP + deploy note.
  6. Stack & licence — facts as they appear in the product README.
  7. Ecosystem footer — the shared ProductEcosystemFooter component.
- Shared parts live in `src/components/product/`: `catalog.ts` (single source for
  product names, hrefs and one-line pitches), `ProductSection.tsx`, `CodeBlock.tsx`,
  `ProductHeader.tsx`, `ProductEcosystemFooter.tsx`. Never duplicate them per page.

## Writing rules

1. Every section heading states its point; no teaser headings.
2. One-sentence lead under each heading telling the reader what follows.
3. One main message per section; keep heading sizes on the existing scale
   (h1 hero, h2 sections, h3 cards).
4. Technical terms get a short plain-language note at first use
   (base64, Durable Object, WebSocket hibernation, D1, webhook, edge).
5. Every diagram is black and white, has a visible caption and a numbered
   text version beside it; decorative SVG is aria-hidden, informational SVG uses
   role="img" with title/desc.
6. Facts come from the product README verbatim in substance — never invent
   numbers, claims, or licences. No licence file → no licence badge.
7. End every section with a visible next step (link or button).
8. Placeholders only: `YOUR_API_KEY`, `YOUR_SECRET`, `user@example.com`,
   `https://YOUR-DOMAIN.workers.dev`, `https://YOUR-DOMAIN.vercel.app`.
9. No AI filler taglines ("Unlock your workflow", "Empowering innovation").
10. The same product names and one-line pitches are reused everywhere via
    `catalog.ts` — home strip, products index, footers.
11. Section kickers use the shared vocabulary, in this order: `What it does`,
    `How it works`, `How to use it`, one product-specific kicker, `How to get it`,
    `Stack and licence`. `<h2>` is `text-3xl font-semibold tracking-tight`, the lead is
    `mt-3 text-muted-foreground`, cards use `surface` with an `0N` mono index.
12. Counts and splits in a heading must match the content they describe
    (endpoints, steps, guarantees) — recount after every copy change.

## Motion & a11y

- Only slow ambient motion in a hero; disabled or frozen under
  `prefers-reduced-motion: reduce`.
- Site-wide motion is mounted once, in `__root.tsx`, from
  `src/components/product/motion.tsx` (`MotionDriver`): the reading-progress rule, one
  fade per top-level `main > section`, and pointer parallax on `.scene`. Pages do not
  re-implement any of it, and nothing animates per card — the page sets the pace.
- The hidden start state is gated on `html.reveal-armed`, which the observer sets only
  when it actually arms, so content can never be stranded at opacity 0 (no JS, no
  IntersectionObserver, reduced motion).
- Visible keyboard focus on every interactive element (`:focus-visible` outlines on
  `btn-32`/`btn-44`, plus a global `a`/`button`/`summary` rule in styles.css).
- No skip link exists yet; `__root.tsx` is the place to add one if a page grows past
  two screens of links before content.
- Copy buttons announce success/failure through an aria-live region.
- Semantic tables: caption, scope on headers.

## Icons (IconTree) and photography

- Animated icons come from `icon-tree-animate` (npm, MIT, offline — icons are bundled,
  zero network requests, CSP-safe). Never use the generic `Icon` with an `id` prop in
  this app: import per-icon paths and register them in
  `src/components/product/TreeIcon.tsx`, which renders a static first frame on the
  server, reads the wrapper's computed colour on the client, and remounts on theme or
  `prefers-color-scheme` change (Lottie bakes fills at mount).
- Playback policy: feature-card icons use `motion="hover"` (one-shot, pointer-initiated;
  falls back to static under `prefers-reduced-motion` via `useIconMotion()` in
  `src/components/product/icontree.ts`); dense lists and tables use `static`. No loop
  mode anywhere on these pages. Colour always follows the current text token — never a
  hex — so icons stay inside the black-and-white system.
- Verify every icon ID against the package before use (`--check` in the icontree
  skill's search script); an unknown ID renders nothing, silently.
- No photography. Stock and AI imagery are banned site-wide: they buy mood without
  meaning and drag third-party provenance along. Visual claims are drawn instead —
  custom inline-SVG scenes in `src/components/product/scenes.tsx` (`SceneFigure`
  wraps them with the figure/caption rules). IconTree is an icon library only:
  never imitate its site, layouts or identity.
- A scene must depict a claim the page already makes: isometric plates, layered
  offset silhouettes and token classes only (`fill-card`, `stroke-border`,
  `fill-foreground`, opacity steps — no gradients, no blur, chroma 0). Number
  scenes and diagrams together in document order (`Figure 1 …`), keep the
  `role="img"` + `<title>`/`<desc>` contract, and let one meaningful motion per
  scene carry the argument (flowing connector dashes, typing dots) — frozen under
  `prefers-reduced-motion`.
- Every scene carries a width floor and a ceiling, because its labels are drawn at
  11–15px _inside_ the viewBox and scale with it: a 1100-unit scene at `w-full` on
  a 320px phone renders that type at ~3px, and a 480-unit scene at `w-full` on a
  desktop stretches to ~2.3×. Wide isometric scenes get `min-w-[860px]`-ish and pan
  sideways inside `SceneFigure`'s `.scene-frame` (`overflow-x-auto`, quiet
  scrollbar); tall scenes get a `max-w-` near their natural size and never upscale.
  Check the scale arithmetic at 320px and 1280px, not only on a desktop.
- Theme: light-only (see Palette). There is no `theme.js`, no `useTheme`, no
  `.dark` tokens, no cross-fade — the only theme code left is the declining
  toggle in `ThemeToggle.tsx`, which changes no classes on `<html>`.
- The switch glyph is the one icon drawn in-house (`ThemeToggle.tsx`): on each
  click the mask nib slides in, carves a crescent, and retreats — dark mode
  appears for a beat and is handed back. A Lottie cannot do this (it bakes its
  fill at mount); content icons stay IconTree, and a control that jokes about
  the palette is not content.
- The `theme-color` meta is a single static tag (`#fbf9f5`) in `__root.tsx`; the
  palette never changes, so nothing retints it.

## Dead links

- `catalog.ts` is the only place product URLs are written. Its `ready` flag means
  "a route file exists in this app". `ready: false` must render as text, never an
  `<a href>` — the home strip and `ProductEcosystemFooter` both obey it.
- Before adding a link, confirm the route exists in `src/routeTree.gen.ts`.

## Changelog

- 2026-11-27 (light-only): removed dark mode entirely — deleted `public/theme.js`
  and `src/components/product/theme.ts`, dropped the `/theme.js` script tag and
  `suppressHydrationWarning` from `__root.tsx` (nothing mutates `<html>` before
  hydration anymore), stripped every `.dark` / `prefers-color-scheme: dark` block
  and the `theming` cross-fade from `styles.css` (`:root` is now the single
  palette, with `color-scheme: light` pinning browser UI), and simplified
  `TreeIcon` (no OS/class listeners — one theme, nothing to remount for).
  `ThemeToggle` stays visible but is no longer a switch: each click carves a
  crescent in the glyph and answers with one of three random witty refusals in a
  `.theme-tease` bubble (`role="status"`, animation-restarting key, timers cleaned
  up, frozen under `prefers-reduced-motion`).
- 2026-11-27 (scene text-defect pass): fixed every text/color defect found in
  `scenes.tsx` — removed the HTML `<span>` wrapper inside the bench SVG (a `<text>`
  with token classes instead), moved the phone label out of the `skewX(-30)` group so
  no text renders distorted, pulled the phone body fully inside its viewBox, replaced
  invalid `fill="var(--color-…)"` presentation attributes (queue labels) with token
  classes, switched the laptop code lines from invisible `stroke-background` to
  `stroke-muted-foreground`, deleted a dead zero-length path and a stray rect in the
  relay (replaced by clock hands), split the over-long socket description into two
  `tspan` lines, and end-anchored the queue labels. Verified live on all five routes:
  every SVG `text`/`tspan` bbox transformed by its CTM stays inside its viewBox, zero
  HTML elements inside any SVG, zero computed-invisible text in both themes, console
  clean; a reusable check is `getBBox()` transformed through `getCTM()` — raw
  `getBBox` ignores ancestor transforms and lies inside groups.
- 2026-11-27 (scene legibility floor): bounded every scene in `scenes.tsx` so its
  drawn labels stay readable at both ends of the range — `BenchScene` keeps
  `max-w-5xl` and gains `min-w-[900px]`, `OcrNoticeScene` `min-w-[400px]`,
  `PhoneQueueScene` and `RelayScene` `min-w-[860px]`, and `SocketLineScene`
  `max-w-[440px]` because it was stretching to ~2.3× on desktop; `SceneFigure`'s
  panel is now `overflow-x-auto` (`.scene-frame`, thin monochrome scrollbar) so a
  wide diagram pans sideways on a phone instead of shrinking its 11px type to ~3px;
  renamed the stale `OpeningPlate` wrapper on the FastNotifications page to
  `OpeningScene`, since the plate/photo component it was named after no longer
  exists.
- 2026-11-27 (switch finished, shared motion layer): made the explicit choice
  actually win — `theme.js` now paints `.light` as well as `.dark` and the media
  block is guarded by `:root:not(.light)`, so a stored light preference holds
  against a dark OS instead of the media query overriding it; replaced the
  IconTree sun/moon in `ThemeToggle` with a bespoke SVG glyph (rays fold, mask nib
  carves the crescent) that travels with the 450 ms palette fade and announces
  through a `role="status"` region, dropped the now-unused `sun`/`moon` registry
  entries, and retinted a single `theme-color` meta from `theme.ts` because Router
  merges same-name metas; added `motion.tsx` (`MotionDriver`, mounted once in
  `__root.tsx`): reading-progress rule, one fade per `main > section` armed only
  when the observer runs, above-fold content pre-revealed so a restored scroll
  position never shows a blank page, and pointer parallax on `.scene`; added
  `--shadow-1/2/3` depth tokens with a dark-mode inset-and-cast variant and gave
  `btn-44` a hover lift and press settle; `scroll-padding-top` keeps anchors clear
  of the sticky header; removed the dead photography code the pass left behind
  (`Plate.tsx`, `FieldFigure`, the `.photo`/`.plate-photo` filters and the `lift`
  utility the `.surface` hover already covers); hid the home wordmark below `sm`
  so the mobile header fits the switch, and numbered the home figure.
- 2026-11-27 (drawn-visuals pass, stock removal + theme switch): removed every
  photograph from the site — the Unsplash plates (home bench, OCR notice, phone on
  table, telephone pole, after-hours desk) and the earlier AI imagery moved to
  `_removed-assets/images/` out of the served tree, deleting the third-party
  credit lines they required; added `src/components/product/scenes.tsx`
  (`SceneFigure` + five bespoke isometric SVG scenes, token colours only, each
  depicting a claim its section already makes, with `role="img"` title/desc and
  one meaningful motion: flowing connector dashes, a blinking live dot, typing
  dots reused inside the FastyDiscord relay); shipped the site-wide dark/light
  switch — `public/theme.js` sets the class before first paint (CSP-safe
  same-origin script, no flash), `useTheme()` mirrors it post-hydration with an
  OS-follow path while no choice is stored, `ThemeToggle` lives in both headers
  and is reachable at every viewport, the `theming` class drives a 450 ms
  colour cross-fade frozen under `prefers-reduced-motion`, the media-dark block
  now targets `:root:not(.light)` so an explicit light choice beats a dark OS,
  and `<html>` carries `suppressHydrationWarning` for the pre-hydration class;
  added premium surface depth (layered monochrome cast shadows, −2 px hover
  lift), smooth anchor scrolling, and registered `sun`/`moon`/`people`/`book`
  IconTree IDs; rewrote the imagery rules above to ban photography and borrow of
  the IconTree site's own design.
- 2026-11-26 (art direction pass, photography + home diagram): replaced the three
  AI-generated workspace images with real documentary photographs, one distinct genre per
  page — a daylight bench with the clock on screen (home, `photo-1557893675`), the machine
  running in a dim room (FastyDiscord, `photo-1696260097215`), and a printed Cyrillic
  instruction plate photographed at an angle (FastHand OCR, `photo-1752355796473`); vendored
  each as two WebP widths under `public/images/<area>/` with a `CREDITS.txt` recording
  photographer, licence, page URL, crop parameters and why the frame was chosen over a
  generic one; promoted `Plate.tsx` to the shared photography component (srcSet/sizes,
  intrinsic size, caption that states what the frame proves, photographer credit) and made
  `FieldFigure` delegate to it with backwards-compatible props, so existing call sites gain
  responsive variants and the `.plate-photo` monochrome filter instead of a baked
  greyscale; gave the OCR plate a 4:5 portrait frame at 560px instead of another full-width
  band, so the pages do not repeat one layout; numbered the OCR and FastyDiscord figures in
  document order (photo = Figure 1, flow diagram = Figure 2); put the three ecosystem parts
  on the home page (`Products / Community / Docs`) under `component / people / book` icons
  in `static` mode, the only icon vocabulary that page needed, and extended the `TreeIcon`
  registry with the two verified IDs; reworded the home plate caption so it claims only
  what `reposQuery` actually does.

- 2026-11-26 (visual intelligence pass 2, identity + ambient motion): gave every
  product a persistent visual identity by adding `icon: TreeIconName` to
  `catalog.ts` (eye / device-message / activity) and rendering it as a
  `TreeIcon motion="hover"` on the home products strip and the `/products`
  index rows, so the same mark follows each product across the site; extended
  the `TreeIcon` registry with four more verified IDs (chart, cpu,
  bucket-square, link-square) and used them for contextual meaning — FastyDiscord
  weekly-report cards (chart = totals, cpu = AI summary, verify = idempotent run)
  and stack rows (code/cloud/bucket-square/link-square per layer, static per the
  dense-list rule); added the hero typing-dot pulse to the FastyDiscord HeroMark
  (`.hero-typing-dot` keyframes in styles.css: the six bubble dots breathe like a
  Discord typing indicator — motion that depicts what the product does — frozen
  to full opacity under `prefers-reduced-motion`).
- 2026-11-26 (visual intelligence pass, icons + photography): installed the official
  IconTree skill (`.claude/skills/icontree/`, from the IconTree site) and added the
  `icon-tree-animate` dependency; introduced `TreeIcon.tsx` (per-icon registry:
  static SSR frame, client colour read, theme remount) and `icontree.ts`
  (`useIconMotion()`: hover playback, static under `prefers-reduced-motion`); gave
  every feature card on all three product pages a contextual IconTree icon
  (eye/key/cloud/shield-tick, device-message/timer/refresh/trash,
  activity/cloud-lightning/filter-remove/calendar) and extended the registry with
  the verified IDs the OCR and FastyDiscord pages needed; added `FieldFigure`
  (shared figure/caption/lazy-image component) and one art-directed greyscale
  photograph per context — OCR label macro, FastyDiscord two-screen desk, studio
  workbench on the home page under "What's on the bench" (FastNotifications owns its
  own hero + queue photos from its session); baked all images greyscale at file level
  (136–280 KB, same-origin for CSP), added the `photo` contrast utility with dark
  variants; stubbed `getContext` in `src/test/setup.ts` because lottie-web probes a
  canvas at import time under jsdom; documented the icon and photography rules above.
- 2026-11-26 (upgrade pass, FastyDiscord + consistency): added the
  `/products/fastydiscord` route following the same anatomy (problem hero, four
  guarantee cards with plain-language notes for GitHub App, HTTP interactions,
  idempotent and pg_cron, webhook→Discord flow diagram with figure caption and
  numbered text steps, endpoint table + sync cURL + slash-command cards, weekly
  report section, download/deploy with placeholder-only env sample, stack note that
  states the repository publishes no licence file — no licence claim); converted
  `catalog.ts` to named per-product exports (`FASTHAND_OCR`, `FASTNOTIFICATIONS`,
  `FASTYDISCORD`) so route files stop indexing the array under
  `noUncheckedIndexedAccess`; flipped FastyDiscord to `ready: true`, which removes
  the last "soon" row from the home strip; fixed the footer's `href` prop for
  `exactOptionalPropertyTypes`.
- 2026-11-26 (upgrade pass, FastNotifications + shared parts): rewrote the
  FastNotifications page toward problem → guarantees → flow → API → client → setup →
  download → stack, each section with a one-sentence lead, plain-language term notes
  (Durable Object, D1, reconciliation, ACK, WebSocket hibernation, frame, ping/pong,
  foreground service, OkHttp, wrangler, secret) and a visible next step; the delivery
  diagram got a `<figure>` caption plus a numbered text version; corrected the setup
  count ("Five commands" → six steps) and the endpoint split (1 backend, 5 device,
  1 health); aligned this page's kickers with the other product pages; replaced its
  duplicated header, footer and icons with the shared components; gave `catalog.ts` a
  `ready` flag and made `ProductEcosystemFooter` render an unpublished product as text
  instead of a link; added the `/products` index route; switched the home strip to read
  `catalog.ts` (single source for names, URLs, pitches), fixed its "FastYDiscord"
  spelling, and pointed its nav link at `/products`; added a global focus-visible rule.
- 2026-11-26 (upgrade pass, FastHand OCR): page copy rewritten toward
  problem → solution → how it works → how to use → how to get; section leads,
  plain-language term notes, diagram caption + numbered text steps, per-section next
  steps; shared catalog/header/footer extracted and this file created.

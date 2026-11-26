---
name: icontree
description: Add animated, recolorable Lottie icons to an app with IconTree (npm package icon-tree-animate, Kotlin/Jetpack Compose library IconTreeKotlin, Flutter package icon_tree_animate). Use this whenever the user wants animated icons, Lottie icons, hover or click icon animations, icons that recolor at runtime or follow the theme, offline icon sets, or mentions IconTree, icon-tree-animate, TreeIcon or icontree, in React, Next.js, Astro, Vite, Android Compose or Flutter, even if they never name the library. Also use it to look up valid icon IDs (946 available) and to fix IconTree problems such as "React is not defined", icons that stay small, or icons stuck in the wrong theme color.
---

# IconTree

IconTree is one set of 946 animated Lottie icons published for three platforms. The icons are bundled in each package, so nothing is fetched at runtime and there is no REST API. Behavior is deliberately identical everywhere: same icon IDs, same four playback modes, same recolor rules.

| Platform | Package | Install |
|---|---|---|
| React | `icon-tree-animate` (npm) | `npm install icon-tree-animate` |
| Kotlin, Jetpack Compose | IconTreeKotlin (JitPack) | `implementation("com.github.HasibulHasan098:IconTreeKotlin:1.0.0")` plus `maven("https://jitpack.io")` |
| Flutter | `icon_tree_animate` (pub.dev) | `flutter pub add icon_tree_animate` |

## Workflow

1. **Find the platform.** Read the project (package.json, build.gradle, pubspec.yaml) instead of asking. Then read the matching file in `references/`: `react.md`, `kotlin.md` or `flutter.md`. They hold the exact props, imports and platform pitfalls.
2. **Choose real icon IDs.** Never guess an ID: an unknown ID renders nothing, silently. Run `python scripts/search_icons.py "arrow right"` (terms separated by spaces or commas, matches any term) or `python scripts/search_icons.py --check heart star` to verify IDs. The script reads `assets/icon-names.json` offline.
3. **Write the usage** with the smallest set of props that does the job.
4. **Check the pitfalls** below before declaring it done, because the failure modes are silent or only show up at runtime.

## Concepts shared by all platforms

- **Modes:** `static` (first frame), `loop`, `onClick` (plays once on tap, calls the callback), `hover` (plays once on pointer enter; needs a mouse or stylus, so it does nothing on touch-only phones). Pick `onClick` or `hover` for lists and grids, because many looping icons at once is real drawing cost.
- **Color:** one color tints every solid fill and stroke. If the user gives no color, the icon follows the current text/theme color. Gradients in the artwork are not recolored.
- **External trigger:** to start an `onClick` icon from a different button, use `bindId` (React, the DOM id of the button) or an `IconTrigger` object (Kotlin and Flutter), then call `trigger.play()`.
- **Search and recolor helpers** exist on every platform with the same names: `IconTree.search()` (Kotlin, Flutter), `npx icontree search "..."` (React CLI), `recolorLottie(json, "#hex")` and `getRecoloredLottie(id, json, "#hex")`.

## Pitfalls

- **Icon looks tiny in a large box (React, 0.2.6).** `size` sizes the wrapper but not the animation inside. Pass a `className` and add CSS: `.ti > div, .ti svg { width: 100% !important; height: 100% !important; }`.
- **`React is not defined` during server rendering (React, 0.2.6).** The generic `Icon` uses `React` without importing it. In Astro, Next server components or similar SSR setups, add `import React from "react"; globalThis.React ??= React;` at the top of the module that renders it, or use the per-icon imports (`icon-tree-animate/icons/heart`), which are not affected.
- **Wrong color after a theme switch (React, 0.2.6).** `currentColor` is read once at mount. When the theme can change, pass an explicit hex color and give the icon a `key` that includes the theme so it remounts.
- **Blank icon.** The ID does not exist. Verify it with `--check`. IDs are case sensitive and use hyphens (`arrow-right`, not `arrowRight`).
- **Flutter widget name.** It is `TreeIcon`, not `Icon`, to avoid clashing with Flutter's own `Icon`. The static mode is `IconMode.static`.
- **Kotlin color.** `Color.Unspecified` (the default) follows `LocalContentColor`; pass a real `Color` to override.
- **Bundle size.** Kotlin and Flutter bundle all 946 icons. In React, use per-icon imports when the icon is known at build time; use the generic `Icon` with `id` only when the ID is chosen at runtime, because it includes the whole registry.

## Output

Show the install command (if the package is not yet in the project), the imports, and a minimal usage snippet that matches the project's style (TypeScript or JavaScript, Compose or Flutter idioms). When the user asked for "an icon for X", state which icon IDs you chose so they can swap them.

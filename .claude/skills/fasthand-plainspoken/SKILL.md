---
name: plainspoken
description: Apply Hasibul's PLAINspoken app UI design system (explicit half-height radius with superellipse 1.5 capsule geometry, system sans typography, no shadows, no outlines or borders except on text fields and comparison layouts, muted creamy neutral palette, slim navigation, no heavy animation) whenever building, styling, or reviewing UI — buttons, cards, popups, inputs, navigation bars, color palettes, typography, icons, or layout. Use this skill before writing any HTML/CSS/React aiming for a polished native-feeling interface, and when reviewing existing UI for consistency with this design language.
---

# PLAINspoken — Design System Rulebook

Made by Fasthand Studio. A 25-rule DO/DON'T design system for building interfaces: continuous-curvature capsule components (explicit half-height radius + superellipse 1.5), native system typography, flat borderless surfaces (no shadows, blurs, or gradients; outlines only on text fields and comparison layouts), and restrained motion.

## Quick reference

- Radius = exactly half the final rendered height, plus `corner-shape: superellipse(1.5)`. Never `50%` or `9999px`.
- Small buttons: 32px tall, `border-radius: 16px`. Medium functional CTAs: 44px tall, `border-radius: 22px`.
- Text: system sans only. Body 17px regular, buttons 17px semibold, supporting text muted gray.
- No shadows, no blurs, no large gradients. Outlines and borders only for text fields/inputs and a subtle divider in comparison layouts; everywhere else separate areas with layout and, only if needed, a subtle off-color surface fill.
- Icons: system accent colors, no background boxes, paired inline with a label.

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  border-radius: 16px; /* half of 32px */
  corner-shape: superellipse(1.5);
  font:
    600 17px/1 system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    sans-serif;
  border: 0;
  box-shadow: none;
}
.btn-cta {
  height: 44px;
  border-radius: 22px;
} /* half of 44px */
```

## DO

1. **Single-line label buttons.** Avoid multi-line labels in buttons to keep them compact and readable. Use a concise, single-line amount of text that fits naturally without wrapping.

2. **Mobile spacing density.** On mobile viewports, reduce internal component spacing. Items can feel too empty and disconnected when spacing is overly generous; prioritize density for smaller screens to keep context focused.

3. **Curvature geometry.** Use a continuous curvature system for rounded UI elements. Set the corner radius to an explicit pixel value equal to exactly half the element's final rendered height, then apply a 1.5 superellipse curvature for a smooth, continuous transition, e.g. `border-radius: 16px` with `corner-shape: superellipse(1.5)` for a 32px-tall element. Do not use `border-radius: 50%` (or `9999px`) as a shortcut for this — it does not produce the same geometry as an explicit half-height radius once superellipse curvature is applied, and it hides the deterministic height the system depends on. Apply this consistently to buttons, inputs, cards, popups, and other rounded surfaces where appropriate.

4. **Button contrast.** For white text, use a high-contrast color that provides optimal readability. Ensure the text color is clearly distinct to maximize legibility.

5. **System sans type.** All text uses system sans fonts so text stays native, legible, and consistent with the platform. Body text is 17px regular, buttons are 17px semibold, with supporting text in a muted gray.

6. **Surface contrast for depth.** Use layout and subtle off-color surface fills to distinguish adjacent areas. Keep surfaces the same color unless a difference is needed for clarity; never add outlines or borders for decoration.

7. **Direct icon coloring & micro-interactions.** Use glyphs directly using system accent colors (blue, green, orange, purple, red) without background box containers, and use restrained feedback such as instant opacity shifts, subtle focus color changes, or lightweight Lottie hover/interaction animations. Feedback should feel immediate, delightful, and never delay the user's next action or add visual clutter.

8. **Slim bars for navigation.** Use small compact buttons and slim navigation or top bars to keep the interface fixed-height and compact. Small capsule links are easier to scan than oversized navigation controls.

9. **Hierarchy through style.** Distinguish the preferred action by prominence, not by size. Use a single tinted style for secondary actions, plain styling for other actions, and reserve destructive red strictly for delete or warning actions. Do not use outlined buttons.

10. **Consistent color palette.** Use a structured, consistent color palette. Reserve high-contrast colors for key actions or hierarchy and apply soft, creamy neutral tones for standard surfaces to maintain a calm, professional aesthetic. Do not randomly use colors or gradients and blurs.

11. **Inline icon pairing.** Pair icons directly with text labels rather than placing them in isolated, standalone containers. Use a flex layout to ensure icons and text form a coherent interaction unit.

12. **Button sizing and curvature hierarchy.** Apply the same continuous curvature geometry to every rounded interactive button in the system. The corner radius must always equal exactly half of the button's final rendered height, followed by a 1.5 superellipse curvature. Do not use arbitrary fixed radii, `border-radius: 9999px`, or `border-radius: 50%` as substitutes for this rule. Establish an explicit final height where necessary so the geometry is deterministic. Primary, secondary, plain, and inline actions use 32px height with a 16px base radius; medium functional calls to action use 44px height with a 22px base radius. Apply `corner-shape: superellipse(1.5)` consistently to all button variants, including header/nav buttons, CTAs, small buttons, demo buttons, mobile buttons, popup/dialog buttons, and other rounded interactive controls. Preserve the same geometry across responsive states.

13. **Grain gradients sparingly.** Subtle, noise-based, or texturized gradients may be used in small, decorative elements or tiny badge fills to add texture. Never apply them as large background fills or across entire sections; keep them restrained.

## DON'T

14. **No drop shadows.** Ensure there are no decorative shadows. Use layout and, only when needed, subtle off-color surface fills to distinguish areas. Do not use outlines or borders for visual separation.

15. **No heavy animations.** Avoid elaborate keyframe animations, bouncy transitions, slide-ins, or motion that adds visual noise and perceptual lag to what should be an instantaneous, responsive experience.

16. **No bulky navigation.** Avoid large, full-height nav elements that dominate the viewport. Prefer slim buttons and links so the chrome stays out of the way of the content it points to.

17. **No custom fonts.** Use system typography. Avoid serif, monotype, or ornamental typefaces to ensure accessibility, readability, and performance across all platforms.

18. **No mixed sizes.** All components must adhere to the defined structural dimensions. Never resize specific content strings; maintain the standard touch targets for consistency.

19. **No gradients, blurs, or large gradients.** Never use large gradients, backdrop filters, or blur effects on components, and never pick colors at random. Keep all fills solid, using defined palette tokens. The only exception is a fine, noise-based, or texturized grain gradient used sparingly in small decorative elements.

20. **No chip tags before headers.** Never place chip tags, pill labels, or decorative horizontal labels before large display text. Headers should stand on their own without ornamental prefixes that add visual noise before the content begins.

21. **No AI generic taglines.** Avoid overused AI-generated taglines and filler phrases such as 'Unlock your workflow,' or 'Empowering innovation.' Write specific, human, and meaningful copy that says something real about the product.

22. **Avoid oversized text and sections.** Keep text sizes and section heights modest. Avoid giant headers or oversized sections that waste viewport space. Compact, well-proportioned layouts feel denser, more refined, and easier to use.

23. **No groups of three.** Never stop a horizontal row or grid at exactly three items. Use four or more when appropriate and intentional. Stopping at three looks unfinished and leaves awkward whitespace on wider screens.

24. **No conventional popup or button corners.** Do not give popups, sheets, dialogs, major floating surfaces, or rounded interactive controls arbitrary fixed corner radii. Use the same curvature geometry throughout: radius = half the final component height with superellipse(1.5) continuous curvature. Do not use `border-radius: 9999px` or `border-radius: 50%` as a replacement for the defined H/2 geometry. Ensure CSS specificity, responsive rules, padding, line-height, and component overrides do not break the intended curvature.

25. **Text fields and comparison outlines only.** Use outlines exclusively for text fields and input elements where they help define clear interaction boundaries. For all other UI elements, avoid outlines and borders. An exception is comparison layouts, where a subtle center divider or outline may be used to visually distinguish the compared sections. Prefer spacing, alignment, and hierarchy everywhere else.

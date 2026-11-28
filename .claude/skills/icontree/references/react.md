# React (icon-tree-animate)

Needs React and react-dom 18 or newer. Ships ESM, CommonJS and TypeScript types.

```tsx
import Icon from "icon-tree-animate";          // generic: any ID at runtime
import HeartIcon from "icon-tree-animate/icons/heart"; // per-icon: tree-shakeable

<Icon id="heart" size={24} color="#e5484d" mode="onClick" onClick={save} />
<HeartIcon size={24} mode="hover" />
```

Named exports: `Icon`, `recolorLottie`, `getRecoloredLottie`; types `IconId`, `IconProps`, `LottieJSON`.

| Prop                 | Type                                         | Default          | Notes                                                                                                              |
| -------------------- | -------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| `id`                 | `IconId`                                     | required         | Not on per-icon components (fixed by the import path)                                                              |
| `size`               | number or string                             | `24`             | Wrapper size (see the tiny-icon pitfall in SKILL.md)                                                               |
| `color`              | string                                       | `"currentColor"` | Hex, or follows the wrapper's CSS `color`                                                                          |
| `mode`               | `"static" \| "loop" \| "onClick" \| "hover"` | `"static"`       |                                                                                                                    |
| `onClick`            | `() => void`                                 | none             | Called in `onClick` mode                                                                                           |
| `bindId`             | string                                       | none             | DOM id of another element whose click plays the icon (mode `onClick`); the element must exist when the effect runs |
| `resetAfterPlay`     | boolean                                      | `true`           | Back to frame 0 after a one-shot                                                                                   |
| `className`, `style` |                                              |                  | Applied to the wrapper                                                                                             |

Per-icon import paths use the icon ID, e.g. `icon-tree-animate/icons/arrow-right`. Names with unusual characters (`Property 1=linear, Property 2=math`, `aave-(aave)`) are better used through the generic `Icon`.

CLI: `npx icontree search "arrow right"`.

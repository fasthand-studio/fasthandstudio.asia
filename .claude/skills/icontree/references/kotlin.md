# Kotlin, Jetpack Compose (IconTreeKotlin)

Android minSdk 24, Compose. Add the JitPack repo (`maven("https://jitpack.io")` in `dependencyResolutionManagement.repositories`), then `implementation("com.github.HasibulHasan098:IconTreeKotlin:1.0.0")`. Source: https://github.com/HasibulHasan098/IconTreeKotlin

```kotlin
import com.icontree.animate.Icon
import com.icontree.animate.IconMode

Icon(id = "heart", size = 24.dp, color = Color(0xFFE5484D), mode = IconMode.OnClick, onClick = { save() })
```

`Icon(id, modifier, size: Dp = 24.dp, color: Color = Color.Unspecified, mode: IconMode = IconMode.Static, onClick: (() -> Unit)? = null, trigger: IconTrigger? = null, resetAfterPlay: Boolean = true)`

- `IconMode`: `Static`, `Loop`, `OnClick`, `Hover` (pointer hover only).
- `Color.Unspecified` follows `LocalContentColor`.
- External trigger: `val trigger = rememberIconTrigger()`, pass `trigger = trigger` to an `OnClick` icon, call `trigger.play()` from a Button.
- Helpers: `IconTree.search("arrow right")`, `iconIds` (all IDs), `recolorLottie(json: JSONObject, "#hex")`, `getRecoloredLottie(id, json, "#hex")`.
- The animation is parsed once per icon and recolored with Lottie dynamic properties, so color changes are cheap. Looping many icons at once still costs frames; prefer `OnClick` or `Hover` in big grids and test in a release build.
- The library's `Icon` name can clash with `androidx.compose.material3.Icon`; import explicitly or use an import alias.

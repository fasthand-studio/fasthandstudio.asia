# Flutter (icon_tree_animate)

Flutter 3.24 or newer. `flutter pub add icon_tree_animate`, or from GitHub: `icon_tree_animate: {git: {url: https://github.com/HasibulHasan098/IconTreeFlutter.git, ref: 1.0.0}}`. Works on Android, iOS, web and desktop. Built on the `lottie` package.

```dart
import 'package:icon_tree_animate/icon_tree_animate.dart';

TreeIcon(id: 'heart', size: 24, color: const Color(0xFFE5484D), mode: IconMode.onClick, onTap: save)
```

`TreeIcon({required id, size = 24, color, mode = IconMode.static, onTap, trigger, resetAfterPlay = true})`

- `IconMode`: `static`, `loop`, `onClick`, `hover` (mouse/stylus, web and desktop).
- `color: null` follows `IconTheme`.
- External trigger: `final trigger = IconTrigger();` pass `trigger: trigger` to an `onClick` icon, call `trigger.play()`.
- Helpers: `IconTree.search('arrow right')`, `iconIds`, `recolorLottie(Map json, '#hex')`, `getRecoloredLottie(id, json, '#hex')`.
- The widget is `TreeIcon` (not `Icon`). Icon assets ship in the package's `assets/icons/`, so no pubspec asset entry is needed in the app.

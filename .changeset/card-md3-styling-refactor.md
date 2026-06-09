---
"@tinybigui/react": patch
---

**Card:** align styling, motion, and tokens with MD3 spec

- **fix:** `CardMedia` `aspectRatio="4/3"` was incorrectly rendered at 16:9 (`aspect-video`); now renders at the correct 4:3 ratio (`aspect-[4/3]`)
- **refactor:** card motion transitions switch from the `fast` tier to the `default` tier (`duration-spring-standard-default-effects` / `ease-spring-standard-default-effects`, 200ms) per MD3's standard-size component rule (cards are standard-size, alongside dialogs/menus)
- **refactor:** root transition broadened from `transition-shadow` to `transition-[box-shadow,opacity,border-color]` so disabled fades and outlined border-color changes animate correctly
- **style:** `CardHeader` headline typescale refined from `title-large` to `title-medium` for correct MD3 card density
- **feat:** `cardStateLayerVariants` and `cardFocusRingVariants` (plus their `VariantProps` types) are now exported from the package, matching Button/Switch/FAB export parity

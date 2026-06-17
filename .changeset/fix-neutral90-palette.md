---
"@tinybigui/tokens": patch
---

Fix `--md-ref-palette-neutral90` hex value from `#e6e1e5` to `#e6e0e9` per MD3 spec.

This token drives `on-surface`, `on-background`, and `inverse-surface` in dark theme, as well as `surface-container-highest` in light theme. The incorrect value caused subtle color inconsistencies across Card and other surface-based components.

---
"@tinybigui/react": minor
---

feat(progress): MD3 Expressive refactor — colorful tokens, gap, wavy shape, thick track

**Visual changes (non-breaking by default)**

- Inactive track color changed from `surface-container-highest` to `primary-container` (MD3 Expressive "colorful" style). Consumers relying on the specific old token will see a visual difference.
- 4dp indicator-track gap introduced between the active and inactive segments (linear + circular). The linear track now renders as two sibling segments rather than an `overflow: hidden` clipping approach.
- Stop indicator dot updated to 4dp (`size-1`) — previously `w-1 h-1` which was already 4px.
- Circular inactive track is now always visible in `primary-container` color (previously transparent/hidden in many states).
- Determinate transition updated from `duration-medium4 ease-standard` (legacy tokens) to `duration-spring-standard-default-spatial ease-spring-standard-default-spatial` (spring motion tokens). Progress updates now feel smoother and consistent with other components.

**New props**

- `shape?: "flat" | "wavy"` (default `"flat"`) — wavy uses an SVG sine-wave active indicator. Automatically falls back to flat when `prefers-reduced-motion: reduce` is set.
- `thickness?: "default" | "thick"` (default `"default"`) — thick renders an 8dp track per the MD3 Expressive thick variant.

**Architecture**

- `Progress.variants.ts` rewritten as slot-based CVA blocks following the Button/Switch/Tabs pattern.
- `progressInactiveSegmentVariants` added (new export) for the gap-based inactive track segment.
- `progressIndicatorVariants` kept as a backward-compat alias for `progressActiveIndicatorVariants`.
- `ProgressHeadless` `renderProgress` state now includes `shape` and `thickness`.

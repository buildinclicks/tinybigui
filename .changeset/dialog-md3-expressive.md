---
"@tinybigui/react": minor
---

Dialog: MD3 Expressive motion, hero icon, scroll dividers, reduced-motion support

**New features:**

- `icon` prop on `Dialog` and `DialogHeadless` — renders a centered 24dp hero icon above the headline per MD3 spec. When present, headline and supporting text center-align automatically via `group-data-[with-icon]/dialog:text-center` (no extra props needed).
- Scroll dividers in `DialogContent` — MD3 `border-outline-variant` dividers appear at the top and/or bottom of the scrollable area when content overflows. Managed by a `ResizeObserver` + scroll handler that sets `data-scroll-divider-top` / `data-scroll-divider-bottom` attributes.
- `prefers-reduced-motion` support — all keyframe animations are suppressed when the user prefers reduced motion (via `useReducedMotion`). Dialog appears/disappears instantly. Mirrors the `BottomSheet` pattern.
- `dialogIconVariants` exported from the package for consumers extending the headless layer.

**Motion improvements:**

- Replaced legacy `transition-[opacity,transform]` (mixing spatial + effects on one declaration) with composite `animate-md-*` keyframe utilities per `md3-motion.mdc`:
  - Basic enter: `animate-md-scale-in` (expressive-fast-spatial, 350ms)
  - Basic exit: `animate-md-scale-out` (emphasized-accelerate, 200ms)
  - Fullscreen enter: `animate-md-slide-in-bottom` (standard-default-spatial, 500ms)
  - Fullscreen exit: `animate-md-slide-out-bottom` (emphasized-accelerate, 200ms)
  - Scrim: `animate-md-fade-in` / `animate-md-fade-out`
- Switched `onTransitionEnd` → `onAnimationEnd` with `e.target === e.currentTarget` guard so child element animations (e.g. button ripples) cannot accidentally advance the exit state machine.
- Exit fallback timer bumped to 250ms (≥ longest exit animation duration).

**Architecture:**

- `dialogWrapperVariants` (previously dead code) is now computed in the styled `Dialog` layer and passed as `wrapperClassName` to `DialogHeadless`.
- Scrim animation is state-driven via a new `getScrimClassName` prop on `DialogHeadless`.
- `getAnimationClassName` prop on `DialogHeadless` enables reduced-motion gating at the styled layer without touching the headless primitive.
- MD3 spacing aligned: 24dp panel padding, `mb-4` headline, `pt-3` actions.

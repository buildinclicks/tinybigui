---
"@tinybigui/react": patch
---

refactor(tooltip): slot-based MD3 styling, token and reduced-motion fixes

- Rewrote `Tooltip.variants.ts` to use documented slot CVA functions, matching the Button/Switch architecture
- Replaced the binary `isVisible` variant with a 3-state `animation` variant (`enter` | `exit` | `none`) that supports `prefers-reduced-motion`
- Added rich tooltip slot variants: `richTooltipTitleVariants`, `richTooltipSupportingTextVariants`, `richTooltipActionsVariants`
- Fixed MD3 token: rich tooltip subhead (title) now uses `text-on-surface-variant` per spec (was `text-on-surface`)
- Added action row layout slot with correct `-ml-2 mt-3` alignment per MD3 spec
- Added `prefers-reduced-motion` guard in `TooltipTrigger`: overlay unmounts immediately on close under reduced motion, fixing a stuck-mount bug where `animationend` never fires when CSS animations are suppressed
- Added `reducedMotion` field to `TooltipAnimationContextValue` for consumer access
- Extended test suite with 9 new tests covering token correctness and reduced-motion behaviour

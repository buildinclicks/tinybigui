---
"@tinybigui/react": patch
---

fix(menu): align Menu styling with component-variants.mdc slot architecture

- Replace hardcoded `menu-enter`/`menu-exit` animations with `animate-md-scale-in`/`animate-md-scale-out` composite utilities (350ms expressive spring enter, 200ms emphasized-accelerate exit)
- Remove `isDisabled`/`isSelected` CVA variant keys from `menuItemVariants`; interaction states are now driven by React Aria's native `data-hovered`, `data-pressed`, `data-focus-visible`, `data-selected`, `data-disabled` attributes via `group-data-[x]/menuitem` selectors
- Add dedicated `menuItemStateLayerVariants` slot with hover 8% / focus+press 10% opacities using MD3 spring tokens (no more `before:` pseudo-element on the root)
- Add `menuItemIconVariants` slot so leading/trailing icons recolor on selection in vertical/vibrant menus
- Fix disabled treatment: per-slot `text-on-surface/38` instead of whole-item `opacity-38`
- Update item typography: Body Large → Label Large per MD3 menu spec
- Fix state-layer color transition to `duration-spring-standard-fast-effects ease-spring-standard-fast-effects`

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

fix(menu): fire open/close motion on popover and inset expressive highlight

- Add `menuPopoverVariants` CVA and apply to all three React Aria `<Popover>` elements (main trigger, submenu, context menu); RAC emits `data-entering`/`data-exiting`/`data-placement` on the Popover, not the inner RACMenu, so animation classes must live there
- Strip dead `will-change`, `data-[entering]`, `data-[exiting]`, `origin-*`, and `motion-reduce:` classes from `menuContainerVariants` (those now belong exclusively to `menuPopoverVariants`)
- Add `menuItemHighlightVariants` selected-background layer: `inset-0` (baseline) / `inset-1 rounded-lg` (vertical) — creates the inset, pill-shaped MD3 Expressive highlight matching the spec reference
- Update `menuItemStateLayerVariants` geometry to be menuStyle-aware: baseline `inset-0 rounded-[inherit]`, vertical `inset-1 rounded-lg`
- Remove `data-[selected]:bg-*` from `menuItemVariants` root; background now lives exclusively on the highlight layer
- Render highlight → state layer → ripple → content DOM order in `MenuItem.tsx`; ripple container geometry also respects menuStyle

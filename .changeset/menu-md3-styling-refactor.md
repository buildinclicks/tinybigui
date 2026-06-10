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

fix(menu): align expressive vertical menu gap and spacing to MD3 segmented spec

- `menuContainerVariants` vertical: transparent background (was `bg-surface-container-low`) — the container is now a clear overlay; group surface color moves onto individual items
- `menuItemVariants` vertical: each item carries its own group surface (`bg-surface-container-low` / `bg-tertiary-container` vibrant) and CSS sibling selectors on `[data-menu-gap]` produce segmented corner rounding (leading group 16/8dp, trailing group 8/16dp, middle group 8/8dp), matching the MD3 Expressive segmented-group model (`SegmentedMenuTokens`)
- `MenuGap`: height reduced from `h-2` (8dp) to `h-0.5` (2dp) matching `SegmentedMenuTokens.SegmentedGap = 2dp`; `data-menu-gap` attribute added to enable CSS sibling selectors for segmented rounding on adjacent items
- `MenuItem` vertical height map: default density 0 = `h-11` (44dp) instead of `h-12` (48dp), matching `SegmentedMenuTokens.Item = 44dp`; density steps -1/-2/-3 adjusted accordingly (h-10/h-9/h-8)
- `menuItemIconVariants` vertical: icon size `h-5 w-5` (20dp) matching `SegmentedMenuTokens.ItemLeadingIconSize = 20dp`; baseline stays `h-6 w-6` (24dp)
- `menuItemHighlightVariants` vertical: `inset-x-1 inset-y-0 rounded-md` (horizontal-only 4dp inset, 12dp CornerMedium per `ItemSelectedShape`) — replaces `inset-1 rounded-lg`; selection no longer spans full width but fills item height eliminating vertical detachment
- `menuItemStateLayerVariants` vertical: geometry updated to match highlight layer: `inset-x-1 inset-y-0 rounded-md`
- `menuDividerVariants`: `my-0.5 mx-3` (2dp vertical, 12dp horizontal inset) for consistency with gap and vertical layout
- All changes are vertical-only; baseline menu visuals, public API, and props are unchanged

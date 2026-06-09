# @tinybigui/react

## 0.11.2

### Patch Changes

- 1aeb698: refactor(tabs): MD3 Expressive styling refactor — Variants-vs-States architecture, correct state-layer/indicator tokens, spring motion, content-width primary indicator

## 0.11.1

### Patch Changes

- 548322d: **Card:** align styling, motion, and tokens with MD3 spec
  - **fix:** `CardMedia` `aspectRatio="4/3"` was incorrectly rendered at 16:9 (`aspect-video`); now renders at the correct 4:3 ratio (`aspect-[4/3]`)
  - **refactor:** card motion transitions switch from the `fast` tier to the `default` tier (`duration-spring-standard-default-effects` / `ease-spring-standard-default-effects`, 200ms) per MD3's standard-size component rule (cards are standard-size, alongside dialogs/menus)
  - **refactor:** root transition broadened from `transition-shadow` to `transition-[box-shadow,opacity,border-color]` so disabled fades and outlined border-color changes animate correctly
  - **style:** `CardHeader` headline typescale refined from `title-large` to `title-medium` for correct MD3 card density
  - **feat:** `cardStateLayerVariants` and `cardFocusRingVariants` (plus their `VariantProps` types) are now exported from the package, matching Button/Switch/FAB export parity

## 0.11.0

### Minor Changes

- 3d312de: feat(bottomsheet): refactor handle to Variants-vs-States architecture with MD3 state layer

  Refactors the BottomSheet drag handle to match the Button/Switch component pattern:
  - **Handle state layer**: new `bottomSheetHandleStateLayerVariants` slot — semi-transparent ring driven by `data-*` attributes. Opacities follow MD3 spec: hover 8%, focus/pressed 10%, dragged 16%.
  - **Handle focus ring**: new `bottomSheetHandleFocusRingVariants` slot — opacity-driven `outline-secondary` overlay replacing the previous raw `focus-visible:ring-*` utility classes. Avoids clipping by the container's `overflow-hidden`.
  - **Handle pill**: removed non-token `opacity-40`; `on-surface-variant` is already a low-emphasis color role and requires no opacity override per MD3 spec.
  - **React Aria wiring**: `useHover` and `useFocusRing` now drive `data-hovered` and `data-focus-visible` on the handle wrapper via `getInteractionDataAttributes`. The wrapper carries `group/handle` so all child slots consume state via `group-data-[x]/handle:` selectors.
  - **Presence-based encoding**: all `data-dragging` attributes (panel + handle) now use ternary encoding (`isDragging ? "" : undefined`) per component-variants architecture rule.
  - Exports two new variant functions (`bottomSheetHandleStateLayerVariants`, `bottomSheetHandleFocusRingVariants`) and their corresponding types.

## 0.10.0

### Minor Changes

- 9a855bf: **AppBar: M3 Expressive Flexible architecture refactor**

  **Styling architecture (Variants vs States):**
  - Rewrote `AppBar.variants.ts` into slot-based CVAs matching the Button/Switch pattern: `appBarVariants`, `appBarTopRowVariants`, `appBarLeadingVariants`, `appBarHeadlineBlockVariants`, `appBarTitleVariants`, `appBarSubtitleVariants`, `appBarTrailingVariants`, `appBarExpandedTitleVariants`
  - Scroll elevation migrated from a CVA boolean variant to presence-based `data-scrolled=""` on the root + `group-data-[scrolled]/appbar:*` selectors (breaking: `shadow-elevation-2` / `bg-surface-container` are no longer bare classes when scrolled)
  - Motion tokens corrected: `transition-shadow duration-medium2 ease-standard` → `transition-[background-color,box-shadow] duration-spring-standard-default-effects ease-spring-standard-default-effects`

  **M3 Expressive Flexible subtitle type scales (corrected):**
  - small / center-aligned: `label-medium` + `on-surface-variant` (was `title-medium`)
  - medium expanded: `label-large` + `on-surface-variant` (was `title-large` + `on-surface`)
  - large expanded: `title-medium` + `on-surface-variant` (was `headline-small` + `on-surface`)

  **M3 Expressive Flexible height growth:**
  - medium with subtitle grows to 136dp (new `--spacing-appbar-medium-subtitle` token)
  - large with subtitle grows to 152dp (new `--spacing-appbar-large-subtitle` token)
  - Driven by `data-with-subtitle=""` content flag + `group-data-[with-subtitle]/appbar:*` selectors

  **API:**
  - `AppBarHeadlessProps` now extends `React.HTMLAttributes<HTMLElement>` for `data-*` forwarding
  - All new slot CVA fns exported from `index.ts`
  - Public `AppBar` props are unchanged

## 0.9.0

### Minor Changes

- d869fd7: **chip: MD3 Expressive refactor — slot-based architecture, token corrections, new elevated support**

  ### Architecture

  The Chip component has been rewritten to follow the same slot-based "Variants vs States"
  architecture used by `Button` and `Switch`:
  - All interaction/selection states are now driven by `data-*` attributes set via
    `getInteractionDataAttributes` and consumed by each slot via `group-data-[x]/chip`
    Tailwind selectors — no state values in CVA variants.
  - `useHover`, `useFocusRing`, and `isPressed` (via press lifecycle callbacks) are now
    tracked in `Chip.tsx` and threaded to `ChipHeadless` via `bodyPassthrough` and
    `removePassthrough`.
  - Dedicated focus ring slot (`chipFocusRingVariants`) rendered outside `overflow-hidden`
    so it extends 3px beyond the chip boundary and is never clipped.
  - Remove button gets its own `group/chip-remove` scope with an independent circular
    state layer (`chipRemoveStateLayerVariants`).
  - Spring motion tokens throughout: `ease-spring-standard-fast-effects` for
    color/opacity/shadow; `ease-spring-standard-fast-spatial` for the filter checkmark
    width animation.

  ### MD3 Token Corrections

  Per-type color tokens now match the MD3 Expressive spec exactly:

  | Type                  | Container             | Border            | Label                    | Leading icon             |
  | --------------------- | --------------------- | ----------------- | ------------------------ | ------------------------ |
  | `assist`              | transparent           | `outline`         | `on-surface`             | **`primary`**            |
  | `filter` (unselected) | transparent           | `outline`         | `on-surface-variant`     | `on-surface-variant`     |
  | `filter` (selected)   | `secondary-container` | none              | `on-secondary-container` | `on-secondary-container` |
  | `input`               | transparent           | `outline-variant` | `on-surface-variant`     | `on-surface-variant`     |
  | `suggestion`          | transparent           | `outline`         | `on-surface-variant`     | `on-surface-variant`     |

  ### New Features
  - **Elevated surface for all chip types** — `surface="elevated"` now works on `filter`
    and `input` chips in addition to `assist` and `suggestion`.

  ### Breaking Changes (pre-1.0 minor)
  - **`surface` default changed from `"tonal"` to `"flat"`**. If you relied on the
    default, add `surface="elevated"` explicitly if you want the elevated style, or
    omit `surface` / use `surface="flat"` for the MD3 default transparent outlined style.
  - **`surface="tonal"` is deprecated.** It maps to `"flat"` internally and emits a
    `console.warn` in non-production environments. Migrate: replace `surface="tonal"` with
    `surface="flat"` (or simply omit `surface`).

  ### New Exports

  ```ts
  // Slot variant functions
  (chipStateLayerVariants,
    chipFocusRingVariants,
    chipLeadingIconVariants,
    chipTrailingIconVariants,
    chipCheckmarkVariants,
    chipCheckmarkIconVariants,
    chipLabelVariants,
    chipRemoveButtonVariants,
    chipRemoveStateLayerVariants);

  // Variant prop types
  (ChipStateLayerVariants, ChipLeadingIconVariants);

  // Passthrough prop types (for advanced headless usage)
  (ChipBodyPassthroughProps, ChipRemovePassthroughProps);
  ```

## 0.8.1

### Patch Changes

- a3f3f4d: refactor(checkbox): migrate to MD3 Variants-vs-States architecture

  Rewrites Checkbox styling to match the slot-based CVA pattern used by Switch:
  - All interaction/selection states (hover, focus-visible, pressed, selected, disabled, invalid, indeterminate) are now expressed as `data-*` attributes on the root element via `getInteractionDataAttributes`, consumed by `group-data-[x]/checkbox` Tailwind selectors in each slot — no state variants or state compoundVariants in CVA.
  - Replaces the `animate-pulse` SVG focus ring with a proper MD3 focus-ring slot (outline, opacity transition via `*-spring-standard-fast-effects`).
  - Replaces hardcoded `duration-200` with MD3 motion token pairs: effects transitions use `*-spring-standard-fast-effects`, spatial transitions use `*-spring-standard-fast-spatial`.
  - State-layer opacities corrected to MD3 spec: hover 8% (`opacity-8`), focus/pressed 10% (`opacity-10`).
  - Box visual now uses a `div` with `border-2 rounded-[2px]` + inline SVG icons, matching the Switch div-slot pattern.
  - Invalid and disabled color cascades use doubly-chained `group-data` selectors for correct CSS specificity ordering.
  - Exports updated to new slot variant names (`checkboxRootVariants`, `checkboxControlVariants`, `checkboxStateLayerVariants`, `checkboxFocusRingVariants`, `checkboxBoxVariants`, `checkboxIconVariants`, `checkboxLabelVariants`).

  No behavioral or API changes — `CheckboxProps` and React Aria integration are unchanged.

## 0.8.0

### Minor Changes

- ff26d45: **Badge: align with MD3 spec and variants/states architecture (breaking)**

  Removes the non-spec `color` prop (and `BadgeColor` type) from `Badge`, `BadgeContent`, and `DrawerItemBadgeConfig`. The MD3 badge specification defines only the error color role (`bg-error` / `text-on-error`), which is now hardcoded in the CVA base.

  **Migration:** Remove any `color` prop usage from `<Badge>` and `<DrawerItem badge={{ color: … }}>`.

  **Styling changes:**
  - Migrates from CVA variant keys for `size`, `color`, `invisible`, and `reducedMotion` to the variants-vs-states architecture used by Button and Switch.
  - Dot vs count is now a content flag (`data-dot`) set directly on the element; visibility is a runtime flag (`data-invisible`).
  - Show/hide animation uses MD3 Expressive spatial token pair (`duration-expressive-fast-spatial` + `ease-expressive-fast-spatial`) instead of mixed scale+opacity transitions.
  - Reduced-motion guard applied at the component level (conditional class, not a CVA variant).

### Patch Changes

- ff26d45: fix(badge): anchor indicator to icon corner per MD3 spec

  ## What changed

  The Badge indicator now straddles the wrapped element's top-right corner instead of floating fully outside it.

  **Before:** `absolute -top-1 -right-1` pushed the badge 4dp outside the host's top-right edge. When wrapping a padded `IconButton`, the badge landed on the button border rather than on the icon itself.

  **After:** `absolute top-0 right-0 -translate-y-1/2 translate-x-1/2` places the badge center on the host's top-right corner (half-in, half-out), matching the MD3 spec diagram. This is host-size-agnostic — the badge sits correctly on a 24dp bare icon, a nav chip, or any other wrapped element.

  > Tailwind v4 note: `translate-*` and `scale-*` map to independent native CSS `translate:` / `scale:` properties, so the static corner translate does not interfere with the existing `scale-0`/`scale-100` show/hide animation.

  ## Drawer trailing badge

  `DrawerItem`'s config-based badge (`badge={{ count: N }}`) no longer uses `<Badge><span/>` (which would apply the absolute translate to a 0-size anchor). It now renders a direct `<span role="status">` using the new `badgeStaticVariants` — same visual appearance (colors, sizing, dot/invisible flags) but inline (no absolute positioning).

  ## New export

  `badgeStaticVariants` and `BadgeStaticVariants` are now exported from `@tinybigui/react` for consumers who need an inline badge pill in custom layouts.

  ## Migration

  No API changes. If you relied on the `absolute -top-1 -right-1` offset for a custom layout workaround, update your wrapping to match the new `top-0 right-0 -translate-y-1/2 translate-x-1/2` placement.

## 0.7.0

### Minor Changes

- 8eaeb6f: **BREAKING** `FABMenu`: redesign action items to MD3 Expressive pill buttons

  `FABMenuItem` is now a full-rounded 56dp pill button (leading icon + inline label) matching the MD3 Expressive FAB Menu spec, replacing the previous 40dp mini-FAB with a detached floating label chip.

  ### Breaking changes
  - `FABMenuItem` shape changes: was `size-10 rounded-xl` (40dp mini-FAB); now `h-14 rounded-full` (56dp pill).
  - `label` is now rendered **inline inside the button** (not as a sibling chip). The `rounded-full` chip pattern is removed.
  - `aria-label` on `FABMenuItem` is now **optional** when `label` is provided (the label text serves as the accessible name). A dev-mode warning is emitted if neither `aria-label` nor `label` is present.
  - `fabMenuItemVariants` shape has changed: the old `isOpen: true/false` boolean CVA is replaced by the new slot-based CVA with a `color` variant. Update any direct usage accordingly.

  ### New features
  - `color` prop on `FABMenuItem` (default `primary-container`): choose from 6 MD3 Expressive color roles — `primary-container`, `secondary-container`, `tertiary-container`, `primary`, `secondary`, `tertiary`.
  - New exported slot CVAs: `fabMenuItemStateLayerVariants`, `fabMenuItemFocusRingVariants`, `fabMenuItemIconVariants`, `fabMenuItemLabelVariants`.
  - New exported CVA: `fabMenuListVariants` — absolutely-positioned overlay with per-direction anchoring via logical insets (`end-0`, `start-full`, etc.) so RTL placement is automatic.
  - New exported types: `FABMenuItemColor`, `FABMenuListVariants`.
  - Correct MD3 state-layer opacities: hover 8% / focus 10% / pressed 10% (was hover-only).
  - Dedicated focus ring slot (`inset-[-3px]`, keyboard-only) per Button/FAB architecture.
  - Elevation 3 base → 4 hover → 3 focus/pressed per MD3 FAB spec.
  - Trigger FAB is now the **sole in-flow child** of the root; action items render as an **absolutely-positioned overlay** so the FAB never shifts position when the menu opens or closes.
  - Scale-in/out pivot (`transform-origin`) aligns with the FAB edge per direction so items appear to emanate from the trigger.
  - Trigger FAB icon morph (+→×) now uses `expressive-fast-spatial` motion tokens, guarded by `useReducedMotion`.
  - Ripple effect on menu items.
  - Full React Aria keyboard accessibility via `useButton`/`useHover`/`useFocusRing`.
  - Staggered items no longer flash on open/close: `--animate-md-scale-in` and `--animate-md-scale-out` tokens now use fill-mode `both`, holding the keyframe start frame during the stagger `animation-delay`.

## 0.6.0

### Minor Changes

- 4a422b9: refactor(fab): M3 Expressive refactor — slot architecture, new size scale, solid colors

  **Breaking changes (pre-1.0 minor bump):**
  - Default `size` changed from `"medium"` to `"fab"`. Update `size="medium"` if you relied on the 56dp size — it now renders the 80dp M3 Expressive Medium FAB.
  - `size="medium"` now renders a **80dp** container (M3 Expressive Medium FAB), not 56dp.
  - Default `color` changed from `"primary"` to `"primary-container"`. The old `color="primary"` is now a **solid** color style (`bg-primary / text-on-primary`).
  - `color="secondary"` and `color="tertiary"` are now **solid** styles (bg-secondary / bg-tertiary).

  **New features:**
  - `size="fab"` (56dp) — new canonical default size.
  - `size="medium"` (80dp) — M3 Expressive Medium FAB with 20dp corners and 28dp icon.
  - `color="primary-container"` / `"secondary-container"` / `"tertiary-container"` — container color styles (previous default behaviour).
  - `color="primary"` / `"secondary"` / `"tertiary"` — new solid color styles (M3 Expressive).
  - Dedicated focus-ring slot (`inset-[-3px]`, keyboard-only, never clipped).
  - Dedicated state-layer slot with correct opacities: hover 8% / focus 10% / pressed 10%.
  - State-layer color matches icon/on-color per MD3 spec.
  - Elevation 3 base → 4 hover → 3 focus/pressed per MD3 spec.
  - `useHover` + `useFocusRing` + `isPressed` via React Aria — full `group-data-[x]/fab` attribute system.
  - MD3 motion tokens (`duration-spring-standard-fast-effects`, `ease-spring-standard-fast-effects`) replace hardcoded `duration-200`.

  **Deprecated (functional, with dev warning):**
  - `size="small"` — use `size="fab"` instead.
  - `color="surface"` — use `color="primary-container"` instead.

## 0.5.0

### Minor Changes

- 692d699: refactor(icon-button): M3 Expressive sizing system, Variants-vs-States architecture, press shape-morph

  **Breaking changes:**
  - `size` prop values renamed to the M3 Expressive 5-tier system. Map your existing values as follows:
    - old `small` (32dp) → new `xsmall`
    - old `medium` (40dp) → new `small`
    - old `large` (48dp) → new `medium`
    - new `large` (96dp) and `xlarge` (136dp) are added

  **New props:**
  - `width: 'narrow' | 'default' | 'wide'` — adjusts container width relative to height (default: `'default'`)
  - `shape: 'round' | 'square'` — `round` = circular (default); `square` = MD3 size-tiered corner radius
  - `selectedIcon: React.ReactNode` — icon shown when a toggle button (`selected` prop defined) is in the ON state

  **Improvements:**
  - Migrated to the Variants-vs-States architecture (same pattern as `Switch`): all interaction and selection states are driven by `data-*` attributes emitted by `IconButtonHeadless` and consumed by slot CVA classes via `group-data-[x]/icon-button` selectors — no state variants in CVA
  - `IconButtonHeadless` now runs `useHover` + `useFocusRing` and emits `data-hovered`, `data-focus-visible`, `data-pressed`, `data-selected`, `data-disabled`, `data-toggle` via `getInteractionDataAttributes`
  - MD3-correct state layers: per-variant overlay color via `--ib-sl` CSS variable, hover 8% / focus-visible 10% / pressed 10% opacity
  - MD3-correct disabled: icon content `text-on-surface/38`; filled/tonal containers collapse to `bg-on-surface/12`; outlined border collapses to `border-on-surface/12`
  - Press shape-morph: `round` shape springs to size-tiered square corners on press via `data-[pressed]:rounded-[var(--ib-radius-press)]` + expressive-fast-spatial easing
  - Toggle-off filled/tonal: correct `surface-container-highest` background per MD3 Flutter spec
  - Slot-based CVA with CSS role variables (`--ib-bg`, `--ib-bg-off`, `--ib-bg-on`, `--ib-fg`, `--ib-fg-off`, `--ib-fg-on`, `--ib-sl`, `--ib-border`, `--ib-radius`, `--ib-radius-press`) for clean variant × state separation
  - New exports: `iconButtonRootVariants`, `iconButtonStateLayerVariants`, `iconButtonIconVariants`, `IconButtonWidth`, `IconButtonShape`

## 0.4.2

### Patch Changes

- 7e5661f: Refactor Button, ButtonGroup, and IconButton to align with MD3 specs — adopt variants-vs-states architecture with data-attribute interaction layers, remove non-spec `color` prop, correct size heights and state layer opacities, and enhance ripple and focus ring behavior.

## 0.4.1

### Patch Changes

- 6021b03: Fix Switch component styling to match MD3 specs — correct track alignment, refactor variant system to reduce CVA combinatorial explosion, and add shared interaction state utilities for consistent hover/focus/pressed styling.

## 0.4.0

### Minor Changes

- cfd9af7: feat(badge): add MD3 Badge component with dot and count variants, error/primary colors, and composable overlay wrapper
- 9b89f1d: feat(bottom-sheet): add MD3 Bottom Sheet component with standard and modal variants, draggable snap-point handle, and keyboard accessibility
- 42db9f8: Add MD3 ButtonGroup component with connected button layout, single and multi-select selection modes, and ButtonGroupContext for propagating variant/size to child buttons. Modularize @tinybigui/tokens into focused CSS files: color.css, elevation.css, motion.css, shape.css, theme.css, and typography.css, each available as a standalone import alongside the combined tokens.css.
- a9be72e: feat(card): add MD3 Card component with elevated, filled, and outlined variants, composable sub-components, and interactive mode with ripple and state layer
- a9be72e: feat(chip): add MD3 Chip component with Assist, Filter, Input, and Suggestion types, ChipSet container, and MD3 animations
- b005db0: feat(date-time-pickers): add MD3 Date Picker and Time Picker components with docked, modal, and input variants, range selection, 12h/24h clock dial, and full accessibility
- 8efcd34: feat(divider): add MD3 Divider component with horizontal/vertical orientations, inset variants, and subheader label support
- 1877960: feat(fab-menu): add MD3 FAB Menu speed-dial component with stagger animation and direction variants
- e76fb76: feat(list): add MD3 List component with static and interactive modes, slot-based sub-components, selection management, and Divider integration
- 5c40b1e: feat(drawer): enhance MD3 Navigation Drawer with section dividers, badge support on items, active indicator polish, scrim animation, and icon-only mode
- 17a1813: feat(search): add MD3 Search component with SearchBar and SearchView overlay, portal rendering, and suggestions slot
- 47912be: feat(slider): add MD3 Slider component with standard, centered, and range variants, five size presets, vertical orientation, discrete stops, value indicator, and inset icon
- 5c3dd3e: feat(split-button): add MD3 Split Button component composing Button and Menu with filled, tonal, and outlined variants
- 762e0cc: feat(tooltip): add MD3 Tooltip and RichTooltip components with portal rendering, smart positioning, 300ms hover delay, and MD3 entry/exit animations

### Patch Changes

- 4850568: Fix AppBar component — resolve missing style gaps, correct Tailwind utilities generation, and expand AppBar stories and test coverage. Refine token layer by extracting a `preset.css` for token presets, and update `theme.css`/`tokens.css` to clean up the semantic layer structure. Add THEMING guide and update README with usage documentation.

## 0.3.0

### Minor Changes

- Add MD3 Dialog component with basic and fullscreen variants, composable `DialogHeadline`, `DialogContent`, and `DialogActions` slots, focus trap, Escape-to-dismiss, and WCAG 2.1 AA accessibility via React Aria `useDialog`/`useOverlay`.
- Add MD3 Menu component with `MenuTrigger`, `Menu`, `MenuItem`, `MenuSection`, and `MenuDivider`; full keyboard navigation (arrows, Home/End, Enter/Space, type-ahead); single and multi-select modes; and WCAG 2.1 AA accessibility via React Aria collections.
- 5f22cde: Add `ContextMenuTrigger`, `SubmenuTrigger`, and `MenuGap`; expand headless menu primitives and types; update menu styles and stories.
- Add MD3 Progress Indicator component with linear and circular variants, determinate and indeterminate modes, full WCAG 2.1 AA accessibility via `role="progressbar"`, and three-layer architecture (React Aria → Headless → Styled).
- Add MD3 Snackbar component with `SnackbarProvider`, imperative `useSnackbar` hook, auto-dismiss timer, pause-on-hover/focus, action button support, multi-position placement, and WCAG 2.1 AA live-region accessibility.
- 7cfb578: Add snackbar stacking with per-position queues and configurable `maxVisible` on `SnackbarProvider`; move layout positioning into the portal stack container; refine enter and exit animations; expose `--spacing-snackbar-max` in token CSS.

## 0.2.0

### Minor Changes

- dcc0b60: Add MD3 Top App Bar component with four size variants (small, center-aligned, medium, large), composable navigation and action icon slots, scroll-triggered elevation, and useScrollElevation hook. Add typography, motion, easing, and spacing token mappings to Tailwind @theme.
- b044688: Add MD3 Navigation Drawer component with modal and standard variants, composable DrawerItem and DrawerSection slots, scrim overlay, focus trap, and WCAG 2.1 AA accessibility using React Aria's useDialog/useOverlay hooks.
- 67768ae: feat(navigation-bar): add MD3 Navigation Bar (Bottom Navigation) component

  Implements the Material Design 3 Navigation Bar component with full
  accessibility support, three-layer architecture, and TDD.

  **Features:**
  - `NavigationBar` — fixed bottom bar, 3–5 destination items, MD3 styled
  - `NavigationBarItem` — standalone styled item with animated indicator pill
  - `HeadlessNavigationBar` — headless layer using React Aria's `useTabList`/`useTabListState`
  - `HeadlessNavigationBarItem` — headless item using React Aria's `useTab`/`useFocusRing`

  **Highlights:**
  - Animated active indicator pill (MD3 motion tokens: `duration-medium2`, `ease-emphasized`)
  - Badge support: dot indicator, numeric count, "999+" truncation, hidden at 0
  - `hideLabels` prop for icon-only mode (requires `aria-label` per WCAG)
  - Controlled (`activeKey`/`onActiveChange`) and uncontrolled (`defaultActiveKey`) usage
  - Full keyboard navigation: Arrow Left/Right, Home, End, roving `tabIndex`
  - WCAG 2.1 AA: `role="navigation"` + `aria-label`, `role="tablist"`, `role="tab"` + `aria-selected`
  - Dev warning for item count outside 3–5 range
  - Ripple effect via `useRipple`
  - State layers: hover `opacity-8`, pressed `opacity-12`
  - 46 unit/integration tests including axe accessibility audit

- b044688: Add MD3 Tabs component with Primary and Secondary variants, composable Tab and TabPanel slots, animated active indicator, full keyboard navigation (Arrow Left/Right, Home, End), and WCAG 2.1 AA accessibility using React Aria's useTabList/useTab hooks.

## 0.1.1

### Patch Changes

- 9a84c28: fix misleading pre-release language in npm readme

## 0.1.0

### Minor Changes

- 89f418f: Initial release with 7 MD3 components: Button, IconButton, FAB, TextField, Checkbox, Switch, Radio

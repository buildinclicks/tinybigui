# @tinybigui/tokens

## 0.12.0

### Minor Changes

- 8e60f75: refactor(divider)!: slot-based CVA, CSS-var thickness, logical RTL insets; remove subheader label

  **BREAKING CHANGES:**
  - `label` prop removed from `Divider`. The subheader variant (text centered between two rules) was not part of the MD3 divider spec and has been removed.
  - Inset variants now use logical inline properties (`margin-inline-start` / `margin-inline-end`) instead of physical margins. This is a visual change only in RTL layouts.

  **What changed:**
  - Styling switched from `border-*` to a background-fill approach (`bg-outline-variant`) on a zero-border element. Matches the `@material/web` `MdDivider` implementation.
  - Thickness is now controlled by the `--md-divider-thickness` CSS custom property (default `1px`, MD3 1dp). Override per instance: `<Divider style={{ "--md-divider-thickness": "2px" }} />`.
  - `Divider.variants.ts` rewritten following the documented slot-CVA architecture used by Button and Switch (spec header comment, array-form base, explicit `defaultVariants`).
  - `DividerHeadless` simplified — `label` and `children` props removed from the interface.
  - All MD3 design token classes (no arbitrary values).
  - 22 tests cover orientation, insets, bg token, ref forwarding, and axe accessibility.

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

## 0.4.2

### Patch Changes

- 7e5661f: Refactor Button, ButtonGroup, and IconButton to align with MD3 specs — adopt variants-vs-states architecture with data-attribute interaction layers, remove non-spec `color` prop, correct size heights and state layer opacities, and enhance ripple and focus ring behavior.

## 0.4.1

### Patch Changes

- 6021b03: Fix Switch component styling to match MD3 specs — correct track alignment, refactor variant system to reduce CVA combinatorial explosion, and add shared interaction state utilities for consistent hover/focus/pressed styling.

## 0.4.0

### Minor Changes

- 42db9f8: Add MD3 ButtonGroup component with connected button layout, single and multi-select selection modes, and ButtonGroupContext for propagating variant/size to child buttons. Modularize @tinybigui/tokens into focused CSS files: color.css, elevation.css, motion.css, shape.css, theme.css, and typography.css, each available as a standalone import alongside the combined tokens.css.

### Patch Changes

- 4850568: Fix AppBar component — resolve missing style gaps, correct Tailwind utilities generation, and expand AppBar stories and test coverage. Refine token layer by extracting a `preset.css` for token presets, and update `theme.css`/`tokens.css` to clean up the semantic layer structure. Add THEMING guide and update README with usage documentation.

## 0.3.0

### Patch Changes

- 7cfb578: Add snackbar stacking with per-position queues and configurable `maxVisible` on `SnackbarProvider`; move layout positioning into the portal stack container; refine enter and exit animations; expose `--spacing-snackbar-max` in token CSS.

## 0.2.0

### Minor Changes

- dcc0b60: Add MD3 Top App Bar component with four size variants (small, center-aligned, medium, large), composable navigation and action icon slots, scroll-triggered elevation, and useScrollElevation hook. Add typography, motion, easing, and spacing token mappings to Tailwind @theme.
- b044688: Add MD3 Navigation Drawer component with modal and standard variants, composable DrawerItem and DrawerSection slots, scrim overlay, focus trap, and WCAG 2.1 AA accessibility using React Aria's useDialog/useOverlay hooks.
- b044688: Add MD3 Tabs component with Primary and Secondary variants, composable Tab and TabPanel slots, animated active indicator, full keyboard navigation (Arrow Left/Right, Home, End), and WCAG 2.1 AA accessibility using React Aria's useTabList/useTab hooks.

## 0.1.1

### Patch Changes

- 9a84c28: fix misleading pre-release language in npm readme

## 0.1.0

### Minor Changes

- 89f418f: Initial release with 7 MD3 components: Button, IconButton, FAB, TextField, Checkbox, Switch, Radio

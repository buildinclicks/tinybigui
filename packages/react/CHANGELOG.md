# @tinybigui/react

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

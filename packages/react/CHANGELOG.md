# @tinybigui/react

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

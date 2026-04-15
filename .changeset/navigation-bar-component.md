---
"@tinybigui/react": minor
---

feat(navigation-bar): add MD3 Navigation Bar (Bottom Navigation) component

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

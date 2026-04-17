---
title: "feat(navigation-bar): Implement MD3 Navigation Bar component"
labels: ["enhancement", "component", "phase-2", "v0.2.0", "accessibility"]
milestone: "v0.2.0"
assignees: []
---

## Summary

Implement the Material Design 3 **Navigation Bar** (Bottom Navigation) component for `@tinybigui/react` as part of the Phase 2 Navigation milestone. The Navigation Bar lets people switch between UI views on smaller devices. It renders a fixed bottom bar with 3–5 destination items, each comprising an icon, optional label, an animated active indicator pill, and an optional badge. The component uses React Aria's `useTabList`/`useTab` for full keyboard navigation and ARIA semantics, and supports both controlled and uncontrolled usage patterns.

## Design Reference

- [MD3 Navigation Bar — Overview](https://m3.material.io/components/navigation-bar/overview)
- [MD3 Navigation Bar — Specs](https://m3.material.io/components/navigation-bar/specs)

## Scope

### Constraints

- [ ] Enforces 3–5 destination items via TypeScript type (`MinMax<3, 5>` or equivalent); dev-only runtime warning for violations

### Features

- [ ] Active indicator pill — animated `rounded-full` pill behind the active icon; scales and fades in on activation using MD3 motion tokens
- [ ] Icon slot — required on each `NavigationBarItem`; accessible name required for icon-only mode
- [ ] Label slot — optional per item; hidden globally via `hideLabels` prop on `NavigationBar`
- [ ] Badge support — optional `badge` prop on `NavigationBarItem`:
  - Dot indicator (no value)
  - Numeric count (shown as-is)
  - Truncated to `"999+"` when value > 999
  - Hidden when numeric value is `0`
- [ ] Disabled destination support
- [ ] Controlled usage — `activeKey` + `onActiveChange` props
- [ ] Uncontrolled usage — `defaultActiveKey` prop
- [ ] Dark mode support via existing token system

### Deliverables

- [ ] `NavigationBar.tsx` — MD3 styled bar container (`'use client'`, `forwardRef`, CVA)
- [ ] `NavigationBarItem.tsx` — styled individual destination item
- [ ] `NavigationBarHeadless.tsx` — React Aria headless primitives (`HeadlessNavigationBar`, `HeadlessNavigationBarItem`)
- [ ] `NavigationBar.variants.ts` — CVA variant definitions
- [ ] `NavigationBar.types.ts` — TypeScript types extending React Aria props
- [ ] `NavigationBar.test.tsx` — unit + accessibility tests (≥ 85% coverage)
- [ ] `NavigationBar.stories.tsx` — Storybook stories for all states, item counts, badge, hideLabels
- [ ] `index.ts` — named exports for all public sub-components, headless, variants, and types

## Architecture

This component follows the established **three-layer architecture** used by all TinyBigUI components:

```
Layer 3 — NavigationBar.tsx / NavigationBarItem.tsx  (MD3 styled, CVA variants, 'use client')
Layer 2 — NavigationBarHeadless.tsx                  (React Aria: useTabList, useTab)
Layer 1 — React Aria                                 (useTabList, useTab, FocusRing)
```

**React Aria hooks:**

- `useTabList` — on the inner `<div role="tablist">` container (manages keyboard navigation: Arrow Left/Right, Home, End, roving `tabIndex`)
- `useTab` — on each `NavigationBarItem` (`role="tab"`, `aria-selected`, `aria-disabled`)
- `role="navigation"` with `aria-label` — on the outer `<nav>` wrapper
- `role="tablist"` — on the inner item container

**CVA variants:** `hideLabels` (`true` | `false`), `itemCount` (`3` | `4` | `5`)

**Token usage (no arbitrary values):**

- Bar surface: `bg-surface-container`
- Active indicator pill: `bg-secondary-container`; active icon: `text-on-secondary-container`
- Inactive icon: `text-on-surface-variant`
- Active label: `text-on-surface`; inactive label: `text-on-surface-variant`
- Bar height: 80dp; icon size: 24dp; indicator pill: 64dp × 32dp
- Elevation: none by default; `shadow-elevation-2` for floating variant (future)
- State layers: `opacity-8` (hover), `opacity-12` (pressed)

## Acceptance Criteria

- [ ] Component enforces 3–5 destination items at the TypeScript type level
- [ ] A dev-only `console.warn` fires at runtime when item count is outside the 3–5 range
- [ ] Active indicator pill animates to the newly selected item using MD3 motion tokens
- [ ] `hideLabels` prop hides labels on all items globally
- [ ] Badge renders correctly for dot, numeric, and `999+` cases; hidden when value is `0`
- [ ] Disabled items are not focusable and cannot be activated
- [ ] Controlled usage works correctly via `activeKey` + `onActiveChange`
- [ ] Uncontrolled usage works correctly via `defaultActiveKey`
- [ ] `role="navigation"` with a descriptive `aria-label` is applied to the outer `<nav>`
- [ ] `role="tablist"` is applied to the inner item container
- [ ] `role="tab"` and `aria-selected` are applied to each destination item
- [ ] `aria-label` is required on icon-only `NavigationBarItem`s (enforced via TypeScript)
- [ ] Full keyboard navigation: Arrow Left/Right cycles destinations, Home/End jump to first/last
- [ ] Component passes `axe` accessibility audit with zero violations
- [ ] Test coverage ≥ 85% (unit + accessibility + keyboard interaction + badge + controlled/uncontrolled tests)
- [ ] Storybook stories cover 3/4/5 item counts, active state, badge (dot/numeric/999+), `hideLabels`, disabled item
- [ ] No hardcoded hex values or arbitrary Tailwind classes
- [ ] ESLint error-free and Prettier-formatted
- [ ] Named exports only; `index.ts` re-exports all public API

## Dependencies

- `v0.1.0` released (Button, IconButton, FAB, TextField, Checkbox, Switch, Radio)
- `@tinybigui/tokens` — existing MD3 token system (`packages/tokens/src/tokens.css`)
- `useRipple` hook (reuse existing `packages/react/src/hooks/useRipple`)

## Out of Scope

- **Navigation Rail** (landscape adaptation) — documented as a future concern; the `NavigationBar` does not implement responsive transformation to a Rail. This is tracked as a separate Phase 5+ item.
- **Floating Navigation Bar** — elevated surface variant; elevation token is noted but not required in this issue
- **Custom animation curves** beyond MD3 motion tokens
- **Route-aware active state** — consumers are responsible for passing `activeKey` based on their router

## Future Considerations

> **Navigation Rail (landscape):** On wider viewports, a Navigation Bar commonly transitions to a Navigation Rail layout (vertical, left-aligned). This is not part of this issue. A separate issue should be created under a future phase to implement `NavigationRail` and a responsive `useNavigationVariant` hook that switches between `NavigationBar` and `NavigationRail` based on viewport width.

## Resources

- [MD3 Navigation Bar Spec](https://m3.material.io/components/navigation-bar/specs)
- [React Aria `useTabList`](https://react-spectrum.adobe.com/react-aria/useTabList.html)
- [React Aria `useTab`](https://react-spectrum.adobe.com/react-aria/useTab.html)
- [TinyBigUI Architecture Rule](.cursor/rules/architecture.mdc)
- [TinyBigUI Code Style Rule](.cursor/rules/code-style.mdc)
- [Existing reference: `Button` component](packages/react/src/components/Button/)
- [Existing reference: `Radio` component](packages/react/src/components/Radio/) (group + item pattern)
- [Related issue: `002-tabs.md`](.github-issues/v0.2.0/002-tabs.md) (shares `useTabList`/`useTab` patterns)

---
title: "feat(appbar): Implement MD3 Top App Bar component"
labels: ["enhancement", "component", "phase-2", "v0.2.0", "accessibility", "good first issue"]
milestone: "v0.2.0"
assignees: []
---

## Summary

Implement the Material Design 3 **Top App Bar** component for `@tinybigui/react` as part of the Phase 2 Navigation milestone. The Top App Bar provides content and actions related to the current screen. It supports four size variants (Small, Center-aligned, Medium, Large), a navigation icon slot, a title, and trailing action icon slots, with scroll-triggered elevation changes.

This component is foundational to Phase 2 — most navigation-heavy layouts will compose the AppBar with Tabs, Drawer, and/or the Navigation Bar delivered in this same milestone.

## Design Reference

- [MD3 Top App Bar — Overview](https://m3.material.io/components/top-app-bar/overview)
- [MD3 Top App Bar — Specs](https://m3.material.io/components/top-app-bar/specs)

## Scope

### Variants

- [ ] `small` — 64dp height, title left-aligned, `title-large` type scale
- [ ] `center-aligned` — 64dp height, title centered, `title-large` type scale
- [ ] `medium` — 112dp height, title bottom-left, `headline-small` type scale
- [ ] `large` — 152dp height, title bottom-left, `display-small` type scale (default: `small`)

### Features

- [ ] Navigation icon slot (leading, optional) — renders an `IconButton`; accessible name required
- [ ] Title slot — accepts a string or React node
- [ ] Trailing action icon slots (up to 3) — each renders an `IconButton`
- [ ] Scroll elevation behavior — flat (`shadow-none`) at rest, elevated (`shadow-elevation-2`) on scroll, with MD3 motion transition
- [ ] Controlled scroll state via `scrolled` prop and `onScrollStateChange` callback
- [ ] Composable API — navigation icon and action icons passed as React nodes (no hardcoded slots)
- [ ] Dark mode support via existing token system

### Deliverables

- [ ] `AppBar.tsx` — MD3 styled layer (`'use client'`, `forwardRef`, CVA)
- [ ] `AppBarHeadless.tsx` — React Aria headless primitive
- [ ] `AppBar.variants.ts` — CVA variant definitions
- [ ] `AppBar.types.ts` — TypeScript types extending React Aria props
- [ ] `AppBar.test.tsx` — unit + accessibility tests (≥ 85% coverage)
- [ ] `AppBar.stories.tsx` — Storybook stories for all variants and states
- [ ] `index.ts` — named exports for styled, headless, variants, and types

## Architecture

This component follows the established **three-layer architecture** used by all TinyBigUI components:

```
Layer 3 — AppBar.tsx          (MD3 styled, CVA variants, 'use client')
Layer 2 — AppBarHeadless.tsx  (React Aria: useButton for icon slots, role="banner")
Layer 1 — React Aria          (useButton, focus management)
```

**React Aria hooks:**

- `useButton` — for the navigation icon button and each trailing action icon button
- `role="banner"` — on the `<header>` container as the ARIA landmark

**CVA variants:** `variant` (`small` | `center-aligned` | `medium` | `large`), `scrolled` (`true` | `false`)

**Token usage (no arbitrary values):**

- Surface: `bg-surface`
- Text: `text-on-surface`, `text-on-surface-variant`
- Elevation: `shadow-elevation-2` (scrolled state)
- State layers: `opacity-8` (hover), `opacity-12` (pressed)

## Acceptance Criteria

- [ ] All four MD3 size variants render correctly with correct height, alignment, and type scale
- [ ] Navigation icon and action icons accept any React node and render as accessible `IconButton`s
- [ ] `aria-label` is required on navigation icon and all action icon buttons (enforced via TypeScript)
- [ ] `role="banner"` is applied to the outer `<header>` container
- [ ] Scroll elevation state is supported in both controlled (`scrolled` prop) and uncontrolled (internal state) modes
- [ ] Elevation transition uses MD3 motion tokens (no hardcoded `transition` values)
- [ ] All interactive elements have visible focus indicators
- [ ] Component passes `axe` accessibility audit with zero violations
- [ ] Test coverage ≥ 85% (unit + accessibility + interaction tests)
- [ ] Storybook stories cover all 4 variants, scrolled state, with and without navigation icon, 1–3 action icons
- [ ] No hardcoded hex values or arbitrary Tailwind classes
- [ ] ESLint error-free and Prettier-formatted
- [ ] Named exports only; `index.ts` re-exports all public API

## Dependencies

- `v0.1.0` released (Button, IconButton, FAB, TextField, Checkbox, Switch, Radio)
- `@tinybigui/tokens` — existing MD3 token system (`packages/tokens/src/tokens.css`)
- `IconButton` component from Phase 1 (reuse for navigation and action icon slots)
- `useRipple` hook (reuse existing `packages/react/src/hooks/useRipple`)

## Out of Scope

- **Bottom App Bar** — separate component, separate issue
- **Search mode** (AppBar transforming into a search field) — Phase 3+
- **Custom color theming** beyond the standard MD3 color roles

## Resources

- [MD3 Top App Bar Spec](https://m3.material.io/components/top-app-bar/specs)
- [React Aria `useButton`](https://react-spectrum.adobe.com/react-aria/useButton.html)
- [TinyBigUI Architecture Rule](.cursor/rules/architecture.mdc)
- [TinyBigUI Code Style Rule](.cursor/rules/code-style.mdc)
- [Existing reference: `Button` component](packages/react/src/components/Button/)
- [Existing reference: `IconButton` component](packages/react/src/components/IconButton/)

---
title: "feat(drawer): Implement MD3 Navigation Drawer component"
labels: ["enhancement", "component", "phase-2", "v0.2.0", "accessibility"]
milestone: "v0.2.0"
assignees: []
---

## Summary

Implement the Material Design 3 **Navigation Drawer** component for `@tinybigui/react` as part of the Phase 2 Navigation milestone. The Navigation Drawer provides access to destinations and app functionality, such as switching accounts. It can appear on the left side of a layout as a permanently visible panel (Standard variant) or as a dismissible overlay (Modal variant). This implementation includes `DrawerItem` and `DrawerSection` sub-components, a scrim overlay for the modal variant, full focus management, and animated entry/exit transitions.

## Design Reference

- [MD3 Navigation Drawer — Overview](https://m3.material.io/components/navigation-drawer/overview)
- [MD3 Navigation Drawer — Specs](https://m3.material.io/components/navigation-drawer/specs)

## Scope

### Variants

- [ ] `standard` — inline `<nav>` landmark, no overlay; supports controlled `open` prop for collapsible layouts
- [ ] `modal` — overlay with scrim backdrop, slide-in animation, focus trap, `Escape` to close

### Sub-components

- [ ] `DrawerItem` — navigation destination row: optional leading icon, label, optional trailing badge or secondary text, active indicator pill
- [ ] `DrawerSection` — groups items with an optional header label and a divider

### Features

- [ ] Active item indicator — pill shape behind active `DrawerItem`, `bg-secondary-container` / `text-on-secondary-container`
- [ ] Scrim backdrop (modal only) — `bg-scrim` at `opacity-32`; clicking scrim closes the drawer
- [ ] Focus trap (modal only) — keyboard focus is contained within the open drawer via `FocusScope`
- [ ] Focus restoration — focus returns to the trigger element when the modal drawer closes
- [ ] `Escape` key closes the modal drawer
- [ ] Slide-in/out animation — `translate-x` driven by MD3 motion tokens
- [ ] `href` support on `DrawerItem` — renders as `<a>` with `useLink`; without `href` renders as `<button>` with `useButton`
- [ ] Disabled `DrawerItem` support
- [ ] Controlled (`open` / `onOpenChange`) and uncontrolled usage
- [ ] Dark mode support via existing token system
- [ ] Token audit — add `--color-scrim` to `packages/tokens/src/tokens.css` if absent

### Deliverables

- [ ] `Drawer.tsx` — MD3 styled layer, both variants (`'use client'`, `forwardRef`, CVA)
- [ ] `DrawerHeadless.tsx` — React Aria headless primitives (`HeadlessDrawer`, `HeadlessDrawerItem`)
- [ ] `DrawerItem.tsx` — styled navigation item sub-component
- [ ] `DrawerSection.tsx` — styled section header + divider sub-component
- [ ] `Drawer.variants.ts` — CVA variant definitions
- [ ] `Drawer.types.ts` — TypeScript types extending React Aria props
- [ ] `Drawer.test.tsx` — unit + accessibility tests (≥ 85% coverage)
- [ ] `Drawer.stories.tsx` — Storybook stories for both variants and all interaction states
- [ ] `index.ts` — named exports for all public sub-components, headless, variants, and types

## Architecture

This component follows the established **three-layer architecture** used by all TinyBigUI components:

```
Layer 3 — Drawer.tsx / DrawerItem.tsx / DrawerSection.tsx  (MD3 styled, CVA variants, 'use client')
Layer 2 — DrawerHeadless.tsx                               (React Aria: useDialog, useOverlay, FocusScope)
Layer 1 — React Aria                                       (useDialog, useOverlay, usePreventScroll, FocusScope, useLink, useButton)
```

**React Aria hooks:**

- `useDialog` — on the modal drawer container (`role="dialog"`, `aria-modal="true"`, `aria-label`)
- `useOverlay` — manages dismiss on click-outside and `Escape` key for modal variant
- `usePreventScroll` — locks body scroll when modal drawer is open
- `FocusScope` — contains focus within the open modal drawer; `restoreFocus` returns focus on close
- `useOverlayTriggerState` (react-stately) — manages `open`/`closed` state
- `useLink` — on `DrawerItem` when `href` is provided
- `useButton` — on `DrawerItem` when no `href` (click-based selection)
- `role="navigation"` — on the outer `<nav>` wrapper for both variants

**CVA variants:** `variant` (`standard` | `modal`), `open` (`true` | `false`)

**Token usage (no arbitrary values):**

- Standard surface: `bg-surface-container-low`
- Modal surface: `bg-surface-container`
- Active indicator: `bg-secondary-container`; active icon/label: `text-on-secondary-container`
- Inactive item: `text-on-surface-variant`
- Scrim: `bg-scrim` `opacity-32` (requires `--color-scrim` in tokens)
- Divider: `border-outline-variant`
- Drawer width: 360dp — map to a Tailwind width utility via `@theme`
- Elevation (modal): `shadow-elevation-1`
- State layers: `opacity-8` (hover), `opacity-12` (pressed)

## Acceptance Criteria

- [ ] Standard variant renders as an inline `<nav>` with no overlay or focus trap
- [ ] Modal variant renders as an overlay dialog with scrim, focus trap, and slide-in animation
- [ ] `role="navigation"` is applied to the outer container in both variants
- [ ] `role="dialog"` and `aria-modal="true"` are applied to the modal drawer panel
- [ ] `aria-label` is required on the drawer (enforced via TypeScript)
- [ ] `Escape` key closes the modal drawer
- [ ] Clicking the scrim closes the modal drawer
- [ ] Focus is trapped inside the open modal drawer
- [ ] Focus returns to the trigger element when the modal drawer closes
- [ ] `aria-current="page"` is applied to the active `DrawerItem`
- [ ] `DrawerItem` renders as `<a>` when `href` is provided, `<button>` otherwise
- [ ] Disabled `DrawerItem` is not focusable and not interactive
- [ ] Slide-in/out animation uses MD3 motion tokens (no hardcoded `transition` values)
- [ ] `--color-scrim` token exists in `packages/tokens/src/tokens.css`; added if missing
- [ ] Component passes `axe` accessibility audit with zero violations
- [ ] Test coverage ≥ 85% (unit + accessibility + interaction + focus management tests)
- [ ] Storybook stories cover both variants, open/close, active item, sections, disabled item, with and without icons
- [ ] No hardcoded hex values or arbitrary Tailwind classes
- [ ] ESLint error-free and Prettier-formatted
- [ ] Named exports only; `index.ts` re-exports all public API

## Dependencies

- `v0.1.0` released (Button, IconButton, FAB, TextField, Checkbox, Switch, Radio)
- `@tinybigui/tokens` — existing MD3 token system (`packages/tokens/src/tokens.css`)
- `useRipple` hook (reuse existing `packages/react/src/hooks/useRipple`)
- `IconButton` component from Phase 1 (optional close button in modal header)

## Out of Scope

- **End-aligned (right-side) drawer** — not a standard MD3 Navigation Drawer pattern
- **Permanently expanded wide drawer** (rail → drawer expansion) — Navigation Rail is a Phase 5+ component
- **Multi-level nested navigation** — not part of MD3 Navigation Drawer spec
- **Swipe-to-open gesture** — touch gesture enhancement, Phase 3+

## Resources

- [MD3 Navigation Drawer Spec](https://m3.material.io/components/navigation-drawer/specs)
- [React Aria `useDialog`](https://react-spectrum.adobe.com/react-aria/useDialog.html)
- [React Aria `useOverlay`](https://react-spectrum.adobe.com/react-aria/useOverlay.html)
- [React Aria `FocusScope`](https://react-spectrum.adobe.com/react-aria/FocusScope.html)
- [React Aria `useLink`](https://react-spectrum.adobe.com/react-aria/useLink.html)
- [TinyBigUI Architecture Rule](.cursor/rules/architecture.mdc)
- [TinyBigUI Code Style Rule](.cursor/rules/code-style.mdc)
- [Existing reference: `Button` component](packages/react/src/components/Button/)
- [Existing reference: `IconButton` component](packages/react/src/components/IconButton/)

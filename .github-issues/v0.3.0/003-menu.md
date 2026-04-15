---
title: "feat(menu): Implement MD3 Menu component"
labels: ["enhancement", "component", "phase-3", "v0.3.0", "accessibility"]
milestone: "v0.3.0"
assignees: []
---

## Summary

Implement the Material Design 3 **Menu** component for `@tinybigui/react` as part of the Phase 3 Feedback milestone. Menus display a list of choices on a temporary surface. They appear when users interact with a button, action, or other control. This implementation covers the Standard menu (flat item list) and Sub-menu (cascading nested items), with full keyboard navigation, type-ahead selection, smart positioning relative to the trigger, optional leading icons and trailing supporting text per item, section dividers, and disabled item support.

## Design Reference

- [MD3 Menus — Overview](https://m3.material.io/components/menus/overview)
- [MD3 Menus — Specs](https://m3.material.io/components/menus/specs)

## Scope

### Variants

- [ ] `standard` — flat list of `MenuItem`s with optional sections and dividers
- [ ] `submenu` — `MenuItem` may have a `children` prop that renders a nested `Menu` on hover/focus; indicated by a trailing chevron icon

### Sub-components

- [ ] `MenuTrigger` — wraps any trigger element (typically a `Button` or `IconButton`); manages open/close state
- [ ] `Menu` — the floating menu surface container; renders a list of items
- [ ] `MenuItem` — individual selectable item: optional leading icon, label, optional trailing supporting text or keyboard shortcut hint, optional sub-menu indicator
- [ ] `MenuSection` — groups `MenuItem`s under an optional header label with a divider

### Features

- [ ] Trigger opens/closes menu on click; `ArrowDown` on the trigger opens the menu and focuses the first item
- [ ] Smart positioning — menu positions itself above or below, left or right of the trigger to stay within the viewport; default: below-start
- [ ] Keyboard navigation — Arrow Up/Down moves focus between items; Home/End jump to first/last; type-ahead jumps to the matching item; `Enter`/`Space` selects the focused item; `Escape` closes and returns focus to the trigger
- [ ] Selection modes — `selectionMode` prop: `none` (no selection state), `single` (one item selected at a time), `multiple` (multiple items selected, with checkmarks)
- [ ] Disabled item support — `isDisabled` on `MenuItem` skips the item during keyboard navigation
- [ ] Sub-menu opens on `ArrowRight` (and closes on `ArrowLeft`) when the focused item has nested items
- [ ] Click outside or `Escape` closes the menu and returns focus to the trigger
- [ ] Dark mode support via existing token system

### Deliverables

- [ ] `Menu.tsx` — MD3 styled menu surface (`'use client'`, `forwardRef`, CVA)
- [ ] `MenuHeadless.tsx` — React Aria headless primitives (`HeadlessMenu`, `HeadlessMenuItem`, `HeadlessMenuTrigger`)
- [ ] `MenuTrigger.tsx` — trigger wrapper managing open/close state
- [ ] `MenuItem.tsx` — styled menu item sub-component
- [ ] `MenuSection.tsx` — styled section header + divider sub-component
- [ ] `Menu.variants.ts` — CVA variant definitions
- [ ] `Menu.types.ts` — TypeScript types extending React Aria props
- [ ] `Menu.test.tsx` — unit + accessibility tests (≥ 85% coverage)
- [ ] `Menu.stories.tsx` — Storybook stories for all variants and interaction states
- [ ] `index.ts` — named exports for all public sub-components, headless, variants, and types

## Architecture

This component follows the established **three-layer architecture** used by all TinyBigUI components:

```
Layer 3 — Menu.tsx / MenuItem.tsx / MenuSection.tsx / MenuTrigger.tsx  (MD3 styled, CVA, 'use client')
Layer 2 — MenuHeadless.tsx                                             (React Aria: useMenu, useMenuItem, useMenuTrigger)
Layer 1 — React Aria                                                   (useMenu, useMenuItem, useMenuTrigger, useTreeState)
```

**React Aria hooks:**

- `useMenuTrigger` — on the trigger element; wires `aria-haspopup="menu"`, `aria-expanded`, and open/close toggling
- `useMenu` — on the `<Menu>` container (`role="menu"`, keyboard navigation, type-ahead)
- `useMenuItem` — on each `<MenuItem>` (`role="menuitem"` / `"menuitemradio"` / `"menuitemcheckbox"` based on `selectionMode`, `aria-disabled`)
- `useMenuTriggerState` (react-stately) — manages `open`/`closed` state
- `useTreeState` (react-stately) — manages `selectedKeys` for `single`/`multiple` selection modes
- `useOverlay` — manages click-outside dismiss and `Escape`
- `useButton` — on the trigger element

**Positioning:** Use CSS absolute positioning anchored to the trigger. Implement a `useMenuPosition` hook that detects viewport overflow and flips the menu (bottom → top, start → end) accordingly. Do not add a third-party positioning library unless it is already in the project's dependencies.

**CVA variants:** `selectionMode` (`none` | `single` | `multiple`)

**Token usage (no arbitrary values):**

- Menu surface: `bg-surface-container`
- Item text: `text-on-surface`
- Icon/supporting text: `text-on-surface-variant`
- Divider: `border-outline-variant`
- Elevation: `shadow-elevation-2`
- Shape: `rounded-xs` → maps to MD3 `shape-corner-extra-small` (4dp)
- Selected item indicator (single/multiple): `bg-secondary-container` / `text-on-secondary-container`
- State layers: `opacity-8` (hover), `opacity-12` (pressed)

## Acceptance Criteria

- [ ] Standard menu opens below the trigger by default; repositions to avoid viewport overflow
- [ ] Sub-menu variant opens nested `Menu` on `ArrowRight` from a parent `MenuItem`; closes on `ArrowLeft` or `Escape`
- [ ] `role="menu"` on the menu container; `role="menuitem"`, `role="menuitemradio"`, or `role="menuitemcheckbox"` on items based on `selectionMode`
- [ ] `aria-haspopup="menu"` and `aria-expanded` are set correctly on the trigger
- [ ] `aria-disabled="true"` on disabled items; disabled items are skipped during keyboard navigation
- [ ] `ArrowDown` on the trigger opens the menu and moves focus to the first non-disabled item
- [ ] Arrow Up/Down cycles through items; wraps at top and bottom
- [ ] Home/End jump to first/last non-disabled item
- [ ] Type-ahead focuses the first item whose label starts with the typed character
- [ ] `Enter` or `Space` selects the focused item and closes the menu (unless sub-menu)
- [ ] `Escape` closes the menu and returns focus to the trigger
- [ ] Click outside the menu closes it and returns focus to the trigger
- [ ] `selectionMode="single"` — only one item selected at a time; selected item shows a checkmark
- [ ] `selectionMode="multiple"` — multiple items selected; each selected item shows a checkmark
- [ ] Ripple effect on each `MenuItem` via `useRipple`
- [ ] Component passes `axe` accessibility audit with zero violations
- [ ] Test coverage ≥ 85% (unit + accessibility + keyboard interaction + positioning tests)
- [ ] Storybook stories cover: standard menu, menu with icons, menu with sections, disabled items, single/multiple selection, sub-menu, long list (scrollable), all open/close interactions
- [ ] No hardcoded hex values or arbitrary Tailwind classes
- [ ] ESLint error-free and Prettier-formatted
- [ ] Named exports only; `index.ts` re-exports all public API

## Dependencies

- `v0.2.0` released (AppBar, Tabs, Drawer, Bottom Navigation)
- `@tinybigui/tokens` — existing MD3 token system (`packages/tokens/src/tokens.css`)
- `Button` and `IconButton` components from Phase 1 (reuse as trigger elements in stories)
- `useRipple` hook (reuse existing `packages/react/src/hooks/useRipple`)

## Out of Scope

- **Context menu (right-click)** — not part of MD3 Menu spec; separate component if needed
- **Select / Dropdown menu** — MD3 specifies this as a separate "Exposed dropdown menu" component; tracked separately
- **Autocomplete** — Phase 5+ component
- **Third-party floating-ui / popper.js dependency** — use a lightweight custom `useMenuPosition` hook to avoid adding a new dependency

## Resources

- [MD3 Menus Spec](https://m3.material.io/components/menus/specs)
- [React Aria `useMenu`](https://react-spectrum.adobe.com/react-aria/useMenu.html)
- [React Aria `useMenuItem`](https://react-spectrum.adobe.com/react-aria/useMenuItem.html)
- [React Aria `useMenuTrigger`](https://react-spectrum.adobe.com/react-aria/useMenuTrigger.html)
- [TinyBigUI Architecture Rule](.cursor/rules/architecture.mdc)
- [TinyBigUI Code Style Rule](.cursor/rules/code-style.mdc)
- [Existing reference: `Button` component](packages/react/src/components/Button/)
- [Existing reference: `IconButton` component](packages/react/src/components/IconButton/)
- [Related v0.2.0 reference: `Drawer` component](.github-issues/v0.2.0/003-drawer.md) (shares overlay dismiss pattern)

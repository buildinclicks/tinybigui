---
title: "feat(dialog): Implement MD3 Dialog component"
labels: ["enhancement", "component", "phase-3", "v0.3.0", "accessibility"]
milestone: "v0.3.0"
assignees: []
---

## Summary

Implement the Material Design 3 **Dialog** component for `@tinybigui/react` as part of the Phase 3 Feedback milestone. Dialogs provide important prompts in a user flow and can communicate information, require decisions, or involve tasks. This implementation supports two structural variants — Basic dialog (with optional icon, title, supporting text, and 1–2 action buttons) and Full-screen dialog (for complex content or tasks that require a dedicated view on mobile) — with a scrim overlay, full focus management, and MD3-compliant animation.

## Design Reference

- [MD3 Dialogs — Overview](https://m3.material.io/components/dialogs/overview)
- [MD3 Dialogs — Specs](https://m3.material.io/components/dialogs/specs)

## Scope

### Variants

- [ ] `basic` — centered overlay with optional icon, title, body text, and up to 2 action buttons; default `role="alertdialog"` when requiring a decision, `role="dialog"` otherwise
- [ ] `full-screen` — occupies the full viewport on mobile; includes a header bar with close icon and confirm action; `role="dialog"`

### Sub-components / Slots

- [ ] `DialogIcon` — optional leading icon above the title (basic variant only)
- [ ] `DialogTitle` — required heading; maps to `aria-labelledby`
- [ ] `DialogContent` — scrollable body area; maps to `aria-describedby`
- [ ] `DialogActions` — container for action buttons (1–2 text/filled buttons)

### Features

- [ ] Scrim backdrop — `bg-scrim` at `opacity-32`; clicking scrim closes dialog (configurable via `closeOnScrimClick` prop)
- [ ] Focus trap — keyboard focus contained within the open dialog via `FocusScope`
- [ ] Focus restoration — focus returns to the trigger element when the dialog closes
- [ ] `Escape` key closes the dialog
- [ ] Body scroll lock — `usePreventScroll` prevents background scrolling when open
- [ ] Entry/exit animation — fade + scale using MD3 motion tokens (`emphasized-decelerate` easing for open, `emphasized-accelerate` for close)
- [ ] Controlled (`open` / `onOpenChange`) and uncontrolled usage
- [ ] Dark mode support via existing token system
- [ ] Token audit — add `--color-scrim` to `packages/tokens/src/tokens.css` if absent (may already be added by Drawer implementation)

### Deliverables

- [ ] `Dialog.tsx` — MD3 styled layer, both variants (`'use client'`, `forwardRef`, CVA)
- [ ] `DialogHeadless.tsx` — React Aria headless primitive (`HeadlessDialog`)
- [ ] `DialogIcon.tsx` — styled icon slot sub-component
- [ ] `DialogTitle.tsx` — styled title sub-component
- [ ] `DialogContent.tsx` — styled scrollable content sub-component
- [ ] `DialogActions.tsx` — styled actions container sub-component
- [ ] `Dialog.variants.ts` — CVA variant definitions
- [ ] `Dialog.types.ts` — TypeScript types extending React Aria props
- [ ] `Dialog.test.tsx` — unit + accessibility tests (≥ 85% coverage)
- [ ] `Dialog.stories.tsx` — Storybook stories for both variants and all interaction states
- [ ] `index.ts` — named exports for all public sub-components, headless, variants, and types

## Architecture

This component follows the established **three-layer architecture** used by all TinyBigUI components:

```
Layer 3 — Dialog.tsx + sub-components        (MD3 styled, CVA variants, 'use client')
Layer 2 — DialogHeadless.tsx                 (React Aria: useDialog, useOverlay, FocusScope)
Layer 1 — React Aria                         (useDialog, useOverlay, usePreventScroll, FocusScope)
```

**React Aria hooks:**

- `useDialog` — on the dialog panel (`role="dialog"` or `role="alertdialog"`, `aria-labelledby`, `aria-describedby`)
- `useOverlay` — manages dismiss on click-outside (`closeOnScrimClick`) and `Escape` key
- `usePreventScroll` — locks body scroll while dialog is open
- `FocusScope` — contains focus within the open dialog; `restoreFocus` prop returns focus on close
- `useOverlayTriggerState` (react-stately) — manages `open`/`closed` state for uncontrolled usage

**CVA variants:** `variant` (`basic` | `full-screen`), `open` (`true` | `false`)

**Token usage (no arbitrary values):**

- Dialog surface: `bg-surface-container-high`
- Text: `text-on-surface` (title), `text-on-surface-variant` (body)
- Scrim: `bg-scrim` `opacity-32`
- Elevation: `shadow-elevation-3`
- Shape: `rounded-[28px]` → maps to MD3 `shape-corner-extra-large` token
- Icon (optional): `text-secondary`
- Action buttons: reuse existing `Button` component (`text` variant)
- State layers: `opacity-8` (hover), `opacity-12` (pressed)

## Acceptance Criteria

- [ ] Basic variant renders with optional icon, title, body, and 1–2 action buttons centered in the viewport
- [ ] Full-screen variant renders occupying the full viewport; includes header bar with close icon and confirm action
- [ ] `role="dialog"` (informational) or `role="alertdialog"` (decision-required) is applied based on a `type` prop
- [ ] `aria-labelledby` wired to `DialogTitle` element
- [ ] `aria-describedby` wired to `DialogContent` element
- [ ] `aria-modal="true"` is set on the dialog panel
- [ ] `Escape` key closes the dialog and restores focus to the trigger
- [ ] Clicking the scrim closes the dialog when `closeOnScrimClick` is `true` (default)
- [ ] Focus is trapped inside the open dialog via `FocusScope`
- [ ] Focus returns to the trigger element when the dialog closes
- [ ] Body scroll is prevented while the dialog is open
- [ ] Entry and exit animations use MD3 motion tokens (no hardcoded `transition` or `animation` values)
- [ ] Controlled usage works via `open` + `onOpenChange` props
- [ ] Uncontrolled usage works via internal state
- [ ] `--color-scrim` token exists in `packages/tokens/src/tokens.css`
- [ ] Component passes `axe` accessibility audit with zero violations
- [ ] Test coverage ≥ 85% (unit + accessibility + interaction + focus management tests)
- [ ] Storybook stories cover both variants, with/without icon, 1 and 2 action buttons, long body content (scrollable), controlled and uncontrolled
- [ ] No hardcoded hex values or arbitrary Tailwind classes
- [ ] ESLint error-free and Prettier-formatted
- [ ] Named exports only; `index.ts` re-exports all public API

## Dependencies

- `v0.2.0` released (AppBar, Tabs, Drawer, Bottom Navigation)
- `@tinybigui/tokens` — existing MD3 token system (`packages/tokens/src/tokens.css`); `--color-scrim` may be added by Drawer in v0.2.0
- `Button` component from Phase 1 (reuse `text` variant for dialog action buttons)
- `IconButton` component from Phase 1 (reuse for full-screen dialog close button)
- `useRipple` hook (reuse existing `packages/react/src/hooks/useRipple`)

## Out of Scope

- **Date picker dialog** — composite component, tracked as Phase 5+
- **Time picker dialog** — composite component, tracked as Phase 5+
- **Alert dialog with destructive action styling** — destructive color variant for action button is a future enhancement
- **Bottom sheet** — a separate MD3 pattern, not part of Dialog spec

## Resources

- [MD3 Dialogs Spec](https://m3.material.io/components/dialogs/specs)
- [React Aria `useDialog`](https://react-spectrum.adobe.com/react-aria/useDialog.html)
- [React Aria `useOverlay`](https://react-spectrum.adobe.com/react-aria/useOverlay.html)
- [React Aria `FocusScope`](https://react-spectrum.adobe.com/react-aria/FocusScope.html)
- [TinyBigUI Architecture Rule](.cursor/rules/architecture.mdc)
- [TinyBigUI Code Style Rule](.cursor/rules/code-style.mdc)
- [Existing reference: `Button` component](packages/react/src/components/Button/)
- [Existing reference: `IconButton` component](packages/react/src/components/IconButton/)
- [Related v0.2.0 reference: `Drawer` component](.github-issues/v0.2.0/003-drawer.md) (shares overlay/focus trap patterns)

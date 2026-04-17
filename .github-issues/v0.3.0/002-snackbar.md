---
title: "feat(snackbar): Implement MD3 Snackbar component"
labels: ["enhancement", "component", "phase-3", "v0.3.0", "accessibility"]
milestone: "v0.3.0"
assignees: []
---

## Summary

Implement the Material Design 3 **Snackbar** component for `@tinybigui/react` as part of the Phase 3 Feedback milestone. Snackbars provide brief messages about app processes at the bottom of the screen. They appear temporarily and do not require user interaction to disappear, though they may optionally include a single action or a close icon. This implementation covers single-line and two-line layouts, auto-dismiss with configurable duration, an optional action button, an optional close icon, queue management (one snackbar visible at a time), and full screen-reader announcement support.

## Design Reference

- [MD3 Snackbar — Overview](https://m3.material.io/components/snackbar/overview)
- [MD3 Snackbar — Specs](https://m3.material.io/components/snackbar/specs)

## Scope

### Variants (layout)

- [ ] `single-line` — message and optional action on the same row
- [ ] `two-line` — message wraps to a second line; action (if present) is stacked below

### Feature Matrix

- [ ] Auto-dismiss — configurable `duration` prop (default: 4000ms); `Infinity` disables auto-dismiss
- [ ] Action button (optional) — `action` prop accepts a label string; clicking fires `onAction` callback and dismisses the snackbar
- [ ] Close icon button (optional) — `showCloseButton` prop renders an `IconButton` (`×`); always accessible regardless of `duration`
- [ ] Queue management — a `SnackbarProvider` (context + `useSnackbar` hook) manages a FIFO queue; only one snackbar is visible at a time; subsequent calls queue and show after the current one dismisses
- [ ] Programmatic API — `useSnackbar()` hook exposes `show(options)` and `dismiss()` for imperative usage
- [ ] Entry/exit animation — slide up from bottom + fade in on open; fade out on close, using MD3 motion tokens
- [ ] Fixed bottom-center positioning (`fixed bottom-4 left-1/2 -translate-x-1/2`)
- [ ] Dark mode support via existing token system
- [ ] Token audit — add `--color-inverse-surface`, `--color-inverse-on-surface`, `--color-inverse-primary` to `packages/tokens/src/tokens.css` if absent

### Deliverables

- [ ] `Snackbar.tsx` — MD3 styled snackbar surface (`'use client'`, `forwardRef`, CVA)
- [ ] `SnackbarHeadless.tsx` — React Aria headless primitive using live region and `useButton` for action
- [ ] `SnackbarProvider.tsx` — context provider that manages the queue and renders a single `Snackbar`
- [ ] `useSnackbar.ts` — hook for imperative `show`/`dismiss` API; consumed by `SnackbarProvider`
- [ ] `Snackbar.variants.ts` — CVA variant definitions
- [ ] `Snackbar.types.ts` — TypeScript types
- [ ] `Snackbar.test.tsx` — unit + accessibility tests (≥ 85% coverage)
- [ ] `Snackbar.stories.tsx` — Storybook stories for all layout/feature combinations
- [ ] `index.ts` — named exports for all public components, provider, hook, variants, and types

## Architecture

This component follows the established **three-layer architecture** used by all TinyBigUI components, with a provider layer added for queue management:

```
Layer 3 — Snackbar.tsx + SnackbarProvider   (MD3 styled, CVA variants, 'use client')
Layer 2 — SnackbarHeadless.tsx              (React Aria: live region, useButton for action)
Layer 1 — React Aria + ARIA live regions    (useButton, role="status", aria-live="polite")
```

**React Aria hooks:**

- `useButton` — for the optional action button and the close icon button
- `role="status"` + `aria-live="polite"` — on the snackbar container so screen readers announce the message without interrupting the user; use `aria-atomic="true"` to announce the full message each time
- `aria-label` — required on the close icon button

**Accessibility note:** React Aria does not have a dedicated `useToast` hook in all versions. If `useToast`/`useToastRegion` are available in the installed version of `react-aria`, prefer them; otherwise compose using `role="status"` + `aria-live="polite"` on a visually persistent but screen-reader-accessible live region container.

**CVA variants:** `layout` (`single-line` | `two-line`), `hasAction` (`true` | `false`), `hasCloseButton` (`true` | `false`)

**Token usage (no arbitrary values):**

- Surface: `bg-inverse-surface`
- Message text: `text-inverse-on-surface`
- Action button text: `text-inverse-primary`
- Close icon: `text-inverse-on-surface`
- Elevation: `shadow-elevation-3`
- Shape: `rounded-xs` → maps to MD3 `shape-corner-extra-small` (4dp)
- State layers on action/close: `opacity-8` (hover), `opacity-12` (pressed)

## Acceptance Criteria

- [ ] Single-line and two-line layouts render correctly per MD3 specs
- [ ] Message is announced by screen readers via `role="status"` + `aria-live="polite"` + `aria-atomic="true"` (or `useToastRegion` if available)
- [ ] Auto-dismiss fires after `duration` ms and calls `onDismiss`; `Infinity` disables auto-dismiss
- [ ] Hovering or focusing the snackbar (action button or close button) pauses the auto-dismiss timer; timer resumes on blur/mouse-leave
- [ ] Action button fires `onAction` and dismisses the snackbar when clicked
- [ ] Close icon button dismisses the snackbar when clicked or activated via keyboard; `aria-label` is present
- [ ] `SnackbarProvider` queues multiple calls to `show()` and displays them one at a time
- [ ] `useSnackbar()` hook is usable outside the component tree (throws a clear error when used without `SnackbarProvider`)
- [ ] Entry animation uses MD3 motion tokens (slide up + fade in); exit animation uses MD3 motion tokens (fade out)
- [ ] `--color-inverse-surface`, `--color-inverse-on-surface`, `--color-inverse-primary` tokens exist in `packages/tokens/src/tokens.css`
- [ ] Component passes `axe` accessibility audit with zero violations
- [ ] Test coverage ≥ 85% (unit + accessibility + timer + queue tests)
- [ ] Storybook stories cover: single-line, two-line, with action, with close button, with both, auto-dismiss, persistent, queue demo
- [ ] No hardcoded hex values or arbitrary Tailwind classes
- [ ] ESLint error-free and Prettier-formatted
- [ ] Named exports only; `index.ts` re-exports all public API

## Dependencies

- `v0.2.0` released (AppBar, Tabs, Drawer, Bottom Navigation)
- `@tinybigui/tokens` — existing MD3 token system; inverse surface tokens must be added if absent
- `IconButton` component from Phase 1 (reuse for the close icon button)
- `Button` component from Phase 1 (action button inherits text style; may be styled inline for inverse surface)
- `useRipple` hook (reuse existing `packages/react/src/hooks/useRipple`)

## Out of Scope

- **Toast stacking** — showing multiple snackbars simultaneously is not part of MD3 Snackbar spec; queue (FIFO) is used instead
- **Persistent snackbar without a close button** — MD3 strongly discourages indefinite auto-dismiss without a close affordance; if `duration` is `Infinity`, `showCloseButton` must be `true` (enforce via TypeScript and a dev-mode warning)
- **Rich content snackbars** (images, custom components in body) — future enhancement
- **Top-positioned snackbar** — MD3 specifies bottom positioning; top is out of scope

## Resources

- [MD3 Snackbar Spec](https://m3.material.io/components/snackbar/specs)
- [React Aria `useButton`](https://react-spectrum.adobe.com/react-aria/useButton.html)
- [MDN ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)
- [TinyBigUI Architecture Rule](.cursor/rules/architecture.mdc)
- [TinyBigUI Code Style Rule](.cursor/rules/code-style.mdc)
- [Existing reference: `Button` component](packages/react/src/components/Button/)
- [Existing reference: `IconButton` component](packages/react/src/components/IconButton/)

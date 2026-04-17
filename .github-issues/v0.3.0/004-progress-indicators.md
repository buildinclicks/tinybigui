---
title: "feat(progress): Implement MD3 Progress Indicator components"
labels: ["enhancement", "component", "phase-3", "v0.3.0", "accessibility"]
milestone: "v0.3.0"
assignees: []
---

## Summary

Implement the Material Design 3 **Progress Indicator** components for `@tinybigui/react` as part of the Phase 3 Feedback milestone. Progress indicators inform users about the status of ongoing processes such as loading an app, submitting a form, or saving updates. This implementation covers two component shapes — **Linear** (a horizontal bar) and **Circular** (an SVG ring) — each with two modes: **determinate** (known percentage) and **indeterminate** (unknown duration). Both components are accessible via `role="progressbar"` and React Aria's `useProgressBar`, and use MD3 motion tokens for their indeterminate animations.

## Design Reference

- [MD3 Progress Indicators — Overview](https://m3.material.io/components/progress-indicators/overview)
- [MD3 Progress Indicators — Specs](https://m3.material.io/components/progress-indicators/specs)

## Scope

### Components

- [ ] `LinearProgress` — horizontal track + indicator bar
- [ ] `CircularProgress` — SVG ring with animated stroke

### Modes (both components)

- [ ] `determinate` — `value` prop (0–`maxValue`) drives the indicator width/stroke-dashoffset; `aria-valuenow` is set
- [ ] `indeterminate` — no `value` prop; continuous CSS animation using MD3 motion tokens; `aria-valuenow` is omitted per ARIA spec

### Features

- [ ] `value` prop — current progress value (0 to `maxValue`)
- [ ] `maxValue` prop — maximum value (default: `100`)
- [ ] `minValue` prop — minimum value (default: `0`)
- [ ] `aria-label` prop — required accessible name (enforced via TypeScript)
- [ ] `aria-labelledby` prop — alternative to `aria-label` when a visible label exists
- [ ] `aria-valuetext` prop — optional human-readable progress description (e.g., "Step 3 of 5")
- [ ] `size` prop on `CircularProgress` — `small` (24dp) / `medium` (48dp, default) / `large` (72dp)
- [ ] `fourColor` prop on `CircularProgress` — enables MD3 four-color indeterminate animation variant
- [ ] `trackVisibility` prop on `LinearProgress` — `visible` (shows track, default) / `hidden` (indicator only)
- [ ] Dark mode support via existing token system

### Deliverables

- [ ] `LinearProgress.tsx` — MD3 styled linear bar (`'use client'`, `forwardRef`, CVA)
- [ ] `LinearProgressHeadless.tsx` — React Aria headless primitive
- [ ] `CircularProgress.tsx` — MD3 styled SVG ring (`'use client'`, `forwardRef`, CVA)
- [ ] `CircularProgressHeadless.tsx` — React Aria headless primitive
- [ ] `Progress.variants.ts` — shared CVA variant definitions for both components
- [ ] `Progress.types.ts` — shared TypeScript types extending React Aria `AriaProgressBarProps`
- [ ] `Progress.test.tsx` — unit + accessibility tests for both components (≥ 85% coverage)
- [ ] `Progress.stories.tsx` — Storybook stories for all variants, modes, and sizes
- [ ] `index.ts` — named exports for both components, headless, variants, and types

## Architecture

This component follows the established **three-layer architecture** used by all TinyBigUI components:

```
Layer 3 — LinearProgress.tsx / CircularProgress.tsx    (MD3 styled, CVA variants, 'use client')
Layer 2 — LinearProgressHeadless / CircularProgressHeadless  (React Aria: useProgressBar)
Layer 1 — React Aria                                   (useProgressBar)
```

**React Aria hooks:**

- `useProgressBar` — wires `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`, `aria-label`/`aria-labelledby` on the container element; automatically omits `aria-valuenow` when `value` is not provided (indeterminate)

**LinearProgress DOM structure:**

```
<div role="progressbar" aria-valuemin aria-valuemax [aria-valuenow]>
  <div class="track">           ← full-width background
    <div class="indicator" />   ← animated/sized foreground bar
  </div>
</div>
```

**CircularProgress DOM structure:**

```
<div role="progressbar" aria-valuemin aria-valuemax [aria-valuenow]>
  <svg viewBox="...">
    <circle class="track" />      ← background ring
    <circle class="indicator" />  ← stroke-dashoffset-animated foreground
  </svg>
</div>
```

**CVA variants (LinearProgress):** `mode` (`determinate` | `indeterminate`), `trackVisibility` (`visible` | `hidden`)

**CVA variants (CircularProgress):** `mode` (`determinate` | `indeterminate`), `size` (`small` | `medium` | `large`), `fourColor` (`true` | `false`)

**Token usage (no arbitrary values):**

- Track: `bg-surface-container-highest` (Linear), SVG `stroke` mapped from `--color-surface-container-highest` (Circular)
- Indicator: `bg-primary` (Linear), SVG `stroke` mapped from `--color-primary` (Circular)
- Four-color variant cycles: `primary`, `secondary`, `tertiary`, `error` strokes via CSS custom property animation
- Indeterminate animation duration and easing: `--md-sys-motion-duration-long2` (500ms), `--md-sys-motion-easing-emphasized`
- No hardcoded hex values in inline SVG stroke attributes; use `currentColor` with a Tailwind `text-primary` wrapper or CSS custom properties

**SVG implementation note:** The `stroke-dasharray` and `stroke-dashoffset` for the determinate circular indicator must be computed from the circle's circumference (`2πr`). Expose `radius` as a constant derived from the `size` variant, not as an arbitrary inline value. The indeterminate animation is a CSS `@keyframes` animation defined in `tokens.css` or within the component's Tailwind layer.

## Acceptance Criteria

- [ ] `LinearProgress` renders a horizontal track with a foreground indicator bar
- [ ] `CircularProgress` renders an SVG ring with a foreground stroke indicator
- [ ] Determinate mode: `aria-valuenow` reflects the current `value`; indicator width/stroke-dashoffset updates smoothly via CSS transition using MD3 motion tokens
- [ ] Indeterminate mode: `aria-valuenow` is omitted per ARIA spec; continuous animation plays using MD3 motion tokens; no inline `animation` or `transition` values
- [ ] `aria-valuemin` and `aria-valuemax` always reflect `minValue` and `maxValue`
- [ ] `aria-label` or `aria-labelledby` is required (TypeScript enforcement + dev-mode warning if absent)
- [ ] `aria-valuetext` is passed through when provided
- [ ] `CircularProgress` renders correctly at all three sizes (`small`, `medium`, `large`)
- [ ] `fourColor` prop cycles through `primary`, `secondary`, `tertiary`, `error` strokes during indeterminate animation
- [ ] `trackVisibility="hidden"` on `LinearProgress` hides the track background while keeping the indicator
- [ ] Both components pass `axe` accessibility audit with zero violations
- [ ] Test coverage ≥ 85% (unit + accessibility + determinate value update tests)
- [ ] Storybook stories cover: Linear determinate (animated value change), Linear indeterminate, Circular determinate, Circular indeterminate, Circular four-color, all three sizes, hidden track
- [ ] No hardcoded hex values, no arbitrary Tailwind classes, no inline `style` attribute for colors
- [ ] SVG stroke uses `currentColor` or CSS custom properties — not inline hex
- [ ] ESLint error-free and Prettier-formatted
- [ ] Named exports only; `index.ts` re-exports all public API

## Dependencies

- `v0.2.0` released (AppBar, Tabs, Drawer, Bottom Navigation)
- `@tinybigui/tokens` — existing MD3 token system (`packages/tokens/src/tokens.css`); indeterminate `@keyframes` animations may need to be added
- No Phase 1 component dependencies (Progress Indicators are self-contained)

## Out of Scope

- **Skeleton loaders / shimmer effects** — a distinct pattern from Progress Indicators; tracked as a separate future component
- **Buffer state for LinearProgress** — MD3 specifies a buffered variant (two-layer track); not included in the initial implementation
- **Segmented progress** — step-based progress display; future enhancement
- **Native `<progress>` element** — use a `<div role="progressbar">` for full styling control per MD3 spec; the native element has limited cross-browser styling support

## Future Considerations

> **LinearProgress buffer variant:** MD3 defines a "buffer" state for `LinearProgress` showing a filled buffer region and a separate indicator. This is documented here for awareness and should be tracked as a follow-up enhancement issue once the base `LinearProgress` is shipped.

## Resources

- [MD3 Progress Indicators Spec](https://m3.material.io/components/progress-indicators/specs)
- [React Aria `useProgressBar`](https://react-spectrum.adobe.com/react-aria/useProgressBar.html)
- [ARIA progressbar role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/progressbar_role)
- [TinyBigUI Architecture Rule](.cursor/rules/architecture.mdc)
- [TinyBigUI Code Style Rule](.cursor/rules/code-style.mdc)
- [Existing reference: `Button` component](packages/react/src/components/Button/) (three-layer pattern)
- [Existing reference: `Checkbox` component](packages/react/src/components/Checkbox/) (SVG + React Aria state pattern)

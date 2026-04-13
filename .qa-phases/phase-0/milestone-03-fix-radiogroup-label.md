# Milestone 3: Fix RadioGroup Label Bug

> **Status:** Not Started
> **Priority:** High
> **Depends On:** None (can start immediately, parallel with M1, M2, M4)
> **Estimated Effort:** S (< 1 day)

---

## Objective

Eliminate duplicate label rendering in `RadioGroup`, ensuring the group label appears exactly once in the DOM and is correctly associated with the radio group via React Aria's `labelProps`.

---

## Context

The `RadioGroup` component uses a three-layer architecture where:

- `RadioGroupHeadless.tsx` uses `useRadioGroup` from React Aria, which returns `labelProps` (an object containing `id` and other attributes to apply to the `<span>` or element that serves as the label)
- `RadioGroup.tsx` (Layer 3) renders a styled label block using `props.label`

The concern is that **both** layers may be rendering `props.label` independently — the headless layer via `labelProps`, and the styled layer adding its own visual label element. This can cause the group label to appear twice in the visible UI and/or create redundant ARIA structure.

Correct behavior: the label is rendered **once**, in the styled layer, using `labelProps` from React Aria to associate it semantically with the group.

---

## Tasks

### Phase 1 — Audit

- [ ] **3.1 — Audit `RadioGroupHeadless.tsx`**
  - File: `packages/react/src/components/Radio/RadioGroupHeadless.tsx`
  - Answer: Does it render `props.label` directly into its JSX, or only pass `labelProps` through?
  - Document the full render output: what elements are rendered, what props are applied where

- [ ] **3.2 — Audit `RadioGroup.tsx`**
  - File: `packages/react/src/components/Radio/RadioGroup.tsx`
  - Answer: Does it render a separate styled label element using `props.label`?
  - Document how it composes `RadioGroupHeadless` — does it pass children that include a label?

- [ ] **3.3 — Reproduce the issue**
  - Write a test or open Storybook to inspect the DOM
  - Check: does the rendered HTML contain `props.label` text in more than one element?
  - Use browser DevTools or RTL's `getByText` to count label instances

### Phase 2 — TDD: Write Test First

- [ ] **3.4 — Write a failing test asserting single label occurrence**
  - File: `packages/react/src/components/Radio/Radio.test.tsx`
  - Test: render `<RadioGroup label="Favorite Color">` and assert `getByText('Favorite Color')` returns exactly one element (not multiple)
  - Test: assert the label element has the correct `id` attribute matching the `aria-labelledby` on the `<div role="radiogroup">`
  - Run `pnpm test` — the test should fail if the bug exists (RED phase)

### Phase 3 — Fix

- [ ] **3.5 — Decide on label ownership**
  - The label should be rendered **once**, in Layer 3 (`RadioGroup.tsx`)
  - `RadioGroupHeadless` should expose `labelProps` (from `useRadioGroup`) for Layer 3 to apply to its own label element
  - `RadioGroupHeadless` should NOT render `props.label` as its own visible element

- [ ] **3.6 — Fix `RadioGroupHeadless.tsx` if it renders label directly**
  - Remove any direct rendering of `props.label` from the headless layer
  - Ensure `labelProps` is exposed to consumers (e.g., via a render slot or `children` pattern)
  - If using a wrapper approach, expose `labelProps` as a returned value or passed slot prop

- [ ] **3.7 — Fix `RadioGroup.tsx` to apply `labelProps`**
  - The styled label element must receive the `labelProps` from React Aria (contains `id` for `aria-labelledby` association)
  - Example: `<span {...labelProps} className={radioGroupLabelVariants(...)}>` where `labelProps` comes from `RadioGroupHeadless`
  - Follow how `CheckboxHeadless` exposes React Aria props to its styled wrapper for reference

- [ ] **3.8 — Run tests to GREEN**
  - Run `pnpm test` — single-label assertion and all existing tests must pass

### Phase 4 — Storybook Verification

- [ ] **3.9 — Verify in Storybook**
  - File: `packages/react/src/components/Radio/Radio.stories.tsx`
  - Visually confirm the label renders once in all RadioGroup stories
  - Use browser Accessibility tree inspector to confirm `aria-labelledby` association is correct

- [ ] **3.10 — Run quality gate**
  - `pnpm lint` — zero errors
  - `pnpm typecheck` — zero errors
  - `pnpm test` — all tests green
  - `pnpm build` — succeeds

---

## Acceptance Criteria

- [ ] `props.label` text appears exactly once in the rendered DOM for a `RadioGroup`
- [ ] The label element has an `id` attribute that matches the `aria-labelledby` on the radio group container
- [ ] React Aria's `labelProps` is correctly applied to the visible label element
- [ ] axe accessibility test for RadioGroup passes with no violations
- [ ] All existing Radio/RadioGroup tests pass
- [ ] New label-uniqueness test passes

---

## Files to Change

| File                                                         | Change                                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------- |
| `packages/react/src/components/Radio/RadioGroupHeadless.tsx` | Remove direct label rendering if present; expose `labelProps` |
| `packages/react/src/components/Radio/RadioGroup.tsx`         | Apply `labelProps` to the styled label element                |
| `packages/react/src/components/Radio/Radio.test.tsx`         | Add label-uniqueness and ARIA association tests               |

## Files to Read First

| File                                                          | Why                                                         |
| ------------------------------------------------------------- | ----------------------------------------------------------- |
| `packages/react/src/components/Radio/RadioGroupHeadless.tsx`  | Understand current label handling                           |
| `packages/react/src/components/Radio/RadioGroup.tsx`          | Understand current styled label rendering                   |
| `packages/react/src/components/Checkbox/CheckboxHeadless.tsx` | Reference for correct headless prop exposure pattern        |
| `packages/react/src/components/Checkbox/Checkbox.tsx`         | Reference for correct styled wrapper consuming `labelProps` |

---

## Cursor Rules Reference

- [`architecture.mdc`](.cursor/rules/architecture.mdc): Three-layer rule — React Aria props (`labelProps`) must flow from Layer 1 → Layer 2 → Layer 3
- [`testing.mdc`](.cursor/rules/testing.mdc): TDD — write the failing test first; include axe accessibility check
- [`md3-design.mdc`](.cursor/rules/md3-design.mdc): Accessibility — `aria-labelledby` association is required for radio groups per WCAG 2.1 AA

---

## Notes

- If `RadioGroupHeadless` uses a children-based composition pattern, the fix may be as simple as removing a redundant label render in it, rather than restructuring the API
- The `labelProps` from React Aria's `useRadioGroup` generates a unique `id` per group instance — this is what powers `aria-labelledby` on the group container. Failing to use it breaks screen reader announcement of the group name
- After fixing, verify with a screen reader (VoiceOver on macOS) that the group label is announced correctly when the first radio receives focus
- Branch name suggestion: `fix/radiogroup-duplicate-label`
- Commit messages:
  - `test(radio): add failing test for single label rendering in RadioGroup`
  - `fix(radio): remove duplicate label rendering from RadioGroupHeadless`
  - `fix(radio): apply React Aria labelProps to RadioGroup styled label`

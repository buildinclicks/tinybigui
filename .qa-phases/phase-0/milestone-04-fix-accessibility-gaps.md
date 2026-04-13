# Milestone 4: Fix Accessibility Gaps

> **Status:** Not Started
> **Priority:** High
> **Depends On:** None (can start immediately, parallel with M1, M2, M3)
> **Estimated Effort:** S (< 1 day)

---

## Objective

Close all known accessibility inconsistencies across components, ensuring every component meets WCAG 2.1 AA compliance and that a11y patterns are applied uniformly.

---

## Context

A full accessibility audit surfaced the following known issues:

1. **FAB spinner SVG missing `aria-label`** — When `FAB` is in a loading state, it renders a spinner SVG. `Button.tsx` sets `aria-label="Loading"` on its spinner SVG, but `FAB.tsx` does not. Screen readers would receive no announcement about the loading state.

2. **Inline styles in Checkbox SVG** — The Checkbox component uses `style={{ fill: "var(--color-on-primary)" }}` on SVG path elements. While CSS variables are acceptable (not arbitrary hex), the code-style rule forbids inline styles. This should use a Tailwind class or CSS approach instead.

3. **No axe test coverage audit** — It has not been systematically verified that all seven components have passing `axe` accessibility checks. This milestone closes that gap.

---

## Tasks

### Task Group A — FAB Spinner Accessibility

- [ ] **4.1 — Add `aria-label` to FAB spinner SVG**
  - File: `packages/react/src/components/FAB/FAB.tsx`
  - Locate the spinner `<svg>` rendered in the loading state
  - Add `aria-label="Loading"` to match `Button.tsx`'s pattern exactly
  - Also add `role="img"` if not already present (per WAI SVG guidance)

- [ ] **4.2 — Write a test for FAB loading state accessibility**
  - File: `packages/react/src/components/FAB/FAB.test.tsx`
  - Test: render `<FAB isLoading>` and assert `getByRole('img', { name: 'Loading' })` exists
  - Test: assert spinner is present and button label is still accessible
  - Run `pnpm test` — should be RED first, then GREEN after 4.1

### Task Group B — Checkbox Inline Style Replacement

- [ ] **4.3 — Audit Checkbox SVG inline styles**
  - File: `packages/react/src/components/Checkbox/Checkbox.tsx`
  - Identify all `style={{ ... }}` usages on SVG path/rect/circle elements
  - Determine if the fill value (`var(--color-on-primary)`) can be expressed as a Tailwind class (e.g., `fill-on-primary` if the token is mapped in `@theme`)

- [ ] **4.4 — Replace inline SVG styles with Tailwind classes or CSS**
  - Check `packages/tokens/src/tokens.css` — confirm if `--color-on-primary` is mapped to a `@theme` fill utility
  - If a Tailwind fill utility exists (e.g., `fill-on-primary`): replace `style={{ fill: ... }}` with the class
  - If no fill utility: add the mapping to `tokens.css` `@theme` block, then use the class
  - Ensure SVG visual appearance does not change

- [ ] **4.5 — Run tests to confirm no visual regression in Checkbox**
  - `pnpm test` — all Checkbox tests must still pass
  - Verify in Storybook that the checkmark SVG renders correctly in all states

### Task Group C — Full Axe Audit

- [ ] **4.6 — Verify axe tests exist for all seven components**
  - Check each test file for an `axe` import and a "has no violations" test case:
    - `Button.test.tsx` — confirm present
    - `IconButton.test.tsx` — confirm present
    - `FAB.test.tsx` — confirm present (add if missing)
    - `TextField.test.tsx` — confirm present (add if missing)
    - `Checkbox.test.tsx` — confirm present
    - `Switch.test.tsx` — confirm present
    - `Radio.test.tsx` — confirm present

- [ ] **4.7 — Add missing axe tests**
  - For any component test file lacking a `toHaveNoViolations()` assertion, add one following the project's testing pattern:
    ```typescript
    it('has no accessibility violations', async () => {
      const { container } = render(<Component />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
    ```
  - Use `packages/react/test/helpers.tsx` for the `axe` import pattern

- [ ] **4.8 — Run all component axe tests and fix any failures**
  - Run `pnpm test` — any axe violations must be resolved
  - Document any axe violations found and fixed

- [ ] **4.9 — Run full quality gate**
  - `pnpm lint` — zero errors
  - `pnpm typecheck` — zero errors
  - `pnpm test` — all tests green
  - `pnpm build` — both packages succeed

---

## Acceptance Criteria

- [ ] FAB spinner in loading state has `aria-label="Loading"` matching the Button pattern
- [ ] No inline `style` attributes on SVG elements in Checkbox (or any component)
- [ ] All seven components have at least one axe `toHaveNoViolations()` test
- [ ] All axe tests pass with no violations reported
- [ ] No TypeScript errors introduced
- [ ] All existing tests continue to pass

---

## Files to Change

| File                                                  | Change                                              |
| ----------------------------------------------------- | --------------------------------------------------- |
| `packages/react/src/components/FAB/FAB.tsx`           | Add `aria-label="Loading"` to spinner SVG           |
| `packages/react/src/components/FAB/FAB.test.tsx`      | Add loading-state a11y test                         |
| `packages/react/src/components/Checkbox/Checkbox.tsx` | Replace SVG inline styles with Tailwind classes     |
| Any component test file missing axe test              | Add `toHaveNoViolations()` test                     |
| `packages/tokens/src/tokens.css`                      | Add fill utility to `@theme` if needed for Checkbox |

## Files to Read First

| File                                                  | Why                                              |
| ----------------------------------------------------- | ------------------------------------------------ |
| `packages/react/src/components/FAB/FAB.tsx`           | Find the spinner and its current attributes      |
| `packages/react/src/components/Button/Button.tsx`     | Reference — correct spinner `aria-label` pattern |
| `packages/react/src/components/Checkbox/Checkbox.tsx` | Find inline SVG styles                           |
| `packages/tokens/src/tokens.css`                      | Check if `fill-*` utilities exist in `@theme`    |
| `packages/react/test/helpers.tsx`                     | Understand axe import/usage pattern              |

---

## Cursor Rules Reference

- [`md3-design.mdc`](.cursor/rules/md3-design.mdc): WCAG 2.1 AA compliance — accessible labels for all interactive elements, axe audit required
- [`code-style.mdc`](.cursor/rules/code-style.mdc): No inline styles — `style={{ }}` is forbidden, use Tailwind classes
- [`testing.mdc`](.cursor/rules/testing.mdc): TDD — write failing axe test before making the fix; all components need accessibility tests

---

## Notes

- The `aria-label` on SVG spinners is important: when the button text is visually replaced by a spinner, screen readers would otherwise announce nothing or the button's role but no state description
- The inline style concern in Checkbox uses `var(--color-on-primary)` which is fine semantically; the issue is purely about following the no-inline-styles code style rule
- If any new axe violations are found beyond the known issues listed here, document them in this milestone file and either fix them here or create a follow-up ticket before closing M4
- Branch name suggestion: `fix/accessibility-gaps`
- Commit messages:
  - `fix(fab): add aria-label to loading spinner svg`
  - `fix(checkbox): replace inline svg styles with tailwind classes`
  - `test(components): add missing axe accessibility tests`

# Milestone 2: Fix TextField Architecture

> **Status:** Not Started
> **Priority:** Critical
> **Depends On:** None (can start immediately, parallel with M1, M3, M4)
> **Estimated Effort:** M (1–2 days)

---

## Objective

Refactor the styled `TextField` component to properly compose `TextFieldHeadless`, aligning it with the mandatory three-layer architecture used by every other component in the library.

---

## Context

Every component in TinyBigUI follows a strict three-layer architecture:

1. **Layer 1 (React Aria):** accessibility primitives (`useTextField`, `useButton`, etc.)
2. **Layer 2 (Headless):** `TextFieldHeadless.tsx` — behavior without styling
3. **Layer 3 (Styled):** `TextField.tsx` — wraps headless, applies CVA variants

`TextFieldHeadless.tsx` correctly uses React Aria's `useTextField`. However, the styled `TextField.tsx` bypasses `TextFieldHeadless` entirely — it imports only `useFocusRing` and wires up `<input>`/`<textarea>` manually. This violates the architecture rule in `.cursor/rules/architecture.mdc` and may introduce accessibility gaps since `useTextField` provides more semantic wiring than `useFocusRing` alone.

Additionally, there is a controlled-value sync anti-pattern: the component appears to set state during the render phase (`value !== currentValue` → `setCurrentValue`), which is a React footgun causing potential infinite render loops.

**Approach:** Following the TDD rule (`.cursor/rules/testing.mdc`), tests must be updated/written first to capture expected behavior, then the component refactored to pass them.

---

## Tasks

### Phase 1 — Understand Current State

- [ ] **2.1 — Audit `TextField.tsx` (Layer 3)**
  - File: `packages/react/src/components/TextField/TextField.tsx`
  - Document: which React Aria hooks are used, how `<input>`/`<textarea>` are wired, how controlled/uncontrolled value is managed
  - Identify the exact controlled-value sync anti-pattern location

- [ ] **2.2 — Audit `TextFieldHeadless.tsx` (Layer 2)**
  - File: `packages/react/src/components/TextField/TextFieldHeadless.tsx`
  - Document: which React Aria hooks are used (`useTextField`, `useFocusRing`, etc.), what props it accepts, what it renders
  - Verify it is consistent with the `ButtonHeadless` / `CheckboxHeadless` pattern

- [ ] **2.3 — Audit `TextField.types.ts`**
  - File: `packages/react/src/components/TextField/TextField.types.ts`
  - Confirm that `TextFieldProps` extends an appropriate React Aria type (e.g., `AriaTextFieldProps`)
  - Note any props that are in the styled type but not passed through to the headless layer

- [ ] **2.4 — Audit existing tests**
  - File: `packages/react/src/components/TextField/TextField.test.tsx`
  - Document what is currently tested and identify gaps (especially controlled/uncontrolled, React Aria `useTextField` wiring, `labelProps`, `inputProps` usage)

### Phase 2 — TDD: Update Tests First

- [ ] **2.5 — Write failing tests for correct architecture**
  - File: `packages/react/src/components/TextField/TextField.test.tsx`
  - Add tests for:
    - Correct ARIA `role` and `labelProps` are applied (from `useTextField`, not manual)
    - `inputProps` from `useTextField` applied to the `<input>` element
    - Controlled value prop does not cause infinite re-render
    - Uncontrolled value works with `defaultValue`
    - `onChange` callback fires with correct value
    - Runs `axe` accessibility check — no violations
  - Run `pnpm test` — new tests should fail (RED phase)

### Phase 3 — Implement Fix

- [ ] **2.6 — Refactor `TextField.tsx` to wrap `TextFieldHeadless`**
  - Remove direct `useFocusRing` import from the styled layer
  - Replace manual `<input>`/`<textarea>` wiring with `<TextFieldHeadless>` composition
  - Follow the pattern established by `Checkbox.tsx` wrapping `CheckboxHeadless`:
    ```
    TextField (Layer 3) → TextFieldHeadless (Layer 2) → useTextField (Layer 1)
    ```
  - Preserve all visual/variant logic (CVA, floating label, character count, helper text)

- [ ] **2.7 — Fix controlled-value sync anti-pattern**
  - Remove any state update that happens during the render function body
  - Use proper React controlled/uncontrolled patterns:
    - Uncontrolled: use `defaultValue`, let `useTextField` manage internal state
    - Controlled: accept `value` + `onChange` props, pass to `useTextField`
  - Verify no `useEffect` is needed (React Aria handles this)

- [ ] **2.8 — Run tests to GREEN**
  - Run `pnpm test` — all tests including new ones must pass
  - Achieve >90% code coverage for the component (per `testing.mdc`)

### Phase 4 — Storybook Verification

- [ ] **2.9 — Verify Storybook stories still render correctly**
  - File: `packages/react/src/components/TextField/TextField.stories.tsx`
  - Start Storybook (`pnpm dev:storybook`) and verify:
    - Filled and outlined variants render correctly
    - Floating label animates correctly on focus/blur
    - Error state displays helper text
    - Character count renders
    - Disabled state is non-interactive
    - Multiline (textarea) variant works

- [ ] **2.10 — Run full quality gate**
  - `pnpm lint` — zero errors
  - `pnpm typecheck` — zero errors
  - `pnpm test` — all tests green
  - `pnpm build` — both packages build successfully

---

## Acceptance Criteria

- [ ] `TextField.tsx` imports and renders `TextFieldHeadless` internally (no direct `useTextField` call in Layer 3)
- [ ] `TextFieldHeadless.tsx` is the sole layer using React Aria's `useTextField`
- [ ] No state updates during render phase (no anti-pattern)
- [ ] Controlled `value` + `onChange` pattern works without re-render issues
- [ ] Uncontrolled `defaultValue` pattern works
- [ ] axe accessibility test passes with no violations
- [ ] All existing TextField tests pass (no regression)
- [ ] New architecture-compliance tests pass
- [ ] Storybook stories render without errors

---

## Architecture Reference

The correct pattern (matching Checkbox/Switch/Radio):

```
TextField.tsx (Layer 3: Styled)
  └── renders <TextFieldHeadless>
        └── uses useTextField() from React Aria (Layer 1)
```

Contrast with the incorrect current state:

```
TextField.tsx (Layer 3: Styled)      ← calls useFocusRing directly
  └── renders <input> manually       ← bypasses TextFieldHeadless entirely
TextFieldHeadless.tsx (orphaned)     ← unused by Layer 3
```

---

## Files to Change

| File                                                         | Change                               |
| ------------------------------------------------------------ | ------------------------------------ |
| `packages/react/src/components/TextField/TextField.tsx`      | Refactor to wrap `TextFieldHeadless` |
| `packages/react/src/components/TextField/TextField.test.tsx` | Add architecture/accessibility tests |

## Files to Read First

| File                                                            | Why                                                         |
| --------------------------------------------------------------- | ----------------------------------------------------------- |
| `packages/react/src/components/TextField/TextField.tsx`         | Current implementation to understand before changing        |
| `packages/react/src/components/TextField/TextFieldHeadless.tsx` | Target layer to compose                                     |
| `packages/react/src/components/TextField/TextField.types.ts`    | Prop contracts                                              |
| `packages/react/src/components/Checkbox/Checkbox.tsx`           | Reference for correct Layer 3 → Layer 2 composition pattern |
| `packages/react/src/components/Checkbox/CheckboxHeadless.tsx`   | Reference for correct headless pattern                      |

---

## Cursor Rules Reference

- [`architecture.mdc`](.cursor/rules/architecture.mdc): Three-layer rule — styled component MUST wrap headless, no exceptions
- [`testing.mdc`](.cursor/rules/testing.mdc): TDD — write failing tests first, then implement, target >90% coverage
- [`md3-design.mdc`](.cursor/rules/md3-design.mdc): MD3 tokens only, no arbitrary values — preserve existing CVA tokens
- [`code-style.mdc`](.cursor/rules/code-style.mdc): `'use client'` required, `forwardRef` pattern, no `any`

---

## Notes

- The visual appearance of TextField must NOT change — only the internal wiring changes
- `TextFieldHeadless` may need minor adjustments to its prop interface to properly support forwarding all state needed by the styled layer (e.g., `isFocused`, `inputRef`)
- React Aria's `useTextField` returns `inputProps`, `labelProps`, `descriptionProps`, `errorMessageProps` — the styled layer should use these via `TextFieldHeadless` slots or render-prop pattern
- Branch name suggestion: `fix/textfield-three-layer-architecture`
- Commit messages:
  - `test(textfield): add failing tests for architecture compliance`
  - `fix(textfield): refactor to compose TextFieldHeadless (three-layer)`
  - `fix(textfield): remove controlled-value render anti-pattern`

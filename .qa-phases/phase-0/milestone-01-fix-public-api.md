# Milestone 1: Fix Public API Surface

> **Status:** Not Started
> **Priority:** Critical
> **Depends On:** None (can start immediately)
> **Estimated Effort:** S (< 1 day)

---

## Objective

Ensure all seven completed components are importable from the `@tinybigui/react` package entry point.

---

## Context

`IconButton` and `FAB` were built as part of Phase 1a and both have full implementations (49 and 51 tests respectively), but neither is exported from `packages/react/src/index.ts`. This means consumers who install `@tinybigui/react` cannot use them.

The internal barrel `packages/react/src/components/index.ts` already exports them, but `src/index.ts` — the actual package entry — does not re-export from that barrel. It only exports `Button`, `TextField`, `Checkbox`, `Switch`, and `Radio`.

This is a critical correctness issue that must be fixed before v0.1.0.

---

## Tasks

- [ ] **1.1 — Add `IconButton` export to package entry**
  - File: `packages/react/src/index.ts`
  - Add named export for `IconButton` component
  - Add `export type` for `IconButtonProps`, `IconButtonVariant`, `IconButtonColor`, `IconButtonSize`
  - Follow the same pattern as the existing `Button` export block in that file

- [ ] **1.2 — Add `FAB` export to package entry**
  - File: `packages/react/src/index.ts`
  - Add named export for `FAB` component
  - Add `export type` for `FABProps`, `FABSize`, `FABColor`
  - Follow the same pattern as the existing `Button` export block

- [ ] **1.3 — Audit barrel consistency**
  - Compare `packages/react/src/components/index.ts` against `packages/react/src/index.ts` line by line
  - Confirm every component exported from `components/index.ts` has a corresponding export in `src/index.ts`
  - Note: `RadioHeadless` and `RadioGroupHeadless` are currently exported from `src/index.ts`; confirm this is intentional

- [ ] **1.4 — Verify headless component exports**
  - Confirm whether `IconButtonHeadless` and `FABHeadless` should also be publicly exported (for advanced customization use cases)
  - Precedent: `RadioHeadless` and `RadioGroupHeadless` are exported; follow the same decision for consistency

- [ ] **1.5 — Run quality gate**
  - Run `pnpm typecheck` — must pass with zero errors
  - Run `pnpm build` — both packages must build successfully
  - Run `pnpm test` — all tests must still pass

---

## Acceptance Criteria

- [ ] `import { IconButton } from '@tinybigui/react'` resolves correctly
- [ ] `import { FAB } from '@tinybigui/react'` resolves correctly
- [ ] All type imports for `IconButton` and `FAB` resolve correctly
- [ ] No TypeScript errors introduced
- [ ] `pnpm build` succeeds — dist includes `IconButton` and `FAB`
- [ ] All existing tests continue to pass

---

## Files to Change

| File                          | Change                                          |
| ----------------------------- | ----------------------------------------------- |
| `packages/react/src/index.ts` | Add `IconButton`, `FAB` exports and their types |

## Files to Read First

| File                                                | Why                                          |
| --------------------------------------------------- | -------------------------------------------- |
| `packages/react/src/index.ts`                       | Current export list — understand the pattern |
| `packages/react/src/components/index.ts`            | What the internal barrel already exports     |
| `packages/react/src/components/IconButton/index.ts` | What IconButton exposes                      |
| `packages/react/src/components/FAB/index.ts`        | What FAB exposes                             |

---

## Cursor Rules Reference

- [`code-style.mdc`](.cursor/rules/code-style.mdc): Named exports only, `export type` for types — must follow for all new export lines
- [`core.mdc`](.cursor/rules/core.mdc): RSC compatible — no side effects in export lines

---

## Notes

- This is a pure file-edit task with no logic changes; risk is very low
- The `components/index.ts` barrel is currently incomplete too (it does not export `TextField`, `Checkbox`, or `Switch`) — this does not need to be fixed in this milestone but is worth noting for a future cleanup
- Branch name suggestion: `fix/public-api-missing-exports`
- Commit message: `fix(react): export IconButton and FAB from package entry`

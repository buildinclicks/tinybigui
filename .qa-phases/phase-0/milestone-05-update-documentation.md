# Milestone 5: Update Project Documentation

> **Status:** Not Started
> **Priority:** High
> **Depends On:** M1, M2, M3, M4 (all component fixes should be complete so docs reflect final accurate state)
> **Estimated Effort:** S (< 1 day)

---

## Objective

Make every documentation file accurately reflect the current state of the project — what is built, what is working, what is next.

---

## Context

The project's documentation has severe staleness drift. `TASKS.md` was written on December 29, 2025, still showing "3/44 tasks completed." `README.md` still announces Phase 0 as in-progress. `ROADMAP.md` lists Phase 1b components as "Not started" when all are built. The tokens `README.md` describes dark mode mechanisms and token names that don't match the actual CSS.

This matters because:

- External contributors reading the docs will have a completely false picture of what exists
- CI badges in `README.md` point to the live repo — the status badge must be accurate at launch
- The tokens README describes API consumers depend on — wrong names cause integration failures

This milestone is a pure documentation task — no code changes.

---

## Tasks

### README.md (Root)

- [ ] **5.1 — Update development status banner**
  - File: `README.md`
  - Remove or update the "Phase 0 - Work in Progress" warning banner
  - Replace with an accurate status: v0.0.x pre-release, Phase 1a + 1b complete, approaching v0.1.0

- [ ] **5.2 — Update the Phase roadmap checklist**
  - Mark all Phase 0 items as done (`[x]`)
  - Mark all Phase 1a items as done: Button, IconButton, FAB (with test counts)
  - Mark all Phase 1b items as done: TextField, Checkbox, Switch, Radio
  - Update Phase 2 and beyond to remain as `[ ]`
  - Remove the `Select` component from Phase 1b (it was never built and is not planned)

- [ ] **5.3 — Update the "Installation" section**
  - Change "Coming Soon" note to reflect that v0.1.0 is in preparation
  - Keep the install commands (they'll work once published) but add a note about the expected release timeline

- [ ] **5.4 — Update the Packages table**
  - Change `@tinybigui/react` status from "In progress" to something accurate (e.g., "Pre-release: v0.1.0 coming soon")
  - Change `@tinybigui/tokens` similarly

- [ ] **5.5 — Remove nonexistent folder references**
  - The Project Structure section references `docs/` and `strategies/` folders
  - Remove or comment out these folder references since they were moved to local-only (commit `6691821`)

- [ ] **5.6 — Fix dark mode claim**
  - README claims "Automatic light/dark theme support based on system preferences"
  - This is inaccurate until M7 is complete. Update to: "Class-based dark mode via `.dark` class"
  - After M7 is complete, this can be updated to mention both mechanisms

---

### ROADMAP.md

- [ ] **5.7 — Update "Current Status" section**
  - Change `Status: Phase 1 in progress` to `Status: Phase 1a + 1b complete, approaching v0.1.0`

- [ ] **5.8 — Update "Completed Work" section**
  - Phase 1a table: Button (53 tests ✅), IconButton (49 tests ✅), FAB (51 tests ✅) — already correct, just verify
  - Add a **Phase 1b** completed section:
    | Component | Tests | Status |
    |-----------|-------|--------|
    | TextField | (run `pnpm test` and count) | Complete |
    | Checkbox | (run `pnpm test` and count) | Complete |
    | Switch | (run `pnpm test` and count) | Complete |
    | Radio | (run `pnpm test` and count) | Complete |

- [ ] **5.9 — Update "In Progress" section**
  - Remove Phase 1b from "In Progress" — it is done
  - Add v0.1.0 release preparation as the current in-progress item

- [ ] **5.10 — Add link to CHANGELOG.md when it exists**
  - The file references `CHANGELOG.md` which doesn't exist yet
  - Add a note: "CHANGELOG will be created as part of v0.1.0 release (M8)"

---

### TASKS.md

- [ ] **5.11 — Mark all Phase 0 tasks complete**
  - Go through every task row (Parts A–M) and change `⬜` to `✅` for all completed tasks
  - All 44 tasks in Phase 0 are done

- [ ] **5.12 — Update "Progress Tracking" section**
  - Change: `Phase 0 Progress: 3/44 tasks completed` → `Phase 0 Progress: 44/44 tasks completed ✅`
  - Change: `Current Task: 1.1` → `Phase 0 Complete. Phase 1a + 1b Complete.`
  - Update: `Blockers: None` to accurately describe current state

- [ ] **5.13 — Update "Next Steps" section**
  - Replace "Me: Start Task 1.1" with current next steps pointing to the milestone files
  - Example: `Next: work through .qa-phases/phase-0/ milestones toward v0.1.0`

- [ ] **5.14 — Update the `_Last Updated` date**
  - Change `_Last Updated: December 29, 2025_` to the current date

---

### packages/tokens/README.md

- [ ] **5.15 — Fix dark mode documentation**
  - Remove claims about `prefers-color-scheme: dark` automatic system preference (not yet implemented until M7)
  - Remove claims about `data-theme` attribute support (not implemented)
  - Document only what exists: `.dark` class on `<html>` or ancestor element

- [ ] **5.16 — Fix token name discrepancies**
  - The README uses `--md-sys-elevation-1` but the actual CSS uses `--md-sys-elevation-level-1`
  - The README uses `-font-size` in typography names but actual CSS uses `-size`
  - Audit the entire README token table against `packages/tokens/src/tokens.css` and correct all mismatches

- [ ] **5.17 — Remove aspirational token listings**
  - Remove references to token roles that don't exist in the current CSS (e.g., `surface-tint`, `inverse-surface` if absent)
  - Cross-reference every token name in the README against the `:root` block in `tokens.css`

- [ ] **5.18 — Fix the "145 tokens" claim**
  - Either count the actual tokens in `tokens.css` and update the number, or remove the specific count

---

## Acceptance Criteria

- [ ] `README.md` accurately describes the current project state (Phase 1a + 1b complete)
- [ ] `README.md` does not reference nonexistent folders (`docs/`, `strategies/`)
- [ ] `README.md` does not claim `prefers-color-scheme` dark mode (until M7 is done)
- [ ] `ROADMAP.md` shows Phase 1a + 1b as complete with accurate test counts
- [ ] `TASKS.md` shows 44/44 Phase 0 tasks complete and has current date
- [ ] `packages/tokens/README.md` token names match the actual CSS variables in `tokens.css`
- [ ] `packages/tokens/README.md` dark mode section only documents `.dark` class mechanism
- [ ] No broken internal links in any documentation file

---

## Files to Change

| File                        | Change                                                            |
| --------------------------- | ----------------------------------------------------------------- |
| `README.md`                 | Status, roadmap, installation, dark mode claim, folder references |
| `ROADMAP.md`                | Phase statuses, completed work table, in-progress section         |
| `TASKS.md`                  | All Phase 0 tasks marked complete, progress section, date         |
| `packages/tokens/README.md` | Token names, dark mode docs, count claim                          |

## Files to Read First

| File                             | Why                                                       |
| -------------------------------- | --------------------------------------------------------- |
| `packages/tokens/src/tokens.css` | Ground truth for token names and dark mode implementation |
| `packages/react/src/index.ts`    | Confirm which components are exported (for docs accuracy) |
| `ROADMAP.md`                     | Current content before editing                            |
| `TASKS.md`                       | Current content before editing                            |

---

## Cursor Rules Reference

- [`core.mdc`](.cursor/rules/core.mdc): Quality over speed — documentation must be accurate before release, not aspirational
- [`release-workflow.mdc`](.cursor/rules/release-workflow.mdc): Pre-release checklist includes documentation accuracy

---

## Notes

- Do NOT update the dark mode claim in `README.md` to reflect both mechanisms until M7 is actually complete — this keeps docs honest
- When counting tests for the Phase 1b table (task 5.8), run `pnpm test -- --reporter=verbose` to get per-component counts
- The `TASKS.md` should be treated as a historical artifact — once fully marked complete, it may be archived or replaced by this `.qa-phases/` folder going forward
- Branch name suggestion: `docs/update-project-documentation`
- Commit messages:
  - `docs: update README to reflect phase 1a+1b completion`
  - `docs: update ROADMAP with accurate component status`
  - `docs: mark all phase 0 tasks complete in TASKS.md`
  - `docs(tokens): fix README token names and dark mode docs`

# Milestone 8: Changelog & Version Management

> **Status:** Not Started
> **Priority:** Critical
> **Depends On:** M7 (all code work on `dev` should be done before writing the changelog)
> **Estimated Effort:** S (< 1 day)

---

## Objective

Create a `CHANGELOG.md` documenting all work to date, and install Changesets to manage version bumps and changelog generation going forward.

---

## Context

`ROADMAP.md` references a `CHANGELOG.md` that does not exist. The release workflow rule requires a `CHANGELOG.md` before any release. For v0.1.0, the changelog must be written manually (there are no prior releases to generate it from). From v0.1.0 onward, Changesets will automate changelog entry generation.

[Changesets](https://github.com/changesets/changesets) is the industry-standard tool for managing versions and changelogs in monorepos. It integrates with GitHub Actions for automated release PRs and publishing.

---

## Tasks

### Phase 1 — Write CHANGELOG.md Manually

- [ ] **8.1 — Create `CHANGELOG.md` at repo root**
  - Follow [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format
  - The initial entry documents all work done from project inception to the v0.1.0 release:

  ```markdown
  # Changelog

  All notable changes to this project will be documented in this file.

  The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
  and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

  ## [Unreleased]

  ## [0.1.0] - YYYY-MM-DD

  ### Added

  - `@tinybigui/react` package with 7 Material Design 3 components
  - Button (filled, outlined, tonal, elevated, text variants; loading state; ripple)
  - IconButton (standard, filled, tonal, outlined variants; toggle mode)
  - FAB (primary, secondary, tertiary, surface colors; small/medium/large/extended sizes)
  - TextField (filled, outlined variants; floating label; helper text; character count)
  - Checkbox (with indeterminate state and optional label)
  - Switch (with optional icons; on/off)
  - Radio + RadioGroup (vertical/horizontal orientation; form integration)
  - `@tinybigui/tokens` package with Material Design 3 design tokens
  - Full MD3 color system (light + dark themes, class-based and system preference)
  - MD3 typography scale (Display, Headline, Title, Body, Label)
  - MD3 elevation system (levels 0–5)
  - MD3 shape tokens (corner radius scale)
  - MD3 motion tokens (duration + easing)
  - Tailwind CSS v4 integration via CSS-first `@theme` configuration
  - React Aria accessibility primitives for all interactive components
  - Vitest + React Testing Library test suite (150+ tests)
  - Storybook 10 component documentation
  - GitHub Actions CI (lint, typecheck, test, build)
  ```

- [ ] **8.2 — Review and finalize the entry**
  - Ensure the "Added" section accurately describes all shipped components
  - Add a "Fixed" section if any known issues were resolved before v0.1.0 (e.g., M1–M4 fixes)
  - Do NOT include work that hasn't been completed yet

### Phase 2 — Install and Configure Changesets

- [ ] **8.3 — Install `@changesets/cli`**
  - Add to root `devDependencies`:
    ```bash
    pnpm add -D @changesets/cli -w
    ```
  - Verify the version installed is the latest stable

- [ ] **8.4 — Initialize Changesets**
  - Run `pnpm changeset init` in the repo root
  - This creates `.changeset/config.json` with default settings
  - Review the generated config and adjust:

  ```json
  {
    "$schema": "https://unpkg.com/@changesets/config/schema.json",
    "changelog": "@changesets/cli/changelog",
    "commit": false,
    "fixed": [],
    "linked": [["@tinybigui/react", "@tinybigui/tokens"]],
    "access": "public",
    "baseBranch": "main",
    "updateInternalDependencies": "patch",
    "ignore": []
  }
  ```

  - `linked` groups the two packages so they version together (both bump when either changes)
  - `access: "public"` is required for scoped packages to be published to NPM
  - `baseBranch: "main"` must match the actual primary branch name

- [ ] **8.5 — Add `changeset` script to root `package.json`**
  - File: `package.json`
  - Add the following scripts:
    ```json
    {
      "scripts": {
        "changeset": "changeset",
        "version-packages": "changeset version",
        "release": "pnpm build && changeset publish"
      }
    }
    ```

- [ ] **8.6 — Create an initial changeset for v0.1.0**
  - Run `pnpm changeset`
  - Select both `@tinybigui/react` and `@tinybigui/tokens`
  - Select "minor" bump (0.0.0 → 0.1.0 is a minor version bump)
  - Write summary: "Initial release with 7 MD3 components: Button, IconButton, FAB, TextField, Checkbox, Switch, Radio"
  - This creates a file in `.changeset/` — commit it

### Phase 3 — Document the Workflow

- [ ] **8.7 — Document the Changesets workflow in `CONTRIBUTING.md`**
  - File: `CONTRIBUTING.md`
  - Add a "Version Management" section explaining:
    - What a changeset is and when to create one
    - Command: `pnpm changeset` — run this for any PR that changes user-facing behavior
    - The changeset file should be committed with the PR
    - Maintainers run `pnpm version-packages` to apply all pending changesets
    - Then `pnpm release` to publish to NPM

- [ ] **8.8 — Add `.changeset` folder to `.gitignore` exclusions**
  - The `.changeset/` folder and its generated files should be committed (they are the pending changelog entries)
  - Verify `.gitignore` does NOT ignore `.changeset/` — if it does, remove that line

- [ ] **8.9 — Run quality gate**
  - `pnpm lint` — zero errors
  - `pnpm typecheck` — zero errors
  - `pnpm test` — all tests green
  - `pnpm build` — both packages succeed

---

## Acceptance Criteria

- [ ] `CHANGELOG.md` exists at repo root with a complete v0.1.0 entry in Keep a Changelog format
- [ ] `@changesets/cli` is installed as a dev dependency
- [ ] `.changeset/config.json` exists with correct `access: "public"` and `baseBranch: "main"` settings
- [ ] Root `package.json` has `changeset`, `version-packages`, and `release` scripts
- [ ] `CONTRIBUTING.md` documents the Changesets workflow
- [ ] An initial changeset file exists in `.changeset/` for the v0.1.0 minor bump
- [ ] `.changeset/` is NOT gitignored

---

## Files to Change

| File                     | Change                                                 |
| ------------------------ | ------------------------------------------------------ |
| `CHANGELOG.md`           | Create with v0.1.0 entry                               |
| `package.json`           | Add `changeset`, `version-packages`, `release` scripts |
| `.changeset/config.json` | Created by `changeset init`                            |
| `CONTRIBUTING.md`        | Add version management section                         |

## Files to Read First

| File              | Why                                                                   |
| ----------------- | --------------------------------------------------------------------- |
| `package.json`    | Current scripts — add alongside existing ones                         |
| `CONTRIBUTING.md` | Current content — add a new section without breaking existing content |
| `ROADMAP.md`      | Contains a reference to `CHANGELOG.md` — verify it links correctly    |

---

## Cursor Rules Reference

- [`release-workflow.mdc`](.cursor/rules/release-workflow.mdc): Release process — `CHANGELOG.md` required before release; version bump before tagging
- [`core.mdc`](.cursor/rules/core.mdc): Quality over speed — changelog must be accurate and complete

---

## Notes

- The `CHANGELOG.md` for v0.1.0 should be written manually since there are no machine-generated changeset entries for the pre-Changesets history. From v0.1.0 onward, every PR that changes user-facing behavior should include a changeset file
- The `version-packages` command consumes all `.changeset/*.md` files, bumps package versions in `package.json`, updates `CHANGELOG.md`, and deletes the consumed changeset files
- Do not run `pnpm version-packages` yet — that is done in M14 as part of the actual release
- Branch name suggestion: `feat/changelog-and-changesets`
- Commit messages:
  - `docs: create CHANGELOG.md with initial v0.1.0 entry`
  - `chore: install and configure changesets for monorepo`
  - `docs(contributing): document changesets workflow`

# Milestone 12: Visual Regression Testing

> **Status:** Not Started
> **Priority:** Medium
> **Depends On:** M10 (release infrastructure), M11 (Storybook deployed — Chromatic uses story files)
> **Estimated Effort:** M (1–2 days)

---

## Objective

Set up Chromatic to capture visual snapshots of all component stories and automatically detect unintended visual changes in future PRs.

---

## Context

The project has 53+ unit tests per component but none of them test visual appearance — they test behavior, accessibility, and rendering. Visual regression testing catches a different class of bug: a CSS class change that breaks the layout of a button, or a token update that accidentally changes a color.

[Chromatic](https://www.chromatic.com/) is the standard visual regression tool for Storybook. It:

- Takes pixel-perfect screenshots of every story in every browser
- Compares screenshots between commits
- Flags visual differences for human review in a PR UI
- Integrates natively with Storybook 10 (the version used in this project)

---

## Tasks

### Phase 1 — Chromatic Account Setup (Manual)

- [ ] **12.1 — Create Chromatic account**
  - Go to [chromatic.com](https://www.chromatic.com)
  - Sign in with the `buildinclicks` GitHub account
  - Create a new project linked to `buildinclicks/tinybigui`
  - Chromatic will provide a **Project Token** — copy it

- [ ] **12.2 — Add `CHROMATIC_PROJECT_TOKEN` to GitHub Secrets**
  - Go to GitHub repo → Settings → Secrets and variables → Actions
  - Add secret: `CHROMATIC_PROJECT_TOKEN` with the token from step 12.1

### Phase 2 — Install Chromatic Package

- [ ] **12.3 — Install `chromatic` in the react package**
  - Add to `packages/react/devDependencies`:
    ```bash
    pnpm add -D chromatic --filter @tinybigui/react
    ```
  - Verify the installed version is compatible with Storybook 10

- [ ] **12.4 — Add Chromatic script to `packages/react/package.json`**
  - Add:
    ```json
    {
      "scripts": {
        "chromatic": "chromatic --project-token=$CHROMATIC_PROJECT_TOKEN"
      }
    }
    ```

### Phase 3 — First Baseline Run

- [ ] **12.5 — Run Chromatic for the first time (baseline)**
  - From `packages/react/`:
    ```bash
    CHROMATIC_PROJECT_TOKEN=<token> pnpm chromatic --auto-accept-changes
    ```
  - The `--auto-accept-changes` flag accepts all changes on the first run (they are the baseline)
  - This uploads all story screenshots to Chromatic and establishes the baseline

- [ ] **12.6 — Verify all stories are captured**
  - Open the Chromatic dashboard at chromatic.com
  - Confirm all 7 components and their stories are listed
  - Confirm light and dark mode variants are captured (Storybook's theme switching should be reflected)

### Phase 4 — GitHub Actions Integration

- [ ] **12.7 — Create `.github/workflows/chromatic.yml`**

  ```yaml
  name: Chromatic

  on:
    push:
      branches:
        - main
        - dev
    pull_request:
      branches:
        - dev
        - main

  jobs:
    chromatic:
      name: Visual Regression Tests
      runs-on: ubuntu-latest

      steps:
        - name: Checkout
          uses: actions/checkout@v4
          with:
            fetch-depth: 0 # Required for Chromatic to detect changes

        - name: Setup pnpm
          uses: pnpm/action-setup@v4
          with:
            version: 9.15.0

        - name: Setup Node.js
          uses: actions/setup-node@v4
          with:
            node-version: "20"
            cache: "pnpm"

        - name: Install dependencies
          run: pnpm install --frozen-lockfile

        - name: Run Chromatic
          uses: chromaui/action@latest
          with:
            projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
            workingDir: packages/react
            onlyChanged: true # Only test stories affected by the diff
            exitZeroOnChanges: true # Don't fail CI on visual changes; require human review
  ```

  Key settings:
  - `fetch-depth: 0` — required so Chromatic can access full git history for change detection
  - `onlyChanged: true` — only test stories touched by the PR (faster, cheaper)
  - `exitZeroOnChanges: true` — visual changes don't fail CI; they open a review task in Chromatic

- [ ] **12.8 — Verify the workflow runs on next PR**
  - Open a test PR (e.g., update a story) against `dev`
  - Confirm the Chromatic workflow runs and posts a status check on the PR
  - Verify the Chromatic UI shows the visual diff for review

### Phase 5 — Documentation

- [ ] **12.9 — Document visual review process in `CONTRIBUTING.md`**
  - File: `CONTRIBUTING.md`
  - Add a "Visual Regression Testing" section:
    - What Chromatic is and why it's used
    - What contributors should do when Chromatic flags a visual change:
      - If intentional: approve the change in Chromatic dashboard
      - If unintentional: fix the PR before merging
    - Maintainers must approve visual changes before merging

- [ ] **12.10 — Add Chromatic badge to `README.md` (optional)**
  - Chromatic provides a badge showing the last build status
  - Add it alongside the CI badge in the README header

- [ ] **12.11 — Run quality gate**
  - `pnpm lint` — zero errors
  - `pnpm typecheck` — zero errors
  - `pnpm test` — all tests green
  - `pnpm build-storybook` — succeeds

---

## Acceptance Criteria

- [ ] Chromatic project is created and linked to the GitHub repository
- [ ] `CHROMATIC_PROJECT_TOKEN` is configured as a GitHub Secret
- [ ] `chromatic` package is installed in `packages/react/`
- [ ] Baseline snapshots exist for all 7 components and their stories
- [ ] `.github/workflows/chromatic.yml` runs on PRs and pushes to `dev`/`main`
- [ ] Chromatic status check appears on PRs (review required for visual changes)
- [ ] `CONTRIBUTING.md` explains the visual review workflow for contributors

---

## Files to Create/Change

| File                              | Change                                    |
| --------------------------------- | ----------------------------------------- |
| `packages/react/package.json`     | Add `chromatic` dev dependency and script |
| `.github/workflows/chromatic.yml` | Create visual regression CI workflow      |
| `CONTRIBUTING.md`                 | Add visual regression review process      |
| `README.md`                       | Add Chromatic badge (optional)            |

## Files to Read First

| File                                | Why                                                   |
| ----------------------------------- | ----------------------------------------------------- |
| `packages/react/.storybook/main.ts` | Understand Storybook config — Chromatic reads from it |
| `.github/workflows/ci.yml`          | Follow consistent style for the new workflow file     |

---

## Cursor Rules Reference

- [`storybook.mdc`](.cursor/rules/storybook.mdc): Required story types — all component stories must exist before visual regression is set up; incomplete stories will create a poor baseline
- [`testing.mdc`](.cursor/rules/testing.mdc): Quality gates — visual regression is an additional layer beyond unit tests; both are required

---

## Notes

- Chromatic has a free tier that covers ~5,000 snapshots/month — sufficient for the current story count at v0.1.0
- The `onlyChanged: true` setting dramatically reduces snapshot usage by only testing stories affected by changed files
- Visual changes in Chromatic are NOT automatically blocking (because `exitZeroOnChanges: true`). Maintainers manually approve or reject visual changes in the Chromatic UI. This avoids false-positive CI failures from intentional changes
- After the v0.1.0 baseline is established, all subsequent PRs will be compared against it — accidental regressions will be caught immediately
- Branch name suggestion: `feat/visual-regression-chromatic`
- Commit messages:
  - `chore(react): add chromatic for visual regression testing`
  - `ci: add chromatic visual regression workflow`
  - `docs(contributing): add visual review process`

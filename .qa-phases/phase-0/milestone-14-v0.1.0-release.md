# Milestone 14: v0.1.0 Release

> **Status:** Not Started
> **Priority:** Critical
> **Depends On:** M11, M12, M13 (all pre-release infra complete; Storybook deployed, Chromatic baselined, community infrastructure set up)
> **Estimated Effort:** S (< 1 day — mostly orchestration of already-completed work)

---

## Objective

Publish `@tinybigui/react@0.1.0` and `@tinybigui/tokens@0.1.0` to NPM, tag the release on GitHub, and announce it.

---

## Context

This is the culmination of all previous milestones. Every prerequisite must be verified complete before proceeding. Once published, this version is permanent — packages cannot be unpublished after 72 hours on NPM. This milestone is intentionally methodical.

---

## Pre-Flight Checklist

All of the following must be true before starting any release task:

- [ ] M1: `IconButton` and `FAB` are exported from `packages/react/src/index.ts`
- [ ] M2: `TextField` styled layer composes `TextFieldHeadless`
- [ ] M3: `RadioGroup` label renders exactly once in the DOM
- [ ] M4: FAB spinner has `aria-label="Loading"`, all axe tests pass
- [ ] M5: Documentation is accurate (`ROADMAP.md`, `TASKS.md`, `README.md`, tokens README)
- [ ] M6: `dev` branch is merged to `main` with all 85+ commits
- [ ] M7: `prefers-color-scheme: dark` is implemented in `tokens.css`
- [ ] M8: `CHANGELOG.md` exists; Changesets is configured; changeset file for v0.1.0 exists
- [ ] M9: `@tinybigui` NPM org exists; `NPM_TOKEN` GitHub Secret is configured; dry-run publish passed
- [ ] M10: `.github/workflows/release.yml` exists and RC test (`v0.1.0-rc.1`) published successfully
- [ ] M11: Storybook is deployed at a public URL
- [ ] M12: Chromatic baseline is established for all stories
- [ ] M13: `CODE_OF_CONDUCT.md`, `SECURITY.md`, Dependabot configured

---

## Tasks

### Phase 1 — Final Quality Gate

- [ ] **14.1 — Run full quality gate on `main`**
  - Switch to `main` branch
  - Run `pnpm lint` — must pass with zero errors
  - Run `pnpm typecheck` — must pass with zero errors
  - Run `pnpm test` — ALL tests must be green
  - Run `pnpm build` — both packages must build successfully
  - Run `pnpm build-storybook` — must succeed
  - Do NOT proceed if any step fails

- [ ] **14.2 — Verify all 7 components are exported**
  - Import check: confirm `import { Button, IconButton, FAB, TextField, Checkbox, Switch, Radio, RadioGroup } from '@tinybigui/react'` resolves
  - Run the build and inspect `dist/index.js` or the generated type declarations to confirm all components are present

- [ ] **14.3 — Verify CI is green on `main`**
  - Check GitHub Actions at `https://github.com/buildinclicks/tinybigui/actions`
  - All four CI jobs (quality, typecheck, test, build) must be green on the latest `main` commit
  - Do NOT release from a failing CI state

### Phase 2 — Version Bump

- [ ] **14.4 — Apply Changesets to bump versions**
  - Run `pnpm version-packages` from the repo root
  - This consumes the `.changeset/` files and:
    - Bumps `packages/react/package.json` version from `0.0.0` to `0.1.0`
    - Bumps `packages/tokens/package.json` version from `0.0.0` to `0.1.0`
    - Appends the v0.1.0 entry to `CHANGELOG.md`
    - Deletes the consumed changeset files from `.changeset/`
  - Review the changes before committing

- [ ] **14.5 — Verify version bump is correct**
  - Both packages should now read `"version": "0.1.0"`
  - `CHANGELOG.md` should have the v0.1.0 section with today's date filled in
  - `.changeset/` directory should only contain `config.json` (no pending changeset `.md` files)

- [ ] **14.6 — Commit the version bump**
  - Stage all changed files: `package.json` in both packages, `CHANGELOG.md`, deleted changeset files
  - Commit: `chore: version packages for v0.1.0`
  - Push to `main`: `git push origin main`

### Phase 3 — Create the Release

- [ ] **14.7 — Create release branch**
  - Per `.cursor/rules/release-workflow.mdc`:
    ```bash
    git checkout -b release/v0.1.0
    git push origin release/v0.1.0
    ```

- [ ] **14.8 — Create GitHub Release**
  - Go to GitHub repo → Releases → Draft a new release
  - Tag version: `v0.1.0`
  - Target branch: `main` (or `release/v0.1.0`)
  - Release title: `v0.1.0 — Initial Release`
  - Description: copy the v0.1.0 section from `CHANGELOG.md` and format it for the GitHub Release body
  - Mark as: **Latest release** (not pre-release)
  - Click **Publish release**

- [ ] **14.9 — Verify release workflow triggers**
  - The GitHub Release publication triggers `.github/workflows/release.yml`
  - Go to Actions tab and monitor the workflow run
  - Workflow should: run quality gate → build → publish `@tinybigui/tokens` → publish `@tinybigui/react`

### Phase 4 — Verify Publication

- [ ] **14.10 — Verify NPM publication**
  - Check `https://www.npmjs.com/package/@tinybigui/react` — version `0.1.0` should appear
  - Check `https://www.npmjs.com/package/@tinybigui/tokens` — version `0.1.0` should appear
  - Verify the "latest" dist-tag points to `0.1.0`

- [ ] **14.11 — Test installation from NPM**
  - In a clean temporary directory:
    ```bash
    mkdir test-tinybigui && cd test-tinybigui
    npm init -y
    npm install @tinybigui/react @tinybigui/tokens
    ```
  - Verify the packages install without errors
  - Verify TypeScript types are available:
    ```bash
    npx tsc --noEmit --allowSyntheticDefaultImports --moduleResolution bundler --jsx react-jsx -e "import { Button } from '@tinybigui/react'"
    ```

- [ ] **14.12 — Verify provenance attestation**
  - Run `npm info @tinybigui/react@0.1.0 dist.attestations`
  - Confirm provenance record links to the GitHub Actions run

### Phase 5 — Post-Release Sync and Announcement

- [ ] **14.13 — Merge `release/v0.1.0` back to `main` if needed**
  - If any commits were made on the release branch, merge them back
  - Ensure `main` has the version bump commit

- [ ] **14.14 — Sync `dev` with `main`**
  - Pull `main` into `dev`:
    ```bash
    git checkout dev
    git merge main
    git push origin dev
    ```

- [ ] **14.15 — Update README badges**
  - The npm version badge (`https://img.shields.io/npm/v/@tinybigui/react`) will auto-update
  - Verify the badge shows `v0.1.0` in the README
  - Update "Coming Soon" installation note to the live install command

- [ ] **14.16 — Close GitHub Milestone v0.1.0**
  - Go to GitHub → Issues → Milestones
  - Close the v0.1.0 milestone to mark it as complete

- [ ] **14.17 — Post in GitHub Discussions (Announcements)**
  - Write an announcement in GitHub Discussions → Announcements:
    - What is TinyBigUI
    - What's included in v0.1.0 (7 components)
    - How to install
    - Link to Storybook
    - What's coming next (Phase 2: Navigation)
    - How to contribute

- [ ] **14.18 — Update ROADMAP.md with release date**
  - Add the release date to the v0.1.0 entry in the roadmap table

---

## Acceptance Criteria

- [ ] `@tinybigui/react@0.1.0` is published on NPM with `latest` dist-tag
- [ ] `@tinybigui/tokens@0.1.0` is published on NPM with `latest` dist-tag
- [ ] GitHub Release `v0.1.0` exists and is tagged on `main`
- [ ] Installation from NPM succeeds: `npm install @tinybigui/react`
- [ ] TypeScript types resolve correctly from the installed package
- [ ] NPM provenance attestation is present
- [ ] `dev` and `main` are in sync after release
- [ ] GitHub Milestone v0.1.0 is closed
- [ ] Release announced in GitHub Discussions

---

## Cursor Rules Reference

- [`release-workflow.mdc`](.cursor/rules/release-workflow.mdc): Full release checklist — version bump → release branch → GitHub Release → NPM publish → sync
- [`core.mdc`](.cursor/rules/core.mdc): Quality over speed — do not rush; verify every step before proceeding

---

## Notes

- **This milestone is irreversible at step 14.10 (NPM publish).** The pre-flight checklist at the top of this file exists precisely because packages cannot be easily unpublished after 72 hours
- The version in `package.json` is currently `0.0.0` — it ONLY gets bumped to `0.1.0` in step 14.4; do not manually edit it
- If the release workflow (step 14.9) fails, check: `NPM_TOKEN` expiry, `publishConfig.access: "public"` in package.json, and that the version doesn't already exist on NPM
- After this milestone, the project enters Phase 2 (Navigation components). The `.qa-phases/` folder should get a `phase-1/` or `phase-2/` counterpart for tracking that work
- Commit messages:
  - `chore: version packages for v0.1.0`
  - (GitHub Release creation is not a commit — it's done via the GitHub UI)
  - `chore: sync dev with main after v0.1.0 release`

# Milestone 11: Storybook Deployment

> **Status:** Not Started
> **Priority:** High
> **Depends On:** M10 (release infrastructure in place; deploy alongside other pre-release tasks)
> **Estimated Effort:** M (1–2 days)

---

## Objective

Deploy Storybook to a public URL so contributors, users, and potential adopters can browse all component documentation and interactive examples without running the project locally.

---

## Context

Storybook is configured and runs locally (`pnpm dev:storybook`) but is not deployed anywhere. For an open-source component library, a public Storybook is effectively the documentation site. Without it:

- Users cannot preview components before installing
- Contributors cannot reference story behavior during reviews
- README links to "documentation coming soon" remain broken

Vercel is the recommended deployment target (per `TASKS.md` Phase 0.5 checklist). A GitHub Actions workflow should auto-deploy on every push to `main` so the live Storybook always reflects the latest release.

---

## Tasks

### Phase 1 — Verify Storybook Static Build

- [ ] **11.1 — Confirm `build-storybook` script works**
  - File: `packages/react/package.json`
  - Run `pnpm build-storybook` from the `packages/react/` directory
  - Verify a `storybook-static/` folder is generated containing `index.html` and assets
  - Fix any build errors (outdated Storybook config, missing story imports, etc.)

- [ ] **11.2 — Verify all 7 component stories render in the static build**
  - Serve the static build locally:
    ```bash
    npx serve storybook-static
    ```
  - Open in browser and manually verify all 7 components have stories
  - Check for any missing stories, console errors, or broken story variants

- [ ] **11.3 — Add `build-storybook` script to root `package.json` if missing**
  - File: `package.json`
  - Add: `"build-storybook": "pnpm --filter @tinybigui/react build-storybook"`
  - This allows the root script to be called from CI without `cd`ing into the package

### Phase 2 — Vercel Deployment Setup

- [ ] **11.4 — Create Vercel project (manual step)**
  - Go to [vercel.com](https://vercel.com) and sign in with the `buildinclicks` GitHub account
  - Click "Add New Project" → Import the `buildinclicks/tinybigui` repository
  - Configure project settings:
    - **Framework Preset:** Other
    - **Root Directory:** `packages/react`
    - **Build Command:** `pnpm build-storybook`
    - **Output Directory:** `storybook-static`
    - **Install Command:** `pnpm install --frozen-lockfile` (from repo root, not packages/react)

- [ ] **11.5 — Configure Vercel for monorepo root install**
  - Vercel needs to run `pnpm install` from the **repo root** to install all workspace dependencies, but then build from `packages/react`
  - Set the root directory to `/` (repo root) and configure:
    - **Build Command:** `pnpm --filter @tinybigui/react build-storybook`
    - **Output Directory:** `packages/react/storybook-static`

- [ ] **11.6 — Verify first deployment succeeds**
  - After connecting the project, trigger a deployment from `main`
  - Check the Vercel deployment logs for any errors
  - Open the generated Vercel URL and verify Storybook loads correctly
  - Check all 7 components render and stories work

- [ ] **11.7 — Set a custom domain (optional)**
  - If `tinybigui.dev` or `storybook.tinybigui.dev` is available and owned, configure it in Vercel
  - Otherwise, use the auto-generated `tinybigui.vercel.app` URL for now

### Phase 3 — Automated Deployment on Push to Main

- [ ] **11.8 — Create `.github/workflows/storybook-deploy.yml`**

  ```yaml
  name: Deploy Storybook

  on:
    push:
      branches:
        - main
    workflow_dispatch: # Allow manual trigger

  jobs:
    deploy:
      name: Build and Deploy Storybook
      runs-on: ubuntu-latest

      steps:
        - name: Checkout
          uses: actions/checkout@v4

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

        - name: Build Storybook
          run: pnpm --filter @tinybigui/react build-storybook

        - name: Deploy to Vercel
          uses: amondnet/vercel-action@v25
          with:
            vercel-token: ${{ secrets.VERCEL_TOKEN }}
            vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
            vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
            working-directory: packages/react
            vercel-args: "--prod"
  ```

  > **Alternative:** If Vercel's GitHub integration is configured directly (auto-deploy on push), this separate workflow file may not be needed. Vercel's native GitHub integration is simpler and preferred.

- [ ] **11.9 — Add Vercel secrets to GitHub (if using the Actions approach)**
  - `VERCEL_TOKEN` — from Vercel account settings → Tokens
  - `VERCEL_ORG_ID` — from Vercel project settings
  - `VERCEL_PROJECT_ID` — from Vercel project settings
  - Note: If using Vercel's native GitHub integration, this step is not needed

### Phase 4 — Documentation

- [ ] **11.10 — Add Storybook URL to `README.md`**
  - File: `README.md`
  - Update the Documentation section:
    ```markdown
    - **Storybook:** [tinybigui.vercel.app](https://tinybigui.vercel.app) — interactive component playground
    ```
  - Replace the "Coming soon" note

- [ ] **11.11 — Add Storybook badge to `README.md` header**
  - Add a Vercel deployment status badge near the top of README alongside the CI badge
  - Format: `[![Storybook](https://img.shields.io/badge/Storybook-View-FF4785?logo=storybook)](URL)`

- [ ] **11.12 — Run quality gate**
  - `pnpm lint` — zero errors
  - `pnpm typecheck` — zero errors
  - `pnpm test` — all tests green
  - `pnpm build-storybook` — static build succeeds

---

## Acceptance Criteria

- [ ] `pnpm build-storybook` produces a `storybook-static/` output without errors
- [ ] All 7 component stories render correctly in the static build
- [ ] Storybook is deployed to a public URL (Vercel)
- [ ] Every push to `main` triggers a new Storybook deployment
- [ ] `README.md` links to the live Storybook URL
- [ ] Dark mode toggle works on the deployed Storybook
- [ ] No broken stories in the deployed version

---

## Files to Create/Change

| File                                     | Change                                  |
| ---------------------------------------- | --------------------------------------- |
| `package.json`                           | Add root-level `build-storybook` script |
| `.github/workflows/storybook-deploy.yml` | Create if using Actions-based deploy    |
| `README.md`                              | Add Storybook URL and badge             |

## Files to Read First

| File                                | Why                                                         |
| ----------------------------------- | ----------------------------------------------------------- |
| `packages/react/package.json`       | Confirm `build-storybook` script name                       |
| `packages/react/.storybook/main.ts` | Understand Storybook config and any build-specific settings |
| `README.md`                         | Find where to add the URL and badge                         |

---

## Cursor Rules Reference

- [`storybook.mdc`](.cursor/rules/storybook.mdc): Required story types per component — verify all 7 component stories meet the standard before deploying
- [`core.mdc`](.cursor/rules/core.mdc): Quality over speed — all 7 components must have complete, working stories before going public

---

## Notes

- Vercel's native GitHub integration (auto-deploy on push) is simpler than the Actions-based approach — prefer it if it handles the monorepo correctly
- The Storybook URL will be the primary "documentation" link for v0.1.0 since a dedicated docs site is a future milestone
- Consider setting up Preview Deployments on Vercel for PRs to `dev` — contributors can preview story changes without merging (Vercel does this automatically with the GitHub integration)
- Branch name suggestion: `feat/storybook-deployment`
- Commit messages:
  - `ci: add storybook deployment workflow`
  - `docs: add storybook url and badge to README`

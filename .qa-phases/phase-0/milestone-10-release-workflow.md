# Milestone 10: Release Workflow Automation

> **Status:** Not Started
> **Priority:** Critical
> **Depends On:** M9 (NPM org and `NPM_TOKEN` secret must exist before the workflow can run)
> **Estimated Effort:** M (1–2 days)

---

## Objective

Create a GitHub Actions workflow that automatically builds and publishes both packages to NPM when a GitHub Release is created, including supply-chain security provenance.

---

## Context

The existing CI workflow (`.github/workflows/ci.yml`) runs quality checks on every push and PR but does not publish. Releases are currently entirely manual. For a healthy open-source project, publishing should be:

- Triggered by a deliberate action (creating a GitHub Release)
- Automated to eliminate human error in the publish step
- Secured with provenance attestation (npm provenance)
- Validated by a full quality gate before any package is sent to NPM

---

## Tasks

### Phase 1 — Design the Workflow

- [ ] **10.1 — Choose release trigger strategy**
  - **Option A (Recommended):** Trigger on GitHub Release creation (`on: release: types: [published]`)
    - Maintainer creates a GitHub Release with tag `v0.1.0`
    - Workflow runs automatically, publishes to NPM
    - Simple, predictable, requires no automation of version bumping
  - **Option B:** Changesets Release Action — automated PR creates version bump PR, merging it triggers publish
    - More automated but requires additional setup (Changesets bot, different workflow file)
  - **Decision:** Use Option A for v0.1.0 simplicity; document Option B as a future improvement

- [ ] **10.2 — Define workflow steps**
  - Checkout code
  - Setup Node.js 20 + pnpm
  - Install dependencies
  - Run quality gate (lint, typecheck, test, build)
  - Publish `@tinybigui/tokens` first (no internal deps)
  - Publish `@tinybigui/react` second (may depend on tokens)
  - Create GitHub Release attestation/provenance

### Phase 2 — Create the Workflow File

- [ ] **10.3 — Create `.github/workflows/release.yml`**

  ```yaml
  name: Release

  on:
    release:
      types: [published]

  concurrency:
    group: release-${{ github.ref }}
    cancel-in-progress: false # Never cancel a release in progress

  jobs:
    release:
      name: Publish to NPM
      runs-on: ubuntu-latest
      permissions:
        contents: read
        id-token: write # Required for npm provenance

      steps:
        - name: Checkout code
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
            registry-url: "https://registry.npmjs.org"

        - name: Install dependencies
          run: pnpm install --frozen-lockfile

        - name: Run quality gate
          run: |
            pnpm lint
            pnpm typecheck
            pnpm test

        - name: Build packages
          run: pnpm build

        - name: Publish @tinybigui/tokens
          run: pnpm publish --filter @tinybigui/tokens --no-git-checks --provenance
          env:
            NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

        - name: Publish @tinybigui/react
          run: pnpm publish --filter @tinybigui/react --no-git-checks --provenance
          env:
            NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
  ```

- [ ] **10.4 — Verify permissions are correct**
  - `id-token: write` permission is required for npm provenance (supply-chain attestation)
  - `contents: read` is the minimum needed for checkout
  - Do NOT grant more permissions than needed

- [ ] **10.5 — Add `--provenance` flag**
  - NPM provenance links the published package to the specific GitHub Actions run that built it
  - This is a supply-chain security best practice for open-source packages
  - Requires `id-token: write` permission in the workflow job
  - Requires Node.js setup with `registry-url` (enables `NODE_AUTH_TOKEN` authentication)

### Phase 3 — Pre-Release Test with RC Tag

- [ ] **10.6 — Test the workflow with a release candidate**
  - Create a pre-release GitHub Release with tag `v0.1.0-rc.1`
  - Mark it as "pre-release" (not the latest)
  - Verify the workflow triggers and runs successfully
  - Check that `@tinybigui/react@0.1.0-rc.1` and `@tinybigui/tokens@0.1.0-rc.1` appear on NPM (on the `next` dist-tag)
  - If any step fails, fix and re-test

- [ ] **10.7 — Verify published RC package is installable**
  - In a fresh directory, run:
    ```bash
    npm install @tinybigui/react@0.1.0-rc.1
    ```
  - Verify the package installs without errors
  - Verify TypeScript types are accessible
  - Verify `@tinybigui/tokens` is available separately

- [ ] **10.8 — Deprecate or delete the RC release**
  - After testing, either:
    - Delete the `v0.1.0-rc.1` GitHub Release and unpublish from NPM (`npm deprecate @tinybigui/react@0.1.0-rc.1 "Test release - do not use"`)
    - Or leave it as-is marked as pre-release on GitHub (it won't affect `latest` dist-tag)

### Phase 4 — Documentation

- [ ] **10.9 — Update `CONTRIBUTING.md` with release process**
  - File: `CONTRIBUTING.md`
  - Add a "Release Process (Maintainers Only)" section:
    1. Ensure all milestones for the release are complete
    2. Run `pnpm version-packages` to apply Changesets and bump versions
    3. Commit the version bump: `chore: version packages for vX.X.X`
    4. Merge to `main`
    5. Create a GitHub Release with tag `vX.X.X`
    6. The release workflow publishes to NPM automatically

- [ ] **10.10 — Run quality gate on the workflow file**
  - Verify the YAML is valid (no syntax errors)
  - `pnpm lint` — zero errors (lint doesn't cover `.yml` files but still run it)
  - `pnpm typecheck` — zero errors
  - `pnpm test` — all tests green
  - `pnpm build` — succeeds

---

## Acceptance Criteria

- [ ] `.github/workflows/release.yml` exists and is syntactically valid YAML
- [ ] Workflow triggers on `release: types: [published]`
- [ ] Workflow runs quality gate (lint + typecheck + test) before publishing
- [ ] Workflow publishes both packages with `--provenance`
- [ ] `id-token: write` permission is set on the job
- [ ] RC test publish (`v0.1.0-rc.1`) succeeds without errors
- [ ] RC packages are installable from NPM
- [ ] Release process is documented in `CONTRIBUTING.md`

---

## Files to Create/Change

| File                            | Change                                     |
| ------------------------------- | ------------------------------------------ |
| `.github/workflows/release.yml` | Create — automated NPM publishing workflow |
| `CONTRIBUTING.md`               | Add maintainer release process section     |

## Files to Read First

| File                           | Why                                               |
| ------------------------------ | ------------------------------------------------- |
| `.github/workflows/ci.yml`     | Existing CI structure to follow for consistency   |
| `packages/react/package.json`  | Confirm package name and scope for publish filter |
| `packages/tokens/package.json` | Confirm package name for publish filter           |

---

## Cursor Rules Reference

- [`release-workflow.mdc`](.cursor/rules/release-workflow.mdc): Release process — quality gate before publish, `main` → release tag → NPM publish order

---

## Notes

- The `--no-git-checks` flag in the publish command is needed because at publish time the working directory may have uncommitted changes from the build step; this is safe since the quality gate already validated everything
- Never run `pnpm publish` without first running all quality gate steps in the same workflow
- The `registry-url: 'https://registry.npmjs.org'` setup is required for `NODE_AUTH_TOKEN` to be injected by `actions/setup-node` — without it, authentication fails silently
- Consider adding Slack/Discord notification steps after successful publish (optional, not blocking for v0.1.0)
- Branch name suggestion: `feat/release-workflow-automation`
- Commit message: `ci: add automated release workflow for NPM publishing`

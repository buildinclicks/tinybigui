# Milestone 9: NPM Publishing Infrastructure

> **Status:** Not Started
> **Priority:** Critical
> **Depends On:** M8 (Changesets configured; packages have correct metadata before publishing)
> **Estimated Effort:** S (< 1 day)

---

## Objective

Set up the `@tinybigui` NPM organization, generate publishing credentials, configure GitHub Secrets, and verify that both packages are ready to publish.

---

## Context

Neither `@tinybigui/react` nor `@tinybigui/tokens` has been published to NPM. Before the release workflow (M10) can automate publishing, the following manual one-time setup must be completed:

1. The `@tinybigui` organization must exist on npmjs.com
2. Publishing credentials must be created and stored as a GitHub Secret
3. Both `package.json` files must have correct metadata (`publishConfig`, `files`, etc.)
4. A dry-run publish must succeed locally before any automated workflow is trusted

---

## Tasks

### Phase 1 — Manual Setup (Outside the Codebase)

- [ ] **9.1 — Create `@tinybigui` organization on NPM**
  - Go to [npmjs.com](https://www.npmjs.com) and sign in
  - Navigate to: Your profile → Organizations → Create Organization
  - Organization name: `tinybigui`
  - This creates the `@tinybigui` scope
  - Make the org public so packages can be published as public scoped packages

- [ ] **9.2 — Generate NPM automation token**
  - Go to NPM → Your profile → Access Tokens → Generate New Token
  - Token type: **Automation** (bypasses 2FA for CI use)
  - Copy the token immediately (it is shown only once)
  - Store it securely (password manager) — will be needed for GitHub Secret

- [ ] **9.3 — Add `NPM_TOKEN` to GitHub repository secrets**
  - Go to GitHub repo → Settings → Secrets and variables → Actions
  - Click "New repository secret"
  - Name: `NPM_TOKEN`
  - Value: paste the automation token from step 9.2
  - Click "Add secret"

### Phase 2 — Verify Package Metadata

- [ ] **9.4 — Audit `packages/react/package.json`**
  - File: `packages/react/package.json`
  - Verify these fields are correct:
    ```json
    {
      "name": "@tinybigui/react",
      "version": "0.0.0",
      "description": "Material Design 3 React component library",
      "keywords": ["react", "material-design", "md3", "tailwind", "components", "ui"],
      "homepage": "https://github.com/buildinclicks/tinybigui#readme",
      "repository": {
        "type": "git",
        "url": "https://github.com/buildinclicks/tinybigui.git",
        "directory": "packages/react"
      },
      "license": "MIT",
      "publishConfig": {
        "access": "public"
      },
      "files": ["dist", "README.md"]
    }
    ```
  - Add any missing fields
  - Ensure `"private"` is NOT set (or is `false`)
  - Ensure `"files"` only includes the `dist/` output, not source files

- [ ] **9.5 — Audit `packages/tokens/package.json`**
  - File: `packages/tokens/package.json`
  - Same audit as above for the tokens package:
    ```json
    {
      "name": "@tinybigui/tokens",
      "version": "0.0.0",
      "description": "Material Design 3 design tokens for TinyBigUI",
      "keywords": ["material-design", "md3", "tokens", "tailwind", "css-variables"],
      "homepage": "https://github.com/buildinclicks/tinybigui#readme",
      "repository": {
        "type": "git",
        "url": "https://github.com/buildinclicks/tinybigui.git",
        "directory": "packages/tokens"
      },
      "license": "MIT",
      "publishConfig": {
        "access": "public"
      },
      "files": ["dist", "README.md"]
    }
    ```

- [ ] **9.6 — Verify `exports` field in both `package.json` files**
  - `packages/react/package.json`: confirm it has correct `exports` map (ESM + CJS + types)
  - `packages/tokens/package.json`: confirm `"./tokens.css": "./dist/tokens.css"` export is present
  - Check that `tsup.config.ts` generates the right output formats (ESM + CJS)

- [ ] **9.7 — Verify peer dependencies in `packages/react/package.json`**
  - Ensure `react` and `react-dom` are listed as `peerDependencies`, not `dependencies`
  - Ensure version range is correct: `">=18.0.0"` or `"^18.3.1"` (per monorepo overrides)

### Phase 3 — Dry Run Publish

- [ ] **9.8 — Build packages**
  - Run `pnpm build` from the repo root
  - Verify `packages/react/dist/` contains the correct output files
  - Verify `packages/tokens/dist/tokens.css` exists

- [ ] **9.9 — Dry-run publish `@tinybigui/react`**
  - From the `packages/react/` directory:
    ```bash
    pnpm publish --dry-run --no-git-checks
    ```
  - Review the output: confirm which files would be published, that the package name is correct, and that no unexpected files are included

- [ ] **9.10 — Dry-run publish `@tinybigui/tokens`**
  - From the `packages/tokens/` directory:
    ```bash
    pnpm publish --dry-run --no-git-checks
    ```
  - Same review as above

- [ ] **9.11 — Fix any issues found in dry run**
  - Common issues: missing `files` field including source files, wrong `main`/`module` paths, missing type declarations
  - Resolve and re-run dry run until clean

---

## Acceptance Criteria

- [ ] `@tinybigui` organization exists on npmjs.com
- [ ] `NPM_TOKEN` GitHub Secret is configured in the repository
- [ ] Both `package.json` files have `publishConfig: { access: "public" }`
- [ ] Both `package.json` files have `files` field listing only dist output
- [ ] Both `package.json` files have `repository`, `description`, `keywords`, `homepage`, `license` fields
- [ ] `pnpm publish --dry-run` succeeds for both packages with no errors
- [ ] The dry run output shows only the expected files would be published (not source files)

---

## Files to Change

| File                           | Change                                                                 |
| ------------------------------ | ---------------------------------------------------------------------- |
| `packages/react/package.json`  | Add/fix metadata fields (`publishConfig`, `files`, `repository`, etc.) |
| `packages/tokens/package.json` | Add/fix metadata fields (same as above)                                |

## Files to Read First

| File                            | Why                                                   |
| ------------------------------- | ----------------------------------------------------- |
| `packages/react/package.json`   | Current content to audit                              |
| `packages/tokens/package.json`  | Current content to audit                              |
| `packages/react/tsup.config.ts` | Understand build output paths for `exports` alignment |

---

## Cursor Rules Reference

- [`release-workflow.mdc`](.cursor/rules/release-workflow.mdc): Release process — `publishConfig.access: "public"` required for scoped public packages; quality gate before publish
- [`package-versions.mdc`](.cursor/rules/package-versions.mdc): Always verify current package versions before specifying them in dependencies

---

## Notes

- Tasks 9.1–9.3 are manual one-time actions outside the codebase — they have no associated code changes
- The `--no-git-checks` flag in the dry-run allows running publish without a clean git state (needed while on a feature branch)
- Never run `pnpm publish` without `--dry-run` until M14 (the actual release) — the dry run is just verification
- The `version` in `package.json` files is currently `0.0.0` — this is intentional; Changesets will bump it to `0.1.0` during the release step (M14)
- Branch name suggestion: `chore/npm-publishing-infrastructure`
- Commit message: `chore: add publishConfig and metadata fields to packages`

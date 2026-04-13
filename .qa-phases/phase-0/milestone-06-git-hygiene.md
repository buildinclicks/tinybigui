# Milestone 6: Git Hygiene & Branch Merge

> **Status:** Not Started
> **Priority:** Critical
> **Depends On:** M5 (all documentation and code fixes should be on `dev` before merging to `main`)
> **Estimated Effort:** S (< 1 day)

---

## Objective

Get the `main` branch up to date with all 85 commits of completed work on `dev`, and remove stale branches that clutter the repository.

---

## Context

The project has two primary branches:

- `main` — Only contains the initial docs/strategy commits from December 29, 2025. The last merge from `dev` was on that same date via PR #2.
- `dev` — Contains all actual work: 85 commits ahead of `main`, including the full infrastructure build, all 7 components, and documentation fixes.

Additionally, there is a stale remote branch `3-feat-implement-textfield-component` that has been abandoned and never cleaned up.

Per the release workflow rule (`.cursor/rules/release-workflow.mdc`), `main` is the production branch and should reflect all completed, quality-gated work before a release. It currently does not.

---

## Tasks

### Phase 1 — Pre-Merge Quality Gate

- [ ] **6.1 — Run complete quality gate on `dev`**
  - Run `pnpm lint` — must pass with zero errors
  - Run `pnpm typecheck` — must pass with zero errors
  - Run `pnpm test` — all tests must be green
  - Run `pnpm build` — both packages must build successfully
  - Only proceed to the merge if all four pass

- [ ] **6.2 — Verify CI is green on `dev`**
  - Check GitHub Actions CI status for the latest `dev` commit
  - URL: `https://github.com/buildinclicks/tinybigui/actions`
  - All four CI jobs must be green: Code Quality, Type Check, Tests, Build Packages
  - If any job fails, fix it before proceeding

### Phase 2 — Create and Merge PR

- [ ] **6.3 — Create Pull Request: `dev` → `main`**
  - Title: `chore: sync dev to main — Phase 1a + 1b complete`
  - Description: summarize all work included (infrastructure, 7 components, docs)
  - Reference any related issues or milestones
  - Assign to yourself, request review if there are other contributors

- [ ] **6.4 — Merge to `main` without squash**
  - Per `.cursor/rules/release-workflow.mdc`: merge without squash to preserve commit history
  - Use "Merge commit" merge strategy on GitHub (not "Squash and merge" or "Rebase and merge")
  - This preserves the full commit history including all Conventional Commits

- [ ] **6.5 — Verify `main` is correct after merge**
  - Confirm `git log main` shows all expected commits
  - Confirm latest `main` matches latest `dev`
  - Run `pnpm test` on `main` locally to confirm nothing broke in the merge

### Phase 3 — Stale Branch Cleanup

- [ ] **6.6 — Delete stale remote branch**
  - Branch: `origin/3-feat-implement-textfield-component`
  - Verify the branch is fully merged or abandoned (no unique commits that aren't on `dev`)
  - Delete: `git push origin --delete 3-feat-implement-textfield-component`

- [ ] **6.7 — Audit for any other stale branches**
  - Run `git branch -a` to list all remote branches
  - Identify any branches older than 30 days that are fully merged or abandoned
  - Delete them with maintainer approval

### Phase 4 — Post-Merge Sync

- [ ] **6.8 — Sync `dev` with `main`**
  - After merging to `main`, pull `main` into `dev` to ensure they are in sync:
    ```bash
    git checkout dev
    git merge main
    git push origin dev
    ```

- [ ] **6.9 — Tag the merge point (optional pre-release tag)**
  - Consider tagging `main` at this point as `v0.1.0-alpha.1` to mark the state of the codebase before the infrastructure milestones (M7–M13)
  - This is optional but gives a useful reference point in git history

---

## Acceptance Criteria

- [ ] `main` branch is up to date with all commits from `dev`
- [ ] `git log main` shows all 7 component implementations
- [ ] CI passes on `main` after merge
- [ ] `origin/3-feat-implement-textfield-component` branch is deleted
- [ ] No other stale branches remain (older than 30 days, fully merged)
- [ ] `dev` and `main` are in sync (same HEAD commit)

---

## Branch Strategy Reference

Per `.cursor/rules/release-workflow.mdc`:

```
main  ←  PR merge from dev  (no squash, merge commit)
  ↑
dev   ←  feature branches merged in
```

The merge strategy is important: squashing would erase the individual Conventional Commit messages that document the development history and are used for generating CHANGELOG entries.

---

## Cursor Rules Reference

- [`release-workflow.mdc`](.cursor/rules/release-workflow.mdc): Branch strategy — `main` is production only, merge without squash, CI must pass before merge

---

## Notes

- The 85-commit gap between `dev` and `main` is large but not unusual for a greenfield project — it simply reflects that no release has been cut yet
- If the GitHub branch protection rules on `main` require a PR review and CI pass, that is working as intended — do not bypass the protection
- After this milestone, a clear pattern should be established: features are developed on feature branches, merged to `dev` via PR, and `dev` is merged to `main` at each release
- Branch name: no new feature branch needed — this is a direct PR from `dev` to `main`
- Commit message for post-merge sync: `chore: sync dev with main after phase 1 merge`

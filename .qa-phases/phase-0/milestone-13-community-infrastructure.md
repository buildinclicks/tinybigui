# Milestone 13: Community Infrastructure

> **Status:** Not Started
> **Priority:** Medium
> **Depends On:** M10 (core release infrastructure done)
> **Estimated Effort:** M (1–2 days, mostly manual GitHub configuration + file creation)

---

## Objective

Complete all open-source community tooling so contributors, users, and security researchers have clear paths for participation, reporting, and collaboration.

---

## Context

The project has `CONTRIBUTING.md` and issue templates, but several community essentials are missing per the Phase 0.5 checklist in `TASKS.md`:

- No `CODE_OF_CONDUCT.md`
- No `SECURITY.md`
- No Dependabot configuration
- GitHub Discussions not enabled
- No standard issue labels
- No GitHub Milestones linking releases to issues
- All Contributors bot not configured

These are not blocking for v0.1.0 but should be complete before the release is announced publicly, as contributors will arrive immediately after the announcement.

---

## Tasks

### Task Group A — Repository Files

- [ ] **13.1 — Create `CODE_OF_CONDUCT.md`**
  - Use the [Contributor Covenant v2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/) — the industry standard
  - Replace placeholder contact email with the maintainer's email or a `conduct@tinybigui.dev` alias
  - Place at repo root: `CODE_OF_CONDUCT.md`
  - Content structure:

    ```markdown
    # Contributor Covenant Code of Conduct

    ## Our Pledge

    ## Our Standards

    ## Our Responsibilities

    ## Scope

    ## Enforcement

    ## Enforcement Guidelines

    ## Attribution
    ```

- [ ] **13.2 — Create `SECURITY.md`**
  - Place at repo root: `SECURITY.md`
  - GitHub automatically links this from the Security tab
  - Content:

    ```markdown
    # Security Policy

    ## Supported Versions

    | Version | Supported |
    | ------- | --------- |
    | 0.1.x   | ✅        |

    ## Reporting a Vulnerability

    Please do NOT report security vulnerabilities via GitHub Issues.

    Instead, email [security@tinybigui.dev] (or the maintainer's email).
    Include a description of the vulnerability and steps to reproduce.

    You will receive a response within 48 hours confirming receipt.
    We will disclose the vulnerability publicly after a fix is released.
    ```

- [ ] **13.3 — Create `.github/dependabot.yml`**
  - Enable Dependabot for both NPM and GitHub Actions security updates:

    ```yaml
    version: 2
    updates:
      - package-ecosystem: "npm"
        directory: "/"
        schedule:
          interval: "weekly"
        groups:
          dependencies:
            patterns:
              - "*"
        open-pull-requests-limit: 5

      - package-ecosystem: "github-actions"
        directory: "/"
        schedule:
          interval: "monthly"
    ```

  - Weekly NPM updates keep dependencies current
  - Monthly Actions updates keep CI tooling current

### Task Group B — GitHub Repository Configuration (Manual)

- [ ] **13.4 — Enable GitHub Discussions**
  - Go to GitHub repo → Settings → Features
  - Enable "Discussions" checkbox
  - Go to Discussions tab and configure categories:
    - **Announcements** (announcements-only)
    - **General** (open discussion)
    - **Q&A** (question + answer format)
    - **Ideas** (feature requests)
    - **Show and Tell** (share projects using TinyBigUI)
  - Pin a welcome post in Announcements

- [ ] **13.5 — Create standard issue labels**
  - Go to GitHub repo → Issues → Labels
  - Create or ensure these labels exist:

  | Label                   | Color     | Description                |
  | ----------------------- | --------- | -------------------------- |
  | `bug`                   | `#d73a4a` | Something isn't working    |
  | `enhancement`           | `#a2eeef` | New feature or request     |
  | `good first issue`      | `#7057ff` | Good for newcomers         |
  | `help wanted`           | `#008672` | Extra attention needed     |
  | `documentation`         | `#0075ca` | Documentation improvements |
  | `accessibility`         | `#e4e669` | A11y-related issues        |
  | `component: button`     | `#bfd4f2` | Button component           |
  | `component: textfield`  | `#bfd4f2` | TextField component        |
  | `component: checkbox`   | `#bfd4f2` | Checkbox component         |
  | `component: switch`     | `#bfd4f2` | Switch component           |
  | `component: radio`      | `#bfd4f2` | Radio component            |
  | `component: fab`        | `#bfd4f2` | FAB component              |
  | `component: iconbutton` | `#bfd4f2` | IconButton component       |
  | `tokens`                | `#f9d0c4` | Design token related       |
  | `breaking change`       | `#b60205` | Breaking API change        |
  | `duplicate`             | `#cfd3d7` | Already reported           |
  | `wontfix`               | `#ffffff` | Will not be fixed          |
  | `invalid`               | `#e4e669` | Not a valid issue          |

- [ ] **13.6 — Create GitHub Milestones**
  - Go to GitHub repo → Issues → Milestones
  - Create milestones:
    - **v0.1.0** — "Initial release: Button, IconButton, FAB, TextField, Checkbox, Switch, Radio" — Due: set target date
    - **v0.2.0** — "Phase 2: Navigation (AppBar, Tabs, Drawer, Bottom Navigation)"
    - **v1.0.0** — "Stable release: API frozen"
  - Assign any open issues/PRs to the appropriate milestone

### Task Group C — All Contributors Bot

- [ ] **13.7 — Add All Contributors bot configuration**
  - Create `.all-contributorsrc` at repo root:
    ```json
    {
      "projectName": "tinybigui",
      "projectOwner": "buildinclicks",
      "repoType": "github",
      "repoHost": "https://github.com",
      "files": ["README.md"],
      "imageSize": 100,
      "commit": false,
      "contributionTypes": ["code", "doc", "bug", "test", "design", "ideas", "review"]
    }
    ```

- [ ] **13.8 — Add All Contributors section to `README.md`**
  - Add a "Contributors" section at the bottom of `README.md`:

    ```markdown
    ## Contributors

    Thanks to all our contributors!

    <!-- ALL-CONTRIBUTORS-LIST:START -->
    <!-- ALL-CONTRIBUTORS-LIST:END -->
    ```

  - The bot will populate this section automatically when contributors are added

- [ ] **13.9 — Install the All Contributors GitHub App (optional)**
  - Go to [allcontributors.org/en/bot/installation](https://allcontributors.org/en/bot/installation)
  - Install the bot for `buildinclicks/tinybigui`
  - Contributors can then be added by commenting `@all-contributors please add @username for code`

### Task Group D — Verification

- [ ] **13.10 — Verify all files are well-formatted**
  - Run `pnpm format` on all new markdown files
  - Ensure no lint errors are introduced

- [ ] **13.11 — Run quality gate**
  - `pnpm lint` — zero errors
  - `pnpm typecheck` — zero errors
  - `pnpm test` — all tests green
  - `pnpm build` — succeeds

---

## Acceptance Criteria

- [ ] `CODE_OF_CONDUCT.md` exists at repo root with Contributor Covenant v2.1
- [ ] `SECURITY.md` exists at repo root with vulnerability reporting instructions
- [ ] `.github/dependabot.yml` exists and enables weekly NPM + monthly Actions updates
- [ ] GitHub Discussions is enabled with at least 4 categories
- [ ] All standard issue labels exist (bug, enhancement, good first issue, accessibility, etc.)
- [ ] GitHub Milestones exist: v0.1.0, v0.2.0, v1.0.0
- [ ] `.all-contributorsrc` exists at repo root
- [ ] `README.md` has an All Contributors section

---

## Files to Create/Change

| File                     | Change                                  |
| ------------------------ | --------------------------------------- |
| `CODE_OF_CONDUCT.md`     | Create with Contributor Covenant v2.1   |
| `SECURITY.md`            | Create with security policy             |
| `.github/dependabot.yml` | Create with NPM + Actions update config |
| `.all-contributorsrc`    | Create with project configuration       |
| `README.md`              | Add Contributors section                |

## Files to Read First

| File              | Why                                                       |
| ----------------- | --------------------------------------------------------- |
| `CONTRIBUTING.md` | Ensure `CODE_OF_CONDUCT.md` cross-references it correctly |
| `README.md`       | Find the right place to add the Contributors section      |

---

## Cursor Rules Reference

- [`core.mdc`](.cursor/rules/core.mdc): Open-source quality — community infrastructure is part of the "quality over speed" principle
- [`release-workflow.mdc`](.cursor/rules/release-workflow.mdc): Phase 0.5 checklist — community infrastructure is explicitly listed as pre-release work

---

## Notes

- `CODE_OF_CONDUCT.md` and `SECURITY.md` are automatically recognized by GitHub and linked in the Community Standards tab (Insights → Community Standards)
- Dependabot PRs should be reviewed before merging — configure branch protection to require CI to pass on Dependabot PRs just like any other PR
- The All Contributors bot and app are both optional but create good open-source hygiene — at minimum, the `.all-contributorsrc` file and README section should exist
- GitHub Discussions replaces the need for a separate Slack/Discord for now; link to it from `CONTRIBUTING.md`
- Branch name suggestion: `chore/community-infrastructure`
- Commit messages:
  - `docs: add CODE_OF_CONDUCT.md (Contributor Covenant v2.1)`
  - `docs: add SECURITY.md with vulnerability reporting policy`
  - `chore: enable dependabot for npm and github-actions`
  - `chore: add all-contributors configuration`

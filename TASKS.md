# TinyBigUI - Phase 0 Task List

> **Current Phase**: Phase 0 - Foundation Setup  
> **Started**: December 29, 2025  
> **Target**: Complete foundation before Phase 1a (Button components)

---

## Legend

- 👤 **You do** — Learning opportunity, you perform the action
- 🤖 **AI creates** — I implement, you review and approve
- ⬜ Not started
- 🟡 In progress
- ✅ Completed

---

## Phase 0: Foundation Setup

### Part A: Minimal GitHub Setup (👤 You do)

> **Goal**: Get repository ready for code  
> **Time**: ~10 minutes

| Status | #   | Task                         | Description                                   | Notes                                |
| ------ | --- | ---------------------------- | --------------------------------------------- | ------------------------------------ |
| ✅     | 0.1 | **Create GitHub repository** | Create `tinybigui` repo (public, no template) | Created at `buildinclicks/tinybigui` |
| ✅     | 0.2 | **Branch protection**        | Settings → Rules → Rulesets                   | Created `main-protection` ruleset    |
| 🟡     | 0.3 | **Add repository topics**    | About → ⚙️ → Topics                           | Pending: add topics after push       |

---

### Part B: Project Initialization (🤖 AI creates)

> **Goal**: Set up monorepo structure  
> **Time**: ~10 minutes

| Status | #   | Task                          | Description             | Files Created                                                    |
| ------ | --- | ----------------------------- | ----------------------- | ---------------------------------------------------------------- |
| ⬜     | 1.1 | **Root workspace setup**      | Create workspace config | `package.json`, `pnpm-workspace.yaml`, `.npmrc`, `.gitignore`    |
| ⬜     | 1.2 | **packages/react structure**  | React package setup     | `packages/react/package.json`, `packages/react/src/index.ts`     |
| ⬜     | 1.3 | **packages/tokens structure** | Tokens package setup    | `packages/tokens/package.json`, `packages/tokens/src/tokens.css` |

---

### Part C: TypeScript Configuration (🤖 AI creates)

> **Goal**: Configure TypeScript with strict mode  
> **Time**: ~8 minutes

| Status | #   | Task                        | Description                  | Files Created                   |
| ------ | --- | --------------------------- | ---------------------------- | ------------------------------- |
| ⬜     | 2.1 | **Root tsconfig.json**      | Base TypeScript config       | `tsconfig.json`                 |
| ⬜     | 2.2 | **React package tsconfig**  | Extends base, React-specific | `packages/react/tsconfig.json`  |
| ⬜     | 2.3 | **Tokens package tsconfig** | Minimal config for tokens    | `packages/tokens/tsconfig.json` |

---

### Part D: Build Configuration (🤖 AI creates)

> **Goal**: Set up build tooling  
> **Time**: ~8 minutes

| Status | #   | Task                     | Description               | Files Created                                              |
| ------ | --- | ------------------------ | ------------------------- | ---------------------------------------------------------- |
| ⬜     | 3.1 | **React package build**  | tsup config for ESM + CJS | `packages/react/tsup.config.ts`                            |
| ⬜     | 3.2 | **Tokens package build** | CSS copy/build script     | `packages/tokens/scripts/build.js` or package.json scripts |

---

### Part E: Tailwind v4 Setup (🤖 AI creates)

> **Goal**: Configure Tailwind CSS v4  
> **Time**: ~10 minutes

| Status | #   | Task                      | Description                 | Files Created                    |
| ------ | --- | ------------------------- | --------------------------- | -------------------------------- |
| ⬜     | 4.1 | **Research Tailwind v4**  | Web search for latest setup | (research only)                  |
| ⬜     | 4.2 | **Configure Tailwind v4** | PostCSS + Tailwind config   | `postcss.config.js`, CSS imports |

---

### Part F: MD3 Design Tokens (🤖 AI creates)

> **Goal**: Implement Material Design 3 token system  
> **Time**: ~20 minutes

| Status | #   | Task                       | Description                       | Files Created                                                  |
| ------ | --- | -------------------------- | --------------------------------- | -------------------------------------------------------------- |
| ⬜     | 5.1 | **Color tokens**           | 25 MD3 color roles (light + dark) | `packages/tokens/src/colors.css`                               |
| ⬜     | 5.2 | **Typography tokens**      | 13 MD3 type scales                | `packages/tokens/src/typography.css`                           |
| ⬜     | 5.3 | **Elevation/Shape/Motion** | Shadows, corners, durations       | `packages/tokens/src/elevation.css`, `shape.css`, `motion.css` |
| ⬜     | 5.4 | **Tailwind v4 @theme**     | Map tokens to Tailwind utilities  | `packages/tokens/src/theme.css`                                |
| ⬜     | 5.5 | **Main tokens.css**        | Combine all token files           | `packages/tokens/src/tokens.css`                               |

---

### Part G: Base Utilities (🤖 AI creates)

> **Goal**: Create shared utility functions  
> **Time**: ~8 minutes

| Status | #   | Task                    | Description                   | Files Created                       |
| ------ | --- | ----------------------- | ----------------------------- | ----------------------------------- |
| ⬜     | 6.1 | **cn utility**          | clsx + tailwind-merge wrapper | `packages/react/src/utils/cn.ts`    |
| ⬜     | 6.2 | **Color utilities**     | MD3 dynamic color helpers     | `packages/react/src/utils/color.ts` |
| ⬜     | 6.3 | **Utils barrel export** | Export all utilities          | `packages/react/src/utils/index.ts` |

---

### Part H: Testing Setup (🤖 AI creates)

> **Goal**: Configure Vitest + React Testing Library  
> **Time**: ~10 minutes

| Status | #   | Task                     | Description                 | Files Created                     |
| ------ | --- | ------------------------ | --------------------------- | --------------------------------- |
| ⬜     | 7.1 | **Vitest configuration** | Test runner config          | `packages/react/vitest.config.ts` |
| ⬜     | 7.2 | **Test setup file**      | Global test setup, matchers | `packages/react/tests/setup.ts`   |
| ⬜     | 7.3 | **Test utilities**       | Custom render, helpers      | `packages/react/tests/utils.tsx`  |

---

### Part I: Storybook Setup (🤖 AI creates)

> **Goal**: Configure Storybook for component development  
> **Time**: ~15 minutes

| Status | #   | Task                      | Description                     | Files Created                           |
| ------ | --- | ------------------------- | ------------------------------- | --------------------------------------- |
| ⬜     | 8.1 | **Storybook main config** | Framework, addons, stories glob | `packages/react/.storybook/main.ts`     |
| ⬜     | 8.2 | **Storybook preview**     | Decorators, parameters, theme   | `packages/react/.storybook/preview.tsx` |
| ⬜     | 8.3 | **Storybook manager**     | UI customization                | `packages/react/.storybook/manager.ts`  |

---

### Part J: Code Quality (🤖 AI creates)

> **Goal**: Set up linting, formatting, commit hooks  
> **Time**: ~15 minutes

| Status | #   | Task                       | Description                        | Files Created                            |
| ------ | --- | -------------------------- | ---------------------------------- | ---------------------------------------- |
| ⬜     | 9.1 | **ESLint configuration**   | React + TS + a11y rules            | `eslint.config.js` (flat config)         |
| ⬜     | 9.2 | **Prettier configuration** | Code formatting + Tailwind sorting | `.prettierrc`, `.prettierignore`         |
| ⬜     | 9.3 | **Husky setup**            | Git hooks                          | `.husky/pre-commit`, `.husky/commit-msg` |
| ⬜     | 9.4 | **Commitlint config**      | Conventional commits               | `commitlint.config.js`                   |
| ⬜     | 9.5 | **lint-staged config**     | Run linters on staged files        | `lint-staged.config.js`                  |

---

### Part K: CI/CD - Basic (🤖 AI creates)

> **Goal**: Automated testing and linting on PRs  
> **Time**: ~10 minutes

| Status | #    | Task                   | Description                        | Files Created              |
| ------ | ---- | ---------------------- | ---------------------------------- | -------------------------- |
| ⬜     | 10.1 | **CI workflow**        | Test, lint, typecheck on PR/push   | `.github/workflows/ci.yml` |
| ⬜     | 10.2 | **Build verification** | Ensure packages build successfully | (included in ci.yml)       |

---

### Part L: Minimal Documentation (🤖 AI creates)

> **Goal**: Essential files for public repo  
> **Time**: ~10 minutes

| Status | #    | Task                       | Description                     | Files Created               |
| ------ | ---- | -------------------------- | ------------------------------- | --------------------------- |
| ⬜     | 11.1 | **LICENSE**                | MIT license                     | `LICENSE`                   |
| ⬜     | 11.2 | **Basic README**           | Project overview, "coming soon" | `README.md`                 |
| ⬜     | 11.3 | **packages/react README**  | Package-specific readme         | `packages/react/README.md`  |
| ⬜     | 11.4 | **packages/tokens README** | Package-specific readme         | `packages/tokens/README.md` |

---

### Part M: Verification (🤝 Collaborative)

> **Goal**: Verify everything works  
> **Time**: ~15 minutes

| Status | #    | Task                     | Description               | Command          |
| ------ | ---- | ------------------------ | ------------------------- | ---------------- |
| ⬜     | 12.1 | **Install dependencies** | Run pnpm install          | `pnpm install`   |
| ⬜     | 12.2 | **Build packages**       | Verify build works        | `pnpm build`     |
| ⬜     | 12.3 | **Run tests**            | Verify test setup         | `pnpm test`      |
| ⬜     | 12.4 | **Start Storybook**      | Verify Storybook works    | `pnpm storybook` |
| ⬜     | 12.5 | **Lint check**           | Verify linting works      | `pnpm lint`      |
| ⬜     | 12.6 | **Commit & push**        | Push to GitHub, verify CI | `git push`       |

---

## Phase 0 Summary

| Part             | Tasks  | Est. Time    | Type      |
| ---------------- | ------ | ------------ | --------- |
| A: GitHub Setup  | 3      | ~10 min      | 👤 You do |
| B: Project Init  | 3      | ~10 min      | 🤖 AI     |
| C: TypeScript    | 3      | ~8 min       | 🤖 AI     |
| D: Build         | 2      | ~8 min       | 🤖 AI     |
| E: Tailwind v4   | 2      | ~10 min      | 🤖 AI     |
| F: Design Tokens | 5      | ~20 min      | 🤖 AI     |
| G: Utilities     | 3      | ~8 min       | 🤖 AI     |
| H: Testing       | 3      | ~10 min      | 🤖 AI     |
| I: Storybook     | 3      | ~15 min      | 🤖 AI     |
| J: Code Quality  | 5      | ~15 min      | 🤖 AI     |
| K: CI/CD         | 2      | ~10 min      | 🤖 AI     |
| L: Documentation | 4      | ~10 min      | 🤖 AI     |
| M: Verification  | 6      | ~15 min      | 🤝 Collab |
| **Total**        | **44** | **~139 min** |           |

---

## Phase 0.5: Pre-Release Setup (DO LATER)

> **When**: After Phase 1a code is complete, before v0.1.0 release  
> **Goal**: Full open-source infrastructure

| Status | Task               | Description                          |
| ------ | ------------------ | ------------------------------------ |
| ⬜     | NPM organization   | Create `@tinybigui` org on npmjs.com |
| ⬜     | NPM access token   | Generate automation token            |
| ⬜     | GitHub Secrets     | Add `NPM_TOKEN` for publishing       |
| ⬜     | Release workflow   | Auto-publish to NPM on release       |
| ⬜     | Changesets setup   | Version management                   |
| ⬜     | Storybook deploy   | Vercel deployment workflow           |
| ⬜     | Chromatic setup    | Visual regression testing            |
| ⬜     | GitHub Discussions | Enable and configure categories      |
| ⬜     | Issue labels       | Create standard labels               |
| ⬜     | Milestones         | Create v0.1.0, v0.2.0, v1.0.0        |
| ⬜     | Issue templates    | Bug report, feature request          |
| ⬜     | PR template        | Pull request template                |
| ⬜     | CONTRIBUTING.md    | Full contribution guide              |
| ⬜     | CODE_OF_CONDUCT.md | Contributor Covenant                 |
| ⬜     | SECURITY.md        | Security policy                      |
| ⬜     | Dependabot         | Enable security updates              |
| ⬜     | All Contributors   | Install bot                          |
| ⬜     | Full README        | Complete documentation               |
| ⬜     | First release      | Publish v0.1.0                       |

---

## Progress Tracking

### Current Status

- **Phase 0 Progress**: 2/44 tasks completed
- **Current Task**: 0.3 (Add repository topics)
- **Blockers**: None

### Next Steps

1. 👤 You: Complete Task 0.3 (Add topics on GitHub)
2. 🤖 Me: Start Part B (Project Initialization)

---

## Notes

- Each task will be reviewed before moving to next
- Tasks marked 🤖 will be implemented by AI, reviewed by you
- Tasks marked 👤 are for you to do (learning opportunity)
- We commit after each major part is complete

---

_Last Updated: December 29, 2025_

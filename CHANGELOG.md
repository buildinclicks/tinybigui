# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-04-15

### Added

#### `@tinybigui/react`

- **Button** — Filled, outlined, tonal, elevated, and text variants; loading state with spinner; MD3 ripple interaction
- **IconButton** — Standard, filled, tonal, and outlined variants; toggle mode support
- **FAB** — Primary, secondary, tertiary, and surface color variants; small, medium, large, and extended sizes
- **TextField** — Filled and outlined variants; floating label animation; helper text; character count; error state
- **Checkbox** — Checked, unchecked, and indeterminate states; optional label
- **Switch** — On/off toggle with optional icons
- **Radio + RadioGroup** — Vertical and horizontal orientation; form integration via React Aria

#### `@tinybigui/tokens`

- Full MD3 color system with light and dark themes (class-based switching and system `prefers-color-scheme` support)
- MD3 typography scale — Display, Headline, Title, Body, and Label type roles
- MD3 elevation system — levels 0–5 via CSS variables
- MD3 shape tokens — corner radius scale
- MD3 motion tokens — duration and easing values

#### Infrastructure

- Tailwind CSS v4 integration via CSS-first `@theme` configuration
- React Aria accessibility primitives for all interactive components
- Vitest + React Testing Library test suite (355 tests across 7 components)
- Storybook 10 component documentation with accessibility and theme addons
- GitHub Actions CI pipeline (lint, typecheck, test, build)
- Monorepo setup with pnpm workspaces
- ESLint + Prettier + Husky + Commitlint code quality tooling

### Fixed

- **Public API surface** — `IconButton` and `FAB` were missing from the `@tinybigui/react` package entry point (`src/index.ts`); all 7 components are now correctly exported
- **TextField architecture** — Refactored `TextField` to properly compose `TextFieldHeadless`, aligning it with the three-layer architecture (React Aria → Headless → Styled) used by all other components; removed a controlled-value sync anti-pattern that could cause infinite render loops
- **RadioGroup duplicate label** — Fixed a bug where the group label was rendered twice in the DOM; the label is now rendered once in the styled layer using React Aria's `labelProps` for correct semantic association
- **FAB loading state accessibility** — Added `aria-label="Loading"` to the FAB spinner SVG, matching the behavior already present in the Button component
- **Checkbox inline styles** — Replaced `style={{ fill: "var(--color-on-primary)" }}` with a Tailwind CSS class, eliminating the only inline style violation in the codebase
- **Axe accessibility coverage** — Verified all 7 components pass automated axe checks; added axe test coverage across the test suite

[Unreleased]: https://github.com/buildinclicks/tinybigui/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/buildinclicks/tinybigui/releases/tag/v0.1.0

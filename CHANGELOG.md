# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.7.0] - 2026-06-09

### Changed

#### `@tinybigui/react`

- **FABMenu** — Redesigned action items to MD3 Expressive pill buttons (56dp full-rounded pills with inline label); trigger FAB is now the sole in-flow child with absolutely-positioned overlay items; scale-in/out pivot aligned per direction; stagger animation flicker fixes; new `color` prop with 6 MD3 Expressive color roles

> See [packages/react/CHANGELOG.md](./packages/react/CHANGELOG.md) for full breaking change details and migration notes.

## [0.6.0] - 2026-06-09

### Changed

#### `@tinybigui/react`

- **FAB** — M3 Expressive refactor: slot architecture, new size scale (`fab`/`medium`), solid and container color styles, dedicated focus-ring and state-layer slots

## [0.5.0] - 2026-06-08

### Changed

#### `@tinybigui/react`

- **IconButton** — M3 Expressive 5-tier sizing system (`xsmall`–`xlarge`), variants-vs-states architecture, press shape-morph, new `width`/`shape`/`selectedIcon` props

## [0.4.2] - 2026-06-08

### Changed

#### `@tinybigui/react`

- **Button**, **ButtonGroup**, **IconButton** — Aligned with MD3 specs; variants-vs-states architecture; removed non-spec `color` prop from Button

## [0.4.1] - 2026-06-08

### Fixed

#### `@tinybigui/react`

- **Switch** — Corrected track alignment and variant system; shared interaction state utilities

## [0.4.0] - 2026-06-07

### Added

#### `@tinybigui/react`

- **Badge**, **BottomSheet**, **ButtonGroup**, **Card**, **Chip**, **DatePicker**, **TimePicker**, **Divider**, **FABMenu**, **List**, **NavigationDrawer** (enhanced), **Search**, **Slider**, **SplitButton**, **Tooltip**

#### `@tinybigui/tokens`

- Modular CSS files: `color.css`, `elevation.css`, `motion.css`, `shape.css`, `theme.css`, `typography.css`

## [0.3.0] - 2026-05-13

### Added

#### `@tinybigui/react`

- **Progress** — MD3 Linear and Circular Progress Indicators; determinate and indeterminate modes; `role="progressbar"` with `aria-valuenow`/`min`/`max`; three-layer architecture (React Aria → Headless → Styled)
- **Dialog** — MD3 Basic and Fullscreen dialog variants; composable `DialogHeadline`, `DialogContent`, and `DialogActions` slots; focus trap; Escape-to-dismiss; WCAG 2.1 AA via React Aria `useDialog`/`useOverlay`
- **Snackbar** — MD3 Snackbar with `SnackbarProvider` and imperative `useSnackbar` hook; auto-dismiss timer with pause-on-hover/focus; action button support; multi-position placement; stacked queues with configurable `maxVisible`; WCAG 2.1 AA live-region accessibility
- **Menu** — MD3 Menu with `MenuTrigger`, `Menu`, `MenuItem`, `MenuSection`, `MenuDivider`, `MenuGap`, `ContextMenuTrigger`, and `SubmenuTrigger`; full keyboard navigation (arrows, Home/End, Enter/Space, type-ahead); single and multi-select modes; WCAG 2.1 AA via React Aria collections

#### `@tinybigui/tokens`

- Snackbar spacing token (`--spacing-snackbar-max`) added to Tailwind `@theme`

## [0.2.0] - 2026-04-25

### Added

#### `@tinybigui/react`

- **NavigationBar** — MD3 Bottom Navigation Bar with 3–5 destination items; animated active indicator pill; badge support (dot, numeric, "999+" truncation); `hideLabels` prop for icon-only mode; controlled and uncontrolled usage; full keyboard navigation (Arrow Left/Right, Home, End); WCAG 2.1 AA via `role="navigation"` + `role="tablist"`; 46 tests including axe audit
- **AppBar** — MD3 Top App Bar with four size variants (small, center-aligned, medium, large); composable navigation and action icon slots; scroll-triggered elevation via `useScrollElevation` hook
- **Tabs** — MD3 Primary and Secondary tab variants; composable `Tab`, `TabList`, and `TabPanel` slots; animated active indicator; full keyboard navigation; WCAG 2.1 AA via React Aria `useTabList`/`useTab`
- **NavigationDrawer** — MD3 Navigation Drawer with modal and standard variants; composable `DrawerItem` and `DrawerSection` slots; scrim overlay; focus trap; WCAG 2.1 AA via React Aria `useDialog`/`useOverlay`

#### `@tinybigui/tokens`

- Typography, motion, easing, and spacing token mappings added to Tailwind `@theme` for AppBar and Tabs
- Scrim color, `opacity-32`, drawer width, and shape tokens

### Fixed

- Button tonal/primary variant now correctly uses `bg-primary-container text-on-primary-container` per MD3 spec
- NavigationBar active status indicator styling
- Drawer component spacing and alignment
- TextField label positioning and placeholder visibility
- Style consistency across Checkbox, Radio, Switch, FAB, and IconButton variants
- Tabs `Tab.tsx` state layer rendering order

## [0.1.1] - 2026-04-15

### Fixed

- **`@tinybigui/react`** — Updated npm README to remove misleading "Work in Progress" / "not yet published" language; reflects actual v0.1.0 released state
- **`@tinybigui/tokens`** — Updated npm README to remove misleading "Work in Progress" / "not yet published" language; reflects actual v0.1.0 released state

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

[Unreleased]: https://github.com/buildinclicks/tinybigui/compare/v0.7.0...HEAD
[0.7.0]: https://github.com/buildinclicks/tinybigui/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/buildinclicks/tinybigui/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/buildinclicks/tinybigui/compare/v0.4.2...v0.5.0
[0.4.2]: https://github.com/buildinclicks/tinybigui/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/buildinclicks/tinybigui/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/buildinclicks/tinybigui/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/buildinclicks/tinybigui/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/buildinclicks/tinybigui/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/buildinclicks/tinybigui/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/buildinclicks/tinybigui/releases/tag/v0.1.0

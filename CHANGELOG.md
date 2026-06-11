# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.23.0] - 2026-06-11

### Changed

#### `@tinybigui/react`

- **Menu** — MD3 expressive vertical segmented menu rendering; new `MenuItemGroup` grouping primitive with automatic 2dp gaps; slot architecture refactor (`menuPopoverVariants`, `menuItemHighlightVariants`, `menuItemFocusRingVariants`); Storybook states and reference examples
- **Button** — disabled container background fix via `buttonContainerVariants` child slot

#### `@tinybigui/tokens`

- **`--opacity-*` tokens** — percentage values for Tailwind v4 `color-mix()` compatibility (fixes opacity modifier classes like `text-on-surface/38`)

> See [packages/react/CHANGELOG.md](./packages/react/CHANGELOG.md) and [packages/tokens/CHANGELOG.md](./packages/tokens/CHANGELOG.md) for full release notes.

## [0.22.0] - 2026-06-10

### Changed

#### `@tinybigui/react`

- **Dialog** — MD3 expressive motion refactor with composite `animate-md-*` keyframe utilities; new `icon` hero slot with auto center-alignment; scroll dividers in `DialogContent` via `ResizeObserver`; `prefers-reduced-motion` support; `dialogIconVariants` export; architecture alignment (`dialogWrapperVariants`, `getScrimClassName`, `getAnimationClassName` props on `DialogHeadless`)

> See [packages/react/CHANGELOG.md](./packages/react/CHANGELOG.md) for full release notes.

## [0.21.1] - 2026-06-10

### Changed

#### `@tinybigui/react`

- **Tooltip** — MD3 slot-based styling refactor; 3-state `animation` variant with `prefers-reduced-motion` support; rich tooltip title token fix (`text-on-surface-variant`); action row layout alignment; reduced-motion unmount guard fixing stuck overlay bug; new rich tooltip slot CVA exports

> See [packages/react/CHANGELOG.md](./packages/react/CHANGELOG.md) for full release notes.

## [0.21.0] - 2026-06-10

### Changed

#### `@tinybigui/react`

- **SplitButton** — MD3 expressive variants-vs-states architecture refactor; 5-size scale (`xs`–`xl`); new `elevated` variant; inner-corner shape morphing; per-segment state layers and focus rings; spring motion tokens; CVA export renames (`splitButtonLeadingVariants`, `splitButtonTrailingVariants`)

> See [packages/react/CHANGELOG.md](./packages/react/CHANGELOG.md) for full release notes.

## [0.20.0] - 2026-06-10

### Changed

#### `@tinybigui/react`

- **Snackbar** — MD3 slot-based architecture refactor; inverse-surface state layers on action and close buttons; spring-standard enter/exit motion with position-aware slide; dedicated action/close slot CVAs; two-line density and close button sizing fixes

> See [packages/react/CHANGELOG.md](./packages/react/CHANGELOG.md) for full release notes.

## [0.19.0] - 2026-06-10

### Changed

#### `@tinybigui/react`

- **Slider** — MD3 expressive variants-vs-states architecture refactor; spring motion tokens; absolute track positioning for range/vertical alignment; vertical handle per-size widths; `renderThumbContent` and `onThumbDraggingChange` on `SliderHeadless`; value indicator CSS-driven visibility with Tailwind v4 `scale` transitions

> See [packages/react/CHANGELOG.md](./packages/react/CHANGELOG.md) for full release notes.

## [0.18.0] - 2026-06-10

### Changed

#### `@tinybigui/react`

- **Search** — MD3 expressive variants-vs-states architecture refactor; per-slot CVAs for SearchBar and SearchView; React Aria hover/focus with sibling focus ring; layout-aware enter motion (docked scale-in, fullscreen fade-in); MD3 SVG icons replace literal glyphs; search variant CVA exports added

> See [packages/react/CHANGELOG.md](./packages/react/CHANGELOG.md) for full release notes.

## [0.17.0] - 2026-06-10

### Changed

#### `@tinybigui/react`

- **Radio** — MD3 expressive variants-vs-states architecture refactor; slot-based CVA with `group-data-[x]/radio` selectors; div-based state layer, outer ring, inner dot, and MD3 focus ring; spring motion tokens; fixes `isInvalid` forwarding in `RadioGroup`

> See [packages/react/CHANGELOG.md](./packages/react/CHANGELOG.md) for full release notes.

## [0.16.0] - 2026-06-10

### Changed

#### `@tinybigui/react`

- **Progress** — MD3 expressive slot-based CVA refactor; colorful `primary-container` inactive track; 4dp indicator-track gap; new `shape` (`flat` | `wavy`) and `thickness` (`default` | `thick`) props; spring motion tokens; wavy SVG indicator with reduced-motion fallback

> See [packages/react/CHANGELOG.md](./packages/react/CHANGELOG.md) for full release notes.

## [0.15.0] - 2026-06-10

### Changed

#### `@tinybigui/react`

- **List** — MD3 expressive variants-vs-states architecture refactor; state layer and focus ring spans; spring motion tokens; slot CVAs for leading, trailing, and text; per-item `onAction` removed from `ListItemProps` (breaking — use List-level `onAction`)

> See [packages/react/CHANGELOG.md](./packages/react/CHANGELOG.md) for full release notes.

## [0.14.0] - 2026-06-10

### Changed

#### `@tinybigui/react`

- **TextField** — MD3 expressive variants-vs-states architecture refactor; `prefix` and `suffix` props; notched outline (outlined variant), state layer and active indicator (filled variant); spring motion tokens; supporting text + counter on one flex row; `size` prop and `TextFieldSize` type removed (breaking)

> See [packages/react/CHANGELOG.md](./packages/react/CHANGELOG.md) for full release notes.

## [0.13.0] - 2026-06-10

### Changed

#### `@tinybigui/react`

- **DatePicker** — MD3 expressive two-axis slot architecture refactor; styled slot injection API (`CalendarCore.slots`, `DatePickerActions.ButtonComponent`); removed legacy CVA variant axes and old exported variant names; popover anchors to field group; calendar grid centering; modal/scrim positioning fix

#### `@tinybigui/tokens`

- Version bump aligned with `@tinybigui/react` v0.13.0

> See [packages/react/CHANGELOG.md](./packages/react/CHANGELOG.md) for full release notes.

## [0.12.0] - 2026-06-09

### Changed

#### `@tinybigui/react`

- **Divider** — MD3 expressive slot-based CVA refactor; background-fill styling (`bg-outline-variant`) matching `@material/web`; `--md-divider-thickness` CSS custom property; logical RTL insets (`ms-*` / `me-*`); `label` prop removed (subheader variant not in MD3 spec)

#### `@tinybigui/tokens`

- Version bump aligned with `@tinybigui/react` v0.12.0

> See [packages/react/CHANGELOG.md](./packages/react/CHANGELOG.md) for full release notes.

## [0.11.2] - 2026-06-09

### Changed

#### `@tinybigui/react`

- **Tabs** — MD3 expressive styling refactor with variants-vs-states architecture; `tabStateLayerVariants` slot replacing pseudo-element overlays; correct primary/secondary active-indicator tokens and spring motion; content-width primary indicator with `ResizeObserver`; exports `tabStateLayerVariants`

> See [packages/react/CHANGELOG.md](./packages/react/CHANGELOG.md) for full release notes.

## [0.11.1] - 2026-06-09

### Changed

#### `@tinybigui/react`

- **Card** — MD3 styling refactor: standard motion tier (`duration-spring-standard-default-effects`), corrected `CardMedia` 4:3 aspect ratio, `title-medium` headline typescale, broadened root transitions for disabled/outlined states; exports `cardStateLayerVariants` and `cardFocusRingVariants`

> See [packages/react/CHANGELOG.md](./packages/react/CHANGELOG.md) for full release notes.

## [0.11.0] - 2026-06-09

### Changed

#### `@tinybigui/react`

- **BottomSheet** — MD3 expressive handle refactor with variants-vs-states architecture; new `bottomSheetHandleStateLayerVariants` and `bottomSheetHandleFocusRingVariants` slots; React Aria hover/focus wiring via `data-*` attributes; presence-based `data-dragging` encoding

> See [packages/react/CHANGELOG.md](./packages/react/CHANGELOG.md) for full release notes.

## [0.10.0] - 2026-06-09

### Changed

#### `@tinybigui/react`

- **AppBar** — M3 expressive flexible slot-based variants-vs-states architecture; corrected subtitle type scales per MD3 spec; subtitle-driven height growth (136dp medium / 152dp large); scroll elevation via `data-scrolled` + group selectors; spring motion tokens; new slot CVA exports (`appBarVariants`, `appBarTitleVariants`, etc.)

#### `@tinybigui/tokens`

- AppBar spacing tokens: `--spacing-appbar-medium-subtitle` (136dp), `--spacing-appbar-large-subtitle` (152dp)

> See [packages/react/CHANGELOG.md](./packages/react/CHANGELOG.md) for breaking change details and migration notes.

## [0.9.0] - 2026-06-09

### Changed

#### `@tinybigui/react`

- **Chip** — MD3 expressive slot-based variants-vs-states architecture; per-type color token corrections; elevated surface support for all chip types; spring motion tokens; dedicated focus-ring and remove-button state-layer slots; new slot variant exports

> See [packages/react/CHANGELOG.md](./packages/react/CHANGELOG.md) for breaking change details and migration notes.

## [0.8.1] - 2026-06-09

### Changed

#### `@tinybigui/react`

- **Checkbox** — MD3 variants-vs-states architecture with slot-based CVA; spec-accurate 18dp checkmark and indeterminate icons; MD3 motion tokens and corrected state-layer opacities; dedicated focus-ring slot

> See [packages/react/CHANGELOG.md](./packages/react/CHANGELOG.md) for full details.

## [0.8.0] - 2026-06-09

### Changed

#### `@tinybigui/react`

- **Badge** — M3 expressive variants-vs-states architecture; removes non-spec `color` prop; anchors indicator to wrapped element's top-right corner per MD3 spec; adds `badgeStaticVariants` export for inline badge pills
- **DrawerItem** — Trailing config-based badge now renders inline static pill via `badgeStaticVariants`

> See [packages/react/CHANGELOG.md](./packages/react/CHANGELOG.md) for full breaking change details and migration notes.

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

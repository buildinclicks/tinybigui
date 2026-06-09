# TinyBigUI Roadmap

This document outlines the development roadmap for TinyBigUI, a Material Design 3 component library for React.

## Current Status

**Current Version:** v0.11.2 (released 2026-06-09)  
**Next Release:** v0.12.0  
**Status:** 29 components published to NPM; 2,025 tests passing

## Release Timeline

| Version | Phase   | Highlights                                                                                                                                         | Status              |
| ------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| v0.1.0  | 1a + 1b | Button, IconButton, FAB, TextField, Checkbox, Switch, Radio                                                                                        | Released 2026-04-15 |
| v0.2.0  | 2       | AppBar, Tabs, NavigationDrawer, NavigationBar                                                                                                      | Released 2026-04-25 |
| v0.3.0  | 3       | Dialog, Snackbar, Menu, Progress                                                                                                                   | Released 2026-05-13 |
| v0.4.0  | 4       | Card, List, Chip, Badge, Tooltip, Divider, Slider, Search, ButtonGroup, SplitButton, FABMenu, BottomSheet, DatePicker, TimePicker                  | Released 2026-06-07 |
| v0.4.1  | —       | Switch variants-vs-states architecture                                                                                                             | Released 2026-06-08 |
| v0.4.2  | —       | Button, ButtonGroup, IconButton MD3 alignment                                                                                                      | Released 2026-06-08 |
| v0.5.0  | —       | IconButton M3 Expressive sizing system                                                                                                             | Released 2026-06-08 |
| v0.6.0  | —       | FAB M3 Expressive slot architecture                                                                                                                | Released 2026-06-09 |
| v0.7.0  | —       | FABMenu M3 Expressive pill menu redesign                                                                                                           | Released 2026-06-09 |
| v0.8.0  | —       | Badge M3 expressive variants/states, icon-corner anchoring, `badgeStaticVariants` export                                                           | Released 2026-06-09 |
| v0.8.1  | —       | Checkbox MD3 variants-vs-states architecture, motion tokens, spec-accurate 18dp icons                                                              | Released 2026-06-09 |
| v0.9.0  | —       | Chip MD3 expressive slot architecture, per-type token corrections, elevated surface for all types                                                  | Released 2026-06-09 |
| v0.10.0 | —       | AppBar M3 expressive flexible slot architecture, subtitle type scales, subtitle-driven height growth, scroll elevation data attrs                  | Released 2026-06-09 |
| v0.11.0 | —       | BottomSheet MD3 expressive handle refactor, variants-vs-states architecture, state layer and focus ring slots                                      | Released 2026-06-09 |
| v0.11.1 | —       | Card MD3 styling refactor — standard motion tier, 4:3 media fix, title-medium headline, `cardStateLayerVariants` / `cardFocusRingVariants` exports | Released 2026-06-09 |
| v0.11.2 | —       | Tabs MD3 expressive refactor — variants-vs-states architecture, state-layer slot, spring indicator motion, content-width primary indicator         | Released 2026-06-09 |
| v1.0.0  | Stable  | API frozen, documentation site, migration guides                                                                                                   | Planned             |

## Completed Work

### Phase 1a — Core Buttons

| Component   | Status   |
| ----------- | -------- |
| Button      | Complete |
| IconButton  | Complete |
| FAB         | Complete |
| FABMenu     | Complete |
| ButtonGroup | Complete |
| SplitButton | Complete |

### Phase 1b — Form Components

| Component | Status   |
| --------- | -------- |
| TextField | Complete |
| Checkbox  | Complete |
| Switch    | Complete |
| Radio     | Complete |
| Slider    | Complete |

### Phase 2 — Navigation

| Component        | Status   |
| ---------------- | -------- |
| AppBar           | Complete |
| Tabs             | Complete |
| NavigationDrawer | Complete |
| NavigationBar    | Complete |
| Search           | Complete |

### Phase 3 — Feedback

| Component   | Status   |
| ----------- | -------- |
| Dialog      | Complete |
| Snackbar    | Complete |
| Menu        | Complete |
| Progress    | Complete |
| BottomSheet | Complete |
| Tooltip     | Complete |

### Phase 4 — Data Display

| Component  | Status   |
| ---------- | -------- |
| Card       | Complete |
| List       | Complete |
| Chip       | Complete |
| Badge      | Complete |
| Divider    | Complete |
| DatePicker | Complete |
| TimePicker | Complete |

### Infrastructure

- [x] Monorepo setup with pnpm workspaces
- [x] TypeScript strict mode configuration
- [x] Tailwind CSS v4 integration with MD3 tokens
- [x] React Aria accessibility primitives
- [x] CVA variant management with variants-vs-states architecture
- [x] Vitest + React Testing Library (2,025 tests)
- [x] Storybook 10 documentation
- [x] ESLint + Prettier configuration
- [x] Husky + Commitlint for commit standards
- [x] GitHub Actions CI/CD pipeline
- [x] NPM publishing with provenance attestation
- [x] Changesets release management

## Planned Work

### Phase 5 — Data & Advanced

- Table (data tables with sorting and pagination)
- Autocomplete
- Data Grid

### Phase 6 — Stable Release

- Documentation site at [tinybigui.dev](https://tinybigui.dev)
- Performance and bundle size optimization
- Migration guides for pre-1.0 API changes
- v1.0.0 stable release with frozen API

## Versioning Policy

TinyBigUI follows [Semantic Versioning](https://semver.org/).

**Pre-1.0 releases (v0.x.x):**

- API may change between minor versions
- Breaking changes are documented in the changelog
- Pin your version in package.json

**Post-1.0 releases (v1.x.x):**

- Breaking changes only in major versions
- New features in minor versions
- Bug fixes in patch versions

## Contributing

We welcome contributions. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Feature Requests

Have an idea for a new component or feature? Open a [feature request](https://github.com/buildinclicks/tinybigui/issues/new?template=feature_request.md) on GitHub.

## Stay Updated

- Watch this repository for release notifications
- Check the [Changelog](CHANGELOG.md) for release notes
- See [packages/react/CHANGELOG.md](packages/react/CHANGELOG.md) for detailed per-version notes

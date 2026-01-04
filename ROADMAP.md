# TinyBigUI Roadmap

This document outlines the development roadmap for TinyBigUI, a Material Design 3 component library for React.

## Current Status

**Current Version:** Pre-release (v0.0.x)  
**Next Release:** v0.1.0  
**Status:** Phase 1 in progress

## Release Timeline

| Version | Phase   | Components                                           | Status      |
| ------- | ------- | ---------------------------------------------------- | ----------- |
| v0.1.0  | 1a + 1b | Button, IconButton, FAB, TextField, Checkbox, Switch | In Progress |
| v0.2.0  | 2       | AppBar, Tabs, Drawer, Bottom Navigation              | Planned     |
| v0.3.0  | 3       | Dialog, Snackbar, Menu, Progress Indicators          | Planned     |
| v0.4.0  | 4       | Card, List, Chip, Table                              | Planned     |
| v1.0.0  | -       | Stable release, API frozen                           | Planned     |

## Completed Work

### Phase 1a - Core Buttons

| Component  | Tests | Status   |
| ---------- | ----- | -------- |
| Button     | 53    | Complete |
| IconButton | 49    | Complete |
| FAB        | 51    | Complete |

**Total:** 153 tests passing

### Infrastructure

- [x] Monorepo setup with pnpm workspaces
- [x] TypeScript strict mode configuration
- [x] Tailwind CSS v4 integration with MD3 tokens
- [x] React Aria accessibility primitives
- [x] CVA variant management
- [x] Vitest + React Testing Library setup
- [x] Storybook 10 documentation
- [x] ESLint + Prettier configuration
- [x] Husky + Commitlint for commit standards
- [x] GitHub Actions CI/CD pipeline

## In Progress

### Phase 1b - Form Components

| Component | Tests | Status      |
| --------- | ----- | ----------- |
| TextField | -     | Not started |
| Checkbox  | -     | Not started |
| Switch    | -     | Not started |

## Planned Work

### Phase 2 - Navigation

- AppBar (top app bar with actions)
- Tabs (scrollable and fixed tabs)
- Drawer (navigation drawer)
- Bottom Navigation

### Phase 3 - Feedback

- Dialog (modal dialogs)
- Snackbar (toast notifications)
- Menu (dropdown and context menus)
- Progress Indicators (linear and circular)

### Phase 4 - Data Display

- Card (content containers)
- List (vertical lists with items)
- Chip (compact elements for input, attributes, or actions)
- Table (data tables)

### Phase 5 - Advanced Components

- Date Picker
- Autocomplete
- Data Grid
- Slider
- Tooltip

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

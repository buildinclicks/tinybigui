# Contributing to TinyBigUI

Thank you for considering contributing to TinyBigUI. This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Version Management](#version-management)
- [Component Development](#component-development)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Be kind, constructive, and professional in all interactions.

## Getting Started

### Prerequisites

- Node.js 20 or higher
- pnpm 9 or higher
- Git

### Development Setup

1. Fork the repository on GitHub

2. Clone your fork:

   ```bash
   git clone https://github.com/YOUR_USERNAME/tinybigui.git
   cd tinybigui
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Start the development environment:

   ```bash
   pnpm dev
   ```

5. Run Storybook for component development:
   ```bash
   pnpm storybook
   ```

## Project Structure

```
tinybigui/
├── packages/
│   ├── react/           # React component library
│   │   └── src/
│   │       ├── components/   # UI components
│   │       ├── hooks/        # Custom hooks
│   │       └── utils/        # Utility functions
│   └── tokens/          # Design tokens (CSS)
├── .storybook/          # Storybook configuration
└── .github/             # GitHub templates and workflows
```

### Component File Structure

Each component follows this structure:

```
ComponentName/
├── ComponentName.tsx           # Main styled component
├── ComponentNameHeadless.tsx   # Headless primitive (React Aria)
├── ComponentName.variants.ts   # CVA variant definitions
├── ComponentName.types.ts      # TypeScript interfaces
├── ComponentName.test.tsx      # Unit tests
├── ComponentName.stories.tsx   # Storybook stories
└── index.ts                    # Public exports
```

## Development Workflow

### Branch Naming

Create branches with descriptive names using this format:

```
type/description

Examples:
feat/textfield-component
fix/button-disabled-state
docs/readme-installation
test/iconbutton-keyboard-tests
```

### Workflow Steps

1. Create a branch from `dev`:

   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feat/your-feature
   ```

2. Make your changes following the coding standards

3. Write or update tests

4. Run the test suite:

   ```bash
   pnpm test
   ```

5. Run linting and type checking:

   ```bash
   pnpm lint
   pnpm typecheck
   ```

6. Commit your changes (see commit guidelines below)

7. Push and create a pull request

## Coding Standards

### TypeScript

- Use strict mode (no `any` types)
- Define explicit types for all function parameters and return values
- Use `interface` for object shapes, `type` for unions and aliases
- Export types separately using `export type`

### React

- Use functional components with hooks
- Add `'use client'` directive to interactive components
- Use `forwardRef` for components that accept refs
- Destructure props at the top of the component

### Styling

- Use Tailwind CSS classes exclusively
- Never use inline styles or CSS-in-JS
- Use the `cn()` utility for conditional class merging
- Follow Material Design 3 specifications

### Accessibility

- Use React Aria hooks for all interactive components
- Never implement keyboard handling or ARIA manually
- Ensure WCAG 2.1 AA compliance
- Test with keyboard navigation and screen readers

## Testing Requirements

All components must have comprehensive tests covering:

1. **Rendering** - Default props and all variants
2. **Interactions** - Click, keyboard, focus events
3. **Accessibility** - ARIA attributes and keyboard navigation
4. **Customization** - className merging, ref forwarding

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test -- --coverage
```

### Test Coverage

Maintain a minimum of 85% code coverage. New components should aim for 90%+.

## Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) for clear, consistent commit history.

### Format

```
type(scope): description

[optional body]

[optional footer]
```

### Types

| Type       | Description                              |
| ---------- | ---------------------------------------- |
| `feat`     | New feature or component                 |
| `fix`      | Bug fix                                  |
| `docs`     | Documentation changes                    |
| `test`     | Adding or updating tests                 |
| `refactor` | Code refactoring without behavior change |
| `style`    | Code formatting (no logic change)        |
| `chore`    | Maintenance tasks                        |
| `perf`     | Performance improvements                 |

### Examples

```bash
feat(button): add loading state with spinner
fix(textfield): resolve focus ring not showing on Safari
docs(readme): add installation instructions for pnpm
test(checkbox): add keyboard navigation tests
refactor(fab): simplify variant logic
```

### Commit Message Guidelines

- Use present tense ("add feature" not "added feature")
- Use lowercase for the description
- Keep the first line under 72 characters
- Reference issues when applicable: `fix(button): resolve hover state (#42)`

## Pull Request Process

### Before Submitting

1. Ensure all tests pass
2. Ensure linting passes with no errors
3. Ensure TypeScript compilation succeeds
4. Update documentation if needed
5. Add Storybook stories for new components

### PR Description

Use the pull request template and include:

- Clear description of changes
- Related issue numbers
- Screenshots for visual changes
- Testing notes

### Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, a maintainer will merge

### After Merge

- Delete your feature branch
- Pull the latest `dev` branch

## Version Management

TinyBigUI uses [Changesets](https://github.com/changesets/changesets) to manage version bumps and changelog generation across the monorepo.

### What is a Changeset?

A changeset is a small markdown file that describes a change and specifies the semantic version bump it requires (`major`, `minor`, or `patch`). It is committed alongside the code change in the same PR. Changesets are later consumed by maintainers to bump package versions and update `CHANGELOG.md` automatically.

### When to Create a Changeset

Create a changeset for any PR that changes user-facing behavior, including:

- Adding a new component or feature
- Fixing a bug that affects consumers
- Making a breaking change to a public API

You do **not** need a changeset for internal refactors, test-only changes, or documentation updates that do not affect the published packages.

### Creating a Changeset

From the repo root, run:

```bash
pnpm changeset
```

The CLI will prompt you to:

1. Select which packages are affected (`@tinybigui/react`, `@tinybigui/tokens`, or both)
2. Choose the bump type (`major`, `minor`, or `patch`)
3. Write a short summary of the change

This creates a file in `.changeset/`. Commit this file with your PR.

### Maintainer Release Workflow

Publishing to NPM is fully automated via GitHub Actions. When a GitHub Release is created, the [release workflow](.github/workflows/release.yml) runs the full quality gate and publishes both packages with supply-chain provenance attestation.

**Prerequisites:** A repository secret named `NPM_TOKEN` must be configured in GitHub repository Settings → Secrets → Actions. This token must have publish access to the `@tinybigui` npm org.

**Step-by-step release process:**

1. Ensure all milestones for the release are complete and merged to `main`
2. On the `release/vX.X.X` branch, run `pnpm version-packages` to consume all pending changesets, bump `package.json` versions, and update `CHANGELOG.md`
3. Commit the version bump: `chore: version packages for vX.X.X`
4. Open and merge the release branch PR into `main` (no squash)
5. On GitHub, create a new Release with tag `vX.X.X` pointing to `main`
6. The release workflow triggers automatically and publishes `@tinybigui/tokens` then `@tinybigui/react` to NPM

The `version-packages` command reads all `.changeset/*.md` files, applies version bumps to `package.json` files, appends entries to `CHANGELOG.md`, and deletes the consumed changeset files.

> **Note:** Do not run `pnpm version-packages` on a feature branch. This is only done on the release branch (`release/vX.X.X`) immediately before merging to `main`.
>
> **Note:** Do not run `pnpm publish` manually. The automated workflow enforces the full quality gate before any package reaches NPM.

## Component Development

### Architecture

TinyBigUI uses a three-layer architecture:

1. **Layer 1: React Aria** - Accessibility primitives (foundation)
2. **Layer 2: Headless Component** - Behavior without styling
3. **Layer 3: Styled Component** - Full MD3 implementation

### Development Process

We follow Test-Driven Development (TDD):

1. Write tests first based on component requirements
2. Create type definitions
3. Implement the headless component using React Aria
4. Define CVA variants
5. Create the styled component
6. Add Storybook stories
7. Run tests and verify all pass

### Material Design 3 Compliance

- Follow MD3 specifications exactly
- Use MD3 design tokens via Tailwind classes
- Implement all required variants
- Follow MD3 interaction patterns (ripple, state layers)

### Resources

- [Material Design 3](https://m3.material.io/)
- [React Aria](https://react-spectrum.adobe.com/react-aria/)
- [CVA Documentation](https://cva.style/docs)
- [Tailwind CSS](https://tailwindcss.com/)

## Questions?

If you have questions about contributing, open a discussion on GitHub or reach out to the maintainers.

Thank you for contributing to TinyBigUI.

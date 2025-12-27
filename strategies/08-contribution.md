# Contribution & Open Source Strategy

> **Status**: ✅ Decided  
> **Last Updated**: December 24, 2025

## 🎯 Overview

This document outlines how we'll run TinyBigUI as an open-source project, including contribution guidelines, community management, and governance.

---

## 📜 Open Source Philosophy

### Core Values

1. **Welcoming**: Friendly to contributors of all skill levels
2. **Transparent**: Open decision-making process
3. **Quality**: High standards for code and documentation
4. **Collaborative**: Community input valued and considered
5. **Sustainable**: Maintainable long-term

### Code of Conduct

Adopt **Contributor Covenant** - industry standard:

```markdown
# Code of Conduct

## Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

## Our Standards

**Positive behavior**:
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable behavior**:
- Harassment, trolling, or derogatory comments
- Publishing others' private information
- Unprofessional conduct

## Enforcement

Report violations to [maintainers@tinybigui.dev]. All complaints will be reviewed and investigated.
```

---

## 🤝 How to Contribute

### Types of Contributions

| Contribution | Skill Level | Impact |
|--------------|-------------|--------|
| **Report bugs** | Beginner | High |
| **Improve docs** | Beginner | High |
| **Write tests** | Intermediate | High |
| **Fix bugs** | Intermediate | High |
| **Add components** | Advanced | High |
| **Accessibility improvements** | Intermediate | Very High |
| **Performance optimization** | Advanced | Medium |
| **Design tokens** | Intermediate | Medium |

### Getting Started

#### Step 1: Set Up Development Environment

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/tinybigui.git
cd tinybigui

# Install dependencies
pnpm install

# Run tests
pnpm test

# Start Storybook
pnpm storybook
```

#### Step 2: Find an Issue

Look for issues labeled:
- `good first issue` - Great for beginners
- `help wanted` - Need community help
- `bug` - Bug fixes needed
- `enhancement` - New features
- `documentation` - Docs improvements

#### Step 3: Discuss Before Building

- For bug fixes: Just submit a PR
- For new features: Create an issue first, discuss approach
- For large changes: Discuss in GitHub Discussions

#### Step 4: Create a Branch

```bash
git checkout -b feature/button-loading-state
# or
git checkout -b fix/textfield-focus-ring
```

#### Step 5: Make Changes

Follow our coding standards (see below).

#### Step 6: Write Tests

All changes must include tests:

```typescript
// Component tests
describe('Button', () => {
  it('renders correctly', () => { })
  it('handles click events', () => { })
  it('has no a11y violations', () => { })
})
```

#### Step 7: Update Documentation

- Add/update Storybook stories
- Update JSDoc comments
- Update README if needed

#### Step 8: Submit Pull Request

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests
- [ ] Tested in Storybook

## Accessibility
- [ ] No a11y violations
- [ ] Keyboard navigation works
- [ ] Screen reader tested

## Checklist
- [ ] Code follows style guide
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
```

---

## 📋 Coding Standards

### TypeScript

```typescript
// ✅ Do: Use explicit types
export interface ButtonProps extends AriaButtonProps {
  variant?: 'filled' | 'outlined'
}

// ❌ Don't: Use any
export interface ButtonProps {
  props: any
}

// ✅ Do: Use const assertions
const variants = ['filled', 'outlined'] as const

// ✅ Do: Document with JSDoc
/**
 * A button component following Material Design 3
 * @example
 * <Button variant="filled">Click me</Button>
 */
export function Button(props: ButtonProps) { }
```

### React

```typescript
// ✅ Do: Use forwardRef for refs
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => { }
)

// ✅ Do: Explicit 'use client' for client components
'use client'
export function Button() { }

// ✅ Do: Destructure props
function Button({ variant, size, children, ...rest }) { }

// ❌ Don't: Use inline styles
<button style={{ color: 'red' }} />  // No!

// ✅ Do: Use Tailwind classes
<button className="text-red-500" />  // Yes!
```

### Naming Conventions

```typescript
// Components: PascalCase
export function Button() { }
export function TextField() { }

// Hooks: camelCase with 'use' prefix
export function useTheme() { }
export function useRipple() { }

// Utilities: camelCase
export function cn() { }
export function generateColorScheme() { }

// Constants: UPPER_SNAKE_CASE
export const MAX_RETRY_ATTEMPTS = 3

// Types/Interfaces: PascalCase
export interface ButtonProps { }
export type ButtonVariant = 'filled' | 'outlined'
```

### File Structure

```
component-name/
├── component-name.tsx           # Main component
├── component-name-headless.tsx  # Headless version
├── component-name.variants.ts   # CVA variants
├── component-name.types.ts      # TypeScript types
├── component-name.test.tsx      # Tests
├── component-name.stories.tsx   # Storybook
└── index.ts                     # Exports
```

### Import Order

```typescript
// 1. React imports
import { forwardRef } from 'react'

// 2. External libraries
import { useButton } from 'react-aria'
import { cva } from 'class-variance-authority'

// 3. Internal components
import { Icon } from '../icon'

// 4. Internal utilities
import { cn } from '../../utils/cn'

// 5. Types
import type { ButtonProps } from './button.types'

// 6. Styles (if any)
import './button.css'
```

### Testing Standards

```typescript
// ✅ Comprehensive test structure
describe('Component', () => {
  describe('Rendering', () => {
    it('renders with default props', () => { })
    it('renders all variants', () => { })
  })
  
  describe('Interactions', () => {
    it('handles user events', () => { })
  })
  
  describe('Accessibility', () => {
    it('has no violations', async () => {
      const { container } = render(<Component />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
  
  describe('Customization', () => {
    it('accepts custom className', () => { })
  })
})
```

---

## 🔍 Code Review Process

### For Contributors

Your PR will be reviewed for:
1. **Functionality**: Does it work as intended?
2. **Tests**: Are there adequate tests?
3. **Accessibility**: Any a11y issues?
4. **Code Quality**: Follows standards?
5. **Documentation**: Is it documented?
6. **Performance**: Any performance concerns?

### Review Timeline

- **Initial response**: Within 48 hours
- **Full review**: Within 1 week
- **Feedback incorporation**: Ongoing
- **Merge**: When approved by 1+ maintainer

### Getting Your PR Merged Faster

- [ ] Write clear PR description
- [ ] Include screenshots/videos for visual changes
- [ ] Ensure CI passes (tests, linting)
- [ ] Respond to feedback quickly
- [ ] Keep PR focused (one feature/fix)
- [ ] Update if conflicts arise

---

## 🏷️ Issue Labels

### Type Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Docs improvements
- `question` - Questions or discussions
- `accessibility` - A11y improvements

### Priority Labels

- `priority: critical` - Security, major bugs
- `priority: high` - Important features/fixes
- `priority: medium` - Nice to have
- `priority: low` - Not urgent

### Status Labels

- `good first issue` - Beginner friendly
- `help wanted` - Need community help
- `wip` - Work in progress
- `blocked` - Waiting on something
- `needs discussion` - Needs team input

### Component Labels

- `component: button`
- `component: textfield`
- (One for each component)

---

## 🎖️ Recognition

### Contributors

All contributors are recognized:

1. **README**: Contributors section with GitHub avatars
2. **Release Notes**: Thank contributors in each release
3. **All Contributors Bot**: Automatic recognition

```markdown
## Contributors

Thanks to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START -->
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/contributor1">
        <img src="avatar" width="100px;" alt=""/>
        <br /><sub><b>Contributor Name</b></sub>
      </a>
      <br />💻 📖 🎨
    </td>
  </tr>
</table>
<!-- ALL-CONTRIBUTORS-LIST:END -->
```

### Contributor Tiers

- **Contributor**: 1+ merged PRs
- **Regular Contributor**: 5+ merged PRs
- **Core Contributor**: 20+ merged PRs + trusted reviewer
- **Maintainer**: Core team member

---

## 📢 Communication Channels

### GitHub

- **Issues**: Bug reports, feature requests
- **Discussions**: Q&A, ideas, general discussion
- **Pull Requests**: Code contributions

### Discord/Slack (Optional)

If community grows:
- `#general` - General chat
- `#help` - Get help using the library
- `#contributors` - Contributor coordination
- `#announcements` - Release announcements

### Social Media

- **Twitter**: [@tinybigui](https://twitter.com/tinybigui) - Updates
- **Blog**: Articles, tutorials, release notes

---

## 🗳️ Decision Making

### RFC Process (for major changes)

1. **Create RFC**: Open issue with `[RFC]` prefix
2. **Discussion**: Community feedback (1-2 weeks)
3. **Decision**: Maintainers decide with community input
4. **Implementation**: Approved RFCs can be implemented

### What Needs an RFC?

- Breaking changes
- New components with complex API
- Architectural changes
- Design system changes

### What Doesn't Need an RFC?

- Bug fixes
- Documentation
- Minor enhancements
- Internal refactoring

---

## 🚀 Release Process

### Release Schedule

- **Patch releases**: As needed (bug fixes)
- **Minor releases**: Every 2-3 weeks (new features)
- **Major releases**: When breaking changes needed

### Release Checklist

- [ ] All tests passing
- [ ] CHANGELOG updated
- [ ] Version bumped (npm version)
- [ ] Git tag created
- [ ] NPM publish
- [ ] GitHub release created
- [ ] Announcement published
- [ ] Documentation deployed

### Release Notes Template

```markdown
# v0.2.0

## ✨ New Features

- TextField component with filled and outlined variants (#123)
- Checkbox component with indeterminate state (#124)

## 🐛 Bug Fixes

- Button: Fixed focus ring color contrast (#125)
- IconButton: Fixed touch target size (#126)

## 📖 Documentation

- Added form integration examples
- Improved accessibility guide

## 🙏 Thanks

Thanks to @contributor1, @contributor2 for their contributions!
```

---

## 📊 Project Metrics

Track project health:

### Code Metrics

- Test coverage (target: >90%)
- Bundle size (track over time)
- TypeScript strict mode (always on)
- Linting issues (should be 0)

### Community Metrics

- GitHub stars
- NPM downloads/week
- Issues opened vs closed
- PR merge rate
- Response time to issues

### Quality Metrics

- Accessibility violations (target: 0)
- Bug reports per release
- Documentation coverage
- User satisfaction

---

## 🎓 Onboarding New Contributors

### Contributor Guide

Create `CONTRIBUTING.md`:

```markdown
# Contributing to TinyBigUI

Thanks for your interest! Here's how to get started:

## Development Setup

[Setup instructions]

## Finding Work

[How to find issues]

## Submitting Changes

[PR process]

## Getting Help

[Support channels]
```

### First Issue Assignment

When someone comments "I'd like to work on this":
1. Assign issue to them
2. Welcome them
3. Point to contributing guide
4. Offer help if needed

---

## 🛡️ Security

### Reporting Vulnerabilities

```markdown
## Security Policy

If you discover a security vulnerability, please email:
security@tinybigui.dev

Do NOT open a public issue.

We'll respond within 48 hours.
```

### Dependency Management

- Use Dependabot for automated updates
- Review security advisories weekly
- Update dependencies regularly

---

## 📄 License

### MIT License

```
MIT License

Copyright (c) 2025 TinyBigUI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

[Full MIT license text]
```

**Why MIT?**
- Most permissive open source license
- Business-friendly
- Used by React, Next.js, Tailwind
- Encourages adoption

---

## ✅ Launch Checklist

Before making repository public:

- [ ] README with clear description
- [ ] CONTRIBUTING.md
- [ ] CODE_OF_CONDUCT.md
- [ ] LICENSE
- [ ] .github/ISSUE_TEMPLATE/
- [ ] .github/PULL_REQUEST_TEMPLATE.md
- [ ] CI/CD set up
- [ ] Storybook deployed
- [ ] At least 3-4 components working
- [ ] Comprehensive documentation

---

## 🔗 References

- [Open Source Guide](https://opensource.guide/)
- [Contributor Covenant](https://www.contributor-covenant.org/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [All Contributors](https://allcontributors.org/)


# TinyBigUI Strategy Documents

Welcome to the TinyBigUI strategy documentation! This folder contains all strategic decisions, planning documents, and guidelines for building TinyBigUI.

## 📚 Documents Overview

### 🎯 [Overview](./00-overview.md)

High-level overview of the project vision, principles, and decisions made.

**Read this first** to understand the project's goals and philosophy.

### 🛠️ [Tech Stack](./01-tech-stack.md)

Complete technology decisions including:

- Core dependencies (React Aria, CVA, Tailwind)
- Development tools (tsup, Vitest, Storybook)
- Build configuration
- Performance considerations

### 🏗️ [Architecture](./02-architecture.md)

Code organization and patterns:

- Three-layer architecture (Styled → Headless → React Aria)
- Project structure
- Component templates
- Naming conventions
- Tree-shaking strategy

### 🎨 [Design System](./03-design-system.md)

Material Design 3 implementation:

- Design tokens (color, typography, elevation, shape, motion)
- Component roadmap by phase
- Theming strategy
- MD3 interactions (state layers, ripple)

### ♿ [Accessibility](./04-accessibility.md)

Accessibility-first approach:

- WCAG 2.1 AA compliance
- React Aria integration
- Keyboard navigation
- Screen reader support
- Testing strategy

### 📦 [Distribution](./05-distribution.md)

Packaging and publishing:

- Single package with tree-shaking
- NPM configuration
- Installation guide
- Framework compatibility
- Versioning strategy

### 📖 [Documentation](./06-documentation.md)

Documentation approach:

- Storybook setup
- Component documentation standards
- Story templates
- Visual design documentation

### 📅 [Roadmap](./07-roadmap.md)

Development timeline:

- 6 phases from foundation to v1.0.0
- Component priorities
- Milestone targets
- 18-week timeline

### 🤝 [Contribution](./08-contribution.md)

Open source guidelines:

- How to contribute
- Coding standards
- Code review process
- Community management
- MIT license

### ⚡ [Quick Reference](./09-quick-reference.md)

**One-page summary** of all decisions.

**Read this for a quick overview** of the entire strategy.

### 🤖 [Cursor Rules](./10-cursor-rules.md)

Cursor AI coding guidelines:

- TypeScript and React patterns
- Material Design 3 implementation rules
- Component development checklist
- Forbidden and required patterns

### 🔄 [Tailwind v4 Migration](./11-tailwind-v4-migration.md)

Comprehensive summary of Tailwind v4 decisions:

- What changed from v3 to v4
- Token strategy (CSS-first approach)
- Updated package structure
- User setup examples
- Browser baseline requirements

---

## 🚀 Quick Start

### New to the Project?

1. Read **[Quick Reference](./09-quick-reference.md)** (5 min read)
2. Review **[Overview](./00-overview.md)** for philosophy
3. Check **[Roadmap](./07-roadmap.md)** for current status
4. Read **[Contribution Guide](./08-contribution.md)** to get started

### Looking for Specific Information?

- **What technologies?** → [Tech Stack](./01-tech-stack.md)
- **How is code organized?** → [Architecture](./02-architecture.md)
- **How do we implement MD3?** → [Design System](./03-design-system.md)
- **How do we handle accessibility?** → [Accessibility](./04-accessibility.md)
- **How do users install it?** → [Distribution](./05-distribution.md)
- **How do we document components?** → [Documentation](./06-documentation.md)
- **What's the timeline?** → [Roadmap](./07-roadmap.md)
- **How do I contribute?** → [Contribution](./08-contribution.md)
- **What changed with Tailwind v4?** → [Tailwind v4 Migration](./11-tailwind-v4-migration.md)
- **What are the AI coding rules?** → [Cursor Rules](./10-cursor-rules.md)

---

## 🎯 Core Decisions Summary

| Decision            | Choice                                   | Document                               |
| ------------------- | ---------------------------------------- | -------------------------------------- |
| **Design System**   | Material Design 3 (strict)               | [Design System](./03-design-system.md) |
| **Framework**       | React 18+ with RSC support               | [Tech Stack](./01-tech-stack.md)       |
| **Styling**         | Tailwind v4 + CVA                        | [Tech Stack](./01-tech-stack.md)       |
| **Accessibility**   | React Aria foundation                    | [Accessibility](./04-accessibility.md) |
| **Architecture**    | Headless + Styled layers                 | [Architecture](./02-architecture.md)   |
| **Distribution**    | `@tinybigui/react` + `@tinybigui/tokens` | [Distribution](./05-distribution.md)   |
| **Documentation**   | Storybook (Next.js primary)              | [Documentation](./06-documentation.md) |
| **Testing**         | Vitest + RTL + Playwright                | [Tech Stack](./01-tech-stack.md)       |
| **License**         | MIT                                      | [Contribution](./08-contribution.md)   |
| **Target Audience** | Enterprise + Indie devs                  | [Overview](./00-overview.md)           |

---

## 📊 Project Status

**Current Phase**: Planning ✅ **COMPLETE**

**Next Phase**: Foundation Setup (Week 1-2)

**Target v1.0.0**: Week 18

---

## 🔄 Living Documents

These strategy documents are **living documents** that will evolve as we:

- Learn from implementation
- Receive community feedback
- Discover better approaches
- Adapt to changing requirements

**All changes are tracked** in git history. Major changes will be discussed in GitHub Discussions.

---

## 💡 Philosophy

Our strategy is built on these principles:

1. **Quality Over Speed** - Build it right, not fast
2. **Accessibility First** - Non-negotiable WCAG 2.1 AA
3. **Developer Experience** - Intuitive, well-documented, type-safe
4. **Material Design 3** - Strict adherence to specs
5. **Modularity** - True LEGO blocks
6. **Community** - Open, welcoming, collaborative

---

## 📝 Feedback Welcome

Have suggestions for the strategy? Please:

1. Open a GitHub Discussion
2. Create an issue with `strategy` label
3. Submit a PR to improve these docs

---

## 🙏 Acknowledgments

This strategy was developed with:

- Expertise from senior developers
- Best practices from successful open-source projects
- Guidance from Material Design 3 specifications
- Accessibility standards from WCAG/ARIA
- Community input and feedback

---

## 📧 Questions?

If anything is unclear:

- Open a GitHub Discussion
- Check the [Quick Reference](./09-quick-reference.md)
- Read the relevant detailed document
- Ask in our community channels (coming soon)

Let's build something amazing! 🎨✨

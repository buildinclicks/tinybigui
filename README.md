<div align="center">
  <h1>TinyBigUI</h1>
  <p>Material Design 3 component library for React</p>
  
  <p>
    <a href="https://github.com/buildinclicks/tinybigui/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/buildinclicks/tinybigui?style=flat-square" alt="MIT License" />
    </a>
    <a href="https://github.com/buildinclicks/tinybigui/actions/workflows/ci.yml">
      <img src="https://img.shields.io/github/actions/workflow/status/buildinclicks/tinybigui/ci.yml?style=flat-square" alt="CI Status" />
    </a>
    <a href="https://github.com/buildinclicks/tinybigui/stargazers">
      <img src="https://img.shields.io/github/stars/buildinclicks/tinybigui?style=flat-square" alt="GitHub Stars" />
    </a>
    <a href="https://www.npmjs.com/package/@tinybigui/react">
      <img src="https://img.shields.io/npm/v/@tinybigui/react?style=flat-square" alt="npm version" />
    </a>
  </p>

  <p>
    <strong>A modern, accessible, and customizable React component library built with Material Design 3, TypeScript, and Tailwind CSS v4.</strong>
  </p>
</div>

---

## ⚠️ Development Status

> **🚧 Work in Progress**
>
> TinyBigUI is currently in **Phase 0** (Foundation Setup) and is **not ready for production use**.
>
> We're actively building the foundation and core components. Star ⭐ or watch 👁️ this repository to follow our progress!

---

## ✨ Features

- 🎨 **Material Design 3** - Implements the latest MD3 design system with full token support
- ⚛️ **React 18+** - Built for modern React with hooks and concurrent features
- 🎯 **TypeScript First** - 100% TypeScript with full type safety and IntelliSense
- 🌙 **Dark Mode Built-in** - Automatic light/dark theme support based on system preferences
- ♿ **Accessibility** - WCAG 2.1 AA compliant with comprehensive keyboard navigation
- 🎨 **Tailwind CSS v4** - Powered by the latest Tailwind with utility-first styling
- 📦 **Tree-shakable** - Import only what you need, optimized bundle size
- 🧪 **Well Tested** - Comprehensive unit tests and component testing
- 🎭 **Storybook** - Interactive component documentation and testing
- 📚 **TypeScript Declarations** - Full type definitions included
- 🔧 **Customizable** - Easy theming and customization with CSS variables
- 🚀 **Modern Build** - ESM and CJS formats, optimized for all bundlers

---

## 🚀 Installation

> **Coming Soon!** The library will be available on npm once we reach Phase 1b.

```bash
# This will work soon:
npm install @tinybigui/react
# or
pnpm add @tinybigui/react
# or
yarn add @tinybigui/react
```

---

## 📖 Quick Start

> **Coming Soon!** Full documentation will be available at [tinybigui.dev](https://tinybigui.dev)

```tsx
// Preview of how it will work:
import { Button } from "@tinybigui/react";
import "@tinybigui/react/styles.css";

function App() {
  return (
    <div>
      <Button variant="filled" color="primary">
        Click me
      </Button>
      <Button variant="outlined" color="secondary">
        Learn more
      </Button>
    </div>
  );
}
```

---

## 📦 Packages

This is a monorepo containing multiple packages:

| Package                                  | Description                   | Version     | Status         |
| ---------------------------------------- | ----------------------------- | ----------- | -------------- |
| [`@tinybigui/react`](./packages/react)   | React components              | Coming soon | 🚧 In progress |
| [`@tinybigui/tokens`](./packages/tokens) | Design tokens (CSS variables) | Coming soon | 🚧 In progress |

---

## 🗺️ Roadmap

### Phase 0: Foundation ✅ (In Progress)

- [x] Monorepo setup (pnpm workspaces)
- [x] TypeScript configuration
- [x] Build tooling (tsup, PostCSS)
- [x] Tailwind CSS v4 integration
- [x] Material Design 3 design tokens (145 tokens)
- [x] Base utilities (color, typography, cn)
- [x] Testing setup (Vitest + React Testing Library)
- [x] Storybook 10 configuration
- [x] Code quality tools (ESLint, Prettier, Husky, lint-staged)
- [x] CI/CD (GitHub Actions)
- [x] Documentation structure

### Phase 1a: Core Buttons (Next)

- [ ] Button component
- [ ] IconButton component
- [ ] FloatingActionButton (FAB) component
- [ ] Comprehensive tests
- [ ] Storybook stories
- [ ] Accessibility compliance

### Phase 1b: Form Components

- [ ] TextField component
- [ ] Select component
- [ ] Checkbox component
- [ ] Radio component
- [ ] Switch component
- [ ] First npm release (v0.1.0)

### Phase 2: Layout & Navigation

- [ ] Card component
- [ ] Dialog component
- [ ] Drawer component
- [ ] Tabs component
- [ ] Navigation components
- [ ] Documentation site launch

### Phase 3: Data Display

- [ ] Table component
- [ ] List component
- [ ] Chip component
- [ ] Badge component
- [ ] Tooltip component

### Phase 4: Stable Release

- [ ] Performance optimization
- [ ] Bundle size optimization
- [ ] Comprehensive documentation
- [ ] Migration guides
- [ ] v1.0.0 stable release

---

## 🤝 Contributing

We welcome contributions! TinyBigUI is an open-source project and we're excited to build it with the community.

### How to Contribute

1. **Star the repo** ⭐ - Show your support!
2. **Report bugs** 🐛 - [Open an issue](https://github.com/buildinclicks/tinybigui/issues)
3. **Suggest features** 💡 - [Start a discussion](https://github.com/buildinclicks/tinybigui/discussions)
4. **Submit PRs** 🔧 - Help us build components!

### Development Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/tinybigui.git
cd tinybigui

# 2. Install dependencies (requires Node.js 18+ and pnpm 9+)
pnpm install

# 3. Start Storybook for development
pnpm storybook

# 4. Run tests
pnpm test

# 5. Build packages
pnpm build

# 6. Run linting
pnpm lint

# 7. Format code
pnpm format
```

### Project Structure

```
tinybigui/
├── packages/
│   ├── react/          # React components
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── utils/
│   │   │   └── index.ts
│   │   └── test/
│   └── tokens/         # Design tokens
│       └── src/
│           └── tokens.css
├── docs/               # Task documentation
├── strategies/         # Project planning
└── .github/
    └── workflows/      # CI/CD
```

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add new button component
fix: resolve focus ring issue
docs: update installation guide
style: format code with prettier
refactor: simplify color utilities
test: add button accessibility tests
chore: update dependencies
```

### Code Quality

All contributions must pass:

- ✅ ESLint (no errors, zero warnings)
- ✅ Prettier (formatted code)
- ✅ TypeScript (no type errors)
- ✅ Tests (all passing)
- ✅ Build (successful compilation)

These are automatically checked via Git hooks and CI/CD.

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test -- --coverage

# Type check
pnpm typecheck
```

---

## 📚 Documentation

- **GitHub Repository**: [github.com/buildinclicks/tinybigui](https://github.com/buildinclicks/tinybigui)
- **Documentation Site**: Coming soon at [tinybigui.dev](https://tinybigui.dev)
- **Storybook**: Coming soon (interactive component playground)
- **Task Docs**: See [/docs](/docs) for detailed task completion documentation

---

## 🎯 Design Philosophy

TinyBigUI is built on these core principles:

1. **Accessibility First** - Every component is keyboard navigable and screen reader friendly
2. **Type Safety** - Full TypeScript support with no compromises
3. **Performance** - Optimized bundle sizes and runtime performance
4. **Customization** - Easy to theme and customize without fighting the library
5. **Developer Experience** - Clear APIs, great documentation, helpful error messages
6. **Standards-Based** - Follows Material Design 3 specifications faithfully
7. **Modern Stack** - Uses the latest stable versions of React, TypeScript, and Tailwind

---

## 🛠️ Tech Stack

- **React** 18.3+ - UI framework
- **TypeScript** 5.7+ - Type safety
- **Tailwind CSS** v4 - Styling framework
- **Material Design 3** - Design system
- **Vitest** - Unit testing
- **React Testing Library** - Component testing
- **Storybook** 10 - Component development
- **tsup** - Build tool
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **pnpm** - Package manager
- **GitHub Actions** - CI/CD

---

## 📄 License

MIT © [buildinclicks](https://github.com/buildinclicks)

See [LICENSE](./LICENSE) for details.

---

## 🙏 Acknowledgments

TinyBigUI stands on the shoulders of giants:

- **[Material Design 3](https://m3.material.io/)** - Design system and guidelines
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Inspiration for accessibility patterns
- **[Chakra UI](https://chakra-ui.com/)** - Inspiration for component API design
- **[Mantine](https://mantine.dev/)** - Inspiration for developer experience
- **[React](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type system

Special thanks to all open-source contributors who make projects like this possible! 💙

---

## 🌟 Show Your Support

If you like this project, please consider:

- ⭐ Starring the repository
- 👁️ Watching for updates
- 🐦 Sharing on social media
- 💬 Joining discussions
- 🔧 Contributing code or documentation

---

<div align="center">
  <p>
    <strong>Built with ❤️ by <a href="https://github.com/buildinclicks">buildinclicks</a></strong>
  </p>
  <p>
    <a href="https://github.com/buildinclicks/tinybigui">GitHub</a> •
    <a href="https://github.com/buildinclicks/tinybigui/issues">Issues</a> •
    <a href="https://github.com/buildinclicks/tinybigui/discussions">Discussions</a>
  </p>
</div>

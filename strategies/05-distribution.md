# Distribution Strategy

> **Status**: ✅ Decided  
> **Last Updated**: December 24, 2025

## 🎯 Overview

This document outlines how TinyBigUI will be packaged, published, and consumed by users.

---

## 📦 Package Structure

### Single Package with Tree-Shaking

**Decision**: Distribute as a single NPM package with excellent tree-shaking support.

**Package Name**: `@tinybigui/react` (scoped, allows future expansion)

**Additional Packages**:

- `@tinybigui/tokens` - Design tokens (CSS variables, Tailwind preset)

### Package Exports

```json
{
  "name": "@tinybigui/react",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./styles.css": "./dist/styles.css",
    "./package.json": "./package.json"
  },
  "files": ["dist", "README.md", "LICENSE"],
  "sideEffects": false
}
```

**Key Features**:

- ✅ **Dual ESM/CJS** for maximum compatibility
- ✅ **`sideEffects: false`** for aggressive tree-shaking
- ✅ **TypeScript declarations** included
- ✅ **Separate CSS export** for user control

---

## 🌲 Tree-Shaking Strategy

### How It Works

Users import only what they need:

```typescript
// User imports 2 components
import { Button, TextField } from "@tinybigui/react";

// Bundler includes ONLY:
// ✅ Button component + dependencies
// ✅ TextField component + dependencies
// ✅ Shared utilities (cn, React Aria hooks)
// ✅ CSS for these components (if using modular CSS)

// ❌ Other 50+ components are excluded
```

### Requirements for Tree-Shaking

1. ✅ **Named exports only** (no default exports)
2. ✅ **`sideEffects: false`** in package.json
3. ✅ **ESM format** as primary
4. ✅ **Separate component files**
5. ✅ **No top-level side effects**

### Bundle Size Expectations

| Import         | Expected Gzipped Size |
| -------------- | --------------------- |
| Single Button  | ~8-12 KB              |
| 5 components   | ~25-30 KB             |
| All components | ~45-50 KB             |

**Target**: Keep full library under 50KB gzipped.

---

## 🎨 Style Distribution

### CSS Import Strategy

**Users must import CSS separately**:

```typescript
// User's app entry point (main.tsx, _app.tsx, etc.)
import "@tinybigui/react/styles.css";
import { Button, TextField } from "@tinybigui/react";
```

**Rationale**:

- Explicit control over when styles load
- Works with SSR/SSG frameworks
- No magic auto-importing
- Clear dependency on styles

### Tailwind Preset

**TailwindCSS v4 is required**.

We do **not** ship a JS Tailwind preset as the primary integration (CSS-first strategy).

**For Tailwind users (recommended happy path)**:
- Ensure Tailwind v4 is installed and working in your app (via your framework's Tailwind setup)
- Import `@tinybigui/react/styles.css`

**Troubleshooting (if styles are missing)**:
In some monorepo / library scenarios, Tailwind may not scan external sources automatically. Ensure Tailwind is configured to include `@tinybigui/react` sources per Tailwind v4 guidance for adding external sources to scanning.

```javascript
// User's tailwind.config.js
module.exports = {
  // Tailwind v4 generally auto-detects sources; only add config if needed
};
```

**Preset includes**:

- MD3 design tokens as Tailwind theme
- Custom utilities for MD3 components
- Animation keyframes
- Color palette

---

## 📥 Installation & Setup

### Installation

```bash
# pnpm (enforced for contributors, recommended for users)
pnpm add @tinybigui/react

# npm
npm install @tinybigui/react

# yarn
yarn add @tinybigui/react
```

### Peer Dependencies

Users must have:

```json
{
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tailwindcss": "^4.0.0"
  },
  "packageManager": "pnpm@8.15.0"
}
```

**Note**: `packageManager` field enforces pnpm for consistency across contributors.

### Setup Guide

#### Step 1: Install Dependencies

```bash
pnpm add @tinybigui/react react react-dom tailwindcss
```

#### Step 2: Import Styles

```typescript
// src/main.tsx or src/index.tsx
import "@tinybigui/react/styles.css";
```

#### Step 3: Configure Tailwind

```javascript
// tailwind.config.js
module.exports = {
  // Tailwind v4 generally auto-detects sources; only add config if needed
};
```

#### Step 4: (Optional) Theme Provider

```typescript
// src/App.tsx
import { ThemeProvider } from "@tinybigui/react";

function App() {
  return <ThemeProvider defaultMode="light">{/* Your app */}</ThemeProvider>;
}
```

#### Step 5: Start Using

```typescript
import { Button, TextField, Checkbox } from "@tinybigui/react";

function MyComponent() {
  return (
    <>
      <Button variant="filled">Click me</Button>
      <TextField label="Email" type="email" />
      <Checkbox>I agree</Checkbox>
    </>
  );
}
```

---

## 📱 Framework Compatibility

### React 18+ (Primary Target)

Full support for:

- ✅ Create React App (CRA)
- ✅ Vite
- ✅ Next.js 13+ (App Router)
- ✅ Remix
- ✅ Gatsby
- ✅ Astro (with React integration)

### Next.js Specific Setup

```typescript
// next.config.js
module.exports = {
  transpilePackages: ["@tinybigui/react"], // If needed
};
```

```typescript
// app/layout.tsx (App Router)
import "@tinybigui/react/styles.css";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

### Server Components

Components are marked appropriately:

```typescript
// Client components have 'use client' directive
import { Button } from "@tinybigui/react"; // Client component

// Headless variants are RSC-compatible (no directive)
import { ButtonHeadless } from "@tinybigui/react"; // Can use in Server Components
```

---

## 🔄 Versioning & Updates

### Semantic Versioning

Strict adherence to semver:

- **Major (1.0.0)**: Breaking changes
- **Minor (0.1.0)**: New features, backwards compatible
- **Patch (0.0.1)**: Bug fixes

### Breaking Changes

We'll minimize breaking changes:

1. Deprecation warnings for 1 minor version before removal
2. Clear migration guides for major versions
3. Codemods for automated migrations (if feasible)

### Changelog

Maintain a detailed `CHANGELOG.md`:

```markdown
## [0.2.0] - 2025-01-15

### Added

- Chip component with all MD3 variants
- Menu component with keyboard navigation

### Changed

- Button: Improved ripple animation performance

### Fixed

- TextField: Focus ring now respects border radius

### Deprecated

- `Button.variant="legacy"` (will be removed in v0.3.0)
```

---

## 📊 Bundle Analysis

### For Users

Provide bundle analysis tools:

```bash
# Check what you're importing
npx @tinybigui/cli analyze

# Output:
# Components: Button (8.2 KB), TextField (12.5 KB)
# Total: 20.7 KB (gzipped)
# Dependencies: react-aria/button, react-aria/textfield
```

### For Maintainers

CI/CD includes bundle size checks:

```yaml
# .github/workflows/ci.yml
- name: Check bundle size
  run: |
    pnpm build
    pnpm run size-limit
```

```json
// package.json
{
  "size-limit": [
    {
      "name": "Button",
      "path": "dist/index.js",
      "import": "{ Button }",
      "limit": "10 KB"
    },
    {
      "name": "All components",
      "path": "dist/index.js",
      "limit": "50 KB"
    }
  ]
}
```

---

## 🚀 Publishing Process

### Pre-publish Checklist

- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] Version bumped (npm version)
- [ ] Git tag created

### Publishing Script

```json
{
  "scripts": {
    "prepublishOnly": "pnpm test && pnpm build",
    "publish:patch": "npm version patch && npm publish",
    "publish:minor": "npm version minor && npm publish",
    "publish:major": "npm version major && npm publish"
  }
}
```

### NPM Tags

- `latest`: Stable releases
- `next`: Beta releases for testing
- `canary`: Nightly builds from main branch

```bash
# Publish beta
npm publish --tag next

# Install beta
npm install @tinybigui/react@next
```

---

## 📈 Usage Analytics (Optional)

**Decision**: No tracking by default (privacy-first)

If we add analytics:

- ✅ Opt-in only
- ✅ Anonymous
- ✅ Open source the analytics code
- ✅ No personal data collection
- ✅ Clear documentation on what's tracked

---

## 🆘 Support Channels

### GitHub Issues

- Bug reports
- Feature requests
- Questions (with Discussions)

### Documentation

- Comprehensive docs site
- API reference
- Migration guides
- Example projects

### Community

- GitHub Discussions for Q&A
- Discord/Slack (if demand exists)
- Stack Overflow tag

---

## 📦 CDN Distribution (Future)

For rapid prototyping:

```html
<!-- Not for production, but useful for demos -->
<script type="module">
  import { Button } from "https://esm.sh/@tinybigui/react";
</script>
```

**Decision**: Support this, but discourage for production.

---

## 🔗 Package Links

Will be available at:

- NPM: `https://npmjs.com/package/@tinybigui/react`
- Bundlephobia: `https://bundlephobia.com/package/@tinybigui/react`
- npm.runkit: Interactive playground
- JSR (Deno registry): If Deno adoption grows

---

## 🔗 References

- [NPM Package Best Practices](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Tree Shaking Guide](https://webpack.js.org/guides/tree-shaking/)
- [Package Exports](https://nodejs.org/api/packages.html#exports)
- [Semantic Versioning](https://semver.org/)

# Tech Stack Strategy

> **Status**: ✅ Decided  
> **Last Updated**: December 24, 2025

## 🎯 Overview

This document outlines all technology decisions for TinyBigUI, including core dependencies, development tools, and build infrastructure.

---

## 📦 Core Dependencies

### Required Dependencies

| Package | Version | Purpose | Rationale |
|---------|---------|---------|-----------|
| **react** | ^18.0.0 | UI framework | Peer dependency - React 18+ only |
| **react-dom** | ^18.0.0 | React rendering | Peer dependency |
| **react-aria** | latest | Accessibility primitives | World-class accessibility from Adobe |
| **react-aria-components** | latest | Pre-built accessible components | Higher-level React Aria abstractions |
| **clsx** | ^2.0.0 | Conditional className utility | Lightweight, well-maintained |
| **class-variance-authority** | ^0.7.0 | Variant management | Perfect for component variants with Tailwind |
| **tailwind-merge** | ^2.0.0 | Tailwind class merging | Prevents className conflicts |

### Peer Dependencies

```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "tailwindcss": "^3.4.0"
}
```

**Rationale**: Users must provide React and Tailwind - library doesn't bundle them.

---

## 🛠️ Development Dependencies

### Build Tools

| Tool | Purpose | Rationale |
|------|---------|-----------|
| **tsup** | Build tool | Fast, zero-config TypeScript bundler with multiple output formats |
| **typescript** | Type system | ^5.3.0 - Latest stable features |
| **@types/react** | React types | Type definitions for React |
| **@types/react-dom** | React DOM types | Type definitions for React DOM |

### Testing

| Tool | Purpose | Rationale |
|------|---------|-----------|
| **vitest** | Test runner | Fast, modern, Vite-powered testing |
| **@testing-library/react** | React testing utilities | Industry standard for React testing |
| **@testing-library/jest-dom** | DOM matchers | Better assertions for DOM testing |
| **@testing-library/user-event** | User interaction simulation | Realistic user event simulation |
| **happy-dom** | DOM implementation | Fast DOM for unit tests |
| **@axe-core/react** | Accessibility testing | Automated a11y testing in tests |

### Code Quality

| Tool | Purpose | Configuration |
|------|---------|---------------|
| **eslint** | Linting | React + TypeScript + A11y rules |
| **@typescript-eslint/\*** | TypeScript linting | Strict rules |
| **eslint-plugin-jsx-a11y** | Accessibility linting | Catch a11y issues early |
| **prettier** | Code formatting | Opinionated formatting |
| **prettier-plugin-tailwindcss** | Tailwind class sorting | Official Tailwind plugin |

### Storybook

| Package | Purpose |
|---------|---------|
| **@storybook/react-vite** | Storybook for React with Vite |
| **@storybook/addon-essentials** | Core Storybook addons |
| **@storybook/addon-a11y** | Accessibility addon |
| **@storybook/addon-interactions** | Interaction testing |
| **@storybook/test** | Testing utilities |

---

## 🏗️ Build Configuration

### Output Formats

```typescript
// tsup.config.ts
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'], // ESM + CommonJS
  dts: true, // Generate .d.ts files
  splitting: true, // Code splitting for tree-shaking
  clean: true,
  external: ['react', 'react-dom'],
  treeshake: true,
})
```

### Package.json Exports

```json
{
  "name": "tinybigui",
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
    "./styles.css": "./dist/styles.css"
  },
  "sideEffects": false
}
```

**Key Points**:
- `"type": "module"` for ESM-first
- `sideEffects: false` enables aggressive tree-shaking
- Dual CJS/ESM exports for maximum compatibility

---

## 🎨 Styling Infrastructure

### Tailwind Configuration

The library will ship with:

1. **Preset Configuration** (`tailwind.preset.js`)
   - MD3 design tokens as Tailwind theme
   - Custom utilities for MD3 components
   - Animation keyframes for MD3 motion

2. **Plugin** (optional `tailwind.plugin.js`)
   - Component-specific utilities
   - MD3 color system utilities

### CSS Architecture

```
src/
├── styles/
│   ├── globals.css         # Base styles, CSS reset
│   ├── tokens.css          # MD3 design tokens as CSS variables
│   ├── components/         # Component-specific styles (if needed)
│   └── utilities.css       # Custom Tailwind utilities
```

---

## 🔧 TypeScript Configuration

### Strict Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "skipLibCheck": true
  }
}
```

**Key Points**:
- Maximum strictness for type safety
- JSX transform for React 18+
- Declaration maps for better IDE experience

---

## 📱 React Server Components (RSC) Support

### Strategy

All interactive components will:
1. Be explicitly marked with `'use client'` directive
2. Export both headless (RSC-safe) and styled (client) versions where applicable
3. Use proper TypeScript types for RSC compatibility

### Example Pattern

```typescript
// button/button-headless.tsx (no 'use client' - RSC safe)
export function ButtonHeadless({ ... }) {
  // Headless logic using React Aria
}

// button/button.tsx (with 'use client')
'use client'
export function Button({ ... }) {
  return <ButtonHeadless className={buttonVariants(...)} />
}
```

---

## 🚀 Performance Considerations

### Bundle Size

- Target: < 50KB gzipped for full library
- Individual components should be < 5KB each
- Tree-shaking should work perfectly with named exports

### Runtime Performance

- Minimal runtime overhead
- Leverage React Aria's optimized event handling
- CSS-only animations where possible (MD3 motion)

---

## 📊 Decision Matrix

| Decision | Options Considered | Choice | Reason |
|----------|-------------------|--------|--------|
| Build Tool | Rollup, tsup, unbuild | **tsup** | Zero-config, fast, great DX |
| Test Runner | Jest, Vitest | **Vitest** | Modern, fast, better DX |
| Accessibility | Radix, React Aria, From scratch | **React Aria** | Best-in-class, Adobe-backed, active |
| CSS Framework | Tailwind, CSS-in-JS, Vanilla | **Tailwind + CVA** | Performance + DX + flexibility |
| Package Manager | npm, yarn, pnpm | **pnpm** (recommended) | Fast, disk efficient, strict |

---

## 🔄 Versioning Strategy

- **Semantic Versioning** (semver)
- React 18 compatibility: `^18.0.0`
- Breaking changes only on major versions
- Deprecation warnings for one minor version before removal

---

## 🔗 References

- [React Aria Documentation](https://react-spectrum.adobe.com/react-aria/)
- [CVA Documentation](https://cva.style/)
- [Tailwind CSS](https://tailwindcss.com/)
- [tsup](https://tsup.egoist.dev/)
- [Vitest](https://vitest.dev/)


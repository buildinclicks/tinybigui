# Tailwind v4 Migration Summary

> **Date**: December 29, 2025  
> **Decision**: TinyBigUI will support **Tailwind CSS v4 only**

## 🎯 Key Decisions Made

| Decision | Value | Rationale |
|----------|-------|-----------|
| **Minimum Tailwind version** | `^4.0.0` | Latest stable (4.1.18 as of Dec 2025) |
| **Support Tailwind v3?** | ❌ No | New project, no legacy burden |
| **Token integration** | CSS-first (`@theme` directives) | Aligns with Tailwind v4 best practices |
| **Configuration approach** | CSS-based tokens + minimal JS config | Modern, performant, native CSS features |
| **Package naming** | `@tinybigui/react` + `@tinybigui/tokens` | Consistent throughout all docs |
| **Primary framework docs** | Next.js (App Router) | Most common RSC environment |
| **Secondary framework docs** | Vite (React) | Fast development, popular |
| **Browser baseline** | Safari 16.4+, Chrome 111+, Firefox 128+ | Matches Tailwind v4 requirements |

---

## 📝 Strategy Documents Updated

### Files Modified

1. ✅ **strategies/00-overview.md**
   - Updated "Remaining Questions" section to reflect finalized decisions

2. ✅ **strategies/01-tech-stack.md**
   - Changed peer dependency: `^3.4.0` → `^4.0.0`
   - Added browser baseline section
   - Updated token integration to CSS-first approach
   - Clarified `@tinybigui/tokens` delivers CSS variables + Tailwind v4 theme directives
   - Removed JS preset as primary approach

3. ✅ **strategies/02-architecture.md**
   - Updated Tailwind integration examples to CSS-first tokens
   - Removed `tailwind.preset.js` references from shipped files
   - Clarified tokens live in `@tinybigui/tokens` package

4. ✅ **strategies/03-design-system.md**
   - Removed JS `tailwind.config.js` preset examples
   - Updated theming to CSS-first with `@theme` directives
   - Kept user customization flexible (CSS variables remain primary)

5. ✅ **strategies/05-distribution.md**
   - Changed peer dependency: `^3.4.0` → `^4.0.0`
   - Updated all import examples: `tinybigui` → `@tinybigui/react`
   - Removed `content: [...]` from default setup (Tailwind v4 auto-detection)
   - Added troubleshooting section for content scanning edge cases
   - Updated package exports (no more `tailwind.preset` export)
   - Clarified `@tinybigui/react/styles.css` internally includes tokens

6. ✅ **strategies/06-documentation.md**
   - Added explicit framework focus: Next.js App Router (primary), Vite (secondary)
   - Added framework-specific examples section
   - Clarified Storybook uses Vite-based setup (`@storybook/react-vite`)

7. ✅ **strategies/09-quick-reference.md**
   - Updated installation examples to `@tinybigui/react`
   - Removed Tailwind v3 preset configuration examples
   - Updated to Tailwind v4 approach

---

## 🔄 What Changed (Technical)

### Before (Tailwind v3)

```json
// Peer dependency
"peerDependencies": {
  "tailwindcss": "^3.4.0"
}
```

```javascript
// User's tailwind.config.js
module.exports = {
  presets: [require('tinybigui/tailwind.preset')],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/tinybigui/dist/**/*.js',
  ],
}
```

### After (Tailwind v4)

```json
// Peer dependency
"peerDependencies": {
  "tailwindcss": "^4.0.0"
}
```

```css
/* User's global CSS or app.css */
@import "@tinybigui/react/styles.css";

/* Tailwind v4 auto-detects content sources */
/* No content: [...] configuration needed in most cases */
```

---

## 🎨 Token Strategy (CSS-First)

### @tinybigui/tokens Package

Exports **`tokens.css`** containing:

```css
/* @tinybigui/tokens/tokens.css */

/* MD3 Design Tokens as CSS Variables */
:root {
  --md-sys-color-primary: #6750a4;
  --md-sys-color-on-primary: #ffffff;
  /* ... all 25 color roles */
}

/* Tailwind v4 Theme Integration */
@theme {
  --color-primary: var(--md-sys-color-primary);
  --color-on-primary: var(--md-sys-color-on-primary);
  /* Map MD3 tokens to Tailwind utilities */
}
```

### @tinybigui/react Package

**`@tinybigui/react/styles.css`** internally imports tokens:

```css
/* @tinybigui/react/styles.css */
@import "@tinybigui/tokens/tokens.css";

/* Component-specific styles */
/* State layers, ripple effects, etc. */
```

**Users only need to import**:
```typescript
import "@tinybigui/react/styles.css";
```

---

## 🌐 Browser Support

### Baseline (Aligned with Tailwind v4)

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| **Safari** | 16.4+ | iOS 16.4+ |
| **Chrome** | 111+ | Android Chrome 111+ |
| **Edge** | 111+ | Chromium-based |
| **Firefox** | 128+ | |

**Rationale**: Tailwind v4 leverages modern CSS features (container queries, cascade layers, etc.) that require these baseline versions.

### What This Means

- ✅ Modern CSS features (`:has()`, container queries, etc.)
- ✅ Native CSS nesting
- ✅ CSS cascade layers
- ✅ Better performance
- ❌ No IE11 support (already deprecated)
- ❌ No legacy browser support

---

## 📦 Package Structure Changes

### @tinybigui/tokens Exports

```json
{
  "name": "@tinybigui/tokens",
  "exports": {
    ".": "./tokens.css",
    "./tokens.css": "./tokens.css"
  }
}
```

**What it contains**:
- MD3 design tokens as CSS variables
- Tailwind v4 `@theme` directives mapping tokens to utilities
- No JavaScript configuration

### @tinybigui/react Exports

```json
{
  "name": "@tinybigui/react",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./styles.css": "./dist/styles.css"
  }
}
```

**Note**: No `tailwind.preset` export (CSS-first approach)

---

## 🚀 User Setup (Updated for Tailwind v4)

### Next.js (App Router) — Primary Path

```bash
# 1. Install
pnpm add @tinybigui/react react react-dom tailwindcss

# 2. Ensure Tailwind v4 is set up (follow Tailwind docs for your framework)
```

```typescript
// 3. app/layout.tsx
import "@tinybigui/react/styles.css";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

```typescript
// 4. Use components
import { Button, TextField } from "@tinybigui/react";

export default function Page() {
  return (
    <div>
      <Button variant="filled">Click me</Button>
      <TextField label="Email" />
    </div>
  );
}
```

### Vite (React) — Secondary Path

```bash
# 1. Install
pnpm add @tinybigui/react react react-dom tailwindcss

# 2. Ensure Tailwind v4 is set up (follow Tailwind docs)
```

```typescript
// 3. src/main.tsx or src/index.tsx
import "@tinybigui/react/styles.css";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(<App />);
```

```typescript
// 4. Use components
import { Button, TextField } from "@tinybigui/react";

export default function App() {
  return (
    <div>
      <Button variant="filled">Click me</Button>
      <TextField label="Email" />
    </div>
  );
}
```

### Troubleshooting: Styles Not Applied?

If Tailwind classes aren't working with `@tinybigui/react` components:

**For Tailwind v4**: Most setups auto-detect sources, but if you're in a monorepo or custom build:

1. Check Tailwind's official v4 documentation for adding external content sources
2. Ensure your build tool is processing `node_modules/@tinybigui/react/**/*.js`
3. Verify PostCSS is configured correctly per Tailwind v4 guidelines

**Note**: We don't document specific `content: [...]` syntax because Tailwind v4 mechanisms vary by framework/bundler.

---

## 🎓 What We Don't Need Anymore

### Removed from Strategy Docs

- ❌ JavaScript `tailwind.config.js` preset exports
- ❌ `presets: [require('tinybigui/tailwind.preset')]` examples
- ❌ `content: [...]` in default happy-path setup
- ❌ References to `tinybigui` (non-scoped) package name
- ❌ Tailwind v3 peer dependency

### Why These Were Removed

| Removed | Reason |
|---------|--------|
| **JS preset** | Tailwind v4 is CSS-first; CSS variables + `@theme` is the modern approach |
| **`content: [...]`** | Tailwind v4 auto-detects sources in most setups |
| **v3 support** | Clean slate for modern stack, no legacy burden |
| **Unscoped package** | Decided on scoped `@tinybigui/*` naming |

---

## ✅ What's Consistent Now

All strategy documents now reflect:

- ✅ `tailwindcss: ^4.0.0` as peer dependency
- ✅ `@tinybigui/react` and `@tinybigui/tokens` scoped naming
- ✅ CSS-first token integration (no JS preset required)
- ✅ Modern browser baseline explicitly stated
- ✅ Next.js App Router as primary framework
- ✅ Vite as secondary framework
- ✅ `@tinybigui/react/styles.css` includes tokens (one import for users)
- ✅ Troubleshooting guidance for content scanning (without hardcoded mechanisms)

---

## 🔮 Future Considerations

### If Users Request JS Config Support

While our primary approach is CSS-first, if the community strongly prefers JavaScript configuration:

**Option**: Provide an optional `@tinybigui/tokens/config.js` export for Tailwind config extension

```javascript
// Optional for users who prefer JS config
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--md-sys-color-primary)',
        // ... token mappings
      },
    },
  },
}
```

**Decision**: Wait for community feedback before adding this. Start CSS-first.

---

## 📚 References

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/)
- [Tailwind v4 Blog Announcement](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind v4 Browser Support](https://tailwindcss.com/docs/browser-support)

---

## ✅ All Changes Complete

The strategy is now **fully aligned with Tailwind CSS v4** and ready for implementation!


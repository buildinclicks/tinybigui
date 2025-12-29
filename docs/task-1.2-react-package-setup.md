# Task 1.2: React Package Setup

**Status**: ✅ Completed  
**Date**: December 29, 2025  
**Part**: Phase 0 - Part B (Project Initialization)

---

## 📋 Overview

This task created the `@tinybigui/react` package structure, which will contain all Material Design 3 React components. The package is configured for modern JavaScript features, tree-shaking, and dual module format support (ESM + CommonJS).

---

## 📄 Files Created

1. `packages/react/package.json` - Package configuration
2. `packages/react/src/index.ts` - Main entry point
3. `packages/react/src/utils/cn.ts` - Class name utility

---

## 🔍 Detailed Explanation

### File 1: `packages/react/package.json`

This is the **publishable NPM package** that users will install via `npm install @tinybigui/react`.

#### Key Sections:

**1. Package Identity**
```json
{
  "name": "@tinybigui/react",
  "version": "0.0.0",
  "description": "Material Design 3 React components built with Tailwind CSS"
}
```
- **Scoped package** (`@tinybigui/`) - Allows publishing under organization namespace
- Version starts at `0.0.0` (Changesets will manage versioning)
- Clear, SEO-friendly description

**2. Module Type**
```json
{
  "type": "module"
}
```
- Sets package as **ES Module** by default
- Modern JavaScript standard
- Better tree-shaking support

**3. Exports (Modern Package Entry Points)**
```json
{
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    },
    "./styles.css": "./dist/styles.css",
    "./package.json": "./package.json"
  }
}
```

**What this means:**

**`.` (main entry):**
- `import { Button } from '@tinybigui/react'` → Uses ESM (`index.js`)
- `require('@tinybigui/react')` → Uses CommonJS (`index.cjs`)
- TypeScript gets correct types for each format

**`./styles.css` (CSS export):**
```javascript
import '@tinybigui/react/styles.css';
```
- Optional CSS import
- Contains component styles
- Separate from JS bundle

**`./package.json` (metadata export):**
- Allows importing package metadata
- Useful for version checking

**4. Side Effects**
```json
{
  "sideEffects": ["**/*.css"]
}
```

**Critical for tree-shaking:**
- Tells bundlers that **only CSS files** have side effects
- JavaScript files are **pure** (can be removed if unused)

**Example:**
```javascript
import { Button, Checkbox } from '@tinybigui/react';
// Only Button is used
```
→ Bundler removes Checkbox code (tree-shaking) ✅  
→ CSS is always included (side effect) ⚠️

**5. Files to Publish**
```json
{
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ]
}
```
- Only these files/folders are published to NPM
- Excludes `src/`, tests, configs
- Keeps package size small

**6. Scripts**
```json
{
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "clean": "rm -rf dist"
  }
}
```

**Script purposes:**
- **`build`** - Compile TypeScript to JavaScript (production)
- **`dev`** - Watch mode (rebuilds on file changes)
- **`typecheck`** - Type checking only (no output)
- **`test`** - Run tests once (CI)
- **`test:watch`** - Interactive test mode (development)
- **`clean`** - Remove build artifacts

**7. Dependencies**

**Regular dependencies** (shipped with package):
```json
{
  "dependencies": {
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0"
  }
}
```

**Why these?**
- **`class-variance-authority` (CVA)** - Component variants
  ```typescript
  const button = cva('base-styles', {
    variants: {
      color: {
        primary: 'bg-primary',
        secondary: 'bg-secondary'
      }
    }
  });
  ```
- **`clsx`** - Conditional class names
  ```typescript
  clsx('btn', isActive && 'active', { disabled: !enabled })
  ```
- **`tailwind-merge`** - Merge Tailwind classes correctly
  ```typescript
  twMerge('px-2', 'px-4') // => 'px-4' (no conflicts)
  ```

**Peer dependencies** (required by user):
```json
{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

**Why peer dependencies?**
- ✅ User controls React version (no version conflicts)
- ✅ Smaller bundle (React not included twice)
- ✅ Supports both React 18 and 19

**Dev dependencies** (only for development):
```json
{
  "devDependencies": {
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "react": "^18.3.1",
    "tsup": "^8.3.5",
    "typescript": "^5.7.2"
  }
}
```
- React installed as devDependency for building
- Not included in published package

**8. Publish Configuration**
```json
{
  "publishConfig": {
    "access": "public"
  }
}
```
- Makes package **publicly accessible** on NPM
- Required for scoped packages (default is private)

---

### File 2: `packages/react/src/index.ts`

The **main entry point** - barrel export file.

```typescript
/**
 * @tinybigui/react
 * Material Design 3 components for React
 */

// Utilities
export { cn } from './utils/cn';

// Components will be exported here as they're built
// export { Button } from './components/Button';
```

**Current exports:**
- Only `cn` utility (needed immediately)

**Future exports:**
```typescript
// Phase 1a components
export { Button } from './components/Button';
export { IconButton } from './components/IconButton';
export { FAB } from './components/FAB';
export { Checkbox } from './components/Checkbox';
export { Radio } from './components/Radio';
export { Switch } from './components/Switch';
```

**Why barrel exports?**
- ✅ Clean API: `import { Button } from '@tinybigui/react'`
- ✅ Single source of truth
- ✅ Easy to see what's public vs internal

---

### File 3: `packages/react/src/utils/cn.ts`

A **critical utility** for Tailwind CSS class management.

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines and merges Tailwind CSS classes efficiently.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

**What it does:**

**1. Conditional classes** (via `clsx`):
```typescript
cn('px-2 py-1', condition && 'bg-blue-500', { 'text-white': isActive })
// => 'px-2 py-1 bg-blue-500 text-white' (if both true)
```

**2. Resolve conflicts** (via `tailwind-merge`):
```typescript
cn('px-2', 'px-4')  // Without twMerge: 'px-2 px-4' ❌
// => 'px-4'        // With twMerge: last wins ✅
```

**Why both libraries?**

| Library | Purpose | Example |
|---------|---------|---------|
| `clsx` | Join conditional classes | `clsx('btn', isActive && 'active')` |
| `tailwind-merge` | Resolve Tailwind conflicts | `twMerge('px-2', 'px-4')` |

**Real-world usage in components:**
```typescript
export function Button({ className, variant, size, ...props }) {
  return (
    <button
      className={cn(
        'rounded-lg transition-colors', // base
        variantStyles[variant],          // variant styles
        sizeStyles[size],                // size styles
        className                        // user overrides
      )}
      {...props}
    />
  );
}
```

**Why this pattern?**
- ✅ User can override styles safely
- ✅ No class conflicts
- ✅ Clean, readable code
- ✅ TypeScript-safe

---

## 🎯 What This Setup Achieves

✅ **Dual format support** - Works with ESM (`import`) and CJS (`require`)  
✅ **Tree-shakeable** - Unused components removed from bundle  
✅ **Type-safe** - Ships TypeScript definitions (`.d.ts`)  
✅ **Peer dependencies** - No React version conflicts  
✅ **Scoped name** - `@tinybigui/react` prevents NPM name collisions  
✅ **Modern exports** - Conditional exports for optimal bundling  
✅ **Utility foundation** - `cn` utility ready for all components  

---

## 🎓 Key Learnings

### Modern Package Entry Points

**Old way** (legacy):
```json
{
  "main": "./dist/index.js"
}
```
- Single entry point
- No ESM/CJS distinction
- Limited bundler optimization

**New way** (modern):
```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  }
}
```
- ✅ Multiple entry points
- ✅ Format-specific files
- ✅ Better tree-shaking
- ✅ TypeScript support

### Tree-Shaking Explained

**Without tree-shaking:**
```javascript
import { Button } from '@tinybigui/react';
```
→ Entire library bundled (500 KB) ❌

**With tree-shaking:**
```javascript
import { Button } from '@tinybigui/react';
```
→ Only Button code bundled (20 KB) ✅

**Requirements for tree-shaking:**
1. ESM format (`"type": "module"`)
2. No side effects (`"sideEffects": false` or specific)
3. Named exports (not default exports)

### Peer Dependencies vs Dependencies

**When to use peerDependencies:**
- ✅ Framework libraries (React, Vue)
- ✅ Build tools (Tailwind CSS)
- ✅ Large dependencies with versions

**When to use dependencies:**
- ✅ Utilities (clsx, date-fns)
- ✅ Small libraries
- ✅ No version conflicts expected

**Example conflict scenario:**
```
User's app: React 18.2.0
Component lib (if bundling React): React 18.3.1
→ Two React versions loaded! ❌ (breaks hooks)

Component lib (peer dependency):
→ Uses user's React 18.2.0 ✅
```

---

## 📊 Directory Structure After Task 1.2

```
packages/react/
├── package.json           ← Package config
├── src/
│   ├── index.ts          ← Main entry (barrel export)
│   ├── utils/
│   │   └── cn.ts         ← Class name utility
│   └── components/       ← Future component files
│       ├── Button/       (Phase 1a)
│       ├── Checkbox/     (Phase 1a)
│       └── ...
└── dist/                 ← Build output (generated)
    ├── index.js          (ESM)
    ├── index.cjs         (CommonJS)
    ├── index.d.ts        (Types)
    └── styles.css        (Styles)
```

---

## ✅ Verification Steps

To verify this task was completed correctly:

1. **Check package name:**
   ```bash
   cat packages/react/package.json | grep '"name"'
   # Should show: "@tinybigui/react"
   ```

2. **Verify exports:**
   ```bash
   cat packages/react/package.json | grep -A5 '"exports"'
   # Should show exports for ".", "./styles.css"
   ```

3. **Check cn utility:**
   ```bash
   cat packages/react/src/utils/cn.ts
   # Should export cn function
   ```

---

## 🔗 Related Tasks

- **Previous**: Task 1.1 (Root Workspace Setup)
- **Next**: Task 1.3 (Tokens Package Setup)
- **Depends on**: Task 1.1 (workspace configuration)
- **Required for**: All component development tasks

---

## 📝 Commit Information

**Commit message**: `chore: setup monorepo structure and react package`  
**Files in commit**:
- `packages/react/package.json`
- `packages/react/src/index.ts`
- `packages/react/src/utils/cn.ts`

---

## 🤔 Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Module format | ESM + CJS | Maximum compatibility |
| Build tool | tsup | Fast, zero-config, dual output |
| Class utility | clsx + tailwind-merge | Industry standard, proven |
| React versions | 18 and 19 | Current + future support |
| Tailwind version | v4 only | Modern, CSS-first approach |
| Package scope | @tinybigui | Organization namespace |

---

## 📚 References

- [Package Exports](https://nodejs.org/api/packages.html#exports)
- [tsup Documentation](https://tsup.egoist.dev/)
- [clsx on npm](https://www.npmjs.com/package/clsx)
- [tailwind-merge on npm](https://www.npmjs.com/package/tailwind-merge)
- [Tree Shaking Guide](https://webpack.js.org/guides/tree-shaking/)


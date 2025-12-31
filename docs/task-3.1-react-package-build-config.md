# Task 3.1: React Package Build Configuration (tsup)

**Status**: ✅ Completed  
**Date**: December 29, 2025  
**Part**: Phase 0 - Part D (Build Configuration)

---

## 📋 Overview

This task created the build configuration for the `@tinybigui/react` package using tsup, a fast TypeScript bundler powered by esbuild. This configuration defines how our TypeScript source code is compiled into distributable JavaScript packages.

---

## 📄 Files Created

1. `packages/react/tsup.config.ts` - Build configuration for React package

---

## 🔍 Detailed Explanation

### File: `packages/react/tsup.config.ts`

This configuration tells tsup how to build our library for distribution on NPM.

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  minify: false,
  external: ["react", "react-dom", "react/jsx-runtime"],
  treeshake: true,
  bundle: true,
  target: "es2022",
  platform: "neutral",
  jsx: "automatic",
  outExtension({ format }: { format: "esm" | "cjs" }) {
    return {
      js: format === "cjs" ? ".cjs" : ".js",
    };
  },
});
```

---

## ⚙️ Configuration Options Breakdown

### 1. Entry Point

```typescript
entry: ["src/index.ts"];
```

**Where the build starts.**

**How it works:**

1. tsup reads `src/index.ts`
2. Follows all imports recursively
3. Bundles everything into output files

**Build flow:**

```
src/index.ts
  ↓ imports
  export { cn } from './utils/cn';
  ↓ reads
src/utils/cn.ts
  ↓ imports
  import { clsx } from 'clsx';
  import { twMerge } from 'tailwind-merge';
  ↓ bundles to
dist/index.js (ESM) + dist/index.cjs (CommonJS)
```

**Multiple entry points (future):**

```typescript
entry: [
  "src/index.ts", // Main package
  "src/server.ts", // Server-only components
];
```

---

### 2. Output Formats

```typescript
format: ["esm", "cjs"];
```

**Generates two module formats for maximum compatibility.**

#### ESM (ES Modules) - `dist/index.js`

**Modern JavaScript standard:**

```javascript
// User code
import { Button } from "@tinybigui/react";

// Works with:
// - Modern bundlers (Vite, Webpack 5+, Rollup)
// - Node.js with "type": "module"
// - Next.js, Remix (modern React frameworks)
```

**Benefits:**

- ✅ Tree-shaking (unused code removed)
- ✅ Static analysis by bundlers
- ✅ Smaller bundles
- ✅ Modern standard

#### CJS (CommonJS) - `dist/index.cjs`

**Legacy Node.js format:**

```javascript
// User code
const { Button } = require("@tinybigui/react");

// Works with:
// - Node.js default (no "type": "module")
// - Legacy tools
// - Jest (without ESM config)
// - Older bundlers
```

**Why still support CJS?**

- Many projects haven't migrated to ESM
- Some tools default to CJS
- Backward compatibility

**Package.json alignment:**

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js", // ESM users get this
      "require": "./dist/index.cjs" // CJS users get this
    }
  }
}
```

---

### 3. Type Definitions

```typescript
dts: true;
```

**Generates TypeScript declaration files.**

**Output files:**

- `dist/index.d.ts` - ESM type definitions
- `dist/index.d.cts` - CJS type definitions
- `dist/index.d.ts.map` - Source maps for types

**What users get:**

```typescript
import { Button } from "@tinybigui/react";
//       ^^^^^^
// VS Code shows:
// - All props with types
// - JSDoc documentation
// - Autocomplete
// - Type errors before runtime
```

**How it works:**
tsup uses TypeScript compiler under the hood:

```
src/index.ts
  ↓ TypeScript compiler
dist/index.d.ts (type definitions)
```

**Example output:**

```typescript
// src/utils/cn.ts
export function cn(...inputs: ClassValue[]): string;

// dist/index.d.ts (generated)
import { ClassValue } from "clsx";
export declare function cn(...inputs: ClassValue[]): string;
```

---

### 4. Code Splitting

```typescript
splitting: true;
```

**Splits code into chunks for better optimization.**

**Without splitting:**

```
dist/
└── index.js (entire library, 500 KB)
```

**With splitting:**

```
dist/
├── index.js (main entry)
├── chunk-shared.js (shared utilities)
├── chunk-button.js (Button component)
└── chunk-checkbox.js (Checkbox component)
```

**Benefits:**

**1. Shared code deduplication:**

```typescript
// Button.tsx and Checkbox.tsx both use cn()
// Without splitting: cn() code duplicated in both
// With splitting: cn() in shared chunk
```

**2. Better tree-shaking:**

```typescript
// User imports only Button
import { Button } from "@tinybigui/react";

// Loaded:
// ✅ index.js (main)
// ✅ chunk-shared.js (utilities)
// ✅ chunk-button.js (Button only)
// ❌ chunk-checkbox.js (not needed, not loaded)
```

**3. Browser caching:**

```
User upgrades library:
- index.js changed ❌ (re-download)
- chunk-shared.js unchanged ✅ (cached)
- chunk-button.js changed ❌ (re-download)
```

**4. Parallel loading:**
Modern bundlers can load chunks in parallel.

---

### 5. Source Maps

```typescript
sourcemap: true;
```

**Generates `.map` files for debugging.**

**Output:**

- `dist/index.js.map`
- `dist/index.cjs.map`

**Without source maps:**

```javascript
// Browser DevTools shows:
dist/index.js:1523
  at h (index.js:1523)  // Minified, unreadable ❌

// Stack trace:
Error: Invalid prop
  at h (index.js:1523)
  at w (index.js:892)
```

**With source maps:**

```typescript
// Browser DevTools shows:
src/components/Button.tsx:42
  at Button (Button.tsx:42)  // Original source! ✅

// Stack trace:
Error: Invalid prop
  at Button (Button.tsx:42)
  at App (App.tsx:15)
```

**How it works:**

```json
// dist/index.js.map
{
  "mappings": "AAAA,OAAO...", // Maps compiled → source
  "sources": ["../src/index.ts"],
  "sourcesContent": ["export { cn } from './utils/cn';"]
}
```

**Browser loads:**

1. `dist/index.js` (compiled code)
2. `dist/index.js.map` (mapping)
3. Shows original TypeScript in DevTools

---

### 6. Clean Output

```typescript
clean: true;
```

**Deletes `dist/` directory before each build.**

**Why needed?**

**Scenario without `clean`:**

```bash
# Build 1: Create Button component
pnpm build
# → dist/Button.js created

# Rename: Button.tsx → PrimaryButton.tsx

# Build 2: Without clean
pnpm build
# → dist/PrimaryButton.js created
# → dist/Button.js still exists! (stale file)

# NPM publish includes both files! ❌
```

**With `clean: true`:**

```bash
# Build 2: With clean
pnpm build
# → dist/ deleted first
# → dist/PrimaryButton.js created
# → dist/Button.js gone! ✅
```

**Also prevents:**

- Outdated type definitions
- Renamed chunk files
- Deleted component exports

---

### 7. Minification

```typescript
minify: false;
```

**Currently disabled for better debugging.**

**Why `false` during development:**

- ✅ Readable output for debugging
- ✅ Clearer error messages
- ✅ Faster builds (no minification step)
- ✅ Better source maps

**Example unminified output:**

```javascript
// dist/index.js (readable)
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

**When to enable:**

```typescript
// Before NPM release
minify: true;

// Or per-environment
minify: process.env.NODE_ENV === "production";
```

**Minified output:**

```javascript
// dist/index.js (minified)
export function cn(...e) {
  return twMerge(clsx(e));
}
```

**Bundle size impact:**

- Unminified: ~50 KB
- Minified: ~20 KB (60% smaller)

---

### 8. External Dependencies

```typescript
external: ["react", "react-dom", "react/jsx-runtime"];
```

**These dependencies are NOT bundled into our library.**

**Why mark as external?**

**Problem if bundled:**

```javascript
// Our library bundles React (100 KB)
// User's app also has React (100 KB)
// Total bundle: 200 KB
// Two React instances: Hooks break! ❌

const [state, setState] = useState(0);
// Error: Invalid hook call
```

**Solution - external:**

```javascript
// dist/index.js
import { useState } from "react"; // Import statement, not bundled

// User's bundler resolves this to their React
// Total bundle: 100 KB
// One React instance: Hooks work! ✅
```

**How it works:**

**Our output:**

```javascript
// dist/index.js
import * as React from "react";
export function Button() {
  /* ... */
}
```

**User's bundler sees:**

```javascript
// User's app
import { Button } from "@tinybigui/react";
// Bundler: "@tinybigui/react imports 'react'"
// Bundler: "I'll use the user's React dependency"
```

**Package.json alignment:**

```json
{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0" // User must provide
  }
}
```

---

### 9. Tree-Shaking

```typescript
treeshake: true;
```

**Removes unused code from output.**

**Example:**

**Library exports:**

```typescript
// src/index.ts
export { Button } from "./components/Button";
export { Checkbox } from "./components/Checkbox";
export { Radio } from "./components/Radio";
export { Switch } from "./components/Switch";
export { cn } from "./utils/cn";
```

**User imports:**

```typescript
// User's app
import { Button, cn } from "@tinybigui/react";
// Only uses Button and cn
```

**Without tree-shaking:**

```
User's bundle includes:
- Button ✅ (used)
- Checkbox ❌ (not used, but included)
- Radio ❌ (not used, but included)
- Switch ❌ (not used, but included)
- cn ✅ (used)
Bundle size: ~150 KB
```

**With tree-shaking:**

```
User's bundle includes:
- Button ✅ (used)
- cn ✅ (used)
Bundle size: ~30 KB (80% smaller!)
```

**Requirements for tree-shaking:**

1. ESM format (not CJS)
2. `sideEffects: false` or `["**/*.css"]` in package.json
3. Named exports (not default exports)

**Why named exports?**

```typescript
// ❌ Default exports (harder to tree-shake)
export default { Button, Checkbox, Radio };

// ✅ Named exports (easy to tree-shake)
export { Button } from "./Button";
export { Checkbox } from "./Checkbox";
```

---

### 10. Bundle Dependencies

```typescript
bundle: true;
```

**Bundles our regular dependencies into the output.**

**What gets bundled:**

```json
// package.json dependencies
{
  "dependencies": {
    "clsx": "^2.1.1", // ✅ Bundled
    "tailwind-merge": "^2.6.0", // ✅ Bundled
    "class-variance-authority": "^0.7.1" // ✅ Bundled
  }
}
```

**Why bundle these?**

- User doesn't need to install them separately
- Single import for users
- Version control (we control the versions)

**User experience:**

```bash
# User only installs our package
pnpm add @tinybigui/react

# NOT needed (bundled):
# pnpm add clsx tailwind-merge class-variance-authority
```

**Output:**

```javascript
// dist/index.js includes:
// - Our code
// - clsx code (bundled)
// - tailwind-merge code (bundled)
// - CVA code (bundled)
```

**Bundle size:**

- clsx: ~1 KB
- tailwind-merge: ~8 KB
- CVA: ~3 KB
- Total added: ~12 KB

---

### 11. Target Environment

```typescript
target: "es2022";
```

**Compiles to ES2022 JavaScript.**

**Alignment:**

- ✅ Matches TypeScript config (`target: "ES2022"`)
- ✅ Matches browser baseline (Safari 16.4+, Chrome 111+, Firefox 128+)
- ✅ Matches Node.js 18+ requirement

**Features used:**

```javascript
// ES2022 features in output
obj?.prop                    // Optional chaining
value ?? default             // Nullish coalescing
await promise                // Async/await
class Button { #private }    // Private fields
arr.at(-1)                   // Array.at()
```

**Not transpiled to ES5:**

```javascript
// We DON'T output:
var _a;
(_a = obj) === null || _a === void 0 ? void 0 : _a.prop; // ES5 optional chaining

// We output:
obj?.prop; // Native ES2022
```

**Why ES2022?**

- ✅ Modern browsers support it natively
- ✅ Smaller output (no polyfills)
- ✅ Better performance (native features)

---

### 12. Platform

```typescript
platform: "neutral";
```

**Code works in both Node.js and browser.**

**Options:**

| Platform  | Use Case       | Environment       |
| --------- | -------------- | ----------------- |
| `neutral` | Universal code | Browser + Node.js |
| `browser` | Browser-only   | Browser           |
| `node`    | Server-only    | Node.js           |

**Why `neutral` for React components?**

- ✅ Browser rendering (client-side)
- ✅ SSR (server-side rendering in Node.js)
- ✅ Next.js App Router (React Server Components)
- ✅ Remix (server + client)

**What it means:**

```javascript
// Neutral platform means:
// - No Node.js-specific APIs (fs, path)
// - No browser-specific APIs (window, document) at top level
// - Works in both environments
```

**Example:**

```typescript
// ✅ Good (neutral)
export function Button() {
  // Can use browser APIs inside component (runs client-side)
  const handleClick = () => window.alert('Clicked');
  return <button onClick={handleClick}>Click</button>;
}

// ❌ Bad (breaks SSR)
const width = window.innerWidth;  // Runs at module load (server has no window)
export function Button() { /* ... */ }
```

---

### 13. JSX Handling

```typescript
jsx: "automatic";
```

**Uses modern JSX transform (React 17+).**

**Input (our code):**

```tsx
export function Button() {
  return <button>Click me</button>;
}
```

**Output (compiled):**

```javascript
import { jsx as _jsx } from "react/jsx-runtime";

export function Button() {
  return _jsx("button", { children: "Click me" });
}
```

**Benefits:**

- ✅ No `React` import needed in source
- ✅ Smaller output
- ✅ Faster runtime
- ✅ Better tree-shaking

**vs Classic JSX:**

```javascript
// Classic (React 16)
import React from "react";
return React.createElement("button", null, "Click me");

// Automatic (React 17+)
import { jsx } from "react/jsx-runtime";
return jsx("button", { children: "Click me" });
```

---

### 14. Output Extensions

```typescript
outExtension({ format }: { format: 'esm' | 'cjs' }) {
  return {
    js: format === 'cjs' ? '.cjs' : '.js',
  };
}
```

**Custom file extensions per format.**

**Output:**

- ESM → `dist/index.js`
- CJS → `dist/index.cjs`

**Why `.cjs` for CommonJS?**

**Problem with `.js` for both:**

```json
// package.json
{
  "type": "module", // .js files are ESM
  "exports": {
    "require": "./dist/index.js" // ❌ CJS code with .js extension
  }
}
// Node.js: "Error: require() of ES Module"
```

**Solution with `.cjs`:**

```json
{
  "type": "module",
  "exports": {
    "import": "./dist/index.js", // ✅ ESM (.js)
    "require": "./dist/index.cjs" // ✅ CJS (.cjs)
  }
}
// Node.js: Correctly identifies both formats
```

**Node.js resolution:**

- `.cjs` → Always CommonJS
- `.mjs` → Always ES Module
- `.js` → Depends on package.json `type` field

---

## 🎯 What This Configuration Achieves

✅ **Dual format output** - ESM + CJS for all users  
✅ **Type definitions** - Full TypeScript support  
✅ **Code splitting** - Optimized chunks, better caching  
✅ **Source maps** - Debug TypeScript in DevTools  
✅ **Clean builds** - No stale artifacts  
✅ **External React** - No version conflicts, smaller bundles  
✅ **Bundled utilities** - One install, all dependencies  
✅ **Tree-shakeable** - Users only bundle what they use  
✅ **Modern output** - ES2022, native features  
✅ **Universal** - SSR + client-side compatible  
✅ **Fast builds** - Powered by esbuild (10-100x faster than tsc)

---

## 🎓 Key Learnings

### Why tsup Over Other Build Tools?

**Comparison:**

| Tool       | Speed    | Config     | Output    | Type Defs  |
| ---------- | -------- | ---------- | --------- | ---------- |
| `tsc`      | Slow     | Simple     | Good      | Native     |
| `webpack`  | Slow     | Complex    | Great     | Via plugin |
| `rollup`   | Medium   | Complex    | Great     | Via plugin |
| **`tsup`** | **Fast** | **Simple** | **Great** | **Native** |
| `esbuild`  | Fastest  | Manual     | Good      | Manual     |

**Why tsup?**

- ✅ esbuild speed with better DX
- ✅ Zero-config TypeScript
- ✅ Automatic `.d.ts` generation
- ✅ Modern defaults (ESM, tree-shaking)
- ✅ One config file

---

### Build Output Structure

**After running `pnpm build`:**

```
packages/react/dist/
├── index.js              (ESM entry)
├── index.js.map          (ESM source map)
├── index.cjs             (CJS entry)
├── index.cjs.map         (CJS source map)
├── index.d.ts            (ESM types)
├── index.d.cts           (CJS types)
├── index.d.ts.map        (Type source map)
├── chunk-shared.js       (Shared code, if splitting)
└── chunk-shared.js.map   (Chunk source map)
```

**Size estimates:**

- ESM: ~15 KB
- CJS: ~16 KB (slightly larger)
- Types: ~2 KB
- Source maps: ~50 KB (not included in user bundles)

---

### Development Workflow

**Local development:**

```bash
# Watch mode (rebuilds on file change)
cd packages/react
pnpm dev

# In another terminal
cd ../../examples/vite-app
pnpm dev
# Hot reload works! ✨
```

**Building for release:**

```bash
# One-time build
pnpm build

# Enable minification first
# In tsup.config.ts: minify: true

# Test the build
npm pack
# Creates @tinybigui-react-0.0.0.tgz
```

---

## 📊 Directory Structure After Task 3.1

```
packages/react/
├── tsup.config.ts        ← Build configuration ✨ NEW
├── tsconfig.json
├── package.json
├── src/
│   ├── index.ts
│   └── utils/
│       └── cn.ts
└── dist/                 (generated by pnpm build)
    ├── index.js          (ESM)
    ├── index.cjs         (CJS)
    ├── index.d.ts        (Types)
    └── *.map             (Source maps)
```

---

## ✅ Verification Steps

To verify this task was completed correctly:

1. **Check config exists:**

   ```bash
   cat packages/react/tsup.config.ts
   # Should show defineConfig with all options
   ```

2. **Validate TypeScript:**

   ```bash
   cd packages/react
   npx tsc --noEmit tsup.config.ts
   # Should compile without errors
   ```

3. **Test build (after pnpm install):**

   ```bash
   cd packages/react
   pnpm install
   pnpm build
   # Should create dist/ with .js, .cjs, .d.ts files
   ```

4. **Check output structure:**

   ```bash
   ls -la packages/react/dist/
   # Should show index.js, index.cjs, index.d.ts, etc.
   ```

5. **Verify source maps:**
   ```bash
   cat packages/react/dist/index.js
   # Last line should have: //# sourceMappingURL=index.js.map
   ```

---

## 🔗 Related Tasks

- **Previous**: Task 2.3 (Tokens Package TypeScript Config)
- **Next**: Task 3.2 (Tokens Package Build)
- **Depends on**: Task 1.2 (React package structure), Task 2.2 (TypeScript config)
- **Required for**: All component development tasks

---

## 🤔 Decisions Made

| Decision       | Choice                    | Rationale                       |
| -------------- | ------------------------- | ------------------------------- |
| Build tool     | tsup                      | Fast, simple, great defaults    |
| Output formats | ESM + CJS                 | Maximum compatibility           |
| Code splitting | Enabled                   | Better tree-shaking, caching    |
| Minification   | Disabled (dev)            | Readable output, faster builds  |
| External deps  | React, React-DOM          | Peer dependencies, no conflicts |
| Bundle deps    | clsx, tailwind-merge, CVA | Convenience, version control    |
| Source maps    | Enabled                   | Better debugging                |
| Target         | ES2022                    | Modern, aligns with strategy    |
| Platform       | Neutral                   | SSR + client compatible         |

---

## 📚 References

- [tsup Documentation](https://tsup.egoist.dev/)
- [esbuild Documentation](https://esbuild.github.io/)
- [Package Exports](https://nodejs.org/api/packages.html#exports)
- [Tree Shaking Guide](https://webpack.js.org/guides/tree-shaking/)
- [Source Maps Explained](https://web.dev/source-maps/)

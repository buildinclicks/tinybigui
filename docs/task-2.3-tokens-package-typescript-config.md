# Task 2.3: Tokens Package TypeScript Configuration

**Status**: ✅ Completed  
**Date**: December 29, 2025  
**Part**: Phase 0 - Part C (TypeScript Setup)

---

## 📋 Overview

This task created the TypeScript configuration for the `@tinybigui/tokens` package. Unlike the React package, the tokens package is primarily CSS-based, so this configuration focuses on type checking the build scripts rather than compiling source code.

---

## 📄 Files Created

1. `packages/tokens/tsconfig.json` - Tokens package TypeScript configuration

---

## 🔍 Detailed Explanation

### File: `packages/tokens/tsconfig.json`

This configuration is **focused on build scripts** since the tokens package contains pure CSS, not TypeScript components.

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./scripts",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "types": ["node"]
  },
  "include": ["scripts/**/*"],
  "exclude": ["node_modules", "dist", "src"]
}
```

---

## ⚙️ Configuration Sections Breakdown

### 1. Extends Root Configuration

```json
{
  "extends": "../../tsconfig.json"
}
```

**Same inheritance pattern as React package:**
- Loads all settings from root `tsconfig.json`
- Inherits strict mode, ES2022 target, etc.
- Only specifies what's different

**Inherited settings:**
- ✅ `strict: true` - All strict type checking
- ✅ `target: "ES2022"` - Modern JavaScript
- ✅ `jsx: "react-jsx"` - (not used, but inherited)
- ✅ `noUncheckedIndexedAccess: true` - Safe array access
- ✅ All other root compiler options

---

### 2. Output Directory

```json
{
  "outDir": "./dist"
}
```

**Where compiled files would go** (if build scripts were TypeScript).

**Current state:**
- Build script is JavaScript (`scripts/build.js`)
- No actual compilation happens
- Config is ready if we convert to TypeScript later

**Future state (if converted to TS):**
```
scripts/build.ts → dist/build.js
```

---

### 3. Root Directory

```json
{
  "rootDir": "./scripts"
}
```

**Key difference from React package!**

| Package | rootDir | Why |
|---------|---------|-----|
| React | `./src` | Component source code |
| Tokens | `./scripts` | Build scripts only |

**Tokens package structure:**
```
packages/tokens/
├── scripts/
│   └── build.js        ← TypeScript checks this
├── src/
│   └── tokens.css      ← Pure CSS, not TypeScript
└── dist/
    └── tokens.css      ← Output (copied CSS)
```

**Why `./scripts`?**
- The only JavaScript/TypeScript in this package is build tooling
- Source files (`src/`) are pure CSS
- No component code to compile

---

### 4. Module Configuration

```json
{
  "module": "ESNext",
  "moduleResolution": "Bundler"
}
```

**Re-specified from root for clarity.**

**Why re-specify these?**
- Makes it explicit that build scripts use modern ESM
- Build scripts use `import`/`export` syntax
- Ensures proper Node.js ESM resolution

**Build script uses these:**
```javascript
// scripts/build.js
import { mkdir, copyFile } from 'node:fs/promises';  // ESM import
import { dirname, join } from 'node:path';
```

**Requires `package.json` with:**
```json
{
  "type": "module"  // Enables ESM in Node.js
}
```

---

### 5. Node.js Types

```json
{
  "types": ["node"]
}
```

**Critical for Node.js development!**

**What it provides:**
- ✅ Type definitions for Node.js built-in modules
- ✅ `fs`, `path`, `process`, `url`, etc.
- ✅ IntelliSense in VS Code
- ✅ Type checking for Node.js APIs

**Example - Without Node types:**
```javascript
import { copyFile } from 'node:fs/promises';
//      ^^^^^^^^ ❌ Error: Cannot find module 'node:fs/promises'

const __dirname = dirname(fileURLToPath(import.meta.url));
//                ^^^^^^^ ❌ Error: Cannot find name 'dirname'
```

**Example - With Node types:**
```javascript
import { copyFile } from 'node:fs/promises';
//      ^^^^^^^^ ✅ Autocomplete works, types available

const __dirname = dirname(fileURLToPath(import.meta.url));
//                ^^^^^^^ ✅ Type: (path: string) => string
```

**How to install (already in root):**
```bash
pnpm add -D @types/node
```

**VS Code benefits:**
- Hover over `copyFile` → See function signature
- Autocomplete for `fs` methods
- Error detection for wrong argument types

---

### 6. Include Pattern

```json
{
  "include": ["scripts/**/*"]
}
```

**Only includes build scripts directory.**

**What's included:**
```
✅ scripts/build.js
✅ scripts/generate.js (future)
✅ scripts/utils/helper.js (future)
✅ scripts/types.d.ts (future type definitions)
```

**What's NOT included:**
```
❌ src/tokens.css (not TypeScript/JavaScript)
❌ dist/tokens.css (output, not source)
```

**Why not include `src/`?**
- `src/` contains **only CSS files**
- TypeScript would try to parse CSS as code
- Would cause compilation errors

**Example error if `src/` was included:**
```
src/tokens.css:1:1 - error TS1005: ':' expected.
1 :root {
  ^
```

---

### 7. Exclude Pattern

```json
{
  "exclude": ["node_modules", "dist", "src"]
}
```

**What's excluded and why:**

#### `node_modules`
- Third-party dependencies
- Standard exclusion
- Already compiled

#### `dist`
- Build output directory
- Contains copied CSS file
- Not source code

#### `src` ⭐ **Key difference from React package**
- Contains **pure CSS** (not TypeScript)
- TypeScript can't process CSS
- Must be excluded to prevent errors

**Comparison:**

| Package | Excludes `src/`? | Why |
|---------|------------------|-----|
| React | ❌ No | `src/` has TypeScript components |
| Tokens | ✅ Yes | `src/` has only CSS files |

---

## 🎯 What This Configuration Achieves

✅ **Type safety for build scripts** - Node.js code is type checked  
✅ **Node.js API support** - Full types for fs, path, process  
✅ **Extends root config** - Inherits all strict settings  
✅ **CSS files ignored** - Doesn't try to compile CSS  
✅ **ESM support** - Modern module syntax for scripts  
✅ **Future-ready** - Can convert scripts to TypeScript easily  
✅ **IDE-optimized** - Great IntelliSense for Node.js APIs  

---

## 🎓 Key Learnings

### Different Package Types Need Different Configs

**React Package (`@tinybigui/react`):**
```json
{
  "rootDir": "./src",           // Component source code
  "include": ["src/**/*"],      // TypeScript/TSX files
  "exclude": ["**/*.test.tsx"], // Exclude tests
  "types": []                   // Browser environment
}
```
**Purpose:** Compile React components  
**Output:** JavaScript modules + type definitions

**Tokens Package (`@tinybigui/tokens`):**
```json
{
  "rootDir": "./scripts",       // Build scripts
  "include": ["scripts/**/*"],  // Only scripts
  "exclude": ["src"],           // Exclude CSS
  "types": ["node"]             // Node.js environment
}
```
**Purpose:** Type check build tooling  
**Output:** No compilation (scripts run directly)

---

### Type Checking Without Compilation

**The tokens package demonstrates an important pattern:**

**Current Setup:**
- Build script is JavaScript (`.js`)
- TypeScript config exists
- Still get type checking!

**How?**
1. **Via JSDoc comments:**
```javascript
// scripts/build.js

/**
 * Copies a file from source to destination
 * @param {string} source - Source file path
 * @param {string} dest - Destination file path
 * @returns {Promise<void>}
 */
async function copyFile(source, dest) {
  // TypeScript validates this via JSDoc!
  await fs.copyFile(source, dest);
}
```

2. **Via `tsc --checkJs`:**
```bash
# In package.json
{
  "scripts": {
    "typecheck": "tsc --noEmit --checkJs"
  }
}
```

**Benefits:**
- ✅ Type safety without TypeScript syntax
- ✅ Gradual migration path
- ✅ Works in plain JavaScript files
- ✅ No build step for scripts

---

### When TypeScript Isn't Needed for Source

**Tokens package structure:**

```
packages/tokens/
├── src/
│   └── tokens.css          ← Pure CSS (no TS needed)
├── scripts/
│   └── build.js            ← Could use TS (optional)
└── dist/
    └── tokens.css          ← Copied CSS (no compilation)
```

**Key insight:**
- Not every package needs TypeScript for *source* code
- TypeScript can still be valuable for *tooling*
- Our config supports both use cases

**Other examples of non-TS source packages:**
- Icon packages (SVG files)
- Font packages (font files)
- Asset packages (images, JSON)
- Configuration packages (config files)

All can benefit from TypeScript in their build/tooling scripts!

---

### Future Migration Path

**If we convert build script to TypeScript:**

**Step 1: Rename script**
```bash
mv scripts/build.js scripts/build.ts
```

**Step 2: Add types**
```typescript
// scripts/build.ts
import { mkdir, copyFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

interface BuildOptions {
  minify?: boolean;
  sourcemap?: boolean;
  watch?: boolean;
}

async function build(options: BuildOptions = {}): Promise<void> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const rootDir = join(__dirname, '..');
  
  // Fully type-safe build logic
  await mkdir(join(rootDir, 'dist'), { recursive: true });
  await copyFile(
    join(rootDir, 'src', 'tokens.css'),
    join(rootDir, 'dist', 'tokens.css')
  );
}

build({ minify: true }).catch(console.error);
```

**Step 3: Update package.json**
```json
{
  "scripts": {
    "build": "tsx scripts/build.ts",
    "dev": "tsx watch scripts/build.ts"
  },
  "devDependencies": {
    "tsx": "^4.7.0"  // Fast TypeScript executor
  }
}
```

**Our `tsconfig.json` already supports this!** ✅

---

## 📊 Directory Structure After Task 2.3

```
packages/tokens/
├── tsconfig.json          ← Package TypeScript config ✨ NEW
├── package.json
├── scripts/
│   └── build.js          (type checked via this config)
├── src/
│   └── tokens.css        (excluded from type checking)
└── dist/                 (generated by build)
    └── tokens.css
```

---

## ✅ Verification Steps

To verify this task was completed correctly:

1. **Check config exists:**
   ```bash
   cat packages/tokens/tsconfig.json
   # Should show extends and compilerOptions
   ```

2. **Verify includes scripts only:**
   ```bash
   grep "include" packages/tokens/tsconfig.json
   # Should show: "include": ["scripts/**/*"]
   ```

3. **Verify excludes src:**
   ```bash
   grep '"src"' packages/tokens/tsconfig.json
   # Should appear in exclude array
   ```

4. **Check Node types:**
   ```bash
   grep "types" packages/tokens/tsconfig.json
   # Should show: "types": ["node"]
   ```

5. **Show resolved configuration:**
   ```bash
   cd packages/tokens
   npx tsc --showConfig
   # Shows merged config (root + package)
   ```

6. **List files that would be checked:**
   ```bash
   cd packages/tokens
   npx tsc --listFiles | grep "scripts"
   # Should list scripts/build.js
   ```

---

## 🔗 Related Tasks

- **Previous**: Task 2.2 (React Package TypeScript Config)
- **Next**: Task 3.1 (React Package Build - tsup)
- **Depends on**: Task 2.1 (root config to extend)
- **Required for**: Task 3.2 (Tokens package build)

---

## 🤔 Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Extend root | Yes | Inherit strict settings |
| Root directory | `./scripts` | Only JS/TS is in scripts/ |
| Include pattern | `scripts/**/*` | Only build tooling needs checking |
| Exclude src | Yes | Contains CSS, not TypeScript |
| Node types | Enabled | Build scripts use Node.js APIs |
| Keep as .js | Yes (for now) | Simple, can migrate to .ts later |

---

## 📚 References

- [TypeScript Configuration Inheritance](https://www.typescriptlang.org/tsconfig#extends)
- [Node.js Type Definitions](https://www.npmjs.com/package/@types/node)
- [TypeScript with Node.js ESM](https://nodejs.org/api/esm.html#typescript)
- [JSDoc Type Checking](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- [tsx - TypeScript Execute](https://github.com/esbuild-kit/tsx)

---

## 🎉 Part C Complete!

This completes **Part C: TypeScript Setup**!

**All TypeScript configurations are now in place:**
- ✅ Task 2.1 - Root configuration (strict rules)
- ✅ Task 2.2 - React package (component compilation)
- ✅ Task 2.3 - Tokens package (build script checking)

**Next up: Part D - Build Configuration**
- Task 3.1 - React package build (tsup)
- Task 3.2 - Tokens package build


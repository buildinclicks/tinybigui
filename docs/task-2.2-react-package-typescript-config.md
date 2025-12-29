# Task 2.2: React Package TypeScript Configuration

**Status**: ✅ Completed  
**Date**: December 29, 2025  
**Part**: Phase 0 - Part C (TypeScript Setup)

---

## 📋 Overview

This task created the TypeScript configuration for the `@tinybigui/react` package. It extends the root configuration and adds package-specific settings for output directories, source paths, and file inclusion patterns.

---

## 📄 Files Created

1. `packages/react/tsconfig.json` - React package TypeScript configuration

---

## 🔍 Detailed Explanation

### File: `packages/react/tsconfig.json`

This configuration **extends** the root `tsconfig.json` and adds React package-specific settings.

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "emitDeclarationOnly": false,
    "declarationDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"]
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

**How inheritance works:**
- Loads **all settings** from root `tsconfig.json`
- Only needs to specify **differences** or **overrides**
- Settings here take precedence over root

**What's inherited from root:**
- ✅ `strict: true` - All strict type checking
- ✅ `target: "ES2022"` - Modern JavaScript target
- ✅ `jsx: "react-jsx"` - Modern JSX transform
- ✅ `moduleResolution: "Bundler"` - Modern module resolution
- ✅ `noUncheckedIndexedAccess: true` - Safe array access
- ✅ `exactOptionalPropertyTypes: true` - Precise optional types
- ✅ All other compiler options

**Relative path resolution:**
```
packages/react/tsconfig.json  (current file)
../../                        (go up two directories)
tsconfig.json                 (root config at repo root)
```

**Benefits:**
- ✅ **Consistency** - All packages use same strict rules
- ✅ **Maintainability** - Update one place, affects all
- ✅ **Simplicity** - Package configs are small

---

### 2. Output Directory

```json
{
  "outDir": "./dist"
}
```

**Where compiled files are written.**

**File structure mapping:**
```
Before compilation (source):
src/
├── index.ts
├── components/
│   └── Button.tsx
└── utils/
    └── cn.ts

After compilation (output):
dist/
├── index.js
├── index.d.ts
├── components/
│   ├── Button.js
│   └── Button.d.ts
└── utils/
    ├── cn.js
    └── cn.d.ts
```

**Why `./dist`?**
- ✅ Standard convention across JavaScript ecosystem
- ✅ Matches `package.json` exports field
- ✅ Clean separation of source vs compiled code
- ✅ Easy to `.gitignore` (don't commit build artifacts)
- ✅ Easy to clean (`rm -rf dist`)

**Package.json alignment:**
```json
// packages/react/package.json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",  // ← matches outDir
      "require": "./dist/index.cjs"
    }
  }
}
```

---

### 3. Root Directory

```json
{
  "rootDir": "./src"
}
```

**Determines the structure of the output directory.**

**What it does:**
- Sets the base directory for all source files
- Preserves directory hierarchy relative to `rootDir`
- Prevents unwanted nesting in output

**Example - Without `rootDir`:**
```
Source:
src/index.ts

Output (incorrect):
dist/src/index.js  ❌ (unwanted "src" folder)
```

**Example - With `rootDir: "./src"`:**
```
Source:
src/index.ts

Output (correct):
dist/index.js  ✅ (clean structure)
```

**Complex example:**
```
Source:
src/
├── components/
│   └── Button/
│       └── Button.tsx
└── utils/
    └── helpers.ts

Output (with rootDir: "./src"):
dist/
├── components/
│   └── Button/
│       └── Button.js  ✅ (hierarchy preserved)
└── utils/
    └── helpers.js
```

---

### 4. Emit Declaration Only

```json
{
  "emitDeclarationOnly": false
}
```

**Controls what TypeScript compiler emits.**

**Options:**
- `false` (our setting) - Emit **both** JavaScript and type definitions
- `true` - Emit **only** type definitions (`.d.ts` files)

**Our workflow:**

| Tool | Purpose | Output |
|------|---------|--------|
| TypeScript (`tsc`) | Type checking + definitions | `.d.ts`, `.d.ts.map` |
| tsup (esbuild) | Fast transpilation + bundling | `.js`, `.cjs`, `.mjs` |

**Why `false`?**
- We want TypeScript to participate in the build
- Even though tsup handles JavaScript, TypeScript ensures types are correct
- Both tools work together

**Alternative approach (some use):**
```json
{
  "emitDeclarationOnly": true  // Only .d.ts from tsc
}
```
Then rely entirely on tsup for JavaScript. We keep it `false` for flexibility.

---

### 5. Declaration Directory

```json
{
  "declarationDir": "./dist"
}
```

**Where type definition files (`.d.ts`) are placed.**

**Set to same as `outDir`** for simplicity:
```
dist/
├── index.js          (JavaScript code)
├── index.d.ts        (Type definitions)
├── index.d.ts.map    (Declaration source map)
├── components/
│   ├── Button.js
│   ├── Button.d.ts
│   └── Button.d.ts.map
```

**Alternative structure (some libraries use):**
```
dist/
├── esm/
│   └── index.js
├── cjs/
│   └── index.cjs
└── types/            ← Separate folder for types
    └── index.d.ts
```

**Our choice:**
- ✅ Keep it simple - everything in `dist/`
- ✅ Types alongside code
- ✅ Easier for users (one import path)

---

### 6. Include Pattern

```json
{
  "include": ["src/**/*"]
}
```

**Specifies which files to compile.**

**Glob pattern breakdown:**
- `src/` - Start in the src directory
- `**/` - Any subdirectory (recursive, any depth)
- `*` - Any file (any name, any extension)

**What it matches:**
```
✅ src/index.ts
✅ src/components/Button.tsx
✅ src/components/Button/Button.tsx
✅ src/utils/cn.ts
✅ src/utils/types/common.ts
```

**What it doesn't match:**
```
❌ test/setup.ts           (outside src/)
❌ scripts/build.js        (outside src/)
❌ packages/tokens/...     (different package)
```

**File extensions automatically recognized:**
- `.ts` - TypeScript
- `.tsx` - TypeScript with JSX
- `.d.ts` - Type definitions
- `.js` - JavaScript (if `allowJs` enabled)
- `.jsx` - JavaScript with JSX (if `allowJs` enabled)

---

### 7. Exclude Pattern

```json
{
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.test.tsx",
    "**/*.spec.ts",
    "**/*.spec.tsx"
  ]
}
```

**Specifies files to ignore (even if matched by `include`).**

#### Why exclude each pattern:

**`node_modules`**
- Dependencies from npm/pnpm
- Already compiled
- Type checking them is slow and unnecessary

**`dist`**
- Build output directory
- Contains compiled code
- Would create circular issues

**`**/*.test.ts` and `**/*.test.tsx`**
- Test files (Jest/Vitest convention)
- Not part of published package
- Don't need to be compiled or type-checked for build

**`**/*.spec.ts` and `**/*.spec.tsx`**
- Spec files (alternative test convention)
- Same reasoning as `.test` files

**Example directory with exclusions:**
```
src/
├── index.ts                    ✅ Included
├── components/
│   ├── Button.tsx             ✅ Included
│   ├── Button.test.tsx        ❌ Excluded (test file)
│   └── Button.stories.tsx     ✅ Included (Storybook)
├── utils/
│   ├── cn.ts                  ✅ Included
│   └── cn.spec.ts             ❌ Excluded (spec file)
└── __tests__/
    └── setup.ts               ✅ Included (doesn't match pattern)
```

**Benefits:**
- ✅ Faster compilation (fewer files)
- ✅ Smaller output (no test code in dist/)
- ✅ Cleaner published package

**Test files are still type-checked in other contexts:**
```bash
# Type check everything (including tests)
npx tsc --noEmit

# Build package (excludes tests)
pnpm build
```

---

## 🎯 What This Configuration Achieves

✅ **Inherits strict settings** - All root config rules apply  
✅ **Package-specific paths** - `src/` → `dist/` mapping  
✅ **Clean output structure** - Mirrors source directory  
✅ **Type definitions included** - `.d.ts` files alongside code  
✅ **Tests excluded from build** - Not compiled or published  
✅ **Flexible setup** - Works with both tsc and tsup  
✅ **Standard conventions** - Follows ecosystem best practices  

---

## 🎓 Key Learnings

### TypeScript Configuration Hierarchy

**Three levels in our project:**

```
┌─────────────────────────────────────┐
│  1. Root (tsconfig.json)            │
│     - Strict mode                   │
│     - Target (ES2022)               │
│     - Module resolution             │
│     - JSX transform                 │
└──────────────┬──────────────────────┘
               │ extends
               ↓
┌─────────────────────────────────────┐
│  2. Package (packages/react/...)    │
│     - Output directories            │
│     - Source paths                  │
│     - Include/exclude patterns      │
└──────────────┬──────────────────────┘
               │ used by
               ↓
┌─────────────────────────────────────┐
│  3. Build Tool (tsup.config.ts)     │
│     - Formats (ESM/CJS)             │
│     - Bundling                      │
│     - Minification                  │
└─────────────────────────────────────┘
```

**Separation of concerns:**

| Tool | Responsibility | Output |
|------|----------------|--------|
| `tsc` | Type checking, type definitions | `.d.ts`, `.d.ts.map` |
| `tsup` (esbuild) | Fast transpilation, bundling | `.js`, `.cjs`, `.mjs` |
| Root config | Type safety rules | (inherited) |
| Package config | File organization | (structure) |

---

### Why TypeScript + Build Tool?

**Question:** If tsup compiles our TypeScript, why do we need `tsc`?

**Answer: Different responsibilities**

**TypeScript Compiler (`tsc`):**
- ✅ **Type checking** - Catches type errors
- ✅ **Type definitions** - Generates `.d.ts` files
- ✅ **Language service** - Powers IDE features
- ❌ Slower compilation
- ❌ No bundling

**tsup (esbuild):**
- ✅ **Fast transpilation** - 10-100x faster than tsc
- ✅ **Bundling** - Combines files
- ✅ **Multiple formats** - ESM, CJS, UMD
- ✅ **Minification** - Smaller output
- ❌ No type checking
- ❌ Basic `.d.ts` generation (uses tsc under the hood)

**Our workflow:**
```bash
# Development
pnpm dev
# → tsup --watch (fast rebuilds)

# Type check (separate)
pnpm typecheck
# → tsc --noEmit (validate types)

# Production build
pnpm build
# → tsup (compiles + bundles)
# → Also runs tsc for .d.ts generation
```

**Both are essential:**
- Can't skip `tsc` - Users need type definitions
- Can't skip `tsup` - Need fast, optimized builds

---

### Configuration Overrides

**How overrides work in extends:**

```json
// Root tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "outDir": "./dist"  // Default
  }
}

// Package tsconfig.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./build"  // ← Overrides root's "./dist"
  }
}

// Effective configuration (merged):
{
  "compilerOptions": {
    "strict": true,      // From root
    "outDir": "./build"  // From package (override)
  }
}
```

**In our case:**
- Root defines `target`, `strict`, `moduleResolution`, etc.
- Package adds `outDir`, `rootDir` (root doesn't specify these)
- No conflicts, clean merge

---

## 📊 Directory Structure After Task 2.2

```
packages/react/
├── tsconfig.json          ← Package TypeScript config ✨ NEW
├── package.json
├── src/
│   ├── index.ts
│   ├── utils/
│   │   ├── cn.ts
│   │   └── cn.test.ts    (excluded from build)
│   └── components/       (future)
│       ├── Button/
│       │   ├── Button.tsx
│       │   ├── Button.test.tsx  (excluded)
│       │   └── index.ts
│       └── ...
└── dist/                 (generated by build)
    ├── index.js          (ESM)
    ├── index.cjs         (CommonJS)
    ├── index.d.ts        (Types)
    ├── index.d.ts.map    (Source map)
    └── utils/
        ├── cn.js
        ├── cn.cjs
        └── cn.d.ts
```

---

## ✅ Verification Steps

To verify this task was completed correctly:

1. **Check config exists:**
   ```bash
   cat packages/react/tsconfig.json
   # Should show extends and compilerOptions
   ```

2. **Verify extends path:**
   ```bash
   grep "extends" packages/react/tsconfig.json
   # Should show: "extends": "../../tsconfig.json"
   ```

3. **Show resolved configuration:**
   ```bash
   cd packages/react
   npx tsc --showConfig
   # Shows merged config (root + package settings)
   ```

4. **Verify output structure:**
   ```bash
   cd packages/react
   npx tsc --outDir temp --declaration
   ls -R temp/
   # Should mirror src/ structure
   rm -rf temp/
   ```

5. **Check included files:**
   ```bash
   cd packages/react
   npx tsc --listFiles | grep "src/"
   # Should list all .ts/.tsx files in src/
   ```

---

## 🔗 Related Tasks

- **Previous**: Task 2.1 (Root TypeScript Config)
- **Next**: Task 2.3 (Tokens Package TypeScript Config)
- **Depends on**: Task 2.1 (root config to extend)
- **Required for**: Task 3.1 (tsup build configuration)

---

## 🤔 Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Extend root | Yes | Inherit strict settings, maintain consistency |
| Output directory | `./dist` | Standard convention, matches package.json |
| Root directory | `./src` | Clean output structure, no nesting |
| Declaration dir | Same as outDir | Simplicity, types alongside code |
| Exclude tests | Yes | Not part of published package |
| Emit declarations | Both JS + .d.ts | Full build output from TypeScript |

---

## 📚 References

- [TypeScript Configuration Inheritance](https://www.typescriptlang.org/tsconfig#extends)
- [TypeScript Compiler Options](https://www.typescriptlang.org/tsconfig)
- [tsconfig.json Include/Exclude](https://www.typescriptlang.org/tsconfig#include)
- [Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)


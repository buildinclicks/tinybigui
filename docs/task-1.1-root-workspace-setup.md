# Task 1.1: Root Workspace Setup

**Status**: ✅ Completed  
**Date**: December 29, 2025  
**Part**: Phase 0 - Part B (Project Initialization)

---

## 📋 Overview

This task established the foundational monorepo structure for tinybigui, configuring the workspace to support multiple packages (`@tinybigui/react` and `@tinybigui/tokens`) with shared tooling and dependencies.

---

## 📄 Files Created

1. `package.json` - Root workspace configuration
2. `pnpm-workspace.yaml` - Monorepo workspace definition
3. `.npmrc` - pnpm settings
4. `.gitignore` - Git ignore rules

---

## 🔍 Detailed Explanation

### File 1: `package.json` (Root Workspace)

This is the **monorepo root** configuration that manages all child packages.

#### Key Sections:

**1. Package Identity**

```json
{
  "name": "@tinybigui/monorepo",
  "version": "0.0.0",
  "private": true
}
```

- **`"private": true`** - Prevents accidentally publishing the root workspace to NPM
- Only child packages (`@tinybigui/react`, `@tinybigui/tokens`) will be published

**2. Package Manager Enforcement**

```json
{
  "packageManager": "pnpm@9.15.0"
}
```

- Enforces that everyone uses the same pnpm version
- Prevents "works on my machine" issues
- Corepack (Node.js) automatically installs the correct version

**3. Engine Requirements**

```json
{
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=9.0.0"
  }
}
```

- Requires Node.js 18+ and pnpm 9+
- Aligns with our modern tooling strategy
- Enforced by `.npmrc` with `engine-strict=true`

**4. Workspace Scripts**

```json
{
  "scripts": {
    "build": "pnpm -r build",
    "dev": "pnpm -r --parallel dev",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md,css}\"",
    "typecheck": "pnpm -r typecheck",
    "test": "pnpm -r test",
    "clean": "pnpm -r clean && rm -rf node_modules"
  }
}
```

- **`-r`** flag = "recursive" (runs in all workspace packages)
- **`--parallel`** = Runs simultaneously for faster dev mode
- Single command executes across entire monorepo

**5. Shared Dev Dependencies**

```json
{
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^8.18.2",
    "@typescript-eslint/parser": "^8.18.2",
    "eslint": "^9.17.0",
    "prettier": "^3.4.2",
    "typescript": "^5.7.2"
  }
}
```

- Installed at root level
- All packages use the same versions
- Ensures consistent code quality standards

---

### File 2: `pnpm-workspace.yaml`

Defines the monorepo workspace structure.

```yaml
packages:
  - "packages/*"
```

**What it means:**

- Any folder in `packages/` is treated as a separate package
- Examples: `packages/react/`, `packages/tokens/`
- pnpm links these packages together internally

**Benefits:**

- ✅ Fast installs (deduplicated dependencies)
- ✅ Internal package linking (no need to publish locally)
- ✅ Consistent dependency resolution

---

### File 3: `.npmrc`

pnpm configuration for the monorepo.

```ini
# Enforce engine compatibility
engine-strict=true

# Hoist dependencies to root node_modules for better compatibility
shamefully-hoist=true

# Automatically install peer dependencies
auto-install-peers=true

# Use strict peer dependencies (warn if mismatched)
strict-peer-dependencies=false
```

**Configuration breakdown:**

**1. `engine-strict=true`**

- Enforces Node/pnpm version requirements from `package.json`
- Installation fails if using wrong versions
- Prevents runtime errors from version mismatches

**2. `shamefully-hoist=true`**

- Hoists dependencies to root `node_modules/`
- Creates a flatter node_modules structure
- **Why needed:**
  - Storybook compatibility
  - Some build tools expect flat node_modules
  - Reduces nested dependency issues

**3. `auto-install-peers=true`**

- Automatically installs peer dependencies (React, Tailwind)
- Reduces manual installation steps
- pnpm 7+ feature

**4. `strict-peer-dependencies=false`**

- Allows minor peer dependency mismatches
- Warns but doesn't fail
- Useful for supporting React 18 and 19 simultaneously

---

### File 4: `.gitignore`

Tells Git what not to track in version control.

```gitignore
# Dependencies
node_modules/

# Build outputs
dist/
build/
*.tsbuildinfo

# Testing
coverage/

# Environment
.env
.env.local

# IDEs
.vscode/
.idea/
.DS_Store

# Logs
*.log

# Project-specific
info.txt
```

**Categories:**

**1. Dependencies** (`node_modules/`)

- Can be reinstalled via `pnpm install`
- Huge directory (100+ MB typically)
- Changes constantly

**2. Build outputs** (`dist/`, `build/`)

- Generated from source code
- Should be reproducible
- Different on each machine

**3. Environment files** (`.env*`)

- May contain secrets (API keys, tokens)
- Machine-specific configuration
- Security risk if committed

**4. IDE files** (`.vscode/`, `.DS_Store`)

- Personal preferences
- Different for each developer
- Not relevant to project

**5. Logs** (`*.log`)

- Debug information
- Temporary data
- Not needed in repository

---

## 🎯 What This Setup Achieves

✅ **Monorepo foundation** - Multiple packages in one repo  
✅ **Consistent tooling** - Everyone uses the same versions  
✅ **Clean Git history** - Only source code tracked  
✅ **Modern standards** - Node 18+, pnpm 9+, strict engines  
✅ **Shared dependencies** - ESLint, Prettier, TypeScript at root  
✅ **Workspace scripts** - Single commands for all packages

---

## 🎓 Key Learnings

### Why Monorepo?

**Advantages:**

- 📦 Single source of truth
- 🔄 Atomic commits across packages
- 🔗 Easy cross-package refactoring
- 🧪 Test packages together
- 📚 Shared tooling configuration

**Alternatives considered:**

- Multi-repo: Each package separate (harder to maintain)
- Monolith: Everything in one package (less modular)

### Why pnpm?

**vs npm:**

- ⚡ 2-3x faster installs
- 💾 Saves disk space (content-addressable storage)
- 🔒 Stricter dependency resolution

**vs yarn:**

- 📦 Better workspace support
- 🎯 More intuitive CLI
- 🚀 Active development

### Package Manager Lock-in

```json
"packageManager": "pnpm@9.15.0"
```

This uses **Corepack** (built into Node.js 16+):

- Automatically downloads correct pnpm version
- No need for global install
- Team uses exact same version

---

## 📊 Directory Structure After Task 1.1

```
tinybigui/
├── .gitignore           ← Git ignore rules
├── .npmrc               ← pnpm configuration
├── package.json         ← Root workspace config
├── pnpm-workspace.yaml  ← Workspace definition
├── packages/            ← Future packages go here
│   ├── react/          (Task 1.2)
│   └── tokens/         (Task 1.3)
└── strategies/          ← Existing strategy docs
```

---

## ✅ Verification Steps

To verify this task was completed correctly:

1. **Check workspace structure:**

   ```bash
   cat pnpm-workspace.yaml
   # Should show: packages: - 'packages/*'
   ```

2. **Verify package manager:**

   ```bash
   cat package.json | grep packageManager
   # Should show: "packageManager": "pnpm@9.15.0"
   ```

3. **Check gitignore:**
   ```bash
   git check-ignore node_modules dist .env
   # All three should be ignored
   ```

---

## 🔗 Related Tasks

- **Previous**: Task 0.3 (GitHub Repository Setup)
- **Next**: Task 1.2 (React Package Setup)
- **Depends on**: None (foundational task)
- **Required for**: All subsequent tasks

---

## 📝 Commit Information

**Commit message**: `chore: setup monorepo structure and react package`  
**Files in commit**:

- `package.json`
- `pnpm-workspace.yaml`
- `.npmrc`
- `.gitignore`

---

## 🤔 Decisions Made

| Decision           | Choice          | Rationale                                 |
| ------------------ | --------------- | ----------------------------------------- |
| Package manager    | pnpm 9+         | Fast, efficient, modern workspace support |
| Node version       | 18+             | Modern features, long-term support        |
| Monorepo tool      | pnpm workspaces | Built-in, no extra tools needed           |
| Hoisting           | Enabled         | Storybook compatibility                   |
| Engine enforcement | Strict          | Prevent version mismatch issues           |

---

## 📚 References

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [pnpm Configuration](https://pnpm.io/npmrc)
- [Node.js Corepack](https://nodejs.org/api/corepack.html)
- [Git Ignore Patterns](https://git-scm.com/docs/gitignore)

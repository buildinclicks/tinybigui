# Task 9.1: ESLint Configuration

**Task ID:** 9.1  
**Category:** Phase 0 - Part J (Code Quality)  
**Status:** ✅ Complete  
**Date:** 2025-12-31

---

## 📋 Task Overview

**Objective:** Configure ESLint for React + TypeScript + Accessibility linting with latest stable versions.

**Why This Task Matters:**

- **Catch bugs early** - Find potential issues before runtime
- **Enforce best practices** - React, TypeScript, and accessibility rules
- **Consistent code** - Team-wide coding standards
- **Quality assurance** - Block bad code from being committed

---

## 🎯 What Was Done

### 1. Checked Latest Package Versions ✅

**Method:** Direct npm registry queries via `pnpm view`

| Package                     | Version | Purpose                |
| --------------------------- | ------- | ---------------------- |
| `eslint`                    | 9.39.2  | Core linting engine    |
| `typescript-eslint`         | 8.51.0  | TypeScript support     |
| `eslint-plugin-react`       | 7.37.5  | React-specific rules   |
| `eslint-plugin-react-hooks` | 7.0.1   | React Hooks rules      |
| `eslint-plugin-jsx-a11y`    | 6.10.2  | Accessibility rules    |
| `eslint-config-prettier`    | 10.1.8  | Prettier compatibility |
| `eslint-plugin-storybook`   | 10.1.11 | Already installed!     |

**Total New Packages:** 6 packages installed

---

### 2. Installed ESLint Packages ✅

```bash
pnpm add -D eslint@^9.39.2 \
  typescript-eslint@^8.51.0 \
  eslint-plugin-react@^7.37.5 \
  eslint-plugin-react-hooks@^7.0.1 \
  eslint-plugin-jsx-a11y@^6.10.2 \
  eslint-config-prettier@^10.1.8
```

**Note:** ESLint 9.x uses the new **flat config** format (`eslint.config.js`), not the old `.eslintrc.json`.

---

### 3. Created ESLint Configuration ✅

**File:** `eslint.config.js` (215 lines)

**Configuration Structure:**

```javascript
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import storybook from "eslint-plugin-storybook";
import prettier from "eslint-config-prettier";

export default tseslint
  .config
  // Multiple configuration objects...
  ();
```

---

### 4. Configuration Sections ✅

#### **A. Ignore Patterns**

```javascript
{
  ignores: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.storybook/vitest.setup.ts', // Auto-generated
    '**/coverage/**',
    'eslint.config.js', // Self-ignore
  ],
}
```

#### **B. Base Rules**

- JavaScript recommended (`js.configs.recommended`)
- TypeScript recommended + stylistic
- Project service for type-aware linting

#### **C. React Rules**

```javascript
{
  'react/prop-types': 'off', // We use TypeScript
  'react/self-closing-comp': 'error',
  'react/react-in-jsx-scope': 'off', // React 18+
  'react/button-has-type': 'error',
  'react/jsx-fragments': ['error', 'syntax'],
  'react/jsx-no-target-blank': 'error',
}
```

#### **D. React Hooks Rules**

```javascript
{
  'react-hooks/rules-of-hooks': 'error', // Enforce Rules of Hooks
  'react-hooks/exhaustive-deps': 'warn', // Check deps arrays
}
```

#### **E. Accessibility Rules (WCAG)**

```javascript
{
  'jsx-a11y/alt-text': 'error',
  'jsx-a11y/aria-props': 'error',
  'jsx-a11y/role-has-required-aria-props': 'error',
  'jsx-a11y/tabindex-no-positive': 'error',
  'jsx-a11y/heading-has-content': 'error',
  'jsx-a11y/interactive-supports-focus': 'error',
  // React Aria handles keyboard events, so warn only:
  'jsx-a11y/click-events-have-key-events': 'warn',
}
```

#### **F. TypeScript Rules**

```javascript
{
  '@typescript-eslint/consistent-type-imports': 'error',
  '@typescript-eslint/no-unused-vars': 'warn',
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
  '@typescript-eslint/explicit-function-return-type': 'warn',
}
```

#### **G. Test Files Overrides**

```javascript
{
  files: ['**/*.test.{ts,tsx}', '**/test/**/*.{ts,tsx}'],
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/button-has-type': 'off', // Testing raw elements
  },
}
```

#### **H. Node.js Scripts**

```javascript
{
  files: ['**/scripts/*.js', '*.config.js'],
  languageOptions: {
    globals: { console: 'readonly', process: 'readonly' },
  },
  rules: {
    '@typescript-eslint/no-floating-promises': 'off',
  },
}
```

#### **I. Storybook Files**

```javascript
{
  files: ['**/*.stories.{ts,tsx}'],
  plugins: { storybook },
  rules: { ...storybook.configs.recommended.rules },
}
```

#### **J. Prettier Integration**

```javascript
prettier, // Disables conflicting rules
```

---

### 5. Added Scripts to package.json ✅

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

**Usage:**

- `pnpm lint` - Check for issues
- `pnpm lint:fix` - Auto-fix issues

---

### 6. Fixed Code Issues ✅

**Issues Found and Fixed:**

1. **`cn.test.ts`** - Constant truthiness

   ```typescript
   // ❌ Before
   const result = cn("button", false && "hidden");

   // ✅ After
   const shouldHide = false;
   const result = cn("button", shouldHide && "hidden");
   ```

2. **`colors.ts`** - Missing return type

   ```typescript
   // ❌ Before
   const toHex = (n: number) => { ... }

   // ✅ After
   const toHex = (n: number): string => { ... }
   ```

3. **Test files** - Button type not required in tests (configured)

---

## 📊 ESLint 9.x vs Previous Versions

### **What Changed:**

| Feature         | Old (.eslintrc)   | New (flat config)       |
| --------------- | ----------------- | ----------------------- |
| **Config File** | `.eslintrc.json`  | `eslint.config.js`      |
| **Format**      | JSON/YAML         | JavaScript ES modules   |
| **Extends**     | String array      | Import and spread       |
| **Plugins**     | String names      | Import objects          |
| **Overrides**   | `overrides` array | Multiple config objects |
| **Type**        | Static            | Dynamic (full JS power) |

### **Benefits of Flat Config:**

1. ✅ **Type-safe** - Import actual plugin objects
2. ✅ **Flexible** - Use JavaScript logic
3. ✅ **Explicit** - See exactly what's configured
4. ✅ **Modern** - ES modules, not JSON
5. ✅ **Simpler** - Less magic, more clarity

---

## 💡 Rules Explained

### **Why `react/prop-types` is OFF:**

We use TypeScript for prop validation, so PropTypes are redundant.

### **Why `react/react-in-jsx-scope` is OFF:**

React 18+ with new JSX transform doesn't require `import React` in every file.

### **Why `jsx-a11y/click-events-have-key-events` is WARN:**

React Aria handles keyboard events automatically, so this would be noisy. But still warn in case we forget React Aria.

### **Why `@typescript-eslint/explicit-function-return-type` is WARN:**

Encourages return types but doesn't block (TypeScript infers most types correctly).

### **Why Test Files Have Relaxed Rules:**

- Mocking often requires `any` types
- Testing raw elements doesn't need button types
- Test code is less critical than production code

---

## 📂 Files Created/Modified

### Created Files

1. **`eslint.config.js`** (215 lines)
   - Flat config format (ESLint 9.x)
   - 10 configuration sections
   - React + TypeScript + Accessibility rules
   - Test file overrides
   - Storybook integration
   - Prettier compatibility

### Modified Files

1. **`package.json` (root)**
   - Updated `lint` script (removed `--ext` flag, not needed in flat config)
   - Added `lint:fix` script

2. **`packages/react/package.json`**
   - Added 6 ESLint packages to `devDependencies`

3. **`packages/react/src/utils/__tests__/cn.test.ts`**
   - Fixed constant truthiness issue

4. **`packages/react/src/utils/colors.ts`**
   - Added return type to inline function

---

## ✅ Success Criteria

- [x] Latest ESLint 9.39.2 installed
- [x] TypeScript ESLint 8.51.0 configured
- [x] React rules enabled
- [x] React Hooks rules enabled
- [x] Accessibility rules (jsx-a11y) enabled
- [x] Storybook rules integrated
- [x] Prettier conflicts resolved
- [x] Test file overrides configured
- [x] Node scripts configured
- [x] All code passes linting (`pnpm lint` exits 0)
- [x] Scripts added to package.json

---

## 🎓 Key Learnings

### 1. ESLint 9.x Flat Config is Different

**Migration from old format:**

```javascript
// ❌ Old (.eslintrc.json)
{
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "plugins": ["react"],
  "rules": { "react/prop-types": "off" }
}

// ✅ New (eslint.config.js)
import js from '@eslint/js';
import react from 'eslint-plugin-react';

export default [
  js.configs.recommended,
  {
    plugins: { react },
    rules: { 'react/prop-types': 'off' },
  },
];
```

### 2. TypeScript Project Service

The `projectService` option in ESLint 8.51+ automatically finds TypeScript config files:

```javascript
parserOptions: {
  projectService: true, // Auto-finds tsconfig.json
}
```

No need to manually specify `project: './tsconfig.json'`!

### 3. Allow Default Project for Build Scripts

Some files (like `build.js`) aren't in `tsconfig.json`. Use `allowDefaultProject`:

```javascript
projectService: {
  allowDefaultProject: ['*.js', 'packages/tokens/scripts/*.js'],
}
```

**Warning:** Don't use `**` globs (performance issues).

### 4. React Aria and jsx-a11y

Since we use React Aria for accessibility primitives, some jsx-a11y rules are overly strict:

- `jsx-a11y/click-events-have-key-events` → `warn` (React Aria handles it)
- `jsx-a11y/no-static-element-interactions` → `warn` (React Aria handles it)

### 5. Test Files Need Different Rules

Production code: Strict rules ✅  
Test code: Relaxed rules ✅

Example:

- `@typescript-eslint/no-explicit-any`: `error` in prod, `off` in tests
- `react/button-has-type`: `error` in prod, `off` in tests

### 6. Prettier Conflicts

Always include `eslint-config-prettier` last to disable conflicting formatting rules:

```javascript
import prettier from "eslint-config-prettier";

export default [
  // ... other configs
  prettier, // Must be last!
];
```

---

## 🔗 Related Tasks

**Prerequisite Tasks:**

- ✅ Part A-I completed (all foundation work)

**This Task (9.1):**

- ✅ ESLint configuration complete

**Next Tasks:**

- ⏳ Task 9.2 - Prettier Configuration
- ⏳ Task 9.3 - Husky Setup
- ⏳ Task 9.4 - Commitlint Configuration
- ⏳ Task 9.5 - lint-staged Configuration

---

## 📝 Notes for Next Steps

### Task 9.2: Prettier

Will add:

- Code formatting
- **Tailwind class sorting** (automatic!)
- `.prettierrc` config
- `.prettierignore` file

### Testing ESLint

```bash
# Check all files
pnpm lint

# Auto-fix issues
pnpm lint:fix

# Check specific file
pnpm eslint path/to/file.ts
```

### Common ESLint Commands

```bash
# Lint everything
pnpm lint

# Fix auto-fixable issues
pnpm lint:fix

# Lint and show rule names
pnpm eslint . --format=stylish

# Lint specific directory
pnpm eslint packages/react/src
```

---

## ✅ Task Completion

**Status:** Complete ✅  
**Result:** ESLint 9.39.2 configured with React, TypeScript, and accessibility rules. All code passes linting.

**What We Have:**

- ✅ Latest ESLint (9.39.2)
- ✅ TypeScript support (8.51.0)
- ✅ React best practices
- ✅ React Hooks enforcement
- ✅ Accessibility rules (WCAG)
- ✅ Storybook integration
- ✅ Prettier compatibility
- ✅ All code passing lint checks

**To Lint:**

```bash
pnpm lint           # Check for issues
pnpm lint:fix       # Auto-fix issues
```

**Next Task:** 9.2 - Prettier Configuration (auto-formatting + Tailwind class sorting)

---

_Task completed on 2025-12-31 as part of Phase 0 - Part J (Code Quality)_

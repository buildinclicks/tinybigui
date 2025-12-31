# Task 9.2: Prettier Configuration

**Task ID:** 9.2  
**Category:** Phase 0 - Part J (Code Quality)  
**Status:** ✅ Complete  
**Date:** 2025-12-31

---

## 📋 Task Overview

**Objective:** Configure Prettier for automatic code formatting with Tailwind CSS class sorting.

**Why This Task Matters:**

- **Consistent code style** - No debates about formatting
- **Auto-formatting** - Save time, let tools handle it
- **Tailwind class sorting** - Automatic, consistent class order
- **Team collaboration** - Same style across all contributors
- **Focus on logic** - Not formatting

---

## 🎯 What Was Done

### 1. Checked Latest Package Versions ✅

**Method:** Direct npm registry queries via `pnpm view`

| Package                         | Version | Purpose                     |
| ------------------------------- | ------- | --------------------------- |
| `prettier`                      | 3.7.4   | Code formatter              |
| `prettier-plugin-tailwindcss`   | 0.7.2   | Tailwind class auto-sorting |
| `eslint-config-prettier` (already installed) | 10.1.8  | ESLint compatibility        |

**Total New Packages:** 2 packages installed

---

### 2. Installed Prettier Packages ✅

```bash
pnpm add -D -w prettier@^3.7.4 prettier-plugin-tailwindcss@^0.7.2
```

**Note:** Installed to workspace root (`-w` flag) since Prettier is a shared tool for the entire monorepo.

---

### 3. Created Prettier Configuration ✅

**File:** `.prettierrc` (12 lines)

```json
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always",
  "endOfLine": "lf",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

---

### 4. Configuration Settings Explained ✅

#### **`"semi": true`**

**Use semicolons:**

```typescript
// ✅ With semicolons
const hello = "world";
```

**Why:** Explicit, prevents ASI (Automatic Semicolon Insertion) edge cases.

---

#### **`"singleQuote": false`**

**Use double quotes:**

```typescript
// ✅ Double quotes
const message = "Hello, world!";

// ❌ Single quotes
const message = 'Hello, world!';
```

**Why:** Consistency with JSON, less escaping in strings with contractions.

---

#### **`"tabWidth": 2, "useTabs": false`**

**Use 2 spaces for indentation:**

```typescript
// ✅ 2 spaces
function hello() {
  return "world";
}
```

**Why:** Standard for JavaScript/TypeScript, compact yet readable.

---

#### **`"trailingComma": "es5"`**

**Add trailing commas where valid in ES5:**

```typescript
// ✅ ES5 compatible
const obj = {
  name: "John",
  age: 30,
};

// ✅ No trailing comma in function calls (not ES5)
hello("world");
```

**Why:** Cleaner diffs, easier to add/remove items.

---

#### **`"printWidth": 100`**

**Wrap lines at 100 characters:**

```typescript
// ✅ Wraps at 100 characters
const longString =
  "This is a very long string that will wrap at 100 characters to maintain readability";
```

**Why:** Modern screens are wide, 100 is a good balance (80 is too narrow, 120 is too wide).

---

#### **`"arrowParens": "always"`**

**Always use parentheses around arrow function parameters:**

```typescript
// ✅ Always use parens
const double = (x) => x * 2;

// ❌ Without parens
const double = x => x * 2;
```

**Why:** Consistent, easier to add types/parameters later.

---

#### **`"endOfLine": "lf"`**

**Use Unix line endings (LF):**

- Windows: `\r\n` (CRLF)
- Unix/Mac: `\n` (LF) ✅

**Why:** Git normalizes to LF, avoids cross-platform issues.

---

#### **`"bracketSpacing": true`**

**Add spaces inside object literals:**

```typescript
// ✅ With spacing
const obj = { name: "John" };

// ❌ Without spacing
const obj = {name: "John"};
```

**Why:** More readable.

---

#### **`"bracketSameLine": false`**

**Put closing bracket on new line:**

```tsx
// ✅ New line
<Button
  variant="filled"
  onClick={handleClick}
>
  Click Me
</Button>

// ❌ Same line
<Button
  variant="filled"
  onClick={handleClick}>
  Click Me
</Button>
```

**Why:** More consistent with formatting conventions.

---

#### **`"plugins": ["prettier-plugin-tailwindcss"]`** ⭐

**Automatically sort Tailwind CSS classes!**

**Before formatting:**

```tsx
<button className="p-4 bg-primary text-white rounded-lg hover:bg-primary-dark mt-2 flex items-center">
  Click Me
</button>
```

**After formatting (auto-sorted!):**

```tsx
<button className="mt-2 flex items-center rounded-lg bg-primary p-4 text-white hover:bg-primary-dark">
  Click Me
</button>
```

**Sorting Order (Tailwind recommended):**

1. Layout (display, position)
2. Box model (margin, padding, width, height)
3. Typography (font, text)
4. Visual (background, border, shadow)
5. Miscellaneous (cursor, pointer-events)
6. Responsive modifiers (sm:, md:, lg:)
7. State modifiers (hover:, focus:, active:)

**Why:** Consistent class order across entire codebase, easier to scan, merge conflicts reduced.

---

### 5. Created Prettier Ignore File ✅

**File:** `.prettierignore` (42 lines)

**What's Ignored:**

```
# Dependencies
node_modules
.pnpm-store

# Build outputs
dist
build
out
.next
.cache
storybook-static

# Coverage
coverage
.nyc_output

# Package manager lock files
pnpm-lock.yaml
package-lock.json
yarn.lock

# IDE files
.vscode
.idea

# Auto-generated files
**/.storybook/vitest.setup.ts
```

**Why Ignore These:**

- **node_modules** - Third-party code, don't format
- **dist/build** - Generated code, will be rebuilt
- **Lock files** - Generated by package managers
- **IDE files** - Personal preferences
- **Auto-generated** - Will be regenerated

---

### 6. Formatted All Files ✅

**Command:** `pnpm format`

**Results:**

- ✅ **60 files formatted**
- ✅ All documentation (`.md`)
- ✅ All TypeScript/JavaScript (`.ts`, `.tsx`, `.js`)
- ✅ All JSON (`.json`)
- ✅ All CSS (`.css`)
- ✅ **Tailwind classes auto-sorted** in all files

**Verification:**

```bash
$ pnpm format:check
✓ All matched files use Prettier code style!

$ pnpm lint
✓ No ESLint errors
```

---

## 🎨 Tailwind Class Sorting Examples

### **Example 1: Button Component**

**Before:**

```tsx
<button className="text-white bg-primary p-4 hover:bg-primary-dark rounded-lg shadow-md">
  Click Me
</button>
```

**After (auto-sorted):**

```tsx
<button className="rounded-lg bg-primary p-4 text-white shadow-md hover:bg-primary-dark">
  Click Me
</button>
```

**Order:** Layout → Box Model → Typography → Visual → States

---

### **Example 2: Complex Component**

**Before:**

```tsx
<div className="flex-col p-6 mt-4 bg-surface text-on-surface flex rounded-xl shadow-elevation-2 hover:shadow-elevation-4 transition-shadow duration-short2">
  Content
</div>
```

**After (auto-sorted):**

```tsx
<div className="mt-4 flex flex-col rounded-xl bg-surface p-6 text-on-surface shadow-elevation-2 transition-shadow duration-short2 hover:shadow-elevation-4">
  Content
</div>
```

---

### **Example 3: Responsive Design**

**Before:**

```tsx
<div className="p-4 md:p-8 text-sm md:text-base lg:text-lg flex-col md:flex-row flex">
  Content
</div>
```

**After (auto-sorted):**

```tsx
<div className="flex flex-col p-4 text-sm md:flex-row md:p-8 md:text-base lg:text-lg">
  Content
</div>
```

**Note:** Responsive modifiers grouped together logically!

---

## 📂 Files Created/Modified

### Created Files

1. **`.prettierrc`** (12 lines)

   - JSON configuration
   - 10 formatting rules
   - Tailwind plugin enabled

2. **`.prettierignore`** (42 lines)
   - Ignore dependencies
   - Ignore build outputs
   - Ignore lock files
   - Ignore generated files

### Modified Files

**All project files formatted (60 files):**

- ✅ Documentation files (`.md`) - 23 files
- ✅ TypeScript files (`.ts`, `.tsx`) - 20 files
- ✅ JavaScript files (`.js`) - 3 files
- ✅ JSON files (`.json`) - 5 files
- ✅ CSS files (`.css`) - 2 files
- ✅ Config files - 7 files

**Formatting changes:**

- Consistent indentation (2 spaces)
- Consistent quotes (double)
- Consistent semicolons (always)
- Consistent line endings (LF)
- **Tailwind classes sorted** in all components

---

## ✅ Success Criteria

- [x] Prettier 3.7.4 installed
- [x] Tailwind plugin 0.7.2 installed
- [x] `.prettierrc` configuration created
- [x] `.prettierignore` file created
- [x] All files formatted (`pnpm format`)
- [x] Format check passes (`pnpm format:check`)
- [x] ESLint still passes (no conflicts)
- [x] Tailwind classes auto-sorted
- [x] Scripts already in package.json

---

## 🎓 Key Learnings

### 1. Prettier vs ESLint

**ESLint:**

- Finds bugs and code quality issues
- Enforces best practices
- Can fix some issues

**Prettier:**

- Only handles formatting (style)
- Opinionated, less configurable
- Faster, more consistent

**Together:** ESLint finds issues, Prettier formats. No overlap (with `eslint-config-prettier`).

---

### 2. Why Tailwind Class Sorting Matters

**Without sorting:**

```tsx
// Developer A
<div className="p-4 bg-primary text-white rounded">

// Developer B
<div className="text-white rounded bg-primary p-4">
```

Same classes, different order → Unnecessary diff noise!

**With sorting:**

```tsx
// Both developers
<div className="rounded bg-primary p-4 text-white">
```

Consistent order → Clean diffs!

---

### 3. Print Width: Why 100?

**80 characters:** Standard for decades, but restrictive on modern screens  
**100 characters:** Good balance - fits on most screens, more readable  
**120+ characters:** Too wide, hard to have side-by-side views

**Our choice:** 100 characters (same as our ESLint max line length).

---

### 4. Single vs Double Quotes

**Single quotes (`'`):**

- Less typing
- Popular in JavaScript

**Double quotes (`"`):**

- Matches JSON
- Less escaping for contractions ("don't" vs 'don\'t')
- More consistent with HTML attributes

**Our choice:** Double quotes for consistency.

---

### 5. Prettier Plugin Order

Prettier plugins run in order. For us:

```json
{
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

If we add more plugins later (e.g., `prettier-plugin-organize-imports`), order matters:

```json
{
  "plugins": [
    "prettier-plugin-organize-imports", // Runs first
    "prettier-plugin-tailwindcss" // Runs second (must be last!)
  ]
}
```

**Rule:** `prettier-plugin-tailwindcss` must always be last.

---

### 6. Format on Save

**Recommendation for users:**

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

Auto-format on every save!

---

### 7. Prettier vs Linters (Performance)

**ESLint:** Slow (parses AST, checks rules)  
**Prettier:** Fast (just formatting, no analysis)

**Strategy:**

1. Run Prettier first (fast, fixes formatting)
2. Run ESLint second (slower, checks quality)

**In CI/CD:**

```bash
pnpm format:check  # Fast, fails if not formatted
pnpm lint          # Slower, checks code quality
```

---

## 🔗 Related Tasks

**Prerequisite Tasks:**

- ✅ Task 9.1 - ESLint Configuration

**This Task (9.2):**

- ✅ Prettier configuration complete

**Next Tasks:**

- ⏳ Task 9.3 - Husky Setup (Git hooks)
- ⏳ Task 9.4 - Commitlint Configuration
- ⏳ Task 9.5 - lint-staged Configuration

---

## 📝 Notes for Next Steps

### Task 9.3: Husky

Will integrate Prettier with Git hooks:

```bash
# Before commit
pnpm lint-staged  # Runs Prettier + ESLint on staged files
```

### Task 9.5: lint-staged

Will configure to run on staged files only:

```javascript
{
  '*.{ts,tsx,js,jsx}': [
    'prettier --write',  // Format
    'eslint --fix',      // Lint
  ],
}
```

### Using Prettier

```bash
# Format all files
pnpm format

# Check if formatted
pnpm format:check

# Format specific file
pnpm prettier --write path/to/file.ts
```

---

## 🎨 Prettier in Action

### Before Prettier:

**File 1:**

```typescript
const obj={name:"John",age:30}
```

**File 2:**

```typescript
const obj = { name: "John", age: 30 };
```

**File 3:**

```typescript
const obj = {
  name: "John",
  age: 30,
};
```

### After Prettier:

**All files:**

```typescript
const obj = { name: "John", age: 30 };
```

**Consistent! 🎉**

---

## ✅ Task Completion

**Status:** Complete ✅  
**Result:** Prettier 3.7.4 configured with Tailwind CSS class auto-sorting. All 60 files formatted.

**What We Have:**

- ✅ Prettier 3.7.4 (latest)
- ✅ Tailwind plugin 0.7.2 (auto-sorting)
- ✅ ESLint compatibility
- ✅ All files formatted
- ✅ Format check passes
- ✅ ESLint still passes
- ✅ Ready for Git hooks!

**To Format:**

```bash
pnpm format           # Format all files
pnpm format:check     # Check if formatted
```

**Next Task:** 9.3 - Husky Setup (Git hooks to run Prettier automatically)

---

_Task completed on 2025-12-31 as part of Phase 0 - Part J (Code Quality)_


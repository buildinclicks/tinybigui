# Task 9.4: Commitlint Configuration

**Status**: ✅ Complete  
**Date**: 2025-12-31  
**Related**: Task 9.1 (ESLint), Task 9.2 (Prettier), Task 9.3 (Husky), Task 9.5 (lint-staged)

---

## 🎯 Goal

Set up **Commitlint** to automatically validate commit messages against the **Conventional Commits** specification, ensuring consistent and meaningful Git history for our open-source project.

---

## 📋 What Was Done

### 1. Installed Commitlint Packages

**Packages**: 
- `@commitlint/cli@^20.2.0` (latest stable)
- `@commitlint/config-conventional@^20.2.0` (latest stable)

```bash
pnpm add -D -w @commitlint/cli@latest @commitlint/config-conventional@latest
```

**Why these packages?**
- ✅ `@commitlint/cli` - Command-line interface for commitlint
- ✅ `@commitlint/config-conventional` - Pre-configured rules for Conventional Commits
- ✅ Latest stable versions (checked Dec 2025)
- ✅ Wide adoption in open-source projects

---

### 2. Created Commitlint Configuration

**File**: `commitlint.config.js`

```javascript
module.exports = {
  extends: ["@commitlint/config-conventional"],

  rules: {
    // Type must be one of these
    "type-enum": [
      2,
      "always",
      [
        "feat",     // New feature
        "fix",      // Bug fix
        "docs",     // Documentation
        "style",    // Code style
        "refactor", // Code refactoring
        "perf",     // Performance improvement
        "test",     // Testing
        "build",    // Build system
        "ci",       // CI/CD
        "chore",    // Maintenance
        "revert",   // Revert commit
      ],
    ],

    // Subject must not be empty
    "subject-empty": [2, "never"],

    // Subject must not end with a period
    "subject-full-stop": [2, "never", "."],

    // Subject must be lowercase
    "subject-case": [2, "always", "lower-case"],

    // Type must be lowercase
    "type-case": [2, "always", "lower-case"],

    // Type must not be empty
    "type-empty": [2, "never"],

    // Scope must be lowercase (if provided)
    "scope-case": [2, "always", "lower-case"],

    // Header (type + scope + subject) max length
    "header-max-length": [2, "always", 100],

    // Body max line length
    "body-max-line-length": [2, "always", 100],

    // Footer max line length
    "footer-max-line-length": [2, "always", 100],
  },
};
```

**Why CommonJS (`module.exports`)?**
- ✅ Avoids `MODULE_TYPELESS_PACKAGE_JSON` warning
- ✅ Works without adding `"type": "module"` to package.json
- ✅ Consistent with most Node.js tools
- ✅ No `.mjs` extension needed

---

### 3. Updated Commit-Msg Hook

**File**: `.husky/commit-msg`

**Before** (placeholder):
```bash
echo "📝 Validating commit message..."
```

**After** (active validation):
```bash
pnpm commitlint --edit $1
```

**What this does:**
- ✅ Runs commitlint on every commit
- ✅ Validates message format before commit is created
- ✅ Provides clear error messages if invalid
- ✅ Blocks commits with bad messages

---

### 4. Added Commitlint Script

**Updated**: `package.json`

```json
{
  "scripts": {
    "commitlint": "commitlint --edit"
  },
  "devDependencies": {
    "@commitlint/cli": "^20.2.0",
    "@commitlint/config-conventional": "^20.2.0"
  }
}
```

**Purpose**: Allows manual testing of commit messages

---

## 🧪 Verification

### Test 1: Invalid Commit Message

```bash
$ git commit -m "added commitlint config"

⧗   input: added commitlint config
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]

✖   found 2 problems, 0 warnings

husky - commit-msg script failed (code 1)
```

✅ **Rejected** - No type specified!

---

### Test 2: Valid Commit Message

```bash
$ git commit -m "chore: configure commitlint"

> @tinybigui/monorepo@0.0.0 commitlint
> commitlint --edit

[dev 523ce3c] chore: configure commitlint
```

✅ **Accepted** - Proper conventional format!

---

## 📁 Files Created/Modified

### Created
- `commitlint.config.js` - Commitlint configuration with conventional rules

### Modified
- `.husky/commit-msg` - Updated to run commitlint
- `package.json` - Added commitlint dependencies and script
- `pnpm-lock.yaml` - Updated with new dependencies

---

## 🎓 Key Learnings

### 1. **What is Conventional Commits?**

A **specification** for commit messages that makes Git history:
- ✅ **Human-readable** - Clear what each commit does
- ✅ **Machine-readable** - Tools can parse and generate changelogs
- ✅ **Consistent** - Same format across all contributors

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Example:**
```
feat(button): add ripple animation

Implement Material Design 3 ripple effect for button component.
Uses state layers for hover, focus, and press states.

Closes #42
```

---

### 2. **Commit Message Types**

| Type | Purpose | Example |
|------|---------|---------|
| `feat` | New feature | `feat(textfield): add error state` |
| `fix` | Bug fix | `fix(button): resolve hover flicker` |
| `docs` | Documentation | `docs: update installation guide` |
| `style` | Code formatting | `style: format with prettier` |
| `refactor` | Code restructure | `refactor(utils): simplify cn function` |
| `perf` | Performance | `perf(ripple): optimize animation` |
| `test` | Add/update tests | `test(button): add accessibility tests` |
| `build` | Build system | `build: upgrade to vite 6` |
| `ci` | CI/CD changes | `ci: add chromatic workflow` |
| `chore` | Maintenance | `chore: update dependencies` |
| `revert` | Revert commit | `revert: undo button changes` |

---

### 3. **Scope (Optional but Recommended)**

**Scope** = Component/area affected

**Examples:**
```
feat(button): add variant prop
fix(textfield): resolve focus ring
docs(readme): add installation steps
chore(deps): upgrade react to 18.3.1
```

**For our project:**
- Component names: `button`, `textfield`, `checkbox`
- Utilities: `utils`, `colors`, `typography`
- Packages: `react`, `tokens`
- Infrastructure: `build`, `ci`, `docs`

---

### 4. **Why Enforce Commit Messages?**

**Benefits for open-source projects:**

1. **Automated Changelogs**
   ```bash
   # Generate CHANGELOG.md automatically
   conventional-changelog -p angular -i CHANGELOG.md -s
   ```

2. **Semantic Versioning**
   ```
   feat: ... → MINOR version bump (0.1.0 → 0.2.0)
   fix: ...  → PATCH version bump (0.1.0 → 0.1.1)
   BREAKING CHANGE: → MAJOR version bump (0.1.0 → 1.0.0)
   ```

3. **Better Git History**
   ```bash
   $ git log --oneline
   feat(button): add size variants
   fix(textfield): resolve label positioning
   docs: update component API
   chore: upgrade dependencies
   ```
   vs.
   ```bash
   $ git log --oneline (without commitlint)
   fixes
   WIP
   Updated stuff
   asdf
   ```

4. **Clear Communication**
   - Contributors understand what each commit does
   - Reviewers can navigate PRs easily
   - Users can track changes in releases

---

### 5. **Commitlint Configuration Deep Dive**

**Rule Format:**
```javascript
"rule-name": [level, applicable, value]
```

**Level:**
- `0` = disabled
- `1` = warning (shows message but allows commit)
- `2` = error (blocks commit)

**Applicable:**
- `"always"` = rule must be satisfied
- `"never"` = rule must NOT be satisfied

**Examples:**
```javascript
// Subject must NOT be empty (error if empty)
"subject-empty": [2, "never"]

// Subject must ALWAYS be lowercase (error if not)
"subject-case": [2, "always", "lower-case"]

// Header max 100 chars (error if longer)
"header-max-length": [2, "always", 100]
```

---

### 6. **Common Validation Errors**

| Error | Example | Fix |
|-------|---------|-----|
| `type-empty` | `add button` | `feat: add button` |
| `subject-empty` | `feat:` | `feat: add button` |
| `type-enum` | `added: button` | `feat: add button` |
| `subject-case` | `feat: Add Button` | `feat: add button` |
| `subject-full-stop` | `feat: add button.` | `feat: add button` |
| `header-max-length` | `feat: add really long description...` | Shorten to ≤100 chars |

---

### 7. **Bypassing Commitlint (Emergency Only)**

**To skip validation:**
```bash
$ git commit --no-verify -m "emergency fix"
```

**When to use:**
- 🚨 Critical production bug (needs immediate fix)
- 🔥 Hotfix that can't wait
- ⚠️ Commitlint has a bug

**⚠️ Use VERY sparingly** - your Git history will be inconsistent!

---

### 8. **Multi-line Commit Messages**

**For complex changes:**
```bash
$ git commit
# Opens editor for multi-line message
```

**Example:**
```
feat(button): add ripple animation

Implement Material Design 3 ripple effect for button component.

Features:
- State layers for hover, focus, press
- Configurable animation duration
- Respects prefers-reduced-motion

Breaking Changes:
- Button now requires React 18+ for transition support

Closes #42
Co-authored-by: Jane Doe <jane@example.com>
```

**Commitlint validates:**
- ✅ Header (first line): `feat(button): add ripple animation`
- ✅ Body (middle lines): Feature description
- ✅ Footer (last lines): `Closes #42`, `Co-authored-by`

---

### 9. **Commitlint vs CI/CD**

**Important distinction:**

**Commitlint (local):**
- ✅ Runs via Husky hook
- ✅ Immediate feedback (before commit)
- ✅ Can be bypassed with `--no-verify`

**CI/CD (remote):**
- ✅ Runs on GitHub Actions
- ✅ Validates after push
- ✅ **Cannot** be bypassed
- ✅ Blocks PR merge if invalid

**Best practice:** Run commitlint in BOTH places

---

### 10. **Commitlint for Open Source Management**

**Why this matters for open-source:**

1. **Easier PR Reviews**
   - Reviewers can quickly understand changes
   - Commit messages tell the story

2. **Automated Release Notes**
   ```markdown
   ## v1.2.0 (2025-01-15)
   
   ### Features
   - **button**: add ripple animation (#42)
   - **textfield**: add error state (#45)
   
   ### Bug Fixes
   - **checkbox**: resolve focus ring issue (#43)
   ```

3. **Better Contributor Experience**
   - Clear rules (not subjective)
   - Instant feedback (via hook)
   - Examples in docs

4. **Professional Image**
   - Clean Git history
   - Shows project is well-maintained
   - Attracts more contributors

---

## 🤔 Questions Answered

### Q1: What if I make a typo in my commit message?

**Answer**: You can amend the last commit:

```bash
$ git commit --amend
# Opens editor to edit message
```

**Note**: Only do this BEFORE pushing!

---

### Q2: Can I use uppercase in commit messages?

**Answer**: Not with our configuration:

```bash
❌ git commit -m "Feat: Add Button"
✖   type must be lowercase [type-case]

✅ git commit -m "feat: add button"
```

**Why lowercase?**
- Consistent with Conventional Commits spec
- Easier to parse programmatically
- Matches Git conventions

---

### Q3: Do I need a scope in every commit?

**Answer**: No, scope is optional:

```bash
✅ git commit -m "feat(button): add ripple"  (with scope)
✅ git commit -m "feat: add button component" (without scope)
```

**When to use scope:**
- Changes affect specific component → use scope
- Changes affect multiple areas → omit scope

---

### Q4: What about merge commits?

**Answer**: Merge commits are automatically allowed:

```bash
Merge pull request #42 from user/feature
```

Commitlint recognizes these and skips validation.

---

### Q5: Can I customize the commit types?

**Answer**: Yes! Edit `commitlint.config.js`:

```javascript
"type-enum": [
  2,
  "always",
  [
    "feat",
    "fix",
    "docs",
    "wip",    // ← Add custom type
    // ...
  ],
],
```

**Our types are standard** - avoid customizing unless necessary!

---

### Q6: What if a contributor doesn't have Git hooks set up?

**Answer**: Multiple layers of protection:

1. **Local hook** (Task 9.3) - Catches issues immediately
2. **CI/CD check** (future task) - Catches issues on push
3. **PR template** (future task) - Reminds contributors

**Even if local hook fails, CI/CD will catch it!**

---

### Q7: How do I write a breaking change commit?

**Answer**: Use `BREAKING CHANGE:` in footer:

```bash
$ git commit -m "feat(button): change API

BREAKING CHANGE: variant prop renamed to color"
```

Or use `!` shorthand:
```bash
$ git commit -m "feat(button)!: change API"
```

**This triggers a major version bump** (e.g., 1.2.0 → 2.0.0)

---

### Q8: Can I use emojis in commit messages?

**Answer**: Not recommended with commitlint:

```bash
❌ git commit -m "✨ feat: add button"
```

**Why?**
- Conventional Commits doesn't include emojis
- Breaks parsing for changelog generators
- Not standard in open-source

**Alternative**: Some projects use emojis AFTER type:
```bash
✅ git commit -m "feat: ✨ add magical button"
```

---

## ✅ Success Criteria

- [x] Commitlint packages installed (20.2.0)
- [x] `commitlint.config.js` created with conventional rules
- [x] `.husky/commit-msg` updated to run commitlint
- [x] `commitlint` script added to package.json
- [x] Tested with invalid message (rejected ✓)
- [x] Tested with valid message (accepted ✓)
- [x] Documentation created

---

## 🔄 Next Steps

### Task 9.5: lint-staged Configuration

Update `.husky/pre-commit` to run linters only on staged files:

```bash
# Before: slow (checks ALL files)
pnpm lint        # 30s
pnpm format      # 15s

# After: fast (checks ONLY staged files)
pnpm lint-staged # 0.5s
```

**This will make commits instant!** ⚡

---

## 🔗 Related Documentation

- **Conventional Commits**: https://www.conventionalcommits.org/
- **Commitlint**: https://commitlint.js.org/
- **@commitlint/config-conventional**: https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional

---

**Next Task**: [Task 9.5 - lint-staged Configuration →](./task-9.5-lint-staged-configuration.md)


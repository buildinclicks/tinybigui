# Task 9.3: Husky Setup

**Status**: ✅ Complete  
**Date**: 2025-12-31  
**Related**: Task 9.1 (ESLint), Task 9.2 (Prettier), Task 9.4 (Commitlint), Task 9.5 (lint-staged)

---

## 🎯 Goal

Set up **Husky** to automatically run Git hooks on every commit, ensuring code quality checks happen before changes are committed to the repository.

---

## 📋 What Was Done

### 1. Installed Husky

**Package**: `husky@^9.1.7` (latest stable)

```bash
pnpm add -D -w husky@^9.1.7
```

**Why this version?**
- ✅ Latest stable release
- ✅ Simplified API (no deprecated patterns)
- ✅ Automatic hook installation via `prepare` script
- ✅ Forward-compatible with v10

---

### 2. Initialized Husky

```bash
pnpm exec husky init
```

**What this did:**
- ✅ Created `.husky/` directory
- ✅ Created `.husky/_/` with hook templates
- ✅ Added `"prepare": "husky"` script to `package.json`
- ✅ Created default `pre-commit` hook

---

### 3. Created Pre-Commit Hook

**File**: `.husky/pre-commit`

```bash
# Run lint-staged (will be configured in Task 9.5)
# For now, this is a placeholder that will be updated
echo "🪝 Running pre-commit checks..."

# This will be replaced with: pnpm lint-staged
# Once we set up lint-staged in Task 9.5
```

**Purpose**: Run linters/formatters on staged files before commit

**Note**: Currently a placeholder - will be updated in Task 9.5 to run `lint-staged`

---

### 4. Created Commit-Msg Hook

**File**: `.husky/commit-msg`

```bash
# Validate commit message format (will be configured in Task 9.4)
# For now, this is a placeholder that will be updated
echo "📝 Validating commit message..."

# This will be replaced with: pnpm commitlint --edit $1
# Once we set up commitlint in Task 9.4
```

**Purpose**: Validate commit messages follow Conventional Commits format

**Note**: Currently a placeholder - will be updated in Task 9.4 to run `commitlint`

---

### 5. Updated Package.json

**Added to root `package.json`:**

```json
{
  "scripts": {
    "prepare": "husky"
  },
  "devDependencies": {
    "husky": "^9.1.7"
  }
}
```

**The `prepare` script:**
- ✅ Runs automatically after `pnpm install`
- ✅ Installs Git hooks for all contributors
- ✅ Ensures hooks are always up-to-date

---

## 🧪 Verification

### Test 1: Hooks Are Installed

```bash
$ ls -la .husky/
pre-commit  commit-msg  _/
```

✅ Both hooks created

---

### Test 2: Pre-Commit Hook Runs

```bash
$ git commit -m "test"
🪝 Running pre-commit checks...
📝 Validating commit message...
[dev 858957e] test
```

✅ Both hooks execute on commit

---

### Test 3: No Deprecation Warnings

```bash
$ git commit -m "test"
🪝 Running pre-commit checks...
📝 Validating commit message...
```

✅ No warnings (using Husky 9.x format)

---

## 📁 Files Created/Modified

### Created
- `.husky/pre-commit` - Pre-commit hook (placeholder)
- `.husky/commit-msg` - Commit message hook (placeholder)
- `.husky/_/` - Husky internal files (auto-generated)

### Modified
- `package.json` - Added `husky` dependency and `prepare` script
- `pnpm-lock.yaml` - Updated with Husky dependency

---

## 🎓 Key Learnings

### 1. **Husky 9.x Simplified Format**

**Old format (deprecated):**
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "Running checks..."
```

**New format (Husky 9+):**
```bash
echo "Running checks..."
```

**Why?**
- ⚡ Simpler and faster
- 🔮 Forward-compatible with v10
- ✅ No deprecation warnings

---

### 2. **Automatic Hook Installation**

The `"prepare": "husky"` script ensures:
1. When anyone runs `pnpm install`
2. Husky automatically installs Git hooks
3. All contributors get the same checks
4. No manual setup required

**Example workflow:**
```bash
$ git clone <repo>
$ pnpm install       # ← Husky hooks installed automatically
$ git commit         # ← Hooks run automatically
```

---

### 3. **Placeholder Strategy**

We created **placeholder hooks** because:
- ✅ Husky needs to be set up first (Task 9.3)
- ✅ `commitlint` will be added next (Task 9.4)
- ✅ `lint-staged` will be added after (Task 9.5)
- ✅ Keeps tasks small and reviewable

**This approach:**
- Allows testing hooks immediately
- Makes dependencies clear
- Enables step-by-step verification

---

### 4. **Git Hooks Overview**

**Pre-commit hook:**
- ⏰ Runs before commit is created
- 🎯 Used for: linting, formatting, type checking
- ❌ If fails → commit aborted

**Commit-msg hook:**
- ⏰ Runs after commit message entered
- 🎯 Used for: validating message format
- ❌ If fails → commit aborted

---

### 5. **Why Husky Over Alternatives?**

**Other options:**
- `pre-commit` (Python-based)
- `lefthook` (Go-based)
- Manual `.git/hooks/` scripts

**Why Husky?**
- ✅ Most popular in JS ecosystem (15M+ downloads/week)
- ✅ Works seamlessly with pnpm/npm/yarn
- ✅ Simple JSON-based configuration
- ✅ Widely documented
- ✅ Great TypeScript support

---

### 6. **Hook Execution Order**

When you run `git commit -m "message"`:

```
1. pre-commit hook runs
   ↓
2. commit-msg hook runs
   ↓
3. commit is created
   ↓
4. post-commit hook runs (if exists)
```

**If any hook fails:**
- ❌ Commit is aborted
- 💡 Dev can fix issues and try again
- ✅ Bad code never enters history

---

### 7. **Bypassing Hooks (Emergency)**

**To skip hooks temporarily:**
```bash
$ git commit --no-verify -m "emergency fix"
```

**When to use:**
- 🚨 Critical production bug
- 🔥 CI/CD is broken
- ⚠️ Hooks have a bug

**⚠️ Use sparingly** - hooks exist for a reason!

---

### 8. **Husky in CI/CD**

**Important**: Git hooks DON'T run in CI/CD!

**Why?**
- CI environments clone repos fresh
- `.git/hooks/` aren't committed to Git
- CI has its own check mechanisms

**Solution:**
- ✅ Hooks = developer safety net
- ✅ CI/CD = independent verification
- ✅ Both should run the same checks

---

## 🔄 Next Steps

### Task 9.4: Commitlint Configuration
Update `.husky/commit-msg` to:
```bash
pnpm commitlint --edit $1
```

### Task 9.5: lint-staged Configuration  
Update `.husky/pre-commit` to:
```bash
pnpm lint-staged
```

---

## 🤔 Questions Answered

### Q1: Why split Husky, commitlint, and lint-staged into separate tasks?

**Answer**: Each has a specific purpose:
- **Husky** (9.3): Git hook infrastructure
- **Commitlint** (9.4): Commit message validation
- **lint-staged** (9.5): Run linters on staged files

Splitting allows:
- ✅ Testing each piece independently
- ✅ Clear dependencies (9.4 and 9.5 need 9.3)
- ✅ Smaller, reviewable changes

---

### Q2: What if hooks slow down commits?

**Answer**: That's what lint-staged solves!

**Without lint-staged:**
```bash
# Runs on ALL files (slow!)
pnpm lint        # 30s
pnpm format      # 15s
pnpm typecheck   # 20s
Total: 65s per commit 😱
```

**With lint-staged (Task 9.5):**
```bash
# Runs ONLY on staged files (fast!)
eslint src/Button.tsx     # 0.5s
prettier src/Button.tsx   # 0.1s
Total: 0.6s per commit 🚀
```

---

### Q3: Can contributors disable hooks?

**Answer**: Technically yes, but shouldn't:

**To disable:**
```bash
$ rm -rf .husky/
```

**But:**
- ❌ They'll have a bad experience in code review
- ❌ CI/CD will catch issues anyway (slower feedback)
- ❌ Their PRs will be rejected

**Better approach:**
- ✅ Keep hooks fast (< 2s)
- ✅ Only check staged files (lint-staged)
- ✅ Run expensive checks in CI only

---

### Q4: What happens if someone doesn't have Git installed?

**Answer**: Husky gracefully handles this:

```bash
$ pnpm install
husky - Git not found, skipping installation
```

No errors, just a warning. Useful for:
- 🐳 Docker builds (no Git needed)
- 📦 CI/CD (hooks won't run anyway)
- 🔧 Non-Git workflows

---

## ✅ Success Criteria

- [x] Husky 9.1.7 installed
- [x] `.husky/` directory created
- [x] `prepare` script added to package.json
- [x] `pre-commit` hook created (placeholder)
- [x] `commit-msg` hook created (placeholder)
- [x] Hooks run on every commit
- [x] No deprecation warnings
- [x] Documentation created

---

## 🔗 Related Documentation

- **Husky Official Docs**: https://typicode.github.io/husky/
- **Git Hooks Documentation**: https://git-scm.com/docs/githooks
- **Husky Migration Guide (v8 → v9)**: https://typicode.github.io/husky/migrate-from-v8.html

---

**Next Task**: [Task 9.4 - Commitlint Configuration →](./task-9.4-commitlint-configuration.md)


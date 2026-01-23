# Create Pull Request

Prepare and create a pull request for the current feature branch.

## Instructions

### Step 1: Verify Current State

Run these checks:

```bash
git status
git log --oneline dev..HEAD
pnpm test
pnpm lint
pnpm typecheck
```

### Step 2: Ensure Branch is Pushed

```bash
git push origin HEAD
```

### Step 3: Generate PR Template

Create PR using this template:

```markdown
## 🎯 What does this PR do?

[Brief description based on commits]

## 📋 Changes

- [ ] List files created/modified

## 🧪 Testing

- [ ] All existing tests pass
- [ ] [X] new tests added
- [ ] Test coverage maintained at 85%+
- [ ] Manual testing in Storybook completed

## 📸 Screenshots / Demo

[Remind user to add Storybook screenshots]

## ✅ Checklist

- [ ] Tests written first (TDD)
- [ ] All tests passing
- [ ] Linter passes
- [ ] TypeScript strict mode passes
- [ ] Storybook stories added
- [ ] Three-layer architecture followed
- [ ] React Aria used for accessibility
- [ ] MD3 specification compliant
- [ ] Conventional commits used

## 🔗 Related

Part of Phase [X] - v[X.X.X] milestone
```

### Step 4: Create PR via GitHub CLI

```bash
gh pr create --base dev --title "[type](scope): description" --body "..."
```

Or provide the template for user to create manually on GitHub.

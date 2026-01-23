# Quality Check

Run all quality checks before committing or pushing code.

## Instructions

Run the following checks in sequence and report results:

### 1. TypeScript Check

```bash
pnpm typecheck
```

Report any TypeScript errors.

### 2. Linting

```bash
pnpm lint
```

Report any linting errors.

### 3. Tests

```bash
pnpm test
```

Report:

- Total tests
- Passing tests
- Failing tests
- Test coverage percentage

### 4. Build Check (Optional)

```bash
pnpm build
```

Verify build succeeds.

## Summary Format

```
## Quality Check Results

✅ TypeScript: No errors
✅ Linting: No errors
✅ Tests: 153/153 passing (91.2% coverage)
✅ Build: Success

Ready to commit/push!
```

Or if issues found:

```
## Quality Check Results

✅ TypeScript: No errors
❌ Linting: 3 errors in Button.tsx
✅ Tests: 150/153 passing (2 failures)
⚠️ Coverage: 84.5% (below 85% threshold)

Issues to fix before committing:
1. [List specific issues]
```

# Release Workflow

Execute the release process for a new version.

## Instructions

### Pre-Release Checklist

1. Verify all features for this milestone are complete
2. Run full quality checks (`/quality-check`)
3. Review CHANGELOG.md

### Step 1: Create Release Branch

```bash
git checkout dev
git pull origin dev
git checkout -b release/vX.X.X
```

### Step 2: Version Bump

Update version in:

- `packages/react/package.json`
- `packages/tokens/package.json`
- Root `package.json` (if applicable)

### Step 3: Update CHANGELOG

Add release notes to CHANGELOG.md:

```markdown
## [X.X.X] - YYYY-MM-DD

### Added

- New features...

### Changed

- Changes...

### Fixed

- Bug fixes...
```

### Step 4: Final Quality Checks

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
```

### Step 5: Commit and Tag

```bash
git add .
git commit -m "chore(release): prepare vX.X.X"
git tag -a vX.X.X -m "Release vX.X.X"
```

### Step 6: Merge to Main

```bash
git checkout main
git merge release/vX.X.X --no-ff
git push origin main --tags
```

### Step 7: Create GitHub Release

```bash
gh release create vX.X.X --title "vX.X.X" --notes "Release notes..."
```

### Step 8: Publish to NPM (if ready)

```bash
cd packages/react && pnpm publish
cd packages/tokens && pnpm publish
```

### Step 9: Sync Dev Branch

```bash
git checkout dev
git merge main
git push origin dev
```

### Step 10: Cleanup

```bash
git branch -d release/vX.X.X
```

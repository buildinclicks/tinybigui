# Show Progress

Display current project progress and milestone status.

## Instructions

When invoked, analyze the codebase and display:

### 1. Phase Progress

Check which components exist in `packages/react/src/components/`:

```
📍 Current Progress:

Phase 1a (Core Buttons):
  ✅ Button - [X] tests
  ✅ IconButton - [X] tests
  ✅ FAB - [X] tests

Phase 1b (Form Components):
  🔄 TextField - In Progress
  ⬜ Checkbox - Pending
  ⬜ Switch - Pending

Phase 2 (Navigation):
  ⬜ AppBar
  ⬜ Tabs
  ⬜ Drawer

Phase 3 (Feedback):
  ⬜ Dialog
  ⬜ Snackbar
  ⬜ Menu
```

### 2. Current Branch

```bash
git branch --show-current
```

### 3. Milestone Status

```
🎯 Next Milestone: v0.1.0
   Required: Phase 1a ✅ + Phase 1b 🔄
   Progress: 3/6 components complete
```

### 4. Test Coverage

```bash
pnpm test --coverage
```

### 5. Recent Activity

```bash
git log --oneline -5
```

## Output Format

Provide a clear, emoji-decorated summary that helps the user understand:

- What's done
- What's in progress
- What's next
- How close to next milestone

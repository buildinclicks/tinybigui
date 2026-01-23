# New Component Workflow

Create a new TinyBigUI component following the three-layer architecture and TDD approach.

## Instructions

When the user invokes this command, follow these steps:

### Step 1: Create Feature Branch

```bash
git checkout dev
git checkout -b feat/[phase]-[component-name]-component
git push -u origin feat/[phase]-[component-name]-component
```

### Step 2: Write Tests First (TDD)

Create `ComponentName.test.tsx` with comprehensive tests:

- Rendering tests (default props, all variants)
- Interaction tests (click, keyboard)
- Accessibility tests (axe violations)
- Customization tests (className merging)

Run tests → All should FAIL (component doesn't exist yet)

### Step 3: Create Component Files

Create these files in order:

1. `ComponentName.types.ts` - TypeScript interfaces
2. `ComponentName.variants.ts` - CVA variants
3. `ComponentNameHeadless.tsx` - React Aria integration
4. `ComponentName.tsx` - Styled component
5. `index.ts` - Exports

Commit after each file with conventional commits.

### Step 4: Verify Tests Pass

Run `pnpm test` → All tests should now PASS

### Step 5: Add Storybook Stories

Create `ComponentName.stories.tsx` with:

- Default story
- Variants story
- States story
- Interactive story with play function

### Step 6: Quality Checks

Run and verify:

- `pnpm test` - All tests passing
- `pnpm lint` - No errors
- `pnpm typecheck` - No TypeScript errors

### Step 7: Prepare for PR

```bash
git push origin feat/[phase]-[component-name]-component
```

Provide PR template for user to create pull request.

## Required Context

- Ask which component to create
- Ask which phase it belongs to (1a, 1b, 2, 3)
- Reference MD3 specifications for the component

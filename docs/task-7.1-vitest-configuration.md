# Task 7.1: Vitest Configuration

**Task ID:** 7.1  
**Category:** Phase 0 - Part H (Testing Setup)  
**Status:** ✅ Complete  
**Date:** 2025-12-30

---

## 📋 Task Overview

**Objective:** Set up Vitest as our testing framework with proper configuration for testing React components and utilities.

**Why This Task Matters:**
- Enables automated testing of components and utilities
- Catches bugs before they reach users
- Provides confidence when making changes
- Documents how components should be used
- Essential for a production-ready library

---

## 🤔 What is Testing? (Beginner Explanation)

### The Basics

**Testing** is like having a robot assistant that automatically checks if your code works correctly.

**Real-World Analogy:**
- 🚗 When Toyota builds a car, they test the brakes 1000 times to make sure they work
- 🎨 When we build UI components, we test them to make sure they display correctly and respond to clicks

### Why Test?

1. **Catch Bugs Early** ⚡
   - Find problems before users do
   - Save time fixing issues later

2. **Confidence** 💪
   - Know your code works when you make changes
   - Refactor without fear

3. **Documentation** 📚
   - Tests show how components should be used
   - Better than written docs (they can't get outdated!)

4. **Save Time** ⏰
   - Automated tests run in seconds
   - Manual testing takes minutes/hours

---

## 🧪 What is Vitest?

**Vitest** is our testing tool - it runs tests and tells us if they pass or fail.

**Why Vitest?**
- ✅ **Super Fast** - Uses Vite (lightning-fast build tool)
- ✅ **TypeScript Support** - Works perfectly with our TypeScript code
- ✅ **React Testing** - Built-in support for React components
- ✅ **Modern** - Supports all latest JavaScript features
- ✅ **Great DX** - Nice error messages and watch mode

**Alternatives (why we chose Vitest):**
- **Jest** - Older, slower, more configuration needed
- **Mocha** - Requires more setup, less features
- **Vitest** - Modern, fast, easy setup ✨

---

## 📝 What Will We Test?

### 1. Utility Functions

**Example: Testing color utility**
```typescript
// This is a test for withOpacity() function
test('withOpacity adds opacity to color', () => {
  // Run the function
  const result = withOpacity('#6750a4', 0.5);
  
  // Check if result is correct
  expect(result).toBe('#6750a480');
  // If this passes: ✅ Function works!
  // If this fails: ❌ Something is broken!
});
```

**What we check:**
- Does the function return the correct value?
- Does it handle edge cases (empty input, invalid input)?
- Does it work with different types of input?

### 2. React Components

**Example: Testing Button component**
```typescript
test('Button displays the text we give it', () => {
  // Render the Button component
  render(<Button>Click Me</Button>);
  
  // Check if the text appears on screen
  expect(screen.getByText('Click Me')).toBeInTheDocument();
  // ✅ Button shows the text!
});

test('Button calls onClick when clicked', () => {
  // Create a fake function to track clicks
  const handleClick = vi.fn();
  
  // Render Button with our fake function
  render(<Button onClick={handleClick}>Click Me</Button>);
  
  // Simulate a user clicking the button
  fireEvent.click(screen.getByText('Click Me'));
  
  // Check if our fake function was called
  expect(handleClick).toHaveBeenCalled();
  // ✅ Button responds to clicks!
});
```

**What we check:**
- Does the component render correctly?
- Does it display the right text/content?
- Does it respond to user interactions (clicks, typing)?
- Does it handle different props correctly?

---

## 🎯 What Was Done

### 1. Created Vitest Configuration ✅

**File:** `vitest.config.ts` (root level)

This file tells Vitest how to run our tests.

**Key Configuration Explained:**

#### Environment: 'jsdom'
```typescript
environment: 'jsdom'
```

**What it does:** Simulates a browser environment

**Why we need it:** React components need browser APIs like:
- `document` (to create elements)
- `window` (browser window object)
- DOM methods (querySelector, etc.)

**Without jsdom:** Tests would fail because Node.js doesn't have these browser APIs

#### Globals: true
```typescript
globals: true
```

**What it does:** Makes test functions available everywhere

**With globals: true:**
```typescript
test('my test', () => { ... }) // Just write test()
expect(value).toBe(10)          // Just write expect()
```

**Without globals:**
```typescript
import { test, expect } from 'vitest' // Need to import in every file
test('my test', () => { ... })
expect(value).toBe(10)
```

#### Setup Files
```typescript
setupFiles: ['./packages/react/test/setup.ts']
```

**What it does:** Runs setup code before any tests

**Why we need it:** 
- Add helpful test utilities (like `toBeInTheDocument()`)
- Mock browser APIs that don't exist in tests
- Set up global test configuration

#### CSS: false
```typescript
css: false
```

**What it does:** Don't process CSS in tests

**Why:** Tests don't need actual styles - they test logic and behavior, not appearance. Processing CSS would slow down tests.

#### Coverage
```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html']
}
```

**What it does:** Creates reports showing which code is tested

**Example coverage report:**
```
File          | % Lines | % Branches | % Functions
--------------|---------|------------|------------
cn.ts         |  100%   |   100%     |   100%      ✅
colors.ts     |   85%   |    70%     |    90%      ⚠️
typography.ts |   60%   |    50%     |    75%      ❌
```

- 100% = All code is tested ✅
- 85% = Most code is tested ⚠️
- 60% = Needs more tests ❌

---

### 2. Created Test Setup File ✅

**File:** `packages/react/test/setup.ts`

This file prepares the testing environment before tests run.

**What it does:**

#### 1. Imports Testing Library Utilities
```typescript
import '@testing-library/jest-dom';
```

**What this adds:** Helpful matchers for testing DOM elements

**Examples:**
```typescript
// Without jest-dom (hard to read)
expect(element.textContent).toBe('Hello')
expect(element.style.display).not.toBe('none')

// With jest-dom (easy to read)
expect(element).toHaveTextContent('Hello')
expect(element).toBeVisible()
```

**All available matchers:**
- `toBeInTheDocument()` - Element exists in DOM
- `toHaveTextContent(text)` - Element contains text
- `toBeVisible()` - Element is visible
- `toBeDisabled()` - Element is disabled
- `toHaveClass(className)` - Element has CSS class
- `toHaveStyle(styles)` - Element has inline styles
- And many more!

#### 2. Mocks window.matchMedia
```typescript
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({ ... }))
});
```

**What it does:** Provides a fake version of `matchMedia`

**Why we need it:** 
- Many components use `matchMedia` to detect screen size
- It doesn't exist in the test environment
- Without this, tests would crash

**Example usage in components:**
```typescript
// Component checks screen size
if (window.matchMedia('(max-width: 768px)').matches) {
  // Show mobile version
}
```

#### 3. Mocks IntersectionObserver
```typescript
global.IntersectionObserver = class IntersectionObserver { ... }
```

**What it does:** Provides a fake `IntersectionObserver`

**Why we need it:**
- IntersectionObserver detects when elements scroll into view
- Useful for lazy loading, infinite scroll, etc.
- Not available in tests

#### 4. Mocks ResizeObserver
```typescript
global.ResizeObserver = class ResizeObserver { ... }
```

**What it does:** Provides a fake `ResizeObserver`

**Why we need it:**
- ResizeObserver detects when elements change size
- Useful for responsive components
- Not available in tests

---

### 3. Added Testing Dependencies ✅

**Root package.json:** Added testing tools (Latest versions as of Dec 30, 2025)

```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.9.1",       // DOM matchers (updated from 6.6.3)
    "@testing-library/react": "^16.3.0",         // React testing utilities (updated from 16.1.0)
    "@testing-library/user-event": "^14.6.1",    // Simulate user interactions (updated from 14.5.2)
    "@vitejs/plugin-react": "^4.3.4",            // React support for Vitest
    "@vitest/coverage-v8": "^4.0.16",            // Code coverage reports (updated from 2.1.8)
    "jsdom": "^26.1.0",                          // Browser environment simulation (updated from 25.0.1)
    "vitest": "^4.0.16"                          // Testing framework (updated from 2.1.8)
  }
}
```

**⚠️ Version Update Note:**
- Initially used older versions from training data (April 2024)
- Updated to latest stable versions (Dec 2025) for:
  - **Vitest 4.0.16**: New features - browser mode, visual regression, Playwright traces
  - **jsdom 26.1.0**: Improved DOM simulation
  - **Testing Library packages**: Latest bug fixes and features
- **Always check for latest versions** when adding dependencies to new projects!

**What each dependency does:**

| Package | Purpose | Example |
|---------|---------|---------|
| `vitest` | Test runner | Runs your tests |
| `jsdom` | Browser simulation | Provides `document`, `window` |
| `@testing-library/react` | React testing | `render()`, `screen.getByText()` |
| `@testing-library/jest-dom` | DOM matchers | `toBeInTheDocument()` |
| `@testing-library/user-event` | User simulation | `userEvent.click()`, `userEvent.type()` |
| `@vitejs/plugin-react` | React support | Compiles JSX in tests |
| `@vitest/coverage-v8` | Coverage reports | Shows untested code |

**React package:** Added Material Color Utilities
```json
{
  "dependencies": {
    "@material/material-color-utilities": "^0.3.0"
  }
}
```

---

### 4. Created Example Test ✅

**File:** `packages/react/src/utils/__tests__/cn.test.ts`

This shows how to write tests using a simple example.

**Test Structure (The 3 A's):**

```typescript
test('description of what we are testing', () => {
  // 1. ARRANGE - Set up test data
  const input = 'button primary';
  
  // 2. ACT - Run the function
  const result = cn(input);
  
  // 3. ASSERT - Check the result
  expect(result).toBe('button primary');
});
```

**What each part does:**

1. **ARRANGE (Setup)**
   - Prepare your test data
   - Create variables, mock functions, etc.
   - Think: "What do I need to run this test?"

2. **ACT (Execute)**
   - Run the function or action you're testing
   - Usually just one line
   - Think: "What am I actually testing?"

3. **ASSERT (Verify)**
   - Check if the result is correct
   - Use `expect()` with matchers
   - Think: "What should the result be?"

**Example tests in our file:**

```typescript
// Test 1: Basic functionality
test('combines multiple class names', () => {
  const result = cn('button', 'primary', 'rounded');
  expect(result).toBe('button primary rounded');
});

// Test 2: Conditional classes
test('handles conditional classes', () => {
  const result = cn('button', false && 'hidden', 'active');
  expect(result).toBe('button active'); // 'hidden' filtered out
});

// Test 3: Tailwind merge
test('merges conflicting Tailwind classes', () => {
  const result = cn('p-4 p-2'); // Conflicting padding
  expect(result).toBe('p-2');    // Keeps last one
});

// Test 4: Edge case
test('handles empty input', () => {
  const result = cn();
  expect(result).toBe('');
});
```

---

## 🎓 Testing Concepts Explained (Beginner-Friendly)

### What is a Test?

A test is a piece of code that checks if another piece of code works correctly.

**Example in plain English:**
```
Test: "Check if calculator adds 2 + 2 correctly"
1. Run: calculator.add(2, 2)
2. Expect: 4
3. Result: ✅ Pass (got 4)
```

**Same test in code:**
```typescript
test('calculator adds 2 + 2 correctly', () => {
  const result = calculator.add(2, 2);
  expect(result).toBe(4);
});
```

### Common Matchers (expect functions)

**Matchers** are the functions you use with `expect()` to check values.

```typescript
// Exact equality (use for primitives: numbers, strings, booleans)
expect(5).toBe(5)
expect('hello').toBe('hello')
expect(true).toBe(true)

// Deep equality (use for objects and arrays)
expect({ name: 'John' }).toEqual({ name: 'John' })
expect([1, 2, 3]).toEqual([1, 2, 3])

// Truthiness
expect(true).toBeTruthy()
expect(false).toBeFalsy()
expect(null).toBeFalsy()
expect(undefined).toBeFalsy()

// Contains
expect('hello world').toContain('world')
expect([1, 2, 3]).toContain(2)

// Length
expect('hello').toHaveLength(5)
expect([1, 2, 3]).toHaveLength(3)

// Greater/Less than
expect(10).toBeGreaterThan(5)
expect(3).toBeLessThan(5)

// Throws error
expect(() => { throw new Error('oops') }).toThrow()

// DOM-specific (from @testing-library/jest-dom)
expect(element).toBeInTheDocument()
expect(element).toHaveTextContent('Hello')
expect(button).toBeDisabled()
```

### Grouping Tests with describe()

**`describe()`** groups related tests together.

```typescript
describe('Calculator', () => {
  test('adds numbers', () => { ... })
  test('subtracts numbers', () => { ... })
  test('multiplies numbers', () => { ... })
});

describe('Button component', () => {
  test('renders text', () => { ... })
  test('handles clicks', () => { ... })
  test('can be disabled', () => { ... })
});
```

**Why group tests?**
- ✅ Better organization
- ✅ Easier to find related tests
- ✅ Better test output readability

### Mock Functions (vi.fn())

A **mock function** is a fake function that tracks how it's used.

**Why use mocks?**
- Track if a function was called
- Track what arguments it received
- Track how many times it was called

**Example:**
```typescript
test('Button calls onClick when clicked', () => {
  // Create a mock function
  const mockClick = vi.fn();
  
  // Use it in a component
  render(<Button onClick={mockClick}>Click Me</Button>);
  
  // Click the button
  fireEvent.click(screen.getByText('Click Me'));
  
  // Check if our mock was called
  expect(mockClick).toHaveBeenCalled();
  expect(mockClick).toHaveBeenCalledTimes(1);
});
```

---

## 🚀 Running Tests

### Command Line

```bash
# Run all tests once
pnpm test

# Run tests in watch mode (re-run on file changes)
pnpm test:watch

# Run tests with coverage report
pnpm test -- --coverage

# Run only tests matching a pattern
pnpm test cn.test

# Run tests in a specific package
pnpm --filter @tinybigui/react test
```

### What to Expect

**Successful test output:**
```
✓ cn utility (5)
  ✓ combines multiple class names
  ✓ handles conditional classes
  ✓ merges conflicting Tailwind classes
  ✓ handles empty input
  ✓ handles arrays and objects

Test Files  1 passed (1)
     Tests  5 passed (5)
  Start at  10:30:00
  Duration  245ms
```

**Failed test output:**
```
✗ cn utility > combines multiple class names
  Expected: "button primary rounded"
  Received: "button primary"
  
  15|   test('combines multiple class names', () => {
  16|     const result = cn('button', 'primary', 'rounded');
  17|     expect(result).toBe('button primary rounded');
       ^
```

---

## 📂 Files Created/Modified

### Created Files

1. **`vitest.config.ts`** (root level, 68 lines)
   - Vitest configuration
   - React plugin setup
   - Environment configuration (jsdom)
   - Test file patterns
   - Coverage settings

2. **`packages/react/test/setup.ts`** (58 lines)
   - Test environment setup
   - Testing Library matchers
   - Browser API mocks (matchMedia, IntersectionObserver, ResizeObserver)
   - Global test utilities

3. **`packages/react/src/utils/__tests__/cn.test.ts`** (102 lines)
   - Example test file
   - 5 test cases for `cn` utility
   - Heavily commented for learning
   - Shows test structure and patterns

### Modified Files

1. **`package.json`** (root)
   - Added 7 testing dependencies
   - Testing tools and utilities

2. **`packages/react/package.json`**
   - Added `@material/material-color-utilities`
   - Test scripts already present

---

## ✅ Success Criteria

- [x] Vitest configured and working
- [x] Test environment set up (jsdom)
- [x] Testing Library integrated
- [x] Browser APIs mocked
- [x] Example test created
- [x] Dependencies installed
- [x] Test scripts configured
- [x] Comprehensive beginner-friendly documentation

---

## 🎓 Key Learnings for Beginners

### 1. Why Automated Testing?

**Manual Testing (the old way):**
- Open browser → Click around → Check if it works → Repeat for every change
- Slow, boring, error-prone
- 😫 Takes 10 minutes per change

**Automated Testing (the modern way):**
- Write test once → Run instantly → Checks everything automatically
- Fast, reliable, catches regressions
- ⚡ Takes 5 seconds per change

### 2. Testing Philosophy

**What to test:**
- ✅ **Happy path** - Normal usage, expected inputs
- ✅ **Edge cases** - Empty inputs, null, undefined
- ✅ **Error cases** - Invalid inputs, error conditions
- ✅ **User interactions** - Clicks, typing, form submission

**What NOT to test:**
- ❌ **Implementation details** - Internal state, private methods
- ❌ **Third-party libraries** - They have their own tests
- ❌ **Visual appearance** - Use visual regression tests for this

### 3. Test Naming

**Good test names** describe what is being tested:
```typescript
✅ test('adds two numbers correctly')
✅ test('shows error message when input is invalid')
✅ test('calls onSubmit when form is submitted')
```

**Bad test names** are vague or unclear:
```typescript
❌ test('it works')
❌ test('test 1')
❌ test('asdf')
```

### 4. One Test, One Thing

Each test should check **one specific thing**.

```typescript
// ✅ GOOD - Each test checks one thing
test('adds numbers', () => {
  expect(add(2, 2)).toBe(4);
});

test('subtracts numbers', () => {
  expect(subtract(5, 3)).toBe(2);
});

// ❌ BAD - One test checks multiple things
test('calculator works', () => {
  expect(add(2, 2)).toBe(4);
  expect(subtract(5, 3)).toBe(2);
  expect(multiply(3, 3)).toBe(9);
  // If this fails, which operation broke?
});
```

### 5. Test-Driven Development (TDD)

**Optional but powerful approach:**

1. ✍️ **Write test first** (it will fail - no code yet!)
2. 💻 **Write minimal code** to make test pass
3. 🧹 **Refactor** - Clean up the code
4. 🔁 **Repeat**

**Benefits:**
- Forces you to think about requirements first
- Ensures every feature has tests
- Leads to better code design

### 6. Coverage is Not Everything

**Code coverage** = percentage of code that is tested

```
100% coverage ≠ Perfect tests
```

**Why?**
- You can have 100% coverage with bad tests
- Tests need to check **meaningful things**, not just execute code

**Good enough:**
- 80-90% coverage for business logic
- 60-70% coverage for UI components
- Focus on critical paths first

### 7. Always Check for Latest Package Versions ⭐

**Critical Learning: Don't trust training data for package versions!**

This task originally used older versions (April 2024 training data):
- ❌ Vitest 2.1.8 (outdated)
- ❌ jsdom 25.0.1 (outdated)  
- ❌ @testing-library/* packages (outdated)

**Updated to latest stable (Dec 2025):**
- ✅ Vitest 4.0.16 (browser mode, visual regression!)
- ✅ jsdom 26.1.0 (better DOM simulation)
- ✅ Latest Testing Library packages

**Why this matters:**
- **New projects should use latest stable** versions
- Latest versions have bug fixes, security patches, new features
- No legacy code to worry about breaking
- Better TypeScript support
- More active community support

**How to check versions:**
1. **Web search:** "[package] latest stable version 2025"
2. **Run:** `pnpm outdated` after installing
3. **Check:** Official docs, npm registry, GitHub releases
4. **Update:** package.json before first install

**Example search:**
```
"vitest latest stable version December 2025"
```

**Red flags (don't just use training data):**
- Training data can be 6-12+ months old
- Major versions may have been released
- Security vulnerabilities may be fixed
- Breaking changes may be documented

**Best practice:**
- Always verify latest versions for new projects
- Use caret (^) for flexibility: `"vitest": "^4.0.16"`
- Document why you chose specific versions
- Check changelogs for breaking changes

---

## 🔗 Related Tasks

**This Task (7.1):**
- ✅ Vitest configuration
- ✅ Test environment setup
- ✅ Example test

**Next Tasks:**
- ⏳ Task 7.2 - Test Setup File (additional utilities)
- ⏳ Task 7.3 - Test Utilities (helper functions for tests)

---

## 📝 Notes for Next Steps

### Running Your First Test

After committing these changes, you can run your first test:

```bash
# Install dependencies
pnpm install

# Run the example test
pnpm test

# You should see:
# ✓ cn utility (5 tests)
# All tests passed! 🎉
```

### Writing Your Next Test

When you create a new utility function, write tests for it:

```typescript
// 1. Create utility
// packages/react/src/utils/colors.ts
export function hexToRgb(hex: string) { ... }

// 2. Create test file
// packages/react/src/utils/__tests__/colors.test.ts
import { hexToRgb } from '../colors';

describe('hexToRgb', () => {
  test('converts hex to RGB', () => {
    const result = hexToRgb('#6750a4');
    expect(result).toEqual({ r: 103, g: 80, b: 164 });
  });
  
  test('handles hex without #', () => {
    const result = hexToRgb('6750a4');
    expect(result).toEqual({ r: 103, g: 80, b: 164 });
  });
});

// 3. Run tests
// pnpm test colors
```

### Testing Components

When testing React components:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  test('renders with text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });
  
  test('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Test Coverage

To see which code is tested:

```bash
pnpm test -- --coverage

# Opens HTML report in browser
# Shows red (untested), yellow (partially tested), green (fully tested)
```

---

## ✅ Task Completion

**Status:** Complete ✅  
**Result:** Vitest testing framework configured and ready, with comprehensive beginner-friendly documentation and example tests.

**What You Can Do Now:**
- Run tests with `pnpm test`
- Write tests for utilities
- Learn testing patterns from example
- Build confidence with automated testing

**Next Task:** Task 7.2 - Test Setup File (Additional Utilities)

---

*Task completed on 2025-12-30 as part of Phase 0 - Part H (Testing Setup)*


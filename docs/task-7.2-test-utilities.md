# Task 7.2: Test Utilities

**Task ID:** 7.2  
**Category:** Phase 0 - Part H (Testing Setup)  
**Status:** ✅ Complete  
**Date:** 2025-12-30

---

## 📋 Task Overview

**Objective:** Create reusable test utilities that make testing components easier, cleaner, and more consistent.

**Why This Task Matters:**

- Reduces repetitive test setup code
- Provides common testing patterns
- Makes tests more readable and maintainable
- Establishes testing best practices early

---

## 🎯 What Was Done

### 1. Created Test Utilities File ✅

**File:** `packages/react/test/utils.tsx` (228 lines)

This file contains reusable testing helpers that we'll use across all component tests.

**What it includes:**

- Custom render functions
- Common test helpers
- Mock function utilities
- Re-exported Testing Library utilities

---

## 🔧 Utilities Created

### **1. `renderWithProviders()`** - Custom Render Function

**Purpose:** Wrap components with common providers (theme, etc.)

```typescript
export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">);
```

**Why we need it:**

- In the future, we'll have ThemeProvider, etc.
- Every test would need to wrap components the same way
- This function does it once, consistently

**Example:**

```typescript
test('Button renders', () => {
  const { getByText } = renderWithProviders(<Button>Click Me</Button>);
  expect(getByText('Click Me')).toBeInTheDocument();
});
```

**Current implementation:**

- Right now, it just calls the standard `render()` function
- We'll add providers as we build them (ThemeProvider, etc.)

**Future with providers:**

```typescript
// This is what it will look like later:
export function renderWithProviders(ui: ReactElement) {
  return render(
    <ThemeProvider>
      <AnimationProvider>
        {ui}
      </AnimationProvider>
    </ThemeProvider>
  );
}
```

---

### **2. `createMockFn()`** - Mock Function Helper

**Purpose:** Create functions that track how they're called

```typescript
export const createMockFn = vi.fn;
```

**Example:**

```typescript
test('button calls onClick when clicked', () => {
  const handleClick = createMockFn();
  renderWithProviders(<Button onClick={handleClick}>Click</Button>);

  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

---

### **3. `createMockFnWithReturn()`** - Mock with Return Value

**Purpose:** Create a mock function that returns a specific value

```typescript
export function createMockFnWithReturn<T>(returnValue: T);
```

**Example:**

```typescript
const getUser = createMockFnWithReturn({ name: "John", age: 30 });
const user = getUser(); // { name: 'John', age: 30 }
```

---

### **4. `sleep()`** - Delay Helper

**Purpose:** Wait for a specific duration (use sparingly!)

```typescript
export function sleep(ms: number): Promise<void>;
```

**When to use:**

- Testing time-based behavior (tooltips with delay, etc.)
- **Prefer `waitFor` over `sleep` when possible**

**Example:**

```typescript
test('tooltip appears after 300ms delay', async () => {
  renderWithProviders(<Tooltip />);

  await sleep(300);
  expect(screen.getByRole('tooltip')).toBeVisible();
});
```

---

### **5. `getComputedStyles()`** - CSS Style Helper

**Purpose:** Get computed styles of an element

```typescript
export function getComputedStyles(element: Element): CSSStyleDeclaration;
```

**Example:**

```typescript
test('primary button has correct background', () => {
  renderWithProviders(<Button variant="primary">Click</Button>);
  const button = screen.getByRole('button');
  const styles = getComputedStyles(button);

  expect(styles.backgroundColor).toBe('rgb(103, 80, 164)');
});
```

---

### **6. `hasClass()`** - Class Name Helper

**Purpose:** Check if element has a specific CSS class

```typescript
export function hasClass(element: Element, className: string): boolean;
```

**Example:**

```typescript
test('active button has active class', () => {
  renderWithProviders(<Button active>Click</Button>);
  const button = screen.getByRole('button');

  expect(hasClass(button, 'active')).toBe(true);
});
```

---

### **7. Re-exported Testing Library Utilities**

**Purpose:** Import everything from one place

```typescript
export {
  screen, // Query entire document
  within, // Query within specific element
  fireEvent, // Simulate events
  act, // Wrap state updates
  waitFor, // Wait for async updates
  waitForElementToBeRemoved, // Wait for removal
} from "@testing-library/react";

export { default as userEvent } from "@testing-library/user-event";
```

**Why re-export?**

- One import instead of many
- Consistent imports across all tests
- Easier to add custom utilities later

**Example:**

```typescript
// Before (multiple imports)
import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// After (single import)
import { screen, fireEvent, userEvent } from "../test/utils";
```

---

## 📝 Created Example Test: Color Utilities

**File:** `packages/react/src/utils/__tests__/colors.test.ts` (110 lines)

This test demonstrates good testing practices and covers all color utility functions.

**What it tests:**

1. `withOpacity()` - 4 test cases
2. `hexToRgb()` - 3 test cases
3. `rgbToHex()` - 4 test cases
4. `applyStateLayer()` - 4 test cases
5. `STATE_LAYER_OPACITY` - 2 test cases

**Total: 17 tests, all passing! ✅**

### Test Structure Example:

```typescript
describe("withOpacity", () => {
  test("adds opacity to hex color", () => {
    const result = withOpacity("#6750a4", 0.5);
    expect(result).toBe("#6750a480");
  });

  test("handles hex without # prefix", () => {
    const result = withOpacity("6750a4", 0.5);
    expect(result).toBe("#6750a480");
  });

  test("clamps opacity to 0-1 range", () => {
    expect(withOpacity("#6750a4", -0.5)).toBe("#6750a400"); // 0%
    expect(withOpacity("#6750a4", 1.5)).toBe("#6750a4ff"); // 100%
  });
});
```

**What makes this a good test:**

- ✅ Clear test names (describe what they test)
- ✅ Tests happy path (normal usage)
- ✅ Tests edge cases (no # prefix, out of range values)
- ✅ Easy to understand expectations
- ✅ Grouped by function using `describe()`

---

## 📊 Test Results

### Before This Task:

```
✓ 5 tests (only cn.test.ts)
```

### After This Task:

```
✓ 22 tests (cn.test.ts + colors.test.ts)
✓ cn utility: 5 tests
✓ color utilities: 17 tests
✓ Duration: 640ms
```

**Test Coverage Improved:**

- ✅ `cn` utility fully tested
- ✅ Color utilities fully tested
- ✅ Test utilities ready for component tests

---

## 🎓 Testing Patterns Demonstrated

### **1. Descriptive Test Names**

```typescript
// ✅ GOOD - Describes what is tested
test('adds opacity to hex color', () => { ... });
test('clamps opacity to 0-1 range', () => { ... });

// ❌ BAD - Vague or unclear
test('works', () => { ... });
test('test 1', () => { ... });
```

### **2. Arrange-Act-Assert Pattern**

```typescript
test("converts hex to RGB object", () => {
  // ARRANGE - Set up test data
  const hex = "#6750a4";

  // ACT - Run the function
  const result = hexToRgb(hex);

  // ASSERT - Check the result
  expect(result).toEqual({ r: 103, g: 80, b: 164 });
});
```

### **3. Testing Edge Cases**

```typescript
describe("withOpacity", () => {
  test("adds opacity to hex color", () => {
    // Happy path - normal usage
  });

  test("handles hex without # prefix", () => {
    // Edge case - different input format
  });

  test("clamps opacity to 0-1 range", () => {
    // Edge case - invalid values
  });
});
```

### **4. Grouping Related Tests**

```typescript
describe("Color Utilities", () => {
  describe("withOpacity", () => {
    test("...", () => {});
    test("...", () => {});
  });

  describe("hexToRgb", () => {
    test("...", () => {});
    test("...", () => {});
  });
});
```

**Benefits:**

- ✅ Easy to find related tests
- ✅ Better test output
- ✅ Can run specific groups

---

## 💡 How to Use Test Utilities

### **Import from utils:**

```typescript
import {
  renderWithProviders,
  screen,
  fireEvent,
  userEvent,
  waitFor,
  createMockFn,
} from '../../test/utils';

import { Button } from '../Button';

describe('Button', () => {
  test('renders with text', () => {
    renderWithProviders(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = createMockFn();
    renderWithProviders(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### **Real user interactions with userEvent:**

```typescript
test('user can type in input', async () => {
  const user = userEvent.setup();
  renderWithProviders(<Input />);

  // userEvent is more realistic than fireEvent
  await user.type(screen.getByRole('textbox'), 'Hello!');
  expect(screen.getByRole('textbox')).toHaveValue('Hello!');
});
```

### **Wait for async updates:**

```typescript
test('loads data', async () => {
  renderWithProviders(<AsyncComponent />);

  // Wait for element to appear
  await waitFor(() => {
    expect(screen.getByText('Loaded!')).toBeInTheDocument();
  });
});
```

---

## 📂 Files Created/Modified

### Created Files

1. **`packages/react/test/utils.tsx`** (228 lines)
   - Custom render function
   - Mock helpers
   - Style helpers
   - Re-exported Testing Library utilities
   - Full JSDoc documentation

2. **`packages/react/src/utils/__tests__/colors.test.ts`** (110 lines)
   - 17 comprehensive tests for color utilities
   - Demonstrates good testing patterns
   - Tests all functions and edge cases

---

## ✅ Success Criteria

- [x] Created test utilities file with helper functions
- [x] Implemented `renderWithProviders()` for future providers
- [x] Created mock function helpers
- [x] Added CSS/style testing helpers
- [x] Re-exported Testing Library utilities
- [x] Created example test using utilities
- [x] All tests passing (22/22 tests)
- [x] Comprehensive documentation with examples

---

## 🎓 Key Learnings

### 1. Test Utilities Reduce Repetition

**Without utilities:**

```typescript
// Every test needs this setup
test('test 1', () => {
  render(<ThemeProvider><Button /></ThemeProvider>);
});

test('test 2', () => {
  render(<ThemeProvider><Button /></ThemeProvider>);
});
```

**With utilities:**

```typescript
// Setup once, use everywhere
test('test 1', () => {
  renderWithProviders(<Button />);
});

test('test 2', () => {
  renderWithProviders(<Button />);
});
```

### 2. Mock Functions Track Behavior

Mock functions remember:

- How many times they were called
- What arguments they received
- What they returned

```typescript
const mock = createMockFn();
mock("hello");
mock("world");

expect(mock).toHaveBeenCalledTimes(2);
expect(mock).toHaveBeenCalledWith("hello");
expect(mock).toHaveBeenLastCalledWith("world");
```

### 3. userEvent vs fireEvent

**`fireEvent`** - Low-level event dispatch:

```typescript
fireEvent.click(button); // Just triggers click event
```

**`userEvent`** - Simulates real user behavior:

```typescript
const user = userEvent.setup();
await user.click(button); // Triggers hover, focus, click, blur, etc.
```

**Rule of thumb:** Use `userEvent` for integration tests, `fireEvent` for unit tests.

### 4. Edge Cases Matter

Always test:

- ✅ **Happy path** - Normal usage
- ✅ **Edge cases** - Empty, null, undefined
- ✅ **Boundaries** - Min/max values
- ✅ **Error cases** - Invalid input

Example:

```typescript
test("handles empty input", () => {
  expect(myFunc("")).toBe("");
});

test("handles null", () => {
  expect(myFunc(null)).toBe(defaultValue);
});

test("handles max value", () => {
  expect(myFunc(Number.MAX_VALUE)).toBe(Number.MAX_VALUE);
});
```

### 5. Good Test Organization

```
describe('[Component/Feature]', () => {
  describe('[Sub-feature]', () => {
    test('[specific behavior]', () => {
      // test code
    });
  });
});
```

**Benefits:**

- Easy to find tests
- Clear test structure
- Better failure messages

---

## 🔗 Related Tasks

**Prerequisite Tasks:**

- ✅ Task 7.1 - Vitest Configuration

**This Task (7.2):**

- ✅ Test utilities created
- ✅ Example tests written

**Next Tasks:**

- ⏳ Task 7.3 - Test Utilities (Additional helpers for component testing)

---

## 📝 Notes for Next Steps

### Using These Utilities in Component Tests

When we start building components in Phase 1:

```typescript
// Button.test.tsx
import { renderWithProviders, screen, userEvent } from '../../test/utils';
import { Button } from './Button';

describe('Button', () => {
  test('renders correctly', () => {
    renderWithProviders(<Button>Click Me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click Me');
  });

  test('responds to clicks', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    renderWithProviders(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Future Enhancements

As we build components, we'll add more utilities:

- `renderWithTheme()` - Render with specific theme
- `mockMediaQuery()` - Test responsive behavior
- `mockIntersectionObserver()` - Test lazy loading
- Component-specific test helpers

### Testing Best Practices Established

1. ✅ Always use descriptive test names
2. ✅ Group related tests with `describe()`
3. ✅ Test happy path + edge cases
4. ✅ Use `userEvent` for realistic interactions
5. ✅ Use `renderWithProviders()` consistently
6. ✅ Write clear, maintainable tests

---

## ✅ Task Completion

**Status:** Complete ✅  
**Result:** Test utilities created and ready for component testing. Example tests demonstrate best practices.

**Test Results:**

- ✅ 22 tests passing (5 cn + 17 color utilities)
- ✅ All utilities documented with examples
- ✅ Ready for Phase 1 component development

**Next Task:** Task 7.3 - Test Utilities (Additional helpers)

---

_Task completed on 2025-12-30 as part of Phase 0 - Part H (Testing Setup)_

/**
 * Example Test File - cn utility
 *
 * This file shows how tests work using a simple example.
 * We're testing the 'cn' utility that combines class names.
 *
 * Test file naming convention:
 * - __tests__/filename.test.ts (what we're using)
 * - filename.spec.ts (also common)
 */

// Import the function we want to test
import { describe, test, expect } from "vitest";
import { cn } from "../cn";

/**
 * describe() groups related tests together
 * Think of it as a "chapter" for tests about one topic
 */
describe("cn utility", () => {
  /**
   * test() or it() defines a single test
   * The string describes what the test checks
   * The function contains the test logic
   */

  test("combines multiple class names", () => {
    // Arrange: Set up the test data
    const classes = ["button", "button-primary", "rounded"];

    // Act: Run the function we're testing
    const result = cn(...classes);

    // Assert: Check if the result is what we expect
    expect(result).toBe("button button-primary rounded");
  });

  test("handles conditional classes", () => {
    // Test that false/undefined/null values are filtered out
    const shouldHide = false;
    const result = cn("button", shouldHide && "hidden", undefined, null, "active");

    expect(result).toBe("button active");
  });

  test("merges conflicting Tailwind classes", () => {
    // This is the special feature of cn (using tailwind-merge)
    // When you have conflicting classes, it keeps only the last one
    const result = cn("p-4 p-2"); // Both are padding classes

    // tailwind-merge removes 'p-4' and keeps 'p-2'
    expect(result).toBe("p-2");
  });

  test("handles empty input", () => {
    // Edge case: what happens with no input?
    const result = cn();

    expect(result).toBe("");
  });

  test("handles arrays and objects", () => {
    // cn (via clsx) supports arrays and objects
    const result = cn("base", ["item1", "item2"], {
      active: true,
      disabled: false,
    });

    expect(result).toBe("base item1 item2 active");
  });
});

/**
 * UNDERSTANDING TEST STRUCTURE
 *
 * 1. Arrange (Setup)
 *    - Prepare the data and conditions
 *    - Create variables, mock functions, etc.
 *
 * 2. Act (Execute)
 *    - Run the function or action you're testing
 *    - This is usually one line
 *
 * 3. Assert (Verify)
 *    - Check if the result matches your expectation
 *    - Use expect() with matchers like toBe(), toEqual(), etc.
 *
 * COMMON MATCHERS (expect functions):
 *
 * - toBe(value)           → Checks exact equality (===)
 * - toEqual(value)        → Checks deep equality (for objects/arrays)
 * - toBeTruthy()          → Checks if value is truthy
 * - toBeFalsy()           → Checks if value is falsy
 * - toContain(item)       → Checks if array/string contains item
 * - toHaveLength(number)  → Checks array/string length
 * - toThrow()             → Checks if function throws error
 *
 * RUNNING TESTS:
 *
 * - pnpm test              → Run all tests once
 * - pnpm test:watch        → Run tests and watch for changes
 * - pnpm test cn.test      → Run only tests matching "cn.test"
 */

/**
 * Test Utilities
 * 
 * Helper functions and utilities for testing React components.
 * These utilities make tests cleaner and more maintainable.
 * 
 * Why use test utilities?
 * - Avoid repetitive setup code
 * - Ensure consistent test environment
 * - Make tests easier to read and maintain
 */

import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';

/**
 * Custom render function that wraps components with common providers
 * 
 * This is a placeholder for when we add theme providers, etc.
 * Right now it just wraps the standard render, but we'll extend it later.
 * 
 * @param ui - The component to render
 * @param options - Optional render options
 * @returns Render result with all Testing Library utilities
 * 
 * @example
 * ```tsx
 * test('Button renders', () => {
 *   const { getByText } = renderWithProviders(<Button>Click Me</Button>);
 *   expect(getByText('Click Me')).toBeInTheDocument();
 * });
 * ```
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  // Future: Add providers here (ThemeProvider, etc.)
  // const Wrapper = ({ children }: { children: React.ReactNode }) => (
  //   <ThemeProvider>
  //     {children}
  //   </ThemeProvider>
  // );
  
  return render(ui, { ...options });
}

/**
 * Wait for an element to be removed from the document
 * 
 * Useful for testing loading states, animations, etc.
 * 
 * @example
 * ```tsx
 * test('loading spinner disappears', async () => {
 *   const { getByTestId } = renderWithProviders(<AsyncComponent />);
 *   const spinner = getByTestId('loading-spinner');
 *   
 *   await waitForElementToBeRemoved(spinner);
 *   // Now the loading is done!
 * });
 * ```
 */
export { waitForElementToBeRemoved } from '@testing-library/react';

/**
 * Wait for an async operation to complete
 * 
 * Use this when testing async state updates
 * 
 * @example
 * ```tsx
 * test('data loads', async () => {
 *   renderWithProviders(<DataComponent />);
 *   
 *   await waitFor(() => {
 *     expect(screen.getByText('Loaded!')).toBeInTheDocument();
 *   });
 * });
 * ```
 */
export { waitFor } from '@testing-library/react';

/**
 * Create a mock function (spy)
 * 
 * Mock functions track how they're called, making it easy to test
 * that callbacks and event handlers work correctly.
 * 
 * @example
 * ```tsx
 * test('button calls onClick', () => {
 *   const handleClick = createMockFn();
 *   renderWithProviders(<Button onClick={handleClick}>Click</Button>);
 *   
 *   fireEvent.click(screen.getByRole('button'));
 *   expect(handleClick).toHaveBeenCalledTimes(1);
 * });
 * ```
 */
export const createMockFn = vi.fn;

/**
 * Create a mock function that returns a specific value
 * 
 * @param returnValue - The value the mock should return
 * @returns A mock function that returns the specified value
 * 
 * @example
 * ```tsx
 * const getUser = createMockFnWithReturn({ name: 'John', age: 30 });
 * const user = getUser(); // { name: 'John', age: 30 }
 * ```
 */
export function createMockFnWithReturn<T>(returnValue: T) {
  return vi.fn(() => returnValue);
}

/**
 * Sleep for a specified duration (for testing delays)
 * 
 * Use sparingly! Prefer `waitFor` when possible.
 * Only use this when you need to test time-based behavior.
 * 
 * @param ms - Milliseconds to sleep
 * 
 * @example
 * ```tsx
 * test('tooltip appears after delay', async () => {
 *   renderWithProviders(<Tooltip />);
 *   
 *   await sleep(300); // Wait 300ms
 *   expect(screen.getByRole('tooltip')).toBeVisible();
 * });
 * ```
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get computed style of an element
 * 
 * Useful for testing CSS-based behavior (visibility, colors, etc.)
 * 
 * @param element - The element to get styles from
 * @returns The computed style object
 * 
 * @example
 * ```tsx
 * test('button has correct background color', () => {
 *   renderWithProviders(<Button variant="primary">Click</Button>);
 *   const button = screen.getByRole('button');
 *   const styles = getComputedStyles(button);
 *   
 *   expect(styles.backgroundColor).toBe('rgb(103, 80, 164)');
 * });
 * ```
 */
export function getComputedStyles(element: Element): CSSStyleDeclaration {
  return window.getComputedStyle(element);
}

/**
 * Check if an element has a specific CSS class
 * 
 * Helper to make class checking more readable
 * 
 * @param element - The element to check
 * @param className - The class name to look for
 * @returns True if the element has the class
 * 
 * @example
 * ```tsx
 * test('active button has active class', () => {
 *   renderWithProviders(<Button active>Click</Button>);
 *   const button = screen.getByRole('button');
 *   
 *   expect(hasClass(button, 'active')).toBe(true);
 * });
 * ```
 */
export function hasClass(element: Element, className: string): boolean {
  return element.classList.contains(className);
}

/**
 * Re-export commonly used Testing Library utilities
 * So you can import everything from one place
 */
export {
  screen,
  within,
  fireEvent,
  act,
} from '@testing-library/react';

/**
 * Re-export user-event for realistic user interactions
 * 
 * userEvent is more realistic than fireEvent because it:
 * - Triggers all the same events a real user would
 * - Handles focus, hover, and other state changes
 * - Better for integration tests
 * 
 * @example
 * ```tsx
 * import { userEvent } from './test/utils';
 * 
 * test('user can type in input', async () => {
 *   const user = userEvent.setup();
 *   renderWithProviders(<Input />);
 *   
 *   await user.type(screen.getByRole('textbox'), 'Hello!');
 *   expect(screen.getByRole('textbox')).toHaveValue('Hello!');
 * });
 * ```
 */
export { default as userEvent } from '@testing-library/user-event';

// Re-export types for convenience
export type { RenderResult } from '@testing-library/react';


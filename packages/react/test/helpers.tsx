/**
 * Component Testing Helpers
 *
 * Specialized utilities for testing React components,
 * with a focus on accessibility and Material Design 3 patterns.
 *
 * These helpers are more specific than the general utilities in utils.tsx
 * and are designed for testing interactive components.
 */

import { type ReactElement } from "react";
import { render, type RenderResult } from "@testing-library/react";

/**
 * Test if an element is keyboard accessible
 *
 * Checks if an element can be focused and activated via keyboard.
 * Important for accessibility testing.
 *
 * @param element - The element to test
 * @returns True if the element is keyboard accessible
 *
 * @example
 * ```tsx
 * test('button is keyboard accessible', () => {
 *   const { getByRole } = render(<Button>Click</Button>);
 *   const button = getByRole('button');
 *
 *   expect(isKeyboardAccessible(button)).toBe(true);
 * });
 * ```
 */
export function isKeyboardAccessible(element: Element): boolean {
  const tabIndex = element.getAttribute("tabindex");
  const isButton = element.tagName === "BUTTON";
  const isLink = element.tagName === "A";
  const isInput = element.tagName === "INPUT";

  // Element is keyboard accessible if:
  // - It's a native interactive element (button, link, input)
  // - Or it has tabindex >= 0
  return (
    isButton ||
    isLink ||
    isInput ||
    (tabIndex !== null && parseInt(tabIndex) >= 0)
  );
}

/**
 * Test if an element has proper ARIA labeling
 *
 * Checks for aria-label, aria-labelledby, or visible text content.
 * Critical for screen reader accessibility.
 *
 * @param element - The element to test
 * @returns True if the element has accessible labeling
 *
 * @example
 * ```tsx
 * test('icon button has aria-label', () => {
 *   const { getByRole } = render(<IconButton icon="close" aria-label="Close" />);
 *   const button = getByRole('button');
 *
 *   expect(hasAccessibleLabel(button)).toBe(true);
 * });
 * ```
 */
export function hasAccessibleLabel(element: Element): boolean {
  const hasAriaLabel = element.hasAttribute("aria-label");
  const hasAriaLabelledBy = element.hasAttribute("aria-labelledby");
  const hasTextContent = (element.textContent?.trim().length ?? 0) > 0;
  const hasTitle = element.hasAttribute("title");

  return hasAriaLabel || hasAriaLabelledBy || hasTextContent || hasTitle;
}

/**
 * Test if an element has proper ARIA role
 *
 * @param element - The element to test
 * @param expectedRole - The expected ARIA role
 * @returns True if the element has the expected role
 *
 * @example
 * ```tsx
 * test('custom button has button role', () => {
 *   const { getByTestId } = render(<div data-testid="btn" role="button">Click</div>);
 *   const btn = getByTestId('btn');
 *
 *   expect(hasRole(btn, 'button')).toBe(true);
 * });
 * ```
 */
export function hasRole(element: Element, expectedRole: string): boolean {
  const role = element.getAttribute("role");
  return role === expectedRole;
}

/**
 * Test if an element is disabled
 *
 * Checks both disabled attribute and aria-disabled
 *
 * @param element - The element to test
 * @returns True if the element is disabled
 *
 * @example
 * ```tsx
 * test('disabled button is not interactive', () => {
 *   const { getByRole } = render(<Button disabled>Click</Button>);
 *   const button = getByRole('button');
 *
 *   expect(isDisabled(button)).toBe(true);
 * });
 * ```
 */
export function isDisabled(element: Element): boolean {
  const hasDisabledAttr = element.hasAttribute("disabled");
  const hasAriaDisabled = element.getAttribute("aria-disabled") === "true";

  return hasDisabledAttr || hasAriaDisabled;
}

/**
 * Get all focusable elements within a container
 *
 * Useful for testing focus management and keyboard navigation
 *
 * @param container - The container element
 * @returns Array of focusable elements
 *
 * @example
 * ```tsx
 * test('dialog traps focus', () => {
 *   const { container } = render(
 *     <Dialog>
 *       <button>First</button>
 *       <button>Second</button>
 *     </Dialog>
 *   );
 *
 *   const focusable = getFocusableElements(container);
 *   expect(focusable).toHaveLength(2);
 * });
 * ```
 */
export function getFocusableElements(container: Element): Element[] {
  const selector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");

  return Array.from(container.querySelectorAll(selector));
}

/**
 * Test if an element is visible to screen readers
 *
 * Checks if element is hidden from assistive technology
 *
 * @param element - The element to test
 * @returns True if visible to screen readers
 *
 * @example
 * ```tsx
 * test('decorative icon is hidden from screen readers', () => {
 *   const { getByTestId } = render(<Icon aria-hidden="true" data-testid="icon" />);
 *   const icon = getByTestId('icon');
 *
 *   expect(isVisibleToScreenReaders(icon)).toBe(false);
 * });
 * ```
 */
export function isVisibleToScreenReaders(element: Element): boolean {
  const ariaHidden = element.getAttribute("aria-hidden") === "true";
  const role = element.getAttribute("role");
  const isPresentation = role === "presentation" || role === "none";

  return !ariaHidden && !isPresentation;
}

/**
 * Simulate a keyboard event on an element
 *
 * Helper to test keyboard interactions
 *
 * @param element - The element to trigger event on
 * @param key - The key to press (e.g., 'Enter', 'Escape')
 * @param options - Additional event options
 *
 * @example
 * ```tsx
 * test('Enter key activates button', () => {
 *   const handleClick = vi.fn();
 *   const { getByRole } = render(<Button onClick={handleClick}>Click</Button>);
 *   const button = getByRole('button');
 *
 *   pressKey(button, 'Enter');
 *   expect(handleClick).toHaveBeenCalled();
 * });
 * ```
 */
export function pressKey(
  element: Element,
  key: string,
  options: Partial<KeyboardEventInit> = {}
): void {
  const event = new KeyboardEvent("keydown", {
    key,
    bubbles: true,
    cancelable: true,
    ...options,
  });
  element.dispatchEvent(event);
}

/**
 * Test if an element has focus
 *
 * @param element - The element to check
 * @returns True if the element has focus
 *
 * @example
 * ```tsx
 * test('input receives focus on mount', () => {
 *   const { getByRole } = render(<Input autoFocus />);
 *   const input = getByRole('textbox');
 *
 *   expect(hasFocus(input)).toBe(true);
 * });
 * ```
 */
export function hasFocus(element: Element): boolean {
  return document.activeElement === element;
}

/**
 * Wait for an element to receive focus
 *
 * Useful for testing focus management
 *
 * @param element - The element that should receive focus
 * @param timeout - Maximum time to wait (ms)
 * @returns Promise that resolves when element receives focus
 *
 * @example
 * ```tsx
 * test('first input receives focus in dialog', async () => {
 *   const { getByRole } = render(<Dialog />);
 *   const input = getByRole('textbox');
 *
 *   await waitForFocus(input);
 *   expect(hasFocus(input)).toBe(true);
 * });
 * ```
 */
export function waitForFocus(element: Element, timeout = 1000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (hasFocus(element)) {
      resolve();
      return;
    }

    const timeoutId = setTimeout(() => {
      reject(new Error(`Element did not receive focus within ${timeout}ms`));
    }, timeout);

    const observer = new MutationObserver(() => {
      if (hasFocus(element)) {
        clearTimeout(timeoutId);
        observer.disconnect();
        resolve();
      }
    });

    observer.observe(document, {
      subtree: true,
      childList: true,
      attributes: true,
    });
  });
}

/**
 * Get color contrast ratio between foreground and background
 *
 * Calculates WCAG contrast ratio. Useful for testing color accessibility.
 *
 * @param foreground - Foreground color (RGB string like 'rgb(255, 255, 255)')
 * @param background - Background color (RGB string)
 * @returns Contrast ratio (1-21)
 *
 * @example
 * ```tsx
 * test('button has sufficient contrast', () => {
 *   const { getByRole } = render(<Button>Click</Button>);
 *   const button = getByRole('button');
 *   const styles = window.getComputedStyle(button);
 *
 *   const ratio = getContrastRatio(styles.color, styles.backgroundColor);
 *   expect(ratio).toBeGreaterThanOrEqual(4.5); // WCAG AA for normal text
 * });
 * ```
 */
export function getContrastRatio(
  foreground: string,
  background: string
): number {
  const getLuminance = (rgb: string): number => {
    const match = rgb.match(/\d+/g);
    if (!match || match.length < 3) return 0;

    const values = match.map(Number);
    const r = values[0] ?? 0;
    const g = values[1] ?? 0;
    const b = values[2] ?? 0;

    const toLinear = (val: number): number => {
      const normalized = val / 255;
      return normalized <= 0.03928
        ? normalized / 12.92
        : Math.pow((normalized + 0.055) / 1.055, 2.4);
    };

    const rs = toLinear(r);
    const gs = toLinear(g);
    const bs = toLinear(b);

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Render component and get it by role for quick testing
 *
 * Convenience function that combines render and getByRole
 *
 * @param ui - Component to render
 * @param role - ARIA role to query
 * @returns Tuple of [element, renderResult]
 *
 * @example
 * ```tsx
 * test('button renders', () => {
 *   const [button] = renderAndGetByRole(<Button>Click</Button>, 'button');
 *   expect(button).toBeInTheDocument();
 * });
 * ```
 */
export function renderAndGetByRole(
  ui: ReactElement,
  role: string
): [Element, RenderResult] {
  const result = render(ui);
  const element = result.getByRole(role);
  return [element, result];
}

/**
 * Check if an element is in the tab order
 *
 * @param element - The element to check
 * @returns True if element is in tab order
 *
 * @example
 * ```tsx
 * test('disabled button is not in tab order', () => {
 *   const { getByRole } = render(<Button disabled>Click</Button>);
 *   const button = getByRole('button');
 *
 *   expect(isInTabOrder(button)).toBe(false);
 * });
 * ```
 */
export function isInTabOrder(element: Element): boolean {
  const tabIndex = element.getAttribute("tabindex");
  const isDisabledElement = isDisabled(element);

  if (isDisabledElement) return false;
  if (tabIndex === "-1") return false;

  return isKeyboardAccessible(element);
}

/**
 * Get all elements with insufficient color contrast
 *
 * Scans container for WCAG AA contrast violations
 *
 * @param container - Container to scan
 * @param minRatio - Minimum required contrast ratio (default: 4.5 for WCAG AA)
 * @returns Array of elements with insufficient contrast
 *
 * @example
 * ```tsx
 * test('no contrast violations', () => {
 *   const { container } = render(<MyComponent />);
 *   const violations = getContrastViolations(container);
 *
 *   expect(violations).toHaveLength(0);
 * });
 * ```
 */
export function getContrastViolations(
  container: Element,
  minRatio = 4.5
): Element[] {
  const violations: Element[] = [];
  const elements = container.querySelectorAll("*");

  elements.forEach((element) => {
    const styles = window.getComputedStyle(element);
    const hasText = (element.textContent?.trim().length ?? 0) > 0;

    if (!hasText) return;

    const ratio = getContrastRatio(styles.color, styles.backgroundColor);
    if (ratio < minRatio) {
      violations.push(element);
    }
  });

  return violations;
}

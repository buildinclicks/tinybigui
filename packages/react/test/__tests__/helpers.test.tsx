/**
 * Component Testing Helpers Tests
 * 
 * Tests for the accessibility and component testing helpers.
 * These tests also serve as examples of how to use the helpers.
 */

import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  isKeyboardAccessible,
  hasAccessibleLabel,
  hasRole,
  isDisabled,
  getFocusableElements,
  isVisibleToScreenReaders,
  hasFocus,
  getContrastRatio,
  isInTabOrder,
} from '../helpers';

describe('Component Testing Helpers', () => {
  describe('isKeyboardAccessible', () => {
    test('native button is keyboard accessible', () => {
      const { getByRole } = render(<button>Click</button>);
      const button = getByRole('button');
      
      expect(isKeyboardAccessible(button)).toBe(true);
    });

    test('div with tabindex=0 is keyboard accessible', () => {
      const { getByTestId } = render(<div data-testid="div" tabIndex={0}>Content</div>);
      const div = getByTestId('div');
      
      expect(isKeyboardAccessible(div)).toBe(true);
    });

    test('div without tabindex is not keyboard accessible', () => {
      const { getByTestId } = render(<div data-testid="div">Content</div>);
      const div = getByTestId('div');
      
      expect(isKeyboardAccessible(div)).toBe(false);
    });

    test('link is keyboard accessible', () => {
      const { getByRole } = render(<a href="#">Link</a>);
      const link = getByRole('link');
      
      expect(isKeyboardAccessible(link)).toBe(true);
    });
  });

  describe('hasAccessibleLabel', () => {
    test('button with text content has accessible label', () => {
      const { getByRole } = render(<button>Click Me</button>);
      const button = getByRole('button');
      
      expect(hasAccessibleLabel(button)).toBe(true);
    });

    test('button with aria-label has accessible label', () => {
      const { getByRole } = render(<button aria-label="Close">×</button>);
      const button = getByRole('button');
      
      expect(hasAccessibleLabel(button)).toBe(true);
    });

    test('button without label does not have accessible label', () => {
      const { getByTestId } = render(<button data-testid="btn"></button>);
      const button = getByTestId('btn');
      
      expect(hasAccessibleLabel(button)).toBe(false);
    });
  });

  describe('hasRole', () => {
    test('element with role attribute has correct role', () => {
      const { getByTestId } = render(<div role="button" data-testid="div">Click</div>);
      const div = getByTestId('div');
      
      expect(hasRole(div, 'button')).toBe(true);
      expect(hasRole(div, 'link')).toBe(false);
    });
  });

  describe('isDisabled', () => {
    test('button with disabled attribute is disabled', () => {
      const { getByRole } = render(<button disabled>Click</button>);
      const button = getByRole('button');
      
      expect(isDisabled(button)).toBe(true);
    });

    test('element with aria-disabled is disabled', () => {
      const { getByRole } = render(<button aria-disabled="true">Click</button>);
      const button = getByRole('button');
      
      expect(isDisabled(button)).toBe(true);
    });

    test('enabled button is not disabled', () => {
      const { getByRole } = render(<button>Click</button>);
      const button = getByRole('button');
      
      expect(isDisabled(button)).toBe(false);
    });
  });

  describe('getFocusableElements', () => {
    test('finds all focusable elements in container', () => {
      const { container } = render(
        <div>
          <button>Button 1</button>
          <a href="#">Link</a>
          <input type="text" />
          <button>Button 2</button>
          <div>Not focusable</div>
        </div>
      );
      
      const focusable = getFocusableElements(container);
      expect(focusable).toHaveLength(4); // 2 buttons + 1 link + 1 input
    });

    test('excludes disabled elements', () => {
      const { container } = render(
        <div>
          <button>Enabled</button>
          <button disabled>Disabled</button>
        </div>
      );
      
      const focusable = getFocusableElements(container);
      expect(focusable).toHaveLength(1); // Only enabled button
    });
  });

  describe('isVisibleToScreenReaders', () => {
    test('regular element is visible to screen readers', () => {
      const { getByTestId } = render(<div data-testid="div">Content</div>);
      const div = getByTestId('div');
      
      expect(isVisibleToScreenReaders(div)).toBe(true);
    });

    test('aria-hidden element is not visible to screen readers', () => {
      const { getByTestId } = render(<div aria-hidden="true" data-testid="div">Content</div>);
      const div = getByTestId('div');
      
      expect(isVisibleToScreenReaders(div)).toBe(false);
    });

    test('presentation role is not visible to screen readers', () => {
      const { getByTestId } = render(<div role="presentation" data-testid="div">Content</div>);
      const div = getByTestId('div');
      
      expect(isVisibleToScreenReaders(div)).toBe(false);
    });
  });

  describe('hasFocus', () => {
    test('focused element returns true', () => {
      const { getByRole } = render(<input autoFocus />);
      const input = getByRole('textbox');
      
      expect(hasFocus(input)).toBe(true);
    });

    test('unfocused element returns false', () => {
      const { getByRole } = render(<button>Click</button>);
      const button = getByRole('button');
      
      expect(hasFocus(button)).toBe(false);
    });
  });

  describe('getContrastRatio', () => {
    test('calculates contrast ratio for black on white', () => {
      const ratio = getContrastRatio('rgb(0, 0, 0)', 'rgb(255, 255, 255)');
      expect(ratio).toBeCloseTo(21, 1); // Maximum contrast
    });

    test('calculates contrast ratio for white on white', () => {
      const ratio = getContrastRatio('rgb(255, 255, 255)', 'rgb(255, 255, 255)');
      expect(ratio).toBeCloseTo(1, 1); // Minimum contrast
    });

    test('MD3 primary color has sufficient contrast on white', () => {
      const ratio = getContrastRatio('rgb(103, 80, 164)', 'rgb(255, 255, 255)');
      expect(ratio).toBeGreaterThan(4.5); // WCAG AA requirement
    });
  });

  describe('isInTabOrder', () => {
    test('regular button is in tab order', () => {
      const { getByRole } = render(<button>Click</button>);
      const button = getByRole('button');
      
      expect(isInTabOrder(button)).toBe(true);
    });

    test('disabled button is not in tab order', () => {
      const { getByRole } = render(<button disabled>Click</button>);
      const button = getByRole('button');
      
      expect(isInTabOrder(button)).toBe(false);
    });

    test('element with tabindex=-1 is not in tab order', () => {
      const { getByTestId } = render(<div tabIndex={-1} data-testid="div">Content</div>);
      const div = getByTestId('div');
      
      expect(isInTabOrder(div)).toBe(false);
    });
  });
});


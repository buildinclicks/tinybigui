/**
 * Test Setup File
 * 
 * This file runs BEFORE any tests start.
 * It sets up the testing environment and adds helpful utilities.
 * 
 * Think of this as "preparing the stage" before the show (tests) begin.
 */

// Import Vitest utilities for mocking
import { vi } from 'vitest';

// Import testing utilities from React Testing Library
// These help us test React components
import '@testing-library/jest-dom';

// What is @testing-library/jest-dom?
// It adds helpful matchers (assertions) for testing DOM elements
// 
// Examples:
// - expect(element).toBeInTheDocument()
// - expect(element).toHaveTextContent('Hello')
// - expect(element).toBeVisible()
// - expect(button).toBeDisabled()
//
// Without this, you'd have to write complex checks manually

// Mock window.matchMedia (needed for responsive tests)
// Many components use matchMedia to check screen size
// But it doesn't exist in the test environment, so we mock it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false, // Default: media query doesn't match
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated but still used by some libraries
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver (needed for components that use it)
// IntersectionObserver detects when elements enter/leave viewport
// It's not available in tests, so we provide a fake version
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as unknown as typeof IntersectionObserver;

// Mock ResizeObserver (needed for components that track size changes)
// ResizeObserver detects when elements change size
// Not available in tests, so we mock it
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as unknown as typeof ResizeObserver;

// You can add more setup here as needed
// For example:
// - Custom matchers
// - Global test utilities
// - Mock data
// - Environment variables


/**
 * Vitest Configuration (v4.0.16+)
 * 
 * This file tells Vitest how to run tests for our component library.
 * Vitest is our testing tool - it runs tests and reports results.
 * 
 * Version: Vitest 4.x
 * New features available:
 * - Stable Browser Mode (run tests in real browsers)
 * - Visual Regression Testing (toMatchScreenshot)
 * - Playwright Traces integration
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  // Plugins: Tools that extend Vitest's functionality
  plugins: [
    // React plugin: Allows Vitest to understand React/JSX syntax
    react(),
  ],

  // Test configuration: Tells Vitest how to run our tests
  test: {
    // Environment: 'jsdom' simulates a browser environment
    // This is needed because React components need browser APIs (like DOM)
    environment: 'jsdom',

    // Globals: Makes test functions available globally
    // Without this, you'd need to import { test, expect } in every test file
    // With this, you can just write test() and expect() directly
    globals: true,

    // Setup files: Run before any tests start
    // This file will set up React Testing Library and other test utilities
    setupFiles: ['./test/setup.ts'],

    // CSS handling: Mock CSS imports in tests
    // Tests don't need actual styles, so we mock them for speed
    css: false,

    // Coverage: Code coverage reports (optional, can enable later)
    // Shows which parts of your code are tested
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'packages/*/dist/',
        'packages/*/test/',
        '**/*.config.ts',
        '**/*.d.ts',
      ],
    },

    // Include: Which files to consider as tests
    // Any file with .test.ts, .test.tsx, .spec.ts, .spec.tsx is a test
    include: ['**/*.{test,spec}.{ts,tsx}'],

    // Exclude: Which files/folders to ignore
    exclude: [
      'node_modules',
      'dist',
      '.next',
      '.cache',
      'build',
    ],
  },

  // Resolve: Help Vitest find modules
  resolve: {
    alias: {
      // Allow imports like '@/utils' instead of '../../utils'
      '@': resolve(__dirname, './packages/react/src'),
    },
  },
});


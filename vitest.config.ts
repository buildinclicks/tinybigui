/**
 * Root Vitest Configuration for tinybigui monorepo
 *
 * This is the root-level config. Individual packages have their own vitest.config.ts
 * for package-specific test configuration.
 *
 * Version: Vitest 4.x
 */

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Workspace mode: Each package has its own test configuration
    // Tests should be run from individual packages, not from root

    // Global exclude patterns for the entire workspace
    exclude: ["node_modules", "dist", ".next", ".cache", "build", "storybook-static"],
  },
});

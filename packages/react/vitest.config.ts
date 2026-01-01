/**
 * Vitest Configuration for @tinybigui/react package
 *
 * This config is specific to the React components package.
 * It handles component testing with jsdom environment and React Testing Library.
 */

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  ssr: {
    noExternal: ["@react-aria/live-announcer", "@react-aria/calendar"],
  },
  test: {
    // Environment: jsdom simulates a browser for React component testing
    environment: "jsdom",

    // Globals: Makes test functions available without imports
    globals: true,

    // Setup files: Run before tests (mocks, test utilities, etc.)
    setupFiles: ["./test/setup.ts"],

    // CSS handling: Mock CSS imports for faster tests
    css: false,

    // Server configuration for dependency handling
    server: {
      deps: {
        // Inline React Aria packages to avoid pnpm hoisting issues
        // This tells Vitest to bundle these dependencies instead of relying on node resolution
        inline: [/react-aria/, /@react-aria\//, /@react-stately\//, /@internationalized\//],
      },
    },

    // Force Vite to bundle React Aria packages (no external)
    // This prevents Vite from trying to resolve them from node_modules
    deps: {
      optimizer: {
        web: {
          include: [
            "@react-aria/live-announcer",
            "react-aria",
            "react-aria-components",
            "@react-aria/button",
            "@react-aria/focus",
            "@react-aria/interactions",
            "@react-aria/utils",
          ],
        },
      },
    },

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "test/",
        "**/*.config.ts",
        "**/*.d.ts",
        "**/*.stories.tsx",
      ],
    },

    // Include: Test file patterns
    include: ["**/*.{test,spec}.{ts,tsx}"],

    // Exclude: Ignore these files/folders
    exclude: ["node_modules", "dist", ".storybook", "storybook-static"],
  },

  // Resolve: Module resolution aliases
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      // Manual resolution for React Aria packages to fix import issues
    },
  },
});

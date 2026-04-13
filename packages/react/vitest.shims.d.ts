/// <reference types="@vitest/browser-playwright" />

import type AxeCore from "axe-core";

declare module "vitest" {
  // Extend Vitest's Assertion interface to include vitest-axe matchers
  interface Assertion {
    /** Assert that axe-core found no accessibility violations */
    toHaveNoViolations(): { actual: AxeCore.Result[]; message(): string; pass: boolean };
  }
  interface AsymmetricMatchersContaining {
    /** Assert that axe-core found no accessibility violations */
    toHaveNoViolations(): { actual: AxeCore.Result[]; message(): string; pass: boolean };
  }
}

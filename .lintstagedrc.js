/**
 * lint-staged Configuration
 *
 * Runs linters and formatters only on staged files (not the entire codebase).
 * This makes pre-commit checks fast and focused on your changes.
 *
 * Why lint-staged?
 * - Runs in <1s instead of 30s+ for full codebase
 * - Only checks files you're actually committing
 * - Auto-fixes issues (ESLint/Prettier)
 * - Prevents slow pre-commit hooks
 *
 * @see https://github.com/lint-staged/lint-staged
 */

module.exports = {
  // TypeScript and JavaScript files
  "*.{ts,tsx,js,jsx}": [
    // 1. Run ESLint with auto-fix
    "eslint --fix",
    // 2. Format with Prettier (includes Tailwind class sorting)
    "prettier --write",
  ],

  // JSON, Markdown, and CSS files
  "*.{json,md,css}": [
    // Format with Prettier only
    "prettier --write",
  ],

  // Note: Type checking is intentionally omitted here for speed.
  // It will run in CI/CD to catch type errors on the full codebase.
  // Running typecheck on every commit would be too slow for large projects.
};


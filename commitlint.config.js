/**
 * Commitlint Configuration
 *
 * Enforces Conventional Commits format for all commit messages.
 *
 * Format: <type>(<scope>): <subject>
 *
 * Types:
 * - feat: New feature
 * - fix: Bug fix
 * - docs: Documentation only
 * - style: Code style (formatting, semicolons, etc)
 * - refactor: Code change that neither fixes a bug nor adds a feature
 * - perf: Performance improvement
 * - test: Adding or updating tests
 * - build: Changes to build system or dependencies
 * - ci: Changes to CI configuration
 * - chore: Other changes (maintenance, tooling, etc)
 * - revert: Revert a previous commit
 *
 * Examples:
 * - feat(button): add ripple effect
 * - fix(textfield): resolve focus issue
 * - docs: update installation guide
 * - chore: upgrade dependencies
 *
 * @see https://www.conventionalcommits.org/
 * @see https://commitlint.js.org/
 */

module.exports = {
  extends: ["@commitlint/config-conventional"],

  rules: {
    // Type must be one of these
    "type-enum": [
      2,
      "always",
      [
        "feat", // New feature
        "fix", // Bug fix
        "docs", // Documentation
        "style", // Code style
        "refactor", // Code refactoring
        "perf", // Performance improvement
        "test", // Testing
        "build", // Build system
        "ci", // CI/CD
        "chore", // Maintenance
        "revert", // Revert commit
      ],
    ],

    // Subject must not be empty
    "subject-empty": [2, "never"],

    // Subject must not end with a period
    "subject-full-stop": [2, "never", "."],

    // Subject must be lowercase
    "subject-case": [2, "always", "lower-case"],

    // Type must be lowercase
    "type-case": [2, "always", "lower-case"],

    // Type must not be empty
    "type-empty": [2, "never"],

    // Scope must be lowercase (if provided)
    "scope-case": [2, "always", "lower-case"],

    // Header (type + scope + subject) max length
    "header-max-length": [2, "always", 100],

    // Body max line length
    "body-max-line-length": [2, "always", 100],

    // Footer max line length
    "footer-max-line-length": [2, "always", 100],
  },
};


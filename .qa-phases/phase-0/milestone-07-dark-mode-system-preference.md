# Agent Role

Consider you are a ReactJS, TailwindCSS expert and open-source contributor.

# Milestone 7: Dark Mode System Preference Support

> **Status:** Complete
> **Priority:** Medium
> **Depends On:** M6 (work on `dev` after main is in sync)
> **Estimated Effort:** S (< 1 day)

---

## Objective

Add `prefers-color-scheme: dark` media query support to the token system so that dark mode activates automatically based on the user's OS setting, while preserving class-based `.dark` override capability.

---

## Context

Currently, dark mode in TinyBigUI works only via class-based switching: adding a `.dark` class to a parent element (e.g., `<html>`) switches all tokens to their dark values. The Storybook `withThemeByClassName` decorator uses this approach.

However, `README.md` claims "Automatic light/dark theme support based on system preferences" — which is false until this milestone is complete. Additionally, many consumers expect `prefers-color-scheme` to work out of the box without any JavaScript class toggling.

The fix is straightforward: add an `@media (prefers-color-scheme: dark)` block to `tokens.css` that mirrors the existing `.dark` color overrides. The class-based `.dark` selector should have higher specificity than the media query so manual overrides continue to work.

This milestone also includes updating Storybook to demonstrate the media query detection path, and updating the tokens README and root README to accurately describe both mechanisms.

---

## Tasks

### Phase 1 — Understand Current Token Structure

- [ ] **7.1 — Audit `tokens.css` dark mode section**
  - File: `packages/tokens/src/tokens.css`
  - Locate the `.dark { ... }` block and document every CSS variable it overrides
  - Confirm there is currently no `@media (prefers-color-scheme: dark)` block

- [ ] **7.2 — Understand specificity requirements**
  - The precedence rule: explicit `.dark` class should beat the `@media` query
  - In CSS, a class selector (`.dark`) has higher specificity than a media query applied to `:root`, so the ordering is:
    1. `:root` — light tokens (default)
    2. `@media (prefers-color-scheme: dark) { :root }` — OS dark mode
    3. `.dark` — explicit class override (wins in all cases)
  - Verify this is how the project structure already works with `:root` and `.dark`

### Phase 2 — Implement the Media Query

- [ ] **7.3 — Add `@media (prefers-color-scheme: dark)` block to `tokens.css`**
  - File: `packages/tokens/src/tokens.css`
  - Add immediately after the `.dark { ... }` block (order matters for specificity):

    ```css
    @media (prefers-color-scheme: dark) {
      :root:not(.light) {
        /* same variable overrides as .dark block */
      }
    }
    ```

  - Use `:root:not(.light)` to allow a `.light` class to force light mode even when OS is dark
  - This is the standard modern approach (used by Tailwind, shadcn/ui, etc.)
  - Copy all color variable overrides from the `.dark` block into this new block

- [ ] **7.4 — Verify the precedence order**
  - Test in a browser: with no class on `<html>`, dark OS setting should activate dark tokens
  - Test: `.dark` class should force dark even with light OS setting
  - Test: `.light` class should force light even with dark OS setting
  - Test: no class + light OS = light tokens

### Phase 3 — Storybook Integration

- [ ] **7.5 — Verify Storybook dark mode toggle still works**
  - File: `packages/react/.storybook/preview.tsx`
  - Storybook uses `withThemeByClassName` toggling `dark` class — this should still work
  - Open Storybook and use the dark mode toggle — confirm components switch correctly

- [ ] **7.6 — Consider adding a "system preference" option to Storybook (optional)**
  - If the project wants to let contributors preview system-preference-based dark mode in Storybook, a custom decorator can read `prefers-color-scheme` and pass it to the iframe
  - This is optional and low priority for v0.1.0; note it as a future improvement if not implementing now

### Phase 4 — Documentation Update

- [ ] **7.7 — Update `packages/tokens/README.md` dark mode section**
  - Document all three dark mode mechanisms:
    1. OS/system preference via `@media (prefers-color-scheme: dark)` — automatic
    2. Explicit dark: add `.dark` class to `<html>` or a container
    3. Force light: add `.light` class to override OS preference
  - Include a code example for each mechanism

- [ ] **7.8 — Update root `README.md`**
  - The claim "Automatic light/dark theme support based on system preferences" is now accurate
  - Optionally add a brief note about the three dark mode mechanisms in the features list

- [ ] **7.9 — Run quality gate**
  - `pnpm lint` — zero errors
  - `pnpm typecheck` — zero errors
  - `pnpm test` — all tests green
  - `pnpm build` — both packages succeed (tokens dist updated)

---

## Acceptance Criteria

- [ ] `tokens.css` contains an `@media (prefers-color-scheme: dark)` block with all dark color overrides
- [ ] OS dark mode activates dark tokens without any class on `<html>`
- [ ] Adding `.dark` class forces dark mode regardless of OS setting
- [ ] Adding `.light` class forces light mode regardless of OS setting
- [ ] `.dark` class overrides `prefers-color-scheme` (class wins)
- [ ] Storybook dark mode toggle continues to work correctly
- [ ] `packages/tokens/README.md` accurately documents all three dark mode mechanisms
- [ ] `pnpm build` succeeds (updated `tokens.css` builds to dist)

---

## CSS Implementation Pattern

```css
/* packages/tokens/src/tokens.css */

:root {
  /* Light mode tokens (default) */
  --md-sys-color-primary: /* light value */;
  /* ... all light tokens ... */
}

/* Class-based explicit dark mode (highest priority) */
.dark {
  --md-sys-color-primary: /* dark value */;
  /* ... all dark tokens ... */
}

/* System/OS dark mode preference (activated when no .light class) */
@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    --md-sys-color-primary: /* dark value */;
    /* ... all dark tokens (same as .dark block) ... */
  }
}
```

---

## Files to Change

| File                             | Change                                          |
| -------------------------------- | ----------------------------------------------- |
| `packages/tokens/src/tokens.css` | Add `@media (prefers-color-scheme: dark)` block |
| `packages/tokens/README.md`      | Document all three dark mode mechanisms         |
| `README.md`                      | Confirm/update dark mode feature claim          |

## Files to Read First

| File                                    | Why                                                        |
| --------------------------------------- | ---------------------------------------------------------- |
| `packages/tokens/src/tokens.css`        | Current token file — understand `.dark` block to mirror it |
| `packages/react/.storybook/preview.tsx` | Understand how Storybook currently toggles dark mode       |

---

## Cursor Rules Reference

- [`tailwind-v4.mdc`](.cursor/rules/tailwind-v4.mdc): CSS-first configuration — all token changes go in `tokens.css` using `@theme` and native CSS; no `tailwind.config.js`
- [`code-style.mdc`](.cursor/rules/code-style.mdc): No inline styles — all theming via CSS variables and classes, never inline JS styles
- [`md3-design.mdc`](.cursor/rules/md3-design.mdc): MD3 token names must be used — all color roles must use `--md-sys-color-*` namespace

---

## Notes

- The `:root:not(.light)` pattern is preferred over simply `@media (prefers-color-scheme: dark) { :root }` because it allows the `.light` class to explicitly opt out of system dark mode — a standard user preference override mechanism
- All color tokens in the `.dark` block must be duplicated into the media query block. There is no CSS shorthand for "apply the same variables" — duplication is necessary and acceptable here
- Typography, elevation, shape, and motion tokens do NOT change between light and dark mode — only color tokens need the media query override
- After M7, update `README.md` task 5.6 (if M5 was completed with the conservative wording) to reflect that system preference dark mode is now supported
- Branch name suggestion: `feat/dark-mode-system-preference`
- Commit message: `feat(tokens): add prefers-color-scheme dark mode support`

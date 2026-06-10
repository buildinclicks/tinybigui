---
"@tinybigui/react": minor
---

refactor(split-button): MD3 Expressive architecture, new variant + 5-size scale

**BREAKING CHANGES**

- `SplitButtonSize` values renamed to match the MD3 Expressive size scale:
  - `"small"` → `"xs"` (32dp)
  - `"medium"` → `"sm"` (40dp, new default)
  - `"large"` → `"md"` (56dp)
  - New: `"lg"` (96dp) and `"xl"` (136dp)
- CVA export `splitButtonPrimaryVariants` renamed to `splitButtonLeadingVariants`.
- CVA export `splitButtonDropdownVariants` renamed to `splitButtonTrailingVariants`.
- Type `SplitButtonPrimaryVariants` renamed to `SplitButtonLeadingVariants`.
- Type `SplitButtonDropdownVariants` renamed to `SplitButtonTrailingVariants`.

**New features**

- `variant="elevated"` added — `bg-surface-container-low` with `shadow-elevation-1` base, matching the Button elevated variant.
- New CVA slot exports: `splitButtonStateLayerVariants`, `splitButtonFocusRingVariants`, `splitButtonLabelVariants`, `splitButtonIconVariants`, `splitButtonMenuVariants`, `splitButtonMenuItemVariants`.

**Architecture improvements**

- Variants-vs-States: all interaction states now use React Aria `useHover` / `useFocusRing` / `onPressStart`/`onPressEnd` → `data-*` attributes → `group-data-[x]/sb-leading` and `group-data-[x]/sb-trailing` Tailwind selectors. No interaction state logic lives in CVA.
- Per-segment state layers (hover 8%, focus 10%, pressed 10%) and dedicated focus-ring spans, matching the Button component architecture.
- MD3 Expressive inner-corner shape morphing: leading-right / trailing-left corners animate on hover/focus/press via a `--sb-inner-radius` CSS variable.
- 2dp `gap-0.5` gap replaces the `border-l` visual divider.
- Trailing segment receives `data-selected` when the dropdown menu is open.
- `useReducedMotion` guard on all JS-driven chevron rotation and shape transitions.
- Motion: `duration-expressive-fast-spatial` / `ease-expressive-fast-spatial` for border-radius; `duration-spring-standard-fast-effects` / `ease-spring-standard-fast-effects` for opacity and shadow.

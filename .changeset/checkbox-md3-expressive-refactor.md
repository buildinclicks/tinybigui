---
"@tinybigui/react": patch
---

refactor(checkbox): migrate to MD3 Variants-vs-States architecture

Rewrites Checkbox styling to match the slot-based CVA pattern used by Switch:

- All interaction/selection states (hover, focus-visible, pressed, selected, disabled, invalid, indeterminate) are now expressed as `data-*` attributes on the root element via `getInteractionDataAttributes`, consumed by `group-data-[x]/checkbox` Tailwind selectors in each slot — no state variants or state compoundVariants in CVA.
- Replaces the `animate-pulse` SVG focus ring with a proper MD3 focus-ring slot (outline, opacity transition via `*-spring-standard-fast-effects`).
- Replaces hardcoded `duration-200` with MD3 motion token pairs: effects transitions use `*-spring-standard-fast-effects`, spatial transitions use `*-spring-standard-fast-spatial`.
- State-layer opacities corrected to MD3 spec: hover 8% (`opacity-8`), focus/pressed 10% (`opacity-10`).
- Box visual now uses a `div` with `border-2 rounded-[2px]` + inline SVG icons, matching the Switch div-slot pattern.
- Invalid and disabled color cascades use doubly-chained `group-data` selectors for correct CSS specificity ordering.
- Exports updated to new slot variant names (`checkboxRootVariants`, `checkboxControlVariants`, `checkboxStateLayerVariants`, `checkboxFocusRingVariants`, `checkboxBoxVariants`, `checkboxIconVariants`, `checkboxLabelVariants`).

No behavioral or API changes — `CheckboxProps` and React Aria integration are unchanged.

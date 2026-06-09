---
"@tinybigui/react": minor
---

**chip: MD3 Expressive refactor — slot-based architecture, token corrections, new elevated support**

### Architecture

The Chip component has been rewritten to follow the same slot-based "Variants vs States"
architecture used by `Button` and `Switch`:

- All interaction/selection states are now driven by `data-*` attributes set via
  `getInteractionDataAttributes` and consumed by each slot via `group-data-[x]/chip`
  Tailwind selectors — no state values in CVA variants.
- `useHover`, `useFocusRing`, and `isPressed` (via press lifecycle callbacks) are now
  tracked in `Chip.tsx` and threaded to `ChipHeadless` via `bodyPassthrough` and
  `removePassthrough`.
- Dedicated focus ring slot (`chipFocusRingVariants`) rendered outside `overflow-hidden`
  so it extends 3px beyond the chip boundary and is never clipped.
- Remove button gets its own `group/chip-remove` scope with an independent circular
  state layer (`chipRemoveStateLayerVariants`).
- Spring motion tokens throughout: `ease-spring-standard-fast-effects` for
  color/opacity/shadow; `ease-spring-standard-fast-spatial` for the filter checkmark
  width animation.

### MD3 Token Corrections

Per-type color tokens now match the MD3 Expressive spec exactly:

| Type                  | Container             | Border            | Label                    | Leading icon             |
| --------------------- | --------------------- | ----------------- | ------------------------ | ------------------------ |
| `assist`              | transparent           | `outline`         | `on-surface`             | **`primary`**            |
| `filter` (unselected) | transparent           | `outline`         | `on-surface-variant`     | `on-surface-variant`     |
| `filter` (selected)   | `secondary-container` | none              | `on-secondary-container` | `on-secondary-container` |
| `input`               | transparent           | `outline-variant` | `on-surface-variant`     | `on-surface-variant`     |
| `suggestion`          | transparent           | `outline`         | `on-surface-variant`     | `on-surface-variant`     |

### New Features

- **Elevated surface for all chip types** — `surface="elevated"` now works on `filter`
  and `input` chips in addition to `assist` and `suggestion`.

### Breaking Changes (pre-1.0 minor)

- **`surface` default changed from `"tonal"` to `"flat"`**. If you relied on the
  default, add `surface="elevated"` explicitly if you want the elevated style, or
  omit `surface` / use `surface="flat"` for the MD3 default transparent outlined style.
- **`surface="tonal"` is deprecated.** It maps to `"flat"` internally and emits a
  `console.warn` in non-production environments. Migrate: replace `surface="tonal"` with
  `surface="flat"` (or simply omit `surface`).

### New Exports

```ts
// Slot variant functions
(chipStateLayerVariants,
  chipFocusRingVariants,
  chipLeadingIconVariants,
  chipTrailingIconVariants,
  chipCheckmarkVariants,
  chipCheckmarkIconVariants,
  chipLabelVariants,
  chipRemoveButtonVariants,
  chipRemoveStateLayerVariants);

// Variant prop types
(ChipStateLayerVariants, ChipLeadingIconVariants);

// Passthrough prop types (for advanced headless usage)
(ChipBodyPassthroughProps, ChipRemovePassthroughProps);
```

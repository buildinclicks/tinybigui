---
"@tinybigui/react": minor
---

**Menu**: fix MD3 Expressive segmented vertical menu rendering

The vertical (`menuStyle="vertical"`) menu now correctly renders as the MD3 Expressive segmented model: groups of items form distinct rounded cards (16dp outer corners, 4dp inner corners) separated by transparent `MenuGap` spacers that reveal the page background — acting as visual dividers without a line.

### Changes

- **Segmented corner rounding fixed** — uses adjacent-sibling CSS selectors relative to `[data-menu-gap]` elements (`[[data-menu-gap]+&]:rounded-t-lg`, `[&:has(+[data-menu-gap])]:rounded-b-lg`) so the top/bottom corners of each segment group are correctly rounded at 16dp while middle items use 4dp inner corners.
- **Full-bleed highlight and state layer** — both slots are now `inset-0 rounded-[inherit]` so they always fill the item and respect whichever corner radius the item currently has.
- **New focus-ring slot** — a dedicated `z-[2]` overlay with `outline-secondary` and `-outline-offset-2` renders the keyboard-focus indicator separately from the state layer, matching the MD3 Expressive reference state grid.
- **Exact color token mapping applied**:
  - Standard: item bg `surface-container-low`; selected/active highlight `tertiary-container`; content `on-tertiary-container`
  - Vibrant: item bg `tertiary-container`; selected/active highlight `tertiary`; content `on-tertiary`
- **Scheme-aware text colors** — trailing text, description (supporting text), and section headers now receive `colorScheme` from context and use the correct token (`on-surface-variant` / `on-tertiary-container`).
- **Icon size corrected** — vertical leading icons use 20dp (`h-5 w-5`) per `SegmentedMenuTokens.ItemLeadingIconSize`.
- **Vertical item height corrected** — density 0 → 48dp (`h-12`), -1 → 44dp (`h-11`), -2 → 40dp (`h-10`), -3 → 36dp (`h-9`).
- **`menuItemFocusRingVariants` exported** from `@tinybigui/react` for advanced consumers.
- **Storybook** — Expressive Vertical Menu story shows standard + vibrant side-by-side with a selected item; new _States_ story covers all 6 MD3 interaction states; new _Reference Example_ story matches the MD3 anatomy two-segment layout.

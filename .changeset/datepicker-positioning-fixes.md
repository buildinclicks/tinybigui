---
"@tinybigui/react": patch
---

fix(date-picker): popover anchoring, grid centering, and modal/scrim positioning

- **Popover anchor**: `usePopover` now anchors to the `[data-field-group]` element
  (the full outlined field) instead of the calendar icon button, so the calendar
  popover opens directly below the date field as per MD3 spec.

- **Calendar grid centering**: Added `[&_table]:mx-auto` to `CALENDAR_GRID_STRUCTURAL`
  so the fixed-width 336px grid is equally inset within the 360px container.

- **Modal/scrim positioning fix**: `className` is now applied directly on
  `[data-modal-dialog]` using `modalDialogVariants` (providing `fixed` centering
  immediately), and `scrimClassName` is applied directly on `[data-scrim]` via a
  new headless prop. Previously both used descendant selectors that never matched —
  the dialog rendered in-flow and the scrim was invisible.

- **New internal exports**: `MODAL_CONTENT_STRUCTURAL`, `MODAL_INPUT_CONTENT_STRUCTURAL`,
  `MODAL_DIALOG_MOTION` in `datePickerStructuralStyles.ts`.

- **Story polish**: Raised `iframeHeight` to 720 and `min-h` to 600px so open
  docked/modal stories are never clipped in Storybook autodocs.

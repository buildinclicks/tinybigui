---
"@tinybigui/react": minor
---

Refactor DatePicker to MD3 Expressive two-axis slot architecture

**Breaking changes:**

- Removed `cellType` and `state` CVA variant axes from `calendarCellVariants` and `yearItemVariants`. These were dead code and violated the component-variants rule by putting runtime interaction states in CVA. All cell states (today, selected, range-start, range-end, range-middle, outside-month, disabled, unavailable) are now driven by presence-based `data-*` attributes on the element and consumed by `group-data-[x]` selectors.
- Removed old exported variant names: `datePickerHeaderVariants`, `datePickerNavVariants`, `datePickerDividerVariants`, `datePickerActionVariants`, `datePickerActionButtonVariants`, `datePickerWeekdayVariants`, `datePickerRangeIndicatorVariants`, `datePickerHeadlineVariants`, `datePickerSupportingTextVariants`, `datePickerScrimVariants`.
- Removed `CalendarCellProps.cellType` prop (the semantic `CalendarCellType` type is retained for documentation).

**New exports:**

Layer-3 styled slot components (injectable into the headless layer):

- `StyledCalendarCell`, `StyledNavButton`, `StyledCalendarTitle`, `StyledYearItem`, `StyledWeekday`, `StyledActionButton`

New CVA slot variants following the two-axis model:

- `calendarCellVariants` + `calendarCellStateLayerVariants` + `calendarCellFocusRingVariants`
- `navButtonVariants` + `navButtonStateLayerVariants` + `navButtonFocusRingVariants`
- `calendarTitleVariants` + `calendarTitleStateLayerVariants`
- `yearItemVariants` + `yearItemStateLayerVariants` + `yearItemFocusRingVariants`
- `weekdayVariants`, `calendarDividerVariants`, `actionRowVariants`
- `actionButtonVariants` + `actionButtonStateLayerVariants` + `actionButtonFocusRingVariants`
- `modalDialogVariants`, `modalHeaderVariants`, `headlineVariants`, `supportingTextVariants`
- `modeToggleVariants` + `modeToggleStateLayerVariants`
- `scrimVariants`, `dateInputFieldVariants`, `dateInputFieldGroupVariants`
- `dockedFieldGroupVariants`, `dockedTriggerVariants` + `dockedTriggerStateLayerVariants`
- `popoverVariants`

New slot injection API — `CalendarCore` now accepts a `slots` prop:

- `slots.CellComponent` — styled calendar date cell
- `slots.NavButtonComponent` — styled prev/next month nav button
- `slots.TitleComponent` — styled month/year title pill
- `slots.YearItemComponent` — styled year selection item
- `slots.WeekdayComponent` — styled weekday header label

`DatePickerActions` accepts a `ButtonComponent` slot for styled action buttons.

**Architecture:**

Replaces three large duplicated `[&_[data-x]]:` descendant-selector blobs in the `*Styled.tsx` wrappers with injected styled slot components. Only purely structural, non-interactive layout wrappers (popover panel, modal dialog, field group, action row container, header row, year grid container) retain a minimal consolidated structural selector string — acceptable for non-interaction-state layout. Motion remains `useReducedMotion`-gated; screen-level container transitions use legacy standard tokens; small interactive elements (`< 48dp`) use spring-standard-fast tokens.

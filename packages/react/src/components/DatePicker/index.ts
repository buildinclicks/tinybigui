// Layer 3 — MD3 Styled Components
export { DatePicker } from "./DatePicker";

// Layer 2 — Headless Primitives
export { DatePickerDocked } from "./DatePickerDocked";
export { DatePickerModal } from "./DatePickerModal";
export { DatePickerModalInput } from "./DatePickerModalInput";
export { CalendarCore } from "./CalendarCore";
export { DateField } from "./DateField";

// Layer 3 — Styled Slot Components (injectable into headless layer)
export { StyledCalendarCell } from "./StyledCalendarCell";
export { StyledNavButton, StyledCalendarTitle } from "./StyledCalendarHeader";
export { StyledYearItem } from "./StyledYearItem";
export { StyledWeekday } from "./StyledWeekday";
export { StyledActionButton } from "./StyledActionButton";

// CVA Variants — two-axis slot model (structure only; no interaction state variants)
export {
  // Container
  datePickerContainerVariants,
  // Calendar cell slots
  calendarCellVariants,
  calendarCellStateLayerVariants,
  calendarCellFocusRingVariants,
  // Calendar header
  calendarHeaderVariants,
  // Nav button slots
  navButtonVariants,
  navButtonStateLayerVariants,
  navButtonFocusRingVariants,
  // Calendar title slots
  calendarTitleVariants,
  calendarTitleTextVariants,
  calendarTitleIconVariants,
  calendarTitleStateLayerVariants,
  // Year grid
  yearGridVariants,
  // Year item slots
  yearItemVariants,
  yearItemStateLayerVariants,
  yearItemFocusRingVariants,
  // Weekday labels
  weekdayVariants,
  // Calendar divider (named calendarDividerVariants to avoid conflict with Divider component)
  calendarDividerVariants,
  // Action row + button slots
  actionRowVariants,
  actionButtonVariants,
  actionButtonStateLayerVariants,
  actionButtonFocusRingVariants,
  // Modal structure
  modalDialogVariants,
  modalHeaderVariants,
  headlineVariants,
  supportingTextVariants,
  modeToggleVariants,
  modeToggleStateLayerVariants,
  scrimVariants,
  // Date input field (modal-input)
  dateInputFieldVariants,
  dateInputFieldGroupVariants,
  dateInputLabelVariants,
  dateInputErrorVariants,
  // Docked primitives
  dockedFieldGroupVariants,
  dockedTriggerVariants,
  dockedTriggerStateLayerVariants,
  dockedLabelVariants,
  dateFieldVariants,
  dateSegmentPlaceholderVariants,
  popoverVariants,
} from "./DatePicker.variants";

// Types
export type {
  CalendarCellType,
  DatePickerVariant,
  DateSelectionMode,
  CalendarView,
  DatePickerHeadlessProps,
  DatePickerProps,
  CalendarGridProps,
  CalendarCellProps,
  DatePickerRenderState,
  DatePickerDockedProps,
  DatePickerModalProps,
  DatePickerModalInputProps,
  DateFieldProps,
  DatePickerActionsProps,
  RangeCalendarProps,
  DateInputFieldProps,
  DatePickerModalHeaderProps,
  DatePickerCalendarSlots,
} from "./DatePicker.types";

// CVA Variant Types
export type {
  DatePickerContainerVariants,
  CalendarCellVariants,
  CalendarCellStateLayerVariants,
  CalendarCellFocusRingVariants,
  CalendarHeaderVariants,
  NavButtonVariants,
  NavButtonStateLayerVariants,
  NavButtonFocusRingVariants,
  CalendarTitleVariants,
  CalendarTitleTextVariants,
  CalendarTitleIconVariants,
  CalendarTitleStateLayerVariants,
  YearGridVariants,
  YearItemVariants,
  YearItemStateLayerVariants,
  YearItemFocusRingVariants,
  WeekdayVariants,
  CalendarDividerVariants,
  ActionRowVariants,
  ActionButtonVariants,
  ActionButtonStateLayerVariants,
  ActionButtonFocusRingVariants,
  ModalDialogVariants,
  ModalHeaderVariants,
  HeadlineVariants,
  SupportingTextVariants,
  ModeToggleVariants,
  ModeToggleStateLayerVariants,
  ScrimVariants,
  DateInputFieldVariants,
  DateInputFieldGroupVariants,
  DateInputLabelVariants,
  DateInputErrorVariants,
  DockedFieldGroupVariants,
  DockedTriggerVariants,
  DockedTriggerStateLayerVariants,
  DockedLabelVariants,
  DateFieldVariants,
  DateSegmentPlaceholderVariants,
  PopoverVariants,
} from "./DatePicker.variants";

// CalendarCore slot types
export type { CalendarSlots, CalendarCoreProps, YearItemComponentProps } from "./CalendarCore";
export type { CalendarCellComponentProps } from "./CalendarGrid";
export type { NavButtonComponentProps, TitleComponentProps } from "./CalendarHeader";
export type { ActionButtonSlotProps } from "./DatePickerActions";

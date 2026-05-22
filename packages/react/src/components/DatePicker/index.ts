// Layer 3 — MD3 Styled Components
export { DatePicker } from "./DatePicker";

// Layer 2 — Headless Primitives
export { DatePickerDocked } from "./DatePickerDocked";
export { DatePickerModal } from "./DatePickerModal";
export { DatePickerModalInput } from "./DatePickerModalInput";
export { CalendarCore } from "./CalendarCore";
export { DateField } from "./DateField";

// CVA Variants
export {
  datePickerContainerVariants,
  calendarCellVariants,
  datePickerHeaderVariants,
  datePickerNavVariants,
  yearItemVariants,
  datePickerDividerVariants,
  datePickerActionVariants,
  datePickerActionButtonVariants,
  datePickerWeekdayVariants,
  datePickerRangeIndicatorVariants,
  datePickerHeadlineVariants,
  datePickerSupportingTextVariants,
  datePickerScrimVariants,
} from "./DatePicker.variants";

// Types
export type {
  DatePickerVariant,
  DateSelectionMode,
  CalendarView,
  CalendarCellType,
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
} from "./DatePicker.types";

// CVA Variant Types
export type {
  DatePickerContainerVariants,
  CalendarCellVariants,
  DatePickerHeaderVariants,
  DatePickerNavVariants,
  YearItemVariants,
  DatePickerDividerVariants,
  DatePickerActionVariants,
  DatePickerActionButtonVariants,
  DatePickerWeekdayVariants,
  DatePickerRangeIndicatorVariants,
  DatePickerHeadlineVariants,
  DatePickerSupportingTextVariants,
  DatePickerScrimVariants,
} from "./DatePicker.variants";

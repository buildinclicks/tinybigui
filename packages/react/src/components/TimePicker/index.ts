// Layer 3 — MD3 Styled Components
export { TimePicker } from "./TimePicker";

// Layer 2 — Headless Primitives
export { TimePickerDial } from "./TimePickerDial";
export { TimePickerInput } from "./TimePickerInput";

// CVA Variants
export {
  timePickerContainerVariants,
  clockDialContainerVariants,
  clockDialNumberVariants,
  clockHandCenterVariants,
  clockHandTrackVariants,
  clockHandHandleVariants,
  timeSelectorContainerVariants,
  periodSelectorContainerVariants,
  periodSelectorItemVariants,
  timeInputFieldVariants,
  timeSeparatorVariants,
  timePickerHeadlineVariants,
  timePickerActionRowVariants,
  timePickerActionButtonVariants,
  timePickerModeToggleVariants,
} from "./TimePicker.variants";

// Types
export type {
  TimePickerVariant,
  TimeFormat,
  TimePickerOrientation,
  TimePeriod,
  ClockSelectionMode,
  TimeValue,
  TimePickerHeadlessProps,
  TimePickerProps,
  TimePickerDialProps,
  TimePickerInputProps,
  ClockDialProps,
  ClockHandProps,
  PeriodSelectorProps,
  TimeSelectorProps,
  TimeInputFieldProps,
  TimePickerRenderState,
} from "./TimePicker.types";

// CVA Variant Types
export type {
  TimePickerContainerVariants,
  ClockDialContainerVariants,
  ClockDialNumberVariants,
  ClockHandCenterVariants,
  ClockHandTrackVariants,
  ClockHandHandleVariants,
  TimeSelectorContainerVariants,
  PeriodSelectorContainerVariants,
  PeriodSelectorItemVariants,
  TimeInputFieldVariants,
  TimeSeparatorVariants,
  TimePickerHeadlineVariants,
  TimePickerActionRowVariants,
  TimePickerActionButtonVariants,
  TimePickerModeToggleVariants,
} from "./TimePicker.variants";

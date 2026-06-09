import type React from "react";
import type { CalendarDate, DateValue } from "@internationalized/date";

// ─── Date Picker Variant ─────────────────────────────────────────────────────

/**
 * Variant of the MD3 Date Picker.
 *
 * - `docked` — Opens inline from an onscreen text field trigger (forms, inline selection)
 * - `modal` — Full overlay dialog over content (focused date selection, range selection)
 * - `modal-input` — Manual keyboard entry of dates (compact layouts, known-date entry)
 *
 * @see https://m3.material.io/components/date-pickers/overview
 * @default 'docked'
 */
export type DatePickerVariant = "docked" | "modal" | "modal-input";

// ─── Date Selection Mode ─────────────────────────────────────────────────────

/**
 * Mode of date selection.
 *
 * - `single` — Select one date
 * - `range` — Select a start and end date with highlighted range
 *
 * @default 'single'
 */
export type DateSelectionMode = "single" | "range";

// ─── Calendar View ───────────────────────────────────────────────────────────

/**
 * Current view of the calendar navigation.
 *
 * - `day` — Calendar grid showing days of month
 * - `month` — List/menu of months
 * - `year` — Grid of years (scrollable)
 *
 * @default 'day'
 */
export type CalendarView = "day" | "month" | "year";

// ─── Calendar Cell State ─────────────────────────────────────────────────────

/**
 * Semantic state of a calendar date cell.
 * Used to describe which visual treatment applies; the actual styling is driven
 * by presence-based `data-*` attributes on the cell element, not by this type
 * as a CVA variant key.
 */
export type CalendarCellType =
  | "default"
  | "today"
  | "selected"
  | "selected-range-middle"
  | "outside-month"
  | "disabled";

// ─── Date Picker Headless Props ──────────────────────────────────────────────

/**
 * Props for the headless DatePickerHeadless primitive (Layer 2).
 *
 * Provides all date picker behavior and ARIA semantics without any visual styling.
 * Uses React Aria's `useDatePicker` / `useDateRangePicker` for accessibility.
 *
 * @example
 * ```tsx
 * // Single date selection
 * <DatePickerHeadless
 *   label="Departure date"
 *   onChange={(date) => console.log(date)}
 * />
 *
 * // Date range selection
 * <DatePickerHeadless
 *   selectionMode="range"
 *   label="Trip dates"
 *   onChange={(range) => console.log(range)}
 * />
 * ```
 */
export interface DatePickerHeadlessProps {
  /**
   * Date picker variant.
   * @default 'docked'
   */
  variant?: DatePickerVariant;

  /**
   * Selection mode for the date picker.
   * @default 'single'
   */
  selectionMode?: DateSelectionMode;

  /**
   * Controlled selected date value (single mode).
   */
  value?: DateValue | null;

  /**
   * Default selected date for uncontrolled usage (single mode).
   */
  defaultValue?: DateValue | null;

  /**
   * Controlled start and end date values (range mode).
   */
  rangeValue?: { start: DateValue; end: DateValue } | null;

  /**
   * Default range value for uncontrolled usage (range mode).
   */
  defaultRangeValue?: { start: DateValue; end: DateValue } | null;

  /**
   * Called when the selected date changes (single mode).
   */
  onChange?: (value: DateValue | null) => void;

  /**
   * Called when the selected range changes (range mode).
   */
  onRangeChange?: (value: { start: DateValue; end: DateValue } | null) => void;

  /**
   * Minimum selectable date.
   */
  minValue?: DateValue;

  /**
   * Maximum selectable date.
   */
  maxValue?: DateValue;

  /**
   * Function that returns whether a specific date is disabled/unavailable.
   *
   * @example
   * ```tsx
   * isDateUnavailable={(date) => isWeekend(date)}
   * ```
   */
  isDateUnavailable?: (date: DateValue) => boolean;

  /**
   * Visible label text for the date picker.
   */
  label?: string;

  /**
   * Accessible label (alternative to visible `label`).
   */
  "aria-label"?: string;

  /**
   * ID of an element that labels this date picker.
   */
  "aria-labelledby"?: string;

  /**
   * Whether the picker is disabled.
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Whether the picker is read-only.
   * @default false
   */
  isReadOnly?: boolean;

  /**
   * Whether the date field is required.
   * @default false
   */
  isRequired?: boolean;

  /**
   * Whether the picker is open (controlled).
   */
  isOpen?: boolean;

  /**
   * Default open state (uncontrolled).
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Called when the open state changes.
   */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * Placeholder date shown in the input field before selection.
   */
  placeholderValue?: DateValue;

  /**
   * Date granularity for input display.
   * @default 'day'
   */
  granularity?: "day" | "month" | "year";

  /**
   * Additional CSS classes applied to the root element.
   */
  className?: string;

  /**
   * Children rendered inside the picker (render prop pattern for styled layer).
   */
  children?: React.ReactNode;
}

// ─── Date Picker Props (Styled Layer) ────────────────────────────────────────

/**
 * Props for the MD3 Styled DatePicker component (Layer 3).
 *
 * @example
 * ```tsx
 * // Docked date picker with text field trigger
 * <DatePicker label="Start date" />
 *
 * // Modal date picker with range selection
 * <DatePicker variant="modal" selectionMode="range" label="Trip dates" />
 *
 * // Modal input for manual entry
 * <DatePicker variant="modal-input" label="Date of birth" />
 * ```
 */
export interface DatePickerProps extends DatePickerHeadlessProps {
  /**
   * Headline text displayed in modal variants.
   * @default 'Select date' (single) | 'Select dates' (range)
   */
  headline?: string;

  /**
   * Supporting text displayed below headline in modal variants.
   */
  supportingText?: string;

  /**
   * Text for the cancel action button.
   * @default 'Cancel'
   */
  cancelLabel?: string;

  /**
   * Text for the confirm action button.
   * @default 'OK'
   */
  confirmLabel?: string;

  /**
   * Text for the clear action button (modal only).
   * @default 'Clear'
   */
  clearLabel?: string;

  /**
   * Whether to show the clear button in modal variants.
   * @default false
   */
  showClear?: boolean;

  /**
   * Called when the cancel button is pressed.
   */
  onCancel?: () => void;

  /**
   * Called when the confirm button is pressed.
   */
  onConfirm?: (value: DateValue | { start: DateValue; end: DateValue } | null) => void;

  /**
   * Called when the clear button is pressed.
   */
  onClear?: () => void;

  /**
   * Additional CSS classes.
   */
  className?: string;
}

// ─── Calendar Grid Props ─────────────────────────────────────────────────────

/**
 * Props for the CalendarGrid sub-component (internal).
 *
 * @internal
 */
export interface CalendarGridProps {
  /**
   * The currently focused date in the calendar.
   */
  focusedDate?: DateValue;

  /**
   * The month being displayed.
   */
  visibleMonth?: DateValue;

  /**
   * The first day of the week (0 = Sunday, 1 = Monday, etc.).
   * @default locale-dependent
   */
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * Additional CSS classes for the grid container.
   */
  className?: string;
}

// ─── Calendar Cell Props ─────────────────────────────────────────────────────

/**
 * Props for an individual CalendarCell (internal sub-component).
 *
 * @internal
 */
export interface CalendarCellProps {
  /**
   * The date this cell represents.
   */
  date: DateValue;

  /**
   * Whether this cell is outside the currently displayed month.
   */
  isOutsideMonth?: boolean;

  /**
   * Additional CSS classes.
   */
  className?: string;
}

// ─── Date Field Props ────────────────────────────────────────────────────────

/**
 * Props for the DateField headless component (Layer 2).
 *
 * Provides segmented date input (MM/DD/YYYY) with individually
 * editable segments using React Aria's `useDateField` and `useDateSegment`.
 *
 * @example
 * ```tsx
 * <DateField
 *   label="Start date"
 *   value={new CalendarDate(2025, 8, 17)}
 *   onChange={(date) => console.log(date)}
 * />
 * ```
 */
export interface DateFieldProps {
  /** Controlled value */
  value?: DateValue | null;
  /** Default value for uncontrolled usage */
  defaultValue?: DateValue | null;
  /** Called when the value changes */
  onChange?: (value: DateValue | null) => void;
  /** Visible label text */
  label?: string;
  /** Accessible label */
  "aria-label"?: string;
  /** ID of labelling element */
  "aria-labelledby"?: string;
  /** Whether the field is disabled. @default false */
  isDisabled?: boolean;
  /** Whether the field is read-only. @default false */
  isReadOnly?: boolean;
  /** Whether the field is required. @default false */
  isRequired?: boolean;
  /** Minimum allowed date */
  minValue?: DateValue;
  /** Maximum allowed date */
  maxValue?: DateValue;
  /** Placeholder value */
  placeholderValue?: DateValue;
  /** Date granularity. @default 'day' */
  granularity?: "day" | "month" | "year";
  /** Additional CSS classes */
  className?: string;
}

// ─── Slot imports (forward-declared to avoid circular deps) ─────────────────

// These are imported by value in the actual slot files; here we only need the type.
/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyComponent = React.ComponentType<any>;
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Slots for injecting styled sub-components into CalendarCore.
 * Mirrors CalendarSlots from CalendarCore — duplicated here to avoid circular imports.
 */
export interface DatePickerCalendarSlots {
  CellComponent?: AnyComponent;
  NavButtonComponent?: AnyComponent;
  TitleComponent?: AnyComponent;
  YearItemComponent?: AnyComponent;
  WeekdayComponent?: AnyComponent;
}

// ─── Date Picker Docked Props ────────────────────────────────────────────────

/**
 * Props for the DatePickerDocked headless component (Layer 2).
 *
 * Provides the docked date picker behavior: a segmented date field trigger,
 * calendar icon toggle button, popover calendar, and action buttons.
 *
 * @example
 * ```tsx
 * <DatePickerDocked
 *   label="Departure date"
 *   onChange={(date) => console.log(date)}
 * />
 * ```
 */
export interface DatePickerDockedProps {
  /** Controlled selected date value */
  value?: DateValue | null;
  /** Default selected date for uncontrolled usage */
  defaultValue?: DateValue | null;
  /** Called when the selected date changes */
  onChange?: (value: DateValue | null) => void;
  /** Visible label text for the date picker */
  label?: string;
  /** Accessible label */
  "aria-label"?: string;
  /** ID of labelling element */
  "aria-labelledby"?: string;
  /** Whether the picker is disabled. @default false */
  isDisabled?: boolean;
  /** Whether the picker is read-only. @default false */
  isReadOnly?: boolean;
  /** Whether the field is required. @default false */
  isRequired?: boolean;
  /** Minimum selectable date */
  minValue?: DateValue;
  /** Maximum selectable date */
  maxValue?: DateValue;
  /** Whether a specific date is unavailable */
  isDateUnavailable?: (date: DateValue) => boolean;
  /** Placeholder date shown before selection */
  placeholderValue?: DateValue;
  /** Date granularity. @default 'day' */
  granularity?: "day" | "month" | "year";
  /** Whether the picker is open (controlled) */
  isOpen?: boolean;
  /** Default open state (uncontrolled). @default false */
  defaultOpen?: boolean;
  /** Called when the open state changes */
  onOpenChange?: (isOpen: boolean) => void;
  /** Text for the cancel action button. @default 'Cancel' */
  cancelLabel?: string;
  /** Text for the confirm action button. @default 'OK' */
  confirmLabel?: string;
  /** Called when the cancel button is pressed */
  onCancel?: () => void;
  /** Called when the confirm button is pressed */
  onConfirm?: (value: DateValue | null) => void;
  /** Additional CSS classes */
  className?: string;
  /**
   * Calendar slot component overrides (cells, nav buttons, year items, etc.).
   * Used by the styled layer to inject CVA + state-layer components.
   */
  slots?: DatePickerCalendarSlots;
  /**
   * Slot component for action buttons (Cancel / OK).
   * Used by the styled layer to inject CVA + state-layer styled buttons.
   */
  ActionButtonComponent?: AnyComponent;
}

// ─── Date Picker Modal Props ─────────────────────────────────────────────────

/**
 * Props for the DatePickerModal headless component (Layer 2).
 *
 * Provides full-overlay modal dialog behavior for date selection,
 * supporting both single-date and date-range modes.
 *
 * @example
 * ```tsx
 * // Single date modal
 * <DatePickerModal
 *   isOpen={open}
 *   onOpenChange={setOpen}
 *   onChange={(date) => console.log(date)}
 * />
 *
 * // Range selection modal
 * <DatePickerModal
 *   selectionMode="range"
 *   isOpen={open}
 *   onOpenChange={setOpen}
 *   onRangeChange={(range) => console.log(range)}
 * />
 * ```
 */
export interface DatePickerModalProps {
  /** Selection mode for the date picker. @default 'single' */
  selectionMode?: DateSelectionMode;
  /** Controlled selected date value (single mode) */
  value?: DateValue | null;
  /** Default selected date for uncontrolled usage (single mode) */
  defaultValue?: DateValue | null;
  /** Controlled start and end date values (range mode) */
  rangeValue?: { start: DateValue; end: DateValue } | null;
  /** Default range value for uncontrolled usage (range mode) */
  defaultRangeValue?: { start: DateValue; end: DateValue } | null;
  /** Called when the selected date changes (single mode) */
  onChange?: (value: DateValue | null) => void;
  /** Called when the selected range changes (range mode) */
  onRangeChange?: (value: { start: DateValue; end: DateValue } | null) => void;
  /** Minimum selectable date */
  minValue?: DateValue;
  /** Maximum selectable date */
  maxValue?: DateValue;
  /** Whether a specific date is unavailable */
  isDateUnavailable?: (date: DateValue) => boolean;
  /** Whether the modal is open (controlled) */
  isOpen?: boolean;
  /** Default open state (uncontrolled). @default false */
  defaultOpen?: boolean;
  /** Called when the open state changes */
  onOpenChange?: (isOpen: boolean) => void;
  /** Headline text displayed in modal header. @default 'Select date' (single) | 'Select dates' (range) */
  headline?: string;
  /** Supporting text displayed below headline */
  supportingText?: string;
  /** Text for the cancel action button. @default 'Cancel' */
  cancelLabel?: string;
  /** Text for the confirm action button. @default 'OK' */
  confirmLabel?: string;
  /** Text for the clear action button. @default 'Clear' */
  clearLabel?: string;
  /** Whether to show the clear button. @default true */
  showClear?: boolean;
  /** Called when the cancel button is pressed */
  onCancel?: () => void;
  /** Called when the confirm button is pressed */
  onConfirm?: (value: DateValue | { start: DateValue; end: DateValue } | null) => void;
  /** Called when the clear button is pressed */
  onClear?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Calendar slot component overrides. */
  slots?: DatePickerCalendarSlots;
  /** Slot component for action buttons. */
  ActionButtonComponent?: AnyComponent;
}

// ─── Date Picker Modal Header Props ──────────────────────────────────────────

/**
 * Props for the DatePickerModalHeader sub-component.
 *
 * Renders the modal header with headline, supporting text, and mode toggle.
 *
 * @internal
 */
export interface DatePickerModalHeaderProps {
  /** Headline text. @default 'Select date' */
  headline?: string;
  /** Supporting text (formatted selected date) */
  supportingText?: string;
  /** Current input mode. @default 'calendar' */
  inputMode?: "calendar" | "keyboard";
  /** Called when the mode toggle is pressed */
  onModeToggle?: () => void;
  /** ID for the headline element (used for aria-labelledby) */
  headlineId?: string;
  /** Additional CSS classes */
  className?: string;
}

// ─── Range Calendar Props ────────────────────────────────────────────────────

/**
 * Props for the RangeCalendar sub-component.
 *
 * Provides a scrollable multi-month calendar for date range selection.
 *
 * @internal
 */
export interface RangeCalendarProps {
  /** Controlled start and end dates */
  rangeValue?: { start: DateValue; end: DateValue } | null;
  /** Default range for uncontrolled usage */
  defaultRangeValue?: { start: DateValue; end: DateValue } | null;
  /** Called when the selected range changes */
  onRangeChange?: (value: { start: DateValue; end: DateValue }) => void;
  /** Minimum selectable date */
  minValue?: DateValue;
  /** Maximum selectable date */
  maxValue?: DateValue;
  /** Whether a specific date is unavailable */
  isDateUnavailable?: (date: DateValue) => boolean;
  /** Number of months to display in the scrollable view. @default 3 */
  visibleMonths?: number;
  /** Accessible label */
  "aria-label"?: string;
  /** Additional CSS classes */
  className?: string;
}

// ─── Date Picker Actions Props ───────────────────────────────────────────────

/**
 * Props for the DatePickerActions sub-component.
 *
 * Renders Cancel and OK text buttons for confirming or reverting selection.
 *
 * @internal
 */
export interface DatePickerActionsProps {
  /** Text for the cancel button. @default 'Cancel' */
  cancelLabel?: string;
  /** Text for the confirm button. @default 'OK' */
  confirmLabel?: string;
  /** Text for the clear button. @default 'Clear' */
  clearLabel?: string;
  /** Whether to show the clear button. @default false */
  showClear?: boolean;
  /** Whether the confirm button is disabled. @default false */
  isConfirmDisabled?: boolean;
  /** Called when cancel is pressed */
  onCancel?: () => void;
  /** Called when confirm is pressed */
  onConfirm?: () => void;
  /** Called when clear is pressed */
  onClear?: () => void;
  /** Additional CSS classes */
  className?: string;
}

// ─── Internal Render State ───────────────────────────────────────────────────

/**
 * Render state for the date picker passed to internal sub-components.
 *
 * @internal
 */
export interface DatePickerRenderState {
  /** Whether the picker is open */
  isOpen: boolean;
  /** Whether the picker is disabled */
  isDisabled: boolean;
  /** Current calendar view mode */
  calendarView: CalendarView;
  /** The currently selected date(s) */
  selectedDate: DateValue | null;
  /** The selected date range (range mode only) */
  selectedRange: { start: DateValue; end: DateValue } | null;
  /** Today's date for highlighting */
  today: CalendarDate;
  /** The month currently being displayed */
  visibleMonth: DateValue;
}

// ─── Date Input Field Props ─────────────────────────────────────────────────

/**
 * Props for the DateInputField headless component (Layer 2).
 *
 * An outlined text field for manual date entry with validation.
 * Wraps `useDateField` from React Aria for segmented date input behavior.
 *
 * @example
 * ```tsx
 * <DateInputField
 *   label="Date"
 *   placeholder="mm/dd/yyyy"
 *   onChange={(date) => console.log(date)}
 * />
 * ```
 *
 * @internal
 */
export interface DateInputFieldProps {
  /** Controlled value */
  value?: DateValue | null;
  /** Default value for uncontrolled usage */
  defaultValue?: DateValue | null;
  /** Called when the value changes */
  onChange?: (value: DateValue | null) => void;
  /** Visible label text */
  label?: string;
  /** Placeholder text. @default 'mm/dd/yyyy' */
  placeholder?: string;
  /** Accessible label */
  "aria-label"?: string;
  /** ID of labelling element */
  "aria-labelledby"?: string;
  /** Whether the field is disabled. @default false */
  isDisabled?: boolean;
  /** Whether the field is read-only. @default false */
  isReadOnly?: boolean;
  /** Whether the field is required. @default false */
  isRequired?: boolean;
  /** Minimum allowed date */
  minValue?: DateValue;
  /** Maximum allowed date */
  maxValue?: DateValue;
  /** Placeholder value for segments */
  placeholderValue?: DateValue;
  /** Date granularity. @default 'day' */
  granularity?: "day" | "month" | "year";
  /** Whether the field is in an invalid state */
  isInvalid?: boolean;
  /** Error message to display when invalid */
  errorMessage?: string | undefined;
  /** Whether the field should auto-focus on mount. @default false */
  autoFocus?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// ─── Date Picker Modal Input Props ──────────────────────────────────────────

/**
 * Props for the DatePickerModalInput headless component (Layer 2).
 *
 * Provides a modal dialog for manual keyboard entry of dates.
 * Supports single-date and range-date input modes with validation.
 *
 * @example
 * ```tsx
 * // Single date modal input
 * <DatePickerModalInput
 *   isOpen={open}
 *   onOpenChange={setOpen}
 *   onChange={(date) => console.log(date)}
 * />
 *
 * // Range date modal input
 * <DatePickerModalInput
 *   selectionMode="range"
 *   isOpen={open}
 *   onOpenChange={setOpen}
 *   onRangeChange={(range) => console.log(range)}
 * />
 * ```
 */
export interface DatePickerModalInputProps {
  /** Selection mode for the date picker. @default 'single' */
  selectionMode?: DateSelectionMode;
  /** Controlled selected date value (single mode) */
  value?: DateValue | null;
  /** Default selected date for uncontrolled usage (single mode) */
  defaultValue?: DateValue | null;
  /** Controlled start and end date values (range mode) */
  rangeValue?: { start: DateValue; end: DateValue } | null;
  /** Default range value for uncontrolled usage (range mode) */
  defaultRangeValue?: { start: DateValue; end: DateValue } | null;
  /** Called when the selected date changes (single mode) */
  onChange?: (value: DateValue | null) => void;
  /** Called when the selected range changes (range mode) */
  onRangeChange?: (value: { start: DateValue; end: DateValue } | null) => void;
  /** Minimum selectable date */
  minValue?: DateValue;
  /** Maximum selectable date */
  maxValue?: DateValue;
  /** Whether the modal is open (controlled) */
  isOpen?: boolean;
  /** Default open state (uncontrolled). @default false */
  defaultOpen?: boolean;
  /** Called when the open state changes */
  onOpenChange?: (isOpen: boolean) => void;
  /** Headline text displayed in modal header. @default 'Select date' (single) | 'Select dates' (range) */
  headline?: string;
  /** Supporting text. @default 'Enter date' (single) | 'Enter dates' (range) */
  supportingText?: string;
  /** Text for the cancel action button. @default 'Cancel' */
  cancelLabel?: string;
  /** Text for the confirm action button. @default 'OK' */
  confirmLabel?: string;
  /** Called when the cancel button is pressed */
  onCancel?: () => void;
  /** Called when the confirm button is pressed */
  onConfirm?: (value: DateValue | { start: DateValue; end: DateValue } | null) => void;
  /** Called when mode switches to calendar view */
  onModeToggle?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Slot component for action buttons. */
  ActionButtonComponent?: AnyComponent;
}

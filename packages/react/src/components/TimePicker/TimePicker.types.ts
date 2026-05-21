// ─── Time Picker Variant ─────────────────────────────────────────────────────

/**
 * Variant of the MD3 Time Picker.
 *
 * - `dial` — Circular clock face for selecting hours/minutes (touch-friendly)
 * - `input` — Text fields for manual time entry (accessibility-first)
 *
 * @see https://m3.material.io/components/time-pickers/overview
 * @default 'dial'
 */
export type TimePickerVariant = "dial" | "input";

// ─── Time Format ─────────────────────────────────────────────────────────────

/**
 * Time format for the picker.
 *
 * - `12` — 12-hour format with AM/PM period selector
 * - `24` — 24-hour format with extended dial (inner ring 13-24)
 *
 * @default locale-dependent
 */
export type TimeFormat = 12 | 24;

// ─── Time Picker Orientation ─────────────────────────────────────────────────

/**
 * Orientation of the Time Picker Dial layout.
 *
 * - `vertical` — Clock dial below time selector (default on mobile)
 * - `horizontal` — Clock dial beside time selector
 *
 * @default 'vertical'
 */
export type TimePickerOrientation = "vertical" | "horizontal";

// ─── Time Period ─────────────────────────────────────────────────────────────

/**
 * AM/PM period for 12-hour format.
 */
export type TimePeriod = "AM" | "PM";

// ─── Clock Selection Mode ────────────────────────────────────────────────────

/**
 * Current selection mode of the clock dial.
 *
 * - `hour` — User is selecting the hour
 * - `minute` — User is selecting the minute
 *
 * @default 'hour'
 */
export type ClockSelectionMode = "hour" | "minute";

// ─── Time Value ──────────────────────────────────────────────────────────────

/**
 * Represents a time value with hours and minutes.
 */
export interface TimeValue {
  /** Hours (0-23 for 24h, 1-12 for 12h display) */
  hour: number;
  /** Minutes (0-59) */
  minute: number;
}

// ─── Time Picker Headless Props ──────────────────────────────────────────────

/**
 * Props for the headless TimePickerHeadless primitive (Layer 2).
 *
 * Provides all time picker behavior and ARIA semantics without any visual styling.
 * Uses React Aria's `useTimeField` and custom spin button hooks for accessibility.
 *
 * @example
 * ```tsx
 * // 12-hour time picker
 * <TimePickerHeadless
 *   label="Alarm time"
 *   hourCycle={12}
 *   onChange={(time) => console.log(time)}
 * />
 *
 * // 24-hour time picker
 * <TimePickerHeadless
 *   label="Meeting time"
 *   hourCycle={24}
 *   defaultValue={{ hour: 14, minute: 30 }}
 * />
 * ```
 */
export interface TimePickerHeadlessProps {
  /**
   * Time picker variant.
   * @default 'dial'
   */
  variant?: TimePickerVariant;

  /**
   * Orientation for the dial variant.
   * @default 'vertical'
   */
  orientation?: TimePickerOrientation;

  /**
   * Hour cycle (12 or 24).
   * @default locale-dependent
   */
  hourCycle?: TimeFormat;

  /**
   * Controlled time value.
   */
  value?: TimeValue | null;

  /**
   * Default time value for uncontrolled usage.
   */
  defaultValue?: TimeValue | null;

  /**
   * Called when the time value changes.
   */
  onChange?: (value: TimeValue) => void;

  /**
   * Minimum selectable time.
   */
  minValue?: TimeValue;

  /**
   * Maximum selectable time.
   */
  maxValue?: TimeValue;

  /**
   * Minute increment step for the clock dial.
   * @default 1
   */
  minuteStep?: number;

  /**
   * Visible label for the time picker.
   */
  label?: string;

  /**
   * Accessible label (alternative to visible `label`).
   */
  "aria-label"?: string;

  /**
   * ID of an element that labels this time picker.
   */
  "aria-labelledby"?: string;

  /**
   * Whether the time picker is disabled.
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Whether the time picker is read-only.
   * @default false
   */
  isReadOnly?: boolean;

  /**
   * Whether the time field is required.
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
   * Additional CSS classes.
   */
  className?: string;

  /**
   * Children rendered inside the picker.
   */
  children?: React.ReactNode;
}

// ─── Time Picker Props (Styled Layer) ────────────────────────────────────────

/**
 * Props for the MD3 Styled TimePicker component (Layer 3).
 *
 * @example
 * ```tsx
 * // Dial time picker with 12-hour format
 * <TimePicker label="Set alarm" hourCycle={12} />
 *
 * // Input time picker with 24-hour format
 * <TimePicker variant="input" hourCycle={24} label="Meeting time" />
 *
 * // Horizontal layout
 * <TimePicker orientation="horizontal" label="Departure time" />
 * ```
 */
export interface TimePickerProps extends Omit<TimePickerHeadlessProps, "children"> {
  /**
   * Headline text displayed above the time picker.
   * @default 'Select time' (dial) | 'Enter time' (input)
   */
  headline?: string;

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
   * Called when the cancel button is pressed.
   */
  onCancel?: () => void;

  /**
   * Called when the confirm button is pressed.
   */
  onConfirm?: (value: TimeValue) => void;

  /**
   * Additional CSS classes.
   */
  className?: string;
}

// ─── Clock Dial Props ────────────────────────────────────────────────────────

/**
 * Props for the ClockDial sub-component (internal).
 *
 * @internal
 */
export interface ClockDialProps {
  /**
   * Current selection mode (hour or minute).
   */
  selectionMode: ClockSelectionMode;

  /**
   * Currently selected hour (0-23).
   */
  selectedHour: number;

  /**
   * Currently selected minute (0-59).
   */
  selectedMinute: number;

  /**
   * Hour cycle (12 or 24).
   */
  hourCycle: TimeFormat;

  /**
   * Minute step for snapping. @default 1
   */
  minuteStep?: number;

  /**
   * Called when a value is selected on the dial.
   */
  onSelect?: (value: number) => void;

  /**
   * Whether the dial is disabled. @default false
   */
  isDisabled?: boolean;

  /**
   * Additional CSS classes.
   */
  className?: string;
}

// ─── Clock Hand Props ────────────────────────────────────────────────────────

/**
 * Props for the ClockHand sub-component (internal).
 *
 * Renders the selector track (line from center), center dot, and handle circle.
 *
 * @internal
 */
export interface ClockHandProps {
  /**
   * Angle of the clock hand in degrees (0-360 from 12 o'clock).
   */
  angle: number;

  /**
   * Current selection mode.
   */
  mode: ClockSelectionMode;

  /**
   * Whether the hand points to the inner ring (24h mode, hours 0/13-23).
   * @default false
   */
  isInnerRing?: boolean;

  /**
   * Additional CSS classes.
   */
  className?: string;
}

// ─── Period Selector Props ───────────────────────────────────────────────────

/**
 * Props for the PeriodSelector sub-component (AM/PM toggle).
 *
 * @internal
 */
export interface PeriodSelectorProps {
  /**
   * Currently selected period.
   */
  value: TimePeriod;

  /**
   * Called when the period changes.
   */
  onChange: (period: TimePeriod) => void;

  /**
   * Layout orientation of the period selector.
   * @default 'vertical'
   */
  orientation?: "vertical" | "horizontal";

  /**
   * Whether the selector is disabled.
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Additional CSS classes.
   */
  className?: string;
}

// ─── Time Selector Props ─────────────────────────────────────────────────────

/**
 * Props for the TimeSelector sub-component (hour/minute display).
 *
 * @internal
 */
export interface TimeSelectorProps {
  /**
   * Current hour value displayed (0-23 internal).
   */
  hour: number;

  /**
   * Current minute value displayed (0-59).
   */
  minute: number;

  /**
   * Which field is currently selected/active.
   */
  activeField: ClockSelectionMode;

  /**
   * Called when user switches between hour and minute.
   */
  onFieldChange: (field: ClockSelectionMode) => void;

  /**
   * Called when the hour value changes via keyboard interaction.
   */
  onHourChange?: (hour: number) => void;

  /**
   * Called when the minute value changes via keyboard interaction.
   */
  onMinuteChange?: (minute: number) => void;

  /**
   * Hour cycle for display formatting.
   */
  hourCycle: TimeFormat;

  /**
   * Whether the selector is disabled. @default false
   */
  isDisabled?: boolean;

  /**
   * Additional CSS classes.
   */
  className?: string;
}

// ─── useClockDial Hook Types ─────────────────────────────────────────────────

/**
 * Options for the `useClockDial` custom hook.
 */
export interface UseClockDialOptions {
  /** Current selection mode ('hour' or 'minute'). */
  selectionMode: ClockSelectionMode;
  /** Hour cycle (12 or 24). */
  hourCycle: TimeFormat;
  /** Called when a value is selected on the dial. */
  onSelect?: (value: number) => void;
  /** Ref to the clock dial container element. */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Whether the dial interaction is disabled. @default false */
  isDisabled?: boolean;
  /** Minute step for snapping in minute mode. @default 1 */
  minuteStep?: number;
}

/**
 * Return value of the `useClockDial` custom hook.
 */
export interface UseClockDialReturn {
  /** Props to spread on the clock dial container. */
  dialProps: React.HTMLAttributes<HTMLDivElement>;
  /** Angle of the clock hand in degrees (0-360 from 12 o'clock). */
  handAngle: number;
  /** Whether the user is currently dragging. */
  isDragging: boolean;
  /** Whether selection is on inner ring (24h mode). */
  isInnerRing: boolean;
}

// ─── TimePickerDial Props ────────────────────────────────────────────────────

/**
 * Props for the TimePickerDial orchestrator component (Layer 2).
 *
 * Composes TimeSelector, PeriodSelector, ClockDial, ClockHand, and action buttons
 * into the full time picker dial experience.
 *
 * @example
 * ```tsx
 * <TimePickerDial
 *   hourCycle={12}
 *   defaultValue={{ hour: 7, minute: 0 }}
 *   onConfirm={(time) => console.log(time)}
 * />
 * ```
 */
export interface TimePickerDialProps {
  /** Hour cycle (12 or 24). @default 12 */
  hourCycle?: TimeFormat;
  /** Layout orientation. @default 'vertical' */
  orientation?: TimePickerOrientation;
  /** Controlled time value. */
  value?: TimeValue | null;
  /** Default time value for uncontrolled usage. */
  defaultValue?: TimeValue | null;
  /** Called when the time value changes. */
  onChange?: (value: TimeValue) => void;
  /** Minute increment step. @default 1 */
  minuteStep?: number;
  /** Whether the picker is disabled. @default false */
  isDisabled?: boolean;
  /** Headline text. @default 'Select time' */
  headline?: string;
  /** Text for the cancel action button. @default 'Cancel' */
  cancelLabel?: string;
  /** Text for the confirm action button. @default 'OK' */
  confirmLabel?: string;
  /** Called when the cancel button is pressed. */
  onCancel?: () => void;
  /** Called when the confirm button is pressed. */
  onConfirm?: (value: TimeValue) => void;
  /** Called when the mode toggle (to keyboard input) is pressed. */
  onModeToggle?: () => void;
  /** Additional CSS classes. */
  className?: string;
}

// ─── TimeInputField Props ────────────────────────────────────────────────────

/**
 * Props for the TimeInputField sub-component (individual spin button input).
 *
 * Provides a large numeric display with spin button semantics for entering
 * a single time value (hour or minute).
 *
 * @internal
 */
export interface TimeInputFieldProps {
  /** The field type — determines label and validation range. */
  field: "hour" | "minute";
  /** Current numeric value. */
  value: number;
  /** Called when value changes via keyboard input or arrow keys. */
  onChange: (value: number) => void;
  /** Called when the field is focused. */
  onFocus?: () => void;
  /** Called when the field loses focus. */
  onBlur?: () => void;
  /** Called when auto-advance should move focus to the next field. */
  onAutoAdvance?: () => void;
  /** Minimum valid value (0 or 1). */
  min: number;
  /** Maximum valid value (12, 23, or 59). */
  max: number;
  /** Whether the field is disabled. @default false */
  isDisabled?: boolean;
  /** Additional CSS classes. */
  className?: string;
}

// ─── TimePickerInput Props ───────────────────────────────────────────────────

/**
 * Props for the TimePickerInput orchestrator component (Layer 2).
 *
 * Composes TimeInputField (hour/minute), PeriodSelector, and action buttons
 * into the full time picker input (keyboard-entry) experience.
 *
 * @example
 * ```tsx
 * <TimePickerInput
 *   hourCycle={12}
 *   defaultValue={{ hour: 7, minute: 0 }}
 *   onConfirm={(time) => console.log(time)}
 * />
 * ```
 */
export interface TimePickerInputProps {
  /** Hour cycle (12 or 24). @default 12 */
  hourCycle?: TimeFormat;
  /** Controlled time value. */
  value?: TimeValue | null;
  /** Default time value for uncontrolled usage. */
  defaultValue?: TimeValue | null;
  /** Called when the time value changes. */
  onChange?: (value: TimeValue) => void;
  /** Whether the picker is disabled. @default false */
  isDisabled?: boolean;
  /** Headline text. @default 'Enter time' */
  headline?: string;
  /** Text for the cancel action button. @default 'Cancel' */
  cancelLabel?: string;
  /** Text for the confirm action button. @default 'OK' */
  confirmLabel?: string;
  /** Called when the cancel button is pressed. */
  onCancel?: () => void;
  /** Called when the confirm button is pressed. */
  onConfirm?: (value: TimeValue) => void;
  /** Called when the mode toggle (to clock dial) is pressed. */
  onModeToggle?: () => void;
  /** Additional CSS classes. */
  className?: string;
}

// ─── Internal Render State ───────────────────────────────────────────────────

/**
 * Render state for the time picker passed to internal sub-components.
 *
 * @internal
 */
export interface TimePickerRenderState {
  /** Whether the picker is open */
  isOpen: boolean;
  /** Whether the picker is disabled */
  isDisabled: boolean;
  /** Current variant */
  variant: TimePickerVariant;
  /** Current clock selection mode */
  clockMode: ClockSelectionMode;
  /** Selected time */
  selectedTime: TimeValue | null;
  /** Selected period (12h only) */
  period: TimePeriod;
  /** Hour cycle */
  hourCycle: TimeFormat;
}

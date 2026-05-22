"use client";

import { TimePickerDialStyled } from "./TimePickerDialStyled";
import { TimePickerInputStyled } from "./TimePickerInputStyled";

import type { TimePickerProps } from "./TimePicker.types";

/**
 * `TimePicker` — Layer 3 MD3 Styled Time Picker Component.
 *
 * Routes to the correct styled variant based on the `variant` prop:
 *
 * - **`dial`** (default): Circular clock face for selecting hours/minutes (touch-friendly).
 *   Uses `TimePickerDialStyled` wrapping `TimePickerDial` headless component.
 *
 * - **`input`**: Text fields for manual time entry (accessibility-first, keyboard-optimized).
 *   Uses `TimePickerInputStyled` wrapping `TimePickerInput` headless component.
 *
 * All variants follow MD3 specifications:
 * - `bg-surface-container-high` container background
 * - `rounded-3xl` (28dp) corner radius
 * - `p-6` (24dp) padding
 * - MD3 color tokens for all interactive states
 * - MD3 typography tokens (display-large, label-medium, title-medium, body-large)
 * - Spring-based standard motion tokens for state transitions
 *
 * @example
 * ```tsx
 * // Dial time picker (default, 12-hour)
 * <TimePicker label="Alarm time" hourCycle={12} onConfirm={setTime} />
 *
 * // Input time picker (24-hour)
 * <TimePicker variant="input" hourCycle={24} label="Meeting time" onConfirm={setTime} />
 *
 * // Horizontal layout
 * <TimePicker orientation="horizontal" label="Departure time" />
 * ```
 *
 * @see https://m3.material.io/components/time-pickers/overview
 */
export function TimePicker(props: TimePickerProps): JSX.Element {
  const { variant = "dial", ...rest } = props;

  switch (variant) {
    case "input":
      return <TimePickerInputStyled {...mapToInputProps(rest)} />;
    default:
      return <TimePickerDialStyled {...mapToDialProps(rest)} />;
  }
}

TimePicker.displayName = "TimePicker";

/**
 * Maps TimePickerProps (minus variant) to TimePickerDialProps.
 */
function mapToDialProps(props: Omit<TimePickerProps, "variant">): Omit<TimePickerProps, "variant"> {
  return props;
}

/**
 * Maps TimePickerProps (minus variant) to TimePickerInputProps.
 */
function mapToInputProps(
  props: Omit<TimePickerProps, "variant">
): Omit<TimePickerProps, "variant"> {
  const { orientation: _orientation, minuteStep: _minuteStep, ...inputProps } = props;

  return inputProps;
}

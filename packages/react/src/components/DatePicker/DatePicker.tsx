"use client";

import { forwardRef } from "react";

import { DatePickerDockedStyled } from "./DatePickerDockedStyled";
import { DatePickerModalStyled } from "./DatePickerModalStyled";
import { DatePickerModalInputStyled } from "./DatePickerModalInputStyled";

import type { DatePickerProps } from "./DatePicker.types";
import type {
  DatePickerDockedProps,
  DatePickerModalProps,
  DatePickerModalInputProps,
} from "./DatePicker.types";

/**
 * `DatePicker` — Layer 3 MD3 Styled Date Picker Component.
 *
 * Routes to the correct styled variant based on the `variant` prop:
 *
 * - **`docked`** (default): Inline picker with text field trigger and popover calendar.
 *   Uses `DatePickerDockedStyled` wrapping `DatePickerDocked` headless component.
 *
 * - **`modal`**: Full-screen overlay dialog with calendar selection.
 *   Supports single-date and date-range modes.
 *   Uses `DatePickerModalStyled` wrapping `DatePickerModal` headless component.
 *
 * - **`modal-input`**: Modal dialog with manual keyboard date entry.
 *   Supports single-date and date-range modes.
 *   Uses `DatePickerModalInputStyled` wrapping `DatePickerModalInput` headless component.
 *
 * All variants follow MD3 specifications:
 * - `bg-surface-container-high` container background
 * - `rounded-3xl` (28dp) corner radius
 * - MD3 color tokens for all interactive states
 * - MD3 typography tokens (headline-small, label-large, body-large, body-small)
 * - Spring-based standard motion tokens for state transitions
 *
 * @example
 * ```tsx
 * // Docked date picker (default)
 * <DatePicker label="Start date" onChange={setDate} />
 *
 * // Modal date picker
 * <DatePicker variant="modal" isOpen={open} onOpenChange={setOpen} onChange={setDate} />
 *
 * // Modal input date picker
 * <DatePicker variant="modal-input" isOpen={open} onOpenChange={setOpen} onChange={setDate} />
 *
 * // Range selection in modal
 * <DatePicker variant="modal" selectionMode="range" isOpen={open} onOpenChange={setOpen} onRangeChange={setRange} />
 * ```
 *
 * @see https://m3.material.io/components/date-pickers/overview
 */
export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>((props, ref) => {
  const { variant = "docked", ...rest } = props;

  switch (variant) {
    case "modal":
      return <DatePickerModalStyled ref={ref} {...mapToModalProps(rest)} />;
    case "modal-input":
      return <DatePickerModalInputStyled ref={ref} {...mapToModalInputProps(rest)} />;
    default:
      return <DatePickerDockedStyled ref={ref} {...mapToDockedProps(rest)} />;
  }
});

DatePicker.displayName = "DatePicker";

/**
 * Maps DatePickerProps (minus variant) to DatePickerDockedProps.
 */
function mapToDockedProps(props: Omit<DatePickerProps, "variant">): DatePickerDockedProps {
  const {
    selectionMode: _selectionMode,
    rangeValue: _rangeValue,
    defaultRangeValue: _defaultRangeValue,
    onRangeChange: _onRangeChange,
    headline: _headline,
    supportingText: _supportingText,
    clearLabel: _clearLabel,
    showClear: _showClear,
    onClear: _onClear,
    ...dockedProps
  } = props;

  return dockedProps;
}

/**
 * Maps DatePickerProps (minus variant) to DatePickerModalProps.
 */
function mapToModalProps(props: Omit<DatePickerProps, "variant">): DatePickerModalProps {
  return props;
}

/**
 * Maps DatePickerProps (minus variant) to DatePickerModalInputProps.
 */
function mapToModalInputProps(props: Omit<DatePickerProps, "variant">): DatePickerModalInputProps {
  const {
    showClear: _showClear,
    clearLabel: _clearLabel,
    onClear: _onClear,
    isDateUnavailable: _isDateUnavailable,
    ...modalInputProps
  } = props;

  return modalInputProps;
}

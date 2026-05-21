"use client";

import { forwardRef, useRef, useCallback, useEffect } from "react";
import {
  useDatePicker,
  useDateField,
  useDateSegment,
  useButton,
  useLocale,
  usePopover,
  DismissButton,
} from "react-aria";
import { useDatePickerState, useDateFieldState } from "react-stately";
import { createCalendar } from "@internationalized/date";

import { CalendarCore } from "./CalendarCore";
import { DatePickerActions } from "./DatePickerActions";

import type { DateSegment as DateSegmentType } from "react-stately";
import type { DateValue } from "@internationalized/date";
import type { DatePickerDockedProps } from "./DatePicker.types";

/**
 * Internal segment renderer for the date field inside the picker.
 * @internal
 */
function PickerDateSegment({
  segment,
  state,
}: {
  segment: DateSegmentType;
  state: ReturnType<typeof useDateFieldState>;
}): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  return (
    <div
      {...segmentProps}
      ref={ref}
      data-segment={segment.type}
      data-placeholder={segment.isPlaceholder || undefined}
    >
      {segment.text}
    </div>
  );
}

/**
 * Internal date field that receives fieldProps from useDatePicker.
 * This bridges the picker's state management to useDateField.
 * @internal
 */
function PickerDateField({
  fieldProps: externalFieldProps,
}: {
  fieldProps: Record<string, unknown>;
}): JSX.Element {
  const { locale } = useLocale();
  const ref = useRef<HTMLDivElement>(null);

  const state = useDateFieldState({
    ...externalFieldProps,
    locale,
    createCalendar,
  });

  const { fieldProps } = useDateField(externalFieldProps, state, ref);

  return (
    <div {...fieldProps} ref={ref} data-field>
      {state.segments.map((segment, i) => (
        <PickerDateSegment key={i} segment={segment} state={state} />
      ))}
    </div>
  );
}

/**
 * Internal popover content that uses usePopover for proper dismiss handling.
 * Handles Escape key, focus trapping, and click-outside dismiss.
 * @internal
 */
function PopoverContent({
  popoverRef,
  triggerRef,
  state,
  dialogProps,
  calendarProps,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  popoverRef: React.RefObject<HTMLDivElement>;
  triggerRef: React.RefObject<HTMLButtonElement>;
  state: ReturnType<typeof useDatePickerState>;
  dialogProps: ReturnType<typeof useDatePicker>["dialogProps"];
  calendarProps: ReturnType<typeof useDatePicker>["calendarProps"];
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}): JSX.Element {
  const { popoverProps } = usePopover(
    {
      popoverRef,
      triggerRef,
      placement: "bottom start",
      offset: 4,
    },
    state
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        e.stopPropagation();
        state.close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [state]);

  return (
    <div {...popoverProps} ref={popoverRef} data-popover>
      <DismissButton onDismiss={() => state.close()} />
      <div {...dialogProps} role="dialog">
        <CalendarCore
          {...{
            ...(calendarProps.value ? { value: calendarProps.value } : {}),
            ...(calendarProps.onChange ? { onChange: calendarProps.onChange } : {}),
            ...(calendarProps.minValue ? { minValue: calendarProps.minValue } : {}),
            ...(calendarProps.maxValue ? { maxValue: calendarProps.maxValue } : {}),
            ...(calendarProps.isDisabled ? { isDisabled: calendarProps.isDisabled } : {}),
            ...(calendarProps.isReadOnly ? { isReadOnly: calendarProps.isReadOnly } : {}),
            ...(calendarProps.isDateUnavailable
              ? { isDateUnavailable: calendarProps.isDateUnavailable }
              : {}),
          }}
          aria-label={(calendarProps as { "aria-label"?: string })["aria-label"] ?? "Calendar"}
        />
        <DatePickerActions
          cancelLabel={cancelLabel}
          confirmLabel={confirmLabel}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </div>
      <DismissButton onDismiss={() => state.close()} />
    </div>
  );
}

/**
 * Headless DatePickerDocked (Layer 2)
 *
 * Provides the complete docked date picker behavior:
 * - Segmented date field trigger (MM/DD/YYYY)
 * - Calendar icon button to toggle the calendar popover
 * - Inline popover containing the CalendarCore from M02
 * - Action buttons (Cancel, OK) at the bottom
 * - Open/close state management via React Aria overlays
 *
 * This is a headless component — it provides behavior, ARIA semantics, and
 * data attributes only. No styling classes are applied.
 *
 * @example
 * ```tsx
 * <DatePickerDocked
 *   label="Departure date"
 *   onChange={(date) => console.log(date)}
 * />
 * ```
 */
export const DatePickerDocked = forwardRef<HTMLDivElement, DatePickerDockedProps>(
  (props, forwardedRef) => {
    const {
      cancelLabel = "Cancel",
      confirmLabel = "OK",
      onCancel,
      onConfirm,
      className,
      ...datePickerProps
    } = props;

    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLDivElement>;
    const triggerRef = useRef<HTMLButtonElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    const stateProps = {
      ...(datePickerProps.value !== undefined ? { value: datePickerProps.value } : {}),
      ...(datePickerProps.defaultValue !== undefined
        ? { defaultValue: datePickerProps.defaultValue }
        : {}),
      ...(datePickerProps.onChange ? { onChange: datePickerProps.onChange } : {}),
      ...(datePickerProps.minValue ? { minValue: datePickerProps.minValue } : {}),
      ...(datePickerProps.maxValue ? { maxValue: datePickerProps.maxValue } : {}),
      ...(datePickerProps.isDateUnavailable
        ? { isDateUnavailable: datePickerProps.isDateUnavailable }
        : {}),
      ...(datePickerProps.placeholderValue
        ? { placeholderValue: datePickerProps.placeholderValue }
        : {}),
      ...(datePickerProps["aria-label"] ? { "aria-label": datePickerProps["aria-label"] } : {}),
      ...(datePickerProps["aria-labelledby"]
        ? { "aria-labelledby": datePickerProps["aria-labelledby"] }
        : {}),
      ...(datePickerProps.label ? { label: datePickerProps.label } : {}),
      ...(datePickerProps.isOpen !== undefined ? { isOpen: datePickerProps.isOpen } : {}),
      ...(datePickerProps.defaultOpen !== undefined
        ? { defaultOpen: datePickerProps.defaultOpen }
        : {}),
      ...(datePickerProps.onOpenChange ? { onOpenChange: datePickerProps.onOpenChange } : {}),
      isDisabled: datePickerProps.isDisabled ?? false,
      isReadOnly: datePickerProps.isReadOnly ?? false,
      isRequired: datePickerProps.isRequired ?? false,
      granularity: (datePickerProps.granularity ?? "day") as "day",
      shouldCloseOnSelect: false,
    };

    const state = useDatePickerState(stateProps);

    const {
      groupProps,
      labelProps,
      fieldProps,
      buttonProps: triggerButtonAriaProps,
      dialogProps,
      calendarProps,
    } = useDatePicker(stateProps, state, ref);

    const { buttonProps: iconButtonProps } = useButton(triggerButtonAriaProps, triggerRef);

    const valueBeforeOpenRef = useRef<DateValue | null>(null);

    useEffect(() => {
      if (state.isOpen) {
        valueBeforeOpenRef.current = state.value ?? null;
      }
    }, [state.isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleCancel = useCallback(() => {
      const previous = valueBeforeOpenRef.current;
      if (previous !== null) {
        state.setValue(previous);
      } else {
        state.setValue(null as unknown as DateValue);
      }
      state.setOpen(false);
      onCancel?.();
      triggerRef.current?.focus();
    }, [state, onCancel]);

    const handleConfirm = useCallback(() => {
      state.setOpen(false);
      onConfirm?.(state.value ?? null);
      triggerRef.current?.focus();
    }, [state, onConfirm]);

    return (
      <div
        ref={ref}
        className={className}
        data-variant="docked"
        data-open={state.isOpen ?? undefined}
        data-disabled={datePickerProps.isDisabled ?? undefined}
      >
        {datePickerProps.label && <label {...labelProps}>{datePickerProps.label}</label>}
        <div {...groupProps}>
          <PickerDateField fieldProps={fieldProps as Record<string, unknown>} />
          <button {...iconButtonProps} ref={triggerRef} type="button" data-trigger>
            📅
          </button>
        </div>
        {state.isOpen && (
          <PopoverContent
            popoverRef={popoverRef}
            triggerRef={triggerRef}
            state={state}
            dialogProps={dialogProps}
            calendarProps={calendarProps}
            cancelLabel={cancelLabel}
            confirmLabel={confirmLabel}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
          />
        )}
      </div>
    );
  }
);

DatePickerDocked.displayName = "DatePickerDocked";

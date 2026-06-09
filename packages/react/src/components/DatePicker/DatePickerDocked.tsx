"use client";

import type React from "react";
import { forwardRef, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  useDatePicker,
  useDateField,
  useDateSegment,
  useButton,
  useLocale,
  usePopover,
  useHover,
  useFocusRing,
  mergeProps,
  DismissButton,
} from "react-aria";
import { useDatePickerState, useDateFieldState } from "react-stately";
import { createCalendar } from "@internationalized/date";

import { CalendarCore } from "./CalendarCore";
import { DatePickerActions } from "./DatePickerActions";
import { getInteractionDataAttributes } from "../../utils/interactionStates";
import { cn } from "../../utils/cn";

import type { DateSegment as DateSegmentType } from "react-stately";
import type { DateValue } from "@internationalized/date";
import type { DatePickerDockedProps } from "./DatePicker.types";
import type { ActionButtonSlotProps } from "./DatePickerActions";

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
 * Calendar SVG icon for the trigger button.
 * @internal
 */
function CalendarTriggerIcon(): JSX.Element {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
    </svg>
  );
}

/**
 * Internal popover content that uses usePopover for proper dismiss handling.
 * Handles Escape key, focus trapping, and click-outside dismiss.
 * @internal
 */
function PopoverContent({
  popoverRef,
  anchorRef,
  state,
  dialogProps,
  calendarProps,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  slots,
  ActionButtonComponent,
  popoverClassName,
}: {
  popoverRef: React.RefObject<HTMLDivElement>;
  /** The element the popover is anchored to for positioning — the field group, not the icon button. */
  anchorRef: React.RefObject<HTMLDivElement>;
  state: ReturnType<typeof useDatePickerState>;
  dialogProps: ReturnType<typeof useDatePicker>["dialogProps"];
  calendarProps: ReturnType<typeof useDatePicker>["calendarProps"];
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  slots?: DatePickerDockedProps["slots"] | undefined;
  ActionButtonComponent?: React.ComponentType<ActionButtonSlotProps> | undefined;
  popoverClassName?: string | undefined;
}): JSX.Element | null {
  const { popoverProps } = usePopover(
    {
      popoverRef,
      triggerRef: anchorRef,
      placement: "bottom start",
      offset: 4,
      shouldFlip: true,
      containerPadding: 12,
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

  if (typeof document === "undefined") {
    return null;
  }

  const content = (
    <div {...popoverProps} ref={popoverRef} data-popover className={cn(popoverClassName)}>
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
          {...(slots ? { slots } : {})}
        />
        <DatePickerActions
          cancelLabel={cancelLabel}
          confirmLabel={confirmLabel}
          onCancel={onCancel}
          onConfirm={onConfirm}
          {...(ActionButtonComponent !== undefined
            ? { ButtonComponent: ActionButtonComponent }
            : {})}
        />
      </div>
      <DismissButton onDismiss={() => state.close()} />
    </div>
  );

  return createPortal(content, document.body) as JSX.Element;
}

/**
 * Headless DatePickerDocked (Layer 2)
 *
 * Provides the complete docked date picker behavior:
 * - Segmented date field trigger (MM/DD/YYYY)
 * - Calendar icon button to toggle the calendar popover
 * - Inline popover containing the CalendarCore
 * - Action buttons (Cancel, OK) at the bottom
 * - Open/close state management via React Aria overlays
 *
 * Accepts `slots` and `ActionButtonComponent` to allow Layer-3 styled wrappers
 * to inject CVA-styled sub-components without modifying this headless layer.
 *
 * This is a headless component — it provides behavior, ARIA semantics, and
 * data attributes only. No styling classes are applied to internal elements.
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
      popoverClassName,
      slots,
      ActionButtonComponent,
      ...datePickerProps
    } = props;

    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLDivElement>;
    const triggerRef = useRef<HTMLButtonElement>(null);
    const groupRef = useRef<HTMLDivElement>(null);
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

    const { buttonProps: iconButtonProps, isPressed: isTriggerPressed } = useButton(
      triggerButtonAriaProps,
      triggerRef
    );
    const { isFocusVisible: isTriggerFocusVisible, focusProps: triggerFocusProps } = useFocusRing();
    const { isHovered: isTriggerHovered, hoverProps: triggerHoverProps } = useHover({
      isDisabled: datePickerProps.isDisabled ?? false,
    });

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
        data-open={state.isOpen ? "" : undefined}
        data-disabled={datePickerProps.isDisabled ? "" : undefined}
      >
        {datePickerProps.label && (
          <label {...labelProps} data-label>
            {datePickerProps.label}
          </label>
        )}
        <div {...groupProps} ref={groupRef} data-field-group>
          <PickerDateField fieldProps={fieldProps as Record<string, unknown>} />
          <button
            {...mergeProps(iconButtonProps, triggerFocusProps, triggerHoverProps)}
            ref={triggerRef}
            type="button"
            data-trigger
            {...getInteractionDataAttributes({
              isHovered: isTriggerHovered,
              isFocusVisible: isTriggerFocusVisible,
              isPressed: isTriggerPressed,
              isDisabled: datePickerProps.isDisabled ?? false,
            })}
          >
            <CalendarTriggerIcon />
          </button>
        </div>
        {state.isOpen && (
          <PopoverContent
            popoverRef={popoverRef}
            anchorRef={groupRef}
            state={state}
            dialogProps={dialogProps}
            calendarProps={calendarProps}
            cancelLabel={cancelLabel}
            confirmLabel={confirmLabel}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            {...(slots !== undefined ? { slots } : {})}
            {...(ActionButtonComponent !== undefined ? { ActionButtonComponent } : {})}
            {...(popoverClassName !== undefined ? { popoverClassName } : {})}
          />
        )}
      </div>
    );
  }
);

DatePickerDocked.displayName = "DatePickerDocked";

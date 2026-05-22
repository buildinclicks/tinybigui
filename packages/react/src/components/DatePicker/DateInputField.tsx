"use client";

import { forwardRef, useId, useRef, useState } from "react";
import { useDateField, useDateSegment, useLocale } from "react-aria";
import { useDateFieldState } from "react-stately";
import { createCalendar } from "@internationalized/date";

import type { DateSegment as DateSegmentType } from "react-stately";
import type { DateInputFieldProps } from "./DatePicker.types";

/**
 * Internal component for rendering a single editable date segment.
 * @internal
 */
function DateInputSegment({
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
 * Headless DateInputField (Layer 2)
 *
 * An outlined text field for manual date entry with validation.
 * Wraps `useDateField` from React Aria for segmented date input behavior.
 * Renders as an outlined text field pattern with label, input area,
 * and supporting/error text.
 *
 * This is a headless component — it provides behavior, ARIA semantics, and
 * data attributes only. No styling classes are applied.
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
export const DateInputField = forwardRef<HTMLDivElement, DateInputFieldProps>(
  (props, forwardedRef) => {
    const {
      value,
      defaultValue,
      onChange,
      label,
      placeholder = "mm/dd/yyyy",
      isDisabled = false,
      isReadOnly = false,
      isRequired = false,
      minValue,
      maxValue,
      placeholderValue,
      granularity = "day",
      isInvalid: externalIsInvalid,
      errorMessage,
      autoFocus = false,
      className,
    } = props;

    const { locale } = useLocale();
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLDivElement>;
    const errorId = useId();

    const [isFocused, setIsFocused] = useState(false);

    const state = useDateFieldState({
      ...(value !== undefined ? { value } : {}),
      ...(defaultValue !== undefined ? { defaultValue } : {}),
      ...(onChange ? { onChange } : {}),
      ...(minValue ? { minValue } : {}),
      ...(maxValue ? { maxValue } : {}),
      ...(placeholderValue ? { placeholderValue } : {}),
      ...(props["aria-label"] ? { "aria-label": props["aria-label"] } : {}),
      ...(props["aria-labelledby"] ? { "aria-labelledby": props["aria-labelledby"] } : {}),
      ...(label ? { label } : {}),
      isDisabled,
      isReadOnly,
      isRequired,
      granularity: granularity as "day",
      locale,
      createCalendar,
    });

    const isInvalid = externalIsInvalid ?? state.isInvalid;

    const { fieldProps, labelProps } = useDateField(
      {
        ...(value !== undefined ? { value } : {}),
        ...(defaultValue !== undefined ? { defaultValue } : {}),
        ...(onChange ? { onChange } : {}),
        ...(minValue ? { minValue } : {}),
        ...(maxValue ? { maxValue } : {}),
        ...(placeholderValue ? { placeholderValue } : {}),
        ...(props["aria-label"] ? { "aria-label": props["aria-label"] } : {}),
        ...(props["aria-labelledby"] ? { "aria-labelledby": props["aria-labelledby"] } : {}),
        ...(label ? { label } : {}),
        isDisabled,
        isReadOnly,
        isRequired,
        granularity: granularity as "day",
        autoFocus,
        ...(isInvalid ? { "aria-describedby": errorId } : {}),
      },
      state,
      ref
    );

    return (
      <div
        className={className}
        aria-invalid={isInvalid || undefined}
        data-invalid={isInvalid || undefined}
        data-focused={isFocused || undefined}
        data-disabled={isDisabled || undefined}
        data-date-input-field
      >
        {label && (
          <label {...labelProps} data-label>
            {label}
          </label>
        )}
        <div
          {...fieldProps}
          ref={ref}
          role="group"
          aria-describedby={isInvalid && errorMessage ? errorId : undefined}
          data-field
          data-placeholder-text={placeholder}
          onFocus={(e) => {
            setIsFocused(true);
            fieldProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            fieldProps.onBlur?.(e);
          }}
        >
          {state.segments.map((segment, i) => (
            <DateInputSegment key={i} segment={segment} state={state} />
          ))}
        </div>
        {isInvalid && errorMessage && (
          <p id={errorId} data-error-message role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

DateInputField.displayName = "DateInputField";

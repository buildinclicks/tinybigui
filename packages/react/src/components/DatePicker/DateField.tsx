"use client";

import { forwardRef, useRef } from "react";
import { useDateField, useDateSegment, useLocale } from "react-aria";
import { useDateFieldState } from "react-stately";
import { createCalendar } from "@internationalized/date";

import type { DateSegment as DateSegmentType } from "react-stately";
import type { DateFieldProps } from "./DatePicker.types";

/**
 * Internal component for rendering a single editable date segment.
 * Each segment (month, day, year) is independently focusable and editable.
 * @internal
 */
function DateSegment({
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
      data-focused={segment.type !== "literal" ? undefined : undefined}
    >
      {segment.text}
    </div>
  );
}

/**
 * Headless DateField (Layer 2)
 *
 * Renders a segmented date input (e.g., MM/DD/YYYY) using React Aria's
 * `useDateField` and `useDateSegment`. Each segment is independently
 * focusable and editable via keyboard.
 *
 * This is a headless component — it provides behavior, ARIA semantics, and
 * data attributes only. No styling classes are applied.
 *
 * @example
 * ```tsx
 * <DateField aria-label="Start date" onChange={setDate} />
 * ```
 */
export const DateField = forwardRef<HTMLDivElement, DateFieldProps>((props, forwardedRef) => {
  const { locale } = useLocale();
  const internalRef = useRef<HTMLDivElement>(null);
  const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLDivElement>;

  const state = useDateFieldState({
    ...(props.value !== undefined ? { value: props.value } : {}),
    ...(props.defaultValue !== undefined ? { defaultValue: props.defaultValue } : {}),
    ...(props.onChange ? { onChange: props.onChange } : {}),
    ...(props.minValue ? { minValue: props.minValue } : {}),
    ...(props.maxValue ? { maxValue: props.maxValue } : {}),
    ...(props.placeholderValue ? { placeholderValue: props.placeholderValue } : {}),
    ...(props["aria-label"] ? { "aria-label": props["aria-label"] } : {}),
    ...(props["aria-labelledby"] ? { "aria-labelledby": props["aria-labelledby"] } : {}),
    ...(props.label ? { label: props.label } : {}),
    isDisabled: props.isDisabled ?? false,
    isReadOnly: props.isReadOnly ?? false,
    isRequired: props.isRequired ?? false,
    granularity: (props.granularity ?? "day") as "day",
    locale,
    createCalendar,
  });

  const { fieldProps, labelProps } = useDateField(
    {
      ...(props.value !== undefined ? { value: props.value } : {}),
      ...(props.defaultValue !== undefined ? { defaultValue: props.defaultValue } : {}),
      ...(props.onChange ? { onChange: props.onChange } : {}),
      ...(props.minValue ? { minValue: props.minValue } : {}),
      ...(props.maxValue ? { maxValue: props.maxValue } : {}),
      ...(props.placeholderValue ? { placeholderValue: props.placeholderValue } : {}),
      ...(props["aria-label"] ? { "aria-label": props["aria-label"] } : {}),
      ...(props["aria-labelledby"] ? { "aria-labelledby": props["aria-labelledby"] } : {}),
      ...(props.label ? { label: props.label } : {}),
      isDisabled: props.isDisabled ?? false,
      isReadOnly: props.isReadOnly ?? false,
      isRequired: props.isRequired ?? false,
      granularity: (props.granularity ?? "day") as "day",
    },
    state,
    ref
  );

  return (
    <div className={props.className} data-disabled={props.isDisabled ?? undefined}>
      {props.label && <label {...labelProps}>{props.label}</label>}
      <div {...fieldProps} ref={ref} data-field>
        {state.segments.map((segment, i) => (
          <DateSegment key={i} segment={segment} state={state} />
        ))}
      </div>
    </div>
  );
});

DateField.displayName = "DateField";

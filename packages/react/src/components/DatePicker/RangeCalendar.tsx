"use client";

import { forwardRef, useRef } from "react";
import { useRangeCalendar, useLocale } from "react-aria";
import { useRangeCalendarState } from "react-stately";
import { createCalendar } from "@internationalized/date";

import { CalendarGrid } from "./CalendarGrid";
import { CalendarHeader } from "./CalendarHeader";

import type { RangeCalendarProps } from "./DatePicker.types";

/**
 * Headless RangeCalendar (Layer 2)
 *
 * Provides a scrollable multi-month calendar for date range selection.
 * Uses React Aria's `useRangeCalendar` for accessible range selection behavior.
 *
 * Features:
 * - Multi-month view with month subheads
 * - In-range dates highlighted with `data-range-middle`
 * - Start/end dates with `data-range-start` / `data-range-end`
 * - Full keyboard navigation across months
 *
 * This is a headless component — it provides behavior, ARIA semantics, and
 * data attributes only. No styling classes are applied.
 *
 * @internal
 */
export const RangeCalendar = forwardRef<HTMLDivElement, RangeCalendarProps>(
  (props, forwardedRef) => {
    const { locale } = useLocale();
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLDivElement>;

    const {
      rangeValue,
      defaultRangeValue,
      onRangeChange,
      minValue,
      maxValue,
      isDateUnavailable,
      visibleMonths = 3,
      "aria-label": ariaLabel,
      className,
    } = props;

    const commonProps = {
      ...(rangeValue ? { value: rangeValue } : {}),
      ...(defaultRangeValue ? { defaultValue: defaultRangeValue } : {}),
      ...(onRangeChange ? { onChange: onRangeChange } : {}),
      ...(minValue ? { minValue } : {}),
      ...(maxValue ? { maxValue } : {}),
      ...(isDateUnavailable ? { isDateUnavailable } : {}),
      visibleDuration: { months: visibleMonths },
    };

    const state = useRangeCalendarState({
      ...commonProps,
      locale,
      createCalendar,
    });

    const ariaProps = {
      ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
      ...commonProps,
    };

    const { calendarProps, prevButtonProps, nextButtonProps, title } = useRangeCalendar(
      ariaProps,
      state,
      ref
    );

    return (
      <div
        {...calendarProps}
        ref={ref}
        className={className}
        data-range-calendar
        data-visible-months={visibleMonths}
      >
        <CalendarHeader
          title={title}
          prevButtonProps={prevButtonProps}
          nextButtonProps={nextButtonProps}
        />
        <div data-scrollable-months>
          <CalendarGrid state={state} />
        </div>
      </div>
    );
  }
);

RangeCalendar.displayName = "RangeCalendar";

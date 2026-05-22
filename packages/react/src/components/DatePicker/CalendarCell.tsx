"use client";

import { useRef } from "react";
import { mergeProps, useCalendarCell, useFocusRing } from "react-aria";
import { isSameDay, today, getLocalTimeZone } from "@internationalized/date";

import type { CalendarDate } from "@internationalized/date";
import type { CalendarState, RangeCalendarState } from "react-stately";

/**
 * Internal props for the CalendarCell headless component.
 * @internal
 */
interface CalendarCellInternalProps {
  /** The date this cell represents */
  date: CalendarDate;
  /** Calendar state from React Aria / React Stately */
  state: CalendarState | RangeCalendarState;
}

/**
 * Headless CalendarCell (Layer 2)
 *
 * Renders a single date cell within the calendar grid using React Aria's
 * `useCalendarCell` for accessibility and keyboard interaction.
 *
 * Exposes data attributes for the styled layer:
 * - `data-selected` — date is selected
 * - `data-today` — date is today
 * - `data-outside-month` — date is from an adjacent month
 * - `data-range-start` — date is the start of a selected range
 * - `data-range-end` — date is the end of a selected range
 * - `data-range-middle` — date is between range start and end
 * - `data-disabled` — date is disabled
 * - `data-unavailable` — date is unavailable
 * - `data-focused` — date is focused
 * - `data-focus-visible` — date has visible focus ring
 *
 * @internal
 */
export function CalendarCell({ date, state }: CalendarCellInternalProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  const { cellProps, buttonProps, isSelected, isDisabled, isUnavailable, formattedDate } =
    useCalendarCell({ date }, state, ref);

  const { focusProps, isFocusVisible, isFocused } = useFocusRing();

  const isCurrentDay = isSameDay(date, today(getLocalTimeZone()));
  const isOutsideMonth =
    date.month !== state.visibleRange.start.month || date.year !== state.visibleRange.start.year;

  let isRangeStart = false;
  let isRangeEnd = false;
  let isRangeMiddle = false;

  if ("highlightedRange" in state && state.highlightedRange) {
    const range = state.highlightedRange;
    isRangeStart = isSameDay(date, range.start);
    isRangeEnd = isSameDay(date, range.end);
    isRangeMiddle = date.compare(range.start) > 0 && date.compare(range.end) < 0;
  }

  return (
    <td {...cellProps}>
      <div
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        aria-current={isCurrentDay ? ("date" as const) : undefined}
        data-selected={isSelected || undefined}
        data-today={isCurrentDay || undefined}
        data-outside-month={isOutsideMonth || undefined}
        data-range-start={isRangeStart || undefined}
        data-range-end={isRangeEnd || undefined}
        data-range-middle={isRangeMiddle || undefined}
        data-disabled={isDisabled || undefined}
        data-unavailable={isUnavailable || undefined}
        data-focused={isFocused || undefined}
        data-focus-visible={isFocusVisible || undefined}
      >
        {formattedDate}
      </div>
    </td>
  );
}

CalendarCell.displayName = "CalendarCell";

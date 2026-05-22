"use client";

import { useCalendarGrid, useLocale } from "react-aria";
import { getWeeksInMonth } from "@internationalized/date";

import { CalendarCell } from "./CalendarCell";

import type { CalendarState, RangeCalendarState } from "react-stately";

/**
 * Internal props for the CalendarGrid headless component.
 * @internal
 */
interface CalendarGridInternalProps {
  /** Calendar state from React Aria / React Stately */
  state: CalendarState | RangeCalendarState;
  /** First day of the week in React Aria string format */
  firstDayOfWeek?: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | undefined;
}

/**
 * Headless CalendarGrid (Layer 2)
 *
 * Renders the calendar grid structure using React Aria's `useCalendarGrid`.
 * Produces a `<table>` with `role="grid"`, weekday column headers, and
 * week rows containing CalendarCell components.
 *
 * @internal
 */
export function CalendarGrid({ state, firstDayOfWeek }: CalendarGridInternalProps): JSX.Element {
  const { locale } = useLocale();

  const gridOptions = firstDayOfWeek ? { firstDayOfWeek } : {};
  const { gridProps, headerProps, weekDays } = useCalendarGrid(gridOptions, state);

  const weeksInMonth = getWeeksInMonth(
    state.visibleRange.start,
    locale,
    firstDayOfWeek ?? undefined
  );

  return (
    <table {...gridProps}>
      <thead {...headerProps} aria-hidden={undefined}>
        <tr>
          {weekDays.map((day, index) => (
            <th key={index} role="columnheader">
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex)
              .map((date, i) =>
                date ? <CalendarCell key={i} state={state} date={date} /> : <td key={i} />
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

CalendarGrid.displayName = "CalendarGrid";

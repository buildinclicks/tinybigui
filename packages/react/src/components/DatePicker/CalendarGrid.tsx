"use client";

import { useCalendarGrid, useLocale } from "react-aria";
import { getWeeksInMonth } from "@internationalized/date";

import { CalendarCell } from "./CalendarCell";

import type { CalendarDate } from "@internationalized/date";
import type { CalendarState, RangeCalendarState } from "react-stately";

/**
 * Slot component type for rendering an individual calendar date cell.
 * Defaults to the headless `CalendarCell`.
 */
export interface CalendarCellComponentProps {
  date: CalendarDate;
  state: CalendarState | RangeCalendarState;
}

/**
 * Internal props for the CalendarGrid headless component.
 * @internal
 */
interface CalendarGridInternalProps {
  /** Calendar state from React Aria / React Stately */
  state: CalendarState | RangeCalendarState;
  /** First day of the week in React Aria string format */
  firstDayOfWeek?: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | undefined;
  /**
   * Optional slot component for rendering each date cell.
   * Defaults to the headless `CalendarCell`.
   * Pass a styled component to inject CVA classes and state layers.
   */
  CellComponent?: React.ComponentType<CalendarCellComponentProps>;
  /**
   * Optional slot component for rendering weekday column headers.
   * Receives the formatted weekday label string.
   */
  WeekdayComponent?: React.ComponentType<{ label: string }>;
}

/**
 * Headless CalendarGrid (Layer 2)
 *
 * Renders the calendar grid structure using React Aria's `useCalendarGrid`.
 * Produces a `<table>` with `role="grid"`, weekday column headers, and
 * week rows containing cell components.
 *
 * The `CellComponent` and `WeekdayComponent` slots allow the styled layer to
 * inject fully-styled sub-components without touching the headless layer.
 *
 * @internal
 */
export function CalendarGrid({
  state,
  firstDayOfWeek,
  CellComponent = CalendarCell,
  WeekdayComponent,
}: CalendarGridInternalProps): JSX.Element {
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
          {weekDays.map((day, index) =>
            WeekdayComponent ? (
              <th key={index} role="columnheader">
                <WeekdayComponent label={day} />
              </th>
            ) : (
              <th key={index} role="columnheader">
                {day}
              </th>
            )
          )}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex)
              .map((date, i) =>
                date ? <CellComponent key={i} state={state} date={date} /> : <td key={i} />
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

CalendarGrid.displayName = "CalendarGrid";

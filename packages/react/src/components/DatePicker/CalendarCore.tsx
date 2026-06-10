"use client";

import type React from "react";
import { forwardRef, useRef, useState } from "react";
import { useCalendar, useRangeCalendar, useLocale } from "react-aria";
import { useCalendarState, useRangeCalendarState } from "react-stately";
import { createCalendar } from "@internationalized/date";

import { CalendarGrid } from "./CalendarGrid";
import { CalendarHeader } from "./CalendarHeader";

import type { DateValue } from "@internationalized/date";
import type { CalendarView, DateSelectionMode } from "./DatePicker.types";
import type { CalendarCellComponentProps } from "./CalendarGrid";
import type { NavButtonComponentProps, TitleComponentProps } from "./CalendarHeader";

const FIRST_DAY_MAP: Record<number, "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat"> = {
  0: "sun",
  1: "mon",
  2: "tue",
  3: "wed",
  4: "thu",
  5: "fri",
  6: "sat",
};

const YEAR_RANGE_OFFSET = 50;

/**
 * Slot component overrides for the calendar.
 * Pass styled components from Layer 3 to inject CVA + state layers without
 * modifying the headless behavior.
 */
export interface CalendarSlots {
  /**
   * Component for rendering each date cell.
   * Defaults to the headless `CalendarCell`.
   */
  CellComponent?: React.ComponentType<CalendarCellComponentProps>;
  /**
   * Component for rendering navigation buttons (prev/next month).
   * Defaults to the built-in unstyled button.
   */
  NavButtonComponent?: React.ComponentType<NavButtonComponentProps>;
  /**
   * Component for rendering the month/year title pill.
   * Defaults to the built-in unstyled div/button.
   */
  TitleComponent?: React.ComponentType<TitleComponentProps>;
  /**
   * Component for rendering each year item in the year-selection grid.
   */
  YearItemComponent?: React.ComponentType<YearItemComponentProps>;
  /**
   * Component for rendering weekday column headers.
   */
  WeekdayComponent?: React.ComponentType<{ label: string }>;
}

/**
 * Props for a year item slot component.
 */
export interface YearItemComponentProps {
  year: number;
  isSelected: boolean;
  onSelect: (year: number) => void;
}

/**
 * Props for the CalendarCore headless component (Layer 2).
 *
 * Orchestrates the full calendar grid, navigation, and selection behavior
 * for both single-date and date-range modes.
 *
 * @example
 * ```tsx
 * <CalendarCore
 *   aria-label="Departure date"
 *   selectionMode="single"
 *   onChange={(date) => console.log(date)}
 * />
 * ```
 */
export interface CalendarCoreProps {
  /** Selection mode: single date or date range. @default 'single' */
  selectionMode?: DateSelectionMode;
  /** Controlled selected date (single mode) */
  value?: DateValue | null;
  /** Default selected date for uncontrolled usage (single mode) */
  defaultValue?: DateValue | null;
  /** Controlled start and end dates (range mode) */
  rangeValue?: { start: DateValue; end: DateValue } | null;
  /** Default range for uncontrolled usage (range mode) */
  defaultRangeValue?: { start: DateValue; end: DateValue } | null;
  /** Called when selected date changes (single mode) */
  onChange?: (value: DateValue) => void;
  /** Called when selected range changes (range mode) */
  onRangeChange?: (value: { start: DateValue; end: DateValue }) => void;
  /** Minimum selectable date */
  minValue?: DateValue;
  /** Maximum selectable date */
  maxValue?: DateValue;
  /** Whether a specific date is unavailable */
  isDateUnavailable?: (date: DateValue) => boolean;
  /** Whether the calendar is disabled. @default false */
  isDisabled?: boolean;
  /** Whether the calendar is read-only. @default false */
  isReadOnly?: boolean;
  /** Current calendar view. @default 'day' */
  view?: CalendarView;
  /** Called when the view changes */
  onViewChange?: (view: CalendarView) => void;
  /** Locale override */
  locale?: string;
  /** First day of week (0=Sun, 1=Mon, ..., 6=Sat) */
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** CSS classes for the root element */
  className?: string;
  /** Children for styled layer injection */
  children?: React.ReactNode;
  /** Accessible label */
  "aria-label"?: string;
  /** ID of labelling element */
  "aria-labelledby"?: string;
  /**
   * Slot component overrides — pass styled components from Layer 3 to inject
   * CVA classes and state layers into the calendar internals.
   */
  slots?: CalendarSlots;
}

type CalendarInternalProps = Omit<CalendarCoreProps, "selectionMode"> & {
  calendarRef: React.RefObject<HTMLDivElement>;
};

/**
 * Internal year grid for year selection view.
 * Renders a 3-column grid of selectable years.
 * @internal
 */
function YearGrid({
  selectedYear,
  onYearSelect,
  minYear,
  maxYear,
  YearItemComponent,
}: {
  selectedYear: number;
  onYearSelect: (year: number) => void;
  minYear?: number;
  maxYear?: number;
  YearItemComponent?: React.ComponentType<YearItemComponentProps>;
}): JSX.Element {
  const currentYear = new Date().getFullYear();
  const startYear = minYear ?? currentYear - YEAR_RANGE_OFFSET;
  const endYear = maxYear ?? currentYear + YEAR_RANGE_OFFSET;

  const years: number[] = [];
  for (let y = startYear; y <= endYear; y++) {
    years.push(y);
  }

  const selectedRef = useRef<HTMLButtonElement>(null);

  return (
    <div
      data-year-grid
      role="grid"
      aria-label="Year selection"
      ref={(el) => {
        if (el && selectedRef.current) {
          selectedRef.current.scrollIntoView({
            block: "center",
            behavior: "instant",
          });
        }
      }}
    >
      {years.map((year) => {
        const isSelected = year === selectedYear;
        if (YearItemComponent) {
          return (
            <YearItemComponent
              key={year}
              year={year}
              isSelected={isSelected}
              onSelect={onYearSelect}
            />
          );
        }
        return (
          <button
            key={year}
            type="button"
            role="gridcell"
            aria-selected={isSelected}
            data-year-item
            data-selected={isSelected ? "" : undefined}
            ref={isSelected ? selectedRef : undefined}
            onClick={() => onYearSelect(year)}
          >
            {year}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Internal single-date calendar using useCalendar + useCalendarState.
 * Isolated to avoid conditional hook calls.
 */
function SingleCalendarInner({ calendarRef, ...props }: CalendarInternalProps): JSX.Element {
  const { locale: defaultLocale } = useLocale();
  const calendarLocale = props.locale ?? defaultLocale;

  const firstDay =
    props.firstDayOfWeek !== undefined ? FIRST_DAY_MAP[props.firstDayOfWeek] : undefined;

  const [currentView, setCurrentView] = useState<"day" | "year">(
    props.view === "year" ? "year" : "day"
  );

  const optionalProps = {
    ...(props.value !== undefined ? { value: props.value } : {}),
    ...(props.defaultValue !== undefined ? { defaultValue: props.defaultValue } : {}),
    ...(props.onChange ? { onChange: props.onChange } : {}),
    ...(props.isDateUnavailable ? { isDateUnavailable: props.isDateUnavailable } : {}),
    ...(props["aria-label"] ? { "aria-label": props["aria-label"] } : {}),
    ...(props["aria-labelledby"] ? { "aria-labelledby": props["aria-labelledby"] } : {}),
  };

  const state = useCalendarState({
    ...optionalProps,
    minValue: props.minValue ?? null,
    maxValue: props.maxValue ?? null,
    isDisabled: props.isDisabled ?? false,
    isReadOnly: props.isReadOnly ?? false,
    locale: calendarLocale,
    createCalendar,
  });

  const { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(
    {
      ...optionalProps,
      minValue: props.minValue ?? null,
      maxValue: props.maxValue ?? null,
      isDisabled: props.isDisabled ?? false,
      isReadOnly: props.isReadOnly ?? false,
    },
    state
  );

  const handleTitleClick = (): void => {
    const nextView = currentView === "day" ? "year" : "day";
    setCurrentView(nextView);
    props.onViewChange?.(nextView);
  };

  const handleYearSelect = (year: number): void => {
    const newDate = state.focusedDate.set({ year });
    state.setFocusedDate(newDate);
    setCurrentView("day");
    props.onViewChange?.("day");
  };

  const slots = props.slots ?? {};

  return (
    <div {...calendarProps} ref={calendarRef} className={props.className} data-view={currentView}>
      <CalendarHeader
        title={title}
        prevButtonProps={currentView === "day" ? prevButtonProps : { isDisabled: true }}
        nextButtonProps={currentView === "day" ? nextButtonProps : { isDisabled: true }}
        onTitleClick={handleTitleClick}
        showDropdownIndicator
        {...(slots.NavButtonComponent ? { NavButtonComponent: slots.NavButtonComponent } : {})}
        {...(slots.TitleComponent ? { TitleComponent: slots.TitleComponent } : {})}
      />
      {currentView === "day" ? (
        <CalendarGrid
          state={state}
          firstDayOfWeek={firstDay}
          {...(slots.CellComponent ? { CellComponent: slots.CellComponent } : {})}
          {...(slots.WeekdayComponent ? { WeekdayComponent: slots.WeekdayComponent } : {})}
        />
      ) : (
        <YearGrid
          selectedYear={state.focusedDate.year}
          onYearSelect={handleYearSelect}
          {...(slots.YearItemComponent ? { YearItemComponent: slots.YearItemComponent } : {})}
          {...(props.minValue ? { minYear: props.minValue.year } : {})}
          {...(props.maxValue ? { maxYear: props.maxValue.year } : {})}
        />
      )}
      {props.children}
    </div>
  );
}

/**
 * Internal range calendar using useRangeCalendar + useRangeCalendarState.
 * Isolated to avoid conditional hook calls.
 */
function RangeCalendarInner({ calendarRef, ...props }: CalendarInternalProps): JSX.Element {
  const { locale: defaultLocale } = useLocale();
  const calendarLocale = props.locale ?? defaultLocale;

  const firstDay =
    props.firstDayOfWeek !== undefined ? FIRST_DAY_MAP[props.firstDayOfWeek] : undefined;

  const [currentView, setCurrentView] = useState<"day" | "year">(
    props.view === "year" ? "year" : "day"
  );

  const unavailableProp = props.isDateUnavailable
    ? { isDateUnavailable: props.isDateUnavailable }
    : {};

  const rangeValueProp = props.rangeValue ? { value: props.rangeValue } : {};
  const rangeDefaultProp = props.defaultRangeValue ? { defaultValue: props.defaultRangeValue } : {};
  const rangeChangeProp = props.onRangeChange ? { onChange: props.onRangeChange } : {};
  const ariaLabelProp = props["aria-label"] ? { "aria-label": props["aria-label"] } : {};
  const ariaLabelledByProp = props["aria-labelledby"]
    ? { "aria-labelledby": props["aria-labelledby"] }
    : {};

  const state = useRangeCalendarState({
    ...rangeValueProp,
    ...rangeDefaultProp,
    ...rangeChangeProp,
    minValue: props.minValue ?? null,
    maxValue: props.maxValue ?? null,
    ...unavailableProp,
    isDisabled: props.isDisabled ?? false,
    isReadOnly: props.isReadOnly ?? false,
    locale: calendarLocale,
    createCalendar,
  });

  const { calendarProps, prevButtonProps, nextButtonProps, title } = useRangeCalendar(
    {
      ...ariaLabelProp,
      ...ariaLabelledByProp,
      ...rangeValueProp,
      ...rangeDefaultProp,
      ...rangeChangeProp,
      minValue: props.minValue ?? null,
      maxValue: props.maxValue ?? null,
      ...unavailableProp,
      isDisabled: props.isDisabled ?? false,
      isReadOnly: props.isReadOnly ?? false,
    },
    state,
    calendarRef
  );

  const handleTitleClick = (): void => {
    const nextView = currentView === "day" ? "year" : "day";
    setCurrentView(nextView);
    props.onViewChange?.(nextView);
  };

  const handleYearSelect = (year: number): void => {
    const newDate = state.focusedDate.set({ year });
    state.setFocusedDate(newDate);
    setCurrentView("day");
    props.onViewChange?.("day");
  };

  const slots = props.slots ?? {};

  return (
    <div {...calendarProps} ref={calendarRef} className={props.className} data-view={currentView}>
      <CalendarHeader
        title={title}
        prevButtonProps={currentView === "day" ? prevButtonProps : { isDisabled: true }}
        nextButtonProps={currentView === "day" ? nextButtonProps : { isDisabled: true }}
        onTitleClick={handleTitleClick}
        showDropdownIndicator
        {...(slots.NavButtonComponent ? { NavButtonComponent: slots.NavButtonComponent } : {})}
        {...(slots.TitleComponent ? { TitleComponent: slots.TitleComponent } : {})}
      />
      {currentView === "day" ? (
        <CalendarGrid
          state={state}
          firstDayOfWeek={firstDay}
          {...(slots.CellComponent ? { CellComponent: slots.CellComponent } : {})}
          {...(slots.WeekdayComponent ? { WeekdayComponent: slots.WeekdayComponent } : {})}
        />
      ) : (
        <YearGrid
          selectedYear={state.focusedDate.year}
          onYearSelect={handleYearSelect}
          {...(slots.YearItemComponent ? { YearItemComponent: slots.YearItemComponent } : {})}
          {...(props.minValue ? { minYear: props.minValue.year } : {})}
          {...(props.maxValue ? { maxYear: props.maxValue.year } : {})}
        />
      )}
      {props.children}
    </div>
  );
}

/**
 * Headless CalendarCore (Layer 2)
 *
 * Orchestrates the full calendar experience using React Aria's `useCalendar`
 * (single mode) or `useRangeCalendar` (range mode). Composes CalendarHeader
 * and CalendarGrid sub-components.
 *
 * Supports day view (calendar grid) and year view (3-column year selection grid)
 * toggled by clicking the month/year title in the header.
 *
 * The `slots` prop allows Layer-3 styled components to inject styled sub-components
 * (cells, nav buttons, title, year items, weekday labels) without modifying this
 * headless layer.
 *
 * @example
 * ```tsx
 * <CalendarCore aria-label="Pick a date" onChange={setDate} />
 * <CalendarCore aria-label="Trip dates" selectionMode="range" onRangeChange={setRange} />
 * ```
 */
export const CalendarCore = forwardRef<HTMLDivElement, CalendarCoreProps>((props, forwardedRef) => {
  const { selectionMode = "single", ...rest } = props;
  const internalRef = useRef<HTMLDivElement>(null);
  const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLDivElement>;

  if (selectionMode === "range") {
    return <RangeCalendarInner key="range" {...rest} calendarRef={ref} />;
  }

  return <SingleCalendarInner key="single" {...rest} calendarRef={ref} />;
});

CalendarCore.displayName = "CalendarCore";

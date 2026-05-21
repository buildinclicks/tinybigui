import { describe, test, expectTypeOf } from "vitest";
import type { DateValue } from "@internationalized/date";
import type {
  DatePickerVariant,
  DateSelectionMode,
  CalendarView,
  CalendarCellType,
  DatePickerHeadlessProps,
  DatePickerProps,
  CalendarGridProps,
  CalendarCellProps,
  DatePickerRenderState,
} from "./DatePicker.types";

describe("DatePicker Types", () => {
  describe("DatePickerVariant", () => {
    test("accepts 'docked', 'modal', 'modal-input'", () => {
      expectTypeOf<"docked">().toMatchTypeOf<DatePickerVariant>();
      expectTypeOf<"modal">().toMatchTypeOf<DatePickerVariant>();
      expectTypeOf<"modal-input">().toMatchTypeOf<DatePickerVariant>();
    });
  });

  describe("DateSelectionMode", () => {
    test("accepts 'single' and 'range'", () => {
      expectTypeOf<"single">().toMatchTypeOf<DateSelectionMode>();
      expectTypeOf<"range">().toMatchTypeOf<DateSelectionMode>();
    });
  });

  describe("CalendarView", () => {
    test("accepts 'day', 'month', 'year'", () => {
      expectTypeOf<"day">().toMatchTypeOf<CalendarView>();
      expectTypeOf<"month">().toMatchTypeOf<CalendarView>();
      expectTypeOf<"year">().toMatchTypeOf<CalendarView>();
    });
  });

  describe("CalendarCellType", () => {
    test("accepts all six cell type literals", () => {
      expectTypeOf<"default">().toMatchTypeOf<CalendarCellType>();
      expectTypeOf<"today">().toMatchTypeOf<CalendarCellType>();
      expectTypeOf<"selected">().toMatchTypeOf<CalendarCellType>();
      expectTypeOf<"selected-range-middle">().toMatchTypeOf<CalendarCellType>();
      expectTypeOf<"outside-month">().toMatchTypeOf<CalendarCellType>();
      expectTypeOf<"disabled">().toMatchTypeOf<CalendarCellType>();
    });
  });

  describe("DatePickerHeadlessProps", () => {
    test("accepts variant, selectionMode, value, onChange", () => {
      expectTypeOf<DatePickerHeadlessProps>().toHaveProperty("variant");
      expectTypeOf<DatePickerHeadlessProps>().toHaveProperty("selectionMode");
      expectTypeOf<DatePickerHeadlessProps>().toHaveProperty("value");
      expectTypeOf<DatePickerHeadlessProps>().toHaveProperty("onChange");
    });
  });

  describe("DatePickerProps", () => {
    test("extends DatePickerHeadlessProps", () => {
      expectTypeOf<DatePickerProps>().toMatchTypeOf<DatePickerHeadlessProps>();
    });

    test("accepts headline, cancelLabel, confirmLabel, showClear", () => {
      expectTypeOf<DatePickerProps>().toHaveProperty("headline");
      expectTypeOf<DatePickerProps>().toHaveProperty("cancelLabel");
      expectTypeOf<DatePickerProps>().toHaveProperty("confirmLabel");
      expectTypeOf<DatePickerProps>().toHaveProperty("showClear");
    });
  });

  describe("CalendarGridProps", () => {
    test("has optional focusedDate and visibleMonth", () => {
      expectTypeOf<CalendarGridProps>().toHaveProperty("focusedDate");
      expectTypeOf<CalendarGridProps>().toHaveProperty("visibleMonth");

      expectTypeOf<Record<string, never>>().toMatchTypeOf<
        Pick<CalendarGridProps, "focusedDate" | "visibleMonth">
      >();
    });
  });

  describe("CalendarCellProps", () => {
    test("requires date property", () => {
      expectTypeOf<CalendarCellProps>().toHaveProperty("date");
      expectTypeOf<CalendarCellProps["date"]>().toMatchTypeOf<DateValue>();
    });
  });

  describe("DatePickerRenderState", () => {
    test("has all required state properties", () => {
      expectTypeOf<DatePickerRenderState>().toHaveProperty("isOpen");
      expectTypeOf<DatePickerRenderState>().toHaveProperty("isDisabled");
      expectTypeOf<DatePickerRenderState>().toHaveProperty("calendarView");
      expectTypeOf<DatePickerRenderState>().toHaveProperty("selectedDate");
      expectTypeOf<DatePickerRenderState>().toHaveProperty("selectedRange");
      expectTypeOf<DatePickerRenderState>().toHaveProperty("today");
      expectTypeOf<DatePickerRenderState>().toHaveProperty("visibleMonth");
    });
  });
});

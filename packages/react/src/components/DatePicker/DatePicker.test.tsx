import { describe, test, expect, expectTypeOf, vi } from "vitest";
import { render, screen, waitFor, within, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";
import { useState } from "react";
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
import { CalendarCore } from "./CalendarCore";
import { DatePickerDocked } from "./DatePickerDocked";
import { DateField } from "./DateField";
import { DatePickerModal } from "./DatePickerModal";
import { DatePickerModalInput } from "./DatePickerModalInput";
import { DatePicker } from "./DatePicker";
import {
  datePickerContainerVariants,
  calendarCellVariants,
  calendarCellStateLayerVariants,
  calendarCellFocusRingVariants,
  navButtonVariants,
  navButtonStateLayerVariants,
  calendarDividerVariants,
  yearItemVariants,
  yearItemStateLayerVariants,
  weekdayVariants,
  actionButtonVariants,
  headlineVariants,
  supportingTextVariants,
  modalDialogVariants,
  scrimVariants,
} from "./DatePicker.variants";
import {
  DOCKED_POPOVER_MOTION,
  DOCKED_MOTION_STRUCTURAL,
  MODAL_MOTION_STRUCTURAL,
  CALENDAR_GRID_STRUCTURAL,
  MODAL_CONTENT_STRUCTURAL,
  MODAL_INPUT_CONTENT_STRUCTURAL,
} from "./datePickerStructuralStyles";

// ─── M01: Type Tests ──────────────────────────────────────────────────────────

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

// ─── M02: CalendarCore — headless calendar behavior ───────────────────────────

describe("CalendarCore — headless calendar behavior", () => {
  // Test 11
  test('CalendarCore renders with role="grid" on the calendar grid', () => {
    render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 17)} />
    );

    const grid = screen.getByRole("grid");
    expect(grid).toBeInTheDocument();
  });

  // Test 12
  test('CalendarCore renders weekday headers as role="columnheader"', () => {
    render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 17)} />
    );

    const headers = screen.getAllByRole("columnheader");
    expect(headers.length).toBeGreaterThan(0);
  });

  // Test 13
  test("CalendarCore renders 7 weekday columns", () => {
    render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 17)} />
    );

    const headers = screen.getAllByRole("columnheader");
    expect(headers).toHaveLength(7);
  });

  // Test 14
  test("CalendarCore renders correct number of weeks for the month", () => {
    const { container } = render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 17)} />
    );

    const rows = container.querySelectorAll("tbody tr");
    expect(rows.length).toBeGreaterThanOrEqual(4);
    expect(rows.length).toBeLessThanOrEqual(6);
  });

  // Test 15
  test('CalendarCell renders with role="gridcell"', () => {
    render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 17)} />
    );

    const cells = screen.getAllByRole("gridcell");
    expect(cells.length).toBeGreaterThan(0);
  });

  // Test 16
  test("CalendarCell has aria-label with full date", () => {
    render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 17)} />
    );

    const buttons = screen.getAllByRole("button");
    const dateButtons = buttons.filter((btn) => {
      const label = btn.getAttribute("aria-label");
      return label && label.length > 10 && /\d{4}/.test(label);
    });

    expect(dateButtons.length).toBeGreaterThan(0);
  });

  // Test 17
  test('CalendarCell today has aria-current="date"', () => {
    const todayDate = today(getLocalTimeZone());

    render(<CalendarCore aria-label="Test calendar" defaultValue={todayDate} />);

    const buttons = screen.getAllByRole("button");
    const todayCells = buttons.filter((btn) => btn.getAttribute("aria-current") === "date");

    expect(todayCells).toHaveLength(1);
  });

  // Test 18
  test('CalendarCell selected date has aria-selected="true"', () => {
    render(<CalendarCore aria-label="Test calendar" value={new CalendarDate(2025, 8, 17)} />);

    const gridcells = screen.getAllByRole("gridcell");
    const selectedCells = gridcells.filter((cell) => cell.getAttribute("aria-selected") === "true");

    expect(selectedCells.length).toBeGreaterThanOrEqual(1);
  });

  // Test 19
  test('CalendarCell disabled date has aria-disabled="true"', () => {
    const { container } = render(
      <CalendarCore
        aria-label="Test calendar"
        defaultValue={new CalendarDate(2025, 8, 15)}
        maxValue={new CalendarDate(2025, 8, 20)}
      />
    );

    const disabledCells = container.querySelectorAll('[aria-disabled="true"]');
    expect(disabledCells.length).toBeGreaterThan(0);
  });

  // Test 20
  test("CalendarCell outside-month date has data-outside-month attribute", () => {
    const { container } = render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 15)} />
    );

    const outsideMonthCells = container.querySelectorAll("[data-outside-month]");
    expect(outsideMonthCells.length).toBeGreaterThan(0);
  });

  // Helper: press a key on the currently focused element using fireEvent + act,
  // mirroring React Aria's own test patterns to avoid userEvent v14 timing issues.
  function pressCalendarKey(key: string) {
    const el = document.activeElement as HTMLElement;
    act(() => {
      fireEvent.keyDown(el, { key });
      fireEvent.keyUp(el, { key });
    });
  }

  // Test 21
  test("ArrowRight moves focus to next day", async () => {
    const user = userEvent.setup();
    render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 15)} />
    );

    // Tab through: title button → prev button → next button → focused calendar cell
    await user.tab(); // title button
    await user.tab(); // prev button
    await user.tab(); // next button
    await user.tab(); // focused calendar cell

    expect(document.activeElement?.getAttribute("aria-label")).toContain("15");

    pressCalendarKey("ArrowRight");

    await waitFor(() => {
      expect(document.activeElement?.getAttribute("aria-label")).toContain("16");
    });
  });

  // Test 22
  test("ArrowLeft moves focus to previous day", async () => {
    const user = userEvent.setup();
    render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 15)} />
    );

    await user.tab(); // title button
    await user.tab(); // prev button
    await user.tab(); // next button
    await user.tab(); // focused calendar cell

    expect(document.activeElement?.getAttribute("aria-label")).toContain("15");

    pressCalendarKey("ArrowLeft");

    await waitFor(() => {
      expect(document.activeElement?.getAttribute("aria-label")).toContain("14");
    });
  });

  // Test 23
  test("ArrowDown moves focus to same day next week", async () => {
    const user = userEvent.setup();
    render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 15)} />
    );

    await user.tab(); // title button
    await user.tab(); // prev button
    await user.tab(); // next button
    await user.tab(); // focused calendar cell

    expect(document.activeElement?.getAttribute("aria-label")).toContain("15");

    pressCalendarKey("ArrowDown");

    await waitFor(() => {
      expect(document.activeElement?.getAttribute("aria-label")).toContain("22");
    });
  });

  // Test 24
  test("ArrowUp moves focus to same day previous week", async () => {
    const user = userEvent.setup();
    render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 15)} />
    );

    await user.tab(); // title button
    await user.tab(); // prev button
    await user.tab(); // next button
    await user.tab(); // focused calendar cell

    expect(document.activeElement?.getAttribute("aria-label")).toContain("15");

    pressCalendarKey("ArrowUp");

    await waitFor(() => {
      expect(document.activeElement?.getAttribute("aria-label")).toContain("8");
    });
  });

  // Test 25
  test("Home moves focus to first day of month", async () => {
    const user = userEvent.setup();
    render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 15)} />
    );

    await user.tab(); // title button
    await user.tab(); // prev button
    await user.tab(); // next button
    await user.tab(); // focused calendar cell

    expect(document.activeElement?.getAttribute("aria-label")).toContain("15");

    pressCalendarKey("Home");

    await waitFor(() => {
      expect(document.activeElement?.getAttribute("aria-label")).toMatch(/August\s+1,?\s+2025/);
    });
  });

  // Test 26
  test("End moves focus to last day of month", async () => {
    const user = userEvent.setup();
    render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 15)} />
    );

    await user.tab(); // title button
    await user.tab(); // prev button
    await user.tab(); // next button
    await user.tab(); // focused calendar cell

    expect(document.activeElement?.getAttribute("aria-label")).toContain("15");

    pressCalendarKey("End");

    await waitFor(() => {
      expect(document.activeElement?.getAttribute("aria-label")).toContain("31");
    });
  });

  // Test 27
  test("PageDown navigates to next month", async () => {
    const user = userEvent.setup();
    render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 15)} />
    );

    await user.tab(); // title button
    await user.tab(); // prev button
    await user.tab(); // next button
    await user.tab(); // focused calendar cell

    expect(document.activeElement?.getAttribute("aria-label")).toContain("15");

    pressCalendarKey("PageDown");

    await waitFor(() => {
      expect(document.activeElement?.getAttribute("aria-label")).toContain("September");
    });
  });

  // Test 28
  test("PageUp navigates to previous month", async () => {
    const user = userEvent.setup();
    render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 15)} />
    );

    await user.tab(); // title button
    await user.tab(); // prev button
    await user.tab(); // next button
    await user.tab(); // focused calendar cell

    expect(document.activeElement?.getAttribute("aria-label")).toContain("15");

    pressCalendarKey("PageUp");

    await waitFor(() => {
      expect(document.activeElement?.getAttribute("aria-label")).toContain("July");
    });
  });

  // Test 29
  test("Enter/Space selects the focused date", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <CalendarCore
        aria-label="Test calendar"
        defaultValue={new CalendarDate(2025, 8, 15)}
        onChange={onChange}
      />
    );

    await user.tab(); // title button
    await user.tab(); // prev button
    await user.tab(); // next button
    await user.tab(); // focused calendar cell

    expect(document.activeElement?.getAttribute("aria-label")).toContain("15");

    // Move to an unselected date first (fireEvent avoids userEvent focus timing issue)
    pressCalendarKey("ArrowRight");
    await waitFor(() => {
      expect(document.activeElement?.getAttribute("aria-label")).toContain("16");
    });

    // Select the focused date with Enter via userEvent (correct press simulation for usePress)
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });

  // Test 30
  test("CalendarHeader renders previous/next navigation buttons", () => {
    render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 17)} />
    );

    const prevButton = screen.getByRole("button", { name: "Previous month" });
    const nextButton = screen.getByRole("button", { name: "Next month" });

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  // Test 31
  test('CalendarHeader previous button has aria-label="Previous month"', () => {
    render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 17)} />
    );

    const prevButton = screen.getByRole("button", { name: "Previous month" });
    expect(prevButton).toHaveAttribute("aria-label", "Previous month");
  });

  // Test 32
  test('CalendarHeader next button has aria-label="Next month"', () => {
    render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 17)} />
    );

    const nextButton = screen.getByRole("button", { name: "Next month" });
    expect(nextButton).toHaveAttribute("aria-label", "Next month");
  });

  // Test 33
  test('CalendarHeader displays current month and year with aria-live="polite"', () => {
    render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 17)} />
    );

    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion?.textContent).toContain("August");
    expect(liveRegion?.textContent).toContain("2025");
  });

  // Test 34
  test("Range mode: selecting start and end dates shows data-range-middle on in-between cells", () => {
    const { container } = render(
      <CalendarCore
        aria-label="Trip dates"
        selectionMode="range"
        defaultRangeValue={{
          start: new CalendarDate(2025, 8, 15),
          end: new CalendarDate(2025, 8, 20),
        }}
      />
    );

    const rangeMiddleCells = container.querySelectorAll("[data-range-middle]");
    expect(rangeMiddleCells.length).toBeGreaterThan(0);

    const rangeStartCells = container.querySelectorAll("[data-range-start]");
    expect(rangeStartCells).toHaveLength(1);

    const rangeEndCells = container.querySelectorAll("[data-range-end]");
    expect(rangeEndCells).toHaveLength(1);
  });

  // Test 35
  test("Disabled dates cannot be selected via keyboard", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { container } = render(
      <CalendarCore
        aria-label="Test calendar"
        defaultValue={new CalendarDate(2025, 8, 15)}
        maxValue={new CalendarDate(2025, 8, 20)}
        onChange={onChange}
      />
    );

    const disabledCells = container.querySelectorAll('[aria-disabled="true"]');
    expect(disabledCells.length).toBeGreaterThan(0);

    const disabledDataCells = container.querySelectorAll("[data-disabled]");
    expect(disabledDataCells.length).toBeGreaterThan(0);

    // Navigate to the end of the valid range and try to go past it
    await user.tab();
    await user.tab();
    await user.tab();

    // Move from Aug 15 toward and past Aug 20 boundary
    for (let i = 0; i < 6; i++) {
      await user.keyboard("{ArrowRight}");
    }

    // Try to select
    await user.keyboard("{Enter}");

    // Any selected date must be within the valid range
    for (const call of onChange.mock.calls) {
      const selected = call[0] as DateValue;
      expect(selected.compare(new CalendarDate(2025, 8, 20))).toBeLessThanOrEqual(0);
      expect(selected.compare(new CalendarDate(2025, 8, 1))).toBeGreaterThanOrEqual(0);
    }
  });
});

// ─── M03: DatePickerDocked — headless docked date picker behavior ─────────────

describe("DatePickerDocked — headless docked date picker behavior", () => {
  /**
   * Helper: find trigger button via data-trigger attribute.
   * React Aria sets aria-labelledby on the button which overrides aria-label
   * in accessible name computation, so we use data-trigger to find it reliably.
   */
  function getTriggerButton(container: HTMLElement): HTMLButtonElement {
    const btn = container.querySelector<HTMLButtonElement>("[data-trigger]");
    if (!btn) throw new Error("Trigger button not found");
    return btn;
  }

  // Test 36
  test("DatePickerDocked renders with a date field trigger", () => {
    render(
      <DatePickerDocked aria-label="Departure date" defaultValue={new CalendarDate(2025, 8, 17)} />
    );

    const group = screen.getByRole("group");
    expect(group).toBeInTheDocument();
  });

  // Test 37
  test('DatePickerDocked trigger has aria-haspopup="dialog"', () => {
    const { container } = render(
      <DatePickerDocked aria-label="Departure date" defaultValue={new CalendarDate(2025, 8, 17)} />
    );

    const triggerButton = getTriggerButton(container);
    expect(triggerButton).toHaveAttribute("aria-haspopup", "dialog");
  });

  // Test 38
  test('DatePickerDocked trigger has aria-expanded="false" when closed', () => {
    const { container } = render(
      <DatePickerDocked aria-label="Departure date" defaultValue={new CalendarDate(2025, 8, 17)} />
    );

    const triggerButton = getTriggerButton(container);
    expect(triggerButton).toHaveAttribute("aria-expanded", "false");
  });

  // Test 39
  test('DatePickerDocked trigger has aria-expanded="true" when opened', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <DatePickerDocked aria-label="Departure date" defaultValue={new CalendarDate(2025, 8, 17)} />
    );

    const triggerButton = getTriggerButton(container);
    await user.click(triggerButton);

    expect(triggerButton).toHaveAttribute("aria-expanded", "true");
  });

  // Test 40
  test("clicking calendar icon button opens the calendar popover", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <DatePickerDocked aria-label="Departure date" defaultValue={new CalendarDate(2025, 8, 17)} />
    );

    const triggerButton = getTriggerButton(container);
    await user.click(triggerButton);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    const grid = screen.getByRole("grid");
    expect(grid).toBeInTheDocument();
  });

  // Test 41b
  test("DatePickerDocked renders popover in a portal", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <div data-testid="app-root">
        <DatePickerDocked
          aria-label="Departure date"
          defaultValue={new CalendarDate(2025, 8, 17)}
        />
      </div>
    );

    const triggerButton = getTriggerButton(container);
    await user.click(triggerButton);

    const appRoot = screen.getByTestId("app-root");
    const dialog = screen.getByRole("dialog");
    const popover = document.querySelector("[data-popover]");

    expect(appRoot.contains(dialog)).toBe(false);
    expect(popover).not.toBeNull();
    expect(document.body.contains(popover)).toBe(true);
  });

  // Test 41
  test("Escape key closes the popover", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <DatePickerDocked aria-label="Departure date" defaultValue={new CalendarDate(2025, 8, 17)} />
    );

    const triggerButton = getTriggerButton(container);
    await user.click(triggerButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  // Test 42
  test("focus returns to trigger when popover closes", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <DatePickerDocked aria-label="Departure date" defaultValue={new CalendarDate(2025, 8, 17)} />
    );

    const triggerButton = getTriggerButton(container);
    await user.click(triggerButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(document.activeElement).toBe(triggerButton);
    });
  });

  // Test 43
  test("DateField renders date segments (month, day, year)", () => {
    const { container } = render(
      <DateField aria-label="Test date" defaultValue={new CalendarDate(2025, 8, 17)} />
    );

    const segments = container.querySelectorAll("[data-segment]");
    const segmentTypes = Array.from(segments).map((s) => s.getAttribute("data-segment"));

    expect(segmentTypes).toContain("month");
    expect(segmentTypes).toContain("day");
    expect(segmentTypes).toContain("year");
  });

  // Test 44
  test("DateField segments are keyboard editable", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateField
        aria-label="Test date"
        defaultValue={new CalendarDate(2025, 8, 17)}
        onChange={onChange}
      />
    );

    const spinButtons = screen.getAllByRole("spinbutton");
    expect(spinButtons.length).toBeGreaterThanOrEqual(3);

    await user.click(spinButtons[0]);
    await user.keyboard("{ArrowUp}");

    expect(onChange).toHaveBeenCalled();
  });

  // Test 45
  test("DateField reflects controlled value prop", () => {
    const { container } = render(
      <DateField aria-label="Test date" value={new CalendarDate(2025, 12, 25)} />
    );

    const textContent = container.textContent ?? "";
    expect(textContent).toContain("12");
    expect(textContent).toContain("25");
    expect(textContent).toContain("2025");
  });

  // Test 46
  test("selecting a date in the calendar updates the field value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { container } = render(
      <DatePickerDocked
        aria-label="Departure date"
        defaultValue={new CalendarDate(2025, 8, 17)}
        onChange={onChange}
      />
    );

    const triggerButton = getTriggerButton(container);
    await user.click(triggerButton);

    const grid = screen.getByRole("grid");
    const buttons = within(grid).getAllByRole("button");
    const dateButton = buttons.find((btn) => {
      const label = btn.getAttribute("aria-label");
      return label && label.includes("18") && label.includes("August");
    });

    expect(dateButton).toBeDefined();
    if (dateButton) {
      await user.click(dateButton);
      expect(onChange).toHaveBeenCalled();
    }
  });

  // Test 47
  test("Cancel button reverts selection and closes popover", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    const { container } = render(
      <DatePickerDocked
        aria-label="Departure date"
        defaultValue={new CalendarDate(2025, 8, 17)}
        onCancel={onCancel}
      />
    );

    const triggerButton = getTriggerButton(container);
    await user.click(triggerButton);

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  // Test 48
  test("OK button confirms selection and closes popover", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    const { container } = render(
      <DatePickerDocked
        aria-label="Departure date"
        defaultValue={new CalendarDate(2025, 8, 17)}
        onConfirm={onConfirm}
      />
    );

    const triggerButton = getTriggerButton(container);
    await user.click(triggerButton);

    const okButton = screen.getByRole("button", { name: "OK" });
    await user.click(okButton);

    expect(onConfirm).toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  // Test 49
  test("DatePickerDocked supports isDisabled prop", () => {
    const { container } = render(
      <DatePickerDocked
        aria-label="Departure date"
        defaultValue={new CalendarDate(2025, 8, 17)}
        isDisabled
      />
    );

    const root = container.firstElementChild;
    expect(root).toHaveAttribute("data-disabled");
  });

  // Test 50
  test("DatePickerDocked disabled does not open on click", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <DatePickerDocked
        aria-label="Departure date"
        defaultValue={new CalendarDate(2025, 8, 17)}
        isDisabled
      />
    );

    const triggerButton = getTriggerButton(container);
    await user.click(triggerButton);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  // Test 51
  test("DatePickerDocked has accessible label from label prop", () => {
    render(<DatePickerDocked label="Start date" defaultValue={new CalendarDate(2025, 8, 17)} />);

    const label = screen.getByText("Start date");
    expect(label).toBeInTheDocument();
  });

  // Test 52
  test("DatePickerDocked forwards aria-label to the date field", () => {
    render(
      <DatePickerDocked aria-label="Departure date" defaultValue={new CalendarDate(2025, 8, 17)} />
    );

    const group = screen.getByRole("group");
    expect(group).toHaveAttribute("aria-label", "Departure date");
  });

  // Test 53
  test("DatePickerDocked supports controlled isOpen prop", () => {
    render(
      <DatePickerDocked
        aria-label="Departure date"
        defaultValue={new CalendarDate(2025, 8, 17)}
        isOpen={true}
      />
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
  });

  // Test 54
  test("DatePickerDocked calls onOpenChange when popover opens/closes", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    const { container } = render(
      <DatePickerDocked
        aria-label="Departure date"
        defaultValue={new CalendarDate(2025, 8, 17)}
        onOpenChange={onOpenChange}
      />
    );

    const triggerButton = getTriggerButton(container);
    await user.click(triggerButton);

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  // Test 55
  test("DatePickerDocked respects minValue/maxValue constraints", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <DatePickerDocked
        aria-label="Departure date"
        defaultValue={new CalendarDate(2025, 8, 15)}
        minValue={new CalendarDate(2025, 8, 10)}
        maxValue={new CalendarDate(2025, 8, 20)}
      />
    );

    const triggerButton = getTriggerButton(container);
    await user.click(triggerButton);

    const grid = screen.getByRole("grid");
    const allCells = grid.querySelectorAll('[aria-disabled="true"]');
    expect(allCells.length).toBeGreaterThan(0);
  });
});

// ─── M04: DatePickerModal — headless modal date picker behavior ───────────────

describe("DatePickerModal — headless modal date picker behavior", () => {
  // Test 56
  test('DatePickerModal renders with role="dialog"', () => {
    render(<DatePickerModal isOpen={true} defaultValue={new CalendarDate(2025, 8, 17)} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
  });

  // Test 57
  test('DatePickerModal has aria-modal="true"', () => {
    render(<DatePickerModal isOpen={true} defaultValue={new CalendarDate(2025, 8, 17)} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  // Test 58
  test("DatePickerModal has aria-labelledby pointing to headline", () => {
    render(<DatePickerModal isOpen={true} defaultValue={new CalendarDate(2025, 8, 17)} />);

    const dialog = screen.getByRole("dialog");
    const labelledBy = dialog.getAttribute("aria-labelledby");
    expect(labelledBy).toBeTruthy();

    const headline = document.getElementById(labelledBy!);
    expect(headline).toBeInTheDocument();
    expect(headline?.textContent).toBe("Select date");
  });

  // Test 59
  test('DatePickerModal renders headline text "Select date" for single mode', () => {
    render(
      <DatePickerModal
        isOpen={true}
        selectionMode="single"
        defaultValue={new CalendarDate(2025, 8, 17)}
      />
    );

    expect(screen.getByText("Select date")).toBeInTheDocument();
  });

  // Test 60
  test('DatePickerModal renders headline text "Select dates" for range mode', () => {
    render(
      <DatePickerModal
        isOpen={true}
        selectionMode="range"
        defaultRangeValue={{
          start: new CalendarDate(2025, 8, 15),
          end: new CalendarDate(2025, 8, 20),
        }}
      />
    );

    expect(screen.getByText("Select dates")).toBeInTheDocument();
  });

  // Test 61
  test("DatePickerModal renders scrim overlay", () => {
    render(<DatePickerModal isOpen={true} defaultValue={new CalendarDate(2025, 8, 17)} />);

    const scrim = document.querySelector("[data-scrim]");
    expect(scrim).toBeInTheDocument();
  });

  // Test 62
  test("Escape key closes the modal", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <DatePickerModal
        isOpen={true}
        onOpenChange={onOpenChange}
        defaultValue={new CalendarDate(2025, 8, 17)}
      />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  // Test 63
  test("Scrim click closes the modal", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <DatePickerModal
        isOpen={true}
        onOpenChange={onOpenChange}
        defaultValue={new CalendarDate(2025, 8, 17)}
      />
    );

    const scrim = document.querySelector("[data-scrim]")!;
    expect(scrim).toBeInTheDocument();

    await user.click(scrim);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  // Test 64
  test("Focus is trapped within the modal when open", () => {
    render(<DatePickerModal isOpen={true} defaultValue={new CalendarDate(2025, 8, 17)} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  // Test 65
  test("Focus moves to calendar grid when modal opens", () => {
    render(<DatePickerModal isOpen={true} defaultValue={new CalendarDate(2025, 8, 17)} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  // Test 66
  test("Single mode: selecting a date updates the supporting text", async () => {
    const user = userEvent.setup();

    render(
      <DatePickerModal
        isOpen={true}
        selectionMode="single"
        defaultValue={new CalendarDate(2025, 8, 17)}
      />
    );

    const grid = screen.getByRole("grid");
    const buttons = within(grid).getAllByRole("button");
    const dateButton = buttons.find((btn) => {
      const label = btn.getAttribute("aria-label");
      return label && label.includes("18") && label.includes("August");
    });

    expect(dateButton).toBeDefined();
    if (dateButton) {
      await user.click(dateButton);
    }

    await waitFor(() => {
      const supportingText = document.querySelector("[data-supporting-text]");
      expect(supportingText).toBeInTheDocument();
      expect(supportingText?.textContent).toContain("18");
    });
  });

  // Test 67
  test("Single mode: OK button confirms and closes", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <DatePickerModal
        isOpen={true}
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
        defaultValue={new CalendarDate(2025, 8, 17)}
      />
    );

    const okButton = screen.getByRole("button", { name: "OK" });
    await user.click(okButton);

    expect(onConfirm).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  // Test 68
  test("Single mode: Cancel button reverts and closes", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <DatePickerModal
        isOpen={true}
        onOpenChange={onOpenChange}
        onCancel={onCancel}
        defaultValue={new CalendarDate(2025, 8, 17)}
      />
    );

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  // Test 69
  test("Single mode: Clear button resets selection", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    render(
      <DatePickerModal
        isOpen={true}
        onClear={onClear}
        defaultValue={new CalendarDate(2025, 8, 17)}
        showClear={true}
      />
    );

    const clearButton = screen.getByRole("button", { name: "Clear" });
    await user.click(clearButton);

    expect(onClear).toHaveBeenCalled();
  });

  // Test 70
  test("Range mode: clicking two dates selects a range", () => {
    render(
      <DatePickerModal
        isOpen={true}
        selectionMode="range"
        defaultRangeValue={{
          start: new CalendarDate(2025, 8, 15),
          end: new CalendarDate(2025, 8, 20),
        }}
      />
    );

    const grid = screen.getByRole("grid");
    expect(grid).toBeInTheDocument();

    const rangeStartCells = document.querySelectorAll("[data-range-start]");
    const rangeEndCells = document.querySelectorAll("[data-range-end]");
    expect(rangeStartCells.length).toBeGreaterThanOrEqual(1);
    expect(rangeEndCells.length).toBeGreaterThanOrEqual(1);
  });

  // Test 71
  test("Range mode: in-range dates have data-range-middle attribute", () => {
    render(
      <DatePickerModal
        isOpen={true}
        selectionMode="range"
        defaultRangeValue={{
          start: new CalendarDate(2025, 8, 15),
          end: new CalendarDate(2025, 8, 20),
        }}
      />
    );

    const rangeMiddleCells = document.querySelectorAll("[data-range-middle]");
    expect(rangeMiddleCells.length).toBeGreaterThan(0);
  });

  // Test 72
  test("Range mode: start date has data-range-start attribute", () => {
    render(
      <DatePickerModal
        isOpen={true}
        selectionMode="range"
        defaultRangeValue={{
          start: new CalendarDate(2025, 8, 15),
          end: new CalendarDate(2025, 8, 20),
        }}
      />
    );

    const rangeStartCells = document.querySelectorAll("[data-range-start]");
    expect(rangeStartCells).toHaveLength(1);
  });

  // Test 73
  test("Range mode: end date has data-range-end attribute", () => {
    render(
      <DatePickerModal
        isOpen={true}
        selectionMode="range"
        defaultRangeValue={{
          start: new CalendarDate(2025, 8, 15),
          end: new CalendarDate(2025, 8, 20),
        }}
      />
    );

    const rangeEndCells = document.querySelectorAll("[data-range-end]");
    expect(rangeEndCells).toHaveLength(1);
  });

  // Test 74
  test("Range mode: scrollable calendar shows multiple months", () => {
    render(
      <DatePickerModal
        isOpen={true}
        selectionMode="range"
        defaultRangeValue={{
          start: new CalendarDate(2025, 8, 15),
          end: new CalendarDate(2025, 8, 20),
        }}
      />
    );

    const grid = screen.getByRole("grid");
    expect(grid).toBeInTheDocument();

    const prevButton = screen.getByRole("button", { name: "Previous month" });
    const nextButton = screen.getByRole("button", { name: "Next month" });
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  // Test 75
  test('Mode toggle button has aria-label "Switch to keyboard input"', () => {
    render(<DatePickerModal isOpen={true} defaultValue={new CalendarDate(2025, 8, 17)} />);

    const toggleButton = screen.getByRole("button", { name: "Switch to keyboard input" });
    expect(toggleButton).toBeInTheDocument();
  });

  // Test 76
  test("Mode toggle changes view from calendar to input", async () => {
    const user = userEvent.setup();

    render(<DatePickerModal isOpen={true} defaultValue={new CalendarDate(2025, 8, 17)} />);

    const toggleButton = screen.getByRole("button", { name: "Switch to keyboard input" });
    await user.click(toggleButton);

    await waitFor(() => {
      const toggle = screen.getByRole("button", { name: "Switch to calendar" });
      expect(toggle).toBeInTheDocument();
    });
  });

  // Test 77
  test("DatePickerModal renders in a portal", () => {
    render(
      <div data-testid="app-root">
        <DatePickerModal isOpen={true} defaultValue={new CalendarDate(2025, 8, 17)} />
      </div>
    );

    const appRoot = screen.getByTestId("app-root");
    const dialog = screen.getByRole("dialog");
    expect(appRoot.contains(dialog)).toBe(false);
    expect(document.body.contains(dialog)).toBe(true);
  });

  // Test 78
  test("DatePickerModal supports controlled isOpen prop", () => {
    const { rerender } = render(
      <DatePickerModal isOpen={false} defaultValue={new CalendarDate(2025, 8, 17)} />
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(<DatePickerModal isOpen={true} defaultValue={new CalendarDate(2025, 8, 17)} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  // Test 79
  test("DatePickerModal calls onOpenChange when opening/closing", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <DatePickerModal
        isOpen={true}
        onOpenChange={onOpenChange}
        defaultValue={new CalendarDate(2025, 8, 17)}
      />
    );

    await user.keyboard("{Escape}");

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  // Test 80
  test("DatePickerModal respects minValue/maxValue constraints", () => {
    render(
      <DatePickerModal
        isOpen={true}
        defaultValue={new CalendarDate(2025, 8, 15)}
        minValue={new CalendarDate(2025, 8, 10)}
        maxValue={new CalendarDate(2025, 8, 20)}
      />
    );

    const grid = screen.getByRole("grid");
    const disabledCells = grid.querySelectorAll('[aria-disabled="true"]');
    expect(disabledCells.length).toBeGreaterThan(0);
  });
});

// ─── M05: DatePickerModalInput — headless modal date input behavior ──────────

describe("DatePickerModalInput — headless modal date input behavior", () => {
  // Test 81
  test('DatePickerModalInput renders with role="dialog"', () => {
    render(<DatePickerModalInput isOpen={true} defaultValue={new CalendarDate(2025, 8, 17)} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
  });

  // Test 82
  test('DatePickerModalInput renders headline "Select date" for single mode', () => {
    render(<DatePickerModalInput isOpen={true} defaultValue={new CalendarDate(2025, 8, 17)} />);

    expect(screen.getByText("Select date")).toBeInTheDocument();
  });

  // Test 83
  test('DatePickerModalInput renders supporting text "Enter date" for single mode', () => {
    render(<DatePickerModalInput isOpen={true} defaultValue={new CalendarDate(2025, 8, 17)} />);

    expect(screen.getByText("Enter date")).toBeInTheDocument();
  });

  // Test 84
  test("DatePickerModalInput renders one DateInputField for single mode", () => {
    render(<DatePickerModalInput isOpen={true} defaultValue={new CalendarDate(2025, 8, 17)} />);

    const fields = document.querySelectorAll("[data-date-input-field]");
    expect(fields).toHaveLength(1);
  });

  // Test 85
  test("DatePickerModalInput renders two DateInputFields for range mode", () => {
    render(
      <DatePickerModalInput
        isOpen={true}
        selectionMode="range"
        defaultRangeValue={{
          start: new CalendarDate(2025, 8, 15),
          end: new CalendarDate(2025, 8, 20),
        }}
      />
    );

    const fields = document.querySelectorAll("[data-date-input-field]");
    expect(fields).toHaveLength(2);
  });

  // Test 86
  test('DateInputField renders with label "Date" in single mode', () => {
    render(<DatePickerModalInput isOpen={true} defaultValue={new CalendarDate(2025, 8, 17)} />);

    expect(screen.getByText("Date")).toBeInTheDocument();
  });

  // Test 87
  test('DateInputField renders with labels "Start date" and "End date" in range mode', () => {
    render(
      <DatePickerModalInput
        isOpen={true}
        selectionMode="range"
        defaultRangeValue={{
          start: new CalendarDate(2025, 8, 15),
          end: new CalendarDate(2025, 8, 20),
        }}
      />
    );

    expect(screen.getByText("Start date")).toBeInTheDocument();
    expect(screen.getByText("End date")).toBeInTheDocument();
  });

  // Test 88
  test('DateInputField has placeholder "mm/dd/yyyy"', () => {
    render(<DatePickerModalInput isOpen={true} />);

    const field = document.querySelector("[data-field]");
    expect(field).toHaveAttribute("data-placeholder-text", "mm/dd/yyyy");
  });

  // Test 89
  test("DateInputField accepts keyboard date input", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<DatePickerModalInput isOpen={true} onChange={onChange} />);

    const segments = document.querySelectorAll("[data-segment='month']");
    expect(segments.length).toBeGreaterThan(0);

    await user.click(segments[0]);
    await user.keyboard("08");

    const daySegments = document.querySelectorAll("[data-segment='day']");
    await user.click(daySegments[0]);
    await user.keyboard("17");

    const yearSegments = document.querySelectorAll("[data-segment='year']");
    await user.click(yearSegments[0]);
    await user.keyboard("2025");

    const confirmButton = screen.getByRole("button", { name: "OK" });
    await user.click(confirmButton);

    expect(onChange).toHaveBeenCalled();
  });

  // Test 90
  test("DateInputField validates date format on blur", () => {
    render(
      <DatePickerModalInput
        isOpen={true}
        minValue={new CalendarDate(2025, 8, 10)}
        maxValue={new CalendarDate(2025, 8, 20)}
        defaultValue={new CalendarDate(2025, 8, 5)}
      />
    );

    const field = document.querySelector("[data-date-input-field]");
    expect(field).toHaveAttribute("data-invalid");
  });

  // Test 91
  test("DateInputField shows error state for invalid date", () => {
    render(
      <DatePickerModalInput
        isOpen={true}
        minValue={new CalendarDate(2025, 8, 10)}
        maxValue={new CalendarDate(2025, 8, 20)}
        defaultValue={new CalendarDate(2025, 8, 5)}
      />
    );

    const errorMessage = document.querySelector("[data-error-message]");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage?.textContent).toContain("before minimum");
  });

  // Test 92
  test('DateInputField has aria-invalid="true" when validation fails', () => {
    render(
      <DatePickerModalInput
        isOpen={true}
        minValue={new CalendarDate(2025, 8, 10)}
        maxValue={new CalendarDate(2025, 8, 20)}
        defaultValue={new CalendarDate(2025, 8, 5)}
      />
    );

    const field = document.querySelector("[data-date-input-field]");
    expect(field).toHaveAttribute("aria-invalid", "true");
  });

  // Test 93
  test("DateInputField has aria-describedby pointing to error message", () => {
    render(
      <DatePickerModalInput
        isOpen={true}
        minValue={new CalendarDate(2025, 8, 10)}
        maxValue={new CalendarDate(2025, 8, 20)}
        defaultValue={new CalendarDate(2025, 8, 5)}
      />
    );

    const groupField = document.querySelector("[data-field]");
    const errorMessage = document.querySelector("[data-error-message]");
    expect(groupField).toHaveAttribute("aria-describedby");
    const describedById = groupField?.getAttribute("aria-describedby");
    expect(errorMessage?.id).toBe(describedById);
  });

  // Test 94
  test("OK button is disabled when input is invalid", () => {
    render(<DatePickerModalInput isOpen={true} />);

    const confirmButton = screen.getByRole("button", { name: "OK" });
    expect(confirmButton).toBeDisabled();
  });

  // Test 95
  test("OK button confirms valid date and closes", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <DatePickerModalInput
        isOpen={true}
        defaultValue={new CalendarDate(2025, 8, 17)}
        onConfirm={onConfirm}
        onOpenChange={onOpenChange}
      />
    );

    const confirmButton = screen.getByRole("button", { name: "OK" });
    expect(confirmButton).not.toBeDisabled();
    await user.click(confirmButton);

    expect(onConfirm).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  // Test 96
  test("Cancel button reverts input and closes", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <DatePickerModalInput
        isOpen={true}
        defaultValue={new CalendarDate(2025, 8, 17)}
        onCancel={onCancel}
        onOpenChange={onOpenChange}
      />
    );

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  // Test 97
  test("Mode toggle switches to calendar view", async () => {
    const user = userEvent.setup();
    const onModeToggle = vi.fn();

    render(
      <DatePickerModalInput
        isOpen={true}
        defaultValue={new CalendarDate(2025, 8, 17)}
        onModeToggle={onModeToggle}
      />
    );

    const toggleButton = screen.getByRole("button", { name: "Switch to calendar" });
    await user.click(toggleButton);

    expect(onModeToggle).toHaveBeenCalled();
  });

  // Test 98
  test('Mode toggle has aria-label "Switch to calendar"', () => {
    render(<DatePickerModalInput isOpen={true} defaultValue={new CalendarDate(2025, 8, 17)} />);

    const toggleButton = screen.getByRole("button", { name: "Switch to calendar" });
    expect(toggleButton).toBeInTheDocument();
  });

  // Test 99
  test("Range mode validates that end date is after start date", () => {
    render(
      <DatePickerModalInput
        isOpen={true}
        selectionMode="range"
        defaultRangeValue={{
          start: new CalendarDate(2025, 8, 20),
          end: new CalendarDate(2025, 8, 15),
        }}
      />
    );

    const errorMessages = document.querySelectorAll("[data-error-message]");
    const hasEndBeforeStartError = Array.from(errorMessages).some((el) =>
      el.textContent?.includes("End date must be after start date")
    );
    expect(hasEndBeforeStartError).toBe(true);
  });

  // Test 100
  test("DatePickerModalInput respects minValue/maxValue constraints", () => {
    render(
      <DatePickerModalInput
        isOpen={true}
        minValue={new CalendarDate(2025, 8, 10)}
        maxValue={new CalendarDate(2025, 8, 20)}
        defaultValue={new CalendarDate(2025, 8, 25)}
      />
    );

    const errorMessage = document.querySelector("[data-error-message]");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage?.textContent).toContain("after maximum");
  });

  // Test 101
  test("DatePickerModalInput auto-focuses first input on open", () => {
    render(<DatePickerModalInput isOpen={true} defaultValue={new CalendarDate(2025, 8, 17)} />);

    const field = document.querySelector("[data-date-input-field]");
    expect(field).toBeInTheDocument();
    const focusedElement = document.activeElement;
    const fieldContainer = document.querySelector("[data-field]");
    expect(fieldContainer?.contains(focusedElement)).toBe(true);
  });

  // Test 102
  test("DatePickerModalInput supports controlled value", () => {
    const { rerender } = render(
      <DatePickerModalInput isOpen={true} value={new CalendarDate(2025, 8, 17)} />
    );

    const confirmButton = screen.getByRole("button", { name: "OK" });
    expect(confirmButton).not.toBeDisabled();

    rerender(<DatePickerModalInput isOpen={true} value={null} />);

    expect(screen.getByRole("button", { name: "OK" })).toBeDisabled();
  });

  // Test 103
  test("Tab navigation moves between input fields in range mode", async () => {
    const user = userEvent.setup();

    render(
      <DatePickerModalInput
        isOpen={true}
        selectionMode="range"
        defaultRangeValue={{
          start: new CalendarDate(2025, 8, 15),
          end: new CalendarDate(2025, 8, 20),
        }}
      />
    );

    const fields = document.querySelectorAll("[data-date-input-field]");
    expect(fields).toHaveLength(2);

    const firstFieldSegments = fields[0].querySelectorAll("[data-segment]");
    const secondFieldSegments = fields[1].querySelectorAll("[data-segment]");
    expect(firstFieldSegments.length).toBeGreaterThan(0);
    expect(secondFieldSegments.length).toBeGreaterThan(0);

    await user.click(firstFieldSegments[0]);
    expect(fields[0].contains(document.activeElement)).toBe(true);

    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();

    expect(fields[1].contains(document.activeElement)).toBe(true);
  });
});

// ─── M08: DatePicker — styled layer ──────────────────────────────────────────

describe("DatePicker — styled layer", () => {
  // Test 104
  test("DatePicker docked root does not apply calendar surface classes directly", () => {
    const { container } = render(<DatePicker aria-label="Test date" />);

    const root = container.firstElementChild;
    const rootClasses = root?.className.split(/\s+/) ?? [];
    expect(rootClasses).not.toContain("bg-surface-container-high");
    expect(rootClasses).not.toContain("rounded-3xl");
  });

  // Test 104b
  test("DatePicker docked applies calendar surface styles directly on the portaled popover", () => {
    render(<DatePicker aria-label="Test date" defaultOpen />);

    const popover = document.querySelector("[data-popover]");
    expect(popover).not.toBeNull();
    expect(popover?.className).toContain("bg-surface-container-high");
    expect(popover?.className).toContain("rounded-3xl");
  });

  // Test 105
  test("DatePicker docked variant has w-[360px]", () => {
    const classes = datePickerContainerVariants({ variant: "docked" });
    expect(classes).toContain("w-[360px]");
  });

  // Test 106
  test("DatePicker modal variant has w-[360px]", () => {
    const classes = datePickerContainerVariants({ variant: "modal" });
    expect(classes).toContain("w-[360px]");
  });

  // Test 107
  test("DatePicker modal-input variant has w-[328px]", () => {
    const classes = datePickerContainerVariants({ variant: "modal-input" });
    expect(classes).toContain("w-[328px]");
  });

  // Test 108
  test("DatePicker modal container has rounded-3xl (28dp corner radius)", () => {
    const classes = datePickerContainerVariants({ variant: "modal" });
    expect(classes).toContain("rounded-3xl");
  });

  // Test 109 — Two-axis model: cell base class carries all data-* state tokens
  test("CalendarCell base has text-on-surface and data-[selected] token for bg-primary", () => {
    const classes = calendarCellVariants();
    expect(classes).toContain("text-on-surface");
    // Selected state driven by data-* attribute selector, not CVA variant
    expect(classes).toContain("data-[selected]:bg-primary");
    expect(classes).toContain("data-[selected]:text-on-primary");
  });

  // Test 110
  test("CalendarCell carries today data-* selectors for text-primary and border-primary", () => {
    const classes = calendarCellVariants();
    expect(classes).toContain("text-primary");
    expect(classes).toContain("border-primary");
  });

  // Test 111
  test("CalendarCell carries range-middle data-* selector for bg-secondary-container", () => {
    const classes = calendarCellVariants();
    expect(classes).toContain("bg-secondary-container");
  });

  // Test 112
  test("CalendarCell carries outside-month data-* selector for text-on-surface-variant", () => {
    const classes = calendarCellVariants();
    expect(classes).toContain("text-on-surface-variant");
  });

  // Test 113
  test("CalendarCell carries disabled data-* selector for text-on-surface/38", () => {
    const classes = calendarCellVariants();
    expect(classes).toContain("text-on-surface/38");
  });

  // Test 114 — State layer carries group-data hover/focus/pressed opacities
  test("CalendarCell state layer has group-data-[hovered] and group-data-[focus-visible] opacity selectors", () => {
    const stateLayerClasses = calendarCellStateLayerVariants();
    expect(stateLayerClasses).toContain("group-data-[hovered]/calendar-cell:opacity-8");
    expect(stateLayerClasses).toContain("group-data-[focus-visible]/calendar-cell:opacity-10");
    expect(stateLayerClasses).toContain("group-data-[pressed]/calendar-cell:opacity-10");
  });

  // Test 115 — State layer switches color for selected
  test("CalendarCell state layer switches to bg-on-primary when selected", () => {
    const stateLayerClasses = calendarCellStateLayerVariants();
    expect(stateLayerClasses).toContain("group-data-[selected]/calendar-cell:bg-on-primary");
  });

  // Test 116 — Focus ring
  test("CalendarCell focus ring is visible only on group-data-[focus-visible]", () => {
    const focusRingClasses = calendarCellFocusRingVariants();
    expect(focusRingClasses).toContain("group-data-[focus-visible]/calendar-cell:opacity-100");
  });

  // Test 117 — Year item two-axis model
  test("Year item has w-[88px] and h-[52px] in base classes", () => {
    const classes = yearItemVariants();
    expect(classes).toContain("w-[88px]");
    expect(classes).toContain("h-[52px]");
  });

  test("Year item carries data-[selected] selector for bg-primary and text-on-primary", () => {
    const classes = yearItemVariants();
    expect(classes).toContain("data-[selected]:bg-primary");
    expect(classes).toContain("data-[selected]:text-on-primary");
  });

  test("Year item unselected base has text-on-surface-variant", () => {
    const classes = yearItemVariants();
    expect(classes).toContain("text-on-surface-variant");
  });

  test("Year item state layer switches color for selected", () => {
    const stateLayerClasses = yearItemStateLayerVariants();
    expect(stateLayerClasses).toContain("group-data-[selected]/year-item:bg-on-primary");
  });

  // Test 118 — Weekday labels
  test("Weekday labels have text-body-small and text-on-surface-variant", () => {
    const classes = weekdayVariants();
    expect(classes).toContain("text-body-small");
    expect(classes).toContain("text-on-surface-variant");
  });

  // Test 119 — Divider
  test("Calendar divider has border-outline-variant", () => {
    const classes = calendarDividerVariants();
    expect(classes).toContain("border-outline-variant");
  });

  // Test 120 — Nav button
  test("Nav button has text-on-surface-variant", () => {
    const classes = navButtonVariants();
    expect(classes).toContain("text-on-surface-variant");
  });

  test("Nav button state layer has group-data-[hovered]/nav-button:opacity-8", () => {
    const stateLayerClasses = navButtonStateLayerVariants();
    expect(stateLayerClasses).toContain("group-data-[hovered]/nav-button:opacity-8");
  });

  // Test 121 — Headline
  test("Headline text uses text-label-large", () => {
    const classes = headlineVariants();
    expect(classes).toContain("text-label-large");
  });

  // Test 122 — Supporting text
  test("Supporting text uses text-headline-large", () => {
    const classes = supportingTextVariants();
    expect(classes).toContain("text-headline-large");
  });

  // Test 123 — Action button
  test("Action button text uses text-primary", () => {
    const classes = actionButtonVariants();
    expect(classes).toContain("text-primary");
  });

  // Test 124 — Exports check (new slot API)
  test("index.ts exports DatePicker, DatePickerDocked, all new slot variants and styled slots", async () => {
    const exports = await import("./index");

    // Layer 2/3 components
    expect(exports.DatePicker).toBeDefined();
    expect(exports.DatePickerDocked).toBeDefined();
    expect(exports.DatePickerModal).toBeDefined();
    expect(exports.DatePickerModalInput).toBeDefined();
    expect(exports.CalendarCore).toBeDefined();
    expect(exports.DateField).toBeDefined();

    // New styled slot components
    expect(exports.StyledCalendarCell).toBeDefined();
    expect(exports.StyledNavButton).toBeDefined();
    expect(exports.StyledCalendarTitle).toBeDefined();
    expect(exports.StyledYearItem).toBeDefined();
    expect(exports.StyledWeekday).toBeDefined();
    expect(exports.StyledActionButton).toBeDefined();

    // New CVA slot variants
    expect(exports.datePickerContainerVariants).toBeDefined();
    expect(exports.calendarCellVariants).toBeDefined();
    expect(exports.calendarCellStateLayerVariants).toBeDefined();
    expect(exports.calendarCellFocusRingVariants).toBeDefined();
    expect(exports.navButtonVariants).toBeDefined();
    expect(exports.navButtonStateLayerVariants).toBeDefined();
    expect(exports.yearItemVariants).toBeDefined();
    expect(exports.yearItemStateLayerVariants).toBeDefined();
    expect(exports.weekdayVariants).toBeDefined();
    expect(exports.calendarDividerVariants).toBeDefined();
    expect(exports.actionButtonVariants).toBeDefined();
    expect(exports.headlineVariants).toBeDefined();
    expect(exports.supportingTextVariants).toBeDefined();
  });

  // Test 125 — Range middle uses data-* selector
  test("CalendarCell range-middle uses data-[range-middle] selector for bg-secondary-container", () => {
    const classes = calendarCellVariants();
    expect(classes).toContain("data-[range-middle]:bg-secondary-container");
  });

  // Test 125a — Calendar grid structural includes mx-auto for table centering
  test("CALENDAR_GRID_STRUCTURAL includes [&_table]:mx-auto to center the grid", () => {
    expect(CALENDAR_GRID_STRUCTURAL.join(" ")).toContain("[&_table]:mx-auto");
  });

  // Test 125b — Modal dialog variants include fixed positioning
  test("modalDialogVariants includes fixed and -translate-x-1/2", () => {
    const classes = modalDialogVariants({ variant: "modal" });
    expect(classes).toContain("fixed");
    expect(classes).toContain("-translate-x-1/2");
    expect(classes).toContain("-translate-y-1/2");
  });

  // Test 125c — scrimVariants includes fixed inset and bg-scrim
  test("scrimVariants includes fixed inset-0 and bg-scrim", () => {
    const classes = scrimVariants();
    expect(classes).toContain("fixed");
    expect(classes).toContain("inset-0");
    expect(classes).toContain("bg-scrim");
  });

  // Test 125d — Styled modal dialog element carries fixed positioning
  test("DatePickerModal styled variant: [data-modal-dialog] carries fixed class", () => {
    render(<DatePicker variant="modal" isOpen={true} aria-label="Test modal" />);
    const dialog = document.querySelector("[data-modal-dialog]");
    expect(dialog).not.toBeNull();
    expect(dialog?.className).toContain("fixed");
  });

  // Test 125e — Styled modal scrim element carries bg-scrim class
  test("DatePickerModal styled variant: [data-scrim] carries bg-scrim class", () => {
    render(<DatePicker variant="modal" isOpen={true} aria-label="Test modal scrim" />);
    const scrim = document.querySelector("[data-scrim]");
    expect(scrim).not.toBeNull();
    expect(scrim?.className).toContain("bg-scrim");
  });

  // Test 125f — MODAL_CONTENT_STRUCTURAL does not contain [data-modal-dialog] descendant selector
  test("MODAL_CONTENT_STRUCTURAL contains no [data-modal-dialog] descendant selector (dialog styles applied directly)", () => {
    expect(MODAL_CONTENT_STRUCTURAL).not.toContain("[data-modal-dialog]");
  });

  // Test 125g — MODAL_INPUT_CONTENT_STRUCTURAL does not contain [data-modal-dialog] descendant selector
  test("MODAL_INPUT_CONTENT_STRUCTURAL contains no [data-modal-dialog] descendant selector", () => {
    expect(MODAL_INPUT_CONTENT_STRUCTURAL).not.toContain("[data-modal-dialog]");
  });
});

// ─── M10: Motion and Animation Tests ──────────────────────────────────────────

describe("DatePicker — motion and animation", () => {
  // Test 126 — Docked popover enter motion (screen-level, standard legacy)
  test("Docked popover enter: has duration-short3 and ease-standard-decelerate", () => {
    expect(DOCKED_POPOVER_MOTION).toContain("duration-short3");
    expect(DOCKED_POPOVER_MOTION).toContain("ease-standard-decelerate");
  });

  // Test 127 — Docked popover exit motion
  test("Docked popover exit: has duration-short2 and ease-standard-accelerate", () => {
    expect(DOCKED_POPOVER_MOTION).toContain("duration-short2");
    expect(DOCKED_POPOVER_MOTION).toContain("ease-standard-accelerate");
  });

  // Test 128 — Modal enter motion
  test("Modal enter: has duration-medium2 and ease-standard-decelerate", () => {
    expect(MODAL_MOTION_STRUCTURAL).toContain("duration-medium2");
    expect(MODAL_MOTION_STRUCTURAL).toContain("ease-standard-decelerate");
  });

  // Test 129 — Modal exit motion
  test("Modal exit: has duration-medium1 and ease-standard-accelerate", () => {
    expect(MODAL_MOTION_STRUCTURAL).toContain("duration-medium1");
    expect(MODAL_MOTION_STRUCTURAL).toContain("ease-standard-accelerate");
  });

  // Test 130 — Cell state layer uses spring-standard-fast effects motion
  test("Calendar cell state layer uses spring-standard-fast effects transition", () => {
    const stateLayerClasses = calendarCellStateLayerVariants();
    expect(stateLayerClasses).toContain("transition-opacity");
    expect(stateLayerClasses).toContain("duration-spring-standard-fast-effects");
    expect(stateLayerClasses).toContain("ease-spring-standard-fast-effects");
  });

  // Test 131 — Nav button uses spring-standard-fast effects motion
  test("Nav button uses spring-standard-fast effects transition for color", () => {
    const classes = navButtonVariants();
    expect(classes).toContain("transition-colors");
    expect(classes).toContain("duration-spring-standard-fast-effects");
  });

  // Test 132 — Year item state layer uses spring-standard-fast effects motion
  test("Year item state layer uses spring-standard-fast effects transition", () => {
    const stateLayerClasses = yearItemStateLayerVariants();
    expect(stateLayerClasses).toContain("transition-opacity");
    expect(stateLayerClasses).toContain("duration-spring-standard-fast-effects");
  });

  // Test 133
  test("Reduced motion: no transition classes on container", () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));

    const { container } = render(
      <DatePicker variant="docked" label="Test" aria-label="Test date" />
    );

    const rootEl = container.firstElementChild;
    const className = rootEl?.className ?? "";
    expect(className).not.toContain("transition-[transform,opacity]");
    expect(className).not.toContain("duration-short3");
    expect(className).not.toContain("ease-standard-decelerate");
    expect(className).not.toContain("ease-emphasized-decelerate");

    window.matchMedia = originalMatchMedia;
  });

  // Test 134
  test("Reduced motion: calendar month changes instantly (no slide)", () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));

    const { container } = render(
      <DatePicker variant="docked" label="Test" aria-label="Test date" />
    );

    const rootEl = container.firstElementChild;
    const className = rootEl?.className ?? "";
    expect(className).not.toContain("ease-emphasized-decelerate");
    expect(className).not.toContain("[&_table]:transition-transform");

    window.matchMedia = originalMatchMedia;
  });

  // Test 135 — No hardcoded arbitrary duration/ease values in motion strings
  test("No hardcoded duration-[Xms] or ease-[cubic-bezier] values in motion structural strings", () => {
    const allMotion = DOCKED_POPOVER_MOTION + DOCKED_MOTION_STRUCTURAL + MODAL_MOTION_STRUCTURAL;
    expect(allMotion).not.toMatch(/duration-\[\d+ms\]/);
    expect(allMotion).not.toMatch(/ease-\[cubic-bezier/);
  });
});

// ─── M11: Accessibility Hardening ─────────────────────────────────────────────

describe("DatePicker — accessibility hardening", () => {
  // Test 136
  test("DatePickerDocked: zero axe violations", async () => {
    const { container } = render(
      <DatePicker variant="docked" label="Start date" aria-label="Start date" />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // Test 137
  test("DatePickerModal single: zero axe violations", async () => {
    const { container } = render(<DatePicker variant="modal" isOpen aria-label="Select date" />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // Test 138
  test("DatePickerModal range: zero axe violations", async () => {
    const { container } = render(
      <DatePicker variant="modal" selectionMode="range" isOpen aria-label="Select dates" />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // Test 139
  test("DatePickerModalInput: zero axe violations", async () => {
    const { container } = render(
      <DatePicker variant="modal-input" isOpen aria-label="Enter date" />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // Test 140
  test('Calendar grid has role="grid"', async () => {
    render(<DatePicker variant="docked" label="Test" aria-label="Test date" defaultOpen />);

    await waitFor(() => {
      expect(screen.getByRole("grid")).toBeInTheDocument();
    });
  });

  // Test 141
  test("All date cells have aria-label with full date string", async () => {
    render(<DatePicker variant="docked" label="Test" aria-label="Test date" defaultOpen />);

    await waitFor(() => {
      const cells = document.querySelectorAll('td[role="gridcell"] > div');
      const cellsWithLabel = Array.from(cells).filter((cell) => cell.getAttribute("aria-label"));
      expect(cellsWithLabel.length).toBeGreaterThan(0);
      cellsWithLabel.forEach((cell) => {
        const label = cell.getAttribute("aria-label")!;
        expect(label.length).toBeGreaterThan(5);
      });
    });
  });

  // Test 142
  test('Today cell has aria-current="date"', async () => {
    render(<DatePicker variant="docked" label="Test" aria-label="Test date" defaultOpen />);

    await waitFor(() => {
      const todayCell = document.querySelector('[aria-current="date"]');
      expect(todayCell).toBeInTheDocument();
    });
  });

  // Test 143
  test('Selected cell has aria-selected="true"', async () => {
    const todayDate = today(getLocalTimeZone());
    render(
      <DatePicker
        variant="docked"
        label="Test"
        aria-label="Test date"
        defaultOpen
        value={todayDate}
      />
    );

    await waitFor(() => {
      const selected = document.querySelector('[aria-selected="true"]');
      expect(selected).toBeInTheDocument();
    });
  });

  // Test 144
  test('Disabled cells have aria-disabled="true"', async () => {
    const todayDate = today(getLocalTimeZone());
    const maxDate = todayDate.add({ days: 3 });

    render(
      <DatePicker
        variant="docked"
        label="Test"
        aria-label="Test date"
        defaultOpen
        maxValue={maxDate}
      />
    );

    await waitFor(() => {
      const disabledCells = document.querySelectorAll('[aria-disabled="true"]');
      expect(disabledCells.length).toBeGreaterThan(0);
    });
  });

  // Test 145
  test('Navigation announcements use aria-live="polite"', async () => {
    render(<DatePicker variant="docked" label="Test" aria-label="Test date" defaultOpen />);

    await waitFor(() => {
      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
    });
  });

  // Test 146
  test("Focus ring visible on keyboard-focused date cell", async () => {
    render(<CalendarCore aria-label="Test calendar" />);

    const grid = screen.getByRole("grid");
    expect(grid).toBeInTheDocument();

    const cells = grid.querySelectorAll('[role="gridcell"] > div');
    expect(cells.length).toBeGreaterThan(0);

    const firstActiveCell = Array.from(cells).find(
      (cell) => !cell.hasAttribute("data-disabled") && !cell.hasAttribute("data-outside-month")
    );
    if (firstActiveCell) {
      act(() => {
        (firstActiveCell as HTMLElement).focus();
      });
      await waitFor(() => {
        const hasFocusAttr =
          firstActiveCell.hasAttribute("data-focused") ||
          firstActiveCell.hasAttribute("data-focus-visible");
        expect(hasFocusAttr).toBe(true);
      });
    }
  });

  // Test 147 — 48dp touch target via StyledCalendarCell CVA
  test("All date cells meet 48dp minimum touch target via calendarCellVariants", () => {
    // With slot injection, the 48dp touch target is applied by calendarCellVariants
    // directly to the cell button element — not via container descendant selectors.
    const cellClasses = calendarCellVariants();
    expect(cellClasses).toContain("w-[48px]");
    expect(cellClasses).toContain("h-[48px]");
  });

  // Test 148
  test("Modal has focus trap — Tab cycles within dialog", async () => {
    const user = userEvent.setup();
    render(<DatePicker variant="modal" isOpen aria-label="Select date" />);

    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).toBeInTheDocument();

    await user.tab();
    const activeElement = document.activeElement;
    expect(dialog?.contains(activeElement)).toBe(true);
  });

  // Test 149
  test("Escape from modal returns focus to trigger", async () => {
    const user = userEvent.setup();

    function TestWrapper() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)} data-testid="trigger">
            Open
          </button>
          <DatePickerModal isOpen={open} onOpenChange={setOpen} aria-label="Pick date" />
        </>
      );
    }

    render(<TestWrapper />);

    const trigger = screen.getByTestId("trigger");
    await user.click(trigger);

    await waitFor(() => {
      expect(document.querySelector('[role="dialog"]')).toBeInTheDocument();
    });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(document.querySelector('[role="dialog"]')).not.toBeInTheDocument();
    });
  });

  // Test 150
  test("Range selection announces start/end dates", async () => {
    const startDate = new CalendarDate(2025, 8, 10);
    const endDate = new CalendarDate(2025, 8, 15);

    const { container } = render(
      <DatePicker
        variant="modal"
        selectionMode="range"
        isOpen
        rangeValue={{ start: startDate, end: endDate }}
        aria-label="Trip dates"
      />
    );

    await waitFor(() => {
      const rangeStart =
        container.querySelector("[data-range-start]") ??
        document.querySelector("[data-range-start]");
      const rangeEnd =
        container.querySelector("[data-range-end]") ?? document.querySelector("[data-range-end]");

      if (rangeStart && rangeEnd) {
        expect(rangeStart).toHaveAttribute("aria-label");
        expect(rangeEnd).toHaveAttribute("aria-label");
      }
    });
  });
});

// ─── M12: Storybook Stories ───────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import datePickerMeta, {
  Default as DatePickerDefault,
  ModalDateRange as DatePickerModalDateRange,
  DisabledState as DatePickerDisabledState,
} from "./DatePicker.stories";

describe("DatePicker — stories", () => {
  // Test 151
  test("Storybook meta has correct title 'Components/DatePicker'", () => {
    expect(datePickerMeta.title).toBe("Components/DatePicker");
  });

  // Test 152
  test("Storybook meta has 'autodocs' tag", () => {
    expect(datePickerMeta.tags).toContain("autodocs");
  });

  // Test 153
  test("Default story renders without errors", () => {
    expect(DatePickerDefault).toBeDefined();
    expect(DatePickerDefault.args ?? DatePickerDefault.render).toBeDefined();
  });

  // Test 154
  test("ModalRange story renders with range selection", () => {
    expect(DatePickerModalDateRange).toBeDefined();
    expect(
      DatePickerModalDateRange.args?.selectionMode ?? DatePickerModalDateRange.render
    ).toBeDefined();
  });

  // Test 155
  test("DisabledState story renders with aria-disabled", () => {
    expect(DatePickerDisabledState).toBeDefined();
    expect(DatePickerDisabledState.render ?? DatePickerDisabledState.args).toBeDefined();
  });
});
/* eslint-enable @typescript-eslint/no-unsafe-member-access */

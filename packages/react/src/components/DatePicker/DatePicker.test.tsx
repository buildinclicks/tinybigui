import { describe, test, expect, expectTypeOf, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";
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

  // Test 21
  test("ArrowRight moves focus to next day", async () => {
    const user = userEvent.setup();
    render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 15)} />
    );

    // Tab past nav buttons to reach the focused cell
    await user.tab(); // prev button
    await user.tab(); // next button
    await user.tab(); // focused calendar cell

    const initialLabel = document.activeElement?.getAttribute("aria-label") ?? "";
    expect(initialLabel).toContain("15");

    await user.keyboard("{ArrowRight}");

    const newLabel = document.activeElement?.getAttribute("aria-label") ?? "";
    expect(newLabel).toContain("16");
  });

  // Test 22
  test("ArrowLeft moves focus to previous day", async () => {
    const user = userEvent.setup();
    render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 15)} />
    );

    await user.tab();
    await user.tab();
    await user.tab();

    await user.keyboard("{ArrowLeft}");

    const newLabel = document.activeElement?.getAttribute("aria-label") ?? "";
    expect(newLabel).toContain("14");
  });

  // Test 23
  test("ArrowDown moves focus to same day next week", async () => {
    const user = userEvent.setup();
    render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 15)} />
    );

    await user.tab();
    await user.tab();
    await user.tab();

    await user.keyboard("{ArrowDown}");

    const newLabel = document.activeElement?.getAttribute("aria-label") ?? "";
    expect(newLabel).toContain("22");
  });

  // Test 24
  test("ArrowUp moves focus to same day previous week", async () => {
    const user = userEvent.setup();
    render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 15)} />
    );

    await user.tab();
    await user.tab();
    await user.tab();

    await user.keyboard("{ArrowUp}");

    const newLabel = document.activeElement?.getAttribute("aria-label") ?? "";
    expect(newLabel).toContain("8");
  });

  // Test 25
  test("Home moves focus to first day of month", async () => {
    const user = userEvent.setup();
    render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 15)} />
    );

    await user.tab();
    await user.tab();
    await user.tab();

    await user.keyboard("{Home}");

    const newLabel = document.activeElement?.getAttribute("aria-label") ?? "";
    expect(newLabel).toMatch(/August\s+1,?\s+2025/);
  });

  // Test 26
  test("End moves focus to last day of month", async () => {
    const user = userEvent.setup();
    render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 15)} />
    );

    await user.tab();
    await user.tab();
    await user.tab();

    await user.keyboard("{End}");

    const newLabel = document.activeElement?.getAttribute("aria-label") ?? "";
    expect(newLabel).toContain("31");
  });

  // Test 27
  test("PageDown navigates to next month", async () => {
    const user = userEvent.setup();
    render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 15)} />
    );

    await user.tab();
    await user.tab();
    await user.tab();

    await user.keyboard("{PageDown}");

    const newLabel = document.activeElement?.getAttribute("aria-label") ?? "";
    expect(newLabel).toContain("September");
  });

  // Test 28
  test("PageUp navigates to previous month", async () => {
    const user = userEvent.setup();
    render(
      <CalendarCore aria-label="Test calendar" defaultValue={new CalendarDate(2025, 8, 15)} />
    );

    await user.tab();
    await user.tab();
    await user.tab();

    await user.keyboard("{PageUp}");

    const newLabel = document.activeElement?.getAttribute("aria-label") ?? "";
    expect(newLabel).toContain("July");
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

    await user.tab();
    await user.tab();
    await user.tab();

    // Move to an unselected date
    await user.keyboard("{ArrowRight}");
    await user.keyboard("{Enter}");

    expect(onChange).toHaveBeenCalled();
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

import { describe, test, expect, expectTypeOf, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// JSDOM lacks PointerEvent — polyfill extending MouseEvent so clientX/clientY work
if (typeof globalThis.PointerEvent === "undefined") {
  (globalThis as Record<string, unknown>).PointerEvent = class PointerEvent extends MouseEvent {
    readonly pointerId: number;
    readonly pointerType: string;
    readonly isPrimary: boolean;
    constructor(type: string, init: PointerEventInit & MouseEventInit = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 0;
      this.pointerType = init.pointerType ?? "";
      this.isPrimary = init.isPrimary ?? false;
    }
  };
}
import type {
  TimePickerVariant,
  TimeFormat,
  TimePickerOrientation,
  TimePeriod,
  ClockSelectionMode,
  TimeValue,
  TimePickerHeadlessProps,
  TimePickerProps,
  ClockDialProps,
  PeriodSelectorProps,
  TimePickerRenderState,
} from "./TimePicker.types";
import { TimePickerDial } from "./TimePickerDial";
import { TimePickerInput } from "./TimePickerInput";
import { TimeInputField } from "./TimeInputField";
import { ClockDial } from "./ClockDial";
import { ClockHand } from "./ClockHand";
import { TimeSelector } from "./TimeSelector";
import { PeriodSelector } from "./PeriodSelector";
import { TimePicker } from "./TimePicker";
import {
  clockDialContainerVariants,
  clockDialNumberVariants,
  clockHandCenterVariants,
  clockHandTrackVariants,
  clockHandHandleVariants,
  timeSelectorContainerVariants,
  periodSelectorContainerVariants,
  periodSelectorItemVariants,
  timeInputFieldVariants,
  timeSeparatorVariants,
  timePickerHeadlineVariants,
} from "./TimePicker.variants";

describe("TimePicker Types", () => {
  describe("TimePickerVariant", () => {
    test("accepts 'dial' and 'input'", () => {
      expectTypeOf<"dial">().toMatchTypeOf<TimePickerVariant>();
      expectTypeOf<"input">().toMatchTypeOf<TimePickerVariant>();
    });
  });

  describe("TimeFormat", () => {
    test("accepts 12 and 24", () => {
      expectTypeOf<12>().toMatchTypeOf<TimeFormat>();
      expectTypeOf<24>().toMatchTypeOf<TimeFormat>();
    });
  });

  describe("TimePickerOrientation", () => {
    test("accepts 'vertical' and 'horizontal'", () => {
      expectTypeOf<"vertical">().toMatchTypeOf<TimePickerOrientation>();
      expectTypeOf<"horizontal">().toMatchTypeOf<TimePickerOrientation>();
    });
  });

  describe("TimePeriod", () => {
    test("accepts 'AM' and 'PM'", () => {
      expectTypeOf<"AM">().toMatchTypeOf<TimePeriod>();
      expectTypeOf<"PM">().toMatchTypeOf<TimePeriod>();
    });
  });

  describe("ClockSelectionMode", () => {
    test("accepts 'hour' and 'minute'", () => {
      expectTypeOf<"hour">().toMatchTypeOf<ClockSelectionMode>();
      expectTypeOf<"minute">().toMatchTypeOf<ClockSelectionMode>();
    });
  });

  describe("TimeValue", () => {
    test("has hour and minute number properties", () => {
      expectTypeOf<TimeValue>().toHaveProperty("hour");
      expectTypeOf<TimeValue>().toHaveProperty("minute");
      expectTypeOf<TimeValue["hour"]>().toBeNumber();
      expectTypeOf<TimeValue["minute"]>().toBeNumber();
    });
  });

  describe("TimePickerHeadlessProps", () => {
    test("accepts variant, hourCycle, value, onChange", () => {
      expectTypeOf<TimePickerHeadlessProps>().toHaveProperty("variant");
      expectTypeOf<TimePickerHeadlessProps>().toHaveProperty("hourCycle");
      expectTypeOf<TimePickerHeadlessProps>().toHaveProperty("value");
      expectTypeOf<TimePickerHeadlessProps>().toHaveProperty("onChange");
    });
  });

  describe("TimePickerProps", () => {
    test("extends TimePickerHeadlessProps (minus children)", () => {
      expectTypeOf<TimePickerProps>().toMatchTypeOf<Omit<TimePickerHeadlessProps, "children">>();
    });

    test("accepts headline, cancelLabel, confirmLabel", () => {
      expectTypeOf<TimePickerProps>().toHaveProperty("headline");
      expectTypeOf<TimePickerProps>().toHaveProperty("cancelLabel");
      expectTypeOf<TimePickerProps>().toHaveProperty("confirmLabel");
    });
  });

  describe("ClockDialProps", () => {
    test("requires selectionMode, selectedHour, selectedMinute, hourCycle", () => {
      expectTypeOf<ClockDialProps>().toHaveProperty("selectionMode");
      expectTypeOf<ClockDialProps>().toHaveProperty("selectedHour");
      expectTypeOf<ClockDialProps>().toHaveProperty("selectedMinute");
      expectTypeOf<ClockDialProps>().toHaveProperty("hourCycle");
      expectTypeOf<ClockDialProps["selectionMode"]>().toMatchTypeOf<ClockSelectionMode>();
      expectTypeOf<ClockDialProps["selectedHour"]>().toBeNumber();
      expectTypeOf<ClockDialProps["selectedMinute"]>().toBeNumber();
      expectTypeOf<ClockDialProps["hourCycle"]>().toMatchTypeOf<TimeFormat>();
    });
  });

  describe("PeriodSelectorProps", () => {
    test("requires value and onChange", () => {
      expectTypeOf<PeriodSelectorProps>().toHaveProperty("value");
      expectTypeOf<PeriodSelectorProps>().toHaveProperty("onChange");
      expectTypeOf<PeriodSelectorProps["value"]>().toMatchTypeOf<TimePeriod>();
      expectTypeOf<PeriodSelectorProps["onChange"]>().toBeFunction();
    });
  });

  describe("TimePickerRenderState", () => {
    test("has all required state properties", () => {
      expectTypeOf<TimePickerRenderState>().toHaveProperty("isOpen");
      expectTypeOf<TimePickerRenderState>().toHaveProperty("isDisabled");
      expectTypeOf<TimePickerRenderState>().toHaveProperty("variant");
      expectTypeOf<TimePickerRenderState>().toHaveProperty("clockMode");
      expectTypeOf<TimePickerRenderState>().toHaveProperty("selectedTime");
      expectTypeOf<TimePickerRenderState>().toHaveProperty("period");
      expectTypeOf<TimePickerRenderState>().toHaveProperty("hourCycle");
    });
  });
});

// ─── M06: TimePickerDial — headless clock dial behavior ──────────────────────

/**
 * Helper: simulate a pointer event at a specific angle on a clock dial.
 * Angle is in degrees clockwise from 12 o'clock.
 * Radius is expressed as a fraction of the container's half-width (0–1).
 *
 * Uses native PointerEvent constructors with proper clientX/clientY
 * and stubs JSDOM-unsupported pointer capture methods.
 */
function firePointerAtAngle(element: HTMLElement, angleDeg: number, radiusFraction = 0.8): void {
  const rect = {
    left: 0,
    top: 0,
    width: 256,
    height: 256,
    right: 256,
    bottom: 256,
    x: 0,
    y: 0,
    toJSON: () => {},
  } as DOMRect;

  element.getBoundingClientRect = () => rect;
  element.setPointerCapture = vi.fn();
  element.releasePointerCapture = vi.fn();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const r = (rect.width / 2) * radiusFraction;
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  const clientX = centerX + r * Math.cos(rad);
  const clientY = centerY + r * Math.sin(rad);

  const downEvent = new PointerEvent("pointerdown", {
    clientX,
    clientY,
    pointerId: 1,
    bubbles: true,
    cancelable: true,
  });

  const upEvent = new PointerEvent("pointerup", {
    clientX,
    clientY,
    pointerId: 1,
    bubbles: true,
    cancelable: true,
  });

  act(() => {
    element.dispatchEvent(downEvent);
  });
  act(() => {
    element.dispatchEvent(upEvent);
  });
}

describe("TimePickerDial — headless clock dial behavior", () => {
  // Test 13
  test("TimePickerDial renders clock dial container", () => {
    render(<TimePickerDial hourCycle={12} defaultValue={{ hour: 7, minute: 0 }} />);

    const dial = screen.getByRole("listbox");
    expect(dial).toBeInTheDocument();
    expect(dial).toHaveAttribute("data-clock-dial");
  });

  // Test 14
  test("TimePickerDial renders 12 number labels for 12-hour mode", () => {
    render(<TimePickerDial hourCycle={12} defaultValue={{ hour: 7, minute: 0 }} />);

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(12);
  });

  // Test 15
  test("TimePickerDial renders 24 number labels for 24-hour mode (two rings)", () => {
    render(<TimePickerDial hourCycle={24} defaultValue={{ hour: 14, minute: 0 }} />);

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(24);
  });

  // Test 16
  test("TimeSelector renders hour and minute containers", () => {
    render(
      <TimeSelector
        hour={7}
        minute={30}
        activeField="hour"
        onFieldChange={() => {}}
        hourCycle={12}
      />
    );

    const spinbuttons = screen.getAllByRole("spinbutton");
    expect(spinbuttons).toHaveLength(2);
  });

  // Test 17
  test('TimeSelector hour has role="spinbutton"', () => {
    render(
      <TimeSelector
        hour={7}
        minute={30}
        activeField="hour"
        onFieldChange={() => {}}
        hourCycle={12}
      />
    );

    const hourSpinbutton = screen.getByRole("spinbutton", { name: "Hours" });
    expect(hourSpinbutton).toBeInTheDocument();
  });

  // Test 18
  test('TimeSelector minute has role="spinbutton"', () => {
    render(
      <TimeSelector
        hour={7}
        minute={30}
        activeField="hour"
        onFieldChange={() => {}}
        hourCycle={12}
      />
    );

    const minuteSpinbutton = screen.getByRole("spinbutton", { name: "Minutes" });
    expect(minuteSpinbutton).toBeInTheDocument();
  });

  // Test 19
  test('TimeSelector hour has aria-label="Hours"', () => {
    render(
      <TimeSelector
        hour={7}
        minute={30}
        activeField="hour"
        onFieldChange={() => {}}
        hourCycle={12}
      />
    );

    const hourSpinbutton = screen.getByRole("spinbutton", { name: "Hours" });
    expect(hourSpinbutton).toHaveAttribute("aria-label", "Hours");
  });

  // Test 20
  test('TimeSelector minute has aria-label="Minutes"', () => {
    render(
      <TimeSelector
        hour={7}
        minute={30}
        activeField="hour"
        onFieldChange={() => {}}
        hourCycle={12}
      />
    );

    const minuteSpinbutton = screen.getByRole("spinbutton", { name: "Minutes" });
    expect(minuteSpinbutton).toHaveAttribute("aria-label", "Minutes");
  });

  // Test 21
  test("TimeSelector has aria-valuenow matching current value", () => {
    render(
      <TimeSelector
        hour={7}
        minute={30}
        activeField="hour"
        onFieldChange={() => {}}
        hourCycle={12}
      />
    );

    const hourSpinbutton = screen.getByRole("spinbutton", { name: "Hours" });
    expect(hourSpinbutton).toHaveAttribute("aria-valuenow", "7");

    const minuteSpinbutton = screen.getByRole("spinbutton", { name: "Minutes" });
    expect(minuteSpinbutton).toHaveAttribute("aria-valuenow", "30");
  });

  // Test 22
  test("TimeSelector has aria-valuemin and aria-valuemax", () => {
    render(
      <TimeSelector
        hour={7}
        minute={30}
        activeField="hour"
        onFieldChange={() => {}}
        hourCycle={12}
      />
    );

    const hourSpinbutton = screen.getByRole("spinbutton", { name: "Hours" });
    expect(hourSpinbutton).toHaveAttribute("aria-valuemin", "1");
    expect(hourSpinbutton).toHaveAttribute("aria-valuemax", "12");

    const minuteSpinbutton = screen.getByRole("spinbutton", { name: "Minutes" });
    expect(minuteSpinbutton).toHaveAttribute("aria-valuemin", "0");
    expect(minuteSpinbutton).toHaveAttribute("aria-valuemax", "59");
  });

  // Test 23
  test("Arrow Up on hour selector increments hour", async () => {
    const onHourChange = vi.fn();
    render(
      <TimeSelector
        hour={7}
        minute={30}
        activeField="hour"
        onFieldChange={() => {}}
        onHourChange={onHourChange}
        hourCycle={12}
      />
    );

    const hourSpinbutton = screen.getByRole("spinbutton", { name: "Hours" });
    hourSpinbutton.focus();
    await userEvent.keyboard("{ArrowUp}");
    expect(onHourChange).toHaveBeenCalledWith(8);
  });

  // Test 24
  test("Arrow Down on hour selector decrements hour", async () => {
    const onHourChange = vi.fn();
    render(
      <TimeSelector
        hour={7}
        minute={30}
        activeField="hour"
        onFieldChange={() => {}}
        onHourChange={onHourChange}
        hourCycle={12}
      />
    );

    const hourSpinbutton = screen.getByRole("spinbutton", { name: "Hours" });
    hourSpinbutton.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(onHourChange).toHaveBeenCalledWith(6);
  });

  // Test 25
  test("Arrow Up on minute selector increments minute", async () => {
    const onMinuteChange = vi.fn();
    render(
      <TimeSelector
        hour={7}
        minute={30}
        activeField="minute"
        onFieldChange={() => {}}
        onMinuteChange={onMinuteChange}
        hourCycle={12}
      />
    );

    const minuteSpinbutton = screen.getByRole("spinbutton", { name: "Minutes" });
    minuteSpinbutton.focus();
    await userEvent.keyboard("{ArrowUp}");
    expect(onMinuteChange).toHaveBeenCalledWith(31);
  });

  // Test 26
  test("Arrow Down on minute selector decrements minute", async () => {
    const onMinuteChange = vi.fn();
    render(
      <TimeSelector
        hour={7}
        minute={30}
        activeField="minute"
        onFieldChange={() => {}}
        onMinuteChange={onMinuteChange}
        hourCycle={12}
      />
    );

    const minuteSpinbutton = screen.getByRole("spinbutton", { name: "Minutes" });
    minuteSpinbutton.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(onMinuteChange).toHaveBeenCalledWith(29);
  });

  // Test 27
  test("Clicking hour container switches to hour selection mode", async () => {
    const onFieldChange = vi.fn();
    render(
      <TimeSelector
        hour={7}
        minute={30}
        activeField="minute"
        onFieldChange={onFieldChange}
        hourCycle={12}
      />
    );

    const hourSpinbutton = screen.getByRole("spinbutton", { name: "Hours" });
    await userEvent.click(hourSpinbutton);
    expect(onFieldChange).toHaveBeenCalledWith("hour");
  });

  // Test 28
  test("Clicking minute container switches to minute selection mode", async () => {
    const onFieldChange = vi.fn();
    render(
      <TimeSelector
        hour={7}
        minute={30}
        activeField="hour"
        onFieldChange={onFieldChange}
        hourCycle={12}
      />
    );

    const minuteSpinbutton = screen.getByRole("spinbutton", { name: "Minutes" });
    await userEvent.click(minuteSpinbutton);
    expect(onFieldChange).toHaveBeenCalledWith("minute");
  });

  // Test 29
  test('PeriodSelector renders with role="radiogroup"', () => {
    render(<PeriodSelector value="AM" onChange={() => {}} />);

    const radiogroup = screen.getByRole("radiogroup");
    expect(radiogroup).toBeInTheDocument();
  });

  // Test 30
  test('PeriodSelector renders AM and PM with role="radio"', () => {
    render(<PeriodSelector value="AM" onChange={() => {}} />);

    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(2);
    expect(radios[0]).toHaveTextContent("AM");
    expect(radios[1]).toHaveTextContent("PM");
  });

  // Test 31
  test('PeriodSelector selected period has aria-checked="true"', () => {
    render(<PeriodSelector value="PM" onChange={() => {}} />);

    const pmRadio = screen.getByRole("radio", { name: "PM" });
    expect(pmRadio).toHaveAttribute("aria-checked", "true");

    const amRadio = screen.getByRole("radio", { name: "AM" });
    expect(amRadio).toHaveAttribute("aria-checked", "false");
  });

  // Test 32
  test("PeriodSelector Arrow Left/Right toggles period", async () => {
    const onChange = vi.fn();
    render(<PeriodSelector value="AM" onChange={onChange} />);

    const amRadio = screen.getByRole("radio", { name: "AM" });
    amRadio.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith("PM");
  });

  // Test 33
  test("PeriodSelector is not rendered for 24-hour format", () => {
    render(<TimePickerDial hourCycle={24} defaultValue={{ hour: 14, minute: 0 }} />);

    const radiogroup = screen.queryByRole("radiogroup");
    expect(radiogroup).not.toBeInTheDocument();
  });

  // Test 34
  test("ClockDial pointer interaction selects correct hour (30° snap)", () => {
    const onSelect = vi.fn();
    render(
      <ClockDial
        selectionMode="hour"
        selectedHour={12}
        selectedMinute={0}
        hourCycle={12}
        onSelect={onSelect}
      />
    );

    const dial = screen.getByRole("listbox");
    // 90° from 12 o'clock = 3 o'clock = hour 3
    firePointerAtAngle(dial, 90);
    expect(onSelect).toHaveBeenCalledWith(3);
  });

  // Test 35
  test("ClockDial pointer interaction selects correct minute (6° snap)", () => {
    const onSelect = vi.fn();
    render(
      <ClockDial
        selectionMode="minute"
        selectedHour={7}
        selectedMinute={0}
        hourCycle={12}
        onSelect={onSelect}
      />
    );

    const dial = screen.getByRole("listbox");
    // 180° from 12 o'clock = 6 o'clock position = 30 minutes
    firePointerAtAngle(dial, 180);
    expect(onSelect).toHaveBeenCalledWith(30);
  });

  // Test 36
  test("ClockDial 24h mode: inner ring selects 13-24", () => {
    const onSelect = vi.fn();
    render(
      <ClockDial
        selectionMode="hour"
        selectedHour={1}
        selectedMinute={0}
        hourCycle={24}
        onSelect={onSelect}
      />
    );

    const dial = screen.getByRole("listbox");
    // 30° from 12 o'clock = 1 o'clock position, inner ring (radius 0.3)
    firePointerAtAngle(dial, 30, 0.3);
    expect(onSelect).toHaveBeenCalledWith(13);
  });

  // Test 37
  test("Selecting hour auto-advances to minute mode", () => {
    vi.useFakeTimers();
    render(<TimePickerDial hourCycle={12} defaultValue={{ hour: 7, minute: 0 }} />);

    const dial = screen.getByRole("listbox");
    expect(dial).toHaveAttribute("data-selection-mode", "hour");

    firePointerAtAngle(dial, 90);

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(dial).toHaveAttribute("data-selection-mode", "minute");

    vi.useRealTimers();
  });

  // Test 38
  test("ClockHand angle matches selected value", () => {
    const { container } = render(<ClockHand angle={90} mode="hour" />);

    const hand = container.querySelector("[data-clock-hand]");
    expect(hand).toBeInTheDocument();
    expect(hand).toHaveStyle({ transform: "rotate(90deg)" });
  });

  // Test 39
  test("ClockHand renders center dot, track, and handle", () => {
    const { container } = render(<ClockHand angle={0} mode="hour" />);

    expect(container.querySelector("[data-clock-hand-center]")).toBeInTheDocument();
    expect(container.querySelector("[data-clock-hand-track]")).toBeInTheDocument();
    expect(container.querySelector("[data-clock-hand-handle]")).toBeInTheDocument();
  });

  // Test 40
  test('Mode toggle has aria-label "Switch to keyboard input"', () => {
    render(
      <TimePickerDial
        hourCycle={12}
        defaultValue={{ hour: 7, minute: 0 }}
        onModeToggle={() => {}}
      />
    );

    const toggleButton = screen.getByRole("button", { name: "Switch to keyboard input" });
    expect(toggleButton).toBeInTheDocument();
  });

  // Test 41
  test("TimePickerDial supports controlled value prop", () => {
    const { rerender } = render(<TimePickerDial hourCycle={12} value={{ hour: 7, minute: 0 }} />);

    const hourSpinbutton = screen.getByRole("spinbutton", { name: "Hours" });
    expect(hourSpinbutton).toHaveTextContent("07");

    rerender(<TimePickerDial hourCycle={12} value={{ hour: 10, minute: 45 }} />);

    expect(hourSpinbutton).toHaveTextContent("10");
    const minuteSpinbutton = screen.getByRole("spinbutton", { name: "Minutes" });
    expect(minuteSpinbutton).toHaveTextContent("45");
  });

  // Test 42
  test("TimePickerDial calls onChange when value changes", () => {
    const onChange = vi.fn();
    render(
      <TimePickerDial hourCycle={12} defaultValue={{ hour: 7, minute: 0 }} onChange={onChange} />
    );

    const hourSpinbutton = screen.getByRole("spinbutton", { name: "Hours" });
    fireEvent.keyDown(hourSpinbutton, { key: "ArrowUp" });

    expect(onChange).toHaveBeenCalled();
  });

  // Test 43
  test("TimePickerDial isDisabled prevents interaction", () => {
    const onChange = vi.fn();
    render(
      <TimePickerDial
        hourCycle={12}
        defaultValue={{ hour: 7, minute: 0 }}
        onChange={onChange}
        isDisabled
      />
    );

    const hourSpinbutton = screen.getByRole("spinbutton", { name: "Hours" });
    fireEvent.keyDown(hourSpinbutton, { key: "ArrowUp" });

    expect(onChange).not.toHaveBeenCalled();
  });

  // Test 44
  test("TimePickerDial respects minuteStep for minute snapping", () => {
    const onSelect = vi.fn();
    render(
      <ClockDial
        selectionMode="minute"
        selectedHour={7}
        selectedMinute={0}
        hourCycle={12}
        minuteStep={5}
        onSelect={onSelect}
      />
    );

    const dial = screen.getByRole("listbox");
    // 42° = 7 minutes raw, should snap to 5 with step=5
    firePointerAtAngle(dial, 42);
    const calledValue = onSelect.mock.calls[0][0] as number;
    expect(calledValue % 5).toBe(0);
  });
});

// ─── M07: TimePickerInput — headless keyboard input behavior ─────────────────

describe("TimePickerInput — headless keyboard input behavior", () => {
  // Test 45
  test('TimePickerInput renders headline "Enter time"', () => {
    render(<TimePickerInput hourCycle={12} defaultValue={{ hour: 7, minute: 0 }} />);

    expect(screen.getByText("Enter time")).toBeInTheDocument();
  });

  // Test 46
  test("TimePickerInput renders hour and minute input fields", () => {
    render(<TimePickerInput hourCycle={12} defaultValue={{ hour: 7, minute: 0 }} />);

    const spinbuttons = screen.getAllByRole("spinbutton");
    expect(spinbuttons).toHaveLength(2);
  });

  // Test 47
  test("TimePickerInput renders separator colon", () => {
    render(<TimePickerInput hourCycle={12} defaultValue={{ hour: 7, minute: 0 }} />);

    const separator = screen.getByText(":");
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute("aria-hidden", "true");
  });

  // Test 48
  test('TimeInputField hour has role="spinbutton"', () => {
    render(<TimeInputField field="hour" value={7} onChange={() => {}} min={1} max={12} />);

    const spinbutton = screen.getByRole("spinbutton", { name: "Hour" });
    expect(spinbutton).toBeInTheDocument();
  });

  // Test 49
  test('TimeInputField minute has role="spinbutton"', () => {
    render(<TimeInputField field="minute" value={30} onChange={() => {}} min={0} max={59} />);

    const spinbutton = screen.getByRole("spinbutton", { name: "Minute" });
    expect(spinbutton).toBeInTheDocument();
  });

  // Test 50
  test('TimeInputField hour has aria-label="Hour"', () => {
    render(<TimeInputField field="hour" value={7} onChange={() => {}} min={1} max={12} />);

    const spinbutton = screen.getByRole("spinbutton", { name: "Hour" });
    expect(spinbutton).toHaveAttribute("aria-label", "Hour");
  });

  // Test 51
  test('TimeInputField minute has aria-label="Minute"', () => {
    render(<TimeInputField field="minute" value={30} onChange={() => {}} min={0} max={59} />);

    const spinbutton = screen.getByRole("spinbutton", { name: "Minute" });
    expect(spinbutton).toHaveAttribute("aria-label", "Minute");
  });

  // Test 52
  test("TimeInputField has aria-valuenow matching current value", () => {
    render(<TimeInputField field="hour" value={9} onChange={() => {}} min={1} max={12} />);

    const spinbutton = screen.getByRole("spinbutton", { name: "Hour" });
    expect(spinbutton).toHaveAttribute("aria-valuenow", "9");
  });

  // Test 53
  test("TimeInputField has aria-valuemin and aria-valuemax", () => {
    render(<TimeInputField field="hour" value={7} onChange={() => {}} min={1} max={12} />);

    const spinbutton = screen.getByRole("spinbutton", { name: "Hour" });
    expect(spinbutton).toHaveAttribute("aria-valuemin", "1");
    expect(spinbutton).toHaveAttribute("aria-valuemax", "12");
  });

  // Test 54
  test("Typing digits updates the field value", () => {
    const onChange = vi.fn();
    render(<TimeInputField field="hour" value={7} onChange={onChange} min={1} max={12} />);

    const spinbutton = screen.getByRole("spinbutton", { name: "Hour" });
    spinbutton.focus();
    fireEvent.keyDown(spinbutton, { key: "1" });
    expect(onChange).toHaveBeenCalledWith(1);
  });

  // Test 55
  test("Typing two digits in hour auto-focuses minute field", () => {
    const onAutoAdvance = vi.fn();
    render(
      <TimeInputField
        field="hour"
        value={0}
        onChange={() => {}}
        onAutoAdvance={onAutoAdvance}
        min={1}
        max={12}
      />
    );

    const spinbutton = screen.getByRole("spinbutton", { name: "Hour" });
    spinbutton.focus();
    fireEvent.keyDown(spinbutton, { key: "1" });
    fireEvent.keyDown(spinbutton, { key: "0" });
    expect(onAutoAdvance).toHaveBeenCalled();
  });

  // Test 56
  test("Arrow Up increments hour value", () => {
    const onChange = vi.fn();
    render(<TimeInputField field="hour" value={7} onChange={onChange} min={1} max={12} />);

    const spinbutton = screen.getByRole("spinbutton", { name: "Hour" });
    spinbutton.focus();
    fireEvent.keyDown(spinbutton, { key: "ArrowUp" });
    expect(onChange).toHaveBeenCalledWith(8);
  });

  // Test 57
  test("Arrow Down decrements hour value", () => {
    const onChange = vi.fn();
    render(<TimeInputField field="hour" value={7} onChange={onChange} min={1} max={12} />);

    const spinbutton = screen.getByRole("spinbutton", { name: "Hour" });
    spinbutton.focus();
    fireEvent.keyDown(spinbutton, { key: "ArrowDown" });
    expect(onChange).toHaveBeenCalledWith(6);
  });

  // Test 58
  test("Arrow Up increments minute value", () => {
    const onChange = vi.fn();
    render(<TimeInputField field="minute" value={30} onChange={onChange} min={0} max={59} />);

    const spinbutton = screen.getByRole("spinbutton", { name: "Minute" });
    spinbutton.focus();
    fireEvent.keyDown(spinbutton, { key: "ArrowUp" });
    expect(onChange).toHaveBeenCalledWith(31);
  });

  // Test 59
  test("Arrow Down decrements minute value", () => {
    const onChange = vi.fn();
    render(<TimeInputField field="minute" value={30} onChange={onChange} min={0} max={59} />);

    const spinbutton = screen.getByRole("spinbutton", { name: "Minute" });
    spinbutton.focus();
    fireEvent.keyDown(spinbutton, { key: "ArrowDown" });
    expect(onChange).toHaveBeenCalledWith(29);
  });

  // Test 60
  test("Hour wraps from 12 to 1 in 12-hour mode", () => {
    const onChange = vi.fn();
    render(<TimeInputField field="hour" value={12} onChange={onChange} min={1} max={12} />);

    const spinbutton = screen.getByRole("spinbutton", { name: "Hour" });
    spinbutton.focus();
    fireEvent.keyDown(spinbutton, { key: "ArrowUp" });
    expect(onChange).toHaveBeenCalledWith(1);
  });

  // Test 61
  test("Hour wraps from 23 to 0 in 24-hour mode", () => {
    const onChange = vi.fn();
    render(<TimeInputField field="hour" value={23} onChange={onChange} min={0} max={23} />);

    const spinbutton = screen.getByRole("spinbutton", { name: "Hour" });
    spinbutton.focus();
    fireEvent.keyDown(spinbutton, { key: "ArrowUp" });
    expect(onChange).toHaveBeenCalledWith(0);
  });

  // Test 62
  test("Minute wraps from 59 to 0", () => {
    const onChange = vi.fn();
    render(<TimeInputField field="minute" value={59} onChange={onChange} min={0} max={59} />);

    const spinbutton = screen.getByRole("spinbutton", { name: "Minute" });
    spinbutton.focus();
    fireEvent.keyDown(spinbutton, { key: "ArrowUp" });
    expect(onChange).toHaveBeenCalledWith(0);
  });

  // Test 63
  test("Tab navigates between hour, minute, period, and actions", () => {
    render(
      <TimePickerInput
        hourCycle={12}
        defaultValue={{ hour: 7, minute: 0 }}
        onConfirm={() => {}}
        onCancel={() => {}}
        onModeToggle={() => {}}
      />
    );

    const spinbuttons = screen.getAllByRole("spinbutton");
    const hourField = spinbuttons[0];
    const minuteField = spinbuttons[1];
    const periodRadios = screen.getAllByRole("radio");
    const buttons = screen.getAllByRole("button");

    expect(hourField).toHaveAttribute("tabindex", "0");
    expect(minuteField).toHaveAttribute("tabindex", "0");
    expect(periodRadios[0]).toHaveAttribute("tabindex", "0");
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });

  // Test 64
  test("TimeInputField validates value on blur (clamps to range)", () => {
    const onChange = vi.fn();
    render(<TimeInputField field="hour" value={15} onChange={onChange} min={1} max={12} />);

    const spinbutton = screen.getByRole("spinbutton", { name: "Hour" });
    spinbutton.focus();
    fireEvent.blur(spinbutton);
    expect(onChange).toHaveBeenCalledWith(12);
  });

  // Test 65
  test("TimeInputField shows two-digit display with leading zero", () => {
    render(<TimeInputField field="hour" value={7} onChange={() => {}} min={1} max={12} />);

    const spinbutton = screen.getByRole("spinbutton", { name: "Hour" });
    expect(spinbutton).toHaveTextContent("07");
  });

  // Test 66
  test("PeriodSelector is rendered for 12-hour format", () => {
    render(<TimePickerInput hourCycle={12} defaultValue={{ hour: 7, minute: 0 }} />);

    const radiogroup = screen.getByRole("radiogroup");
    expect(radiogroup).toBeInTheDocument();
  });

  // Test 67
  test("PeriodSelector is not rendered for 24-hour format", () => {
    render(<TimePickerInput hourCycle={24} defaultValue={{ hour: 14, minute: 0 }} />);

    const radiogroup = screen.queryByRole("radiogroup");
    expect(radiogroup).not.toBeInTheDocument();
  });

  // Test 68
  test('Mode toggle has aria-label "Switch to clock dial"', () => {
    render(
      <TimePickerInput
        hourCycle={12}
        defaultValue={{ hour: 7, minute: 0 }}
        onModeToggle={() => {}}
      />
    );

    const toggleButton = screen.getByRole("button", { name: "Switch to clock dial" });
    expect(toggleButton).toBeInTheDocument();
  });

  // Test 69
  test("TimePickerInput supports controlled value prop", () => {
    const { rerender } = render(<TimePickerInput hourCycle={12} value={{ hour: 7, minute: 0 }} />);

    const spinbuttons = screen.getAllByRole("spinbutton");
    expect(spinbuttons[0]).toHaveTextContent("07");

    rerender(<TimePickerInput hourCycle={12} value={{ hour: 10, minute: 45 }} />);

    expect(spinbuttons[0]).toHaveTextContent("10");
    expect(spinbuttons[1]).toHaveTextContent("45");
  });

  // Test 70
  test("TimePickerInput calls onChange when value changes", () => {
    const onChange = vi.fn();
    render(
      <TimePickerInput hourCycle={12} defaultValue={{ hour: 7, minute: 0 }} onChange={onChange} />
    );

    const hourField = screen.getAllByRole("spinbutton")[0];
    hourField.focus();
    fireEvent.keyDown(hourField, { key: "ArrowUp" });
    expect(onChange).toHaveBeenCalled();
  });

  // Test 71
  test("TimePickerInput isDisabled prevents interaction", () => {
    const onChange = vi.fn();
    render(
      <TimePickerInput
        hourCycle={12}
        defaultValue={{ hour: 7, minute: 0 }}
        onChange={onChange}
        isDisabled
      />
    );

    const hourField = screen.getAllByRole("spinbutton")[0];
    fireEvent.keyDown(hourField, { key: "ArrowUp" });
    expect(onChange).not.toHaveBeenCalled();
  });

  // Test 72
  test("OK button confirms time value", () => {
    const onConfirm = vi.fn();
    render(
      <TimePickerInput
        hourCycle={12}
        defaultValue={{ hour: 7, minute: 30 }}
        onConfirm={onConfirm}
      />
    );

    const okButton = screen.getByRole("button", { name: "OK" });
    fireEvent.click(okButton);
    expect(onConfirm).toHaveBeenCalledWith({ hour: 7, minute: 30 });
  });

  // Test 73
  test("Cancel button reverts and closes", () => {
    const onCancel = vi.fn();
    render(
      <TimePickerInput hourCycle={12} defaultValue={{ hour: 7, minute: 30 }} onCancel={onCancel} />
    );

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);
    expect(onCancel).toHaveBeenCalled();
  });
});

// ─── M09: TimePicker — styled layer ──────────────────────────────────────────

describe("TimePicker — styled layer", () => {
  // Test 74
  test("TimePicker renders with bg-surface-container-high on container", () => {
    const { container } = render(
      <TimePicker hourCycle={12} defaultValue={{ hour: 7, minute: 0 }} />
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("bg-surface-container-high");
  });

  // Test 75
  test("TimePicker container has rounded-3xl (28dp)", () => {
    const { container } = render(
      <TimePicker hourCycle={12} defaultValue={{ hour: 7, minute: 0 }} />
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("rounded-3xl");
  });

  // Test 76
  test("TimePicker container has p-6 (24dp padding)", () => {
    const { container } = render(
      <TimePicker hourCycle={12} defaultValue={{ hour: 7, minute: 0 }} />
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("p-6");
  });

  // Test 77
  test("TimePicker vertical layout has flex-col", () => {
    const { container } = render(
      <TimePicker hourCycle={12} defaultValue={{ hour: 7, minute: 0 }} orientation="vertical" />
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("flex-col");
  });

  // Test 78
  test("TimePicker horizontal layout has flex-row", () => {
    const { container } = render(
      <TimePicker hourCycle={12} defaultValue={{ hour: 7, minute: 0 }} orientation="horizontal" />
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("flex-row");
  });

  // Test 79
  test("Clock dial container has w-[256px] and h-[256px]", () => {
    const classes = clockDialContainerVariants();
    expect(classes).toContain("w-[256px]");
    expect(classes).toContain("h-[256px]");
  });

  // Test 80
  test("Clock dial container has rounded-full", () => {
    const classes = clockDialContainerVariants();
    expect(classes).toContain("rounded-full");
  });

  // Test 81
  test("Clock dial container has bg-surface-container-highest", () => {
    const classes = clockDialContainerVariants();
    expect(classes).toContain("bg-surface-container-highest");
  });

  // Test 82
  test("Clock dial number unselected has text-on-surface", () => {
    const classes = clockDialNumberVariants({ selected: false });
    expect(classes).toContain("text-on-surface");
  });

  // Test 83
  test("Clock dial number selected has bg-primary and text-on-primary", () => {
    const classes = clockDialNumberVariants({ selected: true });
    expect(classes).toContain("bg-primary");
    expect(classes).toContain("text-on-primary");
  });

  // Test 84
  test("Clock hand center has w-[8px] h-[8px] bg-primary", () => {
    const classes = clockHandCenterVariants();
    expect(classes).toContain("w-[8px]");
    expect(classes).toContain("h-[8px]");
    expect(classes).toContain("bg-primary");
  });

  // Test 85
  test("Clock hand track has w-[2px] bg-primary", () => {
    const classes = clockHandTrackVariants();
    expect(classes).toContain("w-[2px]");
    expect(classes).toContain("bg-primary");
  });

  // Test 86
  test("Clock hand handle has w-[48px] h-[48px] bg-primary", () => {
    const classes = clockHandHandleVariants();
    expect(classes).toContain("w-[48px]");
    expect(classes).toContain("h-[48px]");
    expect(classes).toContain("bg-primary");
  });

  // Test 87
  test("Time selector container has w-[96px] h-[80px]", () => {
    const classes = timeSelectorContainerVariants({});
    expect(classes).toContain("w-[96px]");
    expect(classes).toContain("h-[80px]");
  });

  // Test 88
  test("Time selector unselected has bg-surface-container-highest", () => {
    const classes = timeSelectorContainerVariants({ selected: false });
    expect(classes).toContain("bg-surface-container-highest");
  });

  // Test 89
  test("Time selector selected has bg-primary-container text-on-primary-container", () => {
    const classes = timeSelectorContainerVariants({ selected: true });
    expect(classes).toContain("bg-primary-container");
    expect(classes).toContain("text-on-primary-container");
  });

  // Test 90
  test("Time selector text uses text-display-large", () => {
    const classes = timeSelectorContainerVariants({});
    expect(classes).toContain("text-display-large");
  });

  // Test 91
  test("Period selector vertical has w-[52px] h-[80px]", () => {
    const classes = periodSelectorContainerVariants({ orientation: "vertical" });
    expect(classes).toContain("w-[52px]");
    expect(classes).toContain("h-[80px]");
  });

  // Test 92
  test("Period selector has border-outline", () => {
    const classes = periodSelectorContainerVariants({});
    expect(classes).toContain("border-outline");
  });

  // Test 93
  test("Period selector selected has bg-tertiary-container text-on-tertiary-container", () => {
    const classes = periodSelectorItemVariants({ selected: true });
    expect(classes).toContain("bg-tertiary-container");
    expect(classes).toContain("text-on-tertiary-container");
  });

  // Test 94
  test("Period selector unselected has text-on-surface-variant", () => {
    const classes = periodSelectorItemVariants({ selected: false });
    expect(classes).toContain("text-on-surface-variant");
  });

  // Test 95
  test("Time input field has w-[96px] h-[72px]", () => {
    const classes = timeInputFieldVariants({});
    expect(classes).toContain("w-[96px]");
    expect(classes).toContain("h-[72px]");
  });

  // Test 96
  test("Time input field selected has border-2 border-primary", () => {
    const classes = timeInputFieldVariants({ selected: true });
    expect(classes).toContain("border-2");
    expect(classes).toContain("border-primary");
  });

  // Test 97
  test("Separator colon has text-on-surface", () => {
    const classes = timeSeparatorVariants();
    expect(classes).toContain("text-on-surface");
  });

  // Test 98
  test("Headline text has text-on-surface-variant", () => {
    const classes = timePickerHeadlineVariants();
    expect(classes).toContain("text-on-surface-variant");
  });

  // Test 99
  test("index.ts exports TimePicker, TimePickerDial, all variants and types", async () => {
    const exports = await import("./index");

    expect(exports.TimePicker).toBeDefined();
    expect(exports.TimePickerDial).toBeDefined();
    expect(exports.TimePickerInput).toBeDefined();
    expect(exports.timePickerContainerVariants).toBeDefined();
    expect(exports.clockDialContainerVariants).toBeDefined();
    expect(exports.clockDialNumberVariants).toBeDefined();
    expect(exports.clockHandCenterVariants).toBeDefined();
    expect(exports.clockHandTrackVariants).toBeDefined();
    expect(exports.clockHandHandleVariants).toBeDefined();
    expect(exports.timeSelectorContainerVariants).toBeDefined();
    expect(exports.periodSelectorContainerVariants).toBeDefined();
    expect(exports.periodSelectorItemVariants).toBeDefined();
    expect(exports.timeInputFieldVariants).toBeDefined();
    expect(exports.timeSeparatorVariants).toBeDefined();
    expect(exports.timePickerHeadlineVariants).toBeDefined();
    expect(exports.timePickerActionRowVariants).toBeDefined();
    expect(exports.timePickerActionButtonVariants).toBeDefined();
    expect(exports.timePickerModeToggleVariants).toBeDefined();
  });
});

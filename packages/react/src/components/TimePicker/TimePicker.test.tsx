import { describe, test, expectTypeOf } from "vitest";
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

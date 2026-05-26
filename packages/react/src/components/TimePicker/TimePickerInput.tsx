"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useButton } from "react-aria";

import { TimeInputField } from "./TimeInputField";
import { PeriodSelector } from "./PeriodSelector";

import type { TimePeriod, TimePickerInputProps, TimeValue } from "./TimePicker.types";

/**
 * Converts 12h display hour + period into internal 0-23 hour.
 */
function to24Hour(displayHour: number, period: TimePeriod): number {
  if (period === "AM") {
    return displayHour === 12 ? 0 : displayHour;
  }
  return displayHour === 12 ? 12 : displayHour + 12;
}

/**
 * Extracts the 12h display hour and period from a 0-23 hour value.
 */
function from24Hour(hour24: number): { displayHour: number; period: TimePeriod } {
  const period: TimePeriod = hour24 >= 12 ? "PM" : "AM";
  const displayHour = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return { displayHour, period };
}

/**
 * Headless TimePickerInput (Layer 2)
 *
 * Orchestrates the full time picker input (keyboard-entry) experience:
 * - Headline ("Enter time")
 * - Two large input fields (hour/minute) with spin button behavior
 * - Separator colon ":"
 * - Period selector (AM/PM) for 12-hour format
 * - Action buttons (Cancel / OK)
 * - Mode toggle (switch to clock dial)
 *
 * Key behaviors:
 * - Direct numeric keyboard input (0-9)
 * - Arrow Up/Down to increment/decrement
 * - Auto-advance from hour to minute after two digits typed
 * - Validation on blur (clamp to valid range)
 * - Tab order: hour → minute → period → action buttons
 *
 * This is a headless component — it provides behavior, ARIA semantics, and
 * data attributes only. No styling classes are applied.
 *
 * @example
 * ```tsx
 * <TimePickerInput
 *   hourCycle={12}
 *   defaultValue={{ hour: 7, minute: 0 }}
 *   onConfirm={(time) => console.log(time)}
 * />
 * ```
 */
export function TimePickerInput({
  hourCycle = 12,
  value,
  defaultValue,
  onChange,
  isDisabled = false,
  headline = "Enter time",
  cancelLabel = "Cancel",
  confirmLabel = "OK",
  onCancel,
  onConfirm,
  onModeToggle,
  className,
}: TimePickerInputProps): JSX.Element {
  const resolvedDefault = defaultValue ?? { hour: 0, minute: 0 };

  const [internalTime, setInternalTime] = useState<TimeValue>(value ?? resolvedDefault);
  const [period, setPeriod] = useState<TimePeriod>(
    () => from24Hour((value ?? resolvedDefault).hour).period
  );
  const minuteFieldRef = useRef<HTMLDivElement>(null);
  const initialTimeRef = useRef<TimeValue>(value ?? resolvedDefault);

  useEffect(() => {
    if (value !== undefined && value !== null) {
      setInternalTime(value);
      setPeriod(from24Hour(value.hour).period);
    }
  }, [value]);

  // ── Derived values ─────────────────────────────────────────────────────────

  const hour24 = internalTime.hour;
  const displayHour = hourCycle === 12 ? from24Hour(hour24).displayHour : hour24;

  const hourMin = hourCycle === 24 ? 0 : 1;
  const hourMax = hourCycle === 24 ? 23 : 12;

  // ── Handlers ───────────────────────────────────────────────────────────────

  const updateTime = useCallback(
    (newTime: TimeValue) => {
      setInternalTime(newTime);
      onChange?.(newTime);
    },
    [onChange]
  );

  const handleHourChange = useCallback(
    (newDisplayHour: number) => {
      let hour: number;
      if (hourCycle === 12) {
        hour = to24Hour(newDisplayHour, period);
      } else {
        hour = newDisplayHour;
      }
      updateTime({ ...internalTime, hour });
    },
    [hourCycle, period, internalTime, updateTime]
  );

  const handleMinuteChange = useCallback(
    (newMinute: number) => {
      updateTime({ ...internalTime, minute: newMinute });
    },
    [internalTime, updateTime]
  );

  const handlePeriodChange = useCallback(
    (newPeriod: TimePeriod) => {
      setPeriod(newPeriod);
      const { displayHour: dh } = from24Hour(internalTime.hour);
      const newHour = to24Hour(dh, newPeriod);
      updateTime({ ...internalTime, hour: newHour });
    },
    [internalTime, updateTime]
  );

  const handleHourAutoAdvance = useCallback(() => {
    const minuteEl = minuteFieldRef.current?.querySelector(
      '[data-time-input-field="minute"]'
    ) as HTMLElement | null;
    if (minuteEl) {
      minuteEl.focus();
    } else {
      const parent = minuteFieldRef.current;
      if (parent) {
        parent.focus();
      }
    }
  }, []);

  const handleConfirm = useCallback(() => {
    onConfirm?.(internalTime);
  }, [internalTime, onConfirm]);

  const handleCancel = useCallback(() => {
    if (value === undefined || value === null) {
      setInternalTime(initialTimeRef.current);
    }
    onCancel?.();
  }, [value, onCancel]);

  // ── Button refs & props ────────────────────────────────────────────────────

  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const modeToggleRef = useRef<HTMLButtonElement>(null);

  const { buttonProps: cancelButtonProps } = useButton(
    {
      "aria-label": cancelLabel,
      isDisabled,
      ...(onCancel ? { onPress: handleCancel } : {}),
    },
    cancelRef
  );

  const { buttonProps: confirmButtonProps } = useButton(
    {
      "aria-label": confirmLabel,
      isDisabled,
      ...(onConfirm ? { onPress: handleConfirm } : {}),
    },
    confirmRef
  );

  const { buttonProps: modeToggleButtonProps } = useButton(
    {
      "aria-label": "Switch to clock dial",
      isDisabled,
      ...(onModeToggle ? { onPress: onModeToggle } : {}),
    },
    modeToggleRef
  );

  // ── aria-live announcement ──────────────────────────────────────────────────

  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const h = displayHour;
    const m = internalTime.minute;
    const periodStr = hourCycle === 12 ? ` ${period}` : "";
    setAnnouncement(`${h}:${String(m).padStart(2, "0")}${periodStr}`);
  }, [internalTime, period, hourCycle, displayHour]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      className={className}
      data-variant="input"
      {...(isDisabled ? { "data-disabled": "" } : {})}
    >
      <div data-headline>{headline}</div>

      <div data-input-row>
        <TimeInputField
          field="hour"
          value={displayHour}
          onChange={handleHourChange}
          onAutoAdvance={handleHourAutoAdvance}
          min={hourMin}
          max={hourMax}
          isDisabled={isDisabled}
        />

        <span data-time-separator aria-hidden="true">
          :
        </span>

        <div ref={minuteFieldRef}>
          <TimeInputField
            field="minute"
            value={internalTime.minute}
            onChange={handleMinuteChange}
            min={0}
            max={59}
            isDisabled={isDisabled}
          />
        </div>

        {hourCycle === 12 && (
          <PeriodSelector
            value={period}
            onChange={handlePeriodChange}
            orientation="vertical"
            isDisabled={isDisabled}
          />
        )}
      </div>

      <div data-actions>
        <button
          {...modeToggleButtonProps}
          ref={modeToggleRef}
          type="button"
          data-action="mode-toggle"
        >
          🕐
        </button>
        <button {...cancelButtonProps} ref={cancelRef} type="button" data-action="cancel">
          {cancelLabel}
        </button>
        <button {...confirmButtonProps} ref={confirmRef} type="button" data-action="confirm">
          {confirmLabel}
        </button>
      </div>

      <div
        aria-live="polite"
        aria-atomic="true"
        data-live-region
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          borderWidth: 0,
        }}
      >
        {announcement}
      </div>
    </div>
  );
}

TimePickerInput.displayName = "TimePickerInput";

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useButton } from "react-aria";

import { ClockDial } from "./ClockDial";
import { TimeSelector } from "./TimeSelector";
import { PeriodSelector } from "./PeriodSelector";

import type {
  ClockSelectionMode,
  TimePeriod,
  TimePickerDialProps,
  TimeValue,
} from "./TimePicker.types";

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
 * Headless TimePickerDial (Layer 2)
 *
 * Orchestrates the full time picker dial experience by composing:
 * - Headline
 * - TimeSelector (hour:minute spinbuttons)
 * - PeriodSelector (AM/PM, 12h only)
 * - ClockDial + ClockHand
 * - Action buttons (Cancel / OK)
 * - Mode toggle (switch to keyboard input)
 *
 * Key behaviors:
 * - Initial mode: hour selection
 * - After selecting hour via clock dial, auto-advances to minute selection
 * - After selecting minute, ready for confirm
 * - Pointer drag on clock face updates value in real-time
 * - Time selector containers clickable to switch selection mode
 *
 * This is a headless component — it provides behavior, ARIA semantics, and
 * data attributes only. No styling classes are applied.
 *
 * @example
 * ```tsx
 * <TimePickerDial
 *   hourCycle={12}
 *   defaultValue={{ hour: 7, minute: 0 }}
 *   onConfirm={(time) => console.log(time)}
 * />
 * ```
 */
export function TimePickerDial({
  hourCycle = 12,
  orientation = "vertical",
  value,
  defaultValue,
  onChange,
  minuteStep = 1,
  isDisabled = false,
  headline = "Select time",
  cancelLabel = "Cancel",
  confirmLabel = "OK",
  onCancel,
  onConfirm,
  onModeToggle,
  className,
}: TimePickerDialProps): JSX.Element {
  // ── Internal state ─────────────────────────────────────────────────────────

  const resolvedDefault = defaultValue ?? { hour: 0, minute: 0 };

  const [internalTime, setInternalTime] = useState<TimeValue>(value ?? resolvedDefault);
  const [selectionMode, setSelectionMode] = useState<ClockSelectionMode>("hour");
  const [period, setPeriod] = useState<TimePeriod>(
    () => from24Hour((value ?? resolvedDefault).hour).period
  );

  // Sync controlled value
  useEffect(() => {
    if (value !== undefined && value !== null) {
      setInternalTime(value);
      setPeriod(from24Hour(value.hour).period);
    }
  }, [value]);

  // ── Derived values ─────────────────────────────────────────────────────────

  const hour24 = internalTime.hour;
  const displayHour = hourCycle === 12 ? from24Hour(hour24).displayHour : hour24;

  // ── Handlers ───────────────────────────────────────────────────────────────

  const updateTime = useCallback(
    (newTime: TimeValue) => {
      setInternalTime(newTime);
      onChange?.(newTime);
    },
    [onChange]
  );

  const handleDialSelect = useCallback(
    (selectedValue: number) => {
      if (selectionMode === "hour") {
        let newHour: number;
        if (hourCycle === 12) {
          newHour = to24Hour(selectedValue, period);
        } else {
          newHour = selectedValue;
        }
        updateTime({ ...internalTime, hour: newHour });
        setTimeout(() => setSelectionMode("minute"), 300);
      } else {
        updateTime({ ...internalTime, minute: selectedValue });
      }
    },
    [selectionMode, hourCycle, period, internalTime, updateTime]
  );

  const handleFieldChange = useCallback((field: ClockSelectionMode) => {
    setSelectionMode(field);
  }, []);

  const handleHourChange = useCallback(
    (newHour: number) => {
      let hour: number;
      if (hourCycle === 12) {
        hour = to24Hour(newHour, period);
      } else {
        hour = newHour;
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

  const handleConfirm = useCallback(() => {
    onConfirm?.(internalTime);
  }, [internalTime, onConfirm]);

  const handleCancel = useCallback(() => {
    onCancel?.();
  }, [onCancel]);

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
      "aria-label": "Switch to keyboard input",
      isDisabled,
      ...(onModeToggle ? { onPress: onModeToggle } : {}),
    },
    modeToggleRef
  );

  // ── aria-live announcement ──────────────────────────────────────────────────

  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const h = hourCycle === 12 ? displayHour : hour24;
    const m = internalTime.minute;
    const periodStr = hourCycle === 12 ? ` ${period}` : "";
    setAnnouncement(`${h}:${String(m).padStart(2, "0")}${periodStr}`);
  }, [internalTime, period, hourCycle, displayHour, hour24]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      className={className}
      data-variant="dial"
      data-orientation={orientation}
      data-selection-mode={selectionMode}
      {...(isDisabled ? { "data-disabled": "" } : {})}
    >
      <div data-headline>{headline}</div>

      <TimeSelector
        hour={displayHour}
        minute={internalTime.minute}
        activeField={selectionMode}
        onFieldChange={handleFieldChange}
        onHourChange={handleHourChange}
        onMinuteChange={handleMinuteChange}
        hourCycle={hourCycle}
        isDisabled={isDisabled}
      />

      {hourCycle === 12 && (
        <PeriodSelector value={period} onChange={handlePeriodChange} isDisabled={isDisabled} />
      )}

      <ClockDial
        selectionMode={selectionMode}
        selectedHour={hourCycle === 12 ? displayHour : hour24}
        selectedMinute={internalTime.minute}
        hourCycle={hourCycle}
        minuteStep={minuteStep}
        onSelect={handleDialSelect}
        isDisabled={isDisabled}
      />

      <div data-actions>
        <button
          {...modeToggleButtonProps}
          ref={modeToggleRef}
          type="button"
          data-action="mode-toggle"
        >
          ⌨
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

TimePickerDial.displayName = "TimePickerDial";

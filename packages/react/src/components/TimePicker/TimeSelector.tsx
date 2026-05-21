"use client";

import { useCallback } from "react";

import type { TimeSelectorProps } from "./TimePicker.types";

/**
 * Formats hour for display, respecting the hour cycle.
 * - 12h: displays 1-12
 * - 24h: displays 0-23 (zero-padded)
 */
function formatHour(hour: number, hourCycle: 12 | 24): string {
  if (hourCycle === 12) {
    const display = hour % 12;
    return String(display === 0 ? 12 : display).padStart(2, "0");
  }
  return String(hour).padStart(2, "0");
}

/**
 * Formats minute for display (always zero-padded to 2 digits).
 */
function formatMinute(minute: number): string {
  return String(minute).padStart(2, "0");
}

/**
 * Headless TimeSelector (Layer 2)
 *
 * Renders the hour:minute display with two large interactive containers
 * acting as `role="spinbutton"` elements. Users can click to switch between
 * hour and minute selection, or use Arrow Up/Down to increment/decrement values.
 *
 * This is a headless component — it provides behavior, ARIA semantics, and
 * data attributes only. No styling classes are applied.
 *
 * @internal
 */
export function TimeSelector({
  hour,
  minute,
  activeField,
  onFieldChange,
  onHourChange,
  onMinuteChange,
  hourCycle,
  isDisabled = false,
  className,
}: TimeSelectorProps): JSX.Element {
  const hourMin = hourCycle === 24 ? 0 : 1;
  const hourMax = hourCycle === 24 ? 23 : 12;

  const handleHourKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isDisabled) return;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const next = hour >= hourMax ? hourMin : hour + 1;
        onHourChange?.(next);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = hour <= hourMin ? hourMax : hour - 1;
        onHourChange?.(next);
      }
    },
    [hour, hourMin, hourMax, isDisabled, onHourChange]
  );

  const handleMinuteKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isDisabled) return;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const next = minute >= 59 ? 0 : minute + 1;
        onMinuteChange?.(next);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = minute <= 0 ? 59 : minute - 1;
        onMinuteChange?.(next);
      }
    },
    [minute, isDisabled, onMinuteChange]
  );

  const handleHourClick = useCallback(() => {
    if (isDisabled) return;
    onFieldChange("hour");
  }, [isDisabled, onFieldChange]);

  const handleMinuteClick = useCallback(() => {
    if (isDisabled) return;
    onFieldChange("minute");
  }, [isDisabled, onFieldChange]);

  return (
    <div className={className} data-time-selector>
      <div
        role="spinbutton"
        tabIndex={isDisabled ? -1 : 0}
        aria-label="Hours"
        aria-valuenow={hour}
        aria-valuemin={hourMin}
        aria-valuemax={hourMax}
        aria-disabled={isDisabled || undefined}
        data-time-field="hour"
        {...(activeField === "hour" ? { "data-selected": "" } : {})}
        onClick={handleHourClick}
        onKeyDown={handleHourKeyDown}
      >
        {formatHour(hour, hourCycle)}
      </div>
      <span data-time-separator aria-hidden="true">
        :
      </span>
      <div
        role="spinbutton"
        tabIndex={isDisabled ? -1 : 0}
        aria-label="Minutes"
        aria-valuenow={minute}
        aria-valuemin={0}
        aria-valuemax={59}
        aria-disabled={isDisabled || undefined}
        data-time-field="minute"
        {...(activeField === "minute" ? { "data-selected": "" } : {})}
        onClick={handleMinuteClick}
        onKeyDown={handleMinuteKeyDown}
      >
        {formatMinute(minute)}
      </div>
    </div>
  );
}

TimeSelector.displayName = "TimeSelector";

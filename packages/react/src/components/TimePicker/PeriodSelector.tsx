"use client";

import { useCallback } from "react";

import type { PeriodSelectorProps, TimePeriod } from "./TimePicker.types";

const PERIODS: readonly TimePeriod[] = ["AM", "PM"] as const;

/**
 * Headless PeriodSelector (Layer 2)
 *
 * Renders an AM/PM toggle as a `role="radiogroup"` with two `role="radio"`
 * options. Supports keyboard navigation (Arrow Left/Right to toggle).
 *
 * Only rendered for 12-hour format time pickers.
 *
 * This is a headless component — it provides behavior, ARIA semantics, and
 * data attributes only. No styling classes are applied.
 *
 * @internal
 */
export function PeriodSelector({
  value,
  onChange,
  orientation = "vertical",
  isDisabled = false,
  className,
}: PeriodSelectorProps): JSX.Element {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, period: TimePeriod) => {
      if (isDisabled) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        const next = period === "AM" ? "PM" : "AM";
        onChange(next);
      }
    },
    [isDisabled, onChange]
  );

  const handleClick = useCallback(
    (period: TimePeriod) => {
      if (isDisabled) return;
      onChange(period);
    },
    [isDisabled, onChange]
  );

  return (
    <div
      role="radiogroup"
      aria-label="Time period"
      className={className}
      data-period-selector
      data-orientation={orientation}
      {...(isDisabled ? { "data-disabled": "" } : {})}
    >
      {PERIODS.map((period) => {
        const isSelected = value === period;
        return (
          <div
            key={period}
            role="radio"
            tabIndex={isDisabled ? -1 : isSelected ? 0 : -1}
            aria-checked={isSelected}
            aria-label={period}
            aria-disabled={isDisabled || undefined}
            data-period={period}
            {...(isSelected ? { "data-selected": "" } : {})}
            onClick={() => handleClick(period)}
            onKeyDown={(e) => handleKeyDown(e, period)}
          >
            {period}
          </div>
        );
      })}
    </div>
  );
}

PeriodSelector.displayName = "PeriodSelector";

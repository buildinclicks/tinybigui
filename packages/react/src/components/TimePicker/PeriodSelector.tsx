"use client";

import { useCallback, useRef } from "react";
import { useFocusRing, mergeProps } from "react-aria";

import type { PeriodSelectorProps, TimePeriod } from "./TimePicker.types";

const PERIODS: readonly TimePeriod[] = ["AM", "PM"] as const;

/**
 * Internal radio item with focus-visible support.
 * @internal
 */
function PeriodRadio({
  period,
  isSelected,
  isDisabled,
  onClick,
  onKeyDown,
}: {
  period: TimePeriod;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <div
      {...mergeProps(focusProps, { onClick, onKeyDown })}
      ref={ref}
      role="radio"
      tabIndex={isDisabled ? -1 : isSelected ? 0 : -1}
      aria-checked={isSelected}
      aria-label={period}
      aria-disabled={isDisabled || undefined}
      data-period={period}
      {...(isSelected ? { "data-selected": "" } : {})}
      {...(isFocusVisible ? { "data-focus-visible": "" } : {})}
    >
      {period}
    </div>
  );
}

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
      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
      ) {
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
          <PeriodRadio
            key={period}
            period={period}
            isSelected={isSelected}
            isDisabled={isDisabled}
            onClick={() => handleClick(period)}
            onKeyDown={(e) => handleKeyDown(e, period)}
          />
        );
      })}
    </div>
  );
}

PeriodSelector.displayName = "PeriodSelector";

"use client";

import { useCallback, useRef } from "react";

import { ClockHand } from "./ClockHand";
import { useClockDial } from "./useClockDial";

import type { ClockDialProps } from "./TimePicker.types";

/** 12-hour number labels (1-12). */
const HOURS_12: readonly number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

/** Outer ring for 24h mode (1-12). */
const HOURS_24_OUTER: readonly number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

/** Inner ring for 24h mode (13-24, with 0 replacing 24). */
const HOURS_24_INNER: readonly number[] = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0] as const;

/**
 * Converts a numeric position (0-11 around the dial) to x/y percentages
 * on a circle, starting from 12 o'clock and going clockwise.
 */
function positionOnCircle(
  index: number,
  total: number,
  radiusPercent: number
): { x: number; y: number } {
  const angleDeg = (index * 360) / total - 90;
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: 50 + radiusPercent * Math.cos(angleRad),
    y: 50 + radiusPercent * Math.sin(angleRad),
  };
}

/**
 * Converts a selected value to an angle in degrees from 12 o'clock.
 */
function valueToAngle(value: number, mode: "hour" | "minute"): number {
  if (mode === "hour") {
    return ((value % 12) * 30) % 360;
  }
  return (value * 6) % 360;
}

/**
 * Headless ClockDial (Layer 2)
 *
 * Renders a circular clock face with numbered positions for hour or minute selection.
 * Uses the `useClockDial` custom hook for pointer-to-angle interaction.
 *
 * - 12-hour: single ring with numbers 1-12 at 30° intervals
 * - 24-hour: outer ring 1-12, inner ring 13-24 (with 0)
 * - Each number is a 48dp touch target
 *
 * This is a headless component — it provides behavior, ARIA semantics, and
 * data attributes only. No styling classes are applied.
 *
 * @internal
 */
export function ClockDial({
  selectionMode,
  selectedHour,
  selectedMinute,
  hourCycle,
  minuteStep = 1,
  onSelect,
  isDisabled = false,
  className,
}: ClockDialProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  const { dialProps, handAngle, isDragging, isInnerRing } = useClockDial({
    selectionMode,
    hourCycle,
    ...(onSelect ? { onSelect } : {}),
    containerRef,
    isDisabled,
    minuteStep,
  });

  const currentValue = selectionMode === "hour" ? selectedHour : selectedMinute;
  const displayAngle = isDragging ? handAngle : valueToAngle(currentValue, selectionMode);

  const isInnerSelected =
    selectionMode === "hour" && hourCycle === 24 && (currentValue === 0 || currentValue > 12);

  const resolvedIsInner = isDragging ? isInnerRing : isInnerSelected;

  const handleNumberClick = useCallback(
    (value: number) => {
      if (isDisabled) return;
      onSelect?.(value);
    },
    [isDisabled, onSelect]
  );

  const handleNumberKeyDown = useCallback(
    (e: React.KeyboardEvent, value: number) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleNumberClick(value);
      }
    },
    [handleNumberClick]
  );

  const renderClockNumber = (
    key: string,
    value: number,
    label: string,
    pos: { x: number; y: number },
    isSelected: boolean,
    extraAttrs?: Record<string, string>
  ): JSX.Element => (
    <div
      key={key}
      role="option"
      tabIndex={isDisabled ? -1 : 0}
      aria-selected={isSelected}
      aria-label={`${value}`}
      data-clock-number
      data-value={value}
      {...(isSelected ? { "data-selected": "" } : {})}
      {...extraAttrs}
      style={{
        position: "absolute",
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onClick={() => handleNumberClick(value)}
      onKeyDown={(e) => handleNumberKeyDown(e, value)}
    >
      {label}
    </div>
  );

  const renderHourNumbers = (): JSX.Element[] => {
    if (hourCycle === 24) {
      const outerNumbers = HOURS_24_OUTER.map((hour, i) => {
        const pos = positionOnCircle(i, 12, 40);
        const isSelected = selectionMode === "hour" && selectedHour === hour;
        return renderClockNumber(`outer-${hour}`, hour, `${hour}`, pos, isSelected);
      });
      const innerNumbers = HOURS_24_INNER.map((hour, i) => {
        const pos = positionOnCircle(i, 12, 25);
        const isSelected = selectionMode === "hour" && selectedHour === hour;
        return renderClockNumber(`inner-${hour}`, hour, `${hour}`, pos, isSelected, {
          "data-inner-ring": "",
        });
      });
      return [...outerNumbers, ...innerNumbers];
    }

    return HOURS_12.map((hour, i) => {
      const pos = positionOnCircle(i, 12, 40);
      const isSelected = selectionMode === "hour" && selectedHour === hour;
      return renderClockNumber(`${hour}`, hour, `${hour}`, pos, isSelected);
    });
  };

  const renderMinuteNumbers = (): JSX.Element[] => {
    const minuteLabels = Array.from({ length: 12 }, (_, i) => i * 5);
    return minuteLabels.map((minute, i) => {
      const pos = positionOnCircle(i, 12, 40);
      const isSelected = selectionMode === "minute" && selectedMinute === minute;
      return renderClockNumber(
        `${minute}`,
        minute,
        String(minute).padStart(2, "0"),
        pos,
        isSelected
      );
    });
  };

  return (
    <div
      ref={containerRef}
      {...dialProps}
      className={className}
      role="listbox"
      aria-label={selectionMode === "hour" ? "Clock dial hours" : "Clock dial minutes"}
      data-clock-dial
      data-selection-mode={selectionMode}
      data-hour-cycle={hourCycle}
      {...(isDisabled ? { "data-disabled": "" } : {})}
      style={{ position: "relative", touchAction: "none" }}
    >
      <ClockHand angle={displayAngle} mode={selectionMode} isInnerRing={resolvedIsInner} />
      {selectionMode === "hour" ? renderHourNumbers() : renderMinuteNumbers()}
    </div>
  );
}

ClockDial.displayName = "ClockDial";

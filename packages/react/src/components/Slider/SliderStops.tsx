"use client";

import type React from "react";
import { cn } from "../../utils/cn";
import { sliderStopsContainerVariants, sliderStopDotVariants } from "./Slider.variants";
import type { SliderSize, SliderVariant } from "./Slider.types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Determines whether a stop value falls on the active track portion.
 *
 * MD3 spec §5.2: active track color vs inactive track color per variant.
 * - standard: active fill covers min → current value
 * - centered: active fill covers center (0) ↔ current value
 * - range: active fill covers values[0] → values[1]
 */
function getIsOnActiveTrack(
  stopValue: number,
  values: number[],
  variant: SliderVariant,
  minValue: number,
  maxValue: number
): boolean {
  if (variant === "range") {
    const lo = values[0] ?? minValue;
    const hi = values[1] ?? maxValue;
    return stopValue >= lo && stopValue <= hi;
  }
  if (variant === "centered") {
    const current = values[0] ?? 0;
    if (current >= 0) {
      return stopValue >= 0 && stopValue <= current;
    }
    return stopValue >= current && stopValue <= 0;
  }
  // standard
  return stopValue <= (values[0] ?? minValue);
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface SliderStopsProps {
  /**
   * Minimum value of the slider range — defines the leftmost stop.
   */
  minValue: number;
  /**
   * Maximum value of the slider range — defines the rightmost stop.
   */
  maxValue: number;
  /**
   * Step increment. Stop count = floor((max - min) / step) + 1.
   */
  step: number;
  /**
   * Current value(s) — used to determine which dots are on the active track.
   */
  values: number[];
  /**
   * Structural variant — determines active track region.
   */
  variant: SliderVariant;
  /**
   * Size of the slider (controls dot dimensions).
   * @default 'xsmall'
   */
  size?: SliderSize;
  /**
   * Additional CSS classes for the stops container.
   */
  className?: string;
}

// ─── SliderStops ──────────────────────────────────────────────────────────────

/**
 * Renders discrete stop indicator dots as an absolute overlay on the track.
 *
 * MD3 spec §5.2, §10.5: 4dp circular dots distributed with `justify-between`,
 * colored `on-primary` on the active track and `on-secondary-container` on
 * the inactive track. Padding of 4dp from track edges.
 *
 * Disabled dot styling is driven by `group-data-[disabled]/slider:` CSS
 * selectors on the root slider container — no explicit `isDisabled` prop needed.
 *
 * This is a purely decorative sub-component. All accessibility information
 * is carried by the underlying `<input type="range">` via React Aria.
 *
 * @example
 * ```tsx
 * <SliderStops
 *   minValue={0}
 *   maxValue={100}
 *   step={10}
 *   values={[50]}
 *   variant="standard"
 *   size="xsmall"
 * />
 * ```
 */
export function SliderStops({
  minValue,
  maxValue,
  step,
  values,
  variant,
  size = "xsmall",
  className,
}: SliderStopsProps): React.JSX.Element {
  const stopCount = Math.floor((maxValue - minValue) / step) + 1;

  return (
    <div
      data-slot="stops-container"
      className={cn(sliderStopsContainerVariants(), className)}
      aria-hidden="true"
    >
      {Array.from({ length: stopCount }, (_, i) => {
        const stopValue = minValue + i * step;
        const isOnActive = getIsOnActiveTrack(stopValue, values, variant, minValue, maxValue);
        return (
          <span
            key={i}
            data-slot="stop-dot"
            className={cn(
              sliderStopDotVariants({
                region: isOnActive ? "active" : "inactive",
                size,
              })
            )}
          />
        );
      })}
    </div>
  );
}

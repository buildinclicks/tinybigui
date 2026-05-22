"use client";

import type { ClockHandProps } from "./TimePicker.types";

/**
 * Headless ClockHand (Layer 2)
 *
 * Renders the clock hand selector: a center dot (8dp), a track line (2dp),
 * and a handle circle (48dp) at the selected angular position.
 *
 * This is a headless component — it provides behavior, ARIA semantics, and
 * data attributes only. No styling classes are applied.
 *
 * @internal
 */
export function ClockHand({
  angle,
  mode,
  isInnerRing = false,
  className,
}: ClockHandProps): JSX.Element {
  return (
    <div
      className={className}
      data-clock-hand
      data-mode={mode}
      {...(isInnerRing ? { "data-inner-ring": "" } : {})}
      style={{ transform: `rotate(${angle}deg)` }}
      aria-hidden="true"
    >
      <div data-clock-hand-center />
      <div data-clock-hand-track />
      <div data-clock-hand-handle />
    </div>
  );
}

ClockHand.displayName = "ClockHand";

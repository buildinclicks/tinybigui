"use client";

import type React from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { cn } from "../../utils/cn";
import { sliderValueIndicatorVariants, sliderValueIndicatorTextVariants } from "./Slider.variants";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SliderValueIndicatorProps {
  /**
   * Numeric value to display in the pill label.
   */
  value: number;
  /**
   * Optional formatter for the displayed value string.
   * @default (v) => `${Math.round(v)}`
   * @example (v) => `$${v}`
   */
  formatValue?: (value: number) => string;
  /**
   * Additional CSS classes for the indicator container.
   */
  className?: string;
}

// ─── SliderValueIndicator ─────────────────────────────────────────────────────

/**
 * Floating pill label that appears above the handle when the thumb is pressed.
 *
 * MD3 spec §5.3, §9.3, §10.4:
 * - Pill shape (`rounded-full`, 1000dp radius)
 * - Background: `inverse-surface`
 * - Text: `inverse-on-surface`, Label Large typography
 * - Min-width: 48dp, padding 16dp horizontal / 12dp vertical
 * - Positioned absolutely above the thumb; centered horizontally
 * - Visible only during Pressed state; CSS-driven via
 *   `group-data-[pressed]/slider-thumb:opacity-100 scale-100`
 *
 * Rendered as a child of the RA thumb element (`group/slider-thumb`).
 * The element is always present in the DOM when `showValueIndicator=true`.
 * Visibility is driven by `group-data-[pressed]/slider-thumb` CSS selectors
 * (no JS state required). `aria-hidden="true"` permanently since the accessible
 * value is in the `<output>` element managed by React Aria.
 *
 * **Motion**: MD3 spring standard fast spatial tokens for transform/opacity.
 *   Suppressed via `useReducedMotion()` for prefers-reduced-motion.
 *
 * @example
 * ```tsx
 * // Inside renderThumbContent — always rendered when showValueIndicator=true
 * <SliderValueIndicator value={50} formatValue={(v) => `$${v}`} />
 * ```
 */
export function SliderValueIndicator({
  value,
  formatValue,
  className,
}: SliderValueIndicatorProps): React.JSX.Element {
  const displayValue = formatValue ? formatValue(value) : `${Math.round(value)}`;
  const reducedMotion = useReducedMotion();

  // MD3 spring system: transform/opacity transition for entry/exit.
  // Scale (transform) uses spatial spring; opacity is coupled to the same
  // spring for a single unified animation.
  // Suppressed entirely when prefers-reduced-motion is active.
  const transitionClasses = reducedMotion
    ? ""
    : "transition-[transform,opacity] duration-spring-standard-fast-spatial ease-spring-standard-fast-spatial";

  return (
    <div
      data-slot="value-indicator"
      className={cn(sliderValueIndicatorVariants(), transitionClasses, className)}
      role="tooltip"
      aria-hidden="true"
    >
      <span className={sliderValueIndicatorTextVariants()}>{displayValue}</span>
    </div>
  );
}

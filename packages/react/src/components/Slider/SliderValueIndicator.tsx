"use client";

import type React from "react";
import { cn } from "../../utils/cn";
import { sliderValueIndicatorVariants, sliderValueIndicatorTextVariants } from "./Slider.variants";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SliderValueIndicatorProps {
  /**
   * Numeric value to display in the pill label.
   */
  value: number;
  /**
   * Whether the indicator is currently visible (thumb in Pressed state).
   * When false the pill is rendered but hidden via `opacity-0 scale-0`.
   * @default false
   */
  isVisible: boolean;
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
 * - Visible only during Pressed state; hidden otherwise (`opacity-0 scale-0`)
 * - Transition: spring standard fast effects (MD3 motion §9.3)
 *
 * Rendered as a child of the handle element (which is `position: relative`).
 * The `role="tooltip"` marks it as decorative — accessible value is in the
 * underlying `<input type="range">` managed by React Aria.
 *
 * @example
 * ```tsx
 * <SliderValueIndicator
 *   value={50}
 *   isVisible={isPressed}
 *   formatValue={(v) => `$${v}`}
 * />
 * ```
 */
export function SliderValueIndicator({
  value,
  isVisible,
  formatValue,
  className,
}: SliderValueIndicatorProps): React.JSX.Element {
  const displayValue = formatValue ? formatValue(value) : `${Math.round(value)}`;

  return (
    <div
      data-slot="value-indicator"
      className={cn(sliderValueIndicatorVariants({ visible: isVisible }), className)}
      role="tooltip"
      aria-hidden={!isVisible}
    >
      <span className={sliderValueIndicatorTextVariants()}>{displayValue}</span>
    </div>
  );
}

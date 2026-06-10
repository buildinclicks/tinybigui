import { forwardRef, useRef } from "react";
import type React from "react";
import { useProgressBar } from "react-aria";
import type { ProgressHeadlessProps } from "./Progress.types";

/**
 * Headless Progress Indicator Component (Layer 2)
 *
 * Unstyled progress bar primitive using React Aria for accessibility.
 * Provides behavior only — bring your own styles.
 *
 * Features:
 * - role="progressbar" with correct aria-value* attributes
 * - Determinate and indeterminate progress support
 * - Internationalized value label formatting via React Aria
 * - Label linkage via aria-labelledby / aria-label
 * - Render prop for custom visual rendering (receives shape + thickness)
 *
 * @example
 * ```tsx
 * // Custom visual via render prop
 * <ProgressHeadless
 *   value={50}
 *   label="Upload"
 *   renderProgress={({ percentage, shape, thickness }) => (
 *     <div style={{ width: `${percentage}%` }} />
 *   )}
 * />
 *
 * // Children-based rendering
 * <ProgressHeadless value={75} aria-label="Loading">
 *   <MyCustomProgressVisual />
 * </ProgressHeadless>
 * ```
 */
export const ProgressHeadless = forwardRef<HTMLDivElement, ProgressHeadlessProps>(
  (
    {
      type = "linear",
      indeterminate = false,
      size = "medium",
      shape = "flat",
      thickness = "default",
      className,
      children,
      renderProgress,
      label,
      value = 0,
      minValue = 0,
      maxValue = 100,
      ...restProps
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLDivElement>;

    const { progressBarProps, labelProps } = useProgressBar({
      label,
      value,
      minValue,
      maxValue,
      isIndeterminate: indeterminate,
      ...restProps,
    });

    const percentage = indeterminate ? 0 : ((value - minValue) / (maxValue - minValue)) * 100;

    return (
      <div {...progressBarProps} ref={ref} className={className}>
        {label && <span {...labelProps}>{label}</span>}
        {renderProgress?.({
          percentage,
          isIndeterminate: indeterminate,
          type,
          size,
          shape,
          thickness,
        })}
        {children}
      </div>
    );
  }
);

ProgressHeadless.displayName = "ProgressHeadless";

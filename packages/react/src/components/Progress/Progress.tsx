"use client";

import { forwardRef, useRef } from "react";
import type React from "react";
import { useProgressBar } from "react-aria";
import { cn } from "../../utils/cn";
import {
  progressContainerVariants,
  progressTrackVariants,
  progressIndicatorVariants,
  progressStopIndicatorVariants,
  progressCircularSizeVariants,
  progressLabelVariants,
} from "./Progress.variants";
import type { ProgressProps } from "./Progress.types";
import "./Progress.css";

// ---------------------------------------------------------------------------
// SVG constants for circular variant
// MD3 spec: stroke-width = 4dp; size maps to dp values below.
// ---------------------------------------------------------------------------

const STROKE_WIDTH = 4;

const CIRCULAR_SIZE_PX: Record<"small" | "medium" | "large", number> = {
  small: 24,
  medium: 48,
  large: 64,
};

function getCircularGeometry(size: "small" | "medium" | "large"): {
  diameter: number;
  radius: number;
  circumference: number;
  viewBox: string;
  cx: number;
  cy: number;
} {
  const diameter = CIRCULAR_SIZE_PX[size];
  const radius = (diameter - STROKE_WIDTH) / 2;
  const circumference = 2 * Math.PI * radius;
  const viewBox = `0 0 ${diameter} ${diameter}`;
  const cx = diameter / 2;
  const cy = diameter / 2;
  return { diameter, radius, circumference, viewBox, cx, cy };
}

/**
 * Material Design 3 Progress Indicator (Layer 3: Styled)
 *
 * Built on React Aria for world-class accessibility.
 * Supports four variants driven by `type` + `indeterminate` props:
 *   - Linear Determinate
 *   - Linear Indeterminate
 *   - Circular Determinate
 *   - Circular Indeterminate
 *
 * MD3 Specifications:
 * - Linear track height: 4dp (h-1)
 * - Linear track shape: rounded-full
 * - Circular default size: 48dp (medium)
 * - Circular stroke width: 4dp (SVG attribute)
 * - Active track: primary
 * - Inactive track: surface-container-highest
 * - Determinate transitions: duration-medium4 + ease-standard
 * - Indeterminate linear cycle: duration-long2
 * - Indeterminate circular rotation: duration-long4
 *
 * @example
 * ```tsx
 * // Linear determinate
 * <Progress type="linear" value={60} label="Uploading" />
 *
 * // Linear indeterminate
 * <Progress type="linear" indeterminate aria-label="Loading" />
 *
 * // Circular determinate
 * <Progress type="circular" value={75} label="Processing" />
 *
 * // Circular indeterminate
 * <Progress type="circular" indeterminate aria-label="Loading" />
 *
 * // Circular small spinner
 * <Progress type="circular" indeterminate size="small" aria-label="Loading" />
 * ```
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      type = "linear",
      indeterminate = false,
      size = "medium",
      className,
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

    // React Aria: provides progressBarProps (role, aria-value*) and labelProps
    const { progressBarProps, labelProps } = useProgressBar({
      label,
      value,
      minValue,
      maxValue,
      isIndeterminate: indeterminate,
      ...restProps,
    });

    // Percentage for determinate rendering
    const percentage = indeterminate
      ? 0
      : Math.min(100, Math.max(0, ((value - minValue) / (maxValue - minValue)) * 100));

    // Development warning: require accessible label
    if (process.env.NODE_ENV !== "production") {
      const ariaProps = restProps as {
        "aria-label"?: string;
        "aria-labelledby"?: string;
      };
      if (!label && !ariaProps["aria-label"] && !ariaProps["aria-labelledby"]) {
        console.warn(
          "[Progress] Progress indicator should have a visible label prop or aria-label for accessibility."
        );
      }
    }

    return (
      <div
        {...progressBarProps}
        ref={ref}
        className={cn(progressContainerVariants({ type }), className)}
      >
        {/* Optional visible label */}
        {label && (
          <span {...labelProps} className={cn(progressLabelVariants())}>
            {label}
          </span>
        )}

        {/* Visual rendering: branches on type × indeterminate */}
        {type === "linear" ? (
          <LinearProgress percentage={percentage} indeterminate={indeterminate} />
        ) : (
          <CircularProgress percentage={percentage} indeterminate={indeterminate} size={size} />
        )}
      </div>
    );
  }
);

Progress.displayName = "Progress";

// ---------------------------------------------------------------------------
// Linear Progress Visual
// ---------------------------------------------------------------------------

interface LinearProgressProps {
  percentage: number;
  indeterminate: boolean;
}

function LinearProgress({ percentage, indeterminate }: LinearProgressProps): React.JSX.Element {
  if (indeterminate) {
    return (
      <div data-progress-track="" className={cn(progressTrackVariants())}>
        <div
          data-progress-indeterminate=""
          className="absolute inset-0 overflow-hidden rounded-full"
        >
          {/* Segment 1 */}
          <div
            className={cn(
              "bg-primary absolute top-0 h-full rounded-full",
              "animate-progress-linear-indeterminate-1"
            )}
          />
          {/* Segment 2 */}
          <div
            className={cn(
              "bg-primary absolute top-0 h-full rounded-full",
              "animate-progress-linear-indeterminate-2"
            )}
          />
        </div>
      </div>
    );
  }

  return (
    <div data-progress-track="" className={cn(progressTrackVariants())}>
      {/* Determinate indicator bar */}
      <div
        data-progress-indicator=""
        className={cn(progressIndicatorVariants())}
        style={{ width: `${percentage}%` }}
      />
      {/* Stop indicator dot — leading edge of progress head per MD3 */}
      <div
        data-stop-indicator=""
        className={cn(progressStopIndicatorVariants())}
        style={{ left: `${percentage}%` }}
        aria-hidden="true"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Circular Progress Visual
// ---------------------------------------------------------------------------

interface CircularProgressProps {
  percentage: number;
  indeterminate: boolean;
  size: "small" | "medium" | "large";
}

function CircularProgress({
  percentage,
  indeterminate,
  size,
}: CircularProgressProps): React.JSX.Element {
  const { radius, circumference, viewBox, cx, cy } = getCircularGeometry(size);

  // stroke-dashoffset: 0 = full circle (100%), circumference = empty circle (0%)
  const strokeDashoffset = (1 - percentage / 100) * circumference;

  if (indeterminate) {
    return (
      <div
        data-progress-size={size}
        data-progress-indeterminate=""
        className={cn(progressCircularSizeVariants({ size }))}
      >
        <svg
          viewBox={viewBox}
          className="animate-progress-circular-rotate h-full w-full"
          aria-hidden="true"
        >
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            className="text-surface-container-highest"
          />
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            className="animate-progress-circular-dash text-primary"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <div data-progress-size={size} className={cn(progressCircularSizeVariants({ size }))}>
      <svg viewBox={viewBox} className="h-full w-full -rotate-90" aria-hidden="true">
        {/* Background circle (inactive track) */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE_WIDTH}
          className="text-surface-container-highest"
        />
        {/* Foreground circle (active track, determinate) */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          className="text-primary duration-medium4 ease-standard transition-[stroke-dashoffset]"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
    </div>
  );
}

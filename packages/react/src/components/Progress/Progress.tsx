"use client";

import { forwardRef, useRef, useEffect, useState } from "react";
import type React from "react";
import { useProgressBar } from "react-aria";
import { cn } from "../../utils/cn";

// ---------------------------------------------------------------------------
// Reduced-motion hook
// (useReducedMotion is not available in this version of react-aria)
// ---------------------------------------------------------------------------

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent): void => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return reduced;
}
import {
  progressContainerVariants,
  progressTrackVariants,
  progressActiveIndicatorVariants,
  progressInactiveSegmentVariants,
  progressStopIndicatorVariants,
  progressCircularSizeVariants,
  progressLabelVariants,
} from "./Progress.variants";
import type { ProgressProps } from "./Progress.types";
import "./Progress.css";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** MD3 spec: stroke-width = 4dp for default thickness */
const STROKE_WIDTH_DEFAULT = 4;
/** MD3 Expressive: stroke-width = 8dp for thick variant */
const STROKE_WIDTH_THICK = 8;

/** 4dp indicator-track gap (in px — SVG px = CSS px at 1x) */
const INDICATOR_TRACK_GAP = 4;

const CIRCULAR_SIZE_PX: Record<"small" | "medium" | "large", number> = {
  small: 24,
  medium: 48,
  large: 64,
};

/** MD3 Expressive wavy defaults */
const WAVE_AMPLITUDE_DEFAULT = 3; // px — visible wave height
const WAVE_AMPLITUDE_THICK = 5; // px — scaled for thick track
const WAVE_WAVELENGTH_LINEAR = 40; // px — one full wave
const WAVE_WAVELENGTH_CIRCULAR = 30; // px — tighter curve for circular

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------

function getStrokeWidth(thickness: "default" | "thick"): number {
  return thickness === "thick" ? STROKE_WIDTH_THICK : STROKE_WIDTH_DEFAULT;
}

function getCircularGeometry(
  size: "small" | "medium" | "large",
  thickness: "default" | "thick"
): {
  diameter: number;
  radius: number;
  circumference: number;
  viewBox: string;
  cx: number;
  cy: number;
  strokeWidth: number;
} {
  const strokeWidth = getStrokeWidth(thickness);
  const diameter = CIRCULAR_SIZE_PX[size];
  const radius = (diameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const viewBox = `0 0 ${diameter} ${diameter}`;
  const cx = diameter / 2;
  const cy = diameter / 2;
  return { diameter, radius, circumference, viewBox, cx, cy, strokeWidth };
}

// ---------------------------------------------------------------------------
// Wavy path builders
// ---------------------------------------------------------------------------

/**
 * Build an SVG `d` string for a horizontal sine wave.
 * The path starts at x=0 and repeats for (extraCycles + 1) wavelengths so
 * the wave-translate animation loops seamlessly.
 *
 * @param totalWidth   — container px width (used for repeats)
 * @param amplitude    — half-height of the wave in px
 * @param wavelength   — horizontal distance for one full cycle in px
 * @param extraCycles  — extra wavelength repetitions added to the right to
 *                       allow the translate animation to loop cleanly
 */
function buildLinearWavePath(
  totalWidth: number,
  amplitude: number,
  wavelength: number,
  extraCycles = 2
): string {
  const totalPathWidth = totalWidth + extraCycles * wavelength;
  const segments: string[] = [];
  let x = 0;

  // Start at the midline
  segments.push(`M 0 ${amplitude}`);

  // Each wavelength is two half-cycles (cubic bezier approximation of sine)
  const cp = wavelength / 4;
  while (x < totalPathWidth) {
    // First half: up peak
    segments.push(
      `C ${x + cp} ${0} ${x + wavelength / 2 - cp} ${0} ${x + wavelength / 2} ${amplitude}`
    );
    // Second half: down trough
    const mid = x + wavelength / 2;
    segments.push(
      `C ${mid + cp} ${2 * amplitude} ${mid + wavelength / 2 - cp} ${2 * amplitude} ${mid + wavelength / 2} ${amplitude}`
    );
    x += wavelength;
  }

  return segments.join(" ");
}

/**
 * Build a wavy SVG `d` string that follows the circular arc.
 * Uses radial offset (outward/inward perturbation) along the circle.
 *
 * @param cx         — circle centre x
 * @param cy         — circle centre y
 * @param radius     — arc radius
 * @param strokeWidth — stroke width (determines visual band)
 * @param amplitude  — radial perturbation amplitude in px
 * @param wavelength — arc-length per wave cycle in px
 * @param steps      — number of arc segments for approximation
 */
function buildCircularWavePath(
  cx: number,
  cy: number,
  radius: number,
  amplitude: number,
  wavelength: number,
  steps = 120
): string {
  const circumference = 2 * Math.PI * radius;
  const points: string[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * 2 * Math.PI - Math.PI / 2; // start at top (−90°)
    // Radial perturbation: sine wave scaled to arc length
    const wavePhase = (circumference * t) / wavelength;
    const radialOffset = amplitude * Math.sin(2 * Math.PI * wavePhase);
    const r = radius + radialOffset;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push(
      i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : `L ${x.toFixed(2)} ${y.toFixed(2)}`
    );
  }

  return points.join(" ") + " Z";
}

// ---------------------------------------------------------------------------
// Main Progress component
// ---------------------------------------------------------------------------

/**
 * Material Design 3 Progress Indicator (Layer 3: Styled)
 *
 * Built on React Aria for world-class accessibility.
 * Implements MD3 Expressive spec:
 *   - Colorful track: primary-container (inactive), primary (active)
 *   - 4dp indicator-track gap (linear + circular)
 *   - Fully-rounded segments
 *   - Optional thick (8dp) track
 *   - Optional wavy shape with amplitude ramp
 *   - useReducedMotion guard: wavy falls back to flat when reduced-motion is set
 *
 * Four variants driven by `type` × `indeterminate`:
 *   - Linear Determinate
 *   - Linear Indeterminate
 *   - Circular Determinate
 *   - Circular Indeterminate
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
 * // Thick wavy (MD3 Expressive)
 * <Progress type="linear" indeterminate shape="wavy" thickness="thick" aria-label="Loading" />
 * ```
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      type = "linear",
      indeterminate = false,
      size = "medium",
      shape = "flat",
      thickness = "default",
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
    const reducedMotion: boolean = useReducedMotion();

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

    // Reduced-motion degrades wavy → flat
    const effectiveShape: "flat" | "wavy" = reducedMotion ? "flat" : shape;

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
        {label && (
          <span {...labelProps} className={cn(progressLabelVariants())}>
            {label}
          </span>
        )}

        {type === "linear" ? (
          <LinearProgress
            percentage={percentage}
            indeterminate={indeterminate}
            shape={effectiveShape}
            thickness={thickness}
            reducedMotion={reducedMotion}
          />
        ) : (
          <CircularProgress
            percentage={percentage}
            indeterminate={indeterminate}
            size={size}
            shape={effectiveShape}
            thickness={thickness}
            reducedMotion={reducedMotion}
          />
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
  shape: "flat" | "wavy";
  thickness: "default" | "thick";
  reducedMotion: boolean;
}

function LinearProgress({
  percentage,
  indeterminate,
  shape,
  thickness,
  reducedMotion,
}: LinearProgressProps): React.JSX.Element {
  if (indeterminate) {
    return shape === "wavy" ? (
      <LinearWavyIndeterminate thickness={thickness} />
    ) : (
      <LinearFlatIndeterminate thickness={thickness} />
    );
  }

  return shape === "wavy" ? (
    <LinearWavyDeterminate
      percentage={percentage}
      thickness={thickness}
      reducedMotion={reducedMotion}
    />
  ) : (
    <LinearFlatDeterminate percentage={percentage} thickness={thickness} />
  );
}

// ── Flat Determinate ────────────────────────────────────────────────────────

function LinearFlatDeterminate({
  percentage,
  thickness,
}: {
  percentage: number;
  thickness: "default" | "thick";
}): React.JSX.Element {
  return (
    <div data-progress-track="" className={cn(progressTrackVariants({ thickness }))}>
      {/* Active indicator */}
      <div
        data-progress-indicator=""
        className={cn(progressActiveIndicatorVariants())}
        style={{ width: `${percentage}%` }}
      />
      {/* Inactive segment — starts after the 4dp gap */}
      {percentage < 100 && (
        <div
          data-progress-inactive-segment=""
          className={cn(progressInactiveSegmentVariants())}
          style={{ left: `calc(${percentage}% + ${INDICATOR_TRACK_GAP}px)` }}
        />
      )}
      {/* Stop indicator dot at trailing edge */}
      <div
        data-stop-indicator=""
        className={cn(progressStopIndicatorVariants())}
        aria-hidden="true"
      />
    </div>
  );
}

// ── Flat Indeterminate ──────────────────────────────────────────────────────

function LinearFlatIndeterminate({
  thickness,
}: {
  thickness: "default" | "thick";
}): React.JSX.Element {
  return (
    <div data-progress-track="" className={cn(progressTrackVariants({ thickness }))}>
      <div data-progress-indeterminate="" className="absolute inset-0 overflow-hidden rounded-full">
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

// ── Wavy Determinate ───────────────────────────────────────────────────────

function LinearWavyDeterminate({
  percentage,
  thickness,
  reducedMotion,
}: {
  percentage: number;
  thickness: "default" | "thick";
  reducedMotion: boolean;
}): React.JSX.Element {
  const amplitude = thickness === "thick" ? WAVE_AMPLITUDE_THICK : WAVE_AMPLITUDE_DEFAULT;
  const wavelength = WAVE_WAVELENGTH_LINEAR;

  // Amplitude ramp: 0 → full at 10%, then full → 0 at 90%
  const rampedAmplitude =
    reducedMotion || percentage <= 0 || percentage >= 100
      ? 0
      : amplitude *
        Math.min(
          (percentage - 10) / 10, // ramp up  0.1→0.2
          (90 - percentage) / 10, // ramp down 0.8→0.9
          1
        );

  // Container height accommodates the wave amplitude above/below midline
  const containerHeight = (thickness === "thick" ? 8 : 4) + 2 * amplitude + 4;
  const trackY = amplitude + 2; // midline Y within SVG viewBox

  const trackHeightClass = thickness === "thick" ? "h-2" : "h-1";

  return (
    <div
      data-progress-track=""
      className={cn("relative w-full overflow-visible", trackHeightClass)}
      style={{ height: `${containerHeight}px` }}
    >
      <svg
        className="absolute inset-0 w-full overflow-visible"
        style={{ height: containerHeight }}
        aria-hidden="true"
      >
        {/* Inactive track (full-width, primary-container) */}
        <line
          x1="0"
          y1={trackY}
          x2="100%"
          y2={trackY}
          stroke="currentColor"
          strokeWidth={getStrokeWidth(thickness)}
          strokeLinecap="round"
          className="text-primary-container"
        />
        {/* Active wavy indicator clipped to percentage */}
        {percentage > 0 && (
          <path
            data-progress-indicator=""
            d={buildLinearWavePath(
              // We use a large notional width; clipPath handles the cut
              1000,
              rampedAmplitude,
              wavelength
            )}
            fill="none"
            stroke="currentColor"
            strokeWidth={getStrokeWidth(thickness)}
            strokeLinecap="round"
            className="text-primary duration-spring-standard-default-spatial ease-spring-standard-default-spatial transition-[clip-path]"
            clipPath={`inset(0 ${100 - percentage}% 0 0)`}
          />
        )}
        {/* Stop indicator dot */}
        <circle
          data-stop-indicator=""
          cx="100%"
          cy={trackY}
          r={INDICATOR_TRACK_GAP / 2}
          fill="currentColor"
          className="text-primary"
          aria-hidden="true"
        />
      </svg>
    </div>
  );
}

// ── Wavy Indeterminate ──────────────────────────────────────────────────────

function LinearWavyIndeterminate({
  thickness,
}: {
  thickness: "default" | "thick";
}): React.JSX.Element {
  const amplitude = thickness === "thick" ? WAVE_AMPLITUDE_THICK : WAVE_AMPLITUDE_DEFAULT;
  const wavelength = WAVE_WAVELENGTH_LINEAR;
  const containerHeight = (thickness === "thick" ? 8 : 4) + 2 * amplitude + 4;
  const trackY = amplitude + 2;
  const trackHeightClass = thickness === "thick" ? "h-2" : "h-1";

  return (
    <div
      data-progress-track=""
      className={cn("relative w-full overflow-visible", trackHeightClass)}
      style={{ height: `${containerHeight}px` }}
    >
      <div
        data-progress-indeterminate=""
        className="absolute inset-0 overflow-hidden"
        style={{ height: containerHeight }}
      >
        <svg
          className="absolute h-full"
          style={{ width: "200%", top: 0, left: 0, height: containerHeight }}
          aria-hidden="true"
        >
          {/* Segment 1 — primary wavy */}
          <path
            d={buildLinearWavePath(2000, amplitude, wavelength)}
            fill="none"
            stroke="currentColor"
            strokeWidth={getStrokeWidth(thickness)}
            strokeLinecap="round"
            className={cn("text-primary", "animate-progress-linear-indeterminate-1")}
          />
          {/* Segment 2 — primary wavy, offset */}
          <path
            d={buildLinearWavePath(2000, amplitude, wavelength)}
            fill="none"
            stroke="currentColor"
            strokeWidth={getStrokeWidth(thickness)}
            strokeLinecap="round"
            className={cn("text-primary", "animate-progress-linear-indeterminate-2")}
          />
        </svg>
      </div>

      {/* Inactive track visible behind segments */}
      <svg
        className="pointer-events-none absolute inset-0 w-full overflow-visible"
        style={{ height: containerHeight }}
        aria-hidden="true"
      >
        <line
          x1="0"
          y1={trackY}
          x2="100%"
          y2={trackY}
          stroke="currentColor"
          strokeWidth={getStrokeWidth(thickness)}
          strokeLinecap="round"
          className="text-primary-container"
        />
      </svg>
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
  shape: "flat" | "wavy";
  thickness: "default" | "thick";
  reducedMotion: boolean;
}

function CircularProgress({
  percentage,
  indeterminate,
  size,
  shape,
  thickness,
  reducedMotion,
}: CircularProgressProps): React.JSX.Element {
  const { radius, circumference, viewBox, cx, cy, strokeWidth, diameter } = getCircularGeometry(
    size,
    thickness
  );

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
          {/* Inactive track — primary-container per Expressive (always visible) */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-primary-container"
          />
          {shape === "wavy" ? (
            <path
              d={buildCircularWavePath(
                cx,
                cy,
                radius,
                WAVE_AMPLITUDE_DEFAULT,
                WAVE_WAVELENGTH_CIRCULAR
              )}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="animate-progress-circular-dash text-primary"
              strokeLinecap="round"
            />
          ) : (
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="animate-progress-circular-dash text-primary"
              strokeLinecap="round"
            />
          )}
        </svg>
      </div>
    );
  }

  // Determinate: introduce 4dp arc gap
  // Arc gap in radians = gap / radius; subtract from both active and inactive ends
  const gapRadians = INDICATOR_TRACK_GAP / radius;
  const activeArc = (percentage / 100) * circumference;
  // Subtract half-gap from each end of the active arc for the visual gap
  const activeArcGapped = Math.max(0, activeArc - INDICATOR_TRACK_GAP);
  const inactiveArcGapped = Math.max(0, circumference - activeArc - INDICATOR_TRACK_GAP);

  const activeOffset = 0; // active starts at 12 o'clock (SVG starts at 3; -90deg rotate)
  const inactiveOffset = -(activeArcGapped + INDICATOR_TRACK_GAP); // inactive starts after gap

  // Suppress unused variable warning — gapRadians was computed for reference; use the direct pixel approach above
  void gapRadians;

  return (
    <div data-progress-size={size} className={cn(progressCircularSizeVariants({ size }))}>
      <svg viewBox={viewBox} className="h-full w-full -rotate-90" aria-hidden="true">
        {/* Inactive track — primary-container; rendered first (below active) */}
        {percentage < 100 && (
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${inactiveArcGapped} ${circumference - inactiveArcGapped}`}
            strokeDashoffset={inactiveOffset}
            className="text-primary-container duration-spring-standard-default-spatial ease-spring-standard-default-spatial transition-[stroke-dasharray,stroke-dashoffset]"
          />
        )}
        {/* Active indicator — primary; rendered on top */}
        {percentage > 0 && (
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${activeArcGapped} ${circumference - activeArcGapped}`}
            strokeDashoffset={activeOffset}
            className="text-primary duration-spring-standard-default-spatial ease-spring-standard-default-spatial transition-[stroke-dasharray,stroke-dashoffset]"
          />
        )}
        {/* Show full circle in primary-container when value is 0 */}
        {percentage === 0 && (
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-primary-container"
          />
        )}
        {/* Wavy overlay for determinate circular */}
        {shape === "wavy" && !reducedMotion && percentage > 0 && percentage < 100 && (
          <path
            d={buildCircularWavePath(
              cx,
              cy,
              radius,
              WAVE_AMPLITUDE_DEFAULT,
              WAVE_WAVELENGTH_CIRCULAR
            )}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${activeArcGapped} ${circumference - activeArcGapped}`}
            strokeDashoffset={activeOffset}
            className="text-primary duration-spring-standard-default-spatial ease-spring-standard-default-spatial transition-[stroke-dasharray]"
          />
        )}
      </svg>

      {/* Circular size thumbnail for diameter reference — keep for geometry stability */}
      <span className="sr-only" data-progress-diameter={diameter} />
    </div>
  );
}

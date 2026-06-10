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
const WAVE_AMPLITUDE_DEFAULT = 3; // px amplitude (half-height of wave)
const WAVE_AMPLITUDE_THICK = 5; // px amplitude for thick track

/**
 * Number of complete wave cycles drawn across the full bar width.
 * Uses a fixed count (not a fixed wavelength) so the wave never extends
 * beyond the viewBox — the wave density adapts to the rendered bar width.
 * 14 cycles ≈ 40px wavelength at a typical 600px bar.
 */
const LINEAR_WAVE_COUNT = 14;

/**
 * SVG viewBox width for linear wavy renderers.
 * x=0..VB_W maps 1-to-1 with 0..100% of the rendered bar width.
 * Using 100 makes clipPath percentage calculations exact.
 */
const VB_W = 100;

/**
 * Target arc-length per wave cycle for circular wavy (px).
 * Used to derive an integer waveCount per circle size.
 */
const WAVE_WAVELENGTH_CIRCULAR = 30;

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
// Wave path builders (fixed)
// ---------------------------------------------------------------------------

/**
 * Build an SVG `d` string for a horizontal sine wave in a VB_W×H viewBox.
 *
 * Key design:
 * - `vbWidth` = viewBox width (100 user units = 100% of rendered width).
 * - Path covers 0..vbWidth so it never exceeds the container.
 * - `vectorEffect="non-scaling-stroke"` on the rendered path keeps the
 *   stroke at screen-pixel size even though x-scale ≠ y-scale.
 * - `midY` is in px (works because viewBox height = rendered height, y-scale=1).
 * - `padCycles` extends the path rightward for seamless-loop animations.
 *
 * @param vbWidth    SVG viewBox width (= VB_W = 100)
 * @param waveCount  Number of complete sine cycles across vbWidth
 * @param amplitude  Half-height of the wave in px
 * @param midY       y-coordinate of the midline in user-units (≈ px since y-scale=1)
 * @param padCycles  Extra cycles appended to the right (for loop animations)
 */
function buildLinearWavePath(
  vbWidth: number,
  waveCount: number,
  amplitude: number,
  midY: number,
  padCycles = 0
): string {
  const wavelength = vbWidth / waveCount; // user units per cycle
  const totalCycles = waveCount + padCycles;
  // Bezier control point distance: wavelength/4 gives a good sine approximation
  const cp = wavelength / 4;
  const segments: string[] = [`M 0 ${midY}`];

  for (let i = 0; i < totalCycles; i++) {
    const x = i * wavelength;
    // Crest (above midline)
    segments.push(
      `C ${x + cp} ${midY - amplitude} ${x + wavelength / 2 - cp} ${midY - amplitude} ${x + wavelength / 2} ${midY}`
    );
    // Trough (below midline)
    segments.push(
      `C ${x + wavelength / 2 + cp} ${midY + amplitude} ${x + wavelength - cp} ${midY + amplitude} ${x + wavelength} ${midY}`
    );
  }

  return segments.join(" ");
}

/**
 * Build an SVG `d` string for a wavy ring (circle with radial sine perturbation).
 *
 * Key design: `waveCount` MUST be an integer so `sin(2π·waveCount·1) = sin(2π·waveCount·0)`,
 * guaranteeing the ring closes seamlessly. Compute it with
 * `Math.max(4, Math.round(circumference / WAVE_WAVELENGTH_CIRCULAR))`.
 *
 * The path starts at the 3 o'clock position (angle = 0) so it aligns with
 * SVG `<circle>` dash behavior when the parent SVG is rotated -90deg.
 *
 * @param cx        Circle centre x (px)
 * @param cy        Circle centre y (px)
 * @param radius    Arc radius (px)
 * @param amplitude Radial perturbation amplitude (px)
 * @param waveCount Integer number of wave cycles — must be integer for seamless close
 * @param steps     Polygon approximation steps (default: waveCount × 12)
 */
function buildCircularWavePath(
  cx: number,
  cy: number,
  radius: number,
  amplitude: number,
  waveCount: number,
  steps?: number
): string {
  const actualSteps = steps ?? waveCount * 12;
  const points: string[] = [];

  for (let i = 0; i <= actualSteps; i++) {
    const t = i / actualSteps;
    // Start at 3 o'clock (angle=0) to align with <circle> strokeDashoffset behaviour
    const angle = t * 2 * Math.PI;
    // Integer waveCount guarantees sin(2π·waveCount·1) = 0 = sin(2π·waveCount·0) → no seam
    const radialOffset = amplitude * Math.sin(2 * Math.PI * waveCount * t);
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

    const { progressBarProps, labelProps } = useProgressBar({
      label,
      value,
      minValue,
      maxValue,
      isIndeterminate: indeterminate,
      ...restProps,
    });

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

/**
 * Linear wavy determinate — fixed approach.
 *
 * The wave is drawn in a `viewBox="0 0 VB_W H"` SVG with
 * `preserveAspectRatio="none"` so x maps 0..VB_W → 0..renderedWidth
 * and the wave can never overflow the container.
 *
 * The active portion is clipped by a CSS `clip-path: inset(0 X% 0 0)` on
 * the SVG element itself (applied in the rendered-element coordinate space),
 * which means `(100 - percentage)%` from the right keeps exactly `percentage`
 * of the wave visible — the percentage bug is fixed.
 *
 * `vectorEffect="non-scaling-stroke"` keeps the stroke at screen-pixel width
 * even though the x-scale (renderedWidth / VB_W) is much larger than 1.
 *
 * The inactive segment and stop dot are crisp DOM elements (px-exact).
 */
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
  const containerHeight = (thickness === "thick" ? 8 : 4) + 2 * amplitude + 4;
  // midY: 2px top padding + amplitude = midline position in px (= VB y-units, since y-scale=1)
  const midY = amplitude + 2;
  const trackHeightClass = thickness === "thick" ? "h-2" : "h-1";
  // trackPx: the flat-track thickness (= stroke-width). The inactive segment and stop dot
  // should match this so they look identical to the flat variant.
  const trackPx = getStrokeWidth(thickness);

  // Amplitude ramp: 0 at 0% and 100%, full amplitude between 20% and 80%
  const rampedAmplitude =
    reducedMotion || percentage <= 0 || percentage >= 100
      ? 0
      : amplitude *
        Math.min(
          (percentage - 10) / 10, // ramp up  10%→20%
          (90 - percentage) / 10, // ramp down 80%→90%
          1
        );

  const wavePath = buildLinearWavePath(VB_W, LINEAR_WAVE_COUNT, rampedAmplitude, midY);

  return (
    <div
      data-progress-track=""
      className={cn("relative w-full overflow-hidden", trackHeightClass)}
      style={{ height: containerHeight }}
    >
      {/*
       * Active wavy SVG.
       * - viewBox 0..VB_W × 0..H ensures the path fits within the SVG bounds.
       * - preserveAspectRatio="none" stretches the path to fill the rendered width.
       * - CSS clip-path inset clips the right (100-percentage)% in rendered space,
       *   so exactly `percentage`% of the wave is visible regardless of rendered width.
       * - The clip-path CSS transition provides the smooth progress animation.
       */}
      <svg
        viewBox={`0 0 ${VB_W} ${containerHeight}`}
        preserveAspectRatio="none"
        className={cn(
          "absolute inset-0 w-full",
          "transition-[clip-path]",
          "duration-spring-standard-default-spatial",
          "ease-spring-standard-default-spatial"
        )}
        style={{
          height: containerHeight,
          // clip-path applied in rendered-element space: keeps left `percentage`%
          clipPath: `inset(0 ${100 - percentage}% 0 0)`,
        }}
        aria-hidden="true"
      >
        <path
          data-progress-indicator=""
          d={wavePath}
          fill="none"
          stroke="currentColor"
          strokeWidth={getStrokeWidth(thickness)}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="text-primary"
        />
      </svg>

      {/* Inactive segment after 4dp gap — centered on midY, trackPx tall (matches flat variant) */}
      {percentage < 100 && (
        <div
          data-progress-inactive-segment=""
          className={cn(progressInactiveSegmentVariants())}
          style={{
            left: `calc(${percentage}% + ${INDICATOR_TRACK_GAP}px)`,
            height: trackPx,
            top: midY - trackPx / 2,
          }}
        />
      )}

      {/* Stop indicator dot — centered on the wave's midY baseline */}
      <div
        data-stop-indicator=""
        className={cn(progressStopIndicatorVariants())}
        style={{ top: midY }}
        aria-hidden="true"
      />
    </div>
  );
}

// ── Wavy Indeterminate ──────────────────────────────────────────────────────

/**
 * Linear wavy indeterminate — fixed approach.
 *
 * Two SVG elements (mirroring the two divs in the flat variant) are
 * animated with the existing `progress-linear-indeterminate-1/2` CSS keyframes
 * which animate the `left`/`right` CSS properties of the element.
 * The keyframes are designed for positioned elements — SVG elements inside an
 * HTML container also respect CSS `left`/`right` when `position: absolute`.
 *
 * As the CSS box grows/shrinks the SVG viewport stretches/compresses the wave
 * horizontally (via `preserveAspectRatio="none"`), giving a convincing sweep.
 * The outer `overflow-hidden` container clips both SVGs to the bar bounds.
 */
function LinearWavyIndeterminate({
  thickness,
}: {
  thickness: "default" | "thick";
}): React.JSX.Element {
  const amplitude = thickness === "thick" ? WAVE_AMPLITUDE_THICK : WAVE_AMPLITUDE_DEFAULT;
  const containerHeight = (thickness === "thick" ? 8 : 4) + 2 * amplitude + 4;
  const midY = amplitude + 2;
  const trackHeightClass = thickness === "thick" ? "h-2" : "h-1";
  // trackPx: flat-track thickness so the inactive rail matches the flat variant's height
  const trackPx = getStrokeWidth(thickness);

  const wavePath = buildLinearWavePath(VB_W, LINEAR_WAVE_COUNT, amplitude, midY);

  return (
    <div
      data-progress-track=""
      className={cn("relative w-full overflow-hidden", trackHeightClass)}
      style={{ height: containerHeight }}
    >
      {/* Full-width inactive track — trackPx tall, centered on midY (matches flat variant) */}
      <div
        className="bg-primary-container absolute right-0 left-0 rounded-full"
        style={{ height: trackPx, top: midY - trackPx / 2 }}
      />

      {/* Animated segments — same approach as flat but with SVG wave paths */}
      <div data-progress-indeterminate="" className="absolute inset-0">
        {/* Segment 1 */}
        <svg
          viewBox={`0 0 ${VB_W} ${containerHeight}`}
          preserveAspectRatio="none"
          className="animate-progress-linear-indeterminate-1 absolute top-0 h-full"
          aria-hidden="true"
        >
          <path
            d={wavePath}
            fill="none"
            stroke="currentColor"
            strokeWidth={getStrokeWidth(thickness)}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="text-primary"
          />
        </svg>

        {/* Segment 2 */}
        <svg
          viewBox={`0 0 ${VB_W} ${containerHeight}`}
          preserveAspectRatio="none"
          className="animate-progress-linear-indeterminate-2 absolute top-0 h-full"
          aria-hidden="true"
        >
          <path
            d={wavePath}
            fill="none"
            stroke="currentColor"
            strokeWidth={getStrokeWidth(thickness)}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="text-primary"
          />
        </svg>
      </div>
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
    if (shape === "wavy") {
      return (
        <CircularWavyIndeterminate
          size={size}
          cx={cx}
          cy={cy}
          radius={radius}
          circumference={circumference}
          viewBox={viewBox}
          strokeWidth={strokeWidth}
          diameter={diameter}
        />
      );
    }

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
          {/* Inactive track — primary-container (always visible per Expressive spec) */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-primary-container"
          />
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
        </svg>
      </div>
    );
  }

  // Determinate
  if (shape === "wavy") {
    return (
      <CircularWavyDeterminate
        size={size}
        percentage={percentage}
        cx={cx}
        cy={cy}
        radius={radius}
        circumference={circumference}
        viewBox={viewBox}
        strokeWidth={strokeWidth}
        diameter={diameter}
        reducedMotion={reducedMotion}
      />
    );
  }

  // Flat determinate — introduce 4dp arc gap via stroke-dasharray
  const activeArc = (percentage / 100) * circumference;
  const activeArcGapped = Math.max(0, activeArc - INDICATOR_TRACK_GAP);
  const inactiveArcGapped = Math.max(0, circumference - activeArc - INDICATOR_TRACK_GAP);
  const activeOffset = 0;
  const inactiveOffset = -(activeArcGapped + INDICATOR_TRACK_GAP);

  return (
    <div data-progress-size={size} className={cn(progressCircularSizeVariants({ size }))}>
      <svg viewBox={viewBox} className="h-full w-full -rotate-90" aria-hidden="true">
        {/* Inactive track */}
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
        {/* Active indicator */}
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
        {/* Full inactive circle at 0% */}
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
      </svg>

      <span className="sr-only" data-progress-diameter={diameter} />
    </div>
  );
}

// ── Circular wavy geometry helpers ──────────────────────────────────────────

interface CircularWavyGeometry {
  size: "small" | "medium" | "large";
  cx: number;
  cy: number;
  radius: number;
  circumference: number;
  viewBox: string;
  strokeWidth: number;
  diameter: number;
}

// ── Circular Wavy Indeterminate ─────────────────────────────────────────────

/**
 * Circular wavy indeterminate — fixed approach.
 *
 * Uses an integer `waveCount` derived from `Math.round(circumference / WAVE_WAVELENGTH_CIRCULAR)`
 * so the ring closes seamlessly (no seam/notch from non-integer cycles).
 *
 * The wavy `<path>` uses `pathLength={100}` so `strokeDasharray` is expressed
 * in 0..100 regardless of the path's intrinsic (longer) length.
 * A static dash `"28 72"` (≈28% visible arc) + the whole-SVG rotation from
 * `animate-progress-circular-rotate` produces a clean rotating wavy spinner.
 * `animate-progress-circular-dash` is intentionally NOT used: its pixel values
 * are tuned to the plain circle circumference, not the longer wavy path.
 */
function CircularWavyIndeterminate({
  size,
  cx,
  cy,
  radius,
  circumference: _circumference,
  viewBox,
  strokeWidth,
}: CircularWavyGeometry): React.JSX.Element {
  // Clamp amplitude so crests never exceed `radius` (= diameter/2 - strokeWidth/2).
  // meanRadius is the wave's centreline; crests reach meanRadius + circAmp = radius exactly.
  const circAmp = Math.min(WAVE_AMPLITUDE_DEFAULT, radius * 0.35);
  const meanRadius = radius - circAmp;
  const meanCircumference = 2 * Math.PI * meanRadius;

  // Integer waveCount → seamless close (sin(2π·N·1) = sin(2π·N·0) = 0)
  const waveCount = Math.max(4, Math.round(meanCircumference / WAVE_WAVELENGTH_CIRCULAR));
  const wavePath = buildCircularWavePath(cx, cy, meanRadius, circAmp, waveCount);

  return (
    <div
      data-progress-size={size}
      data-progress-indeterminate=""
      className={cn(progressCircularSizeVariants({ size }))}
    >
      {/*
       * The entire SVG rotates via animate-progress-circular-rotate.
       * The wavy path has a static dash showing ~28% of the ring,
       * so the arc sweeps around as a rotating wavy segment.
       * Inactive ring drawn at meanRadius so it is concentric with the wave centerline —
       * no plain circle poking through behind the active wavy arc.
       */}
      <svg
        viewBox={viewBox}
        className="animate-progress-circular-rotate h-full w-full"
        aria-hidden="true"
      >
        {/* Inactive full ring (primary-container) at meanRadius */}
        <circle
          cx={cx}
          cy={cy}
          r={meanRadius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-primary-container"
        />
        {/* Active wavy arc — pathLength=100 normalises the dash to a percentage */}
        <path
          d={wavePath}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="28 72"
          className="text-primary"
        />
      </svg>
    </div>
  );
}

// ── Circular Wavy Determinate ───────────────────────────────────────────────

/**
 * Circular wavy determinate — fixed approach.
 *
 * Uses `pathLength={100}` on the wavy `<path>` so `strokeDasharray` can be
 * expressed in percentage terms (0..100) rather than the path's intrinsic
 * (and longer) arc length. This resolves the mis-match between the wave path
 * length and the pixel-based dash values used previously.
 *
 * Gap: `gapPct = (INDICATOR_TRACK_GAP / circumference) * 100` (in pathLength units).
 * Active arc:   `activeLen   = max(0, percentage - gapPct)`
 * Inactive arc: `inactiveLen = max(0, 100 - percentage - gapPct)`
 * Inactive offset = `-(activeLen + gapPct)` → starts after active + gap.
 *
 * Single active wavy path replaces the previous plain-active + wavy-overlay
 * stacking that produced a distorted double-drawn arc.
 */
function CircularWavyDeterminate({
  size,
  percentage,
  cx,
  cy,
  radius,
  circumference: _circumference,
  viewBox,
  strokeWidth,
  diameter,
  reducedMotion,
}: CircularWavyGeometry & { percentage: number; reducedMotion: boolean }): React.JSX.Element {
  // Clamp amplitude so crests never exceed `radius` → no viewBox clipping.
  // meanRadius is the wave centreline; crest = meanRadius + circAmp = radius exactly.
  const circAmp = reducedMotion ? 0 : Math.min(WAVE_AMPLITUDE_DEFAULT, radius * 0.35);
  const meanRadius = radius - circAmp;
  const meanCircumference = 2 * Math.PI * meanRadius;

  const waveCount = Math.max(4, Math.round(meanCircumference / WAVE_WAVELENGTH_CIRCULAR));
  const wavePath = buildCircularWavePath(cx, cy, meanRadius, circAmp, waveCount);

  // Gap expressed in pathLength=100 space (computed from meanRadius circumference for accuracy)
  const gapPct = (INDICATOR_TRACK_GAP / meanCircumference) * 100;
  const activeLen = Math.max(0, percentage - gapPct);
  const inactiveLen = Math.max(0, 100 - percentage - gapPct);
  // Inactive arc starts after active + gap
  const inactiveOffset = -(activeLen + gapPct);

  return (
    <div data-progress-size={size} className={cn(progressCircularSizeVariants({ size }))}>
      {/*
       * -rotate-90 on the SVG makes both the circle and the wavy path start
       * at the visual 12 o'clock position (path starts at 3 o'clock
       * mathematically, rotated -90° to top visually).
       * All arcs/rings drawn at meanRadius so they are concentric with the wave centerline —
       * no plain circle showing through behind the active wavy arc.
       */}
      <svg viewBox={viewBox} className="h-full w-full -rotate-90" aria-hidden="true">
        {/* Full inactive track at 0% — at meanRadius */}
        {percentage === 0 && (
          <circle
            cx={cx}
            cy={cy}
            r={meanRadius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-primary-container"
          />
        )}

        {/* Inactive arc (primary-container) — for 0 < percentage < 100, at meanRadius */}
        {percentage > 0 && percentage < 100 && (
          <circle
            cx={cx}
            cy={cy}
            r={meanRadius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${inactiveLen} ${100 - inactiveLen}`}
            strokeDashoffset={inactiveOffset}
            className="text-primary-container duration-spring-standard-default-spatial ease-spring-standard-default-spatial transition-[stroke-dasharray,stroke-dashoffset]"
          />
        )}

        {/* Active wavy arc (primary) — single element, wave built at meanRadius */}
        {percentage > 0 && (
          <path
            data-progress-indicator=""
            d={wavePath}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={percentage < 100 ? `${activeLen} ${100 - activeLen}` : undefined}
            strokeDashoffset={0}
            className="text-primary duration-spring-standard-default-spatial ease-spring-standard-default-spatial transition-[stroke-dasharray]"
          />
        )}
      </svg>

      <span className="sr-only" data-progress-diameter={diameter} />
    </div>
  );
}

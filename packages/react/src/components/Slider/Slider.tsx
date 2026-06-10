"use client";

import type React from "react";
import { forwardRef, useCallback, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { cn } from "../../utils/cn";
import { SliderHeadless } from "./SliderHeadless";
import { SliderStops } from "./SliderStops";
import { SliderValueIndicator } from "./SliderValueIndicator";
import {
  sliderContainerVariants,
  sliderTrackRegionVariants,
  sliderActiveTrackVariants,
  sliderInactiveTrackVariants,
  sliderHandleVariants,
  sliderHandleStateLayerVariants,
  sliderTrackLayoutVariants,
  sliderTrackStopVariants,
  sliderInsetIconVariants,
} from "./Slider.variants";
import type { SliderProps, SliderThumbRenderState } from "./Slider.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clampPercent(value: number, min: number, max: number): number {
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

function resolveDefaultValue(
  variant: "standard" | "centered" | "range",
  minValue: number
): number[] {
  if (variant === "range") return [25, 75];
  if (variant === "centered") return [0];
  return [minValue];
}

/**
 * MD3 thumb-track gap: 6dp total, split symmetrically as 3px per side.
 * Applied as an offset from the thumb's percentage position.
 */
const GAP_PX = 3;

/**
 * Build inline CSS position styles for an absolutely-positioned track segment.
 *
 * All segments share the same `position: absolute` coordinate space as the
 * React Aria thumbs (`left: pct%` / `bottom: pct%`), so fills always align
 * with handle positions regardless of value, variant, or orientation.
 *
 * Horizontal segments span along the X axis; vertical along Y (bottom = 0).
 */
function segmentStyle(
  orientation: "horizontal" | "vertical",
  opts: {
    /** Start edge as a percentage of the track length. `null` = track start (0). */
    start: number | null;
    /** End edge as a percentage of the track length. `null` = track end (100). */
    end: number | null;
    /** Px offset added to the start edge (gap inset from a thumb). */
    startGap?: number;
    /** Px offset subtracted from the end edge (gap inset from a thumb). */
    endGap?: number;
  }
): React.CSSProperties {
  const { start, end, startGap = 0, endGap = 0 } = opts;

  const startVal = start !== null ? `calc(${start}% + ${startGap}px)` : `${startGap}px`;
  const endVal = end !== null ? `calc(${100 - end}% + ${endGap}px)` : `${endGap}px`;

  if (orientation === "horizontal") {
    return { left: startVal, right: endVal };
  }
  // Vertical: start = bottom edge, end = top edge (fills upward from 0)
  return { bottom: startVal, top: endVal };
}

// ─── Slider ───────────────────────────────────────────────────────────────────

/**
 * Material Design 3 Slider Component (Layer 3: Styled)
 *
 * Wraps `SliderHeadless` with CVA styling for all five MD3 Expressive sizes.
 * Renders the visual track layout (active/inactive tracks) as children inside
 * the headless track element. The visual handle, state layer, and value indicator
 * are rendered as children of the React Aria thumb element via `renderThumbContent`,
 * which positions them exactly at the value percentage.
 *
 * **Architecture (Variants-vs-States)**
 * - Interaction states (hover, pressed/dragging, disabled, focus) are driven by
 *   React Aria hooks → `getInteractionDataAttributes` → `data-*` on the RA thumb
 *   (`group/slider-thumb`) → `group-data-[x]/slider-thumb:*` CSS selectors.
 * - No manual pointer state machine — React Aria's `isDragging`, `isHovered`,
 *   and `isFocusVisible` are the single source of truth.
 * - Disabled track/stop colors use `group-data-[disabled]/slider:*` selectors
 *   from the root `group/slider` scope.
 *
 * **Geometry (documented inline-style exception)**
 * Track widths are driven by runtime values and use inline `flexBasis` styles —
 * a documented exception for geometry that cannot be expressed as design tokens.
 *
 * **Motion**
 * - Track fill: spring-standard-fast-spatial (suppressed during drag + reduced motion)
 * - Handle width: spring-standard-fast-spatial (suppressed for reduced motion)
 * - State layer opacity: spring-standard-fast-effects (always present; CSS media
 *   query handles `prefers-reduced-motion` for CSS-driven changes)
 * - Value indicator: spring-standard-fast-spatial (suppressed for reduced motion)
 *
 * @example
 * ```tsx
 * // Standard slider
 * <Slider label="Volume" defaultValue={[50]} />
 *
 * // Large range slider
 * <Slider variant="range" size="large" label="Price" defaultValue={[20, 80]} />
 *
 * // Centered slider with negative range
 * <Slider variant="centered" label="Balance" minValue={-100} maxValue={100} />
 * ```
 */
export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      size = "xsmall",
      variant = "standard",
      orientation = "horizontal",
      minValue = 0,
      maxValue = 100,
      step,
      value,
      defaultValue,
      onChange,
      onChangeEnd,
      isDisabled = false,
      showStops = false,
      showValueIndicator = false,
      formatValue,
      icon,
      className,
      ...headlessProps
    },
    ref
  ) => {
    const reducedMotion = useReducedMotion();

    const resolvedDefault = defaultValue ?? resolveDefaultValue(variant, minValue);

    const [uncontrolledValue, setUncontrolledValue] = useState<number[]>(resolvedDefault);

    const currentValues = value ?? uncontrolledValue;

    const handleChange = useCallback(
      (newValue: number[]) => {
        if (value === undefined) {
          setUncontrolledValue(newValue);
        }
        onChange?.(newValue);
      },
      [value, onChange]
    );

    // Track whether any thumb is actively dragging so we can suppress the
    // flex-basis spring transition during pointer drag (immediate feedback).
    // Driven by onThumbDraggingChange callback from SliderHeadless.
    const [anyThumbDragging, setAnyThumbDragging] = useState(false);

    const handleThumbDraggingChange = useCallback((_index: number, isDragging: boolean) => {
      setAnyThumbDragging(isDragging);
    }, []);

    // ── Motion classes ─────────────────────────────────────────────────────────

    // MD3 spring system: Track segment position/size — spring-standard-fast-spatial.
    // Suppressed during drag (follows pointer immediately) and reduced motion.
    // Horizontal segments animate left+width; vertical animate top+bottom+height.
    const springTokens = "duration-spring-standard-fast-spatial ease-spring-standard-fast-spatial";
    const trackTransition =
      reducedMotion || anyThumbDragging
        ? ""
        : orientation === "vertical"
          ? `transition-[top,bottom,height] ${springTokens}`
          : `transition-[left,width,right] ${springTokens}`;

    // MD3 spring system: Handle width change (4dp → 2dp on press) — spatial spring.
    // Suppressed for reduced motion; applied by the renderThumbContent closure.
    const handleMotion = reducedMotion
      ? ""
      : "transition-[width] duration-spring-standard-fast-spatial ease-spring-standard-fast-spatial";

    const isRange = variant === "range";
    const isCentered = variant === "centered";

    // Only Standard variant supports the inset icon, and only for Medium/Large/XLarge sizes
    // (MD3 spec §5.1: icon not available for XSmall and Small)
    const showIcon =
      icon !== undefined &&
      variant === "standard" &&
      (size === "medium" || size === "large" || size === "xlarge");

    // ── Thumb content render prop ──────────────────────────────────────────────
    // Renders the visual handle, state layer, and value indicator INSIDE the
    // React Aria thumb element (absolutely positioned at the value percentage).
    // All interaction styling is driven by group-data-[x]/slider-thumb selectors.
    const renderThumbContent = useCallback(
      ({ value: thumbValue }: SliderThumbRenderState): React.ReactNode => (
        <>
          {/* Transparent hit-area enlarged beyond the 4dp visual handle so
              dragging is comfortable. aria-hidden so it is invisible to AT. */}
          <div
            aria-hidden="true"
            className={cn(
              "absolute",
              "left-1/2",
              "top-1/2",
              "-translate-x-1/2",
              "-translate-y-1/2",
              orientation === "vertical" ? "h-[20px] w-full" : "h-full w-[20px]"
            )}
          />
          {/* Visual handle — narrows from 4dp to 2dp on press via group-data */}
          <div
            data-slot="handle"
            className={cn(sliderHandleVariants({ size, orientation }), handleMotion)}
          />
          {/* State layer — opacity driven by group-data hover/focus/pressed */}
          <div data-slot="state-layer" className={cn(sliderHandleStateLayerVariants())} />
          {/* Value indicator — always in DOM; CSS shows/hides via group-data-[pressed] */}
          {showValueIndicator && (
            <SliderValueIndicator
              value={thumbValue}
              {...(formatValue !== undefined ? { formatValue } : {})}
            />
          )}
        </>
      ),
      [size, orientation, showValueIndicator, formatValue, handleMotion]
    );

    // ── Standard track render ──────────────────────────────────────────────────
    const renderStandardTrack = (): React.JSX.Element => {
      const pct = clampPercent(currentValues[0] ?? minValue, minValue, maxValue);

      return (
        <>
          {/* Active track — spans from track start to 3px before the handle */}
          <div
            data-slot="active-track"
            className={cn(sliderActiveTrackVariants({ size, orientation }), trackTransition)}
            style={segmentStyle(orientation, { start: null, end: pct, endGap: GAP_PX })}
          >
            {showIcon && (
              <span
                data-slot="inset-icon"
                className={cn(sliderInsetIconVariants({ size, orientation }))}
              >
                {icon}
              </span>
            )}
          </div>
          {/* Inactive track — spans from 3px after the handle to track end */}
          <div
            data-slot="inactive-track"
            className={cn(sliderInactiveTrackVariants({ size, orientation }), trackTransition)}
            style={segmentStyle(orientation, { start: pct, startGap: GAP_PX, end: null })}
          >
            {showStops && (
              <span
                data-slot="track-stop-end"
                className={cn(sliderTrackStopVariants({ position: "end" }))}
              />
            )}
          </div>
        </>
      );
    };

    // ── Range track render ─────────────────────────────────────────────────────
    const renderRangeTrack = (): React.JSX.Element => {
      const leftPct = clampPercent(currentValues[0] ?? minValue, minValue, maxValue);
      const rightPct = clampPercent(currentValues[1] ?? maxValue, minValue, maxValue);

      return (
        <>
          {/* Left inactive track — track start to 3px before left handle */}
          <div
            data-slot="inactive-track-left"
            className={cn(sliderInactiveTrackVariants({ size, orientation }), trackTransition)}
            style={segmentStyle(orientation, { start: null, end: leftPct, endGap: GAP_PX })}
          >
            {showStops && (
              <span
                data-slot="track-stop-start"
                className={cn(sliderTrackStopVariants({ position: "start" }))}
              />
            )}
          </div>
          {/* Active track — 3px after left handle to 3px before right handle */}
          <div
            data-slot="active-track"
            className={cn(
              sliderActiveTrackVariants({ size, orientation }),
              "rounded-[2px]", // Both ends near handles: 2dp inner (MD3 §10.2)
              trackTransition
            )}
            style={segmentStyle(orientation, {
              start: leftPct,
              startGap: GAP_PX,
              end: rightPct,
              endGap: GAP_PX,
            })}
          />
          {/* Right inactive track — 3px after right handle to track end */}
          <div
            data-slot="inactive-track-right"
            className={cn(sliderInactiveTrackVariants({ size, orientation }), trackTransition)}
            style={segmentStyle(orientation, { start: rightPct, startGap: GAP_PX, end: null })}
          >
            {showStops && (
              <span
                data-slot="track-stop-end"
                className={cn(sliderTrackStopVariants({ position: "end" }))}
              />
            )}
          </div>
        </>
      );
    };

    // ── Centered track render ──────────────────────────────────────────────────
    const renderCenteredTrack = (): React.JSX.Element => {
      const thumbPct = clampPercent(currentValues[0] ?? minValue, minValue, maxValue);
      const zeroPct =
        minValue >= 0 ? 0 : maxValue <= 0 ? 100 : ((0 - minValue) / (maxValue - minValue)) * 100;

      if (thumbPct >= zeroPct) {
        // Positive direction: inactive-left | active | inactive-right
        return (
          <>
            {/* Left inactive — track start to zero point (no gap at center) */}
            <div
              data-slot="inactive-track-left"
              className={cn(sliderInactiveTrackVariants({ size, orientation }), trackTransition)}
              style={segmentStyle(orientation, { start: null, end: zeroPct })}
            />
            {/* Active — zero point to 3px before handle */}
            <div
              data-slot="active-track"
              className={cn(sliderActiveTrackVariants({ size, orientation }), trackTransition)}
              style={segmentStyle(orientation, {
                start: zeroPct,
                end: thumbPct,
                endGap: GAP_PX,
              })}
            />
            {/* Right inactive — 3px after handle to track end */}
            <div
              data-slot="inactive-track-right"
              className={cn(sliderInactiveTrackVariants({ size, orientation }), trackTransition)}
              style={segmentStyle(orientation, { start: thumbPct, startGap: GAP_PX, end: null })}
            />
          </>
        );
      } else {
        // Negative direction: inactive-left | active | inactive-right
        return (
          <>
            {/* Left inactive — track start to 3px before handle */}
            <div
              data-slot="inactive-track-left"
              className={cn(sliderInactiveTrackVariants({ size, orientation }), trackTransition)}
              style={segmentStyle(orientation, { start: null, end: thumbPct, endGap: GAP_PX })}
            />
            {/* Active — 3px after handle to zero point (no gap at center) */}
            <div
              data-slot="active-track"
              className={cn(sliderActiveTrackVariants({ size, orientation }), trackTransition)}
              style={segmentStyle(orientation, {
                start: thumbPct,
                startGap: GAP_PX,
                end: zeroPct,
              })}
            />
            {/* Right inactive — zero point to track end */}
            <div
              data-slot="inactive-track-right"
              className={cn(sliderInactiveTrackVariants({ size, orientation }), trackTransition)}
              style={segmentStyle(orientation, { start: zeroPct, end: null })}
            />
          </>
        );
      }
    };

    const canShowStops = showStops && step !== undefined && step > 0;

    return (
      <SliderHeadless
        {...headlessProps}
        ref={ref}
        variant={variant}
        orientation={orientation}
        minValue={minValue}
        maxValue={maxValue}
        {...(step !== undefined ? { step } : {})}
        isDisabled={isDisabled}
        onChange={handleChange}
        {...(formatValue !== undefined ? { formatValue } : {})}
        {...(value !== undefined ? { value } : {})}
        {...(defaultValue !== undefined ? { defaultValue } : {})}
        {...(onChangeEnd !== undefined ? { onChangeEnd } : {})}
        renderThumbContent={renderThumbContent}
        onThumbDraggingChange={handleThumbDraggingChange}
        className={cn(sliderContainerVariants({ size, orientation }), className)}
        trackClassName={sliderTrackRegionVariants({ size, orientation })}
      >
        <div data-slot="track-layout" className={cn(sliderTrackLayoutVariants())}>
          {isRange
            ? renderRangeTrack()
            : isCentered
              ? renderCenteredTrack()
              : renderStandardTrack()}
          {canShowStops && (
            <SliderStops
              minValue={minValue}
              maxValue={maxValue}
              step={step}
              values={currentValues}
              variant={variant}
              size={size}
            />
          )}
        </div>
      </SliderHeadless>
    );
  }
);

Slider.displayName = "Slider";

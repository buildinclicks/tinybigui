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

    // MD3 spring system: Track fill — spring-standard-fast-spatial.
    // Suppressed during drag (follows pointer immediately) and reduced motion.
    const trackTransition =
      reducedMotion || anyThumbDragging
        ? ""
        : "transition-[flex-basis] duration-spring-standard-fast-spatial ease-spring-standard-fast-spatial";

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
          {/* Active track — width/height driven by current value percentage */}
          <div
            data-slot="active-track"
            className={cn(sliderActiveTrackVariants({ size, orientation }), trackTransition)}
            style={{ flexBasis: `${pct}%` }}
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
          {/* Inactive track — fills remaining flex space */}
          <div
            data-slot="inactive-track"
            className={cn(sliderInactiveTrackVariants({ size, orientation }), trackTransition)}
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
          {/* Left inactive track */}
          <div
            data-slot="inactive-track-left"
            className={cn(
              sliderInactiveTrackVariants({ size, orientation }),
              "flex-shrink-0",
              trackTransition
            )}
            style={{ flexBasis: `${leftPct}%` }}
          >
            {showStops && (
              <span
                data-slot="track-stop-start"
                className={cn(sliderTrackStopVariants({ position: "start" }))}
              />
            )}
          </div>
          {/* Active track — area between the two handles */}
          <div
            data-slot="active-track"
            className={cn(
              sliderActiveTrackVariants({ size, orientation }),
              "rounded-[2px]", // Both ends near handles: 2dp (MD3 §10.2)
              trackTransition
            )}
            style={{ flexBasis: `${rightPct - leftPct}%` }}
          />
          {/* Right inactive track */}
          <div
            data-slot="inactive-track-right"
            className={cn(sliderInactiveTrackVariants({ size, orientation }), trackTransition)}
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
        const activePct = thumbPct - zeroPct;
        return (
          <>
            <div
              data-slot="inactive-track-left"
              className={cn(
                sliderInactiveTrackVariants({ size, orientation }),
                "flex-shrink-0",
                trackTransition
              )}
              style={{ flexBasis: `${zeroPct}%` }}
            />
            <div
              data-slot="active-track"
              className={cn(
                sliderActiveTrackVariants({ size, orientation }),
                "flex-shrink-0",
                trackTransition
              )}
              style={{ flexBasis: `${activePct}%` }}
            />
            <div
              data-slot="inactive-track-right"
              className={cn(sliderInactiveTrackVariants({ size, orientation }), trackTransition)}
              style={{ flexBasis: `${100 - zeroPct - activePct}%` }}
            />
          </>
        );
      } else {
        // Negative direction: inactive-left | active | inactive-right
        const activePct = zeroPct - thumbPct;
        return (
          <>
            <div
              data-slot="inactive-track-left"
              className={cn(
                sliderInactiveTrackVariants({ size, orientation }),
                "flex-shrink-0",
                trackTransition
              )}
              style={{ flexBasis: `${thumbPct}%` }}
            />
            <div
              data-slot="active-track"
              className={cn(
                sliderActiveTrackVariants({ size, orientation }),
                "flex-shrink-0",
                trackTransition
              )}
              style={{ flexBasis: `${activePct}%` }}
            />
            <div
              data-slot="inactive-track-right"
              className={cn(sliderInactiveTrackVariants({ size, orientation }), trackTransition)}
              style={{ flexBasis: `${100 - zeroPct}%` }}
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
      >
        <div data-slot="track-layout" className={cn(sliderTrackLayoutVariants({ orientation }))}>
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

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
import type { SliderProps, SliderThumbState } from "./Slider.types";

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
 * Wraps SliderHeadless with CVA styling for all five MD3 Expressive sizes.
 * Renders the visual track layout (active track → handle → inactive track) as
 * children inside the headless track element.
 *
 * Track widths are driven by runtime values and use inline `flexBasis` styles —
 * a documented exception for geometry that cannot be expressed as design tokens.
 *
 * Motion: MD3 Appendix E token pairings applied; JS-driven animations are
 * guarded with `useReducedMotion()`.
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

    // Thumb interaction states — tracked for state layer opacity
    const thumbCount = variant === "range" ? 2 : 1;
    const [thumbStates, setThumbStates] = useState<SliderThumbState[]>(() =>
      Array<SliderThumbState>(thumbCount).fill("enabled")
    );

    // Track flex-basis transitions — spatial spring, guarded by reducedMotion
    // MD3 Appendix E: duration-spring-standard-fast-spatial + ease-spring-standard-fast-spatial
    const trackTransition = reducedMotion
      ? ""
      : "transition-[flex-basis] duration-spring-standard-fast-spatial ease-spring-standard-fast-spatial";

    const isRange = variant === "range";
    const isCentered = variant === "centered";

    // Only Standard variant supports the inset icon, and only for Medium/Large/XLarge sizes
    // (MD3 spec §5.1: icon not available for XSmall and Small)
    const showIcon =
      icon !== undefined &&
      variant === "standard" &&
      (size === "medium" || size === "large" || size === "xlarge");

    // ── Standard track render ──────────────────────────────────────────────────
    const renderStandardTrack = (): React.JSX.Element => {
      const pct = clampPercent(currentValues[0] ?? minValue, minValue, maxValue);
      const thumb0State: SliderThumbState = isDisabled ? "disabled" : (thumbStates[0] ?? "enabled");

      return (
        <>
          {/* Active track — width/height driven by current value percentage */}
          <div
            data-slot="active-track"
            className={cn(
              sliderActiveTrackVariants({ size, disabled: isDisabled, orientation }),
              trackTransition
            )}
            style={{ flexBasis: `${pct}%` }}
          >
            {showIcon && (
              <span
                data-slot="inset-icon"
                className={cn(
                  sliderInsetIconVariants({
                    size,
                    orientation,
                  })
                )}
              >
                {icon}
              </span>
            )}
          </div>
          {/* Visual handle — decorative; keyboard/pointer behaviour is in SliderThumbInternal.
               stopPropagation prevents pointer events from bubbling to the React Aria track
               which would trigger a position calculation (NaN in JSDOM / no-layout envs). */}
          <div
            data-slot="handle"
            className={cn(
              sliderHandleVariants({
                size,
                disabled: isDisabled,
                pressed: thumb0State === "pressed",
                orientation,
              })
            )}
            onPointerEnter={() => {
              if (!isDisabled) setThumbStates(["hovered"]);
            }}
            onPointerLeave={() => {
              if (!isDisabled) setThumbStates(["enabled"]);
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              if (!isDisabled) setThumbStates(["pressed"]);
            }}
            onPointerUp={(e) => {
              e.stopPropagation();
              if (!isDisabled) setThumbStates(["enabled"]);
            }}
          >
            <div
              data-slot="state-layer"
              className={cn(sliderHandleStateLayerVariants({ state: thumb0State }))}
            />
            {showValueIndicator && (
              <SliderValueIndicator
                value={currentValues[0] ?? minValue}
                isVisible={thumb0State === "pressed"}
                {...(formatValue !== undefined ? { formatValue } : {})}
              />
            )}
          </div>
          {/* Inactive track — fills remaining flex space */}
          <div
            data-slot="inactive-track"
            className={cn(
              sliderInactiveTrackVariants({ size, disabled: isDisabled, orientation }),
              trackTransition
            )}
            style={{ flexBasis: `${100 - pct}%` }}
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
      const thumb0State: SliderThumbState = isDisabled ? "disabled" : (thumbStates[0] ?? "enabled");
      const thumb1State: SliderThumbState = isDisabled ? "disabled" : (thumbStates[1] ?? "enabled");

      const setThumb0 = (next: SliderThumbState): void =>
        setThumbStates((s) => [next, s[1] ?? "enabled"] as SliderThumbState[]);
      const setThumb1 = (next: SliderThumbState): void =>
        setThumbStates((s) => [s[0] ?? "enabled", next] as SliderThumbState[]);

      return (
        <>
          {/* Left inactive track */}
          <div
            data-slot="inactive-track-left"
            className={cn(
              sliderInactiveTrackVariants({ size, disabled: isDisabled, orientation }),
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
          {/* Left handle */}
          <div
            data-slot="handle"
            data-index="0"
            className={cn(
              sliderHandleVariants({
                size,
                disabled: isDisabled,
                pressed: thumb0State === "pressed",
                orientation,
              })
            )}
            onPointerEnter={() => {
              if (!isDisabled) setThumb0("hovered");
            }}
            onPointerLeave={() => {
              if (!isDisabled) setThumb0("enabled");
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              if (!isDisabled) setThumb0("pressed");
            }}
            onPointerUp={(e) => {
              e.stopPropagation();
              if (!isDisabled) setThumb0("enabled");
            }}
          >
            <div
              data-slot="state-layer"
              className={cn(sliderHandleStateLayerVariants({ state: thumb0State }))}
            />
            {showValueIndicator && (
              <SliderValueIndicator
                value={currentValues[0] ?? minValue}
                isVisible={thumb0State === "pressed"}
                {...(formatValue !== undefined ? { formatValue } : {})}
              />
            )}
          </div>
          {/* Active track — area between the two handles */}
          <div
            data-slot="active-track"
            className={cn(
              sliderActiveTrackVariants({ size, disabled: isDisabled, orientation }),
              "rounded-[2px]", // Both ends near handles: 2dp (MD3 §10.2)
              trackTransition
            )}
            style={{ flexBasis: `${rightPct - leftPct}%` }}
          />
          {/* Right handle */}
          <div
            data-slot="handle"
            data-index="1"
            className={cn(
              sliderHandleVariants({
                size,
                disabled: isDisabled,
                pressed: thumb1State === "pressed",
                orientation,
              })
            )}
            onPointerEnter={() => {
              if (!isDisabled) setThumb1("hovered");
            }}
            onPointerLeave={() => {
              if (!isDisabled) setThumb1("enabled");
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              if (!isDisabled) setThumb1("pressed");
            }}
            onPointerUp={(e) => {
              e.stopPropagation();
              if (!isDisabled) setThumb1("enabled");
            }}
          >
            <div
              data-slot="state-layer"
              className={cn(sliderHandleStateLayerVariants({ state: thumb1State }))}
            />
            {showValueIndicator && (
              <SliderValueIndicator
                value={currentValues[1] ?? maxValue}
                isVisible={thumb1State === "pressed"}
                {...(formatValue !== undefined ? { formatValue } : {})}
              />
            )}
          </div>
          {/* Right inactive track */}
          <div
            data-slot="inactive-track-right"
            className={cn(
              sliderInactiveTrackVariants({ size, disabled: isDisabled, orientation }),
              trackTransition
            )}
            style={{ flexBasis: `${100 - rightPct}%` }}
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

      const thumb0State: SliderThumbState = isDisabled ? "disabled" : (thumbStates[0] ?? "enabled");

      const handleEl = (
        <div
          data-slot="handle"
          className={cn(
            sliderHandleVariants({
              size,
              disabled: isDisabled,
              pressed: thumb0State === "pressed",
              orientation,
            })
          )}
          onPointerEnter={() => {
            if (!isDisabled) setThumbStates(["hovered"]);
          }}
          onPointerLeave={() => {
            if (!isDisabled) setThumbStates(["enabled"]);
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            if (!isDisabled) setThumbStates(["pressed"]);
          }}
          onPointerUp={(e) => {
            e.stopPropagation();
            if (!isDisabled) setThumbStates(["enabled"]);
          }}
        >
          <div
            data-slot="state-layer"
            className={cn(sliderHandleStateLayerVariants({ state: thumb0State }))}
          />
          {showValueIndicator && (
            <SliderValueIndicator
              value={currentValues[0] ?? minValue}
              isVisible={thumb0State === "pressed"}
              {...(formatValue !== undefined ? { formatValue } : {})}
            />
          )}
        </div>
      );

      if (thumbPct >= zeroPct) {
        // Positive direction: inactive-left | handle | active | inactive-right
        const activePct = thumbPct - zeroPct;
        return (
          <>
            <div
              data-slot="inactive-track-left"
              className={cn(
                sliderInactiveTrackVariants({ size, disabled: isDisabled, orientation }),
                trackTransition
              )}
              style={{ flexBasis: `${zeroPct}%` }}
            />
            {handleEl}
            <div
              data-slot="active-track"
              className={cn(
                sliderActiveTrackVariants({ size, disabled: isDisabled, orientation }),
                trackTransition
              )}
              style={{ flexBasis: `${activePct}%` }}
            />
            <div
              data-slot="inactive-track-right"
              className={cn(
                sliderInactiveTrackVariants({ size, disabled: isDisabled, orientation }),
                trackTransition
              )}
              style={{ flexBasis: `${100 - zeroPct - activePct}%` }}
            />
          </>
        );
      } else {
        // Negative direction: inactive-left | active | handle | inactive-right
        const activePct = zeroPct - thumbPct;
        return (
          <>
            <div
              data-slot="inactive-track-left"
              className={cn(
                sliderInactiveTrackVariants({ size, disabled: isDisabled, orientation }),
                trackTransition
              )}
              style={{ flexBasis: `${thumbPct}%` }}
            />
            <div
              data-slot="active-track"
              className={cn(
                sliderActiveTrackVariants({ size, disabled: isDisabled, orientation }),
                trackTransition
              )}
              style={{ flexBasis: `${activePct}%` }}
            />
            {handleEl}
            <div
              data-slot="inactive-track-right"
              className={cn(
                sliderInactiveTrackVariants({ size, disabled: isDisabled, orientation }),
                trackTransition
              )}
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
        className={cn(
          sliderContainerVariants({ size, disabled: isDisabled, orientation }),
          className
        )}
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
              isDisabled={isDisabled}
            />
          )}
        </div>
      </SliderHeadless>
    );
  }
);

Slider.displayName = "Slider";

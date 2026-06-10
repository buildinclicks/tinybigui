"use client";

import { forwardRef, useEffect, useMemo, useRef } from "react";
import type React from "react";
import {
  mergeProps,
  useFocusRing,
  useHover,
  useSlider,
  useSliderThumb,
  VisuallyHidden,
} from "react-aria";
import { useSliderState } from "react-stately";
import type { SliderState } from "react-stately";
import { cn } from "../../utils/cn";
import { getInteractionDataAttributes } from "../../utils/interactionStates";
import type { SliderHeadlessProps, SliderThumbRenderState } from "./Slider.types";

// ─── Centered Variant Utilities ───────────────────────────────────────────────

/**
 * Calculate the percentage position of zero within the slider range.
 * For range [-100, 100]: zeroPercent = 50
 * For range [-50, 150]: zeroPercent = 25
 * For range [0, 100]:   zeroPercent = 0  (degenerates to standard)
 */
function getZeroPercent(minValue: number, maxValue: number): number {
  if (minValue >= 0) return 0;
  if (maxValue <= 0) return 100;
  return ((0 - minValue) / (maxValue - minValue)) * 100;
}

/**
 * Determine which side of center the thumb sits on.
 */
function getValueDirection(value: number): "negative" | "positive" | "zero" {
  if (value < 0) return "negative";
  if (value > 0) return "positive";
  return "zero";
}

// ─── Internal Thumb ───────────────────────────────────────────────────────────

interface SliderThumbInternalProps {
  index: number;
  state: SliderState;
  trackRef: React.RefObject<HTMLDivElement>;
  isDisabled: boolean;
  orientation: "horizontal" | "vertical";
  formatValue?: (value: number) => string;
  "aria-label"?: string;
  className?: string;
  "data-direction"?: "negative" | "positive" | "zero";
  renderContent?: (state: SliderThumbRenderState) => React.ReactNode;
  onDraggingChange?: (isDragging: boolean) => void;
}

function SliderThumbInternal({
  index,
  state,
  trackRef,
  isDisabled,
  orientation,
  formatValue,
  className,
  "data-direction": dataDirection,
  renderContent,
  onDraggingChange,
  ...ariaProps
}: SliderThumbInternalProps): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  const { thumbProps, inputProps, isDragging, isFocused } = useSliderThumb(
    {
      index,
      trackRef,
      inputRef,
      isDisabled,
      ...ariaProps,
    },
    state
  );

  const { isFocusVisible, focusProps } = useFocusRing();
  const { isHovered, hoverProps } = useHover({ isDisabled });

  // Notify parent when dragging state changes so Slider.tsx can suppress
  // the track flex-basis transition during active drag (matches Switch/Button pattern).
  useEffect(() => {
    onDraggingChange?.(isDragging);
  }, [isDragging, onDraggingChange]);

  // Override aria-valuetext with the custom formatter when provided.
  // React Stately v3.7 does not support getValueLabel; we patch the attribute directly.
  const currentValue = state.getThumbValue(index);
  const ariaValueText = formatValue ? formatValue(currentValue) : undefined;

  // Absolute positioning: place the thumb (and its visual content) exactly
  // at the value's percentage position on the track.
  // Horizontal: left edge at `pct%`, centered via translate(-50%, -50%)
  // Vertical:   bottom edge at `pct%`, centered via translate(-50%, 50%)
  const thumbPercent = state.getThumbPercent(index);
  const positionStyle: React.CSSProperties =
    orientation === "horizontal"
      ? {
          position: "absolute",
          left: `${thumbPercent * 100}%`,
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
        }
      : {
          position: "absolute",
          bottom: `${thumbPercent * 100}%`,
          left: "50%",
          transform: "translate(-50%, 50%)",
          zIndex: 10,
        };

  const renderState: SliderThumbRenderState = {
    index,
    value: currentValue,
    isDragging,
    isFocusVisible,
    isHovered,
    isDisabled,
  };

  return (
    <div
      {...mergeProps(thumbProps, hoverProps, { style: positionStyle })}
      data-slot="slider-thumb"
      data-dragging={isDragging || undefined}
      data-focused={isFocused || undefined}
      {...(dataDirection !== undefined ? { "data-direction": dataDirection } : {})}
      {...getInteractionDataAttributes({
        isHovered,
        isFocusVisible,
        isPressed: isDragging,
        isDisabled,
      })}
      className={cn(
        // Group scope: interaction selectors on children target this element
        "group/slider-thumb",
        // Accessibility: remove default outline (custom focus ring via data-[focus-visible])
        "outline-none",
        // Focus ring visible only on keyboard focus — matches project pattern
        "data-[focus-visible]:ring-3",
        "data-[focus-visible]:ring-secondary",
        "data-[focus-visible]:ring-offset-2",
        className
      )}
    >
      <VisuallyHidden>
        <input
          ref={inputRef}
          {...mergeProps(inputProps, focusProps)}
          {...(ariaValueText !== undefined ? { "aria-valuetext": ariaValueText } : {})}
        />
      </VisuallyHidden>
      {renderContent?.(renderState)}
    </div>
  );
}

// ─── SliderHeadless ───────────────────────────────────────────────────────────

/**
 * Headless Slider Component (Layer 2)
 *
 * Unstyled slider primitive using React Aria for full accessibility.
 * Provides behavior only — bring your own styles.
 *
 * Features:
 * - role="group" on container with role="slider" on thumb input
 * - Full keyboard navigation: Arrow keys, Page Up/Down, Home, End
 * - Pointer drag with capture (mouse, touch, pen)
 * - Click-to-seek on the track
 * - Controlled and uncontrolled value management
 * - Horizontal and vertical orientations
 * - Discrete stepping support
 * - Live value announcements via <output>
 * - data-* attributes for styled layer targeting
 * - `group/slider-thumb` scope on each thumb for group-data CSS selectors
 * - `renderThumbContent` render prop for injecting visual content inside RA thumb
 *
 * @example
 * ```tsx
 * <SliderHeadless label="Volume" defaultValue={[50]} />
 *
 * <SliderHeadless
 *   label="Price range"
 *   variant="range"
 *   minValue={0}
 *   maxValue={500}
 *   defaultValue={[100, 400]}
 *   formatValue={(v) => `$${v}`}
 * />
 * ```
 */
export const SliderHeadless = forwardRef<HTMLDivElement, SliderHeadlessProps>(
  (props, forwardedRef) => {
    const {
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
      label,
      formatValue,
      thumbLabels,
      className,
      style,
      children,
      trackClassName,
      renderThumbContent,
      onThumbDraggingChange,
      ...ariaProps
    } = props;

    const trackRef = useRef<HTMLDivElement>(null);
    const internalRef = useRef<HTMLDivElement>(null);
    const containerRef = (forwardedRef ?? internalRef) as React.RefObject<HTMLDivElement>;

    if (process.env.NODE_ENV !== "production") {
      if (!label && !ariaProps["aria-label"] && !ariaProps["aria-labelledby"]) {
        console.warn(
          "[Slider] Slider must have an accessible name. Provide a `label`, `aria-label`, or `aria-labelledby` prop."
        );
      }
    }

    // Stable formatter for React Stately value announcements
    const numberFormatter = useMemo(() => new Intl.NumberFormat(), []);

    const resolvedDefaultValue =
      defaultValue ?? (variant === "range" ? [25, 75] : variant === "centered" ? [0] : [minValue]);

    // Build state options — omit optional props when undefined to satisfy exactOptionalPropertyTypes
    const state = useSliderState({
      minValue,
      maxValue,
      ...(step !== undefined ? { step } : {}),
      orientation,
      isDisabled,
      ...(label !== undefined ? { label } : {}),
      ...(value !== undefined ? { value } : {}),
      defaultValue: resolvedDefaultValue,
      ...(onChange !== undefined ? { onChange } : {}),
      ...(onChangeEnd !== undefined ? { onChangeEnd } : {}),
      numberFormatter,
    });

    const { groupProps, trackProps, labelProps, outputProps } = useSlider(
      {
        ...ariaProps,
        ...(label !== undefined ? { label } : {}),
        orientation,
        isDisabled,
        minValue,
        maxValue,
        ...(step !== undefined ? { step } : {}),
        ...(value !== undefined ? { value } : {}),
        defaultValue: resolvedDefaultValue,
        ...(onChange !== undefined ? { onChange } : {}),
        ...(onChangeEnd !== undefined ? { onChangeEnd } : {}),
      },
      state,
      trackRef
    );

    const isRange = variant === "range";
    const isCentered = variant === "centered";

    const zeroPercent = isCentered ? getZeroPercent(minValue, maxValue) : undefined;
    const direction = isCentered ? getValueDirection(state.getThumbValue(0)) : undefined;

    // For range, each thumb needs its own distinct aria-label so screen readers
    // can distinguish between the minimum and maximum handle.
    const thumb0Label = isRange ? (thumbLabels?.[0] ?? "Minimum") : ariaProps["aria-label"];

    return (
      <div
        {...groupProps}
        ref={containerRef}
        className={className}
        style={style}
        data-orientation={orientation}
        data-disabled={isDisabled || undefined}
        data-variant={variant}
        {...(zeroPercent !== undefined ? { "data-zero-percent": zeroPercent } : {})}
      >
        {label && (
          <label {...labelProps} className={cn(orientation === "vertical" && "sr-only")}>
            {label}
          </label>
        )}
        <output
          {...outputProps}
          className={cn(
            orientation === "horizontal" && "justify-self-end",
            orientation === "vertical" && "sr-only"
          )}
        >
          {isRange
            ? formatValue
              ? `${formatValue(state.getThumbValue(0))} \u2013 ${formatValue(state.getThumbValue(1))}`
              : `${state.getThumbValueLabel(0)} \u2013 ${state.getThumbValueLabel(1)}`
            : formatValue
              ? formatValue(state.getThumbValue(0))
              : state.getThumbValueLabel(0)}
        </output>
        <div
          {...trackProps}
          ref={trackRef}
          data-orientation={orientation}
          data-track
          {...(zeroPercent !== undefined ? { "data-zero-percent": zeroPercent } : {})}
          // `relative` is required so the absolutely-positioned RA thumbs
          // (which carry all visual content in the new arch) are positioned
          // relative to this element.
          className={cn(
            trackClassName ?? "relative w-full",
            orientation === "vertical" && !trackClassName && "h-full"
          )}
        >
          {children}
          <SliderThumbInternal
            index={0}
            state={state}
            trackRef={trackRef}
            isDisabled={isDisabled}
            orientation={orientation}
            {...(formatValue !== undefined ? { formatValue } : {})}
            {...(thumb0Label !== undefined ? { "aria-label": thumb0Label } : {})}
            {...(direction !== undefined ? { "data-direction": direction } : {})}
            {...(renderThumbContent !== undefined ? { renderContent: renderThumbContent } : {})}
            {...(onThumbDraggingChange !== undefined
              ? { onDraggingChange: (d) => onThumbDraggingChange(0, d) }
              : {})}
          />
          {isRange && (
            <SliderThumbInternal
              index={1}
              state={state}
              trackRef={trackRef}
              isDisabled={isDisabled}
              orientation={orientation}
              {...(formatValue !== undefined ? { formatValue } : {})}
              aria-label={thumbLabels?.[1] ?? "Maximum"}
              {...(renderThumbContent !== undefined ? { renderContent: renderThumbContent } : {})}
              {...(onThumbDraggingChange !== undefined
                ? { onDraggingChange: (d) => onThumbDraggingChange(1, d) }
                : {})}
            />
          )}
        </div>
      </div>
    );
  }
);

SliderHeadless.displayName = "SliderHeadless";

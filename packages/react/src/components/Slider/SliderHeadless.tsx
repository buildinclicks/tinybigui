"use client";

import { forwardRef, useMemo, useRef } from "react";
import type React from "react";
import { mergeProps, useFocusRing, useSlider, useSliderThumb, VisuallyHidden } from "react-aria";
import { useSliderState } from "react-stately";
import type { SliderState } from "react-stately";
import type { SliderHeadlessProps } from "./Slider.types";

// ─── Internal Thumb ───────────────────────────────────────────────────────────

interface SliderThumbInternalProps {
  index: number;
  state: SliderState;
  trackRef: React.RefObject<HTMLDivElement>;
  isDisabled: boolean;
  formatValue?: (value: number) => string;
  "aria-label"?: string;
  className?: string;
}

function SliderThumbInternal({
  index,
  state,
  trackRef,
  isDisabled,
  formatValue: _formatValue,
  className: _className,
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

  return (
    <div
      {...thumbProps}
      data-dragging={isDragging || undefined}
      data-focused={isFocused || undefined}
      data-focus-visible={isFocusVisible || undefined}
      data-disabled={isDisabled || undefined}
    >
      <VisuallyHidden>
        <input ref={inputRef} {...mergeProps(inputProps, focusProps)} />
      </VisuallyHidden>
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
      ...ariaProps
    } = props;

    const trackRef = useRef<HTMLDivElement>(null);
    const internalRef = useRef<HTMLDivElement>(null);
    const containerRef = (forwardedRef ?? internalRef) as React.RefObject<HTMLDivElement>;

    // Stable formatter for React Stately value announcements
    const numberFormatter = useMemo(() => new Intl.NumberFormat(), []);

    const resolvedDefaultValue = defaultValue ?? (variant === "range" ? [25, 75] : [0]);

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
      >
        {label && <label {...labelProps}>{label}</label>}
        <div {...trackProps} ref={trackRef} data-orientation={orientation} data-track>
          {children}
          <SliderThumbInternal
            index={0}
            state={state}
            trackRef={trackRef}
            isDisabled={isDisabled}
            {...(formatValue !== undefined ? { formatValue } : {})}
            {...(thumb0Label !== undefined ? { "aria-label": thumb0Label } : {})}
          />
          {isRange && (
            <SliderThumbInternal
              index={1}
              state={state}
              trackRef={trackRef}
              isDisabled={isDisabled}
              {...(formatValue !== undefined ? { formatValue } : {})}
              aria-label={thumbLabels?.[1] ?? "Maximum"}
            />
          )}
        </div>
        <output {...outputProps}>
          {isRange
            ? formatValue
              ? `${formatValue(state.getThumbValue(0))} \u2013 ${formatValue(state.getThumbValue(1))}`
              : `${state.getThumbValueLabel(0)} \u2013 ${state.getThumbValueLabel(1)}`
            : formatValue
              ? formatValue(state.getThumbValue(0))
              : state.getThumbValueLabel(0)}
        </output>
      </div>
    );
  }
);

SliderHeadless.displayName = "SliderHeadless";

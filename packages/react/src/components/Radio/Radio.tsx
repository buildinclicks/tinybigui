"use client";

import { forwardRef, useRef, useContext } from "react";
import type React from "react";
import { useRadio, useFocusRing, mergeProps, VisuallyHidden } from "react-aria";
import { cn } from "../../utils/cn";
import { useRipple } from "../../hooks/useRipple";
import { RadioGroupContext } from "./RadioGroupHeadless";
import {
  radioVariants,
  radioContainerVariants,
  radioIconOuterVariants,
  radioIconInnerVariants,
  radioLabelVariants,
} from "./Radio.variants";
import type { RadioProps } from "./Radio.types";

/**
 * Material Design 3 Radio Component (Layer 3: Styled)
 *
 * Built on React Aria for world-class accessibility.
 * Uses CVA for type-safe variant management.
 * Styled with Tailwind CSS using MD3 design tokens.
 * Must be used within a RadioGroup for proper functionality.
 *
 * Features:
 * - ✅ 2 states: unselected, selected
 * - ✅ Ripple effect (Material Design)
 * - ✅ Full keyboard accessibility (via React Aria)
 * - ✅ Screen reader support (via React Aria)
 * - ✅ Focus management (via React Aria)
 * - ✅ Form integration (name, value props from RadioGroup)
 *
 * MD3 Specifications:
 * - Radio icon: 20x20dp (within 40x40dp touch target)
 * - Outer circle: 20px
 * - Inner dot: 10px (selected state)
 * - Outline width: 2dp
 * - State layers: 8% hover, 12% focus/pressed
 * - Disabled: 38% opacity
 * - Label spacing: 16px (ml-4)
 *
 * @example
 * ```tsx
 * // Basic usage within RadioGroup
 * <RadioGroup label="Options">
 *   <Radio value="a">Option A</Radio>
 *   <Radio value="b">Option B</Radio>
 * </RadioGroup>
 *
 * // Without label (needs aria-label)
 * <RadioGroup label="Options">
 *   <Radio value="a" aria-label="Option A" />
 * </RadioGroup>
 *
 * // Disabled individual radio
 * <RadioGroup label="Options">
 *   <Radio value="a">Enabled</Radio>
 *   <Radio value="b" isDisabled>Disabled</Radio>
 * </RadioGroup>
 *
 * // Custom styling
 * <Radio value="custom" className="my-custom-class">
 *   Custom
 * </Radio>
 * ```
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      // Content props
      children,

      // State props
      disableRipple = false,
      isDisabled = false,

      // Styling
      className,

      // Other props
      ...props
    },
    forwardedRef
  ) => {
    // Get RadioGroup state from context
    const state = useContext(RadioGroupContext);

    if (!state) {
      throw new Error("Radio must be used within a RadioGroup");
    }

    // Internal ref for React Aria
    const internalRef = useRef<HTMLInputElement>(null);

    // Merge internal ref with forwarded ref
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLInputElement>;

    // Extract data-testid and other HTML attributes
    const htmlAttrs = props as Record<string, unknown>;
    const dataTestId = htmlAttrs["data-testid"] as string | undefined;
    const htmlId = htmlAttrs.id as string | undefined;
    const htmlTitle = htmlAttrs.title as string | undefined;

    // Remove HTML attributes from props for React Aria
    const {
      "data-testid": _dataTestId,
      id: _htmlId,
      title: _htmlTitle,
      ...restPropsWithoutHtmlAttrs
    } = props as Record<string, unknown>;

    // React Aria hooks - pass props without HTML attributes
    const {
      inputProps,
      isSelected,
      isDisabled: radioIsDisabled,
    } = useRadio(
      {
        ...restPropsWithoutHtmlAttrs,
        value: props.value,
      } as Parameters<typeof useRadio>[0],
      state,
      ref
    );
    const { isFocusVisible, focusProps } = useFocusRing();

    // Determine final disabled state (group or individual)
    const finalIsDisabled = isDisabled || radioIsDisabled;

    // Determine visual state
    const visualState = isSelected ? "selected" : "unselected";

    // Ripple effect
    const { onMouseDown: handleRipple, ripples } = useRipple({
      disabled: finalIsDisabled || disableRipple,
    });

    // Development warnings
    if (process.env.NODE_ENV === "development") {
      const ariaProps = restPropsWithoutHtmlAttrs as {
        "aria-label"?: string;
        "aria-labelledby"?: string;
      };
      if (!children && !ariaProps["aria-label"] && !ariaProps["aria-labelledby"]) {
        console.warn(
          "[Radio] Radio should have a label (children) or aria-label for accessibility."
        );
      }
    }

    // Get isInvalid from RadioGroup state if available
    const isInvalid = state.validationState === "invalid";

    return (
      <label
        className={cn(
          radioVariants({
            disabled: finalIsDisabled,
          }),
          className
        )}
        data-testid={dataTestId}
        title={htmlTitle}
      >
        {/* Visually hidden native input for accessibility */}
        <VisuallyHidden>
          <input {...mergeProps(inputProps, focusProps)} ref={ref} id={htmlId} />
        </VisuallyHidden>

        {/* Visual radio container */}
        <div
          role="presentation"
          className={cn(
            radioContainerVariants({
              state: visualState,
              isInvalid,
              disabled: finalIsDisabled,
            })
          )}
          onMouseDown={handleRipple}
        >
          {/* Ripple effect */}
          {ripples}

          {/* SVG Radio Visual */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            aria-hidden="true"
            className="relative z-10"
          >
            {/* Outer circle (20x20) */}
            <circle
              cx="10"
              cy="10"
              r="9"
              className={cn(
                radioIconOuterVariants({
                  state: visualState,
                  disabled: finalIsDisabled,
                })
              )}
            />

            {/* Inner dot (10px diameter = 5px radius, shown when selected) */}
            <circle
              cx="10"
              cy="10"
              r="5"
              className={cn(
                radioIconInnerVariants({
                  visible: isSelected,
                })
              )}
              style={{ fill: "var(--color-on-primary)" }}
            />

            {/* Focus ring (visible on keyboard focus) */}
            {isFocusVisible && (
              <circle
                cx="10"
                cy="10"
                r="13"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="animate-pulse"
              />
            )}
          </svg>
        </div>

        {/* Label text */}
        {children && (
          <span
            className={cn(
              radioLabelVariants({
                disabled: finalIsDisabled,
              })
            )}
          >
            {children}
          </span>
        )}
      </label>
    );
  }
);

Radio.displayName = "Radio";

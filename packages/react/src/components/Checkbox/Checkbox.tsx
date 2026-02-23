"use client";

import { forwardRef, useRef, useEffect } from "react";
import type React from "react";
import { useCheckbox, useFocusRing, mergeProps, VisuallyHidden } from "react-aria";
import { useToggleState } from "react-stately";
import { cn } from "../../utils/cn";
import { useRipple } from "../../hooks/useRipple";
import {
  checkboxVariants,
  checkboxContainerVariants,
  checkboxIconBoxVariants,
  checkboxIconVariants,
  checkboxLabelVariants,
} from "./Checkbox.variants";
import type { CheckboxProps } from "./Checkbox.types";

/**
 * Material Design 3 Checkbox Component (Layer 3: Styled)
 *
 * Built on React Aria for world-class accessibility.
 * Uses CVA for type-safe variant management.
 * Styled with Tailwind CSS using MD3 design tokens.
 *
 * Features:
 * - ✅ 3 states: unchecked, checked, indeterminate
 * - ✅ Error/invalid state support
 * - ✅ Ripple effect (Material Design)
 * - ✅ Full keyboard accessibility (via React Aria)
 * - ✅ Screen reader support (via React Aria)
 * - ✅ Focus management (via React Aria)
 * - ✅ Form integration (name, value props)
 *
 * MD3 Specifications:
 * - Container: 18x18dp (within 40x40dp touch target)
 * - Corner radius: 2dp (applied via SVG rx/ry attributes)
 * - State layers: 8% hover, 12% focus/pressed
 * - Disabled: 38% opacity
 * - Label spacing: 16px (ml-4)
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Checkbox>Accept terms</Checkbox>
 *
 * // Controlled
 * <Checkbox isSelected={checked} onChange={setChecked}>
 *   Subscribe
 * </Checkbox>
 *
 * // Indeterminate (partial selection)
 * <Checkbox isIndeterminate>Select all</Checkbox>
 *
 * // Error state
 * <Checkbox isInvalid>Required field</Checkbox>
 *
 * // Disabled
 * <Checkbox isDisabled>Disabled option</Checkbox>
 *
 * // Without label (icon-only)
 * <Checkbox aria-label="Accept" />
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      // Content props
      children,

      // State props
      isIndeterminate = false,
      isInvalid = false,
      disableRipple = false,
      isDisabled = false,

      // Styling
      className,

      // Other props
      ...props
    },
    forwardedRef
  ) => {
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

    // State management using React Stately
    const state = useToggleState(restPropsWithoutHtmlAttrs as Parameters<typeof useToggleState>[0]);

    // React Aria hooks - pass props without HTML attributes
    const { inputProps, labelProps } = useCheckbox(
      restPropsWithoutHtmlAttrs as Parameters<typeof useCheckbox>[0],
      state,
      ref
    );
    const { isFocusVisible, focusProps } = useFocusRing();

    // Get selected state
    const isSelected = state.isSelected;

    // Determine visual state
    const visualState = isIndeterminate ? "indeterminate" : isSelected ? "checked" : "unchecked";

    // Ripple effect
    const { onMouseDown: handleRipple, ripples } = useRipple({
      disabled: isDisabled || disableRipple,
    });

    // Sync indeterminate state to native input
    useEffect(() => {
      if (ref.current) {
        ref.current.indeterminate = isIndeterminate;
      }
    }, [isIndeterminate, ref]);

    // Development warnings
    if (process.env.NODE_ENV === "development") {
      const ariaProps = restPropsWithoutHtmlAttrs as {
        "aria-label"?: string;
        "aria-labelledby"?: string;
      };
      if (!children && !ariaProps["aria-label"] && !ariaProps["aria-labelledby"]) {
        console.warn(
          "[Checkbox] Checkbox should have a label (children) or aria-label for accessibility."
        );
      }
    }

    return (
      <label
        {...labelProps}
        className={cn(
          checkboxVariants({
            disabled: isDisabled,
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

        {/* Visual checkbox container */}
        <div
          role="presentation"
          className={cn(
            checkboxContainerVariants({
              state: visualState,
              isInvalid,
              disabled: isDisabled,
            })
          )}
          onMouseDown={handleRipple}
        >
          {/* Ripple effect */}
          {ripples}

          {/* SVG Checkbox Visual */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            aria-hidden="true"
            className="relative z-10"
          >
            {/* Checkbox box (rounded square) */}
            <rect
              x="0"
              y="0"
              width="18"
              height="18"
              rx="2"
              ry="2"
              className={cn(
                checkboxIconBoxVariants({
                  state: visualState,
                  disabled: isDisabled,
                })
              )}
            />

            {/* Checkmark icon (for checked state) */}
            {isSelected && !isIndeterminate && (
              <path
                d="M14.1 4.5L6.3 12.3l-3.4-3.4L1.5 10.3l4.8 4.8 9.2-9.2z"
                className={cn(checkboxIconVariants({ type: "check" }))}
                style={{ fill: "var(--color-on-primary)" }}
              />
            )}

            {/* Dash icon (for indeterminate state) */}
            {isIndeterminate && (
              <rect
                x="4"
                y="8"
                width="10"
                height="2"
                className={cn(checkboxIconVariants({ type: "dash" }))}
                style={{ fill: "var(--color-on-primary)" }}
              />
            )}

            {/* Focus ring (visible on keyboard focus) */}
            {isFocusVisible && (
              <rect
                x="-3"
                y="-3"
                width="24"
                height="24"
                rx="12"
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
              checkboxLabelVariants({
                disabled: isDisabled,
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

Checkbox.displayName = "Checkbox";

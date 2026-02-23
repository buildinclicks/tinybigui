"use client";

import { forwardRef, useRef } from "react";
import type React from "react";
import { useSwitch, useFocusRing, mergeProps, VisuallyHidden } from "react-aria";
import { useToggleState } from "react-stately";
import { cn } from "../../utils/cn";
import { useRipple } from "../../hooks/useRipple";
import {
  switchVariants,
  switchTrackVariants,
  switchHandleContainerVariants,
  switchHandleVariants,
  switchIconVariants,
  switchLabelVariants,
} from "./Switch.variants";
import type { SwitchProps } from "./Switch.types";

/**
 * Material Design 3 Switch Component (Layer 3: Styled)
 *
 * Built on React Aria for world-class accessibility.
 * Uses CVA for type-safe variant management.
 * Styled with Tailwind CSS using MD3 design tokens.
 *
 * Features:
 * - ✅ 2 states: on/off (not selection like checkbox)
 * - ✅ Optional icons in handle
 * - ✅ Ripple effect (Material Design)
 * - ✅ Full keyboard accessibility (via React Aria)
 * - ✅ Screen reader support (via React Aria)
 * - ✅ Focus management (via React Aria)
 * - ✅ Form integration (name, value props)
 *
 * MD3 Specifications:
 * - Track: 52x32dp (border-radius 16dp)
 * - Handle: 16x16dp (unselected), 24x24dp (selected), 28x28dp (pressed)
 * - Touch target: 48x48dp minimum
 * - State layers: 8% hover, 12% focus/pressed
 * - Disabled: 12% container, 38% content opacity
 * - Label spacing: 16px (ml-4)
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Switch>Low power mode</Switch>
 *
 * // Controlled
 * <Switch isSelected={isOn} onChange={setIsOn}>
 *   Notifications
 * </Switch>
 *
 * // With icons
 * <Switch icon={<IconClose />} selectedIcon={<IconCheck />}>
 *   Airplane mode
 * </Switch>
 *
 * // Disabled
 * <Switch isDisabled>Disabled option</Switch>
 *
 * // Without label (icon-only)
 * <Switch aria-label="Toggle feature" />
 * ```
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      // Content props
      children,
      icon,
      selectedIcon,

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
    const { inputProps, labelProps, isPressed } = useSwitch(
      restPropsWithoutHtmlAttrs as Parameters<typeof useSwitch>[0],
      state,
      ref
    );
    const { isFocusVisible, focusProps } = useFocusRing();

    // Get selected state
    const isSelected = state.isSelected;

    // Ripple effect
    const { onMouseDown: handleRipple, ripples } = useRipple({
      disabled: isDisabled || disableRipple,
    });

    // Development warnings
    if (process.env.NODE_ENV === "development") {
      const ariaProps = restPropsWithoutHtmlAttrs as {
        "aria-label"?: string;
        "aria-labelledby"?: string;
      };
      if (!children && !ariaProps["aria-label"] && !ariaProps["aria-labelledby"]) {
        console.warn(
          "[Switch] Switch should have a label (children) or aria-label for accessibility."
        );
      }
    }

    return (
      <label
        {...labelProps}
        className={cn(
          switchVariants({
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

        {/* Visual switch container */}
        <div
          role="presentation"
          className={cn(
            switchTrackVariants({
              selected: isSelected,
              disabled: isDisabled,
            })
          )}
        >
          {/* Focus ring (keyboard focus indicator) */}
          {isFocusVisible && (
            <div
              className="border-primary absolute inset-[-4px] animate-pulse rounded-full border-2"
              aria-hidden="true"
            />
          )}

          {/* Handle container (with state layers and ripple) */}
          <div
            className={cn(
              switchHandleContainerVariants({
                selected: isSelected,
                pressed: isPressed,
                disabled: isDisabled,
              })
            )}
            onMouseDown={handleRipple}
            role="presentation"
          >
            {/* Ripple effect */}
            {ripples}

            {/* Handle (thumb) */}
            <div
              className={cn(
                switchHandleVariants({
                  selected: isSelected,
                  pressed: isPressed,
                  disabled: isDisabled,
                })
              )}
            >
              {/* Icon when OFF */}
              {!isSelected && icon && (
                <div
                  className={cn(
                    switchIconVariants({
                      visible: !isSelected,
                      disabled: isDisabled,
                    })
                  )}
                >
                  {icon}
                </div>
              )}

              {/* Icon when ON */}
              {isSelected && selectedIcon && (
                <div
                  className={cn(
                    switchIconVariants({
                      visible: isSelected,
                      disabled: isDisabled,
                    })
                  )}
                >
                  {selectedIcon}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Label text */}
        {children && (
          <span
            className={cn(
              switchLabelVariants({
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

Switch.displayName = "Switch";

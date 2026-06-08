"use client";

import { forwardRef } from "react";
import type React from "react";
import { IconButtonHeadless } from "./IconButtonHeadless";
import { iconButtonVariants, type IconButtonVariants } from "./IconButton.variants";
import { cn } from "../../utils/cn";
import { useRipple } from "../../hooks/useRipple";
import { mergeProps } from "@react-aria/utils";
import { useOptionalButtonGroup } from "../ButtonGroup/ButtonGroupContext";
import { getConnectedRadiusClasses } from "../ButtonGroup/ButtonGroup.utils";
import type { IconButtonProps } from "./IconButton.types";

/**
 * Material Design 3 IconButton Component
 *
 * Icon-only button component following MD3 specifications.
 * Supports 4 variants, toggle mode, and enforces accessibility.
 *
 * **Key Features:**
 * - 4 variants: standard, filled, tonal, outlined
 * - Circular shape (MD3 specification)
 * - Mandatory `aria-label` for accessibility
 * - Toggle support with `selected` prop
 * - Ripple effect on interaction
 * - 48×48px minimum touch target
 * - ButtonGroup-aware: applies connected corner radii and min-width when inside a group
 *
 * @example
 * ```tsx
 * // Standard icon button
 * <IconButton aria-label="Delete">
 *   <IconDelete />
 * </IconButton>
 *
 * // Filled with color
 * <IconButton aria-label="Favorite" variant="filled" color="error">
 *   <IconHeart />
 * </IconButton>
 *
 * // Toggle button
 * <IconButton
 *   aria-label={selected ? "Remove favorite" : "Add favorite"}
 *   selected={selected}
 *   onPress={() => setSelected(!selected)}
 * >
 *   {selected ? <IconStarFilled /> : <IconStarOutline />}
 * </IconButton>
 *
 * // Inside a connected ButtonGroup (corner radii applied automatically)
 * <ButtonGroup variant="connected" selectionMode="multi" aria-label="Quick settings">
 *   <IconButton aria-label="Bluetooth"><BluetoothIcon /></IconButton>
 *   <IconButton aria-label="Wi-Fi"><WifiIcon /></IconButton>
 * </ButtonGroup>
 * ```
 */
export const IconButton = forwardRef<
  HTMLButtonElement,
  IconButtonProps & Omit<IconButtonVariants, "isDisabled" | "selected">
>(
  (
    {
      // Variant props (CVA)
      variant = "standard",
      color = "primary",
      size = "medium",
      // IconButton specific props
      children,
      value,
      selected,
      disableRipple = false,
      className,
      // React Aria props
      isDisabled: propIsDisabled = false,
      onPress,
      onMouseDown,
      "aria-label": ariaLabel,
      title,
      ...props
    },
    ref
  ) => {
    // ButtonGroup context — null when rendered outside a group (safe to call unconditionally)
    const groupCtx = useOptionalButtonGroup();
    const isConnected = groupCtx?.variant === "connected";

    // Development warnings
    if (process.env.NODE_ENV === "development") {
      if (!ariaLabel) {
        console.error(
          "[IconButton] aria-label is required for IconButton. Icon-only buttons need accessible labels for screen readers."
        );
      }

      if (!children) {
        console.warn("[IconButton] IconButton should have an icon as children.");
      }
    }

    // Combine disabled states
    const isDisabled = propIsDisabled;

    // Ripple effect
    const { onMouseDown: handleRipple, ripples } = useRipple({
      disabled: isDisabled || disableRipple,
    });

    // Merge user's onMouseDown with ripple handler
    const mergedOnMouseDown = (e: React.MouseEvent<HTMLButtonElement>): void => {
      onMouseDown?.(e);
      handleRipple(e);
    };

    const mergedPropsValue = mergeProps(props, {
      ...(onPress && { onPress }),
      onMouseDown: mergedOnMouseDown,
      isDisabled,
    });

    // Connected group radius + min-width overrides (pass value for selection-aware shape morph)
    const isGroupSelected =
      isConnected && groupCtx && value ? groupCtx.selectedValues.has(value) : false;

    const connectedClasses =
      isConnected && groupCtx
        ? [
            ...getConnectedRadiusClasses(groupCtx, value),
            groupCtx.enforceMinWidth ? "min-w-12" : "",
          ]
        : [];

    return (
      <IconButtonHeadless
        ref={ref}
        className={cn(
          // CVA variants — includes btn-transition for asymmetric border-radius easing
          iconButtonVariants({ variant, color, size, selected: selected ?? false, isDisabled }),

          // Asymmetric border-radius easing: expressive when selected, decelerate when not.
          // btn-transition-selected overrides --_btn-radius-easing to the bouncy spring while
          // the button is gaining the pill shape; removal restores decelerate for the return
          // path, preventing the overshoot-to-0px sharp-corner flash.
          isGroupSelected ? "btn-transition-selected" : "",

          // Connected group overrides: inner radius + start/end outer radius + min-width
          ...connectedClasses,

          // User custom classes
          className
        )}
        aria-label={ariaLabel}
        data-variant={variant}
        data-color={color}
        // Connected group selection state — mirrors btn-transition-selected for CSS targeting
        data-group-selected={isGroupSelected ? "" : undefined}
        {...(selected !== undefined && { selected })}
        {...(title && { title })}
        {...mergedPropsValue}
      >
        {/* Ripple effect */}
        {ripples}

        {/* Icon content */}
        <span className="relative z-10 inline-flex shrink-0">{children}</span>
      </IconButtonHeadless>
    );
  }
);

IconButton.displayName = "IconButton";

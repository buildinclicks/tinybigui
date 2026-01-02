"use client";

import { forwardRef } from "react";
import type React from "react";
import { IconButtonHeadless } from "./IconButtonHeadless";
import { iconButtonVariants, type IconButtonVariants } from "./IconButton.variants";
import { cn } from "../../utils/cn";
import { useRipple } from "../../hooks/useRipple";
import type { IconButtonProps } from "./IconButton.types";
import { mergeProps } from "@react-aria/utils";

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
      selected = false,
      disableRipple = false,
      className,
      // React Aria props
      isDisabled: propIsDisabled = false,
      onPress,
      onMouseDown,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
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
      isDisabled: isDisabled || disableRipple,
    });

    // Merge user's onMouseDown with ripple handler
    const mergedOnMouseDown = (e: React.MouseEvent<HTMLButtonElement>): void => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      onMouseDown?.(e);
      handleRipple(e);
    };

    const mergedPropsValue = mergeProps(props, {
      onPress,
      onMouseDown: mergedOnMouseDown,
      isDisabled,
    });

    return (
      <IconButtonHeadless
        ref={ref}
        className={cn(
          // Base classes
          "relative inline-flex items-center justify-center",
          "overflow-hidden rounded-full", // Circular shape
          "transition-all duration-200",
          "focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2",

          // State layers (hover, focus, active)
          "before:absolute before:inset-0 before:rounded-[inherit] before:transition-opacity before:duration-200",
          "before:bg-current before:opacity-0",
          "hover:before:opacity-8",
          "focus-visible:before:opacity-12",
          "active:before:opacity-12",

          // CVA variants
          iconButtonVariants({ variant, color, size, selected, isDisabled }),

          // User custom classes
          className
        )}
        aria-label={ariaLabel}
        selected={selected}
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

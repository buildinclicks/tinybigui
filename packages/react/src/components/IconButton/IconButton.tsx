"use client";

import { forwardRef } from "react";
import type React from "react";
import { IconButtonHeadless } from "./IconButtonHeadless";
import {
  iconButtonRootVariants,
  iconButtonStateLayerVariants,
  iconButtonIconVariants,
} from "./IconButton.variants";
import { cn } from "../../utils/cn";
import { useRipple } from "../../hooks/useRipple";
import { mergeProps } from "@react-aria/utils";
import { useOptionalButtonGroup } from "../ButtonGroup/ButtonGroupContext";
import { getConnectedRadiusClasses } from "../ButtonGroup/ButtonGroup.utils";
import type { IconButtonProps } from "./IconButton.types";

/**
 * Material Design 3 Expressive — IconButton Component (Layer 3: Styled)
 *
 * Built on React Aria for world-class accessibility. Implements the
 * Variants-vs-States architecture: all interaction/selection states are
 * expressed as data-* attributes (emitted by IconButtonHeadless) and consumed
 * by each slot via group-data-[x]/icon-button Tailwind selectors — no state
 * variants in CVA.
 *
 * Features:
 * - ✅ M3 Expressive 5-tier sizes: xsmall, small, medium, large, xlarge
 * - ✅ 3 width options: narrow, default, wide
 * - ✅ 2 shapes: round (circular), square (MD3 corner scale)
 * - ✅ Press shape-morph (round shape springs into square corner on press)
 * - ✅ 4 variants: standard, filled, tonal, outlined
 * - ✅ 4 color roles: primary, secondary, tertiary, error
 * - ✅ Toggle support (selected + selectedIcon)
 * - ✅ MD3-correct state layer: per-variant color, opacity-8/10/10
 * - ✅ MD3-correct disabled: content opacity-38 + container on-surface/12
 * - ✅ Ripple effect on press
 * - ✅ ButtonGroup-aware: connected corner radii + min-width
 * - ✅ Mandatory aria-label for accessibility
 *
 * @example
 * ```tsx
 * // Standard icon button
 * <IconButton aria-label="Delete">
 *   <IconDelete />
 * </IconButton>
 *
 * // Filled with color, large
 * <IconButton aria-label="Favorite" variant="filled" color="error" size="large">
 *   <IconHeart />
 * </IconButton>
 *
 * // Toggle button with selectedIcon
 * <IconButton
 *   aria-label={selected ? "Remove favorite" : "Add favorite"}
 *   selected={selected}
 *   onPress={() => setSelected(!selected)}
 *   selectedIcon={<IconStarFilled />}
 * >
 *   <IconStarOutline />
 * </IconButton>
 *
 * // Square shape, wide width
 * <IconButton aria-label="Menu" shape="square" width="wide" size="medium">
 *   <IconMenu />
 * </IconButton>
 * ```
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      // Variant props (CVA / design-time)
      variant = "standard",
      color = "primary",
      size = "medium",
      width = "default",
      shape = "round",
      // IconButton specific props
      children,
      selectedIcon,
      value,
      selected,
      disableRipple = false,
      className,
      // React Aria props
      isDisabled = false,
      onPress,
      onMouseDown,
      "aria-label": ariaLabel,
      title,
      ...props
    },
    ref
  ) => {
    // ButtonGroup context — null when rendered outside a group
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

    // Toggle behaviour: `selected` being defined (even as false) signals a toggle button
    const isToggle = selected !== undefined;
    const isSelected = isToggle ? (selected ?? false) : false;

    // Ripple effect
    const { onMouseDown: handleRipple, ripples } = useRipple({
      disabled: isDisabled || disableRipple,
    });

    const mergedOnMouseDown = (e: React.MouseEvent<HTMLButtonElement>): void => {
      onMouseDown?.(e);
      handleRipple(e);
    };

    const mergedPropsValue = mergeProps(props, {
      ...(onPress && { onPress }),
      onMouseDown: mergedOnMouseDown,
      isDisabled,
    });

    // ButtonGroup connected-variant radius + min-width overrides
    const isGroupSelected =
      isConnected && groupCtx && value ? groupCtx.selectedValues.has(value) : false;

    const connectedClasses =
      isConnected && groupCtx
        ? [
            ...getConnectedRadiusClasses(groupCtx, value),
            groupCtx.enforceMinWidth ? "min-w-12" : "",
          ]
        : [];

    // Determine which icon to render
    const iconNode = isToggle && isSelected && selectedIcon ? selectedIcon : children;

    return (
      <IconButtonHeadless
        ref={ref}
        className={cn(
          // Root CVA — sets CSS role variables, dimensions, shape, transitions
          iconButtonRootVariants({ variant, color, size, width, shape }),
          // Group scope for child slot selectors
          "group/icon-button",
          // ButtonGroup asymmetric border-radius easing (connected selection morph)
          isGroupSelected ? "btn-transition-selected" : "",
          // Connected group corner radius + min-width overrides
          ...connectedClasses,
          // Consumer custom classes
          className
        )}
        aria-label={ariaLabel}
        isSelected={isSelected}
        isToggle={isToggle}
        // Data attributes for external CSS targeting + Storybook/test assertions
        data-variant={variant}
        data-color={color}
        data-size={size}
        data-width={width}
        data-shape={shape}
        // ButtonGroup selection shape-morph targeting
        data-group-selected={isGroupSelected ? "" : undefined}
        {...(title && { title })}
        {...mergedPropsValue}
      >
        {/* State layer — hover/focus/pressed opacity ring */}
        <span className={iconButtonStateLayerVariants()} aria-hidden="true" data-state-layer="" />

        {/* Ripple effect */}
        {ripples}

        {/* Icon slot */}
        <span className={iconButtonIconVariants({ size })} data-icon-slot="" aria-hidden="true">
          {iconNode}
        </span>
      </IconButtonHeadless>
    );
  }
);

IconButton.displayName = "IconButton";

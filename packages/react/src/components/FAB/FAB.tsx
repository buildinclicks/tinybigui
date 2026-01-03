"use client";

import { forwardRef } from "react";
import type React from "react";
import { FABHeadless } from "./FABHeadless";
import { fabVariants, type FABVariants } from "./FAB.variants";
import { cn } from "../../utils/cn";
import { useRipple } from "../../hooks/useRipple";
import type { FABProps } from "./FAB.types";
import { mergeProps } from "@react-aria/utils";

/**
 * Loading spinner component
 */
const Spinner = (): React.ReactElement => (
  <svg
    role="progressbar"
    className="h-6 w-6 animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

/**
 * Material Design 3 FAB (Floating Action Button) Component
 *
 * High-emphasis button for primary screen action.
 * Supports 4 sizes: small, medium, large, extended
 * Implementation uses Tailwind CSS classes mapped to MD3 tokens.
 */
export const FAB = forwardRef<HTMLButtonElement, FABProps & Omit<FABVariants, "isDisabled">>(
  (
    {
      // Variant props (CVA)
      size = "medium",
      color = "primary",
      // FAB specific props
      icon,
      children,
      "aria-label": ariaLabel,
      loading = false,
      disableRipple = false,
      className,
      // React Aria props
      isDisabled: propIsDisabled = false,
      onPress,
      onMouseDown,
      title,
      ...props
    },
    ref
  ) => {
    // Development warnings
    if (process.env.NODE_ENV === "development") {
      if (!icon) {
        console.warn("[FAB] FAB must have an icon. Please provide the icon prop.");
      }

      if (size === "extended" && !children) {
        console.warn("[FAB] Extended FAB requires text label as children.");
      }

      if (size !== "extended" && children) {
        console.warn(
          "[FAB] Children (text) is only used for extended FAB. For icon-only FAB, use icon prop only."
        );
      }
    }

    // Combine disabled states
    const isDisabled = propIsDisabled || loading;

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

    return (
      <FABHeadless
        ref={ref}
        className={cn(
          // Base classes
          "relative inline-flex items-center justify-center",
          "overflow-hidden transition-all duration-200",
          "focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2",
          "shrink-0",

          // State layers (hover, focus, active)
          "before:absolute before:inset-0 before:rounded-[inherit] before:transition-opacity before:duration-200",
          "before:bg-current before:opacity-0",
          "hover:before:opacity-8",
          "focus-visible:before:opacity-12",
          "active:before:opacity-12",

          // Elevation
          "shadow-elevation-3 hover:shadow-elevation-4",

          // CVA variants
          fabVariants({ size, color, isDisabled }),

          // User custom classes
          className
        )}
        aria-label={ariaLabel}
        {...(title && { title })}
        {...mergedPropsValue}
      >
        {/* Ripple effect */}
        {ripples}

        {/* Icon (hidden when loading) */}
        {icon && (
          <span className={cn("relative z-10 inline-flex shrink-0", loading && "invisible")}>
            {icon}
          </span>
        )}

        {/* Loading spinner (shown when loading, overlays icon position) */}
        {loading && (
          <span className="relative z-10">
            <Spinner />
          </span>
        )}

        {/* Text label (extended FAB only) */}
        {size === "extended" && children && (
          <span className="relative z-10 inline-flex items-center text-sm font-medium tracking-[0.1px]">
            {children}
          </span>
        )}
      </FABHeadless>
    );
  }
);

FAB.displayName = "FAB";

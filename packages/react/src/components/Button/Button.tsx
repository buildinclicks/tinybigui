"use client";

import { forwardRef } from "react";
import type React from "react";
import { ButtonHeadless } from "./ButtonHeadless";
import { buttonVariants, type ButtonVariants } from "./Button.variants";
import { cn } from "../../utils/cn";
import { useRipple } from "../../hooks/useRipple";
import type { ButtonProps } from "./Button.types";

/**
 * Loading spinner component
 */
const Spinner = (): React.ReactElement => (
  <svg
    role="progressbar"
    aria-label="Loading"
    className="h-4 w-4 animate-spin"
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
 * Material Design 3 Button Component (Layer 3: Styled)
 *
 * Built on React Aria for world-class accessibility.
 * Uses CVA for type-safe variant management.
 * Styled with Tailwind CSS using MD3 design tokens.
 *
 * Features:
 * - ✅ 5 MD3 variants: filled, outlined, tonal, elevated, text
 * - ✅ 4 color schemes: primary, secondary, tertiary, error
 * - ✅ 3 sizes: small, medium, large
 * - ✅ Loading state with spinner
 * - ✅ Ripple effect (Material Design)
 * - ✅ Full keyboard accessibility (via React Aria)
 * - ✅ Screen reader support (via React Aria)
 * - ✅ Focus management (via React Aria)
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Button>Click me</Button>
 *
 * // With variant and color
 * <Button variant="outlined" color="secondary">
 *   Secondary Action
 * </Button>
 *
 * // With icon
 * <Button icon={<IconAdd />}>
 *   Add Item
 * </Button>
 *
 * // Loading state
 * <Button loading>
 *   Saving...
 * </Button>
 *
 * // Disabled
 * <Button isDisabled>
 *   Disabled
 * </Button>
 *
 * // Full width
 * <Button fullWidth>
 *   Full Width Button
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps & Omit<ButtonVariants, "disabled">>(
  (
    {
      // Variant props (CVA)
      variant = "filled",
      color = "primary",
      size = "medium",
      fullWidth = false,

      // Content props
      icon,
      trailingIcon,
      children,

      // State props
      loading = false,
      disableRipple = false,
      isDisabled = false,

      // Styling
      className,

      // Other props
      tabIndex = 0,
      type = "button",
      onPress,
      ...props
    },
    ref
  ) => {
    // Development warnings
    if (process.env.NODE_ENV === "development") {
      if (!children) {
        console.warn(
          "[Button] Button should have text content. Use IconButton for icon-only buttons."
        );
      }

      if (icon && trailingIcon) {
        console.warn("[Button] Button should have either icon or trailingIcon, not both.");
      }
    }

    // Combine disabled states
    const isButtonDisabled = isDisabled || loading;

    // Ripple effect
    const { onMouseDown: handleRipple, ripples } = useRipple({
      disabled: isButtonDisabled || disableRipple,
    });

    // Handle press event (React Aria uses onPress instead of onClick)
    // Note: onPress is already handled by React Aria in ButtonHeadless
    // We just pass it through

    return (
      <ButtonHeadless
        {...props}
        ref={ref}
        type={type}
        isDisabled={isButtonDisabled}
        {...(onPress && { onPress })}
        tabIndex={tabIndex}
        onMouseDown={handleRipple}
        className={cn(
          // Apply CVA variants
          buttonVariants({
            variant,
            color,
            size,
            fullWidth,
            disabled: isButtonDisabled,
            loading,
          }),
          // User custom classes
          className
        )}
      >
        {/* Ripple effect */}
        {ripples}

        {/* Leading icon (hidden when loading) */}
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

        {/* Content */}
        <span className="relative z-10 inline-flex items-center">{children}</span>

        {/* Trailing icon (hidden when loading) */}
        {trailingIcon && (
          <span className={cn("relative z-10 inline-flex shrink-0", loading && "invisible")}>
            {trailingIcon}
          </span>
        )}
      </ButtonHeadless>
    );
  }
);

Button.displayName = "Button";

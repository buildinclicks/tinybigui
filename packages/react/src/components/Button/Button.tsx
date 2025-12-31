import { forwardRef } from "react";
import type React from "react";
import { cn } from "../../utils/cn";
import { useRipple } from "../../hooks/useRipple";
import type { ButtonProps, ButtonVariant, ButtonColor, ButtonSize } from "./Button.types";

/**
 * Tailwind classes for button variants
 */
const variantClasses: Record<ButtonVariant, Record<ButtonColor, string>> = {
  filled: {
    primary: "bg-primary text-on-primary shadow-none",
    secondary: "bg-secondary text-on-secondary shadow-none",
    tertiary: "bg-tertiary text-on-tertiary shadow-none",
    error: "bg-error text-on-error shadow-none",
  },
  outlined: {
    primary: "bg-transparent border border-outline text-primary",
    secondary: "bg-transparent border border-outline text-secondary",
    tertiary: "bg-transparent border border-outline text-tertiary",
    error: "bg-transparent border border-outline text-error",
  },
  tonal: {
    primary: "bg-secondary-container text-on-secondary-container",
    secondary: "bg-secondary-container text-on-secondary-container",
    tertiary: "bg-tertiary-container text-on-tertiary-container",
    error: "bg-error-container text-on-error-container",
  },
  elevated: {
    primary: "bg-surface-container-low text-primary shadow-elevation-1",
    secondary: "bg-surface-container-low text-secondary shadow-elevation-1",
    tertiary: "bg-surface-container-low text-tertiary shadow-elevation-1",
    error: "bg-surface-container-low text-error shadow-elevation-1",
  },
  text: {
    primary: "bg-transparent text-primary",
    secondary: "bg-transparent text-secondary",
    tertiary: "bg-transparent text-tertiary",
    error: "bg-transparent text-error",
  },
};

/**
 * Tailwind classes for button sizes
 */
const sizeClasses: Record<ButtonSize, string> = {
  small: "h-8 px-4 text-sm gap-2",
  medium: "h-10 px-6 text-sm gap-2",
  large: "h-12 px-8 text-base gap-3",
};

/**
 * Loading spinner component
 */
const Spinner = (): React.ReactElement => (
  <svg
    role="progressbar"
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
 * Material Design 3 Button Component
 *
 * Supports 5 variants: filled, outlined, tonal, elevated, text
 * Implementation uses Tailwind CSS classes mapped to MD3 tokens.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "filled",
      color = "primary",
      size = "medium",
      icon,
      trailingIcon,
      children,
      fullWidth = false,
      loading = false,
      disableRipple = false,
      disabled = false,
      className,
      type = "button",
      onClick,
      tabIndex = 0,
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
    const isDisabled = disabled || loading;

    // Ripple effect
    const { onMouseDown: handleRipple, ripples } = useRipple({
      disabled: isDisabled || disableRipple,
    });

    // Handle click
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    return (
      <button
        ref={ref}
        // eslint-disable-next-line react/button-has-type
        type={type}
        disabled={isDisabled}
        onClick={handleClick}
        onMouseDown={handleRipple}
        tabIndex={tabIndex}
        className={cn(
          // Base classes
          "relative inline-flex items-center justify-center",
          "overflow-hidden rounded-full font-medium",
          "transition-all duration-200",
          "focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2",

          // State layers (hover, focus, active)
          "before:absolute before:inset-0 before:rounded-[inherit] before:transition-opacity before:duration-200",
          "before:bg-current before:opacity-0",
          "hover:before:opacity-8",
          "focus-visible:before:opacity-12",
          "active:before:opacity-12",

          // Size classes
          sizeClasses[size],

          // Variant + color classes
          variantClasses[variant][color],

          // State classes
          isDisabled && "pointer-events-none opacity-38",
          loading && "cursor-wait",

          // Full width
          fullWidth && "w-full",

          // User custom classes
          className
        )}
        {...props}
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
      </button>
    );
  }
);

Button.displayName = "Button";

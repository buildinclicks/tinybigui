"use client";

import { forwardRef, useRef, useState, useCallback } from "react";
import type React from "react";
import { useHover, useFocusRing, mergeProps } from "react-aria";
import { ButtonHeadless } from "./ButtonHeadless";
import {
  buttonVariants,
  buttonStateLayerVariants,
  buttonFocusRingVariants,
  buttonIconVariants,
  buttonLabelVariants,
  type ButtonVariants,
} from "./Button.variants";
import { cn } from "../../utils/cn";
import { getInteractionDataAttributes } from "../../utils/interactionStates";
import { useRipple } from "../../hooks/useRipple";
import { useOptionalButtonGroup } from "../ButtonGroup/ButtonGroupContext";
import { getConnectedRadiusClasses } from "../ButtonGroup/ButtonGroup.utils";
import type { ButtonProps } from "./Button.types";

/**
 * Loading spinner component
 */
const Spinner = (): React.ReactElement => (
  <svg
    role="progressbar"
    aria-label="Loading"
    className="relative z-10 h-[18px] w-[18px] animate-spin"
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
 * Implements the Variants-vs-States architecture: all interaction states are
 * expressed as data-* attributes on the root and consumed by each slot via
 * group-data-[x]/button Tailwind selectors — no state variants in CVA.
 *
 * Features:
 * - ✅ 5 MD3 variants: filled, outlined, tonal, elevated, text
 * - ✅ 3 sizes: small (32dp), medium (40dp), large (56dp)
 * - ✅ Loading state with spinner
 * - ✅ Ripple effect (Material Design)
 * - ✅ Proper MD3 state layer (hover 8%, focus 10%, pressed 10%)
 * - ✅ Full keyboard accessibility (via React Aria)
 * - ✅ Screen reader support (via React Aria)
 * - ✅ Focus management (via React Aria)
 * - ✅ ButtonGroup-aware: applies connected corner radii and min-width when inside a group
 *
 * MD3 Specifications:
 * - Height: 40dp (medium), 32dp (small), 56dp (large)
 * - Typography: Label Large (medium), Label Medium (small), Title Medium (large)
 * - Icon size: 18px × 18px (per MD3 spec)
 * - State layers: 8% hover, 10% focus/pressed
 * - Elevation: Level 1 on hover (filled), Level 1 base → Level 2 hover (elevated)
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Button>Click me</Button>
 *
 * // With variant
 * <Button variant="outlined">Secondary Action</Button>
 *
 * // With icon (MD3 spec: icons are 18px × 18px)
 * <Button icon={<IconAdd className="h-[18px] w-[18px]" />}>
 *   Add Item
 * </Button>
 *
 * // Loading state
 * <Button loading>Saving...</Button>
 *
 * // Disabled
 * <Button isDisabled>Disabled</Button>
 *
 * // Full width
 * <Button fullWidth>Full Width Button</Button>
 *
 * // Inside a connected ButtonGroup
 * <ButtonGroup variant="connected" selectionMode="required" defaultValue="md">
 *   <Button value="sm">S</Button>
 *   <Button value="md">M</Button>
 *   <Button value="lg">L</Button>
 * </ButtonGroup>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps & Omit<ButtonVariants, never>>(
  (
    {
      // Variant props (CVA)
      variant = "filled",
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

      // Other button props
      tabIndex = 0,
      type = "button",

      // Passed through to ButtonHeadless → useButton
      ...props
    },
    ref
  ) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const resolvedRef = (ref ?? buttonRef) as React.RefObject<HTMLButtonElement>;

    // ButtonGroup context — null when rendered outside a group
    const groupCtx = useOptionalButtonGroup();
    const isConnected = groupCtx?.variant === "connected";

    // Combined disabled state (loading also disables)
    const isButtonDisabled = isDisabled || loading;

    // ── Interaction state tracking ───────────────────────────────────────────
    // isPressed is tracked via onPressStart/onPressEnd forwarded to useButton,
    // which avoids competing with ButtonHeadless's own useButton press handling.
    const [isPressed, setIsPressed] = useState(false);
    const handlePressStart = useCallback(() => setIsPressed(true), []);
    const handlePressEnd = useCallback(() => setIsPressed(false), []);

    const { isHovered, hoverProps } = useHover({ isDisabled: isButtonDisabled });
    const { isFocusVisible, focusProps } = useFocusRing();

    // Ripple effect
    const { onMouseDown: handleRipple, ripples } = useRipple({
      disabled: isButtonDisabled || disableRipple,
    });

    // Connected group radius + min-width overrides
    const buttonValue = (props as { value?: string | undefined }).value;
    const isGroupSelected =
      isConnected && groupCtx && buttonValue ? groupCtx.selectedValues.has(buttonValue) : false;

    const connectedClasses =
      isConnected && groupCtx
        ? [
            ...getConnectedRadiusClasses(groupCtx, buttonValue),
            groupCtx.enforceMinWidth ? "min-w-12" : "",
          ]
        : [];

    const hasIcon = !!icon || !!trailingIcon;

    if (process.env.NODE_ENV === "development") {
      if (!children) {
        console.warn(
          "[Button] Button should have text content. Use IconButton for icon-only buttons."
        );
      }
    }

    return (
      <ButtonHeadless
        {...mergeProps(
          hoverProps,
          focusProps,
          // Track pressed state via useButton's press lifecycle callbacks,
          // rather than a separate usePress hook, to avoid event handler conflicts.
          { onPressStart: handlePressStart, onPressEnd: handlePressEnd },
          props
        )}
        ref={resolvedRef}
        type={type}
        isDisabled={isButtonDisabled}
        tabIndex={tabIndex}
        onMouseDown={handleRipple}
        // ── Interaction data attributes ──────────────────────────────────────
        {...getInteractionDataAttributes({
          isHovered,
          isFocusVisible,
          isPressed,
          isDisabled: isButtonDisabled,
        })}
        // ── Content flags ────────────────────────────────────────────────────
        data-variant={variant}
        data-with-icon={hasIcon ? "" : undefined}
        data-loading={loading ? "" : undefined}
        // ── Connected group selection state ──────────────────────────────────
        // Used to switch border-radius easing: expressive (select) vs decelerate (deselect).
        // btn-transition-selected overrides --_btn-radius-easing to the bouncy spring only
        // while the button is gaining the pill shape; removal restores safe decelerate easing
        // for the pill→inner-radius return, eliminating the overshoot-to-0px flicker.
        data-group-selected={isGroupSelected ? "" : undefined}
        className={cn(
          buttonVariants({ variant, size, fullWidth }),
          // group/button: enables group-data-[x]/button child selectors in all slots
          // (added here, not in CVA, following the Switch pattern)
          "group/button",
          // Asymmetric border-radius easing: expressive when selected, decelerate when not
          isGroupSelected ? "btn-transition-selected" : "",
          // Connected group overrides: inner radius + start/end outer radius + min-width
          ...connectedClasses,
          // User custom classes
          className
        )}
      >
        {/* Ripple effect */}
        {ripples}

        {/* State layer — absolute overlay that transitions opacity on interaction */}
        <span className={cn(buttonStateLayerVariants({ variant }))} aria-hidden="true" />

        {/* Focus ring — absolute overlay rendered above state layer */}
        <span className={cn(buttonFocusRingVariants())} aria-hidden="true" />

        {/* Leading icon (invisible, not hidden, when loading so layout is stable) */}
        {icon && <span className={cn(buttonIconVariants({ hidden: loading }))}>{icon}</span>}

        {/* Loading spinner (replaces icon position) */}
        {loading && <Spinner />}

        {/* Label */}
        <span className={cn(buttonLabelVariants())}>{children}</span>

        {/* Trailing icon (invisible when loading) */}
        {trailingIcon && (
          <span className={cn(buttonIconVariants({ hidden: loading }))}>{trailingIcon}</span>
        )}
      </ButtonHeadless>
    );
  }
);

Button.displayName = "Button";

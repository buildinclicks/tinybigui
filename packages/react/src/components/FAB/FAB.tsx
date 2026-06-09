"use client";

import { forwardRef, useRef, useState, useCallback } from "react";
import type React from "react";
import { useHover, useFocusRing, mergeProps } from "react-aria";
import { FABHeadless } from "./FABHeadless";
import {
  fabVariants,
  fabStateLayerVariants,
  fabFocusRingVariants,
  fabIconVariants,
  fabLabelVariants,
  type FABVariants,
} from "./FAB.variants";
import { cn } from "../../utils/cn";
import { getInteractionDataAttributes } from "../../utils/interactionStates";
import { useRipple } from "../../hooks/useRipple";
import type { FABProps } from "./FAB.types";

/**
 * Loading spinner — matches Button's Spinner for consistency.
 */
const Spinner = (): React.ReactElement => (
  <svg
    role="progressbar"
    aria-label="Loading"
    className="relative z-10 animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    // Spinner matches the icon slot width/height via inherited size from parent span
    width="1em"
    height="1em"
    style={{ fontSize: "inherit" }}
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
 * Material Design 3 FAB (Floating Action Button) — M3 Expressive
 *
 * High-emphasis button for the primary screen action.
 * Implements the Variants-vs-States architecture: all interaction states are
 * expressed as data-* attributes on the root and consumed by each slot via
 * group-data-[x]/fab Tailwind selectors — no state variants in CVA.
 *
 * Features:
 * - ✅ MD3 Expressive size scale: fab (56dp), medium (80dp), large (96dp), extended, small (dep)
 * - ✅ Container + solid color styles (primary-container, primary, secondary*, tertiary*)
 * - ✅ Elevation 3 base → 4 hover → 3 focus/pressed per MD3 spec
 * - ✅ State-layer color = icon/on-color per MD3 spec
 * - ✅ Correct state-layer opacities: hover 8% / focus 10% / pressed 10%
 * - ✅ Dedicated focus ring slot (inset-[-3px], keyboard-only)
 * - ✅ Loading state with spinner
 * - ✅ Ripple effect (Material Design)
 * - ✅ Full keyboard accessibility via React Aria
 *
 * @example
 * ```tsx
 * // Default FAB (56dp, primary-container)
 * <FAB aria-label="Create" icon={<IconAdd />} />
 *
 * // Medium FAB (80dp, M3 Expressive)
 * <FAB aria-label="Create" icon={<IconAdd />} size="medium" />
 *
 * // Solid primary color (M3 Expressive)
 * <FAB aria-label="Add" icon={<IconAdd />} color="primary" />
 *
 * // Extended FAB with text
 * <FAB aria-label="Create document" icon={<IconAdd />} size="extended">
 *   Create
 * </FAB>
 * ```
 */
export const FAB = forwardRef<HTMLButtonElement, FABProps & Omit<FABVariants, never>>(
  (
    {
      // Variant props
      size = "fab",
      color = "primary-container",

      // Content
      icon,
      children,

      // State
      loading = false,
      disableRipple = false,
      isDisabled = false,

      // Styling
      className,

      // Accessibility
      "aria-label": ariaLabel,
      title,

      // Passthrough — forwarded to FABHeadless
      tabIndex = 0,
      type = "button",

      // Passed through to FABHeadless → useButton
      ...props
    },
    ref
  ) => {
    const fabRef = useRef<HTMLButtonElement>(null);
    const resolvedRef = (ref ?? fabRef) as React.RefObject<HTMLButtonElement>;

    const isFABDisabled = isDisabled || loading;

    // ── Interaction state tracking ──────────────────────────────────────────
    const [isPressed, setIsPressed] = useState(false);
    const handlePressStart = useCallback(() => setIsPressed(true), []);
    const handlePressEnd = useCallback(() => setIsPressed(false), []);

    const { isHovered, hoverProps } = useHover({ isDisabled: isFABDisabled });
    const { isFocusVisible, focusProps } = useFocusRing();

    // Ripple effect
    const { onMouseDown: handleRipple, ripples } = useRipple({
      disabled: isFABDisabled || disableRipple,
    });

    // ── Development warnings ─────────────────────────────────────────────────
    if (process.env.NODE_ENV === "development") {
      if (!icon) {
        console.warn("[FAB] FAB must have an icon. Please provide the `icon` prop.");
      }
      if (size === "extended" && !children) {
        console.warn("[FAB] Extended FAB requires a text label as `children`.");
      }
      if (size !== "extended" && children) {
        console.warn(
          "[FAB] `children` (text label) is only rendered for `size='extended'`. For icon-only FABs, use the `icon` prop only."
        );
      }
      // Deprecation warnings
      if (size === "small") {
        console.warn(
          "[FAB] `size='small'` is deprecated in M3 Expressive. Use `size='fab'` (56dp) instead."
        );
      }
      if (color === "surface") {
        console.warn(
          "[FAB] `color='surface'` is deprecated in M3 Expressive. Use `color='primary-container'` instead."
        );
      }
    }

    return (
      <FABHeadless
        {...mergeProps(
          hoverProps,
          focusProps,
          { onPressStart: handlePressStart, onPressEnd: handlePressEnd },
          props
        )}
        ref={resolvedRef}
        type={type}
        isDisabled={isFABDisabled}
        tabIndex={tabIndex}
        onMouseDown={handleRipple}
        aria-label={ariaLabel}
        {...(title !== undefined && { title })}
        // ── Interaction data attributes ─────────────────────────────────────
        {...getInteractionDataAttributes({
          isHovered,
          isFocusVisible,
          isPressed,
          isDisabled: isFABDisabled,
        })}
        // ── Content flags ───────────────────────────────────────────────────
        data-with-icon={icon ? "" : undefined}
        data-loading={loading ? "" : undefined}
        className={cn(
          fabVariants({ size, color }),
          // group/fab: enables group-data-[x]/fab child selectors in all slots
          "group/fab",
          className
        )}
      >
        {/* Ripple effect */}
        {ripples}

        {/* State layer — absolute overlay; transitions opacity on interaction */}
        <span className={cn(fabStateLayerVariants({ color }))} aria-hidden="true" />

        {/* Focus ring — absolute, extends 3px outside boundary; keyboard-only */}
        <span className={cn(fabFocusRingVariants())} aria-hidden="true" />

        {/* Icon — invisible (not hidden) when loading so layout stays stable */}
        {icon && <span className={cn(fabIconVariants({ size, hidden: loading }))}>{icon}</span>}

        {/* Loading spinner — overlays icon position */}
        {loading && (
          <span className={cn(fabIconVariants({ size }))}>
            <Spinner />
          </span>
        )}

        {/* Text label — extended FAB only */}
        {size === "extended" && children && (
          <span className={cn(fabLabelVariants())}>{children}</span>
        )}
      </FABHeadless>
    );
  }
);

FAB.displayName = "FAB";

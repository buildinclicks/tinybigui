"use client";

import { forwardRef, useRef, useState, useCallback } from "react";
import type React from "react";
import { useHover, useFocusRing, useButton, mergeProps } from "react-aria";

import { cn } from "../../utils/cn";
import { getInteractionDataAttributes } from "../../utils/interactionStates";
import { useRipple } from "../../hooks/useRipple";
import { useFABMenuContext } from "./FABMenuHeadless";
import {
  fabMenuItemVariants,
  fabMenuItemStateLayerVariants,
  fabMenuItemFocusRingVariants,
  fabMenuItemIconVariants,
  fabMenuItemLabelVariants,
} from "./FABMenu.variants";
import type { FABMenuItemProps } from "./FABMenu.types";

/**
 * FABMenuItem — MD3 Expressive FAB Menu action item (Layer 3).
 *
 * Renders as a full-rounded 56dp pill button with a leading icon and an
 * inline text label. Implements the Variants-vs-States architecture:
 * all interaction states are expressed as data-* attributes on the root
 * and consumed by each slot via group-data-[x]/fab-menu-item selectors.
 *
 * Features:
 * - ✅ MD3 Expressive pill shape (56dp height, full-rounded)
 * - ✅ 6 color roles: 3 container + 3 solid (M3 Expressive)
 * - ✅ Elevation 3 base → 4 hover → 3 focus/pressed per MD3 spec
 * - ✅ Correct state-layer opacities: hover 8% / focus 10% / pressed 10%
 * - ✅ Dedicated focus ring slot (inset-[-3px], keyboard-only)
 * - ✅ Ripple effect (Material Design)
 * - ✅ Stagger enter/exit animation (animate-md-scale-in/out), reduce-motion guarded
 * - ✅ Full keyboard accessibility via React Aria
 *
 * @example
 * ```tsx
 * <FABMenuItem
 *   icon={<IconEdit />}
 *   label="Edit"
 *   onPress={() => handleEdit()}
 * />
 *
 * // Solid color role
 * <FABMenuItem icon={<IconAdd />} label="Add" color="primary" />
 * ```
 */
export const FABMenuItem = forwardRef<HTMLButtonElement, FABMenuItemProps & { index?: number }>(
  (
    {
      icon,
      label,
      "aria-label": ariaLabel,
      onPress,
      color = "primary-container",
      isDisabled = false,
      className,
      index = 0,
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    const buttonRef = (forwardedRef ?? internalRef) as React.RefObject<HTMLButtonElement>;

    const { isOpen, isExiting, reducedMotion, itemCount, direction } = useFABMenuContext();

    // ── Development warnings ───────────────────────────────────────────────
    if (process.env.NODE_ENV === "development") {
      if (!label && !ariaLabel) {
        console.warn(
          "[FABMenuItem] Either `label` or `aria-label` must be provided for accessibility."
        );
      }
    }

    // ── Interaction state tracking ─────────────────────────────────────────
    const [isPressed, setIsPressed] = useState(false);
    const handlePressStart = useCallback(() => setIsPressed(true), []);
    const handlePressEnd = useCallback(() => setIsPressed(false), []);

    const { isHovered, hoverProps } = useHover({ isDisabled });
    const { isFocusVisible, focusProps } = useFocusRing();

    // useButton: provides keyboard/pointer interaction handling for accessibility
    const { buttonProps } = useButton(
      {
        ...(onPress ? { onPress } : {}),
        isDisabled,
        onPressStart: handlePressStart,
        onPressEnd: handlePressEnd,
        ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
        elementType: "button",
      },
      buttonRef
    );

    const { onMouseDown: handleRipple, ripples } = useRipple({ disabled: isDisabled });

    // ── Stagger animation ──────────────────────────────────────────────────
    // Entry: stagger forward (0ms, 30ms, 60ms…)
    // Exit: stagger in reverse so the last item exits first
    const staggerDelay = reducedMotion
      ? 0
      : isExiting
        ? Math.max(0, itemCount - 1 - index) * 30
        : index * 30;

    // Transform-origin matches the list overlay direction so items scale in/out
    // from the FAB edge rather than the item's own center.
    const DIRECTION_ORIGIN: Record<string, string> = {
      up: "origin-bottom",
      down: "origin-top",
      left: "origin-right",
      right: "origin-left",
    };
    const originClass = reducedMotion ? undefined : DIRECTION_ORIGIN[direction];

    const animationClass = reducedMotion
      ? undefined
      : isOpen
        ? "animate-md-scale-in"
        : isExiting
          ? "animate-md-scale-out"
          : undefined;

    // Merge React Aria button props with hover + focus props
    const mergedButtonProps = mergeProps(buttonProps, hoverProps, focusProps, {
      onMouseDown: handleRipple,
    });

    // Strip React Aria-specific props from the merged result before putting on DOM
    const {
      isDisabled: _isDisabled,
      onPress: _onPress,
      onPressStart: _onPressStart,
      onPressEnd: _onPressEnd,
      onPressChange: _onPressChange,
      onPressUp: _onPressUp,
      ...htmlButtonProps
    } = mergedButtonProps as unknown as Record<string, unknown>;

    void _isDisabled;
    void _onPress;
    void _onPressStart;
    void _onPressEnd;
    void _onPressChange;
    void _onPressUp;

    return (
      <button
        {...(htmlButtonProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        ref={buttonRef}
        type="button"
        // ── Interaction data attributes ──────────────────────────────────────
        {...getInteractionDataAttributes({
          isHovered,
          isFocusVisible,
          isPressed,
          isDisabled,
        })}
        // ── Content flags ────────────────────────────────────────────────────
        data-with-icon={icon ? "" : undefined}
        data-with-label={label ? "" : undefined}
        className={cn(
          fabMenuItemVariants({ color }),
          // group/fab-menu-item: enables group-data-[x]/fab-menu-item child selectors in all slots
          "group/fab-menu-item",
          // Scale pivot toward the FAB so items appear to emanate from the trigger
          originClass,
          // Stagger animation class (animate-md-scale-in / animate-md-scale-out)
          animationClass,
          className
        )}
        style={staggerDelay > 0 ? { animationDelay: `${staggerDelay}ms` } : undefined}
      >
        {/* Ripple effect */}
        {ripples}

        {/* State layer — absolute overlay that transitions opacity on interaction */}
        <span
          className={cn(fabMenuItemStateLayerVariants({ color }))}
          data-state-layer
          aria-hidden="true"
        />

        {/* Focus ring — absolute, extends 3px outside boundary; keyboard-only */}
        <span className={cn(fabMenuItemFocusRingVariants())} aria-hidden="true" />

        {/* Leading icon */}
        {icon && (
          <span className={cn(fabMenuItemIconVariants())} aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Inline label */}
        {label && <span className={cn(fabMenuItemLabelVariants())}>{label}</span>}
      </button>
    );
  }
);

FABMenuItem.displayName = "FABMenuItem";

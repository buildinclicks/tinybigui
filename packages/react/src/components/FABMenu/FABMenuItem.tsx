"use client";

import { forwardRef, useRef } from "react";
import type React from "react";
import { useButton } from "react-aria";
import { mergeProps } from "@react-aria/utils";

import { cn } from "../../utils/cn";
import { useRipple } from "../../hooks/useRipple";
import { useFABMenuContext } from "./FABMenuHeadless";
import type { FABMenuItemProps } from "./FABMenu.types";

/**
 * FABMenuItem — Individual action item rendered as a mini FAB (40dp) with
 * optional label chip. Consumes FABMenuContext for open state and direction.
 *
 * Applies stagger animation via `animation-delay` based on `index` prop
 * (provided by the parent FABMenu). Skips animations when `reducedMotion`
 * is active.
 *
 * @example
 * ```tsx
 * <FABMenuItem
 *   icon={<IconEdit />}
 *   label="Edit"
 *   aria-label="Edit item"
 *   onPress={() => handleEdit()}
 *   index={0}
 * />
 * ```
 */
export const FABMenuItem = forwardRef<HTMLButtonElement, FABMenuItemProps & { index?: number }>(
  (
    { icon, label, onPress, "aria-label": ariaLabel, isDisabled = false, className, index = 0 },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    const buttonRef = (forwardedRef ?? internalRef) as React.RefObject<HTMLButtonElement>;

    const { isOpen, isExiting, direction, reducedMotion, itemCount } = useFABMenuContext();

    const { buttonProps } = useButton(
      {
        ...(onPress && { onPress }),
        "aria-label": ariaLabel,
        isDisabled,
      },
      buttonRef
    );

    const { onMouseDown: handleRipple, ripples } = useRipple({
      disabled: isDisabled,
    });

    const mergedProps = mergeProps(buttonProps, {
      type: "button" as const,
      onMouseDown: handleRipple,
    });

    // Entry: stagger forward (0ms, 30ms, 60ms…)
    // Exit: stagger in reverse so the last item exits first
    const staggerDelay = reducedMotion
      ? 0
      : isExiting
        ? Math.max(0, itemCount - 1 - index) * 30
        : index * 30;

    const animationClass = reducedMotion
      ? undefined
      : isOpen
        ? "animate-md-scale-in"
        : isExiting
          ? "animate-md-scale-out"
          : undefined;

    const labelPosition = direction === "right" ? "after" : "before";

    const labelChip = label ? (
      <span className="bg-surface-container text-label-large text-on-surface shadow-elevation-1 rounded-full px-3 py-1">
        {label}
      </span>
    ) : null;

    // Keep item visible (opacity-100) during exit animation; hide only when fully closed.
    const isVisible = isOpen || isExiting;

    return (
      <div
        className={cn(
          "relative flex cursor-pointer items-center gap-3",
          isVisible ? "opacity-100" : "opacity-0",
          isOpen ? "pointer-events-auto" : "pointer-events-none",
          className
        )}
      >
        {labelPosition === "before" && labelChip}

        {/* eslint-disable-next-line react/button-has-type -- type is set via mergeProps */}
        <button
          {...mergedProps}
          ref={buttonRef}
          className={cn(
            "relative flex size-10 items-center justify-center overflow-hidden rounded-xl",
            "bg-primary-container text-on-primary-container shadow-elevation-3",
            animationClass
          )}
          style={staggerDelay > 0 ? { animationDelay: `${staggerDelay}ms` } : undefined}
        >
          {/* State layer */}
          <span
            data-state-layer
            className="bg-on-primary-container duration-spring-standard-fast-effects ease-spring-standard-fast-effects pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity hover:opacity-8"
          />

          {/* Ripple */}
          {ripples}

          {/* Icon */}
          <span className="relative z-10 inline-flex shrink-0">{icon}</span>
        </button>

        {labelPosition === "after" && labelChip}
      </div>
    );
  }
);

FABMenuItem.displayName = "FABMenuItem";

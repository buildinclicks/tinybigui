"use client";

import { forwardRef, useRef } from "react";
import { useButton } from "react-aria";
import { mergeProps } from "@react-aria/utils";

import { cn } from "../../utils/cn";
import { useRipple } from "../../hooks/useRipple";
import { useFABMenuContext } from "./FABMenuHeadless";
import { fabMenuItemVariants } from "./FABMenu.variants";
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

    const { isOpen, direction, reducedMotion } = useFABMenuContext();

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

    const staggerDelay = index * 30;

    const animationClass = reducedMotion
      ? undefined
      : isOpen
        ? "animate-md-scale-in"
        : "animate-md-scale-out";

    const labelPosition = direction === "right" ? "after" : "before";

    const labelChip = label ? (
      <span className="bg-surface-container text-label-large text-on-surface shadow-elevation-1 rounded-full px-3 py-1">
        {label}
      </span>
    ) : null;

    return (
      <div
        className={cn(fabMenuItemVariants({ isOpen }), className)}
        style={reducedMotion ? undefined : { animationDelay: `${staggerDelay}ms` }}
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
          style={reducedMotion ? undefined : { animationDelay: `${staggerDelay}ms` }}
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

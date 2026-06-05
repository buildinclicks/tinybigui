"use client";

import { forwardRef, useRef } from "react";
import type React from "react";
import { useSwitch, useFocusRing, useHover, mergeProps, VisuallyHidden } from "react-aria";
import { useToggleState } from "react-stately";
import { cn } from "../../utils/cn";
import { getInteractionDataAttributes } from "../../utils/interactionStates";
import { useRipple } from "../../hooks/useRipple";
import {
  switchRootVariants,
  switchTrackVariants,
  switchFocusRingVariants,
  switchHandleContainerVariants,
  switchStateLayerVariants,
  switchHandleVariants,
  switchIconVariants,
  switchLabelVariants,
} from "./Switch.variants";
import type { SwitchProps } from "./Switch.types";

/**
 * Material Design 3 Switch Component (Layer 3: Styled)
 *
 * Built on React Aria for world-class accessibility.
 * Implements the Variants-vs-States architecture: all interaction/selection
 * states are expressed as data-* attributes on the root and consumed by each
 * slot via group-data-[x]/switch Tailwind selectors — no state variants in CVA.
 *
 * Features:
 * - ✅ 2 states: on/off (not selection like checkbox)
 * - ✅ Optional icons in handle
 * - ✅ Ripple effect (Material Design)
 * - ✅ Full keyboard accessibility (via React Aria)
 * - ✅ Screen reader support (via React Aria)
 * - ✅ Focus management (via React Aria)
 * - ✅ Form integration (name, value props)
 *
 * MD3 Specifications:
 * - Track: 52×32dp (border-radius 16dp)
 * - Handle: 16dp (unselected) | 24dp (selected / with-icon) | 28dp (pressed)
 * - State-layer container: 40dp centered on handle
 * - State-layer opacities: hover 8% | focus 10% | pressed 10%
 * - Disabled: container 12% | content 38% opacity
 * - Label spacing: 16px (ml-4)
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Switch>Low power mode</Switch>
 *
 * // Controlled
 * <Switch isSelected={isOn} onChange={setIsOn}>
 *   Notifications
 * </Switch>
 *
 * // With icons
 * <Switch icon={<IconClose />} selectedIcon={<IconCheck />}>
 *   Airplane mode
 * </Switch>
 *
 * // Disabled
 * <Switch isDisabled>Disabled option</Switch>
 *
 * // Without label (icon-only)
 * <Switch aria-label="Toggle feature" />
 * ```
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      children,
      icon,
      selectedIcon,
      disableRipple = false,
      isDisabled = false,
      className,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLInputElement>;

    // Extract passthrough HTML attributes that React Aria doesn't understand
    const htmlAttrs = props as Record<string, unknown>;
    const dataTestId = htmlAttrs["data-testid"] as string | undefined;
    const htmlId = htmlAttrs.id as string | undefined;
    const htmlTitle = htmlAttrs.title as string | undefined;

    const {
      "data-testid": _dataTestId,
      id: _htmlId,
      title: _htmlTitle,
      ...ariaProps
    } = props as Record<string, unknown>;

    // React Stately — toggle state
    const state = useToggleState(ariaProps as Parameters<typeof useToggleState>[0]);

    // React Aria hooks
    const { inputProps, labelProps, isPressed } = useSwitch(
      ariaProps as Parameters<typeof useSwitch>[0],
      state,
      ref
    );
    const { isFocusVisible, focusProps } = useFocusRing();
    const { isHovered, hoverProps } = useHover({ isDisabled });

    const isSelected = state.isSelected;
    const hasIcon = !!icon || !!selectedIcon;

    // Ripple effect on the handle container
    const { onMouseDown: handleRipple, ripples } = useRipple({
      disabled: isDisabled || disableRipple,
    });

    if (process.env.NODE_ENV === "development") {
      const a = ariaProps as { "aria-label"?: string; "aria-labelledby"?: string };
      if (!children && !a["aria-label"] && !a["aria-labelledby"]) {
        console.warn("[Switch] Provide a label via children or aria-label for accessibility.");
      }
    }

    return (
      <label
        {...mergeProps(labelProps, hoverProps)}
        className={cn(switchRootVariants(), "group/switch", className)}
        data-testid={dataTestId}
        title={htmlTitle}
        // ── Interaction data attributes (from React Aria state) ──────────
        {...getInteractionDataAttributes({
          isHovered,
          isFocusVisible,
          isPressed,
          isSelected,
          isDisabled,
          // isReadOnly can be undefined; ?? false satisfies exactOptionalPropertyTypes
          isReadOnly: (ariaProps as { isReadOnly?: boolean }).isReadOnly ?? false,
        })}
        // ── Content flag (describes structure, NOT interaction state) ────
        data-with-icon={hasIcon ? "" : undefined}
      >
        {/* Visually hidden native input — handles all accessibility */}
        <VisuallyHidden>
          <input {...mergeProps(inputProps, focusProps)} ref={ref} id={htmlId} />
        </VisuallyHidden>

        {/* Visual track */}
        <div role="presentation" className={cn(switchTrackVariants())}>
          {/* Focus ring — outside overflow-hidden, replaces animate-pulse */}
          <div className={cn(switchFocusRingVariants())} aria-hidden="true" />

          {/* Handle container — movement only (translate-x) */}
          <div
            role="presentation"
            className={cn(switchHandleContainerVariants())}
            onMouseDown={handleRipple}
          >
            {/* Ripple */}
            {ripples}

            {/* State layer — hover/focus/pressed opacity ring */}
            <span className={cn(switchStateLayerVariants())} aria-hidden="true" />

            {/* Handle — size + color only */}
            <div className={cn(switchHandleVariants())} aria-hidden="true">
              {/* Unselected icon */}
              {!isSelected && icon && <span className={cn(switchIconVariants())}>{icon}</span>}
              {/* Selected icon */}
              {isSelected && selectedIcon && (
                <span className={cn(switchIconVariants())}>{selectedIcon}</span>
              )}
            </div>
          </div>
        </div>

        {/* Text label */}
        {children && <span className={cn(switchLabelVariants())}>{children}</span>}
      </label>
    );
  }
);

Switch.displayName = "Switch";

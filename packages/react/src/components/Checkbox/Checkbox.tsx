"use client";

import { forwardRef, useRef, useEffect } from "react";
import type React from "react";
import { useCheckbox, useFocusRing, useHover, mergeProps, VisuallyHidden } from "react-aria";
import { useToggleState } from "react-stately";
import { cn } from "../../utils/cn";
import { getInteractionDataAttributes } from "../../utils/interactionStates";
import { useRipple } from "../../hooks/useRipple";
import {
  checkboxRootVariants,
  checkboxControlVariants,
  checkboxStateLayerVariants,
  checkboxFocusRingVariants,
  checkboxBoxVariants,
  checkboxIconVariants,
  checkboxLabelVariants,
} from "./Checkbox.variants";
import { CheckboxCheckIcon, CheckboxIndeterminateIcon } from "./Checkbox.icons";
import type { CheckboxProps } from "./Checkbox.types";

/**
 * Material Design 3 Checkbox Component (Layer 3: Styled)
 *
 * Built on React Aria for world-class accessibility.
 * Implements the Variants-vs-States architecture: all interaction/selection
 * states are expressed as data-* attributes on the root and consumed by each
 * slot via group-data-[x]/checkbox Tailwind selectors — no state variants in CVA.
 *
 * Features:
 * - 3 states: unchecked, checked, indeterminate
 * - Error/invalid state support
 * - Ripple effect (Material Design)
 * - Full keyboard accessibility (via React Aria)
 * - Screen reader support (via React Aria)
 * - Focus management (via React Aria)
 * - Form integration (name, value props)
 *
 * MD3 Specifications:
 * - Box: 18×18dp, 2dp corner radius, within 40×40dp touch target
 * - State-layer opacities: hover 8% | focus/pressed 10%
 * - Disabled: 38% opacity on root
 * - Label spacing: 16px (ml-4)
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Checkbox>Accept terms</Checkbox>
 *
 * // Controlled
 * <Checkbox isSelected={checked} onChange={setChecked}>
 *   Subscribe
 * </Checkbox>
 *
 * // Indeterminate (partial selection)
 * <Checkbox isIndeterminate>Select all</Checkbox>
 *
 * // Error state
 * <Checkbox isInvalid>Required field</Checkbox>
 *
 * // Disabled
 * <Checkbox isDisabled>Disabled option</Checkbox>
 *
 * // Without label (icon-only)
 * <Checkbox aria-label="Accept" />
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      children,
      isIndeterminate = false,
      isInvalid = false,
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

    // State management using React Stately
    const state = useToggleState(ariaProps as Parameters<typeof useToggleState>[0]);

    // React Aria hooks
    const { inputProps, labelProps, isPressed } = useCheckbox(
      ariaProps as Parameters<typeof useCheckbox>[0],
      state,
      ref
    );
    const { isFocusVisible, focusProps } = useFocusRing();
    const { isHovered, hoverProps } = useHover({ isDisabled });

    const isSelected = state.isSelected;

    // Ripple effect on the control container
    const { onMouseDown: handleRipple, ripples } = useRipple({
      disabled: isDisabled || disableRipple,
    });

    // Sync indeterminate state to native input
    useEffect(() => {
      if (ref.current) {
        ref.current.indeterminate = isIndeterminate;
      }
    }, [isIndeterminate, ref]);

    if (process.env.NODE_ENV === "development") {
      const a = ariaProps as { "aria-label"?: string; "aria-labelledby"?: string };
      if (!children && !a["aria-label"] && !a["aria-labelledby"]) {
        console.warn(
          "[Checkbox] Checkbox should have a label (children) or aria-label for accessibility."
        );
      }
    }

    return (
      <label
        {...mergeProps(labelProps, hoverProps)}
        className={cn(checkboxRootVariants(), "group/checkbox", className)}
        data-testid={dataTestId}
        title={htmlTitle}
        // ── Interaction + selection data attributes ──────────────────────────
        {...getInteractionDataAttributes({
          isHovered,
          isFocusVisible,
          isPressed,
          isSelected,
          isDisabled,
          isInvalid,
          isIndeterminate,
          isReadOnly: (ariaProps as { isReadOnly?: boolean }).isReadOnly ?? false,
        })}
      >
        {/* Visually hidden native input — handles all accessibility */}
        <VisuallyHidden>
          <input {...mergeProps(inputProps, focusProps)} ref={ref} id={htmlId} />
        </VisuallyHidden>

        {/* Control — 40dp touch target, ripple host */}
        <div
          role="presentation"
          className={cn(checkboxControlVariants())}
          onMouseDown={handleRipple}
        >
          {/* Ripple */}
          {ripples}

          {/* State layer — hover/focus/pressed opacity ring */}
          <span className={cn(checkboxStateLayerVariants())} aria-hidden="true" />

          {/* Focus ring — keyboard-focus outline */}
          <span className={cn(checkboxFocusRingVariants())} aria-hidden="true" />

          {/* Box — 18dp visual checkbox square */}
          <div className={cn(checkboxBoxVariants())} aria-hidden="true">
            {/* Check icon — 18dp MD3 checkmark */}
            {isSelected && !isIndeterminate && (
              <span className={cn(checkboxIconVariants())}>
                <CheckboxCheckIcon />
              </span>
            )}

            {/* Dash icon — indeterminate state */}
            {isIndeterminate && (
              <span className={cn(checkboxIconVariants())}>
                <CheckboxIndeterminateIcon />
              </span>
            )}
          </div>
        </div>

        {/* Text label */}
        {children && <span className={cn(checkboxLabelVariants())}>{children}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

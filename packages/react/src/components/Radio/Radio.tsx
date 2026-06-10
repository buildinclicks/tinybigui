"use client";

import { forwardRef, useRef, useContext } from "react";
import type React from "react";
import { useRadio, useFocusRing, useHover, mergeProps, VisuallyHidden } from "react-aria";
import { cn } from "../../utils/cn";
import { getInteractionDataAttributes } from "../../utils/interactionStates";
import { useRipple } from "../../hooks/useRipple";
import { RadioGroupContext } from "./RadioGroupHeadless";
import {
  radioRootVariants,
  radioControlVariants,
  radioFocusRingVariants,
  radioTargetVariants,
  radioStateLayerVariants,
  radioRingVariants,
  radioDotVariants,
  radioLabelVariants,
} from "./Radio.variants";
import type { RadioProps } from "./Radio.types";

/**
 * Material Design 3 Radio Component (Layer 3: Styled)
 *
 * Built on React Aria for world-class accessibility.
 * Implements the Variants-vs-States architecture: all interaction/selection/error
 * states are expressed as data-* attributes on the root and consumed by each
 * slot via group-data-[x]/radio Tailwind selectors — no state variants in CVA.
 *
 * Features:
 * - ✅ Unselected / selected states
 * - ✅ Error/invalid state (via RadioGroup isInvalid)
 * - ✅ Ripple effect (Material Design)
 * - ✅ Full keyboard accessibility (via React Aria)
 * - ✅ Screen reader support (via React Aria)
 * - ✅ Focus management with MD3 focus ring (no animate-pulse)
 * - ✅ Form integration (name, value props from RadioGroup)
 *
 * MD3 Specifications:
 * - Radio icon: 20×20dp (within 40×40dp touch target)
 * - Outer circle border: 2dp
 * - Inner dot: 10dp (selected state, scale 0→1)
 * - State layers: 8% hover, 10% focus/pressed
 * - Disabled: 38% opacity (on root)
 * - Label spacing: 16px (ml-4)
 *
 * @example
 * ```tsx
 * // Basic usage within RadioGroup
 * <RadioGroup label="Options">
 *   <Radio value="a">Option A</Radio>
 *   <Radio value="b">Option B</Radio>
 * </RadioGroup>
 *
 * // Without label (needs aria-label)
 * <RadioGroup label="Options">
 *   <Radio value="a" aria-label="Option A" />
 * </RadioGroup>
 *
 * // Disabled individual radio
 * <RadioGroup label="Options">
 *   <Radio value="a">Enabled</Radio>
 *   <Radio value="b" isDisabled>Disabled</Radio>
 * </RadioGroup>
 * ```
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ children, disableRipple = false, isDisabled = false, className, ...props }, forwardedRef) => {
    const state = useContext(RadioGroupContext);

    if (!state) {
      throw new Error("Radio must be used within a RadioGroup");
    }

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

    // React Aria hooks — behavior + interaction states
    const {
      inputProps,
      isSelected,
      isDisabled: radioIsDisabled,
      isPressed,
    } = useRadio(
      { ...ariaProps, value: props.value } as Parameters<typeof useRadio>[0],
      state,
      ref
    );
    const { isFocusVisible, focusProps } = useFocusRing();
    const finalIsDisabled = isDisabled || radioIsDisabled;
    const { isHovered, hoverProps } = useHover({ isDisabled: finalIsDisabled });

    // Error/invalid state from RadioGroup
    const isInvalid = state.validationState === "invalid";

    // Ripple on the target (40dp area)
    const { onMouseDown: handleRipple, ripples } = useRipple({
      disabled: finalIsDisabled || disableRipple,
    });

    if (process.env.NODE_ENV === "development") {
      const a = ariaProps as { "aria-label"?: string; "aria-labelledby"?: string };
      if (!children && !a["aria-label"] && !a["aria-labelledby"]) {
        console.warn("[Radio] Provide a label via children or aria-label for accessibility.");
      }
    }

    return (
      <label
        {...mergeProps(hoverProps)}
        className={cn(radioRootVariants(), "group/radio", className)}
        data-testid={dataTestId}
        title={htmlTitle}
        // ── Interaction + selection + error data attributes ─────────────
        {...getInteractionDataAttributes({
          isHovered,
          isFocusVisible,
          isPressed,
          isSelected,
          isDisabled: finalIsDisabled,
          isInvalid,
        })}
      >
        {/* Visually hidden native input — handles all accessibility */}
        <VisuallyHidden>
          <input {...mergeProps(inputProps, focusProps)} ref={ref} id={htmlId} />
        </VisuallyHidden>

        {/*
         * Control wrapper — relative 40dp container.
         * Hosts focus ring (sibling of target, not clipped) and the
         * overflow-hidden target that clips the state layer.
         */}
        <div role="presentation" className={cn(radioControlVariants())}>
          {/* Focus ring — sibling of target, never clipped by overflow-hidden */}
          <div className={cn(radioFocusRingVariants())} aria-hidden="true" />

          {/* Target — overflow-hidden clips state layer to the circle */}
          <div role="presentation" className={cn(radioTargetVariants())} onMouseDown={handleRipple}>
            {/* Ripple */}
            {ripples}

            {/* State layer — hover/focus/pressed opacity ring */}
            <span className={cn(radioStateLayerVariants())} aria-hidden="true" />

            {/* Outer ring — 20dp circle with 2dp border */}
            <div className={cn(radioRingVariants())} aria-hidden="true">
              {/* Inner dot — scales 0→1 when selected */}
              <div className={cn(radioDotVariants())} aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Text label */}
        {children && <span className={cn(radioLabelVariants())}>{children}</span>}
      </label>
    );
  }
);

Radio.displayName = "Radio";

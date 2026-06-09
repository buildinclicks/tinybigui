"use client";

import { forwardRef, useState, useCallback } from "react";
import type React from "react";
import { useHover, useFocusRing, mergeProps } from "react-aria";
import { ChipHeadless } from "./ChipHeadless";
import {
  chipVariants,
  chipStateLayerVariants,
  chipFocusRingVariants,
  chipLeadingIconVariants,
  chipTrailingIconVariants,
  chipCheckmarkVariants,
  chipCheckmarkIconVariants,
  chipLabelVariants,
  chipRemoveButtonVariants,
  chipRemoveStateLayerVariants,
} from "./Chip.variants";
import { cn } from "../../utils/cn";
import { getInteractionDataAttributes } from "../../utils/interactionStates";
import { useRipple } from "../../hooks/useRipple";
import type { ChipProps } from "./Chip.types";

// ---------------------------------------------------------------------------
// Internal icon primitives
// ---------------------------------------------------------------------------

/**
 * MD3 close/remove icon (18 × 18 dp)
 */
const CloseIcon = (): React.ReactElement => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

/**
 * MD3 check icon for filter chip selected state (18 × 18 dp)
 */
const CheckIcon = (): React.ReactElement => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

// ---------------------------------------------------------------------------
// Public Chip component (Layer 3: Styled)
// ---------------------------------------------------------------------------

/**
 * Material Design 3 Chip Component (Layer 3: Styled)
 *
 * Unified styled chip covering all four MD3 chip types.
 * Built on `ChipHeadless` for world-class accessibility via React Aria.
 *
 * Implements the Variants-vs-States architecture: all interaction/selection
 * states are expressed as `data-*` attributes on the root and consumed by each
 * slot via `group-data-[x]/chip` Tailwind selectors — no state variants in CVA.
 *
 * Features:
 * - ✅ 4 MD3 chip types: assist, filter, input, suggestion
 * - ✅ 2 surfaces: flat (transparent + outline), elevated (shadow + fill)
 * - ✅ MD3-correct per-type icon colors (assist leading = primary, etc.)
 * - ✅ Filter chip checkmark with spring animation
 * - ✅ Input chip removal with animate-md-fade-out
 * - ✅ Proper MD3 state layer (hover 8%, focus 10%, pressed 10%)
 * - ✅ Spring motion tokens (no hardcoded durations)
 * - ✅ Dedicated focus ring slot (outside overflow-hidden)
 * - ✅ Full keyboard accessibility (via React Aria)
 * - ✅ Deprecated `surface="tonal"` — warns and maps to `flat`
 *
 * MD3 Specifications:
 * - Height: 32dp (h-8), corner-small 8dp (rounded-sm)
 * - Padding: 16dp base; 8dp leading side when icon present
 * - Icon size: 18px × 18px
 * - State layers: 8% hover, 10% focus/pressed
 * - Elevation: level-1 base → level-2 hover (elevated surface)
 *
 * @example
 * ```tsx
 * // Assist chip (default flat surface)
 * <Chip type="assist" label="Set alarm" onPress={handlePress} />
 *
 * // Elevated assist chip
 * <Chip type="assist" surface="elevated" label="Set alarm" />
 *
 * // Filter chip (controlled)
 * <Chip type="filter" label="Vegetarian" selected={isVeg} onSelectionChange={setVeg} />
 *
 * // Input chip with leading icon
 * <Chip type="input" label="React" leadingIcon={<ReactIcon />} onRemove={() => remove('React')} />
 *
 * // Suggestion chip
 * <Chip type="suggestion" label="See photos" onPress={handlePress} />
 * ```
 */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      type,
      label,
      surface: surfaceProp = "flat",
      selected,
      defaultSelected,
      onSelectionChange,
      onPress,
      onRemove,
      leadingIcon,
      trailingIcon,
      isDisabled = false,
      className,
    },
    ref
  ) => {
    // Resolve deprecated surface="tonal" → "flat" with dev warning
    const surface = ((): "flat" | "elevated" => {
      if (surfaceProp === "tonal") {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            '[Chip] surface="tonal" is deprecated. Use surface="flat" instead. ' +
              '"tonal" will be removed in a future minor version.'
          );
        }
        return "flat";
      }
      return surfaceProp;
    })();

    // ── Filter chip selected state management ────────────────────────────────
    const [localSelected, setLocalSelected] = useState(defaultSelected ?? false);
    const isControlled = selected !== undefined;
    const effectiveSelected = type === "filter" ? (isControlled ? selected : localSelected) : false;

    const handleSelectionChange = useCallback(
      (newSelected: boolean) => {
        if (!isControlled) {
          setLocalSelected(newSelected);
        }
        onSelectionChange?.(newSelected);
      },
      [isControlled, onSelectionChange]
    );

    // ── Interaction state tracking (body / main chip) ─────────────────────────
    const [isPressed, setIsPressed] = useState(false);
    const handlePressStart = useCallback(() => setIsPressed(true), []);
    const handlePressEnd = useCallback(() => setIsPressed(false), []);

    const { isHovered, hoverProps } = useHover({ isDisabled });
    const { isFocusVisible, focusProps } = useFocusRing();

    // ── Interaction state tracking (remove button — input chip only) ──────────
    const [isRemovePressed, setIsRemovePressed] = useState(false);
    const { isHovered: isRemoveHovered, hoverProps: removeHoverProps } = useHover({ isDisabled });
    const { isFocusVisible: isRemoveFocusVisible, focusProps: removeFocusProps } = useFocusRing();

    // ── Ripple ───────────────────────────────────────────────────────────────
    const { onMouseDown: handleRipple, ripples } = useRipple({ disabled: isDisabled });

    // ── Derived flags ────────────────────────────────────────────────────────
    const hasLeadingIcon = Boolean(leadingIcon) || type === "filter";

    // ── Input chip: removal animation ────────────────────────────────────────
    const [isRemoving, setIsRemoving] = useState(false);

    const handleRemove = useCallback(() => {
      setIsRemoving(true);
    }, []);

    const handleAnimationEnd = useCallback(() => {
      if (isRemoving) {
        onRemove?.();
      }
    }, [isRemoving, onRemove]);

    // ── Body interaction data attributes ─────────────────────────────────────
    const bodyDataAttrs = getInteractionDataAttributes({
      isHovered,
      isFocusVisible,
      isPressed,
      ...(type === "filter" && { isSelected: effectiveSelected }),
      isDisabled,
    });

    // ── Root classes (shared base) ────────────────────────────────────────────
    const rootClass = cn(chipVariants({ chipType: type, surface }), "group/chip", className);

    // ── Input chip ───────────────────────────────────────────────────────────
    // Renders a wrapper <span> as the chip root so we can:
    //  1. Apply chip styles + removal animation class
    //  2. Carry the group/chip scope so all slot selectors work
    //  3. Listen for animationend before calling the real onRemove callback
    // The inner <ChipHeadless className="contents"> uses CSS display:contents
    // so the two buttons become direct flex children of the wrapper span.
    if (type === "input") {
      const removeDataAttrs = getInteractionDataAttributes({
        isHovered: isRemoveHovered,
        isFocusVisible: isRemoveFocusVisible,
        isPressed: isRemovePressed,
        isDisabled,
      });

      return (
        <span
          className={cn(
            chipVariants({ chipType: "input", surface }),
            "group/chip",
            isRemoving && "animate-md-fade-out",
            className
          )}
          // Spread the body interaction attrs onto the root wrapper so
          // group-data-[x]/chip slot selectors work for the chip body area.
          // (The remove button has its own group/chip-remove scope.)
          {...bodyDataAttrs}
          data-with-leading={hasLeadingIcon ? "" : undefined}
          data-with-trailing=""
          onAnimationEnd={handleAnimationEnd}
        >
          {/* Ripple */}
          {ripples}

          {/* State layer */}
          <span className={cn(chipStateLayerVariants({ chipType: "input" }))} aria-hidden="true" />

          {/* Focus ring — outside overflow-hidden */}
          <span className={cn(chipFocusRingVariants())} aria-hidden="true" />

          <ChipHeadless
            type="input"
            label={label}
            isDisabled={isDisabled}
            onRemove={handleRemove}
            onMouseDown={handleRipple}
            removeButtonClassName={cn(chipRemoveButtonVariants())}
            removeIcon={
              <>
                {/* Remove button state layer */}
                <span
                  className={cn(chipRemoveStateLayerVariants())}
                  aria-hidden="true"
                  {...{ "data-remove-state-layer": "" }}
                />
                <CloseIcon />
              </>
            }
            ref={ref}
            className="contents"
            bodyPassthrough={{
              onPressStart: handlePressStart,
              onPressEnd: handlePressEnd,
            }}
            removePassthrough={{
              dataAttributes: removeDataAttrs,
              eventHandlers: mergeProps(removeHoverProps, removeFocusProps) as Record<
                string,
                unknown
              >,
              onPressStart: () => setIsRemovePressed(true),
              onPressEnd: () => setIsRemovePressed(false),
            }}
          >
            {/* Leading icon */}
            {leadingIcon && (
              <span
                aria-hidden="true"
                className={cn(chipLeadingIconVariants({ chipType: "input" }))}
              >
                {leadingIcon}
              </span>
            )}
            {/* Label */}
            <span className={cn(chipLabelVariants())}>{label}</span>
          </ChipHeadless>
        </span>
      );
    }

    // ── Assist / Filter / Suggestion chips ───────────────────────────────────
    return (
      <ChipHeadless
        ref={ref}
        type={type}
        label={label}
        {...(type === "filter" && {
          selected: effectiveSelected,
          onSelectionChange: handleSelectionChange,
        })}
        {...(type !== "filter" && onPress !== undefined && { onPress })}
        isDisabled={isDisabled}
        onMouseDown={handleRipple}
        className={cn(rootClass)}
        bodyPassthrough={{
          dataAttributes: bodyDataAttrs,
          onPressStart: handlePressStart,
          onPressEnd: handlePressEnd,
          eventHandlers: mergeProps(hoverProps, focusProps) as Record<string, unknown>,
        }}
      >
        {/* Ripple */}
        {ripples}

        {/* State layer */}
        <span className={cn(chipStateLayerVariants({ chipType: type }))} aria-hidden="true" />

        {/* Focus ring — absolute sibling, outside overflow-hidden */}
        <span className={cn(chipFocusRingVariants())} aria-hidden="true" />

        {/* Filter chip checkmark — width spring */}
        {type === "filter" && (
          <span className={cn(chipCheckmarkVariants())} aria-hidden="true">
            <span className={cn(chipCheckmarkIconVariants())}>
              <CheckIcon />
            </span>
          </span>
        )}

        {/* Leading icon */}
        {leadingIcon && (
          <span aria-hidden="true" className={cn(chipLeadingIconVariants({ chipType: type }))}>
            {leadingIcon}
          </span>
        )}

        {/* Label */}
        <span className={cn(chipLabelVariants())}>{label}</span>

        {/* Trailing icon (Assist / Suggestion only) */}
        {trailingIcon && (
          <span aria-hidden="true" className={cn(chipTrailingIconVariants())}>
            {trailingIcon}
          </span>
        )}
      </ChipHeadless>
    );
  }
);

Chip.displayName = "Chip";

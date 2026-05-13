"use client";

import { forwardRef, useState, useCallback } from "react";
import type React from "react";
import { ChipHeadless } from "./ChipHeadless";
import { chipVariants } from "./Chip.variants";
import { cn } from "../../utils/cn";
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
// State layer — shared across all chip types
// ---------------------------------------------------------------------------

const StateLayer = (): React.ReactElement => (
  <span
    aria-hidden="true"
    className={cn(
      "bg-on-surface pointer-events-none absolute inset-0 rounded-sm opacity-0",
      "duration-spring-standard-fast-effects ease-spring-standard-fast-effects transition-opacity",
      "group-focus-within:opacity-12 group-hover:opacity-8 group-active:opacity-12"
    )}
  />
);

// ---------------------------------------------------------------------------
// Public Chip component (Layer 3: Styled)
// ---------------------------------------------------------------------------

/**
 * Material Design 3 Chip Component (Layer 3: Styled)
 *
 * Unified styled chip covering all four MD3 chip types.
 * Built on `ChipHeadless` for world-class accessibility via React Aria.
 * Uses CVA for type-safe variant management.
 *
 * | Type         | Surface       | Selection | Remove |
 * |--------------|---------------|-----------|--------|
 * | `assist`     | tonal/elevated | —         | —      |
 * | `filter`     | fixed tonal   | ✅         | —      |
 * | `input`      | fixed tonal   | —         | ✅     |
 * | `suggestion` | tonal/elevated | —         | —      |
 *
 * @example
 * ```tsx
 * // Assist chip
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
      surface = "tonal",
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
    // ── Filter chip selected state management ────────────────────────────────
    // We mirror the toggle state here so the checkmark can react to it.
    // The headless layer is always driven as controlled from this component.
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

    // ── Ripple ───────────────────────────────────────────────────────────────
    const { onMouseDown: handleRipple, ripples } = useRipple({ disabled: isDisabled });

    // ── Derived flags ────────────────────────────────────────────────────────
    const hasLeadingIcon = Boolean(leadingIcon);

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

    // ── Shared chip variant classes ──────────────────────────────────────────
    const chipClass = (): string =>
      cn(
        chipVariants({
          chipType: type,
          surface: type === "assist" || type === "suggestion" ? surface : undefined,
          selected: type === "filter" ? effectiveSelected : undefined,
          isDisabled,
          hasLeadingIcon,
          hasRemoveButton: false,
        }),
        className
      );

    // ── Input chip ───────────────────────────────────────────────────────────
    // Renders a wrapper <span> as the chip root to:
    //  1. Apply chip styles and the removal animation class
    //  2. Host the ripple container (triggered from onMouseDown on the span)
    //  3. Listen for animationend before calling the real onRemove callback
    // The inner <ChipHeadless className="contents"> uses CSS display:contents
    // so the two buttons become direct flex children of the wrapper span.
    if (type === "input") {
      return (
        <span
          className={cn(
            chipVariants({
              chipType: "input",
              isDisabled,
              hasLeadingIcon,
              hasRemoveButton: true,
            }),
            isRemoving && "animate-md-fade-out",
            className
          )}
          onAnimationEnd={handleAnimationEnd}
        >
          {ripples}
          <StateLayer />
          <ChipHeadless
            type="input"
            label={label}
            isDisabled={isDisabled}
            onRemove={handleRemove}
            onMouseDown={handleRipple}
            removeIcon={<CloseIcon />}
            removeButtonClassName="relative z-10 inline-flex size-4.5 shrink-0 items-center text-on-surface-variant"
            ref={ref}
            className="contents"
          >
            {leadingIcon && (
              <span
                aria-hidden="true"
                className="relative z-10 inline-flex size-4.5 shrink-0 items-center"
              >
                {leadingIcon}
              </span>
            )}
            <span className="relative z-10">{label}</span>
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
        className={chipClass()}
      >
        {ripples}
        <StateLayer />

        {/* Filter chip checkmark — slides in/out on selection change */}
        {type === "filter" && (
          <span
            className={cn(
              "duration-short4 ease-emphasized-decelerate inline-flex overflow-hidden transition-[width,opacity]",
              effectiveSelected ? "w-4.5 opacity-100" : "w-0 opacity-0"
            )}
          >
            <CheckIcon />
          </span>
        )}

        {/* Leading icon */}
        {leadingIcon && (
          <span
            aria-hidden="true"
            className="relative z-10 inline-flex size-4.5 shrink-0 items-center"
          >
            {leadingIcon}
          </span>
        )}

        {/* Label */}
        <span className="relative z-10">{label}</span>

        {/* Trailing icon (Assist / Suggestion only) */}
        {trailingIcon && (
          <span
            aria-hidden="true"
            className="relative z-10 inline-flex size-4.5 shrink-0 items-center"
          >
            {trailingIcon}
          </span>
        )}
      </ChipHeadless>
    );
  }
);

Chip.displayName = "Chip";

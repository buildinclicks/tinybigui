import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 ButtonGroup Variants
 *
 * Architecture: Variants vs States
 * - CVA holds design-time structure only (no interaction state variants).
 * - All interaction/selection states are driven by data-* attributes on the root
 *   via group-data-[x]/button-group Tailwind selectors.
 * - Container-level state attributes:
 *     data-connected      — variant is "connected"
 *     data-has-selection  — at least one child button is selected
 *     data-disabled       — entire group is non-interactive
 *     data-selection-mode — "single" | "required" | "multi" (when applicable)
 *
 * Slot responsibilities:
 *   buttonGroupRootVariants  — layout container; gap, alignment, motion, disabled state
 *
 * MD3 Spec (Inner Gap):
 *   | Size        | standard   | connected |
 *   |-------------|------------|-----------|
 *   | extra-small | 18dp       | 2dp       |
 *   | small       | 12dp       | 2dp       |
 *   | medium      | 8dp        | 2dp       |
 *   | large       | 8dp        | 2dp       |
 *   | extra-large | 8dp        | 2dp       |
 *
 * Motion:
 *   Gap is a spatial property — uses spring-standard-fast-spatial (350ms, no overshoot
 *   for gap since CSS gap cannot visually overshoot). This ensures smooth transitions
 *   when the size prop changes or buttons are added/removed.
 *
 * Note: xs/sm standard gaps are intentionally large to preserve 48dp touch targets.
 * Connected gap is always 2dp (`gap-0.5`) regardless of size.
 */

// ─── ROOT ─────────────────────────────────────────────────────────────────────

/**
 * Root container element — carries `group/button-group` scope via the styled layer.
 *
 * Handles:
 * - Flexbox layout (inline-flex or flex)
 * - Gap between child buttons (per variant × size)
 * - Spatial motion for gap transitions
 * - Disabled state (opacity + pointer-events)
 */
export const buttonGroupRootVariants = cva(
  [
    // Layout
    "items-center",
    // Spatial motion for gap changes — standard spring (calm, utility UI)
    "transition-[gap] duration-spring-standard-fast-spatial ease-spring-standard-fast-spatial",
    // Disabled state — self-targeting data-[x]: selector on root
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-38",
  ],
  {
    variants: {
      /**
       * Layout variant
       *
       * - `standard`: shrink-wraps to button widths (`inline-flex`)
       * - `connected`: stretches to fill parent (`flex w-full`)
       */
      variant: {
        standard: "inline-flex",
        connected: "flex w-full",
      },

      /**
       * Size tier — controls the inner gap for the standard variant.
       * For the connected variant, gap is always overridden to `gap-0.5`.
       */
      size: {
        "extra-small": "",
        small: "",
        medium: "",
        large: "",
        "extra-large": "",
      },
    },

    /**
     * Compound variants that set the correct gap per (variant × size) combination.
     */
    compoundVariants: [
      // Standard variant — larger gaps preserve 48dp touch targets
      { variant: "standard", size: "extra-small", className: "gap-[18px]" },
      { variant: "standard", size: "small", className: "gap-3" },
      { variant: "standard", size: "medium", className: "gap-2" },
      { variant: "standard", size: "large", className: "gap-2" },
      { variant: "standard", size: "extra-large", className: "gap-2" },

      // Connected variant — always 2dp gap (gap-0.5 = 2px at default spacing)
      { variant: "connected", size: "extra-small", className: "gap-0.5" },
      { variant: "connected", size: "small", className: "gap-0.5" },
      { variant: "connected", size: "medium", className: "gap-0.5" },
      { variant: "connected", size: "large", className: "gap-0.5" },
      { variant: "connected", size: "extra-large", className: "gap-0.5" },
    ],

    defaultVariants: {
      variant: "standard",
      size: "medium",
    },
  }
);

// ─── FOCUS RING ───────────────────────────────────────────────────────────────

/**
 * Focus ring overlay for the group container.
 *
 * Visible only when the group itself receives keyboard focus (rare — typically
 * focus goes to child buttons). Included for completeness and edge cases where
 * the group container might receive programmatic focus.
 *
 * Uses the same pattern as Switch/Button focus rings:
 * - Always in DOM (opacity-0)
 * - Transitions to opacity-100 on group-data-[focus-visible]
 */
export const buttonGroupFocusRingVariants = cva([
  "pointer-events-none absolute inset-[-3px] rounded-[inherit]",
  "outline outline-2 outline-offset-0 outline-secondary",
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "opacity-0",
  "group-data-[focus-visible]/button-group:opacity-100",
]);

// ─── BACKWARD COMPAT ──────────────────────────────────────────────────────────

/**
 * @deprecated Use `buttonGroupRootVariants` instead.
 * Kept for backward compatibility during migration.
 */
export const buttonGroupVariants = buttonGroupRootVariants;

// ─── EXPORTED TYPES ───────────────────────────────────────────────────────────

export type ButtonGroupRootVariants = VariantProps<typeof buttonGroupRootVariants>;
export type ButtonGroupFocusRingVariants = VariantProps<typeof buttonGroupFocusRingVariants>;

/**
 * @deprecated Use `ButtonGroupRootVariants` instead.
 */
export type ButtonGroupVariants = ButtonGroupRootVariants;

import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 ButtonGroup Variants (CVA)
 *
 * Type-safe variant management for the ButtonGroup container.
 * The container has no colour of its own — it only controls layout
 * (display, width) and the inner gap between child buttons.
 *
 * MD3 Inner Gap Spec:
 * | Size | standard   | connected |
 * |------|------------|-----------|
 * | xs   | 18dp       | 2dp       |
 * | sm   | 12dp       | 2dp       |
 * | md   | 8dp        | 2dp       |
 * | lg   | 8dp        | 2dp       |
 * | xl   | 8dp        | 2dp       |
 *
 * Note: xs/sm standard gaps are intentionally large to preserve 48dp touch targets.
 * Connected gap is always 2dp (`gap-0.5`) regardless of size.
 */
export const buttonGroupVariants = cva(
  // Base classes applied to every ButtonGroup container
  ["items-center"],
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
        xs: "",
        sm: "",
        md: "",
        lg: "",
        xl: "",
      },
    },

    /**
     * Compound variants that set the correct gap per (variant × size) combination.
     */
    compoundVariants: [
      // Standard variant — larger gaps preserve 48dp touch targets
      { variant: "standard", size: "xs", className: "gap-[18px]" },
      { variant: "standard", size: "sm", className: "gap-3" },
      { variant: "standard", size: "md", className: "gap-2" },
      { variant: "standard", size: "lg", className: "gap-2" },
      { variant: "standard", size: "xl", className: "gap-2" },

      // Connected variant — always 2dp gap (gap-0.5 = 2px at default spacing)
      { variant: "connected", size: "xs", className: "gap-0.5" },
      { variant: "connected", size: "sm", className: "gap-0.5" },
      { variant: "connected", size: "md", className: "gap-0.5" },
      { variant: "connected", size: "lg", className: "gap-0.5" },
      { variant: "connected", size: "xl", className: "gap-0.5" },
    ],

    defaultVariants: {
      variant: "standard",
      size: "md",
    },
  }
);

/**
 * Extract variant prop types from CVA
 */
export type ButtonGroupVariants = VariantProps<typeof buttonGroupVariants>;

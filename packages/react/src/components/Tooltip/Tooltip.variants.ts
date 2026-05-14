import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Plain Tooltip Variants (CVA)
 *
 * Base tokens per MD3 spec:
 * - bg-inverse-surface / text-inverse-on-surface — inverted surface for contrast
 * - rounded-xs — 4dp corner radius (CornerExtraSmall)
 * - min-h-6 — 24dp minimum height
 * - max-w-50 — 200dp maximum width
 * - w-fit — shrink-wrap to content width
 * - px-2 py-1 — 8dp horizontal, 4dp vertical padding
 * - text-body-small — MD3 BodySmall typography (12px)
 *
 * `isVisible` drives the entry/exit animation class:
 * - true  → animate-md-scale-in  (component entering with scale+fade)
 * - false → animate-md-scale-out (component exiting with scale+fade)
 */
export const tooltipVariants = cva(
  "z-50 w-fit min-h-6 rounded-xs px-2 py-1 text-body-small bg-inverse-surface text-inverse-on-surface max-w-50",
  {
    variants: {
      /**
       * Drives the MD3 enter/exit animation class.
       * Managed by `TooltipTrigger`'s animation state machine.
       * @default true
       */
      isVisible: {
        true: "animate-md-scale-in",
        false: "animate-md-scale-out",
      },
    },
    defaultVariants: {
      isVisible: true,
    },
  }
);

/**
 * Material Design 3 Rich Tooltip Variants (CVA)
 *
 * Base tokens per MD3 spec:
 * - bg-surface-container / text-on-surface — surface container background
 * - shadow-elevation-2  — MD3 elevation level 2
 * - rounded-md          — 12dp corner radius (CornerMedium)
 * - min-h-6             — 24dp minimum height
 * - max-w-80            — 320dp maximum width
 * - w-fit               — shrink-wrap to content width
 * - px-4 py-3           — 16dp horizontal, 12dp vertical padding
 *
 * `isVisible` drives the entry/exit animation class:
 * - true  → animate-md-scale-in  (component entering with scale+fade)
 * - false → animate-md-scale-out (component exiting with scale+fade)
 */
export const richTooltipVariants = cva(
  "z-50 w-fit min-h-6 rounded-md px-4 py-3 bg-surface-container text-on-surface shadow-elevation-2 max-w-80",
  {
    variants: {
      /**
       * Drives the MD3 enter/exit animation class.
       * Managed by `TooltipTrigger`'s animation state machine.
       * @default true
       */
      isVisible: {
        true: "animate-md-scale-in",
        false: "animate-md-scale-out",
      },
    },
    defaultVariants: {
      isVisible: true,
    },
  }
);

/** Variant prop types inferred from `tooltipVariants`. */
export type TooltipVariants = VariantProps<typeof tooltipVariants>;

/** Variant prop types inferred from `richTooltipVariants`. */
export type RichTooltipVariants = VariantProps<typeof richTooltipVariants>;

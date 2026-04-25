import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Progress Indicator Variants (CVA)
 *
 * Type-safe variant management for Progress component.
 * Uses Tailwind CSS classes mapped to MD3 design tokens.
 *
 * MD3 Specifications:
 * - Linear track height: 4dp (h-1 = 4px)
 * - Linear track shape: rounded-full (radius-full)
 * - Circular default size: 48dp (h-12 w-12)
 * - Circular stroke width: 4dp (applied as SVG attribute)
 * - Active track color: primary
 * - Inactive track color: surface-container-highest
 * - Label text: on-surface, body-small
 */

/**
 * Progress container variants.
 * Wraps the entire progress indicator (label + visual).
 */
export const progressContainerVariants = cva(["inline-flex", "flex-col", "gap-1"], {
  variants: {
    /**
     * The visual type of the indicator.
     */
    type: {
      linear: "w-full",
      circular: "items-center justify-center w-auto",
    },
  },
  defaultVariants: {
    type: "linear",
  },
});

/**
 * Linear track variants (the 4dp-height background rail).
 */
export const progressTrackVariants = cva([
  "relative",
  "w-full",
  "h-1", // MD3: 4dp track height
  "rounded-full", // MD3: full corner radius
  "overflow-hidden",
  "bg-surface-container-highest", // MD3: inactive track color
]);

/**
 * Linear indicator bar variants (the foreground progress fill).
 */
export const progressIndicatorVariants = cva([
  "absolute",
  "left-0",
  "top-0",
  "h-full",
  "rounded-full",
  "bg-primary", // MD3: active track color
  "transition-[width]",
  "duration-medium4", // MD3: 400ms for value transitions
  "ease-standard", // MD3: cubic-bezier(0.2, 0, 0, 1)
]);

/**
 * Stop indicator dot variants (linear determinate only).
 * Appears at the leading edge of the track head per MD3 spec.
 */
export const progressStopIndicatorVariants = cva([
  "absolute",
  "top-1/2",
  "-translate-y-1/2",
  "w-1",
  "h-1",
  "rounded-full",
  "bg-primary", // MD3: stop indicator uses primary color
]);

/**
 * Circular SVG size variants.
 * Maps the size prop to MD3-specified dimensions.
 * - small:  24dp → h-6 w-6
 * - medium: 48dp → h-12 w-12 (default)
 * - large:  64dp → h-16 w-16
 */
export const progressCircularSizeVariants = cva(
  ["relative", "flex", "items-center", "justify-center", "flex-shrink-0"],
  {
    variants: {
      size: {
        small: "h-6 w-6", // MD3: 24dp
        medium: "h-12 w-12", // MD3: 48dp (default)
        large: "h-16 w-16", // MD3: 64dp
      },
    },
    defaultVariants: {
      size: "medium",
    },
  }
);

/**
 * Label text variants.
 * Rendered above or beside the indicator per MD3 spec.
 */
export const progressLabelVariants = cva([
  "text-body-small", // MD3: body-small type scale (12px)
  "text-on-surface", // MD3: on-surface color role
  "select-none",
]);

/**
 * Extract variant prop types from CVA.
 */
export type ProgressContainerVariants = VariantProps<typeof progressContainerVariants>;
export type ProgressTrackVariants = VariantProps<typeof progressTrackVariants>;
export type ProgressIndicatorVariants = VariantProps<typeof progressIndicatorVariants>;
export type ProgressCircularSizeVariants = VariantProps<typeof progressCircularSizeVariants>;
export type ProgressLabelVariants = VariantProps<typeof progressLabelVariants>;

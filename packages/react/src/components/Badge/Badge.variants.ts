import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Badge Content Variants (CVA)
 *
 * Manages the visual appearance of the badge indicator element:
 * - `size`: small (6dp dot) or large (16dp min-width pill)
 * - `color`: MD3 color role — error (default) or primary
 * - `invisible`: scale/opacity toggle for show/hide animation
 * - `reducedMotion`: strips transition when `prefers-reduced-motion` is active
 */
export const badgeVariants = cva(
  ["absolute -top-1 -right-1 rounded-full flex items-center justify-center"],
  {
    variants: {
      size: {
        small: "size-1.5",
        large: "min-w-4 h-4 px-1 text-label-small",
      },
      color: {
        error: "bg-error text-on-error",
        primary: "bg-primary text-on-primary",
      },
      invisible: {
        true: "scale-0 opacity-0",
        false: "scale-100 opacity-100",
      },
      reducedMotion: {
        true: "",
        false:
          "transition-[transform,opacity] duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
      },
    },
    defaultVariants: {
      size: "large",
      color: "error",
      invisible: false,
      reducedMotion: false,
    },
  }
);

/**
 * Extract variant prop types from CVA
 */
export type BadgeVariants = VariantProps<typeof badgeVariants>;

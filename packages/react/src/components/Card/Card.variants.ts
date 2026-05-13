import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Card Variants (CVA)
 *
 * Type-safe variant management for the Card component.
 * Uses Tailwind CSS classes mapped to MD3 design tokens.
 *
 * MD3 Specifications:
 * - Shape: medium (12dp) → `rounded-md`
 * - Elevated: surface-container-low + elevation-1 (resting), elevation-2 (hover/interactive)
 * - Filled: surface-container-highest + elevation-0
 * - Outlined: surface + outline-variant border + elevation-0
 * - Dragged state (elevated only): elevation-4, slower shadow transition
 * - Disabled: on-surface at 12% opacity (`opacity-38`) + no pointer events
 */
export const cardVariants = cva(
  [
    // Shape: MD3 medium corner = 12dp
    "relative overflow-hidden rounded-md",
    // Shadow transition (effects property — use spring standard fast effects)
    "transition-shadow duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  ],
  {
    variants: {
      /**
       * Card visual variant per MD3 specification.
       */
      variant: {
        elevated: ["bg-surface-container-low", "shadow-elevation-1", "hover:shadow-elevation-2"],
        filled: ["bg-surface-container-highest", "shadow-elevation-0"],
        outlined: ["bg-surface", "border", "border-outline-variant", "shadow-elevation-0"],
      },

      /**
       * Whether the card is interactive (has onPress or href).
       * Interactive cards gain a cursor, keyboard focus ring, and state layer.
       */
      isInteractive: {
        true: [
          "cursor-pointer",
          "focus-visible:outline-2",
          "focus-visible:outline-primary",
          "focus-visible:outline-offset-2",
        ],
        false: "cursor-default",
      },

      /**
       * Whether the card is currently being dragged.
       * Applies elevated shadow level 4 with a slower, more intentional transition
       * to communicate physical lift per MD3 motion spec.
       */
      isDragged: {
        true: [
          "shadow-elevation-4",
          // Override base transition to use a slower, decelerate curve for drag onset
          "duration-medium2",
          "ease-emphasized-decelerate",
        ],
        false: "",
      },

      /**
       * Whether the card is disabled.
       * MD3 spec: 38% opacity, no pointer events.
       */
      isDisabled: {
        true: ["opacity-38", "pointer-events-none"],
        false: "",
      },
    },

    defaultVariants: {
      variant: "elevated",
      isInteractive: false,
      isDragged: false,
      isDisabled: false,
    },
  }
);

/**
 * Extract variant prop types from CVA for typed usage.
 */
export type CardVariants = VariantProps<typeof cardVariants>;

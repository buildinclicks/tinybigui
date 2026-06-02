import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Divider Variants (CVA)
 *
 * Defines orientation and inset variants for the Divider component.
 * All classes use MD3 design token utilities — no arbitrary values.
 *
 * Orientation:
 *   horizontal — 1px top border, spans full width
 *   vertical   — 1px left border, spans full height (self-stretch in flex)
 *
 * Inset (MD3 spec: 16dp offset):
 *   start — ml-4 (indented from the leading edge)
 *   end   — mr-4 (indented from the trailing edge)
 *   both  — ml-4 mr-4 (indented from both edges)
 */
export const dividerVariants = cva(
  // Base: always apply the MD3 outline-variant color to the border
  "border-outline-variant",
  {
    variants: {
      /**
       * Controls the axis of the visual rule.
       */
      orientation: {
        horizontal: "border-t",
        vertical: "border-l h-auto self-stretch",
      },

      /**
       * Inset — which end(s) are offset by 16dp per MD3 spec.
       */
      inset: {
        none: "",
        start: "ml-4",
        end: "mr-4",
        both: "ml-4 mr-4",
      },
    },

    defaultVariants: {
      orientation: "horizontal",
      inset: "none",
    },
  }
);

/**
 * Inferred CVA variant prop types for the Divider component.
 */
export type DividerVariants = VariantProps<typeof dividerVariants>;

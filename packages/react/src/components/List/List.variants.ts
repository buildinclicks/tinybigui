import { cva, type VariantProps } from "class-variance-authority";

/**
 * MD3 List container CVA variants.
 */
export const listVariants = cva("w-full bg-surface");

/**
 * MD3 ListItem CVA variants.
 *
 * Density is auto-derived from content (overline / supportingText), not a user prop.
 * Three-line items use `items-start` so leading/trailing slots top-align.
 */
export const listItemVariants = cva(
  [
    "group relative flex items-center overflow-hidden px-4 py-2 cursor-pointer",
    "transition-[background-color] duration-short4 ease-standard",
  ],
  {
    variants: {
      density: {
        "one-line": "min-h-14",
        "two-line": "min-h-18",
        "three-line": "min-h-22 items-start",
      },

      isSelected: {
        true: "bg-secondary-container text-on-secondary-container",
        false: "",
      },

      isDisabled: {
        true: "opacity-38 pointer-events-none",
        false: "",
      },

      isInteractive: {
        true: "",
        false: "cursor-default",
      },
    },

    defaultVariants: {
      density: "one-line",
      isSelected: false,
      isDisabled: false,
      isInteractive: true,
    },
  }
);

export type ListVariants = VariantProps<typeof listVariants>;
export type ListItemVariants = VariantProps<typeof listItemVariants>;

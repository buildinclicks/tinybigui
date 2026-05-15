import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Split Button — Container Variants (CVA)
 *
 * Defines the outer container styling for the split button group.
 * Maps `variant` and `isDisabled` to MD3 design tokens via Tailwind.
 */
export const splitButtonContainerVariants = cva(
  ["inline-flex items-center rounded-full overflow-hidden h-10"],
  {
    variants: {
      variant: {
        filled: "bg-primary shadow-elevation-0 hover:shadow-elevation-1",
        tonal: "bg-secondary-container",
        outlined: "border border-outline bg-transparent",
      },

      isDisabled: {
        true: "opacity-38 pointer-events-none",
        false: "",
      },
    },

    defaultVariants: {
      variant: "filled",
      isDisabled: false,
    },
  }
);

/**
 * Material Design 3 Split Button — Primary Segment Variants (CVA)
 *
 * Applies text color and padding to the primary action segment.
 * The divider between segments is rendered via the dropdown's `border-l`.
 */
export const splitButtonPrimaryVariants = cva(
  [
    "relative inline-flex items-center justify-center cursor-pointer",
    "h-full font-medium text-sm tracking-[0.1px]",
    "focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2",
  ],
  {
    variants: {
      variant: {
        filled: "text-on-primary pl-6 pr-4",
        tonal: "text-on-secondary-container pl-6 pr-4",
        outlined: "text-primary pl-6 pr-4",
      },
    },

    defaultVariants: {
      variant: "filled",
    },
  }
);

/**
 * Material Design 3 Split Button — Dropdown Trigger Variants (CVA)
 *
 * Applies text color, padding, and the visual divider (left border) to
 * the dropdown trigger segment.
 */
export const splitButtonDropdownVariants = cva(
  [
    "relative inline-flex items-center justify-center cursor-pointer",
    "h-full",
    "focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2",
  ],
  {
    variants: {
      variant: {
        filled: "text-on-primary px-2 border-l border-on-primary/38",
        tonal: "text-on-secondary-container px-2 border-l border-on-secondary-container/38",
        outlined: "text-primary px-2 border-l border-outline",
      },
    },

    defaultVariants: {
      variant: "filled",
    },
  }
);

export type SplitButtonContainerVariants = VariantProps<typeof splitButtonContainerVariants>;
export type SplitButtonPrimaryVariants = VariantProps<typeof splitButtonPrimaryVariants>;
export type SplitButtonDropdownVariants = VariantProps<typeof splitButtonDropdownVariants>;

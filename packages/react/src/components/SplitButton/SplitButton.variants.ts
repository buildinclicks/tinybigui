import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Split Button — Container Variants (CVA)
 *
 * Defines the outer container styling for the split button group.
 * Maps `variant`, `size`, and `isDisabled` to MD3 design tokens via Tailwind.
 */
export const splitButtonContainerVariants = cva(
  ["inline-flex items-center rounded-full overflow-hidden"],
  {
    variants: {
      variant: {
        filled: "bg-primary shadow-elevation-0 hover:shadow-elevation-1",
        tonal: "bg-secondary-container",
        outlined: "border border-outline bg-transparent",
      },

      size: {
        small: "h-8",
        medium: "h-10",
        large: "h-12",
      },

      isDisabled: {
        true: "opacity-38 pointer-events-none",
        false: "",
      },
    },

    defaultVariants: {
      variant: "filled",
      size: "medium",
      isDisabled: false,
    },
  }
);

/**
 * Material Design 3 Split Button — Primary Segment Variants (CVA)
 *
 * Applies text color, padding, and the Tailwind group name (`group/primary`)
 * to the primary action segment. The group name is required so that the
 * nested state-layer span can target `group-hover/primary:opacity-8`.
 * The divider between segments is rendered via the dropdown's `border-l`.
 */
export const splitButtonPrimaryVariants = cva(
  [
    "group/primary relative inline-flex items-center justify-center cursor-pointer",
    "h-full font-medium tracking-[0.1px]",
    "focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2",
  ],
  {
    variants: {
      variant: {
        filled: "text-on-primary",
        tonal: "text-on-secondary-container",
        outlined: "text-primary",
      },

      size: {
        small: "pl-4 pr-3 text-xs",
        medium: "pl-6 pr-4 text-sm",
        large: "pl-8 pr-5 text-base",
      },
    },

    defaultVariants: {
      variant: "filled",
      size: "medium",
    },
  }
);

/**
 * Material Design 3 Split Button — Dropdown Trigger Variants (CVA)
 *
 * Applies text color, padding, the visual divider (left border), and the
 * Tailwind group name (`group/dropdown`) to the dropdown trigger segment.
 * The group name is required so that the nested state-layer span can target
 * `group-hover/dropdown:opacity-8`.
 */
export const splitButtonDropdownVariants = cva(
  [
    "group/dropdown relative inline-flex items-center justify-center cursor-pointer",
    "h-full",
    "focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2",
  ],
  {
    variants: {
      variant: {
        filled: "text-on-primary border-l border-on-primary/38",
        tonal: "text-on-secondary-container border-l border-on-secondary-container/38",
        outlined: "text-primary border-l border-outline",
      },

      size: {
        small: "px-1.5",
        medium: "px-2",
        large: "px-3",
      },
    },

    defaultVariants: {
      variant: "filled",
      size: "medium",
    },
  }
);

export type SplitButtonContainerVariants = VariantProps<typeof splitButtonContainerVariants>;
export type SplitButtonPrimaryVariants = VariantProps<typeof splitButtonPrimaryVariants>;
export type SplitButtonDropdownVariants = VariantProps<typeof splitButtonDropdownVariants>;
